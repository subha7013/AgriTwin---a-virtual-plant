import os
import sys
import json
import argparse
import numpy as np

# Configure GPU backend
workspace_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
os.environ["KERAS_BACKEND"] = "torch"
os.environ["KERAS_HOME"] = os.path.join(workspace_root, ".keras")
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

import torch
import keras

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from inference.preprocessing import preprocess_image

_MODEL_CACHE = {}
_CLASS_METADATA = None

def get_class_metadata(meta_path=None):
    global _CLASS_METADATA
    if _CLASS_METADATA is None:
        if meta_path is None:
            meta_path = os.path.join(os.path.dirname(__file__), "..", "models", "class_names.json")
        with open(meta_path, "r") as f:
            _CLASS_METADATA = json.load(f)
    return _CLASS_METADATA

def load_cached_model(model_type="mobilenetv2"):
    global _MODEL_CACHE
    if model_type not in _MODEL_CACHE:
        model_dir = os.path.join(os.path.dirname(__file__), "..", "models")
        if model_type == "mobilenetv2":
            model_path = os.path.join(model_dir, "mobilenetv2_best.keras")
        elif model_type == "custom_cnn":
            model_path = os.path.join(model_dir, "custom_cnn.keras")
        else:
            raise ValueError(f"Unknown model_type: {model_type}")

        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found at {model_path}. Please train model first.")

        print(f"[INFO] Loading {model_type} from {model_path} into GPU cache...")
        _MODEL_CACHE[model_type] = keras.models.load_model(model_path)
    return _MODEL_CACHE[model_type]

def predict_disease(image, plant_id="TOMATO_001", model_type="mobilenetv2"):
    """
    Standard AgriTwin disease classification inference pipeline.
    Supports:
      - 'mobilenetv2' (Primary transfer-learning classifier)
      - 'custom_cnn'  (Baseline classifier)
      - 'ensemble'    (Weighted average of MobileNetV2 + Custom CNN for higher accuracy)
    """
    try:
        meta = get_class_metadata()
        display_names = meta["class_display_names"]

        if model_type == "ensemble":
            # Load both models
            m_mob = load_cached_model("mobilenetv2")
            m_cnn = load_cached_model("custom_cnn")

            # Preprocess to each model's native resolution
            in_shape_mob = m_mob.input_shape
            size_mob = (in_shape_mob[1], in_shape_mob[2]) if in_shape_mob and in_shape_mob[1] is not None else (256, 256)
            tensor_mob = preprocess_image(image, target_size=size_mob)

            in_shape_cnn = m_cnn.input_shape
            size_cnn = (in_shape_cnn[1], in_shape_cnn[2]) if in_shape_cnn and in_shape_cnn[1] is not None else (224, 224)
            tensor_cnn = preprocess_image(image, target_size=size_cnn)

            p_mob = m_mob.predict(tensor_mob, verbose=0)[0]
            p_cnn = m_cnn.predict(tensor_cnn, verbose=0)[0]

            # Weighted ensemble: 70% MobileNetV2 + 30% Custom CNN
            preds = 0.70 * p_mob + 0.30 * p_cnn
            model_label = "Ensemble (MobileNetV2 70% + Custom CNN 30%)"

        else:
            model = load_cached_model(model_type=model_type)
            in_shape = model.input_shape
            target_size = (in_shape[1], in_shape[2]) if in_shape and in_shape[1] is not None else (224, 224)
            img_tensor = preprocess_image(image, target_size=target_size)

            preds = model.predict(img_tensor, verbose=0)[0]
            model_label = "MobileNetV2" if model_type == "mobilenetv2" else "Custom CNN"

        pred_idx = int(np.argmax(preds))
        confidence = float(preds[pred_idx])
        predicted_disease = display_names[pred_idx]

        probabilities = {
            name: round(float(preds[i]), 4)
            for i, name in enumerate(display_names)
        }

        return {
            "success": True,
            "plant_id": plant_id,
            "prediction": {
                "disease": predicted_disease,
                "confidence": round(confidence, 4)
            },
            "probabilities": probabilities,
            "model": model_label,
            "model_version": "1.0"
        }

    except Exception as e:
        return {
            "success": False,
            "plant_id": plant_id,
            "error": str(e),
            "model": model_type,
            "model_version": "1.0"
        }

def format_prediction_output(result, image_path):
    """Prints a beautiful, clean, readable diagnostic card in the terminal."""
    if not result.get("success"):
        print(f"\n[ERROR] Inference failed: {result.get('error')}")
        return

    pred = result["prediction"]
    probs = result["probabilities"]
    
    # Sort probabilities descending
    sorted_probs = sorted(probs.items(), key=lambda x: x[1], reverse=True)

    print("\n" + "="*65)
    print("🌿 AGRITWIN TOMATO DISEASE DIAGNOSTIC REPORT")
    print("="*65)
    print(f"📁 Image Path   : {image_path}")
    print(f"🤖 Model Used   : {result['model']}")
    print(f"🌱 Plant ID     : {result['plant_id']}")
    print(f"🔍 Diagnosis    : {pred['disease'].upper()}")
    print(f"🎯 Confidence   : {pred['confidence'] * 100:.2f}%")
    print("-"*65)
    print("TOP PREDICTED DISEASE PROBABILITIES:")
    for rank, (d_name, p_val) in enumerate(sorted_probs[:4], 1):
        bar_len = int(p_val * 30)
        bar = "█" * bar_len + "░" * (30 - bar_len)
        print(f"  {rank}. {d_name:<30} [{bar}] {p_val*100:6.2f}%")
    print("="*65 + "\n")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="AgriTwin Disease Inference CLI")
    parser.add_argument("--image", "-i", type=str, default=None, help="Path to leaf image file")
    parser.add_argument("--model", "-m", type=str, default="mobilenetv2", choices=["mobilenetv2", "custom_cnn", "ensemble"], help="Model to use")
    parser.add_argument("--plant-id", "-p", type=str, default="TOMATO_001", help="Plant identifier")
    parser.add_argument("--json", action="store_true", help="Print raw JSON output")
    args = parser.parse_args()

    image_path = args.image
    if image_path is None:
        # Pick a sample image from the test set if none provided
        test_dir = os.path.join(os.path.dirname(__file__), "..", "dataset", "processed", "test")
        if os.path.exists(test_dir):
            classes = [d for d in os.listdir(test_dir) if os.path.isdir(os.path.join(test_dir, d))]
            sample_class = classes[1] # e.g. Early Blight
            img_list = os.listdir(os.path.join(test_dir, sample_class))
            image_path = os.path.join(test_dir, sample_class, img_list[0])
            print(f"[INFO] No --image argument provided. Testing on sample: {image_path}")
        else:
            print("[ERROR] No image specified and test directory not found.")
            sys.exit(1)

    result = predict_disease(image_path, plant_id=args.plant_id, model_type=args.model)

    if args.json:
        print(json.dumps(result, indent=2))
    else:
        format_prediction_output(result, image_path)
