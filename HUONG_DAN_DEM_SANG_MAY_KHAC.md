# 📦 HƯỚNG DẪN ĐEM TRỌN BỘ ANTIGRAVITY 5 CHỐT CHẶN + BỘ NÃO LAI JAVIS + 35 GLOBAL SKILLS & 12 PLUGINS (94 SKILLS) SANG MÁY KHÁC

Gói này đã đóng gói đồng bộ **100% phiên bản nâng cấp mới nhất**:
1. **Luật Vận Hành Toàn Cục 5 Chốt Chặn & Quy Tắc Bước 0 Blueprint-First (18 Ngành — Chuẩn Nguồn 3 Tầng Sạch):** `GEMINI.md` & `QUY_TRINH_CHUNG_5_CHOT_CHAN_CHONG_AO_GIAC_AI.md`.
   - 📌 **Ghi chú quan trọng (`Blueprint-First Rule`):** Mỗi khi **tạo một Project mới** hoặc **làm một Chức năng / Phân hệ lớn mới**, luôn gọi **`project-blueprint-architect` đầu tiên** để AI phỏng vấn gỡ điểm mù (`Grill-Me`) và chốt ra **1 file Master Blueprint duy nhất (`BLUEPRINT_<TEN_DU_AN>.md`)** ánh xạ rõ công nghệ & đúng tên Skill trong 94 Skills trước khi thực thi.
2. **Sổ Tay Prompt Mẫu Gọi Chuẩn Toàn Bộ 94 Skills:** `SO_TAY_PROMPT_MAU_GOI_TOAN_BO_SKILL_AGENT.md` (Copy & Paste dùng ngay cho mọi ngành: Lập Blueprint, UI/UX, Web/LP, Logo/Báo giá PDF, SEO/Ads, Bảo mật/REA, Làm Phim/Video Khoa học Vũ trụ `deeptutor-cli`/Recordly/Shopee, ERP SAP B1/SQL, Tử Vi/Bát Tự, Y Sinh Quốc tế).
3. **Bộ Não Lai Javis Hybrid Skill Brain v2 & Công Cụ Check Update Git (`config/scripts/`):**
   - `agy_skill_engine.py`: Động cơ chỉ mục lai SQLite WAL + FTS5 tiếng Việt không dấu `đ/Đ` (`contentless_delete=1`) + Reciprocal Rank Fusion (RRF) + Từ điển đồng nghĩa Việt–Anh (tốc độ tìm kiếm `6–56ms`, re-index Delta SHA-256 `~210–420ms`).
   - `agy_skill_mcp_server.py`: Trạm MCP `agy-skill-hub` cung cấp 4 công cụ (`agy_search_skills`, `agy_read_skill_section`, `agy_manage_skill`, `agy_sync_and_audit_skills`) giúp AI nạp lười đúng đoạn dòng `L_start..L_end`, tiết kiệm `70–85%` Token.
   - `auto_reanchor_hook.py`: PreInvocation Lifecycle Hook chống trôi ngữ cảnh (`Anti-Context Drift`) & gợi ý tự động Top 3 Skill ngay đầu lượt.
   - `setup_portable_antigravity.py`: Trình tự động nhận diện Python trên máy mới, đăng ký MCP `agy-skill-hub` + Hook vào `mcp_config.json` / `hooks.json` (không hardcode đường dẫn máy cũ) và dựng mới chỉ mục `agy_skill_index.db`.
   - `check_skill_git_updates.py` & `skill_upstreams.json`: Công cụ kiểm tra bản cập nhật mới từ 31 kho GitHub gốc ở chế độ Read-Only 100% an toàn.
4. **Sổ Tay Nạp Tài Liệu Mới Chuẩn 5 Bước:** `HUONG_DAN_NAP_TAI_LIEU_VA_SKILL_ANTIGRAVITY.md`.
5. **Trọn Bộ 35 Global Skills** (đã chuẩn hóa `description <= 150` ký tự nằm gọn trong trần Javis Router Budget `3,989 / 4,000` ký tự) & **12 Bộ Plugins Mở Rộng (50 Plugin Skills + 9 Builtin = 94 Skills)**.

---

## 1. Cấu Trúc Thư Mục Gói Đem Sang Máy Khác

```text
GOI_DEM_SANG_MAY_KHAC_ANTIGRAVITY/
├── 📄 README.md                                        <-- Tài liệu tổng quan kiến trúc & danh mục 35 Global Skills + 12 Plugins
├── 📕 SO_TAY_PROMPT_MAU_GOI_TOAN_BO_SKILL_AGENT.md     <-- Sổ tay Prompt mẫu Copy & Paste gọi chuẩn toàn bộ 94 Skills (có Bước 0 Blueprint)
├── 🛡️ .gitignore                                       <-- Lá chắn bảo mật chặn lộ mật khẩu DB / Token khi đẩy lên Git
├── 🚀 CAI_DAT_1_CLICK_WINDOWS.bat                      <-- Bước 1: Chép toàn bộ Config, Scripts, 35 Skills, 12 Plugins & đăng ký MCP/Hook
├── 🐍 CAI_THU_VIEN_PYTHON_CHO_SKILLS.bat               <-- Bước 2: Cài thư viện Python (mcp, pyyaml, playwright...) & dựng chỉ mục FTS5
├── 📖 QUY_TRINH_CHUNG_5_CHOT_CHAN_CHONG_AO_GIAC_AI.md  <-- Sổ tay 5 Chốt Chặn Chống Ảo Giác AI (18 Ngành) & Quy tắc Bước 0 Blueprint
├── 📘 HUONG_DAN_NAP_TAI_LIEU_VA_SKILL_ANTIGRAVITY.md   <-- Sổ tay 5 bước nạp PDF/Word/Sách/SQL thành Skill chuẩn Javis
├── 📄 HUONG_DAN_DEM_SANG_MAY_KHAC.md                   <-- File hướng dẫn di chuyển máy này
└── 📂 config/
    ├── ⚙️ GEMINI.md                                    <-- Luật Toàn Cục đồng bộ 5 Chốt Chặn, Bước 0 Blueprint & Chuẩn Nguồn 3 Tầng
    ├── 📖 QUY_TRINH_CHUNG_5_CHOT_CHAN_CHONG_AO_GIAC_AI.md
    ├── 📘 HUONG_DAN_NAP_TAI_LIEU_VA_SKILL_ANTIGRAVITY.md
    ├── 📕 SO_TAY_PROMPT_MAU_GOI_TOAN_BO_SKILL_AGENT.md
    ├── 🧠 learned_patterns.md                          <-- Kho bài học kinh nghiệm thực chiến
    ├── 📂 docs/
    │   └── ui_ux_taste_profile.md                      <-- Hồ sơ thẩm mỹ UI/UX cho lean-teamwork
    ├── 📂 scripts/                                     <-- Bộ Não Lai Javis Hybrid Skill Brain v2 & Git Update Checker
    │   ├── agy_skill_engine.py
    │   ├── agy_skill_mcp_server.py
    │   ├── auto_reanchor_hook.py
    │   ├── setup_portable_antigravity.py
    │   ├── check_skill_git_updates.py
    │   └── skill_upstreams.json
    ├── 📂 plugins/                                     <-- 12 Bộ Plugins (Science 40 Skills, Google Docs/Drive/Sheets/Slides, Android CLI, Noti v4...)
    └── 📂 skills/                                      <-- Trọn bộ 35 Global Skills cốt lõi (có project-blueprint-architect, webapp-app-ux-workflow, ui-ux-cro-auditor, deeptutor-cli & reverse-engineer-anything)
```

---

## 2. Hai Cách Cài Đặt Trên Máy Mới

### ✅ Cách 1: Tự Động 1-Click Trên Windows (Khuyên dùng)
1. Cài sẵn **Python 3.11+** (khuyên dùng Python 3.11–3.13 để hỗ trợ SQLite `contentless_delete=1` siêu tốc) và **Node.js 20+** (cho `security-audit`, `reverse-engineer-anything`, `kinetic-reel`, `painted-animation`, `html-to-webcake`).
2. Nhấp đúp chạy **`CAI_DAT_1_CLICK_WINDOWS.bat`**:
   - Tự động chép toàn bộ `GEMINI.md`, Sổ tay Prompt 94 Skills, `scripts\`, **35 Global Skills**, **12 Plugins** vào `%USERPROFILE%\.gemini\config\`.
   - Tự động gọi `setup_portable_antigravity.py` để đăng ký MCP `agy-skill-hub` và `PreInvocation Hook` theo đúng đường dẫn Python của máy mới.
3. Nhấp đúp chạy tiếp **`CAI_THU_VIEN_PYTHON_CHO_SKILLS.bat`**:
   - Tự động cài `mcp`, `pyyaml`, `aiohttp`, `websockets`, `beautifulsoup4`, `requests`, `playwright`, `pyodbc`, `pymssql`, `reportlab`, `pydantic`, `rich`, `iztro-py`, `lunar_python`...
   - Tự động quét và dựng mới chỉ mục `agy_skill_index.db` ngay trên máy đích.
4. Khởi động lại **Antigravity IDE** hoặc **Antigravity CLI (`agy`)** để kích hoạt toàn bộ 94 Skills.

### ✅ Cách 2: Cài Đặt Trên macOS / Linux (Hoặc Qua Git Clone)
```bash
mkdir -p ~/.gemini/config
cp -R config/* ~/.gemini/config/
python3 -m pip install -r ~/.gemini/config/skills/requirements.txt
python3 -m playwright install chromium
python3 ~/.gemini/config/scripts/setup_portable_antigravity.py
python3 ~/.gemini/config/scripts/check_skill_git_updates.py
```
