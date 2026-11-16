<#
.SYNOPSIS
    Cập nhật 1 chạm bộ Siêu Hub `marketingskills` từ kho gốc GitHub `coreyhaines31/marketingskills`.
.DESCRIPTION
    Kéo bản mới nhất từ nhánh `main` của `https://github.com/coreyhaines31/marketingskills.git`,
    đồng bộ thư mục `skills/` và `tools/`, tự động dọn bỏ các thư mục `evals/` để giữ tổng số file
    dưới trần `MAX_FILES_PER_SKILL = 600` của Bộ Não Lai Javis (`agy_skill_engine.py`),
    đồng thời bảo toàn 100% file `SKILL.md` gốc Tiếng Việt và thư mục `references/` của hệ thống.
#>
$ErrorActionPreference = "Stop"
$OutputEncoding = [Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$SkillRoot = Split-Path -Parent $PSScriptRoot
$TempClone = Join-Path $env:TEMP ("marketingskills_sync_" + [Guid]::NewGuid().ToString("N").Substring(0, 8))

try {
    Write-Host "[1/4] Cloning latest coreyhaines31/marketingskills..." -ForegroundColor Cyan
    git clone --depth 1 https://github.com/coreyhaines31/marketingskills.git $TempClone

    Write-Host "[2/4] Updating skills/ and tools/ (preserving root SKILL.md and references/)..." -ForegroundColor Cyan
    if (Test-Path "$SkillRoot\skills") { Remove-Item -Recurse -Force "$SkillRoot\skills" }
    if (Test-Path "$SkillRoot\tools")  { Remove-Item -Recurse -Force "$SkillRoot\tools" }

    Copy-Item -Recurse -Force "$TempClone\skills" "$SkillRoot\skills"
    Copy-Item -Recurse -Force "$TempClone\tools"  "$SkillRoot\tools"

    Write-Host "[3/4] Cleaning evals/ directories to stay under 600-file index ceiling..." -ForegroundColor Cyan
    Get-ChildItem -Path "$SkillRoot\skills", "$SkillRoot\tools" -Directory -Recurse -Filter "evals" -ErrorAction SilentlyContinue |
        Remove-Item -Recurse -Force

    Write-Host "[4/4] Re-syncing Javis Hybrid Skill Index (agy_skill_engine.py)..." -ForegroundColor Cyan
    $PyExe = Join-Path $env:LOCALAPPDATA "Programs\Python\Python313\python.exe"
    if (-not (Test-Path $PyExe)) { $PyExe = "python" }
    $EngineScript = Join-Path $env:USERPROFILE ".gemini\config\scripts\agy_skill_engine.py"
    if (Test-Path $EngineScript) {
        & $PyExe $EngineScript
    }
    Write-Host "DONE: marketingskills hub updated successfully!" -ForegroundColor Green
}
finally {
    if (Test-Path $TempClone) { Remove-Item -Recurse -Force $TempClone -ErrorAction SilentlyContinue }
}
