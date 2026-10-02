from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.models.models import (
    User, CloudResource, Incident, IncidentEvidence, SecurityFinding,
    CostRecord, CloudEvent, Alert, Remediation, AuditLog, ScenarioState
)
from app.core.security import get_password_hash
from app.providers.demo_provider import DemoCloudProvider

def seed_database(db: Session, scenario_id: str = "performance_degradation"):
    # 1. Seed Users if not present
    if db.query(User).count() == 0:
        users = [
            User(
                email="admin@cloudpulse.io",
                hashed_password=get_password_hash("Admin@123"),
                full_name="Alex Mercer (Admin)",
                role="ADMIN",
                is_active=True
            ),
            User(
                email="engineer@cloudpulse.io",
                hashed_password=get_password_hash("Engineer@123"),
                full_name="Sarah Chen (DevOps)",
                role="ENGINEER",
                is_active=True
            ),
            User(
                email="viewer@cloudpulse.io",
                hashed_password=get_password_hash("Viewer@123"),
                full_name="Taylor Jordan (Auditor)",
                role="VIEWER",
                is_active=True
            )
        ]
        db.add_all(users)
        db.commit()

    # Clear previous scenario data for resources, incidents, evidence, alerts, events, findings
    db.query(IncidentEvidence).delete()
    db.query(Incident).delete()
    db.query(CloudResource).delete()
    db.query(SecurityFinding).delete()
    db.query(CostRecord).delete()
    db.query(CloudEvent).delete()
    db.query(Alert).delete()
    db.query(Remediation).delete()
    db.commit()

    provider = DemoCloudProvider(active_scenario=scenario_id)

    # 2. Seed Resources
    raw_resources = provider.get_resources()
    for r in raw_resources:
        db_res = CloudResource(
            resource_id=r["resource_id"],
            name=r["name"],
            type=r["type"],
            category=r["category"],
            region=r["region"],
            environment=r["environment"],
            status=r["status"],
            health_score=r["health_score"],
            cpu_utilization=r["cpu_utilization"],
            memory_utilization=r["memory_utilization"],
            network_in_mb=r["network_in_mb"],
            network_out_mb=r["network_out_mb"],
            request_rate=r["request_rate"],
            latency_p95_ms=r["latency_p95_ms"],
            error_rate=r["error_rate"],
            ip_address=r["ip_address"],
            instance_type=r["instance_type"],
            metadata_json=r.get("metadata_json")
        )
        db.add(db_res)
    db.commit()

    # 3. Seed Incidents based on scenario
    now = datetime.utcnow()
    
    if scenario_id in ["performance_degradation", "healthy", "cost_anomaly", "security_misconfig"]:
        inc_status = "detected" if scenario_id == "performance_degradation" else ("investigating" if scenario_id == "security_misconfig" else "resolved")
        inc_sev = "high" if scenario_id == "performance_degradation" else ("critical" if scenario_id == "security_misconfig" else "low")
        
        inc = Incident(
            incident_code="INC-1024",
            title="API Latency Spike & Compute Saturation",
            severity=inc_sev,
            status=inc_status,
            detection_time=now - timedelta(minutes=18),
            affected_resources=["api-server-01", "alb-prod-external"],
            duration_minutes=18,
            symptoms="CPU increased from 44% to 94.2% on api-server-01. ALB P95 latency degraded from 210ms to 2.84s with 4.8% 5xx errors.",
            probable_cause="Recent container image deployment v2.8 introduced worker thread contention and synchronous loop execution.",
            confidence_score=0.87,
            impact_summary="Public client API requests experiencing severe latency. Downstream RDS database remains healthy and unstressed.",
            recommended_action="Execute zero-downtime rollback to verified container image v2.7 or temporarily auto-scale compute group.",
            mitigation_action="Automated canary rollback available in Remediation Center.",
            created_at=now - timedelta(minutes=18)
        )
        db.add(inc)
        db.commit()
        db.refresh(inc)

        evidence_list = [
            IncidentEvidence(
                incident_id=inc.id,
                evidence_type="metric_spike",
                description="CPU utilization on api-server-01 surged from 44% baseline to 94.2%.",
                timestamp="10:37 UTC",
                severity="high",
                metric_name="cpu_utilization",
                value_before="44%",
                value_after="94.2%",
                correlation_note="Directly triggered post-deployment."
            ),
            IncidentEvidence(
                incident_id=inc.id,
                evidence_type="deployment",
                description="Production deployment release v2.8 deployed via GitHub Actions pipeline.",
                timestamp="10:35 UTC",
                severity="info",
                metric_name="deployment",
                value_before="v2.7",
                value_after="v2.8",
                correlation_note="Preceded CPU departure by 120s."
            ),
            IncidentEvidence(
                incident_id=inc.id,
                evidence_type="metric_spike",
                description="Application Load Balancer P95 latency increased from 210ms to 2,840ms.",
                timestamp="10:38 UTC",
                severity="high",
                metric_name="latency_p95",
                value_before="210ms",
                value_after="2,840ms",
                correlation_note="Request queueing observed in target group."
            ),
            IncidentEvidence(
                incident_id=inc.id,
                evidence_type="health_check",
                description="PostgreSQL production-db maintained 14.5ms query response time and 32% CPU.",
                timestamp="10:39 UTC",
                severity="low",
                metric_name="database_health",
                value_before="Healthy",
                value_after="Healthy",
                correlation_note="Rules out database lockups or query degradation."
            )
        ]
        db.add_all(evidence_list)
        db.commit()

    elif scenario_id == "deployment_failure":
        inc2 = Incident(
            incident_code="INC-1025",
            title="Worker Task Crash Loop & Memory Exhaustion",
            severity="critical",
            status="detected",
            detection_time=now - timedelta(minutes=12),
            affected_resources=["worker-server-02", "alb-prod-external"],
            duration_minutes=12,
            symptoms="Memory utilization at 96.2% on worker-server-02 with 14 process restarts and 18.4% failed job submissions.",
            probable_cause="Unbounded buffer leak in v3.1 hotfix processing uncompressed payload sizes.",
            confidence_score=0.92,
            impact_summary="Background data processing queue is blocked. Ingestion workers dropping async jobs.",
            recommended_action="Restart worker daemon, drain queue to dead-letter, and roll back v3.1 hotfix.",
            mitigation_action="Service restart and rollback workflow ready.",
            created_at=now - timedelta(minutes=12)
        )
        db.add(inc2)
        db.commit()

    # 4. Seed Security Findings
    raw_findings = provider.get_security_findings()
    for f in raw_findings:
        db_f = SecurityFinding(
            finding_code=f["finding_code"],
            title=f["title"],
            severity=f["severity"],
            category=f["category"],
            resource_id=f["resource_id"],
            resource_name=f["resource_name"],
            description=f["description"],
            evidence=f["evidence"],
            recommendation=f["recommendation"],
            status=f["status"]
        )
        db.add(db_f)
    db.commit()

    # 5. Seed Cost Records
    cost_data = provider.get_cost_data()
    for s_name, cost_val in cost_data.get("by_service", {}).items():
        db_cost = CostRecord(
            service_name=s_name,
            environment="production",
            monthly_estimated=cost_val,
            current_month=cost_val * 0.65,
            previous_month=cost_val * 0.95,
            potential_savings=74.0 if "EC2" in s_name else (115.0 if "RDS" in s_name else 0.0),
            recommendation="Rightsize instances" if "EC2" in s_name else "Optimize retention",
            resource_id="worker-server-01" if "EC2" in s_name else "staging-db",
            utilization_rate=7.8 if "EC2" in s_name else 55.0
        )
        db.add(db_cost)
    db.commit()

    # 6. Seed Cloud Events
    events = [
        CloudEvent(
            event_type="incident",
            title="INC-1024: API Latency Spike Detected",
            description="Correlation engine flagged high CPU and P95 latency elevation following deployment.",
            resource_id="api-server-01",
            resource_name="api-server-01",
            severity="critical" if scenario_id == "performance_degradation" else "info",
            actor="CloudPulse AIOps Engine",
            timestamp=now - timedelta(minutes=15)
        ),
        CloudEvent(
            event_type="metric_anomaly",
            title="CPU Utilization Surge (>90%)",
            description="api-server-01 breached CPU critical threshold (94.2% sustained for 3 minutes).",
            resource_id="api-server-01",
            resource_name="api-server-01",
            severity="warning",
            actor="CloudWatch Alarms",
            timestamp=now - timedelta(minutes=17)
        ),
        CloudEvent(
            event_type="deployment",
            title="Production Release v2.8 Deployed",
            description="CI/CD pipeline deployed commit sha a98f412 (v2.8) to production compute fleet.",
            resource_id="api-server-01",
            resource_name="api-server-01",
            severity="info",
            actor="GitHub Actions (deploy-prod)",
            timestamp=now - timedelta(minutes=20),
            metadata_json={"version": "v2.8", "commit": "a98f412", "author": "devops@company.io"}
        ),
        CloudEvent(
            event_type="security_alert",
            title="Security Finding SEC-301: Public SSH Ingress",
            description="Security scanner detected open port 22 to 0.0.0.0/0 on sg-api-prod.",
            resource_id="sg-api-prod",
            resource_name="sg-api-prod",
            severity="critical" if scenario_id == "security_misconfig" else "low",
            actor="CloudPulse Security Auditor",
            timestamp=now - timedelta(hours=2)
        ),
        CloudEvent(
            event_type="config_change",
            title="Terraform Infrastructure State Applied",
            description="Terraform Cloud executed workspace run #182 updating VPC ingress rules.",
            resource_id="vpc-main-production",
            resource_name="vpc-main-production",
            severity="info",
            actor="Terraform Cloud",
            timestamp=now - timedelta(hours=4)
        )
    ]
    db.add_all(events)
    db.commit()

    # 7. Seed Alerts
    alerts = [
        Alert(
            alert_code="ALT-901",
            title="High Compute CPU Utilization (>90%)",
            message="api-server-01 CPU reached 94.2%. Sustained load may degrade API response times.",
            severity="critical" if scenario_id == "performance_degradation" else "low",
            category="performance",
            resource_id="api-server-01",
            resource_name="api-server-01",
            is_read=False,
            is_resolved=(scenario_id == "healthy"),
            timestamp=now - timedelta(minutes=16)
        ),
        Alert(
            alert_code="ALT-902",
            title="High API Latency P95 (2.84s)",
            message="ALB P95 latency breached SLA threshold (500ms) on prod-alb-94382.",
            severity="high" if scenario_id == "performance_degradation" else "low",
            category="performance",
            resource_id="alb-prod-external",
            resource_name="alb-prod-external",
            is_read=False,
            is_resolved=(scenario_id == "healthy"),
            timestamp=now - timedelta(minutes=14)
        ),
        Alert(
            alert_code="ALT-903",
            title="Public SSH Port 22 Open to World",
            message="Security Group sg-api-prod has 0.0.0.0/0:22 ingress rule active.",
            severity="critical" if scenario_id == "security_misconfig" else "medium",
            category="security",
            resource_id="sg-api-prod",
            resource_name="sg-api-prod",
            is_read=False,
            is_resolved=(scenario_id == "healthy"),
            timestamp=now - timedelta(hours=1)
        ),
        Alert(
            alert_code="ALT-904",
            title="Underutilized Compute Node Detected",
            message="worker-server-01 has averaged 7.8% CPU for 14 days. Potential waste of $74/month.",
            severity="low",
            category="cost",
            resource_id="worker-server-01",
            resource_name="worker-server-01",
            is_read=True,
            is_resolved=False,
            timestamp=now - timedelta(hours=6)
        )
    ]
    db.add_all(alerts)
    db.commit()

    # 8. Seed Remediations
    remediations = [
        Remediation(
            action_type="rollback_deployment",
            target_resource_id="api-server-01",
            target_resource_name="api-server-01 (v2.8 -> v2.7)",
            title="Rollback Deployment v2.8 to Stable v2.7",
            description="Performs zero-downtime container rolling rollback to restore stable container image build sha256:v2.7.",
            risk_level="low",
            status="recommended",
            requested_by="CloudPulse RCA Engine",
            simulation_mode=True,
            rollback_plan="Re-apply v2.8 once worker thread contention is resolved."
        ),
        Remediation(
            action_type="restrict_security_group",
            target_resource_id="sg-api-prod",
            target_resource_name="sg-api-prod (Port 22)",
            title="Revoke Public SSH Ingress (0.0.0.0/0:22)",
            description="Deletes unrestricted SSH rule and restricts bastion access to VPC CIDR 10.0.0.0/16.",
            risk_level="low",
            status="recommended",
            requested_by="CloudPulse Security Auditor",
            simulation_mode=True,
            rollback_plan="Restore previous security group rule if bastion access is blocked."
        ),
        Remediation(
            action_type="rightsize_instance",
            target_resource_id="worker-server-01",
            target_resource_name="worker-server-01 (c5.2xlarge -> c5.large)",
            title="Rightsize Underutilized Worker Instance",
            description="Resize c5.2xlarge instance to c5.large saving $74.00/month with zero throughput impact.",
            risk_level="medium",
            status="recommended",
            requested_by="FinOps Cost Engine",
            simulation_mode=True,
            rollback_plan="Scale back up to c5.2xlarge if worker queue depth exceeds 50 items."
        )
    ]
    db.add_all(remediations)
    db.commit()

    # 9. Seed Audit Logs
    if db.query(AuditLog).count() == 0:
        audit_logs = [
            AuditLog(
                action="Security Group Ingress Revocation",
                actor="Sarah Chen (DevOps)",
                resource_id="sg-staging-db",
                status="Executed",
                details="Revoked public port 5432 ingress rule from staging database security group.",
                simulation_mode=True,
                timestamp=now - timedelta(days=1)
            ),
            AuditLog(
                action="Container Fleet Rolling Update",
                actor="GitHub Actions CI/CD",
                resource_id="api-server-01",
                status="Executed",
                details="Executed deployment workflow release-v2.8 to ECS compute target group.",
                simulation_mode=False,
                timestamp=now - timedelta(minutes=20)
            )
        ]
        db.add_all(audit_logs)
        db.commit()
