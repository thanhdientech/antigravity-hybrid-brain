SELECT
    T1.ItemCode AS [Item No.],
    T1.Dscription AS [Description],
    T0.DocNum AS [Doc No.],
    T0.CardCode AS [Customer Code],
    T0.DocDueDate AS [Delivery Date],
    T1.WhsCode AS [Whse],
    T1.unitMsr AS [Unit of Measure],
    T1.NumPerMsr AS [Items per Unit],
    T1.Quantity AS [Ordered],
    T1.DelivrdQty AS [Delivered],
    (T1.Quantity - T1.DelivrdQty) AS [Backorder]
FROM ORDR T0
INNER JOIN RDR1 T1 ON T0.DocEntry = T1.DocEntry
WHERE 
    T0.CANCELED = 'N'              -- 不显示已取消单
    AND T0.DocStatus = 'O'         -- 只抓「Open」订单
    AND (T1.Quantity - T1.DelivrdQty) > 0 -- 存在未交数量
And T0.DocDueDate >= @FromDate
AND T0.DocDueDate <= @ToDate
AND T0.CardCode BETWEEN @FromCustomer AND @ToCustomer
ORDER BY
    T1.ItemCode, T0.DocNum;

