#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CLI Điều Phối Sản Xuất Phim Bán Hàng Shopee Affiliate (Storytelling + Virtual Try-On).
Tự động sử dụng môi trường Python `.venv` chuẩn của dự án Shopee Video Studio để thực thi:
  - `status`       : Kiểm tra trạng thái FlowKit (:8100), Muse.ai (:8010), AI33.pro, Suno AI, agy CLI & Timeline (:8500)
  - `scan`         : Quét sản phẩm Hot / Flash Sale / Từ khóa Shopee.vn
  - `extract`      : Tải thông tin & dàn ảnh gốc HD từ link Shopee.vn
  - `story-render` : Dựng trọn gói Phim Ngắn Câu Chuyện Có Người Mẫu Mặc Áo Thật (.MP4 1080x1920) & đồng bộ sang :8500
  - `sync-8500`    : Đồng bộ thư mục dự án 8 ngăn sang kênh 'Shopee Affiliate' trên Timeline Studio (:8500)
"""
import argparse
import json
import os
import subprocess
import sys
from pathlib import Path

STUDIO_WORKSPACE = Path(os.environ.get("SHOPEE_STUDIO_WORKSPACE", os.path.expanduser("~/shopee-video-studio")))
STUDIO_VENV_PY = STUDIO_WORKSPACE / "01_Shopee_API_Va_San_Ngach" / "shopee-scraper" / ".venv" / "Scripts" / "python.exe"


def _reexec_in_studio_venv_if_needed() -> None:
    if STUDIO_VENV_PY.exists() and Path(sys.executable).resolve() != STUDIO_VENV_PY.resolve():
        env = os.environ.copy()
        env["PYTHONUTF8"] = "1"
        res = subprocess.run([str(STUDIO_VENV_PY), __file__, *sys.argv[1:]], env=env)
        sys.exit(res.returncode)


def main() -> int:
    _reexec_in_studio_venv_if_needed()
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")

    if str(STUDIO_WORKSPACE) not in sys.path:
        sys.path.insert(0, str(STUDIO_WORKSPACE))

    from shopee_video_studio import mcp_shopee_studio

    parser = argparse.ArgumentParser(description="Shopee Affiliate Storytelling & Virtual Try-On CLI")
    sub = parser.add_subparsers(dest="cmd", required=True)

    p_st = sub.add_parser("status", help="Kiểm tra kết nối FlowKit, Muse.ai, AI33.pro, Suno & agy CLI")
    p_st.add_argument("--flow-url", default="", help="URL Project Google Flow")

    p_sc = sub.add_parser("scan", help="Quét sản phẩm Shopee Hot / Flash Sale theo từ khóa")
    p_sc.add_argument("--keyword", default="", help="Từ khóa lọc")
    p_sc.add_argument("--source", default="all", help="all | discover | flash_sale | trending")
    p_sc.add_argument("--limit", type=int, default=15)

    p_na = sub.add_parser("niche-analyze", help="Phân tích sâu từ khóa ngách, gom cụm so sánh giá/chất lượng & chấm điểm Winning Score")
    p_na.add_argument("--keyword", required=True, help="Từ khóa ngách cần phân tích (VD: làm vườn, kéo cắt cành)")
    p_na.add_argument("--limit", type=int, default=44)
    p_na.add_argument("--profile", default="tomi")

    p_ex = sub.add_parser("extract", help="Bóc tách link Shopee & tải ảnh gốc HD")
    p_ex.add_argument("--url", required=True, help="Link sản phẩm Shopee.vn")
    p_ex.add_argument("--affiliate", default="", help="Link rút gọn s.shopee.vn")

    p_sr = sub.add_parser("story-render", help="Dựng trọn gói Phim Câu Chuyện Người Mẫu Mặc Áo Thật (.MP4)")
    p_sr.add_argument("--url", required=True, help="Link sản phẩm Shopee.vn")
    p_sr.add_argument("--affiliate", default="", help="Link tiếp thị liên kết")
    p_sr.add_argument("--flow-url", default="https://flow.google.com/project/<FLOW_PROJECT_ID>")
    p_sr.add_argument("--engine", default="flowkit_auto", choices=["flowkit_auto", "muse_only"])
    p_sr.add_argument("--garment-index", type=int, default=1)
    p_sr.add_argument("--scenes", type=int, default=3)
    p_sr.add_argument("--voice", default="elevenlabs_CQAD6iKxS73fEAGjSwt5")
    p_sr.add_argument("--no-suno", action="store_true")
    p_sr.add_argument("--theme", default="")
    p_sr.add_argument("--garment-note", default="")

    p_sy = sub.add_parser("sync-8500", help="Đồng bộ dự án 8 ngăn sang kênh Shopee Affiliate trên Timeline Studio (:8500)")
    p_sy.add_argument("--project-dir", required=True)

    args = parser.parse_args()

    if args.cmd == "status":
        out = mcp_shopee_studio.handle_mcp_call("shopee_studio_status", {"flow_project_url": args.flow_url})
    elif args.cmd == "scan":
        out = mcp_shopee_studio.handle_mcp_call(
            "shopee_scan_products", {"keyword": args.keyword, "source": args.source, "limit": args.limit}
        )
    elif args.cmd == "niche-analyze":
        out = mcp_shopee_studio.handle_mcp_call(
            "shopee_analyze_niche_and_compare",
            {"keyword": args.keyword, "limit": args.limit, "profile": args.profile},
        )
    elif args.cmd == "extract":
        out = mcp_shopee_studio.handle_mcp_call(
            "shopee_extract_product", {"url": args.url, "affiliate_link": args.affiliate}
        )
    elif args.cmd == "story-render":
        out = mcp_shopee_studio.handle_mcp_call(
            "shopee_render_story_video",
            {
                "url": args.url,
                "affiliate_link": args.affiliate,
                "flow_project_url": args.flow_url,
                "visual_engine": args.engine,
                "garment_image_index": args.garment_index,
                "scene_count": args.scenes,
                "voice_id": args.voice,
                "enable_suno_bgm": not args.no_suno,
                "story_theme": args.theme,
                "garment_visual_note": args.garment_note,
            },
        )
    elif args.cmd == "sync-8500":
        out = mcp_shopee_studio.handle_mcp_call("shopee_sync_to_timeline_8500", {"project_dir": args.project_dir})
    else:
        out = {"success": False, "error": "Lệnh không hợp lệ"}

    print(json.dumps(out, ensure_ascii=False, indent=2))
    return 0 if out.get("success") else 1


if __name__ == "__main__":
    sys.exit(main())
