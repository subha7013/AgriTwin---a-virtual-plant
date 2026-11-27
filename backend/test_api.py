import requests
import os

API_URL = os.getenv("API_URL", "http://localhost:5000/api/v1")
AUTH_TOKEN = os.getenv("AUTH_TOKEN")  # Get from login

def test_health():
    """Test backend health"""
    print(f"\n=== Testing {API_URL}/health ===")
    try:
        response = requests.get(f"{API_URL}/health")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
    except requests.exceptions.ConnectionError:
        print("ERROR: Backend not running!")


def test_diagnose(image_path, plant_id=None):
    """Test diagnosis endpoint"""
    if not AUTH_TOKEN:
        print("ERROR: No auth token. Please login first.")
        return
    
    if not os.path.exists(image_path):
        print(f"ERROR: Image not found at {image_path}")
        return
    
    print(f"\n=== Testing diagnosis on {image_path} ===")
    try:
        files = {"image": open(image_path, "rb")}
        data = {}
        if plant_id:
            data["plantId"] = plant_id
        
        headers = {"Authorization": f"Bearer {AUTH_TOKEN}"}
        response = requests.post(
            f"{API_URL}/diagnosis/diagnose",
            files=files,
            data=data,
            headers=headers
        )
        
        print(f"Status: {response.status_code}")
        result = response.json()
        print(f"Success: {result.get('success')}")
        
        if result.get("success"):
            diagnosis = result.get("data", {})
            print(f"Disease: {diagnosis.get('disease')}")
            print(f"Confidence: {diagnosis.get('confidence', 0) * 100:.2f}%")
            print(f"Risk Level: {diagnosis.get('riskLevel')}")
        
    except Exception as e:
        print(f"ERROR: {e}")


def test_telemetry(plant_id, sensor_type="temperature", value=25.5):
    """Test telemetry endpoint"""
    if not AUTH_TOKEN:
        print("ERROR: No auth token. Please login first.")
        return
    
    print(f"\n=== Testing telemetry: {sensor_type}={value} ===")
    try:
        data = {
            "plantId": plant_id,
            "sensorType": sensor_type,
            "value": value,
        }
        headers = {
            "Authorization": f"Bearer {AUTH_TOKEN}",
            "Content-Type": "application/json"
        }
        response = requests.post(f"{API_URL}/telemetry", json=data, headers=headers)
        
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        
    except Exception as e:
        print(f"ERROR: {e}")


if __name__ == "__main__":
    print("Testing Backend Service")
    print("=" * 40)
    
    test_health()
    
    # Uncomment to test authentication endpoints
    # test_diagnose("path/to/image.jpg", "plant_id_here")
    # test_telemetry("plant_id_here")
