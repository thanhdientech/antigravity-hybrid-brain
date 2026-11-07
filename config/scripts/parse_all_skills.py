import os
import sys
import yaml
import re

sys.stdout.reconfigure(encoding='utf-8')

skills_dir = r"C:\Users\INFOASIA\.gemini\config\skills"
data = []

for name in sorted(os.listdir(skills_dir)):
    p = os.path.join(skills_dir, name)
    skill_md = os.path.join(p, "SKILL.md")
    if os.path.isdir(p) and os.path.exists(skill_md):
        with open(skill_md, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
        
        # Frontmatter
        fm_match = re.match(r"^---\s*\n(.*?)\n---", content, re.DOTALL)
        desc, group = "", ""
        if fm_match:
            try:
                fm = yaml.safe_load(fm_match.group(1))
                if isinstance(fm, dict):
                    desc = fm.get("description", "")
                    group = fm.get("group", "")
            except Exception:
                pass
        
        # Triggers
        triggers = ""
        trig_match = re.search(r"TRIGGERS:\s*([^\n\r]+)", content)
        if trig_match:
            triggers = trig_match.group(1).strip()
        
        scripts = os.listdir(os.path.join(p, "scripts")) if os.path.exists(os.path.join(p, "scripts")) else []
        refs = os.listdir(os.path.join(p, "references")) if os.path.exists(os.path.join(p, "references")) else []
        
        data.append({
            "name": name,
            "desc": desc,
            "group": group or "Khác",
            "triggers": triggers,
            "scripts": scripts,
            "refs_count": len(refs)
        })

print(f"Total skills found: {len(data)}")
for d in data:
    print(f"| `{d['name']}` | {d['group']} | {d['desc']} | Refs: {d['refs_count']} | Scripts: {len(d['scripts'])} |")
