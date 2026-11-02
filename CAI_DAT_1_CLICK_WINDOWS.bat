@echo off
chcp 65001 >nul
title Cai Dat Antigravity 5 Chot Chan + Javis Hybrid Skill Brain (35 Global Skills + 12 Plugins = 94 Skills)
echo ==============================================================================
echo   CAI DAT ANTIGRAVITY: 5 CHOT CHAN + JAVIS HYBRID SKILL BRAIN (1-CLICK)
echo   [35 Global Skills + 12 Plugins + MCP agy-skill-hub + PreInvocation Hook]
echo ==============================================================================
echo.

if not exist "%USERPROFILE%\.gemini\config\skills" mkdir "%USERPROFILE%\.gemini\config\skills"
if not exist "%USERPROFILE%\.gemini\config\plugins" mkdir "%USERPROFILE%\.gemini\config\plugins"
if not exist "%USERPROFILE%\.gemini\config\scripts" mkdir "%USERPROFILE%\.gemini\config\scripts"
if not exist "%USERPROFILE%\.gemini\config\docs" mkdir "%USERPROFILE%\.gemini\config\docs"

echo [1/5] Sao chep Luat Toan Cuc (GEMINI.md, 5 Chot Chan, So tay Nap Tai Lieu, Learned Patterns)...
copy /Y "%~dp0config\GEMINI.md" "%USERPROFILE%\.gemini\config\GEMINI.md" >nul
copy /Y "%~dp0config\QUY_TRINH_CHUNG_5_CHOT_CHAN_CHONG_AO_GIAC_AI.md" "%USERPROFILE%\.gemini\config\QUY_TRINH_CHUNG_5_CHOT_CHAN_CHONG_AO_GIAC_AI.md" >nul
if exist "%~dp0config\HUONG_DAN_NAP_TAI_LIEU_VA_SKILL_ANTIGRAVITY.md" copy /Y "%~dp0config\HUONG_DAN_NAP_TAI_LIEU_VA_SKILL_ANTIGRAVITY.md" "%USERPROFILE%\.gemini\config\HUONG_DAN_NAP_TAI_LIEU_VA_SKILL_ANTIGRAVITY.md" >nul
if exist "%~dp0config\SO_TAY_PROMPT_MAU_GOI_TOAN_BO_SKILL_AGENT.md" copy /Y "%~dp0config\SO_TAY_PROMPT_MAU_GOI_TOAN_BO_SKILL_AGENT.md" "%USERPROFILE%\.gemini\config\SO_TAY_PROMPT_MAU_GOI_TOAN_BO_SKILL_AGENT.md" >nul
if exist "%~dp0config\learned_patterns.md" copy /Y "%~dp0config\learned_patterns.md" "%USERPROFILE%\.gemini\config\learned_patterns.md" >nul
if exist "%~dp0config\docs" xcopy /E /I /H /Y "%~dp0config\docs\*" "%USERPROFILE%\.gemini\config\docs\" >nul

echo [2/5] Sao chep Bo Nao Lai Javis Hybrid Skill Engine ^& Hook (config\scripts)...
xcopy /E /I /H /Y "%~dp0config\scripts\*" "%USERPROFILE%\.gemini\config\scripts\" >nul

echo [3/5] Sao chep Tron Bo 35 Global Skills vao %USERPROFILE%\.gemini\config\skills\...
xcopy /E /I /H /Y "%~dp0config\skills\*" "%USERPROFILE%\.gemini\config\skills\" >nul

echo [4/5] Sao chep Tron Bo 12 Plugins vao %USERPROFILE%\.gemini\config\plugins\...
if exist "%~dp0config\plugins" xcopy /E /I /H /Y "%~dp0config\plugins\*" "%USERPROFILE%\.gemini\config\plugins\" >nul

REM Don dep file GEMINI.md trung lap o thu muc cha de tranh xung dot luat
if exist "%USERPROFILE%\.gemini\GEMINI.md" del /F /Q "%USERPROFILE%\.gemini\GEMINI.md"
if exist "%USERPROFILE%\.gemini\antigravity\GEMINI.md" del /F /Q "%USERPROFILE%\.gemini\antigravity\GEMINI.md"

echo [5/5] Dang ky tu dong MCP Server (agy-skill-hub), PreInvocation Hook ^& Dung chi muc FTS5...
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    python "%USERPROFILE%\.gemini\config\scripts\setup_portable_antigravity.py"
) else (
    echo [LUU Y] Chua tim thay lenh python trong PATH. Hay cai Python 3.11+ va chay CAI_THU_VIEN_PYTHON_CHO_SKILLS.bat!
)

echo.
echo ==============================================================================
echo [HOAN TAT 100%%] Da cai dat 5 Chot Chan + Bo Nao Javis + 35 Global Skills + 12 Plugins = 94 Skills
echo Vi tri: %USERPROFILE%\.gemini\config\
echo Buoc tiep theo: Chay CAI_THU_VIEN_PYTHON_CHO_SKILLS.bat (neu may moi chua cai thu vien Python)
echo ==============================================================================
pause
