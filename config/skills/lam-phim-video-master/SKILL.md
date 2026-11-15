---
name: lam-phim-video-master
description: "Siêu Hub 16 bộ skill & 3,800+ files làm phim AI: Kịch bản Drama, Prompt Google Flow, AI Video Studio, nhân vật 3D, màu nước, GSAP & hậu kỳ."
group: "Làm Phim & Video AI"
---

# 🎬 LÀM PHIM & VIDEO MASTER HUB (`lam-phim-video-master`)

<!-- JAVIS_TRIGGER_ARCHIVE_START -->
## Khi nào dùng (Triggers & Ngữ cảnh kích hoạt đầy đủ)

> Siêu Skill Tổng Hợp (Master Hub) gom chung toàn bộ 16 Bộ Skill & 3,800+ Files Làm Phim, Sản Xuất Phim Drama AI (Skill riêng viết kịch bản `viet-kich-ban-drama` + Skill riêng viết prompt & hậu kỳ `viet-prompt-lam-phim-drama` trên Google Flow Veo 3.1 + Nano Banana Pro), Hoạt Hình Màu Nước Code-as-Video, Đồ Họa GSAP/Remotion/WebGL, Quay Màn Hình Auto-Zoom, AI Video Studio Timeline Editor 90 Templates và Tự Động Hóa Kênh YouTube. Chỉ cần gọi 1 lệnh duy nhất để điều phối trọn gói 5 Giai đoạn: (1) Viết kịch bản Đoản kịch/Sảng kịch từ 20 Repo Trung Quốc (`viet-kich-ban-drama`, `01_video-storytelling`, `11_prompts-chat-lookup`, `13_PromptDirector`), (2) Viết bộ CSV Prompt đồng bộ Nhân vật – Bối cảnh – Đồ vật chính xuyên suốt tập phim & Giải phẫu Tư thế 3D 5 Tầng (`viet-prompt-lam-phim-drama`, `02_cinematic-video-prompt`), (3) Render Video bằng Google Flow hoặc Code (`04_painted-animation`, `05_kinetic-reel`, `06_gsap-skills`, `07_remotion-skills`, `08_motion-ai-kit`, `12_awesome-opus-703-prompts`), (4) Ghép Nhạc Nền 6 Cao Trào Suno AI + Sidechain Ducking, Edit Nhịp Nhanh – Chậm 4 Chế Độ & Timeline đa track (`viet-prompt-lam-phim-drama`, `14_ai-video-studio`, `03_create-and-edit-video`, `09_entervi-auto-edit-logic`), (5) Xuất bản YouTube/TikTok (`10_yt-shortcode-commander`). TRIGGERS: "làm phim", "làm phim drama", "phim drama", "đoản kịch", "sảng kịch", "phim cổ trang", "phim tổng tài", "kịch bản trung quốc", "google flow", "fast cut", "ghép nhạc cao trào", "làm video", "master video", "skill làm phim", "tổng hợp skill video", "sản xuất video", "dựng phim ai", "hoạt hình màu nước", "painted animation", "kinetic reel", "prompt director", "ai video studio", "edit video local".
<!-- JAVIS_TRIGGER_ARCHIVE_END -->

- **Nguồn gốc / Kho Git Upstream:**
  - Siêu Hub Làm Phim: [`JohnHeibel/PDoomVideo`](https://github.com/JohnHeibel/PDoomVideo)
  - AI Video Studio: [`nguyentatkiem/ai-video-studio`](https://github.com/nguyentatkiem/ai-video-studio.git) *(Cập nhật 1 chạm qua `skills/14_ai-video-studio/update_from_upstream.cmd`)*

*(Kho Tổng Hợp Tự Chứa 16 Bộ Skill Làm Phim & Video — 3,800+ Files)*

> **Sổ tay hướng dẫn tiếng Việt đầy đủ:** [`SO_TAY_TONG_HOP_SKILL_LAM_PHIM_VIDEO.md`](./SO_TAY_TONG_HOP_SKILL_LAM_PHIM_VIDEO.md)  
> **Cẩm nang Phim Drama AI Google Flow:** [`references/16-tong-quan-he-thong-lam-phim-drama-ai-toan-dien.md`](./references/16-tong-quan-he-thong-lam-phim-drama-ai-toan-dien.md)  
> **Kho AI Video Studio:** `%USERPROFILE%\.gemini\config\skills\ai-video-studio\` (hoặc `E:\DIEN APP\Skill AI\ai-video-studio\`)

---

## 📌 1. DANH MỤC 16 BỘ SKILL TRONG HỆ SINH THÁI LÀM PHIM AI (3,800+ FILES)

| Mã Bộ Kỹ Năng | Số File | Công Dụng Cốt Lõi | File Chính Để Đọc / Thực Thi |
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
| **[`14_ai-video-studio`](../ai-video-studio/SKILL.md)** | 1,931 files | Phần mềm Web Timeline Editor local (`http://localhost:5186`), 90 Template ngành, 200 khối HyperFrames, phụ đề bám âm `faster-whisper` offline & Telegram Bot | `studio.cmd`, `studio/`, `engine/`, `scripts/` |
| **[`15_viet-kich-ban-drama`](../viet-kich-ban-drama/SKILL.md)** | 20 Repos (`8,554 files`) | **Skill Riêng Viết Kịch Bản Phim Drama (Đoản kịch / Sảng kịch Cổ trang & Hiện đại):** Ma trận 5 nhịp 60s Hồng Quả, Sổ Nợ Sảng Khoái (`1 Móc Câu : 3 Vả Mặt`), Hồ sơ 3 trụ cột (Nhân vật – Bối cảnh – Đồ vật chính) & Lời thoại `14–20 từ` | [`../viet-kich-ban-drama/SKILL.md`](../viet-kich-ban-drama/SKILL.md), [`references/15-doan-kich-sang-kich-drama-ai-google-flow.md`](./references/15-doan-kich-sang-kich-drama-ai-google-flow.md) |
| **[`16_viet-prompt-lam-phim-drama`](../viet-prompt-lam-phim-drama/SKILL.md)** | 5 files + Scripts | **Skill Riêng Viết Prompt Phim Drama, Đồng Bộ 3 Trụ Cột, Hòa Âm 6 Cao Trào & Edit Nhịp Nhanh – Chậm:** Khóa `CHAR_LOCK` + `LOC_LOCK` + `PROP_LOCK (cm)`, ghép BGM 6 Hồi (`Sidechain Ducking` + `9 SFX`) & Edit 4 Chế độ nhịp (`FAST_CUT`) | [`../viet-prompt-lam-phim-drama/SKILL.md`](../viet-prompt-lam-phim-drama/SKILL.md), [`references/16-tong-quan-he-thong-lam-phim-drama-ai-toan-dien.md`](./references/16-tong-quan-he-thong-lam-phim-drama-ai-toan-dien.md) |

---

## 📌 2. QUY TRÌNH 5 BƯỚC ĐIỀU PHỐI TỰ ĐỘNG KHI NGƯỜI DÙNG GỌI

1. **Bước 1 — Kịch bản & Tra cứu mẫu:** Dùng [`viet-kich-ban-drama`](../viet-kich-ban-drama/SKILL.md) (cho Phim Drama Đoản kịch/Sảng kịch) hoặc `01_video-storytelling` + tra cứu mẫu qua `11_prompts-chat-lookup` / `13_PromptDirector`.
2. **Bước 2 — Viết Prompt Đồng Bộ 3 Trụ Cột & Tư thế 3D:** Dùng [`viet-prompt-lam-phim-drama`](../viet-prompt-lam-phim-drama/SKILL.md) (khóa `CHAR_LOCK` + `LOC_LOCK` + `PROP_LOCK` bằng `cm`) kết hợp `02_cinematic-video-prompt`.
3. **Bước 3 — Render Hình ảnh / Video:**
   - Cần **Phim Drama AI (Google Flow Veo 3.1 + Nano Banana Pro / Seedance / Kling):** Xuất bộ 4 File CSV Prompt chuẩn `UTF-8-SIG` từ Bước 2.
   - Cần **Hoạt hình vẽ tay màu nước bằng Code:** Dùng `04_painted-animation` (`p5.brush`).
   - Cần **Intro / Showreel / Đồ họa 3D / Bản đồ / Toán học:** Dùng `05_kinetic-reel`, `06_gsap-skills`, `07_remotion-skills`, `03_create-and-edit-video` hoặc `12_awesome-opus-703-prompts`.
4. **Bước 4 — Hòa âm 6 Cao Trào, Edit Nhịp Nhanh – Chậm & Timeline Đa Track:**
   - Cần **Phối nhạc 6 Cao Trào (`Sidechain Ducking` + `9 SFX`) & Edit 4 Chế độ nhịp (`FAST_CUT`):** Dùng [`viet-prompt-lam-phim-drama`](../viet-prompt-lam-phim-drama/SKILL.md).
   - Cần **Editor trực quan & 90 Template ngành:** Dùng `14_ai-video-studio` (chạy `studio.cmd`, timeline đa track, bám phụ đề `faster-whisper` tiếng Việt, tự động b-roll, 200 HyperFrames).
   - Cần **Quay màn hình Auto-Zoom / Cắt khoảng lặng / Ghép hàng loạt:** Dùng `Recordly.exe`, `Auto-Editor`, `Editly` hoặc `09_entervi-auto-edit-logic`.
5. **Bước 5 — Kiểm định QA & Đăng kênh:** Kiểm tra `ffprobe` + trích xuất Frame ảnh thực tế $\rightarrow$ Điều phối đăng qua `10_yt-shortcode-commander`.
