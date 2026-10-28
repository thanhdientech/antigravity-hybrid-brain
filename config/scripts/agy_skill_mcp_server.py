#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
agy_skill_mcp_server.py — Trạm MCP `agy-skill-hub` (Bộ Não Javis OS Cho Antigravity).

Cung cấp 4 MCP Tools siêu tốc (< 5-10ms) qua giao thức MCP Stdio:
  1. `agy_search_skills`        : Tìm kiếm lai SQLite FTS5 (tiếng Việt không dấu đ/Đ) + RRF Fusion + Đồng nghĩa Việt-Anh
                                  xuyên toàn bộ 75+ Skills (Global, Plugin, Builtin, Workspace) & hàng ngàn file con.
  2. `agy_read_skill_section`   : Nạp lười (Lazy Section Loader) đúng mục Heading hoặc khoảng dòng `start_line..end_line`.
  3. `agy_manage_skill`         : Kiểm định sức khỏe skill, sửa/chuẩn hóa YAML frontmatter (<= 150 ký tự chuẩn Javis)
                                  hoặc thêm/cập nhật mục kiến thức mới kèm backup tự động & re-index tức thì.
  4. `agy_sync_and_audit_skills`: Quét Delta SHA-256 (< 0.2s), kiểm toán link đứt, trùng skill & thống kê tần suất dùng.
"""
from __future__ import annotations

import json
import os
import sys
from pathlib import Path

# Đảm bảo import được agy_skill_engine cùng thư mục
SCRIPT_DIR = Path(__file__).resolve().parent
if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))

from agy_skill_engine import get_engine

try:
    from mcp.server.mcpserver import MCPServer
except ImportError:
    from mcp.server.fastmcp import FastMCP as MCPServer

mcp = MCPServer("agy-skill-hub")


def _log(msg: str):
    sys.stderr.write(f"[agy-skill-hub] {msg}\n")
    sys.stderr.flush()


@mcp.tool()
def agy_search_skills(
    query: str,
    top_k: int = 6,
    tier: str = "all",
) -> str:
    """
    Tìm kiếm lai siêu tốc (< 10ms) bằng bộ máy Javis Hybrid (SQLite FTS5 tiếng Việt không dấu đ/Đ + Reciprocal Rank Fusion RRF + Đồng nghĩa Việt-Anh)
    xuyên toàn bộ Skills và hàng ngàn file con (`references/`, `scripts/`, `examples/`, `.sql`, `.md`).
    Trả về đúng tên Skill, đường dẫn file con khớp nhất, tiêu đề Heading và tọa độ dòng `line_start..line_end`.

    Args:
        query: Câu hỏi hoặc từ khóa cần tìm (hỗ trợ cả tiếng Việt có dấu, không dấu, chữ đ/Đ và thuật ngữ tiếng Anh).
        top_k: Số lượng skill khớp nhất trả về (mặc định 6).
        tier: Phạm vi tìm kiếm: 'all' (tất cả), 'global' (~/.gemini/config/skills), 'plugin', 'builtin', hoặc 'workspace'.
    """
    res = get_engine().search_hybrid(query=query, top_k=top_k, tier=tier, record_hit=True)
    return json.dumps(res, ensure_ascii=False, indent=2)


@mcp.tool()
def agy_read_skill_section(
    skill_or_path: str,
    heading_or_query: str = "",
    start_line: int = 0,
    end_line: int = 0,
    max_chars: int = 6000,
) -> str:
    """
    Nạp lười (Lazy Excerpt Loader) đúng mục Heading hoặc đúng đoạn dòng `start_line..end_line` bên trong một Skill hoặc file con
    mà KHÔNG cần đọc tràn cả ngàn dòng vào Context Window (tiết kiệm 70-85% token).

    Args:
        skill_or_path: Slug của skill (vd: 'viet-sql-sap-b1', 'lam-phim-video-master'), hoặc 'slug/references/ten_file.md', hoặc đường dẫn tuyệt đối.
        heading_or_query: Tiêu đề mục hoặc từ khóa đoạn cần trích xuất bên trong skill đó (tự động nhảy tới đúng file con & đúng dòng).
        start_line: Dòng bắt đầu 1-based (nếu đã biết tọa độ dòng từ `agy_search_skills`). Để 0 nếu tìm theo `heading_or_query`.
        end_line: Dòng kết thúc 1-based. Để 0 để lấy khoảng ~130 dòng kể từ `start_line`.
        max_chars: Trần ký tự tối đa trả về (mặc định 6000 ký tự).
    """
    res = get_engine().read_section(
        skill_or_path=skill_or_path,
        heading_or_query=heading_or_query,
        start_line=start_line,
        end_line=end_line,
        max_chars=max_chars,
    )
    return json.dumps(res, ensure_ascii=False, indent=2)


@mcp.tool()
def agy_manage_skill(
    slug: str,
    action: str = "inspect",
    new_description: str = "",
    new_group: str = "",
    section_heading: str = "",
    section_content: str = "",
) -> str:
    """
    Công cụ Kiểm định & Sửa Skill an toàn theo chuẩn Javis OS (tự động tạo file backup `.bak` trước khi sửa và tự động re-index Delta SHA-256).

    Args:
        slug: Tên định danh (slug) của skill cần kiểm tra hoặc chỉnh sửa (vd: 'sql-sap-b1', 'video-storytelling').
        action: Chọn 1 trong 3 chế độ:
                - 'inspect': Xem cấu trúc mục lục Heading, kiểm tra chuẩn YAML, kiểm tra trần 150 ký tự và phát hiện link file con bị đứt.
                - 'update_frontmatter': Cập nhật `description` (bắt buộc <= 150 ký tự, không mở đầu sáo rỗng) và/hoặc `group`.
                - 'upsert_section': Thêm mới hoặc cập nhật đè một mục `## <section_heading>` trong thân `SKILL.md`.
        new_description: Mô tả mới ngắn gọn <= 150 ký tự (dùng khi `action='update_frontmatter'`).
        new_group: Tên nhóm phân loại của skill (dùng khi `action='update_frontmatter'`).
        section_heading: Tiêu đề mục `##` cần thêm/sửa (dùng khi `action='upsert_section'`).
        section_content: Nội dung Markdown của mục đó (dùng khi `action='upsert_section'`).
    """
    res = get_engine().manage_skill(
        slug=slug,
        action=action,
        new_description=new_description,
        new_group=new_group,
        section_heading=section_heading,
        section_content=section_content,
    )
    return json.dumps(res, ensure_ascii=False, indent=2)


@mcp.tool()
def agy_sync_and_audit_skills(
    force_rebuild: bool = False,
) -> str:
    """
    Đồng bộ chỉ mục Delta SHA-256 (< 0.2s) và xuất báo cáo kiểm toán toàn bộ kho Skills trên máy:
    tổng số skills theo tầng (Global / Plugin / Builtin), tổng số file con & chunks đã đánh chỉ mục,
    ngân sách ký tự `description` so với chuẩn 4,000 ký tự của Javis, top skills dùng nhiều nhất,
    và danh sách cảnh báo (link đứt, skill trùng tên, description vượt trần).

    Args:
        force_rebuild: True nếu muốn xóa sạch và dựng lại toàn bộ chỉ mục từ đầu; False (mặc định) để quét Delta SHA-256 siêu nhanh.
    """
    res = get_engine().audit_report(force_rebuild=force_rebuild)
    return json.dumps(res, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    _log("Starting agy-skill-hub MCP Server (Javis Hybrid Skill Brain for Antigravity)...")
    mcp.run(transport="stdio")
