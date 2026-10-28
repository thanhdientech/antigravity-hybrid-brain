SELECT 

SUM(Gross)

FROM
(
	/* Invoices + Reserve Invoices */
	SELECT
	T3.DocDate,
	T1.ItemCode,
	T1.ItemName,
	T0.ItmsGrpCod,
	MAX(T0.ItmsGrpNam) AS 'Item Group',
	CASE WHEN T3.CANCELED = 'C' THEN -SUM(T2.Quantity) ELSE SUM(T2.Quantity) END AS 'Quantity',
	CASE WHEN T3.CANCELED = 'C' THEN -SUM(T2.LineTotal - T2.LineTotal * T3.DiscPrcnt / 100) ELSE SUM(T2.LineTotal - T2.LineTotal * T3.DiscPrcnt / 100) END AS 'Amount',
	CASE WHEN T3.CANCELED = 'C' THEN -SUM(T2.GrssProfit - T2.GrssProfit * T3.DiscPrcnt / 100) ELSE SUM(T2.GrssProfit - T2.GrssProfit * T3.DiscPrcnt / 100) END AS 'Gross'
	FROM OITB T0 WITH (NOLOCK)
	JOIN OITM T1 WITH (NOLOCK) ON T0.ItmsGrpCod = T1.ItmsGrpCod
	JOIN INV1 T2 WITH (NOLOCK) ON T1.ItemCode = T2.ItemCode
	JOIN OINV T3 WITH (NOLOCK) ON T2.DocEntry = T3.DocEntry
	WHERE 1=1
	AND T3.DocDate BETWEEN '2020-01-01' AND '2021-12-31'
	AND ISNULL(T2.BaseType,0) <> 203
	GROUP BY T3.DocDate, T1.ItemCode, T1.ItemName, T0.ItmsGrpCod, T3.CANCELED
	UNION ALL
	/* Credit Notes */
	SELECT 
	T3.DocDate,
	T1.ItemCode,
	T1.ItemName,
	T0.ItmsGrpCod,
	MAX(T0.ItmsGrpNam) AS 'Item Group',
	CASE WHEN T2.NoInvtryMv = 'Y' THEN 0 
	WHEN T3.CANCELED = 'C' THEN SUM(T2.Quantity) 
	ELSE -SUM(T2.Quantity) END AS 'Quantity',
	CASE WHEN T3.CANCELED = 'C' THEN SUM(T2.LineTotal - T2.LineTotal * T3.DiscPrcnt / 100) ELSE -SUM(T2.LineTotal - T2.LineTotal * T3.DiscPrcnt / 100) END AS 'Amount',
	CASE WHEN T3.CANCELED = 'C' THEN SUM(T2.GrssProfit - T2.GrssProfit * T3.DiscPrcnt / 100) ELSE -SUM(T2.GrssProfit - T2.GrssProfit * T3.DiscPrcnt / 100) END AS 'Gross'
	FROM OITB T0 WITH (NOLOCK)
	JOIN OITM T1 WITH (NOLOCK) ON T0.ItmsGrpCod = T1.ItmsGrpCod
	JOIN RIN1 T2 WITH (NOLOCK) ON T1.ItemCode = T2.ItemCode
	JOIN ORIN T3 WITH (NOLOCK) ON T2.DocEntry = T3.DocEntry
	WHERE 1=1
	AND T3.DocDate BETWEEN '2020-01-01' AND '2021-12-31'
	AND ISNULL(T2.BaseType,0) <> 203
	GROUP BY T3.DocDate, T1.ItemCode, T1.ItemName, T0.ItmsGrpCod, T2.NoInvtryMv, T3.CANCELED
) DATA
where 
[ItemCode] like '%'+@Itemcode+'%'
and [Item Group] like '%'+@ITG+'%'
GROUP BY ItemCode, ItemName, ItmsGrpCod