import os
import sys
import json
import argparse
import joblib
import pandas as pd
import numpy as np

sys.path.append(os.path.dirname(__file__))
from feature_engineering import FEATURE_COLUMNS, engineer_single_reading

_MODEL_CACHE = None

def get_risk_model():
    global _MODEL_CACHE
    if _MODEL_CACHE is None:
        model_path = os.path.join(os.path.dirname(__file__), "risk_model.joblib")
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Risk model not found at {model_path}")
        _MODEL_CACHE = joblib.load(model_path)
    return _MODEL_CACHE

def evaluate_disease_risk(temperature=26.0, humidity=80.0, soil_moisture=45.0, leaf_wetness=70.0):
    """
    Evaluates environmental microclimatic risk for tomato disease outbreaks.
    """
    risk_dict = get_risk_model()
    model = risk_dict["model"]
    classes = list(risk_dict["classes"])
    
    current_reading = {
        "temperature_c": float(temperature),
        "relative_humidity_pct": float(humidity),
        "soil_moisture_pct": float(soil_moisture),
        "leaf_wetness_pct": float(leaf_wetness)
    }
    
    features = engineer_single_reading(current_reading)
    prediction = model.predict(features)[0]
    probabilities = model.predict_proba(features)[0]
    
    prob_map = {classes[i]: round(float(probabilities[i]), 4) for i in range(len(classes))}
    
    # Calculate continuous 0-100 risk score
    # High: 1.0, Moderate: 0.5, Low: 0.1
    high_p = prob_map.get("High", 0.0)
    mod_p = prob_map.get("Moderate", 0.0)
    low_p = prob_map.get("Low", 0.0)
    risk_score = int(round((high_p * 100.0) + (mod_p * 55.0) + (low_p * 15.0)))
    risk_score = max(5, min(99, risk_score))
    
    # Identify stress factors
    factors = []
    if temperature > 30:
        factors.append({"name": "High Temperature", "value": f"{temperature:.1f}°C", "severity": "High", "desc": "Accelerates fungal spore germination and thermal stress"})
    elif temperature < 15:
        factors.append({"name": "Cold Stress", "value": f"{temperature:.1f}°C", "severity": "Moderate", "desc": "Slows metabolism and increases susceptibility to blight"})
    else:
        factors.append({"name": "Temperature", "value": f"{temperature:.1f}°C", "severity": "Optimal", "desc": "Within normal growth range"})

    if humidity > 80:
        factors.append({"name": "High Humidity", "value": f"{humidity:.1f}%", "severity": "High", "desc": "Critically elevated moisture favours leaf mold and late blight"})
    elif humidity < 40:
        factors.append({"name": "Low Humidity", "value": f"{humidity:.1f}%", "severity": "Moderate", "desc": "Favours two-spotted spider mite outbreaks"})
    else:
        factors.append({"name": "Humidity", "value": f"{humidity:.1f}%", "severity": "Optimal", "desc": "Normal transpiration levels"})

    if leaf_wetness > 65:
        factors.append({"name": "Leaf Wetness", "value": f"{leaf_wetness:.1f}%", "severity": "High", "desc": "Prolonged leaf wetness enables bacterial and fungal penetration"})
    else:
        factors.append({"name": "Leaf Wetness", "value": f"{leaf_wetness:.1f}%", "severity": "Low", "desc": "Dry foliage limits pathogen motility"})

    if soil_moisture < 30:
        factors.append({"name": "Soil Moisture", "value": f"{soil_moisture:.1f}%", "severity": "Moderate", "desc": "Under-watering stress induces blossom end rot and leaf wilt"})
    elif soil_moisture > 75:
        factors.append({"name": "Soil Moisture", "value": f"{soil_moisture:.1f}%", "severity": "High", "desc": "Waterlogged roots promote root rot and bacterial pathogens"})
    else:
        factors.append({"name": "Soil Moisture", "value": f"{soil_moisture:.1f}%", "severity": "Optimal", "desc": "Balanced root moisture"})

    # Actionable agronomic recommendations
    recommendations = []
    if prediction == "High" or risk_score >= 65:
        recommendations.append("Increase ventilation to reduce relative humidity below 75%.")
        recommendations.append("Avoid overhead spraying; ensure leaves dry before nightfall.")
        recommendations.append("Inspect lower canopy leaves for early blight and bacterial lesions.")
    elif prediction == "Moderate" or risk_score >= 40:
        recommendations.append("Monitor temperature fluctuations and maintain consistent air flow.")
        recommendations.append("Check soil moisture before scheduled irrigation.")
    else:
        recommendations.append("Environmental parameters are optimal. Maintain standard greenhouse schedule.")

    return {
        "success": True,
        "risk_category": f"{prediction} Risk",
        "risk_score": risk_score,
        "probabilities": prob_map,
        "input_telemetry": current_reading,
        "factors": factors,
        "recommendations": recommendations
    }

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="AgriTwin Environmental Risk Inference")
    parser.add_argument("--temp", type=float, default=26.0, help="Temperature in °C")
    parser.add_argument("--humidity", type=float, default=80.0, help="Relative humidity %")
    parser.add_argument("--soil", type=float, default=45.0, help="Soil moisture %")
    parser.add_argument("--wetness", type=float, default=70.0, help="Leaf wetness %")
    parser.add_argument("--json", action="store_true", help="Output pure JSON")
    args = parser.parse_args()

    result = evaluate_disease_risk(
        temperature=args.temp,
        humidity=args.humidity,
        soil_moisture=args.soil,
        leaf_wetness=args.wetness
    )
    print(json.dumps(result, indent=2))
