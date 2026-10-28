# Quy Trình Chuẩn Quay Màn Hình Hướng Dẫn Chức Năng Kết Hợp AI Giọng Đọc Giải Thích & Phụ Đề `.SRT`

## 1. Kiến Trúc Đồng Bộ Mốc Thời Gian 3 Lớp (`Screen Action` $\leftrightarrow$ `AI Voiceover` $\leftrightarrow$ `.SRT` Subtitles)

Vấn đề lớn nhất khi làm video hướng dẫn sử dụng phần mềm (Tutorial / Walkthrough / SOP Video) là **lệch nhịp giữa hình và tiếng** (giọng AI đọc sang bước 3 trong khi chuột trên màn hình mới đang ở bước 2, hoặc phụ đề `.srt` chạy nhanh/chậm hơn lời nói).

Pipeline `recordly_tutorial_pipeline.py` giải quyết triệt để bằng thuật toán đồng bộ 3 lớp:
1. **Neo cứng thời điểm bắt đầu từng thao tác (`Step Anchor Timestamp`):** Mỗi bước hướng dẫn có mốc `start_sec` tương ứng chính xác thời điểm con trỏ chuột chạm vào menu/nút bấm trên video gốc.
2. **Đo thời lượng thực tế & Chống đè câu (`Anti-Overlap Timeline Pacing`):**
   - Từng câu giải thích được tổng hợp qua `edge-tts` (`Communicate(..., boundary="WordBoundary")`) ra tệp âm thanh riêng và đo chính xác độ dài `duration_ms` bằng `ffprobe`.
   - Nếu `start_ms[i] + duration_ms[i] > start_ms[i+1] - 120ms`, hệ thống tự động cảnh báo hoặc tăng nhẹ tốc độ đọc (`rate="+12%"`..`"+25%"`) cho riêng câu dài đó, hoặc đẩy nhẹ điểm bắt đầu câu kế tiếp để **không bao giờ xảy ra hiện tượng 2 giọng đọc đè lên nhau**.
3. **Trích xuất `.SRT` & `CaptionCueWord` trực tiếp từ sự kiện `WordBoundary`:**
   - Thay vì ước lượng chữ theo độ dài ký tự, bộ tạo phụ đề cộng thẳng `offset_ms = actual_step_start_ms` vào từng mốc `WordBoundary` thực tế của giọng đọc Neural.
   - Nhờ đó, cả tệp phụ đề rời **`.srt` / `.vtt`** lẫn phụ đề động **`autoCaptions`** trong `.recordly` khớp 100% đến từng mili-giây với tiếng nói.

---

## 2. Danh Sách Giọng Đọc AI Neural Khuyên Dùng Cho Video Hướng Dẫn (`Edge-TTS Voices`)

| Mã giọng đọc (`--voice`) | Ngôn ngữ & Giới tính | Phong cách phù hợp |
| :--- | :--- | :--- |
| **`vi-VN-HoaiMyNeural`** *(Mặc định)* | Tiếng Việt — Nữ | Giọng sáng, rõ chữ, nhịp điệu thân thiện; rất hợp hướng dẫn phần mềm, Web, CRM, LMS, TMĐT. |
| **`vi-VN-NamMinhNeural`** | Tiếng Việt — Nam | Giọng trầm ấm, đĩnh đạc, chuyên gia; rất hợp hướng dẫn kỹ thuật ERP, SAP B1, SQL, Kế toán, Quản trị Server. |
| **`en-US-AriaNeural`** | Tiếng Anh (Mỹ) — Nữ | Giọng SaaS Product Demo hiện đại, tự nhiên cho video tài liệu sản phẩm quốc tế. |
| **`en-US-AndrewMultilingualNeural`** | Đa ngôn ngữ — Nam | Đọc mượt các câu pha trộn thuật ngữ chuyên ngành Tiếng Anh – Quốc tế. |

---

## 3. Quy Tắc Biên Tập Lời Giải Thích Hướng Dẫn Ngắn Gọn & Dễ Hiểu (`Tutorial Scriptwriting SOP`)

Khi AI biên soạn kịch bản `steps.json` từ video quay màn hình của người dùng, bắt buộc tuân thủ 5 nguyên tắc sư phạm phần mềm:
1. **Cấu trúc câu chuẩn `Vị trí + Hành động + Kết quả`:**
   - *Chuẩn:* `"Tại thanh công cụ góc trên bên phải, nhấn nút Xuất Excel để tải bảng đối chiếu tồn kho về máy."`
   - *Tránh:* Viết câu quá dài trên 30 từ hoặc lan man lý thuyết khi màn hình đã chuyển sang thao tác khác.
2. **Định mức tốc độ nói chuẩn Tiếng Việt (`3.5 – 4.2` âm tiết / giây):**
   - Một thao tác trên màn hình kéo dài `4 giây` chỉ nên đi kèm câu giải thích dài `14 – 17` từ. Nếu cần giải thích sâu hơn, hãy giữ màn hình dừng lại `6 – 8 giây` hoặc dùng `clipRegions` / `speedRegions` trong `.recordly` giảm tốc độ đoạn video đó xuống `0.75x`.
3. **Sạch tuyệt đối cho giọng đọc (`Clean TTS Text`):**
   - Viết rõ cách đọc cho từ viết tắt dễ đánh vần sai nếu cần, không đưa ký hiệu Markdown (`**`, `` ` ``, `#`, `->`), URL dài hoặc mã màu hex vào trường `text`.
4. **Kết hợp Zoom vừa đủ (`depth = 2` hoặc `3`):**
   - Chỉ phóng to `1.5x – 1.8x` vào khu vực form/nút bấm đang thao tác trong khoảng `2.5 – 4.0` giây rồi trả về toàn cảnh để người xem luôn định vị được mình đang ở đâu trên giao diện.
5. **Che dữ liệu thật của doanh nghiệp (`Annotation Blur`):**
   - Nếu màn hình quay dính mật khẩu, token API, số điện thoại khách hàng hoặc doanh thu nội bộ, thêm vùng `blur` vào `steps.json` để Recordly làm mờ vùng tọa độ đó suốt khoảng thời gian xuất hiện.

---

## 4. Các Kịch Bản Gọi Lệnh Thực Tế Thường Gặp (`CLI Cookbook`)

### Kịch bản 1: Đã có video quay màn hình `.mp4` $\rightarrow$ Tạo trọn bộ Thuyết minh + `.SRT` + `.recordly` + `.MP4` đốt phụ đề
```powershell
python scripts/recordly_tutorial_pipeline.py build `
  --video "D:/Videos/huong_dan_nhap_kho.mp4" `
  --script "D:/Videos/kich_ban_nhap_kho.json" `
  --voice "vi-VN-NamMinhNeural" `
  --burn-srt `
  --outdir "D:/Videos/Thanh_Pham_Nhap_Kho"
```
**Kết quả thu được trong thư mục đầu ra:**
- `huong_dan_nhap_kho.srt` & `huong_dan_nhap_kho.vtt`: Phụ đề chuẩn UTF-8 khớp từng câu đọc (dùng đăng YouTube, Google Drive, LMS hoặc bật/tắt trên trình phát).
- `huong_dan_nhap_kho_voiceover.mp3`: Tệp âm thanh thuyết minh tổng hợp khớp chuẩn timeline video.
- `huong_dan_nhap_kho.recordly`: Tệp dự án Recordly v2 (mở trực tiếp bằng `Recordly.exe` có sẵn Auto-Zoom, khung chỉ dẫn, phụ đề động và track giọng đọc AI).
- `huong_dan_nhap_kho_tutorial_final.mp4`: Video thành phẩm H.264 + AAC đã lồng tiếng giải thích và đốt sẵn phụ đề Tiếng Việt có dấu rõ nét.

### Kịch bản 2: Quay màn hình trực tiếp từ dòng lệnh trong `N` giây rồi lồng tiếng hướng dẫn
```powershell
python scripts/recordly_tutorial_pipeline.py capture `
  --output "D:/Videos/raw_capture.mp4" `
  --duration 15 `
  --fps 60 `
  --record-cursor
```

### Kịch bản 3: Bóc băng lời nói nháp từ video đã quay bằng `whisper-cli.exe` đi kèm Recordly
```powershell
python scripts/recordly_tutorial_pipeline.py transcribe `
  --video "D:/Videos/quay_co_mic_nhap.mp4" `
  --language vi `
  --outdir "D:/Videos/Boc_Bang"
```
