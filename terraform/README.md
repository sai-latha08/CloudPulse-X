# CloudPulse X — Terraform AWS Infrastructure Modules

This directory contains modular Terraform configuration code designed to provision a production-ready AWS cloud infrastructure.

## Module Structure

- `modules/vpc/`: Multi-AZ VPC with public subnets and isolated private database subnets.
- `modules/compute/`: EC2 compute instances and least-privilege security groups (with restricted SSH).
- `modules/rds/`: PostgreSQL Multi-AZ cluster with storage encryption enabled.
- `modules/s3/`: S3 buckets with Block Public Access and SSE-KMS default encryption.
- `modules/monitoring/`: CloudWatch metric alarms for CPU utilization and ALB P95 latency breaches.

## Usage Commands

```bash
# 1. Initialize Terraform Providers
terraform init

# 2. Plan Infrastructure Deployment
terraform plan -out=tfplan

# 3. Apply Changes (when ready to provision live AWS resources)
terraform apply tfplan

# 4. Destroy Infrastructure (when decommissioning)
terraform destroy
```
