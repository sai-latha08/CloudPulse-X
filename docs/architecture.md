# CloudPulse X — System Architecture Documentation

## 1. Architectural Overview

CloudPulse X is engineered as a decoupled, multi-tiered cloud reliability and intelligence platform. It establishes an autonomous feedback loop over distributed cloud signals:

```
[ Telemetry & Signals ] ➔ [ Signal Ingestion Layer ] ➔ [ Correlation & Health Engine ]
                                                                ↓
[ Controlled Remediation ] 🠔 [ AI Copilot Reasoning ] 🠔 [ Structured Root Cause (RCA) ]
```

## 2. Component Layers

### 2.1 Frontend Presentation Tier (React + Vite + Tailwind CSS)
- **Design System:** Custom **White + Peach** enterprise theme with responsive layout.
- **Topology Visualizer:** Interactive SVG-based dependency graph representing real backend relations.
- **Time-Series Telemetry:** High-performance SVG charts using Recharts for CPU, Memory, Network I/O, Request Rate, Latency Percentiles (P50/P95/P99), and HTTP Error Rates.

### 2.2 Backend Application Tier (Python FastAPI)
- **FastAPI Core:** Asynchronous REST endpoints with Pydantic validation.
- **Provider Abstraction:** Implements `CloudProvider` interface allowing transparent switching between `DemoCloudProvider` and `AWSCloudProvider` (Boto3).
- **AIOps Correlation Engine:** Evaluates multi-signal temporal relationships between deployments, resource departures, and downstream health metrics.
- **Dynamic Health Scoring Engine:** Computes real-time 0-100 scores across Performance (30%), Reliability (30%), Security (25%), and Cost Efficiency (15%).

### 2.3 Persistence Tier (SQLAlchemy + PostgreSQL / SQLite)
- **Relational Schema:** Models for `Users`, `CloudResources`, `Metrics`, `Incidents`, `IncidentEvidence`, `SecurityFindings`, `CostRecords`, `CloudEvents`, `Alerts`, and `AuditLogs`.
- **Zero-Config Execution:** SQLite for immediate local development with seamless PostgreSQL production readiness.
