import pytest
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from backend.app.services.yolov8_detector import YOLOv8Detector
from backend.app.services.image_processor import ImageProcessor
import cv2
import numpy as np

class TestDetection:
    
    @pytest.fixture
    def detector(self):
        return YOLOv8Detector()
    
    @pytest.fixture
    def processor(self):
        return ImageProcessor()
    
    @pytest.fixture
    def sample_image(self):
        # Create a test image
        img = np.zeros((640, 640, 3), dtype=np.uint8)
        return img
    
    def test_detector_initialization(self, detector):
        assert detector is not None
        assert detector.model is not None
    
    def test_detection_output_format(self, detector, sample_image):
        # Save test image
        cv2.imwrite("test_image.jpg", sample_image)
        
        result = detector.detect("test_image.jpg")
        
        assert "defect_detected" in result
        assert "defect_type" in result
        assert "confidence" in result
        assert "severity" in result
        
        # Cleanup
        os.remove("test_image.jpg")
    
    def test_confidence_threshold(self, detector):
        detector.update_confidence_threshold(0.7)
        assert detector.confidence_threshold == 0.7
        
        detector.update_confidence_threshold(0.3)
        assert detector.confidence_threshold == 0.3
    
    def test_severity_calculation(self, detector):
        severity = detector._calculate_severity(0.9, "crack")
        assert severity == "high"
        
        severity = detector._calculate_severity(0.6, "scratch")
        assert severity == "medium"
        
        severity = detector._calculate_severity(0.4, "stain")
        assert severity == "very_low"
    
    def test_image_processor(self, processor, sample_image):
        cv2.imwrite("test_img.jpg", sample_image)
        
        annotated_path = processor.draw_bounding_boxes(
            "test_img.jpg",
            {"x_min": 100, "y_min": 100, "x_max": 200, "y_max": 200},
            "scratch",
            0.85
        )
        
        assert os.path.exists(annotated_path)
        
        # Cleanup
        os.remove("test_img.jpg")
        if os.path.exists(annotated_path):
            os.remove(annotated_path)

if __name__ == "__main__":
    pytest.main([__file__])