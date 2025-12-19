from torchvision import transforms
import torch

# For ResNet — 3-channel, 224x224 images
transform = transforms.Compose([
    transforms.Grayscale(num_output_channels=3),
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    # transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5]) 
])

def preprocess_image(image):
    # """
    # image: PIL Image
    # returns: tensor shape (1, 3, 224, 224)
    # """
    return transform(image).unsqueeze(0)