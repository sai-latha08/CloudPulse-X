# CloudPulse Copilot & AIOps Reasoning Engine

## 1. Grounded Contextual Reasoning

CloudPulse Copilot does not hallucinate answers or generate ungrounded chat responses. Instead, it directly inspects the current infrastructure snapshot:

1. **Telemetry Extraction:** Collects active CPU, latency percentiles, error rates, and connection states.
2. **Correlation Hypothesis:** Cross-checks active incident logs (e.g. `INC-1024`) with recent deployments (e.g. `v2.8`).
3. **Structured Synthesis:** Produces structured diagnostic blocks:
   - **Summary:** Executive overview of what is occurring.
   - **Evidence:** Concrete numerical telemetry points and event timestamps.
   - **Probable Root Cause:** Logical hypothesis with probabilistic confidence scoring.
   - **Impact:** List of degraded downstream microservices.
   - **Recommendations:** Prioritized operational steps to restore SLA health.

## 2. Dynamic Interview Scenarios

1. **Scenario 1 — Healthy Baseline:** All infrastructure green (99.4% health, 0 incidents).
2. **Scenario 2 — API Performance Degradation:** Deployment v2.8 leads to 94.2% CPU spike and 2.8s latency on `api-server-01`.
3. **Scenario 3 — Security Misconfiguration:** Global port 22 SSH ingress (0.0.0.0/0) and unencrypted public S3 assets.
4. **Scenario 4 — FinOps Cost Anomaly:** Idle worker nodes at 7.8% CPU, oversized RDS databases ($795/mo savings).
5. **Scenario 5 — Worker Crash Loop:** v3.1 hotfix memory saturation and 18.4% async job failures on `worker-server-02`.
