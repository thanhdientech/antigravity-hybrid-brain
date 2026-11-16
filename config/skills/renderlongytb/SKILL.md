---
name: renderlongytb
description: "Điều khiển OmniFlow Studio (:8500) render video dài YouTube 16:9: B2->B3->B5, 6 Engine, Bảo vệ 5 lớp, Muse 8s, Motion 2D & 15 MCP."
group: "Làm Phim & Video AI"
---

# 🎬 RENDER LONG YOUTUBE VIDEO ENGINE (`renderlongytb` — OmniFlow Timeline Studio `:8500`)

<!-- JAVIS_TRIGGER_ARCHIVE_START -->
## Khi nào dùng (Triggers & Ngữ cảnh kích hoạt đầy đủ)

> Điều khiển trực tiếp công cụ **OmniFlow Timeline Studio & Multi-Engine Render Pipeline (`v3.5.3`)** nằm cố định tại `E:\DIEN APP\Xây Kênh Youtube\Tool render edit Video` (Cổng Web/REST API `http://127.0.0.1:8500`) để sản xuất, render hàng loạt và dựng hậu kỳ **Video Dài YouTube (`16:9`, 8s/10s/20s/30s mỗi cảnh, 30–120+ phân cảnh)** cho các kênh tài liệu, lịch sử, khoa học, vũ trụ, drama, tin tức và MV ca nhạc. Bao phủ trọn gói: Quy trình tham chiếu 3 bước khép kín (`B2 Nhân vật -> B3 Ảnh cảnh -> B5 Video First-Frame`), 6 Động cơ Render (`antigravity_ext :8765`, `flowboard :8100`, `muse_web :8000`, `remotion_2d`, `hybrid_veo_remotion`, `hybrid_muse_remotion`), Bảo vệ tài khoản Google Flow 5 lớp + Auto-Failover sang `Muse.ai 8s`, 1 file duy nhất `B5_Motion2D.json` (13 Archetypes + Bản đồ vệ tinh), Giọng đọc AI (`taogiongai` / `ai33.pro`), Nhạc Suno/FlowMusic, Bộ tự chữa lành `10-in-1 Vision Auto-Healer`, 15 MCP Tools và Bàn dựng Timeline 4-Track FFmpeg.
> TRIGGERS: "renderlongytb", "render long ytb", "render video dài", "render video dai", "render youtube dài", "omniflow", "timeline studio 8500", "tool render edit video", "cổng 8500", "cong 8500", "b5_motion2d.json", "muse failover 8s", "flow_batch.py", "run_menu.py", "super_merge.py", "mcp_timeline.py", "ghép video youtube dài", "render bù cảnh lỗi youtube".
<!-- JAVIS_TRIGGER_ARCHIVE_END -->

- **Thư mục công cụ thực thi gốc (Giữ nguyên tại ổ E — Gọi trực tiếp, KHÔNG sao chép bộ tool sang nơi khác):**
  - 📂 `E:\DIEN APP\Xây Kênh Youtube\Tool render edit Video`
  - 🚀 **Khởi động 1 chạm toàn hệ thống:** `"E:\DIEN APP\Xây Kênh Youtube\Tool render edit Video\START_STUDIO.bat"` $\rightarrow$ Mở `http://127.0.0.1:8500`
  - 🐍 **Python môi trường ảo chuẩn của Tool:** `"E:\DIEN APP\Xây Kênh Youtube\Tool render edit Video\.venv\Scripts\python.exe"`
  - 🌐 **Kho Git Upstream của Tool:** [thanhdientech/Tool-render-video-Flow-Agent](https://github.com/thanhdientech/Tool-render-video-Flow-Agent)

---

## 📌 1. BẢNG ĐIỀU PHỐI TÀI LIỆU CHUYÊN SÂU (`references/`)

| Tình Huống / Bước Thực Thi | Tệp Tham Chiếu Cần Đọc | Nội Dung Cốt Lõi |
| :--- | :--- | :--- |
| **Kiến trúc 5 Cổng, Quy trình `B2->B3->B5` & 6 Động cơ Render** | [`references/01-kien-truc-da-dong-co-va-6-phuong-phap-render.md`](./references/01-kien-truc-da-dong-co-va-6-phuong-phap-render.md) | Sơ đồ `:8500 / :8100 / :8000 / :8765 / :9334`, payload `POST /api/omniflash/run-stage` & Script Python tự động A–Z. |
| **Motion 2D (`13 Archetypes`), 5 Tab Studio, REST API & 15 MCP Tools** | [`references/02-motion-2d-13-archetypes-va-5-workspaces-api.md`](./references/02-motion-2d-13-archetypes-va-5-workspaces-api.md) | Quy tắc 1 file `3 prompt video/B5_Motion2D.json`, Golden Ratio từ/cảnh (`8s/10s/20s/30s`), API `:8500` & `mcp_timeline.py`. |
| **Bảo Vệ Tài Khoản 5 Lớp, Healer 10-Trong-1, CLI & 6 Điều Cấm** | [`references/03-bao-ve-tai-khoan-5-lop-healer-10-trong-1-va-6-dieu-cam.md`](./references/03-bao-ve-tai-khoan-5-lop-healer-10-trong-1-va-6-dieu-cam.md) | `Smart Human Delay`, `Fast Circuit Breaker 180s`, `Muse.ai 8s`, CLI `flow_batch.py`/`run_menu.py` & 6 Guardrails bất biến. |

---

## 📌 2. LỆNH GỌI NHANH TỪ AI AGENT TỚI TOOL GỐC TẠI Ổ E

1. **Kiểm tra cổng `:8500` đã chạy chưa (nếu chưa thì bật `START_STUDIO.bat`):**
   ```powershell
   Get-NetTCPConnection -LocalPort 8500,8100,8000,8765 -State Listen -ErrorAction SilentlyContinue | Select-Object LocalPort,OwningProcess
   # Nếu cổng :8500 chưa mở, khởi chạy từ đúng thư mục gốc ở ổ E:
   Start-Process -WorkingDirectory "E:\DIEN APP\Xây Kênh Youtube\Tool render edit Video" -FilePath "cmd.exe" -ArgumentList "/c START_STUDIO.bat"
   ```
2. **Gọi CLI Render hàng loạt hoặc Menu 14 chức năng trực tiếp bằng `.venv` của Tool:**
   ```powershell
   & "E:\DIEN APP\Xây Kênh Youtube\Tool render edit Video\.venv\Scripts\python.exe" "E:\DIEN APP\Xây Kênh Youtube\Tool render edit Video\omniflash\youtube\flow_batch.py" --help
   & "E:\DIEN APP\Xây Kênh Youtube\Tool render edit Video\.venv\Scripts\python.exe" "E:\DIEN APP\Xây Kênh Youtube\Tool render edit Video\omniflash\youtube\run_menu.py"
   ```
3. **Gọi trực tiếp 15 MCP Tools qua HTTP REST trên `:8500` (Không cần mở thêm tiến trình phụ):**
   - Liệt kê tools: `GET http://127.0.0.1:8500/api/mcp/tools`
   - Thực thi tool: `POST http://127.0.0.1:8500/api/mcp/call` (ví dụ `timeline_check_ingredients`, `render_run_stage`, `voice_render_tts`, `remotion_render_pipeline`, `timeline_assemble_and_export`).

---

## 📌 3. 5 QUY TẮC VÀNG BẮT BUỘC KHI VẬN HÀNH (`NON-NEGOTIABLE GATES`)

1. **Chỉ Gọi Tool Tại Chỗ (`In-Place Execution`):** Giữ nguyên toàn bộ mã nguồn, `.venv`, `settings.json` và tài sản kênh tại `E:\DIEN APP\Xây Kênh Youtube\Tool render edit Video`; tuyệt đối không copy bộ tool nặng sang thư mục cấu hình Skill.
2. **Bảng Mã `UTF-8 with BOM (utf-8-sig)` Bắt Buộc:** Mọi file `.csv` (`B1`, `B2`, `B3`, `B5`, `Buoc_9`), `.json` (`B5_Motion2D.json`) và `.srt` đọc/ghi cho dự án phải lưu bằng `encoding="utf-8-sig"`.
3. **Khóa Thứ Tự Tham Chiếu 3 Bước (`B2 -> B3 -> B5`):**
   - `Stage 2 (B2)`: Tạo ảnh nhân vật gốc `1 prompt nhan vat/UIDXX.png`.
   - `Stage 3 (B3)`: Tạo ảnh cảnh `2 prompt anh canh/SCENE_XX.png` (đính kèm `UIDXX.png` làm tham chiếu).
   - `Stage 4 (B5)`: Tạo video cảnh `3 prompt video/SCENE_XX.mp4` — **chỉ đính kèm duy nhất 1 ảnh `SCENE_XX.png` làm First Frame**, tuyệt đối không đính kèm lại `UIDXX.png` rời.
4. **Một File Motion 2D Duy Nhất (`3 prompt video/B5_Motion2D.json`):** Không tách lẻ 13 file JSON; gom toàn bộ cảnh đồ họa 2D vào mảng `"scenes"` trong đúng 1 file `B5_Motion2D.json` và khai báo trường `"archetype"` thuộc 13 mẫu chuẩn.
5. **Tuân Thủ Bảo Vệ Tài Khoản Google Flow 5 Lớp:** Không hạ `FLOW_GENERATION_MIN_INTERVAL_S < 6.5s`, không tăng `MAX_CONCURRENT > 1` trên cùng 1 tài khoản Flow; khi gặp `PUBLIC_ERROR_UNUSUAL_ACTIVITY`, để hệ thống tự ngắt cầu dao chuyển thẳng sang `Muse.ai (:8000)` khóa cứng `8s`.
