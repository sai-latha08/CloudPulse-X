import math
from datetime import datetime, timedelta, timezone
from typing import List, Dict, Any, Optional
from app.providers.base import CloudProvider

class DemoCloudProvider(CloudProvider):
    def __init__(self, active_scenario: str = "performance_degradation"):
        self.active_scenario = active_scenario

    def get_resources(self) -> List[Dict[str, Any]]:
        is_perf = self.active_scenario == "performance_degradation"
        is_sec = self.active_scenario == "security_misconfig"
        is_cost = self.active_scenario == "cost_anomaly"
        is_deploy_fail = self.active_scenario == "deployment_failure"

        return [
            {
                "resource_id": "alb-prod-external",
                "name": "alb-prod-external",
                "type": "alb",
                "category": "network",
                "region": "us-east-1",
                "environment": "production",
                "status": "warning" if (is_perf or is_deploy_fail) else "healthy",
                "health_score": 78.0 if is_perf else (72.0 if is_deploy_fail else 99.0),
                "cpu_utilization": 24.0,
                "memory_utilization": 38.0,
                "network_in_mb": 420.5,
                "network_out_mb": 890.2,
                "request_rate": 1850.0,
                "latency_p95_ms": 2840.0 if is_perf else (1920.0 if is_deploy_fail else 85.0),
                "error_rate": 4.8 if is_perf else (14.2 if is_deploy_fail else 0.04),
                "ip_address": "54.210.45.12",
                "instance_type": "Application Load Balancer",
                "metadata_json": {"dns_name": "prod-alb-94382.us-east-1.elb.amazonaws.com", "listeners": ["80", "443"], "target_groups": ["tg-api-prod", "tg-worker-prod"]}
            },
            {
                "resource_id": "api-server-01",
                "name": "api-server-01",
                "type": "ec2",
                "category": "compute",
                "region": "us-east-1a",
                "environment": "production",
                "status": "critical" if is_perf else ("warning" if is_sec else "healthy"),
                "health_score": 42.0 if is_perf else (68.0 if is_sec else 98.0),
                "cpu_utilization": 94.2 if is_perf else 38.5,
                "memory_utilization": 86.4 if is_perf else 52.1,
                "network_in_mb": 142.0,
                "network_out_mb": 310.4,
                "request_rate": 980.0,
                "latency_p95_ms": 2800.0 if is_perf else 110.0,
                "error_rate": 5.2 if is_perf else 0.02,
                "ip_address": "10.0.1.24",
                "instance_type": "t3.xlarge (4 vCPU, 16 GB)",
                "metadata_json": {"ami_id": "ami-0c55b159cbfafe1f0", "security_groups": ["sg-api-prod"], "deployed_version": "v2.8" if is_perf else "v2.7"}
            },
            {
                "resource_id": "api-server-02",
                "name": "api-server-02",
                "type": "ec2",
                "category": "compute",
                "region": "us-east-1b",
                "environment": "production",
                "status": "warning" if is_perf else "healthy",
                "health_score": 74.0 if is_perf else 98.5,
                "cpu_utilization": 76.8 if is_perf else 34.2,
                "memory_utilization": 71.0 if is_perf else 49.0,
                "network_in_mb": 138.0,
                "network_out_mb": 298.0,
                "request_rate": 870.0,
                "latency_p95_ms": 1950.0 if is_perf else 95.0,
                "error_rate": 2.1 if is_perf else 0.01,
                "ip_address": "10.0.2.18",
                "instance_type": "t3.xlarge (4 vCPU, 16 GB)",
                "metadata_json": {"ami_id": "ami-0c55b159cbfafe1f0", "security_groups": ["sg-api-prod"], "deployed_version": "v2.8" if is_perf else "v2.7"}
            },
            {
                "resource_id": "worker-server-01",
                "name": "worker-server-01",
                "type": "ec2",
                "category": "compute",
                "region": "us-east-1a",
                "environment": "production",
                "status": "warning" if is_cost else "healthy",
                "health_score": 88.0 if is_cost else 97.0,
                "cpu_utilization": 7.8 if is_cost else 24.5,
                "memory_utilization": 18.2 if is_cost else 36.0,
                "network_in_mb": 22.0,
                "network_out_mb": 18.5,
                "request_rate": 140.0,
                "latency_p95_ms": 45.0,
                "error_rate": 0.0,
                "ip_address": "10.0.1.88",
                "instance_type": "c5.2xlarge (8 vCPU, 16 GB)",
                "metadata_json": {"utilization_assessment": "Underutilized (<8% avg CPU)", "monthly_cost": 245.0, "savings_potential": 74.0}
            },
            {
                "resource_id": "worker-server-02",
                "name": "worker-server-02",
                "type": "ec2",
                "category": "compute",
                "region": "us-east-1b",
                "environment": "production",
                "status": "critical" if is_deploy_fail else "healthy",
                "health_score": 38.0 if is_deploy_fail else 98.0,
                "cpu_utilization": 89.4 if is_deploy_fail else 28.0,
                "memory_utilization": 96.2 if is_deploy_fail else 41.0,
                "network_in_mb": 34.0,
                "network_out_mb": 42.0,
                "request_rate": 210.0,
                "latency_p95_ms": 4200.0 if is_deploy_fail else 50.0,
                "error_rate": 18.4 if is_deploy_fail else 0.0,
                "ip_address": "10.0.2.92",
                "instance_type": "c5.2xlarge (8 vCPU, 16 GB)",
                "metadata_json": {"last_deployment": "v3.1-hotfix", "restart_count": 14 if is_deploy_fail else 0}
            },
            {
                "resource_id": "production-db",
                "name": "production-db",
                "type": "rds",
                "category": "database",
                "region": "us-east-1",
                "environment": "production",
                "status": "healthy",
                "health_score": 96.5,
                "cpu_utilization": 32.4,
                "memory_utilization": 54.0,
                "network_in_mb": 94.0,
                "network_out_mb": 180.0,
                "request_rate": 2400.0,
                "latency_p95_ms": 14.5,
                "error_rate": 0.0,
                "ip_address": "10.0.3.10",
                "instance_type": "db.r6g.2xlarge (Multi-AZ)",
                "metadata_json": {"engine": "PostgreSQL 15.4", "storage_gb": 500, "iops": 3000, "replica_status": "synced"}
            },
            {
                "resource_id": "staging-db",
                "name": "staging-db",
                "type": "rds",
                "category": "database",
                "region": "us-east-1",
                "environment": "staging",
                "status": "warning" if is_cost else "healthy",
                "health_score": 92.0,
                "cpu_utilization": 4.2,
                "memory_utilization": 16.0,
                "network_in_mb": 8.0,
                "network_out_mb": 12.0,
                "request_rate": 45.0,
                "latency_p95_ms": 18.0,
                "error_rate": 0.0,
                "ip_address": "10.0.3.55",
                "instance_type": "db.r6g.xlarge",
                "metadata_json": {"engine": "PostgreSQL 15.4", "storage_gb": 250, "optimization_candidate": True, "savings_potential": 115.0}
            },
            {
                "resource_id": "application-assets",
                "name": "application-assets",
                "type": "s3",
                "category": "storage",
                "region": "us-east-1",
                "environment": "production",
                "status": "critical" if is_sec else "healthy",
                "health_score": 45.0 if is_sec else 99.8,
                "cpu_utilization": 0.0,
                "memory_utilization": 0.0,
                "network_in_mb": 85.0,
                "network_out_mb": 420.0,
                "request_rate": 350.0,
                "latency_p95_ms": 25.0,
                "error_rate": 0.0,
                "ip_address": "s3.amazonaws.com",
                "instance_type": "S3 Standard",
                "metadata_json": {"public_access_block": not is_sec, "server_side_encryption": not is_sec, "object_count": 482000, "size_gb": 1840}
            },
            {
                "resource_id": "backup-storage",
                "name": "backup-storage",
                "type": "s3",
                "category": "storage",
                "region": "us-east-1",
                "environment": "production",
                "status": "healthy",
                "health_score": 99.9,
                "cpu_utilization": 0.0,
                "memory_utilization": 0.0,
                "network_in_mb": 12.0,
                "network_out_mb": 2.0,
                "request_rate": 15.0,
                "latency_p95_ms": 120.0,
                "error_rate": 0.0,
                "ip_address": "s3.amazonaws.com",
                "instance_type": "S3 Glacier Flexible",
                "metadata_json": {"public_access_block": True, "server_side_encryption": "aws:kms", "object_count": 12400, "size_gb": 6400}
            },
            {
                "resource_id": "image-processing",
                "name": "image-processing",
                "type": "lambda",
                "category": "serverless",
                "region": "us-east-1",
                "environment": "production",
                "status": "healthy",
                "health_score": 97.4,
                "cpu_utilization": 35.0,
                "memory_utilization": 62.0,
                "network_in_mb": 45.0,
                "network_out_mb": 38.0,
                "request_rate": 180.0,
                "latency_p95_ms": 320.0,
                "error_rate": 0.1,
                "ip_address": "lambda.us-east-1.amazonaws.com",
                "instance_type": "Lambda (1024 MB)",
                "metadata_json": {"runtime": "Python 3.11", "timeout": 30, "concurrent_executions": 12}
            },
            {
                "resource_id": "notification-service",
                "name": "notification-service",
                "type": "lambda",
                "category": "serverless",
                "region": "us-east-1",
                "environment": "production",
                "status": "healthy",
                "health_score": 99.1,
                "cpu_utilization": 18.0,
                "memory_utilization": 28.0,
                "network_in_mb": 8.0,
                "network_out_mb": 14.0,
                "request_rate": 95.0,
                "latency_p95_ms": 115.0,
                "error_rate": 0.0,
                "ip_address": "lambda.us-east-1.amazonaws.com",
                "instance_type": "Lambda (512 MB)",
                "metadata_json": {"runtime": "Node.js 20.x", "timeout": 15, "concurrent_executions": 4}
            },
            {
                "resource_id": "vpc-main-production",
                "name": "vpc-main-production",
                "type": "vpc",
                "category": "network",
                "region": "us-east-1",
                "environment": "production",
                "status": "healthy",
                "health_score": 99.5,
                "cpu_utilization": 0.0,
                "memory_utilization": 0.0,
                "network_in_mb": 620.0,
                "network_out_mb": 1240.0,
                "request_rate": 3200.0,
                "latency_p95_ms": 2.0,
                "error_rate": 0.0,
                "ip_address": "10.0.0.0/16",
                "instance_type": "VPC Multi-AZ",
                "metadata_json": {"subnets": 6, "nat_gateways": 2, "internet_gateway": "igw-089fa2"}
            },
            {
                "resource_id": "sg-api-prod",
                "name": "sg-api-prod",
                "type": "security_group",
                "category": "network",
                "region": "us-east-1",
                "environment": "production",
                "status": "critical" if is_sec else "healthy",
                "health_score": 40.0 if is_sec else 99.0,
                "cpu_utilization": 0.0,
                "memory_utilization": 0.0,
                "network_in_mb": 0.0,
                "network_out_mb": 0.0,
                "request_rate": 0.0,
                "latency_p95_ms": 0.0,
                "error_rate": 0.0,
                "ip_address": "Security Group",
                "instance_type": "VPC Security Group",
                "metadata_json": {
                    "inbound_rules_count": 5,
                    "public_ssh_exposed": is_sec,
                    "inbound_rules": [
                        {"protocol": "tcp", "port": 443, "source": "0.0.0.0/0", "description": "HTTPS Public"},
                        {"protocol": "tcp", "port": 22, "source": "0.0.0.0/0" if is_sec else "10.0.0.0/16", "description": "SSH Management (Exposed)" if is_sec else "SSH Internal"}
                    ]
                }
            }
        ]

    def get_resource_metrics(self, resource_id: str, time_range: str = "24h") -> Dict[str, Any]:
        # Generate mathematically accurate time-series curves based on the scenario
        points_count = 24 if time_range == "24h" else (60 if time_range == "1h" else (36 if time_range == "6h" else 28))
        interval_minutes = 60 if time_range == "24h" else (1 if time_range == "1h" else (10 if time_range == "6h" else 360))
        
        now = datetime.now(timezone.utc)
        cpu_series = []
        memory_series = []
        network_series = []
        request_series = []
        latency_series = []
        error_series = []

        is_affected_resource = (resource_id in ["api-server-01", "api-server-02", "alb-prod-external"])
        is_perf = self.active_scenario == "performance_degradation"
        is_deploy_fail = self.active_scenario == "deployment_failure"

        # The spike event occurred around 80% through the timeline
        spike_index = int(points_count * 0.75)

        for i in range(points_count):
            t = now - timedelta(minutes=(points_count - 1 - i) * interval_minutes)
            t_str = t.strftime("%H:%M" if time_range in ["1h", "6h", "24h"] else "%b %d %H:%M")

            # Base values with subtle natural wave
            wave = math.sin(i * 0.3) * 3.0
            
            if is_affected_resource and (is_perf or is_deploy_fail) and i >= spike_index:
                # Post-incident elevated levels
                progress = (i - spike_index) / max(1, (points_count - spike_index))
                cpu_val = min(98.5, 42.0 + progress * 52.0 + wave)
                mem_val = min(92.0, 48.0 + progress * 38.0 + wave * 0.5)
                req_val = 1400.0 + progress * 600.0 + wave * 20.0
                p50_val = 180.0 + progress * 850.0
                p95_val = 320.0 + progress * 2480.0
                p99_val = 650.0 + progress * 4200.0
                err_val = min(16.5, 0.02 + progress * (5.2 if is_perf else 14.8))
                net_in = 180.0 + progress * 160.0
                net_out = 380.0 + progress * 320.0
            else:
                # Normal baseline metrics
                cpu_val = max(12.0, 36.0 + wave)
                mem_val = max(30.0, 48.0 + wave * 0.4)
                req_val = max(500.0, 950.0 + wave * 40.0)
                p50_val = max(25.0, 42.0 + wave * 2.0)
                p95_val = max(60.0, 95.0 + wave * 4.0)
                p99_val = max(110.0, 180.0 + wave * 8.0)
                err_val = max(0.0, 0.03 + (wave * 0.005))
                net_in = max(40.0, 95.0 + wave * 5.0)
                net_out = max(90.0, 210.0 + wave * 10.0)

            cpu_series.append({"timestamp": t_str, "value": round(cpu_val, 1)})
            memory_series.append({"timestamp": t_str, "value": round(mem_val, 1)})
            network_series.append({"timestamp": t_str, "network_in": round(net_in, 1), "network_out": round(net_out, 1)})
            request_series.append({"timestamp": t_str, "value": round(req_val, 0)})
            latency_series.append({"timestamp": t_str, "p50": round(p50_val, 1), "p95": round(p95_val, 1), "p99": round(p99_val, 1)})
            error_series.append({"timestamp": t_str, "value": round(err_val, 2)})

        return {
            "resource_id": resource_id,
            "resource_name": resource_id,
            "time_range": time_range,
            "cpu_series": cpu_series,
            "memory_series": memory_series,
            "network_series": network_series,
            "request_rate_series": request_series,
            "latency_series": latency_series,
            "error_rate_series": error_series,
            "current_summary": {
                "avg_cpu": round(sum(p["value"] for p in cpu_series) / len(cpu_series), 1),
                "peak_cpu": round(max(p["value"] for p in cpu_series), 1),
                "avg_latency_p95": round(sum(p["p95"] for p in latency_series) / len(latency_series), 1),
                "max_latency_p99": round(max(p["p99"] for p in latency_series), 1),
                "total_requests": int(sum(p["value"] for p in request_series)),
                "avg_error_rate": round(sum(p["value"] for p in error_series) / len(error_series), 2)
            }
        }

    def get_security_findings(self) -> List[Dict[str, Any]]:
        is_sec = self.active_scenario == "security_misconfig"

        findings = [
            {
                "finding_code": "SEC-301",
                "title": "Public SSH Port (22) Exposed to Internet",
                "severity": "critical" if is_sec else "low",
                "category": "security_group",
                "resource_id": "sg-api-prod",
                "resource_name": "sg-api-prod (api-server-01)",
                "description": "Security group contains an inbound rule allowing TCP port 22 from 0.0.0.0/0 without CIDR restriction.",
                "evidence": "Inbound Rule: Port 22 -> Source: 0.0.0.0/0 (Internet Gateway bound)",
                "recommendation": "Restrict SSH ingress strictly to authorized bastion VPN IP subnet (10.0.0.0/16) or AWS Systems Manager Session Manager.",
                "status": "open" if is_sec else "remediated"
            },
            {
                "finding_code": "SEC-302",
                "title": "S3 Bucket Public Read Access & Missing SSE-KMS",
                "severity": "critical" if is_sec else "low",
                "category": "s3",
                "resource_id": "application-assets",
                "resource_name": "s3://application-assets",
                "description": "Bucket public access block is disabled and objects are not encrypted with customer-managed AWS KMS keys.",
                "evidence": "PublicAccessBlockConfiguration: BlockPublicAcls=False, ServerSideEncryption=None",
                "recommendation": "Enable S3 Block Public Access and mandate SSE-KMS encryption with key rotation policy.",
                "status": "open" if is_sec else "remediated"
            },
            {
                "finding_code": "SEC-303",
                "title": "IAM Role with Overly Permissive Wildcard (AdministratorAccess)",
                "severity": "high",
                "category": "iam",
                "resource_id": "iam-role-api-executor",
                "resource_name": "Role: CloudPulseAPIExecutorRole",
                "description": "Application execution IAM role contains 'Action: *' on 'Resource: *' instead of scoped least-privilege permissions.",
                "evidence": "Attached Policy: arn:aws:iam::aws:policy/AdministratorAccess",
                "recommendation": "Replace wildcard policy with specific CloudWatch, S3, and RDS scoped least-privilege IAM statements.",
                "status": "open"
            },
            {
                "finding_code": "SEC-304",
                "title": "RDS Database Publicly Accessible Flag Set to False",
                "severity": "low",
                "category": "infrastructure",
                "resource_id": "production-db",
                "resource_name": "production-db (Multi-AZ)",
                "description": "Database instance is correctly provisioned in private isolated subnets without public internet gateway.",
                "evidence": "PubliclyAccessible=False, SubnetGroup=vpc-private-db-subnets",
                "recommendation": "Maintain private subnet topology and enforce TLS 1.3 for all client connections.",
                "status": "remediated"
            },
            {
                "finding_code": "SEC-305",
                "title": "Unrestricted Inbound ICMP Ping Echo Request",
                "severity": "medium",
                "category": "security_group",
                "resource_id": "sg-api-prod",
                "resource_name": "sg-api-prod",
                "description": "ICMP protocol allows external network probes and reconnaissance sweeps.",
                "evidence": "Inbound Rule: Type 8 Code 0 (Echo Request) from 0.0.0.0/0",
                "recommendation": "Disable external ICMP echo requests or restrict to corporate network monitoring probes.",
                "status": "open"
            }
        ]
        return findings

    def get_cost_data(self) -> Dict[str, Any]:
        is_cost = self.active_scenario == "cost_anomaly"

        return {
            "monthly_estimated": 2842.0 if not is_cost else 3480.0,
            "current_month": 1820.0,
            "previous_month": 2690.0,
            "potential_savings": 428.0 if not is_cost else 795.0,
            "cost_efficiency_score": 78.0 if is_cost else 91.5,
            "by_service": {
                "EC2 Compute": 1340.0 if not is_cost else 1720.0,
                "RDS Database": 890.0,
                "S3 Storage": 280.0,
                "Lambda Serverless": 95.0,
                "Data Transfer & NAT": 237.0 if not is_cost else 495.0
            },
            "by_environment": {
                "Production": 2180.0,
                "Staging": 510.0 if not is_cost else 940.0,
                "Development": 152.0
            },
            "cost_trend": [
                {"month": "May", "cost": 2410.0, "budget": 3000.0},
                {"month": "Jun", "cost": 2520.0, "budget": 3000.0},
                {"month": "Jul", "cost": 2610.0, "budget": 3000.0},
                {"month": "Aug", "cost": 2690.0, "budget": 3000.0},
                {"month": "Sep", "cost": 2780.0, "budget": 3000.0},
                {"month": "Oct (Proj.)", "cost": 2842.0 if not is_cost else 3480.0, "budget": 3000.0}
            ],
            "optimizations": [
                {
                    "resource_id": "worker-server-01",
                    "resource_name": "worker-server-01 (c5.2xlarge)",
                    "service_name": "EC2",
                    "current_cost": 245.0,
                    "recommended_cost": 122.5,
                    "monthly_savings": 122.5,
                    "utilization_rate": 7.8,
                    "observation": "Average CPU utilization remained below 8% for 14 consecutive days.",
                    "recommended_action": "Rightsize from c5.2xlarge to c5.large or convert to AWS Graviton (c7g.large) with Spot scaling."
                },
                {
                    "resource_id": "staging-db",
                    "resource_name": "staging-db (db.r6g.xlarge)",
                    "service_name": "RDS",
                    "current_cost": 210.0,
                    "recommended_cost": 95.0,
                    "monthly_savings": 115.0,
                    "utilization_rate": 4.2,
                    "observation": "Staging database has near-zero queries outside of business hours (09:00-18:00 EST).",
                    "recommended_action": "Downsize to db.t4g.medium and schedule automated stop/start outside business hours."
                },
                {
                    "resource_id": "vol-08492bf9",
                    "resource_name": "Unattached EBS gp3 Volume (500GB)",
                    "service_name": "EBS",
                    "current_cost": 48.0,
                    "recommended_cost": 0.0,
                    "monthly_savings": 48.0,
                    "utilization_rate": 0.0,
                    "observation": "EBS volume detached from decommissioned test node since 22 days ago.",
                    "recommended_action": "Take final snapshot and terminate unattached volume."
                },
                {
                    "resource_id": "nat-gw-prod-02",
                    "resource_name": "Secondary Idle NAT Gateway",
                    "service_name": "VPC",
                    "current_cost": 65.0,
                    "recommended_cost": 0.0,
                    "monthly_savings": 65.0,
                    "utilization_rate": 2.1,
                    "observation": "Secondary AZ NAT Gateway processing < 100MB/day while primary carries all traffic.",
                    "recommended_action": "Consolidate egress via single NAT gateway or route S3/DynamoDB traffic through VPC Endpoints."
                }
            ],
            "provider_mode": "demo"
        }

    def execute_remediation(self, action_type: str, target_resource_id: str, simulation_mode: bool = True) -> Dict[str, Any]:
        """Simulate or execute cloud remediation."""
        now_str = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
        
        actions_map = {
            "rollback_deployment": {
                "title": "Rollback Deployment v2.8 to Stable v2.7",
                "details": f"Triggered rolling container image rollback from sha256:v2.8 to verified stable sha256:v2.7. Drained connections on target instances {target_resource_id}.",
                "health_impact": "+42% health improvement",
                "duration_seconds": 12
            },
            "scale_out": {
                "title": f"Auto-scale Compute Fleet ({target_resource_id})",
                "details": f"Added 2 target instances in us-east-1a and us-east-1b to Auto Scaling Group. Rebalanced traffic via ALB target groups.",
                "health_impact": "Latency reduced by 68%",
                "duration_seconds": 25
            },
            "restrict_security_group": {
                "title": f"Revoke Public SSH (0.0.0.0/0:22) on {target_resource_id}",
                "details": f"Successfully revoked rule 0.0.0.0/0:22 on {target_resource_id}. Bound SSH ingress to bastion VPC subnet 10.0.0.0/16.",
                "health_impact": "Security score increased to 98%",
                "duration_seconds": 4
            },
            "enable_s3_encryption": {
                "title": f"Enforce S3 Block Public Access & KMS SSE on {target_resource_id}",
                "details": f"Enabled S3 PublicAccessBlock on bucket {target_resource_id} and applied DefaultEncryption using KMS key arn:aws:kms:us-east-1:123456789:key/cloudpulse-s3.",
                "health_impact": "Critical risk eliminated",
                "duration_seconds": 6
            },
            "restart_service": {
                "title": f"Graceful Service Restart on {target_resource_id}",
                "details": f"Executed systemctl graceful restart of application worker daemon. Cleared stuck thread pool and recycled connection pools.",
                "health_impact": "Memory utilization normalized to 38%",
                "duration_seconds": 15
            },
            "rightsize_instance": {
                "title": f"Rightsize EC2 Instance ({target_resource_id})",
                "details": f"Modified instance type from c5.2xlarge to c5.large. Saved $74/month in cloud infrastructure costs.",
                "health_impact": "Cost efficiency score +8 points",
                "duration_seconds": 30
            }
        }

        action_data = actions_map.get(action_type, {
            "title": f"Custom Remediation: {action_type}",
            "details": f"Executed automated remediation workflow for {target_resource_id}.",
            "health_impact": "Operations stabilized",
            "duration_seconds": 10
        })

        return {
            "action_type": action_type,
            "target_resource_id": target_resource_id,
            "title": action_data["title"],
            "status": "Executed (Simulated)" if simulation_mode else "Executed (Live)",
            "simulation_mode": simulation_mode,
            "timestamp": now_str,
            "details": action_data["details"],
            "impact": action_data["health_impact"],
            "execution_duration_sec": action_data["duration_seconds"]
        }
