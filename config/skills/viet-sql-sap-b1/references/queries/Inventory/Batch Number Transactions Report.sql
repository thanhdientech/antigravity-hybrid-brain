SELECT 
    T0.ItemCode,
    T0.ItemName,
	T4.[DistNumber]      AS BatchNumber,
    T0.[TransId],
    T0.[ApplyEntry],
    T0.[ApplyLine],
    T0.[ApplyType],
    -- 根据 Object Type 显示名称
    CASE 
        WHEN T0.[ApplyType] = 13 THEN 'A/R Invoice'
        WHEN T0.[ApplyType] = 14 THEN 'A/R Credit Memo'
        WHEN T0.[ApplyType] = 15 THEN 'Delivery'
        WHEN T0.[ApplyType] = 16 THEN 'Return'
        WHEN T0.[ApplyType] = 17 THEN 'Sales Order'
        WHEN T0.[ApplyType] = 18 THEN 'A/P Invoice'
        WHEN T0.[ApplyType] = 19 THEN 'A/P Credit Memo'
        WHEN T0.[ApplyType] = 20 THEN 'Goods Receipt PO'
        WHEN T0.[ApplyType] = 21 THEN 'Goods Return'
        WHEN T0.[ApplyType] = 59 THEN 'Goods Receipt'
        WHEN T0.[ApplyType] = 60 THEN 'Goods Issue'
        WHEN T0.[ApplyType] = 67 THEN 'Inventory Transfer'
        WHEN T0.[ApplyType] = 310000001 THEN 'Inventory Opening Balance'
        ELSE 'Other'
    END AS ObjTypeName,
    T0.[LogEntry],
    T0.[AppDocNum],
    T0.[DocDate],
    T0.[LocCode]         AS 'WareHouse',
    T0.[CardCode],
    T0.[CardName],
    T1.[Quantity],
    T1.[AllocQty],
    T1.[OrderedQty],
    T0.[Instance]
    
FROM [dbo].[OITL] T0
    INNER JOIN [dbo].[ITL1] T1
        ON T1.[LogEntry] = T0.[LogEntry]
    INNER JOIN [dbo].[OITM] T2
        ON T2.[ItemCode] = T0.[ItemCode]
    LEFT OUTER JOIN [dbo].[OCRD] T3
        ON T3.[CardCode] = T0.[CardCode]
    LEFT OUTER JOIN [dbo].[OBTN] T4
        ON T4.[AbsEntry] = T1.[MdAbsEntry]
WHERE 
    T0.[ManagedBy] = 10000044
    AND T0.[ItemCode] = @Itemcode
    AND T2.[InvntItem] = 'Y'
    AND NOT EXISTS (
        SELECT U0.[DocEntry]
        FROM [dbo].[ORDR] U0
        WHERE 
            T0.[Instance] = 0
            AND T0.[ApplyEntry] = U0.[DocEntry]
            AND T0.[ApplyType] = U0.[ObjType]
            AND U0.[CANCELED] = 'Y'
    )
    AND (T1.[Quantity] <> 0 OR T1.[AllocQty] <> 0 OR T1.[OrderedQty] <> 0)
    AND (
        @BatchFrom = '' 
        OR @BatchTo = ''
        OR (T4.[DistNumber] BETWEEN @BatchFrom AND @BatchTo)
    )
ORDER BY 
    T0.[TransId], 
    T0.[LogEntry]
