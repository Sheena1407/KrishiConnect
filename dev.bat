@echo off
title KrishiConnect Dev Server
color 0B

echo Starting KrishiConnect in Development Mode...
set PATH=C:\Users\Sheena\AppData\Local\Programs\nodejs;%PATH%

start /B "" "C:\Program Files\MongoDB\Server\8.3\bin\mongod.exe" --dbpath "C:\Users\Sheena\.gemini\antigravity\scratch\data\db" --port 27017 --bind_ip 127.0.0.1 >nul 2>&1

cd /d "C:\Users\Sheena\.gemini\antigravity\scratch\KrishiConnect\server"
start "KrishiConnect Backend API" cmd /k "set PATH=C:\Users\Sheena\AppData\Local\Programs\nodejs;%PATH% && node server.js"

cd /d "C:\Users\Sheena\.gemini\antigravity\scratch\KrishiConnect\client"
timeout /t 2 /nobreak >nul
start http://localhost:5173
npm run dev -- --host 127.0.0.1
