# 🛡️ VERIFIED SOURCE RESEARCHER & FACT-CHECKING SUITE

Bộ công cụ và kỹ năng kiểm toán nguồn gốc, chống bịa đặt dữ liệu (Zero Hallucination), tra cứu nguồn đa ngôn ngữ quốc tế (Tier 1-4) và tự động lập **Bảng ánh xạ nguồn giải trình chi tiết theo từng phân đoạn** cho AI Agent.

---

## 🌟 TÍNH NĂNG NỔI BẬT

1. **Thiết Luật Zero-Hallucination & Live Verification:** Chống hoàn toàn hiện tượng AI tự bịa bài báo, tự chế số liệu hoặc sinh link chết 404. 100% nguồn được kiểm tra trực tiếp qua HTTP HEAD/GET hoặc API CrossRef/NCBI.
2. **Quy Chuẩn Nguồn 4 Tầng (Tier 1 đến Tier 4):** Ưu tiên tuyệt đối các nguồn sơ cấp học thuật, dữ liệu chính phủ và trang thông số chính thức của hãng sản xuất.
3. **Ánh Xạ Nguồn Theo Từng Phân Đoạn (Section-by-Section Mapping):** Mọi bài viết sau khi hoàn thành đều có bảng giải trình rõ ràng: *Phần 1 lấy ở đâu, Phần 2 lấy ở đâu, và TẠI SAO lại chọn nguồn đó*.
4. **Tra Cứu Đa Ngôn Ngữ & Dịch Thuật Đồng Bộ:** Tra cứu mọi nguồn tài liệu chính thống toàn cầu bằng tiếng Anh, tiếng Việt, tiếng Trung, tiếng Pháp... và tự động dịch chuẩn xác toàn bộ dẫn chứng, giải trình sang ngôn ngữ mà bài viết đang trình bày.

---

## 🚀 CÁCH SỬ DỤNG BẰNG DÒNG LỆNH (CLI)

```bash
# Di chuyển vào thư mục của skill:
cd "%USERPROFILE%\.gemini\config\skills\verified-source-researcher"

# 1. Kiểm tra một đường link web có sống thực tế không (HTTP 200 OK):
python cli.py check-url "https://www.nature.com"

# 2. Xác thực một mã DOI trên cơ sở dữ liệu học thuật quốc tế CrossRef:
python cli.py check-doi "10.1038/s41586-021-03819-2"

# 3. Xác thực một mã PubMed ID trên thư viện y khoa NCBI:
python cli.py check-pmid "32832599"

# 4. Xác thực một mã ISBN sách xuất bản thật qua Open Library:
python cli.py check-isbn "9780374275631"

# 5. Tìm kiếm sách của tác giả nổi tiếng trên cơ sở dữ liệu quốc tế:
python cli.py search-book --title "Thinking Fast and Slow" --author "Daniel Kahneman"
python cli.py search-book --title "Marketing Management" --author "Philip Kotler"

# 6. Quét toàn bộ một bài viết markdown để kiểm toán tất cả các đường link trích dẫn:
python cli.py audit-file "duong_dan_bai_viet.md"
```

---

## 📁 CẤU TRÚC THƯ MỤC

```text
verified-source-researcher/
├── SKILL.md                          # Hướng dẫn nhận diện và quy tắc vận hành cho AI Agent
├── README.md                         # Tài liệu hướng dẫn sử dụng (File này)
├── cli.py                            # Giao diện dòng lệnh 1-chạm
├── scripts/                          # Bộ công cụ Python kiểm định tự động
│   ├── link_validator.py             # Quét kiểm tra HTTP 200, phát hiện link chết
│   ├── academic_checker.py           # Xác thực DOI (CrossRef) và PMID (NCBI PubMed)
│   ├── book_checker.py               # Tra cứu và xác thực sách xuất bản (Open Library API)
│   └── citation_mapper.py            # Tạo bảng ánh xạ trích dẫn 5 cột giải trình từng phần
├── references/                       # Danh bạ nguồn chính thống và danh sách đen
│   ├── 01_academic_science.md        # Nguồn Khoa học, Không gian & Công nghệ
│   ├── 02_medical_health.md          # Nguồn Y tế, Sức khỏe (Chuẩn YMYL)
│   ├── 03_history_law_culture.md     # Nguồn Lịch sử, Pháp luật, Hồ sơ giải mật
│   ├── 04_tech_ecommerce.md          # Trang thông số chính thức của các hãng sản xuất
│   ├── 05_blacklist_domains.md       # Danh sách đen các content farm và blog xào xáo AI
│   └── 06_authoritative_books_and_authors.md # Sách kinh điển và tác giả nổi tiếng toàn cầu
└── templates/
    └── section_citation_template.md  # Mẫu bảng ánh xạ trích dẫn 5 cột chuẩn hoá
```

---

## 🤖 TÍCH HỢP VÀO AI AGENT ANTIGRAVITY

Skill này có thể được triệu tập tự động khi người dùng yêu cầu:
- *"Nghiên cứu về đề tài [X], kiểm tra nguồn chính thống và lập bảng trích dẫn từng phần."*
- *"Kiểm tra lại toàn bộ đường link trong bài viết này xem có link nào bịa đặt hoặc chết không."*
- *"Viết bài về [Chủ đề] kèm giải trình rõ tại sao lại tham chiếu các nguồn đó."*
