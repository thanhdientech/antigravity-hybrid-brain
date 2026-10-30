# Phương Pháp Phỏng Vấn Socratic `Grill-Me` & Khóa Biên Giới Phạm Vi Dự Án

Tài liệu này chưng cất quy trình khai thác yêu cầu thực chiến từ `mattpocock/skills` (`grill-me`, `to-spec`), `obra/superpowers` (`brainstorming`, `writing-plans`) và `product-on-purpose/pm-skills` (`deliver-prd` v3.1).

---

## 1. Nguyên Tắc Số 1: Đọc Ngữ Cảnh Trước Khi Hỏi (`Explore Before Grilling`)

- Khi người dùng yêu cầu **thêm chức năng mới** trên dự án đã tồn tại:
  - Phải tự đọc cấu trúc thư mục, cấu hình hệ thống, tệp `.env.example`, schema cơ sở dữ liệu hoặc tài liệu cũ trong Workspace trước.
  - **Cấm hỏi những câu lười biếng** mà chỉ cần đọc file trong 5 giây là biết (ví dụ: không hỏi *"Dự án đang dùng React hay Vue?"* khi `package.json` đã ghi rõ `"next": "15.x"`).
- Khi người dùng yêu cầu **tạo dự án mới từ con số 0 (Greenfield)**:
  - Tra cứu ngay `agy_search_skills` để xem trong 91 Skills trên máy đã có sẵn Engine, Template, Bộ icon SVG hay Script CLI nào giải quyết được 70–80% khối lượng công việc, tránh tự viết lại từ đầu (*Don't Reinvent the Wheel*).

---

## 2. Kỹ Thuật Phỏng Vấn Điểm Mù Bằng 1 Bảng Quyết Định (`Grill-Me Decision Table`)

Ý tưởng ban đầu của con người thường chỉ mô tả **20% bề nổi ("Happy Path")** và bỏ quên **80% tình huống biên, bảo mật, tải trọng và chi phí vận hành**. Tuy nhiên, nếu hỏi dồn dập 20 câu chữ dài dòng sẽ làm người dùng mệt mỏi.

**Quy chuẩn bắt buộc khi hỏi làm rõ:**
1. Chọn lọc đúng **5 – 7 điểm mù tử huyệt nhất** ảnh hưởng trực tiếp đến kiến trúc, chi phí, dữ liệu hoặc pháp lý/bảo mật.
2. Gom toàn bộ vào **1 Bảng Quyết Định Duy Nhất** gồm 4 cột:
   - `STT & Hạng mục cần chốt`
   - `Vì sao phải chốt trước khi làm? (Rủi ro nếu đoán mò)`
   - `Phương án đề xuất tối ưu [⭐ Khuyên dùng]`
   - `Phương án thay thế (Nếu có)`
3. **Phân tách Quyết định Khóa cứng (`Grillable Now`) vs. Giả định Thử nghiệm (`Prototype Hypothesis`):**
   - Những gì thuộc về dữ kiện sự thật của doanh nghiệp (ngân sách, tên DB, đối tượng khách hàng, quy định pháp lý, quyền phân quyền) $\rightarrow$ **Phải chốt cứng ngay (`Hard Stop`)**.
   - Những gì liên quan đến cảm nhận thẩm mỹ hoặc độ mượt thực tế chưa thể biết chắc trên giấy $\rightarrow$ Ghi nhận thành **Giả định cần kiểm chứng ở Phase 1 Prototype** thay vì tranh cãi lý thuyết kéo dài.

---

## 3. Khóa Biên Giới Phạm Vi 3 Vùng (`3-Zone Scope Boundary Lock`)

Mọi dự án thất bại hoặc đội vốn/trễ hạn đều do **Phình phạm vi (`Scope Creep`)** — đang làm tính năng A lại nảy sinh ý tưởng B, C, D. Trong file `BLUEPRINT_<TEN_DU_AN>.md`, bắt buộc lập bảng khóa cứng 3 vùng:

| Phân Vùng Phạm Vi | Định Nghĩa & Quy Tắc Thực Thi |
| :--- | :--- |
| **1. `In-Scope MVP (P1 — Bắt buộc có ở Bản 1.0)`** | Tập hợp tính năng tối thiểu tạo ra giá trị cốt lõi trọn vẹn đầu tiên, có thể chạy thật và kiểm thử độc lập ngay. |
| **2. `Deferred Next Phases (P2 / P3 — Làm ở giai đoạn sau)`** | Các tính năng nâng cao hợp lý nhưng chưa cần ngay ngày đầu. Thiết kế kiến trúc có chừa sẵn điểm nối (hook/schema), nhưng **cấm viết code P2 khi P1 chưa nghiệm thu xong**. |
| **3. `Out-of-Scope / Anti-Goals (CẤM LÀM)`** | Liệt kê thẳng những thứ dự án này **chủ đích KHÔNG giải quyết** (ví dụ: *"Không tự xây cổng thanh toán thẻ quốc tế riêng mà dùng VietQR"*, *"Không sửa trực tiếp bảng chuẩn `OINV` của SAP B1"*). Đây là hàng rào bảo vệ AI Agent không đi lạc hướng. |

---

## 4. Hợp Đồng Giao Việc Cho AI Agent (`Agent Execution Contract` & `Review Focus`)

Khi bàn giao file Blueprint cho các phiên chat sau (hoặc cho đội Sub-agents thực thi), Agent viết code sẽ không nhớ cuộc trò chuyện hôm nay. Do đó Blueprint bắt buộc khóa rõ 4 điều khoản (chưng cất từ `pm-skills/deliver-prd` & `superpowers/writing-plans`):

1. **Nguồn sự thật tối cao (`Authoritative Sources`):** Tệp tài liệu nào, Database nào hoặc API Docs nào là chuẩn gốc; nếu hai tài liệu mâu thuẫn thì bên nào thắng.
2. **Vùng cấm chạm (`Untouchable Zones`):** Các thư mục, bảng DB, file cấu hình hoặc API đang chạy ổn định tuyệt đối không được tự ý sửa/xóa và lý do vì sao.
3. **5 Bẫy Thực Tế Dễ Vỡ Nhất (`Review Focus — Top 5 Bite Points`):** Liệt kê trước 5 tình huống dữ liệu đầu vào bất thường hoặc lỗi vận hành thực tế dễ xảy ra nhất (ví dụ: mạng chập chờn gửi đúp Webhook thanh toán, tên tiếng Việt có ký tự `đ/Đ` hoặc dấu tổ hợp Unicode NFD, file tải lên quá 50MB, token hết hạn giữa chừng...) và quy định rõ hệ thống phải xử lý thế nào, gắn thẳng vào bài test của Phase tương ứng.
4. **Ngưỡng dừng báo cáo (`Escalation Triggers`):** Khi gặp điều kiện bất thường nào thì Agent thực thi phải dừng lại hỏi người dùng thay vì tự đoán mò.
