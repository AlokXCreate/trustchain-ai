"""
TrustChain AI - Numerical Feature Extraction Engine
Extracts fixed-dimensional feature vectors spanning:
- Text & typographical distributions
- Measurable computer vision & quality metrics
- Error Level Analysis (ELA) compression characteristics
- Cross-field mathematical consistency
- Document metadata flags
"""

import re
from typing import Dict, Any, List
import numpy as np


class DocumentFeatureExtractor:
    """
    Transforms raw document analysis dictionaries or synthetic records
    into standardized numerical feature vectors for ML inference and training.
    """

    FEATURE_NAMES = [
        "text_len",
        "word_count",
        "digit_ratio",
        "upper_ratio",
        "ocr_confidence",
        "laplacian_var",
        "contrast_std",
        "noise_residual",
        "ela_mean",
        "ela_max",
        "date_consistency_flag",
        "marks_calculation_error",
        "id_format_valid",
        "suspicious_metadata_flag"
    ]

    def extract_features(self, sample: Dict[str, Any]) -> np.ndarray:
        """
        Extracts 14-dimensional numerical feature vector from document sample or analysis pipeline data.
        """
        text = sample.get("text", "") or ""
        text_len = float(len(text))
        words = text.split()
        word_count = float(len(words))

        digit_count = sum(1 for c in text if c.isdigit())
        digit_ratio = (digit_count / text_len) if text_len > 0 else 0.0

        upper_count = sum(1 for c in text if c.isupper())
        upper_ratio = (upper_count / text_len) if text_len > 0 else 0.0

        ocr_confidence = float(sample.get("ocr_confidence", 0.92))

        laplacian_var = float(sample.get("laplacian_variance", 260.0))
        contrast_std = float(sample.get("contrast_std", 60.0))
        noise_residual = float(sample.get("noise_residual", 5.0))
        ela_mean = float(sample.get("ela_mean_residual", 8.0))
        ela_max = float(sample.get("ela_max_residual", 30.0))

        # Cross-field consistency
        issue_year = sample.get("issue_year")
        grad_year = sample.get("grad_year")
        date_flag = 1.0  # 1.0: consistent, 0.0: inconsistent
        if issue_year is not None and grad_year is not None:
            if issue_year < grad_year:
                date_flag = 0.0

        # Marks calculation error
        obtained = sample.get("obtained_marks")
        maximum = sample.get("maximum_marks")
        percentage = sample.get("percentage")
        marks_error = 0.0
        if obtained is not None and maximum is not None and percentage is not None and maximum > 0:
            expected_pct = (obtained / maximum) * 100.0
            marks_error = abs(expected_pct - percentage)

        # ID Format validity
        cert_id = sample.get("certificate_id", "") or ""
        valid_id_flag = 1.0
        if "FAKE" in cert_id or "MODIFIED" in cert_id or (len(cert_id) > 0 and len(cert_id) < 5):
            valid_id_flag = 0.0

        suspicious_meta = float(1.0 if sample.get("suspicious_metadata") else 0.0)

        feature_vector = np.array([
            text_len,
            word_count,
            digit_ratio,
            upper_ratio,
            ocr_confidence,
            laplacian_var,
            contrast_std,
            noise_residual,
            ela_mean,
            ela_max,
            date_flag,
            marks_error,
            valid_id_flag,
            suspicious_meta
        ], dtype=np.float32)

        return feature_vector

    def extract_batch(self, samples: List[Dict[str, Any]]) -> np.ndarray:
        """Extracts matrix of feature vectors (N, 14)."""
        return np.vstack([self.extract_features(s) for s in samples])


# Global singleton
feature_extractor = DocumentFeatureExtractor()
