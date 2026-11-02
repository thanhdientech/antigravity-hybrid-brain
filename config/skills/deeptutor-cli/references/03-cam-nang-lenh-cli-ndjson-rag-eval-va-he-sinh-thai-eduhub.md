# 💻 03. Cẩm Nang Lệnh CLI, Luồng NDJSON, Đánh Giá RAG (`kb eval`) & Hệ Sinh Thái EduHub

> **Nguồn xác thực cấp 1:**
> - `D:\DeepTutor\SKILL.md` (Dòng L1–L262: Official `deeptutor-cli` Agent Playbook)
> - `D:\DeepTutor\docs-for-dev\AGENT_SETUP.md` (Dòng L1–L307: Non-interactive `init`, `config apply --check`, `doctor --online`)

---

## 1. Quy Tắc Bắt Buộc Khi AI Agent Gọi `deeptutor` CLI

1. **Cấm gọi lệnh tương tác (`Interactive Wizard`):** Khi chạy `deeptutor init`, bắt buộc truyền `--defaults` để tránh mở menu hỏi đáp làm treo tiến trình ngầm.
2. **Luôn truyền `--format json` khi cần đọc kết quả tự động:** Đầu ra sẽ ở định dạng **NDJSON** (mỗi dòng 1 đối tượng JSON) giúp dễ dàng bóc tách văn bản trả lời, kết quả gọi công cụ và đường dẫn file `.mp4` / `.pdf` xuất ra.
3. **Không ghi thông tin nhạy cảm trực tiếp lên dòng lệnh nếu dùng chung máy:** Sử dụng file biến môi trường `~/.deeptutor/.env` hoặc lệnh `deeptutor config apply --check`.

---

## 2. Nhóm Lệnh Khởi Tạo, Cấu Hình & Kiểm Tra Sức Khỏe (`Setup & Doctor`)

```bash
# 1. Khởi tạo thư mục cấu hình ~/.deeptutor không tương tác:
deeptutor init --defaults

# 2. Xem đường dẫn và trạng thái cấu hình hiện tại:
deeptutor config path
deeptutor config show --format json

# 3. Thiết lập ngôn ngữ giao diện và ngôn ngữ trả lời mặc định sang Tiếng Việt (vi):
deeptutor config set UI_LANGUAGE=vi
deeptutor config set REPLY_LANGUAGE=vi

# 4. Kiểm tra và áp dụng cấu hình LLM / TTS / Search kèm test kết nối (--check):
deeptutor config apply --set LLM_MODEL=gpt-4o --set LLM_BINDING_HOST=https://api.openai.com/v1 --check --format json

# 5. Chẩn đoán toàn diện hệ thống & kết nối API trực tuyến:
deeptutor doctor --online --format json
```

---

## 3. Nhóm Lệnh Chạy Tác Vụ Chính (`deeptutor run` — 11 Capabilities & 8 Tools)

### Cú pháp tổng quát:
```bash
deeptutor run "<yêu_cầu_của_bạn>" \
  -C <capability> \
  -t <tool_1,tool_2> \
  -k <ten_knowledge_base> \
  -s <session_id_de_tiep_tuc_hoi_thoai> \
  --config <key=value> \
  --format json
```

### Danh sách 8 Công cụ Bật/Tắt (`-t` / `--tools`):
- `rag_search`: Tìm kiếm ngữ nghĩa và đồ thị trong Kho tri thức (`-k`)
- `web_search`: Tìm kiếm thông tin thời gian thực trên Internet
- `paper_search`: Tìm kiếm bài báo khoa học trên **arXiv / Semantic Scholar / PubMed**
- `run_code`: Chạy mã Python trong môi trường cô lập để tính toán số liệu và vẽ biểu đồ
- `tex_diagram`: Vẽ sơ đồ kỹ thuật / hình học chính xác bằng TikZ / LaTeX
- `page_index`: Đọc chính xác theo số trang tài liệu dài
- `generate_practice`: Tạo bài tập thực hành tương tác ngay trong cuộc trò chuyện
- `edit_file`: Chỉnh sửa trực tiếp tài liệu/ghi chú trong không gian làm việc

### Cấu trúc luồng sự kiện NDJSON trả về khi dùng `--format json`:
- `{"type": "session", "session_id": "..."}`: Mã phiên làm việc (dùng lại với `-s <session_id>` để hỏi tiếp).
- `{"type": "delta", "content": "..."}`: Từng phần văn bản phản hồi.
- `{"type": "tool_call", "name": "...", "args": {...}}`: Thông báo Agent đang gọi công cụ nào.
- `{"type": "tool_result", "name": "...", "output": "..."}`: Kết quả trả về từ công cụ.
- `{"type": "artifact", "kind": "video|pdf|image|markdown", "path": "..."}`: Đường dẫn tuyệt đối tới file thành phẩm (`.mp4`, `.pdf`, `.apkg`...).
- `{"type": "done", "status": "completed"}`: Kết thúc phiên thực thi.

---

## 4. Nhóm Lệnh Quản Trị Kho Tri Thức Đa Engine & Chấm Điểm RAG (`deeptutor kb`)

```bash
# 1. Liệt kê toàn bộ các Knowledge Base hiện có:
deeptutor kb list --format json

# 2. Tạo Kho tri thức mới (chọn engine: llamaindex | lightrag | graphrag | pageindex | obsidian):
deeptutor kb create vu_tru_hoc_kb --pipeline lightrag /duong/dan/thu_muc_pdf/

# 3. Thêm tài liệu PDF / Markdown mới vào KB đã có:
deeptutor kb add vu_tru_hoc_kb /duong/dan/tai_lieu_moi.pdf

# 4. Truy vấn thử nghiệm trực tiếp trong KB:
deeptutor kb search vu_tru_hoc_kb "Bán kính chân trời sự kiện Schwarzschild" --format json

# 5. ĐỒNG BỘ 2 CHIỀU VỚI KHO GHI CHÚ OBSIDIAN:
deeptutor kb sync vu_tru_hoc_kb --vault "D:/ObsidianVault/KhoaHocVuTru"

# 6. ĐÁNH GIÁ CHẤT LƯỢNG RAG TỰ ĐỘNG (Tự sinh câu hỏi kiểm thử & đo Precision/Recall/MRR):
deeptutor kb eval vu_tru_hoc_kb --generate 20 --output eval_lightrag.json
deeptutor kb eval-diff eval_llamaindex.json eval_lightrag.json
```

---

## 5. Nhóm Lệnh Sách Tương Tác (`book`), Bộ Nhớ (`memory`), Kỹ Năng (`skill`) & Đa Kênh (`partner`)

```bash
# 1. Tạo Sách điện tử tương tác (Living Book) từ PDF/EPUB/URL & xuất thẻ nhớ Anki (.apkg):
deeptutor book create "Co_Hoc_Quy_Dao_Vu_Tru" --source /path/to/orbital_mechanics.pdf
deeptutor book export-anki "Co_Hoc_Quy_Dao_Vu_Tru" --output orbital_flashcards.apkg

# 2. Quản lý Sổ tay nghiên cứu (Notebooks) & Bộ nhớ học tập 3 tầng (L1/L2/L3):
deeptutor notebook list --format json
deeptutor memory show --layer all --format json

# 3. Tìm kiếm & cài đặt thêm Skill mở rộng từ chợ học thuật EduHub / ClawHub:
deeptutor skill search "astronomy" --hub eduhub
deeptutor skill install <skill_slug>

# 4. Quản lý kết nối Bot đa kênh (Telegram, Discord, Slack, Feishu...):
deeptutor partner list
deeptutor partner start telegram
```
