# API Routes
from .detection import router as detection_router
from .history import router as history_router  
from .stats import router as stats_router
from .settings import router as settings_router

__all__ = [
    "detection_router",
    "history_router", 
    "stats_router",
    "settings_router"
]