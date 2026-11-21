import os
import sys

# Configure GPU backend
workspace_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
os.environ["KERAS_BACKEND"] = "torch"
os.environ["KERAS_HOME"] = os.path.join(workspace_root, ".keras")
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

import torch
import keras
from keras import layers, models
from keras.applications import MobileNetV2
from keras.applications.mobilenet_v2 import preprocess_input
import matplotlib.pyplot as plt
import pandas as pd

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from training.callbacks import get_callbacks

# -------------------------------------------------------------
# UPGRADED HIGH-ACCURACY HYPERPARAMETERS
# -------------------------------------------------------------
IMG_SIZE = (256, 256)           # Native Kaggle resolution (preserves spot lesion detail)
BATCH_SIZE = 32
NUM_CLASSES = 10
PHASE_A_EPOCHS = 6              # Warmup classification head
PHASE_B_EPOCHS = 18             # Extended deep fine-tuning for convergence
FINE_TUNE_LAYERS = 85           # Unfreeze top 85 layers (was 40)
LABEL_SMOOTHING = 0.1           # Prevents overconfidence on ambiguous spot diseases

def build_augmented_mobilenetv2(num_classes=10):
    """
    Constructs high-accuracy MobileNetV2 architecture with:
    - Native 256x256 resolution
    - Domain-specific agricultural data augmentation
    - Pretrained ImageNet feature extraction
    - Batch normalization & regularized dropout
    """
    inputs = layers.Input(shape=(IMG_SIZE[0], IMG_SIZE[1], 3), name="input_image")
    
    # 1. Agricultural Data Augmentation Pipeline
    x = layers.RandomFlip("horizontal_and_vertical")(inputs)
    x = layers.RandomRotation(0.2)(x)
    x = layers.RandomZoom(0.12)(x)
    
    # 2. Backbone Preprocessing (scales [0, 255] to [-1, 1])
    x = preprocess_input(x)
    
    # 3. Pretrained Backbone
    base_model = MobileNetV2(
        weights="imagenet",
        include_top=False,
        input_shape=(IMG_SIZE[0], IMG_SIZE[1], 3)
    )
    base_model.trainable = False
    
    x = base_model(x, training=False)
    
    # 4. Classification Head
    x = layers.GlobalAveragePooling2D(name="gap")(x)
    x = layers.BatchNormalization(name="head_bn")(x)
    x = layers.Dropout(0.35, name="head_dropout")(x)
    outputs = layers.Dense(num_classes, activation="softmax", name="predictions")(x)
    
    model = models.Model(inputs=inputs, outputs=outputs, name="AgriTwin_MobileNetV2_HighAcc")
    return model, base_model

def load_datasets(dataset_base="ml/dataset/processed"):
    train_dir = os.path.join(dataset_base, "train")
    val_dir = os.path.join(dataset_base, "validation")
    test_dir = os.path.join(dataset_base, "test")
    
    train_ds = keras.utils.image_dataset_from_directory(
        train_dir,
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        label_mode="categorical",
        shuffle=True,
        seed=42
    )
    
    val_ds = keras.utils.image_dataset_from_directory(
        val_dir,
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        label_mode="categorical",
        shuffle=False
    )
    
    test_ds = keras.utils.image_dataset_from_directory(
        test_dir,
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        label_mode="categorical",
        shuffle=False
    )
    
    return train_ds, val_ds, test_ds

def plot_and_save_history(history_csv, output_img="ml/evaluation/results/mobilenetv2_curves.png"):
    os.makedirs(os.path.dirname(output_img), exist_ok=True)
    if not os.path.exists(history_csv):
        return
    df = pd.read_csv(history_csv)
    
    fig, axes = plt.subplots(1, 2, figsize=(14, 5))
    
    axes[0].plot(df["epoch"], df["accuracy"], label="Training Accuracy", color="#2E7D32", marker="o")
    axes[0].plot(df["epoch"], df["val_accuracy"], label="Validation Accuracy", color="#1565C0", marker="s")
    axes[0].set_title("MobileNetV2 Accuracy Curve (RTX 3050 GPU)", fontsize=13, fontweight="bold")
    axes[0].set_xlabel("Epoch")
    axes[0].set_ylabel("Accuracy")
    axes[0].grid(True, linestyle="--", alpha=0.6)
    axes[0].legend()
    
    axes[1].plot(df["epoch"], df["loss"], label="Training Loss", color="#C62828", marker="o")
    axes[1].plot(df["epoch"], df["val_loss"], label="Validation Loss", color="#E65100", marker="s")
    axes[1].set_title("MobileNetV2 Loss Curve (RTX 3050 GPU)", fontsize=13, fontweight="bold")
    axes[1].set_xlabel("Epoch")
    axes[1].set_ylabel("Loss")
    axes[1].grid(True, linestyle="--", alpha=0.6)
    axes[1].legend()
    
    plt.tight_layout()
    plt.savefig(output_img, dpi=300)
    plt.close()
    print(f"[INFO] Saved updated curves to {output_img}")

def train():
    print("="*65)
    print("UPGRADED HIGH-ACCURACY MOBILENETV2 TRAINING (NVIDIA RTX 3050 GPU)")
    print("="*65)
    print(f"CUDA Device: {torch.cuda.get_device_name(0)}")
    print(f"Native Resolution: {IMG_SIZE[0]}x{IMG_SIZE[1]} | Label Smoothing: {LABEL_SMOOTHING}")
    
    train_ds, val_ds, test_ds = load_datasets()
    model, base_model = build_augmented_mobilenetv2(num_classes=NUM_CLASSES)
    
    # ----------------------------------------------------
    # PHASE A: HEAD WARMUP (FROZEN BACKBONE)
    # ----------------------------------------------------
    print("\n--- PHASE A: CLASSIFICATION HEAD WARMUP ---")
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=0.001),
        loss=keras.losses.CategoricalCrossentropy(label_smoothing=LABEL_SMOOTHING),
        metrics=["accuracy"]
    )
    model.summary()
    
    callbacks_a = get_callbacks(
        model_name="mobilenetv2_phase_a",
        checkpoint_dir="ml/models",
        log_dir="ml/training/logs"
    )
    
    model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=PHASE_A_EPOCHS,
        callbacks=callbacks_a
    )
    
    # ----------------------------------------------------
    # PHASE B: DEEP FINE-TUNING (UNFREEZE TOP 85 LAYERS)
    # ----------------------------------------------------
    print(f"\n--- PHASE B: DEEP FINE-TUNING (Unfreezing Top {FINE_TUNE_LAYERS} Layers) ---")
    base_model.trainable = True
    fine_tune_at = len(base_model.layers) - FINE_TUNE_LAYERS
    for layer in base_model.layers[:fine_tune_at]:
        layer.trainable = False
        
    print(f"[INFO] Total layers: {len(base_model.layers)}, Trainable fine-tuning layers: {len(base_model.layers) - fine_tune_at}")
    
    # Cosine decay schedule for gentle convergence without destructive weight shock
    total_fine_tune_steps = PHASE_B_EPOCHS * 232
    lr_schedule = keras.optimizers.schedules.CosineDecay(
        initial_learning_rate=3e-5,
        decay_steps=total_fine_tune_steps,
        alpha=1e-6
    )
    
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=lr_schedule),
        loss=keras.losses.CategoricalCrossentropy(label_smoothing=LABEL_SMOOTHING),
        metrics=["accuracy"]
    )
    
    callbacks_b = get_callbacks(
        model_name="mobilenetv2_best",
        checkpoint_dir="ml/models",
        log_dir="ml/training/logs"
    )
    
    model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=PHASE_B_EPOCHS,
        callbacks=callbacks_b
    )
    
    # Plot final curves
    plot_and_save_history(
        history_csv="ml/training/logs/mobilenetv2_best_history.csv",
        output_img="ml/evaluation/results/mobilenetv2_curves.png"
    )
    
    # Evaluate best model on test set
    print("\n[INFO] Evaluating best checkpoint on independent test set...")
    best_model = keras.models.load_model("ml/models/mobilenetv2_best.keras")
    eval_res = best_model.evaluate(test_ds, verbose=1)
    test_loss, test_acc = eval_res[0], eval_res[1]
    print(f"\n[FINAL RESULT] MobileNetV2 Test Loss: {test_loss:.4f} | Test Accuracy: {test_acc:.4f}")
    
    return best_model

if __name__ == "__main__":
    train()
