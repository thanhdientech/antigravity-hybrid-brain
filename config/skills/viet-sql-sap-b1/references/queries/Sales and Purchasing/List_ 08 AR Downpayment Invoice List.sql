SET ROWCOUNT 0;

SELECT 
    T0.DocNum AS [Downpayment DocNum],
    T0.DocDate AS [Doc Date],
    CASE 
        WHEN T0.DocStatus = 'O' THEN 'Open'
        WHEN T0.DocStatus = 'C' AND T0.CANCELED = 'Y' THEN 'Canceled'
        ELSE 'Closed'
    END AS [Doc Status],
    T0.CardCode,
    T0.CardName,
    T1.BaseRef AS [Sales Order],
    T2.DocTotalFC AS [SO Foreign Amount],
    T2.DocTotal AS [SO Total Local Amount],
    T0.DocTotal AS [Downpayment Amount],
    CAST( (T0.DocTotal / T2.DocTotal) * 100 AS DECIMAL(18,2)) AS [Downpayment Percent],
    (T2.DocTotal - T0.DocTotal) AS [Left Amount]
FROM ODPI T0
INNER JOIN DPI1 T1 ON T0.DocEntry = T1.DocEntry
INNER JOIN ORDR T2 ON T1.BaseRef = T2.DocNum
WHERE 
    T0.CANCELED = 'N'
    AND (
        @Reference IS NULL 
        OR @Reference = '' 
        OR T0.NumAtCard LIKE '%' + @Reference + '%'
    )
    AND (
        @CustomerCode IS NULL
        OR @CustomerCode = ''
        OR T0.CardCode LIKE '%' + @CustomerCode + '%'
    )
    AND T0.DocDate >= @StartDate
    AND T0.DocDate <= @EndDate
    AND (
        @OPENorCLOSE IS NULL 
        OR @OPENorCLOSE = '' 
        OR (@OPENorCLOSE = 'O' AND T0.DocStatus = 'O')
        OR (@OPENorCLOSE = 'C' AND T0.DocStatus = 'C')
    )
GROUP BY 
    T0.DocNum, T0.DocDate, T0.DocStatus, T0.CANCELED, T0.CardCode, T0.CardName, 
    T1.BaseRef, T2.DocTotalFC, T2.DocTotal, T0.DocTotal
ORDER BY 
    T0.DocNum