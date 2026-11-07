# README — BẢN GIẢI THÍCH TOÀN BỘ CÁC SKILLS & CÔNG CỤ HIỆN CÓ
*(Cập nhật ngày 07/11/2026 — Dành cho Người Dùng & AI Agent)*

---

## 📌 1. TỔNG QUAN HỆ THỐNG SKILLS

Hệ thống kỹ năng của anh hiện được cài đặt tập trung tại:
- **Thư mục Skill chính:** [`C:\Users\INFOASIA\.gemini\config\skills`](file:///C:/Users/INFOASIA/.gemini/config/skills)
- **Kho lưu trữ mã nguồn & công cụ mở rộng:** [`E:\DIEN APP\Skill AI\`](file:///E:/DIEN%20APP/Skill%20AI/)
- **Cơ chế quản lý tri thức:** Bộ Não Lai Javis OS (SQLite FTS5 + RRF Fusion đa tầng)

Toàn bộ **36 Skills** hiện có được phân chia thành **8 Cụm Nghiệp Vụ Thực Chiến** chuyên sâu:

---

## 📚 2. DANH MỤC 36 SKILLS CHI TIẾT THEO 8 CỤM

### 🧭 Cụm 1: Quản Trị, Điều Phối & Kiến Trúc Dự Án (4 Skills)
1. **`project-blueprint-architect`**
   - **Mục đích:** Đóng vai Kiến trúc sư trưởng phỏng vấn ý tưởng người dùng (`Grill-Me`), gỡ bỏ các điểm mù và chốt 1 File Master Blueprint duy nhất trước khi bắt đầu viết code. Tích hợp lệnh tự động `/speckit-converge` chạy test code lặp đi lặp lại đến khi pass 100%.
   - **Khi nào dùng:** Bắt đầu bất kỳ dự án mới, module mới hoặc tính năng lớn.
   - **File chính:** `scripts/converge_blueprint.py`, `references/03-mau-1-file-master-blueprint-chuan.md`.

2. **`lean-teamwork`**
   - **Mục đích:** Bộ não điều phối đa tác tử (Lean Multi-Agent) theo chuẩn Toyota Production System. Chống lãng phí token/quota, chia việc thành các thẻ Atomic Task Card cuốn chiếu (xong phần 1 mới làm phần 2), hỗ trợ cửa sổ Popover HUD nghiệm thu.
   - **Khi nào dùng:** Mọi tác vụ phức tạp cần chia nhỏ, cần nghiệm thu từng bước rảnh khung chat.
   - **File chính:** `scripts/teamwork_bridge.py`, `scripts/manage_skills.py`.

3. **`nap-tai-lieu-antigravity`**
   - **Mục đích:** Quy chuẩn 5 bước nạp tài liệu mới (PDF, Word, Sách, SQL, SOP) vào hệ thống để AI tự động tìm kiếm chỉ mục trong `< 150ms`, đọc đúng đoạn dòng cần thiết, không làm tràn context window.
   - **Khi nào dùng:** Khi có tài liệu mới cần đưa vào "bộ não" của AI.
   - **File tham chiếu:** [`HUONG_DAN_NAP_TAI_LIEU_VA_SKILL_ANTIGRAVITY.md`](file:///C:/Users/INFOASIA/.gemini/config/HUONG_DAN_NAP_TAI_LIEU_VA_SKILL_ANTIGRAVITY.md).

4. **`prompts-chat`**
   - **Mục đích:** Cổng kết nối tra cứu thư viện 2,627 mẫu prompt chuyên gia Awesome Prompts + 31 chương sách chuyên sâu về Prompt Engineering và MCP tools.
   - **Khi nào dùng:** Khi cần tìm mẫu prompt chuẩn cho một vai trò, ngành nghề hoặc tình huống khó.

---

### 🛡️ Cụm 2: Kiểm Toán Độc Lập, Nguồn Gốc & An Toàn (3 Skills)
5. **`verified-source-researcher`**
   - **Mục đích:** Chốt chặn chống ảo giác AI (Zero Hallucination). Bắt buộc cung cấp đủ 4 tọa độ (Ở đâu - File nào - Trang/Dòng nào - Của tác giả nào), kèm câu trích dẫn nguyên văn $\le 25$ từ, kiểm tra link HTTP 200 sống và DOI/PubMed.
   - **Khi nào dùng:** Khi trích dẫn thông tin, số liệu khoa học, luật pháp, nghiên cứu thị trường.
   - **File chính:** `cli.py`, `scripts/link_validator.py`.

6. **`ifixai-agent-auditor`**
   - **Mục đích:** Giám khảo độc lập kiểm toán tính trung thực và an toàn của AI Agent qua 5 trụ cột: Chống bịa đặt (P1), Lừa dối (P2), Thao túng (P3), Mất kiểm soát (P4), Che giấu (P5). Chấm điểm Scorecard A–F.
   - **Khi nào dùng:** Sau khi AI hoàn thành một giai đoạn code hoặc báo cáo lớn.
   - **File chính:** `cli.py` (chạy các bộ test smoke/core/all).

7. **`security-audit`**
   - **Mục đích:** Rà soát bảo mật mã nguồn, kiểm thử lỗ hổng Web/API, rà soát lộ secret/token/password trong git history, thẩm định an toàn dịch vụ ngầm.
   - **Khi nào dùng:** Trước khi public repo GitHub hoặc trước khi deploy ứng dụng lên server.

---

### ⚙️ Cụm 3: Dịch Ngược & Tái Lập Phần Mềm (2 Skills)
8. **`craft-anything`** ⭐ *(Mới nạp)*
   - **Mục đích:** Bộ công cụ 100% Rust thuần của ArtCraft với **302 công cụ**. Cho phép soi bất kỳ website, app desktop, game, file APK nào hoạt động ra sao, rồi để AI Agent tự dựng lại một phiên bản sạch độc lập (Clean-room hoặc Deep mode).
   - **Giao diện:** Có cả App Desktop đồ họa [`craft-anything.exe`](file:///E:/DIEN%20APP/Skill%20AI/craft-anything/bin/craft-anything.exe) (egui) cực nhẹ lẫn CLI [`craft-anything-cli.exe`](file:///E:/DIEN%20APP/Skill%20AI/craft-anything/bin/craft-anything-cli.exe).
   - **Khi nào dùng:** Muốn tái tạo một website/app/game từ bên ngoài hoặc dịch ngược kiểm tra sâu.

9. **`reverse-engineer-anything` (REA)**
   - **Mục đích:** Bộ công cụ dòng lệnh chuyên sâu (TypeScript/Node.js) để bóc tách file nhị phân: bung gói Electron `app.asar`, dịch ngược .NET C#, unpack PyInstaller (.exe $\rightarrow$ .pyc $\rightarrow$ .py), bóc tách APK qua JADX/Ghidra.
   - **Khi nào dùng:** Khi cần bóc tách file cài đặt thực thi trên máy tính.
   - **File chính:** `node "E:\DIEN APP\Skill AI\rea\scripts\rea.mjs"`.

---

### 🎬 Cụm 4: Sản Xuất Phim, Video & Đồ Họa AI (11 Skills)
10. **`lam-phim-video-master`**
    - Siêu Hub tổng hợp 13 bộ skill làm phim AI, chứa 1,875 file tài nguyên DoP, góc máy, ánh sáng và phong cách hậu kỳ.
11. **`video-storytelling`**
    - Cỗ máy biên kịch theo 20+ công thức quốc tế (AIDA, HVC, 7-Beat, Pixar, Lemmino), sinh đồng thời 2 luồng prompt chuẩn ByteDance Seedance 2.0 và Google Veo 3.1.
12. **`cinematic-video-prompt`**
    - Từ điển 700+ thuật ngữ quay phim Hollywood chuẩn xác cho DoP (góc máy, camera motion, ánh sáng, ống kính, màu sắc).
13. **`create-and-edit-video`**
    - Lập trình và dựng video tự động bằng 5 Engine: Remotion (React), Motion Canvas, Manim (Python), Auto-Editor (cắt khoảng lặng), Editly.
14. **`deeptutor-cli`**
    - Hệ thống AI trợ giảng học tập, nghiên cứu arXiv, RAG đa engine và tự động dựng video bài giảng mô phỏng kỹ thuật/toán học qua Manim và Remotion.
15. **`kinetic-reel`**
    - Dựng video chữ chuyển động (Kinetic Typography) và Reels 9:16 bằng Canvas 2D + Three.js WebGL, khớp nhạc từng phách và render FFmpeg.
16. **`painted-animation`**
    - Dựng phim hoạt hình màu nước phong cách nghệ thuật bằng p5.js + p5.brush, tự động khớp nhạc và voiceover.
17. **`gsap-skills`**
    - Lập trình hiệu ứng chuyển động mượt mà 60fps trên Web và Video bằng GreenSock (GSAP): ScrollTrigger, Timelines, SplitText, MorphSVG.
18. **`recordly-tutorial-ai`**
    - Tự động quay màn hình hướng dẫn thao tác phần mềm, lồng tiếng giải thích bằng giọng đọc AI, xuất phụ đề .SRT và tự động zoom vào vị trí chuột click.
19. **`shopee-affiliate-video-studio`**
    - Đọc ảnh và thông số kỹ thuật sản phẩm Shopee, sáng tác kịch bản bán hàng đa góc nhìn, chèn chữ chạy trên video và dựng thành phẩm MP4 9:16.
20. **`yt-shortcode-commander`**
    - Dây chuyền sản xuất video YouTube/Facebook tự động qua 6 lệnh chuẩn (Nội dung, Prompt, Render, Lịch đăng, Nuôi profile, Kênh mới).

---

### 🎨 Cụm 5: Thiết Kế Web, UI/UX & Thương Hiệu (7 Skills)
21. **`brand-editorial-graphic-studio`**
    - Siêu Hub thiết kế Logo vector SVG, Bộ nhận diện thương hiệu CIP, Banner Ads, Báo giá VIP và dàn trang in ấn chuẩn PDF/DOCX/PPTX/Typst.
22. **`ui-ux-design-pro-max`**
    - Siêu Hub UI/UX phủ khắp 192 ngành nghề: 79 phong cách UI hiện đại, 84 hệ DESIGN.md của các hãng công nghệ lớn, chuyển thiết kế sang code cho 22 framework.
23. **`ui-ux-cro-auditor`**
    - Kiểm toán giao diện UI/UX trên đa độ phân giải Mobile/Desktop, kiểm tra khả năng tiếp cận WCAG 2.2 và tối ưu hóa tỷ lệ chuyển đổi (CRO) Landing Page.
24. **`webapp-app-ux-workflow`**
    - Thiết kế kiến trúc luồng UX cho Web App (SaaS/Admin/ERP) và Mobile App: quản lý State, điều hướng URL, CRUD bảng dữ liệu lớn và xử lý lỗi form.
25. **`design-landingpage-vip-v2`**
    - Thiết kế Landing Page VIP đóng gói trọn vẹn trong 1 file HTML duy nhất: giao diện Liquid Glass, 138 icon SVG inline, form đăng ký, mã QR VietQR và dual-tracking CAPI Meta/TikTok.
26. **`wordpress-flatsome-designer`**
    - Thiết kế web WordPress chuyên nghiệp chuẩn theme Flatsome 3.x: 100% native shortcodes UX Builder, shop bán hàng, giỏ hàng, bảng giá và 80 mục kiểm thử QA.
27. **`html-to-webcake`**
    - Chuyển đổi mã nguồn HTML sang định dạng `.pke` để mở và kéo thả trực tiếp trên trình dựng Landing Page Webcake.

---

### 📈 Cụm 6: Tiếp Thị, Quảng Cáo & Tự Động Hóa MXH (5 Skills)
28. **`google-ads-master`**
    - Siêu Hub 12 kỹ năng Google Ads & CRO: nghiên cứu từ khóa, cấu hình GA4/GTM dual-tracking, kiểm toán tài khoản A1-A14, tối ưu ROAS và xuất file Google Ads Editor CSV.
29. **`claude-seo`**
    - Kiểm toán SEO toàn diện và tối ưu hóa cho AI Search (GEO): Technical SEO, Core Web Vitals, Schema JSON-LD, tối ưu nội dung để được AI Overviews trích dẫn.
30. **`chan-dung-khach-hang-9-phan`**
    - Phương pháp phân tích chân dung khách hàng 9 phần: Jobs-to-be-done, Pains, Gains, Bản đồ Thấu cảm 6 vùng và tìm góc bán hàng độc nhất (USP).
31. **`tao-san-pham-so-bang-ai`**
    - Quy trình 7 ngày đóng gói kiến thức chuyên gia thành sản phẩm số bán được (ebook, workbook, template Notion, mini-course) và xây dựng phễu bán hàng.
32. **`antigravity-browser-controller`**
    - Điều khiển trình duyệt Chrome / Cốc Cốc qua CDP: quản lý đa profile sạch, vượt qua kiểm tra bot, tự động đăng bài Facebook và chụp ảnh màn hình nghiệm thu.

---

### 🏭 Cụm 7: Quản Trị Doanh Nghiệp ERP, SAP Business One & SQL (3 Skills)
33. **`sap-b1-beas`**
    - Kiến trúc chuyên sâu SAP Business One (9.3 / 10.0) và Boyum Beas Manufacturing: quản trị sản xuất, tính giá thành dở dang WIP 154, tuân thủ Thông tư 99/2025/TT-BTC.
34. **`sql-sap-b1`**
    - Kết nối an toàn đến 4 Cụm Server / 19 Database SAP B1 (24, 160, 52, 27), chạy các truy vấn SQL Read-Only để khớp số liệu thực tế với sổ cái kế toán.
35. **`viet-sql-sap-b1`**
    - Soạn thảo và kiểm tra cú pháp T-SQL / HANA SQLScript cho SAP B1: thiết lập tìm kiếm định dạng (FMS), viết `SBO_SP_TransactionNotification` chặn lỗi nghiệp vụ.

---

### 🔮 Cụm 8: Tri Thức Chuyên Sâu, Huyền Học & Khoa Học (1 Skill + Science Plugins)
36. **`tu-vi-bat-tu-than-so-hoc`**
    - Lập và luận giải lá số Tử Vi Đẩu Số (iztro-py), Bát Tự Tứ Trụ theo đúng 24 Tiết Khí thiên văn và Thần Số Học Pythagoras: xuất 10 hồ sơ SOP V3.0 và tinh bàn HTML.
- **Bộ Science Plugins đi kèm:** Các công cụ truy vấn cơ sở dữ liệu y sinh học quốc tế (AlphaFold cấu trúc protein, ChEMBL dược lý, PubMed y khoa, OpenFDA, Biomolecular 3D Structure Viewer...).

---

## 🔗 3. TÀI LIỆU LIÊN QUAN TRONG HỆ THỐNG

| Tài liệu | Đường dẫn file | Mục đích |
| :--- | :--- | :--- |
| **Cẩm nang chi tiết & Workflow** | [`HUONG_DAN_CHI_TIET_CAC_SKILLS_VA_WORKFLOW.md`](file:///E:/DIEN%20APP/Skill%20AI/HUONG_DAN_CHI_TIET_CAC_SKILLS_VA_WORKFLOW.md) | Tài liệu phân tích đầy đủ 36 skills, sơ đồ Mermaid và cách gọi từng lệnh. |
| **Quy chuẩn nạp tài liệu** | [`HUONG_DAN_NAP_TAI_LIEU_VA_SKILL_ANTIGRAVITY.md`](file:///C:/Users/INFOASIA/.gemini/config/HUONG_DAN_NAP_TAI_LIEU_VA_SKILL_ANTIGRAVITY.md) | Sổ tay đào tạo nạp tài liệu và tạo skill mới theo Bộ Não Lai Javis. |
| **Quy trình 5 Chốt Chặn Chống Ảo Giác** | [`QUY_TRINH_CHUNG_5_CHOT_CHAN_CHONG_AO_GIAC_AI.md`](file:///C:/Users/INFOASIA/.gemini/config/QUY_TRINH_CHUNG_5_CHOT_CHAN_CHONG_AO_GIAC_AI.md) | 5 chốt chặn thép bắt buộc tuân thủ trong mọi yêu cầu của 18 ngành. |
| **Sổ tay Prompt Mẫu** | [`SO_TAY_PROMPT_MAU_GOI_TOAN_BO_SKILL_AGENT.md`](file:///C:/Users/INFOASIA/.gemini/config/SO_TAY_PROMPT_MAU_GOI_TOAN_BO_SKILL_AGENT.md) | Các mẫu prompt gọi chính xác từng skill khi cần giao việc. |
