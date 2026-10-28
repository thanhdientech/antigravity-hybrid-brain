SELECT 
	T2.[ItemCode],
    T2.[ItemName],
    T0.[TransId],
    T0.[ApplyEntry],
    T0.[ApplyLine],
    T0.[ApplyType],
    -- 加上 Object Type Name
    CASE T0.[ApplyType]
        WHEN 59 THEN N'Goods Receipt'
        WHEN 60 THEN N'Goods Issue'
        WHEN 20 THEN N'GRPO'
        WHEN 21 THEN N'GRPO Return'
        WHEN 15 THEN N'Delivery'
        WHEN 16 THEN N'Return'
        WHEN 67 THEN N'Inventory Transfer'
        WHEN 202 THEN N'Production Order'
        WHEN 1470000113 THEN N'Purchase Request'
        WHEN 10000071 THEN N'Inventory Posting'
        WHEN 310000001 THEN N'Inventory Opening Balance'
        ELSE N'Other'
    END AS ObjTypeName,
    MIN(T0.[LogEntry])                 AS LogEntry,
    MIN(T0.[AppDocNum])               AS AppDocNum,
    MIN(T0.[DocDate])                 AS DocDate,
    T0.[LocCode]                      AS Warehouse,
    MIN(T0.[CardCode])               AS CardCode,
    MIN(T0.[CardName])               AS CardName,
    T1.[Quantity],
    T1.[AllocQty],
    T1.[OrderedQty],
    T0.[Instance],
    MIN(T4.[BinCode])                AS BinCode,
    MIN(T4.[SnBTransRptFirstBinViewBinCount]) AS BinCount,
    T5.[DistNumber]                  AS SerialNumber
FROM 
    [dbo].[OITL] T0
    INNER JOIN [dbo].[ITL1] T1
        ON T1.[LogEntry] = T0.[LogEntry]
    INNER JOIN [dbo].[OITM] T2
        ON T2.[ItemCode] = T0.[ItemCode]
    LEFT OUTER JOIN [dbo].[OCRD] T3
        ON T3.[CardCode] = T0.[CardCode]
    LEFT OUTER JOIN [dbo].[B1_SnBTransRptFirstBinView] T4
        ON T4.[ITLEntry] = T0.[LogEntry]
        AND T4.[SnBMDAbs] = T1.[MdAbsEntry]
    LEFT OUTER JOIN [dbo].[OSRN] T5
        ON T5.[AbsEntry] = T1.[MdAbsEntry]
WHERE 
    T0.[ManagedBy] = 10000045
    AND T0.[ItemCode] = @itemcode
    
    AND T2.[InvntItem] = 'Y'
    
    AND (
        T1.[Quantity] <> 0
        OR T1.[AllocQty] <> 0
        OR T1.[OrderedQty] <> 0
    )
    AND (
        (@SerialFrom IS NULL OR @SerialFrom = '' OR T5.[DistNumber] >= @SerialFrom)
		AND (@SerialTo IS NULL OR @SerialTo = '' OR T5.[DistNumber] <= @SerialTo)
    )
GROUP BY 
    T0.[TransId], 
    T0.[ApplyEntry], 
    T0.[ApplyLine], 
    T0.[ApplyType], 
    T0.[LocCode], 
    T0.[Instance], 
    T0.[LocType], 
    T2.[ItemCode],
    T2.[ItemName],
    T1.[Quantity],
    T1.[AllocQty],
    T1.[OrderedQty],
    T5.[DistNumber]
ORDER BY 
    T0.[TransId], 
    MIN(T0.[LogEntry]), 
    T5.[DistNumber]
