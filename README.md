# CloudPulse X

### Autonomous Cloud Reliability, Security & Intelligence Platform

> **Tagline:** *Observe. Understand. Secure. Optimize.*

---

## 1. Project Overview

**CloudPulse X** is an enterprise-grade Cloud Operations (CloudOps) and AIOps platform that unifies cloud observability, automated multi-signal correlation, root-cause analysis (RCA), security posture management, and FinOps cost optimization into a cohesive intelligence layer.

Modern cloud architectures generate disjointed signals across metrics, logs, deployments, firewall rules, and billing. When an incident occurs, engineers lose critical time manually cross-referencing dashboards. CloudPulse X correlates these signals automatically to pinpoint the probable root cause with probabilistic confidence scores, AI-assisted explanations, and human-in-the-loop remediation workflows.

---

## 2. Core Problem & Solution

| Problem in Modern CloudOps | CloudPulse X Solution |
| :--- | :--- |
| **Signal Fragmentation:** Metrics, deployments, and logs live in separate dashboards. | **Unified Intelligence:** Correlates CI/CD releases with time-series anomalies in real time. |
| **Slow MTTR (Mean Time to Resolution):** Manual inspection of logs and database states. | **AIOps Root Cause Engine:** Generates instant timeline reconstruction with verified evidence. |
| **Ungrounded AI Hallucinations:** Generic chatbots lacking real infrastructure context. | **Context-Grounded Copilot:** AI reasoning directly over live telemetry, topology, and security benchmarks. |
| **Security Misconfigurations:** Open SSH ports (0.0.0.0/0:22) and unencrypted S3 buckets. | **Continuous CIS Auditing:** Automated detection with 1-click remediation workflows. |
| **Cloud Waste & Oversizing:** Idle EC2 instances and oversized RDS databases. | **FinOps Rightsizing:** Identifies underutilized assets with exact monthly savings calculations. |

---

## 3. Architecture & Technology Stack

```
[ User Browser / Client ]
           ↓
[ React + TypeScript + Vite + Tailwind CSS (White + Peach Design System) ]
           ↓  (REST API / JWT Auth)
[ Python FastAPI Application Server ]
  ├── AIOps Multi-Signal Correlation Engine
  ├── Dynamic Health Score Calculator (0 - 100)
  ├── Security & CIS Rule Evaluator
  ├── FinOps Rightsizing & Cost Engine
  ├── CloudPulse Copilot Contextual Reasoner
  └── Cloud Provider Abstraction Layer
        ├── DemoCloudProvider (5 Interview Scenarios)
        └── AWSCloudProvider (Boto3 SDK: EC2, RDS, S3, IAM, CloudWatch)
           ↓
[ SQLAlchemy ORM ➔ PostgreSQL / SQLite ]
```

### Technologies Used

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS (Custom White + Peach palette), React Router v6, Recharts, Framer Motion, Lucide React.
- **Backend:** Python 3.11+, FastAPI, Pydantic v2, SQLAlchemy 2.0, Python-Jose (JWT), Passlib (Bcrypt), Boto3 (AWS SDK).
- **DevOps & Infrastructure:** Docker, Docker Compose, Kubernetes manifests, Terraform (modular AWS VPC, EC2, RDS, S3, CloudWatch), GitHub Actions CI/CD.

---

## 4. Key Platform Modules

1. **Executive Overview (Module 1):** Holistic Cloud Health %, active incident counts, critical security findings, monthly cost projection, potential savings, and SLA availability.
2. **Cloud Infrastructure (Module 2):** Inventory grouped by Compute (EC2), Database (RDS), Storage (S3), Serverless (Lambda), and Network (VPC/ALB) with search, filter, and detail inspection modals.
3. **Infrastructure Digital Twin (Module 3):** Node-based interactive dependency graph from Internet Ingress down to database persistence tiers.
4. **Observability Hub (Module 4):** Synchronized time-series charts for CPU, Memory, Network I/O, Request Rate, Latency percentiles (P50/P95/P99), and HTTP 5xx Error Rates across 1h, 6h, 24h, 7d windows.
5. **Incident Management Center (Module 5):** Incident queue with severity triage, symptoms, and duration tracking.
6. **Root Cause Analysis (RCA) Workspace (Module 6):** Chronological event reconstruction (Baseline ➔ Deployment v2.8 ➔ CPU Departure ➔ Latency Spike ➔ Incident Detected) with evidence matrices and confidence scores.
7. **Security Intelligence (Module 7):** Scans for open SSH ports (0.0.0.0/0:22), unencrypted S3 buckets, and overly broad IAM wildcard policies with 1-click remediation.
8. **Cost Intelligence & FinOps (Module 8):** Multi-service spend modeling and rightsizing recommendations for underutilized assets ($428 - $795/mo savings).
9. **AI Cloud Copilot (Module 9):** Context-aware conversational assistant providing structured reasoning: Summary, Evidence, Probable Cause, Impact, Recommendations, and Confidence.
10. **Controlled Remediation Center (Module 10):** Human-in-the-loop safety gate with approval, simulation execution, and immutable audit logs.
11. **Unified Event Stream (Module 11):** Real-time stream of deployments, config updates, and metric anomalies.
12. **Alerts Center (Module 12):** Threshold breach notification inbox with acknowledge and resolve workflows.

---

## 5. Live Interview Scenarios

CloudPulse X features an **Interview Demo Mode** bar at the top of the interface allowing instant switching between 5 realistic cloud infrastructure scenarios:

1. **Scenario 1 — Healthy Baseline:** All infrastructure nominal (99.4% health score, 0 incidents).
2. **Scenario 2 — API Performance Degradation & Deployment v2.8 (Default):** Deployment v2.8 introduces worker thread contention, surging CPU to 94.2% on `api-server-01`, elevating P95 latency to 2.84s, and triggering `INC-1024` with 87% confidence attribution.
3. **Scenario 3 — Critical Security Misconfiguration:** Port 22 SSH opened globally (`0.0.0.0/0`), unencrypted public S3 bucket, and wildcard IAM AdministratorAccess.
4. **Scenario 4 — Cloud Cost Anomaly & Underutilization:** `worker-server-01` idle at 7.8% CPU, oversized `staging-db`, and detached EBS volumes generating $795/mo in recoverable waste.
5. **Scenario 5 — Worker Crash Loop & Memory Exhaustion:** `worker-server-02` memory exhaustion following v3.1 hotfix causing 14 restarts and 18.4% job failures.

---

## 6. How to Run Locally

### Prerequisites
- Python 3.10+
- Node.js 18+ & npm

### Step 1: Backend Setup
```bash
# In project root
cd backend
pip install -r requirements.txt

# Run FastAPI backend (runs on http://localhost:8000)
uvicorn app.main:app --reload --port 8000
```

### Step 2: Frontend Setup
```bash
# In a new terminal
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

Open `http://localhost:5173` in your browser to access the live platform.

---

## 7. Demo Credentials

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@cloudpulse.io` | `Admin@123` | Full access + Remediation Approval |
| **DevOps Engineer** | `engineer@cloudpulse.io` | `Engineer@123` | Full monitoring, RCA, security, alerts |
| **Auditor / Viewer** | `viewer@cloudpulse.io` | `Viewer@123` | Read-only compliance access |

---

## 8. Docker & Containerized Deployment

Run the complete multi-container stack (PostgreSQL + FastAPI Backend + React Nginx Frontend) with one command:

```bash
docker-compose up --build
```
- Frontend UI: `http://localhost:3000`
- Backend API Docs: `http://localhost:8000/docs`

---

## 9. Running Tests

```bash
# Run backend pytest suite with correlation & health engine verification
python -m pytest -v
```

---

## 10. "Explain this project in an interview"

### 30-Second Elevator Pitch
> *"CloudPulse X is an autonomous CloudOps and AIOps intelligence platform. Instead of engineers having to inspect five different dashboards during an outage, CloudPulse X correlates deployment events, time-series telemetry spikes, and topology dependencies to instantly identify probable root causes with confidence scores, AI-assisted explanations, and human-in-the-loop remediation workflows."*

### 1-Minute Explanation
> *"In modern cloud architectures, teams are flooded with fragmented signals—CloudWatch metrics, deployment CI/CD events, IAM alerts, and cost spikes. When an incident occurs, answering 'What happened and what caused it?' takes valuable MTTR minutes.*
> *I built CloudPulse X to provide a unified intelligence layer. It ingests telemetry across compute, databases, and network layers, runs a deterministic correlation engine that links events like a v2.8 container deployment to CPU saturation on specific nodes, and provides an interactive Digital Twin topology map. It also includes an AI Copilot that reasons over live infrastructure data, automated security auditing for open firewalls, and controlled remediation with full audit logging."*

### 3-Minute Deep Dive
> *"1. **Architecture:** CloudPulse X uses a decoupled full-stack architecture with a React/TypeScript frontend and a Python FastAPI backend with SQLAlchemy ORM. It implements a CloudProvider abstraction supporting both a realistic generated Demo provider and live AWS Boto3 integration.*
> *2. **AIOps Correlation Engine:** Rather than isolated dashboards, our correlation engine cross-references temporal departure deltas, deployment timestamps, and dependency trees. If a latency spike follows a container rollout within 120 seconds while downstream RDS databases remain healthy, the system computes an 87% confidence root-cause attribution isolating application code contention.*
> *3. **AI Cloud Copilot:** Grounded reasoning over live telemetry rather than generic LLM hallucinations, generating structured sections: Summary, Evidence, Probable Cause, Impact, and Recommendations.*
> *4. **Human-in-the-Loop Safety:** Destructive operations are never blindly executed. CloudPulse X enforces a Detect ➔ Analyze ➔ Recommend ➔ User Approval ➔ Execute workflow with rollback strategies and immutable audit logging."*

### Technology Justification
- **React + Vite + Tailwind CSS:** Fast rendering of real-time time-series telemetry charts and interactive node topologies with type safety.
- **FastAPI + Pydantic v2:** High-performance asynchronous execution, strict input/output validation, and automatic OpenAPI schema documentation.
- **SQLAlchemy + PostgreSQL / SQLite:** Clean ORM relationships for incidents, evidence matrices, audit logs, and resources with zero-config local run capability.

### Biggest Engineering Challenge
- **Signal Correlation & Noise Reduction:** Designing the correlation engine to evaluate multiple temporal signals simultaneously without generating alert storms. Solved by implementing modular rule evaluators with confidence scoring thresholds and cross-tier health checks.

### Unique Differentiating Feature
- **Interactive Infrastructure Digital Twin with Live State Transitions:** Combining interactive dependency topology with 5 instant interview demo scenarios (Healthy, Performance Degradation, Security Misconfig, FinOps Waste, Crash Loop) allows real-time demonstration of autonomous incident detection and remediation.

---

## 11. License

This project is licensed under the MIT License.
