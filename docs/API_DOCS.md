# API Documentation - Industrial Defect Detection System

## Base URL
`http://localhost:8000`

## Authentication
Currently no authentication required (practice environment)

## Endpoints

### Detection API

#### Upload Image for Detection
`POST /api/detection/upload`

**Request:** multipart/form-data
- `file`: Image file (jpg, jpeg, png)

**Response:**
```json
{
  "defect_detected": true,
  "defect_type": "scratch",
  "confidence": 0.85,
  "defect_location": {"x_min": 100, "y_min": 100, "x_max": 200, "y_max": 120},
  "severity": "medium",
  "should_reject": true,
  "processing_time": 245.3
}