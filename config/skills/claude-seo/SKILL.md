---
name: claude-seo
description: "Kiểm toán SEO & AI Search (GEO): Technical SEO, Core Web Vitals, E-E-A-T, Schema JSON-LD, AI Overviews & Local SEO."
group: "Marketing, Web & SEO"
---

# Claude SEO: Universal SEO & AI Search (GEO) Analysis Skill (v2.4.2)

<!-- JAVIS_TRIGGER_ARCHIVE_START -->
## Khi nào dùng (Triggers & Ngữ cảnh kích hoạt đầy đủ)

> Chuyên gia Kiểm toán SEO & AI Search (GEO) toàn diện v2.4.2 với 26 sub-skills và 19 specialist agents chạy song song. Hỗ trợ Technical SEO, Core Web Vitals (INP), Content Quality (E-E-A-T QRG 09/2025), Schema.org JSON-LD, AI Overviews / ChatGPT / Perplexity Citability (GEO), Agentic Browsing (/seo agentic), Local SEO, Maps và E-commerce SEO. TRIGGERS: "seo", "kiểm toán seo", "seo audit", "schema", "core web vitals", "sitemap", "e-e-a-t", "geo", "ai overviews", "llms.txt", "technical seo", "backlinks", "local seo".
<!-- JAVIS_TRIGGER_ARCHIVE_END -->

Hệ thống kiểm toán SEO & AI Search (Generative Engine Optimization - GEO) toàn diện cho mọi loại hình website (SaaS, E-commerce, Local Business, Publisher, Agency). Tích hợp **26 sub-skills chuyên biệt**, **19 specialist sub-agents** và **60 Python execution scripts**.

---

## 1. Bảng Lệnh Điều Phối Nhanh (Quick Command Reference)

| Lệnh / Chế độ | Chức năng thực thi | Sub-Skill / Agent tương ứng |
| :--- | :--- | :--- |
| `/seo audit <url>` | Kiểm toán toàn diện website với các sub-agent chạy song song | [`skills/seo-audit/SKILL.md`](./skills/seo-audit/SKILL.md) |
| `/seo page <url>` | Phân tích chuyên sâu 1 trang đơn lẻ (On-page, Meta, Heading, Content, Schema) | [`skills/seo-page/SKILL.md`](./skills/seo-page/SKILL.md) |
| `/seo technical <url>` | Kiểm toán Technical SEO qua 9 hạng mục (Crawlability, Indexability, CWV, INP, Security...) | [`skills/seo-technical/SKILL.md`](./skills/seo-technical/SKILL.md) |
| `/seo content <url>` | Đánh giá chất lượng nội dung chuẩn E-E-A-T (Google QRG 09/2025) & Readability | [`skills/seo-content/SKILL.md`](./skills/seo-content/SKILL.md) |
| `/seo content-brief <topic\|url>` | Lập dàn ý Content Brief chuẩn SEO (Từ khóa mục tiêu, cấu trúc Heading, Internal Links) | [`skills/seo-content-brief/SKILL.md`](./skills/seo-content-brief/SKILL.md) |
| `/seo schema <url>` | Phát hiện, kiểm tra hợp lệ và sinh mã Schema.org JSON-LD chuẩn Rich Results | [`skills/seo-schema/SKILL.md`](./skills/seo-schema/SKILL.md) |
| `/seo sitemap <url\|generate>` | Phân tích hoặc khởi tạo XML Sitemap chuẩn Quality Gates | [`skills/seo-sitemap/SKILL.md`](./skills/seo-sitemap/SKILL.md) |
| `/seo images <url\|optimize>` | Kiểm toán SEO hình ảnh (Alt text, kích thước, WebP/AVIF, IPTC AI metadata) | [`skills/seo-images/SKILL.md`](./skills/seo-images/SKILL.md) |
| `/seo geo <url>` | Tối ưu hóa AI Search (GEO): AI Overviews, ChatGPT Search, Perplexity, `llms.txt` | [`skills/seo-geo/SKILL.md`](./skills/seo-geo/SKILL.md) |
| `/seo agentic <url>` | Kiểm tra độ sẵn sàng cho AI Browser Agent (Lighthouse Agentic Browsing, WebMCP) | [`skills/seo-agentic/SKILL.md`](./skills/seo-agentic/SKILL.md) |
| `/seo local <url>` | Phân tích Local SEO (Google Business Profile, NAP Citations, Reviews, Map Pack) | [`skills/seo-local/SKILL.md`](./skills/seo-local/SKILL.md) |
| `/seo maps [cmd] [args]` | Maps Intelligence (Geo-grid, GBP audit, đối thủ bán kính) | [`skills/seo-maps/SKILL.md`](./skills/seo-maps/SKILL.md) |
| `/seo ecommerce <url>` | E-commerce SEO: Product Schema, phân tích danh mục & sàn TMĐT | [`skills/seo-ecommerce/SKILL.md`](./skills/seo-ecommerce/SKILL.md) |
| `/seo cluster <seed-keyword>` | Gom cụm chủ đề ngữ nghĩa (Semantic Topic Clustering) & Kiến trúc Pillar/Cluster | [`skills/seo-cluster/SKILL.md`](./skills/seo-cluster/SKILL.md) |
| `/seo sxo <url>` | Tối ưu hóa trải nghiệm tìm kiếm (Search Experience Optimization, User Stories, Personas) | [`skills/seo-sxo/SKILL.md`](./skills/seo-sxo/SKILL.md) |
| `/seo backlinks <url>` | Phân tích hồ sơ Backlink (Moz, Bing Webmaster, Common Crawl, Verify crawler) | [`skills/seo-backlinks/SKILL.md`](./skills/seo-backlinks/SKILL.md) |
| `/seo google [cmd] [url]` | Tích hợp Google SEO APIs (Search Console, PageSpeed Insights v5, CrUX, GA4) | [`skills/seo-google/SKILL.md`](./skills/seo-google/SKILL.md) |
| `/seo drift [baseline\|compare] <url>` | Giám sát biến động SEO theo thời gian (17 quy tắc đối chiếu, 3 cấp độ cảnh báo) | [`skills/seo-drift/SKILL.md`](./skills/seo-drift/SKILL.md) |
| `/seo setup` / `/seo doctor` | Cài đặt môi trường biệt lập (`.venv` + Playwright Chromium) và chẩn đoán hệ thống | [`skills/seo/SKILL.md`](./skills/seo/SKILL.md) |

---

## 2. Quy Trình Điều Phối & Thực Thi Công Cụ Python Nội Bộ

1. **Tài liệu điều phối gốc (Master Orchestrator):**
   - Khi thực hiện bất kỳ tác vụ SEO chuyên sâu nào, đọc thêm tệp điều phối trung tâm tại [`skills/seo/SKILL.md`](./skills/seo/SKILL.md) và hướng dẫn đa nền tảng [`AGENTS.md`](./AGENTS.md).
2. **Cách gọi các script Python đi kèm (`scripts/`):**
   - Sử dụng môi trường Python ảo đã cài sẵn tại `.venv` của skill hoặc trình khởi chạy chuẩn:
     ```powershell
     # Chạy kiểm tra trạng thái môi trường:
     & "%USERPROFILE%\.gemini\config\skills\claude-seo\.venv\Scripts\python.exe" "%USERPROFILE%\.gemini\config\skills\claude-seo\scripts\fetch_page.py" --help
     ```
3. **Phương pháp luận Tổng hợp 4 bước (Synthesis Methodology):**
   - `PERCEIVE` (Thu thập dữ liệu thực tế từ trang web/DOM/HTTP headers) $\rightarrow$ `ANALYZE` (Đối chiếu tiêu chuẩn kỹ thuật & E-E-A-T) $\rightarrow$ `VALIDATE` (Kiểm chứng chéo, chống dương tính giả) $\rightarrow$ `ACT` (Xếp hạng ưu tiên Critical / High / Medium / Low kèm giải pháp sửa lỗi cụ thể).

---

## 3. Tài Liệu Tham Chiếu Nhanh Trong Thư Mục Skill

- **Tệp điều phối chính:** [`skills/seo/SKILL.md`](./skills/seo/SKILL.md)
- **Tài liệu tham chiếu ngưỡng chuẩn Core Web Vitals & Quy tắc chất lượng:** [`skills/seo/references/`](./skills/seo/references/)
- **Danh sách 19 Specialist Sub-Agents:** [`agents/`](./agents/)
- **Bộ 60 công cụ Python kiểm thử SEO thực tế:** [`scripts/`](./scripts/)
