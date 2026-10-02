from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.models import CloudEvent
from app.schemas.schemas import CloudEventResponse

router = APIRouter(prefix="/events", tags=["Event Timeline"])

@router.get("", response_model=List[CloudEventResponse])
def list_events(
    event_type: Optional[str] = Query(None, description="deployment, metric_anomaly, security_alert, config_change, remediation, incident"),
    severity: Optional[str] = Query(None, description="info, warning, critical, success"),
    resource_id: Optional[str] = Query(None),
    limit: int = Query(50, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(CloudEvent)
    if event_type:
        query = query.filter(CloudEvent.event_type == event_type)
    if severity:
        query = query.filter(CloudEvent.severity == severity)
    if resource_id:
        query = query.filter(CloudEvent.resource_id == resource_id)
    
    return query.order_by(CloudEvent.timestamp.desc()).limit(limit).all()
