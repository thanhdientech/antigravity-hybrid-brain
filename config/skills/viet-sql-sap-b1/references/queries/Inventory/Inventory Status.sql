SELECT 
    T0.[ItemCode],
    T0.[ItemName],
    SUM(T1.[IsCommited])        AS [Committed Qty],
    SUM(T1.[OnOrder])           AS [On Order Qty],
    --T0.[TreeType],              -- 物料清单类型
    --T0.[TreeQty],               -- BOM 数量
    SUM(T1.[OnHand])           AS [On Hand Qty],
    T0.[InvntryUom],           -- 库存单位
    T0.[ReorderQty],          -- 补货点
    T0.[MinLevel],            -- 最低库存
    T0.[MaxLevel],            -- 最高库存
    T0.[InvntryUom]          -- 库存单位（再次列出）
FROM [dbo].[OITM] T0
INNER JOIN [dbo].[OITW] T1
    ON T1.[ItemCode] = T0.[ItemCode]
WHERE 
    T0.[ItemCode] >= @StartItem
    AND T0.[ItemCode] <= @EndItem
    AND T0.[InvntItem] = 'Y'
    
GROUP BY 
    T0.[ItemCode],
    T0.[ItemName],
    T0.[TreeType],
    T0.[TreeQty],
    T0.[InvntryUom],
    T0.[ReorderQty],
    T0.[MinLevel],
    T0.[MaxLevel],
    T0.[InvntryUom]
ORDER BY 
    T0.[ItemCode]
