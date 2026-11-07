# Học Phần 07: Kho Mẫu SQL Bán Hàng (Sales - A/R) & Mua Hàng (Purchasing - A/P)

Tài liệu này là chỉ mục băm nhỏ (Smart-Loading Chunk) cho nhóm câu lệnh SQL thuộc **Phân hệ Bán hàng (`02.Sales Queries`, `Sales AR`) và Mua hàng (`03.Purchase Queries`, `Sales and Purchasing`, `Purchasing AP`)** nằm trong `references/queries/`.

---

## 1. Danh Mục File `.sql` Nguyên Bản Trong `references/queries/`

| Phân nhóm | Đường dẫn File `.sql` trong `references/` | Mục đích & Bảng sử dụng chính |
| :--- | :--- | :--- |
| **Theo dõi Giao hàng & Đơn hàng Bán** | `references/queries/Delivery_and_SalesOrder.sql`<br>`references/queries/Recent_Deliveries.sql` | Truy vết tiến độ giao hàng từ Sales Order (`ORDR`/`RDR1`) sang Delivery (`ODLN`/`DLN1`) và A/R Invoice (`OINV`/`INV1`). |
| **Truy vấn Bán hàng Chuẩn (`02.Sales Queries` & `Sales AR`)** | `references/queries/02.Sales Queries/`<br>`references/queries/Sales AR/` | 14 file `.sql` phân tích doanh thu theo Khách hàng, Nhân viên kinh doanh (`OSLP`), Mặt hàng (`OITM`), Lợi nhuận gộp (`Gross Profit`). |
| **Truy vấn Mua hàng Chuẩn (`03.Purchase Queries`)** | `references/queries/03.Purchase Queries/` | 11 file `.sql` theo dõi Yêu cầu mua hàng (`OPRQ`), Đơn mua hàng (`OPOR`), Nhập kho mua hàng GRPO (`OPDN`), Hóa đơn AP (`OPCH`). |
| **Tổng hợp Mua - Bán (`Sales and Purchasing`)** | `references/queries/Sales and Purchasing/` | 24 file `.sql` đối chiếu liên phân hệ Mua hàng - Tồn kho - Bán hàng. |
| **Mua - Bán Thực chiến FVIVN (`SYNC_FVIVN_PROD_SSMS`)** | `references/queries/SYNC_FVIVN_PROD_SSMS/Purchasing AP/`<br>`references/queries/SYNC_FVIVN_PROD_SSMS/Sales AR/` | Bộ 5 file `.sql` thực chiến theo dõi PO, GRPO, Hóa đơn AP và Doanh thu AR tại FVIVN. |

---

## 2. Mẫu Khung SQL Chuẩn: Truy Vết Toàn Trình Chuỗi Bán Hàng (`ORDR -> ODLN -> OINV`)

```sql
SELECT
    T0.DocNum                            AS [So_SO],
    T0.DocDate                           AS [Ngay_SO],
    T0.CardCode                          AS [Ma_KH],
    T0.CardName                          AS [Ten_KH],
    T1.ItemCode                          AS [Ma_Hang],
    T1.Dscription                        AS [Ten_Hang],
    T1.Quantity                          AS [SL_Dat_SO],
    T1.OpenQty                           AS [SL_Con_Mo_SO],
    D0.DocNum                            AS [So_Phieu_Giao_ODLN],
    D0.DocDate                           AS [Ngay_Giao],
    D1.Quantity                          AS [SL_Da_Giao],
    I0.DocNum                            AS [So_Hoa_Don_OINV],
    I0.DocDate                           AS [Ngay_Hoa_Don],
    I1.LineTotal                         AS [Doanh_Thu_Chua_Thue]
FROM ORDR T0 WITH (NOLOCK)
INNER JOIN RDR1 T1 WITH (NOLOCK)
    ON T0.DocEntry = T1.DocEntry
LEFT JOIN DLN1 D1 WITH (NOLOCK)
    ON D1.BaseEntry = T1.DocEntry
   AND D1.BaseLine  = T1.LineNum
   AND D1.BaseType  = 17
LEFT JOIN ODLN D0 WITH (NOLOCK)
    ON D1.DocEntry  = D0.DocEntry
   AND D0.CANCELED  = 'N'
LEFT JOIN INV1 I1 WITH (NOLOCK)
    ON (I1.BaseEntry = D1.DocEntry AND I1.BaseLine = D1.LineNum AND I1.BaseType = 15)
    OR (I1.BaseEntry = T1.DocEntry AND I1.BaseLine = T1.LineNum AND I1.BaseType = 17)
LEFT JOIN OINV I0 WITH (NOLOCK)
    ON I1.DocEntry  = I0.DocEntry
   AND I0.CANCELED  = 'N'
WHERE T0.CANCELED = 'N'
  AND T0.DocDate BETWEEN @FromDate AND @ToDate
ORDER BY T0.DocDate DESC, T0.DocNum DESC, T1.LineNum;
```
