# Học Phần 08: Kho Mẫu SQL Tồn Kho (Inventory), Hoạch Định MRP, QC, Master Data & Nhân Sự

Tài liệu này là chỉ mục băm nhỏ (Smart-Loading Chunk) cho nhóm câu lệnh SQL thuộc **Phân hệ Tồn kho (`05.Inventory Queries`, `Inventory`), Hoạch định vật tư (`04.MRP Queries`, `MRP`), Kiểm soát chất lượng (`QC`), Danh mục chuẩn (`99.Master Data Queries`, `Business Partners`), Nhân sự (`Human Resources`), Bảo hành (`Service`) và Công thức (`00.Formulas`)** nằm trong `references/queries/`.

---

## 1. Danh Mục File `.sql` Nguyên Bản Trong `references/queries/`

| Phân nhóm | Đường dẫn File `.sql` trong `references/` | Mục đích & Bảng sử dụng chính |
| :--- | :--- | :--- |
| **Tồn kho & Nhập Xuất Tồn (`05.Inventory Queries` & `Inventory`)** | `references/queries/05.Inventory Queries/`<br>`references/queries/Inventory/`<br>`references/queries/SYNC_SBO_MFG_PROD_SSMS/Inventory/` | 33 file `.sql` báo cáo Nhập - Xuất - Tồn theo kho (`OITW`, `OINM`), Tồn kho theo Lô (`OBTN`/`IBT1`), Serial (`OSRN`), Vị trí Bin (`OBIN`/`OIBQ`), tuổi tồn kho (Slow-moving Stock). |
| **Hoạch định MRP (`04.MRP Queries` & `MRP`)** | `references/queries/04.MRP Queries/`<br>`references/queries/MRP/` | 4 file `.sql` phân tích cung - cầu vật tư, tồn kho an toàn (`MinLevel`) và đề xuất mua hàng/sản xuất. |
| **Kiểm tra Chất lượng (`QC`)** | `references/queries/QC/` | 2 file `.sql` truy vấn kết quả kiểm định chất lượng nguyên vật liệu & thành phẩm (`BEAS_QSFTHAUPT`/`BEAS_QSFTPOS`). |
| **Master Data & Đối tác (`99.Master Data Queries` & `Business Partners`)** | `references/queries/99.Master Data Queries/`<br>`references/queries/Business Partners/` | 8 file `.sql` kiểm tra tính toàn vẹn của Item Master Data (`OITM`), Business Partner (`OCRD`), Địa chỉ (`CRD1`), Người liên hệ (`OCPR`). |
| **Nhân sự (`Human Resources`) & Dịch vụ (`Service`)** | `references/queries/Human Resources/`<br>`references/queries/Service/` | 32 file `.sql` quản lý hồ sơ nhân viên (`OHEM`), chấm công và phiếu bảo hành/dịch vụ (`OSCL`/`OCTR`). |
| **Công thức Báo cáo Tài chính (`00.Formulas`)** | `references/queries/00.Formulas/` | 34 file `.sql` công thức tính số dư đầu kỳ (`OBALD`), phát sinh Nợ/Có (`DR`/`CR`), số dư cuối kỳ (`BALD`), nhập thành phẩm (`FGIN`). |

---

## 2. Mẫu Khung SQL Chuẩn: Báo Cáo Nhập - Xuất - Tồn Theo Kho & Kỳ Ngày (`OINM` + `OITM` + `OWHS`)

```sql
SELECT
    T0.ItemCode                          AS [Ma_Hang],
    T1.ItemName                          AS [Ten_Hang],
    T1.InvntryUom                        AS [DVT],
    T0.Warehouse                         AS [Ma_Kho],
    W0.WhsName                           AS [Ten_Kho],
    SUM(CASE WHEN T0.DocDate < @FromDate
             THEN ISNULL(T0.InQty, 0) - ISNULL(T0.OutQty, 0)
             ELSE 0 END)                 AS [SL_Ton_Dau_Ky],
    SUM(CASE WHEN T0.DocDate < @FromDate
             THEN ISNULL(T0.TransValue, 0)
             ELSE 0 END)                 AS [GT_Ton_Dau_Ky],
    SUM(CASE WHEN T0.DocDate BETWEEN @FromDate AND @ToDate
             THEN ISNULL(T0.InQty, 0)
             ELSE 0 END)                 AS [SL_Nhap_Trong_Ky],
    SUM(CASE WHEN T0.DocDate BETWEEN @FromDate AND @ToDate AND ISNULL(T0.InQty, 0) > 0
             THEN ISNULL(T0.TransValue, 0)
             ELSE 0 END)                 AS [GT_Nhap_Trong_Ky],
    SUM(CASE WHEN T0.DocDate BETWEEN @FromDate AND @ToDate
             THEN ISNULL(T0.OutQty, 0)
             ELSE 0 END)                 AS [SL_Xuat_Trong_Ky],
    SUM(CASE WHEN T0.DocDate BETWEEN @FromDate AND @ToDate AND ISNULL(T0.OutQty, 0) > 0
             THEN -ISNULL(T0.TransValue, 0)
             ELSE 0 END)                 AS [GT_Xuat_Trong_Ky],
    SUM(CASE WHEN T0.DocDate <= @ToDate
             THEN ISNULL(T0.InQty, 0) - ISNULL(T0.OutQty, 0)
             ELSE 0 END)                 AS [SL_Ton_Cuoi_Ky],
    SUM(CASE WHEN T0.DocDate <= @ToDate
             THEN ISNULL(T0.TransValue, 0)
             ELSE 0 END)                 AS [GT_Ton_Cuoi_Ky]
FROM OINM T0 WITH (NOLOCK)
INNER JOIN OITM T1 WITH (NOLOCK) ON T0.ItemCode = T1.ItemCode
LEFT  JOIN OWHS W0 WITH (NOLOCK) ON T0.Warehouse = W0.WhsCode
WHERE T0.DocDate <= @ToDate
GROUP BY T0.ItemCode, T1.ItemName, T1.InvntryUom, T0.Warehouse, W0.WhsName
HAVING SUM(CASE WHEN T0.DocDate <= @ToDate THEN ABS(ISNULL(T0.InQty, 0)) + ABS(ISNULL(T0.OutQty, 0)) ELSE 0 END) > 0
ORDER BY T0.Warehouse, T0.ItemCode;
```
