import os
import re
import json
import shutil
import random
from collections import defaultdict

SEED = 42
TRAIN_RATIO = 0.85
VAL_RATIO = 0.15

RAW_DIR = "ml/dataset/raw"
CLEAN_DIR = "ml/dataset/clean_split"
MANIFEST_PATH = "ml/dataset/splits.json"

def extract_source_key(filename):
    """
    Extracts the unique source leaf key from PlantVillage filename.
    Identifies original images and groups augmented variants:
    Pattern 1: original_<uuid>___<name>.JPG_<uuid2>.JPG -> <uuid>___<name>.JPG
    Pattern 2: <uuid>___<name>.JPG -> <uuid>___<name>.JPG
    Fallback: UUID regex -> 8-4-4-4-12 hex string
    """
    # 1. Match full UUID + image name
    m1 = re.search(r'([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}___[^.]+\.JPG)', filename, re.IGNORECASE)
    if m1:
        return m1.group(1).upper()
    
    # 2. Match UUID only
    m2 = re.search(r'([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})', filename, re.IGNORECASE)
    if m2:
        return m2.group(1).upper()
    
    return filename

def create_leak_free_split(mode="dedupe"):
    """
    mode: 'dedupe' (recommended) keeps 1 true image per source key.
          'grouped' keeps all copies, but never across train/val splits.
    """
    print(f"===========================================================")
    print(f"Phase 1: Dataset Audit & Leakage-Free Split (Mode: {mode.upper()})")
    print(f"Seed: {SEED} | Split: {TRAIN_RATIO*100:.0f}% Train / {VAL_RATIO*100:.0f}% Val")
    print(f"===========================================================\n")
    
    rng = random.Random(SEED)
    
    # 1. Gather all raw images grouped by class and source key
    # class_name -> source_key -> list of file paths
    dataset_tree = defaultdict(lambda: defaultdict(list))
    
    classes = sorted([d for d in os.listdir(RAW_DIR) if os.path.isdir(os.path.join(RAW_DIR, d))])
    print(f"[1/4] Found {len(classes)} classes in {RAW_DIR}:")
    
    raw_counts = {}
    for cls in classes:
        cls_dir = os.path.join(RAW_DIR, cls)
        files = [f for f in os.listdir(cls_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
        raw_counts[cls] = len(files)
        for f in files:
            full_path = os.path.join(cls_dir, f)
            src_key = extract_source_key(f)
            dataset_tree[cls][src_key].append(full_path)
            
    print(f"\n{'Class Name':<45} | {'Raw Files':<10} | {'Unique Sources':<15}")
    print("-" * 75)
    for cls in classes:
        print(f"{cls:<45} | {raw_counts[cls]:<10} | {len(dataset_tree[cls]):<15}")
    print("-" * 75)
    print(f"{'TOTAL':<45} | {sum(raw_counts.values()):<10} | {sum(len(dataset_tree[c]) for c in classes):<15}\n")
    
    # 2. Perform Source-Grouped Split
    print("[2/4] Splitting by Source Group (preventing any duplicate leakage)...")
    manifest = {
        "metadata": {
            "mode": mode,
            "seed": SEED,
            "train_ratio": TRAIN_RATIO,
            "val_ratio": VAL_RATIO,
            "num_classes": len(classes),
            "classes": classes
        },
        "summary": {},
        "files": []
    }
    
    train_dest = os.path.join(CLEAN_DIR, "train")
    val_dest = os.path.join(CLEAN_DIR, "val")
    
    # Reset destination dirs
    if os.path.exists(CLEAN_DIR):
        shutil.rmtree(CLEAN_DIR)
    for cls in classes:
        os.makedirs(os.path.join(train_dest, cls), exist_ok=True)
        os.makedirs(os.path.join(val_dest, cls), exist_ok=True)
        
    summary_stats = {}
    
    for cls in classes:
        source_keys = sorted(list(dataset_tree[cls].keys()))
        rng.shuffle(source_keys)
        
        num_sources = len(source_keys)
        train_source_count = int(round(num_sources * TRAIN_RATIO))
        # Ensure at least 1 source in val
        if train_source_count >= num_sources:
            train_source_count = num_sources - 1
            
        train_sources = set(source_keys[:train_source_count])
        val_sources = set(source_keys[train_source_count:])
        
        train_files_copied = 0
        val_files_copied = 0
        
        for src_key, file_list in dataset_tree[cls].items():
            split = "train" if src_key in train_sources else "val"
            dest_folder = os.path.join(CLEAN_DIR, split, cls)
            
            # Select files based on mode
            if mode == "dedupe":
                # Keep exactly one representative image per source
                # Prefer the unaugmented / original filename if possible
                chosen_file = None
                for fp in file_list:
                    base = os.path.basename(fp)
                    if not ("original_" in base or ".jpg_" in base.lower()):
                        chosen_file = fp
                        break
                if not chosen_file:
                    chosen_file = file_list[0]
                selected_files = [chosen_file]
            else:
                # Grouped mode: keep all copies, but assigned strictly to the split
                selected_files = file_list
                
            for src_file in selected_files:
                base_name = os.path.basename(src_file)
                target_path = os.path.join(dest_folder, base_name)
                shutil.copy2(src_file, target_path)
                
                if split == "train":
                    train_files_copied += 1
                else:
                    val_files_copied += 1
                    
                manifest["files"].append({
                    "class": cls,
                    "source_key": src_key,
                    "filename": base_name,
                    "split": split
                })
                
        summary_stats[cls] = {
            "total_raw": raw_counts[cls],
            "unique_sources": num_sources,
            "train_sources": len(train_sources),
            "val_sources": len(val_sources),
            "train_images": train_files_copied,
            "val_images": val_files_copied
        }
        
    manifest["summary"] = summary_stats
    
    # 3. Write manifest splits.json
    print(f"[3/4] Writing splits manifest to {MANIFEST_PATH}...")
    with open(MANIFEST_PATH, "w") as f:
        json.dump(manifest, f, indent=2)
        
    # 4. Display Verification & Leakage Check
    print("\n[4/4] Verification Summary:")
    print(f"{'Class Name':<42} | {'Raw':<5} | {'Sources':<7} | {'Train Img':<10} | {'Val Img':<8}")
    print("-" * 80)
    for cls in classes:
        s = summary_stats[cls]
        print(f"{cls:<42} | {s['total_raw']:<5} | {s['unique_sources']:<7} | {s['train_images']:<10} | {s['val_images']:<8}")
    print("-" * 80)
    tot_raw = sum(s['total_raw'] for s in summary_stats.values())
    tot_src = sum(s['unique_sources'] for s in summary_stats.values())
    tot_train = sum(s['train_images'] for s in summary_stats.values())
    tot_val = sum(s['val_images'] for s in summary_stats.values())
    print(f"{'TOTAL':<42} | {tot_raw:<5} | {tot_src:<7} | {tot_train:<10} | {tot_val:<8}")
    
    # Check for leakage
    train_manifest_sources = {item["source_key"] for item in manifest["files"] if item["split"] == "train"}
    val_manifest_sources = {item["source_key"] for item in manifest["files"] if item["split"] == "val"}
    leakage = train_manifest_sources.intersection(val_manifest_sources)
    print(f"\n===========================================================")
    print(f"Data Leakage Verification: {len(leakage)} overlapping sources found!")
    if len(leakage) == 0:
        print(">> SUCCESS: Zero data leakage between train and validation splits!")
    else:
        print(f">> WARNING: Leakage detected across {len(leakage)} source keys!")
    print(f"All 10 classes present in Train: {all(summary_stats[c]['train_images'] > 0 for c in classes)}")
    print(f"All 10 classes present in Val:   {all(summary_stats[c]['val_images'] > 0 for c in classes)}")
    print(f"===========================================================\n")

if __name__ == "__main__":
    create_leak_free_split(mode="dedupe")
