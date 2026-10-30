---
name: yt-shortcode-commander
description: "Điều khiển dây chuyền sản xuất YouTube & Facebook 6 lệnh (Nội dung, Prompt, Render, Đăng lịch, Nuôi nick, Kênh mới)."
group: "YouTube & Tự Động Hóa MXH"
---

# Hệ Thống Điều Khiển Dây Chuyền Sản Xuất YouTube & Facebook 6 Lệnh (`youtube`)

<!-- JAVIS_TRIGGER_ARCHIVE_START -->
## Khi nào dùng (Triggers & Ngữ cảnh kích hoạt đầy đủ)

> Hệ thống điều khiển dây chuyền sản xuất YouTube & Facebook 6 Lệnh (1. Viết Nội Dung, 2. Viết Prompt, 3. Render, 4. Lên lịch đăng video, 5. Nuôi thiết bị, 6. Lên kế hoạch cho kênh mới) & 3 Kênh hiện tại (1. Channel_01_Mythology_EN, 2. Channel_02_Science_DE, 3. Channel_03_Explainer_EN) + Template Kênh Mới A-to-Z (`_TEMPLATE_KENH_MOI_A_TO_Z`). Hỗ trợ chọn từng bước trên Bot, tự động lấy đề tài từ Kế hoạch CSV nếu chưa có thư mục, kiểm tra đầu vào (Pre-Flight Check) và phân phối đến đúng Agent Quản lý kênh hoặc Team chuyên môn. TRIGGERS: "youtube", "/youtube", "eme", "sgw", "kg", "k1", "k2", "k3", "viết nội dung", "viết prompt", "qa check", "render", "test5", "lên lịch đăng video", "nuôi thiết bị", "lên kế hoạch kênh mới", "xây kênh mới", "tạo kênh mới".
<!-- JAVIS_TRIGGER_ARCHIVE_END -->

Khi người dùng gõ từ khóa **`youtube`** (hoặc **`/youtube`**, **`yt`**, **`xây kênh mới`**) trên Bot hoặc Web Dashboard, hệ thống lập tức hiển thị **6 Lệnh Cốt Lõi (`1..6`)**:
1. **`1. Viết Nội Dung`**
2. **`2. Viết Prompt`**
3. **`3. Render`**
4. **`4. Lên lịch đăng video`**
5. **`5. Nuôi thiết bị`**
6. **`6. Lên kế hoạch cho kênh mới (Từ Con Số 0: YouTube & Facebook)`**

---

## 📌 PHẦN 1: BẢNG ÁNH XẠ 3 KÊNH HIỆN TẠI & THƯ MỤC TEMPLATE KÊNH MỚI A-TO-Z

| Mã Chọn | Mã Tắt | Tên Kênh & Đường Dẫn Gốc (`E:\`) | File Kế Hoạch CSV Gốc (`1 Viet Content\Plan\`) | File Hướng Dẫn Render & Ghép Video Duy Nhất (`3 Render video/AGENTS.md`) |
| :---: | :---: | :--- | :--- | :--- |
| **`1`** / **`K1`** | **`EME`** | **Channel_01_Mythology_EN** (`EN - US`)<br>`<WORKSPACE_DIR>\Xây Kênh Youtube\Channel_01_Mythology_EN` | `content-plan-100-us-v2-ancient-evidence.csv` *(100 video)*<br>& `kehoach.csv` *(10 video)* | [`Channel_01_Mythology_EN\3 Render video\AGENTS.md`](file:///WORKSPACE_DIR/X%C3%A2y%20K%C3%AAnh%20Youtube/Channel_01_Mythology_EN/3%20Render%20video/AGENTS.md) |
| **`2`** / **`K2`** | **`KG`** | **Channel_02_Science_DE** (`DE - DACH`)<br>`<WORKSPACE_DIR>\Xây Kênh Youtube\Channel_02_Science_DE` | `0.content-plan-90-de-v2.csv` *(90 video Tiếng Đức)* | [`Channel_02_Science_DE\3 Render video\AGENTS.md`](file:///WORKSPACE_DIR/X%C3%A2y%20K%C3%AAnh%20Youtube/Channel_02_Science_DE/3%20Render%20video/AGENTS.md) |
| **`3`** / **`K3`** | **`SGW`** | **Channel_03_Explainer_EN** (`EN - US`)<br>`<WORKSPACE_DIR>\Xây Kênh Youtube\Channel_03_Explainer_EN` | `content-plan-100-us-v1.csv` *(100 video)* | [`Channel_03_Explainer_EN\3 Render video\AGENTS.md`](file:///WORKSPACE_DIR/X%C3%A2y%20K%C3%AAnh%20Youtube/Channel_03_Explainer_EN/3%20Render%20video/AGENTS.md) |
| **`MỚI`** | **`TPL`** | **Template Kênh Mới A-to-Z (YouTube & Facebook)**<br>[`<WORKSPACE_DIR>\Xây Kênh Youtube\_TEMPLATE_KENH_MOI_A_TO_Z`](file:///WORKSPACE_DIR/X%C3%A2y%20K%C3%AAnh%20Youtube/_TEMPLATE_KENH_MOI_A_TO_Z/AGENTS.md) | [`content-plan-100-videos-template.csv`](file:///WORKSPACE_DIR/X%C3%A2y%20K%C3%AAnh%20Youtube/_TEMPLATE_KENH_MOI_A_TO_Z/1%20Viet%20Content/Plan/content-plan-100-videos-template.csv) *(Chuẩn 11 cột chấm điểm 10đ)* | [`_TEMPLATE_KENH_MOI_A_TO_Z\3 Render video\AGENTS.md`](file:///WORKSPACE_DIR/X%C3%A2y%20K%C3%AAnh%20Youtube/_TEMPLATE_KENH_MOI_A_TO_Z/3%20Render%20video/AGENTS.md) |

---

## 📌 PHẦN 2: QUY TRÌNH CHI TIẾT 6 LỆNH & 5 CÔNG CỤ XÂY KÊNH

### Lệnh `1` — Viết Nội Dung (`1 Viet Content/AGENTS.md` $\rightarrow$ `0 Noi dung video/`)
- Tự động đọc file Kế hoạch CSV trong `1 Viet Content\Plan\` theo `STT` nếu chưa có thư mục.
- Tham chiếu transcript từ Tool `:15000` (YouTube) hoặc `:8088` (Facebook) và nguồn khoa học/lịch sử cấp 1.
- Xuất bộ 7 file kịch bản chuẩn (`Buoc_1`..`Buoc_5`, `voiceover.txt`, `storyboard.csv`) chuẩn `utf-8-sig`.

### Lệnh `2` — Viết Prompt (`2 Viet Prompt/AGENTS.md` $\rightarrow$ `B1`, `B2`, `B3`, `B5`, `B8`, `B9`, `5 srt`)
- Băm kịch bản thành các cảnh `8.0s` (`B1_Phan_Canh.csv` 13 cột), kiểm soát chặt số từ mỗi cảnh (`16–22 từ EN`, `12–16 từ DE`, `20–26 âm tiết VI`) để không tràn 8s và không dư khoảng lặng.
- Thiết kế bộ Prompt CSV (`B2` Nhân vật, `B3` Ảnh cảnh, `B5` Video không cột Voice, `B9` Nhạc nền, `5 srt` Phụ đề, `B8` Thumbnail) chuẩn `utf-8-sig`, hỗ trợ cả `16:9` (Video dài) và `9:16` (Shorts/Reels).

### Lệnh `3` — Render & Ghép Video Master (`3 Render video/AGENTS.md` — 1 File Hướng Dẫn Duy Nhất Mỗi Kênh)
- **Nguyên tắc 1 File Duy Nhất:** Mỗi kênh chỉ có **đúng 1 file hướng dẫn Render & Ghép Video duy nhất** tại `3 Render video/AGENTS.md` để Agent không bao giờ đọc sót.
- **🔒 CHỐT KIỂM ĐỊNH ÂM THANH & ĐỒNG BỘ HÌNH-TIẾNG BẮT BUỘC TRƯỚC KHI GHÉP MASTER (`omniflash/youtube/qa_audio_sync_merge.py`):**
  1. **Không chồng chéo âm thanh (`Zero Audio Overlap`):** Không cảnh nào có câu thoại vượt quá `7.65s` tràn sang cảnh kế tiếp.
  2. **Không khoảng lặng thừa (`Zero Dead Silence`):** Đo ngưỡng âm thanh `-38 dB`, cắt bỏ khoảng lặng thừa ở đuôi cảnh và chỉ giữ lại **`0.35s – 0.40s` nhịp thở tự nhiên** sau mỗi câu.
  3. **Khớp 100% Giọng đọc với Nội dung Ảnh/Video từng cảnh (`1:1 Visual-Voice Sync Lock`):** Cắt thời lượng của từng clip `SCENE_XX.mp4` (`inpoint 0.000` $\rightarrow$ `outpoint dur_XX`) và từng block `.srt` khớp chính xác với thời lượng giọng đọc `dur_XX = speech_dur_XX + 0.35s`.

### Lệnh `4` — Lên Lịch Đăng Video (`4 Dang Video & Nuoi Kenh/AGENTS.md`)
- Kết hợp **Tool 1 (`Anti-Detect Social Automator` `:8000`)** và **Tool 5 (`Extension Tự Đăng Lên` `ws://localhost:8765` / MCP `antigravity-tools`)** để bơm thẳng `FINAL/*.mp4`, `.srt`, `Thumbnail` và `Buoc_4_Metadata.txt` lên **YouTube Studio** và/hoặc **Facebook Page / Reels** qua CDP Native (`DOM.setFileInputFiles`), hẹn giờ công chiếu và chụp ảnh màn hình xác nhận.

### Lệnh `5` — Nuôi Thiết Bị (`Anti-Detect Social Automator` `:8000`)
- Tạo thiết bị ảo cách ly, gắn Proxy tĩnh đúng quốc gia (`US`, `DE`, `VN`...), gắn tài khoản kênh YouTube / Facebook Page và chạy kịch bản lướt xem/tương tác tự nhiên cùng ngách để tăng Trust Score.

### Lệnh `6` — Lên Kế Hoạch & Xây Dựng Kênh Mới Từ Con Số 0 (`_TEMPLATE_KENH_MOI_A_TO_Z`)
Khi người dùng chọn **Lệnh `6`** hoặc yêu cầu tạo kênh mới (YouTube / Facebook), AI Agent đọc ngay [`_TEMPLATE_KENH_MOI_A_TO_Z\AGENTS.md`](file:///WORKSPACE_DIR/X%C3%A2y%20K%C3%AAnh%20Youtube/_TEMPLATE_KENH_MOI_A_TO_Z/AGENTS.md) và thực hiện 5 bước chuẩn:
1. **Bước 6.1 — Hỏi 6 Đầu Vào Cốt Lõi Từ Người Dùng:**
   - (1) Nền tảng (`YouTube` / `Facebook` / `Đa kênh`)?
   - (2) Khung hình & Thời lượng (`16:9` Dài `8–15 phút` hay `9:16` Ngắn Shorts/Reels `30–90s`)?
   - (3) Thị trường & Ngôn ngữ (`US - EN`, `DE - Đức`, `VN`...)?
   - (4) Ngách lớn (`Broad Niche` / Seed Topic) người dùng muốn làm?
   - (5) Chế độ Nhân vật (`Mode A: Fixed Host UID01.png` / `Mode B: Dynamic Cast` / `Mode C: 100% Hostless`)?
   - (6) Phong cách Hình ảnh (`2D/3D Cartoon`, `Photorealistic 8K`, `3D Cutaway`...)?
2. **Bước 6.2 — Chạy Công Cụ Săn "Ngách Ngon" Ra Số Liệu Thật:**
   - **Với YouTube:** Chạy **Tool 2 (`http://127.0.0.1:15000/` — YT Niche Radar `mcp_server.py`)**: Quét `ytradar_scan_niches`/`ytradar_scan_csv` tìm ngách có tỷ lệ Đại dương xanh cao $\rightarrow$ Quét `ytradar_scan_channel_videos` tìm Top Video Outlier (`Views/Subs >= 3x`) $\rightarrow$ Tải bản chép lời (`ytradar_fetch_transcript`) và phân tích bình luận (`ytradar_analyze_comments`) tìm `Content Requests`.
   - **Với Facebook:** Chạy **Tool 3 (`http://127.0.0.1:8088/` — MCP `antigravity-tools`)**: Quét `server_search_videos` & `server_deep_scan` tìm video viral $\rightarrow$ Tải video & bản chép lời `.srt`/`.txt` qua `server_batch_download`/`server_quick_download`.
3. **Bước 6.3 — Nhân Bản Thư Mục Template & Xây Dựng `Channel_Branding`:**
   - Copy `<WORKSPACE_DIR>\Xây Kênh Youtube\_TEMPLATE_KENH_MOI_A_TO_Z\` thành `<WORKSPACE_DIR>\Xây Kênh Youtube\<Ten_Kenh_Moi>\`.
   - Tạo thiết bị ảo + gắn Proxy trên **Tool 1 (`Anti-Detect Social Automator`)**.
   - Điền `channel_config.json`, `CHANNEL_BRANDING_VA_THONG_SO_RENDER.md`, và render `Channel_Branding/UID01.png` (nếu Mode A) + Logo + Banner.
4. **Bước 6.4 — Lập File Kế Hoạch 100 Video Chuẩn 11 Cột (`1 Viet Content/Plan/*.csv`):**
   - Từ số liệu Transcript + Bình luận + Outlier của `:15000` và `:8088`, chấm điểm 10đ (`Nhu cầu 3đ + Khoảng trống 3đ + Bằng chứng 2đ + Sản xuất & An toàn YPP 2đ`) và xuất file `1 Viet Content/Plan/content-plan-100-videos.csv` (`utf-8-sig`).
5. **Bước 6.5 — Bắt Đầu Sản Xuất Cuốn Chiếu Từng Video (`Lệnh 1` $\rightarrow$ `Lệnh 2` $\rightarrow$ `Lệnh 3` $\rightarrow$ `Lệnh 4`).**
