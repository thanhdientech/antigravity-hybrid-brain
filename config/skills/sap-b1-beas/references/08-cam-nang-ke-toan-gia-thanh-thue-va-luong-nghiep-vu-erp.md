---
type: wiki
title: "Cẩm Nang Kế Toán Tổng Hợp, Giá Thành Sản Xuất (WIP TK 154), Mua - Bán - Kho & Thuế (TT 99/2025 - TT 200 - TT 78 - TT 98)"
status: active
tags:
  - wiki
  - accounting-costing
  - wip-154
  - thong-tu-99-2025
  - thong-tu-78-98
  - inventory-mrp
created: '2026-10-18'
updated: '2026-10-18'
source: "[[03-ke-toan-gia-thanh-mua-ban-kho-thue-tt99-tt98]], [[01-sap-b1-93-vs-100-sql-architecture]]"
---

# Cẩm Nang Kế Toán Tổng Hợp, Giá Thành Sản Xuất (WIP TK 154), Mua - Bán - Kho & Thuế (TT 99/2025 - TT 200 - TT 78 - TT 98)

> Trang Wiki nghiệp vụ cốt lõi dành cho **[[ia-02-chuyen-gia-ke-toan-gia-thanh-thue]]** và **[[ia-01-tong-cong-trinh-su-sap-b1-beas]]** thuộc đội ngũ Tư vấn **Enterprise**. Chưng cất từ [[03-ke-toan-gia-thanh-mua-ban-kho-thue-tt99-tt98]], liên kết trực tiếp với [[cam-nang-sap-b1-93-10-sql-va-beas-manufacturing]] và [[cam-nang-sql-fms-sdk-dtw-va-quan-tri-server]].

---

## 1. Luồng Chứng Từ & Bút Toán Tự Động Mua Hàng (P2P), Bán Hàng (O2C) & Kho (Inventory/MRP)

### 1.1. Chuỗi Mua Hàng & Phân Bổ Chi Phí Nhập Khẩu (`Procure-to-Pay`)
1. **`Purchase Request (OPRQ - 1470000113)` -> `Purchase Quotation (OPQT - 540000006)` -> `Purchase Order (OPOR - 22)`:** Không sinh bút toán kế toán; `OPOR` làm tăng lượng hàng đang đặt **`OITW.OnOrder`** [[03-ke-toan-gia-thanh-mua-ban-kho-thue-tt99-tt98]].
2. **`Goods Receipt PO (OPDN - 20)`:** Nhập kho thực tế, tăng `OITW.OnHand`, giảm `OnOrder`, định khoản tự động:
   - **Nợ TK Kho (`152` / `153` / `156` - Inventory Account)** / **Có TK Phải trả tạm tính (`3318` - Allocation Account / GRNI)** [[03-ke-toan-gia-thanh-mua-ban-kho-thue-tt99-tt98]].
3. **`Landed Costs (OIPF - 69)`:** Phân bổ chi phí vận tải quốc tế, bảo hiểm, thuế nhập khẩu, phí hải quan vào giá vốn lô hàng theo `Cash Value`, `Weight`, `Volume` hoặc `Quantity`:
   - **Nợ TK Kho (`152` / `156`)** / **Có TK Phải trả chi phí mua hàng (`3318` / `3388` - Landed Costs Clearing Account)** [[03-ke-toan-gia-thanh-mua-ban-kho-thue-tt99-tt98]].
4. **`A/P Invoice (OPCH - 18)` & `Outgoing Payment (OVPM - 46)`:**
   - Khi lên Hóa đơn mua hàng (`OPCH`): **Nợ TK `3318` (Allocation Account)** + **Nợ TK Thuế GTGT (`1331`)** / **Có TK Phải trả NCC (`3311`)** [[03-ke-toan-gia-thanh-mua-ban-kho-thue-tt99-tt98]].
   - Khi chi tiền (`OVPM`): **Nợ TK `3311`** / **Có TK Tiền (`111` / `112`)** [[03-ke-toan-gia-thanh-mua-ban-kho-thue-tt99-tt98]].

### 1.2. Chuỗi Bán Hàng (`Order-to-Cash`) & Quản Lý Tồn Kho / MRP
1. **`Sales Quotation (OQUT - 23)` -> `Sales Order (ORDR - 17)`:** Đơn hàng bán `ORDR` giữ chỗ tồn kho làm tăng **`OITW.IsCommited`** [[03-ke-toan-gia-thanh-mua-ban-kho-thue-tt99-tt98]].
2. **`Delivery (ODLN - 15)`:** Xuất kho giao hàng, giảm `OnHand` và `IsCommited`, hạch toán giá vốn:
   - **Nợ TK Giá vốn hàng bán / Hàng gửi bán (`632` / `157`)** / **Có TK Kho (`155` / `156`)** [[03-ke-toan-gia-thanh-mua-ban-kho-thue-tt99-tt98]].
3. **`A/R Invoice (OINV - 13)` & `Incoming Payment (ORCT - 24)`:**
   - Khi xuất Hóa đơn GTGT (`OINV`): **Nợ TK Phải thu KH (`1311`)** / **Có TK Doanh thu (`5111`/`5112`)** + **Có TK Thuế GTGT đầu ra (`33311`)** [[03-ke-toan-gia-thanh-mua-ban-kho-thue-tt99-tt98]].
   - Khi thu tiền (`ORCT`): **Nợ TK Tiền (`111` / `112`)** / **Có TK `1311`** [[03-ke-toan-gia-thanh-mua-ban-kho-thue-tt99-tt98]].
4. **Công thức Tồn kho Khả dụng & Hoạch định MRP (`OMPS` / `ORCM`):**
   - `Available = OnHand - IsCommited + OnOrder` (trên `OITM` và `OITW`) [[03-ke-toan-gia-thanh-mua-ban-kho-thue-tt99-tt98]].
   - Truy vết Lô tại `OBTN` (`OITL`/`ITL1`/`OBTQ`), Serial tại `OSRN` (`OSRQ`), Vị trí Bin tại `OBIN` (`OIBQ`/`OBBQ`) [[03-ke-toan-gia-thanh-mua-ban-kho-thue-tt99-tt98]].
   - Mặt hàng `Make ('M')` được MRP đề xuất Lệnh sản xuất; mặt hàng `Buy ('B')` được đề xuất `PR (OPRQ)` hoặc `PO (OPOR)` theo `LeadTime`, `MinOrdrQty`, `OrderMulti` [[03-ke-toan-gia-thanh-mua-ban-kho-thue-tt99-tt98]].

---

## 2. Kế Toán Chi Phí & Tính Giá Thành Sản Xuất (`WIP TK 154`)

| Bước Nghiệp Vụ Sản Xuất | Chứng Từ SAP B1 / Beas | Định Khoản Kế Toán (`OJDT` / `JDT1`) | Nguyên Tắc Kiểm Soát Giá Thành |
| :--- | :--- | :--- | :--- |
| **1. Xuất kho NVL trực tiếp** | `Issue for Production (OIGE - 60)` | **Nợ TK `1541` (WIP NVL)** / **Có TK `152` (Kho NVL)** *(hoặc qua `621 -> 1541`)* | Kiểm soát định mức tiêu hao trên `WOR1` / `BEAS_FTSTL` [[03-ke-toan-gia-thanh-mua-ban-kho-thue-tt99-tt98]]. |
| **2. Ghi nhận Nhân công & SXC** | `OIGE (Resource)` / `BEAS_ARBZEIT` | **Nợ TK `1542`, `1543` (WIP NC & SXC)** / **Có TK `622`, `627` (WIP Offset P&L)** | Cuối kỳ phân bổ chênh lệch chi phí `622`, `627` thực tế vào `154` theo giờ công `ZEIT` hoặc sản lượng `GEL_MENGE` [[03-ke-toan-gia-thanh-mua-ban-kho-thue-tt99-tt98]]. |
| **3. Nhập kho Thành phẩm** | `Receipt from Production (OIGN - 59)` | **Nợ TK `155` (Kho Thành phẩm)** / **Có TK `154` (WIP)** | Nhập theo giá thành kế hoạch/tạm tính trong kỳ hoặc giá thực tế tích lũy trên lệnh [[03-ke-toan-gia-thanh-mua-ban-kho-thue-tt99-tt98]]. |
| **4. Nhập kho Phụ phẩm / Phế liệu** | `OIGN (By-Product, Qty < 0)` | **Nợ TK `152` (Phế liệu thu hồi)** / **Có TK `154` (Giảm WIP)** | Làm giảm trực tiếp tổng chi phí dở dang của Lệnh sản xuất [[03-ke-toan-gia-thanh-mua-ban-kho-thue-tt99-tt98]]. |
| **5. Đóng Lệnh & Kết chuyển Chênh lệch** | `Close Production Order` (`OWOR.Status = 'L'`) + `OMRV (162)` | **Nợ/Có TK `154`** đối ứng **Có/Nợ TK `155` / `632` (WIP Variance)** | Đảm bảo mọi Lệnh sản xuất đã đóng (`Closed`) có **số dư `TK 154 = 0`**; dùng `OMRV` cập nhật lại giá vốn lô TP [[03-ke-toan-gia-thanh-mua-ban-kho-thue-tt99-tt98]]. |

- **Quy tắc chống lệch Sổ kho (`OINM`) và Sổ cái (`OJDT`):** Bắt buộc bật **`Block Manual Posting`** trên tất cả các tài khoản Kho (`152`, `153`, `155`, `156`) trong `OACT` để chặn hạch toán tay bằng `Journal Entry`; khi cần điều chỉnh giá trị kho chỉ dùng **`Inventory Revaluation (OMRV - ObjType 162)`** [[03-ke-toan-gia-thanh-mua-ban-kho-thue-tt99-tt98]].

---

## 3. Pháp Lý Thuế, Hóa Đơn Điện Tử (TT 78), Chế Độ Kế Toán Mới (Thông Tư 99/2025/TT-BTC) & Kiểm Soát Nội Bộ (TT 98)

1. **Hóa đơn điện tử theo Thông tư 78/2021/TT-BTC (Nghị định 123/2020/NĐ-CP):**
   - Chuẩn hóa bộ UDF tích hợp API HĐĐT trên `OINV`, `ORIN`, `OPCH` (`U_EInv_Pattern`, `U_EInv_Serial` dạng `C26TAA`, `U_EInv_No`, `U_EInv_Date`, `U_EInv_Code`, `U_EInv_Status`) và khóa sửa/hủy chứng từ SAP khi hóa đơn đã ký phát hành (`U_EInv_Status = '1'`) [[03-ke-toan-gia-thanh-mua-ban-kho-thue-tt99-tt98]].
2. **Chế độ Kế toán Doanh nghiệp mới theo Thông tư 99/2025/TT-BTC (Thay thế Thông tư 200/2014/TT-BTC từ `01/01/2026`):**
   - **Hiệu lực:** Áp dụng từ ngày **`01/01/2026`**, thay thế hoàn toàn Thông tư 200/2014/TT-BTC [[03-ke-toan-gia-thanh-mua-ban-kho-thue-tt99-tt98]].
   - **Cấu hình Hệ thống Tài khoản (`OACT`) & Báo cáo tài chính (`OFRC`/`FRC1`):**
     - Cho phép doanh nghiệp chủ động mở rộng, chi tiết hóa các tiểu khoản cấp 2, 3, 4 và thiết kế lại các nhóm tài khoản chi phí/doanh thu quản trị (ví dụ: tách chi tiết chi phí bán hàng `641`, chi phí quản lý doanh nghiệp `642`, hoặc mở rộng/ánh xạ sang đầu tài khoản `643` cho chi phí quản trị/phát triển/dự án đặc thù theo yêu cầu của doanh nghiệp hoặc tập đoàn) [[03-ke-toan-gia-thanh-mua-ban-kho-thue-tt99-tt98]].
     - Sử dụng trường `ExportCode` trên `OACT` để ánh xạ song song (`Dual Mapping` giữa tài khoản cũ TT200 và tài khoản mới TT99/IFRS), đồng thời cập nhật lại cây chỉ tiêu trong **Financial Report Templates** cho **Báo cáo tình hình tài chính** (thay cho tên gọi Bảng cân đối kế toán) và **Báo cáo kết quả hoạt động kinh doanh** [[03-ke-toan-gia-thanh-mua-ban-kho-thue-tt99-tt98]].
3. **Kiểm soát nội bộ & Kiểm toán nội bộ (Thông tư 98 & Chuẩn Quản trị ERP):**
   - Thực thi nguyên tắc bất kiêm nhiệm (`Segregation of Duties`) trên `OUSR`/`USR3`, áp dụng quy trình phê duyệt (`Approval Procedures - OWDD`) cho PO/SO vượt hạn mức và truy vết mọi thay đổi chứng từ qua họ bảng lịch sử **`ADOC` / `ADO1` / `AITM` / `ACRD`** [[03-ke-toan-gia-thanh-mua-ban-kho-thue-tt99-tt98]].

---

## Liên Kết Hệ Sinh Thái Tri Thức Enterprise
- [[cam-nang-sap-b1-93-10-sql-va-beas-manufacturing]] - Kiến trúc SAP B1 9.3/10.0 và Quản trị sản xuất Beas Manufacturing (`batchanderung.htm`).
- [[cam-nang-sql-fms-sdk-dtw-va-quan-tri-server]] - Truy vấn SQL, FMS, TransactionNotification, DTW Import và Lập trình SDK / Quản trị Server.
