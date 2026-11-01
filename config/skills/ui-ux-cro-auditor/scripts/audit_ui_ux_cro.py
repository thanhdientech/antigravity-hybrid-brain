#!/usr/bin/env python3
"""
UI/UX Logic, Mobile Responsive, Corporate Quality & Landing Page CRO Auditor CLI.
Zero external PyPI dependencies (100% Python Standard Library):
  1. Stack-aware Static HTML / JSX / TSX / Vue / CSS Multi-Surface Scanner
  2. Live Headless Chrome/Edge CDP Multi-Viewport (375x812, 768x1024, 1440x900) DOM Auditor
"""
from __future__ import annotations

import argparse
import base64
import functools
import hashlib
import http.server
import json
import os
import re
import shutil
import socket
import struct
import subprocess
import sys
import tempfile
import threading
import time
import urllib.request
from dataclasses import asdict, dataclass
from html.parser import HTMLParser
from pathlib import Path
from typing import Dict, List, Optional, Tuple

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

SCAN_EXTS = {".html", ".htm", ".jsx", ".tsx", ".vue", ".svelte", ".astro", ".css"}
SKIP_DIRS = {".git", "node_modules", ".next", "dist", "build", ".venv", "venv", "__pycache__", "coverage"}

EMOJI_RE = re.compile(r"[\U0001F300-\U0001FAFF\u2600-\u27BF]")
VAGUE_LINK_RE = re.compile(
    r"^\s*(?:click here|here|read more|learn more|more|xem tại đây|tại đây|bấm vào đây|xem thêm)\s*$",
    re.IGNORECASE,
)
WEAK_CTA_RE = re.compile(r"^\s*(?:submit|send|gửi|gửi đi|ok)\s*$", re.IGNORECASE)
CAPI_LEAK_RE = re.compile(
    r"(?:graph\.facebook\.com/v\d+\.\d+/[^\"'\s]+/events[^\"'\n]*access_token)|(?:business-api\.tiktok\.com/open_api/[^\"'\n]*access[_-]?token)",
    re.IGNORECASE,
)


@dataclass
class Finding:
    severity: str       # P0 | P1 | P2
    surface: str        # webapp | mobile | corporate | landing | ai-slop
    rule_id: str
    location: str
    evidence: str
    recommendation: str


# ---------------------------------------------------------------------------
# 1. STACK-AWARE HTML / TEMPLATE PARSER (ZERO FALSE POSITIVES ON <form><button>)
# ---------------------------------------------------------------------------

class SurfaceHTMLAuditor(HTMLParser):
    VOID_TAGS = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}

    def __init__(self, rel_path: str, is_full_doc: bool, surface: str) -> None:
        super().__init__(convert_charrefs=True)
        self.rel_path = rel_path
        self.is_full_doc = is_full_doc
        self.surface = surface
        self.findings: List[Finding] = []

        self.has_html_tag = False
        self.has_html_lang = False
        self.has_viewport = False
        self.form_stack: List[Dict[str, object]] = []
        self.label_for_ids: set[str] = set()
        self.label_depth = 0
        self.pending_inputs: List[Tuple[int, Dict[str, str], bool]] = []
        self.heading_levels: List[Tuple[int, int]] = []
        self.img_count = 0

        self.active_text_tag: Optional[Tuple[str, int, Dict[str, str], List[str]]] = None

    def _want(self, cat: str) -> bool:
        return self.surface in ("all", "auto") or self.surface == cat or cat == "ai-slop"

    def handle_starttag(self, tag: str, attrs: List[Tuple[str, Optional[str]]]) -> None:
        t = tag.lower()
        line = self.getpos()[0]
        ad: Dict[str, str] = {k.lower(): (v if v is not None else "") for k, v in attrs}

        if t == "html":
            self.has_html_tag = True
            if ad.get("lang", "").strip():
                self.has_html_lang = True

        elif t == "meta" and ad.get("name", "").lower() == "viewport":
            self.has_viewport = True
            content = ad.get("content", "").lower().replace(" ", "")
            if self._want("mobile") and (
                "user-scalable=no" in content
                or "user-scalable=0" in content
                or re.search(r"maximum-scale=1(?:$|[.,;])", content)
            ):
                self.findings.append(Finding(
                    "P1", "mobile", "VIEWPORT_ZOOM_LOCK", f"{self.rel_path}:{line}",
                    f'<meta name="viewport" content="{ad.get("content", "")}"> khóa phóng to',
                    "Bỏ `user-scalable=no` và `maximum-scale=1` để đạt chuẩn trợ năng WCAG 2.2 AA trên điện thoại.",
                ))

        elif t == "form":
            self.form_stack.append({"line": line, "fields": 0})

        elif t == "label":
            self.label_depth += 1
            if ad.get("for"):
                self.label_for_ids.add(ad["for"])

        elif t == "button":
            btype = ad.get("type", "").strip().lower()
            if self.form_stack and not btype and self._want("webapp"):
                self.findings.append(Finding(
                    "P0", "webapp", "FORM_BTN_NO_TYPE", f"{self.rel_path}:{line}",
                    "Thẻ `<button>` nằm trong `<form>` nhưng thiếu `type=\"button\"` hoặc `type=\"submit\"`",
                    "Gắn tường minh `type=\"button\"` cho nút phụ hoặc `type=\"submit\"` cho nút gửi chính để tránh tự Submit ngoài ý muốn.",
                ))
            self.active_text_tag = (t, line, ad, [])

        elif t in ("div", "span"):
            has_click = any(k in ad for k in ("onclick", "@click", "v-on:click"))
            if has_click and self._want("webapp"):
                if ad.get("role") != "button" or "tabindex" not in ad:
                    self.findings.append(Finding(
                        "P1", "webapp", "DIV_SPAN_ONCLICK", f"{self.rel_path}:{line}",
                        f"Dùng `<{t}>` làm phần tử click nhưng thiếu ngữ nghĩa bàn phím (`role`/`tabindex`)",
                        "Chuyển sang `<button type=\"button\">` để hỗ trợ phím `Tab`/`Enter`/`Space` và trình đọc màn hình.",
                    ))

        elif t in ("input", "select", "textarea"):
            itype = ad.get("type", "text").lower() if t == "input" else t
            if itype not in ("hidden", "submit", "button", "reset"):
                if self.form_stack:
                    self.form_stack[-1]["fields"] = int(self.form_stack[-1]["fields"]) + 1
                self.pending_inputs.append((line, ad, self.label_depth > 0))
            if t == "input" and itype == "number" and self._want("webapp"):
                if "onwheel" not in ad:
                    self.findings.append(Finding(
                        "P2", "webapp", "NUMBER_WHEEL_DRIFT", f"{self.rel_path}:{line}",
                        "`<input type=\"number\">` dễ bị nhảy sai số khi người dùng cuộn chuột dọc trang",
                        "Cân nhắc `inputmode=\"numeric\"` hoặc chặn sự kiện `wheel` (`e.currentTarget.blur()`).",
                    ))
            if "autofocus" in ad and self._want("mobile"):
                self.findings.append(Finding(
                    "P2", "mobile", "MOBILE_AUTOFOCUS_TRAP", f"{self.rel_path}:{line}",
                    f"`<{t} autofocus>` tự bật bàn phím ảo che mất 50% màn hình ngữ cảnh trên điện thoại",
                    "Chỉ bật `autofocus` trên Desktop (`window.matchMedia('(min-width: 1024px)')`).",
                ))

        elif t == "img":
            self.img_count += 1
            if "alt" not in ad and (self._want("corporate") or self._want("webapp")):
                self.findings.append(Finding(
                    "P1", "corporate", "IMG_MISSING_ALT", f"{self.rel_path}:{line}",
                    f"`<img src=\"{ad.get('src', '')[:45]}\">` thiếu thuộc tính `alt`",
                    "Thêm `alt` mô tả nội dung ảnh (hoặc `alt=\"\"` nếu là ảnh trang trí thuần túy).",
                ))
            if self.img_count == 1 and ad.get("loading", "").lower() == "lazy" and (self._want("corporate") or self._want("landing")):
                self.findings.append(Finding(
                    "P1", "corporate", "HERO_IMG_LAZY_LCP", f"{self.rel_path}:{line}",
                    "Ảnh đầu trang gắn `loading=\"lazy\"` làm chậm chỉ số `LCP` (Core Web Vitals)",
                    "Bỏ `loading=\"lazy\"` ở ảnh Hero đầu trang và thay bằng `fetchpriority=\"high\"`.",
                ))
            has_dim = ("width" in ad and "height" in ad) or "aspect-" in ad.get("class", "") or "aspect-ratio" in ad.get("style", "")
            if not has_dim and (self._want("corporate") or self._want("landing")):
                self.findings.append(Finding(
                    "P2", "corporate", "IMG_MISSING_DIMENSIONS_CLS", f"{self.rel_path}:{line}",
                    f"`<img src=\"{ad.get('src', '')[:40]}\">` thiếu `width`/`height` hoặc `aspect-ratio` gây nhảy khung `CLS`",
                    "Khai báo sẵn `width` và `height` (hoặc CSS `aspect-ratio`) cho thẻ `<img>`.",
                ))

        elif t in ("h1", "h2", "h3", "h4", "h5", "h6"):
            lvl = int(t[1])
            self.heading_levels.append((lvl, line))
            self.active_text_tag = (t, line, ad, [])

        elif t == "a":
            self.active_text_tag = (t, line, ad, [])

    def handle_data(self, data: str) -> None:
        if self.active_text_tag is not None:
            self.active_text_tag[3].append(data)

    def handle_endtag(self, tag: str) -> None:
        t = tag.lower()
        if t == "label" and self.label_depth > 0:
            self.label_depth -= 1
        elif t == "form" and self.form_stack:
            f_info = self.form_stack.pop()
            fields = int(f_info["fields"])
            if fields >= 7 and self._want("landing"):
                self.findings.append(Finding(
                    "P1", "landing", "FORM_FRICTION_HIGH", f"{self.rel_path}:{f_info['line']}",
                    f"Biểu mẫu `<form>` có tới `{fields}` ô nhập liệu trên cùng 1 bước (tỷ lệ bỏ cuộc tăng 25–50%+)",
                    "Rút gọn xuống `3–4` ô thiết yếu nhất hoặc tách thành Multi-step Wizard có thanh tiến trình.",
                ))

        if self.active_text_tag and self.active_text_tag[0] == t:
            _, line, ad, chunks = self.active_text_tag
            text = "".join(chunks).strip()
            self.active_text_tag = None

            if t in ("h1", "h2", "h3", "button") and EMOJI_RE.search(text):
                self.findings.append(Finding(
                    "P2", "ai-slop", "AI_SLOP_EMOJI_ICON", f"{self.rel_path}:{line}",
                    f"Dùng Emoji trong `<{t}>` (`{text[:40]}`) — dấu hiệu AI Slop / thiếu đồng bộ nhận diện",
                    "Thay Emoji bằng bộ Icon SVG đồng nhất 1 nét vẽ (`Lucide` / `Heroicons` / `Phosphor`).",
                ))
            if t == "a" and text and VAGUE_LINK_RE.match(text) and self._want("corporate"):
                self.findings.append(Finding(
                    "P2", "corporate", "VAGUE_LINK_TEXT", f"{self.rel_path}:{line}",
                    f"Liên kết `<a>{text}</a>` không mô tả rõ đích đến (kém cho SEO & Screen Reader)",
                    "Viết rõ hành động/đích đến của liên kết (ví dụ: `Xem bảng giá gói Doanh nghiệp`).",
                ))
            if t == "button" and ad.get("type", "").lower() == "submit" and WEAK_CTA_RE.match(text) and self._want("landing"):
                self.findings.append(Finding(
                    "P1", "landing", "WEAK_SUBMIT_CTA_COPY", f"{self.rel_path}:{line}",
                    f"Nút chốt chuyển đổi dùng nhãn chung chung `{text}` không nêu giá trị khách nhận được",
                    "Đổi sang công thức `[Hành động] + [Giá trị nhận ngay]` (ví dụ: `Nhận Báo Giá Trong 5 Phút`).",
                ))

    def finalize(self) -> List[Finding]:
        if self.is_full_doc and self.has_html_tag:
            if not self.has_viewport and self._want("mobile"):
                self.findings.append(Finding(
                    "P0", "mobile", "VIEWPORT_MISSING", f"{self.rel_path}:1",
                    "Trang HTML hoàn chỉnh nhưng thiếu thẻ `<meta name=\"viewport\">` — vỡ giao diện Mobile 100%",
                    "Thêm `<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">` vào `<head>`.",
                ))
            if not self.has_html_lang and self._want("corporate"):
                self.findings.append(Finding(
                    "P1", "corporate", "HTML_MISSING_LANG", f"{self.rel_path}:1",
                    "Thẻ `<html>` thiếu thuộc tính khai báo ngôn ngữ `lang` (vi phạm WCAG 3.1.1)",
                    "Khai báo `<html lang=\"vi\">` (hoặc ngôn ngữ chính của trang).",
                ))
            h1_count = sum(1 for lvl, _ in self.heading_levels if lvl == 1)
            if h1_count == 0 and (self._want("corporate") or self._want("landing")):
                self.findings.append(Finding(
                    "P1", "corporate", "MISSING_H1_HEADING", f"{self.rel_path}:1",
                    "Trang không có thẻ tiêu đề chính `<h1>` cho phân cấp thị giác & SEO",
                    "Đặt đúng 1 thẻ `<h1>` truyền tải đề xuất giá trị / chủ đề chính của trang.",
                ))

        for prev, curr in zip(self.heading_levels, self.heading_levels[1:]):
            if curr[0] > prev[0] + 1 and self._want("corporate"):
                self.findings.append(Finding(
                    "P2", "corporate", "HEADING_LEVEL_SKIPPED", f"{self.rel_path}:{curr[1]}",
                    f"Nhảy cóc cấp tiêu đề từ `<h{prev[0]}>` xuống thẳng `<h{curr[0]}>`",
                    "Giữ thứ tự phân cấp `h1 -> h2 -> h3` liên tục; dùng class CSS để chỉnh kích thước chữ.",
                ))
                break

        for line, ad, wrapped_in_label in self.pending_inputs:
            has_label = (
                wrapped_in_label
                or (ad.get("id") and ad["id"] in self.label_for_ids)
                or bool(ad.get("aria-label") or ad.get("aria-labelledby"))
            )
            if not has_label and (self._want("webapp") or self._want("landing")):
                self.findings.append(Finding(
                    "P1", "landing" if self.surface == "landing" else "webapp",
                    "INPUT_MISSING_LABEL", f"{self.rel_path}:{line}",
                    f"Ô nhập liệu (`placeholder=\"{ad.get('placeholder', '')[:30]}\"`) không có `<label>` cố định hoặc `aria-label`",
                    "Gắn `<label for=\"...\">` hiển thị rõ phía trên ô nhập (không dùng mỗi `placeholder` vì gõ chữ sẽ mất nhãn).",
                ))
        return self.findings


def scan_static_file(file_path: Path, base_dir: Path, surface: str) -> List[Finding]:
    findings: List[Finding] = []
    try:
        content = file_path.read_text(encoding="utf-8", errors="ignore")
    except Exception:
        return findings

    rel = str(file_path.relative_to(base_dir)) if file_path != base_dir else file_path.name
    ext = file_path.suffix.lower()

    # 1. Universal security/CRO & responsive CSS/JSX checks
    for idx, line in enumerate(content.splitlines(), start=1):
        if CAPI_LEAK_RE.search(line):
            findings.append(Finding(
                "P0", "landing", "FRONTEND_CAPI_TOKEN_LEAK", f"{rel}:{idx}",
                "Phát hiện gọi trực tiếp Meta CAPI / TikTok Events API kèm `access_token` ngay ở mã Frontend",
                "Chuyển toàn bộ lệnh gửi CAPI kèm Access Token về Backend/Webhook trung gian để chống lộ Token.",
            ))
        if (surface in ("all", "auto", "mobile")) and (
            re.search(r"\b100vh\b", line) or re.search(r"\bh-screen\b", line)
        ):
            if "100dvh" not in content and "h-dvh" not in content:
                findings.append(Finding(
                    "P1", "mobile", "MOBILE_100VH_TRAP", f"{rel}:{idx}",
                    "Dùng `100vh` / `h-screen` không có `100dvh` làm thanh địa chỉ Mobile che khuất đáy màn hình",
                    "Đổi sang `100dvh` (`min-h-dvh` / `h-dvh`) kết hợp `env(safe-area-inset-bottom)`.",
                ))
                break

    if (surface in ("all", "auto", "webapp")) and ("outline-none" in content or "outline: none" in content or "outline:none" in content):
        if "focus-visible" not in content and "focus:ring" not in content:
            findings.append(Finding(
                "P1", "webapp", "OUTLINE_NONE_NO_RING", f"{rel}:1",
                "Xóa viền `outline: none` nhưng không khai báo `:focus-visible` thay thế",
                "Bổ sung vòng sáng `:focus-visible` để người dùng bàn phím biết đang đứng ở nút/ô nào.",
            ))

    if (surface in ("all", "auto", "webapp")) and "<table" in content.lower() and "tabular-nums" not in content:
        findings.append(Finding(
            "P2", "webapp", "TABLE_MISSING_TABULAR_NUMS", f"{rel}:1",
            "Bảng `<table>` chưa bật `font-variant-numeric: tabular-nums` cho cột số liệu/tiền tệ",
            "Thêm `tabular-nums` và căn phải (`text-right`) cho các cột con số để dễ đối chiếu hàng dọc.",
        ))

    # AI Slop CSS heuristic: purple-indigo gradient + border-left rounded card
    if re.search(r"from-(?:purple|indigo|violet)-\d+\s+.*to-(?:purple|indigo|violet|pink|blue)-\d+", content):
        findings.append(Finding(
            "P2", "ai-slop", "AI_SLOP_PURPLE_GRADIENT", f"{rel}:1",
            "Dải màu Gradient Tím/Chàm (`purple/indigo/violet`) mặc định đặc trưng của giao diện AI sinh tự động",
            "Đổi sang bảng màu đặc trưng thương hiệu ngành (xem `ui-ux-design-pro-max`) với 1 màu nhấn Solid sắc nét.",
        ))

    # 2. Run stack-aware HTML parser on HTML/Vue/Astro files (and JSX/TSX markup)
    if ext in {".html", ".htm", ".vue", ".svelte", ".astro"}:
        is_full_doc = "<!doctype html" in content.lower() or "<html" in content.lower()
        parser = SurfaceHTMLAuditor(rel, is_full_doc=is_full_doc, surface=surface)
        try:
            # Strip <script> and <style> bodies before HTML structure parse so JS `<` doesn't confuse tag parser
            clean_html = re.sub(r"<script\b[^>]*>.*?</script>", lambda m: "\n" * m.group(0).count("\n"), content, flags=re.I | re.S)
            clean_html = re.sub(r"<style\b[^>]*>.*?</style>", lambda m: "\n" * m.group(0).count("\n"), clean_html, flags=re.I | re.S)
            parser.feed(clean_html)
            findings.extend(parser.finalize())
        except Exception:
            pass
    elif ext in {".jsx", ".tsx"}:
        # Targeted JSX checks with line accuracy
        for idx, line in enumerate(content.splitlines(), start=1):
            if re.search(r"<(?:div|span)\b[^>]*\bonClick=", line) and "role=" not in line:
                if surface in ("all", "auto", "webapp"):
                    findings.append(Finding(
                        "P1", "webapp", "DIV_SPAN_ONCLICK", f"{rel}:{idx}",
                        "JSX `<div/span onClick={...}>` không hỗ trợ bàn phím và Accessibility Tree",
                        "Chuyển sang `<button type=\"button\" onClick={...}>`.",
                    ))
        if "<form" in content and "<button" in content and surface in ("all", "auto", "webapp"):
            for m_form in re.finditer(r"<form\b[^>]*>(.*?)</form>", content, flags=re.S):
                block = m_form.group(1)
                base_line = content[:m_form.start()].count("\n") + 1
                for m_btn in re.finditer(r"<button\b([^>]*)>", block):
                    if "type=" not in m_btn.group(1):
                        b_line = base_line + block[:m_btn.start()].count("\n")
                        findings.append(Finding(
                            "P0", "webapp", "FORM_BTN_NO_TYPE", f"{rel}:{b_line}",
                            "JSX `<button>` bên trong `<form>` thiếu `type=\"button\"` hoặc `type=\"submit\"`",
                            "Khai báo rõ `type=\"button\"` hoặc `type=\"submit\"`.",
                        ))

    return findings


# ---------------------------------------------------------------------------
# 2. ZERO-DEPENDENCY STDLIB RFC-6455 WEBSOCKET + HEADLESS CHROME/EDGE CDP
# ---------------------------------------------------------------------------

class MiniCDPClient:
    """Minimal RFC-6455 WebSocket client using 100% Python stdlib for local Headless CDP."""

    def __init__(self, ws_url: str, timeout: float = 12.0) -> None:
        # ws://127.0.0.1:PORT/devtools/page/ID
        without_scheme = ws_url[len("ws://"):]
        host_port, path = without_scheme.split("/", 1)
        host, port_s = host_port.split(":")
        path = "/" + path
        self.sock = socket.create_connection((host, int(port_s)), timeout=timeout)
        key = base64.b64encode(os.urandom(16)).decode("ascii")
        req = (
            f"GET {path} HTTP/1.1\r\n"
            f"Host: {host_port}\r\n"
            f"Upgrade: websocket\r\n"
            f"Connection: Upgrade\r\n"
            f"Sec-WebSocket-Key: {key}\r\n"
            f"Sec-WebSocket-Version: 13\r\n\r\n"
        )
        self.sock.sendall(req.encode("ascii"))
        buf = b""
        while b"\r\n\r\n" not in buf:
            chunk = self.sock.recv(4096)
            if not chunk:
                raise RuntimeError("CDP WebSocket handshake closed prematurely")
            buf += chunk
        header, self._leftover = buf.split(b"\r\n\r\n", 1)
        if b"101" not in header.splitlines()[0]:
            raise RuntimeError(f"CDP WebSocket handshake failed: {header.splitlines()[0]!r}")
        self._msg_id = 0

    def _recv_exact(self, n: int) -> bytes:
        out = bytearray()
        if self._leftover:
            take = min(n, len(self._leftover))
            out.extend(self._leftover[:take])
            self._leftover = self._leftover[take:]
        while len(out) < n:
            chunk = self.sock.recv(min(65536, n - len(out)))
            if not chunk:
                raise EOFError("CDP socket closed")
            out.extend(chunk)
        return bytes(out)

    def _recv_frame(self) -> str:
        while True:
            b1, b2 = self._recv_exact(2)
            opcode = b1 & 0x0F
            masked = bool(b2 & 0x80)
            length = b2 & 0x7F
            if length == 126:
                length = struct.unpack("!H", self._recv_exact(2))[0]
            elif length == 127:
                length = struct.unpack("!Q", self._recv_exact(8))[0]
            mask_key = self._recv_exact(4) if masked else b""
            payload = bytearray(self._recv_exact(length))
            if masked:
                for i in range(length):
                    payload[i] ^= mask_key[i % 4]
            if opcode == 0x8:
                raise EOFError("CDP WebSocket closed by browser")
            if opcode == 0x9:  # Ping -> Pong
                self._send_raw(0xA, bytes(payload))
                continue
            if opcode == 0x1:
                return payload.decode("utf-8", errors="replace")

    def _send_raw(self, opcode: int, data: bytes) -> None:
        header = bytearray([0x80 | opcode])
        n = len(data)
        if n < 126:
            header.append(0x80 | n)
        elif n < 65536:
            header.append(0x80 | 126)
            header.extend(struct.pack("!H", n))
        else:
            header.append(0x80 | 127)
            header.extend(struct.pack("!Q", n))
        mask = os.urandom(4)
        header.extend(mask)
        masked = bytearray(data)
        for i in range(n):
            masked[i] ^= mask[i % 4]
        self.sock.sendall(bytes(header) + bytes(masked))

    def call(self, method: str, params: Optional[dict] = None) -> Tuple[dict, List[dict]]:
        self._msg_id += 1
        cid = self._msg_id
        payload = json.dumps({"id": cid, "method": method, "params": params or {}}).encode("utf-8")
        self._send_raw(0x1, payload)
        events: List[dict] = []
        while True:
            msg = json.loads(self._recv_frame())
            if msg.get("id") == cid:
                if "error" in msg:
                    raise RuntimeError(f"CDP {method} error: {msg['error']}")
                return msg.get("result", {}), events
            events.append(msg)

    def close(self) -> None:
        try:
            self.sock.close()
        except Exception:
            pass


def find_browser_binary() -> Optional[str]:
    candidates = [
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        shutil.which("msedge"),
        shutil.which("google-chrome"),
        shutil.which("chromium"),
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    ]
    for c in candidates:
        if c and Path(c).exists():
            return str(c)
    return None


DOM_PROBE_JS = r"""
(() => {
  const vw = window.innerWidth, vh = window.innerHeight;
  const scrollW = document.documentElement.scrollWidth;
  const vis = (el) => {
    const st = getComputedStyle(el);
    if (st.display === 'none' || st.visibility === 'hidden' || parseFloat(st.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const offenders = [];
  if (scrollW > vw + 1) {
    for (const el of [...document.querySelectorAll('body *')].slice(0, 600)) {
      const r = el.getBoundingClientRect();
      if (r.right > vw + 2 && vis(el)) {
        offenders.push(`${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/)[0] : ''}(right=${Math.round(r.right)}px)`);
        if (offenders.length >= 4) break;
      }
    }
  }
  const smallInputs = [];
  for (const el of document.querySelectorAll('input,select,textarea')) {
    if (!vis(el) || el.type === 'hidden') continue;
    const fs = parseFloat(getComputedStyle(el).fontSize || '16');
    if (fs < 16) {
      smallInputs.push(`${el.tagName.toLowerCase()}${el.name ? '[name=' + el.name + ']' : ''} (${fs}px)`);
    }
  }
  const smallTargets = [];
  for (const el of document.querySelectorAll('button,a[href],input:not([type=hidden]),select,[role=button]')) {
    if (!vis(el)) continue;
    if (el.tagName === 'A' && getComputedStyle(el).display === 'inline') continue;
    const r = el.getBoundingClientRect();
    if (r.width < 44 || r.height < 44) {
      const txt = (el.innerText || el.getAttribute('aria-label') || el.value || el.tagName).trim().slice(0, 24);
      smallTargets.push({ label: txt, w: Math.round(r.width), h: Math.round(r.height) });
    }
  }
  let stickyH = 0;
  for (const el of [...document.querySelectorAll('body *')].slice(0, 400)) {
    const pos = getComputedStyle(el).position;
    if ((pos === 'fixed' || pos === 'sticky') && vis(el)) {
      const r = el.getBoundingClientRect();
      if (r.width >= vw * 0.5 && r.height < vh * 0.8) stickyH += r.height;
    }
  }
  const aboveFoldCtas = [...document.querySelectorAll('button,a[href],input[type=submit],[role=button]')].filter(el => {
    if (!vis(el)) return false;
    const r = el.getBoundingClientRect();
    return r.top >= 0 && r.top < vh && r.width >= 80 && r.height >= 32;
  }).length;
  const fonts = [...new Set([...document.querySelectorAll('body *')].slice(0, 350).map(e => (getComputedStyle(e).fontFamily || '').split(',')[0].replace(/["']/g, '').trim()).filter(Boolean))];
  return JSON.stringify({
    vw, vh, scrollW, offenders,
    smallInputs: smallInputs.slice(0, 6),
    smallTargets: smallTargets.slice(0, 8),
    smallTargetsTotal: smallTargets.length,
    stickyRatio: +(stickyH / vh).toFixed(2),
    aboveFoldCtas,
    fonts
  });
})()
"""


def run_live_browser_audit(
    target_url: str,
    surface: str,
    screenshots_dir: Optional[Path] = None,
) -> Tuple[List[Finding], Dict[str, object]]:
    findings: List[Finding] = []
    meta: Dict[str, object] = {"ran": False, "browser": None, "viewports": {}}
    browser_bin = find_browser_binary()
    if not browser_bin:
        meta["reason"] = "Không tìm thấy Chrome/Edge trên máy để chạy CDP Headless"
        return findings, meta

    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(("127.0.0.1", 0))
        port = s.getsockname()[1]

    tmp_profile = tempfile.mkdtemp(prefix="agy_ui_audit_")
    proc = subprocess.Popen(
        [
            browser_bin,
            "--headless=new",
            "--disable-gpu",
            "--no-first-run",
            "--no-default-browser-check",
            f"--user-data-dir={tmp_profile}",
            f"--remote-debugging-port={port}",
            "about:blank",
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )

    cdp: Optional[MiniCDPClient] = None
    try:
        ws_url = None
        for _ in range(30):
            time.sleep(0.2)
            try:
                with urllib.request.urlopen(f"http://127.0.0.1:{port}/json/list", timeout=2) as resp:
                    pages = json.loads(resp.read().decode("utf-8"))
                    for p in pages:
                        if p.get("type") == "page" and p.get("webSocketDebuggerUrl"):
                            ws_url = p["webSocketDebuggerUrl"]
                            break
                if ws_url:
                    break
            except Exception:
                continue

        if not ws_url:
            meta["reason"] = "Không kết nối được cổng CDP Headless"
            return findings, meta

        cdp = MiniCDPClient(ws_url)
        cdp.call("Page.enable")
        cdp.call("Runtime.enable")
        cdp.call("Log.enable")

        # Inject console/runtime error collector before navigation
        cdp.call("Page.addScriptToEvaluateOnNewDocument", {
            "source": (
                "window.__agyAuditErrors=[];"
                "const _oe=console.error;console.error=(...a)=>{window.__agyAuditErrors.push(a.map(String).join(' '));_oe.apply(console,a);};"
                "window.addEventListener('error',e=>window.__agyAuditErrors.push('Uncaught: '+e.message));"
            )
        })

        cdp.call("Page.navigate", {"url": target_url})
        time.sleep(1.2)

        err_res, _ = cdp.call("Runtime.evaluate", {"expression": "JSON.stringify(window.__agyAuditErrors || [])", "returnByValue": True})
        runtime_errs = json.loads(err_res.get("result", {}).get("value", "[]"))
        if runtime_errs:
            findings.append(Finding(
                "P0", "webapp", "LIVE_CONSOLE_RUNTIME_ERROR", f"{target_url} (Console)",
                f"Phát hiện {len(runtime_errs)} lỗi Runtime/Console: `{runtime_errs[0][:110]}`",
                "Mở DevTools Console xử lý triệt để ngoại lệ JS để không làm liệt các nút tương tác.",
            ))

        viewports = [
            ("mobile", 375, 812, True, 2),
            ("tablet", 768, 1024, True, 2),
            ("desktop", 1440, 900, False, 1),
        ]
        if screenshots_dir:
            screenshots_dir.mkdir(parents=True, exist_ok=True)

        for vp_name, w, h, is_mob, dpr in viewports:
            cdp.call("Emulation.setDeviceMetricsOverride", {
                "width": w,
                "height": h,
                "deviceScaleFactor": dpr,
                "mobile": is_mob,
            })
            time.sleep(0.35)
            res, _ = cdp.call("Runtime.evaluate", {"expression": DOM_PROBE_JS, "returnByValue": True})
            probe = json.loads(res.get("result", {}).get("value", "{}"))
            meta["viewports"][vp_name] = probe

            if screenshots_dir:
                shot, _ = cdp.call("Page.captureScreenshot", {"format": "png"})
                if shot.get("data"):
                    shot_file = screenshots_dir / f"{vp_name}-{w}x{h}.png"
                    shot_file.write_bytes(base64.b64decode(shot["data"]))

            if probe.get("scrollW", w) > w + 1 and surface in ("all", "auto", "mobile", "landing", "corporate"):
                findings.append(Finding(
                    "P0" if vp_name == "mobile" else "P1",
                    "mobile",
                    "LIVE_HORIZONTAL_OVERFLOW",
                    f"{target_url} [{vp_name} {w}x{h}]",
                    f"Tràn khung ngang thực tế: `scrollWidth={probe['scrollW']}px > viewport={w}px` (thủ phạm: {', '.join(probe.get('offenders', [])) or 'body'})",
                    "Đặt `max-width: 100%`, thêm `min-w-0` cho phần tử Flex/Grid và bọc bảng rộng trong `overflow-x-auto`.",
                ))

            if vp_name == "mobile":
                if probe.get("smallInputs") and surface in ("all", "auto", "mobile", "webapp", "landing"):
                    findings.append(Finding(
                        "P1", "mobile", "LIVE_IOS_INPUT_AUTOZOOM", f"{target_url} [mobile 375x812]",
                        f"Ô nhập liệu có `font-size < 16px` trên Mobile: {', '.join(probe['smallInputs'][:3])}",
                        "Nâng `font-size` của `<input>/<select>/<textarea>` lên tối thiểu `16px` (`text-base`) để chặn lỗi iOS Safari tự zoom lệch trang.",
                    ))
                if probe.get("smallTargetsTotal", 0) > 0 and surface in ("all", "auto", "mobile", "webapp", "landing"):
                    sample = ", ".join(f"{t['label']}({t['w']}x{t['h']}px)" for t in probe.get("smallTargets", [])[:4])
                    findings.append(Finding(
                        "P1", "mobile", "LIVE_SMALL_TOUCH_TARGET", f"{target_url} [mobile 375x812]",
                        f"Có `{probe['smallTargetsTotal']}` nút/điểm chạm nhỏ hơn chuẩn `44x44px`: {sample}",
                        "Tăng `min-height: 44px; min-width: 44px` hoặc vùng đệm `padding` quanh nút/icon trên màn hình cảm ứng.",
                    ))
                if probe.get("stickyRatio", 0) > 0.22 and surface in ("all", "auto", "mobile", "landing", "corporate"):
                    findings.append(Finding(
                        "P1", "mobile", "LIVE_STICKY_OCCLUSION", f"{target_url} [mobile 375x812]",
                        f"Các thanh `fixed/sticky` chiếm tới `{int(probe['stickyRatio'] * 100)}%` chiều cao màn hình điện thoại (> ngưỡng 22%)",
                        "Thu gọn chiều cao Sticky Header/Banner trên Mobile hoặc tự ẩn khi cuộn xuống để trả lại không gian đọc.",
                    ))

            if vp_name in ("mobile", "desktop") and surface == "landing" and probe.get("aboveFoldCtas", 1) == 0:
                findings.append(Finding(
                    "P1", "landing", "LIVE_NO_ABOVE_FOLD_CTA", f"{target_url} [{vp_name} {w}x{h}]",
                    "Không tìm thấy nút kêu gọi hành động (CTA) nào hiển thị trong màn hình đầu tiên (`Above-the-fold`)",
                    "Đưa 1 nút CTA chính có độ tương phản cao lên ngay khu vực Hero đầu trang không cần cuộn.",
                ))

            if vp_name == "desktop" and len(probe.get("fonts", [])) > 3:
                findings.append(Finding(
                    "P2", "ai-slop", "LIVE_FONT_SPRAWL", f"{target_url} [desktop 1440x900]",
                    f"Trang đang nạp tới `{len(probe['fonts'])}` họ phông chữ khác nhau: {', '.join(probe['fonts'][:5])}",
                    "Giới hạn tối đa `2` họ phông chữ (1 Heading + 1 Body, cộng tối đa 1 Monospace cho mã/số liệu).",
                ))

        meta["ran"] = True
        meta["browser"] = Path(browser_bin).name
    finally:
        if cdp:
            cdp.close()
        try:
            proc.terminate()
            proc.wait(timeout=3)
        except Exception:
            try:
                proc.kill()
            except Exception:
                pass
        shutil.rmtree(tmp_profile, ignore_errors=True)

    return findings, meta


def compute_scores(findings: List[Finding]) -> Tuple[int, str, str]:
    p0 = sum(1 for f in findings if f.severity == "P0")
    p1 = sum(1 for f in findings if f.severity == "P1")
    p2 = sum(1 for f in findings if f.severity == "P2")
    slop = sum(1 for f in findings if f.surface == "ai-slop")

    score = max(0, 100 - (p0 * 22) - (p1 * 8) - (p2 * 3))
    if p0 >= 2:
        grade = "F"
    elif p0 == 1:
        grade = "D" if score >= 50 else "F"
    elif score >= 90 and p1 <= 1:
        grade = "A"
    elif score >= 80:
        grade = "B"
    elif score >= 70:
        grade = "C"
    elif score >= 50:
        grade = "D"
    else:
        grade = "F"

    slop_grade = "A" if slop == 0 else ("B" if slop == 1 else ("C" if slop == 2 else ("D" if slop == 3 else "F")))
    return score, grade, slop_grade


def audit_target(
    target: str,
    surface: str = "all",
    live: bool = False,
    screenshots_dir: Optional[Path] = None,
) -> Tuple[List[Finding], Dict[str, object]]:
    findings: List[Finding] = []
    live_meta: Dict[str, object] = {"ran": False}
    is_url = target.startswith(("http://", "https://"))

    if is_url:
        f_live, live_meta = run_live_browser_audit(target, surface=surface, screenshots_dir=screenshots_dir)
        findings.extend(f_live)
    else:
        p = Path(target).resolve()
        if not p.exists():
            raise FileNotFoundError(f"Không tìm thấy đường dẫn: {p}")

        files: List[Path] = []
        base_dir = p if p.is_dir() else p.parent
        if p.is_file():
            files = [p]
        else:
            for root, dirs, fnames in os.walk(p):
                dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
                for fn in sorted(fnames):
                    fp = Path(root) / fn
                    if fp.suffix.lower() in SCAN_EXTS:
                        files.append(fp)

        for fp in files:
            findings.extend(scan_static_file(fp, base_dir=base_dir, surface=surface))

        # Optional live render for local HTML entry
        html_entry = p if (p.is_file() and p.suffix.lower() in {".html", ".htm"}) else (p / "index.html" if (p / "index.html").exists() else None)
        if live and html_entry is not None:
            serve_root = html_entry.parent
            handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(serve_root))
            # Silence HTTP log noise
            handler_cls = type("QuietHandler", (http.server.SimpleHTTPRequestHandler,), {
                "__init__": lambda self, *a, **kw: http.server.SimpleHTTPRequestHandler.__init__(self, *a, directory=str(serve_root), **kw),
                "log_message": lambda self, *a: None,
            })
            httpd = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler_cls)
            srv_port = httpd.server_address[1]
            t = threading.Thread(target=httpd.serve_forever, daemon=True)
            t.start()
            try:
                local_url = f"http://127.0.0.1:{srv_port}/{html_entry.name}"
                f_live, live_meta = run_live_browser_audit(local_url, surface=surface, screenshots_dir=screenshots_dir)
                findings.extend(f_live)
            finally:
                httpd.shutdown()
                httpd.server_close()

    # Sort P0 -> P1 -> P2
    sev_order = {"P0": 0, "P1": 1, "P2": 2}
    findings.sort(key=lambda x: (sev_order.get(x.severity, 9), x.location))
    return findings, live_meta


def run_self_test() -> int:
    with tempfile.TemporaryDirectory() as tmp:
        tmp_p = Path(tmp)

        # 1. Broken multi-surface sample (must trigger P0 + P1 + AI Slop)
        bad_html = tmp_p / "bad_landing.html"
        bad_html.write_text(
            "<!DOCTYPE html><html><head>"
            "<meta name='viewport' content='width=device-width, maximum-scale=1, user-scalable=no'>"
            "</head><body class='h-screen bg-gradient-to-r from-purple-600 to-indigo-600'>"
            "<h3>🚀 Giải pháp siêu tốc</h3>"
            "<img src='hero.png' loading='lazy'>"
            "<form>"
            "<input type='text' placeholder='Nhập họ tên' autofocus>"
            "<button>Hủy</button>"
            "<button type='submit'>Submit</button>"
            "</form>"
            "<div onclick='go()'>Bấm</div>"
            "<a href='/x'>Click here</a>"
            "</body></html>",
            encoding="utf-8",
        )
        bad_findings, _ = audit_target(str(bad_html), surface="all", live=False)
        rule_ids = {f.rule_id for f in bad_findings}
        expected = {
            "FORM_BTN_NO_TYPE",
            "VIEWPORT_ZOOM_LOCK",
            "HTML_MISSING_LANG",
            "MISSING_H1_HEADING",
            "IMG_MISSING_ALT",
            "HERO_IMG_LAZY_LCP",
            "INPUT_MISSING_LABEL",
            "WEAK_SUBMIT_CTA_COPY",
            "DIV_SPAN_ONCLICK",
            "VAGUE_LINK_TEXT",
            "AI_SLOP_EMOJI_ICON",
            "AI_SLOP_PURPLE_GRADIENT",
            "MOBILE_100VH_TRAP",
        }
        missing = expected - rule_ids
        assert not missing, f"Self-test missed expected rules: {missing}"

        # 2. Clean Grade-A sample (must return 0 findings, Score 100, Grade A)
        good_html = tmp_p / "good_app.html"
        good_html.write_text(
            "<!DOCTYPE html><html lang='vi'><head>"
            "<meta charset='UTF-8'>"
            "<meta name='viewport' content='width=device-width, initial-scale=1'>"
            "<title>Quản Trị Đơn Hàng</title>"
            "</head><body class='min-h-dvh'>"
            "<main><h1>Danh sách đơn hàng</h1>"
            "<img src='logo.svg' alt='Logo thương hiệu' width='120' height='36' fetchpriority='high'>"
            "<form>"
            "<label for='q'>Mã đơn hàng</label>"
            "<input id='q' name='q' type='text' style='font-size:16px'>"
            "<button type='button'>Xóa bộ lọc</button>"
            "<button type='submit'>Tìm đơn hàng ngay</button>"
            "</form>"
            "<table class='tabular-nums'><tr><td>125,000</td></tr></table>"
            "<a href='/pricing'>Xem bảng giá chi tiết</a>"
            "</main></body></html>",
            encoding="utf-8",
        )
        good_findings, _ = audit_target(str(good_html), surface="all", live=False)
        assert len(good_findings) == 0, f"Expected 0 findings on clean file, got: {good_findings}"
        score, grade, slop_grade = compute_scores(good_findings)
        assert score == 100 and grade == "A" and slop_grade == "A"

    print("✅ SELF-TEST PASSED: 13/13 multi-surface defect rules caught & clean Grade-A sample verified (0 false positives).")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(description="UI/UX Logic, Mobile Responsive, Corporate & Landing Page CRO Auditor")
    ap.add_argument("target", nargs="?", help="Đường dẫn file/thư mục giao diện hoặc URL (http://...)")
    ap.add_argument("--surface", choices=["all", "auto", "webapp", "mobile", "corporate", "landing"], default="all")
    ap.add_argument("--live", action="store_true", help="Mở Headless Chrome/Edge qua CDP đo DOM thật ở 3 khung hình 375/768/1440")
    ap.add_argument("--screenshots", type=str, default=None, help="Thư mục lưu ảnh chụp 3 khung hình PNG (khi bật --live hoặc quét URL)")
    ap.add_argument("--json", action="store_true", help="Xuất kết quả định dạng JSON")
    ap.add_argument("--strict", action="store_true", help="Trả về Exit code 1 nếu còn lỗi P0")
    ap.add_argument("--self-test", action="store_true", help="Chạy bộ kiểm thử tự động nội bộ")
    args = ap.parse_args()

    if args.self_test:
        return run_self_test()
    if not args.target:
        ap.error("Vui lòng truyền đường dẫn file/thư mục hoặc URL (hoặc dùng --self-test).")

    shots_dir = Path(args.screenshots).resolve() if args.screenshots else None
    findings, live_meta = audit_target(args.target, surface=args.surface, live=args.live, screenshots_dir=shots_dir)
    score, grade, slop_grade = compute_scores(findings)

    p0 = sum(1 for f in findings if f.severity == "P0")
    p1 = sum(1 for f in findings if f.severity == "P1")
    p2 = sum(1 for f in findings if f.severity == "P2")

    if args.json:
        print(json.dumps({
            "target": args.target,
            "surface": args.surface,
            "score": score,
            "grade": grade,
            "ai_slop_grade": slop_grade,
            "counts": {"P0": p0, "P1": p1, "P2": p2, "total": len(findings)},
            "live_browser": live_meta,
            "findings": [asdict(f) for f in findings],
        }, ensure_ascii=False, indent=2))
    else:
        mode_note = f"Static + Live CDP ({live_meta.get('browser')}: 375/768/1440)" if live_meta.get("ran") else "Static Code Analysis"
        print(f"🔬 UI/UX & CRO AUDIT | Surface: {args.surface} | Mode: {mode_note}")
        print(f"📊 Điểm Tổng Thể: {score}/100 (Hạng {grade}) | Sạch AI Slop: Hạng {slop_grade} | Lỗi: P0={p0} · P1={p1} · P2={p2}")
        if not findings:
            print("✅ Không phát hiện lỗi giao diện nào! Đạt chuẩn Hạng A.")
        else:
            print("-" * 92)
            for f in findings[:25]:
                print(f"  [{f.severity}] ({f.surface}) {f.rule_id} @ {f.location}")
                print(f"       ↳ Bằng chứng: {f.evidence}")
                print(f"       ↳ Cách sửa : {f.recommendation}")
            if len(findings) > 25:
                print(f"  ... (Còn {len(findings) - 25} phát hiện nhỏ khác — dùng --json để xuất đầy đủ)")

    if args.strict and p0 > 0:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
