#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Antigravity Global PreInvocation Lifecycle Hook
1. Tự động tiêm thông điệp Re-Anchor tàng hình trước MỖI lượt gọi model (Anti-Context Drift 100%).
2. Đồng bộ sự kiện từ Antigravity Desktop Widget (`teamwork_bridge.json`).
3. [NEW — BỘ NÃO JAVIS HYBRID SKILL ROUTER]: Tự động đọc câu hỏi mới nhất từ `transcript.jsonl`,
   tra cứu chỉ mục lai SQLite WAL FTS5 + RRF (`agy_skill_index.db`) trong < 10ms, và đính kèm
   gợi ý Top 3 Skill + File con + Tọa độ dòng `L_start..L_end` dưới dạng `ephemeralMessage`
   (tự hủy sau lượt hiện tại, không làm phình lịch sử hội thoại).
"""

import os
import re
import sys
import json
from pathlib import Path

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

SCRIPT_DIR = Path(__file__).resolve().parent
CONFIG_DIR = SCRIPT_DIR.parent
SKILL_VER_FILE = CONFIG_DIR / 'skills' / 'lean-teamwork' / 'VERSION'
INDEX_DB_FILE = CONFIG_DIR / 'agy_skill_index.db'


def get_active_version():
    try:
        if SKILL_VER_FILE.exists():
            return SKILL_VER_FILE.read_text(encoding='utf-8').strip()
    except Exception:
        pass
    return '1.3.1'


def read_hook_stdin() -> dict:
    try:
        if not sys.stdin.isatty():
            raw = sys.stdin.read()
            if raw and raw.strip():
                data = json.loads(raw)
                if isinstance(data, dict):
                    return data
    except Exception:
        pass
    return {}


def extract_latest_user_query(payload: dict) -> tuple[str, int]:
    """
    Đọc 192KB cuối của transcript.jsonl (< 1ms), lấy câu hỏi USER_INPUT mới nhất
    và đếm số bước PLANNER_RESPONSE kể từ câu hỏi đó.
    """
    t_path_str = payload.get('transcriptPath') or ''
    t_path = Path(t_path_str) if t_path_str else None

    if not t_path or not t_path.is_file():
        cid = payload.get('conversationId') or os.environ.get('ANTIGRAVITY_CONVERSATION_ID') or ''
        if cid:
            cand = Path.home() / '.gemini' / 'antigravity' / 'brain' / cid / '.system_generated' / 'logs' / 'transcript.jsonl'
            if cand.is_file():
                t_path = cand

    if not t_path or not t_path.is_file():
        return '', 999

    try:
        sz = t_path.stat().st_size
        with t_path.open('rb') as f:
            f.seek(max(0, sz - 196608))
            tail_lines = f.read().decode('utf-8', errors='replace').splitlines()
    except Exception:
        return '', 999

    planner_steps_after = 0
    for ln in reversed(tail_lines):
        if not ln.startswith('{'):
            continue
        try:
            obj = json.loads(ln)
        except Exception:
            continue
        stype = obj.get('type')
        if stype == 'PLANNER_RESPONSE':
            planner_steps_after += 1
        elif stype == 'USER_INPUT':
            raw_content = str(obj.get('content') or '').strip()
            # Tách phần trong <USER_REQUEST>...</USER_REQUEST> nếu có
            m = re.search(r'<USER_REQUEST>\s*(.*?)\s*</USER_REQUEST>', raw_content, re.S)
            clean_q = m.group(1).strip() if m else re.sub(r'<ADDITIONAL_METADATA>.*?</ADDITIONAL_METADATA>', '', raw_content, flags=re.S).strip()
            return clean_q[:500], planner_steps_after

    return '', 999


def get_javis_skill_hint(payload: dict) -> str:
    """Tra cứu nhanh chỉ mục đã dựng sẵn (`agy_skill_index.db`) trong ~3-8ms."""
    try:
        if not INDEX_DB_FILE.is_file():
            return ''
        user_q, planner_steps_after = extract_latest_user_query(payload)
        # Chỉ gợi ý ở đầu lượt trả lời câu hỏi mới (0 hoặc 1 bước planner) để tối ưu tuyệt đối token
        if not user_q or len(user_q) < 4 or planner_steps_after > 2:
            return ''
        if str(SCRIPT_DIR) not in sys.path:
            sys.path.insert(0, str(SCRIPT_DIR))
        import agy_skill_engine
        eng = agy_skill_engine.get_engine()
        return eng.format_hook_hint(user_q, max_items=3)
    except Exception:
        return ''


def main():
    payload = read_hook_stdin()
    ver = get_active_version()

    # Tự động cấp sẵn đồng hồ macOS Spectrum 480x84 trong suốt vào thư mục brain của session
    cid = payload.get('conversationId') or os.environ.get('ANTIGRAVITY_CONVERSATION_ID')
    if cid:
        try:
            brain_dir = Path.home() / '.gemini' / 'antigravity' / 'brain' / cid
            brain_dir.mkdir(parents=True, exist_ok=True)
            dst_svg = brain_dir / 'technical_proposal_timer.svg'
            src_svg = CONFIG_DIR / 'skills' / 'lean-teamwork' / 'resources' / 'technical_proposal_timer.svg'
            if src_svg.exists():
                if not dst_svg.exists() or dst_svg.stat().st_size != src_svg.stat().st_size or 'fill="#0D1117"' in dst_svg.read_text(encoding='utf-8', errors='ignore'):
                    import shutil
                    shutil.copyfile(src_svg, dst_svg)
        except Exception:
            pass

    # Kiểm tra phản hồi từ Antigravity Desktop Widget
    widget_event_msg = ""
    try:
        bridge_file = Path.home() / '.antigravity_cockpit' / 'teamwork_bridge.json'
        if bridge_file.exists():
            b_data = json.loads(bridge_file.read_text(encoding='utf-8'))
            resp = b_data.get('response')
            if resp and not resp.get('handled'):
                resp['handled'] = True
                b_data['response'] = resp
                bridge_file.write_text(json.dumps(b_data, ensure_ascii=False, indent=2), encoding='utf-8')
                act = resp.get('action')
                if act == 'SELECT_OPTION':
                    opt_id = resp.get('selected_option_id')
                    widget_event_msg = f"\n\n🖱️ [SỰ KIỆN TỪ WIDGET DESKTOP]: Người dùng vừa bấm CHỌN PHƯƠNG ÁN [{opt_id}] trực tiếp từ Antigravity Desktop Widget! Hãy thi hành ngay theo phương án này!"
                elif act == 'ACCEPT':
                    widget_event_msg = f"\n\n💎 [SỰ KIỆN TỪ WIDGET DESKTOP]: Người dùng vừa bấm [100% HOÀN TẤT - CHẤP THUẬN NGHIỆM THU] trên Desktop Widget! Hãy tổng kết và hoàn thành!"
                elif act == 'DEBUG':
                    widget_event_msg = f"\n\n⚡ [SỰ KIỆN TỪ WIDGET DESKTOP]: Người dùng vừa bấm [SUPERPOWERS DEBUG] trên Desktop Widget! Hãy rà soát sâu!"
    except Exception:
        pass

    anchor_msg = (
        f'⚡ [MANDATORY RE-ANCHOR — Lean Teamwork v{ver} (Widget HUD Decoupled)]:\n'
        '1. 🧭 [CHẾ ĐỘ ĐỀ XUẤT KỸ THUẬT] 💡 (Widget HUD): Khi mở đầu hoặc chọn giải pháp kỹ thuật, BẮT BUỘC gọi teamwork_bridge.publish_proposal(title, options, 150) để hiển thị bộ chọn trên Desktop Widget Popover. In tóm tắt ra chat, TUYỆT ĐỐI KHÔNG gọi modal ask_question (giải phóng khung chat 100%).\n'
        '2. 💎 [CHẾ ĐỘ NGHIỆM THU HOÀN THIỆN] ✨ (Widget HUD): Khi code xong và test pass (exit 0): BƯỚC 1 in toàn văn Báo cáo & Hướng dẫn đối chứng ra màn hình chat; BƯỚC 2 gọi teamwork_bridge.publish_acceptance(...) để treo bảng nghiệm thu cố định trên Desktop Widget Popover. TUYỆT ĐỐI KHÔNG gọi modal ask_question làm che khung chat, user có thể bấm trực tiếp từ Desktop Widget (điều phối an toàn qua IPC bridge) hoặc xác nhận trực tiếp trong chat ("ok" / "OK 💎").\n'
        '3. FIRST-TIME RIGHT: Inspect First kỹ lưỡng trước khi sửa, cấm đoán mò vì sợ đọc tài liệu.'
    )

    skill_hint = get_javis_skill_hint(payload)
    if skill_hint:
        anchor_msg += "\n\n" + skill_hint

    if widget_event_msg:
        anchor_msg += widget_event_msg

    response = {
        'injectSteps': [
            {
                'ephemeralMessage': anchor_msg
            }
        ]
    }

    sys.stdout.write(json.dumps(response, ensure_ascii=False) + '\n')
    sys.stdout.flush()
    sys.exit(0)


if __name__ == '__main__':
    main()
