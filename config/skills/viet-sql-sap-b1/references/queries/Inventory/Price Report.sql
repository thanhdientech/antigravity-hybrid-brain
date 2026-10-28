-- =====================================
-- Main Price List Query with Conditions
-- =====================================
SELECT 
    T0.[ListNum],
    T0.[ListName],
    T1.[ItemCode],
    T2.[ItemName],
    T1.[BasePLNum],
    T1.[Factor],
    T1.[Price],
    T1.[Currency],
    T1.[AddPrice1],
    T1.[Currency1],
    T1.[AddPrice2],
    T1.[Currency2],
    T1.[UomEntry],
    T0.[ValidFor],
    T0.[ValidFrom],
    T0.[ValidTo],
    COALESCE(T2.[IUoMEntry], -1)     AS IUoMEntry,
    COALESCE(T2.[PriceUnit], -1)     AS PriceUnit,
    T0.[GroupCode],
    T1.[Ovrwritten],
    T1.[Ovrwrite1],
    T1.[Ovrwrite2],
    N'Y'                             AS AutoUpdate
FROM [dbo].[OPLN] T0
    INNER JOIN [dbo].[ITM1] T1 ON T1.[PriceList] = T0.[ListNum]
    INNER JOIN [dbo].[OITM] T2 ON T2.[ItemCode] = T1.[ItemCode]
WHERE 
    T0.[ValidFor] = 'Y'
    AND (@PRICELIST = '' OR T0.[ListNum] = @PRICELIST)
    AND (@FromItem = '' OR T1.[ItemCode] >= @FromItem)
    AND (@ToItem = '' OR T1.[ItemCode] <= @ToItem)

UNION ALL

-- =====================================
-- Alternative Price List Query
-- =====================================
SELECT 
    T0.[PriceList],
    T1.[ListName],
    T0.[ItemCode],
    T2.[ItemName],
    T3.[BasePLNum],
    T3.[Factor],
    T0.[Price],
    T0.[Currency],
    T0.[AddPrice1],
    T0.[Currency1],
    T0.[AddPrice2],
    T0.[Currency2],
    T0.[UomEntry],
    T1.[ValidFor],
    T1.[ValidFrom],
    T1.[ValidTo],
    COALESCE(T2.[IUoMEntry], -1)     AS IUoMEntry,
    COALESCE(T2.[PriceUnit], -1)     AS PriceUnit,
    T1.[GroupCode],
    COALESCE(T3.[Ovrwritten], N'N'),
    COALESCE(T3.[Ovrwrite1], N'N'),
    COALESCE(T3.[Ovrwrite2], N'N'),
    T0.[AutoUpdate]
FROM [dbo].[ITM9] T0
    LEFT JOIN [dbo].[OPLN] T1 ON T1.[ListNum] = T0.[PriceList]
    INNER JOIN [dbo].[OITM] T2 ON T2.[ItemCode] = T0.[ItemCode]
    LEFT JOIN [dbo].[ITM1] T3 ON T3.[ItemCode] = T0.[ItemCode] AND T3.[PriceList] = T0.[PriceList]
WHERE 
    (T1.[ValidFor] = 'Y' OR T1.[ValidFor] IS NULL)
    AND (@PRICELIST = '' OR T0.[PriceList] = @PRICELIST)
    AND (@FromItem = '' OR T0.[ItemCode] >= @FromItem)
    AND (@ToItem = '' OR T0.[ItemCode] <= @ToItem)

UNION ALL

-- =====================================
-- Last Purchase Price
-- =====================================
SELECT DISTINCT 
    -1                            AS ListNum,
    N'Last Purchase Price'        AS ListName,
    T0.[ItemCode],
    T0.[ItemName],
    -1                            AS BasePLNum,
    1.000000                      AS Factor,
    T0.[LastPurPrc]              AS Price,
    T0.[LastPurCur]             AS Currency,
    0                             AS AddPrice1,
    N''                          AS Currency1,
    0                             AS AddPrice2,
    N''                          AS Currency2,
    COALESCE(T0.[IUoMEntry], -1) AS UomEntry,
    N''                          AS ValidFor,
    CONVERT(DATETIME, '19000101', 112) AS ValidFrom,
    CONVERT(DATETIME, '19000101', 112) AS ValidTo,
    COALESCE(T0.[IUoMEntry], -1) AS IUoMEntry,
    COALESCE(T0.[PriceUnit], -1) AS PriceUnit,
    0                             AS GroupCode,
    N'N'                          AS Ovrwritten,
    N'N'                          AS Ovrwrite1,
    N'N'                          AS Ovrwrite2,
    N'Y'                          AS AutoUpdate
FROM [dbo].[OITM] T0
WHERE 
    (@FromItem = '' OR T0.[ItemCode] >= @FromItem)
    AND (@ToItem = '' OR T0.[ItemCode] <= @ToItem)

UNION ALL

-- =====================================
-- Last Evaluated Price
-- =====================================
SELECT DISTINCT 
    -2                            AS ListNum,
    N'Last Evaluated Price'      AS ListName,
    T0.[ItemCode],
    T0.[ItemName],
    -2                            AS BasePLNum,
    1.000000                      AS Factor,
    T0.[LstEvlPric]             AS Price,
    N'VND'                      AS Currency,
    0                             AS AddPrice1,
    N''                          AS Currency1,
    0                             AS AddPrice2,
    N''                          AS Currency2,
    COALESCE(T0.[IUoMEntry], -1) AS UomEntry,
    N''                          AS ValidFor,
    CONVERT(DATETIME, '19000101', 112) AS ValidFrom,
    CONVERT(DATETIME, '19000101', 112) AS ValidTo,
    COALESCE(T0.[IUoMEntry], -1) AS IUoMEntry,
    COALESCE(T0.[PriceUnit], -1) AS PriceUnit,
    0                             AS GroupCode,
    N'N'                          AS Ovrwritten,
    N'N'                          AS Ovrwrite1,
    N'N'                          AS Ovrwrite2,
    N'Y'                          AS AutoUpdate
FROM [dbo].[OITM] T0
WHERE 
    (@FromItem = '' OR T0.[ItemCode] >= @FromItem)
    AND (@ToItem = '' OR T0.[ItemCode] <= @ToItem)
