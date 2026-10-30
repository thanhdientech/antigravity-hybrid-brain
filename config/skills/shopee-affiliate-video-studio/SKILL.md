---
name: shopee-affiliate-video-studio
description: "Phân tích ngách Shopee, dùng AI đọc ảnh/thông số NSX sáng tác câu chuyện đời thường đa ngành, ghi text lên video & dựng MP4 9:16."
group: "Làm Phim & Video AI"
---

# Shopee Affiliate Universal Storytelling, Spec & Video Studio (`shopee-affiliate-video-studio`)

<!-- JAVIS_TRIGGER_ARCHIVE_START -->
## Khi nào dùng (Triggers & Ngữ cảnh kích hoạt đầy đủ)

> Sản xuất video bán hàng tiếp thị liên kết Shopee đa ngành (Dụng cụ, Gia dụng, Điện tử, Mỹ phẩm, Thời trang, Tiêu dùng) khép kín từ từ khóa ngách hoặc link `shopee.vn` / `s.shopee.vn`: phân tích sâu từ khóa ngách qua Chrome CDP (`:8766`), gom cụm sản phẩm giống nhau khác giá/chất lượng (`Image dHash + Title TF-IDF Cosine`), lưu SQLite lịch sử giá, chấm điểm `Affiliate Winning Score (0-100)`, bóc Thông số kỹ thuật Nhà Sản Xuất thật (`Zero Hallucination`), dùng AI Vision (`agy CLI` đọc ảnh thật `UID02` + `Muse Spark :8010`) tự suy nghĩ ý tưởng & kịch bản 5 cảnh đời thường kết hợp bán hàng (đủ 8 trụ cột: Hook bán hàng + Giải quyết vấn đề + Thông số kỹ thuật NSX + Hướng dẫn sử dụng + Đánh giá thử nghiệm + Chia sẻ kinh nghiệm + Viết Text 3 vùng lên Video + CTA), diễn hoạt nhân vật dùng/mặc sản phẩm thật qua Google Flow (`FlowKit :8100`) / Muse.ai (`:8010`), giọng `ai33.pro`, nhạc `Suno AI`, xuất `.MP4` (`1080x1920`, `30fps`) và đồng bộ 8 ngăn sang `OmniFlow Timeline Studio (:8500)`.
> TRIGGERS: "tiếp thị liên kết shopee", "tiep thi lien ket shopee", "shopee affiliate", "phân tích ngách shopee", "phan tich ngach shopee", "so sánh giá shopee", "chọn sản phẩm shopee", "sáng tác câu chuyện shopee", "làm video shopee", "lam video shopee", "quét link shopee làm video", "người mẫu mặc áo shopee", "virtual try-on shopee", "shopee video studio", "s.shopee.vn", "video bán hàng shopee", "dựng phim bán hàng shopee", "viết text lên video shopee", "shopee storytelling".
<!-- JAVIS_TRIGGER_ARCHIVE_END -->

## 1. Bảng Điều Phối Tài Liệu & Công Cụ Thực Thi (`references/` & `scripts/`)

| Tình Huống / Yêu Cầu | Tệp Tham Chiếu / Script | Nội Dung Cốt Lõi |
| :--- | :--- | :--- |
| **Kiến trúc 5 Engine, REST API `:8600`, MCP `/mcp` & Đồng bộ `:8500`** | [`references/01-kien-truc-va-api-shopee-storytelling.md`](./references/01-kien-truc-va-api-shopee-storytelling.md) | Sơ đồ cổng `:8600 / :8100 / :8010 / :8500`, Quy tắc vàng Virtual Try-On `B2 -> B3 -> B5`, API `ai33.pro` & `Suno AI`. |
| **Gọi CLI 1 lệnh từ Terminal / AI Agent (Quét, Kịch bản, Render Phim)** | [`scripts/shopee_story_cli.py`](./scripts/shopee_story_cli.py) | CLI đa năng chạy `status`, `scan`, `extract`, `story-render`, `fast-render`, `sync-8500`. |

---

## 2. Quy Tắc Vàng Bắt Buộc Khi Thực Thi

1. **6 Phong Cách KOL Bán Hàng Tự Nhiên & Con Người Thật Dùng Sản Phẩm Thật (`KOL Vlog & Human-Product Lock B2 -> B3`):**
   - Hỗ trợ 6 mẫu kịch bản KOL thực chiến (`daily_life_vlog`, `experience_howto`, `honest_2sided_test`, `problem_rescue_story`, `budget_comparison_pro`, `reply_audience_story`) và `auto_kol`.
   - 100% phân cảnh bắt buộc có **Con người Việt Nam thật (`UID01.png`)** xuất hiện trong không gian sống đời thường đúng ngành và **trực tiếp cầm nắm / nấu ăn / kết nối / vận hành / thoa / mặc sản phẩm gốc Shopee (`UID02.png`)** theo đúng Ma trận 9 Nhóm Ngành Toàn Sàn Shopee (`wearable_fashion`, `beauty_care`, `kitchen_cooking`, `tech_gadget`, `food_beverage`, `gardening_outdoor`, `diy_repair_tool`, `home_appliance`, `mom_baby_lifestyle`). Tuyệt đối không rò rỉ bối cảnh làm vườn sang các ngành hàng khác và không xuất ảnh packshot trống vắng không có con người.
2. **Nguyên Tắc Vàng Diễn Hoạt Video (`Stage B5 — First Frame Only`):** Khi gọi Google Flow Veo 3.1 (`model_family="veo"`) hoặc Muse.ai tạo video `3 prompt video/SCENE_XX.mp4`, **chỉ đính kèm duy nhất 1 ảnh cảnh `2 prompt anh canh/SCENE_XX.png` làm First Frame**, tuyệt đối không đính kèm lại chip `UID01/UID02` rời.
3. **Thông Số Kỹ Thuật NSX Thật (`Zero Hallucination`) & Làm Sạch Lời Bình:** Mọi thông số kỹ thuật hiển thị ở `spec_badge_vi` phải trích 100% từ dữ liệu thật của Shop; câu kể chuyện `voice_vi` gửi lên `ai33.pro` phải sạch 100% (xưng hô đời thường tự nhiên như KOL tâm sự, không URL/hashtag/Markdown); `AI33_API_KEY` đọc từ cấu hình cục bộ, cấm hardcode.
4. **Đồng Bộ Hậu Kỳ 2 Chiều Sang `Timeline Studio (:8500)`:** Mọi dự án hoàn tất đều lưu chuẩn 8 ngăn (`utf-8-sig`) và tự động đồng bộ sang `<TIMELINE_STUDIO_WORKSPACE>/Shopee_Affiliate/Video/<Tên_Dự_Án>` để mở chỉnh sửa kéo-thả ngay trên cổng `:8500`.
