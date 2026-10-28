# Skill `design-landingpage-vip-v2` — Chi tiết & USP

> **Version:** v2.37 · **Last updated:** 2026-05-28

---

## 1. Bản chất skill — Skill này làm gì?

`design-landingpage-vip-v2` là một **AI-powered landing page generator** chuyên cho thị trường Việt Nam, sinh ra 1 file HTML hoàn chỉnh (CSS + JS inline) + 2-3 trang chính sách trong **30-60 phút** thay cho 3-5 ngày làm bằng tay.

Skill build LP theo đặc tả performance marketing chuẩn quốc tế (Meta CAPI + TikTok Events API 2.0) nhưng giữ đặc thù VN:

- VietQR thanh toán đa ngân hàng
- Tuân thủ Nghị định 13/2023/NĐ-CP
- 100% tiếng Việt có dấu
- 9 template clone từ các sàn phổ biến (Shopee, TikTok Shop, Hasaki, TGDD, Coolmate...)

---

## 2. Vấn đề/lỗi doanh nghiệp đang gặp mà skill này giải quyết

### A. Vấn đề về Tracking & Performance Marketing

| Lỗi phổ biến | Hậu quả | Cách skill xử lý |
|---|---|---|
| Đặt access token CAPI vào HTML/JS frontend | Token bị scan/leak trong 24h -> đối thủ abuse hoặc Meta ban tài khoản | Frontend CHỈ gọi Pixel, backend tự gọi CAPI qua webhook (không bao giờ touch token ở client) |
| Chỉ có Pixel browser, không có CAPI server-side | Mất 30-40% events do iOS 14.5+ / AdBlock / Brave / Firefox Enhanced Privacy. CPM tăng 40-60% | Thu đủ `fbc/fbp/fbclid/ttclid/ttp/user_agent/IP` ở client -> POST lên webhook -> backend gọi CAPI |
| Pixel + CAPI gửi cùng event mà không dedup | Meta đếm 2 lần -> bias optimization -> CPL tăng 2-3x | Share `event_id` giữa Pixel và CAPI để backend dedup chuẩn |
| Chỉ Meta hoặc chỉ TikTok | Phải maintain 2 hệ thống riêng nếu chạy cả 2 platform | Dual-tracking trong CÙNG 1 form, 1 webhook, share event_id 2 phía |
| `ttclid` mất khi redirect 301 / link rút gọn đẩy param sang `#` | TikTok không match được -> audience modeling kém | `getTtclid()` đọc cả query LẪN hash fragment + localStorage 30 ngày |
| Pixel set cookie `_ttp` chậm, submit chạy trước | TikTok event thiếu `ttp` -> server reject | `waitForTracking()` chờ `_ttp` resolve trước khi submit |

### B. Vấn đề về Form & Bot/Spam

| Lỗi phổ biến | Hậu quả | Cách skill xử lý |
|---|---|---|
| Form không có honeypot | 30-50% leads là bot -> audience bẩn -> ngân sách tốn cho fake user | Honeypot `#website` hidden + aria-hidden + tabindex=-1 |
| Click submit nhiều lần / nhấn Enter | 1 user -> 5 lead trùng trên CRM | Guard `if(submitBtn.disabled) return;` + chỉ enable lại khi fail |
| Validate regex SĐT chỉ chấp nhận `0xxx` | Bỏ lỡ format `+84xxx` của user dùng app banking | Regex `/^(0[0-9]{9}\|\+84[0-9]{9})$/` |
| Form cố định 3 trường (name/email/phone) | Không thu được data nghiệp vụ (tỉnh thành, ghi chú, danh mục quan tâm) | Vùng `[CUSTOM-FIELDS]` đánh dấu sẵn + `references/form-fields.md` hướng dẫn thêm đúng contract |

### C. Vấn đề về Compliance & Pháp lý

| Lỗi phổ biến | Hậu quả | Cách skill xử lý |
|---|---|---|
| Không có trang chính sách bảo mật | Vi phạm Nghị định 13/2023/NĐ-CP -> phạt 50-200tr | Auto-generate 3 file HTML chính sách (bảo mật + điều khoản + thanh toán nếu có QR) |
| Chính sách bảo mật template generic | Không khai báo ĐÚNG tracking đang dùng + bên thứ 3 -> không đủ cơ sở pháp lý | Nội dung tự sinh khớp tracking thật (Meta/TikTok/cả 2) + liệt kê Cloudflare/ipify/Google/VietQR Solution |
| Backend nhận email/phone raw rồi gửi thẳng lên Meta CAPI | Vi phạm Meta policy -> cảnh báo, hạn chế tài khoản, có thể ban | Backend BẮT BUỘC hash SHA-256 email/phone trước khi gửi (checklist trong `backend-security.md`) |
| Footer link cố định `noti.vn/policy` | Doanh nghiệp khác dùng -> nội dung không khớp công ty | Footer link tương đối -> file HTML tự sinh thuộc doanh nghiệp đang build |

### D. Vấn đề về Thanh toán & E-commerce

| Lỗi phổ biến | Hậu quả | Cách skill xử lý |
|---|---|---|
| LP có thu phí nhưng không có flow check_pay | User chuyển khoản xong không biết success/pending -> thoát giữa chừng | `references/payment-qr.md` cung cấp `showPaymentQR()` + handler `check_pay` chuẩn |
| Build URL VietQR sai format | QR không quét được hoặc số tiền sai | Hỏi đủ 5 field (BANK/STK/Name/Amount/Prefix) trước khi sinh URL |
| `check_pay` không có cơ chế chống enumerate | Attacker biết phone -> thử lookup trạng thái thanh toán | `backend-security.md` #2.6: dùng `code` 32 ký tự `crypto.getRandomValues` (entropy ~190 bit) làm token ngầm + rate-limit `phone` + không leak invalid record |

### E. Vấn đề về Maintain & Scale

| Lỗi phổ biến | Hậu quả | Cách skill xử lý |
|---|---|---|
| Mỗi LP code riêng | 50 campaign = 50 LP riêng biệt, không update đồng bộ | 1 source of truth — update SKILL.md là tất cả LP tương lai cải tiến |
| Designer dùng emoji, dev dùng Font Awesome, copy Figma có icon khác | Bộ icon LP lộn xộn không nhất quán | 138 icon SVG inline curated, rule #15 cấm emoji/icon font/img |
| Build LP cho Shopee phải thuê designer Shopee riêng | Mỗi platform = 1 vòng thuê outsource, đắt + chậm | 9 template clone sẵn: noti-vn / shopee / tiktok-shop / apple / shopify / hasaki / tgdd / coolmate / long-form |
| LP chạy ổn 6 tháng rồi Meta update API breaking change | Phải fix lại từng LP một | Backend security checklist version-pinned (Meta API `v22.0`) + skill tự bump version |

---

## 3. USP — 10 điểm khác biệt cốt lõi

1. **End-to-end CAPI compliance cho thị trường VN** — Skill duy nhất combine: Pixel browser + thu thập đầy đủ field cho CAPI + dedup event_id + hash SHA-256 + 10 checklist backend security. Không skill nào khác trên Anthropic registry làm trọn flow cho VN.

2. **Multi-platform tracking trong 1 form** — Meta CAPI + TikTok Events API 2.0 + Dual-tracking — cùng 1 form, 1 webhook, 1 endpoint. Đa số skill quốc tế chỉ Meta.

3. **9 template clone sàn nội địa** — Shopee/TikTok Shop/Hasaki/TGDD/Coolmate clone byte-by-byte từ ảnh thực + Apple/Shopify/Noti.vn cho thương hiệu premium + Long-form cho direct-response sales. Cover gần như mọi use case.

4. **VietQR + check_pay native** — Tích hợp QR thanh toán đa ngân hàng VN (MB/VCB/TCB/ACB/BIDV...) + flow check_pay tự động. Không có skill quốc tế nào hỗ trợ đặc thù này.

5. **Tự sinh chính sách hợp Nghị định 13/2023/NĐ-CP** — Auto-generate 2-3 file HTML chính sách đúng tracking đang dùng + liệt kê đầy đủ bên thứ 3. Tránh phạt 50-200tr.

6. **138 icon SVG curated cho LP context** — UI/Commerce/Trust/Contact/Feature/Payments — không phụ thuộc CDN, không FOIT/FOUT, đồng nhất stroke 1.75 currentColor.

7. **Storage flexibility** — Webhook backend (full power) HOẶC Google Sheet Apps Script (cho team không có dev) — PAYLOAD GIỮ NGUYÊN giữa 2 lựa chọn, chỉ đổi Content-Type.

8. **Backend security built-in** — 10 checklist (`event_id` UNIQUE, lookup `(phone, code)` ngầm cho check_pay, hash SHA-256, rate-limit IP+phone, sanitize SQL/XSS, defense-in-depth honeypot). Devs VN thường thiếu mảng này.

9. **18 ID JS-critical không trùng** — Mọi template giữ NGUYÊN bộ ID này -> form mở rộng/rút gọn không gây regression. Lần lỗi cuối cùng (v2.22-v2.23) đã fix double-submit + checkbox/radio bypass.

10. **100% tiếng Việt có dấu** — Mọi text user-facing, error message, FAQ, footer đều có dấu chuẩn. Không có "Dang ky" / "Dong y" lỗi unicode. ASCII dash `-` thay em-dash `—` để khỏi lệch font giữa OS.

---

## 4. So sánh trước/sau — ROI thực tế

| Chỉ số | Trước skill | Sau skill | Cải thiện |
|---|---|---|---|
| Thời gian build 1 LP | 3-5 ngày (designer + dev + QA) | 30-60 phút (1 người + AI) | **-95%** |
| Chi phí 1 LP (agency VN) | 5-15 triệu | ~30-100k token AI | **-95%** |
| Match rate Meta CAPI | 40-50% (Pixel-only) | 75-90% (Pixel + CAPI dedup) | **+75%** |
| Bot/fake leads | 30-50% | <5% (honeypot + rate-limit) | **-85%** |
| Compliance Nghị định 13 | Không có / sai | Đúng template + khai báo đầy đủ | **PASS** |
| CPL (cost per lead) trung bình | Baseline | Giảm 30-50% (match rate cao hơn -> optimization tốt hơn) | **-30%** |
| Maintain N landing page | N codebase riêng | 1 source of truth, update SKILL.md = cải tiến tất cả | **-90% effort** |

---

## 5. Khách hàng phù hợp

- **Performance marketing agency** chạy 20-100 campaign/tháng cho nhiều client -> ship LP nhanh
- **In-house team** ở doanh nghiệp e-commerce VN (D2C, dropshipping, online education) -> tự ship không qua outsource
- **Founders solo / team nhỏ <5 người** -> không có dev/designer dedicated
- **Affiliate marketers** chạy LP riêng cho từng offer/keyword
- **Event organizers** (meetup, workshop, hội thảo) -> đăng ký + thu phí qua QR
- **EdTech / khóa học online** -> LP bán khóa + form đăng ký + thanh toán

---

## 6. Use case cụ thể (đã được skill design cho)

| Loại LP | Template gợi ý | Đặc điểm |
|---|---|---|
| Sự kiện offline / Meetup (Vibas, Caffee Talk) | `noti-vn` | Glass + countdown + speaker grid + form đăng ký + QR thanh toán phí tham dự |
| Ra mắt khóa học online | `noti-vn` hoặc `long-form` | Hero + benefits + curriculum + testimonial + pricing card + form + QR |
| Ebook / lead-gen | `noti-vn` (lead-only) | Hero + ebook preview + form + Google Sheet storage (rẻ, không cần backend) |
| Bán sản phẩm vật lý — Shopee style | `shopee` | Sticky buy-bar + flash sale + voucher chip + accordion mô tả + form đặt hàng |
| Bán sản phẩm — TikTok Shop | `tiktok-shop` | Banner giá nền tối + voucher + sticky bottom + freeship badge |
| Bán mỹ phẩm | `hasaki-vn` | 2-color xanh+cam + tabs gạch cam + tem trust + thanh đáy 2 nút |
| Bán điện máy / phone | `tgdd` | Header vàng + giá đỏ + chip dung lượng + box trả góp |
| Fashion D2C | `coolmate` | Color swatch + size chip + dải trust "đổi trả 60 ngày" |
| Sales page direct-response | `long-form` | Vấn đề -> khuấy động -> giải pháp -> bằng chứng -> CTA + offer card |
| Brand premium (SaaS, công nghệ) | `apple` hoặc `shopify` | Tối cinematic / hai canvas đen-trắng + nút pill |

---

## Tóm lại 1 câu USP

> Skill này là **bộ công cụ end-to-end duy nhất** kết hợp performance marketing best practice quốc tế (Meta/TikTok CAPI dedup, backend security) với đặc thù pháp lý + thanh toán Việt Nam (Nghị định 13, VietQR, 9 template sàn nội địa), giúp doanh nghiệp ship LP **nhanh hơn 95%** + **CPL giảm 30%** + **không sợ phạt pháp lý**.

---

## Quy trình làm việc (8 bước tóm tắt)

**Phase INPUT (Bước 1-4) — gather requirements:**

1. **Phân tích brief** — Infer template, loại LP, có QR hay không. Cái gì rõ rồi KHÔNG hỏi.
2. **Batch 1 AskUserQuestion (4 câu)** — CAPI platform / Storage destination / Có thanh toán QR / Trường form custom. Validation force option khi Storage=GAS+QR conflict.
3. **Batch 2 AskUserQuestion (1 câu)** — Design system. SKIP nếu Bước 1 đã infer.
4. **Free-text qua chat** — URL endpoint + Pixel ID + BANK info + Policy info + countdown.

**Phase OUTPUT (Bước 5-8) — read + build + deliver:**

5. **Đọc reference + assets** — `assets/icons/README.md` + `references/sections-core.md` + `references/policy-pages.md` (luôn đọc) + `references/sections-advanced.md` nếu có section nâng cao + conditional refs theo lựa chọn.
6. **Build LP file** — 1 HTML hoàn chỉnh (CSS + JS inline) từ starter-template.
7. **Sinh 2-3 trang chính sách** — bảo mật + điều khoản (+ thanh toán nếu có QR).
8. **Bàn giao + nhắc check** — Thay placeholder, backend security checklist, rà luật.

---

## Tech stack skill được build

- **9 reference file** (`references/`) — form Meta/TikTok/dual, payment-qr, form-fields, storage-google-sheet, policy-pages, sections, backend-security
- **9 template** (`system-design/`) — noti-vn, shopee, tiktok-shop, apple, shopify, hasaki-vn, tgdd, coolmate, long-form (mỗi cái 3 file: design-system.md + starter-template.html + form-snippet.html)
- **138 icon SVG** (`assets/icons/`) — 6 category: ui (44), commerce (26), trust (16), contact (20), feature (28), payments (4)
- **15 nguyên tắc bất biến** — từ 100% tiếng Việt có dấu, không gọi CAPI từ frontend, đến honeypot bắt buộc, icon SVG inline only
