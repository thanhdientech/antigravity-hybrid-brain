---
name: tu-vi-bat-tu-than-so-hoc
description: "Luận giải Tử Vi Đẩu Số (iztro-py), Bát Tự 24 Tiết Khí & Thần Số Học Pythagoras: xuất 10 hồ sơ SOP V3.0 & tinh bàn HTML."
group: "Huyền Học & Khai Vấn"
---

# Hệ Thống Luận Giải Toàn Diện Tử Vi Đẩu Số • Bát Tự 24 Tiết Khí • Thần Số Học (`SOP V3.0`)

<!-- JAVIS_TRIGGER_ARCHIVE_START -->
## Khi nào dùng (Triggers & Ngữ cảnh kích hoạt đầy đủ)

> Kích hoạt khi người dùng yêu cầu lập lá số và luận giải Tử Vi Đẩu Số (12 cung, 14 chính tinh, Tứ Hóa, Lai Nhân Cung, Đại Vận, Tiểu Hạn), lập Tứ Trụ Bát Tự Tử Bình chuẩn 24 Tiết Khí (Nhật Chủ, Dụng Thần, Hỷ Thần, Kỵ Thần, Thập Thần, Nạp Âm 60 Hoa Giáp), tính Thần Số Học Pythagoras / Nhân Số Học (Đường Đời, Sứ Mệnh, Linh Hồn, Nhân Cách, 4 Đỉnh Kim Tự Tháp, Biểu Đồ Ngày Sinh 3x3 & Mũi Tên), thẩm định 7 Đại Họa Sinh Mạng, xem tuổi Hôn Phối / Bạn Làm Ăn / Kim Lâu / Hoang Ốc / Tam Tai / Căn Tu Tâm Linh, hoặc xuất trọn bộ 10 tệp Hồ sơ Mệnh Thư SOP V3.0 kèm bản đồ Tinh bàn HTML 12 cung tương tác.
> TRIGGERS: "tử vi", "tu vi", "tử vi đẩu số", "tu vi dau so", "lá số tử vi", "la so tu vi", "bát tự", "bat tu", "tứ trụ", "tu tru", "tử bình", "tu binh", "dụng thần", "dung than", "thần số học", "than so hoc", "nhân số học", "nhan so hoc", "pythagoras", "numerology", "iztro", "mệnh thư", "menh thu", "lai nhân cung", "kim tự tháp thần số học", "kim lâu", "hoang ốc", "tam tai", "hôn phối", "căn tu", "7 đại họa".
<!-- JAVIS_TRIGGER_ARCHIVE_END -->

## 1. Thiết Luật Chống Ảo Giác Ngành #11 (`GEMINI.md` — Cấm Tự Nhẩm Bằng LLM)

1. **Cấm tự đổi lịch Dương $\leftrightarrow$ Âm, cấm tự nhẩm Can Chi / Cục số / An sao / Cộng số bằng LLM:** Bắt buộc chạy động cơ tất định [`scripts/destiny_pipeline.py`](./scripts/destiny_pipeline.py) trước khi viết bất kỳ dòng luận giải nào.
2. **Kiểm tra đủ Dữ kiện Đầu vào Cứng (`Hard Stop Chốt 1B`):** Phải có đủ **Họ tên khai sinh có dấu**, **Giới tính**, **Ngày-Tháng-Năm sinh Dương lịch**, và **Giờ-Phút sinh** (nếu thiếu giờ sinh thì chỉ được tính Thần Số Học & 3 trụ Năm-Tháng-Ngày của Bát Tự, tuyệt đối không bịa giờ sinh để an lá số Tử Vi).
3. **Tách bạch 3 Tầng Sao Tử Vi:** Dựa trên bảng trích xuất của `destiny_pipeline.py`, phân biệt rạch ròi **Sao Tọa Thủ** vs. **Sao Xung Chiếu / Tam Hợp Hội Chiếu** vs. **Sao Giáp Cung**; nghiêm cấm viết gộp sao chiếu vào chung ngoặc đơn với sao tọa thủ.
4. **Cắt Trụ Tháng Bát Tự theo 24 Tiết Khí:** Luôn lấy Trụ Tháng từ động cơ `lunar_python` (cắt theo giờ giao Tiết khí chính xác đến từng giây), không bao giờ lấy theo ngày mùng 1 Âm lịch.

---

## 2. Bảng Điều Phối Công Cụ CLI & Kho Tri Thức (`scripts/` & `references/`)

| Hạng Mục Thực Thi | Tệp Công Cụ / Tham Chiếu | Chức Năng Cốt Lõi |
| :--- | :--- | :--- |
| **Động cơ An Sao, Bát Tự & Thần Số Học** | [`scripts/destiny_pipeline.py`](./scripts/destiny_pipeline.py) | Chạy Offline (`iztro-py` `vi-VN` + `lunar_python` 24 Tiết Khí + Pythagoras/Phillips): xuất `01_Ho_So_Goc_*_TOOL.md`, `Ban_Do_La_So_*_TOOL.html` & `facts_*.json`. |
| **Trình Kiểm Toán Độc Lập 13 Bước** | [`scripts/qa_dossier_auditor.py`](./scripts/qa_dossier_auditor.py) | Đối chiếu tự động toàn bộ file `.md` với `facts_*.json` (Âm Dương, Cục số, Trụ Tháng Tiết Khí, Đường Đời, Năm Cá Nhân, cấm `0%`, Mệnh Thư `>= 3,000` từ). |
| **Mẫu Dữ Liệu Đầu Vào Chuẩn JSON** | [`examples/sample_profiles.json`](./examples/sample_profiles.json) | Khung JSON mẫu ẩn danh cho chế độ chạy 1 người hoặc chạy hàng loạt cho cả gia đình / đội nhóm. |
| **SOP V3.0: Kiến Trúc 10 File & Quy Tắc** | [`references/01-sop-v3-kien-truc-10-file-va-quy-tac-bat-bien.md`](./references/01-sop-v3-kien-truc-10-file-va-quy-tac-bat-bien.md) | 6 nguyên tắc bất biến, cấu trúc chi tiết 10 tệp hồ sơ cá nhân (`00`..`09`), phân tầng Người lớn vs Trẻ nhỏ & mẫu Prompt chuyên sâu. |
| **Chuyên Đề 7 Đại Họa, Hôn Phối & Căn Tu** | [`references/02-chuyen-de-7-dai-hoa-sinh-mang-va-hon-phoi-can-tu.md`](./references/02-chuyen-de-7-dai-hoa-sinh-mang-va-hon-phoi-can-tu.md) | Ma trận thẩm định 7 đại họa sinh mạng + Bộ sao cứu giải; Hôn phối, Bạn làm ăn, Kim Lâu/Hoang Ốc/Tam Tai & Thẩm tra Căn tu tâm linh. |
| **Thuật Toán Thần Số Học Song Hệ & API** | [`references/03-thuat-toan-than-so-hoc-song-he-va-api.md`](./references/03-thuat-toan-than-so-hoc-song-he-va-api.md) | Công thức 18 chỉ số Pythagoras Quốc Tế (`Goodwin/Decoz`), quy tắc tách chữ `Y`, Nhân Số Học (`Phillips` 3x3 & 8 Mũi tên) & tham chiếu đa hệ API. |
| **Cổ Thư Tử Vi – Bát Tự & Trích Dẫn Cấp 1** | [`references/04-co-thu-tu-vi-bat-tu-va-quy-chuan-trich-dan.md`](./references/04-co-thu-tu-vi-bat-tu-va-quy-chuan-trich-dan.md) | Phương pháp định Dụng Thần (Điều Hậu / Phù Ức / Thông Quan), danh mục Cổ thư chuẩn Chốt 2 & quy tắc trình bày nguồn 3 tầng. |

---

## 3. Quy Trình Thực Thi Chuẩn 4 Bước Cuốn Chiếu (`First-Time Right`)

### Bước 1 — Chạy Động Cơ Lập Hồ Sơ Kỹ Thuật Gốc & Tinh Bàn HTML (`Exit code 0`)
- **Chạy cho 1 cá nhân:**
  ```powershell
  python "$HOME/.gemini/config/skills/tu-vi-bat-tu-than-so-hoc/scripts/destiny_pipeline.py" --name "Nguyễn Văn An" --dob 1990-08-15 --time 10:30 --gender Nam --birthplace "TP. Hồ Chí Minh" --output-dir "<thu_muc_xuat>" --target-year 2026
  ```
- **Chạy cho cả gia đình / nhiều thành viên (tách thư mục con chuẩn SOP V3.0):**
  ```powershell
  python "$HOME/.gemini/config/skills/tu-vi-bat-tu-than-so-hoc/scripts/destiny_pipeline.py" --input "<profiles.json>" --output-dir "<thu_muc_xuat>" --target-year 2026 --group-by-member
  ```

### Bước 2 — Khóa Facts & Định Dụng Thần Bát Tự
- Đọc tệp `01_Ho_So_Goc_<Slug>_TOOL.md` và `facts_<Slug>.json` vừa xuất làm **Nguồn Sự Thật Duy Nhất (Single Source of Truth)**.
- Xác định cường nhược Nhật Chủ theo Lệnh Tháng (Tiết khí) để chốt **Dụng Thần — Hỷ Thần — Kỵ Thần** theo hướng dẫn tại [`references/04-co-thu-tu-vi-bat-tu-va-quy-chuan-trich-dan.md`](./references/04-co-thu-tu-vi-bat-tu-va-quy-chuan-trich-dan.md).

### Bước 3 — Biên Soạn Luận Giải Cuốn Chiếu Theo SOP V3.0
- Nếu người dùng hỏi nhanh / xem lá số tóm tắt: Xuất bảng Tinh bàn + Tứ Trụ + Thần Số Học kèm luận giải cốt lõi và tọa độ Cổ thư.
- Nếu người dùng yêu cầu **Hồ sơ Toàn diện SOP V3.0**: Viết cuốn chiếu từng thành viên đủ **10 tệp `.md`** (`00`..`09`) theo đặc tả tại [`references/01-sop-v3-kien-truc-10-file-va-quy-tac-bat-bien.md`](./references/01-sop-v3-kien-truc-10-file-va-quy-tac-bat-bien.md) + **2 tệp Chuyên đề Trung tâm** (nếu làm cho gia đình) theo [`references/02-chuyen-de-7-dai-hoa-sinh-mang-va-hon-phoi-can-tu.md`](./references/02-chuyen-de-7-dai-hoa-sinh-mang-va-hon-phoi-can-tu.md).

### Bước 4 — Kiểm Toán Độc Lập Bằng CLI (`Exit code 0`)
- Chạy trình kiểm toán độc lập để bắt sạch mọi sai lệch số liệu trước khi bàn giao:
  ```powershell
  python "$HOME/.gemini/config/skills/tu-vi-bat-tu-than-so-hoc/scripts/qa_dossier_auditor.py" --dossier-dir "<thu_muc_xuat>" --facts-dir "<thu_muc_chua_facts_json>"
  ```
