from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import numpy as np
import cv2
from PIL import Image
import io
import base64
try:
    import tensorflow as tf
    from gradcam import GradCAM
except ImportError:
    tf = None
    GradCAM = None

app = FastAPI(title="Kidney Stone Detection API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables
model = None
gradcam = None

@app.on_event("startup")
async def load_model():
    global model, gradcam
    try:
        # Try to load any available model
        model_files = ["kidney_stone_model.h5", "best_kidney_stone_model_efficientnet.h5"]
        for model_file in model_files:
            if os.path.exists(model_file):
                model = tf.keras.models.load_model(model_file)
                gradcam = GradCAM(model_file)
                print(f"Model {model_file} loaded successfully!")
                return
        print("No model found - using demo mode")
    except Exception as e:
        print(f"Error loading model: {e} - using demo mode")

def preprocess_image(image_bytes):
    # Convert bytes to PIL Image
    image = Image.open(io.BytesIO(image_bytes))
    
    # Convert to RGB if needed
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    # Resize to model input size
    image = image.resize((224, 224))
    
    # Convert to numpy array and normalize
    img_array = np.array(image) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    
    return img_array, np.array(image)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        # Read and preprocess image
        image_bytes = await file.read()
        img_array, original_img = preprocess_image(image_bytes)
        
        if model:
            # Make real prediction
            prediction = model.predict(img_array)[0][0]
            confidence = float(prediction)
        else:
            # Demo mode - random prediction
            import random
            confidence = random.uniform(0.1, 0.9)
        
        # Determine class
        if confidence > 0.5:
            label = "Stone"
            confidence_score = confidence
        else:
            label = "Normal"
            confidence_score = 1 - confidence
        
        return {
            "prediction": label,
            "confidence": round(confidence_score * 100, 2),
            "raw_score": float(confidence)
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.post("/explain")
async def explain(file: UploadFile = File(...)):
    try:
        # Read and preprocess image
        image_bytes = await file.read()
        img_array, original_img = preprocess_image(image_bytes)
        
        if gradcam:
            # Generate real GradCAM
            heatmap = gradcam.generate_gradcam(img_array)
            overlay = gradcam.create_heatmap_overlay(original_img, heatmap)
        else:
            # Demo mode - create fake heatmap
            heatmap = np.random.random((224, 224))
            heatmap = cv2.resize(heatmap, (original_img.shape[1], original_img.shape[0]))
            heatmap = np.uint8(255 * heatmap)
            heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
            overlay = cv2.addWeighted(original_img, 0.6, heatmap, 0.4, 0)
        
        # Convert overlay to base64
        _, buffer = cv2.imencode('.png', overlay)
        overlay_base64 = base64.b64encode(buffer).decode('utf-8')
        
        return {
            "heatmap": f"data:image/png;base64,{overlay_base64}"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"GradCAM error: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": model is not None}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)