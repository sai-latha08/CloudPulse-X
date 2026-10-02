from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.utils.seed_data import seed_database
from app.models.models import CloudResource

# Routers
from app.api.auth import router as auth_router
from app.api.overview import router as overview_router
from app.api.resources import router as resources_router
from app.api.metrics import router as metrics_router
from app.api.incidents import router as incidents_router
from app.api.security import router as security_router
from app.api.cost import router as cost_router
from app.api.events import router as events_router
from app.api.alerts import router as alerts_router
from app.api.graph import router as graph_router
from app.api.copilot import router as copilot_router
from app.api.remediations import router as remediations_router
from app.api.scenarios import router as scenarios_router
from app.api.health import router as health_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("cloudpulse")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB schema
    logger.info("Initializing CloudPulse X database schema...")
    Base.metadata.create_all(bind=engine)
    
    # Auto-seed if empty
    db = SessionLocal()
    try:
        if db.query(CloudResource).count() == 0:
            logger.info("Database empty, seeding default cloud resources and scenario data...")
            seed_database(db, scenario_id="performance_degradation")
    except Exception as e:
        logger.error(f"Error initializing DB seed: {e}")
    finally:
        db.close()
        
    logger.info("CloudPulse X backend initialized and ready.")
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Autonomous Cloud Reliability, Security & Intelligence Platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all API routers
app.include_router(health_router, prefix=settings.API_V1_STR)
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(overview_router, prefix=settings.API_V1_STR)
app.include_router(resources_router, prefix=settings.API_V1_STR)
app.include_router(metrics_router, prefix=settings.API_V1_STR)
app.include_router(incidents_router, prefix=settings.API_V1_STR)
app.include_router(security_router, prefix=settings.API_V1_STR)
app.include_router(cost_router, prefix=settings.API_V1_STR)
app.include_router(events_router, prefix=settings.API_V1_STR)
app.include_router(alerts_router, prefix=settings.API_V1_STR)
app.include_router(graph_router, prefix=settings.API_V1_STR)
app.include_router(copilot_router, prefix=settings.API_V1_STR)
app.include_router(remediations_router, prefix=settings.API_V1_STR)
app.include_router(scenarios_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "message": "Welcome to CloudPulse X API",
        "tagline": "Observe. Understand. Secure. Optimize.",
        "docs_url": "/docs",
        "health_url": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
