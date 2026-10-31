# Chế Độ `Operate Mode`, Quy Trình `Shape` Luồng Thao Tác & Ma Trận Phân Quyền `RBAC`

Chưng cất từ `pbakaus/impeccable` v4.8.0 (`reference/operate.md`, `reference/shape.md`, `reference/onboard.md`).

---

## 1. Triết Lý Cốt Lõi Của `Operate Mode` (Khác Hẳn Web Xem Tin / Landing Page)

Khi thiết kế **Web App người dùng, Trang quản trị Admin, Hệ thống SaaS, ERP, CRM, POS hoặc Mobile App chức năng**, giao diện nằm ở chế độ **`Operate` (Thực thi công việc)**:

| Tiêu Chí Đối Chiếu | ❌ Giao Diện Web Xem Bình Thường (`Persuade / Brochure`) | ✅ Giao Diện Web App & App Thao Tác (`Operate Mode`) |
| :--- | :--- | :--- |
| **Mục đích số 1** | Gây ấn tượng thị giác, kể chuyện, thuyết phục mua hàng. | Giúp người dùng **hoàn thành tác vụ chính xác, nhanh nhất, ít nhầm lẫn nhất**. |
| **Thang chữ (Typography)** | Chữ tiêu đề Hero khổng lồ co giãn `clamp()`, ghép nhiều font nghệ thuật. | **1 họ Sans-serif dễ đọc duy nhất**, thang `rem` cố định (tỷ lệ chặt `1.125–1.2`), dữ liệu dày đặc vẫn thoáng mắt. |
| **Màu sắc (Color)** | Gradient rực rỡ, mảng màu lớn gây chú ý. | **Tiết chế (`Restrained`)**: Nền trung tính phân 2 lớp (Sidebar/Toolbar tách nhẹ khỏi vùng làm việc chính); màu nhấn (`Accent`) **chỉ dành cho nút hành động chính, mục đang chọn và trạng thái ngữ nghĩa**. |
| **Chuyển động (Motion)** | Hiệu ứng xuất hiện tuần tự khi cuộn trang. | **Cấm hiệu ứng rườm rà khi tải trang** (người dùng vào để làm việc, không phải xem biểu diễn). Phản hồi tức thì `150–200ms` chỉ để báo thay đổi trạng thái. |
| **Mật độ & Sự quen thuộc** | Nhiều khoảng trống trang trí, phá cách bố cục. | **Sự quen thuộc đáng tin cậy (`Earned Familiarity`)**: Nút Lưu ở mọi màn hình phải giống hệt nhau; ưu tiên mật độ thông tin hữu ích cao (`120ch+` cho bảng dữ liệu). |

---

## 2. Quy Trình `Shape`: Khóa Luồng Thao Tác Trước Khi Viết Code Giao Diện

Trước khi viết bất kỳ thẻ HTML/JSX/Flutter nào cho một màn hình hoặc phân hệ mới, bắt buộc trả lời gọn 5 câu hỏi kiến trúc luồng:

1. **Ai đang ngồi trước màn hình này & Trong hoàn cảnh nào?**
   - *Ví dụ:* Nhân viên kho đang cầm máy quét mã vạch cần xử lý 100 đơn/giờ (cần phím tắt `Enter` liên hoàn, ít chuột), hay Giám đốc duyệt đề nghị thanh toán trên điện thoại (cần thấy ngay Số tiền, Người đề nghị, Lý do vượt hạn mức và 2 nút `Duyệt` / `Từ chối kèm lý do`).
2. **Sơ đồ Luồng Trạng Thái Nghiệp Vụ (`Workflow State Machine`) đi như thế nào?**
   - Mọi thực thể nghiệp vụ (Đơn hàng, Yêu cầu, Hồ sơ, Vé hỗ trợ, Lệnh sản xuất) phải có vòng đời trạng thái rõ ràng:
     `Nháp (Draft)` $ightarrow$ `Chờ duyệt (Pending)` $ightarrow$ `Đang xử lý (In Progress)` $ightarrow$ `Hoàn tất (Completed)` / `Đã hủy (Cancelled)`.
   - **Quy tắc hiển thị nút hành động theo trạng thái:** Ở mỗi trạng thái, chỉ bật sáng đúng các nút chuyển trạng thái hợp lệ kế tiếp (ví dụ: Đơn đã `Hoàn tất` thì không còn nút `Sửa trực tiếp`, chỉ có nút `In phiếu` hoặc `Tạo phiếu trả hàng`).
3. **Ma trận Phân quyền trên Giao diện (`RBAC UI Visibility & Affordance`) xử lý ra sao?**
   - **Tính năng hoàn toàn không thuộc vai trò** (VD: Khách hàng thường không được thấy menu Cấu hình Hệ thống của Super Admin) $ightarrow$ **Ẩn hẳn khỏi Menu điều hướng**.
   - **Hành động thuộc quy trình nhưng chưa đủ điều kiện hoặc thiếu quyền hạn cấp cao** (VD: Nhân viên thấy nút *"Duyệt chi > 50 triệu"* hoặc nút *"Xuất hóa đơn"* khi chưa đủ mã số thuế) $ightarrow$ **Giữ nút ở trạng thái `Disabled` kèm Tooltip nói rõ vì sao bị khóa & cần làm gì để mở**, tránh để người dùng hoang mang tìm nút biến mất!
4. **Khoảng giá trị dữ liệu thực tế (`Realistic Data Ranges`) từ tối thiểu đến cực đại là bao nhiêu?**
   - Khi `0` bản ghi trông thế nào? Khi `1` bản ghi? Khi `10,000` bản ghi? Khi tên danh mục dài 15 từ tiếng Việt?
5. **Điểm thoát & Khôi phục (`Exit & Undo/Recovery Path`) ở đâu?**
   - Mọi luồng nhiều bước đều phải có nút `Quay lại` giữ nguyên dữ liệu đã nhập, `Lưu nháp` và cách sửa sai khi lỡ bấm nhầm.

---

## 3. Thiết Kế Luồng Dùng Lần Đầu (`Onboard`) & Trạng Thái Trống Dẫn Dắt (`Actionable Empty States`)

- **Cấm tuyệt đối màn hình trắng trơ trọi với dòng chữ cụt lủn *"Không có dữ liệu"* (`"No data"`):**
  - Mọi `Empty State` trong Web App là **bàn đạp hướng dẫn thao tác đầu tiên**:
    1. **Tiêu đề rõ ràng:** *"Chưa có phiếu nhập kho nào trong kỳ này"* (hoặc *"Không tìm thấy kết quả khớp bộ lọc `*`"* nếu trống do đang lọc!).
    2. **1 câu giải thích giá trị:** *"Tạo phiếu nhập kho để cập nhật tồn kho thực tế và tự động hạch toán giá vốn."*
    3. **Nút Hành Động Chính (`Primary CTA`):** `[+ Tạo phiếu nhập kho đầu tiên]` hoặc `[Nhập từ file Excel mẫu]` (và nếu trống do bộ lọc thì nút CTA phải là `[Xóa toàn bộ bộ lọc]`).
