# TrustChain AI — 20-Step Demonstration Guide

This guide provides an evaluator or presenter with a complete, step-by-step presentation script and click-path to demonstrate the full capabilities of **TrustChain AI**.

---

## Pre-Flight Check

1. Backend running: `http://127.0.0.1:8000/docs` (Green healthcheck).
2. Frontend running: `http://localhost:5173`.
3. Pre-seeded demo credentials ready:
   - **Admin**: `admin@trustchain.ai` / `Admin@123456`
   - **Institution (Issuer)**: `issuer@trustchain.ai` / `Issuer@123456`
   - **Verifier**: `verifier@trustchain.ai` / `Verifier@123456`

---

## 20-Step Live Demonstration Sequence

| Step | Action / Click Path | UI Screen / Feature | What to Explain to Evaluators |
| :---: | :--- | :--- | :--- |
| **1** | Open `http://localhost:5173` | **Landing Page** | Introduce the problem: credential forgery, fake marksheets, and the need for a hybrid AI forensics + blockchain notary platform. |
| **2** | Click **"Sign In"** in navbar | **Login Modal / Page** | Explain the Role-Based Access Control (RBAC) architecture separating Admin, Institution, and Verifier permissions. |
| **3** | Click **"Demo: Institution"** and submit | **Institution Dashboard** | Show the institutional cockpit: issued credentials, batch uploads, recent registry actions, and tamper detection metrics. |
| **4** | Navigate to **"Issue Credential"** | **Registration Form** | Enter student details: "Alex Morgan", Degree: "B.S. Computer Science", University: "Stanford University". |
| **5** | Click **"Issue & Anchor on Blockchain"** | **Web3 Registration Toast** | Highlight the Zero-PII privacy guarantee: no student names are put on-chain; only the SHA-256 digest is registered in `TrustChainCredentialRegistry.sol`. |
| **6** | View the **Generated QR Code & Receipt** | **Credential Receipt Card** | Demonstrate the cryptographic hash, Sepolia contract address, and instant verification QR code. |
| **7** | Click **"Open Public Verifier"** | **Public Verification Portal** | Explain that anyone (employers, embassies) can verify credentials gas-free without an account. |
| **8** | Paste Document Hash / Credential ID | **Instant Ledger Lookup** | Observe green badge: **"REGISTERED & INTEGRITY CONFIRMED"** with timestamp and issuer address. |
| **9** | Sign out and sign in as **Verifier** | **Verifier Dashboard** | Verifier view focused on forensic document ingestion and compliance dossiers. |
| **10**| Click **"Verify Document"** | **Upload Workspace** | Drag and drop a sample degree certificate (e.g., `tests/fixtures` sample or synthesized document). |
| **11**| Observe live progress stepper | **14-Step Pipeline Indicator**| Walk through the real-time stages: Ingestion → Preprocessing → OCR → Classification → ELA Forensics → Blockchain Cross-check. |
| **12**| Arrive at **Verification Workspace** | **8-Section Forensic Dossier**| Explain the unified audit dossier compiling all forensic signals into one executive view. |
| **13**| Inspect **Risk Score & Meter** (Section 1)| **Risk Assessment Gauge** | Point out responsible AI language: labeled as **"Low Risk"** (or Elevated Risk), never claiming infallible proof. |
| **14**| Inspect **Image Forensics** (Section 3) | **ELA Heatmap & Noise Plot** | Show Error Level Analysis (ELA): uniform compression confirms unmanipulated digital pixels; anomalies flag cloned stamps. |
| **15**| Inspect **OCR & Cross-Field** (Section 4)| **Structured Field Table** | Show extracted student name, GPA, issuance dates, and algorithmic checksum verification. |
| **16**| Inspect **Blockchain Proof** (Section 6)| **Decentralized Audit Card** | Point out on-chain block number, transaction hash, and smart contract execution receipt. |
| **17**| Click **"Ask AI Assistant"** button | **RAG Assistant Card (Sec 8)**| Show context auto-binding (`?docId=...`). Click chip: *"Explain why this document received this risk tier"*. |
| **18**| Observe Grounded RAG Response | **Cited Response Bubble** | Highlight the direct citation to official institutional verification guidelines and evidence sufficiency tag. |
| **19**| In top action bar, click **"Export PDF"**| **Forensic PDF Generator** | Download and open the generated ReportLab PDF audit dossier complete with metadata, hash stamps, and ELA summary. |
| **20**| Click **"Copy Public Link"** / **"Share"**| **Shareable Verification URL** | Copy link, open in private incognito tab, and demonstrate seamless zero-login public verification for third-party auditors. |

