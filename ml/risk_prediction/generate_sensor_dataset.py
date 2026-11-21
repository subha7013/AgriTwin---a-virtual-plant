import os
import numpy as np
import pandas as pd
from datetime import datetime, timedelta

def generate_iot_sensor_data(n_samples=2500, output_csv="ml/risk_prediction/sensor_dataset.csv", seed=42):
    """
    Generates synthetic agricultural time-series sensor data mimicking ESP32 readings:
    - DHT22 (Temperature, Relative Humidity)
    - Capacitive Soil Moisture Sensor
    - Leaf Wetness Grid Sensor
    Calculates epidemiological fungal/bacterial disease favourability risk.
    """
    os.makedirs(os.path.dirname(output_csv), exist_ok=True)
    np.random.seed(seed)
    
    start_time = datetime(2026, 6, 1, 0, 0, 0)
    timestamps = [start_time + timedelta(hours=i) for i in range(n_samples)]
    
    # Diurnal temperature cycle: coolest before dawn (5 AM), hottest at 2 PM
    hours = np.array([t.hour for t in timestamps])
    diurnal_temp = 24.0 + 8.0 * np.sin((hours - 8) * np.pi / 12) + np.random.normal(0, 2.0, n_samples)
    temperature_c = np.clip(diurnal_temp, 14.0, 39.0)
    
    # Humidity inversely related to temp, with rain/condensation spells
    base_humidity = 80.0 - 0.7 * (temperature_c - 20.0) + np.random.normal(0, 5.0, n_samples)
    humidity_pct = np.clip(base_humidity, 35.0, 99.0)
    
    # Soil moisture (gradual dry-down with periodic irrigation spikes)
    soil_moisture = np.zeros(n_samples)
    current_soil = 75.0
    for i in range(n_samples):
        if i % 36 == 0: # Irrigation event every 1.5 days
            current_soil = np.random.uniform(78.0, 92.0)
        else:
            current_soil -= np.random.uniform(0.2, 0.8)
        soil_moisture[i] = np.clip(current_soil, 25.0, 95.0)
        
    # Leaf wetness (dew formation when humidity > 85% or during rain)
    leaf_wetness_pct = np.where(humidity_pct > 82.0, np.minimum(100.0, (humidity_pct - 80) * 5 + np.random.normal(0, 5, n_samples)), np.random.uniform(0, 15, n_samples))
    leaf_wetness_pct = np.clip(leaf_wetness_pct, 0.0, 100.0)
    
    df = pd.DataFrame({
        "timestamp": [t.isoformat() for t in timestamps],
        "temperature_c": np.round(temperature_c, 2),
        "relative_humidity_pct": np.round(humidity_pct, 2),
        "soil_moisture_pct": np.round(soil_moisture, 2),
        "leaf_wetness_pct": np.round(leaf_wetness_pct, 2)
    })
    
    # Compute rolling temporal features
    df["humidity_6h_avg"] = df["relative_humidity_pct"].rolling(window=6, min_periods=1).mean().round(2)
    df["temp_6h_std"] = df["temperature_c"].rolling(window=6, min_periods=1).std().fillna(0).round(2)
    df["leaf_wetness_hours_last_12h"] = (df["leaf_wetness_pct"] > 60).rolling(window=12, min_periods=1).sum()
    
    # Agronomic disease risk assessment ground truth:
    # Tomato late blight & early blight favor: Temp 18-26°C, RH > 80%, extended leaf wetness > 4h
    temp_factor = np.where((df["temperature_c"] >= 18) & (df["temperature_c"] <= 27), 0.9, 0.3)
    risk_score = (
        0.35 * (df["relative_humidity_pct"] / 100.0) +
        0.35 * (df["leaf_wetness_pct"] / 100.0) +
        0.15 * (df["leaf_wetness_hours_last_12h"] / 12.0) +
        0.15 * temp_factor
    )
    
    conditions = [
        risk_score < 0.38,
        (risk_score >= 0.38) & (risk_score < 0.58),
        risk_score >= 0.58
    ]
    choices = ["Low", "Moderate", "High"]
    df["risk_category"] = np.select(conditions, choices, default="Moderate")
    df["risk_score"] = np.round(risk_score, 4)
    
    df.to_csv(output_csv, index=False)
    print(f"[INFO] Generated synthetic IoT sensor dataset with {len(df)} rows at {output_csv}")
    print("Class distribution:\n", df["risk_category"].value_counts())
    return df

if __name__ == "__main__":
    generate_iot_sensor_data()
