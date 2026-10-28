# Đặc Tả Kiến Trúc Recordly v1.4.0, Schema Dự Án `.recordly` (Version 2) & Native CLI Binaries

## 1. Cấu Trúc Thư Mục Cài Đặt & Native Binaries Của Recordly (`%LOCALAPPDATA%\Programs\Recordly`)

Recordly (nền tảng Electron + Chromium + Native C++/Rust helpers) đóng gói sẵn trọn bộ công cụ quay màn hình, theo dõi chuột, nhận diện giọng nói và xuất video GPU ngay trong thư mục `resources\app.asar.unpacked`:

| Thành phần thực thi | Đường dẫn tương đối từ thư mục cài đặt Recordly | Chức năng kỹ thuật cốt lõi |
| :--- | :--- | :--- |
| **`Recordly.exe`** | `Recordly.exe` | Ứng dụng chính quản lý quay màn hình, trình dựng Auto-Zoom và chế độ xuất tự động `RECORDLY_SMOKE_EXPORT=1`. |
| **`wgc-capture.exe`** | `resources\app.asar.unpacked\electron\native\bin\win32-x64\wgc-capture.exe` | Bộ quay màn hình / cửa sổ gốc Windows Graphics Capture (`Direct3D11` + `Media Foundation` H.264 60fps + `WASAPI` loopback/mic). |
| **`cursor-monitor.exe`** | `resources\app.asar.unpacked\electron\native\bin\win32-x64\cursor-monitor.exe` | Tiến trình đọc trạng thái hình dạng con trỏ chuột Win32 (`STATE:arrow`, `STATE:pointer`, `STATE:text`) theo thời gian thực. |
| **`whisper-cli.exe`** | `resources\app.asar.unpacked\electron\native\bin\win32-x64\whisper-cli.exe` | Động cơ `whisper.cpp` chạy offline giúp bóc băng giọng nói từ video hướng dẫn ra phụ đề `.srt` / JSON. |
| **`recordly-gpu-export.exe`** | `resources\app.asar.unpacked\electron\native\bin\win32-x64\recordly-gpu-export.exe` | Bộ kết xuất khung hình tốc độ cao bằng GPU (kèm `recordly-nvidia-cuda-compositor.exe` cho card NVIDIA). |
| **`ffmpeg.exe` & `ffprobe.exe`** | `resources\app.asar.unpacked\node_modules\ffmpeg-static\ffmpeg.exe` | Bộ xử lý ghép luồng âm thanh, cắt ghép và đo thời lượng media dự phòng khi máy chưa cài FFmpeg toàn cục. |

---

## 2. Đặc Tả JSON Schema Tệp Dự Án `.recordly` (`EditorProjectData` — `PROJECT_VERSION = 2`)

Một tệp `.recordly` hợp lệ là tệp văn bản JSON mã hóa `UTF-8` tuân thủ cấu trúc gốc `EditorProjectData` của Recordly:

```json
{
  "version": 2,
  "projectId": "tutorial-demo-001",
  "videoPath": "C:/Videos/raw_demo.mp4",
  "editor": {
    "aspectRatio": "16:9",
    "padding": { "top": 20, "bottom": 20, "left": 20, "right": 20, "linked": true },
    "borderRadius": 8,
    "shadowIntensity": 0.67,
    "showCursor": true,
    "cursorStyle": "tahoe",
    "cursorClickEffect": "ripple",
    "connectZooms": true,
    "zoomInEasing": "recordly",
    "zoomOutEasing": "recordly",
    "zoomRegions": [],
    "audioRegions": [],
    "autoCaptions": [],
    "autoCaptionSettings": {},
    "annotationRegions": []
  }
}
```

### Quy ước 4 mảng dữ liệu quan trọng nhất khi làm Video Hướng Dẫn Chức Năng (`Tutorial Regions`)

1. **`zoomRegions` (`ZoomRegion[]`) — Phóng to tự động vào vùng chức năng đang giải thích:**
   - `id`: Chuỗi định danh duy nhất (`"zoom-1"`, `"zoom-2"`...).
   - `startMs`, `endMs`: Thời điểm bắt đầu và kết thúc phóng to tính bằng mili-giây (`endMs > startMs`).
   - `depth`: Cấp độ phóng to số nguyên từ `1` đến `6` tương ứng tỷ lệ (`1 -> 1.25x`, `2 -> 1.5x`, `3 -> 1.8x`, `4 -> 2.2x`, `5 -> 3.5x`, `6 -> 5.0x`). Khi quay hướng dẫn phần mềm/ERP, mức `2` (`1.5x`) và `3` (`1.8x`) giúp chữ sắc nét mà không mất ngữ cảnh xung quanh.
   - `focus`: `{ "cx": 0.0..1.0, "cy": 0.0..1.0 }` — Tọa độ tâm phóng to chuẩn hóa theo chiều ngang (`0` trái $\rightarrow$ `1` phải) và chiều dọc (`0` trên $\rightarrow$ `1` dưới).
   - `mode`: `"manual"` hoặc `"auto"`.

2. **`audioRegions` (`AudioRegion[]`) — Chèn Track Giọng Đọc AI Thuyết Minh Giải Thích:**
   - `id`: `"audio-1"`, `"audio-2"`...
   - `startMs`, `endMs`: Mốc mili-giây bắt đầu và kết thúc đoạn thuyết minh trên timeline.
   - `audioPath`: Đường dẫn tới tệp âm thanh thuyết minh `.mp3` hoặc `.wav`.
   - `volume`: Âm lượng từ `0.0` đến `1.0` (mặc định `1.0` cho giọng đọc hướng dẫn).
   - `normalize`: `true` hoặc `false`, `trackIndex`: `0`.

3. **`autoCaptions` (`CaptionCue[]`) & `autoCaptionSettings` — Phụ Đề Động Karaoke Trên Màn Hình:**
   - Mỗi phần tử trong `autoCaptions` gồm `{ "id": "caption-1", "startMs": 400, "endMs": 3600, "text": "Bước 1...", "words": [{ "text": "Bước", "startMs": 400, "endMs": 680, "leadingSpace": false }] }`.
   - Lưu ý ràng buộc chuẩn hóa của Recordly: `word.startMs` phải nằm trong `[cue.startMs, cue.endMs - 1]` và `word.endMs` nằm trong `[word.startMs + 1, cue.endMs]`.
   - `autoCaptionSettings`: Đặt `"enabled": true`, `"language": "vi"`, `"animationStyle": "fade"` (hoặc `"none" | "rise" | "pop"`), `"fontSize": 30`, `"bottomOffset": 4`, `"maxWidth": 72`, `"maxRows": 2`, `"backgroundOpacity": 0.88`.

4. **`annotationRegions` (`AnnotationRegion[]`) — Hộp Nhãn Bước, Mũi Tên Chỉ Dẫn & Làm Mờ Bảo Mật (`Blur`):**
   - `type`: `"text"` (nhãn tiêu đề bước), `"figure"` (mũi tên chỉ hướng `arrowDirection`: `"up" | "down" | "left" | "right" | "up-right" | "up-left" | "down-right" | "down-left"`), hoặc `"blur"` (`blurIntensity`: `20..40` để che mật khẩu, số dư, dữ liệu nhạy cảm).
   - `position`: `{ "x": 0..100, "y": 0..100 }`, `size`: `{ "width": 1..100, "height": 1..100 }` (theo phần trăm khung hình).

---

## 3. Giao Thức Quay Màn Hình CLI `wgc-capture.exe` & Xuất Tự Động `RECORDLY_SMOKE_EXPORT=1`

### Giao thức JSON & Stdin của `wgc-capture.exe`
- Truyền cấu hình JSON qua đối số đầu tiên `argv[1]`:
  `wgc-capture.exe "{\"outputPath\":\"C:\\out\\raw.mp4\",\"displayId\":0,\"fps\":60,\"captureSystemAudio\":false,\"captureMic\":false}"`
- Hoặc truyền `"windowHandle": <HWND_số_nguyên>` để chỉ quay riêng 1 cửa sổ phần mềm/trình duyệt mà không lộ màn hình Desktop.
- Khi tiến trình in ra dòng `"Recording started"` trên `stdout` là phiên ghi hình đã bắt đầu.
- Điều khiển qua `stdin`: gửi `"pause\n"` để tạm dừng, `"resume\n"` để quay tiếp, và `"stop\n"` để đóng gói an toàn tệp H.264 `.mp4` (in ra `"Recording stopped. Output path: ..."`).

### Chế độ xuất MP4 tự động bằng biến môi trường `RECORDLY_SMOKE_EXPORT`
Khi khởi chạy `Recordly.exe` kèm các biến môi trường sau, Recordly sẽ tự nạp dự án `.recordly`, render toàn bộ hiệu ứng Auto-Zoom + Cursor + Wallpaper + Voiceover + Captions ra tệp `.mp4`, ghi báo cáo `.smoke-report.json` và tự đóng cửa sổ:
- `RECORDLY_SMOKE_EXPORT=1`
- `RECORDLY_SMOKE_EXPORT_PROJECT=<đường_dẫn_tuyệt_đối_tới_file.recordly>`
- `RECORDLY_SMOKE_EXPORT_OUTPUT=<đường_dẫn_tuyệt_đối_tới_out.mp4>`
- Tùy chọn tinh chỉnh: `RECORDLY_SMOKE_EXPORT_FPS=60`, `RECORDLY_SMOKE_EXPORT_QUALITY=good`, `RECORDLY_SMOKE_EXPORT_ENCODING_MODE=balanced`.
