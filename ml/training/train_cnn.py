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
import matplotlib.pyplot as plt
import pandas as pd

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from training.callbacks import get_callbacks

IMG_SIZE = (224, 224)
BATCH_SIZE = 32
NUM_CLASSES = 10
EPOCHS = 10

def build_custom_cnn(num_classes=10):
    """
    Builds the baseline Custom Convolutional Neural Network (CNN)
    per AgriTwin ML Architecture specification.
    """
    inputs = layers.Input(shape=(224, 224, 3), name="input_image")
    
    # Preprocessing
    x = layers.Rescaling(1.0 / 255.0, name="rescaling")(inputs)
    
    # Block 1
    x = layers.Conv2D(32, (3, 3), activation="relu", padding="same", name="conv1")(x)
    x = layers.MaxPooling2D((2, 2), name="pool1")(x)
    
    # Block 2
    x = layers.Conv2D(64, (3, 3), activation="relu", padding="same", name="conv2")(x)
    x = layers.MaxPooling2D((2, 2), name="pool2")(x)
    
    # Block 3
    x = layers.Conv2D(128, (3, 3), activation="relu", padding="same", name="conv3")(x)
    x = layers.MaxPooling2D((2, 2), name="pool3")(x)
    
    # Block 4
    x = layers.Conv2D(256, (3, 3), activation="relu", padding="same", name="conv4")(x)
    x = layers.MaxPooling2D((2, 2), name="pool4")(x)
    
    # Classification Head
    x = layers.GlobalAveragePooling2D(name="gap")(x)
    x = layers.Dropout(0.4, name="dropout_1")(x)
    x = layers.Dense(128, activation="relu", name="dense_features")(x)
    x = layers.Dropout(0.3, name="dropout_2")(x)
    outputs = layers.Dense(num_classes, activation="softmax", name="predictions")(x)
    
    model = models.Model(inputs=inputs, outputs=outputs, name="AgriTwin_Custom_CNN")
    
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=0.001),
        loss="categorical_crossentropy",
        metrics=["accuracy"]
    )
    return model

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

def plot_and_save_history(history_csv, output_img="ml/evaluation/results/custom_cnn_curves.png"):
    os.makedirs(os.path.dirname(output_img), exist_ok=True)
    if not os.path.exists(history_csv):
        return
    df = pd.read_csv(history_csv)
    
    fig, axes = plt.subplots(1, 2, figsize=(14, 5))
    
    # Accuracy
    axes[0].plot(df["epoch"], df["accuracy"], label="Training Accuracy", color="#2E7D32", marker="o")
    axes[0].plot(df["epoch"], df["val_accuracy"], label="Validation Accuracy", color="#1565C0", marker="s")
    axes[0].set_title("Custom CNN Accuracy Curve (NVIDIA RTX 3050 GPU)", fontsize=13, fontweight="bold")
    axes[0].set_xlabel("Epoch")
    axes[0].set_ylabel("Accuracy")
    axes[0].grid(True, linestyle="--", alpha=0.6)
    axes[0].legend()
    
    # Loss
    axes[1].plot(df["epoch"], df["loss"], label="Training Loss", color="#C62828", marker="o")
    axes[1].plot(df["epoch"], df["val_loss"], label="Validation Loss", color="#E65100", marker="s")
    axes[1].set_title("Custom CNN Loss Curve (NVIDIA RTX 3050 GPU)", fontsize=13, fontweight="bold")
    axes[1].set_xlabel("Epoch")
    axes[1].set_ylabel("Loss")
    axes[1].grid(True, linestyle="--", alpha=0.6)
    axes[1].legend()
    
    plt.tight_layout()
    plt.savefig(output_img, dpi=300)
    plt.close()
    print(f"[INFO] Saved training curves to {output_img}")

def train():
    print("="*60)
    print("STAGE 3: CUSTOM CNN BASELINE TRAINING (NVIDIA RTX 3050 GPU)")
    print("="*60)
    print(f"CUDA Device: {torch.cuda.get_device_name(0)}")
    
    train_ds, val_ds, test_ds = load_datasets()
    model = build_custom_cnn(num_classes=NUM_CLASSES)
    model.summary()
    
    callbacks = get_callbacks(model_name="custom_cnn", checkpoint_dir="ml/models", log_dir="ml/training/logs")
    
    print("\n[INFO] Starting GPU training...")
    history = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=EPOCHS,
        callbacks=callbacks
    )
    
    # Plot curves
    plot_and_save_history(
        history_csv="ml/training/logs/custom_cnn_history.csv",
        output_img="ml/evaluation/results/custom_cnn_curves.png"
    )
    
    # Test set evaluation
    print("\n[INFO] Evaluating Custom CNN on independent test set...")
    best_model = keras.models.load_model("ml/models/custom_cnn.keras")
    eval_res = best_model.evaluate(test_ds, verbose=1)
    test_loss, test_acc = eval_res[0], eval_res[1]
    print(f"[RESULT] Custom CNN Test Loss: {test_loss:.4f} | Test Accuracy: {test_acc:.4f}")
    
    return best_model

if __name__ == "__main__":
    train()
