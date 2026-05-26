from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Industrial Defect Detection API",
    description="Computer Vision-based Manufacturing Defect Detection System",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for practice
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create directories
os.makedirs("static/uploads", exist_ok=True)
os.makedirs("static/results", exist_ok=True)

# Static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Import routers (lazy import to avoid circular imports)
def include_routers():
    try:
        from .api import detection, history, stats, settings
        app.include_router(detection.router, prefix="/api/detection", tags=["Detection"])
        app.include_router(history.router, prefix="/api/history", tags=["History"])
        app.include_router(stats.router, prefix="/api/stats", tags=["Statistics"])
        app.include_router(settings.router, prefix="/api/settings", tags=["Settings"])
        logger.info("All routers loaded successfully")
    except Exception as e:
        logger.error(f"Error loading routers: {e}")

# Call router inclusion
include_routers()

@app.on_event("startup")
async def startup_event():
    """Startup event handler"""
    logger.info("Starting Industrial Defect Detection System...")
    try:
        from .database import engine, Base
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Database error: {e}")

@app.get("/")
async def root():
    return {
        "message": "Industrial Defect Detection System API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "detection": "/api/detection",
            "history": "/api/history",
            "stats": "/api/stats",
            "settings": "/api/settings",
            "docs": "/docs"
        }
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "defect-detection"}

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def send_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

manager = ConnectionManager()

@app.websocket("/ws/detection")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.send_message(f"Echo: {data}", websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket)