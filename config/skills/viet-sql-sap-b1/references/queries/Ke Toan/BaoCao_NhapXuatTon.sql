/* 
   Tieu De: Bao Cao Nhap Xuat Ton (Inventory Audit)
   Mo ta: Xem tong hop ton kho theo khoang thoi gian
*/

-- @Param: Tu Ngay | Type: DATETIME | Default: 20230101
DECLARE @FromDate DATETIME = '20230101'
-- @Param: Den Ngay | Type: DATETIME | Default: 20251231
DECLARE @ToDate   DATETIME = '20251231'

SELECT 
    T0.ItemCode,
    MAX(T1.ItemName) AS 'Ten_Hang',
    T0.Warehouse AS 'Kho',
    
    -- Ton Dau (Opening)
    CAST(SUM(CASE WHEN T0.DocDate < @FromDate THEN T0.InQty - T0.OutQty ELSE 0 END) AS DECIMAL(19, 2)) AS 'SL_Dau_Ky',

    -- Nhap (In)
    CAST(SUM(CASE WHEN T0.DocDate >= @FromDate AND T0.DocDate <= @ToDate THEN T0.InQty ELSE 0 END) AS DECIMAL(19, 2)) AS 'SL_Nhap',

    -- Xuat (Out)
    CAST(SUM(CASE WHEN T0.DocDate >= @FromDate AND T0.DocDate <= @ToDate THEN T0.OutQty ELSE 0 END) AS DECIMAL(19, 2)) AS 'SL_Xuat',

    -- Ton Cuoi (Closing)
    CAST(SUM(CASE WHEN T0.DocDate <= @ToDate THEN T0.InQty - T0.OutQty ELSE 0 END) AS DECIMAL(19, 2)) AS 'SL_Cuoi_Ky'

FROM OINM T0
INNER JOIN OITM T1 ON T0.ItemCode = T1.ItemCode
WHERE T0.DocDate <= @ToDate
GROUP BY T0.ItemCode, T0.Warehouse
HAVING 
       SUM(CASE WHEN T0.DocDate < @FromDate THEN T0.InQty - T0.OutQty ELSE 0 END) <> 0
    OR SUM(CASE WHEN T0.DocDate >= @FromDate AND T0.DocDate <= @ToDate THEN T0.InQty ELSE 0 END) <> 0
    OR SUM(CASE WHEN T0.DocDate >= @FromDate AND T0.DocDate <= @ToDate THEN T0.OutQty ELSE 0 END) <> 0
ORDER BY T0.ItemCode, T0.Warehouse;
