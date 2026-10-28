SELECT  'GRPO' AS 'Type',
	T0.DocNum AS 'Document Number',
	T0.DocStatus,
	T0.NumAtCard AS 'Invoice ID',
	T2.CardCode,
	T2.CardName,
	T3.City,
	T3.Country,
	CASE
	 WHEN T2.GroupCode = 101 THEN 'Vendor'
	 ELSE 'Customer'
	 END AS 'Customer Type',
	T1.ItemCode AS 'Product Code',
	T1.Dscription AS 'Product Name',
	T5.ItmsGrpNam AS 'Product Group',
	T1.WhsCode,
	T1.Quantity,
	T1.Currency,
	T1.Rate,
	T1.Price AS 'Price Before VAT',
	T1.VatGroup AS 'VAT',
	T1.PriceAfVAT AS 'Price After VAT',
	T1.DiscPrcnt AS 'Discount',
	CASE
			WHEN T1.Currency = 'VND' THEN (T1.LineTotal+ t1.VatSum)
			ELSE (T1.TotalFrgn + T1.VatSumFrgn)
		END as 'Total',
	T0.DocDate AS 'Document Date',
	Day(T0.DocDate) AS 'Day Document Date',
	Month(T0.DocDate) AS 'Month Document Date',
	year(T0.DocDate) AS 'Year Document Date',
	T0.PeyMethod AS 'Payment Method'
FROM OPDN T0
inner JOIN PDN1 T1 ON T0.DocEntry = T1.DocEntry
inner JOIN OCRD T2 ON T0.CardCode = T2.CardCode
left JOIN CRD1 T3 ON T2.CardCode = T3.CardCode  AND ISNULL(T0.ShipToCode,'') = ISNULL(T3.[Address],'')
inner JOIN OITM T4 ON T1.ItemCode = T4.ItemCode
inner JOIN OITB T5 ON T4.ItmsGrpCod = T5.ItmsGrpCod
WHERE T0.CANCELED = 'N'  and T0.DocDate  >= @FromDate and T0.DocDate   <= @ToDate
UNION
SELECT  'RNPO' AS 'Type',
	T0.DocNum AS 'Document Number',
	T0.DocStatus,
	T0.NumAtCard AS 'Invoice ID',
	T2.CardCode,
	T2.CardName,
	T3.City,
	T3.Country,
	CASE
	 WHEN T2.GroupCode = 101 THEN 'Vendor'
	 ELSE 'Customer'
	 END AS 'Customer Type',
	T1.ItemCode AS 'Product Code',
	T1.Dscription AS 'Product Name',
	T5.ItmsGrpNam AS 'Product Group',
	T1.WhsCode,
	(-T1.Quantity),
	T1.Currency,
	T1.Rate,
	T1.Price AS 'Price Before VAT',
	T1.VatGroup AS 'VAT',
	T1.PriceAfVAT AS 'Price After VAT',
	T1.DiscPrcnt AS 'Discount',
	CASE
			WHEN T1.Currency = 'VND' THEN -(T1.LineTotal+ t1.VatSum)
			ELSE -(T1.TotalFrgn + T1.VatSumFrgn)
		END as 'Total',
	T0.DocDate AS 'Document Date',
	Day(T0.DocDate) AS 'Day Document Date',
	Month(T0.DocDate) AS 'Month Document Date',
	year(T0.DocDate) AS 'Year Document Date',
	T0.PeyMethod AS 'Payment Method'
FROM ORPD T0
inner JOIN RPD1 T1 ON T0.DocEntry = T1.DocEntry
inner JOIN OCRD T2 ON T0.CardCode = T2.CardCode
left JOIN CRD1 T3 ON T2.CardCode = T3.CardCode  AND ISNULL(T0.ShipToCode,'') = ISNULL(T3.[Address],'')
inner JOIN OITM T4 ON T1.ItemCode = T4.ItemCode
inner JOIN OITB T5 ON T4.ItmsGrpCod = T5.ItmsGrpCod
WHERE T0.CANCELED = 'N'  and T0.DocDate  >= @FromDate and T0.DocDate   <= @ToDate
order by T0.DocDate