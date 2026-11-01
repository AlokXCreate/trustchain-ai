# TrustChain AI — Cloud Firestore Database Schema Specification

This document details the relational data structures, document models, and composite index configurations utilized in **Cloud Firestore** for TrustChain AI.

---

## 1. Primary Collections Overview

```
firestore/
├── users/                     // Authenticated user accounts & role profiles
├── documents/                 // Uploaded credential files and metadata
├── verification_results/      // 7-step forensic pipeline results & tamper scores
├── credentials/               // Issued digital verifiable credentials & QR payloads
├── institutions/              // Accredited universities & corporate certification authorities
├── verification_batches/      // Bulk HR pre-screening queues
├── audit_logs/                // Append-only tamper-evident chained event records
└── notifications/             // In-app notifications & security alerts
```

---

## 2. Collection Schemas

### `users` Collection
* **Document ID:** `usr_{id}` (or Firebase Auth `uid`)
```json
{
  "id": "string",
  "email": "string",
  "full_name": "string",
  "role": "individual | institution | verifier | admin",
  "organization_name": "string (optional)",
  "organization_type": "string (optional)",
  "designation": "string (optional)",
  "country": "string",
  "is_active": "boolean",
  "is_verified": "boolean",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### `documents` Collection
* **Document ID:** `doc_{id}`
```json
{
  "id": "string",
  "name": "string",
  "category": "degree | marksheet | internship | training | experience | skill | other",
  "file_type": "string (MIME type)",
  "file_size_bytes": "number",
  "file_path": "string",
  "file_url": "string (optional)",
  "issuer_name": "string (optional)",
  "certificate_number": "string (optional)",
  "issue_date": "string (ISO date)",
  "expiration_date": "string (optional)",
  "uploaded_by": "string (references users.id)",
  "uploader_name": "string (optional)",
  "status": "uploaded | queued | processing | analyzed | verified | review_required | failed | error",
  "verification_result_id": "string (references verification_results.id)",
  "is_demo": "boolean",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### `verification_results` Collection
* **Document ID:** `res_{id}`
```json
{
  "id": "string",
  "document_id": "string (references documents.id)",
  "status": "verified | review_required | analyzed | failed",
  "risk_score": "number (0.00 to 1.00) or null",
  "confidence": "number (0.00 to 1.00) or null",
  "extracted_data": {
    "student_name": "string",
    "degree": "string",
    "issuer": "string",
    "certificate_number": "string"
  },
  "anomaly_findings": [
    {
      "type": "string (e.g. Font Inconsistency, Seal Duplication)",
      "severity": "low | medium | high | critical",
      "description": "string"
    }
  ],
  "blockchain_status": "string",
  "blockchain_tx_hash": "string (optional)",
  "ai_explanation": "string",
  "steps": [
    {
      "step_number": 1,
      "name": "Document Ingestion & File Integrity",
      "status": "completed",
      "message": "string",
      "timestamp": "timestamp"
    }
  ],
  "created_at": "timestamp",
  "completed_at": "timestamp (optional)"
}
```

### `credentials` Collection
* **Document ID:** `cred_{id}`
```json
{
  "id": "string",
  "credential_id": "string (e.g. TC-2026-MIT941)",
  "holder_name": "string",
  "holder_email": "string (optional)",
  "issuing_institution": "string",
  "institution_id": "string (references institutions.id)",
  "credential_type": "degree | marksheet | internship | training | skill",
  "program_or_course": "string",
  "issue_date": "string",
  "expiration_date": "string (optional)",
  "status": "active | revoked | expired | pending | not_registered",
  "blockchain_tx_hash": "string (optional)",
  "qr_payload": "string (Verification URL)",
  "grade_or_score": "string (optional)",
  "skills": ["string"],
  "metadata": "map",
  "created_at": "timestamp"
}
```

### `institutions` Collection
* **Document ID:** `inst_{id}`
```json
{
  "id": "string",
  "name": "string",
  "official_domain": "string (e.g. mit.edu, stanford.edu)",
  "organization_type": "string",
  "registration_number": "string",
  "website": "string",
  "address": "string",
  "contact_email": "string",
  "status": "pending | under_review | approved | rejected | suspended",
  "approval_date": "timestamp (optional)",
  "authorized_representatives": ["string (references users.id)"],
  "credentials_issued_count": "number",
  "verification_count": "number",
  "created_at": "timestamp"
}
```

### `audit_logs` Collection (Append-Only)
* **Document ID:** `aud_{id}`
```json
{
  "id": "string",
  "user_id": "string",
  "user_name": "string (optional)",
  "event_type": "login | document_upload | document_deletion | verification_request | verification_completion | credential_issuance | credential_revocation | institution_approval",
  "resource_id": "string (optional)",
  "resource_type": "string (optional)",
  "event_details": "string",
  "metadata": "map",
  "ip_address": "string",
  "tamper_evident_hash": "string (SHA-256 of previous hash + event data)",
  "blockchain_tx_ref": "string (optional)",
  "timestamp": "timestamp"
}
```

---

## 3. Cryptographic Hash Chaining Mechanism

The audit trail enforces cryptographic append-only integrity:

$$\text{Hash}_i = \text{SHA256}(\text{Hash}_{i-1} \parallel \text{Timestamp}_i \parallel \text{UserID}_i \parallel \text{EventType}_i \parallel \text{Details}_i)$$

Where $\text{Hash}_0 = 0000000000000000000000000000000000000000000000000000000000000000$.

Any alteration of past records immediately breaks the chain validation. In Master Prompt 3, this chained root hash will be committed to the Ethereum Sepolia smart contract every 24 hours.
