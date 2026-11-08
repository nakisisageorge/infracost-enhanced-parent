import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { categoryStyles, statusStyles } from '../data/architecture';

interface CustomNodeData {
  label: string;
  description: string;
  category: string;
  metrics?: Record<string, string>;
  technologies?: string[];
  status?: 'stable' | 'beta' | 'alpha';
  repoPath?: string;
}

const CustomNode = memo(({ data, selected }: NodeProps<CustomNodeData>) => {
  const { label, description, category, metrics, technologies, status, repoPath } = data;
  const catStyle = categoryStyles[category] || categoryStyles.cli;
  const statusStyle = statusStyles[status || 'stable'];

  return (
    <div
      className={`custom-node ${selected ? 'selected' : ''}`}
      style={{
        borderLeftColor: catStyle.color,
        borderLeftWidth: '4px',
      }}
    >
      <div className="node-header">
        <div
          className="node-icon"
          style={{
            background: catStyle.bgColor,
            color: catStyle.color,
          }}
        >
          {catStyle.icon}
        </div>
        <div style={{ flex: 1 }}>
          <div className="node-title">{label}</div>
          <span className="node-type">{category.toUpperCase()}</span>
        </div>
        <span
          style={{
            background: `${statusStyle.color}20`,
            color: statusStyle.color,
            border: `1px solid ${statusStyle.color}`,
            padding: '0.125rem 0.5rem',
            borderRadius: '4px',
            fontSize: '0.625rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {statusStyle.label}
        </span>
      </div>

      <div className="node-description">{description}</div>

      {repoPath && (
        <div style={{ fontSize: '0.625rem', color: 'var(--fg-muted)', fontFamily: 'monospace', marginBottom: '0.5rem' }}>
          {repoPath}
        </div>
      )}

      {technologies && technologies.length > 0 && (
        <div style={{ marginBottom: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
          {technologies.map((tech, i) => (
            <span
              key={i}
              style={{
                background: 'var(--bg-tertiary)',
                color: 'var(--fg-secondary)',
                padding: '0.125rem 0.375rem',
                borderRadius: '3px',
                fontSize: '0.625rem',
                fontWeight: 500,
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      {metrics && Object.keys(metrics).length > 0 && (
        <div className="node-metrics">
          {Object.entries(metrics).map(([key, value]) => (
            <div key={key} className="metric">
              <span className="metric-value">{value}</span> {key}
            </div>
          ))}
        </div>
      )}

      <Handle type="target" position={Position.Left} style={{ background: catStyle.color }} />
      <Handle type="source" position={Position.Right} style={{ background: catStyle.color }} />
    </div>
  );
});

CustomNode.displayName = 'CustomNode';

export default CustomNode;