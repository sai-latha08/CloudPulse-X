from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.core.database import get_db
from app.models.models import Remediation, AuditLog, Incident, CloudResource, CloudEvent
from app.schemas.schemas import RemediationResponse, RemediationApproveRequest, AuditLogResponse
from app.providers.demo_provider import DemoCloudProvider
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/remediations", tags=["Remediation & Automated Workflows"])

@router.get("", response_model=List[RemediationResponse])
def list_remediations(db: Session = Depends(get_db)):
    return db.query(Remediation).order_by(Remediation.created_at.desc()).all()

@router.post("/{remediation_id}/approve", response_model=RemediationResponse)
def approve_remediation(
    remediation_id: str,
    req: RemediationApproveRequest,
    db: Session = Depends(get_db)
):
    rem = db.query(Remediation).filter(
        (Remediation.id == (int(remediation_id) if remediation_id.isdigit() else -1))
    ).first()
    if not rem:
        raise HTTPException(status_code=404, detail="Remediation not found")

    rem.status = "approved"
    rem.approved_by = req.approved_by or "Admin (User Approval)"

    # Audit log
    audit = AuditLog(
        action=f"Remediation Approved: {rem.title}",
        actor=rem.approved_by,
        resource_id=rem.target_resource_id,
        status="Approved",
        details=f"User approved remediation action '{rem.action_type}'. Execution queue armed.",
        simulation_mode=rem.simulation_mode,
        timestamp=datetime.utcnow()
    )
    db.add(audit)
    db.commit()
    db.refresh(rem)

    if req.execute_immediately:
        return execute_remediation(remediation_id=str(rem.id), db=db)

    return rem

@router.post("/{remediation_id}/execute", response_model=RemediationResponse)
def execute_remediation(remediation_id: str, db: Session = Depends(get_db)):
    rem = db.query(Remediation).filter(
        (Remediation.id == (int(remediation_id) if remediation_id.isdigit() else -1))
    ).first()
    if not rem:
        raise HTTPException(status_code=404, detail="Remediation not found")

    provider = DemoCloudProvider()
    exec_result = provider.execute_remediation(
        action_type=rem.action_type,
        target_resource_id=rem.target_resource_id,
        simulation_mode=rem.simulation_mode
    )

    rem.status = "completed"
    rem.execution_time = datetime.utcnow()
    rem.result_log = exec_result.get("details")

    # If this was rollback_deployment, mitigate INC-1024 and restore api-server-01 health
    if rem.action_type == "rollback_deployment":
        inc = db.query(Incident).filter(Incident.incident_code == "INC-1024").first()
        if inc:
            inc.status = "mitigated"
            inc.resolved_at = datetime.utcnow()
        
        target_res = db.query(CloudResource).filter(CloudResource.resource_id == rem.target_resource_id).first()
        if target_res:
            target_res.status = "healthy"
            target_res.health_score = 98.0
            target_res.cpu_utilization = 38.0
            target_res.latency_p95_ms = 95.0
            target_res.error_rate = 0.01

        alb_res = db.query(CloudResource).filter(CloudResource.resource_id == "alb-prod-external").first()
        if alb_res:
            alb_res.status = "healthy"
            alb_res.health_score = 99.0
            alb_res.latency_p95_ms = 85.0
            alb_res.error_rate = 0.02

    elif rem.action_type == "restrict_security_group":
        sg_res = db.query(CloudResource).filter(CloudResource.resource_id == rem.target_resource_id).first()
        if sg_res:
            sg_res.status = "healthy"
            sg_res.health_score = 99.0

    # Create event
    event = CloudEvent(
        event_type="remediation",
        title=f"Remediation Executed: {rem.title}",
        description=f"Action '{rem.action_type}' applied on {rem.target_resource_id}. Result: {exec_result.get('details')}",
        resource_id=rem.target_resource_id,
        resource_name=rem.target_resource_name,
        severity="success",
        actor=rem.approved_by or "Admin",
        timestamp=datetime.utcnow()
    )
    db.add(event)

    # Audit log
    audit = AuditLog(
        action=f"Remediation Executed: {rem.title}",
        actor=rem.approved_by or "Admin",
        resource_id=rem.target_resource_id,
        status="Executed",
        details=f"Successfully executed '{rem.action_type}'. Status: Simulation successful.",
        simulation_mode=rem.simulation_mode,
        timestamp=datetime.utcnow()
    )
    db.add(audit)

    db.commit()
    db.refresh(rem)
    return rem

@router.get("/audit-logs", response_model=List[AuditLogResponse])
def list_audit_logs(db: Session = Depends(get_db)):
    return db.query(AuditLog).order_by(AuditLog.timestamp.desc()).all()
