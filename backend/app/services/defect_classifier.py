import torch
import torch.nn as nn
import torchvision.transforms as transforms
from torchvision import models
import cv2
import numpy as np
from PIL import Image
import os
import json
import logging
from typing import Dict, Tuple

logger = logging.getLogger(__name__)

class DefectClassifier:
    def __init__(self, model_path: str = "models/defect_model.pth"):
        self.model_path = model_path
        self.model = None
        self.classes = []
        self.device = torch.device('cpu')  # Force CPU usage
        self.load_model()
        self.load_class_names()
    
    def load_model(self):
        """Load transfer learning model (MobileNetV2)"""
        try:
            # Use MobileNetV2 (lightweight for CPU)
            self.model = models.mobilenet_v2(pretrained=True)
            
            # Modify classifier for defect classes
            num_classes = 10  # Common defect types
            self.model.classifier[1] = nn.Linear(1280, num_classes)
            
            # Load weights if exists
            if os.path.exists(self.model_path):
                self.model.load_state_dict(torch.load(self.model_path, map_location=self.device))
                logger.info(f"Defect classifier loaded from {self.model_path}")
            else:
                logger.warning("Defect classifier weights not found. Using untrained model.")
            
            self.model = self.model.to(self.device)
            self.model.eval()
            
        except Exception as e:
            logger.error(f"Error loading classifier: {e}")
            self.model = None
    
    def load_class_names(self):
        """Load defect class names"""
        class_file = "models/classes.json"
        if os.path.exists(class_file):
            with open(class_file, 'r') as f:
                self.classes = json.load(f)
        else:
            # Default defect classes
            self.classes = [
                "scratch", "dent", "crack", "hole", "stain",
                "burr", "deformation", "discoloration", "scratch_deep", "normal"
            ]
    
    def classify(self, image: np.ndarray) -> Tuple[str, float]:
        """
        Classify defect type using CNN
        Returns (defect_type, confidence)
        """
        if self.model is None:
            return "unknown", 0.0
        
        try:
            # Preprocess image
            processed_image = self._preprocess_image(image)
            
            # Inference
            with torch.no_grad():
                outputs = self.model(processed_image)
                probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
                confidence, predicted = torch.max(probabilities, 0)
            
            defect_type = self.classes[predicted.item()] if predicted.item() < len(self.classes) else "unknown"
            confidence_score = confidence.item()
            
            return defect_type, confidence_score
            
        except Exception as e:
            logger.error(f"Classification error: {e}")
            return "classification_error", 0.0
    
    def _preprocess_image(self, image: np.ndarray) -> torch.Tensor:
        """Preprocess image for model input"""
        # Convert BGR to RGB
        if len(image.shape) == 3 and image.shape[2] == 3:
            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        else:
            image_rgb = image
        
        # Convert to PIL
        pil_image = Image.fromarray(image_rgb)
        
        # Transform
        transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
        
        tensor_image = transform(pil_image).unsqueeze(0)
        return tensor_image.to(self.device)
    
    def get_defect_severity(self, defect_type: str, confidence: float) -> str:
        """Determine severity based on defect type and confidence"""
        high_severity = ["crack", "hole", "break"]
        medium_severity = ["dent", "scratch_deep", "deformation"]
        
        if defect_type in high_severity:
            return "high"
        elif defect_type in medium_severity:
            return "medium" if confidence > 0.7 else "low"
        elif confidence > 0.8:
            return "medium"
        else:
            return "low"