---
name: sap-b1-beas
description: "Kiến trúc SAP Business One (9.3/10.0) & Boyum Beas: sản xuất, giá thành WIP 154, Thông tư 99/2025, SDK & DTW."
group: "ERP SAP B1 & SQL"
---

# SAP B1 (9.3 & 10.0) & Boyum IT Beas Manufacturing — Bộ Kỹ Năng Đã Băm Nhỏ (Smart-Loading)

<!-- JAVIS_TRIGGER_ARCHIVE_START -->
## Khi nào dùng (Triggers & Ngữ cảnh kích hoạt đầy đủ)

> Kiến trúc sư Giải pháp & Tổng Công Trình Sư SAP Business One (9.3 & 10.0 MS SQL / HANA) và Boyum IT Beas Manufacturing. Bao gồm: Kiến trúc DB 9.3 vs 10.0, Beas Manufacturing (Work Order, BOM Batch Changes batchanderung.htm, Routing, BDC Time Receipt, QC, đóng lệnh ABGKZ), Kế toán Giá thành Sản xuất (WIP TK 154, lệch sổ kho OINM vs sổ cái OJDT), Luồng Mua-Bán-Kho (P2P, O2C, Batch OBTN, Serial OSRN, Bin OBIN, MRP), Thuế & Chế độ Kế toán (Thông tư 99/2025/TT-BTC thay TT 200 từ 01/01/2026, TT 78, TT 98), Lập trình SDK (DI API, UI API, Service Layer port 50000, UDO) và DTW Import Master Data. TRIGGERS: "sap b1", "beas", "beas manufacturing", "batchanderung", "lệnh sản xuất beas", "giá thành sap", "wip 154", "thông tư 99", "dtw import", "service layer sap", "di api", "ui api", "udo sap".
<!-- JAVIS_TRIGGER_ARCHIVE_END -->

Skill này đóng gói toàn bộ kho tri thức chuyên sâu của **Javis OS InfoAsia ERP Center** về **SAP Business One (9.3 & 10.0)** và **Boyum IT Beas Manufacturing**, đã được băm nhỏ thành **10 học phần tham chiếu (`references/`)** và **công cụ thực thi (`scripts/`)** để tối ưu hóa ngữ cảnh (chỉ đọc đúng file cần dùng, không nạp thừa).

---

## 1. Bảng Điều Hướng Nạp Thông Minh (Smart-Loading Reference Index)

Khi giải quyết yêu cầu của người dùng, **chỉ đọc (`read_file`) đúng file tham chiếu tương ứng** trong thư mục `references/` dưới đây:

| STT | File trong `references/` | Dung lượng | Khi nào cần nạp (Trigger / Chủ đề) |
| :--- | :--- | :--- | :--- |
| **01** | `references/01-sap-b1-93-vs-100-sql-architecture.md` | ~24 KB | So sánh kiến trúc DB SAP B1 9.3 vs 10.0 (`ItemCode`/`CardCode` 50 ký tự, `ODRF`, `OATC`, phân quyền), quy tắc họ bảng (`O` + `1..12`), danh mục `ObjType`, `TransactionNotification` & FMS. |
| **02** | `references/02-beas-manufacturing-batchanderung-and-db.md` | ~20 KB | **Boyum Beas Manufacturing**: Thay đổi BOM hàng loạt (`batchanderung.htm` — 4 tab `Substitute`, `Add`, `Delete`, `Locked Work Orders`), sơ đồ bảng Beas (`BEAS_STL`, `BEAS_APL`, `BEAS_FTHAUPT`, `BEAS_FTPOS`, `BEAS_FTSTL`, `BEAS_FTAPL`, `BEAS_ARBZEIT`, `BEAS_QS*`), từ điển cột tiếng Đức $\rightarrow$ Việt/Anh, 5 nguyên nhân không đóng được lệnh sản xuất (`ABGKZ`). |
| **03** | `references/03-ke-toan-gia-thanh-mua-ban-kho-thue-tt99-tt98.md` | ~20 KB | Luồng Mua hàng (`PR -> PQ -> PO -> GRPO -> Landed Costs OIPF -> AP Invoice`), Bán hàng (`O2C`), Kho (`Available = OnHand - IsCommited + OnOrder`, Batch `OBTN`, Serial `OSRN`, Bin `OBIN/OIBQ`, MRP), **Tính giá thành WIP TK 154**, đối chiếu lệch kho `OINM` vs sổ cái `OJDT`, **Thông tư 99/2025/TT-BTC** (thay thế TT 200 từ 01/01/2026, mở rộng tài khoản `642 -> 643`), TT 78, TT 98. |
| **04** | `references/04-sap-b1-sdk-diapi-uiapi-udo-and-server-dba.md` | ~17 KB | Lập trình **DI API (`SAPbobsCOM`)**, **UI API (`SAPbouiCOM`)**, **Service Layer REST API (Port 50000)**, đăng ký **UDT/UDF/UDO**, quy trình **DTW Import Master Data** (2 dòng Header chuẩn) & Quản trị MS SQL Server DBA (Blocking/Deadlock, Index, Backup). |
| **05** | `references/05-beas-sap-b1-database-guide.md` | ~6 KB | Quy tắc đặt tên bảng Beas & SAP B1 theo từng phân hệ (Work Order, BOM, Routing, Time Receipt, QC). |
| **06** | `references/06-sap-b1-beas-costing-production-inventory-master.md` | ~8 KB | Cẩm nang chuyên sâu kết nối Giá thành Sản xuất Beas (`BEAS_FTHAUPT`/`BEAS_ARBZEIT`) với Bút toán Kho & Sổ cái SAP B1 (`OIGN`/`OIGE`/`OJDT`). |
| **07** | `references/07-cam-nang-sap-b1-93-10-sql-va-beas-manufacturing.md` | ~12 KB | Tóm tắt thực chiến dành cho Tư vấn viên & Kỹ sư triển khai SAP B1 9.3/10.0 + Beas Manufacturing. |
| **08** | `references/08-cam-nang-ke-toan-gia-thanh-thue-va-luong-nghiep-vu-erp.md` | ~9 KB | Tóm tắt thực chiến Kế toán Tổng hợp, Giá thành, Mua-Bán-Kho và chuyển đổi Thông tư 99/2025/TT-BTC. |
| **09** | `references/09-sap-b1-beas-manufacturing-master.md` | ~21 KB | Sổ tay Tổng Công Trình Sư SAP B1 & Beas Manufacturing toàn diện (Troubleshooting, Quy trình chuẩn, Best Practices). |
| **10** | `references/10-huong-dan-n8n-sap.md` | ~7 KB | Kiến trúc tự động hóa tạo đơn hàng SAP B1 từ Email/Webhook bằng n8n qua Service Layer. |

---

## 2. Nguyên Tắc Bất Biến Về Kiến Trúc SAP B1 & Beas Manufacturing

### 2.1. An Toàn Dữ Liệu & Bảo Hành Hãng (Zero Direct Write on Standard Tables)
- **CẤM TUYỆT ĐỐI** chạy hoặc xúi giục chạy `INSERT`, `UPDATE`, `DELETE`, `DROP`, `ALTER`, `TRUNCATE` trực tiếp bằng SQL lên các bảng chuẩn của SAP B1 (`OITM`, `OCRD`, `ORDR`, `OINV`, `OJDT`, `OINM`...) và các bảng chuẩn của Beas (`BEAS_FTHAUPT`, `BEAS_FTPOS`, `BEAS_STL`...).
- Mọi thao tác ghi dữ liệu vào SAP B1 bắt buộc đi qua:
  1. **SAP B1 Service Layer (`https://<server>:50000/b1s/v1/Login`)** trên SAP B1 10.0 (ví dụ Con 24 — Database `infoasia56`, tài khoản `manager`).
  2. **DI API (`SAPbobsCOM`)** hoặc **Beas Script / BSL (Beas Service Layer)**.
  3. **DTW (Data Transfer Workbench)** cho Import Master Data / Chứng từ hàng loạt.

### 2.2. Kiến Trúc Bảng Cốt Lõi Của Boyum IT Beas Manufacturing
| Phân hệ Beas | Bảng Header | Bảng Detail / Mở rộng | Khóa chính & Liên kết SAP B1 |
| :--- | :--- | :--- | :--- |
| **Định mức nguyên vật liệu (BOM)** | `BEAS_STL_HEADER` | `BEAS_STL` | `ItemCode` + `POS_ID` (`ART1_ID` là mã NVL con, liên kết `OITM.ItemCode`). |
| **Quy trình công nghệ (Routing)** | `BEAS_APL_HEADER` | `BEAS_APL`, `BEAS_APLATZ` (Máy/Trạm) | `ItemCode` + `ROUTINGID` + `POS_ID` (`APLATZ_ID` là mã trạm máy). |
| **Lệnh sản xuất (Work Order)** | `BEAS_FTHAUPT` | `BEAS_FTPOS` (Assembly), `BEAS_FTSTL` (BOM lệnh), `BEAS_FTAPL` (Routing lệnh) | `BELNR_ID` (Số lệnh SX Beas), `BELPOS_ID` (Vị trí Pos). Liên kết xuất/nhập kho SAP B1 qua `OIGE`/`IGE1` và `OIGN`/`IGN1`. |
| **Ghi nhận giờ công (Time Receipt / BDC)** | `BEAS_ARBZEIT` | — | `BELNR_ID` + `BELPOS_ID` + `POS_ID` + `PERS_ID` (Nhân công) + `APLATZ_ID` (Máy). |
| **Kiểm tra chất lượng (QC)** | `BEAS_QSFTHAUPT` | `BEAS_QSFTPOS` | `BELNR_ID` + `BELPOS_ID` + `KND_ID` / `ItemCode`. |

### 2.3. 5 Nguyên Nhân Kinh Điển Không Đóng Được Lệnh Sản Xuất Beas (`ABGKZ = 'J'`)
1. Còn phiếu xuất kho nháp / giao dịch kho treo chưa hạch toán hết trong `BEAS_FTSTL` hoặc `ODRF`.
2. Đang có công nhân BDC (`BEAS_ARBZEIT`) bấm giờ (`Start`) trên công đoạn (`BEAS_FTAPL`) mà chưa bấm kết thúc (`Stop`).
3. Vị trí bán thành phẩm cấp dưới (`Sub-Assembly` trong `BEAS_FTPOS`) chưa được đóng hoặc chưa nhập kho đủ theo quy định.
4. Phiếu kiểm tra chất lượng (`BEAS_QSFTHAUPT` / QC Order) bắt buộc ở công đoạn cuối chưa được duyệt (`Release/Decision`).
5. Kỳ kế toán (`Posting Period` trong SAP B1 `OFPR`) tại ngày đóng lệnh đang bị khóa (`Locked`) hoặc tài khoản WIP `154` thiếu phân bổ Trung tâm chi phí (`Profit Center / Distribution Rule`).

---

## 3. Công Cụ DTW Import Master Data (`scripts/dtw_master_importer.py`)

Khi cần kiểm tra cấu trúc 2 dòng Header chuẩn của DTW (Row 1: Tên trường DTW API, Row 2: Tên cột DB SAP), chuyển đổi Hệ thống Tài khoản Kế toán (ví dụ mở rộng đầu `642` sang `643` theo Thông tư 99/2025/TT-BTC), hoặc kiểm tra lỗi trùng khóa trước khi Import DTW:
- Sử dụng script: `scripts/dtw_master_importer.py` (hoặc thư mục gốc `E:\DIEN APP\SAP B1 IMPORT MASTER DATA\dtw_master_importer.py`).
- Khi cần truy vấn dữ liệu trực tiếp trên 5 Server SAP B1 (`/24`, `/160`, `/160 HCM`, `/160 LT`, `/52`), kết hợp ngay với skill **`sql-sap-b1`** và **`viet-sql-sap-b1`**.
