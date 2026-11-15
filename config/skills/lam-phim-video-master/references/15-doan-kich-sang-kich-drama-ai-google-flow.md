# Quy Trình Toàn Diện Làm Phim Drama AI (Đoản Kịch / Sảng Kịch Trung Quốc, Cổ Trang & Hiện Đại 9:16 / 16:9) Trên Google Flow (`Veo 3.1` + `Nano Banana Pro`)

> **Tài liệu Tổng Quan & SOP Thực Chiến:** Tích hợp 20 Repo Biên kịch Đoản kịch Trung Quốc (`e:\DIEN APP\Lam phim AI Trung\github_drama_repos\`), quy trình viết truyện/nhân vật/thoại, viết Prompt khóa nhân vật (`LOCK-UID`), điều phối render Google Flow qua `timeline_studio`, ghép nhạc nền 6 cao trào (`Suno AI BGM + Sidechain Ducking`) và dựng nhịp nhanh (`Director's Fast-Cut`).
> **File Tổng Quan Gốc tại Dự Án:** `e:\DIEN APP\Lam phim AI Trung\00_TONG_QUAN_HE_THONG_LAM_PHIM_DRAMA_AI_TOAN_DIEN.md`

---

## 1. Kho 20 Repo GitHub Biên Kịch Đoản Kịch & Sảng Văn Trung Quốc (`github_drama_repos`)

Toàn bộ 20 kho mã nguồn mở (`8,554 files`) đã được tải sẵn tại `e:\DIEN APP\Lam phim AI Trung\github_drama_repos\`:
- **`hongguo-shortdrama-screenwriting` (Hạng 1 Khung Kịch bản Hồng Quả/Douyin v4.0):** Quy chuẩn tập phim dài 3–5 phút (`长档`), cấu trúc Song Hiệp (`Hiệp A + Móc câu giữa tập + Hiệp B + Điểm cắt cuối tập`) và 4 công thức ngắt tập (`cliffhanger-master-formulas.md`).
- **`emma-screenwriting-skills` (26 Skills Biên kịch & Chuyển ngữ Anh–Mỹ ReelShort):** Gồm `em-story-architect`, `em-chief-writer`, `em-logic-chain`, `drama-humanizer` (khử mùi AI) và `drama-dialogue-localizer` (chuyển lời thoại sang tiếng Anh Bắc Mỹ).
- **`Chinese-WebNovel-Skill` (Hạng 1 Viết Truyện Sảng Văn):** Kho ngữ liệu tiểu thuyết thật và 10 module (`concept_planning`, `opening`, `dialogue`, `plot_logic`, `anti_ai_voice`).
- **`0xsline/short-drama` (8 Sổ tay Sảng kịch):** 13 thể loại, Quy tắc 5 giây vàng mở màn, Ma trận 5 điểm sảng khoái, Hệ thống 4 tầng phản diện và 5 loại Hook.
- **`SumOneHK/short-drama-scriptwriter` (18 Chốt kiểm soát):** Quy tắc "Bộ 3 Đậm đặc Kịch tính" (Thoại đối đầu ẩn ý + Ngoại hóa tâm lý thành hành động vật lý + Lựa chọn có trả giá).
- **`Hao0321/ai-short-drama`:** Sổ Nợ Sảng Khoái (`Payoff Debt Ledger`) & Thang Lật Bài 5 Bậc (`Reveal Ladder`).
- **`zenstory-ai/drama-skills`, `eternityspring/shuohao-skills`, `YvonneMovingon/short-drama-skills`, `liuxiao20051106-prog/ai-manga-drama`:** Đồng bộ Kịch bản $\rightarrow$ Nhân vật (`LOCK-*`) $\rightarrow$ Phân cảnh $\rightarrow$ Ngân sách tốc độ thoại (`12–18 từ / cảnh 8s`).

---

## 2. Quy Trình 5 Bước Sản Xuất Phim Drama AI (Viết Kịch Bản Trước — Render Sau)

### Bước 1: Viết Truyện, Hồ Sơ Nhân Vật (`UID01..UID05`), Sổ Nợ Sảng Khoái & Kịch Bản Chi Tiết (Cấm Render Trước Khi Duyệt Kịch Bản)
- Luôn tạo file kịch bản đầy đủ (`.md`) trước, gồm:
  1. **Tương phản cốt lõi (`Core Identity Gap`):** Bề ngoài giản dị/nhẫn nhịn vs. Thân phận Chủ tịch/Kiến trúc sư trưởng/Phế hậu giữ mật chỉ.
  2. **Sổ Nợ Sảng Khoái (`Payoff Debt Ledger`):** Mỗi lần bị sỉ nhục ở đầu phim phải gắn với **1 Đạo cụ Neo cảm xúc** (cây bút kỷ vật, tờ đơn ly hôn, sợi dây chuyền, bản vẽ) để trả nợ gấp 10 lần ở cao trào.
  3. **Cấu trúc Song Hiệp (24–38 cảnh $\times$ 8s/tập):** `Móc câu 5 giây vàng` $\rightarrow$ `Hiệp A` $\rightarrow$ `Móc câu giữa tập (phút 1:30)` $\rightarrow$ `Hiệp B (Trả nợ sảng khoái)` $\rightarrow$ `Điểm cắt cuối tập (Cliffhanger)`.
  4. **Định dạng từng cảnh 8 giây:** Ghi rõ `△ Hành động vật lý ngoại hóa tâm lý`, `♪ Âm thanh SFX & Pha nhạc BGM`, và `Lời thoại sắc bén (12–18 từ)`.

### Bước 2: Xuất Bộ 4 File CSV Prompt Chuẩn (`UTF-8-SIG` BOM) & Quy Tắc Vượt Bộ Lọc Google Flow
1. **`1 prompt nhan vat/B2_Nhan_Vat.csv`:**
   - Khóa ngoại hình nhân vật (`[uid01]..[uid05]`) trên nền trắng `#F8F6F0` theo tỷ lệ `9:16` hoặc `16:9`.
   - Bắt buộc có cụm: `(Unreal Engine 5 Stylized Cinema aesthetic, fictional stylized 3D animated character, non-photorealistic)` và `--no text, words, letters, watermark, real human photo, celebrity`.
2. **`2 prompt anh canh/B3_Prompt_Anh_Canh.csv`:**
   - Mở đầu bằng `[SCENE_XX] [{uid01}] [{uid02}]` + `STYLE_PREFIX` + Cỡ cảnh/Góc máy + `Spatial blocking` (vị trí, đạo cụ, ánh sáng) + `IMG_NEG`.
3. **`3 prompt video/B5_Prompt_Video_English.csv`:**
   - Mở đầu bằng `[SCENE_XX] <STYLE_PREFIX><Camera Motion>. <Mô tả khung hình đầu>. [0.0s-8.0s Action]: The subject <hành động vật lý an toàn chính sách>. The <nhân vật> speaks aloud in <mô tả chất giọng bằng tiếng Anh>: "<Lời thoại Tiếng Việt hoặc Tiếng Anh>" SFX: <tiếng động>. No background music, no subtitles, no on-screen text.`
4. **`5 srt/Phu_De_Viet.srt` & `0 Noi dung video/B1_Phan_Canh.csv`.**

### Bước 3: Điều Phối Render Đa Luồng Trên Google Flow Qua `timeline_studio`
- Sử dụng `E:\DIEN APP\Xây Kênh Youtube\Tool render edit Video\omniflash\youtube\flow_ui_batch.py` kết nối với FlowKit Server (`:8100`):
  - Tỷ lệ dọc `9:16`: `--aspect "9:16" --imodel "nano_banana_pro" --vmodel "veo_3_1_lite" --threads 3`
  - Tỷ lệ ngang `16:9`: `--aspect "16:9" --imodel "nano_banana_pro" --vmodel "veo_3_1_lite" --threads 3`

### Bước 4: Ghép Nhạc Nền 6 Cao Trào (`Suno AI v4.5 BGM`) + `SFX` + `RMS Sidechain Ducking`
- Chia tập phim thành **6 Pha Âm Nhạc (`Phase 1..Phase 6`)** tương ứng với 6 nấc thang kịch tính.
- Dùng FFmpeg trộn lời thoại (`volume=1.35`) với nhạc nền (`volume=0.26`, fade-in/out mượt) và chuẩn hóa âm lượng toàn phim đạt **`-14 LUFS`**.

### Bước 5: Dựng Nhịp Nhanh (`Director's Fast-Cut`) & Đóng Phụ Đề (`Burn-in Subtitles`)
- Chạy thuật toán `build_fast_paced_director_cut.py`:
  1. **Cắt khoảng chết đầu/cuối cảnh (`Trim Dead Air`)** dựa trên ngưỡng âm lượng lời thoại.
  2. **Tăng tốc theo nhịp cảm xúc (`Speed Ramping`):** `1.14x–1.20x` cho cảnh hành động/xung đột, `1.08x–1.12x` cho cảnh đấu khẩu, `1.00x–1.05x` cho cảnh lắng đọng.
  3. **Cắt cận cảnh quang học giữa câu thoại (`1.16x Optical Punch-In Cut`)** cho các cảnh dài để tạo nhịp cắt chuyển góc máy liên hoàn.
  4. **Đóng phụ đề `.srt` khớp thời gian thực** xuất ra `FAST_CUT_VIETSUB.mp4`.
