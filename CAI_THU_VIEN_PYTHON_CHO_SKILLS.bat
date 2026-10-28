@echo off
chcp 65001 >nul
title Cai Dat Thu Vien Python Cho Bo Nao Javis & 21 Skills Antigravity
echo ==============================================================================
echo   CAI DAT THU VIEN PYTHON CHO BO NAO JAVIS ^& 21 SKILLS ANTIGRAVITY (1-CLICK)
echo ==============================================================================
echo.

echo [1/6] Cai thu vien cot loi cho Bo Nao Lai Javis MCP (agy-skill-hub: mcp, pyyaml)...
python -m pip install --upgrade pip
python -m pip install mcp pyyaml

echo.
echo [2/6] Cai thu vien cho antigravity-browser-controller (aiohttp, websockets)...
python -m pip install aiohttp websockets

echo.
echo [3/6] Cai thu vien cho claude-seo ^& verified-source-researcher (requests, bs4, lxml, trafilatura, playwright, openpyxl)...
python -m pip install beautifulsoup4 requests lxml lxml_html_clean urllib3 trafilatura htmldate courlan playwright openpyxl matplotlib numpy

echo.
echo [4/6] Cai thu vien ket noi SQL Server ^& xuat bao cao SAP B1 cho sql-sap-b1 / viet-sql-sap-b1 (pyodbc, pymssql, reportlab)...
python -m pip install pyodbc pymssql reportlab

echo.
echo [5/6] Cai thu vien cho ifixai-agent-auditor Full SDK (pydantic, jsonschema, rich, click, questionary)...
python -m pip install pydantic typing_extensions pyyaml jsonschema click python-dateutil json-repair rich questionary

echo.
echo [6/6] Cai trinh duyet Chromium cho Playwright ^& Khoi tao Chi muc Lai agy_skill_index.db...
python -m playwright install chromium
if exist "%USERPROFILE%\.gemini\config\scripts\setup_portable_antigravity.py" (
    python "%USERPROFILE%\.gemini\config\scripts\setup_portable_antigravity.py"
)

echo.
echo ==============================================================================
echo [HOAN TAT 100%%] Da cai dat day du thu vien Python ^& dung xong chi muc FTS5 + RRF!
echo Hay khoi dong lai Antigravity IDE / CLI (agy) de kich hoat toan bo he thong.
echo ==============================================================================
pause
