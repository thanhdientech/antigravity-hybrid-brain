#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CLI Tìm kiếm nhanh trong kho 299 file .sql chuẩn SAP B1 & Beas Manufacturing
và Kho 24 câu query thực chiến FVIVN (thuộc skill viet-sql-sap-b1).
"""
import os
import sys
import glob

sys.stdout.reconfigure(encoding="utf-8")

SKILL_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REF_DIR = os.path.join(SKILL_DIR, "references")
QUERIES_DIR = os.path.join(REF_DIR, "queries")
FALLBACK_QUERIES_DIR = r"E:\DIEN APP\SQL SAP B1\queries"


def search_queries(keyword: str, max_results: int = 15):
    kw_lower = keyword.lower().strip()
    search_root = QUERIES_DIR if os.path.isdir(QUERIES_DIR) else FALLBACK_QUERIES_DIR
    sql_files = glob.glob(os.path.join(search_root, "**", "*.sql"), recursive=True)
    md_files = glob.glob(os.path.join(REF_DIR, "*.md"))

    matches = []
    for path in sql_files + md_files:
        try:
            with open(path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
        except Exception:
            continue
        rel_name = os.path.relpath(path, SKILL_DIR)
        score = 0
        if kw_lower in os.path.basename(path).lower():
            score += 5
        if kw_lower in rel_name.lower():
            score += 3
        occurrences = content.lower().count(kw_lower)
        if occurrences > 0:
            score += min(occurrences, 10)
        if score > 0:
            matches.append((score, rel_name, path, content))

    matches.sort(key=lambda x: (-x[0], x[1]))
    print(f"=== KẾT QUẢ TÌM KIẾM TỪ KHÓA: '{keyword}' (Tìm thấy {len(matches)} file) ===")
    for idx, (score, rel_name, full_path, content) in enumerate(matches[:max_results], 1):
        preview_lines = [line.strip() for line in content.splitlines() if line.strip()][:6]
        preview = " | ".join(preview_lines)[:220]
        print(f"{idx:02d}. [Điểm {score}] {rel_name} ({os.path.getsize(full_path)} B)")
        print(f"    Trích đoạn: {preview}")
    return 0


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Cách dùng: python search_sap_queries.py <tu_khoa_hoac_ten_bang>")
        sys.exit(0)
    sys.exit(search_queries(" ".join(sys.argv[1:])))
