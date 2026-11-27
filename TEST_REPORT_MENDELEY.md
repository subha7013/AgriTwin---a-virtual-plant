# AgriTwin — Mendeley External Dataset Test Report

**Generated:** 2026-11-27 12:34 UTC
**Harness:** `run_tests.py` with `TEST_DIR=ml/mendeley-dataset/TomatoDataset`
**Raw results:** `test_results_mendeley.json`
**Sample:** 20 images per class × 10 classes = **200 images** (ML), 1 image/class for backend flow

> This is an **external / out-of-distribution** test. The deployed model
> (`mobilenetv2_best.keras`) was trained on the original dataset; the Mendeley
> images were never used in training, so this measures real-world generalisation
> — not in-distribution fit.

---

## 1. Dataset

`ml/mendeley-dataset/TomatoDataset` — 1,609 images, 10 classes.

| Class | Images | Sampled |
|-------|-------:|--------:|
| Tomato___Bacterial_spot | 108 | 20 |
| Tomato___Early_blight | 298 | 20 |
| Tomato___healthy | 157 | 20 |
| Tomato___Late_blight | 111 | 20 |
| Tomato___Leaf_Mold | 400 | 20 |
| Tomato___Septoria_leaf_spot | 106 | 20 |
| Tomato___Spider_mites Two-spotted_spider_mite | 121 | 20 |
| Tomato___Target_Spot | 99 | 20 |
| Tomato___Tomato_mosaic_virus | 109 | 20 |
| Tomato___Tomato_Yellow_Leaf_Curl_Virus | 100 | 20 |

---

## 2. Headline Result

| Metric | Value |
|--------|------:|
| Images evaluated | 200 |
| Correct | 125 |
| **Accuracy (external)** | **62.5%** |
| Request success rate | 200/200 (100%) |

---

## 3. Per-Class Accuracy (Mendeley)

| Class | Correct / 20 | Accuracy | Main confusion |
|-------|:------------:|:--------:|----------------|
| Tomato Mosaic Virus | 20 | **100%** | — |
| Tomato Target Spot | 19 | **95%** | 1 → Healthy |
| Tomato Septoria Leaf Spot | 18 | **90%** | 2 → Leaf Mold |
| Tomato Yellow Leaf Curl Virus | 18 | **90%** | 1 → Late Blight, 1 → Early Blight |
| Tomato Late Blight | 17 | **85%** | 1 → Septoria, 1 → Mosaic, 1 → Healthy |
| Tomato Spider Mites | 14 | **70%** | 2 → Target Spot, 2 → Mosaic, 1 → Septoria, 1 → Healthy |
| Tomato Bacterial Spot | 10 | **50%** | 8 → Septoria, 2 → Target Spot |
| Tomato Early Blight | 8 | **40%** | 9 → Septoria, 3 → Late Blight |
| Tomato Healthy | 1 | **5%** ⚠️ | 6 → Early Blight, 4 → Late Blight, 3 → Mosaic, 3 → YLCV, 3 → Septoria |
| Tomato Leaf Mold | 0 | **0%** ⚠️ | 11 → Septoria, 7 → Early Blight, 1 → YLCV, 1 → Mosaic |

### Confusion summary (expected → predicted counts)

```
Bacterial Spot  -> Bacterial 10 | Septoria 8 | Target 2
Early Blight    -> Early 8 | Septoria 9 | Late Blight 3
Late Blight     -> Late 17 | Septoria 1 | Mosaic 1 | Healthy 1
Leaf Mold       -> Septoria 11 | Early Blight 7 | YLCV 1 | Mosaic 1   (0 correct)
Septoria        -> Septoria 18 | Leaf Mold 2
Spider Mites    -> Spider 14 | Target 2 | Mosaic 2 | Septoria 1 | Healthy 1
Target Spot     -> Target 19 | Healthy 1
Yellow Leaf Curl-> YLCV 18 | Late Blight 1 | Early Blight 1
Mosaic Virus    -> Mosaic 20
Healthy         -> Early Blight 6 | Late Blight 4 | Mosaic 3 | YLCV 3 | Septoria 3 | Healthy 1
```

---

## 4. Key Findings

1. **Two classes fail completely on external data:**
   - **Leaf Mold: 0%** — every sample is mapped to Septoria / Early Blight.
   - **Healthy: 5%** — the model almost never says "healthy"; it forces a disease label.
   This is the single most important result: in the field it would produce **false disease alarms** on healthy plants.

2. **Strong generalisers:** Mosaic (100%), Target Spot (95%), Septoria (90%), YLCV (90%), Late Blight (85%). These visual signatures transfer well.

3. **The "spot" diseases (Bacterial, Early Blight, Septoria, Target Spot, Leaf Mold) overlap heavily.** Septoria acts as an attractor — it absorbs a large share of Bacterial (8) and Early Blight (9) and all Leaf Mold (11) errors.

4. **Contrast with the in-distribution test:** the previous `ml/dataset/processed/test` run scored ~78%, with Healthy and Leaf Mold at 100%. The drop to 5% / 0% confirms the earlier figure was **in-distribution optimism** — the model memorised the training domain and does not generalise to Mendeley's healthy / leaf-mold appearance.

5. **Backend pipeline is solid regardless:** all 200 ML requests succeeded, and all 10 end-to-end diagnosis calls returned 201.

---

## 5. Backend End-to-End (using Mendeley images)

| Step | Endpoint | Result |
|------|----------|--------|
| Health | `/api/v1/health` | ✅ 200 |
| Login | `/api/v1/auth/login` | ✅ 200 |
| Diagnosis | `/api/v1/diagnosis/diagnose` | ✅ **201 × 10/10** |
| Telemetry | `/api/v1/telemetry` | ✅ 4/4 |
| Alerts | `/api/v1/alerts` | ✅ 200 (7 alerts) |
| Risk | `/api/v1/risk` | ✅ 201 (score 39, Moderate Risk) |

Sample diagnosis record (Mendeley Bacterial Spot image):

```json
{
  "success": true,
  "disease": "Tomato Target Spot",
  "confidence": 0.4764,
  "risk_level": "Medium",
  "is_healthy": false,
  "model": "mobilenetv2",
  "image_url": "https://res.cloudinary.com/dqhuwttbb/image/upload/v.../agritwin/diagnoses/diagnosis_...jpg",
  "latency_ms": 2127.5
}
```

Risk fusion proof:

```json
{
  "status_code": 201,
  "risk_category": "Moderate Risk",
  "risk_score": 39,
  "input_telemetry": {
    "temperature_c": 41,
    "relative_humidity_pct": 65,
    "soil_moisture_pct": 45,
    "leaf_wetness_pct": 0
  },
  "recommendations": [
    "Monitor Tomato Target Spot closely and consider treatment.",
    "Provide shade to reduce heat stress."
  ]
}
```

> Note: the low confidence on misclassifications (0.46–0.60) is itself a useful signal;
> the backend should treat `< 0.6` as "uncertain — retake photo" rather than asserting a disease.

---

## 6. Interpretation & Root Causes

- **Domain shift.** Mendeley images differ from the training set in capture conditions (background, lighting, resolution, framing). The model's features for "healthy" and "leaf mold" did not transfer.
- **Healthy is under-represented in decision behaviour.** Only ~10% of training data is healthy; combined with leaf-level close-ups in Mendeley, the model defaults to a disease class.
- **Septoria/Early/Leaf Mold tri-class overlap.** These share brown necrotic spotting; without enough external examples the decision boundary collapses toward Septoria.

---

## 7. Recommendations

1. **Retrain on the merged dataset (already prepared).** The Mendeley images were previously merged into `ml/dataset/raw` and re-split into `processed/`. Run:
   ```bash
   cd ml/training
   python train_mobilenet.py
   ```
   This should sharply lift Healthy and Leaf Mold, since those external styles will now be in-distribution.

2. **Add class weights / oversampling** for Healthy and Leaf Mold (the two collapse classes) during retraining.

3. **Confidence gating in the API/UI.** When `confidence < 0.6`, return `"uncertain"` and prompt a retake instead of a hard label. This directly mitigates the false-disease-on-healthy problem.

4. **Re-run this exact Mendeley suite after retraining** and compare against the 62.5% / Healthy 5% / Leaf Mold 0% baseline.

5. **Keep preprocessing fixed** (raw 0–255 + 0.85 centre crop) — it is required for the model to discriminate at all.

---

## 8. Reproduce

```bash
# ML service (terminal 1)
cd ml
set PYTHONPATH=..\..
python -m ml.inference.app

# Backend (terminal 2)
cd backend
node src/server.js

# Mendeley external test (terminal 3)
cd ..
set TEST_DIR=ml/mendeley-dataset/TomatoDataset
set MAX_IMAGES_PER_CLASS=20
set OUTPUT_JSON=test_results_mendeley.json
python run_tests.py
```

---

## 9. Baseline for Comparison

| Test set | Domain | Accuracy | Healthy | Leaf Mold |
|----------|--------|---------:|:-------:|:---------:|
| `ml/dataset/processed/test` | In-distribution | ~78% | 100% | 100% |
| `ml/mendeley-dataset/TomatoDataset` | **External** | **62.5%** | **5%** | **0%** |

This table is the key takeaway: **the model performs well on data resembling its training domain but does not yet generalise to the external Mendeley data** — retraining on the merged set is the next step.

---

*End of report.*