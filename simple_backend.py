from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import cv2
from PIL import Image
import io
import base64
import random

app = FastAPI(title="Kidney Stone Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def preprocess_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes))
    if image.mode != 'RGB':
        image = image.convert('RGB')
    image = image.resize((224, 224))
    img_array = np.array(image) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array, np.array(image)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        img_array, original_img = preprocess_image(image_bytes)
        
        # Demo prediction
        confidence = random.uniform(0.2, 0.9)
        
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
        image_bytes = await file.read()
        img_array, original_img = preprocess_image(image_bytes)
        
        # Create demo heatmap
        heatmap = np.random.random((224, 224))
        heatmap = cv2.resize(heatmap, (original_img.shape[1], original_img.shape[0]))
        heatmap = np.uint8(255 * heatmap)
        heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
        overlay = cv2.addWeighted(original_img, 0.6, heatmap, 0.4, 0)
        
        _, buffer = cv2.imencode('.png', overlay)
        overlay_base64 = base64.b64encode(buffer).decode('utf-8')
        
        return {
            "heatmap": f"data:image/png;base64,{overlay_base64}"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"GradCAM error: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": "demo_mode"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)