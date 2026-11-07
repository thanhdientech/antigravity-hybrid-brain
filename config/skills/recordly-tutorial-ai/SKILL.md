---
name: recordly-tutorial-ai
description: "Quay màn hình hướng dẫn chức năng với Recordly: tự tạo giọng đọc AI giải thích, xuất phụ đề .SRT, Auto-Zoom & render MP4."
group: "Sản Xuất Phim, Video & Đồ Họa AI"
---

# Recordly Screen Tutorial & AI Voiceover `.SRT` Producer (`recordly-tutorial-ai`)

<!-- JAVIS_TRIGGER_ARCHIVE_START -->
## Khi nào dùng (Triggers & Ngữ cảnh kích hoạt đầy đủ)

> Sử dụng skill này khi người dùng muốn quay màn hình hướng dẫn sử dụng phần mềm, ERP, SAP, website hoặc tính năng ứng dụng bằng Recordly (`Recordly.exe`, `wgc-capture.exe`), kết hợp AI tự động đọc lời bình giải thích từng bước (`edge-tts` giọng Tiếng Việt `vi-VN-HoaiMyNeural`, `vi-VN-NamMinhNeural` hoặc đa ngôn ngữ), tự sinh file phụ đề `.srt` / `.vtt` khớp từng mili-giây, tự đóng gói dự án `.recordly` (Auto-Zoom vùng click, mũi tên chỉ dẫn, làm mờ dữ liệu nhạy cảm, phụ đề karaoke `autoCaptions`, track âm thanh `audioRegions`) và xuất video `.mp4` hoàn chỉnh.
> TRIGGERS: "recordly", "quay màn hình hướng dẫn", "quay man hinh huong dan", "video hướng dẫn chức năng", "video huong dan phan mem", "quay tutorial", "screen tutorial", "tạo srt thuyết minh", "tao srt doc giai thich", "lồng tiếng video quay màn hình", "long tieng video huong dan", "auto zoom recordly", "phụ đề srt hướng dẫn", "wgc-capture", "recordly_tutorial_pipeline".
<!-- JAVIS_TRIGGER_ARCHIVE_END -->

- **Nguồn gốc / Kho Git Upstream:** [recordly-ai/recordly-engine (Video Tutorial AI)](https://github.com/recordly-ai/recordly-engine) (`Video Tutorial Automation`)

## 1. Bảng Điều Phối Tài Liệu & Công Cụ Thực Thi (`references/` & `scripts/`)

| Hạng Mục Thực Thi | Tệp Tham Chiếu / Công Cụ | Nội Dung Cốt Lõi |
| :--- | :--- | :--- |
| **CLI Điều Phối Khép Kín** | [`scripts/recordly_tutorial_pipeline.py`](./scripts/recordly_tutorial_pipeline.py) | Tự dò `Recordly.exe`, quay màn hình `wgc-capture.exe`, đọc giọng AI `edge-tts`, sinh `.srt`/`.vtt`, đóng gói `.recordly` v2 & đốt phụ đề MP4. |
| **Cấu Trúc `.recordly` v2 & Native Binaries** | [`references/01-kien-truc-recordly-schema-v2.md`](./references/01-kien-truc-recordly-schema-v2.md) | Đặc tả JSON `PROJECT_VERSION = 2` (`zoomRegions`, `audioRegions`, `autoCaptions`, `annotationRegions`), `wgc-capture` & `RECORDLY_SMOKE_EXPORT`. |
| **Quy Trình Quay Hướng Dẫn + AI `.SRT`** | [`references/02-quy-trinh-quay-huong-dan-ai-srt-voiceover.md`](./references/02-quy-trinh-quay-huong-dan-ai-srt-voiceover.md) | SOP 2 luồng thực chiến (Quay tay trên Recordly hoặc Quay tự động CLI), chuẩn viết lời giải thích ngắn gọn & đồng bộ mốc giây `.srt`. |
| **Mẫu Kịch Bản JSON Đa Bước** | [`examples/sample_tutorial_steps.json`](./examples/sample_tutorial_steps.json) | Mẫu khai báo mốc giây `start_sec`, lời đọc giải thích `text`, tọa độ phóng to `zoom` (`cx`, `cy`, `depth`) và nhãn chỉ dẫn `callout`. |

---

## 2. Hai Luồng Sản Xuất Video Hướng Dẫn Chức Năng Thực Chiến

### Luồng A — Quay Thao Tác Trên `Recordly.exe` $\rightarrow$ AI Thuyết Minh Giải Thích & Xuất `.SRT` + `.MP4`
1. Người dùng quay thao tác chức năng bằng `Recordly.exe` (hoặc đưa video `.mp4` sẵn có).
2. Nếu video có lời nói nháp qua mic, dùng lệnh `transcribe` gọi `whisper-cli.exe` đi kèm Recordly để bóc băng mốc giây; hoặc lập file `steps.json` ghi mốc giây từng thao tác cần giải thích.
3. Chạy lệnh `build` trong [`scripts/recordly_tutorial_pipeline.py`](./scripts/recordly_tutorial_pipeline.py):
   - Gọi `edge-tts` (`vi-VN-HoaiMyNeural` / `vi-VN-NamMinhNeural`) đọc lời giải thích từng bước khớp đúng giây `start_sec`, tự động kiểm soát khoảng cách chống chồng giọng.
   - Xuất file phụ đề chuẩn **`.srt`** và **`.vtt`** đồng bộ từng mili-giây theo `WordBoundary`.
   - Sinh song song **file dự án `.recordly` v2** (nạp sẵn `audioRegions`, `autoCaptions`, `zoomRegions`, `annotationRegions` để mở chỉnh sửa trực quan hoặc render GPU qua `RECORDLY_SMOKE_EXPORT=1`) VÀ **file `.mp4` thành phẩm** (đã trộn thuyết minh + hạ âm nền + burn phụ đề Tiếng Việt sắc nét qua `FFmpeg`).

### Luồng B — Quay Màn Hình / Cửa Sổ Tự Động Qua CLI `wgc-capture.exe` + Tạo Hướng Dẫn Khép Kín
1. Dùng lệnh `capture` gọi trực tiếp `wgc-capture.exe` (Windows Graphics Capture 60fps H.264) kèm bộ ghi tọa độ chuột `.cursor.json` (`30Hz`) để ghi lại màn hình hoặc riêng 1 cửa sổ ứng dụng (`--hwnd`).
2. Chuyển video vừa quay sang lệnh `build` để tự động đóng gói Auto-Zoom, giọng đọc AI giải thích, phụ đề `.srt` và xuất `.mp4`.

---

## 3. Lệnh CLI Chuẩn & Quy Tắc Chống Lỗi (First-Time Right)

```powershell
# 1. Kiểm tra tự động toàn bộ môi trường Recordly, Native Binaries, FFmpeg & Edge-TTS
python scripts/recordly_tutorial_pipeline.py discover

# 2. Chạy kiểm thử khép kín End-to-End (Tạo video UI mẫu -> Giọng AI Việt -> .SRT -> .recordly -> .MP4)
python scripts/recordly_tutorial_pipeline.py --self-test

# 3. Lồng tiếng AI giải thích + tạo .SRT + sinh dự án .recordly Auto-Zoom + xuất MP4 đốt phụ đề
python scripts/recordly_tutorial_pipeline.py build --video raw_demo.mp4 --script examples/sample_tutorial_steps.json --voice vi-VN-HoaiMyNeural --burn-srt --outdir output_tutorial
```

- **Quy tắc Zero-PII & Đa máy:** Luôn tự động dò `%LOCALAPPDATA%\Programs\Recordly\Recordly.exe` hoặc biến môi trường `RECORDLY_EXE`; tuyệt đối không gán cứng tên tài khoản Windows cá nhân trong script hay file cấu hình.
- **Quy tắc sạch lời đọc:** Văn bản trong trường `text` dùng để đọc voiceover và hiển thị `.srt` phải ngắn gọn, rõ thao tác (*"Bấm nút Xuất Báo Cáo ở góc phải"*), không chèn ký tự markdown hay đường dẫn kỹ thuật dài.
