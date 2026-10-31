# Kiến Trúc `URL-as-State`, 8 Trạng Thái UI, CRUD Data Table, Form & Compound Components

Chưng cất từ `vercel-labs/web-interface-guidelines` (`command.md`), `vercel-labs/agent-skills` (`composition-patterns`, `react-best-practices`) và `ibelick/ui-skills` (`baseline-ui`).

---

## 1. Thiết Luật `URL-as-State` (URL Là Nguồn Sự Thật Của Trạng Thái Điều Hướng)

Lỗi nghiệp dư lớn nhất của các Web App do AI viết tự do là nhốt toàn bộ bộ lọc, ô tìm kiếm, tab đang mở và trang hiện tại vào biến `useState` cục bộ: người dùng lọc 5 tiêu chí xong bấm `F5` (hoặc copy link gửi qua Zalo cho quản lý xem) là **mất sạch trạng thái, quay về trang đầu!**

- **Quy tắc bắt buộc:** Đồng bộ lên URL Query Parameters (`?tab=pending&q=khach+vip&warehouse=HCM&sort=amount_desc&page=2&inspect=ORD-1089`):
  1. Từ khóa tìm kiếm (`q` — có debounce `250–300ms` để không giật từng phím gõ).
  2. Bộ lọc trạng thái, ngày tháng, danh mục (`status`, `from`, `to`, `category`).
  3. Tab con đang chọn (`tab`), trang & kích thước trang (`page`, `pageSize`), cột sắp xếp (`sort`).
  4. Ngăn kéo / Panel chi tiết đang mở (`inspect` / `drawerId`) để có thể Deep-link thẳng tới đúng 1 bản ghi.
- **Thẻ điều hướng phải dùng `<a href>` / `<Link>` thật** (không dùng `<div onClick={() => router.push(...)}>`) để Admin có thể giữ `Ctrl+Click` hoặc `Chuột giữa` mở 5 đơn hàng ra 5 tab trình duyệt xử lý song song!

---

## 2. Ma Trận 8 Trạng Thái Bắt Buộc Cho Mọi Màn Hình & Component Thao Tác

Không bao giờ bàn giao một màn hình Web App chỉ có trạng thái "đẹp khi dữ liệu tĩnh hoàn hảo":

1. **`Default / Idle`:** Phân cấp thị giác rõ giữa dữ liệu chính, nhãn phụ và nút thao tác.
2. **`Hover`:** Đổi nền tinh tế trên dòng bảng / nút bấm; không bao giờ giấu thông tin sống còn chỉ hiện khi rê chuột (vì màn hình cảm ứng / Tablet không có Hover!).
3. **`Focus-Visible`:** Vòng sáng `focus-visible:ring-2` rõ nét khi đi bằng phím `Tab`; **cấm tuyệt đối** `outline-none` mà không có vòng focus thay thế; thanh Header cố định không được che khuất phần tử đang được focus (`scroll-margin-top`).
4. **`Active / Pressed`:** Phản hồi xúc giác tức thì (`active:scale-[0.98]` hoặc đổi sắc độ nền trong `< 100ms`).
5. **`Disabled (Kèm Lý Do)`:** Giảm độ tương phản có kiểm soát, khóa sự kiện click và giải thích điều kiện mở khóa.
6. **`Loading / Pending`:**
   - Khi tải khung dữ liệu lần đầu: Dùng **Structural Skeleton** đúng hình dáng bảng/thẻ (tránh nhảy khung `CLS`), không thả 1 vòng xoay lẻ loi giữa màn hình trắng.
   - Khi bấm nút Lưu/Gửi: Giữ nguyên chiều rộng nút, khóa chống bấm đúp, hiện Spinner nhỏ kèm chữ có dấu ba chấm chuẩn `"Đang lưu…"` / `"Đang xử lý…"`.
7. **`Empty State (Phân biệt 2 loại!)`:**
   - *Loại A — Hệ thống chưa có bản ghi gốc nào:* Hiện hướng dẫn ngắn + Nút `[+ Tạo mới]`.
   - *Loại B — Có dữ liệu gốc nhưng không khớp bộ lọc/tìm kiếm:* Hiện *"Không có kết quả khớp với bộ lọc hiện tại"* + Nút `[Đặt lại bộ lọc]`.
8. **`Error & Recovery State`:** Báo lỗi bằng ngôn ngữ người dùng hiểu được, giữ nguyên toàn bộ dữ liệu người dùng vừa gõ trong Form (tuyệt đối không xóa trắng Form khi API lỗi!) và có nút `[Thử lại]`.

---

## 3. Quy Chuẩn Thiết Kế Bảng Dữ Liệu Nghiệp Vụ (`Enterprise Data Table UX`)

Bảng dữ liệu là trái tim của mọi trang Admin / ERP / SaaS:
- **Quy tắc căn lề chuẩn kế toán & dữ liệu:**
  - Văn bản, Mã, Tên, Trạng thái $ightarrow$ **Căn trái (`text-left`)**.
  - Số lượng, Tiền tệ, Phần trăm, Điểm số $ightarrow$ **Căn phải (`text-right`) + Bắt buộc `font-variant-numeric: tabular-nums`** (tiêu đề cột `<th>` phải căn cùng hướng với dữ liệu cột đó!).
  - Ngày giờ có độ dài cố định (`DD/MM/YYYY HH:mm`) $ightarrow$ Căn trái hoặc giữa đồng nhất; với mốc thời gian cũ hơn 7 ngày phải hiện ngày tuyệt đối thay vì *"340 ngày trước"*.
- **Thanh công cụ trên bảng (`Table Toolbar`):** Ô tìm kiếm nhanh + Các chip lọc trạng thái + Hiển thị tổng số bản ghi khớp (`"Hiển thị 1–25 / 348 đơn hàng"`) + Nút `Xóa bộ lọc` khi có ít nhất 1 bộ lọc đang bật.
- **Thao tác dòng & Hàng loạt (`Row & Bulk Actions`):**
  - Tránh để chữ chọn văn bản trong dòng bị xung đột với click mở dòng (tách rõ vùng click mở chi tiết và cột nút hành động `⋯` cuối dòng).
  - Khi tích chọn `>= 1` dòng bằng Checkbox, hiển thị thanh **`Floating Bulk Action Bar`** nổi rõ số lượng đã chọn (`"Đã chọn 12 mục"`) kèm các nút xử lý hàng loạt (`Duyệt hàng loạt`, `Xuất Excel`, `Xóa`) và nút `Bỏ chọn`.
- **Hiệu năng bảng lớn:** Danh sách `> 50` dòng phức tạp phải phân trang từ Server hoặc ảo hóa (`Virtualization` / `content-visibility: auto`).

---

## 4. Quy Chuẩn Biểu Mẫu (`Forms`), Wizard Nhiều Bước & Bảo Vệ Thao Tác Nguy Hiểm

1. **Mọi nút phụ nằm trong `<form>` (Mở lịch, Thêm dòng con, Xóa tag, Đóng hộp thoại) BẮT BUỘC khai báo `type="button"`** — chỉ duy nhất nút gửi chính mới dùng `type="submit"`.
2. **Thuộc tính chuẩn trình duyệt:** Khai báo đúng `<label htmlFor="...">` (vùng bấm gộp cả chữ lẫn ô checkbox/radio, không tạo vùng chết), đúng `type` (`email`, `tel`, `url`, `number`), `inputmode` cho bàn phím điện thoại, `spellCheck={false}` cho mã code/username/email, và **tuyệt đối cấm chặn dán (`onPaste` + `preventDefault`)** ngay cả ở ô mật khẩu/mã OTP.
3. **Chiến lược bắt lỗi thông minh (`Reward Early, Punish Late`):**
   - Không báo lỗi đỏ chót ngay từ ký tự đầu tiên người dùng đang gõ dở!
   - Kiểm tra lỗi khi rời ô (`onBlur`) hoặc khi bấm `Submit`; ngay khi người dùng sửa đúng trong ô đang lỗi thì xóa cảnh báo đỏ lập tức (`onChange`).
   - Khi bấm `Submit` có lỗi: hiển thị lỗi ngay sát dưới ô tương ứng (`aria-invalid="true"`, `aria-describedby`), tự động cuộn và đặt con trỏ `focus()` vào ô lỗi đầu tiên.
4. **Chống mất công nhập liệu (`Unsaved Changes / Dirty-State Guard`):**
   - Nếu Form dài hoặc Multi-step Wizard đã có thay đổi (`isDirty === true`) mà người dùng bấm chuyển trang, đóng Drawer hoặc đóng tab trình duyệt $ightarrow$ Bắt buộc bật cảnh báo xác nhận *"Bạn có thay đổi chưa lưu. Rời trang sẽ mất dữ liệu vừa nhập"* (`beforeunload` + Router/Drawer close guard) hoặc tự động lưu nháp (`Auto-save Draft`).
5. **Rào chắn Thao tác Không thể Hoàn tác (`Destructive Action Guard`):**
   - Mọi lệnh `Xóa vĩnh viễn`, `Hủy đơn đã duyệt`, `Thu hồi quyền`, `Ghi đè dữ liệu` bắt buộc đi qua hộp thoại **`AlertDialog`** nêu đích danh đối tượng sắp xóa (VD: *"Xóa kho `KHO-TONG-HCM` và 14 cấu hình liên quan?"*), nút hủy mặc định được focus an toàn và nút xác nhận màu đỏ ghi rõ động từ (`"Xóa kho"`, không ghi chữ `"OK"` / `"Đồng ý"` mơ hồ); hoặc dùng cơ chế **Soft-delete kèm Toast `[Hoàn tác trong 5 giây]`**.

---

## 5. Kiến Trúc Compound Components Chống "Nổ Biến Boolean Props" (Vercel React Patterns)

Khi xây dựng Component phức tạp cho Web App (Data Table, Filter Bar, Modal, Stepper), **cấm** nhồi 15 cờ boolean vào 1 thẻ (`<DataTable hasSearch hasExport isAdmin showModal canDelete ... />`). Hãy tách theo mẫu **Compound Components chia sẻ Context**:
- `<DataTable>` $ightarrow$ `<DataTable.Toolbar>` $ightarrow$ `<DataTable.Search />` + `<DataTable.Filters />` + `<DataTable.BulkActions />` $ightarrow$ `<DataTable.Grid />` $ightarrow$ `<DataTable.Pagination />`.
- Giúp từng màn hình User và Admin lắp ghép linh hoạt 100% mà không sinh nhánh `if/else` rối rắm.
