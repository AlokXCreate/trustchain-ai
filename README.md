# TrustChain AI — Intelligent Document Authentication & Digital Credential Verification Platform

> **"Building a Trusted Digital Future Through Intelligent Verification."**

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI_0.115-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React_19_TypeScript-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Bundler-Vite_8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Solidity](https://img.shields.io/badge/Smart_Contract-Solidity_0.8.28-363636?logo=solidity&logoColor=white)](https://soliditylang.org)
[![Hardhat](https://img.shields.io/badge/Framework-Hardhat-FFF100?logo=hardhat&logoColor=black)](https://hardhat.org)
[![Tests](https://img.shields.io/badge/Automated_Tests-74_Passing-brightgreen?logo=pytest&logoColor=white)](docs/TESTING_GUIDE.md)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 1. Project Vision & Problem Statement

Academic credential fraud, forged transcripts, counterfeit training certificates, and fabricated experience letters have become critical vulnerabilities for universities, corporate employers, HR recruitment agencies, and immigration authorities. Traditional manual verification is slow, expensive, prone to social engineering, and unable to detect pixel-level digital tampering.

**TrustChain AI** solves this crisis by combining **Computer Vision**, **Optical Character Recognition (OCR)**, **Explainable AI (XAI)**, and **Blockchain Smart Contracts** into a unified, enterprise-grade digital trust platform.

### Supported Document Categories:
1. Academic Degree Certificates (BS, MS, PhD)
2. University Marksheets and Grade Transcripts
3. Corporate Internship Certificates
4. Professional Training & Skill Certificates
5. Corporate Employment & Experience Letters
6. Educational Identity & Accreditation Documents

---

## 2. Complete 14-Step Verification Workflow

```text
User Authentication
       ↓
User Dashboard
       ↓
Upload Certificate / Marksheet / Document
       ↓
File Validation & Secure Storage
       ↓
Image Preprocessing (300 DPI Canvas Normalization)
       ↓
OCR & Information Extraction (Layout Parsing)
       ↓
Document Classification (TF-IDF + Ridge Classifier)
       ↓
AI/ML Fraud Detection (Anomaly Scoring)
       ↓
Image Forensics & Anomaly Analysis (ELA Heatmaps)
       ↓
Cross-Field & Metadata Validation (Algorithmic Logic)
       ↓
Explainable Risk Assessment (Calibrated Multi-Factor Scorer)
       ↓
Comprehensive Verification Report (8-Section Forensic Dossier)
       ↓
Blockchain Credential Lookup (Ethereum Sepolia Query)
       ↓
Document Hash Comparison (Raw Byte SHA-256 Matching)
       ↓
AI Assistant + RAG Explanation (Context Grounding & Citations)
       ↓
Final Evidence-Based Verification Summary
       ↓
Download / Share / Save / Audit (PDF, JSON, Public Link)
```

---

## 3. Comprehensive Verification Workspace (8-Section Dossier)

The core inspection surface (`/verify/results/:documentId`) compiles all forensic signals into eight dedicated audit sections:

1. **Executive Risk Overview**: Composite score (0-100), calibrated risk category (`Low Risk`, `Moderate Risk`, `Elevated Risk`, `Requires Manual Review`), and responsible verification summary.
2. **Document Viewer & Forensic Overlays**: High-resolution zoom, rotate, OCR bounding boxes, tamper boundary overlays, and live ELA heatmap toggle.
3. **Image Forensics & Manipulation Detection**: Error Level Analysis (ELA), compression gradients, clone-stamp anomalies, and EXIF metadata consistency checks.
4. **OCR & Structured Field Extraction**: Field schema per document category with confidence meters and inline correction capabilities.
5. **Cross-Field Logic & Anomaly Validation**: Checksum validation, dates sequence logic (graduation after enrollment), and grading scale consistency.
6. **Blockchain Credential Verification & Decentralized Proof**: Real-time Sepolia contract query, credential ID, issuer address, block timestamp, transaction receipt, and direct public verifier link.
7. **Comprehensive Forensic Report Download**: Printable format, downloadable ReportLab PDF audit dossier, and machine-readable JSON export.
8. **Interactive RAG Grounded AI Assistant**: Auto-binds current document context (`?docId=...`), surfaces quick-prompt chips, and retrieves grounded institutional guidelines with citations.

---

## 4. Quick Start & Execution

### Option A: Local Development Run (Windows Scripts)

```powershell
# In repository root
.\start_dev.bat
# Or via PowerShell
.\start_dev.ps1
```

- **Frontend Portal**: `http://localhost:5173`
- **Backend REST API**: `http://127.0.0.1:8000`
- **Interactive Swagger Docs**: `http://127.0.0.1:8000/docs`

### Option B: Docker Compose Deployment

```bash
docker compose up --build -d
```

---

## 5. Pre-Configured Demo Personas

TrustChain AI includes an integrated **Demonstration Mode** (`DEMO_MODE=true`), allowing evaluators and recruiters to test all role-based features without configuring external credentials:

| Persona | Role | Email | Password | Primary Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Alex Mercer** | Individual User | `individual@trustchain.ai` | `Password123!` | Upload certificates, view verification dossiers, inspect digital credentials |
| **Dr. Eleanor Vance** | Institution / Issuer | `institution@trustchain.ai` | `Password123!` | MIT Registrar, issue new credentials, anchor on-chain, manage revocation status |
| **Marcus Chen** | HR / Verifier | `verifier@trustchain.ai` | `Password123!` | Apex Talent, run batch pre-screening queues, export CSV dossiers |
| **Sarah Connor** | Platform Administrator | `admin@trustchain.ai` | `Password123!` | Accredit institutions, inspect tamper-evident audit logs, upload RAG sources |

---

## 6. Comprehensive Automated Test Suite (74 Tests)

### Backend Tests (53 Tests — 100% Passing)
```bash
cd backend
.venv\Scripts\pytest -v
```
- `tests/test_ai_pipeline.py`: 17 tests (computer vision, ELA, OCR, risk scoring, PDF generation)
- `tests/test_api.py`: 8 tests (auth, JWT, document ingestion, verification endpoints)
- `tests/test_rag_blockchain.py`: 20 tests (RAG chunking, vector retrieval, blockchain verification, QR generation)
- `tests/test_e2e_scenarios.py`: 8 comprehensive end-to-end scenarios (Scenarios A through H)

### Smart Contract Tests (21 Tests — 100% Passing)
```bash
cd blockchain
npx hardhat test
```
- `test/TrustChainCredentialRegistry.test.js`: 21 tests covering access control, hash matching, gas efficiency, duplicate prevention, and revocation workflows.

---

## 7. Technical Documentation Package

Detailed engineering specifications and operational guides are organized in the `docs/` directory:

- [System Architecture](docs/SYSTEM_ARCHITECTURE.md): Multi-tier architecture, component matrix, and state machine diagrams.
- [RAG Implementation](docs/RAG_IMPLEMENTATION.md): Chunking strategies, embedding vectors, cosine search, and anti-hallucination guardrails.
- [Blockchain Architecture](docs/BLOCKCHAIN_ARCHITECTURE.md): Zero-PII model, Keccak-256 / SHA-256 hashing, and Ethereum Sepolia integration.
- [Smart Contract Specification](docs/SMART_CONTRACT_DOCUMENTATION.md): Functions, events, errors, gas benchmarks, and test coverage report.
- [Security & Privacy](docs/SECURITY_AND_PRIVACY.md): Threat modeling, path traversal mitigations, prompt injection defenses, and RBAC.
- [Testing Guide](docs/TESTING_GUIDE.md): Complete instructions for running all 74 unit and end-to-end tests.
- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md): Local development vs. production Docker Compose deployment instructions.
- [Demonstration Guide](docs/DEMO_GUIDE.md): 20-step evaluator presentation sequence with click paths and speaker notes.

---

## 8. Responsible AI & Verification Ethics

In compliance with academic, employment, and legal standards:
- **Calibrated Risk Tiers**: The platform strictly categorizes documents as `Low Risk`, `Moderate Risk`, `Elevated Risk`, or `Requires Manual Review`.
- **No False Accusations**: TrustChain AI never generates definitive claims of absolute fraud or infallible authenticity.
- **Explainability**: Every risk score is decomposed into explainable sub-factors (tampering probability, cross-field anomalies, template conformity, and ledger state).

---

## 9. License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
