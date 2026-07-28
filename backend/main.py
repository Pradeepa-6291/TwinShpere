import asyncio
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from database.connection import init_db
from database.seed_data import seed_database
from services.sensor_simulator import sensor_simulator
from services.websocket_manager import manager as ws_manager

# Import API Routers
from routers import (
    auth, command_center, digital_twin, incidents,
    agents_router, predictions, simulations, approvals,
    resources, energy, transport, complaints, memory,
    analytics, scenarios
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("twinsphere.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Initializing TWINSPHERE AI Backend Server...")
    await init_db()
    await seed_database()
    
    # Start live telemetry stream background simulator
    sim_task = asyncio.create_task(sensor_simulator.start())
    yield
    # Shutdown
    sensor_simulator.stop()
    sim_task.cancel()
    logger.info("Shutdown TWINSPHERE AI Backend Server.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Autonomous Digital Twin & Multi-Agent Campus Operations Command Center",
    lifespan=lifespan
)

# CORS Configuration for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers under /api/v1
api_prefix = settings.API_V1_STR
app.include_router(auth.router, prefix=api_prefix)
app.include_router(command_center.router, prefix=api_prefix)
app.include_router(digital_twin.router, prefix=api_prefix)
app.include_router(incidents.router, prefix=api_prefix)
app.include_router(agents_router.router, prefix=api_prefix)
app.include_router(predictions.router, prefix=api_prefix)
app.include_router(simulations.router, prefix=api_prefix)
app.include_router(approvals.router, prefix=api_prefix)
app.include_router(resources.router, prefix=api_prefix)
app.include_router(energy.router, prefix=api_prefix)
app.include_router(transport.router, prefix=api_prefix)
app.include_router(complaints.router, prefix=api_prefix)
app.include_router(memory.router, prefix=api_prefix)
app.include_router(analytics.router, prefix=api_prefix)
app.include_router(scenarios.router, prefix=api_prefix)

# WebSocket Endpoint for real-time dashboard updates
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            # Keep socket open and receive ping/heartbeat messages
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
    except Exception as e:
        logger.warning(f"WebSocket connection exception: {e}")
        ws_manager.disconnect(websocket)

@app.get("/health")
async def health_check():
    return {
        "status": "ONLINE",
        "system": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "ai_provider": settings.AI_PROVIDER
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
