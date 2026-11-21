# AgriTwin Hardware Camera Capture & Field Protocol (ESP32-CAM)

This document outlines the operational protocol for using low-cost hardware cameras (such as the ESP32-CAM OV2640 module) with the AgriTwin MobileNetV2 leaf disease detection model.

---

## 1. Domain Shift: PlantVillage vs Real Hardware Camera

The core disease detection model is trained on PlantVillage imagery (individual leaves on neutral/uniform backgrounds under controlled lighting). In a real hydroponic greenhouse or field:
- The ESP32-CAM camera module has a fixed focal length lens with distinct optical distortion and dynamic range limits.
- Backgrounds may include plant stems, soil, hydroponic pipes, and shadows.
- Natural daylight varies drastically (glare, direct sunlight, low evening light).

To overcome this domain gap, follow the **Hardware Protocol** below.

---

## 2. Capture Protocol for the Device

1. **Distance & Framing**:
   - Maintain a fixed distance of **10 to 15 cm** between the ESP32-CAM lens and the leaf.
   - Frame a single primary leaf occupying at least **70–85% of the field of view**.
2. **Lighting**:
   - Ensure diffuse, non-harsh illumination (use a white 5000K LED ring or soft natural ambient light).
   - Avoid direct backlight or harsh specular glare that washes out lesion pigmentation.
3. **Background**:
   - Where possible, place a neutral surface (hand, card, or plain background) behind the leaf during capture.
4. **Resolution**:
   - Set ESP32-CAM frame size to `FRAMESIZE_VGA` (640x480) or `FRAMESIZE_SVGA` (800x600) with JPEG quality 10-12.

---

## 3. Inference Quality Gating (`ml/inference/hardware_camera_pipeline.py`)

Every frame sent by the device passes through automatic quality gates before running neural network inference:

1. **Blur Detection (Laplacian Variance)**:
   - Calculates the variance of the Laplacian filter over the grayscale frame.
   - Threshold: $\text{Var}(\Delta I) \ge 100.0$.
   - Frames below 100 are rejected as blurry (out of focus or camera motion).
2. **Exposure Gating**:
   - Evaluates mean brightness: $40 \le \bar{Y} \le 220$ (on 0–255 scale).
   - Frames with $\bar{Y} < 40$ are rejected as underexposed (too dark).
   - Frames with $\bar{Y} > 220$ are rejected as overexposed (washout / glare).
3. **Central Region Focus**:
   - Automatic center crop (85% bounding crop) to eliminate periphery artifacts.

---

## 4. Temporal Smoothing & Uncertainty Handling

Fixed cameras or mobile streams benefit from temporal filtering over a window of $N=5$ consecutive frames:
1. **Probability Averaging**:
   $$\bar{P}(c) = \frac{1}{N} \sum_{i=1}^N P_i(c)$$
2. **Confidence Threshold**:
   - If $\max_c \bar{P}(c) < 0.70$, output `UNCERTAIN_LOW_CONFIDENCE`.
   - The UI requests the farmer or sensor to retake the shot under better framing.
3. **Voting Stability**:
   - Single-frame anomalies (sensor flicker, sudden shadow) do not trigger false alarms.

---

## 5. Field Set Collection & Domain Adaptation Protocol

To fine-tune AgriTwin MobileNetV2 specifically for a physical greenhouse:
1. **Collect Field Dataset**:
   - Collect 20–50 actual ESP32-CAM leaf photos per class from your greenhouse setup.
   - Store in `ml/dataset/field_data/<class_name>/`.
2. **Fine-Tuning**:
   - Load `ml/models/model.keras`.
   - Freeze all layers except the top 20.
   - Train for 3–5 epochs at a very low learning rate ($\eta = 10^{-5}$) using Adam optimizer.
   - Save domain-adapted model as `ml/models/model_esp32_adapted.keras`.
