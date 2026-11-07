# SỔ TAY NGUỒN GỐC (UPSTREAM GIT) & QUY TRÌNH CHECK UPDATE TẤT CẢ SKILLS
*(Cập nhật ngày 07/11/2026 — Dành cho Quản trị viên hệ thống Antigravity & Javis OS)*

---

## 📌 1. BẢNG TRA CỨU NGUỒN GỐC GIT VÀ ĐƯỜNG DẪN CỤC BỘ

Mỗi kỹ năng trong hệ thống được phân thành 2 nhóm nguồn:
- **Nhóm Upstream Mở (Public Open-Source Git):** Có kho mã nguồn gốc trên GitHub, có thể kéo cập nhật tính năng mới bất kỳ lúc nào bằng lệnh `git pull`.
- **Nhóm Nội Bộ Chuyên Nghiệp (Proprietary / In-house Engineered):** Được xây dựng độc quyền cho hệ thống của anh (ERP SAP B1, bộ quy chuẩn 5 chốt chặn, cỗ máy kịch bản Veo 3/Seedance, landing page VietQR CAPI).

### Bảng Ánh Xạ Chi Tiết 37 Skills:

| STT | Tên Skill trong `config/skills` | Kho Git Gốc (Upstream Repo) | Thư Mục Mã Nguồn / Bản Build Trên Máy | Lệnh Kiểm Tra Cập Nhật Nhanh |
| :---: | :--- | :--- | :--- | :--- |
| **1** | **`craft-anything`** | [storytold/craft-anything](https://github.com/storytold/craft-anything) | [`E:\DIEN APP\Skill AI\craft-anything`](file:///E:/DIEN%20APP/Skill%20AI/craft-anything/) | `git -C "E:\DIEN APP\Skill AI\craft-anything" fetch && git -C "E:\DIEN APP\Skill AI\craft-anything" status` |
| **2** | **`reverse-engineer-anything`** | [morluto/rea](https://github.com/morluto/rea) | [`E:\DIEN APP\Skill AI\rea`](file:///E:/DIEN%20APP/Skill%20AI/rea/) | `git -C "E:\DIEN APP\Skill AI\rea" fetch && git -C "E:\DIEN APP\Skill AI\rea" status` |
| **3** | **`agency-agents`** | [msitarzewski/agency-agents](https://github.com/msitarzewski/agency-agents) | [`E:\DIEN APP\Skill AI\agency-agents`](file:///E:/DIEN%20APP/Skill%20AI/agency-agents/) | `git -C "E:\DIEN APP\Skill AI\agency-agents" fetch && git -C "E:\DIEN APP\Skill AI\agency-agents" status` |
| **4** | **`prompts-chat`** | [f/awesome-chatgpt-prompts](https://github.com/f/awesome-chatgpt-prompts) | [`E:\DIEN APP\Skill AI\prompts-chat`](file:///E:/DIEN%20APP/Skill%20AI/prompts-chat/) | API `prompts.chat/api/mcp` tự động đồng bộ |
| **5** | **`project-blueprint-architect`** | [github/spec-kit](https://github.com/github/spec-kit) (Kiến trúc hội tụ) | [`E:\DIEN APP\Skill AI\blueprint-repos`](file:///E:/DIEN%20APP/Skill%20AI/blueprint-repos/) | Chạy `python converge_blueprint.py` |
| **6** | **`ifixai-agent-auditor`** | Hệ thống kiểm toán độc lập 5 trụ cột nội bộ | [`E:\DIEN APP\Skill AI\ifixai`](file:///E:/DIEN%20APP/Skill%20AI/ifixai/) | `python cli.py --suite smoke` |
| **7** | **`verified-source-researcher`** | Hệ thống kiểm chứng nguồn cấp 1 nội bộ | [`E:\DIEN APP\Skill AI\verified-source-researcher`](file:///E:/DIEN%20APP/Skill%20AI/verified-source-researcher/) | `python cli.py --check-doi-pmid` |
| **8** | **`lean-teamwork`** | Kiến trúc Toyota TPS điều phối nội bộ | [`C:\Users\INFOASIA\.gemini\config\skills\lean-teamwork`](file:///C:/Users/INFOASIA/.gemini/config/skills/lean-teamwork/) | Chạy `scripts/teamwork_bridge.py` |
| **9** | **`nap-tai-lieu-antigravity`** | Giao thức Bộ Não Lai Javis OS | [`E:\DIEN APP\JavisOS`](file:///E:/DIEN%20APP/JavisOS/) | `python agy_skill_engine.py` |
| **10** | **`video-storytelling`** | Cỗ máy kịch bản 20+ công thức nội bộ | [`E:\DIEN APP\Skill AI\video-storytelling`](file:///E:/DIEN%20APP/Skill%20AI/video-storytelling/) | Kiểm tra cập nhật mẫu prompt Seedance/Veo |
| **11** | **`cinematic-video-prompt`** | Từ điển 700+ thuật ngữ quay phim DoP | [`E:\DIEN APP\Skill AI\opus-video-skills`](file:///E:/DIEN%20APP/Skill%20AI/opus-video-skills/) | Cập nhật file `.md` trong `references/` |
| **12** | **`lam-phim-video-master`** | Siêu Hub 13 bộ skill làm phim AI | [`E:\DIEN APP\Skill AI\lam-phim-video-master`](file:///E:/DIEN%20APP/Skill%20AI/lam-phim-video-master/) | Đồng bộ tài nguyên DoP |
| **13** | **`create-and-edit-video`** | [Remotion](https://github.com/remotion-dev/remotion), [Motion Canvas](https://github.com/motion-canvas/motion-canvas), [Manim](https://github.com/ManimCommunity/manim) | [`E:\DIEN APP\Skill AI\create and edit video`](file:///E:/DIEN%20APP/Skill%20AI/create%20and%20edit%20video/) | `npm update remotion` / `pip install -U manim` |
| **14** | **`deeptutor-cli`** | DeepTutor CLI (RAG + Manim Math) | [`C:\Users\INFOASIA\.gemini\config\skills\deeptutor-cli`](file:///C:/Users/INFOASIA/.gemini/config/skills/deeptutor-cli/) | `deeptutor --version` |
| **15** | **`kinetic-reel`** | Three.js WebGL & Canvas 2D Motion Reels | [`C:\Users\INFOASIA\.gemini\config\skills\kinetic-reel`](file:///C:/Users/INFOASIA/.gemini/config/skills/kinetic-reel/) | Chạy test render FFmpeg |
| **16** | **`painted-animation`** | [p5.brush](https://github.com/acamposuribe/p5.brush) (Màu nước) | [`C:\Users\INFOASIA\.gemini\config\skills\painted-animation`](file:///C:/Users/INFOASIA/.gemini/config/skills/painted-animation/) | Kiểm tra thư viện p5.brush |
| **17** | **`gsap-skills`** | [greensock/GSAP](https://github.com/greensock/GSAP) (Animation 60fps) | [`C:\Users\INFOASIA\.gemini\config\skills\gsap-skills`](file:///C:/Users/INFOASIA/.gemini/config/skills/gsap-skills/) | Kiểm tra bản cập nhật GSAP 3.x |
| **18** | **`recordly-tutorial-ai`** | Recordly Engine tự động quay & chèn giọng AI | [`C:\Users\INFOASIA\.gemini\config\skills\recordly-tutorial-ai`](file:///C:/Users/INFOASIA/.gemini/config/skills/recordly-tutorial-ai/) | Chạy `scripts/recordly_engine.py` |
| **19** | **`shopee-affiliate-video-studio`** | Cỗ máy AI đọc ảnh thông số dựng video 9:16 | [`C:\Users\INFOASIA\.gemini\config\skills\shopee-affiliate-video-studio`](file:///C:/Users/INFOASIA/.gemini/config/skills/shopee-affiliate-video-studio/) | Chạy script phân tích sản phẩm |
| **20** | **`yt-shortcode-commander`** | Dây chuyền auto-production video YouTube | [`C:\Users\INFOASIA\.gemini\config\skills\yt-shortcode-commander`](file:///C:/Users/INFOASIA/.gemini/config/skills/yt-shortcode-commander/) | Chạy test chuỗi lệnh `run_channel_step.py` |
| **21** | **`brand-editorial-graphic-studio`** | [typst/typst](https://github.com/typst/typst) (Dàn trang PDF/In ấn) | [`C:\Users\INFOASIA\.gemini\config\skills\brand-editorial-graphic-studio`](file:///C:/Users/INFOASIA/.gemini/config/skills/brand-editorial-graphic-studio/) | `typst --version` |
| **22** | **`ui-ux-design-pro-max`** | 84 DESIGN.md thương hiệu & 79 UI styles | [`E:\DIEN APP\Skill AI\ui-workflow-repos`](file:///E:/DIEN%20APP/Skill%20AI/ui-workflow-repos/) | Kiểm tra kho theme và tokens |
| **23** | **`ui-ux-cro-auditor`** | Bộ kiểm toán WCAG 2.2 & Mobile CRO | [`E:\DIEN APP\Skill AI\ui-audit-repos`](file:///E:/DIEN%20APP/Skill%20AI/ui-audit-repos/) | Chạy `scripts/cro_audit_runner.py` |
| **24** | **`webapp-app-ux-workflow`** | Kiến trúc UX State/URL bảng dữ liệu lớn | [`E:\DIEN APP\Skill AI\ui-workflow-repos`](file:///E:/DIEN%20APP/Skill%20AI/ui-workflow-repos/) | Cập nhật quy chuẩn routing |
| **25** | **`design-landingpage-vip-v2`** | Template Liquid Glass, 138 icon SVG, VietQR | [`E:\DIEN APP\Skill AI\Skill Landingpage`](file:///E:/DIEN%20APP/Skill%20AI/Skill%20Landingpage/) | Kiểm tra kho icon SVG và webhook CAPI |
| **26** | **`wordpress-flatsome-designer`** | Flatsome 3.x & UX Builder shortcodes | [`C:\Users\INFOASIA\.gemini\config\skills\wordpress-flatsome-designer`](file:///C:/Users/INFOASIA/.gemini/config/skills/wordpress-flatsome-designer/) | Thư viện shortcodes chuẩn |
| **27** | **`html-to-webcake`** | Bộ chuyển mã JSON sang `.pke` Webcake | [`C:\Users\INFOASIA\.gemini\config\skills\html-to-webcake`](file:///C:/Users/INFOASIA/.gemini/config/skills/html-to-webcake/) | Chạy parser test |
| **28** | **`google-ads-master`** | Siêu Hub 12 skill Google Ads & CRO | [`E:\DIEN APP\Skill AI\google ads`](file:///E:/DIEN%20APP/Skill%20AI/google%20ads/) | Kiểm tra các mẫu CSV Editor |
| **29** | **`claude-seo`** | 62 scripts kiểm toán SEO & GEO AI Search | [`C:\Users\INFOASIA\.gemini\config\skills\claude-seo`](file:///C:/Users/INFOASIA/.gemini/config/skills/claude-seo/) | Chạy audit checklist |
| **30** | **`chan-dung-khach-hang-9-phan`** | Mô hình Alexander Osterwalder (Value Canvas) | [`C:\Users\INFOASIA\.gemini\config\skills\chan-dung-khach-hang-9-phan`](file:///C:/Users/INFOASIA/.gemini/config/skills/chan-dung-khach-hang-9-phan/) | Cập nhật biểu mẫu thấu cảm |
| **31** | **`tao-san-pham-so-bang-ai`** | Quy trình đóng gói sản phẩm số 7 ngày | [`C:\Users\INFOASIA\.gemini\config\skills\tao-san-pham-so-bang-ai`](file:///C:/Users/INFOASIA/.gemini/config/skills/tao-san-pham-so-bang-ai/) | Sổ tay quy trình |
| **32** | **`antigravity-browser-controller`**| Cầu nối CDP Chrome / Cốc Cốc đa profile | [`E:\DIEN APP\Skill AI\antigravity-browser-bridge`](file:///E:/DIEN%20APP/Skill%20AI/antigravity-browser-bridge/) | Chạy `python test_browser.py` |
| **33** | **`sap-b1-beas`** | SAP B1 9.3/10.0, Boyum Beas, TT 99/2025 | Dữ liệu nghiệp vụ InfoAsia độc quyền | Tra cứu thông tư thuế & Beas SDK |
| **34** | **`sql-sap-b1`** | Kết nối 4 Server / 19 DB SAP B1 (24, 160, 52, 27)| [`C:\Users\INFOASIA\.gemini\config\skills\sql-sap-b1`](file:///C:/Users/INFOASIA/.gemini/config/skills/sql-sap-b1/) | Test connection read-only |
| **35** | **`viet-sql-sap-b1`** | 323 mẫu T-SQL/HANA, FMS, TransactionNotification | [`C:\Users\INFOASIA\.gemini\config\skills\viet-sql-sap-b1`](file:///C:/Users/INFOASIA/.gemini/config/skills/viet-sql-sap-b1/) | Chạy `scripts/sql_validator.py` |
| **36** | **`tu-vi-bat-tu-than-so-hoc`** | [Sylar-Long/iztro-py](https://github.com/Sylar-Long/iztro-py) (Thuật toán Thiên văn) | [`C:\Users\INFOASIA\.gemini\config\skills\tu-vi-bat-tu-than-so-hoc`](file:///C:/Users/INFOASIA/.gemini/config/skills/tu-vi-bat-tu-than-so-hoc/) | `pip install -U iztro` |
| **37** | **`security-audit`** | Chuẩn OWASP Top 10 & Code Audit | [`C:\Users\INFOASIA\.gemini\config\skills\security-audit`](file:///C:/Users/INFOASIA/.gemini/config/skills/security-audit/) | Chạy scan an toàn mã nguồn |

---

## ⚡ 2. CÔNG CỤ TỰ ĐỘNG CHECK UPDATE TOÀN BỘ REPO NGOÀI

Hệ thống có sẵn script Python để tự động quét kiểm tra cập nhật (fetch git) của toàn bộ các repo upstream chỉ trong 1 lệnh duy nhất:

```powershell
& "C:\Users\INFOASIA\AppData\Local\Programs\Python\Python313\python.exe" "E:\DIEN APP\Skill AI\check_upstream_updates.py"
```
Script này sẽ lần lượt duyệt qua `craft-anything`, `rea`, `agency-agents`... và thông báo cho anh nếu trên GitHub tác giả vừa có commit/release mới!
