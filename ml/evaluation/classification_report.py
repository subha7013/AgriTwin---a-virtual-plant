import os
import json
import numpy as np
from sklearn.metrics import classification_report, accuracy_score, precision_recall_fscore_support

def generate_classification_report(y_true, y_pred, class_names, output_json="ml/evaluation/results/classification_report.json"):
    """
    Computes class-wise precision, recall, f1-score, and support.
    Exports structured dictionary and prints formatted report.
    """
    os.makedirs(os.path.dirname(output_json), exist_ok=True)
    
    report_dict = classification_report(
        y_true,
        y_pred,
        target_names=class_names,
        digits=4,
        output_dict=True
    )
    
    report_text = classification_report(
        y_true,
        y_pred,
        target_names=class_names,
        digits=4
    )
    
    acc = accuracy_score(y_true, y_pred)
    macro_p, macro_r, macro_f1, _ = precision_recall_fscore_support(y_true, y_pred, average="macro")
    weighted_p, weighted_r, weighted_f1, _ = precision_recall_fscore_support(y_true, y_pred, average="weighted")
    
    summary = {
        "accuracy": float(acc),
        "macro_precision": float(macro_p),
        "macro_recall": float(macro_r),
        "macro_f1": float(macro_f1),
        "weighted_precision": float(weighted_p),
        "weighted_recall": float(weighted_r),
        "weighted_f1": float(weighted_f1),
        "class_wise": {
            cls: {
                "precision": report_dict[cls]["precision"],
                "recall": report_dict[cls]["recall"],
                "f1_score": report_dict[cls]["f1-score"],
                "support": int(report_dict[cls]["support"])
            }
            for cls in class_names
        }
    }
    
    with open(output_json, "w") as f:
        json.dump(summary, f, indent=2)
        
    print(f"\n[INFO] Classification Report Summary:")
    print(f"Accuracy: {acc:.4f} | Macro Precision: {macro_p:.4f} | Macro Recall: {macro_r:.4f} | Macro F1: {macro_f1:.4f}")
    print(f"[INFO] Detailed JSON report saved to {output_json}")
    
    return summary, report_text
