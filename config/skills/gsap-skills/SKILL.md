---
name: gsap-skills
description: "Lập trình hiệu ứng chuyển động Web & Video 60fps bằng GSAP: Tweens, Timelines, ScrollTrigger, SplitText, MorphSVG & Flip."
group: "Làm Phim & Video AI"
---

# 🚀 GSAP AI Skills — Official GreenSock Animation Platform Suite (`greensock/gsap-skills`)

<!-- JAVIS_TRIGGER_ARCHIVE_START -->
## Khi nào dùng (Triggers & Ngữ cảnh kích hoạt đầy đủ)

> Official AI skills for GSAP (GreenSock Animation Platform) by Jack Doyle / Webflow. Teaches coding agents correct GSAP usage: core tweens (gsap.to/from/fromTo), timelines, ScrollTrigger (pin, scrub, snap), 100% free Club GSAP plugins (SplitText, MorphSVG, Flip, Draggable, ScrollSmoother, ScrambleText), gsap.utils, React (useGSAP hook), Vue/Nuxt/Svelte lifecycle cleanup, and 60fps GPU animation performance. TRIGGERS: "gsap", "greensock", "scrolltrigger", "splittext", "morphsvg", "scrollsmoother", "flip animation", "flip layout", "useGSAP", "hiệu ứng cuộn", "hiệu ứng cuộn trang", "ghim màn hình khi cuộn", "chữ chạy splittext", "biến hình svg", "animation web", "hiệu ứng chuyển động web", "chuyển động 60fps", "tween timeline".
<!-- JAVIS_TRIGGER_ARCHIVE_END -->

- **Nguồn gốc / Kho Git Upstream:** [greensock/GSAP (Web & Video 60fps)](https://github.com/greensock/GSAP) (`Open-Source Git Repo`)

Bộ kỹ năng chính thức từ **GreenSock (GSAP) & Webflow** (`https://github.com/greensock/gsap-skills`) giúp AI Agent lập trình hiệu ứng chuyển động Web, Landing Page VIP và Motion Graphics chuẩn 60fps.

> **LƯU Ý QUAN TRỌNG:** Kể từ khi Webflow mua lại GSAP, **100% thư viện GSAP và toàn bộ các Plugin cao cấp trước đây thuộc Club GSAP (`SplitText`, `MorphSVG`, `ScrollSmoother`, `Flip`, `Draggable`, `ScrambleText`, `DrawSVG`, `Physics2D`...) đều MIỄN PHÍ 100%** cho cả mục đích thương mại. Cài đặt trực tiếp từ gói public `npm install gsap` (không cần `.npmrc` hay token bản quyền).

---

## 📚 1. BẢNG ĐIỀU PHỐI 8 SUB-SKILLS CHUYÊN SÂU (`skills/`)

Khi thực hiện tác vụ hiệu ứng GSAP, hãy đọc file `SKILL.md` tương ứng trong thư mục `skills/` dưới đây:

| STT | Sub-Skill | Đường Dẫn File Chi Tiết | Nội Dung Chuyên Sâu & Khi Nào Cần Đọc |
| :-: | :--- | :--- | :--- |
| **1** | **`gsap-core`** | `skills/gsap-core/SKILL.md` | API cốt lõi: `gsap.to()`, `gsap.from()`, `gsap.fromTo()`, `gsap.set()`, easing, duration, stagger, `autoAlpha`, transform properties (`x`, `y`, `xPercent`, `yPercent`, `scale`, `rotation`), `overwrite`. |
| **2** | **`gsap-timeline`** | `skills/gsap-timeline/SKILL.md` | Chuỗi thời gian `gsap.timeline()`: điều phối thứ tự hiệu ứng, tham số vị trí (`"+=0.2"`, `"-=0.1"`, `"<"`), nhãn (`labels`), lồng timeline, điều khiển phát lại (`play`, `pause`, `reverse`, `seek`). |
| **3** | **`gsap-scrolltrigger`** | `skills/gsap-scrolltrigger/SKILL.md` | Hiệu ứng theo cuộn trang `ScrollTrigger`: `trigger`, `start`, `end`, `scrub`, ghim phần tử (`pin`), `snap`, `toggleActions`, `batch`, `ScrollTrigger.refresh()` và dọn dẹp bộ nhớ. |
| **4** | **`gsap-plugins`** | `skills/gsap-plugins/SKILL.md` | Toàn bộ Plugin GSAP (miễn phí 100%): `SplitText` (tách chữ/từ/dòng), `Flip` (chuyển đổi layout mượt), `ScrollSmoother`, `ScrollToPlugin`, `Draggable`, `InertiaPlugin`, `Observer`, `MorphSVGPlugin`, `DrawSVGPlugin`, `MotionPathPlugin`, `ScrambleTextPlugin`, `TextPlugin`, `CustomEase`. |
| **5** | **`gsap-utils`** | `skills/gsap-utils/SKILL.md` | Các hàm tiện ích `gsap.utils`: `clamp()`, `mapRange()`, `interpolate()`, `normalize()`, `pipe()`, `random()`, `selector()`, `shuffle()`, `snap()`, `splitColor()`, `toArray()`, `unitize()`, `wrap()`. |
| **6** | **`gsap-react`** | `skills/gsap-react/SKILL.md` | Tích hợp GSAP trong **React / Next.js**: hook `@gsap/react` (`useGSAP`), quản lý `scope` bằng `ref`, `contextSafe` cho event handlers, tự động revert/cleanup tránh rò rỉ bộ nhớ, tương thích SSR. |
| **7** | **`gsap-frameworks`** | `skills/gsap-frameworks/SKILL.md` | Tích hợp GSAP trong **Vue 3, Nuxt, Svelte, Angular & Vanilla JS**: sử dụng `gsap.context()`, scoping selectors và gọi `ctx.revert()` khi component unmount. |
| **8** | **`gsap-performance`** | `skills/gsap-performance/SKILL.md` | Tối ưu hóa hiệu năng 60fps: ưu tiên thuộc tính GPU (`transform`, `opacity`/`autoAlpha`) thay vì thuộc tính gây reflow (`top`, `left`, `width`, `height`), dùng `gsap.quickTo()` / `gsap.quickSetter()` cho sự kiện chuột/cuộn liên tục. |

- **Chỉ mục tóm tắt nhanh cho LLM:** Xem tại `skills/llms.txt`.

---

## 💻 2. MẪU CODE CHUẨN MỰC (CANONICAL GSAP PATTERNS)

```javascript
// 1. Import và đăng ký plugin (chỉ cần gọi 1 lần ở đầu ứng dụng)
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(ScrollTrigger, SplitText);

// 2. Tween đơn lẻ — Luôn ưu tiên transform (x, y, scale) và autoAlpha
gsap.to(".box", { x: 100, autoAlpha: 1, duration: 0.6, ease: "power2.out" });

// 3. Timeline để phối hợp chuỗi chuyển động (ưu tiên dùng thay vì cộng dồn delay)
const tl = gsap.timeline({ defaults: { duration: 0.5, ease: "power2.out" } });
tl.from(".hero-title", { y: 40, autoAlpha: 0 })
  .from(".hero-subtitle", { y: 20, autoAlpha: 0 }, "-=0.3")
  .from(".cta-button", { scale: 0.9, autoAlpha: 0 }, "<0.1");

// 4. ScrollTrigger — Gắn vào timeline hoặc tween; gọi ScrollTrigger.refresh() sau khi layout đổi
const scrollTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".feature-section",
    start: "top center",
    end: "bottom center",
    scrub: true
  }
});
scrollTl.to(".panel", { xPercent: -100, ease: "none" });
```

---

## 📂 3. BỘ VÍ DỤ MẪU THỰC CHIẾN (`examples/`)

Trong thư mục `examples/` có sẵn 4 bộ dự án mẫu chuẩn của GreenSock:
- **Vanilla HTML/JS:** `examples/vanilla/index.html` & `examples/vanilla/main.js`
- **React + Vite (`@gsap/react`):** `examples/react/App.jsx`
- **Vue 3 + Vite:** `examples/vue/app.vue`
- **Nuxt 3 (`useGSAP` composable):** `examples/nuxt/app/composables/useGSAP.ts` & `examples/nuxt/app/pages/index.vue`
