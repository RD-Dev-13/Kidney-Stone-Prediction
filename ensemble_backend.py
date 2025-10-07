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
    TF_AVAILABLE = True
except (ImportError, Exception):
    tf = None
    GradCAM = None
    TF_AVAILABLE = False
    print("TensorFlow not available - running in demo mode")

app = FastAPI(title="Enhanced Kidney Stone Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables
efficientnet_model = None
resnet_model = None
gradcam = None

@app.on_event("startup")
async def load_models():
    global efficientnet_model, resnet_model, gradcam
    if not TF_AVAILABLE:
        print("Running in demo mode - TensorFlow not available")
        return
        
    try:
        # Load ensemble models only if TensorFlow is available
        if tf and os.path.exists("final_efficientnet_model.h5"):
            efficientnet_model = tf.keras.models.load_model("final_efficientnet_model.h5")
            print("EfficientNet model loaded!")
        
        if tf and os.path.exists("final_resnet50_model.h5"):
            resnet_model = tf.keras.models.load_model("final_resnet50_model.h5")
            print("ResNet50 model loaded!")
        
        # Use EfficientNet for GradCAM
        if efficientnet_model and GradCAM:
            gradcam = GradCAM("final_efficientnet_model.h5")
            
        if not efficientnet_model and not resnet_model:
            print("No trained models found - using demo mode")
    except Exception as e:
        print(f"Error loading models: {e} - using demo mode")
        efficientnet_model = None
        resnet_model = None
        gradcam = None

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
        
        predictions = []
        model_names = []
        
        # Get predictions from available models if TensorFlow is working
        if TF_AVAILABLE and efficientnet_model:
            try:
                eff_pred = efficientnet_model.predict(img_array)[0][0]
                predictions.append(eff_pred)
                model_names.append("EfficientNet")
            except:
                pass
        
        if TF_AVAILABLE and resnet_model:
            try:
                res_pred = resnet_model.predict(img_array)[0][0]
                predictions.append(res_pred)
                model_names.append("ResNet50")
            except:
                pass
        
        if predictions:
            # Ensemble prediction (average)
            ensemble_pred = np.mean(predictions)
            confidence = float(ensemble_pred)
        else:
            # Demo mode
            import random
            confidence = random.uniform(0.3, 0.9)
            model_names = ["Demo Mode"]
        
        # Determine class and convert to Python float
        confidence = float(confidence)  # Convert numpy to Python float
        
        if confidence > 0.5:
            label = "Stone"
            confidence_score = confidence
        else:
            label = "Normal"
            confidence_score = 1 - confidence
        
        # Format confidence to exactly 2 decimal places
        confidence_percentage = round(confidence_score * 100, 2)
        
        return {
            "prediction": label,
            "confidence": confidence_percentage,
            "raw_score": round(confidence, 4),
            "ensemble_models": model_names,
            "individual_predictions": {
                name: round(float(pred), 4) for name, pred in zip(model_names, predictions)
            }
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.post("/explain")
async def explain(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        img_array, original_img = preprocess_image(image_bytes)
        
        if gradcam:
            heatmap = gradcam.generate_gradcam(img_array)
            overlay = gradcam.create_heatmap_overlay(original_img, heatmap)
        else:
            # Demo heatmap
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
    return {
        "status": "healthy",
        "efficientnet_loaded": efficientnet_model is not None,
        "resnet_loaded": resnet_model is not None,
        "ensemble_ready": efficientnet_model is not None or resnet_model is not None
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)