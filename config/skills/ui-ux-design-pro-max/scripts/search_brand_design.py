#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Tra cứu nhanh 84+ hồ sơ hệ thống giao diện thương hiệu quốc tế (DESIGN.md) trong ui-ux-design-pro-max."""
import argparse
import os
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

BRANDS_DIR = Path(__file__).resolve().parent.parent / "skills" / "04_awesome-brand-design-md" / "brands"


def list_or_search(query: str = "", show_full: str = ""):
    if not BRANDS_DIR.exists():
        print(f"Không tìm thấy thư mục brands: {BRANDS_DIR}", file=sys.stderr)
        return 1

    if show_full:
        target = BRANDS_DIR / show_full.lower() / "DESIGN.md"
        if not target.exists():
            print(f"Không tìm thấy thương hiệu '{show_full}'. Chạy --list để xem danh sách.", file=sys.stderr)
            return 1
        print(target.read_text(encoding="utf-8", errors="replace"))
        return 0

    q_tokens = [t.lower() for t in query.split() if t.strip()]
    results = []
    for brand_dir in sorted(BRANDS_DIR.iterdir()):
        if not brand_dir.is_dir():
            continue
        dmd = brand_dir / "DESIGN.md"
        rmd = brand_dir / "README.md"
        if not dmd.exists():
            continue
        text = dmd.read_text(encoding="utf-8", errors="replace")
        first_lines = " ".join([ln.strip() for ln in text.splitlines()[:18] if ln.strip()])
        haystack = f"{brand_dir.name} {first_lines}".lower()
        if not q_tokens or all(tok in haystack for tok in q_tokens) or any(tok in brand_dir.name.lower() for tok in q_tokens):
            score = sum(3 if tok in brand_dir.name.lower() else (1 if tok in haystack else 0) for tok in q_tokens)
            results.append((score, brand_dir.name, dmd, first_lines[:180]))

    if q_tokens:
        results.sort(key=lambda x: (-x[0], x[1]))

    print(f"Tìm thấy {len(results)} hệ thống DESIGN.md khớp truy vấn '{query or 'ALL'}':")
    for score, name, path, summary in results[:25]:
        print(f"  • [{name}] -> {path}")
        print(f"    {summary}...")
    return 0


def main():
    parser = argparse.ArgumentParser(description="Search 84+ world-class brand DESIGN.md systems")
    parser.add_argument("query", nargs="?", default="", help="Từ khóa ngành nghề, phong cách hoặc tên thương hiệu (vd: stripe, apple, fintech, editorial, dark)")
    parser.add_argument("--brand", default="", help="In toàn văn DESIGN.md của 1 thương hiệu cụ thể (vd: linear.app, stripe, apple, wired)")
    args = parser.parse_args()
    sys.exit(list_or_search(args.query, args.brand))


if __name__ == "__main__":
    main()
