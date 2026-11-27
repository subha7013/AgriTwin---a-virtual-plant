import requests
import os

API_URL = os.getenv("API_URL", "http://localhost:5000/api/v1")
ML_URL = os.getenv("ML_SERVICE_URL", "http://localhost:8000")

def test_ml_health():
    """Test ML service health"""
    print(f"\n{'='*60}")
    print(f"Testing ML Service: {ML_URL}/health")
    print('='*60)
    try:
        response = requests.get(f"{ML_URL}/health")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"ERROR: {e}")
        return False

def test_ml_predict():
    """Test ML prediction with sample image"""
    print(f"\n{'='*60}")
    print(f"Testing ML Prediction")
    print('='*60)
    
    sample_path = None
    test_dir = "ml/dataset/processed/test"
    if os.path.exists(test_dir):
        for root, dirs, files in os.walk(test_dir):
            for f in files:
                if f.lower().endswith(('.jpg', '.jpeg', '.png')):
                    sample_path = os.path.join(root, f)
                    break
            if sample_path:
                break
    
    if not sample_path or not os.path.exists(sample_path):
        print("ERROR: No sample image found")
        return False
    
    print(f"Testing with: {sample_path}")
    try:
        with open(sample_path, "rb") as f:
            files = {"image": f}
            response = requests.post(f"{ML_URL}/predict", files=files, timeout=60)
        
        print(f"Status: {response.status_code}")
        result = response.json()
        print(f"Success: {result.get('success')}")
        print(f"Disease: {result.get('disease')}")
        print(f"Confidence: {result.get('confidence', 0) * 100:.2f}%")
        print(f"Model: {result.get('model')}")
        return result.get('success')
    except Exception as e:
        print(f"ERROR: {e}")
        return False

def test_backend_health():
    """Test backend health"""
    print(f"\n{'='*60}")
    print(f"Testing Backend: {API_URL}/health")
    print('='*60)
    try:
        response = requests.get(f"{API_URL}/health")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"ERROR: {e}")
        return False

def test_auth_login():
    """Test login endpoint"""
    print(f"\n{'='*60}")
    print(f"Testing Login")
    print('='*60)
    
    data = {
        "username": "admin",
        "email": "admin@agritwin.local",
        "password": "Admin@123"
    }
    
    try:
        response = requests.post(f"{API_URL}/auth/login", json=data)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            token = result.get("data", {}).get("accessToken")
            print("Login successful!")
            return token
        else:
            print(f"Failed: {response.text}")
            return None
    except Exception as e:
        print(f"ERROR: {e}")
        return None

def test_diagnosis(token):
    """Test diagnosis endpoint"""
    print(f"\n{'='*60}")
    print(f"Testing Diagnosis Endpoint")
    print('='*60)
    
    # Get fresh token
    login_data = {
        "username": "admin",
        "email": "admin@agritwin.local",
        "password": "Admin@123"
    }
    try:
        login_response = requests.post(f"{API_URL}/auth/login", json=login_data, verify=False)
        if login_response.status_code == 200:
            token = login_response.json().get("data", {}).get("accessToken")
        else:
            print("Failed to get fresh token")
            return
    except Exception as e:
        print(f"ERROR getting token: {e}")
        return
    
    # First get a plant ID
    headers = {"Authorization": f"Bearer {token}"}
    try:
        response = requests.get(f"{API_URL}/plants", headers=headers, verify=False)
        if response.status_code == 200:
            plants = response.json().get("data", [])
            if plants:
                plant_id = plants[0].get("_id")
                print(f"Using plant: {plant_id}")
            else:
                print("No plants found - skipping plant association")
                plant_id = None
        else:
            print(f"Error getting plants: {response.status_code}")
            return
    except Exception as e:
        print(f"ERROR: {e}")
        return
    
    sample_path = None
    test_dir = "ml/dataset/processed/test"
    if os.path.exists(test_dir):
        for root, dirs, files in os.walk(test_dir):
            for f in files:
                if f.lower().endswith(('.jpg', '.jpeg', '.png')):
                    sample_path = os.path.join(root, f)
                    break
            if sample_path:
                break
    
    if not sample_path or not os.path.exists(sample_path):
        print("ERROR: No sample image found")
        return
    
    try:
        with open(sample_path, "rb") as f:
            files = {"image": ("test.jpg", f, "image/jpeg")}
            data = {}
            if plant_id:
                data["plantId"] = plant_id
            response = requests.post(
                f"{API_URL}/diagnosis/diagnose",
                files=files,
                data=data,
                headers=headers,
                timeout=60,
                verify=False
            )
        
        print(f"Status: {response.status_code}")
        result = response.json()
        
        if result.get("success"):
            diagnosis = result.get("data", {})
            print(f"Disease: {diagnosis.get('disease')}")
            print(f"Confidence: {diagnosis.get('confidence', 0) * 100:.2f}%")
            print(f"Risk Level: {diagnosis.get('riskLevel')}")
            print(f"Image URL: {diagnosis.get('imageStoragePath')}")
        else:
            print(f"Error: {result.get('error')}")
            
    except Exception as e:
        print(f"ERROR: {e}")

def test_telemetry(token):
    """Test telemetry endpoint"""
    print(f"\n{'='*60}")
    print(f"Testing Telemetry Endpoint")
    print('='*60)
    
    # Get fresh token
    login_data = {
        "username": "admin",
        "email": "admin@agritwin.local",
        "password": "Admin@123"
    }
    try:
        login_response = requests.post(f"{API_URL}/auth/login", json=login_data)
        if login_response.status_code == 200:
            token = login_response.json().get("data", {}).get("accessToken")
        else:
            print("Failed to get fresh token")
            return
    except Exception as e:
        print(f"ERROR getting token: {e}")
        return
    
    # Get a plant ID first
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{API_URL}/plants", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            plants = data.get("data", [])
            if plants:
                plant_id = plants[0].get("_id")
                print(f"Using plant: {plant_id}")
            else:
                print("No plants found - skipping telemetry test")
                return
        else:
            print(f"Error getting plants: {response.status_code}")
            return
    except Exception as e:
        print(f"ERROR: {e}")
        return
    
    # Submit telemetry
    data = {
        "plantId": plant_id,
        "sensorType": "temperature",
        "value": 28.5
    }
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(f"{API_URL}/telemetry", json=data, headers=headers)
        print(f"Status: {response.status_code}")
        
        if response.status_code in [200, 201]:
            print(f"Response: {response.json()}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"ERROR: {e}")

def main():
    print("\n")
    print("="*60)
    print("AGRITWIN INTEGRATION TEST")
    print("="*60)
    
    # Test ML Service
    ml_ok = test_ml_health()
    if not ml_ok:
        print("\nWARNING: ML Service not running. Start with:")
        print("   cd ml")
        print("   python -m ml.inference.app")
        return
    
    test_ml_predict()
    
    # Test Backend
    backend_ok = test_backend_health()
    if not backend_ok:
        print("\nWARNING: Backend not running. Start with:")
        print("   cd backend")
        print("   npm run dev")
        return
    
    # Test with authentication
    token = test_auth_login()
    if not token:
        print("\nWARNING: Login failed. Check admin credentials.")
        return
    
    test_diagnosis(token)
    test_telemetry(token)
    
    print("\n" + "="*60)
    print("INTEGRATION TEST COMPLETE")
    print("="*60)

if __name__ == "__main__":
    main()
