import os
import nbformat as nbf

def create_notebook(filename, title, cells_content):
    nb = nbf.v4.new_notebook()
    nb.metadata = {
        "kernelspec": {
            "display_name": "Python 3",
            "language": "python",
            "name": "python3"
        },
        "language_info": {
            "name": "python",
            "version": "3.13"
        }
    }
    
    nb_cells = [nbf.v4.new_markdown_cell(f"# AgriTwin ML Pipeline: {title}")]
    
    for ctype, content in cells_content:
        if ctype == "markdown":
            nb_cells.append(nbf.v4.new_markdown_cell(content))
        elif ctype == "code":
            nb_cells.append(nbf.v4.new_code_cell(content))
            
    nb.cells = nb_cells
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with open(filename, "w", encoding="utf-8") as f:
        nbf.write(nb, f)
    print(f"[INFO] Generated notebook: {filename}")

def build_all_notebooks():
    out_dir = "ml/notebooks"
    
    # 01_dataset_inspection.ipynb
    create_notebook(
        os.path.join(out_dir, "01_dataset_inspection.ipynb"),
        "01 - Dataset Acquisition and Inspection",
        [
            ("markdown", "## 1. Dataset Overview\nDataset: Tomato Leaf Disease Dataset (10 Classes)\nSource: Kaggle (kaustubhb999/tomatoleaf)\nObjective: Inspect raw files, verify directory integrity, check image formats, color modes, and detect corruptions."),
            ("code", """import os
from PIL import Image
from pathlib import Path

DATASET_PATH = Path("../dataset/raw")

class_counts = {}
resolutions = set()
formats = set()
modes = set()
corrupted_files = []

for class_dir in sorted(DATASET_PATH.iterdir()):
    if not class_dir.is_dir():
        continue
    img_files = [f for f in class_dir.iterdir() if f.suffix.lower() in [".jpg", ".jpeg", ".png"]]
    class_counts[class_dir.name] = len(img_files)
    
    for img_path in img_files:
        try:
            with Image.open(img_path) as img:
                resolutions.add(img.size)
                formats.add(img.format)
                modes.add(img.mode)
        except Exception as e:
            corrupted_files.append((str(img_path), str(e)))

print(f"Total Disease Classes: {len(class_counts)}")
print(f"Total Images: {sum(class_counts.values())}")
print(f"Corrupted Files Detected: {len(corrupted_files)}")
print(f"Image Resolutions: {resolutions}")
print(f"Image Formats: {formats}")
print(f"Color Modes: {modes}")"""),
            ("markdown", "### Class Counts Breakdown"),
            ("code", """for cname, count in class_counts.items():
    print(f"{cname:<45} : {count} images")""")
        ]
    )

    # 02_eda.ipynb
    create_notebook(
        os.path.join(out_dir, "02_eda.ipynb"),
        "02 - Exploratory Data Analysis (EDA)",
        [
            ("markdown", "## 1. Class Distribution Analysis\nVisualize distribution of tomato leaf conditions and assess class balance."),
            ("code", """import os
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path
from PIL import Image

DATASET_PATH = Path("../dataset/raw")
class_dirs = sorted([d for d in DATASET_PATH.iterdir() if d.is_dir()])

names = [d.name.replace("Tomato___", "").replace("_", " ") for d in class_dirs]
counts = [len(list(d.glob("*.*"))) for d in class_dirs]

plt.figure(figsize=(14, 6))
sns.barplot(x=counts, y=names, palette="viridis")
plt.title("Tomato Leaf Disease Class Distribution", fontsize=14, fontweight="bold")
plt.xlabel("Number of Samples", fontsize=12)
plt.ylabel("Disease Category", fontsize=12)
plt.grid(axis="x", linestyle="--", alpha=0.7)
plt.tight_layout()
plt.show()"""),
            ("markdown", "## 2. Sample Image Grid Across All 10 Disease Classes"),
            ("code", """fig, axes = plt.subplots(2, 5, figsize=(18, 8))
axes = axes.ravel()

for idx, d in enumerate(class_dirs):
    sample_file = next(d.glob("*.*"))
    img = Image.open(sample_file)
    axes[idx].imshow(img)
    display_name = d.name.replace("Tomato___", "").replace("_", " ")
    axes[idx].set_title(display_name, fontsize=10, fontweight="bold")
    axes[idx].axis("off")

plt.suptitle("Representative Tomato Leaf Samples per Class", fontsize=16, fontweight="bold")
plt.tight_layout()
plt.show()""")
        ]
    )

    # 03_preprocessing.ipynb
    create_notebook(
        os.path.join(out_dir, "03_preprocessing.ipynb"),
        "03 - Data Preprocessing & Augmentation Pipeline",
        [
            ("markdown", "## 1. Stratified Splitting\n70% Training | 15% Validation | 15% Independent Test Set\nAvoid data leakage by isolating test samples prior to training."),
            ("code", """import os
import tensorflow as tf
from tensorflow.keras import layers

IMG_SIZE = (224, 224)
BATCH_SIZE = 32

train_ds = tf.keras.utils.image_dataset_from_directory(
    "../dataset/processed/train",
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    label_mode="categorical",
    shuffle=True,
    seed=42
)

val_ds = tf.keras.utils.image_dataset_from_directory(
    "../dataset/processed/validation",
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    label_mode="categorical",
    shuffle=False
)

test_ds = tf.keras.utils.image_dataset_from_directory(
    "../dataset/processed/test",
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    label_mode="categorical",
    shuffle=False
)

print("Class Names:", train_ds.class_names)"""),
            ("markdown", "## 2. Training Data Augmentation\nGeometric and illumination transforms applied ONLY to training samples to boost generalization."),
            ("code", """data_augmentation = tf.keras.Sequential([
    layers.RandomFlip("horizontal"),
    layers.RandomRotation(0.12),
    layers.RandomZoom(0.08),
    layers.RandomContrast(0.1)
], name="data_augmentation")

import matplotlib.pyplot as plt
for images, _ in train_ds.take(1):
    first_img = images[0]
    plt.figure(figsize=(10, 5))
    plt.subplot(1, 2, 1)
    plt.imshow(first_img.numpy().astype("uint8"))
    plt.title("Original Image")
    plt.axis("off")
    
    plt.subplot(1, 2, 2)
    augmented = data_augmentation(tf.expand_dims(first_img, 0))
    plt.imshow(augmented[0].numpy().astype("uint8"))
    plt.title("Augmented Image")
    plt.axis("off")
    plt.show()""")
        ]
    )

    # 04_custom_cnn.ipynb
    create_notebook(
        os.path.join(out_dir, "04_custom_cnn.ipynb"),
        "04 - Custom CNN Baseline Classifier",
        [
            ("markdown", "## 1. Custom 4-Block CNN Architecture\nBaseline deep convolutional neural network built from scratch for tomato leaf disease classification."),
            ("code", """import os
import tensorflow as tf
from tensorflow.keras import layers, models

def build_custom_cnn(num_classes=10):
    inputs = layers.Input(shape=(224, 224, 3))
    x = layers.Rescaling(1./255)(inputs)
    
    # Block 1
    x = layers.Conv2D(32, (3, 3), activation="relu", padding="same")(x)
    x = layers.MaxPooling2D(2, 2)(x)
    
    # Block 2
    x = layers.Conv2D(64, (3, 3), activation="relu", padding="same")(x)
    x = layers.MaxPooling2D(2, 2)(x)
    
    # Block 3
    x = layers.Conv2D(128, (3, 3), activation="relu", padding="same")(x)
    x = layers.MaxPooling2D(2, 2)(x)
    
    # Block 4
    x = layers.Conv2D(256, (3, 3), activation="relu", padding="same")(x)
    x = layers.MaxPooling2D(2, 2)(x)
    
    # Classifier Head
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dropout(0.4)(x)
    x = layers.Dense(128, activation="relu")(x)
    x = layers.Dropout(0.3)(x)
    outputs = layers.Dense(num_classes, activation="softmax")(x)
    
    model = models.Model(inputs=inputs, outputs=outputs, name="Custom_CNN_Baseline")
    model.compile(
        optimizer=tf.keras.optimizers.Adam(1e-3),
        loss="categorical_crossentropy",
        metrics=["accuracy"]
    )
    return model

model = build_custom_cnn()
model.summary()"""),
            ("markdown", "## 2. Training with Callbacks & Checkpointing"),
            ("code", """callbacks = [
    tf.keras.callbacks.ModelCheckpoint("../models/custom_cnn.keras", save_best_only=True, monitor="val_loss"),
    tf.keras.callbacks.EarlyStopping(patience=5, restore_best_weights=True, monitor="val_loss"),
    tf.keras.callbacks.ReduceLROnPlateau(factor=0.3, patience=2, monitor="val_loss")
]
# history = model.fit(train_ds, validation_data=val_ds, epochs=10, callbacks=callbacks)""")
        ]
    )

    # 05_mobilenetv2.ipynb
    create_notebook(
        os.path.join(out_dir, "05_mobilenetv2.ipynb"),
        "05 - MobileNetV2 Transfer Learning",
        [
            ("markdown", "## 1. Pretrained MobileNetV2 Architecture\nUsing ImageNet pretrained backbone for fast convergence and lightweight inference."),
            ("code", """import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

inputs = layers.Input(shape=(224, 224, 3))
x = preprocess_input(inputs)

base_model = MobileNetV2(weights="imagenet", include_top=False, input_shape=(224, 224, 3))
base_model.trainable = False

x = base_model(x, training=False)
x = layers.GlobalAveragePooling2D()(x)
x = layers.Dropout(0.3)(x)
outputs = layers.Dense(10, activation="softmax")(x)

model = models.Model(inputs=inputs, outputs=outputs, name="AgriTwin_MobileNetV2")
model.compile(optimizer=tf.keras.optimizers.Adam(1e-3), loss="categorical_crossentropy", metrics=["accuracy"])
model.summary()"""),
            ("markdown", "## 2. Two-Phase Training Strategy\n- Phase A: Feature Extraction (Backbone Frozen)\n- Phase B: Fine-Tuning Top 40 Inverted Residual Layers with lr=1e-5"),
            ("code", """# Phase A
# history_a = model.fit(train_ds, validation_data=val_ds, epochs=8)

# Phase B: Unfreeze upper layers
base_model.trainable = True
for layer in base_model.layers[:-40]:
    layer.trainable = False

model.compile(optimizer=tf.keras.optimizers.Adam(1e-5), loss="categorical_crossentropy", metrics=["accuracy"])
# history_b = model.fit(train_ds, validation_data=val_ds, epochs=5)""")
        ]
    )

    # 06_model_comparison.ipynb
    create_notebook(
        os.path.join(out_dir, "06_model_comparison.ipynb"),
        "06 - Model Evaluation & Comparative Analysis",
        [
            ("markdown", "## 1. Load Evaluation Metrics\nCompares Custom CNN vs. MobileNetV2 on independent test set."),
            ("code", """import json
import pandas as pd
import matplotlib.pyplot as plt

with open("../evaluation/results/model_comparison.json", "r") as f:
    results = json.load(f)

summary_rows = []
for model_name, m in results.items():
    summary_rows.append({
        "Model": model_name,
        "Accuracy": round(m["accuracy"], 4),
        "Macro Precision": round(m["macro_precision"], 4),
        "Macro Recall": round(m["macro_recall"], 4),
        "Macro F1": round(m["macro_f1"], 4),
        "Latency (ms/img)": m.get("latency_ms_per_image", "N/A"),
        "Size (MB)": m.get("model_size_mb", "N/A")
    })

df = pd.DataFrame(summary_rows)
display(df)"""),
            ("markdown", "## 2. Confusion Matrix Inspection"),
            ("code", """from PIL import Image
cm_cnn = Image.open("../evaluation/results/custom_cnn_confusion_matrix.png")
cm_mob = Image.open("../evaluation/results/mobilenetv2_confusion_matrix.png")

fig, axes = plt.subplots(1, 2, figsize=(18, 8))
axes[0].imshow(cm_cnn)
axes[0].set_title("Custom CNN Confusion Matrix", fontsize=14, fontweight="bold")
axes[0].axis("off")

axes[1].imshow(cm_mob)
axes[1].set_title("MobileNetV2 Confusion Matrix", fontsize=14, fontweight="bold")
axes[1].axis("off")
plt.tight_layout()
plt.show()""")
        ]
    )

    # 07_gradcam.ipynb
    create_notebook(
        os.path.join(out_dir, "07_gradcam.ipynb"),
        "07 - Explainable AI with Grad-CAM",
        [
            ("markdown", "## 1. Explainable AI: Gradient-Weighted Class Activation Mapping (Grad-CAM)\nVisualizes which pixel regions of the tomato leaf drive the CNN's diagnosis."),
            ("code", """import os
import sys
import numpy as np
import matplotlib.pyplot as plt
from PIL import Image

sys.path.append("..")
from evaluation.gradcam import make_gradcam_heatmap, save_and_display_gradcam
from inference.predict import load_cached_model

# Load model and test image
model = load_cached_model("mobilenetv2")
test_img_path = "../dataset/processed/test/Tomato___Early_blight"
sample_img = os.path.join(test_img_path, os.listdir(test_img_path)[0])

img = Image.open(sample_img).resize((224, 224))
img_arr = np.expand_dims(np.array(img, dtype=np.float32), 0)

heatmap = make_gradcam_heatmap(img_arr, model, last_conv_layer_name="out_relu")
superimposed = save_and_display_gradcam(sample_img, heatmap, cam_path="../evaluation/results/gradcam_sample.png")

plt.imshow(superimposed)
plt.title("Grad-CAM Lesion Activation", fontsize=14, fontweight="bold")
plt.axis("off")
plt.show()""")
        ]
    )

if __name__ == "__main__":
    build_all_notebooks()
