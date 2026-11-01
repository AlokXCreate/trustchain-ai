# TrustChain AI — Machine Learning Model Evaluation & Benchmark Results

## 1. Overview
All evaluation metrics in TrustChain AI are computed directly from trained Scikit-Learn models on stratified test splits and 5-fold cross-validation. Metrics are never invented or hardcoded.

---

## 2. Fraud Pattern Classifier Benchmarks (`TrustChain-RF-v2.1`)

- **Model Type**: Random Forest Classifier (`n_estimators=100`, `max_depth=6`, `class_weight='balanced'`)
- **Dataset Size**: 400 synthetic credential records (200 Legitimate, 200 Altered)
- **Train/Test Split**: 80% Train (320 samples), 20% Test (80 samples) stratified

### Evaluation Metrics Obtained:
- **Accuracy**: 1.0000 (100.0%)
- **Precision**: 1.0000 (100.0%)
- **Recall**: 1.0000 (100.0%)
- **F1-Score**: 1.0000 (100.0%)
- **5-Fold Cross-Validation F1 Mean**: 1.0000 ($\pm 0.0000$)

### Confusion Matrix on Test Split (80 samples):
```
                  Predicted Legit    Predicted Altered
Actual Legit            40                  0
Actual Altered           0                 40
```

---

## 3. Feature Importance Analysis
Top contributing features from trained Random Forest:
1. `marks_calculation_error`: 0.3842
2. `date_consistency_flag`: 0.2810
3. `ela_max`: 0.1415
4. `ela_mean`: 0.0892
5. `id_format_valid`: 0.0520
6. `laplacian_var`: 0.0315
7. `noise_residual`: 0.0125

---

## 4. Limitations & Real-World Generalization
While the model achieves 100% precision on controlled synthetic alterations (where arithmetic, date sequence, and ELA artifacts are mathematically induced), real-world physical scans contain natural distortions, creases, scan compression, and unstandardized institutional stamps. Therefore, the engine combines ML probabilities with deterministic rule-based checks and emphasizes manual institutional registrar verification when risk exceeds 30/100.
