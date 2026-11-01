@echo off
title TrustChain AI - Service Launcher
echo ======================================================================
echo   TRUSTCHAIN AI - Starting Backend and Frontend Services
echo ======================================================================
echo.

echo [1/2] Starting FastAPI Backend on http://localhost:8000 ...
start "TrustChain AI - Backend" cmd /k "cd /d "%~dp0backend" && .venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

echo [2/2] Starting Vite React Frontend on http://localhost:5173 ...
start "TrustChain AI - Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ======================================================================
echo   Both services are starting!
echo   - Frontend: http://localhost:5173
echo   - Backend Swagger API: http://localhost:8000/docs
echo   - Public Verifier: http://localhost:5173/verify/public
echo ======================================================================
echo.
pause

