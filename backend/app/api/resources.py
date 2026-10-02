from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.models import CloudResource
from app.schemas.schemas import ResourceResponse, ResourceGroupSummary

router = APIRouter(prefix="/resources", tags=["Cloud Infrastructure"])

@router.get("", response_model=List[ResourceResponse])
def list_resources(
    category: Optional[str] = Query(None, description="Filter by category: compute, storage, database, network, serverless"),
    environment: Optional[str] = Query(None, description="Filter by environment: production, staging, development"),
    status: Optional[str] = Query(None, description="Filter by status: healthy, warning, critical"),
    search: Optional[str] = Query(None, description="Search by name or resource ID"),
    sort_by: Optional[str] = Query("health_score", description="Sort by field: health_score, name, cpu_utilization, latency_p95_ms"),
    sort_order: Optional[str] = Query("asc", description="Sort order: asc or desc"),
    db: Session = Depends(get_db)
):
    query = db.query(CloudResource)

    if category:
        query = query.filter(CloudResource.category == category.lower())
    if environment:
        query = query.filter(CloudResource.environment == environment.lower())
    if status:
        query = query.filter(CloudResource.status == status.lower())
    if search:
        term = f"%{search}%"
        query = query.filter(
            (CloudResource.name.ilike(term)) | (CloudResource.resource_id.ilike(term)) | (CloudResource.type.ilike(term))
        )

    # Sorting
    if hasattr(CloudResource, sort_by):
        attr = getattr(CloudResource, sort_by)
        query = query.order_by(attr.desc() if sort_order == "desc" else attr.asc())
    else:
        query = query.order_by(CloudResource.health_score.asc())

    return query.all()

@router.get("/by-category", response_model=List[ResourceGroupSummary])
def get_resources_by_category(db: Session = Depends(get_db)):
    categories = ["compute", "storage", "database", "network", "serverless"]
    all_res = db.query(CloudResource).all()

    result = []
    for cat in categories:
        cat_resources = [r for r in all_res if r.category == cat]
        result.append({
            "category": cat,
            "total_count": len(cat_resources),
            "healthy_count": len([r for r in cat_resources if r.status == "healthy"]),
            "warning_count": len([r for r in cat_resources if r.status == "warning"]),
            "critical_count": len([r for r in cat_resources if r.status == "critical"]),
            "resources": cat_resources
        })
    return result

@router.get("/{resource_id}", response_model=ResourceResponse)
def get_resource_detail(resource_id: str, db: Session = Depends(get_db)):
    resource = db.query(CloudResource).filter(
        (CloudResource.resource_id == resource_id) | (CloudResource.id == (int(resource_id) if resource_id.isdigit() else -1))
    ).first()
    if not resource:
        raise HTTPException(status_code=404, detail=f"Cloud resource '{resource_id}' not found")
    return resource
