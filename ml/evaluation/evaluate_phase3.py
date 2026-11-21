import os
import sys
import json
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.metrics import classification_report, confusion_matrix, f1_score, accuracy_score

workspace_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
os.environ["KERAS_BACKEND"] = "torch"
os.environ["KERAS_HOME"] = os.path.join(workspace_root, ".keras")
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

import keras

MODEL_PATH = "ml/models/model.keras"
VAL_DIR = "ml/dataset/clean_split/val"
LABELS_JSON = "ml/models/labels.json"
METRICS_JSON = "ml/models/metrics.json"
CONFUSION_CSV = "ml/evaluation/results/confusion_matrix.csv"
CONFUSION_PNG = "ml/evaluation/results/confusion_matrix.png"
IMG_SIZE = (128, 128)
BATCH_SIZE = 32

def evaluate_and_generate_artifacts():
    print("=" * 65)
    print("PHASE 3: RIGOROUS EVALUATION & ARTIFACT GENERATION")
    print("=" * 65)
    
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model file not found at {MODEL_PATH}. Train the model first.")
        
    print(f"\n[1/5] Loading trained model from {MODEL_PATH}...")
    model = keras.models.load_model(MODEL_PATH)
    
    print(f"\n[2/5] Loading clean, leakage-free validation set from {VAL_DIR}...")
    val_ds = keras.utils.image_dataset_from_directory(
        VAL_DIR,
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        label_mode="categorical",
        shuffle=False
    )
    class_names = val_ds.class_names
    
    # 1. Generate labels.json
    print(f"\n[3/5] Generating {LABELS_JSON}...")
    labels_metadata = {
        "model_version": "2.0.0-phase3-leak-free",
        "backbone": "MobileNetV2 (ImageNet weights)",
        "img_size": [IMG_SIZE[0], IMG_SIZE[1], 3],
        "preprocessing": {
            "scale": "1/127.5",
            "offset": "-1.0",
            "formula": "(pixel / 127.5) - 1.0",
            "range": "[-1.0, 1.0]"
        },
        "num_classes": len(class_names),
        "classes": class_names
    }
    with open(LABELS_JSON, "w") as f:
        json.dump(labels_metadata, f, indent=2)
    print(f">> Saved labels metadata to {LABELS_JSON}")
    
    # 2. Run Inference on Validation Dataset
    print(f"\n[4/5] Running inference over {len(val_ds)} batches...")
    y_true_all = []
    y_pred_probs_all = []
    
    for batch_images, batch_labels in val_ds:
        probs = model.predict(batch_images, verbose=0)
        y_pred_probs_all.append(probs)
        y_true_all.append(batch_labels.numpy())
        
    y_true_cat = np.concatenate(y_true_all, axis=0)
    y_pred_probs = np.concatenate(y_pred_probs_all, axis=0)
    
    y_true = np.argmax(y_true_cat, axis=-1)
    y_pred = np.argmax(y_pred_probs, axis=-1)
    
    # 3. Calculate Metrics
    acc = float(accuracy_score(y_true, y_pred))
    macro_f1 = float(f1_score(y_true, y_pred, average="macro"))
    weighted_f1 = float(f1_score(y_true, y_pred, average="weighted"))
    
    report_dict = classification_report(
        y_true,
        y_pred,
        target_names=class_names,
        output_dict=True,
        digits=4
    )
    
    # Identify weakest class
    per_class_f1 = {cls: report_dict[cls]["f1-score"] for cls in class_names}
    weakest_class = min(per_class_f1, key=per_class_f1.get)
    strongest_class = max(per_class_f1, key=per_class_f1.get)
    
    metrics_data = {
        "val_accuracy": round(acc, 4),
        "macro_f1": round(macro_f1, 4),
        "weighted_f1": round(weighted_f1, 4),
        "weakest_class": {
            "name": weakest_class,
            "f1_score": round(per_class_f1[weakest_class], 4),
            "precision": round(report_dict[weakest_class]["precision"], 4),
            "recall": round(report_dict[weakest_class]["recall"], 4)
        },
        "strongest_class": {
            "name": strongest_class,
            "f1_score": round(per_class_f1[strongest_class], 4)
        },
        "per_class_metrics": {
            cls: {
                "precision": round(report_dict[cls]["precision"], 4),
                "recall": round(report_dict[cls]["recall"], 4),
                "f1_score": round(report_dict[cls]["f1-score"], 4),
                "support": int(report_dict[cls]["support"])
            }
            for cls in class_names
        }
    }
    
    with open(METRICS_JSON, "w") as f:
        json.dump(metrics_data, f, indent=2)
    print(f">> Saved evaluation metrics to {METRICS_JSON}")
    
    # 4. Generate Confusion Matrix (CSV + PNG)
    print(f"\n[5/5] Generating Confusion Matrix...")
    cm = confusion_matrix(y_true, y_pred)
    cm_df = pd.DataFrame(cm, index=class_names, columns=class_names)
    cm_df.to_csv(CONFUSION_CSV)
    print(f">> Saved confusion matrix CSV to {CONFUSION_CSV}")
    
    fig, ax = plt.subplots(figsize=(11, 9))
    im = ax.imshow(cm, interpolation='nearest', cmap=plt.cm.Greens)
    ax.figure.colorbar(im, ax=ax)
    
    clean_labels = [c.replace("Tomato___", "").replace("_", " ") for c in class_names]
    ax.set(
        xticks=np.arange(cm.shape[1]),
        yticks=np.arange(cm.shape[0]),
        xticklabels=clean_labels,
        yticklabels=clean_labels,
        title=f"AgriTwin MobileNetV2 Confusion Matrix (Val Acc: {acc*100:.1f}%)",
        ylabel="True Label",
        xlabel="Predicted Label"
    )
    plt.setp(ax.get_xticklabels(), rotation=45, ha="right", rotation_mode="anchor")
    
    # Text annotations
    thresh = cm.max() / 2.0
    for i in range(cm.shape[0]):
        for j in range(cm.shape[1]):
            ax.text(
                j, i, format(cm[i, j], 'd'),
                ha="center", va="center",
                color="white" if cm[i, j] > thresh else "black",
                fontsize=9, fontweight="bold"
            )
            
    fig.tight_layout()
    plt.savefig(CONFUSION_PNG, dpi=300)
    plt.close()
    print(f">> Saved confusion matrix PNG to {CONFUSION_PNG}")
    
    # Summary Output
    print("\n" + "=" * 65)
    print(f"HONEST VALIDATION RESULTS (Zero Data Leakage):")
    print(f"Validation Accuracy: {acc*100:.2f}%  (Expected: ~93-96%)")
    print(f"Macro F1-Score:      {macro_f1:.4f}  (Expected: ~0.94-0.96)")
    print(f"Weighted F1-Score:   {weighted_f1:.4f}")
    print(f"Weakest Class:       {weakest_class} (F1: {per_class_f1[weakest_class]:.4f})")
    print(f"Strongest Class:     {strongest_class} (F1: {per_class_f1[strongest_class]:.4f})")
    print("=" * 65)
    
    return metrics_data

if __name__ == "__main__":
    evaluate_and_generate_artifacts()
