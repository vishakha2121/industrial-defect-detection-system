import cv2
import numpy as np
import os
import uuid
from typing import Dict, Tuple
import logging

logger = logging.getLogger(__name__)

class ImageProcessor:
    def __init__(self):
        self.output_dir = "static/results"
        os.makedirs(self.output_dir, exist_ok=True)
    
    def draw_bounding_boxes(self, image_path: str, defect_location: Dict, defect_type: str, confidence: float) -> str:
        """Draw bounding boxes on image"""
        try:
            image = cv2.imread(image_path)
            if image is None:
                return image_path
            
            if defect_location and 'x_min' in defect_location:
                x1 = int(defect_location.get('x_min', 0))
                y1 = int(defect_location.get('y_min', 0))
                x2 = int(defect_location.get('x_max', 100))
                y2 = int(defect_location.get('y_max', 100))
                
                # Draw rectangle
                color = (0, 0, 255) if confidence > 0.7 else (0, 165, 255)
                cv2.rectangle(image, (x1, y1), (x2, y2), color, 2)
                
                # Add label
                label = f"{defect_type}: {confidence:.2f}"
                cv2.putText(image, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
            
            # Save
            unique_name = f"annotated_{uuid.uuid4().hex}.jpg"
            output_path = os.path.join(self.output_dir, unique_name)
            cv2.imwrite(output_path, image)
            
            return output_path
            
        except Exception as e:
            logger.error(f"Error drawing boxes: {e}")
            return image_path