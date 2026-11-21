import io
import os
import numpy as np
from PIL import Image

def preprocess_image(image_input, target_size=(224, 224)):
    """
    Standard preprocessing pipeline for AgriTwin model inference.
    Accepts:
      - File path (str or Path)
      - Raw bytes (e.g. from FastAPI file upload)
      - PIL Image
      - Numpy array (H, W, C)
    Returns:
      - numpy array of shape (1, 224, 224, 3), dtype float32
    """
    if isinstance(image_input, (str, os.PathLike)):
        img = Image.open(image_input)
    elif isinstance(image_input, bytes):
        img = Image.open(io.BytesIO(image_input))
    elif isinstance(image_input, Image.Image):
        img = image_input
    elif isinstance(image_input, np.ndarray):
        img = Image.fromarray(image_input.astype("uint8"))
    else:
        raise ValueError(f"Unsupported image input type: {type(image_input)}")

    # Ensure 3 color channels RGB
    if img.mode != "RGB":
        img = img.convert("RGB")

    # Resize to model input dimensions
    img = img.resize(target_size, Image.Resampling.BILINEAR)

    # Convert to array and expand batch dimension
    img_array = np.array(img, dtype=np.float32)
    img_tensor = np.expand_dims(img_array, axis=0)

    return img_tensor
