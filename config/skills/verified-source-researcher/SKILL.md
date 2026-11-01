---
name: verified-source-researcher
description: "Kiểm toán 2 nguồn gốc (Người Dùng & Mạng/Sách) chống ảo giác AI: đủ 4 tọa độ, trích nguyên văn & bảng 6 cột."
group: "Kiểm Toán & Điều Phối AI"
---

# 🛡️ Verified Source Researcher & Dual-Source Provenance Engine (SKILL.md)

<!-- JAVIS_TRIGGER_ARCHIVE_START -->
## Khi nào dùng (Triggers & Ngữ cảnh kích hoạt đầy đủ)

> Hệ thống kiểm toán 2 nhóm nguồn gốc (Nguồn Người Dùng & Nguồn Mạng/Sách Báo), chống bịa đặt dữ liệu (Zero Hallucination), bắt buộc ghi rõ Ở đâu - File/Sách nào - Trang/Dòng nào - Của tác giả nào, và tự động lập bảng ánh xạ trích dẫn 6 cột. TRIGGERS: "kiểm tra nguồn", "chống ảo giác", "trích dẫn nguồn", "bài báo khoa học", "kiểm tra mã doi", "kiểm tra pmid", "kiểm tra isbn", "pubmed", "openalex", "europepmc", "arxiv", "biorxiv", "bảng ánh xạ nguồn 6 cột".
<!-- JAVIS_TRIGGER_ARCHIVE_END -->

Hệ thống kỹ năng chuyên sâu dành cho AI Agent trong việc nghiên cứu tài liệu chính thống, chống bịa đặt nguồn (Zero Hallucination), phân tách bạch **2 Nhóm Nguồn (`Nguồn Người Dùng` & `Nguồn Mạng/Sách Báo`)** và bắt buộc định vị chính xác **Ở đâu — File/Sách nào — Trang/Dòng/Mục nào — Của tác giả nào**.

---

## ⚖️ 1. 4 THIẾT LUẬT BẤT BIẾN VỀ NGUỒN TÀI LIỆU (THE 4 IRON LAWS)

Mọi bài viết, kịch bản, phân tích kỹ thuật, kế toán, pháp lý hoặc báo cáo nghiên cứu khi kích hoạt skill này bắt buộc phải tuân thủ 4 thiết luật:

### 1. Thiết Luật Phân Loại 2 Nguồn & Định Vị 4 Tọa Độ + Câu Trích Nguyên Văn (Dual-Source & 4-Coordinate Provenance)
> *"MỌI DẪN CHỨNG PHẢI THUỘC 1 TRONG 2 NHÓM NGUỒN (HOẶC KẾT HỢP CẢ 2 KHI ĐỐI CHIẾU) VÀ GHI RÕ: Ở ĐÂU — FILE/SÁCH NÀO — TRANG/DÒNG NÀO — CỦA TÁC GIẢ NÀO — KÈM CÂU TRÍCH NGUYÊN VĂN (<= 25 TỪ)"*

Mọi thông tin đưa vào bài bắt buộc phải chỉ rõ xuất xứ từ **Nguồn 1 (Người dùng)** hoặc **Nguồn 2 (Tìm trên mạng & Sách báo)** (hoặc kết hợp cả 2 nguồn khi đối chiếu dữ liệu nội bộ với quy chuẩn/luật/tài liệu hãng):

1. **📂 NGUỒN 1 — Nguồn Từ Người Dùng (User-Provided / Workspace Sources):**
   - Bao gồm: Các file PDF, Word, Excel, CSV, TXT, mã nguồn, bảng dữ liệu SQL/ERP, hợp đồng, sổ sách, hình ảnh do người dùng cung cấp hoặc nằm trong kho `sources/`, `wiki/` của dự án.
   - **Định dạng trích dẫn bắt buộc:**
     > `📂 [Nguồn Người Dùng] Ở đâu: <Đường dẫn thư mục / Kho dữ liệu / Bảng DB> | File nào: <Tên file chính xác có link> | Trang/Vị trí nào: <Trang số X (nếu PDF/Word) hoặc Dòng số L1–L2 (nếu Code/CSV/TXT) hoặc Sheet/Ô (nếu Excel) hoặc Chương/Mục> | Của tác giả nào: <Tên tác giả / Người lập ghi trong file (hoặc ghi "Tài liệu nội bộ người dùng" nếu file không ghi tên tác giả)> | Trích nguyên văn: "<Câu/số liệu gốc <= 25 từ>"`

2. **🌐📖 NGUỒN 2 — Nguồn Tìm Trên Mạng & Sách Báo / Văn Bản Luật (External Web, Books, Press & Legal Sources):**
   - Bao gồm: Sách chuyên khảo, giáo trình, cổ thư, bài báo khoa học (`Nature`, `PubMed`, `IEEE`, `OpenAlex`), báo chí chính thống, tài liệu kỹ thuật hãng, văn bản pháp luật.
   - **Định dạng trích dẫn bắt buộc:**
     - **Sách / Báo in / Giáo trình / Cổ thư:**
       > `📖 [Nguồn Sách/Báo] Ở đâu: <Nhà xuất bản / Kho lưu trữ / Mã ISBN> | Sách/Ấn phẩm nào: <Tên sách/ấn phẩm nguyên bản> | Trang/Chương nào: <Quyển/Chương X, Trang số Y, Mục Z> | Của tác giả nào: <Tên tác giả / Dịch giả (Năm xuất bản)> | Trích nguyên văn: "<Câu gốc trong sách <= 25 từ>"`
     - **Tìm trên Mạng / Báo điện tử / Tạp chí Khoa học / Tài liệu Online:**
       > `🌐 [Nguồn Mạng/Báo] Ở đâu: <Tên Website / Tạp chí + Link URL sống (HTTP 200) / DOI / PMID> | Bài/File nào: <Tiêu đề bài viết hoặc Tên file PDF/Docs online> | Trang/Mục nào: <Trang số X (nếu là PDF) hoặc Mục/Heading/Bảng số Y> | Của tác giả nào: <Tên tác giả / Nhóm nghiên cứu / Cơ quan phát hành (Ngày-Tháng-Năm công bố)> | Trích nguyên văn: "<Câu/số liệu gốc <= 25 từ>"`
     - **Văn bản Pháp luật / Kế toán / Thuế:**
       > `⚖️ [Nguồn Pháp Luật/Chính Sách] Ở đâu: <Cổng TTĐT Chính phủ / Bộ ngành + Link gốc> | Văn bản nào: <Số hiệu + Tên Luật/Nghị định/Thông tư> | Trang/Điều khoản nào: <Điều X, Khoản Y, Điểm Z (Trang số P nếu bản PDF)> | Của cơ quan nào: <Quốc hội / Chính phủ / Bộ Tài chính... (Ngày ban hành & Tình trạng hiệu lực)> | Trích nguyên văn: "<Câu gốc điều khoản <= 25 từ>"`

### 2. Thiết Luật Kiểm Chứng Sống & Cấm Bịa Số Trang/Tác Giả (Zero Hallucination & Live Verification)
> *"NO CITATION WITHOUT FRESH VERIFICATION EVIDENCE"*
- Tuyệt đối không tự bịa đặt tên tác giả, tên sách, số trang, số dòng, số điều luật, số liệu thống kê hoặc đường link URL/DOI giả mạo.
- Nếu file của người dùng hoặc bài web không phân trang (ví dụ file `.csv`, `.py`, `.md`, trang web HTML), bắt buộc ghi rõ **`Dòng số [L1–L2]`** hoặc **`Mục [Tên Heading], Đoạn [N]`** — **nghiêm cấm tự chế số trang giả (`Trang X`)**.
- Mọi đường link web trích dẫn bắt buộc phải được kiểm tra thực tế (phản hồi `HTTP 200 OK`). Mọi mã DOI/PubMed/ISBN bắt buộc phải tồn tại thực tế trên hệ thống CrossRef, NCBI hoặc OpenLibrary.
- Nếu không tìm thấy tài liệu chứng thực ở cả 2 nguồn: **Phải thẳng thắn tuyên bố `"⚠️ Không có thông tin / Chưa có tài liệu chính thống kiểm chứng"`, tuyệt đối không được tự suy diễn lấp liếm.**

### 3. Thiết Luật Phân Tầng Nguồn 4 Bậc (4-Tier Source Hierarchy cho Nguồn Ngoại Vi)
Mọi tài liệu tham khảo từ Nguồn 2 (Mạng & Sách báo) phải được phân loại và kiểm soát theo 4 bậc uy tín:
- **Tier 1 (Nguồn gốc tối thượng - Primary Ground Truth - Chiếm tối thiểu 70%):**
  - Nghiên cứu bình duyệt độc lập (Nature, Science, The Lancet, PubMed, IEEE) & Sách kinh điển có ISBN thật.
  - Kho lưu trữ chính phủ, văn bản quy phạm pháp luật gốc và tổ chức quốc tế (NASA NTRS, WHO, US CDC, NARA, World Bank, Cổng TTĐT Chính phủ).
  - Website & Docs chính thức của Nhà sản xuất / Chủ thể (Apple, Samsung, SAP, Microsoft, Google...).
- **Tier 2 (Nguồn thứ cấp uy tín cao - High-Authority Secondary):**
  - Báo chí điều tra chuẩn mực quốc tế (Reuters, Associated Press - AP, Bloomberg).
  - Tổ chức nghiên cứu thị trường uy tín (Pew Research, Gartner, Statista).
  - Sách chuyên khảo của các nhà xuất bản học thuật (Oxford, Cambridge, Wiley).
- **Tier 3 (Nguồn tham khảo cộng đồng - Community & Discussions):**
  - Wikipedia (chỉ dùng để xem dàn ý và lấy link nguồn sơ cấp ở mục Chú thích, không dẫn trực tiếp text Wikipedia).
  - Diễn đàn chuyên gia (GitHub Discussions, StackOverflow, r/science).
- **Tier 4 (Blacklist - Cấm tuyệt đối):**
  - Các trang trại nội dung (Content farms), web xào xáo bằng AI, blog tổng hợp vô danh, báo lá cải giật tít.

### 4. Thiết Luật Đa Ngôn Ngữ & Dịch Thuật Đồng Bộ (Multilingual Sourcing & Strict Localization)
- **Tra cứu không giới hạn ngôn ngữ:** AI được phép và khuyến khích tham chiếu nguồn gốc bằng tiếng Anh, tiếng Việt, tiếng Trung, tiếng Pháp, tiếng Đức, tiếng Nhật...
- **Bảo tồn dấu vết gốc (Original Traceability):** Tên file/tên sách gốc, tên tác giả, số trang/dòng, năm và link URL/DOI được giữ nguyên bản gốc để người đọc kiểm chứng độc lập.
- **Dịch thuật đồng bộ theo ngôn ngữ bài viết:** Toàn bộ nội dung dẫn chứng và cột giải trình lý do chọn nguồn **BẮT BUỘC** dịch sang đúng ngôn ngữ bài viết.

---

## 📚 2. QUY TẮC TRÌNH BÀY NGUỒN 3 TẦNG CHUYÊN NGHIỆP (SẠCH NỘI DUNG ĐỌC/NÓI — GHI NGUỒN NGẮN GỌN CUỐI BÀI — TÁCH BẢNG KIỂM CHỨNG KỸ THUẬT)

> ⚠️ **NGUYÊN TẮC CỐT LÕI (PHÂN BẠCH "NGUỒN THAM CHIẾU CÔNG KHAI" VS. "BẢNG KIỂM CHỨNG KỸ THUẬT CHO NGƯỜI DÙNG"):**
> Bài viết chuyên môn cần dẫn nguồn để tăng uy tín, nhưng phải ghi **ngắn gọn, sang trọng ở cuối bài**; tuyệt đối không chèn vào giữa câu đọc/nói và không làm lộ quy tắc/hạ tầng nội bộ!

1. **Tầng 1 — Trong Nội Dung Đọc & Nội Dung Nói (`Body Text`, `Voiceover`, `Báo Giá`, `Code`):**
   - **Phải sạch 100%:** **CẤM TUYỆT ĐỐI** ghi nguồn, chèn tọa độ file/dòng/trang, chèn URL dài hay nhãn `🟢/🟡/🔴` vào giữa đoạn văn đọc hoặc lời bình nói (`voiceover.txt`, `storyboard.csv`).
2. **Tầng 2 — Cuối Bài Viết Web / Blog / SEO / Tài Liệu Chuyên Môn Công Khai (Ghi Nguồn Ngắn Gọn, Chuyên Nghiệp):**
   - Ở cuối bài viết công khai, trình bày mục **"Tiêu chuẩn công nghệ & Tài liệu tham chiếu quốc tế"** (hoặc **"Tài liệu tham khảo"**) dưới dạng gạch đầu dòng **ngắn gọn, chuẩn xuất bản**:
     - `• **Tiêu chuẩn ANSI/ISA-95 (IEC 62264):** Mô hình phân tầng kiến trúc điều hành sản xuất và tích hợp đa tầng giữa MES với lõi ERP doanh nghiệp (*Part 1: Models & Terminology*).`
     - `• **Chuẩn truyền thông công nghiệp mở OPC-UA & Modbus TCP:** Giao thức chuẩn hóa kết nối thiết bị cảm biến IIoT, bộ điều khiển PLC và trung tâm giám sát SCADA (*OPC Foundation Specification v1.05*).`
     - `• **Tài liệu kỹ thuật SAP Business One v10.0:** Giao tiếp Service Layer REST API và DI API trong quy trình điều hành lệnh sản xuất, xuất nhập kho và giá thành dở dang (*SAP Official Help Portal*).`
   - ❌ **CẤM TUYỆT ĐỐI** ghi chữ `Bảng Ánh Xạ Nguồn Cấp 1`, `Quy trình 5 Chốt chặn`, `RULE[user_global]`, nhãn `🟢/🟡/🔴` hay tên DB/IP/đường dẫn file nội bộ (`DB SBO_MAIN_PROD`, `ezoffice.vn:8283`, `C:\Users\...`) vào bài viết công khai.
3. **Tầng 3 — Bảng Ánh Xạ Nguồn 6 Cột Dành Riêng Cho Người Dùng Tra Cứu (Ngoài Khung Chat Hoặc Tách File Thứ 2):**
   - Toàn bộ tọa độ kiểm chứng kỹ thuật chi tiết (`Ở đâu — File nào — Trang/Dòng nào — Tác giả — Câu trích nguyên văn`) **chỉ trả lời riêng cho người dùng trên khung Chat** hoặc tách thành **File thứ 2 độc lập (`<Ten_San_Pham>_THAM_CHIEU_NGUON.md`)** theo mẫu 6 cột dưới đây:

```markdown
## 📚 BẢNG ĐỐI CHIẾU MINH CHỨNG 2 NGUỒN (NGƯỜI DÙNG & MẠNG/SÁCH BÁO)

| Hạng Mục / Luận Điểm | Loại Nguồn (`Người Dùng` / `Mạng-Sách Báo`) | Ở Đâu (Thư mục / NXB / Website / Link / DOI) | File Nào / Sách Nào / Văn Bản Nào | Trang Nào / Dòng Nào / Điều Khoản Nào | Của Tác Giả / Cơ Quan Nào & Câu Trích Nguyên Văn (`"..."` <= 25 từ) |
| :--- | :---: | :--- | :--- | :--- | :--- |
| **1. [Luận điểm A từ tài liệu người dùng]** | 📂 **Nguồn Người Dùng** | `<WORKSPACE_DIR>\JavisOS\tai lieu\KHÓA HỌC JAVIS OS\` | [`Bo-30-Prompt-AI.pdf`](file:///WORKSPACE_DIR/JavisOS/tai%20lieu/KH%C3%93A%20H%E1%BB%8CC%20JAVIS%20OS/Bo-30-Prompt-AI.pdf) | **Trang 14, Mục 3.2 (Nhóm Prompt Đóng Gói)** | **Tác giả: Khóa học Javis OS** — *"Offer 6 viên gạch: Kết quả mơ ước A->B, Cấu phần chính, 3 Bonus, Khử rủi ro, Khan hiếm thật, Neo giá"* |
| **2. [Luận điểm B từ mã nguồn người dùng]** | 📂 **Nguồn Người Dùng** | `<WORKSPACE_DIR>\JavisOS\server\` | [`team_runner.py`](file:///WORKSPACE_DIR/JavisOS/server/team_runner.py#L138-L152) | **Dòng L138–L152 (`WORK_TOOLS_NOTE`)** | **Tác giả: Nội bộ dự án JavisOS** — *"WORK_TOOLS_NOTE = ... Mandatory tool execution rules for worker subagents"* |
| **3. [Luận điểm C từ Sách xuất bản]** | 📖 **Nguồn Sách/Báo** | NXB Farrar, Straus and Giroux \| ISBN: `9780374275631` \| [OpenLibrary](https://openlibrary.org/isbn/9780374275631) | *Thinking, Fast and Slow* (*Tư duy Nhanh và Chậm*) | **Phần 1, Chương 3, Trang 39–49** | **Tác giả: Daniel Kahneman (2011)** — *"System 1 operates automatically and quickly, with little or no effort and no sense of voluntary control."* |
| **4. [Luận điểm D từ Báo khoa học trên mạng]** | 🌐 **Nguồn Mạng/Báo** | Tạp chí *Nature* \| DOI: [`10.1038/s41586-021-03819-2`](https://doi.org/10.1038/s41586-021-03819-2) | *Highly accurate protein structure prediction with AlphaFold* | **Trang 583–589, Bảng 1 & Hình 2** | **Tác giả: John Jumper, Demis Hassabis et al. — DeepMind (15/07/2021)** — *"AlphaFold regularly achieves accuracy competitive with experiment."* |
```

---

## 💻 3. HƯỚNG DẪN SỬ DỤNG BỘ CÔNG CỤ PYTHON KIỂM ĐỊNH

Tại thư mục của skill, Agent có thể chạy bộ công cụ tự động để thẩm định nguồn:

```bash
# 1. Kiểm tra một đường link web có sống thực tế không (HTTP 200):
python cli.py check-url "https://www.nature.com"

# 2. Xác thực một mã DOI trên hệ thống học thuật CrossRef:
python cli.py check-doi "10.1038/s41586-021-03819-2"

# 3. Xác thực một mã PubMed ID trên cơ sở dữ liệu y khoa NCBI:
python cli.py check-pmid "32832599"

# 4. Xác thực một mã ISBN sách xuất bản thật qua Open Library:
python cli.py check-isbn "9780374275631"

# 5. Tìm kiếm sách của tác giả nổi tiếng trên cơ sở dữ liệu quốc tế:
python cli.py search-book --title "Thinking Fast and Slow" --author "Daniel Kahneman"

# 6. Quét toàn bộ một file markdown bài viết để kiểm toán tính hợp lệ của tất cả link:
python cli.py audit-file "duong_dan_bai_viet.md"
```

---

## 🗂️ 4. TÀI LIỆU THAM CHIẾU & WHITELIST CHUYÊN NGÀNH

- [Danh mục Khoa học & Công nghệ](./references/01_academic_science.md)
- [Danh mục Y tế & Sức khỏe](./references/02_medical_health.md)
- [Danh mục Lịch sử & Pháp luật](./references/03_history_law_culture.md)
- [Danh mục Thông số Công nghệ & Thương mại](./references/04_tech_ecommerce.md)
- [Danh mục Sách kinh điển & Tác giả nổi tiếng](./references/06_authoritative_books_and_authors.md)
- [Danh sách đen các trang trại nội dung (Blacklist)](./references/05_blacklist_domains.md)
