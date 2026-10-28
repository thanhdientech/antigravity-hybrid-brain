#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
cli.py — Giao diện dòng lệnh 1-chạm của Skill Verified Source Researcher.
Hỗ trợ kiểm định đường link, xác thực mã DOI/PubMed, và quét audit toàn bộ bài viết markdown.
"""

import sys
import os
import argparse
from typing import List

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Đảm bảo import được các module trong scripts/
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from scripts.link_validator import validate_url, validate_links_in_text
from scripts.academic_checker import verify_doi, verify_pubmed, search_paper_by_title
from scripts.book_checker import verify_isbn, search_book
from scripts.citation_mapper import SectionCitationMapper, CitationEntry

def cmd_check_url(args):
    url = args.url or args.url_opt
    if not url:
        print("[-] Vui lòng cung cấp URL cần kiểm tra.")
        return
    print(f"[*] Đang kiểm tra URL: {url}")
    res = validate_url(url, timeout=args.timeout)
    status = "✅ PASS (Link sống 100%)" if res["valid"] else "❌ FAIL (Link lỗi/chết)"
    print(f"[*] Trạng thái: {status}")
    print(f"[*] HTTP Status: {res['status_code']}")
    print(f"[*] URL đích: {res['final_url']}")
    print(f"[*] Thời gian phản hồi: {res['response_time_ms']}ms")
    print(f"[*] Chi tiết: {res['reason']}")

def cmd_check_doi(args):
    doi = args.doi or args.doi_opt
    if not doi:
        print("[-] Vui lòng cung cấp mã DOI.")
        return
    print(f"[*] Đang xác thực DOI: {doi}")
    res = verify_doi(doi)
    if res["valid"]:
        print(f"✅ XÁC THỰC THÀNH CÔNG (DOI TỒN TẠI TRÊN CROSSREF)")
        print(f"[*] Tiêu đề: {res['title']}")
        print(f"[*] Tạp chí/Nhà xuất bản: {res['journal']}")
        print(f"[*] Tác giả: {', '.join(res['authors'])}")
        print(f"[*] Năm xuất bản: {res['year']}")
        print(f"[*] Link chính thức: {res['url']}")
    else:
        print(f"❌ XÁC THỰC THẤT BẠI: {res['reason']}")

def cmd_check_pmid(args):
    pmid = args.pmid or args.pmid_opt
    if not pmid:
        print("[-] Vui lòng cung cấp mã PMID.")
        return
    print(f"[*] Đang xác thực PubMed ID: {pmid}")
    res = verify_pubmed(pmid)
    if res["valid"]:
        print(f"✅ XÁC THỰC THÀNH CÔNG (PMID TỒN TẠI TRÊN NCBI)")
        print(f"[*] Tiêu đề: {res['title']}")
        print(f"[*] Tạp chí: {res['journal']}")
        print(f"[*] Tác giả: {', '.join(res['authors'])}")
        print(f"[*] Năm xuất bản: {res['year']}")
        print(f"[*] Link chính thức: {res['url']}")
    else:
        print(f"❌ XÁC THỰC THẤT BẠI: {res['reason']}")

def cmd_check_isbn(args):
    isbn = args.isbn or args.isbn_opt
    if not isbn:
        print("[-] Vui lòng cung cấp mã ISBN.")
        return
    print(f"[*] Đang xác thực mã ISBN: {isbn}")
    res = verify_isbn(isbn)
    if res["valid"]:
        print("✅ XÁC THỰC THÀNH CÔNG (SÁCH TỒN TẠI THẬT TRÊN OPEN LIBRARY)")
        print(f"[*] Tựa sách: {res['title']}")
        print(f"[*] Tác giả: {', '.join(res['authors'])}")
        print(f"[*] Nhà xuất bản: {', '.join(res['publishers'])}")
        print(f"[*] Năm xuất bản: {res['publish_date']}")
        print(f"[*] Link tra cứu: {res['url']}")
    else:
        print(f"❌ XÁC THỰC THẤT BẠI: {res['reason']}")

def cmd_search_book(args):
    print(f"[*] Đang tìm kiếm sách: '{args.title}' (Tác giả: '{args.author}')")
    results = search_book(args.title, args.author, limit=args.limit)
    if results:
        print(f"\n[+] Tìm thấy {len(results)} ấn bản sách xuất bản chính thức:")
        print("=" * 80)
        for idx, b in enumerate(results, 1):
            auth_str = ", ".join(b["authors"][:3])
            pub_str = ", ".join(b["publishers"][:2])
            isbn_str = b["isbns"][0] if b["isbns"] else "N/A"
            print(f"[{idx}] {b['title']} ({b['first_publish_year']})")
            print(f"    • Tác giả: {auth_str}")
            print(f"    • NXB: {pub_str} | ISBN: {isbn_str}")
            print(f"    • Link tra cứu: {b['url']}")
            print("-" * 80)
    else:
        print("[-] Không tìm thấy sách nào trùng khớp trên cơ sở dữ liệu quốc tế.")

def cmd_audit_file(args):
    file_path = args.file or args.file_opt
    if not file_path:
        print("[-] Vui lòng cung cấp đường dẫn file markdown bài viết.")
        return
    if not os.path.exists(file_path):
        print(f"[-] Không tìm thấy file: {file_path}")
        return
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    print(f"[*] Đang quét và kiểm toán toàn bộ nguồn trong: {file_path}")
    results = validate_links_in_text(content, timeout=args.timeout)
    
    total = len(results)
    passed = sum(1 for r in results if r["valid"])
    failed = total - passed
    
    print("\n" + "="*80)
    print(f"📊 BÁO CÁO KIỂM TOÁN NGUỒN TÀI LIỆU (SOURCE AUDIT SCORECARD)")
    print(f"• Tổng số đường link phát hiện: {total}")
    print(f"• Số link sống hợp lệ (HTTP 200/OK): {passed}")
    print(f"• Số link chết / lỗi / không truy cập được: {failed}")
    score = (passed / total * 100) if total > 0 else 100
    print(f"• TỶ LỆ TRUNG THỰC NGUỒN: {score:.1f}%")
    print("="*80)
    
    print(f"\n{'STT':<4} | {'TRẠNG THÁI':<12} | {'CODE':<6} | {'URL TRÍCH DẪN'}")
    print("-" * 80)
    for idx, r in enumerate(results, 1):
        status = "✅ HỢP LỆ" if r["valid"] else "❌ LỖI"
        print(f"{idx:<4} | {status:<12} | {r['status_code']:<6} | {r['url']}")
    print("-" * 80)
    
    if failed > 0:
        print("\n⚠️ CẢNH BÁO: Phát hiện link lỗi hoặc có dấu hiệu bịa đặt. Vui lòng rà soát lại bài viết!")
    else:
        print("\n💎 CHỨNG NHẬN: 100% nguồn tài liệu trích dẫn đều là link sống thực tế!")

def main():
    parser = argparse.ArgumentParser(
        description="Verified Source Researcher CLI — Thẩm định nguồn, chống bịa đặt tài liệu"
    )
    subparsers = parser.add_subparsers(dest="command", help="Lệnh thực thi")

    # check-url
    p_url = subparsers.add_parser("check-url", help="Kiểm tra một đường link web")
    p_url.add_argument("url", nargs="?", default=None, help="URL cần kiểm tra")
    p_url.add_argument("--url", "-u", dest="url_opt", type=str, default=None, help="URL cần kiểm tra")
    p_url.add_argument("--timeout", type=int, default=8, help="Thời gian chờ tối đa (giây)")

    # check-doi
    p_doi = subparsers.add_parser("check-doi", help="Xác thực mã DOI trên CrossRef")
    p_doi.add_argument("doi", nargs="?", default=None, help="Mã DOI (ví dụ: 10.1038/s41586-021-03819-2)")
    p_doi.add_argument("--doi", "-d", dest="doi_opt", type=str, default=None, help="Mã DOI")

    # check-pmid
    p_pmid = subparsers.add_parser("check-pmid", help="Xác thực mã PubMed ID trên NCBI")
    p_pmid.add_argument("pmid", nargs="?", default=None, help="Mã PubMed (ví dụ: 32832599)")
    p_pmid.add_argument("--pmid", "-p", dest="pmid_opt", type=str, default=None, help="Mã PubMed")

    # check-isbn
    p_isbn = subparsers.add_parser("check-isbn", help="Xác thực mã ISBN sách qua Open Library")
    p_isbn.add_argument("isbn", nargs="?", default=None, help="Mã ISBN-10 hoặc ISBN-13 (ví dụ: 9780374275631)")
    p_isbn.add_argument("--isbn", "-i", dest="isbn_opt", type=str, default=None, help="Mã ISBN")

    # search-book
    p_book = subparsers.add_parser("search-book", help="Tìm kiếm sách theo Tiêu đề và Tác giả trên Open Library")
    p_book.add_argument("--title", "-t", required=True, type=str, help="Tựa sách cần tìm")
    p_book.add_argument("--author", "-a", type=str, default=None, help="Tên tác giả")
    p_book.add_argument("--limit", "-l", type=int, default=3, help="Số lượng kết quả tối đa")

    # audit-file
    p_audit = subparsers.add_parser("audit-file", help="Quét và kiểm toán toàn bộ link trong file markdown")
    p_audit.add_argument("file", nargs="?", default=None, help="Đường dẫn tới file markdown bài viết")
    p_audit.add_argument("--file", "-f", dest="file_opt", type=str, default=None, help="Đường dẫn tới file markdown bài viết")
    p_audit.add_argument("--timeout", type=int, default=8, help="Thời gian chờ tối đa (giây)")

    args = parser.parse_args()
    if args.command == "check-url":
        cmd_check_url(args)
    elif args.command == "check-doi":
        cmd_check_doi(args)
    elif args.command == "check-pmid":
        cmd_check_pmid(args)
    elif args.command == "check-isbn":
        cmd_check_isbn(args)
    elif args.command == "search-book":
        cmd_search_book(args)
    elif args.command == "audit-file":
        cmd_audit_file(args)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()

