# AgriTwin---a-virtual-plant

Key Commands Quick Reference
Action	Terminal Command
Train Custom CNN	python ml/training/train_cnn.py
Train MobileNetV2	python ml/training/train_mobilenet.py
Train Risk Engine	python ml/risk_prediction/train_risk_model.py
Evaluate Both Models	python ml/evaluation/evaluate_model.py
Test MobileNetV2 on an Image	python ml/inference/predict.py --image "path/to/leaf.jpg" --model mobilenetv2
Test Custom CNN on an Image	python ml/inference/predict.py --image "path/to/leaf.jpg" --model custom_cnn
Test Ensemble on an Image	python ml/inference/predict.py --image "path/to/leaf.jpg" --model ensemble
Test on a Random Leaf	python ml/inference/predict.py
Launch Jupyter Notebooks	jupyter notebook ml/notebooks