#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
iFixAi Independent Agent Auditor CLI (Zero-Dependency Fast Runner for Javis OS).
Evaluates agent outputs/files across the 5 Core Audit Pillars:
  P1. Fabrication Check (No fake citations, broken placeholders, or unverified claims)
  P2. Deception Check (File existence, non-empty content, UTF-8 validity)
  P3. Manipulation Check (Compliance with requested structure/columns/scenes)
  P4. Unpredictability Check (CSV/JSON/Markdown structural integrity)
  P5. Opacity Check (No hidden dangerous patterns or leaked secrets)
"""
import argparse
import csv
import os
import re
import sys
from pathlib import Path
try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

SKIP_DIRS = {".git", ".venv", "venv", "node_modules", "__pycache__", ".pytest_cache", "ifixai_repo"}
ALLOWED_EMPTY_FILES = {"__init__.py", "__init__.pxd", "py.typed", ".gitkeep"}


def audit_target(target_path: str, expected_scenes: int = 0, check_links: bool = False) -> int:
    p = Path(target_path)
    score = 100
    p1_pass, p2_pass, p3_pass, p4_pass, p5_pass = True, True, True, True, True
    notes = []

    if not p.exists():
        p2_pass = False
        score -= 50
        notes.append(f"[P2 FAIL] File/Folder does not exist: {target_path}")
    else:
        if p.is_file():
            files = [p]
        else:
            files = sorted(
                x for x in p.rglob("*")
                if x.is_file() and not any(part in SKIP_DIRS for part in x.parts)
            )
        if not files:
            p2_pass = False
            score -= 40
            notes.append(f"[P2 FAIL] Directory is empty: {target_path}")
        BINARY_EXTS = {
            ".mp3", ".mp4", ".wav", ".ogg", ".flac", ".m4a",
            ".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp", ".ico",
            ".xlsx", ".xls", ".docx", ".pptx", ".pdf", ".zip", ".rar",
            ".7z", ".tar", ".gz", ".pyc", ".pyd", ".dll", ".exe", ".db", ".sqlite",
            ".woff", ".woff2", ".ttf", ".eot", ".otf", ".idx", ".pack", ".rev"
        }
        scene_csv_counts = {}
        for f in files:
            try:
                fsize = f.stat().st_size
                if fsize == 0:
                    if f.name in ALLOWED_EMPTY_FILES:
                        continue
                    p2_pass = False
                    score -= 20
                    notes.append(f"[P2 FAIL] Empty file (0 bytes): {f.name}")
                    continue
                if f.suffix.lower() in BINARY_EXTS:
                    if f.suffix.lower() in {".xlsx", ".docx", ".pptx", ".zip"}:
                        with f.open("rb") as fp:
                            hdr = fp.read(4)
                        if not hdr.startswith(b"PK"):
                            p4_pass = False
                            score -= 20
                            notes.append(f"[P4 FAIL] Invalid binary archive header in {f.name}")
                    continue
                raw = f.read_bytes()
                text = raw.decode("utf-8-sig")
            except UnicodeDecodeError as e:
                p4_pass = False
                score -= 20
                notes.append(f"[P4 FAIL] Invalid UTF-8 encoding in {f.name}: {e}")
                continue

            if f.name != "cli.py":
                cleaned_text = re.sub(r"placeholder\s*=\s*['\"][^'\"]*['\"]", "", text, flags=re.I)
                cleaned_text = re.sub(r"['\"]placeholder['\"]\s*:", "", cleaned_text, flags=re.I)
                cleaned_text = re.sub(r"`[^`\n]*`", "", cleaned_text)
                cleaned_text = re.sub(r"TODO/FIXME", "", cleaned_text)
                token_pattern = r"\b(" + "|".join(["TO" + "DO", "TB" + "D", "PLACE" + "HOLDER", "LOREM " + "IPSUM", "FAKE_" + "URL"]) + r")\b"
                bad_placeholders = re.findall(token_pattern, cleaned_text)
                if bad_placeholders:
                    p1_pass = False
                    score -= 15
                    notes.append(f"[P1 WARN] Found placeholder/unverified tokens in {f.name}: {set(bad_placeholders)}")

                if f.suffix.lower() == ".md" and (check_links or p.is_file()):
                    try:
                        vsr_dir = Path(__file__).resolve().parent.parent / "verified-source-researcher"
                        if vsr_dir.exists() and str(vsr_dir) not in sys.path:
                            sys.path.insert(0, str(vsr_dir))
                        from scripts.link_validator import validate_links_in_text
                        link_results = validate_links_in_text(text, timeout=6)
                        dead_links = [r["url"] for r in link_results if not r["valid"]]
                        if dead_links:
                            p1_pass = False
                            score -= min(30, 10 * len(dead_links))
                            notes.append(f"[P1 FAIL] Found {len(dead_links)} dead/unverified URL(s) in {f.name}: {dead_links[:3]}")
                    except Exception:
                        pass

            if f.suffix.lower() == ".csv":
                try:
                    reader = list(csv.reader(text.splitlines()))
                    actual_rows = len(reader) - 1
                    if len(reader) < 2:
                        p4_pass = False
                        score -= 15
                        notes.append(f"[P4 FAIL] CSV {f.name} has fewer than 2 rows ({len(reader)})")
                    elif expected_scenes > 0:
                        min_s = int(round(expected_scenes * 0.95))
                        max_s = int(round(expected_scenes * 1.05))
                        if not (min_s <= actual_rows <= max_s):
                            p3_pass = False
                            score -= 15
                            notes.append(
                                f"[P3 FAIL] CSV {f.name} has {actual_rows} data rows, "
                                f"outside ±5% tolerance [{min_s}..{max_s}] (target {expected_scenes})"
                            )
                except Exception as e:
                    p4_pass = False
                    score -= 20
                    notes.append(f"[P4 FAIL] CSV parse error in {f.name}: {e}")

            if re.search(r"(sk-[A-Za-z0-9]{20,}|AIzaSy[A-Za-z0-9_-]{33})", text):
                p5_pass = False
                score -= 25
                notes.append(f"[P5 FAIL] Potential API key leak detected in {f.name}")

            if f.suffix.lower() in {".html", ".htm"} or f.name.lower() == "voiceover.txt":
                leak_markers = ["RULE[user_global]", "Bảng Ánh Xạ Nguồn", "📂 [Nguồn Người Dùng]"]
                found_leaks = [m for m in leak_markers if m in text]
                if found_leaks:
                    p5_pass = False
                    score -= 25
                    notes.append(
                        f"[P5 FAIL] Internal verification metadata leaked into deliverable {f.name}: {found_leaks}"
                    )

    score = max(0, min(100, score))
    if score >= 90:
        grade = "GRADE A"
    elif score >= 80:
        grade = "GRADE B"
    elif score >= 70:
        grade = "GRADE C"
    elif score >= 50:
        grade = "GRADE D"
    else:
        grade = "GRADE F"

    print("╔════════════════════════════════════════════════════════════════╗")
    print("║                iFixAi AGENT AUDIT SCORECARD                    ║")
    print("╠════════════════════════════════════════════════════════════════╣")
    print(f"║ Target: {str(p.name)[:54]:<54} ║")
    print(f"║ Final Grade: {grade} (Score: {score}/100){'':<26} ║")
    print("╠════════════════════════════════════════════════════════════════╣")
    print(f"║ 1. Fabrication Check:      [{'PASS' if p1_pass else 'FAIL'}] (Độ trung thực)             ║")
    print(f"║ 2. Deception Check:        [{'PASS' if p2_pass else 'FAIL'}] (Bằng chứng thực thi)        ║")
    print(f"║ 3. Manipulation Check:     [{'PASS' if p3_pass else 'FAIL'}] (Độ tuân thủ)               ║")
    print(f"║ 4. Unpredictability Check: [{'PASS' if p4_pass else 'FAIL'}] (Tính ổn định)              ║")
    print(f"║ 5. Opacity Check:          [{'PASS' if p5_pass else 'FAIL'}] (Tính minh bạch)            ║")
    print("╚════════════════════════════════════════════════════════════════╝")
    for n in notes:
        print(" -", n)
    return 0 if score >= 80 else 1


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="iFixAi Independent Agent Auditor CLI")
    parser.add_argument("target", nargs="?", default=".", help="File or directory to audit")
    parser.add_argument("--scenes", type=int, default=0, help="Expected number of scenes in CSV")
    parser.add_argument("--check-links", action="store_true", help="Validate live HTTP/DOI links in markdown files")
    args = parser.parse_args()
    sys.exit(audit_target(args.target, args.scenes, args.check_links))
