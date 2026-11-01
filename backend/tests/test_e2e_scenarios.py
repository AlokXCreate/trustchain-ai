"""
TrustChain AI - Master Prompt 4: End-to-End Scenarios Test Suite (Scenarios A through H)
Validates complete user journeys across:
- Scenario A: Registered Certificate & Cryptographic Match
- Scenario B: Modified Certificate & Hash Mismatch Detection
- Scenario C: Suspicious / Unregistered Document Handling
- Scenario D: Revoked Certificate & Administrative Invalidation
- Scenario E: RAG-Based Explanation with Evidence Citations
- Scenario F: Unauthorized Issuer Rejection & Access Control
- Scenario G: Blockchain Fallback & Offline Ledger Resilience
- Scenario H: Role-Based Authorization & Protected Resource Gates
"""

import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.core.security import create_access_token
from blockchain.contract_service import contract_service
from blockchain.hashing_service import hashing_service
from app.services.ai_service import ai_service


@pytest.fixture
def individual_headers():
    token = create_access_token({"sub": "usr_alex_01", "role": "individual", "email": "individual@trustchain.ai"})
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def issuer_headers():
    token = create_access_token({"sub": "usr_inst_01", "role": "institution", "email": "institution@trustchain.ai", "organization_name": "MIT"})
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def admin_headers():
    token = create_access_token({"sub": "usr_admin_01", "role": "admin", "email": "admin@trustchain.ai"})
    return {"Authorization": f"Bearer {token}"}


# ==================== SCENARIO A: REGISTERED CERTIFICATE ====================

@pytest.mark.asyncio
async def test_scenario_a_registered_certificate(issuer_headers):
    """
    Scenario A: Authorized issuer registers a credential -> QR code generated ->
    Verifier checks via public endpoint -> Blockchain confirms active status & matching hash.
    """
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        cred_id = "TC-2026-SCENARIO-A"
        doc_bytes = b"TrustChain Official University Degree - Alice Smith - B.Sc Computer Science - 2026"
        doc_hash = hashing_service.compute_sha256(doc_bytes)

        # 1. Issuer registers credential
        reg_payload = {
            "credential_id": cred_id,
            "document_hash": doc_hash,
            "credential_type": "degree",
            "issuer_name": "Dr. Eleanor Vance",
            "organization": "Massachusetts Institute of Technology (MIT)"
        }
        reg_res = await ac.post("/api/v1/blockchain/credentials/register", json=reg_payload, headers=issuer_headers)
        assert reg_res.status_code == 200
        reg_data = reg_res.json()
        assert reg_data["success"] is True
        assert "qr" in reg_data
        assert "qr_base64_png" in reg_data["qr"] or "verification_url" in reg_data["qr"]

        # 2. Public verification via credential ID & matching hash
        verify_payload = {
            "credential_id": cred_id,
            "document_hash": doc_hash
        }
        ver_res = await ac.post("/api/v1/blockchain/credentials/verify", json=verify_payload)
        assert ver_res.status_code == 200
        ver_data = ver_res.json()
        assert ver_data["verified"] is True
        assert ver_data["status"] == "Verified"
        assert ver_data["hash_matches"] is True
        assert ver_data["credential"]["credential_id"] == cred_id


# ==================== SCENARIO B: MODIFIED CERTIFICATE ====================

@pytest.mark.asyncio
async def test_scenario_b_modified_certificate_tamper_detected():
    """
    Scenario B: A registered certificate is modified -> Verifier uploads altered file ->
    Hash mismatch is detected and clearly explained without claiming it was never registered.
    """
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        cred_id = "TC-2026-MIT941"  # Pre-seeded active credential
        altered_hash = "9999999999999999999999999999999999999999999999999999999999999999"

        verify_payload = {
            "credential_id": cred_id,
            "document_hash": altered_hash
        }
        ver_res = await ac.post("/api/v1/blockchain/credentials/verify", json=verify_payload)
        assert ver_res.status_code == 200
        ver_data = ver_res.json()

        assert ver_data["verified"] is False
        assert ver_data["status"] == "Hash Mismatch"
        assert ver_data["hash_matches"] is False
        msg_l = ver_data["message"].lower()
        assert "integrity check failed" in msg_l or "not match" in msg_l or "mismatch" in msg_l or "tampered" in msg_l


# ==================== SCENARIO C: SUSPICIOUS UNREGISTERED DOCUMENT ====================

@pytest.mark.asyncio
async def test_scenario_c_unregistered_document_and_ai_analysis():
    """
    Scenario C: Unregistered document is uploaded -> OCR & AI risk analysis execute ->
    Blockchain status reported as unregistered without falsely declaring fraud.
    """
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # 1. Blockchain lookup for unregistered hash
        random_hash = "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
        ver_res = await ac.post("/api/v1/blockchain/credentials/verify", json={"document_hash": random_hash})
        assert ver_res.status_code == 200
        ver_data = ver_res.json()

        assert ver_data["verified"] is False
        assert ver_data["status"] == "Unregistered"
        msg_l = ver_data["message"].lower()
        assert "no registered credential" in msg_l or "not found" in msg_l or "unregistered" in msg_l

        # 2. AI pipeline analysis on a document
        import cv2
        import numpy as np
        canvas = np.ones((800, 600, 3), dtype=np.uint8) * 255
        cv2.putText(canvas, "UNKNOWN TRANSCRIPT SAMPLE", (50, 100), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 2)
        _, enc = cv2.imencode(".png", canvas)
        img_bytes = enc.tobytes()

        ai_res = ai_service.analyze_document(
            document_id="doc_demo_unregistered",
            file_path_or_bytes=img_bytes,
            file_name="unregistered_transcript.png",
            declared_metadata={"category": "transcript", "issuer_name": "Unregistered Institute"}
        )
        assert "risk_assessment" in ai_res
        assert "category_label" in ai_res["risk_assessment"]
        assert "disclaimer" in ai_res["risk_assessment"]
        explanation = ai_res["risk_assessment"]["explanation"]
        assert "100% fake" not in explanation.lower()
        assert "guaranteed fraud" not in explanation.lower()


# ==================== SCENARIO D: REVOKED CERTIFICATE ====================

@pytest.mark.asyncio
async def test_scenario_d_revoked_certificate():
    """
    Scenario D: Authorized issuer revokes a credential -> Verifier checks it ->
    System displays revoked status and explains administrative reason.
    """
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        revoked_id = "TC-2025-REV811"  # Pre-seeded revoked credential

        ver_res = await ac.post("/api/v1/blockchain/credentials/verify", json={"credential_id": revoked_id})
        assert ver_res.status_code == 200
        ver_data = ver_res.json()

        assert ver_data["verified"] is False
        assert ver_data["status"] == "Revoked"
        assert "revoked" in ver_data["message"].lower()
        assert ver_data["credential"]["revocation_reason"] is not None


# ==================== SCENARIO E: RAG-BASED EXPLANATION ====================

@pytest.mark.asyncio
async def test_scenario_e_rag_based_explanation():
    """
    Scenario E: User asks why a document was flagged -> RAG retrieves trusted evidence ->
    Returns grounded answer with source citations without fabricating policies.
    """
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        chat_req = {
            "query": "What are the official guidelines for verifying a Stanford University diploma seal?",
            "document_id": "doc_demo_degree_01",
            "top_k": 3
        }
        res = await ac.post("/api/v1/rag/chat", json=chat_req)
        assert res.status_code == 200
        data = res.json()

        assert "answer" in data
        assert len(data["answer"]) > 20
        assert "citations" in data
        assert isinstance(data["citations"], list)
        assert data["evidence_sufficiency"] in ["high", "sufficient", "moderate", "insufficient"]


# ==================== SCENARIO F: UNAUTHORIZED ISSUER REJECTION ====================

@pytest.mark.asyncio
async def test_scenario_f_unauthorized_issuer_rejection(individual_headers):
    """
    Scenario F: An individual user attempts to register a credential on the blockchain ->
    Backend rejects with HTTP 403 Forbidden -> No registration occurs.
    """
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        reg_payload = {
            "credential_id": "TC-UNAUTHORIZED-001",
            "document_hash": "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
            "credential_type": "degree"
        }
        res = await ac.post("/api/v1/blockchain/credentials/register", json=reg_payload, headers=individual_headers)
        assert res.status_code == 403
        assert "permitted" in res.json()["detail"].lower() or "forbidden" in res.json()["detail"].lower()


# ==================== SCENARIO G: BLOCKCHAIN FALLBACK & OFFLINE LEDGER ====================

def test_scenario_g_blockchain_fallback_resilience():
    """
    Scenario G: Even if external JSON-RPC or Hardhat node is offline,
    ContractService gracefully operates via high-fidelity in-memory registry.
    """
    status = contract_service.get_status()
    assert "connected" in status
    assert "contract_address" in status
    assert "total_registered" in status
    assert status["total_registered"] >= 2

    # Verification still functions cleanly without crashing
    res = contract_service.verify_credential("TC-2026-MIT941")
    assert res["verified"] is True
    assert res["status"] == "Verified"


# ==================== SCENARIO H: AUTHENTICATION AND ADMIN PERMISSIONS ====================

@pytest.mark.asyncio
async def test_scenario_h_admin_protected_routes(individual_headers, admin_headers):
    """
    Scenario H: Normal user attempts to access admin-only knowledge source upload ->
    Rejected with 403. Admin user is allowed.
    """
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # 1. Normal user attempts upload -> 403
        files = {"file": ("guideline.txt", b"Official Verification Rules", "text/plain")}
        data = {"title": "Test Title", "institution": "Test Univ"}
        res_user = await ac.post("/api/v1/rag/sources/upload", files=files, data=data, headers=individual_headers)
        assert res_user.status_code == 403

        # 2. Admin user uploads successfully -> 200
        res_admin = await ac.post("/api/v1/rag/sources/upload", files=files, data=data, headers=admin_headers)
        assert res_admin.status_code == 200
        assert res_admin.json()["success"] is True
