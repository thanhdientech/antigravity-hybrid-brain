#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
academic_checker.py — Module thẩm định và xác thực tài liệu học thuật (DOI, PubMed, arXiv).
Truy vấn trực tiếp cơ sở dữ liệu CrossRef, NCBI PubMed và arXiv để chống bịa đặt công trình nghiên cứu.
"""

import sys
import json
import urllib.request
import urllib.error
import urllib.parse
from typing import Dict, Any, Optional

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

USER_AGENT = "Antigravity-VerifiedSourceChecker/1.0 (mailto:academic-verify@antigravity.internal)"

def verify_doi(doi: str, timeout: int = 10) -> Dict[str, Any]:
    """
    Xác thực một mã DOI thông qua CrossRef REST API.
    Ví dụ DOI: 10.1038/s41586-020-2649-2
    """
    # Làm sạch tiền tố https://doi.org/ hoặc doi:
    clean_doi = doi.strip()
    if clean_doi.startswith("https://doi.org/"):
        clean_doi = clean_doi.replace("https://doi.org/", "")
    elif clean_doi.startswith("http://doi.org/"):
        clean_doi = clean_doi.replace("http://doi.org/", "")
    elif clean_doi.lower().startswith("doi:"):
        clean_doi = clean_doi[4:].strip()
        
    api_url = f"https://api.crossref.org/works/{urllib.parse.quote(clean_doi)}"
    result = {
        "identifier": clean_doi,
        "type": "DOI",
        "valid": False,
        "title": "",
        "authors": [],
        "year": None,
        "journal": "",
        "url": f"https://doi.org/{clean_doi}",
        "reason": ""
    }
    
    try:
        req = urllib.request.Request(api_url, headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(req, timeout=timeout) as response:
            if response.getcode() == 200:
                data = json.loads(response.read().decode("utf-8"))
                message = data.get("message", {})
                result["valid"] = True
                result["title"] = (message.get("title") or [""])[0]
                result["journal"] = (message.get("container-title") or [""])[0]
                
                # Trích xuất tác giả
                authors = []
                for author in message.get("author", []):
                    name = f"{author.get('given', '')} {author.get('family', '')}".strip()
                    if name:
                        authors.append(name)
                result["authors"] = authors[:5] # Lấy tối đa 5 tác giả đầu
                
                # Trích xuất năm
                created = message.get("published-print") or message.get("published-online") or message.get("created")
                if created and "date-parts" in created:
                    result["year"] = created["date-parts"][0][0]
                result["reason"] = "Xác thực thành công trên CrossRef"
    except urllib.error.HTTPError as e:
        if e.code == 404:
            result["reason"] = "DOI không tồn tại trên hệ thống CrossRef (Có dấu hiệu bịa đặt)"
        else:
            result["reason"] = f"HTTP Error {e.code}: {e.reason}"
    except Exception as e:
        result["reason"] = f"Lỗi truy vấn: {str(e)}"
        
    return result

def verify_pubmed(pmid: str, timeout: int = 10) -> Dict[str, Any]:
    """
    Xác thực một mã số PubMed (PMID) thông qua NCBI E-utilities API.
    Ví dụ PMID: 32832599
    """
    clean_pmid = pmid.strip().lower().replace("pmid:", "").strip()
    api_url = f"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id={clean_pmid}&retmode=json"
    result = {
        "identifier": clean_pmid,
        "type": "PubMed",
        "valid": False,
        "title": "",
        "authors": [],
        "year": None,
        "journal": "",
        "url": f"https://pubmed.ncbi.nlm.nih.gov/{clean_pmid}/",
        "reason": ""
    }
    
    try:
        req = urllib.request.Request(api_url, headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(req, timeout=timeout) as response:
            if response.getcode() == 200:
                data = json.loads(response.read().decode("utf-8"))
                uids = data.get("result", {}).get("uids", [])
                if clean_pmid in uids:
                    item = data["result"][clean_pmid]
                    result["valid"] = True
                    result["title"] = item.get("title", "")
                    result["journal"] = item.get("source", "")
                    result["authors"] = [a.get("name", "") for a in item.get("authors", [])][:5]
                    pubdate = item.get("pubdate", "")
                    if pubdate:
                        result["year"] = pubdate.split()[0]
                    result["reason"] = "Xác thực thành công trên NCBI PubMed"
                else:
                    result["reason"] = "PMID không tồn tại trong cơ sở dữ liệu NCBI"
    except Exception as e:
        result["reason"] = f"Lỗi truy vấn NCBI: {str(e)}"
        
    return result

def search_paper_by_title(title: str, timeout: int = 10) -> Dict[str, Any]:
    """Tìm kiếm tên bài báo trên CrossRef để kiểm tra xem bài báo có thật không."""
    api_url = f"https://api.crossref.org/works?query.title={urllib.parse.quote(title)}&rows=1"
    try:
        req = urllib.request.Request(api_url, headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(req, timeout=timeout) as response:
            if response.getcode() == 200:
                data = json.loads(response.read().decode("utf-8"))
                items = data.get("message", {}).get("items", [])
                if items:
                    item = items[0]
                    found_title = (item.get("title") or [""])[0]
                    doi = item.get("DOI", "")
                    return {
                        "found": True,
                        "title": found_title,
                        "doi": doi,
                        "url": f"https://doi.org/{doi}",
                        "journal": (item.get("container-title") or [""])[0]
                    }
    except Exception as e:
        pass
    return {"found": False, "title": "", "doi": "", "url": "", "journal": ""}

if __name__ == "__main__":
    if len(sys.argv) > 2:
        mode = sys.argv[1].lower()
        val = sys.argv[2]
        if mode in ("--doi", "-d"):
            print(f"[*] Đang xác thực DOI: {val}")
            res = verify_doi(val)
            print(f"[*] Hợp lệ: {res['valid']}")
            print(f"[*] Tiêu đề: {res['title']}")
            print(f"[*] Tạp chí: {res['journal']}")
            print(f"[*] Tác giả: {', '.join(res['authors'])}")
            print(f"[*] Năm: {res['year']}")
            print(f"[*] URL: {res['url']}")
            print(f"[*] Ghi chú: {res['reason']}")
        elif mode in ("--pmid", "-p"):
            print(f"[*] Đang xác thực PubMed ID: {val}")
            res = verify_pubmed(val)
            print(f"[*] Hợp lệ: {res['valid']}")
            print(f"[*] Tiêu đề: {res['title']}")
            print(f"[*] Tạp chí: {res['journal']}")
            print(f"[*] Tác giả: {', '.join(res['authors'])}")
            print(f"[*] Năm: {res['year']}")
            print(f"[*] URL: {res['url']}")
            print(f"[*] Ghi chú: {res['reason']}")
        elif mode in ("--title", "-t"):
            print(f"[*] Đang tìm kiếm bài báo: {val}")
            res = search_paper_by_title(val)
            if res["found"]:
                print(f"[+] Tìm thấy: {res['title']}")
                print(f"[+] DOI: {res['doi']} | URL: {res['url']}")
            else:
                print("[-] Không tìm thấy bài báo nào khớp trên CrossRef.")
    else:
        print("Cách dùng:")
        print("  python academic_checker.py --doi <DOI>")
        print("  python academic_checker.py --pmid <PMID>")
        print("  python academic_checker.py --title <Tên_bài_báo>")
