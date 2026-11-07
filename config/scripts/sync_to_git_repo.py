import os
import shutil
import subprocess

src_config = r"C:\Users\INFOASIA\.gemini\config"
dst_repo = r"E:\DIEN APP\antigravity-hybrid-brain"
dst_config = os.path.join(dst_repo, "config")

print(f"Syncing from {src_config} to {dst_config}...")

# 1. Sync skills
src_skills = os.path.join(src_config, "skills")
dst_skills = os.path.join(dst_config, "skills")
os.makedirs(dst_skills, exist_ok=True)

for skill in os.listdir(src_skills):
    s_path = os.path.join(src_skills, skill)
    d_path = os.path.join(dst_skills, skill)
    if os.path.isdir(s_path):
        if os.path.exists(d_path):
            shutil.rmtree(d_path)
        shutil.copytree(s_path, d_path, ignore=shutil.ignore_patterns('__pycache__', '*.pyc', '.git', 'node_modules'))
        print(f"  Synced skill: {skill}")

# 2. Sync scripts
src_scripts = os.path.join(src_config, "scripts")
dst_scripts = os.path.join(dst_config, "scripts")
os.makedirs(dst_scripts, exist_ok=True)
for item in os.listdir(src_scripts):
    s_path = os.path.join(src_scripts, item)
    d_path = os.path.join(dst_scripts, item)
    if os.path.isfile(s_path):
        shutil.copy2(s_path, d_path)

# 3. Sync top config md files
md_files = [
    "GEMINI.md",
    "QUY_TRINH_CHUNG_5_CHOT_CHAN_CHONG_AO_GIAC_AI.md",
    "SO_TAY_PROMPT_MAU_GOI_TOAN_BO_SKILL_AGENT.md",
    "HUONG_DAN_NAP_TAI_LIEU_VA_SKILL_ANTIGRAVITY.md",
    "learned_patterns.md",
    "mcp_config.json"
]
for f in md_files:
    s = os.path.join(src_config, f)
    d = os.path.join(dst_config, f)
    if os.path.exists(s):
        shutil.copy2(s, d)
        print(f"  Synced config file: {f}")
        # also copy to root of repo if root has it
        root_d = os.path.join(dst_repo, f)
        if os.path.exists(root_d):
            shutil.copy2(s, root_d)

# 4. Copy new documentation guides into root of repo
extra_docs = [
    r"E:\DIEN APP\Skill AI\DANH_MUC_NGUON_GOC_VA_CHECK_UPDATE_SKILLS.md",
    r"E:\DIEN APP\Skill AI\HUONG_DAN_CHI_TIET_CAC_SKILLS_VA_WORKFLOW.md",
    r"E:\DIEN APP\Skill AI\README_GIAI_THICH_TOAN_BO_SKILLS.md",
    r"E:\DIEN APP\Skill AI\check_upstream_updates.py"
]
for src in extra_docs:
    if os.path.exists(src):
        dst = os.path.join(dst_repo, os.path.basename(src))
        shutil.copy2(src, dst)
        print(f"  Copied to repo root: {os.path.basename(src)}")

print("Sync complete.")
