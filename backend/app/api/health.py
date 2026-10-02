from fastapi import APIRouter
from datetime import datetime, timezone
from app.core.config import settings

router = APIRouter(tags=["System Health"])

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "CloudPulse X Backend API",
        "version": "1.0.0",
        "cloud_provider": settings.CLOUD_PROVIDER,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
