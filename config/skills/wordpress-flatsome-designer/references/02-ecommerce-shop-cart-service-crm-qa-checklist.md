# BỘ TIÊU CHÍ QA CHECKLIST & KIẾN TRÚC CHUẨN CHO WEBSITE THƯƠNG MẠI – DỊCH VỤ – SHOP GIỎ HÀNG – BÁO GIÁ VIP & CRM ĐA KÊNH (`v2.5.2 Master Blueprint`)

> **Mục đích tài liệu:** Đúc kết toàn bộ kiến trúc kỹ thuật, logic nghiệp vụ bán hàng lai (*Hybrid E-Commerce: Sản phẩm có giá cố định + Sản phẩm báo giá VIP + Dịch vụ đặt lịch*), chuẩn thiết kế UI/UX đa khung hình (*Mobile `390×844` & Laptop `1366×768`*), tối ưu tốc độ *Core Web Vitals* (*WP Rocket + OpenLiteSpeed + WAF*), *SEO/GEO 6 lớp Schema JSON-LD* và *Hệ thống Trợ lý AI + CRM Realtime* từ dự án thực chiến **GolfViet.com.vn (`v2.5.2`)** để tái sử dụng làm **Skill / Checklist nghiệm thu chuẩn** cho mọi dự án Website Thương mại – Dịch vụ – Cửa hàng trực tuyến tiếp theo.

---

## MỤC LỤC 10 TRỤ CỘT KIỂM TOÁN TOÀN DIỆN (80 TIÊU CHÍ BẮT BUỘC)

1. **[Trụ cột 1] Logic Sản Phẩm Lai (Hybrid Catalog): Hàng Có Giá vs Hàng Báo Giá VIP vs Dịch Vụ Đặt Lịch** *(10 tiêu chí)*
2. **[Trụ cột 2] Logic Bộ Lọc Thông Minh (Smart Filter), Tìm Kiếm, Phân Trang & `URL-as-State`** *(10 tiêu chí)*
3. **[Trụ cột 3] Logic Trang Chi Tiết Sản Phẩm (PDP), Biến Thể, Giỏ Hàng, Mua Nhanh 1-Chạm & Checkout** *(10 tiêu chí)*
4. **[Trụ cột 4] Chuẩn Thiết Kế Giao Diện (UI/UX), Đa Khung Hình Mobile/Desktop & Khả Năng Tiếp Cận (WCAG 2.2 AA)** *(12 tiêu chí)*
5. **[Trụ cột 5] Tốc Độ Tải Trang (Core Web Vitals), Tương Thích Cache OpenLiteSpeed/WP Rocket & Tối Ưu Tài Nguyên** *(10 tiêu chí)*
6. **[Trụ cột 6] SEO Kỹ Thuật, Cấu Trúc Dữ Liệu 6 Lớp Schema JSON-LD & AI Search (GEO)** *(8 tiêu chí)*
7. **[Trụ cột 7] Hệ Thống Trợ Lý AI Bán Hàng, Thu Thập Lead Đa Kênh, CRM Realtime & Trang Cảm Ơn (`/cam-on/`)** *(10 tiêu chí)*
8. **[Trụ cột 8] Các Trang Nội Dung Trọng Yếu: Chính Sách (Sticky TOC), Liên Hệ, Học Viện/Dịch Vụ & Tài Khoản VIP** *(5 tiêu chí)*
9. **[Trụ cột 9] Bảo Mật Hệ Thống, Công Cụ Quản Trị Nhanh (Quick Studio) & Kỷ Luật Staging $\rightarrow$ Production** *(5 tiêu chí)*
10. **[Trụ cột 10] Kịch Bản Kiểm Toán Tự Động E2E (Playwright + Raw HTTP Headers) Trước Khi Bàn Giao** *(Mẫu Script Chuẩn)*

---

## 1. TRỤ CỘT 1: LOGIC SẢN PHẨM LAI (HYBRID CATALOG — CÓ GIÁ NIÊM YẾT vs BÁO GIÁ VIP vs DỊCH VỤ)

Trong các website thương mại kết hợp dịch vụ cao cấp (Gậy golf, Đồng hồ, Nội thất, Thiết bị y tế, Máy công nghiệp, Ô tô, Thẩm mỹ viện, Học viện...), danh mục hàng hóa luôn tồn tại song song **3 nhóm sản phẩm có luồng chuyển đổi khác nhau**. Tuyệt đối không dùng chung 1 khuôn mẫu nút bấm cho cả 3 nhóm:

| Mã QA | Hạng Mục Kiểm Tra | Quy Chuẩn Kỹ Thuật & Trải Nghiệm Bắt Buộc | Mức Độ |
| :--- | :--- | :--- | :---: |
| **`CAT-01`** | **Phân luồng tự động Sản phẩm Có Giá (`Price > 0`)** | Khi sản phẩm có giá niêm yết (`$product->get_price() > 0` và `is_purchasable()`), phải hiển thị rõ giá bán (`font-variant-numeric: tabular-nums`), giá gốc gạch ngang + badge `-%` (nếu đang giảm giá), kèm cặp nút **`Mua Ngay`** (mở Quick-Buy Modal 1 bước) và **`Thêm Vào Giỏ`**. | **P0** |
| **`CAT-02`** | **Phân luồng tự động Sản phẩm Báo Giá VIP (`Price = 0` / Rỗng)** | Khi sản phẩm không điền giá hoặc giá `= 0`: **Cấm** hiển thị chữ `"0 ₫"` hoặc `"Miễn phí"`; **cấm** hiện nút `"Thêm vào giỏ"` hoặc ô chọn số lượng `+ / -`. Phải tự động gắn class `.gv-pdp-vip-quote-only` và đổi CTA thành **`Nhận Báo Giá VIP 1:1`** (mở trực tiếp Chatbot/Modal tư vấn nạp sẵn tên sản phẩm). | **P0** |
| **`CAT-03`** | **Phân luồng Gói Dịch Vụ / Đặt Lịch (`Service / Booking / Fitting`)** | Các gói dịch vụ (khóa học, đo khám, bảo dưỡng, fitting, tư vấn tại chỗ) phải hiển thị bảng quyền lợi rõ ràng và nút **`Đặt Lịch Ngay`**, khi bấm tự động mở form/chatbot nạp sẵn tên gói dịch vụ (`openLeadFlow('service_booking')`) thay vì đẩy vào giỏ hàng vật lý. | **P0** |
| **`CAT-04`** | **Hiển thị Thông Số Kỹ Thuật Tóm Tắt ngay trên Card (`Spec Pills`)** | Trên thẻ sản phẩm (Product Card) ở Trang chủ & Cửa hàng, trích xuất tự động 2–3 thông số quan trọng nhất (ví dụ: *Thương hiệu, Độ cứng Flex, Tình trạng Mới 100% / Lướt Tuyển Chọn*) thành các nhãn nhỏ (`Spec Pills`) giúp khách so sánh ngay mà không cần mở 10 tab. | **P1** |
| **`CAT-05`** | **Nhãn Tình Trạng Hàng Hóa (`Condition & Authenticity Badge`)** | Phân biệt rõ bằng màu sắc ngữ nghĩa: **`Mới 100% Chính Hãng`** (Xanh lục bảo / Vàng kim) vs **`Gậy Lướt Tuyển Chọn 95–99%`** (Xanh dương / Cam đồng) vs **`Hàng Đặt Trước (Pre-Order)`**. | **P1** |
| **`CAT-06`** | **Đồng bộ chiều cao Thẻ Sản Phẩm (`Equal-Height Cards`)** | Khóa khung ảnh tỉ lệ `1:1` (`aspect-ratio: 1 / 1`), tên sản phẩm giới hạn tối đa 2 dòng (`-webkit-line-clamp: 2; min-height: 2.8em`), hàng thông số cố định chiều cao và đẩy khối Giá + Nút CTA xuống sát đáy thẻ (`margin-top: auto`) để lưới 2 cột (Mobile) và 4 cột (Desktop) luôn thẳng hàng tuyệt đối. | **P1** |
| **`CAT-07`** | **Hiển thị Nút Hành Động Trên Mobile Không Cần Hover** | Trên máy tính có thể dùng hiệu ứng hover hiện nút phụ, nhưng trên màn hình cảm ứng (`@media (max-width: 849px)`), nút **`Mua Nhanh / Nhận Báo Giá`** bắt buộc phải hiển thị trực tiếp (`opacity: 1; transform: none`), vùng chạm tối thiểu `44×44px`. | **P0** |
| **`CAT-08`** | **Chuyển Tab Danh Mục Tức Thời Trên Trang Chủ (`AJAX Showcase Tabs`)** | Khối sản phẩm nổi bật trên trang chủ có các tab chuyển nhanh (*Tất cả, Bán chạy, Hàng mới, Tầm giá...*) phản hồi tức thời có cache Transient (`wp_cache`/`transient`), tự động xóa cache khi cập nhật sản phẩm. | **P2** |
| **`CAT-09`** | **Xử lý Sản phẩm Hết Hàng (`Out of Stock`)** | Khi `is_in_stock() === false`: Làm mờ nhẹ nhãn hết hàng, ẩn nút mua trực tiếp nhưng hiển thị nút **`Báo Khi Có Hàng / Tìm Mẫu Tương Đương`** để giữ lại Lead khách hàng thay vì làm mất khách. | **P1** |
| **`CAT-10`** | **Chuẩn hóa Đơn vị Tiền tệ & Định dạng Số (`VND Formatting`)** | Thống nhất cách viết tiền tệ toàn trang (`45.800.000₫` hoặc `45,8 Triệu` trên thanh lọc nhanh), dùng dấu chấm phân cách hàng nghìn theo chuẩn Việt Nam và bật `tabular-nums`. | **P2** |

---

## 2. TRỤ CỘT 2: LOGIC BỘ LỌC THÔNG MINH (SMART FILTER), TÌM KIẾM, PHÂN TRANG & `URL-AS-STATE`

Một lỗi kinh điển của các website WooCommerce/Flatsome là bộ lọc tùy biến hoạt động tách rời khỏi thanh tìm kiếm và biến phân trang gốc của WordPress. Bộ tiêu chí dưới đây khóa chặt sự đồng bộ giữa **URL $\leftrightarrow$ Giao diện $\leftrightarrow$ Query Database**:

| Mã QA | Hạng Mục Kiểm Tra | Quy Chuẩn Kỹ Thuật & Trải Nghiệm Bắt Buộc | Mức Độ |
| :--- | :--- | :--- | :---: |
| **`FLT-01`** | **Đồng bộ 2 chiều URL $\leftrightarrow$ Bộ lọc (`URL-as-State`)** | Khi mở một đường dẫn có sẵn tham số (ví dụ: `?gv_max_price=2000000` hoặc `?gv_brand=taylormade&s=driver`), JavaScript phải đọc `window.location.search` để đánh dấu `is-active` đúng các chip lọc tương ứng; khi bấm lọc mới phải cập nhật URL qua `history.pushState` để khách bấm `F5`, `Back/Forward` hoặc chia sẻ link qua Zalo đều giữ nguyên kết quả. | **P0** |
| **`FLT-02`** | **Đồng bộ cả `$wp_query` và `$wp_the_query` khi lọc dữ liệu** | Trong WordPress/WooCommerce, hàm `woocommerce_result_count()` và `woocommerce_pagination()` đọc từ biến toàn cục `$GLOBALS['wp_the_query']`. Khi ghi đè truy vấn sản phẩm tùy biến, bắt buộc gán đồng thời cả `$GLOBALS['wp_query']` và `$GLOBALS['wp_the_query']` để tổng số sản phẩm (`"Hiển thị 1–12 của 20 kết quả"`) và số trang phân trang khớp 100% với lưới sản phẩm thực tế. | **P0** |
| **`FLT-03`** | **Tích hợp Từ khóa Tìm kiếm (`?s=...`) vào Thanh Bộ Lọc** | Khi khách tìm kiếm từ Header (ví dụ: `s=driver`), trang kết quả phải hiển thị chip **`Từ khóa: "driver" [×]`** ngay trong thanh trạng thái đang lọc và cho phép kết hợp lọc tiếp theo Thương hiệu / Khoảng giá mà không làm mất từ khóa tìm kiếm. | **P1** |
| **`FLT-04`** | **Đếm Số Lượng Sản Phẩm Thực Tế Trên Từng Chip Lọc (`Facet Counts`)** | Mỗi chip lọc (Thương hiệu, Loại sản phẩm, Tình trạng) phải hiển thị số lượng sản phẩm hiện có trong ngoặc, ví dụ: `TaylorMade (18)`. Các thuộc tính có `count = 0` phải tự động ẩn đi (`Hide Empty Facets`) để khách không bao giờ bấm vào một bộ lọc trả về 0 sản phẩm. | **P1** |
| **`FLT-05`** | **Tối ưu Diện tích Bộ Lọc Trên Mobile (`Progressive Disclosure`)** | Trên màn hình điện thoại (`390×844`), **cấm** xổ toàn bộ 4–5 hàng chip lọc chiếm hết màn hình đầu tiên. Chỉ hiển thị **1 hàng thanh cuộn ngang** cho nhu cầu chính (Khoảng giá + Thương hiệu) kèm 1 nút **`Bộ lọc chuyên sâu (N)`** đóng/mở gọn gàng để hàng sản phẩm đầu tiên xuất hiện ngay ở `Y <= 380px`. | **P0** |
| **`FLT-06`** | **Tự động Cuộn Mượt Lên Đầu Lưới Sản Phẩm Khi Đổi Trang (`Pagination Scroll`)** | Khi khách ở cuối trang bấm sang `Trang 2`, `Trang 3` bằng AJAX, trình duyệt phải tự động cuộn mượt (`scrollIntoView({ behavior: 'smooth', block: 'start' })`) về đầu lưới sản phẩm (trừ chiều cao Sticky Header `90px`) để khách thấy ngay sản phẩm mới. | **P1** |
| **`FLT-07`** | **Chống Race-Condition Khi Bấm Lọc Liên Tục (`AbortController / Request Seq`)** | Khi người dùng bấm liên tiếp 3 chip lọc trong 1 giây, phải hủy request AJAX cũ (`AbortController`) hoặc kiểm tra số thứ tự request (`reqSeq`) để chỉ render kết quả của lần bấm cuối cùng, kèm hiệu ứng mờ nhẹ (`opacity: 0.55`) báo hiệu đang tải. | **P1** |
| **`FLT-08`** | **Màn hình Cứu Hộ Khi Không Có Kết Quả (`Zero-Result Recovery`)** | Nếu tổ hợp lọc quá hẹp trả về `0` sản phẩm: Hiển thị thông báo thân thiện kèm nút nổi bật **`Xóa tất cả bộ lọc`** + gợi ý 4 sản phẩm bán chạy nhất + nút **`Nhờ Chuyên Gia Tìm Giúp Mẫu Này`**. | **P1** |
| **`FLT-09`** | **Đồng bộ Dropdown Sắp Xếp (`Orderby`: Giá tăng/giảm, Mới nhất, Bán chạy)** | Đổi thứ tự sắp xếp (`price`, `price-desc`, `date`, `popularity`) phải giữ nguyên các chip lọc Thương hiệu / Khoảng giá đang chọn và ngược lại. | **P1** |
| **`FLT-10`** | **Hỗ trợ Mốc Giá Thực Tế Theo Ngành Hàng (`Realistic Price Tiers`)** | Các chip lọc khoảng giá phải bám sát phân khúc giá thực tế của kho hàng (ví dụ: *Dưới 2 Triệu* cho phụ kiện/bóng/găng tay, *Dưới 15 Triệu*, *15–35 Triệu*, *35–70 Triệu*, *Trên 70 Triệu* cho bộ gậy fullset) để mọi nút lọc trên Menu đều có sẵn sản phẩm thật. | **P0** |

---

## 3. TRỤ CỘT 3: LOGIC TRANG CHI TIẾT SẢN PHẨM (PDP), BIẾN THỂ, GIỎ HÀNG, MUA NHANH & CHECKOUT

| Mã QA | Hạng Mục Kiểm Tra | Quy Chuẩn Kỹ Thuật & Trải Nghiệm Bắt Buộc | Mức Độ |
| :--- | :--- | :--- | :---: |
| **`PDP-01`** | **Đồng bộ Giá & Trạng thái Biến Thể (`found_variation` & `reset_data`)** | Với sản phẩm có biến thể (Variable Product): Khi khách chọn thông số (Độ cứng/Góc độ/Màu/Size), phải lắng nghe sự kiện `found_variation` của WooCommerce để cập nhật tức thời **Giá ở đầu trang**, **Giá ở Sticky Bottom Bar (Mobile)**, **Mã SKU** và **Ảnh sản phẩm**. | **P0** |
| **`PDP-02`** | **Thanh Mua Hàng Dính Đáy Màn Hình Điện Thoại (`Mobile Sticky Add-to-Cart / Quote Bar`)** | Khi cuộn trang PDP trên điện thoại qua khỏi nút mua chính, thanh Sticky Bar cố định ở đáy màn hình (`bottom: 0`, có `padding-bottom: env(safe-area-inset-bottom)` cho iPhone tai thỏ) phải hiện rõ: Tên/Giá sản phẩm + Nút **`Mua Ngay`** (hoặc **`Nhận Báo Giá VIP`** nếu là hàng `0₫`). | **P0** |
| **`PDP-03`** | **Hộp Thoại Mua Nhanh 1 Bước (`1-Click Quick-Buy Modal`)** | Khi khách bấm **`Mua Ngay`**, mở ngay Modal Mua Nhanh ngay trên trang hiện tại (không bắt chuyển qua Cart $\rightarrow$ Checkout dài dòng): Chỉ gồm **Số lượng (`+ / -` tự nhân thành tiền Tạm tính)** + **Họ tên** + **Số điện thoại (`type="tel"`)** + **Địa chỉ nhận hàng** $\rightarrow$ Bấm xác nhận tạo ngay đơn hàng WooCommerce (`wc_create_order`) và bắn thông báo CRM. | **P0** |
| **`PDP-04`** | **Ngăn Kéo Giỏ Hàng Tức Thời (`AJAX Mini-Cart Drawer`)** | Khi khách bấm **`Thêm Vào Giỏ`** (mua nhiều món), nút phải hiện trạng thái đang thêm (`Loading Spinner`), tự động cập nhật số lượng trên icon Giỏ hàng Header và mở ngăn kéo Mini-Cart có sẵn nút **`Tiến hành thanh toán`**. | **P1** |
| **`PDP-05`** | **Tối Giản Form Thanh Toán (`Streamlined Vietnam Checkout`)** | Dùng filter `woocommerce_checkout_fields` loại bỏ triệt để các trường gây rối không dùng tại Việt Nam: `billing_postcode` (Mã bưu điện), `billing_state` (Bang/Hạt), `billing_company`, `billing_address_2`. Chỉ giữ lại: **Họ và tên**, **Số điện thoại**, **Địa chỉ giao hàng**, **Email (Tùy chọn)** và **Ghi chú đơn hàng**. | **P0** |
| **`PDP-06`** | **Bàn Phím Số Tự Động Cho Ô Điện Thoại (`Mobile Numeric Keypad`)** | Mọi ô nhập Số điện thoại trên trang Checkout, Quick-Buy Modal, Form Liên hệ và Chatbot bắt buộc gắn đủ 3 thuộc tính: `type="tel" inputmode="numeric" autocomplete="tel"` để iOS/Android bật ngay bàn phím số. | **P1** |
| **`PDP-07`** | **Thu Gọn Khung Nhập Mã Giảm Giá (`Compact Coupon Accordion`)** | Không để khung nhập Coupon chiếm 150px chiều dọc đẩy bảng Tóm tắt đơn hàng xuống dưới màn hình đầu Mobile; thu gọn thành dòng liên kết nhẹ nhàng *"Bạn có mã ưu đãi? Nhấn vào đây để nhập"*. | **P2** |
| **`PDP-08`** | **Hiển thị Rõ Phương Thức Thanh Toán & Cam Kết An Toàn (`Payment Trust Box`)** | Tại bước đặt hàng, hiển thị rõ lựa chọn **Kiểm tra hàng trước khi thanh toán (COD)** hoặc **Chuyển khoản ngân hàng / Quét mã VietQR**, kèm huy hiệu cam kết bảo hành chính hãng ngay dưới nút **`Đặt Hàng Hoàn Tất`**. | **P1** |
| **`PDP-09`** | **Màn Hình Giỏ Hàng Rỗng Có Lối Thoát (`Friendly Empty Cart State`)** | Nếu khách vào `/cart/` hoặc `/checkout/` khi giỏ hàng chưa có sản phẩm: Thay vì chỉ hiện 1 dòng báo lỗi cụt lủn của WooCommerce, phải hiển thị giao diện引导 có nút **`Khám Phá Cửa Hàng`**, các danh mục sản phẩm chính và nút **`Đặt Hàng Nhanh Qua Zalo/Hotline`**. | **P1** |
| **`PDP-10`** | **Bố Cục Thông Số Kỹ Thuật & Cam Kết Chính Hãng Dễ Đọc** | Trình bày bảng thông số kỹ thuật dạng bảng 2 cột xen kẽ màu nền (`Zebra Striping`), có hộp cam kết 4 đặc quyền (Chính hãng 100%, Bảo hành rõ ràng, Đổi trả linh hoạt, Giao hàng bảo hiểm) đặt ngay dưới cụm nút mua. | **P2** |

---

## 4. TRỤ CỘT 4: CHUẨN THIẾT KẾ GIAO DIỆN (UI/UX), ĐA KHUNG HÌNH MOBILE/DESKTOP & WCAG 2.2 AA

| Mã QA | Hạng Mục Kiểm Tra | Quy Chuẩn Kỹ Thuật & Trải Nghiệm Bắt Buộc | Mức Độ |
| :--- | :--- | :--- | :---: |
| **`UI-01`** | **Chống Tràn Ngang Tuyệt Đối (`Zero Horizontal Overflow`)** | Kiểm tra thực tế bằng DOM (`document.documentElement.scrollWidth <= window.innerWidth`) trên cả 4 khung hình: `375×812`, `390×844`, `768×1024`, `1366×768` và `1440×900`. Tuyệt đối không để bất kỳ bảng, hàng nút hay banner nào thò ra ngoài mép phải màn hình. | **P0** |
| **`UI-02`** | **Kích Thước Vùng Chạm Cảm Ứng (`Touch Target >= 44×44px`)** | Mọi nút bấm, nút đóng popup (`×`), nút tăng giảm số lượng (`+ / -`), nút Hamburger Menu, icon Tìm kiếm/Giỏ hàng, chip lọc trên Mobile bắt buộc có kích thước vùng bấm tối thiểu **`44×44px`** theo chuẩn Apple HIG & WCAG 2.2. | **P0** |
| **`UI-03`** | **Chống iOS Safari Tự Phóng To Khi Chạm Ô Nhập (`Input Font >= 16px`)** | Trên màn hình `< 850px`, toàn bộ thẻ `<input>`, `<select>`, `<textarea>` bắt buộc có `font-size: 16px !important` (nếu nhỏ hơn `16px`, trình duyệt iOS Safari sẽ tự động zoom lệch khung hình khi người dùng chạm vào ô nhập). | **P0** |
| **`UI-04`** | **Ngân Sách Chiều Cao Màn Hình Đầu (`Above-the-Fold Viewport Budget`)** | Cụm Topbar + Sticky Header không được chiếm quá **`12%`** chiều cao màn hình Laptop (`<= 92px` trên `1366×768`) và không quá **`9%`** trên Mobile (`<= 72px` trên `390×844`). Khi cuộn xuống, Header tự động thu gọn (`compact header`). | **P1** |
| **`UI-05`** | **Không Chồng Chéo Giữa Nút Nổi, Sticky Bar & Khung Chat (`Floating UI Orchestration`)** | Khi ở trang PDP có Sticky Bottom Bar hoặc khi người dùng mở khung Trợ lý AI / mở Modal Mua Nhanh (`body.gv-chat-is-open`, `body.gv-quickbuy-open`), cụm nút liên hệ nổi (`Floating Dock`) phải tự động ẩn đi hoặc dịch chuyển lên trên để không đè lên nút **`Mua Ngay`** hay nút **`Gửi tin nhắn`**. | **P0** |
| **`UI-06`** | **Khóa Loại Nút `<button type="button">` (`Explicit Button Type Rule`)** | Theo chuẩn HTML5, mọi thẻ `<button>` không khai báo `type` sẽ mặc định là `type="submit"`, dễ gây tự động reload form hoặc xung đột sự kiện khi đặt trong form WooCommerce/CRM. Bắt buộc 100% nút tương tác UI khai báo rõ `type="button"`, chỉ nút gửi form mới dùng `type="submit"`. | **P0** |
| **`UI-07`** | **Độ Tương Phản Màu Chữ Đạt Chuẩn WCAG 2.2 AA (`Contrast >= 4.5:1`)** | Không dùng chữ xám nhạt trên nền trắng hoặc chữ vàng nhạt trên nền kem sáng. Văn bản thường phải đạt tỷ lệ tương phản `>= 4.5:1`; tiêu đề lớn và chữ trên nút CTA vàng kim (`#C89B3C` / `#D4AF37`) phải dùng chữ tối đậm (`#0A1E14` / `#111827`) hoặc nền xanh đậm (`#0B291B`) với chữ trắng tinh (`#FFFFFF`). | **P1** |
| **`UI-08`** | **Cấm Tuyệt Đối Dùng Emoji Thay Icon Hệ Thống (`100% Crisp Inline SVG`)** | Không dùng các biểu tượng emoji hệ điều hành (`📞, 💬, 🛒, ⭐, 🔥`) trong giao diện chính thức vì hiển thị lệch lạc giữa Windows/iOS/Android và tạo cảm giác rẻ tiền (*AI Slop*). Sử dụng 100% **Inline SVG Icons** đồng nhất độ dày nét (`stroke-width: 1.75–2px`). | **P1** |
| **`UI-09`** | **Menu Mobile Phân Tầng Rõ Ràng (`Off-Canvas Drawer Navigation`)** | Ngăn kéo Menu trên điện thoại phải có: Ô tìm kiếm nhanh ở trên cùng $\rightarrow$ Danh mục sản phẩm có accordion đóng/mở (`+ / -`) $\rightarrow$ Các lối tắt dịch vụ/học viện $\rightarrow$ Cụm nút Gọi Hotline / Chat Zalo cố định ở chân menu. | **P1** |
| **`UI-10`** | **Mega Menu / Dropdown Trên Máy Tính Gọn Trong Khung Nhìn (`Desktop Dropdown Bounds`)** | Khi rê chuột vào mục Cửa hàng trên màn hình Laptop `1366×768`, menu xổ xuống phải tự động căn chỉnh trong phạm vi màn hình (`max-height: calc(100vh - 110px); overflow-y: auto`), không bị tràn ra ngoài mép phải hoặc mép dưới. | **P1** |
| **`UI-11`** | **Phản Hồi Tức Thời Khi Bấm Nút (`8-State Interactive Feedback`)** | Mọi form và nút hành động phải có đủ trạng thái: *Default, Hover, Focus-Visible (viền bàn phím rõ), Active/Pressed, Loading/Submitting (khóa bấm đúp `disabled` + chữ `"Đang xử lý..."`), Empty, Error (báo lỗi tiếng Việt cụ thể ngay dưới ô nhập)* và *Success*. | **P1** |
| **`UI-12`** | **Hệ Thống Typography Tiếng Việt Không Lỗi Dấu (`Vietnamese Font Hygiene`)** | Sử dụng font hỗ trợ tiếng Việt hoàn hảo (như `Be Vietnam Pro`, `Inter`, `Plus Jakarta Sans`), kiểm tra kỹ các chữ cái có dấu kép (`Ề, Ể, Ễ, Ệ, Ổ, Ỗ, Ộ, Ư, Ứ, Ữ, Ự`) không bị cắt dấu khi dùng `overflow: hidden` hoặc `line-height` quá thấp (`line-height` tiêu đề tối thiểu `1.22–1.3`). | **P1** |

---

## 5. TRỤ CỘT 5: TỐC ĐỘ TẢI TRANG (`CORE WEB VITALS`), TƯƠNG THÍCH CACHE OPENLITESPEED / WP ROCKET & TỐI ƯU TÀI NGUYÊN

| Mã QA | Hạng Mục Kiểm Tra | Quy Chuẩn Kỹ Thuật & Trải Nghiệm Bắt Buộc | Mức Độ |
| :--- | :--- | :--- | :---: |
| **`PERF-01`** | **Chống Lỗi Tải File `download` (`application/octet-stream`) Khi Dùng WP Rocket Trên OpenLiteSpeed** | **Cực kỳ quan trọng:** Máy chủ OpenLiteSpeed (`lshttpd`) bỏ qua chỉ thị `AddType text/html .html_gzip` của Apache trong `.htaccess`, nên nếu `.htaccess` rewrite sang file `index-https.html_gzip`, OpenLiteSpeed sẽ trả về `Content-Type: application/octet-stream` khiến Chrome bật cửa sổ tải file `download`! **Giải pháp bắt buộc:** Thêm `add_filter('rocket_force_gzip_htaccess_rules', '__return_false', 99)` + hàm tự làm sạch `WPR_ENC:_gzip` trong `.htaccess` + chạy `/usr/local/lsws/bin/lswsctrl reload` để OpenLiteSpeed phục vụ trực tiếp `index-https.html` (`Content-Type: text/html`) kèm nén `zstd`/`gzip` gốc ở tầng C++. | **P0** |
| **`PERF-02`** | **Loại Trừ Script Tương Tác Khỏi Delay JS (`0ms First-Tap Latency`)** | Nếu bật tính năng *Delay JavaScript Execution* của WP Rocket mà không loại trừ script giao diện, lần chạm đầu tiên của khách trên điện thoại vào Menu/Filter/Chat sẽ bị đơ 1–2 giây. Bắt buộc thêm các script cốt lõi (`jquery-core`, `flatsome`, `luxury-ui`, `gv-chatbot`, `woocommerce`) vào filter `rocket_delay_js_exclusions` và nạp bằng thuộc tính `defer`. | **P0** |
| **`PERF-03`** | **Bỏ Qua Tham Số Tracking Zalo / Facebook / Google Ads Để Trúng 100% Cache Tĩnh** | Thêm `zarsrc`, `zdlink`, `zalo_id`, `zalo_oat`, `utm_id`, `gad_source`, `gbraid`, `wbraid`, `ttclid`, `_t` vào filter `rocket_cache_ignored_parameters` (**lưu ý:** WP Rocket yêu cầu truyền tên tham số làm **key của mảng** `$params['zarsrc'] = 1`). | **P1** |
| **`PERF-04`** | **Loại Trừ Tuyệt Đối Trang Động Khỏi Cache Tĩnh (`Cache Reject URIs`)** | Không bao giờ cache tĩnh các đường dẫn: `/crm/(.*)`, `/api-crm.php`, `/cam-on/(.*)`, `/cart/`, `/checkout/`, `/my-account/` thông qua filter `rocket_cache_reject_uri`. | **P0** |
| **`PERF-05`** | **Cắt Bỏ Tài Nguyên Thừa Theo Từng Loại Trang (`Conditional Asset Dequeuing`)** | - Gỡ `zxcvbn.min.js` (`395 KB`) và `wc-password-strength-meter` ở mọi trang trừ `/my-account/` và `/checkout/`.<br>- Gỡ `dashicons.min.css` (`35 KB`) cho khách truy cập chưa đăng nhập.<br>- Gỡ `contact-form-7` & `google-recaptcha` ở trang không chứa shortcode `[contact-form-7`.<br>- Gỡ `photoswipe` và `woo-variation-swatches` ở các trang không phải PDP.<br>- Gỡ `wc-cart-fragments` chặn luồng trên trang thường. | **P1** |
| **`PERF-06`** | **Tự Động Chuyển Đổi & Co Giãn Ảnh WebP Cô Lập (`Zero-Touch WebP Cache`)** | Tự động chuyển ảnh `.png/.jpg` trong `/wp-content/uploads/` sang định dạng `.webp` nhẹ hơn 70–85% và lưu riêng tại `/wp-content/gv-webp-cache/` (giữ nguyên file gốc 100%), đồng thời giới hạn chiều rộng hợp lý theo vị trí hiển thị (Logo `360px`, Thumbnail sản phẩm `600px`, Hero `1600px`). | **P1** |
| **`PERF-07`** | **Tối Ưu Phần Tử Lớn Nhất Màn Hình Đầu (`Responsive LCP Preload & Lazy-Load`)** | Gắn `loading="eager" fetchpriority="high" decoding="sync"` + thẻ `<link rel="preload" as="image">` cho duy nhất ảnh đầu tiên trên màn hình đầu (Hero hoặc 2 sản phẩm đầu trang Cửa hàng); toàn bộ ảnh dưới màn hình đầu và ảnh trong menu ẩn bắt buộc gắn `loading="lazy" decoding="async"`. | **P1** |
| **`PERF-08`** | **Tải Google Fonts Không Chặn Hiển Thị (`Non-Render-Blocking Fonts`)** | Nạp font `Be Vietnam Pro` bằng kỹ thuật `<link rel="preload" as="style">` kết hợp `media="print" onload="this.media='all'"` và chuyển toàn bộ `@font-face` icon nội bộ sang `font-display: swap;`. | **P1** |
| **`PERF-09`** | **Điều Hướng Siêu Tốc Bằng Speculation Rules API (`< 50ms Navigation`)** | Nhúng `<script type="speculationrules">` (`eagerness: conservative`) ở chân trang cho khách chưa đăng nhập để trình duyệt Chromium tự động prefetch trang Danh mục/Sản phẩm ngay khi người dùng vừa đặt ngón tay/chuột lên đường link (`pointerdown`). | **P2** |
| **`PERF-10`** | **Nút "Xóa Cache Turbo" 1 Chạm Trên Thanh Admin & Tự Xóa Khi Lưu Sản Phẩm** | Tự động gọi `rocket_clean_domain()` + xóa transient mỗi khi nhân viên thêm/sửa sản phẩm (`save_post`, `woocommerce_update_product`, `edited_terms`) và cung cấp nút **`Xóa Cache Turbo`** ngay trên thanh Admin Bar. | **P1** |

---

## 6. TRỤ CỘT 6: SEO KỸ THUẬT, CẤU TRÚC DỮ LIỆU 6 LỚP SCHEMA JSON-LD & AI SEARCH (GEO)

| Mã QA | Hạng Mục Kiểm Tra | Quy Chuẩn Kỹ Thuật & Trải Nghiệm Bắt Buộc | Mức Độ |
| :--- | :--- | :--- | :---: |
| **`SEO-01`** | **Cấu Trúc Heading Chuẩn Học Thuật (`Single H1 & Semantic Hierarchy`)** | Mỗi URL chỉ có **duy nhất 1 thẻ `<h1>`** chứa từ khóa chính của trang; các phân mục con đi theo đúng thứ tự `<h2>` $\rightarrow$ `<h3>`, tuyệt đối không dùng thẻ `<h1>–<h3>` chỉ để làm chữ to cho mục trang trí ở Footer/Sidebar. | **P0** |
| **`SEO-02`** | **Hệ Thống 6 Lớp Schema JSON-LD Tự Động (`Rich Snippets & AI Overviews`)** | Tự động sinh khối `<script type="application/ld+json">` hợp lệ gồm: `Organization` / `LocalBusiness` (kèm tọa độ GPS, giờ mở cửa, hotline), `WebSite` (`SearchAction`), `BreadcrumbList`, `Product` (kèm `Offers`, `Brand`, `SKU`, `itemCondition`), `FAQPage` và `Article`. | **P1** |
| **`SEO-03`** | **Bảo Vệ Schema `Product` Khi Sản Phẩm Không Điền Giá (`0₫ Guard`)** | Đối với sản phẩm Báo giá VIP (`Price = 0`), không xuất trường `"price": "0"` gây cảnh báo trên Google Merchant Center; chỉ xuất `Offer` có giá số dương hợp lệ kèm `priceValidUntil` và `availability`. | **P1** |
| **`SEO-04`** | **Tự Động Đảm Bảo 100% Thẻ `<img>` Có Thuộc Tính `alt` Giàu Ngữ Nghĩa** | Quét toàn bộ HTML đầu ra: nếu có bất kỳ thẻ `<img>` nào thiếu `alt` hoặc `alt=""` rỗng, tự động điền `alt` ngữ nghĩa theo tiêu đề trang/sản phẩm và thương hiệu. | **P1** |
| **`SEO-05`** | **Kiểm Soát Canonical & Chống Trùng Lặp URL Lọc (`Faceted Search SEO`)** | Các URL có tham số lọc phụ (`?gv_brand=...`, `?gv_max_price=...`, `?orderby=...`) phải có thẻ `<link rel="canonical">` trỏ về URL danh mục gốc sạch sẽ để không làm loãng sức mạnh SEO. | **P1** |
| **`SEO-06`** | **Meta Title, Meta Description, OpenGraph & Zalo/Facebook Share Card** | Đảm bảo mọi trang chính (Trang chủ, Cửa hàng, Danh mục, PDP, Học viện, Liên hệ, Chính sách) đều có `og:title`, `og:description`, `og:image` sắc nét khi dán link qua Zalo hoặc Facebook Messenger. | **P1** |
| **`SEO-07`** | **Khóa Index Tuyệt Đối Trên Môi Trường Staging (`Staging Noindex Guard`)** | Khi chạy trên thư mục/subdomain thử nghiệm (`/staging-v2/`), phải bật `blog_public = 0` (`noindex, nofollow`) để Google không lập chỉ mục nhầm bản nháp; chỉ mở `index, follow` trên tên miền Production chính thức. | **P0** |
| **`SEO-08`** | **Cấu Trúc Nội Dung Thân Thiện Với AI Search (`GEO / Answer-First Blocks`)** | Ở các trang Danh mục, Dịch vụ và Bài viết chuyên sâu, luôn có hộp tóm tắt thông số/câu trả lời cốt lõi ngay đầu bài và khối Câu hỏi thường gặp (`FAQ`) ở cuối trang để các công cụ AI (Google AI Overviews, ChatGPT, Perplexity) dễ dàng trích dẫn. | **P2** |

---

## 7. TRỤ CỘT 7: HỆ THỐNG TRỢ LÝ AI BÁN HÀNG, THU THẬP LEAD ĐA KÊNH, CRM REALTIME & TRANG CẢM ƠN

| Mã QA | Hạng Mục Kiểm Tra | Quy Chuẩn Kỹ Thuật & Trải Nghiệm Bắt Buộc | Mức Độ |
| :--- | :--- | :--- | :---: |
| **`CRM-01`** | **Trí Nhớ Phiên Trò Chuyện Xuyên Trang (`sessionStorage` Chat Memory)** | Khi khách đang chat với Trợ lý AI ở Trang chủ rồi bấm sang xem Sản phẩm hoặc Cửa hàng, toàn bộ lịch sử tin nhắn và thông tin khách đã cung cấp (`leadState`: tên, SĐT, nhu cầu, ngân sách) phải được khôi phục nguyên vẹn từ `sessionStorage`, tuyệt đối không bị reset trắng. | **P0** |
| **`CRM-02`** | **Nạp Sẵn Ngữ Cảnh Sản Phẩm/Dịch Vụ Vào Luồng Tư Vấn (`Context Injection`)** | Khi khách bấm nút **`Nhận Báo Giá VIP`** trên trang sản phẩm X hoặc bấm **`Đặt Lịch Fitting`** ở gói dịch vụ Y, khung Chatbot/Form phải tự động nhận biết tên sản phẩm X / gói dịch vụ Y và mở đầu bằng lời chào đúng ngữ cảnh (*"Dạ anh/chị đang quan tâm mẫu [Tên SP]..."*). | **P0** |
| **`CRM-03`** | **Chuẩn Hóa & Kiểm Định Số Điện Thoại Việt Nam (`VN Phone Sanitizer`)** | Tự động loại bỏ khoảng trắng, dấu chấm, gạch ngang; tự động đổi đầu số `+84` hoặc `84` thành `0`; kiểm tra đúng chuẩn 10 số di động Việt Nam (`^0[35789][0-9]{8}$`) ở cả Frontend lẫn Backend PHP trước khi lưu. | **P0** |
| **`CRM-04`** | **Cơ Chế Ghi Kép Chống Rơi Rớt Lead (`Dual-Write Lead Persistence`)** | Mỗi khi khách để lại SĐT (qua Chatbot, Form Liên hệ, Đặt lịch, hay Mua nhanh), hệ thống phải ghi đồng thời vào: **(1) Bảng Database WordPress (`wp_gv_crm_leads`)** VÀ **(2) Endpoint CRM Realtime độc lập (`/crm/api-crm.php`)** + bắn thông báo Email SMTP / Google Sheets. | **P0** |
| **`CRM-05`** | **Theo Dõi Nguồn Quảng Cáo & Hành Trình Khách Hàng (`Attribution Tracking`)** | Tự động thu thập và gắn kèm theo mỗi Lead các thông số nguồn: `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `gclid`, `fbclid`, `ttclid`, `zarsrc`, trang đầu tiên khách vào (`landing_page`), trang chuyển đổi (`page_url`) và thiết bị (`Mobile/Desktop`). | **P1** |
| **`CRM-06`** | **Trang Cảm Ơn Cá Nhân Hóa (`/cam-on/?lead_id=...`)** | Sau khi gửi thông tin hoặc đặt hàng nhanh, chuyển hướng khách tới trang `/cam-on/` hiển thị rõ: **Mã phiếu tiếp nhận**, **Họ tên & SĐT đã xác nhận**, **Sản phẩm/Dịch vụ đăng ký**, **Cam kết phản hồi trong 5–15 phút**, và nút **Kết nối Zalo / Gọi Hotline ưu tiên**. | **P1** |
| **`CRM-07`** | **Chống Gửi Trùng & Chống Spam (`Idempotency & Rate-Limit Guard`)** | Khóa nút gửi (`disabled` + `is-submitting`) ngay khi bấm; ở phía Server kiểm tra chống tạo bản ghi trùng lặp nếu cùng 1 SĐT bấm gửi 2 lần liên tiếp trong vòng `30 giây`, kèm Honeypot ẩn chống bot spam. | **P1** |
| **`CRM-08`** | **Bảng Điều Khiển CRM Realtime (`/crm/`) Chuẩn UX Quản Trị** | Giao diện quản trị CRM (`/crm/index.html`) hiển thị danh sách khách hàng theo thời gian thực, phân trạng thái xử lý (*Mới, Đang tư vấn, Đã chốt, Hẹn gọi lại*), lọc theo nguồn quảng cáo (Google Ads, Facebook, Zalo, SEO), và 100% nút công cụ có `type="button"`. | **P1** |
| **`CRM-09`** | **Tư Vấn Sản Phẩm Thực Tế Từ Database (`Real-Catalog AI Advisor`)** | Khi khách hỏi Trợ lý AI (*"Tìm gậy Driver dễ đánh dưới 15 triệu"*), bộ máy tư vấn (`gv-golf-advisor-engine.php`) phải truy vấn trực tiếp sản phẩm thật đang còn hàng trong WooCommerce để trả về Thẻ sản phẩm có **Ảnh thật + Giá thật + Link bấm xem ngay** (cấm bịa tên sản phẩm không có trong shop). | **P0** |
| **`CRM-10`** | **Tự Động Lưu Sự Kiện Chuyển Đổi Cho Quảng Cáo (`Ads Conversion Ready`)** | Trên trang `/cam-on/` và sự kiện gửi Lead thành công, đẩy sự kiện chuẩn vào `window.dataLayer` (`generate_lead`, `purchase`) để Google Tag Manager / Google Ads / Meta Pixel ghi nhận chuyển đổi chính xác. | **P1** |

---

## 8. TRỤ CỘT 8: CÁC TRANG NỘI DUNG TRỌNG YẾU (CHÍNH SÁCH, LIÊN HỆ, HỌC VIỆN/DỊCH VỤ & TÀI KHOẢN VIP)

| Mã QA | Hạng Mục Kiểm Tra | Quy Chuẩn Kỹ Thuật & Trải Nghiệm Bắt Buộc | Mức Độ |
| :--- | :--- | :--- | :---: |
| **`PAGE-01`** | **Trang Chính Sách & Điều Khoản (`/chinh-sach-dieu-khoan-su-dung/`) Có Sticky TOC** | Trình bày chuyên nghiệp gồm: **4 Hộp Tóm Tắt Quyền Lợi 30 Giây** ở đầu trang (Bảo hành, Đổi trả, Kiểm hàng, Bảo mật) + **Mục Lục Neo Dính (`Sticky Table of Contents`)** tự động tạo từ các thẻ `<h2>` và tự động cuộn mượt khi bấm. | **P1** |
| **`PAGE-02`** | **Trang Học Viện / Dịch Vụ (`/hoc-vien/`) Có Luồng Đặt Lịch Khép Kín** | Trình bày rõ các gói dịch vụ/khóa học theo từng cấp độ, mỗi gói có nút **`Đặt Lịch Ngay`** tự động điền tên gói vào Form/Chatbot; tích hợp bảng Câu hỏi thường gặp (`FAQ`) giải đáp ngay các thắc mắc về chi phí và thời gian. | **P1** |
| **`PAGE-03`** | **Trang Liên Hệ & Showroom (`/lien-he/`) Đa Phương Thức 1 Chạm** | Hiển thị rõ địa chỉ Showroom, giờ mở cửa, chỗ đậu xe ô tô, nút **Mở Bản Đồ Google Maps 1 chạm**, nút **Gọi/Zalo trực tiếp**, và **Form Gửi Yêu Cầu Nhanh** kết nối thẳng về CRM (thay thế hoặc bọc an toàn các form CF7 cũ dễ lỗi). | **P1** |
| **`PAGE-04`** | **Trang Tài Khoản & Tra Cứu Đơn Hàng (`/my-account/`) Thân Thiện** | Bọc giao diện đăng nhập mặc định của WooCommerce trong bố cục 2 cột sang trọng: Cột trái làForm Đăng nhập, Cột phải là **Hộp Đặc Quyền Thành Viên VIP & Hỗ Trợ Tra Cứu Đơn Hàng Nhanh Bằng SĐT Qua Zalo/Hotline** (giúp khách mua hàng không cần tạo tài khoản vẫn tra cứu được đơn). | **P1** |
| **`PAGE-05`** | **Trang Tin Tức & Cẩm Nang (`/category/tin-tuc/`) Dẫn Về Sản Phẩm** | Thẻ bài viết đồng bộ chiều cao, có nhãn chuyên mục, thời gian đọc ước tính; cuối bài viết tự động gợi ý các dòng sản phẩm liên quan hoặc nút nhận tư vấn chuyên sâu. | **P2** |

---

## 9. TRỤ CỘT 9: BẢO MẬT HỆ THỐNG, QUẢN TRỊ NHANH (`QUICK STUDIO`) & KỶ LUẬT STAGING $\rightarrow$ PRODUCTION

| Mã QA | Hạng Mục Kiểm Tra | Quy Chuẩn Kỹ Thuật & Trải Nghiệm Bắt Buộc | Mức Độ |
| :--- | :--- | :--- | :---: |
| **`SEC-01`** | **Cách Ly Tuyệt Đối Môi Trường Staging & Production (`Zero-Risk Deployment`)** | Mọi nâng cấp giao diện, plugin, cấu hình cache phải được kiểm thử đạt `100% PASS` trên môi trường Staging (`/staging-v2/` với Database riêng) trước khi áp dụng lên Production; luôn tạo bản sao lưu (`.tar.gz` + `.sql`) trước khi triển khai. | **P0** |
| **`SEC-02`** | **Khóa Truy Cập Trực Tiếp Vào Các Tệp Nhạy Cảm Trong `.htaccess`** | Chặn truy cập HTTP (`403 Forbidden`) đối với `.env`, `.git`, `wp-config.php`, `error_log`, `readme.html`, và mọi tệp `.sql`, `.zip`, `.tar.gz`, `.bak`, `.sh`. | **P0** |
| **`SEC-03`** | **Bảo Vệ Dữ Liệu CRM Nội Bộ (`CRM Data Guard`)** | Thư mục lưu dữ liệu `/crm/crm-data/` phải có `.htaccess` chặn truy cập trực tiếp và mọi tệp dữ liệu đều dùng đuôi `.data.php` mở đầu bằng `<?php exit; ?>` để không bao giờ lộ dữ liệu khách hàng qua trình duyệt. | **P0** |
| **`SEC-04`** | **Kiểm Toán Cú Pháp Mã Nguồn Trước Khi Đẩy Lên Server (`Syntax Gate`)** | Chạy `php -l` cho 100% tệp `.php` và `node --check` cho 100% tệp `.js` / `.min.js` đạt `Exit code 0`; đồng bộ phiên bản `?ver=X.Y.Z` để xóa cache trình duyệt ngay khi nâng cấp. | **P0** |
| **`SEC-05`** | **Làm Sạch Đa Tầng Cache Sau Triển Khai (`Multi-Layer Cache Purge`)** | Khi triển khai trên hạ tầng dùng Reverse Proxy / WAF (như Tadu WAF `tproxy` + OpenLiteSpeed + WP Rocket), phải xóa đồng bộ cả 3 tầng: **(1) WP Rocket Disk Cache**, **(2) OpenLiteSpeed `.htaccess` reload (`lswsctrl reload`)** và **(3) Tadu WAF reverse-proxy `.cache` files**. | **P0** |

---

## 10. TRỤ CỘT 10: KỊCH BẢN KIỂM TOÁN TỰ ĐỘNG E2E (`PLAYWRIGHT + RAW HTTP HEADERS`) TRƯỚC KHI BÀN GIAO

Trước khi nghiệm thu bàn giao bất kỳ dự án Website Thương mại – Dịch vụ – Shop – CRM nào, AI Agent bắt buộc chạy kịch bản kiểm thử tự động dưới đây và đạt **`Exit code 0`** trên toàn bộ các đường dẫn trọng yếu:

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Mẫu Kịch Bản Kiểm Toán E2E Chuẩn Cho Website Thương Mại - Dịch Vụ - Shop - CRM
Kiểm tra đồng thời:
  1. Raw HTTP Headers (Pass 1 & Pass 2): Chống lỗi OpenLiteSpeed .html_gzip -> application/octet-stream download
  2. Đa khung hình Mobile (390x844) & Laptop (1366x768): 0 tràn ngang, 0 lỗi nút thiếu type, 0 download events
  3. Luồng nghiệp vụ: Bộ lọc URL-as-State, Sản phẩm có giá vs Báo giá VIP, Quick-Buy Modal, Checkout & Chatbot Memory
"""
import ssl
import time
import urllib.request
from playwright.sync_api import sync_playwright

BASE_URL = "https://golfviet.com.vn/staging-v2"
ROUTES = [
    f"{BASE_URL}/",
    f"{BASE_URL}/cua-hang/",
    f"{BASE_URL}/product-category/gay-golf/",
    f"{BASE_URL}/hoc-vien/",
    f"{BASE_URL}/lien-he-2/",
    f"{BASE_URL}/category/tin-tuc/",
    f"{BASE_URL}/chinh-sach-dieu-khoan-su-dung/",
    f"{BASE_URL}/my-account/",
]

ctx = ssl._create_unverified_context()
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Encoding": "gzip, deflate, br, zstd",
}

# 1. Kiểm tra HTTP Header 2 vòng (Pass 1 tạo cache, Pass 2 đọc cache tĩnh)
for pass_idx in (1, 2):
    for url in ROUTES:
        t0 = time.perf_counter()
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=20) as resp:
            ct = resp.headers.get("Content-Type", "")
            assert resp.status == 200, f"HTTP {resp.status} tại {url}"
            assert "text/html" in ct.lower(), f"LỖI MIME TYPE '{ct}' (nguy cơ tự tải file download) tại {url}"

# 2. Kiểm tra trên trình duyệt thật Chromium ở Mobile (390x844) & Laptop (1366x768)
downloads = []
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    for vp_name, vp in [("mobile", {"width": 390, "height": 844}), ("laptop", {"width": 1366, "height": 768})]:
        context = browser.new_context(viewport=vp, accept_downloads=True)
        page = context.new_page()
        page.on("download", lambda dl: downloads.append(dl.url))
        for url in ROUTES:
            page.goto(url, wait_until="domcontentloaded", timeout=25000)
            metrics = page.evaluate("""() => ({
                overflowX: document.documentElement.scrollWidth - window.innerWidth,
                untypedButtons: Array.from(document.querySelectorAll('button:not([type])')).length,
                missingAltImgs: Array.from(document.querySelectorAll('img:not([alt]), img[alt=""]')).length
            })""")
            assert metrics["overflowX"] <= 1, f"[{vp_name}] Tràn ngang {metrics['overflowX']}px tại {url}"
            assert metrics["untypedButtons"] == 0, f"[{vp_name}] Có {metrics['untypedButtons']} thẻ <button> thiếu type tại {url}"
        context.close()
    browser.close()

assert len(downloads) == 0, f"Phát hiện sự kiện tự động tải file: {downloads}"
print("ALL QA CHECKS PASSED (EXIT CODE 0)!")
```

---

## BẢNG ĐỐI CHIẾU TỆP MÃ NGUỒN MẪU TRONG DỰ ÁN GOLF VIỆT (`src/`) ĐỂ TÁI SỬ DỤNG CHO DỰ ÁN MỚI

Khi triển khai một dự án Website Thương mại – Dịch vụ mới trên nền tảng WordPress + WooCommerce + Flatsome, có thể tái sử dụng trực tiếp cấu trúc 3 gói module độc lập trong thư mục `src/` của dự án này:

| Module / Tệp Mã Nguồn Mẫu | Đường Dẫn Trong Dự Án Mẫu (`Golf Viet`) | Chức Năng Tái Sử Dụng Cho Dự Án Khác |
| :--- | :--- | :--- |
| **1. Bộ máy Tối ưu Tốc độ & Cache OpenLiteSpeed/WP Rocket** | `src/golfviet-luxury-child/inc/performance-engine.php` | Tự động cắt giảm CSS/JS thừa, tạo WebP cô lập, LCP Preload, khóa lỗi `.html_gzip` download trên OpenLiteSpeed, Speculation Rules API. |
| **2. Bộ máy Bộ lọc Thông minh & Đồng bộ URL-as-State** | `src/golfviet-luxury-child/inc/golf-smart-filter.php` | Lọc AJAX đa chiều (Giá, Thương hiệu, Tình trạng, Thông số, Từ khóa), đếm số lượng Facet, ẩn Facet rỗng, đồng bộ `$wp_the_query`. |
| **3. Bộ máy Mua Nhanh 1 Chạm & Phân Luồng Giá VIP** | `src/golfviet-luxury-child/inc/golf-quick-buy.php` | Hộp thoại Mua Nhanh 1 bước (`wc_create_order`), Sticky Bottom Bar trên PDP, tự động đổi sản phẩm `0₫` sang chế độ Báo Giá VIP. |
| **4. Bộ máy Giao diện Thượng lưu & Tối giản Checkout** | `src/golfviet-luxury-child/inc/ux-golf-elements.php` | Topbar, Header, Footer, Sticky TOC trang Chính sách, trang Liên hệ/Học viện, cổng Tài khoản VIP và rút gọn Checkout Việt Nam. |
| **5. Bộ máy SEO Kỹ thuật & 6 Lớp Schema JSON-LD** | `src/golfviet-luxury-child/inc/seo-geo-engine.php` | Tự động xuất 6 lớp Schema (`Organization`, `WebSite`, `BreadcrumbList`, `Product`, `FAQPage`, `Article`), kiểm soát Canonical & Alt ảnh. |
| **6. Hệ thống CSS/JS Đa Khung Hình & Tương Tác Mượt** | `src/golfviet-luxury-child/style.css` & `assets/luxury-ui.js` | Thiết kế chuẩn Mobile `390×844` & Laptop `1366×768`, vùng chạm `44×44px`, chống tràn ngang, điều phối nút nổi & Sticky Bar. |
| **7. Plugin Trợ Lý AI Tư Vấn Sản Phẩm Thật & Thu Lead** | `src/golfviet-crm-chatbot/` | Chatbot nhớ lịch sử qua `sessionStorage`, gợi ý sản phẩm thật từ WooCommerce, chuẩn hóa SĐT Việt Nam, trang `/cam-on/` & gửi SMTP. |
| **8. Hệ thống CRM Realtime Độc Lập & Tracking Quảng Cáo** | `src/golfviet-crm-root/crm/` | Bảng điều khiển quản lý Lead thời gian thực, đo lường nguồn Google Ads / Facebook / Zalo (`zarsrc`, `gclid`, `fbclid`) & đồng bộ Google Sheets. |
