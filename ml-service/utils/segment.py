import cv2
import numpy as np
from PIL import Image

def segment_symbols(pil_image):
    """
    Input: PIL Image (RGB)
    Output: list of PIL Images (each symbol cropped)
    """

    img = np.array(pil_image.convert("L"))                                 # Convert to grayscale

    blur = cv2.GaussianBlur(img, (5,5), 0)                                 # Invert (black background, white ink)
    _, thresh = cv2.threshold(
    blur, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU
    )

    contours, _ = cv2.findContours(                                         # Find connected components
        thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
    )

    symbol_images = []

    contours = sorted(contours, key=lambda c: cv2.boundingRect(c)[0])        # Sort left → right

    prev_x_end = None

    for c in contours:
        x, y, w, h = cv2.boundingRect(c)

        if w < 25 or h < 25:                                                 # Ignore tiny noise
            continue

        if prev_x_end is not None:
         gap = x - prev_x_end
         if gap > 40:                                                        # SPACE DETECTION
            symbol_images.append("SPACE")

        symbol = img[y:y+h, x:x+w]
        symbol_pil = Image.fromarray(symbol)
        symbol_images.append(symbol_pil)

        prev_x_end = x + w
        
    return symbol_images
