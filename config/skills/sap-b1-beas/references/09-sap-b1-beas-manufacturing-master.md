---
type: wiki
title: "Cẩm Nang Toàn Diện SAP B1, Beas Manufacturing, Kế Toán Giá Thành, Sản Xuất, Kho, Mua Hàng & Server"
status: active
tags:
  - wiki
  - sap-b1-erp
  - beas-manufacturing
  - production-costing
  - inventory-purchasing
  - server-hana-sql
created: '2026-10-17'
updated: '2026-10-17'
source: "Kho tri thức chuyên gia SAP Business One 10.0 & Boyum IT Beas Manufacturing 2025.12 (Bot Tomi Nguyen)"
---

# Cẩm Nang Toàn Diện SAP B1, Beas Manufacturing, Kế Toán Giá Thành, Sản Xuất, Kho, Mua Hàng & Server

> Tài liệu chuẩn hóa 6 trụ cột nghiệp vụ và kỹ thuật cốt lõi dành cho **[[p1-07-tong-cong-trinh-su-sap-b1-beas]]** (`Bot Tomi Nguyen`) và đội ngũ kỹ sư Phòng 1 (`[[p1-01-ky-su-sap-b1-sql]]`, `[[p1-03-quan-tri-server-vps]]`). Liên kết trực tiếp với [[so-tay-sap-b1-sql-va-server-vps]] và [[so-do-5-phong-ban-va-15-du-an]].

---

## 1. Phân Hệ Mua Hàng (Purchasing - A/P) & Chi Phí Mua Hàng (Landed Costs)

### 1.1. Luồng Chứng Từ Chuẩn (Procure-to-Pay / P2P)

| Bước | Chứng từ | ObjType | Bảng Header / Line | Bút toán kế toán tự động (G/L Account Determination) |
| :---: | :--- | :---: | :--- | :--- |
| **1** | **Purchase Request (PR - Yêu cầu mua hàng)** | `1470000113` | `OPRQ` / `PRQ1` | Không sinh bút toán (`OJDT`). Dùng để duyệt nhu cầu mua nội bộ hoặc sinh tự động từ **MRP**. |
| **2** | **Purchase Quotation (PQ - Báo giá NCC)** | `540000006` | `OPQT` / `PQT1` | Không sinh bút toán. Dùng để so sánh giá, thời gian giao hàng giữa các Nhà cung cấp (`OCRD`). |
| **3** | **Purchase Order (PO - Đơn đặt hàng mua)** | `22` | `OPOR` / `POR1` | Không sinh bút toán. Làm tăng số lượng **Đang đặt hàng (`OITW.OnOrder`)** tại kho đích. |
| **4** | **Goods Receipt PO (GRPO - Nhập kho mua hàng)** | `20` | `OPDN` / `PDN1` | **Nợ TK Kho (`152`/`156` - Inventory Account)**<br>**Có TK Phải trả tạm tính (`Allocation Account / GRNI - 3318`)**<br>*(Làm tăng tồn kho thực tế `OITW.OnHand` và giảm `OnOrder`)*. |
| **5** | **Landed Costs (Chi phí mua hàng / Nhập khẩu)** | `69` | `OIPF` / `IPF1` / `IPF2` | **Nợ TK Kho (`152`/`156` - Cộng thêm giá vốn lô hàng)**<br>**Có TK Phải trả chi phí mua hàng (`Landed Cost Clearing Account`)**<br>*(Phân bổ cước tàu, bảo hiểm, thuế NK, phí hải quan theo Giá trị tiền / Trọng lượng / Thể tích / Số lượng)*. |
| **6** | **A/P Invoice (Hóa đơn mua hàng)** | `18` | `OPCH` / `PCH1` | **Nợ TK Phải trả tạm tính (`Allocation Account / GRNI - 3318`)**<br>**Nợ TK Thuế GTGT đầu vào (`1331`)**<br>**Có TK Phải trả Nhà cung cấp (`331` - Control Account trong `OCRD`)**. |
| **7** | **Outgoing Payment (Phiếu chi / Ủy nhiệm chi)** | `46` | `OVPM` / `VPM2` | **Nợ TK Phải trả Nhà cung cấp (`331`)**<br>**Có TK Tiền mặt / Ngân hàng (`111` / `112`)**. |

### 1.2. Xử Lý Tình Huống Thường Gặp Trong Mua Hàng
- **Hóa đơn về khác giá với lúc nhập kho GRPO:**
  - Nếu hàng **còn tồn kho** đầy đủ: SAP B1 tự động điều chỉnh phần chênh lệch thẳng vào **TK Kho (`152`/`156`)** để cập nhật lại giá vốn Moving Average.
  - Nếu hàng **đã xuất bán hoặc xuất sản xuất một phần/toàn bộ**: Phần chênh lệch tương ứng với số lượng đã xuất sẽ được hạch toán vào **TK Chênh lệch giá mua (`Price Difference Account` / `632`)**.
- **Cuối kỳ tài chính vẫn còn số dư trên TK Phải trả tạm tính (`Allocation Account / GRNI`):**
  - Nguyên nhân: Đã nhập kho `GRPO (OPDN)` nhưng chưa nhận được Hóa đơn đỏ để lập `A/P Invoice (OPCH)`, hoặc đã trả hàng `Goods Return (ORPD)` không link từ `GRPO`.
  - Cách kiểm tra: Chạy truy vấn các phiếu `OPDN` có `DocStatus = 'O'` (Open) để đối chiếu với số dư TK `Allocation Account`.

---

## 2. Quản Lý Kho (Inventory Management), Batch/Serial & Hoạch Định MRP

### 2.1. Công Thức Tồn Kho Chuẩn Trong SAP B1 (`OITM` & `OITW`)
Trên mỗi kho (`OWHS`), tồn kho khả dụng (`Available`) được tính theo công thức bất biến:
$$\text{Available} = \text{In Stock (OnHand)} - \text{Committed (IsCommited)} + \text{Ordered (OnOrder)}$$
- **`OnHand` (Tồn thực tế trong kho):** Tăng khi `GRPO (OPDN)`, `Goods Receipt (OIGN)`, `Receipt from Production (OIGN)`, `A/R Return (ORDN)`. Giảm khi `Delivery (ODLN)`, `Goods Issue (OIGE)`, `Issue for Production (OIGE)`, `Goods Return (ORPD)`.
- **`IsCommited` (Đã giữ chỗ cho bán hàng/sản xuất):** Tăng khi lập `Sales Order (ORDR)` hoặc phát hành `Production Order (OWOR)` / `Inventory Transfer Request (OWTQ)`.
- **`OnOrder` (Đang trên đường về / Đang sản xuất):** Tăng khi lập `Purchase Order (OPOR)` hoặc tạo `Production Order (OWOR)` cho thành phẩm.

### 2.2. Quản Lý Lô (`Batch - OBTN`) & Số Serial (`OSRN`) & Vị Trí Kho (`Bin Location - OBIN`)
- **Batch Management (`OITM.ManBtchNum = 'Y'`):**
  - Bảng danh mục lô: `OBTN` (`ItemCode`, `DistNumber` = Số lô, `SysNumber`, `InDate`, `ExpDate` = Hạn sử dụng, `MnfDate` = Ngày SX).
  - Bảng nhật ký giao dịch lô: `OITL` (Header) nối với `ITL1` (Chi tiết `SysNumber`, `Quantity`).
  - Lỗi kinh điển **"Cannot allocate batch / Quantity falls into negative inventory"**: Do ngày chứng từ xuất kho (`DocDate`) nhỏ hơn ngày nhập lô (`OBTN.InDate`), hoặc lô đang ở trạng thái `Locked / Not Accessible` (`OBTN.Status <> '0'`), hoặc lệch số lượng tồn theo vị trí Bin (`OIBQ` / `OBBQ`).
- **Bin Locations (`OWHS.BinActivat = 'Y'`):**
  - Cấu trúc phân vùng kho: `Sublevel 1 (Khu vực/Zone)` -> `Sublevel 2 (Dãy/Aisle)` -> `Sublevel 3 (Kệ/Rack)` -> `Sublevel 4 (Tầng/Level)`.
  - Bảng chính: `OBIN` (Danh mục vị trí), `OIBQ` (Tồn kho theo từng Bin), `OBBQ` (Tồn kho theo Batch + Bin), `OSBQ` (Tồn kho theo Serial + Bin).

### 2.3. Hoạch Định Nguyên Vật Liệu (MRP - Material Requirements Planning)
- **Bảng dữ liệu MRP:** `OMPS` (Kịch bản MRP - MRP Scenario), `ORCM` (Khuyến nghị đặt hàng mua PO / Lệnh sản xuất Production Order / Yêu cầu chuyển kho PR).
- **Các tham số quyết định kết quả chạy MRP trên `OITM`:**
  1. `PlanningSystem`: `'M'` (MRP) hoặc `'N'` (None).
  2. `PrcrmntMtd` (Procurement Method): `'B'` (**Buy** -> Đề xuất sinh `Purchase Request / Purchase Order`) hoặc `'M'` (**Make** -> Đề xuất sinh `Production Order` và tự động bung định mức BOM đa cấp xuống nguyên vật liệu con).
  3. `OrderMulti` (Bội số đặt hàng), `MinOrdrQty` (Số lượng đặt tối thiểu), `LeadTime` (Thời gian chờ mua/sản xuất tính bằng ngày), `ToleranceDays`.

---

## 3. Quản Lý Sản Xuất Chuẩn SAP B1 (Standard BOM & Production Order)

### 3.1. Định Mức Nguyên Vật Liệu (Bill of Materials - `OITT` & `ITT1`)
- **4 Loại BOM (`OITT.TreeType`) trong SAP B1:**
  1. **Production BOM (`'P'`):** Dùng cho sản xuất thực tế. Bắt buộc qua `Production Order (OWOR)` để xuất nguyên liệu (`OIGE`) và nhập thành phẩm (`OIGN`).
  2. **Assembly BOM (`'A'`):** Bộ kit lắp ráp khi bán. Xuất hiện trên `Sales Order` / `A/R Invoice`, không xuất hiện trên `Delivery` dưới dạng linh kiện rời mà trừ kho linh kiện khi giao hàng.
  3. **Sales BOM (`'S'`):** Giống Assembly BOM nhưng cả mặt hàng cha lẫn linh kiện con đều hiện rõ trên `Sales Order` và `Delivery`.
  4. **Template BOM (`'T'`):** Mẫu nhập liệu nhanh trên chứng từ mua/bán, cho phép xóa/sửa số lượng linh kiện tùy ý.
- **4 Loại dòng thành phần trong `ITT1.Type`:**
  - `4` = **Item** (Nguyên vật liệu, bán thành phẩm, hoặc **Phụ phẩm / By-Product** khi nhập số lượng âm `-Quantity`).
  - `290` = **Resource** (Giờ máy chạy, giờ nhân công trực tiếp, chi phí sản xuất chung theo định mức).
  - `-18` = **Text** (Dòng ghi chú hướng dẫn kỹ thuật).
  - **Route Stage** (Công đoạn sản xuất tuần tự: Cắt -> Hàn -> Sơn -> Đóng gói).

### 3.2. Vòng Đời Lệnh Sản Xuất Chuẩn (`OWOR` & `WOR1` - ObjType `202`)
1. **Khởi tạo (`Status = 'P' - Planned`):** Lệnh mới lập hoặc sinh từ MRP. Lúc này **chưa được phép** xuất vật tư hay nhập thành phẩm.
2. **Phát hành (`Status = 'R' - Released`):** Duyệt lệnh đưa xuống xưởng. Cho phép thực hiện:
   - **Xuất vật tư & Nguồn lực (`Issue for Production - OIGE/IGE1`):**
     - Phương pháp **`Manual ('M')`**: Thủ kho chủ động tạo phiếu `Issue for Production` (bắt buộc với các mặt hàng quản lý theo `Serial` hoặc khi cần chọn `Batch` thực tế trước khi sản xuất).
     - Phương pháp **`Backflush ('B')`**: Tự động trừ kho nguyên vật liệu và ghi nhận giờ máy/nhân công theo định mức ngay khi bấm `Receipt from Production`.
   - **Nhập kho thành phẩm & Phụ phẩm (`Receipt from Production - OIGN/IGN1`):**
     - Nhập số lượng hoàn thành (`Complete`) hoặc phế phẩm (`Reject`) vào kho thành phẩm.
3. **Đóng lệnh & Quyết toán (`Status = 'L' - Closed`):**
   - Khi sản xuất xong, kế toán giá thành kiểm tra đủ phiếu xuất NVL + giờ công + phiếu nhập TP rồi chuyển trạng thái lệnh sang **`Closed`**.
   - Ngay thời điểm chuyển sang `Closed`, SAP B1 tự động tính toán và hạch toán bút toán **Chênh lệch giá thành sản xuất (`Production Variance`)** để tất toán tài khoản `WIP (154)` của lệnh đó về `0`.

---

## 4. Quản Trị Sản Xuất Nâng Cao Với Boyum IT Beas Manufacturing (2025.12)

### 4.1. Sơ Đồ Kiến Trúc Bảng Beas Manufacturing & Điểm Vượt Trội So Với SAP B1 Chuẩn

| Nghiệp vụ | Bảng Beas Manufacturing | Liên kết & Khóa chính | Khác biệt cốt lõi so với SAP B1 chuẩn |
| :--- | :--- | :--- | :--- |
| **Định mức BOM đa cấp & Phiên bản** | `BEAS_STL_HEADER` & `BEAS_STL` | `ItemCode`, `Version`, `POS_ID`, `ART1_ID` | Hỗ trợ quản lý nhiều **Revision/Version** cho cùng 1 mã thành phẩm, linh kiện thay thế (`Alternative Items`), bán thành phẩm ảo (`Phantom Assembly`). |
| **Quy trình công nghệ (Routing)** | `BEAS_APL_HEADER` & `BEAS_APL` | `ItemCode`, `AG_ID`, `POS_ID`, `APLATZ_ID` | Tách biệt rõ **Thời gian chuẩn bị máy (`RUESTZEIT` / Setup Time)** và **Thời gian gia công (`BEARBEITUNGSZEIT` / Run Time)**, hỗ trợ công đoạn song song (`Overlap`). |
| **Trung tâm gia công (Resources)** | `BEAS_APLATZ` | `APLATZ_ID` | Quản lý năng lực máy/nhân công, ca làm việc, lịch bảo trì và **Đơn giá chi phí giờ công (`Cost Rate`: Direct Labor + Overhead + Marginal Cost)**. |
| **Lệnh sản xuất Beas (Work Order)** | `BEAS_FTHAUPT` (Header)<br>`BEAS_FTPOS` (Assembly Pos) | `BELNR_ID` (Số lệnh)<br>`BELPOS_ID` (Vị trí BTP/TP) | **1 Lệnh sản xuất (`BELNR_ID`) chứa trọn cây sản xuất đa cấp** (từ Bán thành phẩm cấp 3 -> cấp 2 -> Thành phẩm cấp 1 ở các dòng `BELPOS_ID` khác nhau), không bị rời rạc như `OWOR`. |
| **Định mức & Công đoạn trong Lệnh** | `BEAS_FTSTL` (Vật tư lệnh)<br>`BEAS_FTAPL` (Công đoạn lệnh) | `BELNR_ID` + `BELPOS_ID` + `POS_ID` | Cho phép điều chỉnh vật tư/công đoạn ngay trên từng vị trí lệnh đang chạy, khóa/giữ chỗ vật tư (`Reservation`) chi tiết. |
| **Ghi nhận thời gian (Time Receipt)** | `BEAS_ARBZEIT` | `BELNR_ID`, `BELPOS_ID`, `POS_ID`, `PERS_ID`, `APLATZ_ID` | Công nhân quét mã vạch trên **BDE Terminal / Beas WebApps** để bấm `Start / Stop / Interrupt`, ghi nhận giờ công thực tế, số lượng đạt (`MENGE_GUT`) và phế phẩm (`MENGE_SCHLECHT`). |
| **Kiểm soát chất lượng (QC)** | `BEAS_QSFTHAUPT` & `BEAS_QSFTPOS` | `KND_ID`, `BELNR_ID`, `BELPOS_ID` | Chặn nhập kho hoặc chặn chuyển công đoạn nếu lệnh kiểm tra QC (`In-Process QC` / `Final QC`) chưa đạt (`Release`). |

### 4.2. Các Truy Vấn SQL Thực Chiến Kiểm Soát Sản Xuất Beas Manufacturing

#### A. Truy vấn tiến độ Lệnh sản xuất, Vật tư đã xuất vs Định mức & Giờ công thực tế
```sql
SELECT
    H.BELNR_ID                                  AS [So_Lenh_SX],
    P.BELPOS_ID                                 AS [Vi_Tri_Pos],
    P.ItemCode                                  AS [Ma_Thanh_Pham],
    P.ItemName                                  AS [Ten_Thanh_Pham],
    P.MENGE                                     AS [SL_Ke_Hoach],
    P.GEL_MENGE                                 AS [SL_Da_Nhap_Kho],
    P.LIEFERDATUM                               AS [Ngay_Giao_Du_Kien],
    CASE WHEN P.ABGKZ = 'J' THEN N'Đã đóng' ELSE N'Đang mở' END AS [Trang_Thai_Pos],
    ISNULL(M.Tong_SL_Dinh_Muc, 0)               AS [Tong_NVL_Dinh_Muc],
    ISNULL(M.Tong_SL_Da_Xuat, 0)                AS [Tong_NVL_Da_Xuat],
    ISNULL(T.Tong_Phut_Thuc_Te, 0)              AS [Tong_Phut_Gia_Cong]
FROM BEAS_FTHAUPT H WITH (NOLOCK)
INNER JOIN BEAS_FTPOS P WITH (NOLOCK)
    ON H.BELNR_ID = P.BELNR_ID
LEFT JOIN (
    SELECT
        BELNR_ID,
        BELPOS_ID,
        SUM(MENGE_VERBRAUCH) AS Tong_SL_Dinh_Muc,
        SUM(GEL_MENGE)       AS Tong_SL_Da_Xuat
    FROM BEAS_FTSTL WITH (NOLOCK)
    GROUP BY BELNR_ID, BELPOS_ID
) M ON P.BELNR_ID = M.BELNR_ID AND P.BELPOS_ID = M.BELPOS_ID
LEFT JOIN (
    SELECT
        BELNR_ID,
        BELPOS_ID,
        SUM(ZEIT) AS Tong_Phut_Thuc_Te
    FROM BEAS_ARBZEIT WITH (NOLOCK)
    GROUP BY BELNR_ID, BELPOS_ID
) T ON P.BELNR_ID = T.BELNR_ID AND P.BELPOS_ID = T.BELPOS_ID
WHERE H.ABGKZ <> 'J'
ORDER BY H.BELNR_ID DESC, P.BELPOS_ID ASC;
```

#### B. Checklist 5 Nguyên Nhân Không Đóng Được Lệnh Sản Xuất Trong Beas (`ABGKZ = 'N'`)
Khi người dùng báo lỗi không đóng được Work Order (`BELNR_ID`) trong Beas:
1. **Còn phiếu chấm công đang chạy (`Active Time Receipt / Login`):** Có công nhân bấm `Start` trên WebApps/Terminal nhưng quên bấm `Stop` (kiểm tra bảng `BEAS_ARBZEIT` hoặc `BEAS_FTSTAMP`).
2. **Còn lệnh QC chưa duyệt (`Open QC Order`):** Kiểm tra `BEAS_QSFTHAUPT` xem có phiếu QC nào gắn với `BELNR_ID` và `BELPOS_ID` chưa được QC Manager bấm `Release/Transfer` hay không.
3. **Vị trí bán thành phẩm cấp dưới (`Sub-Assembly BELPOS_ID`) chưa đóng:** Trong Beas, phải đóng các `BELPOS_ID` cấp con trước hoặc dùng chức năng đóng toàn bộ Work Order từ Header.
4. **Còn phiếu Purchase Order gia công ngoài (`External Operation / Subcontracting PO`) chưa nhận hàng (`GRPO`).**
5. **Lỗi hạch toán WIP sang SAP B1 (`Batch/Serial` hoặc Kỳ kế toán `Posting Period` đã khóa):** Kiểm tra `Beas Common Service` log hoặc mở `Posting Period` trong SAP B1.

---

## 5. Kế Toán, Chi Phí & Tính Giá Thành Sản Xuất (FI/CO & Production Costing)

### 5.1. Sơ Đồ Hạch Toán Giá Thành Sản Xuất Chuẩn (VAS Việt Nam & Quốc Tế Trên SAP B1 / Beas)

| Bước nghiệp vụ | Chứng từ SAP B1 / Beas | Định khoản Kế toán (Chuẩn VAS Việt Nam) | Tên tài khoản thiết lập trên SAP B1 (`G/L Account Determination`) |
| :--- | :--- | :--- | :--- |
| **1. Xuất nguyên vật liệu trực tiếp vào SX** | `Issue for Production (OIGE)` | **Nợ TK `1541`** (CP SXKD dở dang - NVL)<br>**Có TK `152` / `153`** (Nguyên vật liệu / CCDC) | - Nợ: **WIP Inventory Account** (trên BOM/Item Group)<br>- Có: **Inventory Account** (trên Kho/Item Group) |
| **2. Ghi nhận Chi phí Nhân công (622) & SXC (627)** | `Issue for Production` (Resource) hoặc `Beas Time Receipt (BEAS_ARBZEIT)` | **Nợ TK `1542` / `1543`** (CP SXKD dở dang - Nhân công & SXC)<br>**Có TK `622` / `627`** (Tài khoản đối ứng phân bổ chi phí) | - Nợ: **WIP Inventory Account** (của Resource)<br>- Có: **WIP Offset P&L Account** (trên Resource Master Data `ORSC` / Beas Cost Element) |
| **3. Nhập kho Thành phẩm hoàn thành** | `Receipt from Production (OIGN)` | **Nợ TK `155`** (Thành phẩm)<br>**Có TK `154`** (CP SXKD dở dang) | - Nợ: **Inventory Account** (của Thành phẩm)<br>- Có: **WIP Inventory Account** |
| **4. Nhập kho Phụ phẩm / Phế liệu thu hồi** | `Receipt from Production (OIGN)` *(Dòng By-Product số lượng âm trong BOM)* | **Nợ TK `152` / `155`** (Kho phế liệu/phụ phẩm)<br>**Có TK `154`** (Giảm chi phí dở dang của Lệnh SX) | - Nợ: **Inventory Account** (của Phụ phẩm)<br>- Có: **WIP Inventory Account** |
| **5. Đóng Lệnh SX & Kết chuyển Chênh lệch giá thành** | Chuyển `OWOR.Status = 'L' (Closed)` hoặc chạy `Beas Work Order Closing` | **Nợ (hoặc Có) TK `154`** (Tất toán WIP về 0)<br>**Có (hoặc Nợ) TK `155` / `632`** (Chênh lệch giá thành / Giá vốn) | - **WIP Inventory Account** $\leftrightarrow$ **WIP Variance Account** (hoặc cập nhật trực tiếp vào **Inventory Account `155`** nếu dùng Moving Average / Actual Costing). |

### 5.2. Cách Xử Lý Lệch Sổ Kho (`Inventory Audit Report`) Và Sổ Cái (`G/L - Trial Balance`)
1. **Nguyên tắc số 1:** Tuyệt đối **KHÔNG** định khoản bút toán tay (`Manual Journal Entry - OJDT`) trực tiếp vào các tài khoản Kho (`152`, `155`, `156`) đang gắn trong `G/L Account Determination`! Vì bút toán tay làm thay đổi số dư Sổ cái (`JDT1`) nhưng **không sinh bản ghi trong Sổ kho (`OINM`/`OIVL`)**, gây lệch vĩnh viễn giữa Báo cáo Kế toán và Báo cáo Tồn kho.
2. **Cách khóa chặn bút toán tay vào TK Kho:** Vào `Financials -> Chart of Accounts (OACT)` -> Chọn các tài khoản `152, 155, 156` -> Tích chọn ô **`Block Manual Posting`**!
3. **Khi muốn điều chỉnh giá trị tồn kho (không đổi số lượng):** Bắt buộc dùng chức năng **`Inventory -> Inventory Transactions -> Inventory Revaluation (OMRV - ObjType 162)`** để hệ thống vừa cập nhật giá vốn trong `OINM/OITW` vừa sinh bút toán `OJDT` đồng bộ 100%.

---

## 6. Quản Trị Server & Hạ Tầng Kỹ Thuật (SAP HANA, MS SQL Server, Service Layer & Beas Server)

### 6.1. Quản Trị SAP HANA Trên Linux (SUSE SLES / RHEL)
- **Kiểm tra trạng thái dịch vụ HANA (đăng nhập bằng user `<sid>adm`, ví dụ `ndbadm`):**
  ```bash
  su - ndbadm
  HDB info
  sapcontrol -nr 00 -function GetProcessList
  ```
- **Khởi động lại SAP B1 Server Tools & Service Layer trên Linux:**
  ```bash
  systemctl status sapb1servertools.service
  systemctl restart sapb1servertools.service
  systemctl restart b1s.service
  ```
- **Kiểm tra dung lượng RAM & Disk của HANA (tránh lỗi `Allocation failed / Disk Full` tại `/hana/log` và `/hana/data`):**
  ```bash
  df -h /hana/data /hana/log /hana/shared
  free -g
  ```
  - *Lưu ý sống còn:* Nếu phân vùng `/hana/log` đầy 100%, toàn bộ Database SAP HANA sẽ treo cứng. Phải thiết lập tự động Backup Log định kỳ (hoặc `log_mode = overwrite` trên môi trường TEST) và tuyệt đối không xóa file vật lý trong `/hana/log` bằng lệnh `rm` của Linux (phải dùng lệnh `ALTER SYSTEM RECLAIM LOG` trên HANA Studio).

### 6.2. Quản Trị MS SQL Server & Beas Common Service Trên Windows Server
- **Kiểm tra các tiến trình đang gây khóa bảng (`Blocking / Deadlock`) trên SQL Server:**
  ```sql
  SELECT
      r.session_id            AS [SPID_Bi_Khoa],
      r.blocking_session_id   AS [SPID_Dang_Chiem_Khoa],
      r.wait_type,
      r.wait_time / 1000.0    AS [So_Giay_Cho],
      DB_NAME(r.database_id)  AS [Database_Name],
      SUBSTRING(t.text, (r.statement_start_offset/2)+1,
          ((CASE r.statement_end_offset
              WHEN -1 THEN DATALENGTH(t.text)
              ELSE r.statement_end_offset
          END - r.statement_start_offset)/2) + 1) AS [Cau_Lenh_SQL_Dang_Chay]
  FROM sys.dm_exec_requests r
  CROSS APPLY sys.dm_exec_sql_text(r.sql_handle) t
  WHERE r.blocking_session_id <> 0;
  ```
- **Các dịch vụ Windows bắt buộc phải `Running` cho hệ thống SAP B1 + Beas Manufacturing:**
  1. `SQL Server (MSSQLSERVER)` & `SQL Server Agent`
  2. `SAP Business One SLD Service` & `SAP Business One License Manager`
  3. `SAP Business One DI Server` / `Service Layer`
  4. `Beas Common Service` (Dịch vụ nền xử lý MRP, APS, Time Receipt và đồng bộ hạch toán Beas $\leftrightarrow$ SAP B1).
