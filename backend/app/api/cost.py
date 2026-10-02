from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import CloudResource, CostRecord
from app.schemas.schemas import CostSummaryResponse
from app.providers.demo_provider import DemoCloudProvider
from app.engines.cost_engine import CostEngine
from app.services.scenario_service import ScenarioService

router = APIRouter(prefix="/cost", tags=["Cost Intelligence"])

@router.get("/summary", response_model=CostSummaryResponse)
def get_cost_summary(db: Session = Depends(get_db)):
    active_scenario = ScenarioService.get_active_scenario(db)
    provider = DemoCloudProvider(active_scenario=active_scenario)
    resources = db.query(CloudResource).all()
    
    raw_cost_data = provider.get_cost_data()
    analyzed_cost = CostEngine.analyze_cost_efficiency(
        cost_data=raw_cost_data,
        resources=[{"cpu_utilization": r.cpu_utilization, "resource_id": r.resource_id} for r in resources]
    )
    return analyzed_cost
