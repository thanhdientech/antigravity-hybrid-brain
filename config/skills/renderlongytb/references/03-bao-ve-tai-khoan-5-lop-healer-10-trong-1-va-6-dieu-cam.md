# 03. Bảo Vệ Tài Khoản Google Flow 5 Lớp, Healer 10-Trong-1, Công Cụ CLI & 6 Điều Cấm (`renderlongytb`)

Tài liệu đặc tả cơ chế an toàn chống khóa tài khoản Google Flow, tự động chuyển đổi dự phòng sang `Muse.ai 8s` và quy tắc bảo trì công cụ tại `E:\DIEN APP\Xây Kênh Youtube\Tool render edit Video`.

---

## 1. Hệ Thống Bảo Vệ Tài Khoản 5 Lớp & Auto-Failover `Muse.ai (8s)`

1. **Lớp 1 — Ngưỡng Sàn Giãn Cách (`omniflash/flowkit-main/agent/config.py`):**
   - Khóa cứng `FLOW_GENERATION_MIN_INTERVAL_S >= 6.5` giây, `FLOW_GENERATION_MAX_CONCURRENT = 1` trên mỗi tài khoản, thời gian nghỉ làm nguội `FLOW_UNUSUAL_ACTIVITY_COOLDOWN_S >= 180.0` giây lưu bền vững qua `flow_generation_hold.json`.
2. **Lớp 2 — Nhịp Sinh Học Người Thật (`Smart Human Delay`):**
   - Tự động cộng Random Jitter (`+3.0–7.5s` cho video, `+1.5–4.5s` cho ảnh) và nghỉ giải lao `16–26s` sau mỗi 5 cảnh liên tiếp.
3. **Lớp 3 — Fast Circuit Breaker Chống Bắn Bồi:**
   - Khi Google Flow trả về `PUBLIC_ERROR_UNUSUAL_ACTIVITY` (hoặc `"hoạt động bất thường"`), hệ thống **ngắt ngay lập tức**, chặn vòng lặp `Smart Prompt Fallback 3 tầng` không cho gửi bồi vào tài khoản đang bị cờ (chỉ dùng `Smart Prompt Fallback 3 tầng` cho lỗi từ chối nội dung `as29s failed: [5]`).
4. **Lớp 4 — Auto-Failover `< 1s` Sang `Muse.ai Local API (127.0.0.1:8000)`:**
   - Tự động tìm tab `https://muse.ai` trên cùng Chrome Profile, nạp đủ `SCENE_XX.png` + hồ sơ nhân vật `1 prompt nhan vat/uidXX_*`, và **chèn câu lệnh ép cứng `8-second` đứng trước prompt** (ghi đè mặc định `10s` của Muse.ai để hành động trọn vẹn trong `8.0s` khớp với Timeline).
5. **Lớp 5 — Bộ Tự Chữa Lành Hình Ảnh `2-Tier Vision Auto-Healer 10-Trong-1` (`render_error_healer.py`):**
   - **Tầng 1 (Tự sửa liền & chạy tiếp):** Tự nhấn F5 đóng popup trình duyệt qua `:8766`, xóa `media_id` lệch project trong `media_ids_cache.csv`, sửa lỗi cú pháp `.srt/.json/.csv` (`utf-8-sig`), cách ly file `.mp4` lỗi `moov atom` để render bù, chuẩn hóa FPS/`yuv420p`, làm sạch ký tự lạ TTS và co giãn `.mp3` vượt `8.0s`.
   - **Tầng 2 (Lỗi cần người dùng cấp lại Key/Đăng nhập):** Không làm sập tiến trình, chụp màn hình bằng chứng và ghi vào `BAO_CAO_LOI_CAN_NGUOI_DUNG_XU_LY.md`.

---

## 2. Các Công Cụ CLI Chạy Trực Tiếp Từ Ổ E (Dành Cho Tác Vụ Dòng Lệnh)

Luôn gọi bằng trình thông dịch `.venv` tại chỗ của Tool:
```powershell
$Py = "E:\DIEN APP\Xây Kênh Youtube\Tool render edit Video\.venv\Scripts\python.exe"
$Root = "E:\DIEN APP\Xây Kênh Youtube\Tool render edit Video"

# 1. Chạy render hàng loạt từ CSV dự án hoặc CSV tự do
& $Py "$Root\omniflash\youtube\flow_batch.py" --help

# 2. Mở Menu tương tác 14 chức năng sản xuất kênh YouTube trên Terminal
& $Py "$Root\omniflash\youtube\run_menu.py"

# 3. Siêu ghép nối các cảnh SCENE_01..SCENE_NN.mp4 kèm Voice đa ngôn ngữ + BGM
& $Py "$Root\omniflash\youtube\super_merge.py" --help

# 4. Cắt khoảng lặng âm thanh/video tự động bằng Auto-Editor tích hợp sẵn trong .venv
& "$Root\.venv\Scripts\auto-editor.exe" input.mp4 --margin 0.2s -o output_clean.mp4
```

---

## 3. 6 Điều CẤM Bất Biến Khi Vận Hành Hoặc Bảo Trì Tool (`Developer Guardrails`)

1. **CẤM** hạ `FLOW_GENERATION_MIN_INTERVAL_S < 6.5s` hoặc tăng `FLOW_GENERATION_MAX_CONCURRENT > 1` trên cùng 1 tài khoản Google Flow.
2. **CẤM** cho `Smart Prompt Fallback` hoặc DOM `:8765` thử lại trên cùng tài khoản vừa báo `PUBLIC_ERROR_UNUSUAL_ACTIVITY` (phải ngắt sang `Muse.ai :8000` hoặc đổi Profile).
3. **CẤM** xóa câu lệnh ép `8-second` đứng đầu prompt trong `build_muse_video_prompt_with_8s_command()` của `muse_api/muse_local_api.py`.
4. **CẤM** gửi thiếu hồ sơ ảnh nhân vật `uidXX_*` khi failover sang Muse.ai ở bước tạo ảnh cảnh (`_enrich_character_references_for_muse()`).
5. **CẤM** xóa các trường phản hồi tương thích ngược (`"data": [video_item]`, `"local_path"`, `"sent_prompt"`) của `muse_local_api.py`.
6. **CẤM** bật lại `NETLOG_CAPTURE` trong `extension/injected.js` hoặc đẩy các file khóa cá nhân (`timeline_studio/settings.json`, `studio_settings.json`, `config.env`) lên GitHub.
