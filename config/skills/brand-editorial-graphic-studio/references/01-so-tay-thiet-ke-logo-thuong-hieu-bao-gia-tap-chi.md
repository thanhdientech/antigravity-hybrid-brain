# Sổ Tay Quy Chuẩn Thiết Kế Logo SVG, Bộ Nhận Diện Thương Hiệu (CIP), Báo Giá Doanh Nghiệp, Tạp Chí Đa Cột & Banner Quảng Cáo

## 1. Quy Chuẩn Thiết Kế Logo Vector SVG & Bộ Nhận Diện Thương Hiệu (Brand Book / CIP)

### 1.1. Quy trình 4 Bước Thiết Kế Logo Chuyên Nghiệp
1. **Lập Hồ Sơ Định Vị (`Logo Design Brief`):** Chạy `skills/01_logo-cip-icon-social/scripts/logo/search.py "<ngành nghề + tính cách>" --design-brief -p "<Tên Thương Hiệu>"` để chọn 3 phương án hướng tiếp cận khác biệt (ví dụ: *Option A — Geometric Monogram*, *Option B — Minimalist Pictorial Mark*, *Option C — Bespoke Wordmark*).
2. **Dựng Lưới Hình Học Vector SVG (`Construction Grid`):**
   - Sử dụng `viewBox="0 0 512 512"` hoặc `viewBox="0 0 800 320"` với tọa độ nguyên/nửa nguyên sạch sẽ, độ dày nét (`stroke-width`) nhất quán theo bội số `4px` hoặc `8px`.
   - Kiểm tra khả năng thu nhỏ (`Scalability Test`): Logo phải nhận diện rõ ràng ở kích thước `24x24px` (App Icon / Favicon) và sắc nét tuyệt đối khi phóng lớn in bảng hiệu.
3. **Xuất Đủ 4 Phiên Bản Màu Bắt Buộc (`4 Mandatory Lockups`):**
   - **Primary Full-Color:** Trên nền sáng chuẩn.
   - **Reversed / Dark-Mode:** Trên nền tối thương hiệu.
   - **Monochrome Black (`#111111`) & White (`#FFFFFF`):** Phục vụ khắc laser, dập nổi, đóng dấu mộc, in 1 màu.
   - **Clear-Space & Minimum Size Rule:** Quy định vùng an toàn tối thiểu xung quanh Logo bằng `1x` chiều cao chữ cái hoặc biểu tượng lõi.
4. **Triển Khai Bộ Nhận Diện Thương Hiệu CIP (`50+ Ấn Phẩm`):**
   - Nhóm Văn Phòng (*Corporate Stationery*): Danh thiếp (`90 x 54 mm`), Giấy tiêu đề A4 (`Letterhead`), Phong bì lớn/nhỏ (`C4/DL`), Bìa hồ sơ (`Folder`), Thẻ nhân viên, Chữ ký Email HTML.
   - Nhóm Thương Mại & Sự Kiện: Bìa Hồ sơ năng lực, Mẫu Báo giá thương mại, Hóa đơn, Template Slide `16:9`, Standee (`80 x 180 cm`), Backdrop, Ấn phẩm Social Media.

---

## 2. Quy Chuẩn Thiết Kế Báo Giá Thương Mại & Hồ Sơ Năng Lực (`Commercial Quotation & Proposal A4`)

1. **Cấu Trúc Bố Cục Báo Giá Chuyên Nghiệp (Chuẩn A4 `210mm x 297mm`):**
   - **Header Thương Hiệu:** Logo SVG sắc nét + Tên pháp nhân, Mã số thuế, Địa chỉ, Hotline/Email + Khối định danh chứng từ nổi bật (`BẢNG BÁO GIÁ / COMMERCIAL QUOTATION`, Số báo giá, Ngày lập, Hiệu lực báo giá).
   - **Khối Thông Tin Khách Hàng (`Kính gửi / Prepared For`):** Tên doanh nghiệp khách hàng, Người nhận, Chức vụ, Dự án/Hạng mục, Điều kiện thanh toán & Tiến độ triển khai.
   - **Bảng Hạng Mục Hàng Hóa / Dịch Vụ:** Cột `STT` (căn giữa), `Hạng mục & Mô tả kỹ thuật chi tiết` (căn trái, phân cấp rõ tên hạng mục đậm & mô tả phụ), `ĐVT` (căn giữa), `SL` (căn phải), `Đơn giá` (căn phải, `tabular-nums`), `Thành tiền` (căn phải, đậm, `tabular-nums`).
   - **Khối Tổng Hợp Tài Chính (`break-inside: avoid`):** `Cộng thành tiền trước thuế` $\rightarrow$ `Chiết khấu thương mại (nếu có)` $\rightarrow$ `Thuế GTGT (VAT 8% / 10%)` $\rightarrow$ **`TỔNG THANH TOÁN`** (kèm dòng *Số tiền viết bằng chữ* chuẩn xác).
   - **Khối Điều Khoản, Mã QR Thanh Toán (tùy chọn) & Chữ Ký Xác Nhận 2 Bên:** Luôn khóa `break-inside: avoid` để khối chữ ký không bao giờ bị rơi lẻ loi sang trang mới.
2. **Kiểm Toán Số Học Tuyệt Đối:** Bắt buộc dùng Python tính và kiểm chứng tổng từng dòng và tổng cuối cùng khớp 100% trước khi render ra PDF.

---

## 3. Quy Chuẩn Dàn Trang Tạp Chí, Catalogue & Sách (`Editorial & Magazine Multi-Column DTP`)

1. **Hệ Thống Lưới Biên Tập (`Swiss / Broadsheet Modular Grid`):**
   - Trang bìa (`Cover Spread`): Tiêu đề tạp chí cỡ lớn (`Masthead`), Ảnh chủ đạo toàn trang (`Full-Bleed Visual` `@page :first { margin: 0; }`), 2–3 cụm tiêu đề điểm nhấn (`Cover Lines`) phân cấp tương phản cao.
   - Trang ruột (`Interior Spreads`): Lưới **2 cột hoặc 3 cột** (`column-count: 2; column-gap: 8mm;` hoặc CSS Grid `12 cột`), lề trong rộng hơn lề ngoài nếu đóng gáy sách (`@page :left` / `@page :right`).
2. **Nghệ Thuật Chữ Biên Tập Tiếng Việt (`Vietnamese Editorial Typography`):**
   - Kết hợp **1 Font Serif sang trọng cho Tiêu đề / Trích dẫn** (`Playfair Display`, `Cormorant Garamond`, `Newsreader`, `Noto Serif`) với **1 Font Sans-serif hiện đại sạch sẽ cho Nội dung / Chú thích** (`Be Vietnam Pro`, `Plus Jakarta Sans`, `Inter`).
   - Sử dụng **Drop Cap** (chữ cái đầu bài cao 3 dòng), **Pull Quote** (câu trích dẫn lớn phá lưới tinh tế), **Caption** ảnh cỡ `8.5pt–9.5pt`, và **Running Header / Page Folio** (số trang + tên chuyên mục ở đầu/chân trang).
3. **Chọn Động Cơ Dàn Trang Phù Hợp:**
   - **Ấn phẩm 1–20 trang đồ họa cao (Báo giá, Brochure, Lookbook, Tạp chí thị giác):** Dùng HTML5 + Paged CSS `@page` kết xuất qua [`scripts/editorial_pdf_renderer.py`](../scripts/editorial_pdf_renderer.py) (Chromium Headless PDF vector 100%).
   - **Tài liệu / Sách / Báo cáo kỹ thuật dài 20–300 trang có mục lục tự động, công thức toán, tham chiếu chéo:** Dùng module [`skills/04_magazine-editorial-typst/typst-typesetting/SKILL.md`](../skills/04_magazine-editorial-typst/typst-typesetting/SKILL.md).

---

## 4. Quy Chuẩn Thiết Kế Ảnh & Banner Quảng Cáo Đa Kênh (`Multi-Format Ad & Social Banners`)

| Kênh / Hạng Mục | Kích Thước Chuẩn (`px`) | Tỷ Lệ | Quy Tắc Bố Cục & Vùng An Toàn (`Safe-Zone`) |
| :--- | :---: | :---: | :--- |
| **Facebook / Meta Feed Square** | `1080 x 1080` | `1:1` | Chữ `< 20%` diện tích, tiêu đề gọn `<= 7` từ, sản phẩm/điểm nhấn chiếm `60%` khung. |
| **Facebook / TikTok / Reels Story** | `1080 x 1920` | `9:16` | Chừa trống `250px` đỉnh và `380px` đáy để không bị giao diện App che chữ/CTA. |
| **Facebook Fanpage Cover** | `1640 x 624` (`2x`) | `~2.63:1` | Đặt trọn Logo + thông điệp chính trong vùng trung tâm `1100 x 520` để không bị cắt trên Mobile. |
| **YouTube Thumbnail / Web Hero** | `1920 x 1080` | `16:9` | Tương phản cực mạnh, tối đa 3–5 từ khóa lớn đọc rõ ở kích thước thu nhỏ `320px`. |
| **LinkedIn Cover / Google Leaderboard** | `1584 x 396` / `728 x 90` | `4:1` / `8:1` | Bố cục ngang 3 nhịp: `[Logo/Thương hiệu] -> [Giá trị cốt lõi] -> [Nút CTA nổi bật]`. |
