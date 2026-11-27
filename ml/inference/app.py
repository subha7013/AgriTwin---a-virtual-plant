import os
import sys
import asyncio
import uvicorn
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.responses import JSONResponse
from pydantic import BaseModel

# ML imports
import keras
import numpy as np
import io
from PIL import Image

# Ensure the ml/ package root is importable (for "inference.preprocessing")
_ml_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if _ml_root not in sys.path:
    sys.path.insert(0, _ml_root)

# Initialize FastAPI app
app = FastAPI(
    title="AgriTwin ML Service",
    description="Disease classification and prediction service",
    version="1.0.0"
)

# Global model cache
_model = None
class_display_names = None
_class_names = None
def load_model_and_metadata():
    """Load model and class metadata at startup"""
    global _model, class_display_names, _class_names
    
    # Get project root directory
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    model_dir = os.path.join(project_root, "ml", "models")
    
    model_path = os.path.join(model_dir, "mobilenetv2_best.keras")
    meta_path = os.path.join(model_dir, "class_names.json")
    
    # Check if model exists
    if not os.path.exists(model_path):
        print(f"ERROR: Model file not found at {model_path}")
        print(f"Available files in models directory:")
        if os.path.exists(model_dir):
            for f in os.listdir(model_dir):
                print(f"  - {f}")
        else:
            print("  (models directory does not exist)")
        raise FileNotFoundError(f"Model file not found: {model_path}")
    
    import json
    with open(meta_path, "r") as f:
        meta = json.load(f)
    
    class_display_names = meta["class_display_names"]
    _class_names = meta["class_directories"]
    
    _model = keras.models.load_model(model_path)
    print(f"OK Loaded model: {model_path}")
    print(f"OK Loaded {len(class_display_names)} class names")


class PredictionRequest(BaseModel):
    image_path: str


class PredictionResponse(BaseModel):
    success: bool
    disease: str
    confidence: float
    probabilities: dict
    model: str
    model_version: str


@app.on_event("startup")
async def startup_event():
    """Load model on startup"""
    load_model_and_metadata()


@app.get("/health")
async def health():
    """Health check endpoint"""
    return {
        "status": "ready" if _model is not None else "not_ready",
        "model": "mobilenetv2",
        "classes": len(class_display_names) if class_display_names else 0
    }


@app.post("/predict")
async def predict(image: UploadFile = File(...)):
    """
    Disease prediction endpoint.
    Accepts image file and returns disease classification.
    """
    global _model
    if _model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        # Read image bytes
        image_bytes = await image.read()

        # Determine the model's native input resolution
        in_shape = _model.input_shape
        target_size = (
            (in_shape[1], in_shape[2])
            if in_shape and in_shape[1] is not None
            else (256, 256)
        )

        # Use the canonical preprocessing pipeline (keeps raw [0,255] range;
        # the model graph already applies MobileNetV2 preprocess_input internally)
        from inference.preprocessing import preprocess_image

        img_array = preprocess_image(
            image_bytes, target_size=target_size, crop_ratio=0.85
        )

        # Make prediction
        preds = _model.predict(img_array, verbose=0)[0]
        pred_idx = int(np.argmax(preds))
        confidence = float(preds[pred_idx])
        
        # Build probabilities dict
        probabilities = {
            name: round(float(preds[i]), 4)
            for i, name in enumerate(class_display_names)
        }
        
        return {
            "success": True,
            "disease": class_display_names[pred_idx],
            "class_raw": _class_names[pred_idx] if pred_idx < len(_class_names) else class_display_names[pred_idx],
            "confidence": round(confidence, 4),
            "probabilities": probabilities,
            "model": "mobilenetv2",
            "model_version": "1.0"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@app.post("/predict/health")
async def predict_health():
    """Health check with model loaded info"""
    return {
        "status": "ready" if _model is not None else "not_ready",
        "model": "mobilenetv2",
        "classes": class_display_names or []
    }


if __name__ == "__main__":
    import sys
    import os
    
    # Add project root to path for imports
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    if project_root not in sys.path:
        sys.path.insert(0, project_root)
    
    port = int(os.getenv("MODEL_PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
