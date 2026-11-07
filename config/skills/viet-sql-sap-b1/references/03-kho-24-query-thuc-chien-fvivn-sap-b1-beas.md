---
title: "Kho 24 Câu Lệnh SQL Thực Chiến FVIVN (SAP B1 9.3 & Beas Manufacturing)"
source: "E:\\DIEN APP\\SQL SAP B1\\queries\\SYNC_FVIVN_PROD_SSMS"
databases:
  - "FVIVN_GoLive_2024 (FVIVN_HCM - Công ty ở TP.HCM)"
  - "FVIVN_PROD (FVIVN_LT - Công ty ở Long Thành)"
updated: "2026-10-18"
---

# Kho 24 Câu Lệnh SQL Thực Chiến FVIVN (SAP B1 9.3 & Beas Manufacturing)

Tài liệu này tổng hợp toàn bộ **24 câu lệnh SQL thực chiến** trích xuất từ hệ thống SSMS của khách hàng **FVI Việt Nam (`SYNC_FVIVN_PROD_SSMS`)**, áp dụng cho cả 2 Database trên máy chủ `192.168.42.160`:
- **`FVIVN_HCM` (`FVIVN_GoLive_2024`)**: Công ty FVI Việt Nam tại TP.HCM.
- **`FVIVN_LT` (`FVIVN_PROD`)**: Chi nhánh FVI Việt Nam tại Long Thành.

---

## 1. Từ Điển Trường Tùy Chỉnh (UDF), Bảng Mở Rộng (UDT) & Hệ Thống Tài Khoản (COA) Đặc Thù Của FVIVN

### 1.1. Các Trường UDF & Bảng UDT Đặc Thù Trên Hệ Thống FVIVN
| Bảng / Cột | Ý Nghĩa Thực Tế Tại FVIVN | Cách Nối Bảng (Join Rule) |
|---|---|---|
| `IGN1.U_belnrid`, `IGN1.U_belposid` | Số Lệnh sản xuất Beas (`BELNR_ID`) và Vị trí (`BELPOS_ID`) trên dòng Nhập kho thành phẩm (`OIGN/IGN1`) | `IGN1.U_belnrid = BEAS_FTHAUPT.BELNR_ID AND IGN1.U_belposid = BEAS_FTPOS.BELPOS_ID` |
| `IGE1.U_belnrid`, `IGE1.U_belposid`, `IGE1.U_posid` | Số Lệnh sản xuất Beas, Vị trí và Dòng BOM (`POS_ID`) trên dòng Xuất kho NVL (`OIGE/IGE1`) | `IGE1.U_belnrid = BEAS_FTSTL.BELNR_ID AND IGE1.U_belposid = BEAS_FTSTL.BELPOS_ID` |
| `OJDT.U_belnrid`, `OJDT.U_belposid` | Liên kết bút toán Sổ cái (`OJDT/JDT1`) trực tiếp về Lệnh sản xuất Beas | `OJDT.U_belnrid = BEAS_FTPOS.BELNR_ID AND OJDT.U_belposid = BEAS_FTPOS.BELPOS_ID` |
| `BEAS_JOURNAL_HISTORIE` | Bảng lịch sử hạch toán chi phí của Beas (`U_belnrid`, `U_belposid`, `DocDate`, `Account`, `Credit`, `Debit`, `TransType`, `CreatedBy`, `Comments`) | Dùng để kiểm tra WIP đầu kỳ/cuối kỳ và chi phí sản xuất theo Work Order |
| `[@IOT_PARAMETERS]` | Bảng thông số IoT dây chuyền sản xuất bông thủy tinh | `[@IOT_PARAMETERS].Code = CAST(U_belnrid AS NVARCHAR(10)) + CAST(U_belposid AS NVARCHAR(10))` (`U_I_LineType`: Line Type, `U_I_Ac1Balls`: Actual 1 Balls, `U_I_Ac2Balls`: Actual 2 Balls) |
| `OIGN.U_SAC_Output` | Tên dây chuyền sản xuất (`[LINE]`) trên phiếu Receipt from Production | Lấy trực tiếp từ `OIGN.U_SAC_Output` |
| `OIGN.U_energyElectricity` | Điện năng tiêu thụ thực tế trên phiếu Receipt from Production | Lấy trực tiếp từ `OIGN.U_energyElectricity` |
| `OPDN.U_LCDone` | Trạng thái đã làm Landed Cost hay chưa trên phiếu GRPO (`OPDN`) | Kiểm tra PO nhập khẩu đã phân bổ chi phí mua hàng chưa |
| `WTR1.U_beas_basetype` | Nguồn phát sinh phiếu Chuyển kho (`OWTR/WTR1`) từ Beas | Khi `WTR1.U_beas_basetype = 'QC'` là phiếu chuyển kho từ phân hệ QC của Beas |
| `OITM.U_ZNR` | Số bản vẽ / mã quy cách kỹ thuật (`Drawing Number`) của Item | Hiển thị kèm `ItemCode`, `ItemName` trong các báo cáo BOM và Tồn kho |
| `OUSR.U_Dump` | Cờ phân quyền hiển thị dữ liệu nhạy cảm theo User | Dùng trong các báo cáo Sales Order / AR Invoice |

### 1.2. Hệ Thống Tài Khoản Kế Toán & Kho Đặc Thù Tại FVIVN
- **Tài khoản Chi phí & Giá thành sản xuất**:
  - `154100`: Chi phí sản xuất kinh doanh dở dang - Sản xuất chính (WIP).
  - `154200`: Chi phí sản xuất dở dang khác / bán thành phẩm.
  - `155100`: Thành phẩm nhập kho (`Finished Goods`).
  - `152000`, `152100`: Nguyên vật liệu chính & phụ (`Raw Materials`).
  - `621%`: Chi phí nguyên vật liệu trực tiếp.
  - `622%`: Chi phí nhân công trực tiếp (`Direct Labor`).
  - `627%`: Chi phí sản xuất chung (`Manufacturing Overhead` - Điện, Nước, Khấu hao, Dịch vụ mua ngoài...).
- **Tài khoản Thuế GTGT**:
  - `133101`: Thuế GTGT đầu vào được khấu trừ (hàng hóa, dịch vụ).
  - `333110`: Thuế GTGT đầu ra phải nộp.
- **Nhóm Hàng Hóa (`OITB.ItmsGrpCod`) & Kho (`OWHS.WhsCode`)**:
  - `ItmsGrpCod = 109`: Thành phẩm (`Finished Goods`).
  - `ItmsGrpCod IN (100, 107)`: Nguyên vật liệu / Hóa chất / Bao bì chính dùng cho sản xuất.
  - Các kho chuẩn tại FVIVN: `01.RM` (Kho Nguyên vật liệu), `01.FG` (Kho Thành phẩm), `01.WIP` (Kho Sản xuất dở dang), `01.QC` (Kho Chờ kiểm định QC), `01.SP` (Kho Phụ tùng Spare Parts).

---

## 2. Danh Mục 24 Câu Lệnh SQL Thực Chiến (`SYNC_FVIVN_PROD_SSMS`)

> **Lưu ý khi gọi bằng công cụ `sap_customer_query`**:
> Vì `sap_customer_query` thực thi ở chế độ **Read-Only 100%** (chặn các lệnh `CREATE TABLE #...`, `DROP TABLE`, `INSERT INTO`), toàn bộ các câu truy vấn phức tạp dưới đây đã được chuẩn hóa sang dạng **`WITH ... AS (CTE)`** hoặc `SELECT` trực tiếp kèm `WITH (NOLOCK)` để AI có thể chạy lấy dữ liệu thật ngay lập tức.

---

### PHẦN A - PHÂN HỆ SẢN XUẤT & GIÁ THÀNH BEAS (`Production`)

#### 1. `Check_Wip_account_by_Production_Order.sql` - Kiểm Tra Tài Khoản WIP (154100) Theo Lệnh Sản Xuất
- **Mục đích**: Đối chiếu số dư đầu kỳ, phát sinh Nợ/Có của các tài khoản `155100`, `154200`, `152000`, `152100`, `622%`, `627%` đối ứng với TK `154100` và kiểm tra chênh lệch WIP cuối kỳ theo từng `WorkOrder` (`U_belnrid`) và `Position` (`U_belposid`) trong bảng `BEAS_JOURNAL_HISTORIE`.
- **Câu lệnh SQL Read-Only (CTE) dùng cho `sap_customer_query`**:
```sql
DECLARE @FromDate DATE = '2026-01-01';
DECLARE @ToDate DATE = '2026-12-31';

WITH TB AS (
    SELECT
        T0.U_belnrid,
        T0.U_belposid,
        SUM(CASE WHEN T0.DocDate < @FromDate AND T0.Account = '154100' THEN (T0.Debit - T0.Credit) ELSE 0 END) AS OpeningBalance,
        SUM(CASE WHEN T0.DocDate BETWEEN @FromDate AND @ToDate AND T0.Account = '155100' THEN (T0.Credit - T0.Debit) ELSE 0 END) AS Acc_155100,
        SUM(CASE WHEN T0.DocDate BETWEEN @FromDate AND @ToDate AND T0.Account = '154200' THEN (T0.Credit - T0.Debit) ELSE 0 END) AS Acc_154200,
        SUM(CASE WHEN T0.DocDate BETWEEN @FromDate AND @ToDate AND T0.Account = '152000' THEN (T0.Credit - T0.Debit) ELSE 0 END) AS Acc_152000,
        SUM(CASE WHEN T0.DocDate BETWEEN @FromDate AND @ToDate AND T0.Account = '152100' THEN (T0.Credit - T0.Debit) ELSE 0 END) AS Acc_152100,
        SUM(CASE WHEN T0.DocDate BETWEEN @FromDate AND @ToDate AND T0.Account LIKE '622%' THEN (T0.Credit - T0.Debit) ELSE 0 END) AS Acc_622,
        SUM(CASE WHEN T0.DocDate BETWEEN @FromDate AND @ToDate AND T0.Account LIKE '627%' THEN (T0.Credit - T0.Debit) ELSE 0 END) AS Acc_627,
        SUM(CASE WHEN T0.DocDate <= @ToDate AND T0.Account = '154100' THEN (T0.Debit - T0.Credit) ELSE 0 END) AS EndingBalance
    FROM BEAS_JOURNAL_HISTORIE T0 WITH (NOLOCK)
    WHERE ISNULL(T0.U_belnrid, '') <> ''
    GROUP BY T0.U_belnrid, T0.U_belposid
)
SELECT TOP 100
    TB.U_belnrid AS [WorkOrder],
    TB.U_belposid AS [Position],
    P.ItemCode,
    I.ItemName,
    P.MENGE_VERBRAUCH AS [PlannedQty],
    TB.OpeningBalance,
    TB.Acc_155100,
    TB.Acc_154200,
    TB.Acc_152000,
    TB.Acc_152100,
    TB.Acc_622,
    TB.Acc_627,
    TB.EndingBalance,
    (TB.OpeningBalance + TB.Acc_155100 + TB.Acc_154200 + TB.Acc_152000 + TB.Acc_152100 + TB.Acc_622 + TB.Acc_627 - TB.EndingBalance) AS [Variance_Check]
FROM TB
LEFT JOIN BEAS_FTPOS P WITH (NOLOCK) ON P.BELNR_ID = TB.U_belnrid AND P.BELPOS_ID = TB.U_belposid
LEFT JOIN OITM I WITH (NOLOCK) ON P.ItemCode = I.ItemCode
WHERE TB.OpeningBalance <> 0 OR TB.EndingBalance <> 0 OR TB.Acc_155100 <> 0 OR TB.Acc_152000 <> 0
ORDER BY TB.U_belnrid DESC, TB.U_belposid;
```

#### 2. `Cost_Allocation_Checking.sql` - Kiểm Tra Phân Bổ Chi Phí 622 / 627 Vào Lệnh Sản Xuất
- **Mục đích**: Liệt kê chi tiết các bút toán trong `BEAS_JOURNAL_HISTORIE` (hoặc `OJDT/JDT1`) theo khoảng ngày và đầu tài khoản để kiểm tra phân bổ chi phí sản xuất.
```sql
SELECT TOP 200
    T0.U_belnrid AS [WorkOrder],
    T0.U_belposid AS [Position],
    T0.DocDate,
    T0.TransType,
    T0.CreatedBy AS [DocEntry_TransId],
    T0.Account,
    T0.Debit,
    T0.Credit,
    T0.Comments
FROM BEAS_JOURNAL_HISTORIE T0 WITH (NOLOCK)
WHERE T0.DocDate >= DATEADD(DAY, -30, GETDATE())
ORDER BY T0.DocDate DESC, T0.U_belnrid DESC;
```

#### 3. `Output_checking.sql` - Báo Cáo Sản Lượng Đầu Ra (`Output`) Kết Hợp Thông Số IoT (`@IOT_PARAMETERS`) & Điện Năng
- **Mục đích**: Theo dõi sản lượng nhập kho thành phẩm (`OIGN/IGN1`) của từng Lệnh sản xuất Beas, đối chiếu với kế hoạch (`BEAS_FTPOS`), thông số bi thủy tinh (`[@IOT_PARAMETERS].U_I_Ac1Balls`, `U_I_Ac2Balls`), dây chuyền (`OIGN.U_SAC_Output`) và điện năng tiêu thụ (`OIGN.U_energyElectricity`).
```sql
SELECT TOP 100
    T0.DocDate AS [PostingDate],
    T0.U_SAC_Output AS [LINE],
    T1.U_belnrid AS [WO_No],
    T1.U_belposid AS [Position_No],
    T4.U_I_LineType AS [Line_Type],
    T3.ABGKZ AS [Closed],
    T1.ItemCode,
    T1.Dscription AS [ItemName],
    T2.SalUnitMsr AS [UoM],
    T2.ItmsGrpCod AS [ItemGroup],
    T1.WhsCode,
    T3.MENGE_VERBRAUCH AS [Planning_Qty],
    T3.LIEFERDATUM AS [WO_DeliveryDate],
    SUM(T1.Quantity) AS [Actual_Quantity],
    SUM(T1.Quantity) * ISNULL(T2.SWeight1, 0) AS [Weight_In_KG],
    SUM(T1.LineTotal) AS [Total_Output_Value],
    T4.U_I_Ac1Balls AS [Actual_1_Balls],
    T4.U_I_Ac2Balls AS [Actual_2_Balls],
    T0.U_energyElectricity AS [Electricity]
FROM OIGN T0 WITH (NOLOCK)
INNER JOIN IGN1 T1 WITH (NOLOCK) ON T0.DocEntry = T1.DocEntry
LEFT JOIN OITM T2 WITH (NOLOCK) ON T1.ItemCode = T2.ItemCode
LEFT JOIN BEAS_FTPOS T3 WITH (NOLOCK) ON T3.BELNR_ID = T1.U_belnrid AND T3.BELPOS_ID = T1.U_belposid
LEFT JOIN [@IOT_PARAMETERS] T4 WITH (NOLOCK)
    ON T4.Code = CAST(T1.U_belnrid AS NVARCHAR(10)) + CAST(T1.U_belposid AS NVARCHAR(10))
WHERE T1.U_belnrid IS NOT NULL
GROUP BY
    T0.DocDate, T0.U_SAC_Output, T1.U_belnrid, T1.U_belposid,
    T4.U_I_LineType, T3.ABGKZ, T1.ItemCode, T1.Dscription,
    T2.SalUnitMsr, T2.ItmsGrpCod, T1.WhsCode, T3.MENGE_VERBRAUCH,
    T3.LIEFERDATUM, T2.SWeight1, T4.U_I_Ac1Balls, T4.U_I_Ac2Balls,
    T0.U_energyElectricity
ORDER BY T0.DocDate DESC, T1.U_belnrid DESC;
```

#### 4. `Item_cost_by_Work_Order.sql` - Giá Thành Đơn Vị Thực Tế Theo Từng Lệnh Sản Xuất (WO Unit Cost)
- **Mục đích**: Tính giá vốn thực tế trên mỗi đơn vị thành phẩm (`Unit Cost`) và mỗi KG (`Cost per KG`) của từng Lệnh sản xuất từ phiếu Nhập kho thành phẩm (`OIGN/IGN1`).
```sql
SELECT TOP 100
    T1.U_belnrid AS [WorkOrder],
    T1.U_belposid AS [Position],
    T1.ItemCode,
    T2.ItemName,
    T2.InvntryUom AS [UoM],
    T2.SWeight1 AS [UnitWeight_KG],
    SUM(T1.Quantity) AS [Total_Output_Qty],
    SUM(T1.Quantity * ISNULL(T2.SWeight1, 0)) AS [Total_Weight_KG],
    SUM(T1.LineTotal) AS [Total_Actual_Cost],
    CASE WHEN SUM(T1.Quantity) > 0 THEN SUM(T1.LineTotal) / SUM(T1.Quantity) ELSE 0 END AS [Unit_Cost],
    CASE WHEN SUM(T1.Quantity * ISNULL(T2.SWeight1, 0)) > 0
         THEN SUM(T1.LineTotal) / SUM(T1.Quantity * ISNULL(T2.SWeight1, 0))
         ELSE 0 END AS [Cost_Per_KG]
FROM OIGN T0 WITH (NOLOCK)
INNER JOIN IGN1 T1 WITH (NOLOCK) ON T0.DocEntry = T1.DocEntry
LEFT JOIN OITM T2 WITH (NOLOCK) ON T1.ItemCode = T2.ItemCode
WHERE T1.U_belnrid IS NOT NULL
GROUP BY T1.U_belnrid, T1.U_belposid, T1.ItemCode, T2.ItemName, T2.InvntryUom, T2.SWeight1
ORDER BY T1.U_belnrid DESC, T1.U_belposid;
```

#### 5. `BOM_Summary_Checking.sql` - Tra Cứu Định Mức BOM Tổng Hợp (`BEAS_STL`)
- **Mục đích**: Xem danh sách BOM của thành phẩm trong Beas (`BEAS_STL`), bao gồm mã mẹ (`ItemCode`), mã con (`ART1_ID`), định mức tiêu hao (`MENGE_VERBRAUCH`), đơn vị tính và bản vẽ (`U_ZNR`).
```sql
SELECT TOP 200
    T0.ItemCode AS [Parent_Item],
    T1.ItemName AS [Parent_Name],
    T1.InvntryUom AS [Parent_UoM],
    T0.POS_ID AS [Line_ID],
    T0.POS_TEXT AS [Pos_No],
    T0.ART1_ID AS [Child_Item],
    T2.ItemName AS [Child_Name],
    T0.MENGE_JE AS [Qty_Per_Assembly],
    T0.MENGE_VERBRAUCH AS [Consumption_Qty],
    T2.InvntryUom AS [Child_UoM],
    T0.WhsCode AS [Issue_Whs]
FROM BEAS_STL T0 WITH (NOLOCK)
INNER JOIN OITM T1 WITH (NOLOCK) ON T0.ItemCode = T1.ItemCode
LEFT JOIN OITM T2 WITH (NOLOCK) ON T0.ART1_ID = T2.ItemCode
ORDER BY T0.ItemCode, T0.POS_ID;
```

#### 6. `Compare_Standard_Actual_BOM_25052025.sql` - So Sánh Định Mức BOM Chuẩn Và Xuất Kho Thực Tế Theo Lệnh Sản Xuất
- **Mục đích**: Đối chiếu lượng nguyên vật liệu định mức trên Lệnh sản xuất (`BEAS_FTSTL`) với lượng thực tế đã xuất kho (`OIGE/IGE1` nối với `OINM`) để phát hiện chênh lệch tiêu hao NVL.
```sql
WITH IssueActual AS (
    SELECT
        T1.U_belnrid,
        T1.U_belposid,
        T1.ItemCode AS MaterialCode,
        SUM(T1.Quantity) AS ActualIssueQty,
        SUM(T2.TransValue) AS ActualIssueValue
    FROM OIGE T0 WITH (NOLOCK)
    INNER JOIN IGE1 T1 WITH (NOLOCK) ON T0.DocEntry = T1.DocEntry
    LEFT JOIN OINM T2 WITH (NOLOCK)
        ON T2.TransType = 60 AND T2.CreatedBy = T1.DocEntry AND T2.DocLineNum = T1.LineNum
    WHERE T1.U_belnrid IS NOT NULL
    GROUP BY T1.U_belnrid, T1.U_belposid, T1.ItemCode
),
ReceiptFG AS (
    SELECT
        T1.U_belnrid,
        T1.U_belposid,
        SUM(T1.Quantity) AS ActualFGQty
    FROM OIGN T0 WITH (NOLOCK)
    INNER JOIN IGN1 T1 WITH (NOLOCK) ON T0.DocEntry = T1.DocEntry
    WHERE T1.U_belnrid IS NOT NULL
    GROUP BY T1.U_belnrid, T1.U_belposid
)
SELECT TOP 150
    P.BELNR_ID AS [WorkOrder],
    P.BELPOS_ID AS [Position],
    P.ItemCode AS [FG_Code],
    FG.ItemName AS [FG_Name],
    P.MENGE_VERBRAUCH AS [Planned_FG_Qty],
    ISNULL(R.ActualFGQty, 0) AS [Actual_FG_Qty],
    S.ART1_ID AS [Material_Code],
    RM.ItemName AS [Material_Name],
    S.TOTALQUANTITY_WHUNIT AS [Planned_RM_Qty],
    ISNULL(IA.ActualIssueQty, 0) AS [Actual_RM_Qty],
    ISNULL(IA.ActualIssueQty, 0) - ISNULL(S.TOTALQUANTITY_WHUNIT, 0) AS [Variance_Qty],
    ISNULL(IA.ActualIssueValue, 0) AS [Actual_RM_Value]
FROM BEAS_FTPOS P WITH (NOLOCK)
INNER JOIN BEAS_FTSTL S WITH (NOLOCK) ON P.BELNR_ID = S.BELNR_ID AND P.BELPOS_ID = S.BELPOS_ID
LEFT JOIN OITM FG WITH (NOLOCK) ON P.ItemCode = FG.ItemCode
LEFT JOIN OITM RM WITH (NOLOCK) ON S.ART1_ID = RM.ItemCode
LEFT JOIN IssueActual IA ON IA.U_belnrid = S.BELNR_ID AND IA.U_belposid = S.BELPOS_ID AND IA.MaterialCode = S.ART1_ID
LEFT JOIN ReceiptFG R ON R.U_belnrid = P.BELNR_ID AND R.U_belposid = P.BELPOS_ID
ORDER BY P.BELNR_ID DESC, P.BELPOS_ID, S.POS_ID;
```

#### 7. `Stock_Summary_For_Production.sql` - Báo Cáo Nhập Xuất Tồn Nguyên Vật Liệu Phục Vụ Sản Xuất
- **Mục đích**: Tổng hợp Tồn đầu kỳ, Mua trong kỳ (`PDN/RPD/PCH`), Xuất sản xuất (`IGE`), Chuyển kho (`WTR`) và Tồn cuối kỳ của nhóm NVL sản xuất (`ItmsGrpCod IN (100, 107)`).

#### 8. `Checking_Production_Output.sql` - Kiểm Tra Nhanh Giao Dịch Sổ Kho Thành Phẩm (`ItmsGrpCod = 109`)
```sql
SELECT TOP 100
    T0.DocDate,
    T0.TransType,
    T0.BASE_REF AS [DocNum],
    T0.ItemCode,
    T1.ItemName,
    T0.Warehouse,
    T0.InQty,
    T0.OutQty,
    T0.CalcPrice,
    T0.TransValue
FROM OINM T0 WITH (NOLOCK)
INNER JOIN OITM T1 WITH (NOLOCK) ON T0.ItemCode = T1.ItemCode
WHERE T1.ItmsGrpCod = 109
ORDER BY T0.DocDate DESC, T0.TransNum DESC;
```

---

### PHẦN B - PHÂN HỆ KHO & KIỂM ĐỊNH CHẤT LƯỢNG (`Inventory`)

#### 9. `01_Inventory_checking.sql` - Báo Cáo Nhập Xuất Tồn Tổng Hợp Theo Kho (Số Lượng & Giá Trị)
- **Mục đích**: Tính Tồn đầu kỳ (`OpeningQty`, `OpeningVal`), Nhập trong kỳ (`InQty`, `InVal`), Xuất trong kỳ (`OutQty`, `OutVal`), Tồn cuối kỳ (`ClosingQty`, `ClosingVal`) từ bảng `OINM`.
```sql
DECLARE @FromDate DATE = DATEADD(MONTH, -1, GETDATE());
DECLARE @ToDate DATE = GETDATE();

SELECT TOP 200
    N1.Warehouse,
    N1.ItemCode,
    I1.ItemName,
    I1.InvntryUom AS [UoM],
    SUM(CASE WHEN N1.DocDate < @FromDate THEN (N1.InQty - N1.OutQty) ELSE 0 END) AS [Opening_Qty],
    SUM(CASE WHEN N1.DocDate < @FromDate THEN N1.TransValue ELSE 0 END) AS [Opening_Val],
    SUM(CASE WHEN N1.DocDate BETWEEN @FromDate AND @ToDate THEN N1.InQty ELSE 0 END) AS [In_Qty],
    SUM(CASE WHEN N1.DocDate BETWEEN @FromDate AND @ToDate AND N1.InQty > 0 THEN N1.TransValue ELSE 0 END) AS [In_Val],
    SUM(CASE WHEN N1.DocDate BETWEEN @FromDate AND @ToDate THEN N1.OutQty ELSE 0 END) AS [Out_Qty],
    SUM(CASE WHEN N1.DocDate BETWEEN @FromDate AND @ToDate AND N1.OutQty > 0 THEN -N1.TransValue ELSE 0 END) AS [Out_Val],
    SUM(CASE WHEN N1.DocDate <= @ToDate THEN (N1.InQty - N1.OutQty) ELSE 0 END) AS [Closing_Qty],
    SUM(CASE WHEN N1.DocDate <= @ToDate THEN N1.TransValue ELSE 0 END) AS [Closing_Val]
FROM OINM N1 WITH (NOLOCK)
INNER JOIN OITM I1 WITH (NOLOCK) ON N1.ItemCode = I1.ItemCode
GROUP BY N1.Warehouse, N1.ItemCode, I1.ItemName, I1.InvntryUom
HAVING SUM(CASE WHEN N1.DocDate <= @ToDate THEN (N1.InQty - N1.OutQty) ELSE 0 END) <> 0
    OR SUM(CASE WHEN N1.DocDate BETWEEN @FromDate AND @ToDate THEN (N1.InQty + N1.OutQty) ELSE 0 END) <> 0
ORDER BY N1.Warehouse, N1.ItemCode;
```

#### 10. `Current_Stock_by_WH.sql` - Tồn Kho Tức Thời Trên 5 Kho Chính (`01.RM`, `01.FG`, `01.WIP`, `01.QC`, `01.SP`)
- **Mục đích**: Xem nhanh tồn kho hiện tại (`OITW.OnHand`) của từng mặt hàng xoay cột (Pivot) theo 5 kho chính của FVIVN kèm số bản vẽ `U_ZNR` và đơn giá `AvgPrice`.
```sql
SELECT TOP 200
    T0.ItemCode,
    T0.ItemName,
    T1.ItmsGrpNam AS [Item_Group],
    T0.U_ZNR AS [Drawing_Number],
    T0.InvntryUom AS [UoM],
    T0.AvgPrice AS [Unit_Cost],
    SUM(CASE WHEN T2.WhsCode = '01.RM' THEN T2.OnHand ELSE 0 END) AS [Whs_01_RM],
    SUM(CASE WHEN T2.WhsCode = '01.FG' THEN T2.OnHand ELSE 0 END) AS [Whs_01_FG],
    SUM(CASE WHEN T2.WhsCode = '01.WIP' THEN T2.OnHand ELSE 0 END) AS [Whs_01_WIP],
    SUM(CASE WHEN T2.WhsCode = '01.QC' THEN T2.OnHand ELSE 0 END) AS [Whs_01_QC],
    SUM(CASE WHEN T2.WhsCode = '01.SP' THEN T2.OnHand ELSE 0 END) AS [Whs_01_SP],
    T0.OnHand AS [Total_OnHand]
FROM OITM T0 WITH (NOLOCK)
LEFT JOIN OITB T1 WITH (NOLOCK) ON T0.ItmsGrpCod = T1.ItmsGrpCod
LEFT JOIN OITW T2 WITH (NOLOCK) ON T0.ItemCode = T2.ItemCode
WHERE T0.OnHand > 0
GROUP BY T0.ItemCode, T0.ItemName, T1.ItmsGrpNam, T0.U_ZNR, T0.InvntryUom, T0.AvgPrice, T0.OnHand
ORDER BY T0.ItemCode;
```

#### 11. `Inventory_Counting_Tracking_Adjustment.sql` - Đối Chiếu Kiểm Kê Kho (`OINC/INC1`) Với Nhập/Xuất Điều Chỉnh (`OIGN/OIGE`)
- **Mục đích**: Kiểm tra chênh lệch kiểm kê trong `OINC/INC1` đã được hạch toán phiếu Nhập kho (`OIGN/IGN1`) hoặc Xuất kho (`OIGE/IGE1`) đầy đủ chưa (`BaseType = 1470000065`).

#### 12. `Minimum_Safety_Stock_Tracking.sql` - Cảnh Báo Tồn Kho Dưới Mức Tối Thiểu (`MinLevel`)
- **Mục đích**: Liệt kê các mặt hàng có tổng tồn kho tại các kho chính thấp hơn định mức tồn tối thiểu `OITM.MinLevel`, kèm số lượng đang đặt mua (`OnOrder`) để bộ phận Mua hàng lên PR/PO kịp thời.
```sql
SELECT
    T0.ItemCode,
    T0.ItemName,
    T1.ItmsGrpNam AS [ItemGroup],
    T0.InvntryUom AS [UoM],
    T0.MinLevel AS [Safety_Stock_Min],
    T0.OnHand AS [Current_OnHand],
    T0.OnOrder AS [PO_OnOrder],
    (T0.OnHand - T0.MinLevel) AS [Shortage_Qty]
FROM OITM T0 WITH (NOLOCK)
LEFT JOIN OITB T1 WITH (NOLOCK) ON T0.ItmsGrpCod = T1.ItmsGrpCod
WHERE T0.MinLevel > 0 AND T0.OnHand < T0.MinLevel AND T0.validFor = 'Y'
ORDER BY (T0.OnHand - T0.MinLevel) ASC;
```

#### 13. `QC_Transaction_Tracking.sql` - Theo Dõi Chuyển Kho Từ Phân Hệ QC Beas (`U_beas_basetype = 'QC'`)
- **Mục đích**: Truy vết các phiếu chuyển kho (`OWTR/WTR1`) phát sinh từ quyết định QC của Beas Manufacturing (`WTR1.U_beas_basetype = 'QC'`) kèm số Lô (`BatchNum`) trong `IBT1`.
```sql
SELECT TOP 100
    T0.DocNum,
    T0.DocDate,
    T1.ItemCode,
    T1.Dscription AS [ItemName],
    T1.FromWhsCod AS [From_Whs],
    T1.WhsCode AS [To_Whs],
    T1.Quantity,
    T2.BatchNum,
    T1.U_beas_basetype,
    T1.U_belnrid AS [WorkOrder]
FROM OWTR T0 WITH (NOLOCK)
INNER JOIN WTR1 T1 WITH (NOLOCK) ON T0.DocEntry = T1.DocEntry
LEFT JOIN IBT1 T2 WITH (NOLOCK)
    ON T2.BaseType = 67 AND T2.BaseEntry = T0.DocEntry AND T2.BaseLinNum = T1.LineNum AND T2.Direction = 0
WHERE T1.U_beas_basetype = 'QC'
ORDER BY T0.DocDate DESC, T0.DocNum DESC;
```

---

### PHẦN C - PHÂN HỆ TÀI CHÍNH KẾ TOÁN & THUẾ (`Financials`)

#### 14. `Output_VAT_Checking.sql` - Bảng Kê Hóa Đơn Thuế GTGT Đầu Ra (TK `333110`)
- **Mục đích**: Kết xuất bảng kê thuế GTGT đầu ra từ `OINV` (AR Invoice), `ORIN` (AR Credit Memo), `ODPI` (AR Down Payment) nối với bút toán Sổ cái `OJDT/JDT1` có tài khoản `333110`.
```sql
SELECT TOP 200
    T0.TransId,
    T0.RefDate AS [PostingDate],
    T0.TaxDate AS [DocumentDate],
    T2.CardCode,
    T2.CardName,
    T2.LicTradNum AS [TaxCode_MST],
    T1.Ref1 AS [DocNum],
    T0.U_VAT_No AS [Invoice_No],
    T0.U_VAT_Series AS [Invoice_Serial],
    (T1.Credit - T1.Debit) AS [VAT_Output_Amount],
    T0.Memo AS [Remarks]
FROM OJDT T0 WITH (NOLOCK)
INNER JOIN JDT1 T1 WITH (NOLOCK) ON T0.TransId = T1.TransId
LEFT JOIN OCRD T2 WITH (NOLOCK) ON T1.ShortName = T2.CardCode
WHERE T1.Account = '333110'
ORDER BY T0.RefDate DESC, T0.TransId DESC;
```

#### 15. `VAT_input_checking.sql` - Bảng Kê Hóa Đơn Thuế GTGT Đầu Vào (TK `133101`)
- **Mục đích**: Kết xuất bảng kê thuế GTGT đầu vào từ `OPCH` (AP Invoice), `ORPC` (AP Credit Memo), `OJDT` nối với `JDT1` có tài khoản `133101`.
```sql
SELECT TOP 200
    T0.TransId,
    T0.RefDate AS [PostingDate],
    T0.TaxDate AS [InvoiceDate],
    T2.CardCode,
    T2.CardName,
    T2.LicTradNum AS [Vendor_TaxCode],
    T1.Ref1 AS [DocNum],
    (T1.Debit - T1.Credit) AS [VAT_Input_Amount],
    T0.Memo AS [Remarks]
FROM OJDT T0 WITH (NOLOCK)
INNER JOIN JDT1 T1 WITH (NOLOCK) ON T0.TransId = T1.TransId
LEFT JOIN OCRD T2 WITH (NOLOCK) ON T1.ShortName = T2.CardCode
WHERE T1.Account = '133101'
ORDER BY T0.RefDate DESC, T0.TransId DESC;
```

#### 16. `Expenses_checking.sql` - Kiểm Tra Chi Phí Đầu 6 & Đầu 8 Theo Tháng (`621`, `622`, `627`, `641`, `642`, `811`)
- **Mục đích**: Xem biến động chi phí theo từng tài khoản đầu `6%` và `8%` qua 12 tháng trong năm tài chính để kiểm soát chi phí bất thường.
```sql
SELECT
    T1.Account,
    T2.AcctName,
    YEAR(T0.RefDate) AS [Year],
    MONTH(T0.RefDate) AS [Month],
    SUM(T1.Debit - T1.Credit) AS [Net_Expense]
FROM OJDT T0 WITH (NOLOCK)
INNER JOIN JDT1 T1 WITH (NOLOCK) ON T0.TransId = T1.TransId
INNER JOIN OACT T2 WITH (NOLOCK) ON T1.Account = T2.AcctCode
WHERE (T1.Account LIKE '6%' OR T1.Account LIKE '8%')
  AND T0.RefDate >= DATEFROMPARTS(YEAR(GETDATE()), 1, 1)
GROUP BY T1.Account, T2.AcctName, YEAR(T0.RefDate), MONTH(T0.RefDate)
ORDER BY T1.Account, [Year], [Month];
```

---

### PHẦN D - PHÂN HỆ MUA HÀNG & CÔNG NỢ PHẢI TRẢ (`Purchasing AP`)

#### 17. `Purchase_Checking_All.sql` - Truy Vết Toàn Trình Mua Hàng (`PR -> PO -> GRPO -> Landed Cost -> AP Invoice`)
- **Mục đích**: Theo dõi tiến độ từ Yêu cầu mua hàng (`OPRQ/PRQ1`) -> Đơn mua hàng (`OPOR/POR1`) -> Nhập kho (`OPDN/PDN1`) -> Chi phí mua hàng (`OIPF/IPF1`) -> Hóa đơn AP (`OPCH/PCH1`).
```sql
SELECT TOP 100
    T0.DocNum AS [PO_Num],
    T0.DocDate AS [PO_Date],
    T0.CardCode,
    T0.CardName,
    T1.ItemCode,
    T1.Dscription AS [ItemName],
    T1.Quantity AS [PO_Qty],
    T1.OpenQty AS [PO_OpenQty],
    T1.Price AS [Unit_Price],
    T1.Currency,
    T3.DocNum AS [GRPO_Num],
    T3.DocDate AS [GRPO_Date],
    T2.Quantity AS [GRPO_Qty],
    T3.U_LCDone AS [LandedCost_Done],
    T5.DocNum AS [AP_Inv_Num],
    T5.DocDate AS [AP_Inv_Date]
FROM OPOR T0 WITH (NOLOCK)
INNER JOIN POR1 T1 WITH (NOLOCK) ON T0.DocEntry = T1.DocEntry
LEFT JOIN PDN1 T2 WITH (NOLOCK) ON T2.BaseType = 22 AND T2.BaseEntry = T1.DocEntry AND T2.BaseLine = T1.LineNum
LEFT JOIN OPDN T3 WITH (NOLOCK) ON T2.DocEntry = T3.DocEntry AND T3.CANCELED = 'N'
LEFT JOIN PCH1 T4 WITH (NOLOCK) ON T4.BaseType = 20 AND T4.BaseEntry = T2.DocEntry AND T4.BaseLine = T2.LineNum
LEFT JOIN OPCH T5 WITH (NOLOCK) ON T4.DocEntry = T5.DocEntry AND T5.CANCELED = 'N'
WHERE T0.CANCELED = 'N'
ORDER BY T0.DocDate DESC, T0.DocNum DESC;
```

#### 18. `Purchase_Items_Tracker.sql` - Theo Dõi Tiến Độ Đặt Hàng PR & PO По Mặt Hàng
- **Mục đích**: Kiểm tra các mặt hàng đang nằm trên PR (`OPRQ/PRQ1`) hoặc PO (`OPOR/POR1`) chưa giao đủ hàng.

#### 19. `Oversea_Procurement_Monitoring.sql` - Giám Sát Đơn Mua Hàng Nhập Khẩu (`Cash_Flow = 'Oversea'`) Chưa Làm Landed Cost
- **Mục đích**: Lọc các đơn hàng nhập khẩu từ NCC nước ngoài (`OCRD.GroupCode = 103` hoặc ngoại tệ khác `VND`) đã có GRPO nhưng chưa hoàn tất Landed Cost (`U_LCDone`).

#### 20. `Check_Missing_Allocation_Cost.sql` - Kiểm Tra Bút Toán Định Khoản Thiếu Trung Tâm Chi Phí (`OcrCode` / Cost Center)
- **Mục đích**: Tìm các dòng hạch toán chi phí trên `JDT1`, `PCH1`, `IGE1` vào tài khoản đầu `6%` hoặc `8%` nhưng bị bỏ trống `ProfitCode` / `OcrCode2` / `OcrCode3`.
```sql
SELECT TOP 100
    T0.TransId,
    T0.RefDate,
    T0.TransType,
    T0.BaseRef AS [DocNum],
    T1.Account,
    T2.AcctName,
    T1.Debit,
    T1.Credit,
    T1.ProfitCode AS [CostCenter_Dim1],
    T1.OcrCode2 AS [CostCenter_Dim2],
    T1.OcrCode3 AS [CostCenter_Dim3],
    T1.LineMemo
FROM OJDT T0 WITH (NOLOCK)
INNER JOIN JDT1 T1 WITH (NOLOCK) ON T0.TransId = T1.TransId
INNER JOIN OACT T2 WITH (NOLOCK) ON T1.Account = T2.AcctCode
WHERE (T1.Account LIKE '622%' OR T1.Account LIKE '627%' OR T1.Account LIKE '641%' OR T1.Account LIKE '642%')
  AND ISNULL(T1.ProfitCode, '') = ''
ORDER BY T0.RefDate DESC, T0.TransId DESC;
```

---

### PHẦN E - PHÂN HỆ BÁN HÀNG & PHẢI THU (`Sales AR` & `Business Partners`)

#### 21. `AR_Follow_up.sql` - Theo Dõi Chuỗi Bán Hàng (`SO -> Delivery -> AR Invoice`) & Công Nợ Phải Thu
- **Mục đích**: Truy vết từ Đơn hàng bán (`ORDR/RDR1`) sang Phiếu giao hàng (`ODLN/DLN1`) và Hóa đơn bán hàng (`OINV/INV1`), kiểm tra số tiền đã thu (`PaidToDate`) và công nợ còn phải thu.
```sql
SELECT TOP 100
    T0.DocNum AS [SO_Num],
    T0.DocDate AS [SO_Date],
    T0.CardCode,
    T0.CardName,
    T1.ItemCode,
    T1.Dscription AS [ItemName],
    T1.Quantity AS [SO_Qty],
    T1.OpenQty AS [SO_OpenQty],
    T3.DocNum AS [Delivery_Num],
    T3.DocDate AS [Delivery_Date],
    T2.Quantity AS [Delivered_Qty],
    T5.DocNum AS [AR_Invoice_Num],
    T5.DocDate AS [AR_Invoice_Date],
    T5.DocTotal AS [Invoice_Total],
    T5.PaidToDate AS [Paid_Amount],
    (T5.DocTotal - T5.PaidToDate) AS [Open_Balance]
FROM ORDR T0 WITH (NOLOCK)
INNER JOIN RDR1 T1 WITH (NOLOCK) ON T0.DocEntry = T1.DocEntry
LEFT JOIN DLN1 T2 WITH (NOLOCK) ON T2.BaseType = 17 AND T2.BaseEntry = T1.DocEntry AND T2.BaseLine = T1.LineNum
LEFT JOIN ODLN T3 WITH (NOLOCK) ON T2.DocEntry = T3.DocEntry AND T3.CANCELED = 'N'
LEFT JOIN INV1 T4 WITH (NOLOCK) ON T4.BaseType = 15 AND T4.BaseEntry = T2.DocEntry AND T4.BaseLine = T2.LineNum
LEFT JOIN OINV T5 WITH (NOLOCK) ON T4.DocEntry = T5.DocEntry AND T5.CANCELED = 'N'
WHERE T0.CANCELED = 'N'
ORDER BY T0.DocDate DESC, T0.DocNum DESC;
```

#### 22. `Sale_Order_Delivery_All.sql` - Tổng Hợp Giao Hàng Theo Đơn Bán Hàng (Quy Đổi Trọng Lượng KG `SWeight1`)
- **Mục đích**: Theo dõi khối lượng đặt hàng và đã giao tính theo đơn vị bán và quy đổi ra KG (`OITM.SWeight1`).

#### 23. `Sale_Order_Checking.sql` & `Sale_Invoice_by_Items.sql` - Báo Cáo Doanh Thu Chi Tiết Theo Mặt Hàng & Khách Hàng
- **Mục đích**: Tổng hợp doanh thu bán hàng từ `OINV/INV1` (trừ hàng bán trả lại `ORIN/RIN1`) theo khách hàng, mặt hàng, số lượng, trọng lượng KG và đơn giá bán bình quân.

#### 24. `Vendor_Customer_Master_Data.sql` - Danh Sách Khách Hàng & Nhà Cung Cấp (`OCRD`) Kèm Điều Khoản Thanh Toán (`OCTG`)
- **Mục đích**: Tra cứu thông tin Master Data của Business Partner (`CardCode`, `CardName`, `CardType`, `GroupName`, `LicTradNum` MST, `PymntGroup` hạn thanh toán, `Balance` số dư công nợ hiện tại).
```sql
SELECT TOP 200
    T0.CardCode,
    T0.CardName,
    T0.CardFName AS [Foreign_Name],
    T0.CardType,
    T1.GroupName AS [BP_Group],
    T0.LicTradNum AS [Tax_ID],
    T0.Currency,
    T2.PymntGroup AS [Payment_Terms],
    T0.Balance AS [Current_Balance],
    T0.Phone1,
    T0.E_Mail,
    T0.Address
FROM OCRD T0 WITH (NOLOCK)
LEFT JOIN OCRG T1 WITH (NOLOCK) ON T0.GroupCode = T1.GroupCode
LEFT JOIN OCTG T2 WITH (NOLOCK) ON T0.GroupNum = T2.GroupNum
WHERE T0.validFor = 'Y'
ORDER BY T0.CardType, T0.CardCode;
```


---

## 3. Chỉ Mục Chính Xác 24 File Trong `queries/SYNC_FVIVN_PROD_SSMS` (Dùng Với `sap_help_query_search`)

Khi cần lấy nguyên bản toàn bộ câu lệnh SQL trong thư mục `E:\DIEN APP\SQL SAP B1\queries\SYNC_FVIVN_PROD_SSMS`, hãy gọi công cụ `sap_help_query_search(category="SYNC_FVIVN_PROD_SSMS", keyword="...")` với tên file tương ứng dưới đây:

### 3.1. Thư mục `Financials` (5 file)
1. `WORK ORDER PRODUCTION COST ALLOCATION.sql` - Phân bổ chi phí sản xuất theo Work Order (`BEAS_JOURNAL_HISTORIE`, TK `154100`, `155100`, `154200`, `152000`, `152100`, `622%`, `627%`).
2. `WORK ORDER PRODUCTION COST ALLOCATION Branch.sql` - Phân bổ chi phí sản xuất theo Work Order có tách Chi nhánh (`BPLId` / `BPLName`).
3. `Costing_Production_Detail.sql` - Chi tiết giá thành sản xuất thực tế theo Lệnh sản xuất Beas.
4. `VAT IN AP.sql` - Bảng kê hóa đơn chứng từ hàng hóa dịch vụ mua vào (`OPCH`, `ORPC`, `OJDT`, TK `133101`).
5. `VAT OUT AR.sql` - Bảng kê hóa đơn chứng từ hàng hóa dịch vụ bán ra (`OINV`, `ORIN`, `ODPI`, TK `333110`).

### 3.2. Thư mục `Production` (5 file)
6. `Work Order - Receipt - Issue.sql` - Tổng hợp Nhập thành phẩm (`OIGN/IGN1`), Xuất nguyên vật liệu (`OIGE/IGE1`), Điện năng (`U_energyElectricity`), Dây chuyền (`U_SAC_Output`) và Bi thủy tinh (`[@IOT_PARAMETERS]`) theo Work Order.
7. `Work Order - Good Reciept FG - Good Issue MR.sql` - Đối chiếu Nhập kho thành phẩm (FG) và Xuất kho nguyên vật liệu (MR) theo từng Lệnh sản xuất (`U_belnrid`, `U_belposid`).
8. `BOM-List.sql` - Danh mục định mức nguyên vật liệu BOM Beas (`BEAS_STL`, `BEAS_STL_HEADER`, `OITM.U_ZNR`).
9. `Daily_hour_report.sql` - Báo cáo giờ công sản xuất hàng ngày (`BEAS_ARBZEIT`).
10. `QC Report.sql` - Báo cáo kiểm định chất lượng QC Beas & chuyển kho QC (`WTR1.U_beas_basetype = 'QC'`).

### 3.3. Thư mục `Inventory` (7 file)
11. `Inventory movement.sql` - Báo cáo Nhập Xuất Tồn tổng hợp số lượng và giá trị theo kho (`OINM`).
12. `Inventory movement account.sql` - Báo cáo Nhập Xuất Tồn đối chiếu theo Tài khoản kế toán kho (`OINM` nối `OACT`).
13. `Inventory movement account Batch.sql` - Báo cáo Nhập Xuất Tồn chi tiết theo Số Lô (`BatchNum` - `IBT1/OBTN`) và Tài khoản kho.
14. `Inventory Posting List.sql` - Sổ chi tiết giao dịch vật tư hàng hóa (`OINM` / `OIVL`).
15. `Batch Tracking Report.sql` - Báo cáo truy xuất nguồn gốc Lô hàng (`OBTN`, `IBT1`).
16. `Delivery Note.sql` - Báo cáo phiếu xuất kho giao hàng (`ODLN/DLN1`).
17. `Item.sql` - Danh mục vật tư hàng hóa Master Data (`OITM`, `OITB`, `OITW`).

### 3.4. Thư mục `Purchasing AP` (4 file)
18. `PO, Goods Receipt & AP Invoice Reconciliation Report.sql` - Báo cáo đối chiếu 3 chiều `PO -> GRPO -> AP Invoice` (`OPOR -> OPDN -> OPCH`).
19. `Good reciept Po & PO.sql` - Theo dõi tiến độ nhận hàng GRPO so với đơn đặt hàng PO.
20. `Landed Costs.sql` - Báo cáo chi phí mua hàng Landed Costs (`OIPF/IPF1`) phân bổ vào giá vốn nhập kho.
21. `Landed Costs AP.sql` - Đối chiếu Landed Costs (`OIPF`) với Hóa đơn chi phí mua hàng AP Service Invoice (`OPCH`).

### 3.5. Thư mục `Sales AR` (2 file)
22. `SO, Delivery & AR Invoice Reconciliation Report.sql` - Báo cáo đối chiếu chuỗi bán hàng `Sales Order -> Delivery -> AR Invoice` (`ORDR -> ODLN -> OINV`).
23. `Sales & Gross Profit Analysis Report (Summary & Detail).txt` - Báo cáo phân tích Doanh thu & Lợi nhuận gộp (`Gross Profit`) tổng hợp và chi tiết.

### 3.6. Thư mục `Business Partners` (1 file)
24. `List Business Partners.sql` - Danh sách Khách hàng & Nhà cung cấp (`OCRD`, `OCRG`, `OCTG`).
