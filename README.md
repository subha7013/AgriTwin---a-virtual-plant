# AgriTwin: Digital Twin System for Precision Tomato Agriculture

**AgriTwin** is an end-to-end cyber-physical digital twin ecosystem for smart greenhouse farming. It integrates real-time environmental IoT sensing, edge camera diagnostics, and deep learning vision models to diagnose crop diseases and predict microclimatic disease outbreak risk before physical symptoms spread.

---

## 🛠️ System Architecture

```text
       [ ESP32 Sensors & OV2640 Camera ]
                      │
           (MQTT / HTTP Telemetry)
                      ▼
   ┌─────────────────────────────────────────┐
   │         AgriTwin Backend Server         │
   │      (Node.js / Express / MongoDB)      │
   └─────────────┬───────────────────────────┘
                 │
      ┌──────────┴──────────┐
      ▼                     ▼
┌──────────────────┐  ┌───────────────────────────────────┐
│ React Dashboard  │  │        Python ML Subsystem        │
│  (Vite + Chart)  │  │  • MobileNetV2 Vision Classifier  │
│                  │  │  • Random Forest Risk Engine      │
│                  │  │  • Hardware Camera Quality Gate   │
└──────────────────┘  └───────────────────────────────────┘
```

---

## 🔬 Machine Learning Pipeline (4-Phase Architecture)

The vision diagnostic module adheres strictly to a 4-phase research and production standard:

1. **Phase 1 — Dataset Audit & Leakage-Free Split**:
   - Deduplicated 10,584 raw images into **9,558 true unique source leaves** using UUID parsing.
   - Fixed split: **85% Train (8,125 images)** / **15% Validation (1,433 images)** with zero source overlap.
   - All 10 classes represented in both splits, recorded in `ml/dataset/splits.json`.
2. **Phase 2 — MobileNetV2 Architecture & Training**:
   - Input: $128 \times 128 \times 3$, explicit `layers.Rescaling(1/127.5, offset=-1.0)`.
   - Balanced class weighting (handling lower sample sizes for Tomato Mosaic Virus).
   - Stage 1: Base frozen head warmup (5 epochs, Adam $\text{lr}=10^{-3}$).
   - Stage 2: Fine-tuning last 50 layers (8 epochs, Adam $\text{lr}=10^{-4}$) with **Batch Normalization strictly frozen**.
3. **Phase 3 — Honest Evaluation & Artifacts**:
   - Honest leak-free validation accuracy: **94.49%**, Macro F1: **0.9486**.
   - Generated deliverables: `model.keras`, `labels.json`, `metrics.json`, `confusion_matrix.png`, and `training_curves.png`.
4. **Phase 4 — Hardware Camera Quality Gating (ESP32-CAM)**:
   - Laplacian blur variance filtering ($\text{Var} \ge 100.0$).
   - Brightness exposure checks ($40 \le Y \le 220$).
   - Center crop (85% area) and temporal sliding-window probability smoothing with a 70% confidence threshold.

---

## 🚀 ML Running Steps

### 1. Dataset Audit & Clean Split (Phase 1)
To re-run the dataset audit, deduplicate raw images, generate the leakage-free 85/15 train/val split, and update `splits.json`:
```powershell
python ml/dataset/make_clean_split.py
```

### 2. Train MobileNetV2 Vision Classifier (Phase 2)
Trains the primary MobileNetV2 transfer-learning model on the clean split with frozen BatchNorm fine-tuning and balanced class weights:
```powershell
python ml/training/train_phase2_mobilenet.py
```
*Outputs: `ml/models/model.keras` and `ml/evaluation/results/training_curves.png`.*

### 3. Train Environmental Risk Engine
Trains the Random Forest classifier on multi-sensor telemetry (temperature, humidity, leaf wetness, soil moisture):
```powershell
python ml/risk_prediction/train_risk_model.py
```
*Outputs: `ml/risk_prediction/risk_model.joblib`.*

---

### 4. Testing the Model (Inference & Diagnostics)

#### A. Quick Auto-Test (Instant 1-Command Verification)
If no image is specified, the script automatically picks a leaf from the validation set and prints a terminal diagnostic card:
```powershell
python ml/inference/predict.py
```

#### B. Test Any Specific Leaf Image
Run diagnosis on any local image file using `--image`:
```powershell
python ml/inference/predict.py --image "path/to/your/leaf_image.jpg"
```

#### C. Test on Sample Validation Leaves
- **Healthy Leaf:**
  ```powershell
  python ml/inference/predict.py --image "ml/dataset/clean_split/val/Tomato___healthy/0184dc6b-bfc1-4515-ac59-bbadaf524e1a___GH_HL Leaf 422.1.JPG"
  ```
- **Tomato Mosaic Virus:**
  ```powershell
  python ml/inference/predict.py --image "ml/dataset/clean_split/val/Tomato___Tomato_mosaic_virus/12f82f12-23f5-4edc-82d7-8bc3ee6f4848___PSU_CG 2373.JPG"
  ```
- **Early Blight:**
  ```powershell
  python ml/inference/predict.py --image "ml/dataset/clean_split/val/Tomato___Early_blight/004cbe60-8ff9-4965-92df-e86694d5e9ba___RS_Erly.B 8253.JPG"
  ```

#### D. Test with JSON Output (for API Integration)
Outputs the diagnostic payload as machine-readable JSON:
```powershell
python ml/inference/predict.py --image "path/to/your/leaf_image.jpg" --json
```

#### E. Test Different Model Backbones
- Primary MobileNetV2 (Default):
  ```powershell
  python ml/inference/predict.py --model mobilenetv2
  ```
- Baseline Custom CNN:
  ```powershell
  python ml/inference/predict.py --model custom_cnn
  ```
- Ensemble (70% MobileNetV2 + 30% Custom CNN):
  ```powershell
  python ml/inference/predict.py --model ensemble
  ```

---

### 5. Full Benchmark & Artifact Evaluation (Phase 3)
Evaluates `model.keras` across all **1,433 unseen validation images**, logs per-class precision/recall/F1, and generates the confusion matrix:
```powershell
python ml/evaluation/evaluate_phase3.py
```
*Outputs: `ml/models/metrics.json`, `ml/models/labels.json`, `ml/evaluation/results/confusion_matrix.png`, and `confusion_matrix.csv`.*

---

### 6. Test Hardware Camera Quality Gating (ESP32-CAM Phase 4)
Tests whether a capture from an edge camera satisfies sharpness and lighting conditions before running inference:
```powershell
python -c "
from PIL import Image
from ml.inference.hardware_camera_pipeline import HardwareQualityGating

img = Image.open('ml/dataset/clean_split/val/Tomato___healthy/0184dc6b-bfc1-4515-ac59-bbadaf524e1a___GH_HL Leaf 422.1.JPG')
valid, reason = HardwareQualityGating.evaluate_frame_quality(img)
blur = HardwareQualityGating.compute_blur_score(img)
brightness = HardwareQualityGating.compute_brightness(img)
print(f'Frame Accepted: {valid} ({reason})')
print(f'Laplacian Blur Variance: {blur:.1f} (Threshold >= 100)')
print(f'Average Brightness: {brightness:.1f} (Valid: 40-220)')
"
```

---

## ⚡ Quick Reference Commands

| Action | Terminal Command |
| :--- | :--- |
| **Audit & Clean Split** | `python ml/dataset/make_clean_split.py` |
| **Train MobileNetV2** | `python ml/training/train_phase2_mobilenet.py` |
| **Train Risk Engine** | `python ml/risk_prediction/train_risk_model.py` |
| **Evaluate Validation Set** | `python ml/evaluation/evaluate_phase3.py` |
| **Quick Test on Sample Leaf** | `python ml/inference/predict.py` |
| **Test Specific Image** | `python ml/inference/predict.py --image "path/to/leaf.jpg"` |
| **Test JSON Output** | `python ml/inference/predict.py --image "path/to/leaf.jpg" --json` |
| **Launch Jupyter Notebooks** | `jupyter notebook ml/notebooks` |

---

## 🌐 Full Stack Application Setup

### Backend (Node.js & Express)
```powershell
cd backend
npm install
npm run dev
```

### Frontend (React & Vite)
```powershell
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.
