from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.core.database import get_db
from app.models.models import Incident, IncidentEvidence, CloudResource, CloudEvent, Remediation
from app.schemas.schemas import IncidentResponse, RCAResponse
from app.engines.correlation_engine import CorrelationEngine
from app.services.scenario_service import ScenarioService

router = APIRouter(prefix="/incidents", tags=["Incident Center & RCA"])

@router.get("", response_model=List[IncidentResponse])
def list_incidents(db: Session = Depends(get_db)):
    incidents = db.query(Incident).order_by(Incident.created_at.desc()).all()
    return incidents

@router.get("/{incident_id}", response_model=IncidentResponse)
def get_incident(incident_id: str, db: Session = Depends(get_db)):
    inc = db.query(Incident).filter(
        (Incident.incident_code == incident_id) | (Incident.id == (int(incident_id) if incident_id.isdigit() else -1))
    ).first()
    if not inc:
        raise HTTPException(status_code=404, detail=f"Incident '{incident_id}' not found")
    return inc

@router.get("/{incident_id}/rca", response_model=RCAResponse)
def get_incident_rca(incident_id: str, db: Session = Depends(get_db)):
    inc = db.query(Incident).filter(
        (Incident.incident_code == incident_id) | (Incident.id == (int(incident_id) if incident_id.isdigit() else -1))
    ).first()
    if not inc:
        raise HTTPException(status_code=404, detail=f"Incident '{incident_id}' not found")

    resources = db.query(CloudResource).all()
    deployments = db.query(CloudEvent).filter(CloudEvent.event_type == "deployment").all()
    
    engine = CorrelationEngine()
    context = {
        "deployments": [
            {"metadata_json": d.metadata_json, "timestamp": str(d.timestamp), "title": d.title}
            for d in deployments
        ],
        "resources": [
            {
                "resource_id": r.resource_id,
                "name": r.name,
                "type": r.type,
                "cpu_utilization": r.cpu_utilization,
                "latency_p95_ms": r.latency_p95_ms,
                "health_score": r.health_score
            }
            for r in resources
        ]
    }
    
    corr_result = engine.correlate(context)
    
    # Check if there is an active remediation
    rem = db.query(Remediation).filter(Remediation.action_type == "rollback_deployment").first()
    rem_id = rem.id if rem else None

    affected_services_details = []
    for aff_id in (inc.affected_resources or ["api-server-01", "alb-prod-external"]):
        res = db.query(CloudResource).filter(CloudResource.resource_id == aff_id).first()
        if res:
            affected_services_details.append({
                "resource_id": res.resource_id,
                "name": res.name,
                "type": res.type,
                "status": res.status,
                "health_score": res.health_score,
                "latency_p95_ms": res.latency_p95_ms,
                "cpu_utilization": res.cpu_utilization
            })

    return {
        "incident_id": str(inc.id),
        "incident_code": inc.incident_code,
        "title": inc.title,
        "severity": inc.severity,
        "status": inc.status,
        "detection_time": inc.detection_time.strftime("%Y-%m-%d %H:%M UTC") if inc.detection_time else "10:40 UTC",
        "confidence_score": corr_result.get("confidence", inc.confidence_score),
        "timeline": corr_result.get("timeline", []),
        "evidence": corr_result.get("evidence", [
            {
                "evidence_type": "metric_spike",
                "description": "Compute CPU reached 94.2%",
                "timestamp": "10:37 UTC",
                "severity": "high",
                "metric_name": "cpu_utilization",
                "value_before": "44%",
                "value_after": "94.2%",
                "correlation_note": "Direct correlation with deployment"
            }
        ]),
        "correlation_explanation": corr_result.get("correlation_explanation", "Temporal correlation links deployment to CPU saturation."),
        "probable_root_cause": inc.probable_cause or corr_result.get("probable_cause"),
        "affected_services": affected_services_details,
        "recommended_actions": corr_result.get("recommendations", []),
        "remediation_id": rem_id
    }
