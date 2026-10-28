#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
citation_mapper.py — Module tự động tạo bảng ánh xạ nguồn theo từng phân đoạn (Section-by-Section Mapping).
Hỗ trợ kiểm định tính sống của link và chuẩn hoá dịch thuật theo ngôn ngữ bài viết yêu cầu.
"""

import sys
import json
from typing import List, Dict, Any, Optional

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Import link validator từ cùng thư mục scripts
try:
    from scripts.link_validator import validate_url
    from scripts.academic_checker import verify_doi, verify_pubmed
    from scripts.book_checker import verify_isbn, search_book
except ImportError:
    from link_validator import validate_url
    from academic_checker import verify_doi, verify_pubmed
    from book_checker import verify_isbn, search_book

class CitationEntry:
    def __init__(
        self,
        section: str,
        claim: str,
        source_title: str,
        author_org: str,
        year: str,
        url_or_doi: str = "",
        tier: str = "Tier 1",
        rationale: str = "",
        original_lang: str = "en",
        publisher: str = "",
        isbn: str = "",
        chapter_page: str = "",
        is_book: bool = False
    ):
        self.section = section
        self.claim = claim
        self.source_title = source_title
        self.author_org = author_org
        self.year = year
        self.url_or_doi = url_or_doi
        self.tier = tier
        self.rationale = rationale
        self.original_lang = original_lang
        self.publisher = publisher
        self.isbn = isbn
        self.chapter_page = chapter_page
        self.is_book = is_book or bool(isbn) or bool(publisher)
        self.verification_status = "Chưa kiểm tra"
        self.is_valid = False

    def verify(self, timeout: int = 8):
        """Tự động kiểm định nguồn sống trước khi đưa vào bảng."""
        clean_target = self.url_or_doi.strip()
        
        # 0. Nếu là Sách xuất bản (có ISBN hoặc link Open Library)
        if self.isbn or "openlibrary.org/isbn" in clean_target or clean_target.upper().startswith("ISBN:"):
            raw_isbn = self.isbn if self.isbn else clean_target.split(":")[-1].strip().split("/")[-1]
            res = verify_isbn(raw_isbn, timeout=timeout)
            self.is_valid = res["valid"]
            if res["valid"]:
                self.verification_status = f"✅ OpenLibrary Verified (ISBN: {res['isbn']})"
                if not self.author_org and res["authors"]:
                    self.author_org = ", ".join(res["authors"])
                if not self.publisher and res["publishers"]:
                    self.publisher = ", ".join(res["publishers"][:2])
                if not self.year and res["publish_date"]:
                    self.year = res["publish_date"]
                if not self.url_or_doi:
                    self.url_or_doi = res["url"]
            else:
                self.verification_status = f"❌ {res['reason']}"

        # 1. Nếu là DOI
        elif "doi.org" in clean_target or clean_target.startswith("10."):
            doi_val = clean_target
            if "doi.org/" in doi_val:
                doi_val = doi_val.split("doi.org/")[-1]
            res = verify_doi(doi_val, timeout=timeout)
            self.is_valid = res["valid"]
            if res["valid"]:
                self.verification_status = f"✅ CrossRef Verified (DOI: {doi_val})"
            else:
                self.verification_status = f"❌ {res['reason']}"
                
        # 2. Nếu là PubMed
        elif "pubmed.ncbi.nlm.nih.gov" in clean_target or clean_target.lower().startswith("pmid:"):
            pmid = clean_target.strip("/").split("/")[-1].replace("pmid:", "").strip()
            res = verify_pubmed(pmid, timeout=timeout)
            self.is_valid = res["valid"]
            if res["valid"]:
                self.verification_status = f"✅ PubMed Verified (PMID: {pmid})"
            else:
                self.verification_status = f"❌ {res['reason']}"
                
        # 3. Nếu là URL Web thông thường
        elif clean_target.startswith("http://") or clean_target.startswith("https://"):
            res = validate_url(clean_target, timeout=timeout)
            self.is_valid = res["valid"]
            if res["valid"]:
                self.verification_status = f"✅ HTTP {res['status_code']} OK"
            else:
                self.verification_status = f"❌ {res['reason']}"
        else:
            self.verification_status = "⚠️ Nguồn tài liệu giấy / Lưu trữ nội bộ"
            self.is_valid = True

class SectionCitationMapper:
    def __init__(self, target_language: str = "vi"):
        self.target_language = target_language.lower()
        self.entries: List[CitationEntry] = []

    def add_entry(self, entry: CitationEntry, auto_verify: bool = True):
        if auto_verify:
            entry.verify()
        self.entries.append(entry)

    def generate_markdown_table(self) -> str:
        """Sinh bảng Markdown 5 cột chuẩn hoá theo bản đặc tả."""
        if self.target_language.startswith("vi"):
            headers = [
                "Phân Đoạn / Chương Mục",
                "Luận Điểm / Số Liệu Cần Chứng Thực",
                "Nguồn Tham Chiếu Cụ Thể (Nguyên bản & Link)",
                "Phân Tầng",
                "Lý Do Tại Sao Chọn Nguồn Này (Đã dịch sang Tiếng Việt)"
            ]
            title = "## 📚 BẢNG ÁNH XẠ NGUỒN THAM CHIẾU & GIẢI TRÌNH CHI TIẾT THEO TỪNG PHẦN"
        else:
            headers = [
                "Section / Chapter",
                "Claim / Data Requiring Verification",
                "Specific Source Reference (Original & URL/DOI)",
                "Source Tier",
                "Rationale for Source Selection (Localized)"
            ]
            title = "## 📚 SECTION-BY-SECTION CITATION & RATIONALE MAPPING"

        lines = [
            title,
            "",
            f"| {headers[0]} | {headers[1]} | {headers[2]} | {headers[3]} | {headers[4]} |",
            "| :--- | :--- | :--- | :---: | :--- |"
        ]

        for item in self.entries:
            if item.is_book or item.isbn:
                source_cell = f"📖 **{item.source_title}**<br>_{item.author_org}_ ({item.year})"
                if item.publisher:
                    source_cell += f"<br>NXB: {item.publisher}"
                if item.isbn:
                    source_cell += f" | ISBN: `{item.isbn}`"
                if item.chapter_page:
                    source_cell += f"<br>📌 {item.chapter_page}"
                if item.url_or_doi and item.url_or_doi.startswith("http"):
                    source_cell += f"<br>[Tra cứu ấn bản]({item.url_or_doi})"
                source_cell += f"<br>`{item.verification_status}`"
            else:
                source_cell = f"**{item.source_title}**<br>_{item.author_org}_ ({item.year})<br>[{item.url_or_doi}]({item.url_or_doi})<br>`{item.verification_status}`"
            
            lines.append(
                f"| **{item.section}** | {item.claim} | {source_cell} | **{item.tier}** | {item.rationale} |"
            )

        return "\n".join(lines)

if __name__ == "__main__":
    print("[*] Khởi tạo mẫu bảng đối soát Citation Mapper...")
    mapper = SectionCitationMapper(target_language="vi")
    
    # Mẫu thử nghiệm 1: Bài báo học thuật (Journal Paper)
    mapper.add_entry(CitationEntry(
        section="Phần 1: Tổng quan AlphaFold",
        claim="Dự đoán cấu trúc 3D của hơn 200 triệu protein với độ chính xác cấp độ nguyên tử.",
        source_title="Highly accurate protein structure prediction with AlphaFold",
        author_org="John Jumper et al., DeepMind",
        year="2021",
        url_or_doi="https://doi.org/10.1038/s41586-021-03819-2",
        tier="Tier 1",
        rationale="Đây là công trình nghiên cứu gốc mang tính bước ngoặt được công bố trên tạp chí Nature và bình duyệt độc lập, cung cấp dữ liệu sơ cấp chính thức.",
        original_lang="en"
    ))
    
    # Mẫu thử nghiệm 2: Sách kinh điển xuất bản (Published Foundational Book)
    mapper.add_entry(CitationEntry(
        section="Phần 2: Tâm lý học hành vi",
        claim="Con người đưa ra quyết định dựa trên hai cơ chế: Hệ thống 1 (trực giác, nhanh, vô thức) và Hệ thống 2 (suy luận logic, chậm, tốn năng lượng).",
        source_title="Thinking, Fast and Slow (Tư Duy Nhanh và Chậm)",
        author_org="Daniel Kahneman",
        year="2011",
        publisher="Farrar, Straus and Giroux",
        isbn="9780374275631",
        chapter_page="Phần 1: Hai hệ thống, Chương 1",
        tier="Tier 1",
        rationale="Tác phẩm kinh điển nền tảng của Giáo sư Daniel Kahneman (đoạt giải Nobel Kinh tế 2002), đặt nền móng cho toàn bộ ngành kinh tế học hành vi hiện đại.",
        original_lang="en"
    ))
    
    table_md = mapper.generate_markdown_table()
    print("\n" + table_md)
