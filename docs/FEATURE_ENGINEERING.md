# TrustChain AI — Feature Engineering Specification

## 1. Overview
TrustChain AI projects heterogeneous document attributes into a standardized 14-dimensional numerical feature vector ($X \in \mathbb{R}^{14}$). This mapping is implemented in `backend/ml/feature_extraction/feature_extractor.py`.

---

## 2. Feature Vector Schema

| Index | Feature Name | Description | Type | Normal Baseline |
| :--- | :--- | :--- | :--- | :--- |
| `0` | `text_len` | Total character count of extracted OCR text | Float | 300 – 2500 |
| `1` | `word_count` | Total word token count | Float | 50 – 450 |
| `2` | `digit_ratio` | Ratio of numerical digits to total characters | Float [0, 1] | 0.05 – 0.20 |
| `3` | `upper_ratio` | Ratio of uppercase characters | Float [0, 1] | 0.08 – 0.30 |
| `4` | `ocr_confidence` | Average OCR block confidence | Float [0, 1] | 0.85 – 0.99 |
| `5` | `laplacian_var` | Image blur metric (Variance of the Laplacian) | Float | > 100.0 |
| `6` | `contrast_std` | Standard deviation of pixel intensities | Float | 40.0 – 85.0 |
| `7` | `noise_residual` | High-frequency residual from median filter | Float | 2.0 – 8.0 |
| `8` | `ela_mean` | Error Level Analysis mean pixel residual | Float | 5.0 – 14.0 |
| `9` | `ela_max` | Error Level Analysis maximum peak residual | Float | 20.0 – 45.0 |
| `10` | `date_consistency_flag` | 1.0 if issue date $\ge$ graduation date; 0.0 if inverted | Binary [0, 1] | 1.0 |
| `11` | `marks_calculation_error` | Absolute difference between calculated and stated percentage | Float | 0.0 |
| `12` | `id_format_valid` | Adherence to standard credential syntax regex | Binary [0, 1] | 1.0 |
| `13` | `suspicious_metadata_flag` | 1.0 if graphic editor tool signature detected in EXIF/PDF | Binary [0, 1] | 0.0 |

---

## 3. Normalization & Scalability
The feature extractor operates on both single inference samples and batch arrays (`extract_batch`), outputting clean `np.float32` arrays ready for Scikit-Learn models.
