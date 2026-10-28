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
		T0.comments,
    T1.ItemCode,
    T1.[Dscription],
    T0.DocDueDate,
    T1.[Quantity],
    CASE 
        WHEN T1.unitMsr IS NULL OR T1.unitMsr = '' THEN T1.unitMsr2
        ELSE T1.unitMsr 
    END AS UnitMsr,
	t1.InvQty,
    T1.unitMsr2,
    T1.[DelivrdQty] AS [Delivery Qty],
    T1.[Price],
    T1.[Currency],
    T1.[Rate],
    T1.[TotalFrgn] AS [Frgn LineTotal],
    T1.[LineTotal] AS [Local Line Total],
    T1.[VatGroup],
		T1.WhsCode,
	T1.openqty,
	CASE 
        WHEN T1.BaseType = 1470000113 THEN 'From PR'
		When T1.BaseType = -1 THEN 'Manual Entry'
        ELSE 'Others'
    END AS SourceType,
	t1.BaseDocNum,
	t1.BaseLine,
	t1.BaseOpnQty,
	
    CASE 
        WHEN T1.LineStatus = 'O' THEN 'Open'
        ELSE 'Closed' 
    END AS LineStatus
FROM OPOR T0  
INNER JOIN POR1 T1 ON T0.[DocEntry] = T1.[DocEntry]
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


	select * from POR1
