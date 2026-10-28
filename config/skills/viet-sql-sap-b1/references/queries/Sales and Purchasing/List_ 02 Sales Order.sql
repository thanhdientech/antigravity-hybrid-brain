SET ROWCOUNT 0;
SELECT 
    T0.[DocNum],
    CASE 
        WHEN T0.DocStatus = 'O' THEN 'Open'
        WHEN T0.DocStatus = 'C' AND T0.CANCELED = 'Y' THEN 'Canceled'
        ELSE 'Closed' 
    END AS DocStatus,
    T0.[CardCode],
    T0.[CardName],
    T0.[NumAtCard],
    T1.ItemCode,
    T1.[Dscription],
    T0.DocDueDate,
    T1.[Quantity],
    CASE 
        WHEN T1.unitMsr IS NULL OR T1.unitMsr = '' THEN T1.unitMsr2
        ELSE T1.unitMsr 
    END AS UnitMsr,
    T1.unitMsr2,
    T1.[DelivrdQty] AS [Delivery Qty],
    T1.[Price],
    T1.[Currency],
    T1.[Rate],
    T1.[TotalFrgn] AS [Frgn LineTotal],
    T1.[LineTotal] AS [Local Line Total],
    T1.[VatGroup],
    T1.Length1,
    T1.Height1,
    T1.Width1,
    T1.Weight1 AS [Net Weight],
    CASE 
        WHEN T1.Volume IS NOT NULL AND T1.Quantity <> 0 
            THEN T1.Volume / T1.Quantity * T1.PackQty 
        ELSE NULL 
    END AS [Total Volume],
    T2.U_brgew AS [Gross Weight],
    CASE 
        WHEN T1.LineStatus = 'O' THEN 'Open'
        ELSE 'Closed' 
    END AS LineStatus
FROM ORDR T0  
INNER JOIN RDR1 T1 ON T0.[DocEntry] = T1.[DocEntry]
INNER JOIN OITM T2 ON T1.[ItemCode] = T2.[ItemCode]
WHERE 
    T0.CANCELED = 'N'
    AND (
        @Reference IS NULL 
        OR @Reference = '' 
        OR T0.[NumAtCard] LIKE '%' + @Reference + '%'
    )
    AND (
        @CustomerCode IS NULL
        OR @CustomerCode = ''
        OR T0.[CardCode] LIKE '%' + @CustomerCode + '%'
    )
    AND T0.DocDate >= @StartDate
    AND T0.DocDate <= @EndDate
    AND (
        @OPENorCLOSE IS NULL 
        OR @OPENorCLOSE = '' 
        OR (@OPENorCLOSE = 'O' AND T1.LineStatus = 'O')
        OR (@OPENorCLOSE = 'C' AND T1.LineStatus = 'C')
    )
ORDER BY 
    T0.[DocNum], T1.[LineNum]
