import os
import subprocess
import sys

sys.stdout.reconfigure(encoding='utf-8')

repos = [
    {"name": "craft-anything", "path": r"E:\DIEN APP\Skill AI\craft-anything", "url": "https://github.com/storytold/craft-anything"},
    {"name": "reverse-engineer-anything (rea)", "path": r"E:\DIEN APP\Skill AI\rea", "url": "https://github.com/morluto/rea"},
    {"name": "agency-agents", "path": r"E:\DIEN APP\Skill AI\agency-agents", "url": "https://github.com/msitarzewski/agency-agents"},
    {"name": "javis-os", "path": r"E:\DIEN APP\JavisOS", "url": "https://github.com/blogminhquy/javis-os"}
]

print("="*65)
print("🔍 BỘ QUÉT TỰ ĐỘNG KIỂM TRA CẬP NHẬT REPO UPSTREAM TRÊN GITHUB")
print("="*65)

for repo in repos:
    p = repo["path"]
    name = repo["name"]
    url = repo["url"]
    
    if not os.path.exists(p) or not os.path.exists(os.path.join(p, ".git")):
        print(f"\n[⚠️ KHÔNG TÌM THẤY GIT] {name} tại {p}")
        continue
    
    print(f"\n[🔄 ĐANG KIỂM TRA] {name} ({url})...")
    try:
        # Fetch remote updates
        fetch_res = subprocess.run(["git", "-C", p, "fetch"], capture_output=True, text=True, timeout=30)
        
        # Check status against upstream
        status_res = subprocess.run(["git", "-C", p, "status", "-uno"], capture_output=True, text=True, timeout=10)
        out = status_res.stdout.strip()
        
        if "Your branch is up to date" in out:
            print(f"  ✅ ĐÃ MỚI NHẤT (Up to date with origin)")
        elif "Your branch is behind" in out:
            print(f"  🔔 CÓ BẢN CẬP NHẬT MỚI! (Gõ: git -C \"{p}\" pull)")
        elif "Your branch is ahead" in out:
            print(f"  ⬆️ Local đang có commit chưa push lên remote")
        else:
            lines = out.splitlines()
            summary = lines[1] if len(lines) > 1 else lines[0]
            print(f"  ℹ️ Trạng thái: {summary}")
            
    except Exception as e:
        print(f"  ❌ Lỗi khi kiểm tra: {e}")

print("\n" + "="*65)
print("Hoàn tất kiểm tra!")
