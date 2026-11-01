"""
TrustChain AI - Synthetic Document Dataset Generator
Generates legitimate credential representations and controlled altered variants
for machine learning training, anomaly detection validation, and evaluation.
Labels and controlled alteration metadata are strictly tracked.
"""

import random
from typing import List, Dict, Any, Tuple
import numpy as np


class SyntheticDocumentGenerator:
    """
    Produces paired datasets of legitimate credential representations and
    controlled synthetic alterations for training interpretable ML classifiers.
    """

    UNIVERSITIES = [
        "Stanford University",
        "Massachusetts Institute of Technology",
        "University of Oxford",
        "University of Cambridge",
        "Indian Institute of Technology Bombay",
        "University of Delhi",
        "National University of Singapore",
        "ETH Zurich"
    ]

    COMPANIES = [
        "Google Cloud AI Labs",
        "Microsoft Research",
        "Amazon Web Services",
        "OpenAI Systems",
        "NVIDIA Enterprise Solutions",
        "Meta Platforms Inc."
    ]

    DEGREES = [
        "Bachelor of Science in Computer Science",
        "Master of Science in Artificial Intelligence",
        "Bachelor of Technology in Information Technology",
        "Master of Business Administration",
        "Doctor of Philosophy in Computer Science"
    ]

    NAMES = [
        "Alexander Vance", "Elena Rostova", "Marcus Chen", "Priya Sharma",
        "Liam O'Connor", "Sophia Al-Mansoor", "David Kim", "Amara Okafor",
        "Lucas Silva", "Hannah Abbott", "Rohan Mehta", "Zoe Deschanel"
    ]

    def __init__(self, seed: int = 42):
        random.seed(seed)
        np.random.seed(seed)

    def generate_dataset(self, num_samples: int = 300) -> List[Dict[str, Any]]:
        """
        Generates a balanced dataset of legitimate (label=0) and
        controlled altered (label=1) credential records.
        """
        dataset = []
        half = num_samples // 2

        for i in range(half):
            legit = self._generate_legitimate_sample(i)
            dataset.append(legit)

        for i in range(half):
            altered = self._generate_altered_sample(i + half)
            dataset.append(altered)

        random.shuffle(dataset)
        return dataset

    def _generate_legitimate_sample(self, sample_id: int) -> Dict[str, Any]:
        """Generates legitimate document record with valid cross-field integrity."""
        category = random.choice([
            "Degree Certificate", "Marksheet / Transcript",
            "Internship Certificate", "Experience Letter", "Training Certificate"
        ])
        name = random.choice(self.NAMES)
        org = random.choice(self.UNIVERSITIES if "Degree" in category or "Mark" in category else self.COMPANIES)
        grad_year = random.randint(2018, 2025)
        issue_year = grad_year
        issue_month = random.randint(5, 9)
        issue_day = random.randint(1, 28)
        cert_id = f"TC-{random.randint(1000, 9999)}-{grad_year}"

        max_marks = 1000
        obtained_marks = random.randint(650, 980)
        percentage = round((obtained_marks / max_marks) * 100, 2)

        text = (
            f"This is to certify that {name} has fulfilled all institutional requirements "
            f"and is conferred the credential by {org}. "
            f"Certificate ID: {cert_id}. Issue Date: {issue_day:02d}/{issue_month:02d}/{issue_year}."
        )

        return {
            "sample_id": f"sample_legit_{sample_id:04d}",
            "label": 0,  # 0: Legitimate
            "category": category,
            "holder_name": name,
            "issuer": org,
            "issue_year": issue_year,
            "grad_year": grad_year,
            "certificate_id": cert_id,
            "text": text,
            "obtained_marks": obtained_marks,
            "maximum_marks": max_marks,
            "percentage": percentage,
            # Measurable physical characteristics
            "laplacian_variance": float(np.random.normal(280.0, 45.0)),
            "contrast_std": float(np.random.normal(62.0, 8.0)),
            "noise_residual": float(np.random.normal(4.5, 1.2)),
            "ela_mean_residual": float(np.random.normal(8.0, 2.0)),
            "ela_max_residual": float(np.random.normal(32.0, 6.0)),
            "alteration_type": "none",
            "is_altered": False
        }

    def _generate_altered_sample(self, sample_id: int) -> Dict[str, Any]:
        """Generates sample with controlled alterations and anomalies."""
        alteration = random.choice([
            "date_inconsistency",
            "marks_mismatch",
            "font_inconsistency",
            "tampered_ela_artifact",
            "invalid_id_format"
        ])

        name = random.choice(self.NAMES)
        org = random.choice(self.UNIVERSITIES)
        grad_year = random.randint(2018, 2024)
        cert_id = f"TC-{random.randint(1000, 9999)}-{grad_year}"

        issue_year = grad_year
        obtained_marks = 850
        max_marks = 1000
        percentage = 85.0
        ela_mean = float(np.random.normal(8.0, 2.0))
        ela_max = float(np.random.normal(32.0, 6.0))
        laplacian_var = float(np.random.normal(250.0, 40.0))

        if alteration == "date_inconsistency":
            # Issue date is 3 years BEFORE graduation date (impossible)
            issue_year = grad_year - 3
        elif alteration == "marks_mismatch":
            # Obtained 850/1000 but percentage manipulated to 98.5%
            percentage = 98.5
        elif alteration == "font_inconsistency":
            # Sharp local blur / splice boundary
            laplacian_var = float(np.random.normal(85.0, 15.0))
        elif alteration == "tampered_ela_artifact":
            # Local splice patch creates high compression discrepancy
            ela_mean = float(np.random.normal(28.0, 5.0))
            ela_max = float(np.random.normal(110.0, 15.0))
        elif alteration == "invalid_id_format":
            cert_id = "FAKE-ID-999999999-MODIFIED"

        text = (
            f"This is to certify that {name} has completed the requirements at {org}. "
            f"Certificate ID: {cert_id}. Issue Date: 15/06/{issue_year}. "
            f"Graduation: {grad_year}. Marks: {obtained_marks}/{max_marks} ({percentage}%)."
        )

        return {
            "sample_id": f"sample_alt_{sample_id:04d}",
            "label": 1,  # 1: Suspicious / Altered
            "category": "Degree Certificate",
            "holder_name": name,
            "issuer": org,
            "issue_year": issue_year,
            "grad_year": grad_year,
            "certificate_id": cert_id,
            "text": text,
            "obtained_marks": obtained_marks,
            "maximum_marks": max_marks,
            "percentage": percentage,
            "laplacian_variance": laplacian_var,
            "contrast_std": float(np.random.normal(55.0, 10.0)),
            "noise_residual": float(np.random.normal(8.0, 2.5)),
            "ela_mean_residual": ela_mean,
            "ela_max_residual": ela_max,
            "alteration_type": alteration,
            "is_altered": True
        }


# Global singleton
synthetic_generator = SyntheticDocumentGenerator()
