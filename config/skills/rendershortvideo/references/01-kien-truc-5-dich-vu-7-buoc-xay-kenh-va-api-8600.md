# 01. Kiến Trúc 5 Dịch Vụ (`:8600`), Lưu Trữ 8 Ngăn, Quy Trình 7 Bước & REST API (`rendershortvideo`)

Tài liệu kỹ thuật điều khiển **Shopee & Multi-Source KOL Video Studio (`v4.3.3`)** đặt tại `E:\DIEN APP\Tiep thi lien ke shoppe\Tim repo tim san pham shope lam video\Shopee_KOL_Studio_Tool`.

---

## 1. Kiến Trúc 5 Microservices Cách Ly Cổng (Chạy Song Song Với `renderlongytb`)

Khi chạy `START_SHOPEE_STUDIO.bat` (`launch_all_services.py`), hệ thống bật 5 dịch vụ hoàn toàn không đụng cổng `:8500` của công cụ YouTube dài:

| STT | Dịch Vụ | Cổng Mặc Định | Health Check | Nhiệm Vụ Chính |
| :-: | :--- | :---: | :--- | :--- |
| 1 | **Shopee KOL Video Studio** | **`:8600`** | `GET http://127.0.0.1:8600/api/health` | Giao diện Web chính & REST API quản lý đa kênh, khóa tài sản (`423 Asset Lock`), quét SP, Batch Orchestrator & Hộp Đen (`blackbox_logger.py`). |
| 2 | **Timeline Studio Nội Bộ** | **`:8650`** | `GET http://127.0.0.1:8650/health` | Lõi hậu kỳ 4-Track (Video + Voice TTS + BGM Suno + Phụ đề SRT) tăng tốc GPU NVIDIA `h264_nvenc`. |
| 3 | **FlowKit Server Nội Bộ** | **`:8100` / WS `:8222`** | `GET http://127.0.0.1:8100/health` | Kết nối Extension Google Flow tạo ảnh tham chiếu 6 góc, ảnh phân cảnh và diễn hoạt video Veo 3.1 (3 luồng). |
| 4 | **Muse.ai Local API** | **`:8010`** | `GET http://127.0.0.1:8010/health` | Động cơ OpenAI-compatible cục bộ miễn phí đọc ảnh sản phẩm `UID02`, sinh kịch bản (`muse-spark`) & tạo video dự phòng. |
| 5 | **Browser Bridge** | **`:8766` / WS `:8765`** | `GET http://127.0.0.1:8766/status` | Điều khiển trình duyệt Chrome/Cốc Cốc đa Profile: quét kênh mẫu Reels/TikTok, đọc TikTok Shop & tự động đăng bài MXH. |

---

## 2. Cấu Trúc Thư Mục Dữ Liệu Chuẩn 8 Ngăn (`Deterministic Storage`)

Mỗi video ngắn sản xuất ra nằm tại `Kenh_Shopee/<Tên_Kênh>/src/Video/<STT>_<Tên_Video>/` với 8 ngăn cố định (`utf-8-sig`):
1. `0 Noi dung video/` — `1_Kich_Ban_Phan_Canh.csv`, `story_plan.json`, `loi_bai_hat_suno.txt`, `voiceover.txt`.
2. `1 prompt nhan vat/` — `UID01.png`, `UID01_9x16.png` (Master Sheet 6 góc) & `B2_Nhan_Vat.csv`.
3. `2 prompt anh canh/` — Prompt & các ảnh cảnh `SCENE_01.png .. SCENE_NN.png`.
4. `3 prompt video/` — Prompt chuyển động camera & các clip `SCENE_01.mp4 .. SCENE_NN.mp4` (chỉ nhận `SCENE_XX.png` làm First Frame).
5. `4 am nhac sfx/` — Nhạc nền `BGM_SUNO.mp3` hoặc beat kênh.
6. `5 srt/` — Phụ đề `FULL_STORY.srt` và các file thoại `VOICE_01.mp3..`.
7. `6 thumbnail va title/` — Ảnh bìa & `LINK_SHOPEE_AFFILIATE_VA_CAPTION.txt` (tiêu đề, hashtags, bình luận đầu gắn link).
8. `FINAL/` — Video thành phẩm `1080x1920` (`30fps`) `STORY_VIDEO_SHOPEE_....mp4`.

---

## 3. Quy Trình 7 Bước Xây Kênh & Sản Xuất Hàng Loạt Trên `:8600`

1. **Bước 1 — Học Kênh Mẫu & Định Vị Kênh:** Quét 5–20 video triệu view từ link Fanpage/Reels/TikTok/YouTube mẫu, tách cấu trúc `Hook 3s • Nỗi đau • Nội dung • CTA`, học định vị và khóa giọng đọc.
2. **Bước 2 — Vẽ Nhân Vật 6 Góc `[uid01]` & Phòng Bối Cảnh Trống (`NO HUMANS`):** Tạo song song bản `9:16` + `16:9`, sau đó bấm **`🔒 Khóa Cố Định Cả 3`** (Nhân vật + Giọng đọc + Phòng `LOC_01..04`) để chặn vẽ đè nhầm.
3. **Bước 3 — Lập Kế Hoạch ~50 Video Xây Kênh (3 Giai Đoạn):**
   - Video `#01–#20`: Kéo tương tác tự nhiên, định danh tệp người xem (chưa bán hàng vội).
   - Video `#21–#38`: Xây niềm tin chuyên gia, chia sẻ mẹo/kỹ thuật thực chứng.
   - Video `#39–#50`: Tiêu chí chọn đồ, so sánh & mở đường giỏ hàng.
   - Hỗ trợ chỉnh `%` âm thanh môi trường (`0%–100%`) & bấm **`🎞️ Ghép Đè` / `🎞️✨ V2+`** trong ~4 giây (`-c:v copy`).
4. **Bước 4 — Săn & Nạp Sản Phẩm Đa Nguồn:**
   - **Shopee:** Quét từ khóa ngách, chấm *Affiliate Winning Score (0–100)*, đối chiếu lịch sử giá SQLite chống sale ảo, gom cụm ảnh `dHash`.
   - **TikTok Shop & Website riêng:** Nạp URL qua `:8766`, tự chặn từ `"Shopee"` trong kịch bản.
   - **Thư mục máy tính:** Nạp hàng loạt ảnh/video/tài liệu sản phẩm nội bộ.
5. **Bước 5 & 6 — Lên Kịch Bản, Render Song Song & Tự Chữa Lỗi Chrome:** Bấm **`📸 F5 Chụp Lỗi Chrome & Agent Sửa Ngay`** hoặc chạy lô tự động A$\rightarrow$Z.
6. **Bước 7 — Kiểm Tra Lưới Safe-Zone & Đăng Đa Nền Tảng:** Xuất caption cho FB Reels, TikTok, Shorts, Threads và đăng tự động qua `:8766`.

---

## 4. Các Endpoint REST API Trọng Yếu Cho AI Agent Gọi Tự Động (`http://127.0.0.1:8600`)

```http
# 1. Danh sách kênh & kiểm tra sức khỏe
GET  http://127.0.0.1:8600/api/health
GET  http://127.0.0.1:8600/api/channels

# 2. Quét kênh mẫu & tự động học định vị kênh
POST http://127.0.0.1:8600/api/channels/{channel_id}/reference-learner/scan
     {"reference_url": "https://www.facebook.com/reel/...", "max_videos": 10}
POST http://127.0.0.1:8600/api/channels/{channel_id}/reference-learner/learn-positioning
     {"apply_to_channel": true}

# 3. Lập lộ trình 50 video xây kênh mới
POST http://127.0.0.1:8600/api/channels/{channel_id}/warmup-roadmap
     {"video_count": 50, "render_mode": "sport_music", "strict_gender": "female", "music_sync_mode": "full_music"}

# 4. Bóc tách thông số & ảnh gốc sản phẩm Shopee / TikTok Shop / Web
POST http://127.0.0.1:8600/api/products/extract
     {"url": "https://shopee.vn/..."}

# 5. Kích hoạt & theo dõi lô render video song song
POST http://127.0.0.1:8600/api/batch-jobs
     {"channel_id": "ch_xxx", "product_ids": ["cp_xxx"], "render_mode": "sport_music",
      "visual_dispatch_strategy": "flowkit_auto", "aspect_ratio": "9:16",
      "target_duration_s": 32, "scene_count": 4, "preflight_mode": "missing"}
GET  http://127.0.0.1:8600/api/batch-jobs/{batch_id}
```
