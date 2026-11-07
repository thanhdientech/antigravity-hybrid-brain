#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
agy_skill_engine.py (v2 — Enterprise 10/10 Edition)
Bộ Não Lai Javis OS (Hybrid Contentless-Delete FTS5 + IDF-Weighted RRF + Lazy Section Loader + Skill Manager).

Kế thừa & tối ưu hóa trực tiếp tinh hoa kiến trúc từ Javis OS:
  1. `memory_index.py`      : Derived, rebuildable SQLite WAL index (`agy_skill_index.db`),
                              Contentless-Delete FTS5 (`content='', contentless_delete=1` trên SQLite >= 3.43)
                              loại bỏ hoàn toàn lưu trữ trùng lặp `norm_text` (~18 MB cho 11,600+ chunks),
                              xóa/cập nhật chunk O(1) qua integer `rowid` + Windows `os.scandir` zero-syscall stat (< 120ms),
                              Heading-level chunking kèm tọa độ dòng thật `line_start..line_end`.
  2. `capability_index.py`  : Reciprocal Rank Fusion (`rrf_fuse`, `RRF_K = 60`), IDF-filtered `needs_widening`,
                              Distinctive Slug-Token Match đánh thức 50+ Plugin chuyên ngành, `source_affinity` (+0.03).
  3. `lazy_skill_runtime.py`: In-memory IDF & Catalog Cache (`PRAGMA data_version`) + Description Focus + Bigram Scorer (< 15ms)
                              + Lazy Excerpt Loader giới hạn `max_chars`.
  4. `skill_router.py`      : Kiểm định chuẩn `SKILL_DESC_MAX = 150`, chống cụm mở đầu sáo rỗng,
                              theo dõi tần suất sử dụng `skill_usage`.

Nguyên tắc bất biến:
  - Các file `.md` / `.sql` / `.py` trên ổ đĩa LUÔN là nguồn sự thật gốc duy nhất.
  - Xóa `agy_skill_index.db` bất cứ lúc nào cũng tự động mọc lại 100%.
"""
from __future__ import annotations

import hashlib
import json
import math
import os
import re
import shutil
import sqlite3
import threading
import time
import unicodedata
from pathlib import Path
from typing import Any, Optional

import yaml

_SUPPORTS_CONTENTLESS_DELETE = sqlite3.sqlite_version_info >= (3, 43, 0)
INDEX_SCHEMA_VERSION = "agy-javis-hybrid-v2-cd" if _SUPPORTS_CONTENTLESS_DELETE else "agy-javis-hybrid-v2-ext"
SKILL_DESC_MAX = 150
RRF_K = 60

CONFIG_DIR = Path.home() / ".gemini" / "config"
DEFAULT_DB_PATH = CONFIG_DIR / "agy_skill_index.db"
EDIT_BACKUP_DIR = CONFIG_DIR / "backups" / "skill_edits"

SKIP_DIRS = {
    ".git", ".hg", ".svn", "__pycache__", "node_modules", ".venv", "venv",
    "env", ".mypy_cache", ".pytest_cache", ".ruff_cache", "dist", "build",
    "runs", ".disabled", "backups",
}

INDEXABLE_EXTENSIONS = {
    ".md": ("markdown", 1.00),
    ".sql": ("sql", 0.96),
    ".py": ("script", 0.78),
    ".ps1": ("script", 0.78),
    ".sh": ("script", 0.78),
}

MAX_FILE_BYTES = 256 * 1024  # 256 KB max per markdown/sql file
MAX_CHUNK_CHARS = 3200
MAX_FILES_PER_SKILL = 600

_WORD_RE = re.compile(r"[^\W_]{2,}", re.UNICODE)
_HEADING_RE = re.compile(r"^(#{1,4})\s+(.+?)\s*$")
_MD_LINK_RE = re.compile(r"\[[^\]]*\]\(([^)#?\s]+)")
_WIKILINK_RE = re.compile(r"\[\[([^\]|#]+)")

_DESC_BOILERPLATE_RE = re.compile(
    r"^\s*(kích\s+hoạt\s+khi"
    r"|sử\s+dụng\s+skill\s+này\s+khi"
    r"|dùng\s+skill\s+này\s+khi"
    r"|skill\s+này\s+(dùng|được\s+dùng)"
    r"|use\s+this\s+skill\s+when"
    r"|activate\s+when)",
    re.I,
)

# Hư từ hội thoại đã kiểm tra chống va chạm dấu tiếng Việt
# (Tuyệt đối KHÔNG đưa các gốc đa nghĩa như: bi=BI, no=Nợ, ban=bán/bản, chi=chỉ, tu=tử/tự, ho=hồ, ma=mã, lai=lãi)
STOPWORDS = {
    "va", "hoac", "cua", "cho", "voi", "nhung", "cac", "mot", "nay", "kia",
    "the", "anh", "toi", "minh", "em", "co", "khong", "chua", "dang", "se",
    "vua", "rat", "la", "gi", "nao", "sao", "nho", "hay", "giup", "dum",
    "lam", "dung", "cach", "khi", "can", "muon", "nen", "phai", "duoc",
    "vao", "tren", "duoi", "trong", "ngoai", "theo", "bang", "ve",
    "xem", "tim", "lay", "dua", "gui", "hoi", "nhe", "nha",
    "and", "or", "for", "that", "what", "does", "how", "use", "using", "with",
    "from", "this", "please", "help", "make", "create", "build", "run", "the",
    "into", "about", "find", "get", "show",
}

# Các từ khung thông dụng: vẫn giữ để ghép cụm 2 từ (bigram) như "kiem tra", "bai bao", "ma doi",
# nhưng loại bỏ khỏi truy vấn FTS5 `OR` mở rộng khi câu hỏi đã có >= 2 từ khóa chuyên ngành.
GENERIC_OR_NOISE_TERMS = {
    "kiem", "tra", "bai", "ma", "viet", "tao", "sua", "moi", "file", "files",
    "web", "app", "code", "tool", "tools", "data", "check", "review", "test",
    "huong", "dan", "quy", "trinh", "he", "thong", "phan", "mem",
}

# Các hậu tố/từ chung trong tên slug không dùng để cộng điểm định danh riêng biệt
GENERIC_SLUG_TOKENS = {
    "database", "skill", "skills", "plugin", "guide", "master", "v2", "v4",
    "by", "and", "fetch", "analyze", "search", "cli", "hub", "create", "edit",
    "design", "designer", "controller", "commander", "researcher", "auditor",
    "agent", "ai", "antigravity", "literature", "protein", "sequence",
}

HIGH_SPECIFICITY_SINGLE_TOKENS = {
    "gsap", "scrolltrigger", "splittext", "morphsvg", "remotion", "manim", "editly",
    "flatsome", "vietqr", "capi", "ifixai", "beas", "oinm", "ojdt", "ytradar",
    "alphafold", "clinvar", "gnomad", "uniprot", "pubmed", "pmid", "arxiv", "biorxiv",
    "openalex", "europepmc", "chembl", "pubchem", "openfda", "reactome", "foldseek",
    "pymol", "kinetic", "watercolor", "watercolour", "pentest", "owasp", "xss", "ssrf",
    "gdocs", "gsheets", "gdrive", "gslides", "gaql", "pmax", "troas", "tcpa",
    "sitelinks", "callouts", "iztro", "pythagoras", "numerology", "bazi",
    "webapp", "impeccable", "rbac", "stepper", "gorouter", "blueprint", "asar", "ghidra", "pyinstaller", "recordly", "webcake",
    "wcag", "cwv", "gstack", "viewport", "responsive", "deeptutor", "eduhub", "lightrag", "graphrag",
}

CONCEPT_SYNONYMS: list[tuple[set[str], list[str]]] = [
    ({"lech", "kho", "wip", "154", "oinm", "ojdt", "gia", "thanh"},
     ["sap-b1-beas", "wip", "154", "oinm", "ojdt", "beas"]),
    ({"sap", "beas", "owor", "oinv", "ordr", "fms", "transactionnotification", "dtw"},
     ["sap-b1-beas", "sql-sap-b1", "viet-sql-sap-b1", "docentry", "baseentry", "beas_fthaupt"]),
    ({"sql", "query", "truy", "van", "join", "noi", "bang", "con"},
     ["viet-sql-sap-b1", "sql-sap-b1", "infoasia_ro", "docentry", "baseentry"]),
    ({"ngach", "niche", "ytradar", "radar", "15000"},
     ["yt-shortcode-commander", "ytradar", "niche"]),
    ({"tai", "download", "8088", "tiktok", "batch"},
     ["antigravity-browser-controller", "downloader"]),
    ({"nuoi", "nick", "proxy", "antidetect", "stealth", "profile"},
     ["antigravity-browser-controller", "yt-shortcode-commander", "cdp"]),
    ({"dang", "facebook", "auto", "post", "trinh", "duyet", "coc", "chrome", "cdp"},
     ["antigravity-browser-controller", "facebook_post", "cdp", "omnibrowser"]),
    ({"mau", "nuoc", "watercolor", "watercolour", "p5", "brush", "clawd"},
     ["painted-animation", "p5.brush", "watercolor", "clawd"]),
    ({"kinetic", "reel", "showreel", "three", "threejs", "webgl", "typography"},
     ["kinetic-reel", "threejs", "webgl", "typography"]),
    ({"gsap", "scrolltrigger", "splittext", "morphsvg", "cuon", "tween", "greensock"},
     ["gsap-skills", "scrolltrigger", "splittext", "morphsvg", "tween"]),
    ({"remotion", "manim", "editly", "auto", "editor", "khoang", "lang"},
     ["create-and-edit-video", "remotion", "manim", "editly"]),
    ({"goc", "may", "camera", "anh", "sang", "lighting", "veo", "seedance", "kling", "sora"},
     ["cinematic-video-prompt", "video-storytelling", "veo", "seedance"]),
    ({"kich", "ban", "storytelling", "storyboard", "aida", "pas", "abt", "pixar", "harmon"},
     ["video-storytelling", "cong-thuc-viet-content-by-noti-v4", "storyboard"]),
    ({"youtube", "eme", "kosmosgeist", "sgw", "kenh"},
     ["yt-shortcode-commander", "video-storytelling"]),
    ({"landing", "page", "vietqr", "capi", "pixel", "liquid", "glass"},
     ["design-landingpage-vip-v2", "vietqr", "capi"]),
    ({"flatsome", "wordpress", "ux", "builder", "shortcode", "woocommerce"},
     ["wordpress-flatsome-designer", "flatsome"]),
    ({"seo", "geo", "schema", "vitals", "inp", "sitemap", "eeat", "overviews"},
     ["claude-seo", "schema", "vitals", "eeat"]),
    ({"content", "copy", "quang", "cao", "ads", "ban", "hang", "caption"},
     ["cong-thuc-viet-content-by-noti-v4", "aida", "pas", "fab"]),
    ({"pubmed", "pmid", "medline", "arxiv", "biorxiv", "openalex", "europepmc"},
     ["pubmed-database", "verified-source-researcher", "openalex", "europepmc", "arxiv"]),
    ({"nghien", "cuu", "tap", "chi", "doi", "isbn", "pmid", "citation"},
     ["verified-source-researcher", "pubmed-database", "openalex"]),
    ({"ao", "giac", "hallucination", "nguon", "trich", "dan"},
     ["verified-source-researcher", "ifixai-agent-auditor"]),
    ({"kiem", "toan", "ifixai", "scorecard", "fabrication", "deception", "pillar", "auditor"},
     ["ifixai-agent-auditor", "verified-source-researcher", "scorecard"]),
    ({"bao", "mat", "security", "lo", "hong", "vulnerability", "pentest", "xss", "csrf", "ssrf", "injection", "secret", "token", "key", "owasp"},
     ["security-audit", "vulnerability", "owasp", "pentest"]),
    ({"prompt", "system", "awesome", "san"},
     ["prompts-chat", "cinematic-video-prompt"]),
    ({"nap", "tai", "lieu", "ingest", "training", "them", "skill"},
     ["nap-tai-lieu-antigravity", "ingest"]),
    ({"protein", "alphafold", "pdb", "uniprot", "gen", "variant", "clinvar", "gnomad", "thuoc", "fda", "chembl", "pubchem"},
     ["alphafold", "uniprot", "clinvar", "openfda", "chembl", "pubchem"]),
    ({"google", "docs", "sheets", "slides", "drive", "gdocs", "gsheets", "gdrive", "gslides"},
     ["gdocs", "gsheets", "gdrive", "gslides"]),
    ({"google", "ads", "gaql", "pmax", "troas", "tcpa", "rsa", "sitelink", "sitelinks", "callout", "callouts", "wasted", "leak"},
     ["google-ads-master", "gaql", "pmax", "roas", "cpa", "campaign", "audit"]),
    ({"tu", "khoa", "keyword", "planner", "nhom", "ngan", "sach", "phu", "dinh", "negative"},
     ["google-ads-master", "keyword-analysis", "planner", "negative", "cpc"]),
    ({"chuyen", "doi", "cro", "trang", "dich", "tracking", "conversion", "message", "match"},
     ["ui-ux-cro-auditor", "google-ads-master", "toi-uu-chuyen-doi-web", "measurement", "conversion", "cro"]),
    ({"tu", "vi", "dau", "bat", "tru", "binh", "dung", "than", "menh", "tiet", "khi", "iztro", "bazi", "astrolabe"},
     ["tu-vi-bat-tu-than-so-hoc", "iztro", "pythagoras", "bazi", "tiet", "khi"]),
    ({"pythagoras", "numerology", "nhan", "than", "hoc", "duong", "doi", "linh", "hon", "pinnacle"},
     ["tu-vi-bat-tu-than-so-hoc", "pythagoras", "numerology", "phillips"]),
    ({"kim", "lau", "hoang", "oc", "tam", "tai", "hon", "phoi", "dai", "hoa"},
     ["tu-vi-bat-tu-than-so-hoc", "kim", "lau", "hoang", "oc", "hon", "phoi"]),
    ({"webapp", "admin", "rbac", "crud", "drawer", "wizard", "stepper", "impeccable", "operate", "luong", "thao", "tac", "quan", "tri"},
     ["webapp-app-ux-workflow", "ui-ux-design-pro-max", "operate", "rbac", "crud", "drawer", "tabular"]),
    ({"blueprint", "prd", "grill", "spec", "chot", "yeu", "cau", "project"},
     ["project-blueprint-architect", "blueprint", "grill", "spec"]),
    ({"rea", "asar", "decompile", "ghidra", "pyinstaller", "dich", "nguoc", "reverse", "engineer"},
     ["reverse-engineer-anything", "rea", "asar", "decompile"]),
    ({"recordly", "srt", "tutorial", "quay", "man", "hinh", "phu", "de"},
     ["recordly-tutorial-ai", "recordly", "srt", "tutorial"]),
    ({"logo", "cip", "typst", "poster", "tap", "chi", "bao", "gia", "banner"},
     ["brand-editorial-graphic-studio", "logo", "cip", "typst"]),
    ({"webcake", "pke"},
     ["html-to-webcake", "webcake", "pke"]),
    ({"shopee", "affiliate", "dhash"},
     ["shopee-affiliate-video-studio", "shopee", "affiliate"]),
    ({"audit", "ui", "ux", "responsive", "mobile", "viewport", "wcag", "cwv", "corporate", "doanh", "nghiep", "vo", "khung", "giao", "dien", "logic", "gstack"},
     ["ui-ux-cro-auditor", "webapp-app-ux-workflow", "viewport", "wcag", "cro"]),
    ({"deeptutor", "eduhub", "lightrag", "graphrag", "anki", "vu", "tru", "khoa", "hoc", "thien", "van", "quy", "dao", "manim", "remotion"},
     ["deeptutor-cli", "create-and-edit-video", "lam-phim-video-master", "math_animator", "video_lesson"]),
]


def _sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def norm_vi(value: str) -> str:
    """Chuẩn hóa tiếng Việt không dấu (map tay đ/Đ như memory_index.py của Javis OS)."""
    raw = str(value or "").replace("đ", "d").replace("Đ", "D")
    raw = unicodedata.normalize("NFKD", raw.casefold())
    stripped = "".join(c for c in raw if not unicodedata.combining(c))
    return " ".join(_WORD_RE.findall(stripped))


def query_terms(value: str) -> list[str]:
    return [t for t in dict.fromkeys(norm_vi(value).split()) if t not in STOPWORDS and len(t) >= 2]


def _fts_term(token: str) -> str:
    """Chỉ bật prefix wildcard `*` cho từ >= 5 ký tự để tránh quét hàng vạn postings ở từ ngắn 2-4 ký tự."""
    return f'"{token}"*' if len(token) >= 5 else f'"{token}"'


def expand_synonyms(terms: list[str]) -> list[str]:
    tset = set(terms)
    extra: list[str] = []
    for triggers, expansions in CONCEPT_SYNONYMS:
        overlap = tset & triggers
        if len(overlap) >= 2 or (len(overlap) == 1 and next(iter(overlap)) in HIGH_SPECIFICITY_SINGLE_TOKENS):
            for item in expansions:
                for sub in norm_vi(item).split():
                    if sub not in tset and sub not in extra and len(sub) >= 2 and sub not in STOPWORDS:
                        extra.append(sub)
    return extra[:12]


def rrf_fuse(rank_lists: list[list[str]], k: int = RRF_K, weights: Optional[list[float]] = None) -> dict[str, float]:
    """Reciprocal Rank Fusion chuẩn Javis OS capability_index.py."""
    out: dict[str, float] = {}
    ws = list(weights or [])
    kk = max(1, int(k or RRF_K))
    for idx, ids in enumerate(rank_lists):
        w = float(ws[idx]) if idx < len(ws) else 1.0
        if w <= 0:
            continue
        for rank, cid in enumerate(ids):
            out[cid] = out.get(cid, 0.0) + w / (kk + rank + 1)
    return out


def validate_skill_description(desc: str) -> Optional[str]:
    """Kiểm định chuẩn SKILL_DESC_MAX = 150 & chống cụm mở đầu sáo rỗng từ Javis skill_router.py."""
    d = (desc or "").strip()
    if not d:
        return "description đang để trống."
    if len(d) > SKILL_DESC_MAX:
        return (
            f"description dài {len(d)} ký tự (vượt trần {SKILL_DESC_MAX} ký tự của Javis Router). "
            "Hãy giữ câu tóm tắt năng lực <= 150 ký tự và đưa ví dụ TRIGGERS xuống mục '## Khi nào dùng' trong thân file."
        )
    if _DESC_BOILERPLATE_RE.match(d):
        return (
            "description mở đầu bằng cụm sáo rỗng ('Kích hoạt khi...', 'Use this skill when...'). "
            "Hãy nêu thẳng năng lực cốt lõi của skill."
        )
    return None


def parse_skill_markdown(raw_text: str) -> tuple[dict[str, Any], str, bool]:
    clean = raw_text.lstrip("\ufeff")
    m = re.match(r"^---\r?\n(.*?)\r?\n---\r?\n?", clean, re.S)
    if not m:
        return {}, clean, False
    fm_raw = m.group(1)
    body = clean[m.end():]
    try:
        parsed = yaml.safe_load(fm_raw)
        if isinstance(parsed, dict):
            return parsed, body, True
    except Exception:
        pass
    fallback: dict[str, Any] = {}
    nm = re.search(r"^name:\s*(.+)$", fm_raw, re.M)
    if nm:
        fallback["name"] = nm.group(1).strip().strip("\"'")
    dm = re.search(r"^description:\s*(?:>-?\s*\r?\n((?:[ \t]+.*\r?\n?)+)|(.+))$", fm_raw, re.M)
    if dm:
        fallback["description"] = re.sub(r"\s+", " ", (dm.group(1) or dm.group(2) or "")).strip()
    return fallback, body, False


def file_to_uri(p: Path | str, start_line: int = 0, end_line: int = 0) -> str:
    posix_path = os.path.abspath(str(p)).replace("\\", "/").lstrip("/")
    uri = "file:///" + posix_path
    if start_line > 0 and end_line >= start_line:
        uri += f"#L{start_line}-L{end_line}"
    elif start_line > 0:
        uri += f"#L{start_line}"
    return uri


def chunk_file_with_lines(file_path: Path, rel_path: str, text: str, file_kind: str) -> list[dict[str, Any]]:
    """Cắt file thành các đoạn có tọa độ dòng thật 1-based `line_start..line_end`."""
    lines = text.splitlines()
    if not lines:
        return []

    chunks: list[dict[str, Any]] = []

    if file_kind == "markdown":
        cur_heading = f"{rel_path} (Mở đầu)"
        cur_start = 1
        cur_lines: list[str] = []

        def flush_section(end_line: int):
            if not cur_lines:
                return
            sec_text = "\n".join(cur_lines).strip()
            if not sec_text:
                return
            if len(sec_text) <= MAX_CHUNK_CHARS:
                chunks.append({
                    "heading": cur_heading[:180],
                    "line_start": cur_start,
                    "line_end": max(cur_start, end_line),
                    "content": sec_text,
                })
            else:
                sub_lines: list[str] = []
                sub_start = cur_start
                sub_chars = 0
                for idx, ln in enumerate(cur_lines):
                    abs_ln = cur_start + idx
                    sub_lines.append(ln)
                    sub_chars += len(ln) + 1
                    if sub_chars >= MAX_CHUNK_CHARS:
                        chunks.append({
                            "heading": cur_heading[:180],
                            "line_start": sub_start,
                            "line_end": abs_ln,
                            "content": "\n".join(sub_lines).strip(),
                        })
                        sub_lines = []
                        sub_start = abs_ln + 1
                        sub_chars = 0
                if sub_lines:
                    chunks.append({
                        "heading": cur_heading[:180],
                        "line_start": sub_start,
                        "line_end": max(sub_start, end_line),
                        "content": "\n".join(sub_lines).strip(),
                    })

        in_fence = False
        for idx, line in enumerate(lines, start=1):
            stripped = line.strip()
            if stripped.startswith("```") or stripped.startswith("~~~"):
                in_fence = not in_fence
            if not in_fence:
                hm = _HEADING_RE.match(line)
                if hm:
                    flush_section(idx - 1)
                    cur_heading = hm.group(2).strip()
                    cur_start = idx
                    cur_lines = [line]
                    continue
            cur_lines.append(line)
        flush_section(len(lines))
        return chunks

    first_comment = ""
    for ln in lines[:15]:
        s = ln.strip().lstrip("-/#*;\"' ")
        if len(s) >= 8:
            first_comment = s[:140]
            break
    heading_base = f"{rel_path}" + (f" — {first_comment}" if first_comment else "")

    window = 80
    for start_idx in range(0, min(len(lines), 400), window):
        seg = lines[start_idx:start_idx + window]
        seg_text = "\n".join(seg).strip()
        if not seg_text:
            continue
        chunks.append({
            "heading": heading_base[:180],
            "line_start": start_idx + 1,
            "line_end": start_idx + len(seg),
            "content": seg_text[:MAX_CHUNK_CHARS],
        })
    return chunks


if _SUPPORTS_CONTENTLESS_DELETE:
    _CHUNKS_AND_FTS_DDL = """
    CREATE TABLE IF NOT EXISTS skill_chunks(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chunk_id TEXT NOT NULL UNIQUE,
        skill_slug TEXT NOT NULL,
        file_path TEXT NOT NULL,
        rel_path TEXT NOT NULL,
        heading TEXT NOT NULL,
        line_start INTEGER NOT NULL,
        line_end INTEGER NOT NULL,
        content TEXT NOT NULL,
        file_kind TEXT NOT NULL,
        authority REAL NOT NULL DEFAULT 1.0
    );
    CREATE INDEX IF NOT EXISTS idx_chunks_slug ON skill_chunks(skill_slug);
    CREATE INDEX IF NOT EXISTS idx_chunks_file ON skill_chunks(file_path);

    CREATE VIRTUAL TABLE IF NOT EXISTS skill_chunks_fts USING fts5(
        skill_slug,
        heading,
        norm_text,
        content='',
        contentless_delete=1,
        tokenize='unicode61 remove_diacritics 2'
    );

    CREATE TRIGGER IF NOT EXISTS trg_skill_chunks_ad AFTER DELETE ON skill_chunks BEGIN
        DELETE FROM skill_chunks_fts WHERE rowid = old.id;
    END;
    """
else:
    _CHUNKS_AND_FTS_DDL = """
    CREATE TABLE IF NOT EXISTS skill_chunks(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chunk_id TEXT NOT NULL UNIQUE,
        skill_slug TEXT NOT NULL,
        file_path TEXT NOT NULL,
        rel_path TEXT NOT NULL,
        heading TEXT NOT NULL,
        line_start INTEGER NOT NULL,
        line_end INTEGER NOT NULL,
        content TEXT NOT NULL,
        norm_text TEXT NOT NULL,
        file_kind TEXT NOT NULL,
        authority REAL NOT NULL DEFAULT 1.0
    );
    CREATE INDEX IF NOT EXISTS idx_chunks_slug ON skill_chunks(skill_slug);
    CREATE INDEX IF NOT EXISTS idx_chunks_file ON skill_chunks(file_path);

    CREATE VIRTUAL TABLE IF NOT EXISTS skill_chunks_fts USING fts5(
        skill_slug,
        heading,
        norm_text,
        content='skill_chunks',
        content_rowid='id',
        tokenize='unicode61 remove_diacritics 2'
    );

    CREATE TRIGGER IF NOT EXISTS trg_skill_chunks_ai AFTER INSERT ON skill_chunks BEGIN
        INSERT INTO skill_chunks_fts(rowid, skill_slug, heading, norm_text)
        VALUES (new.id, new.skill_slug, new.heading, new.norm_text);
    END;
    CREATE TRIGGER IF NOT EXISTS trg_skill_chunks_ad AFTER DELETE ON skill_chunks BEGIN
        INSERT INTO skill_chunks_fts(skill_chunks_fts, rowid, skill_slug, heading, norm_text)
        VALUES ('delete', old.id, old.skill_slug, old.heading, old.norm_text);
    END;
    CREATE TRIGGER IF NOT EXISTS trg_skill_chunks_au AFTER UPDATE ON skill_chunks BEGIN
        INSERT INTO skill_chunks_fts(skill_chunks_fts, rowid, skill_slug, heading, norm_text)
        VALUES ('delete', old.id, old.skill_slug, old.heading, old.norm_text);
        INSERT INTO skill_chunks_fts(rowid, skill_slug, heading, norm_text)
        VALUES (new.id, new.skill_slug, new.heading, new.norm_text);
    END;
    """

_SCHEMA_DDL = f"""
CREATE TABLE IF NOT EXISTS index_meta(
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS skill_catalog(
    slug TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    group_name TEXT NOT NULL,
    source_tier TEXT NOT NULL,
    skill_dir TEXT NOT NULL,
    skill_md_path TEXT NOT NULL,
    skill_md_mtime_ns INTEGER NOT NULL DEFAULT 0,
    file_count INTEGER NOT NULL DEFAULT 1,
    frontmatter_ok INTEGER NOT NULL DEFAULT 1,
    desc_warning TEXT NOT NULL DEFAULT '',
    broken_links_json TEXT NOT NULL DEFAULT '[]',
    duplicate_paths_json TEXT NOT NULL DEFAULT '[]',
    triggers_norm TEXT NOT NULL DEFAULT '',
    updated_at REAL NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_catalog_md_path ON skill_catalog(skill_md_path);

CREATE TABLE IF NOT EXISTS indexed_files(
    file_path TEXT PRIMARY KEY,
    skill_slug TEXT NOT NULL,
    rel_path TEXT NOT NULL,
    mtime_ns INTEGER NOT NULL,
    size_bytes INTEGER NOT NULL,
    sha256 TEXT NOT NULL,
    chunk_count INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_files_slug ON indexed_files(skill_slug);

{_CHUNKS_AND_FTS_DDL}

CREATE TABLE IF NOT EXISTS skill_links(
    from_slug TEXT NOT NULL,
    from_file TEXT NOT NULL,
    target_ref TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_links_slug ON skill_links(from_slug);

CREATE TABLE IF NOT EXISTS skill_usage(
    slug TEXT PRIMARY KEY,
    hit_count INTEGER NOT NULL DEFAULT 0,
    last_used_at REAL NOT NULL DEFAULT 0
);
"""

_DROP_DERIVED_TABLES_SQL = """
DROP TRIGGER IF EXISTS trg_skill_chunks_ai;
DROP TRIGGER IF EXISTS trg_skill_chunks_ad;
DROP TRIGGER IF EXISTS trg_skill_chunks_au;
DROP TABLE IF EXISTS skill_chunks_fts;
DROP TABLE IF EXISTS skill_chunks;
DROP TABLE IF EXISTS indexed_files;
DROP TABLE IF EXISTS skill_catalog;
DROP TABLE IF EXISTS skill_links;
"""


class AgySkillHybridEngine:
    """Bộ máy Chỉ mục Lai SQLite WAL + Contentless-Delete FTS5 + IDF-Weighted RRF (v2) cho Antigravity."""

    def __init__(self, db_path: str | Path = DEFAULT_DB_PATH):
        self.db_path = Path(db_path)
        self._lock = threading.RLock()
        self._conn: Optional[sqlite3.Connection] = None
        self._catalog_cache: Optional[dict[str, dict[str, Any]]] = None
        self._idf_cache: dict[str, float] = {}
        self._catalog_cache_key: tuple[int, int] = (-1, -1)
        self._local_gen: int = 0
        self._plugin_roots_cache: Optional[tuple[str, list[Path]]] = None

    def _invalidate_cache(self):
        self._local_gen += 1
        self._catalog_cache = None

    def _quarantine_corrupt(self):
        if self._conn is not None:
            try:
                self._conn.close()
            except Exception:
                pass
            self._conn = None
        self._invalidate_cache()
        if self.db_path.exists():
            corrupt_dst = self.db_path.with_suffix(f".corrupt.{int(time.time())}.db")
            try:
                self.db_path.rename(corrupt_dst)
            except OSError:
                try:
                    self.db_path.unlink()
                except OSError:
                    pass

    def _configure_connection(self, db: sqlite3.Connection):
        db.row_factory = sqlite3.Row
        db.execute("PRAGMA busy_timeout=8000")
        db.execute("PRAGMA journal_mode=WAL")
        db.execute("PRAGMA synchronous=NORMAL")
        db.execute("PRAGMA temp_store=MEMORY")
        db.execute("PRAGMA cache_size=-16000")
        db.execute("PRAGMA recursive_triggers=ON")

    def conn(self) -> sqlite3.Connection:
        with self._lock:
            if self._conn is not None:
                return self._conn
            self.db_path.parent.mkdir(parents=True, exist_ok=True)
            try:
                db = sqlite3.connect(str(self.db_path), timeout=10.0, check_same_thread=False)
                self._configure_connection(db)
                self._init_schema(db)
                self._conn = db
                return db
            except sqlite3.DatabaseError as exc:
                msg = str(exc).lower()
                if not any(k in msg for k in ("malformed", "not a database", "corrupt")):
                    raise
                self._quarantine_corrupt()
                db = sqlite3.connect(str(self.db_path), timeout=10.0, check_same_thread=False)
                self._configure_connection(db)
                self._init_schema(db)
                self._conn = db
                return db

    def _init_schema(self, db: sqlite3.Connection):
        cur_ver = ""
        try:
            row = db.execute("SELECT value FROM index_meta WHERE key='schema_version'").fetchone()
            if row:
                cur_ver = row[0]
        except sqlite3.Error:
            cur_ver = ""

        # Fast-path 100% Read-Only: tuyệt đối KHÔNG chạy DDL hay INSERT khi schema đã khớp,
        # giúp hàng chục tiến trình MCP + Hook mở chung SQLite WAL cùng lúc mà không bao giờ tranh chấp khóa ghi!
        if cur_ver == INDEX_SCHEMA_VERSION:
            return

        db.executescript("DROP TABLE IF EXISTS index_meta;\n" + _DROP_DERIVED_TABLES_SQL)
        db.executescript(_SCHEMA_DDL)
        db.execute(
            "INSERT OR REPLACE INTO index_meta(key, value) VALUES('schema_version', ?)",
            (INDEX_SCHEMA_VERSION,),
        )
        db.commit()
        self._compact_db(db)

    def _compact_db(self, db: sqlite3.Connection):
        """Tối ưu cây B-tree FTS5, thu hồi dung lượng trống bằng VACUUM và cắt gọn file .db-wal."""
        try:
            db.execute("INSERT INTO skill_chunks_fts(skill_chunks_fts) VALUES('optimize')")
            db.commit()
        except sqlite3.Error:
            pass
        try:
            db.execute("VACUUM")
        except sqlite3.Error:
            pass
        try:
            db.execute("PRAGMA wal_checkpoint(TRUNCATE)")
        except sqlite3.Error:
            pass

    def _db_disk_size_mb(self) -> float:
        total = 0
        for suffix in ("", "-wal", "-shm"):
            p = Path(str(self.db_path) + suffix)
            if p.exists():
                try:
                    total += p.stat().st_size
                except OSError:
                    pass
        return round(total / (1024.0 * 1024.0), 2)

    def _plugins_tree_signature(self, p_root: Path) -> str:
        """Tạo chữ ký nhanh (< 1ms) của thư mục plugins cấp 1 & cấp 2 (`skills/`) bằng os.scandir."""
        parts: list[str] = []
        try:
            with os.scandir(p_root) as it:
                entries = sorted(
                    (e for e in it if e.is_dir(follow_symlinks=False) and not e.name.startswith(".")),
                    key=lambda e: e.name,
                )
                for e in entries:
                    st = e.stat(follow_symlinks=False)
                    parts.append(f"{e.name}:{st.st_mtime_ns}")
                    sub_skills = Path(e.path) / "skills"
                    if sub_skills.is_dir():
                        with os.scandir(sub_skills) as sit:
                            for se in sorted(sit, key=lambda x: x.name):
                                if se.is_dir(follow_symlinks=False):
                                    sst = se.stat(follow_symlinks=False)
                                    parts.append(f"  {se.name}:{sst.st_mtime_ns}")
        except OSError:
            pass
        return "|".join(parts)

    def discover_skill_roots(
        self,
        workspace_paths: Optional[list[str]] = None,
        force_walk_plugins: bool = False,
    ) -> list[tuple[str, Path, float]]:
        """Trả về danh sách (source_tier, skill_dir, base_authority) siêu tốc bằng os.scandir."""
        discovered: list[tuple[str, Path, float]] = []

        # 1. Workspace customizations (.agents/skills/*) — Highest precedence
        for wp in workspace_paths or []:
            p = Path(wp)
            for dot_name in (".agents", ".agent", "_agents", "_agent"):
                ws_skills = p / dot_name / "skills"
                if ws_skills.is_dir():
                    try:
                        with os.scandir(ws_skills) as it:
                            for e in sorted(it, key=lambda x: x.name):
                                if e.is_dir(follow_symlinks=False) and (Path(e.path) / "SKILL.md").is_file():
                                    discovered.append(("workspace", Path(e.path), 1.05))
                    except OSError:
                        pass

        # 2. Global Skills (~/.gemini/config/skills/*)
        g_skills = CONFIG_DIR / "skills"
        if g_skills.is_dir():
            try:
                with os.scandir(g_skills) as it:
                    for e in sorted(it, key=lambda x: x.name):
                        if not e.name.startswith(".") and e.is_dir(follow_symlinks=False) and (Path(e.path) / "SKILL.md").is_file():
                            discovered.append(("global", Path(e.path), 1.00))
            except OSError:
                pass

        # 3. Plugin Skills (~/.gemini/config/plugins/**) — cached by 2-level directory mtime signature
        p_root = CONFIG_DIR / "plugins"
        if p_root.is_dir():
            sig = self._plugins_tree_signature(p_root)
            plugin_dirs: Optional[list[Path]] = None
            if not force_walk_plugins and self._plugin_roots_cache and self._plugin_roots_cache[0] == sig:
                plugin_dirs = self._plugin_roots_cache[1]
            elif not force_walk_plugins and self._conn is not None:
                try:
                    db_sig_row = self._conn.execute("SELECT value FROM index_meta WHERE key='plugins_sig'").fetchone()
                    db_dirs_row = self._conn.execute("SELECT value FROM index_meta WHERE key='plugins_dirs_json'").fetchone()
                    if db_sig_row and db_dirs_row and db_sig_row[0] == sig:
                        loaded_paths = [Path(x) for x in json.loads(db_dirs_row[0])]
                        if all((p / "SKILL.md").is_file() for p in loaded_paths):
                            plugin_dirs = loaded_paths
                            self._plugin_roots_cache = (sig, plugin_dirs)
                except Exception:
                    plugin_dirs = None

            if plugin_dirs is None:
                walked: list[Path] = []
                for root, dirs, files in os.walk(p_root):
                    dirs[:] = [
                        d for d in sorted(dirs)
                        if d not in SKIP_DIRS and not d.endswith(".egg-info") and not d.startswith(".")
                    ]
                    if "SKILL.md" in files:
                        walked.append(Path(root))
                plugin_dirs = walked
                self._plugin_roots_cache = (sig, plugin_dirs)

            for pd in plugin_dirs:
                discovered.append(("plugin", pd, 0.88))

        # 4. Builtin Skills (~/.gemini/antigravity/builtin/skills/*)
        b_root = Path.home() / ".gemini" / "antigravity" / "builtin" / "skills"
        if b_root.is_dir():
            try:
                with os.scandir(b_root) as it:
                    for e in sorted(it, key=lambda x: x.name):
                        if e.is_dir(follow_symlinks=False) and (Path(e.path) / "SKILL.md").is_file():
                            discovered.append(("builtin", Path(e.path), 0.82))
            except OSError:
                pass

        return discovered

    def _collect_skill_files_fast(
        self,
        skill_dir: Path,
        nested_roots_norm: set[str],
    ) -> list[tuple[Path, int, int]]:
        """
        Duyệt file bằng `os.scandir()` đệ quy: trên Windows NTFS, `DirEntry.stat()` đọc trực tiếp
        `st_mtime_ns` và `st_size` từ bộ đệm thư mục mà KHÔNG tốn bất kỳ syscall `CreateFileW` nào!
        Trả về danh sách `(Path, st_mtime_ns, st_size)`.
        """
        results: list[tuple[Path, int, int]] = []
        skill_dir_str = str(skill_dir)
        prefix_len = len(skill_dir_str.rstrip("\\/")) + 1

        candidates: list[tuple[int, str, Path, int, int]] = []
        skill_md_tuple: Optional[tuple[Path, int, int]] = None

        def _scan_dir(cur_dir_str: str, is_root: bool):
            try:
                with os.scandir(cur_dir_str) as it:
                    entries = list(it)
            except OSError:
                return
            entries.sort(key=lambda e: e.name)
            for entry in entries:
                ename = entry.name
                if ename.startswith("."):
                    continue
                try:
                    if entry.is_dir(follow_symlinks=False):
                        if ename in SKIP_DIRS or ename.endswith(".egg-info"):
                            continue
                        norm_sub = os.path.normcase(os.path.abspath(entry.path))
                        if norm_sub in nested_roots_norm:
                            continue
                        _scan_dir(entry.path, False)
                    elif entry.is_file(follow_symlinks=False):
                        st = entry.stat(follow_symlinks=False)
                        sz = st.st_size
                        if is_root and ename == "SKILL.md":
                            skill_md_tuple =_make_tuple(entry.path, st.st_mtime_ns, sz)
                            continue
                        if sz == 0 or sz > MAX_FILE_BYTES:
                            continue
                        dot_idx = ename.rfind(".")
                        if dot_idx < 0:
                            continue
                        ext = ename[dot_idx:].lower()
                        if ext not in INDEXABLE_EXTENSIONS:
                            continue
                        rel_posix = entry.path[prefix_len:].replace("\\", "/")
                        rel_lower = rel_posix.lower()
                        if ext in (".py", ".ps1", ".sh"):
                            if not ("/scripts/" in f"/{rel_lower}" or rel_lower == "cli.py"):
                                continue
                        prio = 0
                        if ext in (".md", ".sql"):
                            prio -= 20
                        if rel_lower.startswith(("references/", "docs/", "skills/", "prompts/")):
                            prio -= 10
                        elif rel_lower.startswith(("examples/", "scripts/", "resources/")):
                            prio -= 5
                        candidates.append((prio, entry.path, Path(entry.path), st.st_mtime_ns, sz))
                except OSError:
                    continue

        def _make_tuple(p_str: str, m_ns: int, s_b: int) -> tuple[Path, int, int]:
            return (Path(p_str), m_ns, s_b)

        # Dùng biến nonlocal cho skill_md_tuple
        try:
            with os.scandir(skill_dir_str) as root_it:
                root_entries = sorted(list(root_it), key=lambda e: e.name)
        except OSError:
            return results

        for entry in root_entries:
            ename = entry.name
            if ename.startswith("."):
                continue
            try:
                if entry.is_dir(follow_symlinks=False):
                    if ename in SKIP_DIRS or ename.endswith(".egg-info"):
                        continue
                    norm_sub = os.path.normcase(os.path.abspath(entry.path))
                    if norm_sub in nested_roots_norm:
                        continue
                    _scan_dir(entry.path, False)
                elif entry.is_file(follow_symlinks=False):
                    st = entry.stat(follow_symlinks=False)
                    sz = st.st_size
                    if ename == "SKILL.md":
                        skill_md_tuple = (Path(entry.path), st.st_mtime_ns, sz)
                        continue
                    if sz == 0 or sz > MAX_FILE_BYTES:
                        continue
                    dot_idx = ename.rfind(".")
                    if dot_idx < 0:
                        continue
                    ext = ename[dot_idx:].lower()
                    if ext not in INDEXABLE_EXTENSIONS:
                        continue
                    rel_lower = ename.lower()
                    if ext in (".py", ".ps1", ".sh") and rel_lower != "cli.py":
                        continue
                    prio = -20 if ext in (".md", ".sql") else 0
                    candidates.append((prio, entry.path, Path(entry.path), st.st_mtime_ns, sz))
            except OSError:
                continue

        if skill_md_tuple is not None:
            results.append(skill_md_tuple)
        candidates.sort(key=lambda x: (x[0], x[1]))
        for _, _, fp, m_ns, sz in candidates[:MAX_FILES_PER_SKILL - 1]:
            results.append((fp, m_ns, sz))
        return results

    def sync_index(
        self,
        workspace_paths: Optional[list[str]] = None,
        force_rebuild: bool = False,
    ) -> dict[str, Any]:
        """Đồng bộ chỉ mục Delta zero-syscall scandir siêu tốc (< 100ms khi không đổi, < 150ms khi sửa 1 file)."""
        t0 = time.perf_counter()
        with self._lock:
            db = self.conn()
            if force_rebuild:
                db.executescript(_DROP_DERIVED_TABLES_SQL + "\n" + _SCHEMA_DDL)
                db.execute(
                    "INSERT OR REPLACE INTO index_meta(key, value) VALUES('schema_version', ?)",
                    (INDEX_SCHEMA_VERSION,),
                )
                db.commit()

            existing_files = {
                row["file_path"]: (row["mtime_ns"], row["size_bytes"], row["sha256"], row["skill_slug"])
                for row in db.execute("SELECT file_path, mtime_ns, size_bytes, sha256, skill_slug FROM indexed_files")
            }
            existing_cat_by_md = {
                row["skill_md_path"]: dict(row)
                for row in db.execute(
                    "SELECT slug, skill_md_path, skill_md_mtime_ns, file_count, source_tier, broken_links_json, duplicate_paths_json FROM skill_catalog"
                )
            }

            roots = self.discover_skill_roots(workspace_paths, force_walk_plugins=force_rebuild)
            all_root_norm = {os.path.normcase(os.path.abspath(str(d))) for _, d, _ in roots}
            seen_slugs: dict[str, Path] = {}
            duplicates: dict[str, list[str]] = {}
            active_file_paths: set[str] = set()

            files_reindexed = 0
            files_unchanged = 0
            chunks_added = 0
            catalog_writes = 0

            for tier, skill_dir, base_auth in roots:
                self_norm = os.path.normcase(os.path.abspath(str(skill_dir)))
                nested_norm = all_root_norm - {self_norm}
                sfiles = self._collect_skill_files_fast(skill_dir, nested_norm)
                if not sfiles or sfiles[0][0].name != "SKILL.md":
                    continue

                skill_md, sm_mtime_ns, _ = sfiles[0]
                skill_md_str = str(skill_md)
                prev_cat = existing_cat_by_md.get(skill_md_str)

                if (
                    not force_rebuild
                    and prev_cat is not None
                    and prev_cat["skill_md_mtime_ns"] == sm_mtime_ns
                    and prev_cat["file_count"] == len(sfiles)
                    and prev_cat["source_tier"] == tier
                    and prev_cat["broken_links_json"] == "[]"
                ):
                    slug = prev_cat["slug"]
                    if slug in seen_slugs:
                        duplicates.setdefault(slug, []).append(skill_md_str)
                        continue
                    seen_slugs[slug] = skill_md
                else:
                    try:
                        raw_md = skill_md.read_text(encoding="utf-8", errors="replace")
                    except OSError:
                        continue

                    fm, body, fm_ok = parse_skill_markdown(raw_md)
                    raw_name = str(fm.get("name") or skill_dir.name).strip()
                    slug = re.sub(r"[^a-zA-Z0-9._-]+", "-", raw_name).strip("-").lower() or skill_dir.name.lower()

                    if slug in seen_slugs:
                        duplicates.setdefault(slug, []).append(skill_md_str)
                        continue
                    seen_slugs[slug] = skill_md

                    desc = str(fm.get("description") or "").strip()
                    group_name = str(fm.get("group") or tier.capitalize()).strip()
                    desc_warn = validate_skill_description(desc) or "" if tier == "global" else ""

                    broken_links: list[str] = []
                    found_links: list[str] = []
                    for lm in _MD_LINK_RE.finditer(body):
                        target = lm.group(1).strip()
                        if not target or target.startswith(("http://", "https://", "mailto:", "file://", "sidecar://", "#")):
                            continue
                        found_links.append(target)
                        target_path = (skill_dir / target).resolve()
                        if not target_path.exists():
                            broken_links.append(target)
                    for wm in _WIKILINK_RE.finditer(body):
                        found_links.append(f"[[{wm.group(1).strip()}]]")

                    trig_match = re.search(
                        r"(?:Khi nào dùng|Triggers|When to use).*?\n(.*?)(?:\n## |\Z)",
                        body,
                        re.S | re.I,
                    )
                    trig_text = f"{slug} {raw_name} {group_name} {desc} " + (trig_match.group(1)[:1800] if trig_match else "")
                    triggers_norm = norm_vi(trig_text)

                    db.execute(
                        """
                        INSERT OR REPLACE INTO skill_catalog(
                            slug, name, description, group_name, source_tier, skill_dir, skill_md_path,
                            skill_md_mtime_ns, file_count, frontmatter_ok, desc_warning,
                            broken_links_json, duplicate_paths_json, triggers_norm, updated_at
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        """,
                        (
                            slug,
                            raw_name,
                            desc,
                            group_name,
                            tier,
                            str(skill_dir),
                            skill_md_str,
                            sm_mtime_ns,
                            len(sfiles),
                            1 if fm_ok else 0,
                            desc_warn,
                            json.dumps(broken_links[:20], ensure_ascii=False),
                            "[]",
                            triggers_norm,
                            time.time(),
                        ),
                    )
                    db.execute("DELETE FROM skill_links WHERE from_slug = ?", (slug,))
                    if found_links:
                        db.executemany(
                            "INSERT INTO skill_links(from_slug, from_file, target_ref) VALUES (?, ?, ?)",
                            [(slug, skill_md_str, lk) for lk in found_links[:60]],
                        )
                    catalog_writes += 1

                for fp, mtime_ns, size_bytes in sfiles:
                    fp_str = str(fp)
                    active_file_paths.add(fp_str)

                    prev = existing_files.get(fp_str)
                    if prev and prev[0] == mtime_ns and prev[1] == size_bytes and prev[3] == slug:
                        files_unchanged += 1
                        continue

                    try:
                        raw_bytes = fp.read_bytes()
                    except OSError:
                        continue
                    sha = _sha256_bytes(raw_bytes)
                    if prev and prev[2] == sha and prev[3] == slug:
                        db.execute(
                            "UPDATE indexed_files SET mtime_ns = ?, size_bytes = ? WHERE file_path = ?",
                            (mtime_ns, size_bytes, fp_str),
                        )
                        files_unchanged += 1
                        catalog_writes += 1
                        continue

                    text = raw_bytes.decode("utf-8", errors="replace").lstrip("\ufeff")
                    rel_path = fp.relative_to(skill_dir).as_posix()
                    ext = fp.suffix.lower()
                    fkind, ext_weight = INDEXABLE_EXTENSIONS.get(ext, ("text", 0.75))
                    file_auth = round(base_auth * (1.05 if rel_path == "SKILL.md" else ext_weight), 4)

                    # Xóa chunk cũ O(1) qua idx_chunks_file -> Trigger trg_skill_chunks_ad xóa FTS5 theo integer rowid!
                    if prev is not None:
                        db.execute("DELETE FROM skill_chunks WHERE file_path = ?", (fp_str,))

                    chunks = chunk_file_with_lines(fp, rel_path, text, fkind)
                    if chunks:
                        if _SUPPORTS_CONTENTLESS_DELETE:
                            fts_rows = []
                            for idx, ch in enumerate(chunks):
                                cid = hashlib.sha256(f"{slug}|{rel_path}|{idx}|{ch['line_start']}".encode("utf-8")).hexdigest()[:24]
                                ntext = norm_vi(f"{slug} {rel_path} {ch['heading']} {ch['content']}")
                                cur = db.execute(
                                    """
                                    INSERT INTO skill_chunks(
                                        chunk_id, skill_slug, file_path, rel_path, heading,
                                        line_start, line_end, content, file_kind, authority
                                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                                    """,
                                    (
                                        cid,
                                        slug,
                                        fp_str,
                                        rel_path,
                                        ch["heading"],
                                        ch["line_start"],
                                        ch["line_end"],
                                        ch["content"],
                                        fkind,
                                        file_auth,
                                    ),
                                )
                                fts_rows.append((cur.lastrowid, slug, ch["heading"], ntext))
                            db.executemany(
                                "INSERT INTO skill_chunks_fts(rowid, skill_slug, heading, norm_text) VALUES (?, ?, ?, ?)",
                                fts_rows,
                            )
                        else:
                            rows_to_insert = []
                            for idx, ch in enumerate(chunks):
                                cid = hashlib.sha256(f"{slug}|{rel_path}|{idx}|{ch['line_start']}".encode("utf-8")).hexdigest()[:24]
                                ntext = norm_vi(f"{slug} {rel_path} {ch['heading']} {ch['content']}")
                                rows_to_insert.append((
                                    cid, slug, fp_str, rel_path, ch["heading"],
                                    ch["line_start"], ch["line_end"], ch["content"],
                                    ntext, fkind, file_auth,
                                ))
                            db.executemany(
                                """
                                INSERT INTO skill_chunks(
                                    chunk_id, skill_slug, file_path, rel_path, heading,
                                    line_start, line_end, content, norm_text, file_kind, authority
                                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                                """,
                                rows_to_insert,
                            )

                    db.execute(
                        """
                        INSERT OR REPLACE INTO indexed_files(
                            file_path, skill_slug, rel_path, mtime_ns, size_bytes, sha256, chunk_count
                        ) VALUES (?, ?, ?, ?, ?, ?, ?)
                        """,
                        (fp_str, slug, rel_path, mtime_ns, size_bytes, sha, len(chunks)),
                    )
                    files_reindexed += 1
                    chunks_added += len(chunks)

            for slug, dup_list in duplicates.items():
                dup_json = json.dumps(dup_list, ensure_ascii=False)
                cur_row = db.execute("SELECT duplicate_paths_json FROM skill_catalog WHERE slug = ?", (slug,)).fetchone()
                if cur_row and cur_row[0] != dup_json:
                    db.execute(
                        "UPDATE skill_catalog SET duplicate_paths_json = ? WHERE slug = ?",
                        (dup_json, slug),
                    )
                    catalog_writes += 1

            stale_files = set(existing_files.keys()) - active_file_paths
            for sfp in stale_files:
                db.execute("DELETE FROM skill_chunks WHERE file_path = ?", (sfp,))
                db.execute("DELETE FROM indexed_files WHERE file_path = ?", (sfp,))

            active_slugs = set(seen_slugs.keys())
            cat_slugs = {r[0] for r in db.execute("SELECT slug FROM skill_catalog")}
            dead_slugs = cat_slugs - active_slugs
            for dead_slug in dead_slugs:
                db.execute("DELETE FROM skill_catalog WHERE slug = ?", (dead_slug,))
                db.execute("DELETE FROM skill_links WHERE from_slug = ?", (dead_slug,))

            any_mutation = bool(force_rebuild or files_reindexed or catalog_writes or stale_files or dead_slugs)
            if any_mutation:
                if self._plugin_roots_cache is not None:
                    sig, pdirs = self._plugin_roots_cache
                    db.execute("INSERT OR REPLACE INTO index_meta(key, value) VALUES('plugins_sig', ?)", (sig,))
                    db.execute(
                        "INSERT OR REPLACE INTO index_meta(key, value) VALUES('plugins_dirs_json', ?)",
                        (json.dumps([str(p) for p in pdirs], ensure_ascii=False),),
                    )
                db.execute(
                    "INSERT OR REPLACE INTO index_meta(key, value) VALUES('last_sync_ts', ?)",
                    (str(time.time()),),
                )
                db.commit()
                self._invalidate_cache()
                if force_rebuild:
                    self._compact_db(db)

            total_chunks = db.execute("SELECT COUNT(*) FROM skill_chunks").fetchone()[0]
            total_files = db.execute("SELECT COUNT(*) FROM indexed_files").fetchone()[0]
            total_skills = db.execute("SELECT COUNT(*) FROM skill_catalog").fetchone()[0]
            db_size_mb = self._db_disk_size_mb()

        elapsed_ms = round((time.perf_counter() - t0) * 1000.0, 2)
        return {
            "status": "ok",
            "schema_version": INDEX_SCHEMA_VERSION,
            "db_path": str(self.db_path),
            "db_size_mb": db_size_mb,
            "total_skills": total_skills,
            "total_indexed_files": total_files,
            "total_chunks": total_chunks,
            "files_reindexed": files_reindexed,
            "files_unchanged": files_unchanged,
            "chunks_added": chunks_added,
            "duplicates_detected": duplicates,
            "elapsed_ms": elapsed_ms,
        }

    def ensure_ready(self):
        db = self.conn()
        cnt = db.execute("SELECT COUNT(*) FROM skill_catalog").fetchone()[0]
        if cnt == 0:
            self.sync_index()

    def _get_prepared_catalog(
        self,
        db: sqlite3.Connection,
        tier: str = "all",
    ) -> tuple[dict[str, dict[str, Any]], dict[str, float]]:
        """Cache bảng skill_catalog + trọng số IDF toàn cục trong RAM (< 0.1ms), tự làm mới theo PRAGMA data_version."""
        data_ver = db.execute("PRAGMA data_version").fetchone()[0]
        cache_key = (self._local_gen, int(data_ver))
        with self._lock:
            if self._catalog_cache is None or self._catalog_cache_key != cache_key:
                rows = db.execute("SELECT * FROM skill_catalog").fetchall()
                built: dict[str, dict[str, Any]] = {}
                df_counts: dict[str, int] = {}
                for r in rows:
                    d = dict(r)
                    slug = d["slug"]
                    name_norm = norm_vi(f"{slug} {d['name']} {d['group_name']}")
                    desc_norm = norm_vi(f"{slug} {d['name']} {d['description']}")
                    trig_norm = d["triggers_norm"]
                    name_set = set(name_norm.split())
                    desc_set = set(desc_norm.split())
                    all_set = name_set | desc_set | set(trig_norm.split())
                    for tok in all_set:
                        df_counts[tok] = df_counts.get(tok, 0) + 1
                    slug_parts = [p for p in slug.split("-") if len(p) >= 2]
                    distinctive_slug_tokens = {
                        p for p in slug_parts if p not in GENERIC_SLUG_TOKENS
                    }
                    d["_name_norm"] = name_norm
                    d["_desc_norm"] = desc_norm
                    d["_trig_norm"] = trig_norm
                    d["_name_set"] = name_set
                    d["_desc_set"] = desc_set
                    d["_all_set"] = all_set
                    d["_slug_spaced"] = slug.replace("-", " ")
                    d["_distinctive_slug_tokens"] = distinctive_slug_tokens
                    built[slug] = d

                n_docs = max(1, len(built))
                idf_map = {
                    tok: math.log((n_docs + 1.0) / (df + 1.0)) + 0.5
                    for tok, df in df_counts.items()
                }
                idf_map["__default__"] = math.log(n_docs + 1.0) + 0.5
                self._catalog_cache = built
                self._idf_cache = idf_map
                self._catalog_cache_key = cache_key

            full_cache = self._catalog_cache
            idf_map = self._idf_cache

        if tier == "all":
            return full_cache, idf_map
        return {k: v for k, v in full_cache.items() if v["source_tier"] == tier}, idf_map

    def record_usage(self, slug: str):
        if not slug:
            return
        db = None
        try:
            with self._lock:
                db = self.conn()
                db.execute(
                    """
                    INSERT INTO skill_usage(slug, hit_count, last_used_at)
                    VALUES (?, 1, ?)
                    ON CONFLICT(slug) DO UPDATE SET
                        hit_count = hit_count + 1,
                        last_used_at = excluded.last_used_at
                    """,
                    (slug, time.time()),
                )
                db.commit()
        except sqlite3.Error:
            if db is not None:
                try:
                    db.rollback()
                except sqlite3.Error:
                    pass

    def search_hybrid(
        self,
        query: str,
        top_k: int = 6,
        tier: str = "all",
        record_hit: bool = False,
        skip_sync: bool = False,
    ) -> dict[str, Any]:
        """
        Truy xuất Lai 3 Kênh chuẩn Javis OS v2 (< 15ms):
          Kênh 1: IDF-Weighted Manifest + 150-char Description Focus + Bigram + Distinctive Slug Scorer
          Kênh 2: Contentless-Delete FTS5 BM25 Deep Chunk Search (High-IDF Anchor OR Pruning)
          Kênh 3: High-IDF Bilingual Concept Synonym Expansion + RRF Fusion (RRF_K = 60) + source_affinity
        """
        t0 = time.perf_counter()
        if not skip_sync:
            self.ensure_ready()
        db = self.conn()

        q_norm = norm_vi(query)
        terms = query_terms(query)
        if not terms and q_norm:
            terms = q_norm.split()[:6]
        if not terms:
            return {"query": query, "results": [], "elapsed_ms": 0.0}

        syn_terms = expand_synonyms(terms)
        catalog_map, idf_map = self._get_prepared_catalog(db, tier=tier)
        if not catalog_map:
            return {"query": query, "results": [], "elapsed_ms": 0.0}

        default_idf = idf_map.get("__default__", 4.5)

        def tok_idf(t: str) -> float:
            return idf_map.get(t, default_idf)

        usage_map = {
            r["slug"]: int(r["hit_count"])
            for r in db.execute("SELECT slug, hit_count FROM skill_usage")
        }

        domain_terms = [t for t in terms if t not in GENERIC_OR_NOISE_TERMS]
        effective_q_list = domain_terms if len(domain_terms) >= 2 else terms
        effective_q_set = set(effective_q_list)
        total_q_idf = sum(tok_idf(t) for t in effective_q_set) or 1.0
        q_set = set(terms)
        q_bigrams = [f"{terms[i]} {terms[i + 1]}" for i in range(len(terms) - 1)]

        # --- KÊNH 1: IDF-Weighted Manifest + Description Focus + Bigram + Distinctive Slug Scorer ---
        manifest_scores: list[tuple[float, str]] = []
        distinctive_hits_map: dict[str, int] = {}

        for slug, cat in catalog_map.items():
            name_norm = cat["_name_norm"]
            desc_norm = cat["_desc_norm"]
            trig_norm = cat["_trig_norm"]
            name_set = cat["_name_set"]
            desc_set = cat["_desc_set"]
            all_set = cat["_all_set"]
            slug_spaced = cat["_slug_spaced"]
            dist_tokens = cat["_distinctive_slug_tokens"]

            matched_all = effective_q_set & all_set
            matched_desc = effective_q_set & desc_set
            idf_cov = sum(tok_idf(t) for t in matched_all) / total_q_idf
            desc_cov = sum(tok_idf(t) for t in matched_desc) / total_q_idf
            discrim = len(effective_q_set & name_set) / max(1, min(6, len(name_set)))
            phrase_hit = len(q_norm) >= 4 and (q_norm in trig_norm or q_norm in desc_norm)
            exact_slug = len(slug_spaced) >= 3 and (slug_spaced in q_norm or q_norm == slug_spaced)

            bigram_hits = sum(1 for bg in q_bigrams if bg in trig_norm or bg in desc_norm)
            bigram_bonus = min(0.24, bigram_hits * 0.08)

            dist_hit_cnt = len(q_set & dist_tokens)
            distinctive_hits_map[slug] = dist_hit_cnt
            dist_slug_bonus = min(0.32, dist_hit_cnt * 0.24)

            sc = (
                idf_cov * 0.36
                + desc_cov * 0.24
                + discrim * 0.16
                + bigram_bonus
                + dist_slug_bonus
                + (0.14 if phrase_hit else 0.0)
                + (0.24 if exact_slug else 0.0)
            )
            if sc > 0.07:
                manifest_scores.append((sc, slug))

        manifest_scores.sort(key=lambda x: -x[0])
        manifest_rank_slugs = [slug for _, slug in manifest_scores[:25]]
        manifest_score_dict = {slug: sc for sc, slug in manifest_scores}

        # --- KÊNH 2: Deep Chunk FTS5 Search (High-IDF Anchor Pruning -> < 12ms & 0 Homograph Noise) ---
        fts_chunks: list[sqlite3.Row] = []
        safe_domain = [re.sub(r"[^a-z0-9]", "", t) for t in effective_q_list[:8] if re.sub(r"[^a-z0-9]", "", t)]
        safe_sorted = sorted(safe_domain, key=lambda t: -tok_idf(t))
        high_idf_anchors = [t for t in safe_sorted if tok_idf(t) >= 2.35]
        matched_dist_tokens = sorted(
            {
                re.sub(r"[^a-z0-9]", "", t)
                for slug, cnt in distinctive_hits_map.items()
                if cnt > 0
                for t in (q_set & catalog_map[slug]["_distinctive_slug_tokens"])
                if re.sub(r"[^a-z0-9]", "", t)
            },
            key=lambda t: -tok_idf(t),
        )
        widened = False

        if safe_sorted:
            # 2A. Nếu người dùng gõ đích danh token định danh của Skill (vd: pubmed, alphafold, clinvar, gsap),
            # truy vấn ưu tiên trực tiếp (< 1ms) để không bao giờ bị từ đồng âm tiếng Việt ("từ khóa"/"khóa học") chèn mất!
            if matched_dist_tokens:
                dist_expr = " OR ".join(_fts_term(t) for t in matched_dist_tokens[:4])
                fts_chunks.extend(
                    db.execute(
                        """
                        SELECT c.*, bm25(skill_chunks_fts, 2.5, 3.0, 1.5) AS bm
                        FROM skill_chunks_fts
                        JOIN skill_chunks c ON c.id = skill_chunks_fts.rowid
                        WHERE skill_chunks_fts MATCH ?
                        ORDER BY bm ASC
                        LIMIT 20
                        """,
                        (dist_expr,),
                    ).fetchall()
                )

            and_probe = high_idf_anchors[:4] if len(high_idf_anchors) >= 2 else safe_sorted[:4]
            if and_probe and len(fts_chunks) < 6:
                and_expr = " AND ".join(_fts_term(t) for t in and_probe)
                seen_ids = {r["id"] for r in fts_chunks}
                for r in db.execute(
                    """
                    SELECT c.*, bm25(skill_chunks_fts, 2.5, 3.0, 1.5) AS bm
                    FROM skill_chunks_fts
                    JOIN skill_chunks c ON c.id = skill_chunks_fts.rowid
                    WHERE skill_chunks_fts MATCH ?
                    ORDER BY bm ASC
                    LIMIT 25
                    """,
                    (and_expr,),
                ).fetchall():
                    if r["id"] not in seen_ids:
                        fts_chunks.append(r)
                        seen_ids.add(r["id"])

            fts_covered_slugs = {r["skill_slug"] for r in fts_chunks}
            if len(fts_covered_slugs) < 4:
                widened = True
                # Nếu câu hỏi có từ neo chuyên ngành rõ (IDF >= 2.35), loại các âm tiết đồng âm phổ biến ("khoa", "bao", "hoc", "doi") khỏi OR!
                or_terms = (
                    [t for t in safe_sorted if tok_idf(t) >= 2.2][:6]
                    if high_idf_anchors
                    else safe_sorted[:6]
                )
                if or_terms:
                    or_expr = " OR ".join(_fts_term(t) for t in or_terms)
                    or_rows = db.execute(
                        """
                        SELECT c.*, bm25(skill_chunks_fts, 2.5, 3.0, 1.5) AS bm
                        FROM skill_chunks_fts
                        JOIN skill_chunks c ON c.id = skill_chunks_fts.rowid
                        WHERE skill_chunks_fts MATCH ?
                        ORDER BY bm ASC
                        LIMIT 30
                        """,
                        (or_expr,),
                    ).fetchall()
                    seen_c = {r["id"] for r in fts_chunks}
                    for r in or_rows:
                        if r["id"] not in seen_c:
                            fts_chunks.append(r)
                            seen_c.add(r["id"])

        fts_chunks = [r for r in fts_chunks if r["skill_slug"] in catalog_map]

        fts_slug_order: list[str] = []
        best_chunks_by_slug: dict[str, list[dict[str, Any]]] = {}
        for r in fts_chunks:
            sl = r["skill_slug"]
            if sl not in fts_slug_order:
                fts_slug_order.append(sl)
            lst = best_chunks_by_slug.setdefault(sl, [])
            if len(lst) < 3:
                lst.append(dict(r))

        # --- KÊNH 3: High-IDF Bilingual Synonym Concept FTS5 Search ---
        syn_slug_order: list[str] = []
        if syn_terms:
            safe_syns = [
                re.sub(r"[^a-z0-9]", "", t)
                for t in syn_terms
                if re.sub(r"[^a-z0-9]", "", t) and tok_idf(t) >= 1.9
            ][:8]
            if safe_syns:
                syn_expr = " OR ".join(_fts_term(t) for t in safe_syns)
                syn_rows = db.execute(
                    """
                    SELECT c.*, bm25(skill_chunks_fts, 2.5, 3.0, 1.4) AS bm
                    FROM skill_chunks_fts
                    JOIN skill_chunks c ON c.id = skill_chunks_fts.rowid
                    WHERE skill_chunks_fts MATCH ?
                    ORDER BY bm ASC
                    LIMIT 20
                    """,
                    (syn_expr,),
                ).fetchall()
                for r in syn_rows:
                    sl = r["skill_slug"]
                    if sl not in catalog_map:
                        continue
                    if sl not in syn_slug_order:
                        syn_slug_order.append(sl)
                    lst = best_chunks_by_slug.setdefault(sl, [])
                    if len(lst) < 2 and all(x["chunk_id"] != r["chunk_id"] for x in lst):
                        lst.append(dict(r))

        # --- RRF FUSION (RRF_K = 60) + DESCRIPTION/SLUG PRECISION + SOURCE AFFINITY ---
        fused = rrf_fuse(
            [manifest_rank_slugs, fts_slug_order, syn_slug_order],
            k=RRF_K,
            weights=[1.35, 1.15, 0.65],
        )
        if not fused:
            return {
                "query": query,
                "terms": terms,
                "results": [],
                "elapsed_ms": round((time.perf_counter() - t0) * 1000.0, 2),
            }

        max_rrf = max(fused.values()) or 1.0
        top_prelim_slug = max(fused.items(), key=lambda kv: kv[1])[0]
        top_group = catalog_map[top_prelim_slug]["group_name"]

        ranked_results: list[dict[str, Any]] = []
        for slug, rrf_val in fused.items():
            cat = catalog_map[slug]
            lex_sc = min(1.15, manifest_score_dict.get(slug, 0.0))
            norm_rrf = rrf_val / max_rrf
            tier_bonus = 0.05 if cat["source_tier"] in ("workspace", "global") else 0.0
            dist_slug_boost = 0.12 if distinctive_hits_map.get(slug, 0) > 0 else 0.0
            group_affinity = 0.03 if (cat["group_name"] == top_group and lex_sc > 0.20) else 0.0
            usage_bonus = min(0.03, usage_map.get(slug, 0) * 0.003)

            final_score = round(
                min(
                    1.0,
                    norm_rrf * 0.52
                    + lex_sc * 0.38
                    + tier_bonus
                    + dist_slug_boost
                    + group_affinity
                    + usage_bonus,
                ),
                4,
            )

            ranked_results.append({
                "slug": slug,
                "name": cat["name"],
                "group": cat["group_name"],
                "tier": cat["source_tier"],
                "score": final_score,
                "description": cat["description"],
                "skill_md_path": cat["skill_md_path"],
                "file_count": cat["file_count"],
                "usage_hits": usage_map.get(slug, 0),
            })

        ranked_results.sort(key=lambda x: (-x["score"], -x["usage_hits"], x["slug"]))
        top_results = ranked_results[:max(1, int(top_k))]

        for item in top_results:
            slug = item["slug"]
            cat = catalog_map[slug]
            item["skill_md_uri"] = file_to_uri(cat["skill_md_path"])
            matched_sections = []
            for ch in best_chunks_by_slug.get(slug, [])[:2]:
                fp_str = ch["file_path"]
                preview = re.sub(r"\s+", " ", ch["content"]).strip()[:210]
                matched_sections.append({
                    "rel_path": ch["rel_path"],
                    "file_path": fp_str,
                    "file_uri": file_to_uri(fp_str, ch["line_start"], ch["line_end"]),
                    "heading": ch["heading"],
                    "line_start": ch["line_start"],
                    "line_end": ch["line_end"],
                    "preview": preview,
                })
            if not matched_sections:
                smd_str = cat["skill_md_path"]
                matched_sections.append({
                    "rel_path": "SKILL.md",
                    "file_path": smd_str,
                    "file_uri": file_to_uri(smd_str, 1, 40),
                    "heading": cat["name"],
                    "line_start": 1,
                    "line_end": 40,
                    "preview": cat["description"],
                })
            item["matched_sections"] = matched_sections

        if record_hit and top_results and top_results[0]["score"] >= 0.45:
            self.record_usage(top_results[0]["slug"])

        elapsed_ms = round((time.perf_counter() - t0) * 1000.0, 2)
        return {
            "query": query,
            "normalized_terms": terms,
            "expanded_synonyms": syn_terms,
            "widened": widened,
            "total_candidates": len(ranked_results),
            "elapsed_ms": elapsed_ms,
            "results": top_results,
        }

    def read_section(
        self,
        skill_or_path: str,
        heading_or_query: str = "",
        start_line: int = 0,
        end_line: int = 0,
        max_chars: int = 6000,
    ) -> dict[str, Any]:
        """Lazy Excerpt Loader: chỉ nạp đúng mục Heading hoặc đúng dòng L_start..L_end cần dùng."""
        self.ensure_ready()
        db = self.conn()
        target_str = (skill_or_path or "").strip()

        cand_path = Path(target_str)
        resolved_slug = ""
        if not cand_path.is_file():
            parts = target_str.replace("\\", "/").split("/", 1)
            slug_key = parts[0].strip().lower()
            row = db.execute("SELECT * FROM skill_catalog WHERE slug = ?", (slug_key,)).fetchone()
            if not row:
                row = db.execute(
                    "SELECT * FROM skill_catalog WHERE slug LIKE ? OR LOWER(name) LIKE ? LIMIT 1",
                    (f"%{slug_key}%", f"%{slug_key}%"),
                ).fetchone()
            if not row:
                return {"status": "error", "error": f"Không tìm thấy skill hoặc file: '{skill_or_path}'"}
            resolved_slug = row["slug"]
            if len(parts) == 2 and parts[1].strip():
                cand_path = Path(row["skill_dir"]) / parts[1].strip()
            else:
                cand_path = Path(row["skill_md_path"])

        if not cand_path.is_file():
            return {"status": "error", "error": f"File không tồn tại trên đĩa: {cand_path}"}

        if resolved_slug:
            self.record_usage(resolved_slug)

        if heading_or_query.strip() and start_line <= 0:
            hq_norm = norm_vi(heading_or_query)
            hq_terms = set(query_terms(heading_or_query) or hq_norm.split())
            if resolved_slug:
                chunk_rows = db.execute(
                    "SELECT * FROM skill_chunks WHERE skill_slug = ?",
                    (resolved_slug,),
                ).fetchall()
            else:
                chunk_rows = db.execute(
                    "SELECT * FROM skill_chunks WHERE file_path = ?",
                    (str(cand_path),),
                ).fetchall()

            best_row = None
            best_sc = -1.0
            for cr in chunk_rows:
                h_norm = norm_vi(cr["heading"])
                c_norm = norm_vi(cr["content"])
                sc = 0.0
                if hq_norm and hq_norm in h_norm:
                    sc += 2.0
                if hq_norm and hq_norm in c_norm:
                    sc += 0.8
                if hq_terms:
                    sc += len(hq_terms & set(h_norm.split())) * 0.7
                    sc += len(hq_terms & set(c_norm.split())) * 0.25
                if cr["rel_path"] != "SKILL.md" and len(hq_terms & set(norm_vi(cr["rel_path"]).split())) > 0:
                    sc += 0.6
                if sc > best_sc:
                    best_sc = sc
                    best_row = cr

            if best_row and best_sc > 0.2:
                cand_path = Path(best_row["file_path"])
                start_line = int(best_row["line_start"])
                end_line = int(best_row["line_end"])

        raw_lines = cand_path.read_text(encoding="utf-8", errors="replace").splitlines()
        total_lines = len(raw_lines)
        s_ln = max(1, start_line if start_line > 0 else 1)
        e_ln = min(total_lines, end_line if end_line >= s_ln else min(total_lines, s_ln + 130))

        numbered_lines: list[str] = []
        acc_chars = 0
        actual_end = s_ln
        for ln_no in range(s_ln, e_ln + 1):
            formatted = f"{ln_no:4d}: {raw_lines[ln_no - 1]}"
            if acc_chars + len(formatted) > max_chars and numbered_lines:
                break
            numbered_lines.append(formatted)
            acc_chars += len(formatted) + 1
            actual_end = ln_no

        return {
            "status": "ok",
            "skill_slug": resolved_slug,
            "file_path": str(cand_path),
            "file_uri": file_to_uri(cand_path, s_ln, actual_end),
            "line_start": s_ln,
            "line_end": actual_end,
            "total_lines_in_file": total_lines,
            "truncated_by_max_chars": actual_end < e_ln,
            "excerpt": "\n".join(numbered_lines),
        }

    def manage_skill(
        self,
        slug: str,
        action: str = "inspect",
        new_description: str = "",
        new_group: str = "",
        section_heading: str = "",
        section_content: str = "",
    ) -> dict[str, Any]:
        """
        Công cụ Kiểm định & Chỉnh sửa Skill an toàn:
          - action='inspect'            : Kiểm tra sức khỏe skill, YAML, độ dài description, link đứt, danh sách mục Heading.
          - action='update_frontmatter' : Cập nhật description (kiểm định <= 150 ký tự chuẩn Javis) & group + backup tự động.
          - action='upsert_section'     : Thêm mới hoặc cập nhật 1 mục `## <section_heading>` trong SKILL.md + backup + re-index.
        """
        self.ensure_ready()
        db = self.conn()
        slug_clean = slug.strip().lower()
        cat = db.execute("SELECT * FROM skill_catalog WHERE slug = ?", (slug_clean,)).fetchone()
        if not cat:
            return {"status": "error", "error": f"Không tìm thấy skill có slug='{slug_clean}'"}

        sm_path = Path(cat["skill_md_path"])
        raw_text = sm_path.read_text(encoding="utf-8", errors="replace")
        fm, body, fm_ok = parse_skill_markdown(raw_text)

        if action == "inspect":
            headings = [
                {"heading": r["heading"], "rel_path": r["rel_path"], "lines": f"L{r['line_start']}-L{r['line_end']}"}
                for r in db.execute(
                    "SELECT heading, rel_path, line_start, line_end FROM skill_chunks WHERE skill_slug = ? ORDER BY rel_path='SKILL.md' DESC, rel_path ASC, line_start ASC LIMIT 60",
                    (slug_clean,),
                )
            ]
            desc = str(fm.get("description") or "")
            return {
                "status": "ok",
                "slug": slug_clean,
                "tier": cat["source_tier"],
                "skill_md_path": str(sm_path),
                "skill_md_uri": file_to_uri(sm_path),
                "frontmatter_valid_yaml": fm_ok,
                "description": desc,
                "description_length": len(desc),
                "javis_150_char_check": validate_skill_description(desc) or "PASS (Chuẩn <= 150 ký tự)",
                "group": fm.get("group", cat["group_name"]),
                "indexed_files_count": cat["file_count"],
                "broken_links": json.loads(cat["broken_links_json"] or "[]"),
                "duplicate_paths": json.loads(cat["duplicate_paths_json"] or "[]"),
                "headings_outline": headings,
            }

        EDIT_BACKUP_DIR.mkdir(parents=True, exist_ok=True)
        bkp_file = EDIT_BACKUP_DIR / f"{slug_clean}_SKILL_{int(time.time())}.md.bak"
        shutil.copy2(sm_path, bkp_file)

        if action == "update_frontmatter":
            desc_to_set = new_description.strip() if new_description.strip() else str(fm.get("description") or "").strip()
            err = validate_skill_description(desc_to_set)
            if err:
                return {"status": "rejected_by_javis_rule", "error": err, "backup_saved": str(bkp_file)}

            grp_to_set = new_group.strip() if new_group.strip() else str(fm.get("group") or cat["group_name"]).strip()
            fm_lines = [
                "---",
                f"name: {fm.get('name', slug_clean)}",
                f"description: {json.dumps(desc_to_set, ensure_ascii=False)}",
                f"group: {json.dumps(grp_to_set, ensure_ascii=False)}",
            ]
            for k, v in fm.items():
                if k not in ("name", "description", "group") and isinstance(v, (str, int, float, bool)):
                    fm_lines.append(f"{k}: {json.dumps(v, ensure_ascii=False)}")
            fm_lines.append("---")

            updated_md = "\n".join(fm_lines) + "\n\n" + body.lstrip("\r\n").rstrip() + "\n"
            sm_path.write_text(updated_md, encoding="utf-8")
            sync_info = self.sync_index()
            return {
                "status": "updated",
                "slug": slug_clean,
                "description_length": len(desc_to_set),
                "group": grp_to_set,
                "backup_path": str(bkp_file),
                "reindex_ms": sync_info["elapsed_ms"],
            }

        if action == "upsert_section":
            title = section_heading.strip().lstrip("#").strip()
            if not title or not section_content.strip():
                return {"status": "error", "error": "Cần truyền đủ section_heading và section_content khi dùng upsert_section."}

            new_block = f"## {title}\n\n{section_content.strip()}\n"
            pattern = re.compile(rf"^##\s+{re.escape(title)}\s*$.*?(?=^##\s+|\Z)", re.M | re.S)
            if pattern.search(body):
                new_body = pattern.sub(lambda _: new_block + "\n", body)
                mode = "replaced_existing_section"
            else:
                new_body = body.rstrip() + "\n\n---\n\n" + new_block
                mode = "appended_new_section"

            clean_raw = raw_text.lstrip("\ufeff")
            m = re.match(r"^(---\r?\n.*?\r?\n---)", clean_raw, re.S)
            fm_block = m.group(1) if m else f"---\nname: {slug_clean}\ndescription: {json.dumps(cat['description'], ensure_ascii=False)}\n---"
            sm_path.write_text(fm_block + "\n\n" + new_body.lstrip("\r\n").rstrip() + "\n", encoding="utf-8")
            sync_info = self.sync_index()
            return {
                "status": "updated",
                "mode": mode,
                "slug": slug_clean,
                "section_heading": f"## {title}",
                "backup_path": str(bkp_file),
                "reindex_ms": sync_info["elapsed_ms"],
            }

        return {"status": "error", "error": f"Action không hợp lệ: '{action}'. Chọn: inspect | update_frontmatter | upsert_section."}

    def audit_report(self, force_rebuild: bool = False) -> dict[str, Any]:
        sync_stats = self.sync_index(force_rebuild=force_rebuild)
        db = self.conn()
        by_tier = {
            r[0]: r[1]
            for r in db.execute("SELECT source_tier, COUNT(*) FROM skill_catalog GROUP BY source_tier")
        }
        warnings = []
        tier_overrides = []
        for r in db.execute("SELECT slug, source_tier, frontmatter_ok, desc_warning, broken_links_json, duplicate_paths_json FROM skill_catalog"):
            bl = json.loads(r["broken_links_json"] or "[]")
            dp = json.loads(r["duplicate_paths_json"] or "[]")
            if dp:
                tier_overrides.append({
                    "active_slug": r["slug"],
                    "active_tier": r["source_tier"],
                    "overridden_lower_tier_paths": dp,
                })
            is_user_tier = r["source_tier"] in ("workspace", "global")
            if r["desc_warning"] or (is_user_tier and (bl or not r["frontmatter_ok"])):
                warnings.append({
                    "slug": r["slug"],
                    "tier": r["source_tier"],
                    "frontmatter_ok": bool(r["frontmatter_ok"]),
                    "desc_warning": r["desc_warning"],
                    "broken_links": bl,
                })

        top_used = [
            {"slug": r["slug"], "hit_count": r["hit_count"]}
            for r in db.execute("SELECT slug, hit_count FROM skill_usage ORDER BY hit_count DESC LIMIT 10")
        ]
        global_desc_budget = db.execute(
            "SELECT SUM(LENGTH(description)) FROM skill_catalog WHERE source_tier='global'"
        ).fetchone()[0] or 0

        return {
            "sync": sync_stats,
            "skills_by_tier": by_tier,
            "global_20_desc_char_budget": f"{global_desc_budget} / 4000 chars (Javis Router Budget)",
            "top_used_skills": top_used,
            "tier_overrides_info": tier_overrides,
            "health_warnings": warnings,
        }

    def format_hook_hint(self, user_query: str, max_items: int = 3) -> str:
        """
        Tạo khối gợi ý định vị siêu gọn (< 420 ký tự) cho PreInvocation Hook (`ephemeralMessage`).
        Chỉ kích hoạt khi có Skill khớp rõ ràng (`score >= 0.42`).
        """
        q = (user_query or "").strip()
        if len(q) < 4:
            return ""
        res = self.search_hybrid(q, top_k=max_items, record_hit=True, skip_sync=True)
        strong = [r for r in res.get("results", []) if r["score"] >= 0.42]
        if not strong:
            return ""

        lines = [
            f"🎯 [JAVIS HYBRID SKILL ROUTER — ĐỊNH VỊ TỨC THÌ ({res['elapsed_ms']}ms)]:"
        ]
        for idx, item in enumerate(strong[:max_items], start=1):
            sec = item["matched_sections"][0]
            lines.append(
                f"  {idx}. `{item['slug']}` (score={item['score']:.2f}) -> `{sec['rel_path']}` "
                f"(Dòng L{sec['line_start']}-L{sec['line_end']}, mục: \"{sec['heading'][:55]}\") | Path: `{sec['file_path']}`"
            )
        lines.append(
            "  💡 Mẹo tiết kiệm Token: Dùng `agy_read_skill_section` (MCP `agy-skill-hub`) hoặc `read_file` đúng dòng L_start..L_end ở trên thay vì đọc mù toàn bộ thư mục."
        )
        return "\n".join(lines)


# Singleton instance for fast in-process reuse
_ENGINE: Optional[AgySkillHybridEngine] = None


def get_engine() -> AgySkillHybridEngine:
    global _ENGINE
    if _ENGINE is None:
        _ENGINE = AgySkillHybridEngine()
    return _ENGINE


if __name__ == "__main__":
    import sys
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    eng = get_engine()
    if len(sys.argv) > 1 and sys.argv[1] == "search":
        q = " ".join(sys.argv[2:])
        print(json.dumps(eng.search_hybrid(q, top_k=5, record_hit=True), ensure_ascii=False, indent=2))
    else:
        print(json.dumps(eng.audit_report(force_rebuild=("--rebuild" in sys.argv)), ensure_ascii=False, indent=2))
