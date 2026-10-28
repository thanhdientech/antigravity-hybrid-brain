# Changelog — design-landingpage-vip-v2

Lịch sử thay đổi của skill. Mục mới nhất ở trên cùng.

> **QUY TẮC**: Mỗi lần Claude sửa bất kỳ file nào trong skill, BẮT BUỘC: (1) bump version + cập nhật `Last updated` trong SKILL.md; (2) thêm 1 mục mới vào ĐẦU file này.

## v2.44 (2026-05-29)

**FIX D — Redundancy / dead code**: Gom 4 vấn đề audit D1-D8 vào 1 entry.
- **D4**: Thêm note `assets/icons/preview.html` vào README — không còn dead file.
- **D1-D3**: Tạo `references/_utils.md` gom 4 block JS shared (cookie helper, IP fetch, removeDiacritics+generateCode, validateField). 3 file `form-*-capi.md` gỡ duplicate, paste TRƯỚC platform helpers. Tiết kiệm ~6KB token mỗi build.
- **D7**: Đổi `POSITIONING.md` → `_POSITIONING.md` (prefix `_` signal non-functional doc). SKILL.md update tham chiếu + ghi rõ "KHÔNG đọc khi build LP".
- **D8**: Tách `sections.md` (22KB) → `sections-core.md` (14KB, mọi LP) + `sections-advanced.md` (10KB, load on-demand). Update 10 tham chiếu trong SKILL.md, _POSITIONING.md, policy-pages.md, 5 design-system.md, 2 starter-template.html. Section header drawer đổi từ mục 8 → mục 5 (core), footer từ mục 7 → mục 4 (core).
- Phụ A5: footer + header trong sections-core.md đã thay logo Noti hardcoded bằng placeholder Mode A/B/C (consistent với policy-pages.md).

## v2.43 (2026-05-29)

**FIX A5 — Bỏ logo Noti hardcoded trong policy-pages**: Template policy hardcode 3 URL `noti.vn` (favicon + logo light + logo dark) -> mọi LP sinh ra cho user khác đều mang logo Noti, gây nhầm thương hiệu + rủi ro pháp lý. Thay bằng placeholder + 3 mode (A: 2 ảnh light/dark, B: 1 ảnh dùng chung, C: text-only — mặc định nếu user chưa có ảnh). Favicon Mode C dùng SVG inline ký tự đầu tên brand trên gradient.
- `policy-pages.md`: mục 2 thêm cách hỏi logo theo 3 mode, template HTML thay placeholder + 3 block mode, thêm cấm fallback brand khác.
- `SKILL.md` Bước 4: thêm logo + favicon vào danh sách hỏi user.

## v2.42 (2026-05-29)

**FIX A1 — Đồng bộ numbering câu hỏi**: 8 file references vẫn dùng số cũ `#6`/`#7` (từ skill 7 câu), không khớp Batch 1 hiện tại 4 câu. Đổi sang format `câu hỏi #<số> — <semantic name>` để stable hơn.
- `#7` (storage) → `#2 — storage destination`
- `#6` (form fields) → `#4 — form fields tuỳ chỉnh`
- Sửa 19 chỗ trong 8 file: `form-*-capi.md` (3 file), `form-fields.md`, `storage-google-sheet.md`, `payment-qr.md`, `backend-security.md`, `SKILL.md`.

## v2.41 (2026-05-29)

**FIX A2 — Bỏ pay_token HMAC**: Spec backend yêu cầu HMAC `pay_token` cho `check_pay` nhưng frontend không parse/lưu/gửi lại -> nếu backend làm đúng spec sẽ reject 403 toàn bộ check_pay. Thay bằng dùng `code` 32 ký tự `crypto.getRandomValues` (entropy ~190 bit) làm token ngầm + rate-limit phone + không leak invalid record.
- `backend-security.md`: viết lại mục 2.6, gỡ pay_token khỏi checklist + pseudo-code Node.js, gỡ `SECRET` env.
- `form-meta-capi.md`, `form-tiktok-capi.md`, `form-capi-dual.md`: response `lead` từ `{status, pay_token}` → `{status}`. Box ⚠ backend-security: `pay_token` → lookup `(phone, code)` ngầm.
- `SKILL.md` (3 chỗ: dòng 128/164/192) + `POSITIONING.md` (2 chỗ: row D + USP #8): cùng pattern.
- Backward-compat: LP cũ vẫn chạy (frontend từ đầu không gửi pay_token).

## v2.40 (2026-05-29)

**REVERT v2.39**: Bỏ hoàn toàn tính năng forward webhook + Config.gs token Meta/TikTok khỏi storage Google Sheet. Lý do user yêu cầu: storage Sheet quay về vai trò gốc "chỉ lưu form data", không gửi đi đâu khác. Đồng thời rút gọn schema Sheet: **chỉ lưu form fields + URL parameters**, drop âm thầm các trường tracking metadata (fbc/fbp/ttp cookies, IP, User-Agent, event_source_url, page_referrer, action_source, event_name CAPI…).

- **`references/storage-google-sheet.md`** — gỡ toàn bộ:
  - Mục 5.2 (file Config.gs) — xoá hoàn toàn.
  - Function `forwardToWebhook(payload)` trong mục 5 Code GAS — xoá.
  - Call site `forwardToWebhook(p)` trong `handleLead` — gỡ. Response không còn field `forwarded` / `forward_status`.
  - Section "Forward webhook (CAPI relay)" trong mục 9 troubleshoot (8 entry: 401/403, 404, 5xx, timeout, rotate token…) — xoá.
  - Bước 3a (tạo Config.gs) trong mục 6 deploy — xoá. Bước 9 (test) revert về chỉ check "row có trong sheet".
  - Mục 7 hạn chế: thay "CAPI gián tiếp qua forward webhook" → "Không bắn được CAPI server-side". Xoá entry "Token Meta/TikTok lưu trong Config.gs owner-level". Thêm entry mới: "Không lưu tracking metadata — sheet chỉ form fields + URL params".
  - Mục 8 bảng so sánh: revert 3 dòng CAPI/Hash/Phù hợp về YES-vs-NO. Thêm 1 dòng mới "Lưu tracking metadata: YES (webhook) vs NO (GAS)".
- **Schema Sheet rút gọn (mục 4)** — từ 28 cột (có fbc/fbp/event_id/event_source_url/page_referrer/IP/UA/…) xuống **18 cột**:
  - `timestamp_server` (server-side enrichment)
  - Form fields (6): `fullname`, `email`, `phone`, `agree`, `code`, `timestamp` (client ISO)
  - URL params (10): `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `ref`, `fbclid`, `gclid`, `ttclid`, `msclkid`
  - `extra_json` (catch-all cho custom form field user thêm qua câu hỏi #6 — KHÔNG chứa tracking metadata)
- **Đổi tên `HEADERS` → `LEAD_HEADERS`** trong code GAS để rõ scope (chỉ schema sheet Leads, không liên quan HTTP header). Thêm `DROPPED_KEYS` constant — danh sách field bị drop âm thầm (fbc/fbp/ttp/event_id/event_time/event_name*/event_source_url/page_url/page_referrer/referrer_raw/action_source/client_user_agent/client_ip_address/event).
- **Mục 1 nguyên tắc bất biến** rewrite #1 + #3 + #4: bỏ "payload identical to webhook" (vì GAS giờ filter), response contract về `{status, message, code}`, GAS là dead-end không forward.
- **Mục 2 recap câu #7**: hạn chế GAS đổi về "không CAPI server-side" + "không hỗ trợ QR" (2 hạn chế gốc), bỏ phần ask `FORWARD_WEBHOOK_URL` + token Meta/TikTok ở step text-input.
- **`SKILL.md`** mục 189, 287, 296: revert mô tả `storage-google-sheet.md` về phiên bản tối giản. Bump version 2.39 → 2.40.

KHÔNG đụng: form-*-capi.md (storage Webhook không đổi gì), payment-qr.md, backend-security.md, 9 template `system-design/`, 138 icon, POSITIONING.md, file other. Quy tắc loại trừ Google Sheet + thanh toán QR giữ nguyên (vẫn cấm). Storage Webhook backend tiếp tục là path duy nhất cho landing có thanh toán QR / cần CAPI server-side.

## v2.39 (2026-05-29)

Mở rộng `references/storage-google-sheet.md` — thêm cơ chế **forward sang webhook ngoài** với token Pixel Meta/TikTok đi qua **HTTP header**. Mục đích: cho phép landing chọn storage Google Sheet vẫn có CAPI server-side (gián tiếp qua webhook backend như n8n / Make / server riêng / dịch vụ Noti) mà KHÔNG cần expose token ở frontend và KHÔNG cần đổi storage sang Webhook.

- **File mới `Config.gs`** (đặt cùng project Apps Script với `Code.gs`) chứa 8 biến: `META_PIXEL_ID`, `META_ACCESS_TOKEN`, `META_TEST_EVENT_CODE`, `TIKTOK_PIXEL_CODE`, `TIKTOK_ACCESS_TOKEN`, `TIKTOK_TEST_EVENT_CODE`, `FORWARD_WEBHOOK_URL` (mặc định `https://auto.webhook.vn/webhook/03fe75ff-6527-4e32-a0a8-7f27f7867604` — dịch vụ Noti), `FORWARD_ENABLED` (bật/tắt forward). Tách config khỏi business logic → re-deploy `Code.gs` không cần nhập lại token, rotate token chỉ sửa 1 file, share `Code.gs` review không lộ secret. Apps Script global scope share giữa các `.gs` → `Code.gs` đọc trực tiếp biến không cần import.
- **`Code.gs` thêm function `forwardToWebhook(payload)`**: dùng `UrlFetchApp.fetch` với `muteHttpExceptions: true` (forward fail KHÔNG phá lead save — lead đã ở sheet rồi). Headers gửi đi: `X-Forwarded-By`, `X-Event`, `X-Meta-Pixel-Id`, `X-Meta-Access-Token`, `X-Meta-Test-Event-Code`, `X-Tiktok-Pixel-Code`, `X-Tiktok-Access-Token`, `X-Tiktok-Test-Event-Code` (chỉ thêm khi biến tương ứng có giá trị — không gửi header rỗng). Body = nguyên payload form (đã enrich `timestamp_server` + normalize `event_source_url` + merge `event_name` cho dual). `handleLead` gọi `forwardToWebhook` sau `appendRow` thành công và trả response thêm 2 field `forwarded: true/false`, `forward_status: <httpCode>` để dev nhìn được kết quả forward qua DevTools.
- **Mục 6 (deploy) thêm bước 3a**: tạo `Config.gs` (➕ Files → Script → "Config") + điền 5 nhóm cấu hình. Bước 9 thêm 3 điểm kiểm tra: row trong sheet + `forwarded: true` trong response + backend nhận đủ header.
- **Mục 7 (hạn chế) bổ sung**: (a) đổi entry "Không bắn được CAPI server-side" thành "CAPI gián tiếp qua forward webhook" với mô tả flow + degrade graceful, (b) thêm entry mới về Config.gs là owner-level secret — ai có quyền Edit spreadsheet đều đọc được, KHÔNG share quyền Edit cho người ngoài, viewer/commenter thì an toàn.
- **Mục 8 (bảng so sánh)** cập nhật 3 dòng: CAPI, hash, "Phù hợp với" — phản ánh GAS giờ có CAPI gián tiếp qua forward.
- **Mục 9 (troubleshoot)** thêm subsection "Forward webhook (CAPI relay)" với 8 entry: `forwarded: false` + 3 nguyên nhân (no URL / disabled / exception), 401/403 (backend auth), 404 (URL sai), 5xx (backend lỗi nhưng lead vẫn save), submit chậm 5-10s, backend thiếu field, token KHÔNG được leak ra response, quy trình rotate token (revoke → sửa Config.gs → re-deploy giữ URL `/exec`).
- **Mục 2 (recap câu #7)** đổi mô tả Google Sheet option: từ "Không bắn CAPI server-side được" → "GAS có thể forward toàn bộ payload sang 1 webhook ngoài kèm token Meta/TikTok trong HTTP header để webhook tự bắn CAPI". Khi user chọn GAS → hỏi thêm `FORWARD_WEBHOOK_URL` + token Meta/TikTok ở step text-input.
- **Mục 1 (nguyên tắc bất biến #3)** cập nhật response contract: thêm field `forwarded`. Mục 1 #4 viết lại: GAS không gọi CAPI trực tiếp mà forward sang webhook ngoài.
- **`SKILL.md` mục 189 (bảng index references)** thêm mô tả `Config.gs` + forward webhook cho row `storage-google-sheet.md`. Mục 287 (bảng storage destination) sửa cột "Cấu hình" cho row Google Sheet: thêm "CAPI server-side gián tiếp qua forward webhook + token đi HTTP header". Mục 296 (paragraph end) liệt kê thêm file `Config.gs` + function `forwardToWebhook` + header names trong nội dung file storage-google-sheet.md.
- **`SKILL.md` Last updated** bump 2026-05-28 (v2.38) → 2026-05-29 (v2.39).

KHÔNG đụng: nguyên tắc 138 icon, 9 template `system-design/`, 8 file references khác, code form-*-capi.md, payment-qr.md, backend-security.md. Storage = Webhook backend không bị ảnh hưởng (file form-*-capi.md giữ nguyên). Quy tắc loại trừ Google Sheet + thanh toán QR giữ nguyên (vẫn cấm).

## v2.38 (2026-05-28)

- Thêm file mới `POSITIONING.md` (root level skill, cùng cấp với SKILL.md) — chứa marketing & USP material để Claude/user có thể dùng ngay khi cần viết pitch / sales / description giới thiệu skill.
- Nội dung `POSITIONING.md`: bản chất skill, 5 nhóm vấn đề doanh nghiệp giải quyết (Tracking / Form&Bot / Compliance / Thanh toán / Maintain&Scale), 10 USP cốt lõi, bảng ROI trước/sau 7 chỉ số, 6 nhóm khách hàng mục tiêu, 10 use case + template gợi ý, 1 câu USP súc tích, quy trình 8 bước tóm tắt, tech stack.
- `SKILL.md` — thêm block quote ngay sau dòng "Last updated" trỏ tới `POSITIONING.md` cho Claude discover (trigger khi user hỏi "skill này là gì", "USP", "giải quyết vấn đề gì", "khách hàng phù hợp", "ROI", "pitch deck", "sales page").

## v2.37 (2026-05-28)

Logic review + fix 7 vấn đề phát hiện qua rà soát skill (Phương án A):

- **Critical 1 — AskUserQuestion 4-question limit**: Cũ ghi "gom vào 1 batch" 7 câu, nhưng tool hard-cap 1-4 câu/batch. **Restructure thành 8-step workflow** với 2 batch (≤4 câu mỗi batch) + 1 step text-input qua chat thông thường.
- **Critical 2 — Circular dependency câu 3 ↔ câu 7**: Cũ ghi "URL format tuỳ storage destination (câu 7)" nhưng cả 2 trong cùng batch → không thể format đúng. **Đảo order**: Storage hỏi TRƯỚC (Batch 1 câu 2), URL hỏi SAU (Bước 4 text-input — đã biết format từ Batch 1).
- **Critical 3 — Quy tắc loại trừ QR + GAS POST-HOC**: Cũ user có thể chọn cả 2 conflict rồi mới được hỏi lại. **Fix**: Bước 2 câu 3 (Có QR?) **force option "Không"** nếu câu 2 đã chọn Google Sheet — validation ngay trong batch options.
- **Critical 4 — Wording "URL nhận cả 2 event" sai cho GAS**: Cũ ghi URL nhận cả `lead` và `check_pay`. Nhưng GAS storage (v2.25) reject `check_pay`. **Fix wording**: "URL nhận event(s): `lead` luôn có; `check_pay` chỉ khi Storage = Webhook + có QR".
- **Medium 5 — Conflict line 72 vs 76**: Cũ vừa nói "gom 2-3 câu" vừa nói "1 batch 7 câu". **Fix**: gỡ hoàn toàn 2 câu conflict, thay bằng note rõ "AskUserQuestion hard-limit 1-4 câu/batch, free-text qua chat thông thường".
- **Medium 6 — `backend-security.md` không link trong SKILL.md**: File 10 checklist quan trọng chỉ ref gián tiếp qua 3 file `form-*-capi.md`. **Fix**: Thêm vào bảng "Index 9 file `references/`" trong mục "Bộ khung file" + step "Bàn giao" nhắc rõ user phải triển khai checklist này khi storage=Webhook.
- **Medium 7 — Vi phạm rule #15 trong template tiktok-shop**: Line 305 `starter-template.html` dùng `★★★★★` unicode (5 ký tự star) thay vì SVG inline. **Fix**: Thay bằng 5x `ui-star-filled.svg` inline với `color:#ffc700` (vàng TikTok Shop chuẩn) và `display:inline-flex;gap:1px` để giữ layout.
- **Minor — Design system hỏi 2 lần**: Cũ có "Câu 2 Design system" trong batch + "Bước 1" trong mục Design system → hỏi 2 lần. **Fix**: Đổi mục "Design system" thành "Cách chọn design system (xem Bước 1-3 trong Quy trình làm việc)" — chỉ document logic, không hỏi lại; Bước 1 (Phân tích brief) infer trước, Bước 3 (Batch 2) chỉ ask khi không infer được.
- **Minor — Thiếu "đọc icons/README.md" trong workflow**: Cũ rule #15 mention nhưng workflow không list. **Fix**: Thêm vào Bước 5 (Đọc reference) — đứng đầu bảng "Mọi LP đều phải đọc".

Phần "Nguyên tắc bất biến", "Design system templates", "Form đăng ký + luồng thanh toán", "Hệ thống icon SVG", "Trang chính sách tự sinh" GIỮ NGUYÊN. Skill vẫn 9 template + 138 icon / 6 category.

## v2.36 (2026-05-28)

- Bổ sung **gợi ý extension** trong mục Design system khi user chọn "Tự nhập design system": Chrome Web Store extension `design-system-extractor` của Noti (`dkdggcninpaaihlehfliimejfogdhikg`) — cài vào Chrome -> mở website cần clone -> Extract Page -> paste kết quả vào chat. Claude sẽ tự map output extract vào CSS tokens chuẩn của skill thay cho template `noti-vn` mặc định.
- Cập nhật `SKILL.md` mục **"Design system → Bước 1 → lựa chọn 2"** với block quote nguyên văn thông điệp gửi cho user (để Claude trigger câu hỏi không tự diễn dịch sai), kèm hướng dẫn xử lý output sau khi user paste.

## v2.35 (2026-05-28)

Review toàn bộ 9 template trong `system-design/` → phát hiện 6 gap critical + 11 bổ sung high-value. Thêm 17 icon (121 → **138**):

- **UI (+11)**: `ui-loader` (spinner partial circle — 9/9 form-snippet dùng), `ui-sun` + `ui-moon` (noti-vn theme toggle), `ui-image` (product image placeholder cho coolmate/shopee/tiktok-shop), `ui-send` (paper plane — long-form submit), `ui-upload` (đối ngẫu ui-download cho file upload form), `ui-quote` (testimonial section), `ui-bookmark` (save/wishlist), `ui-camera` (photo upload), `ui-filter` (filter products), `ui-warning-circle` (form validation error — khác `ui-alert-triangle` cho danger).
- **Feature (+3)**: `feature-leaf` (eco/organic/xanh), `feature-support` (24/7 CSKH — headphone + clock), `feature-warranty` (bảo hành chính hãng — shield + check).
- **Commerce (+2)**: `commerce-cash-back` (hoàn tiền, cashback), `commerce-truck-fast` (giao siêu tốc với motion lines).
- **Trust (+1)**: `trust-stamp` (tem xác thực, dấu "Approved").

**Phát hiện vi phạm rule #15**: `system-design/tiktok-shop/starter-template.html` line 305 dùng emoji `★★★★★` thay vì SVG inline `ui-star-filled`. Cần fix template-side ở batch sau (không thuộc scope icon update này).

**Sau update**: UI=44, Commerce=26, Trust=16, Contact=20, Feature=28, Payments=4 → tổng **138 icon / 6 category**.

## v2.34 (2026-05-28)

- Thêm 4 icon từ batch Facebook UI (117 → **121 icon**). User gửi 8 SVG, lọc còn 4 mới (convert sang chuẩn stroke 1.75 currentColor):
  - UI (+1): `ui-grid` (3x3 apps grid — phân biệt với `commerce-category` 2x2).
  - Commerce (+1): `commerce-marketplace` (gian hàng có mái che kiểu marketplace).
  - Feature (+2): `feature-megaphone` (announcement/loa quảng cáo), `feature-reels` (short video/Reels stack trong frame).
- 4 icon đã skip: Facebook logo (trùng `contact-facebook`), home filled (trùng `ui-home`), video play (trùng `feature-video`), small notification 12x12 (ambiguous + tương tự `ui-bell`).

## v2.33 (2026-05-28)

- Thêm **category mới `payments/`** với 4 brand payment logos (113 → **117 icon**, 5 → **6 category**):
  - `payments-visa.svg` (blue `#06C` + orange accent `#E6A540`)
  - `payments-mastercard.svg` (overlapping red `#EA001B` + orange `#F79F1A`)
  - `payments-atm.svg` (green `#008F5D` — NAPAS/ATM nội địa)
  - `payments-apple-pay.svg` (monochrome — dùng `currentColor`)
- **Ngoại lệ thứ 2 cho rule "stroke 1.75 currentColor"** (sau `*-filled`): category `payments/` PHẢI giữ brand colors hard-coded + rectangular viewBox (46x29 cho card, 114x27 cho Apple Pay) để đảm bảo nhận diện logo. Riêng Apple Pay monochrome nên dùng được `currentColor`. Documented rõ trong README.md (mục "Ngoại lệ 2") + SKILL.md (nguyên tắc bất biến #15 + section "Hệ thống icon SVG").
- 3 icon đã skip từ batch user gửi: "FAST DELIVERY" banner (text-heavy brand asset), thumbs-up trong circle (đã có `trust-thumbs-up`), YouTube full logo (đã có `contact-youtube`).
- Use case của `payments/`: chỉ dùng cho payment trust banner ở footer hoặc gần form thanh toán — KHÔNG dùng cho navigation/feature/CTA.

## v2.32 (2026-05-28)

- Thêm 4 icon từ batch Shopee thứ 2 (109 → **113 icon**). User gửi 10 SVG, lọc còn 4 mới (convert sang chuẩn stroke 1.75 currentColor):
  - UI (+3): `ui-more-horizontal` (3 dots), `ui-smartphone` (mobile device), `ui-help-circle` (?  trong tròn).
  - Commerce (+1): `commerce-store-plus` (storefront + plus — đăng ký bán hàng / mở shop).
- 6 icon trùng/skip: truck (≈shipping), star-filled, search, heart (đã có), shopee-bag-logo (brand asset), shopee-text-logo (brand asset).

## v2.31 (2026-05-28)

- Merge icon từ skill `landingpage-shopee` (29 icon, lọc trùng còn 9 mới): 100 → **109 icon**.
- 9 icon mới (convert sang chuẩn stroke 1.75 currentColor):
  - UI (+4): `ui-home`, `ui-heart`, `ui-heart-filled`, `ui-star-filled`.
  - Commerce (+4): `commerce-cart-plus`, `commerce-category`, `commerce-fire`, `commerce-live`.
  - Trust (+1): `trust-crown`.
- **Ngoại lệ rule "stroke only"**: `ui-heart-filled` + `ui-star-filled` dùng `fill="currentColor"` thay vì `stroke="currentColor"` — phục vụ active state toggle (favorite/rating UI). Vẫn KHÔNG hard-code màu. README + SKILL.md ghi rõ ngoại lệ này.
- 20 icon trùng đã bỏ qua: arrow-right, cart, chat, check, chevron-right, clock, close, coin, lightning (≈flash-sale), location, minus, plus, search, share, shield-check, star-empty (≈star), tag (≈price-tag), truck (≈shipping), user, logo-shopee (brand asset, không phải generic icon).

## v2.30 (2026-05-28)

- Mở rộng `assets/icons/` từ 32 → **100 icon** (5 category):
  - UI: 12 → 25 (+13: chevron up/left/right, eye, eye-off, share, download, info, alert-triangle, external-link, play, refresh, bell).
  - Commerce: 7 → 18 (+11: credit-card, wallet, cash, coin, package, store, receipt, return, percent, voucher, qr-code).
  - Trust: 7 → 14 (+7: certificate, thumbs-up, medal, trophy, fingerprint, handshake, gem).
  - Contact: 6 → 20 (+14: 10 social — facebook, instagram, youtube, tiktok, whatsapp, telegram, linkedin, twitter-x, threads, discord; 4 utility — globe, headset, chat, calendar).
  - **Feature (category mới)**: 23 icon — rocket, bulb, target, bar-chart, line-chart, trending-up, key, puzzle, layers, cpu, brain, robot, zap, users, user, graduation, book, video, mic, presentation, checklist, document, tools. Dùng cho section "Lợi ích / Tính năng / Vì sao chọn / Cách hoạt động" của LP.
- Format SVG giữ NGUYÊN chuẩn v2.27: `viewBox 0 0 24 24`, `stroke="currentColor"`, `stroke-width="1.75"`, round caps/joins.
- SKILL.md: nguyên tắc bất biến #15 cập nhật "5 category" (thêm `feature`). Bảng category trong section "Hệ thống icon SVG" thêm cột "Số icon" + "Use case chính" + row `feature`. Description frontmatter cập nhật mention "100 icon SVG inline".

## v2.29 (2026-05-28)

- Rút gọn `changelog.md`: chỉ giữ thay đổi kỹ thuật quan trọng (architecture, API contract, security fix, file structure, bug fix có ảnh hưởng behavior); gỡ chi tiết prose/process/copy tweak.

## v2.28 (2026-05-28)

- Rút gọn `description` frontmatter SKILL.md: 2030 → 830 ký tự. Nén MANDATORY TRIGGERS 27 → 15 cụm cốt lõi.

## v2.27 (2026-05-28)

- Thêm `assets/icons/` — 32 icon SVG inline, 4 category (`ui`, `commerce`, `trust`, `contact`). Naming `{category}-{name}.svg`.
- Format chuẩn cho mọi icon: `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="1.75"`, round caps/joins.
- SKILL.md: thêm nguyên tắc bất biến #15 — icon BẮT BUỘC inline SVG từ `assets/icons/`, CẤM emoji + icon font + `<img src=...svg>`. Áp dụng cho mọi template.

## v2.26 (2026-05-27)

Security/operational fixes:

- **Sheet formula injection** (`storage-google-sheet.md`): `sanitizeCell()` prefix `'` cho string bắt đầu bằng `= + - @ \t \r` trước khi `appendRow`. Chặn `=HYPERLINK`, `=IMPORTXML`, CSV injection.
- **GAS endpoint hardening**: thêm `SECRET_TOKEN` (frontend gửi field `secret` khớp) + `RATE_LIMIT_PER_HOUR` qua `CacheService`.
- **Sheet tab case-sensitive**: `handleLead` không tự `insertSheet`, không tìm thấy tab `Leads` → trả error rõ.
- **Backend security checklist** (file mới `references/backend-security.md`): 10 checklist — dedup `event_id` UNIQUE constraint chống replay attack, `pay_token` HMAC cho check_pay chống IDOR, hash email/phone trước CAPI, rate-limit IP+phone.
- **Response format phân biệt theo event**: `lead` → `{success|error, pay_token}`, `check_pay` → `{pending|success}`. Meta API `v21.0` → `v22.0`.
- **Webhook lead-only thank-you state**: submit handler thêm `else { showFormThanks() }` branch + markup `<div class="payment-confirmed" id="formThanks">` cho 9 template (form-snippet + starter-template).

## v2.25 (2026-05-27)

- **Quy tắc loại trừ Google Sheet + thanh toán QR**: storage `Google Sheet` CHỈ áp dụng landing lead-only. Landing có QR BẮT BUỘC `Webhook backend`.
- `storage-google-sheet.md` rewrite: gỡ `handleCheckPay`, sheet `Check`, cột `payment_status` (29 → 28 cột). `doPost` vẫn check `event === 'check_pay'` nhưng trả error rõ.
- `payment-qr.md`: module CHỈ tương thích Webhook backend.

## v2.24 (2026-05-27)

- Thêm **storage destination**: user chọn `Webhook backend` hoặc `Google Sheet dùng script` (GAS Web App). Payload + contract response giữ nguyên 100%; chỉ đổi URL + Content-Type (`text/plain;charset=utf-8` né CORS preflight cho GAS).
- Tạo `references/storage-google-sheet.md`: schema 29 cột, code `doPost(e)` + `handleLead` + `handleCheckPay`, helper `ensureHeaders`.
- SKILL.md thêm câu hỏi bắt buộc #7 storage destination.

## v2.23 (2026-05-26)

- **Validate checkbox/radio required**: `validateField` cũ dùng `i.value` → field `value="on"` mặc định luôn valid. Sửa: tách nhánh — checkbox required hợp lệ khi `i.checked`; radio required khi có ≥1 nút cùng `name` được chọn.
- **Race condition double-submit**: thêm guard `if(submitBtn.disabled)return;` đầu submit handler. Chỉ bật lại nút khi gửi thất bại.
- Áp dụng 18 template file + 3 `form-*-capi.md`.

## v2.22 (2026-05-26)

- **DOM null-guard khối QR**: bọc `getElementById('paymentQR')` null-check trước khi truy `.src` / `.textContent` — landing lead-only gỡ HTML thanh toán không còn TypeError.
- **Regex SĐT**: `/^0[0-9]{9}$/` → `/^(0[0-9]{9}|\+84[0-9]{9})$/`. Bỏ `.replace(/\s/g,'')`.

## v2.21 (2026-05-26)

- Thêm khả năng **tùy biến trường form** — đánh dấu vùng `[CUSTOM-FIELDS]` trong `<form id="regForm">` của 9 template.
- Tạo `references/form-fields.md`: catalog trường, markup `.form-group` (3 biến thể input/select/textarea), **18 ID JS-critical** không được trùng, danh sách trường nhạy cảm KHÔNG được thu (CCCD, số thẻ, mật khẩu, sức khỏe…).
- CSS `.form-group` mở rộng cho `<select>` + `<textarea>`.

## v2.20 (2026-05-26)

- Thêm 3 template: `tgdd`, `coolmate`, `long-form` → tổng 9 template. Giữ NGUYÊN contract: 18 ID JS-critical + bộ class hook + `<script>` chính. JS tương tác phụ (chip variant, quantity stepper, gallery thumbnail, countdown) đặt ở `<script>` phụ cuối file.

## v2.19 (2026-05-25)

- Layout desktop cho `hasaki-vn`: tái cấu trúc `.product-detail` gồm `.pd-gallery` + `.pd-info` — mobile 1 cột, desktop ≥1024px lưới 2 cột (gallery 440px | info).

## v2.18 (2026-05-25)

- Fix `.info-box` (`hasaki-vn`): xung đột class `.info-box` + `.page` khiến `margin:.5rem 1rem` đè `margin:0 auto`. Sửa: bọc `.info-box` trong container `.page` riêng.

## v2.17 (2026-05-25)

- Thêm template `hasaki-vn` (template thứ 6). Đủ 3 file chuẩn.

## v2.16 (2026-05-25)

- Template `apple` chuyển sang TỐI-chủ-đạo cinematic: nền `#000000` + near-black `#1d1d1f`, chữ trắng `#f5f5f7` + xám `#86868b`. Bỏ box-shadow, chiều sâu = viền ring 1px.

## v2.15 (2026-05-25)

- Thêm template `shopify` (template thứ 5).

## v2.14 (2026-05-25)

- Thêm template `apple` (template thứ 4).

## v2.13 (2026-05-25)

- Template `shopee` làm lại theo ảnh thật: `#d0011b` → `#ee4d2d`. Thêm sticky buy-bar, accordion (JS toggle), voucher chip, badge Mall.

## v2.11 (2026-05-25)

- Template `tiktok-shop` làm lại: `#e10543` → `#fe2c55`. Thêm sticky buy-bar trỏ `#form`, banner giá nền tối, voucher chip.

## v2.10 (2026-05-25)

- Thêm template `tiktok-shop` (template thứ 3).

## v2.9 (2026-05-25)

- Thêm template `shopee` (template thứ 2). Phạm vi: nguyên tắc bất biến #7/#8/#13 (glass) chỉ áp dụng cho template glass; template flat theo `design-system.md` riêng.

## v2.8 (2026-05-25)

- **Tự sinh trang chính sách**: Chính sách bảo mật + Điều khoản dịch vụ (mọi LP) + Chính sách thanh toán (LP có QR) thành file HTML riêng. Footer LP link tương đối, không còn URL cố định noti.vn.
- Tạo `references/policy-pages.md`. Nội dung khai báo đúng tracking LP dùng (Meta/TikTok/cả hai).

## v2.7 (2026-05-25)

- **`WEBHOOK_URL` scope fix**: 3 file `form-*-capi.md` khai báo `var WEBHOOK_URL` lồng trong submit handler → handler `check_pay` (top-level) gây `ReferenceError`. Đưa ra top-level.
- `starter-template.html`: bổ sung nav menu + hamburger drawer; footer 3 link policy; smooth-scroll tính offset header.
- Guard `if (typeof showPaymentQR === 'function')` cho landing lead-only.

## v2.5 (2026-05-25)

- Tách changelog ra file riêng `changelog.md`. SKILL.md chỉ giữ `Last updated`.

## v2.4 (2026-05-25)

- Tách Payment QR + `check_pay` ra `references/payment-qr.md` dùng chung. 3 file platform chỉ còn 1 mục trỏ tới.
- `showPaymentQR()` viết lại defensive: chỉ set `regName/regEmail/regPhone` khi element tồn tại.

## v2.3 (2026-05-25)

- Chuẩn hoá `check_pay` GIỐNG nhau cho Meta/TikTok/dual. Contract response mặc định `{ status: 'pending' | 'success' }`. BẮT BUỘC hỏi user response thực tế của backend.

## v2.2 (2026-05-25)

- Mỗi system design = 1 thư mục con trong `system-design/`, tự chứa `design-system.md` + `starter-template.html` + `form-snippet.html`. Gỡ thư mục `assets/` cũ.

## v2.1 (2026-05-25)

- Tách design system ra thư mục `system-design/`. BẮT BUỘC hỏi user dùng template có sẵn hay tự nhập.

## v2.0 (2026-05-23)

- Tracking TikTok: `getTtclid()` đọc cả query LẪN hash fragment + localStorage 30 ngày (khắc phục mất ttclid khi redirect 301 / link rút gọn đẩy param sang `#`).
- `cleanReferrer()` lọc scheme app TikTok (`android-app://`, `trill://`, `snssdk://`) + domain tracker (`analytics./ads./business-api.tiktok.com`).
- `waitForIP` → `waitForTracking` chờ thêm cookie `_ttp` (TikTok Pixel set async).
- Thêm field `referrer_raw`.

## v1.6.1 (2026-05-22)

- Đổi tên `form-capi.md` → `form-meta-capi.md`. Cache `URLSearchParams` vào `queryParams`. Bỏ toàn bộ đường line/divider (xóa `border-bottom` của `.bank-info-row`, gỡ token `--edge-color`).

## v1.6 (2026-05-22)

- Hỗ trợ TikTok Events API 2.0 song song Meta CAPI. Tạo `form-tiktok-capi.md` (ttclid + ttp + client_ip + client_user_agent + page.url + page.referrer) và `form-capi-dual.md` (dual-tracking 1 form / 1 webhook, dedup bằng `event_id`).

## v1.5 (2026-04-16)

- Thêm thu thập UTM params (utm_source/medium/campaign/content/term) + ref từ URL query string vào payload webhook.
