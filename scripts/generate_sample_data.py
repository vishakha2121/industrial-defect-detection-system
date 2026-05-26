#!/usr/bin/env python3
"""
Generate Sample Data for Testing
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from backend.app.database import SessionLocal
from backend.app.models import Detection, DefectType, SystemSetting, InspectionBatch
from datetime import datetime, timedelta
import random

def generate_sample_detections():
    """Generate sample detection records"""
    db = SessionLocal()
    
    defect_types = ['scratch', 'dent', 'crack', 'hole', 'stain', 'normal']
    severities = ['low', 'medium', 'high', 'critical']
    
    try:
        # Generate detections for last 30 days
        for day in range(30):
            date = datetime.now() - timedelta(days=day)
            num_detections = random.randint(50, 150)
            
            for _ in range(num_detections):
                defect = random.choice(defect_types)
                confidence = random.uniform(0.5, 0.98)
                severity = random.choice(severities) if defect != 'normal' else 'none'
                is_rejected = defect != 'normal' and random.random() > 0.3
                
                detection = Detection(
                    image_path=f"/static/uploads/sample_{day}_{_}.jpg",
                    defect_type=defect,
                    confidence_score=confidence,
                    severity_level=severity,
                    is_rejected=is_rejected,
                    processing_time_ms=random.uniform(150, 500),
                    inspection_time=date + timedelta(hours=random.randint(8, 17))
                )
                db.add(detection)
        
        db.commit()
        print(f"Generated {30 * 100} sample detections")
        
    except Exception as e:
        print(f"Error generating detections: {e}")
        db.rollback()
    finally:
        db.close()

def generate_sample_batches():
    """Generate sample batch records"""
    db = SessionLocal()
    
    try:
        for day in range(30):
            date = datetime.now() - timedelta(days=day)
            
            # Morning batch
            morning_batch = InspectionBatch(
                batch_name=f"Morning Batch - {date.strftime('%Y-%m-%d')}",
                total_items=random.randint(80, 120),
                rejected_items=random.randint(5, 20),
                accepted_items=random.randint(60, 100),
                start_time=date.replace(hour=8, minute=0, second=0),
                end_time=date.replace(hour=12, minute=0, second=0),
                status="completed"
            )
            db.add(morning_batch)
            
            # Afternoon batch
            afternoon_batch = InspectionBatch(
                batch_name=f"Afternoon Batch - {date.strftime('%Y-%m-%d')}",
                total_items=random.randint(80, 120),
                rejected_items=random.randint(5, 20),
                accepted_items=random.randint(60, 100),
                start_time=date.replace(hour=13, minute=0, second=0),
                end_time=date.replace(hour=17, minute=0, second=0),
                status="completed"
            )
            db.add(afternoon_batch)
        
        db.commit()
        print("Generated sample batches")
        
    except Exception as e:
        print(f"Error generating batches: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Generating sample data...")
    generate_sample_detections()
    generate_sample_batches()
    print("Sample data generation complete!")