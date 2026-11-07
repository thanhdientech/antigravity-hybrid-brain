import os
import sys
import shutil
from pathlib import Path

# Ensure UTF-8
sys.stdout.reconfigure(encoding='utf-8')

CONFIG_DIR = Path(r"C:\Users\INFOASIA\.gemini\config")
SKILLS_DIR = CONFIG_DIR / "skills"

def step1_craft_anything():
    print("\n--- [1] Xử lý craft-anything ---")
    craft_skill = SKILLS_DIR / "craft-anything"
    bin_dir = craft_skill / "bin"
    bin_dir.mkdir(parents=True, exist_ok=True)
    
    # Ensure craft-anything-cli.exe is in bin/
    src_cli = Path(r"E:\DIEN APP\Skill AI\craft-anything\bin\craft-anything-cli.exe")
    dst_cli = bin_dir / "craft-anything-cli.exe"
    if src_cli.exists() and not dst_cli.exists():
        shutil.copy2(src_cli, dst_cli)
        print("  ✓ Đã copy craft-anything-cli.exe vào skill bin/")
    else:
        print("  ✓ craft-anything-cli.exe đã sẵn sàng trong bin/")

    # Update SKILL.md
    skill_md = craft_skill / "SKILL.md"
    if skill_md.exists():
        txt = skill_md.read_text(encoding='utf-8')
        txt = txt.replace(r"E:\DIEN APP\Skill AI\craft-anything\bin\craft-anything-cli.exe", r".\bin\craft-anything-cli.exe")
        txt = txt.replace(r"E:\DIEN APP\Skill AI\craft-anything\bin\craft-anything.exe", r".\bin\craft-anything.exe")
        txt = txt.replace(r"E:\DIEN APP\Skill AI\craft-anything", r". (Tự chứa 100% trong Skill)")
        skill_md.write_text(txt, encoding='utf-8')
        print("  ✓ Đã cập nhật craft-anything/SKILL.md thành đường dẫn tương đối.")

def step2_copy_rea_engine():
    print("\n--- [2] Xử lý reverse-engineer-anything (REA) ---")
    rea_skill = SKILLS_DIR / "reverse-engineer-anything"
    engine_dir = rea_skill / "engine"
    src_rea = Path(r"E:\DIEN APP\Skill AI\rea")
    
    if src_rea.exists():
        engine_dir.mkdir(parents=True, exist_ok=True)
        # Copy core folders needed for runtime
        for item in ["dist", "scripts", "assets", "native", "package.json", "package-lock.json", "licenses", "server.json"]:
            s = src_rea / item
            d = engine_dir / item
            if s.exists():
                if s.is_dir():
                    if not d.exists():
                        shutil.copytree(s, d)
                        print(f"  ✓ Copied {item}/ vào rea/engine/")
                else:
                    shutil.copy2(s, d)
                    print(f"  ✓ Copied {item} vào rea/engine/")
                    
        # Copy node_modules locally so it runs right from Drive C
        s_nm = src_rea / "node_modules"
        d_nm = engine_dir / "node_modules"
        if s_nm.exists() and not d_nm.exists():
            print("  ⏳ Đang sao chép node_modules vào rea/engine/ (chạy ngầm trên ổ C)...")
            shutil.copytree(s_nm, d_nm, ignore=shutil.ignore_patterns('.cache', '*.log'))
            print("  ✓ Đã sao chép node_modules vào rea/engine/")
            
    # Update rea SKILL.md and references
    skill_md = rea_skill / "SKILL.md"
    if skill_md.exists():
        txt = skill_md.read_text(encoding='utf-8')
        txt = txt.replace(r"E:\DIEN APP\Skill AI\rea\scripts\rea.mjs", r".\engine\scripts\rea.mjs")
        txt = txt.replace(r"E:\DIEN APP\Skill AI\rea", r".\engine")
        skill_md.write_text(txt, encoding='utf-8')
        print("  ✓ Đã cập nhật reverse-engineer-anything/SKILL.md")

    ref_md = rea_skill / "references" / "01-cam-nang-thuc-chien-rea-tieng-viet.md"
    if ref_md.exists():
        txt = ref_md.read_text(encoding='utf-8')
        txt = txt.replace(r"E:\DIEN APP\Skill AI\rea\scripts\rea.mjs", r"scripts\rea.mjs")
        txt = txt.replace(r"E:\DIEN APP\Skill AI\rea", r".\engine")
        ref_md.write_text(txt, encoding='utf-8')
        print("  ✓ Đã cập nhật 01-cam-nang-thuc-chien-rea-tieng-viet.md")

def step3_update_mcp_config():
    print("\n--- [3] Cập nhật mcp_config.json về chuẩn Portable ---")
    mcp_path = CONFIG_DIR / "mcp_config.json"
    if mcp_path.exists():
        import json
        data = json.loads(mcp_path.read_text(encoding='utf-8'))
        servers = data.get("mcpServers", {})
        
        # 1. antigravity-tools -> config/scripts/antigravity_mcp_server.py
        if "antigravity-tools" in servers:
            servers["antigravity-tools"]["args"] = [
                "-u",
                str(CONFIG_DIR / "scripts" / "antigravity_mcp_server.py")
            ]
            print("  ✓ antigravity-tools: trỏ về config/scripts/antigravity_mcp_server.py")
            
        # 2. craft-anything -> config/skills/craft-anything/bin/craft-anything-cli.exe
        if "craft-anything" in servers:
            cli_path = CONFIG_DIR / "skills" / "craft-anything" / "bin" / "craft-anything-cli.exe"
            servers["craft-anything"]["command"] = f"\\\\?\\{cli_path}"
            print("  ✓ craft-anything: trỏ về config/skills/craft-anything/bin/craft-anything-cli.exe")
            
        # 3. rea -> config/skills/reverse-engineer-anything/engine/scripts/rea.mjs
        if "rea" in servers:
            rea_script = CONFIG_DIR / "skills" / "reverse-engineer-anything" / "engine" / "scripts" / "rea.mjs"
            if rea_script.exists():
                servers["rea"]["args"] = [str(rea_script), "mcp"]
                print("  ✓ rea: trỏ về config/skills/reverse-engineer-anything/engine/scripts/rea.mjs")

        mcp_path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding='utf-8')
        print("  ✓ Đã lưu mcp_config.json hoàn chỉnh.")

def step4_depersonalize_all_markdowns():
    print("\n--- [4] Khử cá nhân hóa & Chuyển đường dẫn cứng trong toàn bộ Markdown ---")
    count_files = 0
    replacements = 0
    
    # Target patterns
    pats = [
        (r"E:\DIEN APP\Skill AI\agency-agents", r"./departments"),
        (r"E:/DIEN APP/Skill AI/agency-agents", r"./departments"),
        (r"E:\DIEN APP\Skill AI\prompts-chat", r"./data"),
        (r"E:/DIEN APP/Skill AI/prompts-chat", r"./data"),
        (r"E:\DIEN APP\Skill AI\craft-anything\bin", r"./bin"),
        (r"E:\DIEN APP\Skill AI\craft-anything", r"."),
        (r"E:\DIEN APP\Skill AI\rea\scripts\rea.mjs", r"./engine/scripts/rea.mjs"),
        (r"E:\DIEN APP\Skill AI\rea", r"./engine"),
        (r"E:\DIEN APP\Skill AI\awesome-opus5-5-videos", r"<awesome-opus5-5-videos>"),
        (r"E:\DIEN APP\Skill AI\create and edit video", r"<video-project-dir>"),
        (r"E:\DIEN APP\Skill AI\editor video ai", r"<video-editor-repos>"),
    ]
    
    for md_file in SKILLS_DIR.rglob("*.md"):
        if ".git" in md_file.parts or "node_modules" in md_file.parts:
            continue
        try:
            txt = md_file.read_text(encoding='utf-8')
            orig = txt
            for old_pat, new_pat in pats:
                if old_pat in txt:
                    txt = txt.replace(old_pat, new_pat)
            if txt != orig:
                md_file.write_text(txt, encoding='utf-8')
                count_files += 1
                print(f"  ✓ Đã khử đường dẫn cứng trong: {md_file.relative_to(SKILLS_DIR)}")
        except Exception as e:
            pass
            
    print(f"  Hoàn tất khử cá nhân hóa trên {count_files} files markdown.")

if __name__ == "__main__":
    step1_craft_anything()
    step2_copy_rea_engine()
    step3_update_mcp_config()
    step4_depersonalize_all_markdowns()
    print("\n🎉 TOÀN BỘ SKILL ĐÃ ĐƯỢC GOM CHUNG VỀ %USERPROFILE%\\.gemini\\config\\ VÀ KHỬ CÁ NHÂN HÓA THÀNH CÔNG!")
