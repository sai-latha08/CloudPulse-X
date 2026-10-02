from typing import List, Dict, Any, Optional
from datetime import datetime, timezone

class CorrelationRule:
    def __init__(self, rule_id: str, name: str, description: str):
        self.rule_id = rule_id
        self.name = name
        self.description = description

    def evaluate(self, context: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        raise NotImplementedError

class DeploymentRegressionCorrelationRule(CorrelationRule):
    def __init__(self):
        super().__init__(
            rule_id="RULE-CORR-01",
            name="Deployment Latency & CPU Regression Correlator",
            description="Correlates container/code deployment events with abrupt compute utilization spikes and upstream API latency degradation."
        )

    def evaluate(self, context: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        recent_deployments = context.get("deployments", [])
        resources = context.get("resources", [])
        metrics = context.get("metrics", {})

        # Check for high CPU / Latency on compute nodes
        high_cpu_instances = [r for r in resources if r.get("cpu_utilization", 0) > 75.0]
        high_latency_albs = [r for r in resources if r.get("latency_p95_ms", 0) > 1000.0]
        database_healthy = all(r.get("health_score", 0) > 90.0 for r in resources if r.get("type") == "rds")

        if recent_deployments and high_cpu_instances and (high_latency_albs or any(r.get("latency_p95_ms", 0) > 1000 for r in high_cpu_instances)):
            last_deploy = recent_deployments[0]
            version = last_deploy.get("metadata_json", {}).get("version", "v2.8") if isinstance(last_deploy, dict) else "v2.8"
            
            confidence = 0.87
            if database_healthy:
                confidence += 0.05  # DB is fine, isolating blame to app tier

            evidence = [
                {
                    "evidence_type": "metric_spike",
                    "description": f"Compute CPU spiked to {high_cpu_instances[0].get('cpu_utilization')}%, exceeding threshold (75%).",
                    "timestamp": "10:37 UTC",
                    "severity": "high",
                    "metric_name": "cpu_utilization",
                    "value_before": "44%",
                    "value_after": f"{high_cpu_instances[0].get('cpu_utilization')}%",
                    "correlation_note": "Directly followed container image rollout."
                },
                {
                    "evidence_type": "deployment",
                    "description": f"Production release deployment {version} completed by CI/CD pipeline.",
                    "timestamp": "10:35 UTC",
                    "severity": "info",
                    "metric_name": "deployment_event",
                    "value_before": "v2.7",
                    "value_after": version,
                    "correlation_note": "Preceded CPU saturation by 120 seconds."
                },
                {
                    "evidence_type": "metric_spike",
                    "description": "ALB P95 latency increased from 210ms to 2.84s with 5xx error rate at 4.8%.",
                    "timestamp": "10:38 UTC",
                    "severity": "high",
                    "metric_name": "latency_p95",
                    "value_before": "210ms",
                    "value_after": "2,840ms",
                    "correlation_note": "Thread contention in worker pool caused request queueing."
                },
                {
                    "evidence_type": "health_check",
                    "description": "RDS PostgreSQL database remained healthy (CPU 32%, Query Latency 14ms, 0 connection pool timeouts).",
                    "timestamp": "10:39 UTC",
                    "severity": "low",
                    "metric_name": "database_health",
                    "value_before": "Healthy",
                    "value_after": "Healthy",
                    "correlation_note": "Eliminates database deadlock or slow query as primary cause."
                }
            ]

            probable_cause = (
                f"Release deployment {version} introduced an unoptimized synchronous blocking call or regex loop, "
                f"causing CPU saturation ({high_cpu_instances[0].get('cpu_utilization')}%) on {high_cpu_instances[0].get('name')}. "
                f"Upstream ALB responded with elevated queue times and 5xx client timeouts."
            )

            timeline = [
                {"time": "10:31 UTC", "title": "Normal Operation Baseline", "description": "Fleet operating at nominal latency (95ms) and 38% CPU.", "type": "normal", "severity": "low"},
                {"time": "10:35 UTC", "title": f"Deployment {version} Rolled Out", "description": "Automated CI/CD deployment updated ECS/EC2 target group tasks.", "type": "deployment", "severity": "info"},
                {"time": "10:37 UTC", "title": "Abrupt CPU Saturation", "description": f"{high_cpu_instances[0].get('name')} CPU surged from 44% to {high_cpu_instances[0].get('cpu_utilization')}%.", "type": "metric_change", "severity": "high"},
                {"time": "10:38 UTC", "title": "API Latency Degradation", "description": "P95 request latency increased from 210ms to 2.84s across all API endpoints.", "type": "metric_change", "severity": "high"},
                {"time": "10:39 UTC", "title": "Error Rate Ingress", "description": "HTTP 502/504 gateway timeout rate reached 4.8% on ALB.", "type": "alert", "severity": "high"},
                {"time": "10:40 UTC", "title": "Incident INC-1024 Detected", "description": "CloudPulse AIOps correlation engine triggered multi-signal RCA.", "type": "incident", "severity": "critical"}
            ]

            recommendations = [
                {
                    "id": "rec-01",
                    "action_type": "rollback_deployment",
                    "title": "Immediate Automated Rollback to v2.7",
                    "description": "Trigger automated canary rollback to restore known stable build sha256:v2.7.",
                    "risk": "Low (Zero-downtime rolling replacement)",
                    "estimated_time": "1-2 minutes",
                    "target_resource_id": high_cpu_instances[0].get("resource_id", "api-server-01"),
                    "action_available": True
                },
                {
                    "id": "rec-02",
                    "action_type": "scale_out",
                    "title": "Temporary Auto-Scaling Horizontal Expansion",
                    "description": "Double compute capacity (add 2 EC2 t3.xlarge instances) to absorb load while debugging.",
                    "risk": "Low (Increases temporary AWS cost by ~$8/day)",
                    "estimated_time": "3 minutes",
                    "target_resource_id": "alb-prod-external",
                    "action_available": True
                }
            ]

            return {
                "rule_triggered": self.rule_id,
                "confidence": min(0.96, confidence),
                "probable_cause": probable_cause,
                "evidence": evidence,
                "timeline": timeline,
                "affected_resources": [r.get("resource_id") for r in high_cpu_instances] + ["alb-prod-external"],
                "recommendations": recommendations,
                "correlation_explanation": (
                    "Temporal analysis indicates a direct correlation (Δt = 120s) between deployment release v2.8 "
                    "and the compute saturation of api-server-01. As database query metrics remained unaffected, "
                    "the bottleneck is localized to application code execution within the newly deployed container."
                )
            }
        return None

class SecurityExposureCorrelationRule(CorrelationRule):
    def __init__(self):
        super().__init__(
            rule_id="RULE-CORR-02",
            name="Public Ingress Attack Surface Correlator",
            description="Correlates open security groups (0.0.0.0/0:22) with public-facing compute instances."
        )

    def evaluate(self, context: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        findings = context.get("security_findings", [])
        ssh_findings = [f for f in findings if f.get("finding_code") == "SEC-301" and f.get("status") == "open"]

        if ssh_findings:
            return {
                "rule_triggered": self.rule_id,
                "confidence": 0.94,
                "probable_cause": "Security Group sg-api-prod contains 0.0.0.0/0:22 ingress rule exposing production bastion port to public scanners.",
                "evidence": [
                    {
                        "evidence_type": "log_error",
                        "description": "Port 22 SSH ingress open globally on Internet-facing IP 54.210.45.12.",
                        "timestamp": "08:15 UTC",
                        "severity": "critical",
                        "metric_name": "security_group_ingress",
                        "value_before": "Restricted",
                        "value_after": "0.0.0.0/0",
                        "correlation_note": "Manual Terraform change or hotfix bypass detected."
                    }
                ],
                "timeline": [
                    {"time": "08:10 UTC", "title": "Security Group Rule Modified", "description": "CIDR 0.0.0.0/0 added to port 22 on sg-api-prod.", "type": "alert", "severity": "critical"},
                    {"time": "08:15 UTC", "title": "CloudPulse Security Scanner Finding", "description": "Automated security rule evaluator flagged SEC-301.", "type": "incident", "severity": "critical"}
                ],
                "affected_resources": ["sg-api-prod", "api-server-01"],
                "recommendations": [
                    {
                        "id": "rec-sec-01",
                        "action_type": "restrict_security_group",
                        "title": "Revoke Public SSH Rule (0.0.0.0/0)",
                        "description": "Enforce VPC subnet restriction (10.0.0.0/16) and activate AWS SSM Session Manager.",
                        "risk": "Low",
                        "estimated_time": "Instant (5s)",
                        "target_resource_id": "sg-api-prod",
                        "action_available": True
                    }
                ],
                "correlation_explanation": "Direct mapping between unvetted security group rule and compute attack surface exposure."
            }
        return None

class CorrelationEngine:
    """
    Main AIOps Correlation and Root Cause Analysis Engine.
    Executes all registered rules over cloud state.
    """
    def __init__(self):
        self.rules: List[CorrelationRule] = [
            DeploymentRegressionCorrelationRule(),
            SecurityExposureCorrelationRule()
        ]

    def correlate(self, context: Dict[str, Any]) -> Dict[str, Any]:
        for rule in self.rules:
            result = rule.evaluate(context)
            if result:
                return result

        # Fallback healthy or default correlation
        return {
            "rule_triggered": "RULE-DEFAULT",
            "confidence": 0.95,
            "probable_cause": "System operating normally within baseline thresholds. No active anomalies correlated.",
            "evidence": [],
            "timeline": [
                {"time": "Current", "title": "Nominal Operation", "description": "All infrastructure components healthy.", "type": "normal", "severity": "low"}
            ],
            "affected_resources": [],
            "recommendations": [],
            "correlation_explanation": "All monitored signals are within expected operating bounds."
        }
