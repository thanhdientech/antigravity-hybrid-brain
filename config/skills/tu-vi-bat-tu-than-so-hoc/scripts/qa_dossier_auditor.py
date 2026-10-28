#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
QA Dossier Auditor (Trình Kiểm Toán Độc Lập 13 Bước SOP V3.0 Chống Ảo Giác AI)
Đối chiếu tự động các tệp hồ sơ luận giải Markdown với tệp Ground Truth JSON (`facts_*.json`)
sinh bởi `destiny_pipeline.py` — hoàn toàn tổng quát cho mọi khách hàng/gia đình, 0% dữ liệu cứng.
"""

import argparse
import json
import re
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")


ALL_CUCS = ["Thủy Nhị Cục", "Mộc Tam Cục", "Kim Tứ Cục", "Thổ Ngũ Cục", "Hỏa Lục Cục"]
NEGATION_WORDS = ("không phải", "nhầm", "sai", "tránh nhầm", "loại bỏ", "khác với")


def _is_negated(text: str, start: int, end: int) -> bool:
    ctx = text[max(0, start - 55): min(len(text), end + 55)].lower().replace("\n", " ")
    return any(w in ctx for w in NEGATION_WORDS)


def audit_member_folder(member_dir: Path, facts: dict, require_full_10: bool = True) -> list[str]:
    issues: list[str] = []
    slug = facts.get("id", "")
    md_files = [
        p for p in sorted(member_dir.glob("*.md"))
        if not (p.name.endswith("_TOOL.md") and slug and slug not in p.name)
    ]
    if require_full_10 and len(md_files) != 10:
        issues.append(f"[{member_dir.name}] Số lượng file Markdown = {len(md_files)} (SOP V3.0 yêu cầu đủ 10 files).")

    expected_ad = facts["tuvi"]["am_duong"]
    wrong_ads = [ad for ad in ("Dương Nam", "Âm Nam", "Dương Nữ", "Âm Nữ") if ad != expected_ad]
    expected_cuc = facts["tuvi"]["cuc"]
    wrong_cucs = [c for c in ALL_CUCS if c != expected_cuc]
    expected_lp = str(facts["numerology"]["duong_doi"])
    expected_py = str(facts["numerology"]["nam_ca_nhan"])
    target_yr = facts["numerology"]["target_year"]
    expected_month_pillar = facts["bazi"]["pillars"][1]["can_chi"]

    for fpath in md_files:
        text = fpath.read_text(encoding="utf-8")
        fname = fpath.name

        # 1. Kiểm tra lệch Âm Dương Nam Nữ
        for wad in wrong_ads:
            for m in re.finditer(rf"Giới tính[^\n]{{0,35}}{re.escape(wad)}", text, re.IGNORECASE):
                if not _is_negated(text, m.start(), m.end()):
                    issues.append(f"[{fname}] Sai Âm Dương: ghi '{wad}', Ground Truth là '{expected_ad}'.")

        # 2. Kiểm tra lệch Cục Số Tử Vi
        for wc in wrong_cucs:
            for m in re.finditer(rf"Cục số[^\n]{{0,35}}{re.escape(wc)}", text, re.IGNORECASE):
                if not _is_negated(text, m.start(), m.end()):
                    issues.append(f"[{fname}] Sai Cục số: ghi '{wc}', Ground Truth là '{expected_cuc}'.")

        # 3. Kiểm tra ảo giác xác suất tuyệt đối 0% trong bảng 7 Đại Họa
        for m in re.finditer(r"\|\s*🟢\s*0%\s*\||Rủi ro\s*0%", text, re.IGNORECASE):
            issues.append(f"[{fname}] Vi phạm quy tắc 7 Đại Họa: dùng xác suất tuyệt đối '0%' thay vì mức thấp thực chứng.")

        # 4. Kiểm tra Trụ Tháng Bát Tự chuẩn 24 Tiết Khí (nếu bài viết có ghi "Trụ Tháng:")
        for m in re.finditer(r"Trụ Tháng[^\n:]{0,25}:\s*\*\*?([A-ZÀ-Ỹa-zà-ỹ]+\s+[A-ZÀ-Ỹa-zà-ỹ]+)", text):
            found_mp = m.group(1).strip()
            if found_mp.lower() != expected_month_pillar.lower() and not _is_negated(text, m.start(), m.end()):
                issues.append(
                    f"[{fname}] Lệch Trụ Tháng 24 Tiết Khí: ghi '{found_mp}', Ground Truth là '{expected_month_pillar}'."
                )

        # 5. Kiểm tra Số Đường Đời & Năm Cá Nhân
        for m in re.finditer(r"(?:Số Đường Đời|Life Path)[^\n\d]{0,25}(\d+(?:/\d+)?)", text, re.IGNORECASE):
            val = m.group(1).split("/")[0]
            if val != expected_lp and not _is_negated(text, m.start(), m.end()):
                issues.append(f"[{fname}] Lệch Số Đường Đời: ghi '{m.group(1)}', Ground Truth là '{expected_lp}'.")

        for m in re.finditer(rf"(?:Năm Cá Nhân|Personal Year)\s*{target_yr}[^\n\d]{{0,20}}(?:Số\s*)?(\d+)", text, re.IGNORECASE):
            val = m.group(1)
            if val != expected_py and not _is_negated(text, m.start(), m.end()):
                issues.append(f"[{fname}] Lệch Năm Cá Nhân {target_yr}: ghi '{val}', Ground Truth là '{expected_py}'.")

        # 6. Kiểm tra riêng cho File 02 (Mệnh Thư 8 Chương: >= 3000 từ & thuần văn xuôi)
        if fname.startswith("02_Menh_Thu"):
            main_body = re.split(r"##\s*(?:🗺️|📊|PHỤ LỤC|BẢNG ÁNH XẠ|TIÊU CHUẨN|TÀI LIỆU THAM KHẢO)", text)[0]
            words = len(main_body.split())
            bullets = re.findall(r"^[ \t]*[-*+]\s+", main_body, re.MULTILINE)
            if words < 3000:
                issues.append(f"[{fname}] Độ dài Mệnh Thư = {words} từ (SOP V3.0 yêu cầu >= 3,000 từ).")
            if bullets:
                issues.append(f"[{fname}] Vi phạm thể thức văn xuôi File 02: phát hiện {len(bullets)} dòng gạch đầu dòng.")

    return issues


def main() -> int:
    parser = argparse.ArgumentParser(description="Kiểm toán độc lập hồ sơ Tử Vi - Bát Tự - Thần Số Học theo SOP V3.0")
    parser.add_argument("--dossier-dir", type=str, required=True, help="Thư mục chứa hồ sơ Markdown cần kiểm toán")
    parser.add_argument("--facts-json", type=str, help="Đường dẫn 1 file facts_<id>.json (khi kiểm toán 1 cá nhân)")
    parser.add_argument("--facts-dir", type=str, help="Thư mục chứa các file facts_*.json (khi kiểm toán cả gia đình)")
    parser.add_argument("--allow-partial", action="store_true", help="Cho phép kiểm toán từng phần (không bắt buộc đủ 10 file)")
    args = parser.parse_args()

    dossier_dir = Path(args.dossier_dir).resolve()
    all_issues: list[str] = []
    checked_groups = 0

    if args.facts_json:
        facts = json.loads(Path(args.facts_json).read_text(encoding="utf-8"))
        checked_groups += 1
        all_issues.extend(audit_member_folder(dossier_dir, facts, require_full_10=not args.allow_partial))
    elif args.facts_dir:
        fdir = Path(args.facts_dir).resolve()
        for fjson in sorted(fdir.glob("facts_*.json")):
            facts = json.loads(fjson.read_text(encoding="utf-8"))
            slug = facts["id"]
            ho_ten_no_accent = slug.replace("_", " ")
            candidates = [
                dossier_dir / slug,
                dossier_dir / ho_ten_no_accent,
                dossier_dir / facts["profile"]["ho_ten"],
            ]
            target_sub = next((c for c in candidates if c.is_dir()), None)
            if target_sub is None:
                all_issues.append(f"[THIẾU THƯ MỤC] Không tìm thấy thư mục hồ sơ cho '{facts['profile']['ho_ten']}'.")
                continue
            checked_groups += 1
            all_issues.extend(audit_member_folder(target_sub, facts, require_full_10=not args.allow_partial))
    else:
        parser.error("Cần cung cấp --facts-json hoặc --facts-dir để đối chiếu Ground Truth.")

    print("=" * 68)
    print(f"KẾT QUẢ KIỂM TOÁN ĐỘC LẬP SOP V3.0 | Đã quét: {checked_groups} hồ sơ | Lỗi: {len(all_issues)}")
    print("=" * 68)
    if all_issues:
        for idx, err in enumerate(all_issues, 1):
            print(f"  {idx}. [FAIL] {err}")
        return 1

    print("  [PASS] 100% chỉ số Tử Vi, Bát Tự 24 Tiết Khí và Thần Số Học khớp Ground Truth!")
    return 0


if __name__ == "__main__":
    sys.exit(main())
