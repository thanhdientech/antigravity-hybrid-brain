# Khung Vỏ Ứng Dụng (`App Shell`), Responsive Web App & Điều Hướng Mobile App (`iOS / Android`)

Chưng cất từ `callstackincubator/agent-skills` (`react-navigation`), `flutter/skills` (`flutter-setup-declarative-routing`), `emilkowalski/skill` (`mobile-native`, `ui-cheatsheet.md`) và `ibelick/ui-skills` (`baseline-ui`).

---

## 1. Cấu Trúc Khung Vỏ Chuẩn Cho Web App & Admin (`Responsive App Shell`)

1. **Chiều cao Khung nhìn Động (`Dynamic Viewport Height`):**
   - Trên Web App hiện đại và trình duyệt di động, **cấm dùng `100vh` / `h-screen`** cho khung App Shell (vì thanh địa chỉ Safari/Chrome di động che khuất nút bấm dưới đáy). Bắt buộc dùng **`100dvh` (`h-dvh` / `min-h-dvh`)**.
2. **Bố cục 3 Vùng Chuẩn Quản Trị (`3-Zone Operational Shell`):**
   - **Vùng 1 — Thanh Điều Hướng Trái (`Collapsible Sidebar` `240px–280px` $\leftrightarrow$ `64px` Icon-only):** Gom nhóm menu theo phân hệ nghiệp vụ tối đa 2 cấp (tránh menu lồng 4–5 cấp rối mắt), đánh dấu rõ trang đang đứng (`aria-current="page"`). Trên Tablet/Mobile tự động thu thành **Slide-over Navigation Drawer** hoặc **Bottom Tab Bar**.
   - **Vùng 2 — Thanh Ngữ Cảnh Đỉnh (`Sticky Topbar` `56px`):** Chứa `Breadcrumbs` định vị đường dẫn (`Kho vận / Phiếu nhập kho / #NK-2026-089`), ô tìm kiếm/gọi lệnh toàn cục **`⌘K` / `Ctrl+K` (`Command Palette`)**, thông báo và hồ sơ vai trò đang đăng nhập.
   - **Vùng 3 — Không Gian Làm Việc Chính (`Main Workspace Canvas`):** Có tiêu đề trang + Cụm nút hành động chính góc phải trên cùng + Vùng KPI/Bộ lọc + Vùng dữ liệu chính.

---

## 2. Chuyển Đổi Bảng Dữ Liệu & Form Khi Xuống Màn Hình Điện Thoại (`Mobile Web App Adaptation`)

- **Bảng nhiều cột trên điện thoại (`375px–430px`):**
  - *Cách 1 (Khuyên dùng cho thao tác duyệt nhanh):* Chuyển từng dòng thành **Actionable Summary Card** hiển thị 4 thông tin quan trọng nhất (Mã/Tên + Trạng thái Badge + Số tiền/Số lượng chính + Nút thao tác), chạm vào mở Bottom Sheet / Màn hình chi tiết.
  - *Cách 2 (Cho bảng đối chiếu số liệu kế toán):* Bọc trong vùng cuộn ngang mượt (`overflow-x-auto`) kèm **ghim cố định cột đầu tiên (`sticky left-0`)** để khi kéo sang phải vẫn biết dòng đó thuộc mã hàng nào.
- **Chống lỗi iOS Safari tự phóng to vỡ giao diện Form:**
  - Mọi thẻ `<input>`, `<select>`, `<textarea>` trên thiết bị di động **bắt buộc có `font-size >= 16px`** (ví dụ Tailwind: `text-base md:text-sm`). Nếu nhỏ hơn `16px`, iOS Safari tự động zoom lệch khung màn hình ngay khi người dùng chạm vào ô nhập!

---

## 3. Workflow Điều Hướng Chuẩn Cho Mobile App (`React Native / Expo` & `Flutter`)

Khi xây dựng App di động (`iOS / Android`), tuyệt đối không bê nguyên Sidebar dài 15 mục của Desktop xuống màn hình điện thoại:

1. **Kiến trúc Điều hướng Đa Nhánh Giữ Nguyên Trạng Thái (`Stateful Persistent Tabs`):**
   - Dùng **Bottom Tab Bar (`3–5` tab cốt lõi nhất)** ở đáy màn hình (React Navigation `Native/Bottom Tabs` hoặc Flutter `GoRouter StatefulShellRoute`). Khi người dùng đang cuộn ở Tab *Đơn hàng* chuyển sang Tab *Tồn kho* rồi quay lại Tab *Đơn hàng*, vị trí cuộn và bộ lọc của Tab *Đơn hàng* phải được giữ nguyên!
2. **Phân tầng Luồng Màn hình Con (`Stack` vs `Bottom Form Sheet`):**
   - Xem chi tiết sâu theo cấp bậc (`Danh sách -> Chi tiết đơn -> Lịch sử giao vận`) $ightarrow$ Đẩy vào **`Stack Navigator`** (hỗ trợ cử chỉ vuốt mép trái quay lại tự nhiên của iOS/Android).
   - Lọc nhanh, chọn ngày, nhập ghi chú ngắn, chọn kho $ightarrow$ Mở **`Bottom Sheet / Form Sheet`** ngay trong tầm ngón tay cái mà không che mất hoàn toàn màn hình cha.
3. **Vùng chạm, Bàn phím ảo & Vùng an toàn (`Touch Targets, Keyboard & Safe Areas`):**
   - Mọi nút bấm / dòng chạm trên Mobile App phải đạt diện tích chạm tối thiểu **`44x44pt` (iOS) / `48x48dp` (Android)**.
   - Luôn bọc vùng hiển thị cố định (Header, Thanh nút Lưu dưới đáy, Bottom Tabs) theo **`SafeAreaInsets` / `env(safe-area-inset-bottom)`** để không đè lên tai thỏ Dynamic Island hoặc thanh gạt Home dưới đáy máy.
   - Màn hình có Form dài trên điện thoại phải tự đẩy vùng nhập lên trên bàn phím ảo (`KeyboardAvoidingView` / `resizeToAvoidBottomInset: true`) và cấu hình `enterkeyhint` (`next` $ightarrow$ `done` / `search`) để nhảy ô mượt ngay trên bàn phím.
