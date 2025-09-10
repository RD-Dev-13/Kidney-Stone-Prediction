# AI-Based Kidney Stone Detection System

This project implements an AI-powered system for detecting kidney stones in medical images using deep learning models (EfficientNetB0 and ResNet50) with transfer learning, featuring multiple interfaces including React frontend, Streamlit GUI, and FastAPI backend.

## Getting Started

### Quick Start
```bash
pip3 install -r requirements.txt
python3 run_system.py
```

### Manual Setup
1. **Install Python dependencies**
```bash
pip3 install -r requirements.txt
```

2. **Setup React frontend** (optional)
```bash
cd react-frontend
npm install
```

3. **Train models** (first time only)
```bash
python3 train_model.py
```

4. **Start the system**
```bash
python3 run_system.py
```

## 📁 Project Structure

```
kdstdt/
├── Kidney Ultrasound Images Stone and No Stone/  # Medical image dataset
│   ├── Normal/                                   # Healthy kidney scans
│   └── stone/                                    # Kidney stone images
├── react-frontend/                               # Modern React web interface
│   ├── src/                                      # React source code
│   ├── package.json                              # Node.js dependencies
│   └── vite.config.js                            # Build configuration
├── train_model.py                                # AI model training script
├── backend.py                                    # Production FastAPI backend
├── simple_backend.py                             # Demo FastAPI backend
├── streamlit_app.py                              # Streamlit web interface
├── gradcam.py                                    # Grad-CAM explainable AI
├── run_system.py                                 # System orchestrator
├── requirements.txt                              # Python dependencies
└── quick guide/                                  # Documentation
    ├── README.md                                 # This file
    ├── PROJECT_STRUCTURE.md                      # Detailed structure
    ├── MODEL_TRAINING_GUIDE.md                   # Training instructions
    └── RUN_INSTRUCTIONS.md                       # Setup guide
```

## 🎯 Features

### 🤖 AI Models
- **EfficientNetB0** and **ResNet50** with transfer learning
- Binary classification: Stone vs Normal
- Advanced data augmentation and preprocessing
- Automatic model comparison and best model selection
- 70/15/15 train/validation/test split

### 📊 Evaluation & Metrics
- Comprehensive metrics: Accuracy, Precision, Recall, F1-score
- ROC-AUC curve analysis
- Confusion matrix visualization
- Early stopping and learning rate scheduling
- Fine-tuning with unfrozen layers

### 🔍 Explainable AI
- **Grad-CAM** heatmap visualization
- Visual explanation of AI decision-making
- Overlay heatmaps on original images
- Focus area highlighting

### 🌐 Multiple Interfaces
- **React Frontend**: Modern, professional medical UI with dark mode
- **Streamlit GUI**: Simple, elegant web interface
- **FastAPI Backend**: Production-ready REST API
- **Demo Backend**: Quick testing without trained models

### 🖥️ User Experience
- Drag & drop image upload
- Real-time prediction with confidence scores
- Professional medical-themed design
- Responsive layout for all devices
- PDF report generation (React frontend)
- Grad-CAM visualization overlay

## 📋 Usage Instructions

### Interactive Menu System
```bash
python3 run_system.py
```

**Menu Options:**
1. 🎯 **Train Models** - Train EfficientNetB0 & ResNet50
2. 🚀 **Start Backend Server** - Launch production API
3. 🖥️ **Launch Streamlit GUI** - Simple web interface
4. 🔄 **Complete Workflow** - Train → Setup instructions
5. 📊 **Quick Demo** - Backend + Streamlit (auto-start)

### Manual Setup Options

#### Option A: React Frontend (Recommended)
```bash
# Terminal 1: Start backend
python3 backend.py

# Terminal 2: Start React frontend
cd react-frontend
npm run dev
```

#### Option B: Streamlit Interface
```bash
# Terminal 1: Start backend
python3 backend.py

# Terminal 2: Start Streamlit
streamlit run streamlit_app.py
```

#### Option C: Demo Mode (No Training Required)
```bash
# Use simple backend for testing
python3 simple_backend.py

# Then launch Streamlit
streamlit run streamlit_app.py
```

## 🔧 API Endpoints

### Health Check
```
GET /health

Response:
{
  "status": "healthy",
  "model_loaded": true
}
```

### Prediction Endpoint
```
POST /predict
Content-Type: multipart/form-data
Body: image file (PNG, JPG, JPEG)

Response:
{
  "prediction": "Stone" | "Normal",
  "confidence": 92.5,
  "raw_score": 0.925
}
```

### Explanation Endpoint (Grad-CAM)
```
POST /explain
Content-Type: multipart/form-data
Body: image file

Response:
{
  "heatmap": "data:image/png;base64,..."
}
```

### Backend Options
- **backend.py**: Production backend with real AI models
- **simple_backend.py**: Demo backend with random predictions

## 📈 Model Performance

### Training Process
- **Data Split**: 70% training, 15% validation, 15% testing
- **Augmentation**: Rotation, shifts, shear, zoom, brightness, horizontal flip
- **Transfer Learning**: Pre-trained ImageNet weights
- **Fine-tuning**: Unfreezing base model layers after initial training
- **Callbacks**: Early stopping, learning rate reduction

### Model Comparison
- **EfficientNetB0**: Lightweight, efficient, faster inference
- **ResNet50**: Deep residual network, robust feature extraction
- **Automatic Selection**: Best performing model saved as `best_kidney_stone_model_[name].h5`

### Evaluation Metrics
- Classification report with precision, recall, F1-score
- ROC-AUC curve analysis
- Confusion matrix visualization
- Model comparison charts

## 🎨 Interface Features

### React Frontend
- **Professional Medical UI**: Clean, modern design
- **Dark Mode Support**: Toggle between light/dark themes
- **Responsive Design**: Works on desktop, tablet, mobile
- **Drag & Drop Upload**: Intuitive file handling
- **Real-time Analysis**: Instant AI predictions
- **Circular Progress**: Professional confidence visualization
- **PDF Reports**: Generate downloadable medical reports
- **Grad-CAM Integration**: Visual AI explanations

### Streamlit Interface
- **Elegant Design**: Medical-themed gradient background
- **Image Preview**: Upload and preview functionality
- **Confidence Bars**: Visual confidence scoring
- **Status Indicators**: Backend connection status
- **Grad-CAM Viewer**: AI explanation heatmaps
- **Professional Layout**: Card-based design system

## ⚠️ Important Notes

### Medical Disclaimer
- **Educational Purpose Only**: This system is for research and educational use
- **Not for Clinical Use**: Always consult qualified medical professionals
- **No Medical Advice**: Results should not replace professional diagnosis

### Technical Requirements
- **Dataset Structure**: Ensure `Kidney Ultrasound Images Stone and No Stone/` with `Normal/` and `stone/` subfolders
- **First Run**: Model training required (20-30 minutes)
- **Dependencies**: Install all packages from `requirements.txt`
- **Memory**: Minimum 8GB RAM recommended for training
- **Storage**: ~2GB for dataset and models

## 🔍 Troubleshooting

### Model Not Found Error
```bash
# Train models first
python3 train_model.py
# Or use demo mode
python3 simple_backend.py
```

### Backend Connection Error
```bash
# Check if backend is running
curl http://localhost:8000/health

# Start backend
python3 backend.py  # Production
# OR
python3 simple_backend.py  # Demo
```

### React Frontend Issues
```bash
# Install dependencies
cd react-frontend
npm install

# Start development server
npm run dev
```

### Dataset Path Error
```bash
# Verify folder structure:
# Kidney Ultrasound Images Stone and No Stone/
#   ├── Normal/     (healthy kidney images)
#   └── stone/      (kidney stone images)
```

### Port Conflicts
- **Backend**: http://localhost:8000
- **React**: http://localhost:3000 (or next available)
- **Streamlit**: http://localhost:8501

## 🏆 Results Display

### Positive Detection (Stone Found)
```
⚠️ Kidney Stone Detected
Confidence: 92.3%
Recommendation: Immediate medical consultation
```

### Negative Detection (Normal)
```
✅ No Kidney Stone Detected  
Confidence: 87.6%
Recommendation: Continue regular health monitoring
```

### Visual Explanations
- **Grad-CAM Heatmaps**: Red/warm areas show AI focus regions
- **Confidence Bars**: Visual representation of prediction certainty
- **Professional Reports**: PDF generation with detailed analysis (React frontend)

## 🌐 Application URLs

- **React Frontend**: http://localhost:3000
- **Streamlit GUI**: http://localhost:8501  
- **FastAPI Backend**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## 🚀 Future Enhancements

1. **Model Improvements**
   - Additional architectures (Vision Transformers, DenseNet)
   - Multi-class classification (stone size, type)
   - Ensemble methods for better accuracy

2. **Deployment & Scaling**
   - Docker containerization
   - Cloud deployment (AWS, GCP, Azure)
   - Load balancing and auto-scaling

3. **Advanced Features**
   - DICOM file support
   - Batch processing capabilities
   - Integration with hospital systems (HL7 FHIR)
   - Real-time streaming analysis

4. **User Experience**
   - Mobile app development
   - Advanced reporting and analytics
   - User authentication and role management
   - Audit trails and compliance features

---

**Built with ❤️ for advancing medical AI applications**

*This system demonstrates the potential of AI in medical imaging while emphasizing the importance of professional medical consultation for all health-related decisions.*