"""
AgriTwin live end-to-end test harness.
Tests the ML service and backend across every disease class and writes results to JSON.
Run: python run_tests.py
"""

import os
import sys
import json
import time
import datetime
import urllib3
import requests

urllib3.disable_warnings()

API_URL = os.getenv("API_URL", "http://localhost:5000/api/v1")
ML_URL = os.getenv("ML_SERVICE_URL", "http://localhost:8000")
DATASET_TEST = os.getenv("TEST_DIR", "ml/dataset/processed/test")
OUTPUT_JSON = os.getenv("OUTPUT_JSON", "test_results.json")

# Map class directory -> canonical display name from model metadata
with open("ml/models/class_names.json", "r", encoding="utf-8") as _f:
    _meta = json.load(_f)
DISPLAY_MAP = dict(zip(_meta["class_directories"], _meta["class_display_names"]))


def normalize(label):
    s = label.lower().replace("tomato", "").strip()
    s = s.replace("two-spotted", "two spotted").replace("two spotted spider mite", "spider mites")
    return "".join(ch for ch in s if ch.isalnum())

results = {
    "generated_at": datetime.datetime.now().isoformat(),
    "environment": {"backend": API_URL, "ml_service": ML_URL},
    "ml": {},
    "backend": {},
    "classes": [],
    "diagnosis_records": [],
    "telemetry": {},
    "pass_fail": {},
}


MAX_IMAGES_PER_CLASS = int(os.getenv("MAX_IMAGES_PER_CLASS", "5"))


def list_images(class_dir, limit=None):
    imgs = []
    for root, _, files in os.walk(class_dir):
        for f in sorted(files):
            if f.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
                imgs.append(os.path.join(root, f))
                if limit and len(imgs) >= limit:
                    return imgs
    return imgs


def first_image(class_dir):
    imgs = list_images(class_dir, limit=1)
    return imgs[0] if imgs else None


def timed(fn):
    start = time.time()
    out = fn()
    return out, round((time.time() - start) * 1000, 2)


def test_ml_health():
    def _call():
        r = requests.get(f"{ML_URL}/health", timeout=10)
        return {"status_code": r.status_code, "body": r.json()}

    out, ms = timed(_call)
    out["latency_ms"] = ms
    results["ml"]["health"] = out
    return out["status_code"] == 200


def test_ml_predict_class(class_name, image_path):
    def _call():
        with open(image_path, "rb") as f:
            r = requests.post(
                f"{ML_URL}/predict",
                files={"image": (os.path.basename(image_path), f, "image/jpeg")},
                timeout=120,
            )
        return {"status_code": r.status_code, "body": r.json()}

    out, ms = timed(_call)
    body = out["body"]
    predicted = body.get("disease", "")
    expected_label = DISPLAY_MAP.get(class_name, class_name.replace("Tomato___", ""))
    correct = normalize(predicted) == normalize(expected_label)
    return {
        "class_dir": class_name,
        "image": os.path.basename(image_path),
        "status_code": out["status_code"],
        "predicted": predicted,
        "expected": expected_label,
        "confidence": body.get("confidence"),
        "correct_class": correct,
        "latency_ms": ms,
        "top3": sorted(
            body.get("probabilities", {}).items(), key=lambda x: -x[1]
        )[:3],
    }


def login():
    def _call():
        r = requests.post(
            f"{API_URL}/auth/login",
            json={
                "username": "admin",
                "email": "admin@agritwin.local",
                "password": "Admin@123",
            },
            timeout=15,
            verify=False,
        )
        return {"status_code": r.status_code, "body": r.json()}

    out, ms = timed(_call)
    out["latency_ms"] = ms
    results["backend"]["login"] = {
        "status_code": out["status_code"],
        "latency_ms": ms,
        "success": out["body"].get("success"),
    }
    if out["status_code"] == 200:
        return out["body"]["data"]["accessToken"], out["body"]["data"]["user"]
    return None, None


def backend_health():
    def _call():
        r = requests.get(f"{API_URL}/health", timeout=10, verify=False)
        return {"status_code": r.status_code, "body": r.json()}

    out, ms = timed(_call)
    out["latency_ms"] = ms
    results["backend"]["health"] = out
    return out["status_code"] == 200


def get_plants(token):
    r = requests.get(
        f"{API_URL}/plants", headers={"Authorization": f"Bearer {token}"},
        timeout=15, verify=False,
    )
    if r.status_code == 200:
        data = r.json().get("data", {})
        # /plants returns {plants: [...], count: n}
        plants = data.get("plants", []) if isinstance(data, dict) else data
        return plants, r.status_code
    return [], r.status_code


def create_plant(token):
    body = {"name": "Test Tomato Plant", "species": "Tomato", "variety": "Roma"}
    r = requests.post(
        f"{API_URL}/plants",
        headers={"Authorization": f"Bearer {token}"},
        json=body, timeout=15, verify=False,
    )
    if r.status_code in (200, 201):
        return r.json().get("data", {}), r.status_code
    return {"error": r.text, "status": r.status_code}, r.status_code


def test_diagnosis(token, plant_id, class_name, image_path):
    def _call():
        with open(image_path, "rb") as f:
            data = {"plantId": plant_id} if plant_id else {}
            r = requests.post(
                f"{API_URL}/diagnosis/diagnose",
                headers={"Authorization": f"Bearer {token}"},
                files={"image": (os.path.basename(image_path), f, "image/jpeg")},
                data=data, timeout=120, verify=False,
            )
        return {"status_code": r.status_code, "body": r.json()}

    out, ms = timed(_call)
    body = out["body"]
    rec = {
        "class_dir": class_name,
        "status_code": out["status_code"],
        "success": body.get("success"),
        "latency_ms": ms,
    }
    if body.get("success"):
        d = body["data"]
        rec.update({
            "diagnosis_id": d.get("_id"),
            "disease": d.get("disease"),
            "confidence": d.get("confidence"),
            "risk_level": d.get("riskLevel"),
            "is_healthy": d.get("isHealthy"),
            "image_url": d.get("imageStoragePath"),
            "model": d.get("model"),
        })
        results["diagnosis_records"].append(rec)
    else:
        rec["error"] = body.get("error")
    return rec


def test_telemetry(token, plant_id):
    readings = [
        {"sensorType": "temperature", "value": 28.5},
        {"sensorType": "humidity", "value": 65},
        {"sensorType": "soil_moisture", "value": 45},
        {"sensorType": "temperature", "value": 41},  # triggers alert
    ]
    out = []
    for reading in readings:
        body = {"plantId": plant_id, **reading}
        r = requests.post(
            f"{API_URL}/telemetry",
            headers={"Authorization": f"Bearer {token}"},
            json=body, timeout=15, verify=False,
        )
        out.append({
            "sensorType": reading["sensorType"],
            "value": reading["value"],
            "status_code": r.status_code,
            "success": r.json().get("success") if r.headers.get("content-type", "").startswith("application/json") else None,
        })
    results["telemetry"]["submitted"] = out
    return out


def test_alerts(token):
    r = requests.get(
        f"{API_URL}/alerts",
        headers={"Authorization": f"Bearer {token}"},
        params={"limit": 10}, timeout=15, verify=False,
    )
    if r.status_code == 200:
        alerts = r.json().get("data", [])
        results["telemetry"]["alerts"] = {
            "status_code": r.status_code,
            "count": len(alerts),
            "sample": [
                {"title": a.get("title"), "type": a.get("type"),
                 "category": a.get("category"), "message": a.get("message")}
                for a in alerts[:5]
            ],
        }
    else:
        results["telemetry"]["alerts"] = {"status_code": r.status_code, "error": r.text}


def test_risk(token, plant_id, diagnosis_id):
    r = requests.post(
        f"{API_URL}/risk",
        headers={"Authorization": f"Bearer {token}"},
        json={"plantId": plant_id, "diagnosisId": diagnosis_id},
        timeout=15, verify=False,
    )
    if r.status_code in (200, 201):
        d = r.json().get("data", {})
        results["backend"]["risk"] = {
            "status_code": r.status_code,
            "risk_category": d.get("riskCategory"),
            "risk_score": d.get("riskScore"),
            "input_telemetry": d.get("inputTelemetry"),
            "recommendations": d.get("recommendations"),
        }
    else:
        results["backend"]["risk"] = {"status_code": r.status_code, "error": r.text}


def main():
    print("=" * 60)
    print("AGRITWIN LIVE END-TO-END TEST")
    print("=" * 60)
    print(f"Dataset: {DATASET_TEST} | max {MAX_IMAGES_PER_CLASS} images/class")
    results["dataset"] = DATASET_TEST
    results["max_images_per_class"] = MAX_IMAGES_PER_CLASS

    if not test_ml_health():
        print("FATAL: ML service unreachable")
        sys.exit(1)
    print("[1/7] ML health OK")

    classes = sorted(
        d for d in os.listdir(DATASET_TEST)
        if os.path.isdir(os.path.join(DATASET_TEST, d))
    )
    ml_image_results = []
    class_summary = []
    for cls in classes:
        imgs = list_images(os.path.join(DATASET_TEST, cls), limit=MAX_IMAGES_PER_CLASS)
        cls_results = []
        for img in imgs:
            res = test_ml_predict_class(cls, img)
            cls_results.append(res)
            ml_image_results.append(res)
        correct_n = sum(1 for r in cls_results if r["correct_class"])
        summary = {
            "class_dir": cls,
            "expected": DISPLAY_MAP.get(cls, cls),
            "samples": len(cls_results),
            "correct": correct_n,
            "accuracy": round(correct_n / len(cls_results), 3) if cls_results else 0,
            "predictions": [r["predicted"] for r in cls_results],
        }
        class_summary.append(summary)
        print(f"[2/7] ML {cls}: {correct_n}/{len(cls_results)} correct "
              f"({summary['accuracy'] * 100:.0f}%) -> {summary['predictions']}")
    results["classes"] = ml_image_results
    results["class_summary"] = class_summary

    if not backend_health():
        print("FATAL: backend unreachable")
        sys.exit(1)
    print("[3/7] Backend health OK")

    token, user = login()
    if not token:
        print("FATAL: login failed")
        sys.exit(1)
    print(f"[4/7] Login OK user={user.get('username')}")

    plants, status = get_plants(token)
    if not plants:
        plant, cstatus = create_plant(token)
        plant_id = plant.get("_id") or plant.get("id")
        print(f"[5/7] Created plant status={cstatus} id={plant_id}")
    else:
        plant_id = plants[0].get("_id")
        print(f"[5/7] Using existing plant id={plant_id}")

    diag_results = []
    for cls in classes:
        img = first_image(os.path.join(DATASET_TEST, cls))
        if not img:
            continue
        rec = test_diagnosis(token, plant_id, cls, img)
        diag_results.append(rec)
        print(f"[6/7] Diagnose {cls}: status={rec['status_code']} "
              f"disease={rec.get('disease')} risk={rec.get('risk_level')}")

    test_telemetry(token, plant_id)
    test_alerts(token)
    if diag_results:
        first_ok = next((r for r in diag_results if r.get("diagnosis_id")), None)
        if first_ok:
            test_risk(token, plant_id, first_ok["diagnosis_id"])
    print("[7/7] Telemetry + alerts + risk done")

    # summary
    diag_ok = sum(1 for r in diag_results if r.get("success"))
    ml_ok = sum(1 for r in ml_image_results if r["status_code"] == 200)
    ml_correct = sum(1 for r in ml_image_results if r.get("correct_class"))
    results["pass_fail"] = {
        "ml_classes_tested": len(classes),
        "ml_images_tested": len(ml_image_results),
        "ml_predict_success": ml_ok,
        "ml_images_correct": ml_correct,
        "ml_accuracy": round(ml_correct / len(ml_image_results), 4) if ml_image_results else 0,
        "diagnosis_tested": len(diag_results),
        "diagnosis_success": diag_ok,
        "diagnosis_success_rate": round(diag_ok / len(diag_results), 4) if diag_results else 0,
        "telemetry_submitted": len(results["telemetry"]["submitted"]),
        "alerts_generated": results["telemetry"].get("alerts", {}).get("count", 0),
    }

    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, default=str)

    print("=" * 60)
    print(json.dumps(results["pass_fail"], indent=2))
    print(f"Results written to {OUTPUT_JSON}")
    print("=" * 60)


if __name__ == "__main__":
    main()