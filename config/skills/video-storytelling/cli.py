# -*- coding: utf-8 -*-
"""
Video Storytelling CLI
Giao diện dòng lệnh chuyên nghiệp tạo kịch bản kể chuyện & prompt phân tách Seedance 2.0 và Veo 3.
"""

import sys
import os
import argparse
import json

if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

from generator import VideoStorytellingGenerator


def main():
    parser = argparse.ArgumentParser(
        description="Video Storytelling Suite - Sáng tạo kịch bản & phân tách Prompt Seedance 2.0 & Veo 3 Google",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )

    parser.add_argument("--topic", "-t", required=True, help="Sản phẩm hoặc chủ đề cốt lõi của video")
    parser.add_argument("--character", "-c", default="cô gái trẻ người Việt Nam 24 tuổi, phong cách thanh lịch", help="Mô tả nhân vật chính")
    parser.add_argument("--problem", "-p", default="mụn viêm lâu năm và sự tự ti", help="Khủng hoảng hoặc nỗi đau nhức nhối của nhân vật")
    parser.add_argument("--epiphany", "-e", default="công nghệ vi nang thẩm thấu sâu làm dịu da ngay tức thì", help="Bước ngoặt khám phá ra giải pháp")
    parser.add_argument("--cta", default="Nhấn link bên dưới để nhận ưu đãi 50% hôm nay", help="Lời kêu gọi hành động")
    parser.add_argument(
        "--formula", "-f",
        choices=[
            "pas_t",
            "short_form_hvc",
            "conversion_aida",
            "conversion_bab",
            "scientific_debate_7beat",
            "abt_documentary",
            "dan_harmon_8beat",
            "pixar_spine",
            "unsolved_mystery"
        ],
        default="pas_t",
        help="Công thức kịch bản: pas_t | short_form_hvc | conversion_aida | conversion_bab | scientific_debate_7beat | abt_documentary | dan_harmon_8beat | pixar_spine | unsolved_mystery"
    )
    parser.add_argument(
        "--cinematic-style", "-cs",
        choices=["hollywood_dramatic", "cyberpunk_neon", "film_noir", "documentary", "commercial_clean", "vintage_retro"],
        default="hollywood_dramatic",
        help="Phong cách đạo diễn điện ảnh DoP (Tích hợp Cinematic Video Prompt)"
    )
    parser.add_argument("--model", "-m", choices=["both", "seedance", "veo3"], default="both", help="Chọn phân hệ xuất prompt: both | seedance | veo3")
    parser.add_argument("--out", "-o", default="./output/storytelling_campaign", help="Thư mục xuất thành phẩm")

    args = parser.parse_args()

    gen = VideoStorytellingGenerator()
    pkg = gen.generate_full_package(
        topic=args.topic,
        character=args.character,
        problem=args.problem,
        epiphany=args.epiphany,
        call_to_action=args.cta,
        cinematic_style=args.cinematic_style,
        formula=args.formula,
        output_dir=args.out
    )

    print("\n" + "="*70)
    print(f"🎬 ĐÃ XUẤT XƯỞNG KỊCH BẢN STORYTELLING: '{pkg['title']}'")
    print("="*70)
    print(f"📁 Thư mục lưu thành phẩm: {os.path.abspath(args.out)}")
    print(f"📐 Công thức kịch bản: {pkg['formula'].upper()}")
    print(f"🎥 Phong cách DoP điện ảnh: {args.cinematic_style.upper()} (Cinematic Video Prompt)")
    print(f"📄 Báo cáo chi tiết: {os.path.abspath(pkg['output_markdown_path'])}")
    print(f"📦 Dữ liệu cấu trúc JSON: {os.path.abspath(pkg['output_json_path'])}")

    if args.model in ["both", "seedance"]:
        print(f"\n🔴 [SEEDANCE 2.0 / 2.5]: Đã tạo {len(pkg['seedance_engine']['shots'])} cảnh chuẩn Multimodal Reference (@Image 1, @Image 2) + DoP Director.")

    if args.model in ["both", "veo3"]:
        print(f"\n🔵 [GOOGLE VEO 3 / 3.1]: Đã tạo {len(pkg['veo3_engine']['shots'])} cảnh chuẩn 5-Part Formula & Dialogue Audio + DoP Cinematography.")

    print("\n✅ Hoàn thành 100%! Sếp có thể mở file Markdown để copy prompt nạp vào mô hình AI.")


if __name__ == "__main__":
    main()
