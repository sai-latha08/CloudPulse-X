import pytest
from app.engines.correlation_engine import CorrelationEngine

def test_deployment_regression_correlation():
    engine = CorrelationEngine()
    context = {
        "deployments": [
            {"metadata_json": {"version": "v2.8"}, "timestamp": "10:35 UTC", "title": "Deploy v2.8"}
        ],
        "resources": [
            {
                "resource_id": "api-server-01",
                "name": "api-server-01",
                "type": "ec2",
                "cpu_utilization": 94.2,
                "latency_p95_ms": 2800.0,
                "health_score": 42.0
            },
            {
                "resource_id": "production-db",
                "name": "production-db",
                "type": "rds",
                "cpu_utilization": 32.0,
                "latency_p95_ms": 14.5,
                "health_score": 98.0
            }
        ]
    }

    result = engine.correlate(context)
    assert result["rule_triggered"] == "RULE-CORR-01"
    assert result["confidence"] >= 0.85
    assert len(result["evidence"]) >= 3
    assert len(result["timeline"]) >= 4
    assert len(result["recommendations"]) >= 1
    assert "api-server-01" in result["affected_resources"]

def test_default_correlation_on_healthy():
    engine = CorrelationEngine()
    context = {
        "deployments": [],
        "resources": [
            {"resource_id": "api-server-01", "type": "ec2", "cpu_utilization": 30.0, "latency_p95_ms": 80.0, "health_score": 98.0}
        ]
    }
    result = engine.correlate(context)
    assert result["rule_triggered"] == "RULE-DEFAULT"
