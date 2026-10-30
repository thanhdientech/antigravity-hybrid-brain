# Kiến Trúc, Giao Thức MCP & Quy Trình Sản Xuất Video Shopee Affiliate (`:8600 <-> :8500`)

## 1. Bản Đồ Cổng Dịch Vụ & Thư Mục Mã Nguồn Gốc (Port & Workspace Topology)

- **Thư mục dự án chính:** `<SHOPEE_STUDIO_WORKSPACE>`
- **File khởi động 1 chạm (tự bật FlowKit + Muse + Web Studio):** `START_SHOPEE_STUDIO.bat` / `START_SHOPEE_STUDIO.ps1`
- **Web Studio & Cổng MCP Shopee (`http://127.0.0.1:8600`):**
  - Giao diện Web UI 2 chế độ: `http://127.0.0.1:8600`
  - Cổng HTTP JSON-RPC MCP: `POST http://127.0.0.1:8600/mcp` (hoặc `/api/mcp/tools`, `/api/mcp/call`)
  - Cổng STDIO MCP: `python shopee_video_studio/mcp_shopee_studio.py`
- **Các dịch vụ liên kết từ hệ thống `<VIDEO_RENDER_SUITE_WORKSPACE>`:**
  - **FlowKit Server (`http://127.0.0.1:8100`, WS `:8222`):** Kết nối Chrome `Profile 7` tới Google Flow Project (mặc định `https://flow.google.com/project/<FLOW_PROJECT_ID>`). Endpoint kiểm tra kết nối: `GET http://127.0.0.1:8100/api/flow/status`.
  - **Muse.ai Local OpenAI-Compatible API (`http://127.0.0.1:8010/v1`):** Kết nối Chrome `Profile tomi` (`https://muse.ai`), cung cấp `/v1/chat/completions` (`muse-spark`), `/v1/images/generations` (có `reference_images`), `/v1/videos/generations` (có `reference_image`) miễn phí 100%.
  - **OmniFlow Timeline Studio (`http://127.0.0.1:8500`):** Nơi nhận đồng bộ tự động các dự án 8 ngăn trong kênh `<TIMELINE_STUDIO_WORKSPACE>/Shopee_Affiliate/Video/<Tên_Dự_Án>`.

## 2. Quy Trình 5 Bước Dựng Phim Câu Chuyện Có Người Mẫu Mặc Áo Thật (Storytelling Virtual Try-On Pipeline)

1. **Bước 1 — Quét Ngách Hoặc Bóc Tách Link & Thông Số Kỹ Thuật NSX (`shopee_service.py`):**
   - Quét ngách sâu (`analyze_shopee_niche`) hoặc bóc tách mọi link `shopee.vn` / `s.shopee.vn` (`extract_shopee_product`), tự động rút trích `manufacturer_specs` (Thông số kỹ thuật Nhà Sản Xuất thật từ `attributes` + `description` — Zero Hallucination), phân loại chế độ tương tác đa ngành (`handheld_tool`, `home_appliance`, `wearable_fashion`, `beauty_care`, `daily_lifestyle`) và tải dàn ảnh gốc HD về `du_lieu_san_pham/<item_id>_<slug>/images/`.
2. **Bước 2 — AI Đọc Ảnh `UID02` Tự Nghĩ Ý Tưởng & Sáng Tác Kịch Bản 5 Cảnh Đủ 8 Trụ Cột (`flow_muse_story_engine.py`):**
   - Endpoint `POST /api/story/ideate` (`auto_ideate_product_story_angle`) & `POST /api/story/generate-script` (`generate_storytelling_script`) dùng `agy CLI Vision` (đọc trực tiếp ảnh `UID02` để khóa kích thước thật cầm tay/mặc, chất liệu, màu sắc) hoặc `Muse Spark (:8010)`.
   - Cấu trúc chuẩn 5 cảnh dọc `9:16` hội tụ đủ 8 trụ cột: **(1) Câu chuyện đời sống hàng ngày** + **(2) Hook bán hàng** + **(3) Giải quyết vấn đề** + **(4) Thông số kỹ thuật NSX thật** + **(5) Hướng dẫn sử dụng thực tế** + **(6) Đánh giá thử nghiệm sản phẩm** + **(7) Chia sẻ kinh nghiệm chọn mua/bảo quản** + **(8) Viết Text 3 vùng lên màn hình Video** (`phase`, `headline_vi`, `on_screen_text_vi`, `spec_badge_vi`, `voice_vi`).
3. **Bước 3 — Tổng Hợp Giọng Kể Chuyện `ai33.pro` & Nhạc Nền `Suno AI` (`ai33_suno_service.py`):**
   - Giọng đọc kể chuyện gọi `POST https://api.ai33.pro/v3/text-to-speech` (multipart FormData với `voice_id` có prefix như `elevenlabs_CQAD6iKxS73fEAGjSwt5` — *Giang Podcast* hoặc `vbee_Jmio6r8OUeqiK3cZ3N0K` — *Thu Thảo*), poll `GET /v1/task/{task_id}` lưu `5 srt/VOICE_01..0N.mp3`.
   - Nhạc nền Instrumental gọi `POST https://api.ai33.pro/v1s/task/music-generation` (`make_instrumental: true`) hoặc tự động dự phòng qua Suno Browser trên `Profile 67`, lưu `4 am nhac sfx/BGM_SUNO.mp3`.
4. **Bước 4 — Virtual Try-On `B2 -> B3` & Diễn Hoạt Video `B5` (`flow_muse_story_engine.py`):**
   - **B2:** Tạo chân dung người mẫu Việt Nam `1 prompt nhan vat/UID01.png` (`9:16`) và upload ảnh sản phẩm thật `UID02.png` lên Google Flow lấy cặp `[uid01_media_id, uid02_media_id]`.
   - **B3:** Gọi `generate_image_complete(..., aspect="9:16", character_media_ids=[uid01_media_id, uid02_media_id])` kèm khóa prompt bỏ qua móc treo/tay cầm thừa để xuất `2 prompt anh canh/SCENE_01..0N.png`.
   - **B5:** Gọi `generate_video_complete(..., start_image="SCENE_XX.png", aspect="9:16", model_family="veo")` xuất `3 prompt video/SCENE_01..0N.mp4` (tự động fallback sang Muse.ai `:8010` nếu gặp giới hạn).
5. **Bước 5 — Ghép Master `1:1 Visual-Voice Sync Lock` & Đồng Bộ `:8500`:**
   - Hàm `assemble_story_master_mp4` đo thời lượng thật của từng file `VOICE_XX.mp3` (`+0.35s` nhịp thở), điều tốc mượt clip `SCENE_XX.mp4` về `1080x1920 @ 30fps`, phủ phụ đề kính mờ đáy khung hình không che sản phẩm, trộn nhạc nền `BGM_SUNO.mp3` (`volume=0.14`, fade-out `1.8s`), xuất `FINAL/STORY_VIDEO_SHOPEE_<item_id>.mp4` và gọi `sync_project_to_timeline_studio_8500`.

## 3. Danh Mục 7 MCP Tools, Engine Phân Tích Ngách & Lệnh CLI Thực Chiến

- **Engine Phân Tích Ngách & Gom Cụm So Sánh Giá (`shopee_video_studio/niche_analytics_engine.py`):**
  - Quét sâu kết quả tìm kiếm Shopee thật qua `Antigravity Browser Bridge (:8766)` CDP ngầm (`by=sales` + `by=relevancy`) vượt rào `90309999`, kết hợp `Affiliate Open API` và lưu lịch sử giá vào `du_lieu_san_pham/price_history.sqlite`.
  - Gom cụm **Các sản phẩm giống nhau nhưng giá/chất lượng khác nhau** bằng `64-bit Perceptual dHash` (đã cắt 8% viền khung khuyến mãi) + `Title Word/Bigram TF-IDF Cosine Similarity`.
  - Chấm điểm `Affiliate Winning Score (0-100)` theo 5 trụ cột (Tốc độ bán 25% + Tiền hoa hồng VNĐ/đơn 25% + Uy tín sao & Shop Mall/Yêu thích+ 20% + Vị thế giá trong cụm 15% + Kiểm định review có chữ/ảnh thật chống đơn ảo 15%) và bóc bình luận 1 sao / 5 sao thật làm Hook video.
- **Danh sách 8 MCP Tools trên `:8600/mcp` (hoặc `mcp_shopee_studio.py`):**
  1. `shopee_studio_status`
  2. `shopee_scan_products`
  3. `shopee_analyze_niche_and_compare`
  4. `shopee_extract_product`
  5. `shopee_ideate_product_story`
  6. `shopee_generate_story_script`
  7. `shopee_render_story_video`
  8. `shopee_sync_to_timeline_8500`
- **Cách gọi nhanh bằng Python CLI trong Skill:**
  ```powershell
  # 1. Kiểm tra trạng thái toàn hệ thống (FlowKit :8100, Muse :8010, AI33.pro, agy CLI, Timeline :8500)
  python "~/.gemini/config\skills\shopee-affiliate-video-studio\scripts\shopee_story_cli.py" status

  # 2. Phân tích sâu từ khóa ngách, gom cụm so sánh giá/chất lượng & chấm điểm sản phẩm thắng (0-100)
  python "~/.gemini/config\skills\shopee-affiliate-video-studio\scripts\shopee_story_cli.py" niche-analyze --keyword "làm vườn" --limit 40

  # 3. Dựng trọn gói 1 Phim Ngắn Câu Chuyện Có Người Mẫu Mặc Áo Thật từ link Shopee
  python "~/.gemini/config\skills\shopee-affiliate-video-studio\scripts\shopee_story_cli.py" story-render --url "https://shopee.vn/product/377587075/45412511996" --affiliate "https://s.shopee.vn/ma_cua_ban" --scenes 3
  ```
