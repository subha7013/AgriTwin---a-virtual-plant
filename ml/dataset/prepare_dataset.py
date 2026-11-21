import os
import shutil
import hashlib
import random
from pathlib import Path
from PIL import Image

def get_file_hash(filepath):
    """Compute MD5 hash to detect duplicate images."""
    hasher = hashlib.md5()
    with open(filepath, "rb") as f:
        buf = f.read(65536)
        while len(buf) > 0:
            hasher.update(buf)
            buf = f.read(65536)
    return hasher.hexdigest()

def organize_raw_dataset(base_dir="ml/dataset"):
    """
    Consolidates initial train/val folders into raw/<class_name>
    if raw doesn't already exist.
    """
    base_path = Path(base_dir)
    raw_path = base_path / "raw"
    tomato_path = base_path / "tomato"

    if raw_path.exists() and any(raw_path.iterdir()):
        print(f"[INFO] Raw directory already exists and is populated: {raw_path}")
        return raw_path

    raw_path.mkdir(parents=True, exist_ok=True)

    if tomato_path.exists():
        print("[INFO] Migrating dataset from ml/dataset/tomato to ml/dataset/raw ...")
        # Migrate train and val
        for split in ["train", "val"]:
            split_dir = tomato_path / split
            if not split_dir.exists():
                continue
            for class_dir in split_dir.iterdir():
                if not class_dir.is_dir():
                    continue
                target_class_dir = raw_path / class_dir.name
                target_class_dir.mkdir(parents=True, exist_ok=True)
                for img_file in class_dir.glob("*.*"):
                    if img_file.suffix.lower() in [".jpg", ".jpeg", ".png"]:
                        dest_file = target_class_dir / img_file.name
                        if not dest_file.exists():
                            shutil.copy2(img_file, dest_file)
        print("[INFO] Raw dataset migration complete.")
    else:
        print("[WARNING] Source ml/dataset/tomato not found. Assuming raw data is placed in ml/dataset/raw.")

    return raw_path

def inspect_and_clean_raw(raw_path):
    """
    Checks for corrupted images and duplicate images across classes.
    """
    print("\n" + "="*50)
    print("STAGE 1: DATASET INSPECTION & INTEGRITY CHECK")
    print("="*50)

    hashes = {}
    duplicates = []
    corrupted = []
    class_stats = {}

    for class_dir in sorted(raw_path.iterdir()):
        if not class_dir.is_dir():
            continue
        class_name = class_dir.name
        img_files = [f for f in class_dir.iterdir() if f.suffix.lower() in [".jpg", ".jpeg", ".png"]]
        valid_count = 0

        for f in img_files:
            # Check corrupt
            try:
                with Image.open(f) as img:
                    img.verify()
                # Verify passed, check hash
                fhash = get_file_hash(f)
                if fhash in hashes:
                    duplicates.append((str(f), hashes[fhash]))
                else:
                    hashes[fhash] = str(f)
                    valid_count += 1
            except Exception as e:
                corrupted.append((str(f), str(e)))

        class_stats[class_name] = len(img_files)

    print(f"Total disease classes detected: {len(class_stats)}")
    print(f"Total images checked: {sum(class_stats.values())}")
    print(f"Corrupted images found: {len(corrupted)}")
    print(f"Duplicate images found: {len(duplicates)}")
    print("\nClass Distribution:")
    for cname, count in class_stats.items():
        print(f"  - {cname}: {count} images")

    return class_stats

def create_stratified_split(raw_path, processed_path, train_ratio=0.70, val_ratio=0.15, test_ratio=0.15, seed=42):
    """
    Creates a clean 70% / 15% / 15% stratified split in processed/train, processed/validation, processed/test.
    Avoids image leakage.
    """
    print("\n" + "="*50)
    print("STAGE 2: DATA PREPROCESSING & STRATIFIED SPLIT")
    print("="*50)

    random.seed(seed)
    processed_path = Path(processed_path)
    train_dir = processed_path / "train"
    val_dir = processed_path / "validation"
    test_dir = processed_path / "test"

    for d in [train_dir, val_dir, test_dir]:
        d.mkdir(parents=True, exist_ok=True)

    summary = {"train": 0, "validation": 0, "test": 0}

    for class_dir in sorted(raw_path.iterdir()):
        if not class_dir.is_dir():
            continue
        class_name = class_dir.name
        images = [f for f in class_dir.iterdir() if f.suffix.lower() in [".jpg", ".jpeg", ".png"]]
        images.sort() # Ensure deterministic ordering
        random.shuffle(images)

        n_total = len(images)
        n_train = int(n_total * train_ratio)
        n_val = int(n_total * val_ratio)
        n_test = n_total - n_train - n_val

        train_imgs = images[:n_train]
        val_imgs = images[n_train:n_train + n_val]
        test_imgs = images[n_train + n_val:]

        for split_name, split_files, split_target in [
            ("train", train_imgs, train_dir),
            ("validation", val_imgs, val_dir),
            ("test", test_imgs, test_dir)
        ]:
            target_class_dir = split_target / class_name
            target_class_dir.mkdir(parents=True, exist_ok=True)
            for img in split_files:
                dest = target_class_dir / img.name
                if not dest.exists():
                    shutil.copy2(img, dest)
            summary[split_name] += len(split_files)

    print(f"Stratified Split Completed:")
    print(f"  - Training set (70%):   {summary['train']} images")
    print(f"  - Validation set (15%): {summary['validation']} images")
    print(f"  - Testing set (15%):    {summary['test']} images")
    print(f"  - Total split images:   {sum(summary.values())}")
    return summary

if __name__ == "__main__":
    raw_dir = organize_raw_dataset("ml/dataset")
    inspect_and_clean_raw(raw_dir)
    create_stratified_split(raw_dir, "ml/dataset/processed")
