from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.models import Alert
from app.schemas.schemas import AlertResponse

router = APIRouter(prefix="/alerts", tags=["Alert Center"])

@router.get("", response_model=List[AlertResponse])
def list_alerts(db: Session = Depends(get_db)):
    return db.query(Alert).order_by(Alert.timestamp.desc()).all()

@router.post("/{alert_id}/read", response_model=AlertResponse)
def mark_alert_read(alert_id: str, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(
        (Alert.alert_code == alert_id) | (Alert.id == (int(alert_id) if alert_id.isdigit() else -1))
    ).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.is_read = True
    db.commit()
    db.refresh(alert)
    return alert

@router.post("/{alert_id}/resolve", response_model=AlertResponse)
def resolve_alert(alert_id: str, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(
        (Alert.alert_code == alert_id) | (Alert.id == (int(alert_id) if alert_id.isdigit() else -1))
    ).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.is_resolved = True
    db.commit()
    db.refresh(alert)
    return alert
