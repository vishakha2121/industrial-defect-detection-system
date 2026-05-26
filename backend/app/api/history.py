from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import Optional

from ..database import get_db
from ..models import Detection

router = APIRouter()

@router.get("/")
async def get_history(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    defect_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get detection history"""
    
    query = db.query(Detection)
    
    if defect_type:
        query = query.filter(Detection.defect_type == defect_type)
    
    total = query.count()
    offset = (page - 1) * page_size
    detections = query.order_by(desc(Detection.inspection_time)).offset(offset).limit(page_size).all()
    
    # Convert to dict
    result = []
    for d in detections:
        result.append({
            "id": d.id,
            "defect_type": d.defect_type,
            "confidence_score": d.confidence_score,
            "severity_level": d.severity_level,
            "is_rejected": d.is_rejected,
            "processing_time_ms": d.processing_time_ms,
            "inspection_time": d.inspection_time.isoformat() if d.inspection_time else None,
            "image_path": d.image_path
        })
    
    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "detections": result
    }

@router.get("/{detection_id}")
async def get_detection(detection_id: int, db: Session = Depends(get_db)):
    """Get single detection"""
    detection = db.query(Detection).filter(Detection.id == detection_id).first()
    if not detection:
        raise HTTPException(status_code=404, detail="Not found")
    
    return {
        "id": detection.id,
        "defect_type": detection.defect_type,
        "confidence_score": detection.confidence_score,
        "severity_level": detection.severity_level,
        "is_rejected": detection.is_rejected,
        "inspection_time": detection.inspection_time.isoformat() if detection.inspection_time else None
    }