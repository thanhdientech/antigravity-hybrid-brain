SELECT TOP 100 
    [Price], 
    [Currency], 
    [DocDate], 
    [ObjType],
    CASE [ObjType]
        WHEN 18 THEN 'A/P Invoice'
        WHEN 19 THEN 'A/P Credit Memo'
        WHEN 20 THEN 'Goods Receipt PO'
        WHEN 21 THEN 'Goods Return'
        WHEN 22 THEN 'Purchase Order'
        WHEN 540000006 THEN 'Purchase Quotation'
        ELSE 'Other'
    END AS ObjTypeName,
    [DocNum], 
    [VisOrder], 
    [DocEntry], 
    [Quantity], 
    [CardCode], 
    [unitMsr], 
    [TaxOnly], 
    [PriceBefDi], 
    [DiscPrcnt], 
    [CANCELED], 
    [GPBefDisc], 
    [PriceAfVAT]
FROM 
(
    SELECT T0.[DocEntry], T0.[DocNum], T0.[DocDate], T0.[ObjType], T0.[CardCode], 
           T1.[Price], T1.[Currency], T1.[VisOrder], T1.[Quantity], T1.[unitMsr], 
           T1.[TaxOnly], T1.[PriceBefDi], T1.[DiscPrcnt], T0.[CANCELED], 
           T1.[GPBefDisc], T1.[PriceAfVAT]
    FROM [dbo].[OPCH] T0 INNER JOIN [dbo].[PCH1] T1 ON T1.[DocEntry] = T0.[DocEntry]
    WHERE T1.[ItemCode] = @ItemCode

    UNION ALL

    SELECT T0.[DocEntry], T0.[DocNum], T0.[DocDate], T0.[ObjType], T0.[CardCode], 
           T1.[Price], T1.[Currency], T1.[VisOrder], T1.[Quantity], T1.[unitMsr], 
           T1.[TaxOnly], T1.[PriceBefDi], T1.[DiscPrcnt], T0.[CANCELED], 
           T1.[GPBefDisc], T1.[PriceAfVAT]
    FROM [dbo].[OPDN] T0 INNER JOIN [dbo].[PDN1] T1 ON T1.[DocEntry] = T0.[DocEntry]
    WHERE T1.[ItemCode] = @ItemCode

    UNION ALL

    SELECT T0.[DocEntry], T0.[DocNum], T0.[DocDate], T0.[ObjType], T0.[CardCode], 
           T1.[Price], T1.[Currency], T1.[VisOrder], T1.[Quantity], T1.[unitMsr], 
           T1.[TaxOnly], T1.[PriceBefDi], T1.[DiscPrcnt], T0.[CANCELED], 
           T1.[GPBefDisc], T1.[PriceAfVAT]
    FROM [dbo].[OPOR] T0 INNER JOIN [dbo].[POR1] T1 ON T1.[DocEntry] = T0.[DocEntry]
    WHERE T1.[ItemCode] = @ItemCode

    UNION ALL

    SELECT T0.[DocEntry], T0.[DocNum], T0.[DocDate], T0.[ObjType], T0.[CardCode], 
           T1.[Price], T1.[Currency], T1.[VisOrder], T1.[Quantity], T1.[unitMsr], 
           T1.[TaxOnly], T1.[PriceBefDi], T1.[DiscPrcnt], T0.[CANCELED], 
           T1.[GPBefDisc], T1.[PriceAfVAT]
    FROM [dbo].[ORPD] T0 INNER JOIN [dbo].[RPD1] T1 ON T1.[DocEntry] = T0.[DocEntry]
    WHERE T1.[ItemCode] = @ItemCode

    UNION ALL

    SELECT T0.[DocEntry], T0.[DocNum], T0.[DocDate], T0.[ObjType], T0.[CardCode], 
           T1.[Price], T1.[Currency], T1.[VisOrder], T1.[Quantity], T1.[unitMsr], 
           T1.[TaxOnly], T1.[PriceBefDi], T1.[DiscPrcnt], T0.[CANCELED], 
           T1.[GPBefDisc], T1.[PriceAfVAT]
    FROM [dbo].[ORPC] T0 INNER JOIN [dbo].[RPC1] T1 ON T1.[DocEntry] = T0.[DocEntry]
    WHERE T1.[ItemCode] = @ItemCode

    UNION ALL

    SELECT T0.[DocEntry], T0.[DocNum], T0.[DocDate], T0.[ObjType], T0.[CardCode], 
           T1.[Price], T1.[Currency], T1.[VisOrder], T1.[Quantity], T1.[unitMsr], 
           T1.[TaxOnly], T1.[PriceBefDi], T1.[DiscPrcnt], T0.[CANCELED], 
           T1.[GPBefDisc], T1.[PriceAfVAT]
    FROM [dbo].[OPQT] T0 INNER JOIN [dbo].[PQT1] T1 ON T1.[DocEntry] = T0.[DocEntry]
    WHERE T1.[ItemCode] = @ItemCode

) AS AllDocs
ORDER BY 
    DocDate DESC,
    DocNum DESC,
    VisOrder
