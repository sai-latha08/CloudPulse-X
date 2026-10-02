from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.core.database import get_db
from app.schemas.schemas import ScenarioItem
from app.services.scenario_service import ScenarioService

router = APIRouter(prefix="/scenarios", tags=["Interview Demo Scenarios"])

@router.get("", response_model=List[ScenarioItem])
def list_scenarios(db: Session = Depends(get_db)):
    return ScenarioService.list_scenarios(db)

@router.get("/active")
def get_active_scenario(db: Session = Depends(get_db)):
    active_id = ScenarioService.get_active_scenario(db)
    return {
        "active_scenario_id": active_id,
        "details": ScenarioService.SCENARIOS.get(active_id)
    }

@router.post("/switch/{scenario_id}")
def switch_scenario(scenario_id: str, db: Session = Depends(get_db)):
    return ScenarioService.switch_scenario(db, scenario_id=scenario_id)

@router.post("/reset")
def reset_scenario(db: Session = Depends(get_db)):
    return ScenarioService.switch_scenario(db, scenario_id="performance_degradation")
