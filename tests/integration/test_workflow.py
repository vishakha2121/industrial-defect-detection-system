import pytest
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from fastapi.testclient import TestClient
from backend.app.main import app
import cv2
import numpy as np

client = TestClient(app)

class TestWorkflow:
    
    @pytest.fixture
    def test_image(self):
        # Create a test image with synthetic defect
        img = np.ones((640, 640, 3), dtype=np.uint8) * 255
        
        # Draw a synthetic scratch
        cv2.line(img, (100, 100), (300, 100), (0, 0, 0), 2)
        
        # Save temporarily
        test_path = "test_scratch.jpg"
        cv2.imwrite(test_path, img)
        
        yield test_path
        
        # Cleanup
        if os.path.exists(test_path):
            os.remove(test_path)
    
    def test_complete_detection_workflow(self, test_image):
        # 1. Upload image
        with open(test_image, 'rb') as f:
            response = client.post(
                "/api/detection/upload",
                files={"file": ("test.jpg", f, "image/jpeg")}
            )
        
        assert response.status_code == 200
        result = response.json()
        
        assert "defect_detected" in result
        assert "defect_type" in result
        
        # 2. Get history
        history_response = client.get("/api/history/")
        assert history_response.status_code == 200
        
        # 3. Get statistics
        stats_response = client.get("/api/stats/overall")
        assert stats_response.status_code == 200
        assert "total_inspections" in stats_response.json()
        
        # 4. Update settings
        settings_response = client.put("/api/settings/thresholds", json={
            "confidence_threshold": 0.6,
            "iou_threshold": 0.5,
            "auto_reject_enabled": True
        })
        assert settings_response.status_code == 200
    
    def test_batch_workflow(self):
        # Start batch
        response = client.post("/api/detection/batch/start", params={"batch_name": "Test Batch"})
        assert response.status_code == 200
        batch_id = response.json()["batch_id"]
        
        # End batch
        end_response = client.post(f"/api/detection/batch/end/{batch_id}")
        assert end_response.status_code == 200

if __name__ == "__main__":
    pytest.main([__file__])