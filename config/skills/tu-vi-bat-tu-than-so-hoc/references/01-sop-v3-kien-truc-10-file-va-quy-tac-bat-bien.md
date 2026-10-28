# SOP V3.0: Kiến Trúc 10 Tệp Hồ Sơ Luận Giải Đông – Tây & 6 Nguyên Tắc Bất Biến

## 1. Sáu Nguyên Tắc Bất Biến Chống Ảo Giác Mệnh Lý (`Zero-Hallucination Rules`)

1. **Nguyên tắc 1 — Cấm tự nhẩm toán học & lịch pháp bằng LLM:**
   - Tuyệt đối không tự đổi ngày Dương lịch sang Âm lịch, không tự nhẩm Cục số Tử Vi, không tự cộng tay chỉ số Thần Số Học.
   - Bắt buộc trích xuất 100% dữ kiện cứng từ `scripts/destiny_pipeline.py` (`iztro-py` + `lunar_python` + `Pythagoras Dual-Engine`).
2. **Nguyên tắc 2 — Cắt Trụ Tháng Bát Tự chuẩn 24 Tiết Khí (`Solar Terms`):**
   - Trụ Tháng của Bát Tự bắt buộc cắt theo **giờ giao 12 Tiết đầu tháng** (*Lập Xuân, Kinh Trập, Thanh Minh, Lập Hạ, Mang Chủng, Tiểu Thử, Lập Thu, Bạch Lộ, Hàn Lộ, Lập Đông, Đại Tuyết, Tiểu Hàn*), tuyệt đối không cắt theo ngày mùng 1 Âm lịch như Tử Vi.
   - Giới tính Âm/Dương Nam Nữ phải căn cứ vào Thiên Can năm sinh: Can Dương (*Giáp, Bính, Mậu, Canh, Nhâm*) $\rightarrow$ Dương Nam / Dương Nữ; Can Âm (*Ất, Đinh, Kỷ, Tân, Quý*) $\rightarrow$ Âm Nam / Âm Nữ.
3. **Nguyên tắc 3 — Chuẩn hóa công thức Thần Số Học Pythagoras:**
   - **Số Đường Đời (Life Path):** Rút gọn riêng từng thành phần Ngày, Tháng, Năm (giữ Master `11, 22, 33`), sau đó cộng tổng và rút gọn (chỉ giữ `11/2, 22/4, 33/6` khi tổng thực sự đi qua `11, 22, 33`).
   - **Tách Nguyên âm / Phụ âm chữ `Y`:** Áp dụng quy tắc âm tiết ngữ cảnh (`is_vowel_y`) đồng thời ghi chú số đối chiếu trường phái `Y` luôn là nguyên âm để minh bạch tuyệt đối.
4. **Nguyên tắc 4 — Phân tầng tâm lý & sư phạm theo Độ Tuổi (Người Lớn vs. Trẻ Nhỏ):**
   - **Với Người lớn ($\ge 18$ tuổi):** Phân tích thẳng vào Quản trị sự nghiệp, Dòng tiền & Đầu tư, Hôn nhân, Quản trị rủi ro pháp lý – thương trường và Kỷ luật sức khỏe.
   - **Với Trẻ nhỏ ($< 18$ tuổi):** Tuyệt đối không luận giải sáo rỗng kiểu "vợ chồng xung khắc, đấu đá quan trường" ở thời điểm hiện tại. Chuyển hóa thành **Cẩm nang Nuôi dạy Con cho Cha Mẹ**: Cung *Quan Lộc* $\rightarrow$ Phương pháp học tập & chọn ngành đại học; Cung *Tài Bạch* $\rightarrow$ Giáo dục tư duy tài chính sớm; Cung *Phu Thê* $\rightarrow$ Hình mẫu bạn đời tương lai sau tuổi trưởng thành; Cung *Tật Ách* $\rightarrow$ Miễn dịch, dinh dưỡng & an toàn thể chất.
5. **Nguyên tắc 5 — Tách bạch 3 Tầng Sao Tử Vi (`Strict Star Extraction`):**
   - Phân định rạch ròi: **Sao Tọa Thủ** (đóng trực tiếp trong cung), **Sao Tam Hợp / Xung Chiếu** (từ 2 cung tam hợp `+4, +8` và cung đối `+6` chiếu về), và **Sao Giáp Cung** (2 cung liền kề `-1, +1` kẹp hai bên).
   - Nghiêm cấm viết gộp sao chiếu hoặc sao giáp vào chung ngoặc đơn với sao tọa thủ. Khi cung có 2 chính tinh đồng cung (ví dụ *Vũ Khúc + Thiên Tướng*, *Tử Vi + Phá Quân*), bắt buộc ghi đủ cả 2 chính tinh kèm độ sáng (*Miếu/Vượng/Đắc/Lợi/Bình/Bất/Hãm*) và *Tứ Hóa*.
6. **Nguyên tắc 6 — Kỷ luật Thẩm mỹ Văn bản & Tách Nguồn 3 Tầng:**
   - `100%` tiếng Việt chuẩn mực, tên thư mục và tiêu đề viết có dấu trang trọng.
   - Phần nội dung đọc chính thức sạch sẽ, mạch lạc; cuối bài có mục tham khảo Cổ thư/Tài liệu chuẩn xuất bản; Bảng kiểm chứng kỹ thuật 6 cột trả riêng trên khung Chat hoặc file tham chiếu độc lập.

---

## 2. Cấu Trúc Thư Mục Xuất Bản Hồ Sơ Toàn Diện (`SOP V3.0 Directory Tree`)

```text
[Thu_Muc_Du_An_Ho_So]/
├── MASTER_INDEX_HO_SO_TONG_QUAN.md
├── 00_DANH_GIA_TOAN_DIEN_AN_NGUY_SINH_MANG_VA_TAI_NAN_GIA_DINH.md   (Khi lập cho gia đình)
├── 00_CHUYEN_DE_HON_NHAN_HOP_TAC_LAM_AN_VA_CAN_TU_TAM_LINH.md       (Khi lập cho gia đình)
└── [Họ Và Tên Có Dấu]/
    ├── 00_TONG_HOP_COT_LOI_VA_LUU_Y_QUAN_TRONG.md
    ├── 01_Ho_So_Goc_[Slug]_TOOL.md
    ├── 02_Menh_Thu_Tong_Quan_8_Chuong.md
    ├── 03_Chi_Tiet_14_Cung_Tu_Vi_Toan_Tap.md
    ├── 04_Lo_Trinh_10_Nam_Va_Dai_Van_Cuoc_Doi.md
    ├── 05_Tu_Vi_Hang_Nam_Va_12_Thang_Chi_Tiet.md
    ├── 06_Ban_Do_Than_So_Hoc_Chuyen_Sau_18_Chi_So.md
    ├── 07_Tuong_Hop_Gia_Dinh_Va_Hoa_Giai_Xung_Khac.md
    ├── 08_Cam_Nang_Thuc_Chien_Va_Loi_Khuyen_Hang_Ngay.md
    ├── 09_Chuyen_De_Suc_Khoe_Dong_Y_Va_Phong_Benh.md
    └── Ban_Do_La_So_[Slug]_TOOL.html
```

---

## 3. Đặc Tả Chi Tiết Nội Dung Từng Tệp Từ `00` Đến `09` (`10 Core Dossier Files`)

### Tệp `00` — `00_TONG_HOP_COT_LOI_VA_LUU_Y_QUAN_TRONG.md` (Tóm tắt điều hành)
- **Phần I:** Bảng Thẻ Căn Cước Mệnh Lý (Dương lịch, Âm lịch, Âm/Dương Nam Nữ, Cục số, Mệnh/Thân/Lai Nhân Cung, Tứ Trụ 24 Tiết Khí, Nhật Chủ, Dụng/Hỷ/Kỵ Thần, Đường Đời, Sứ Mệnh, Linh Hồn, Nhân Cách, Năm Cá Nhân).
- **Phần II:** 3 Đòn Bẩy Thành Công Trời Ban & Ngành Nghề Mũi Nhọn (giao thoa Chính tinh Mệnh/Quan/Tài + Dụng thần Bát Tự + Đường Đời/Sứ Mệnh).
- **Phần III:** 3 Cạm Bẫy Định Mệnh ("Gót chân Achilles") cần quản trị suốt đời.
- **Phần IV:** Giám định An nguy Sinh mạng & Bảng đánh giá **7 Đại Họa Tai Nạn** kèm Bộ sao cứu giải.
- **Phần V:** Trọng tâm Chiến lược Hành động trong năm mục tiêu (Tiểu hạn + Lưu niên + Năm Cá Nhân).
- **Phần VI:** Bí pháp Cải mệnh Thực chứng (Màu sắc, Phương hướng, Con số, Vật liệu, Thói quen hành vi bù Dụng thần).
- **Phần VII:** Hôn phối, Bạn làm ăn, Các năm tốt trọng đại (cưới hỏi, sinh con, khởi nghiệp theo bảng Kim Lâu/Hoang Ốc/Tam Tai 10 năm) & Thẩm tra Căn tu tâm linh.

### Tệp `01` — `01_Ho_So_Goc_[Slug]_TOOL.md` (Hồ sơ kỹ thuật Ground Truth)
- Được sinh trực tiếp 100% bởi `scripts/destiny_pipeline.py`, giữ nguyên vẹn các bảng Tứ Trụ Bát Tự 24 Tiết Khí, Đại Vận Bát Tự, Tinh Bàn 12 Cung Tọa Thủ, Bảng Đối Chiếu Tam Hợp/Xung Chiếu/Giáp Cung, 18 chỉ số Thần Số Học, Biểu đồ 3x3 & Niên vận 10 năm.

### Tệp `02` — `02_Menh_Thu_Tong_Quan_8_Chuong.md` (Mệnh Thư Văn Học Triết Lý)
- **Thể thức bắt buộc:** Độ dài tối thiểu **`>= 3,000` từ** (khuyến nghị `4,000–6,000` từ), viết **100% bằng văn xuôi nghệ thuật sâu sắc**, **TUYỆT ĐỐI KHÔNG dùng dấu gạch đầu dòng (`-`, `*`, `+`)** trong toàn bộ thân bài 8 chương (trình kiểm toán `qa_dossier_auditor.py` sẽ tự động bắt lỗi nếu có bullet hoặc dưới 3.000 từ).
- **Cấu trúc 8 Chương chuẩn:**
  - *Lời Dẫn Nhập:* Khế ước Thiên – Địa – Nhân thời khắc chào đời.
  - *Chương I:* Bản Nguyên Chân Hồn & Cốt Cách Ngũ Hành Nạp Âm – Cục Số.
  - *Chương II:* Cấu Trúc Khí Tiết Tứ Trụ Bát Tự & Bí Pháp Dụng Thần Cân Bằng Mệnh Cục.
  - *Chương III:* Tinh Bàn Tử Vi Đẩu Số – Khí Chất Cung Mệnh & Hành Trình Cung Thân.
  - *Chương IV:* Lai Nhân Cung & Cội Nguồn Nhân Quả Kiến Tạo Cơ Đồ.
  - *Chương V:* Mật Mã Pythagoras – Bản Lĩnh Đường Đời, Tiếng Gọi Linh Hồn & Sứ Mệnh.
  - *Chương VI:* Bốn Đỉnh Cao Kim Tự Tháp & Những Khúc Cua Thử Thách Trưởng Thành.
  - *Chương VII:* Gia Đạo, Nhân Duyên & Nghệ Thuật Hòa Giải Xung Khắc.
  - *Chương VIII:* Lộ Trình Tiến Hóa Tâm Thức & Lời Chúc Phúc Trao Gửi Tương Lai.

### Tệp `03` — `03_Chi_Tiet_14_Cung_Tu_Vi_Toan_Tap.md` (Giải phẫu 12 Cung + Thân + Lai Nhân)
- Phân tích chuyên sâu đủ **14 mục** (12 cung địa bàn: *Mệnh, Phụ Mẫu, Phúc Đức, Điền Trạch, Quan Lộc, Nô Bộc, Thiên Di, Tật Ách, Tài Bạch, Tử Tức, Phu Thê, Huynh Đệ* + 2 cung đặc biệt: *Cung Thân* và *Lai Nhân Cung*).
- Mỗi cung bắt buộc có 4 lớp: (1) Sao Tọa Thủ (Chính tinh + độ sáng + Tứ Hóa + Phụ/Sát tinh); (2) Tam Phương Tứ Chính & Giáp Cung tác động; (3) Biểu hiện thực tế về tâm lý, tài chính, sự nghiệp, quan hệ; (4) Lời khuyên hóa giải thực tiễn.

### Tệp `04` & Tệp `05` — Lộ Trình Đại Vận Trọn Đời, Lộ Trình 10 Năm & Lưu Niên 12 Tháng
- **Tệp `04` (`04_Lo_Trinh_10_Nam_Va_Dai_Van_Cuoc_Doi.md`):** Khớp nối đồng thời **Đại Vận Tử Vi 10 năm** + **Đại Vận Bát Tự** + **4 Đỉnh Kim Tự Tháp Thần Số Học** + **Bảng lộ trình chi tiết từng năm trong 10 năm tới** (chỉ rõ năm bứt phá cần dồn lực và năm giao thời/phạm hạn cần phòng thủ).
- **Tệp `05` (`05_Tu_Vi_Hang_Nam_Va_12_Thang_Chi_Tiet.md`):** Luận sâu Tiểu hạn, Lưu Thái Tuế, Lưu Tứ Hóa, Năm Cá Nhân của năm mục tiêu và phân tích chi tiết từng tháng từ Tháng 1 đến Tháng 12 (Tháng Cá Nhân + khí ngũ hành từng tháng).

### Tệp `06`, `07`, `08`, `09` — Thần Số Học 18 Chỉ Số, Gia Đạo, Cẩm Nang Hàng Ngày & Đông Y
- **Tệp `06` (`06_Ban_Do_Than_So_Hoc_Chuyen_Sau_18_Chi_So.md`):** Trình bày công thức tính minh bạch và luận giải đủ 18 nhóm chỉ số Pythagoras + Biểu đồ 3x3 & Mũi tên (cách điền "số ảo" khắc phục mũi tên trống).
- **Tệp `07` (`07_Tuong_Hop_Gia_Dinh_Va_Hoa_Giai_Xung_Khac.md`):** Ma trận tương sinh – tương khắc Ngũ Hành Bát Tự và tương tác số Đường Đời/Linh Hồn giữa các thành viên; nguyên tắc giao tiếp hóa giải xung đột.
- **Tệp `08` (`08_Cam_Nang_Thuc_Chien_Va_Loi_Khuyen_Hang_Ngay.md`):** Bảng **"5 Điều Nên Làm Mỗi Ngày"** & **"5 Điều Tuyệt Đối Tránh"**, quy tắc ra quyết định nhanh, màu sắc – không gian làm việc – khung giờ vàng trong ngày theo Dụng thần.
- **Tệp `09` (`09_Chuyen_De_Suc_Khoe_Dong_Y_Va_Phong_Benh.md`):** Đối chiếu Ngũ Hành khuyết/thái quá trong Tứ Trụ và sao tại cung *Tật Ách* sang hệ **Ngũ Tạng Đông Y** (*Kim – Phế/Đại trường; Mộc – Can/Đởm; Thủy – Thận/Bàng quang; Hỏa – Tâm/Tiểu trường; Thổ – Tỳ/Vị*), kèm chế độ dinh dưỡng, vận động và lịch tầm soát y khoa dự phòng (luôn gắn cảnh báo tham khảo dưỡng sinh, không thay thế chẩn đoán bác sĩ chuyên khoa).
