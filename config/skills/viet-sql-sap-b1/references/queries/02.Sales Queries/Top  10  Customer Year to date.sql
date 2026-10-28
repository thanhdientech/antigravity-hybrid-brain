SELECT 
TOP 10
MAX(Customer) AS BusinessPartnerName,
SUM(Quantity) AS 'Quantity',
SUM(QuantityPrevious) AS 'QuantityPrevious',
SUM(Amount) AS 'Amount' ,
SUM(AmountPrevious) AS 'AmountPrevious',
SUM(Gross) AS 'Gross' ,
SUM(GrossPrevious) AS 'GrossPrevious'
FROM
(
/*Invoice and Reserve Invoice*/
SELECT 
T0.CardCode,
MAX(T0.CardName) AS 'Customer',
COUNT(*) AS 'Quantity',
0 AS 'QuantityPrevious',
CASE T1.CANCELED WHEN 'C' THEN -SUM(T1.DocTotal-T1.VatSum+T1.DpmAmnt-T1.TotalExpns-T1.RoundDif) ELSE SUM(T1.DocTotal-T1.VatSum+T1.DpmAmnt-T1.TotalExpns-T1.RoundDif) END AS 'Amount',
0 AS 'AmountPrevious',
CASE T1.CANCELED WHEN 'C' THEN -SUM(T1.GrosProfit) ELSE SUM(T1.GrosProfit) END AS 'Gross',
0 AS 'GrossPrevious'
FROM OCRD T0 WITH (NOLOCK)
LEFT JOIN OINV T1 WITH (NOLOCK) ON T0.CardCode = T1.CardCode
WHERE T0.CardType = 'C'
AND T1.DocDate BETWEEN @CurrentStart AND @CurrentEnd
GROUP BY T0.CardCode, T1.CANCELED
UNION ALL
/*Credit Note*/
SELECT 
T0.CardCode,
MAX(T0.CardName) AS 'Customer',
COUNT(*) AS 'Quantity',
0 AS 'QuantityPrevious',
CASE T1.CANCELED WHEN 'C' THEN SUM(T1.DocTotal-T1.VatSum+T1.DpmAmnt-T1.TotalExpns-T1.RoundDif) ELSE -SUM(T1.DocTotal-T1.VatSum+T1.DpmAmnt-T1.TotalExpns-T1.RoundDif) END AS 'Amount',
0 AS 'AmountPrevious',
CASE T1.CANCELED WHEN 'C' THEN SUM(T1.GrosProfit) ELSE -SUM(T1.GrosProfit) END AS 'Gross',
0 AS 'GrossPrevious'
FROM OCRD T0 WITH (NOLOCK)
LEFT JOIN ORIN T1 WITH (NOLOCK) ON T0.CardCode = T1.CardCode
WHERE T0.CardType = 'C'
AND T1.DocDate BETWEEN @CurrentStart AND @CurrentEnd
AND NOT EXISTS (SELECT 1 FROM RIN1 TS1 WHERE TS1.DocEntry = T1.DocEntry AND TS1.BaseType = 203)
GROUP BY T0.CardCode, T1.CANCELED
UNION ALL
/*Invoice and Reserve Invoice [Previous]*/
SELECT 
T0.CardCode,
Max(T0.CardName) AS 'Customer',
0 AS 'Quantity',
COUNT(*) AS 'QuantityPrevious',
0 AS 'Amount',
CASE T1.CANCELED WHEN 'C' THEN -SUM(T1.DocTotal-T1.VatSum+T1.DpmAmnt-T1.TotalExpns-T1.RoundDif) ELSE SUM(T1.DocTotal-T1.VatSum+T1.DpmAmnt-T1.TotalExpns-T1.RoundDif) END AS 'AmountPrevious',
0 AS 'Gross',
CASE T1.CANCELED WHEN 'C' THEN -SUM(T1.GrosProfit) ELSE SUM(T1.GrosProfit) END AS 'GrossPrevious'
FROM OCRD T0 WITH (NOLOCK)
LEFT JOIN OINV T1 WITH (NOLOCK) ON T0.CardCode = T1.CardCode
WHERE T0.CardType = 'C'
AND T1.DocDate BETWEEN @PreviousStart AND @PreviousEnd
GROUP BY T0.CardCode, T1.CANCELED
UNION ALL
/*Credit Note [Previous]*/
SELECT 
T0.CardCode,
Max(T0.CardName) AS 'Customer',
0 AS 'Quantity',
COUNT(*) AS 'QuantityPrevious',
0 AS 'Amount',
CASE T1.CANCELED WHEN 'C' THEN SUM(T1.DocTotal-T1.VatSum+T1.DpmAmnt-T1.TotalExpns-T1.RoundDif) ELSE -SUM(T1.DocTotal-T1.VatSum+T1.DpmAmnt-T1.TotalExpns-T1.RoundDif) END AS 'AmountPrevious',
0 AS 'Gross',
CASE T1.CANCELED WHEN 'C' THEN SUM(T1.GrosProfit) ELSE -SUM(T1.GrosProfit) END AS 'GrossPrevious'
FROM OCRD T0 WITH (NOLOCK)
LEFT JOIN ORIN T1 WITH (NOLOCK) ON T0.CardCode = T1.CardCode
WHERE T0.CardType = 'C'
AND T1.DocDate BETWEEN @PreviousStart AND @PreviousEnd
AND NOT EXISTS (SELECT 1 FROM RIN1 TS1 WHERE TS1.DocEntry = T1.DocEntry AND TS1.BaseType = 203)
GROUP BY T0.CardCode, T1.CANCELED) DATA
GROUP BY CardCode
ORDER BY Amount DESC