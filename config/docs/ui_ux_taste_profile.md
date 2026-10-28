# UI/UX Taste Profile & Design DNA (`lean-teamwork`)

Kho tri thức thẩm mỹ chuyên biệt cho các tác vụ giao diện Web, Desktop HUD, Dashboard và Landing Page theo quy chuẩn [`lean-teamwork/SKILL.md`](../skills/lean-teamwork/SKILL.md).

## Khối `<UI_UX_DESIGN_DNA>` Tinh Gọn (~150 Tokens)

```xml
<UI_UX_DESIGN_DNA>
- Theme & Surface: Dark theme chuẩn (#0D1117 nền chính, #161B22 card nổi), Acrylic Glassmorphism (backdrop-filter: blur(16px) saturate(160%), viền mảnh 1px rgba(255,255,255,0.08)).
- Geometry & Spacing: Bo góc Squircle 12px–16px cho card/panel, Pill buttons (border-radius: 9999px) cho nút hành động chính, lưới khoảng trắng thoáng 8pt grid.
- Palette: Bảng màu macOS Spectrum 7 màu tinh tế cho trạng thái & huy hiệu (Cyan #38BDF8, Emerald #34D399, Amber #FBBF24, Rose #FB7185, Violet #A78BFA, Blue #60A5FA, Slate #94A3B8).
- Typography & Icons: Font hiện đại dễ đọc (Inter / Plus Jakarta Sans / JetBrains Mono cho số liệu & mã), 100% SVG icons sắc nét (cấm dùng emoji thô thay icon giao diện).
- Anti-Patterns (Cấm): Nền trắng chói thiếu tương phản, viền dày thô >2px, gradient lòe loẹt quá 3 màu, chữ nhỏ <12px khó đọc, hiệu ứng giật lag dưới 60fps.
</UI_UX_DESIGN_DNA>
```
