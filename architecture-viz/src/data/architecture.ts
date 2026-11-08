export interface ArchitectureNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    description: string;
    category: 'cli' | 'api' | 'parser' | 'engine' | 'service' | 'storage' | 'ui' | 'external';
    metrics?: Record<string, string>;
    technologies?: string[];
    status?: 'stable' | 'beta' | 'alpha';
    repoPath?: string;
  };
}

export interface ArchitectureEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  label?: string;
  data?: {
    protocol?: string;
    description?: string;
  };
}

export const architectureNodes: ArchitectureNode[] = [
  // CLI Layer
  {
    id: 'cli',
    type: 'customNode',
    position: { x: 100, y: 100 },
    data: {
      label: 'CLI Commands',
      description: 'Main entry point: breakdown, diff, output, comment, mcp, configure, auth',
      category: 'cli',
      metrics: { 'Commands': '12', 'Flags': '45+' },
      technologies: ['Cobra', 'Viper'],
      status: 'stable',
      repoPath: 'cmd/infracost/',
    },
  },
  {
    id: 'mcp-cli',
    type: 'customNode',
    position: { x: 100, y: 250 },
    data: {
      label: 'MCP Server (stdio)',
      description: 'Model Context Protocol server for local AI agents (Claude Code, Cursor)',
      category: 'cli',
      metrics: { 'Tools': '7', 'Transports': '1' },
      technologies: ['JSON-RPC 2.0', 'stdio'],
      status: 'beta',
      repoPath: 'internal/mcp/server.go',
    },
  },

  // Config & Auth
  {
    id: 'config',
    type: 'customNode',
    position: { x: 350, y: 100 },
    data: {
      label: 'Config Manager',
      description: 'Configuration from env vars, config file, CLI flags; Cloud settings sync',
      category: 'api',
      metrics: { 'Sources': '5', 'Settings': '30+' },
      technologies: ['Viper', 'YAML'],
      status: 'stable',
      repoPath: 'internal/config/',
    },
  },
  {
    id: 'auth',
    type: 'customNode',
    position: { x: 350, y: 200 },
    data: {
      label: 'Auth & API Client',
      description: 'API key management, pricing API client, dashboard API client',
      category: 'api',
      metrics: { 'Endpoints': '8', 'Cache': 'TTL-based' },
      technologies: ['HTTP/2', 'Retry Logic'],
      status: 'stable',
      repoPath: 'internal/apiclient/',
    },
  },

  // Parsers
  {
    id: 'tf-parser',
    type: 'customNode',
    position: { x: 600, y: 50 },
    data: {
      label: 'Terraform Parser',
      description: 'HCL parsing, Terragrunt support, plan JSON, state JSON, reference resolution',
      category: 'parser',
      metrics: { 'Resources': '300+', 'Providers': '3' },
      technologies: ['HCL2', 'go-terraform'],
      status: 'stable',
      repoPath: 'internal/providers/terraform/',
    },
  },
  {
    id: 'cfn-parser',
    type: 'customNode',
    position: { x: 600, y: 175 },
    data: {
      label: 'CloudFormation Parser',
      description: 'CloudFormation template parsing with intrinsic functions',
      category: 'parser',
      metrics: { 'Resources': '200+', 'Functions': '15+' },
      technologies: ['goformation'],
      status: 'stable',
      repoPath: 'internal/providers/cloudformation/',
    },
  },
  {
    id: 'k8s-parser',
    type: 'customNode',
    position: { x: 600, y: 300 },
    data: {
      label: 'Kubernetes Parser',
      description: 'K8s manifest parsing, Helm chart support, Kustomize',
      category: 'parser',
      metrics: { 'Kinds': '50+', 'CRDs': 'Supported' },
      technologies: ['controller-runtime', 'kustomize'],
      status: 'beta',
      repoPath: 'internal/providers/kubernetes/',
    },
  },

  // Core Engine
  {
    id: 'cost-engine',
    type: 'customNode',
    position: { x: 850, y: 150 },
    data: {
      label: 'Cost Calculation Engine',
      description: 'Resource cost components, usage estimation, monthly/hourly aggregation',
      category: 'engine',
      metrics: { 'Components': '500+', 'Currencies': '20+' },
      technologies: ['decimal', 'concurrent'],
      status: 'stable',
      repoPath: 'internal/schema/, internal/prices/',
    },
  },
  {
    id: 'usage-estimator',
    type: 'customNode',
    position: { x: 850, y: 275 },
    data: {
      label: 'Usage Estimator',
      description: 'Default usage values, estimation functions, usage file parsing',
      category: 'engine',
      metrics: { 'Resources': '200+', 'Defaults': 'Per-resource' },
      technologies: ['YAML', 'JSON'],
      status: 'stable',
      repoPath: 'internal/usage/, internal/schema/usage_data.go',
    },
  },

  // African Enhancements
  {
    id: 'africa-regions',
    type: 'customNode',
    position: { x: 1100, y: 50 },
    data: {
      label: 'African Cloud Regions',
      description: 'AWS af-south-1, Azure southafrica-north/west, GCP africa-south1',
      category: 'service',
      metrics: { 'Regions': '5', 'Providers': '3' },
      technologies: ['Go', 'Region Mapping'],
      status: 'stable',
      repoPath: 'internal/africa/regions.go',
    },
  },
  {
    id: 'africa-currency',
    type: 'customNode',
    position: { x: 1100, y: 175 },
    data: {
      label: 'African Currency Support',
      description: '10 African currencies (NGN, KES, ZAR, GHS, UGX, XOF, XAF, EGP, MAD, TZS) with live rates',
      category: 'service',
      metrics: { 'Currencies': '10', 'Cache TTL': '24h' },
      technologies: ['exchangerate.host', 'decimal'],
      status: 'stable',
      repoPath: 'internal/africa/currency.go',
    },
  },
  {
    id: 'mobile-money',
    type: 'customNode',
    position: { x: 1100, y: 300 },
    data: {
      label: 'Mobile Money Cost Models',
      description: 'M-Pesa, MTN MoMo, Airtel Money, Orange Money, Wave, EcoCash - 12+ providers',
      category: 'service',
      metrics: { 'Providers': '12+', 'Tx Types': '8' },
      technologies: ['Go', 'Tiered Pricing'],
      status: 'beta',
      repoPath: 'internal/africa/mobile_money.go',
    },
  },

  // Anomaly Detection
  {
    id: 'anomaly-detector',
    type: 'customNode',
    position: { x: 850, y: 400 },
    data: {
      label: 'Cost Anomaly Detector',
      description: 'Z-score, IQR, gradual creep, unused resource detection for FinOps security',
      category: 'service',
      metrics: { 'Algorithms': '4', 'Severity Levels': '4' },
      technologies: ['Go', 'Statistics'],
      status: 'beta',
      repoPath: 'internal/anomaly/detector.go',
    },
  },

  // MCP Server HTTP
  {
    id: 'mcp-http',
    type: 'customNode',
    position: { x: 600, y: 425 },
    data: {
      label: 'MCP Server (HTTP/SSE)',
      description: 'Remote AI agent access via Server-Sent Events, session management, rate limiting',
      category: 'api',
      metrics: { 'Tools': '7', 'Transports': '2' },
      technologies: ['HTTP/SSE', 'JSON-RPC 2.0', 'Gorilla WebSocket'],
      status: 'beta',
      repoPath: 'internal/mcp/server.go',
    },
  },

  // Benchmarking
  {
    id: 'benchmark',
    type: 'customNode',
    position: { x: 1100, y: 425 },
    data: {
      label: 'Benchmark & Regression',
      description: 'Performance benchmarks with regression detection, CI integration',
      category: 'service',
      metrics: { 'Benchmarks': '8', 'Threshold': '5%' },
      technologies: ['Go testing', 'Custom Runner'],
      status: 'beta',
      repoPath: 'internal/benchmark/benchmark.go',
    },
  },

  // Pricing API
  {
    id: 'pricing-api',
    type: 'customNode',
    position: { x: 850, y: 525 },
    data: {
      label: 'Infracost Pricing API',
      description: 'Cloud pricing data (AWS, Azure, GCP), batch queries, caching',
      category: 'external',
      metrics: { 'Products': '1M+', 'Regions': '30+' },
      technologies: ['GraphQL', 'CDN', 'Cloud'],
      status: 'stable',
      repoPath: 'external service',
    },
  },

  // Output & Dashboard
  {
    id: 'output-formatter',
    type: 'customNode',
    position: { x: 600, y: 550 },
    data: {
      label: 'Output Formatters',
      description: 'Table, JSON, HTML, CSV output with cost breakdowns and diffs',
      category: 'ui',
      metrics: { 'Formats': '5', 'Templates': 'Custom' },
      technologies: ['Go templates', 'HTML/CSS'],
      status: 'stable',
      repoPath: 'internal/output/, cmd/infracost/output.go',
    },
  },
  {
    id: 'ci-cd',
    type: 'customNode',
    position: { x: 350, y: 550 },
    data: {
      label: 'CI/CD Integration',
      description: 'GitHub Actions, GitLab CI, Bitbucket, Azure Repos, PR comments',
      category: 'ui',
      metrics: { 'Platforms': '5', 'Features': 'Diff, Policy' },
      technologies: ['GitHub API', 'GitLab API'],
      status: 'stable',
      repoPath: 'cmd/infracost/comment*.go',
    },
  },

  // Architecture Visualization (self-referential)
  {
    id: 'arch-viz',
    type: 'customNode',
    position: { x: 1100, y: 550 },
    data: {
      label: 'Architecture Visualization',
      description: 'Interactive React Flow diagram, auto-generated from code structure',
      category: 'ui',
      metrics: { 'Nodes': '22', 'Edges': '30+' },
      technologies: ['React Flow', 'TypeScript', 'Vite'],
      status: 'stable',
      repoPath: 'architecture-viz/',
    },
  },
];

export const architectureEdges: ArchitectureEdge[] = [
  // CLI to Config/Auth
  { id: 'e1', source: 'cli', target: 'config', type: 'smoothstep', label: 'config' },
  { id: 'e2', source: 'cli', target: 'auth', type: 'smoothstep', label: 'auth' },
  { id: 'e3', source: 'mcp-cli', target: 'config', type: 'smoothstep', label: 'config' },

  // CLI to Parsers
  { id: 'e4', source: 'cli', target: 'tf-parser', type: 'smoothstep', label: 'parse TF' },
  { id: 'e5', source: 'cli', target: 'cfn-parser', type: 'smoothstep', label: 'parse CFN' },
  { id: 'e6', source: 'cli', target: 'k8s-parser', type: 'smoothstep', label: 'parse K8s' },

  // Parsers to Engine
  { id: 'e7', source: 'tf-parser', target: 'cost-engine', type: 'smoothstep', label: 'resources' },
  { id: 'e8', source: 'cfn-parser', target: 'cost-engine', type: 'smoothstep', label: 'resources' },
  { id: 'e9', source: 'k8s-parser', target: 'cost-engine', type: 'smoothstep', label: 'resources' },

  // Engine to Usage
  { id: 'e10', source: 'cost-engine', target: 'usage-estimator', type: 'smoothstep', label: 'estimate' },

  // African Enhancements
  { id: 'e11', source: 'cost-engine', target: 'africa-regions', type: 'smoothstep', label: 'region map' },
  { id: 'e12', source: 'cost-engine', target: 'africa-currency', type: 'smoothstep', label: 'convert' },
  { id: 'e13', source: 'cost-engine', target: 'mobile-money', type: 'smoothstep', label: 'model costs' },

  // Anomaly Detection
  { id: 'e14', source: 'cost-engine', target: 'anomaly-detector', type: 'smoothstep', label: 'cost data' },
  { id: 'e15', source: 'usage-estimator', target: 'anomaly-detector', type: 'smoothstep', label: 'usage trends' },

  // MCP Servers
  { id: 'e16', source: 'cli', target: 'mcp-http', type: 'smoothstep', label: 'serve' },
  { id: 'e17', source: 'mcp-http', target: 'cost-engine', type: 'smoothstep', label: 'query' },
  { id: 'e18', source: 'mcp-http', target: 'africa-currency', type: 'smoothstep', label: 'convert' },
  { id: 'e19', source: 'mcp-http', target: 'mobile-money', type: 'smoothstep', label: 'estimate' },
  { id: 'e20', source: 'mcp-http', target: 'anomaly-detector', type: 'smoothstep', label: 'detect' },
  { id: 'e21', source: 'mcp-http', target: 'benchmark', type: 'smoothstep', label: 'bench' },

  // Benchmarking
  { id: 'e22', source: 'cost-engine', target: 'benchmark', type: 'smoothstep', label: 'perf test' },
  { id: 'e23', source: 'africa-currency', target: 'benchmark', type: 'smoothstep', label: 'perf test' },

  // Pricing API
  { id: 'e24', source: 'auth', target: 'pricing-api', type: 'smoothstep', label: 'API calls' },
  { id: 'e25', source: 'cost-engine', target: 'pricing-api', type: 'smoothstep', label: 'fetch prices' },

  // Output
  { id: 'e26', source: 'cost-engine', target: 'output-formatter', type: 'smoothstep', label: 'format' },
  { id: 'e27', source: 'output-formatter', target: 'ci-cd', type: 'smoothstep', label: 'PR comment' },

  // Architecture Viz
  { id: 'e28', source: 'cli', target: 'arch-viz', type: 'smoothstep', label: 'generate' },

  // MCP stdio
  { id: 'e29', source: 'mcp-cli', target: 'cost-engine', type: 'smoothstep', label: 'query' },
  { id: 'e30', source: 'mcp-cli', target: 'africa-regions', type: 'smoothstep', label: 'list' },
];

export const categoryStyles: Record<string, { color: string; bgColor: string; icon: string }> = {
  cli: { color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.1)', icon: '⚡' },
  api: { color: '#06b6d4', bgColor: 'rgba(6, 182, 212, 0.1)', icon: '🔌' },
  parser: { color: '#a855f7', bgColor: 'rgba(168, 85, 247, 0.1)', icon: '📄' },
  engine: { color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.1)', icon: '⚙️' },
  service: { color: '#f97316', bgColor: 'rgba(249, 115, 22, 0.1)', icon: '🔧' },
  storage: { color: '#84cc16', bgColor: 'rgba(132, 204, 22, 0.1)', icon: '💾' },
  ui: { color: '#ec4899', bgColor: 'rgba(236, 72, 153, 0.1)', icon: '🖥️' },
  external: { color: '#64748b', bgColor: 'rgba(100, 116, 139, 0.1)', icon: '☁️' },
};

export const statusStyles: Record<string, { color: string; label: string }> = {
  stable: { color: '#22c55e', label: 'Stable' },
  beta: { color: '#f97316', label: 'Beta' },
  alpha: { color: '#ef4444', label: 'Alpha' },
};