from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.models import CloudResource, Incident, SecurityFinding, CostRecord
from app.schemas.schemas import CopilotQueryRequest, CopilotQueryResponse
from app.engines.copilot_reasoning import CopilotReasoningEngine
from app.providers.demo_provider import DemoCloudProvider
from app.services.scenario_service import ScenarioService

router = APIRouter(prefix="/copilot", tags=["AI Cloud Copilot"])

@router.post("/query", response_model=CopilotQueryResponse)
def query_copilot(req: CopilotQueryRequest, db: Session = Depends(get_db)):
    resources = db.query(CloudResource).all()
    incidents = db.query(Incident).all()
    security_findings = db.query(SecurityFinding).all()
    active_scenario = ScenarioService.get_active_scenario(db)
    
    provider = DemoCloudProvider(active_scenario=active_scenario)
    cost_data = provider.get_cost_data()

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
        {
            "incident_code": inc.incident_code,
            "title": inc.title,
            "severity": inc.severity,
            "status": inc.status,
            "probable_cause": inc.probable_cause,
            "impact_summary": inc.impact_summary,
            "confidence_score": inc.confidence_score,
            "affected_resources": inc.affected_resources
        }
        for inc in incidents
    ]

    sec_dicts = [
        {
            "finding_code": f.finding_code,
            "title": f.title,
            "severity": f.severity,
            "category": f.category,
            "resource_id": f.resource_id,
            "status": f.status
        }
        for f in security_findings
    ]

    response = CopilotReasoningEngine.answer_query(
        query=req.query,
        resources=res_dicts,
        incidents=inc_dicts,
        security_findings=sec_dicts,
        cost_data=cost_data,
        active_scenario=active_scenario
    )
    return response

@router.get("/suggestions", response_model=List[str])
def get_copilot_suggestions():
    return [
        "Why is my API slow?",
        "What are my critical security issues?",
        "Which resources are underutilized?",
        "What caused incident INC-1024?",
        "Which service has the highest estimated cost?",
        "What should I investigate first?"
    ]
