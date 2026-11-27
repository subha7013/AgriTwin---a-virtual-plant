import numpy as np
import pandas as pd

FEATURE_COLUMNS = [
    "temperature_c",
    "relative_humidity_pct",
    "soil_moisture_pct",
    "leaf_wetness_pct",
    "humidity_6h_avg",
    "temp_6h_std",
    "leaf_wetness_hours_last_12h"
]

def extract_features(df):
    """
    Computes real-time and historical rolling features from raw sensor readings.
    """
    df = df.copy()
    if "relative_humidity_pct" in df.columns:
        if "humidity_6h_avg" not in df.columns:
            df["humidity_6h_avg"] = df["relative_humidity_pct"].rolling(window=6, min_periods=1).mean()
    if "temperature_c" in df.columns:
        if "temp_6h_std" not in df.columns:
            df["temp_6h_std"] = df["temperature_c"].rolling(window=6, min_periods=1).std().fillna(0)
    if "leaf_wetness_pct" in df.columns:
        if "leaf_wetness_hours_last_12h" not in df.columns:
            df["leaf_wetness_hours_last_12h"] = (df["leaf_wetness_pct"] > 60).rolling(window=12, min_periods=1).sum()
            
    return df[FEATURE_COLUMNS]

def engineer_single_reading(current_reading, recent_history_df=None):
    """
    Engineers a feature vector for a single live IoT reading from ESP32.
    """
    if recent_history_df is not None and len(recent_history_df) > 0:
        history = recent_history_df.tail(12).copy()
        combined = pd.concat([history, pd.DataFrame([current_reading])], ignore_index=True)
        features = extract_features(combined).iloc[[-1]]
    else:
        # Fallback if no history exists yet
        rec = dict(current_reading)
        rec["humidity_6h_avg"] = rec.get("relative_humidity_pct", 70.0)
        rec["temp_6h_std"] = 1.5
        rec["leaf_wetness_hours_last_12h"] = 1 if rec.get("leaf_wetness_pct", 0) > 60 else 0
        features = pd.DataFrame([rec])[FEATURE_COLUMNS]
        
    return features
