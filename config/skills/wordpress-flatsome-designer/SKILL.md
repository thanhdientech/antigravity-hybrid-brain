---
name: wordpress-flatsome-designer
description: "Thiết kế web WordPress Flatsome 3.x, Shop bán hàng, Giỏ hàng, Dịch vụ, Báo giá VIP, CRM, Tốc độ, SEO & 80 QA Checklist."
group: "Marketing, Web & SEO"
---

# WordPress Flatsome Designer & Developer Skill

<!-- JAVIS_TRIGGER_ARCHIVE_START -->
## Khi nào dùng (Triggers & Ngữ cảnh kích hoạt đầy đủ)

> Thiết kế, xây dựng, nâng cấp và kiểm toán website WordPress sử dụng theme Flatsome 3.x và UX Builder. Hỗ trợ tạo cấu trúc Shortcodes UX Builder chuẩn xác 100%, cấu hình responsive, viết mã Child Theme (`functions.php`, `style.css`, `archive.php`, `content-single.php`), thiết kế **(1) Website Thương mại Dịch vụ & Tư vấn B2B không có giỏ hàng** VÀ **(2) Website Thương mại Dịch vụ – Cửa hàng (Shop) có bán hàng, có giỏ hàng (Cart/Checkout), có sản phẩm niêm yết giá song song sản phẩm Báo giá VIP (`0₫`) & Dịch vụ đặt lịch**, bộ lọc thông minh (`URL-as-State`), hộp thoại Mua Nhanh 1 bước (`Quick-Buy Modal`), Trợ lý AI bán hàng nhớ lịch sử (`sessionStorage`) + Mini-CRM Realtime (`/crm/`), tối ưu tốc độ WP Rocket + khóa chống lỗi tự tải file `.html_gzip` trên LiteSpeed/OpenLiteSpeed, SEO/GEO (`6 lớp Schema JSON-LD`, `llms.txt`) và kiểm toán 80 tiêu chí QA trước khi bàn giao.
> TRIGGERS: "flatsome", "ux builder", "wordpress flatsome", "web thương mại dịch vụ", "web thuong mai dich vu", "web bán hàng có giỏ hàng", "web ban hang co gio hang", "web có shop có giá", "web co shop co gia", "web dịch vụ không bán hàng", "web tư vấn b2b", "web công ty luật", "qa checklist web dịch vụ", "qa checklist web bán hàng", "qa checklist ecommerce", "bộ lọc thông minh woocommerce", "mua nhanh 1 chạm", "sản phẩm báo giá vip", "mini crm wordpress", "chống lỗi html_gzip wp rocket", "strip_ols_incompatible_gzip_rewrite".
<!-- JAVIS_TRIGGER_ARCHIVE_END -->

Kỹ năng chuyên sâu dành cho AI Agent trong việc thiết kế giao diện, lập trình tùy biến và tối ưu hóa website WordPress vận hành trên **Flatsome Theme** và công cụ **UX Builder**.

## 0. Bảng Điều Phối Tài Liệu Chuyên Sâu (`references/`)

| Hạng Mục Thực Thi | Tệp Tham Chiếu Chi Tiết | Nội Dung Cốt Lõi |
| :--- | :--- | :--- |
| **Playbook & 75 Tiêu Chí QA Web Thương Mại Dịch Vụ – B2B (Không Giỏ Hàng)** | [`references/01-b2b-service-leadgen-crm-speed-seo-qa-playbook.md`](./references/01-b2b-service-leadgen-crm-speed-seo-qa-playbook.md) | Kiến trúc No-Cart Service Website, chia ô cân đối chiều cao (`Equal-Height Grid`), 7 chốt chặn UI/UX Mobile & Desktop, cấu hình WP Rocket + khóa chống lỗi download `.html_gzip` LiteSpeed, SEO/GEO (`llms.txt`) & Mini-CRM (`/crm/`). |
| **Đại Từ Điển 120+ Tiêu Chí QA Web B2B / Thương Mại – Dịch Vụ Có Trang Sản Phẩm Trưng Bày (Catalog Showcase Không Giỏ Hàng + CRM + Chatbot 3 Tầng)** | [`references/02-b2b-catalog-showcase-crm-chatbot-qa-master.md`](./references/02-b2b-catalog-showcase-crm-chatbot-qa-master.md) | Kiến trúc 6 lớp cho Website có trang Sản phẩm/Danh mục trưng bày nhưng không bán lẻ trực tiếp: Báo giá nhanh `0ms` (`Zero-AJAX`), Tìm kiếm chính xác 3 tầng trọng số (`Precision Search`), Bộ lọc không điểm chết (`Zero-Dead-End Fallback`), Mobile Instant-Nav + Khóa `.html_gzip` OpenLiteSpeed/Tadu WAF, Chatbot 3 tầng & Web CRM chống Click Tặc. |
| **Master Blueprint & 80 Tiêu Chí QA Web Thương Mại Dịch Vụ Có Bán Hàng, Có Shop, Có Giỏ Hàng, Có Giá & CRM (`v2.5.2`)** | [`references/02-ecommerce-shop-cart-service-crm-qa-checklist.md`](./references/02-ecommerce-shop-cart-service-crm-qa-checklist.md) | Kiến trúc Hybrid Catalog (Hàng có giá + Hàng báo giá VIP `0₫` + Gói dịch vụ đặt lịch), Smart Filter (`URL-as-State` & `$wp_the_query`), 1-Click Quick-Buy Modal, Checkout rút gọn VN, UI/UX Mobile `390×844` & Laptop `1366×768`, WP Rocket + OpenLiteSpeed `.html_gzip` Guard, 6 lớp Schema JSON-LD, Chatbot AI (`sessionStorage`) & CRM Realtime. |

---

## 1. Nguyên Tắc Cốt Lõi: UX Builder Shortcode Architecture

Flatsome lưu trữ toàn bộ bố cục trang dưới dạng cây Shortcodes trong nội dung bài viết/trang (`post_content`). Khi sinh giao diện cho Flatsome:

> [!IMPORTANT]
> **Tuyệt đối không dùng mã HTML/CSS tự do thuần túy cho các khối giao diện chính**. Phải luôn sử dụng cấu trúc Shortcodes nguyên bản của Flatsome UX Builder để đảm bảo:
> 1. Người dùng có thể mở trực tiếp trong visual UX Builder để kéo thả chỉnh sửa.
> 2. Đạt chuẩn hiển thị Responsive (Desktop, Tablet, Mobile) của Flatsome.
> 3. Kế thừa toàn bộ hệ thống màu sắc, typography và Theme Options đã cấu hình.

---

## 2. Từ Điển Shortcodes UX Builder Nòng Cốt (Flatsome 3.20.x Core)

### 2.1. Cấu Trúc Khung Bố Cục (Layout Foundation)

```text
[section bg="URL" bg_color="#HEX" bg_overlay="rgba(0,0,0,0.5)" dark="true|false" padding="60px"]
  [row col_bg="" col_bg_radius="" width="full-width|custom" v_align="top|middle|bottom"]
    [col span="12" span__sm="12" span__md="6" align="left|center|right" animate="fadeInUp"]
      <!-- Content Elements -->
    [/col]
  [/row]
[/section]
```

* **`[section]`**: Khối bao phủ toàn chiều rộng (Full width section).
  * `bg`: Link ảnh nền.
  * `bg_color`: Mã màu nền HEX hoặc tên màu class Flatsome (`primary`, `secondary`, `alert`, `success`).
  * `bg_overlay`: Lớp phủ màu mờ trên ảnh nền (vd: `rgba(0,0,0,0.6)`).
  * `dark`: `true` nếu nền tối (chữ sẽ tự động đổi sang màu trắng), `false` nếu nền sáng.
  * `padding`: Khoảng cách đệm trong (vd: `60px`, `80px 0px`).
  * `parallax`: Tốc độ cuộn parallax (vd: `0` đến `10`).

* **`[row]`**: Hàng chứa các cột (Hệ lưới 12 cột chuẩn).
  * `width`: `full-width` (tràn viền) hoặc `custom` (mặc định theo container).
  * `v_align`: Canh gióng theo chiều dọc: `top`, `middle`, `bottom`, `equal-height`.
  * `col_bg`: Màu nền cho toàn bộ cột trong hàng.
  * `col_bg_radius`: Bo góc (vd: `8px`, `16px`).

* **`[col]`**: Cột hiển thị nội dung.
  * `span`: Số cột trên Desktop (tổng 12, vd: `4` cho hàng 3 cột, `6` cho hàng 2 cột).
  * `span__md`: Số cột trên Tablet (màn hình vừa).
  * `span__sm`: Số cột trên Mobile (thường là `12` để rớt dòng tự nhiên).
  * `align`: Canh lề chữ: `left`, `center`, `right`.
  * `animate`: Hiệu ứng xuất hiện: `fadeIn`, `fadeInUp`, `fadeInDown`, `fadeInLeft`, `fadeInRight`, `bounceIn`.

---

### 2.2. Khối Hero & Trình Chiếu Đa Phương Tiện (Hero & Media)

* **`[ux_banner]`**: Khối banner ấn tượng thường đặt ở đầu trang hoặc section CTA.
  ```text
  [ux_banner height="550px" height__sm="400px" bg="URL" bg_overlay="rgba(0,0,0,0.4)" bg_pos="50% 50%" parallax="0" effect="snow|sparkle"]
    [text_box width="60" width__sm="90" position_x="50" position_y="50" align="center" animate="fadeInUp"]
      <h1 class="uppercase">TIÊU ĐỀ HERO</h1>
      <p class="lead">Mô tả phụ ngắn gọn, cuốn hút</p>
      [button text="KHÁM PHÁ NGAY" color="primary" style="bevel|shade|outline" size="medium" link="#"]
    [/text_box]
  [/ux_banner]
  ```

* **`[ux_slider]`**: Trình chiếu trượt mượt mà (Carousels/Sliders).
  ```text
  [ux_slider nav_style="simple|circle|reveal" bullets="true" auto_slide="true" timer="5000"]
    <!-- Các khối ux_banner hoặc col đặt bên trong -->
  [/ux_slider]
  ```

* **`[ux_image]`**: Hiển thị hình ảnh chuẩn responsive với hover effects.
  ```text
  [ux_image id="ID_ANH" width="100" height="300px" depth="1" depth_hover="3" link="URL" lightbox="true" image_hover="zoom|fade|glow"]
  ```

* **`[ux_video]`**: Nhúng video YouTube / Vimeo / MP4 full width hoặc dạng popup.
  ```text
  [ux_video url="https://youtube.com/watch?v=..." height="56.25%"]
  ```

---

### 2.3. Khối Nội Dung & Tương Tác (Content & Interactive)

* **`[title]`**: Tiêu đề phân đoạn với phong cách Flatsome.
  ```text
  [title style="bold|center|bold-center|line-solid|line-double" text="TIÊU ĐỀ KHỐI" tag_name="h2" size="130" link="#" link_text="Xem thêm"]
  ```

* **`[featured_box]`**: Khối hộp tính năng kết hợp Icon + Tiêu đề + Nội dung (Rất thích hợp cho phần thông số kỹ thuật, ưu điểm xe).
  ```text
  [featured_box img="URL_ICON" pos="top|left|right" title="Tên Tính Năng" title_small="Ghi chú" margin="0px 0px 30px 0px"]
    Nội dung mô tả chi tiết tính năng xe điện BYD...
  [/featured_box]
  ```

* **`[accordion]` & `[accordion_item]`**: Khối câu hỏi thường gặp (FAQ) hoặc thông số chi tiết thu gọn.
  ```text
  [accordion auto_open="false"]
    [accordion_item title="Pin Blade Battery có tuổi thọ bao lâu?"]
      Nội dung trả lời chi tiết...
    [/accordion_item]
  [/accordion]
  ```

* **`[gap]`**: Khoảng cách khoảng trắng điều chỉnh linh hoạt theo từng thiết bị.
  ```text
  [gap height="30px" height__md="20px" height__sm="15px"]
  ```

* **`[button]`**: Nút kêu gọi hành động với đa dạng style.
  ```text
  [button text="ĐĂNG KÝ LÁI THỬ" style="primary" color="secondary" size="large" radius="99" icon="icon-phone" link="tel:0909000000"]
  ```

---

### 2.4. Khối Sản Phẩm & Tin Tức (Showroom, Products & News)

* **`[ux_products]`**: Trưng bày lưới danh sách sản phẩm xe/phụ kiện WooCommerce.
  ```text
  [ux_products col_spacing="normal" columns="3" columns__sm="1" type="grid|slider|row" orderby="menu_order" order="ASC" cat="xe-sedan,xe-suv" show_rating="false" out_of_stock="exclude"]
  ```

* **`[blog_posts]`**: Lưới bài viết tin tức, sự kiện, đánh giá xe.
  ```text
  [blog_posts type="row" columns="3" columns__sm="1" posts="3" readmore="Xem chi tiết" readmore_style="link" show_date="true" excerpt_length="15"]
  ```

---

## 3. Hệ Thống Hook & Tùy Biến Flatsome Child Theme

Để can thiệp giao diện và logic mà không bị ghi đè khi cập nhật Flatsome, luôn viết vào `flatsome-child/functions.php`:

### 3.1. Các Action Hooks Thông Dụng Trong Flatsome
* `flatsome_before_header`: Chèn topbar thông báo khuyến mãi, hotline.
* `flatsome_after_header`: Chèn banner động dưới menu chính.
* `flatsome_before_page`: Chèn breadcrumb hoặc notification đầu trang.
* `flatsome_after_page`: Chèn form đăng ký tư vấn / CTA trước chân trang.
* `flatsome_before_footer`: Chèn bản đồ showroom, chính sách cam kết.
* `flatsome_after_footer`: Chèn mã tracking, hotline nổi (Zalo, Phone bubble).

### 3.2. Đăng Ký Thêm Custom UX Builder Element
Trong `functions.php` của `flatsome-child`, sử dụng hàm `add_ux_builder_shortcode`:
```php
add_action('ux_builder_setup', function() {
    add_ux_builder_shortcode('byd_spec_box', array(
        'name'      => __('BYD Car Spec Box', 'flatsome'),
        'category'  => __('Xe Điện BYD', 'flatsome'),
        'priority'  => 10,
        'options'   => array(
            'acceleration' => array(
                'type'    => 'textfield',
                'heading' => 'Tăng tốc 0-100km/h',
                'default' => '3.8s',
            ),
            'range' => array(
                'type'    => 'textfield',
                'heading' => 'Quãng đường (km)',
                'default' => '570 km',
            ),
            'battery' => array(
                'type'    => 'textfield',
                'heading' => 'Dung lượng pin',
                'default' => '82.5 kWh',
            ),
        ),
    ));
});
```

---

## 4. Mẫu Thiết Kế Mẫu: Showroom Xe Điện BYD (BYD Electric Vehicles)

### 4.1. Khối Hero Trang Chủ (Flagship BYD Seal / Han)
```text
[section bg_color="#0b0f19" dark="true" padding="0px"]
  [ux_banner height="680px" height__sm="450px" bg_overlay="rgba(0,0,0,0.35)" position_x="50" position_y="50"]
    [text_box width="70" width__sm="95" position_x="50" position_y="65" align="center" animate="fadeInUp"]
      <span class="badge" style="background:#00d2c4;color:#0b0f19;padding:6px 14px;border-radius:20px;font-weight:700;letter-spacing:1px;">FLAGSHIP SEDAN</span>
      [gap height="15px"]
      <h1 style="font-size:3.2rem;font-weight:800;letter-spacing:2px;margin-bottom:10px;">BYD SEAL — THUẦN ĐIỆN ĐẲNG CẤP</h1>
      <p style="font-size:1.25rem;color:#cbd5e1;max-width:650px;margin:0 auto 25px auto;">Trang bị công nghệ CTB (Cell-to-Body) và Pin Blade Battery trứ danh. Tăng tốc 0-100 km/h chỉ trong 3.8 giây.</p>
      [row]
        [col span="4" span__sm="4"]
          <h3 style="color:#00d2c4;font-size:1.8rem;margin:0;">3.8s</h3>
          <span style="font-size:0.85rem;color:#94a3b8;">0-100 km/h</span>
        [/col]
        [col span="4" span__sm="4"]
          <h3 style="color:#00d2c4;font-size:1.8rem;margin:0;">570 km</h3>
          <span style="font-size:0.85rem;color:#94a3b8;">Quãng đường NEDC</span>
        [/col]
        [col span="4" span__sm="4"]
          <h3 style="color:#00d2c4;font-size:1.8rem;margin:0;">82.5 kWh</h3>
          <span style="font-size:0.85rem;color:#94a3b8;">Pin Blade Siêu An Toàn</span>
        [/col]
      [/row]
      [gap height="25px"]
      [button text="ĐĂNG KÝ LÁI THỬ NGAY" color="primary" style="shade" size="large" radius="99" link="#dang-ky-lai-thu"]
      [button text="XEM BẢNG GIÁ LĂN BÁNH" color="white" style="outline" size="large" radius="99" link="#bang-gia"]
    [/text_box]
  [/ux_banner]
[/section]
```

### 4.2. Khối 4 Trụ Cột Công Nghệ BYD (Blade Battery, e-Platform 3.0, DiPilot, DiLink)
```text
[section bg_color="#f8fafc" padding="60px 0px"]
  [title style="bold-center" text="CÔNG NGHỆ DẪN ĐẦU KỶ NGUYÊN ĐIỆN HÓA" tag_name="h2" size="140"]
  [row col_bg="#ffffff" col_bg_radius="12" v_align="equal-height"]
    [col span="3" span__md="6" span__sm="12" animate="fadeInUp"]
      [featured_box title="Pin Blade Battery" margin="20px"]
        Cấu trúc dạng thanh kiếm chống đâm xuyên, chịu nhiệt độ cao vượt trội, vượt qua thử nghiệm đinh xuyên kim loại khắt khe nhất thế giới xe điện.
      [/featured_box]
    [/col]
    [col span="3" span__md="6" span__sm="12" animate="fadeInUp"]
      [featured_box title="e-Platform 3.0" margin="20px"]
        Khung gầm thuần điện thế hệ mới tích hợp hệ thống truyền động điện 8-trong-1, tối ưu hóa không gian cabin và hiệu suất tiêu thụ năng lượng.
      [/featured_box]
    [/col]
    [col span="3" span__md="6" span__sm="12" animate="fadeInUp"]
      [featured_box title="DiPilot ADAS" margin="20px"]
        Hệ thống hỗ trợ lái thông minh cấp độ 2+ với camera 360 độ độ phân giải cao, radar sóng milimet, tự động giữ làn và phanh khẩn cấp.
      [/featured_box]
    [/col]
    [col span="3" span__md="6" span__sm="12" animate="fadeInUp"]
      [featured_box title="DiLink Cockpit" margin="20px"]
        Màn hình giải trí xoay 15.6 inch 8 nhân Snapdragon, điều khiển giọng nói đa vùng thông minh và kết nối 4G/5G OTA liên tục.
      [/featured_box]
    [/col]
  [/row]
[/section]
```

### 4.3. Form Kêu Gọi Đăng Ký Lái Thử & Báo Giá (Lead Generation)
```text
[section bg_color="#0f172a" dark="true" padding="60px 0px" id="dang-ky-lai-thu"]
  [row v_align="middle"]
    [col span="6" span__sm="12"]
      <h2 style="font-size:2.2rem;font-weight:700;">TRẢI NGHIỆM LÁI THỬ XE ĐIỆN BYD MIỄN PHÍ</h2>
      <p style="color:#94a3b8;font-size:1.1rem;">Khám phá cảm giác tăng tốc êm ái, tĩnh lặng tuyệt đối và công nghệ trợ lái thông minh của BYD ngay tại showroom hoặc tại nhà bạn.</p>
      <ul style="color:#cbd5e1;line-height:2;">
        <li>✓ Xe lái thử luôn sẵn sàng (BYD Seal, Atto 3, Dolphin)</li>
        <li>✓ Chuyên viên tư vấn kỹ thuật tận tâm 24/7</li>
        <li>✓ Nhận ngay báo giá lăn bánh kèm ưu đãi sạc điện độc quyền</li>
      </ul>
    [/col]
    [col span="6" span__sm="12" bg_color="#1e293b" radius="16" padding="30px"]
      <h3 style="text-align:center;color:#00d2c4;margin-bottom:20px;">ĐĂNG KÝ NHẬN TƯ VẤN & BÁO GIÁ</h3>
      [contact-form-7 id="CF7_ID" title="Form Lái Thử BYD"]
    [/col]
  [/row]
[/section]
```
