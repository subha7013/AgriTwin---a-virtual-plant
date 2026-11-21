import os
import json
import numpy as np
from PIL import Image
from collections import deque

# Hardware Camera Configuration
CONFIDENCE_THRESHOLD = 0.70       # Flag predictions below 70% as "UNCERTAIN"
MIN_LAPLACIAN_VARIANCE = 100.0     # Minimum sharpness to avoid motion/focus blur
MIN_BRIGHTNESS = 40.0             # Minimum mean grayscale brightness (0-255)
MAX_BRIGHTNESS = 220.0            # Maximum mean grayscale brightness to avoid glare/overexposure
TEMPORAL_WINDOW_SIZE = 5          # Number of sequential frames for temporal voting

class HardwareQualityGating:
    """
    Filters frames captured by hardware camera (e.g. ESP32-CAM)
    before feeding to the deep learning model.
    """
    
    @staticmethod
    def compute_blur_score(pil_img):
        """
        Computes sharpness using Laplacian variance approximation.
        High values indicate sharp edges; low values (<100) indicate blur.
        """
        gray = pil_img.convert("L")
        gray_arr = np.array(gray, dtype=np.float32)
        # 3x3 Laplacian kernel convolution
        # [ 0,  1,  0]
        # [ 1, -4,  1]
        # [ 0,  1,  0]
        padded = np.pad(gray_arr, 1, mode='edge')
        laplacian = (
            padded[:-2, 1:-1] +
            padded[2:, 1:-1] +
            padded[1:-1, :-2] +
            padded[1:-1, 2:] -
            4 * gray_arr
        )
        return float(laplacian.var())

    @staticmethod
    def compute_brightness(pil_img):
        """Computes average illumination of the frame."""
        gray = pil_img.convert("L")
        return float(np.mean(gray))

    @classmethod
    def evaluate_frame_quality(cls, pil_img):
        """
        Runs quality checks:
        - Sharpness (blur detection)
        - Exposure (underexposure / overexposure)
        Returns (is_valid, reason)
        """
        brightness = cls.compute_brightness(pil_img)
        if brightness < MIN_BRIGHTNESS:
            return False, f"Frame underexposed (too dark: {brightness:.1f} < {MIN_BRIGHTNESS})"
        if brightness > MAX_BRIGHTNESS:
            return False, f"Frame overexposed (too bright / glare: {brightness:.1f} > {MAX_BRIGHTNESS})"
            
        blur_score = cls.compute_blur_score(pil_img)
        if blur_score < MIN_LAPLACIAN_VARIANCE:
            return False, f"Frame too blurry (Laplacian variance {blur_score:.1f} < {MIN_LAPLACIAN_VARIANCE})"
            
        return True, "Quality check passed"

    @staticmethod
    def center_crop_leaf(pil_img, crop_ratio=0.85):
        """
        Crops center region to focus on the leaf and exclude extraneous background edges.
        """
        w, h = pil_img.size
        cw, ch = int(w * crop_ratio), int(h * crop_ratio)
        left = (w - cw) // 2
        top = (h - ch) // 2
        return pil_img.crop((left, top, left + cw, top + ch))

class TemporalSmoother:
    """
    Buffers successive camera inferences over time.
    Performs probability averaging and majority voting to eliminate single-frame noise.
    """
    def __init__(self, window_size=TEMPORAL_WINDOW_SIZE):
        self.window_size = window_size
        self.prob_buffer = deque(maxlen=window_size)
        
    def add_prediction(self, class_probabilities):
        """Adds a 1D probability distribution array from one frame."""
        self.prob_buffer.append(np.array(class_probabilities, dtype=np.float32))
        
    def get_smoothed_result(self, class_names):
        """
        Computes temporally smoothed prediction:
        1. Average probability distribution over sliding window
        2. Top class and confidence
        3. Confidence gating: if below threshold -> 'UNCERTAIN'
        """
        if not self.prob_buffer:
            return {"status": "NO_FRAMES", "label": "Uncertain", "confidence": 0.0}
            
        avg_probs = np.mean(self.prob_buffer, axis=0)
        top_idx = int(np.argmax(avg_probs))
        confidence = float(avg_probs[top_idx])
        pred_class = class_names[top_idx]
        
        is_uncertain = confidence < CONFIDENCE_THRESHOLD
        
        return {
            "predicted_class": pred_class if not is_uncertain else "UNCERTAIN_LOW_CONFIDENCE",
            "confidence": round(confidence, 4),
            "is_uncertain": is_uncertain,
            "window_count": len(self.prob_buffer),
            "recommendation": "Retake photo closer or under better lighting" if is_uncertain else "Diagnosis confident",
            "top_probabilities": {
                class_names[i]: round(float(avg_probs[i]), 4)
                for i in np.argsort(-avg_probs)[:3]
            }
        }
        
    def reset(self):
        self.prob_buffer.clear()
