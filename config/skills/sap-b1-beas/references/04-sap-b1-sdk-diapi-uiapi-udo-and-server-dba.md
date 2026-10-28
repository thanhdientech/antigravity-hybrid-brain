---
type: source
source_kind: article
status: processed
created: '2026-10-18'
processed_at: '2026-10-18'
wiki_links:
  - '[[cam-nang-sql-fms-sdk-dtw-va-quan-tri-server]]'
---
# LẬP TRÌNH SAP B1 SDK (DI API, UI API, SERVICE LAYER, UDO), DTW IMPORT MASTER DATA & QUẢN TRỊ SERVER MS SQL DBA

Tài liệu kỹ thuật tổng hợp từ bộ tài liệu gốc của SAP Business One SDK (`<WORKSPACE_DIR>\SQL SAP B1\Help`: `REFDB.chm`, `REFDI.chm`, `REFUI.chm`, `SDK_EN.chm`, `Creating a UDO.pps`) kết hợp quy trình chuẩn hóa `Data Transfer Workbench (DTW)` và Quản trị Hạ tầng MS SQL Server dành cho đội ngũ Kỹ sư Phần mềm & DBA của công ty **Enterprise**.

---

## 1. LẬP TRÌNH SAP BUSINESS ONE SDK: DI API (`SAPbobsCOM`) & UI API (`SAPbouiCOM`)

### 1.1. Kiến Trúc DI API (`SAPbobsCOM` - Data Interface API, Tham chiếu `REFDI.chm`)
- **Chức năng cốt lõi:** DI API cung cấp các đối tượng COM (Component Object Model) chứa sẵn toàn bộ logic nghiệp vụ, kiểm tra ràng buộc kế toán, tồn kho và tự động sinh bút toán `OJDT` khi Thêm/Sửa/Hủy dữ liệu mà không cần qua giao diện người dùng.
- **Các đối tượng (`BoObjectTypes`) quan trọng nhất trong `SAPbobsCOM`:**
  - `SAPbobsCOM.Company`: Đối tượng quản lý phiên kết nối (`Connect()`, `Disconnect()`, `StartTransaction()`, `EndTransaction(BoWfTransOpt.wf_Commit / wf_RollBack)`, `GetLastError(out int errCode, out string errMsg)`).
  - `SAPbobsCOM.Documents`: Đại diện cho các chứng từ Marketing (`oOrder = oCompany.GetBusinessObject(BoObjectTypes.oOrders)`, `oInvoice = ...oInvoices`, `oPurchaseOrders`, `oPurchaseDeliveryNotes`, `oInventoryGenEntry`, `oInventoryGenExit`).
  - `SAPbobsCOM.Items` (`BoObjectTypes.oItems`): Quản lý Item Master Data (`OITM`, `OITW`, `ITM1`).
  - `SAPbobsCOM.BusinessPartners` (`BoObjectTypes.oBusinessPartners`): Quản lý Khách hàng / Nhà cung cấp (`OCRD`, `CRD1`, `OCPR`).
  - `SAPbobsCOM.ProductionOrders` (`BoObjectTypes.oProductionOrders`): Tạo, phát hành (`ProductionOrderStatusEnum.boposReleased`), cập nhật dòng `WOR1` và đóng Lệnh sản xuất (`OWOR`).
  - `SAPbobsCOM.JournalEntries` (`BoObjectTypes.oJournalEntries`): Tạo phiếu kế toán `OJDT/JDT1`.
  - `SAPbobsCOM.Recordset` (`BoObjectTypes.BoRecordset`): Thực thi truy vấn đọc dữ liệu (`DoQuery(sql)`).
- **Quy tắc Vàng chống tràn bộ nhớ (`Memory Leak`) khi viết DI API bằng C# / .NET:**
  - Vì `SAPbobsCOM` là Unmanaged COM Object, Garbage Collector của .NET không tự giải phóng ngay. Sau khi dùng xong `Recordset`, `Documents`, hoặc `Items`, bắt buộc phải gọi:
    ```csharp
    if (oRecordset != null)
    {
        System.Runtime.InteropServices.Marshal.ReleaseComObject(oRecordset);
        oRecordset = null;
    }
    ```

### 1.2. Kiến Trúc UI API (`SAPbouiCOM` - User Interface API, Tham chiếu `REFUI.chm`)
- **Chức năng cốt lõi:** Cho phép Add-on can thiệp trực tiếp vào màn hình SAP Business One Client, thêm Menu mới, thêm nút bấm (`Button`), lưới (`Matrix` / `Grid`), bắt sự kiện người dùng và điều chỉnh giao diện chuẩn của SAP.
- **Kết nối `Single Sign-On (SSO)` giữa UI API và DI API:**
  - Sử dụng `SboGuiApi` kết nối với chuỗi Connection String chuẩn (`0030002C0030002C00530041005000420044005F00440061007400650076002C0050004C006F006D0056004900490056`), lấy `SAPbouiCOM.Application` và chia sẻ phiên đăng nhập sang `SAPbobsCOM.Company` qua `oCompany = (SAPbobsCOM.Company)SBO_Application.Company.GetDICompany();` (không tốn thêm License DI).
- **3 Bộ Sự Kiện (`Events`) Trọng Tâm Trong UI API:**
  1. **`ItemEvent` (`SBO_Application_ItemEvent`):** Bắt các thao tác trên Control của Form (`et_ITEM_PRESSED`, `et_CHOOSE_FROM_LIST`, `et_VALIDATE`, `et_COMBO_SELECT`, `et_FORM_LOAD`, `et_LOST_FOCUS`).
     - Luôn phân biệt 2 pha: **`pVal.BeforeAction == true`** (xảy ra trước khi SAP xử lý; nếu gán `BubbleEvent = false` sẽ chặn hành động đó lại) và **`pVal.BeforeAction == false`** (xảy ra sau khi SAP đã xử lý xong).
  2. **`FormDataEvent` (`SBO_Application_FormDataEvent`):** Bắt sự kiện dữ liệu cấp độ Form (`et_FORM_DATA_ADD`, `et_FORM_DATA_UPDATE`, `et_FORM_DATA_LOAD`, `et_FORM_DATA_DELETE`). Đây là nơi chuẩn nhất để lấy `DocEntry` (dạng XML qua `BusinessObjectInfo.ObjectKey`) ngay sau khi người dùng nhấn nút `Add` thành công (`BusinessObjectInfo.ActionSuccess == true`).
  3. **`MenuEvent` (`SBO_Application_MenuEvent`):** Bắt sự kiện khi người dùng nhấn vào thanh Menu trên cùng hoặc các nút `Add Record (1282)`, `Find (1281)`, `Duplicate (1287)`, `Cancel (1284)`.
- **Tối ưu hiệu năng UI với `Form.Freeze(true)`:**
  - Trước khi cập nhật hàng loạt dòng trên `Matrix` hoặc `Grid`, luôn gọi `oForm.Freeze(true);` trong khối `try` và đặt `oForm.Freeze(false);` trong khối `finally` để màn hình không bị nhấp nháy và tăng tốc độ gấp 10 lần.

---

## 2. QUY TRÌNH ĐĂNG KÝ UDT, UDF & UDO (`USER-DEFINED OBJECT` - THAM CHIẾU `CREATING A UDO.PPS`)

Khi khách hàng của Enterprise có một nghiệp vụ đặc thù không có sẵn màn hình trong SAP B1 (ví dụ: *Quản lý Hợp đồng Bảo trì*, *Phiếu Yêu cầu Cấp phát Khuôn mẫu*, *Định mức Hoa hồng Đại lý*), kỹ sư sử dụng **UDO (`User-Defined Object`)** thay vì tạo bảng SQL bên ngoài:

### 2.1. Phân Biệt 2 Loại UDT / UDO Chuẩn SAP B1

| Đặc điểm | Loại 1: `Master Data` & `Master Data Rows` | Loại 2: `Document` & `Document Rows` |
| :--- | :--- | :--- |
| **Mục đích sử dụng** | Lưu danh mục chủ có mã duy nhất do người dùng hoặc hệ thống đặt (VD: Danh mục Khuôn mẫu, Danh mục Tuyến giao hàng). | Lưu chứng từ giao dịch phát sinh theo ngày tháng, có đánh số tự động `DocNum` theo `Series` và có trạng thái `Open / Closed / Canceled`. |
| **Bảng Header & Line trong SQL** | `@[TEN_HEADER]` và `@[TEN_LINE]` | `@[TEN_HEADER]` và `@[TEN_LINE]` |
| **Khóa chính tự động sinh** | Header: **`Code`** (`NVARCHAR(50)`), **`Name`** (`NVARCHAR(100)`).<br>Line: **`Code`**, **`LineId`**. | Header: **`DocEntry`** (`INT`), **`DocNum`**, `Series`, `Status`, `Canceled`, `CreateDate`, `UserSign`.<br>Line: **`DocEntry`**, **`LineId`**, `VisOrder`. |
| **Bảng siêu dữ liệu quản lý** | `OUTB` (Danh sách UDT), `CUFD` (Danh sách UDF), `UFD1` (Valid Values của UDF), `OUDO` / `UDO1` (Định nghĩa UDO). | Tương tự: quản lý tập trung tại `OUTB`, `CUFD`, `OUDO`, `UDO1`, `UDO2`, `UDO3`. |

### 2.2. Quy Trình 5 Bước Khởi Tạo UDO (`Objects Registration Wizard`)
1. **Bước 1 - Tạo Bảng UDT (`Tools -> Customization Tools -> User-Defined Tables - Setup`):**
   - Tạo bảng Header (chọn đúng kiểu `Master Data` hoặc `Document`) và bảng Line (chọn `Master Data Rows` hoặc `Document Rows`).
2. **Bước 2 - Tạo Trường UDF (`User-Defined Fields - Management`):**
   - Mở mục `User Tables`, chọn bảng vừa tạo và thêm các trường dữ liệu cần thiết (hệ thống tự động thêm tiền tố `U_` vào tên cột trong SQL, ví dụ: `U_CardCode`, `U_Amount`, `U_Status`).
3. **Bước 3 - Chạy `Objects Registration Wizard` (`Tools -> Customization Tools -> Objects Registration Wizard`):**
   - Chọn `Add a New Object` -> Đặt `Unique ID` (Mã UDO, không chứa khoảng trắng), `Name`, và chọn `Type` (`Master Data` hoặc `Document`) khớp với bảng Header.
4. **Bước 4 - Bật các dịch vụ tự động của UDO (`Services`):**
   - `Find` (Cho phép bấm `Ctrl + F` tìm kiếm theo các cột được chọn).
   - `Delete` / `Cancel` / `Close` (Quản lý vòng đời chứng từ).
   - `Year Transfer` / `Log` (Nếu tích `Log`, SAP tự động tạo bảng lịch sử `@A...` để lưu mọi lần chỉnh sửa phục vụ kiểm toán).
   - `Manage Series` (Cho phép đánh số chứng từ UDO trong `Document Numbering - NNM1`).
   - `Default Form` (Tự động sinh màn hình nhập liệu chuẩn SAP B1 hoặc gắn file giao diện `.srf` thiết kế từ SAP B1 Studio).
5. **Bước 5 - Liên kết Bảng Con (`Child Tables`):**
   - Tick chọn các bảng Line (`Document Rows` / `Master Data Rows`) thuộc về UDO này và nhấn `Finish`.

---

## 3. TÍCH HỢP HIỆN ĐẠI QUA SAP B1 SERVICE LAYER REST API (ODATA V3/V4 - PORT 50000)

Đối với cả bản SAP B1 10.0 MS SQL và HANA, **Service Layer** (cổng mặc định `https://[Server]:50000/b1s/v1/` hoặc `/b1s/v2/`) là chuẩn tích hợp RESTful hiện đại nhất để kết nối với Web App, Mobile App, Hóa đơn điện tử, WMS và n8n:

1. **Đăng nhập lấy Session Cookie (`POST /b1s/v1/Login`):**
   ```json
   {
     "CompanyDB": "SBODemoVN",
     "UserName": "manager",
     "Password": "YourPassword"
   }
   ```
   - Kết quả trả về `B1SESSION` và `ROUTEID` trong `Set-Cookie`. Tái sử dụng Cookie này cho các request tiếp theo trong thời gian `SessionTimeout` (mặc định 30 phút) thay vì gọi Login liên tục.
2. **Đọc dữ liệu tối ưu với OData Query Options (`GET`):**
   - Luôn chỉ định `$select` để giảm dung lượng JSON trả về và `$top` / `$skip` để phân trang:
     `GET https://server:50000/b1s/v1/Orders?$select=DocEntry,DocNum,CardCode,DocTotal&$filter=DocStatus eq 'O' and DocDate ge '2026-01-01'&$top=50&$skip=0`
3. **Tạo mới Chứng từ (`POST /b1s/v1/Orders`, `/Invoices`, `/PurchaseDeliveryNotes`):**
   ```json
   {
     "CardCode": "C20000",
     "DocDate": "2026-10-18",
     "DocDueDate": "2026-10-25",
     "DocumentLines": [
       {
         "ItemCode": "A00001",
         "Quantity": 10,
         "UnitPrice": 150000,
         "WarehouseCode": "01",
         "CostingCode": "CC_SALES"
       }
     ]
   }
   ```

---

## 4. CHUẨN HÓA QUY TRÌNH DTW (`DATA TRANSFER WORKBENCH`) IMPORT MASTER DATA & SỐ DƯ ĐẦU KỲ

Khi triển khai dự án SAP B1 mới tại Enterprise, thứ tự nạp dữ liệu qua **DTW** bắt buộc phải tuân thủ chuỗi phụ thuộc khóa ngoại sau đây để không bị lỗi:

### 4.1. Thứ Tự 8 Bước Import Dữ Liệu Chuẩn Khi Go-Live
1. **Bước 1 - Hệ thống Tài khoản (`Chart of Accounts - OACT`):** Import từ cấp cha (`Level 1`) xuống cấp con (`Level 2, 3, 4, 5`). Lưu ý cột `FatherAccountKey` phải tồn tại trước, tài khoản tổng hợp để `ActiveAccount = tNO`, tài khoản chi tiết hạch toán để `ActiveAccount = tYES`.
2. **Bước 2 - Danh mục Phụ trợ:** Nhóm Khách hàng/NCC (`OCRG`), Nhóm Vật tư (`OITB`), Điều khoản thanh toán (`OCTG`), Nhân viên kinh doanh (`OSLP`), Trung tâm chi phí (`OPRC`), Kho hàng (`OWHS`) và Vị trí Bin (`OBIN`).
3. **Bước 3 - Danh mục Đối tác Kinh doanh (`Business Partner Master Data`):** Nạp cùng lúc 3 file Template liên kết bằng `RecordKey` / `ParentKey`:
   - `OCRD` (Header BP), `CRD1` (BPAddresses - Địa chỉ giao hàng/hóa đơn), `OCPR` (ContactEmployees - Người liên hệ).
4. **Bước 4 - Danh mục Vật tư Hàng hóa (`Item Master Data`):**
   - `OITM` (Items), `OITW` (ItemWarehouseInfo - Kho áp dụng & định mức tồn Min/Max), `ITM1` (Items_Prices - Bảng giá).
5. **Bước 5 - Định mức Sản xuất (`BOM` & `Routing`):**
   - Với sản xuất chuẩn SAP: `OITT` (ProductTrees) + `ITT1` (ProductTrees_Lines).
   - Với Beas Manufacturing: Dùng công cụ `Beas Import` hoặc script chuẩn nạp `BEAS_APLATZ`, `BEAS_STL_HEADER`/`BEAS_STL`, `BEAS_APL_HEADER`/`BEAS_APL`.
6. **Bước 6 - Số dư Đầu kỳ Tài khoản Kế toán (`G/L Opening Balances`):** Dùng chức năng `Opening Balances` hoặc `Journal Entries (OJDT + JDT1)` đối ứng qua tài khoản trung gian `9999` (Tài khoản chuyển đổi số dư đầu kỳ).
7. **Bước 7 - Số dư Đầu kỳ Công nợ Khách hàng / NCC (`BP Opening Balances`):** Nạp chi tiết theo từng hóa đơn còn nợ (`A/R & A/P Service Invoices` hoặc `Opening Balance`) để theo dõi đúng tuổi nợ (`Aging Report`) theo `DocDueDate`.
8. **Bước 8 - Số dư Đầu kỳ Tồn kho (`Inventory Opening Balances - OIQR/IGN1`):** Nạp qua `Inventory Opening Balance` hoặc `Goods Receipt (OIGN + IGN1 + BatchNumbers/SerialNumbers)` đối ứng với tài khoản trung gian `9999`. Sau khi nạp xong cả 3 bước (6, 7, 8), số dư tài khoản `9999` bắt buộc phải bằng **`0`**.

### 4.2. Bảng Xử Lý Nhanh Các Mã Lỗi DTW Thường Gặp Nhất

| Mã lỗi DTW | Thông báo lỗi điển hình | Nguyên nhân gốc rễ & Cách xử lý triệt để |
| :---: | :--- | :--- |
| **`-10`** | `Invalid value / Field cannot be updated` | Giá trị truyền vào không đúng kiểu (`tYES`/`tNO` bị gõ thành `Y`/`N` trên một số trường hệ thống), hoặc mã khóa ngoại (`GroupCode`, `WhsCode`, `UomEntry`) chưa được tạo trong SAP B1. |
| **`-5002`** | `Linked value does not exist / Account is not active` | Tài khoản kế toán gắn vào dòng chứng từ là tài khoản cấp cha (`Title Account / Postable = 'N'`), hoặc mã `CardCode`/`ItemCode` có chứa khoảng trắng thừa ở cuối chuỗi trong file Excel. Dùng hàm `=TRIM(CLEAN(A2))` trước khi lưu CSV/TXT. |
| **`-2028`** | `No matching records found (ODBC -2028)` | Khi chạy chế độ `Update` nhưng mã `ItemCode`/`CardCode`/`DocEntry` trong file không tồn tại trong Database, hoặc `LineNum` truyền vào không khớp với dòng thực tế. |
| **`65171`** | `Invalid column name / Format error` | Dòng thứ 1 và dòng thứ 2 của file Template DTW bị lệch cột, hoặc file lưu định dạng CSV trên máy Windows dùng dấu chấm phẩy (`;`) thay vì dấu phẩy (`,`). **Khuyến nghị vàng của Enterprise:** Luôn lưu file DTW dưới định dạng **`Text (Tab delimited) (*.txt)`** hoặc **`Unicode Text (*.txt)`** để giữ nguyên tiếng Việt có dấu và không bao giờ lỗi dấu phân cách! |

---

## 5. QUẢN TRỊ MS SQL SERVER & WINDOWS SERVER CHO HỆ THỐNG SAP B1 / BEAS

### 5.1. Cấu Hình Tối Ưu MS SQL Server Cho SAP Business One
1. **Giới hạn RAM tối đa cho SQL Server (`Max Server Memory`):** Không bao giờ để mặc định (`2147483647 MB`). Phải chừa lại tối thiểu `8 GB - 16 GB RAM` cho Windows Server, `SLD`, `Service Layer`, và `Beas Common Service` (VD: Server 64 GB RAM thì đặt `Max Server Memory = 48000 MB`).
2. **Tách ổ đĩa vật lý SSD/NVMe:** Tách riêng ổ chứa Data (`.mdf`), ổ chứa Transaction Log (`.ldf`), và ổ chứa `tempdb` (cấu hình từ 4 đến 8 file `tempdb` có kích thước bằng nhau).
3. **Bảo trì định kỳ hàng tuần (`SQL Server Agent Maintenance Plan`):**
   - Chạy **`UPDATE STATISTICS`** và **`ALTER INDEX ... REORGANIZE / REBUILD`** vào tối Chủ nhật cho các bảng giao dịch lớn (`OINM`, `OIVL`, `JDT1`, `INV1`, `DLN1`, `BEAS_ARBZEIT`, `BEAS_FTSTL`).
   - Chiến lược Backup 3-2-1: `Full Backup` mỗi đêm lúc 23:00, `Transaction Log Backup` mỗi 1-2 giờ trong giờ hành chính, và tự động copy bản backup sang NAS/Cloud khác máy chủ vật lý.

### 5.2. Bộ Câu Lệnh SQL DBA Chẩn Đoán Nhanh Blocking & Top Truy Vấn Chậm

```sql
-- 1. Tìm ngay phiên (SPID) đang gây khóa (Blocking) làm treo màn hình SAP B1 của người dùng
SELECT
    r.session_id            AS [Blocked_SPID],
    r.blocking_session_id   AS [Blocking_SPID],
    DB_NAME(r.database_id)  AS [DatabaseName],
    r.wait_type             AS [Wait_Type],
    r.wait_time / 1000.0    AS [Wait_Seconds],
    s.login_name            AS [SQL_Login],
    s.host_name             AS [Client_Workstation],
    s.program_name          AS [Application_Name],
    t.text                  AS [Full_SQL_Batch]
FROM sys.dm_exec_requests r
INNER JOIN sys.dm_exec_sessions s ON r.session_id = s.session_id
CROSS APPLY sys.dm_exec_sql_text(r.sql_handle) t
WHERE r.blocking_session_id <> 0
ORDER BY r.wait_time DESC;

-- 2. Kiểm tra kích thước các Database SAP B1 và dung lượng file Log (.ldf)
SELECT
    DB_NAME(database_id) AS [Database_Name],
    Name                 AS [Logical_File_Name],
    Physical_Name        AS [File_Path],
    type_desc            AS [File_Type],
    CAST(size * 8.0 / 1024 AS DECIMAL(18,2)) AS [Size_MB]
FROM sys.master_files
WHERE DB_NAME(database_id) NOT IN ('master', 'tempdb', 'model', 'msdb')
ORDER BY [Size_MB] DESC;
```
