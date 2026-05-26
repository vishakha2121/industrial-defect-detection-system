import pytest
from fastapi.testclient import TestClient
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from backend.app.main import app

client = TestClient(app)

class TestAPI:
    
    def test_root_endpoint(self):
        response = client.get("/")
        assert response.status_code == 200
        assert "message" in response.json()
    
    def test_health_check(self):
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"
    
    def test_get_stats(self):
        response = client.get("/api/stats/overall")
        assert response.status_code == 200
        assert "total_inspections" in response.json()
    
    def test_get_settings(self):
        response = client.get("/api/settings/")
        assert response.status_code == 200
        assert isinstance(response.json(), dict)
    
    def test_update_thresholds(self):
        response = client.put("/api/settings/thresholds", json={
            "confidence_threshold": 0.65,
            "iou_threshold": 0.5,
            "auto_reject_enabled": True
        })
        assert response.status_code == 200
    
    def test_get_history(self):
        response = client.get("/api/history/")
        assert response.status_code == 200
        assert "detections" in response.json()
    
    def test_get_defect_types(self):
        response = client.get("/api/stats/defect-types")
        assert response.status_code == 200
        assert isinstance(response.json(), list)
    
    def test_websocket(self):
        with client.websocket_connect("/ws/detection") as websocket:
            websocket.send_text("Hello")
            data = websocket.receive_text()
            assert "Echo" in data

if __name__ == "__main__":
    pytest.main([__file__])