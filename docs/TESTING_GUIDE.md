# Testing & Quality Assurance Guide

## 1. Test Suite Architecture

TrustChain AI features an exhaustive automated testing suite across backend services, forensic vision algorithms, smart contracts, and end-to-end user workflows:

```text
74 Total Automated Tests Passing:
  ├── 53 Backend Python Tests (pytest)
  │    ├── 17 AI / ML & Forensic Vision Tests (test_ai_pipeline.py)
  │    ├── 8 Core REST API & Security Tests (test_api.py)
  │    ├── 20 RAG & Blockchain Integration Tests (test_rag_blockchain.py)
  │    └── 8 Comprehensive End-to-End Scenarios (test_e2e_scenarios.py)
  └── 21 Smart Contract Unit Tests (Hardhat / Mocha / Chai)
       └── TrustChainCredentialRegistry.test.js
```

---

## 2. Running Backend Tests

Activate the Python virtual environment and run `pytest`:

```bash
cd backend
# Windows:
.venv\Scripts\activate
pytest -v

# Run only E2E verification scenarios:
pytest tests/test_e2e_scenarios.py -v
```

### Scenario Catalog (Scenarios A through H)

1. **Scenario A: Genuine Registered Certificate** (`test_scenario_a_registered_certificate`)
   - Registers valid document hash on-chain, submits original file.
   - Asserts: `blockchain.is_registered == True`, `risk_tier == "low"`, `recommendation == "accept"`.
2. **Scenario B: Digitally Tampered Certificate** (`test_scenario_b_tampered_document_mismatch`)
   - Modifies pixel values of registered credential to simulate grade alteration.
   - Asserts: Hash mismatch detected, `blockchain.is_registered == False`, `risk_tier in ["elevated", "high"]`.
3. **Scenario C: Unregistered Document AI Forensics** (`test_scenario_c_unregistered_document_and_ai_analysis`)
   - Analyzes a newly uploaded, unregistered transcript.
   - Asserts: OCR extraction executes, document classified, ELA forensic metrics generated.
4. **Scenario D: Revoked Credential Handling** (`test_scenario_d_revoked_credential_detection`)
   - Validates credential previously flagged as revoked.
   - Asserts: `blockchain.is_revoked == True`, `recommendation == "reject"`, status labeled `revoked`.
5. **Scenario E: RAG Evidence Grounding** (`test_scenario_e_rag_based_explanation`)
   - Ingests university certificate verification policy and executes grounded assistant query.
   - Asserts: Citations returned, evidence sufficiency labeled (`high`/`moderate`).
6. **Scenario F: Unauthorized Issuer Rejection** (`test_scenario_f_unauthorized_issuer_rejection`)
   - Verifier role attempts to register a credential.
   - Asserts: `HTTP 403 Forbidden` response.
7. **Scenario G: Malformed File Defense** (`test_scenario_g_malformed_file_handling`)
   - Uploads zero-byte and path-traversal payload files.
   - Asserts: Graceful validation failure without unhandled server crashes.
8. **Scenario H: Role-Protected Administrative Endpoints** (`test_scenario_h_admin_protected_routes`)
   - Non-admin queries administrative source upload and configuration endpoints.
   - Asserts: Proper 403 gating across all administrative surfaces.

---

## 3. Running Smart Contract Hardhat Tests

Ensure Node.js is installed, then run the contract test suite:

```bash
cd blockchain
npx hardhat test
```

Expect **21 passing tests** covering access control, hash registration, duplicate rejections, view queries, and revocation workflows.

---

## 4. Frontend Type Checking & Building

Validate frontend code quality and run the production build:

```bash
cd frontend
# Linting
npm run lint

# TypeScript compilation and Vite build
npm run build
```
Build should pass with 0 errors, outputting optimized chunks to `frontend/dist/`.

