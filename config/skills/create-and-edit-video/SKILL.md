---
name: create-and-edit-video
description: "Lập trình và biên tập video tự động bằng 7 Engine: AI Video Studio (Web Timeline + 90 Template), Remotion, Motion Canvas, Manim, Auto-Editor, Editly & Recordly."
group: "Làm Phim & Video AI"
---

# Create & Edit Video Master Engine (SKILL.md)

<!-- JAVIS_TRIGGER_ARCHIVE_START -->
## Khi nào dùng (Triggers & Ngữ cảnh kích hoạt đầy đủ)

> Hệ thống toàn năng kiến tạo, lập trình và biên tập video tự động (Programmatic Video Creation & Automation Editing) tích hợp 7 Engine hàng đầu thế giới: AI Video Studio (Web Timeline Editor 90 Template + 200 HyperFrames + Whisper Sub + Autopilot của Nguyễn Tất Kiểm), Remotion (React/TS GPU Motion Graphics), Motion Canvas (Web-based Math & Science Animations), Manim (3Blue1Brown Python Mathematical Morphing & LaTeX), Auto-Editor (Tự động quét & cắt gọt khoảng lặng Podcast/Talkshow/Shorts), Editly (Tự động biên tập video hàng loạt bằng JSON spec + GLSL Shaders + FFmpeg), Recordly (Quay màn hình Auto-Zoom), và Kho 703 Prompt Code-as-Video Claude Opus 5.5 (Awesome Opus Videos). Kèm theo hệ sinh thái 20 Repositories đa tầng và REA Reverse Engineering. TRIGGERS: "create and edit video", "làm video tự động", "biên tập video", "render video", "cắt khoảng lặng", "auto-editor", "remotion", "motion-canvas", "manim", "editly", "ai video studio", "studio video", "tạo video bằng code", "programmatic video", "video bằng react", "video toán học", "edit video ai", "dựng video tự động", "awesome-opus", "opus video", "code as video".
<!-- JAVIS_TRIGGER_ARCHIVE_END -->

- **Nguồn gốc / Kho Git Upstream:** [remotion-dev/remotion & motion-canvas](https://github.com/remotion-dev/remotion) (`Video-as-Code Engines`)

## Kiến Tạo, Lập Trình & Biên Tập Video Tự Động Toàn Diện Với 5 Đại Engine

> **Khẩu hiệu cốt lõi:** *"Code Your Motion, Automate Your Cuts, Scale Your Video Pipeline."*  
> **Kho tài nguyên dự án cục bộ:** [`<video-project-dir>\`](file:///E:/DIEN%20APP/Skill%20AI/create%20and%20edit%20video/)  
> **Kho 20 Repositories 6 Tầng:** [`<video-editor-repos>\`](file:///E:/DIEN%20APP/Skill%20AI/editor%20video%20ai/)

---

## 📌 1. BẢN ĐỒ MA TRẬN 5 ENGINE CHUYÊN DỤNG

Để sản xuất video tự động hiệu suất cao, Agent bắt buộc phải lựa chọn **đúng công cụ cho đúng bài toán**:

```
                               ┌────────────────────────────────────────────────────────┐
                               │           CREATE & EDIT VIDEO MASTER SUITE             │
                               └───────────────────────────┬────────────────────────────┘
                                                           │
         ┌─────────────────────┬───────────────────────────┼───────────────────────────┬─────────────────────┐
         ▼                     ▼                           ▼                           ▼                     ▼
┌─────────────────┐   ┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐   ┌─────────────────┐
│ AI VIDEO STUDIO │   │    REMOTION     │         │  MOTION CANVAS  │         │      MANIM      │   │   AUTO-EDITOR   │
│ (Web Timeline)  │   │ (React/TS GPU)  │         │  (Vite Web 2D)  │         │ (Python 3B1B)   │   │ (Smart Cut CLI) │
├─────────────────┤   ├─────────────────┤         ├─────────────────┤         ├─────────────────┤   ├─────────────────┤
│ • 90 Templates  │   │ • Motion HUD    │         │ • Thuật toán 2D │         │ • Biến hình hình│   │ • Cắt khoảng    │
│ • 200 HyperFrame│   │ • Map vệ tinh   │         │ • Trực quan hóa │         │   học (Morphing)│   │   lặng tự động  │
│ • Whisper Sub   │   │ • Tin tức nóng  │         │   mạng nơ-ron   │         │ • Phương trình  │   │ • Lọc tạp âm dB │
│ • Autopilot     │   │ • Karaoke Sub   │         │ • Timeline xem  │         │   toán học LaTeX│   │ • Xuất XML sang │
│ • Bot Telegram  │   │ • Dashboard UI  │         │   trực tiếp Web │         │ • Không gian 3D │   │   Premiere/FCPX │
└─────────────────┘   └─────────────────┘         └─────────────────┘         └─────────────────┘   └─────────────────┘
                                   │                                                   │
                                   ▼                                                   ▼
                          ┌─────────────────┐                                 ┌─────────────────┐
                          │     EDITLY      │                                 │    RECORDLY     │
                          │ (JSON Spec GLSL)│                                 │ (Screen Studio) │
                          ├─────────────────┤                                 ├─────────────────┤
                          │ • Ghép hàng loạt│                                 │ • Quay màn hình │
                          │ • Shaders OpenGL│                                 │ • Auto-Zoom mượt│
                          └─────────────────┘                                 └─────────────────┘
```

### 🎯 Bảng Quy Chuẩn Lựa Chọn Engine:

| Nhu Cầu Của Người Dùng | Engine Tối Ưu Nhất | Ngôn Ngữ / Format | Đầu Ra (Output) |
| :--- | :--- | :--- | :--- |
| **Biên tập video trực quan, timeline đa track, áp 90 template ngành, bám sub tiếng Việt** | **AI Video Studio** | Web UI (Local 5186) + Python Whisper + FFmpeg | MP4 1080p/4K, phụ đề chuẩn âm, B-roll thông minh |
| **Biên tập video trực quan, timeline đa track, áp 90 template ngành, bám sub tiếng Việt** | **AI Video Studio** | Web UI (Local 5186) + Python Whisper + FFmpeg | MP4 1080p/4K, phụ đề chuẩn âm, B-roll thông minh |
| **Làm video tin tức, dashboard nhảy số, bản đồ vệ tinh, giao diện UI** | **Remotion** | React + TypeScript | MP4 1080p/4K 60fps qua GPU Chromium |
| **Làm video bài giảng giải thích thuật toán, vừa code vừa preview trên web** | **Motion Canvas** | TypeScript (Generator `yield*`) | Preview Web 60fps + MP4 / WebM / Image Sequence |
| **Diễn họa toán học cao cấp, công thức tích phân LaTeX, biến hình hình học** | **Manim** | Python (`3b1b/manim`) | MP4 chất lượng điện ảnh 4K 60fps |
| **Cắt bỏ khoảng lặng người nói, loại bỏ đoạn chết trong Podcast / Shorts / Zoom** | **Auto-Editor** | Python / Native CLI | MP4 đã cắt gọt + XML/EDL cho Premiere/Resolve |
| **Ghép video hàng loạt từ bảng tính/JSON spec, không cần viết code animation** | **Editly** | JSON Spec + Node.js | MP4 qua FFmpeg + GLSL Shaders |

---

## 📌 2. HƯỚNG DẪN CHI TIẾT TỪNG ENGINE THỰC CHIẾN

---

### 🚀 ENGINE 1: REMOTION (React + TypeScript GPU Render)
* **Vị trí repo:** [`editor video ai/04_Video/remotion/`](file:///E:/DIEN%20APP/Skill%20AI/editor%20video%20ai/04_Video/remotion/)
* **Dự án render hoàn chỉnh:** [`E:\DIEN APP\Xây Kênh Youtube\Tool render edit Video\omniflash\video-ai-workflow\pro-text-to-video\`](file:///E:/DIEN%20APP/X%C3%A2y%20K%C3%AAnh%20Youtube/Tool%20render%20edit%20Video/omniflash/video-ai-workflow/pro-text-to-video/)
* **Script thực thi một chạm:** `scripts/render_remotion_render.py`

#### 📋 Cấu trúc lệnh Render Remotion qua GPU Chromium:
```bash
node scripts/render-universal.mjs <propsJsonPath> <outputPath> [stagingAssetsDir]
```

#### 🎨 Các Archetypes mạnh nhất có sẵn:
1. `SATELLITE_FLYOVER_MAP`: Bản đồ vệ tinh GPS, đường line phát sáng nối địa điểm, camera bay mượt mà.
2. `INCIDENT_TIMELINE`: Mẫu bản tin giật gân, ticker chạy chữ, badge khẩn cấp.
3. `ARCHITECTURE_FLOW`: Sơ đồ kiến trúc luồng dữ liệu 4 node với hạt nơ-ron phát sáng.
4. `MODERN_IDE`: Cửa sổ macOS IDE gõ code Python/JS cú pháp màu sắc nét.
5. `VERSUS_CARD`: Thẻ so sánh đối kháng 2 cột (A vs B).
6. `METRIC_GAUGE`: Đồng hồ tốc độ đo lường năng lượng % hình tròn.
7. `HORIZONTAL_TIMELINE`: Dòng thời gian mốc sự kiện nằm ngang.
8. `ICON_GRID_COUNTER`: Lưới 25 icon tỷ lệ phần trăm kết hợp biểu đồ tăng trưởng.

---

### 🎙️ ENGINE 2: AUTO-EDITOR (Cắt Khoảng Lặng Tự Động Cho Video/Podcast)
* **Vị trí repo:** [`editor video ai/04_Video/auto-editor/`](file:///E:/DIEN%20APP/Skill%20AI/editor%20video%20ai/04_Video/auto-editor/)
* **Đường dẫn binary trên máy:** `E:\DIEN APP\Xây Kênh Youtube\Tool render edit Video\.venv\Scripts\auto-editor.exe`
* **Công dụng:** Tự động phát hiện các đoạn người nói dừng ngập ngừng, khoảng im lặng không có âm thanh và cắt bỏ tức thì, giữ lại nhịp điệu nói nhanh, cuốn hút kiểu TikTok/Shorts.

#### 📋 Cú Pháp Lệnh Thực Chiến:
1. **Cắt khoảng lặng cơ bản (giữ lề 0.2s để câu nói tự nhiên):**
   ```bash
   auto-editor input.mp4 --margin 0.2s -o output_clean.mp4
   ```
2. **Cắt sâu cho video nhịp độ cao (TikTok/Shorts Fast-Paced):**
   ```bash
   auto-editor input.mp4 --edit audio:threshold=-25dB --margin 0.1s -o output_fast.mp4
   ```
3. **Xuất sang file Premiere Pro XML / DaVinci Resolve để tinh chỉnh tiếp:**
   ```bash
   auto-editor input.mp4 --export premiere -o timeline.xml
   ```
4. **Cắt chỉ dựa trên file Audio (Podcast MP3/WAV):**
   ```bash
   auto-editor voiceover.mp3 --margin 0.15s -o voiceover_clean.wav
   ```

---

### 🎬 ENGINE 3: EDITLY (Biên Tập Video Hàng Loạt Bằng JSON Spec)
* **Vị trí repo:** [`editor video ai/04_Video/editly/`](file:///E:/DIEN%20APP/Skill%20AI/editor%20video%20ai/04_Video/editly/)
* **Cơ chế:** Khai báo cấu trúc video bằng JSON thuần $\rightarrow$ Editly gọi FFmpeg kết hợp OpenGL Shaders render video chuyển cảnh mượt mà.

#### 📋 Mẫu file cấu hình JSON (`editly_spec.json`):
```json
{
  "outPath": "output_video.mp4",
  "width": 1920,
  "height": 1080,
  "fps": 30,
  "audioFilePath": "voiceover.mp3",
  "clips": [
    {
      "duration": 4,
      "transition": { "name": "fade", "duration": 0.5 },
      "layers": [
        { "type": "image", "path": "scene1_bg.jpg", "zoomDirection": "in" },
        { "type": "title", "text": "ĐỘT PHÁ CÔNG NGHỆ 2026", "textColor": "#00FFCC", "position": "center" }
      ]
    },
    {
      "duration": 5,
      "transition": { "name": "directional-wipe", "duration": 0.4 },
      "layers": [
        { "type": "video", "path": "footage.mp4" },
        { "type": "subtitle", "text": "Hệ thống AI tự động hóa biên tập video" }
      ]
    }
  ]
}
```

#### 📋 Lệnh thực thi:
```bash
npx editly editly_spec.json
```

---

### 📐 ENGINE 4: MOTION CANVAS (Diễn Họa Khoa Học Tương Tác Web)
* **Vị trí repo:** [`editor video ai/04_Video/motion-canvas/`](file:///E:/DIEN%20APP/Skill%20AI/editor%20video%20ai/04_Video/motion-canvas/)
* **Điểm mạnh:** Sử dụng TypeScript với Generator function (`yield*`) để tạo hoạt ảnh toán học 2D. Có giao diện Web Editor để xem trước 60 FPS từng frame.

#### 📋 Mẫu Animation Code (`scene.tsx`):
```typescript
import { makeScene2D, Circle, all, createRef } from '@motion-canvas/2d';

export default makeScene2D(function* (view) {
  const circle = createRef<Circle>();
  view.add(<Circle ref={circle} size={160} fill={'#00FFCC'} />);

  yield* all(
    circle().scale(2, 1),
    circle().fill('#FF3366', 1)
  );
});
```

#### 📋 Lệnh khởi chạy Web Editor cục bộ:
```bash
npm run dev
# Mở trình duyệt tại http://localhost:9000 để kéo timeline biên tập trực tiếp
```

---

### 🧮 ENGINE 5: MANIM (Đỉnh Cao Toán Học 3Blue1Brown Bằng Python)
* **Vị trí repo:** [`editor video ai/04_Video/manim/`](file:///E:/DIEN%20APP/Skill%20AI/editor%20video%20ai/04_Video/manim/)
* **Tác giả:** Grant Sanderson (`3b1b/manim`)
* **Điểm mạnh:** Biến hình đồ thị (Shape Morphing), render phương trình toán học phức tạp bằng LaTeX $\LaTeX$, mô phỏng ma trận, không gian vector 3D cực kỳ trơn tru.

#### 📋 Mẫu Code Python Manim (`scene_math.py`):
```python
from manim import *

class MathExplanation(Scene):
    def construct(self):
        title = Text("Thuật toán A-Star Heuristic", font_size=40, color=BLUE)
        formula = MathTex(r"f(n) = g(n) + h(n)", font_size=54, color=YELLOW)
        
        self.play(Write(title))
        self.wait(1)
        self.play(Transform(title, formula))
        self.wait(2)
```

#### 📋 Lệnh Render qua CLI:
```bash
python -m manim -pql scene_math.py MathExplanation
# Cờ -pql: Render xem trước chất lượng nhanh (480p)
# Cờ -pqh: Render xuất bản chất lượng cao (1080p 60fps)
```

---

### 🖥️ ENGINE 6: RECORDLY (Quay Màn Hình Auto-Zoom & Dựng Video Demo / Tutorial)
* **Vị trí repo:** [`editor video ai/04_Video/Recordly/`](file:///E:/DIEN%20APP/Skill%20AI/editor%20video%20ai/04_Video/Recordly/)
* **Bộ cài Windows x64 (`v1.4.0`):** [`editor video ai/04_Video/Recordly/installer/Recordly-windows-x64.exe`](file:///E:/DIEN%20APP/Skill%20AI/editor%20video%20ai/04_Video/Recordly/installer/Recordly-windows-x64.exe)
* **Tác giả:** `webadderallorg/Recordly` (35k+ Stars, AGPL-3.0 — Bản mã nguồn mở miễn phí thay thế *Screen Studio*).
* **Điểm mạnh:** Quay màn hình phần mềm/web kèm hiệu ứng **Auto-Zoom thông minh theo cú click chuột**, làm mượt quỹ đạo con trỏ chuột (Cursor smoothing), tự động đóng khung nền Wallpaper sang trọng, chèn Webcam bo góc và xuất MP4 nét cao cho Video Tutorial, SaaS Demo, hướng dẫn ERP/SAP B1 hoặc khóa học E-Learning.

---

---

### 🎬 ENGINE 7: AI VIDEO STUDIO (Editor Timeline Web Local + 90 Template + 200 HyperFrames)
* **Vị trí repo:** [`E:\DIEN APP\Skill AI\ai-video-studio\`](file:///E:/DIEN%20APP/Skill%20AI/ai-video-studio/)
* **Tác giả:** `nguyentatkiem/ai-video-studio` (MIT License).
* **Điểm mạnh:**
  - **Giao diện Web Timeline trực quan:** Chạy local tại `http://localhost:5186` (qua `studio.cmd` hoặc `node studio/server.mjs`). Hỗ trợ timeline đa track (cắt ghép, keyframe, mặt nạ, phông xanh, lọc màu).
  - **90 Template xem trước:** Chia đều 9 nhóm ngành thực chiến (BĐS, Khóa học, Review, Bán hàng, Tin tức, AI, Podcast...).
  - **200 Khối hoạt ảnh HyperFrames:** Hoạt ảnh đồ họa mượt mà bằng GSAP/Three.js (Demo app, biểu đồ, social proof, logo, chuyển cảnh).
  - **Nhận diện giọng nói & phụ đề bám âm offline:** Tích hợp `faster-whisper` (`transcribe.py`) và lọc âm cắt nói vấp (`voice_clean.py`).
  - **Chế độ tự lái (Autopilot) & Telegram Agent:** Thả video thô là tự động cắt gọt, chèn b-roll, ghép nhạc xuất video; điều khiển từ xa qua Telegram bot.

#### 📋 Cú Pháp Khởi Chạy Nhanh:
```bash
# 1. Mở giao diện Web Timeline Editor:
cd "E:\DIEN APP\Skill AI\ai-video-studio"
studio.cmd

# 2. Tạo dự án tự động từ video thô (Autopilot):
studio.cmd --new "C:\duong\dan\video.mp4"

# 3. Chạy bám phụ đề tiếng Việt offline:
python scripts/transcribe.py "video.mp4" --output "captions.json"
```

---

### 🌟 SIÊU TÀI NGUYÊN: KHO 703 PROMPTS "CODE-AS-VIDEO" (AWESOME OPUS 5.5 VIDEOS)
* **Vị trí cục bộ:** [`<awesome-opus5-5-videos>\`](file:///E:/DIEN%20APP/Skill%20AI/awesome-opus5-5-videos/)
* **Công cụ tìm kiếm siêu tốc CLI:** [`search_prompts.py`](file:///E:/DIEN%20APP/Skill%20AI/awesome-opus5-5-videos/search_prompts.py)
* **Kho lưu trữ:** 703 Prompts thực chiến tạo video bằng code HTML, Canvas, Three.js, SVG, GSAP, GLSL Shaders và Web Audio API. 418 video đã được remake trực tiếp trên [Skillry](https://skillry.dev/ai-videos/opus-5-5).
* **4 Nhóm lớn:**
  1. `motion` (369 videos): SaaS Launch, UI Motion, Dribbble micro-interactions, Kinetic typography.
  2. `3d` (117 videos): Three.js worlds, Minecraft city view, Blender previs car chase, Sci-fi HUDs.
  3. `explainer` (116 videos): Video giải thích khoa học, lịch sử, bản đồ địa lý, infographic tài chính.
  4. `interactive` (101 videos): Web games 3D chơi được ngay trên trình duyệt, audio visualizer, vật lý hạt.

#### 📋 Cú Pháp Tra Cứu Nhanh:
```bash
# Tìm prompt ra mắt sản phẩm SaaS:
python "<awesome-opus5-5-videos>\search_prompts.py" -q "saas"

# Tìm prompt video giải thích (explainer) dùng GSAP:
python "<awesome-opus5-5-videos>\search_prompts.py" -c "explainer" -t "gsap"

# Tìm prompt 3D Three.js:
python "<awesome-opus5-5-videos>\search_prompts.py" -c "3d" -t "threejs"
```

---

## 📌 3. QUY TRÌNH PHỐI HỢP LIÊN HOÀN 5 ENGINE (HYBRID VIDEO WORKFLOW)

Trong một hệ thống sản xuất video tự động đẳng cấp thế giới, Agent kết hợp 5 Engine theo quy trình 4 giai đoạn khép kín:

```
[Kịch bản thô & Voiceover MP3]
               │
               ▼
[GIAI ĐOẠN 1: AUTO-EDITOR] ──> Tự động cắt sạch khoảng lặng, lọc âm thanh giọng đọc chuẩn nhịp.
               │
               ▼
[GIAI ĐOẠN 2: ENGINE CHUYÊN BIỆT THEO CẢNH]
 ├── Cảnh 1-2: MANIM / MOTION CANVAS ──> Sinh đồ họa thuật toán & phương trình toán học.
 ├── Cảnh 3-4: REMOTION ───────────────> Sinh HUD bản đồ vệ tinh & Dashboard nhảy số.
 └── Cảnh 5:   AI VIDEO (Veo 3/Seedance)──> Cảnh quay điện ảnh nhân vật thực tế.
               │
               ▼
[GIAI ĐOẠN 3: EDITLY / FFMPEG] ────────> Ghép nối tất cả các phân cảnh qua JSON spec & GLSL Shaders.
               │
               ▼
[GIAI ĐOẠN 4: ĐỐT PHỤ ĐỀ KARAOKE] ─────> FFmpeg Libass đốt subtitle viền nét thanh mảnh sát mép dưới.
               │
               ▼
   [VIDEO FULL HD 1080P HOÀN CHỈNH SẴN SÀNG ĐĂNG YOUTUBE/TIKTOK]
```

---

## 📌 4. BỘ SCRIPTS VÀ TÀI NGUYÊN SẴN SÀNG TRÊN MÁY

Toàn bộ các file chạy tự động nằm tại thư mục:  
📂 [`<video-project-dir>\`](file:///E:/DIEN%20APP/Skill%20AI/create%20and%20edit%20video/)

1. **`HUONG_DAN_CHI_TIET_SU_DUNG.md`**: Sổ tay vận hành kỹ thuật chi tiết nhất.
2. **`scripts/run_auto_editor.py`**: Wrapper Python gọi Auto-Editor cắt video/audio 1 chạm.
3. **`scripts/run_remotion_render.py`**: Wrapper Python render template Remotion Universal 16:9 / 9:16.
4. **`templates/editly_spec_example.json`**: Mẫu JSON spec Editly chuẩn chỉ.
5. **`templates/manim_scene_example.py`**: Mẫu kịch bản toán học Manim sẵn sàng render.

---
*Kỹ năng được tích hợp chuẩn vào hệ thống Antigravity Global Agent. Bản quyền thuộc hệ sinh thái Skill AI.*
