import os
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor

sys.stdout.reconfigure(encoding='utf-8')

# 1. Collect all git repos
base_dirs = [r"E:\DIEN APP\Skill AI", r"E:\DIEN APP"]
all_repos = []

# Top level repos in Skill AI
for item in os.listdir(r"E:\DIEN APP\Skill AI"):
    p = os.path.join(r"E:\DIEN APP\Skill AI", item)
    if os.path.isdir(p) and os.path.exists(os.path.join(p, ".git")):
        all_repos.append({"name": item, "path": p})

# Sub-repos in Skill AI
for parent in ['blueprint-repos', 'ui-workflow-repos', 'ui-audit-repos', 'create and edit video']:
    parent_p = os.path.join(r"E:\DIEN APP\Skill AI", parent)
    if os.path.isdir(parent_p):
        for sub in os.listdir(parent_p):
            sub_p = os.path.join(parent_p, sub)
            if os.path.isdir(sub_p) and os.path.exists(os.path.join(sub_p, ".git")):
                all_repos.append({"name": f"{parent}/{sub}", "path": sub_p})

# Top level in E:\DIEN APP
for item in ["JavisOS", "antigravity-hybrid-brain"]:
    p = os.path.join(r"E:\DIEN APP", item)
    if os.path.isdir(p) and os.path.exists(os.path.join(p, ".git")):
        all_repos.append({"name": item, "path": p})

print(f"🔍 BẮT ĐẦU QUÉT TOÀN DIỆN {len(all_repos)} KHO GIT REPO UPSTREAM TRÊN MÁY...")
print("="*80)

def check_repo(repo):
    name = repo["name"]
    p = repo["path"]
    try:
        # Get remote URL
        url_res = subprocess.run(["git", "-C", p, "remote", "get-url", "origin"], capture_output=True, text=True, timeout=5)
        url = url_res.stdout.strip() if url_res.returncode == 0 else "N/A"
        
        # Git fetch with timeout
        fetch_res = subprocess.run(["git", "-C", p, "fetch", "--quiet"], capture_output=True, text=True, timeout=30)
        
        # Git status check
        status_res = subprocess.run(["git", "-C", p, "status", "-uno"], capture_output=True, text=True, timeout=5)
        out = status_res.stdout.strip()
        
        state = "UNKNOWN"
        diff_info = ""
        
        if "Your branch is up to date" in out:
            state = "UP_TO_DATE"
        elif "Your branch is behind" in out:
            state = "BEHIND"
            # Get count and latest commit
            count_res = subprocess.run(["git", "-C", p, "rev-list", "--count", "HEAD..@{u}"], capture_output=True, text=True, timeout=5)
            log_res = subprocess.run(["git", "-C", p, "log", "-n", "1", "--oneline", "@{u}"], capture_output=True, text=True, timeout=5)
            diff_info = f"Sau {count_res.stdout.strip()} commits | Mới nhất: {log_res.stdout.strip()}"
        elif "Your branch is ahead" in out:
            state = "AHEAD"
            count_res = subprocess.run(["git", "-C", p, "rev-list", "--count", "@{u}..HEAD"], capture_output=True, text=True, timeout=5)
            diff_info = f"Trước {count_res.stdout.strip()} commits (local)"
        elif "have diverged" in out:
            state = "DIVERGED"
        else:
            lines = out.splitlines()
            diff_info = lines[1] if len(lines) > 1 else lines[0]
            
        return {
            "name": name,
            "path": p,
            "url": url,
            "state": state,
            "info": diff_info,
            "error": None
        }
    except Exception as e:
        return {
            "name": name,
            "path": p,
            "url": "N/A",
            "state": "ERROR",
            "info": "",
            "error": str(e)
        }

# Run multi-threaded for fast network fetching
with ThreadPoolExecutor(max_workers=6) as executor:
    results = list(executor.map(check_repo, all_repos))

# Categorize
up_to_date = [r for r in results if r["state"] == "UP_TO_DATE"]
has_updates = [r for r in results if r["state"] == "BEHIND"]
ahead = [r for r in results if r["state"] == "AHEAD"]
others = [r for r in results if r["state"] not in ["UP_TO_DATE", "BEHIND", "AHEAD"]]

print(f"\n📊 BẢNG TỔNG HỢP TRẠNG THÁI CẬP NHẬT ({len(results)} REPOS):")
print(f"  • Đã mới nhất: {len(up_to_date)} repos")
print(f"  • Có bản cập nhật mới trên GitHub (Cần Pull): {len(has_updates)} repos")
print(f"  • Local có commit mới chưa push: {len(ahead)} repos")
if others:
    print(f"  • Trạng thái khác/Lỗi: {len(others)} repos")

if has_updates:
    print("\n" + "="*80)
    print("🔔 DANH SÁCH CÁC REPO CÓ BẢN CẬP NHẬT MỚI TRÊN GITHUB:")
    print("="*80)
    for r in has_updates:
        print(f"\n[REPO] {r['name']}")
        print(f"  🔗 URL: {r['url']}")
        print(f"  📁 Thư mục: {r['path']}")
        print(f"  ⚡ {r['info']}")
        print(f"  👉 Lệnh pull: git -C \"{r['path']}\" pull")

if ahead:
    print("\n" + "="*80)
    print("⬆️ CÁC REPO LOCAL ĐANG ĐI TRƯỚC (AHEAD):")
    print("="*80)
    for r in ahead:
        print(f"  - {r['name']}: {r['info']}")

print("\n" + "="*80)
print("✅ CÁC REPO ĐÃ MỚI NHẤT (UP TO DATE):")
print("="*80)
for r in up_to_date:
    print(f"  ✓ {r['name']:<40} ({r['url']})")

if others:
    print("\n" + "="*80)
    print("⚠️ CÁC REPO KHÁC / LỖI MẠNG:")
    print("="*80)
    for r in others:
        print(f"  ! {r['name']}: {r['state']} - {r['info'] or r['error']}")

print("\n" + "="*80)
print("Hoàn tất quét toàn bộ hệ thống!")
