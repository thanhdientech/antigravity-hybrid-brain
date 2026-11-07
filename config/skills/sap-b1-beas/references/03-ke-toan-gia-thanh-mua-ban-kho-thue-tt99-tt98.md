---
type: source
source_kind: article
status: processed
created: '2026-10-18'
processed_at: '2026-10-18'
wiki_links:
  - '[[cam-nang-ke-toan-gia-thanh-thue-va-luong-nghiep-vu-erp]]'
---
# NGHIỆP VỤ KẾ TOÁN TỔNG HỢP, CHI PHÍ GIÁ THÀNH SẢN XUẤT, MUA - BÁN - KHO, BÁO CÁO THUẾ & THÔNG TƯ 99/2025/TT-BTC - TT 200 - TT 78 - TT 98 TRÊN SAP B1

Tài liệu chuẩn hóa nghiệp vụ Tài chính - Kế toán - Giá thành - Thuế - Kiểm soát nội bộ trên hệ thống **SAP Business One 9.3 / 10.0** và **Beas Manufacturing** dành cho đội ngũ Tư vấn Nghiệp vụ (`Functional Consultants`) của công ty **InfoAsia**.

---

## 1. LUỒNG NGHIỆP VỤ MUA HÀNG (P2P), BÁN HÀNG (O2C) & ĐỊNH KHOẢN TỰ ĐỘNG (`G/L ACCOUNT DETERMINATION`)

### 1.1. Phân Hệ Mua Hàng & Nhập Khẩu (`Purchasing - A/P & Landed Costs`)

| Bước | Chứng từ SAP B1 | Bảng (`ObjType`) | Định khoản kế toán tự động (`OJDT` / `JDT1`) & Tác động Kho (`OITW`) |
| :---: | :--- | :---: | :--- |
| **1** | **Purchase Request (PR - Yêu cầu mua hàng)** | `OPRQ` / `PRQ1` (`1470000113`) | Không sinh bút toán kế toán. Ghi nhận nhu cầu mua nội bộ từ các phòng ban hoặc sinh tự động từ **MRP Wizard**. |
| **2** | **Purchase Quotation (PQ - Báo giá NCC)** | `OPQT` / `PQT1` (`540000006`) | Không sinh bút toán kế toán. Dùng để so sánh giá, tiến độ giao hàng và điều khoản thanh toán giữa các Nhà cung cấp (`OCRD`). |
| **3** | **Purchase Order (PO - Đơn đặt hàng mua)** | `OPOR` / `POR1` (`22`) | Không sinh bút toán kế toán. Làm tăng số lượng **Đang đặt hàng (`OITW.OnOrder`)** tại kho đích. |
| **4** | **Goods Receipt PO (GRPO - Nhập kho mua hàng)** | `OPDN` / `PDN1` (`20`) | **Nợ TK Kho (`152` / `153` / `156` - Inventory Account)**<br>**Có TK Phải trả tạm tính (`3318` / `335` - Allocation Account / GRNI)**<br>*(Tăng tồn thực tế `OITW.OnHand`, giảm `OnOrder`, cập nhật giá vốn trong `OIVL`/`OINM`)*. |
| **5** | **Landed Costs (Phân bổ chi phí mua hàng / Nhập khẩu)** | `OIPF` / `IPF1` / `IPF2` (`69`) | **Nợ TK Kho (`152` / `156` - Cộng tăng giá vốn lô hàng nhập)**<br>**Có TK Phải trả chi phí mua hàng (`3318` / `3388` - Landed Costs Clearing Account)**<br>*(Phân bổ cước biển/hàng không, bảo hiểm, phí THC/DO, thuế Nhập khẩu theo Giá trị tiền `Cash Value`, Trọng lượng `Weight`, Thể tích `Volume` hoặc Số lượng `Quantity`)*. |
| **6** | **A/P Down Payment Invoice (Hóa đơn tạm ứng NCC)** | `ODPO` / `DPO1` (`204`) | Khi chi tiền tạm ứng qua `Outgoing Payment (OVPM)`:<br>**Nợ TK Tạm ứng / Trả trước cho người bán (`3312` - Down Payment Clearing/Interim)** / **Có TK Tiền (`111`/`112`)**. |
| **7** | **A/P Invoice (Hóa đơn mua hàng / Dịch vụ)** | `OPCH` / `PCH1` (`18`) | **Nợ TK Phải trả tạm tính (`3318` - Allocation Account)** *(nếu Copy từ GRPO)* hoặc **Nợ TK Chi phí (`627`/`641`/`642`)** *(nếu hóa đơn dịch vụ)*<br>**Nợ TK Thuế GTGT được khấu trừ (`1331` / `1332`)**<br>**Có TK Phải trả người bán (`3311` - Control Account gắn trên `OCRD`)**. |
| **8** | **A/P Credit Memo (Trả hàng / Giảm giá hàng mua)** | `ORPC` / `RPC1` (`19`) | Đảo ngược bút toán hóa đơn mua: **Nợ TK `3311`** / **Có TK Kho (`152`/`156`) hoặc TK Chênh lệch giá**, **Có TK Thuế GTGT (`1331`)**. |
| **9** | **Outgoing Payment (Phiếu chi / Ủy nhiệm chi)** | `OVPM` / `VPM2` (`46`) | **Nợ TK Phải trả người bán (`3311`)**<br>**Có TK Tiền mặt / Tiền gửi ngân hàng (`111` / `112`)** (+/- Chênh lệch tỷ giá thanh toán `515` / `635`). |

### 1.2. Phân Hệ Bán Hàng & Công Nợ Phải Thu (`Sales - A/R`)

| Bước | Chứng từ SAP B1 | Bảng (`ObjType`) | Định khoản kế toán tự động (`OJDT` / `JDT1`) & Tác động Kho (`OITW`) |
| :---: | :--- | :---: | :--- |
| **1** | **Sales Quotation (SQ - Báo giá bán hàng)** | `OQUT` / `QUT1` (`23`) | Không sinh bút toán kế toán, không giữ tồn kho. |
| **2** | **Sales Order (SO - Đơn đặt hàng bán)** | `ORDR` / `RDR1` (`17`) | Không sinh bút toán kế toán. Làm tăng số lượng **Đã giữ chỗ (`OITW.IsCommited`)**, làm giảm lượng tồn khả dụng `Available`. |
| **3** | **Delivery (Phiếu xuất kho giao hàng)** | `ODLN` / `DLN1` (`15`) | **Nợ TK Giá vốn hàng bán / Hàng gửi bán (`632` / `157` - COGS / Shipped Goods Account)**<br>**Có TK Kho (`155` / `156` - Inventory Account)**<br>*(Giảm `OITW.OnHand` và giảm `IsCommited`)*. |
| **4** | **Returns (Phiếu nhập lại hàng bán bị trả trước HĐ)** | `ORDN` / `RDN1` (`16`) | **Nợ TK Kho (`155` / `156`)**<br>**Có TK Giá vốn hàng bán / Hàng gửi bán (`632` / `157`)**. |
| **5** | **A/R Down Payment (Tạm ứng của Khách hàng)** | `ODPI` / `DPI1` (`203`) | Khi thu tiền tạm ứng qua `Incoming Payment (ORCT)`:<br>**Nợ TK Tiền (`111`/`112`)** / **Có TK Người mua trả tiền trước (`1312`)**. |
| **6** | **A/R Invoice (Hóa đơn GTGT bán hàng)** | `OINV` / `INV1` (`13`) | **Nợ TK Phải thu khách hàng (`1311` - Control Account)**<br>**Có TK Doanh thu bán hàng & CCDV (`5111` / `5112` / `5113`)**<br>**Có TK Thuế GTGT đầu ra phải nộp (`33311`)**<br>*(Nếu bán thẳng không qua Delivery hoặc dùng TK trung gian `157`: đồng thời kết chuyển `Nợ TK 632 / Có TK 155, 156, 157`)*. |
| **7** | **A/R Credit Memo (Hàng bán trả lại / Giảm giá sau HĐ)** | `ORIN` / `RIN1` (`14`) | **Nợ TK Hàng bán bị trả lại / Giảm trừ doanh thu (`5212` / `5213`)**<br>**Nợ TK Thuế GTGT đầu ra (`33311`)**<br>**Có TK Phải thu khách hàng (`1311`)**<br>*(Đồng thời nếu có tích trả lại kho: `Nợ TK 155, 156 / Có TK 632`)*. |
| **8** | **Incoming Payment (Phiếu thu / Báo có ngân hàng)** | `ORCT` / `RCT2` (`24`) | **Nợ TK Tiền mặt / Ngân hàng (`111` / `112`)**<br>**Có TK Phải thu khách hàng (`1311`)** (+/- Chênh lệch tỷ giá `515` / `635`). |

---

## 2. QUẢN LÝ KHO (`INVENTORY`), LÔ (`BATCH`), SERIAL, VỊ TRÍ BIN & HOẠCH ĐỊNH `MRP`

1. **Công thức Tồn kho Khả dụng (`Available To Promise - ATP`) trên `OITM` & `OITW`:**
   $$\text{Available} = \text{OnHand (Tồn thực tế)} - \text{IsCommited (Giữ chỗ cho SO \& Lệnh SX)} + \text{OnOrder (Đang đặt PO \& Lệnh SX)}$$
2. **Quản lý Lô (`Batch - OBTN`), Serial (`OSRN`) & Vị trí Kho (`Bin Location - OBIN`):**
   - **Batch (`OBTN`):** Lưu số lô tại cột `DistNumber`, ngày sản xuất `MnfDate`, ngày hết hạn `ExpDate`, ngày nhập `InDate`. Lịch sử xuất/nhập từng lô nằm ở cặp bảng `OITL` (Header) và `ITL1` (Line). Tồn kho hiện hành của từng lô theo kho nằm ở bảng `OBTQ`.
   - **Serial (`OSRN`):** Quản lý từng cá thể máy móc/thiết bị theo số Serial (`DistNumber` / `IntrSerial`), tồn kho lưu tại `OSRQ`.
   - **Bin Location (`OBIN`):** Bật tại `OWHS.BinActivat = 'Y'`. Tồn kho tại từng vị trí kệ/tầng/ô được lưu trong bảng `OIBQ` (Item - Bin Quantity), `OBBQ` (Batch - Bin Quantity) và `OSBQ` (Serial - Bin Quantity).
3. **Hoạch định Nguyên vật liệu (`MRP - OMPS / ORCM`):**
   - Mặt hàng thiết lập `PrcrmntMtd = 'M' (Make)`: Khi thiếu hàng theo nhu cầu từ Sales Order hoặc Forecast (`OFCT`/`FCT1`), MRP đề xuất sinh **Lệnh sản xuất (`OWOR` / `Beas Work Order`)** và bung tiếp nhu cầu nguyên vật liệu cấp con theo định mức BOM (`OITT`/`BEAS_STL`) lùi ngày theo `LeadTime`.
   - Mặt hàng thiết lập `PrcrmntMtd = 'B' (Buy)`: MRP đề xuất sinh **`Purchase Request (OPRQ)`** hoặc **`Purchase Order (OPOR)`** tuân thủ `MinOrdrQty` (Số lượng đặt tối thiểu), `OrderMulti` (Bội số đặt hàng) và `MinLevel` (Tồn kho an toàn).

---

## 3. KẾ TOÁN CHI PHÍ & TÍNH GIÁ THÀNH SẢN XUẤT (`WIP TK 154` - SAP B1 & BEAS)

### 3.1. Mô Hình Hạch Toán Chi Phí Dở Dang (`WIP`) & Kết Chuyển Giá Thành Chuẩn Việt Nam
Trong hệ thống kê khai thường xuyên (`Perpetual Inventory`) của SAP B1 và Beas Manufacturing, tài khoản trung tâm của quá trình sản xuất là **`TK 154 - Chi phí sản xuất, kinh doanh dở dang (WIP Account)`**:

1. **Giai đoạn 1 - Xuất kho Nguyên vật liệu trực tiếp cho Lệnh sản xuất (`Issue for Production - OIGE`):**
   - **Bút toán tự động:** `Nợ TK 1541 (Chi phí NVL trực tiếp dở dang)` / `Có TK 152 (Nguyên liệu, vật liệu)`.
   - Nếu doanh nghiệp muốn phản ánh qua đầu tài khoản `621` để lên thuyết minh chi phí sản xuất theo yếu tố: Cấu hình xuất qua `621` và cuối kỳ kết chuyển `Nợ TK 1541 / Có TK 621`, hoặc dùng tài khoản `1541` trực tiếp trên `WOR1.WipActCode` kết hợp báo cáo đối ứng từ `OIGE`.
2. **Giai đoạn 2 - Tập hợp Chi phí Nhân công trực tiếp (`622`) & Chi phí Sản xuất chung (`627`):**
   - **Cách 1 (Hạch toán theo Định mức/Giờ công thực tế từ Resource `ORSC` hoặc `BEAS_ARBZEIT`):**
     - Khi xác nhận giờ công (`Time Receipt` / `Issue Resource`):
       `Nợ TK 1542 (WIP Nhân công)` / `Có TK 622 (WIP Offset P&L Account)`
       `Nợ TK 1543 (WIP Sản xuất chung)` / `Có TK 627 (WIP Offset P&L Account)`
   - **Cách 2 (Phân bổ chi phí thực tế cuối tháng từ Tổng hợp `622`, `627` sang `154`):**
     - Trong tháng, kế toán hạch toán lương công nhân, khấu hao máy móc, điện nước nhà xưởng vào `Nợ TK 622, 627` (gắn `Cost Center / OcrCode` phân xưởng).
     - Cuối tháng, đối chiếu tổng phát sinh `Nợ TK 622, 627` thực tế với phần đã tạm tính vào `1542, 1543` qua Resource; phân bổ phần chênh lệch thực tế vào các Lệnh sản xuất theo tiêu thức **Giờ công thực tế (`BEAS_ARBZEIT.ZEIT`)**, **Số lượng thành phẩm hoàn thành (`GEL_MENGE`)**, hoặc **Chi phí nguyên vật liệu trực tiếp (`1541`)**.
3. **Giai đoạn 3 - Nhập kho Thành phẩm hoàn thành (`Receipt from Production - OIGN`):**
   - **Bút toán tự động:** `Nợ TK 155 (Thành phẩm)` / `Có TK 154 (Chi phí SXKD dở dang)`.
4. **Giai đoạn 4 - Nhập kho Phế liệu thu hồi / Phụ phẩm (`Receipt By-Product - OIGN`):**
   - **Bút toán tự động:** `Nợ TK 152 / 155 (Phế liệu / Phụ phẩm)` / `Có TK 154 (Giảm chi phí dở dang của lệnh)`.
5. **Giai đoạn 5 - Đóng Lệnh sản xuất (`Close Production Order / Beas Work Order`) & Xử lý Chênh lệch (`Production Variance`):**
   - Khi chuyển trạng thái lệnh sang `Closed`, hệ thống tự động so sánh `Tổng phát sinh Nợ TK 154` (Chi phí đầu vào) và `Tổng phát sinh Có TK 154` (Giá trị thành phẩm + phụ phẩm đã nhập kho) của đúng lệnh đó:
     - Nếu còn chênh lệch (`Variance <> 0`), hệ thống tự động sinh bút toán kết chuyển chênh lệch (`Nợ/Có TK 154` đối ứng `Có/Nợ TK 155` hoặc `TK 632 - WIP Variance Account`) để **số dư `TK 154` của lệnh đã đóng luôn bằng `0`**.
   - Nếu thành phẩm đã nhập kho trong kỳ, kế toán có thể chạy thêm **`Inventory Revaluation (OMRV - ObjType 162)`** (hoặc chức năng **Beas Post Calculation / Batch Costing**) để cập nhật phần chênh lệch giá thành thực tế vào đúng giá vốn lô thành phẩm (`155`) và giá vốn hàng bán (`632`).

### 3.2. Quy Trình Xử Lý Lệch Sổ Kho (`OINM`) Và Sổ Cái (`OJDT`)
1. **Nguyên nhân gây lệch kinh điển:** Kế toán dùng `Journal Entry (OJDT)` hạch toán tay trực tiếp vào các tài khoản Kho (`152`, `153`, `155`, `156`), hoặc đổi tài khoản `Inventory Account` trong `OITW`/`OITB` khi mặt hàng đang còn số dư tồn kho.
2. **Giải pháp phòng ngừa bắt buộc:** Mở `Financials -> Chart of Accounts (OACT)`, tích chọn ô **`Block Manual Posting` (Khóa hạch toán thủ công)** cho toàn bộ các tài khoản Kho (`152`, `153`, `155`, `156`).
3. **Truy vấn SQL tìm chính xác bút toán gây lệch giữa Sổ cái (`JDT1`) và Sổ kho (`OINM`):**
   ```sql
   SELECT
       J0.TransId,
       J0.TransType,
       J0.BaseRef AS [DocNum],
       J0.RefDate AS [PostingDate],
       J1.Account,
       SUM(J1.Debit - J1.Credit) AS [GL_NetAmount],
       ISNULL(M.Inv_NetAmount, 0) AS [Inventory_Audit_NetAmount],
       SUM(J1.Debit - J1.Credit) - ISNULL(M.Inv_NetAmount, 0) AS [Diff_Amount]
   FROM OJDT J0 WITH (NOLOCK)
   INNER JOIN JDT1 J1 WITH (NOLOCK) ON J0.TransId = J1.TransId
   LEFT JOIN (
       SELECT TransType, CreatedBy, InvntAct, SUM(ISNULL(TransValue, 0)) AS [Inv_NetAmount]
       FROM OINM WITH (NOLOCK)
       GROUP BY TransType, CreatedBy, InvntAct
   ) M ON J0.TransType = M.TransType AND J0.CreatedBy = M.CreatedBy AND J1.Account = M.InvntAct
   WHERE J1.Account LIKE '15%'
     AND J0.RefDate BETWEEN [%0] AND [%1]
   GROUP BY J0.TransId, J0.TransType, J0.BaseRef, J0.RefDate, J1.Account, M.Inv_NetAmount
   HAVING ABS(SUM(J1.Debit - J1.Credit) - ISNULL(M.Inv_NetAmount, 0)) > 1;
   ```

---

## 4. BÁO CÁO THUẾ, HÓA ĐƠN ĐIỆN TỬ (TT 78), CHẾ ĐỘ KẾ TOÁN MỚI (THÔNG TƯ 99/2025/TT-BTC THAY THẾ TT 200) & KIỂM SOÁT NỘI BỘ (TT 98)

### 4.1. Báo Cáo Thuế GTGT, TNDN & Hóa Đơn Điện Tử Theo Thông Tư 78/2021/TT-BTC
- **Cấu hình Mã Thuế (`Tax Codes - OSTC`) trên SAP B1:**
  - Tách biệt rõ nhóm Thuế GTGT đầu vào (`Input Tax`: `VA0`, `VA5`, `VA8`, `VA10`, `VANK` - hàng nhập khẩu) gắn vào `TK 1331 / 1332` và nhóm Thuế GTGT đầu ra (`Output Tax`: `VO0`, `VO5`, `VO8`, `VO10`, `VOKCT` - không chịu thuế) gắn vào `TK 33311`.
- **Tích hợp Hóa đơn điện tử chuẩn Thông tư 78/2021/TT-BTC & Nghị định 123/2020/NĐ-CP (Viettel S-Invoice, VNPT, MISA meInvoice, BKAV...):**
  - Thiết lập bộ trường UDF chuẩn trên Header chứng từ (`OINV`, `ORIN`, `OPCH`):
    - `U_EInv_Pattern` (`Mẫu số hóa đơn`, VD: `1/001`)
    - `U_EInv_Serial` (`Ký hiệu hóa đơn` chuẩn TT78, VD: `C26TAA` - trong đó `C` là có mã của cơ quan thuế, `26` là năm 2026, `T` là hóa đơn điện tử giá trị gia tăng)
    - `U_EInv_No` (`Số hóa đơn điện tử` 8 chữ số)
    - `U_EInv_Date` (`Ngày ký phát hành HĐĐT`)
    - `U_EInv_Code` (`Mã của Cơ quan Thuế` - MCCQT)
    - `U_EInv_Status` (`Trạng thái`: `0-Chưa phát hành`, `1-Đã phát hành`, `2-Đã hủy`, `3-Hóa đơn điều chỉnh/thay thế`).
  - Dùng `SBO_SP_TransactionNotification` khóa cứng không cho phép người dùng sửa hoặc Cancel phiếu `A/R Invoice (OINV)` trên SAP B1 nếu `U_EInv_Status = '1'` (đã phát hành HĐĐT có mã CQT) trừ khi đã thực hiện nghiệp vụ Hủy/Điều chỉnh hợp lệ.

### 4.2. Chế Độ Kế Toán Doanh Nghiệp Mới: Thông Tư 99/2025/TT-BTC (Thay Thế Thông Tư 200/2014/TT-BTC Từ 01/01/2026)
- **Mốc pháp lý quan trọng:** Bộ Tài chính ban hành **Thông tư 99/2025/TT-BTC** hướng dẫn Chế độ kế toán doanh nghiệp mới, chính thức có hiệu lực từ ngày **`01/01/2026`** (áp dụng cho năm tài chính bắt đầu từ hoặc sau ngày `01/01/2026`), **thay thế hoàn toàn Thông tư 200/2014/TT-BTC**.
- **Các điểm thay đổi cốt lõi cần cấu hình trên SAP Business One (`OACT`, `Financial Report Templates`):**
  1. **Linh hoạt mở rộng và chi tiết hóa Hệ thống Tài khoản (`Chart of Accounts - OACT`):**
     - Thông tư 99/2025/TT-BTC trao quyền chủ động lớn hơn cho doanh nghiệp trong việc mở thêm các tài khoản cấp 2, cấp 3, cấp 4 và thiết kế danh mục tài khoản quản trị phù hợp với đặc thù vận hành miễn là đảm bảo lên đúng chỉ tiêu trên Báo cáo tài chính (Báo cáo tình hình tài chính, Báo cáo kết quả hoạt động kinh doanh, Báo cáo lưu chuyển tiền tệ).
     - **Kịch bản chuyển đổi/tách tài khoản chi phí (VD mở rộng hoặc ánh xạ đầu `642 -> 643` hoặc tách tiểu khoản quản trị):**
       - Trên SAP B1, cấu trúc `OACT` có 10 ngăn (`Drawers` từ `1` đến `10`: Assets, Liabilities, Equity, Revenues, Cost of Sales, Expenses...).
       - Khi doanh nghiệp cần tách chi phí quản lý doanh nghiệp (`642`), chi phí bán hàng (`641`) hoặc mở thêm nhóm tài khoản chi phí chuyên biệt (như `643` cho chi phí quản trị/phát triển/dự án nội bộ theo quy chế tài chính công ty hoặc tập đoàn đa quốc gia), tư vấn viên InfoAsia thực hiện:
         - Tạo mã tài khoản mới trong `OACT` (`Postable = 'Y'` cho tài khoản hạch toán chi tiết, `Postable = 'N'` cho tài khoản tổng hợp cấp cha).
         - Điền mã tài khoản cũ hoặc mã tài khoản tập đoàn vào cột **`ExportCode`** hoặc **`FatherNum`** để hỗ trợ đối chiếu song song (`Dual Reporting` TT200 <-> TT99).
         - Cập nhật lại cây **Financial Report Templates (`OFRC` / `FRC1`)** cho Bảng Cân đối Kế toán (nay là **Báo cáo tình hình tài chính**) và Báo cáo Kết quả HĐKD để gom đủ số dư tài khoản mới vào đúng Mã chỉ tiêu (`Code`).
  2. **Chuẩn hóa tiệm cận IFRS (Chuẩn mực Báo cáo Tài chính Quốc tế):**
     - Tăng cường theo dõi Giá trị hợp lý (`Fair Value`), Tổn thất suy giảm giá trị tài sản (`Impairment`), Thuế thu nhập hoãn lại (`Deferred Tax - TK 243 / 347`), và ghi nhận doanh thu đa thành phần. Trên SAP B1, có thể bật tính năng **Parallel Accounting / IFRS Posting** hoặc sử dụng các tài khoản điều chỉnh kết hợp `ProjectCode` / `Cost Center (OcrCode..OcrCode5)`.

### 4.3. Quy Chế Kiểm Soát Nội Bộ & Kiểm Toán Nội Bộ (Thông Tư 98 & Chuẩn Quản Trị ERP)
Để hệ thống SAP B1 đáp ứng yêu cầu kiểm soát nội bộ, phòng chống gian lận và phục vụ kiểm toán độc lập / kiểm toán nội bộ (theo định hướng Thông tư 98 và quy chế kiểm soát tài chính doanh nghiệp):
1. **Bất kiêm nhiệm (`Segregation of Duties - SoD`) trên `OUSR` & `USR3`:**
   - Người tạo `Purchase Order (OPOR)` không được đồng thời là người xác nhận nhập kho `GRPO (OPDN)` và người duyệt chi `Outgoing Payment (OVPM)`.
   - Người quản lý danh mục Nhà cung cấp / Tài khoản ngân hàng (`OCRD`) phải qua quy trình phê duyệt (`Approval Procedures - OWDD`) trước khi giao dịch.
2. **Truy vết Nhật ký Thay đổi (`Change Log - ADOC / ADO1 / AITM / ACRD`):**
   - Mọi thao tác sửa giá, sửa chiết khấu, đổi tài khoản hạch toán hoặc mở khóa hạn mức tín dụng (`Credit Limit`) trên SAP B1 đều được lưu lịch sử bất biến trong các bảng lịch sử bắt đầu bằng chữ **`A`** (`ADOC` lưu lịch sử mọi chứng từ, `ADO1` lưu lịch sử dòng chứng từ, `AITM` lưu lịch sử sửa vật tư, `ACRD` lưu lịch sử sửa đối tác).
   - Truy vấn kiểm toán đối chiếu lịch sử sửa chứng từ:
     ```sql
     SELECT
         T0.DocEntry,
         T0.DocNum,
         T0.ObjType,
         T0.LogInstanc AS [Phien_Ban_Sua],
         T0.UpdateDate AS [Ngay_Sua],
         T0.UpdatedBy  AS [User_ID_Sua],
         U.U_NAME      AS [Ten_Nguoi_Sua],
         T0.DocTotal   AS [Tong_Tien_Tai_Phien_Ban]
     FROM ADOC T0 WITH (NOLOCK)
     LEFT JOIN OUSR U WITH (NOLOCK) ON T0.UpdatedBy = U.INTERNAL_K
     WHERE T0.ObjType = '22' -- 22 = Purchase Order
       AND T0.DocNum = [%0]
     ORDER BY T0.LogInstanc ASC;
     ```
