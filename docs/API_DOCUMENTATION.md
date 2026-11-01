# TrustChain AI — REST API Documentation

The TrustChain AI REST API is built on **FastAPI** and adheres to OpenAPI 3.1.0 specifications.

Interactive documentation:
- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

Base Path: `/api/v1`

---

## 1. Authentication Endpoints (`/auth`)

### `POST /api/v1/auth/login`
Authenticates a user and issues a Bearer JWT access token.
* **Request Body:**
  ```json
  {
    "email": "individual@trustchain.ai",
    "password": "Password123!"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "access_token": "eyJhbGciOi...",
    "token_type": "bearer",
    "user": {
      "id": "usr_indiv_01",
      "email": "individual@trustchain.ai",
      "full_name": "Alex Mercer",
      "role": "individual"
    }
  }
  ```

### `POST /api/v1/auth/register`
Creates a new user profile with assigned role.

### `GET /api/v1/auth/me`
Fetches the currently authenticated profile using the Bearer token.

---

## 2. Document Management (`/documents`)

### `POST /api/v1/documents/upload`
Uploads a document (PDF, PNG, JPG) with metadata.
* **Content-Type:** `multipart/form-data`
* **Form Fields:** `file` (Binary), `category` (string), `issuer_name` (string), `certificate_number` (string).
* **Response (200 OK):** Returns created `DocumentResponse`.

### `GET /api/v1/documents/list`
Lists documents filtered by category, status, or search query.

### `DELETE /api/v1/documents/{document_id}`
Deletes document record (restricted to owner or administrator).

---

## 3. Verification Workflow (`/verification`)

### `POST /api/v1/verification/initiate`
Orchestrates the 7-step verification workflow.
* **Request Body:** `{"document_id": "doc_demo_degree_01"}`
* **Response (200 OK):** Returns `VerificationResultResponse` with 7 processing steps.

### `GET /api/v1/verification/{document_id}`
Retrieves verification findings, tamper risk score, and step-by-step progress.

---

## 4. Digital Credentials (`/credentials`)

### `POST /api/v1/credentials/issue`
Issues a new verifiable credential (Requires `institution` or `admin` role).

### `GET /api/v1/credentials/verify/{credential_id}`
Public lookup endpoint to verify credential validity, issuer status, and revocation state.

### `POST /api/v1/credentials/revoke`
Revokes an issued credential with an administrative reason.

---

## 5. Institutional Registry (`/institutions`)

### `GET /api/v1/institutions/registry`
Public registry of accredited universities and issuing authorities.

### `POST /api/v1/institutions/apply`
Submits institutional application for accreditation (starts in `pending` state).

### `PUT /api/v1/institutions/{institution_id}/approve`
Admin only endpoint to approve, reject, or suspend an institution.

---

## 6. Bulk HR Verification (`/bulk`)

### `POST /api/v1/bulk/upload-batch`
Uploads multiple candidate credentials for simultaneous batch verification.

### `GET /api/v1/bulk/{batch_id}/export-csv`
Downloads full batch audit results formatted as CSV.

---

## 7. AI Assistant (`/assistant`)

### `POST /api/v1/assistant/chat`
Conversational endpoint for document analysis queries, forensic explanations, and citation retrieval.

---

## 8. Cryptographic Audit Trail (`/audit`)

### `GET /api/v1/audit/logs`
Retrieves append-only audit blocks with SHA-256 hash chaining.
