from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import CloudResource
from app.schemas.schemas import ResourceMetricsResponse
from app.providers.demo_provider import DemoCloudProvider
from app.services.scenario_service import ScenarioService

router = APIRouter(prefix="/metrics", tags=["Observability & Telemetry"])

@router.get("/{resource_id}", response_model=ResourceMetricsResponse)
def get_resource_metrics(
    resource_id: str,
    time_range: str = Query("24h", description="Time range window: 1h, 6h, 24h, 7d"),
    db: Session = Depends(get_db)
):
    resource = db.query(CloudResource).filter(
        (CloudResource.resource_id == resource_id) | (CloudResource.id == (int(resource_id) if resource_id.isdigit() else -1))
    ).first()
    
    if not resource:
        # Fallback to default if querying generic resource
        res_name = resource_id
    else:
        res_name = resource.name

    active_scenario = ScenarioService.get_active_scenario(db)
    provider = DemoCloudProvider(active_scenario=active_scenario)
    data = provider.get_resource_metrics(resource_id=resource_id, time_range=time_range)
    data["resource_name"] = res_name
    return data
