---
name: viet-sql-sap-b1
description: "Viết & test T-SQL / HANA SQLScript SAP B1 & Beas: nối bảng chuẩn, FMS, TransactionNotification & kho 323 mẫu SQL thực chiến."
group: "ERP SAP B1 & SQL"
---

# Viết & Kiểm Thử SQL SAP B1 / Beas Manufacturing — Bộ Kỹ Năng Đã Băm Nhỏ (Smart-Loading)

<!-- JAVIS_TRIGGER_ARCHIVE_START -->
## Khi nào dùng (Triggers & Ngữ cảnh kích hoạt đầy đủ)

> Kỹ sư Trưởng Viết & Test SQL SAP Business One (9.3 & 10.0 MS SQL T-SQL / HANA SQLScript) & Boyum IT Beas Manufacturing trên 4 Server / 19 Database (Server A, Server C, Server B, Server D). Bao gồm: Quy tắc vàng nối bảng (DocEntry, BaseEntry, BaseLine, BaseType, ObjType), Quy trình bắt buộc Hỏi Database cần khớp số & Chạy thử Query đọc kết quả so sánh (sap_readonly_user), viết Formatted Search (FMS $[$Item.Col.0]), viết SBO_SP_TransactionNotification & PostTransactionNotice, Kho 24 câu query thực chiến SBO_MFG và Kho 299 file .sql chuẩn từ Help SAP B1. TRIGGERS: "viết sql", "viet sql", "viết query sap", "query sap b1", "test query sap", "fms sap", "formatted search", "transaction notification", "sbo_sp_transactionnotification", "join bảng sap", "baseentry", "docentry", "query beas", "câu lệnh sql sap".
<!-- JAVIS_TRIGGER_ARCHIVE_END -->

Skill này đóng gói toàn bộ quy tắc kỹ thuật viết **T-SQL (MS SQL Server) / SQLScript (SAP HANA)**, **Formatted Search (FMS)**, **`SBO_SP_TransactionNotification`**, quy trình **Kết nối 4 Server (`24`, `52`, `160`, `27`) chạy thử Query & đọc kết quả so sánh khớp số**, cùng **24 câu lệnh SQL thực chiến phức tạp của SBO_MFG** và **299 file `.sql` chuẩn theo 34 phân hệ**.

---

## 1. Bảng Điều Hướng Nạp Thông Minh (Smart-Loading Reference Index)

Khi người dùng yêu cầu viết câu lệnh SQL, FMS, hoặc Stored Procedure cho một phân hệ cụ thể, **chỉ đọc (`read_file`) đúng file tham chiếu tương ứng** trong `references/`:

| STT | File trong `references/` | Nội dung đã băm nhỏ | Khi nào cần nạp (Trigger / Chủ đề) |
| :--- | :--- | :--- | :--- |
| **01** | `references/01-sap-b1-93-vs-100-sql-join-fms-tn.md` | Quy tắc nối bảng `DocEntry` / `BaseEntry`, bảng mã `ObjType`, khung chuẩn `SBO_SP_TransactionNotification` & cú pháp FMS `$[$Item.Col.0]`. | Khi viết nối chuỗi chứng từ, viết FMS tự động điền trên Form, hoặc viết chặn lỗi `TransactionNotification`. |
| **02** | `references/02-cam-nang-sql-fms-sdk-dtw-va-quan-tri-server.md` | Cẩm nang viết SQL tối ưu Index, chống Blocking/Deadlock, `WITH (NOLOCK)`, thiết kế tham số Query Generator `[%0]` và Crystal Reports. | Khi tối ưu câu SQL chạy chậm, thiết kế báo cáo có tham số lọc ngày/kho trên SAP Query Manager. |
| **03** | `references/03-kho-24-query-thuc-chien-mfg-sap-b1-beas.md` | Trọn bộ **24 câu lệnh SQL thực chiến phức tạp** trên hệ thống SBO_MFG (`SYNC_SBO_MFG_PROD_SSMS`): Sản xuất Beas, Giá thành WIP, Mua-Bán-Kho, Tài chính. | Khi cần mẫu SQL thực chiến nâng cao kết hợp bảng SAP B1 + bảng Beas + UDF (`U_*`). |
| **04** | `references/04-ky-su-sql-fms-transaction-notification-guide.md` | Quy trình 4 bước của Kỹ sư Trưởng SQL SAP B1 & quy ước kiểm tra schema trước khi viết query. | Khi cần kiểm tra quy trình chuẩn viết SQL cho khách hàng. |
| **05** | `references/05-chunk-queries-production-beas-costing.md` | **Học phần SQL Sản xuất & Giá thành**: Tổng hợp các file `.sql` từ `06.Production Queries`, `97.Production Cost Analysis`, `Production`, `SYNC_SBO_MFG_PROD\Production`, `SYNC_SBO_PLANT_C\05. Production`, `Cost_Anomaly_Detection.sql`. | Khi viết SQL về Lệnh sản xuất (`OWOR`/`WOR1` hoặc `BEAS_FTHAUPT`/`BEAS_FTPOS`/`BEAS_FTSTL`/`BEAS_ARBZEIT`), phân tích giá thành, phát hiện bất thường giá vốn. |
| **06** | `references/06-chunk-queries-finance-accounting-closing.md` | **Học phần SQL Tài chính & Kế toán**: Tổng hợp các file `.sql` từ `01.Finance Queries`, `Accounting`, `Financials`, `Banking`, `Fixed Asset`, `Ke Toan`, `98.Monthly closing`, `Customer_Aging_Report.sql`. | Khi viết SQL về Sổ cái (`OJDT`/`JDT1`), Bảng cân đối, Công nợ phải thu/phải trả (`Aging`), Dòng tiền, Tài sản cố định, Khóa sổ cuối tháng. |
| **07** | `references/07-chunk-queries-sales-purchasing-ar-ap.md` | **Học phần SQL Bán hàng & Mua hàng**: Tổng hợp các file `.sql` từ `02.Sales Queries`, `03.Purchase Queries`, `Sales and Purchasing`, `Sales AR`, `SYNC_*\Purchasing AP`, `Delivery_and_SalesOrder.sql`, `Recent_Deliveries.sql`. | Khi viết SQL về Đơn bán hàng (`ORDR`), Giao hàng (`ODLN`), Hóa đơn AR (`OINV`), Đơn mua hàng (`OPOR`), Nhập kho GRPO (`OPDN`), Hóa đơn AP (`OPCH`). |
| **08** | `references/08-chunk-queries-inventory-mrp-qc-masterdata-hr.md` | **Học phần SQL Tồn kho, MRP, QC, Master Data & HR**: Tổng hợp các file `.sql` từ `04.MRP Queries`, `05.Inventory Queries`, `Inventory`, `MRP`, `QC`, `99.Master Data Queries`, `Business Partners`, `Human Resources`, `Service`, `00.Formulas`. | Khi viết SQL về Tồn kho (`OITM`/`OITW`/`OINM`), Lô/Serial (`OBTN`/`OSRN`), MRP, QC, Danh mục vật tư/khách hàng, Nhân sự. |
| **09** | `references/09-sap-b1-207-help-queries-catalog.md` | Danh mục tra cứu 207 câu lệnh SQL chuẩn từ Help SAP B1. | Khi cần tra cứu nhanh toàn bộ 207 câu query chuẩn của SAP B1. |
| **10** | `references/queries/<Folder>/<File>.sql` | **299 file `.sql` nguyên bản** được phân loại trong 34 thư mục con. | Khi cần đọc trực tiếp 1 file `.sql` đơn lẻ siêu nhẹ (< 2 KB). |

---

## 2. Năm Quy Tắc Vàng Bất Biến Khi Viết SQL SAP B1 & Beas

### Quy tắc 1: Nối Bảng Header $\leftrightarrow$ Detail & Chuỗi Chứng Từ (`Base -> Target`)
- **Nối Header với Detail cùng một chứng từ**: Bắt buộc dùng **`T0.DocEntry = T1.DocEntry`** (Tuyệt đối **KHÔNG** nối bằng `DocNum` vì `DocNum` có thể trùng khi đổi Series `NNM1` theo năm).
- **Nối Chứng từ Gốc (Upstream) sang Chứng từ Đích (Downstream)** (ví dụ `ORDR/RDR1` $\rightarrow$ `ODLN/DLN1` $\rightarrow$ `OINV/INV1`, hoặc `OPOR/POR1` $\rightarrow$ `OPDN/PDN1` $\rightarrow$ `OPCH/PCH1`):
  ```sql
  FROM ODLN T0
  INNER JOIN DLN1 T1 ON T0.DocEntry = T1.DocEntry
  LEFT JOIN RDR1 S1 ON T1.BaseEntry = S1.DocEntry
                   AND T1.BaseLine  = S1.LineNum
                   AND T1.BaseType  = 17 -- 17 = Sales Order (ORDR)
  LEFT JOIN ORDR S0 ON S1.DocEntry  = S0.DocEntry
  ```
- **Nối Bảng Giao Dịch Lô/Batch (`OITL` / `ITL1` / `OBTN`) với Bảng Dòng Chứng Từ**:
  - Khi lấy Lô trực tiếp của chính chứng từ đó (`S0.DocEntry = T2.DocEntry` và `S0.DocType = T2.ObjType`), bắt buộc nối **`S0.DocLine = T2.LineNum`** (tuyệt đối không nhầm với `T2.BaseLine`).
- **Bảng mã `ObjType` / `BaseType` thông dụng nhất**:
  - **Bán hàng (A/R)**: `23` = Báo giá (`OQUT`), `17` = Đơn hàng bán (`ORDR`), `15` = Giao hàng (`ODLN`), `16` = Hàng bán trả lại (`ORDN`), `203` = A/R Down Payment (`ODPI`), `13` = Hóa đơn bán (`OINV`), `14` = A/R Credit Memo (`ORIN`).
  - **Mua hàng (A/P)**: `1470000113` = Yêu cầu mua hàng (`OPRQ`), `540000006` = Báo giá mua (`OPQT`), `22` = Đơn mua hàng (`OPOR`), `20` = Nhập kho mua hàng GRPO (`OPDN`), `21` = Trả hàng mua (`ORPD`), `204` = A/P Down Payment (`ODPO`), `18` = Hóa đơn mua (`OPCH`), `19` = A/P Credit Memo (`ORPC`), `69` = Chi phí mua hàng Landed Costs (`OIPF`).
  - **Kho & Sản xuất**: `59` = Nhập kho khác / Nhập thành phẩm (`OIGN`), `60` = Xuất kho khác / Xuất NVL (`OIGE`), `67` = Chuyển kho (`OWTR`), `1250000001` = Yêu cầu chuyển kho (`OWTQ`), `162` = Đánh giá lại kho (`OMRV`), `202` = Lệnh sản xuất SAP chuẩn (`OWOR`).
  - **Tài chính & Ngân hàng**: `30` = Bút toán sổ cái Journal Entry (`OJDT`), `24` = Thu tiền (`ORCT`), `46` = Chi tiền (`OVPM`).

### Quy tắc 2: Công Thức Tồn Kho, Số Lượng Còn Lại (`OpenQty`) & Giá Trị Còn Lại (`Open Value`)
- **Tồn kho khả dụng (Available)**:
  $$\text{Available} = \text{OnHand} - \text{IsCommited} + \text{OnOrder}$$
- **Truy vấn lịch sử nhập xuất tồn theo ngày lịch sử**: Dùng `SUM(ISNULL(T0.InQty, 0) - ISNULL(T0.OutQty, 0))` và `SUM(ISNULL(T0.TransValue, 0))` trên bảng **`OINM`** lọc theo `T0.DocDate <= @ToDate`.
- **Số lượng còn lại (`OpenQty`) & Giá trị còn lại (`Open Value`) trên chứng từ hàng hóa (`POR1`, `PDN1`, `RDR1`, `DLN1`)**:
  - Khi dòng chứng từ đã đóng (`LineStatus = 'C'`), trên một số bảng như `PDN1` cột `OpenQty` vẫn giữ nguyên số lượng gốc và cột `OpenSum` không tự giảm khi kéo một phần số lượng mặt hàng (*Item*).
  - Bắt buộc dùng:
    - `OpenQty chuẩn`: `CASE WHEN LineStatus = 'C' THEN 0 ELSE OpenQty END`
    - `Open Value chuẩn`: `CASE WHEN LineStatus = 'C' OR ISNULL(Quantity, 0) = 0 THEN 0 ELSE LineTotal_Or_TotalFrgn * (OpenQty / Quantity) END`

### Quy tắc 3: Cú Pháp Viết Formatted Search (FMS) Chuẩn SAP B1
- **Cú pháp lấy giá trị trực tiếp trên màn hình đang mở (chưa lưu vào DB)**:
  - Lấy theo Item ID và Column ID trên lưới (Matrix): **`$[$ItemID.ColID.0]`** (kiểu chuỗi/mã) hoặc **`$[$ItemID.ColID.NUMBER]`** (kiểu số) hoặc **`$[$ItemID.ColID.DATE]`**.
- **Tham số lọc của SAP Query Manager**: Dùng `[%0]`, `[%1]`, `[%2]`...

### Quy tắc 4: Mẫu Khung Chuẩn `SBO_SP_TransactionNotification` (Chốt Chặn Nghiệp Vụ)
- Chỉ kiểm tra dữ liệu (`SELECT`) và gán `@error` + `@error_message` để SAP B1 tự động rollback giao dịch khi vi phạm quy tắc. **Cấm tuyệt đối** viết lệnh `UPDATE`/`INSERT`/`DELETE` lên bảng chuẩn SAP bên trong `SBO_SP_TransactionNotification`!

### Quy tắc 5: Khác Biệt Cú Pháp MS SQL Server (`T-SQL`) vs SAP HANA (`SQLScript`)
| Hạng mục | MS SQL Server (`T-SQL` — Server A, 160, 52, 27) | SAP HANA (`SQLScript`) |
| :--- | :--- | :--- |
| **Xử lý NULL** | `ISNULL(Field, 0)` | `IFNULL("Field", 0)` |
| **Giới hạn số dòng** | `SELECT TOP 100 ...` | `SELECT ... LIMIT 100` |
| **Chuỗi Unicode & Tên cột** | `N'Chuỗi tiếng Việt'`, `[U_Field]` | `'Chuỗi tiếng Việt'`, `"U_Field"` (nhạy hoa/thường!) |
| **Nối chuỗi** | `A + B` hoặc `CONCAT(A, B)` | `A \|\| B` |
| **Ngày hiện tại** | `GETDATE()` | `CURRENT_DATE` / `NOW()` |
| **Đọc không khóa bảng** | `WITH (NOLOCK)` | Không dùng `WITH (NOLOCK)` (HANA dùng MVCC tự động) |

---

## 3. Quy Trình Bắt Buộc: Định Tuyến Cú Pháp, Quản Lý Session & Thoát Session

### 3.1. Bảng Cú Pháp & Quy Tắc Mặc Định Bất Biến
- **MẶC ĐỊNH TOÀN HỆ THỐNG (Khi hỏi tự do / không có tiền tố `/`):** 100% trỏ vào **Server A (`10.0.0.10` - Database `SBO_MAIN_PROD`)**. Cấm tự động chuyển sang Server B hay Server C khi câu hỏi hiện tại không có tiền tố chỉ định.
- **Danh sách Cú pháp 4 Server & 19 Database đã mở (`HasAccess = 1`):**
  1. **Hỏi tự do hoặc `/24` (MẶC ĐỊNH):** Server A (`10.0.0.10` - `SAP-SQL-SRV01`, SAP 10.0 + Beas): Database chính **`SBO_MAIN_PROD`**, các DB phụ: `SBO_MAIN_TRAIN`, `SBO_BRANCH_SUB`, `SBO_MFG_BACKUP2`, `SBO_MFG_BACKUP1`, `SBO_PERIODIC_INV`, `SBO_BRANCH_US`, `e_office`, `GLaccount`, `SBO-COMMON`.
  2. **Cú pháp `/160`:** Server B (`10.0.0.20` - `SAP-SQL-SRV02`, SAP 9.3 + Beas): Database **`SBO_MFG_TRAIN`**.
  3. **Cú pháp `/160 HCM`:** Server B (`10.0.0.20`): Database **`SBO_MFG_PLANT1`**.
  4. **Cú pháp `/160 LT`:** Server B (`10.0.0.20`): Database **`SBO_MFG_PROD`**.
  5. **Cú pháp `/52`:** Server C (`10.0.0.30` - `SAP-SQL-SRV03`, SAP 9.3 + Beas): Database **`SBO_PLANT_C`**.
  6. **Cú pháp `/27` hoặc `/27 ECC`:** Server D (`10.0.0.40` - `SAP-SQL-SRV04`, SQL 2016): Database **`ECC`**.
  7. **Cú pháp `/27 HTL`:** Server D (`10.0.0.40`): Database **`SBO_PLANT_D_DEMO`**.
  8. **Cú pháp `/exit` / `/out` / `/reset`:** Thoát khỏi session hiện tại, thông báo đã thoát và quay về mặc định Server A `SBO_MAIN_PROD`.

### 3.2. Chốt Chặn Quản Lý Session & Thông Báo Thoát Session Bắt Buộc (Session Exit Gate)
- Nếu lượt trước đó người dùng đang truy vấn dữ liệu từ một Server riêng biệt (như Server B LT, Server B HCM, Server C, Server D):
- Khi người dùng gửi câu hỏi mới mà **KHÔNG CÒN GẮN LỆNH CÚ PHÁP SERVER ĐÓ NỮA**, hoặc khi người dùng gõ lệnh thoát (`/exit`, `/out`, `/reset`, `/24`):
- 👉 AI **BẮT BUỘC PHẢI THOÁT KHỎI SESSION CỦA DATA ĐÓ**, VÀ **BẮT BUỘC IN DÒNG THÔNG BÁO THOÁT SESSION Ở ĐẦU CÂU TRẢ LỜI**:
  `🔔 Đã thoát khỏi session của Server B LT (SBO_MFG_PROD), quay về mặc định Server A (SBO_MAIN_PROD).`
  *(Sau đó mới thực thi truy vấn trên Server A và in banner: `Em đang trả kết quả từ Server A (SBO_MAIN_PROD).`)*

### 3.3. Verify Độ An Toàn Dữ Liệu & Quy Trình Chạy Query
- **Tài khoản Read-Only 100%:** `sap_readonly_user` / `CHANGE_ME_STRONG_RO_PASSWORD!` thuộc role `db_datareader` và `db_denydatawriter`. Chặn 100% mọi thao tác `INSERT`, `UPDATE`, `DELETE`, `DROP`, `ALTER`, `TRUNCATE`, `EXEC`.
- **Hỏi Database cần test nếu người dùng muốn khớp số:**
  - Khi người dùng yêu cầu kiểm tra số liệu, đối chiếu chứng từ hoặc muốn **khớp số chính xác với màn hình SAP B1 của họ** mà chưa nêu rõ đang dùng Database nào $\rightarrow$ **BẮT BUỘC HỎI NGƯỜI DÙNG muốn chạy test và khớp số trên Server / Database nào** trong danh sách trên.
- **Chạy thử Query (`Exit code 0`):**
  - Dùng tài khoản `sap_readonly_user` kết nối tới Server / Database đích, kiểm tra schema và chạy thử câu lệnh SQL.
- **Đọc kết quả & So sánh đối chiếu trước khi trả lời:**
  - So sánh các cột liên quan (`Ordered Qty` vs `OpenQty`, `LineTotal` vs `Open Value`, `LineStatus`, `BaseLine` vs `LineNum`, kiểm tra `NULL` hoặc trùng dòng) để chắc chắn số liệu đúng 100% rồi mới xuất câu lệnh SQL.

---

## 4. Công Cụ Tìm Kiếm Nhanh Mẫu Câu Lệnh SQL (`scripts/search_sap_queries.py`)

Trước khi viết mới một câu SQL phức tạp, có thể chạy script tìm kiếm trong kho **299 file `.sql`** và **24 câu query thực chiến SBO_MFG**:
```powershell
python "%USERPROFILE%\.gemini\config\skills\viet-sql-sap-b1\scripts\search_sap_queries.py" "BEAS_FTHAUPT"
python "%USERPROFILE%\.gemini\config\skills\viet-sql-sap-b1\scripts\search_sap_queries.py" "Aging"
```
