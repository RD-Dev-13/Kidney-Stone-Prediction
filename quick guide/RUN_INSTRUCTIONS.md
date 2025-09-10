# Setup & Run Instructions

Complete setup guide for running the Kidney Stone Detection AI system on different operating systems.

## Quick Start (All Platforms)

```bash
# 1. Install Python dependencies
pip3 install -r requirements.txt

# 2. Run the interactive system
python3 run_system.py

# 3. Follow the menu options (1-5)
```

## Detailed Setup Instructions

### Prerequisites

#### System Requirements
- **Python**: 3.8 or higher
- **RAM**: 8GB minimum (16GB recommended for training)
- **Storage**: 5GB free space
- **Internet**: Required for initial package downloads

#### Check Python Version
```bash
python3 --version
# Should show Python 3.8.x or higher
```

---

## macOS Setup

### 1. Install Python (if needed)
```bash
# Using Homebrew (recommended)
brew install python3

# Or download from python.org
# https://www.python.org/downloads/macos/
```

### 2. Install Dependencies
```bash
# Navigate to project directory
cd /path/to/kdstdt

# Install Python packages
pip3 install -r requirements.txt

# If you get permission errors, use:
pip3 install --user -r requirements.txt
```

### 3. Setup React Frontend (Optional)
```bash
# Install Node.js (if not installed)
brew install node

# Install frontend dependencies
cd react-frontend
npm install
cd ..
```

### 4. Run the System
```bash
# Interactive menu
python3 run_system.py

# Or manual startup:
# Terminal 1: Backend
python3 backend.py

# Terminal 2: Frontend (choose one)
streamlit run streamlit_app.py
# OR
cd react-frontend && npm run dev
```

---

## Windows Setup

### 1. Install Python
1. Download Python from [python.org](https://www.python.org/downloads/windows/)
2. **Important**: Check "Add Python to PATH" during installation
3. Verify installation:
```cmd
python --version
```

### 2. Install Dependencies
```cmd
# Open Command Prompt or PowerShell
cd C:\path\to\kdstdt

# Install Python packages
pip install -r requirements.txt

# If you get SSL errors, try:
pip install --trusted-host pypi.org --trusted-host pypi.python.org -r requirements.txt
```

### 3. Setup React Frontend (Optional)
```cmd
# Install Node.js from nodejs.org
# Then install frontend dependencies
cd react-frontend
npm install
cd ..
```

### 4. Run the System
```cmd
# Interactive menu
python run_system.py

# Or manual startup:
# Command Prompt 1: Backend
python backend.py

# Command Prompt 2: Frontend (choose one)
streamlit run streamlit_app.py
# OR
cd react-frontend
npm run dev
```

---

## Linux (Ubuntu/Debian) Setup

### 1. Install Python and Dependencies
```bash
# Update package list
sudo apt update

# Install Python and pip
sudo apt install python3 python3-pip python3-venv

# Install system dependencies for OpenCV
sudo apt install libgl1-mesa-glx libglib2.0-0
```

### 2. Create Virtual Environment (Recommended)
```bash
# Create virtual environment
python3 -m venv kidney_ai_env

# Activate virtual environment
source kidney_ai_env/bin/activate

# Install Python packages
pip install -r requirements.txt
```

### 3. Setup React Frontend (Optional)
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install frontend dependencies
cd react-frontend
npm install
cd ..
```

### 4. Run the System
```bash
# Activate virtual environment (if using)
source kidney_ai_env/bin/activate

# Interactive menu
python3 run_system.py
```

---

## Running Options

### Option 1: Interactive Menu (Recommended)
```bash
python3 run_system.py
```

**Menu Options:**
1. 🎯 **Train Models** - Train AI models (first time setup)
2. 🚀 **Start Backend Server** - Launch production API
3. 🖥️ **Launch Streamlit GUI** - Simple web interface
4. 🔄 **Complete Workflow** - Train models + setup instructions
5. 📊 **Quick Demo** - Auto-start backend + Streamlit

### Option 2: Manual Component Startup

#### Production Setup (with trained models)
```bash
# Terminal 1: Start backend
python3 backend.py

# Terminal 2: Choose frontend
# Option A: React (professional UI)
cd react-frontend
npm run dev

# Option B: Streamlit (simple UI)
streamlit run streamlit_app.py
```

#### Demo Setup (no training required)
```bash
# Terminal 1: Demo backend
python3 simple_backend.py

# Terminal 2: Streamlit interface
streamlit run streamlit_app.py
```

### Option 3: Training Only
```bash
# Train AI models (20-30 minutes)
python3 train_model.py
```

---

## Application URLs

Once running, access the interfaces at:

| Service | URL | Description |
|---------|-----|-------------|
| **React Frontend** | http://localhost:3000 | Professional medical interface |
| **Streamlit GUI** | http://localhost:8501 | Simple web interface |
| **API Backend** | http://localhost:8000 | REST API server |
| **API Docs** | http://localhost:8000/docs | Interactive API documentation |
| **Health Check** | http://localhost:8000/health | Server status |

---

## Troubleshooting

### Common Issues

#### 1. Python Not Found
**Windows:**
```cmd
# Add Python to PATH or use full path
C:\Users\YourName\AppData\Local\Programs\Python\Python39\python.exe run_system.py
```

**macOS/Linux:**
```bash
# Try different Python commands
python3 run_system.py
python run_system.py
/usr/bin/python3 run_system.py
```

#### 2. Package Installation Errors
```bash
# Upgrade pip first
pip3 install --upgrade pip

# Install with user flag
pip3 install --user -r requirements.txt

# For macOS with M1/M2 chips
pip3 install tensorflow-macos tensorflow-metal
```

#### 3. Port Already in Use
```bash
# Kill processes using ports
# macOS/Linux:
lsof -ti:8000 | xargs kill -9  # Backend port
lsof -ti:8501 | xargs kill -9  # Streamlit port

# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID_NUMBER> /F
```

#### 4. Dataset Not Found
```bash
# Verify folder structure
ls "Kidney Ultrasound Images Stone and No Stone"
# Should show: Normal/  stone/

# Check current directory
pwd
# Should be in the kdstdt folder
```

#### 5. Memory Issues During Training
```bash
# Reduce batch size in train_model.py
# Change: batch_size=32 to batch_size=16 or batch_size=8
```

#### 6. React Frontend Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version (should be 16+)
node --version
```

### Performance Optimization

#### For Faster Training
- **Use GPU**: Install CUDA and cuDNN for NVIDIA GPUs
- **Reduce Image Size**: Modify `img_size=(224, 224)` to `(128, 128)`
- **Smaller Batch Size**: Reduce if running out of memory

#### For Better Accuracy
- **More Data**: Add more training images
- **Longer Training**: Increase epochs in training script
- **Data Quality**: Use high-quality medical images

---

## Development Setup

### For Developers

#### 1. Clone and Setup
```bash
git clone <repository-url>
cd kdstdt
pip3 install -r requirements.txt
```

#### 2. Development Mode
```bash
# Backend with auto-reload
uvicorn backend:app --reload --host 0.0.0.0 --port 8000

# React with hot reload
cd react-frontend
npm run dev

# Streamlit with auto-reload
streamlit run streamlit_app.py --server.runOnSave true
```

#### 3. Code Structure
```
Development workflow:
1. Modify backend code → Auto-reloads on save
2. Modify React code → Hot reload in browser
3. Modify Streamlit → Refresh browser or auto-reload
4. Test changes → Upload images and verify results
```

---

## Production Deployment

### Docker Setup (Future Enhancement)
```dockerfile
# Example Dockerfile structure
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["python", "backend.py"]
```

### Cloud Deployment Options
- **AWS**: EC2, ECS, Lambda
- **Google Cloud**: Compute Engine, Cloud Run
- **Azure**: Container Instances, App Service
- **Heroku**: Web dynos with buildpacks

---

## Security Notes

### For Production Use
- **Environment Variables**: Store API keys and secrets securely
- **HTTPS**: Use SSL certificates for encrypted communication
- **Authentication**: Implement user authentication and authorization
- **Input Validation**: Validate all uploaded files and inputs
- **Rate Limiting**: Implement API rate limiting
- **CORS**: Configure proper CORS policies

### Medical Compliance
- **HIPAA**: Ensure compliance for handling medical data
- **Data Privacy**: Implement proper data handling and deletion
- **Audit Logs**: Maintain logs for medical AI decisions
- **Disclaimer**: Always include medical disclaimers

---

**Support**: If you encounter issues not covered here, check the project documentation or create an issue in the repository.