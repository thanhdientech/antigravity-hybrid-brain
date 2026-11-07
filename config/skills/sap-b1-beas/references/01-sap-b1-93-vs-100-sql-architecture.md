---
type: source
source_kind: article
status: processed
created: '2026-10-18'
processed_at: '2026-10-18'
wiki_links:
  - '[[cam-nang-sap-b1-93-10-sql-va-beas-manufacturing]]'
  - '[[cam-nang-sql-fms-sdk-dtw-va-quan-tri-server]]'
---
# KIẾN TRÚC CƠ SỞ DỮ LIỆU SAP BUSINESS ONE 9.3 VS 10.0 TRÊN MS SQL SERVER, BẢNG MÃ OBJTYPE, TRANSACTIONNOTIFICATION & FMS

Tài liệu kỹ thuật cốt lõi dành cho đội ngũ Tư vấn & Kỹ sư Triển khai của công ty **InfoAsia** khi làm việc trên các hệ thống khách hàng đang vận hành **SAP Business One 9.3** và **SAP Business One 10.0** (nền tảng Microsoft SQL Server 2016/2017/2019/2022).

---

## 1. SO SÁNH CHI TIẾT KIẾN TRÚC DATABASE SAP B1 9.3 VS 10.0 TRÊN MS SQL SERVER

Khi nâng cấp (Upgrade) từ SAP B1 9.3 lên 10.0 hoặc viết câu lệnh SQL, Stored Procedure, Add-on SDK dùng chung cho nhiều khách hàng đang ở cả 2 phiên bản, kỹ sư InfoAsia bắt buộc phải nắm rõ các thay đổi cấp độ Schema dưới đây:

### 1.1. Bảng Đối Chiếu Thay Đổi Độ Dài Trường & Cấu Trúc Bảng (9.3 vs 10.0)

| Hạng mục / Bảng | SAP Business One 9.3 (MS SQL) | SAP Business One 10.0 (MS SQL) | Tác động Kỹ thuật (SQL / Crystal Reports / SDK / FMS) |
| :--- | :--- | :--- | :--- |
| **Mã hàng hóa (`ItemCode` trong `OITM`, `RDR1`, `INV1`, `WOR1`...)** | `NVARCHAR(20)` (tối đa 20 ký tự) | **`NVARCHAR(50)` (mở rộng lên 50 ký tự)** | Mọi biến `@ItemCode` trong `SBO_SP_TransactionNotification` hoặc Stored Procedure báo cáo bắt buộc khai báo `NVARCHAR(50)` thay vì `NVARCHAR(20)` để tránh lỗi cắt chuỗi (`String or binary data would be truncated`). |
| **Tên hàng hóa (`ItemName` / `Dscription`)** | `NVARCHAR(100)` | **`NVARCHAR(200)` (từ 10.0 FP 2008+)** | Các bảng tạm (`#TempTable`) hoặc biến lưu tên hàng trong báo cáo Nhập - Xuất - Tồn phải khai báo `NVARCHAR(200)`. |
| **Mã Đối tác (`CardCode` trong `OCRD`, `OINV`, `OPCH`...)** | `NVARCHAR(15)` | **`NVARCHAR(15)` -> Mở rộng hỗ trợ tới `NVARCHAR(50)` trên các bản Feature Pack mới** | Khuyến nghị khai báo biến `@CardCode NVARCHAR(50)` trong mọi thủ tục SQL để tương thích lâu dài. |
| **Tên Đối tác (`CardName` trong `OCRD`)** | `NVARCHAR(100)` | **`NVARCHAR(100)` -> Mở rộng lên `NVARCHAR(200)`** | Tăng độ rộng cột trên mẫu in Crystal Reports để không bị mất chữ với khách hàng có tên pháp nhân dài. |
| **Tên Nhóm hàng (`ItmsGrpNam` trong `OITB`) & Nhóm BP (`GroupName` trong `OCRG`)** | `NVARCHAR(20)` | **`NVARCHAR(100)`** | Tránh ép kiểu `VARCHAR(20)` khi gom nhóm báo cáo doanh thu/tồn kho theo `OITB` hoặc `OCRG`. |
| **Bảng Chứng từ nháp (`ODRF` / `DRF1` - ObjType `112`)** | Lưu chứng từ nháp trước khi duyệt; khi tạo chứng từ thật thường giữ nguyên hoặc xóa thủ công. | Bổ sung cơ chế liên kết chặt với `OWDD` / `WDD1` (Approval Status), hỗ trợ cập nhật nháp đã duyệt và tự động đóng/gắn cờ `DocStatus` chuẩn xác hơn. | Khi kiểm tra hạn mức công nợ hoặc tồn kho giữ chỗ từ chứng từ nháp, luôn lọc `ODRF.DocStatus = 'O'` và `ODRF.CANCELED = 'N'`, đồng thời kiểm tra `ObjType` gốc lưu trong cột `ODRF.ObjType` (VD: `17` là nháp của Sales Order). |
| **Bảng Đính kèm File (`OATC` / `ATC1`)** | Gắn `AtcEntry` ở cấp độ Header chứng từ (`ORDR.AtcEntry = OATC.AbsEntry`). | Mở rộng tab **Attachments** cho nhiều đối tượng hơn (bao gồm cả `OJDT` Journal Entry, `OWOR` Production Order, `OITM`, `OCRD`, `OBTN` Batch Master) và hỗ trợ cấu hình thư mục đính kèm theo từng User/Branch. | Nối `T0.AtcEntry = T_ATC.AbsEntry` (`OATC`) và `T_ATC.AbsEntry = T_ATC1.AbsEntry` (`ATC1`) để lấy đường dẫn `trgtPath + '\' + FileName + '.' + FileExt`. |
| **Bảng Phân quyền (`OUSR`, `OUPT`, `USR3`)** | Phân quyền cơ bản `Read / Full / None` trên `USR3`. | Mở rộng phân quyền chi tiết cấp độ Tab, Dữ liệu Chủ (`Data Ownership`), Chi nhánh (`OBPL` / `USR6`) và tích hợp xác thực Microsoft 365 / SSO (`Identity & Authentication Management`). | Khi viết báo cáo trên Web/External Tool, có thể đối chiếu `OUSR.USER_CODE` và `USR6.BPLId` để phân quyền dữ liệu theo Chi nhánh. |
| **Bảng Đánh số Chứng từ (`NNM1` - Document Numbering Series)** | Quản lý `Series`, `SeriesName`, `NextNumber`, `Indicator`. | Mở rộng hỗ trợ khóa Series theo nhóm người dùng, gắn Series mặc định linh hoạt theo `SubType` và niên độ tài chính (`FinncPriod`). | Khi lấy tên quyển chứng từ: `LEFT JOIN NNM1 T_SER ON T0.Series = T_SER.Series` (không cần điều kiện `ObjectCode` vì `Series` là khóa duy nhất trên `NNM1`). |
| **Bảng Sổ kho (`OINM` vs `OIVL` / `IVL1`)** | `OINM` là View/Bảng tổng hợp lịch sử giao dịch kho; từ 9.x dữ liệu chi tiết giá vốn nằm ở `OIVL` và `IVL1`. | Tối ưu hóa hiệu năng View `OINM` trên SQL Server; bổ sung thêm thông tin định giá theo Lô/Serial (`OBTN.CostTotal` / `OIVL`) và tham chiếu chứng từ gốc (`CreatedBy`, `TransType`, `BASE_REF`). | Với khách hàng có trên 5 triệu dòng giao dịch kho, ưu tiên truy vấn trên `OIVL` kết hợp `IVL1` (hoặc bọc `OINM WITH (NOLOCK)` có điều kiện `DocDate` và `ItemCode` được đánh Index) để tránh treo SQL Server. |
| **Bảng Sổ cái Kế toán (`OJDT` / `JDT1`)** | Giới hạn độ dài một số trường `Ref1`, `Ref2`, `Ref3Line`, `LineMemo` (`NVARCHAR(50)`). | Mở rộng `Ref1`, `Ref2`, `Ref3` lên `NVARCHAR(100)` và `Memo` / `LineMemo` lên `NVARCHAR(254)`, đồng thời hỗ trợ gắn `AtcEntry` trực tiếp trên `OJDT`. | Khi nối từ `OJDT/JDT1` về chứng từ gốc: luôn dùng `OJDT.TransType = [ObjType]` và `OJDT.CreatedBy = [DocEntry]` (tuyệt đối không nối bằng `BaseRef = DocNum` vì khác Series có thể trùng `DocNum`). |

---

## 2. QUY TẮC ĐẶT TÊN BẢNG & CẤU TRÚC HỌ BẢNG (TABLE FAMILY) TRONG SAP B1

Trong SAP Business One, mỗi chứng từ (Marketing Document) được tổ chức thành một **Họ bảng (Table Family)** đồng nhất:
- **Bảng Header (Thông tin chung):** Bắt đầu bằng chữ **`O`** (VD: `ORDR`, `ODLN`, `OINV`, `OPOR`, `OPDN`, `OPCH`, `OWTR`, `OIGN`, `OIGE`).
- **Các Bảng Con (Detail Sub-tables):** Bỏ chữ `O` ở đầu và ghép số thứ tự từ `1` đến `26` ở cuối:

| Hậu tố bảng | Ví dụ (Hóa đơn bán `OINV`) | Ý nghĩa & Nội dung lưu trữ | Khóa nối với Header |
| :---: | :--- | :--- | :--- |
| **`...1`** | `INV1` | **Dòng chi tiết hàng hóa/dịch vụ (Document Rows):** `ItemCode`, `Dscription`, `Quantity`, `Price`, `WhsCode`, `AcctCode`, `OcrCode`, `BaseType`, `BaseEntry`, `BaseLine`. | `OINV.DocEntry = INV1.DocEntry` |
| **`...2`** | `INV2` | Chi phí cước phí phân bổ cấp dòng (Rows - Freight). | `DocEntry`, `LineNum` |
| **`...3`** | `INV3` | **Chi phí cước phí cấp chứng từ (Document Freight Charges):** Cước vận chuyển, bảo hiểm cộng thêm trên toàn hóa đơn (`ExpnsCode`, `LineTotal`). | `OINV.DocEntry = INV3.DocEntry` |
| **`...4`** | `INV4` | **Chi tiết tiền Thuế theo từng dòng và từng sắc thuế (Tax Extension):** `StaType`, `TaxRate`, `TaxSum`, `TaxAcct`. | `DocEntry`, `LineNum` |
| **`...5`** | `INV5` | **Thuế nhà thầu / Khấu trừ tại nguồn (Withholding Tax):** `WTCode`, `Rate`, `TaxbleAmnt`, `WTAmnt`. | `OINV.DocEntry = INV5.DocEntry` |
| **`...6`** | `INV6` | **Kỳ hạn thanh toán trả góp (Installments):** `InstlmntID`, `DueDate`, `InsTotal`, `PaidToDate`. | `OINV.DocEntry = INV6.DocEntry` |
| **`...9`** | `INV9` | **Đối trừ Hóa đơn Tạm ứng (`Down Payment` Drawn):** Lưu số tiền đã cấn trừ từ `ODPI` (bán) hoặc `ODPO` (mua) vào Hóa đơn cuối. | `OINV.DocEntry = INV9.DocEntry` (`BaseAbs` = `ODPI.DocEntry`) |
| **`...10`** | `INV10` | **Dòng văn bản/Tổng phụ trên chứng từ (`Row Type = Text / Subtotal`):** `LineText`, `AftLineNum`. | `OINV.DocEntry = INV10.DocEntry` |
| **`...12`** | `INV12` | **Thông tin Địa chỉ Giao hàng / Hóa đơn & Mã số thuế tại thời điểm lập chứng từ (Tax & Address Extension):** `StreetS`, `CityS`, `CountryS`, `TaxId0` (MST). | `OINV.DocEntry = INV12.DocEntry` |
| **`...16`** | `INV16` | Liên kết dữ liệu Lô/Serial nháp (Draft Batch/Serial). | `DocEntry`, `LineNum` |
| **`...19`** | `INV19` | **Phân bổ Vị trí Kho (`Bin Location` Allocation Data):** `BinAbs`, `Quantity`, `SubLineNum`. | `DocEntry`, `LineNum` |
| **`...21`** | `INV21` | **Tham chiếu Chứng từ Ngoại lai (`Document References` - Mới trên 9.3/10.0):** Liên kết chéo giữa các chứng từ không qua Copy To. | `OINV.DocEntry = INV21.DocEntry` |

---

## 3. DANH MỤC ĐẦY ĐỦ MÃ `OBJTYPE` / `TRANSTYPE` / `BASETYPE` CHUẨN SAP B1

| Mã `ObjType` | Phân hệ | Tên Đối tượng / Chứng từ (Tiếng Anh - Tiếng Việt) | Bảng Header | Bảng Line chính | Các bảng phụ quan trọng |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **`1`** | Financials | Chart of Accounts (Hệ thống tài khoản kế toán) | `OACT` | *(Không có)* | `ACT1` |
| **`2`** | Business Partner | Business Partner Master Data (Khách hàng / NCC / Lead) | `OCRD` | `CRD1` (Địa chỉ) | `OCPR` (Liên hệ), `CRD2`, `CRD3`, `OCRG` (`10` - Nhóm BP) |
| **`4`** | Inventory | Item Master Data (Danh mục Vật tư - Hàng hóa - Thành phẩm) | `OITM` | `OITW` (Tồn theo kho) | `ITM1` (Bảng giá), `OITB` (`52` - Nhóm hàng), `OUOM` (ĐVT) |
| **`13`** | Sales - A/R | A/R Invoice & A/R Reserve Invoice (Hóa đơn bán hàng) | `OINV` | `INV1` | `INV3`, `INV4`, `INV5`, `INV6`, `INV9`, `INV12` (`IsIns = 'Y'` là Reserve Invoice) |
| **`14`** | Sales - A/R | A/R Credit Memo (Hóa đơn điều chỉnh giảm / Hàng bán trả lại) | `ORIN` | `RIN1` | `RIN3`, `RIN4`, `RIN12` |
| **`15`** | Sales - A/R | Delivery (Phiếu xuất kho giao hàng cho khách) | `ODLN` | `DLN1` | `DLN3`, `DLN4`, `DLN12`, `DLN19` |
| **`16`** | Sales - A/R | Returns (Phiếu nhập lại hàng bán bị trả trước khi lập HĐ) | `ORDN` | `RDN1` | `RDN4`, `RDN12` |
| **`17`** | Sales - A/R | Sales Order (Đơn đặt hàng bán - SO) | `ORDR` | `RDR1` | `RDR3`, `RDR4`, `RDR10`, `RDR12` |
| **`18`** | Purchasing - A/P | A/P Invoice & A/P Reserve Invoice (Hóa đơn mua hàng) | `OPCH` | `PCH1` | `PCH3`, `PCH4`, `PCH5`, `PCH6`, `PCH9`, `PCH12` |
| **`19`** | Purchasing - A/P | A/P Credit Memo (Giảm giá hàng mua / Trả hàng NCC đã lên HĐ) | `ORPC` | `RPC1` | `RPC3`, `RPC4`, `RPC12` |
| **`20`** | Purchasing - A/P | Goods Receipt PO - GRPO (Phiếu nhập kho mua hàng theo PO) | `OPDN` | `PDN1` | `PDN3`, `PDN4`, `PDN12`, `PDN19` |
| **`21`** | Purchasing - A/P | Goods Return (Phiếu xuất trả hàng NCC trước khi nhận HĐ) | `ORPD` | `RPD1` | `RPD4`, `RPD12` |
| **`22`** | Purchasing - A/P | Purchase Order (Đơn đặt hàng mua - PO) | `OPOR` | `POR1` | `POR3`, `POR4`, `POR10`, `POR12` |
| **`23`** | Sales - A/R | Sales Quotation (Báo giá bán hàng) | `OQUT` | `QUT1` | `QUT4`, `QUT12` |
| **`24`** | Banking | Incoming Payment (Phiếu thu tiền mặt / Báo có ngân hàng) | `ORCT` | `RCT2` (Hóa đơn) | `RCT1` (Séc), `RCT3` (Thẻ), `RCT4` (Thu thẳng TK G/L) |
| **`25`** | Banking | Deposit (Nộp tiền/Séc vào ngân hàng) | `ODPS` | `DPS1` | |
| **`30`** | Financials | Journal Entry (Bút toán Sổ Nhật Ký Chung / Phiếu kế toán) | `OJDT` | `JDT1` | `OBTF` / `BTF1` (`ObjType 28` - Journal Voucher nháp) |
| **`46`** | Banking | Outgoing Payment (Phiếu chi tiền mặt / Ủy nhiệm chi) | `OVPM` | `VPM2` (Hóa đơn) | `VPM1` (Séc), `VPM4` (Chi thẳng TK G/L) |
| **`52`** | Inventory | Item Groups (Nhóm vật tư hàng hóa - Định khoản mặc định) | `OITB` | *(Không có)* | |
| **`59`** | Inventory | Goods Receipt / Receipt from Production (Nhập kho khác / Nhập TP sản xuất) | `OIGN` | `IGN1` | `IGN19` |
| **`60`** | Inventory | Goods Issue / Issue for Production (Xuất kho khác / Xuất NVL sản xuất) | `OIGE` | `IGE1` | `IGE19` |
| **`64`** | Inventory | Warehouses (Danh mục Kho hàng) | `OWHS` | *(Không có)* | `OBIN` (`10000206` - Vị trí Bin) |
| **`66`** | Production | Bill of Materials - BOM (Định mức nguyên vật liệu chuẩn SAP) | `OITT` | `ITT1` | `ITT2` |
| **`67`** | Inventory | Inventory Transfer (Phiếu chuyển kho nội bộ) | `OWTR` | `WTR1` | `WTR12`, `WTR19` |
| **`69`** | Purchasing - A/P | Landed Costs (Chứng từ phân bổ chi phí mua hàng / Nhập khẩu) | `OIPF` | `IPF1` (Hàng hóa) | `IPF2` (Các khoản mục chi phí hải quan, vận tải, bảo hiểm) |
| **`97`** | Sales/CRM | Opportunity (Cơ hội bán hàng CRM) | `OOPR` | `OPR1` | `OCLG` (`33` - Activities) |
| **`112`** | Core / Approval | Document Drafts (Chứng từ nháp / Đang chờ phê duyệt) | `ODRF` | `DRF1` | `OWDD`, `WDD1` (`122` - Quy trình phê duyệt) |
| **`162`** | Inventory | Inventory Revaluation (Đánh giá lại giá trị tồn kho) | `OMRV` | `MRV1` | `MRV2` (FIFO/Batch Layer) |
| **`191`** | Service | Service Call (Phiếu yêu cầu bảo hành / Dịch vụ kỹ thuật) | `OSCL` | `SCL1` | `OINS` (`176` - Customer Equipment Card) |
| **`202`** | Production | Production Order (Lệnh sản xuất chuẩn SAP B1) | `OWOR` | `WOR1` | `WOR4` (Route Stages) |
| **`203`** | Sales - A/R | A/R Down Payment Invoice/Request (Hóa đơn/Yêu cầu Tạm ứng KH) | `ODPI` | `DPI1` | `DPI4`, `DPI12` |
| **`204`** | Purchasing - A/P | A/P Down Payment Invoice/Request (Hóa đơn/Yêu cầu Tạm ứng NCC) | `ODPO` | `DPO1` | `DPO4`, `DPO12` |
| **`290`** | Production | Resources Master Data (Danh mục Nguồn lực Máy móc / Nhân công) | `ORSC` | `RSC1` (Kho) | `RSC2` (Chi phí chuẩn `StdCost1..10`) |
| **`540000006`** | Purchasing - A/P | Purchase Quotation (Báo giá của Nhà cung cấp) | `OPQT` | `PQT1` | `PQT4`, `PQT12` |
| **`10000071`** | Inventory | Inventory Posting (Phiếu chốt kiểm kê & Cân bằng kho) | `OIQR` | `IQR1` | |
| **`1250000001`** | Inventory | Inventory Transfer Request (Yêu cầu chuyển kho) | `OWTQ` | `WTQ1` | `WTQ19` |
| **`1470000113`** | Purchasing - A/P | Purchase Request (Yêu cầu mua hàng nội bộ - PR) | `OPRQ` | `PRQ1` | `PRQ4`, `PRQ12` |
| **`1470000065`** | Inventory | Inventory Counting (Phiếu đếm kiểm kê kho) | `OINC` | `INC1` | `INC2` |

---

## 4. QUY TẮC NỐI BẢNG CHUẨN (GOLDEN JOIN RULES) CHO KỸ SƯ INFOASIA

1. **Nguyên tắc 1 - Nối Header và Line bằng `DocEntry`:**
   - Mọi bảng Header (`ORDR`, `ODLN`, `OINV`, `OPOR`, `OPDN`, `OPCH`...) nối với bảng Line (`RDR1`, `DLN1`, `INV1`...) thông qua khóa chính **`DocEntry`** (`T0.DocEntry = T1.DocEntry`).
   - **Tuyệt đối không dùng `DocNum`** để nối bảng vì `DocNum` có thể trùng lặp khi doanh nghiệp dùng nhiều `Series` khác nhau cho từng năm hoặc từng chi nhánh.
2. **Nguyên tắc 2 - Truy vết Chuỗi Chứng từ (`BaseDocument` -> `TargetDocument`):**
   - Nối từ bảng dòng của chứng từ đích (`Target Line`) về bảng dòng của chứng từ gốc (`Base Line`) bằng bộ 3 khóa:
     ```sql
     T_TargetLine.BaseEntry = T_BaseLine.DocEntry
     AND T_TargetLine.BaseLine = T_BaseLine.LineNum
     AND T_TargetLine.BaseType = [ObjType_Cua_Chung_Tu_Goc]
     ```
3. **Nguyên tắc 3 - Nối Chứng từ Gốc sang Bút toán Sổ Cái (`OJDT` / `JDT1`):**
   - Cách 1 (Từ Chứng từ sang `OJDT`): `T_Doc.TransId = T_JDT.TransId`.
   - Cách 2 (Từ `OJDT` ngược về Chứng từ): `T_JDT.TransType = [ObjType] AND T_JDT.CreatedBy = T_Doc.DocEntry`.
4. **Nguyên tắc 4 - Nối Giao dịch Kho (`OINM` / `OIVL`) và Chi tiết Lô (`OBTN` / `OITL` / `ITL1`):**
   - Truy vết Lô (`Batch Number`) xuất/nhập trên chứng từ:
     ```sql
     SELECT
         T0.DocEntry,
         T0.DocNum,
         T0.DocType,
         T0.ItemCode,
         T1.SysNumber,
         T2.DistNumber AS [BatchNumber],
         T2.MnfDate,
         T2.ExpDate,
         T1.Quantity AS [BatchQty]
     FROM OITL T0 WITH (NOLOCK)
     INNER JOIN ITL1 T1 WITH (NOLOCK) ON T0.LogEntry = T1.LogEntry
     INNER JOIN OBTN T2 WITH (NOLOCK) ON T0.ItemCode = T2.ItemCode AND T1.SysNumber = T2.SysNumber
     WHERE T0.ApplyType = 15               -- Ví dụ: 15 = Delivery (ODLN)
       AND T0.ApplyEntry = @DocEntry       -- DocEntry của phiếu ODLN
       AND T0.ApplyLine = @LineNum;        -- LineNum của dòng DLN1
     ```
5. **Nguyên tắc 5 - Luôn lọc Chứng từ Hủy (`CANCELED = 'N'`) và chống khóa bảng (`WITH (NOLOCK)`):**
   - Từ SAP B1 9.x và 10.0, khi người dùng nhấn chuột phải chọn **Cancel** một chứng từ, SAP tạo ra một chứng từ đảo (`CANCELED = 'C'`) và cập nhật chứng từ gốc thành `CANCELED = 'Y'`.
   - Nếu câu lệnh báo cáo không có điều kiện **`WHERE T0.CANCELED = 'N'`**, doanh thu hoặc chi phí sẽ bị cộng trùng (chứng từ gốc + chứng từ hủy).

---

## 5. KHUNG CHUẨN `SBO_SP_TRANSACTIONNOTIFICATION` & `SBO_SP_POSTTRANSACTIONNOTICE`

### 5.1. Phân biệt 2 Stored Procedure lõi của SAP B1
- **`SBO_SP_TransactionNotification`:** Chạy **đồng bộ bên trong Transaction** của SAP B1 trước khi hoàn tất Commit. Nếu gán `@error <> 0`, SAP B1 sẽ **Rollback toàn bộ giao dịch** và hiển thị `@error_message` màu đỏ trên thanh trạng thái dưới đáy màn hình. Dùng để **chặn lỗi nghiệp vụ (Validation)**.
- **`SBO_SP_PostTransactionNotice`:** Chạy **sau khi Transaction đã Commit thành công**. Không dùng để Rollback chứng từ, mà dùng để ghi log đồng bộ sang bảng trung gian (Staging Table) phục vụ tích hợp Hóa đơn điện tử, WMS, hoặc n8n/API. **Nghiêm cấm** viết lệnh `UPDATE` trực tiếp vào bảng chuẩn SAP B1 trong cả hai thủ tục này.

### 5.2. Bộ Mẫu Thực Chiến `SBO_SP_TransactionNotification` (Chuẩn SAP B1 9.3 & 10.0 MS SQL)

```sql
-- =========================================================================
-- MẪU CHUẨN INFOASIA: SBO_SP_TransactionNotification
-- Lưu ý: Luôn đặt code bên dưới dòng "-- ADD YOUR CODE HERE"
-- và dùng WITH (NOLOCK) để tránh làm chậm hoặc gây Deadlock toàn hệ thống.
-- =========================================================================

-- [RULE 01] Chặn xuất kho giao hàng (ODLN - ObjType 15) hoặc Hóa đơn bán (OINV - ObjType 13)
-- nếu thiếu Mã Kho, thiếu Trung tâm chi phí (Cost Center - OcrCode) hoặc Đơn giá bằng 0 (trừ hàng tặng có UDF U_IsFree = 'Y')
IF @object_type IN ('13', '15') AND @transaction_type IN ('A', 'U')
BEGIN
    DECLARE @DocEntry_13_15 INT = TRY_CAST(@list_of_cols_val_tab_del AS INT);
    DECLARE @BadLine INT;
    DECLARE @BadItem NVARCHAR(50);
    DECLARE @Reason NVARCHAR(200);

    IF @object_type = '15'
    BEGIN
        SELECT TOP 1
            @BadLine = T1.VisOrder + 1,
            @BadItem = T1.ItemCode,
            @Reason = CASE
                WHEN ISNULL(T1.WhsCode, '') = '' THEN N'chưa chọn Mã Kho (WhsCode)'
                WHEN ISNULL(T1.OcrCode, '') = '' THEN N'chưa chọn Bộ phận/Trung tâm chi phí (OcrCode)'
                ELSE N'Đơn giá bằng 0'
            END
        FROM ODLN T0 WITH (NOLOCK)
        INNER JOIN DLN1 T1 WITH (NOLOCK) ON T0.DocEntry = T1.DocEntry
        WHERE T0.DocEntry = @DocEntry_13_15
          AND T0.DocType = 'I'
          AND T0.CANCELED = 'N'
          AND (
              ISNULL(T1.WhsCode, '') = ''
              OR ISNULL(T1.OcrCode, '') = ''
              OR (ISNULL(T1.Price, 0) <= 0 AND ISNULL(T1.U_IsFree, 'N') <> 'Y')
          );
    END

    IF @BadLine IS NOT NULL
    BEGIN
        SET @error = 15001;
        SET @error_message = N'[InfoAsia ERP Rule] Dòng số ' + CAST(@BadLine AS NVARCHAR(10))
                           + N' (Mã hàng: ' + ISNULL(@BadItem, '') + N') ' + @Reason + N'. Vui lòng kiểm tra lại!';
    END
END

-- [RULE 02] Chặn tạo Hóa đơn mua hàng A/P Invoice (OPCH - ObjType 18)
-- nếu trùng Số Hóa Đơn Đỏ (NumAtCard) và Ký hiệu Hóa đơn (U_SerialNo) của cùng một Nhà cung cấp
IF @object_type = '18' AND @transaction_type IN ('A', 'U')
BEGIN
    DECLARE @DocEntry_18 INT = TRY_CAST(@list_of_cols_val_tab_del AS INT);
    DECLARE @DupDocNum INT;
    DECLARE @NumAtCard NVARCHAR(100);

    SELECT TOP 1
        @DupDocNum = T_OLD.DocNum,
        @NumAtCard = T_NEW.NumAtCard
    FROM OPCH T_NEW WITH (NOLOCK)
    INNER JOIN OPCH T_OLD WITH (NOLOCK)
        ON T_NEW.CardCode = T_OLD.CardCode
       AND ISNULL(T_NEW.NumAtCard, '') = ISNULL(T_OLD.NumAtCard, '')
       AND T_NEW.DocEntry <> T_OLD.DocEntry
    WHERE T_NEW.DocEntry = @DocEntry_18
      AND T_NEW.CANCELED = 'N'
      AND T_OLD.CANCELED = 'N'
      AND ISNULL(T_NEW.NumAtCard, '') <> '';

    IF @DupDocNum IS NOT NULL
    BEGIN
        SET @error = 18002;
        SET @error_message = N'[InfoAsia ERP Rule] Số hóa đơn NCC (' + @NumAtCard
                           + N') đã tồn tại trên hệ thống tại chứng từ A/P Invoice số: ' + CAST(@DupDocNum AS NVARCHAR(20)) + N'!';
    END
END
```

---

## 6. CÚ PHÁP FORMATTED SEARCH (FMS) TOÀN DIỆN TRÊN SAP B1 9.3 & 10.0

Để tra cứu `ItemUID` và `ColumnUID` trên mọi màn hình SAP B1, bật **View -> System Information** (hoặc nhấn tổ hợp phím **`Ctrl + Shift + I`**) rồi rê chuột vào ô dữ liệu cần lấy:

### 6.1. Hai Cú Pháp Đọc Giá Trị Màn Hình Đang Mở (Active Form)
1. **Cú pháp theo Tên Bảng & Tên Trường (`$[Table.Field]`):**
   - Đọc chuỗi văn bản: `$[ORDR.CardCode]`, `$[RDR1.ItemCode]`, `$[OINV.Comments]`.
   - Đọc kiểu Số (bỏ ký hiệu tiền tệ `VND`/`USD` và dấu phân cách hàng nghìn): `$[RDR1.Quantity.NUMBER]`, `$[RDR1.Price.NUMBER]`, `$[OINV.DocTotal.NUMBER]`.
   - Đọc kiểu Tiền tệ (lấy mã ngoại tệ): `$[RDR1.Price.CURRENCY]`.
   - Đọc kiểu Ngày tháng chuẩn SQL: `$[ORDR.DocDate.DATE]`.
2. **Cú pháp theo `ItemUID` và `ColumnUID` (`$[$ItemUID.ColumnUID.DataType]`):**
   - Bắt buộc dùng khi trường dữ liệu trên màn hình là biến tạm của UI hoặc không gắn trực tiếp vào bảng DB lúc chưa lưu.
   - Trên màn hình chứng từ Marketing (`ORDR`, `OPOR`, `OINV`, `ODLN`...):
     - Ô Mã Khách hàng/NCC (`CardCode`): `Item = 4`, `Column = 0` -> **`$[$4.0.0]`**
     - Ô Ngày hạch toán (`DocDate`): `Item = 10`, `Column = 0` -> **`$[$10.0.DATE]`**
     - Lưới chi tiết Hàng hóa (`Matrix`): `Item = 38`
       - Cột Mã hàng (`ItemCode`): `Column = 1` -> **`$[$38.1.0]`**
       - Cột Số lượng (`Quantity`): `Column = 11` -> **`$[$38.11.NUMBER]`**
       - Cột Đơn giá (`Price`): `Column = 14` -> **`$[$38.14.NUMBER]`**
       - Cột Mã kho (`WhsCode`): `Column = 24` -> **`$[$38.24.0]`**

### 6.2. Ví dụ FMS Thực Chiến Thường Dùng Khi Triển Khai

```sql
-- [FMS 01] Tự động lấy Tồn kho Khả dụng (Available) tại kho đang chọn trên dòng Sales Order
SELECT
    (T0.OnHand - T0.IsCommited + T0.OnOrder) AS [AvailableQty]
FROM OITW T0 WITH (NOLOCK)
WHERE T0.ItemCode = $[$38.1.0]
  AND T0.WhsCode  = $[$38.24.0];

-- [FMS 02] Tự động lấy Đơn giá mua gần nhất của đúng Nhà cung cấp và Mặt hàng đang chọn trên PO
SELECT TOP 1
    T1.Price
FROM OPCH T0 WITH (NOLOCK)
INNER JOIN PCH1 T1 WITH (NOLOCK) ON T0.DocEntry = T1.DocEntry
WHERE T0.CardCode = $[$4.0.0]
  AND T1.ItemCode = $[$38.1.0]
  AND T0.CANCELED = 'N'
ORDER BY T0.DocDate DESC, T0.DocEntry DESC;
```
