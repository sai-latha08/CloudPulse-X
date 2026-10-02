# Security, Compliance & Governance

## 1. Authentication & Role-Based Access Control (RBAC)

CloudPulse X implements JWT-based authentication with three roles:

| Role | Permissions |
| :--- | :--- |
| **ADMIN** | Full administrative access, user management, and authorization to approve and execute remediations. |
| **ENGINEER** | Operational monitoring, incident triage, RCA inspection, security audits, and FinOps analysis. |
| **VIEWER** | Read-only compliance auditor access. |

## 2. Infrastructure Security Audits

- **IAM Least Privilege:** Flags roles with `AdministratorAccess` or wildcard `*` permissions.
- **Firewall & Security Groups:** Detects unrestricted inbound ports (Port 22 SSH, Port 3389 RDP, Port 5432 PostgreSQL) exposed to `0.0.0.0/0`.
- **S3 Bucket Guardrails:** Detects disabled Public Access Block and missing SSE-KMS customer-managed encryption.
- **Database Isolation:** Verifies RDS instances are provisioned within private subnets without public IPs.

## 3. Human-in-the-Loop Remediation Safety

Destructive actions are never triggered autonomously:
```
Detect ➔ Analyze ➔ Recommend ➔ User Approval ➔ Execute & Audit Log
```
All executed actions produce an immutable record in the `AuditLog` table.
