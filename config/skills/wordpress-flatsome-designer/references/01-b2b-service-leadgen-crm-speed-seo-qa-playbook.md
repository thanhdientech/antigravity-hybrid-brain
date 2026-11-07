# Sổ Tay Kiểm Toán Chất Lượng (Master QA Checklist 80 Tiêu Chí) & Chống Lặp Lại Lỗi Cho Dự Án Website Thương Mại Dịch Vụ – Tư Vấn B2B (Không Giỏ Hàng)

> **Mục đích sử dụng:** Bộ tiêu chí kiểm toán (`QA Checklist`) tổng hợp toàn bộ các lỗi thực tế dễ mắc phải về **Thiết kế chia ô, Cân đối bố cục, Tràn Form, Logic UI/UX Điện thoại & Máy tính, Cấu hình WP Rocket, Lỗi tự tải file `.html_gzip` trên LiteSpeed/OpenLiteSpeed, SEO/AI Search và Mini-CRM** để áp dụng cho mọi dự án **Website Thương Mại Dịch Vụ & Tư Vấn (Không Có Giỏ Hàng Bán Lẻ)** tiếp theo, đảm bảo **làm đúng ngay từ đầu – không lặp lại sai sót**.

---

## 1. Nhóm 1: Thiết Kế Giao Diện, Chia Ô Bo Viền & Cân Đối Chiều Cao (`Visual & Layout QA`)

### ❌ Lỗi 1.1: Trang danh mục Tin tức (`/category/tin-tuc/`) không chia ô, không có bo viền, bố cục rời rạc
- **Biểu hiện lỗi:** Giao diện mặc định của theme hiển thị danh sách bài viết chỉ gồm ảnh và chữ thả nổi trên nền trắng, không phân tách từng bài thành ô thẻ (`Card`), tiêu đề dài ngắn làm các hàng bị xô lệch và thiếu bộ lọc chuyên mục.
- **✅ Quy chuẩn bắt buộc làm ngay từ đầu (`archive.php` + `style.css`):**
  - Thiết kế trang chuyên mục dạng **Lưới Thẻ Chia Ô Có Bo Viền (`Bento Card Grid`)**: `3 cột` trên Desktop (`>= 1024px`), `2 cột` trên Tablet (`768px–1023px`), `1 cột` trên Mobile (`< 768px`).
  - Mỗi thẻ bài viết phải có khung viền rõ ràng (`border: 1px solid #e2e8f0`), bo góc (`border-radius: 14px–16px`), nền trắng (`#ffffff`), đổ bóng tinh tế (`box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06)`) và hiệu ứng nổi nhẹ khi di chuột (`transform: translateY(-4px)`).
  - Tích hợp thanh công cụ phía trên lưới bài viết gồm: **Các nút lọc nhanh chuyên mục (`Category Pills`)** + **Ô tìm kiếm bài viết trực tiếp**.

### ❌ Lỗi 1.2: Hai ô / hai cột đặt cạnh nhau bị mất cân đối chiều cao (ô cao, ô thấp)
- **Biểu hiện lỗi:**
  1. Ở các khối chia 2 cột cạnh nhau (ví dụ: Cột *"Lý do chọn chúng tôi"* đặt cạnh Cột *"Form đăng ký tư vấn"*, hoặc các ô *"Giá trị cốt lõi"*), một bên nhiều nội dung hơn làm khung viền bên cao bên thấp rất mất thẩm mỹ.
  2. Trong lưới thẻ Dịch vụ / Tin tức, bài có tiêu đề 1 dòng nằm cạnh bài có tiêu đề 3 dòng làm nút `"Xem chi tiết →"` ở đáy thẻ nhảy lên xuống không thẳng hàng.
- **✅ Quy chuẩn CSS bắt buộc khóa cứng ngay từ đầu:**
  ```css
  /* 1. Khóa cân đối chiều cao tuyệt đối cho các cột đặt cạnh nhau */
  .svc-equal-row {
    display: flex;
    flex-wrap: wrap;
    align-items: stretch !important;
  }
  .svc-equal-row > .col {
    display: flex;
    flex-direction: column;
  }
  .svc-equal-row > .col > .col-inner {
    flex: 1 1 auto;
    height: 100% !important;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 16px;
    border: 1px solid rgba(15, 23, 42, 0.12);
    box-shadow: 0 12px 32px rgba(15, 23, 42, 0.07);
  }

  /* 2. Khóa chiều cao tiêu đề, mô tả và ép chân thẻ thẳng hàng ngang ở đáy */
  .svc-card {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    overflow: hidden;
  }
  .svc-card-body {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    padding: 22px 24px 20px;
  }
  .svc-card-title {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 2.8em;
  }
  .svc-card-excerpt {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-bottom: 16px;
  }
  .svc-card-footer {
    margin-top: auto; /* Luôn đẩy nút "Xem chi tiết ->" xuống sát đáy thẻ */
    padding-top: 14px;
    border-top: 1px solid #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  ```

### ❌ Lỗi 1.3: Khoảng trắng rỗng ở đầu bài viết cũ & Mất ảnh do dính tên miền Demo cũ
- **Biểu hiện lỗi:**
  1. Template `entry-header.php` để sẵn thẻ `<div class="entry-image relative"></div>` ngay cả khi bài viết không cài đặt Ảnh đại diện (`Featured Image`), tạo ra một khoảng trống lớn vô duyên dưới tiêu đề bài viết.
  2. Khi nâng cấp từ web cũ, trong nội dung bài viết (`post_content`) còn sót các thẻ `<img src="...">` trỏ về tên miền demo cũ đã chết làm ảnh bị vỡ.
  3. Trong trang danh mục (`archive.php`), bài viết cũ không gán `Featured Image` làm ô thẻ bị khuyết mất phần ảnh.
- **✅ Quy chuẩn xử lý triệt để ngay từ đầu:**
  - Trong `entry-header.php`: Chỉ xuất `<div class="entry-image">` khi `has_post_thumbnail()` trả về `true`.
  - Trong `archive.php`: Nếu bài viết không có `has_post_thumbnail()`, tự động quét lấy ảnh `<img>` đầu tiên trong `$post->post_content`; nếu bài hoàn toàn không có ảnh thì hiển thị **Khung Đồ Họa Thương Hiệu Mặc Định (`Branded Fallback Thumbnail`)**.
  - Trong `functions.php`: Dùng filter `the_content` tự động thay thế mọi tên miền demo/cũ về `content_url('/uploads/')` hiện tại.

---

## 2. Nhóm 2: Chống Tràn Form & Logic UI/UX Trên Điện Thoại – Máy Tính (`Cross-Device UI/UX Logic QA`)

### ❌ Lỗi 2.1: Form đăng ký tư vấn bị tràn khung (`Form Overflow`)
- **Biểu hiện lỗi:** Ô `<select>` chứa tên dịch vụ dài làm phình chiều ngang thẻ `<form>` vượt ra ngoài khung chứa, hoặc chia 2 cột (`Họ tên` + `Số điện thoại`) trong một cột hẹp làm chữ và viền ô nhập bị cắt mất.
- **✅ Quy chuẩn CSS khóa chống tràn Form tuyệt đối:**
  ```css
  .wpcf7, .wpcf7-form, .svc-form-grid, .svc-form-col {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    box-sizing: border-box !important;
  }
  .wpcf7-form input[type="text"],
  .wpcf7-form input[type="tel"],
  .wpcf7-form input[type="email"],
  .wpcf7-form select,
  .wpcf7-form textarea {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    box-sizing: border-box !important;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .medium-6 .svc-form-grid,
  .large-6 .svc-form-grid {
    grid-template-columns: 1fr !important;
  }
  @media (max-width: 991px) {
    .svc-form-grid {
      grid-template-columns: 1fr !important;
    }
  }
  ```

### ❌ Lỗi 2.2: Các nút nổi trên Mobile (Bottom Dock, Chatbot, Modal) đè chồng lên nhau
- **✅ Quy chuẩn phân tầng `z-index` và tự động ẩn nút nổi khi mở Modal/Chat:**
  - Trên `@media (max-width: 767px)`, đặt `body { padding-bottom: 76px !important; }` để thanh Dock không bao giờ che nội dung cuối trang.
  - Khi `body` có class `.svc-modal-open` (đang mở Hộp thoại Đặt lịch), tự động ẩn cả Thanh Dock Mobile và Nút Chatbot (`opacity: 0; pointer-events: none;`) và đặt `z-index` của Modal ở tầng cao nhất (`100005`).
  - Khi cửa sổ Chatbot đang mở (`.svc-chat-is-open`), tự động đẩy khung Chat nằm phía trên Thanh Dock (`bottom: 74px`) để không che mất thanh điều hướng dưới đáy.

### ❌ Lỗi 2.3: iPhone (iOS Safari) tự động phóng to màn hình (`Auto-Zoom`) khi bấm vào ô nhập
- **✅ Quy chuẩn bắt buộc:** Trên `@media (max-width: 768px)`, **100% thẻ `<input>`, `<select>`, `<textarea>`** (bao gồm cả ô tìm kiếm và ô nhập Chatbot) bắt buộc khai báo **`font-size: 16px !important`**.

### ❌ Lỗi 2.4: Nút Menu Mobile (3 gạch) quá nhỏ và mờ, khách hàng khó tìm thấy
- **✅ Quy chuẩn bắt buộc:** Đóng khung nút Menu trên Header Mobile đạt kích thước chạm tối thiểu **`40x40px – 44x44px`**, có viền màu nhấn thương hiệu và hiển thị nhãn chữ **`MENU`** rõ ràng bên cạnh icon 3 gạch.

### ❌ Lỗi 2.5: Bài viết Tin tức là "Ngõ cụt chuyển đổi" & Còn sót chữ tiếng Anh của Theme
- **✅ Quy chuẩn bắt buộc (`content-single.php` & `entry-title.php`):**
  - Việt hóa 100% toàn bộ chuỗi hiển thị trên bài viết và khung tìm kiếm (`"Bởi ..."`, `"Chưa có bình luận"`, `"Tìm kiếm bài viết..."`).
  - Tự động chèn **Khung Đặt Lịch Tư Vấn Trực Tiếp (`.svc-post-cta-card`)** (gồm nút mở Modal Đặt lịch + nút Gọi Hotline) và **Lưới 3 Bài Viết Liên Quan Cùng Chuyên Mục** ngay dưới nội dung mọi bài viết.

### ❌ Lỗi 2.6: Tìm kiếm không có kết quả chỉ báo 1 dòng cụt lủn & Form thiếu cam kết bảo mật
- **✅ Quy chuẩn bắt buộc:**
  - Khi tìm kiếm Tin tức không có kết quả (`Empty Search State`), hiển thị ngay 2 nút hành động: *(1) Xem tất cả bài viết* và *(2) Đặt câu hỏi trực tiếp cho chuyên gia*.
  - Ngay dưới nút Gửi (`Submit`) của mọi Form tư vấn, tự động chèn dòng cam kết: `🔒 Thông tin được bảo mật tuyệt đối 100% theo Nghị định 13/2023/NĐ-CP & phản hồi trong 15 phút`.

---

## 3. Nhóm 3: Tốc Độ, Cấu Hình WP Rocket & Khóa Chống Lỗi Download `.html_gzip` (`Speed & Server QA`)

### ❌ Lỗi 3.1: Chỉ cài đặt plugin WP Rocket mà chưa nạp cấu hình tối ưu thực chiến
- **✅ Quy chuẩn cấu hình bắt buộc (`wp_rocket_settings`):**
  - `cache_mobile = 1`, `do_caching_mobile_files = 0` (Dùng chung 1 bản cache responsive cho cả Desktop & Mobile).
  - `minify_css = 1`, `minify_js = 1`, `minify_concatenate_js = 1`, `defer_all_js = 1`, `exclude_defer_js = array()`.
  - `lazyload = 1`, nhưng loại trừ (`exclude_lazyload`) logo và các ảnh có class `skip-lazy`.
  - Gọi `rocket_generate_config_file()`, `rocket_clean_domain()` và chạy script tự động truy cập nạp ấm (`Warmup`) toàn bộ các trang sau mỗi lần triển khai.

### ❌ Lỗi 3.2: Lỗi nghiêm trọng vào web chỉ hiện cửa sổ tải file `download` (`.html_gzip`) trên LiteSpeed / OpenLiteSpeed
- **Nguyên nhân gốc:** Mặc định WP Rocket tạo file `index-https.html_gzip` và ghi quy tắc `AddType text/html .html_gzip` + `AddEncoding gzip .html_gzip` + `RewriteRule .* - [E=WPR_ENC:_gzip]` vào `.htaccess`. Trên máy chủ **OpenLiteSpeed / LiteSpeed** hoặc qua lớp Reverse Proxy/WAF, Web Server thường bỏ qua chỉ thị `AddEncoding` cho đuôi `.html_gzip`, dẫn tới việc trình duyệt nhận luồng byte nhị phân và **bật ngay hộp thoại tải file (`download`) thay vì hiển thị trang web!**
- **✅ Giải pháp khóa vĩnh viễn bắt buộc có trong `functions.php` của mọi dự án:**
  ```php
  add_filter( 'rocket_force_gzip_htaccess_rules', '__return_false', 99 );
  add_filter( 'rocket_htaccess_mod_rewrite', 'strip_ols_incompatible_gzip_rewrite', 99 );
  add_filter( 'rocket_htaccess_marker', 'strip_ols_incompatible_gzip_rewrite', 99 );

  function strip_ols_incompatible_gzip_rewrite( $rules ) {
      if ( ! is_string( $rules ) || '' === $rules ) {
          return $rules;
      }
      $rules = preg_replace( '#<IfModule\s+mod_mime\.c>\s*AddType\s+text/html\s+\.html_gzip\s*AddEncoding\s+gzip\s+\.html_gzip\s*</IfModule>\s*#is', '', $rules );
      $rules = preg_replace( '#<IfModule\s+mod_setenvif\.c>\s*SetEnvIfNoCase\s+Request_URI\s+\\\\\.html_gzip\$\s+no-gzip\s*</IfModule>\s*#is', '', $rules );
      $rules = preg_replace( '#RewriteCond\s+%\{HTTP:Accept-Encoding\}\s+gzip\s+RewriteRule\s+\.\*\s+-\s+\[E=WPR_ENC:_gzip\]\s*#i', '', $rules );
      $rules = str_replace( array( '.html%{ENV:WPR_ENC}', '.html_gzip' ), '.html', $rules );
      $rules = str_replace( '%{HTTP_HOST}/staging%{REQUEST_URI}', '%{HTTP_HOST}%{REQUEST_URI}', $rules );
      return $rules;
  }

  add_action( 'init', 'svc_self_heal_htaccess_gzip_rules', 20 );
  function svc_self_heal_htaccess_gzip_rules() {
      $htaccess_file = ABSPATH . '.htaccess';
      if ( ! is_file( $htaccess_file ) || ! is_writable( $htaccess_file ) ) {
          return;
      }
      $content = @file_get_contents( $htaccess_file );
      if ( false !== $content && ( strpos( $content, '.html_gzip' ) !== false || strpos( $content, 'WPR_ENC:_gzip' ) !== false || strpos( $content, '%{HTTP_HOST}/staging%{REQUEST_URI}' ) !== false ) ) {
          $healed = strip_ols_incompatible_gzip_rewrite( $content );
          if ( $healed !== $content ) {
              @file_put_contents( $htaccess_file, $healed, LOCK_EX );
          }
      }
  }
  ```

### ❌ Lỗi 3.3: Bật `delay_js` làm điện thoại bị đơ lần chạm đầu & Xung đột 2 bộ LazyLoad làm mất ảnh
- **✅ Quy chuẩn bắt buộc trong `functions.php`:**
  - Tắt `delay_js = 0` và tắt `wpr-beacon.min.js` (`rocket_above_the_fold_optimization = false`, `rocket_lazy_render_content = false`).
  - Gỡ `flatsome-lazy-load` (`wp_dequeue_script('flatsome-lazy-load')`) để tránh xung đột với WP Rocket LazyLoad làm ảnh bài viết bị ẩn `opacity: 0`.
  - Gắn `loading="eager" fetchpriority="high" decoding="async" class="skip-lazy"` cho **Logo Header, Ảnh Banner Hero đầu trang và Ảnh đầu tiên trong bài viết**.

### ❌ Lỗi 3.4: Khách mở web từ ứng dụng Zalo / TikTok bị chậm (`TTFB > 3,000ms`)
- **✅ Quy chuẩn bắt buộc:** Thêm bộ lọc `rocket_cache_ignored_parameters` cho `zarsrc`, `zl3rd`, `zalo`, `ttclid`, `igshid`, `si` để khách bấm link từ Zalo/TikTok luôn trúng thẳng Cache tĩnh (`15–30ms`).

---

## 4. Nhóm 4, 5 & 6: Logic Nghiệp Vụ Không Bán Hàng, SEO/GEO (`llms.txt`) & Mini-CRM (`/crm/`)

- **Gỡ sạch thành phần Giỏ hàng (`Cart`) & Làm đầy trang Dịch vụ:** Xóa icon Giỏ hàng, trang `Shop/Cart/Checkout` thừa; mỗi trang dịch vụ trên Menu phải có tối thiểu `800–1,500` từ (Tổng quan, Phạm vi công việc, Hồ sơ cần chuẩn bị, Quy trình thực hiện, FAQ `Accordion` và Form tư vấn riêng).
- **Chuẩn hóa Liên hệ & Pháp nhân:** `tel:` không chứa dấu chấm/khoảng trắng, `mailto:` có email thật (cấm `mailto:#`), thông tin pháp nhân đồng nhất 100% trên toàn trang.
- **SEO Kỹ thuật & AI Search / GEO:** Khóa `wp_robots` trả về `index, follow` cho trang công khai và `noindex, follow` cho `/cam-on/`, `?s=`, `404`; tắt `wp-sitemap-users-1.xml`; Redirect `301` trang đính kèm ảnh rác và chuyên mục rỗng (`Soft-404`); dùng Schema JSON-LD `@graph` chuẩn (cấm dùng `Attorney` hay `HowTo` đã deprecated); tạo file `/llms.txt` ở thư mục gốc và gắn `aria-label` cho Logo đạt `Agentic Browsing 2/2 (100%)`.
- **Cổng quản trị Mini-CRM (`/crm/`) & Chatbot AI:** Loại trừ `/crm/(.*)`, `/cam-on/(.*)`, `/api-crm.php` trong `rocket_cache_reject_uri`; thêm `wpcf7_skip_mail` an toàn trên `localhost`; gom mọi Lead từ Form CF7, Modal Đặt lịch và Chatbot AI về bảng DB của `/crm/`; xuất file CSV có gắn mã BOM (`utf-8-sig`) không lỗi font tiếng Việt và bắn thông báo tức thì qua **Telegram Bot + Email SMTP**.
