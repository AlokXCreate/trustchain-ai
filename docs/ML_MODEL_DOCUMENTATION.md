# TrustChain AI — Machine Learning Model Documentation

## 1. Overview
TrustChain AI incorporates an interpretable, reproducible machine learning architecture located in `backend/ml/`. All models are serialized via `joblib` into `backend/ml/models/` and loaded dynamically by the FastAPI runtime.

---

## 2. Models Overview

| Model Identifier | Algorithm | Purpose | Target Output |
| :--- | :--- | :--- | :--- |
| **TrustChain-TFIDF-v2.0** | TF-IDF (1,2) + LogisticRegression | Document Classification | Category probability distribution |
| **TrustChain-RF-v2.1** | Balanced Random Forest (100 trees, depth 6) | Anomaly / Fraud Pattern Detection | Anomaly likelihood (0.0 to 1.0) |
| **TrustChain-IForest-v1.5** | Isolation Forest (100 trees, contamination 0.10) | Unsupervised Statistical Outlier Scoring | Normality score and outlier indicator |

---

## 3. Training & Validation Strategy

1. **Class Balancing**: Balanced sample weights prevent bias towards dominant credential categories.
2. **5-Fold Stratified Cross-Validation**: Validates that models generalize across diverse credential layouts.
3. **Reproducibility**: Seeded random states ensure deterministic model weights across environments.
4. **Transparent Benchmarking**: Real precision, recall, and confusion matrix are saved directly into the model bundle and exposed via `/api/v1/ai/models/metrics`.

---

## 4. Execution Commands

To retrain and serialize all models:
```bash
cd backend
.venv\Scripts\python.exe ml\scripts\train_and_save.py
```

To run model evaluation benchmarks:
```bash
.venv\Scripts\python.exe -c "from ml.evaluation.evaluate import model_evaluator; print(model_evaluator.evaluate_fraud_model())"
```
