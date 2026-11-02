---
name: deeptutor-cli
description: "Hệ thống AI học tập, nghiên cứu arXiv, RAG đa engine & dựng video khoa học Manim/Remotion qua DeepTutor CLI."
group: "Giáo Dục, Nghiên Cứu & Video Khoa Học"
---

# 🎓🚀 DeepTutor CLI (`HKUDS/DeepTutor` v1.7.1) — Siêu Nền Tảng AI Gia Sư, Nghiên Cứu Khoa Học & Dựng Video Khoa Học / Kỹ Thuật / Vũ Trụ

<!-- JAVIS_TRIGGER_ARCHIVE_START -->
## Khi nào dùng (Triggers & Ngữ cảnh kích hoạt đầy đủ)
- **Từ khóa Tiếng Việt (có dấu):** DeepTutor, gọi DeepTutor, làm video khoa học, làm video kỹ thuật, làm video vũ trụ, kênh khoa học vũ trụ, hoạt hình toán học Manim, mô phỏng vật lý thiên văn, dựng bài giảng Remotion, nghiên cứu bài báo arXiv, kiểm chứng công thức bài báo, giải bài toán đa tác tử, tạo đề thi tự động, tạo sách điện tử tương tác Living Book, xuất thẻ học Anki, tạo podcast tóm tắt tài liệu, kho tri thức RAG đa engine, đánh giá RAG kb eval, bộ nhớ học tập 3 tầng.
- **Từ khóa Tiếng Việt (không dấu & gõ tắt d/đ):** deeptutor, deeptutor cli, lam video khoa hoc, lam video ky thuat, lam video vu tru, kenh khoa hoc vu tru, hoat hinh manim, mo phong vat ly, dung bai giang remotion, nghien cuu arxiv, kiem chung cong thuc, giai toan deep solve, tao de thi deep question, living book, xuat anki flashcard, podcast audio overview, kho tri thuc rag, danh gia rag kb eval.
- **Từ khóa Tiếng Anh (English Triggers):** `deeptutor`, `deeptutor-cli`, `HKUDS/DeepTutor`, `math_animator`, `enable_visual_review`, `video_lesson`, `deep_solve`, `deep_question`, `deep_research`, `audio_overview`, `guided_learning`, `brainstorm`, `preprint`, `research_audit`, `research_lit`, `kb eval`, `kb eval-diff`, `Living Books`, `EduHub`, `arXiv:2604.26962`.
<!-- JAVIS_TRIGGER_ARCHIVE_END -->

---

## 🌟 1. Giải Thích Rõ: DeepTutor Là Ứng Dụng Gì & Dùng Để Làm Gì?

**DeepTutor** (`HKUDS/DeepTutor`, `v1.7.1`, `53,316+ ★`, `Apache-2.0`, công bố tại bài báo `arXiv:2604.26962v3` của **Data Intelligence Lab @ Đại học Hồng Kông - HKU**) là một **Hệ điều hành Học tập, Nghiên cứu Khoa học & Sản xuất Học liệu Đa phương thức tự hành (Agent-Native Personalized Learning & Scientific Multimodal Workspace)**. Phiên bản `v1.7.1` đã hỗ trợ **100% giao diện & giọng phản hồi Tiếng Việt (`vi`)** cùng bản cài đặt Windows/macOS/Linux.

Khi tích hợp vào **Bộ Não Lai Javis (94 Skills)**, `deeptutor-cli` giải quyết **6 bài toán thực chiến lớn**:

| STT | Ứng Dụng Thực Chiến | Capability / Công Cụ Lõi Trong `D:\DeepTutor` | Đầu Ra Thực Tế (Deliverables) |
| :--- | :--- | :--- | :--- |
| **1** | **🎬 Sản xuất Video Kênh Khoa Học, Kỹ Thuật, Vũ Trụ, Toán – Lý (3Blue1Brown / Kurzgesagt Style)** | `math_animator` (5 Agent viết code **Manim** + **Vision AI tự soi từng frame sửa lỗi đè chữ**) + `video_lesson` (tự code **Remotion `Lesson.tsx`** + **TTS thuyết minh từng câu**) | File `.mp4` minh họa công thức quỹ đạo, lỗ đen, cơ học lượng tử, giải tích, điện tử + Video bài giảng Motion Graphics khớp giọng đọc |
| **2** | **🔬 Nghiên cứu Khoa học & Kiểm toán Bài báo Quốc tế (`arXiv` / `alphaXiv`)** | `preprint` (đọc PDF arXiv tới 500 trang + trích xuất hình) + `research_audit` (đối chiếu công thức bài báo với repo code GitHub) + `research_lit` (lập ma trận tổng quan tài liệu) + `deep_research` | Báo cáo tổng quan tài liệu học thuật (Literature Review), bảng kiểm toán công thức – code thực tế, trích dẫn chuẩn xác |
| **3** | **📚 Kho Tri Thức RAG Đa Engine & Tự Chấm Điểm Chất Lượng (`RAG Benchmark`)** | 5 Engine RAG tự chọn (`LlamaIndex`, `LightRAG`, `GraphRAG`, `PageIndex`, `Obsidian`) + trình đọc PDF công thức (`MinerU`, `Docling`, `Mistral OCR`) + `deeptutor kb eval` / `eval-diff` | Kho tài liệu nội bộ tra cứu cực chuẩn công thức/bảng biểu, báo cáo đo lường chất lượng truy xuất (`Precision`, `Recall`, `MRR`, `Hit Rate`) |
| **4** | **🧮 Giải Toán/Kỹ Thuật Chuyên Sâu & Tự Động Ra Đề Thi (`STEM Solver & Exam Generator`)** | `deep_solve` (vòng lặp đa Agent: Lập kế hoạch $\rightarrow$ Giải & chạy Python kiểm chứng $\rightarrow$ Phản biện) + `deep_question` (sinh câu hỏi bám sát tài liệu kèm kiểm định độ khó) | Lời giải chi tiết từng bước (Step-by-step) đã chạy code kiểm nghiệm + Bộ đề thi trắc nghiệm/tự luận kèm đáp án |
| **5** | **📖 Sách Điện Tử Tương Tác (`Living Books`), Thẻ Nhớ `Anki` & Podcast AI (`Audio Overview`)** | `deeptutor book` (chuyển PDF/EPUB/Web thành sách tương tác đa chương + xuất `.apkg` Anki) + `audio_overview` (biên tập kịch bản và thu âm Podcast 2 người đối thoại hoặc 1 người giảng) | Sách điện tử có AI giải thích từng đoạn, bộ thẻ ôn tập Anki `.apkg`, file âm thanh Podcast `.mp3/.wav` |
| **6** | **🧠 Bộ Nhớ Học Tập 3 Tầng (`L1/L2/L3`) & Kết Nối Đa Kênh (`Partners` + `My Agents`)** | `Memory Rack` (`L1 Identity`, `L2 Episodic Timeline`, `L3 Mastery Graph` theo dõi điểm mạnh/yếu) + `Partners` (15 kênh Telegram, Discord, Zalo/Feishu, Slack...) + `My Agents` (kết nối thẳng Antigravity / Claude Code) | Trợ lý AI nhớ chính xác người dùng đã hiểu phần nào, hay sai ở đâu và trả lời tự động qua Telegram/Discord/Workspace |

---

## 🧭 2. Bản Đồ Điều Hướng Nhanh (Smart-Loading References)

Để giữ ngữ cảnh gọn nhẹ, hãy dùng `agy_read_skill_section` hoặc `read_file` mở đúng phân khu cần dùng:

| Phân Khu Tài Liệu | Đường Dẫn File Trong `skills/deeptutor-cli/` | Khi Nào Cần Đọc? |
| :--- | :--- | :--- |
| **01. 6 Ứng dụng thực chiến & Kiến trúc 11 Capabilities** | `references/01-ung-dung-thuc-chien-6-linh-vuc-va-kien-truc-deeptutor.md` | Khi cần giải thích chi tiết từng ứng dụng, cấu trúc 19 gói cài đặt (`deeptutor[rag,manim,tts...]`), Bộ nhớ `L1/L2/L3` và cơ chế kết nối Antigravity |
| **02. Quy trình làm Video Khoa học – Kỹ thuật – Vũ trụ (Manim + Remotion + 3D)** | `references/02-ung-dung-lam-video-khoa-hoc-ky-thuat-vu-tru-manim-remotion.md` | Khi làm video YouTube/TikTok ngách Khoa học, Vũ trụ, Vật lý, Toán học, Kỹ thuật hoặc phối hợp `deeptutor-cli` với `lam-phim-video-master` |
| **03. Cẩm nang lệnh CLI, NDJSON, RAG Eval & EduHub** | `references/03-cam-nang-lenh-cli-ndjson-rag-eval-va-he-sinh-thai-eduhub.md` | Khi chạy lệnh `deeptutor init`, `config apply --check`, `doctor --online`, `run --format json`, `kb eval`, `skill install`, `book`, `memory` |
| **04. Bộ 10 Prompt Mẫu Copy & Paste Thực Chiến** | `references/04-bo-prompt-mau-copy-paste-cho-moi-ung-dung-deeptutor.md` | Khi người dùng xin mẫu câu lệnh (Prompt) để gọi làm video vũ trụ/khoa học, nghiên cứu arXiv, dựng bài giảng, nạp RAG hoặc tạo sách/Podcast |
| **Script Cầu Nối & Kiểm Chứng CLI** | `scripts/deeptutor_bridge.py` | Chạy `python scripts/deeptutor_bridge.py --self-test` hoặc `build-cmd` để kiểm tra repo `D:\DeepTutor` và sinh câu lệnh CLI chuẩn xác |

---

## ⚡ 3. Quy Trình 4 Bước Thực Thi Chuẩn (`Golden Workflow`)

1. **Bước 1 — Kiểm tra trạng thái & Khởi tạo Không Tương Tác (Non-Interactive Setup):**
   - Kiểm tra cấu trúc repo tại `D:\DeepTutor` và sinh lệnh chuẩn bằng:
     ```bash
     python skills/deeptutor-cli/scripts/deeptutor_bridge.py status
     ```
   - Khi khởi tạo từ AI Agent, luôn dùng cờ `--defaults` (cấm mở wizard tương tác làm treo terminal):
     ```bash
     deeptutor init --defaults
     deeptutor doctor --online --format json
     ```
2. **Bước 2 — Chọn đúng Capability (`-C`) và Công cụ (`-t`) theo mục tiêu:**
   - **Làm hoạt hình công thức / mô phỏng vật lý – vũ trụ (Manim):** `-C math_animator --config enable_visual_review=true --config max_fix_round=4`
   - **Làm video bài giảng nhiều cảnh có giọng đọc (Remotion + TTS):** `-C video_lesson --config tts_voice=<voice>`
   - **Nghiên cứu khoa học / arXiv / kiểm toán code bài báo:** `-C deep_research` hoặc `-C chat -t web_search,paper_search,run_code`
   - **Giải bài toán / bài tập kỹ thuật phức tạp:** `-C deep_solve -k <ten_kb>`
3. **Bước 3 — Luôn thêm `--format json` khi gọi từ AI Agent:**
   - Giúp trả về luồng **NDJSON** tường minh gồm các sự kiện `delta`, `tool_call`, `tool_result`, `artifact` (đường dẫn file `.mp4`, `.pdf`, `.md` vừa xuất) và `done`.
4. **Bước 4 — Tuân thủ Quy trình 5 Chốt Chặn (`GEMINI.md`):**
   - Mọi công thức vật lý/toán học, thông số thiên văn, hoặc trích dẫn bài báo arXiv đều phải xác minh qua `preprint` / `research_lit` / `verified-source-researcher` trước khi đưa vào render video.
