# TrustChain AI — System Architecture Specification

## 1. Executive Architecture Summary

**TrustChain AI** is an enterprise-grade digital credential authentication and forensic document verification platform. The system combines:
1. **Frontend Presentation Layer:** React 19 + TypeScript + Vite + Tailwind CSS + Framer Motion + Recharts + Lucide Icons.
2. **Backend Services & API Layer:** Python + FastAPI REST API with Pydantic v2 schemas and modular service-oriented architecture.
3. **Database & Storage Layer:** Cloud Firestore for application state, Firebase Storage for secure document assets, with append-only tamper-evident audit hashing.
4. **AI & Vision Pipeline (Scheduled for Master Prompt 2):** OCR, layout geometry analysis, font inconsistency classifiers, and Error Level Analysis (ELA).
5. **Blockchain & Smart Contract Layer (Scheduled for Master Prompt 3):** Ethereum Sepolia testnet anchoring using Solidity smart contracts for immutable cryptographic proofs.

---

## 2. High-Level Architectural Diagram

```
                     +------------------------------------------------+
                     |              User / Verifier / HR              |
                     +------------------------------------------------+
                                             |
                                    HTTPS / WSS Requests
                                             v
+-----------------------------------------------------------------------------------------+
|                               FRONTEND (React + Vite + TS)                              |
|                                                                                         |
|  [ Public Landing ]       [ Auth & Role Switcher ]      [ Verification Workspace ]      |
|  [ Main Dashboard ]       [ History & Dossier ]         [ Digital Credentials + QR ]    |
|  [ Bulk HR Suite ]        [ Issuer Registry ]           [ TrustChain AI Assistant ]     |
|  [ Analytics Dash ]       [ Cryptographic Audit Trail ] [ Settings & Access Control ]   |
+-----------------------------------------------------------------------------------------+
                                             |
                                  REST API / Bearer JWT
                                             v
+-----------------------------------------------------------------------------------------+
|                               BACKEND (FastAPI Micro-Services)                          |
|                                                                                         |
|  +--------------------+  +--------------------+  +--------------------+                 |
|  |    Auth Service    |  |  Document Service  |  | Verification Flow  |                 |
|  |   (JWT / Bcrypt)   |  | (Storage & Metadata|  | (7-Stage Timeline) |                 |
|  +--------------------+  +--------------------+  +--------------------+                 |
|  +--------------------+  +--------------------+  +--------------------+                 |
|  | Credential Service |  | Institution Registry| |   Audit Service    |                 |
|  |  (QR / Lifecycle)  |  |  (Accreditation)   |  | (SHA-256 Chained)  |                 |
|  +--------------------+  +--------------------+  +--------------------+                 |
|  +--------------------+  +--------------------+  +--------------------+                 |
|  | Assistant Service  |  | AI Vision Pipeline |  | Blockchain Service |                 |
|  | (Domain Intelligence) | (Phase 2 Interface) | (Phase 3 Interface) |                 |
|  +--------------------+  +--------------------+  +--------------------+                 |
+-----------------------------------------------------------------------------------------+
                                             |
                       +---------------------+---------------------+
                       |                                           |
                       v                                           v
+---------------------------------------------+   +---------------------------------------+
|          DATABASE & STORAGE LAYER           |   |      DISTRIBUTED LEDGER & EXTERNAL    |
|                                             |   |                                       |
| - Cloud Firestore (Documents, Users, Logs)  |   | - Ethereum Sepolia Testnet (Phase 3)  |
| - Firebase Storage (Encrypted Files)        |   | - Google Gemini Multi-modal (Phase 2) |
| - Local Fail-safe In-Memory Store (Demo)    |   | - LangChain + ChromaDB (Phase 3)      |
+---------------------------------------------+   +---------------------------------------+
```

---

## 3. Seven-Stage Verification Lifecycle

Every document submitted to TrustChain AI traverses a 7-stage verifiable processing pipeline:

```
[ Stage 1: Ingestion & Integrity ]
  └─ Registers upload, calculates raw SHA-256 binary hash, validates MIME boundaries.

[ Stage 2: Image Preprocessing ]
  └─ Normalizes DPI to 300, aligns skew angles, executes adaptive thresholding.

[ Stage 3: OCR & Text Extraction ]
  └─ Extracts candidate names, conferral dates, roll numbers, and honors (Phase 2).

[ Stage 4: Tamper & Authenticity Analysis ]
  └─ Performs Error Level Analysis (ELA), font kerning validation, and seal extraction (Phase 2).

[ Stage 5: Institutional Accreditation Matching ]
  └─ Matches declared issuer against TrustChain Verified Institutional Registry.

[ Stage 6: Blockchain Proof Check ]
  └─ Queries Sepolia smart contract registry for cryptographic certificate anchor (Phase 3).

[ Stage 7: Forensic Dossier Generation ]
  └─ Synthesizes tamper risk scores, confidence bounds, and generates audit report.
```

---

## 4. Role-Based Access Control Matrix

| Role | Upload Docs | Run Verification | Issue Credentials | Revoke Credentials | Approve Institutions | Bulk Verification | View Audit Logs |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Individual** | Yes | Yes | No | No | No | No | Personal Only |
| **Institution** | Yes | Yes | Yes (Accredited) | Yes (Own) | No | Yes | Own Org |
| **HR / Verifier**| Yes | Yes | No | No | No | Yes | Yes |
| **Administrator**| Yes | Yes | Yes | Yes | Yes | Yes | Complete System |
