import subprocess
import os
import sys

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

REPOS_TO_PULL = [
    ("craft-anything", r"E:\DIEN APP\Skill AI\craft-anything"),
    ("ifixai", r"E:\DIEN APP\Skill AI\ifixai"),
    ("rea", r"E:\DIEN APP\Skill AI\rea"),
    ("mattpocock-skills", r"E:\DIEN APP\Skill AI\blueprint-repos\mattpocock-skills"),
    ("pm-skills", r"E:\DIEN APP\Skill AI\blueprint-repos\pm-skills"),
    ("spec-kit", r"E:\DIEN APP\Skill AI\blueprint-repos\spec-kit"),
    ("superpowers", r"E:\DIEN APP\Skill AI\blueprint-repos\superpowers"),
    ("emilkowalski-skill", r"E:\DIEN APP\Skill AI\ui-workflow-repos\emilkowalski-skill"),
    ("flutter-skills", r"E:\DIEN APP\Skill AI\ui-workflow-repos\flutter-skills"),
    ("impeccable", r"E:\DIEN APP\Skill AI\ui-workflow-repos\impeccable"),
    ("ui-skills", r"E:\DIEN APP\Skill AI\ui-workflow-repos\ui-skills"),
    ("gstack", r"E:\DIEN APP\Skill AI\ui-audit-repos\gstack"),
    ("marketingskills", r"E:\DIEN APP\Skill AI\ui-audit-repos\marketingskills"),
    ("JavisOS", r"E:\DIEN APP\JavisOS"),
]

def pull_repo(name, path):
    if not os.path.exists(path):
        return name, False, f"Thư mục không tồn tại: {path}"
    
    try:
        # Check current status first
        status_proc = subprocess.run(
            ["git", "-C", path, "status", "--porcelain"],
            capture_output=True, text=True, timeout=30
        )
        has_local_changes = bool(status_proc.stdout.strip())
        
        # Git pull
        proc = subprocess.run(
            ["git", "-C", path, "pull", "--ff-only"],
            capture_output=True, text=True, timeout=120
        )
        
        if proc.returncode == 0:
            out = proc.stdout.strip()
            first_line = out.split('\n')[0] if out else "OK"
            return name, True, f"Thành công ({first_line})"
        else:
            # If ff-only failed, attempt regular pull or report why
            proc2 = subprocess.run(
                ["git", "-C", path, "pull", "--rebase"],
                capture_output=True, text=True, timeout=120
            )
            if proc2.returncode == 0:
                return name, True, f"Thành công (rebase: {proc2.stdout.strip().splitlines()[0]})"
            err = proc.stderr.strip() or proc2.stderr.strip()
            return name, False, f"Lỗi ({err})"
    except Exception as e:
        return name, False, f"Ngoại lệ: {str(e)}"

def main():
    print("🚀 BẮT ĐẦU CẬP NHẬT 14 KHO GIT UPSTREAM...")
    print("=" * 80)
    
    results = []
    for name, path in REPOS_TO_PULL:
        print(f"⏳ Đang pull: {name} ...", end=" ", flush=True)
        repo_name, success, msg = pull_repo(name, path)
        status_icon = "✅" if success else "❌"
        print(f"{status_icon} {msg}")
        results.append((repo_name, success, msg))
        
    print("=" * 80)
    success_count = sum(1 for _, s, _ in results if s)
    fail_count = len(results) - success_count
    print(f"🎉 Hoàn tất: {success_count}/{len(results)} repo cập nhật thành công!")
    if fail_count > 0:
        print(f"⚠️ Có {fail_count} repo gặp lỗi cần kiểm tra.")

if __name__ == "__main__":
    main()
