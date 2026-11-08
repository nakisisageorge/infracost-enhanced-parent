# Infracost Enhanced - Design Document

## 1. Original Architecture

### 1.1 Overview
Infracost is a cloud cost estimation tool that parses Infrastructure-as-Code (Terraform, CloudFormation, Kubernetes) and estimates costs using the Infracost Pricing API.

### 1.2 Core Components
- **CLI Layer** (`cmd/infracost/`): Cobra-based CLI with commands for breakdown, diff, output, comment, configure, auth
- **Config Manager** (`internal/config/`): Viper-based configuration from env vars, files, CLI flags
- **Auth & API Client** (`internal/apiclient/`): API key management, pricing API client, dashboard API
- **Parsers** (`internal/providers/`): Terraform (HCL), CloudFormation, Kubernetes parsers
- **Cost Engine** (`internal/schema/`, `internal/prices/`): Resource cost components, usage estimation, aggregation
- **Usage Estimator** (`internal/usage/`): Default usage values, usage file parsing
- **Output Formatters** (`internal/output/`): Table, JSON, HTML, CSV output
- **CI/CD Integration** (`cmd/infracost/comment*.go`): GitHub, GitLab, Bitbucket, Azure Repos PR comments

### 1.3 Technology Stack
- **Language**: Go 1.21+
- **CLI Framework**: Cobra, Viper
- **Parsing**: HCL2, goformation, controller-runtime
- **Pricing**: GraphQL API, decimal arithmetic
- **Concurrency**: Goroutines, worker pools

## 2. Problems Identified

### 2.1 Missing African Cloud Support
- No cost models for AWS Africa (Cape Town - af-south-1)
- No support for Azure South Africa (southafrica-north, southafrica-west)
- No support for GCP Johannesburg (africa-south1)

### 2.2 No African Currency Support
- Only USD/EUR/GBP/JPY supported
- Missing 10+ African currencies (NGN, KES, ZAR, GHS, UGX, XOF, XAF, EGP, MAD, TZS)
- No live exchange rate integration

### 2.3 No Mobile Money Cost Modeling
- FinTech applications in Africa heavily use mobile money (M-Pesa, MTN MoMo, Airtel Money, etc.)
- No way to estimate transaction costs for these providers
- No tiered pricing support for volume-based fees

### 2.4 No AI Agent Integration
- No Model Context Protocol (MCP) server for AI agents
- AI coding agents (Claude Code, Cursor, etc.) cannot query cost data
- No programmatic access to cost estimation for automation

### 2.5 No Cost Anomaly Detection
- No FinOps security signals (sudden spikes, gradual creep, unused resources)
- No statistical anomaly detection (Z-score, IQR, linear regression)
- No integration with CI/CD as security gates

### 2.6 No Performance Benchmarking
- No regression detection for cost calculation performance
- No baseline tracking for CI/CD performance gates
- No benchmark reports

### 2.7 Limited Documentation
- No interactive architecture visualization
- No comprehensive design documentation
- No FinOps guides for African markets

## 3. Proposed Architecture

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Infracost Enhanced                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│  CLI Layer (Cobra)                                                          │
│  ├── breakdown, diff, output, comment, configure, auth                     │
│  ├── mcp (stdio) ──────────────────────────────────────────────────────┐   │
│  └── mcp (http/sse) ───────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────────────────┤
│  Config Manager (Viper)          │  Auth & API Client                      │
│  ├── env vars, config files      │  ├── Pricing API Client                 │
│  ├── CLI flags                   │  ├── Dashboard API Client               │
│  └── Cloud settings sync         │  └── Rate limiting, caching             │
├─────────────────────────────────────────────────────────────────────────────┤
│  Parsers                         │  African Enhancements                   │
│  ├── Terraform (HCL2, Terragrunt)│  ├── African Cloud Regions              │
│  ├── CloudFormation              │  ├── African Currency Support           │
│  └── Kubernetes                  │  ├── Mobile Money Cost Models           │
├─────────────────────────────────────────────────────────────────────────────┤
│  Cost Calculation Engine         │  Services                               │
│  ├── Resource cost components    │  ├── Cost Anomaly Detector              │
│  ├── Usage estimation            │  ├── Benchmark & Regression             │
│  ├── Monthly/hourly aggregation  │  └── MCP Server (HTTP/SSE + stdio)      │
│  └── Currency conversion         │                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│  External Services                                                         │
│  ├── Infracost Pricing API (AWS, Azure, GCP)                              │
│  ├── Exchange Rate API (exchangerate.host)                                │
│  └── MCP Clients (Claude Code, Cursor, custom agents)                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Data Flow

1. **CLI Input** → Config Manager → Parser Selection
2. **Parser** → Resource Graph → Cost Engine
3. **Cost Engine** → African Enhancements (region mapping, currency, mobile money)
4. **Cost Engine** → Pricing API (with African region support)
5. **Cost Engine** → Anomaly Detector (optional)
6. **Output Formatter** → CLI Output / CI/CD Integration / MCP Response

### 3.3 New Components

#### 3.3.1 African Cloud Regions (`internal/africa/regions.go`)
```go
var AfricanCloudRegions = map[string][]string{
    "aws":      {"af-south-1"},
    "azure":    {"southafrica-north", "southafrica-west"},
    "google":   {"africa-south1"},
}
```
- Region validation and fallback logic
- Integration with pricing API region parameter

#### 3.3.2 African Currency Support (`internal/africa/currency.go`)
```go
type CurrencyConverter struct {
    cache *ExchangeRateCache
}
```
- 10 African currencies with metadata (symbol, countries)
- Live exchange rates via exchangerate.host with 24h caching
- Currency-aware formatting for CLI output

#### 3.3.3 Mobile Money Cost Models (`internal/africa/mobile_money.go`)
```go
type MobileMoneyResource struct {
    Provider        MobileMoneyProvider
    TransactionType TransactionType
    MonthlyVolume   int64
    AverageAmount   float64
    Currency        string
    // Tiered pricing support
    TieredPricing   []TieredFee
}
```
- 12+ providers across 15+ African countries
- 8 transaction types (deposit, withdrawal, P2P, merchant, airtime, bills, bank, international)
- Tiered volume pricing support

#### 3.3.4 Cost Anomaly Detector (`internal/anomaly/detector.go`)
```go
type AnomalyDetector struct {
    config AnomalyDetectorConfig
}
```
- Z-score detection (threshold: 3.0)
- IQR outlier detection (multiplier: 1.5)
- Gradual creep detection via linear regression (threshold: 15% monthly)
- Unused resource detection (threshold: $1/month)
- Severity classification: Low, Medium, High, Critical

#### 3.3.5 MCP Server (`internal/mcp/server.go`)
- **Transports**: stdio (local), HTTP/SSE (remote)
- **Tools** (7):
  - `get_cost_estimate`: Terraform/CFN/K8s cost estimation
  - `get_african_regions`: List African cloud regions
  - `convert_currency`: Multi-currency conversion including African
  - `get_mobile_money_costs`: Mobile money transaction cost estimation
  - `detect_cost_anomalies`: Anomaly detection on cost data
  - `get_benchmark_report`: Performance benchmarks
  - `list_mobile_money_providers`: Provider catalog
- **Resources** (3): African regions, currencies, mobile money providers
- **Prompts** (2): African FinOps analysis, mobile money optimization
- Session management, rate limiting (100 req, 10/sec), API key auth

#### 3.3.6 Benchmark Suite (`internal/benchmark/benchmark.go`)
- 8 benchmarks: CostCalculation, CurrencyConversion, AnomalyDetection, MobileMoneyCostCalc, PricingAPIQuery, ResourceParsing, CostAggregation
- Regression detection (5% threshold)
- Baseline persistence, CI/CD integration
- HTML/JSON report generation

#### 3.3.7 Architecture Visualization (`architecture-viz/`)
- React Flow interactive diagram
- 22 nodes, 30+ edges across 8 categories
- Side panel with details, connected components
- View modes: All, CLI, API, Parser, Engine, Service, UI, External
- Legend, controls, minimap, attribution

## 4. Why These Changes

### 4.1 African Cloud Regions
**Rationale**: Major cloud providers have African regions but Infracost lacked pricing support. Organizations deploying to Africa need accurate cost estimates.

**Trade-off**: Requires pricing API to have data for these regions. Fallback to nearest region (eu-west-1) if unavailable.

### 4.2 African Currency Support
**Rationale**: FinOps teams in Africa need costs in local currency for budgeting, reporting, and stakeholder communication.

**Trade-off**: Exchange rate volatility. Mitigated by 24h caching and configurable refresh.

### 4.3 Mobile Money Cost Models
**Rationale**: Mobile money dominates African digital payments. FinTech applications need to estimate transaction costs for business modeling.

**Trade-off**: Fee structures change frequently. Models are configurable via usage files.

### 4.4 MCP Server
**Rationale**: AI agents are becoming primary interfaces for developers. MCP enables natural language cost queries.

**Trade-off**: Security surface area. Mitigated by rate limiting, auth, and stdio-only for local agents.

### 4.5 Cost Anomaly Detection
**Rationale**: FinOps security - cost anomalies can indicate security incidents (cryptojacking, data exfiltration, misconfiguration).

**Trade-off**: False positives. Configurable thresholds and severity levels reduce noise.

### 4.6 Benchmark Suite
**Rationale**: Performance regressions in cost calculation affect CI/CD pipeline times. Automated detection prevents degradation.

**Trade-off**: CI/CD time increase (~30s). Runs in parallel with tests.

### 4.7 Architecture Visualization
**Rationale**: Complex system understanding. Interactive diagrams beat static documentation for onboarding and architecture reviews.

**Trade-off**: Maintenance burden. Auto-generated from code structure where possible.

## 5. Technology Decisions

### 5.1 Go for Backend Enhancements
- Consistent with existing codebase
- Excellent concurrency for pricing API batching
- Strong typing for financial calculations (decimal)

### 5.2 React Flow for Visualization
- Purpose-built for node-edge diagrams
- Interactive (pan, zoom, select, expand)
- TypeScript support, active maintenance

### 5.3 exchangerate.host for Exchange Rates
- Free, no API key required
- Supports all African currencies
- Reliable CDN-backed API

### 5.4 MCP Protocol
- Open standard (Anthropic)
- Growing ecosystem (Claude Code, Cursor, Continue, etc.)
- JSON-RPC 2.0 over stdio/HTTP/SSE

### 5.5 Decimal for Financial Math
- shopspring/decimal prevents floating-point errors
- Used throughout existing codebase
- Proper rounding for currency display

## 6. Security Decisions

### 6.1 Input Validation
- All MCP tool inputs validated
- CLI flags sanitized
- Terraform/CFN parsing sandboxed

### 6.2 Rate Limiting
- MCP HTTP: 100 tokens, 10/sec refill
- Pricing API: Batch size 1000, max 16 concurrent workers
- Configurable per deployment

### 6.3 Authentication
- MCP: Optional API key auth
- CLI: Existing Infracost API key flow
- No secrets in logs or outputs

### 6.4 Supply Chain Security
- govulncheck in CI
- SBOM generation (Syft)
- TruffleHog secret scanning
- Dependency review

## 7. Performance Decisions

### 7.1 Concurrent Pricing Queries
- Worker pool: min(4, CPU*4) max 16 workers
- Batch size: 1000 resources per request
- Connection pooling for pricing API

### 7.2 Currency Rate Caching
- In-memory TTL cache (24h default)
- Background refresh on cache miss
- Persistent cache option for CI/CD

### 7.3 Benchmark Baselines
- Stored in `.benchmark_baseline.json`
- Git-tracked for regression history
- 5% ns/op threshold for alerts

## 8. Scalability Considerations

### 8.1 Horizontal Scaling
- MCP HTTP server stateless (session in memory, can externalize)
- Pricing API client stateless
- Cost engine pure functions

### 8.2 Large Terraform Projects
- Streaming parsing for large plans
- Incremental cost calculation
- Progress reporting for long runs

### 8.3 Multi-Tenant Cost Isolation
- Per-organization pricing API keys
- Cost data tagged with organization
- Anomaly detection per tenant

## 9. Deployment Architecture

### 9.1 Binary Distribution
- Goreleaser for multi-platform builds (Linux, macOS, Windows)
- Homebrew, Scoop, APT, RPM packages
- Docker images (distroless, Wolfi)

### 9.2 MCP Server Deployment
- Local: stdio transport (no deployment)
- Remote: Docker container on port 8080
- Kubernetes: Deployment + Service + Ingress

### 9.3 Architecture Viz Deployment
- Static site (Vite build)
- GitHub Pages, Vercel, Netlify, Cloudflare Pages
- Embeddable in documentation

## 10. Testing Strategy

### 10.1 Unit Tests
- All new packages: >80% coverage
- Table-driven tests for currency conversion, anomaly detection
- Mock pricing API for deterministic tests

### 10.2 Integration Tests
- CLI end-to-end with sample Terraform
- MCP protocol compliance tests
- CI/CD integration with GitHub Actions

### 10.3 Benchmark Tests
- Performance regression detection
- Memory profiling with pprof
- CI/CD gate on >5% regression

### 10.4 Security Tests
- govulncheck on every PR
- TruffleHog secret scanning
- Dependency review action

## 11. Future Improvements

### 11.1 Short Term (1-2 months)
- Azure/GCP African region pricing validation
- More mobile money providers (Moov, Paga, Chipper Cash)
- Webhook support for anomaly alerts
- Prometheus metrics endpoint

### 11.2 Medium Term (3-6 months)
- Actual cost integration (AWS CUR, Azure Cost Management, GCP Billing)
- Reserved instance optimization recommendations
- Multi-cloud cost optimization engine
- FinOps dashboard with React frontend

### 11.3 Long Term (6-12 months)
- ML-based cost forecasting
- Automated remediation (scale down, delete unused)
- Policy-as-code for cost governance
- Multi-organization SaaS offering

## 12. Appendix

### 12.1 File Structure
```
infracost-enhanced/
├── cmd/infracost/
│   ├── main.go
│   ├── mcp.go              # NEW: MCP command
│   └── ...existing commands
├── internal/
│   ├── africa/             # NEW: African enhancements
│   │   ├── regions.go
│   │   ├── currency.go
│   │   └── mobile_money.go
│   ├── anomaly/            # NEW: Anomaly detection
│   │   └── detector.go
│   ├── benchmark/          # NEW: Benchmark suite
│   │   └── benchmark.go
│   ├── mcp/                # NEW: MCP server
│   │   └── server.go
│   └── ...existing packages
├── architecture-viz/       # NEW: Interactive visualization
│   ├── src/
│   │   ├── components/CustomNode.tsx
│   │   ├── data/architecture.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── styles.css
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── docs/
│   ├── DESIGN_DOCUMENT.md
│   ├── PORTFOLIO_CASE_STUDY.md
│   ├── BEFORE_AFTER.md
│   ├── ARCHITECTURE.md
│   ├── MCP_GUIDE.md
│   └── AFRICAN_FINOPS_GUIDE.md
├── .github/workflows/
│   ├── ci.yml              # Enhanced CI
│   ├── benchmark.yml       # NEW: Benchmark workflow
│   └── release.yml         # Goreleaser release
└── README.md
```

### 12.2 Attribution
Original project: **Infracost** (https://github.com/infracost/infracost)
License: **Apache-2.0**
Enhanced by: **George Nakisisa / GICT Africa Technologies**
Enhancement license: **Apache-2.0** (same as original)