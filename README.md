# Infracost Enhanced

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Go Version](https://img.shields.io/badge/Go-1.21+-00ADD8?logo=go)](https://golang.org)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)](https://github.com/nakisisageorge/infracost-enhanced/actions)
[![Security](https://img.shields.io/badge/Security-govulncheck%20%7C%20TruffleHog%20%7C%20SBOM-orange)](https://github.com/nakisisageorge/infracost-enhanced/security)
[![MCP](https://img.shields.io/badge/MCP-Server%20Ready-7C3AED?logo=model-context-protocol)](https://modelcontextprotocol.io)
[![African FinOps](https://img.shields.io/badge/African%20FinOps-Supported-10B981?logo=africa)](AFRICAN_FINOPS_GUIDE.md)

> **Cloud Cost Intelligence for African Markets** — Enhanced Infracost distribution with African cloud regions, local currencies, mobile money cost modeling, MCP server for AI agents, cost anomaly detection, and interactive architecture visualization.

---

## 🚀 Quick Start

```bash
# Install (Linux/macOS)
curl -fsSL https://github.com/nakisisageorge/infracost-enhanced/releases/latest/download/infracost-linux-amd64.tar.gz | tar xz
sudo mv infracost /usr/local/bin/

# Verify
infracost --version
# Infracost Enhanced v1.0.0

# African cloud cost estimation
infracost breakdown --path ./terraform --region af-south-1 --currency NGN

# MCP Server for AI agents (Claude Code, Cursor)
infracost mcp stdio
```

---

## ✨ Key Enhancements

| Feature | Description |
|---------|-------------|
| 🌍 **African Cloud Regions** | AWS `af-south-1`, Azure `southafrica-north/west`, GCP `africa-south1` |
| 💱 **10 African Currencies** | NGN, KES, ZAR, GHS, UGX, XOF, XAF, EGP, MAD, TZS with live rates |
| 📱 **Mobile Money Cost Models** | 12+ providers (M-Pesa, MTN MoMo, Airtel, Orange, Wave, EcoCash) |
| 🤖 **MCP Server** | stdio + HTTP/SSE for AI agents (Claude Code, Cursor, Continue) |
| 🔍 **Cost Anomaly Detection** | Z-score, IQR, gradual creep, unused resources — FinOps security |
| 📊 **Benchmark Regression** | 8 benchmarks, 5% threshold, CI/CD integration |
| 🎨 **Interactive Architecture** | React Flow visualization (22 nodes, 30+ edges) |
| 📚 **Professional Docs** | Design, Case Study, Before/After, MCP Guide, African FinOps Guide |

---

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [Design Document](DESIGN_DOCUMENT.md) | Architecture, decisions, trade-offs, roadmap |
| [Portfolio Case Study](PORTFOLIO_CASE_STUDY.md) | Problem, approach, results, lessons learned |
| [Before vs After](BEFORE_AFTER.md) | Detailed feature comparison table |
| [Architecture](ARCHITECTURE.md) | Interactive React Flow + static Mermaid diagrams |
| [MCP Server Guide](MCP_GUIDE.md) | AI agent integration, tools, prompts, deployment |
| [African FinOps Guide](AFRICAN_FINOPS_GUIDE.md) | Regional best practices, compliance, reference architectures |

---

## 🌍 African Cloud Regions

```bash
# AWS Africa (Cape Town)
infracost breakdown --path ./tf --region af-south-1 --currency ZAR

# Azure South Africa
infracost breakdown --path ./tf --region southafrica-north --currency ZAR

# GCP Johannesburg
infracost breakdown --path ./tf --region africa-south1 --currency ZAR
```

| Provider | Region | Location | Currency |
|----------|--------|----------|----------|
| AWS | `af-south-1` | Cape Town | ZAR |
| Azure | `southafrica-north` | Johannesburg | ZAR |
| Azure | `southafrica-west` | Cape Town | ZAR |
| GCP | `africa-south1` | Johannesburg | ZAR |

---

## 💱 African Currencies

```bash
# Estimate costs in local currency
infracost breakdown --path ./tf --currency NGN   # Nigerian Naira
infracost breakdown --path ./tf --currency KES   # Kenyan Shilling
infracost breakdown --path ./tf --currency ZAR   # South African Rand
infracost breakdown --path ./tf --currency GHS   # Ghanaian Cedi
infracost breakdown --path ./tf --currency UGX   # Ugandan Shilling
infracost breakdown --path ./tf --currency XOF   # West African CFA Franc
infracost breakdown --path ./tf --currency XAF   # Central African CFA Franc
infracost breakdown --path ./tf --currency EGP   # Egyptian Pound
infracost breakdown --path ./tf --currency MAD   # Moroccan Dirham
infracost breakdown --path ./tf --currency TZS   # Tanzanian Shilling
```

**Features:** Live exchange rates (exchangerate.host), 24h caching, reverse rate fallback, currency-aware formatting.

---

## 📱 Mobile Money Cost Models

```bash
# Estimate mobile money transaction fees
infracost mobile-money estimate \
  --provider mpesa_kenya \
  --transaction-type p2p_transfer \
  --monthly-volume 50000 \
  --average-amount 2500 \
  --currency KES
```

**Supported Providers (12+):**
- **East Africa**: M-Pesa Kenya/Tanzania/Ghana, MTN MoMo Uganda, Airtel Kenya/Uganda, Wave Senegal
- **West Africa**: MTN MoMo Ghana, Airtel Nigeria, Orange Money Ivory Coast
- **Southern Africa**: MTN MoMo South Africa, Vodacom M-Pesa Tanzania/DRC/Lesotho/Mozambique
- **North Africa**: Orange Money Morocco, EcoCash Zimbabwe

**Transaction Types:** deposit, withdrawal, p2p_transfer, merchant_payment, airtime_purchase, bill_payment, bank_transfer, international_remit

---

## 🤖 MCP Server for AI Agents

```bash
# Local (stdio) - Claude Code, Cursor, Continue
infracost mcp stdio

# Remote (HTTP/SSE) - Web agents, custom integrations
infracost mcp http --port 8080 --api-key your-key
```

### Available Tools (7)

| Tool | Description |
|------|-------------|
| `get_cost_estimate` | Terraform/CFN/K8s cost estimation with African regions/currencies |
| `get_african_regions` | List AWS/Azure/GCP African regions |
| `convert_currency` | Multi-currency conversion (incl. 10 African currencies) |
| `get_mobile_money_costs` | Mobile money transaction cost estimation |
| `detect_cost_anomalies` | Statistical anomaly detection (Z-score, IQR, creep) |
| `get_benchmark_report` | Performance benchmarks with regression detection |
| `list_mobile_money_providers` | Provider catalog with fee structures |

### Quick Setup

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

Then ask: *"Estimate costs for my Terraform in ./infra using Kenyan Shillings"*

---

## 🔍 Cost Anomaly Detection

```bash
# Detect anomalies from cost history
infracost anomaly detect \
  --cost-data costs-history.json \
  --z-threshold 3.0 \
  --creep-threshold 0.15 \
  --format json

# CI/CD security gate
infracost anomaly detect \
  --cost-data costs.json \
  --ci-mode \
  --fail-on high
```

**Detection Algorithms:**
- **Sudden Spike**: Z-score > 3.0, IQR outlier
- **Gradual Creep**: Linear regression > 15%/month
- **Unused Resources**: All costs < $1/month over 30 days
- **Severity**: Low, Medium, High, Critical

---

## 📊 Benchmark Suite

```bash
# Run benchmarks with regression detection
infracost benchmark run --compare-baseline

# Generate HTML report
infracost benchmark report --format html
```

**Benchmarks (8):**
- CostCalculation, CurrencyConversion, AnomalyDetection, MobileMoneyCostCalc
- PricingAPIQuery, ResourceParsing, CostAggregation

**Features:** 5% regression threshold, git-tracked baselines, CI/CD integration, HTML/JSON reports.

---

## 🎨 Interactive Architecture Visualization

```bash
cd architecture-viz
npm install
npm run dev    # http://localhost:3000
npm run build  # Deploy dist/ to GitHub Pages, Vercel, Netlify
```

**Features:**
- 22 nodes across 8 categories (CLI, API, Parsers, Engine, Services, UI, External)
- 30+ edges showing data flow
- Side panel with details, connected component navigation
- 8 view modes (All, CLI, API, Parser, Engine, Service, UI, External)
- Legend, minimap, zoom controls, responsive design

**Live Demo:** https://nakisisageorge.github.io/infracost-enhanced/architecture/

---

## 🔧 Installation

### Binary Releases
```bash
# Linux AMD64
curl -fsSL https://github.com/nakisisageorge/infracost-enhanced/releases/latest/download/infracost-linux-amd64.tar.gz | tar xz
sudo mv infracost /usr/local/bin/

# Linux ARM64
curl -fsSL https://github.com/nakisisageorge/infracost-enhanced/releases/latest/download/infracost-linux-arm64.tar.gz | tar xz

# macOS AMD64
curl -fsSL https://github.com/nakisisageorge/infracost-enhanced/releases/latest/download/infracost-darwin-amd64.tar.gz | tar xz

# macOS ARM64 (Apple Silicon)
curl -fsSL https://github.com/nakisisageorge/infracost-enhanced/releases/latest/download/infracost-darwin-arm64.tar.gz | tar xz

# Windows AMD64
# Download .zip from releases page
```

### Package Managers
```bash
# Homebrew (macOS)
brew tap nakisisageorge/infracost-enhanced
brew install infracost-enhanced

# Scoop (Windows)
scoop bucket add nakisisageorge https://github.com/nakisisageorge/scoop-bucket
scoop install infracost-enhanced

# Docker
docker pull nakisisageorge/infracost-enhanced:latest
docker run --rm nakisisageorge/infracost-enhanced:latest breakdown --help
```

### From Source
```bash
git clone https://github.com/nakisisageorge/infracost-enhanced.git
cd infracost-enhanced
go build -o infracost ./cmd/infracost
```

---

## 📦 CI/CD Integration

### GitHub Actions
```yaml
# .github/workflows/finops.yml
name: FinOps Cost Check
on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  cost-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Infracost Enhanced
        run: |
          curl -fsSL https://github.com/nakisisageorge/infracost-enhanced/releases/latest/download/infracost-linux-amd64.tar.gz | tar xz
          sudo mv infracost /usr/local/bin/
      
      - name: Cost Breakdown (Local Currency)
        run: |
          infracost breakdown \
            --path ./terraform \
            --currency ${{ secrets.LOCAL_CURRENCY }} \
            --format json \
            --out-file infracost.json
        env:
          INFRACOST_API_KEY: ${{ secrets.INFRACOST_API_KEY }}
      
      - name: PR Comment with Cost
        run: |
          infracost comment github \
            --path ./terraform \
            --repo ${{ github.repository }} \
            --pull-request ${{ github.event.pull_request.number }} \
            --currency ${{ secrets.LOCAL_CURRENCY }}
        env:
          INFRACOST_API_KEY: ${{ secrets.INFRACOST_API_KEY }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Anomaly Detection Gate
```yaml
- name: FinOps Security Gate
  run: |
    infracost anomaly detect \
      --cost-data costs.json \
      --ci-mode \
      --fail-on high
```

### Benchmark Regression Gate
```yaml
- name: Performance Regression Check
  run: |
    infracost benchmark run --compare-baseline --fail-on-regression
```

---

## 🔐 Security

- **Supply Chain**: `govulncheck`, `Syft SBOM`, `TruffleHog`, `Dependency Review` in CI
- **Rate Limiting**: MCP HTTP (100 req/10sec), Pricing API (batch 1000, 16 workers)
- **Authentication**: Infracost API key + optional MCP API keys
- **Secrets**: No secrets in logs/outputs/git (pre-commit hooks)
- **Input Validation**: All MCP tools, CLI flags, API inputs validated

```bash
# Security scan
govulncheck ./...
trufflehog filesystem .
syft packages dir:. -o spdx-json=sbom.spdx.json
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Infracost Enhanced                        │
├─────────────────────────────────────────────────────────────────┤
│  CLI Layer                    │  MCP Server Layer                │
│  ├── breakdown, diff, output  │  ├── stdio (local AI)           │
│  ├── comment, configure, auth │  ├── HTTP/SSE (remote AI)       │
│  └── mcp (stdio/http)         │  ├── 7 tools, 3 resources       │
├─────────────────────────────────────────────────────────────────┤
│  Config & Auth                │  Parsers                         │
│  ├── Viper config             │  ├── Terraform (HCL2, Terragrunt)│
│  ├── API key management       │  ├── CloudFormation (goformation)│
│  ├── Pricing API client       │  └── Kubernetes (controller-runtime)│
├─────────────────────────────────────────────────────────────────┤
│  Cost Engine + Anomaly Detection    │  African Enhancements       │
│  ├── Cost components, usage         │  ├── 5 African cloud regions│
│  ├── Currency conversion            │  ├── 10 African currencies  │
│  ├── Anomaly detection (Z, IQR)     │  ├── 12+ mobile money prov. │
│  └── Benchmark regression           │  └── 8 transaction types    │
├─────────────────────────────────────────────────────────────────┤
│  External Services                                                    │
│  ├── Infracost Pricing API (AWS, Azure, GCP + African regions)      │
│  ├── Exchange Rate API (exchangerate.host, 24h cache)              │
│  └── MCP Clients (Claude Code, Cursor, Continue, custom)           │
└─────────────────────────────────────────────────────────────────┘
```

**Interactive Visualization:** [Architecture Diagram](https://nakisisageorge.github.io/infracost-enhanced/architecture/)

---

## 🧪 Testing

```bash
# Unit tests
go test ./... -short

# Integration tests
go test ./internal/... -run Integration

# Benchmark tests
go test -bench=. ./internal/benchmark/

# Security tests
govulncheck ./...
trufflehog filesystem .
```

---

## 📝 Attribution

**Original Project:** [Infracost](https://github.com/infracost/infracost) (Apache-2.0)  
**Enhanced By:** [George Nakisisa](https://github.com/nakisisageorge) / [GICT Africa Technologies](https://gictafrica.com)  
**License:** Apache-2.0 (same as original)  
**Enhancement Mode:** Mode B — Substantial Enhancement Fork

> This distribution is a substantial enhancement fork of the original Infracost (legacy 0.10.x CLI), licensed under Apache-2.0. All enhancements are additive and maintain full backward compatibility with the original CLI.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Run `go test ./...` and `golangci-lint run`
5. Submit a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## 📄 License

Apache-2.0 — See [LICENSE](LICENSE) for details.

---

## 🔗 Links

- **Repository**: https://github.com/nakisisageorge/infracost-enhanced
- **Original Infracost**: https://github.com/infracost/infracost
- **Architecture Visualization**: https://nakisisageorge.github.io/infracost-enhanced/architecture/
- **Documentation**: [Design](DESIGN_DOCUMENT.md) | [Case Study](PORTFOLIO_CASE_STUDY.md) | [Before/After](BEFORE_AFTER.md) | [Architecture](ARCHITECTURE.md) | [MCP Guide](MCP_GUIDE.md) | [African FinOps](AFRICAN_FINOPS_GUIDE.md)
- **Issues**: https://github.com/nakisisageorge/infracost-enhanced/issues
- **Discussions**: https://github.com/nakisisageorge/infracost-enhanced/discussions

---

**Built with ❤️ for African FinOps**  
George Nakisisa / GICT Africa Technologies  
Kampala, Uganda 🇺🇬