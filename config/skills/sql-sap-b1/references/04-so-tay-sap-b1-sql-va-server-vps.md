---
type: wiki
title: "Sổ Tay Tra Cứu Nhanh SAP Business One (SQL/HANA) & Quản Trị Server/VPS"
status: active
tags:
  - wiki
  - sap-b1-erp
  - sql-server-hana
  - windows-server-vps
created: '2026-10-17'
updated: '2026-10-17'
source: "Hồ sơ công việc IT chuyên môn của chủ nhân (SAP B1 ERP, SQL & Server/VPS)"
---
# Sổ Tay Tra Cứu Nhanh SAP Business One (SQL/HANA) & Quản Trị Server/VPS

> Cẩm nang tra cứu tốc độ cao phục vụ công việc chuyên môn hàng ngày của chủ nhân: Bảng mã `ObjType` & cấu trúc bảng SAP Business One, khung chuẩn `SBO_SP_TransactionNotification`, cú pháp Formatted Search (FMS), bảng đối chiếu T-SQL vs SAP HANA và bộ lệnh PowerShell/SQL DBA chẩn đoán nhanh Windows Server & VPS. Phối hợp trực tiếp với 2 trợ lý `p1-01-ky-su-sap-b1-sql` và `p1-03-quan-tri-server-vps`, giúp giải quyết nhanh công việc làm thuê để dành thời gian phát triển [[he-sinh-thai-khoa-hoc-ai-va-5-tools]] và [[checklist-chuan-bi-xay-kenh-youtube-ngoai]].

---

## 1. Bảng Tra Cứu Nhanh ObjectType & Bảng Chuẩn SAP Business One

### 1.1. Phân hệ Bán hàng (Sales - A/R) & Mua hàng (Purchasing - A/P)

| Phân hệ | Tên chứng từ (Document) | ObjType | Bảng Header | Bảng Dòng (Lines) | Bảng Thuế / Địa chỉ / Phụ |
|---|---|---|---|---|---|
| **Sales - A/R** | Sales Quotation (Báo giá bán) | `23` | `OQUT` | `QUT1` | `QUT4` (Tax), `QUT12` (Address) |
| **Sales - A/R** | Sales Order (Đơn hàng bán) | `17` | `ORDR` | `RDR1` | `RDR4`, `RDR12` |
| **Sales - A/R** | Delivery (Phiếu giao hàng) | `15` | `ODLN` | `DLN1` | `DLN4`, `DLN12` |
| **Sales - A/R** | Returns (Hàng bán trả lại) | `16` | `ORDN` | `RDN1` | `RDN4`, `RDN12` |
| **Sales - A/R** | A/R Down Payment (Tạm ứng KH) | `203` | `ODPI` | `DPI1` | `DPI4`, `DPI12` |
| **Sales - A/R** | A/R Invoice (Hóa đơn bán hàng) | `13` | `OINV` | `INV1` | `INV4`, `INV12` |
| **Sales - A/R** | A/R Credit Memo (Giảm giá hàng bán) | `14` | `ORIN` | `RIN1` | `RIN4`, `RIN12` |
| **Purchasing - A/P** | Purchase Request (Yêu cầu mua hàng) | `1470000113` | `OPRQ` | `PRQ1` | `PRQ4`, `PRQ12` |
| **Purchasing - A/P** | Purchase Quotation (Báo giá mua) | `540000006` | `OPQT` | `PQT1` | `PQT4`, `PQT12` |
| **Purchasing - A/P** | Purchase Order (Đơn mua hàng - PO) | `22` | `OPOR` | `POR1` | `POR4`, `POR12` |
| **Purchasing - A/P** | Goods Receipt PO (Nhập kho PO) | `20` | `OPDN` | `PDN1` | `PDN4`, `PDN12` |
| **Purchasing - A/P** | Goods Return (Trả hàng NCC) | `21` | `ORPD` | `RPD1` | `RPD4`, `RPD12` |
| **Purchasing - A/P** | A/P Down Payment (Tạm ứng NCC) | `204` | `ODPO` | `DPO1` | `DPO4`, `DPO12` |
| **Purchasing - A/P** | A/P Invoice (Hóa đơn mua hàng) | `18` | `OPCH` | `PCH1` | `PCH4`, `PCH12` |
| **Purchasing - A/P** | A/P Credit Memo (Giảm giá mua hàng) | `19` | `ORPC` | `RPC1` | `RPC4`, `RPC12` |

### 1.2. Phân hệ Kho (Inventory), Sản xuất (Production), Đối tác (BP) & Tài chính (Financials)

| Phân hệ | Đối tượng / Chứng từ | ObjType | Bảng chính | Các bảng liên kết quan trọng |
|---|---|---|---|---|
| **Master Data** | Business Partner (KH / NCC / Lead) | `2` | `OCRD` | `CRD1` (Địa chỉ), `OCPR` (Liên hệ), `OCRG` (Nhóm BP) |
| **Master Data** | Item Master Data (Danh mục vật tư) | `4` | `OITM` | `OITW` (Tồn theo kho), `OITB` (`52` - Nhóm vật tư), `ITM1` (Giá) |
| **Inventory** | Warehouses (Danh mục kho) | `64` | `OWHS` | `OBIN` (Bin Locations), `OIBQ` (Tồn theo Bin) |
| **Inventory** | Goods Receipt (Nhập kho khác) | `59` | `OIGN` | `IGN1` |
| **Inventory** | Goods Issue (Xuất kho khác) | `60` | `OIGE` | `IGE1` |
| **Inventory** | Inventory Transfer Request (YC chuyển kho) | `1250000001` | `OWTQ` | `WTQ1` |
| **Inventory** | Inventory Transfer (Chuyển kho nội bộ) | `67` | `OWTR` | `WTR1` |
| **Inventory** | Inventory Audit / Sổ cái giao dịch kho | `-` | `OINM` / `OIVL` | `OBTN` (Batch Master), `OSRN` (Serial), `OITL / ITL1` (Log Batch/Serial) |
| **Production** | Bill of Materials (Định mức BOM) | `66` | `OITT` | `ITT1` |
| **Production** | Production Order (Lệnh sản xuất) | `202` | `OWOR` | `WOR1` (Nguyên liệu & Công đoạn) |
| **Financials** | Chart of Accounts (Hệ thống tài khoản) | `1` | `OACT` | `OPRC` (Cost Center / Trung tâm chi phí), `OPRJ` (Dự án) |
| **Financials** | Journal Entry (Bút toán nhật ký chung) | `30` | `OJDT` | `JDT1` (Dòng hạch toán Nợ/Có `Debit`/`Credit`, `ShortName`) |
| **Banking** | Incoming Payment (Phiếu thu) | `24` | `ORCT` | `RCT1` (Séc), `RCT2` (Hóa đơn được thanh toán), `RCT4` (TK GL) |
| **Banking** | Outgoing Payment (Phiếu chi) | `46` | `OVPM` | `VPM1`, `VPM2` (Hóa đơn mua được trả), `VPM4` |

### 1.3. Công thức Nối Chuỗi Chứng Từ Chuẩn (Base -> Target Document)
Khi truy vấn chuỗi `ORDR -> ODLN -> OINV` hoặc `OPOR -> OPDN -> OPCH`, luôn nối trên bảng dòng chi tiết:

```sql
-- Ví dụ: Nối từ Đơn hàng bán (ORDR/RDR1) sang Giao hàng (ODLN/DLN1) và Hóa đơn A/R (OINV/INV1)
SELECT
    T0.DocNum AS [SO_Num],
    T0.DocDate AS [SO_Date],
    T0.CardCode,
    T0.CardName,
    T1.ItemCode,
    T1.Dscription,
    T1.Quantity AS [SO_Qty],
    T3.DocNum AS [Delivery_Num],
    T2.Quantity AS [Delivered_Qty],
    T5.DocNum AS [Invoice_Num],
    T4.Quantity AS [Invoiced_Qty],
    T4.LineTotal AS [Invoice_LineTotal]
FROM ORDR T0 WITH (NOLOCK)
INNER JOIN RDR1 T1 WITH (NOLOCK) ON T0.DocEntry = T1.DocEntry
LEFT JOIN DLN1 T2 WITH (NOLOCK) ON T2.BaseEntry = T0.DocEntry AND T2.BaseType = 17 AND T2.BaseLine = T1.LineNum
LEFT JOIN ODLN T3 WITH (NOLOCK) ON T2.DocEntry = T3.DocEntry AND T3.CANCELED = 'N'
LEFT JOIN INV1 T4 WITH (NOLOCK) ON (
    (T4.BaseEntry = T3.DocEntry AND T4.BaseType = 15 AND T4.BaseLine = T2.LineNum)
    OR (T4.BaseEntry = T0.DocEntry AND T4.BaseType = 17 AND T4.BaseLine = T1.LineNum)
)
LEFT JOIN OINV T5 WITH (NOLOCK) ON T4.DocEntry = T5.DocEntry AND T5.CANCELED = 'N'
WHERE T0.CANCELED = 'N'
  AND T0.DocDate BETWEEN [%0] AND [%1];
```

---

## 2. Mẫu Khung Chuẩn `SBO_SP_TransactionNotification` (Chốt chặn Nghiệp vụ)

- **Ý nghĩa các biến `@transaction_type`:**
  - `'A'` = Add (Thêm mới)
  - `'U'` = Update (Cập nhật)
  - `'D'` = Delete (Xóa)
  - `'C'` = Cancel (Hủy chứng từ)
  - `'L'` = Close (Đóng chứng từ)

```sql
-- Mẫu 1 (MS SQL Server): Chặn thêm/sửa Đơn hàng bán (ORDR - ObjType 17) nếu dòng hàng không chọn Trung tâm chi phí (OcrCode) hoặc Đơn giá = 0
IF @object_type = '17' AND @transaction_type IN ('A', 'U')
BEGIN
    DECLARE @ErrLine INT;
    DECLARE @ErrItem NVARCHAR(50);

    SELECT TOP 1
        @ErrLine = T1.VisOrder + 1,
        @ErrItem = T1.ItemCode
    FROM ORDR T0 WITH (NOLOCK)
    INNER JOIN RDR1 T1 WITH (NOLOCK) ON T0.DocEntry = T1.DocEntry
    WHERE T0.DocEntry = CAST(@list_of_cols_val_tab_del AS INT)
      AND T0.DocType = 'I'
      AND (ISNULL(T1.Price, 0) <= 0 OR ISNULL(T1.OcrCode, '') = '');

    IF @ErrLine IS NOT NULL
    BEGIN
        SET @error = 17001;
        SET @error_message = N'[SAP B1 Rule] Dòng số ' + CAST(@ErrLine AS NVARCHAR(10))
                           + N' (Mã hàng: ' + @ErrItem + N') chưa nhập Đơn giá hoặc thiếu Trung tâm chi phí (Cost Center)!';
    END
END
```

---

## 3. Cú Pháp Formatted Search (FMS) & Bảng Đối Chiếu MS SQL vs SAP HANA

### 3.1. Cú pháp biến động trong Formatted Search (FMS)
- **Lấy giá trị theo Tên Bảng.Tên Trường trên màn hình hiện tại:**
  - `$[OINV.CardCode]` (Mã khách hàng trên Hóa đơn)
  - `$[RDR1.ItemCode]` (Mã vật tư tại dòng đang đứng trên Sales Order)
- **Lấy giá trị theo ItemUID và ColumnUID (bật `View -> System Information` hoặc `Ctrl + Shift + I` để xem):**
  - Chuỗi văn bản: `$[$38.1.0]` (Item `38` là lưới chi tiết chứng từ, Column `1` là `ItemCode`, `0` là kiểu chuỗi).
  - Giá trị số (bỏ ký hiệu tiền tệ để tính toán): `$[$38.11.NUMBER]` (Số lượng) hoặc `$[$38.14.NUMBER]` (Đơn giá).
  - Giá trị ngày tháng: `$[$10.0.DATE]` (`DocDate`).

### 3.2. Bảng chuyển đổi nhanh T-SQL (MS SQL) sang SQLScript (SAP HANA)

| Tác vụ | MS SQL Server (T-SQL) | SAP HANA (SQLScript) |
|---|---|---|
| Xử lý giá trị NULL | `ISNULL(T0.U_Field, '')` | `IFNULL(T0."U_Field", '')` hoặc `COALESCE(...)` |
| Giới hạn số dòng trả về | `SELECT TOP 10 * FROM OINV` | `SELECT * FROM "OINV" LIMIT 10` |
| Lấy ngày giờ hiện tại | `GETDATE()` | `CURRENT_DATE` / `CURRENT_TIMESTAMP` |
| Cộng/Trừ ngày tháng | `DATEADD(DAY, -30, GETDATE())` | `ADD_DAYS(CURRENT_DATE, -30)` |
| Khoảng cách ngày | `DATEDIFF(DAY, T0.DocDate, GETDATE())` | `DAYS_BETWEEN(T0."DocDate", CURRENT_DATE)` |
| Ghép chuỗi | `T0.CardCode + ' - ' + T0.CardName` | `T0."CardCode" \|\| ' - ' \|\| T0."CardName"` |
| Ép kiểu chuỗi/số | `CAST(x AS NVARCHAR(50))` | `TO_NVARCHAR(x)` / `TO_DECIMAL(x, 19, 6)` |

---

## 4. Bộ Lệnh PowerShell & SQL DBA Kiểm Tra Nhanh Windows Server / VPS

### 4.1. Kiểm tra sức khỏe tổng thể Windows Server / VPS (PowerShell - Chỉ đọc, an toàn 100%)
```powershell
# 1. Kiểm tra dung lượng trống các ổ đĩa (cảnh báo ổ dưới 15% trống)
Get-CimInstance Win32_LogicalDisk -Filter "DriveType=3" | Select-Object DeviceID, VolumeName,
    @{N="Total_GB";E={[math]::Round($_.Size/1GB,2)}},
    @{N="Free_GB";E={[math]::Round($_.FreeSpace/1GB,2)}},
    @{N="Free_Pct";E={[math]::Round(($_.FreeSpace/$_.Size)*100,1)}} | Format-Table -AutoSize

# 2. Top 10 tiến trình ngốn RAM và CPU nhiều nhất
Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 10 Name, Id,
    @{N="RAM_MB";E={[math]::Round($_.WorkingSet64/1MB,1)}},
    @{N="CPU_Sec";E={[math]::Round($_.CPU,1)}} | Format-Table -AutoSize

# 3. Kiểm tra các dịch vụ quan trọng của SQL Server & SAP B1
Get-Service | Where-Object { $_.Name -match "MSSQL|SQLSERVERAGENT|SBOLicense|B1|SAP" } |
    Select-Object Status, Name, DisplayName, StartType | Format-Table -AutoSize

# 4. Kiểm tra 20 lỗi System/Application mới nhất trong 24 giờ qua
Get-WinEvent -FilterHashtable @{LogName='System','Application'; Level=1,2; StartTime=(Get-Date).AddHours(-24)} -MaxEvents 20 |
    Select-Object TimeCreated, LogName, Id, ProviderName, Message | Format-List
```

### 4.2. Truy vấn SQL DBA tìm tiến trình gây khóa (Blocking) trên MS SQL Server
```sql
-- Kiểm tra ngay phiên nào đang khóa (Blocking) phiên nào trên SQL Server
SELECT
    r.session_id AS [Blocked_SPID],
    r.blocking_session_id AS [Blocking_SPID],
    DB_NAME(r.database_id) AS [DatabaseName],
    r.wait_type,
    r.wait_time / 1000.0 AS [Wait_Seconds],
    s.login_name,
    s.host_name,
    s.program_name,
    SUBSTRING(t.text, (r.statement_start_offset/2)+1,
        ((CASE r.statement_end_offset WHEN -1 THEN DATALENGTH(t.text) ELSE r.statement_end_offset END - r.statement_start_offset)/2)+1) AS [Executing_SQL]
FROM sys.dm_exec_requests r
INNER JOIN sys.dm_exec_sessions s ON r.session_id = s.session_id
CROSS APPLY sys.dm_exec_sql_text(r.sql_handle) t
WHERE r.blocking_session_id <> 0
ORDER BY r.wait_time DESC;
```

---

## Liên kết trong Hệ sinh thái Tri thức
- [[checklist-chuan-bi-xay-kenh-youtube-ngoai]] - Lộ trình chuẩn bị xây kênh YouTube nước ngoài từ con số 0 (tận dụng hạ tầng VPS/Proxy & Antidetect Browser).
- [[he-sinh-thai-khoa-hoc-ai-va-5-tools]] - Bản vẽ chiến lược kinh doanh 2 Khóa học AI/Solo & Bộ 5 Công cụ tự động.
- [[opc-doanh-nghiep-khong-nhan-vien]] - Mô hình Doanh nghiệp 1 người (OPC) vận hành bằng đội ngũ AI.

- Xem thêm bản đồ tổng chỉ huy: [[so-do-5-phong-ban-va-15-du-an]]
