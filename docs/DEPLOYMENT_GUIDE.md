# Deployment & Environment Configuration Guide

## 1. Prerequisites

- **Python**: 3.11 or 3.12+
- **Node.js**: v18.0.0 or v20+
- **Docker & Docker Compose**: (Optional, for containerized deployment)
- **Git**

---

## 2. Option A: Local Development Deployment (Recommended for Evaluation)

The project includes pre-configured automation scripts for Windows:

```bash
# Clone the repository
cd "c:\Users\Alok\Desktop\TRUSTCHAIN AI"

# Run the unified Windows startup script
.\start_dev.bat
# Or via PowerShell:
.\start_dev.ps1
```

### Manual Step-by-Step Local Run

#### Terminal 1 — Backend (FastAPI)
```bash
cd backend
python -m venv .venv
# Activate virtual environment
.venv\Scripts\activate   # Windows
# source .venv/bin/activate # Linux/macOS

pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- API Base: `http://127.0.0.1:8000`
- Interactive Swagger Docs: `http://127.0.0.1:8000/docs`

#### Terminal 2 — Frontend (Vite + React)
```bash
cd frontend
npm install
npm run dev
```
- Frontend UI: `http://localhost:5173`

---

## 3. Option B: Containerized Deployment (Docker Compose)

Deploy the entire full-stack platform with a single command:

```bash
docker compose up --build -d
```

### Verified Container Ports:
- **Frontend Dashboard**: `http://localhost:5173` (or `http://localhost:80`)
- **Backend API**: `http://localhost:8000`
- **Health Check**: `http://localhost:8000/api/v1/health`

To view logs or stop services:
```bash
docker compose logs -f
docker compose down
```

---

## 4. Environment Variables Reference

| Variable | Description | Default / Example Value |
| :--- | :--- | :--- |
| `PROJECT_NAME` | Application Title | `TrustChain AI` |
| `ENVIRONMENT` | Deployment Environment | `development` / `production` |
| `API_V1_STR` | API Version Prefix | `/api/v1` |
| `SECRET_KEY` | JWT Signing Secret | `your-cryptographic-secret-key-32chars` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Session Duration | `1440` (24 Hours) |
| `BACKEND_CORS_ORIGINS` | Permitted Frontend Origins | `["http://localhost:5173", "http://127.0.0.1:5173"]` |
| `UPLOAD_DIR` | Local Directory for Processed Files | `./uploads` |
| `MAX_UPLOAD_SIZE_MB`| Max Allowed File Upload Size | `10` |
| `ETH_NETWORK` | Target Blockchain Network | `sepolia` |
| `SEPOLIA_RPC_URL` | Ethereum JSON-RPC Endpoint | `https://rpc.sepolia.org` |
| `CONTRACT_ADDRESS` | Deployed Registry Address | `0x5FbDB2315678afecb367f032d93F642f64180aa3` |
| `USE_LOCAL_FALLBACK` | Offline / Sandbox Mode Flag | `true` |

