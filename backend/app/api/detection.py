from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import os
import uuid
import time

from ..database import get_db
from ..models import Detection
from ..services.yolov8_detector import YOLOv8Detector

router = APIRouter()

# Initialize detector
detector = YOLOv8Detector()

@router.post("/upload")
async def detect_defects(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload image and detect defects"""
    
    # Save file
    upload_dir = "static/uploads"
    os.makedirs(upload_dir, exist_ok=True)
    
    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4().hex}.{file_extension}"
    file_path = os.path.join(upload_dir, unique_filename)
    
    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)
    
    # Detect
    start_time = time.time()
    result = detector.detect(file_path)
    processing_time = (time.time() - start_time) * 1000
    
    # Save to database
    detection = Detection(
        image_path=file_path,
        defect_type=result["defect_type"],
        confidence_score=result["confidence"],
        defect_location=str(result["defect_location"]),
        severity_level=result["severity"],
        is_rejected=result["should_reject"] if "should_reject" in result else result["defect_detected"],
        processing_time_ms=processing_time
    )
    db.add(detection)
    db.commit()
    
    result["processing_time"] = processing_time
    result["image_path"] = file_path
    
    return result

@router.post("/reject/{detection_id}")
async def reject_item(detection_id: int, db: Session = Depends(get_db)):
    """Manually reject an item"""
    detection = db.query(Detection).filter(Detection.id == detection_id).first()
    if not detection:
        raise HTTPException(status_code=404, detail="Detection not found")
    
    detection.is_rejected = True
    db.commit()
    
    return {"message": "Item rejected", "detection_id": detection_id}