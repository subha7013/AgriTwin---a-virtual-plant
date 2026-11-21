# AgriTwin: Model Evaluation & Comparative Analysis

This report documents the empirical evaluation and comparative analysis between **Model 1: Custom CNN** and **Model 2: MobileNetV2 Transfer Learning** evaluated on the independent test dataset (1,589 images) across 10 tomato disease classes.

---

## 1. Overall Model Comparison Table

| Metric | Custom CNN (Baseline) | MobileNetV2 (Transfer Learning) | Winner / Preferred |
| :--- | :--- | :--- | :--- |
| **Training Strategy** | Trained from scratch | Two-phase ImageNet Transfer Learning | MobileNetV2 |
| **Parameters** | 422,602 | 2,269,962 | Custom CNN (smaller) |
| **Model Disk Size** | **4.90 MB** | 22.18 MB | Custom CNN |
| **Independent Test Accuracy** | 86.78% | **87.85%** | **MobileNetV2 (+1.07%)** |
| **Macro Precision** | 87.52% | **89.27%** | **MobileNetV2 (+1.75%)** |
| **Macro Recall** | 87.11% | **87.98%** | **MobileNetV2 (+0.87%)** |
| **Macro F1-Score** | 86.62% | **88.01%** | **MobileNetV2 (+1.39%)** |
| **Weighted F1-Score** | 86.45% | **87.91%** | **MobileNetV2** |
| **GPU Inference Latency** | **23.85 ms** | 109.19 ms | Custom CNN (4.5x faster) |

---

## 2. Class-Wise Performance Comparison

### Custom CNN Class-Wise Breakdown
| Disease Class | Precision | Recall | F1-Score | Support |
| :--- | :--- | :--- | :--- | :--- |
| **Tomato Bacterial Spot** | 0.9103 | 0.8000 | 0.8516 | 165 |
| **Tomato Early Blight** | 0.8758 | 0.8121 | 0.8428 | 165 |
| **Tomato Late Blight** | 0.8249 | 0.8848 | 0.8538 | 165 |
| **Tomato Leaf Mold** | 0.8010 | 0.9515 | 0.8698 | 165 |
| **Tomato Septoria Leaf Spot**| 0.9706 | 0.6000 | 0.7416 | 165 |
| **Tomato Spider Mites** | 0.9013 | 0.8354 | 0.8671 | 164 |
| **Tomato Target Spot** | 0.8291 | 0.8733 | 0.8506 | 150 |
| **Tomato Yellow Leaf Curl** | 0.7935 | 0.9733 | 0.8743 | 150 |
| **Tomato Mosaic Virus** | 0.9304 | 0.9800 | 0.9545 | 150 |
| **Tomato Healthy** | 0.9146 | 1.0000 | 0.9554 | 150 |

### MobileNetV2 Class-Wise Breakdown
| Disease Class | Precision | Recall | F1-Score | Support |
| :--- | :--- | :--- | :--- | :--- |
| **Tomato Bacterial Spot** | 0.9514 | 0.8303 | 0.8867 | 165 |
| **Tomato Early Blight** | 0.9037 | 0.7394 | 0.8133 | 165 |
| **Tomato Late Blight** | 0.9597 | 0.8667 | 0.9108 | 165 |
| **Tomato Leaf Mold** | 0.9012 | 0.8848 | 0.8930 | 165 |
| **Tomato Septoria Leaf Spot**| 0.7123 | 0.9152 | 0.8011 | 165 |
| **Tomato Spider Mites** | 0.8142 | 0.9085 | 0.8588 | 164 |
| **Tomato Target Spot** | 0.9823 | 0.7400 | 0.8441 | 150 |
| **Tomato Yellow Leaf Curl** | 0.9790 | 0.9333 | 0.9556 | 150 |
| **Tomato Mosaic Virus** | 0.7812 | 1.0000 | 0.8772 | 150 |
| **Tomato Healthy** | 0.9423 | 0.9800 | 0.9608 | 150 |

---

## 3. Best Model Selection Rationalization

### Recommendation: **MobileNetV2** for Production Deployment
1. **Higher Diagnostic Recall & F1**: In precision agriculture, recall is the paramount clinical metric—missing an active pathogen infection (false negative) leads to devastating crop failure, whereas a false alarm can be easily re-examined. MobileNetV2 achieves higher macro recall (**87.98%**) and higher macro F1 (**88.01%**).
2. **Superior Fungal Detection**: For high-impact fungal conditions such as *Late Blight* (*Phytophthora infestans*), MobileNetV2 achieves **91.08% F1-score** vs. 85.38% on Custom CNN.
3. **Generalization Power**: MobileNetV2's ImageNet pretrained features prevent severe overfitting on background artifacts (greenhouse pipes, soil, lighting angles), confirmed via Grad-CAM activation heatmaps.
