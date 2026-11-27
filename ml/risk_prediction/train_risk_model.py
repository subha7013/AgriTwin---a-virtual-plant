import os
import json
import joblib
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix

from generate_sensor_dataset import generate_iot_sensor_data
from feature_engineering import extract_features, FEATURE_COLUMNS

def train_environmental_risk_engine(
    dataset_path="ml/risk_prediction/sensor_dataset.csv",
    model_output_path="ml/risk_prediction/risk_model.joblib"
):
    print("="*60)
    print("TRAINING STAGE 12: ENVIRONMENTAL RISK PREDICTION ENGINE")
    print("="*60)
    
    if not os.path.exists(dataset_path):
        print(f"[INFO] {dataset_path} not found. Generating sensor dataset...")
        generate_iot_sensor_data(output_csv=dataset_path)
        
    df = pd.read_csv(dataset_path)
    X = extract_features(df)
    y = df["risk_category"]
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    
    print(f"[INFO] Training samples: {len(X_train)} | Test samples: {len(X_test)}")
    
    # 1. Baseline Logistic Regression
    lr_pipeline = Pipeline([
        ("scaler", StandardScaler()),
        ("classifier", LogisticRegression(max_iter=500, random_state=42))
    ])
    lr_pipeline.fit(X_train, y_train)
    lr_preds = lr_pipeline.predict(X_test)
    lr_acc = accuracy_score(y_test, lr_preds)
    print(f"\n[BASELINE] Logistic Regression Accuracy: {lr_acc:.4f}")
    
    # 2. Main Random Forest Classifier
    rf_classifier = RandomForestClassifier(
        n_estimators=100,
        max_depth=8,
        min_samples_split=4,
        random_state=42
    )
    rf_classifier.fit(X_train, y_train)
    rf_preds = rf_classifier.predict(X_test)
    rf_acc = accuracy_score(y_test, rf_preds)
    print(f"[CANDIDATE] Random Forest Accuracy: {rf_acc:.4f}")
    
    print("\nRandom Forest Classification Report:")
    report = classification_report(y_test, rf_preds, digits=4)
    print(report)
    
    # Feature Importances
    importances = rf_classifier.feature_importances_
    feat_df = pd.DataFrame({
        "Feature": FEATURE_COLUMNS,
        "Importance": importances
    }).sort_values(by="Importance", ascending=False)
    
    print("\nTop Contributing Risk Factors (Feature Importance):")
    print(feat_df.to_string(index=False))
    
    # Save Feature Importance Plot
    os.makedirs("ml/evaluation/results", exist_ok=True)
    plt.figure(figsize=(10, 5))
    sns.barplot(data=feat_df, x="Importance", y="Feature", hue="Feature", palette="viridis", legend=False)
    plt.title("Environmental Risk Engine - Feature Importance (Random Forest)", fontsize=13, fontweight="bold")
    plt.xlabel("Gini Importance")
    plt.ylabel("IoT Sensor Feature")
    plt.tight_layout()
    plt.savefig("ml/evaluation/results/risk_model_feature_importance.png", dpi=300)
    plt.close()
    
    # Save serialized model artifact
    model_bundle = {
        "model": rf_classifier,
        "feature_names": FEATURE_COLUMNS,
        "classes": list(rf_classifier.classes_),
        "version": "1.0",
        "algorithm": "RandomForestClassifier",
        "test_accuracy": float(rf_acc)
    }
    os.makedirs(os.path.dirname(model_output_path), exist_ok=True)
    joblib.dump(model_bundle, model_output_path)
    print(f"\n[INFO] Serialized risk model saved to {model_output_path}")
    
    # Save metrics JSON
    metrics = {
        "algorithm": "Random Forest",
        "accuracy": float(rf_acc),
        "baseline_lr_accuracy": float(lr_acc),
        "feature_importances": feat_df.to_dict(orient="records"),
        "classes": list(rf_classifier.classes_)
    }
    with open("ml/evaluation/results/risk_model_metrics.json", "w") as f:
        json.dump(metrics, f, indent=2)
        
    return model_bundle

if __name__ == "__main__":
    train_environmental_risk_engine()
