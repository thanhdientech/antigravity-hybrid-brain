import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

skills_dir = r"C:\Users\INFOASIA\.gemini\config\skills"
for name in sorted(os.listdir(skills_dir)):
    p = os.path.join(skills_dir, name)
    skill_md = os.path.join(p, "SKILL.md")
    if os.path.isdir(p) and os.path.exists(skill_md):
        with open(skill_md, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
        
        # Also check references
        refs_content = ""
        refs_dir = os.path.join(p, "references")
        if os.path.exists(refs_dir):
            for r_file in os.listdir(refs_dir):
                r_path = os.path.join(refs_dir, r_file)
                if os.path.isfile(r_path) and r_path.endswith(('.md', '.txt')):
                    try:
                        with open(r_path, "r", encoding="utf-8", errors="ignore") as rf:
                            refs_content += "\n" + rf.read(5000)
                    except Exception:
                        pass
                        
        all_text = content + "\n" + refs_content
        github_links = re.findall(r'https?://github\.com/[A-Za-z0-9_.\-]+/[A-Za-z0-9_.\-]+', all_text)
        unique_links = list(dict.fromkeys(github_links))
        
        print(f"=== {name} ===")
        if unique_links:
            for l in unique_links:
                print(f"  {l}")
        else:
            print("  (Chưa có link GitHub)")
