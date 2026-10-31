---
name: ui-ux-design-pro-max
description: "Siêu Hub UI/UX 192 ngành: 79 UI styles, 84 hệ DESIGN.md thương hiệu lớn & chuyển thiết kế sang code 22 frameworks."
group: "Thiết Kế Web, UI/UX & Thương Hiệu"
---

# 🎨 UI/UX DESIGN PRO MAX & DESIGN-TO-CODE MASTER HUB (`ui-ux-design-pro-max`)

<!-- JAVIS_TRIGGER_ARCHIVE_START -->
## Khi nào dùng (Triggers & Ngữ cảnh kích hoạt đầy đủ)

> Siêu Hub Thiết Kế Giao Diện Phần Mềm, Web App, Mobile App & Chuyển Đổi Thiết Kế Thành Code (`Design-to-Code`) chuyên nghiệp theo mọi ngành nghề. Hợp nhất 6 bộ công cụ mã nguồn mở hàng đầu: (1) Động cơ Python BM25 `ui-ux-pro-max` với 192 quy tắc suy luận ngành nghề (ERP, SaaS, Fintech, Ngân hàng, Y tế, Phòng khám, TMĐT, BĐS, F&B, Spa, Pháp lý, Giáo dục, Logistics...), 79 phong cách UI, 192 bảng màu, 74 cặp Google Fonts, 34 bố cục trang đích, 25 biểu đồ Dashboard, 119 luật UX & 22 Tech Stacks (`HTML+Tailwind`, `React`, `Next.js`, `shadcn/ui`, `Vue`, `Nuxt`, `Angular`, `Laravel`, `Svelte`, `Astro`, `Three.js`, `Flutter`, `React Native`, `SwiftUI`, `Jetpack Compose`, `WPF`, `WinUI 3`, `JavaFX`, `Avalonia`); (2) Hệ thống `design-system-tokens` 3 tầng; (3) Thư viện `ui-styling` (`shadcn/ui` + Radix + Tailwind); (4) Kho **84 hồ sơ `DESIGN.md` thương hiệu quốc tế** (`Apple`, `Stripe`, `Linear`, `Vercel`, `Figma`, `Airbnb`, `Shopify`, `Notion`, `Cursor`, `Supabase`, `WIRED`, `The Verge`, `Ferrari`, `SpaceX`, `Revolut`...); (5) `frontend-design` & `web-artifacts-builder` chính thức của Anthropic; (6) Bộ lọc thẩm mỹ `no-ai-design-slop` chống giao diện AI rập khuôn.
> TRIGGERS: "ui ux", "ui/ux", "thiết kế giao diện", "thiet ke giao dien", "giao diện phần mềm", "giao dien phan mem", "giao diện web", "giao dien web", "chuyển thiết kế thành code", "design to code", "design system", "DESIGN.md", "ui-ux-pro-max", "shadcn", "tailwind ui", "dashboard ui", "erp ui", "saas ui", "fintech ui", "mobile app ui", "flutter ui", "wpf ui", "winui", "retheme app", "đổi giao diện phần mềm", "chống ai slop".
<!-- JAVIS_TRIGGER_ARCHIVE_END -->

---

## 📌 1. BẢN ĐỒ ĐIỀU PHỐI 6 MODULE THÀNH PHẦN & CÔNG CỤ CLI (`skills/` & `scripts/`)

| STT | Module Thành Phần | Tệp Điều Phối Chính | Công Cụ CLI / Cơ Sở Dữ Liệu Thực Thi | Đầu Ra Chuẩn |
| :-: | :--- | :--- | :--- | :--- |
| **0** | **Quy Trình Design-to-Code 22 Stacks** | [`references/01-quy-trinh-chuyen-thiet-ke-sang-code-da-nganh.md`](./references/01-quy-trinh-chuyen-thiet-ke-sang-code-da-nganh.md) | Quy trình 5 bước khóa `MASTER.md`, Semantic Tokens, 5 trạng thái UI & kiểm định tương phản `4.5:1` | Giao diện Web / Phần mềm hoàn chỉnh |
| **1** | **`01_ui-ux-pro-max`** *(192 Ngành & 22 Stacks)* | [`skills/01_ui-ux-pro-max/SKILL.md`](./skills/01_ui-ux-pro-max/SKILL.md) | `python skills/01_ui-ux-pro-max/scripts/search.py "<ngành>" --design-system -p "<Tên>"` + 35 bảng CSV offline | Hệ thống thiết kế theo ngành & `MASTER.md` |
| **2** | **`02_design-system-tokens`** *(Kiến trúc Token 3 Tầng)* | [`skills/02_design-system-tokens/SKILL.md`](./skills/02_design-system-tokens/SKILL.md) | `primitive -> semantic -> component tokens`, `generate-tokens.cjs`, `html-token-validator.py` | `design-tokens.json` & CSS Variables |
| **3** | **`03_ui-styling-shadcn`** *(`shadcn/ui` + Tailwind)* | [`skills/03_ui-styling-shadcn/SKILL.md`](./skills/03_ui-styling-shadcn/SKILL.md) | Danh mục Component Radix UI, Dark Mode, Form/Data-Table chuẩn Accessibility | Code Component React / Next.js / Tailwind |
| **4** | **`04_awesome-brand-design-md`** *(84 Hệ `DESIGN.md`)* | [`skills/04_awesome-brand-design-md/README.md`](./skills/04_awesome-brand-design-md/README.md) | `python scripts/search_brand_design.py "<từ khóa>"` hoặc `--brand stripe` (`84` thương hiệu lớn) | Hồ sơ `DESIGN.md` chuẩn tập đoàn quốc tế |
| **5** | **`05_frontend-art-direction`** *(Anthropic Studio)* | [`skills/05_frontend-art-direction/frontend-design/SKILL.md`](./skills/05_frontend-art-direction/frontend-design/SKILL.md) | Chỉ đạo nghệ thuật Typography/Layout độc bản + `web-artifacts-builder` đa component | Giao diện có cá tính thương hiệu riêng |
| **6** | **`06_anti-ai-slop-and-patterns`** *(Kiểm định UI)* | [`skills/06_anti-ai-slop-and-patterns/no-ai-design-slop/SKILL.md`](./skills/06_anti-ai-slop-and-patterns/no-ai-design-slop/SKILL.md) | `audit-ai-design-slop`, `operational-enterprise-ai`, `product-proof-saas`, `pricing-page`, `open-design-critique` | Giao diện sạch 100% lỗi rập khuôn AI |

---

## 📌 2. LỆNH TRA CỨU NHANH KHI BẮT ĐẦU MỌI DỰ ÁN GIAO DIỆN

```powershell
# 1. Sinh trọn bộ Design System theo đúng ngành nghề (192 ngành) và lưu MASTER.md:
python "~/.gemini/config/skills/ui-ux-design-pro-max/skills/01_ui-ux-pro-max/scripts/search.py" "ERP manufacturing inventory" --design-system -f markdown

# 2. Tra cứu quy chuẩn code giao diện theo đúng ngôn ngữ/framework (22 stacks: react, nextjs, html-tailwind, vue, flutter, wpf, winui3, javafx...):
python "~/.gemini/config/skills/ui-ux-design-pro-max/skills/01_ui-ux-pro-max/scripts/search.py" "state form performance" --stack react

# 3. Tra cứu và nạp hệ thống giao diện của 84 thương hiệu hàng đầu thế giới (Apple, Stripe, Linear, Vercel, WIRED, Figma...):
python "~/.gemini/config/skills/ui-ux-design-pro-max/scripts/search_brand_design.py" "fintech"
python "~/.gemini/config/skills/ui-ux-design-pro-max/scripts/search_brand_design.py" --brand linear.app
```

---

## 📌 3. 4 KỶ LUẬT VÀNG KHI CHUYỂN THIẾT KẾ SANG CODE PHẦN MỀM (`NON-NEGOTIABLE`)

1. **Khóa Thiết Kế Theo Ngành Trước Khi Code (`Design-First Gate`):** Luôn chạy `search.py --design-system` (hoặc chọn 1 hồ sơ `DESIGN.md`) để chốt Bảng màu Semantic, Cặp Font, Thang khoảng cách và Anti-Patterns phù hợp ngành nghề trước khi viết dòng code UI đầu tiên.
2. **Cấm Dùng Emoji Làm Icon Chức Năng:** Tuyệt đối dùng **SVG Icons** (`Lucide`, `Phosphor`, `Heroicons`) đồng nhất độ dày nét và gắn `aria-hidden="true"` / `aria-label` chuẩn trợ năng.
3. **Đủ 5 Trạng Thái Phần Mềm & Chuẩn Số Liệu:** Mọi màn hình dữ liệu phải xử lý đủ `Default`, `Hover/Focus-Visible`, `Loading Skeleton`, `Empty State`, `Error State`; cột số liệu/tiền tệ bắt buộc bật `font-variant-numeric: tabular-nums` để thẳng hàng tuyệt đối.
4. **Độ Tương Phản & Đa Khung Hình:** Đảm bảo tỷ lệ tương phản tối thiểu `4.5:1` và bố cục không vỡ từ `375px` đến `1440px+`.
