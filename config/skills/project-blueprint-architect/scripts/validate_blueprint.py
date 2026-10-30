#!/usr/bin/env python3
# -*- coding: utf-8 -*-
'''
Trình kiểm định tự động tệp Đặc tả Dự án `BLUEPRINT_<TEN_DU_AN>.md` (Exit code 0).
Đảm bảo file chốt yêu cầu:
  1. Đủ 10 thành phần cốt lõi (Mục tiêu/ROI, Khóa phạm vi In-Scope/Out-of-Scope, User Story & Edge Cases,
     FR/NFR, Kiến trúc/Tech Stack, Hợp đồng Agent, Lộ trình ánh xạ Skill, Prompt từng Phase, Nghiệm thu SC).
  2. Không còn bất kỳ nhãn mập mờ chưa chốt nào (`[NEEDS CLARIFICATION]`, `TBD`, `TODO:`).
  3. Mọi tên `@skill` hoặc slug skill khai báo trong cột Skill Chủ Lực đều TỒN TẠI THẬT 100%
     trong hệ thống Antigravity (`agy_skill_index.db` hoặc các thư mục Global / Plugin / Builtin).
'''
import argparse
import json
import os
import re
import sqlite3
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

REQUIRED_PATTERNS = [
    ("Mục 1 — Bối cảnh, Mục tiêu & ROI", r"##\s*1\."),
    ("Mục 2 — Khóa Biên Giới Phạm Vi (In-Scope & Out-of-Scope)", r"(In-Scope|Out-of-Scope)"),
    ("Mục 3 — Hành trình Người dùng & Tình huống biên (Given/When/Then)", r"(Given|Review Focus|Tình Huống Biên)"),
    ("Mục 4A — Mã Yêu cầu Chức năng (FR-001)", r"FR-\d{3}"),
    ("Mục 4B — Mã Yêu cầu Phi chức năng (NFR-001)", r"NFR-\d{3}"),
    ("Mục 5 — Kiến trúc Kỹ thuật & Tech Stack", r"(Tech Stack|Ngôn ngữ\s*&\s*Framework|mermaid)"),
    ("Mục 6 — Hợp đồng Thực thi Agent & Vùng cấm chạm", r"(Untouchable Zones|Vùng cấm chạm|Agent Execution Contract)"),
    ("Mục 7 — Lộ trình Phase & Bảng Ánh Xạ Skills", r"Phase\s*1"),
    ("Mục 8 — Bộ Prompt Thực Thi Từng Phase", r"Prompt\s+Gọi\s+Thực\s+Thi|Prompt.*Phase\s*1"),
    ("Mục 9 — Tiêu chí Nghiệm thu Đo lường được (SC-001)", r"SC-\d{3}"),
]

FORBIDDEN_UNRESOLVED = [
    r"\[NEEDS CLARIFICATION[^\]]*\]",
    r"\bTBD\b",
    r"\bTODO:",
    r"\[CHƯA CHỐT\]",
]


def load_installed_skills() -> set:
    skills = set()
    home = Path.home()
    config_dir = home / ".gemini" / "config"
    agy_dir = home / ".gemini" / "antigravity"

    # 1. Ưu tiên đọc chuẩn xác 91 Skills từ agy_skill_index.db nếu đã có
    for db_candidate in [
        config_dir / "agy_skill_index.db",
        config_dir / "scripts" / "agy_skill_index.db",
    ]:
        if db_candidate.is_file():
            try:
                conn = sqlite3.connect(str(db_candidate))
                cur = conn.execute("SELECT slug FROM skills")
                for (slug,) in cur.fetchall():
                    if slug:
                        skills.add(slug.strip())
                conn.close()
            except Exception:
                pass
            if skills:
                skills.add("project-blueprint-architect")
                return skills

    # 2. Quét trực tiếp ổ đĩa làm nguồn sự thật gốc dự phòng (khi máy mới chưa build DB)
    if (config_dir / "skills").is_dir():
        for d in (config_dir / "skills").iterdir():
            if d.is_dir() and (d / "SKILL.md").is_file():
                skills.add(d.name)
    for root in [
        config_dir / "plugins",
        agy_dir / "builtin" / "skills",
    ]:
        if root.is_dir():
            for skill_md in root.rglob("SKILL.md"):
                try:
                    txt = skill_md.read_text(encoding="utf-8", errors="ignore")[:600]
                    m = re.search(r"^name:\s*['\"]?([a-zA-Z0-9_-]+)['\"]?\s*$", txt, re.MULTILINE)
                    if m:
                        skills.add(m.group(1).strip())
                    else:
                        skills.add(skill_md.parent.name)
                except Exception:
                    skills.add(skill_md.parent.name)

    skills.add("project-blueprint-architect")
    return skills


def extract_mapped_skills_from_section7(content: str) -> list:
    '''Trích xuất các mã skill nằm trong bảng Mục 7 (Lộ trình & Ánh xạ Skills).'''
    m7 = re.search(r"##\s*7\.[^\n]*\n(.*?)(?=\n##\s*8\.|\Z)", content, re.DOTALL)
    if not m7:
        return []
    sec7 = m7.group(1)
    found = []
    for line in sec7.splitlines():
        line_s = line.strip()
        if not line_s.startswith("|") or "Phase" not in line_s or "Skill Chủ Lực" in line_s:
            continue
        cells = [c.strip() for c in line_s.strip("|").split("|")]
        if len(cells) >= 4:
            skill_cell = cells[3]
            for token in re.findall(r"`@?([a-zA-Z0-9_-]+)`", skill_cell):
                if not token.startswith("tên-skill"):
                    found.append(token)
    return found


def validate_blueprint_text(content: str, known_skills: set) -> dict:
    errors = []
    warnings = []

    for label, pattern in REQUIRED_PATTERNS:
        if not re.search(pattern, content, re.IGNORECASE):
            errors.append(f"Thiếu thành phần bắt buộc: {label}")

    for pat in FORBIDDEN_UNRESOLVED:
        matches = re.findall(pat, content)
        if matches:
            errors.append(f"Còn chứa điểm mập mờ chưa chốt ({matches[0]}). Phải hỏi người dùng chốt dứt điểm trước khi khóa Blueprint.")

    mapped_skills = extract_mapped_skills_from_section7(content)
    if not mapped_skills:
        errors.append("Mục 7 chưa ánh xạ cụ thể tên Skill nào (bọc trong dấu backtick `ten-skill`) cho các Phase.")
    else:
        unknown = [s for s in mapped_skills if known_skills and s not in known_skills]
        if unknown:
            errors.append(f"Phát hiện tên Skill không tồn tại trên hệ thống (ảo giác tên Skill): {unknown}")

    return {
        "valid": len(errors) == 0,
        "mapped_skills_checked": mapped_skills,
        "installed_skills_count": len(known_skills),
        "errors": errors,
        "warnings": warnings,
    }


SAMPLE_VALID_BLUEPRINT = '''# 🏛️ MASTER BLUEPRINT: HỆ THỐNG ĐỐI CHIẾU TỒN KHO & CẢNH BÁO GIÁ THÀNH SAP B1

## 1. Bối Cảnh Bài Toán, Mục Tiêu Cốt Lõi & ROI
Giảm thời gian kế toán đối chiếu lệch kho - sổ cái cuối tháng từ 2 ngày xuống 30 giây.

## 2. Khóa Biên Giới Phạm Vi 3 Vùng
- **In-Scope MVP (P1):** Chạy truy vấn Read-Only khớp `OINM` và `OJDT`, xuất báo cáo Excel & Dashboard.
- **Out-of-Scope:** Tuyệt đối không sửa trực tiếp dữ liệu bảng chuẩn SAP B1.

## 3. Hành Trình Người Dùng & Review Focus
- **Given** kỳ kế toán tháng 10/2026 -> **When** bấm Đối chiếu -> **Then** xuất danh sách mã hàng lệch > 1 VNĐ.
- **Review Focus:** Chặn timeout truy vấn lớn, xử lý mã hàng tiếng Việt Unicode, kiểm tra phân quyền Read-Only.

## 4. Đặc Tả Yêu Cầu Chức Năng & Phi Chức Năng
- `FR-001`: Đối chiếu phát sinh Nợ/Có tài khoản 152, 154, 155 giữa `OINM` và `OJDT`.
- `NFR-001`: Thời gian truy vấn < 5 giây, kết nối Strict Read-Only 100%.

## 5. Kiến Trúc Kỹ Thuật & Tech Stack
```mermaid
flowchart LR
    UI["Dashboard UI"] --> SQL["Read-Only SQL Engine"] --> SAP[("SAP B1 DB")]
```
- **Ngôn ngữ & Framework:** Python 3.12 + HTML/Tailwind Dashboard.

## 6. Hợp Đồng Giao Việc Cho AI Agent (Agent Execution Contract)
- **Untouchable Zones:** Cấm `UPDATE/DELETE/INSERT` trên toàn bộ bảng chuẩn SAP B1 (`OINM`, `OJDT`, `OWOR`).

## 7. Lộ Trình Triển Khai & Bảng Ánh Xạ Skills
| Phase | Công Việc | Công Nghệ | Skill Chủ Lực | Đầu Vào -> Đầu Ra | Nghiệm Thu |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Phase 1** | Chuẩn hóa nghiệp vụ & Viết SQL đối chiếu | T-SQL SAP B1 | `sap-b1-beas`, `viet-sql-sap-b1` | Yêu cầu -> File `.sql` chuẩn | Chạy thử `0` lỗi cú pháp |
| **Phase 2** | Kết nối Read-Only khớp số thật & Xuất Excel | Python Read-Only | `sql-sap-b1` | `.sql` -> Báo cáo `.xlsx` | Tổng Nợ = Tổng Có |
| **Phase 3** | Dựng giao diện Dashboard & Kiểm toán bảo mật | HTML + Tailwind | `ui-ux-design-pro-max`, `security-audit`, `ifixai-agent-auditor` | `.xlsx` -> Dashboard sạch | `0` lộ mật khẩu, `Grade A` |

## 8. Bộ Prompt Mẫu Thực Thi Từng Phase
### Prompt Gọi Thực Thi Phase 1:
Dùng `sap-b1-beas` và `viet-sql-sap-b1` viết truy vấn đối chiếu `OINM` - `OJDT`.

## 9. Tiêu Chí Nghiệm Thu Tổng Thể
- [ ] `SC-001`: Khớp 100% số dư sổ cái và sổ chi tiết vật tư với Exit code 0.

## 10. Tiêu Chuẩn Công Nghệ & Tài Liệu Tham Chiếu
• **Thông tư 99/2025/TT-BTC:** Chế độ kế toán doanh nghiệp áp dụng từ 01/01/2026 (*Bộ Tài chính*).
'''


def main() -> int:
    parser = argparse.ArgumentParser(description="Kiểm định chất lượng file Master Blueprint (Exit code 0).")
    parser.add_argument("blueprint_path", nargs="?", help="Đường dẫn tới file BLUEPRINT_*.md cần kiểm tra.")
    parser.add_argument("--self-test", action="store_true", help="Chạy tự kiểm định nội bộ với mẫu chuẩn & mẫu lỗi.")
    parser.add_argument("--json", action="store_true", help="Xuất kết quả định dạng JSON.")
    args = parser.parse_args()

    known_skills = load_installed_skills()

    if args.self_test:
        ok_res = validate_blueprint_text(SAMPLE_VALID_BLUEPRINT, known_skills)
        bad_text = SAMPLE_VALID_BLUEPRINT.replace(
            "## 8. Bộ Prompt",
            "| **Phase 4** | Test lỗi | Py | `skill-ao-giac-khong-ton-tai` | A -> B | OK |\n\n[NEEDS CLARIFICATION: chưa rõ DB]\n\n## 8. Bộ Prompt",
        )
        bad_res = validate_blueprint_text(bad_text, known_skills)
        passed = ok_res["valid"] and (not bad_res["valid"]) and len(bad_res["errors"]) >= 2
        summary = {
            "self_test_passed": passed,
            "installed_skills_detected": len(known_skills),
            "valid_sample_result": ok_res,
            "invalid_sample_caught_errors": bad_res["errors"],
        }
        print(json.dumps(summary, ensure_ascii=False, indent=2))
        return 0 if passed else 1

    if not args.blueprint_path:
        parser.error("Vui lòng truyền đường dẫn file BLUEPRINT_*.md hoặc cờ --self-test.")

    p = Path(args.blueprint_path)
    if not p.is_file():
        print(f"LỖI: Không tìm thấy file Blueprint tại: {p}", file=sys.stderr)
        return 2

    content = p.read_text(encoding="utf-8")
    res = validate_blueprint_text(content, known_skills)
    if args.json:
        print(json.dumps(res, ensure_ascii=False, indent=2))
    else:
        if res["valid"]:
            print(f"✅ BLUEPRINT HỢP LỆ 100% ({p.name}) | Đã đối chiếu khớp {len(res['mapped_skills_checked'])} Skills trong kho {res['installed_skills_count']} Skills.")
        else:
            print(f"❌ BLUEPRINT CHƯA ĐẠT CHUẨN ({p.name}):")
            for err in res["errors"]:
                print(f"   - {err}")
    return 0 if res["valid"] else 1


if __name__ == "__main__":
    sys.exit(main())
