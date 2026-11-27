# AgriTwin — Live End-to-End Test Report

**Generated:** 2026-11-27 12:28 UTC
**Test harness:** `run_tests.py` (raw results in `test_results.json`)
**Dataset:** Mendeley TomatoDataset → `ml/dataset/processed/test`
**Sample size:** 50 images (5 per class × 10 classes) for ML; 1 image per class for the full backend flow

---

## 1. Environment

| Component | URL | Status |
|-----------|-----|--------|
| ML Service (FastAPI) | http://localhost:8000 | ✅ Running (MobileNetV2, 10 classes) |
| Backend (Node/Express) | http://localhost:5000 | ✅ Running (MongoDB connected) |
| Database | MongoDB Atlas | ✅ Connected |
| Image storage | Cloudinary | ✅ Uploads confirmed |

Startup commands used:

```bash
# ML service
cd ml
set PYTHONPATH=<project-root>
python -m ml.inference.app

# Backend
cd backend
node src/server.js
```

---

## 2. Bugs Found & Fixed During This Test

The first live run surfaced several defects that were fixed before the final run below.

| # | Symptom | Root cause | Fix |
|---|---------|-----------|-----|
| 1 | Model predicted **"Tomato Late Blight" for every image** (even Healthy) | `app.py` divided pixels by 255, but the saved model already bakes in `preprocess_input` (expects raw 0–255) | Reused canonical `inference/preprocessing.py` with raw range + 0.85 centre crop |
| 2 | Healthy plant reported **risk = High** | ML service doesn't return `isHealthy`; service passed `undefined` into risk calc | Derive `isHealthy` from predicted label before risk calc |
| 3 | `/risk` returned **400 validation failed** | `RiskAssessment` model needs `riskScore(0-100)`, `riskCategory`, and `inputTelemetry{...}` | Rewrote `risk.service.js` to build the real schema from telemetry |
| 4 | Alert creation wrote fields the schema rejects | `Alert` model uses `title/message/type[Critical|Warning|Info]/category/read/resolved` | Rewrote `alerts.service.js` + telemetry `checkAlerts` to match |
| 5 | `/alerts/latest`, `/risk/latest` etc. mis-routed to `/:id` | Express matched `/:id` before specific paths | Reordered routes so static paths precede `/:id` |
| 6 | Telemetry never scoped to user | `Telemetry` model has **no** `user` field (links via `plant`), and uses `recordedAt` not `timestamp` | Scoped queries through the user's owned plants; switched to `recordedAt` |
| 7 | `require is not defined` | ESM module | Imported `mongoose` at top instead of `require` |

> Bug #1 was the most serious: before the fix the model appeared "perfect" only because it collapsed to one class. After the fix it genuinely discriminates.

---

## 3. ML Service — Per-Class Accuracy

**Overall: 39 / 50 correct = 78.0%**

| Disease class | Samples | Correct | Accuracy | Predicted distribution |
|---------------|:-------:|:-------:|:--------:|------------------------|
| Bacterial Spot | 5 | 2 | 40% | 2 correct, 3 → Septoria Leaf Spot |
| Early Blight | 5 | 1 | 20% | 1 correct, 2 → Target Spot, 1 → Late Blight, 1 → Septoria |
| Late Blight | 5 | 4 | 80% | 4 correct, 1 → Septoria |
| Leaf Mold | 5 | 5 | **100%** | all correct |
| Septoria Leaf Spot | 5 | 3 | 60% | 3 correct, 1 → Leaf Mold, 1 → Target Spot |
| Spider Mites | 5 | 4 | 80% | 4 correct, 1 → Mosaic Virus |
| Target Spot | 5 | 5 | **100%** | all correct |
| Yellow Leaf Curl Virus | 5 | 5 | **100%** | all correct |
| Mosaic Virus | 5 | 5 | **100%** | all correct |
| Healthy | 5 | 5 | **100%** | all correct |

### Confusion hotspots
- **Early Blight ↔ Target Spot ↔ Septoria** are the main confusions (all are similar brown-spot/ring lesions). Early Blight is the weakest class (20%).
- **Healthy detection is perfect (100%)** — important for avoiding false positives in the field.
- Viral classes (Mosaic, Yellow Leaf Curl) and Leaf Mold are reliably identified.

### Sample raw prediction (Healthy, proving discrimination)

```json
{
  "success": true,
  "disease": "Tomato Healthy",
  "confidence": 0.9813,
  "probabilities": {
    "Tomato Healthy": 0.9813,
    "Tomato Mosaic Virus": 0.0,
    "Tomato Late Blight": 0.001
  },
  "model": "mobilenetv2"
}
```

---

## 4. Backend — Endpoint Results

| Step | Endpoint | Method | Result |
|------|----------|--------|--------|
| Health | `/api/v1/health` | GET | ✅ 200 — `{status: ok, database: connected}` |
| Login | `/api/v1/auth/login` | POST | ✅ 200 — JWT access + refresh tokens |
| Diagnosis | `/api/v1/diagnosis/diagnose` | POST | ✅ **201 × 10/10** — image → ML → Cloudinary → DB |
| Telemetry | `/api/v1/telemetry` | POST | ✅ **201 × 4/4** |
| Alerts | `/api/v1/alerts` | GET | ✅ 200 — 6 alerts returned |
| Risk | `/api/v1/risk` | POST | ✅ **201** — score 53 → "Moderate Risk" |

**Diagnosis success rate: 10/10 (100%)** — every class flow completed end-to-end.

### Risk assessment proof

```json
{
  "status_code": 201,
  "risk_category": "Moderate Risk",
  "risk_score": 53,
  "input_telemetry": {
    "temperature_c": 41,
    "relative_humidity_pct": 65,
    "soil_moisture_pct": 45,
    "leaf_wetness_pct": 0
  },
  "recommendations": [
    "Monitor Tomato Bacterial Spot closely and consider treatment.",
    "Provide shade to reduce heat stress."
  ]
}
```

The 41 °C reading pushed the score up and triggered the shade recommendation — confirming telemetry → risk fusion works.

### Alert generation proof (telemetry-driven, ML-compatible schema)

```json
[
  {
    "title": "High temperature detected",
    "type": "Critical",
    "category": "Temperature",
    "message": "Temperature is 41°C, above the 35°C safe threshold."
  },
  {
    "title": "Low Soil Moisture",
    "type": "Warning",
    "category": "Soil Moisture",
    "message": "Soil moisture is currently 35%. Check the irrigation requirements."
  }
]
```

Submitting a 41 °C reading automatically produced a **Critical / Temperature** alert — threshold alerting is verified.

### Diagnosis record proof

```json
{
  "success": true,
  "data": {
    "disease": "Tomato Healthy",
    "confidence": 0.9813,
    "isHealthy": true,
    "riskLevel": "Low",
    "model": "mobilenetv2",
    "imageStoragePath": "https://res.cloudinary.com/dqhuwttbb/image/upload/v.../agritwin/diagnoses/diagnosis_...jpg"
  },
  "message": "Diagnosis completed successfully"
}
```

---

## 5. Full Integration Flow (verified)

```
Frontend ──► POST /api/v1/diagnosis/diagnose (multipart image)
              │
              ├─► multer saves temp file
              ├─► mlClient → ML service POST /predict  → {disease, confidence, probabilities}
              ├─► derived isHealthy + riskLevel
              ├─► Cloudinary upload → secure_url
              ├─► MongoDB Diagnosis.create(...)
              └─► 201 JSON with image URL + diagnosis
```

All stages executed successfully for all 10 classes.

---

## 6. Summary Scorecard

| Area | Result |
|------|--------|
| ML service health | ✅ 200 |
| ML prediction success | ✅ 50/50 requests |
| ML classification accuracy (5/class sample) | **78.0%** (39/50) |
| Backend health | ✅ 200 |
| Auth (login) | ✅ 200 |
| Diagnosis end-to-end | ✅ 10/10 (100%) |
| Telemetry ingest | ✅ 4/4 |
| Alert generation | ✅ 6 alerts (Critical/Warning/Info) |
| Risk assessment | ✅ 201 (score 53, Moderate Risk) |
| Cloudinary upload | ✅ all images stored |

---

## 7. Observations & Next Steps

1. **Early Blight is the weak spot (20%).** It is frequently confused with Target Spot and Septoria. Recommend fine-tuning with more Early Blight samples or class-weighted loss.
2. **Confidence is sometimes low on misclassifications** (e.g. 0.46–0.60). The backend already flags `riskLevel`; consider surfacing low-confidence results as "uncertain — retake photo" in the UI.
3. **Run a larger evaluation** with `MAX_IMAGES_PER_CLASS=20` (or the full test split) for a tighter accuracy estimate before trusting the number in production.
4. **ML preprocessing is now correct** — but keep monitoring that any future `app.py` edits continue to use `inference/preprocessing.py` (no manual /255).
5. **Dataset is class-balanced**, so accuracy gaps are genuine model issues, not sampling bias.

---

## 8. How to Reproduce

```bash
# 1. Start ML service (terminal 1)
cd ml
set PYTHONPATH=..\..
python -m ml.inference.app

# 2. Start backend (terminal 2)
cd backend
node src/server.js

# 3. Run the suite (terminal 3)
cd ..
python run_tests.py                 # default: 5 images/class
set MAX_IMAGES_PER_CLASS=20
python run_tests.py                 # larger sample
```

Raw, machine-readable results are saved to `test_results.json`.

---

*End of report.*