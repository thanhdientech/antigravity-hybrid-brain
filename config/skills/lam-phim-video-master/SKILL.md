---
name: lam-phim-video-master
description: "Siêu Hub 18 bộ skill làm phim & render Video Dài/Ngắn: Drama, Google Flow, renderlongytb (:8500), rendershortvideo (:8600), 3D & GSAP."
group: "Làm Phim & Video AI"
---

# 🎬 LÀM PHIM & VIDEO MASTER HUB (`lam-phim-video-master`)

<!-- JAVIS_TRIGGER_ARCHIVE_START -->
## Khi nào dùng (Triggers & Ngữ cảnh kích hoạt đầy đủ)

> Siêu Skill Tổng Hợp (Master Hub) gom chung toàn bộ 18 Bộ Skill & 3,800+ Files Làm Phim, Render Video Dài YouTube `16:9` (`renderlongytb` — OmniFlow Timeline Studio `:8500`), Render Video Ngắn `9:16` & Shopee Affiliate (`rendershortvideo` — Shopee KOL Studio `:8600` & 9 SOP Kênh Triệu View), Sản Xuất Phim Drama AI (Skill riêng viết kịch bản `viet-kich-ban-drama` + Skill riêng viết prompt & hậu kỳ `viet-prompt-lam-phim-drama` trên Google Flow Veo 3.1 + Nano Banana Pro), Hoạt Hình Màu Nước Code-as-Video, Đồ Họa GSAP/Remotion/WebGL, Quay Màn Hình Auto-Zoom, AI Video Studio Timeline Editor 90 Templates và Tự Động Hóa Kênh YouTube. Chỉ cần gọi 1 lệnh duy nhất để điều phối trọn gói 5 Giai đoạn: (1) Viết kịch bản Đoản kịch/Sảng kịch từ 20 Repo Trung Quốc hoặc học kênh mẫu (`viet-kich-ban-drama`, `rendershortvideo`, `01_video-storytelling`, `11_prompts-chat-lookup`, `13_PromptDirector`), (2) Viết bộ CSV Prompt đồng bộ Nhân vật – Bối cảnh – Đồ vật chính xuyên suốt tập phim & Giải phẫu Tư thế 3D 5 Tầng (`viet-prompt-lam-phim-drama`, `02_cinematic-video-prompt`), (3) Render Video Dài YouTube qua `renderlongytb` (`:8500`), Render Video Ngắn Shopee/Reels/Shorts qua `rendershortvideo` (`:8600`), hoặc Render bằng Code (`04_painted-animation`, `05_kinetic-reel`, `06_gsap-skills`, `07_remotion-skills`, `08_motion-ai-kit`, `12_awesome-opus-703-prompts`), (4) Ghép Nhạc Nền 6 Cao Trào Suno AI + Sidechain Ducking, Edit Nhịp Nhanh – Chậm 4 Chế Độ & Timeline đa track (`renderlongytb`, `rendershortvideo`, `viet-prompt-lam-phim-drama`, `14_ai-video-studio`, `03_create-and-edit-video`, `09_entervi-auto-edit-logic`), (5) Xuất bản YouTube/TikTok/FB Reels (`10_yt-shortcode-commander`, `rendershortvideo`). TRIGGERS: "làm phim", "làm phim drama", "phim drama", "đoản kịch", "sảng kịch", "phim cổ trang", "phim tổng tài", "kịch bản trung quốc", "google flow", "renderlongytb", "rendershortvideo", "omniflow 8500", "shopee kol 8600", "render video dài", "render video ngắn", "làm video shopee", "fast cut", "ghép nhạc cao trào", "làm video", "master video", "skill làm phim", "tổng hợp skill video", "sản xuất video", "dựng phim ai", "hoạt hình màu nước", "painted animation", "kinetic reel", "prompt director", "ai video studio", "edit video local".
<!-- JAVIS_TRIGGER_ARCHIVE_END -->

- **Nguồn gốc / Kho Git Upstream:**
  - Siêu Hub Làm Phim: [`JohnHeibel/PDoomVideo`](https://github.com/JohnHeibel/PDoomVideo)
  - AI Video Studio: [`nguyentatkiem/ai-video-studio`](https://github.com/nguyentatkiem/ai-video-studio.git) *(Cập nhật 1 chạm qua `skills/14_ai-video-studio/update_from_upstream.cmd`)*

*(Kho Tổng Hợp Tự Chứa 16 Bộ Skill Làm Phim & Video — 3,800+ Files)*

> **Sổ tay hướng dẫn tiếng Việt đầy đủ:** [`SO_TAY_TONG_HOP_SKILL_LAM_PHIM_VIDEO.md`](./SO_TAY_TONG_HOP_SKILL_LAM_PHIM_VIDEO.md)  
> **Cẩm nang Phim Drama AI Google Flow:** [`references/16-tong-quan-he-thong-lam-phim-drama-ai-toan-dien.md`](./references/16-tong-quan-he-thong-lam-phim-drama-ai-toan-dien.md)  
> **Kho AI Video Studio:** `%USERPROFILE%\.gemini\config\skills\ai-video-studio\` (hoặc `E:\DIEN APP\Skill AI\ai-video-studio\`)

---

## 📌 1. DANH MỤC 18 BỘ SKILL TRONG HỆ SINH THÁI LÀM PHIM AI (3,800+ FILES)

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
| **[`17_renderlongytb`](../renderlongytb/SKILL.md)** | Gọi tại chỗ ổ E (`:8500`) | **Tool Render & Dựng Video Dài YouTube `16:9` (`OmniFlow Timeline Studio v3.5.3`):** Chạy trực tiếp tại `E:\DIEN APP\Xây Kênh Youtube\Tool render edit Video` (`B2->B3->B5`, 6 Động cơ Render, Bảo vệ tài khoản 5 lớp, `Muse.ai 8s` Failover, `B5_Motion2D.json` 13 Archetypes, Healer 10-in-1 & 15 MCP Tools) | [`../renderlongytb/SKILL.md`](../renderlongytb/SKILL.md) |
| **[`18_rendershortvideo`](../rendershortvideo/SKILL.md)** | Gọi tại chỗ ổ E (`:8600`) | **Tool Render Video Ngắn `9:16` & Shopee Affiliate (`Shopee KOL Studio v4.3.3` + 9 SOP Kênh):** Chạy trực tiếp tại `E:\DIEN APP\Tiep thi lien ke shoppe` (Học kênh mẫu, Khóa nhân vật 6 góc `[uid01]`, Lộ trình 50 video, Săn SP, 3 Định luật Chống nhảy bước & Cắt Khung Vàng `3.4s`) | [`../rendershortvideo/SKILL.md`](../rendershortvideo/SKILL.md) |

---

## 📌 2. QUY TRÌNH 5 BƯỚC ĐIỀU PHỐI TỰ ĐỘNG KHI NGƯỜI DÙNG GỌI

1. **Bước 1 — Kịch bản & Tra cứu mẫu:** Dùng [`viet-kich-ban-drama`](../viet-kich-ban-drama/SKILL.md) (cho Phim Drama Đoản kịch/Sảng kịch), [`rendershortvideo`](../rendershortvideo/SKILL.md) (học kênh mẫu & 9 SOP kênh ngắn), hoặc `01_video-storytelling` + tra cứu mẫu qua `11_prompts-chat-lookup` / `13_PromptDirector`.
2. **Bước 2 — Viết Prompt Đồng Bộ 3 Trụ Cột & Tư thế 3D:** Dùng [`viet-prompt-lam-phim-drama`](../viet-prompt-lam-phim-drama/SKILL.md) (khóa `CHAR_LOCK` + `LOC_LOCK` + `PROP_LOCK` bằng `cm`) kết hợp `02_cinematic-video-prompt`.
3. **Bước 3 — Render Hình ảnh / Video:**
   - Cần **Render Video Dài YouTube (`16:9`, 30–120+ cảnh, Tài liệu/Khoa học/Lịch sử/Drama dài):** Điều phối qua [`renderlongytb`](../renderlongytb/SKILL.md) gọi thẳng công cụ tại `E:\DIEN APP\Xây Kênh Youtube\Tool render edit Video` (`http://127.0.0.1:8500`).
   - Cần **Render Video Ngắn (`9:16`, Shopee Affiliate, TikTok Shop, Reels, Shorts, KOC Ô tô/Mẹo vặt/Thời trang/Decor/DIY):** Điều phối qua [`rendershortvideo`](../rendershortvideo/SKILL.md) gọi thẳng công cụ tại `E:\DIEN APP\Tiep thi lien ke shoppe` (`http://127.0.0.1:8600`).
   - Cần **Hoạt hình vẽ tay màu nước bằng Code:** Dùng `04_painted-animation` (`p5.brush`).
   - Cần **Intro / Showreel / Đồ họa 3D / Bản đồ / Toán học:** Dùng `05_kinetic-reel`, `06_gsap-skills`, `07_remotion-skills`, `03_create-and-edit-video` hoặc `12_awesome-opus-703-prompts`.
4. **Bước 4 — Hòa âm, Edit Nhịp & Bàn Dựng Timeline Đa Track:**
   - **Timeline Video Dài (`:8500`) / Video Ngắn (`:8650`):** Gọi qua [`renderlongytb`](../renderlongytb/SKILL.md) (`timeline_assemble_and_export`) hoặc [`rendershortvideo`](../rendershortvideo/SKILL.md) (`Ghép Đè / V2+` + Safe-Zone).
   - Cần **Phối nhạc 6 Cao Trào (`Sidechain Ducking` + `9 SFX`) & Edit 4 Chế độ nhịp (`FAST_CUT`):** Dùng [`viet-prompt-lam-phim-drama`](../viet-prompt-lam-phim-drama/SKILL.md).
   - Cần **Editor trực quan & 90 Template ngành:** Dùng `14_ai-video-studio` (chạy `studio.cmd`, timeline đa track, bám phụ đề `faster-whisper` tiếng Việt, tự động b-roll, 200 HyperFrames).
   - Cần **Quay màn hình Auto-Zoom / Cắt khoảng lặng / Ghép hàng loạt:** Dùng `Recordly.exe`, `Auto-Editor`, `Editly` hoặc `09_entervi-auto-edit-logic`.
5. **Bước 5 — Kiểm định QA & Đăng kênh:** Kiểm tra `ffprobe` + trích xuất Frame ảnh thực tế $\rightarrow$ Điều phối đăng qua `10_yt-shortcode-commander`, [`renderlongytb`](../renderlongytb/SKILL.md) (Tab 5 `:8500`) hoặc [`rendershortvideo`](../rendershortvideo/SKILL.md) (Bước 7 `:8600`).
