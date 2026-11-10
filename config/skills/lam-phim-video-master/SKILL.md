---
name: lam-phim-video-master
description: "Siêu Hub tổng hợp 14 bộ skill & 3,800+ files làm phim & video AI: AI Video Studio, biên kịch, nhân vật 3D, màu nước, WebGL, GSAP/Remotion & hậu kỳ."
group: "Làm Phim & Video AI"
---

# 🎬 LÀM PHIM & VIDEO MASTER HUB (`lam-phim-video-master`)

<!-- JAVIS_TRIGGER_ARCHIVE_START -->
## Khi nào dùng (Triggers & Ngữ cảnh kích hoạt đầy đủ)

> Siêu Skill Tổng Hợp (Master Hub) gom chung toàn bộ 14 Bộ Skill & 3,800+ Files Làm Phim, Sản Xuất Video AI, Hoạt Hình Màu Nước Code-as-Video, Đồ Họa GSAP/Remotion/WebGL, Quay Màn Hình Auto-Zoom, AI Video Studio Timeline Editor 90 Templates và Tự Động Hóa Kênh YouTube vào chung 1 thư mục duy nhất (`skills/01..14`). Chỉ cần gọi 1 lệnh duy nhất để điều phối trọn gói 5 Giai đoạn: (1) Tra cứu mẫu & Biên kịch (01_video-storytelling, 11_prompts-chat-lookup, 13_PromptDirector), (2) Thiết kế Nhân vật 6 Lớp & Giải phẫu Tư thế 3D 5 Tầng (02_cinematic-video-prompt), (3) Render Video bằng Code hoặc AI (04_painted-animation p5.brush màu nước, 05_kinetic-reel WebGL, 06_gsap-skills, 07_remotion-skills, 08_motion-ai-kit, 12_awesome-opus-703-prompts), (4) Biên tập trực quan, Timeline đa track & Hậu kỳ tự động (14_ai-video-studio, 03_create-and-edit-video, 09_entervi-auto-edit-logic, Recordly, Auto-Editor, Editly), (5) Xuất bản YouTube (10_yt-shortcode-commander). TRIGGERS: "làm phim", "làm video", "master video", "skill làm phim", "tổng hợp skill video", "sản xuất video", "dựng phim ai", "hoạt hình màu nước", "painted animation", "kinetic reel", "prompt director", "ai video studio", "edit video local".
<!-- JAVIS_TRIGGER_ARCHIVE_END -->

- **Nguồn gốc / Kho Git Upstream:** [JohnHeibel/PDoomVideo & nguyentatkiem/ai-video-studio](https://github.com/JohnHeibel/PDoomVideo) (`Siêu Hub Làm Phim & Video Studio`)

*(Kho Tổng Hợp Tự Chứa 14 Bộ Skill Làm Phim & Video — 3,800+ Files Gom Chung Trong Thư Mục `./skills/`)*

> **Sổ tay hướng dẫn tiếng Việt đầy đủ:** [`SO_TAY_TONG_HOP_SKILL_LAM_PHIM_VIDEO.md`](./SO_TAY_TONG_HOP_SKILL_LAM_PHIM_VIDEO.md)  
> **Thư mục dự án:** [`E:\DIEN APP\Skill AI\lam-phim-video-master\`](file:///E:/DIEN%20APP/Skill%20AI/lam-phim-video-master/)  
> **Kho AI Video Studio:** [`E:\DIEN APP\Skill AI\ai-video-studio\`](file:///E:/DIEN%20APP/Skill%20AI/ai-video-studio/)

---

## 📌 1. DANH MỤC 14 BỘ SKILL ĐÃ GOM CHUNG VÀO `./skills/` (3,800+ FILES)

Toàn bộ các skill cũ và mới đã được copy và kết nối trực tiếp vào thư mục con `./skills/` theo thứ tự từ `01` đến `14`:

| Mã Thư Mục Con (`./skills/`) | Số File | Công Dụng Cốt Lõi | File Chính Để Đọc / Thực Thi |
| :--- | :---: | :--- | :--- |
| **[`01_video-storytelling`](./skills/01_video-storytelling/SKILL.md)** | 80 files | Biên kịch 20+ công thức (ABT, 7-Beat Debate, Pixar, Dan Harmon, AIDA), tách luồng Veo 3 & Seedance 2.0 | `SKILL.md`, `cli.py`, `references/01..06` |
| **[`02_cinematic-video-prompt`](./skills/02_cinematic-video-prompt/SKILL.md)** | 12 files | 700+ thuật ngữ góc máy/ánh sáng + **Khóa Gen Nhân Vật 6 Lớp (`6-Layer DNA`)** + **Giải phẫu Tư thế 3D 5 Tầng (`5-Tier Pose`)** | `SKILL.md`, [`07-character-anatomy-and-pose-engine.md`](./skills/02_cinematic-video-prompt/references/07-character-anatomy-and-pose-engine.md) |
| **[`03_create-and-edit-video`](./skills/03_create-and-edit-video/SKILL.md)** | 8 files | Điều phối 7 Engine: AI Video Studio, Remotion, Motion Canvas, Manim (LaTeX 3B1B), Auto-Editor (cắt khoảng lặng), Editly, Recordly | `SKILL.md`, `HUONG_DAN_CHI_TIET_SU_DUNG.md`, `scripts/` |
| **[`04_painted-animation`](./skills/04_painted-animation/SKILL.md)** | 29 files | Vẽ phim hoạt hình **Màu Nước & Mực Tàu (`p5.js` + `p5.brush`)** bằng code, có diễn xuất nhân vật, bắt nhịp nhạc & karaoke | `SKILL.md`, `template/`, `scripts/`, `references/` |
| **[`05_kinetic-reel`](./skills/05_kinetic-reel/SKILL.md)** | 26 files | Làm video Showreel / Intro chữ chuyển động + 3D `Three.js` + `WebGL Shader` + tự tổng hợp nhạc điện tử | `SKILL.md`, `template/`, `scripts/`, `references/` |
| **[`06_gsap-skills`](./skills/06_gsap-skills/)** | 9 files | Bộ kỹ năng lập trình chuyển động mượt với thư viện GSAP (Timeline, ScrollTrigger, TextPlugin, Flip) | `gsap-core/`, `gsap-timeline/`, `gsap-scrolltrigger/` |
| **[`07_remotion-skills`](./skills/07_remotion-skills/)** | 285 files | Kho kỹ năng chuyên sâu lập trình video React/TypeScript bằng Remotion (Captions, 3D, Charts, Shaders, Transitions) | `remotion/SKILL.md` & `rules/` |
| **[`08_motion-ai-kit`](./skills/08_motion-ai-kit/)** | 20 files | Bộ công cụ AI thiết kế chuyển động UI/UX & đồ họa động (Motion Design System) | `plugins/`, `docs/` |
| **[`09_entervi-auto-edit-logic`](./skills/09_entervi-auto-edit-logic/LOGIC_GHEP_VIDEO_AUTO_ENTERVI.md)** | 2 files | Thuật toán và kiến trúc ghép video hàng loạt tự động bóc tách từ hệ thống Entervi Auto Edit | `LOGIC_GHEP_VIDEO_AUTO_ENTERVI.md` |
| **[`10_yt-shortcode-commander`](./skills/10_yt-shortcode-commander/SKILL.md)** | 1 file | Dây chuyền 6 lệnh sản xuất tự động cho 3 kênh YouTube (Every Myth Explained, KosmosGeist, Some Guy) | `SKILL.md` |
| **[`11_prompts-chat-lookup`](./skills/11_prompts-chat-lookup/SKILL.md)** | 2 files | Công cụ tìm kiếm 2,627 System Prompts + 31 chương sách Prompt Engineering & kết nối Live MCP `prompts.chat` | `SKILL.md`, `search_prompts_chat.py` |
| **[`12_awesome-opus-703-prompts`](./skills/12_awesome-opus-703-prompts/HUONG_DAN_SU_DUNG_KHO_703_OPUS_VIDEO_PROMPTS.md)** | 707 files | Toàn bộ 703 Prompts mẫu "Code-as-Video" (Motion, 3D Three.js, Explainer, Interactive) kèm công cụ tìm kiếm | `search_prompts.py`, `prompts/`, `data/` |
| **[`13_PromptDirector`](./skills/13_PromptDirector/README.md)** | 694 files | Tiện ích Chrome/Edge lưu mẫu Video/Prompt 1 chạm từ Seedance, Higgsfield, Midjourney + Cổng kết nối Local MCP | `README.md`, `extension/`, `connector/` |
| **[`14_ai-video-studio`](./skills/14_ai-video-studio/SKILL.md)** | 1,931 files | Phần mềm Web Timeline Editor local (`http://localhost:5186`), 90 Template ngành, 200 khối HyperFrames, phụ đề bám âm `faster-whisper` offline & Telegram Bot | `studio.cmd`, `studio/`, `engine/`, `scripts/` |

---

## 📌 2. QUY TRÌNH 5 BƯỚC ĐIỀU PHỐI TỰ ĐỘNG KHI NGƯỜI DÙNG GỌI

1. **Bước 1 — Kịch bản & Tra cứu mẫu:** Đọc `01_video-storytelling` + tra cứu mẫu qua `11_prompts-chat-lookup` hoặc `13_PromptDirector`.
2. **Bước 2 — Thiết kế Nhân vật & Tư thế 3D:** Áp dụng `6-Layer Character DNA Lock` và `5-Tier Kinematic Pose Formula` trong `02_cinematic-video-prompt/references/07-character-anatomy-and-pose-engine.md`.
3. **Bước 3 — Render Hình ảnh / Video:**
   - Cần **Video AI thực tế (Veo 3 / Seedance / Kling):** Xuất bảng Prompt CSV từ Bước 1 & 2.
   - Cần **Hoạt hình vẽ tay màu nước bằng Code:** Dùng `04_painted-animation` (`p5.brush`).
   - Cần **Intro / Showreel / Đồ họa 3D / Bản đồ / Toán học:** Dùng `05_kinetic-reel`, `06_gsap-skills`, `07_remotion-skills`, `03_create-and-edit-video` hoặc `12_awesome-opus-703-prompts`.
4. **Bước 4 — Biên tập trực quan, Timeline Đa Track & Hậu kỳ tự động:**
   - Cần **Editor trực quan & 90 Template ngành:** Dùng `14_ai-video-studio` (chạy `studio.cmd`, timeline đa track, bám phụ đề `faster-whisper` tiếng Việt, tự động b-roll, 200 HyperFrames).
   - Cần **Quay màn hình Auto-Zoom:** Dùng `Recordly.exe` (quay màn hình mượt, wallpaper sang trọng).
   - Cần **Cắt khoảng lặng tự động:** Dùng `Auto-Editor` (cắt bỏ ngập ngừng trong Podcast/Shorts).
   - Cần **Ghép hàng loạt bằng Code/JSON:** Dùng `Editly` hoặc `09_entervi-auto-edit-logic` + `FFmpeg`.
5. **Bước 5 — Kiểm định QA & Đăng kênh:** Kiểm tra `ffprobe` + trích xuất Frame ảnh thực tế $\rightarrow$ Điều phối đăng qua `10_yt-shortcode-commander`.
