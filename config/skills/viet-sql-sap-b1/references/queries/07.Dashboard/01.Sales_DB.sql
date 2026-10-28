SELECT 'DN' AS 'Type',
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
	(T1.LineTotal+ t1.VatSum) AS 'Total',
	T0.DocDate AS 'Document Date',
	Day(T0.DocDate) AS 'Day Document Date',
	Month(T0.DocDate) AS 'Month Document Date',
	year(T0.DocDate) AS 'Year Document Date',
	T0.PeyMethod AS 'Payment Method'
FROM ODLN T0 INNER JOIN DLN1 T1 ON T0.DocEntry = T1.DocEntry
INNER JOIN OCRD T2 ON T0.CardCode = T2.CardCode
LEFT JOIN CRD1 T3 ON T0.CardCode = T3.CardCode AND ISNULL(T0.ShipToCode,'') = ISNULL(T3.[Address],'')
INNER JOIN OITM T4 ON T1.ItemCode = T4.ItemCode
INNER JOIN OITB T5 ON T4.ItmsGrpCod = T5.ItmsGrpCod
WHERE T0.CANCELED = 'N'  and T0.DocDate  >= @FromDate and T0.DocDate  <= @ToDate

UNION

select 'DRN' AS 'Type',
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
	-(T1.LineTotal+ t1.VatSum) AS 'Total',
	T0.DocDate AS 'Document Date',
	Day(T0.DocDate) AS 'Day Document Date',
	Month(T0.DocDate) AS 'Month Document Date',
	year(T0.DocDate) AS 'Year Document Date',
	T0.PeyMethod AS 'Payment Method'
FROM ORDN T0 INNER JOIN RDN1 T1 ON T0.DocEntry = T1.DocEntry
INNER JOIN OCRD T2 ON T0.CardCode = T2.CardCode
LEFT JOIN CRD1 T3 ON T0.CardCode = T3.CardCode AND ISNULL(T0.ShipToCode,'') = ISNULL(T3.[Address],'')
INNER JOIN OITM T4 ON T1.ItemCode = T4.ItemCode
INNER JOIN OITB T5 ON T4.ItmsGrpCod = T5.ItmsGrpCod
WHERE T0.CANCELED = 'N'  and T0.DocDate  >= @FromDate and T0.DocDate  <= @ToDate
order by T0.Docnum