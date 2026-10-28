# 📘 TÀI LIỆU HƯỚNG DẪN TRA CỨU DATABASE BEAS & SAP B1

Hệ thống cơ sở dữ liệu của BEAS được viết bởi các nhà phát triển Đức, do đó nó sử dụng pha trộn giữa tiếng Đức (viết tắt), tiếng Anh và các trường dữ liệu gốc của SAP B1. Việc nắm được quy tắc đặt tên sẽ giúp bạn viết SQL nhanh và chuẩn xác.

## PHẦN 1: QUY TẮC ĐẶT TÊN BẢNG (TABLE NAMING CONVENTIONS)

Tên bảng trong BEAS thường có cấu trúc: `BEAS_` + `[Mã Phân Hệ]` + `[Cấp bậc bảng]`.

### 1. Ký hiệu phân hệ (Module)
* **`FT`** (*Fertigung*): Phân hệ Sản xuất / Lệnh sản xuất (Work Order).
* **`QS`** (*Qualitätssicherung*): Phân hệ Quản lý chất lượng (Quality Control).
* **`BAB`** (*Betriebsabrechnungsbogen*): Phân hệ Kế toán chi phí / Giá thành.
* **`PK`** (*Precalculation*): Phân hệ Tính giá sơ bộ.

### 2. Cấp bậc bảng (Header vs. Detail)
* **`HAUPT`** (hoặc `KOPF`): Bảng Header chứa thông tin chung (Ví dụ: Số lệnh, khách hàng, ngày tháng).
* **`POS`** (*Position*): Bảng Detail chứa thông tin chi tiết từng dòng (Ví dụ: Danh sách mặt hàng cần sản xuất).
* **`STL`** (*Stückliste*): Định mức nguyên vật liệu (BOM).
* **`APL`** (*Arbeitsplan*): Định tuyến / Công đoạn (Routing).

---

## PHẦN 2: CÁC BẢNG DỮ LIỆU CỐT LÕI THEO TỪNG MODULE

### 1. Phân hệ Sản xuất (Work Order)
Đây là nhóm bảng dùng nhiều nhất khi truy xuất tiến độ sản xuất:
* **`BEAS_FTHAUPT`**: Thông tin chung Lệnh sản xuất (Header).
* **`BEAS_FTPOS`**: Chi tiết các mặt hàng *cần sản xuất* trong Lệnh (Work Order Position).
* **`BEAS_FTSTL`**: Chi tiết *Nguyên vật liệu* (BOM) cần dùng cho Lệnh đó.
* **`BEAS_FTAPL`**: Chi tiết các *Công đoạn* (Routing) cần thực hiện.
* **`BEAS_ARBZEIT`**: Ghi nhận thời gian làm việc thực tế / Chấm công sản xuất (Time Receipt).

### 2. Phân hệ Dữ liệu chủ Kỹ thuật (Engineering Master Data)
* **`BEAS_STL_HEADER`** & **`BEAS_STL`**: Định mức nguyên vật liệu chuẩn (BOM Master Data).
* **`BEAS_APL_HEADER`** & **`BEAS_APL`**: Quy trình / Công đoạn sản xuất chuẩn (Routing Master Data).
* **`BEAS_APLATZ`**: Danh sách Máy móc / Nguồn lực (Resources).
* **`BEAS_AG`**: Danh mục các Thao tác / Bước công việc chuẩn.

### 3. Phân hệ Quản lý chất lượng (QC)
* **`BEAS_QSFTHAUPT`**: Thông tin chung Lệnh kiểm tra chất lượng (QC Order Header).
* **`BEAS_QSFTPOS`**: Chi tiết các chỉ tiêu cần đo và kết quả đo thực tế (QC Order Results).
* **`BEAS_QSARTIKEL`**: Cấu hình tiêu chuẩn kiểm tra / lấy mẫu gắn với từng mặt hàng.

---

## PHẦN 3: TỪ ĐIỂN TÊN CỘT & THUẬT NGỮ TIẾNG ĐỨC (COLUMN DICTIONARY)

Các cột trong BEAS tuân theo quy tắc hậu tố và mượn từ vựng tiếng Đức.

### 1. Nhóm Khóa chính / Khóa ngoại (Đuôi `_ID`)
Dùng để `JOIN` các bảng với nhau:
* **`BELNR_ID`** (*Belegnummer*): Số chứng từ / Số Lệnh sản xuất.
* **`BELPOS_ID`** (*Belegposition*): Số thứ tự dòng của chứng từ.
* **`POS_ID`**: ID nội bộ của dòng chi tiết cấp dưới.
* **`ART1_ID`** (*Artikel*): Mã mặt hàng (Đôi khi BEAS dùng thẳng chữ `ItemCode`).
* **`KND_ID`** (*Kunde*): Mã khách hàng / Đối tác.
* **`APLATZ_ID`** (*Arbeitsplatz*): Mã trạm làm việc / Mã Máy móc.
* **`WKZ_ID`** (*Werkzeug*): Mã công cụ, dụng cụ (Tool).

### 2. Nhóm Số lượng & Thời gian
* **`MENGE`**: Số lượng (Quantity) -> Yêu cầu / Kế hoạch.
* **`GEL_MENGE`**: Số lượng đã hoàn thành (Completed).
* **`DATUM`**: Ngày tháng nói chung.
* **`LIEFERDATUM`**: Ngày giao hàng (Delivery Date).
* **`ZEIT`**: Thời gian / Giờ (Time).
* **`ANFZEIT`**: Thời gian bắt đầu (Start Time).
* **`ENDZEIT`**: Thời gian kết thúc (End Time).

### 3. Nhóm Theo dõi hệ thống (Tracking - Có ở mọi bảng)
* **`ERFTSTAMP`**: Thời gian tạo bản ghi.
* **`ERFUSER`**: ID User tạo bản ghi.
* **`ANDTSTAMP`**: Thời gian cập nhật lần cuối.
* **`ANDUSER`**: ID User sửa lần cuối.

---

## PHẦN 4: LIÊN KẾT GIỮA BEAS VÀ SAP B1 (INTEGRATION)

Vì BEAS chạy trên DB của SAP, nó có nhúng sẵn các cột chuẩn của SAP để bạn JOIN dữ liệu dễ dàng:
* **`ItemCode`**: Mã mặt hàng (SAP: Bảng `OITM`).
* **`ItemName`**: Tên mặt hàng.
* **`WhsCode`**: Mã kho (SAP: Bảng `OWHS`).
* **`CardCode`**: Mã đối tác / Khách hàng (SAP: Bảng `OCRD`).
* **`DocEntry`**: Mã nội bộ của chứng từ gốc bên SAP. Dùng để JOIN thẳng về các bảng như `ORDR` (Đơn hàng bán) hay `OIGN` (Phiếu nhập kho).

**Quy tắc ngầm khi không có cột tiếng Anh:**
* Lấy BEAS `KND_ID` = SAP `CardCode`.
* Lấy BEAS `ART1_ID` = SAP `ItemCode`.

---

## PHẦN 5: VÍ DỤ THỰC CHIẾN (SQL QUERY MẪU)

**Yêu cầu:** Lấy danh sách Lệnh sản xuất bao gồm: Số lệnh, Dòng thứ tự, Mã mặt hàng, Tên mặt hàng, Số lượng cần sản xuất, Số lượng đã hoàn thành, Ngày giao hàng.

**Câu lệnh SQL:**
```sql
SELECT 
    T0.[BELNR_ID]      AS 'Work Order',        -- Số Lệnh sản xuất (Header)
    T1.[BELPOS_ID]     AS 'Position',          -- Dòng thứ tự (Detail)
    T1.[ItemCode]      AS 'Item Code',         -- Mã mặt hàng
    T1.[ItemName]      AS 'Item Name',         -- Tên mặt hàng
    T1.[MENGE]         AS 'Production Qty',    -- Số lượng kế hoạch
    T1.[GEL_MENGE]     AS 'Completed Qty',     -- Số lượng thực tế
    T1.[LIEFERDATUM]   AS 'Delivery Date'      -- Ngày giao dự kiến
FROM 
    BEAS_FTHAUPT T0                            -- Bảng thông tin chung
INNER JOIN 
    BEAS_FTPOS T1 ON T0.[BELNR_ID] = T1.[BELNR_ID] -- Nối với bảng Chi tiết mặt hàng
```
