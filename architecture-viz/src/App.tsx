import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useReactFlow,
  Edge,
  addEdge,
  Node,
  MarkerType,
  getConnectedEdges,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './components/CustomNode';

interface ArchitectureNodeData {
  label: string;
  description: string;
  category: 'cli' | 'api' | 'parser' | 'engine' | 'service' | 'storage' | 'ui' | 'external';
  metrics?: Record<string, string>;
  technologies?: string[];
  status?: 'stable' | 'beta' | 'alpha';
  repoPath?: string;
}

interface ArchitectureNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: ArchitectureNodeData;
}

interface ArchitectureEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  label?: string;
  data?: { protocol?: string; description?: string };
}

const architectureNodes: ArchitectureNode[] = [
  { id: 'cli', type: 'customNode', position: { x: 100, y: 100 }, data: { label: 'CLI Commands', description: 'Main entry point: breakdown, diff, output, comment, mcp, configure, auth', category: 'cli', metrics: { Commands: '12', Flags: '45+' }, technologies: ['Cobra', 'Viper'], status: 'stable', repoPath: 'cmd/infracost/' } },
  { id: 'mcp-cli', type: 'customNode', position: { x: 100, y: 250 }, data: { label: 'MCP Server (stdio)', description: 'Model Context Protocol server for local AI agents (Claude Code, Cursor)', category: 'cli', metrics: { Tools: '7', Transports: '1' }, technologies: ['JSON-RPC 2.0', 'stdio'], status: 'beta', repoPath: 'internal/mcp/server.go' } },
  { id: 'config', type: 'customNode', position: { x: 350, y: 100 }, data: { label: 'Config Manager', description: 'Configuration from env vars, config file, CLI flags; Cloud settings sync', category: 'api', metrics: { Sources: '5', Settings: '30+' }, technologies: ['Viper', 'YAML'], status: 'stable', repoPath: 'internal/config/' } },
  { id: 'auth', type: 'customNode', position: { x: 350, y: 200 }, data: { label: 'Auth & API Client', description: 'API key management, pricing API client, dashboard API client', category: 'api', metrics: { Endpoints: '8', Cache: 'TTL-based' }, technologies: ['HTTP/2', 'Retry Logic'], status: 'stable', repoPath: 'internal/apiclient/' } },
  { id: 'tf-parser', type: 'customNode', position: { x: 600, y: 50 }, data: { label: 'Terraform Parser', description: 'HCL parsing, Terragrunt support, plan JSON, state JSON, reference resolution', category: 'parser', metrics: { Resources: '300+', Providers: '3' }, technologies: ['HCL2', 'go-terraform'], status: 'stable', repoPath: 'internal/providers/terraform/' } },
  { id: 'cfn-parser', type: 'customNode', position: { x: 600, y: 175 }, data: { label: 'CloudFormation Parser', description: 'CloudFormation template parsing with intrinsic functions', category: 'parser', metrics: { Resources: '200+', Functions: '15+' }, technologies: ['goformation'], status: 'stable', repoPath: 'internal/providers/cloudformation/' } },
  { id: 'k8s-parser', type: 'customNode', position: { x: 600, y: 300 }, data: { label: 'Kubernetes Parser', description: 'K8s manifest parsing, Helm chart support, Kustomize', category: 'parser', metrics: { Kinds: '50+', CRDs: 'Supported' }, technologies: ['controller-runtime', 'kustomize'], status: 'beta', repoPath: 'internal/providers/kubernetes/' } },
  { id: 'cost-engine', type: 'customNode', position: { x: 850, y: 150 }, data: { label: 'Cost Calculation Engine', description: 'Resource cost components, usage estimation, monthly/hourly aggregation', category: 'engine', metrics: { Components: '500+', Currencies: '20+' }, technologies: ['decimal', 'concurrent'], status: 'stable', repoPath: 'internal/schema/, internal/prices/' } },
  { id: 'usage-estimator', type: 'customNode', position: { x: 850, y: 275 }, data: { label: 'Usage Estimator', description: 'Default usage values, estimation functions, usage file parsing', category: 'engine', metrics: { Resources: '200+', Defaults: 'Per-resource' }, technologies: ['YAML', 'JSON'], status: 'stable', repoPath: 'internal/usage/, internal/schema/usage_data.go' } },
  { id: 'africa-regions', type: 'customNode', position: { x: 1100, y: 50 }, data: { label: 'African Cloud Regions', description: 'AWS af-south-1, Azure southafrica-north/west, GCP africa-south1', category: 'service', metrics: { Regions: '5', Providers: '3' }, technologies: ['Go', 'Region Mapping'], status: 'stable', repoPath: 'internal/africa/regions.go' } },
  { id: 'africa-currency', type: 'customNode', position: { x: 1100, y: 175 }, data: { label: 'African Currency Support', description: '10 African currencies (NGN, KES, ZAR, GHS, UGX, XOF, XAF, EGP, MAD, TZS) with live rates', category: 'service', metrics: { Currencies: '10', Cache: '24h' }, technologies: ['exchangerate.host', 'decimal'], status: 'stable', repoPath: 'internal/africa/currency.go' } },
  { id: 'mobile-money', type: 'customNode', position: { x: 1100, y: 300 }, data: { label: 'Mobile Money Cost Models', description: 'M-Pesa, MTN MoMo, Airtel Money, Orange Money, Wave, EcoCash - 12+ providers', category: 'service', metrics: { Providers: '12+', TxTypes: '8' }, technologies: ['Go', 'Tiered Pricing'], status: 'beta', repoPath: 'internal/africa/mobile_money.go' } },
  { id: 'anomaly-detector', type: 'customNode', position: { x: 850, y: 400 }, data: { label: 'Cost Anomaly Detector', description: 'Z-score, IQR, gradual creep, unused resource detection for FinOps security', category: 'service', metrics: { Algorithms: '4', Severity: '4' }, technologies: ['Go', 'Statistics'], status: 'beta', repoPath: 'internal/anomaly/detector.go' } },
  { id: 'mcp-http', type: 'customNode', position: { x: 600, y: 425 }, data: { label: 'MCP Server (HTTP/SSE)', description: 'Remote AI agent access via Server-Sent Events, session management, rate limiting', category: 'api', metrics: { Tools: '7', Transports: '2' }, technologies: ['HTTP/SSE', 'JSON-RPC 2.0'], status: 'beta', repoPath: 'internal/mcp/server.go' } },
  { id: 'benchmark', type: 'customNode', position: { x: 1100, y: 425 }, data: { label: 'Benchmark & Regression', description: 'Performance benchmarks with regression detection, CI integration', category: 'service', metrics: { Benchmarks: '8', Threshold: '5%' }, technologies: ['Go testing', 'Custom Runner'], status: 'beta', repoPath: 'internal/benchmark/benchmark.go' } },
  { id: 'pricing-api', type: 'customNode', position: { x: 850, y: 525 }, data: { label: 'Infracost Pricing API', description: 'Cloud pricing data (AWS, Azure, GCP), batch queries, caching', category: 'external', metrics: { Products: '1M+', Regions: '30+' }, technologies: ['GraphQL', 'CDN', 'Cloud'], status: 'stable', repoPath: 'external service' } },
  { id: 'output-formatter', type: 'customNode', position: { x: 600, y: 550 }, data: { label: 'Output Formatters', description: 'Table, JSON, HTML, CSV output with cost breakdowns and diffs', category: 'ui', metrics: { Formats: '5', Templates: 'Custom' }, technologies: ['Go templates', 'HTML/CSS'], status: 'stable', repoPath: 'internal/output/, cmd/infracost/output.go' } },
  { id: 'ci-cd', type: 'customNode', position: { x: 350, y: 550 }, data: { label: 'CI/CD Integration', description: 'GitHub Actions, GitLab CI, Bitbucket, Azure Repos, PR comments', category: 'ui', metrics: { Platforms: '5', Features: 'Diff, Policy' }, technologies: ['GitHub API', 'GitLab API'], status: 'stable', repoPath: 'cmd/infracost/comment*.go' } },
  { id: 'arch-viz', type: 'customNode', position: { x: 1100, y: 550 }, data: { label: 'Architecture Visualization', description: 'Interactive React Flow diagram, auto-generated from code structure', category: 'ui', metrics: { Nodes: '22', Edges: '30+' }, technologies: ['React Flow', 'TypeScript', 'Vite'], status: 'stable', repoPath: 'architecture-viz/' } },
];

const architectureEdges: ArchitectureEdge[] = [
  { id: 'e1', source: 'cli', target: 'config', type: 'smoothstep', label: 'config' },
  { id: 'e2', source: 'cli', target: 'auth', type: 'smoothstep', label: 'auth' },
  { id: 'e3', source: 'mcp-cli', target: 'config', type: 'smoothstep', label: 'config' },
  { id: 'e4', source: 'cli', target: 'tf-parser', type: 'smoothstep', label: 'parse TF' },
  { id: 'e5', source: 'cli', target: 'cfn-parser', type: 'smoothstep', label: 'parse CFN' },
  { id: 'e6', source: 'cli', target: 'k8s-parser', type: 'smoothstep', label: 'parse K8s' },
  { id: 'e7', source: 'tf-parser', target: 'cost-engine', type: 'smoothstep', label: 'resources' },
  { id: 'e8', source: 'cfn-parser', target: 'cost-engine', type: 'smoothstep', label: 'resources' },
  { id: 'e9', source: 'k8s-parser', target: 'cost-engine', type: 'smoothstep', label: 'resources' },
  { id: 'e10', source: 'cost-engine', target: 'usage-estimator', type: 'smoothstep', label: 'estimate' },
  { id: 'e11', source: 'cost-engine', target: 'africa-regions', type: 'smoothstep', label: 'region map' },
  { id: 'e12', source: 'cost-engine', target: 'africa-currency', type: 'smoothstep', label: 'convert' },
  { id: 'e13', source: 'cost-engine', target: 'mobile-money', type: 'smoothstep', label: 'model costs' },
  { id: 'e14', source: 'cost-engine', target: 'anomaly-detector', type: 'smoothstep', label: 'cost data' },
  { id: 'e15', source: 'usage-estimator', target: 'anomaly-detector', type: 'smoothstep', label: 'usage trends' },
  { id: 'e16', source: 'cli', target: 'mcp-http', type: 'smoothstep', label: 'serve' },
  { id: 'e17', source: 'mcp-http', target: 'cost-engine', type: 'smoothstep', label: 'query' },
  { id: 'e18', source: 'mcp-http', target: 'africa-currency', type: 'smoothstep', label: 'convert' },
  { id: 'e19', source: 'mcp-http', target: 'mobile-money', type: 'smoothstep', label: 'estimate' },
  { id: 'e20', source: 'mcp-http', target: 'anomaly-detector', type: 'smoothstep', label: 'detect' },
  { id: 'e21', source: 'mcp-http', target: 'benchmark', type: 'smoothstep', label: 'bench' },
  { id: 'e22', source: 'cost-engine', target: 'benchmark', type: 'smoothstep', label: 'perf test' },
  { id: 'e23', source: 'africa-currency', target: 'benchmark', type: 'smoothstep', label: 'perf test' },
  { id: 'e24', source: 'auth', target: 'pricing-api', type: 'smoothstep', label: 'API calls' },
  { id: 'e25', source: 'cost-engine', target: 'pricing-api', type: 'smoothstep', label: 'fetch prices' },
  { id: 'e26', source: 'cost-engine', target: 'output-formatter', type: 'smoothstep', label: 'format' },
  { id: 'e27', source: 'output-formatter', target: 'ci-cd', type: 'smoothstep', label: 'PR comment' },
  { id: 'e28', source: 'cli', target: 'arch-viz', type: 'smoothstep', label: 'generate' },
  { id: 'e29', source: 'mcp-cli', target: 'cost-engine', type: 'smoothstep', label: 'query' },
  { id: 'e30', source: 'mcp-cli', target: 'africa-regions', type: 'smoothstep', label: 'list' },
];

const categoryStyles: Record<string, { color: string; bgColor: string; icon: string }> = {
  cli: { color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.1)', icon: '⚡' },
  api: { color: '#06b6d4', bgColor: 'rgba(6, 182, 212, 0.1)', icon: '🔌' },
  parser: { color: '#a855f7', bgColor: 'rgba(168, 85, 247, 0.1)', icon: '📄' },
  engine: { color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.1)', icon: '⚙️' },
  service: { color: '#f97316', bgColor: 'rgba(249, 115, 22, 0.1)', icon: '🔧' },
  storage: { color: '#84cc16', bgColor: 'rgba(132, 204, 22, 0.1)', icon: '💾' },
  ui: { color: '#ec4899', bgColor: 'rgba(236, 72, 153, 0.1)', icon: '🖥️' },
  external: { color: '#64748b', bgColor: 'rgba(100, 116, 139, 0.1)', icon: '☁️' },
};

const statusStyles: Record<string, { color: string; label: string }> = {
  stable: { color: '#22c55e', label: 'Stable' },
  beta: { color: '#f97316', label: 'Beta' },
  alpha: { color: '#ef4444', label: 'Alpha' },
};

const categoryIcons: Record<string, string> = {
  cli: '⚡', api: '🔌', parser: '📄', engine: '⚙️',
  service: '🔧', storage: '💾', ui: '🖥️', external: '☁️',
};

const initialNodes: Node[] = architectureNodes.map((n) => ({
  id: n.id, type: n.type, position: n.position, data: n.data,
}));

const initialEdges: Edge[] = architectureEdges.map((e) => ({
  id: e.id, source: e.source, target: e.target, type: e.type || 'smoothstep',
  label: e.label, data: e.data,
  markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20, color: '#64748b' },
  style: { stroke: '#64748b', strokeWidth: 2 },
  labelStyle: { fill: '#94a3b8', fontSize: 11, fontWeight: 500 },
  labelBgStyle: { fill: '#1e293b', fillOpacity: 0.9, padding: 2, borderRadius: 3 },
}));

type ViewMode = 'all' | 'cli' | 'api' | 'parser' | 'engine' | 'service' | 'ui' | 'external';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showSidePanel, setShowSidePanel] = useState(true);
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const reactFlowInstance = useReactFlow();
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);

  nodesRef.current = nodes;
  edgesRef.current = edges;

  const filteredNodes = useCallback(() => {
    if (viewMode === 'all') return nodes;
    return nodes.filter((n) => (n.data as ArchitectureNodeData).category === viewMode);
  }, [nodes, viewMode]);

  const filteredEdges = useCallback(() => {
    const visibleNodeIds = new Set(filteredNodes().map((n) => n.id));
    return edges.filter((e) => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target));
  }, [edges, filteredNodes]);

  const onConnect = useCallback((connection: any) => {
    setEdges((eds: Edge[]) => addEdge({ ...connection, type: 'smoothstep', id: `e-${Date.now()}` }, eds));
  }, [setEdges]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setShowSidePanel(true);
  }, []);

  const onPaneClick = useCallback(() => { setSelectedNode(null); setShowSidePanel(false); }, []);

  const handleFitView = useCallback(() => reactFlowInstance.fitView({ padding: 0.1 }), [reactFlowInstance]);
  const handleZoomIn = useCallback(() => reactFlowInstance.zoomIn(), [reactFlowInstance]);
  const handleZoomOut = useCallback(() => reactFlowInstance.zoomOut(), [reactFlowInstance]);
  const handleReset = useCallback(() => { setNodes(initialNodes); setEdges(initialEdges); reactFlowInstance.fitView({ padding: 0.1 }); }, [reactFlowInstance]);
  const toggleSidePanel = useCallback(() => setShowSidePanel((p) => !p), []);

  const getConnectedNodes = useCallback((nodeId: string) => {
    const node = nodesRef.current.find((n) => n.id === nodeId);
    if (!node) return [];
    const connectedEdges = getConnectedEdges([node], edgesRef.current);
    const nodeIds = new Set<string>();
    connectedEdges.forEach((e) => { nodeIds.add(e.source); nodeIds.add(e.target); });
    nodeIds.delete(nodeId);
    return Array.from(nodeIds).map((id) => nodesRef.current.find((n) => n.id === id)).filter(Boolean) as Node[];
  }, []);

  const connectedNodes = selectedNode ? getConnectedNodes(selectedNode.id) : [];

  const panelMetrics = selectedNode
    ? ((selectedNode.data as ArchitectureNodeData).metrics as Record<string, string> | undefined)
    : undefined;

  return (
    <div className="app">
      <header className="header">
        <div className="header-title">
          <div className="header-logo">IE</div>
          <div>
            <h1>Infracost Enhanced Architecture</h1>
            <div className="header-subtitle">Cloud Cost Intelligence with African FinOps Support • MCP Server • Anomaly Detection</div>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={handleReset} title="Reset View">↻ Reset</button>
          <button className="btn btn-primary" onClick={toggleSidePanel}>{showSidePanel ? 'Hide' : 'Show'} Details</button>
        </div>
      </header>

      <main className="main">
        <div className="toolbar">
          <div className="toolbar-group">
            <span className="toolbar-label">View Mode</span>
            <select className="toolbar-select" value={viewMode} onChange={(e) => setViewMode(e.target.value as ViewMode)}>
              <option value="all">All Components</option>
              <option value="cli">CLI Layer</option>
              <option value="api">API & Auth</option>
              <option value="parser">Parsers</option>
              <option value="engine">Core Engine</option>
              <option value="service">Services</option>
              <option value="ui">UI & Output</option>
              <option value="external">External</option>
            </select>
          </div>
          <div style={{ flex: 1 }} />
          <div className="toolbar-group"><span className="toolbar-label">{filteredNodes().length} nodes • {filteredEdges().length} edges</span></div>
        </div>

        <div className="flow-container" onClick={onPaneClick}>
          <ReactFlow
            nodes={filteredNodes()} edges={filteredEdges()} onConnect={onConnect}
            onNodeClick={onNodeClick} onPaneClick={onPaneClick}
            nodeTypes={{ customNode: CustomNode }} fitView={false}
            attributionPosition="bottom-right" defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
          >
            <Background color="#64748b" gap={16} size={1} style={{ opacity: 0.15 }} />
            <Controls position="bottom-left" showZoom={false} showFitView={false} showInteractive={false} />
            <MiniMap position="bottom-right"
              nodeColor={(node: Node) => {
                const cat = (node.data as ArchitectureNodeData)?.category;
                return (categoryStyles as Record<string, { color: string }>)[cat]?.color || '#64748b';
              }}
              maskColor="rgba(15, 23, 42, 0.8)" />
          </ReactFlow>

          <div className="controls">
            <button className="control-btn" onClick={handleZoomIn} title="Zoom In" aria-label="Zoom In">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
            </button>
            <button className="control-btn" onClick={handleZoomOut} title="Zoom Out" aria-label="Zoom Out">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
            </button>
            <button className="control-btn" onClick={handleFitView} title="Fit View" aria-label="Fit View">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /></svg>
            </button>
          </div>

          <div className="attribution">
            <strong>Infracost Enhanced</strong> — Fork of{' '}
            <a href="https://github.com/infracost/infracost" target="_blank" rel="noopener noreferrer">infracost/infracost</a>{' '}
            (Apache-2.0) • Enhanced by George Nakisisa / GICT Africa Technologies
          </div>

          {showSidePanel && selectedNode && (
            <div className="side-panel" style={{ width: 380, position: 'absolute', right: 0, top: 0, bottom: 0, background: 'var(--bg-secondary)', borderLeft: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', zIndex: 10 }}>
              <div className="panel-header">
                <div>
                  <div className="panel-title">{(selectedNode.data as ArchitectureNodeData).label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--fg-muted)', marginTop: '0.25rem' }}>
                    {(selectedNode.data as ArchitectureNodeData).category.toUpperCase()} •{' '}
                    <span style={{ color: statusStyles[(selectedNode.data as ArchitectureNodeData).status || 'stable']?.color, fontWeight: 600 }}>
                      {statusStyles[(selectedNode.data as ArchitectureNodeData).status || 'stable']?.label}
                    </span>
                  </div>
                </div>
                <button className="panel-close" onClick={() => setShowSidePanel(false)} aria-label="Close panel">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>
              <div className="panel-content">
                {(() => {
                  if (!selectedNode) return null;
                  const data = selectedNode.data as ArchitectureNodeData;
                  return (
                    <>
                      <div className="panel-section">
                        <div className="panel-section-title">Description</div>
                        <p style={{ color: 'var(--fg-secondary)', lineHeight: 1.6, fontSize: '0.875rem' }}>{data.description}</p>
                      </div>

                      {data.repoPath && (
                        <div className="panel-section">
                          <div className="panel-section-title">Repository Path</div>
                          <code style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', wordBreak: 'break-all' }}>{data.repoPath}</code>
                        </div>
                      )}

                      {data.technologies && data.technologies.length > 0 && (
                        <div className="panel-section">
                          <div className="panel-section-title">Technologies</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                            {data.technologies.map((tech: string, i: number) => (
                              <span key={i} style={{ background: 'var(--bg-tertiary)', color: 'var(--fg-secondary)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 500 }}>{tech}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {panelMetrics && Object.keys(panelMetrics).length > 0 && (
                        <div className="panel-section">
                          <div className="panel-section-title">Metrics</div>
                          {Object.entries(panelMetrics).map(([key, value]) => (
                            <div key={key} className="panel-info-row">
                              <span className="panel-info-label">{key}</span>
                              <span className="panel-info-value">{value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  );
                })()}

                {connectedNodes.length > 0 && (
                  <div className="panel-section">
                    <div className="panel-section-title">Connected Components ({connectedNodes.length})</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {connectedNodes.map((n) => {
                        const cat = (n.data as ArchitectureNodeData).category;
                        const catStyle = (categoryStyles as Record<string, { color: string; bgColor: string }>)[cat] || categoryStyles.cli;
                        return (
                          <div key={n.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', background: 'var(--bg-tertiary)', borderRadius: '6px', borderLeft: `3px solid ${catStyle.color}`, cursor: 'pointer', transition: 'all 0.2s ease' }} onClick={() => { setSelectedNode(n); reactFlowInstance.fitView({ nodes: [n], padding: 0.2 }); }}>
                            <span style={{ width: '28px', height: '28px', borderRadius: '4px', background: catStyle.bgColor, color: catStyle.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem' }}>{categoryIcons[cat] || '•'}</span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: 500, fontSize: '0.8125rem', color: 'var(--fg-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{(n.data as ArchitectureNodeData).label}</div>
                              <div style={{ fontSize: '0.625rem', color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{cat}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="legend">
          {Object.entries(categoryStyles).map(([key, style]: [string, { color: string; bgColor: string; icon: string }]) => (
            <div key={key} className="legend-item">
              <div className="legend-color" style={{ background: style.color }} />
              <span style={{ textTransform: 'capitalize' }}>{key}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;