#!/usr/bin/env python3
# -*- coding: utf-8 -*-
'''
Công cụ Kiểm định Tự động Logic & Trải nghiệm Thao tác Web App / App (`audit_webapp_ux.py`).
Quét các tệp mã nguồn giao diện (.tsx, .jsx, .vue, .svelte, .html, .css) để phát hiện 12 nhóm lỗi
chí mạng làm hỏng luồng thao tác của người dùng & Admin (Operate Mode UX Lint).
'''
import argparse
import json
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

UI_EXTS = {".tsx", ".jsx", ".html", ".vue", ".svelte"}
STYLE_EXTS = {".css", ".scss"}
SKIP_DIRS = {".git", "node_modules", ".next", "dist", "build", ".venv", "venv", "__pycache__"}


def scan_ui_text(text: str, filename: str = "sample.tsx") -> list:
    issues = []
    lines = text.splitlines()

    # Check 1: <button> inside <form> missing explicit type="button" | "submit" | "reset"
    in_form = "<form" in text.lower()
    if in_form:
        for idx, ln in enumerate(lines, 1):
            for m in re.finditer(r"<button\b([^>]*)", ln, re.IGNORECASE):
                attrs = m.group(1)
                if not re.search(r"\btype\s*=", attrs, re.IGNORECASE):
                    issues.append({
                        "rule": "FORM_BUTTON_MISSING_TYPE",
                        "severity": "HIGH",
                        "file": filename,
                        "line": idx,
                        "message": "Thẻ <button> nằm trong <form> nhưng thiếu `type=\"button\"` hoặc `type=\"submit\"` — bấm nút phụ sẽ làm Form tự Submit ngoài ý muốn!",
                    })

    for idx, ln in enumerate(lines, 1):
        # Check 2: Non-interactive <div onClick> / <span onClick> without role/tabIndex
        if re.search(r"<(div|span)\b[^>]*\b(onClick|@click|onclick)\s*=", ln):
            if not re.search(r"\b(role|tabIndex|tabindex|onKeyDown|@keydown)\b", ln):
                issues.append({
                    "rule": "NON_SEMANTIC_CLICK_HANDLER",
                    "severity": "HIGH",
                    "file": filename,
                    "line": idx,
                    "message": "Dùng `<div/span onClick>` thiếu `role`/`tabIndex`/`onKeyDown` làm liệt thao tác bàn phím (Tab/Enter). Hãy đổi sang `<button>` hoặc `<a href>`.",
                })

        # Check 3: outline-none without focus-visible replacement on same element
        if re.search(r"\boutline-none\b|outline\s*:\s*none", ln):
            if not re.search(r"focus-visible:|focus:ring|focus-within:", ln):
                issues.append({
                    "rule": "FOCUS_RING_REMOVED",
                    "severity": "MEDIUM",
                    "file": filename,
                    "line": idx,
                    "message": "Xóa viền `outline-none` nhưng không gắn `focus-visible:ring-*` thay thế khiến người dùng bàn phím mất dấu vị trí con trỏ.",
                })

        # Check 4: h-screen / 100vh instead of h-dvh / 100dvh
        if re.search(r"\b(h-screen|min-h-screen)\b|:\s*100vh\b", ln):
            issues.append({
                "rule": "VIEWPORT_100VH_CLIP",
                "severity": "MEDIUM",
                "file": filename,
                "line": idx,
                "message": "Dùng `h-screen` / `100vh` dễ làm che mất thanh nút bấm đáy trên trình duyệt di động. Khuyên đổi sang `h-dvh` / `min-h-dvh` (`100dvh`).",
            })

        # Check 5: transition-all anti-pattern
        if re.search(r"\btransition-all\b|transition\s*:\s*all\b", ln):
            issues.append({
                "rule": "TRANSITION_ALL_JANK",
                "severity": "LOW",
                "file": filename,
                "line": idx,
                "message": "Tránh `transition-all` gây giật layout trong Web App mật độ cao; chỉ chuyển động `transition-colors`, `transition-opacity` hoặc `transition-transform`.",
            })

        # Check 6: Blocking paste in inputs
        if re.search(r"onPaste\s*=\s*\{[^}]*preventDefault", ln):
            issues.append({
                "rule": "BLOCKED_INPUT_PASTE",
                "severity": "HIGH",
                "file": filename,
                "line": idx,
                "message": "Chặn thao tác dán (`onPaste` + `preventDefault`) gây ức chế nghiêm trọng khi người dùng dán mã đơn, OTP hoặc mật khẩu.",
            })

        # Check 7: Mobile input font-size < 16px without responsive override
        if re.search(r"<(input|select|textarea)\b", ln, re.IGNORECASE):
            if re.search(r"\btext-(xs|sm)\b", ln) and not re.search(r"\b(sm|md|lg):text-(xs|sm)\b", ln):
                if "text-base" not in ln:
                    issues.append({
                        "rule": "IOS_INPUT_AUTOZOOM_RISK",
                        "severity": "MEDIUM",
                        "file": filename,
                        "line": idx,
                        "message": "Ô nhập liệu có `text-xs`/`text-sm` (< 16px) trên mobile sẽ bị iOS Safari tự phóng to làm vỡ khung Form. Hãy dùng `text-base md:text-sm`.",
                    })

        # Check 9: Dead anchor href="#" or href="javascript:..."
        if re.search(r'<a\b[^>]*\bhref\s*=\s*["\'](#|javascript:)', ln, re.IGNORECASE):
            issues.append({
                "rule": "ANCHOR_DEAD_HREF",
                "severity": "MEDIUM",
                "file": filename,
                "line": idx,
                "message": "Dùng `<a href=\"#\">` / `javascript:` làm hỏng Ctrl+Click mở tab mới và nhảy cuộn đầu trang. Hãy dùng `<button type=\"button\">` cho hành động hoặc URL thật cho điều hướng.",
            })

        # Check 10: Blocking native browser alert/confirm/prompt
        if re.search(r"\bwindow\.(alert|confirm|prompt)\s*\(|\b(?<!\.)confirm\s*\(\s*[\"'\`]", ln):
            issues.append({
                "rule": "NATIVE_BLOCKING_DIALOG",
                "severity": "MEDIUM",
                "file": filename,
                "line": idx,
                "message": "Dùng hộp thoại chặn luồng `window.alert/confirm/prompt` thiếu ngữ cảnh và không đồng bộ UI. Hãy dùng `AlertDialog` nêu rõ tên đối tượng sắp thao tác.",
            })

        # Check 11: Single-line icon-only <button> missing aria-label / title
        if re.search(r"<button\b[^>]*>\s*<(svg|[A-Z][A-Za-z0-9]*Icon)\b[^>]*\/?>\s*<\/button>", ln):
            if not re.search(r"\b(aria-label|aria-labelledby|title)\s*=", ln, re.IGNORECASE):
                issues.append({
                    "rule": "ICON_BUTTON_MISSING_LABEL",
                    "severity": "HIGH",
                    "file": filename,
                    "line": idx,
                    "message": "Nút chỉ chứa Icon (`<svg>` / `<*Icon />`) nhưng thiếu `aria-label` hoặc Tooltip `title` khiến trình đọc màn hình & người dùng mới không rõ chức năng.",
                })

        # Check 12: <input type="number"> scroll-wheel mutation risk without onWheel guard
        if re.search(r'<input\b[^>]*\btype\s*=\s*["\']number["\']', ln, re.IGNORECASE):
            if "onWheel" not in ln:
                issues.append({
                    "rule": "NUMBER_INPUT_WHEEL_MUTATION",
                    "severity": "LOW",
                    "file": filename,
                    "line": idx,
                    "message": "`<input type=\"number\">` dễ bị nhảy sai số tiền/số lượng khi người dùng lăn chuột cuộn trang. Cân nhắc `inputMode=\"numeric\"` hoặc chặn `onWheel={(e) => e.currentTarget.blur()}`.",
                })

    # Check 8: Data table present without tabular-nums anywhere in file
    if "<table" in text.lower() and "tabular-nums" not in text:
        issues.append({
            "rule": "TABLE_MISSING_TABULAR_NUMS",
            "severity": "LOW",
            "file": filename,
            "line": 1,
            "message": "Phát hiện bảng dữ liệu `<table>` nhưng chưa bật `tabular-nums` cho các cột số liệu/tiền tệ để thẳng hàng chữ số.",
        })

    return issues


GOOD_SAMPLE = '''
export function OrderFormDrawer() {
  return (
    <div className="min-h-dvh flex flex-col">
      <form onSubmit={handleSave}>
        <label htmlFor="customerEmail">Email khách hàng</label>
        <input id="customerEmail" name="email" type="email" autoComplete="email" className="text-base md:text-sm focus-visible:ring-2" />
        <input id="qty" inputMode="numeric" className="text-base md:text-sm focus-visible:ring-2" />
        <div className="min-w-0 truncate">Tên khách hàng dài không vỡ khung</div>
        <table className="w-full tabular-nums"><tbody><tr><td className="text-right">1.250.000 ₫</td></tr></tbody></table>
        <button type="button" aria-label="Đóng ngăn kéo" onClick={onClose}><CloseIcon /></button>
        <button type="button" onClick={handleReset} className="transition-colors focus-visible:ring-2">Đặt lại</button>
        <button type="submit" disabled={isSaving} className="transition-transform active:scale-95">Đang lưu…</button>
      </form>
    </div>
  );
}
'''

BAD_SAMPLE = '''
export function BrokenAdminForm() {
  const askDelete = () => window.confirm("Delete?");
  return (
    <div className="h-screen">
      <form>
        <input className="text-sm outline-none" onPaste={(e) => e.preventDefault()} />
        <input type="number" className="text-base md:text-sm focus-visible:ring-2" />
        <a href="#" onClick={askDelete}>Xóa nhanh</a>
        <div onClick={openFilter} className="transition-all">Mở bộ lọc</div>
        <table><tbody><tr><td>99000</td></tr></tbody></table>
        <button><TrashIcon /></button>
        <button onClick={openCancelPopup}>Hủy</button>
      </form>
    </div>
  );
}
'''


def main() -> int:
    parser = argparse.ArgumentParser(description="Kiểm định tự động 12 lỗi UX & Logic thao tác cho Web App / App.")
    parser.add_argument("target", nargs="?", help="Đường dẫn file hoặc thư mục mã nguồn giao diện cần quét.")
    parser.add_argument("--self-test", action="store_true", help="Chạy tự kiểm định nội bộ với mẫu chuẩn & mẫu lỗi.")
    parser.add_argument("--strict", action="store_true", help="Trả về Exit code 1 nếu có lỗi mức HIGH.")
    parser.add_argument("--json", action="store_true", help="Xuất kết quả dạng JSON.")
    args = parser.parse_args()

    if args.self_test:
        good_issues = scan_ui_text(GOOD_SAMPLE, "GoodOrderDrawer.tsx")
        bad_issues = scan_ui_text(BAD_SAMPLE, "BrokenAdminForm.tsx")
        caught_rules = sorted({x["rule"] for x in bad_issues})
        passed = (len(good_issues) == 0) and (len(caught_rules) == 12)
        out = {
            "self_test_passed": passed,
            "good_sample_issues": len(good_issues),
            "bad_sample_issues_caught": len(bad_issues),
            "caught_rules": caught_rules,
        }
        print(json.dumps(out, ensure_ascii=False, indent=2))
        return 0 if passed else 1

    if not args.target:
        parser.error("Vui lòng truyền đường dẫn file/thư mục UI hoặc cờ --self-test.")

    p = Path(args.target)
    if not p.exists():
        print(f"LỖI: Không tìm thấy đường dẫn: {p}", file=sys.stderr)
        return 2

    files = [p] if p.is_file() else [
        f for f in p.rglob("*")
        if f.is_file() and f.suffix.lower() in (UI_EXTS | STYLE_EXTS) and not any(part in SKIP_DIRS for part in f.parts)
    ]

    all_issues = []
    for f in sorted(files):
        try:
            txt = f.read_text(encoding="utf-8", errors="ignore")
            all_issues.extend(scan_ui_text(txt, str(f)))
        except Exception:
            pass

    high_cnt = sum(1 for x in all_issues if x["severity"] == "HIGH")
    if args.json:
        print(json.dumps({"files_scanned": len(files), "total_issues": len(all_issues), "high_issues": high_cnt, "issues": all_issues}, ensure_ascii=False, indent=2))
    else:
        print(f"🔍 Đã quét {len(files)} tệp giao diện | Tổng cảnh báo: {len(all_issues)} (HIGH: {high_cnt})")
        for it in all_issues[:40]:
            print(f"  [{it['severity']}] {it['file']}:{it['line']} ({it['rule']}) -> {it['message']}")
    return 1 if (args.strict and high_cnt > 0) else 0


if __name__ == "__main__":
    sys.exit(main())
