# KidneyAI Pro - Project Structure

Complete file organization for the kidney stone detection AI system. This guide explains what each file does and how they work together.

```
kdstdt/
├── Kidney Ultrasound Images Stone and No Stone/    # Medical image dataset
│   ├── Normal/                                     # Healthy kidney scans
│   │   ├── normal_001.jpg
│   │   ├── normal_002.jpg
│   │   └── ... (more normal images)
│   └── stone/                                      # Images showing kidney stones
│       ├── stone_001.jpg
│       ├── stone_002.jpg
│       └── ... (more stone images)
│
├── react-frontend/                                 # Modern React web interface
│   ├── public/
│   │   └── index.html                              # HTML template
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx                          # Top navigation with dark mode
│   │   │   └── Sidebar.jsx                         # Left sidebar navigation
│   │   ├── pages/
│   │   │   ├── Upload.jsx                          # Main upload & analysis page
│   │   │   └── About.jsx                           # System information page
│   │   ├── App.jsx                                 # Main React application
│   │   ├── main.jsx                                # Application entry point
│   │   └── index.css                               # Tailwind CSS styling
│   ├── package.json                                # Node.js dependencies
│   ├── tailwind.config.js                         # Tailwind configuration
│   ├── vite.config.js                             # Vite build configuration
│   ├── postcss.config.js                          # PostCSS configuration
│   └── README.md                                   # Frontend documentation
│
├── quick guide/                                    # Documentation folder
│   ├── README.md                                   # Main project documentation
│   ├── PROJECT_STRUCTURE.md                       # This file structure guide
│   ├── MODEL_TRAINING_GUIDE.md                    # AI training instructions
│   └── RUN_INSTRUCTIONS.md                        # Setup and run guide
│
├── 📄 streamlit_app.py                                # Streamlit web interface
├── 📄 backend.py                                      # Production FastAPI server
├── 📄 simple_backend.py                              # Demo FastAPI server
├── 📄 train_model.py                                  # AI model training script
├── 📄 gradcam.py                                      # Grad-CAM explainable AI
├── 📄 run_system.py                                   # Interactive system runner
├── 📄 simple_train.py                                 # Simplified training script
├── 📄 create_demo_model.py                            # Demo model creator
├── 📄 start_system.py                                 # System startup script
└── 📄 requirements.txt                                # Python dependencies
```

## What Each File Does

### Core Application Files

| File | Purpose | Technology Stack |
|------|---------|------------------|
| `react-frontend/` | Professional medical web interface | React 18 + Tailwind CSS + Vite |
| `streamlit_app.py` | Alternative elegant web interface | Streamlit + Custom CSS |
| `backend.py` | Production API server with real AI models | FastAPI + TensorFlow |
| `simple_backend.py` | Demo API server with mock predictions | FastAPI (no AI required) |
| `train_model.py` | Complete AI model training pipeline | TensorFlow/Keras + Scikit-learn |
| `gradcam.py` | Explainable AI visualization | Grad-CAM + OpenCV |
| `run_system.py` | Interactive menu system | Python subprocess management |

### 🔧 Configuration Files

| File | Purpose | Contains |
|------|---------|----------|
| `package.json` | React dependencies | React 18, Framer Motion, Recharts, Lucide icons |
| `tailwind.config.js` | UI styling configuration | Custom colors, dark mode, responsive breakpoints |
| `vite.config.js` | Build tool configuration | React plugin, dev server settings |
| `postcss.config.js` | CSS processing | Tailwind and Autoprefixer plugins |
| `requirements.txt` | Python dependencies | TensorFlow, FastAPI, Streamlit, OpenCV |

### 📚 Documentation Files

| File | Purpose | Content |
|------|---------|----------|
| `quick guide/README.md` | Complete project overview | Features, setup, usage, troubleshooting |
| `quick guide/RUN_INSTRUCTIONS.md` | Platform-specific setup | Mac/Windows/Linux installation guides |
| `quick guide/MODEL_TRAINING_GUIDE.md` | AI training instructions | Model architecture, training process, evaluation |
| `quick guide/PROJECT_STRUCTURE.md` | File organization guide | This detailed structure explanation |

### 🖼️ Data Files

| Directory | Contents | Format |
|-----------|----------|--------|
| `Normal/` | Healthy kidney ultrasound images | JPG, PNG |
| `stone/` | Kidney stone ultrasound images | JPG, PNG |

### 🤖 Generated Model Files (after training)

| File | Purpose |
|------|----------|
| `best_kidney_stone_model_efficientnet.h5` | Trained EfficientNetB0 model |
| `best_kidney_stone_model_resnet50.h5` | Trained ResNet50 model |
| `efficientnet_confusion_matrix.png` | EfficientNet evaluation chart |
| `resnet50_confusion_matrix.png` | ResNet50 evaluation chart |

## How to Run Different Parts

### Interactive Menu (Recommended)
```bash
python3 run_system.py
# Follow the menu options 1-5
```

### Manual Component Startup

#### React Frontend (Professional UI)
```bash
cd react-frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

#### Production API Server
```bash
python3 backend.py
# Requires trained models
# Runs on http://localhost:8000
```

#### Demo API Server (No Training Required)
```bash
python3 simple_backend.py
# Mock predictions for testing
# Runs on http://localhost:8000
```

#### Streamlit Interface
```bash
streamlit run streamlit_app.py
# Runs on http://localhost:8501
```

#### Train AI Models
```bash
python3 train_model.py
# Takes 20-30 minutes
# Requires dataset in correct structure
```

## 🌐 Application URLs

| Service | URL | Description |
|---------|-----|-------------|
| **React Frontend** | http://localhost:3000 | Professional medical interface |
| **Streamlit GUI** | http://localhost:8501 | Simple web interface |
| **FastAPI Backend** | http://localhost:8000 | REST API server |
| **API Documentation** | http://localhost:8000/docs | Interactive API docs |
| **Health Check** | http://localhost:8000/health | Server status endpoint |

## 📱 Features by Component

### React Frontend (`react-frontend/`)
- **Professional Medical UI**: Clean, modern design with medical theming
- **Dark Mode Toggle**: Light/dark theme switching
- **Drag & Drop Upload**: Intuitive file handling with preview
- **Real-time Analysis**: Instant AI predictions with loading states
- **Circular Progress**: Professional confidence visualization
- **Responsive Design**: Works on desktop, tablet, mobile
- **Grad-CAM Integration**: Visual AI explanation heatmaps
- **PDF Report Generation**: Downloadable medical reports
- **Router Navigation**: Multi-page application structure

### Streamlit GUI (`streamlit_app.py`)
- **Elegant Design**: Medical-themed gradient background
- **Custom CSS Styling**: Professional card-based layout
- **Image Upload & Preview**: File handling with image display
- **Confidence Visualization**: Progress bars and percentage display
- **Backend Status**: Real-time connection monitoring
- **Grad-CAM Viewer**: AI explanation overlay generation
- **Responsive Layout**: Mobile-friendly design

### Production Backend (`backend.py`)
- **Real AI Models**: Uses trained TensorFlow models
- **Image Preprocessing**: Automatic resize and normalization
- **Prediction API**: `/predict` endpoint with confidence scores
- **Explanation API**: `/explain` endpoint for Grad-CAM
- **Health Monitoring**: `/health` endpoint for status checks
- **CORS Support**: Cross-origin request handling
- **Error Handling**: Comprehensive exception management
- **Model Loading**: Automatic model detection and loading

### Demo Backend (`simple_backend.py`)
- **Mock Predictions**: Random confidence scores for testing
- **No Training Required**: Works without trained models
- **Same API Interface**: Compatible with all frontends
- **Quick Setup**: Instant startup for development
- **Demo Heatmaps**: Random Grad-CAM visualizations

### Training System (`train_model.py`)
- **Dual Architecture**: EfficientNetB0 and ResNet50 models
- **Transfer Learning**: Pre-trained ImageNet weights
- **Advanced Augmentation**: Rotation, shifts, zoom, brightness
- **Smart Data Splitting**: 70/15/15 train/val/test split
- **Fine-tuning**: Unfreezing layers for better performance
- **Automatic Callbacks**: Early stopping, learning rate scheduling
- **Model Comparison**: Automatic best model selection
- **Comprehensive Evaluation**: Metrics, confusion matrix, ROC curves

### Explainable AI (`gradcam.py`)
- **Grad-CAM Implementation**: Gradient-weighted Class Activation Mapping
- **Heatmap Generation**: Visual explanation of AI decisions
- **Overlay Creation**: Combining heatmaps with original images
- **Model Agnostic**: Works with any CNN architecture
- **Color Mapping**: Professional medical visualization

## System Architecture & Data Flow

### Complete Workflow
```
1. User uploads medical image → Frontend (React/Streamlit)
2. Frontend validates file → Size, format, type checking
3. Image sent via HTTP POST → FastAPI Backend
4. Backend preprocesses image → Resize (224x224), normalize
5. AI model analyzes image → EfficientNet/ResNet prediction
6. Confidence score calculated → Binary classification result
7. Grad-CAM generates heatmap → Visual explanation overlay
8. Results returned to frontend → JSON response with base64 image
9. Frontend displays results → Confidence bars, heatmap overlay
10. Optional report generation → PDF download (React only)
```

### Component Communication
```
┌─────────────────┐    HTTP/REST    ┌──────────────────┐
│  React Frontend │◄──────────────►│  FastAPI Backend │
│  (Port 3000)    │                 │  (Port 8000)     │
└─────────────────┘                 └──────────────────┘
                                              │
┌─────────────────┐                          │
│ Streamlit GUI   │◄─────────────────────────┘
│ (Port 8501)     │    HTTP/REST
└─────────────────┘
                                    ┌──────────────────┐
                                    │  AI Models       │
                                    │  - EfficientNet  │
                                    │  - ResNet50      │
                                    │  - Grad-CAM      │
                                    └──────────────────┘
```

## 🛠️ Development Workflow

### Initial Setup
1. **Environment Setup**: Follow `RUN_INSTRUCTIONS.md` for your OS
2. **Install Dependencies**: `pip install -r requirements.txt`
3. **Dataset Preparation**: Ensure correct folder structure
4. **Model Training**: Use `MODEL_TRAINING_GUIDE.md` (optional for demo)

### Development Process
1. **Start Backend**: Choose production (`backend.py`) or demo (`simple_backend.py`)
2. **Start Frontend**: React (`npm run dev`) or Streamlit (`streamlit run streamlit_app.py`)
3. **Test Functionality**: Upload test images, verify predictions
4. **Debug Issues**: Check logs, API responses, model loading
5. **Iterate**: Modify code, restart services, test again

### Production Deployment
1. **Build Frontend**: `npm run build` (React)
2. **Model Optimization**: Ensure best models are saved
3. **Environment Variables**: Configure production settings
4. **Container Setup**: Docker configuration (future enhancement)
5. **Cloud Deployment**: AWS/GCP/Azure setup (future enhancement)

### File Organization Summary
- **Total Files**: 25+ files in organized structure
- **Main Components**: 3 interfaces, 2 backends, 1 training system
- **Documentation**: 4 comprehensive guides
- **Configuration**: 5 config files for different tools
- **Generated Assets**: Models, charts, reports (after training)

---

**Architecture**: Modular, scalable medical AI application with multiple interface options and comprehensive documentation**