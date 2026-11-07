# 📘 HƯỚNG DẪN CHI TIẾT SỬ DỤNG HỆ THỐNG "CREATE AND EDIT VIDEO"
## Cẩm Nang Thực Chiến Vận Hành 5 Đại Engine Sản Xuất & Biên Tập Video Tự Động

> **Dự án:** `create and edit video`  
> **Skill Agent:** [`create-and-edit-video`](file:///C:/Users/INFOASIA/.gemini/config/skills/create-and-edit-video/SKILL.md)  
> **Hệ sinh thái:** Remotion · Motion Canvas · Manim · Auto-Editor · Editly · 20 Video Repos · REA

---

## 📌 PHẦN 1: MỤC TIÊU VÀ PHẠM VI ỨNG DỤNG

Hệ thống **`create and edit video`** được thiết kế nhằm mục đích **tự động hóa 100% quy trình sản xuất video từ kịch bản văn bản sang video thành phẩm Full HD 1080p / 4K**. Mỗi engine đảm nhận một mắt xích chuyên biệt không thể thay thế:

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                       QUY TRÌNH KẾT HỢP HYBRID 5 ENGINE                        │
└───────────────────────────────────────┬────────────────────────────────────────┘
                                        │
    1. TIỀN KỲ (PRE-PRODUCTION)         │  • Video Storytelling biên kịch đa nhịp
    & LỌC ÂM THANH                      ▼  • Edge-TTS / ElevenLabs lồng tiếng AI
                               ┌─────────────────┐
                               │   AUTO-EDITOR   │ ──> Cắt sạch khoảng lặng, đoạn ngập
                               └────────┬────────┘     ngừng, tăng tốc nhịp điệu video.
                                        │
    2. SẢN XUẤT PHÂN CẢNH               ▼
    (PRODUCTION)               ┌─────────────────┐
                               │ 3 ENGINE MOTION │
                               └────────┬────────┘
                                        ├──> MANIM: Phương trình toán học LaTeX & không gian vector 3D
                                        ├──> MOTION CANVAS: Diễn họa thuật toán tương tác Web Editor
                                        └──> REMOTION: Bản đồ vệ tinh GPS, Dashboard UI, Tin tức, Thẻ so sánh
                                        │
    3. HẬU KỲ & ĐÓNG GÓI                ▼
    (POST-PRODUCTION)          ┌─────────────────┐
                               │ EDITLY & FFMPEG │ ──> Ghép các cảnh bằng JSON spec + GLSL Shaders
                               └────────┬────────┘     + Đốt phụ đề Karaoke Segoe UI viền sắc nét.
                                        │
                                        ▼
                         [VIDEO THÀNH PHẨM XUẤT XƯỞNG]
```

---

## 📌 PHẦN 2: HƯỚNG DẪN CHI TIẾT TỪNG ENGINE

---

### 1. 🎙️ AUTO-EDITOR — CẮT GỌT KHOẢNG LẶNG TỰ ĐỘNG

#### A. Giới thiệu & Cơ chế hoạt động:
Auto-Editor phân tích luồng âm thanh của file video/audio theo ngưỡng decibel (dB) và khung hình chuyển động. Nếu âm lượng giảm xuống dưới ngưỡng trong một khoảng thời gian liên tục, nó sẽ tự động loại bỏ đoạn đó và ghép các đoạn nói lại với nhau, giữ cho video luôn có nhịp độ dồn dập, giữ chân khán giả tốt nhất.

#### B. Vị trí cài đặt trên máy:
* **Binary CLI:** `E:\DIEN APP\Xây Kênh Youtube\Tool render edit Video\.venv\Scripts\auto-editor.exe`
* **Source repo:** [`editor video ai/04_Video/auto-editor/`](file:///E:/DIEN%20APP/Skill%20AI/editor%20video%20ai/04_Video/auto-editor/)

#### C. Lệnh CLI thực chiến:

1. **Cắt cơ bản cho Video nói chuyện / Podcast:**
   ```bash
   & "E:\DIEN APP\Xây Kênh Youtube\Tool render edit Video\.venv\Scripts\auto-editor.exe" input_video.mp4 --margin 0.2s -o output_clean.mp4
   ```
   *(Tham số `--margin 0.2s`: Giữ lại 0.2 giây trước và sau mỗi câu nói để giọng đọc nghe tự nhiên, không bị ngắt cụt).*

2. **Cắt gắt cho Shorts / TikTok / Reels (Fast-Paced Style):**
   ```bash
   & "E:\DIEN APP\Xây Kênh Youtube\Tool render edit Video\.venv\Scripts\auto-editor.exe" input_video.mp4 --edit audio:threshold=-23dB --margin 0.08s -o output_tiktok.mp4
   ```

3. **Cắt chỉ riêng file Audio lồng tiếng (Voiceover MP3):**
   ```bash
   & "E:\DIEN APP\Xây Kênh Youtube\Tool render edit Video\.venv\Scripts\auto-editor.exe" voice.mp3 --margin 0.15s -o voice_cut.wav
   ```

4. **Xuất dòng thời gian (Timeline) sang phần mềm dựng phim chuyên nghiệp:**
   * Xuất sang Adobe Premiere Pro:
     ```bash
     & "E:\DIEN APP\Xây Kênh Youtube\Tool render edit Video\.venv\Scripts\auto-editor.exe" input.mp4 --export premiere -o project_timeline.xml
     ```
   * Xuất sang DaVinci Resolve:
     ```bash
     & "E:\DIEN APP\Xây Kênh Youtube\Tool render edit Video\.venv\Scripts\auto-editor.exe" input.mp4 --export resolve -o timeline.fcpxml
     ```

#### D. Chạy qua Script Python tự động trong dự án:
Sếp có thể gọi script Python có sẵn trong thư mục dự án:
```bash
& "E:\DIEN APP\Xây Kênh Youtube\Tool render edit Video\.venv\Scripts\python.exe" "E:\DIEN APP\Skill AI\create and edit video\scripts\run_auto_editor.py" "duong_dan_file_video.mp4"
```

---

### 2. 🚀 REMOTION — LẬP TRÌNH MOTION GRAPHICS BẰNG REACT & TYPESCRIPT

#### A. Giới thiệu & Điểm mạnh:
Remotion cho phép sử dụng 100% công nghệ web hiện đại (React, TypeScript, CSS Grid/Flexbox, SVG, Canvas, Three.js) để tạo ra video độ phân giải cao bằng cách điều khiển từng khung hình (frame-by-frame) qua GPU Chromium.

#### B. Vị trí dự án trên máy:
* **Remotion Root:** [`E:\DIEN APP\Xây Kênh Youtube\Tool render edit Video\omniflash\video-ai-workflow\pro-text-to-video\`](file:///E:/DIEN%20APP/X%C3%A2y%20K%C3%AAnh%20Youtube/Tool%20render%20edit%20Video/omniflash/video-ai-workflow/pro-text-to-video/)
* **Engine Component:** `src/UniversalExplainer16x9.tsx` (hơn 3.000 dòng code quản lý toàn bộ các mẫu thị giác chuyên sâu).

#### C. Quy trình Render Remotion qua file Props JSON:
Tạo một file JSON khai báo danh sách các cảnh (scenes), sau đó gọi render:

```json
{
  "slug": "demo_video",
  "projectTitle": "TIÊU ĐỀ VIDEO",
  "fps": 30,
  "width": 1920,
  "height": 1080,
  "scenes": [
    {
      "sceneId": "SCENE_01",
      "sceneNumber": 1,
      "archetype": "CHAPTER_INTRO",
      "durationSec": 15,
      "title": "CHƯƠNG I: ĐỘT PHÁ CÔNG NGHỆ",
      "subtitle": "Kỷ nguyên AI Agent tự động hóa",
      "dateText": "TECH NEWS // 2026"
    },
    {
      "sceneId": "SCENE_02",
      "sceneNumber": 2,
      "archetype": "ARCHITECTURE_FLOW",
      "durationSec": 20,
      "title": "KIẾN TRÚC MẠNG NƠ-RON",
      "statValue": "Độ trễ: 12ms // Thông lượng: 100K TPS"
    },
    {
      "sceneId": "SCENE_03",
      "sceneNumber": 3,
      "archetype": "METRIC_GAUGE",
      "durationSec": 15,
      "title": "HIỆU NĂNG TỐI ƯU",
      "counterValue": 99.4,
      "counterSuffix": "%"
    }
  ]
}
```

#### D. Lệnh thực thi:
```bash
node "E:\DIEN APP\Xây Kênh Youtube\Tool render edit Video\omniflash\video-ai-workflow\pro-text-to-video\scripts\render-universal.mjs" props.json output_raw.mp4
```
Sau đó dùng FFmpeg ghép âm thanh và phụ đề Karaoke viền 1.6px sát đáy.

---

### 3. 🎬 EDITLY — BIÊN TẬP VIDEO HÀNG LOẠT TỪ JSON SPEC

#### A. Giới thiệu & Điểm mạnh:
Editly loại bỏ hoàn toàn việc phải mở phần mềm dựng phim GUI khi làm video hàng loạt. Sếp chỉ cần tạo 1 file `spec.json` mô tả các clip, hình ảnh, văn bản tiêu đề, hiệu ứng chuyển cảnh (transitions) và nhạc nền. Editly sẽ tự động xử lý toàn bộ qua FFmpeg và OpenGL shaders.

#### B. Vị trí repo:
* **Repo:** [`editor video ai/04_Video/editly/`](file:///E:/DIEN%20APP/Skill%20AI/editor%20video%20ai/04_Video/editly/)

#### C. Mẫu JSON Spec chuẩn chỉ (`templates/editly_spec_example.json`):
```json
{
  "outPath": "output_editly.mp4",
  "width": 1920,
  "height": 1080,
  "fps": 30,
  "audioFilePath": "audio_output/voiceover.mp3",
  "clips": [
    {
      "duration": 5,
      "transition": { "name": "fade", "duration": 0.5 },
      "layers": [
        {
          "type": "fill-color",
          "color": "#0B0F19"
        },
        {
          "type": "title",
          "text": "BÁO CÁO CÔNG NGHỆ 2026",
          "textColor": "#00FFCC",
          "position": "center"
        }
      ]
    },
    {
      "duration": 6,
      "transition": { "name": "directional-wipe", "duration": 0.5 },
      "layers": [
        {
          "type": "video",
          "path": "raw_footage.mp4",
          "resizeMode": "contain"
        },
        {
          "type": "subtitle",
          "text": "Tự động hóa biên tập video bằng Editly JSON Spec"
        }
      ]
    }
  ]
}
```

#### D. Lệnh thực thi:
```bash
npx editly templates/editly_spec_example.json
```

---

### 4. 📐 MOTION CANVAS — DIỄN HỌA THUẬT TOÁN TƯƠNG TÁC WEB

#### A. Giới thiệu & Điểm mạnh:
Motion Canvas sinh ra để viết code hoạt họa toán học và khoa học với tư duy lập trình viên. Khác với Remotion, Motion Canvas có một **Web Studio tích hợp chạy bằng Vite** trên trình duyệt, cho phép:
* Kéo trượt thanh timeline để soi từng frame theo thời gian thực.
* Sử dụng Generator function (`yield*`) để kiểm soát thứ tự và thời gian của từng đối tượng hoạt ảnh.
* Chuyển đổi trạng thái linh hoạt (state transition) và hỗ trợ biến hình SVG cực mượt.

#### B. Vị trí repo:
* **Repo:** [`editor video ai/04_Video/motion-canvas/`](file:///E:/DIEN%20APP/Skill%20AI/editor%20video%20ai/04_Video/motion-canvas/)

#### C. Lệnh khởi chạy Web Studio:
```bash
cd "E:\DIEN APP\Skill AI\editor video ai\04_Video\motion-canvas"
npm install
npm run dev
# Mở trình duyệt tại http://localhost:9000
```

---

### 5. 🧮 MANIM — ENGINE TOÁN HỌC ĐỈNH CAO 3BLUE1BROWN

#### A. Giới thiệu & Điểm mạnh:
Được sáng tạo bởi Grant Sanderson cho kênh YouTube 3Blue1Brown (hơn 6 triệu người theo dõi), Manim là tiêu chuẩn vàng của thế giới khi cần giải thích các khái niệm toán học trừu tượng:
* Vẽ và biến hình các công thức vi phân, tích phân, ma trận bằng mã nguồn $\LaTeX$ thực tế.
* Mô phỏng chuyển động trong không gian 2D và 3D với hệ trục tọa độ chính xác từng pixel.
* Tự động tính toán các đường cong Bezier và phép biến đổi afin (affine transformation).

#### B. Vị trí repo:
* **Repo:** [`editor video ai/04_Video/manim/`](file:///E:/DIEN%20APP/Skill%20AI/editor%20video%20ai/04_Video/manim/)

#### C. Mẫu kịch bản Python Manim (`templates/manim_scene_example.py`):
```python
from manim import *

class AIAlgorithmExplanation(Scene):
    def construct(self):
        # 1. Tiêu đề
        title = Text("Thuật Toán Tìm Đường A-Star", font_size=42, color=BLUE)
        self.play(Write(title))
        self.wait(1)
        self.play(title.animate.to_edge(UP))

        # 2. Công thức toán học Heuristic
        formula = MathTex(r"f(n) = g(n) + h(n)", font_size=60, color=YELLOW)
        box = SurroundingRectangle(formula, color=TEAL, buff=MED_LARGE_BUFF)
        
        self.play(Write(formula))
        self.play(Create(box))
        self.wait(2)

        # 3. Chú thích biến số
        desc_g = Text("g(n): Chi phí đoạn đường đã đi qua", font_size=24, color=GREEN).next_to(box, DOWN, buff=0.8)
        desc_h = Text("h(n): Dự đoán đoạn đường chim bay còn lại", font_size=24, color=GOLD).next_to(desc_g, DOWN, buff=0.3)
        
        self.play(FadeIn(desc_g), FadeIn(desc_h))
        self.wait(3)
```

#### D. Lệnh Render Manim sang MP4:
```bash
& "E:\DIEN APP\Xây Kênh Youtube\Tool render edit Video\.venv\Scripts\python.exe" -m manim -pqh templates/manim_scene_example.py AIAlgorithmExplanation
```
*(Cờ `-pqh`: Render chất lượng cao 1080p 60fps; Cờ `-pql`: Render nhanh 480p để kiểm tra layout).*

---

## 📌 PHẦN 3: BỘ SCRIPT THỰC THI SẴN SÀNG TRONG THƯ MỤC DỰ ÁN

Trong thư mục [`create and edit video/scripts/`](file:///E:/DIEN%20APP/Skill%20AI/create%20and%20edit%20video/scripts/), hệ thống đã chuẩn bị sẵn các bộ script Python đóng gói để Sếp chỉ cần chạy 1 dòng lệnh:

### 1. Script Cắt Khoảng Lặng Tự Động (`scripts/run_auto_editor.py`):
```bash
& "E:\DIEN APP\Xây Kênh Youtube\Tool render edit Video\.venv\Scripts\python.exe" "E:\DIEN APP\Skill AI\create and edit video\scripts\run_auto_editor.py" "file_can_cat.mp4" [margin_sec]
```

### 2. Script Render Remotion Đa Phân Cảnh (`scripts/run_remotion_render.py`):
```bash
& "E:\DIEN APP\Xây Kênh Youtube\Tool render edit Video\.venv\Scripts\python.exe" "E:\DIEN APP\Skill AI\create and edit video\scripts\run_remotion_render.py" "props.json" "output.mp4"
```

---

## 📌 PHẦN 4: LIÊN KẾT VỚI HỆ THỐNG REA (DỊCH NGƯỢC VIDEO APPS)

Khi Sếp gặp một phần mềm dựng video thương mại trên thị trường có tính năng hay (như Entervi, CapCut, vMix, AutoClip,...), Sếp có thể kết hợp dự án này với công cụ **REA (Reverse Engineer Anything)** tại [`E:\DIEN APP\Skill AI\rea\`](file:///E:/DIEN%20APP/Skill%20AI/rea/) để:
1. Mổ xẻ thuật toán xử lý âm thanh/hình ảnh ngầm của đối thủ.
2. Tái hiện lại mã nguồn sạch bằng Python/Node.js.
3. Tích hợp trực tiếp vào hệ thống `create and edit video` để làm giàu thêm kho công nghệ của công ty.

---
*Tài liệu hướng dẫn kỹ thuật chính thức của Dự án Create and Edit Video. Bản quyền thuộc hệ sinh thái Skill AI.*
