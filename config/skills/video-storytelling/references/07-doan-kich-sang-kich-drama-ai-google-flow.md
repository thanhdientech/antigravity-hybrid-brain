# Quy Trình Toàn Diện Làm Phim Drama AI (Đoản Kịch / Sảng Kịch Trung Quốc, Cổ Trang & Hiện Đại 9:16 / 16:9) Trên Google Flow (`Veo 3.1` + `Nano Banana Pro`)

> **Tài liệu Tổng Quan & SOP Thực Chiến:** Tích hợp 20 Repo Biên kịch Đoản kịch Trung Quốc (`e:\DIEN APP\Lam phim AI Trung\github_drama_repos\`), quy trình viết truyện/nhân vật/thoại ([`viet-kich-ban-drama`](../../viet-kich-ban-drama/SKILL.md)), viết Prompt khóa đồng bộ 3 trụ cột Nhân vật – Bối cảnh – Đồ vật chính ([`viet-prompt-lam-phim-drama`](../../viet-prompt-lam-phim-drama/SKILL.md)), điều phối render Google Flow qua `timeline_studio`, ghép nhạc nền 6 cao trào (`Suno AI BGM + Sidechain Ducking`) và dựng nhịp nhanh – chậm (`Director's Fast-Cut`).
> **Cẩm Nang Chi Tiết:** `e:\DIEN APP\Lam phim AI Trung\CAM_NANG_TOAN_DIEN_LAM_PHIM_CO_TRANG_DRAMA_AI_GOOGLE_FLOW.md`

---

## 1. Kho 20 Repo GitHub Biên Kịch Đoản Kịch & Sảng Văn Trung Quốc (`github_drama_repos`)

Toàn bộ 20 kho mã nguồn mở (`8,554 files`) đã được tải sẵn tại `e:\DIEN APP\Lam phim AI Trung\github_drama_repos\`:
- **`hongguo-shortdrama-screenwriting` (Hạng 1 Khung Kịch bản Hồng Quả/Douyin v4.0):** Quy chuẩn tập phim dài 3–5 phút (`长档`), cấu trúc Song Hiệp (`Hiệp A + Móc câu giữa tập + Hiệp B + Điểm cắt cuối tập`) và 4 công thức ngắt tập (`cliffhanger-master-formulas.md`).
- **`emma-screenwriting-skills` (26 Skills Biên kịch & Chuyển ngữ Anh–Mỹ ReelShort):** Gồm `em-story-architect`, `em-chief-writer`, `em-logic-chain`, `drama-humanizer` (khử mùi AI) và `drama-dialogue-localizer`.
- **`Chinese-WebNovel-Skill` (Hạng 1 Viết Truyện Sảng Văn):** Kho ngữ liệu tiểu thuyết thật và 10 module (`concept_planning`, `opening`, `dialogue`, `plot_logic`, `anti_ai_voice`).
- **`0xsline/short-drama` (8 Sổ tay Sảng kịch):** 13 thể loại, Quy tắc 5 giây vàng mở màn, Ma trận 5 điểm sảng khoái, Hệ thống 4 tầng phản diện và 5 loại Hook.
- **`SumOneHK/short-drama-scriptwriter` (18 Chốt kiểm soát):** Quy tắc "Bộ 3 Đậm đặc Kịch tính" (Thoại đối đầu ẩn ý + Ngoại hóa tâm lý thành hành động vật lý + Lựa chọn có trả giá).
- **`Hao0321/ai-short-drama`:** Sổ Nợ Sảng Khoái (`Payoff Debt Ledger`) & Thang Lật Bài 5 Bậc (`Reveal Ladder`).

---

## 2. Hai Bộ Skill Riêng Biệt Phối Hợp Thực Thi

1. **[`viet-kich-ban-drama`](../../viet-kich-ban-drama/SKILL.md) (Skill Riêng Viết Kịch Bản Drama):**
   - Thiết kế cốt truyện, Sổ Nợ Sảng Khoái (`1 Móc Câu : 3 Vả Mặt`), Hồ sơ 3 trụ cột cố định (`Nhân vật uid` + `Bối cảnh loc` + `Đồ vật chính prop kèm kích thước cm`) và lời thoại `14–20 từ/cảnh`.
2. **[`viet-prompt-lam-phim-drama`](../../viet-prompt-lam-phim-drama/SKILL.md) (Skill Riêng Viết Prompt, Hòa Âm 6 Cao Trào & Edit Nhịp Nhanh – Chậm):**
   - Khóa hằng số `CHAR_LOCK` + `LOC_LOCK` (trục máy 180 độ) + `PROP_LOCK` (kích thước `cm`) xuyên suốt tập phim trong `B2`, `B3`, `B5`.
   - Chia 6 Hồi Nhạc Nền (`86 -> 138 BPM`), lọc tần số `2400Hz/2800Hz`, `RMS Sidechain Ducking` (`24%` khi thoại $\rightarrow$ `66%` sau thoại) + `9 SFX` cao trào.
   - Edit hậu kỳ theo 4 chế độ nhịp (`ACTION_BLITZ`, `REACTION_SNAP`, `CONFRONTATION_FAST`, `EMOTIONAL_CLIMAX`) và chia 1 cảnh thành 2 góc máy (`1.16x–1.32x`).
