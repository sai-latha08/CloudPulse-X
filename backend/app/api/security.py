from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.core.database import get_db
from app.models.models import SecurityFinding, AuditLog
from app.schemas.schemas import SecurityFindingResponse, SecuritySummary
from app.engines.security_engine import SecurityEngine

router = APIRouter(prefix="/security", tags=["Security Intelligence"])

@router.get("/findings", response_model=List[SecurityFindingResponse])
def list_findings(
    category: Optional[str] = Query(None, description="iam, security_group, s3, infrastructure"),
    severity: Optional[str] = Query(None, description="critical, high, medium, low"),
    status: Optional[str] = Query(None, description="open, remediated, suppressed"),
    db: Session = Depends(get_db)
):
    query = db.query(SecurityFinding)
    if category:
        query = query.filter(SecurityFinding.category == category.lower())
    if severity:
        query = query.filter(SecurityFinding.severity == severity.lower())
    if status:
        query = query.filter(SecurityFinding.status == status.lower())
    return query.order_by(SecurityFinding.id.asc()).all()

@router.get("/summary", response_model=SecuritySummary)
def get_security_summary(db: Session = Depends(get_db)):
    findings = db.query(SecurityFinding).all()
    findings_dicts = [
        {
            "id": f.id,
            "finding_code": f.finding_code,
            "title": f.title,
            "severity": f.severity,
            "category": f.category,
            "resource_id": f.resource_id,
            "resource_name": f.resource_name,
            "description": f.description,
            "evidence": f.evidence,
            "recommendation": f.recommendation,
            "status": f.status,
            "created_at": f.created_at
        }
        for f in findings
    ]
    summary_data = SecurityEngine.audit_security_posture(findings_dicts)
    summary_data["findings"] = findings
    return summary_data

@router.post("/findings/{finding_id}/remediate")
def remediate_finding(finding_id: str, db: Session = Depends(get_db)):
    finding = db.query(SecurityFinding).filter(
        (SecurityFinding.finding_code == finding_id) | (SecurityFinding.id == (int(finding_id) if finding_id.isdigit() else -1))
    ).first()
    if not finding:
        raise HTTPException(status_code=404, detail="Finding not found")

    finding.status = "remediated"
    
    # Add audit log
    audit = AuditLog(
        action=f"Security Remediation: {finding.title}",
        actor="Security Admin",
        resource_id=finding.resource_id,
        status="Executed",
        details=f"Applied automated fix: {finding.recommendation}",
        simulation_mode=True,
        timestamp=datetime.utcnow()
    )
    db.add(audit)
    db.commit()

    return {
        "message": f"Successfully remediated {finding.finding_code}",
        "finding": finding,
        "status": "remediated"
    }
