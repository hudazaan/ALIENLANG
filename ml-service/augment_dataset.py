import os
from PIL import Image, ImageEnhance, ImageOps
import random

DATASET_PATH = os.path.join("..", "backend", "dataset")

AUGMENTATIONS_PER_IMAGE = 8
TARGET_SIZE = (64, 64)

for letter in os.listdir(DATASET_PATH):
    letter_path = os.path.join(DATASET_PATH, letter)
    if not os.path.isdir(letter_path):
        continue

    print(f"Augmenting: {letter}")

    for img_name in os.listdir(letter_path):
        img_path = os.path.join(letter_path, img_name)
        image = Image.open(img_path).convert("L").resize(TARGET_SIZE)

        for i in range(AUGMENTATIONS_PER_IMAGE):
            img_aug = image.copy()

            if random.random() > 0.5:
                img_aug = img_aug.rotate(random.randint(-15, 15))
            if random.random() > 0.5:
                img_aug = ImageOps.mirror(img_aug)
            if random.random() > 0.5:
                enhancer = ImageEnhance.Contrast(img_aug)
                img_aug = enhancer.enhance(random.uniform(0.8, 1.5))
            if random.random() > 0.5:
                enhancer = ImageEnhance.Brightness(img_aug)
                img_aug = enhancer.enhance(random.uniform(0.8, 1.3))

            new_name = f"{os.path.splitext(img_name)[0]}_aug{i}.png"
            new_path = os.path.join(letter_path, new_name)
            img_aug.save(new_path)

print(" Done augmenting dataset inside backend/dataset/")
