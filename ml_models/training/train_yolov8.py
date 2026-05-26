"""
YOLOv8 Training Script for Defect Detection
CPU-Optimized Training
"""

import os
import yaml
from ultralytics import YOLO
import torch

def create_dataset_yaml():
    """Create dataset configuration YAML file"""
    dataset_config = {
        'path': './dataset',
        'train': 'images/train',
        'val': 'images/val',
        'test': 'images/test',
        'nc': 10,  # number of classes
        'names': [
            'scratch', 'dent', 'crack', 'hole', 'stain',
            'burr', 'deformation', 'discoloration', 'scratch_deep', 'normal'
        ]
    }
    
    with open('defect_dataset.yaml', 'w') as f:
        yaml.dump(dataset_config, f)
    
    return 'defect_dataset.yaml'

def train_yolov8(data_yaml, epochs=100, batch_size=8):
    """
    Train YOLOv8 model for defect detection
    CPU Optimized - Small batch size
    """
    # Load pretrained model (smallest version for CPU)
    model = YOLO('yolov8n.pt')  # nano version for CPU
    
    # Training parameters optimized for CPU
    results = model.train(
        data=data_yaml,
        epochs=epochs,
        imgsz=640,
        batch=batch_size,
        device='cpu',  # Force CPU
        workers=0,     # No multiprocessing for CPU
        patience=20,   # Early stopping
        save=True,
        save_period=10,
        project='defect_detection',
        name='yolov8_defect',
        exist_ok=True,
        pretrained=True,
        optimizer='AdamW',
        lr0=0.01,
        weight_decay=0.0005,
        momentum=0.937,
        warmup_epochs=3,
        warmup_momentum=0.8,
        box=7.5,
        cls=0.5,
        dfl=1.5,
        hsv_h=0.015,
        hsv_s=0.7,
        hsv_v=0.4,
        degrees=0.0,
        translate=0.1,
        scale=0.5,
        shear=0.0,
        perspective=0.0,
        flipud=0.0,
        fliplr=0.5,
        mosaic=1.0,
        mixup=0.0,
        copy_paste=0.0
    )
    
    print("Training completed!")
    return results

def validate_model(model_path):
    """Validate trained model"""
    model = YOLO(model_path)
    metrics = model.val(data='defect_dataset.yaml', device='cpu')
    print(f"Validation Results: {metrics}")
    return metrics

def export_model(model_path):
    """Export model for inference"""
    model = YOLO(model_path)
    
    # Export to ONNX for better CPU performance
    model.export(format='onnx', imgsz=640, device='cpu')
    
    # Export to TorchScript
    model.export(format='torchscript', imgsz=640)
    
    print("Model exported successfully!")

if __name__ == "__main__":
    # Create dataset configuration
    dataset_yaml = create_dataset_yaml()
    
    # Train model
    train_results = train_yolov8(dataset_yaml, epochs=50, batch_size=4)
    
    # Validate
    metrics = validate_model('defect_detection/yolov8_defect/weights/best.pt')
    
    # Export
    export_model('defect_detection/yolov8_defect/weights/best.pt')