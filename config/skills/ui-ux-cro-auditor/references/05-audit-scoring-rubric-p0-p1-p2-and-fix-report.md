# 05. Khung Chấm Điểm Thực Chứng `A–F`, Bộ Nhận Diện `AI Slop` & Mẫu Báo Cáo Kiểm Toán `P0 / P1 / P2`

> Chưng cất từ `garrytan/gstack` (`Phase 6 Dual Headline Scoring` & `AI Slop 11 Blacklist Patterns`), `narenkatakam/ux-audit` (`Review Template`), `addyosmani/web-quality-skills` (`Evidence-Led Audit Output`), và `pbakaus/impeccable` (`Audit Health Score`).

---

## 1. Bộ Nhận Diện 12 Dấu Hiệu Giao Diện "Rác Công Nghiệp AI" (`AI Slop Detection Checklist`)

Một giao diện dù không có lỗi code nhưng mắc từ **`>= 3` dấu hiệu dưới đây** sẽ khiến khách hàng đánh giá sản phẩm rẻ tiền, thiếu đầu tư thương hiệu (bị hạ bậc **`AI Slop Grade`** xuống `C / D / F`):

1. **Gradient Tím – Chàm – Xanh Dương Mặc Định (`Purple/Indigo AI Gradient`):** Màu nền hoặc chữ chuyển sắc tím-hồng-xanh mặc định mà không thuộc bộ nhận diện thương hiệu gốc.
2. **Lưới 3 Cột Icon Trong Vòng Tròn Màu Lặp Lại Cơ Học (`Cookie-Cutter 3-Col Icon Circle Grid`):** Biểu tượng nhỏ nằm trong hình tròn nền nhạt + Tiêu đề in đậm + 2 dòng mô tả bằng nhau chằn chặn lặp lại đối xứng.
3. **Dùng Emoji Thay Icon Hệ Thống (`Emoji-as-UI-Icons` — Lỗi cấm tuyệt đối của `ux-audit` & `GEMINI.md`):** Chèn 🚀, ✨, 🔥, 💡, ✅, 🗑️ vào tiêu đề mục, thẻ tính năng hoặc nhãn nút bấm thay vì bộ SVG đồng nhất 1 nét vẽ (`Lucide / Heroicons / Phosphor`).
4. **Căn Giữa Mọi Thứ Vô Tội Vạ (`Center-Everything Disease`):** Căn giữa cả đoạn văn dài nhiều dòng, danh sách bullet và thẻ dữ liệu làm mắt người đọc mất trục neo bên trái.
5. **Bo Góc Tròn Xoe Đồng Loạt & Thẻ Lồng Trong Thẻ (`Uniform Bubbly Radius & Nested Cards`):** Mọi khung lớn nhỏ đều bo `rounded-2xl` giống hệt nhau; nhét Card có bóng đổ nằm chồng bên trong một Card khác cũng có viền và bóng đổ (*App UI ghép từ đống thẻ rời rạc thay vì bố cục không gian*).
6. **Viền Trái Đậm Màu Trên Thẻ Bo Tròn (`[border-accent-on-rounded]`):** Kiểu `border-left: 4px solid #6366f1` trên hộp `border-radius: 12px` — dấu vân tay kinh điển của giao diện do LLM sinh tự động.
7. **Khẩu Hiệu Mở Đầu Sáo Rỗng Vô Hồn (`Generic AI Hero Copy`):** *"Khám phá sức mạnh toàn diện của..."*, *"Giải pháp tất cả trong một giúp nâng tầm..."*, *"Chào mừng bạn đến với kỷ nguyên mới..."*.
8. **3 Con Số To Đùng Không Kiểm Chứng Dưới Hero (`Fake Vanity Counters`):** `"10,000+ Khách hàng"`, `"99.9% Hài lòng"`, `"24/7 Hỗ trợ"` đặt thành 3 cột số giả tạo khi chưa có nguồn dữ liệu thực chứng.
9. **Nút Kêu Gọi Hành Động Chính Phủ Gradient Lòe Loẹt:** Nút CTA chính dùng dải màu cầu vồng thay vì 1 màu đặc (`Solid Brand Accent`) có độ tương phản sắc nét.
10. **Lạm Dụng Kính Mờ Khắp Mọi Nơi (`Frosted-Glass Everywhere`):** Đổ `backdrop-filter: blur()` lên hàng chục thẻ làm tụt FPS cuộn trang trên điện thoại Android tầm trung thay vì chỉ dùng đúng 1 lớp tạo chiều sâu (như Sticky Header hoặc Modal).
11. **Đốm Màu Trôi Nổi & Sóng SVG Trang Trí Vô Nghĩa (`Decorative Blobs & Wavy Dividers`):** Nhét hình tròn mờ phát sáng (`radial-glow`) để lấp khoảng trống thay vì tinh chỉnh nhịp chữ và hình ảnh sản phẩm thật.
12. **Bỏ Mặc Phông Chữ Mặc Định Hệ Thống Trên Trang Thương Hiệu (`system-ui` Give-up):** Không chọn cặp phông chữ có cá tính và hỗ trợ dấu tiếng Việt chuẩn (`Be Vietnam Pro`, `Plus Jakarta Sans`, `Inter` cho UI dữ liệu + `tabular-nums`).

---

## 2. Công Thức Chấm Điểm Theo Trọng Số Từng Bề Mặt (`Surface-Weighted Scorecard 0–100 & Grade A–F`)

Khi xuất báo cáo kiểm toán tổng thể, chấm điểm thang `100` theo đúng trọng số của bề mặt đang xét:

| Nhóm Tiêu Chí Kiểm Toán | Trọng Số `webapp` | Trọng Số `mobile` | Trọng Số `corporate` | Trọng Số `landing` |
| :--- | :---: | :---: | :---: | :---: |
| **1. Logic Tương Tác, Form, State & Không Lỗi Console/Link** | **`35%`** | `20%` | `15%` | `20%` |
| **2. Thích Ứng Đa Khung Hình, Vùng Chạm `44px` & Không Cuộn Ngang** | `15%` | **`40%`** | `20%` | `20%` |
| **3. Phân Cấp Thị Giác, Đề Xuất Giá Trị `<5s`, CTA & Tối Ưu CRO** | `15%` | `15%` | `20%` | **`35%`** |
| **4. Kiến Trúc Điều Hướng (`Trunk Test`), Uy Tín, CWV & WCAG 2.2 AA** | `20%` | `15%` | **`30%`** | `15%` |
| **5. Độ Tinh Tế Hệ Thiết Kế, Microcopy & Sạch Bóng `AI Slop`** | `15%` | `10%` | `15%` | `10%` |
| **Tổng Cộng** | **`100%`** | **`100%`** | **`100%`** | **`100%`** |

### Thang Quy Đổi Hạng Chữ (`Letter Grade A–F`):
- **Hạng `A` (`90 – 100` điểm, `0` lỗi `P0`, `<= 1` lỗi `P1` nhỏ):** Sẵn sàng chạy Production / đổ ngân sách Ads lớn.
- **Hạng `B` (`80 – 89` điểm, `0` lỗi `P0`):** Vận hành an toàn, cần xử lý vài điểm ma sát `P1` để tối ưu chuyển đổi/trợ năng.
- **Hạng `C` (`70 – 79` điểm):** Dùng được ở mức cơ bản nhưng còn rò rỉ chuyển đổi, thiếu trạng thái biên hoặc mang dáng dấp template chung chung.
- **Hạng `D` (`50 – 69` điểm):** Nhiều lỗi vỡ khung Mobile, kẹt Form hoặc vi phạm WCAG nặng — **chưa được phép Go-live / chạy Ads**.
- **Hạng `F` (`< 50` điểm hoặc có từ `>= 2` lỗi `P0` chặn luồng):** Hỏng luồng thao tác cốt lõi — bắt buộc sửa `P0` ngay lập tức.

---

## 3. Mẫu Báo Cáo Kiểm Toán Chuẩn Thực Chứng (`Standard Evidence-Led Audit Report Template`)

Mỗi lần người dùng yêu cầu kiểm toán giao diện, trình bày gọn, sắc bén, đi thẳng vào giải pháp theo cấu trúc:

```markdown
## 🔬 Báo Cáo Kiểm Toán Giao Diện & Chuyển Đổi (`Surface: <webapp | mobile | corporate | landing>`)

- **Đối tượng & Phương pháp đo:** `<Đường dẫn File/URL>` | `<Quét tĩnh mã nguồn + Đo DOM Headless 375/768/1440>`
- **Điểm Tổng Thể:** **`<XX>/100 (Hạng <A-F>)`** | **Điểm Sạch AI Slop:** **`Hạng <A-F>`** | **Thiện Cảm Krug Goodwill:** **`<XX>/100`**
- **Tổng hợp lỗi:** `P0 (Chặn luồng): <N>` · `P1 (Quan trọng): <N>` · `P2 (Tinh chỉnh): <N>`

### ✅ Điểm Đang Làm Tốt (Giữ Nguyên Phát Huy)
- [Nêu 2–3 điểm thực tế trong code/giao diện đã làm chuẩn để không sửa nhầm cái đang tốt]

### 🚨 Danh Sách Lỗi Ưu Tiên Sửa Ngay (Tối Đa Top 7 Hạng Mục Tác Động Lớn Nhất)
| Mức | Mã & Tên Lỗi | Tọa Độ File:Dòng / Selector & Bằng Chứng Đo Thật | Tác Động Tới Người Dùng / Đơn Hàng | Cách Sửa Cụ Thể (Code / Thiết Kế) |
| :-: | :--- | :--- | :--- | :--- |
| **P0** | ... | `[File:L120]` hoặc `[375x812: scrollWidth=462px > 375px]` | ... | ... |
| **P1** | ... | ... | ... | ... |
| **P2** | ... | ... | ... | ... |
```

> **Quy tắc đạo đức kiểm toán (`Zero Fabrication`):** Chỉ báo cáo đúng những gì đo được từ mã nguồn hoặc trình duyệt thật; nếu chưa chạy đo tốc độ mạng thực tế (`CrUX`) thì ghi rõ *"Kiểm tra cấu trúc CWV trên mã/DOM cục bộ"*, tuyệt đối không tự bịa số mili-giây `LCP` hay tỷ lệ `%` tăng doanh số khống.
