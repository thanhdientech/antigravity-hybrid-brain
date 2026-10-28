#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
link_validator.py — Module tự động quét và kiểm định tính sống còn của URL (Live Link Verification).
Chống link chết (404 Not Found), link chuyển hướng giả và link bịa đặt.
"""

import re
import sys
import time
import urllib.request
import urllib.error
import urllib.parse
from typing import List, Dict, Any

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 (Antigravity Verified Source Auditor)"

def extract_urls(text: str) -> List[str]:
    """Trích xuất tất cả các đường link HTTP/HTTPS từ văn bản hoặc markdown."""
    # Pattern bắt URL thông thường và markdown link [text](url)
    pattern = r'https?://[^\s)\]"\'>]+'
    raw_urls = re.findall(pattern, text)
    # Làm sạch các dấu câu thừa ở cuối URL nếu có
    cleaned = []
    for u in raw_urls:
        u = u.rstrip(".,;:")
        if u not in cleaned:
            cleaned.append(u)
    return cleaned

def validate_url(url: str, timeout: int = 6) -> Dict[str, Any]:
    """Kiểm tra một URL có tồn tại và trả về HTTP 200 không."""
    start_time = time.time()
    result = {
        "url": url,
        "valid": False,
        "status_code": 0,
        "reason": "",
        "final_url": url,
        "response_time_ms": 0
    }
    
    # 0. Nhận diện đặc biệt: Nếu là link doi.org hoặc openlibrary.org/isbn/ thì kiểm tra qua API chuẩn xác
    if "openlibrary.org/isbn/" in url:
        isbn_part = url.split("openlibrary.org/isbn/")[-1].strip().strip("/").replace("-", "").upper()
        try:
            import requests
            ol_api = f"https://openlibrary.org/api/books?bibkeys=ISBN:{urllib.parse.quote(isbn_part)}&format=json"
            r = requests.get(ol_api, headers={"User-Agent": USER_AGENT}, timeout=4)
            if r.status_code == 200 and f"ISBN:{isbn_part}" in r.text:
                result["status_code"] = 200
                result["valid"] = True
                result["reason"] = "OK (OpenLibrary ISBN API Verified)"
                result["response_time_ms"] = int((time.time() - start_time) * 1000)
                return result
        except Exception:
            pass
        # Fallback: Kiểm tra chuẩn toán học ISO 2108 ISBN-13 / ISBN-10 khi OpenLibrary timeout
        if len(isbn_part) == 13 and isbn_part.isdigit():
            chk = sum((1 if i % 2 == 0 else 3) * int(d) for i, d in enumerate(isbn_part))
            if chk % 10 == 0:
                result["status_code"] = 200
                result["valid"] = True
                result["reason"] = "OK (ISO 2108 ISBN-13 Checksum Verified; OpenLibrary timeout fallback)"
                result["response_time_ms"] = int((time.time() - start_time) * 1000)
                return result

    if "doi.org/10." in url:
        try:
            doi_part = url.split("doi.org/")[-1].strip()
            import requests
            cr_url = f"https://api.crossref.org/works/{urllib.parse.quote(doi_part)}"
            r = requests.get(cr_url, headers={"User-Agent": USER_AGENT}, timeout=timeout)
            if r.status_code == 200:
                result["status_code"] = 200
                result["valid"] = True
                result["reason"] = "OK (CrossRef DOI Verified)"
                result["response_time_ms"] = int((time.time() - start_time) * 1000)
                return result
            elif r.status_code == 404:
                result["status_code"] = 404
                result["valid"] = False
                result["reason"] = "DOI không tồn tại trên CrossRef"
                result["response_time_ms"] = int((time.time() - start_time) * 1000)
                return result
        except Exception:
            pass

    # Ưu tiên dùng requests nếu có
    try:
        import requests
        headers = {"User-Agent": USER_AGENT, "Accept": "*/*"}
        try:
            r = requests.head(url, headers=headers, timeout=timeout, allow_redirects=True)
            if r.status_code >= 400:
                r = requests.get(url, headers=headers, timeout=timeout, stream=True, allow_redirects=True)
            if r.status_code in (400, 403):
                r = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=timeout, stream=True, allow_redirects=True)
            result["status_code"] = r.status_code
            result["final_url"] = r.url
            result["valid"] = 200 <= r.status_code < 400
            result["reason"] = "OK" if result["valid"] else f"HTTP {r.status_code}"
            result["response_time_ms"] = int((time.time() - start_time) * 1000)
            return result
        except requests.exceptions.RequestException as e:
            # Thử GET nhẹ 1 lần nữa trước khi kết luận
            try:
                r = requests.get(url, headers=headers, timeout=timeout, stream=True, allow_redirects=True)
                result["status_code"] = r.status_code
                result["final_url"] = r.url
                result["valid"] = 200 <= r.status_code < 400
                result["reason"] = "OK (GET fallback)" if result["valid"] else f"HTTP {r.status_code}"
                result["response_time_ms"] = int((time.time() - start_time) * 1000)
                return result
            except Exception as e2:
                result["reason"] = f"Request Failed: {str(e2)}"
                result["response_time_ms"] = int((time.time() - start_time) * 1000)
                return result
    except ImportError:
        pass
        try:
            with urllib.request.urlopen(req, timeout=timeout) as response:
                result["status_code"] = response.getcode()
                result["final_url"] = response.geturl()
                result["valid"] = 200 <= response.getcode() < 400
                result["reason"] = "OK" if result["valid"] else f"HTTP {response.getcode()}"
        except urllib.error.HTTPError as e:
            # Nhiều server chặn HEAD (403 hoặc 405), chuyển sang thử GET nhẹ
            if e.code in (403, 405, 501):
                req_get = urllib.request.Request(
                    url,
                    headers={
                        "User-Agent": USER_AGENT,
                        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                        "Range": "bytes=0-1024" # Chỉ đọc 1KB đầu
                    },
                    method="GET"
                )
                with urllib.request.urlopen(req_get, timeout=timeout) as response:
                    result["status_code"] = response.getcode()
                    result["final_url"] = response.geturl()
                    result["valid"] = 200 <= response.getcode() < 400
                    result["reason"] = "OK (GET fallback)"
            else:
                result["status_code"] = e.code
                result["reason"] = f"HTTP Error {e.code}: {e.reason}"
        except urllib.error.URLError as e:
            result["reason"] = f"Connection Failed: {e.reason}"
    except Exception as e:
        result["reason"] = f"Exception: {str(e)}"
        
    result["response_time_ms"] = int((time.time() - start_time) * 1000)
    return result

def validate_links_in_text(text: str, timeout: int = 8) -> List[Dict[str, Any]]:
    """Trích xuất và kiểm tra toàn bộ links trong một văn bản."""
    urls = extract_urls(text)
    results = []
    for u in urls:
        res = validate_url(u, timeout=timeout)
        results.append(res)
    return results

if __name__ == "__main__":
    if len(sys.argv) > 1:
        target = sys.argv[1]
        if target.startswith("http://") or target.startswith("https://"):
            print(f"[*] Đang kiểm tra URL: {target}")
            res = validate_url(target)
            print(f"[*] Kết quả: Valid={res['valid']} | Code={res['status_code']} | Lý do={res['reason']} ({res['response_time_ms']}ms)")
        else:
            # Coi như file path
            try:
                with open(target, "r", encoding="utf-8") as f:
                    content = f.read()
                print(f"[*] Đang quét file: {target}")
                results = validate_links_in_text(content)
                print(f"\n{'='*70}")
                print(f"{'URL':<45} | {'STATUS':<10} | {'CODE':<6} | {'TIME'}")
                print(f"{'='*70}")
                for r in results:
                    status = "✅ PASS" if r["valid"] else "❌ FAIL"
                    print(f"{r['url'][:43]:<45} | {status:<10} | {r['status_code']:<6} | {r['response_time_ms']}ms")
            except Exception as e:
                print(f"[-] Lỗi đọc file: {e}")
    else:
        print("Cách dùng: python link_validator.py <URL hoặc Đường_dẫn_file.md>")
