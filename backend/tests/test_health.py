import pytest
from app.engines.health_score_engine import HealthScoreEngine

def test_health_score_calculation_healthy():
    resources = [
        {"cpu_utilization": 25.0, "latency_p95_ms": 60.0, "error_rate": 0.01, "health_score": 99.0},
        {"cpu_utilization": 30.0, "latency_p95_ms": 80.0, "error_rate": 0.02, "health_score": 98.0}
    ]
    incidents = []
    security_findings = [
        {"severity": "low", "status": "remediated"}
    ]
    cost_data = {"cost_efficiency_score": 95.0}

    scores = HealthScoreEngine.calculate_health_scores(resources, incidents, security_findings, cost_data)
    assert scores["overall"] >= 95.0
    assert scores["status_label"] == "Optimal"
    assert scores["performance"] >= 90.0
    assert scores["reliability"] == 100.0

def test_health_score_calculation_critical_incident():
    resources = [
        {"cpu_utilization": 94.0, "latency_p95_ms": 2800.0, "error_rate": 4.8, "health_score": 42.0},
        {"cpu_utilization": 76.0, "latency_p95_ms": 1900.0, "error_rate": 2.1, "health_score": 74.0}
    ]
    incidents = [
        {"severity": "high", "status": "detected"}
    ]
    security_findings = [
        {"severity": "critical", "status": "open"}
    ]
    cost_data = {"cost_efficiency_score": 78.0}

    scores = HealthScoreEngine.calculate_health_scores(resources, incidents, security_findings, cost_data)
    assert scores["overall"] < 80.0
    assert scores["status_label"] in ["Degraded", "Warning", "Critical Action Required"]
