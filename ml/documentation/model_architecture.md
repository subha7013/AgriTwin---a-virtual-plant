# AgriTwin: Machine Learning Model Architecture

This document describes the architectural specifications of the Deep Learning vision classifiers and Environmental Risk Prediction Engine implemented for the **AgriTwin** Tomato Digital Twin system.

---

## 1. Vision Module: Tomato Leaf Disease Detection

The vision module ingests **224 × 224 × 3 RGB** leaf photographs taken in greenhouse or field settings, performs standardized data preprocessing, and outputs class probabilities across 10 disease conditions.

### Target Disease Classes (10 Categories)
1. **Tomato Bacterial Spot** (*Xanthomonas spp.*)
2. **Tomato Early Blight** (*Alternaria solani*)
3. **Tomato Healthy** (Asymptomatic control)
4. **Tomato Late Blight** (*Phytophthora infestans*)
5. **Tomato Leaf Mold** (*Passalora fulva*)
6. **Tomato Septoria Leaf Spot** (*Septoria lycopersici*)
7. **Tomato Spider Mites** (*Tetranychus urticae*)
8. **Tomato Target Spot** (*Corynespora cassiicola*)
9. **Tomato Mosaic Virus** (ToMV)
10. **Tomato Yellow Leaf Curl Virus** (TYLCV)

---

## 2. Model 1: Custom CNN (Experimental Baseline)

A hierarchical 4-block Convolutional Neural Network trained from scratch to provide a baseline performance benchmark.

### Architecture Overview
```text
Input Layer (224 × 224 × 3)
│
├── Data Augmentation (RandomFlip, RandomRotation, RandomZoom)
├── Rescaling (1 / 255.0)
│
├── Conv Block 1: Conv2D(32, 3x3, ReLU, same) -> MaxPooling2D(2, 2)
├── Conv Block 2: Conv2D(64, 3x3, ReLU, same) -> MaxPooling2D(2, 2)
├── Conv Block 3: Conv2D(128, 3x3, ReLU, same) -> MaxPooling2D(2, 2)
├── Conv Block 4: Conv2D(256, 3x3, ReLU, same) -> MaxPooling2D(2, 2)
│
├── GlobalAveragePooling2D()
├── Dropout (0.4)
├── Dense (128 units, ReLU)
├── Dropout (0.3)
└── Dense (10 units, Softmax) -> Disease Probabilities
```

- **Total Parameters**: 422,602 (~1.61 MB)
- **Optimizer**: Adam ($\text{lr} = 10^{-3}$)
- **Loss**: Categorical Cross-Entropy

---

## 3. Model 2: MobileNetV2 (Primary Production Classifier)

A lightweight inverted residual architecture pretrained on ImageNet (1.4M images) leveraging depthwise separable convolutions for edge-friendly and rapid inference.

### Architecture Overview
```text
Input Layer (224 × 224 × 3)
│
├── Data Augmentation (Horizontal Flip, Rotation, Zoom)
├── MobileNetV2 Preprocessing (Normalizes pixels to [-1, 1])
├── Pretrained MobileNetV2 Backbone (ImageNet weights, 154 layers)
│   └── Inverted Residual Blocks with Linear Bottlenecks
├── GlobalAveragePooling2D()
├── Dropout (0.3)
└── Dense (10 units, Softmax) -> Disease Probabilities
```

### Staged Training Strategy
1. **Phase A – Feature Extraction**:
   - Backbone is completely frozen (`trainable = False`).
   - Only newly appended top classification head is trained with Adam ($\text{lr} = 10^{-3}$) for 5–8 epochs.
2. **Phase B – Fine-Tuning**:
   - Backbone is partially unfrozen (top 40 inverted residual layers unlocked).
   - Trained with delicate learning rate ($\text{lr} = 10^{-5}$) using Adam to adapt high-level feature representations to fungal and viral leaf symptom patterns.

---

## 4. Component 3: Environmental Risk Prediction Engine

Predicts the microclimatic favourability for disease outbreak from live IoT environmental telemetry.

### Input Features
| Feature | Sensor | Unit | Agronomic Relevance |
| :--- | :--- | :--- | :--- |
| `temperature_c` | DHT22 | °C | Optimal fungal growth range (18–26°C) |
| `relative_humidity_pct` | DHT22 | % | Spore germination requires RH > 80% |
| `soil_moisture_pct` | Capacitive | % | Waterlogging stress |
| `leaf_wetness_pct` | Grid Sensor | % | Extended free water allows bacterial penetration |
| `humidity_6h_avg` | Rolling Window | % | Sustained moisture duration |
| `temp_6h_std` | Rolling Window | °C | Thermal fluctuation |
| `leaf_wetness_hours_last_12h` | Rolling Window | Hours | Threshold for Phytophthora late blight |

### Algorithm: Random Forest Classifier
- **Number of Estimators**: 100 trees
- **Max Depth**: 8
- **Output**: Multi-class risk rating (`Low`, `Moderate`, `High`) + continuous risk score ($[0.0, 1.0]$).

---

## 5. Explainable AI: Grad-CAM

Gradient-weighted Class Activation Mapping (Grad-CAM) extracts gradients of the highest-confidence predicted class with respect to the final convolutional feature maps (`out_relu` in MobileNetV2 and `conv4` in Custom CNN) to generate visual heatmaps pinpointing which lesion areas informed the model's decision.
