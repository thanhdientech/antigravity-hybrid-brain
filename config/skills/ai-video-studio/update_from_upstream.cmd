@echo off
chcp 65001 >nul
title Cập Nhật AI Video Studio Từ Git Gốc (Nguyen Tat Kiem)
echo ==============================================================================
echo  KIEM TRA VA CAP NHAT AI VIDEO STUDIO TU GIT GOC:
echo  Repo Upstream: https://github.com/nguyentatkiem/ai-video-studio.git
echo  Tac gia: Nguyen Tat Kiem (MIT License)
echo ==============================================================================
echo.

set "TARGET_DIR=%~dp0"
set "TEMP_DIR=%TEMP%\ai-video-studio-update"

echo [1/3] Dang tai ban moi nhat tu nhanh main...
if exist "%TEMP_DIR%" rd /s /q "%TEMP_DIR%"
git clone --depth 1 https://github.com/nguyentatkiem/ai-video-studio.git "%TEMP_DIR%"
if errorlevel 1 (
    echo [LOI] Khong the ket noi den GitHub repo goc. Vui long kiem tra lai mang!
    pause
    exit /b 1
)

echo [2/3] Dong bo ma nguon moi vao thu muc skill...
robocopy "%TEMP_DIR%" "%TARGET_DIR%" /E /XD .git >nul
rd /s /q "%TEMP_DIR%"

echo [3/3] Cap nhat hoan tat! Chay install de kiem tra thu vien bo sung...
call "%TARGET_DIR%install.cmd"

echo.
echo ==============================================================================
echo  DA CAP NHAT THANH CONG BAN MOI NHAT TU NGUYEN TAT KIEM!
echo ==============================================================================
pause
