"""
CNN Transfer Learning for Defect Classification
MobileNetV2 - CPU Optimized
"""

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, Dataset
from torchvision import transforms, models
import os
import cv2
import numpy as np
from PIL import Image
import json
from sklearn.model_selection import train_test_split

class DefectDataset(Dataset):
    """Custom dataset for defect classification"""
    
    def __init__(self, image_paths, labels, transform=None):
        self.image_paths = image_paths
        self.labels = labels
        self.transform = transform
    
    def __len__(self):
        return len(self.image_paths)
    
    def __getitem__(self, idx):
        image = cv2.imread(self.image_paths[idx])
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        image = Image.fromarray(image)
        
        if self.transform:
            image = self.transform(image)
        
        label = self.labels[idx]
        return image, label

class DefectClassifier:
    def __init__(self, num_classes=10):
        self.device = torch.device('cpu')
        self.num_classes = num_classes
        self.model = self._build_model()
        self.transform = self._get_transforms()
    
    def _build_model(self):
        """Build MobileNetV2 model for transfer learning"""
        model = models.mobilenet_v2(pretrained=True)
        
        # Freeze early layers
        for param in model.features.parameters():
            param.requires_grad = False
        
        # Unfreeze last few layers for fine-tuning
        for param in model.features[-3:].parameters():
            param.requires_grad = True
        
        # Replace classifier
        model.classifier = nn.Sequential(
            nn.Dropout(0.2),
            nn.Linear(model.last_channel, 512),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(512, self.num_classes)
        )
        
        return model.to(self.device)
    
    def _get_transforms(self):
        """Data augmentation transforms"""
        train_transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.RandomHorizontalFlip(),
            transforms.RandomRotation(10),
            transforms.ColorJitter(brightness=0.2, contrast=0.2),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                               std=[0.229, 0.224, 0.225])
        ])
        
        val_transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                               std=[0.229, 0.224, 0.225])
        ])
        
        return {'train': train_transform, 'val': val_transform}
    
    def train(self, train_loader, val_loader, epochs=30):
        """Train the classifier"""
        criterion = nn.CrossEntropyLoss()
        optimizer = optim.AdamW(self.model.parameters(), lr=0.001, weight_decay=0.01)
        scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode='min', patience=5)
        
        best_val_acc = 0
        
        for epoch in range(epochs):
            # Training phase
            self.model.train()
            train_loss = 0
            train_correct = 0
            
            for images, labels in train_loader:
                images, labels = images.to(self.device), labels.to(self.device)
                
                optimizer.zero_grad()
                outputs = self.model(images)
                loss = criterion(outputs, labels)
                loss.backward()
                optimizer.step()
                
                train_loss += loss.item()
                _, predicted = outputs.max(1)
                train_correct += predicted.eq(labels).sum().item()
            
            train_acc = 100. * train_correct / len(train_loader.dataset)
            
            # Validation phase
            val_loss, val_acc = self.validate(val_loader, criterion)
            
            scheduler.step(val_loss)
            
            print(f'Epoch [{epoch+1}/{epochs}]')
            print(f'Train Loss: {train_loss/len(train_loader):.4f}, Train Acc: {train_acc:.2f}%')
            print(f'Val Loss: {val_loss:.4f}, Val Acc: {val_acc:.2f}%')
            
            # Save best model
            if val_acc > best_val_acc:
                best_val_acc = val_acc
                self.save_model('models/defect_classifier_best.pth')
                print(f"Saved best model with accuracy: {val_acc:.2f}%")
        
        return best_val_acc
    
    def validate(self, val_loader, criterion):
        """Validate the model"""
        self.model.eval()
        val_loss = 0
        val_correct = 0
        
        with torch.no_grad():
            for images, labels in val_loader:
                images, labels = images.to(self.device), labels.to(self.device)
                outputs = self.model(images)
                loss = criterion(outputs, labels)
                
                val_loss += loss.item()
                _, predicted = outputs.max(1)
                val_correct += predicted.eq(labels).sum().item()
        
        val_loss = val_loss / len(val_loader)
        val_acc = 100. * val_correct / len(val_loader.dataset)
        
        return val_loss, val_acc
    
    def save_model(self, path):
        """Save model weights"""
        torch.save({
            'model_state_dict': self.model.state_dict(),
            'num_classes': self.num_classes
        }, path)
        print(f"Model saved to {path}")
    
    def load_model(self, path):
        """Load model weights"""
        checkpoint = torch.load(path, map_location=self.device)
        self.model.load_state_dict(checkpoint['model_state_dict'])
        self.num_classes = checkpoint['num_classes']
        print(f"Model loaded from {path}")

if __name__ == "__main__":
    # Example training
    classifier = DefectClassifier(num_classes=10)
    
    # Load your dataset here
    # train_loader, val_loader = prepare_dataloaders()
    # classifier.train(train_loader, val_loader)
    
    print("Classifier training script ready!")