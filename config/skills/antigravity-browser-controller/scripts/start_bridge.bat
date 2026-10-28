@echo off
chcp 65001 >nul
title Antigravity Omni-Browser Bridge Server
echo ================================================================
echo ⚡ ĐANG KHỞI ĐỘNG ANTIGRAVITY OMNI-BROWSER BRIDGE SERVER...
echo ================================================================
cd /d "%~dp0"
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    python server.py
) else (
    "%LOCALAPPDATA%\Programs\Python\Python313\python.exe" server.py
)
pause
