import base64
import requests
import os
import json

DATASET_DIR = os.path.join("..", "backend", "dataset")  

BATCH = False
TEST_FILE = os.path.join(DATASET_DIR, "H", "sample_1761591209506.png")

PREDICT_URL = "http://127.0.0.1:8000/predict" 

def file_to_base64(path):
    with open(path, "rb") as f:
        b = base64.b64encode(f.read()).decode("utf-8")

    return "data:image/png;base64," + b

def predict_from_file(path):
    b64 = file_to_base64(path)
    resp = requests.post(PREDICT_URL, json={"image": b64})
    try:
        return resp.json()
    except Exception:
        return {"error": "invalid response", "status": resp.status_code, "text": resp.text}

if __name__ == "__main__":
    if BATCH:
        out = {}
        for letter in sorted(os.listdir(DATASET_DIR)):
            letter_dir = os.path.join(DATASET_DIR, letter)
            if not os.path.isdir(letter_dir): continue
            out[letter] = {}
            for fname in sorted(os.listdir(letter_dir)):
                path = os.path.join(letter_dir, fname)
                if not fname.lower().endswith(".png"): continue
                res = predict_from_file(path)
                out[letter][fname] = res
        print(json.dumps(out, indent=2))
    else:
        if not os.path.exists(TEST_FILE):
            print("Test file not found:", TEST_FILE)
            raise SystemExit(1)
        print("Using file:", TEST_FILE)
        b64 = file_to_base64(TEST_FILE)
        print("\n--- FULL BASE64 ---")
        print(b64)
        print("\nSending to /predict ...")
        result = predict_from_file(TEST_FILE)
        print("\n Prediction Result:")
        print(json.dumps(result, indent=2))
