import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms, models
import os

DATASET_PATH = os.path.join("..", "..", "backend", "dataset")

transform = transforms.Compose([
    transforms.Grayscale(num_output_channels=3),  
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

train_data = datasets.ImageFolder(root=DATASET_PATH, transform=transform)
train_loader = torch.utils.data.DataLoader(train_data, batch_size=16, shuffle=True)

num_classes = len(train_data.classes)
print("Found classes:", train_data.classes)

model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)

# Replace the final layer
model.fc = nn.Linear(model.fc.in_features, num_classes)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = model.to(device)

criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.0005)

EPOCHS = 5
for epoch in range(EPOCHS):
    running_loss = 0.0
    model.train()
    for imgs, labels in train_loader:
        imgs, labels = imgs.to(device), labels.to(device)
        optimizer.zero_grad()
        outputs = model(imgs)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        running_loss += loss.item()
    print(f"Epoch {epoch+1}/{EPOCHS} - Loss: {running_loss/len(train_loader):.4f}")

model_dir = os.path.join("model")
os.makedirs(model_dir, exist_ok=True)

model_path = os.path.join(model_dir, "resnet_finetuned.pth")
torch.save(model.state_dict(), model_path)

print(f"✅ Saved fine-tuned model to {model_path}")