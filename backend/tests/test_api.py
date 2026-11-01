import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.core.config import settings


@pytest.mark.asyncio
async def test_root():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["platform"] == "TrustChain AI"
    assert data["status"] == "operational"


@pytest.mark.asyncio
async def test_health():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


@pytest.mark.asyncio
async def test_auth_login():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Test valid login
        response = await ac.post(f"{settings.API_V1_STR}/auth/login", json={
            "email": "individual@trustchain.ai",
            "password": "Password123!"
        })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["role"] == "individual"

    # Test invalid login
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        bad_response = await ac.post(f"{settings.API_V1_STR}/auth/login", json={
            "email": "individual@trustchain.ai",
            "password": "WrongPassword!"
        })
    assert bad_response.status_code == 401


@pytest.mark.asyncio
async def test_list_documents():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get(f"{settings.API_V1_STR}/documents/list")
    assert response.status_code == 200
    docs = response.json()
    assert isinstance(docs, list)
    assert len(docs) > 0


@pytest.mark.asyncio
async def test_verification_workflow():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.post(f"{settings.API_V1_STR}/verification/initiate", json={
            "document_id": "doc_demo_degree_01"
        })
    assert response.status_code == 200
    res = response.json()
    assert res["document_id"] == "doc_demo_degree_01"
    assert len(res["steps"]) == 7
    assert res["steps"][0]["name"] == "Document Ingestion & File Integrity"


@pytest.mark.asyncio
async def test_credentials_verify():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get(f"{settings.API_V1_STR}/credentials/verify/TC-2026-MIT941")
    assert response.status_code == 200
    data = response.json()
    assert data["is_valid"] is True
    assert data["credential"]["holder_name"] == "Alex Mercer"


@pytest.mark.asyncio
async def test_institutions_registry():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get(f"{settings.API_V1_STR}/institutions/registry")
    assert response.status_code == 200
    insts = response.json()
    assert isinstance(insts, list)
    assert any(i["official_domain"] == "mit.edu" for i in insts)


@pytest.mark.asyncio
async def test_audit_logs():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get(f"{settings.API_V1_STR}/audit/logs")
    assert response.status_code == 200
    logs = response.json()
    assert isinstance(logs, list)
    assert len(logs) > 0
    assert "tamper_evident_hash" in logs[0]
