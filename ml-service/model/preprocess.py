import torch
from torchvision import transforms

transform = transforms.Compose([
    transforms.Grayscale(),
    transforms.Resize((64,64)),
    transforms.ToTensor()
])

def preprocess_image(image):
    tensor = transform(image).unsqueeze(0)
    return tensor
