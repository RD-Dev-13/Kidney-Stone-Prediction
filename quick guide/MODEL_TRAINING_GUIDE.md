# AI Model Training Guide

Complete guide for training the kidney stone detection AI models using deep learning with transfer learning.

## Overview

This system trains two state-of-the-art convolutional neural networks:
- **EfficientNetB0**: Lightweight, efficient architecture
- **ResNet50**: Deep residual network with skip connections

Both models use transfer learning from ImageNet pre-trained weights and are fine-tuned for medical image classification.

## Prerequisites

### System Requirements
- **RAM**: Minimum 8GB (16GB recommended)
- **Storage**: ~5GB free space for dataset and models
- **GPU**: Optional but recommended (CUDA-compatible)
- **Python**: 3.8 or higher

### Dependencies
```bash
pip install tensorflow keras scikit-learn matplotlib seaborn opencv-python pillow numpy
```

## Dataset Structure

Ensure your dataset follows this exact structure:
```
Kidney Ultrasound Images Stone and No Stone/
├── Normal/                    # Healthy kidney images
│   ├── image001.jpg
│   ├── image002.jpg
│   └── ...
└── stone/                     # Kidney stone images
    ├── image001.jpg
    ├── image002.jpg
    └── ...
```

### Dataset Requirements
- **Image Formats**: JPG, JPEG, PNG
- **Minimum Images**: 100+ per class (more is better)
- **Image Quality**: Clear, medical-grade ultrasound images
- **Resolution**: Any size (automatically resized to 224x224)

## Training Process

### Quick Start
```bash
python3 train_model.py
```

### Manual Training Steps

#### 1. Initialize the Training System
```python
from train_model import KidneyStoneDetector

# Initialize with dataset path
detector = KidneyStoneDetector('Kidney Ultrasound Images Stone and No Stone')
```

#### 2. Data Preparation
The system automatically:
- **Splits data**: 70% training, 15% validation, 15% testing
- **Applies augmentation**: Rotation, shifts, zoom, brightness, horizontal flip
- **Normalizes images**: Rescales pixel values to [0,1]
- **Resizes images**: Standardizes to 224x224 pixels

#### 3. Model Architecture

**EfficientNetB0 Configuration:**
```python
Base Model: EfficientNetB0 (ImageNet weights)
├── GlobalAveragePooling2D
├── Dense(128, activation='relu')
├── Dropout(0.5)
└── Dense(1, activation='sigmoid')  # Binary classification
```

**ResNet50 Configuration:**
```python
Base Model: ResNet50 (ImageNet weights)
├── GlobalAveragePooling2D
├── Dense(128, activation='relu')
├── Dropout(0.5)
└── Dense(1, activation='sigmoid')  # Binary classification
```

#### 4. Training Strategy

**Phase 1: Transfer Learning (20 epochs)**
- Base model layers frozen
- Only train custom classification head
- Learning rate: 0.001
- Optimizer: Adam

**Phase 2: Fine-tuning (10 epochs)**
- Unfreeze all layers
- Lower learning rate: 0.0001
- Continue training entire network

#### 5. Training Callbacks
- **Early Stopping**: Stops if validation loss doesn't improve (patience=5)
- **Learning Rate Reduction**: Reduces LR by 50% if no improvement (patience=3)
- **Best Weights**: Automatically saves best performing model

## Data Augmentation

The training pipeline applies these augmentations to increase dataset diversity:

```python
ImageDataGenerator(
    rescale=1./255,              # Normalize to [0,1]
    rotation_range=20,           # Rotate ±20 degrees
    width_shift_range=0.2,       # Horizontal shift ±20%
    height_shift_range=0.2,      # Vertical shift ±20%
    shear_range=0.2,            # Shear transformation
    zoom_range=0.2,             # Zoom ±20%
    horizontal_flip=True,        # Random horizontal flip
    brightness_range=[0.8, 1.2], # Brightness variation
    validation_split=0.3         # 30% for validation+test
)
```

## Model Evaluation

### Metrics Calculated
- **Accuracy**: Overall correct predictions
- **Precision**: True positives / (True positives + False positives)
- **Recall**: True positives / (True positives + False negatives)
- **F1-Score**: Harmonic mean of precision and recall
- **ROC-AUC**: Area under the receiver operating characteristic curve

### Visualization Outputs
- **Confusion Matrix**: Shows classification performance
- **ROC Curve**: Plots true positive vs false positive rates
- **Training History**: Loss and accuracy curves over epochs

### Generated Files
After training, these files are created:
```
best_kidney_stone_model_efficientnet.h5    # Best EfficientNet model
best_kidney_stone_model_resnet50.h5        # Best ResNet50 model
efficientnet_confusion_matrix.png          # EfficientNet evaluation
resnet50_confusion_matrix.png              # ResNet50 evaluation
```

## Training Output Example

```
Training EfficientNetB0...
Epoch 1/20
45/45 [==============================] - 120s 3s/step - loss: 0.6234 - accuracy: 0.6789
...
Epoch 15/20
45/45 [==============================] - 98s 2s/step - loss: 0.2156 - accuracy: 0.9123

Fine-tuning EfficientNetB0...
Epoch 1/10
45/45 [==============================] - 145s 3s/step - loss: 0.1876 - accuracy: 0.9234
...

EFFICIENTNETB0 Results:
              precision    recall  f1-score   support
      Normal       0.92      0.89      0.90        45
       Stone       0.90      0.93      0.91        47
    accuracy                           0.91        92
   macro avg       0.91      0.91      0.91        92
weighted avg       0.91      0.91      0.91        92

ROC-AUC: 0.9567

Training ResNet50...
...

Best model (efficientnet) saved!
```

## Troubleshooting

### Common Issues

#### 1. Out of Memory Error
```bash
# Reduce batch size
detector = KidneyStoneDetector(batch_size=16)  # Default is 32
```

#### 2. Dataset Not Found
```bash
# Verify folder structure
ls "Kidney Ultrasound Images Stone and No Stone"
# Should show: Normal/ stone/
```

#### 3. Low Accuracy
- **More Data**: Add more training images
- **Better Quality**: Use higher quality medical images
- **Balanced Classes**: Ensure similar number of Normal/Stone images
- **Longer Training**: Increase epochs if early stopping occurs too soon

#### 4. Training Too Slow
- **GPU**: Install CUDA and cuDNN for GPU acceleration
- **Batch Size**: Increase if you have more RAM/VRAM
- **Smaller Model**: Use only EfficientNetB0 (faster than ResNet50)

### Performance Optimization

#### For Better Accuracy
```python
# Increase training epochs
detector.train_model('efficientnet', epochs=30)

# Add more augmentation
train_datagen = ImageDataGenerator(
    # ... existing augmentations ...
    fill_mode='nearest',
    channel_shift_range=0.1
)
```

#### For Faster Training
```python
# Use smaller input size
detector = KidneyStoneDetector(img_size=(128, 128))

# Reduce model complexity
# Train only EfficientNetB0 (skip ResNet50)
```

## Advanced Configuration

### Custom Model Architecture
```python
def create_custom_model(base_model_name='efficientnet'):
    if base_model_name == 'efficientnet':
        base_model = EfficientNetB0(weights='imagenet', include_top=False)
    
    # Custom head
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(256, activation='relu')(x)  # Larger dense layer
    x = Dropout(0.3)(x)                   # Less dropout
    x = Dense(128, activation='relu')(x)
    x = Dropout(0.3)(x)
    predictions = Dense(1, activation='sigmoid')(x)
    
    model = Model(inputs=base_model.input, outputs=predictions)
    return model
```

### Custom Training Parameters
```python
# Initialize with custom parameters
detector = KidneyStoneDetector(
    data_path='path/to/dataset',
    img_size=(256, 256),      # Higher resolution
    batch_size=16             # Smaller batch for limited memory
)

# Train with custom epochs
detector.train_model('efficientnet', epochs=50)
```

## Model Deployment

### Save Model for Production
```python
# Models are automatically saved as:
# best_kidney_stone_model_efficientnet.h5
# best_kidney_stone_model_resnet50.h5

# Load for inference
import tensorflow as tf
model = tf.keras.models.load_model('best_kidney_stone_model_efficientnet.h5')
```

### Model Conversion (Optional)
```python
# Convert to TensorFlow Lite for mobile deployment
converter = tf.lite.TFLiteConverter.from_keras_model(model)
tflite_model = converter.convert()

with open('kidney_stone_model.tflite', 'wb') as f:
    f.write(tflite_model)
```

## Expected Results

### Typical Performance Metrics
- **Accuracy**: 85-95% (depends on dataset quality)
- **Training Time**: 20-30 minutes (CPU), 5-10 minutes (GPU)
- **Model Size**: ~50MB (EfficientNetB0), ~100MB (ResNet50)
- **Inference Speed**: <1 second per image

### Success Indicators
- ✅ Training completes without errors
- ✅ Validation accuracy > 80%
- ✅ ROC-AUC score > 0.85
- ✅ Confusion matrix shows good performance on both classes
- ✅ Model files are generated successfully

---

**Note**: This is a medical AI system for educational purposes. Always validate results with medical professionals and follow appropriate regulatory guidelines for any clinical applications.