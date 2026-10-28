---
name: brand-editorial-graphic-studio
description: "Siêu Hub thiết kế Logo SVG, Bộ nhận diện thương hiệu CIP, Ảnh/Banner quảng cáo, Báo giá, Tạp chí & Dàn trang in ấn PDF/DOCX/PPTX/Typst."
group: "Thiết Kế Web, UI/UX & Thương Hiệu"
---

# 🏛️ BRAND IDENTITY, LOGO, BANNER & EDITORIAL PRINT STUDIO (`brand-editorial-graphic-studio`)

<!-- JAVIS_TRIGGER_ARCHIVE_START -->
## Khi nào dùng (Triggers & Ngữ cảnh kích hoạt đầy đủ)

> Siêu Hub Thiết Kế Đồ Họa Thương Hiệu, Ấn Phẩm Quảng Cáo & Chế Bản Dàn Trang Doanh Nghiệp Toàn Diện. Hợp nhất 5 hệ thống chuyên sâu: (1) Thiết kế **Logo Vector SVG hình học** (55+ phong cách, 30 bảng màu tâm lý học, 25 ngành nghề), **Bộ Nhận Diện Thương Hiệu CIP** (50+ hạng mục: Namecard, Letterhead, Phong bì, Folder, Thẻ nhân viên, Đồng phục, Bảng hiệu, Bao bì, Standee...), **Icon SVG** (15 phong cách) & **Ảnh Mạng Xã Hội**; (2) Quản trị **Brand Guidelines Book** & đồng bộ Design Tokens (`sync-brand-to-tokens.cjs`, 10 bộ Theme Factory); (3) Thiết kế **Ảnh Banner Quảng Cáo, Poster, Social Cover, Display Ads & Minh họa** (22 trường phái nghệ thuật + 14 phong cách Illustration + `canvas-design` của Anthropic chuẩn Safe-zone & tỷ lệ chữ `<20%` Meta Ads); (4) **Dàn Trang Tạp Chí Đa Cột, Sách, Brochure, Catalogue** bằng **Paged CSS `@page` A4/A5** & **Typst** (`article-magazine`, `deck-swiss-international`, `typst-typesetting`); (5) Thiết kế & Xuất file **Báo Giá Thương Mại (Quotation), Hồ Sơ Năng Lực (Company Profile), Hồ Sơ Thầu / Đề Xuất (Proposal), Hóa Đơn & Slide Thuyết Trình** ra **PDF A4 vector sắc nét**, **Word (`.docx`)** và **PowerPoint (`.pptx` / HTML Chart.js)**.
> TRIGGERS: "thiết kế logo", "thiet ke logo", "design logo", "logo svg", "bộ nhận diện thương hiệu", "bo nhan dien thuong hieu", "brand identity", "brand guidelines", "brand book", "cip", "namecard", "danh thiếp", "thiết kế báo giá", "thiet ke bao gia", "mẫu báo giá", "quotation", "hồ sơ năng lực", "ho so nang luc", "company profile", "proposal", "tạp chí", "tap chi", "magazine", "dàn trang", "dan trang", "editorial layout", "catalogue", "brochure", "typst", "thiết kế banner", "thiet ke banner", "thiết kế ảnh", "poster quảng cáo", "social cover", "ảnh quảng cáo".
<!-- JAVIS_TRIGGER_ARCHIVE_END -->

---

## 📌 1. BẢN ĐỒ ĐIỀU PHỐI 5 MODULE CHUYÊN NGÀNH & CÔNG CỤ XUẤT BẢN (`skills/`, `scripts/`, `templates/`)

| STT | Module Chuyên Ngành | Tệp Điều Phối Chính | Công Cụ CLI / Kho Dữ Liệu Thực Thi | Ấn Phẩm Đầu Ra |
| :-: | :--- | :--- | :--- | :--- |
| **0** | **Sổ Tay Quy Chuẩn Thiết Kế & Chế Bản** | [`references/01-so-tay-thiet-ke-logo-thuong-hieu-bao-gia-tap-chi.md`](./references/01-so-tay-thiet-ke-logo-thuong-hieu-bao-gia-tap-chi.md) |[`scripts/editorial_pdf_renderer.py`](./scripts/editorial_pdf_renderer.py) + 3 mẫu chuẩn tại [`templates/`](./templates/) | Xuất PDF A4 in ấn & Ảnh PNG sắc nét |
| **1** | **`01_logo-cip-icon-social`** *(Logo, CIP 50 ấn phẩm, Icon, Ảnh MXH)* | [`skills/01_logo-cip-icon-social/SKILL.md`](./skills/01_logo-cip-icon-social/SKILL.md) | `scripts/logo/search.py`, `scripts/cip/search.py`, `render-html.py` + CSV 55 kiểu Logo & 50 ấn phẩm CIP | Logo SVG/PNG, Bộ CIP & Brand Showcase HTML |
| **2** | **`02_brand-guidelines-sync`** *(Brand Book & Theme)* | [`skills/02_brand-guidelines-sync/brand-manager/SKILL.md`](./skills/02_brand-guidelines-sync/brand-manager/SKILL.md) | `sync-brand-to-tokens.cjs`, `svg-company-logos`, `theme-factory` (10 themes), `brand-guidelines-starter.md` | Cẩm nang Brand Book & `design-tokens.css` |
| **3** | **`03_banner-poster-illustration`** *(Banner, Poster & 14 kiểu Minh họa)* | [`skills/03_banner-poster-illustration/banner-design/SKILL.md`](./skills/03_banner-poster-illustration/banner-design/SKILL.md) | 22 phong cách Banner đa kênh, [`canvas-design`](./skills/03_banner-poster-illustration/canvas-design/SKILL.md), `algorithmic-art` & 14 bộ `illustration-*` | Banner Ads/Social PNG & Poster nghệ thuật PDF |
| **4** | **`04_magazine-editorial-typst`** *(Tạp chí đa cột & Typst)* | [`skills/04_magazine-editorial-typst/article-magazine/SKILL.md`](./skills/04_magazine-editorial-typst/article-magazine/SKILL.md) | [`typst-typesetting/scripts/search-api.py`](./skills/04_magazine-editorial-typst/typst-typesetting/scripts/search-api.py), `deck-swiss-international`, `editorial-portfolio-chapters` | Tạp chí, Sách, Catalogue dàn trang A4/Typst |
| **5** | **`05_quotation-proposal-office-docs`** *(Báo giá, Proposal, PDF/DOCX/PPTX)* | [`skills/05_quotation-proposal-office-docs/pdf/SKILL.md`](./skills/05_quotation-proposal-office-docs/pdf/SKILL.md) | `office-templates` (`invoice-generator`, `proposal-writer`, `report-generator`), [`docx`](./skills/05_quotation-proposal-office-docs/docx/SKILL.md), [`pptx`](./skills/05_quotation-proposal-office-docs/pptx/SKILL.md), `html-pitch-slides` | Báo giá A4 PDF, Hồ sơ thầu `.docx`, Slide `.pptx` |

---

## 📌 2. LỆNH TRA CỨU & KẾT XUẤT ẤN PHẨM THỰC TẾ (`EXIT CODE 0`)

```powershell
# 1. Tra cứu phong cách Logo, Tâm lý màu sắc & Quy chuẩn ngành nghề (55 styles / 25 industries):
python "~/.gemini/config/skills/brand-editorial-graphic-studio/skills/01_logo-cip-icon-social/scripts/logo/search.py" "luxury real estate geometric" --design-brief -p "BrandName"

# 2. Tra cứu danh mục 50+ ấn phẩm Bộ Nhận Diện Thương Hiệu (CIP) theo ngành:
python "~/.gemini/config/skills/brand-editorial-graphic-studio/skills/01_logo-cip-icon-social/scripts/cip/search.py" "corporate consulting" --cip-brief -b "BrandName"

# 3. Tra cứu cú pháp dàn trang in ấn Typst (BM25 Offline Index):
python "~/.gemini/config/skills/brand-editorial-graphic-studio/skills/04_magazine-editorial-typst/typst-typesetting/scripts/search-api.py" "page margin columns header"

# 4. Kết xuất file HTML (Báo giá A4 / Tạp chí / Brand Sheet / Banner) ra PDF A4 chuẩn in ấn & Ảnh PNG nét cao bằng Chromium Headless:
python "~/.gemini/config/skills/brand-editorial-graphic-studio/scripts/editorial_pdf_renderer.py" --input "bao_gia.html" --pdf "bao_gia.pdf" --png "bao_gia_preview.png" --format A4
```

---

## 📌 3. 4 NGUYÊN TẮC CHẾ BẢN & ĐỒ HỌA CHUYÊN NGHIỆP (`NON-NEGOTIABLE`)

1. **Logo Bắt Buộc Có Bản Vector SVG Thuần Khiết:** Khi thiết kế Logo, luôn dựng cấu trúc hình học chuẩn trên lưới `viewBox="0 0 512 512"` (tỷ lệ vàng / lưới module, đường path sạch, hiển thị tốt ở cả `16x16px` Favicon lẫn in khổ lớn, có đủ 4 biến thể: Full Color, Monochrome Dark, Reversed White trên nền tối, và Mark-Only).
2. **Báo Giá & Tạp Chí Không Bao Giờ Bị Cắt Đôi Dòng/Bảng Giữa 2 Trang:** Luôn áp dụng quy chuẩn Paged CSS `@page { size: A4; margin: 16mm 18mm; }`, gắn `break-inside: avoid` cho bảng tổng tiền, chữ ký, thẻ thông tin và `thead { display: table-header-group; }` cho bảng báo giá dài nhiều trang; kiểm tra số học `Thành tiền = Số lượng x Đơn giá` và `Tổng cộng = Tạm tính - Chiết khấu + Thuế GTGT` chính xác 100% bằng Python trước khi xuất PDF.
3. **Banner Quảng Cáo Đúng Kích Thước Pixel & Safe-Zone:** Dựng đúng khung `width x height` của nền tảng, đặt nội dung trọng yếu trong vùng an toàn trung tâm `75%`, giới hạn tối đa 2 họ Font hỗ trợ đầy đủ dấu Tiếng Việt (`Be Vietnam Pro`, `Plus Jakarta Sans`, `Inter`, `Playfair Display`, `Cormorant Garamond`) và giữ tỷ lệ chữ `< 20%` diện tích với Banner chạy quảng cáo Meta/TikTok.
4. **Sạch 100% Nội Dung Thành Phẩm:** Tuyệt đối không chèn nhãn kiểm toán nội bộ của AI hay đường dẫn máy cá nhân lên mặt Báo giá, Tạp chí, Brand Book hay Banner giao cho khách hàng.
