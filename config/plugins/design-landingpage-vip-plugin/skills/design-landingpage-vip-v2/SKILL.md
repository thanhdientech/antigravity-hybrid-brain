---
name: design-landingpage-vip-v2
description: Skill thiết kế landing page Noti.vn/GĐT — 1 file HTML hoàn chỉnh, chọn design system từ template trong system-design/ (mặc định noti-vn liquid glass) hoặc tự nhập. Có form đăng ký + countdown + FAQ + thanh toán QR VietQR + Meta CAPI/TikTok Events API 2.0/dual-tracking qua backend webhook (KHÔNG gọi CAPI từ frontend). 138 icon SVG inline từ assets/icons/ (6 category: ui/commerce/trust/contact/feature/payments — payments là brand logos Visa/Mastercard/ATM/ApplePay), 100% tiếng Việt có dấu. TRIGGERS: "landing page VIP", "LP VIP", "landing page Noti", "landing page GĐT", "landing có CAPI", "Meta CAPI", "TikTok CAPI", "dual tracking", "landing page sự kiện", "landing page khóa học", "landing page đăng ký", "form thanh toán VietQR", "landing page có QR", "event landing", "meetup landing". Trigger cả khi user chỉ nói "làm landing page" hoặc "landing có form + thanh toán".
---

# design-landingpage-vip-v2 — Landing Page VIP của GĐT / Noti.vn

> **Last updated:** 2026-05-29 (v2.44) — lịch sử thay đổi đầy đủ ở `changelog.md`.
>
> **QUY TẮC**: Mỗi lần Claude sửa bất kỳ file nào trong skill này (SKILL.md, references/*.md, system-design/**), BẮT BUỘC: (1) cập nhật dòng `Last updated` ở trên thành ngày hiện tại + bump version (v2.4 -> v2.5...); (2) thêm 1 mục changelog mới vào ĐẦU file `changelog.md`. KHÔNG ghi changelog trực tiếp vào SKILL.md — để SKILL.md gọn gàng.

> **Marketing & USP (meta-doc, KHÔNG load mặc định)**: Khi và CHỈ KHI user hỏi "skill này là gì", "USP của skill", "skill giải quyết vấn đề gì", "khách hàng phù hợp", "ROI", hoặc cần viết pitch deck / sales page / description giới thiệu skill cho team/khách hàng → đọc `_POSITIONING.md` (file cùng cấp với SKILL.md, prefix `_` báo hiệu non-functional doc). File đó có: bản chất skill, 5 nhóm vấn đề doanh nghiệp giải quyết, 10 USP, bảng ROI trước/sau, 6 nhóm khách hàng mục tiêu, 10 use case cụ thể, tech stack tóm tắt. **KHÔNG đọc file này khi build LP** — chỉ phục vụ tài liệu giới thiệu skill.

Skill này dùng để **build landing page hoàn chỉnh** theo đúng phong cách đặc trưng của user hoặc theo template có sẵn: design system liquid-glass-AI-tech + form đăng ký có thu thập đủ dữ liệu cho **Meta CAPI và/hoặc TikTok Events API 2.0** (nhưng **KHÔNG gọi CAPI từ frontend** — backend của user sẽ tự làm). Hỗ trợ 3 cấu hình: Meta-only, TikTok-only, hoặc Dual-tracking (cả 2 cùng lúc, share event_id để dedup).

## Nguyên tắc bất biến (đọc kỹ trước khi viết code)

1. **100% tiếng Việt có dấu** cho mọi văn bản hiển thị cho user (heading, body, button, placeholder, error message, FAQ, footer). Không được viết "Dang ky", "Dong y" — phải là "Đăng ký", "Đồng ý". Chỉ tên biến JS/CSS và nội dung chuyển khoản mới dùng không dấu.
2. **KHÔNG BAO GIỜ** đặt access token của Meta CAPI hoặc TikTok Events API, pixel secret, hay bất kỳ credential nào vào frontend. KHÔNG gọi `https://graph.facebook.com/.../events` hay `https://business-api.tiktok.com/open_api/v1.3/event/track/` từ client. Lý do: token sẽ bị lộ 100% nếu đặt trong HTML/JS.
3. **Flow tracking chuẩn (áp dụng cho cả Meta và TikTok)**:
   - Frontend **chỉ** gọi `fbq('track', ...)` (Meta Pixel) và/hoặc `ttq.track(...)` (TikTok Pixel) browser-side.
   - Khi submit form, frontend thu thập tracking data tương ứng với platform user chọn:
     - **Meta**: `fbc`, `fbp`, `client_user_agent`, `client_ip_address`, `event_source_url`, `fbclid`
     - **TikTok**: `ttclid`, `ttp`, `client_user_agent`, `client_ip_address`, `page_url`, `page_referrer`
     - **Chung 2 bên**: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `ref`, `event_id`, `event_time`
   - IP lấy qua Cloudflare trace + fallback ipify/ipinfo; có `waitForIP` (Meta) / `waitForTracking` (TikTok & dual - chờ thêm cookie `_ttp`) chờ resolve trước khi submit.
   - POST payload lên **webhook backend của user**. Backend tự gọi Meta CAPI và/hoặc TikTok Events API → tự hash email/phone (SHA-256) → tự dedup bằng `event_id` trùng với Pixel.
   - Trong code frontend phải có comment rõ: `// KHÔNG gọi CAPI ở đây — backend tự xử lý qua webhook`.
   - **Dùng 1 endpoint duy nhất cho cả 2 luồng**: đăng ký và kiểm tra thanh toán cùng POST về 1 URL (ví dụ `WEBHOOK_URL = 'https://YOUR-BACKEND/webhook-landing'`). Phân luồng bằng field `event` trong payload: `"event": "lead"` khi user gửi đăng ký, `"event": "check_pay"` khi user bấm kiểm tra thanh toán. Backend đọc `event` để chọn nhánh xử lý. **KHÔNG** được dùng 2 URL khác nhau hay phương thức GET cho check payment.
   - **Khi dual-tracking (Meta + TikTok)**: 1 form duy nhất, 1 webhook duy nhất, payload chứa CẢ Meta fields + TikTok fields, fire CẢ `fbq()` và `ttq.track()` với CÙNG `event_id` để backend dedup cả 2 phía.
4. **Không tự ý gửi dữ liệu khi user đang gõ/điền**. Chỉ gửi lên webhook **sau khi** user nhấn nút Submit và pass validation + honeypot.
5. **Honeypot bắt buộc**: thêm field `website` ẩn với `aria-hidden="true"` và `tabindex="-1"`. Nếu có giá trị → bỏ qua request (bot filter).
6. **Dedup eventID**: event_id ở Pixel (browser) phải giống event_id gửi lên webhook để backend dedup với CAPI.
7. **Không thêm border-line viền rõ** cho glass card — chỉ dùng `box-shadow` inset + outer để tạo mép kính. `border: none` là mặc định.
8. **KHÔNG dùng bất kỳ đường line nào ở các khối** — không `border` viền card/section/panel, không `::before` gradient bar trên đầu khối, không `border-top`/`border-bottom` làm đường kẻ ngăn (kể cả divider giữa các dòng trong khối như `.bank-info-row`). Tách phần tử bằng khoảng cách (padding/margin/gap) hoặc nền (background), KHÔNG bằng đường kẻ. Ngoại lệ DUY NHẤT: ô `input`/`select` trong form giữ `border` mảnh vì cần ranh giới vùng nhập rõ ràng.
9. **Tách từ bằng dấu `-` (ASCII), không dùng `—` (em-dash)** và **dùng `->` thay cho `→`** trong mọi văn bản hiển thị (heading, body, button, bank-info value, transferContent, console log…). Lý do: user GĐT yêu cầu thống nhất kiểu chữ ASCII gọn gàng, dễ copy-paste, không lệch font giữa các OS.
10. **Responsive**: media query tại 1024px (tablet ngang), 768px (tablet dọc) và 480px (mobile) cho blob, grid, hero, form, typography, nav menu.
11. **Header BẮT BUỘC có nav menu + hamburger drawer mobile** — markup + CSS + JS đầy đủ ở `references/sections-core.md` mục 5 (Header navigation + Mobile drawer). Không được làm header chỉ có logo + 1 nút CTA.
12. **Footer BẮT BUỘC link tới các trang chính sách TỰ SINH** (KHÔNG dùng URL cố định noti.vn nữa): Chính sách bảo mật + Điều khoản dịch vụ cho MỌI LP; thêm Chính sách thanh toán nếu LP có thanh toán QR. Skill tự sinh các trang này thành file HTML riêng, nội dung khớp nội dung LP — footer link tương đối (`chinh-sach-bao-mat.html`, `dieu-khoan-su-dung.html`, `chinh-sach-thanh-toan.html`). Xem mục "Trang chính sách tự sinh" và `references/policy-pages.md`.
13. **Mọi card/section liệt kê có STT (pain points, pillars, formulas, steps, features đánh số) BẮT BUỘC dùng badge nổi bật gradient** - không để số trần dạng text nhạt. 3 kiểu chuẩn: (a) `.card-number` - badge tròn 44px gradient góc phải trên card, chữ trắng 800-weight, shadow `0 6px 16px rgba(0,97,255,.3)`; (b) `.pillar-badge` - pill gradient nổi lên trên viền card (`top:-18px`), chữ "TRỤ CỘT 01/02/03" hoặc "BƯỚC 01"...; (c) `.formula-num` pill - gradient pill đè viền trên card (`top:-14px;left:1.5rem`), chữ 800-weight letter-spacing 1.5px. Khi h3 cùng dòng với `.card-number` góc phải, BẮT BUỘC `padding-right:3rem` trên h3 để chữ không đè badge. Mobile `≤768px` scale badge xuống 38px.
14. **Form section - tiêu đề trong card BẮT BUỘC căn giữa**: `.form-title{text-align:center}` cho state đăng ký; `.payment-qr>h3, .payment-qr>p{text-align:center}` cho state hiện QR; `.payment-confirmed` đã center mặc định. Lý do: form-container đã max-width 600px - tiêu đề căn giữa cân đối với QR + bank-info bên dưới. KHÔNG để tiêu đề form text-align:left khi content bên dưới là QR hoặc icon center.
15. **Icon BẮT BUỘC dùng SVG inline từ `assets/icons/`** — KHÔNG dùng emoji (✓, ✗, ☆, 📞, 📍, 🎁…), KHÔNG dùng icon font (Font Awesome / Material Icons / Bootstrap Icons), KHÔNG dùng `<img src="...svg">`. Mọi icon trên LP đều paste inline SVG từ thư mục `assets/icons/<category>/<category>-<name>.svg` (**6 category**: `ui`, `commerce`, `trust`, `contact`, `feature`, `payments`). 5 category đầu giữ `stroke="currentColor"` (stroke 1.75) để đổi màu qua CSS. Riêng category `payments/` (brand payment logos — Visa/Mastercard/ATM/Apple Pay) là **ngoại lệ**: giữ brand colors hard-coded + rectangular viewBox để đảm bảo nhận diện logo. Nếu không có icon phù hợp trong manifest → ƯU TIÊN tạo file SVG mới trong folder category đúng + cập nhật `assets/icons/README.md`; KHÔNG được inline icon "tự vẽ" trực tiếp trong LP. Đọc `assets/icons/README.md` trước khi build LP để biết toàn bộ 138 icon đang có + naming convention + size/CSS pattern + 2 ngoại lệ (filled variant + payments brand logos).

> **Phạm vi nguyên tắc design:** #7, #8, #13 mô tả phong cách template phong cách glass (noti-vn). Template có `design-system.md` khác (ví dụ `shopee`, `tiktok-shop`, `apple`, `shopify`, `hasaki-vn`, `tgdd`, `coolmate`, `long-form` — flat, không gradient, không glass; dùng viền mảnh / đổi màu nền để tách khối) thì tuân theo `design-system.md` của template đó. Các nguyên tắc còn lại (#1-6, #9-12, #14, #15) áp dụng cho MỌI template.

## Quy trình làm việc — 8 bước tuần tự

> **Quan trọng về `AskUserQuestion`**: tool này có hard-limit **1-4 câu / batch**, mỗi câu **2-4 options multi-choice**. Câu free-text (URL, Pixel ID, BANK/STK, tên doanh nghiệp…) KHÔNG dùng `AskUserQuestion` — hỏi qua chat thông thường ở Bước 4.

### Bước 1 — Phân tích brief, infer những gì rõ

Đọc message của user và TRƯỚC HẾT suy luận các thông tin đã có:

- **Style/template**: nếu user nói "kiểu Apple" → `apple`; "kiểu Shopee" → `shopee`; "phong cách Noti / GĐT" hoặc không nói gì → `noti-vn` (mặc định); "trang bán hàng dài" → `long-form`…
- **Loại LP**: event/khóa học/SaaS launch/ebook → để định hình section default (header/hero/stats/agenda/speaker/CTA…)
- **Có thanh toán hay chỉ thu lead**: nếu user mention "thu tiền", "VietQR", "đăng ký có phí" → có QR; ngược lại → lead-only

Cái gì rõ rồi thì KHÔNG hỏi lại. Chỉ hỏi cái thực sự ambiguous.

### Bước 2 — Batch 1 `AskUserQuestion` (4 quyết định ARCHITECTURE)

Gom vào **1 batch duy nhất** (≤4 câu multi-choice):

1. **CAPI platform** (2-3 options): `Meta (Facebook/Instagram)` / `TikTok` / `Cả hai (dual-tracking dedup event_id)`
2. **Storage destination** (2 options): `Webhook backend (default — hỗ trợ CAPI server-side + check_pay)` / `Google Sheet dùng script (CHỈ lead, không CAPI server-side, không QR)`
3. **Có thanh toán QR không?** (2 options): `Có` / `Không (chỉ thu lead)` — **nếu Storage = Google Sheet ở câu 2, force option duy nhất = Không**
4. **Trường form custom** (multi-select 2-4 options): mặc định là `họ tên + email + SĐT`; user multi-select thêm `Địa chỉ` / `Tỉnh thành` / `Ghi chú` / `Dropdown phân loại`

**Validation sau batch**:
- Nếu Storage = Google Sheet + Có QR → STOP, gửi 1 message giải thích quy tắc loại trừ + re-ask batch (chỉ 2 câu: đổi storage hay bỏ QR).

### Bước 3 — Batch 2 `AskUserQuestion` (chỉ khi cần — Design system)

Hỏi 1 câu MÀ THÔI nếu Bước 1 không infer được template:

- **Design system** (3-4 options): `noti-vn (default — liquid glass)` / `Template e-commerce phẳng (shopee/tiktok-shop/hasaki-vn/tgdd/coolmate)` / `Template premium (apple/shopify)` / `Tự nhập design system`

Nếu user chọn group e-commerce/premium → ask follow-up text (qua chat) để chọn template cụ thể.

Nếu user chọn `Tự nhập` → gửi gợi ý extension Noti (xem mục "Design system → Bước 1 → lựa chọn 2").

Nếu Bước 1 đã infer rõ template → BỎ QUA Bước 3.

### Bước 4 — Hỏi free-text qua chat (không dùng `AskUserQuestion`)

Đây là các giá trị TEXT/CONFIG, không phù hợp multi-choice. Gom 1 message chat duy nhất:

```
Để mình bắt đầu build, gửi mình mấy thông tin sau:

1. URL endpoint webhook (vd `https://noti.vn/api/landing-hook`) hoặc URL Google Apps Script Web App. Nếu chưa có, mình để placeholder.

2. Pixel ID:
   - Meta Pixel ID (nếu chọn Meta hoặc Cả hai)
   - TikTok Pixel Code dạng `C12ABC...` (nếu chọn TikTok hoặc Cả hai)
   - Nếu chưa có, ghi "chưa có" → mình để 'YOUR_PIXEL_ID'

3. [CHỈ KHI CÓ QR] Thông tin VietQR (5 trường):
   - BANK (mã ngân hàng: MB / VCB / TCB / ACB / BIDV / TPB / VPB…)
   - STK (số tài khoản)
   - ACCOUNT_NAME (tên người nhận VIẾT HOA KHÔNG DẤU)
   - AMOUNT (số tiền VNĐ)
   - PREFIX (prefix nội dung CK — DK / CAFE / COURSE…)
   - Cấu trúc Response check_pay của backend (mặc định `{"status":"pending"|"success"}` — gửi 1 ví dụ JSON nếu khác)

4. Thông tin cho trang chính sách + header LP:
   - Tên doanh nghiệp / thương hiệu
   - Email liên hệ
   - SĐT liên hệ
   - Logo + favicon - chọn 1 trong 3 mode:
     a) Có 2 ảnh riêng (light + dark): gửi 2 URL + favicon URL
     b) Có 1 ảnh dùng chung: gửi 1 URL logo + favicon URL
     c) Chưa có ảnh: text-only logo (in tên thương hiệu, favicon SVG inline ký tự đầu trên gradient)
   - **KHÔNG fallback bằng logo Noti.vn / brand khác** - nếu không cung cấp = mặc định Mode C text-only

5. [Optional] Ngày/giờ sự kiện cho countdown (nếu là event landing).
```

KHÔNG hỏi lẻ từng cái — gom thành 1 message. Cái nào user trả lời "chưa có" → để placeholder + đánh dấu TODO trong code.

### Bước 5 — Đọc reference + assets theo lựa chọn

| Điều kiện | File phải đọc |
|---|---|
| Mọi LP | `assets/icons/README.md` (manifest 138 icon + cách dùng inline SVG) |
| Mọi LP | `references/sections-core.md` (markup CORE: hero/FAQ/CTA/footer/header+drawer/features/button) |
| LP có section nâng cao (stats/countdown/video/pricing/before-after/numbered badges/form QR) | `references/sections-advanced.md` (load on-demand) |
| Mọi LP | `references/policy-pages.md` (sinh chính sách bảo mật/điều khoản/thanh toán) |
| Mọi LP có form (CAPI bất kỳ) | `references/_utils.md` (4 block JS dùng chung: cookie helper, IP fetch, removeDiacritics/generateCode, validateField — paste TRƯỚC platform helpers) |
| CAPI = Meta | `references/form-meta-capi.md` |
| CAPI = TikTok | `references/form-tiktok-capi.md` |
| CAPI = Cả hai | `references/form-capi-dual.md` |
| Storage = Webhook | (default — không cần file thêm) |
| Storage = Google Sheet | `references/storage-google-sheet.md` (BẮT BUỘC) |
| Có thanh toán QR | `references/payment-qr.md` + `references/backend-security.md` (lookup `(phone, code)` ngầm cho check_pay) |
| Có custom form fields | `references/form-fields.md` (markup + validateField + 18 ID JS-critical) |
| Storage = Webhook (kèm reminder bàn giao) | `references/backend-security.md` (10 checklist backend) |

Cũng đọc 3 file của template đã chọn: `system-design/<template>/design-system.md` + `starter-template.html` + `form-snippet.html`.

### Bước 6 — Build LP file (1 HTML duy nhất)

Workflow viết code:

1. **Copy `starter-template.html`** của template làm base
2. **Thêm Pixel snippet** vào `<head>` (Meta `fbq()` / TikTok `ttq.track()` / cả 2)
3. **Thêm JS tracking helpers** từ reference file (`getFbc/getFbp`, `getTtclid/getTtp`, `waitForIP/waitForTracking`, submit handler `lead`)
4. **Cấu hình `WEBHOOK_URL`** (top-level — KHÔNG lồng trong submit handler, tránh ReferenceError ở handler `check_pay`) + Content-Type (`application/json` cho Webhook, `text/plain;charset=utf-8` cho GAS — né CORS preflight)
5. **Thay nội dung sections** theo brief — header / hero / stats / features / speaker / agenda / testimonials / FAQ / CTA cuối / footer (default 7-8 section)
6. **Mở rộng form** nếu Bước 2 câu 4 có custom field — thêm tại vùng `[CUSTOM-FIELDS]` comment, đúng contract `references/form-fields.md`
7. **Thêm Payment QR block** nếu có QR — load `showPaymentQR()` + handler `check_pay` từ `references/payment-qr.md`
8. **Paste icon inline** từ `assets/icons/` cho mọi icon trên LP (bullet check, trust banner, contact phone/zalo, feature card…) — KHÔNG emoji, KHÔNG icon font, KHÔNG `<img src=...svg>`
9. **Footer link tương đối** tới 3 trang chính sách: `chinh-sach-bao-mat.html` / `dieu-khoan-su-dung.html` / `chinh-sach-thanh-toan.html` (nếu có QR)

### Bước 7 — Sinh 2-3 trang chính sách (file HTML riêng)

Theo `references/policy-pages.md`:

- `chinh-sach-bao-mat.html` (mọi LP) — khai báo ĐÚNG tracking đang dùng + liệt kê đầy đủ bên thứ 3 (Cloudflare/ipify cho IP, Google nếu GAS, Meta/TikTok cho CAPI, VietQR Solution cho ảnh QR)
- `dieu-khoan-su-dung.html` (mọi LP)
- `chinh-sach-thanh-toan.html` (chỉ LP có QR)

Cùng thư mục output với LP. Footer LP đã link tương đối tới.

### Bước 8 — Bàn giao + nhắc check

Khi giao file BẮT BUỘC nhắc user:

- Thay `WEBHOOK_URL` thực tế (nếu để placeholder)
- Thay Pixel ID thực (nếu để `YOUR_PIXEL_ID`)
- **Backend BẮT BUỘC triển khai `references/backend-security.md`** (10 checklist: dedup `event_id` UNIQUE, lookup `(phone, code)` ngầm cho check_pay, hash email/phone SHA-256, rate-limit IP+phone, honeypot defense-in-depth…)
- Rà soát nội dung chính sách cho khớp doanh nghiệp + nhờ luật sư check (Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân)
- Nếu Storage = Google Sheet: nhắc user 2 hạn chế (không CAPI server-side, không hỗ trợ QR)

---

**Quy tắc loại trừ Google Sheet + thanh toán QR**: kiểm tra trong Bước 2 (validation sau batch). Storage = GAS thì câu 3 "Có QR?" chỉ được phép = "Không" — vì `check_pay` cần backend lookup trạng thái theo phone+code (ideally tích hợp API NH như Casso/SePay), GAS không phù hợp (latency, quota, không có job polling NH).

## Bộ khung file

Landing page là **1 file HTML duy nhất** (CSS + JS inline) trong thư mục output. Dùng file `starter-template.html` của template đã chọn (ví dụ `system-design/noti-vn/starter-template.html`) — đây là bản rút gọn có đủ: header, hero, 1 section ví dụ, form đăng ký, payment QR, JS hoàn chỉnh. Copy rồi chỉnh nội dung, thêm section theo yêu cầu user.

**Mọi icon trong LP** đều inline SVG copy từ `assets/icons/` — đọc `assets/icons/README.md` để biết toàn bộ icon đang có và cách dùng. Tuyệt đối KHÔNG emoji, KHÔNG icon font, KHÔNG `<img>` (xem mục "Hệ thống icon SVG (BẮT BUỘC)" và nguyên tắc bất biến #15).

Ngoài file LP, skill còn **tự sinh 2-3 trang chính sách** (file HTML riêng, cùng thư mục với LP) — xem mục "Trang chính sách tự sinh".

### Index 10 file `references/` (đọc theo điều kiện ở Bước 5)

| File | Khi nào đọc | Vai trò |
|---|---|---|
| `_utils.md` | Mọi LP có form (CAPI bất kỳ) | 4 block JS dùng chung — `getCookie`, IP fetch, `removeDiacritics`+`generateCode`, `validateField`. Paste TRƯỚC platform helpers để tránh duplicate. |
| `form-meta-capi.md` | CAPI = Meta | Pixel + JS tracking helpers Meta-specific + payload chuẩn (giả định đã paste `_utils.md`) |
| `form-tiktok-capi.md` | CAPI = TikTok | Pixel + JS tracking helpers TikTok-specific + payload chuẩn (giả định đã paste `_utils.md`) |
| `form-capi-dual.md` | CAPI = Cả hai | Dual-tracking, dedup `event_id`, 1 form / 1 webhook (giả định đã paste `_utils.md`) |
| `payment-qr.md` | Có thanh toán QR | `showPaymentQR()` + handler `check_pay` + URL VietQR |
| `form-fields.md` | Có custom form field | Catalog trường, markup `.form-group`, 18 ID JS-critical, trường nhạy cảm CẤM thu |
| `storage-google-sheet.md` | Storage = Google Sheet | Code Apps Script `doPost(e)` + deploy + Content-Type `text/plain`. Schema Sheet = form fields + URL params only (drop tracking metadata). |
| `policy-pages.md` | Mọi LP | Template Chính sách bảo mật / Điều khoản / Thanh toán + danh sách bên thứ 3 |
| `sections-core.md` | Mọi LP | CORE: hero, FAQ, final CTA, footer (placeholder logo), header+drawer (BẮT BUỘC), features grid, quy ước văn bản, button presets |
| `sections-advanced.md` | LP dùng section nâng cao | ADVANCED on-demand: stats counter, countdown, hero video YouTube, pricing card, before/after, numbered badges (3 variant), form title centering (QR) |
| `backend-security.md` | Storage = Webhook (nhắc user khi bàn giao) | 10 checklist backend BẮT BUỘC — `event_id` UNIQUE dedup, lookup `(phone, code)` ngầm cho check_pay (code 32-char entropy 190 bit), SHA-256 email/phone trước CAPI, rate-limit, sanitize SQL/XSS, response format phân biệt `lead` vs `check_pay` |

## Design system

Skill lưu các bộ design system trong thư mục `system-design/`. **Mỗi THƯ MỤC CON trong `system-design/` là 1 template hoàn chỉnh** — tự chứa đủ bộ giao diện riêng:

| File trong thư mục template | Vai trò |
|---|---|
| `design-system.md` | CSS tokens (màu, shadow, radius, transition, keyframes) + component chuẩn (`.glass`, `.section-tag`, `.section-header`, `.reveal`, `.gradient-text`, blob, hero grid/particles/neural, header scrolled, theme toggle…) |
| `starter-template.html` | Khung trang HTML hoàn chỉnh, dựng sẵn theo đúng style của template |
| `form-snippet.html` | Khối UI form đăng ký + payment QR theo đúng style của template |

Chọn template nào thì dùng **trọn bộ 3 file** của template đó — giao diện trang lẫn form đều khớp nhau. Skill thiết kế để mở rộng: thêm template mới chỉ cần tạo thêm 1 thư mục con, KHÔNG cần sửa logic skill.

### Cách chọn design system (xem Bước 1-3 trong "Quy trình làm việc")

Skill có 9 template có sẵn + lựa chọn "Tự nhập". Logic chọn:

1. **Bước 1 (Phân tích brief)** — infer template từ ngôn ngữ user. Nếu user mention "kiểu Apple", "phong cách Shopee", "GĐT/Noti.vn", "trang bán dài"… → chọn ngay template tương ứng, KHÔNG cần hỏi.
2. **Bước 3 (Batch 2 AskUserQuestion)** — chỉ chạy khi Bước 1 không infer được. Hỏi 1 câu duy nhất với 3-4 group options.
3. **Mặc định**: nếu user không có yêu cầu đặc biệt hoặc không rõ → dùng template `noti-vn`.

#### Khi user chọn "Dùng template có sẵn"

Liệt kê TẤT CẢ thư mục con trong `system-design/` (dùng `ls system-design/`). Mỗi template có file `design-system.md` với dòng đầu `# <Tên hiển thị>` và blockquote `> <mô tả ngắn>` ngay sau — dùng `<Tên hiển thị>` làm label và `<mô tả ngắn>` làm description khi present options. Sau khi user chọn 1 template cụ thể, dùng cả 3 file trong thư mục template đó: `design-system.md` (tokens) + `starter-template.html` (khung trang) + `form-snippet.html` (form).

Nếu trong Batch 2 user chọn group (vd "Template e-commerce phẳng" gồm 5 template) → ask follow-up qua chat thông thường để chốt template cụ thể (vì AskUserQuestion mỗi câu chỉ 2-4 options).

#### Khi user chọn "Tự nhập design system"

Gửi tin nhắn này NGUYÊN VĂN cho user để họ clone style nhanh từ website tham chiếu:

> Bạn có thể sử dụng extension lấy system design này của Noti: https://chromewebstore.google.com/detail/design-system-extractor/dkdggcninpaaihlehfliimejfogdhikg -> cài vào Google Chrome -> mở website cần clone style giao diện -> mở extension -> ở phần system chọn **Extract Page** -> copy kết quả gửi vào giao diện chat -> để AI tiến hành làm việc -> lấy style của giao diện bạn gửi.

Khi user paste kết quả extract (thường là JSON/text có color tokens, typography scale, spacing, radius, shadow, gradient, component sample) → Claude phân tích và map vào CSS tokens chuẩn của skill (`:root` variables) thay cho template `noti-vn` mặc định. **KHÔNG bỏ qua** nguyên tắc bất biến + 6 category icon + 18 ID JS-critical của form khi áp dụng style mới.

Nếu user không có extension output → hỏi free-text: màu primary + secondary (hoặc gradient), font chữ, phong cách (glass / flat / khác), có dark mode hay không. Cấu trúc component, responsive breakpoints, nguyên tắc card vẫn theo chuẩn skill.

### Các template hiện có trong `system-design/`

- `noti-vn/` — **System Design Noti.vn**: liquid-glass AI-tech, gradient `#0061ff -> #00c2ff`, font Inter, blob nền động, hero grid/particles/neural, dark/light theme.
- `shopee/` — **System Design Shopee**: phong cách trang sản phẩm Shopee mobile, cam Shopee `#ee4d2d`; đặc trưng có thanh mua hàng cố định đáy + khối giá cam + badge Mall + voucher chip + hàng thông tin chevron + khối gập accordion; nền trắng/xám, bo góc nhỏ sắc 2-4px, phẳng, font Roboto.
- `tiktok-shop/` — **System Design TikTok Shop**: phong cách trang sản phẩm TikTok Shop, đỏ TikTok `#fe2c55`; đặc trưng có thanh mua hàng cố định đáy màn hình + banner giá nền tối + voucher chip; vàng `#ffc700` (sao/giảm giá) + teal (freeship); nền trắng, bo góc 8px, phẳng, mobile-first.
- `apple/` — **System Design Apple**: phong cách trang sản phẩm Apple iPhone 17 Pro — sân khấu ĐEN cinematic (`#000000` + near-black `#1d1d1f`), chữ trắng `#f5f5f7` / xám `#86868b`, ảnh sản phẩm là trung tâm; nút pill (xanh `#0066cc` CTA + pill mờ tối); font SF Pro (fallback Inter), letter-spacing âm; phẳng tuyệt đối — KHÔNG shadow, chiều sâu chỉ là viền ring 1px; KHÔNG gradient/glass.
- `shopify/` — **System Design Shopify**: phong cách Shopify.com, 2 canvas — cinematic nền đen `#000000` (hero, footer) + transactional nền sáng/kem (pricing, form); display chữ MỎNG weight 330, nút LUÔN hình pill, accent mint aloe `#c1fbd4` / pistachio `#d4f9e0` (chỉ track sáng), font Inter + stylistic set `ss03`; KHÔNG gradient/glass/dark mode toàn trang.
- `hasaki-vn/` — **System Design Hasaki.vn**: phong cách trang sản phẩm Hasaki mobile, 2 màu — xanh lá `#1aa055` (header/tiêu đề section/trust/nút phụ) + cam `#ff6600` (giá/CTA/sao/badge); đặc trưng thanh đáy 2 nút (xanh "còn SP" + cam "Mua online"), khối giá cam, tabs gạch cam, accordion, tem tròn tin cậy; nền trắng, bo góc nhỏ, phẳng, mobile-first + desktop 2 cột.
- `tgdd/` — **System Design Thế Giới Di Động**: phong cách trang sản phẩm điện máy/điện thoại — header vàng `#ffd400`, giá đỏ `#d70018`, nút "MUA NGAY" đỏ to + "Trả góp 0%"; đặc trưng breadcrumb, khối giá đỏ + badge giảm %, box khuyến mãi vàng nhạt, chip chọn dung lượng/màu, bộ chọn số lượng, dải tin cậy, dòng "siêu thị có hàng", thanh mua hàng cố định đáy 2 nút; nền trắng/xám, phẳng, bo góc nhỏ, mobile-first + desktop 2 cột.
- `coolmate/` — **System Design Coolmate**: phong cách one-brand store thời trang — trắng sạch nhiều khoảng thở, navy `#2d2c4d` (tiêu đề + CTA tối) + accent xanh `#0a68ff`; đặc trưng color swatch, chip chọn size + link hướng dẫn size, bộ chọn số lượng, dải trust "đổi trả 60 ngày", lưới đặc tính vải, thanh mua hàng cố định đáy; phẳng, bo góc vừa, font Inter, mobile-first + desktop 2 cột.
- `long-form/` — **System Design Long-form Sales Page**: trang bán hàng dài direct-response — cấu trúc vấn đề -> khuấy động -> giải pháp -> bằng chứng -> chào hàng -> bảo hành -> CTA; accent cam `#ea580c` (hành động) + xanh `#15803d` (tin cậy), nền section xen kẽ trắng/kem/xám; đặc trưng hero headline lớn, pain card, khối lợi ích, dải số liệu + testimonial, offer card neo giá, khối cam kết hoàn tiền, FAQ accordion, thanh CTA cố định đáy; phẳng, font Inter.

(Danh sách này tự mở rộng khi có thư mục mới — luôn `ls system-design/` để lấy danh sách thực tế thay vì tin tuyệt đối vào dòng trên.)

### Thêm template mới

Tạo 1 thư mục con mới trong `system-design/` (ví dụ `system-design/shopee/`), gồm đủ 3 file theo đúng cấu trúc của `noti-vn/`:
- `design-system.md` — dòng đầu `# <Tên hiển thị>`, dòng kế blockquote `> <mô tả ngắn 1 dòng>` (dùng để hiển thị khi user chọn template), phần thân CSS `:root` tokens + `[data-theme="dark"]` (nếu có dark mode) + component CSS chuẩn
- `starter-template.html` — khung trang dựng theo style của template đó
- `form-snippet.html` — khối UI form theo style của template đó

Thư mục mới tự động xuất hiện trong danh sách cho user chọn ở Bước 1 — KHÔNG cần sửa SKILL.md.

### Khi user chọn template `noti-vn` — các giá trị KHÔNG được sai

- Primary: `#0061ff` / Secondary: `#00c2ff` / Gradient: `linear-gradient(135deg, #0061ff 0%, #00c2ff 100%)`
- Font: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- Radius: sm 8 / md 12 / lg 16 / xl 20 / 2xl 24 / pill 50
- Dark theme kích hoạt qua `[data-theme="dark"]` trên `<html>`

(Các template khác trong `system-design/` có bộ giá trị riêng — tuân theo `design-system.md` của template tương ứng. Khi user tự nhập design system thì dùng giá trị user cung cấp.)

## Form đăng ký + luồng thanh toán

**Tùy lựa chọn CAPI platform của user, đọc reference file tương ứng:**

| User chọn | Reference file phải đọc |
|---|---|
| Meta (Facebook/Instagram) | `references/form-meta-capi.md` |
| TikTok | `references/form-tiktok-capi.md` |
| Cả hai (Meta + TikTok) | `references/form-capi-dual.md` (kết hợp cả 2, hướng dẫn dedup) |

Mỗi file `references/form-*-capi.md` cung cấp phần **cấu hình + logic tracking** của form (dùng chung cho mọi template):
- Pixel snippet HTML đặt trong `<head>` — KHÁC nhau theo platform
- Đầy đủ JS tracking helpers: `getFbc`/`getFbp` (Meta), `getTtclid`/`getTtp` (TikTok), `removeDiacritics`, `generateCode`, `waitForIP`/`waitForTracking`, submit handler `lead` (POST webhook)
- Payload chuẩn gửi lên backend webhook (có đủ field CAPI tương ứng platform cần)
- Cấu trúc HTML form (honeypot + validation fields + submit) làm mẫu tham chiếu

Phần **giao diện** form (HTML khối form + CSS `.form-section`, `.form-group`, `.payment-qr`, `.payment-confirmed`…) lấy từ file `form-snippet.html` của template đã chọn (ví dụ `system-design/noti-vn/form-snippet.html`) — KHÔNG lấy CSS form từ `references/`. `form-snippet.html` mặc định Meta-only; nếu user chọn TikTok hoặc cả 2 thì GIỮ phần giao diện của `form-snippet.html`, chỉ thay phần Pixel snippet + JS tracking theo reference tương ứng.

### Storage destination — Webhook vs Google Sheet

Tuỳ **câu hỏi #2 — storage destination** (trong Batch 1 của Bước 2), ngoài 3 file `form-*-capi.md` ở trên còn phải đọc thêm `references/storage-google-sheet.md` nếu user chọn Google Sheet:

| User chọn storage | Cần đọc thêm | Hỗ trợ thanh toán QR? | Ảnh hưởng tới code |
|---|---|---|---|
| Webhook backend (default) | Không cần file thêm | **CÓ** — đọc thêm `payment-qr.md` nếu landing có QR | `WEBHOOK_URL` = URL backend user, `fetch` Content-Type = `application/json`, backend gọi CAPI server-side + xử lý `check_pay` |
| Google Sheet dùng script | **`references/storage-google-sheet.md`** | **KHÔNG** — chỉ hỗ trợ lead-only landing | `WEBHOOK_URL` = URL Apps Script `/exec`, `fetch` Content-Type = `text/plain;charset=utf-8` (né CORS preflight), KHÔNG CAPI server-side, KHÔNG check_pay, KHÔNG forward. Sheet lưu form fields + URL params only. |

Payload `lead` GIỮ NGUYÊN giữa 2 lựa chọn — không thêm / không bớt 1 field nào. Skill chỉ đổi "kênh nhận" + "Content-Type", không đổi "data gửi đi".

**Quy tắc loại trừ Google Sheet + thanh toán QR**:
- Google Sheet storage **CHỈ áp dụng cho landing chỉ thu lead** (lead-gen, đăng ký sự kiện không thu tiền, ebook, demo…).
- Nếu landing có thanh toán QR → bắt buộc dùng `Webhook backend`. KHÔNG được sinh code GAS có handler `check_pay`. Lý do: luồng `check_pay` cần backend lookup trạng thái thanh toán theo phone+code (lý tưởng có tích hợp API ngân hàng như Casso/SePay) — GAS không phù hợp (latency 0.5-2s/request, quota 20k/ngày, không có job tự động polling NH, user phải mở Sheet đổi cột bằng tay → UX kém, không scale).
- Nếu user chốt cả 2 cùng lúc → STOP, hỏi lại để user chọn 1 trong 2: (a) đổi storage sang Webhook, hoặc (b) bỏ luồng thanh toán QR (chỉ thu lead — `form-snippet.html` tự ẩn khối QR khi không có data thanh toán).

File `storage-google-sheet.md` cung cấp đầy đủ: code Apps Script `doPost(e)` cho `lead` (CHỈ lead, không có check_pay), schema sheet (chỉ form fields + URL params — tracking metadata bị drop âm thầm), hướng dẫn deploy Web App, troubleshoot CORS, danh sách hạn chế. Khi user chọn Google Sheet, NÊU RÕ 2 hạn chế: "không CAPI server-side" + "không hỗ trợ thanh toán QR" trước khi build để user xác nhận.

### Trường thông tin form — mở rộng / rút gọn

Form mặc định trong mọi `form-snippet.html` và `starter-template.html` có **3 trường khách hàng nhập**: họ tên (`#fullname`), email (`#email`), số điện thoại (`#phone`). Đây là 3 trường tối thiểu — đủ cho hầu hết landing lead-gen.

Sau khi hỏi **câu hỏi #4 — form fields tuỳ chỉnh** (trong Batch 1 của Bước 2), nếu user cần thu thêm trường (địa chỉ, tỉnh/thành, ghi chú, số lượng, dropdown phân loại…), thêm trường vào **vùng đánh dấu `[CUSTOM-FIELDS]`** — comment nằm sẵn trong `<form id="regForm">` của mọi template, giữa trường `#phone` và nút submit. **BẮT BUỘC đọc `references/form-fields.md`** trước khi thêm: file đó mô tả đầy đủ contract — markup `.form-group`, cách `validateField` xử lý, cách đưa giá trị vào `payload` (cho cả 3 file `form-*-capi.md`), và **danh sách trường nhạy cảm tuyệt đối KHÔNG thu**. Khi thêm trường: giữ nguyên honeypot `#website` và **18 ID JS-critical** (xem `form-fields.md`), không đặt `id` trùng.

### Payment QR + check_pay — module dùng chung `references/payment-qr.md`

Phần hiển thị mã QR chuyển khoản + kiểm tra thanh toán (`check_pay`) đã tách ra **1 file dùng chung**: `references/payment-qr.md`. Logic này GIỐNG HỆT nhau cho Meta / TikTok / dual — không phụ thuộc platform; 3 file `form-*-capi.md` chỉ trỏ tới đây.

- Landing **chỉ thu lead** (submit xong hiện cảm ơn): KHÔNG đọc `payment-qr.md`, không gọi `showPaymentQR`.
- Landing **có thanh toán QR** (submit xong hiện QR): đọc `payment-qr.md` KÈM với file platform. File platform lo tracking + submit `lead`; `payment-qr.md` lo `showPaymentQR()` + handler `check_pay` + hỏi thông tin VietQR + cách build URL VietQR.

**Contract response `check_pay` (mặc định)**: backend trả JSON `{ "status": "pending" }` (chưa nhận tiền) hoặc `{ "status": "success" }` (đã nhận đủ) -> frontend `data.status === 'success'` thì hiện `#paymentConfirmed`. **BẮT BUỘC hỏi user cấu trúc Response thực tế của backend** — đề nghị user gửi 1 ví dụ JSON. Nếu backend dùng field / giá trị khác (ví dụ `{ "paid": true }`) thì sửa điều kiện `if (data && data.status === 'success')` trong `payment-qr.md`, `starter-template.html` và `form-snippet.html` cho khớp. Chi tiết đầy đủ xem `references/payment-qr.md`.

## Các section hay dùng

Đọc `references/sections-core.md` (CORE - mọi LP) để lấy markup + CSS mẫu cho: hero, FAQ accordion, final-cta dark gradient, footer (placeholder logo), **header nav menu + mobile drawer**, features grid, button presets, quy ước văn bản. Khi LP cần section nâng cao (stats counter, countdown, hero video YouTube, pricing card, before/after column, numbered card badges, form title centering cho QR) → đọc thêm `references/sections-advanced.md`. Không copy nguyên xi - điều chỉnh content theo brief user.

## Hệ thống icon SVG (BẮT BUỘC)

Skill cung cấp bộ **138 icon SVG inline** tại `assets/icons/` để dùng **THỐNG NHẤT** cho mọi landing page. **Khi build LP, BẮT BUỘC đọc `assets/icons/README.md` trước khi paste icon vào HTML** — file này có manifest đầy đủ, naming convention, hướng dẫn CSS wrap + size + đổi màu qua `currentColor`, pattern dùng phổ biến (feature grid, bullet check, trust banner, floating contact, social footer), và ngoại lệ `*-filled` variant cho active state.

| Category | Folder | Prefix | Số icon | Use case chính |
|---|---|---|---:|---|
| UI cơ bản | `assets/icons/ui/` | `ui-` | 44 | Action / navigation / system (arrow, chevron, menu, search, eye, share, download, upload, alert, play, bell, refresh, home, heart, grid, loader, sun, moon, image, send, quote, bookmark, camera, filter, warning-circle...) |
| Commerce | `assets/icons/commerce/` | `commerce-` | 26 | E-commerce / thanh toán (cart, cart-plus, bag, credit-card, wallet, qr-code, voucher, return, percent, shipping, category, fire, live, store-plus, marketplace, cash-back, truck-fast...) |
| Trust & Social proof | `assets/icons/trust/` | `trust-` | 16 | Bảo mật / chứng nhận (shield, verified, certificate, medal, trophy, fingerprint, handshake, gem, crown, stamp...) |
| Contact & Social channels | `assets/icons/contact/` | `contact-` | 20 | Liên hệ + 10 social platform (phone, mail, zalo, messenger, facebook, instagram, tiktok, youtube, whatsapp, telegram, linkedin, twitter-x, threads, discord...) |
| Feature & Benefit | `assets/icons/feature/` | `feature-` | 28 | Section lợi ích/tính năng (rocket, bulb, target, chart, brain, cpu, robot, zap, graduation, video, mic, checklist, megaphone, reels, leaf, support, warranty...) |
| **Payments** (brand logos) | `assets/icons/payments/` | `payments-` | 4 | Logo phương thức thanh toán cho payment trust banner (Visa, Mastercard, ATM/NAPAS, Apple Pay) |

> **2 ngoại lệ cho rule "stroke 1.75 currentColor"**:
>
> 1. **`*-filled` variant cho active state** — 2 icon `ui-heart-filled` và `ui-star-filled` dùng `fill="currentColor"` (vẫn KHÔNG hard-code màu) — cặp với `ui-heart` / `ui-star` (outline) để hiển thị active state (favorite toggled, sao đã chọn). Toggle 2 SVG khi user tương tác.
> 2. **Category `payments/`** — Brand payment logos (Visa #06C, Mastercard #EA001B + #F79F1A, ATM/NAPAS #008F5D) PHẢI giữ brand colors hard-coded + rectangular viewBox (46x29 cho card, 114x27 cho Apple Pay) để duy trì nhận diện logo. Riêng `payments-apple-pay.svg` monochrome dùng `currentColor`. Use case duy nhất: payment trust banner ở footer / gần form thanh toán. KHÔNG dùng cho navigation/feature/CTA.

**Format chuẩn của mọi icon** (KHÔNG được tự ý đổi): `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="1.75"`, `stroke-linecap="round"`, `stroke-linejoin="round"`, `aria-hidden="true"`. Stroke style only (outline 1.75px) — KHÔNG dùng filled style.

**Quy tắc tuyệt đối khi build LP**:

- **PHẢI paste inline SVG** trực tiếp vào HTML (copy nguyên nội dung file `.svg` từ `assets/icons/<cat>/<cat>-<name>.svg`). KHÔNG dùng `<img src="...">`, KHÔNG dùng `<use href="...">` (sẽ vỡ khi mở local file).
- **CẤM dùng emoji** thay icon (✓, ✗, ☆, 📞, 📍, 🎁, 🚚, ⏰…) — luôn thay bằng SVG inline tương ứng (ví dụ: ✓ → `ui-check.svg`, 📞 → `contact-phone.svg`, 🚚 → `commerce-shipping.svg`, ⏰ → `contact-clock.svg`).
- **CẤM dùng icon font** (Font Awesome, Material Icons, Bootstrap Icons, Phosphor, Lucide CDN…). Lý do: tăng request HTTP, FOIT/FOUT, phụ thuộc external CDN, không khớp design system stroke-1.75.
- **CẤM hard-code màu** `fill="#..."` hoặc `stroke="#..."` trong SVG — phải giữ `stroke="currentColor"` để điều khiển màu qua CSS `color` ở wrapper.
- **Đổi màu** bằng cách set `color` ở phần tử cha (`.icon-wrap{color:var(--primary)}` hoặc inline `style="color:var(--success)"`). KHÔNG sửa thuộc tính `stroke` trong SVG.
- **Đổi size**: set `width`/`height` ở wrapper hoặc gắn vào `<svg>` khi paste; giữ NGUYÊN `viewBox="0 0 24 24"`. Khuyến nghị: 16px (badge), 20-24px (button/nav), 28-40px (card feature), 48-64px (hero).

**Khi cần icon chưa có trong manifest**:

1. Tạo file mới ở folder category phù hợp với đúng format chuẩn (kebab-case: `<category>-<name>.svg`).
2. Cập nhật bảng manifest trong `assets/icons/README.md`.
3. Cập nhật `changelog.md` (thêm 1 dòng ghi icon mới).
4. KHÔNG được paste 1 icon "tự vẽ" trực tiếp vào HTML LP rồi quên lưu vào `assets/icons/` — sẽ phá vỡ tính thống nhất + tái sử dụng của skill.

## Trang chính sách tự sinh

Ngoài landing page, skill tự sinh các trang chính sách thành **file HTML riêng** (cùng thư mục với LP), nội dung khớp với LP, footer LP link tới chúng:

- **Chính sách bảo mật** + **Điều khoản dịch vụ** — sinh cho MỌI LP (vì LP nào cũng có form thu thập dữ liệu cá nhân).
- **Chính sách thanh toán** — chỉ sinh khi LP có thanh toán QR.

Đọc `references/policy-pages.md` để lấy: thông tin cần hỏi user (tên doanh nghiệp, liên hệ), bố cục từng trang, template HTML, cách link từ footer. Nội dung Chính sách bảo mật phải khai báo ĐÚNG tracking LP dùng (Meta Pixel/CAPI, TikTok Pixel/Events API, hoặc cả hai).

Đây là văn bản MẪU — khi giao file BẮT BUỘC nhắc user rà soát lại cho khớp thực tế kinh doanh và nhờ người có chuyên môn pháp lý kiểm tra (Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân).
