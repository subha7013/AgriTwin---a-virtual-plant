import os
import re
from collections import defaultdict

def audit_directory(target_dir):
    print(f"\n==========================================")
    print(f"Auditing: {target_dir}")
    print(f"==========================================")
    if not os.path.exists(target_dir):
        print(f"Directory {target_dir} does not exist.")
        return

    class_stats = defaultdict(lambda: {'total': 0, 'sources': set(), 'examples': [], 'augmented': 0})
    
    for root, dirs, files in os.walk(target_dir):
        for f in files:
            if not f.lower().endswith(('.jpg', '.jpeg', '.png')):
                continue
            
            # Identify class
            rel = os.path.relpath(root, target_dir)
            parts = rel.split(os.sep)
            # e.g., train/Tomato___Early_blight or Tomato___Early_blight
            cls = parts[-1]
            if cls in ['.', 'train', 'val', 'test', 'validation']:
                continue
            
            class_stats[cls]['total'] += 1
            if len(class_stats[cls]['examples']) < 3:
                class_stats[cls]['examples'].append(f)
            
            # Check if augmented format: original_<uuid>... or contains multiple .jpg or uuid suffixes
            if 'original_' in f or '.jpg_' in f.lower() or '.jpeg_' in f.lower():
                class_stats[cls]['augmented'] += 1

            # Extract source key:
            # PlantVillage uuid pattern: 8-4-4-4-12 hex chars followed by ___ and rest of name
            m = re.search(r'([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}___[^.]+\.JPG)', f, re.IGNORECASE)
            if m:
                src_key = m.group(1).upper()
            else:
                # UUID only match
                m2 = re.search(r'([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})', f, re.IGNORECASE)
                if m2:
                    src_key = m2.group(1).upper()
                else:
                    src_key = f
            
            class_stats[cls]['sources'].add(src_key)

    total_all = sum(s['total'] for s in class_stats.values())
    total_sources = sum(len(s['sources']) for s in class_stats.values())
    print(f"{'Class Name':<45} | {'Total Images':<12} | {'Unique Sources':<14} | {'Augmented':<10}")
    print("-" * 90)
    for cls, stats in sorted(class_stats.items()):
        print(f"{cls:<45} | {stats['total']:<12} | {len(stats['sources']):<14} | {stats['augmented']:<10}")
    print("-" * 90)
    print(f"{'TOTAL':<45} | {total_all:<12} | {total_sources:<14}")
    
    # Print sample file names to verify pattern
    print("\nSample filenames:")
    for cls, stats in sorted(class_stats.items())[:3]:
        print(f"  [{cls}]:")
        for ex in stats['examples']:
            print(f"    - {ex}")

if __name__ == "__main__":
    audit_directory("ml/dataset/tomato")
    audit_directory("ml/dataset/raw")
    audit_directory("ml/dataset/processed")
