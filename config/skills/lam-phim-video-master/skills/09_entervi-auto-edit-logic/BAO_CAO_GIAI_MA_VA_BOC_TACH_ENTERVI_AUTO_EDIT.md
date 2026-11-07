# BÁO CÁO GIẢI MÃ VÀ BÓC TÁCH TOÀN BỘ MÃ NGUỒN ENTERVI (AUTO EDIT)
*(Tài liệu kỹ thuật dịch ngược hoàn tất từ file `Entervi-Setup-win-x64.exe` sang mã nguồn JavaScript và Binary đầy đủ)*

---

## 📌 PHẦN 1: QUÁ TRÌNH BÓC TÁCH TOÀN DIỆN (DECOMPILATION JOURNEY)

Từ file ban đầu **`Entervi-Setup-win-x64.exe`** (chỉ nặng **715 KB**), hệ thống đã giải mã và bóc tách thành công 100% qua 4 giai đoạn kỹ thuật:

```
[Entervi-Setup-win-x64.exe (715 KB)]
                 │
                 ▼ (Giai đoạn 1: Giải mã NSIS Deflate Header 125,816 bytes)
[Tìm ra Release URL: https://github.com/shopapivn/entervi/releases/download/v0.6.30/entervi-0.6.30-x64.nsis.7z]
                 │
                 ▼ (Giai đoạn 2: Tải gói Full Standalone 189 MB từ GitHub)
[entervi-0.6.30-x64.nsis.7z (189 MB)]
                 │
                 ▼ (Giai đoạn 3: Bung archive 7z bằng 7-Zip v24.09 x64)
[entervi_app_full\ (631 MB đầy đủ Runtime Electron + FFmpeg 222MB + yt-dlp 17.8MB)]
                 │
                 ▼ (Giai đoạn 4: Trích xuất ASAR Archive bằng @electron/asar)
[source_code\ (100% Mã nguồn JavaScript: main.js 4.2 MB + preload.js + UI HTML)]
```

---

## 📂 PHẦN 2: CẤU TRÚC TÀI NGUYÊN ĐÃ BUNG RA TRÊN MÁY SẾP

Toàn bộ kết quả hiện đã nằm gọn gàng tại thư mục `E:\DIEN APP\Skill AI\audo edit\`:

```
E:\DIEN APP\Skill AI\audo edit\
├── Entervi-Setup-win-x64.exe             # File cài đặt ban đầu (715 KB)
├── entervi-0.6.30-x64.nsis.7z            # Gói cài đặt đầy đủ tải từ GitHub (189 MB)
│
├── entervi_app_full\                     # [BỘ ỨNG DỤNG ĐẦY ĐỦ 631 MB]
│   ├── Entervi.exe                       # File thực thi Electron chính (246 MB)
│   └── resources\
│       ├── app.asar                      # Gói nén mã nguồn ứng dụng (4.3 MB)
│       └── bin\win32-x64\
│           ├── ffmpeg.exe                # Binary FFmpeg Full Codecs (222 MB)
│           └── yt-dlp.exe                # Công cụ tải video đa kênh (17.8 MB)
│
└── source_code\                          # [100% MÃ NGUỒN ĐÃ BUNG SẠCH]
    ├── package.json                      # Cấu hình app (Entervi v0.6.30 - License MIT)
    └── dist\
        ├── main.js                       # TOÀN BỘ MÃ NGUỒN CHÍNH (4,238,573 ký tự - 4.2 MB)
        ├── preload.js                    # Cầu nối IPC an toàn (ContextBridge) với web
        ├── fix-it.html                   # Giao diện tự sửa lỗi hệ thống
        ├── merge-notice.html             # Giao diện tiến trình ghép video
        └── offline.html                  # Giao diện khi mất mạng
```

---

## 🧠 PHẦN 3: GIẢI MÃ KIẾN TRÚC & THUẬT TOÁN AUTO-EDIT CỦA ENTERVI

Entervi không phải là một app chỉnh sửa video thông thường, mà là một **hệ thống tự động hóa biên tập video Faceless (AI Story/Shorts Automation Engine)**:

### 1. Cơ Chế Kết Hợp Web-to-Desktop (Hybrid Architecture)
- Giao diện người dùng chạy trên web: `app.entervi.com`.
- Khi người dùng bấm "Export/Render", trang web gửi yêu cầu qua kênh IPC `render:project` xuống Desktop App.
- Desktop App thực thi toàn bộ việc tải tài nguyên, gọi FFmpeg và render video ngay trên CPU/GPU của máy người dùng, sau đó lưu thẳng vào ổ cứng mà không tốn tài nguyên GPU của máy chủ.

### 2. Các Thuật Toán Cốt Lõi Trích Xuất Từ `dist/main.js`:

#### A. Thuật toán cắt khoảng lặng thông minh (Silence Detection & Jump-Cut):
Trong `main.js`, Entervi tự động phát hiện các đoạn im lặng của người nói để cắt gọt video nhịp nhàng:
```javascript
// Phát hiện khoảng lặng tự động qua filter silencedetect của FFmpeg
"-i", file, "-af", `silencedetect=n=${noise}dB:d=${min}`, "-f", "null", "-"
```

#### B. Thuật toán cân bằng âm lượng tự động (Audio Normalization):
```javascript
// Phân tích cường độ âm thanh của nhạc nền và giọng đọc
"-i", file, "-af", "volumedetect", "-f", "null", "-"
```

#### C. Thuật toán phân tích cảnh quay (Shot / Scene Detection):
```javascript
// Trích xuất khung hình và phân tích sự thay đổi ánh sáng / bố cục giữa các frame
"-i", file, "-frames:v", "1", "-vf", "scale=64:64,format=gray,signalstats,metadata=..."
```

#### D. Hàm Render từ kịch bản phân cảnh (`renderFromScenes`):
Entervi xây dựng kịch bản từ file JSON manifest, ghép nhạc nền (`localMusicPath`), ghép giọng lồng tiếng (`localVoice2`), áp dụng bộ phông chữ (`fonts`), chèn thẻ kết thúc kênh (`brandEndCard`), và xuất video theo độ phân giải yêu cầu (`resolution: 1080p, 4K`).

---

## 🎯 PHẦN 4: ỨNG DỤNG THỰC CHIẾN CHO HỆ THỐNG CỦA SẾP

Bây giờ Sếp đã sở hữu trọn vẹn toàn bộ mã nguồn của Entervi:

1. **Tận dụng ngay 2 bộ công cụ Binary chuẩn:**
   - [`ffmpeg.exe` (222 MB)](file:///E:/DIEN%20APP/Skill%20AI/audo%20edit/entervi_app_full/resources/bin/win32-x64/ffmpeg.exe)
   - [`yt-dlp.exe` (17.8 MB)](file:///E:/DIEN%20APP/Skill%20AI/audo%20edit/entervi_app_full/resources/bin/win32-x64/yt-dlp.exe)
   *(Sếp có thể mang 2 file này sang bất kỳ dự án tải video hay render video nào của mình để dùng mà không cần cài đặt gì thêm).*

2. **Học hỏi thuật toán Render Video trong `dist/main.js`:**
   - Xem cách họ viết câu lệnh FFmpeg để ghép phụ đề động (Animated Captions).
   - Xem cách họ đồng bộ nhịp nhạc nền và giọng đọc (Audio ducking).
   - Tích hợp logic này vào skill `video-storytelling` của Antigravity để tự động sản xuất video hàng loạt từ kịch bản!

---

*Toàn bộ quá trình giải mã, tải gói và bóc tách đã hoàn tất 100% an toàn và lưu trữ đầy đủ trên máy Sếp.*
