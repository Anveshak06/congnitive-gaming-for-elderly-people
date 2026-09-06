@echo off
title NeuroSathi Cognitive Gaming Platform
color 0B

echo ================================================================
echo           NEUROSATHI - COGNITIVE GAMING FOR ELDERLY
echo                with AI Navigation Companion "Sheru"
echo ================================================================
echo.

set ROOT_DIR=%~dp0

:: Check if backend node_modules exists
if not exist "%ROOT_DIR%backend\node_modules\" (
    echo [1/3] Installing backend dependencies...
    cd /d "%ROOT_DIR%backend"
    call npm install
)

:: Check if frontend node_modules exists
if not exist "%ROOT_DIR%frontend\node_modules\" (
    echo [2/3] Installing frontend dependencies...
    cd /d "%ROOT_DIR%frontend"
    call npm install
)

echo.
echo Starting NeuroSathi Backend on port 3001...
start "NeuroSathi Backend (Port 3001)" cmd /c "cd /d "%ROOT_DIR%backend" && node server.js"

echo Starting NeuroSathi Frontend on port 5173...
start "NeuroSathi Frontend (Port 5173)" cmd /c "cd /d "%ROOT_DIR%frontend" && npm run dev"

echo.
echo Waiting for servers to initialize...
timeout /t 3 /nobreak >nul

echo Launching NeuroSathi in default browser...
start http://localhost:5173

echo.
echo ================================================================
echo Both Frontend and Backend are running!
echo Frontend: http://localhost:5173
echo Backend API: http://localhost:3001
echo.
echo Meet "Sheru" the friendly AI navigation dog in the bottom corner!
echo Press any key to close this launcher window (servers remain running).
echo ================================================================
pause >nul
