from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import SystemSetting
from ..config import settings

router = APIRouter()

@router.get("/")
async def get_settings(db: Session = Depends(get_db)):
    """Get all settings"""
    
    return {
        "confidence_threshold": settings.CONFIDENCE_THRESHOLD,
        "iou_threshold": settings.IOU_THRESHOLD,
        "auto_reject_enabled": settings.AUTO_REJECT_ENABLED,
        "max_upload_size": settings.MAX_UPLOAD_SIZE,
        "model_path": settings.MODEL_PATH
    }

@router.put("/thresholds")
async def update_thresholds(
    confidence_threshold: float = 0.5,
    iou_threshold: float = 0.45,
    auto_reject_enabled: bool = True
):
    """Update thresholds"""
    
    # Update settings object
    settings.CONFIDENCE_THRESHOLD = confidence_threshold
    settings.IOU_THRESHOLD = iou_threshold
    settings.AUTO_REJECT_ENABLED = auto_reject_enabled
    
    return {
        "message": "Settings updated",
        "confidence_threshold": confidence_threshold,
        "iou_threshold": iou_threshold,
        "auto_reject_enabled": auto_reject_enabled
    }

@router.post("/reset")
async def reset_settings():
    """Reset to defaults"""
    
    settings.CONFIDENCE_THRESHOLD = 0.5
    settings.IOU_THRESHOLD = 0.45
    settings.AUTO_REJECT_ENABLED = True
    
    return {"message": "Settings reset to default"}