# TrustChain AI — AI/ML Document Intelligence Architecture

## 1. Overview
TrustChain AI is a modular, explainable document intelligence system designed for automated authentication, information extraction, forensic anomaly detection, and cryptographic integrity verification of academic and professional credentials.

The platform processes:
- Academic Degrees & Diplomas
- Marksheets & Official Transcripts
- Internship Completion Certificates
- Experience & Relieving Letters
- Professional Training & Skill Credentials

---

## 2. End-to-End Analysis Pipeline

```
DOCUMENT INGESTION (PDF / PNG / JPG)
        |
        v
[1] Document Validation & File Integrity (SHA-256)
        |
        v
[2] Image Preprocessing & Measurable Quality Assessment
    - Grayscale & Bilateral Filtering (Text Edge Preservation)
    - Deskewing via Contour MinAreaRect & Hough Transforms
    - CLAHE Contrast Equalization
    - Quality Scoring: Blur (Laplacian var), Skew, Resolution, Contrast
        |
        v
[3] Multi-Page Optical Text & Layout Localization (OCR)
    - Embedded PDF Stream Extraction
    - Morphological Text Region Bounding Box Segmentation
    - Optical Confidence Scoring (0.0 to 1.0)
    - SHA-256 In-Memory LRU Cache
        |
        v
[4] Optical QR Code & Barcode Payload Detection
    - OpenCV QRCodeDetector & 1D Barcode Pattern Scanner
    - URL Safety & Domain Accreditation Filtering
    - Cryptographic Tx Hash / Identifier Resolution
        |
        v
[5] Hybrid Document Classification
    - Domain Keyword Frequency Heuristics
    - TF-IDF N-Gram Vectorizer + Logistic Regression Classifier
    - Multi-Class Confidence & Alternative Ranking
        |
        v
[6] Structured Field Information Extraction
    - Configurable Schemas per Document Category
    - Regex Pattern Matching & Source Text Anchoring
    - Non-Fabrication Guarantee (Unavailable Fields Marked Explicitly)
        |
        +-----------------------------------+-----------------------------------+
        |                                   |                                   |
        v                                   v                                   v
[7] Image Forensics & Tampering    [8] Metadata & EXIF Analysis        [9] Cross-Field Consistency
    - Error Level Analysis (ELA)       - PDF Creation/Mod Timestamps       - Date Chronology Auditing
    - Local Spatial Noise Variance     - Embedded Font Dictionaries        - Marksheet Arithmetic Integrity
    - Circular Stamp/Seal Detection    - Image Editing Software Signatures - Recipient Identity Alignment
    - Cursive Signature Stroke Bounds  - Chronological Discrepancies       - Identifier Syntax Validation
        |                                   |                                   |
        +-----------------------------------+-----------------------------------+
                                            |
                                            v
                        [10] Spatial Template & Layout Comparison
                            - Registered Institutional Coordinate Baselines
                            - Bounding Box Intersection-over-Union (IoU)
                            - Displaced and Missing Region Localization
                                            |
                                            v
                        [11] Machine Learning Anomaly Detection
                            - 14-Dimensional Numerical Feature Vector
                            - Random Forest Classifier (Balanced Weights)
                            - Isolation Forest Unsupervised Outlier Scoring
                            - Feature Contribution Ranking
                                            |
                                            v
                        [12] Explainable Risk Scoring Engine
                            - Multi-Modal Weighted Evidence Aggregation
                            - 4 Calibrated Risk Categories (0-100)
                            - Mandatory Institutional Verification Disclaimer
                                            |
                                            v
                        [13] Structured Verification Report & Dossier
                            - Validated Pydantic Schema
                            - ReportLab Audit-Ready PDF Certificate
                            - Interactive React Verification Workspace
```

---

## 3. Core Architectural Principles

1. **Non-Fabrication & Evidence-Based Verification**: The system never guesses or invents missing credentials. If text or metadata is unavailable, it is explicitly cataloged as unavailable.
2. **Explainability Over Black-Box Claims**: The engine never claims a document is "100% Fake" or "Guaranteed Genuine". Instead, it outputs calibrated risk scores (0–100) and actionable findings with specific evidence references.
3. **Resource Optimization**: Built for high performance on standard CPUs without requiring high-end GPUs.
4. **Decoupled Service Interfaces**: Every stage operates as an independent service in `backend/app/services/ai/`.
