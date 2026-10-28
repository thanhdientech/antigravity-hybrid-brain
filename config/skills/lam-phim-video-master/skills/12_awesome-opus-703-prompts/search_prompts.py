#!/usr/bin/env python3
"""
Awesome Opus 5.5 Video Prompts Search CLI
Search and extract prompt recipes from 703 viral code-as-video prompts.
"""

import os
import sys
import json
import argparse
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = Path(__file__).parent
DATA_FILE = BASE_DIR / "data" / "videos.json"

def load_videos():
    if not DATA_FILE.exists():
        print(f"[-] Data file not found: {DATA_FILE}")
        return []
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def search_prompts(query=None, category=None, tech=None, limit=5):
    videos = load_videos()
    results = []

    for v in videos:
        # Filter by category
        if category and v.get("category", "").lower() != category.lower():
            continue
        
        # Filter by tech
        if tech:
            tags = [t.lower() for t in v.get("tech_tags", [])]
            if tech.lower() not in tags:
                continue

        # Filter by query text
        if query:
            q = query.lower()
            text_to_search = f"{v.get('slug', '')} {v.get('author', '')} {v.get('prompt', '')} {' '.join(v.get('tech_tags', []))}".lower()
            if q not in text_to_search:
                continue

        results.append(v)

    return results[:limit]

def main():
    parser = argparse.ArgumentParser(description="Search 703 Claude Opus 5.5 Video Prompts")
    parser.add_argument("-q", "--query", help="Keyword to search in prompt or author")
    parser.add_argument("-c", "--category", choices=["motion", "3d", "explainer", "interactive"], help="Filter by category")
    parser.add_argument("-t", "--tech", help="Filter by technology (canvas, svg, threejs, shader, gsap, css, etc.)")
    parser.add_argument("-l", "--limit", type=int, default=3, help="Max results to display (default: 3)")
    parser.add_argument("--json", action="store_true", help="Output raw JSON")

    args = parser.parse_args()

    results = search_prompts(query=args.query, category=args.category, tech=args.tech, limit=args.limit)

    if args.json:
        print(json.dumps(results, indent=2, ensure_ascii=False))
        return

    print("==================================================================")
    print(f"🎬 AWESOME OPUS 5.5 VIDEO PROMPTS (Found {len(results)} results)")
    print("==================================================================")

    if not results:
        print("No prompts matched your search criteria.")
        return

    for i, r in enumerate(results, 1):
        author = r.get("author", "unknown")
        cat = r.get("category", "unknown").upper()
        tags = ", ".join(r.get("tech_tags", []))
        post_url = r.get("post_url", "")
        skillry_url = r.get("skillry_url", "")
        prompt = r.get("prompt", "").strip()

        print(f"\n[{i:02d}] @{author} | CATEGORY: {cat} | TECH: [{tags}]")
        if post_url:
            print(f"🔗 X/Twitter Post: {post_url}")
        if skillry_url:
            print(f"▶ Skillry Live Remake: {skillry_url}")
        print("-" * 66)
        print("PROMPT:")
        print(prompt if prompt else "[No prompt text published - See original post]")
        print("=" * 66)

if __name__ == "__main__":
    main()
