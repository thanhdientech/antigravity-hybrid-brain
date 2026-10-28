# TÀI LIỆU KỸ THUẬT: TỰ ĐỘNG HÓA TẠO ĐƠN HÀNG SAP B1 TỪ EMAIL BẰNG N8N

## 1. TỔNG QUAN HỆ THỐNG
Tài liệu này mô tả chi tiết quy trình tự động hóa (Automation Workflow) được xây dựng trên nền tảng **n8n**. Luồng này có nhiệm vụ:
- Tự động lắng nghe và tải các file Excel đơn hàng gửi đến hộp thư Email.
- Bóc tách dữ liệu từ file Excel, tổng hợp thành một đơn hàng hoàn chỉnh (nhiều mặt hàng, tiền tệ USD).
- Đăng nhập và đẩy dữ liệu vào hệ thống **SAP B1** (qua Service Layer) để tạo **Sales Order**.
- Tự động phân luồng Thành công/Thất bại và phản hồi (Reply) báo cáo chi tiết qua Email cho người gửi.

## 2. TẠI SAO LẠI DÙNG EMAIL TRUNG GIAN (GMAIL)?
Hệ thống KHÔNG đọc trực tiếp email cá nhân của nhân viên Sale/Kế toán, mà sử dụng một tài khoản Gmail trung gian (Ví dụ: `erp-orders-bot@example.com`). 

**Lý do cốt lõi:**
- **Bảo mật dữ liệu:** Hệ thống n8n cần cấp quyền đọc/ghi toàn bộ hòm thư. Việc cấp quyền này trên email cá nhân/công việc là rủi ro về quyền riêng tư. Dùng mail trung gian giúp cô lập rủi ro.
- **Tính ổn định & Bàn giao:** Khi nhân sự nghỉ việc hoặc đổi email, hệ thống lõi không bị ảnh hưởng. Người dùng chỉ cần cấu hình luật **Chuyển tiếp tự động (Auto-Forward)** các thư có chữ "đơn hàng" từ mail cá nhân sang mail trung gian.
- **Truy vết lỗi chính xác:** Khi email được Forward từ `sales-user@example.com` sang mail trung gian, hệ thống n8n sẽ xử lý và dùng lệnh **Reply**. Nó sẽ thông minh tự động Reply ngược lại thẳng hòm thư `sales-user@example.com` để chửi lỗi hoặc báo thành công. Ai làm sai, người đó tự nhận được thông báo để chịu trách nhiệm sửa chữa.

---

## 3. GIẢI THÍCH CHI TIẾT SƠ ĐỒ LUỒNG (WORKFLOW DEEP DIVE)

Sơ đồ chạy tuyến tính từ trái sang phải, bao gồm các trạm xử lý sau:

### Trạm 1: Gmail Trigger (Người gác cổng)
- **Nhiệm vụ:** Quét hộp thư mỗi phút một lần.
- **Bộ lọc (Filter):** `has:attachment subject:"đơn hàng" is:unread`
- **Logic:** Chỉ lấy những email *Chưa đọc*, có *File đính kèm*, và tiêu đề chứa chữ *"đơn hàng"*. Những thư quảng cáo, hoặc thư đã đọc sẽ bị lờ đi để chống chạy trùng lặp.

### Trạm 2: Phân luồng (Router)
- **Nhiệm vụ:** Kiểm tra định dạng file đính kèm.
- **Logic:** Chỉ cho phép các luồng có file mang đuôi `.xlsx` (Excel) đi tiếp. Loại bỏ các file rác như ảnh chữ ký (`.png`, `.jpg`).

### Trạm 3: Đọc file Excel & Gom dòng Đơn hàng (Code Node)
- **Nhiệm vụ:** Đọc nhị phân (binary) file Excel từ thuộc tính `attachment_0`, sau đó chuyển thành dữ liệu JSON.
- **Gom dòng (Code):** File Excel có thể chứa 10 mặt hàng, tương ứng 10 dòng JSON độc lập. Khối Code này sẽ gộp 10 dòng đó thành 1 mảng (array) `DocumentLines` duy nhất thuộc về 1 `CardCode` (Khách hàng). 
- **Tiền tệ:** Code tự động lấy giá trị từ cột `Currency` trong Excel, hoặc ép mặc định là `USD` gán vào biến `DocCurrency` để gửi cho SAP.

### Trạm 4: Tương tác SAP B1 Service Layer
- **SAP Login:** Bắn HTTP POST chứa Tài khoản & Mật khẩu vào SAP để lấy `B1SESSION`.
- **Tạo Sales Order:** Cấu trúc toàn bộ dữ liệu Excel thành payload JSON đẩy vào `B1s/v1/Orders`. 
- **Bẫy lỗi (Critical):** Khối này được bật chế độ **Continue (using error output)** trong tab Settings. Nghĩa là dù SAP có chửi lỗi (thiếu tỷ giá, sai mã hàng), luồng không bị sập mà tự động chẻ ra làm 2 ngã: **Success** (Thành công) và **Error** (Thất bại).

### Trạm 5A: Nhánh Thành Công (Success)
1. **SAP Logout:** Đóng phiên làm việc để giải phóng RAM cho server SAP.
2. **Mark as read:** Sử dụng lệnh cập nhật Gmail, đánh dấu thư vừa xử lý thành **Đã đọc (Read)**. Đây là chốt chặn cực kỳ quan trọng để Trạm 1 không bao giờ hút lại thư này vào phút tiếp theo.
3. **Reply (Thành công):** Gửi email phản hồi vào luồng thư cũ với nội dung chứa mã Đơn hàng: `{{ $('Tạo Sales Order').first().json.DocNum }}`.

### Trạm 5B: Nhánh Thất Bại (Error)
- **Reply (Báo lỗi):** Gửi email phản hồi cảnh báo Đỏ. Trích xuất trực tiếp câu chửi của SAP để người dùng biết đường tự sửa file Excel: `{{ JSON.stringify($('Tạo Sales Order').item.json.error) }}`.

---

## 4. HƯỚNG DẪN DÀNH CHO NGƯỜI BẢO TRÌ (MAINTAINER)

Nếu quy trình có sự thay đổi trong tương lai, người bảo trì cần lưu ý các vị trí sau để chỉnh sửa:
- **Đổi thông tin đăng nhập SAP:** Sửa trong khối `SAP Login`.
- **Sửa cấu trúc cột Excel:** Nếu công ty thêm cột "Chiết khấu" hoặc đổi kho hàng khác `WHS09`, hãy Click đúp vào khối `{ } Gom dòng Đơn hàng` và sửa mã Javascript bên trong.
- **Lỗi không gửi được mail:** Kiểm tra khối `Gmail Trigger` xem Credential (Google OAuth2) có bị hết hạn Token không.
- **Cách gỡ lỗi (Troubleshoot):** Luôn mở tab **Executions** trong n8n. Nhấn vào một luồng bị đánh dấu `Error` (Màu đỏ) để xem đích xác nó đang bị đứt bóng ở khối nào và dữ liệu trả về là gì.

---

## 5. HƯỚNG DẪN DÀNH CHO NGƯỜI SỬ DỤNG (USER / KẾ TOÁN / SALE)

**Bước 1: Chuẩn bị file Excel**
- Tải file mẫu. Đảm bảo nhập đúng Mã khách hàng (`CardCode`), Mã vật tư (`ItemCode`), Số lượng (`Quantity`).
- Cột Tiền tệ (`Currency`) phải điền đúng định dạng (Ví dụ: `USD` hoặc `VND`). Đảm bảo SAP đã khai báo tỷ giá hối đoái của ngày hôm đó, nếu không SAP sẽ từ chối tạo đơn.

**Bước 2: Gửi Đơn hàng**
- Gửi (hoặc Chuyển tiếp) email đến địa chỉ trung gian (`erp-orders-bot@example.com`).
- Tiêu đề bắt buộc phải có chữ **"đơn hàng"**.
- Đính kèm file Excel (đuôi `.xlsx`).

**Bước 3: Nhận Kết Quả**
- Không cần thao tác gì thêm. Đợi 1-2 phút, hệ thống sẽ tự động nhắn tin (Reply) phản hồi.
- Nếu nhận thông báo Thành công kèm số đơn -> Đã xong.
- Nếu nhận thông báo Lỗi (Màu đỏ) -> Đọc kỹ dòng nguyên nhân từ SAP, sửa lại file Excel và gửi một email mới. Đừng cố gửi lại cái file sai bét cũ!
