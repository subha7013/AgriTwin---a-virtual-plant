import os
import shutil
import json
from pathlib import Path
from PIL import Image

def add_custom_dataset(source_path, raw_path="ml/dataset/raw"):
    """
    Add custom downloaded datasets to the raw dataset folder.
    
    Args:
        source_path: Path to your custom dataset folder
        raw_path: Path to raw directory
    """
    source = Path(source_path)
    raw = Path(raw_path)
    
    if not source.exists():
        print(f"[ERROR] Source path does not exist: {source}")
        return
    
    raw.mkdir(parents=True, exist_ok=True)
    
    print(f"[INFO] Scanning custom dataset at {source}...")
    custom_classes = 0
    
    # Check if source is a directory of disease classes
    for item in source.iterdir():
        if item.is_dir():
            class_name = item.name
            images = [f for f in item.iterdir() 
                     if f.suffix.lower() in ['.jpg', '.jpeg', '.png', '.webp']]
            
            if len(images) > 0:
                target_dir = raw / class_name
                target_dir.mkdir(parents=True, exist_ok=True)
                
                copied = 0
                for img in images:
                    dest = target_dir / img.name
                    if not dest.exists():
                        shutil.copy2(img, dest)
                        copied += 1
                
                print(f"  - {class_name}: {copied} images added")
                custom_classes += 1
    
    print(f"[INFO] Added {custom_classes} new classes from custom dataset")
    return custom_classes


def merge_datasets(base_path="ml/dataset"):
    """
    Merge all datasets (original + custom) and create new class_names.json
    """
    base = Path(base_path)
    raw = base / "raw"
    models = Path("ml/models")
    
    if not raw.exists():
        print("[ERROR] Raw dataset directory not found")
        return
    
    print(f"[INFO] Merging datasets in {raw}...")
    
    class_directories = []
    class_display_names = []
    class_to_idx = {}
    idx_to_class = {}
    idx_to_display = {}
    
    idx = 0
    for class_dir in sorted(raw.iterdir()):
        if not class_dir.is_dir():
            continue
        
        class_name = class_dir.name
        images = [f for f in class_dir.iterdir() 
                 if f.suffix.lower() in ['.jpg', '.jpeg', '.png', '.webp']]
        
        if len(images) > 0:
            # Create display name from class name
            display_name = class_name.replace('_', ' ').title()
            
            class_directories.append(class_name)
            class_display_names.append(display_name)
            class_to_idx[class_name] = idx
            idx_to_class[str(idx)] = class_name
            idx_to_display[str(idx)] = display_name
            
            print(f"  - {display_name}: {len(images)} images")
            idx += 1
    
    # Save updated class_names.json
    metadata = {
        "class_directories": class_directories,
        "class_display_names": class_display_names,
        "class_to_idx": class_to_idx,
        "idx_to_class": idx_to_class,
        "idx_to_display": idx_to_display
    }
    
    models.mkdir(parents=True, exist_ok=True)
    meta_file = models / "class_names.json"
    
    with open(meta_file, "w") as f:
        json.dump(metadata, f, indent=2)
    
    print(f"\n[INFO] Updated class_names.json at {meta_file}")
    print(f"[INFO] Total classes: {len(class_directories)}")
    
    return metadata


def prepare_custom_dataset(source_path, base_path="ml/dataset"):
    """
    Full workflow: Add custom dataset, merge, and prepare splits
    """
    print("="*60)
    print("CUSTOM DATASET PREPARATION WORKFLOW")
    print("="*60)
    
    # Step 1: Add custom dataset
    print("\n[STAGE 1] Adding custom dataset...")
    add_custom_dataset(source_path)
    
    # Step 2: Merge and update class metadata
    print("\n[STAGE 2] Merging datasets...")
    metadata = merge_datasets(base_path)
    
    # Step 3: Run prepare_dataset.py
    print("\n[STAGE 3] Creating stratified splits...")
    import subprocess
    prepare_script = os.path.join(os.path.dirname(__file__), "prepare_dataset.py")
    result = subprocess.run(
        ["python", prepare_script],
        cwd=os.path.dirname(__file__),
        capture_output=True,
        text=True
    )
    
    print(result.stdout)
    if result.returncode != 0:
        print(f"[ERROR] Dataset preparation failed: {result.stderr}")
        return False
    
    print("\n[SUCCESS] Custom dataset preparation complete!")
    return True


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        source_path = sys.argv[1]
        prepare_custom_dataset(source_path)
    else:
        print("Usage: python add_custom_dataset.py <path_to_your_dataset>")
        print("\nExample:")
        print("  python add_custom_dataset.py C:/Users/Downloads/custom_dataset")
        print("  python add_custom_dataset.py ./my-custom-dataset")
