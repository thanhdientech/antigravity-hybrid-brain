#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Editorial & Brand Print-Ready Renderer (HTML/SVG/Paged-CSS -> Vector PDF & High-DPI PNG)
Hỗ trợ Dual-Engine tự động:
  1. Playwright Headless Chromium (nếu môi trường có cài `playwright`)
  2. Zero-Dependency Native Chromium CLI (`Google Chrome`, `Microsoft Edge`, `Chromium`, `Cốc Cốc`)
     chạy bằng 100% thư viện chuẩn Python — không cần cài bất kỳ package ngoài nào!
"""
import argparse
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")


def find_native_chromium() -> str:
    """Tìm trình duyệt nhân Chromium có sẵn trên Windows / macOS / Linux."""
    candidates = [
        shutil.which("chrome"),
        shutil.which("google-chrome"),
        shutil.which("chromium"),
        shutil.which("msedge"),
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        os.path.expandvars(r"%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"),
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
        os.path.expandvars(r"%LOCALAPPDATA%\CocCoc\Browser\Application\browser.exe"),
        r"C:\Program Files\CocCoc\Browser\Application\browser.exe",
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    ]
    for c in candidates:
        if c and os.path.isfile(c):
            return c
    return ""


def render_with_native_chromium(
    browser_bin: str,
    file_url: str,
    output_pdf: Path = None,
    output_png: Path = None,
    width_px: int = 1240,
    height_px: int = 1754,
) -> int:
    with tempfile.TemporaryDirectory(prefix="agy_editorial_chrome_") as profile_dir:
        base_flags = [
            browser_bin,
            "--headless=new",
            "--disable-gpu",
            "--no-first-run",
            "--no-default-browser-check",
            "--allow-file-access-from-files",
            f"--user-data-dir={profile_dir}",
        ]
        if output_pdf:
            output_pdf.parent.mkdir(parents=True, exist_ok=True)
            cmd_pdf = base_flags + [
                "--no-pdf-header-footer",
                f"--print-to-pdf={output_pdf.resolve()}",
                file_url,
            ]
            res = subprocess.run(cmd_pdf, capture_output=True, text=True, timeout=45)
            if not output_pdf.exists() or output_pdf.stat().st_size < 500:
                print(f"[ERROR] Xuất PDF thất bại (rc={res.returncode}): {res.stderr[:300]}", file=sys.stderr)
                return 1
            print(f"[OK] Đã xuất PDF chuẩn in ấn (Native Chromium): {output_pdf} ({output_pdf.stat().st_size / 1024:.1f} KB)")

        if output_png:
            output_png.parent.mkdir(parents=True, exist_ok=True)
            cmd_png = base_flags + [
                "--hide-scrollbars",
                "--force-device-scale-factor=2",
                f"--window-size={width_px},{height_px}",
                f"--screenshot={output_png.resolve()}",
                file_url,
            ]
            res = subprocess.run(cmd_png, capture_output=True, text=True, timeout=45)
            if not output_png.exists() or output_png.stat().st_size < 500:
                print(f"[ERROR] Xuất PNG thất bại (rc={res.returncode}): {res.stderr[:300]}", file=sys.stderr)
                return 1
            print(f"[OK] Đã xuất Ảnh PNG nét cao 2x Retina (Native Chromium): {output_png} ({output_png.stat().st_size / 1024:.1f} KB)")
    return 0


def render_document(
    input_html: Path,
    output_pdf: Path = None,
    output_png: Path = None,
    page_format: str = "A4",
    landscape: bool = False,
    width_px: int = 1240,
    height_px: int = 1754,
) -> int:
    if not input_html.exists():
        print(f"[ERROR] Không tìm thấy file HTML đầu vào: {input_html}", file=sys.stderr)
        return 1

    file_url = input_html.resolve().as_uri()

    # Engine 1: Playwright (nếu có cài đặt)
    try:
        from playwright.sync_api import sync_playwright  # type: ignore

        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(
                viewport={"width": width_px, "height": height_px},
                device_scale_factor=2,
            )
            page = context.new_page()
            page.goto(file_url, wait_until="networkidle", timeout=30000)

            if output_pdf:
                output_pdf.parent.mkdir(parents=True, exist_ok=True)
                page.pdf(
                    path=str(output_pdf),
                    format=page_format,
                    landscape=landscape,
                    print_background=True,
                    prefer_css_page_size=True,
                )
                print(f"[OK] Đã xuất PDF chuẩn in ấn ({page_format} - Playwright): {output_pdf} ({output_pdf.stat().st_size / 1024:.1f} KB)")

            if output_png:
                output_png.parent.mkdir(parents=True, exist_ok=True)
                page.screenshot(path=str(output_png), full_page=True)
                print(f"[OK] Đã xuất Ảnh PNG nét cao 2x (Playwright): {output_png} ({output_png.stat().st_size / 1024:.1f} KB)")

            browser.close()
        return 0
    except Exception:
        pass

    # Engine 2: Zero-Dependency Native Chromium (Chrome / Edge / Cốc Cốc)
    browser_bin = find_native_chromium()
    if not browser_bin:
        print("[ERROR] Không tìm thấy Playwright hoặc trình duyệt Chrome/Edge trên máy!", file=sys.stderr)
        return 1

    return render_with_native_chromium(
        browser_bin=browser_bin,
        file_url=file_url,
        output_pdf=output_pdf,
        output_png=output_png,
        width_px=width_px,
        height_px=height_px,
    )


def run_self_test() -> int:
    templates_dir = Path(__file__).resolve().parent.parent / "templates"
    targets = [
        ("bao_gia_a4", templates_dir / "template_bao_gia_a4.html", 1240, 1754),
        ("tap_chi_a4", templates_dir / "template_tap_chi_editorial_a4.html", 1240, 1754),
        ("logo_brand_a4", templates_dir / "template_logo_brand_sheet_a4.html", 1600, 1130),
    ]
    with tempfile.TemporaryDirectory() as tmp:
        for slug, tpl, w, h in targets:
            pdf_out = Path(tmp) / f"{slug}.pdf"
            png_out = Path(tmp) / f"{slug}.png"
            rc = render_document(tpl, output_pdf=pdf_out, output_png=png_out, width_px=w, height_px=h)
            if rc != 0 or not pdf_out.exists() or pdf_out.stat().st_size < 1024 or not png_out.exists():
                print(f"[FAIL] Self-test thất bại ở mẫu {slug}!", file=sys.stderr)
                return 1
        print("[PASS] Self-test kết xuất cả 3 ấn phẩm (Báo giá A4 + Tạp chí đa cột A4 + Logo Brand Sheet A4) ra PDF & PNG đạt 100% (Exit code 0)!")
        return 0


def main():
    parser = argparse.ArgumentParser(description="Render HTML/Paged-CSS/SVG to print-ready PDF & high-DPI PNG")
    parser.add_argument("--input", type=str, help="Đường dẫn file HTML đầu vào")
    parser.add_argument("--pdf", type=str, default="", help="Đường dẫn xuất file PDF (tùy chọn)")
    parser.add_argument("--png", type=str, default="", help="Đường dẫn xuất file PNG (tùy chọn)")
    parser.add_argument("--format", type=str, default="A4", help="Khổ giấy PDF: A4, A5, Letter, Legal (mặc định A4)")
    parser.add_argument("--landscape", action="store_true", help="Xoay ngang khổ giấy")
    parser.add_argument("--width", type=int, default=1240, help="Chiều rộng Viewport khi chụp PNG Banner/Trang")
    parser.add_argument("--height", type=int, default=1754, help="Chiều cao Viewport khi chụp PNG Banner/Trang")
    parser.add_argument("--self-test", action="store_true", help="Chạy kiểm thử tự động xuất 3 mẫu Báo giá, Tạp chí & Logo Brand Sheet ra PDF & PNG")
    args = parser.parse_args()

    if args.self_test:
        sys.exit(run_self_test())

    if not args.input:
        parser.error("Cần truyền --input <file.html> hoặc --self-test")

    rc = render_document(
        input_html=Path(args.input),
        output_pdf=Path(args.pdf) if args.pdf else None,
        output_png=Path(args.png) if args.png else None,
        page_format=args.format,
        landscape=args.landscape,
        width_px=args.width,
        height_px=args.height,
    )
    sys.exit(rc)


if __name__ == "__main__":
    main()
