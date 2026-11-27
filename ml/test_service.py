import requests
import os

ML_SERVICE_URL = os.getenv("ML_SERVICE_URL", "http://localhost:8000")

def test_health():
    """Test health endpoint"""
    print(f"\n=== Testing {ML_SERVICE_URL}/health ===")
    try:
        response = requests.get(f"{ML_SERVICE_URL}/health")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
    except requests.exceptions.ConnectionError:
        print("ERROR: Service not running!")
        print("Start with: uvicorn ml.inference.app:app --port 8000")


def test_predict(image_path):
    """Test prediction endpoint"""
    if not os.path.exists(image_path):
        print(f"ERROR: Image not found at {image_path}")
        return
    
    print(f"\n=== Testing prediction on {image_path} ===")
    try:
        with open(image_path, "rb") as f:
            files = {"image": f}
            response = requests.post(f"{ML_SERVICE_URL}/predict", files=files)
        
        print(f"Status: {response.status_code}")
        result = response.json()
        print(f"Success: {result.get('success')}")
        print(f"Disease: {result.get('disease')}")
        print(f"Confidence: {result.get('confidence', 0) * 100:.2f}%")
        
    except requests.exceptions.ConnectionError:
        print("ERROR: Service not running!")


if __name__ == "__main__":
    print("Testing ML Service")
    print("=" * 40)
    
    test_health()
    
    # Test with a sample image if available
    sample_paths = [
        "ml/dataset/clean_split/val/Tomato___Early_blight/0.jpg",
        "ml/dataset/processed/test/Tomato___Early_blight/0.jpg",
    ]
    
    for path in sample_paths:
        if os.path.exists(path):
            test_predict(path)
            break
    else:
        print("\nNo sample image found. Place one in ml/dataset/processed/test/")
