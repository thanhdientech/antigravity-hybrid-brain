# 02. Đồ Họa Motion 2D (`13 Archetypes`), 5 Không Gian Studio, REST API & 15 MCP Tools (`renderlongytb`)

Hướng dẫn chuẩn hóa cách tạo file đồ họa chuyển động `B5_Motion2D.json`, định mức từ lời bình và danh mục đầy đủ 15 MCP Tools trên cổng `:8500`.

---

## 1. Quy Chuẩn 1 File `B5_Motion2D.json` Duy Nhất & 13 Kiểu `archetype`

- **Vị trí bắt buộc:** `{project_dir}/3 prompt video/B5_Motion2D.json` (`encoding="utf-8-sig"`).
- **Cấm tách lẻ nhiều file:** Toàn bộ các cảnh đồ họa 2D của 1 video nằm chung trong mảng `"scenes": [...]` của 1 file này; mỗi phần tử chọn 1 trong **13 mã `archetype`** dưới đây (lấy mẫu chuẩn qua `GET http://127.0.0.1:8500/api/remotion/template-sample`):

| STT | Mã `archetype` | Công Dụng & Trường Dữ Liệu Chính |
| :---: | :--- | :--- |
| 1 | `WAR_MAP_HUD` | Bản đồ địa chính trị, vệ tinh, radar tọa độ (`title`, `subtitle`, `badgeText`, `metrics`, `narration`) |
| 2 | `CHAPTER_INTRO` | Màn hình mở đầu chương lớn (`chapterCode`, `title`, `subtitle`, `narration`) |
| 3 | `METRIC_COMPARISON` | Biểu đồ thanh ngang so sánh chỉ số (`title`, `metrics: [{name, val, color}]`, `narration`) |
| 4 | `VERSUS_CARD` | Bảng đối đầu trực diện 2 cột A vs B (`title`, `leftSide`, `rightSide`) |
| 5 | `HORIZONTAL_TIMELINE` | Trục thời gian lịch sử nằm ngang (`title`, `timelineEvents: [{year, label, desc}]`) |
| 6 | `INCIDENT_TIMELINE` | Nhật ký diễn biến sự kiện theo mốc giờ (`title`, `incidentSteps: [{time, status, desc}]`) |
| 7 | `ARCHITECTURE_FLOW` | Sơ đồ khối luồng hệ thống công nghệ (`title`, `flowNodes: [...]`) |
| 8 | `MODERN_IDE` | Khung trình soạn thảo code IDE tự gõ cú pháp màu (`title`, `codeLines: [...]`) |
| 9 | `TERMINAL_VIEW` | Màn hình dòng lệnh CLI / DevOps (`title`, `codeLines: [...]`) |
| 10 | `DOCUMENT_STAMP` | Hồ sơ mật & đóng dấu phân loại đỏ (`title`, `stampText`, `bulletPoints: [...]`) |
| 11 | `ICON_GRID_COUNTER` | Lưới thống kê 25 icon tỷ lệ % & nhảy số (`title`, `metrics: [...]`) |
| 12 | `METRIC_GAUGE` | Đồng hồ tốc độ đo hiệu năng / mức độ rủi ro `0–100%` (`title`, `gaugeValue`, `badgeText`) |
| 13 | `VEO3_HYBRID_HUD` | Lớp phủ HUD 2D trong suốt đè lên nền Video AI / Ảnh cảnh (`title`, `badgeText`, `metrics`, `backgroundAsset`) |

*(Cẩm nang chi tiết đầy đủ tại ổ E: `E:\DIEN APP\Xây Kênh Youtube\Tool render edit Video\HUONG_DAN_VIET_TEMPLATE_JSON_DA_NGANH.md` và file mẫu `TEMPLATE_MAU_TONG_HOP_DA_NGANH.json`).*

---

## 2. Định Mức Số Từ Lời Bình Chuẩn Golden Ratio & Cấu Trúc Thư Mục Dự Án

Khi viết kịch bản `1_Kich_Ban_Phan_Canh.csv` (Tab 1) khớp thời lượng từng cảnh để không bị hụt hình hoặc cắt cụt chữ khi ghép TTS:
- Cảnh **`8s`**: `22 – 28 từ` / cảnh.
- Cảnh **`10s`**: `28 – 35 từ` / cảnh.
- Cảnh **`20s`**: `55 – 70 từ` / cảnh.
- Cảnh **`30s`**: `85 – 105 từ` / cảnh.

**Cấu trúc các ngăn trong `{project_dir}`:**
- `1 prompt nhan vat/B2_Nhan_Vat.csv` & `UID01.png..`
- `2 prompt anh canh/B3_Prompt_Anh_Canh.csv` & `SCENE_01.png..`
- `3 prompt video/B5_Prompt_Video.csv`, `B5_Motion2D.json` & `SCENE_01.mp4..`
- `4 am nhac sfx/Buoc_9_SFX_Music.csv` & file `.mp3` nhạc nền Suno/FlowMusic
- `5 srt/` — file `.srt` và các đoạn thoại `VOICE_01.mp3..` (`taogiongai.com` / `ai33.pro`)
- `6 thumbnail/B8_Thumbnail.csv` & ảnh bìa YouTube
- `4 Render/` — file `.MP4` thành phẩm xuất từ Bàn dựng Timeline 4-Track (có Auto-Ducking `sidechaincompress` & Hardsub ASS/SRT).

---

## 3. Danh Mục 15 MCP Tools Điều Khiển Qua `http://127.0.0.1:8500/api/mcp/call` (Hoặc `timeline_studio/mcp_timeline.py`)

Gửi `POST http://127.0.0.1:8500/api/mcp/call` với JSON `{"tool": "<tên_tool>", "arguments": {...}}`:

1. **`timeline_list_projects`**: Liệt kê toàn bộ Kênh & Dự án Video trong `master_youtube_root`.
2. **`timeline_check_ingredients`**: Kiểm kê 100% nguyên liệu (`UIDXX.png`, `SCENE_XX.png`, `SCENE_XX.mp4`, Voice, SRT, BGM, Thumbnail) kèm cờ `can_assemble_final_video`.
3. **`project_audit_and_clean`**: Phát hiện file 0-byte/hỏng `moov atom`, file trùng lặp và dọn rác (`scan`, `clean_corrupt`, `clean_duplicates`, `clean_all_trash`).
4. **`render_run_stage`**: Chạy Stage `2` (Nhân vật), `3` (Ảnh cảnh), `4` (Video cảnh), `9` (Nhạc BGM), `11` (Thumbnail) với 1 trong 6 `engine`.
5. **`render_control_job`**: Xem tiến độ (`status`), kiểm tra kết nối trình duyệt (`engines_status`), hoặc `pause` / `resume` / `stop`.
6. **`voice_list_and_status`**: Lấy danh sách giọng đọc `ai33.pro` / `taogiongai.com` và kiểm tra câu SRT nào đã có MP3.
7. **`voice_render_tts`**: Sinh giọng đọc AI tự động từ `.SRT` (`srt_batch_stage6`, `srt_direct_dubbing`, `single_text`).
8. **`bgm_render_music`**: Tạo nhạc nền qua Suno AI (Profile 67) / FlowMusic vào `4 am nhac sfx/`.
9. **`remotion_get_templates_and_guide`**: Lấy danh mục 13 Archetype, mẫu `sample_all_industries` và `sample_satellite_route`.
10. **`remotion_import_template`**: Nạp JSON Template vào `3 prompt video/B5_Motion2D.json`.
11. **`remotion_render_pipeline`**: Kích hoạt Render GPU 2D (`full_pipeline`, `project_scenes`, `single_scene`, `assemble_only`).
12. **`remotion_get_status`**: Xem tiến độ Render GPU 2D và đường dẫn file MP4 xuất ra.
13. **`timeline_get_draft`**: Đọc cấu trúc bàn dựng `project_draft.json` (4 tracks, âm lượng, Auto-Ducking).
14. **`timeline_edit_tracks`**: Chỉnh sửa clip (`update_clip`), sửa sub (`update_subtitle`), chỉnh Auto-Ducking (`set_audio_mastering`), nạp thông minh (`smart_load`).
15. **`timeline_assemble_and_export`**: Tự động lắp ráp toàn bộ nguyên liệu, trộn Auto-Ducking, đốt Hardsub và chạy FFmpeg xuất file `.MP4` cuối cùng.
