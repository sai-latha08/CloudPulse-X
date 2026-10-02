# DevOps, CI/CD, Containerization & Infrastructure as Code

## 1. Containerization (Docker & Compose)

- **Frontend:** Multi-stage build (`node:20-alpine` ➔ `nginx:alpine`).
- **Backend:** `python:3.11-slim` with compiled dependency wheels.
- **Compose:** Multi-container stack running `postgres:15-alpine`, `backend`, and `frontend` on a bridge network.

```bash
docker-compose up --build
```

## 2. CI/CD Pipeline (GitHub Actions)

Located at `.github/workflows/ci.yml`:
1. **Lint & Test:** Runs Python unit tests and correlation engine evaluations via `pytest`.
2. **Build Validation:** Builds the production React TypeScript bundle via Vite.
3. **Container Build:** Validates multi-stage Docker builds for backend and frontend images.

## 3. Infrastructure as Code (Terraform)

Located in `terraform/`:
- Multi-AZ VPC (`10.0.0.0/16`)
- EC2 compute tier with secure security groups
- RDS PostgreSQL Multi-AZ cluster
- S3 bucket with encryption
- CloudWatch alarms
