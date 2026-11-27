# AgriTwin: Machine Learning Model Architecture & 4-Phase Pipeline

This document details the architectural specifications of the Deep Learning vision classifier and Environmental Risk Prediction Engine for the **AgriTwin** Tomato Digital Twin system, aligned with the rigorous 4-Phase Research & Production Specification.

---

## 1. Vision Module: Target Disease Classes (10 Categories)

The vision module ingests **128 × 128 × 3 RGB** leaf photographs taken in greenhouse or field settings, performs standardized data preprocessing, and outputs class probabilities across 10 tomato leaf conditions:

1. `Tomato___Bacterial_spot` (*Xanthomonas spp.*)
2. `Tomato___Early_blight` (*Alternaria solani*)
3. `Tomato___healthy` (Asymptomatic control)
4. `Tomato___Late_blight` (*Phytophthora infestans*)
5. `Tomato___Leaf_Mold` (*Passalora fulva*)
6. `Tomato___Septoria_leaf_spot` (*Septoria lycopersici*)
7. `Tomato___Spider_mites Two-spotted_spider_mite` (*Tetranychus urticae*)
8. `Tomato___Target_Spot` (*Corynespora cassiicola*)
9. `Tomato___Tomato_mosaic_virus` (ToMV)
10. `Tomato___Tomato_Yellow_Leaf_Curl_Virus` (TYLCV)

---

## 2. Phase 1 — Dataset Audit & Leakage-Free Split

### The Leakage Problem in PlantVillage
In standard Kaggle / PlantVillage distributions, multiple images are augmented duplicates of single source leaves (e.g. `original_<uuid>___<name>.JPG_<uuid2>.JPG` vs `<uuid>___<name>.JPG`). A random per-image split results in data leakage where variants of the same physical leaf land in both train and validation splits, artificially inflating validation accuracy to 98%+. Furthermore, default subfolders often omit classes from validation (e.g. only 6 classes).

### AgriTwin Audit & Clean Split Fix (`ml/dataset/make_clean_split.py`)
- **Audit Findings**:
  - `Tomato___Tomato_mosaic_virus`: 1,000 files, but only **335** unique source leaves (665 augmented copies).
  - `Tomato___Leaf_Mold`: 1,100 files, 904 unique sources (196 augmented copies).
  - `Tomato___Early_blight`: 1,100 files, 950 unique sources (150 augmented copies).
  - Entire dataset: 10,584 raw images condensed into **9,558 true unique source images**.
- **Split Strategy**:
  - Deduplicated mode: Exactly 1 representative photo per source key.
  - Grouped by source key, partitioned 85% train (8,125 images) and 15% validation (1,433 images) with fixed seed `42`.
  - All 10 classes strictly represented in both splits.
  - Manifest exported to `ml/dataset/splits.json` documenting every file, class, source key, and split assignment.
  - **Leakage Verification**: Exactly **0** overlapping source keys between train and val.

---

## 3. Phase 2 — MobileNetV2 Architecture & Training Specification

### Architecture Overview
```text
Input Layer (128 × 128 × 3)
│
├── On-the-fly Data Augmentation:
│   ├── RandomFlip("horizontal")
│   ├── RandomRotation(0.1)
│   ├── RandomZoom(0.1)
│   └── RandomBrightness(0.1)
│
├── Explicit Keras 3 Rescaling:
│   └── layers.Rescaling(1 / 127.5, offset=-1.0) -> Normalizes [0, 255] to [-1.0, 1.0]
│
├── Pretrained MobileNetV2 Backbone (ImageNet weights, include_top=False)
│
├── GlobalAveragePooling2D()
├── Dropout(0.3)
└── Dense(10, activation="softmax") -> Disease Probabilities
```

### Staged Training Protocol (`ml/training/train_phase2_mobilenet.py`)
- **Stage 1 (Head Warmup)**:
  - Base model completely frozen (`trainable = False`).
  - Optimizer: Adam ($\text{lr} = 10^{-3}$).
  - Duration: 5 epochs.
  - Balanced `class_weights` applied (compensates for Mosaic Virus having 285 train sources vs ~935 for other classes).
- **Stage 2 (Fine-Tuning)**:
  - Unfreeze top ~50 layers of MobileNetV2 backbone.
  - **Critical Rule**: All `BatchNormalization` layers remain **frozen** (`layer.trainable = False`) to prevent corrupting pretrained batch statistics on batch size 32.
  - Optimizer: Adam ($\text{lr} = 10^{-4}$).
  - Duration: 8 epochs.
  - Callbacks: `ModelCheckpoint` (saving `ml/models/model.keras` on `val_accuracy`), `EarlyStopping(patience=4)`, `ReduceLROnPlateau(patience=2, factor=0.5)`.

---

## 4. Phase 3 — Evaluation Artifacts (`ml/evaluation/evaluate_phase3.py`)

Outputs produced on the leak-free validation set:
1. `ml/models/model.keras`: Best checkpoint model weights and computational graph.
2. `ml/models/labels.json`: Class ordering, input size `[128, 128, 3]`, preprocessing formula, and model version.
3. `ml/models/metrics.json`: Validation accuracy, macro F1, weighted F1, per-class precision/recall/F1, and identification of the weakest class (Early Blight).
4. `ml/evaluation/results/confusion_matrix.csv` & `confusion_matrix.png`: Normalized confusion matrix across all 10 classes.
5. `ml/evaluation/results/training_curves.png`: Loss and accuracy curves across Stage 1 and Stage 2.

---

## 5. Phase 4 — Hardware Camera (ESP32-CAM) Adaptation

1. **Inference Quality Gating (`ml/inference/hardware_camera_pipeline.py`)**:
   - **Laplacian Blur Detection**: Rejects frames with $\text{Var}(\text{Laplacian}) < 100.0$.
   - **Exposure Gating**: Rejects frames with mean brightness $< 40$ (underexposed) or $> 220$ (overexposed).
   - **Center Crop**: Focuses on inner 85% area to remove edge distortions.
2. **Temporal Smoothing**:
   - Sliding window averaging over 5 successive frames.
   - Confidence threshold (0.70): Predictions below 70% return `UNCERTAIN_LOW_CONFIDENCE` with recommendation to retake.
3. **Capture Protocol Documentation**:
   - Detailed in `ml/documentation/esp32_cam_protocol.md`.
