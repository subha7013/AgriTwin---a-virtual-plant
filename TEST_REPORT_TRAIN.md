# AgriTwin — Training-Split Test Report

**Generated:** 2026-11-27
**Harness:** `run_tests.py` with `TEST_DIR=ml/dataset/processed/train`
**Raw results:** `test_results_train.json`
**Sample:** 20 images per class × 10 classes = **200 images** (ML), 1 image/class for backend flow

> This run evaluates the model on images from the project's **training split**
> (`ml/dataset/processed/train`). Results are therefore **in-distribution** and
> intentionally optimistic — they measure how well the model reproduces labels it
> was exposed to, not real-world generalisation (see the Mendeley external report
> for that).

---

## 1. Headline Result

| Metric | Value |
|--------|------:|
| Images evaluated | 200 |
| Correct | 164 |
| **Accuracy (training split)** | **82.0%** |
| Request success rate | 200/200 (100%) |
| Diagnosis end-to-end | 10/10 (100%) |

---

## 2. Per-Class Accuracy

| Class | Correct / 20 | Accuracy | Main confusion |
|-------|:------------:|:--------:|----------------|
| Tomato Septoria Leaf Spot | 20 | **100%** | — |
| Tomato Mosaic Virus | 20 | **100%** | — |
| Tomato Healthy | 20 | **100%** | — |
| Tomato Leaf Mold | 19 | **95%** | 1 → Septoria |
| Tomato Yellow Leaf Curl Virus | 19 | **95%** | 1 → Mosaic Virus |
| Tomato Target Spot | 18 | **90%** | 1 → Septoria, 1 → Healthy |
| Tomato Spider Mites | 16 | **80%** | 3 → Target Spot, 1 → Healthy |
| Tomato Early Blight | 12 | **60%** | 3 → Septoria, 3 → Target Spot, 2 → Late Blight |
| Tomato Late Blight | 12 | **60%** | 3 → Healthy, 2 → Mosaic, 2 → Septoria, 1 → Early Blight |
| Tomato Bacterial Spot | 8 | **40%** ⚠️ | 10 → Septoria, 2 → Target Spot |

### Confusion detail

```
Bacterial Spot  -> Bacterial 8 | Septoria 10 | Target 2
Early Blight    -> Early 12 | Septoria 3 | Target 3 | Late Blight 2
Late Blight     -> Late 12 | Healthy 3 | Mosaic 2 | Septoria 2 | Early 1
Leaf Mold       -> Leaf Mold 19 | Septoria 1
Septoria        -> Septoria 20
Spider Mites    -> Spider 16 | Target 3 | Healthy 1
Target Spot     -> Target 18 | Septoria 1 | Healthy 1
Yellow Leaf Curl-> YLCV 19 | Mosaic 1
Mosaic Virus    -> Mosaic 20
Healthy         -> Healthy 20
```

---

## 3. Key Findings

1. **The model reproduces well on most classes it learned:** Septoria, Mosaic, Healthy all 100%; Leaf Mold and YLCV 95%.
2. **Bacterial Spot is the weakest even in-distribution (40%).** Ten of twenty samples are pulled to Septoria. This is not a domain-shift issue — it happens on the model's own training split, so the Bacterial Spot decision boundary is genuinely under-fit.
3. **Early Blight (60%) and Late Blight (60%) also under-perform.** Septoria and Target Spot act as attractors for the brown-spot diseases; Late Blight also leaks to Healthy.
4. **Healthy is perfect in-domain (100%)** — but see the Mendeley report, where it collapsed to 5% externally. So the model recognises *its own* healthy images but not unseen ones.
5. **Overall 82% in-distribution** vs **62.5% external** (Mendeley) — an expected, healthy gap that quantifies overfitting.

---

## 4. Backend End-to-End (training-split images)

| Step | Endpoint | Result |
|------|----------|--------|
| Health | `/api/v1/health` | ✅ 200 |
| Login | `/api/v1/auth/login` | ✅ 200 |
| Diagnosis | `/api/v1/diagnosis/diagnose` | ✅ **201 × 10/10** |
| Telemetry | `/api/v1/telemetry` | ✅ 4/4 |
| Alerts | `/api/v1/alerts` | ✅ 200 (8 alerts) |
| Risk | `/api/v1/risk` | ✅ 201 (score 54, Moderate Risk) |

Risk fusion proof:

```json
{
  "status_code": 201,
  "risk_category": "Moderate Risk",
  "risk_score": 54,
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

Telemetry ingest proof:

```json
[
  {"sensorType": "temperature", "value": 28.5, "status_code": 201, "success": true},
  {"sensorType": "humidity", "value": 65, "status_code": 201, "success": true},
  {"sensorType": "soil_moisture", "value": 45, "status_code": 201, "success": true},
  {"sensorType": "temperature", "value": 41, "status_code": 201, "success": true}
]
```

The 41 °C reading again raised the risk score and triggered a Critical/Temperature alert.

---

## 5. Context vs Other Test Sets

| Test set | Domain | Accuracy | Healthy | Bacterial Spot |
|----------|--------|---------:|:-------:|:--------------:|
| `processed/train` | **In-distribution** (this report) | **82.0%** | 100% | 40% |
| `processed/test` | In-distribution (held-out) | ~78% | 100% | — |
| `mendeley/TomatoDataset` | External / OOD | 62.5% | 5% | 50% |

The training-split result (82%) sits above the held-out split (78%) and well above external (62.5%), which is the expected ordering and confirms the pipeline is behaving sensibly.

---

## 6. Observations

- **Bacterial Spot (40%) is the priority fix** — it fails even on training data, so it is a model-capacity/class-boundary problem, not a data-shift one.
- **Septoria is a sponge**: it absorbs Bacterial (10), Early (3), Late (2), and even steals Leaf Mold (1). A dedicated pairwise check Bacterial-vs-Septoria would help.
- **Late Blight → Healthy (3)** is a costly error direction (missed disease). Worth watching.

---

## 7. Reproduce

```bash
# ML service (terminal 1)
cd ml
set PYTHONPATH=..\..
python -m ml.inference.app

# Backend (terminal 2)
cd backend
node src/server.js

# Training-split test (terminal 3)
cd ..
set TEST_DIR=ml/dataset/processed/train
set MAX_IMAGES_PER_CLASS=20
set OUTPUT_JSON=test_results_train.json
python run_tests.py
```

---

*End of report.*