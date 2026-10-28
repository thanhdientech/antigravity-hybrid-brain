# 📘 CẨM NANG CHUYÊN SÂU: SAP B1, BEAS MANUFACTURING, KẾ TOÁN GIÁ THÀNH, SẢN XUẤT (BOM/WO), KHO, MUA HÀNG & SERVER

Tài liệu nguồn chuẩn hóa toàn bộ nghiệp vụ và kỹ thuật chuyên sâu cho **Bot Tomi Nguyen (`p1-07-tong-cong-trinh-su-sap-b1-beas`)**:

---

## 1. PHÂN HỆ MUA HÀNG (PURCHASING - A/P) & CHI PHÍ MUA HÀNG (LANDED COSTS)

1. **Chuỗi chứng từ chuẩn P2P (`Procure-to-Pay`):**
   - `Purchase Request (OPRQ / PRQ1 - ObjType 1470000113)` -> `Purchase Quotation (OPQT / PQT1 - ObjType 540000006)` -> `Purchase Order (OPOR / POR1 - ObjType 22)` -> `Goods Receipt PO (OPDN / PDN1 - ObjType 20)` -> `Landed Costs (OIPF / IPF1 - ObjType 69)` -> `A/P Invoice (OPCH / PCH1 - ObjType 18)` -> `Outgoing Payment (OVPM / VPM2 - ObjType 46)`.
2. **Định khoản tự động (`G/L Account Determination`):**
   - **Khi nhập kho `GRPO (OPDN)`:** `Nợ TK Kho (152/156 - Inventory Account)` / `Có TK Phải trả tạm tính (Allocation Account / GRNI - 3318)`.
   - **Khi phân bổ chi phí nhập khẩu/ vận chuyển `Landed Costs (OIPF)`:** `Nợ TK Kho (152/156)` / `Có TK Phải trả chi phí mua hàng (Landed Cost Clearing Account)` (phân bổ theo Giá trị tiền `Cash Value`, Trọng lượng `Weight`, Thể tích `Volume`, hoặc Số lượng `Quantity`).
   - **Khi nhận Hóa đơn `A/P Invoice (OPCH)`:** `Nợ TK Phải trả tạm tính (Allocation Account - 3318)` + `Nợ TK Thuế GTGT (1331)` / `Có TK Phải trả NCC (331 - Control Account)`.

---

## 2. QUẢN LÝ KHO (INVENTORY MANAGEMENT), LÔ/SERIAL & MRP

1. **Công thức tồn kho khả dụng (`OITM` & `OITW`):**
   - `Available = OnHand (Tồn thực tế) - IsCommited (Đã giữ chỗ cho SO/Lệnh SX) + OnOrder (Đang đặt PO/Đang SX)`.
2. **Quản lý Lô (`Batch - OBTN`) & Serial (`OSRN`) & Vị trí Bin (`OBIN`):**
   - Bảng giao dịch Lô/Serial: `OITL` (Header) nối `ITL1` (Line: `SysNumber`, `Quantity`) và `OBTN` (`DistNumber` = Số lô, `ExpDate` = Hạn dùng, `InDate` = Ngày nhập).
   - Bảng tồn kho theo vị trí Bin: `OBIN` (Danh mục Bin), `OIBQ` (Tồn theo Bin), `OBBQ` (Tồn theo Batch + Bin).
3. **Hoạch định Nguyên vật liệu (`MRP - OMPS / ORCM`):**
   - Hàng có `PrcrmntMtd = 'M' (Make)`: MRP đề xuất sinh **Lệnh sản xuất (`Production Order / Beas Work Order`)** và tự động bung BOM đa cấp tính nhu cầu nguyên vật liệu con theo `LeadTime`.
   - Hàng có `PrcrmntMtd = 'B' (Buy)`: MRP đề xuất sinh **`Purchase Request (OPRQ)`** hoặc **`Purchase Order (OPOR)`** theo `MinOrdrQty`, `OrderMulti`, `LeadTime` và tồn kho tối thiểu (`MinLevel`).

---

## 3. QUẢN LÝ SẢN XUẤT CHUẨN SAP B1 (BOM & PRODUCTION ORDER)

1. **Cấu trúc BOM (`OITT` & `ITT1` - ObjType `66`):**
   - 4 loại BOM (`TreeType`): `Production ('P')`, `Assembly ('A')`, `Sales ('S')`, `Template ('T')`.
   - 4 loại dòng thành phần (`ITT1.Type`): `4` (Item - Nguyên vật liệu; nếu `Quantity < 0` là Phụ phẩm `By-Product`), `290` (Resource - Máy móc/Nhân công/Chi phí SXC), `-18` (Text), và `Route Stage` (Công đoạn).
2. **Lệnh sản xuất chuẩn (`OWOR` & `WOR1` - ObjType `202`):**
   - 3 loại lệnh (`OWOR.Type`): `Standard ('S')`, `Special ('P')`, `Disassembly ('D' - Tháo dỡ)`.
   - 4 trạng thái (`OWOR.Status`): `Planned ('P')` -> `Released ('R')` -> `Closed ('L')` / `Cancelled ('C')`.
   - Xuất kho sản xuất (`Issue for Production - OIGE / IGE1 - ObjType 60`): Theo phương pháp `Manual ('M')` hoặc `Backflush ('B')`.
   - Nhập kho thành phẩm (`Receipt from Production - OIGN / IGN1 - ObjType 59`): Nhập thành phẩm đạt (`Complete`), phế phẩm (`Reject`), hoặc nhập phụ phẩm (`By-Product`).

---

## 4. QUẢN TRỊ SẢN XUẤT CHUYÊN SÂU BEAS MANUFACTURING (2025.12)

1. **Hệ thống bảng lõi Beas Manufacturing:**
   - `BEAS_STL_HEADER` & `BEAS_STL`: Định mức BOM chuẩn đa cấp, quản lý nhiều `Version/Revision`, linh kiện thay thế (`Alternative Item`), bán thành phẩm ảo (`Phantom`).
   - `BEAS_APL_HEADER` & `BEAS_APL`: Quy trình công nghệ (`Routing`), thời gian chuẩn bị máy (`RUESTZEIT`), thời gian gia công (`BEARBEITUNGSZEIT`), đơn giá chi phí theo trạm máy (`BEAS_APLATZ`).
   - `BEAS_FTHAUPT` (`BELNR_ID`): Header Lệnh sản xuất Beas.
   - `BEAS_FTPOS` (`BELNR_ID`, `BELPOS_ID`): Các vị trí bán thành phẩm / thành phẩm đa cấp nằm trong cùng 1 Lệnh sản xuất.
   - `BEAS_FTSTL` (`BELNR_ID`, `BELPOS_ID`, `POS_ID`): Chi tiết nguyên vật liệu cần xuất và đã xuất (`GEL_MENGE`) của từng vị trí lệnh.
   - `BEAS_FTAPL` (`BELNR_ID`, `BELPOS_ID`, `POS_ID`): Chi tiết công đoạn gia công trong lệnh.
   - `BEAS_ARBZEIT`: Bảng chấm công / ghi nhận thời gian gia công thực tế (`Time Receipt` từ BDE Terminal / WebApps).
   - `BEAS_QSFTHAUPT` & `BEAS_QSFTPOS`: Quản lý chất lượng (`QC Order` - kiểm tra đầu vào IQC, trong sản xuất IPQC, đầu ra OQC).
2. **5 Nguyên nhân không đóng được Lệnh sản xuất (`BELNR_ID`) trong Beas:**
   - Còn công nhân đang bấm `Start` mà chưa `Stop` trên Terminal (`BEAS_ARBZEIT` / `BEAS_FTSTAMP`).
   - Còn phiếu kiểm tra chất lượng `QC Order` (`BEAS_QSFTHAUPT`) chưa duyệt `Release/Transfer`.
   - Còn vị trí bán thành phẩm con (`Sub-assembly BELPOS_ID`) đang mở (`ABGKZ <> 'J'`).
   - Còn đơn hàng gia công ngoài (`Subcontracting PO`) chưa nhập kho `GRPO`.
   - Kỳ kế toán (`Posting Period`) trong SAP B1 đã khóa hoặc dịch vụ `Beas Common Service` bị dừng.

---

## 5. KẾ TOÁN, CHI PHÍ & TÍNH GIÁ THÀNH SẢN XUẤT (FI/CO & PRODUCTION COSTING)

1. **Luồng hạch toán kế toán giá thành sản xuất chuẩn (VAS Việt Nam & SAP B1/Beas):**
   - **Bước 1 - Xuất nguyên vật liệu (`OIGE`):** `Nợ TK 1541 (WIP Material)` / `Có TK 152 (Raw Material Inventory)`.
   - **Bước 2 - Ghi nhận Nhân công & Chi phí SXC (`OIGE Resource` / `BEAS_ARBZEIT`):** `Nợ TK 1542, 1543 (WIP Labor & Overhead)` / `Có TK 622, 627 (WIP Offset P&L Account)`.
   - **Bước 3 - Nhập kho Thành phẩm (`OIGN`):** `Nợ TK 155 (Finished Goods Inventory)` / `Có TK 154 (WIP Account)`.
   - **Bước 4 - Nhập kho Phế liệu / Phụ phẩm (`OIGN By-Product`):** `Nợ TK 152 (Scrap/By-Product)` / `Có TK 154 (Giảm chi phí WIP)`.
   - **Bước 5 - Đóng Lệnh sản xuất (`OWOR.Status = 'L'` / `Beas Close`):** Hạch toán kết chuyển chênh lệch giá thành (`Production Variance`): `Nợ/Có TK 154` <-> `Có/Nợ TK 155 hoặc TK 632 (WIP Variance Account)` để số dư `TK 154` của lệnh đã đóng luôn bằng `0`.
2. **Nguyên tắc đối chiếu Sổ kho (`Inventory Audit Report - OINM/OIVL`) và Sổ cái (`G/L - OJDT/JDT1`):**
   - Luôn tích chọn **`Block Manual Posting`** trên các tài khoản Kho (`152, 155, 156`) trong `Chart of Accounts (OACT)` để ngăn kế toán hạch toán tay làm lệch Sổ kho và Sổ cái.
   - Khi cần điều chỉnh giá trị tồn kho mà không thay đổi số lượng, bắt buộc dùng chứng từ **`Inventory Revaluation (OMRV - ObjType 162)`**.

---

## 6. QUẢN TRỊ SERVER & HẠ TẦNG KỸ THUẬT (SAP HANA, SQL SERVER, SERVICE LAYER, BEAS SERVER)

1. **SAP HANA trên Linux (SUSE SLES / RHEL):**
   - Kiểm tra trạng thái: `su - ndbadm -c "HDB info"`, `systemctl status sapb1servertools.service`, `systemctl status b1s.service`.
   - Giám sát phân vùng `/hana/log` và `/hana/data` (`df -h`); tuyệt đối không xóa file vật lý trong `/hana/log` bằng `rm`, phải dùng `ALTER SYSTEM RECLAIM LOG` sau khi đã backup log.
2. **MS SQL Server & Windows Server:**
   - Kiểm tra `Blocking / Deadlock` qua `sys.dm_exec_requests` và `sys.dm_exec_sql_text`.
   - Đảm bảo 4 nhóm dịch vụ luôn `Running`: `MSSQLSERVER`, `SAP Business One SLD / License Manager`, `SAP B1 Service Layer / DI Server`, và **`Beas Common Service`**.
