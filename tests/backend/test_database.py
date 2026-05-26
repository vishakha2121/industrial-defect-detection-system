import pytest
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from backend.app.database import get_db, engine
from backend.app.models import Detection, DefectType, Base
from sqlalchemy.orm import Session
from datetime import datetime

class TestDatabase:
    
    @pytest.fixture
    def db_session(self):
        # Create tables
        Base.metadata.create_all(bind=engine)
        
        db = Session(engine)
        try:
            yield db
        finally:
            db.rollback()
            db.close()
    
    def test_create_detection(self, db_session):
        detection = Detection(
            image_path="/test/path.jpg",
            defect_type="scratch",
            confidence_score=0.85,
            is_rejected=True,
            processing_time_ms=245
        )
        
        db_session.add(detection)
        db_session.commit()
        
        assert detection.id is not None
        assert detection.defect_type == "scratch"
    
    def test_query_detections(self, db_session):
        # Add test data
        for i in range(5):
            detection = Detection(
                image_path=f"/test/path_{i}.jpg",
                defect_type="scratch" if i % 2 == 0 else "dent",
                confidence_score=0.8,
                is_rejected=i % 3 == 0,
                processing_time_ms=200
            )
            db_session.add(detection)
        db_session.commit()
        
        # Query
        detections = db_session.query(Detection).all()
        assert len(detections) == 5
        
        scratch_detections = db_session.query(Detection).filter(
            Detection.defect_type == "scratch"
        ).all()
        assert len(scratch_detections) >= 2
    
    def test_defect_type_crud(self, db_session):
        defect_type = DefectType(
            name="test_defect",
            severity_level="medium",
            threshold_value=0.6,
            auto_reject_enabled=True
        )
        
        db_session.add(defect_type)
        db_session.commit()
        
        retrieved = db_session.query(DefectType).filter(
            DefectType.name == "test_defect"
        ).first()
        
        assert retrieved is not None
        assert retrieved.severity_level == "medium"
        
        # Update
        retrieved.threshold_value = 0.7
        db_session.commit()
        
        # Delete
        db_session.delete(retrieved)
        db_session.commit()
        
        deleted = db_session.query(DefectType).filter(
            DefectType.name == "test_defect"
        ).first()
        assert deleted is None

if __name__ == "__main__":
    pytest.main([__file__])