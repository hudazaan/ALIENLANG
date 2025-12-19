from fastapi import FastAPI
from pydantic import BaseModel
import torch
import torch.nn as nn
from torchvision import models
from model.preprocess import preprocess_image
from utils.mapping import index_to_symbol
import base64, io, os
from PIL import Image
from fastapi.middleware.cors import CORSMiddleware
from utils.segment import segment_symbols
from io import BytesIO

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],                                         # or ["http://localhost:3000"] to be strict
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = "model/resnet_finetuned.pth"

model = models.resnet18(weights=None)
model.fc = nn.Linear(model.fc.in_features, 26) 

if os.path.exists(MODEL_PATH):
 try:
    state_dict = torch.load(MODEL_PATH, map_location=torch.device("cpu"))
    model.load_state_dict(state_dict)
    model.eval()
    print(f"✅ Loaded fine-tuned ResNet model from {MODEL_PATH}")    
 except Exception as e:
        print(" Error loading model:", e)
        model = None
else: 
    model = None
    print(f"⚠️ Model file not found at {MODEL_PATH}. Please run fine_tune_resnet.py first.")

class ImageData(BaseModel):
    image: str                                                     # base64 string

@app.post("/predict")
async def predict(data: ImageData):
    if model is None:
        return {"error": "Model not found. Please train and save resnet_finetuned.pth first."}

    try:
        img_base64 = data.image.split(",")[1] if "," in data.image else data.image
        img_data = base64.b64decode(img_base64)
        image = Image.open(io.BytesIO(img_data)).convert("RGB")

        tensor = preprocess_image(image)

        with torch.no_grad():
            output = model(tensor)
            pred_idx = output.argmax(dim=1).item()
            confidence = torch.softmax(output, dim=1)[0][pred_idx].item()

        symbol = index_to_symbol.get(pred_idx, "?")
        print(f"Predicted: {symbol} (Confidence: {confidence:.4f})")

        return {"symbol": symbol, "confidence": confidence}

    except Exception as e:
        print(" Prediction error:", e)
        return {"error": str(e)}

@app.post("/predict_word")
async def predict_word(data: ImageData):
    if model is None:
        return {"error": "Model not loaded"}

    try:
        img_base64 = data.image.split(",")[1] if "," in data.image else data.image
        image_bytes = base64.b64decode(img_base64)
        image = Image.open(BytesIO(image_bytes)).convert("L")

        symbols = segment_symbols(image)
        print(f"Detected {len(symbols)} symbols:", symbols)

        if len(symbols) == 0:
            return {"error": "No symbols detected"}

        predicted_symbols = []
        confidences = []

        for i, sym in enumerate(symbols):

            if sym == "SPACE":
                predicted_symbols.append(" ")
                confidences.append(1.0)
                continue

            sym.save(f"debug_symbol_{i}.png") 

            tensor = preprocess_image(sym)
            with torch.no_grad():
                output = model(tensor)
                idx = output.argmax(dim=1).item()
                conf = torch.softmax(output, dim=1)[0][idx].item()

            predicted_symbols.append(index_to_symbol[idx])
            confidences.append(round(conf, 4))

        word = "".join(predicted_symbols)

        return {"word": word, "confidences": confidences}

    except Exception as e:
        print(" Word prediction error:", e)
        return {"error": str(e)}

@app.get("/")
async def root():
    return {"message": "AlienLang ML service is running!"}