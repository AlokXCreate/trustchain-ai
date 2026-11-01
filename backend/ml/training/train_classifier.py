"""
TrustChain AI - ML Training Pipeline
Trains:
1. Document Type Classifier (TF-IDF + LogisticRegression)
2. Document Fraud / Anomaly Detection Model (Random Forest + Isolation Forest)
Saves models, scalers, and real evaluation metrics.
"""

import os
from typing import Dict, Any, Tuple
import numpy as np
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, IsolationForest
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import (
    precision_score, recall_score, f1_score, confusion_matrix, accuracy_score
)
from app.services.ai.document_classification_service import DocumentClassificationService
from ml.datasets.synthetic_generator import synthetic_generator
from ml.feature_extraction.feature_extractor import feature_extractor


def train_document_type_classifier(output_dir: str) -> Dict[str, Any]:
    """Trains TF-IDF text classifier on domain credential corpora."""
    corpus = []
    labels = []

    # Build representative training examples for each category
    samples_per_cat = {
        "Degree Certificate": [
            "This is to certify that candidate has been conferred the degree of Bachelor of Science in Computer Science with First Class Honours from University convocation.",
            "University Senate awards the degree of Master of Technology in Information Technology to student having passed the examination.",
            "Doctor of Philosophy degree awarded by Academic Council and Vice Chancellor of the University.",
            "Conferred upon the degree of Bachelor of Engineering with all honors and privileges."
        ],
        "Marksheet / Transcript": [
            "Statement of marks for semester examination. Seat no 10294. PRN 948271. Subject code CS101 marks obtained 85 maximum marks 100 CGPA 8.75 Passed.",
            "Official academic transcript detailing course credits, grade points, cumulative GPA and examination session results.",
            "Grade sheet containing semester wise marks, credit units, total marks 850/1000 percentage 85% Result: First Class with Distinction.",
            "Consolidated marksheet showing marks obtained in individual subjects and final SGPA result pass."
        ],
        "Internship Certificate": [
            "This is to certify that intern has successfully completed summer internship as Machine Learning Research Intern from June to August.",
            "Internship completion certificate. The intern demonstrated exemplary skills in full stack software engineering and completed all project deliverables.",
            "Certificate of internship awarded to candidate for completing 6 months internship in cloud computing and data analytics.",
            "Successfully worked as a Trainee Software Engineer intern under the guidance of our engineering department."
        ],
        "Experience Letter": [
            "Relieving letter and experience certificate. This is to certify that employee was employed with us as Senior Software Engineer from 2020 to 2023.",
            "Experience letter confirming employment tenure as Product Manager. Relieved from all duties with exemplary conduct and character.",
            "Service certificate verifying designation of Technical Lead and confirming last working date and professional contributions.",
            "Employment verification letter confirming full-time tenure, role of Data Scientist, and remuneration."
        ],
        "Training Certificate": [
            "Certificate of completion. Has successfully attended and completed the intensive 40-hour hands-on training workshop in Cybersecurity and Ethical Hacking.",
            "Professional training credential for completing Advanced Deep Learning and Computer Vision Bootcamp.",
            "Has participated in corporate executive training program on Blockchain Infrastructure and Decentralized Ledger Systems.",
            "Certified in Full Stack Web Application Development after completing comprehensive project work."
        ],
        "Skill Certificate": [
            "Skill assessment credential. Achieved passing score of 92% in Python Programming and Cloud Architecture Competency Examination.",
            "Accredited professional certification validating hands-on proficiency in DevOps and CI/CD pipelines.",
            "Digital badge and credential awarded for passing certified database administrator competency examination.",
            "Skill validation certificate confirming professional competency in React, TypeScript, and FastAPI."
        ],
        "Other": [
            "Receipt for tuition fees payment. Invoice number 9482. Total amount paid 1500 USD.",
            "Library membership card registration form. Name of member, valid till end of semester.",
            "General identity verification card and driving license document.",
            "Miscellaneous corporate memorandum and internal announcement document."
        ]
    }

    for cat, texts in samples_per_cat.items():
        for t in texts:
            # Augment with slight variations
            corpus.append(t)
            labels.append(cat)
            corpus.append(t.lower() + " credential document reference verification")
            labels.append(cat)

    vectorizer = TfidfVectorizer(ngram_range=(1, 2), max_features=1500)
    X = vectorizer.fit_transform(corpus)
    y = np.array(labels)

    clf = LogisticRegression(C=1.0, max_iter=200, random_state=42)
    clf.fit(X, y)

    metrics = {
        "model_name": "TF-IDF + LogisticRegression",
        "sample_count": len(corpus),
        "classes": list(clf.classes_),
        "vocabulary_size": len(vectorizer.vocabulary_)
    }

    # Save
    os.makedirs(output_dir, exist_ok=True)
    out_path = os.path.join(output_dir, "doc_classifier.joblib")
    joblib.dump({"model": clf, "vectorizer": vectorizer, "metrics": metrics}, out_path)

    return metrics


def train_fraud_and_anomaly_models(output_dir: str) -> Dict[str, Any]:
    """
    Trains Random Forest Classifier and Isolation Forest for anomaly detection.
    Computes genuine precision, recall, F1, and confusion matrix.
    """
    raw_dataset = synthetic_generator.generate_dataset(num_samples=400)
    X = feature_extractor.extract_batch(raw_dataset)
    y = np.array([s["label"] for s in raw_dataset])  # 0: Legit, 1: Altered

    # Train / Test split (80 / 20) with stratification
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    # 1. Random Forest Classifier
    rf = RandomForestClassifier(
        n_estimators=100,
        max_depth=6,
        random_state=42,
        class_weight="balanced"
    )
    rf.fit(X_train, y_train)

    y_pred = rf.predict(X_test)
    y_prob = rf.predict_proba(X_test)[:, 1]

    # Calculate real evaluation metrics
    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred))
    rec = float(recall_score(y_test, y_pred))
    f1 = float(f1_score(y_test, y_pred))
    cm = confusion_matrix(y_test, y_pred).tolist()

    # 5-Fold Cross Validation
    cv_scores = cross_val_score(rf, X, y, cv=5, scoring="f1")

    # Feature Importances
    feat_importances = {
        name: round(float(imp), 4)
        for name, imp in zip(feature_extractor.FEATURE_NAMES, rf.feature_importances_)
    }

    # 2. Isolation Forest Anomaly Detector
    # Train on legitimate samples only
    X_legit_train = X_train[y_train == 0]
    iso_forest = IsolationForest(
        n_estimators=100,
        contamination=0.10,
        random_state=42
    )
    iso_forest.fit(X_legit_train)

    metrics = {
        "model_version": "TrustChain-RF-v2.1",
        "dataset_size": len(raw_dataset),
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "accuracy": round(acc, 4),
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "f1_score": round(f1, 4),
        "cv_f1_mean": round(float(np.mean(cv_scores)), 4),
        "cv_f1_std": round(float(np.std(cv_scores)), 4),
        "confusion_matrix": cm,
        "feature_importances": feat_importances
    }

    # Save models and metrics
    os.makedirs(output_dir, exist_ok=True)
    out_path = os.path.join(output_dir, "fraud_classifier.joblib")
    joblib.dump({
        "rf_model": rf,
        "isolation_forest": iso_forest,
        "feature_names": feature_extractor.FEATURE_NAMES,
        "metrics": metrics
    }, out_path)

    return metrics


if __name__ == "__main__":
    base_dir = os.path.join(os.path.dirname(__file__), "..", "models")
    print(f"Training models in {base_dir}...")
    doc_metrics = train_document_type_classifier(base_dir)
    print("Document classifier trained:", doc_metrics)
    fraud_metrics = train_fraud_and_anomaly_models(base_dir)
    print("Fraud model trained:", fraud_metrics)
