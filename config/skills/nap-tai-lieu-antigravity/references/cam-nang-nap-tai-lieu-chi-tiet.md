# Sổ Tay Training: Quy Chuẩn Nạp Tài Liệu & Tạo/Sửa Skill Trên Antigravity (Theo Bộ Não Lai Javis OS)

Tài liệu này là hướng dẫn chuẩn hóa dành cho **Người vận hành** và **AI Agent trên Antigravity** mỗi khi cần nạp tài liệu mới (PDF, Word, Excel, Sách chuyên khảo, bộ câu lệnh `.sql`, quy trình SOP, tài liệu API) vào hệ thống để AI tự động định vị trong `< 150ms`, đọc đúng đoạn dòng cần dùng và tiết kiệm tối đa Token.

---

## 1. Tổng Quan Cơ Chế Hoạt Động (Hiểu Trong 30 Giây)

Hệ thống quản lý tri thức trên Antigravity vận hành theo **Kiến trúc Chỉ mục Lai 3 Tầng (Javis Hybrid Skill Brain)**:

```
[Tài liệu gốc trên ổ đĩa (.md, .sql, scripts/*)]  <-- Nguồn sự thật duy nhất (Xóa DB không mất file)
                 │
                 ▼  (Quét Delta SHA-256 tự động qua MCP `agy-skill-hub`)
[Chỉ mục SQLite WAL + FTS5 Tiếng Việt đ/Đ + RRF Fusion] (`~/.gemini/config/agy_skill_index.db`)
                 │
     ┌───────────┴───────────┐
     ▼                       ▼
[Tầng 1: Hook Tự Động]   [Tầng 2: 4 Công Cụ MCP `agy-skill-hub`]
Đọc câu hỏi mới nhất ->   • `agy_search_skills`        : Tìm xuyên hàng ngàn file con & mục Heading
Gợi ý Top 3 Skill +       • `agy_read_skill_section`   : Chỉ cắt đúng đoạn dòng L_start..L_end cần đọc
Tọa độ dòng ngay đầu lượt • `agy_manage_skill`         : Sửa/thêm mục mới an toàn kèm backup `.bak`
                          • `agy_sync_and_audit_skills`: Cập nhật chỉ mục Delta SHA-256 & kiểm toán lỗi
```

### Những loại file nào được hệ thống tự động đánh chỉ mục sâu?

| Loại File / Thư Mục | Cách Hệ Thống Đánh Chỉ Mục | Giới Hạn Chuẩn |
| :--- | :--- | :--- |
| **`SKILL.md`** | Bìa điều phối chính + mục `## Khi nào dùng` (ưu tiên điểm cao nhất). | `description <= 150` ký tự; file `<= 256 KB`. |
| **`references/**/*.md`**, **`docs/**/*.md`** | Tự động cắt nhỏ theo từng tiêu đề `#`, `##`, `###`, `####` kèm số dòng thật `L_start..L_end`. | Mỗi file `<= 256 KB`; mỗi mục Heading nên `<= 3,000` ký tự. |
| **`references/**/*.sql`** | Đánh chỉ mục theo cụm `80` dòng kèm tiêu đề comment ở `15` dòng đầu tiên. | Mỗi file `<= 256 KB`. |
| **`scripts/*.{py,ps1,sh}`** (hoặc `cli.py`) | Đánh chỉ mục phần mô tả cách gọi lệnh (docstring & tham số đầu file). | Chỉ đặt script thực thi trong `scripts/`. |
| **Thư mục tự động bỏ qua** | `.venv`, `venv`, `node_modules`, `.git`, `__pycache__`, `dist`, `build`, `runs`, `backups`. | Không đánh chỉ mục thư viện cài đặt để tránh nhiễu. |

---

## 2. Chọn Đúng Ngăn Tủ Trước Khi Nạp Tài Liệu (3 Trường Hợp)

Trước khi nạp tài liệu, xác định ngay tài liệu thuộc trường hợp nào trong 3 trường hợp sau:

| Trường Hợp | Khi Nào Áp Dụng | Vị Trí Lưu Chuẩn |
| :--- | :--- | :--- |
| **Trường hợp A — Bổ sung vào Skill đã có** *(Khuyên dùng nhất)* | Tài liệu cùng chủ đề với 1 trong các Skill hiện có (vd: thêm mẫu SQL mới vào `viet-sql-sap-b1`, thêm công thức kịch bản vào `video-storytelling`, thêm quy định kế toán mới vào `sap-b1-beas`). | Thả thêm file `.md` / `.sql` vào `%USERPROFILE%\.gemini\config\skills\<ten-skill>\references\` và thêm 1 dòng link vào `SKILL.md`. |
| **Trường hợp B — Tạo Skill Global mới** | Mở thêm một mảng chuyên môn hoàn toàn mới muốn dùng chung cho **mọi dự án** trên máy. | Tạo thư mục mới tại `%USERPROFILE%\.gemini\config\skills\<ten-skill-moi>\`. |
| **Trường hợp C — Nạp Tài Liệu Riêng Cho 1 Dự Án** | Tài liệu đặc thù nội bộ chỉ dùng cho 1 dự án/khách hàng cụ thể, không muốn hiện ở các dự án khác. | Tạo thư mục tại `<Thu_Muc_Du_An>\.agents\skills\<ten-skill-du-an>\` (có độ ưu tiên cao nhất `authority = 1.05`). |

---

## 3. Quy Trình Chuẩn 5 Bước Nạp Tài Liệu Thô Thành Tri Thức Chuẩn Javis

### Bước 1: Tổ chức cây thư mục chuẩn cho Skill

```text
<ten-skill>/
├── SKILL.md                          # Bắt buộc: Bìa điều phối gọn + Bảng mục lục trỏ xuống references/
├── references/                       # Nơi chứa toàn bộ tài liệu chuyên sâu đã chưng cất (.md, .sql)
│   ├── 01-tong-quan-va-quy-tac.md
│   ├── 02-cong-thuc-chi-tiet.md
│   └── mau_truy_van_01.sql
├── scripts/                          # (Tùy chọn) Công cụ Python/PowerShell/Bash hỗ trợ chạy tự động
│   └── helper_tool.py
└── examples/                         # (Tùy chọn) Mẫu đầu ra chuẩn thực tế
```

> **Lưu ý mã hóa file:** Luôn lưu file `SKILL.md` ở chuẩn **`UTF-8` (không có BOM `\ufeff` đứng trước dấu `---`)** để trình đọc YAML của cả Antigravity lẫn Javis OS đều đọc chính xác 100%. Đối với file dữ liệu `.csv` xuất cho Excel mới dùng `utf-8-sig`.

---

### Bước 2: Viết Frontmatter `SKILL.md` theo đúng Luật 150 Ký Tự của Javis

1. **`name`:** Chữ thường không dấu, nối bằng dấu gạch ngang (`a-z0-9-`), trùng khớp với tên thư mục.
2. **`description`:**
   - **Bắt buộc `<= 150` ký tự** (tối ưu nhất là `110–140` ký tự) và **bọc trong dấu ngoặc kép `"..."`** (để không bị lỗi YAML khi bên trong có dấu hai chấm `:`).
   - **Cấm mở đầu bằng cụm từ sáo rỗng** như *"Kích hoạt khi..."*, *"Dùng skill này khi..."*, *"Skill này dùng để..."*, *"Use this skill when..."* — hãy nêu thẳng năng lực cốt lõi!
3. **`group`:** Tên nhóm phân loại tiếng Việt có dấu (để đồng bộ đẹp lên giao diện Javis Tomi / Enterprise).
4. **Mục `## Khi nào dùng (Triggers & Ngữ cảnh kích hoạt đầy đủ)`:** Đặt ngay đầu thân bài để chứa toàn bộ danh sách từ khóa kích hoạt tiếng Việt có dấu, không dấu, từ viết tắt và tiếng Anh.

**Mẫu `SKILL.md` chuẩn 100% để copy-paste:**

```markdown
---
name: ten-skill-chuan
description: "Tóm tắt thẳng năng lực cốt lõi của skill trong 1 câu súc tích dưới 145 ký tự, bọc ngoặc kép an toàn."
group: "Tên Nhóm Nghiệp Vụ"
---

# Tiêu Đề Chính Của Bộ Kỹ Năng

<!-- JAVIS_TRIGGER_ARCHIVE_START -->
## Khi nào dùng (Triggers & Ngữ cảnh kích hoạt đầy đủ)

> Ghi đầy đủ bối cảnh áp dụng, các tình huống thực tế và toàn bộ từ khóa gọi lệnh tại đây (không bị giới hạn ký tự).
> TRIGGERS: "từ khóa 1", "tu khoa khong dau", "english keyword", "mã nghiệp vụ", "tên bảng".
<!-- JAVIS_TRIGGER_ARCHIVE_END -->

## 1. Bảng Điều Phối Tài Liệu Chuyên Sâu (`references/`)

| Tình Huống / Yêu Cầu | Tệp Tham Chiếu Cần Đọc | Nội Dung Cốt Lõi |
| :--- | :--- | :--- |
| Tra cứu quy trình A | [`references/01-quy-trinh-a.md`](./references/01-quy-trinh-a.md) | Công thức và các bước kiểm tra A |
| Mẫu câu lệnh B | [`references/02-mau-lenh-b.sql`](./references/02-mau-lenh-b.sql) | Truy vấn đối chiếu số liệu B |

## 2. Quy Tắc Bắt Buộc Khi Thực Thi

1. Nêu ngắn gọn 3–5 nguyên tắc cốt lõi không được vi phạm.
2. Các chi tiết dài đặt hết xuống `references/` để AI nạp lười đúng đoạn qua `agy_read_skill_section`.
```

---

### Bước 3: Chưng Cất Tài Liệu Thô (PDF / Word / Sách Dài / SQL) Vào `references/`

Tuyệt đối **không** copy-paste nguyên một cuốn sách 500 trang hay file rác chưa lọc vào một file `.md` khổng lồ duy nhất. Hãy áp dụng **Quy tắc 3-Pass & Tự Đủ Ngữ Cảnh (Contextual Retrieval)**:

1. **Với Sách / PDF / Tài liệu dài (`>= 30` trang hoặc `>= 5,000` dòng — Quy tắc 3-Pass):**
   - **Pass 1 (Lập bản đồ):** Quét mục lục và chia thành từng chủ đề nhỏ (`01-...md`, `02-...md`, `03-...md`), mỗi file khoảng `100–400` dòng (`<= 50 KB`).
   - **Pass 2 (Chưng cất cuốn chiếu từng phần):** Đọc sâu từng chương `1,000–1,500` dòng và ghi ngay thành file `.md` (không tóm tắt gộp toàn bộ sách trong 1 lần gọi AI vì sẽ làm rơi rớt 30–40% công thức/số liệu quan trọng).
   - **Pass 3 (Đặt Heading tự đủ ngữ cảnh):**
     - **Nên viết:** `## 3.2. Quy Trình Xử Lý Lệch Sổ Kho (OINM) Và Sổ Cái (OJDT) Trong SAP B1` *(AI tìm "lệch sổ kho" hay "OINM OJDT" đều trúng ngay dòng này!)*.
     - **Không nên viết:** `## 3.2. Cách xử lý lỗi thường gặp` *(Tiêu đề chung chung làm giảm độ chính xác khi tìm kiếm)*.
     - Ngay dưới mỗi `## Heading`, mở đầu bằng 1–2 câu định vị rõ: mục này giải quyết bài toán gì, áp dụng khi nào, kèm cả thuật ngữ tiếng Việt và tiếng Anh.
2. **Với File Truy Vấn `.sql`:**
   - Luôn đặt 3–5 dòng comment `-- Tiêu đề nghiệp vụ + Tên các bảng chính + Từ khóa` ở ngay đầu file `.sql` để bộ máy chỉ mục ghi nhận tiêu đề chuẩn cho đoạn code.

---

### Bước 4: Cập Nhật Chỉ Mục Lai & Từ Điển Đồng Nghĩa (`agy-skill-hub`)

Sau khi thêm hoặc sửa bất kỳ file nào trong `skills/`:

1. **Đồng bộ chỉ mục Delta `SHA-256` (chỉ mất `0.2 – 2 giây`):**
   - **Cách 1 (Ngay trong khung chat Antigravity):** Bảo AI gọi công cụ MCP `agy_sync_and_audit_skills(force_rebuild=False)`.
   - **Cách 2 (Chạy lệnh CLI trên PowerShell):**
     ```powershell
     & "%LOCALAPPDATA%\Programs\Python\Python313\python.exe" "%USERPROFILE%\.gemini\config\scripts\agy_skill_engine.py"
     ```
2. **Kiểm tra báo cáo sức khỏe (`audit_report`):**
   - Đảm bảo `health_warnings` không báo lỗi `desc_warning` (vượt 150 ký tự) và không báo `broken_links` (link tới file trong `references/` bị sai đường dẫn).
   - Kiểm tra chỉ số `global_20_desc_char_budget` luôn nằm dưới trần **`4000 chars`** của Javis Router.
3. **(Tùy chọn nâng cao) Bổ sung từ đồng nghĩa chuyên ngành mới:**
   - Nếu lĩnh vực mới có các cặp từ lóng tiếng Việt $\leftrightarrow$ mã kỹ thuật tiếng Anh không chung mặt chữ (ví dụ: `"tờ khai hải quan"` $\leftrightarrow$ `"vnaccs ecus hs_code"`), thêm 1 dòng vào danh sách `CONCEPT_SYNONYMS` trong file `%USERPROFILE%\.gemini\config\scripts\agy_skill_engine.py`.

---

### Bước 5: Kiểm Thử Truy Xuất 3 Góc Độ & Đồng Bộ Lên Javis (Nếu Cần)

1. **Test thử 3 câu truy vấn thực tế** (1 câu tiếng Việt có dấu, 1 câu tiếng Việt không dấu có chữ `d/đ`, 1 câu dùng thuật ngữ tiếng Anh):
   ```powershell
   & "%LOCALAPPDATA%\Programs\Python\Python313\python.exe" "%USERPROFILE%\.gemini\config\scripts\agy_skill_engine.py" search "cau hoi khong dau can tim thu"
   ```
   - Kết quả đạt chuẩn khi Skill vừa nạp nằm trong **Top 1–2 (`score >= 0.65`)** và trỏ đúng vào file con `references/...` kèm dòng `L_start..L_end`.
2. **Quy tắc phân luồng khi muốn đồng bộ sang Javis OS (Tuyệt đối không trộn lẫn 2 hệ thống):**
   - **Nếu là Skill phục vụ Làm Phim, Video AI, Xây Kênh YouTube/TikTok/FB, Nuôi Nick, OPC cá nhân:**
     - Chỉ đồng bộ vào **Tomi Local** (`<WORKSPACE_DIR>\JavisOS\brains\Brain Default\skills` & `<WORKSPACE_DIR>\Tomi_ai_agent\brains\Brain Default\skills`) và **Server 29 Tomi (`:7777`)** (`/opt/antigravity-erp/brains_personal/Brain Default/skills`).
   - **Nếu là Skill phục vụ ERP SAP B1, Boyum Beas, Kế toán – Thuế doanh nghiệp Enterprise:**
     - Đồng bộ riêng theo luồng **Enterprise (`:7778`)** (`/opt/antigravity-erp/brains_enterprise/Brain Default/skills`) khi có yêu cầu rõ ràng.

---

## 4. Bộ 4 Mẫu Câu Lệnh (Prompt) Copy-Paste Giao Việc Nhanh Cho Antigravity

Lần sau muốn nạp tài liệu, anh chỉ cần copy 1 trong 4 mẫu câu ngắn dưới đây dán vào khung chat Antigravity:

### Mẫu 1 — Nạp 1 file hoặc 1 thư mục tài liệu mới thành Skill mới hoàn chỉnh
```text
Em đọc tài liệu tại đường dẫn: "<ĐƯỜNG_DẪN_FILE_HOẶC_THƯ_MỤC_TÀI_LIỆU>"
Hãy nạp thành bộ Skill mới tên `<ten-skill-moi>` trên Antigravity theo đúng chuẩn Bộ Não Javis (`nap-tai-lieu-antigravity`):
1. Viết `SKILL.md` với `description <= 145` ký tự chuẩn Javis, đưa toàn bộ từ khóa vào `## Khi nào dùng`.
2. Chưng cất chi tiết vào `references/*.md` (chia Heading tự đủ ngữ cảnh, giữ nguyên số liệu/công thức gốc, không làm tắt).
3. Chạy `agy_sync_and_audit_skills` cập nhật chỉ mục và test 3 câu truy vấn (có dấu, không dấu, tiếng Anh) nghiệm thu cho anh.
```

### Mẫu 2 — Bổ sung thêm tài liệu mới vào 1 Skill đã có sẵn
```text
Em đọc tài liệu mới tại: "<ĐƯỜNG_DẪN_TÀI_LIỆU_MỚI>"
Hãy bổ sung kiến thức này vào bộ skill `<ten-skill-hien-co>` (tạo file mới trong `references/` và cập nhật bảng điều phối trong `SKILL.md` qua `agy_manage_skill`), sau đó chạy `agy_sync_and_audit_skills` và test tìm kiếm lại giúp anh.
```

### Mẫu 3 — Nạp Sách dài / PDF lớn (> 50 trang) không bị rơi rớt kiến thức
```text
Em đọc cuốn tài liệu lớn tại: "<ĐƯỜNG_DẪN_FILE_PDF_HOẶC_MD_DÀI>"
Áp dụng quy trình 3-Pass chuẩn Javis:
- Bước 1: Lập mục lục chia chương trình bày thành Bảng cho anh duyệt trước.
- Bước 2: Sau khi anh chốt, chưng cất cuốn chiếu từng chương vào `references/01-...md`, `02-...md` của skill `<ten-skill>`.
- Bước 3: Đồng bộ chỉ mục `agy-skill-hub` và kiểm thử 5 câu hỏi thực chiến ở các chương khác nhau.
```

### Mẫu 4 — Kiểm tra sức khỏe toàn bộ kho Skill & Khôi phục khi sửa nhầm
```text
Em gọi `agy_sync_and_audit_skills` kiểm tra sức khỏe toàn bộ kho Skills trên máy xem có skill nào vượt trần 150 ký tự, bị lỗi YAML hay bị đứt link `references/` không và báo cáo bảng tổng hợp cho anh.
```

---

## 5. Bảng Lệnh Kỹ Thuật & Đường Dẫn Trọng Yếu (Quick Cheat Sheet)

| Thành Phần | Đường Dẫn Thực Tế Trên Máy | Công Dụng Chính |
| :--- | :--- | :--- |
| **Kho Global Skills** | `%USERPROFILE%\.gemini\config\skills\` | Chứa các bộ Skill dùng chung mọi dự án trên Antigravity. |
| **Bộ máy Chỉ mục Lai** | `%USERPROFILE%\.gemini\config\scripts\agy_skill_engine.py` | Nhân xử lý SQLite WAL + FTS5 `đ/Đ` + RRF Fusion + Kiểm toán Skill. |
| **Trạm MCP Server** | `%USERPROFILE%\.gemini\config\scripts\agy_skill_mcp_server.py` | Cung cấp 4 tools MCP `agy-skill-hub` cho Antigravity IDE. |
| **Hook Định vị Tự động** | `%USERPROFILE%\.gemini\config\scripts\auto_reanchor_hook.py` | Tự động gợi ý Top 3 Skill + File con + Số dòng đầu mỗi lượt chat. |
| **File DB Chỉ mục** | `%USERPROFILE%\.gemini\config\agy_skill_index.db` | Cơ sở dữ liệu chỉ mục phái sinh (xóa đi tự động dựng lại được 100%). |
| **Kho Backup Tự động** | `%USERPROFILE%\.gemini\config\backups\` | Lưu bản gốc `pre_javis_brain_20261028/` và các bản `.bak` mỗi khi sửa Skill. |
