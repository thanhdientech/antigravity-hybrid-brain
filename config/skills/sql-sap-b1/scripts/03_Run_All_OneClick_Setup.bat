@echo off
chcp 65001 >nul
echo ============================================================================
echo   CAI DAT TU DONG USER SQL VA USER WINDOWS DUNG CHUNG CHO ENTERPRISE AI AGENT
echo   - May chu dang chay    : %COMPUTERNAME% (Ho tro Server A, Server C, Server B...)
echo   - Tai khoan dung chung : sap_readonly_user
echo   - Mat khau dung chung  : CHANGE_ME_STRONG_RO_PASSWORD!
echo   - Quyen han            : Chi lay data (Read-Only), khong can thiep he thong
echo ============================================================================
echo.

:: Kiem tra quyen Administrator
net session >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [CANH BAO] Vui long click phai vao file nay va chon "Run as administrator"!
    pause
    exit /b 1
)

:: 1. Chay PowerShell tao Windows Local Limited User
echo [BUOC 1/2] Dang tao/cap nhat Windows Local User [sap_readonly_user] (Standard User)...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp002_Create_Windows_Limited_Agent_User.ps1"
echo.

:: 2. Chay SQLCMD tao SQL Server Read-Only User tren localhost
echo [BUOC 2/2] Dang tao/cap nhat SQL Server Read-Only Login/User [sap_readonly_user]...
sqlcmd -S localhost -E -C -i "%~dp001_Create_SQL_ReadOnly_Agent_User.sql" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    sqlcmd -S localhost -E -i "%~dp001_Create_SQL_ReadOnly_Agent_User.sql"
) else (
    sqlcmd -S localhost -E -C -i "%~dp001_Create_SQL_ReadOnly_Agent_User.sql"
)

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [CAN DANG NHAP SQL SA] Tai khoan Windows hien tai khong co quyen sysadmin trong SQL Server.
    set /p SA_PASS="--> Nhap mat khau user [sa] cua SQL Server tren may nay roi bam Enter: "
    sqlcmd -S localhost -U sa -P "%SA_PASS%" -C -i "%~dp001_Create_SQL_ReadOnly_Agent_User.sql"
    if %ERRORLEVEL% NEQ 0 (
        sqlcmd -S localhost -U sa -P "%SA_PASS%" -i "%~dp001_Create_SQL_ReadOnly_Agent_User.sql"
    )
    if %ERRORLEVEL% EQU 0 (
        echo [OK] Da cai dat xong SQL Server Read-Only User [sap_readonly_user] bang tai khoan sa!
    ) else (
        echo [THONG BAO] Vui long mo file 01_Create_SQL_ReadOnly_Agent_User.sql trong SSMS va bam F5 ^(Execute^).
    )
) else (
    echo [OK] Da cai dat xong SQL Server Read-Only User [sap_readonly_user] tren tat ca DB SAP B1!
)

echo.
echo ============================================================================
echo   HOAN TAT CAI DAT TREN MAY [%COMPUTERNAME%]!
echo ============================================================================
pause
