---
name: viet-kich-ban-drama
description: "Viết truyện, nhân vật, thoại & kịch bản phim ngắn Drama (Đoản kịch/Sảng kịch Cổ trang & Hiện đại) theo chuẩn 20 Repo Trung Quốc."
group: "Làm Phim & Video AI"
---

# Bộ Kỹ Năng Chuyên Biệt: Viết Truyện, Nhân Vật, Thoại & Kịch Bản Phim Drama (`viet-kich-ban-drama`)

<!-- JAVIS_TRIGGER_ARCHIVE_START -->
## Khi nào dùng (Triggers & Ngữ cảnh kích hoạt đầy đủ)

> Skill độc lập chuyên trách sáng tác cốt truyện, thiết kế hồ sơ nhân vật, hồ sơ bối cảnh cố định, hồ sơ đồ vật/tín vật định mệnh xuyên suốt tập phim, viết lời thoại sắc bén và lập kịch bản phân cảnh chi tiết cho phim ngắn Drama (Đoản kịch / Sảng kịch Trung Quốc & Việt Nam, Cổ trang cung đấu/quyền mưu, Hiện đại tổng tài/hào môn/báo thù/hôn nhân, Học tiếng Anh qua phim drama) tỷ lệ `9:16` hoặc `16:9`, thời lượng `3–5 phút/tập` (Series nhiều tập). Tích hợp tinh hoa từ 20 Repo Đoản Kịch Mã Nguồn Mở Trung Quốc (Hongguo Dual-Round, Payoff Debt Ledger, Story-Flicks, ViMax, Huobao Drama).
> TRIGGERS: "viết kịch bản drama", "viet kich ban drama", "skill viết kịch bản drama", "viết truyện drama", "kịch bản đoản kịch", "kich ban doan kich", "kịch bản sảng kịch", "kich ban sang kich", "kịch bản phim ngắn trung quốc", "kịch bản tổng tài", "kịch bản cổ trang cung đấu", "kịch bản báo thù", "kịch bản hào môn", "kịch bản phim nhiều tập", "sổ nợ sảng khoái", "payoff debt ledger", "hongguo shortdrama", "viết lời thoại drama".
<!-- JAVIS_TRIGGER_ARCHIVE_END -->

- **Kho 20 Repo Gốc Trong Máy:** [`e:\DIEN APP\Lam phim AI Trung\github_drama_repos\`](file:///e:/DIEN%20APP/Lam%20phim%20AI%20Trung/github_drama_repos) (`8,554 files` / `156.10 MB`)
- **Sổ Tay Tổng Hợp 20 Repo:** [`KHO_REPO_VA_CONG_THUC_VIET_KICH_BAN_DOAN_KICH_TRUNG_QUOC.md`](file:///e:/DIEN%20APP/Lam%20phim%20AI%20Trung/KHO_REPO_VA_CONG_THUC_VIET_KICH_BAN_DOAN_KICH_TRUNG_QUOC.md)
- **Skill Phối Hợp Tiếp Theo (Sau Khi Chốt Kịch Bản):** [`viet-prompt-lam-phim-drama`](../viet-prompt-lam-phim-drama/SKILL.md) *(Chuyển kịch bản thành bộ CSV Prompt khóa đồng bộ Nhân vật – Bối cảnh – Đồ vật chính, ghép nhạc 6 cao trào & edit nhịp nhanh chậm)*.

---

## 1. Bảng Điều Phối Tài Liệu Chuyên Sâu (`references/`)

| Tình Huống / Yêu Cầu Biên Kịch | Tệp Tham Chiếu Cần Đọc | Nội Dung Cốt Lõi |
| :--- | :--- | :--- |
| **Cấu trúc 5 Nhịp Cắt Cảnh 60s, Sổ Nợ Sảng Khoái & Series Nhiều Tập** | [`references/01-cong-thuc-doan-kich-sang-kich-hong-qua.md`](./references/01-cong-thuc-doan-kich-sang-kich-hong-qua.md) | Ma trận 5 nhịp Hồng Quả (`Hook 0–3s` $\rightarrow$ `Cliffhanger`), Tỷ lệ `1 Móc Câu : 3 Vả Mặt`, Cấu trúc Series 5–20 tập (`3–5 phút/tập`). |
| **Thiết kế 3 Trụ Cột Cố Định (Nhân vật – Bối cảnh – Đồ vật chính) & Lời thoại** | [`references/02-thiet-ke-nhan-vat-boi-canh-do-vat-chinh-va-thoai.md`](./references/02-thiet-ke-nhan-vat-boi-canh-do-vat-chinh-va-thoai.md) | Hồ sơ Nhân vật (`uid01..uid06`), Bối cảnh (`loc01..loc05`), Đồ vật định mệnh (`prop01..prop05`), Luật viết câu thoại `14–20 từ/cảnh 8s`. |
| **Kho 20 Repo Đoản Kịch Trung Quốc & Kịch Bản Mẫu Thực Chiến** | [`references/03-kho-20-repo-va-kich-ban-mau-co-trang-hien-dai.md`](./references/03-kho-20-repo-va-kich-ban-mau-co-trang-hien-dai.md) | Phân loại 20 Repo GitHub, mẫu kịch bản Cổ trang (*Phế Hậu Trở Về*) & Hiện đại Việt Nam (*Chủ Tịch Ẩn Danh 5 Tập*). |
| **Toàn văn Sổ Tay Chi Tiết 20 Repo Đoản Kịch Trung Quốc** | [`references/04-so-tay-chi-tiet-20-repo-doan-kich-trung-quoc.md`](./references/04-so-tay-chi-tiet-20-repo-doan-kich-trung-quoc.md) | Sổ tay giải phẫu chi tiết từng repo trong 20 Repo Đoản Kịch & Sảng Văn Trung Quốc. |

---

## 2. Quy Tắc Bắt Buộc Khi Viết Kịch Bản Phim Drama (`5 Thiết Luật Biên Kịch`)

1. **Thiết luật 1 — Tạo Kịch Bản Trước, Khoan Render (`Script-First, Render-Later`):**
   - Luôn xuất bản thảo Kịch bản tổng thể (`KICH_BAN_TONG_THE.md`) và kịch bản chi tiết từng tập (`KICH_BAN_TAP_0X.md`) để người dùng đọc duyệt lời thoại, cốt truyện trước. Tuyệt đối không tự ý chạy lệnh render video khi người dùng chưa chốt kịch bản.
2. **Thiết luật 2 — Khai Báo Trước "Bảng 3 Trụ Cột Cố Định" Ngay Đầu Mỗi Tập Kịch Bản:**
   - Trước khi viết Cảnh 01, bắt buộc lập 3 bảng định nghĩa rõ:
     - **Bảng 1 — Hồ Sơ Nhân Vật (`uid01..uid06`):** Tên, tuổi trưởng thành, thân phận ẩn vs. thân phận thật, trang phục cố định (từ đầu đến giày/hài), chất giọng (`Voice Timbre`).
     - **Bảng 2 — Hồ Sơ Bối Cảnh Cố Định (`loc01..loc05`):** Tập phim chỉ xoay quanh 1–3 không gian chính; ghi rõ kiến trúc, vật mốc hậu cảnh, thời tiết và ánh sáng để giữ đồng bộ xuyên suốt.
     - **Bảng 3 — Hồ Sơ Đồ Vật / Tín Vật Chính (`prop01..prop05`):** Định nghĩa 2–4 đồ vật đóng vai trò mở nút thắt (mật chỉ, ngọc bội gãy, hổ phù, hợp đồng ly hôn, nhẫn kim cương, thẻ đen...) kèm kích thước thực tế (`cm`), màu sắc, dấu hiệu nhận biết độc nhất và liệt kê chính xác đồ vật đó xuất hiện ở những cảnh nào.
3. **Thiết luật 3 — Ma Trận 5 Nhịp Cắt Cảnh & Sổ Nợ Sảng Khoái (`Payoff Debt Ledger`):**
   - Mỗi phút phim (`7–8 cảnh` x `8 giây`) phải đi qua đủ 5 nhịp: **`Hook thị giác (0–3s)`** $\rightarrow$ **`Nén uất ức / Bị sỉ nhục (3–15s)`** $\rightarrow$ **`Leo thang & Cược lớn (15–35s)`** $\rightarrow$ **`Phản đòn / Lộ vật chứng vả mặt (35–50s)`** $\rightarrow$ **`Móc câu Cliffhanger (50–60s)`**.
   - Mỗi lần nhân vật chính bị chà đạp là ghi **1 khoản Nợ Cảm Xúc**; bắt buộc phải trả nợ bằng màn lật bàn gấp 3 lần (`1 Móc Câu : 3 Vả Mặt`).
4. **Thiết luật 4 — Chuẩn Độ Dài Lời Thoại Cho Cảnh 8 Giây (`14–20 Từ Tiếng Việt / Cảnh`):**
   - Mỗi cảnh `8.0s` chỉ chứa **1 hành động chính** và **1 câu thoại đắt giá dài `14–20 từ`** (tương ứng `4.0s–5.2s` giọng đọc), kèm ghi chú rõ chế độ thoại: `[Lip-Sync nói trực tiếp]`, `[Độc thoại nội tâm - miệng ngậm chặt]`, hoặc `[Cận cảnh Đồ vật / Hành động thuần SFX]`.
5. **Thiết luật 5 — Từ Vựng Điện Ảnh An Toàn Chính Sách:**
   - Trong cả phần mô tả hành động và lời thoại, chủ động dùng ngôn từ kịch tính điện ảnh (*"bức mật chỉ"*, *"xử tội"*, *"chén trà bị tráo"*, *"ra tay tuyệt tình"*, *"tước đoạt toàn bộ cổ phần"*) thay cho các từ bạo lực thô (*"máu"*, *"giết"*, *"thuốc độc"*, *"chết"*) để khi chuyển sang bước viết Prompt Google Flow đạt tỷ lệ vượt lọc 100%.
