# 🚀 Hành Trình Phát Triển SAP B1 Query Master Dashboard

Tài liệu này ghi chú lại toàn bộ các cột mốc, những vấn đề đã giải quyết và các thành tựu mà anh và em (AI) đã cùng nhau đạt được trong quá trình xây dựng và hoàn thiện dự án **SAP B1 Query Master Dashboard**.

---

## 1. Khởi tạo & Xây dựng Cấu trúc Cốt lõi
* **Công nghệ cốt lõi:** Ứng dụng được xây dựng bằng Python với Framework **Streamlit** cho giao diện Web, kết nối trực tiếp đến **SQL Server** thông qua `pyodbc` (ODBC Driver 17).
* **Quản lý Tham số Động (Dynamic Parameters):** 
  * Xây dựng bộ máy tự động nhận diện và trích xuất các tham số dạng `[%0]`, `[%1]` đặc trưng của SAP B1.
  * Tự động phán đoán kiểu dữ liệu (Date, Numeric, Text) dựa vào nội dung câu SQL.
  * Hỗ trợ cài đặt tham số nâng cao qua giao diện (Settings Popover): cho phép người dùng cấu hình Custom SQL Lookup, chỉ định Value Column, Display Column và bật chế độ **Multi-select** (chọn nhiều giá trị).

## 2. Xử lý "Nỗi đau" Kỹ thuật (Technical Debt & Bug Squashing)
* **Smart SQL Temporal Quoting (Xử lý chuỗi và Ngày tháng):** Giải quyết triệt để lỗi cú pháp SQL khi tham số truyền vào thiếu hoặc dư dấu nháy đơn (`'`). AI đã viết thuật toán tự động nhận diện xem câu SQL gốc đã bọc nháy cho biến `[%0]` chưa, từ đó tự động thêm nháy an toàn cho các kiểu dữ liệu Date/Text mà không làm hỏng cú pháp.
* **Quyền Truy Cập & Phân luồng Thư mục (Zero-Trust RBAC):** 
  * Cấu trúc lại toàn bộ kho lưu trữ báo cáo từ thư mục chung `SYNC_default` sang các thư mục rành mạch theo tên Database (VD: `SYNC_SBO_MFG_PROD`).
  * Hệ thống tự động thiết lập quyền (Visibility) để người dùng ở Database nào thì chỉ thấy báo cáo của Database đó, giúp tăng cường tính bảo mật.

## 3. Nâng cấp Trải nghiệm Người Dùng (UI/UX)
* **Khắc phục lỗi "Giật Scroll" kinh điển:** Khi dùng bảng `st.data_editor` mặc định để tick chọn báo cáo đồng bộ (Sync Manager), giao diện liên tục bị giật tung lên đầu trang gây ức chế. Giải pháp là **thay thế hoàn toàn bằng thư viện AgGrid** mạnh mẽ hơn.
* **Tối ưu Bảng Đồng Bộ (Sync Manager):**
  * Bật tính năng **Floating Filter** (ô tìm kiếm luôn hiển thị dưới tiêu đề cột) giúp người dùng tìm báo cáo cực kỳ nhanh mà không cần thao tác rê chuột phức tạp.
  * Hỗ trợ Checkbox chọn nhiều dòng cùng lúc (`header_checkbox=True`).
* **Sửa lỗi Giao diện (CSS Patches):** Căn chỉnh lại các nút bấm bị lẹm khi xem chế độ Fullscreen, sửa lỗi hiển thị Logo SAP do link ngoài bị hỏng (thay bằng HTML tự code), và đồng bộ khoảng cách các nút trên thanh Header.

## 4. Triển khai Thực tế (Production Deployment)
* Không chỉ viết code chạy cục bộ, dự án đã được đóng gói để chạy thực tế 24/7 trên **Windows Server**.
* Sinh ra file khóa môi trường `requirements.txt` chuẩn mực.
* Viết bộ công cụ **1-Click Installer** (`install_service.bat` & `stop_service.bat`):
  * Tự động cấu hình tường lửa (Mở port `8501` cho mạng LAN).
  * Ứng dụng Task Scheduler và NSSM để biến Streamlit thành một **Background Windows Service**. Máy chủ dù có khởi động lại thì ứng dụng Web vẫn tự động bật lên âm thầm phục vụ toàn bộ nhà máy.

## 5. Mở rộng Hệ sinh thái (Service Layer Integration)
* Chuẩn bị nền tảng để tương lai không chỉ Dữ liệu Đọc (Read-only) mà còn có thể Ghi dữ liệu (POST/PATCH) ngược lại SAP.
* Khởi tạo thành công file công cụ lõi `run_sl_api.cjs` (bằng Node.js):
  * Xử lý xác thực đăng nhập (`/b1s/v1/Login`) tự động lấy SessionId.
  * Thiết lập luồng Fetch API tiêu chuẩn để chọc thẳng vào **SAP B1 Service Layer** (Port 50000), sẵn sàng cho các nhiệm vụ nâng cao trong các chặng tiếp theo.

---
*Ghi chú được lập bởi AI Assistant vào ngày 15/06/2026. Sẵn sàng cho những thử thách mới!*
