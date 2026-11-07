# CẨM NANG KIẾN TRÚC & ĐẠI TỪ ĐIỂN QA CHECKLIST TOÀN DIỆN: WEBSITE B2B / THƯƠNG MẠI – DỊCH VỤ TRƯNG BÀY SẢN PHẨM (CATALOG SHOWCASE KHÔNG GIỎ HÀNG) + WEB CRM + CHATBOT 3 TẦNG

> **Phạm vi áp dụng (Reusable Skill Blueprint):**
> Tài liệu này đúc kết toàn bộ kiến trúc kỹ thuật, logic nghiệp vụ, công thái học UI/UX đa thiết bị, tối ưu tốc độ OpenLiteSpeed/WP Rocket, SEO/GEO và bộ **120+ Tiêu chí Kiểm toán Chất lượng (QA Checklist)** từ thực tiễn triển khai các dự án **Website Thương mại – Dịch vụ – Sản xuất Công nghiệp – Showroom B2B** (điển hình: *Tường Lộc Solar V2.6*, *Golf Việt V2.5*).
>
> **Đặc trưng cốt lõi của mô hình:**
> - **CÓ hệ thống danh mục và trang sản phẩm chi tiết** (ảnh đa góc, bảng thông số kỹ thuật, bộ lọc thông số đa chiều, tìm kiếm mã hàng tức thì, tab phân nhóm AJAX) giống hệt một trang thương mại điện tử chuyên nghiệp.
> - **KHÔNG bán hàng/thanh toán trực tiếp trên web** (loại bỏ hoàn toàn Giỏ hàng `/cart/`, Thanh toán `/checkout/`, nút *Thêm vào giỏ*, nhãn giá `0 ₫` hoặc chữ `Liên hệ` lặp vô nghĩa).
> - **Chuyển đổi 100% lưu lượng truy cập thành Lead chất lượng cao** thông qua: **Popup Báo giá nhanh `0ms` (`Quick-Quote`)**, **Zalo/Hotline Báo giá sỉ theo ngữ cảnh**, **Chatbot Kỹ thuật 3 Tầng (tính định mức BOM + tra kho thực tế)** và **Hệ thống Web CRM Realtime & Chống Click Tặc Google Ads 4 Tầng**.

---

## PHẦN 1: SƠ ĐỒ KIẾN TRÚC TỔNG THỂ 6 LỚP (THE 6-LAYER SHOWCASE ARCHITECTURE)

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ LỚP 1: TRẢI NGHIỆM TRƯNG BÀY & TÌM KIẾM VẬT TƯ / SẢN PHẨM (STOREFRONT & DISCOVERY)       │
│ • Hero B2B + Tìm nhanh 10 giây (Quick Part Finder) + Bento Danh mục + Sub-Tab AJAX 0ms   │
│ • Tìm kiếm chính xác theo Trọng số (Precision Search) + Gợi ý JSON Tĩnh 0ms (< 25 KB)    │
│ • Bộ lọc Thông số Đa chiều Tự động (Faceted Filter) + Chống điểm chết (Cross-Cat Fallback)│
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ LỚP 2: CÔNG THÁI HỌC UI/UX ĐA THIẾT BỊ (DESKTOP 1440/1280 & MOBILE 390/360)              │
│ • Thẻ sản phẩm đồng nhất chiều cao + Hover đổi ảnh thứ 2 + Nút [Thông số & Báo giá] 100% │
│ • Mobile: 0px tràn ngang, Input >= 16px chống iOS Auto-Zoom, PDP 1 hàng pill + Đáy động │
│ • Đóng chéo tầng phủ (Overlay Mutual Exclusion) + Khóa cuộn nền + Ẩn Nudge ở trang con   │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ LỚP 3: PHỄU CHUYỂN ĐỔI BÁO GIÁ & THU LEAD ĐA KÊNH (ZERO-FRICTION LEAD CAPTURE)          │
│ • Popup/Bottom-Sheet Báo giá nhanh 0ms (Nạp sẵn dữ liệu JSON trong DOM, không chờ AJAX) │
│ • Trang Liên hệ Kho xưởng B2B (/lien-he/) chống lỗi mail() giả + Trang Cảm ơn (/cam-on/) │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ LỚP 4: TRỢ LÝ AI CHATBOT 3 TẦNG & WEB CRM REALTIME CHỐNG CLICK TẶC (/crm/)               │
│ • Tầng 1: Tính định mức/cấu hình tự động (0ms) | Tầng 2: Tra kho DB thật | Tầng 3: LLM   │
│ • Ghi kép (Dual-Write): Lưu đồng thời vào WP Admin & Bảng `leads` CRM + Báo Telegram     │
│ • Chống Click Tặc Google Ads 4 tầng (IP/Fingerprint/Tần suất/Hành vi) không chặn bfcache │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ LỚP 5: HIỆU NĂNG CỰC ĐẠI, OPENLITESPEED, TADU WAF & MOBILE INSTANT-NAV (< 100ms TTFB)    │
│ • Cắt bỏ ~600 KB CSS/JS thừa + Chuyển đổi WebP cô lập Zero-Touch + Preload duy nhất LCP  │
│ • Khóa .html_gzip trên OpenLiteSpeed (Chống lỗi trình duyệt tự tải file Download)        │
│ • Pre-warm 100% Sitemap URL + Speculation Rules + iOS touchstart Prefetch + Mở bfcache   │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ LỚP 6: SEO KỸ THUẬT, JSON-LD ĐA THỰC THỂ, AI SEARCH (/llms.txt) & STAGING CÔ LẬP        │
│ • Chuẩn hóa Unicode NFC 100% + JSON-LD 5 thực thể (Organization, Product, Offer, Specs)  │
│ • Endpoint /llms.txt cho AI Search + Khóa noindex tuyệt đối trên /staging/               │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## PHẦN 2: ĐẠI TỪ ĐIỂN QA CHECKLIST 8 TRỤ CỘT (120+ TIÊU CHÍ BẮT BUỘC KIỂM TOÁN)

### TRỤ CỘT 1: LOGIC MÔ HÌNH "SHOWCASE KHÔNG GIỎ HÀNG" (CATALOG-ONLY CONVERSION LOGIC)

| Mã QA | Hạng Mục Kiểm Toán | Lỗi Thường Gặp Khi Dùng Theme Bán Lẻ Mặc Định | Tiêu Chuẩn Bắt Buộc Đạt (`PASS`) |
| :---: | :--- | :--- | :--- |
| **QA-C01** | **Triệt tiêu luồng Giỏ hàng & Thanh toán lẻ** | Còn sót icon giỏ hàng trên Header, link `/cart/`, `/checkout/`, hoặc nút *Add to cart*. | Ẩn và vô hiệu hóa 100% icon giỏ hàng, mini-cart, trang `/cart/`, `/checkout/`; chuyển hướng mọi truy cập `/cart/` về `/shop/` hoặc `/lien-he/`. |
| **QA-C02** | **Xử lý nhãn Giá sản phẩm (`Price Label`)** | Sản phẩm không nhập giá bị hiện `0 ₫`, trống trơn, hoặc hiện chữ `Liên hệ` lặp 2 lần (cả ở vị trí giá lẫn nút bấm). | Nếu sản phẩm không có giá niêm yết cố định, hiển thị huy hiệu trạng thái **`Sẵn kho • Báo giá sỉ theo SL`** và dùng 1 nút hành động duy nhất **`[Thông số & Báo giá]`**. |
| **QA-C03** | **Phủ 100% nút `[Thông số & Báo giá]` trên mọi danh sách** | Có nút trên Trang chủ nhưng khi sang `/shop/`, trang Chuyên mục hoặc trang Kết quả tìm kiếm thì mất nút. | Hook vào `woocommerce_after_shop_loop_item` để **100% thẻ sản phẩm** ở mọi trang đều có nút `[Thông số & Báo giá]` kèm dữ liệu JSON nhúng sẵn. |
| **QA-C04** | **Popup Báo giá nhanh `0ms` (`Zero-AJAX Quick-Quote`)** | Bấm nút báo giá phải chờ xoay vòng `admin-ajax.php` `800ms – 2,000ms` mới mở popup. | Nhúng sẵn thuộc tính `data-tls-product="{...}"` (tên, mã SKU, ảnh WebP, thông số, link) ngay trên thẻ HTML để bấm mở Popup/Bottom-Sheet trong **`< 1ms` (`0` request mạng)**. |
| **QA-C05** | **Hành động chuyển đổi trên trang Chi tiết SP (PDP)** | Trang chi tiết sản phẩm trống trải sau khi ẩn nút *Mua hàng*. | Hiển thị cụm **Hộp Chốt Báo Giá B2B**: nút chính **`[Nhận Báo Giá Sỉ / Dự Án Ngay]`** (mở form kèm sẵn tên mã SP), nút phụ **`[Chat Zalo Kỹ Thuật]`** và bảng cam kết chất lượng/chứng chỉ (`CO/CQ`). |
| **QA-C06** | **Trợ lý Tìm nhanh Sản phẩm 10 Giây (`Quick Part Finder`)** | Khách kỹ thuật/nhà thầu vào trang chủ không biết chọn nhóm vật tư nào phù hợp với công trình. | Đặt thanh chọn nhanh 3 bước ngay dưới Hero (*Loại công trình/mái* $\rightarrow$ *Nhóm vật tư/dịch vụ* $\rightarrow$ *Chất liệu/Quy cách* $\rightarrow$ Nút *Tìm vật tư phù hợp*). |

---

### TRỤ CỘT 2: LOGIC TÌM KIẾM CHÍNH XÁC, BỘ LỌC ĐA CHIỀU & CỤM TAB AJAX

| Mã QA | Hạng Mục Kiểm Toán | Lỗi Thường Gặp (Điểm Mù Logic) | Tiêu Chuẩn Bắt Buộc Đạt (`PASS`) |
| :---: | :--- | :--- | :--- |
| **QA-S01** | **Chống nhiễu kết quả tìm kiếm WordPress (`Precision Search`)** | Tìm từ khóa ngắn như `"Thanh"` (`?post_type=product&s=Thanh`), WordPress chạy `post_content LIKE '%Thanh%'` làm khớp nhầm chữ *"giá **thành**"*, *"hoàn **thành**"* trong bài viết của 33 sản phẩm không liên quan! | Viết bộ lọc `posts_search` chấm điểm **3 tầng trọng số**:<br>• **Tầng 1 (`100–120đ`):** Khớp từ nguyên vẹn (`(^\|[\s\-_\/\(])từ_khóa`) trong **Tiêu đề (`post_title`)** hoặc **SKU**.<br>• **Tầng 2 (`50–70đ`):** Khớp chuỗi con trong Tiêu đề hoặc Danh mục.<br>• **Tầng 3 (`15đ`):** Chỉ tìm trong mô tả khi Tầng 1 & Tầng 2 không có kết quả nào! |
| **QA-S02** | **Chuẩn hóa từ khóa Tiếng Việt không dấu & Dấu nhân kích thước** | Khách gõ `"kep bien"` không ra `"Kẹp biên"`, hoặc gõ `"30x60"` không ra sản phẩm ghi `"30×60mm"`. | Chuẩn hóa đồng thời cả câu truy vấn và chỉ mục: bỏ dấu tiếng Việt (`kep bien` $\leftrightarrow$ `kẹp biên`), đồng nhất dấu nhân (`×`, `*`, `X` $\rightarrow$ `x`), tách số dính đơn vị (`40x40mm` $\rightarrow$ `40x40 mm`). |
| **QA-S03** | **Gợi ý Tìm kiếm Trực tiếp `0ms` bằng JSON Tĩnh (`Live Autocomplete`)** | Gõ tìm kiếm không có gợi ý, hoặc mỗi ký tự gõ lại gọi `admin-ajax.php` gây chậm máy chủ. | Sinh tự động tệp tĩnh `/wp-content/uploads/<prefix>-search-index.json` (`< 25 KB`); khi người dùng chạm vào ô tìm kiếm mới tải tệp JSON 1 lần duy nhất và lọc trực tiếp trên RAM (`0ms`), hiển thị ngay ảnh WebP + Tên + Thông số + Nút *"Xem toàn bộ kết quả"*. |
| **QA-S04** | **Trích xuất Thông số Tự động & Đếm số lượng thực (`Facet Count`)** | Phải nhập tay từng thuộc tính WooCommerce cho hàng trăm sản phẩm, hoặc bộ lọc hiện các lựa chọn có `0` sản phẩm. | Xây dựng lớp `Spec_Extractor` tự động bóc tách *Chất liệu*, *Kích thước*, *Ứng dụng*, *Chứng chỉ* từ Tiêu đề/Mô tả chuẩn NFC; ẩn các lựa chọn có `count == 0` trong ngữ cảnh hiện tại. |
| **QA-S05** | **Chống điểm chết khi lọc chéo chuyên mục (`Zero-Dead-End Fallback`)** | Khách đang ở chuyên mục *Máng cáp* bấm lọc *Nhôm AL6005-T5* (vốn nằm ở chuyên mục *Giá đỡ*) $\rightarrow$ Web báo *"Không tìm thấy sản phẩm nào"* khiến khách thoát trang. | Khi bộ lọc trong chuyên mục hiện tại trả về `0` sản phẩm, tự động truy vấn **Kho Tổng toàn website** với cùng điều kiện lọc, hiển thị thông báo rõ ràng + nút *"[Đặt lại bộ lọc]"* và liệt kê ngay các sản phẩm khớp từ Kho Tổng! |
| **QA-S06** | **Logic Cụm Sub-Tab Danh mục AJAX & Nút `↗` Mở Chuyên mục** | Các tab con trên trang chủ không hiện số lượng sản phẩm, chuyển tab phải tải lại trang, hoặc không có lối vào trang chuyên mục đầy đủ. | • Hiển thị số lượng thật trên từng tab (`Thanh Rail (3)`).<br>• Bấm lần 1 vào tab: chuyển lưới sản phẩm tức thì (`0ms` qua bộ nhớ đệm `tabMemCache`).<br>• Bấm vào biểu tượng `↗` hoặc bấm chủ đích lần thứ 2 vào tab đang mở (sau `450ms`): điều hướng sang trang chuyên mục đầy đủ. |

---

### TRỤ CỘT 3: THIẾT KẾ THỊ GIÁC, TYPOGRAPHY NFC & CHUẨN THƯƠNG HIỆU B2B

| Mã QA | Hạng Mục Kiểm Toán | Lỗi Thường Gặp | Tiêu Chuẩn Bắt Buộc Đạt (`PASS`) |
| :---: | :--- | :--- | :--- |
| **QA-D01** | **Chuẩn hóa Tiếng Việt Unicode Dựng Sẵn (`NFC 100%`)** | Dữ liệu copy từ macOS/PDF bị lưu dạng Tổ hợp (`NFD`) làm dấu tiếng Việt bị lệch, nhảy dòng hoặc tìm kiếm không khớp. | Quét và chuyển đổi 100% `post_title`, `post_excerpt`, `post_content`, `terms.name` sang chuẩn **Unicode NFC (`Normalizer::FORM_C`)** cả trong Database lẫn khi xuất HTML. |
| **QA-D02** | **Độ tương phản màu sắc chuẩn `WCAG 2.1 AA`** | Chữ xám nhạt trên nền trắng hoặc chữ trắng trên nền cam/vàng nhạt không đọc được ngoài nắng công trường. | Độ tương phản chữ thường đạt tối thiểu **`>= 4.5:1`**, chữ tiêu đề lớn **`>= 3.0:1`**. Tuyệt đối không dùng chữ `#94a3b8` trên nền trắng cho thông tin quan trọng; dùng `#334155` hoặc `#0f172a`. |
| **QA-D03** | **Đồng nhất chiều cao Thẻ Sản Phẩm (`Equal-Height Product Card`)** | Ảnh sản phẩm chiếc vuông chiếc dọc, tiêu đề 1 dòng xen lẫn 3 dòng làm các nút bấm dưới chân thẻ nhấp nhô lệch hàng. | • Khung ảnh khóa `aspect-ratio: 1 / 1` + `object-fit: contain` trên nền sáng sạch.<br>• Tiêu đề khóa `line-clamp: 2` (`min-height: 2.8em`).<br>• Hộp thông số tóm tắt cố định chiều cao.<br>• Chân thẻ dùng `margin-top: auto` để 100% nút `[Thông số & Báo giá]` thẳng tắp trên cùng một đường ngang. |
| **QA-D04** | **Hiệu ứng Hover Ảnh thứ 2 trên Máy tính (`Secondary Gallery Hover`)** | Rê chuột vào thẻ sản phẩm chỉ phóng to ảnh cũ, không xem được góc chụp thực tế thứ 2. | Khi sản phẩm có ảnh thư viện thứ 2, tự động xuất thẻ `<img class="show-on-hover back-image" loading="lazy">` để khi rê chuột trên Desktop chuyển mượt sang góc chụp thứ 2. |
| **QA-D05** | **Làm sạch 100% nội dung mẫu tiếng Anh & *Lorem ipsum*** | Trang `/lien-he/`, Footer hoặc chuyên mục Tin tức còn sót chữ *"Mon to Fri"*, *"Sample Page"*, *"Lorem ipsum dolor sit amet"*. | Chuyển nháp (`draft`) toàn bộ bài/trang mẫu rác; thiết kế trang `/lien-he/` và chuyên mục Tin tức bằng 100% tiếng Việt chuẩn nghiệp vụ ngành. |

---

### TRỤ CỘT 4: CÔNG THÁI HỌC UI/UX TRÊN MÁY TÍNH & ĐIỆN THOẠI (`DESKTOP` vs `MOBILE`)

| Mã QA | Hạng Mục Kiểm Toán | Lỗi Thường Gặp Trên Thực Tế | Tiêu Chuẩn Bắt Buộc Đạt (`PASS`) |
| :---: | :--- | :--- | :--- |
| **QA-U01** | **Chống tràn ngang tuyệt đối trên Di động (`OverflowX = 0`)** | Trên màn hình `360px` / `390px`, trang bị trượt ngang sang phải tạo khoảng trắng dọc mép phải (thường do nút *"Xem tất cả..."* đặt `white-space: nowrap` hoặc bảng rộng). | Đo tự động bằng trình duyệt trên `390x844` và `360x800`: `document.documentElement.scrollWidth <= document.documentElement.clientWidth` (**`0` phần tử tràn ngang**). |
| **QA-U02** | **Chống iPhone Safari Auto-Zoom khi chạm ô nhập (`Input >= 16px`)** | Ô tìm kiếm, ô lọc hoặc ô nhập SĐT trên mobile có `font-size: 13px – 14px` khiến iOS Safari tự động phóng to giật khung hình khi bấm vào. | Đặt quy tắc CSS toàn cục trên `@media (max-width: 849px)`: mọi thẻ `input`, `select`, `textarea` bắt buộc có **`font-size: 16px !important`**. |
| **QA-U03** | **Khóa hàng ngang cho Ô Tìm Kiếm trên Thanh Menu Desktop (`#wide-nav`)** | Theme gốc hoặc plugin làm `<form class="searchform">` bị rớt nút kính lúp xuống dưới ô input (`flex-direction: column`). | Ép `display: flex !important; flex-direction: row !important; flex-wrap: nowrap !important; align-items: center !important` cho `.searchform` (`inpLeft < btnLeft`). |
| **QA-U04** | **Thu gọn dải Chuyên mục đầu trang Chi tiết SP (PDP) trên Mobile** | Danh sách 8–10 viên thuốc chuyên mục ở đầu trang PDP rớt thành 4 dòng (`110px`), đẩy ảnh sản phẩm chính tụt xuống dưới màn hình điện thoại. | Trên `@media (max-width: 849px)`, chuyển `.tls-pdp-cat-strip` sang **`flex-wrap: nowrap; overflow-x: auto`** (1 hàng vuốt ngang cao đúng **`38px`**). |
| **QA-U05** | **Thanh Đáy Di Động Thông Minh Theo Ngữ Cảnh (`Context-Aware Sticky Bar`)** | Khi khách đã vào trang Chi tiết sản phẩm (PDP), thanh đáy điện thoại vẫn hiện nút `[Danh mục]` chung chung thay vì nút chốt báo giá. | Khi phát hiện trang PDP (`body.single-product`), tự động đổi nút đầu tiên trên thanh đáy di động thành **`[Báo giá nhanh]`** (màu cam nổi bật, bấm vào mở ngay Popup báo giá của đúng sản phẩm đang xem). |
| **QA-U06** | **Quản lý Tầng phủ Độc quyền & Chống che khuất góc phải dưới** | • Bong bóng nhắc chữ của Chatbot luôn hiện đè lên thẻ sản phẩm và form liên hệ ở trang con.<br>• Mở chồng chéo cả cửa sổ Chatbot + Popup Báo giá + Ngăn lọc. | • **Chỉ hiện bong bóng nhắc chữ (`.tls-chat-nudge`) ở Trang chủ**, ẩn mặc định trên mọi trang con.<br>• Áp dụng **Đóng chéo tầng phủ (`Overlay Mutual Exclusion`)** + Khóa cuộn nền `html.tls-overlay-lock` + Giới hạn chiều cao Popup di động `max-height: 88dvh`. |

---

### TRỤ CỘT 5: TỐC ĐỘ, CORE WEB VITALS, OPENLITESPEED & TADU WAF (`< 100ms` TTFB)

| Mã QA | Hạng Mục Kiểm Toán | Rủi Ro Hệ Thống / Điểm Nghẽn Tốc Độ | Tiêu Chuẩn Kỹ Thuật Bắt Buộc (`PASS`) |
| :---: | :--- | :--- | :--- |
| **QA-P01** | **Khóa `.html_gzip` trên OpenLiteSpeed & Tadu WAF (Chống lỗi vào web tự tải file Download)** | OpenLiteSpeed bỏ qua `AddType text/html .html_gzip` trong `.htaccess` của Apache. Nếu WP Rocket rewrite vào `index-https.html_gzip`, máy chủ trả về `Content-Type: application/octet-stream` khiến trình duyệt **tự động tải file về máy thay vì hiển thị web**! | **Khóa 3 lớp bắt buộc:**<br>1. `add_filter('rocket_force_gzip_htaccess_rules', '__return_false', 99)` + `strip_ols_incompatible_gzip_rewrite()` + `self_heal_ols_htaccess_gzip_rewrite()` để `.htaccess` luôn trỏ vào `index-https.html` (`Content-Type: text/html`), nhường việc nén `zstd`/`br`/`gzip` cho tầng C++ của OpenLiteSpeed.<br>2. Khóa `write_cache_file()` trong `class-cache.php` không tạo file `_gzip` trên ổ đĩa.<br>3. Bổ sung `Content-Type: text/html; charset=UTF-8` + `Cache-Control: no-cache, must-revalidate, max-age=0` trong `serve_cache_file()` và endpoint tự xóa Disk Cache trình duyệt `?clear_cache=1` (`Clear-Site-Data: "cache"`). |
| **QA-P02** | **Chuyển đổi WebP Cô lập Zero-Touch & Chống tràn CPU lần đầu** | Nén đè vào `/wp-content/uploads/` làm hỏng ảnh gốc, hoặc chuyển đổi hàng trăm ảnh cùng lúc trong 1 HTTP request gây timeout `504`. | Lưu ảnh WebP vào thư mục riêng `/wp-content/<prefix>-webp-cache/` (`max_w = 400px` cho thẻ grid, `800px` cho PDP), giới hạn tối đa `40–45` ảnh/request và chạy kịch bản **Pre-warm 100% Sitemap URL** ngay khi triển khai. |
| **QA-P03** | **Tối ưu LCP, CLS (`<= 0.02`) & Cắt bỏ CSS/JS thừa** | Trình duyệt tải `zxcvbn.min.js` (`400 KB`), `dashicons` (`35 KB`), `wc-cart-fragments`, Font Awesome trùng lặp và thiếu `width`/`height` gây nhảy khung hình. | • Gỡ toàn bộ CSS/JS không dùng theo ngữ cảnh trang.<br>• Tự động bơm `width` & `height` thật cho mọi thẻ `<img>`.<br>• Gắn `fetchpriority="high" loading="eager"` cho duy nhất ảnh LCP đầu trang; toàn bộ ảnh dưới màn hình đầu gắn `loading="lazy" decoding="async"`. |
| **QA-P04** | **Chuyển trang tức thì trên Điện thoại (`Mobile Instant-Nav` & `bfcache`)** | • Flatsome gắn `<html class="loading-site">` làm đơ màn hình trên mobile.<br>• iOS Safari không hỗ trợ Speculation Rules.<br>• Script tracking gắn `beforeunload` làm hỏng `bfcache` khi bấm nút Back. | • Gỡ bỏ class `loading-site` của Flatsome.<br>• Kết hợp **Speculation Rules API** + **`touchstart` Prefetch (`85ms` trước `click`)** + Thanh tiến trình đầu trang `0ms`.<br>• Tuyệt đối **cấm dùng `beforeunload`** (thay bằng `pagehide` + `visibilitychange`) và trì hoãn ping CRM `700ms` sau `load`. |

---

### TRỤ CỘT 6: SEO KỸ THUẬT, JSON-LD ĐA THỰC THỂ & AI SEARCH (`GEO / llms.txt`)

| Mã QA | Hạng Mục Kiểm Toán | Lỗi Thường Gặp | Tiêu Chuẩn Bắt Buộc Đạt (`PASS`) |
| :---: | :--- | :--- | :--- |
| **QA-E01** | **Cấu trúc Heading chuẩn SEO (`Unique H1`)** | Trang chủ không có `<h1>` hoặc trang Danh mục có 2–3 thẻ `<h1>` trùng nhau. | Mỗi trang (Trang chủ, Danh mục, Chi tiết SP, Tin tức, Liên hệ) có **đúng `1` thẻ `<h1>` duy nhất** chứa từ khóa trọng tâm chuẩn NFC. |
| **QA-E02** | **Lược đồ Dữ liệu có cấu trúc JSON-LD `@graph` 5 Thực thể** | Sản phẩm không có giá số bị Google Search Console báo lỗi thiếu `offers` trong Schema `Product`. | Tự động xuất JSON-LD `@graph` gồm: `Organization` / `HardwareStore`, `WebSite` (`SearchAction`), `CollectionPage`, `BreadcrumbList`, và `Product` (gồm `sku`, `brand`, `additionalProperty` thông số kỹ thuật và `Offer` hợp lệ). |
| **QA-E03** | **Chuẩn `/llms.txt` cho Công cụ Tìm kiếm AI (GEO)** | ChatGPT, Gemini, Perplexity không nắm được danh mục mã hàng, năng lực nhà máy và thông số kỹ thuật của doanh nghiệp. | Tạo endpoint động `/llms.txt` (`Content-Type: text/plain; charset=utf-8`) xuất bản tóm tắt Markdown chuẩn về doanh nghiệp, danh mục sản phẩm chủ lực, thông số kỹ thuật và đầu mối liên hệ báo giá. |
| **QA-E04** | **Khóa cách ly SEO tuyệt đối trên môi trường `/staging/`** | Google index nhầm đường dẫn `/staging/` gây trùng lặp nội dung với tên miền chính. | Tự động phát hiện đường dẫn `/staging` để gắn đồng thời: HTTP Header `X-Robots-Tag: noindex, nofollow, noarchive`, thẻ `<meta name="robots" content="noindex, nofollow">` và `blog_public = 0`. |

---

### TRỤ CỘT 7: HỆ THỐNG THU LEAD ĐA KÊNH, WEB CRM REALTIME & CHỐNG CLICK TẶC

| Mã QA | Hạng Mục Kiểm Toán | Lỗi Thường Gặp | Tiêu Chuẩn Bắt Buộc Đạt (`PASS`) |
| :---: | :--- | :--- | :--- |
| **QA-M01** | **Cơ chế Ghi kép (`Dual-Write Lead Capture`)** | Khách gửi form chỉ lưu vào 1 nơi hoặc khi lỗi mail thì mất thông tin khách hàng. | Mọi form (Popup Báo giá nhanh, Chatbot 3 tầng, Contact Form 7) đều phải **Ghi kép**: lưu vào WordPress Admin (`tls_quote_lead`) **VÀ** ghi trực tiếp vào bảng `leads` của hệ thống Web CRM (`/crm/`), đồng thời đẩy thông báo Telegram tức thì. |
| **QA-M02** | **Chống báo lỗi đỏ giả trên Contact Form 7 khi Hosting tắt `mail()`** | Nhiều máy chủ Hosting khóa hàm `mail()` mặc định khiến khách bấm gửi CF7 bị hiện khung báo lỗi màu đỏ dù CRM đã nhận được SĐT. | Hook vào `wpcf7_skip_mail` / `wpcf7_mail_components` để sau khi đã ghi kép thành công vào CRM thì luôn trả về trạng thái `mail_sent` màu xanh và tự động chuyển sang trang `/cam-on/?lead_id=...`. |
| **QA-M03** | **Trang Biên nhận Báo giá Cá nhân hóa (`/cam-on/`)** | Gửi form xong chỉ hiện 1 dòng chữ nhỏ dưới chân form, khách không biết đã gửi thành công hay chưa và bộ phận Ads không đo được Conversion URL. | Chuyển hướng sang `/cam-on/` hiển thị mã yêu cầu, tên khách, danh mục vật tư vừa hỏi, nút gọi trực tiếp / Zalo kỹ thuật phụ trách và kích hoạt sự kiện Conversion cho Google Ads / Meta Pixel. |
| **QA-M04** | **Web CRM Realtime & Chống Click Tặc Google Ads 4 Tầng (`/crm/`)** | Chạy Google Ads bị đối thủ hoặc bot click ảo làm cạn ngân sách nhưng không có công cụ giám sát IP/thiết bị theo thời gian thực. | Tích hợp bảng điều khiển `/crm/` (bảo vệ bằng mật khẩu + mã PIN, loại trừ khỏi bộ nhớ đệm WP Rocket) theo dõi khách đang online, từ khóa Ads, `gclid`, phát hiện IP click lặp vượt ngưỡng và xuất danh sách IP chặn cho Google Ads. |

---

### TRỤ CỘT 8: CHATBOT AI TƯ VẤN KỸ THUẬT & BÁO GIÁ 3 TẦNG (3-TIER HYBRID ADVISOR)

| Mã QA | Hạng Mục Kiểm Toán | Rủi Ro "Ảo Giác AI" | Tiêu Chuẩn Bắt Buộc Đạt (`PASS`) |
| :---: | :--- | :--- | :--- |
| **QA-B01** | **Tầng 1: Bóc tách Định mức / Cấu hình bằng Thuật toán Xác định (`0ms`)** | Để LLM tự tính toán số lượng vật tư theo `kWp` hoặc diện tích dẫn đến tính nhẩm sai. | Dùng công thức kỹ thuật xác định (Deterministic PHP Engine) để tính ngay bảng định mức vật tư tham khảo khi khách nhập công suất/quy mô (VD: `10 kWp`, `50 tấm pin`) kèm ghi chú chuẩn kỹ thuật. |
| **QA-B02** | **Tầng 2: Tra cứu Kho sản phẩm Thực tế trong Database** | Chatbot trả lời tên sản phẩm không có thật trong kho hoặc dẫn link 404. | Truy vấn trực tiếp danh mục sản phẩm đang `publish` trong Database để trả về đúng thẻ sản phẩm có ảnh thật, thông số thật và nút bấm mở trang sản phẩm / báo giá nhanh. |
| **QA-B03** | **Tầng 3: Bắt SĐT 10 số Tự động ngay trong Hộp thoại Chat** | Khách để lại SĐT trong khung chat nhưng nhân viên kinh doanh không nhận được thông báo. | Tự động nhận diện chuỗi SĐT hợp lệ của Việt Nam (`03x, 05x, 07x, 08x, 09x` — 10 số) ngay trong tin nhắn chat, lập tức ghi kép vào Web CRM và báo Telegram kèm toàn bộ lịch sử ngữ cảnh cuộc trò chuyện. |

---

## PHẦN 3: QUY TRÌNH TRIỂN KHAI AN TOÀN 4 BƯỚC & NGHIỆM THU TỰ ĐỘNG (`ZERO-TOUCH PRODUCTION`)

1. **Bước 1 — Khởi dựng trên Máy Local (`localhost:8090`):**
   - Nhân bản mã nguồn và Database về môi trường độc lập, phát triển Child Theme + Plugin CRM/Chatbot, kiểm tra cú pháp `php -l` và `node --check` đạt `Exit code 0`.
2. **Bước 2 — Triển khai lên Staging Cô lập trên cùng Máy chủ Hosting (`domain.com/staging/`):**
   - Tạo Database riêng (`<user>_staging`), dùng Symlink chỉ đọc cho thư mục ảnh năm cũ (`/wp-content/uploads/2024..2026`) để tiết kiệm 90% dung lượng đĩa và giữ thư mục gốc `public_html/` **an toàn tuyệt đối 100% (`Zero-Touch`)**.
   - Khóa `.html_gzip` trong `.htaccess` + Pre-warm 100% URL Sitemap để nạp sẵn WebP và bộ nhớ đệm tĩnh `.html`.
3. **Bước 3 — Chạy Kịch bản Kiểm toán Tự động (`28+ CDP Assertions` + `30 HTTP Encoding Matrix`):**
   - Kiểm tra tự động trên 4 kích thước màn hình (`Desktop 1440`, `Laptop 1280`, `iPhone 390`, `Android 360`):
     - `HTTP 200` & `Content-Type: text/html; charset=UTF-8` trên cả 3 chuẩn nén `zstd`, `br`, `gzip` (`0` lỗi `application/octet-stream`).
     - `OverflowX = 0`, `Inputs < 16px = 0`, `Broken Images = 0`, `Console Errors = 0`, `Unique H1 = 1`.
     - Tìm kiếm chính xác `100%`, Bộ lọc không điểm chết, Popup Báo giá `0ms`, Ghi kép CRM thành công.
4. **Bước 4 — Xuất Hồ sơ PDF Đề xuất A4 (9 Trang) & Chuyển giao Production (`--confirm-live`):**
   - Xuất bản hồ sơ so sánh Trước/Sau có ảnh chụp thực tế và bảng đo tốc độ trên cùng máy chủ để Ban Giám đốc nghiệm thu trước khi chạy lệnh đồng bộ lên tên miền chính.
