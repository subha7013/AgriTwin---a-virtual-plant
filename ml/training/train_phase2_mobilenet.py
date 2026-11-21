import os
import sys
import json
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

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
from sklearn.utils.class_weight import compute_class_weight

# ---------------------------------------------------------------------
# PHASE 2 RIGOROUS SPECIFICATION CONSTANTS
# ---------------------------------------------------------------------
IMG_SIZE = (128, 128)               # 128x128x3 as specified
BATCH_SIZE = 32
NUM_CLASSES = 10
SEED = 42
STAGE_1_EPOCHS = 5                  # Frozen head warmup
STAGE_2_EPOCHS = 8                  # Fine-tuning last ~50 layers
FINE_TUNE_LAYERS = 50

DATASET_TRAIN = "ml/dataset/clean_split/train"
DATASET_VAL = "ml/dataset/clean_split/val"
MODEL_OUTPUT_PATH = "ml/models/model.keras"
LOGS_DIR = "ml/training/logs"

def build_phase2_model(num_classes=10):
    """
    Builds MobileNetV2 transfer learning model adhering strictly to Phase 2:
    - Input: 128x128x3
    - Data Augmentation: Horizontal flip, small rotation (0.1), zoom (0.1), contrast/brightness
    - Preprocessing: Explicit layers.Rescaling(1/127.5, offset=-1) (Keras 3 requirement)
    - Backbone: MobileNetV2(weights='imagenet', include_top=False)
    - Classification Head: GlobalAveragePooling2D, Dropout(0.3), Dense(num_classes, softmax)
    """
    inputs = layers.Input(shape=(IMG_SIZE[0], IMG_SIZE[1], 3), name="input_image")
    
    # 1. On-the-fly Data Augmentation
    x = layers.RandomFlip("horizontal")(inputs)
    x = layers.RandomRotation(0.1)(x)
    x = layers.RandomZoom(0.1)(x)
    x = layers.RandomBrightness(0.1)(x)
    
    # 2. Explicit Preprocessing [0, 255] -> [-1, 1]
    # Critical detail: Keras 3 MobileNetV2 requires explicit Rescaling(1/127.5, offset=-1)
    x = layers.Rescaling(scale=1.0 / 127.5, offset=-1.0, name="mobilenetv2_rescaling")(x)
    
    # 3. MobileNetV2 Backbone
    base_model = MobileNetV2(
        weights="imagenet",
        include_top=False,
        input_shape=(IMG_SIZE[0], IMG_SIZE[1], 3)
    )
    base_model.trainable = False
    
    x = base_model(x, training=False)
    
    # 4. Classification Head with Dropout 0.3
    x = layers.GlobalAveragePooling2D(name="gap")(x)
    x = layers.Dropout(0.3, name="head_dropout")(x)
    outputs = layers.Dense(num_classes, activation="softmax", name="predictions")(x)
    
    model = models.Model(inputs=inputs, outputs=outputs, name="AgriTwin_Phase2_MobileNetV2")
    return model, base_model

def get_class_weights(train_ds):
    """
    Computes class weights to handle underrepresented classes (e.g. Tomato Mosaic Virus).
    """
    y_train = []
    for _, labels in train_ds:
        # labels can be one-hot or int
        if len(labels.shape) > 1 and labels.shape[-1] > 1:
            y_train.extend(np.argmax(labels.numpy(), axis=-1))
        else:
            y_train.extend(labels.numpy().astype(int))
    y_train = np.array(y_train)
    
    unique_classes = np.unique(y_train)
    weights = compute_class_weight(
        class_weight="balanced",
        classes=unique_classes,
        y=y_train
    )
    class_weight_dict = {cls: float(w) for cls, w in zip(unique_classes, weights)}
    print(f"\n[INFO] Computed balanced class weights:")
    for cls_idx, w in class_weight_dict.items():
        print(f"  Class {cls_idx}: {w:.4f}")
    return class_weight_dict

def train_phase2():
    print("=" * 70)
    print("PHASE 2: RIGOROUS MOBILENETV2 TRAINING (LEAKAGE-FREE DATASET)")
    print("=" * 70)
    if torch.cuda.is_available():
        print(f"CUDA Device: {torch.cuda.get_device_name(0)}")
    else:
        print("Device: CPU")
        
    os.makedirs(LOGS_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(MODEL_OUTPUT_PATH), exist_ok=True)
    
    # 1. Load datasets
    print(f"\n[1/5] Loading Clean Split Datasets from {DATASET_TRAIN}...")
    train_ds = keras.utils.image_dataset_from_directory(
        DATASET_TRAIN,
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        label_mode="categorical",
        shuffle=True,
        seed=SEED
    )
    
    val_ds = keras.utils.image_dataset_from_directory(
        DATASET_VAL,
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        label_mode="categorical",
        shuffle=False
    )
    
    class_names = train_ds.class_names
    print(f"[INFO] Loaded {len(class_names)} classes: {class_names}")
    
    # Compute class weights
    class_weight_dict = get_class_weights(train_ds)
    
    # 2. Build Model
    print(f"\n[2/5] Building Phase 2 MobileNetV2 (Input: {IMG_SIZE[0]}x{IMG_SIZE[1]}x3)...")
    model, base_model = build_phase2_model(num_classes=NUM_CLASSES)
    model.summary()
    
    # 3. Stage 1: Head Warmup (5 epochs, Adam lr=1e-3, base frozen)
    print("\n" + "=" * 50)
    print(f"STAGE 1: BASE FROZEN, TRAIN HEAD ({STAGE_1_EPOCHS} Epochs, Adam 1e-3)")
    print("=" * 50)
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=1e-3),
        loss="categorical_crossentropy",
        metrics=["accuracy"]
    )
    
    history_stage1 = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=STAGE_1_EPOCHS,
        class_weight=class_weight_dict,
        verbose=1
    )
    
    # 4. Stage 2: Fine-tuning last ~50 layers (8 epochs, Adam lr=1e-4)
    # Critical rule: Keep all BatchNormalization layers FROZEN!
    print("\n" + "=" * 50)
    print(f"STAGE 2: FINE-TUNE LAST ~{FINE_TUNE_LAYERS} LAYERS ({STAGE_2_EPOCHS} Epochs, Adam 1e-4)")
    print("=" * 50)
    base_model.trainable = True
    fine_tune_start = len(base_model.layers) - FINE_TUNE_LAYERS
    
    frozen_bn_count = 0
    trainable_count = 0
    for idx, layer in enumerate(base_model.layers):
        if idx < fine_tune_start:
            layer.trainable = False
        else:
            if isinstance(layer, layers.BatchNormalization):
                # BatchNorm FROZEN during fine-tuning as strictly required!
                layer.trainable = False
                frozen_bn_count += 1
            else:
                layer.trainable = True
                trainable_count += 1
                
    print(f"[INFO] Total backbone layers: {len(base_model.layers)}")
    print(f"[INFO] Fine-tuning trainable layers: {trainable_count} | Frozen BatchNorm in fine-tuning region: {frozen_bn_count}")
    
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=1e-4),
        loss="categorical_crossentropy",
        metrics=["accuracy"]
    )
    
    # Callbacks
    checkpoint_cb = keras.callbacks.ModelCheckpoint(
        filepath=MODEL_OUTPUT_PATH,
        monitor="val_accuracy",
        mode="max",
        save_best_only=True,
        verbose=1
    )
    early_stopping_cb = keras.callbacks.EarlyStopping(
        monitor="val_accuracy",
        patience=4,
        restore_best_weights=True,
        verbose=1
    )
    reduce_lr_cb = keras.callbacks.ReduceLROnPlateau(
        monitor="val_loss",
        factor=0.5,
        patience=2,
        min_lr=1e-6,
        verbose=1
    )
    csv_logger_cb = keras.callbacks.CSVLogger(
        os.path.join(LOGS_DIR, "phase2_training_history.csv")
    )
    
    history_stage2 = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=STAGE_2_EPOCHS,
        callbacks=[checkpoint_cb, early_stopping_cb, reduce_lr_cb, csv_logger_cb],
        class_weight=class_weight_dict,
        verbose=1
    )
    
    # 5. Combine and Plot Training Curves
    print("\n[5/5] Generating Phase 2 Training Curves...")
    hist1 = history_stage1.history
    hist2 = history_stage2.history
    
    comb_acc = hist1["accuracy"] + hist2["accuracy"]
    comb_val_acc = hist1["val_accuracy"] + hist2["val_accuracy"]
    comb_loss = hist1["loss"] + hist2["loss"]
    comb_val_loss = hist1["val_loss"] + hist2["val_loss"]
    epochs = range(1, len(comb_acc) + 1)
    
    fig, axes = plt.subplots(1, 2, figsize=(14, 5))
    
    # Accuracy
    axes[0].plot(epochs, comb_acc, label="Train Accuracy", color="#2E7D32", marker="o")
    axes[0].plot(epochs, comb_val_acc, label="Val Accuracy", color="#1565C0", marker="s")
    axes[0].axvline(x=STAGE_1_EPOCHS, color="gray", linestyle="--", label="Fine-tuning start")
    axes[0].set_title("Phase 2 MobileNetV2 Accuracy (Leak-Free)", fontsize=13, fontweight="bold")
    axes[0].set_xlabel("Epoch")
    axes[0].set_ylabel("Accuracy")
    axes[0].grid(True, linestyle="--", alpha=0.6)
    axes[0].legend()
    
    # Loss
    axes[1].plot(epochs, comb_loss, label="Train Loss", color="#C62828", marker="o")
    axes[1].plot(epochs, comb_val_loss, label="Val Loss", color="#E65100", marker="s")
    axes[1].axvline(x=STAGE_1_EPOCHS, color="gray", linestyle="--", label="Fine-tuning start")
    axes[1].set_title("Phase 2 MobileNetV2 Loss (Leak-Free)", fontsize=13, fontweight="bold")
    axes[1].set_xlabel("Epoch")
    axes[1].set_ylabel("Loss")
    axes[1].grid(True, linestyle="--", alpha=0.6)
    axes[1].legend()
    
    plt.tight_layout()
    curves_path = "ml/evaluation/results/training_curves.png"
    os.makedirs(os.path.dirname(curves_path), exist_ok=True)
    plt.savefig(curves_path, dpi=300)
    plt.close()
    print(f"[INFO] Saved training curves to {curves_path}")
    print(f"[INFO] Saved best model checkpoint to {MODEL_OUTPUT_PATH}")

if __name__ == "__main__":
    train_phase2()
