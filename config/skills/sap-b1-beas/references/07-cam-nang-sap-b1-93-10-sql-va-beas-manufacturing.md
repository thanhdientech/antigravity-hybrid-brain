---
type: wiki
title: "Cẩm Nang SAP B1 (9.3 vs 10.0 MS SQL) & Boyum IT Beas Manufacturing (Batch Changes & Cấu Trúc Bảng)"
status: active
tags:
  - wiki
  - sap-b1-93-100
  - beas-manufacturing
  - batchanderung
  - production-erp
created: '2026-10-18'
updated: '2026-10-18'
source: "[[01-sap-b1-93-vs-100-sql-architecture]], [[02-beas-manufacturing-batchanderung-and-db]]"
---

# Cẩm Nang SAP B1 (9.3 vs 10.0 MS SQL) & Boyum IT Beas Manufacturing (Batch Changes & Cấu Trúc Bảng)

> Trang Wiki trụ cột phục vụ trực tiếp cho **[[ia-01-tong-cong-trinh-su-sap-b1-beas]]** và toàn bộ đội ngũ Tư vấn / Kỹ sư triển khai **Enterprise**. Chưng cất từ [[01-sap-b1-93-vs-100-sql-architecture]] và [[02-beas-manufacturing-batchanderung-and-db]], kết nối chặt chẽ với [[cam-nang-ke-toan-gia-thanh-thue-va-luong-nghiep-vu-erp]] cùng [[cam-nang-sql-fms-sdk-dtw-va-quan-tri-server]].

---

## 1. Khác Biệt Kiến Trúc Database SAP Business One 9.3 vs 10.0 Trên MS SQL Server

Khi triển khai mới, nâng cấp phiên bản hoặc viết câu lệnh SQL / Stored Procedure / Add-on SDK dùng chung cho nhiều khách hàng của Enterprise, kỹ sư bắt buộc phải đối chiếu bảng khác biệt Schema giữa **SAP B1 9.3** và **SAP B1 10.0** [[01-sap-b1-93-vs-100-sql-architecture]]:

| Trường / Bảng Dữ Liệu | SAP B1 9.3 (MS SQL) | SAP B1 10.0 (MS SQL) | Quy Tắc Áp Dụng Thực Chiến Cho Kỹ Sư Enterprise |
| :--- | :--- | :--- | :--- |
| **`ItemCode` (`OITM`, `RDR1`, `INV1`, `WOR1`...)** | `NVARCHAR(20)` | **`NVARCHAR(50)`** | Khai báo mọi biến `@ItemCode` trong SQL/TransactionNotification là `NVARCHAR(50)` để không bị lỗi cắt chuỗi trên bản 10.0 [[01-sap-b1-93-vs-100-sql-architecture]]. |
| **`ItemName` / `Dscription`** | `NVARCHAR(100)` | **`NVARCHAR(200)`** | Cột tên vật tư trong bảng tạm `#Temp` hoặc tham số báo cáo phải để `NVARCHAR(200)` [[01-sap-b1-93-vs-100-sql-architecture]]. |
| **`CardCode` & `CardName` (`OCRD`)** | `NVARCHAR(15)` / `NVARCHAR(100)` | **Hỗ trợ tới `NVARCHAR(50)` / `NVARCHAR(200)`** | Luôn dùng `@CardCode NVARCHAR(50)` và `@CardName NVARCHAR(200)` [[01-sap-b1-93-vs-100-sql-architecture]]. |
| **`ItmsGrpNam` (`OITB`) & `GroupName` (`OCRG`)** | `NVARCHAR(20)` | **`NVARCHAR(100)`** | Mở rộng độ dài tên nhóm vật tư và nhóm khách hàng/NCC [[01-sap-b1-93-vs-100-sql-architecture]]. |
| **Chứng từ nháp (`ODRF` / `DRF1` - `ObjType 112`)** | Xử lý duyệt cơ bản qua `OWDD`/`WDD1`. | Quản lý chặt trạng thái cập nhật nháp đã duyệt và khóa chứng từ nháp sau khi đã sinh chứng từ thật. | Luôn lọc `ODRF.DocStatus = 'O' AND ODRF.CANCELED = 'N'` và kiểm tra `ODRF.ObjType` (VD `17` = SO, `22` = PO) [[01-sap-b1-93-vs-100-sql-architecture]]. |
| **Đính kèm tài liệu (`OATC` / `ATC1`)** | Chủ yếu trên Marketing Documents & Master Data. | Mở rộng Tab **Attachments** cho cả `OJDT` (Journal Entry), `OWOR` (Production Order), `OBTN` (Batch Master). | Nối `T0.AtcEntry = OATC.AbsEntry` và `OATC.AbsEntry = ATC1.AbsEntry` để lấy đường dẫn file đính kèm [[01-sap-b1-93-vs-100-sql-architecture]]. |
| **Đánh số chứng từ (`NNM1` - Series)** | Quản lý Series theo ObjectCode. | Mở rộng phân quyền khóa Series theo User Group, Chi nhánh (`BPLId`) và kỳ tài chính (`Indicator`). | Nối `LEFT JOIN NNM1 T_S ON T0.Series = T_S.Series` để lấy `SeriesName` [[01-sap-b1-93-vs-100-sql-architecture]]. |
| **Sổ kho (`OINM` vs `OIVL` / `IVL1`)** | `OINM` là View/Bảng lịch sử; `OIVL`/`IVL1` lưu lớp giá vốn. | Tối ưu hóa View `OINM` trên SQL Server và mở rộng định giá theo Lô/Serial (`Serial/Batch Valuation`). | Với DB lớn (> 5 triệu dòng kho), luôn có điều kiện `DocDate` + `ItemCode` kèm `WITH (NOLOCK)` [[01-sap-b1-93-vs-100-sql-architecture]]. |

---

## 2. Chức Năng Thay Đổi Định Mức BOM Hàng Loạt Trên Beas (`Batch Changes - batchanderung.htm`)

Theo tài liệu chính thức của Boyum IT Beas Manufacturing (`https://help.beascloud.com/beas202206/index.html?batchanderung.htm`), chức năng **Bill of Materials - Batch changes** (cửa sổ kỹ thuật **`artikel_stlpos_batch.psr`**) cho phép kỹ sư định mức (R&D / BOM Engineer) cập nhật hàng loạt công thức BOM (`BEAS_STL_HEADER`, `BEAS_STL`) cùng một lúc [[02-beas-manufacturing-batchanderung-and-db]]:

### 2.1. Đường Dẫn Mở Chức Năng & Quy Tắc Quản Lý Phiên Bản (`Version Control`)
- **Đường dẫn:** `Inventory` -> `Bill of materials` -> Nhấp chuột phải vào mặt hàng (`Right-click`) -> Chọn **`"Bill of Materials: Batch changes"`** [[02-beas-manufacturing-batchanderung-and-db]].
- **Hỗ trợ Version-controlled Items (từ bản 9.3 PL2+):**
  - Cho phép cập nhật hàng loạt các mặt hàng có quản lý nhiều phiên bản định mức (`Version` riêng biệt) thông qua cột **`Version`** trên lưới [[02-beas-manufacturing-batchanderung-and-db]].
  - **Lưu ý quan trọng:** Nếu một mặt hàng có nhiều Version nhưng một số Version được liên kết trực tiếp về định nghĩa gốc (`linked to the main definition`), các dòng này chỉ hiển thị **1 lần duy nhất** cùng định nghĩa chính (không hiển thị số Version) [[02-beas-manufacturing-batchanderung-and-db]].

### 2.2. Bảng Tổng Hợp 4 Chế Độ Thao Tác Trên Cửa Sổ `artikel_stlpos_batch.psr`

| Chế độ (Tab / Switch) | Mục đích Nghiệp vụ | Quy trình Thao tác Chuẩn & Lưu ý Kỹ thuật trên `BEAS_STL` |
| :--- | :--- | :--- |
| **1. `Selection`** | Lọc danh sách BOM cần tác động | Lọc theo `Item number` (Mã TP/BTP), `Item group` (Nhóm hàng), `Match code`. Hỗ trợ điều kiện lọc trên nguyên vật liệu: `"Only material no."`, `"contains"`, `"contains not"` [[02-beas-manufacturing-batchanderung-and-db]]. |
| **2. `Substitute`** | **Thay thế** nguyên vật liệu hoặc cập nhật thông số hàng loạt | - Khung bên phải hiển thị các vị trí BOM chứa mã nguyên vật liệu cũ.<br>- Khung bên trái nhập giá trị mới: `Material number` (Mã NVL mới), `Quantity` (Định mức mới), `Quantity per` (Số lượng cơ sở `MENGE_JE`), `Additional text`, `Active` (Ô tích trái = chọn đổi trạng thái; Ô tích phải = đặt `Active` / `Inactive`), và các trường `UDF` [[02-beas-manufacturing-batchanderung-and-db]].<br>- **CẢNH BÁO ĐƠN VỊ TÍNH:** Khi đổi `Quantity` qua Batch Changes, **hệ số quy đổi (`Conversion factors`) không được tính đến**. Số lượng luôn tính theo **Đơn vị sản xuất (`Production unit`)** và 3 trường **`beas_stl.input_qty`**, **`input_factor`**, **`input_unit`** sẽ bị xóa trắng (`deleted`) [[02-beas-manufacturing-batchanderung-and-db]]. |
| **3. `Add`** | **Thêm mới / Chèn** nguyên vật liệu hàng loạt vào nhiều BOM | Chọn nguyên vật liệu mốc để tìm tất cả các BOM chứa nguyên vật liệu đó. Ở khung bên trái, chọn mã nguyên vật liệu mới cần thêm: tích **`Append`** để nối vào cuối BOM, hoặc nhập **`Position`** để chèn vào vị trí chỉ định (nếu trùng vị trí và không tích Append sẽ thay thế dòng tại vị trí đó) [[02-beas-manufacturing-batchanderung-and-db]]. |
| **4. `Delete`** | **Xóa** nguyên vật liệu hàng loạt khỏi nhiều BOM | Hiển thị danh sách toàn bộ các dòng BOM đang chứa mã nguyên vật liệu cần loại bỏ. Tích chọn cột **`OK`** (hoặc bấm `All select`) rồi nhấn **`Start`** để xóa hàng loạt [[02-beas-manufacturing-batchanderung-and-db]]. |

- **Truy vết lịch sử (`Right-click -> Change Log`):** Nhấp chuột phải vào dòng BOM bất kỳ trên cửa sổ và chọn **`Change Log`** (`activitylog.htm`) để xem chi tiết lịch sử ai sửa (`ANDUSER`), sửa lúc nào (`ANDTSTAMP`) [[02-beas-manufacturing-batchanderung-and-db]].

---

## 3. Sơ Đồ Bảng Dữ Liệu Lõi Beas Manufacturing & Từ Điển Cột Tiếng Đức

### 3.1. Nhóm Bảng Kỹ Thuật (`Engineering`), Sản Xuất (`Work Order`) & Chất Lượng (`QC`)
1. **Định mức & Quy trình chuẩn (`Engineering Master Data`):**
   - `BEAS_STL_HEADER` (BOM Header) -> `BEAS_STL` (BOM Positions: nối `ItemCode` là mã cha, `ART1_ID` là mã nguyên vật liệu con) [[02-beas-manufacturing-batchanderung-and-db]].
   - `BEAS_APL_HEADER` (Routing Header) -> `BEAS_APL` (Routing Operations: nối `APLATZ_ID` sang bảng máy móc/nguồn lực `BEAS_APLATZ`) [[02-beas-manufacturing-batchanderung-and-db]].
2. **Lệnh sản xuất & Chấm công (`Work Order & Shopfloor BDE`):**
   - `BEAS_FTHAUPT` (Header Lệnh sản xuất - khóa chính `BELNR_ID`) [[02-beas-manufacturing-batchanderung-and-db]].
   - `BEAS_FTPOS` (Các vị trí TP/BTP đa cấp trong Lệnh - khóa chính `BELNR_ID`, `BELPOS_ID`) [[02-beas-manufacturing-batchanderung-and-db]].
   - `BEAS_FTSTL` (Định mức NVL của từng vị trí lệnh - khóa chính `BELNR_ID`, `BELPOS_ID`, `POS_ID`; cột `MENGE_VERBRAUCH` là SL cần xuất, `GEL_MENGE` là SL đã xuất) [[02-beas-manufacturing-batchanderung-and-db]].
   - `BEAS_FTAPL` (Công đoạn gia công của từng vị trí lệnh - khóa chính `BELNR_ID`, `BELPOS_ID`, `POS_ID`) [[02-beas-manufacturing-batchanderung-and-db]].
   - `BEAS_ARBZEIT` (Ghi nhận thời gian làm việc thực tế `Time Receipt` từ BDE Terminal / WebApps - cột `ZEIT` là thời gian thực tế, `PERS_ID` là mã công nhân) [[02-beas-manufacturing-batchanderung-and-db]].
3. **Quản lý chất lượng (`Quality Control`):**
   - `BEAS_QSFTHAUPT` (QC Order Header) -> `BEAS_QSFTPOS` (Kết quả đo kiểm từng chỉ tiêu) [[02-beas-manufacturing-batchanderung-and-db]].

---

## 4. Checklist 5 Nguyên Nhân Không Đóng Được Lệnh Sản Xuất Beas (`ABGKZ <> 'J'`)

Khi khách hàng báo lỗi không thể chuyển trạng thái Lệnh sản xuất (`BELNR_ID`) sang Đóng (`Closed` / `ABGKZ = 'J'`), kỹ sư Enterprise rà soát ngay 5 chốt chặn sau [[02-beas-manufacturing-batchanderung-and-db]]:
1. **Còn phiên bấm giờ dở dang (`Active Time Receipt / Terminal Logon`):** Công nhân đã bấm `Start` trên BDE Terminal / WebApps nhưng chưa bấm `Stop` (kiểm tra bảng `BEAS_FTSTAMP` / `BEAS_ARBZEIT`) [[02-beas-manufacturing-batchanderung-and-db]].
2. **Còn phiếu QC chưa duyệt (`Open QC Order`):** Phiếu kiểm tra chất lượng trong `BEAS_QSFTHAUPT` gắn với vị trí lệnh chưa được đánh giá (`Release / Valuation / Transfer`) [[02-beas-manufacturing-batchanderung-and-db]].
3. **Còn vị trí Bán thành phẩm con chưa đóng (`Open Sub-assembly Position`):** Trong lệnh sản xuất đa cấp, một vị trí cấp dưới (`BEAS_FTPOS.BELPOS_ID`) vẫn đang có `ABGKZ = 'N'` [[02-beas-manufacturing-batchanderung-and-db]].
4. **Còn PO Gia công ngoài chưa nhập kho (`Open External Operation PO`):** Công đoạn gia công ngoài trên `BEAS_FTAPL` đã tạo `OPOR` nhưng chưa làm phiếu nhập `OPDN (GRPO)` [[02-beas-manufacturing-batchanderung-and-db]].
5. **Kỳ kế toán (`Posting Period`) bị khóa hoặc thiếu tài khoản kết chuyển WIP Variance:** Khi đóng lệnh, Beas cần sinh bút toán xử lý chênh lệch WIP (`TK 154`), nếu kỳ kế toán đã khóa hoặc `Beas Common Service` bị dừng sẽ không thể tất toán lệnh [[02-beas-manufacturing-batchanderung-and-db]].

---

## Liên Kết Hệ Sinh Thái Tri Thức Enterprise
- [[cam-nang-ke-toan-gia-thanh-thue-va-luong-nghiep-vu-erp]] - Luồng kế toán giá thành sản xuất (`WIP TK 154`), Mua - Bán - Kho và Thông tư 99/2025/TT-BTC.
- [[cam-nang-sql-fms-sdk-dtw-va-quan-tri-server]] - Truy vấn SQL, FMS, TransactionNotification, DTW Import và Lập trình SDK / Quản trị Server.
