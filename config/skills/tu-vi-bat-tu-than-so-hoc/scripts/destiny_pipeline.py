#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# /// script
# requires-python = ">=3.9"
# dependencies = [
#   "iztro-py>=0.5.0",
#   "lunar_python>=1.4.0",
#   "lunarcalendar>=0.0.9",
#   "pydantic>=2.0.0",
#   "python-dateutil>=2.8.0",
# ]
# ///
"""
Destiny Pipeline Engine (Tử Vi Đẩu Số + Bát Tự 24 Tiết Khí + Thần Số Học Song Hệ)
Động cơ tính toán tất định 100% Offline chống ảo giác AI cho Ngành #11:
- Tử Vi Đẩu Số: iztro-py (vi-VN) — 12 cung, 14 chính tinh (Miếu/Vượng/Đắc/Lợi/Bình/Bất/Hãm),
  Tứ Hóa, Lai Nhân Cung, tách bạch Sao Tọa Thủ vs. Tam Hợp/Xung Chiếu vs. Giáp Cung.
- Bát Tự Tứ Trụ: lunar_python (EightChar) — Cắt trụ Tháng chuẩn 24 Tiết Khí đến từng giây,
  Thập Thần, Tàng Can, Nạp Âm 60 Hoa Giáp, 12 Vòng Trường Sinh, Không Vong, Đại Vận.
- Thần Số Học Song Hệ: Pythagoras Quốc Tế (18 chỉ số + Nợ Nghiệp + Master) & Nhân Số Học
  David A. Phillips (Con Số Chủ Đạo + Biểu Đồ Ngày Sinh 3x3 & 8 Mũi Tên).
- Niên Vận Trọng Đại: Tự động tính Tuổi Mụ, Kim Lâu (dư 1/3/6/8), Hoang Ốc, Tam Tai 10 năm.
"""

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import unicodedata
from collections import Counter
from datetime import datetime
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")


def _ensure_astro_runtime() -> None:
    """Tự động chuyển sang runtime Python có sẵn iztro_py & lunar_python nếu gọi từ bare python."""
    try:
        import iztro_py  # noqa: F401
        import lunar_python  # noqa: F401
        return
    except ModuleNotFoundError:
        if os.environ.get("_DESTINY_REEXEC") == "1":
            raise
        env = os.environ.copy()
        env["_DESTINY_REEXEC"] = "1"
        py_launcher = shutil.which("py")
        if py_launcher:
            probe = subprocess.run(
                [py_launcher, "-c", "import iztro_py, lunar_python"],
                capture_output=True,
                env=env,
            )
            if probe.returncode == 0:
                res = subprocess.run([py_launcher, __file__, *sys.argv[1:]], env=env)
                sys.exit(res.returncode)
        uv_bin = shutil.which("uv")
        if uv_bin:
            res = subprocess.run([uv_bin, "run", __file__, *sys.argv[1:]], env=env)
            sys.exit(res.returncode)
        raise


_ensure_astro_runtime()

from iztro_py import astro  # noqa: E402
from iztro_py.i18n.locales.vi_VN import translations as VI_LOCALE  # noqa: E402
from lunar_python import Solar  # noqa: E402

# ==============================================================================
# 1. BẢNG DỊCH HÁN-VIỆT CHUẨN XÁC CHO BÁT TỰ (LUNAR_PYTHON) & TỬ VI (IZTRO-PY)
# ==============================================================================

GAN_MAP = {
    "甲": "Giáp", "乙": "Ất", "丙": "Bính", "丁": "Đinh", "戊": "Mậu",
    "己": "Kỷ", "庚": "Canh", "辛": "Tân", "壬": "Nhâm", "癸": "Quý",
}
ZHI_MAP = {
    "子": "Tý", "丑": "Sửu", "寅": "Dần", "卯": "Mão", "辰": "Thìn", "巳": "Tỵ",
    "午": "Ngọ", "未": "Mùi", "申": "Thân", "酉": "Dậu", "戌": "Tuất", "亥": "Hợi",
}
ZHI_ORDER = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"]
YANG_STEMS = {"Giáp", "Bính", "Mậu", "Canh", "Nhâm"}

WUXING_CHAR_MAP = {"金": "Kim", "木": "Mộc", "水": "Thủy", "火": "Hỏa", "土": "Thổ"}
GAN_WUXING = {
    "Giáp": "Mộc", "Ất": "Mộc", "Bính": "Hỏa", "Đinh": "Hỏa", "Mậu": "Thổ",
    "Kỷ": "Thổ", "Canh": "Kim", "Tân": "Kim", "Nhâm": "Thủy", "Quý": "Thủy",
}
ZHI_WUXING = {
    "Tý": "Thủy", "Sửu": "Thổ", "Dần": "Mộc", "Mão": "Mộc", "Thìn": "Thổ", "Tỵ": "Hỏa",
    "Ngọ": "Hỏa", "Mùi": "Thổ", "Thân": "Kim", "Dậu": "Kim", "Tuất": "Thổ", "Hợi": "Thủy",
}

NAYIN_MAP = {
    "海中金": "Hải Trung Kim", "炉中火": "Lộ Trung Hỏa", "大林木": "Đại Lâm Mộc",
    "路旁土": "Lộ Bàng Thổ", "剑锋金": "Kiếm Phong Kim", "山头火": "Sơn Đầu Hỏa",
    "涧下水": "Giản Hạ Thủy", "城头土": "Thành Đầu Thổ", "白蜡金": "Bạch Lạp Kim",
    "杨柳木": "Dương Liễu Mộc", "泉中水": "Tuyền Trung Thủy", "屋上土": "Ốc Thượng Thổ",
    "霹雳火": "Tích Lịch Hỏa", "松柏木": "Tùng Bách Mộc", "长流水": "Trường Lưu Thủy",
    "沙中金": "Sa Trung Kim", "山下火": "Sơn Hạ Hỏa", "平地木": "Bình Địa Mộc",
    "壁上土": "Bích Thượng Thổ", "金箔金": "Kim Bạc Kim", "覆灯火": "Phú Đăng Hỏa",
    "天河水": "Thiên Hà Thủy", "大驿土": "Đại Trạch Thổ", "钗钏金": "Thoa Xuyến Kim",
    "桑柘木": "Tang Đố Mộc", "大溪水": "Đại Khê Thủy", "沙中土": "Sa Trung Thổ",
    "天上火": "Thiên Thượng Hỏa", "石榴木": "Thạch Lựu Mộc", "大海水": "Đại Hải Thủy",
}

SHISHEN_MAP = {
    "日主": "Nhật Chủ", "日元": "Nhật Nguyên",
    "比肩": "Tỷ Kiên", "劫财": "Kiếp Tài",
    "食神": "Thực Thần", "伤官": "Thương Quan",
    "偏财": "Thiên Tài", "正财": "Chính Tài",
    "七杀": "Thất Sát", "偏官": "Thiên Quan", "正官": "Chính Quan",
    "偏印": "Thiên Ấn", "正印": "Chính Ấn",
}

DISHI_MAP = {
    "长生": "Trường Sinh", "沐浴": "Mục Dục", "冠带": "Quan Đới", "临官": "Lâm Quan",
    "帝旺": "Đế Vượng", "衰": "Suy", "病": "Bệnh", "死": "Tử",
    "墓": "Mộ", "绝": "Tuyệt", "胎": "Thai", "养": "Dưỡng",
}

JIEQI_MAP = {
    "立春": "Lập Xuân", "雨水": "Vũ Thủy", "惊蛰": "Kinh Trập", "春分": "Xuân Phân",
    "清明": "Thanh Minh", "谷雨": "Cốc Vũ", "立夏": "Lập Hạ", "小满": "Tiểu Mãn",
    "芒种": "Mang Chủng", "夏至": "Hạ Chí", "小暑": "Tiểu Thử", "大暑": "Đại Thử",
    "立秋": "Lập Thu", "处暑": "Xử Thử", "白露": "Bạch Lộ", "秋分": "Thu Phân",
    "寒露": "Hàn Lộ", "霜降": "Sương Giáng", "立冬": "Lập Đông", "小雪": "Tiểu Tuyết",
    "大雪": "Đại Tuyết", "冬至": "Đông Chí", "小寒": "Tiểu Hàn", "大寒": "Đại Hàn",
}

BRIGHTNESS_MAP = {
    "庙": "Miếu", "旺": "Vượng", "得": "Đắc", "利": "Lợi",
    "平": "Bình", "不": "Bất", "陷": "Hãm",
    "miao": "Miếu", "wang": "Vượng", "de": "Đắc", "li": "Lợi",
    "ping": "Bình", "bu": "Bất", "xian": "Hãm",
}

MUTAGEN_MAP = {
    "禄": "Hóa Lộc", "权": "Hóa Quyền", "科": "Hóa Khoa", "忌": "Hóa Kỵ",
    "Lộc": "Hóa Lộc", "Quyền": "Hóa Quyền", "Khoa": "Hóa Khoa", "Kỵ": "Hóa Kỵ",
}


def tr_ganzhi(gz: str) -> str:
    if not gz:
        return ""
    chars = list(gz.strip())
    if len(chars) == 2 and chars[0] in GAN_MAP and chars[1] in ZHI_MAP:
        return f"{GAN_MAP[chars[0]]} {ZHI_MAP[chars[1]]}"
    out = []
    for ch in chars:
        if ch in GAN_MAP:
            out.append(GAN_MAP[ch])
        elif ch in ZHI_MAP:
            out.append(ZHI_MAP[ch])
        else:
            out.append(ch)
    return " ".join(out)


def tr_wuxing_pair(wx: str) -> str:
    return "-".join(WUXING_CHAR_MAP.get(c, c) for c in wx)


def tr_iztro_key(key: str) -> str:
    if not key:
        return ""
    for group in ("palaces", "heavenlyStem", "earthlyBranch", "brightness", "fiveElementsClass", "time", "zodiac", "sign", "gender"):
        sub = VI_LOCALE.get(group, {})
        if key in sub:
            val = sub[key]
            return "Tử Tức" if val == "Tử Nữ" else val
    for sgroup in ("major", "minor"):
        sub = VI_LOCALE.get("stars", {}).get(sgroup, {})
        if key in sub:
            return sub[key]
    if key in VI_LOCALE and isinstance(VI_LOCALE[key], str):
        return VI_LOCALE[key]
    if key in BRIGHTNESS_MAP:
        return BRIGHTNESS_MAP[key]
    if key in MUTAGEN_MAP:
        return MUTAGEN_MAP[key]
    return key


# ==============================================================================
# 2. ĐỘNG CƠ THẦN SỐ HỌC SONG HỆ (PYTHAGORAS QUỐC TẾ + NHÂN SỐ HỌC PHILLIPS)
# ==============================================================================

PYTHAGORAS_MAP = {
    "A": 1, "B": 2, "C": 3, "D": 4, "E": 5, "F": 6, "G": 7, "H": 8, "I": 9,
    "J": 1, "K": 2, "L": 3, "M": 4, "N": 5, "O": 6, "P": 7, "Q": 8, "R": 9,
    "S": 1, "T": 2, "U": 3, "V": 4, "W": 5, "X": 6, "Y": 7, "Z": 8,
}
BASE_VOWELS = {"A", "E", "I", "O", "U"}
KARMIC_DEBTS = {13: "13/4", 14: "14/5", 16: "16/7", 19: "19/1"}

BIRTH_CHART_ARROWS = [
    ((1, 5, 9), "Mũi tên Quyết tâm (1-5-9)", "Mũi tên Trì hoãn / Thiếu quyết tâm (Trống 1-5-9)"),
    ((3, 5, 7), "Mũi tên Tâm linh / Nhạy bén (3-5-7)", "Mũi tên Hoài nghi / Thực chứng (Trống 3-5-7)"),
    ((1, 2, 3), "Mũi tên Kế hoạch (1-2-3)", "Mũi tên Thiếu trật tự kế hoạch (Trống 1-2-3)"),
    ((4, 5, 6), "Mũi tên Ý chí sắt đá (4-5-6)", "Mũi tên Uất giận / Dễ nản (Trống 4-5-6)"),
    ((7, 8, 9), "Mũi tên Hoạt động thực tiễn (7-8-9)", "Mũi tên Thụ động (Trống 7-8-9)"),
    ((1, 4, 7), "Mũi tên Thực tế / Thể chất (1-4-7)", "Mũi tên Thiếu thực tế (Trống 1-4-7)"),
    ((2, 5, 8), "Mũi tên Cân bằng cảm xúc (2-5-8)", "Mũi tên Nhạy cảm nội tâm (Trống 2-5-8)"),
    ((3, 6, 9), "Mũi tên Trí tuệ sáng suốt (3-6-9)", "Mũi tên Trí nhớ ngắn hạn (Trống 3-6-9)"),
]


def strip_accents(text: str) -> str:
    text = text.replace("đ", "d").replace("Đ", "D")
    norm = unicodedata.normalize("NFD", text)
    return "".join(c for c in norm if unicodedata.category(c) != "Mn")


def slugify_name(text: str) -> str:
    clean = strip_accents(text).strip()
    return re.sub(r"[^A-Za-z0-9]+", "_", clean).strip("_")


def reduce_num(n: int, keep_master: bool = True) -> int:
    while n > 9:
        if keep_master and n in (11, 22, 33):
            return n
        n = sum(int(d) for d in str(n))
    return n


def reduce_with_trace(n: int, keep_master: bool = True) -> tuple[int, list[int]]:
    trace = [n]
    cur = n
    while cur > 9:
        if keep_master and cur in (11, 22, 33):
            break
        cur = sum(int(d) for d in str(cur))
        trace.append(cur)
    return cur, trace


def detect_karmic_debt(trace: list[int]) -> str | None:
    for val in trace:
        if val in KARMIC_DEBTS:
            return KARMIC_DEBTS[val]
    return None


def is_vowel_y(word: str, idx: int) -> bool:
    """Xác định Y là nguyên âm hay phụ âm theo ngữ cảnh âm tiết chuẩn Goodwin/Decoz."""
    n = len(word)
    if n == 1:
        return True
    prev_is_vowel = (idx > 0) and (word[idx - 1] in BASE_VOWELS)
    next_is_vowel = (idx < n - 1) and (word[idx + 1] in BASE_VOWELS)
    if not prev_is_vowel and not next_is_vowel:
        return True
    if prev_is_vowel and not next_is_vowel:
        return True
    return False


def compute_numerology(full_name: str, dob_str: str, target_year: int = 2026) -> dict:
    dt = datetime.strptime(dob_str, "%Y-%m-%d")
    day, month, year = dt.day, dt.month, dt.year

    # 1. Đường Đời (3-cycle reduction chuẩn Goodwin/Decoz)
    r_day = reduce_num(day, keep_master=True)
    r_month = reduce_num(month, keep_master=True)
    r_year = reduce_num(sum(int(c) for c in str(year)), keep_master=True)
    lp_val, lp_trace = reduce_with_trace(r_day + r_month + r_year, keep_master=True)
    lp_debt = detect_karmic_debt(lp_trace) or KARMIC_DEBTS.get(day)

    # 2. Hệ Nhân Số Học David A. Phillips (Con số chủ đạo 2..11, 22/4)
    raw_all_digits = sum(int(c) for c in f"{day:02d}{month:02d}{year:04d}" if c.isdigit())
    phillips_cur = raw_all_digits
    while phillips_cur > 11 and phillips_cur != 22:
        phillips_cur = sum(int(d) for d in str(phillips_cur))
    phillips_ruling = "22/4" if phillips_cur == 22 else str(phillips_cur)

    # 3. Xử lý Họ Tên chuẩn Pythagoras
    clean_words = [w for w in strip_accents(full_name).upper().split() if w.isalpha()]
    mission_word_sums = []
    soul_word_sums = []
    pers_word_sums = []
    all_letter_vals = []
    initial_vals = []

    for w in clean_words:
        w_all, w_vow, w_con = 0, 0, 0
        initial_vals.append(PYTHAGORAS_MAP.get(w[0], 0))
        for idx, ch in enumerate(w):
            val = PYTHAGORAS_MAP.get(ch, 0)
            if not val:
                continue
            all_letter_vals.append(val)
            w_all += val
            is_vow = (ch in BASE_VOWELS) or (ch == "Y" and is_vowel_y(w, idx))
            if is_vow:
                w_vow += val
            else:
                w_con += val
        mission_word_sums.append(reduce_num(w_all, True))
        soul_word_sums.append(reduce_num(w_vow, True))
        pers_word_sums.append(reduce_num(w_con, True))

    mission_val, mission_trace = reduce_with_trace(sum(mission_word_sums), True)
    soul_val, soul_trace = reduce_with_trace(sum(soul_word_sums), True)
    pers_master, pers_trace = reduce_with_trace(sum(pers_word_sums), True)
    pers_single = reduce_num(pers_master, False)

    # Linh hồn theo trường phái Y luôn là nguyên âm (Phillips/VN đối chiếu)
    soul_y_always = 0
    for w in clean_words:
        soul_y_always += reduce_num(
            sum(PYTHAGORAS_MAP.get(ch, 0) for ch in w if ch in BASE_VOWELS or ch == "Y"),
            True,
        )
    soul_y_always_val = reduce_num(soul_y_always, True)

    # 4. Ngày sinh, Trưởng thành, Tư duy lý trí, Cân bằng, Cầu nối
    bday_val, bday_trace = reduce_with_trace(day, True)
    maturity_val, maturity_trace = reduce_with_trace(
        reduce_num(lp_val, False) + reduce_num(mission_val, False), True
    )

    first_name = clean_words[-1] if clean_words else ""
    first_name_sum = sum(PYTHAGORAS_MAP.get(ch, 0) for ch in first_name)
    rational_val, rational_trace = reduce_with_trace(
        reduce_num(first_name_sum, False) + reduce_num(day, False), True
    )
    balance_val = reduce_num(sum(initial_vals), True)

    bridge_lp_mission = abs(reduce_num(lp_val, False) - reduce_num(mission_val, False))
    bridge_soul_pers = abs(reduce_num(soul_val, False) - pers_single)

    # 5. Đam mê ẩn (Hidden Passion) & Số thiếu / Bài học nghiệp (Missing Numbers 1..9)
    counts = Counter(all_letter_vals)
    max_freq = max(counts.values()) if counts else 0
    hidden_passions = sorted([num for num, freq in counts.items() if freq == max_freq and freq >= 2])
    missing_numbers = [n for n in range(1, 10) if counts.get(n, 0) == 0]

    # 6. Năm cá nhân & 12 Tháng cá nhân
    py_target = reduce_num(
        reduce_num(day, False) + reduce_num(month, False) + reduce_num(sum(int(c) for c in str(target_year)), False),
        False,
    )
    personal_months = {m: reduce_num(py_target + reduce_num(m, False), False) for m in range(1, 13)}

    # 7. Bốn Đỉnh Kim Tự Tháp & Bốn Thách Thức
    d_s = reduce_num(day, False)
    m_s = reduce_num(month, False)
    y_s = reduce_num(sum(int(c) for c in str(year)), False)
    lp_s = reduce_num(lp_val, False)

    p1 = reduce_num(m_s + d_s, True)
    p2 = reduce_num(d_s + y_s, True)
    p3 = reduce_num(p1 + p2, True)
    p4 = reduce_num(m_s + y_s, True)

    c1 = abs(m_s - d_s)
    c2 = abs(d_s - y_s)
    c3 = abs(c1 - c2)
    c4 = abs(m_s - y_s)

    end_age_1 = 36 - lp_s
    ages = [end_age_1, end_age_1 + 9, end_age_1 + 18, end_age_1 + 27]
    years = [year + a for a in ages]

    # 8. Biểu Đồ Ngày Sinh 3x3 & Mũi Tên Sức Mạnh / Mũi Tên Trống
    dob_digits = [int(ch) for ch in f"{day}{month}{year}" if ch.isdigit() and ch != "0"]
    dob_counter = Counter(dob_digits)
    birth_grid = {n: str(n) * dob_counter.get(n, 0) if dob_counter.get(n, 0) else "—" for n in range(1, 10)}
    arrows_present = []
    arrows_empty = []
    for triplet, present_name, empty_name in BIRTH_CHART_ARROWS:
        if all(dob_counter.get(x, 0) > 0 for x in triplet):
            arrows_present.append(present_name)
        elif all(dob_counter.get(x, 0) == 0 for x in triplet):
            arrows_empty.append(empty_name)

    karmic_debts_found = []
    for label, tr in [
        ("Đường Đời", lp_trace),
        ("Sứ Mệnh", mission_trace),
        ("Linh Hồn", soul_trace),
        ("Nhân Cách", pers_trace),
        ("Ngày Sinh", [day]),
        ("Trưởng Thành", maturity_trace),
    ]:
        kd = detect_karmic_debt(tr)
        if kd:
            karmic_debts_found.append(f"{label} ({kd})")

    return {
        "duong_doi": lp_val,
        "duong_doi_trace": lp_trace,
        "phillips_chu_dao": phillips_ruling,
        "su_menh": mission_val,
        "linh_hon": soul_val,
        "linh_hon_y_nguyen_am": soul_y_always_val,
        "nhan_cach": pers_single,
        "nhan_cach_master": pers_master,
        "ngay_sinh": bday_val,
        "truong_thanh": maturity_val,
        "tu_duy_ly_tri": rational_val,
        "can_bang": balance_val,
        "cau_noi_dd_sm": bridge_lp_mission,
        "cau_noi_lh_nc": bridge_soul_pers,
        "dam_me_an": hidden_passions,
        "so_thieu_bai_hoc_nghiep": missing_numbers,
        "no_nghiep": karmic_debts_found,
        "target_year": target_year,
        "nam_ca_nhan": py_target,
        "thang_ca_nhan": personal_months,
        "pinnacles": [p1, p2, p3, p4],
        "challenges": [c1, c2, c3, c4],
        "ages": ages,
        "years": years,
        "birth_grid": birth_grid,
        "arrows_present": arrows_present,
        "arrows_empty": arrows_empty,
    }


# ==============================================================================
# 3. ĐỘNG CƠ BÁT TỰ TỨ TRỤ CHUẨN 24 TIẾT KHÍ (LUNAR_PYTHON EIGHTCHAR)
# ==============================================================================

def compute_bazi(dob_str: str, time_str: str, gender_str: str) -> dict:
    dt = datetime.strptime(f"{dob_str} {time_str}", "%Y-%m-%d %H:%M")
    solar = Solar.fromYmdHms(dt.year, dt.month, dt.day, dt.hour, dt.minute, 0)
    lunar = solar.getLunar()
    bazi = lunar.getEightChar()
    bazi.setSect(2)  # Chuẩn Tử Bình truyền thống (23:00 bước sang ngày mới / Dạ Tý)

    is_male = 1 if gender_str.strip().lower() in ("nam", "male", "m") else 0
    yun = bazi.getYun(is_male)

    pillars_raw = [
        ("Trụ Năm", bazi.getYear(), bazi.getYearWuXing(), bazi.getYearNaYin(), bazi.getYearShiShenGan(), bazi.getYearHideGan(), bazi.getYearShiShenZhi(), bazi.getYearDiShi(), bazi.getYearXunKong()),
        ("Trụ Tháng (24 Tiết Khí)", bazi.getMonth(), bazi.getMonthWuXing(), bazi.getMonthNaYin(), bazi.getMonthShiShenGan(), bazi.getMonthHideGan(), bazi.getMonthShiShenZhi(), bazi.getMonthDiShi(), bazi.getMonthXunKong()),
        ("Trụ Ngày (Nhật Chủ)", bazi.getDay(), bazi.getDayWuXing(), bazi.getDayNaYin(), bazi.getDayShiShenGan(), bazi.getDayHideGan(), bazi.getDayShiShenZhi(), bazi.getDayDiShi(), bazi.getDayXunKong()),
        ("Trụ Giờ", bazi.getTime(), bazi.getTimeWuXing(), bazi.getTimeNaYin(), bazi.getTimeShiShenGan(), bazi.getTimeHideGan(), bazi.getTimeShiShenZhi(), bazi.getTimeDiShi(), bazi.getTimeXunKong()),
    ]

    pillars = []
    element_counter = Counter({"Kim": 0, "Mộc": 0, "Thủy": 0, "Hỏa": 0, "Thổ": 0})
    for label, gz, wx, ny, ssg, hgan, ssz, dishi, xk in pillars_raw:
        gz_vi = tr_ganzhi(gz)
        gan_vi, zhi_vi = gz_vi.split()
        element_counter[GAN_WUXING[gan_vi]] += 1
        element_counter[ZHI_WUXING[zhi_vi]] += 1
        tang_can_list = []
        for hg, hz_ss in zip(hgan, ssz):
            g_v = GAN_MAP.get(hg, hg)
            ss_v = SHISHEN_MAP.get(hz_ss, hz_ss)
            tang_can_list.append(f"{g_v} ({GAN_WUXING.get(g_v, '')} - {ss_v})")
        pillars.append({
            "label": label,
            "can_chi": gz_vi,
            "can": gan_vi,
            "chi": zhi_vi,
            "ngu_hanh": tr_wuxing_pair(wx),
            "nap_am": NAYIN_MAP.get(ny, ny),
            "thap_than_can": SHISHEN_MAP.get(ssg, ssg),
            "tang_can": tang_can_list,
            "truong_sinh": DISHI_MAP.get(dishi, dishi),
            "khong_vong": tr_ganzhi(xk),
        })

    prev_jie = lunar.getPrevJie()
    next_jie = lunar.getNextJie()

    da_yun_list = []
    for dy in yun.getDaYun():
        gz = dy.getGanZhi()
        if not gz:
            continue
        gz_vi = tr_ganzhi(gz)
        g_v, z_v = gz_vi.split()
        da_yun_list.append({
            "index": dy.getIndex(),
            "tuoi": f"{dy.getStartAge()} - {dy.getEndAge()}",
            "nam": f"{dy.getStartYear()} - {dy.getEndYear()}",
            "can_chi": gz_vi,
            "ngu_hanh": f"{GAN_WUXING.get(g_v, '')}-{ZHI_WUXING.get(z_v, '')}",
        })

    lunar_month_raw = lunar.getMonth()
    is_leap_month = lunar_month_raw < 0
    lunar_date_vi = (
        f"Ngày {lunar.getDay():02d} tháng {abs(lunar_month_raw):02d}"
        f"{' (Nhuận)' if is_leap_month else ''} năm {tr_ganzhi(lunar.getYearInGanZhi())} ({lunar.getYear()})"
    )

    return {
        "lunar_date_vi": lunar_date_vi,
        "lunar_year": lunar.getYear(),
        "tu_tru_full": " — ".join(p["can_chi"] for p in pillars),
        "nhat_chu": f"{pillars[2]['can']} ({GAN_WUXING[pillars[2]['can']]})",
        "nap_am_nam": pillars[0]["nap_am"],
        "pillars": pillars,
        "thai_nguyen": f"{tr_ganzhi(bazi.getTaiYuan())} ({NAYIN_MAP.get(bazi.getTaiYuanNaYin(), bazi.getTaiYuanNaYin())})",
        "menh_cung_bazi": f"{tr_ganzhi(bazi.getMingGong())} ({NAYIN_MAP.get(bazi.getMingGongNaYin(), bazi.getMingGongNaYin())})",
        "than_cung_bazi": f"{tr_ganzhi(bazi.getShenGong())} ({NAYIN_MAP.get(bazi.getShenGongNaYin(), bazi.getShenGongNaYin())})",
        "prev_tiet_khi": f"{JIEQI_MAP.get(prev_jie.getName(), prev_jie.getName())} ({prev_jie.getSolar().toYmdHms()})",
        "next_tiet_khi": f"{JIEQI_MAP.get(next_jie.getName(), next_jie.getName())} ({next_jie.getSolar().toYmdHms()})",
        "khoi_van": f"{yun.getStartYear()} năm {yun.getStartMonth()} tháng {yun.getStartDay()} ngày (Dương lịch: {yun.getStartSolar().toYmd()})",
        "dai_van": da_yun_list[:9],
        "thong_ke_8_chu": dict(element_counter),
    }


# ==============================================================================
# 4. ĐỘNG CƠ TỬ VI ĐẨU SỐ (IZTRO-PY VI-VN) & TÁCH 3 TẦNG SAO CHỐNG ẢO GIÁC
# ==============================================================================

def hour_to_iztro_index(time_str: str) -> tuple[int, str]:
    hh, mm = map(int, time_str.split(":"))
    val = hh + mm / 60.0
    if val >= 23.0:
        return 12, "Giờ Tý muộn (23:00-23:59)"
    if val < 1.0:
        return 0, "Giờ Tý sớm (00:00-00:59)"
    names = [
        (1, 3, 1, "Giờ Sửu (01:00-02:59)"),
        (3, 5, 2, "Giờ Dần (03:00-04:59)"),
        (5, 7, 3, "Giờ Mão (05:00-06:59)"),
        (7, 9, 4, "Giờ Thìn (07:00-08:59)"),
        (9, 11, 5, "Giờ Tỵ (09:00-10:59)"),
        (11, 13, 6, "Giờ Ngọ (11:00-12:59)"),
        (13, 15, 7, "Giờ Mùi (13:00-14:59)"),
        (15, 17, 8, "Giờ Thân (15:00-16:59)"),
        (17, 19, 9, "Giờ Dậu (17:00-18:59)"),
        (19, 21, 10, "Giờ Tuất (19:00-20:59)"),
        (21, 23, 11, "Giờ Hợi (21:00-22:59)"),
    ]
    for low, high, idx, label in names:
        if low <= val < high:
            return idx, label
    return 0, "Giờ Tý"


def compute_tuvi(dob_str: str, time_str: str, gender_str: str, year_can_vi: str) -> dict:
    time_idx, time_label = hour_to_iztro_index(time_str)
    is_male = gender_str.strip().lower() in ("nam", "male", "m")
    gender_cn = "男" if is_male else "女"
    chart = astro.by_solar(dob_str, time_idx, gender_cn, True, "vi-VN")

    is_yang_year = year_can_vi in YANG_STEMS
    if is_yang_year and is_male:
        am_duong = "Dương Nam"
    elif (not is_yang_year) and is_male:
        am_duong = "Âm Nam"
    elif is_yang_year and (not is_male):
        am_duong = "Dương Nữ"
    else:
        am_duong = "Âm Nữ"

    palaces_by_chi: dict[str, dict] = {}
    menh_chi = ""
    than_chi = ""
    than_cung_name = ""
    lai_nhan_cung = ""

    for p in chart.palaces:
        p_name = tr_iztro_key(p.name)
        p_can = tr_iztro_key(p.heavenly_stem)
        p_chi = tr_iztro_key(p.earthly_branch)
        is_menh = p_name == "Mệnh"
        is_than = bool(p.is_body_palace)
        is_lai_nhan = bool(getattr(p, "is_original_palace", False)) or (p_can == year_can_vi and p_chi not in ("Tý", "Sửu"))
        if getattr(p, "is_original_palace", False):
            is_lai_nhan = True

        if is_menh:
            menh_chi = p_chi
        if is_than:
            than_chi = p_chi
            than_cung_name = p_name
        if is_lai_nhan:
            lai_nhan_cung = f"{p_name} ({p_can} {p_chi})"

        chinh_tinh = []
        for s in p.major_stars:
            s_name = tr_iztro_key(s.name)
            b_str = f" ({BRIGHTNESS_MAP.get(s.brightness, tr_iztro_key(s.brightness))})" if s.brightness else ""
            m_str = f" [{MUTAGEN_MAP.get(s.mutagen, tr_iztro_key(s.mutagen))}]" if s.mutagen else ""
            chinh_tinh.append(f"{s_name}{b_str}{m_str}")

        phu_tinh = []
        for s in p.minor_stars:
            s_name = tr_iztro_key(s.name)
            m_str = f" [{MUTAGEN_MAP.get(s.mutagen, tr_iztro_key(s.mutagen))}]" if s.mutagen else ""
            phu_tinh.append(f"{s_name}{m_str}")

        tap_tinh = [tr_iztro_key(s.name) for s in p.adjective_stars]
        dv_start, dv_end = p.decadal.range

        palaces_by_chi[p_chi] = {
            "name": p_name,
            "can": p_can,
            "chi": p_chi,
            "is_menh": is_menh,
            "is_than": is_than,
            "is_lai_nhan": is_lai_nhan,
            "chinh_tinh": chinh_tinh,
            "phu_tinh": phu_tinh,
            "tap_tinh": tap_tinh,
            "dai_van": f"{dv_start} - {dv_end}",
            "trang_sinh": tr_iztro_key(p.changsheng12),
            "bac_sy": tr_iztro_key(p.boshi12),
            "thai_tue": tr_iztro_key(p.suiqian12),
        }

    # Tính tách bạch Sao Xung Chiếu (+6), Tam Hợp (+4, +8) và Giáp Cung (-1, +1)
    for idx, chi in enumerate(ZHI_ORDER):
        if chi not in palaces_by_chi:
            continue
        opp_chi = ZHI_ORDER[(idx + 6) % 12]
        tri1_chi = ZHI_ORDER[(idx + 4) % 12]
        tri2_chi = ZHI_ORDER[(idx + 8) % 12]
        prev_chi = ZHI_ORDER[(idx - 1) % 12]
        next_chi = ZHI_ORDER[(idx + 1) % 12]

        def _fmt_ref(c_code: str) -> str:
            pal = palaces_by_chi.get(c_code, {})
            stars = pal.get("chinh_tinh", []) + pal.get("phu_tinh", [])
            s_txt = ", ".join(stars) if stars else "Vô chính diệu"
            return f"{pal.get('name', '')} ({c_code}): {s_txt}"

        palaces_by_chi[chi]["xung_chieu"] = _fmt_ref(opp_chi)
        palaces_by_chi[chi]["tam_hop"] = [_fmt_ref(tri1_chi), _fmt_ref(tri2_chi)]
        palaces_by_chi[chi]["giap_cung"] = [_fmt_ref(prev_chi), _fmt_ref(next_chi)]

    return {
        "am_duong": am_duong,
        "gio_chi_label": time_label,
        "cuc": tr_iztro_key(chart.five_elements_class),
        "chu_menh": tr_iztro_key(chart.soul),
        "chu_than": tr_iztro_key(chart.body),
        "menh_chi": menh_chi,
        "than_chi": than_chi,
        "than_cu": f"{than_cung_name} ({than_chi})",
        "lai_nhan_cung": lai_nhan_cung,
        "chinh_menh": palaces_by_chi.get(menh_chi, {}).get("chinh_tinh", []),
        "chinh_than": palaces_by_chi.get(than_chi, {}).get("chinh_tinh", []),
        "palaces": palaces_by_chi,
    }


# ==============================================================================
# 5. ĐỘNG CƠ NIÊN VẬN TRỌNG ĐẠI 10 NĂM (KIM LÂU / HOANG ỐC / TAM TAI)
# ==============================================================================

TAM_TAI_RULES = {
    "Thân": ("Dần", "Mão", "Thìn"), "Tý": ("Dần", "Mão", "Thìn"), "Thìn": ("Dần", "Mão", "Thìn"),
    "Dần": ("Thân", "Dậu", "Tuất"), "Ngọ": ("Thân", "Dậu", "Tuất"), "Tuất": ("Thân", "Dậu", "Tuất"),
    "Tỵ": ("Hợi", "Tý", "Sửu"), "Dậu": ("Hợi", "Tý", "Sửu"), "Sửu": ("Hợi", "Tý", "Sửu"),
    "Hợi": ("Tỵ", "Ngọ", "Mùi"), "Mão": ("Tỵ", "Ngọ", "Mùi"), "Mùi": ("Tỵ", "Ngọ", "Mùi"),
}

KIM_LAU_MAP = {
    1: "Phạm Kim Lâu Thân (Kỵ bản thân)",
    3: "Phạm Kim Lâu Thê (Kỵ cưới hỏi/vợ chồng)",
    6: "Phạm Kim Lâu Tử (Kỵ sinh con/con cái)",
    8: "Phạm Kim Lâu Súc (Kỵ chăn nuôi/đầu tư tài sản lớn)",
}

HOANG_OC_NAMES = [
    "Nhất Cát (Tốt — An cư thông vạn sự)",
    "Nhì Nghi (Tốt — Hưng vượng giàu sang)",
    "Tam Địa Sát (Xấu — Dễ sinh bệnh tật)",
    "Tứ Tấn Tài (Tốt — Phúc lộc vẹn toàn)",
    "Ngũ Thọ Tử (Xấu — Chia rẽ sinh ly)",
    "Lục Hoang Ốc (Xấu — Khó thành đạt)",
]


def calc_hoang_oc(tuoi_mu: int) -> str:
    tens = (tuoi_mu // 10) % 6
    if tens == 0:
        tens = 6
    units = tuoi_mu % 10
    idx = (tens + units - 1) % 6
    return HOANG_OC_NAMES[idx]


def compute_10_year_almanac(lunar_birth_year: int, birth_year_chi: str, start_year: int) -> list[dict]:
    rows = []
    gan_list = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"]
    for yr in range(start_year, start_year + 10):
        idx60 = (yr - 1984) % 60
        yr_can = gan_list[idx60 % 10]
        yr_chi = ZHI_ORDER[idx60 % 12]
        tuoi_mu = yr - lunar_birth_year + 1
        rem9 = tuoi_mu % 9
        if rem9 == 0:
            rem9 = 9
        kim_lau = KIM_LAU_MAP.get(rem9, "Không phạm Kim Lâu")
        hoang_oc = calc_hoang_oc(tuoi_mu)
        tam_tai = "Phạm Tam Tai" if yr_chi in TAM_TAI_RULES.get(birth_year_chi, ()) else "Không phạm"
        rows.append({
            "nam": yr,
            "can_chi": f"{yr_can} {yr_chi}",
            "tuoi_mu": tuoi_mu,
            "kim_lau": kim_lau,
            "hoang_oc": hoang_oc,
            "tam_tai": tam_tai,
        })
    return rows


# ==============================================================================
# 6. TRÌNH XUẤT HỒ SƠ MARKDOWN, BẢN ĐỒ HTML 12 CUNG TƯƠNG TÁC & FACTS JSON
# ==============================================================================

def write_markdown_dossier(target: Path, bundle: dict) -> None:
    p = bundle["profile"]
    b = bundle["bazi"]
    tv = bundle["tuvi"]
    t = bundle["numerology"]
    alm = bundle["almanac_10y"]

    maj_menh = ", ".join(tv["chinh_menh"]) if tv["chinh_menh"] else "Vô chính diệu"
    maj_than = ", ".join(tv["chinh_than"]) if tv["chinh_than"] else "Vô chính diệu"
    dam_me_str = ", ".join(map(str, t["dam_me_an"])) if t["dam_me_an"] else "Cân bằng (không có số lặp vượt trội)"
    so_thieu_str = ", ".join(map(str, t["so_thieu_bai_hoc_nghiep"])) if t["so_thieu_bai_hoc_nghiep"] else "Đủ 9 con số (Không khuyết)"
    no_nghiep_str = ", ".join(t["no_nghiep"]) if t["no_nghiep"] else "Không phát hiện Nợ Nghiệp (13, 14, 16, 19)"

    lines = [
        f"# HỒ SƠ KỸ THUẬT GỐC (GROUND TRUTH): {p['ho_ten'].upper()}",
        "> *Được xuất tự động từ động cơ tất định `iztro-py` (vi-VN) + `lunar_python` (24 Tiết Khí) + `Pythagoras Dual-Engine`.*",
        "",
        "## I. THẺ CĂN CƯỚC MỆNH LÝ & TỨ TRỤ BÁT TỰ (CHUẨN 24 TIẾT KHÍ)",
        f"- **Họ và tên khai sinh:** {p['ho_ten']}",
        f"- **Giới tính & Âm Dương:** {p['gioi_tinh']} (**{tv['am_duong']}**)",
        f"- **Ngày giờ sinh Dương lịch:** `{p['ngay_sinh_duong_lich']}` lúc `{p['gio_sinh_duong_lich']}` ({tv['gio_chi_label']})",
        f"- **Ngày sinh Âm lịch:** {b['lunar_date_vi']}",
        f"- **Nơi sinh:** {p.get('noi_sinh', 'Việt Nam')}",
        f"- **Tứ Trụ Bát Tự (Chuẩn Tiết Khí):** **{b['tu_tru_full']}**",
        f"- **Nhật Chủ (Can Ngày):** **{b['nhat_chu']}** | **Nạp Âm Năm Sinh:** **{b['nap_am_nam']}**",
        f"- **Mốc giao Tiết Khí liền trước:** {b['prev_tiet_khi']}",
        f"- **Mốc giao Tiết Khí liền sau:** {b['next_tiet_khi']}",
        f"- **Thai Nguyên:** {b['thai_nguyen']} | **Mệnh Cung Bát Tự:** {b['menh_cung_bazi']} | **Thân Cung Bát Tự:** {b['than_cung_bazi']}",
        f"- **Tuổi Khởi Đại Vận Bát Tự:** {b['khoi_van']}",
        f"- **Thống kê 8 chữ Ngũ Hành (chưa tính tàng can):** Kim `{b['thong_ke_8_chu']['Kim']}` | Mộc `{b['thong_ke_8_chu']['Mộc']}` | Thủy `{b['thong_ke_8_chu']['Thủy']}` | Hỏa `{b['thong_ke_8_chu']['Hỏa']}` | Thổ `{b['thong_ke_8_chu']['Thổ']}`",
        "",
        "### Bảng Chi Tiết Tứ Trụ Bát Tự",
        "| Trụ | Can Chi | Ngũ Hành | Nạp Âm | Thập Thần (Can) | Tàng Can & Thập Thần | Trường Sinh | Không Vong |",
        "| :--- | :---: | :---: | :--- | :---: | :--- | :---: | :---: |",
    ]
    for pil in b["pillars"]:
        tc = ", ".join(pil["tang_can"])
        lines.append(
            f"| **{pil['label']}** | **{pil['can_chi']}** | {pil['ngu_hanh']} | {pil['nap_am']} | {pil['thap_than_can']} | {tc} | {pil['truong_sinh']} | {pil['khong_vong']} |"
        )

    lines.extend([
        "",
        "### Lộ Trình Đại Vận Bát Tự (10 Năm / Đại Vận)",
        "| Đại Vận | Độ Tuổi | Giai Đoạn Năm | Can Chi Đại Vận | Ngũ Hành |",
        "| :---: | :---: | :---: | :---: | :---: |",
    ])
    for dy in b["dai_van"]:
        lines.append(f"| Đại Vận {dy['index']} | {dy['tuoi']} tuổi | {dy['nam']} | **{dy['can_chi']}** | {dy['ngu_hanh']} |")

    lines.extend([
        "",
        "---",
        "",
        "## II. TINH BÀN TỬ VI ĐẨU SỐ 12 CUNG (TÁCH BẠCH 3 TẦNG SAO CHỐNG ẢO GIÁC)",
        f"- **Cục số:** **{tv['cuc']}** | **Chủ Mệnh:** {tv['chu_menh']} | **Chủ Thân:** {tv['chu_than']}",
        f"- **Cung Mệnh tọa thủ tại:** **{tv['menh_chi']}** ({maj_menh})",
        f"- **Cung Thân cư tại:** **{tv['than_cu']}** ({maj_than})",
        f"- **Lai Nhân Cung (Gốc Nhân Quả Tiền Kiếp):** **{tv['lai_nhan_cung']}**",
        "",
        "### 1. Bảng Tọa Thủ Trực Tiếp Tại 12 Cung",
        "| Địa Chi | Cung Chức | Can Chi | Đại Vận | Chính Tinh Tọa Thủ (Độ Sáng & Tứ Hóa) | Phụ Tinh & Tạp Tinh Tọa Thủ | Tràng Sinh |",
        "| :---: | :--- | :---: | :---: | :--- | :--- | :---: |",
    ])
    for chi in ZHI_ORDER:
        pal = tv["palaces"].get(chi)
        if not pal:
            continue
        tags = []
        if pal["is_menh"]:
            tags.append("<MỆNH>")
        if pal["is_than"]:
            tags.append("<THÂN>")
        if pal["is_lai_nhan"]:
            tags.append("<LAI NHÂN>")
        tag_txt = (" " + " ".join(tags)) if tags else ""
        maj_txt = ", ".join(pal["chinh_tinh"]) if pal["chinh_tinh"] else "Vô chính diệu"
        min_txt = ", ".join(pal["phu_tinh"] + pal["tap_tinh"][:6])
        lines.append(
            f"| **{chi}** | {pal['name']}{tag_txt} | {pal['can']} {chi} | {pal['dai_van']} | {maj_txt} | {min_txt} | {pal['trang_sinh']} |"
        )

    lines.extend([
        "",
        "### 2. Bảng Đối Chiếu Tam Phương Tứ Chính & Giáp Cung (Cấm Gộp Vào Sao Tọa Thủ)",
        "| Cung Chức (Địa Chi) | Cung Xung Chiếu (+6) | Hai Cung Tam Hợp Hội Chiếu (+4, +8) | Hai Cung Giáp Kề (-1, +1) |",
        "| :--- | :--- | :--- | :--- |",
    ])
    for chi in ZHI_ORDER:
        pal = tv["palaces"].get(chi)
        if not pal:
            continue
        lines.append(
            f"| **{pal['name']} ({chi})** | {pal['xung_chieu']} | {' ; '.join(pal['tam_hop'])} | {' ; '.join(pal['giap_cung'])} |"
        )

    lines.extend([
        "",
        "---",
        "",
        "## III. BẢN ĐỒ THẦN SỐ HỌC SONG HỆ (PYTHAGORAS QUỐC TẾ & NHÂN SỐ HỌC PHILLIPS)",
        f"- **Số Đường Đời (Life Path — Chuẩn Goodwin/Decoz):** **{t['duong_doi']}** *(Chuỗi rút gọn: {' -> '.join(map(str, t['duong_doi_trace']))})*",
        f"- **Con Số Chủ Đạo (Đối chiếu hệ David A. Phillips):** **{t['phillips_chu_dao']}**",
        f"- **Số Sứ Mệnh (Destiny / Expression):** **{t['su_menh']}**",
        f"- **Số Linh Hồn (Soul Urge — Y theo ngữ cảnh):** **{t['linh_hon']}** *(Nếu tính Y luôn là nguyên âm: {t['linh_hon_y_nguyen_am']})*",
        f"- **Số Nhân Cách (Personality):** **{t['nhan_cach']}** *(Gốc Master: {t['nhan_cach_master']})*",
        f"- **Số Ngày Sinh (Birthday):** **{t['ngay_sinh']}** | **Số Trưởng Thành (Maturity):** **{t['truong_thanh']}**",
        f"- **Số Tư Duy Lý Trí (Rational Thinking):** **{t['tu_duy_ly_tri']}** | **Số Cân Bằng (Balance):** **{t['can_bang']}**",
        f"- **Số Cầu Nối (Đường Đời - Sứ Mệnh / Linh Hồn - Nhân Cách):** `{t['cau_noi_dd_sm']}` / `{t['cau_noi_lh_nc']}`",
        f"- **Đam Mê Ẩn (Hidden Passion):** {dam_me_str}",
        f"- **Số Thiếu / Bài Học Nghiệp (Karmic Lessons 1..9):** {so_thieu_str}",
        f"- **Cảnh Báo Nợ Nghiệp (Karmic Debt 13/14/16/19):** {no_nghiep_str}",
        f"- **Năm Cá Nhân {t['target_year']}:** **Số {t['nam_ca_nhan']}**",
        "",
        "### 1. Bốn Đỉnh Cao Kim Tự Tháp & Bốn Thách Thức Cuộc Đời",
        "| Chặng Đỉnh | Độ Tuổi | Giai Đoạn Năm | Con Số Đỉnh Cao | Con Số Thách Thức |",
        "| :---: | :---: | :---: | :---: | :---: |",
        f"| **Đỉnh 1** | Đầu đời – {t['ages'][0]} tuổi | Đến năm {t['years'][0]} | **{t['pinnacles'][0]}** | Thách thức **{t['challenges'][0]}** |",
        f"| **Đỉnh 2** | {t['ages'][0]+1} – {t['ages'][1]} tuổi | {t['years'][0]+1} – {t['years'][1]} | **{t['pinnacles'][1]}** | Thách thức **{t['challenges'][1]}** |",
        f"| **Đỉnh 3** | {t['ages'][1]+1} – {t['ages'][2]} tuổi | {t['years'][1]+1} – {t['years'][2]} | **{t['pinnacles'][2]}** | Thách thức **{t['challenges'][2]}** |",
        f"| **Đỉnh 4** | {t['ages'][2]+1} – {t['ages'][3]}+ tuổi | Từ {t['years'][2]+1} về sau | **{t['pinnacles'][3]}** | Thách thức **{t['challenges'][3]}** |",
        "",
        "### 2. Biểu Đồ Ngày Sinh 3x3 & Các Mũi Tên Cá Tính",
        f"- **Trục Trí Não (3 - 6 - 9):** `{t['birth_grid'][3]}` | `{t['birth_grid'][6]}` | `{t['birth_grid'][9]}`",
        f"- **Trục Tâm Hồn (2 - 5 - 8):** `{t['birth_grid'][2]}` | `{t['birth_grid'][5]}` | `{t['birth_grid'][8]}`",
        f"- **Trục Thể Chất (1 - 4 - 7):** `{t['birth_grid'][1]}` | `{t['birth_grid'][4]}` | `{t['birth_grid'][7]}`",
        f"- **Mũi Tên Sức Mạnh Sở Hữu:** {', '.join(t['arrows_present']) if t['arrows_present'] else 'Không tạo thành mũi tên đầy đủ'}",
        f"- **Mũi Tên Trống Cần Bù Đắp:** {', '.join(t['arrows_empty']) if t['arrows_empty'] else 'Không có mũi tên trống'}",
        "",
        "---",
        "",
        f"## IV. BẢNG TRA CỨU NIÊN VẬN TRỌNG ĐẠI 10 NĂM ({t['target_year']} – {t['target_year']+9})",
        "| Năm Dương | Can Chi Năm | Tuổi Mụ | Hạn Kim Lâu (Chia 9) | Hạn Hoang Ốc | Hạn Tam Tai |",
        "| :---: | :---: | :---: | :--- | :--- | :---: |",
    ])
    for row in alm:
        lines.append(
            f"| **{row['nam']}** | {row['can_chi']} | {row['tuoi_mu']} | {row['kim_lau']} | {row['hoang_oc']} | {row['tam_tai']} |"
        )

    target.write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_html_astrolabe(target: Path, bundle: dict) -> None:
    p = bundle["profile"]
    b = bundle["bazi"]
    tv = bundle["tuvi"]
    t = bundle["numerology"]
    pal = tv["palaces"]

    def render_cell(chi_code: str) -> str:
        item = pal.get(chi_code)
        if not item:
            return f"<div class='palace-cell'>{chi_code}</div>"
        badges = []
        if item["is_menh"]:
            badges.append("<span class='badge badge-menh'>MỆNH</span>")
        if item["is_than"]:
            badges.append("<span class='badge badge-than'>THÂN</span>")
        if item["is_lai_nhan"]:
            badges.append("<span class='badge badge-lainhan'>LAI NHÂN</span>")
        majors_html = ""
        if item["chinh_tinh"]:
            for s in item["chinh_tinh"]:
                cls = "star-major"
                if "Hóa Lộc" in s:
                    cls += " hoa-loc"
                elif "Hóa Quyền" in s:
                    cls += " hoa-quyen"
                elif "Hóa Khoa" in s:
                    cls += " hoa-khoa"
                elif "Hóa Kỵ" in s:
                    cls += " hoa-ky"
                majors_html += f"<div class='{cls}'>{s}</div>"
        else:
            majors_html = "<div class='star-vcd'>Vô chính diệu</div>"
        minors_txt = " ".join(f"<span class='star-minor'>{s}</span>" for s in (item["phu_tinh"] + item["tap_tinh"][:5]))
        return f"""
        <div class="palace-cell" id="cell-{chi_code}" onclick="selectPalace('{chi_code}')">
            <div class="palace-header">
                <span class="palace-name">{item['name']}</span>
                <span class="palace-branch">{item['can']} {item['chi']}</span>
            </div>
            <div class="palace-badges">{' '.join(badges)}</div>
            <div class="palace-majors">{majors_html}</div>
            <div class="palace-minors">{minors_txt}</div>
            <div class="palace-footer">
                <span class="palace-dv">ĐV: {item['dai_van']}</span>
                <span>{item['trang_sinh']}</span>
            </div>
        </div>"""

    bazi_rows_html = "".join(
        f"<tr><td><b>{pil['label']}</b></td><td><b>{pil['can_chi']}</b></td><td>{pil['ngu_hanh']}</td>"
        f"<td>{pil['nap_am']}</td><td>{pil['thap_than_can']}</td><td>{', '.join(pil['tang_can'])}</td>"
        f"<td>{pil['truong_sinh']}</td><td>{pil['khong_vong']}</td></tr>"
        for pil in b["pillars"]
    )

    ktt_rows_html = ""
    for i in range(4):
        age_lbl = f"Đầu đời – {t['ages'][0]} tuổi" if i == 0 else (
            f"{t['ages'][2]+1} – {t['ages'][3]}+ tuổi" if i == 3 else f"{t['ages'][i-1]+1} – {t['ages'][i]} tuổi"
        )
        yr_lbl = f"Đến {t['years'][0]}" if i == 0 else (
            f"Từ {t['years'][2]+1} về sau" if i == 3 else f"{t['years'][i-1]+1} – {t['years'][i]}"
        )
        ktt_rows_html += (
            f"<tr><td><b>Đỉnh {i+1}</b></td><td>{age_lbl}</td><td>{yr_lbl}</td>"
            f"<td class='gold-num'>{t['pinnacles'][i]}</td><td>Thách thức <b>{t['challenges'][i]}</b></td></tr>"
        )

    html = f"""<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Tinh Bàn Tử Vi - Bát Tự 24 Tiết Khí - Thần Số Học | {p['ho_ten']}</title>
<style>
:root {{
  --bg: #0b1120; --card: #162033; --border: #2c3e5a; --text: #f1f5f9;
  --muted: #94a3b8; --gold: #f59e0b; --red: #ef4444; --blue: #3b82f6; --emerald: #10b981;
}}
* {{ box-sizing: border-box; margin: 0; padding: 0; }}
body {{ font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; background: var(--bg); color: var(--text); padding: 20px; }}
.container {{ max-width: 1340px; margin: 0 auto; }}
header {{ text-align: center; margin-bottom: 20px; }}
header h1 {{ color: var(--gold); font-size: 24px; margin-bottom: 6px; }}
header p {{ color: var(--muted); font-size: 13px; }}
.astrolabe-grid {{
  display: grid; grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(4, minmax(175px, auto));
  gap: 8px; background: #050914; padding: 10px; border-radius: 14px; border: 1px solid var(--border); margin-bottom: 24px;
}}
.palace-cell {{
  background: var(--card); border: 1px solid var(--border); border-radius: 10px; padding: 8px 10px;
  display: flex; flex-direction: column; justify-content: space-between; cursor: pointer; transition: 0.2s;
}}
.palace-cell:hover, .palace-cell.active {{ border-color: var(--gold); box-shadow: 0 0 12px rgba(245,158,11,0.35); }}
.palace-header {{ display: flex; justify-content: space-between; border-bottom: 1px dashed var(--border); padding-bottom: 4px; }}
.palace-name {{ font-weight: 700; color: var(--gold); font-size: 14px; }}
.palace-branch {{ font-size: 12px; color: var(--muted); }}
.palace-badges {{ margin: 4px 0; min-height: 18px; }}
.badge {{ font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: 700; }}
.badge-menh {{ background: var(--red); color: #fff; }}
.badge-than {{ background: var(--blue); color: #fff; }}
.badge-lainhan {{ background: var(--emerald); color: #052e16; }}
.star-major {{ font-size: 13.5px; font-weight: 700; color: #fbbf24; margin-bottom: 2px; }}
.star-vcd {{ font-size: 12.5px; font-style: italic; color: #64748b; }}
.hoa-loc {{ color: #4ade80 !important; }}
.hoa-quyen {{ color: #60a5fa !important; }}
.hoa-khoa {{ color: #c084fc !important; }}
.hoa-ky {{ color: #f87171 !important; }}
.palace-minors {{ font-size: 11px; color: #cbd5e1; flex-grow: 1; margin-top: 4px; line-height: 1.45; }}
.star-minor {{ display: inline-block; margin-right: 5px; }}
.palace-footer {{ display: flex; justify-content: space-between; font-size: 11px; color: var(--muted); border-top: 1px dashed var(--border); padding-top: 4px; margin-top: 6px; }}
.palace-dv {{ color: #38bdf8; font-weight: 600; }}
.center-palace {{
  grid-column: 2 / span 2; grid-row: 2 / span 2; background: linear-gradient(145deg, #17253d, #0d1526);
  border: 2px solid var(--gold); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; justify-content: space-between;
}}
.center-title {{ font-size: 20px; font-weight: 800; color: var(--gold); text-align: center; }}
.center-sub {{ font-size: 12.5px; color: var(--muted); text-align: center; margin-top: 3px; padding-bottom: 10px; border-bottom: 1px solid var(--border); }}
.center-grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 7px 12px; font-size: 12.5px; margin: 10px 0; }}
.tsh-box {{ background: rgba(11,17,32,0.7); border: 1px solid var(--border); border-radius: 8px; padding: 10px; }}
.tsh-chips {{ display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }}
.tsh-chip {{ background: #24344d; padding: 3px 8px; border-radius: 6px; font-size: 12px; }}
.tsh-chip b, .gold-num {{ color: var(--gold); font-weight: 700; }}
.card {{ background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 18px; margin-bottom: 20px; }}
.card h2 {{ color: var(--gold); font-size: 17px; margin-bottom: 12px; border-bottom: 1px solid var(--border); padding-bottom: 6px; }}
table {{ width: 100%; border-collapse: collapse; font-size: 13px; }}
th, td {{ padding: 9px 12px; border: 1px solid var(--border); text-align: left; }}
th {{ background: #0f172a; color: var(--muted); }}
</style>
</head>
<body>
<div class="container">
  <header>
    <h1>TINH BÀN TỬ VI ĐẨU SỐ • BÁT TỰ 24 TIẾT KHÍ • THẦN SỐ HỌC</h1>
    <p>Động cơ tất định Offline: iztro-py (vi-VN) + lunar_python (EightChar) + Pythagoras Dual-Engine</p>
  </header>
  <div class="astrolabe-grid">
    {render_cell('Tỵ')}{render_cell('Ngọ')}{render_cell('Mùi')}{render_cell('Thân')}
    {render_cell('Thìn')}
    <div class="center-palace">
      <div>
        <div class="center-title">{p['ho_ten']}</div>
        <div class="center-sub">{tv['am_duong']} • Nơi sinh: {p.get('noi_sinh', 'Việt Nam')} • Nạp âm: <b>{b['nap_am_nam']}</b></div>
      </div>
      <div class="center-grid">
        <div><b>Dương lịch:</b> {p['ngay_sinh_duong_lich']} ({p['gio_sinh_duong_lich']})</div>
        <div><b>Âm lịch:</b> {b['lunar_date_vi']}</div>
        <div><b>Tứ Trụ (Tiết Khí):</b> <span class="gold-num">{b['tu_tru_full']}</span></div>
        <div><b>Nhật Chủ:</b> {b['nhat_chu']}</div>
        <div><b>Cục số:</b> <span class="gold-num">{tv['cuc']}</span></div>
        <div><b>Mệnh / Thân:</b> {tv['menh_chi']} / {tv['than_cu']}</div>
        <div><b>Chủ Mệnh / Thân:</b> {tv['chu_menh']} / {tv['chu_than']}</div>
        <div><b>Lai Nhân Cung:</b> {tv['lai_nhan_cung']}</div>
      </div>
      <div class="tsh-box">
        <div style="font-size:12px;font-weight:700;color:#38bdf8;">CHỈ SỐ THẦN SỐ HỌC CỐT LÕI</div>
        <div class="tsh-chips">
          <div class="tsh-chip">Đường Đời: <b>{t['duong_doi']}</b></div>
          <div class="tsh-chip">Chủ Đạo (Phillips): <b>{t['phillips_chu_dao']}</b></div>
          <div class="tsh-chip">Sứ Mệnh: <b>{t['su_menh']}</b></div>
          <div class="tsh-chip">Linh Hồn: <b>{t['linh_hon']}</b></div>
          <div class="tsh-chip">Nhân Cách: <b>{t['nhan_cach']}</b></div>
          <div class="tsh-chip">Trưởng Thành: <b>{t['truong_thanh']}</b></div>
          <div class="tsh-chip">Lý Trí: <b>{t['tu_duy_ly_tri']}</b></div>
          <div class="tsh-chip">Cân Bằng: <b>{t['can_bang']}</b></div>
          <div class="tsh-chip">Năm CN {t['target_year']}: <b>{t['nam_ca_nhan']}</b></div>
        </div>
      </div>
    </div>
    {render_cell('Dậu')}
    {render_cell('Mão')}{render_cell('Tuất')}
    {render_cell('Dần')}{render_cell('Sửu')}{render_cell('Tý')}{render_cell('Hợi')}
  </div>

  <div class="card">
    <h2>TỨ TRỤ BÁT TỰ CHUẨN 24 TIẾT KHÍ ({b['prev_tiet_khi']} → {b['next_tiet_khi']})</h2>
    <table>
      <thead><tr><th>Trụ</th><th>Can Chi</th><th>Ngũ Hành</th><th>Nạp Âm</th><th>Thập Thần</th><th>Tàng Can</th><th>Trường Sinh</th><th>Không Vong</th></tr></thead>
      <tbody>{bazi_rows_html}</tbody>
    </table>
  </div>

  <div class="card">
    <h2>4 ĐỈNH CAO KIM TỰ THÁP & THÁCH THỨC CUỘC ĐỜI</h2>
    <table>
      <thead><tr><th>Chặng Đỉnh</th><th>Độ Tuổi</th><th>Năm Diễn Ra</th><th>Con Số Đỉnh Cao</th><th>Thách Thức</th></tr></thead>
      <tbody>{ktt_rows_html}</tbody>
    </table>
  </div>
</div>
<script>
function selectPalace(chi) {{
  document.querySelectorAll('.palace-cell').forEach(el => el.classList.remove('active'));
  const el = document.getElementById('cell-' + chi);
  if (el) el.classList.add('active');
}}
</script>
</body>
</html>"""
    target.write_text(html, encoding="utf-8")


# ==============================================================================
# 7. GIAO DIỆN DÒNG LỆNH (CLI) HỖ TRỢ ĐƠN LẺ & HÀNG LOẠT (GIA ĐÌNH / ĐỘI NHÓM)
# ==============================================================================

def process_profile(profile: dict, out_dir: Path, target_year: int) -> dict:
    ho_ten = profile["ho_ten"].strip()
    dob = profile["ngay_sinh_duong_lich"].strip()
    tob = profile["gio_sinh_duong_lich"].strip()
    gender = profile["gioi_tinh"].strip()
    slug = profile.get("id") or slugify_name(ho_ten)

    bazi_data = compute_bazi(dob, tob, gender)
    year_can_vi = bazi_data["pillars"][0]["can"]
    year_chi_vi = bazi_data["pillars"][0]["chi"]
    tuvi_data = compute_tuvi(dob, tob, gender, year_can_vi)
    num_data = compute_numerology(ho_ten, dob, target_year=target_year)
    almanac = compute_10_year_almanac(bazi_data["lunar_year"], year_chi_vi, target_year)

    bundle = {
        "id": slug,
        "profile": {
            "ho_ten": ho_ten,
            "gioi_tinh": gender,
            "ngay_sinh_duong_lich": dob,
            "gio_sinh_duong_lich": tob,
            "noi_sinh": profile.get("noi_sinh", "Việt Nam"),
        },
        "bazi": bazi_data,
        "tuvi": tuvi_data,
        "numerology": num_data,
        "almanac_10y": almanac,
    }

    out_dir.mkdir(parents=True, exist_ok=True)
    md_path = out_dir / f"01_Ho_So_Goc_{slug}_TOOL.md"
    html_path = out_dir / f"Ban_Do_La_So_{slug}_TOOL.html"
    json_path = out_dir / f"facts_{slug}.json"

    write_markdown_dossier(md_path, bundle)
    write_html_astrolabe(html_path, bundle)
    json_path.write_text(json.dumps(bundle, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"[OK] {ho_ten} ({tuvi_data['am_duong']} | {tuvi_data['cuc']} | Bát Tự: {bazi_data['tu_tru_full']} | Đường Đời: {num_data['duong_doi']})")
    print(f"     -> MD:   {md_path}")
    print(f"     -> HTML: {html_path}")
    print(f"     -> JSON: {json_path}")
    return bundle


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Động cơ tính toán tất định Tử Vi Đẩu Số + Bát Tự 24 Tiết Khí + Thần Số Học Song Hệ"
    )
    parser.add_argument("--input", type=str, help="Đường dẫn file JSON danh sách hồ sơ đầu vào")
    parser.add_argument("--name", type=str, help="Họ và tên khai sinh đầy đủ có dấu (chế độ 1 người)")
    parser.add_argument("--dob", type=str, help="Ngày sinh Dương lịch YYYY-MM-DD (chế độ 1 người)")
    parser.add_argument("--time", type=str, default="12:00", help="Giờ sinh HH:MM 24h (mặc định 12:00)")
    parser.add_argument("--gender", type=str, default="Nam", help="Giới tính: Nam hoặc Nữ")
    parser.add_argument("--birthplace", type=str, default="Việt Nam", help="Nơi sinh")
    parser.add_argument("--output-dir", type=str, required=True, help="Thư mục xuất kết quả")
    parser.add_argument("--target-year", type=int, default=datetime.now().year, help="Năm mục tiêu tính Năm Cá Nhân & Niên Vận")
    parser.add_argument("--group-by-member", action="store_true", help="Tạo thư mục con riêng cho từng thành viên chuẩn SOP V3.0")

    args = parser.parse_args()
    out_dir = Path(args.output_dir).resolve()

    profiles = []
    if args.input:
        in_path = Path(args.input).resolve()
        profiles = json.loads(in_path.read_text(encoding="utf-8"))
        if isinstance(profiles, dict):
            profiles = [profiles]
    elif args.name and args.dob:
        profiles = [{
            "ho_ten": args.name,
            "gioi_tinh": args.gender,
            "ngay_sinh_duong_lich": args.dob,
            "gio_sinh_duong_lich": args.time,
            "noi_sinh": args.birthplace,
        }]
    else:
        parser.error("Cần truyền --input <file.json> HOẶC truyền đủ --name và --dob.")

    for prof in profiles:
        slug = prof.get("id") or slugify_name(prof["ho_ten"])
        member_out = (out_dir / slug) if args.group_by_member else out_dir
        process_profile(prof, member_out, args.target_year)

    return 0


if __name__ == "__main__":
    sys.exit(main())
