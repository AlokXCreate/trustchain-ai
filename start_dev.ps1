# TrustChain AI Service Launcher (PowerShell)
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "  TRUSTCHAIN AI - Starting Backend and Frontend Services" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan

$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "`n[1/2] Starting FastAPI Backend on http://localhost:8000 ..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\backend'; .\.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

Write-Host "[2/2] Starting Vite React Frontend on http://localhost:5173 ..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\frontend'; npm run dev"

Write-Host "`n======================================================================" -ForegroundColor Green
Write-Host "  Both services launched in separate windows!" -ForegroundColor Green
Write-Host "  - Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host "  - Backend Swagger API: http://localhost:8000/docs" -ForegroundColor Green
Write-Host "  - Public Verifier: http://localhost:5173/verify/public" -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Green

