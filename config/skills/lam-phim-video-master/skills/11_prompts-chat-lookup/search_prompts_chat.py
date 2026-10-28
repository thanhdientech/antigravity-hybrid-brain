#!/usr/bin/env python3
"""
search_prompts_chat.py
Công cụ tra cứu Offline (2,627 prompts + 31 chương sách) & Online MCP cho prompts.chat
"""
import os, sys, csv, json, argparse, urllib.request

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
csv.field_size_limit(10_000_000)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "prompts.csv")
BOOK_DIR = os.path.join(BASE_DIR, "book")
MCP_URL  = "https://prompts.chat/api/mcp"

def load_csv():
    if not os.path.exists(CSV_PATH):
        print(f"[ERROR] File not found: {CSV_PATH}")
        return []
    with open(CSV_PATH, 'r', encoding='utf-8', errors='replace') as f:
        return list(csv.DictReader(f))

def search_local(query, ptype=None, for_devs=None, limit=10, show_full=False):
    rows = load_csv()
    q_words = [w.lower() for w in query.split() if w.strip()]
    results = []
    for idx, r in enumerate(rows, 1):
        if ptype and r.get('type', '').upper() != ptype.upper():
            continue
        if for_devs is not None:
            want = 'TRUE' if for_devs else 'FALSE'
            if r.get('for_devs', '').upper() != want:
                continue
        act = r.get('act', '')
        prompt = r.get('prompt', '')
        haystack = (act + ' ' + prompt).lower()
        score = sum(3 if w in act.lower() else (1 if w in haystack else 0) for w in q_words)
        if score > 0 and all(w in haystack for w in q_words):
            results.append((score, idx, r))
    results.sort(key=lambda x: x[0], reverse=True)
    print(f"=== KẾT QUẢ TÌM KIẾM OFFLINE: '{query}' (Tìm thấy {len(results)} / {len(rows)} prompts) ===")
    for score, idx, r in results[:limit]:
        print(f"\n[#{idx}] Vai trò (Act): {r.get('act')} | Loại: {r.get('type')} | Dev: {r.get('for_devs')} | Tác giả: {r.get('contributor')}")
        p_text = r.get('prompt', '').strip()
        if show_full:
            print("-" * 60)
            print(p_text)
            print("-" * 60)
        else:
            preview = p_text[:280].replace('\n', ' ')
            print(f"    Trích dẫn: \"{preview}{'...' if len(p_text) > 280 else ''}\"")

def get_by_id(idx):
    rows = load_csv()
    if idx < 1 or idx > len(rows):
        print(f"[ERROR] ID phải từ 1 đến {len(rows)}")
        return
    r = rows[idx - 1]
    print(f"=== PROMPT #{idx}: {r.get('act')} ===")
    print(f"Loại: {r.get('type')} | For Devs: {r.get('for_devs')} | Contributor: {r.get('contributor')}")
    print("=" * 60)
    print(r.get('prompt', '').strip())
    print("=" * 60)

def list_book(chapter_query=None):
    if not os.path.exists(BOOK_DIR):
        print(f"[ERROR] Không tìm thấy thư mục sách: {BOOK_DIR}")
        return
    files = sorted(f for f in os.listdir(BOOK_DIR) if f.endswith('.mdx'))
    if not chapter_query:
        print(f"=== SÁCH THE INTERACTIVE BOOK OF PROMPTING ({len(files)} chương) ===")
        for f in files:
            print(f"  - {f}")
        return
    q = chapter_query.lower()
    matched = [f for f in files if q in f.lower()]
    for f in matched:
        path = os.path.join(BOOK_DIR, f)
        with open(path, 'r', encoding='utf-8', errors='replace') as fp:
            content = fp.read()
        print(f"\n=== CHƯƠNG: {f} ({len(content)} chars) ===")
        print(content[:2500])

def call_mcp(tool_name, args_dict):
    payload = json.dumps({
        "jsonrpc": "2.0",
        "id": 2,
        "method": "tools/call",
        "params": {"name": tool_name, "arguments": args_dict}
    }).encode('utf-8')
    req = urllib.request.Request(
        MCP_URL,
        data=payload,
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json, text/event-stream",
            "User-Agent": "Mozilla/5.0"
        }
    )
    with urllib.request.urlopen(req, timeout=15) as r:
        raw = r.read().decode('utf-8', errors='replace')
        print(f"=== LIVE MCP RESPONSE ({tool_name}) ===")
        for line in raw.splitlines():
            if line.startswith("data: "):
                data = json.loads(line[6:])
                print(json.dumps(data, indent=2, ensure_ascii=False)[:3000])

def main():
    parser = argparse.ArgumentParser(description="Tra cứu kho 2,627 Prompts & 31 Chương sách từ prompts.chat")
    parser.add_argument("-q", "--query", help="Từ khóa tìm kiếm trong 2,627 prompts offline")
    parser.add_argument("-t", "--type", help="Lọc theo loại: TEXT, STRUCTURED, IMAGE")
    parser.add_argument("--dev", action="store_true", help="Chỉ lấy prompt dành cho Developer (for_devs=TRUE)")
    parser.add_argument("-l", "--limit", type=int, default=5, help="Số kết quả tối đa (mặc định: 5)")
    parser.add_argument("--full", action="store_true", help="Hiển thị toàn văn prompt")
    parser.add_argument("--id", type=int, help="Xem toàn văn prompt theo số thứ tự #ID (1..2627)")
    parser.add_argument("--book", nargs="?", const="", help="Liệt kê 31 chương sách hoặc đọc chương theo từ khóa")
    parser.add_argument("--mcp-search", help="Tìm trực tiếp trên Live MCP Server https://prompts.chat/api/mcp")
    parser.add_argument("--mcp-skills", help="Tìm Agent Skills trên Live MCP Server https://prompts.chat/api/mcp")
    args = parser.parse_args()

    if args.id:
        get_by_id(args.id)
    elif args.book is not None:
        list_book(args.book if args.book else None)
    elif args.mcp_search:
        call_mcp("search_prompts", {"query": args.mcp_search, "limit": args.limit})
    elif args.mcp_skills:
        call_mcp("search_skills", {"query": args.mcp_skills, "limit": args.limit})
    elif args.query:
        search_local(args.query, ptype=args.type, for_devs=True if args.dev else None, limit=args.limit, show_full=args.full)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
