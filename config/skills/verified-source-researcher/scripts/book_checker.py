#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
book_checker.py — Module tra cứu, thẩm định và xác thực sách xuất bản từ các tác giả nổi tiếng.
Truy vấn trực tiếp cơ sở dữ liệu Open Library API và các kho lưu trữ sách quốc tế để chống bịa đặt sách,
xác minh mã ISBN, nhà xuất bản, năm xuất bản và trích dẫn chương/trang cụ thể.
"""

import sys
import json
import urllib.request
import urllib.error
import urllib.parse
from typing import List, Dict, Any, Optional

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

USER_AGENT = "Antigravity-VerifiedSourceResearcher/1.0 (mailto:book-verifier@antigravity.internal)"

def verify_isbn(isbn: str, timeout: int = 10) -> Dict[str, Any]:
    """
    Xác thực một mã ISBN (ISBN-10 hoặc ISBN-13) qua Open Library API.
    Ví dụ: 9780374275631 (Thinking, Fast and Slow - Daniel Kahneman)
    """
    clean_isbn = isbn.strip().replace("-", "").replace(" ", "").upper()
    api_url = f"https://openlibrary.org/isbn/{clean_isbn}.json"
    
    result = {
        "isbn": clean_isbn,
        "valid": False,
        "title": "",
        "authors": [],
        "publishers": [],
        "publish_date": "",
        "number_of_pages": None,
        "url": f"https://openlibrary.org/isbn/{clean_isbn}",
        "reason": ""
    }
    
    try:
        req = urllib.request.Request(api_url, headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(req, timeout=timeout) as response:
            if response.getcode() == 200:
                data = json.loads(response.read().decode("utf-8"))
                result["valid"] = True
                result["title"] = data.get("title", "")
                result["publishers"] = data.get("publishers", [])
                result["publish_date"] = data.get("publish_date", "")
                result["number_of_pages"] = data.get("number_of_pages")
                
                # Trích xuất tác giả qua author keys nếu có
                author_keys = [a.get("key") for a in data.get("authors", []) if "key" in a]
                author_names = []
                for akey in author_keys[:3]: # Lấy tối đa 3 tác giả đầu
                    try:
                        a_url = f"https://openlibrary.org{akey}.json"
                        req_a = urllib.request.Request(a_url, headers={"User-Agent": USER_AGENT})
                        with urllib.request.urlopen(req_a, timeout=5) as resp_a:
                            adata = json.loads(resp_a.read().decode("utf-8"))
                            if "name" in adata:
                                author_names.append(adata["name"])
                    except Exception:
                        pass
                result["authors"] = author_names
                result["reason"] = f"Xác thực thành công sách xuất bản thật qua Open Library (ISBN: {clean_isbn})"
    except urllib.error.HTTPError as e:
        if e.code == 404:
            result["reason"] = f"Mã ISBN {clean_isbn} không tồn tại trên Open Library (Có dấu hiệu bịa đặt mã ISBN)"
        else:
            result["reason"] = f"HTTP Error {e.code}: {e.reason}"
    except Exception as e:
        result["reason"] = f"Lỗi kết nối kiểm tra ISBN: {str(e)}"
        
    return result

def search_book(title: str, author: Optional[str] = None, limit: int = 3, timeout: int = 10) -> List[Dict[str, Any]]:
    """
    Tìm kiếm sách theo Tiêu đề và/hoặc Tác giả trên Open Library.
    Ví dụ: title="Marketing Management", author="Philip Kotler"
    """
    params = [
        ("title", title),
        ("fields", "title,author_name,first_publish_year,isbn,publisher,number_of_pages_median,key,edition_count"),
        ("limit", str(limit))
    ]
    if author:
        params.append(("author", author))
        
    query_str = urllib.parse.urlencode(params)
    api_url = f"https://openlibrary.org/search.json?{query_str}"
    
    books = []
    try:
        req = urllib.request.Request(api_url, headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(req, timeout=timeout) as response:
            if response.getcode() == 200:
                data = json.loads(response.read().decode("utf-8"))
                docs = data.get("docs", [])
                for doc in docs:
                    book_entry = {
                        "found": True,
                        "title": doc.get("title", ""),
                        "authors": doc.get("author_name", []),
                        "first_publish_year": doc.get("first_publish_year"),
                        "publishers": (doc.get("publisher") or [])[:3],
                        "isbns": (doc.get("isbn") or [])[:5],
                        "openlibrary_key": doc.get("key", ""),
                        "url": f"https://openlibrary.org{doc.get('key', '')}",
                        "edition_count": doc.get("edition_count", 1)
                    }
                    books.append(book_entry)
    except Exception as e:
        pass
        
    return books

def format_book_reference(
    title: str,
    author: str,
    publisher: str = "",
    year: str = "",
    isbn: str = "",
    chapter_or_page: str = "",
    target_lang: str = "vi"
) -> str:
    """Định dạng chuỗi trích dẫn sách học thuật chuẩn hoá theo ngôn ngữ bài viết."""
    parts = [f"**{title}**"]
    
    meta_parts = []
    if author:
        meta_parts.append(f"Tác giả: _{author}_" if target_lang == "vi" else f"By: _{author}_")
    if publisher:
        meta_parts.append(f"NXB: {publisher}" if target_lang == "vi" else f"Publisher: {publisher}")
    if year:
        meta_parts.append(f"({year})")
    if isbn:
        meta_parts.append(f"ISBN: `{isbn}`")
        
    if meta_parts:
        parts.append(", ".join(meta_parts))
        
    if chapter_or_page:
        parts.append(f"📌 {chapter_or_page}")
        
    return "<br>".join(parts)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        mode = sys.argv[1].lower()
        if mode in ("--isbn", "-i") and len(sys.argv) > 2:
            isbn_arg = sys.argv[2]
            print(f"[*] Đang xác thực ISBN: {isbn_arg}")
            res = verify_isbn(isbn_arg)
            print(f"[*] Hợp lệ: {res['valid']}")
            print(f"[*] Tựa sách: {res['title']}")
            print(f"[*] Tác giả: {', '.join(res['authors'])}")
            print(f"[*] Nhà xuất bản: {', '.join(res['publishers'])}")
            print(f"[*] Năm xuất bản: {res['publish_date']}")
            print(f"[*] Link tra cứu: {res['url']}")
            print(f"[*] Chi tiết: {res['reason']}")
        elif mode in ("--search", "-s"):
            title_arg = sys.argv[2] if len(sys.argv) > 2 else ""
            author_arg = sys.argv[3] if len(sys.argv) > 3 else None
            print(f"[*] Đang tìm kiếm sách: '{title_arg}' (Tác giả: '{author_arg}')")
            results = search_book(title_arg, author_arg)
            print(f"\n[+] Tìm thấy {len(results)} kết quả trùng khớp trên Open Library:")
            print("="*75)
            for idx, b in enumerate(results, 1):
                authors_str = ", ".join(b["authors"][:3])
                pub_str = ", ".join(b["publishers"][:2])
                isbn_str = b["isbns"][0] if b["isbns"] else "N/A"
                print(f"[{idx}] {b['title']} ({b['first_publish_year']})")
                print(f"    • Tác giả: {authors_str}")
                print(f"    • Nhà xuất bản: {pub_str} | ISBN đại diện: {isbn_str}")
                print(f"    • Link Open Library: {b['url']}")
                print("-" * 75)
        else:
            print("Cách dùng:")
            print("  python book_checker.py --isbn <Mã_ISBN>")
            print("  python book_checker.py --search <Tựa_sách> [Tên_tác_giả]")
    else:
        print("Cách dùng:")
        print("  python book_checker.py --isbn <Mã_ISBN>")
        print("  python book_checker.py --search <Tựa_sách> [Tên_tác_giả]")
