# AgriTwin Integration Complete

## What Was Built

### 1. ML Service (`ml/inference/app.py`)
- FastAPI-based disease classification service
- Runs on port 8000
- Endpoints: `/health`, `/predict`
- Loads MobileNetV2 model at startup
- Accepts image uploads, returns diagnosis with confidence

### 2. Backend Modules

#### Diagnosis Module (`backend/src/modules/diagnosis/`)
- `POST /api/v1/diagnosis/diagnose` - Upload image, get diagnosis
- `GET /api/v1/diagnosis/diagnoses` - List user diagnoses
- `GET /api/v1/diagnosis/diagnoses/:id` - Get single diagnosis
- `DELETE /api/v1/diagnosis/diagnoses/:id` - Delete diagnosis
- `GET /api/v1/diagnosis/stats` - Get diagnosis statistics

#### Telemetry Module (`backend/src/modules/telemetry/`)
- `POST /api/v1/telemetry` - Submit sensor data
- `GET /api/v1/telemetry` - Get sensor history
- `GET /api/v1/telemetry/latest` - Get latest reading for plant
- `GET /api/v1/telemetry/stats` - Get sensor statistics
- `GET /api/v1/telemetry/alerts` - Get recent alerts
- `GET /api/v1/telemetry/summary` - Get plant summary

#### Alerts Module (`backend/src/modules/alerts/`)
- `GET /api/v1/alerts` - List all alerts
- `GET /api/v1/alerts/:id` - Get single alert
- `POST /api/v1/alerts/:id/acknowledge` - Mark as acknowledged
- `POST /api/v1/alerts/:id/resolve` - Mark as resolved
- `DELETE /api/v1/alerts/:id` - Delete alert
- `GET /api/v1/alerts/stats` - Get alert statistics

#### Risk Module (`backend/src/modules/risk/`)
- `POST /api/v1/risk` - Assess plant risk
- `GET /api/v1/risk` - List risk assessments
- `GET /api/v1/risk/:id` - Get single assessment
- `GET /api/v1/risk/latest` - Get latest assessment for plant
- `GET /api/v1/risk/stats` - Get risk statistics

### 3. Frontend Services

#### `frontend/src/services/diseaseService.js`
- `diagnose(file, plantId)` - Upload image for diagnosis
- `getDiagnoses(params)` - Get user diagnoses
- `getDiagnosis(id)` - Get single diagnosis
- `deleteDiagnosis(id)` - Delete diagnosis
- `getDiagnosisStats()` - Get statistics

#### `frontend/src/services/sensorService.js`
- `submitSensorData(data)` - Submit sensor reading
- `getSensorHistory(params)` - Get sensor history
- `getLatestSensorData(plantId)` - Get latest reading
- `getSensorStats(params)` - Get statistics
- `getSensorAlerts(params)` - Get alerts
- `getPlantSummary(plantId)` - Get plant summary

### 4. Utilities

#### `backend/src/utils/ml-client.js`
- ML service client with health checks
- `predict(imagePath)` - Send image to ML service
- `health()` - Check ML service status

#### `backend/src/utils/cloudinary.js`
- Cloudinary image upload utility
- `uploadToCloudinary(filePath, options)` - Upload and delete local file
- `uploadImage(filePath, options)` - Upload with custom options
- `deleteResource(publicId)` - Delete from Cloudinary

## Dependencies Added

### Backend
```json
{
  "dependencies": {
    "multer": "^1.4.5-lts.1",
    "axios": "^1.6.0",
    "cloudinary": "^1.41.0"
  }
}
```

### ML Service
Already in `ml/requirements.txt`:
```
fastapi>=0.100.0
uvicorn>=0.22.0
pydantic>=2.0.0
```

## Environment Variables

### Backend `.env`
```
ML_SERVICE_URL=http://localhost:8000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### ML Service `.env`
```
MODEL_PATH=ml/models/mobilenetv2_best.keras
MODEL_PORT=8000
```

## Risk Calculation

Risk is calculated based on:
- **Diagnosis Confidence** (50% weight) - ML model confidence
- **Plant Health Status** (30% weight) - Historical health score
- **Environmental Factors** (20% weight) - Temperature, humidity, soil moisture, pH

Risk levels:
- **High**: Score > 0.7
- **Medium**: Score > 0.4
- **Low**: Score <= 0.4

## ML-Based Alerts

Alerts are generated when:
1. Disease detected with confidence > 0.8
2. Temperature > 35°C or < 10°C
3. Humidity > 85% or < 30%
4. Soil moisture < 15%
5. pH outside 5.5-7.5 range

## Custom Dataset Integration

### Adding Your Downloaded Datasets
```bash
# Navigate to project root
cd ml/dataset

# Add custom dataset
python add_custom_dataset.py /path/to/your/dataset

# Or run full workflow:
python add_custom_dataset.py /path/to/your/dataset
```

This will:
1. Copy images to `ml/dataset/raw/`
2. Update `ml/models/class_names.json`
3. Create stratified splits in `ml/dataset/processed/`

### Retraining
```bash
cd ml/training
python train_mobilenet.py
```

## Testing

### ML Service
```bash
cd ml
python test_service.py
```

### Backend
```bash
cd backend
python test_api.py
```

## Startup Order

1. **MongoDB** - Database must be running
2. **ML Service** - Start with `uvicorn ml.inference.app:app --reload --port 8000`
3. **Backend** - Start with `npm run dev` in backend folder
4. **Frontend** - Start with `npm run dev` in frontend folder

## API Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Backend   │────▶│   ML        │────▶│  Cloudinary │
│   React     │     │   Node.js   │     │   Service   │     │  (Images)   │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   MongoDB   │
                    │  Database   │
                    └─────────────┘
```

## Next Steps

1. ✅ ML Service implemented
2. ✅ Backend dependencies added
3. ✅ Backend modules implemented (diagnosis, telemetry, alerts, risk)
4. ✅ Frontend services implemented
5. ✅ Custom dataset preparation script created
6. ⏳ Install dependencies: `npm install` in backend
7. ⏳ Start ML service: `uvicorn ml.inference.app:app --port 8000`
8. ⏳ Configure Cloudinary credentials
9. ⏳ Add downloaded datasets and update class_names.json
10. ⏳ Test end-to-end flow with your images
