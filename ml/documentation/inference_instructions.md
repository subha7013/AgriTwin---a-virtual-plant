# AgriTwin ML Inference & Backend Integration Guide

This guide enables the FastAPI backend and React frontend developers to seamlessly integrate the exported AgriTwin deep learning models and environmental risk engine.

---

## 1. Handover Artifacts

The backend developer receives the following production files:

```text
ml/
├── models/
│   ├── mobilenetv2_best.keras      # Primary production transfer-learning model
│   ├── custom_cnn.keras            # Baseline comparison model
│   └── class_names.json            # Official class indices & display names
├── inference/
│   ├── predict.py                  # High-level disease prediction function
│   └── preprocessing.py            # Image validation and resizing pipeline
├── risk_prediction/
│   ├── risk_model.joblib           # Trained Random Forest IoT risk model
│   └── feature_engineering.py      # Sensor feature extraction pipeline
└── requirements.txt                # Required python packages
```

---

## 2. Using the Disease Prediction Function

The inference function is located in `ml/inference/predict.py`.

### Python Invocation
```python
from ml.inference.predict import predict_disease

# Works with file path, PIL Image, bytes, or numpy array
result = predict_disease(
    image="path/to/leaf_photo.jpg",
    plant_id="TOMATO_GREENHOUSE_01",
    model_type="mobilenetv2"  # or "custom_cnn"
)

print(result)
```

### JSON Response Schema
```json
{
  "success": true,
  "plant_id": "TOMATO_GREENHOUSE_01",
  "prediction": {
    "disease": "Tomato Early Blight",
    "confidence": 0.9421
  },
  "probabilities": {
    "Tomato Bacterial Spot": 0.0012,
    "Tomato Early Blight": 0.9421,
    "Tomato Late Blight": 0.0215,
    "Tomato Leaf Mold": 0.0042,
    "Tomato Septoria Leaf Spot": 0.0120,
    "Tomato Spider Mites": 0.0031,
    "Tomato Target Spot": 0.0084,
    "Tomato Yellow Leaf Curl Virus": 0.0010,
    "Tomato Mosaic Virus": 0.0005,
    "Tomato Healthy": 0.0060
  },
  "model": "MobileNetV2",
  "model_version": "1.0"
}
```

---

## 3. Integrating with FastAPI

Here is a recommended FastAPI endpoint implementation (`backend/routers/detection.py`):

```python
from fastapi import APIRouter, UploadFile, File, Form
from ml.inference.predict import predict_disease

router = APIRouter(prefix="/api/v1/ml", tags=["Disease Detection"])

@router.post("/predict")
async def detect_tomato_disease(
    file: UploadFile = File(...),
    plant_id: str = Form("TOMATO_001")
):
    contents = await file.read()
    result = predict_disease(image=contents, plant_id=plant_id, model_type="mobilenetv2")
    return result
```

---

## 4. Using the Environmental Risk Engine

Inference from ESP32 live sensor packets:

```python
import joblib
import pandas as pd
from ml.risk_prediction.feature_engineering import engineer_single_reading

# Load serialized model bundle
bundle = joblib.load("ml/risk_prediction/risk_model.joblib")
model = bundle["model"]

# Raw ESP32 reading
current_reading = {
    "temperature_c": 23.5,
    "relative_humidity_pct": 88.0,
    "soil_moisture_pct": 68.0,
    "leaf_wetness_pct": 82.0
}

# Feature vector extraction
features = engineer_single_reading(current_reading)
risk_cat = model.predict(features)[0]
risk_probs = model.predict_proba(features)[0]

print(f"Risk Category: {risk_cat}")
print(f"Probabilities (Low, Mod, High): {risk_probs}")
```
