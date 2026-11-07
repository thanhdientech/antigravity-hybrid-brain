---
name: nap-tai-lieu-antigravity
description: "Quy chuẩn 5 bước nạp tài liệu mới (PDF, Word, Sách, SQL) & tạo/sửa Skill chuẩn Bộ Não Lai Javis (agy-skill-hub)."
group: "Kiểm Toán & Điều Phối AI"
---

# Quy Chuẩn Nạp Tài Liệu & Tạo/Sửa Skill Trên Antigravity (`agy-skill-hub`)

<!-- JAVIS_TRIGGER_ARCHIVE_START -->
## Khi nào dùng (Triggers & Ngữ cảnh kích hoạt đầy đủ)

> Quy trình chuẩn hóa dành cho AI Agent mỗi khi người dùng yêu cầu nạp tài liệu mới (PDF, DOCX, XLSX, Markdown, Sách, bộ câu lệnh SQL, tài liệu API, SOP nội bộ) vào Antigravity, tạo mới một bộ Skill, bổ sung thêm tài liệu vào `references/` của Skill đã có, chuẩn hóa `description <= 150` ký tự hoặc cập nhật chỉ mục `agy-skill-hub`.
> TRIGGERS: "nạp tài liệu", "nap tai lieu", "thêm tài liệu", "them tai lieu", "đưa tài liệu vào antigravity", "tạo skill mới", "tao skill moi", "sửa skill", "cập nhật skill", "training skill", "ingest source", "ingest tài liệu", "đánh chỉ mục skill", "agy-skill-hub".
<!-- JAVIS_TRIGGER_ARCHIVE_END -->

## 1. Bảng Điều Phối Tài Liệu Chuyên Sâu (`references/`)

| Hạng Mục Thực Thi | Tệp Tham Chiếu Chi Tiết | Nội Dung Cốt Lõi |
| :--- | :--- | :--- |
| **Toàn văn Sổ Tay Training 5 Bước** | [`references/cam-nang-nap-tai-lieu-chi-tiet.md`](./references/cam-nang-nap-tai-lieu-chi-tiet.md) | Phân loại 3 ngăn lưu trữ, Luật 150 ký tự, Quy tắc 3-Pass cho sách dài, 4 mẫu Prompt & Lệnh CLI. |

---

## 2. Checklist Bắt Buộc 5 Bước Cho AI Khi Người Dùng Giao Nạp Tài Liệu

1. **Bước 1 — Chọn đúng vị trí lưu (3 Ngăn):**
   - Cùng chủ đề với Skill đã có $\rightarrow$ Bổ sung file `.md` / `.sql` vào `~/.gemini/config/skills/<slug>/references/` và cập nhật bảng điều phối trong `SKILL.md` qua `agy_manage_skill`.
   - Mảng chuyên môn mới dùng chung mọi dự án $\rightarrow$ Tạo `~/.gemini/config/skills/<slug-moi>/`.
   - Tài liệu riêng cho 1 dự án $\rightarrow$ Tạo `<Workspace>/.agents/skills/<slug-du-an>/`.
2. **Bước 2 — Tuân thủ Luật Frontmatter Javis (`SKILL_DESC_MAX = 150`):**
   - Lưu `SKILL.md` chuẩn `UTF-8` sạch (không để BOM `\ufeff` trước `---`).
   - `description` bắt buộc **`<= 145` ký tự**, bọc trong ngoặc kép `"..."`, nêu thẳng năng lực cốt lõi, **cấm** mở đầu bằng cụm sáo rỗng (*"Kích hoạt khi..."*, *"Use this skill when..."*).
   - Đưa toàn bộ mô tả chi tiết & danh sách từ khóa Việt có dấu / không dấu / tiếng Anh vào mục `## Khi nào dùng`.
3. **Bước 3 — Chưng cất tài liệu dài theo Quy tắc 3-Pass & Heading Tự Đủ Ngữ Cảnh:**
   - Cấm gộp nguyên cuốn sách dài thành 1 lần tóm tắt làm rơi rớt 30–40% số liệu/công thức; phải chia cuốn chiếu từng phần `1,000–1,500` dòng thành các file `references/01-...md`, `02-...md` (`<= 256 KB`/file).
   - Mỗi `## Heading` phải viết rõ tên nghiệp vụ + thuật ngữ song ngữ (không đặt tiêu đề chung chung như *"Lưu ý"* hay *"Xử lý lỗi"*), mỗi mục dài không quá `3,000` ký tự để bộ cắt đoạn `line_start..line_end` hoạt động chuẩn xác nhất.
   - Với file `.sql`, luôn có 3–5 dòng comment `-- Tiêu đề nghiệp vụ & Tên bảng` ở đầu file.
4. **Bước 4 — Đồng bộ Chỉ mục Lai & Kiểm toán Sức khỏe (`Exit code 0`):**
   - Gọi công cụ MCP `agy_sync_and_audit_skills(force_rebuild=False)` từ server `agy-skill-hub`.
   - Kiểm tra `health_warnings` đảm bảo `0` lỗi YAML, `0` lỗi vượt 150 ký tự, `0` lỗi đứt link `references/`, và tổng ngân sách Global nằm gọn trong trần `4,000` ký tự.
5. **Bước 5 — Nghiệm thu Truy xuất Thực tế & Phân luồng Đồng bộ Javis (Nếu được yêu cầu):**
   - Gọi `agy_search_skills` test tối thiểu **3 câu truy vấn** (Tiếng Việt có dấu, Tiếng Việt không dấu có chữ `d/đ`, và Tiếng Anh) để xác nhận Skill/File mới lên Top 1–2 kèm đúng dòng `L_start..L_end`.
   - Nếu đồng bộ sang Javis OS: giữ kỷ luật **cách ly tuyệt đối** giữa **Tomi (`:7777` — `brains_dien`)** và **InfoAsia (`:7778` — `brains_infoasia`)**.
