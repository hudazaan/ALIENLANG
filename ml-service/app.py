from fastapi import FastAPI
from pydantic import BaseModel
from model.preprocess import preprocess_image
import torch
from utils.mapping import index_to_symbol
import base64, io
from PIL import Image

app = FastAPI()

model = torch.load("model/model.pth")
model.eval()

class ImageData(BaseModel):
    image: str

@app.post("/predict")
async def predict(data: ImageData):
    img_data = base64.b64decode(data.image.split(",")[1])
    image = Image.open(io.BytesIO(img_data)).convert("RGB")
    tensor = preprocess_image(image)

    with torch.no_grad():
        output = model(tensor)
        pred = output.argmax(dim=1).item()
        confidence = torch.softmax(output, dim=1)[0][pred].item()

    return {"symbol": index_to_symbol[pred], "confidence": confidence}
