import tensorflow as tf
import numpy as np
import cv2
from tensorflow.keras.models import load_model

class GradCAM:
    def __init__(self, model_path):
        self.model = load_model(model_path)
        self.last_conv_layer = self.get_last_conv_layer()
        
    def get_last_conv_layer(self):
        # Find the last convolutional layer
        for layer in reversed(self.model.layers):
            if len(layer.output_shape) == 4:
                return layer.name
        return None
    
    def generate_gradcam(self, img_array, class_idx=0):
        # Create a model that maps the input image to the activations of the last conv layer
        grad_model = tf.keras.models.Model(
            [self.model.inputs], 
            [self.model.get_layer(self.last_conv_layer).output, self.model.output]
        )
        
        # Compute the gradient of the top predicted class for our input image
        with tf.GradientTape() as tape:
            conv_outputs, predictions = grad_model(img_array)
            loss = predictions[:, class_idx]
        
        # Extract the gradients of the top predicted class with regard to the output feature map
        grads = tape.gradient(loss, conv_outputs)
        
        # Pool the gradients over all the axes leaving out the channel dimension
        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
        
        # Multiply each channel in the feature map array by "how important this channel is"
        conv_outputs = conv_outputs[0]
        heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]
        heatmap = tf.squeeze(heatmap)
        
        # Normalize the heatmap between 0 & 1 for visualization
        heatmap = tf.maximum(heatmap, 0) / tf.math.reduce_max(heatmap)
        return heatmap.numpy()
    
    def create_heatmap_overlay(self, img, heatmap, alpha=0.6):
        # Resize heatmap to match image dimensions
        heatmap = cv2.resize(heatmap, (img.shape[1], img.shape[0]))
        
        # Convert heatmap to RGB
        heatmap = np.uint8(255 * heatmap)
        heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
        
        # Overlay heatmap on original image
        overlay = cv2.addWeighted(img, 1-alpha, heatmap, alpha, 0)
        return overlay