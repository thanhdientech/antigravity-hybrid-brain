---
name: ai-video-studio
description: "Phần mềm edit video AI chạy trên máy (macOS/Windows) của Nguyễn Tất Kiểm: 90 template, 200 khối HyperFrames, Whisper bám phụ đề, B-roll tự động & Telegram agent."
group: "Làm Phim & Video AI"
---

# 🎬 AI Video Studio — Local AI Video Editor & Automation Engine (SKILL.md)

<!-- JAVIS_TRIGGER_ARCHIVE_START -->
## Khi nào dùng (Triggers & Ngữ cảnh kích hoạt đầy đủ)

> Sử dụng khi người dùng muốn biên tập video bằng giao diện trực quan timeline (giống CapCut/Premiere nhưng chạy web local), cần áp dụng 90 template dựng sẵn (Bất động sản, Khóa học, Review, Bán hàng, Tin tức, AI, Podcast), tự động nhận dạng giọng nói bám phụ đề tiếng Việt offline bằng `faster-whisper`, chèn hiệu ứng hoạt ảnh động (~200 khối HyperFrames GSAP/Three.js), chèn b-roll thông minh, tạo video từ chủ đề không cần quay, hoặc vận hành chế độ tự lái (Autopilot) và bot Telegram biên tập tự động. TRIGGERS: "ai video studio", "studio video", "nguyen tat kiem video", "edit video local", "hyperframes", "template video bds", "template video khoa hoc", "faster-whisper sub", "auto broll", "video autopilot", "telegram video agent", "edit video tren may", "video editor timeline local".
<!-- JAVIS_TRIGGER_ARCHIVE_END -->

- **Nguồn gốc / Tác giả:** Nguyễn Tất Kiểm (`nguyentatkiem/ai-video-studio`, MIT License).
- **Vị trí cài đặt trên máy:**
  - Kho mã nguồn: [`E:\DIEN APP\Skill AI\ai-video-studio\`](file:///E:/DIEN%20APP/Skill%20AI/ai-video-studio/)
  - Thư mục dữ liệu & clip người dùng: `%USERPROFILE%\.ai-video-studio\`

---

## 📌 1. TỔNG QUAN KIẾN TRÚC & ĐIỂM MẠNH VƯỢT TRỘI

AI Video Studio là giải pháp **Full-Stack Video Editing & Automation** kết hợp giữa giao diện Web Timeline chuyên nghiệp và hệ thống script xử lý ngầm Node.js + Python + FFmpeg chạy hoàn toàn cục bộ trên máy tính.

```
                               ┌────────────────────────────────────────────────────────┐
                               │           AI VIDEO STUDIO (LOCAL ENGINE)               │
                               └───────────────────────────┬────────────────────────────┘
                                                           │
         ┌─────────────────────┬───────────────────────────┼───────────────────────────┬─────────────────────┐
         ▼                     ▼                           ▼                           ▼                     ▼
┌─────────────────┐   ┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐   ┌─────────────────┐
│  WEB TIMELINE   │   │  WHISPER SUB    │         │  90 TEMPLATES   │         │ 200 HYPERFRAMES │   │  RENDER ENGINE  │
│  (Port 5186)    │   │  (Python Local) │         │  (9 Ngành Hàng) │         │ (GSAP/Three.js) │   │ (Chrome+FFmpeg) │
├─────────────────┤   ├─────────────────┤         ├─────────────────┤         ├─────────────────┤   ├─────────────────┤
│ • Giao diện tối │   │ • faster-whisper│         │ • Bất động sản  │         │ • Demo App/SaaS │   │ • Headless      │
│ • Đa track clip │   │ • Bám từng từ   │         │ • Khóa học/EdTech│        │ • Số liệu/Chart │   │   Chromium 60fps│
│ • Keyframe tự do│   │ • Voice clean   │         │ • Review/Unbox  │         │ • Social proof  │   │ • FFmpeg ghép   │
│ • Mặt nạ, phông │   │ • Cắt nói lặp,  │         │ • Bán hàng/Ads  │         │ • Chuyển cảnh   │   │   nhạc, SFX     │
│   xanh, màu sắc │   │   nói vấp       │         │ • Tin tức/AI    │         │ • Badge/Logo    │   │ • 1080p/4K nét  │
└─────────────────┘   └─────────────────┘         └─────────────────┘         └─────────────────┘   └─────────────────┘
```

---

## 📌 2. DANH MỤC 9 NHÓM TEMPLATE & 28 STYLE PACKS

Hệ thống tích hợp sẵn **90 Template có video xem trước** chia đều theo 9 nhóm ngành thực chiến:
1. **Bất Động Sản:** Thẻ thông số dự án, mặt bằng căn hộ, giá bán nổi bật, bản đồ vị trí.
2. **Khóa Học & E-Learning:** Slide bài giảng, tiêu đề động, tóm tắt ý chính 3 gạch đầu dòng.
3. **Review Sản Phẩm:** Hộp thông số cấu hình, ưu nhược điểm (Pros/Cons), chấm điểm rating.
4. **Bán Hàng & Quảng Cáo:** Flash sale countdown, CTA mua hàng, ưu đãi giới hạn, testimonial.
5. **Tin Tức & Thời Sự:** Ticker chạy chữ tin tức, breaking news badge, chia đôi màn hình phỏng vấn.
6. **AI & Công Nghệ:** HUD công nghệ cao, khung code IDE, giải thích thuật toán.
7. **Chia Sẻ & Lời Khuyên:** Dạng podcast solo, trích dẫn danh ngôn, tips & tricks 3 bước.
8. **Doanh Nghiệp & Thương Hiệu:** Giới thiệu công ty, tầm nhìn sứ mệnh, profile lãnh đạo.
9. **Khác & Giải Trí:** Top list bảng xếp hạng, trước/sau biến hình, ảnh theo nhịp nhạc.

---

## 📌 3. HƯỚNG DẪN KHỞI CHẠY & THỰC THI

### 🚀 Cách 1 — Mở Giao Diện Web Editor Local:
Chạy script launcher Windows:
```cmd
cd "E:\DIEN APP\Skill AI\ai-video-studio"
studio.cmd
```
Hoặc mở trực tiếp bằng Node.js:
```bash
node studio/server.mjs --open
# Trình duyệt tự động mở http://localhost:5186
```

### 🎬 Cách 2 — Tạo Dự Án Mới Từ Video Thô (Chế Độ Tự Lái - Autopilot):
Thả video thô vào để studio tự nhận diện phụ đề, chèn B-roll, ghép nhạc và xuất video:
```cmd
studio.cmd --new "C:\duong\dan\video_tho.mp4"
```

### 🎙️ Cách 3 — Nhận Dạng Giọng Nói & Xuất Phụ Đề Nhanh (faster-whisper):
```bash
python scripts/transcribe.py "C:\duong\dan\video.mp4" --output "captions.json"
```

### ✂️ Cách 4 — Lọc Tạp Âm & Cắt Bỏ Đoạn Nói Vấp:
```bash
python scripts/voice_clean.py "C:\duong\dan\audio.wav" --output "audio_clean.wav"
```

---

## 📌 4. BẢO TRÌ & ĐỒNG BỘ MÁY KHÁC (PORTABLE & NO HARDCODE)
- Toàn bộ source code nằm trong repo Git chuẩn MIT, không phụ thuộc cứng vào ổ cứng nào.
- Dữ liệu người dùng (cache, dự án đã dựng, token bot) lưu riêng tại `%USERPROFILE%\.ai-video-studio`, đảm bảo khi update/pull repo không bị mất dữ liệu.
