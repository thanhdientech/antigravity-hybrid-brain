r"""
Công cụ Kiểm tra Bản cập nhật Mới từ Git Gốc cho Toàn bộ Hệ sinh thái Skill Antigravity & Javis.
Chế độ mặc định: READ-ONLY 100% (dùng `git ls-remote` siêu nhẹ, 0 tốn ổ cứng, 0 ghi đè bản Việt hóa SKILL.md).

Cách chạy:
  python ~/.gemini/config/scripts/check_skill_git_updates.py
  python ~/.gemini/config/scripts/check_skill_git_updates.py --changelog
  python ~/.gemini/config/scripts/check_skill_git_updates.py --json
"""
import argparse
import concurrent.futures
import json
import os
import subprocess
import sys
from datetime import datetime

sys.stdout.reconfigure(encoding="utf-8")

GLOBAL_SKILLS_DIR = os.path.expanduser(os.path.join("~", ".gemini", "config", "skills"))
EXTRA_SOURCE_ROOTS = [
    os.environ.get("AGY_SKILL_SOURCE_DIR", ""),
    os.path.join(os.environ.get("AGY_SKILL_SOURCE_DIR", ""), "blueprint-repos"),
    os.path.join(os.environ.get("AGY_SKILL_SOURCE_DIR", ""), "ui-workflow-repos"),
    os.path.join(os.environ.get("AGY_SKILL_SOURCE_DIR", ""), "ui-audit-repos"),
]
MANIFEST_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "skill_upstreams.json")

# Bảng ánh xạ các kho nguồn cục bộ sang Global Skill tương ứng
LOCAL_REPO_TO_SKILL = {
    "rea": "reverse-engineer-anything",
    "ifixai": "ifixai-agent-auditor",
    "PromptDirector": "lam-phim-video-master (13_PromptDirector)",
    "awesome-opus5-5-videos": "lam-phim-video-master (12_awesome-opus-703-prompts)",
    "opus-video-skills": "painted-animation / kinetic-reel",
    "superpowers": "project-blueprint-architect (superpowers)",
    "mattpocock-skills": "project-blueprint-architect (mattpocock)",
    "spec-kit": "project-blueprint-architect (spec-kit)",
    "pm-skills": "project-blueprint-architect (pm-skills)",
    "impeccable": "webapp-app-ux-workflow / ui-ux-cro-auditor (impeccable)",
    "emilkowalski-skill": "webapp-app-ux-workflow (emilkowalski)",
    "vercel-agent-skills": "webapp-app-ux-workflow (vercel-agent-skills)",
    "web-interface-guidelines": "webapp-app-ux-workflow (vercel-wig)",
    "ui-design-brain": "webapp-app-ux-workflow (ui-design-brain)",
    "ui-skills": "webapp-app-ux-workflow (ibelick-ui-skills)",
    "callstack-rn-skills": "webapp-app-ux-workflow (callstack-rn)",
    "flutter-skills": "webapp-app-ux-workflow (flutter-skills)",
    "gstack": "ui-ux-cro-auditor (gstack)",
    "web-quality-skills": "ui-ux-cro-auditor (web-quality-skills)",
    "marketingskills": "ui-ux-cro-auditor (marketingskills)",
    "ux-audit": "ui-ux-cro-auditor (ux-audit)",
    "ui-audit": "ui-ux-cro-auditor (ui-audit)",
    "DeepTutor": "deeptutor-cli",
}


def run_git(args, cwd=None, timeout=15):
    try:
        out = subprocess.check_output(
            ["git"] + args,
            cwd=cwd,
            stderr=subprocess.DEVNULL,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=timeout,
        )
        return out.strip()
    except Exception:
        return ""


def get_remote_head_sha(remote_url: str) -> str:
    out = run_git(["ls-remote", remote_url, "HEAD"], timeout=15)
    if out:
        return out.split()[0].strip()
    return ""


def norm_repo_url(url: str) -> str:
    u = url.strip().lower()
    if u.endswith(".git"):
        u = u[:-4]
    return u.rstrip("/")


def discover_targets():
    targets = []
    seen_paths = set()

    # 1. Quét Global Skills có .git trực tiếp
    if os.path.isdir(GLOBAL_SKILLS_DIR):
        for name in sorted(os.listdir(GLOBAL_SKILLS_DIR)):
            p = os.path.join(GLOBAL_SKILLS_DIR, name)
            if os.path.isdir(os.path.join(p, ".git")):
                origin = run_git(["remote", "get-url", "origin"], cwd=p)
                local_sha = run_git(["rev-parse", "HEAD"], cwd=p)
                local_date = run_git(["log", "-1", "--format=%cs"], cwd=p)
                if origin:
                    seen_paths.add(os.path.normcase(p))
                    targets.append({
                        "skill": name,
                        "tier": "Global (.git trực tiếp)",
                        "local_dir": p,
                        "remote_url": origin,
                        "local_sha": local_sha,
                        "local_date": local_date,
                        "has_git_dir": True,
                    })

    # 2. Quét các kho Git gốc tại thư mục nguồn (nếu có trên máy)
    for src_root in EXTRA_SOURCE_ROOTS:
        if src_root and os.path.isdir(src_root):
            for name in sorted(os.listdir(src_root)):
                p = os.path.join(src_root, name)
                if os.path.isdir(os.path.join(p, ".git")) and os.path.normcase(p) not in seen_paths:
                    origin = run_git(["remote", "get-url", "origin"], cwd=p)
                    local_sha = run_git(["rev-parse", "HEAD"], cwd=p)
                    local_date = run_git(["log", "-1", "--format=%cs"], cwd=p)
                    if origin:
                        seen_paths.add(os.path.normcase(p))
                        mapped_skill = LOCAL_REPO_TO_SKILL.get(name, name)
                        targets.append({
                            "skill": mapped_skill,
                            "tier": f"Kho nguồn ({name})",
                            "local_dir": p,
                            "remote_url": origin,
                            "local_sha": local_sha,
                            "local_date": local_date,
                            "has_git_dir": True,
                        })

    # 3. Nạp thêm từ skill_upstreams.json (cho các skill đã đóng gói không giữ thư mục .git)
    if os.path.isfile(MANIFEST_PATH):
        try:
            with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
                manifest = json.load(f)
            existing_urls = {norm_repo_url(t["remote_url"]) for t in targets}
            for item in manifest.get("tracked_upstreams", []):
                r_url = item.get("remote_url", "")
                if r_url and norm_repo_url(r_url) not in existing_urls:
                    raw_dir = item.get("local_dir", "")
                    resolved_dir = os.path.expanduser(raw_dir) if raw_dir else os.path.join(GLOBAL_SKILLS_DIR, item["skill"].split()[0])
                    targets.append({
                        "skill": item["skill"],
                        "tier": "Manifest Upstream (Portable)",
                        "local_dir": resolved_dir,
                        "remote_url": r_url,
                        "local_sha": item.get("recorded_sha", ""),
                        "local_date": item.get("recorded_date", ""),
                        "has_git_dir": False,
                    })
        except Exception:
            pass

    return targets


def check_single_target(t, fetch_changelog=False):
    remote_sha = get_remote_head_sha(t["remote_url"])
    local_sha = t["local_sha"]
    result = dict(t)
    result["remote_sha"] = remote_sha
    result["new_commits"] = []

    if not remote_sha:
        result["status"] = "ERROR_NETWORK"
        result["label"] = "🔴 Không kết nối được Git gốc"
    elif not local_sha:
        result["status"] = "UNPINNED"
        result["label"] = f"⚪ Chưa ghim SHA cục bộ (Remote HEAD: {remote_sha[:8]})"
    elif local_sha.startswith(remote_sha[:8]) or remote_sha.startswith(local_sha[:8]):
        result["status"] = "UP_TO_DATE"
        result["label"] = "🟢 Đã mới nhất (Up-to-date)"
    else:
        result["status"] = "UPDATE_AVAILABLE"
        result["label"] = f"🟡 CÓ UPDATE MỚI ({local_sha[:7]} -> {remote_sha[:7]})"
        if fetch_changelog and t["has_git_dir"] and os.path.isdir(t["local_dir"]):
            run_git(["fetch", "origin", "--quiet"], cwd=t["local_dir"], timeout=25)
            log_out = run_git(
                ["log", f"{local_sha}..FETCH_HEAD", "--oneline", "-n", "5"],
                cwd=t["local_dir"],
                timeout=10,
            )
            if log_out:
                result["new_commits"] = log_out.splitlines()

    return result


def main():
    parser = argparse.ArgumentParser(description="Kiểm tra cập nhật mới từ Git gốc của toàn bộ Skills.")
    parser.add_argument("--changelog", action="store_true", help="Tải thử danh sách 5 commit mới nhất (chỉ fetch metadata, không sửa file).")
    parser.add_argument("--pin-manifest", action="store_true", help="Ghim SHA hiện tại trên GitHub làm mốc theo dõi cho các skill trong skill_upstreams.json.")
    parser.add_argument("--json", action="store_true", help="Xuất kết quả dạng JSON.")
    args = parser.parse_args()

    targets = discover_targets()
    results = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        futs = [pool.submit(check_single_target, t, args.changelog) for t in targets]
        for fut in futs:
            results.append(fut.result())

    if args.pin_manifest and os.path.isfile(MANIFEST_PATH):
        with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
            manifest = json.load(f)
        sha_map = {r["remote_url"]: r["remote_sha"] for r in results if r["remote_sha"]}
        today = datetime.now().strftime("%Y-%m-%d")
        for item in manifest.get("tracked_upstreams", []):
            if not item.get("recorded_sha") and item.get("remote_url") in sha_map:
                item["recorded_sha"] = sha_map[item["remote_url"]]
                item["recorded_date"] = today
        with open(MANIFEST_PATH, "w", encoding="utf-8", newline="\n") as f:
            json.dump(manifest, f, ensure_ascii=False, indent=2)

    if args.json:
        print(json.dumps(results, ensure_ascii=False, indent=2))
        return

    print("=" * 100)
    print(" 📡 BẢNG KIỂM TRA BẢN CẬP NHẬT MỚI TỪ GIT GỐC CỦA HỆ THỐNG SKILL (READ-ONLY SAFE CHECK)")
    print("=" * 100)
    updates_cnt = 0
    for idx, r in enumerate(results, 1):
        if r["status"] == "UPDATE_AVAILABLE":
            updates_cnt += 1
        l_short = r["local_sha"][:7] if r["local_sha"] else "N/A    "
        r_short = r["remote_sha"][:7] if r["remote_sha"] else "N/A    "
        print(f"[{idx:02d}] {r['skill']:<46} | {r['label']}")
        print(f"     • Nguồn: {r['remote_url']} ({r['tier']})")
        print(f"     • Local SHA: {l_short} ({r['local_date'] or 'N/A'})  <-->  GitHub HEAD: {r_short}")
        for c in r["new_commits"]:
            print(f"       + {c}")
    print("-" * 100)
    print(f"Tổng số kho Git theo dõi: {len(results)} | Có bản cập nhật mới: {updates_cnt}")
    print("💡 LƯU Ý AN TOÀN: Không chạy `git pull` đè thẳng vào thư mục `~/.gemini/config/skills/<skill>`")
    print("   vì sẽ làm mất Frontmatter Tiếng Việt (<=150 ký tự) & khối JAVIS_TRIGGER_ARCHIVE.")
    print("   Quy trình chuẩn: Pull ở thư mục kho nguồn -> Đồng bộ `references/` & `scripts/` -> `agy_sync_and_audit_skills`.")


if __name__ == "__main__":
    main()
