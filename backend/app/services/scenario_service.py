from typing import List, Dict, Any
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.models.models import CloudResource, Incident, SecurityFinding, CostRecord, CloudEvent, Alert, Remediation, ScenarioState
from app.providers.demo_provider import DemoCloudProvider

class ScenarioService:
    SCENARIOS = {
        "performance_degradation": {
            "id": "performance_degradation",
            "name": "Scenario 2: API Performance Degradation & Deployment v2.8",
            "badge": "Deployment Regression",
            "description": "Production deployment v2.8 causes CPU spike (94%) on api-server-01, elevating P95 latency to 2.8s and triggering INC-1024 with RCA correlation.",
            "active": True,
            "key_metrics": {"overall_health": 78.4, "active_incidents": 1, "critical_security": 2, "cost_savings": 428.0}
        },
        "healthy": {
            "id": "healthy",
            "name": "Scenario 1: Healthy Infrastructure Baseline",
            "badge": "All Systems Nominal",
            "description": "All compute, storage, database, and network resources are operating in optimal parameters. Health score 99.4%, zero active incidents.",
            "active": False,
            "key_metrics": {"overall_health": 99.4, "active_incidents": 0, "critical_security": 0, "cost_savings": 428.0}
        },
        "security_misconfig": {
            "id": "security_misconfig",
            "name": "Scenario 3: Critical Security Misconfiguration",
            "badge": "Security Exposure",
            "description": "Port 22 SSH exposed publicly (0.0.0.0/0), unencrypted public S3 bucket discovered, and wildcard IAM AdministratorAccess assigned.",
            "active": False,
            "key_metrics": {"overall_health": 68.2, "active_incidents": 1, "critical_security": 3, "cost_savings": 428.0}
        },
        "cost_anomaly": {
            "id": "cost_anomaly",
            "name": "Scenario 4: Cloud Cost Anomaly & Underutilization",
            "badge": "FinOps Optimization",
            "description": "worker-server-01 idle at 7.8% CPU, staging-db oversized, unattached EBS volume generating waste. $795/month potential savings identified.",
            "active": False,
            "key_metrics": {"overall_health": 88.5, "active_incidents": 0, "critical_security": 1, "cost_savings": 795.0}
        },
        "deployment_failure": {
            "id": "deployment_failure",
            "name": "Scenario 5: Worker Crash Loop & Memory Exhaustion",
            "badge": "High Blast Radius",
            "description": "Worker node worker-server-02 hit 96% memory saturation after v3.1 hotfix, causing 14 restarts and 18.4% task failure rate.",
            "active": False,
            "key_metrics": {"overall_health": 62.0, "active_incidents": 2, "critical_security": 1, "cost_savings": 428.0}
        }
    }

    @staticmethod
    def get_active_scenario(db: Session) -> str:
        state = db.query(ScenarioState).first()
        if not state:
            state = ScenarioState(active_scenario="performance_degradation")
            db.add(state)
            db.commit()
            db.refresh(state)
        return state.active_scenario

    @staticmethod
    def list_scenarios(db: Session) -> List[Dict[str, Any]]:
        active_id = ScenarioService.get_active_scenario(db)
        scenarios = []
        for s_id, data in ScenarioService.SCENARIOS.items():
            item = dict(data)
            item["active"] = (s_id == active_id)
            scenarios.append(item)
        return scenarios

    @staticmethod
    def switch_scenario(db: Session, scenario_id: str) -> Dict[str, Any]:
        if scenario_id not in ScenarioService.SCENARIOS:
            scenario_id = "performance_degradation"

        state = db.query(ScenarioState).first()
        if not state:
            state = ScenarioState(active_scenario=scenario_id)
            db.add(state)
        else:
            state.active_scenario = scenario_id
            state.updated_at = datetime.utcnow()
        
        db.commit()

        # Re-seed database records based on selected scenario
        from app.utils.seed_data import seed_database
        seed_database(db, scenario_id=scenario_id)

        return {
            "message": f"Successfully activated {ScenarioService.SCENARIOS[scenario_id]['name']}",
            "active_scenario": scenario_id,
            "scenario_details": ScenarioService.SCENARIOS[scenario_id]
        }
