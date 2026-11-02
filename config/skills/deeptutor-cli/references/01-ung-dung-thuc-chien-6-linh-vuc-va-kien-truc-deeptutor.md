# 🏛️ 01. Giải Thích Chi Tiết 6 Ứng Dụng Thực Chiến & Kiến Trúc DeepTutor (`v1.7.1`)

> **Nguồn xác thực cấp 1:**
> - `D:\DeepTutor\README.md` (Dòng L1–L980) & `D:\DeepTutor\SKILL.md` (Dòng L1–L262)
> - `D:\DeepTutor\docs-for-dev\ARCHITECTURE.md` (Dòng L1–L105) & `D:\DeepTutor\docs-for-dev\TOOLS_AND_CAPABILITIES.md` (Dòng L1–L74)
> - Bài báo gốc: *DeepTutor: Towards Agentic Personalized Tutoring* (`arXiv:2604.26962v3`, Data Intelligence Lab @ HKU).

---

## 1. Bảng Tổng Hợp 11 Capabilities Chính Thức Trong DeepTutor CLI

Mọi phiên làm việc trong DeepTutor (dù qua Web UI, CLI, REST API hay Bot Telegram/Discord) đều đi qua một cổng duy nhất là **`TurnApplicationService.execute_turn(TurnRequest)`** $\rightarrow$ điều phối bởi **`ChatOrchestrator`** tới **11 Capabilities** chuyên biệt:

| STT | Tên Capability (`-C`) | Chức Năng Cốt Lõi | Tham Số Cấu Hình (`--config key=val`) & Công Cụ Đi Kèm |
| :--- | :--- | :--- | :--- |
| **1** | `chat` *(Mặc định)* | Trò chuyện đa vòng có gắn kèm tối đa 8 công cụ tự chọn (`-t`) + truy xuất Kho tri thức (`-k`) + Bộ nhớ cá nhân hóa | Hỗ trợ `-t rag_search,web_search,paper_search,run_code,tex_diagram,page_index,generate_practice,edit_file` |
| **2** | `math_animator` | **Dựng video hoạt hình Toán – Lý – Kỹ thuật – Vũ trụ bằng Manim** qua dây chuyền 5 Agent + Vision AI tự duyệt từng khung hình | `enable_visual_review=true`, `max_fix_round=4`, `manim_quality=l\|m\|h` (`l`=480p, `m`=720p, `h`=1080p) |
| **3** | `video_lesson` | **Dựng video bài giảng Motion Graphics nhiều cảnh bằng Remotion (`Lesson.tsx`)** kèm thuyết minh TTS khớp từng câu thoại | `tts_voice=<giọng>`, tự động kiểm tra bố cục tránh tràn khung hình (`MAX_LAYOUT_ROUNDS = 2`) |
| **4** | `deep_solve` | **Giải bài toán / bài tập kỹ thuật nhiều bước** qua vòng lặp: Phân rã kế hoạch $\rightarrow$ Viết code Python giải & thử nghiệm $\rightarrow$ Kiểm chứng chéo | Kết hợp tốt với `-k <kb_name>` và `-t rag_search,run_code` |
| **5** | `deep_question` | **Tự động ra đề thi, bài tập thực hành & câu hỏi ôn tập** bám sát giáo trình/tài liệu trong Knowledge Base, có chấm độ khó & lời giải | `num_questions=5`, `difficulty=easy\|medium\|hard` |
| **6** | `deep_research` | **Nghiên cứu tổng quan học thuật chuyên sâu**: tìm kiếm đa nguồn (Web + arXiv + RAG), phân tích đa chiều và tổng hợp báo cáo có trích dẫn | Tích hợp cùng bộ công cụ nghiên cứu `preprint`, `research_audit`, `research_lit` |
| **7** | `audio_overview` | **Tạo Podcast AI (`Audio Overview` kiểu NotebookLM)** từ tài liệu/sách: tự viết kịch bản đối thoại và tổng hợp giọng nói đa nhân vật | `style=dialogue\|monologue`, `voice_a=<voice1>`, `voice_b=<voice2>` |
| **8** | `guided_learning` | **Học tương tác có hướng dẫn từng bước**: chia nhỏ chủ đề khó thành lộ trình nhiều chặng kèm bảng minh họa HTML5/GeoGebra/SVG tương tác | Hỗ trợ giao thức `visualize_Wait` nhúng mô phỏng tương tác trực tiếp |
| **9** | `brainstorm` | **Brainstorm ý tưởng nghiên cứu, đề tài khoa học hoặc kịch bản kênh** theo nhiều góc nhìn phản biện | Phù hợp khi tìm ngách nội dung mới hoặc phát triển giả thuyết nghiên cứu |
| **10** | `note_assistant` | **Trợ lý sổ tay học tập (`Notebook Assistant`)**: tóm tắt, cấu trúc hóa ghi chú và liên kết kiến thức giữa các tài liệu | Tích hợp trực tiếp với lệnh `deeptutor notebook` |
| **11** | `quiz` | **Kiểm tra nhanh kiến thức (Interactive Quiz)** và cập nhật trực tiếp vào đồ thị năng lực `L3 Mastery Graph` của người học | Tự động ghi nhận chủ đề đã vững (`mastered`) và lỗi sai thường gặp (`struggles`) |

---

## 2. Giải Thích Sâu 6 Nhóm Ứng Dụng Thực Chiến Của DeepTutor

### 🎬 Ứng dụng 1: Sản xuất Video Kênh Khoa học, Kỹ thuật, Vũ trụ, Toán – Lý
- **Điểm khác biệt hoàn toàn với AI tạo video thông thường (Sora/Veo/Runway):**
  - Các AI sinh video từ văn bản (Text-to-Video) tạo ra cảnh quay điện ảnh rất đẹp nhưng **thường viết sai chữ, sai công thức toán học và vẽ sai tỷ lệ vật lý/quỹ đạo**.
  - Ngược lại, DeepTutor tạo video bằng **Code Toán học & Đồ họa Vector chính xác 100%** thông qua 2 hệ thống:
    1. **`math_animator` (Manim Engine — cùng công nghệ làm nên kênh 3Blue1Brown):** Dây chuyền 5 Agent (`ConceptAnalysisAgent` $\rightarrow$ `ConceptDesignAgent` $\rightarrow$ `CodeGeneratorAgent` $\rightarrow$ `VisualReviewAgent` $\rightarrow$ `SummaryAgent`) tự thiết kế bố cục, viết code Python Manim, chạy thử kiểm tra tọa độ 3 vòng (`MAX_LAYOUT_ROUNDS = 3`), render video `.mp4`, rồi **dùng Vision AI chụp các khung hình ra soi xem chữ/công thức có bị đè lên hình vẽ hay tràn lề không** để tự viết lại code sửa lỗi (tối đa 4 vòng).
    2. **`video_lesson` (Remotion React Engine + TTS Narration):** Tự động biên soạn kịch bản phân cảnh, sinh mã nguồn React/Remotion (`Lesson.tsx`), kiểm tra xung đột giao diện bằng trình duyệt ngầm (`layout_check.py`), tạo giọng thuyết minh từng câu (`Edge-TTS`, `Gemini Speech`, `MiniMax`, `Xiaomi MiMo`) và xuất thành video bài giảng hoàn chỉnh.

### 🔬 Ứng dụng 2: Nghiên cứu Khoa học & Kiểm toán Bài báo Quốc tế (`Scientific Research Suite`)
- Trong `D:\DeepTutor\docs-for-dev\SCIENTIFIC_RESEARCH.md`, DeepTutor cung cấp 3 công cụ cấp cao dành riêng cho nhà nghiên cứu và người làm nội dung khoa học chuẩn xác:
  1. **`preprint(paper, action="read"|"figures")`:** Tải và đọc trực tiếp PDF gốc từ **arXiv** (hỗ trợ tài liệu dài tới **500 trang**, kiểm tra toàn vẹn bằng mã băm **SHA-256**) và trích xuất toàn bộ sơ đồ/hình ảnh trong bài báo ra thư mục workspace để đưa vào bài thuyết trình hoặc video.
  2. **`research_audit(paper, repository, focus="...")`:** Kiểm toán độc lập giữa **bài báo khoa học (arXiv PDF)** và **kho mã nguồn thực tế (GitHub Repo)** — tự động phát hiện công thức nào trong bài báo bị viết khác đi trong code, siêu tham số (hyperparameters) nào không khớp, hoặc tính năng nào bài báo tuyên bố nhưng code chưa cài đặt.
  3. **`research_lit(topic, followups=[...])`:** Quét arXiv diện rộng theo chủ đề và câu hỏi phụ để lập **Ma trận Bằng chứng Học thuật (Evidence Matrix)** phục vụ viết tổng quan tài liệu (Literature Review).

### 📚 Ứng dụng 3: Kho Tri Thức RAG Đa Engine & Tự Đánh Giá Chất Lượng (`Multi-Engine RAG + kb eval`)
- Hỗ trợ **5 kiến trúc RAG hiện đại nhất** trong cùng một giao diện:
  - `LlamaIndex` (Vector RAG tiêu chuẩn, nhanh & nhẹ)
  - `LightRAG` (Đồ thị tri thức kết hợp Vector, tốc độ cao)
  - `GraphRAG` (Đồ thị tri thức phân cụm cộng đồng sâu)
  - `PageIndex` (Chỉ mục theo trang giữ nguyên cấu trúc văn bản gốc)
  - `Obsidian` (Đồng bộ hai chiều trực tiếp với kho ghi chú Markdown Obsidian cá nhân qua `deeptutor kb sync`)
- Hỗ trợ **3 bộ bóc tách PDF học thuật phức tạp** (`MinerU`, `Docling`, `Mistral OCR`) giúp giữ nguyên công thức LaTeX và bảng biểu nhiều cột.
- Đặc biệt có bộ công cụ **`deeptutor kb eval`** và **`deeptutor kb eval-diff`**: tự động sinh bộ câu hỏi kiểm thử từ tài liệu và chấm điểm chất lượng truy xuất (`Precision`, `Recall`, `MRR`, `Hit Rate`) để so sánh xem cấu hình RAG nào trả lời chính xác nhất.

### 📖 Ứng dụng 4: Sách Điện Tử Tương Tác (`Living Books`), Thẻ Nhớ `Anki` & Podcast AI
- **`Living Books` (`deeptutor book`):** Biến bất kỳ file PDF, EPUB, tài liệu nghiên cứu hoặc trang Web nào thành một cuốn sách điện tử tương tác chia theo chương mục, có trợ lý AI giải thích ngay tại chỗ và xuất thẳng ra bộ thẻ ghi nhớ **Anki Flashcards (`.apkg`)** để ôn tập ngắt quãng (Spaced Repetition).
- **`audio_overview`:** Chuyển tài liệu khô khan thành chương trình Podcast thảo luận 2 người dẫn hoặc 1 người thuyết giảng hấp dẫn.

### 🧠 Ứng dụng 5: Bộ Nhớ Học Tập 3 Tầng (`3-Layer Memory Rack`)
- Lưu trữ hoàn toàn bằng file Markdown minh bạch (Zero-Lock-in), gồm:
  - **`L1 Identity`:** Hồ sơ trình độ, phong cách học tập, ngôn ngữ ưu tiên (ví dụ: Tiếng Việt, thích giải thích trực quan kèm ví dụ kỹ thuật).
  - **`L2 Episodic Timeline`:** Nhật ký các phiên học tập, nghiên cứu và các dự án đã thực hiện theo dòng thời gian.
  - **`L3 Mastery Graph`:** Đồ thị theo dõi những khái niệm nào người dùng đã nắm vững (`Mastered`), đang học (`Learning`), hay nhầm lẫn ở đâu (`Struggles`).

### 🤝 Ứng dụng 6: Kết Nối Đa Kênh (`Partners` 15 Nền Tảng IM) & Tích Hợp Agent Ngoài (`My Agents`)
- **`Partners`:** Cho phép gắn DeepTutor vào **15 nền tảng nhắn tin** (`Telegram`, `Discord`, `Slack`, `Feishu/Lark`, `WhatsApp`, `WeCom`, `DingTalk`, `Teams`, `Matrix`, `Mattermost`, `LINE`, `Zulip`, `Nostr`, `Twitch`, `IRC`).
- **`My Agents`:** Cho phép kết nối trực tiếp các Coding Agent bên ngoài (như **Antigravity**, **Claude Code**, **Codex**, **OpenCode**) thông qua giao thức ACP hoặc sử dụng trực tiếp `deeptutor` CLI.

---

## 3. Cấu Trúc 19 Gói Cài Đặt Mô-đun (`Modular Extras` Trong `D:\DeepTutor\setup.py`)

DeepTutor (`v1.7.1`, yêu cầu `Python >= 3.11, < 3.15`) được thiết kế dạng mô-đun giúp cài đặt nhẹ nhàng theo đúng nhu cầu:

```bash
# 1. Cài bản CLI gọn nhẹ nhất (Core CLI & API client):
pip install -e "D:\DeepTutor"

# 2. Cài thêm mô-đun làm hoạt hình khoa học Manim & giọng đọc TTS:
pip install -e "D:\DeepTutor[manim,tts]"

# 3. Cài thêm mô-đun kho tri thức RAG & đọc PDF công thức:
pip install -e "D:\DeepTutor[rag,pdf]"

# 4. Hoặc cài trọn bộ đầy đủ 100% tính năng (Full Bundle):
pip install -e "D:\DeepTutor[all]"
```
*(Ghi chú: Để render video bài giảng `video_lesson` bằng Remotion, cần cài đặt thêm `Node.js >= 18` và chạy `npm install` trong thư mục `web/remotion` của DeepTutor khi sử dụng lần đầu).*
