# 01. Kiểm Toán Logic Tương Tác & Luồng Nghiệp Vụ Web App (`webapp` — Operate Mode QA Audit)

> Chưng cất từ `garrytan/gstack` (`qa-only` & `design-review` App UI Rules), `narenkatakam/ux-audit` (`Review Mode` & `ui-states`), và `pbakaus/impeccable` (`audit.md` & `critique.md`). Áp dụng cho **Web App Người Dùng (`User Portal`), Trang Quản Trị (`Admin Panel`), SaaS, ERP, CRM, MES, POS**.

---

## 1. 6 Cổng Kiểm Toán Logic Cốt Lõi Của Web App (`Operate Mode Gates`)

### 1.1. Cổng Tác Vụ Số 1 Trong 3 Giây (`Task-First 3-Second Gate`)
- **Câu hỏi kiểm toán:** Khi nhân viên hoặc khách hàng mở màn hình này lên, họ có nhận ra **1 hành động chính duy nhất (`Primary CTA`)** trong vòng `< 3 giây` mà không cần đọc đoạn văn hướng dẫn dài hay không?
- **Dấu hiệu lỗi `P1`:**
  - Có `>= 2` nút màu nổi (`Primary Solid Button`) cạnh tranh ngang hàng trong cùng một vùng thao tác (ví dụ: nút *"Tạo dự án"* màu xanh đậm đứng sát nút *"Nhập từ mẫu"* màu xanh lá đậm).
  - Bày toàn bộ 12+ tham số cấu hình nâng cao ra màn hình đầu tiên thay vì gom vào `<details>` / `Advanced drawer` (`Progressive Disclosure`).
  - Lời hướng dẫn dài quá 1 câu trên giao diện thao tác: trong `Operate Mode`, hướng dẫn dài là bằng chứng thiết kế luồng bị thất bại.

### 1.2. Cổng Đủ 8 Trạng Thái Giao Diện (`Universal 8-State Matrix Audit`)
Mỗi màn hình dữ liệu và thành phần tương tác trong Web App bắt buộc phải vượt qua bài kiểm tra 8 trạng thái:
1. **`Default`:** Hiển thị rõ cấu trúc phân cấp thông tin (nhóm theo mô hình tư duy người dùng *"Việc cần duyệt / Đã hoàn tất"*, **không** nhóm theo tên bảng Database nội bộ).
2. **`Hover`:** Có phản hồi thị giác rõ và `cursor: pointer` trên mọi phần tử bấm được.
3. **`Focus-Visible`:** Có vòng sáng `:focus-visible` rõ nét khi bấm phím `Tab` (cấm `outline: none` mà không có `focus-visible:ring`).
4. **`Active / Pressed`:** Có phản hồi nhấn tức thì (`< 100ms`).
5. **`Disabled / Permission Locked (RBAC)`:** Giảm độ đậm + `cursor: not-allowed` + **kèm Tooltip nêu rõ lý do bị khóa** (ví dụ: *"Chỉ Trưởng phòng mới có quyền duyệt phiếu > 50 triệu"* — không để nút bấm câm làm người dùng tưởng web bị đơ).
6. **`Loading`:** Bắt buộc dùng **Skeleton giữ nguyên kích thước khung** (cấm thay cả trang bằng 1 vòng xoay `Spinner` nhỏ làm sập chiều cao gây giật khung `CLS` khi dữ liệu đổ về).
7. **`Empty State`:** Khi mảng dữ liệu rỗng `[]`, cấm chỉ hiện chữ cụt lủn *"No data / Không có dữ liệu"*; bắt buộc nêu rõ trạng thái + **1 nút CTA tạo bản ghi đầu tiên hoặc nút Xóa bộ lọc (`Clear filters`)**.
8. **`Error State`:** Khi API trả lỗi `401 / 403 / 422 / 429 / 500` hoặc đứt mạng, thông báo lỗi phải nói bằng ngôn ngữ người dùng, giữ nguyên dữ liệu họ vừa gõ và có nút **Thử lại (`Retry`)**.

---

## 2. Kiểm Toán Lỗi Logic Biểu Mẫu, Bảng Dữ Liệu & Nút Bấm (`Form, Table & Control Logic Bugs`)

| Mã Lỗi Kiểm Toán | Mức Độ | Mô Tả Hành Vi Lỗi Thực Tế Cần Bắt | Cách Khắc Phục Chuẩn Kỹ Thuật |
| :--- | :---: | :--- | :--- |
| **`FORM_BTN_NO_TYPE`** | **`P0`** | Thẻ `<button>` phụ (mở lịch, xóa dòng, thêm tag, đóng modal) đặt bên trong `<form>` nhưng quên khai báo `type="button"` $\rightarrow$ trình duyệt mặc định là `type="submit"`, bấm vào làm tự gửi Form ngoài ý muốn. | Khai báo tường minh `type="button"` cho mọi nút phụ và `type="submit"` cho đúng 1 nút lưu chính. |
| **`DOUBLE_SUBMIT_RACE`** | **`P0`** | Nút Lưu/Thanh toán không khóa (`disabled` / `aria-busy="true"`) trong lúc chờ API trả về $\rightarrow$ người dùng bấm đúp tạo 2 đơn hàng hoặc trừ tiền 2 lần. | Khóa nút ngay khi `isSubmitting = true`, đổi nhãn sang `"Đang lưu…"` (dùng ký tự `…` chuẩn) và gắn `Idempotency-Key` cho giao dịch nhạy cảm. |
| **`DIV_SPAN_ONCLICK`** | **`P1`** | Dùng `<div onClick>` hoặc `<span onClick>` làm nút bấm $\rightarrow$ liệt hoàn toàn phím `Tab` / `Enter` / `Space` và biến mất khỏi cây Accessibility của trình đọc màn hình. | Chuyển sang thẻ `<button type="button">` hoặc `<a>` có `href` thật. |
| **`DESTRUCTIVE_NO_GUARD`** | **`P0`** | Nút Xóa vĩnh viễn / Hủy phiếu / Gỡ tài khoản thực thi ngay sau 1 cú click mà không có hộp thoại xác nhận `AlertDialog` hoặc cửa sổ `Undo` 5–10 giây. | Bắt buộc mở `AlertDialog` nêu rõ tên đối tượng sắp xóa và hậu quả, hoặc cung cấp `Toast + Undo`. |
| **`DIRTY_FORM_DATA_LOSS`** | **`P1`** | Người dùng đang nhập dở biểu mẫu dài (10+ ô), lỡ bấm ra ngoài nền mờ `Backdrop` của Modal/Drawer hoặc chuyển trang làm bay sạch dữ liệu vừa gõ. | Chặn đóng Modal/Drawer khi `isDirty === true` (hiện xác nhận *"Bỏ thay đổi chưa lưu?"*) và gắn `beforeunload`. |
| **`NUMBER_WHEEL_DRIFT`** | **`P1`** | Ô `<input type="number">` cho Số tiền / Số lượng kho bị tự nhảy tăng/giảm số ngầm khi người dùng đang cuộn chuột dọc trang web. | Dùng `inputMode="numeric"` trên `type="text"` có format phân tách hàng nghìn, hoặc chặn `onWheel={(e) => e.currentTarget.blur()}`. |
| **`URL_STATE_DESYNC`** | **`P1`** | Bộ lọc danh sách, từ khóa tìm kiếm, số trang hiện tại (`page`), tab đang mở hoặc ngăn kéo chi tiết chỉ lưu trong `useState` RAM $\rightarrow$ bấm `F5` hoặc copy link gửi đồng nghiệp bị reset về trang đầu. | Đồng bộ `q`, `status`, `tab`, `page`, `sort`, `detail` lên `URLSearchParams`. |
| **`TABLE_NUMBER_JITTER`** | **`P2`** | Cột tiền tệ, số lượng, tỷ lệ `%`, đồng hồ đếm giây trong bảng dữ liệu căn trái hoặc thiếu `tabular-nums` làm các hàng chữ số lệch hàng zíc-zắc khó đối chiếu. | Căn phải (`text-right`) mọi cột số lượng/tiền tệ và áp dụng `font-variant-numeric: tabular-nums`. |

---

## 3. Chẩn Đoán Tâm Lý Học Giao Diện (`Norman's Two Gulfs` & `Krug Goodwill Meter`)

Khi ghi nhận lỗi `P0 / P1` trên Web App, luôn chỉ rõ gốc rễ nhận thức theo khung `narenkatakam/ux-audit`:
- **Vực sâu Thực thi (`Gulf of Execution` — Người dùng không biết phải thao tác thế nào):** Biểu tượng lạ không nhãn chữ (`Icon-only mystery meat`), thành phần bấm được nhưng trông phẳng lì như văn bản tĩnh, giấu điều kiện nhập liệu (chỉ báo lỗi mật khẩu thiếu ký tự đặc biệt *sau khi* bấm Submit thay vì ghi sẵn ngay từ đầu).
- **Vực sâu Đánh giá (`Gulf of Evaluation` — Người dùng không biết hệ thống đã chạy xong hay chưa):** Bấm nút *"Xuất Excel"* mất 6 giây nhưng màn hình đứng im không có thanh tiến trình; cập nhật cấu hình ở cuối trang nhưng chỉ bắn một `Toast` nhỏ ở góc trên bên phải ngoài tầm mắt rồi tự tắt sau 2 giây.
- **Thang đo Thiện cảm (`Goodwill Reservoir` — bắt đầu từ `70/100`):**
  - Trừ `-15đ`: Popup hướng dẫn cưỡng bức (`Forced tour`) chặn ngay khi vừa vào việc.
  - Trừ `-10đ`: Phạt định dạng máy móc (bắt người dùng tự xóa dấu cách hoặc dấu gạch ngang trong số điện thoại/mã số thuế thay vì code tự `.replace(/\s+/g, '')`).
  - Trừ `-5đ`: Mỗi điểm quyết định mơ hồ khiến người dùng phải khựng lại suy nghĩ (*Mindless Choice Failure*).
  - Dưới `30/100` = **Nợ UX Nghiêm Trọng (`Critical UX Debt`)**.
