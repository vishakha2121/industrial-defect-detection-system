from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

from ..database import get_db
from ..models import Detection

router = APIRouter()

@router.get("/overall")
async def get_stats(db: Session = Depends(get_db)):
    """Get overall statistics"""
    
    total = db.query(Detection).count()
    defects = db.query(Detection).filter(Detection.defect_type != "normal").count()
    rejected = db.query(Detection).filter(Detection.is_rejected == True).count()
    
    avg_time = db.query(func.avg(Detection.processing_time_ms)).scalar() or 0
    
    # Defect by type
    defect_types = db.query(
        Detection.defect_type,
        func.count(Detection.id).label('count')
    ).group_by(Detection.defect_type).all()
    
    return {
        "total_inspections": total,
        "total_defects": defects,
        "total_rejected": rejected,
        "avg_processing_time": float(avg_time),
        "defect_by_type": [{"defect_type": dt[0], "count": dt[1]} for dt in defect_types],
        "overall_accuracy": 85.5  # Sample accuracy
    }

@router.get("/defect-types")
async def get_defect_types(db: Session = Depends(get_db)):
    """Get defect type distribution"""
    
    results = db.query(
        Detection.defect_type,
        func.count(Detection.id).label('count'),
        func.avg(Detection.confidence_score).label('avg_confidence')
    ).group_by(Detection.defect_type).all()
    
    return [
        {
            "defect_type": r[0],
            "count": r[1],
            "avg_confidence": float(r[2]) if r[2] else 0
        }
        for r in results
    ]

@router.get("/real-time")
async def get_realtime(db: Session = Depends(get_db)):
    """Get real-time stats"""
    
    since = datetime.now() - timedelta(minutes=60)
    recent = db.query(Detection).filter(Detection.inspection_time >= since).count()
    
    return {
        "time_window_minutes": 60,
        "total_detections": recent,
        "defects_per_minute": recent / 60 if recent > 0 else 0,
        "rejection_rate": 15.5
    }