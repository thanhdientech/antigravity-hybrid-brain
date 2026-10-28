# ⚡ ANTIGRAVITY OMNI-BROWSER CONTROLLER (CHROME EXTENSION)

Tiện ích mở rộng Google Chrome (Manifest V3) chuyên dụng dành cho **Antigravity AI Agent**, cho phép điều khiển trình duyệt toàn năng như người thật:
- **Truy cập web & Quản lý Tab:** Mở trang web, chuyển tab, reload, đóng tab.
- **Tương tác chuột & Phím:** Click nút bấm, hover, nhập liệu văn bản tự nhiên, submit form.
- **Upload File:** Bơm file trực tiếp từ máy tính vào `<input type="file">` hoặc vùng thả file.
- **Chạy Mã & Script:** Thực thi JavaScript trực tiếp trong ngữ cảnh trang web và nhận kết quả về.
- **Tự động Gỡ lỗi (Self-Debugging):** Lắng nghe và trích xuất toàn bộ `console.log`, `console.error`, `window.onerror`.
- **Chụp ảnh màn hình:** Chụp ảnh trực tiếp tab đang mở để ghi nhận bằng chứng QA/Testing.
- **Tải file:** Quản lý tải tài liệu về máy.

---

## 🚀 HƯỚNG DẪN CÀI ĐẶT 1 LẦN DUY NHẤT VÀO PROFILE 67

### Bước 1: Mở Google Chrome ở Profile 67 (Suno)
1. Mở Chrome với **`Profile 67`** (Tài khoản Suno của Sếp).
2. Nhập vào thanh địa chỉ:
   ```text
   chrome://extensions/
   ```

### Bước 2: Bật Developer Mode & Load Extension
1. Gạt công tắc **"Developer mode" (Chế độ dành cho nhà phát triển)** ở góc trên bên phải màn hình sang trạng thái **BẬT (ON)**.
2. Bấm vào nút **"Load unpacked" (Tải tiện ích đã giải nén)** ở góc trên bên trái.
3. Chọn thư mục:
   ```text
   %USERPROFILE%\.gemini\config\skills\antigravity-browser-extension
   ```
4. Ngay lập tức, biểu tượng **Antigravity Omni-Browser Controller** màu xanh Cyan sẽ xuất hiện trên thanh công cụ của Chrome!

---

## 🖥️ HƯỚNG DẪN KẾT NỐI VỚI ANTIGRAVITY AGENT

1. Chạy máy chủ cầu nối Bridge Server:
   - Click đúp vào file: `%USERPROFILE%\.gemini\config\skills\antigravity-browser-bridge\start_bridge.bat`
   - Hoặc gõ lệnh:
     ```bash
     python "%USERPROFILE%\.gemini\config\skills\antigravity-browser-bridge\server.py"
     ```
2. Bấm vào icon tiện ích trên Chrome: Sẽ thấy chấm xanh 🟢 **ĐÃ KẾT NỐI (Live)**!
3. Giờ đây, Antigravity Agent có thể điều khiển Chrome bằng CLI:
   - Mở Suno: `python cli.py goto "https://suno.com/create"`
   - Bấm nút Tạo: `python cli.py click "button:has-text('Create')"`
   - Nhập prompt: `python cli.py type "textarea" "Giai điệu pop tương lai..."`
   - Chụp màn hình: `python cli.py screenshot --out "suno_result.png"`
