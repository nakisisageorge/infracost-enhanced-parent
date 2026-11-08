# Infracost Enhanced - MCP Server Guide

## Overview

The Model Context Protocol (MCP) server enables AI coding agents (Claude Code, Cursor, Continue, etc.) to access Infracost functionality through natural language. The server exposes cost estimation, African FinOps data, currency conversion, mobile money modeling, anomaly detection, and benchmarking as callable tools.

## Quick Start

### Local (stdio) - For Claude Code, Cursor, Continue

```bash
# Start MCP server over stdio
infracost mcp stdio
```

Configure your AI agent:

**Claude Code** (`~/.claude/mcp_servers.json`):
```json
{
  "mcpServers": {
    "infracost": {
      "command": "infracost",
      "args": ["mcp", "stdio"]
    }
  }
}
```

**Cursor** (`~/.cursor/mcp.json`):
```json
{
  "mcpServers": {
    "infracost": {
      "command": "infracost",
      "args": ["mcp", "stdio"]
    }
  }
}
```

**Continue** (`~/.continue/config.json`):
```json
{
  "mcpServers": [
    {
      "name": "infracost",
      "command": "infracost",
      "args": ["mcp", "stdio"]
    }
  ]
}
```

### Remote (HTTP/SSE) - For Web Agents, Custom Integrations

```bash
# Start MCP server over HTTP/SSE
infracost mcp http --port 8080 --api-key your-secure-key
```

Endpoints:
- `GET /mcp/sse` - Server-Sent Events connection
- `POST /mcp/message` - JSON-RPC 2.0 messages
- `GET /mcp/tools` - List available tools
- `GET /health` - Health check

## Available Tools

### 1. `get_cost_estimate`
Estimate cloud costs from Infrastructure-as-Code.

**Parameters:**
```json
{
  "path": "/path/to/terraform",           // Required: path to IaC
  "format": "terraform",                   // Optional: terraform|cloudformation|kubernetes
  "currency": "USD",                       // Optional: USD|NGN|KES|ZAR|GHS|UGX|XOF|XAF|EGP|MAD|TZS
  "usage_file": "/path/to/usage.yml",      // Optional: Infracost usage file
  "show_skipped": false                    // Optional: show skipped resources
}
```

**Example Usage:**
> "Estimate costs for my Terraform project at ./infra in Nigerian Naira"
> "What's the monthly cost of my CloudFormation stack?"

---

### 2. `get_african_regions`
List supported African cloud regions.

**Parameters:**
```json
{
  "provider": "all"                        // Optional: aws|azure|google|all (default: all)
}
```

**Returns:** Region mappings for AWS (af-south-1), Azure (southafrica-north, southafrica-west), GCP (africa-south1).

**Example Usage:**
> "What African regions does AWS support?"
> "List all Azure regions in Africa"

---

### 3. `convert_currency`
Convert between currencies including African currencies.

**Parameters:**
```json
{
  "amount": 1000,                          // Required: amount to convert
  "from": "USD",                           // Required: source currency
  "to": "NGN"                              // Required: target currency
}
```

**Supported Currencies:** USD, EUR, GBP, JPY, NGN, KES, ZAR, GHS, UGX, XOF, XAF, EGP, MAD, TZS

**Example Usage:**
> "Convert $5000 to Kenyan Shillings"
> "What is 1,000,000 NGN in USD?"

---

### 4. `get_mobile_money_costs`
Estimate mobile money transaction costs for African providers.

**Parameters:**
```json
{
  "provider": "mpesa_kenya",               // Required: provider ID
  "transaction_type": "p2p_transfer",      // Required: deposit|withdrawal|p2p_transfer|merchant_payment|airtime_purchase|bill_payment|bank_transfer|international_remit
  "monthly_volume": 10000,                 // Required: transactions per month
  "average_amount": 5000                   // Required: average amount in local currency
}
```

**Supported Providers (12+):**
- `mpesa_kenya`, `mpesa_tanzania`, `mpesa_ghana`
- `mtn_momo_uganda`, `mtn_momo_ghana`, `mtn_momo_south_africa`
- `airtel_money_nigeria`, `airtel_money_uganda`, `airtel_money_kenya`
- `orange_money_ivory_coast`, `wave_senegal`, `ecocash_zimbabwe`

**Transaction Types:** deposit, withdrawal, p2p_transfer, merchant_payment, airtime_purchase, bill_payment, bank_transfer, international_remit

**Example Usage:**
> "Estimate M-Pesa Kenya P2P transfer costs for 10k transactions/month averaging 5000 KES"
> "What are the mobile money fees for MTN MoMo Uganda with 50k monthly withdrawals?"

---

### 5. `detect_cost_anomalies`
Run statistical anomaly detection on cost data for FinOps security.

**Parameters:**
```json
{
  "cost_data": [                           // Required: array of cost data points
    {
      "timestamp": "2024-01-15T00:00:00Z",
      "cost": 1250.00,
      "resource": "aws_instance.web",
      "provider": "aws",
      "region": "us-east-1",
      "currency": "USD"
    }
  ],
  "z_score_threshold": 3.0,              // Optional: Z-score threshold (default: 3.0)
  "creep_threshold": 0.15                // Optional: monthly growth threshold (default: 0.15)
}
```

**Detection Algorithms:**
- **Sudden Spike**: Z-score > 3.0 or IQR outlier
- **Gradual Creep**: Linear regression slope > 15%/month
- **Unused Resources**: All costs < $1/month over 30 days
- **Severity Levels**: Low, Medium, High, Critical

**Example Usage:**
> "Analyze this cost data for anomalies: [data]"
> "Run anomaly detection with Z-score threshold of 2.5"

---

### 6. `get_benchmark_report`
Run performance benchmarks with regression detection.

**Parameters:**
```json
{
  "benchmarks": ["CostCalculation", "CurrencyConversion"],  // Optional: specific benchmarks
  "compare_baseline": true                   // Optional: compare with git-tracked baseline
}
```

**Available Benchmarks:**
- `CostCalculation` - Core cost engine performance
- `CurrencyConversion` - Multi-currency conversion
- `AnomalyDetection` - Statistical detection algorithms
- `MobileMoneyCostCalc` - Mobile money fee calculations
- `PricingAPIQuery` - Pricing API batch queries
- `ResourceParsing` - Terraform/CFN/K8s parsing
- `CostAggregation` - Large resource graph aggregation

**Example Usage:**
> "Run all benchmarks and check for regressions"
> "Benchmark just the currency conversion and anomaly detection"

---

### 7. `list_mobile_money_providers`
List all supported mobile money providers with details.

**Parameters:**
```json
{
  "country": "Kenya"                       // Optional: filter by country
}
```

**Returns:** Provider name, country, currency, USSD code, website, supported transaction types.

**Example Usage:**
> "List all mobile money providers in Kenya"
> "Show me all providers supporting international remittance"

---

## Available Resources

Resources are read-only data sources accessible via URI.

### `infracost://african-regions`
African cloud region mappings with pricing availability.

### `infracost://african-currencies`
Supported African currencies with metadata (symbol, countries, ISO codes).

### `infracost://mobile-money-providers`
Mobile money provider catalog with transaction types and fee structures.

---

## Available Prompts

Prompts are reusable prompt templates for common FinOps tasks.

### `african_finops_analysis`
Generate a FinOps analysis for African cloud deployments.

**Arguments:**
- `provider` (required): Cloud provider (aws, azure, google)
- `region` (required): African region (e.g., af-south-1, southafrica-north, africa-south1)
- `currency` (required): Local currency (e.g., ZAR, NGN, KES)

**Example:**
> "Analyze FinOps for AWS in af-south-1 with ZAR"

---

### `mobile_money_cost_optimization`
Generate cost optimization recommendations for mobile money integrations.

**Arguments:**
- `provider` (required): Mobile money provider
- `monthly_volume` (required): Monthly transaction volume
- `avg_amount` (required): Average transaction amount

**Example:**
> "Optimize mobile money costs for mpesa_kenya with 50000 monthly transactions averaging 2500 KES"

---

## Integration Examples

### Claude Code
```bash
# In your project directory
infracost mcp stdio
# Then in Claude Code: "Estimate costs for my Terraform in ./infra using Kenyan Shillings"
```

### Cursor
```json
// .cursor/mcp.json
{
  "mcpServers": {
    "infracost": {
      "command": "infracost",
      "args": ["mcp", "stdio"]
    }
  }
}
```

### Custom HTTP Client (Python)
```python
import httpx
import json

async def call_infracost_mcp(tool: str, params: dict):
    async with httpx.AsyncClient() as client:
        # Connect via SSE
        async with client.stream("GET", "http://localhost:8080/mcp/sse") as sse:
            async for line in sse.aiter_lines():
                if line.startswith("event: connected"):
                    break
        
        # Send tool call
        response = await client.post(
            "http://localhost:8080/mcp/message",
            json={
                "jsonrpc": "2.0",
                "id": 1,
                "method": "tools/call",
                "params": {"name": tool, "arguments": params}
            }
        )
        return response.json()

# Usage
result = await call_infracost_mcp("get_cost_estimate", {
    "path": "./terraform",
    "currency": "NGN"
})
```

### Custom HTTP Client (JavaScript/TypeScript)
```typescript
async function callInfracostMCP(tool: string, params: Record<string, any>) {
  const response = await fetch('http://localhost:8080/mcp/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'tools/call',
      params: { name: tool, arguments: params }
    })
  });
  return response.json();
}

// Usage
const result = await callInfracostMCP('convert_currency', {
  amount: 1000,
  from: 'USD',
  to: 'KES'
});
```

---

## Authentication

### Optional API Key
```bash
# Server side
infracost mcp http --port 8080 --api-key your-secure-api-key

# Client side (include in requests)
# Header: Authorization: Bearer your-secure-api-key
# Or query param: ?api_key=your-secure-api-key
```

### Rate Limiting
- **Default**: 100 requests per 10 seconds (token bucket)
- **Configurable**: Modify `RateLimiter` in `internal/mcp/server.go`
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

---

## Deployment

### Docker
```dockerfile
# Dockerfile.mcp
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY . .
RUN go build -o infracost ./cmd/infracost

FROM alpine:3.19
COPY --from=builder /app/infracost /usr/local/bin/
EXPOSE 8080
ENTRYPOINT ["infracost", "mcp", "http", "--port", "8080"]
```

```bash
docker build -f Dockerfile.mcp -t infracost-mcp .
docker run -p 8080:8080 -e INFRACOST_API_KEY=$KEY infracost-mcp
```

### Kubernetes
```yaml
# k8s/mcp-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: infracost-mcp
spec:
  replicas: 2
  selector:
    matchLabels:
      app: infracost-mcp
  template:
    metadata:
      labels:
        app: infracost-mcp
    spec:
      containers:
      - name: mcp
        image: infracost-mcp:latest
        ports:
        - containerPort: 8080
        env:
        - name: INFRACOST_API_KEY
          valueFrom:
            secretKeyRef:
              name: infracost-secrets
              key: api-key
---
apiVersion: v1
kind: Service
metadata:
  name: infracost-mcp
spec:
  selector:
    app: infracost-mcp
  ports:
  - port: 8080
    targetPort: 8080
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: infracost-mcp
spec:
  rules:
  - host: mcp.infracost.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: infracost-mcp
            port:
              number: 8080
```

---

## Troubleshooting

### Common Issues

**"Connection refused" on stdio**
- Ensure `infracost` binary is in PATH
- Check `infracost mcp stdio` runs without errors

**"SSE connection failed" on HTTP**
- Verify server is running: `curl http://localhost:8080/health`
- Check firewall/port 8080
- Verify API key if using authentication

**"Tool not found" errors**
- List available tools: `curl http://localhost:8080/mcp/tools`
- Ensure tool name matches exactly (case-sensitive)

**"Rate limit exceeded"**
- Reduce request frequency
- Increase `RateLimiter` tokens/refill rate in server config
- Implement exponential backoff in client

### Debug Mode
```bash
# Enable debug logging
INFRACOST_LOG_LEVEL=debug infracost mcp stdio

# Generate debug report
infracost mcp stdio --debug-report
# Creates infracost-debug-report.json
```

### Logs
```bash
# Structured JSON logs
infracost mcp http --log-level debug 2>&1 | jq .

# Filter by component
infracost mcp http 2>&1 | jq 'select(.component=="mcp")'
```

---

## Extending the MCP Server

### Adding a New Tool
```go
// In internal/mcp/server.go, registerDefaultTools()
s.tools["my_new_tool"] = MCPTool{
    Name:        "my_new_tool",
    Description: "Description of what the tool does",
    InputSchema: json.RawMessage(`{
        "type": "object",
        "properties": {
            "param1": {"type": "string", "description": "Parameter description"}
        },
        "required": ["param1"]
    }`),
    Handler: func(ctx context.Context, args json.RawMessage) (interface{}, error) {
        var params struct {
            Param1 string `json:"param1"`
        }
        json.Unmarshal(args, &params)
        
        // Your logic here
        return map[string]interface{}{
            "result": "success",
            "input": params.Param1,
        }, nil
    },
}
```

### Adding a New Resource
```go
s.resources["my_resource"] = MCPResource{
    URI:         "infracost://my-resource",
    Name:        "My Resource",
    Description: "Description of the resource",
    MimeType:    "application/json",
    Handler: func(ctx context.Context) (interface{}, error) {
        return map[string]interface{}{
            "data": "resource content",
        }, nil
    },
}
```

### Adding a New Prompt
```go
s.prompts["my_prompt"] = MCPPrompt{
    Name:        "my_prompt",
    Description: "Prompt template description",
    Arguments: []PromptArgument{
        {Name: "arg1", Description: "Argument description", Required: true},
    },
    Handler: func(ctx context.Context, args map[string]string) (string, error) {
        return fmt.Sprintf("Prompt with %s", args["arg1"]), nil
    },
}
```

---

## Security Best Practices

1. **Use API Keys**: Always use `--api-key` for HTTP/SSE deployments
2. **Network Isolation**: Deploy MCP HTTP behind VPN/firewall
3. **Rate Limiting**: Configure appropriate limits for your use case
4. **Audit Logs**: Monitor `/mcp/message` access logs
5. **TLS**: Use HTTPS in production (reverse proxy with cert-manager)
6. **Input Validation**: All tool inputs validated server-side

---

## Version Compatibility

| MCP Protocol | Infracost Enhanced | Notes |
|--------------|-------------------|-------|
| 2024-11-05 | v1.0.0+ | Current stable |
| 2024-10-07 | v1.0.0+ | Backward compatible |

---

## Support

- **Documentation**: This guide + [Architecture Docs](ARCHITECTURE.md)
- **Issues**: https://github.com/nakisisageorge/infracost-enhanced/issues
- **Discussions**: https://github.com/nakisisageorge/infracost-enhanced/discussions

*MCP Server Guide for Infracost Enhanced. Part of the documentation suite.*