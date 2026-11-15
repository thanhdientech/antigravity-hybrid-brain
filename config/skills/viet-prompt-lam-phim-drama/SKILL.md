---
name: viet-prompt-lam-phim-drama
description: "Viết CSV Prompt phim Drama AI (Google Flow/Veo 3.1): đồng bộ Nhân vật-Bối cảnh-Đồ vật chính, ghép nhạc 6 cao trào & edit nhịp nhanh chậm."
group: "Làm Phim & Video AI"
---

# Bộ Kỹ Năng Chuyên Biệt: Viết Prompt Phim Drama AI, Đồng Bộ 3 Trụ Cột, Hòa Âm 6 Cao Trào & Edit Nhịp Nhanh – Chậm (`viet-prompt-lam-phim-drama`)

<!-- JAVIS_TRIGGER_ARCHIVE_START -->
## Khi nào dùng (Triggers & Ngữ cảnh kích hoạt đầy đủ)

> Skill độc lập chuyên trách chuyển kịch bản phim ngắn Drama (Cổ trang cung đấu/võ hiệp & Hiện đại tổng tài/hào môn/báo thù) thành bộ 4 File CSV Prompt chuẩn `UTF-8-SIG` (`B1_Phan_Canh.csv`, `B2_Nhan_Vat.csv`, `B3_Prompt_Anh_Canh.csv`, `B5_Prompt_Video_English.csv`, `B9_Music_Prompts.csv`, `Phu_De_Viet.srt`) chạy trên Google Flow (`Nano Banana Pro` + `Veo 3.1 Lite`). Giải quyết triệt để 4 bài toán cốt lõi: (1) Đồng bộ Nhân vật – Bối cảnh – Đồ vật chính xuyên suốt tập phim; (2) Thiết kế & sử dụng Nhạc nền 6 Hồi Cao Trào (`86–138 BPM`); (3) Kỹ thuật ghép cao trào phim (`Frequency Slotting`, `RMS Sidechain Ducking` hạ nhạc khi thoại & dâng trào sau thoại + `9 SFX` đòn bẩy); (4) Edit hậu kỳ nhịp nhanh – chậm (`4 Pacing Modes` + nhảy góc cận cảnh quang học `1.16x–1.32x`).
> TRIGGERS: "viết prompt drama", "viet prompt drama", "skill viết prompt riêng", "viet prompt lam phim drama", "đồng bộ nhân vật bối cảnh đồ vật", "dong bo nhan vat boi canh do vat", "khóa đạo cụ trong phim", "prompt google flow", "prompt veo 3.1 tiếng việt", "nhạc nền phim drama", "ghép cao trào phim", "edit nhịp nhanh chậm", "fast cut director", "B2_Nhan_Vat.csv", "B3_Prompt_Anh_Canh.csv", "B5_Prompt_Video_English.csv".
<!-- JAVIS_TRIGGER_ARCHIVE_END -->

- **Cẩm Nang Gốc Thực Chiến Tại Dự Án:** [`e:\DIEN APP\Lam phim AI Trung\CAM_NANG_TOAN_DIEN_LAM_PHIM_CO_TRANG_DRAMA_AI_GOOGLE_FLOW.md`](file:///e:/DIEN%20APP/Lam%20phim%20AI%20Trung/CAM_NANG_TOAN_DIEN_LAM_PHIM_CO_TRANG_DRAMA_AI_GOOGLE_FLOW.md)
- **Tổng Quan Hệ Thống Làm Phim Drama AI:** [`e:\DIEN APP\Lam phim AI Trung\00_TONG_QUAN_HE_THONG_LAM_PHIM_DRAMA_AI_TOAN_DIEN.md`](file:///e:/DIEN%20APP/Lam%20phim%20AI%20Trung/00_TONG_QUAN_HE_THONG_LAM_PHIM_DRAMA_AI_TOAN_DIEN.md)
- **Skill Phối Hợp Trước Đó (Viết Kịch Bản):** [`viet-kich-ban-drama`](../viet-kich-ban-drama/SKILL.md)

---

## 1. Bảng Điều Phối Tài Liệu Chuyên Sâu (`references/`)

| Bài Toán Kỹ Thuật Cốt Lõi | Tệp Tham Chiếu Cần Đọc | Nội Dung Chi Tiết |
| :--- | :--- | :--- |
| **1. Đồng bộ Nhân vật – Bối cảnh – Đồ vật chính xuyên suốt tập phim** | [`references/01-dong-bo-nhan-vat-boi-canh-do-vat-chinh-xuyen-suot.md`](./references/01-dong-bo-nhan-vat-boi-canh-do-vat-chinh-xuyen-suot.md) | Hằng số `CHAR_DNA_LOCK` (`uid01..06`), `LOC_LOCK` 4 lớp + Trục máy 180 độ (`loc01..05`), `PROP_LOCK` 4 lớp ghi kích thước `cm` (`prop01..06`) & Bảng vượt 4 bộ lọc Google Flow. |
| **2. Công thức viết Prompt Ảnh `B3` & Video `Veo 3.1` `B5` nói Tiếng Việt** | [`references/02-cong-thuc-prompt-anh-b3-va-video-veo31-b5.md`](./references/02-cong-thuc-prompt-anh-b3-va-video-veo31-b5.md) | Công thức 6 thành phần `B3` (Tiêu cự `35mm/50mm/85mm`), Công thức `B5` (`14–20 từ/cảnh`, `Voice Timbre Lock`, 3 mẫu `Lip-sync` / `Nội tâm ngậm miệng` / `SFX thuần túy`). |
| **3. Nhạc nền sử dụng thế nào & Cao trào phim ghép thế nào** | [`references/03-nhac-nen-6-cao-trao-va-hoa-am-sidechain-sfx.md`](./references/03-nhac-nen-6-cao-trao-va-hoa-am-sidechain-sfx.md) | Chia 6 Hồi Nhạc Nền (`86–138 BPM`), Lọc tần số `2400Hz/2800Hz`, Tự động hạ nhạc `24%` khi thoại & dâng vọt `66%` sau thoại (`RMS Sidechain Ducking`) + `9 SFX` cao trào. |
| **4. Nhịp nhanh – chậm thì Edit hậu kỳ thế nào (`FAST_CUT`)** | [`references/04-edit-nhip-nhanh-cham-va-optical-multi-angle.md`](./references/04-edit-nhip-nhanh-cham-va-optical-multi-angle.md) | Ma trận 4 Chế độ nhịp (`ACTION_BLITZ` / `REACTION_SNAP` / `CONFRONTATION_FAST` / `EMOTIONAL_CLIMAX`), Chia 1 cảnh thành 2 góc máy (`1.16x–1.32x`) & Trải nhạc liền mạch. |
| **5. Toàn văn Cẩm Nang Thực Chiến Làm Phim Drama AI Google Flow** | [`references/05-cam-nang-toan-dien-lam-phim-drama-google-flow.md`](./references/05-cam-nang-toan-dien-lam-phim-drama-google-flow.md) | Sổ tay tổng hợp 6 phần: Sơ đồ 5 bước, Đồng bộ 3 trụ cột, Prompt `B3/B5`, Nhạc 6 cao trào, Edit nhịp nhanh chậm & Lệnh CLI. |

---

## 2. Năm Quy Tắc Bất Biến Khi Viết Prompt & Dựng Hậu Kỳ Phim Drama AI

1. **Khóa Đồng Bộ 3 Trụ Cột Bằng Hằng Số (`CHAR_LOCK` + `LOC_LOCK` + `PROP_LOCK`):**
   - Cấm viết mô tả nhân vật, bối cảnh hoặc đồ vật chính mỗi cảnh một kiểu. Bắt buộc khai báo các biến hằng số tiếng Anh trong script sinh CSV (`build_project_csvs.py`) và **ghép nguyên văn 100%** vào mọi dòng `B3` và `B5` có nhân vật/bối cảnh/đồ vật đó xuất hiện. Mọi đồ vật chính (`PROP_LOCK`) bắt buộc ghi rõ kích thước bằng `cm` kèm tỷ lệ bàn tay (`25cm wide`, `7cm long, fits in one palm`).
2. **Vượt 100% Bộ Lọc Chính Sách Google Flow:**
   - Luôn mở đầu bằng `Exquisite 3D Stylized ... CG Animation (Unreal Engine 5 Donghua Cinema aesthetic, non-photorealistic fictional stylized 3D animated character)`, dùng danh xưng trưởng thành (`adult royal empress`, `adult billionaire CEO`), và dùng từ vựng điện ảnh thay cho từ máu me/bạo lực.
3. **Tắt Nhạc Nền Khi Render Video `Veo 3.1` ("No background music"):**
   - Mọi dòng trong `B5_Prompt_Video_English.csv` phải kết thúc bằng `No background music, no subtitles, no on-screen text.` để giữ âm thanh gốc hoàn toàn sạch cho bước phối nhạc 6 Cao Trào.
4. **Hòa Âm Cao Trào 3 Lớp (`Frequency Slotting` + `Sidechain Ducking` + `9 SFX`):**
   - Nhạc nền chia làm 6 Hồi (`86 -> 138 BPM`); tự động hạ xuống `24% (-12.4 dB)` khi nhân vật mở miệng nói và dâng vọt lên `52%–66% (-5.6 dB -> -3.7 dB)` ngay khi nhân vật dứt câu hoặc trong cảnh sững sờ/hành động, kết hợp 9 hiệu ứng SFX đúng điểm rơi.
5. **Edit Nhịp Nhanh – Chậm Có Chủ Đích & Trải Nhạc Sau Khi Cắt Cảnh:**
   - Áp dụng `ACTION_BLITZ (2.8s–4.5s, 1.14x–1.20x)` cho cảnh hành động, `REACTION_SNAP (3.1s–4.2s)` cho cảnh sững sờ/lộ vật chứng, `CONFRONTATION_FAST (3.8s–5.5s)` cho cảnh đấu khẩu, và giữ nhịp chậm `EMOTIONAL_CLIMAX (4.5s–5.6s, 1.00x–1.05x)` cho cảnh bi tráng/kết màn. **Luôn cắt gọn hình + thoại của toàn bộ cảnh trước, sau đó mới trải 6 chương nhạc nền liền mạch lên trục thời gian mới.**
