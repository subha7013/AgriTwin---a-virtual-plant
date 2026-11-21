import os
import cv2
import numpy as np
import torch
import keras
from keras import ops
import matplotlib.pyplot as plt

def make_gradcam_heatmap(img_array, model, last_conv_layer_name, pred_index=None):
    """
    Computes Grad-CAM heatmap for a given image array and model.
    Works seamlessly with Keras 3 (PyTorch / CUDA backend).
    """
    target_layer = None
    nested_model = None

    try:
        target_layer = model.get_layer(last_conv_layer_name)
    except ValueError:
        for layer in model.layers:
            if hasattr(layer, "get_layer"):
                try:
                    target_layer = layer.get_layer(last_conv_layer_name)
                    nested_model = layer
                    break
                except ValueError:
                    continue

    if nested_model is not None:
        grad_model = keras.models.Model(
            inputs=model.inputs,
            outputs=[nested_model.get_layer(last_conv_layer_name).output, model.output]
        )
    elif target_layer is not None:
        grad_model = keras.models.Model(
            inputs=model.inputs,
            outputs=[model.get_layer(last_conv_layer_name).output, model.output]
        )
    else:
        raise ValueError(f"Layer {last_conv_layer_name} not found in model.")

    # Convert img_array to tensor on model device
    if not isinstance(img_array, torch.Tensor):
        img_tensor = torch.tensor(img_array, dtype=torch.float32, device="cuda:0")
    else:
        img_tensor = img_array.to("cuda:0")

    img_tensor.requires_grad = True
    conv_outputs, predictions = grad_model(img_tensor)

    if pred_index is None:
        pred_index = int(torch.argmax(predictions[0]).item())

    loss = predictions[:, pred_index]

    # Compute gradients of top predicted class wrt conv layer activations
    grads = torch.autograd.grad(loss, conv_outputs, retain_graph=True)[0]

    # Global average pooling of gradients
    pooled_grads = torch.mean(grads, dim=(0, 2, 3) if grads.dim() == 4 and grads.shape[1] < grads.shape[2] else (0, 1, 2))

    # Weight feature channels by gradients
    conv_out = conv_outputs[0]
    if conv_out.shape[0] == pooled_grads.shape[0]: # (C, H, W) format
        for i in range(pooled_grads.shape[0]):
            conv_out[i, :, :] *= pooled_grads[i]
        heatmap = torch.mean(conv_out, dim=0).detach().cpu().numpy()
    else: # (H, W, C) format
        conv_out = conv_out.detach().cpu().numpy()
        p_grads = pooled_grads.detach().cpu().numpy()
        heatmap = np.dot(conv_out, p_grads)

    heatmap = np.maximum(heatmap, 0)
    max_val = np.max(heatmap)
    if max_val > 0:
        heatmap /= max_val

    return heatmap

def save_and_display_gradcam(img_path, heatmap, cam_path="ml/evaluation/results/gradcam_sample.png", alpha=0.45):
    """
    Overlays Grad-CAM heatmap on top of original leaf image and saves the visualization.
    """
    os.makedirs(os.path.dirname(cam_path), exist_ok=True)
    img = cv2.imread(img_path)
    if img is None:
        raise ValueError(f"Could not load image at {img_path}")
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
    heatmap = np.uint8(255 * heatmap)
    jet = plt.colormaps.get_cmap("jet")
    
    jet_colors = jet(np.arange(256))[:, :3]
    jet_heatmap = jet_colors[heatmap]
    
    jet_heatmap = cv2.resize(jet_heatmap, (img.shape[1], img.shape[0]))
    jet_heatmap = np.uint8(255 * jet_heatmap)
    
    superimposed_img = np.uint8(jet_heatmap * alpha + img * (1 - alpha))
    
    fig, axes = plt.subplots(1, 3, figsize=(15, 5))
    axes[0].imshow(img)
    axes[0].set_title("Original Leaf Image", fontsize=12, fontweight="bold")
    axes[0].axis("off")
    
    axes[1].imshow(heatmap, cmap="jet")
    axes[1].set_title("Grad-CAM Heatmap", fontsize=12, fontweight="bold")
    axes[1].axis("off")
    
    axes[2].imshow(superimposed_img)
    axes[2].set_title("Superimposed Salient Lesion Region", fontsize=12, fontweight="bold")
    axes[2].axis("off")
    
    plt.tight_layout()
    plt.savefig(cam_path, dpi=300)
    plt.close()
    print(f"[INFO] Grad-CAM visualization successfully saved to {cam_path}")
    return superimposed_img
