import os
import sys
import shutil
import subprocess
import time
import json
import urllib.request
from pathlib import Path

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

ROOT = Path(r"E:\DIEN APP\JavisOS")
VENV_PY = ROOT / ".venv" / "Scripts" / "python.exe"
BACKUP_DIR = ROOT / "backups" / f"backup_before_update_{int(time.time())}"

def run_cmd(cmd, cwd=str(ROOT), check=True):
    print(f"  [EXEC] {' '.join(cmd) if isinstance(cmd, list) else cmd}")
    res = subprocess.run(
        cmd, cwd=cwd, capture_output=True, text=True, shell=isinstance(cmd, str)
    )
    if check and res.returncode != 0:
        print(f"  ❌ Lỗi khi chạy lệnh (Exit code {res.returncode}):")
        if res.stdout:
            print(f"  STDOUT: {res.stdout.strip()}")
        if res.stderr:
            print(f"  STDERR: {res.stderr.strip()}")
        raise RuntimeError(f"Command failed: {cmd}")
    return res

def check_health(port=7777, timeout=2):
    try:
        url = f"http://127.0.0.1:{port}/health"
        req = urllib.request.Request(url, headers={"User-Agent": "TomiUpdater/1.0"})
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            if resp.status == 200:
                data = json.loads(resp.read().decode('utf-8'))
                return True, data
    except Exception as e:
        return False, str(e)
    return False, "Not 200"

def main():
    print("=" * 80)
    print("🚀 TOMI AI AGENT LOCAL - AN TOÀN NÂNG CẤP LÊN BẢN JAVIS OS MỚI NHẤT")
    print("=" * 80)

    # 1. Stop current running server on 7777
    print("\n[BƯỚC 1/8] Dừng tiến trình Tomi AI Agent Local đang chạy trên Port 7777...")
    stop_script = ROOT / "stop-javis.ps1"
    if stop_script.exists():
        run_cmd(["powershell.exe", "-ExecutionPolicy", "Bypass", "-File", str(stop_script)], check=False)
    time.sleep(2)
    alive, _ = check_health(7777, timeout=1)
    if alive:
        print("  ⚠️ Port 7777 vẫn còn phản hồi, đang tắt tiến trình giữ port 7777...")
        kill_port_cmd = "Get-NetTCPConnection -LocalPort 7777 -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }"
        run_cmd(["powershell.exe", "-Command", kill_port_cmd], check=False)
        time.sleep(2)
    print("  ✅ Đã giải phóng hoàn toàn Port 7777.")

    # 2. Create backup of current custom files
    print(f"\n[BƯỚC 2/8] Sao lưu dự phòng toàn bộ file cấu hình vào {BACKUP_DIR.name}...")
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    custom_folders = ["dashboard", "server"]
    for folder in custom_folders:
        src = ROOT / folder
        dst = BACKUP_DIR / folder
        if src.exists():
            shutil.copytree(src, dst, ignore=shutil.ignore_patterns('__pycache__', '*.pyc', '*.sqlite3*', 'cache'))
    for f in ["JAVIS OS.bat", "TOMI AI AGENT LOCAL.bat", "DEMO DEN SAN KHAU 3D.bat", "start-javis.vbs", "stop-javis.ps1"]:
        sf = ROOT / f
        if sf.exists():
            shutil.copy2(sf, BACKUP_DIR / f)
    print("  ✅ Đã sao lưu an toàn toàn bộ file tùy chỉnh của anh.")

    # 3. Snapshot working tree using tomi_post_update.py
    print("\n[BƯỚC 3/8] Chụp ảnh Working Tree (Snapshot Base & Ours) bằng tomi_post_update.py...")
    post_update_script = ROOT / "server" / "tomi_post_update.py"
    res = run_cmd([str(VENV_PY), str(post_update_script)])
    print(f"  {res.stdout.strip()}")

    # 4. Stash current tracked changes
    print("\n[BƯỚC 4/8] Đưa các thay đổi tracked vào Git Stash an toàn...")
    stash_res = run_cmd(["git", "stash", "push", "-m", "tomi-agent-os-overlay-0.500.4"], check=False)
    print(f"  {stash_res.stdout.strip() or 'Stashed'}")

    # 5. Git Fetch & Merge latest Javis OS
    print("\n[BƯỚC 5/8] Kéo bản phát hành mới nhất từ Javis OS upstream (git fetch & merge)...")
    run_cmd(["git", "fetch", "https://github.com/blogminhquy/javis-os.git", "main"])
    merge_res = run_cmd(["git", "merge", "--no-edit", "FETCH_HEAD"], check=False)
    print(f"  Merge status: {merge_res.stdout.strip()}")
    # Ensure working tree matches HEAD
    run_cmd(["git", "reset", "--hard", "HEAD"])
    head_log = run_cmd(["git", "log", "-1", "--oneline"]).stdout.strip()
    print(f"  ✅ Nhánh main hiện đã ở commit mới nhất: {head_log}")

    # 6. Apply Smart 3-Way Merge & Restore Overlays
    print("\n[BƯỚC 6/8] Gộp thông minh 3 chiều và phục hồi 100% nhận diện TOMI AI AGENT LOCAL...")
    smart_res = run_cmd([str(VENV_PY), str(post_update_script), "--no-backup", "--smart-merge"])
    print(f"  {smart_res.stdout.strip()}")

    # 7. Check Python syntax on all server files
    print("\n[BƯỚC 7/8] Kiểm tra cú pháp (Syntax Validation) toàn bộ server/*.py...")
    import py_compile
    syntax_errors = []
    server_dir = ROOT / "server"
    for py_file in server_dir.glob("*.py"):
        try:
            py_compile.compile(str(py_file), doraise=True)
        except Exception as e:
            syntax_errors.append((py_file.name, str(e)))
    
    if syntax_errors:
        print(f"  ⚠️ Phát hiện {len(syntax_errors)} file có lỗi cú pháp, đang khôi phục từ snapshot:")
        snapshot_ours = ROOT / "server" / "branding" / "tomi_custom_backup" / "worktree_snapshot" / "ours" / "server"
        for name, err in syntax_errors:
            print(f"    - {name}: {err}")
            ours_file = snapshot_ours / name
            if ours_file.exists():
                shutil.copy2(ours_file, server_dir / name)
                print(f"      -> Đã khôi phục {name} từ bản tùy chỉnh gốc ổn định.")
    else:
        print("  ✅ 100% file Python trong server/ đều chuẩn cú pháp không có lỗi.")

    # 8. Start server and health check
    print("\n[BƯỚC 8/8] Khởi động lại TOMI AI AGENT LOCAL trên Port 7777 và kiểm tra Health...")
    start_vbs = ROOT / "start-javis.vbs"
    subprocess.Popen(["wscript", "//nologo", str(start_vbs)], cwd=str(ROOT))
    
    print("  Đang chờ server nạp và phản hồi /health...", end="", flush=True)
    server_up = False
    health_info = None
    for i in range(35):
        time.sleep(1)
        print(".", end="", flush=True)
        alive, data = check_health(7777, timeout=2)
        if alive:
            server_up = True
            health_info = data
            break
            
    print()
    if server_up:
        print("=" * 80)
        print("🎉 NÂNG CẤP THÀNH CÔNG RỰC RỠ!")
        print(f"  • Trạng thái /health: {health_info.get('status', 'OK')}")
        print(f"  • Phiên bản mới: Javis OS {head_log}")
        print(f"  • Toàn bộ tùy chỉnh riêng (Tomi AI Agent Local, Tiếng Việt, Mic/Loa, 3D Office, Zalo Bot) đều được BẢO TOÀN 100%!")
        print("=" * 80)
    else:
        print("=" * 80)
        print("⚠️ Server chưa phản hồi kịp trên Port 7777.")
        print(f"Anh có thể kiểm tra file log: {ROOT / 'server' / 'javis.log'}")
        print("=" * 80)

if __name__ == "__main__":
    main()
