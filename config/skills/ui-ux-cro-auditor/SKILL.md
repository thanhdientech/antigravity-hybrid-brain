---
name: ui-ux-cro-auditor
description: "Kiểm toán logic UI/UX, Responsive Mobile, Web doanh nghiệp & CRO Landing Page: đa khung hình, WCAG 2.2 & P0/P1/P2."
group: "Thiết Kế Web, UI/UX & Thương Hiệu"
---

# 🔬 UI/UX Logic, Mobile Responsive, Corporate Quality & Landing Page CRO Auditor (`ui-ux-cro-auditor`)

<!-- JAVIS_TRIGGER_ARCHIVE_START -->
## Khi nào dùng (Triggers & Ngữ cảnh kích hoạt đầy đủ)

> Bộ Kiểm Toán Giao Diện, Luồng Tương Tác & Tỷ Lệ Chuyển Đổi thực chứng cho đủ **4 bề mặt sản phẩm số**: **(1) Web App / SaaS / Admin / Dashboard (`webapp`)**, **(2) Giao diện Web Mobile & Đa khung hình Responsive (`mobile`: `375x812`, `768x1024`, `1440x900`)**, **(3) Website Doanh Nghiệp B2B/B2C (`corporate`: IA 3-click, Trust E-E-A-T, Core Web Vitals `LCP/INP/CLS`, WCAG 2.2 AA)** và **(4) Landing Page Bán Hàng / Phễu Đăng Ký (`landing`: 5-second Hero, Value Proposition, CTA, Form Friction, Social Proof & chống AI Slop)**. Kết hợp quét mã nguồn tĩnh và mở trình duyệt thật Headless Chrome/Edge qua CDP để đo pixel thực tế và xuất báo cáo `P0 / P1 / P2` kèm hạng `A–F`.
> TRIGGERS: "audit ui", "audit ux", "kiểm toán giao diện", "kiem toan giao dien", "kiểm tra giao diện", "kiem tra giao dien", "bắt lỗi ui", "bat loi ui", "review ui", "design review", "ux audit", "ui audit", "audit web app", "audit mobile", "kiểm tra responsive", "kiem tra responsive", "vỡ giao diện mobile", "vo giao dien mobile", "tràn khung mobile", "audit landing page", "audit cro", "tối ưu chuyển đổi", "toi uu chuyen doi", "audit web doanh nghiệp", "audit web doanh nghiep", "audit web bán hàng", "audit shop giỏ hàng", "qa checklist ecommerce", "ai slop", "ui-ux-cro-auditor".
<!-- JAVIS_TRIGGER_ARCHIVE_END -->

- **Hợp nhất tinh hoa thực chiến từ 6 hệ thống kiểm toán giao diện mã nguồn mở hàng đầu (đã lưu tại `ui-audit-repos/` & `ui-workflow-repos/`, theo dõi qua `check_skill_git_updates.py`):**
  1. [garrytan/gstack](https://github.com/garrytan/gstack) (`design-review` & `qa-only` — Quy tắc phân loại bề mặt `Classifier-First`, `Trunk Test`, `Goodwill Reservoir 70/100`, bộ nhận diện `AI Slop` & kiểm thử trình duyệt đa khung hình `375 / 768 / 1440`).
  2. [addyosmani/web-quality-skills](https://github.com/addyosmani/web-quality-skills) (`web-quality-audit`, `accessibility`, `core-web-vitals`, `best-practices` — Chuẩn Google Chrome Lighthouse 13+ & WCAG 2.2 AA).
  3. [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) (`skills/cro`, `references/form.md`, `skills/site-architecture` — Khung kiểm toán 7 chiều CRO Landing Page, chi phí ma sát Form & kiến trúc điều hướng 3-click Web doanh nghiệp).
  4. [narenkatakam/ux-audit](https://github.com/narenkatakam/ux-audit) (`Review Mode` — Chẩn đoán nguyên nhân gốc `Execution vs Evaluation Gulf`, phân cấp lỗi `P0 / P1 / P2`, cấm dùng Emoji thay Icon).
  5. [tommygeoco/ui-audit](https://github.com/tommygeoco/ui-audit) (*Making UX Decisions* — 3 trụ cột `Scaffolding / Decisioning / Crafting` & ma trận liên kết `JTBD`).
  6. [pbakaus/impeccable](https://github.com/pbakaus/impeccable) (`audit.md`, `critique.md`, `mode-persuade.md`, `mode-read.md` — Kiểm toán kỹ thuật 5 chiều `0–20` & 10 luật Nielsen Heuristics `0–40`).

---

## 🧭 1. LUẬT SỐ 1 TRƯỚC KHI CHẤM BẤT KỲ PIXEL NÀO (`CLASSIFIER-FIRST RULE`)

> **Cấm lấy thước đo của Landing Page để chấm Admin Dashboard, và cấm lấy thước đo của Admin Dashboard để chấm Landing Page!** Bắt buộc định danh đúng 1 trong **4 Bề Mặt (`--surface`)** trước khi kiểm toán:

| Mã Bề Mặt (`--surface`) | Đối Tượng Kiểm Toán | Thước Đo Thắng/Thua Cốt Lõi | Tệp Quy Chuẩn Bắt Buộc Nạp |
| :--- | :--- | :--- | :--- |
| **`webapp`** *(Operate Mode)* | Web App người dùng, Trang Admin, SaaS, ERP, CRM, POS, Dashboard | Hoàn thành tác vụ `< 3s` không kẹt luồng; đủ 8 trạng thái; `URL-as-State`; Form an toàn; `0` lỗi Console/Network. | [`references/01-webapp-functional-logic-and-qa-audit.md`](./references/01-webapp-functional-logic-and-qa-audit.md) |
| **`mobile`** *(Responsive & Touch)* | Mọi trang Web / Web App / LP mở trên điện thoại & Tablet (`375px`, `390px`, `768px`) | `0` cuộn ngang (`scrollWidth <= innerWidth`); vùng chạm `>= 44x44px`; `<input> >= 16px`; không khóa zoom; `100dvh`. | [`references/02-mobile-responsive-touch-and-viewport-audit.md`](./references/02-mobile-responsive-touch-and-viewport-audit.md) |
| **`corporate`** *(Read & Trust Mode)* | Website doanh nghiệp B2B/B2C, Trang dịch vụ, Hồ sơ năng lực, Tin tức/Docs | `Trunk Test 6/6`; điều hướng `<= 3` click (`4–7` mục menu); tín hiệu uy tín thật; `LCP < 2.5s`, `CLS < 0.1`, WCAG 2.2 AA. | [`references/03-corporate-website-trust-ia-cwv-wcag-audit.md`](./references/03-corporate-website-trust-ia-cwv-wcag-audit.md) |
| **`landing`** *(Persuade & CRO Mode)* | Landing Page quảng cáo, Sales Page, Trang bảng giá, Phễu Form đăng ký/VietQR | Hiểu đề xuất giá trị `< 5s`; 1 CTA nổi bật đúng khớp quảng cáo; Form tối giản (`<= 4` ô); Social Proof sát CTA; `0` AI Slop. | [`references/04-landing-page-cro-funnel-and-persuasion-audit.md`](./references/04-landing-page-cro-funnel-and-persuasion-audit.md) |
| **`all`** *(Hybrid / Full Audit)* | Dự án tổng hợp hoặc kiểm toán tổng thể trước khi bàn giao (Pre-launch) | Quét đồng thời đa khung hình + chấm điểm trọng số + phân loại `P0 / P1 / P2` & `AI Slop Grade A–F`. | [`references/05-audit-scoring-rubric-p0-p1-p2-and-fix-report.md`](./references/05-audit-scoring-rubric-p0-p1-p2-and-fix-report.md) |
| **`ecommerce`** *(Shop + Cart + Service + CRM)* | Website Thương mại Dịch vụ có Bán hàng, Cửa hàng (Shop), Giỏ hàng, Giá niêm yết & Báo giá VIP (`0₫`) + CRM | 80 tiêu chí QA toàn diện: Hybrid Catalog, Smart Filter (`URL-as-State`), Quick-Buy 1 chạm, Checkout rút gọn, WP Rocket + OpenLiteSpeed `.html_gzip` Guard, 6 lớp Schema JSON-LD & Chatbot CRM. | [`references/06-ecommerce-shop-cart-service-crm-qa-checklist.md`](./references/06-ecommerce-shop-cart-service-crm-qa-checklist.md) |

---

## 📌 2. QUY TRÌNH KIỂM TOÁN THỰC CHỨNG 5 BƯỚC (`EVIDENCE-LED AUDIT WORKFLOW`)

1. **Bước 1 — Phân loại Bề mặt & Xác định Tác vụ Số 1 (`Surface & Primary Goal`):**
   - Xác định rõ trang đang thuộc `webapp`, `mobile`, `corporate` hay `landing`, nguồn khách đến từ đâu (Ads lạnh, SEO hay nhân viên nội bộ đăng nhập) và **1 hành động đích duy nhất** trang cần người dùng hoàn tất.
2. **Bước 2 — Chạy Công Cụ Quét Tự Động Tĩnh + Trình Duyệt Đa Khung Hình (`Deterministic Scan First`):**
   - Luôn chạy CLI [`scripts/audit_ui_ux_cro.py`](./scripts/audit_ui_ux_cro.py) để lấy số liệu đo thật (mã nguồn tĩnh + Headless Chrome/Edge CDP ở **3 khung hình `375x812`, `768x1024`, `1440x900`** khi có URL hoặc file `.html`):
     ```powershell
     # 1. Quét mã nguồn tĩnh (HTML / JSX / TSX / Vue / CSS) theo bề mặt:
     python ~/.gemini/config/skills/ui-ux-cro-auditor/scripts/audit_ui_ux_cro.py "<duong_dan_file_hoac_thu_muc>" --surface all

     # 2. Quét thực tế trên trình duyệt Headless Chrome/Edge ở 3 khung hình (375 / 768 / 1440) + chụp ảnh bằng chứng:
     python ~/.gemini/config/skills/ui-ux-cro-auditor/scripts/audit_ui_ux_cro.py "http://localhost:3000" --surface all --live --screenshots "./audit-shots"
     ```
3. **Bước 3 — Kiểm Tra Tương Tác & Tâm Lý Người Dùng (`Trunk Test`, `Goodwill 70/100` & `8-State Check`):**
   - Tách bạch rạch ròi giữa **`[Đo thực tế trên DOM/Browser]`** và **`[Giả thuyết đọc từ mã nguồn]`** (nguyên tắc của `web-quality-skills` — không bao giờ phán đoán mò khi chưa đo).
   - Với `webapp`: kiểm tra luồng Điền Form $\rightarrow$ Bấm Lưu $\rightarrow$ Trạng thái Loading/Disabled $\rightarrow$ Lỗi mạng/Rỗng $\rightarrow$ Đồng bộ URL (`F5` không mất trạng thái).
   - Với `landing` & `corporate`: chấm **5-Second Above-the-Fold Test**, **Krug Trunk Test (`6/6`)**, điểm **Goodwill Reservoir** (bắt đầu từ `70/100`, trừ điểm mỗi popup chắn ngang, ô nhập thừa, thông tin giá/liên hệ bị giấu) và quét **AI Slop** (gradient tím-xanh vô hồn, 3 cột icon tròn lặp lại, emoji làm icon, số liệu ảo `"10k+ users"` không nguồn).
4. **Bước 4 — Lập Bảng Chẩn Đoán `P0 / P1 / P2` & Top 7 Việc Sửa Ngay (`Root-Cause & Fix Table`):**
   - **`P0 (Blocker — Sửa ngay lập tức)`:** Kẹt luồng không hoàn tất được tác vụ/thanh toán, nút `<button>` trong `<form>` thiếu `type` gây tự submit, vỡ tràn ngang trên Mobile `375px`, lỗi Console/JS làm chết nút, thiếu CTA chính hoặc form mất dữ liệu khi báo lỗi.
   - **`P1 (High — Sửa trước khi chạy Ads / Go-live)`:** Vi phạm WCAG 2.2 AA (`< 4.5:1`), vùng chạm Mobile `< 44x44px`, `<input> < 16px` gây iOS tự phóng to, Form Landing Page quá 6 ô bắt buộc không cần thiết, thiếu `tabular-nums` ở bảng số liệu, thiếu `width/height` ảnh gây nhảy khung `CLS`.
   - **`P2 (Polish — Tinh chỉnh nâng hạng thẩm mỹ)`:** Lệch nhịp khoảng cách `4px/8px`, dấu hiệu `AI Slop`, microcopy thụ động (`"Submit"` thay vì `"Nhận Báo Giá Ngay"`).
   - **Cấm tuyệt đối bịa con số % tăng chuyển đổi khống** (ví dụ cấm phán *"đổi màu nút này sẽ tăng 37% đơn hàng"* — tuân thủ kỷ luật của `landing-page-conversion-audit` & `GEMINI.md`).
5. **Bước 5 — Hậu Kiểm Sau Khi Sửa (`Re-Verify Delta`):**
   - Nếu người dùng yêu cầu sửa luôn lỗi vừa phát hiện: sửa từng nhóm nguyên nhân gốc (`root cause`), sau đó chạy lại `audit_ui_ux_cro.py` để chứng minh số lỗi `P0/P1` giảm về `0` (`Exit code 0`).
