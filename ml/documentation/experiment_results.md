# AgriTwin: Experiment Tracking & Results Log

This document records the experimental iterations, hyperparameters, and outcomes across the AgriTwin ML/DL research lifecycle.

---

## Controlled Experiments Summary

| Experiment ID | Model Architecture | Training Strategy | Key Hyperparameters | Test Accuracy | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **EXP-01** | Custom CNN | Baseline from scratch | Adam (lr=1e-3), 10 epochs, batch 32 | **86.78%** | Completed |
| **EXP-02** | MobileNetV2 | Phase A (Feature Extraction) | Adam (lr=1e-3), frozen backbone, 8 epochs | 89.10% (val) | Completed |
| **EXP-03** | MobileNetV2 | Phase B (Fine-Tuning) | Adam (lr=1e-5), top 40 layers, 5 epochs | **87.85% (test)** | Completed & Selected |
| **EXP-04** | Random Forest | Environmental Risk Engine | 100 trees, max depth 8, microclimate sensors | **98.60%** | Completed |
| **EXP-05** | Logistic Regression | Environmental Baseline | L2 penalty, standard scaler | 74.80% | Outperformed by RF |

---

## Evaluation Artifacts Directory

- **Custom CNN Training Curve**: [custom_cnn_curves.png](file:///c:/Users/SUBHASISH%20NATH/OneDrive/Desktop/AgriTwin/ml/evaluation/results/custom_cnn_curves.png)
- **MobileNetV2 Training Curve**: [mobilenetv2_curves.png](file:///c:/Users/SUBHASISH%20NATH/OneDrive/Desktop/AgriTwin/ml/evaluation/results/mobilenetv2_curves.png)
- **Custom CNN Confusion Matrix**: [custom_cnn_confusion_matrix.png](file:///c:/Users/SUBHASISH%20NATH/OneDrive/Desktop/AgriTwin/ml/evaluation/results/custom_cnn_confusion_matrix.png)
- **MobileNetV2 Confusion Matrix**: [mobilenetv2_confusion_matrix.png](file:///c:/Users/SUBHASISH%20NATH/OneDrive/Desktop/AgriTwin/ml/evaluation/results/mobilenetv2_confusion_matrix.png)
- **Model Comparison Bar Chart**: [model_comparison_barchart.png](file:///c:/Users/SUBHASISH%20NATH/OneDrive/Desktop/AgriTwin/ml/evaluation/results/model_comparison_barchart.png)
- **Grad-CAM Saliency Map**: [gradcam_sample.png](file:///c:/Users/SUBHASISH%20NATH/OneDrive/Desktop/AgriTwin/ml/evaluation/results/gradcam_sample.png)
- **Environmental Risk Feature Importance**: [risk_model_feature_importance.png](file:///c:/Users/SUBHASISH%20NATH/OneDrive/Desktop/AgriTwin/ml/evaluation/results/risk_model_feature_importance.png)
