from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import CloudResource
from app.schemas.schemas import TopologyGraphResponse, TopologyNode, TopologyLink

router = APIRouter(prefix="/infrastructure", tags=["Digital Twin & Topology"])

@router.get("/graph", response_model=TopologyGraphResponse)
def get_topology_graph(db: Session = Depends(get_db)):
    resources = db.query(CloudResource).all()
    
    # Define layers for visual hierarchy in digital twin
    # Layer 0: Internet/Client
    # Layer 1: Edge / Load Balancer
    # Layer 2: Compute / API Fleet
    # Layer 3: Workers & Serverless
    # Layer 4: Databases & Storage
    
    layer_map = {
        "alb": 1,
        "ec2": 2,
        "lambda": 3,
        "rds": 4,
        "s3": 4,
        "vpc": 0,
        "security_group": 1
    }

    nodes = []
    
    # Add Internet Gateway Node
    nodes.append(TopologyNode(
        id="internet-gateway",
        name="Global Internet / CloudFront",
        type="edge",
        category="network",
        status="healthy",
        health_score=99.9,
        ip_address="0.0.0.0/0",
        metrics_summary={"request_rate": 3200, "latency_ms": 22},
        layer=0,
        environment="production"
    ))

    for r in resources:
        layer = layer_map.get(r.type.lower(), 2)
        if "worker" in r.name.lower():
            layer = 3

        nodes.append(TopologyNode(
            id=r.resource_id,
            name=r.name,
            type=r.type,
            category=r.category,
            status=r.status,
            health_score=r.health_score,
            ip_address=r.ip_address,
            metrics_summary={
                "cpu": r.cpu_utilization,
                "memory": r.memory_utilization,
                "latency_p95": r.latency_p95_ms,
                "error_rate": r.error_rate,
                "request_rate": r.request_rate
            },
            layer=layer,
            environment=r.environment
        ))

    links = [
        TopologyLink(source="internet-gateway", target="alb-prod-external", label="HTTPS (443)", protocol="HTTPS"),
        TopologyLink(source="alb-prod-external", target="api-server-01", label="HTTP:8080 (TG-API-01)", protocol="HTTP"),
        TopologyLink(source="alb-prod-external", target="api-server-02", label="HTTP:8080 (TG-API-02)", protocol="HTTP"),
        TopologyLink(source="api-server-01", target="production-db", label="PostgreSQL (5432)", protocol="TCP"),
        TopologyLink(source="api-server-02", target="production-db", label="PostgreSQL (5432)", protocol="TCP"),
        TopologyLink(source="api-server-01", target="application-assets", label="S3 REST API", protocol="HTTPS"),
        TopologyLink(source="api-server-02", target="application-assets", label="S3 REST API", protocol="HTTPS"),
        TopologyLink(source="api-server-01", target="image-processing", label="Lambda Async Invoke", protocol="gRPC/HTTPS"),
        TopologyLink(source="worker-server-01", target="production-db", label="SQL Queue Poll", protocol="TCP"),
        TopologyLink(source="worker-server-02", target="production-db", label="SQL Queue Poll", protocol="TCP"),
        TopologyLink(source="worker-server-01", target="notification-service", label="SNS / SQS Trigger", protocol="HTTPS"),
        TopologyLink(source="production-db", target="backup-storage", label="Daily Automated Snapshots", protocol="AWS Internal")
    ]

    health_summary = {
        "healthy": len([n for n in nodes if n.status == "healthy"]),
        "warning": len([n for n in nodes if n.status == "warning"]),
        "critical": len([n for n in nodes if n.status == "critical"])
    }

    return {
        "nodes": nodes,
        "links": links,
        "total_resources": len(nodes),
        "health_summary": health_summary
    }
