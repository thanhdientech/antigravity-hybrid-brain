# 🎬🚀 02. Quy Trình Sản Xuất Video Kênh Khoa Học – Kỹ Thuật – Vũ Trụ Bằng DeepTutor + Hệ Sinh Thái Video AI

> **Nguồn xác thực cấp 1:**
> - `D:\DeepTutor\deeptutor\agents\math_animator\pipeline.py` (Dòng L1–L120: 5-Agent Manim Pipeline & Vision Frame Repair)
> - `D:\DeepTutor\deeptutor\agents\video_lesson\capability.py` (Dòng L1–L130: Remotion Video Lesson + TTS Narration)
> - `D:\DeepTutor\docs-for-dev\SCIENTIFIC_RESEARCH.md` (Dòng L1–L101: `preprint`, `research_audit`, `research_lit`)

---

## 1. Tại Sao Kênh Khoa Học – Kỹ Thuật – Vũ Trụ Cần Kết Hợp `deeptutor-cli`?

Một video Khoa học – Kỹ thuật – Vũ trụ đạt chuẩn triệu view (như phong cách **3Blue1Brown**, **Veritasium**, **Kurzgesagt**, **Cleo Abram**) luôn gồm **3 lớp hình ảnh**:

| Lớp Hình Ảnh Trong Video Khoa Học | Công Cụ Đảm Nhiệm Trong Bộ Não Lai Antigravity | Giải Quyết Bài Toán Gì? |
| :--- | :--- | :--- |
| **Lớp 1: Chứng minh Công thức, Đồ thị, Vector, Quỹ đạo & Cơ chế Vật lý chính xác 100%** | **`deeptutor-cli` (`-C math_animator`)** *(Manim + Vision AI Review)* | Viết công thức LaTeX chuẩn từng ký hiệu ($\Delta v$, phương trình trường Einstein, chuyển đổi quỹ đạo Hohmann, biến đổi Fourier), vẽ trục tọa độ 2D/3D, sóng điện từ, trường hấp dẫn không bao giờ bị sai chữ hay méo hình. |
| **Lớp 2: Slide Bài giảng Motion Graphics, Infographic Số liệu & Giải thích Quy trình Kỹ thuật** | **`deeptutor-cli` (`-C video_lesson`)** *(Remotion `Lesson.tsx` + TTS Narration)* | Dựng chuỗi phân cảnh giải thích cấu trúc động cơ tên lửa, sơ đồ khối vi mạch, so sánh thông số kỹ thuật kèm giọng thuyết minh khớp từng câu thoại. |
| **Lớp 3: Cảnh quay Điện ảnh Vũ trụ 3D Siêu thực (B-Roll Đại cảnh)** | **`lam-phim-video-master` + `cinematic-video-prompt`** *(Veo 3 / Seedance 2.0 / Kling)* | Tạo đại cảnh tàu vũ trụ bay qua vành đai sao Thổ, đĩa bồi tụ hố đen Gargantua, vụ nổ siêu tân tinh (Supernova), bề mặt sao Hỏa 4K để ghép xen kẽ với hoạt hình Manim/Remotion. |

---

## 2. Cơ Chế Hoạt Động Của Dây Chuyền 5 Agent `math_animator` (Manim)

Khi gọi lệnh `deeptutor run "..." -C math_animator --config enable_visual_review=true`, hệ thống thực thi tuần tự **5 Agent chuyên biệt** trong `deeptutor/agents/math_animator/pipeline.py`:

```
[Chủ đề Khoa học / Vũ trụ / Kỹ thuật]
       │
       ▼
1️⃣ ConceptAnalysisAgent  ──► Phân tích bản chất toán học/vật lý, xác định các biến số, phương trình chuẩn và thứ tự giải thích.
       │
       ▼
2️⃣ ConceptDesignAgent    ──► Thiết kế kịch bản thị giác (Visual Storyboard): màu sắc vector, bố cục khung hình, chuyển động biến đổi (Transform).
       │
       ▼
3️⃣ CodeGeneratorAgent    ──► Viết mã nguồn Python Manim hoàn chỉnh + Chạy thử nghiệm 3 vòng kiểm tra bố cục tĩnh (MAX_LAYOUT_ROUNDS = 3).
       │
       ▼
4️⃣ VisualReviewAgent     ──► Render video nháp -> Trích xuất các khung hình chính (Keyframes) -> Dùng Vision AI soi lỗi đè chữ / tràn khung -> Tự sửa code Manim (tối đa 4 vòng).
       │
       ▼
5️⃣ SummaryAgent          ──► Xuất file video .MP4 hoàn chỉnh + Bảng tóm tắt kiến thức & lời bình thuyết minh đi kèm.
```

---

## 3. Cơ Chế Hoạt Động Của Dây Chuyền `video_lesson` (Remotion + TTS)

Khi gọi lệnh `deeptutor run "..." -C video_lesson`, hệ thống trong `deeptutor/agents/video_lesson/capability.py` thực hiện:
1. **`lesson_writer.py`:** Lập kịch bản bài giảng nhiều phân cảnh (Scenes), viết lời thoại thuyết minh (`Narration Lines`) và lập trình giao diện động bằng **React / Remotion (`Lesson.tsx`)**.
2. **`layout_check.py`:** Mở trình duyệt Headless kiểm tra từng phân cảnh xem có phần tử đồ họa nào bị tràn khung hình hay chồng lấn không (`MAX_LAYOUT_ROUNDS = 2`), nếu phát hiện lỗi sẽ tự động yêu cầu LLM căn chỉnh lại CSS/Layout.
3. **`narration.py`:** Tổng hợp âm thanh giọng đọc cho từng câu thoại (`Edge-TTS` miễn phí chất lượng cao có giọng Tiếng Việt `vi-VN-HoaiMyNeural` / `vi-VN-NamMinhNeural`, hoặc `Gemini Speech`, `MiniMax`, `Xiaomi MiMo`) và đồng bộ thời lượng từng cảnh khớp khít với độ dài giọng đọc.
4. **Render MP4:** Xuất file video `.mp4` hoàn chỉnh qua Remotion Renderer.

---

## 4. Quy Trình 5 Bước Làm 1 Tập Video Khoa Học – Vũ Trụ Chuẩn Thực Chứng (Chống Ảo Giác 100%)

### Bước 1: Tra cứu & Kiểm chứng Dữ kiện Khoa học Gốc (`deep_research` + `preprint`)
- Trước khi viết kịch bản, dùng `deeptutor-cli` tra cứu bài báo arXiv gốc hoặc tài liệu NASA/ESA trong kho RAG:
  ```bash
  deeptutor run "Tìm các bài báo arXiv mới nhất và tổng hợp thông số vật lý chính xác về cơ chế bức xạ Hawking và bán kính Schwarzschild của hố đen" -C deep_research --format json
  ```

### Bước 2: Lên Kịch Bản Phân Cảnh Kép (`video-storytelling` + `deeptutor-cli`)
- Chia kịch bản video thành 2 nhóm cảnh rõ ràng:
  - **Nhóm cảnh A (Giải thích cơ chế / công thức / biểu đồ):** Giao cho `deeptutor-cli` (`math_animator` hoặc `video_lesson`).
  - **Nhóm cảnh B (Đại cảnh điện ảnh vũ trụ / tàu không gian):** Giao cho `cinematic-video-prompt` xuất prompt Veo 3 / Seedance 2.0.

### Bước 3: Render Các Đoạn Hoạt Hình Mô Phỏng Vật Lý – Vũ Trụ Bằng Manim (`math_animator`)
- Chạy lệnh CLI render từng phân đoạn mô phỏng với chế độ Vision AI tự kiểm tra khung hình:
  ```bash
  deeptutor run "Tạo hoạt hình Manim giải thích quỹ đạo chuyển tiếp Hohmann (Hohmann Transfer Orbit) từ Trái Đất lên Sao Hỏa: vẽ quỹ đạo elip tiếp xúc hai quỹ đạo tròn, hiển thị vector vận tốc Delta-v1 và Delta-v2 kèm công thức Vis-viva, chú thích Tiếng Việt rõ ràng" -C math_animator --config enable_visual_review=true --config max_fix_round=4 --config manim_quality=h --format json
  ```

### Bước 4: Render Video Bài Giảng Tổng Hợp Có Thuyết Minh Bằng Remotion (`video_lesson`)
- Chạy lệnh CLI tạo bài giảng đồ họa chuyển động có thuyết minh Tiếng Việt:
  ```bash
  deeptutor run "Tạo video bài giảng giải thích nguyên lý hoạt động của động cơ tên lửa đẩy Raptor (Full-Flow Staged Combustion Cycle): cấu tạo buồng đốt, tỷ lệ nhiên liệu Methalox (CH4 + LOX) và so sánh lực đẩy, thuyết minh Tiếng Việt" -C video_lesson --config tts_voice=vi-VN-NamMinhNeural --format json
  ```

### Bước 5: Ghép Hậu Kỳ Hoàn Chỉnh (`create-and-edit-video`)
- Kết hợp các đoạn `.mp4` từ `math_animator`, `video_lesson` và các đại cảnh 3D vũ trụ để xuất bản thành tập video hoàn chỉnh.
