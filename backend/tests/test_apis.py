import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import engine, Base, SessionLocal
from app.utils.seed_data import seed_database

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db, scenario_id="performance_degradation")
    finally:
        db.close()

def test_health_endpoint():
    with TestClient(app) as client:
        response = client.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "CloudPulse" in data["service"]

def test_overview_endpoint():
    with TestClient(app) as client:
        response = client.get("/api/overview")
        assert response.status_code == 200
        data = response.json()
        assert "overall_health" in data
        assert "resources_monitored" in data
        assert data["resources_monitored"] > 0

def test_resources_endpoint():
    with TestClient(app) as client:
        response = client.get("/api/resources")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
        assert "resource_id" in data[0]

def test_security_summary_endpoint():
    with TestClient(app) as client:
        response = client.get("/api/security/summary")
        assert response.status_code == 200
        data = response.json()
        assert "security_score" in data
        assert "findings" in data

def test_cost_summary_endpoint():
    with TestClient(app) as client:
        response = client.get("/api/cost/summary")
        assert response.status_code == 200
        data = response.json()
        assert "monthly_estimated" in data
        assert "potential_savings" in data

def test_graph_endpoint():
    with TestClient(app) as client:
        response = client.get("/api/infrastructure/graph")
        assert response.status_code == 200
        data = response.json()
        assert "nodes" in data
        assert "links" in data
        assert len(data["nodes"]) > 0

def test_copilot_query():
    with TestClient(app) as client:
        response = client.post("/api/copilot/query", json={"query": "Why is my API slow?"})
        assert response.status_code == 200
        data = response.json()
        assert "structured_analysis" in data
        assert "confidence" in data["structured_analysis"]
        assert len(data["structured_analysis"]["evidence"]) > 0

def test_remediation_workflow():
    with TestClient(app) as client:
        list_resp = client.get("/api/remediations")
        assert list_resp.status_code == 200
        rems = list_resp.json()
        assert len(rems) > 0

        first_rem_id = rems[0]["id"]
        approve_resp = client.post(
            f"/api/remediations/{first_rem_id}/approve",
            json={"approved_by": "Test Suite Admin", "execute_immediately": True}
        )
        assert approve_resp.status_code == 200
        data = approve_resp.json()
        assert data["status"] == "completed"

def test_scenario_switching():
    with TestClient(app) as client:
        resp = client.post("/api/scenarios/switch/security_misconfig")
        assert resp.status_code == 200
        assert resp.json()["active_scenario"] == "security_misconfig"

        reset_resp = client.post("/api/scenarios/reset")
        assert reset_resp.status_code == 200
