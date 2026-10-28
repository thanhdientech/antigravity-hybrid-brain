SELECT 
    T0.DocEntry,
    T0.CardCode,
    T0.SuppName,
    T0.DocDate,
    T1.ItemCode,
    T1.Quantity,
    T1.PriceFOB,
    T1.Currency,
    T1.Rate AS ExRate,
    ROUND(
        CASE 
            WHEN T1.Quantity = 0 THEN 0 
            ELSE T1.FobValue / T1.Quantity 
        END, 0
    ) AS PriceVND,
    T1.Cost,
    T1.PriceAtWH,
    T1.TtlExpndLC,
    T1.FobValue,
    T1.LineTotal
FROM IPF1 T1 WITH (NOLOCK)
JOIN OIPF T0 WITH (NOLOCK) 
    ON T1.DocEntry = T0.DocEntry
LEFT JOIN OINM T2 WITH (NOLOCK) 
    ON T2.ItemCode = T1.ItemCode 
    AND T2.TransType = 69 
    AND T2.BASE_REF = T1.DocEntry 
    AND T1.LineNum = T2.DocLineNum 
    AND T1.BaseEntry = 69
WHERE 
    T0.DocDate BETWEEN @StartDate AND @EndDate
    AND T1.BaseType = 20
    AND T0.Canceled = 'N'
