---
name: webapp-app-ux-workflow
description: "Kiến trúc luồng UX, logic State/URL, CRUD/Form/Table & gia cố lỗi cho Web App (User/Admin/ERP/SaaS) và Mobile App."
group: "Thiết Kế Web, UI/UX & Thương Hiệu"
---

# ⚙️ Web App & Mobile App Functional UX, State Logic & Workflow Engine (`webapp-app-ux-workflow`)

<!-- JAVIS_TRIGGER_ARCHIVE_START -->
## Khi nào dùng (Triggers & Ngữ cảnh kích hoạt đầy đủ)

> Kỹ năng chuyên biệt để thiết kế luồng thao tác (`UX Workflow`), kiến trúc trạng thái (`State & URL Sync`), lựa chọn đúng thành phần tương tác (`60+ Functional Components`) và gia cố tình huống biên (`Edge-case Hardening / Break-UI`) cho **Web App Người Dùng (`User Portal`), Trang Quản Trị (`Admin Panel / Backoffice`), Phần mềm SaaS / ERP / CRM / MES / POS và Ứng dụng Di động (`Mobile App iOS/Android`)** — tức các phần mềm mà người dùng đăng nhập và trực tiếp thao tác chức năng nghiệp vụ (`Operate Mode`), **KHÔNG PHẢI** trang web xem tin tức hay Landing Page quảng cáo thông thường.
> TRIGGERS: "web app", "webapp", "ux workflow", "user flow", "luồng người dùng", "luong nguoi dung", "luồng thao tác", "giao diện admin", "giao dien admin", "admin panel", "admin dashboard", "user portal", "trang quản trị", "trang quan tri", "crud ui", "data table", "bảng dữ liệu", "multi-step form", "form nhiều bước", "wizard ui", "phân quyền giao diện", "rbac ui", "url state", "operate mode", "impeccable", "break-ui", "mobile app ui", "mobile navigation", "app navigation", "app workflow", "luồng màn hình app", "webapp-app-ux-workflow".
<!-- JAVIS_TRIGGER_ARCHIVE_END -->

- **Nguồn gốc / Kho Git Upstream:** [vercel-labs/agent-skills & callstackincubator](https://github.com/vercel-labs/agent-skills) (`Open-Source Web/Mobile App UX Hub`)

- **Hợp nhất tinh hoa từ 8 kho mã nguồn mở chuẩn Design Engineering quốc tế (đã lưu tại `ui-workflow-repos/` & theo dõi qua `check_skill_git_updates.py`):**
  1. [pbakaus/impeccable](https://github.com/pbakaus/impeccable) (`v4.8.0` — Chế độ `Operate Mode` cho App/Admin, quy trình `shape` $
ightarrow$ `onboard` $
ightarrow$ `harden` $
ightarrow$ `clarify` $
ightarrow$ `adapt`).
  2. [emilkowalski/skill](https://github.com/emilkowalski/skill) (Kỹ nghệ vi tương tác Linear/Vercel, `ui-cheatsheet`, `mobile-native` và bài test phá giao diện **`break-ui`**).
  3. [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) & [vercel-labs/web-interface-guidelines](https://github.com/vercel-labs/web-interface-guidelines) (`100+` luật `URL-as-State`, Form validation, Focus trap & `composition-patterns` React 19).
  4. [carmahhawwari/ui-design-brain](https://github.com/carmahhawwari/ui-design-brain) (Từ điển hành vi & bố cục của `60+` Component Web App/SaaS từ `component.gallery`).
  5. [ibelick/ui-skills](https://github.com/ibelick/ui-skills) (`baseline-ui`, `fixing-accessibility`, `fixing-motion-performance`).
  6. [callstackincubator/agent-skills](https://github.com/callstackincubator/agent-skills) & [flutter/skills](https://github.com/flutter/skills) (Luồng điều hướng Mobile App `React Navigation 7` & `Flutter GoRouter StatefulShellRoute`).

---

## 🧭 PHÂN ĐỊNH RẠCH RÒI VỚI CÁC SKILL GIAO DIỆN KHÁC (`OPERATE` VS `PERSUADE`)

| Loại Bề Mặt Sản Phẩm | Chế Độ Thiết Kế | Skill Cần Gọi Chính Xác |
| :--- | :--- | :--- |
| **Web giới thiệu, Landing Page bán hàng, Trang sự kiện** | `Persuade / Read Mode` *(Thuyết phục & Đọc)* | `design-landingpage-vip-v2` hoặc `wordpress-flatsome-designer` |
| **Tra bảng màu 192 ngành, Cặp Font, Tokens & 84 hệ `DESIGN.md`** | `Visual System & Styling` *(Thẩm mỹ & Màu)* | `ui-ux-design-pro-max` *(kết hợp cùng skill này khi cần chọn màu)* |
| **Web App (User / Admin / SaaS / ERP) & Mobile App thao tác chức năng** | **`Operate Mode` *(Thực thi tác vụ nghiệp vụ)*** | **`webapp-app-ux-workflow` *(Skill này — Chủ lực kiến trúc Logic & Workflow)*** |
| **Kiểm toán độc lập Logic UI Web App, Responsive Mobile, Web DN & CRO LP** | `Audit & QA Mode` *(Quét lỗi P0–P2 + CDP 3-Viewport)* | **`ui-ux-cro-auditor`** *(`audit_ui_ux_cro.py --surface webapp\|mobile\|corporate\|landing`)* |

---

## 📌 1. BẢNG ĐIỀU PHỐI TÀI LIỆU CHUYÊN SÂU & CÔNG CỤ KIỂM ĐỊNH

| Bước Thực Thi Trong Workflow | Tệp Tham Chiếu / Script CLI | Nội Dung Cốt Lõi Cần Nạp |
| :--- | :--- | :--- |
| **Bước 1 — `Operate Mode`, `Shape` Luồng & Phân Quyền `RBAC`** | [`references/01-operate-mode-va-quy-trinh-shape-luong-thaotac.md`](./references/01-operate-mode-va-quy-trinh-shape-luong-thaotac.md) | Khác biệt căn bản của Web App vs Web xem tin; cách vẽ Task Flow, phân quyền User/Admin, Onboarding & Empty State dạy thao tác. |
| **Bước 2 — Ma Trận Quyết Định `60+` Component Chức Năng** | [`references/03-ma-tran-chon-60-component-admin-saas.md`](./references/03-ma-tran-chon-60-component-admin-saas.md) | Khi nào dùng Inline vs Drawer vs Modal vs Stepper Wizard; Toast vs Banner vs AlertDialog; chống lạm dụng Modal. |
| **Bước 3 — Tra Cứu Chi Tiết Từng Component (`A–Z`)** | [`references/06-ui-design-brain-60-components-catalog.md`](./references/06-ui-design-brain-60-components-catalog.md) | Danh mục đầy đủ 60 Component chuẩn SaaS (`Table`, `Drawer`, `Form`, `Combobox`, `Stepper`, `Tabs`, `Tree view`...). |
| **Bước 4 — Kiến Trúc `URL-as-State`, CRUD, Form & Data Table** | [`references/02-kien-truc-state-url-form-table-crud-vercel.md`](./references/02-kien-truc-state-url-form-table-crud-vercel.md) | Đồng bộ Filter/Tab/Page/Drawer lên URL; 8 trạng thái UI; chống bấm đúp Submit; cảnh báo rời Form chưa lưu; Compound Components. |
| **Bước 5 — App Shell & Điều Hướng Mobile App (`iOS/Android`)** | [`references/04-mobile-app-navigation-gestures-responsive-shell.md`](./references/04-mobile-app-navigation-gestures-responsive-shell.md) | App Shell `100dvh`, Portal thoát `overflow: hidden`, `⌘K`, Bottom Tabs / Stack / Form Sheet, vùng chạm `44px` & `<input> >= 16px`. |
| **Bước 6 — Gia Cố Thực Chiến `Harden` & Phá Thử `Break-UI`** | [`references/05-gia-co-edge-cases-harden-va-break-ui.md`](./references/05-gia-co-edge-cases-harden-va-break-ui.md) | Chống vỡ khung `min-w-0`, xử lý lỗi mạng `401/403/429/500`, nút gạt `"Demo Data / Worst Case"` thử tải dữ liệu xấu nhất. |
| **Bước 7 — Quét Kiểm Định Lỗi Logic UI Tự Động (`Exit 0`)** | [`scripts/audit_webapp_ux.py`](./scripts/audit_webapp_ux.py) | CLI phát hiện 12 lỗi chí mạng của Web App (`<button>` thiếu `type` trong `<form>`, `<div onClick>`, `100vh`, thiếu `tabular-nums`...). |

---

## 📌 2. WORKFLOW 6 BƯỚC BẮT BUỘC KHI LÀM APP & WEB APP (`NON-NEGOTIABLE`)

1. **Bước 1 — Vẽ Luồng Thao Tác & Ma Trận Vai Trò Trước Khi Code (`Shape First`):**
   - Xác định rõ màn hình phục vụ ai (`Khách hàng / Nhân viên vận hành / Admin`), **Tác vụ số 1 (`Primary Action`)** là gì, luồng đi từ `Điểm vào -> Thao tác -> Phản hồi -> Điểm ra`, và nút nào ẩn hoặc khóa (`Disabled + Tooltip giải thích lý do`) theo quyền `RBAC`.
2. **Bước 2 — Quy Hoạch Khung Vỏ Ứng Dụng (`Operate App Shell`):**
   - Dùng thang chữ `rem` cố định gọn gàng (không dùng chữ Hero khổng lồ của Landing Page), 1 họ Sans-serif sắc nét + Monospace/Tabular cho mã chứng từ & con số; chiều cao `100dvh` (`h-dvh`), Sidebar thu gọn + Header cố định có Breadcrumb / Tìm kiếm nhanh (`⌘K`).
3. **Bước 3 — Khóa Trạng Thái Lên URL & Đủ 8 Trạng Thái Thực Thi (`URL-as-State & 8-State Matrix`):**
   - Bộ lọc (`filters`), ô tìm kiếm (`q`), tab đang mở (`tab`), trang hiện tại (`page`), cột sắp xếp (`sort`) và ngăn kéo chi tiết (`?detail=ID`) phải phản ánh lên URL Query Params để bấm `F5` hoặc gửi link cho đồng nghiệp không bao giờ mất ngữ cảnh đang làm việc.
   - Mọi màn hình/component tương tác bắt buộc code đủ: `Default`, `Hover`, `Focus-Visible`, `Active`, `Disabled`, `Loading Skeleton`, `Empty State (có nút CTA tạo mới ngay)` và `Error State (có lý do + nút Thử lại)`.
4. **Bước 4 — Chuẩn Hóa Bảng Dữ Liệu (`Data Table`) & Biểu Mẫu Nghiệp Vụ (`Form / Wizard`):**
   - **Data Table:** Chữ căn trái, số/tiền tệ căn phải kèm `tabular-nums`, cột trạng thái dùng Badge ngữ nghĩa (Icon + Chữ + Màu dịu), chọn nhiều dòng bật thanh `Bulk Action Bar`, thao tác xem/sửa nhanh mở bằng **Slide-over Drawer** để không che mất ngữ cảnh danh sách.
   - **Form:** Mọi `<button>` phụ bên trong `<form>` bắt buộc ghi `type="button"` (chống lỗi tự Submit ngoài ý muốn); không chặn `Paste`; báo lỗi ngay dưới ô nhập (`aria-describedby`) và tự nhảy `focus` tới ô lỗi đầu tiên; khóa nút khi đang gửi (`"Đang lưu…"`); cảnh báo khi thoát Form đang sửa dở (`Dirty-state Guard`); bắt buộc mở `AlertDialog` xác nhận trước mọi lệnh Xóa/Hủy không thể hoàn tác.
5. **Bước 5 — Thích Ứng Đa Thiết Bị & Mobile App Chuẩn Bản Địa (`Responsive & Native Feel`):**
   - Trên màn hình nhỏ / Mobile App: chuyển bảng rộng sang bố cục thẻ thông tin ưu tiên hoặc cuộn ngang ghim cột mã chính; cỡ chữ `<input> >= 16px`; vùng chạm `>= 44x44px`; tôn trọng `safe-area-inset`; chuyển cảnh nhanh `150–200ms` chỉ trên `transform/opacity`.
6. **Bước 6 — Thử Lửa Dữ Liệu Xấu Nhất (`Break-UI`) & Chạy Kiểm Định CLI (`Exit code 0`):**
   - Luôn thử màn hình với bộ dữ liệu cực hạn (tên dài 120 ký tự có `min-w-0` + `truncate`, số tiền hàng chục tỷ, mảng rỗng `[]`, mạng lỗi `500`), sau đó chạy lệnh kiểm định tự động:
     ```powershell
     python ~/.gemini/config/skills/webapp-app-ux-workflow/scripts/audit_webapp_ux.py "<duong_dan_file_hoac_thu_muc_ui>"
     ```
