SELECT 
    T0.[ItemCode], 
    T0.[ItemName], 
    T0.[SuppCatNum], 
    T0.[OnHand], 
    T0.[LstEvlPric], 
    T0.[LastPurPrc], 
    T0.[LastPurCur], 
    T0.[InvntryUom], 
    T0.[CodeBars], 
    T0.[ItmsGrpCod], 
    T0.[SerialNum], 
    T0.[FirmCode], 
    T0.[PrdStdCst], 
    T0.[InCostRoll], 
    T0.[LinkRsc], 

    T1.[Price]  AS [PriceList1],  T1.[Currency]  AS [Currency1],
    T2.[Price]  AS [PriceList2],  T2.[Currency]  AS [Currency2],
    T3.[Price]  AS [PriceList3],  T3.[Currency]  AS [Currency3],
    T4.[Price]  AS [PriceList4],  T4.[Currency]  AS [Currency4],
    T5.[Price]  AS [PriceList5],  T5.[Currency]  AS [Currency5],
    T6.[Price]  AS [PriceList6],  T6.[Currency]  AS [Currency6],
    T7.[Price]  AS [PriceList7],  T7.[Currency]  AS [Currency7],
    T8.[Price]  AS [PriceList8],  T8.[Currency]  AS [Currency8],
    T9.[Price]  AS [PriceList9],  T9.[Currency]  AS [Currency9],
    T10.[Price] AS [PriceList10], T10.[Currency] AS [Currency10]

FROM [dbo].[OITM] T0

LEFT OUTER JOIN [dbo].[B1_ItemPriceView] T1  
    ON T1.[ItemCode] = T0.[ItemCode] AND T1.[PriceList] = 1 AND T1.[UomEntry] = T0.[IUoMEntry]
LEFT OUTER JOIN [dbo].[B1_ItemPriceView] T2  
    ON T2.[ItemCode] = T0.[ItemCode] AND T2.[PriceList] = 2 AND T2.[UomEntry] = T0.[IUoMEntry]
LEFT OUTER JOIN [dbo].[B1_ItemPriceView] T3  
    ON T3.[ItemCode] = T0.[ItemCode] AND T3.[PriceList] = 3 AND T3.[UomEntry] = T0.[IUoMEntry]
LEFT OUTER JOIN [dbo].[B1_ItemPriceView] T4  
    ON T4.[ItemCode] = T0.[ItemCode] AND T4.[PriceList] = 4 AND T4.[UomEntry] = T0.[IUoMEntry]
LEFT OUTER JOIN [dbo].[B1_ItemPriceView] T5  
    ON T5.[ItemCode] = T0.[ItemCode] AND T5.[PriceList] = 5 AND T5.[UomEntry] = T0.[IUoMEntry]
LEFT OUTER JOIN [dbo].[B1_ItemPriceView] T6  
    ON T6.[ItemCode] = T0.[ItemCode] AND T6.[PriceList] = 6 AND T6.[UomEntry] = T0.[IUoMEntry]
LEFT OUTER JOIN [dbo].[B1_ItemPriceView] T7  
    ON T7.[ItemCode] = T0.[ItemCode] AND T7.[PriceList] = 7 AND T7.[UomEntry] = T0.[IUoMEntry]
LEFT OUTER JOIN [dbo].[B1_ItemPriceView] T8  
    ON T8.[ItemCode] = T0.[ItemCode] AND T8.[PriceList] = 8 AND T8.[UomEntry] = T0.[IUoMEntry]
LEFT OUTER JOIN [dbo].[B1_ItemPriceView] T9  
    ON T9.[ItemCode] = T0.[ItemCode] AND T9.[PriceList] = 9 AND T9.[UomEntry] = T0.[IUoMEntry]
LEFT OUTER JOIN [dbo].[B1_ItemPriceView] T10 
    ON T10.[ItemCode] = T0.[ItemCode] AND T10.[PriceList] = 10 AND T10.[UomEntry] = T0.[IUoMEntry]

WHERE 
    T0.[ItemCode] >= @Sitemcode
    AND T0.[ItemCode] <= @EItemcode

ORDER BY 
    T0.[ItemCode];
