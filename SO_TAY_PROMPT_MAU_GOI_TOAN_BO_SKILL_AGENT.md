# Sổ Tay Prompt Mẫu Gọi Chuẩn Toàn Bộ 94 Skill Trên Antigravity & Javis

Tài liệu này tổng hợp các **Prompt mẫu thực chiến (Copy & Paste điền khung `[...]` dùng ngay)** cho toàn bộ **94 Kỹ năng (Skills)** đang hoạt động trong hệ thống của anh (`35 Global Skills` + `50 Plugin Skills` + `9 Builtin Skills`). Mỗi mẫu câu lệnh đã được thiết kế sẵn đủ **Từ khóa kích hoạt (`Trigger`)** và **Dữ kiện đầu vào bắt buộc**, giúp AI Agent bắt đúng công cụ và thực thi chuẩn ngay lần đầu tiên mà không cần dừng lại hỏi bổ sung thông tin cơ bản.

> [!IMPORTANT]
> **QUY TẮC BƯỚC 0 BẮT BUỘC KHI TẠO PROJECT MỚI HOẶC LÀM CHỨC NĂNG MỚI (`BLUEPRINT-FIRST RULE`):**
> Mỗi khi bắt đầu **một dự án mới** (Phần mềm, Website, SEO, Marketing/Ads, Bảo mật, Server/VPS, ERP SAP B1/Beas, Học tập/Sản phẩm số) hoặc **thêm một chức năng / phân hệ lớn mới**, anh **luôn gọi [`project-blueprint-architect`](file:///C:/Users/INFOASIA/.gemini/config/skills/project-blueprint-architect/SKILL.md) ĐẦU TIÊN** (xem **Bước 0** ngay bên dưới). Agent sẽ đóng vai **CEO + CPO + Kiến trúc sư trưởng** phỏng vấn gỡ điểm mù (`Grill-Me`) và xuất ra **1 file chốt yêu cầu duy nhất (`BLUEPRINT_<TEN_DU_AN>.md`)** quy định rõ *Yêu cầu chức năng (`FR/NFR`) + Công nghệ sử dụng + Từng Phase gọi đúng Skill nào trong 94 Skills + Prompt thực thi từng Phase*. Chốt xong file này mới bắt đầu làm!

> [!TIP]
> **Công Thức Vàng 4 Thành Phần Khi Giao Việc Cho Agent:**
> `1. Chỉ định tên Skill (hoặc từ khóa chuyên ngành)` + `2. Bối cảnh / Ngành nghề & Dữ liệu đầu vào thật` + `3. Công nghệ / Tiêu chuẩn mong muốn` + `4. Định dạng File đầu ra & Thư mục lưu`.
> Với các dự án lớn, anh có thể gõ kèm lệnh tắt của giao diện chat như `/plan` (lập kế hoạch từng bước trước khi làm), `/grill-me` (phỏng vấn chốt quyết định thiết kế), `/boost` (suy luận đa chiều & kiểm chứng sâu), `/goal` (chạy bền bỉ đến khi hoàn tất 100%), `/browser` (tương tác trình duyệt), hoặc `/schedule` (đặt lịch chạy tự động).

---

## 🏛️ BƯỚC 0 BẮT BUỘC — Lên Kế Hoạch & Chốt 1 File Master Blueprint Trước Khi Làm — [`project-blueprint-architect`](file:///C:/Users/INFOASIA/.gemini/config/skills/project-blueprint-architect/SKILL.md)

*Hợp nhất tinh hoa từ 4 kho chuẩn quốc tế (`obra/superpowers`, `mattpocock/skills`, `github/spec-kit`, `product-on-purpose/pm-skills`). Tuyệt đối không viết code/thiết kế hấp tấp khi chưa khóa xong file `BLUEPRINT_<TEN_DU_AN>.md`.*

**Mẫu 0A — Khởi tạo một Dự Án Mới từ ý tưởng ban đầu (Áp dụng cho cả 8 ngành: Phần mềm, Web, SEO, Marketing, Bảo mật, Server, ERP, Học tập):**
```text
Dùng skill `project-blueprint-architect` đóng vai CEO & Kiến trúc sư trưởng lập Master Blueprint cho dự án mới: [Tên dự án, VD: Hệ thống Web App Quản lý Bảo hành & Tra cứu QR / Chiến dịch SEO + Google Ads B2B / Triển khai VPS + ERP SAP B1].
- Lĩnh vực: [Phần mềm / Website-LP / SEO-GEO / Marketing-Ads / Bảo mật / Server-VPS / ERP SAP B1-Beas / Học tập-Sản phẩm số].
- Mục tiêu kinh doanh & Người dùng chính: [Mô tả ngắn gọn bài toán anh muốn giải quyết].
- Ràng buộc sẵn có (nếu có): [Ngân sách / Hạ tầng Server / Ngôn ngữ muốn dùng].

Yêu cầu:
1. TUYỆT ĐỐI CHƯA VIẾT CODE HAY LÀM THỰC THI NGAY.
2. Áp dụng checklist chuyên ngành của skill để phỏng vấn ngược lại anh (Grill-Me) bằng 1 Bảng Quyết Định gọn 5–7 điểm mù quan trọng nhất kèm phương án `[⭐ Khuyên dùng]`.
3. Sau khi anh chốt bảng quyết định, hãy xuất 1 file đặc tả hoàn chỉnh duy nhất tại `[Đường dẫn/BLUEPRINT_TEN_DU_AN.md]` (gồm In-Scope/Out-of-Scope, FR/NFR, 5 tình huống biên dễ vỡ, sơ đồ kiến trúc Mermaid, Tech Stack, lộ trình từng Phase ánh xạ chính xác vào các Skill trong 93 Skills trên máy và bộ Prompt mẫu cho từng Phase), rồi chạy `validate_blueprint.py` kiểm định đạt Exit code 0.
```

**Mẫu 0B — Xây dựng thêm một Chức Năng / Phân Hệ Mới vào Dự Án đang có sẵn:**
```text
Dùng skill `project-blueprint-architect` khảo sát trước toàn bộ mã nguồn / cấu trúc hiện tại trong thư mục `[Đường dẫn dự án đang có]` để lên kế hoạch bổ sung chức năng mới: `[Tên chức năng mới, VD: Phân quyền RBAC + Thanh toán VietQR tự động / Cảnh báo lệch giá thành WIP 154 qua Telegram]`.
Yêu cầu: Không hỏi lại những gì code đã có; chỉ lập 1 Bảng Grill-Me hỏi anh các điểm ngã rẽ nghiệp vụ & vùng cấm chạm (Untouchable Zones), sau đó chốt ra 1 file `[Đường dẫn/BLUEPRINT_TEN_CHUC_NANG.md]` ánh xạ rõ công nghệ + tên Skill thực thi từng Phase và kiểm định bằng `validate_blueprint.py` đạt Exit code 0 trước khi sửa bất kỳ dòng code nào.
```

---

## Bảng Tra Nhanh: Muốn Làm Gì — Chuyển Tới Nhóm Nào?

| Nhu Cầu Thực Tế Của Anh | Các Skill Chủ Lực Sẽ Kích Hoạt | Đi Tới Mục |
| :--- | :--- | :--- |
| **🏛️ [BƯỚC 0] Tạo Project mới hoặc Chức năng mới — Phỏng vấn chốt 1 file Master Blueprint** | `project-blueprint-architect` *(Ánh xạ công nghệ & lộ trình 94 Skills cho 8 ngành)* | **Bước 0** |
| **Làm & Kiểm toán giao diện Web App thao tác chức năng (User/Admin/ERP/SaaS), Mobile Responsive, Web Doanh Nghiệp, Landing Page CRO, WordPress, Webcake** | `webapp-app-ux-workflow`, `ui-ux-cro-auditor`, `ui-ux-design-pro-max`, `generative_ui`, `design-landingpage-vip-v2`, `wordpress-flatsome-designer`, `html-to-webcake`, `gsap-skills` | **Nhóm 1** |
| **Thiết kế Logo SVG, Bộ nhận diện CIP, Banner Ads, Báo giá PDF A4, Hồ sơ năng lực, Tạp chí** | `brand-editorial-graphic-studio` *(5 Modules đồ họa & chế bản in ấn)* | **Nhóm 2** |
| **Kiểm toán SEO / AI Search (GEO), Chạy Google Ads, Tối ưu CRO, Vẽ chân dung khách, Viết Content, Ebook** | `claude-seo`, `google-ads-master`, `chan-dung-khach-hang-9-phan`, `cong-thuc-viet-content-by-noti-v4`, `tao-san-pham-so-bang-ai` | **Nhóm 3** |
| **Kiểm tra Bảo mật Web/Code/API, Tái lập phần mềm sạch (Craft Anything), Dịch ngược phần mềm (REA), Kiểm toán AI, Tra nguồn, Nạp tài liệu, Check Update Git** | `security-audit`, `craft-anything`, `reverse-engineer-anything`, `ifixai-agent-auditor`, `verified-source-researcher`, `lean-teamwork`, `nap-tai-lieu-antigravity`, `prompts-chat` + 9 Builtin/SDK | **Nhóm 4** |
| **Quay màn hình hướng dẫn + Giọng AI `.SRT`, Làm Video Khoa học/Kỹ thuật/Vũ trụ (Manim + Remotion), Làm phim AI, Hoạt hình màu nước, Video Shopee, Xây kênh YouTube/FB** | `deeptutor-cli`, `recordly-tutorial-ai`, `lam-phim-video-master`, `video-storytelling`, `cinematic-video-prompt`, `create-and-edit-video`, `painted-animation`, `kinetic-reel`, `shopee-affiliate-video-studio`, `yt-shortcode-commander`, `antigravity-browser-controller` | **Nhóm 5** |
| **Truy vấn SQL 4 Server / 19 DB SAP B1, Viết FMS / TransactionNotification, Giá thành Beas WIP 154** | `sql-sap-b1`, `viet-sql-sap-b1`, `sap-b1-beas` | **Nhóm 6** |
| **Lập lá số Tử Vi Đẩu Số, Bát Tự 24 Tiết Khí, Thần Số Học Pythagoras & Xuất 10 Hồ sơ Mệnh Thư** | `tu-vi-bat-tu-than-so-hoc` | **Nhóm 7** |
| **Nghiên cứu arXiv/RAG đa engine (`DeepTutor`), Quản lý Google Drive/Docs/Sheets/Slides, Lập trình App Android, Nghiên cứu Khoa học & Y Sinh Quốc tế** | `deeptutor-cli`, `gdrive`, `gdocs`, `gsheets`, `gslides`, `android-cli`, `compose-preview` + 39 Skills `science` (`PubMed`, `AlphaFold`, `ClinVar`...) | **Nhóm 8** |

---

## Nhóm 1 — Thiết Kế Giao Diện Web App Thao Tác Chức Năng (`Operate Mode`), Mobile App, Landing Page & Hiệu Ứng

### 1.0. Kiến Trúc Luồng Thao Tác UX, Logic State/URL & CRUD Cho Web App (User/Admin/ERP/SaaS) & Mobile App — [`webapp-app-ux-workflow`](file:///C:/Users/INFOASIA/.gemini/config/skills/webapp-app-ux-workflow/SKILL.md)
*Hợp nhất tinh hoa từ 8 kho Design Engineering chuẩn quốc tế (`pbakaus/impeccable` v4.8.0 `Operate Mode`, `emilkowalski/skill` `break-ui`, `vercel-labs/web-interface-guidelines` + `agent-skills`, `carmahhawwari/ui-design-brain` 60+ SaaS Components, `ibelick/ui-skills`, `callstack` React Navigation & `flutter` GoRouter). Chuyên trị **Web App người dùng/Admin thao tác chức năng thực tế** — tách biệt hoàn toàn với web xem tin/quảng cáo thông thường.*

**Mẫu 1.0A — Thiết kế & code Web App Người Dùng / Trang Quản Trị Admin / ERP / SaaS có luồng thao tác chặt chẽ:**
```text
Kết hợp skill `webapp-app-ux-workflow` (kiểm soát luồng thao tác `Operate Mode` & logic State) và `ui-ux-design-pro-max` (hệ màu & token ngành nghề) để thiết kế và lập trình phân hệ Web App: [Tên phân hệ, VD: Cổng Quản lý Đơn hàng & Duyệt Chi Phí Đa Cấp / Portal Khách hàng Tra cứu & Gửi Yêu cầu Bảo hành].
- Vai trò sử dụng & Phân quyền (RBAC): [VD: Nhân viên tạo phiếu, Trưởng phòng duyệt <= 50 triệu, Admin toàn quyền; nút vượt thẩm quyền phải Disabled kèm Tooltip nêu rõ lý do].
- Công nghệ (Stack): [VD: Next.js / React + Tailwind CSS + shadcn/ui HOẶC HTML + Tailwind + JS thuần].
- Luồng nghiệp vụ chính cần làm: [VD: Danh sách lọc đa tiêu chí -> Xem/Sửa nhanh trên Slide-over Drawer cạnh phải -> Tạo mới qua Multi-step Wizard 3 bước -> Duyệt hàng loạt & Xóa an toàn qua AlertDialog].
Yêu cầu bắt buộc theo `webapp-app-ux-workflow`:
1. Dùng App Shell `100dvh` (`min-h-dvh`), thang chữ `rem` gọn sắc nét chuẩn `Operate Mode`, tìm kiếm nhanh `⌘K`.
2. Đồng bộ bộ lọc, tìm kiếm, tab, phân trang và ngăn kéo chi tiết lên URL Query Params (`URL-as-State`) để F5 hoặc gửi link không mất ngữ cảnh.
3. Bảng dữ liệu bật `tabular-nums` căn phải cột số/tiền, có thanh `Bulk Action Bar`; Form gắn `type="button"` cho mọi nút phụ, chống bấm đúp Submit, cảnh báo rời trang khi sửa dở (`Dirty-state Guard`) và đủ 8 trạng thái UI (kể cả Actionable Empty State).
4. Kiểm định mã nguồn bằng `audit_webapp_ux.py --strict` đạt Exit code 0 trước khi bàn giao tại `[Đường dẫn thư mục dự án]`.
```

**Mẫu 1.0B — Thiết kế Luồng Màn hình & Điều hướng chuẩn cho Mobile App (`iOS / Android`):**
```text
Dùng skill `webapp-app-ux-workflow` (tài liệu `04-mobile-app-navigation-gestures-responsive-shell.md`) thiết kế kiến trúc điều hướng và giao diện thao tác cho ứng dụng di động: [Tên App, VD: App Nhân viên Kho Quét Mã & Kiểm Kê / App Đặt lịch & Theo dõi Dịch vụ].
- Nền tảng: [React Native Expo / Flutter GoRouter / Kotlin Jetpack Compose / Mobile Web App PWA].
- Các luồng màn hình chính: [VD: 4 Bottom Tabs giữ nguyên trạng thái cuộn (Stateful Tabs), luồng Stack chi tiết đơn, và Bottom Form Sheet cho bộ lọc/nhập ghi chú nhanh].
Yêu cầu: Đảm bảo vùng chạm tối thiểu `44x44pt` / `48x48dp`, cỡ chữ ô nhập `>= 16px` (chống lỗi tự zoom trên iOS), tôn trọng `SafeAreaInsets`, tự đẩy Form lên trên bàn phím ảo và đủ trạng thái Offline / Retry.
```

**Mẫu 1.0C — Thử lửa phá giao diện với dữ liệu xấu nhất (`Break-UI`) & Quét lỗi logic UI tự động:**
```text
Dùng skill `webapp-app-ux-workflow` (quy trình `05-gia-co-edge-cases-harden-va-break-ui.md` & công cụ `scripts/audit_webapp_ux.py`) kiểm định và gia cố toàn bộ giao diện Web App tại `[Đường dẫn thư mục code UI]`:
1. Chạy `audit_webapp_ux.py` phát hiện và sửa sạch 12 nhóm lỗi thao tác (nút trong `<form>` thiếu `type`, `<div onClick>` liệt phím Tab, mất vòng `focus-visible`, `100vh` che nút đáy mobile, bảng thiếu `tabular-nums`, chặn Paste...).
2. Gia cố chống vỡ khung với dữ liệu cực hạn (`Break-UI`): tên tiếng Việt dài 120 ký tự (`min-w-0` + `truncate`), chuỗi mã/URL không khoảng trắng, số tiền hàng trăm tỷ, mảng rỗng `[]` và lỗi mạng `401/422/500` không làm mất dữ liệu người dùng vừa nhập.
```

---

### 1.1. Thiết Kế Giao Diện Phần Mềm & Web App 192 Ngành — [`ui-ux-design-pro-max`](file:///C:/Users/INFOASIA/.gemini/config/skills/ui-ux-design-pro-max/SKILL.md)
*Hợp nhất 6 module: 192 quy tắc ngành nghề, 22 frameworks (`React`, `Next.js`, `HTML+Tailwind`, `Vue`, `Flutter`, `WPF`, `WinUI 3`...), kiến trúc Token 3 tầng, `shadcn/ui`, **84 hồ sơ `DESIGN.md` thương hiệu lớn** (`Stripe`, `Linear`, `Apple`, `Vercel`, `Notion`, `Shopify`, `Supabase`...) và bộ lọc chống giao diện AI rập khuôn (`no-ai-design-slop`).*

**Mẫu 1A — Tạo mới giao diện Web App / Dashboard / Phần mềm ERP theo ngành:**
```text
Dùng skill `ui-ux-design-pro-max` thiết kế và viết code giao diện cho dự án: [Tên phần mềm, VD: Hệ thống Quản trị Sản xuất & Kho MES/ERP].
- Ngành nghề: [VD: ERP Manufacturing & Inventory / Fintech / Phòng khám / SaaS B2B].
- Công nghệ (Stack): [VD: Next.js + Tailwind + shadcn/ui HOẶC 1 file HTML + Tailwind CSS hoàn chỉnh].
- Chế độ màu: [VD: Sáng nhã nhặn chuyên nghiệp doanh nghiệp + hỗ trợ Dark Mode].
- Các màn hình / khu vực cần dựng: [VD: Sidebar thu gọn, 4 thẻ KPI tồn kho/lệnh sản xuất, Biểu đồ tiến độ chuyền, Bảng danh sách Lệnh sản xuất có lọc/tìm kiếm/phân trang].
Yêu cầu: Chạy tra cứu Design System khóa file `MASTER.md` trước khi code, dùng 100% SVG icons (không dùng emoji), bật `tabular-nums` cho cột số liệu/tiền tệ, xử lý đủ 5 trạng thái (Default, Hover, Loading, Empty, Error) và lưu tại `[Đường dẫn thư mục dự án]`.
```

**Mẫu 1B — Áp phong cách giao diện của 84 tập đoàn lớn (`Stripe`, `Linear`, `Apple`, `Vercel`...):**
```text
Dùng skill `ui-ux-design-pro-max` (module `04_awesome-brand-design-md`) tra cứu hồ sơ `DESIGN.md` của thương hiệu [VD: Linear.app / Stripe / Apple / Vercel / Airbnb / Notion], sau đó thiết kế lại giao diện trang [VD: Dashboard quản lý dự án / Trang bảng giá SaaS] trong thư mục `[Đường dẫn code hiện tại]` theo đúng hệ màu, font chữ, độ bo góc, đổ bóng và khoảng cách của hệ thống thiết kế đó.
```

**Mẫu 1C — Kiểm định & tân trang giao diện cũ, xóa bỏ mùi "giao diện AI rập khuôn":**
```text
Dùng skill `ui-ux-design-pro-max` (module `06_anti-ai-slop-and-patterns`) kiểm định toàn bộ giao diện tại `[Đường dẫn thư mục hoặc file HTML/React]`. Chỉ ra các lỗi bố cục rập khuôn AI, thiếu phân cấp thị giác, lỗi tương phản dưới 4.5:1 hoặc vỡ khung mobile 375px, sau đó sửa trực tiếp code để nâng cấp giao diện đạt chuẩn sản phẩm thương mại thực tế.
```

---

### 1.2. Vẽ Khung Giao Diện & Biểu Đồ Tương Tác Trực Tiếp — [`generative_ui`](file:///C:/Users/INFOASIA/.gemini/antigravity/builtin/skills/generative_ui/SKILL.md)
```text
Dùng `generative_ui` dựng một bảng mô phỏng tương tác trực quan cho [VD: Máy tính điểm hòa vốn ROAS & Lợi nhuận ròng theo ngân sách quảng cáo / Sơ đồ luồng quy trình sản xuất SAP B1 -> Beas] có thanh trượt điều chỉnh tham số thời gian thực.
```

---

### 1.3. Thiết Kế Landing Page VIP Có Form, Đếm Ngược, VietQR & CAPI — [`design-landingpage-vip-v2`](file:///C:/Users/INFOASIA/.gemini/config/skills/design-landingpage-vip-v2/SKILL.md)
```text
Dùng skill `design-landingpage-vip-v2` thiết kế trọn bộ Landing Page chuyển đổi cao (1 file HTML hoàn chỉnh + các trang chính sách đi kèm) cho:
- Sản phẩm / Sự kiện: [VD: Khóa học / Hội thảo / Phần mềm / Dịch vụ X].
- Phong cách giao diện: [VD: Liquid Glass hiện đại mặc định / Tối sang trọng].
- Giá bán & Ưu đãi: [VD: Giá gốc 2.900.000đ, ưu đãi còn 990.000đ, có đồng hồ đếm ngược].
- Cổng đăng ký & Thanh toán: Form thu Lead + Tạo mã QR thanh toán VietQR tự động (Ngân hàng: `[Tên NH]`, STK: `[Số TK]`, Chủ TK: `[Tên chủ TK]`).
- Tracking chuyển đổi: Gửi sự kiện [Meta CAPI / TikTok Events API / Dual-tracking] qua Backend Webhook URL `[URL Webhook n8n/Server]` (tuyệt đối không để lộ Access Token ở frontend), dùng bộ icon SVG có sẵn của skill, 100% tiếng Việt có dấu, lưu vào `[Đường dẫn thư mục]`.
```

---

### 1.4. Thiết Kế Website WordPress Theme Flatsome 3.x Chuẩn UX Builder — [`wordpress-flatsome-designer`](file:///C:/Users/INFOASIA/.gemini/config/skills/wordpress-flatsome-designer/SKILL.md)
```text
Dùng skill `wordpress-flatsome-designer` viết mã giao diện chuẩn 100% cây Shortcodes nguyên bản của Flatsome UX Builder (`[section]`, `[row]`, `[col]`, `[ux_banner]`, `[ux_products]` — không dùng HTML thuần thay thế khối chính) cho trang: [VD: Trang chủ Showroom Ô tô / Trang giới thiệu doanh nghiệp B2B].
- Cấu trúc các khối cần có: [VD: Hero Banner full-width, 4 điểm mạnh thương hiệu, Danh mục sản phẩm nổi bật, Bảng thông số kỹ thuật, Đánh giá khách hàng, Form nhận báo giá].
- Màu chủ đạo: `[Mã màu HEX]`. Xuất file mã Shortcode để dán trực tiếp vào UX Builder và file CSS bổ trợ cho `flatsome-child`.
```

---

### 1.5. Chuyển File HTML Sang File `.pke` Mở Trên Webcake — [`html-to-webcake`](file:///C:/Users/INFOASIA/.gemini/config/skills/html-to-webcake/SKILL.md)
```text
Dùng skill `html-to-webcake` chuyển đổi trang HTML tại `[Đường dẫn file .html]` sang file định dạng `.pke` để mở chỉnh sửa kéo-thả trực tiếp trên nền tảng Webcake. Yêu cầu giữ nguyên bố cục đa cột, màu sắc, cỡ chữ, hình ảnh và chạy checklist thẩm mỹ đầy đủ trước khi xuất file `.pke`.
```

---

### 1.6. Lập Trình Hiệu Ứng Chuyển Động Web 60fps Bằng GSAP — [`gsap-skills`](file:///C:/Users/INFOASIA/.gemini/config/skills/gsap-skills/SKILL.md)
```text
Dùng skill `gsap-skills` bổ sung hiệu ứng chuyển động mượt 60fps cho trang web tại `[Đường dẫn file HTML/React]`:
- Hiệu ứng yêu cầu: [VD: Hero text xuất hiện từng chữ bằng SplitText, cuộn trang ghim khung sản phẩm bằng ScrollTrigger, chuyển đổi bố cục thẻ mượt bằng GSAP Flip].
- Yêu cầu kỹ thuật: Quản lý bộ nhớ chuẩn `gsap.context()` / `useGSAP()`, hỗ trợ `prefers-reduced-motion` và không gây giật lag trên điện thoại.
```

---

### 1.7. Mở Nhanh Bảng Điều Khiển Sidecar Trên IDE — [`ui-plugin-navigation`](file:///C:/Users/INFOASIA/.gemini/antigravity/builtin/skills/ui-plugin-navigation/SKILL.md)
```text
Dùng `ui-plugin-navigation` kiểm tra các bảng giao diện plugin (sidecar panels) đang có trên máy và hiển thị nút mở nhanh 1 chạm cho công việc [VD: Xem cấu trúc phân tử 3D / Điều khiển thiết bị Android / Xem trước Jetpack Compose].
```

---

### 1.8. Kiểm Toán Độc Lập Logic UI Web App, Responsive Mobile, Web Doanh Nghiệp & CRO Landing Page — [`ui-ux-cro-auditor`](file:///C:/Users/INFOASIA/.gemini/config/skills/ui-ux-cro-auditor/SKILL.md)
*Hợp nhất tinh hoa từ 6 kho kiểm toán UI/UX/CRO chuẩn quốc tế (`garrytan/gstack` 138k★ `/qa` + `/design-review`, `addyosmani/web-quality-skills` CWV + WCAG 2.2 AA, `coreyhaines31/marketingskills` 57k★ `cro` + `site-architecture`, `pbakaus/impeccable` `audit` + `critique` + `AI Slop`, `narenkatakam/ux-audit` Norman/Krug/Nielsen, `tommygeoco/ui-audit` 55-point QA) kèm công cụ CLI `audit_ui_ux_cro.py` quét tĩnh HTML/JSX/CSS + lái Headless Chrome/Edge qua CDP đo thực tế trên 3 màn hình (`375x812`, `768x1024`, `1440x900`).*

**Mẫu 1.8A — Kiểm toán Logic UI Web App (User / Admin / SaaS / ERP) & Responsive Mobile 3-Viewport (`--live --screenshots`):**
```text
Dùng skill `ui-ux-cro-auditor` chạy kiểm toán Logic UI Web App & Responsive Mobile cho dự án tại `[Đường dẫn thư mục hoặc URL đang chạy, VD: http://localhost:3000]`:
1. Chạy công cụ `audit_ui_ux_cro.py "[Đường dẫn/URL]" --surface webapp --live --screenshots "audit_shots"` để quét mã nguồn tĩnh kết hợp đo thực tế trên Headless Browser ở 3 khung hình (`375x812` Mobile, `768x1024` Tablet, `1440x900` Desktop).
2. Kiểm tra đầy đủ 6 cổng `Operate Mode`: 8 trạng thái UI, nút trong `<form>` thiếu `type="button"`, `<input type="number">` bị trôi số khi cuộn chuột, bảng thiếu `tabular-nums`, mất vòng `focus-visible`, tràn ngang mobile, ô nhập `< 16px` tự zoom trên iOS và vùng chạm `< 44x44px`.
3. Xuất Báo cáo Kiểm toán phân hạng `P0 -> P1 -> P2` kèm ảnh chụp bằng chứng 3 màn hình, điểm Scorecard `0–100 (A–F)` và sửa trực tiếp code đạt hạng `A (>= 90/100)`.
```

**Mẫu 1.8B — Kiểm toán Website Doanh Nghiệp (B2B / B2C Corporate Trust, Kiến Trúc Điều Hướng, Core Web Vitals & WCAG 2.2 AA):**
```text
Dùng skill `ui-ux-cro-auditor` (`--surface corporate`) kiểm toán toàn diện Website Doanh nghiệp tại `[Đường dẫn code hoặc URL]`:
- Kiểm tra Krug's 6-Point Trunk Test, kiến trúc điều hướng `4–7` mục (luật 3-Click), tín hiệu uy tín B2B/B2C (MST, địa chỉ thật, Case Study số liệu thật thay cho khẩu hiệu chung chung "Happy Talk"), tốc độ tải CWV (`LCP / INP / CLS`), chuẩn tiếp cận WCAG 2.2 AA và bộ lọc 12 dấu hiệu `AI Design Slop`.
- Xuất bảng lỗi kèm tọa độ file/dòng hoặc selector DOM cụ thể và đề xuất bản vá tối ưu.
```

**Mẫu 1.8C — Kiểm toán Tối Ưu Tỷ Lệ Chuyển Đổi (`CRO Audit`) & Bảo Mật Tracking Cho Landing Page Bán Hàng / Sự Kiện:**
```text
Dùng skill `ui-ux-cro-auditor` (`--surface landing --live`) kiểm toán chuyển đổi CRO 7 chiều cho Landing Page tại `[Đường dẫn file HTML hoặc URL]`:
1. Đánh giá bài test 5 giây Above-the-Fold, độ khớp thông điệp quảng cáo (Message Match), rò rỉ điều hướng khỏi mục tiêu chuyển đổi duy nhất (Attention Ratio 1:1), sức mạnh văn bản nút CTA, ma sát trường Form (3 vs 4–6 vs 7+ ô) và bằng chứng xã hội / cam kết hoàn tiền sát nút bấm.
2. Quét lỗi kỹ thuật trang đích: hiển thị Mobile `375x812`, luồng thanh toán VietQR và kiểm tra an toàn đảm bảo tuyệt đối KHÔNG lộ Meta CAPI / TikTok Events API Access Token ở mã nguồn Frontend HTML/JS.
```

---

## Nhóm 2 — Thiết Kế Logo SVG, Bộ Nhận Diện CIP, Banner Ads, Báo Giá & Tạp Chí

Toàn bộ nhóm này được điều phối bởi Siêu Hub **[`brand-editorial-graphic-studio`](file:///C:/Users/INFOASIA/.gemini/config/skills/brand-editorial-graphic-studio/SKILL.md)** (5 Modules chuyên sâu + trình kết xuất PDF A4 vector & PNG nét cao).

### 2.1. Thiết Kế Logo Vector SVG & Bộ Nhận Diện Thương Hiệu CIP 50+ Ấn Phẩm
```text
Dùng skill `brand-editorial-graphic-studio` (module `01_logo-cip-icon-social`) thiết kế Logo Vector SVG chuẩn hình học và Bộ nhận diện thương hiệu (CIP) cho:
- Tên thương hiệu: `[Tên thương hiệu]` | Slogan (nếu có): `[Slogan]`.
- Ngành nghề: `[VD: Giải pháp Phần mềm ERP Công nghiệp / Bất động sản cao cấp / F&B / Mỹ phẩm]`.
- Tính cách & Tông màu mong muốn: `[VD: Tin cậy, hiện đại, sắc sảo; tông Xanh Navy đậm & Vàng đồng]`.
- Hạng mục cần xuất:
  1. File Logo Vector `.svg` gốc dựng trên lưới `512x512` đủ 4 biến thể (Full Color, Đen đơn sắc, Trắng âm bản trên nền tối, Biểu tượng Mark-only dùng làm Favicon 16x16px).
  2. Bộ ấn phẩm CIP đồng bộ gồm: `[VD: Namecard 2 mặt, Tiêu đề thư A4 Letterhead, Phong bì thư, Thẻ nhân viên, Folder kẹp tài liệu]` kèm trang HTML Brand Showcase và xuất ảnh PNG/PDF xem trước vào `[Đường dẫn thư mục]`.
```

### 2.2. Lập Cuốn Cẩm Nang Thương Hiệu (Brand Guidelines Book) & Đồng Bộ Token Web
```text
Dùng skill `brand-editorial-graphic-studio` (module `02_brand-guidelines-sync`) biên soạn cuốn Brand Guidelines Book chuẩn A4 PDF và xuất bộ `design-tokens.css` đồng bộ sang Web/App dựa trên Logo tại `[Đường dẫn file logo.svg]` và bảng màu thương hiệu `[Các mã màu HEX]`. Nội dung gồm: Quy chuẩn vùng an toàn Logo, các trường hợp cấm vi phạm, hệ màu CMYK/RGB/HEX, hệ thống Typography tiếng Việt và quy tắc ứng dụng hình ảnh.
```

### 2.3. Thiết Kế Banner Quảng Cáo Đa Kênh (Meta/Google/TikTok), Poster & Minh Họa
```text
Dùng skill `brand-editorial-graphic-studio` (module `03_banner-poster-illustration`) thiết kế bộ Banner quảng cáo cho chiến dịch `[Tên chiến dịch]`:
- Kích thước cần xuất: `[VD: 1080x1080 vuông Feed, 1080x1920 dọc Story/TikTok, 1200x628 ngang Website/Link Ads]`.
- Thông điệp chính (Headline): `[Câu tiêu đề ngắn gọn]` | Nút kêu gọi (CTA): `[VD: Nhận Báo Giá Ngay]`.
- Phong cách nghệ thuật: `[VD: Tech Minimalist / Luxury Editorial / Minh họa Vector phẳng]`.
Yêu cầu: Đặt nội dung chính trong vùng an toàn trung tâm 75%, dùng tối đa 2 font hỗ trợ chuẩn tiếng Việt, giữ diện tích chữ dưới 20% khung hình cho Meta/TikTok Ads và kết xuất ra file PNG độ phân giải cao tại `[Thư mục lưu]`.
```

### 2.4. Thiết Kế Báo Giá Thương Mại (Quotation), Hồ Sơ Năng Lực & Proposal Thầu (PDF/DOCX/PPTX)
```text
Dùng skill `brand-editorial-graphic-studio` (module `05_quotation-proposal-office-docs`) thiết kế và xuất file Báo Giá Thương Mại chuẩn in ấn A4 PDF (kèm bản `.docx` nếu cần chỉnh sửa) theo thông tin thật sau:
- Đơn vị báo giá: `[Tên công ty anh, MST, Địa chỉ, Hotline, Logo tại đường dẫn ...]`.
- Khách hàng nhận báo giá: `[Tên công ty khách hàng, Người nhận, Ngày báo giá, Hiệu lực báo giá]`.
- Bảng hạng mục hàng hóa / dịch vụ:
  1. `[Hạng mục 1 — ĐVT — Số lượng — Đơn giá]`
  2. `[Hạng mục 2 — ĐVT — Số lượng — Đơn giá]`
- Chiết khấu: `[X%]` | Thuế GTGT (VAT): `[8% hoặc 10%]` | Điều khoản thanh toán: `[VD: Đợt 1 tạm ứng 50%, Đợt 2 nghiệm thu 50%]`.
Yêu cầu bắt buộc: Kiểm tra bằng Python chính xác tuyệt đối 100% phép nhân `Thành tiền = SL x Đơn giá` và `Tổng thanh toán`, dàn trang Paged CSS `@page A4` gắn `break-inside: avoid` để không bao giờ bị cắt đôi bảng tổng tiền hay khung chữ ký giữa 2 trang, sạch 100% nhãn nội bộ AI.
```

### 2.5. Dàn Trang Tạp Chí Đa Cột, Catalogue Sản Phẩm & Sách Bằng Paged CSS / Typst
```text
Dùng skill `brand-editorial-graphic-studio` (module `04_magazine-editorial-typst`) dàn trang cuốn `[Catalogue sản phẩm / Tạp chí nội bộ / Ebook chuyên khảo]` khổ A4 đa cột từ nội dung tại `[Đường dẫn file nội dung .md/.docx]` và thư mục ảnh `[Đường dẫn ảnh]`. Áp dụng phong cách biên tập `[VD: Swiss International Grid / Modern Corporate Magazine]`, đánh số trang tự động, mục lục rõ ràng và xuất ra file PDF chất lượng in ấn.
```

---

## Nhóm 3 — Kiểm Toán SEO / AI Search (GEO), Google Ads, Copywriting & Marketing

### 3.1. Kiểm Toán SEO Toàn Diện & Tối Ưu Tìm Kiếm AI (GEO) — [`claude-seo`](file:///C:/Users/INFOASIA/.gemini/config/skills/claude-seo/SKILL.md)
*Hỗ trợ đầy đủ 19 chế độ `/seo ...`: Technical SEO, Core Web Vitals (INP), E-E-A-T, Schema JSON-LD, AI Overviews / ChatGPT / Perplexity (`llms.txt`), Topic Cluster, Local SEO và E-commerce SEO.*

**Mẫu 3.1A — Kiểm toán SEO tổng thể Website hoặc 1 Trang đích:**
```text
Dùng skill `claude-seo` chạy kiểm toán toàn diện (`/seo audit` kết hợp `/seo technical` và `/seo schema`) cho website: `[Điền URL website cần kiểm toán]`.
- Loại hình website: `[VD: B2B SaaS / Thương mại điện tử / Dịch vụ địa phương]`.
- Từ khóa mục tiêu chính: `[Từ khóa 1, Từ khóa 2]`.
Hãy thu thập dữ liệu DOM & HTTP Headers thực tế, chỉ ra các lỗi nghiêm trọng theo thứ tự ưu tiên (Critical -> High -> Medium -> Low), kiểm tra Core Web Vitals/INP và sinh sẵn đoạn mã Schema.org JSON-LD chuẩn Rich Results để dán vào web.
```

**Mẫu 3.1B — Tối ưu để Website được ChatGPT, Google AI Overviews & Perplexity trích dẫn (GEO):**
```text
Dùng skill `claude-seo` chạy chế độ `/seo geo` và `/seo agentic` cho `[Điền URL website cần kiểm toán]`. Đánh giá mức độ dễ trích dẫn bởi các công cụ AI Search, đề xuất chỉnh sửa cấu trúc nội dung chuẩn E-E-A-T và khởi tạo sẵn file `llms.txt` hoàn chỉnh cho website.
```

**Mẫu 3.1C — Gom cụm từ khóa Pillar/Cluster & lập dàn ý bài viết chuẩn SEO:**
```text
Dùng skill `claude-seo` chạy `/seo cluster` và `/seo content-brief` cho chủ đề hạt giống: `[VD: Phần mềm quản trị sản xuất ERP cho nhà máy gỗ/nhựa]`. Xây dựng bản đồ kiến trúc Pillar - Cluster chống ăn thịt từ khóa và xuất Content Brief chi tiết (Title, Meta, cấu trúc H1-H3, Internal Links, FAQ Schema) cho bài Pillar chính.
```

---

### 3.2. Thiết Lập, Kiểm Toán Rò Rỉ Ngân Sách A1–A14 & Tối Ưu Google Ads / CRO — [`google-ads-master`](file:///C:/Users/INFOASIA/.gemini/config/skills/google-ads-master/SKILL.md)
*Siêu Hub 12 bộ skill điều phối trọn vòng đời Google Ads thực chiến & kiểm toán tối ưu chuyển đổi trang đích (CRO).*

**Mẫu 3.2A — Kiểm toán tài khoản Google Ads đang chạy & tìm điểm rò rỉ tiền (A1–A14):**
```text
Dùng skill `google-ads-master` (bộ `google-ads-measurement` và `google-ads-audit`) kiểm toán dữ liệu báo cáo tài khoản Google Ads tại thư mục `[Đường dẫn chứa file CSV/XLSX xuất từ Google Ads]`:
1. Kiểm tra cổng đo lường Conversion Tracking xem có bị đếm trùng chuyển đổi (double-counting) hoặc sai Primary Action không.
2. Chạy kiểm toán sức khỏe A1–A14 và báo cáo rò rỉ ngân sách (`money_leak_report.py`), xuất báo cáo `AUDIT.html` và danh sách từ khóa phủ định (Negative Keywords) cần chặn ngay. Lưu kết quả vào thư mục dự án `[Đường dẫn <workdir> riêng]`.
```

**Mẫu 3.2B — Phân tích file CSV Keyword Planner ra Excel 6 Sheets & Lập kế hoạch ngân sách:**
```text
Dùng skill `google-ads-master` (bộ `keyword-analysis`, `google-ads-plan` và `google-ads-builder-search`) xử lý file từ khóa xuất từ Google Keyword Planner tại `[Đường dẫn file .csv]`:
- Sản phẩm / Dịch vụ: `[Tên sản phẩm]` | Khu vực chạy: `[VD: TP.HCM & Hà Nội]` | Ngân sách dự kiến: `[VD: 30.000.000đ/tháng]`.
Yêu cầu: Không tự bịa bất kỳ con số Volume/CPC nào ngoài file CSV gốc; gom nhóm từ khóa theo 3 giai đoạn hành trình khách hàng (Quan tâm -> Cân nhắc -> Mua hàng) ra file Excel 6 sheets (kiểm tra 0 lỗi công thức), lập dự báo CPA/ROAS và xuất file cấu trúc chiến dịch Google Ads Editor CSV ở trạng thái an toàn `PAUSED`.
```

**Mẫu 3.2C — Kiểm toán Tối ưu Tỷ lệ Chuyển đổi Trang đích (CRO Audit):**
```text
Dùng skill `google-ads-master` (bộ `toi-uu-chuyen-doi-web`) kiểm toán tỷ lệ chuyển đổi (CRO) cho trang đích `[URL trang đích]` đang chạy quảng cáo cho nhóm từ khóa `[Từ khóa quảng cáo]`. Chấm điểm độ khớp thông điệp (Message Match), bài test 3 giây đầu tiên, tín hiệu tin cậy (Trust Signals), tốc độ tải trang và xuất bảng HTML CRO Dashboard kèm danh sách Quick Wins sửa ngay để tăng tỷ lệ ra đơn.
```

---

### 3.3. Vẽ Chân Dung Khách Hàng Thực Chiến 9 Phần — [`chan-dung-khach-hang-9-phan`](file:///C:/Users/INFOASIA/.gemini/config/skills/chan-dung-khach-hang-9-phan/SKILL.md)
```text
Dùng skill `chan-dung-khach-hang-9-phan` phân tích sâu chân dung khách hàng mục tiêu cho sản phẩm: `[Tên sản phẩm/dịch vụ & mức giá]`.
- Thông tin khách hàng thực tế anh đang có: `[Mô tả tệp khách hiện tại, độ tuổi, nghề nghiệp, lý do họ hay mua hoặc hay từ chối, hoặc đường dẫn file ghi chú khảo sát]`.
Hãy lập đầy đủ 9 phần theo đúng thứ tự chuẩn (Chốt phân khúc -> Bản đồ thấu cảm 6 vùng của 1 người thật -> 4 nhóm Jobs -> 3 kiểu Pains -> 4 mức Gains -> Top 3 ưu tiên -> 3 góc bán hàng thực chiến), đánh dấu rõ đâu là dữ kiện thật và đâu là giả định cần kiểm chứng.
```

---

### 3.4. Viết Content Bán Hàng & Quảng Cáo Theo 14 Công Thức — [`cong-thuc-viet-content-by-noti-v4`](file:///C:/Users/INFOASIA/.gemini/config/plugins/content-writing-by-noti-plugin/skills/cong-thuc-viet-content-by-noti-v4/SKILL.md)
```text
Dùng skill `cong-thuc-viet-content-by-noti-v4` viết bài quảng cáo chuyển đổi cao theo thông tin sau:
- Sản phẩm / Dịch vụ: `[Tên SP/DV]` | Ngành nghề: `[VD: B2B SaaS / Mỹ phẩm / Thời trang / F&B / Khóa học / BĐS / Sức khỏe / Tài chính / TMĐT]`.
- Kênh đăng (Platform): `[VD: Facebook Ads / TikTok Shop / Shopee / Landing Page / Google Ads / Email / LinkedIn]`.
- Công thức muốn dùng: `[VD: PAS / AIDA / BAB / FAB / 4Cs / Storytelling — hoặc nhờ AI chọn công thức tối ưu nhất]`.
- Khách hàng mục tiêu & Nỗi đau chính: `[Mô tả ngắn]`.
- Điểm khác biệt độc nhất (USP) & Bằng chứng thật: `[Số liệu thật / Bảo hành / Chứng nhận]`.
- Giá / Ưu đãi & Kêu gọi hành động (CTA): `[VD: Đăng ký dùng thử 7 ngày miễn phí]`.
Yêu cầu kèm thêm 5 biến thể câu mở đầu (Hook Variations) để test A/B quảng cáo.
```

---

### 3.5. Đóng Gói Kinh Nghiệm Thật Thành Sản Phẩm Số (Ebook / Workbook / Template) — [`tao-san-pham-so-bang-ai`](file:///C:/Users/INFOASIA/.gemini/config/skills/tao-san-pham-so-bang-ai/SKILL.md)
```text
Dùng skill `tao-san-pham-so-bang-ai` đồng hành cùng anh tạo một sản phẩm số `[Ebook / Workbook / Bộ Template thực hành]` từ kinh nghiệm thực tế của anh trong lĩnh vực `[VD: Triển khai ERP cho nhà máy sản xuất / Quản trị tài chính cá nhân]`.
Hiện tại anh đang ở giai đoạn: `[Chưa chốt ngách / Đã có chủ đề và muốn lên khung tam giác 3 phần Tư duy - Chiến lược - Thực thi]`. Hãy hỏi anh để khai thác câu chuyện thật (tuyệt đối không tự bịa câu chuyện cá nhân) và viết cuốn chiếu từng chương một.
```

---

## Nhóm 4 — Bảo Mật, Dịch Ngược Phần Mềm (REA), Kiểm Toán AI, Chống Ảo Giác & Quản Trị Hệ Thống

### 4.1. Rà Soát Bảo Mật & Kiểm Thử Lỗ Hổng Chuyên Sâu — [`security-audit`](file:///C:/Users/INFOASIA/.gemini/config/skills/security-audit/SKILL.md)
*Hỗ trợ 2 chế độ rõ ràng: **Guidance Mode** (rà soát nhanh 1 file/API không sinh thư mục phụ) và **Full Audit Mode** (kiểm toán toàn diện 6 pha độc lập toàn bộ kho mã nguồn, xuất báo cáo lỗ hổng có bằng chứng dòng code & bản vá nhỏ nhất).*

**Mẫu 4.1A — Rà soát nhanh lỗ hổng cho 1 Module / API / Lộ Khóa Bí Mật (`Guidance Mode`):**
```text
Dùng skill `security-audit` ở chế độ `Guidance mode` kiểm tra bảo mật trực tiếp cho các file tại `[Đường dẫn thư mục API / Auth / Webhook]`. Tập trung rà soát: nguy cơ lộ API Key/Secret/Token, lỗi phân quyền (Auth Bypass / IDOR), SQL Injection, Command Injection, XSS, CSRF và SSRF. Chỉ báo cáo các lỗ hổng vi phạm ranh giới tin cậy thực tế (trust boundary) kèm tọa độ dòng code và cách vá gọn nhất.
```

**Mẫu 4.1B — Kiểm toán bảo mật toàn diện 6 pha cho toàn bộ Dự án (`Full Audit Mode`):**
```text
Dùng skill `security-audit` chạy chế độ `Full audit mode` toàn diện cho kho mã nguồn tại `[Đường dẫn gốc của Repository]` và lưu báo cáo thẩm định an toàn ra thư mục ngoài dự án tại `[VD: E:\Security_Audits\<Ten_Repo>\run-1]`. Yêu cầu tuân thủ nghiêm ngặt quy tắc chỉ đọc trên mã nguồn gốc, xác minh từng lỗ hổng có bằng chứng thực tế và xếp hạng mức độ ưu tiên khắc phục.
```

---

### 4.1C. Dịch Ngược & Bóc Tách Phần Mềm Đóng Gói / Nhị Phân (`.exe`, Electron `.asar`, `.NET`, `APK`, `PyInstaller`, `API`) — [`reverse-engineer-anything`](file:///C:/Users/INFOASIA/.gemini/config/skills/reverse-engineer-anything/SKILL.md)
```text
Dùng skill `reverse-engineer-anything` (REA CLI / MCP tại `E:\DIEN APP\Skill AI\rea`) phân tích và bóc tách tệp đóng gói tại `[Đường dẫn file .exe / app.asar / .dll / .apk]`:
1. Nhận diện chính xác kiến trúc đóng gói (Electron ASAR, .NET Managed, PyInstaller, Native C++/Rust hay NSIS Installer).
2. Bóc tách lớp ứng dụng cốt lõi (bỏ qua thư viện bên thứ 3), trích xuất sơ đồ thuật toán / cấu trúc API endpoint liên quan đến tính năng `[Tên tính năng muốn nghiên cứu]`.
3. Tái tạo lại tính năng đó bằng mã nguồn sạch 100% (`Clean-Room Rewrite`) viết bằng `[Python / TypeScript]` lưu tại `[Thư mục dự án mới]`.
```

---

### 4.1D. Nghiên Cứu & Tái Lập Phần Mềm / Website Phòng Sạch 4 Bước — [`craft-anything`](file:///C:/Users/INFOASIA/.gemini/config/skills/craft-anything/SKILL.md)
```text
Dùng skill `craft-anything` (Rust Engine 302 tools, CLI/MCP tại `E:\DIEN APP\Skill AI\craft-anything\bin\craft-anything-cli.exe` hoặc Desktop GUI `craft-anything.exe`) để nghiên cứu và tái lập sản phẩm tại `[URL website / đường dẫn file app .exe / apk / thư mục game]`:
1. Chế độ thực thi: Chọn `[Clean room (mặc định - không đọc trộm code gốc) / Deep mode (soi sâu decompile/Ghidra)]`.
2. Quy trình 4 bước:
   - Bước 1 (Tìm hiểu): Đo đạc layout ở 3 độ phân giải (Mobile, Tablet, Desktop), ghi nhận cấu trúc DOM, màu sắc, font chữ và các luồng tương tác UX chính.
   - Bước 2 (Xây dựng): Dựng một dự án mã nguồn sạch mới bằng `[React + Tailwind / Next.js / Rust / Godot / Vue]` tại thư mục `[Đường dẫn dự án mới]`.
   - Bước 3 (Kiểm tra): Tự động render, đối chiếu ảnh chụp màn hình bản dựng mới với bản gốc để đo độ lệch.
   - Bước 4 (Hoàn thiện): Tinh chỉnh CSS/logic cho đến khi đạt độ tương đồng cao nhất mà không sao chép trái phép bất kỳ mã nguồn độc quyền nào.
```

---

### 4.2. Kiểm Toán Độc Lập Chất Lượng AI Theo 5 Trụ Cột — [`ifixai-agent-auditor`](file:///C:/Users/INFOASIA/.gemini/config/skills/ifixai-agent-auditor/SKILL.md)
```text
Dùng skill `ifixai-agent-auditor` chạy kiểm toán độc lập (cấm tự chấm điểm) cho sản phẩm đầu ra tại `[Đường dẫn file báo cáo / kịch bản CSV / mã nguồn]` đối chiếu với tài liệu gốc tại `[Đường dẫn nguồn gốc]`. Chấm điểm đầy đủ 5 trụ cột (P1 Bịa đặt Fabrication, P2 Đánh lừa Deception, P3 Thao túng Manipulation, P4 Thiếu nhất quán Unpredictability, P5 Mập mờ nguồn Opacity) và xuất Bảng điểm Scorecard hạng A–F.
```

---

### 4.3. Tra Cứu & Kiểm Chứng Nguồn Sự Thật Cấp 1 Chống Ảo Giác — [`verified-source-researcher`](file:///C:/Users/INFOASIA/.gemini/config/skills/verified-source-researcher/SKILL.md)
```text
Dùng skill `verified-source-researcher` kiểm chứng độc lập toàn bộ số liệu, trích dẫn, văn bản pháp luật và đường link trong tài liệu `[Đường dẫn file .md/.docx]` (hoặc tra cứu chủ đề `[Chủ đề cần nghiên cứu]`). Yêu cầu:
- Kiểm tra trạng thái sống `HTTP 200`, mã `DOI / PMID / ISBN` thật bằng CLI của skill.
- Định vị đủ 4 tọa độ (Ở đâu — File/Sách/Văn bản nào — Trang/Dòng/Điều khoản nào — Của tác giả/Cơ quan nào) kèm câu trích nguyên văn không quá 25 từ và xuất Bảng ánh xạ nguồn 6 cột. Hạng mục nào chưa có tài liệu chính thống phải ghi rõ "Không có thông tin".
```

---

### 4.4. Điều Phối Đa Tác Tử Tinh Gọn Cho Dự Án Lớn — [`lean-teamwork`](file:///C:/Users/INFOASIA/.gemini/config/skills/lean-teamwork/SKILL.md)
```text
Dùng skill `lean-teamwork` (chế độ `Multi-Agent Lean Mode`) lập kế hoạch chia nhỏ dự án `[Tên dự án lớn đa module]` tại `[Đường dẫn workspace]` thành các thẻ việc nguyên tử (Atomic Task Cards). Thực thi cuốn chiếu từng hạng mục nhỏ, chạy kiểm thử độc lập đạt `Exit code 0` xong trọn vẹn phần 1 mới chuyển sang phần 2.
```

---

### 4.5. Nạp Tài Liệu Mới, Tạo Skill & Kiểm Tra Cập Nhật Từ Git Gốc — [`nap-tai-lieu-antigravity`](file:///C:/Users/INFOASIA/.gemini/config/skills/nap-tai-lieu-antigravity/SKILL.md)
```text
Dùng skill `nap-tai-lieu-antigravity` nạp toàn bộ tài liệu chuyên môn mới trong thư mục `[Đường dẫn chứa file PDF/DOCX/XLSX/SQL]` để tạo mới (hoặc nâng cấp) skill `[Tên skill muốn tạo, VD: ke-toan-gia-thanh-tt99]` ở tầng `[Global (dùng mọi dự án) HOẶC On-Demand (chỉ nạp khi gọi)]`. Yêu cầu tuân thủ đủ 5 bước chuẩn Bộ Não Lai Javis: băm nhỏ vào `references/`, giữ `SKILL.md` tinh gọn kèm khối `JAVIS_TRIGGER_ARCHIVE` và chạy đồng bộ kiểm định `agy_sync_and_audit_skills` đạt 0 lỗi.
```

**Mẫu kiểm tra nhanh xem các Skill trên máy có bản cập nhật mới từ GitHub gốc không:**
```text
Chạy công cụ `C:\Users\INFOASIA\.gemini\config\scripts\check_skill_git_updates.py --changelog` để kiểm tra xem các kho Skill trên máy có bản cập nhật mới nào từ GitHub gốc không, liệt kê các thay đổi mới và chỉ nâng cấp an toàn vào `references/` & `scripts/` (giữ nguyên Frontmatter Tiếng Việt và khối `JAVIS_TRIGGER_ARCHIVE` của `SKILL.md`).
```

---

### 4.6. Săn & Tối Ưu System Prompt Từ Kho 2,627 Mẫu Quốc Tế — [`prompts-chat`](file:///C:/Users/INFOASIA/.gemini/config/skills/prompts-chat/SKILL.md)
```text
Dùng skill `prompts-chat` tra cứu trong kho 2,627 mẫu Awesome Prompts và 31 chương sách kỹ thuật Prompt Engineering về chủ đề `[VD: Kiến trúc sư giải pháp SQL / Biên kịch phim tài liệu / Kiểm toán tài chính]`, sau đó nâng cấp câu lệnh thô sau của anh thành một System Prompt có cấu trúc chặt chẽ, chống ảo giác và ép định dạng đầu ra chuẩn: "[Dán câu prompt thô của anh]".
```

---

### 4.7. Các Skill Hệ Thống Antigravity Builtin & Agent SDK (8 Skills Quản Trị)

| Tên Skill | Đường Dẫn Gốc | Mẫu Câu Lệnh Gọi Chuẩn |
| :--- | :--- | :--- |
| **`google-antigravity-sdk`** | [`SKILL.md`](file:///C:/Users/INFOASIA/.gemini/config/plugins/google-antigravity-sdk/SKILL.md) | ``Dùng `google-antigravity-sdk` thiết kế và viết code hệ thống AI Agent tự hành bằng Python SDK cho bài toán [Mô tả tác vụ], có xử lý công cụ và kiểm soát lỗi.`` |
| **`automation`** | [`SKILL.md`](file:///C:/Users/INFOASIA/.gemini/antigravity/builtin/skills/automation/SKILL.md) | ``Dùng skill `automation` thiết lập tác vụ tự động chạy định kỳ vào lúc [VD: 08:00 sáng thứ Hai hàng tuần] để thực hiện công việc: [Mô tả việc cần tự động hóa].`` |
| **`workflow-skill-creator`** | [`SKILL.md`](file:///C:/Users/INFOASIA/.gemini/config/plugins/science/skills/workflow_skill_creator/SKILL.md) | ``Dùng `workflow-skill-creator` đóng gói toàn bộ quy trình các bước anh em mình vừa thực hiện thành công trong phiên làm việc này thành một Skill tái sử dụng tên là `[ten-skill-moi]`.`` |
| **`agy-customizations`** | [`SKILL.md`](file:///C:/Users/INFOASIA/.gemini/antigravity/builtin/skills/agy-customizations/SKILL.md) | ``Dùng `agy-customizations` hướng dẫn và cấu hình [Rule / Hook / MCP Server] mới cho Antigravity để tự động kiểm tra [Điều kiện] mỗi khi Agent sửa code.`` |
| **`plugin`** | [`SKILL.md`](file:///C:/Users/INFOASIA/.gemini/antigravity/builtin/skills/plugin/SKILL.md) | ``Dùng skill `plugin` đóng gói bộ Skill, MCP Server và Rules tại `[Đường dẫn]` thành một gói Plugin độc lập có thể bật/tắt gọn gàng trên Antigravity.`` |
| **`antigravity-guide`** | [`SKILL.md`](file:///C:/Users/INFOASIA/.gemini/antigravity/builtin/skills/antigravity_guide/SKILL.md) | ``Dùng `antigravity-guide` tra cứu cú pháp chuẩn của `agy` CLI và các phím tắt / tính năng mới trên Antigravity 2.0 cho tác vụ `[Tên tính năng]`.`` |
| **`migrate-workflows`** | [`SKILL.md`](file:///C:/Users/INFOASIA/.gemini/antigravity/builtin/skills/migrate-workflows/SKILL.md) | ``Dùng `migrate-workflows` quét các file workflow cũ trong dự án `[Đường dẫn]` và chuyển đổi an toàn sang chuẩn `SKILL.md` mới.`` |
| **`run-workflow` & `permissioned-github`** | [`run-workflow`](file:///C:/Users/INFOASIA/.gemini/antigravity/builtin/skills/run-workflow/SKILL.md) / [`github`](file:///C:/Users/INFOASIA/.gemini/antigravity/builtin/skills/permissioned-github/SKILL.md) | ``Viết kịch bản điều phối đa bước chuẩn `run-workflow` cho tác vụ `[Tên quy trình]` (hoặc thao tác GitHub PR/Issue an toàn có xin quyền xác nhận qua `permissioned-github`).`` |

---

## Nhóm 5 — Quay Màn Hình Hướng Dẫn, Làm Phim AI, Video Shopee & Xây Kênh Tự Động

### 5.1. Quay Màn Hình Hướng Dẫn Phần Mềm + Giọng Đọc AI Giải Thích & Phụ Đề `.SRT` — [`recordly-tutorial-ai`](file:///C:/Users/INFOASIA/.gemini/config/skills/recordly-tutorial-ai/SKILL.md)
```text
Dùng skill `recordly-tutorial-ai` xử lý video quay thao tác màn hình tại `[Đường dẫn file video .mp4/.mkv đã quay bằng Recordly — hoặc yêu cầu quay cửa sổ phần mềm X qua wgc-capture.exe]`:
- Chức năng đang hướng dẫn trong video: `[VD: Cách lập Lệnh sản xuất và xuất kho NVL trên SAP B1]`.
- Giọng đọc AI: `[Giọng Nam Minh hoặc Nữ Hoài My tiếng Việt tự nhiên]`.
Yêu cầu: Tự động biên soạn lời thuyết minh giải thích khớp từng bước thao tác trên màn hình, sinh file phụ đề `.SRT` chuẩn từng giây, tạo dự án `.recordly` có hiệu ứng phóng to Auto-Zoom theo chuột và xuất video `.MP4` hoàn chỉnh lưu tại `[Đường dẫn xuất file]`.
```

---

### 5.2. Điều Phối Tổng Lực 13 Bộ Skill Làm Phim & Đồ Họa Động — [`lam-phim-video-master`](file:///C:/Users/INFOASIA/.gemini/config/skills/lam-phim-video-master/SKILL.md)
```text
Dùng Siêu Hub `lam-phim-video-master` sản xuất trọn gói video chủ đề: `[Tên chủ đề video]`
- Thời lượng dự kiến: `[VD: 3 phút]` | Khung hình: `[16:9 ngang YouTube HOẶC 9:16 dọc Shorts/TikTok]`.
- Hình thức thể hiện: `[VD: Phim AI điện ảnh Veo 3 / Seedance 2.0 HOẶC Hoạt hình màu nước bằng code HOẶC Video đồ họa giải thích 3D/Remotion]`.
Hãy điều phối cuốn chiếu đủ 5 bước: Biên kịch -> Khóa tạo hình nhân vật 6 lớp & tư thế 3D -> Xuất bảng Prompt CSV (hoặc render code) -> Hậu kỳ ghép nhạc/phụ đề -> Kiểm định frame thực tế bằng `ffprobe`.
```

---

### 5.3. Biên Kịch Video Đa Thể Loại Theo 20+ Công Thức Quốc Tế — [`video-storytelling`](file:///C:/Users/INFOASIA/.gemini/config/skills/video-storytelling/SKILL.md)
```text
Dùng skill `video-storytelling` viết kịch bản chi tiết và bảng phân cảnh (Storyboard) cho video:
- Chủ đề: `[Nội dung chính]` | Đối tượng khán giả: `[Tệp người xem]`.
- Thời lượng & Tỷ lệ khung hình: `[VD: 90 giây, khung dọc 9:16]`.
- Công thức kể chuyện: `[VD: ABT (And-But-Therefore) / 7-Beat Debate / Pixar Spine / AIDA]`.
- Engine đích để xuất luồng Prompt: `[Google Veo 3 HOẶC Seedance 2.0]`.
Yêu cầu lời bình (`voiceover.txt`) sạch 100% ký hiệu kỹ thuật để nạp thẳng vào máy đọc TTS, chia cụm phân cảnh chặt chẽ (cấm dùng script gán ẩu hàng loạt).
```

---

### 5.4. Biên Soạn Prompt Ảnh & Video Điện Ảnh AI Khóa Nhân Vật — [`cinematic-video-prompt`](file:///C:/Users/INFOASIA/.gemini/config/skills/cinematic-video-prompt/SKILL.md)
```text
Dùng skill `cinematic-video-prompt` thiết kế hồ sơ Khóa Gen Nhân Vật 6 Lớp (`6-Layer Character DNA`) cho `[Số lượng]` nhân vật chính và viết trọn bộ Prompt Ảnh + Prompt Chuyển động Video cho bảng kịch bản tại `[Đường dẫn kịch bản]` (Engine đích: `[Veo 3 / Seedance 2.0 / Kling]`, tỷ lệ `[16:9 hoặc 9:16]`). Yêu cầu chỉ định rõ cỡ cảnh, góc máy, chuyển động camera, ánh sáng, màu phim và tư thế giải phẫu 3D 5 tầng để nhân vật không bị lệch mặt hay đổi trang phục giữa các cảnh.
```

---

### 5.5. Dựng & Biên Tập Video Bằng Code (5 Engine: Remotion, Auto-Editor, Editly, Motion Canvas, Manim) — [`create-and-edit-video`](file:///C:/Users/INFOASIA/.gemini/config/skills/create-and-edit-video/SKILL.md)
```text
Dùng skill `create-and-edit-video` thực hiện tác vụ:
- [Trường hợp 1 - Cắt khoảng lặng tự động]: Dùng Engine `Auto-Editor` cắt bỏ toàn bộ đoạn ngập ngừng / khoảng lặng thừa trong video thu âm tại `[Đường dẫn file .mp4]` nhưng vẫn giữ nhịp thở tự nhiên, xuất ra `[File đích.mp4]`.
- [Trường hợp 2 - Lập trình video đồ họa/biểu đồ/toán học]: Dùng Engine `[Remotion React / Manim LaTeX / Editly JSON]` dựng video độ phân giải `1920x1080`, `30fps` diễn họa chủ đề `[Mô tả nội dung & số liệu]` và render thành file `.MP4` hoàn chỉnh.
```

---

### 5.6. Sản Xuất Phim Hoạt Hình Màu Nước Vẽ Tay Bằng Code — [`painted-animation`](file:///C:/Users/INFOASIA/.gemini/config/skills/painted-animation/SKILL.md)
```text
Dùng skill `painted-animation` (`p5.js` + `p5.brush`) sáng tác và render một bộ phim hoạt hình màu nước & mực tàu vẽ tay dài `[VD: 45 giây]`, khung hình `[16:9 hoặc 9:16]` kể câu chuyện `[Mô tả cốt truyện / bài thơ / lời bài hát tại đường dẫn ...]`. Yêu cầu lập Storyboard từng cảnh trước khi code, kiểm tra trực quan từng khung hình (frame) nhiều lần và xuất file `.MP4` sắc nét đồng bộ âm thanh.
```

---

### 5.7. Dựng Video Intro / Showreel Chữ Chuyển Động & 3D WebGL — [`kinetic-reel`](file:///C:/Users/INFOASIA/.gemini/config/skills/kinetic-reel/SKILL.md)
```text
Dùng skill `kinetic-reel` dựng một video Showreel / Intro thương hiệu kiểu Kinetic Typography kết hợp đồ họa `Canvas 2D / Three.js WebGL` dài `[VD: 20 giây]`, tỷ lệ `[16:9]` cho thương hiệu `[Tên thương hiệu & 5 thông điệp chính cần nhấn mạnh]`. Tự động tổng hợp nhạc nền bắt đúng nhịp chuyển cảnh (beat-synced) và xuất ra file `.MP4` chất lượng cao.
```

---

### 5.8. Phân Tích Ngách Shopee & Dựng Video Bán Hàng Affiliate 9:16 — [`shopee-affiliate-video-studio`](file:///C:/Users/INFOASIA/.gemini/config/skills/shopee-affiliate-video-studio/SKILL.md)
```text
Dùng skill `shopee-affiliate-video-studio` sản xuất video bán hàng tiếp thị liên kết Shopee từ `[Link sản phẩm shopee.vn / s.shopee.vn HOẶC Từ khóa ngách cần quét chọn sản phẩm điểm cao nhất]`:
1. Bóc tách đúng 100% thông số kỹ thuật thật của Nhà Sản Xuất và tải ảnh gốc HD làm mẫu khóa sản phẩm (`UID02.png`).
2. Dùng AI đọc ảnh sản phẩm để sáng tác kịch bản câu chuyện đời thường 5 cảnh (đủ Hook bán hàng, giải quyết vấn đề, thông số NSX, hướng dẫn sử dụng, chữ hiển thị 3 vùng trên màn hình và CTA).
3. Diễn hoạt người mẫu dùng/mặc đúng sản phẩm thật, lồng tiếng Việt sạch ký tự rác, ghép nhạc nền, xuất video `.MP4` (`1080x1920`, `30fps`) và đồng bộ dự án sang `Timeline Studio (:8500)`.
```

---

### 5.9. Trung Tâm Điều Khiển Dây Chuyền YouTube & Facebook 6 Lệnh — [`yt-shortcode-commander`](file:///C:/Users/INFOASIA/.gemini/config/skills/yt-shortcode-commander/SKILL.md)
```text
Gọi `yt-shortcode-commander` thực thi dây chuyền sản xuất kênh:
- [Chạy cho kênh có sẵn]: Thực thi `[Lệnh 1: Viết nội dung / Lệnh 2: Viết bộ Prompt B1-B9 & .SRT / Lệnh 3: Render Video Master / Lệnh 4: Lên lịch đăng video / Lệnh 5: Nuôi thiết bị cổng :8000]` cho kênh `[Every Myth Explained / KosmosGeist / Some Guy / Tên kênh]`, Video số `[#XX]` với chủ đề `[Tên chủ đề]`.
- [Xây kênh mới từ con số 0]: Thực thi `Lệnh 6` khởi tạo trọn bộ thư mục chuẩn từ `_TEMPLATE_KENH_MOI_A_TO_Z` cho kênh mới ngách `[Ngách nội dung]`, ngôn ngữ `[Tiếng Anh / Tiếng Việt]`, định hướng thẩm mỹ hình ảnh và làm cuốn chiếu Video `#01` đầu tiên.
```

---

### 5.10. Điều Khiển Đa Trình Duyệt Chrome / Cốc Cốc Đa Profile & Tự Động Đăng Bài — [`antigravity-browser-controller`](file:///C:/Users/INFOASIA/.gemini/config/skills/antigravity-browser-controller/SKILL.md)
```text
Dùng skill `antigravity-browser-controller` kiểm tra kết nối phiên trình duyệt của Profile `[default / profile_1]`, sau đó tự động đăng bài lên Facebook kèm nội dung văn bản `[Nội dung bài đăng]` và tệp phương tiện tại `[Đường dẫn file ảnh .png hoặc video .mp4]`. Sau khi đăng xong, bắt buộc chụp ảnh màn hình (Screenshot) bài đăng thực tế để anh nghiệm thu.
```

---

### 5.11. Sản Xuất Video Kênh Khoa Học – Kỹ Thuật – Vũ Trụ (Manim + Remotion + Vision AI Review), Nghiên Cứu arXiv & Kho Tri Thức RAG Đa Engine — [`deeptutor-cli`](file:///C:/Users/INFOASIA/.gemini/config/skills/deeptutor-cli/SKILL.md)
*Tích hợp từ `HKUDS/DeepTutor` (`v1.7.1`, `D:\DeepTutor`, `53,316+ ★`, hỗ trợ Tiếng Việt bản địa): điều phối 11 Capabilities (`math_animator`, `video_lesson`, `deep_solve`, `deep_question`, `deep_research`, `audio_overview`, `guided_learning`, `brainstorm`, `note_assistant`, `quiz`, `chat`), bộ công cụ nghiên cứu `preprint`/`research_audit`/`research_lit`, 5 Engine RAG (`LlamaIndex`, `LightRAG`, `GraphRAG`, `PageIndex`, `Obsidian`) kèm `kb eval` và Sách tương tác `Living Books` xuất thẻ `Anki`.*

**Mẫu 5.11A — Dựng Video Hoạt Hình Toán – Lý – Kỹ Thuật – Vũ Trụ Bằng Manim Có Vision AI Tự Soi Sửa Lỗi Khung Hình (`math_animator`):**
```text
Dùng skill `deeptutor-cli` (chế độ `math_animator`, bật `enable_visual_review=true`, `max_fix_round=4`, chất lượng `manim_quality=h` 1080p) dựng cho anh 1 video hoạt hình Manim giải thích trực quan chủ đề khoa học vũ trụ / kỹ thuật: `[VD: Cơ chế Quỹ đạo Chuyển tiếp Hohmann đưa tàu vũ trụ từ Trái Đất sang Sao Hỏa / Độ cong không-thời gian và bán kính Schwarzschild của Hố đen / Bản chất hình học của Biến đổi Fourier]`.
Yêu cầu:
1. Hiển thị rõ đồ thị 2D/3D, vector chuyển động và các phương trình vật lý/toán học chuẩn xác bằng LaTeX.
2. Toàn bộ nhãn chú thích dùng Tiếng Việt rõ ràng, bật chế độ Vision AI tự kiểm tra từng frame để đảm bảo chữ/công thức không bị đè lên hình vẽ và xuất file `.mp4` hoàn chỉnh.
```

**Mẫu 5.11B — Dựng Video Bài Giảng Đồ Họa Chuyển Động Nhiều Cảnh Bằng Remotion Kèm Thuyết Minh Tiếng Việt (`video_lesson`):**
```text
Dùng skill `deeptutor-cli` (chế độ `video_lesson`, giọng thuyết minh Tiếng Việt `tts_voice=vi-VN-NamMinhNeural`) tạo video bài giảng Motion Graphics bằng Remotion (`Lesson.tsx`) giải thích chủ đề kỹ thuật: `[VD: Cấu tạo và nguyên lý hoạt động của động cơ tên lửa đẩy Raptor chu trình đốt phân tầng toàn phần / Nguyên lý quang khắc EUV chế tạo chip bán dẫn 2nm]`.
Yêu cầu: Chia kịch bản thành 5 phân cảnh rõ ràng, tự động kiểm tra bố cục không tràn chữ (`layout_check`), lồng tiếng khớp từng câu thoại và xuất file `.mp4`.
```

**Mẫu 5.11C — Nghiên Cứu Bài Báo Khoa Học `arXiv`, Kiểm Toán Công Thức So Với Code GitHub & Nạp RAG Đa Engine (`preprint` + `research_audit` + `kb eval`):**
```text
Dùng skill `deeptutor-cli` thực hiện tác vụ nghiên cứu khoa học & quản trị tri thức:
- [Đọc & Kiểm toán bài báo arXiv]: Dùng công cụ `preprint` và `research_audit` đọc bài báo `arXiv:[Mã bài báo]` đối chiếu với kho code GitHub `[Link repo]`, trích xuất toàn bộ sơ đồ hình vẽ và kiểm tra xem các phương trình toán học trong bài báo có khớp 100% với mã nguồn thực tế không.
- [Tạo Kho tri thức RAG & Chấm điểm tự động]: Chạy `deeptutor kb create [ten_kb] --pipeline lightrag [Đường dẫn thư mục PDF]`, sau đó chạy `deeptutor kb eval [ten_kb] --generate 20` để đo lường độ chính xác truy xuất (Precision, Recall, MRR) và xuất Sách điện tử tương tác (`Living Book`) kèm bộ thẻ học Anki (`.apkg`).
```

---

## Nhóm 6 — Quản Trị ERP SAP Business One, Boyum Beas & Truy Vấn SQL Đa Server

> [!IMPORTANT]
> **Quy Tắc Định Tuyến Cứng Của `sql-sap-b1`:**
> Nếu câu lệnh **KHÔNG ghi tiền tố máy chủ** (`/160`, `/52`, `/27`, `/buwon`), hệ thống luôn mặc định truy vấn vào **Con 24 (`infoasia56`)**. Khi muốn lấy số liệu ở máy chủ khác, anh luôn đặt tiền tố định tuyến ngay đầu câu lệnh như bảng dưới đây; khi xong việc chỉ cần gõ `/exit` để quay về mặc định Con 24. Toàn bộ truy vấn SQL trên cả 4 Server đều chạy chế độ **Read-Only 100%** an toàn tuyệt đối cho dữ liệu gốc.

### 6.1. Truy Vấn Số Liệu Thực Tế & Xuất Báo Cáo Trên 4 Server / 19 DB — [`sql-sap-b1`](file:///C:/Users/INFOASIA/.gemini/config/skills/sql-sap-b1/SKILL.md)

| Máy Chủ & Database Đích | Tiền Tố Bắt Buộc Đầu Câu | Mẫu Prompt Gọi Lấy Số Liệu Thực Tế |
| :--- | :--- | :--- |
| **Con 24 (`infoasia56` + 9 DB phụ)** | `/24` *(hoặc hỏi tự do)* | ``/24 Truy vấn tổng doanh thu thuần (đã trừ hàng bán trả lại ORIN), giá vốn và lãi gộp theo khách hàng từ ngày [01/01/2026] đến [31/10/2026], đối chiếu khớp số và xuất ra file Excel `.xlsx`.`` |
| **Con 160 Train (`FVIVN_PROD_TRAIN`)** | `/160` | ``/160 Kiểm tra danh sách Lệnh sản xuất Beas đang mở chưa đóng được và đối chiếu tồn kho bán thành phẩm theo kho tính đến ngày hôm nay.`` |
| **Con 160 HCM (`FVIVN_GoLive_2024`)** | `/160 HCM` | ``/160 HCM Lấy báo cáo nhập - xuất - tồn kho nguyên vật liệu chính kỳ tháng [10/2026] và xuất file `.xlsx` + `.pdf`.`` |
| **Con 160 Long Thành (`FVIVN_PROD`)** | `/160 LT` | ``/160 LT Kiểm tra chi phí sản xuất kinh doanh dở dang WIP 154 theo từng Lệnh sản xuất Beas trong kỳ `[MM/YYYY]`, tách rõ chi phí NVL, nhân công và sản xuất chung.`` |
| **Con 52 (`PenflexPRD_NEW`)** | `/52` | ``/52 Liệt kê các đơn mua hàng (OPOR) đã quá hạn giao hàng nhưng còn số lượng `OpenQty > 0` kèm tên Nhà cung cấp.`` |
| **Con 27 (`ECC` / `HTL_DEMO`)** | `/27` hoặc `/27 HTL` | ``/27 HTL Kiểm tra công nợ phải thu khách hàng quá hạn trên 30 ngày tính đến hôm nay và xuất bảng tổng hợp.`` |
| **Con 41 (`BUWON` / `Buwon_mes`)** | `/buwon` hoặc `/buwon mes` | ``/buwon mes Kiểm tra sản lượng ghi nhận từ MES đối chiếu với phiếu nhập kho thành phẩm SAP B1 trong ngày `[DD/MM/YYYY]`.`` |

---

### 6.2. Viết Câu Lệnh T-SQL / HANA SQLScript, FMS & TransactionNotification — [`viet-sql-sap-b1`](file:///C:/Users/INFOASIA/.gemini/config/skills/viet-sql-sap-b1/SKILL.md)
```text
Dùng skill `viet-sql-sap-b1` viết và kiểm thử thực tế câu lệnh `[MS SQL T-SQL HOẶC SAP HANA SQLScript]` cho hệ thống `[Tên tiền tố DB, VD: /24 hoặc /160 LT]`:
- Yêu cầu nghiệp vụ:
  + [Trường hợp 1 - Báo cáo truy vết chuỗi chứng từ]: Nối chuẩn chuỗi chứng từ `Báo giá -> Đơn bán hàng (ORDR) -> Giao hàng (ODLN) -> Hóa đơn A/R (OINV) -> Phiếu trả hàng (ORIN)` kỳ `[Từ ngày - Đến ngày]`.
  + [Trường hợp 2 - Formatted Search (FMS)]: Viết cú pháp FMS chuẩn `$[$Item.Column.0]` tự động điền `[Tên trường đích]` trên màn hình `[Tên chứng từ SAP B1]`.
  + [Trường hợp 3 - Chốt chặn SBO_SP_TransactionNotification]: Viết đoạn chặn lỗi trong `SBO_SP_TransactionNotification` (chỉ dùng `SELECT` gán `@error`, tuyệt đối cấm `UPDATE/DELETE` bảng chuẩn SAP) để ngăn người dùng `[VD: Tạo Hóa đơn A/R khi đơn giá thấp hơn giá vốn hoặc thiếu mã dự án]`.
```

---

### 6.3. Tư Vấn Nghiệp Vụ Sản Xuất Boyum Beas, Giá Thành `WIP 154` (TT 99/2025) & DTW/SDK — [`sap-b1-beas`](file:///C:/Users/INFOASIA/.gemini/config/skills/sap-b1-beas/SKILL.md)
```text
Dùng skill `sap-b1-beas` chẩn đoán và hướng dẫn xử lý bài toán nghiệp vụ trên SAP Business One `[9.3 / 10.0]` & Boyum Beas Manufacturing:
- Tình huống cần giải quyết: `[VD: Lệnh sản xuất Beas số #XXXX không đóng được (ABGKZ) / Thiết kế quy trình tính giá thành WIP 154 và định khoản kế toán chuẩn Thông tư 99/2025/TT-BTC áp dụng từ 2026 / Chuẩn bị mẫu file DTW import BOM & Master Data / Tích hợp tạo chứng từ an toàn qua SAP Service Layer :50000]`.
Yêu cầu tuân thủ tuyệt đối nguyên tắc bảo hành hãng (không ghi trực tiếp xuống bảng chuẩn SQL của SAP B1) và trích dẫn rõ tên bảng SAP/Beas cùng văn bản kế toán tương ứng.
```

---

## Nhóm 7 — Luận Giải Tử Vi Đẩu Số, Bát Tự 24 Tiết Khí & Thần Số Học SOP V3.0

Điều phối bởi skill **[`tu-vi-bat-tu-than-so-hoc`](file:///C:/Users/INFOASIA/.gemini/config/skills/tu-vi-bat-tu-than-so-hoc/SKILL.md)** — bắt buộc chạy động cơ tính toán tất định `destiny_pipeline.py` (`iztro-py` + `lunar_python` 24 Tiết Khí + Pythagoras) và kiểm toán QA 13 bước, tuyệt đối cấm AI tự nhẩm đổi lịch Âm Dương hay tự cộng con số.

**Mẫu 7A — Xem Lá Số Tổng Hợp & Bản Đồ Tinh Bàn HTML Cho 1 Cá Nhân:**
```text
Dùng skill `tu-vi-bat-tu-than-so-hoc` chạy động cơ `destiny_pipeline.py` lập lá số và luận giải tổng hợp năm `[2026]` cho:
- Họ và tên khai sinh đầy đủ có dấu: `[VD: Nguyễn Văn An]`
- Giới tính: `[Nam / Nữ]`
- Ngày tháng năm sinh Dương lịch: `[YYYY-MM-DD, VD: 1990-08-15]`
- Giờ phút sinh chính xác: `[HH:MM, VD: 10:30 sáng]`
- Nơi sinh: `[Tỉnh/Thành phố]`
Yêu cầu: Xuất file hồ sơ gốc kỹ thuật, bản đồ Tinh bàn HTML 12 cung tương tác, phân tích rõ Nhật Chủ & Dụng Thần - Hỷ Thần - Kỵ Thần theo đúng 24 Tiết Khí, tách bạch sao Tọa thủ với sao Chiếu/Giáp, đối chiếu các chỉ số Thần Số Học Pythagoras và dẫn chứng tọa độ Cổ thư rõ ràng.
```

**Mẫu 7B — Xuất Trọn Bộ 10 Tệp Hồ Sơ Mệnh Thư SOP V3.0 Cho Cá Nhân Hoặc Cả Gia Đình:**
```text
Dùng skill `tu-vi-bat-tu-than-so-hoc` lập trọn bộ Hồ sơ Mệnh Thư Toàn Diện chuẩn SOP V3.0 (đủ 10 tệp chuyên sâu `00`..`09` cho từng thành viên + chuyên đề thẩm định 7 Đại họa sinh mạng, Hôn phối / Bạn làm ăn, Kim Lâu - Hoang Ốc - Tam Tai) từ danh sách thông tin sinh sau:
1. `[Họ tên 1 — Giới tính — Ngày sinh Dương lịch YYYY-MM-DD — Giờ sinh HH:MM — Vai trò]`
2. `[Họ tên 2 — Giới tính — Ngày sinh Dương lịch YYYY-MM-DD — Giờ sinh HH:MM — Vai trò]`
Lưu toàn bộ hồ sơ theo từng thư mục thành viên tại `[Đường dẫn thư mục xuất]` và bắt buộc chạy trình kiểm toán `qa_dossier_auditor.py` đạt `Exit code 0` trước khi bàn giao.
```

---

## Nhóm 8 — Google Workspace, Lập Trình Android & 41 Kỹ Năng Khoa Học – Y Sinh Quốc Tế

### 8.1. Quản Lý & Biên Tập Trực Tiếp Google Drive, Docs, Sheets, Slides (4 Plugin Skills)

| Kỹ Năng | Link Gốc | Prompt Mẫu Gọi Chuẩn |
| :--- | :--- | :--- |
| **`gdrive`** | [`SKILL.md`](file:///C:/Users/INFOASIA/.gemini/config/plugins/gdrive/skills/gdrive/SKILL.md) | ``Dùng skill `gdrive` tìm kiếm trong thư mục Google Drive `[Link thư mục drive.google.com]` tất cả các file liên quan đến `[Từ khóa]`, kiểm tra quyền chia sẻ và tải/xuất bản PDF về thư mục `[Đường dẫn máy]`.`` |
| **`gdocs`** | [`SKILL.md`](file:///C:/Users/INFOASIA/.gemini/config/plugins/gdocs/skills/gdocs/SKILL.md) | ``Dùng skill `gdocs` đọc nội dung tài liệu tại `[Link docs.google.com]`, sau đó tạo mới / cập nhật định dạng tiêu đề, chèn bảng tổng hợp từ file `[Đường dẫn file .md]` lên Google Docs.`` |
| **`gsheets`** | [`SKILL.md`](file:///C:/Users/INFOASIA/.gemini/config/plugins/gsheets/skills/gsheets/SKILL.md) | ``Dùng skill `gsheets` đọc bảng tính tại `[Link docs.google.com/spreadsheets]`, nhập dữ liệu từ `[File .csv/.xlsx]`, định dạng bảng chuẩn, tạo Pivot Table & biểu đồ tổng hợp doanh thu theo tháng.`` |
| **`gslides`** | [`SKILL.md`](file:///C:/Users/INFOASIA/.gemini/config/plugins/gslides/skills/gslides/SKILL.md) | ``Dùng skill `gslides` khởi tạo bộ Slide thuyết trình `[Số lượng, VD: 12 slides]` trên Google Slides cho chủ đề `[Tên buổi thuyết trình]` dựa trên số liệu thật tại `[Đường dẫn tài liệu]`.`` |

---

### 8.2. Lập Trình, Xem Trước Giao Diện & Điều Khiển Thiết Bị Android (3 Plugin Skills)
*Bao gồm [`android-cli`](file:///C:/Users/INFOASIA/.gemini/config/plugins/android-cli-plugin/skills/SKILL.md), [`android-device-hub`](file:///C:/Users/INFOASIA/.gemini/config/plugins/android-cli-plugin/skills/device-hub/SKILL.md) và [`compose-preview`](file:///C:/Users/INFOASIA/.gemini/config/plugins/android-cli-plugin/skills/compose-preview/SKILL.md).*

```text
Kết hợp bộ skill `android-cli`, `compose-preview` và `android-device-hub` cho dự án Android tại `[Đường dẫn dự án Android]`:
1. Viết / cập nhật màn hình Jetpack Compose `[Tên màn hình]` và gọi `android preview render` để hiển thị trực tiếp bản xem trước lên khung Compose Preview.
2. Khởi động máy ảo AVD (hoặc kết nối điện thoại thật qua ADB trên Device Hub), cài đặt bản build thử nghiệm, kiểm tra cây bố cục (`android layout`) và chụp ảnh màn hình thực tế trên thiết bị.
```

---

### 8.3. Hệ Sinh Thái Nghiên Cứu Khoa Học, Văn Bản Cổ & Y Sinh Học Quốc Tế (40 Skills `science`)
*Khi làm việc với nhóm này, mọi dữ liệu đều truy xuất trực tiếp từ cơ sở dữ liệu quốc tế chính thống (`NCBI`, `EMBL-EBI`, `FDA`, `ClinicalTrials.gov`, `AlphaFold`, `ChEMBL`) và luôn đi kèm nhãn tham khảo nghiên cứu khoa học / y sinh học.*

#### Cụm A — Tra Cứu Y Văn & Công Bố Khoa Học Quốc Tế (5 Skills)
*Bao gồm: `pubmed-database`, `literature-search-arxiv`, `literature-search-biorxiv`, `literature-search-europepmc`, `literature-search-openalex`.*
```text
Kết hợp các skill `pubmed-database`, `literature-search-europepmc` và `literature-search-openalex` (hoặc `literature-search-arxiv` / `literature-search-biorxiv` cho bài báo AI & tiền ấn bản) để tổng hợp các công trình nghiên cứu khoa học giai đoạn `[2022–2026]` về chủ đề: `[Chủ đề nghiên cứu]`.
Yêu cầu: Chỉ trích dẫn bài báo thật có mã `PMID / PMCID / DOI / arXiv ID` xác thực, tóm tắt phương pháp - cỡ mẫu - kết quả cốt lõi và tải PDF Open-Access (nếu có) về thư mục `[Đường dẫn lưu]`.
```

#### Cụm B — Cấu Trúc Protein 3D, Trình Tự & Tương Tác Phân Tử (12 Skills)
*Bao gồm: `uniprot-database`, `alphafold-database-fetch-and-analyze`, `pdb-database`, `biomolecular-structure-viewer`, `pymol`, `foldseek-structural-search`, `protein-sequence-similarity-search`, `protein-sequence-msa`, `ncbi-sequence-fetch`, `interpro-database`, `string-database`, `human-protein-atlas-database`.*
```text
Dùng chuỗi skill `uniprot-database` -> `alphafold-database-fetch-and-analyze` (hoặc `pdb-database`) -> `biomolecular-structure-viewer` để tra cứu protein `[Tên Gen/Protein hoặc mã UniProt ID, VD: P04637 (TP53)]`:
1. Lấy thông tin chức năng, vùng domain (`interpro-database`), biểu hiện mô (`human-protein-atlas-database`) và mạng lưới tương tác protein (`string-database`).
2. Tải cấu trúc 3D thực nghiệm / dự đoán kèm chỉ số độ tin cậy `pLDDT`, mở trực tiếp trên trình xem 3D tương tác `biomolecular-structure-viewer` (kèm link `sidecar://` 1 chạm) và đánh dấu vùng hoạt động quan trọng.
*(Nếu cần so sánh tương đồng chuỗi hoặc cấu trúc: gọi thêm `ncbi-sequence-fetch`, `protein-sequence-similarity-search`, `protein-sequence-msa`, `foldseek-structural-search` hoặc kết xuất ảnh xuất bản qua `pymol`).*
```

#### Cụm C — Hệ Gen, Biến Thể Di Truyền & Điều Hòa Biểu Hiện Gen (12 Skills)
*Bao gồm: `clinvar-database`, `dbsnp-database`, `gnomad-database`, `ensembl-database`, `alphagenome-single-variant-analysis`, `alphagenome-variant-impact-score`, `alphagenome-atlas-website-links`, `gtex-database`, `encode-ccres-database`, `jaspar-database`, `unibind-database`, `ucsc-conservation-and-tfbs`.*
```text
Phân tích toàn diện biến thể di truyền `[Mã rsID, VD: rs7412 HOẶC tọa độ GRCh38 chr:pos:ref>alt]`:
- Tra cứu tọa độ & hậu quả biến thể qua `dbsnp-database` và `ensembl-database`.
- Kiểm tra phân loại mức độ gây bệnh lâm sàng trên `clinvar-database` và tần suất alen quần thể trên `gnomad-database`.
- Đánh giá mức độ bảo tồn tiến hóa (`ucsc-conservation-and-tfbs`), vùng điều hòa biểu hiện gen & eQTL theo mô (`gtex-database`, `encode-ccres-database`, `jaspar-database`, `unibind-database`) và điểm tác động chức năng kèm link trực quan qua bộ 3 skill `alphagenome-single-variant-analysis`, `alphagenome-variant-impact-score`, `alphagenome-atlas-website-links`.
```

#### Cụm D — Dược Phẩm, Hóa Sinh, Đích Thuốc & Thử Nghiệm Lâm Sàng (8 Skills)
*Bao gồm: `chembl-database`, `pubchem-database`, `openfda-database`, `clinical-trials-database`, `opentargets-database`, `reactome-database`, `quickgo-database`, `embl-ebi-ols`.*
```text
Tra cứu hồ sơ dược học và thử nghiệm lâm sàng cho hoạt chất / thuốc `[Tên hoạt chất, VD: Metformin]` trên bệnh lý `[Tên bệnh lý]`:
1. Lấy cấu trúc hóa học, mã CID và đặc tính lý hóa từ `pubchem-database`; tra cứu hoạt tính sinh học `IC50 / Ki` và đích tác dụng từ `chembl-database` & `opentargets-database`.
2. Phân tích con đường tín hiệu sinh học liên quan qua `reactome-database`, `quickgo-database` và chuẩn hóa thuật ngữ bệnh học qua `embl-ebi-ols`.
3. Kiểm tra nhãn thuốc, cảnh báo an toàn / biến cố bất lợi thực tế trên `openfda-database` và liệt kê các thử nghiệm lâm sàng đang tuyển bệnh nhân (kèm mã `NCT ID`) từ `clinical-trials-database`.
```

#### Cụm E — Phục Dựng Văn Bản Cổ & Công Cụ Môi Trường Khoa Học (3 Skills)
*Bao gồm: [`predictingthepast`](file:///C:/Users/INFOASIA/.gemini/config/plugins/science/skills/predictingthepast/SKILL.md), [`credentials`](file:///C:/Users/INFOASIA/.gemini/config/plugins/science/skills/credentials/SKILL.md), [`uv`](file:///C:/Users/INFOASIA/.gemini/config/plugins/science/skills/uv/SKILL.md).*
```text
- [Phục dựng văn bản khắc cổ La Mã / Hy Lạp]: Dùng skill `predictingthepast` (mô hình Aeneas / Ithaca) phục dựng đoạn khuyết, xác định niên đại và vùng địa lý gốc cho văn bản khắc cổ sau: "[Đoạn văn bản Latin hoặc Hy Lạp cổ]".
- [Kiểm tra khóa API & môi trường Python khoa học]: Dùng skill `credentials` và `uv` kiểm tra an toàn sự tồn tại của các biến môi trường API Key cần thiết (không in giá trị khóa bí mật ra màn hình) và đảm bảo trình quản lý gói `uv` sẵn sàng trên PATH.
```
