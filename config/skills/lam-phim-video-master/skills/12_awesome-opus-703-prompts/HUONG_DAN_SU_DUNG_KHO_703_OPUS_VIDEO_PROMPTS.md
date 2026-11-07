# BÁCH KHOA TOÀN THƯ 703 PROMPTS "CODE-AS-VIDEO" (AWESOME OPUS 5.5 VIDEOS)
## Cẩm Nang Thực Chiến: Biến Code JavaScript/HTML/Canvas/Three.js Thành Video Triệu View Cùng AI Agent

> **Kho mã nguồn gốc:** [yihui-dev/awesome-opus5-5-videos](https://github.com/yihui-dev/awesome-opus5-5-videos)  
> **Nền tảng xem trực tiếp 418 video remake:** [Skillry AI Videos](https://skillry.dev/ai-videos/opus-5-5)  
> **Vị trí lưu trữ cục bộ trên máy:** [`E:\DIEN APP\Skill AI\awesome-opus5-5-videos\`](file:///E:/DIEN%20APP/Skill%20AI/awesome-opus5-5-videos/)  
> **Công cụ tìm kiếm siêu tốc:** [`search_prompts.py`](file:///E:/DIEN%20APP/Skill%20AI/awesome-opus5-5-videos/search_prompts.py)  

---

## 🌟 1. TẠI SAO TRÀO LƯU "CODE-AS-VIDEO" BÙNG NỔ?

Trước đây, khi làm video AI, đa số người dùng phụ thuộc vào các mô hình tạo video khuếch tán (Diffusion Models như Veo 3, Sora, Kling, Runway Gen-3, Hailuo). Tuy nhiên, các mô hình này tồn tại 4 nhược điểm chí mạng:
1. **Lỗi chữ & số:** Chữ tiếng Việt và số liệu thống kê luôn bị méo mó, biến dạng hoặc sinh ra ký tự vô nghĩa (AI Hallucination).
2. **Chi phí & Thời gian:** Render mỗi 5-10 giây tốn nhiều credit và thời gian chờ đợi lâu.
3. **Thiếu tính xác định (Non-deterministic):** Rất khó kiểm soát chính xác từng khung hình (frame-by-frame) hay đường đi của camera.
4. **Độ phân giải bị nén:** Thường chỉ đạt 720p - 1080p với artifact mờ nhòe.

**GIẢI PHÁP ĐỘT PHÁ CỦA CLAUDE OPUS 5.5 / GEMINI:**
Thay vì sinh pixel video, AI viết ra **MÃ NGUỒN CHUYỂN ĐỘNG (HTML5, Canvas, SVG, Three.js, GSAP, GLSL Shaders)** đóng gói trong 1 file HTML duy nhất:
- **Độ nét vô hạn:** Vector SVG và WebGL hiển thị sắc nét đến 4K/8K.
- **Typography hoàn hảo:** Chữ tiếng Việt, tiêu đề, số liệu chính xác 100%.
- **Chạy thời gian thực:** Mở file HTML là chạy mượt mà 60fps trên mọi trình duyệt.
- **Dễ dàng xuất video:** Dùng Puppeteer / FFmpeg / Screen Recorder hoặc nạp vào Remotion để xuất MP4 chất lượng cao.

---

## 📊 2. BẢN ĐỒ DỮ LIỆU KHO 703 PROMPTS

Toàn bộ 703 video và prompts được phân bổ theo 4 nhóm lớn:

```
                              ┌────────────────────────────────────────────────────────┐
                              │            703 OPUS 5.5 VIDEO PROMPTS MASTER           │
                              └───────────────────────────┬────────────────────────────┘
                                                          │
         ┌────────────────────────┬───────────────────────┴───────────────────────┬────────────────────────┐
         ▼                        ▼                                               ▼                        ▼
┌───────────────────┐    ┌───────────────────┐                           ┌───────────────────┐    ┌───────────────────┐
│  MOTION GRAPHICS  │    │     3D SCENES     │                           │     EXPLAINER     │    │    INTERACTIVE    │
│    (369 Videos)   │    │    (117 Videos)   │                           │    (116 Videos)   │    │    (101 Videos)   │
├───────────────────┤    ├───────────────────┤                           ├───────────────────┤    ├───────────────────┤
│ • SaaS Launch     │    │ • Three.js World  │                           │ • Giải thích KH   │    │ • Game 3D chơi    │
│ • UI Dribbble     │    │ • Minecraft City  │                           │ • Lịch sử / Bản đồ│    │   ngay trên web   │
│ • Kinetic Typo    │    │ • Sci-Fi HUD      │                           │ • Pha chế Cocktail│    │ • Mô phỏng hạt bi │
│ • Biến hình Logo  │    │ • Đua xe Retro    │                           │ • Sơ đồ Chip AI   │    │ • Audio Visualizer│
└───────────────────┘    └───────────────────┘                           └───────────────────┘    └───────────────────┘
```

### 🛠️ Phân Bố Theo Công Nghệ (Tech Stacks):
- **Canvas (267 videos):** Vẽ đồ họa chuyển động 2D, hạt particle, hiệu ứng chất lỏng.
- **SVG (183 videos):** Icon chuyển động, giao diện phẳng, viền neon, biến hình vector.
- **Three.js (131 videos):** Không gian 3D, camera quay quanh vật thể, ánh sáng đổ bóng.
- **GLSL Shaders (92 videos):** Hiệu ứng cực quang, sóng nước ma mị, bẻ cong không gian.
- **GSAP (86 videos):** Chuỗi timeline điều khiển nhịp điệu chuyên nghiệp chuẩn Hollywood.
- **CSS Animations (57 videos):** Hiệu ứng nhẹ, mượt, không tốn tài nguyên.
- **Web Audio (39 videos):** Tự tổng hợp âm thanh bằng code không sợ dính bản quyền.
- **Playable Games (22 videos):** Game web tương tác hoàn chỉnh.

---

## 🔍 3. HƯỚNG DẪN DÙNG CÔNG CỤ TÌM KIẾM PROMPT SIÊU TỐC

Em đã tích hợp sẵn công cụ CLI [`search_prompts.py`](file:///E:/DIEN%20APP/Skill%20AI/awesome-opus5-5-videos/search_prompts.py) trên máy để Sếp có thể tra cứu nhanh:

### Cú pháp lệnh:
```bash
# 1. Tìm prompt theo từ khóa (Ví dụ: "saas", "cocktail", "finance", "game"):
python "E:\DIEN APP\Skill AI\awesome-opus5-5-videos\search_prompts.py" -q "saas"

# 2. Lọc theo Danh mục (motion, 3d, explainer, interactive):
python "E:\DIEN APP\Skill AI\awesome-opus5-5-videos\search_prompts.py" -c "explainer" -l 5

# 3. Lọc theo Công nghệ (gsap, threejs, canvas, shader):
python "E:\DIEN APP\Skill AI\awesome-opus5-5-videos\search_prompts.py" -t "threejs" -l 3

# 4. Xuất định dạng JSON để tích hợp vào tool:
python "E:\DIEN APP\Skill AI\awesome-opus5-5-videos\search_prompts.py" -q "launch" --json
```

---

## 💡 4. TOP 4 MẪU PROMPT KINH ĐIỂN NHẤT CẦN BIẾT

### 🚀 Mẫu 1: Ra Mắt Sản Phẩm SaaS Đỉnh Cao (Motion Graphics)
* **Tác giả:** `@moritzkremb` | **Công nghệ:** SVG + GSAP
* **Prompt gốc:**
  > *"I want you to create a highly professional SaaS product launch video. Go and find some SaaS, preferably just one that people know, so it's easier to identify with it. Pick that, and then make sure to get actual assets and images and all of that stuff from the internet. Turn it into these typical, very professionally edited, motion-graphics-styled product launch videos that you see people making on Twitter when they launch new SaaS products (which are showing off the features, the benefits, and all of these things)."*

### 🌌 Mẫu 2: Thế Giới 3D Tương Tác Trong Tranh Van Gogh (3D / Interactive)
* **Tác giả:** `@MandelDuck` | **Công nghệ:** Three.js + GLSL Shader + Canvas
* **Prompt gốc:**
  > *"Can you make a 3D game where you walk around and spot cats inside of a Van Gogh painting? We can start with Starry Night and its town..."*

### 🍹 Mẫu 3: Video Giải Thích Quy Trình Từng Bước (Explainer Video)
* **Tác giả:** `@Ror_Fly` | **Công nghệ:** HTML5 Canvas
* **Prompt gốc:**
  > *"Do you think you could render a recipe motion graphic animation using javascript or html to show the full recipe from start to finish (empty glass to completed cocktail) - Explainer video style - Showing the recipe ingredients + measurements as they're going into the cup. Should be a 30s video."*

### 🎶 Mẫu 4: Music Video Pop Nghệ Thuật Kết Hợp AI & Code (Motion + Seedance 2.5)
* **Tác giả:** `@anabology` | **Công nghệ:** Canvas + JS + Image Gen
* **Prompt gốc:**
  > *"I want you to independently do an end-to-end complete pass on making an updated version of this video... Use JavaScript animations with a papery feel... push the aesthetics in any direction you want... We need a very strong, compelling visual hook that gets people excited..."*

---

## 🎯 5. KẾT NỐI VỚI HỆ SINH THÁI VIDEO HIỆN CÓ CỦA CHÚNG TA

| Công cụ hiện có | Kết hợp với kho 703 Prompts này như thế nào? |
| :--- | :--- |
| **Remotion (React/TS)** | Biến các code snippet Canvas/SVG/GSAP từ prompt thành Component React có time control và render trực tiếp ra MP4 4K. |
| **Motion Canvas** | Dùng cấu trúc kịch bản từ các prompt explainer để viết hoạt ảnh giải thích toán học/thuật toán bằng generator function `yield*`. |
| **Auto-Editor** | Cắt gọt khoảng lặng audio/podcast trước khi đưa vào video code để đảm bảo nhịp điệu dồn dập, giữ chân người xem. |
| **Editly** | Đóng gói các cảnh Canvas/SVG render thành spec JSON để nối hàng loạt video tự động. |
