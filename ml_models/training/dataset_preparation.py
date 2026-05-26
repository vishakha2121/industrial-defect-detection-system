"""
Dataset Preparation for Defect Detection
Organize and preprocess image datasets
"""

import os
import shutil
import random
import cv2
import numpy as np
from sklearn.model_selection import train_test_split
import json
from tqdm import tqdm

class DatasetPreparator:
    def __init__(self, source_dir, target_dir):
        self.source_dir = source_dir
        self.target_dir = target_dir
        self.classes = [
            'scratch', 'dent', 'crack', 'hole', 'stain',
            'burr', 'deformation', 'discoloration', 'scratch_deep', 'normal'
        ]
    
    def organize_dataset(self, train_ratio=0.7, val_ratio=0.15, test_ratio=0.15):
        """Organize dataset into train/val/test splits"""
        
        # Create directories
        for split in ['train', 'val', 'test']:
            for cls in self.classes:
                os.makedirs(os.path.join(self.target_dir, split, cls), exist_ok=True)
        
        # Collect all images
        all_images = []
        for cls in self.classes:
            cls_dir = os.path.join(self.source_dir, cls)
            if os.path.exists(cls_dir):
                images = [os.path.join(cls_dir, f) for f in os.listdir(cls_dir) 
                         if f.endswith(('.jpg', '.png', '.jpeg'))]
                all_images.extend([(img, cls) for img in images])
        
        # Shuffle and split
        random.shuffle(all_images)
        train_end = int(len(all_images) * train_ratio)
        val_end = int(len(all_images) * (train_ratio + val_ratio))
        
        train_data = all_images[:train_end]
        val_data = all_images[train_end:val_end]
        test_data = all_images[val_end:]
        
        # Copy files to respective directories
        for img_path, cls in tqdm(train_data, desc="Copying training data"):
            dest = os.path.join(self.target_dir, 'train', cls, os.path.basename(img_path))
            shutil.copy2(img_path, dest)
        
        for img_path, cls in tqdm(val_data, desc="Copying validation data"):
            dest = os.path.join(self.target_dir, 'val', cls, os.path.basename(img_path))
            shutil.copy2(img_path, dest)
        
        for img_path, cls in tqdm(test_data, desc="Copying test data"):
            dest = os.path.join(self.target_dir, 'test', cls, os.path.basename(img_path))
            shutil.copy2(img_path, dest)
        
        print(f"Dataset organized:")
        print(f"Training: {len(train_data)} images")
        print(f"Validation: {len(val_data)} images")
        print(f"Test: {len(test_data)} images")
        
        # Save class mapping
        class_mapping = {i: cls for i, cls in enumerate(self.classes)}
        with open(os.path.join(self.target_dir, 'class_mapping.json'), 'w') as f:
            json.dump(class_mapping, f)
        
        return train_data, val_data, test_data
    
    def preprocess_images(self, input_dir, output_dir, target_size=(640, 640)):
        """Preprocess images: resize, normalize, enhance"""
        os.makedirs(output_dir, exist_ok=True)
        
        for root, dirs, files in os.walk(input_dir):
            for file in tqdm(files, desc="Preprocessing images"):
                if file.endswith(('.jpg', '.png', '.jpeg')):
                    input_path = os.path.join(root, file)
                    rel_path = os.path.relpath(input_path, input_dir)
                    output_path = os.path.join(output_dir, rel_path)
                    
                    os.makedirs(os.path.dirname(output_path), exist_ok=True)
                    
                    # Read and preprocess
                    img = cv2.imread(input_path)
                    if img is None:
                        continue
                    
                    # Resize
                    img = cv2.resize(img, target_size)
                    
                    # Apply CLAHE for contrast enhancement
                    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
                    l, a, b = cv2.split(lab)
                    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
                    l = clahe.apply(l)
                    lab = cv2.merge([l, a, b])
                    img = cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)
                    
                    # Denoise
                    img = cv2.fastNlMeansDenoisingColored(img, None, 10, 10, 7, 21)
                    
                    # Save preprocessed image
                    cv2.imwrite(output_path, img)
        
        print(f"Preprocessing complete! Images saved to {output_dir}")
    
    def create_annotations(self, image_dir, output_file):
        """Create COCO-style annotations for detection"""
        annotations = {
            "images": [],
            "annotations": [],
            "categories": [{"id": i, "name": cls} for i, cls in enumerate(self.classes)]
        }
        
        annotation_id = 1
        image_id = 1
        
        for cls_id, cls_name in enumerate(self.classes):
            cls_dir = os.path.join(image_dir, cls_name)
            if os.path.exists(cls_dir):
                for img_file in os.listdir(cls_dir):
                    if img_file.endswith(('.jpg', '.png', '.jpeg')):
                        img_path = os.path.join(cls_dir, img_file)
                        img = cv2.imread(img_path)
                        
                        if img is not None:
                            h, w = img.shape[:2]
                            
                            annotations["images"].append({
                                "id": image_id,
                                "file_name": img_file,
                                "width": w,
                                "height": h
                            })
                            
                            # Full image annotation for classification
                            annotations["annotations"].append({
                                "id": annotation_id,
                                "image_id": image_id,
                                "category_id": cls_id,
                                "bbox": [0, 0, w, h],
                                "area": w * h,
                                "iscrowd": 0
                            })
                            
                            annotation_id += 1
                            image_id += 1
        
        with open(output_file, 'w') as f:
            json.dump(annotations, f)
        
        print(f"Annotations saved to {output_file}")

if __name__ == "__main__":
    preparator = DatasetPreparator(
        source_dir="raw_dataset",
        target_dir="processed_dataset"
    )
    
    # Organize dataset
    preparator.organize_dataset()
    
    # Preprocess images
    preparator.preprocess_images("processed_dataset", "preprocessed_dataset")
    
    # Create annotations
    preparator.create_annotations("preprocessed_dataset", "annotations.json")