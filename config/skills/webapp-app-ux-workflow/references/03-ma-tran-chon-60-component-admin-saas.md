# Ma Trận Quyết Định Chọn Đúng Component Trong `60+` Mẫu Giao Diện Web App / Admin

Tổng hợp từ `pbakaus/impeccable` (`operate.md`) và `carmahhawwari/ui-design-brain` (`component.gallery`).
*(Để xem chi tiết từng component từ A–Z, tra cứu tiếp tệp [`06-ui-design-brain-60-components-catalog.md`](./06-ui-design-brain-60-components-catalog.md)).*

---

## 1. Bảng Quyết Định Vàng: Dùng `Inline`, `Popover`, `Drawer`, `Modal` Hay `Trang Riêng / Wizard`?

> **Quy tắc từ `Impeccable Operate Mode`:** *"Modal as first thought is laziness. Exhaust inline and progressive alternatives first."* (Hơi tí là bật popup Modal đè tối đen màn hình là lỗi thiết kế làm đứt mạch làm việc của người dùng!).

| Tình Huống Thao Tác Thực Tế Trong Web App | Component Chuẩn Phải Chọn | Lý Do Logic & Trải Nghiệm Thao Tác |
| :--- | :--- | :--- |
| **Đổi nhanh 1–2 trường đơn giản ngay trên bảng** *(Đổi trạng thái, sửa số lượng, bật/tắt kích hoạt, đổi tên)* | **Inline Edit / Toggle / Select / Popover tại chỗ** | `0` lần chuyển màn hình, mắt người dùng giữ nguyên trên dòng dữ liệu đang làm. |
| **Xem chi tiết bản ghi hoặc Sửa Form vừa (`4–10` trường) trong khi vẫn cần đối chiếu danh sách phía sau** *(Xem chi tiết đơn hàng, sửa hồ sơ khách, lọc nâng cao nhiều tiêu chí)* | **Slide-over Drawer / Sheet (Ngăn kéo trượt cạnh phải `420px–640px`)** | Không làm mất ngữ cảnh bảng chính phía sau; bấm mũi tên Lên/Xuống duyệt liên tiếp từng dòng cực nhanh. |
| **Quyết định ngắn chặn luồng bắt buộc phải chú ý 100%** *(Xác nhận xóa nguy hiểm, nhập mật khẩu xác thực lại, tạo nhanh 1 thư mục chỉ có 1–2 ô)* | **Modal / AlertDialog nhỏ gọn (`max-w-md`)** | Tập trung tuyệt đối vào quyết định quan trọng; khóa Focus Trap bên trong và bấm `Esc` thoát rõ ràng. |
| **Biểu mẫu nghiệp vụ lớn, có bảng dòng chi tiết con hoặc nhiều nhóm thông tin** *(Lập Hóa đơn/Đơn mua hàng 20 mặt hàng, Cấu hình phân quyền hệ thống)* | **Full Workspace Page (Trang làm việc toàn màn hình có thanh Footer `Lưu` cố định)** | Không bao giờ nhét một bảng nhập chi tiết nhiều cột vào trong một chiếc Modal chật hẹp phải cuộn 2 tầng! |
| **Quy trình tuần tự có điều kiện phụ thuộc bước trước -> bước sau** *(Khởi tạo dự án mới, Nhập khẩu Excel -> Ánh xạ cột -> Kiểm tra lỗi -> Chốt nạp)* | **Multi-step Stepper / Wizard (`3–5` bước rõ tiến độ)** | Giảm tải nhận thức (*Progressive Disclosure*), kiểm tra hợp lệ xong từng chặng mới sang chặng kế tiếp, cho phép quay lại bước trước không mất dữ liệu. |

---

## 2. Bảng Quyết Định Phản Hồi Hệ Thống: `Toast` vs `Inline Alert` vs `Field Error` vs `AlertDialog`

| Loại Thông Báo Hệ Thống | Component Chuẩn | Cấm Vi Phạm |
| :--- | :--- | :--- |
| **Thao tác nền thành công nhẹ nhàng** *(Đã lưu cài đặt, Đã sao chép mã, Đã chuyển vào thùng rác kèm nút Hoàn tác)* | **Toast góc màn hình (`aria-live="polite"`, tự ẩn sau `4–5s`)** | Cấm dùng Toast cho lỗi nhập liệu phức tạp vì Toast biến mất trước khi người dùng kịp đọc cách sửa! |
| **Lỗi nhập sai dữ liệu của từng ô trong Form** *(Sai định dạng MST, Số lượng vượt tồn kho khả dụng)* | **Inline Field Error ngay sát dưới ô đó** | Phải nối `aria-describedby` và giữ nguyên chữ người dùng vừa gõ. |
| **Cảnh báo cấp trang hoặc lỗi kết nối / hết hạn phiên / vượt hạn mức tín dụng** | **Inline Alert / Callout Banner đặt ngay đầu vùng tác vụ** | Đi kèm màu ngữ nghĩa + Icon + Hành động khắc phục cụ thể (`[Đăng nhập lại]`, `[Thử kết nối lại]`). |
| **Lỗi nghiêm trọng chặn thao tác hoặc Xác nhận hành động phá hủy** | **AlertDialog (`role="alertdialog"`)** | Không cho đóng vô tình bằng cách click ra ngoài vùng tối nếu hành động đang dở dang nhạy cảm. |

---

## 3. Quy Tắc Thoát Khung Cắt (`Overlay Portal Escape Rule`)

- Trong Web App có nhiều khung cuộn (`overflow-y: auto`) hoặc thẻ bo góc (`overflow: hidden`): mọi thành phần nổi như **Dropdown Menu, Datepicker, Combobox, Tooltip, Popover, Modal, Drawer** bắt buộc render qua **Portal ra `document.body`, HTML `<dialog>` hoặc Popover API** kèm thang `z-index` chuẩn hóa (`dropdown: 40`, `sticky: 30`, `drawer/modal: 50`, `toast: 60`) để **không bao giờ bị cắt cụt mép dưới đáy bảng!**
