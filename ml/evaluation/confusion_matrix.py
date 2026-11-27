import os
import json
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix

def plot_confusion_matrix(y_true, y_pred, class_names, output_path="ml/evaluation/results/confusion_matrix.png", title="Tomato Disease Confusion Matrix"):
    """
    Computes and plots a publication-quality confusion matrix heatmap.
    """
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    cm = confusion_matrix(y_true, y_pred)
    
    plt.figure(figsize=(13, 10))
    sns.heatmap(
        cm,
        annot=True,
        fmt="d",
        cmap="Greens",
        xticklabels=class_names,
        yticklabels=class_names,
        cbar=True,
        linewidths=0.5
    )
    plt.xlabel("Predicted Disease Class", fontsize=12, fontweight="bold", labelpad=10)
    plt.ylabel("Ground Truth Class", fontsize=12, fontweight="bold", labelpad=10)
    plt.title(title, fontsize=14, fontweight="bold", pad=15)
    plt.xticks(rotation=45, ha="right", fontsize=10)
    plt.yticks(rotation=0, fontsize=10)
    plt.tight_layout()
    plt.savefig(output_path, dpi=300)
    plt.close()
    print(f"[INFO] Confusion matrix heatmap saved to {output_path}")
    return cm
