#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
converge_blueprint.py — Vòng lặp Hội Tụ Tự Động (/speckit-converge)
─────────────────────────────────────────────────────────────────────
Lấy cảm hứng từ `/speckit-converge` của github/spec-kit và tích hợp
vào Project Blueprint Architect qua 2 chế độ:

Chế độ 1 — `converge blueprint` (Trước thực thi):
  Tự động phát hiện lỗi Blueprint → gợi ý sửa cụ thể → chạy lại
  validate_blueprint.py → lặp tối đa MAX_ROUNDS vòng → báo Exit 0.

Chế độ 2 — `converge phase <N>` (Trong lúc thực thi từng Phase):
  Chạy lệnh nghiệm thu (Gate Check) của Phase N từ BLUEPRINT_*.md →
  nếu fail → in hướng dẫn sửa → chờ Agent fix → chạy lại →
  lặp tối đa MAX_ROUNDS vòng → đạt thì mới cho phép qua Phase tiếp theo.

Exit codes:
  0 — Hội tụ thành công trong N vòng
  1 — Vẫn còn lỗi sau MAX_ROUNDS vòng
  2 — File Blueprint không tồn tại
  3 — Không tìm thấy Gate Check của Phase N trong Blueprint
"""

import argparse
import json
import os
import re
import subprocess
import sys
import time
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

# ─── CẤU HÌNH ────────────────────────────────────────────────────────────────
MAX_ROUNDS = 5          # Số vòng hội tụ tối đa
ROUND_SLEEP_SEC = 1.0   # Thời gian nghỉ giữa 2 vòng (tránh race condition)
PYTHON = sys.executable
SKILL_DIR = Path(__file__).parent.parent  # thư mục project-blueprint-architect/
VALIDATOR = SKILL_DIR / "scripts" / "validate_blueprint.py"
# ─────────────────────────────────────────────────────────────────────────────


def run_validate(blueprint_path: Path) -> dict:
    """Chạy validate_blueprint.py và trả về dict kết quả."""
    result = subprocess.run(
        [PYTHON, str(VALIDATOR), str(blueprint_path), "--json"],
        capture_output=True, text=True, encoding="utf-8"
    )
    try:
        return json.loads(result.stdout)
    except Exception:
        return {
            "valid": result.returncode == 0,
            "errors": [result.stdout + result.stderr],
            "mapped_skills_checked": [],
            "installed_skills_count": 0,
        }


def suggest_fixes(errors: list[str]) -> list[str]:
    """Phân tích từng lỗi và sinh gợi ý sửa cụ thể (không bịa — chỉ parse pattern)."""
    fixes = []
    for err in errors:
        if "Thiếu thành phần bắt buộc" in err:
            part = re.search(r"Mục (\d+)", err)
            num = part.group(1) if part else "?"
            fixes.append(
                f"  🔧 Mục {num}: Thêm heading `## {num}.` và nội dung bắt buộc theo mẫu "
                f"tại `references/03-mau-1-file-master-blueprint-chuan.md`."
            )
        elif "TBD" in err or "TODO" in err or "NEEDS CLARIFICATION" in err or "CHƯA CHỐT" in err:
            fixes.append(
                "  🔧 Còn chỗ chưa chốt: Tìm và thay thế tất cả `TBD`, `TODO:`, "
                "`[NEEDS CLARIFICATION]`, `[CHƯA CHỐT]` bằng nội dung quyết định rõ ràng."
            )
        elif "ảo giác tên Skill" in err or "không tồn tại trên hệ thống" in err:
            m = re.search(r"\[(.*?)\]", err)
            bad_skills = m.group(1) if m else "?"
            fixes.append(
                f"  🔧 Skill không tồn tại: {bad_skills}\n"
                "     Chạy `agy skills list` hoặc xem danh sách skills trong SKILL.md "
                "để lấy tên slug chính xác và cập nhật bảng Mục 7."
            )
        elif "Mục 7 chưa ánh xạ" in err:
            fixes.append(
                "  🔧 Mục 7: Thêm bảng Phase với cột 'Skill Chủ Lực' dùng backtick "
                "bọc tên slug, ví dụ: `lean-teamwork`, `security-audit`."
            )
        else:
            fixes.append(f"  🔧 {err}")
    return fixes


def extract_gate_check(blueprint_path: Path, phase_num: int) -> str | None:
    """Trích xuất lệnh Gate Check (Nghiệm Thu) của Phase N từ bảng Mục 7."""
    text = blueprint_path.read_text(encoding="utf-8")
    # Tìm section 7
    m7 = re.search(r"##\s*7\.[^\n]*\n(.*?)(?=\n##\s*8\.|\Z)", text, re.DOTALL)
    if not m7:
        return None
    sec7 = m7.group(1)
    # Tìm dòng Phase N trong bảng markdown
    pattern = re.compile(
        rf"\|\s*\*{{0,2}}Phase\s*{phase_num}\*{{0,2}}\s*\|.*?\|.*?\|.*?\|.*?\|\s*([^|\n]+?)\s*\|",
        re.IGNORECASE
    )
    m = pattern.search(sec7)
    if m:
        gate = m.group(1).strip()
        return gate if gate and gate not in ("-", "—", "") else None
    return None


def run_gate_check(gate_cmd: str, cwd: Path | None = None) -> tuple[int, str]:
    """Thực thi Gate Check command. Trả về (returncode, output)."""
    # Hỗ trợ cả lệnh shell và lệnh Python
    result = subprocess.run(
        gate_cmd, shell=True, capture_output=True, text=True,
        encoding="utf-8", cwd=str(cwd) if cwd else None
    )
    output = (result.stdout + result.stderr).strip()
    return result.returncode, output


def converge_blueprint_mode(blueprint_path: Path, json_out: bool) -> int:
    """
    Chế độ 1: Hội tụ chất lượng file Blueprint trước khi thực thi.
    Lặp tối đa MAX_ROUNDS lần, mỗi vòng: validate → nếu fail → in gợi ý sửa → chờ AI sửa.
    """
    print(f"\n{'='*60}")
    print(f"🔄 /speckit-converge — CHẾ ĐỘ 1: HỘI TỤ BLUEPRINT")
    print(f"   File: {blueprint_path.name} | Tối đa {MAX_ROUNDS} vòng")
    print(f"{'='*60}\n")

    history = []
    for round_num in range(1, MAX_ROUNDS + 1):
        print(f"┌─ Vòng {round_num}/{MAX_ROUNDS} {'─'*40}")
        res = run_validate(blueprint_path)
        history.append({"round": round_num, "result": res})

        if res["valid"]:
            print(f"│  ✅ Blueprint HỢP LỆ 100% sau {round_num} vòng!")
            print(f"│  Skills khớp: {res['mapped_skills_checked']}")
            print(f"└─ ✅ CONVERGE THÀNH CÔNG — Chốt Blueprint & chuyển sang thực thi.\n")
            if json_out:
                print(json.dumps({"converged": True, "rounds": round_num, "history": history}, ensure_ascii=False, indent=2))
            return 0

        # Vẫn còn lỗi — in gợi ý sửa
        print(f"│  ❌ Còn {len(res['errors'])} lỗi:")
        for err in res["errors"]:
            print(f"│     • {err}")
        print("│")
        print("│  💡 GỢI Ý SỬA CỤ THỂ:")
        for fix in suggest_fixes(res["errors"]):
            print(f"│  {fix}")
        print(f"│")

        if round_num < MAX_ROUNDS:
            print(f"│  ⏳ Áp dụng sửa chữa vào {blueprint_path.name} rồi nhấn Enter để chạy vòng {round_num+1}...")
            try:
                input("│  > ")
            except (KeyboardInterrupt, EOFError):
                print("\n│  ⚠️  Người dùng huỷ vòng lặp.")
                break
        print(f"└─{'─'*45}")
        time.sleep(ROUND_SLEEP_SEC)

    # Hết MAX_ROUNDS vẫn chưa hội tụ
    print(f"\n{'='*60}")
    print(f"❌ CONVERGE THẤT BẠI sau {MAX_ROUNDS} vòng.")
    print(f"   Blueprint chưa đạt chuẩn. Xem lại các lỗi ở vòng cuối.")
    print(f"{'='*60}\n")
    if json_out:
        print(json.dumps({"converged": False, "rounds": MAX_ROUNDS, "history": history}, ensure_ascii=False, indent=2))
    return 1


def converge_phase_mode(blueprint_path: Path, phase_num: int, json_out: bool) -> int:
    """
    Chế độ 2: Hội tụ Gate Check của Phase N trong lúc thực thi.
    Trích xuất lệnh nghiệm thu từ Mục 7 → chạy → nếu fail → in hướng dẫn →
    chờ AI fix → chạy lại → lặp tối đa MAX_ROUNDS vòng.
    """
    print(f"\n{'='*60}")
    print(f"🔄 /speckit-converge — CHẾ ĐỘ 2: HỘI TỤ PHASE {phase_num}")
    print(f"   File: {blueprint_path.name}")
    print(f"{'='*60}\n")

    gate_cmd = extract_gate_check(blueprint_path, phase_num)
    if not gate_cmd:
        print(
            f"❌ Không tìm thấy Gate Check (cổng nghiệm thu) của Phase {phase_num} "
            f"trong bảng Mục 7 của {blueprint_path.name}.\n"
            f"   Thêm vào cột 'Cổng Nghiệm Thu' một lệnh chạy được, ví dụ:\n"
            f"   `python validate.py --phase {phase_num}` hoặc `pytest tests/phase{phase_num}/`"
        )
        return 3

    print(f"📋 Gate Check Phase {phase_num}: `{gate_cmd}`\n")
    history = []

    for round_num in range(1, MAX_ROUNDS + 1):
        print(f"┌─ Vòng {round_num}/{MAX_ROUNDS} {'─'*40}")
        rc, output = run_gate_check(gate_cmd, cwd=blueprint_path.parent)
        passed = rc == 0
        history.append({"round": round_num, "returncode": rc, "output": output[:500]})
        print(f"│  {'✅ PASS' if passed else '❌ FAIL'} (Exit code: {rc})")
        if output:
            for line in output.splitlines()[:15]:
                print(f"│  {line}")
            if len(output.splitlines()) > 15:
                print(f"│  ... ({len(output.splitlines())} dòng tổng)")
        print("│")

        if passed:
            print(f"└─ ✅ PHASE {phase_num} HỘI TỤ THÀNH CÔNG sau {round_num} vòng!")
            print(f"   → Tiếp tục sang Phase {phase_num + 1}.\n")
            if json_out:
                print(json.dumps({"converged": True, "phase": phase_num, "rounds": round_num, "history": history}, ensure_ascii=False, indent=2))
            return 0

        if round_num < MAX_ROUNDS:
            print(f"│  💡 Agent: Đọc output lỗi trên → sửa code → chạy lại vòng {round_num+1}.")
            print(f"│  ⏳ Nhấn Enter sau khi đã sửa xong...")
            try:
                input("│  > ")
            except (KeyboardInterrupt, EOFError):
                print("\n│  ⚠️  Người dùng huỷ vòng lặp.")
                break
        print(f"└─{'─'*45}")
        time.sleep(ROUND_SLEEP_SEC)

    print(f"\n❌ Phase {phase_num} vẫn FAIL sau {MAX_ROUNDS} vòng. Báo cáo người dùng để xem xét lại thiết kế.\n")
    if json_out:
        print(json.dumps({"converged": False, "phase": phase_num, "rounds": MAX_ROUNDS, "history": history}, ensure_ascii=False, indent=2))
    return 1


def main() -> int:
    global MAX_ROUNDS  # noqa: PLW0603
    parser = argparse.ArgumentParser(
        description=(
            "converge_blueprint.py — Vòng lặp /speckit-converge cho Blueprint Architect.\n\n"
            "Chế độ 1 (hội tụ Blueprint):  python converge_blueprint.py blueprint <FILE.md>\n"
            "Chế độ 2 (hội tụ Phase N):    python converge_blueprint.py phase <N> <FILE.md>\n"
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "mode", choices=["blueprint", "phase"],
        help="'blueprint' — kiểm tra chất lượng file Blueprint; 'phase' — nghiệm thu Gate Check Phase N."
    )
    parser.add_argument("blueprint_path", help="Đường dẫn file BLUEPRINT_*.md")
    parser.add_argument("--phase", type=int, default=1, help="Số Phase cần hội tụ (chỉ dùng với mode 'phase'). Mặc định: 1.")
    parser.add_argument("--max-rounds", type=int, default=MAX_ROUNDS, help=f"Số vòng hội tụ tối đa. Mặc định: {MAX_ROUNDS}.")
    parser.add_argument("--json", action="store_true", help="Xuất kết quả định dạng JSON.")
    args = parser.parse_args()

    bp = Path(args.blueprint_path)

    # Ghi đè MAX_ROUNDS toàn cục sau khi parse args
    MAX_ROUNDS = args.max_rounds
    if not bp.is_file():
        print(f"LỖI: Không tìm thấy file Blueprint: {bp}", file=sys.stderr)
        return 2

    if args.mode == "blueprint":
        return converge_blueprint_mode(bp, args.json)
    else:
        return converge_phase_mode(bp, args.phase, args.json)


if __name__ == "__main__":
    sys.exit(main())
