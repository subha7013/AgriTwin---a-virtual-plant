# AgriTwin ML Service

FastAPI-based disease classification service for AgriTwin.

## Setup

```bash
# Install dependencies (if not already installed)
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Run the service
uvicorn ml.inference.app:app --reload --port 8000
```

## Endpoints

### GET /health
Check service health and model status.

### POST /predict
Upload an image for disease diagnosis.

**Request:**
- Content-Type: multipart/form-data
- Body: image file (jpg, jpeg, png, webp)

**Response:**
```json
{
  "success": true,
  "disease": "Early Blight",
  "class_raw": "Tomato___Early_blight",
  "confidence": 0.94,
  "probabilities": {
    "Tomato Early Blight": 0.94,
    "Tomato Late Blight": 0.03,
    ...
  },
  "model": "mobilenetv2",
  "model_version": "1.0"
}
```

## Requirements

- Python 3.9+
- Keras 3.0+
- FastAPI 0.100+
- Pillow
- NumPy

## Model

The service uses MobileNetV2 pretrained on the PlantVillage dataset (10 tomato disease classes).

To train your own model:
```bash
cd ml/training
python train_mobilenet.py
```

## Integration with Backend

The backend (Node.js) calls this service via HTTP:
```javascript
const response = await axios.post(
  `${ML_SERVICE_URL}/predict`,
  formData,
  { headers: { ...formData.getHeaders() } }
);
```

## Docker (Optional)

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "ml.inference.app:app", "--host", "0.0.0.0", "--port", "8000"]
```
