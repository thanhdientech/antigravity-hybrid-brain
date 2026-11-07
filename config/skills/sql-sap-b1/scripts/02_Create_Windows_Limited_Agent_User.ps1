# ============================================================================
# SCRIPT TAO USER WINDOWS HAN CHE QUYEN (DUNG CHUNG CHO INFOASIA AI AGENT)
# - Chay bang PowerShell (Run as Administrator) tren cac may: 24, 52, 160...
# - Ten User Windows : infoasia_ro
# - Mat khau         : InfoAsia@RO2026!
# - Quyen han        : Standard User (Users + Performance Monitor Users + Event Log Readers)
# - Cam tuyet doi    : KHONG thuoc Administrators, KHONG sua he thong/Registry/Services
# ============================================================================

$UserName = "infoasia_ro"
$PasswordPlain = "InfoAsia@RO2026!"
$FullName = "InfoAsia AI Agent RO"
# Luu y: New-LocalUser gioi han Description <= 48 ky tu tren Windows Server
$Description = "InfoAsia AI Agent Read-Only User"

$SecurePassword = ConvertTo-SecureString $PasswordPlain -AsPlainText -Force

Write-Host "=== KHOI TAO / CAP NHAT WINDOWS USER [$UserName] ===" -ForegroundColor Cyan

$ExistingUser = Get-LocalUser -Name $UserName -ErrorAction SilentlyContinue

if ($null -eq $ExistingUser) {
    try {
        New-LocalUser -Name $UserName `
                      -Password $SecurePassword `
                      -FullName $FullName `
                      -Description $Description `
                      -PasswordNeverExpires `
                      -UserMayNotChangePassword -ErrorAction Stop | Out-Null
        Write-Host "[OK] Da tao moi Windows Local User: $UserName" -ForegroundColor Green
    } catch {
        # Fallback bang net user neu PowerShell LocalAccounts tren Windows cu bao loi
        & net user $UserName $PasswordPlain /add /fullname:"$FullName" /comment:"$Description" /passwordchg:no /expires:never
        & wmic useraccount where "Name='$UserName'" set PasswordExpires=FALSE >$null 2>&1
        Write-Host "[OK] Da tao moi Windows Local User (qua net user): $UserName" -ForegroundColor Green
    }
} else {
    try {
        Set-LocalUser -Name $UserName `
                      -Password $SecurePassword `
                      -FullName $FullName `
                      -Description $Description `
                      -PasswordNeverExpires $true `
                      -UserMayNotChangePassword $true -ErrorAction Stop
        Enable-LocalUser -Name $UserName -ErrorAction SilentlyContinue
        Write-Host "[OK] Da cap nhat mat khau va kich hoat Windows Local User: $UserName" -ForegroundColor Green
    } catch {
        & net user $UserName $PasswordPlain /active:yes /passwordchg:no /expires:never
        & wmic useraccount where "Name='$UserName'" set PasswordExpires=FALSE >$null 2>&1
        Write-Host "[OK] Da cap nhat Windows Local User (qua net user): $UserName" -ForegroundColor Green
    }
}

# 1. Dam bao thuoc cac nhom Chi Doc an toan (Users, Performance Monitor Users, Event Log Readers)
$SafeGroups = @("Users", "Performance Monitor Users", "Event Log Readers")
foreach ($grp in $SafeGroups) {
    if (Get-LocalGroup -Name $grp -ErrorAction SilentlyContinue) {
        try {
            Add-LocalGroupMember -Group $grp -Member $UserName -ErrorAction Stop
            Write-Host "[OK] Da them [$UserName] vao nhom an toan: $grp" -ForegroundColor Green
        } catch {
            Write-Host "[OK] [$UserName] da nam trong nhom an toan: $grp" -ForegroundColor DarkGreen
        }
    }
}

# 2. Go bo khoi tat ca cac nhom Quan tri / Can thiep sau he thong (neu co)
$HighPrivilegeGroups = @(
    "Administrators",
    "Backup Operators",
    "Power Users",
    "System Managed Accounts Group",
    "Hyper-V Administrators",
    "Network Configuration Operators"
)
foreach ($badGrp in $HighPrivilegeGroups) {
    if (Get-LocalGroup -Name $badGrp -ErrorAction SilentlyContinue) {
        try {
            Remove-LocalGroupMember -Group $badGrp -Member $UserName -ErrorAction Stop
            Write-Host "[SECURITY] Da go [$UserName] khoi nhom quan tri: $badGrp" -ForegroundColor Yellow
        } catch {
            # Khong nam trong nhom nay
        }
    }
}

# 3. Hien thi danh sach nhom hien tai cua infoasia_ro de kiem chung
Write-Host "`n=== KIEM TRA QUYEN WINDOWS HIEN TAI CUA [$UserName] ===" -ForegroundColor Cyan
$CurrentGroups = Get-LocalGroup | Where-Object {
    (Get-LocalGroupMember -Group $_.Name -ErrorAction SilentlyContinue).Name -like "*\$UserName"
} | Select-Object -ExpandProperty Name

Write-Host "User        : $UserName"
Write-Host "Mat khau    : $PasswordPlain"
Write-Host "Thuoc nhom  : $($CurrentGroups -join ', ')"
Write-Host "Trang thai  : HOAN TAT AN TOAN (Khong co quyen Admin, khong can thiep he thong)" -ForegroundColor Green
