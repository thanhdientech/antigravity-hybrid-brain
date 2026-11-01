# 02. Kiểm Toán Giao Diện Mobile Web & Đa Khung Hình Responsive (`mobile` — Multi-Viewport & Touch Audit)

> Chưng cất từ `garrytan/gstack` (`Phase 3 Responsive Loop` `375 / 768 / 1440`), `addyosmani/web-quality-skills` (`accessibility` & `core-web-vitals`), và `pbakaus/impeccable` (`audit.md` Section 4 Responsive Design & WCAG 2.2 SC 2.5.8).

---

## 1. Ma Trận 3 Khung Hình Chuẩn Bắt Buộc Khi Kiểm Toán (`Mandatory 3-Viewport Matrix`)

Mọi đợt kiểm toán giao diện Responsive bắt buộc kiểm tra trên đủ **3 điểm gãy thực tế** (không bao giờ chỉ nhìn trên màn hình Desktop rộng rồi đoán Mobile ổn):

| Khung Hình Kiểm Toán | Kích Thước Chuẩn (`CSS px`) | Thiết Bị Đại Diện | Trọng Tâm Bắt Lỗi Chí Mạng |
| :--- | :---: | :--- | :--- |
| **1. Mobile Phổ Thông** | **`375 x 812`** *(và kiểm tra biên `320px` khi cần)* | iPhone SE / Mini / 13–15 dọc, Android tầm trung | Tràn khung ngang (`scrollWidth > 375`), chữ `< 16px` trong `<input>`, vùng chạm `< 44x44px`, thanh Sticky che hết nội dung, bảng rộng làm vỡ layout. |
| **2. Tablet / Màn Hình Gập** | **`768 x 1024`** | iPad dọc, Galaxy Tab, Laptop chia đôi màn hình | Điểm mù hay bị bỏ quên nhất: Sidebar Desktop chưa ẩn đi nhưng vùng nội dung còn lại quá hẹp làm chữ trong Card bị ép dọc thành từng từ một. |
| **3. Desktop Chuẩn** | **`1440 x 900`** *(và kiểm tra `1920px`)* | Laptop 14–16 inch & Màn hình văn phòng | Dòng văn bản đọc kéo dài suốt chiều ngang không giới hạn `max-w` (`> 75–80` ký tự/dòng gây mỏi mắt), khoảng trống vô nghĩa giữa các cột. |

---

## 2. 10 Lỗi Chí Mạng Trên Giao Diện Mobile Cần Quét Sạch (`Top 10 Mobile UI Bugs`)

### 2.1. Tràn Khung Ngang (`Horizontal Scroll Overflow` — `P0`)
- **Đo thực chứng trên DOM:** `document.documentElement.scrollWidth > window.innerWidth`.
- **Thủ phạm phổ biến trong mã nguồn:**
  - Gán chiều rộng cứng `width: 500px`, `min-width: 600px`, `w-[480px]` mà không có `max-w-full`.
  - Dùng `100vw` khi trang có thanh cuộn dọc hoặc phần tử con Flex/Grid chứa chuỗi URL/email/mã đơn dài nhưng thiếu `min-w-0` + `break-words` / `truncate`.
  - Bảng `<table>` nhiều cột không bọc trong khung `overflow-x-auto`.

### 2.2. Khóa Quyền Phóng To Của Người Dùng (`Viewport Zoom Lock` — `P1` / Vi phạm WCAG)
- **Dấu hiệu trong `<meta name="viewport">`:** Có chứa `user-scalable=no`, `user-scalable=0`, hoặc `maximum-scale=1` / `maximum-scale=1.0`.
- **Hậu quả:** Chặn người lớn tuổi hoặc người thị lực kém phóng to chữ để đọc số tài khoản/giá tiền, bị Lighthouse Accessibility trừ điểm nặng.
- **Chuẩn đúng:** `<meta name="viewport" content="width=device-width, initial-scale=1">`.

### 2.3. Bẫy iOS Safari Tự Phóng To Lệch Trang (`Input Font-Size < 16px` — `P1`)
- **Cơ chế lỗi:** Trên mọi iPhone (iOS Safari / WebView TikTok, Facebook, Zalo), bất kỳ thẻ `<input>`, `<select>`, `<textarea>` nào có `font-size` tính toán **`< 16px`** (ví dụ class `text-sm` = `14px` của Tailwind), ngay khi khách chạm vào để gõ số điện thoại, trình duyệt sẽ tự động zoom sát vào ô đó và **không tự thu nhỏ lại**, làm lệch mất nút bấm Gửi đơn ở bên phải!
- **Cách sửa chuẩn:** Luôn ép `text-base` (`16px`) cho mọi ô nhập liệu trên Mobile (`text-base md:text-sm`).

### 2.4. Vùng Chạm Ngón Tay Quá Nhỏ Hoặc Dính Sát Nhau (`Touch Target < 44x44px` — `P1`)
- **Tiêu chuẩn kép:**
  - **Chuẩn Apple HIG / Google Material / Lighthouse SEO:** Vùng chạm tương tác (`<a>`, `<button>`, icon đóng `×`, ô checkbox, phân trang) đạt tối thiểu **`44 x 44 CSS px`** (hoặc `48 x 48 px`) với khoảng hở giữa 2 nút liền kề `>= 8px`.
  - **Mức sàn pháp lý WCAG 2.2 AA (`SC 2.5.8 Target Size Minimum`):** Tuyệt đối không nhỏ hơn **`24 x 24 CSS px`** trừ link nằm giữa câu văn.
- **Cách sửa không làm to icon:** Giữ icon SVG `20px` nhưng tăng vùng đệm chạm bằng `p-3` hoặc lớp giả `after:absolute after:-inset-2`.

### 2.5. Lỗi Chiều Cao `100vh` & Tai Thỏ / Thanh Gạt Đáy (`100vh` & `Safe-Area` Bug — `P1`)
- Trên trình duyệt di động (Safari, Chrome Mobile, In-App Browser của Facebook/TikTok Ads), thanh địa chỉ co giãn làm `100vh` dài hơn khung nhìn thật, che khuất mất nút **"Thanh toán / Đăng ký"** nằm ở đáy Modal hoặc màn hình Chat.
- **Cách sửa chuẩn:** Đổi `100vh` (`h-screen`) thành **`100dvh` (`h-dvh`)** và cộng `padding-bottom: env(safe-area-inset-bottom)` cho mọi thanh Sticky Bottom Bar / Bottom Sheet.

### 2.6. Thanh Sticky Header / Popup / Chat Widget Chiếm Hết Màn Hình (`Viewport Occlusion` — `P1`)
- Trên màn hình `375 x 812`, nếu Header cố định cao `88px` + Banner khuyến mãi dính đỉnh `56px` + Thanh CTA dính đáy `84px` + Nút Zalo/Messenger nổi góc phải + Cookie Banner = **chiếm mất `> 30–40%` diện tích màn hình**, khách chỉ còn một khe hẹp ở giữa để đọc nội dung.
- **Ngưỡng kiểm toán cứng:** Tổng chiều cao mọi phần tử `position: fixed / sticky` đang hiển thị đồng thời trên Mobile **cấm vượt quá `22%` chiều cao khung nhìn (`<= 180px` trên màn `812px`)**, và không có nút Chat nổi nào đè lên nút Submit chính.

### 2.7. Cử Chỉ Cảm Ứng & Sự Kiện Chỉ Dành Cho Chuột (`Mouse-Only & Hover Trap` — `P1`)
- Điện thoại **không có trạng thái `hover`**. Mọi menu con, nút xóa dòng, hoặc chú thích quan trọng chỉ hiện khi `:hover` / `onMouseEnter` đều **tàng hình hoàn toàn trên Mobile**.
- Thanh trượt tùy biến (`Custom Slider / Carousel / Kanban Drag`) chỉ bắt `mousedown/mousemove` mà thiếu `Pointer Events` + `touch-action: pan-y` sẽ nuốt mất thao tác vuốt cuộn trang dọc của người dùng.

### 2.8. Tự Bật Bàn Phím Ảo Che Mất Ngữ Cảnh (`Mobile autoFocus Trap` — `P2`)
- Gắn thuộc tính `autoFocus` trên trang Mobile làm bàn phím ảo bật lên ngay khi vừa mở trang, che mất 50% màn hình dưới khiến khách chưa kịp đọc tiêu đề xem biểu mẫu này dùng để làm gì.

### 2.9. Sai Bàn Phím Ảo Theo Kiểu Dữ Liệu (`Missing Mobile InputMode` — `P2`)
- Ô nhập Số điện thoại thiếu `type="tel"` / `inputMode="tel"`; ô Mã OTP / Số tiền thiếu `inputMode="numeric"`; ô Email thiếu `type="email"` + `autoComplete="email"` làm khách phải bấm chuyển bàn phím ký tự nhiều lần trên điện thoại.

### 2.10. Bố Cục Mobile Chỉ Là "Cột Desktop Xếp Chồng Cơ Học" (`Mechanical Column Stacking` — `P2`)
- Trên Desktop có bố cục Z-pattern (Hàng 1: Chữ trái - Ảnh phải; Hàng 2: Ảnh trái - Chữ phải). Nếu lên Mobile chỉ xếp chồng thô (`flex-col`) sẽ tạo ra thứ tự kỳ quặc: *Chữ 1 $\rightarrow$ Ảnh 1 $\rightarrow$ Ảnh 2 $\rightarrow$ Chữ 2* (2 bức ảnh dính liền nhau không biết ảnh nào của mục nào). Phải dùng `flex-col-reverse` hoặc `order-*` có chủ đích để giữ nhịp *Tiêu đề/Chữ $\rightarrow$ Minh họa* nhất quán.
