# 03. Kiểm Toán Website Doanh Nghiệp B2B/B2C, Kiến Trúc Điều Hướng, Core Web Vitals & WCAG 2.2 (`corporate`)

> Chưng cất từ `addyosmani/web-quality-skills` (`web-quality-audit`, `core-web-vitals`, `accessibility`, `best-practices`), `coreyhaines31/marketingskills` (`skills/site-architecture`), và `garrytan/gstack` (`Trunk Test` & `Read/Persuade Rules`). Áp dụng cho **Website Tập Đoàn / Công Ty B2B & B2C, Trang Dịch Vụ / Giải Pháp, Hồ Sơ Năng Lực Online, Cổng Tin Tức & Tài Liệu Kỹ Thuật**.

---

## 1. Bài Kiểm Tra "Thả Rơi Giữa Trang" Của Steve Krug (`The 6-Point Trunk Test`)

Bốc ngẫu nhiên bất kỳ một trang con cấp 2–3 nào của Website doanh nghiệp (không phải trang chủ), người dùng mới vào từ Google phải trả lời được ngay **6 câu hỏi sau trong 3 giây**:
1. **Đây là website của doanh nghiệp nào?** (Logo thương hiệu rõ nét góc trên trái, bấm về `/`).
2. **Tôi đang đứng ở trang nào?** (Tiêu đề `<h1>` rõ ràng, khớp với trang hiện tại).
3. **Các chuyên mục lớn nhất của công ty là gì?** (Thanh điều hướng chính `Header Nav`).
4. **Tôi có những lựa chọn đi tiếp nào tại trang này?** (Liên kết nội bộ / CTA chuyển bước rõ ràng).
5. **Vị trí hiện tại của tôi trong cây thư mục ở đâu?** (Thanh `Breadcrumbs` khớp cấu trúc URL, ví dụ: `Trang chủ > Giải pháp ERP > Sản xuất gỗ`).
6. **Làm sao để tôi tìm kiếm nhanh?** (Ô tìm kiếm hoặc nút kính lúp dễ thấy nếu web có `> 20` trang/sản phẩm).

- **Chấm điểm:** Đạt `6/6 = PASS` | `4–5/6 = PARTIAL (P2)` | `<= 3/6 = FAIL (Lỗi P1 bất kể giao diện đẹp đến đâu)`.

---

## 2. Kiểm Toán Kiến Trúc Thông Tin & Điều Hướng Doanh Nghiệp (`Information Architecture & Navigation`)

| Hạng Mục Kiểm Toán | Chuẩn Thực Chiến (`site-architecture`) | Lỗi Thường Gặp Trên Web Doanh Nghiệp (`P1 / P2`) |
| :--- | :--- | :--- |
| **Độ sâu luồng click (`3-Click Rule`)** | Mọi trang dịch vụ, sản phẩm chủ lực, bảng giá, liên hệ phải tới được trong **`<= 3` cú click** từ Trang chủ. | Giấu sản phẩm/báo giá sâu 4–5 tầng menu cha-con hoặc bắt tải file PDF nặng 40MB mới xem được danh mục. |
| **Số mục trên Thanh Menu Chính (`Header Nav`)** | Tối đa **`4 – 7` mục cấp 1** + **1 nút CTA nổi bật nằm ngoài cùng bên phải** (ví dụ: *"Nhận Tư Vấn"*, *"Yêu Cầu Demo"*). Mega-menu tối đa `3–4` cột. | Nhồi 9–12 mục lên thanh menu ngang làm rớt dòng thành 2 hàng xấu xí trên laptop 13–14 inch và gây tê liệt quyết định (*Decision Paralysis*). |
| **Cấu trúc Đường dẫn (`URL Hygiene`)** | Chữ thường 100%, nối bằng dấu gạch ngang `-` (`/giai-phap/quan-tri-san-xuat`), phản ánh đúng phân cấp Breadcrumb, không nhét ngày tháng vào URL bài viết chuyên môn. | URL chứa ID vô nghĩa (`/page.php?id=142`), trộn chữ HOA/thường, dùng dấu gạch dưới `_`, hoặc đổi URL cũ mà không có `301 Redirect`. |
| **Cấu trúc Chân trang (`4-Column Footer`)** | Gom nhóm rõ 4 cột: **Sản phẩm/Giải pháp**, **Tài nguyên/Case Study**, **Về Công ty** (Giới thiệu, Tuyển dụng, Liên hệ), **Pháp lý & Chính sách** (Bảo mật, Điều khoản, MST, Địa chỉ thật). | Footer trống trơn chỉ có dòng Copyright hoặc nhồi 50 link SEO rác không phân nhóm. |

---

## 3. Kiểm Toán Tín Hiệu Uy Tín Doanh Nghiệp (`B2B/B2C Corporate Trust & E-E-A-T Gate`)

Website doanh nghiệp thất bại nặng nhất khi nhìn giống một **template AI vô danh** không ai dám ký hợp đồng hàng chục/trăm triệu:
- **Bắt buộc hiện diện minh bạch (`Trust Must-Haves`):**
  1. Tên pháp nhân đầy đủ, Mã số thuế, Địa chỉ trụ sở/nhà máy thật (không dùng địa chỉ ảo chung chung), Hotline/Email tên miền riêng (`contact@tencongty.vn` thay vì `@gmail.com` cho B2B lớn).
  2. Hồ sơ năng lực thực chứng: Hình ảnh thật của đội ngũ/nhà xưởng/giao diện phần mềm thật (thay vì ảnh stock người Tây bắt tay cười giả tạo).
  3. Case Study có cấu trúc thật: *Khách hàng ngành nào $\rightarrow$ Bài toán trước khi làm $\rightarrow$ Giải pháp triển khai $\rightarrow$ Kết quả đo được*.
  4. Chính sách bảo hành, SLA hỗ trợ kỹ thuật, bảo mật dữ liệu và chứng nhận tiêu chuẩn ngành (ISO, đối tác hãng...) đặt đúng chỗ khách ra quyết định.
- **Lọc bỏ "Văn phong tự sướng" (`Happy Talk Audit` — `gstack` Rule 8):**
  - Đo tỷ lệ câu chữ sáo rỗng tự khen ở đầu trang (*"Chào mừng quý khách đến với công ty hàng đầu..."*, *"Giải pháp toàn diện tiên phong thời đại số..."* mà không nói rõ bán cái gì cho ai). Đề xuất cắt bỏ tối thiểu `30%` câu sáo rỗng để đẩy năng lực cốt lõi lên ngay màn hình đầu.

---

## 4. Kiểm Toán Chất Lượng Kỹ Thuật Chuẩn Google Chrome (`Core Web Vitals, WCAG 2.2 & Best Practices`)

### 4.1. 3 Chỉ Số Sống Còn Core Web Vitals (`web-quality-skills`)
1. **`LCP` *(Largest Contentful Paint)* `< 2.5s` (Tối ưu `< 1.8s` cho trang thông tin):**
   - Ảnh Hero đầu trang **cấm** gắn `loading="lazy"` (làm chậm LCP!); bắt buộc dùng `fetchpriority="high"`, định dạng `WebP/AVIF`, và khai báo sẵn `width` + `height`.
   - Font chữ tiếng Việt phải có `font-display: swap` và `<link rel="preconnect">` tới CDN font.
2. **`INP` *(Interaction to Next Paint)* `< 200ms`:**
   - Tránh nhồi 5–7 script tracking/chat bên thứ ba chạy đồng bộ chặn luồng chính (`Main thread blocking`); dùng `defer` hoặc nạp trễ sau tương tác đầu tiên.
3. **`CLS` *(Cumulative Layout Shift)* `< 0.1`:**
   - Mọi thẻ `<img>`, `<video>`, `<iframe>`, khung bản đồ và banner quảng cáo bắt buộc có `width`/`height` hoặc `aspect-ratio` cố định để trang không bị giật nhảy khi đang đọc.

### 4.2. Chuẩn Tiếp Cận & Trợ Năng WCAG 2.2 Mức AA (`Accessibility Floor`)
- Thẻ `<html lang="vi">` (hoặc ngôn ngữ tương ứng) khai báo đúng ở gốc tài liệu.
- Độ tương phản chữ/nền đạt **`>= 4.5:1`** cho chữ thường và **`>= 3:1`** cho chữ lớn (`>= 18pt` hoặc `14pt bold`) và viền ô nhập/thành phần UI.
- Phân cấp tiêu đề mạch lạc `<h1>` (1 tiêu đề chính mô tả đúng trang) $\rightarrow$ `<h2>` $\rightarrow$ `<h3>` (không nhảy cóc `<h1>` xuống thẳng `<h4>` chỉ để chỉnh cỡ chữ).
- Mọi ảnh nội dung có `alt` mô tả đúng ý nghĩa; ảnh trang trí thuần túy để `alt=""`.
- Liên kết văn bản phải tự mô tả đích đến (*"Xem bảng giá gói Doanh nghiệp"* thay vì viết cộc lốc *"Xem tại đây"* / *"Click here"*).
- Đủ vùng ngữ nghĩa HTML5 (`<header>`, `<nav>`, `<main>`, `<footer>`) và tôn trọng `@media (prefers-reduced-motion: reduce)`.
