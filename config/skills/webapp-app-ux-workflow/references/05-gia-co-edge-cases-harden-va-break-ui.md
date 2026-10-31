# Gia Cố Tình Huống Biên (`Harden`) & Phá Thử Giao Diện Với Dữ Liệu Xấu Nhất (`Break-UI`)

Chưng cất từ `pbakaus/impeccable` (`reference/harden.md`) và `emilkowalski/skill` (`skills/break-ui/SKILL.md`, `ui-cheatsheet.md`).

---

## 1. Triết Lý Kiểm Thử Nghịch Đối Của Emil Kowalski (`The Break-UI Adversarial Method`)

> *"Giao diện nhìn rất đẹp với 3 dòng dữ liệu mẫu hoàn hảo chưa phải là giao diện dùng được trong sản xuất thực tế."*

Khi hoàn thiện một màn hình Web App hoặc App quan trọng, hãy kiểm tra (hoặc tích hợp chế độ gạt **`Demo Data` $\leftrightarrow$ `Worst-Case Data`** trong bản chạy thử) với **8 nhóm dữ liệu khắc nghiệt nhất ngoài đời thực**:

| STT | Kịch Bản Dữ Liệu Xấu Nhất (`Worst-Case Input`) | Lỗi Giao Diện Thường Vỡ Nếu Không Gia Cố | Cách Khắc Phục Kỹ Thuật Chuẩn (`Hardening Fix`) |
| :-: | :--- | :--- | :--- |
| **1** | **Tên người / Tên công ty / Tiêu đề sản phẩm dài 120+ ký tự tiếng Việt có dấu** | Đẩy nút hành động bay ra ngoài mép phải màn hình hoặc đè lên cột số tiền bên cạnh. | Bắt buộc đặt **`min-w-0`** trên thẻ con Flexbox/Grid + `truncate` (1 dòng kèm `title`) hoặc `line-clamp-2` (2 dòng). |
| **2** | **Chuỗi liên tục không có khoảng trắng** *(Email dài, URL dài, Mã UUID/Hash/Token 64 ký tự)* | Xuyên thủng chiều rộng Card / Drawer tạo thanh cuộn ngang toàn trang. | Dùng `break-all` hoặc `overflow-wrap: anywhere` cho ô hiển thị mã/URL/email. |
| **3** | **Con số cực lớn hoặc số âm** *(Doanh thu `128.450.000.000 ₫`, tồn kho `-1,250.75`, badge `99,420`)* | Vỡ thẻ KPI Card, lệch hàng cột bảng, méo vòng tròn thông báo. | Dùng `tabular-nums`, `whitespace-nowrap` cho ô tiền tệ, rút gọn thông minh trên thẻ KPI nhỏ (kèm Tooltip số đầy đủ), Badge giới hạn `99+`. |
| **4** | **Dữ liệu cực ngắn hoặc bị khuyết (`null`, `""`, mảng `[]`, ảnh lỗi `404`)** | Hiện chữ `undefined` / `NaN` / `Invalid Date`, ảnh vỡ icon rách, thẻ Avatar méo thành hình bầu dục. | Fallback rõ ràng (`"—"` cho trường trống, Avatar có **`flex-shrink-0`** tự chuyển sang chữ cái viết tắt tên khi ảnh lỗi). |
| **5** | **Danh sách cực lớn (`1,000+` dòng bảng, Combobox `500+` tỉnh/xã/mã hàng)** | Đơ cứng trình duyệt (`INP > 500ms`) khi mở dropdown hoặc gõ tìm kiếm. | Combobox có tìm kiếm lọc tức thì + giới hạn render / Virtualization (`> 50` dòng); không đọc DOM layout trong vòng lặp render. |
| **6** | **Bấm đúp chuột liên tục (`Double / Triple Click`) hoặc bấm chuyển tab nhanh** | Tạo ra 2–3 đơn hàng trùng nhau; dữ liệu của Tab cũ tải chậm về sau đè lên dữ liệu của Tab mới (`Race Condition`). | Khóa `disabled={isPending}` ngay lập tức khi gọi mutation; dùng `AbortController` hoặc Query Key hủy request cũ khi đổi bộ lọc. |
| **7** | **Lỗi mạng & Lỗi phân quyền API (`Offline`, `Timeout`, `401`, `403`, `409 Conflict`, `422`, `429`, `500`)** | Xoay vòng loading vô tận không bao giờ dừng, hoặc mất trắng dữ liệu vừa điền 10 phút. | Mọi request đều có `timeout` + `try/finally` tắt trạng thái pending; `401` mở hộp đăng nhập lại không làm mất Form; `422` ánh xạ lỗi về đúng từng trường. |
| **8** | **Phóng to trình duyệt `200%` & Chiều rộng nút bấm đa ngôn ngữ** | Chữ trong nút có `width` cứng (`w-24`) bị tràn ra ngoài viền nút. | Không đặt `width` cố định cho nút chứa chữ — luôn dùng `px-3 py-2` + `whitespace-nowrap` để nút tự giãn theo độ dài nhãn. |
