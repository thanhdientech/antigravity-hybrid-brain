# Quy Trình 5 Bước Thiết Kế UI/UX Đa Ngành Nghề & Chuyển Đổi Sang Code Giao Diện Phần Mềm / Web (`Design-to-Code`)

## 1. Kiến Trúc Kết Hợp 4 Tầng Trí Tuệ Thiết Kế Của `ui-ux-design-pro-max`

1. **Tầng Suy Luận Ngành Nghề (`01_ui-ux-pro-max` — 192 Ngành & 79 UI Styles):**
   - Dùng `python skills/01_ui-ux-pro-max/scripts/search.py "<ngành nghề / sản phẩm>" --design-system -p "<Tên Dự Án>"` để tra cứu tự động bằng BM25: bố cục trang/màn hình chuẩn ngành, bảng màu tâm lý học, cặp Font Google đã kiểm duyệt giấy phép, loại biểu đồ Dashboard và danh sách Anti-Patterns cấm kỵ của ngành đó (ví dụ: Ngân hàng/Y tế cấm nền tím neon lòe loẹt; ERP cần mật độ bảng dữ liệu cao rõ nét).
2. **Tầng Hệ Thống Giao Diện Thương Hiệu Quốc Tế (`04_awesome-brand-design-md` — 84 Bộ `DESIGN.md`):**
   - Dùng `python scripts/search_brand_design.py "<từ khóa hoặc tên hãng>"` để nạp trực tiếp ngôn ngữ thiết kế thực chiến của 84 thương hiệu đỉnh cao (*Apple, Stripe, Linear, Vercel, Figma, Airbnb, Shopify, Notion, Cursor, Supabase, WIRED, The Verge, Ferrari, SpaceX, Revolut, Wise, IBM...*).
3. **Tầng Kiến Trúc Design Tokens 3 Lớp (`02_design-system-tokens` & `03_ui-styling-shadcn`):**
   - Chuẩn hóa toàn bộ thông số giao diện thành **Primitive Tokens $\rightarrow$ Semantic Tokens (`background`, `surface`, `foreground`, `primary`, `border`, `ring`) $\rightarrow$ Component Tokens** trên CSS Variables / Tailwind CSS v4 / `shadcn/ui`.
4. **Tầng Chỉ Đạo Nghệ Thuật & Lọc Rác AI (`05_frontend-art-direction` & `06_anti-ai-slop-and-patterns`):**
   - Loại bỏ 100% các dấu hiệu giao diện "mùi AI rập khuôn" (`AI Design Slop`: lạm dụng emoji thay icon SVG, thẻ bo góc giống hệt nhau mọi cấp, dải màu tím-hồng vô nghĩa, nhãn ALL-CAPS thừa thãi, độ tương phản thấp dưới `4.5:1`).

---

## 2. Quy Trình 5 Bước Chuyển Thiết Kế Sang Code Phần Mềm & Web (22 Tech Stacks)

### Bước 1 — Khóa Hồ Sơ Kiến Trúc Giao Diện (`design-system/<du-an>/MASTER.md`)
Chạy lệnh sinh và lưu trữ hồ sơ gốc của dự án để giữ đồng nhất xuyên suốt mọi màn hình:
```bash
python skills/01_ui-ux-pro-max/scripts/search.py "ERP manufacturing dashboard" --design-system --persist -p "ProjectSlug"
```
- Nếu dự án muốn đi theo phong cách của một tập đoàn chuẩn quốc tế (ví dụ: *Linear* cho phần mềm quản lý, *Stripe* cho Fintech, *Apple* cho bán lẻ cao cấp, *WIRED* cho cổng tin tức/tạp chí), kết hợp đọc thêm `skills/04_awesome-brand-design-md/brands/<ten-hang>/DESIGN.md`.

### Bước 2 — Tra Cứu Quy Chuẩn Theo Đúng Framework Đích (`--stack`)
Hỗ trợ 22 nền tảng Web, Phần mềm Desktop và Mobile App:
- **Web Frontend & Fullstack:** `html-tailwind`, `react`, `nextjs`, `shadcn`, `vue`, `nuxtjs`, `nuxt-ui`, `angular`, `svelte`, `astro`, `laravel`, `threejs`.
- **Phần mềm Desktop Doanh nghiệp:** `wpf`, `winui3`, `javafx`, `avalonia`, `uno`, `uwp`.
- **Ứng dụng Di động:** `flutter`, `react-native`, `swiftui`, `jetpack-compose`.

```bash
python skills/01_ui-ux-pro-max/scripts/search.py "data table filter pagination" --stack react
python skills/01_ui-ux-pro-max/scripts/search.py "enterprise tableview density" --stack wpf
```

### Bước 3 — Thiết Lập Hệ Thống Semantic Tokens & Icon Vector SVG
- Khai báo biến màu, thang chữ (`Type Scale`), khoảng cách (`Spacing`), bo góc (`Radius`) và đổ bóng (`Elevation`) vào một nguồn duy nhất (`tokens.css` / `tailwind.config` / `ResourceDictionary`).
- **Quy tắc bắt buộc:** Tuyệt đối **KHÔNG dùng Emoji (`🚀`, `✨`, `📊`) làm icon chức năng** trên giao diện phần mềm chuyên nghiệp; bắt buộc dùng **SVG Icons** đồng bộ độ dày nét (`Lucide`, `Phosphor`, `Heroicons`, hoặc bộ 138 SVG inline).

### Bước 4 — Triển Khai Đầy Đủ 5 Trạng Thái Tương Tác Của Giao Diện Phần Mềm
Mọi màn hình phần mềm chuyên nghiệp (Form, Bảng dữ liệu, Dashboard, Modal, Checkout) bắt buộc phải có đủ 5 trạng thái:
1. **`Default / Populated`:** Dữ liệu thực tế, căn lề chuẩn (số tiền/số lượng căn phải `tabular-nums`, mã/tên căn trái), chữ dài tự xuống dòng hoặc cắt elip có tooltip truy cập được.
2. **`Hover / Active / Focus-Visible`:** Vòng focus bàn phím rõ nét, `cursor-pointer` trên mọi phần tử bấm được, hiệu ứng chuyển trạng thái mượt `150ms–220ms` (tôn trọng `prefers-reduced-motion`).
3. **`Loading / Skeleton`:** Khung xương giữ nguyên kích thước chống giật trang (`CLS = 0`).
4. **`Empty State`:** Thông báo rõ nguyên nhân trống + nút hành động khởi tạo đầu tiên (`CTA` động từ chủ động).
5. **`Error / Validation State`:** Báo lỗi cụ thể ngay tại trường nhập liệu kèm hướng dẫn cách sửa ngắn gọn, không chỉ đổi màu viền đơn thuần.

### Bước 5 — Kiểm Định Giao Diện Trước Khi Bàn Giao (`Pre-Delivery Visual & UX Audit`)
- Kiểm tra độ tương phản chữ/nền tối thiểu **`4.5:1`** (văn bản thường) và **`3:1`** (thành phần UI/tiêu đề lớn) ở cả Light Mode & Dark Mode.
- Kiểm tra Responsive / Co giãn khung hình ở 4 mốc chuẩn: **`375px` (Mobile)**, **`768px` (Tablet)**, **`1024px` (Laptop)**, **`1440px+` (Desktop ERP/Dashboard)**.
- Nếu có trình duyệt Headless/Playwright, mở render thực tế và chụp ảnh màn hình đối chứng để đảm bảo `0` lỗi đè chữ, `0` lỗi tràn khung ngang (`overflow-x`).
