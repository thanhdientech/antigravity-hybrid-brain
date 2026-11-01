# 04. Kiểm Toán Landing Page Chuyển Đổi CRO, Phễu Đăng Ký & Sức Thuyết Phục (`landing` — Persuade & CRO Audit)

> Chưng cất từ `coreyhaines31/marketingskills` (`skills/cro/SKILL.md` v2.0.3 & `references/form.md`), `garrytan/gstack` (`Landing Page Hard Rules`), `pbakaus/impeccable` (`mode-persuade.md`), và `tommygeoco/ui-audit` (`24-patterns-social-proof.md`). Áp dụng cho **Landing Page Quảng Cáo (Facebook/Google/TikTok Ads), Sales Page, Trang Sự Kiện/Khóa Học, Trang Bảng Giá (`Pricing Page`) & Phễu Form Thanh Toán VietQR**.

---

## 1. Khung Kiểm Toán 7 Chiều Chuyển Đổi CRO Theo Thứ Tự Tác Động (`7-Dimension CRO Audit`)

### Chiều 1 — Độ Rõ Đề Xuất Giá Trị Trong 5 Giây Đầu & Khớp Thông Điệp Quảng Cáo (`5-Second Value Prop & Message Match` — Trọng số cao nhất)
- **Kiểm tra thực chứng trên màn hình đầu tiên (`Above-the-Fold` ở cả `375x812` và `1440x900`):**
  1. Khách lạ bấm từ quảng cáo vào có hiểu ngay **Sản phẩm/Dịch vụ này là gì — Dành cho ai — Đạt kết quả cụ thể nào — Khác biệt gì** trong vòng `< 5 giây` không cần cuộn trang không?
  2. **Độ khớp thông điệp (`Ad-to-Page Message Match`):** Tiêu đề `<h1>` và hình ảnh Hero có khớp 100% với lời hứa/mức ưu đãi trên mẫu quảng cáo hay làm khách cảm thấy "vào nhầm trang" rồi bấm thoát ngay?
- **3 lỗi giết chết tỷ lệ chuyển đổi ngay từ đầu (`P0 / P1`):**
  - Chỉ liệt kê tính năng kỹ thuật khô khan thay vì **Kết quả đạt được + Nỗi đau được giải quyết** (*"Đạt [Kết quả cụ thể] trong [Thời gian] mà không lo [Rào cản lớn nhất]"*).
  - Giật tít quá trừu tượng/hoa mỹ đánh đổi mất sự rõ ràng (*Clarity > Cleverness*).
  - Bố cục Hero tham lam nhồi nhét như một trang Dashboard (vượt quá **Ngân sách Hero 5 phần tử của `gstack`**: *Thương hiệu + 1 Tiêu đề H1 + 1 Câu bổ trợ ngắn + 1 Cụm CTA chính + 1 Minh họa sản phẩm thật*).

### Chiều 2 — Kỷ Luật Đơn Mục Tiêu & Loại Bỏ Lối Thoát Rò Rỉ (`Single-Goal Focus & Leak Elimination`)
- **Luật Landing Page Chạy Ads (`Persuade Surface`):** Mỗi Landing Page trả phí chỉ phục vụ **1 mục tiêu chuyển đổi duy nhất**.
- **Lỗi rò rỉ khách (`Conversion Leaks` — `P1`):**
  - Giữ nguyên thanh Header Menu 7–8 mục và Footer đầy link sang trang Tin tức / Tuyển dụng / Mạng xã hội ngoài, kéo khách đang định mua hàng đi lạc khỏi phễu.
  - Có `2–3` lời kêu gọi hành động khác mục tiêu cùng tranh giành sự chú ý (ví dụ vừa bắt *"Mua ngay"*, vừa rủ *"Đăng ký nhận bản tin"*, vừa mời *"Theo dõi Fanpage"*).

### Chiều 3 — Vị Trí, Tương Phản & Ngôn Từ Nút Kêu Gọi Hành Động (`CTA Placement, Contrast & Value Copy`)
- **Kiểm tra vị trí:** Nút CTA chính bắt buộc **nhìn thấy ngay trong khung nhìn đầu tiên (`Above-the-fold`) không cần cuộn**, và lặp lại tự nhiên sau các mốc thuyết phục lớn (sau Bằng chứng xã hội, sau Bảng giá, cuối FAQ) + có **Sticky CTA gọn gàng ở đáy màn hình Mobile** với trang dài.
- **Kiểm tra ngôn từ trên nút (`Button Copy Audit`):**
  - ❌ **Yếu / Bị cấm (`P1/P2`):** `"Submit"`, `"Gửi"`, `"Đăng ký"`, `"Tìm hiểu thêm"` (chỉ nói hành động tốn công của khách, không nói giá trị nhận được).
  - ✅ **Mạnh (`[Hành động] + [Giá trị nhận ngay]`):** `"Nhận Báo Giá Trong 5 Phút"`, `"Giữ Vé Ưu Đãi Sớm Ngay"`, `"Dùng Thử Miễn Phí 14 Ngày — Không Cần Thẻ"`.

### Chiều 4 — Kiểm Toán Chi Phí Ma Sát Biểu Mẫu Đăng Ký & Thanh Toán (`Form & Checkout Friction Audit`)
Theo quy luật thực nghiệm từ `marketingskills/cro/references/form.md`, **mỗi ô nhập thêm vào đều làm rớt tỷ lệ hoàn tất biểu mẫu**:
- `<= 3` ô nhập (Ví dụ: *Họ tên + SĐT + Nhu cầu/Gói*): **Mức chuẩn tối ưu (`Baseline`)**.
- `4 – 6` ô nhập: Tỷ lệ điền giảm trung bình `10 – 25%` $\rightarrow$ Phải giải trình rõ từng ô có thực sự bắt buộc trước khi tư vấn hay không.
- `>= 7` ô nhập trải dài trên 1 màn hình: Tỷ lệ bỏ cuộc tăng vọt (`25 – 50%+`) $\rightarrow$ **Lỗi `P1`**: Bắt buộc cắt bỏ các ô có thể hỏi sau hoặc chia thành **Multi-step Wizard** (bước 1 cực dễ chỉ xin Tên/SĐT, có thanh tiến trình `Bước 1/2`).
- **6 Luật Vàng Cho Form Chuyển Đổi Cao:**
  1. **Luôn có `<label>` hiển thị cố định phía trên ô nhập** (cấm dùng mỗi `placeholder` làm nhãn vì khi khách bấm vào gõ chữ thì `placeholder` biến mất làm khách quên đang điền ô gì!).
  2. Bố cục **1 cột dọc duy nhất (`Single-column`)** để mắt không phải đảo zíc-zắc trái-phải và tương thích hoàn hảo trên Mobile.
  3. Gộp *Họ và Tên* thành **1 ô duy nhất** (trừ khi hệ thống CRM bắt buộc tách).
  4. Ngay sát nút Submit phải có **1 dòng giảm lo âu vi mô (`Micro-reassurance`)**: *"Cam kết bảo mật 100%, không gọi làm phiền"* / *"Mất 30 giây — Giữ chỗ miễn phí"*.
  5. Nếu có thanh toán **QR VietQR**: Mã QR phải sắc nét, có nút **"Sao chép Số tài khoản"** và **"Sao chép Nội dung chuyển khoản"** 1 chạm kèm phản hồi `"Đã sao chép ✓"`, tuyệt đối không bắt khách tự gõ tay dãy mã đơn dài trên điện thoại.
  6. **Bảo mật Tracking Pixel / CAPI (`GEMINI.md` Ngành 2 & 7):** Tuyệt đối **cấm** để lộ `Meta CAPI Access Token` hoặc `TikTok Events API Secret` ngay trong mã HTML/JS phía trình duyệt (`Frontend`); mọi sự kiện Server-side CAPI bắt buộc đi qua Backend/Webhook trung gian.

### Chiều 5 — Bằng Chứng Xã Hội & Đảo Ngược Rủi Ro Đặt Đúng Điểm Chốt (`Social Proof & Risk Reversal`)
- **Kiểm tra tính xác thực:** Lời chứng thực (`Testimonials`) phải có tên thật, chức danh/ngành nghề hoặc bối cảnh cụ thể và con số/kết quả rõ ràng. Cảnh báo ngay các khối đánh giá giả kiểu `"Nguyễn Văn A — ★★★★★ Dịch vụ rất tuyệt vời!"` vì khách hàng hiện đại nhận ra ngay và mất sạch niềm tin.
- **Kiểm tra vị trí:** Social Proof, cam kết hoàn tiền/bảo hành (`Risk Reversal`) và huy hiệu an toàn phải đặt **ngay cạnh khu vực Bảng giá và Biểu mẫu đăng ký** (nơi nhịp tim và sự do dự của khách lên cao nhất), không phải giấu tít dưới đáy trang.

### Chiều 6 — Hóa Giải Phản Đối & Minh Bạch Bảng Giá (`Objection Handling & Pricing Clarity`)
- Trang đã trả lời thẳng 4 câu hỏi cản đường mua hàng chưa: *(1) Chi phí bao nhiêu / Có phí ẩn không? (2) Có phù hợp với trường hợp cụ thể của tôi không? (3) Triển khai/sử dụng có khó không? (4) Nếu không hiệu quả thì chính sách bảo vệ tôi là gì?*
- Nếu có Bảng giá (`3` gói): Phải làm nổi bật rõ **1 gói Khuyên Dùng (`Recommended / Phổ biến nhất`)** và nêu rõ gói đó dành cho quy mô khách nào.

### Chiều 7 — Phân Cấp Thị Giác & Nhịp Đọc Quét (`Visual Hierarchy & Squint Test`)
- **Bài test nheo mắt (`Squint Test`):** Làm mờ màn hình đi 50% — nếu chỉ còn thấy đúng **Tiêu đề chính** và **Nút CTA chính** nổi lên rõ nhất thì phân cấp thị giác ĐẠT; nếu mọi thẻ Card, viền màu, nút phụ đều sáng rực ngang nhau thì THẤT BẠI (`P1`).
- Mỗi Section trên Landing Page chỉ đảm nhiệm **1 nhiệm vụ thuyết phục duy nhất** (*One job per section*).
