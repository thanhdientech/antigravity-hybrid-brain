---
name: marketingskills
description: "Siêu Hub 53 skill Marketing & Growth + 67 CLI API: Meta/TikTok/B2B Ads, Ad Creative, Offer, Pricing, Email, Churn & đối thủ."
group: "Quảng Cáo & Marketing"
---

# 🚀 MARKETING & GROWTH MASTER HUB (`marketingskills`)

<!-- JAVIS_TRIGGER_ARCHIVE_START -->
## Khi nào dùng (Triggers & Ngữ cảnh kích hoạt đầy đủ)

> Siêu Hub tổng hợp trọn bộ **53 Bộ Skill Marketing, Tăng Trưởng (Growth), Quảng Cáo Đa Kênh, CRO, Copywriting, Lifecycle Email, Outbound B2B, Định Giá & Giữ Chân Khách Hàng** kèm **287 Playbook chuyên sâu** và **67 Node.js CLI đọc dữ liệu API thực tế** từ Corey Haines (`coreyhaines31/marketingskills`).
> TRIGGERS: "marketingskills", "marketing skills", "meta andromeda", "chạy quảng cáo meta", "chay quang cao meta", "tiktok ads", "linkedin ads", "b2b ads", "ad creative", "kịch bản video ads", "imessage ads", "hook quảng cáo", "thiết kế offer", "thiet ke offer", "value equation", "bonus stacking", "định giá sản phẩm", "dinh gia san pham", "pricing strategy", "pricing tier", "mổ xẻ đối thủ", "mo xe doi thu", "reverse engineer marketing", "funnel hack", "competitor profiling", "so sánh đối thủ", "chống hủy gói", "chong huy goi", "churn prevention", "cancel flow", "dunning", "chuỗi email", "chuoi email", "email sequence", "cold email", "b2b outbound", "prospecting", "revops", "lead scoring", "sales enablement", "xử lý từ chối", "onboarding activation", "paywall", "popup cro", "signup flow", "referral program", "affiliate program", "free tool marketing", "lead magnet", "aso app store", "google play aso", "programmatic seo", "ai citations", "attribution model", "ab testing", "sample size", "marketing plan", "aarrr", "marketing council", "marketing loops", "influencer ugc", "sms whatsapp marketing", "meta-ads.js", "tiktok-ads.js", "ahrefs.js", "semrush.js", "dataforseo.js".
<!-- JAVIS_TRIGGER_ARCHIVE_END -->

- **Nguồn gốc / Kho Git Upstream:** [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) (`MIT License` — 60,600+ ⭐)
- **Tệp bối cảnh gốc dùng chung cho mọi dự án:** `.agents/product-marketing.md` (khởi tạo bởi [`skills/product-marketing/SKILL.md`](./skills/product-marketing/SKILL.md))
- **Bản đồ tra cứu nhanh Tiếng Việt (53 Skills & 67 CLIs):**
  - [`references/00-ban-do-53-skills-tieng-viet.md`](./references/00-ban-do-53-skills-tieng-viet.md) — Mục lục song ngữ Việt–Anh trỏ thẳng tới 53 Skills & 287 Playbooks.
  - [`references/01-danh-muc-67-cli-va-111-ket-noi-api.md`](./references/01-danh-muc-67-cli-va-111-ket-noi-api.md) — Danh mục 67 CLI kéo số liệu thật (Meta/Google/TikTok Ads, GA4, GSC, Ahrefs, Semrush...) & quy trình cấp quyền an toàn.
- **Cập nhật 1 chạm từ GitHub gốc:** [`scripts/update_from_upstream.ps1`](./scripts/update_from_upstream.ps1)

---

## 📌 1. BẢNG ĐIỀU PHỐI 9 CỤM CHUYÊN MÔN (53 SKILLS & 67 CLIS)

| STT | Cụm Nghiệp Vụ | Các Bộ Skill Thành Phần (`./skills/<slug>/SKILL.md`) | Playbook / Công Cụ Trọng Tâm |
| :---: | :--- | :--- | :--- |
| **0** | **Hồ Sơ Gốc Dự Án (`Foundation`)** | [`product-marketing`](./skills/product-marketing/SKILL.md), [`customer-research`](./skills/customer-research/SKILL.md) | Thiết lập `.agents/product-marketing.md` (ICP, Positioning, Brand Voice, JTBD) đọc đầu tiên trước mọi tác vụ |
| **1** | **Paid Ads & Ad Creative (`Paid Media`)** | [`ads`](./skills/ads/SKILL.md), [`ad-creative`](./skills/ad-creative/SKILL.md), [`conversion-tracking`](./skills/conversion-tracking/SKILL.md) | [`meta-andromeda-playbook.md`](./skills/ads/references/meta-andromeda-playbook.md), [`meta-decision-system.md`](./skills/ads/references/meta-decision-system.md), [`hook-system.md`](./skills/ad-creative/references/hook-system.md), [`server-side.md`](./skills/conversion-tracking/references/server-side.md) |
| **2** | **Đo Lường, Phân Bổ & A/B Test (`Analytics`)** | [`analytics`](./skills/analytics/SKILL.md), [`attribution`](./skills/attribution/SKILL.md), [`ab-testing`](./skills/ab-testing/SKILL.md) | GA4/GTM Event Library, mô hình phân bổ doanh thu đa chạm, tính cỡ mẫu thống kê A/B Test |
| **3** | **Tối Ưu Chuyển Đổi Phễu (`CRO & Product Growth`)** | [`cro`](./skills/cro/SKILL.md), [`signup`](./skills/signup/SKILL.md), [`onboarding`](./skills/onboarding/SKILL.md), [`paywalls`](./skills/paywalls/SKILL.md), [`popups`](./skills/popups/SKILL.md) | Page + Form CRO, rút gọn luồng đăng ký, kích hoạt phiên đầu tiên (`Aha moment`), màn hình nâng cấp gói |
| **4** | **Offer, Định Giá & Giữ Chân (`Monetization & Retention`)** | [`offers`](./skills/offers/SKILL.md), [`pricing`](./skills/pricing/SKILL.md), [`churn-prevention`](./skills/churn-prevention/SKILL.md) | [`value-equation.md`](./skills/offers/references/value-equation.md), [`bonus-stacking.md`](./skills/offers/references/bonus-stacking.md), cấu trúc bậc giá, [`cancel-flow-patterns.md`](./skills/churn-prevention/references/cancel-flow-patterns.md) & Dunning |
| **5** | **Mổ Xẻ Đối Thủ & Chiến Lược GTM (`Strategy`)** | [`reverse-engineer-marketing`](./skills/reverse-engineer-marketing/SKILL.md), [`competitor-profiling`](./skills/competitor-profiling/SKILL.md), [`competitors`](./skills/competitors/SKILL.md), [`marketing-plan`](./skills/marketing-plan/SKILL.md), [`marketing-council`](./skills/marketing-council/SKILL.md), [`marketing-loops`](./skills/marketing-loops/SKILL.md), [`marketing-psychology`](./skills/marketing-psychology/SKILL.md), [`marketing-ideas`](./skills/marketing-ideas/SKILL.md), [`launch`](./skills/launch/SKILL.md) | [`funnel-hack.md`](./skills/reverse-engineer-marketing/references/funnel-hack.md), [`aarrr-framework.md`](./skills/marketing-plan/references/aarrr-framework.md), 140 ý tưởng SaaS, vòng lặp tự động chạy định kỳ cho Agent |
| **6** | **SEO, AI Citations & App Store (`Discovery`)** | [`seo-audit`](./skills/seo-audit/SKILL.md), [`ai-seo`](./skills/ai-seo/SKILL.md), [`programmatic-seo`](./skills/programmatic-seo/SKILL.md), [`site-architecture`](./skills/site-architecture/SKILL.md), [`schema`](./skills/schema/SKILL.md), [`link-building`](./skills/link-building/SKILL.md), [`aso`](./skills/aso/SKILL.md), [`directory-submissions`](./skills/directory-submissions/SKILL.md) | Tối ưu trích dẫn ChatGPT/Perplexity/AI Overviews, SEO hàng loạt từ dữ liệu, ASO App Store & Google Play |
| **7** | **Copywriting, Email, MXH & Media (`Content & Lifecycle`)** | [`copywriting`](./skills/copywriting/SKILL.md), [`copy-editing`](./skills/copy-editing/SKILL.md), [`content-strategy`](./skills/content-strategy/SKILL.md), [`emails`](./skills/emails/SKILL.md), [`sms`](./skills/sms/SKILL.md), [`social`](./skills/social/SKILL.md), [`video`](./skills/video/SKILL.md), [`image`](./skills/image/SKILL.md) | Khử giọng văn máy móc (`ai-tells.md`), chuỗi Email tự động, SMS/WhatsApp, thuật toán X/LinkedIn/TikTok |
| **8** | **B2B Outbound, Sales, Viral & PR (`GTM & Partnerships`)** | [`cold-email`](./skills/cold-email/SKILL.md), [`prospecting`](./skills/prospecting/SKILL.md), [`revops`](./skills/revops/SKILL.md), [`sales-enablement`](./skills/sales-enablement/SKILL.md), [`referrals`](./skills/referrals/SKILL.md), [`free-tools`](./skills/free-tools/SKILL.md), [`lead-magnets`](./skills/lead-magnets/SKILL.md), [`influencer-marketing`](./skills/influencer-marketing/SKILL.md), [`co-marketing`](./skills/co-marketing/SKILL.md), [`community-marketing`](./skills/community-marketing/SKILL.md), [`events`](./skills/events/SKILL.md), [`public-relations`](./skills/public-relations/SKILL.md) | Săn tín hiệu mua hàng B2B, kịch bản Demo & xử lý từ chối, chương trình Affiliate/Referral, công cụ miễn phí kéo traffic |
| **9** | **Kho 67 Node.js CLIs & 111 Kết Nối API (`Data Tools`)** | [`tools/SETUP.md`](./tools/SETUP.md), [`tools/REGISTRY.md`](./tools/REGISTRY.md), [`tools/clis/README.md`](./tools/clis/README.md) | Chạy trực tiếp `node tools/clis/<provider>.js` (Node 18+, zero-dependency) lấy số liệu thật |

---

## 📌 2. MA TRẬN PHÂN VAI PHỐI HỢP VỚI KHO SKILL HIỆN HỮU TRÊN MÁY

1. **Dùng `marketingskills` làm Chủ Công khi:**
   - Lên cấu trúc **Meta Ads (thuật toán Andromeda), TikTok Ads, LinkedIn B2B Ads**, viết biến thể **Ad Creative / Video Hook** và kiểm tra **Server-side Conversion Tracking**.
   - **Mổ xẻ phễu tăng trưởng của đối thủ (`reverse-engineer-marketing`)**, thiết kế **Offer (`value-equation`)**, định giá gói cước (`pricing`), chống hủy gói (`churn-prevention`), xây chuỗi **Email / Cold Email / Outbound B2B / RevOps / Referral / ASO**.
   - Cần kéo số liệu thực tế từ tài khoản quảng cáo, GA4, Search Console, Ahrefs, Semrush, Klaviyo, Stripe... qua **67 CLI trong `tools/clis/`**.
2. **Nhường quyền hoặc phối hợp chặt với các Skill chuyên sâu Tiếng Việt sẵn có khi:**
   - Chạy **Google Ads chuyên sâu** (GAQL, kiểm toán rò rỉ tiền A1–A14, gom từ khóa Excel 6 sheets, xuất Google Ads Editor CSV) $\rightarrow$ Ưu tiên [`../google-ads-master/SKILL.md`](../google-ads-master/SKILL.md).
   - Kiểm toán **Technical SEO / Core Web Vitals** hoặc dựng web **WordPress Flatsome / Landing Page Liquid Glass VietQR** $\rightarrow$ Phối hợp [`../claude-seo/SKILL.md`](../claude-seo/SKILL.md), [`../ui-ux-cro-auditor/SKILL.md`](../ui-ux-cro-auditor/SKILL.md), [`../design-landingpage-vip-v2/SKILL.md`](../design-landingpage-vip-v2/SKILL.md).
   - Viết caption bán hàng thị trường Việt Nam & vẽ chân dung 9 phần $\rightarrow$ Kết hợp [`../../plugins/content-writing-by-noti-plugin/skills/cong-thuc-viet-content-by-noti-v4/SKILL.md`](../../plugins/content-writing-by-noti-plugin/skills/cong-thuc-viet-content-by-noti-v4/SKILL.md) và [`../chan-dung-khach-hang-9-phan/SKILL.md`](../chan-dung-khach-hang-9-phan/SKILL.md).

---

## 📌 3. 5 NGUYÊN TẮC KỶ LUẬT BẮT BUỘC (`NON-NEGOTIABLE GATES`)

1. **Kiểm tra `.agents/product-marketing.md` đầu tiên:** Nếu dự án chưa có hồ sơ định vị gốc và thiếu thông tin sản phẩm/khách hàng mục tiêu, dừng lại phỏng vấn nhanh theo [`skills/product-marketing/SKILL.md`](./skills/product-marketing/SKILL.md) thay vì tự đoán mò USP.
2. **Chống Ảo Giác Số Liệu Tuyệt Đối (`Zero Hallucination`):** Cấm tự bịa CPC, CPM, ROAS, Search Volume, tỷ lệ mở Email hay giá gói của đối thủ. Phải đọc từ file báo cáo người dùng cung cấp, kéo qua `tools/clis/*.js`, hoặc tra cứu thực chứng kèm trích dẫn nguồn rõ ràng.
3. **Bảo Mật Khóa API (`Scoped Read-Only First`):** Theo đúng [`tools/SETUP.md`](./tools/SETUP.md), tuyệt đối không yêu cầu người dùng dán trực tiếp API Key/Access Token vào khung chat; hướng dẫn lưu vào file `.env` cục bộ (nằm trong `.gitignore`) và luôn chạy quyền Read-Only trước.
4. **Nạp Lười Đúng Đoạn (`Lazy Section Loading`):** Không đọc tràn lan cả 53 skill cùng lúc; dùng `agy_search_skills` và `agy_read_skill_section` để chỉ nạp đúng file playbook hoặc đoạn dòng `L_start..L_end` cần giải quyết.
5. **Tách Biệt Dữ Liệu Khách Hàng:** Mọi tài liệu chiến dịch, báo cáo đối thủ, file `.env` lưu trong thư mục dự án của khách hàng; giữ sạch thư mục gốc `marketingskills` để cập nhật tự động qua [`scripts/update_from_upstream.ps1`](./scripts/update_from_upstream.ps1).
