---
type: wiki
title: "Cẩm Nang Kỹ Thuật T-SQL, FMS, TransactionNotification, DTW Import, Lập Trình SDK & Quản Trị Server DBA"
status: active
tags:
  - wiki
  - t-sql-fms
  - transaction-notification
  - dtw-import
  - sap-b1-sdk
  - sql-server-dba
created: '2026-10-18'
updated: '2026-10-18'
source: "[[01-sap-b1-93-vs-100-sql-architecture]], [[04-sap-b1-sdk-diapi-uiapi-udo-and-server-dba]]"
---

# Cẩm Nang Kỹ Thuật T-SQL, FMS, TransactionNotification, DTW Import, Lập Trình SDK & Quản Trị Server DBA

> Trang Wiki kỹ thuật toàn diện dành cho **[[ia-03-ky-su-sql-fms-transaction-notification]]**, **[[ia-04-chuyen-gia-dtw-import-master-data]]** và **[[ia-05-ky-su-sdk-lap-trinh-va-quan-tri-server]]** của công ty **Enterprise**. Chưng cất từ [[01-sap-b1-93-vs-100-sql-architecture]] và [[04-sap-b1-sdk-diapi-uiapi-udo-and-server-dba]], phối hợp trực tiếp với [[cam-nang-sap-b1-93-10-sql-va-beas-manufacturing]] và [[cam-nang-ke-toan-gia-thanh-thue-va-luong-nghiep-vu-erp]].

---

## 1. Quy Tắc Vàng Viết T-SQL, Formatted Search (FMS) & `SBO_SP_TransactionNotification`

### 1.1. Bảng Tra Cứu Nhanh Mã `ObjType` & Họ Bảng Chứng Từ SAP B1
- **Bán hàng (`Sales - A/R`):** `OQUT/QUT1 (23)` -> `ORDR/RDR1 (17)` -> `ODLN/DLN1 (15)` -> `ORDN/RDN1 (16)` -> `ODPI/DPI1 (203)` -> `OINV/INV1 (13)` -> `ORIN/RIN1 (14)` [[01-sap-b1-93-vs-100-sql-architecture]].
- **Mua hàng (`Purchasing - A/P`):** `OPRQ/PRQ1 (1470000113)` -> `OPQT/PQT1 (540000006)` -> `OPOR/POR1 (22)` -> `OPDN/PDN1 (20)` -> `ORPD/RPD1 (21)` -> `OIPF/IPF1 (69)` -> `ODPO/DPO1 (204)` -> `OPCH/PCH1 (18)` -> `ORPC/RPC1 (19)` [[01-sap-b1-93-vs-100-sql-architecture]].
- **Kho, Sản xuất & Tài chính:** `OITM/OITW (4)`, `OCRD/CRD1 (2)`, `OACT (1)`, `OJDT/JDT1 (30)`, `ORCT (24)`, `OVPM (46)`, `OIGN/IGN1 (59)`, `OIGE/IGE1 (60)`, `OWTR/WTR1 (67)`, `OWTQ/WTQ1 (1250000001)`, `OITT/ITT1 (66)`, `OWOR/WOR1 (202)`, `OMRV/MRV1 (162)` [[01-sap-b1-93-vs-100-sql-architecture]].
- **Quy tắc nối bảng bắt buộc:**
  - Nối Header và Line bằng **`DocEntry`** (`T0.DocEntry = T1.DocEntry`) [[01-sap-b1-93-vs-100-sql-architecture]].
  - Nối chuỗi chứng từ cha - con bằng **`BaseEntry = DocEntry AND BaseLine = LineNum AND BaseType = [ObjType]`** [[01-sap-b1-93-vs-100-sql-architecture]].
  - Luôn lọc **`T0.CANCELED = 'N'`** và gắn **`WITH (NOLOCK)`** trên mọi bảng đọc dữ liệu để chống khóa bảng (`Blocking`) [[01-sap-b1-93-vs-100-sql-architecture]].

### 1.2. Cú Pháp Formatted Search (FMS) & `SBO_SP_TransactionNotification`
- **Cú pháp FMS:**
  - Theo tên bảng/trường: `$[ORDR.CardCode]`, `$[RDR1.Quantity.NUMBER]`, `$[ORDR.DocDate.DATE]` [[01-sap-b1-93-vs-100-sql-architecture]].
  - Theo `ItemUID` và `ColumnUID` (`Ctrl + Shift + I`): `$[$4.0.0]` (`CardCode`), `$[$10.0.DATE]` (`DocDate`), `$[$38.1.0]` (`ItemCode` trên lưới Matrix `38`), `$[$38.11.NUMBER]` (`Quantity`), `$[$38.14.NUMBER]` (`Price`), `$[$38.24.0]` (`WhsCode`) [[01-sap-b1-93-vs-100-sql-architecture]].
- **Khung `SBO_SP_TransactionNotification`:**
  - Kiểm tra `@object_type` và `@transaction_type IN ('A', 'U', 'D', 'C', 'L')`; ép kiểu khóa chính an toàn bằng `TRY_CAST(@list_of_cols_val_tab_del AS INT)`. Tuyệt đối không dùng `UPDATE / DELETE / INSERT` lên bảng chuẩn của SAP B1 [[01-sap-b1-93-vs-100-sql-architecture]].

---

## 2. Quy Trình 8 Bước Chuẩn Hóa DTW (`Data Transfer Workbench`) Import Master Data

Khi triển khai Go-Live cho khách hàng của Enterprise, chuyên gia **[[ia-04-chuyen-gia-dtw-import-master-data]]** thực hiện nạp dữ liệu qua DTW theo đúng trình tự 8 bước [[04-sap-b1-sdk-diapi-uiapi-udo-and-server-dba]]:
1. **Bước 1:** Hệ thống tài khoản kế toán `OACT` (nạp từ `Level 1` xuống `Level 5`, `ActiveAccount = tNO` cho TK tổng hợp và `tYES` cho TK chi tiết) [[04-sap-b1-sdk-diapi-uiapi-udo-and-server-dba]].
2. **Bước 2:** Danh mục phụ trợ (`OCRG`, `OITB`, `OCTG`, `OSLP`, `OPRC`, `OWHS`, `OBIN`) [[04-sap-b1-sdk-diapi-uiapi-udo-and-server-dba]].
3. **Bước 3:** Danh mục Đối tác `OCRD` + Địa chỉ `CRD1` + Liên hệ `OCPR` [[04-sap-b1-sdk-diapi-uiapi-udo-and-server-dba]].
4. **Bước 4:** Danh mục Vật tư `OITM` + Kho `OITW` + Bảng giá `ITM1` [[04-sap-b1-sdk-diapi-uiapi-udo-and-server-dba]].
5. **Bước 5:** Định mức BOM & Routing (`OITT`/`ITT1` hoặc `BEAS_STL_HEADER`/`BEAS_STL`, `BEAS_APL`) [[04-sap-b1-sdk-diapi-uiapi-udo-and-server-dba]].
6. **Bước 6:** Số dư đầu kỳ Tài khoản G/L (`OJDT/JDT1` đối ứng TK trung gian `9999`) [[04-sap-b1-sdk-diapi-uiapi-udo-and-server-dba]].
7. **Bước 7:** Số dư đầu kỳ Công nợ chi tiết theo từng hóa đơn mở (`OCRD` Opening Balance) [[04-sap-b1-sdk-diapi-uiapi-udo-and-server-dba]].
8. **Bước 8:** Số dư đầu kỳ Tồn kho kèm Lô/Serial/Bin (`OIQR` hoặc `OIGN/IGN1` đối ứng TK `9999` sao cho số dư cuối cùng của TK `9999 = 0`) [[04-sap-b1-sdk-diapi-uiapi-udo-and-server-dba]].

- **Xử lý mã lỗi DTW nhanh:** Lỗi **`-10`** (sai giá trị enum `tYES/tNO` hoặc thiếu khóa ngoại), lỗi **`-5002`** (tài khoản cấp cha `Postable = 'N'` hoặc thừa khoảng trắng ở cuối mã), lỗi **`-2028`** (`ODBC -2028` không tìm thấy bản ghi khi Update), lỗi **`65171`** (lệch cột Header hoặc lỗi dấu chấm phẩy CSV - khắc phục triệt để bằng cách lưu file dạng **`Tab delimited (*.txt)`**) [[04-sap-b1-sdk-diapi-uiapi-udo-and-server-dba]].

---

## 3. Lập Trình SAP B1 SDK (`DI API`, `UI API`, `Service Layer`, `UDO`) & Quản Trị Server DBA

1. **Lập trình DI API (`SAPbobsCOM`) & UI API (`SAPbouiCOM`):**
   - Trong `DI API`, luôn giải phóng bộ nhớ COM bằng `Marshal.ReleaseComObject(oRecordset)` để tránh tràn RAM và lỗi `1012 (License Exceeded)` [[04-sap-b1-sdk-diapi-uiapi-udo-and-server-dba]].
   - Trong `UI API`, kết nối SSO qua `SBO_Application.Company.GetDICompany()`, xử lý chuẩn `BeforeAction` vs `ActionSuccess` trên `ItemEvent` / `FormDataEvent` / `MenuEvent`, và bọc `oForm.Freeze(true/false)` khi cập nhật `Matrix` [[04-sap-b1-sdk-diapi-uiapi-udo-and-server-dba]].
2. **Đăng ký `UDT / UDF / UDO` (`Objects Registration Wizard`):**
   - Phân biệt rõ kiểu `Master Data` (khóa chính `Code`, `Name`) và `Document` (khóa chính `DocEntry`, `DocNum`, `Series`, `Status`, `Canceled`), bật dịch vụ `Find`, `Cancel`, `Manage Series`, `Log` (`@A...`) và `Default Form` [[04-sap-b1-sdk-diapi-uiapi-udo-and-server-dba]].
3. **Tích hợp `Service Layer REST API` (Port `50000`):**
   - Đăng nhập `/b1s/v1/Login` lấy Cookie `B1SESSION`, tái sử dụng Session và luôn dùng `$select`, `$filter`, `$top`, `$skip` [[04-sap-b1-sdk-diapi-uiapi-udo-and-server-dba]].
4. **Quản trị MS SQL Server & Windows Server Đa Khách Hàng:**
   - Giới hạn `Max Server Memory` cho SQL Server (chừa 8-16 GB RAM cho OS, SLD, Service Layer, `Beas Common Service`), tách ổ đĩa `.mdf` / `.ldf` / `tempdb`, chạy `UPDATE STATISTICS` hàng tuần và dùng DMV `sys.dm_exec_requests` để xử lý `Blocking / Deadlock` tức thì [[04-sap-b1-sdk-diapi-uiapi-udo-and-server-dba]].

---

## Liên Kết Hệ Sinh Thái Tri Thức Enterprise
- [[cam-nang-sap-b1-93-10-sql-va-beas-manufacturing]] - Kiến trúc SAP B1 9.3/10.0 và Quản trị sản xuất Beas Manufacturing (`batchanderung.htm`).
- [[cam-nang-ke-toan-gia-thanh-thue-va-luong-nghiep-vu-erp]] - Luồng kế toán giá thành sản xuất (`WIP TK 154`), Mua - Bán - Kho và Thông tư 99/2025/TT-BTC.
