# Kidney Stone AI Detection System

An end-to-end AI application that detects kidney stones from ultrasound and CT scans using deep learning models (EfficientNet and ResNet50). The project is built with a modern, decoupled architecture featuring a React frontend and a Python/FastAPI/Gradio backend.

## 🌟 Live Demos
- **Frontend (Vercel):** [Replace with Vercel Link if available]
- **Backend API (Hugging Face ZeroGPU):** [https://huggingface.co/spaces/nubruuuu/kidney-stone-backend](https://huggingface.co/spaces/nubruuuu/kidney-stone-backend)

## 📁 Repository Structure

The project is divided into distinct modular components to separate the training, backend, and frontend environments.

```text
kidney-stone-ai/
├── react-frontend/           # React + Vite Application
├── kidney-stone-backend/     # Gradio / Hugging Face Backend API
├── dataset/                  # Kidney Ultrasound Images (Normal / Stone)
├── training/                 # AI Model training scripts
└── README.md                 # Project Documentation
```

### 1. `react-frontend/`
A modern, responsive user interface built with React, Vite, and Tailwind CSS.
- Connects directly to the Hugging Face Backend API.
- **To run locally:**
  ```bash
  cd react-frontend
  npm install
  npm run dev
  ```

### 2. `kidney-stone-backend/`
A Python-based AI inference server deployed on Hugging Face Spaces (ZeroGPU hardware).
- Runs a Gradio application that exposes a JSON API.
- Loads trained `.h5` TensorFlow models (EfficientNet & ResNet50) and performs ensemble averaging.
- Exposes the `/predict` API route utilizing the official `@gradio/client`.

### 3. `training/` & `dataset/`
Contains the local machine learning scripts used to train the models on the dataset.
- `simple_train.py`: Trains EfficientNet and ResNet50 models from the images inside the `dataset/` directory.
- **To train models locally:**
  ```bash
  cd training
  python simple_train.py
  ```
  *(Note: This requires TensorFlow and other ML dependencies installed locally).*

## ⚙️ Architecture & Deployment Notes
- **ZeroGPU Compatibility:** The backend explicitly uses the `@spaces.GPU` decorator and avoids manual `uvicorn` port bindings to run successfully on Hugging Face's ZeroGPU free tier.
- **API Proxying:** The frontend uses the official `@gradio/client` to securely tunnel through Hugging Face's WebSocket proxy system, bypassing traditional CORS/fetch restrictions.
- **Git Limitations:** The actual trained AI models (`.h5` files) exceed standard Git file size limits. They must be managed via Git LFS or uploaded directly to the Hugging Face Space web interface.
