# Infracost Enhanced - Improvement Plan

## Original Project
**Infracost** - Cloud cost intelligence for engineers, AI coding agents, and CI/CD
- Repository: https://github.com/infracost/infracost (legacy 0.10.x CLI, active development in infracost/cli)
- Technology: Go (backend), TypeScript/Vue (dashboard), Apache-2.0 license
- Purpose: Cloud cost estimates for Terraform, CloudFormation, Kubernetes manifests

## Problems Identified

1. **No African Cloud Region Support**: Missing cost models for AWS Africa (Cape Town - af-south-1), Azure South Africa (southafrica-north), GCP Johannesburg (africa-south1)
2. **No African Currency Support**: Only USD/EUR/GBP supported; missing 10+ African currencies (NGN, KES, ZAR, GHS, UGX, XOF, XAF, EGP, MAD, TZS)
3. **No Mobile Money Cost Tracking**: No modeling of mobile money transaction costs (M-Pesa, MTN MoMo, Airtel Money, Orange Money, Vodacom M-Pesa, etc.)
4. **No AI Agent Integration (MCP)**: No Model Context Protocol server for AI agents to query cost data
5. **No Cost Anomaly Detection**: No statistical anomaly detection for FinOps security signals
6. **No Benchmark Regression Detection**: No performance benchmarking suite with regression detection
7. **No Interactive Architecture Visualization**: No React Flow based architecture documentation
8. **Limited CI/CD Security**: Missing govulncheck, SBOM generation, TruffleHog scanning, comprehensive supply chain security
9. **No African FinOps Documentation**: No case studies or guides for African cloud cost optimization

## Proposed Improvements

### 1. African Cloud Cost Models (Go)
- Add region mappings for AWS af-south-1, Azure southafrica-north, GCP africa-south1
- Implement region-specific pricing logic in pricing API client
- Add region validation and fallback logic
- Tests for each African region

### 2. Multi-Currency Support for African Currencies (Go)
- Extend currency conversion logic to support 10 African currencies
- Add exchange rate fetching with caching (using free APIs like exchangerate.host)
- Implement currency-aware cost formatting in CLI output
- Add currency configuration via CLI flags and config file
- Tests for currency conversion accuracy

### 3. Mobile Money Transaction Cost Resources (Go)
- New resource types: `mobile_money_transaction`, `mobile_money_provider`
- Providers: M-Pesa (Kenya/Tanzania/Ghana), MTN MoMo (Uganda/Ghana/South Africa), Airtel Money (Nigeria/Uganda/Kenya), Orange Money (multiple countries), Vodacom M-Pesa (Tanzania/DRC/Lesotho/Mozambique)
- Cost components: transaction fees, withdrawal fees, transfer fees, float costs
- Usage-based pricing models
- Integration with existing Terraform/CloudFormation parsers

### 4. AI-Powered Cost Anomaly Detection (Go)
- Statistical anomaly detection (Z-score, IQR, Isolation Forest) on cost time series
- Detection rules: sudden cost spikes, gradual cost creep, unused resource costs, reserved instance waste
- Integration with CI/CD pipelines as a security gate
- Configurable thresholds and notification channels
- MCP tool for querying anomalies

### 5. MCP Server Implementation (Go + TypeScript)
- stdio transport for local AI agents (Claude Code, Cursor, etc.)
- HTTP/SSE transport for remote AI agents
- Tools:
  - `get_cost_estimate` - Query cost for Terraform/CloudFormation/K8s
  - `get_african_regions` - List supported African cloud regions
  - `convert_currency` - Convert between currencies including African currencies
  - `get_mobile_money_costs` - Estimate mobile money transaction costs
  - `detect_cost_anomalies` - Run anomaly detection on cost data
  - `get_benchmark_report` - Run performance benchmarks
- Session management and rate limiting
- Authentication via API keys

### 6. Benchmark Suite with Regression Detection (Go)
- Criterion-style benchmarks for core cost calculation paths
- Benchmarks for: pricing API queries, resource parsing, cost aggregation, currency conversion, anomaly detection
- Regression detection: compare current run vs baseline (stored in repo)
- CI integration: fail build on >5% regression
- Benchmark reports as HTML/JSON artifacts

### 7. Interactive Architecture Visualization (React Flow + TypeScript)
- Frontend: React + React Flow + TypeScript
- Nodes: CLI, Pricing API, Resource Parsers (TF/CFN/K8s), Cost Engine, Currency Service, Anomaly Detector, MCP Server, Dashboard
- Edges: Data flow between components
- Interactive: Click nodes for details, expand/collapse, search
- Embedded in documentation site
- Auto-generated from code structure where possible

### 8. Comprehensive Documentation Suite
- **DESIGN_DOCUMENT.md**: Architecture, decisions, trade-offs
- **PORTFOLIO_CASE_STUDY.md**: Problem, approach, results, lessons
- **BEFORE_AFTER.md**: Detailed comparison table
- **ARCHITECTURE.md**: Interactive tree + React Flow visualization
- **MCP_GUIDE.md**: How to use MCP server with AI agents
- **AFRICAN_FINOPS_GUIDE.md**: Cloud cost optimization for African markets
- **README.md**: Professional project overview with badges

### 9. Enhanced CI/CD Pipeline (GitHub Actions)
- Go: `go vet`, `golangci-lint`, `govulncheck`, `go test -race`, `go build`
- Security: TruffleHog secret scanning, SBOM generation (Syft), dependency review
- Benchmark: Run benchmarks, compare with baseline, upload reports
- Release: Goreleaser for multi-platform binaries
- Dashboard: npm audit, TypeScript type checking, build verification

### 10. FinOps Security Hardening
- Input validation on all cost queries
- Rate limiting on MCP server
- Multi-tenant cost isolation in pricing API
- Audit logging for cost queries
- Secure defaults for CI/CD integration

## New Features

1. **African Cloud Region Support** - 3 major cloud providers, 3 African regions
2. **10 African Currencies** - NGN, KES, ZAR, GHS, UGX, XOF, XAF, EGP, MAD, TZS
3. **5+ Mobile Money Providers** - M-Pesa, MTN MoMo, Airtel Money, Orange Money, Vodacom M-Pesa
4. **MCP Server** - 6 tools, 2 transports (stdio, HTTP/SSE)
5. **Cost Anomaly Detection** - 4 detection algorithms, CI/CD integration
6. **Benchmark Regression Suite** - 15+ benchmarks, automated regression detection
7. **Interactive Architecture Viz** - React Flow, 20+ nodes, 30+ edges
8. **Comprehensive Docs** - 8+ markdown documents + interactive tree

## Security Improvements

1. **Supply Chain Security**: SBOM, govulncheck, dependency review
2. **Secret Scanning**: TruffleHog in CI, pre-commit hooks
3. **Input Validation**: All MCP tools, CLI flags, API inputs
4. **Rate Limiting**: MCP server, pricing API client
5. **Audit Logging**: Cost queries, anomaly detections, currency conversions

## Performance Improvements

1. **Concurrent Pricing Queries**: Optimize batch sizing
2. **Currency Rate Caching**: In-memory with TTL, persistent cache
3. **Benchmark Baselines**: Track performance over time
4. **Memory Profiling**: pprof integration for cost engine

## Expected Result

A production-ready, enhanced Infracost distribution (`infracost-enhanced`) that:
- Supports African cloud regions and currencies out of the box
- Models mobile money transaction costs for FinTech applications
- Provides MCP server for AI agent integration
- Includes cost anomaly detection for FinOps security
- Demonstrates benchmark regression detection
- Features interactive architecture documentation
- Has comprehensive CI/CD with supply chain security
- Includes professional documentation and case studies
- Is properly attributed to original Infracost project (Apache-2.0)

## Technology Stack

- **Backend**: Go 1.21+ (core CLI, MCP server, anomaly detection)
- **Frontend**: TypeScript, React 18, React Flow, Vite (architecture viz, dashboard)
- **Testing**: Go testing, testify, benchmark (Go); Vitest, Playwright (TypeScript)
- **CI/CD**: GitHub Actions (multi-platform Go, Node.js)
- **Security**: golangci-lint, govulncheck, TruffleHog, Syft, npm audit
- **Documentation**: Markdown, Mermaid, React Flow interactive tree
- **Distribution**: Goreleaser (Go binaries), npm/Vercel (dashboard)

## Mode

**Mode B - Substantial Enhancement Fork** (Apache-2.0 permissive license allows fork/enhancement/redistribution with attribution)