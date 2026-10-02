from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Dict, Any
from app.core.database import get_db
from app.models.models import CloudResource, Incident, SecurityFinding, CostRecord, CloudEvent, Remediation
from app.schemas.schemas import OverviewResponse
from app.engines.health_score_engine import HealthScoreEngine
from app.services.scenario_service import ScenarioService
from app.core.config import settings

router = APIRouter(prefix="/overview", tags=["Executive Overview"])

@router.get("", response_model=OverviewResponse)
def get_executive_overview(db: Session = Depends(get_db)):
    resources = db.query(CloudResource).all()
    incidents = db.query(Incident).filter(Incident.status.in_(["detected", "investigating"])).all()
    all_incidents = db.query(Incident).order_by(Incident.created_at.desc()).limit(5).all()
    security_findings = db.query(SecurityFinding).filter(SecurityFinding.status == "open").all()
    costs = db.query(CostRecord).all()
    events = db.query(CloudEvent).order_by(CloudEvent.timestamp.desc()).limit(10).all()
    deployments = db.query(CloudEvent).filter(CloudEvent.event_type == "deployment").order_by(CloudEvent.timestamp.desc()).limit(5).all()
    remediations = db.query(Remediation).filter(Remediation.status.in_(["recommended", "pending_approval"])).limit(3).all()

    res_dicts = [
        {
            "resource_id": r.resource_id,
            "name": r.name,
            "type": r.type,
            "cpu_utilization": r.cpu_utilization,
            "latency_p95_ms": r.latency_p95_ms,
            "error_rate": r.error_rate,
            "health_score": r.health_score
        }
        for r in resources
    ]

    inc_dicts = [
        {"severity": inc.severity, "status": inc.status}
        for inc in incidents
    ]

    sec_dicts = [
        {"severity": f.severity, "status": f.status}
        for f in security_findings
    ]

    monthly_cost = sum(c.monthly_estimated for c in costs)
    potential_savings = sum(c.potential_savings for c in costs)
    
    cost_data = {
        "cost_efficiency_score": 91.5 if potential_savings < 500 else 78.0,
        "monthly_estimated": monthly_cost,
        "potential_savings": potential_savings
    }

    health_breakdown = HealthScoreEngine.calculate_health_scores(
        resources=res_dicts,
        incidents=inc_dicts,
        security_findings=sec_dicts,
        cost_data=cost_data
    )

    critical_security = len([f for f in security_findings if f.severity == "critical"])
    active_scenario = ScenarioService.get_active_scenario(db)

    return {
        "overall_health": health_breakdown,
        "active_incidents_count": len(incidents),
        "critical_security_count": critical_security,
        "total_security_findings": len(security_findings),
        "monthly_estimated_cost": round(monthly_cost, 2),
        "potential_savings": round(potential_savings, 2),
        "resources_monitored": len(resources),
        "availability_sla": 99.95 if len(incidents) == 0 else (98.4 if health_breakdown["overall"] > 70 else 96.8),
        "active_scenario": active_scenario,
        "recent_deployments": deployments,
        "recent_events": events,
        "top_incidents": all_incidents,
        "high_priority_remediations": remediations,
        "cloud_provider": settings.CLOUD_PROVIDER
    }
