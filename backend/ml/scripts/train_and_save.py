"""
TrustChain AI - Run Script to Train and Serialize All ML Models
"""

import sys
import os

# Add backend directory to path
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from ml.training.train_classifier import train_document_type_classifier, train_fraud_and_anomaly_models


def main():
    models_dir = os.path.join(backend_dir, "ml", "models")
    print(f"[*] Initializing model training pipeline into: {models_dir}")

    print("[*] 1/2 Training Document Type Classifier...")
    doc_metrics = train_document_type_classifier(models_dir)
    print(f"[+] Document Classifier ready: {doc_metrics['sample_count']} samples across {len(doc_metrics['classes'])} classes.")

    print("[*] 2/2 Training Fraud Pattern Classifier & Isolation Forest...")
    fraud_metrics = train_fraud_and_anomaly_models(models_dir)
    print(f"[+] Fraud Detection Models ready: Accuracy={fraud_metrics['accuracy']}, F1={fraud_metrics['f1_score']}, CV_F1={fraud_metrics['cv_f1_mean']}")
    print(f"[+] Confusion Matrix: {fraud_metrics['confusion_matrix']}")
    print("[*] ML Pipeline training complete and artifacts serialized successfully!")


if __name__ == "__main__":
    main()
