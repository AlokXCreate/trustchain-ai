# TrustChain AI — System Architecture Specification

## 1. Executive Summary

**TrustChain AI** is an enterprise-grade, hybrid artificial intelligence and decentralized ledger verification platform engineered to eradicate document fraud, diploma mills, and credential forgery. The platform couples a multi-stage computer vision and machine learning forensic pipeline with a zero-PII Ethereum (Sepolia) smart contract registry and an evidence-grounded Retrieval-Augmented Generation (RAG) assistant.

---

## 2. Multi-Tier System Architecture

```mermaid
graph TD
    subgraph ClientLayer["Presentation Tier (Vite + React 19 + TailwindCSS)"]
        UI_Dash["Role Dashboards (Admin / Institution / Verifier)"]
        UI_Upload["Multi-Modal Drag-and-Drop Ingestion Portal"]
        UI_Workspace["Verification Workspace (8-Section Forensic Dossier)"]
        UI_Verifier["Public Decentralized Verifier Portal"]
        UI_RAG["Grounded RAG Assistant & Knowledge Base Explorer"]
    end

    subgraph APILayer["Application & API Gateway Tier (FastAPI + Uvicorn)"]
        AuthRouter["OAuth2 / JWT Authentication & RBAC"]
        DocRouter["Document Ingestion & File Sanitization"]
        VerifyRouter["Verification Orchestration Pipeline"]
        ChainRouter["Web3 Blockchain Gateway (Ethers / RPC)"]
        RAGRouter["RAG Query & Knowledge Ingestion Engine"]
        AuditRouter["Tamper-Evident Audit Logging Service"]
    end

    subgraph ForensicEngine["AI/ML Forensic & Intelligence Pipeline"]
        CV_Pre["Image Normalization & Deskewing"]
        OCR_Mod["Tesseract / PyMuPDF Layout & Text Extraction"]
        ML_Class["TF-IDF + Ridge Classifier (Academic / Legal / Financial)"]
        ML_Forensic["Error Level Analysis (ELA) & Compression Gradients"]
        Rule_Engine["Cross-Field Logic & Checksum Validation"]
        Risk_Engine["Calibrated Multi-Factor Risk Scorer"]
        PDF_Comp["Forensic PDF Audit Report Generator (ReportLab)"]
    end

    subgraph KnowledgeTier["RAG Intelligence & Vector Tier"]
        Chunker["Semantic Text Chunking Engine"]
        Embedder["SentenceTransformer (all-MiniLM-L6-v2 / Hash Embeddings)"]
        VectorDB["In-Memory / ChromaDB Similarity Search (Cosine)"]
        Guardrails["Grounded Source Verification & Anti-Hallucination"]
    end

    subgraph BlockchainTier["Decentralized Ledger Tier (Ethereum / Sepolia)"]
        RegistryContract["TrustChainCredentialRegistry.sol"]
        ZeroPII["Keccak-256 Document Fingerprint (Zero-PII Storage)"]
        AccessControl["Owner & Authorized Institution Access Roles"]
        EventLogs["CredentialRegistered & CredentialRevoked Events"]
    end

    UI_Upload --> DocRouter
    UI_Workspace --> VerifyRouter
    UI_Verifier --> ChainRouter
    UI_RAG --> RAGRouter

    DocRouter --> CV_Pre
    VerifyRouter --> ForensicEngine
    ForensicEngine --> Risk_Engine
    Risk_Engine --> PDF_Comp

    RAGRouter --> Chunker
    Chunker --> Embedder
    Embedder --> VectorDB
    VectorDB --> Guardrails

    ChainRouter --> RegistryContract
    RegistryContract --> ZeroPII
    RegistryContract --> AccessControl
    RegistryContract --> EventLogs
```

---

## 3. End-to-End Verification Pipeline State Machine

```mermaid
stateDiagram-v2
    [*] --> Ingestion: Upload Certificate / Marksheet
    Ingestion --> Validation: SHA-256 Hashing & Magic Byte Check
    Validation --> Preprocessing: Convert to 300 DPI Canvas
    Preprocessing --> Extraction: OCR & Layout Parsing
    Extraction --> Classification: Document Type Inference
    Classification --> Forensics: ELA & Pixel Tamper Detection
    Forensics --> CrossValidation: Metadata & Cross-Field Checks
    CrossValidation --> BlockchainLookup: Query Sepolia Contract
    
    state BlockchainLookup {
        [*] --> CheckRegistration
        CheckRegistration --> VerifiedRegistered: Hash Matches On-Chain
        CheckRegistration --> TamperedDocument: Meta Matches, Hash Mismatches
        CheckRegistration --> RevokedCredential: Flagged as Revoked
        CheckRegistration --> UnregisteredDocument: Zero Match Found
    }

    BlockchainLookup --> RiskScoring: Synthesize AI & Chain Signals
    RiskScoring --> DossierGeneration: Compile 8-Section Audit Dossier
    DossierGeneration --> RAGGrounding: Contextualize via Regulatory Knowledge Base
    RAGGrounding --> FinalOutput: Export PDF / Public Verifier Share
    FinalOutput --> [*]
```

---

## 4. Component Interaction Matrix

| Subsystem | Input Format | Primary Processing | Downstream Dependencies | Output Contract |
| :--- | :--- | :--- | :--- | :--- |
| **Ingestion Engine** | PDF, PNG, JPG, TIFF (≤10MB) | Magic byte validation, SHA-256 hashing | Preprocessor, Secure Storage | `SanitizedDocumentDTO` |
| **Forensic Vision** | RGB / Grayscale Pixels | ELA (Error Level Analysis), edge sharpness, variance | Risk Engine, Verification Workspace | `ForensicAnalysisResult` |
| **Document Classifier**| Cleaned OCR Text | TF-IDF Vectorizer + Ridge / SGD Multiclass | Cross-Validator, UI Badges | `ClassificationMetadata` |
| **Blockchain Gateway** | SHA-256 Document Hash | JSON-RPC to `TrustChainCredentialRegistry.sol` | Risk Engine, Audit Trail | `OnChainCredentialProof` |
| **RAG Knowledge Base** | University & Regulatory PDFs | Recursive chunking, cosine retrieval | AI Assistant, Verification Dossier | `CitedAnswerContext` |
| **Risk Calibrator** | Forensics + Chain + OCR | Weighted confidence aggregation (0-100) | ReportLab, UI Action Bar | `UnifiedRiskDossier` |

---

## 5. Technology Stack Justification

1. **FastAPI & Uvicorn (Python 3.11+)**:
   - Asynchronous I/O facilitates non-blocking blockchain JSON-RPC calls, vector similarity lookups, and computer vision pipelines.
   - Pydantic v2 ensures strict schema validation and auto-generates OpenAPI v3 specifications.

2. **React 19 + TypeScript + Vite**:
   - Code-split dynamic routes via `React.lazy()` reduce initial bundle size from 938 kB to 296 kB (68% improvement).
   - Strict typing prevents runtime null-dereference errors in high-stakes forensic inspection dashboards.

3. **Solidity 0.8.28 + Hardhat**:
   - `TrustChainCredentialRegistry.sol` provides cryptographic immutability, zero-knowledge PII protection, and gas-optimized storage slots.
   - Tested exhaustively with 21 Hardhat unit and integration tests.

4. **Error Level Analysis (OpenCV + NumPy)**:
   - Identifies post-processing image manipulations, digital splicing, and localized resaving artifacts without requiring heavy GPU clusters.

5. **SentenceTransformers & In-Memory / Vector Storage**:
   - Enables fast similarity indexing for university regulations, accreditation standards, and syllabus verification documents.

