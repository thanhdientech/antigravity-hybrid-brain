---
name: toi-uu-chuyen-doi-web
description: Phân tích trang đích để tối ưu hóa chuyển đổi Google Ads — xuất kết quả thành HTML dashboard chuyên nghiệp. LUÔN dùng skill này khi người dùng muốn: xem xét trang đích, kiểm tra CRO, phân tích chuyển đổi, cải thiện landing page Google Ads, đánh giá tỷ lệ chuyển đổi, audit trang bán hàng, review landing page, kiểm tra message match, phân tích UX/UI, đánh giá page speed, SEO on-page, so sánh đối thủ, hoặc bất kỳ yêu cầu nào liên quan đến tối ưu trang đích cho quảng cáo. Output PHẢI là file .html dashboard đầy đủ — không trả lời dạng text/markdown. Hoạt động với URL hoặc ảnh chụp màn hình.
---

# Kiểm tra & Tối ưu Trang Đích — CRO Audit Dashboard

Phân tích toàn diện trang đích Google Ads và xuất kết quả thành **file HTML dashboard** chuyên nghiệp.

---

## Bước 1 — Thu thập bối cảnh

Trước khi phân tích, cần đủ thông tin sau. Nếu thiếu, hỏi người dùng trước.

### Thông tin cần thiết

**1. Trang đích** — Chọn MỘT trong:
- URL (Claude sẽ fetch và phân tích)
- Ảnh chụp màn hình (desktop và/hoặc mobile)
- Nội dung trang được dán trực tiếp

**2. Nguồn lưu lượng truy cập** — Chọn MỘT trong:
- Từ khóa mục tiêu
- Tiêu đề quảng cáo
- Mô tả mục đích của khách truy cập

**3. Đối thủ cạnh tranh** *(Tùy chọn — để so sánh)*
- URL đối thủ 1–3 (Claude sẽ fetch và phân tích)
- Hoặc mô tả đối thủ chính trong ngành

**4. Khách hàng mục tiêu** *(Đề xuất — không bắt buộc)*
- Điểm khó khăn chính
- Kết quả họ muốn đạt được
- Giai đoạn quyết định (nghiên cứu / sẵn sàng mua)

### Xử lý trường hợp thiếu thông tin

| Trường hợp | Cách xử lý |
|---|---|
| Không có nguồn traffic | Phân tích best practices chung, ghi "Message Match không thể chấm điểm" |
| Trang không tải được | Yêu cầu screenshot hoặc dán nội dung |
| Trang chủ thay vì landing page | Đánh dấu không tối ưu, đề xuất dedicated landing page |
| Không có URL đối thủ | Bỏ qua phần so sánh đối thủ, ghi chú trong dashboard |

---

## Bước 2 — Bài kiểm tra 3 giây

**Tiêu chí quan trọng nhất:** Khách truy cập hiểu được gì trong 3 giây đầu?

Khách cần biết ngay 4 điều:
1. **CÁI GÌ** — Đây là cái gì? Bạn cung cấp gì?
2. **CHO AI** — Cái này có dành cho tôi không?
3. **TẠI SAO** — Lợi ích là gì? Tại sao tôi nên quan tâm?
4. **LÀM GÌ** — Tôi cần làm gì tiếp theo? CTA ở đâu?

**Thang điểm:**
- **ĐẠT (4/4):** Cả 4 câu hỏi được trả lời rõ ràng above the fold
- **CHƯA HOÀN CHỈNH (2–3/4):** Một số yếu tố bị thiếu
- **THẤT BẠI (0–1/4):** Khách truy cập bối rối

---

## Bước 3 — Phân tích Above the Fold

Tất cả nội dung hiển thị trước khi cuộn: ~600px đầu desktop, ~500px mobile.

### Đánh giá tiêu đề

| Xếp hạng | Tiêu chí | Ví dụ |
|---|---|---|
| **Rõ ràng + Cụ thể** | Nêu vấn đề + ai giải quyết + lợi ích cụ thể | "Sửa ống nước khẩn cấp 24/7 — Có mặt trong 2 giờ" |
| **Chung chung** | Chỉ mang tính danh mục | "Dịch vụ sửa ống nước chuyên nghiệp" |
| **Không rõ ràng** | Chỉ là lời chào hoặc tên thương hiệu | "Chào mừng đến với ABC Plumbing" |

### Đánh giá CTA

| Xếp hạng | Tiêu chí |
|---|---|
| **Chính** | Nổi bật, tương phản cao, động từ rõ ràng, vị trí dễ thấy |
| **Thứ yếu** | Có mặt nhưng cạnh tranh với yếu tố khác |
| **Bị che khuất** | Dưới fold, tương phản thấp, hành động không rõ |

---

## Bước 4 — Chấm điểm Message Match

Trang web thực hiện lời hứa quảng cáo tốt đến mức nào?

| Điểm | Đánh giá | Tiêu chí |
|---|---|---|
| **5** | Phù hợp hoàn hảo | Tiêu đề phản ánh chính xác từ khóa/quảng cáo |
| **4** | Phù hợp mạnh | Kết nối rõ ràng, khác biệt nhỏ về thuật ngữ |
| **3** | Vừa đủ | Thông điệp liên quan, cần chút kết nối tư duy |
| **2** | Yếu | Kết nối không rõ, khách nghi ngờ đúng trang không |
| **1** | Không khớp | Quảng cáo và trang dường như không liên quan |

---

## Bước 5 — Kiểm tra Trust Signals

| Loại tín hiệu | Chất lượng cần đạt |
|---|---|
| Số lượng / thống kê khách hàng | Cụ thể, không chung chung |
| Xếp hạng sao | Có nguồn tham khảo rõ ràng |
| Nhận xét khách hàng | Có tên thật và ảnh |
| Logo khách hàng | Dễ nhận biết |
| Chứng nhận / huy hiệu | Có thể xác minh |
| Cam kết / bảo hành | Điều khoản cụ thể |
| Chỉ báo bảo mật | Bắt buộc nếu có biểu mẫu |

---

## Bước 6 — Phân tích Conversion Path

### Đánh giá ma sát form

| Số trường | Mức ma sát | Phù hợp với |
|---|---|---|
| 1–3 trường | Thấp | Đầu / giữa phễu bán hàng |
| 4–6 trường | Trung bình | Lead đã đủ điều kiện |
| 7+ trường | Cao | Chỉ khi high-intent / high-value |

### Checklist Mobile

- [ ] CTA hiển thị mà không cần cuộn
- [ ] Số điện thoại click-to-call
- [ ] Form field thân thiện ngón tay cái (touch target ≥44px)
- [ ] Văn bản đọc được không cần zoom (body ≥16px)
- [ ] Không có cuộn ngang
- [ ] Tải trang <3 giây

---

## Bước 7 — Đánh giá UX/UI Chi tiết *(MỚI)*

Phân tích trải nghiệm người dùng và giao diện toàn trang — không chỉ above the fold.

### 7.1 Phân cấp thị giác (Visual Hierarchy)

Đánh giá theo thứ tự mắt người dùng di chuyển:

| Yếu tố | Trạng thái lý tưởng | Dấu hiệu cần cải thiện |
|---|---|---|
| Tiêu đề H1 | Lớn nhất, tương phản cao, đặt top-left hoặc center | Cùng kích thước với H2 |
| Subheadline | Hỗ trợ H1, nhỏ hơn 1 cấp | Không có hoặc quá dài |
| CTA button | Màu tương phản với nền, không bị lẫn | Cùng màu với nền, quá nhỏ |
| Hình ảnh hero | Minh họa value prop, không phải decoration | Stock photo chung chung |
| White space | Đủ thở, không chật chội | Quá nhiều yếu tố trên một màn hình |

### 7.2 Nhất quán thương hiệu (Brand Consistency)

- **Màu sắc:** Palette nhất quán, không quá 3 màu chính
- **Typography:** Tối đa 2 font family, size hợp lý
- **Tone of voice:** Giọng điệu nhất quán từ quảng cáo → landing page
- **Logo & nhận diện:** Rõ ràng, đặt vị trí chuẩn (top-left)

### 7.3 Điểm thoát & Rò rỉ chuyển đổi

Đếm số cách khách có thể rời trang không chuyển đổi:
- Link menu điều hướng → **Tối ưu: Ẩn hoặc giảm tối thiểu trên landing page**
- Link footer → **Tối ưu: Chỉ giữ privacy policy + terms**
- Link ngoài trong nội dung → **Tối ưu: Mở tab mới nếu cần thiết**
- Nút mạng xã hội → **Tối ưu: Bỏ hoàn toàn**

**Thang điểm rò rỉ:**
- 0–1 điểm thoát: Tốt ✅
- 2–4 điểm thoát: Cần cải thiện ⚠️
- 5+ điểm thoát: Nguy hiểm ❌

### 7.4 Điểm UX/UI tổng thể (1–10)

Chấm điểm tổng hợp các yếu tố:
- Visual hierarchy rõ ràng: 2đ
- Brand consistency: 2đ
- Ít điểm thoát: 2đ
- White space & readability: 2đ
- Hình ảnh/video hỗ trợ message: 2đ

---

## Bước 8 — Page Speed & Core Web Vitals *(MỚI)*

Đánh giá hiệu suất kỹ thuật ảnh hưởng đến tỷ lệ chuyển đổi và Quality Score Google Ads.

### 8.1 Các chỉ số Core Web Vitals cần đánh giá

| Chỉ số | Tốt | Cần cải thiện | Kém |
|---|---|---|---|
| **LCP** (Largest Contentful Paint) | <2.5s | 2.5–4s | >4s |
| **FID/INP** (Interaction to Next Paint) | <200ms | 200–500ms | >500ms |
| **CLS** (Cumulative Layout Shift) | <0.1 | 0.1–0.25 | >0.25 |
| **TTFB** (Time to First Byte) | <800ms | 800ms–1.8s | >1.8s |
| **Tổng tải trang mobile** | <3s | 3–5s | >5s |

### 8.2 Tác động đến chuyển đổi

- Mỗi 1 giây trễ tải trang mobile → giảm 20% tỷ lệ chuyển đổi
- LCP >4s → tăng bounce rate ~90%
- CLS cao → người dùng bấm nhầm CTA → tăng frustration

### 8.3 Nguyên nhân thường gặp & giải pháp

| Vấn đề | Nguyên nhân | Giải pháp |
|---|---|---|
| LCP chậm | Ảnh hero quá nặng, không lazy load | Compress ảnh, dùng WebP, preload hero image |
| CLS cao | Font chưa load, ảnh không có dimensions | Khai báo width/height cho ảnh, font-display: swap |
| TTFB chậm | Server chậm, không có CDN | Upgrade hosting, dùng CDN, enable caching |
| Render blocking | CSS/JS chặn render | Defer JS, inline critical CSS |

### 8.4 Công cụ đo lường (khuyến nghị người dùng tự kiểm tra)

- **PageSpeed Insights:** pagespeed.web.dev
- **GTmetrix:** gtmetrix.com
- **WebPageTest:** webpagetest.org
- **Chrome DevTools:** Lighthouse tab

> ⚠️ **Lưu ý:** Claude chỉ có thể đánh giá Page Speed dựa trên quan sát (kích thước file hiển thị, số lượng request, lazy load có không). Để có số liệu chính xác, người dùng cần chạy công cụ trên.

---

## Bước 9 — SEO On-Page Cơ bản *(MỚI)*

Đánh giá các yếu tố SEO ảnh hưởng đến Quality Score và chi phí CPC Google Ads.

### 9.1 Checklist SEO On-Page

| Yếu tố | Tiêu chuẩn | Trạng thái |
|---|---|---|
| **Title tag** | 50–60 ký tự, chứa từ khóa chính | ✅/❌ |
| **Meta description** | 150–160 ký tự, có CTA, chứa từ khóa | ✅/❌ |
| **H1** | Duy nhất 1 H1, chứa từ khóa chính | ✅/❌ |
| **H2/H3** | Cấu trúc rõ ràng, từ khóa phụ | ✅/❌ |
| **Alt text ảnh** | Mô tả ảnh + từ khóa liên quan | ✅/❌ |
| **URL slug** | Ngắn, có từ khóa, không dấu/ký tự đặc biệt | ✅/❌ |
| **Internal links** | Liên kết đến trang liên quan | ✅/❌ |
| **Schema markup** | FAQ, Product, LocalBusiness (nếu phù hợp) | ✅/❌ |
| **Canonical tag** | Tránh duplicate content | ✅/❌ |
| **HTTPS** | Bắt buộc | ✅/❌ |

### 9.2 Liên hệ SEO — Quality Score Google Ads

Google Ads tính Quality Score dựa trên:
- **Expected CTR** (30%): Quảng cáo có liên quan → CTR cao
- **Ad Relevance** (30%): Từ khóa ↔ quảng cáo ↔ landing page
- **Landing Page Experience** (40%): **SEO on-page tốt = Quality Score cao = CPC thấp hơn**

> Quality Score tăng 1 điểm → CPC giảm ~16%. Đây là lý do SEO on-page quan trọng ngay cả với Paid Ads.

### 9.3 Mức độ ưu tiên SEO cho Landing Page

**Ưu tiên cao (ảnh hưởng trực tiếp Quality Score):**
- Title tag chứa từ khóa quảng cáo
- H1 phản ánh ad copy
- Nội dung trang liên quan đến từ khóa

**Ưu tiên trung bình:**
- Meta description có CTA
- Alt text cho ảnh chính
- URL slug sạch

**Ưu tiên thấp (cho organic, ít ảnh hưởng paid):**
- Schema markup
- Internal links
- Canonical tag

---

## Bước 10 — So sánh Đối thủ Cạnh tranh *(MỚI)*

Phân tích và so sánh trang đích với đối thủ để tìm lợi thế cạnh tranh.

### 10.1 Framework so sánh

Nếu có URL đối thủ, fetch và phân tích theo cùng tiêu chí:

| Tiêu chí | Trang của bạn | Đối thủ 1 | Đối thủ 2 | Người dẫn đầu |
|---|---|---|---|---|
| Bài kiểm tra 3 giây | X/4 | X/4 | X/4 | — |
| Message Match | X/5 | X/5 | X/5 | — |
| UX/UI Score | X/10 | X/10 | X/10 | — |
| Số trust signals | X | X | X | — |
| Số điểm thoát | X | X | X | — |
| SEO on-page | X/10 | X/10 | X/10 | — |

### 10.2 Phân tích gap (khoảng cách)

Cho mỗi tiêu chí đối thủ dẫn đầu, xác định:
- **Đối thủ làm gì tốt hơn?** → Học hỏi
- **Bạn làm gì tốt hơn?** → Nhấn mạnh, khuếch đại
- **Cả hai đều yếu?** → Cơ hội differentiation

### 10.3 Phân tích Value Proposition

So sánh unique value proposition:
- Đối thủ định vị ở góc độ nào?
- Bạn đang trùng lặp hay khác biệt?
- Khoảng trống thị trường nào chưa ai khai thác?

### 10.4 Nếu không có URL đối thủ

Dựa trên ngành nghề, phân tích best practices và benchmarks:
- Landing page ngành này thường có đặc điểm gì?
- Tiêu chuẩn conversion rate trong ngành là bao nhiêu?
- Xu hướng design/copy phổ biến trong ngành?

---

## Bước 11 — Tạo HTML Dashboard Output *(BẮT BUỘC)*

**QUAN TRỌNG:** Sau khi hoàn thành tất cả phân tích, PHẢI xuất kết quả thành file `.html` dashboard — KHÔNG trả lời dạng text hay markdown.

### 11.1 Cấu trúc file HTML output

File HTML phải bao gồm đầy đủ các section:

```
1. Header — Tên trang, URL, ngày audit, tổng điểm
2. Score Overview — 6 thẻ điểm (Message Match, UX/UI, SEO, Speed, Trust, Mobile)
3. 3-Second Test — Pass/Fail với giải thích
4. Message Match — Điểm + breakdown
5. UX/UI Analysis — Điểm + chi tiết
6. Page Speed & Core Web Vitals — Bảng chỉ số + đánh giá
7. SEO On-Page — Checklist với trạng thái
8. Trust Signals — Danh sách có/thiếu
9. Competitor Comparison — Bảng so sánh (nếu có đối thủ)
10. ⚡ 3 Quick Wins — Hành động ưu tiên tuần này
11. 💡 Strategic Insight — Nhận xét chiến lược
12. Mobile Checklist — Trạng thái từng mục
```

### 11.2 Tiêu chuẩn thiết kế HTML dashboard

**Màu sắc & Theme:**
```css
/* Dùng palette chuyên nghiệp, tối — không dùng white/purple gradient */
--bg-primary: #0f1117;
--bg-card: #1a1d27;
--bg-card-hover: #1f2235;
--accent-green: #00d4aa;
--accent-yellow: #ffd166;
--accent-red: #ef4565;
--accent-blue: #4361ee;
--text-primary: #e8eaf0;
--text-secondary: #8892a4;
--border: #2a2d3e;
```

**Typography:** Dùng Google Fonts — Sử dụng font đặc trưng, KHÔNG dùng Inter/Roboto/Arial
- Display: `Clash Display` hoặc `Space Grotesk` hoặc `Syne`
- Body: `DM Sans` hoặc `Plus Jakarta Sans`

**Animations:** Staggered fade-in khi load, hover effects trên card

**Layout:** 
- Header full-width với gradient
- Score cards dạng grid 3-cột (responsive)
- Sections với card-style, border subtle
- Quick Wins nổi bật với accent color

**Responsive:** Mobile-friendly, breakpoint tại 768px

### 11.3 Cách tính tổng điểm

```
Tổng điểm = (Message Match/5 × 25) + (UX/5 × 20) + (SEO/10 × 20) +
            (Speed/10 × 15) + (Trust/5 × 10) + (Mobile/6 × 10)
→ Quy ra thang 100
```

**Phân loại:**
- 80–100: 🟢 Tốt — Tối ưu chi tiết
- 60–79: 🟡 Khá — Cần cải thiện các điểm yếu chính
- 40–59: 🟠 Trung bình — Cần làm lại một số phần
- <40: 🔴 Kém — Cần redesign

### 11.4 Lưu file

Lưu file output vào `/mnt/user-data/outputs/cro-audit-[domain]-[date].html`

Ví dụ: `cro-audit-example.com-2025-01-15.html`

Sau đó dùng `present_files` để chia sẻ file cho người dùng.

---

## Nguyên tắc đánh giá

### Luôn cụ thể, không chung chung

❌ "Cải thiện tiêu đề của bạn"
✅ "Đổi tiêu đề từ 'Chào mừng đến với ABC Plumbing' thành 'Thợ sửa ống nước khẩn cấp 24/7 — Có mặt trong 2 giờ hoặc ít hơn'"

### Thứ tự ưu tiên theo tác động

1. **Vấn đề Message Match** — Tác động lớn nhất
2. **Page Speed mobile** — Ảnh hưởng trực tiếp bounce rate
3. **Khả năng hiển thị CTA** — Ảnh hưởng trực tiếp CVR
4. **UX/UI & Visual Hierarchy** — Dẫn dắt người dùng đến conversion
5. **Trust signals** — Giảm ma sát
6. **SEO on-page** — Cải thiện Quality Score dài hạn

### Giới hạn của phân tích

**Có thể đánh giá:**
- Thứ bậc và sự nổi bật về mặt thị giác
- Sự phù hợp thông điệp và ý định tìm kiếm
- Sự hiện diện của trust signals
- Cấu trúc SEO on-page
- Page speed (ước lượng, không có số liệu thực)
- So sánh với đối thủ (nếu có URL)

**Không thể đánh giá — Khuyến nghị kiểm tra riêng:**
- Tốc độ tải thực tế → dùng PageSpeed Insights
- Ý nghĩa thống kê A/B test
- Độ chính xác conversion tracking
- Chức năng backend
