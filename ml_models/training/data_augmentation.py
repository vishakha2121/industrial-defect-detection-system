"""
Advanced Data Augmentation for Defect Detection
"""

import cv2
import numpy as np
import albumentations as A
from albumentations.pytorch import ToTensorV2
import random
import os
from tqdm import tqdm

class DefectAugmentation:
    def __init__(self):
        self.train_transforms = A.Compose([
            A.RandomResizedCrop(height=640, width=640, scale=(0.8, 1.0)),
            A.HorizontalFlip(p=0.5),
            A.VerticalFlip(p=0.3),
            A.RandomRotate90(p=0.3),
            A.ShiftScaleRotate(shift_limit=0.05, scale_limit=0.1, rotate_limit=15, p=0.5),
            A.OneOf([
                A.GaussNoise(var_limit=(10.0, 50.0), p=0.5),
                A.GaussianBlur(blur_limit=(3, 7), p=0.5),
            ], p=0.3),
            A.OneOf([
                A.CLAHE(clip_limit=2.0, tile_grid_size=(8, 8), p=0.5),
                A.RandomBrightnessContrast(brightness_limit=0.2, contrast_limit=0.2, p=0.5),
            ], p=0.5),
            A.CoarseDropout(max_holes=8, max_height=32, max_width=32, p=0.3),
            A.RandomShadow(shadow_roi=(0, 0.5, 1, 1), num_shadows_lower=1, num_shadows_upper=2, p=0.2),
            A.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
            ToTensorV2()
        ])
        
        self.val_transforms = A.Compose([
            A.Resize(height=640, width=640),
            A.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
            ToTensorV2()
        ])
    
    def apply_augmentation(self, image, bboxes=None, labels=None):
        """Apply augmentation to image and bounding boxes"""
        if bboxes and labels:
            transformed = self.train_transforms(
                image=image,
                bboxes=bboxes,
                labels=labels
            )
            return transformed['image'], transformed['bboxes'], transformed['labels']
        else:
            transformed = self.train_transforms(image=image)
            return transformed['image'], None, None
    
    def generate_synthetic_defects(self, image, defect_type='scratch'):
        """Generate synthetic defects on normal images"""
        augmented_image = image.copy()
        h, w = image.shape[:2]
        
        if defect_type == 'scratch':
            # Draw random scratches
            num_scratches = random.randint(1, 5)
            for _ in range(num_scratches):
                x1, y1 = random.randint(0, w), random.randint(0, h)
                x2, y2 = random.randint(0, w), random.randint(0, h)
                thickness = random.randint(1, 3)
                color = (random.randint(0, 50), random.randint(0, 50), random.randint(0, 50))
                cv2.line(augmented_image, (x1, y1), (x2, y2), color, thickness)
        
        elif defect_type == 'dent':
            # Simulate dent by blurring a circular region
            cx, cy = random.randint(50, w-50), random.randint(50, h-50)
            radius = random.randint(20, 50)
            mask = np.zeros((h, w), dtype=np.uint8)
            cv2.circle(mask, (cx, cy), radius, 255, -1)
            blurred = cv2.GaussianBlur(augmented_image, (21, 21), 0)
            augmented_image = np.where(mask[:, :, np.newaxis] == 255, blurred, augmented_image)
        
        elif defect_type == 'stain':
            # Add color stain
            cx, cy = random.randint(20, w-20), random.randint(20, h-20)
            radius = random.randint(10, 30)
            color = (random.randint(100, 200), random.randint(100, 200), random.randint(100, 200))
            cv2.circle(augmented_image, (cx, cy), radius, color, -1)
            # Blend
            alpha = random.uniform(0.3, 0.7)
            cv2.circle(augmented_image, (cx, cy), radius, color, -1)
            cv2.addWeighted(augmented_image, alpha, image, 1-alpha, 0, augmented_image)
        
        return augmented_image
    
    def augment_dataset(self, input_dir, output_dir, num_augmentations=5):
        """Generate augmented dataset"""
        os.makedirs(output_dir, exist_ok=True)
        
        for root, dirs, files in os.walk(input_dir):
            for file in tqdm(files, desc="Augmenting dataset"):
                if file.endswith(('.jpg', '.png', '.jpeg')):
                    input_path = os.path.join(root, file)
                    img = cv2.imread(input_path)
                    
                    if img is None:
                        continue
                    
                    # Save original
                    rel_path = os.path.relpath(input_path, input_dir)
                    output_path = os.path.join(output_dir, rel_path)
                    os.makedirs(os.path.dirname(output_path), exist_ok=True)
                    cv2.imwrite(output_path, img)
                    
                    # Generate augmented versions
                    for i in range(num_augmentations):
                        # Random augmentation
                        augmented = self.apply_augmentation(img)[0]
                        
                        # Convert tensor back to numpy for saving
                        if hasattr(augmented, 'numpy'):
                            augmented = augmented.numpy().transpose(1, 2, 0)
                            augmented = (augmented * np.array([0.229, 0.224, 0.225]) + 
                                       np.array([0.485, 0.456, 0.406])) * 255
                            augmented = augmented.astype(np.uint8)
                        
                        aug_path = os.path.join(output_dir, 
                                               os.path.splitext(rel_path)[0] + f'_aug_{i}.jpg')
                        cv2.imwrite(aug_path, augmented)
                        
                        # Generate synthetic defects for normal images
                        if 'normal' in rel_path:
                            for defect in ['scratch', 'dent', 'stain']:
                                synthetic = self.generate_synthetic_defects(img, defect)
                                synth_path = os.path.join(output_dir,
                                                         os.path.splitext(rel_path)[0] + f'_synth_{defect}_{i}.jpg')
                                cv2.imwrite(synth_path, synthetic)
        
        print(f"Augmentation complete! Generated images in {output_dir}")

if __name__ == "__main__":
    augmentor = DefectAugmentation()
    augmentor.augment_dataset("processed_dataset", "augmented_dataset", num_augmentations=3)