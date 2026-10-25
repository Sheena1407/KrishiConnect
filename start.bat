@echo off
title KrishiConnect — Smart AgriTech Platform
color 0A

echo ========================================================
echo    🌾 KrishiConnect — Smart AgriTech Platform
echo    Smart Farming. Better Decisions. Better Harvests.
echo ========================================================
echo.

set PATH=C:\Users\Sheena\AppData\Local\Programs\nodejs;%PATH%

echo [1/3] Checking MongoDB...
start /B "" "C:\Program Files\MongoDB\Server\8.3\bin\mongod.exe" --dbpath "C:\Users\Sheena\.gemini\antigravity\scratch\data\db" --port 27017 --bind_ip 127.0.0.1 >nul 2>&1

echo [2/3] Starting KrishiConnect Application Server...
cd /d "C:\Users\Sheena\.gemini\antigravity\scratch\KrishiConnect\server"

echo [3/3] Launching Web Browser at http://localhost:5000 ...
timeout /t 2 /nobreak >nul
start http://localhost:5000

echo.
echo ========================================================
echo    Application is running at: http://localhost:5000
echo.
echo    Farmer Demo:  farmer@krishiconnect.demo  /  Farmer@123
echo    Admin Demo:   admin@krishiconnect.demo   /  Admin@123
echo.
echo    Press Ctrl+C to stop the server anytime.
echo ========================================================
echo.

node server.js
pause
