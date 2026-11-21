import os
import sys
import time
import json
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd

# Set GPU backend
workspace_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
os.environ["KERAS_BACKEND"] = "torch"
os.environ["KERAS_HOME"] = os.path.join(workspace_root, ".keras")
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

import torch
import keras

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from evaluation.confusion_matrix import plot_confusion_matrix
from evaluation.classification_report import generate_classification_report

BATCH_SIZE = 32

def load_test_dataset(target_size=(224, 224), test_dir="ml/dataset/processed/test"):
    test_ds = keras.utils.image_dataset_from_directory(
        test_dir,
        image_size=target_size,
        batch_size=BATCH_SIZE,
        label_mode="categorical",
        shuffle=False
    )
    return test_ds

def benchmark_inference(model, sample_batch, num_runs=50):
    """Measures average GPU inference latency in milliseconds per image."""
    _ = model.predict(sample_batch[:1], verbose=0)
    
    start_time = time.time()
    for _ in range(num_runs):
        _ = model.predict(sample_batch[:1], verbose=0)
    total_time = time.time() - start_time
    latency_ms = (total_time / num_runs) * 1000.0
    return round(latency_ms, 2)

def get_model_size_mb(filepath):
    if os.path.exists(filepath):
        return round(os.path.getsize(filepath) / (1024 * 1024), 2)
    return 0.0

def evaluate_both_models():
    print("="*60)
    print("STAGE 6: INDEPENDENT TEST EVALUATION & MODEL COMPARISON (RTX 3050 GPU)")
    print("="*60)
    print(f"CUDA Device: {torch.cuda.get_device_name(0)}")
    
    with open("ml/models/class_names.json", "r") as f:
        class_meta = json.load(f)
    display_names = class_meta["class_display_names"]
    
    models_to_evaluate = [
        {
            "name": "Custom CNN",
            "path": "ml/models/custom_cnn.keras",
            "cm_out": "ml/evaluation/results/custom_cnn_confusion_matrix.png",
            "report_out": "ml/evaluation/results/custom_cnn_classification_report.json"
        },
        {
            "name": "MobileNetV2",
            "path": "ml/models/mobilenetv2_best.keras",
            "cm_out": "ml/evaluation/results/mobilenetv2_confusion_matrix.png",
            "report_out": "ml/evaluation/results/mobilenetv2_classification_report.json"
        }
    ]
    
    results = {}
    
    for m_info in models_to_evaluate:
        m_name = m_info["name"]
        m_path = m_info["path"]
        
        if not os.path.exists(m_path):
            print(f"[WARNING] Model checkpoint {m_path} not found. Skipping {m_name}.")
            continue
            
        print(f"\nEvaluating {m_name} ({m_path}) on RTX 3050 GPU...")
        model = keras.models.load_model(m_path)
        
        # Auto-detect target resolution from model
        in_shape = model.input_shape
        target_size = (in_shape[1], in_shape[2]) if in_shape and in_shape[1] is not None else (224, 224)
        print(f"[INFO] Using input resolution: {target_size[0]}x{target_size[1]}")
        
        test_ds = load_test_dataset(target_size=target_size)
        
        # Extract ground truth labels
        y_true_batches = []
        sample_images = None
        for images, labels in test_ds:
            if sample_images is None:
                sample_images = images
            y_true_batches.append(np.array(labels))
        y_true_onehot = np.concatenate(y_true_batches, axis=0)
        y_true = np.argmax(y_true_onehot, axis=1)
        
        # Predictions
        y_prob = model.predict(test_ds, verbose=1)
        y_pred = np.argmax(y_prob, axis=1)
        
        # Confusion matrix
        cm = plot_confusion_matrix(
            y_true=y_true,
            y_pred=y_pred,
            class_names=display_names,
            output_path=m_info["cm_out"],
            title=f"Tomato Disease Confusion Matrix - {m_name}"
        )
        
        # Classification report
        summary, report_text = generate_classification_report(
            y_true=y_true,
            y_pred=y_pred,
            class_names=display_names,
            output_json=m_info["report_out"]
        )
        print(report_text)
        
        # Latency & Model Size
        latency = benchmark_inference(model, sample_images)
        size_mb = get_model_size_mb(m_path)
        
        summary["latency_ms_per_image"] = latency
        summary["model_size_mb"] = size_mb
        results[m_name] = summary
        
    # Export combined comparison
    comparison_file = "ml/evaluation/results/model_comparison.json"
    with open(comparison_file, "w") as f:
        json.dump(results, f, indent=2)
    print(f"\n[INFO] Comprehensive model comparison exported to {comparison_file}")
    
    # Generate Comparison Table Plot
    if len(results) == 2:
        metrics_names = ["Accuracy", "Macro Precision", "Macro Recall", "Macro F1-Score"]
        cnn_vals = [
            results["Custom CNN"]["accuracy"],
            results["Custom CNN"]["macro_precision"],
            results["Custom CNN"]["macro_recall"],
            results["Custom CNN"]["macro_f1"]
        ]
        mob_vals = [
            results["MobileNetV2"]["accuracy"],
            results["MobileNetV2"]["macro_precision"],
            results["MobileNetV2"]["macro_recall"],
            results["MobileNetV2"]["macro_f1"]
        ]
        
        x = np.arange(len(metrics_names))
        width = 0.35
        
        fig, ax = plt.subplots(figsize=(10, 6))
        rects1 = ax.bar(x - width/2, cnn_vals, width, label="Custom CNN", color="#5C6BC0")
        rects2 = ax.bar(x + width/2, mob_vals, width, label="MobileNetV2 (Transfer Learning)", color="#26A69A")
        
        ax.set_ylabel("Score", fontsize=12, fontweight="bold")
        ax.set_title("Model Comparison on Independent Test Set (1,589 images) - RTX 3050 GPU", fontsize=14, fontweight="bold")
        ax.set_xticks(x)
        ax.set_xticklabels(metrics_names, fontsize=11, fontweight="bold")
        ax.set_ylim(0, 1.1)
        ax.legend(fontsize=11)
        ax.grid(axis="y", linestyle="--", alpha=0.7)
        
        for rect in rects1:
            h = rect.get_height()
            ax.annotate(f"{h:.3f}", xy=(rect.get_x() + rect.get_width()/2, h),
                        xytext=(0, 3), textcoords="offset points", ha="center", va="bottom", fontsize=10)
        for rect in rects2:
            h = rect.get_height()
            ax.annotate(f"{h:.3f}", xy=(rect.get_x() + rect.get_width()/2, h),
                        xytext=(0, 3), textcoords="offset points", ha="center", va="bottom", fontsize=10)
            
        plt.tight_layout()
        plt.savefig("ml/evaluation/results/model_comparison_barchart.png", dpi=300)
        plt.close()
        print("[INFO] Model comparison bar chart saved to ml/evaluation/results/model_comparison_barchart.png")
        
    return results

if __name__ == "__main__":
    evaluate_both_models()
