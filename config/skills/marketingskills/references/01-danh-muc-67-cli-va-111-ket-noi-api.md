# Danh Mục 67 Node.js CLI Đọc Dữ Liệu API Thực Tế & 111 Hướng Dẫn Kết Nối (`tools/clis/`)

Tài liệu này làm cầu nối chỉ mục Tiếng Việt cho toàn bộ **67 công cụ dòng lệnh Node.js không phụ thuộc thư viện ngoài (`zero-dependency`, Node 18+)** trong thư mục [`../tools/clis/`](../tools/clis/README.md) và **111 tài liệu tích hợp** trong `../tools/integrations/`. Dùng các CLI này để truy xuất số liệu thật phục vụ quy trình **Chống Ảo Giác AI (`Zero Hallucination`)**.

---

## 1. Quy Trình Chạy CLI An Toàn & Bảo Mật Khóa API (`Guided Tool Connection`)

Trước khi gọi bất kỳ công cụ nào bên dưới, tuân thủ nghiêm ngặt quy trình tại [`../tools/SETUP.md`](../tools/SETUP.md) và [`../tools/REGISTRY.md`](../tools/REGISTRY.md):

1. **Không bao giờ yêu cầu dán API Key vào khung Chat:** Hướng dẫn người dùng ghi biến môi trường vào tệp `.env` riêng trong thư mục dự án (đã khai báo trong `.gitignore`).
2. **Kiểm tra phiên bản Node.js (`>= 18`, khuyến nghị `>= 20.6` để dùng cờ `--env-file`):**
   ```powershell
   node --version
   node --env-file=.env "$env:USERPROFILE\.gemini\config\skills\marketingskills\tools\clis\<ten-cli>.js" --help
   ```
3. **Ưu tiên quyền Đọc (`Read-Only`) trước:** Mọi lần kết nối đầu tiên chỉ chạy lệnh liệt kê chiến dịch / báo cáo chỉ số (`list`, `report`, `insights`) để kiểm chứng kết nối đạt `Exit code 0`, tuyệt đối không tự ý sửa ngân sách hay xóa dữ liệu sản xuất khi chưa được duyệt.

---

## 2. Nhóm CLI Quảng Cáo Trả Phí & Phễu Tiếp Thị Liên Kết (`Paid Ads & Affiliate CLIs`)

Dùng để kéo báo cáo chi tiêu, CPC, CPM, CTR, CPA, ROAS thực tế và quản lý link tiếp thị/đối tác:

- **Quảng cáo đa nền tảng:**
  - `meta-ads.js` — Kết nối Meta Marketing API (Facebook/Instagram Ads): lấy hiệu suất Campaign/AdSet/Ad, chỉ số ROAS, tần suất. Hướng dẫn: [`meta-ads.md`](../tools/integrations/meta-ads.md).
  - `tiktok-ads.js` — Kết nối TikTok Business API: báo cáo chiến dịch, nhóm quảng cáo và video creative. Hướng dẫn: [`tiktok-ads.md`](../tools/integrations/tiktok-ads.md).
  - `google-ads.js` — Truy vấn tài khoản Google Ads qua REST API. Hướng dẫn: [`google-ads.md`](../tools/integrations/google-ads.md).
  - `linkedin-ads.js` — Báo cáo chiến dịch quảng cáo B2B trên LinkedIn. Hướng dẫn: [`linkedin-ads.md`](../tools/integrations/linkedin-ads.md).
  - `supermetrics.js` & `coupler.js` — Đồng bộ báo cáo quảng cáo đa kênh hợp nhất (`supermetrics.md`, `coupler.md`).
- **Tiếp thị liên kết, Link rút gọn & Thanh toán:**
  - `dub.js` (`dub-co.md`) — Rút gọn link gắn UTM & theo dõi click chuyển đổi.
  - `rewardful.js`, `tolt.js`, `partnerstack.js`, `mention-me.js` — Quản lý hoa hồng Affiliate, đối tác B2B SaaS và chương trình giới thiệu khách hàng.
  - `paddle.js` — Tra cứu thuê bao SaaS, doanh thu định kỳ MRR và sự kiện hủy gói/thanh toán lỗi (`paddle.md`, kèm hướng dẫn `stripe.md`, `shopify.md`).

---

## 3. Nhóm CLI SEO, Từ Khóa, Đối Thủ & AI Search Visibility (`SEO & Market Intelligence CLIs`)

Dùng để lấy Search Volume, Keyword Difficulty, Backlink, thứ hạng từ khóa thật và độ phủ thương hiệu trên AI Search:

- **Dữ liệu Từ khóa, Backlink & Đối thủ:**
  - `google-search-console.js` — Lấy truy vấn tìm kiếm thực tế, lượt nhấp, hiển thị, CTR và trang đích từ GSC (`google-search-console.md`).
  - `ahrefs.js` — Tra cứu Domain Rating, backlinks, từ khóa tự nhiên và trang top của đối thủ (`ahrefs.md`).
  - `semrush.js` — Phân tích từ khóa SEO/PPC, khoảng trống từ khóa với đối thủ (`semrush.md`).
  - `dataforseo.js` — API dữ liệu SERP, khối lượng tìm kiếm, Google Maps Local SEO giá rẻ theo lượt gọi (`dataforseo.md`).
  - `keywords-everywhere.js` — Tra nhanh Search Volume, CPC và độ cạnh tranh danh sách từ khóa (`keywords-everywhere.md`).
  - `similarweb.js` — Ước tính lưu lượng truy cập website đối thủ, cơ cấu nguồn kênh traffic (`similarweb.md`).
- **Theo dõi Thứ hạng, AI Search (GEO/AEO) & Thu thập Web:**
  - `rankparse.js`, `cloro.js`, `airops.js` — Kiểm tra hiển thị thương hiệu trên AI/SERP và quy trình nội dung SEO (`rankparse.md`, `cloro.md`, `airops.md`, kèm tích hợp [`aisa.md`](../tools/integrations/aisa.md) & [`omnia.md`](../tools/integrations/omnia.md)).
  - `firecrawl.js` & `exa.js` — Cào sạch nội dung trang đích đối thủ sang Markdown và tìm kiếm ngữ nghĩa phục vụ nghiên cứu (`firecrawl.md`, `exa.md`).

---

## 4. Nhóm CLI Đo Lường Web/App, Hành Vi Người Dùng & A/B Testing (`Analytics & CRO CLIs`)

Dùng để kiểm chứng tỷ lệ chuyển đổi theo bước phễu, bản đồ nhiệt và kết quả thí nghiệm:

- **Web & Product Analytics:**
  - `ga4.js` — Truy vấn Google Analytics 4 Data API: phiên truy cập, sự kiện chuyển đổi, nguồn kênh (`ga4.md`).
  - `plausible.js` & `adobe-analytics.js` — Thống kê lưu lượng truy cập web (`plausible.md`, `adobe-analytics.md`, kèm hướng dẫn `posthog.md`).
  - `amplitude.js`, `mixpanel.js`, `pendo.js`, `segment.js` — Phân tích phễu kích hoạt sản phẩm (Onboarding, Retention Cohort, luồng sự kiện CDP).
- **CRO, Khảo sát, Đánh giá & Thử nghiệm:**
  - `hotjar.js` — Khảo sát phản hồi tại trang và dữ liệu hành vi người dùng (`hotjar.md`).
  - `optimizely.js` — Quản lý cờ tính năng và kết quả chạy A/B Testing (`optimizely.md`).
  - `typeform.js` — Kéo câu trả lời khảo sát nghiên cứu khách hàng & form đăng ký (`typeform.md`).
  - `g2.js` & `trustpilot.js` — Thu thập đánh giá thật của khách hàng để phân tích điểm mạnh/yếu sản phẩm (`g2.md`, `trustpilot.md`).

---

## 5. Nhóm CLI Email Marketing, CRM, Outbound B2B & Sự Kiện (`Lifecycle, Outbound & Events CLIs`)

Dùng để đọc chỉ số mở mail, tỷ lệ phản hồi Cold Email, làm giàu danh sách khách hàng B2B và quản lý hội thảo trực tuyến:

- **Email Lifecycle, Bản tin & Thông báo đẩy:**
  - `klaviyo.js`, `activecampaign.js`, `customer-io.js`, `mailchimp.js`, `brevo.js`, `kit.js` (ConvertKit), `beehiiv.js` — Quản lý danh sách người đăng ký, phân khúc, chuỗi tự động hóa và hiệu suất chiến dịch Email/Newsletter.
  - `resend.js`, `postmark.js`, `sendgrid.js` — Email giao dịch và theo dõi tỷ lệ vào hộp thư đến (Deliverability).
  - `onesignal.js` — Thông báo đẩy Web/Mobile Push Notifications (`onesignal.md`).
  - `intercom.js` — Hộp thư hỗ trợ khách hàng, tin nhắn trong ứng dụng và phân tích câu hỏi tiền bán hàng (`intercom.md`).
- **B2B Prospecting, Làm giàu dữ liệu & Cold Outreach:**
  - `apollo.js`, `clay.js`, `clearbit.js`, `hunter.js`, `snov.js`, `zoominfo.js`, `truelist.js`, `github-prospects.js` — Tìm kiếm thông tin liên hệ B2B, làm giàu hồ sơ công ty và xác thực sống/chết địa chỉ email chống bounce.
  - `instantly.js`, `lemlist.js`, `outreach.js`, `close.js`, `crossbeam.js` — Quản lý chiến dịch gửi Cold Email đa hộp thư, CRM bán hàng và đối chiếu tệp khách hàng chung với đối tác (`co-marketing`).
- **Mạng xã hội, Video, Lịch hẹn & Webinar:**
  - `buffer.js` — Lên lịch và đọc thống kê bài đăng mạng xã hội (`buffer.md`).
  - `calendly.js` & `savvycal.js` — Thống kê lịch đặt hẹn tư vấn/Demo bán hàng (`calendly.md`, `savvycal.md`).
  - `livestorm.js` & `demio.js` — Quản lý sự kiện Webinar, danh sách đăng ký và tỷ lệ tham dự thực tế (`livestorm.md`, `demio.md`).
  - `wistia.js` & `zapier.js` — Thống kê tỷ lệ xem hết video bán hàng và kích hoạt luồng tự động hóa (`wistia.md`, `zapier.md`).
