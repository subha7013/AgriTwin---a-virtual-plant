import os
import keras
from keras.callbacks import (
    EarlyStopping,
    ModelCheckpoint,
    ReduceLROnPlateau,
    CSVLogger
)

def get_callbacks(model_name="model", checkpoint_dir="ml/models", log_dir="ml/training/logs"):
    """
    Returns standardized production callbacks for AgriTwin DL model training:
    - ModelCheckpoint (saves best model in .keras format based on val_loss)
    - EarlyStopping (restores best weights)
    - ReduceLROnPlateau (halves lr when progress stagnates)
    - CSVLogger (stores epoch-by-epoch history for evaluation and plots)
    """
    os.makedirs(checkpoint_dir, exist_ok=True)
    os.makedirs(log_dir, exist_ok=True)

    checkpoint_path = os.path.join(checkpoint_dir, f"{model_name}.keras")
    csv_log_path = os.path.join(log_dir, f"{model_name}_history.csv")

    callbacks = [
        ModelCheckpoint(
            filepath=checkpoint_path,
            monitor="val_loss",
            mode="min",
            save_best_only=True,
            verbose=1
        ),
        EarlyStopping(
            monitor="val_loss",
            mode="min",
            patience=5,
            restore_best_weights=True,
            verbose=1
        ),
        ReduceLROnPlateau(
            monitor="val_loss",
            mode="min",
            factor=0.3,
            patience=2,
            min_lr=1e-6,
            verbose=1
        ),
        CSVLogger(
            filename=csv_log_path,
            separator=",",
            append=False
        )
    ]
    return callbacks
