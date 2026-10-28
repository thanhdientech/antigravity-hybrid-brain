# 📚 CẨM NANG GIẢI THÍCH CHI TIẾT 9 SKILLS TRONG `config\skills` & THƯ VIỆN PYTHON CẦN CÀI
*(Tài liệu tra cứu nhanh: Cái nào là gì — Dùng làm gì — Cần cài thư viện Python nào — Cách chạy CLI & Cập nhật Git)*

> **Vị trí cài đặt chuẩn trên máy tính:** `C:\Users\<Tên_User>\.gemini\config\skills\` (tương đương `%USERPROFILE%\.gemini\config\skills\`).
> Khi chạy file [`CAI_DAT_1_CLICK_WINDOWS.bat`](../CAI_DAT_1_CLICK_WINDOWS.bat), toàn bộ 9 thư mục kỹ năng (kèm file hướng dẫn này và file cài thư viện Python [`CAI_THU_VIEN_PYTHON_CHO_SKILLS.bat`](./CAI_THU_VIEN_PYTHON_CHO_SKILLS.bat)) sẽ được sao chép tự động vào đúng đường dẫn hệ thống của Antigravity.

---

## 📌 1. BẢNG TỔNG HỢP NHANH 9 SKILLS (TRA CỨU 30 GIÂY)

9 Skills trong thư mục này được chia thành **4 Nhóm Chức Năng** cốt lõi:

| STT | Tên thư mục Skill | Nhóm chức năng | Nó là cái gì & Dùng để làm gì? | Thư viện Python cần cài (`pip`) | Có `.git` update? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | [`verified-source-researcher`](./verified-source-researcher/SKILL.md) | 🛡️ **Chốt Chặn #2**<br>*(Chống Ảo Giác)* | **Kiểm toán nguồn dẫn chứng Cấp 1:** Bắt buộc AI ghi rõ *Ở đâu — File/Sách nào — Trang/Dòng nào — Của tác giả nào*; kiểm tra link sống `HTTP 200`, DOI, PMID, ISBN. | 🟢 **Không cần cài thêm**<br>*(Thuần Python chuẩn `urllib`, `json`)* | ❌ Nội bộ |
| **2** | [`lean-teamwork`](./lean-teamwork/SKILL.md) | 🛡️ **Chốt Chặn #3**<br>*(Chia Nhỏ & Kỷ Luật)* | **Điều phối đa tác tử tinh gọn:** Chia việc lớn thành *Atomic Task Card* (làm cuốn chiếu 25–30 cảnh/lần), cấm dùng script làm tắt văn bản, bắt buộc tìm nguyên nhân gốc khi sửa bug. | 🟢 **Không cần cài thêm**<br>*(Thuần Python chuẩn `pathlib`, `json`)* | ❌ Nội bộ |
| **3** | [`ifixai-agent-auditor`](./ifixai-agent-auditor/SKILL.md) | 🛡️ **Chốt Chặn #4**<br>*(Kiểm Toán Độc Lập)* | **Kiểm toán độc lập AI Agent (5 trụ cột iFixAi):** Chấm điểm chất lượng sản phẩm từ **A–F (thang 100)** qua 5 trụ cột `P1–P5`. | 🟢 **`cli.py`: Không cần cài thêm**<br>🟡 *Full SDK (`src/`):* `pydantic`, `pyyaml`, `jsonschema`, `click`, `aiohttp`, `rich`, `questionary`, `json-repair` | ❌ Nội bộ |
| **4** | [`video-storytelling`](./video-storytelling/SKILL.md) | 🎬 **Làm Video & Phim AI** | **Bách khoa toàn thư biên kịch video:** Viết kịch bản TikTok/Shorts, Ads, YouTube dài, phim tài liệu theo **20+ công thức quốc tế**; xuất prompt **Veo 3** & **Seedance 2.0**, khóa nhân vật 4 góc. | 🟢 **Không cần cài thêm**<br>*(Thuần Python chuẩn `argparse`, `json`)* | ❌ Nội bộ |
| **5** | [`cinematic-video-prompt`](./cinematic-video-prompt/SKILL.md) | 🎬 **Làm Video & Phim AI** | **Từ điển kỹ thuật quay phim (700+ thuật ngữ DoP):** Chuẩn hóa prompt tạo ảnh/video AI về cỡ cảnh, góc máy, chuyển động camera, ánh sáng, ống kính và màu phim. | 🟢 **Không dùng Python**<br>*(Thuần Markdown / Từ điển DoP)* | ✅ Có (`git pull`) |
| **6** | [`design-landingpage-vip-v2`](./design-landingpage-vip-v2/SKILL.md) | 🌐 **Web, LP & SEO** | **Thiết kế Landing Page VIP (Noti.vn / GĐT):** Tạo **1 file HTML** hoàn chỉnh (15 mẫu Design System), có Form + QR VietQR + **Meta CAPI / TikTok Events API** qua Webhook + 138 icon SVG inline. | 🟢 **Không dùng Python**<br>*(Thuần HTML/CSS/JS & 138 SVG)* | ❌ Nội bộ |
| **7** | [`wordpress-flatsome-designer`](./wordpress-flatsome-designer/SKILL.md) | 🌐 **Web, LP & SEO** | **Thiết kế WordPress Flatsome 3.x:** Tạo mã **Shortcodes UX Builder chuẩn 100%** (`[section]`, `[row]`, `[col]`, `[ux_banner]`, `[ux_products]`) để kéo thả trực quan, kèm Child Theme. | 🟢 **Không dùng Python**<br>*(Thuần Shortcodes & PHP/CSS)* | ❌ Nội bộ |
| **8** | [`claude-seo`](./claude-seo/SKILL.md) | 🌐 **Web, LP & SEO** | **Kiểm toán SEO & AI Search (GEO v2.4.2):** 26 sub-skills, 19 specialist agents & 60 scripts Python kiểm tra Technical SEO, CWV, E-E-A-T, Schema JSON-LD, AI Overviews (`llms.txt`), Local SEO, Backlinks. | 🟠 **Cần cài từ `requirements.txt`:**<br>`beautifulsoup4`, `requests`, `lxml`, `lxml_html_clean`, `trafilatura`, `htmldate`, `courlan`, `playwright`, `openpyxl`, `matplotlib`... | ✅ Có (`git pull`) |
| **9** | [`antigravity-browser-controller`](./antigravity-browser-controller/SKILL.md) | 🤖 **Tự Động Hóa Trình Duyệt** | **Điều khiển trình duyệt Đa Profile:** Điều khiển Cốc Cốc/Chrome/Edge qua WebSocket `:8765` & HTTP `:8766` (`default`, `profile_1`, `profile_2`...), nạp file Ảnh/Video ngầm, đăng bài Facebook 1 chạm. | 🟠 **Cần cài 2 thư viện:**<br>`aiohttp`, `websockets`<br>*(để chạy `scripts/server.py`)* | ❌ Nội bộ |
| **10** | [`create-and-edit-video`](./create-and-edit-video/SKILL.md) | 🎬 **Làm Video & Phim AI** | **Kiến tạo & biên tập video tự động bằng code (5 Engines):** Tích hợp Remotion (React/TS), Motion Canvas, Manim (3Blue1Brown), Auto-Editor (cắt khoảng lặng), Editly & 703 Prompt Opus. | 🟢 **Không cần cài thêm**<br>*(Chạy CLI từng Engine)* | ❌ Nội bộ |
| **11** | [`yt-shortcode-commander`](./yt-shortcode-commander/SKILL.md) | 🎬 **Xây Kênh YouTube** | **Điều khiển dây chuyền sản xuất YouTube 6 Lệnh & 3 Kênh:** Quản lý viết nội dung, viết prompt, QA check, render, lên lịch đăng video, nuôi thiết bị và lên kế hoạch kênh mới. | 🟢 **Không cần cài thêm** | ❌ Nội bộ |
| **12** | [`sap-b1-beas`](./sap-b1-beas/SKILL.md) | 🏭 **ERP & Kế Toán Giá Thành** | **Kiến trúc sư Giải pháp SAP B1 (9.3/10.0) & Boyum Beas:** Quản lý Work Order, BOM Batch (`batchanderung.htm`), Giá thành `WIP 154`, Thông tư 99/2025/TT-BTC, DI/UI API, Service Layer, DTW. | 🟢 **Không dùng Python** | ❌ Nội bộ |
| **13** | [`sql-sap-b1`](./sql-sap-b1/SKILL.md) | 🏭 **ERP & SQL Database** | **Hệ thống Kết nối SQL Read-Only 4 Server / 19 DB SAP B1:** Truy vấn an toàn (`sap_readonly_user`), đối chiếu khớp số thực tế, gọi Service Layer `:50000` và xuất báo cáo `.xlsx`, `.pdf`, `.csv`. | 🟠 **Cần cài khi chạy SQL/Báo cáo:**<br>`pyodbc`, `pymssql`, `openpyxl`, `reportlab` | ❌ Nội bộ |
| **14** | [`viet-sql-sap-b1`](./viet-sql-sap-b1/SKILL.md) | 🏭 **ERP & SQL Database** | **Kỹ sư Trưởng Viết & Test SQL SAP B1 / Beas:** Quy tắc nối bảng (`DocEntry`, `BaseEntry`), viết FMS, `SBO_SP_TransactionNotification`, kho 24 query thực chiến SBO_MFG & 299 file `.sql` chuẩn SAP. | 🟠 **Cần cài khi test SQL:**<br>`pyodbc`, `pymssql` | ❌ Nội bộ |

---

## 🐍 2. CHI TIẾT THƯ VIỆN PYTHON CẦN CÀI CHO TỪNG SKILL & LỆNH CÀI 1 CHẠM

> **Yêu cầu phiên bản Python trên máy mới:** **Python `>= 3.10`** (khuyên dùng Python `3.11` hoặc `3.12`). Khi cài Python trên Windows, nhớ tích chọn ô **`[x] Add python.exe to PATH`**.

### ⚡ Cách 1: Cài tự động bằng 1 cú nhấp đúp chuột (Nhanh nhất)
Nhấp đúp vào file **`CAI_THU_VIEN_PYTHON_CHO_SKILLS.bat`** nằm ngay trong thư mục này (hoặc ở thư mục gốc `GOI_DEM_SANG_MAY_KHAC_ANTIGRAVITY`). Script sẽ tự động cài đặt đầy đủ các thư viện Python cần thiết.

### ⚡ Cách 2: Chạy lệnh `pip install` theo đúng nhu cầu từng Skill

#### A. Nhóm 6 Skills chạy ngay 100% KHÔNG CẦN cài thêm thư viện ngoài (Dùng Python Standard Library)
Các skill dưới đây được viết tối ưu bằng thư viện chuẩn có sẵn trong mọi bản cài đặt Python (`urllib.request`, `json`, `csv`, `re`, `argparse`, `pathlib`, `os`, `sys`), nên **chép sang máy mới là chạy được ngay lập tức**:
1. **`verified-source-researcher`** (`cli.py`, `scripts/link_validator.py`, `academic_checker.py`, `book_checker.py`, `citation_mapper.py`)
2. **`lean-teamwork`** (`scripts/teamwork_bridge.py`, `scripts/manage_skills.py`)
3. **`ifixai-agent-auditor` (chế độ Fast CLI `cli.py`)** — dùng kiểm toán nhanh 5 trụ cột `P1–P5`
4. **`video-storytelling`** (`cli.py`, `generator.py`, `engines/*.py`)
5. **`cinematic-video-prompt`** (từ điển Markdown)
6. **`design-landingpage-vip-v2`** & **`wordpress-flatsome-designer`** (template HTML/SVG/Shortcode)

---

#### B. Nhóm 3 Skills cần cài thêm thư viện Python (`pip install`) khi dùng tính năng chuyên sâu

##### 1. Thư viện cho `antigravity-browser-controller` (Điều khiển trình duyệt & Auto-Post Facebook)
- **File sử dụng:** [`antigravity-browser-controller/scripts/server.py`](./antigravity-browser-controller/scripts/server.py#L15-L16) (Dòng `L15–L16`).
- **Thư viện cần cài:**
  - `aiohttp`: Chạy HTTP REST API Server ở cổng `:8766` để nhận lệnh từ AI Agent và `fb_auto_post.py`.
  - `websockets`: Chạy WebSocket Server ở cổng `:8765` để giữ kết nối 24/7 với Extension trên các profile Cốc Cốc / Chrome.
- **Lệnh cài đặt:**
  ```powershell
  pip install aiohttp websockets
  ```

##### 2. Thư viện cho `claude-seo` (60 Scripts Python Kiểm toán SEO & AI Search GEO)
- **File khai báo gốc:** [`claude-seo/requirements.txt`](./claude-seo/requirements.txt#L1-L28) (Dòng `L1–L28`).
- **Chia làm 2 gói thư viện:**
  1. **Gói Cốt lõi (Bắt buộc khi chạy `/seo audit`, `/seo page`, `/seo technical`, `/seo schema`, `/seo geo`):**
     - `beautifulsoup4`, `requests`, `lxml`, `lxml_html_clean`, `urllib3` (Tải trang và phân tích DOM HTML/XML/Schema).
     - `trafilatura`, `htmldate`, `courlan` (Trích xuất nội dung bài viết sạch và kiểm tra ngày xuất bản E-E-A-T).
     - `playwright` (Giả lập trình duyệt Chromium để chụp ảnh màn hình giao diện và đo đạc trang web dùng React/Vue/Next.js).
     - **Lệnh cài Gói Cốt lõi:**
       ```powershell
       pip install beautifulsoup4 requests lxml lxml_html_clean urllib3 trafilatura htmldate courlan playwright
       playwright install chromium
       ```
  2. **Gói Mở rộng (Tùy chọn khi cần xuất báo cáo Excel/PDF biểu đồ hoặc kết nối Google Search Console / GA4 / Google Ads API qua `/seo google`):**
     - `openpyxl`, `matplotlib`, `numpy`, `weasyprint` (Vẽ biểu đồ và xuất báo cáo Excel/PDF).
     - `google-api-python-client`, `google-auth`, `google-auth-httplib2`, `google-analytics-data`, `google-ads` (Kết nối API chính chủ Google).
     - **Lệnh cài toàn bộ từ file `requirements.txt`:**
       ```powershell
       pip install -r "%USERPROFILE%\.gemini\config\skills\claude-seo\requirements.txt"
       playwright install chromium
       ```

##### 3. Thư viện mở rộng cho `ifixai-agent-auditor` (Khi dùng Full SDK `src/` thay vì `cli.py`)
- **File khai báo gốc:** [`ifixai-agent-auditor/pyproject.toml`](./ifixai-agent-auditor/pyproject.toml#L28-L39) (Dòng `L28–L39`).
- **Lưu ý:** File [`ifixai-agent-auditor/cli.py`](./ifixai-agent-auditor/cli.py) mà quy trình 5 Chốt Chặn gọi hàng ngày **không cần cài thư viện nào cả**. Tuy nhiên, nếu bạn muốn chạy bộ khung kiểm toán sâu bằng LLM Judge (`src/`) thì cài thêm:
  ```powershell
  pip install pydantic typing_extensions pyyaml jsonschema click aiohttp python-dateutil json-repair rich questionary
  ```

---

### 💡 LỆNH TỔNG HỢP 1 DÒNG (CÀI TẤT CẢ THƯ VIỆN QUAN TRỌNG NHẤT TRÊN MÁY MỚI)

Nếu sang máy mới và muốn gõ **đúng 1 lệnh duy nhất** trong PowerShell / CMD để mọi Skill đều chạy 100% công suất:

```powershell
pip install aiohttp websockets beautifulsoup4 requests lxml lxml_html_clean urllib3 trafilatura htmldate courlan playwright openpyxl matplotlib numpy pydantic pyyaml jsonschema click python-dateutil json-repair rich questionary && playwright install chromium
```

---

## 🔍 3. GIẢI THÍCH CHI TIẾT TỪNG SKILL: LÀ GÌ, DÙNG LÀM GÌ & CÁCH DÙNG

### NHÓM A — 3 SKILLS BẢO VỆ CHỐNG ẢO GIÁC AI (THE UNIVERSAL GATES)

#### 1️⃣ `verified-source-researcher` — Kiểm Toán Nguồn Sự Thật Gốc (Chốt Chặn #2)
- **Tệp định nghĩa gốc:** [`verified-source-researcher/SKILL.md`](./verified-source-researcher/SKILL.md) (Dòng `L1–L117`) & công cụ [`verified-source-researcher/cli.py`](./verified-source-researcher/cli.py).
- **Nó là cái gì?**
  Là "cảnh sát kiểm tra nguồn trích dẫn" của AI, ép buộc AI phải phân biệt rõ **📂 Nguồn 1 (Tài liệu người dùng cung cấp trong máy)** và **🌐📖 Nguồn 2 (Sách báo, tạp chí khoa học, văn bản luật, tài liệu hãng trên mạng)**.
- **Dùng để làm gì?**
  - Chặn đứng tật AI tự bịa số liệu thống kê, tự chế điều khoản luật, tự bịa tên sách hoặc số trang giả.
  - Bắt buộc mọi khẳng định phải ghi đủ 4 tọa độ: **`Ở đâu` — `File/Sách nào` — `Trang/Dòng nào` — `Của tác giả nào`** kèm câu trích dẫn nguyên văn (`"..."`).
  - Lập **Bảng Ánh Xạ Minh Chứng Nguồn** ở cuối mỗi báo cáo/tài liệu.
- **Thư viện Python:** Không cần cài thêm (dùng `urllib.request`, `json`, `re` chuẩn của Python).
- **Cách kích hoạt / sử dụng:**
  ```powershell
  python "%USERPROFILE%\.gemini\config\skills\verified-source-researcher\cli.py" --help
  ```

---

#### 2️⃣ `lean-teamwork` — Điều Phối Đa Tác Tử Tinh Gọn & Chia Nhỏ Cuốn Chiếu (Chốt Chặn #3)
- **Tệp định nghĩa gốc:** [`lean-teamwork/SKILL.md`](./lean-teamwork/SKILL.md) (Dòng `L1–L177`).
- **Nó là cái gì?**
  Là bộ quy tắc vận hành giúp AI làm việc có kỷ luật, tiết kiệm Quota/Token tối đa mà không bao giờ làm ẩu hay bỏ sót chi tiết.
- **Dùng để làm gì?**
  - **Chia nhỏ công việc lớn (Chunk & Merge):** Khi làm kịch bản 80+ cảnh phim, viết phần mềm nhiều module hoặc phân tích dữ liệu lớn, AI sẽ chia thành từng phần nhỏ (25–30 cảnh/lần), làm xong và kiểm tra đạt 100% phần 1 mới sang phần 2.
  - **Cấm đi đường tắt (Zero Shortcuts):** Cấm AI viết script Python gán ẩu văn bản hàng loạt hoặc viết code giả (`mock/stub`).
  - **Sửa lỗi từ nguyên nhân gốc (Root-Cause First):** Khi sửa code lỗi, bắt buộc đọc log và tìm đúng nguyên nhân gốc thay vì đoán mò thử-sai làm tốn token.
- **Thư viện Python:** Không cần cài thêm.

---

#### 3️⃣ `ifixai-agent-auditor` — Kiểm Toán Độc Lập 5 Trụ Cột (Chốt Chặn #4)
- **Tệp định nghĩa gốc:** [`ifixai-agent-auditor/SKILL.md`](./ifixai-agent-auditor/SKILL.md) (Dòng `L1–L107`) & công cụ [`ifixai-agent-auditor/cli.py`](./ifixai-agent-auditor/cli.py).
- **Nó là cái gì?**
  Là bộ công cụ Kiểm toán Độc lập (QA Auditor) đánh giá sản phẩm của AI dựa trên 5 trụ cột rủi ro chuẩn quốc tế **iFixAi**:
  1. `P1 Fabrication` (Có bịa đặt số liệu/tài liệu không?)
  2. `P2 Deception` (Có nói dối "đã xong" khi file rỗng/lỗi không?)
  3. `P3 Manipulation` (Có làm lệch yêu cầu của người dùng không?)
  4. `P4 Unpredictability` (Có bị lỗi cú pháp, lỗi font UTF-8, vỡ bảng CSV/JSON không?)
  5. `P5 Opacity` (Có chứa mã độc, lộ API Key/Secret hay lệnh xóa ngầm nguy hiểm không?)
- **Dùng để làm gì?**
  - Chấm điểm độc lập mọi thư mục dự án, kịch bản video, mã nguồn hoặc tài liệu từ **Hạng A (90–100 điểm)** đến **Hạng F (<50 điểm)**. Chỉ khi đạt `Exit code 0` và `Grade A/B` mới được phép nghiệm thu.
- **Thư viện Python:** `cli.py` chạy ngay không cần cài thư viện; bộ `src/` nâng cao dùng `pydantic`, `pyyaml`, `jsonschema`, `click`, `aiohttp`, `rich`, `questionary`.
- **Cách kích hoạt / sử dụng:**
  ```powershell
  python "%USERPROFILE%\.gemini\config\skills\ifixai-agent-auditor\cli.py" "<Đường_dẫn_thư_mục_cần_kiểm_toán>"
  ```

---

### NHÓM B — 2 SKILLS SẢN XUẤT VIDEO & LÀM PHIM AI CHUYÊN NGHIỆP

#### 4️⃣ `video-storytelling` — Bách Khoa Toàn Thư Biên Kịch & Kịch Bản Video Đa Thể Loại
- **Tệp định nghĩa gốc:** [`video-storytelling/SKILL.md`](./video-storytelling/SKILL.md) (Dòng `L1–L142`) kèm 7 tệp chuyên khảo trong [`video-storytelling/references/`](./video-storytelling/references/).
- **Nó là cái gì?**
  Là hệ thống biên kịch video toàn diện tích hợp **hơn 20 công thức kể chuyện quốc tế** và bộ quy chuẩn xuất Prompt Video AI cho **Google Veo 3/3.1** cùng **ByteDance Seedance 2.0/2.5**.
- **Dùng để làm gì?**
  - **Viết kịch bản Short-form (TikTok/Reels/Shorts 15–60s):** Công thức `HVC`, `PAS-T`, `Myth-Buster`.
  - **Viết kịch bản Video Quảng cáo chuyển đổi (FB/TikTok Ads):** Công thức `AIDA`, `BAB`, `UGC 5-Beat`, `StoryBrand 7-Part`.
  - **Viết kịch bản YouTube dài & Phim tài liệu khoa học (8–30 phút):** Công thức `ABT (And-But-Therefore)`, `7-Beat Scientific Debate`, `Curiosity Gap`, `Vox 4-Phase Dialectic`, `Lemmino Forensic Mystery`.
  - **Viết kịch bản Phim ngắn điện ảnh & Hoạt hình AI:** Công thức `Hollywood 3-Act`, `Pixar Story Spine`, `Dan Harmon 8-Beat Story Circle`, `Kishōtenketsu`.
  - **Khóa đồng nhất diện mạo nhân vật (`Character Consistency 4-View`):** Giữ nguyên khuôn mặt, trang phục nhân vật (`uid01..uid06`) xuyên suốt hàng trăm cảnh phim.
- **Thư viện Python:** Không cần cài thêm (chạy thuần Python chuẩn).

---

#### 5️⃣ `cinematic-video-prompt` — Từ Điển Kỹ Thuật Quay Phim Điện Ảnh (700+ Thuật Ngữ DoP)
- **Tệp định nghĩa gốc:** [`cinematic-video-prompt/SKILL.md`](./cinematic-video-prompt/SKILL.md) (Dòng `L1–L214`) kèm 8 tệp từ điển trong [`cinematic-video-prompt/references/`](./cinematic-video-prompt/references/).
- **Nó là cái gì?**
  Là cuốn sổ tay đạo diễn hình ảnh (Director of Photography - DoP) chứa hơn **700 thuật ngữ điện ảnh tiếng Anh chuẩn xác** dành riêng cho các mô hình tạo ảnh/video AI (Veo 3, Google Flow, Kling, Sora, Runway, Midjourney, Hailuo, Luma).
- **Dùng để làm gì?**
  - Ghép câu lệnh (Prompt) chuẩn công thức điện ảnh: `[Shot size + Angle] + [Chủ thể + Ngoại hình] + [Hành động] + [Bối cảnh + Thời tiết] + [Ánh sáng] + [Camera Movement] + [Style + Màu] + [Mood] + [Kỹ thuật ống kính]`.
- **Thư viện Python:** Không dùng Python.
- **Cập nhật (`git pull`):**
  ```powershell
  cd "$env:USERPROFILE\.gemini\config\skills\cinematic-video-prompt"; git pull
  ```

---

### NHÓM C — 3 SKILLS THIẾT KẾ WEB, LANDING PAGE CHUYỂN ĐỔI & SEO/GEO

#### 6️⃣ `design-landingpage-vip-v2` — Thiết Kế Landing Page VIP Chuyển Đổi Cao (Có VietQR & CAPI)
- **Tệp định nghĩa gốc:** [`design-landingpage-vip-v2/SKILL.md`](./design-landingpage-vip-v2/SKILL.md) (Dòng `L1–L372`), kho [`design-landingpage-vip-v2/assets/icons/`](./design-landingpage-vip-v2/assets/icons/) (138 SVG icons) và 15 mẫu giao diện trong [`design-landingpage-vip-v2/system-design/`](./design-landingpage-vip-v2/system-design/).
- **Nó là cái gì?**
  Là bộ máy thiết kế Landing Page bán hàng, sự kiện, khóa học, mỹ phẩm, TMĐT hoàn chỉnh chỉ trong **1 file HTML độc lập**, tích hợp sẵn thanh toán VietQR tự động và hệ thống đo lường chuyển đổi quảng cáo bảo mật cao.
- **Dùng để làm gì?**
  - **Chọn nhanh 15 phong cách thiết kế (Design Systems):** `noti-vn` (Liquid Glass), `apple`, `shopee`, `tiktok-shop`, `shopify`, `hasaki-vn`, `tgdd`, `coolmate`, `stripe`, `linear`, `notion`...
  - **Tích hợp sẵn Form Đăng Ký + Thanh Toán QR VietQR động + Countdown + FAQ + Trang Chính Sách tự sinh.**
  - **Tracking Quảng Cáo Chuẩn Bảo Mật (Meta CAPI & TikTok Events API 2.0):** Thu thập `fbc`, `fbp`, `ttclid`, `ttp`, `utm_*`, `client_ip_address`, `event_id` gửi về Webhook Backend để chống lộ Access Token 100%.
- **Thư viện Python:** Không dùng Python.

---

#### 7️⃣ `wordpress-flatsome-designer` — Thiết Kế & Lập Trình Website WordPress Flatsome 3.x
- **Tệp định nghĩa gốc:** [`wordpress-flatsome-designer/SKILL.md`](./wordpress-flatsome-designer/SKILL.md) (Dòng `L1–L266`) kèm [`wordpress-flatsome-designer/references/ux-builder-shortcodes-reference.md`](./wordpress-flatsome-designer/references/ux-builder-shortcodes-reference.md).
- **Nó là cái gì?**
  Là kỹ năng chuyên biệt giúp AI viết mã giao diện WordPress chuẩn xác 100% theo kiến trúc **UX Builder Shortcodes** của theme **Flatsome 3.x**.
- **Dùng để làm gì?**
  - Xuất mã Shortcodes nguyên bản (`[section]`, `[row]`, `[col]`, `[ux_banner]`, `[ux_slider]`, `[ux_products]`, `[featured_box]`, `[accordion]`) để dán thẳng vào trang WordPress và kéo thả chỉnh sửa trực quan.
  - Viết code tùy biến Child Theme (`functions.php`, `style.css`, WooCommerce hooks/filters).
- **Thư viện Python:** Không dùng Python.

---

#### 8️⃣ `claude-seo` — Chuyên Gia Kiểm Toán SEO Toàn Diện & Tối Ưu AI Search (GEO v2.4.2)
- **Tệp định nghĩa gốc:** [`claude-seo/SKILL.md`](./claude-seo/SKILL.md) (Dòng `L1–L60`), [`claude-seo/requirements.txt`](./claude-seo/requirements.txt) (Dòng `L1–L28`), **26 sub-skills** trong [`claude-seo/skills/`](./claude-seo/skills/), **19 agents** trong [`claude-seo/agents/`](./claude-seo/agents/) và **60 scripts Python** trong [`claude-seo/scripts/`](./claude-seo/scripts/).
- **Nó là cái gì?**
  Là tổ hợp kiểm toán SEO & GEO (Generative Engine Optimization — tối ưu hiển thị trên Google AI Overviews, ChatGPT Search, Perplexity) quy mô lớn nhất trong bộ kỹ năng.
- **Dùng để làm gì?**
  - Kiểm toán toàn diện mọi website qua 19 chế độ lệnh (`/seo audit`, `/seo page`, `/seo technical`, `/seo content`, `/seo schema`, `/seo sitemap`, `/seo images`, `/seo geo`, `/seo agentic`, `/seo local`, `/seo maps`, `/seo ecommerce`, `/seo backlinks`, `/seo drift`, `/seo google`).
- **Thư viện Python cần cài:** `beautifulsoup4`, `requests`, `lxml`, `lxml_html_clean`, `urllib3`, `trafilatura`, `htmldate`, `courlan`, `playwright` (+ `openpyxl`, `matplotlib`, `numpy`, `weasyprint`, `google-api-python-client` khi dùng báo cáo nâng cao).
- **Cập nhật (`git pull`):**
  ```powershell
  cd "$env:USERPROFILE\.gemini\config\skills\claude-seo"; git pull
  ```

---

### NHÓM D — 1 SKILL ĐIỀU KHIỂN TRÌNH DUYỆT & TỰ ĐỘNG HÓA MẠNG XÃ HỘI

#### 9️⃣ `antigravity-browser-controller` — Điều Khiển Trình Duyệt Đa Profile & Auto-Post Facebook
- **Tệp định nghĩa gốc:** [`antigravity-browser-controller/SKILL.md`](./antigravity-browser-controller/SKILL.md) (Dòng `L1–L133`), tiện ích mở rộng [`antigravity-browser-controller/extension/`](./antigravity-browser-controller/extension/), và bộ công cụ Python trong [`antigravity-browser-controller/scripts/`](./antigravity-browser-controller/scripts/).
- **Nó là cái gì?**
  Là cầu nối điều khiển trực tiếp các trình duyệt đang mở trên máy tính của bạn (Cốc Cốc, Google Chrome, Microsoft Edge, Brave) thông qua kiến trúc **Omni-Browser Bridge** (WebSocket `:8765` + REST API `:8766` + giao thức Chrome DevTools Protocol CDP 1.3).
- **Dùng để làm gì?**
  - **Điều khiển song song Đa Profile (Multi-Profile):** Phân biệt và thao tác chính xác trên từng profile trình duyệt riêng biệt (`default`, `profile_1`, `profile_2`, `work`, `marketing`...).
  - **Nạp file Ảnh/Video ngầm không cần hộp thoại Windows:** Đẩy thẳng file `.png`, `.jpg`, `.mp4` từ ổ cứng vào ô tải file của web qua lệnh `DOM.setFileInputFiles`.
  - **Tự động đăng bài kèm Ảnh hoặc Video lên Facebook 1 chạm (`fb_auto_post.py`)** kèm chụp ảnh màn hình nghiệm thu.
- **Thư viện Python cần cài:** `pip install aiohttp websockets` (để chạy `scripts/server.py`).

---

## 📋 4. BẢNG ÁNH XẠ MINH CHỨNG NGUỒN (DUAL-SOURCE PROVENANCE)

| Hạng mục | Khẳng định / Nội dung giải thích | Loại Nguồn | Ở đâu — File/Sách nào — Trang/Dòng nào — Của tác giả nào | Phân tầng & Câu trích gốc |
| :--- | :--- | :--- | :--- | :--- |
| **Thư viện Python của `antigravity-browser-controller`** | Cần `aiohttp` và `websockets` cho Bridge Server; `fb_auto_post.py` & `cli.py` dùng `urllib.request` chuẩn | 📂 Nguồn Người Dùng | Ở đâu: `config/skills/antigravity-browser-controller/scripts` \| File: [`server.py`](./antigravity-browser-controller/scripts/server.py#L15-L16) \| Dòng `L15–L16` \| Của tác giả: Tài liệu nội bộ người dùng | 🟢 Tier 1 — `"from aiohttp import web"` & `"import websockets"` |
| **Thư viện Python của `claude-seo`** | Khai báo 16 thư viện trong `requirements.txt` (`beautifulsoup4`, `requests`, `lxml`, `playwright`, `trafilatura`...) | 📂 Nguồn Người Dùng & 🌐 GitHub | Ở đâu: `config/skills/claude-seo` \| File: [`requirements.txt`](./claude-seo/requirements.txt#L5-L28) \| Dòng `L5–L28` \| Của tác giả: Daniel Agrici (`AgricIDaniel`) | 🟢 Tier 1 — `"beautifulsoup4>=4.15.0,<5.0.0"` & `"playwright>=1.62.0,<2.0.0"` |
| **Thư viện Python của `ifixai-agent-auditor`** | `cli.py` chạy Zero-Dependency (thư viện chuẩn); Full SDK `pyproject.toml` dùng 10 gói (`pydantic`, `pyyaml`, `rich`...) | 📂 Nguồn Người Dùng | Ở đâu: `config/skills/ifixai-agent-auditor` \| File: [`cli.py`](./ifixai-agent-auditor/cli.py#L4-L17) (`L4–L17`) & [`pyproject.toml`](./ifixai-agent-auditor/pyproject.toml#L28-L39) (`L28–L39`) \| Của tác giả: iFixAi Contributors | 🟢 Tier 1 — `"iFixAi Independent Agent Auditor CLI (Zero-Dependency Fast Runner for Javis OS)."` |
| **Thư viện Python của `verified-source-researcher`, `lean-teamwork`, `video-storytelling`** | Chạy 100% bằng Python Standard Library (`urllib.request`, `json`, `argparse`, `pathlib`) | 📂 Nguồn Người Dùng | Ở đâu: `config/skills/` \| File: [`verified-source-researcher/cli.py`](./verified-source-researcher/cli.py#L8-L11), [`lean-teamwork/scripts/teamwork_bridge.py`](./lean-teamwork/scripts/teamwork_bridge.py#L8-L13), [`video-storytelling/cli.py`](./video-storytelling/cli.py#L7-L11) \| Dòng `L7–L13` \| Của tác giả: Nội bộ | 🟢 Tier 1 — `"import sys, os, argparse, json, urllib.request"` |
