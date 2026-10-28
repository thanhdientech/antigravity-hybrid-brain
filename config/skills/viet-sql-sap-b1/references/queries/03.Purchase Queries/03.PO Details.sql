SELECT 
T0.[DocNum]
, T0.[DocDate]
, T0.[CardCode]
, T0.[CardName]
, T0.[NumAtCard]
, T0.[Comments]
, T1.[LineNum]+1 as 'Line'
, T1.[ItemCode]
, T1.[Dscription]
, T1.[Quantity]
, T1.[Openqty]
, T1.[ShipDate]
, T1.[Quantity] - T1.[OpenQty] as 'Delivery QTy'
, T1.[Price]
, T1.[Currency]
, T1.[Rate]
, T1.[TotalFrgn]
, T1.[LineTotal]
, T1.[VatGroup] 
, case when T0.DocStatus ='O' then  'Open'
	       when T0.DocStatus ='C' and T0.CANCELED ='Y' then 'Canceled'
		   ELSE 'Closed' end as DocSTATUS
, case when T1.LineStatus ='O' then  'Open'
	       		   ELSE 'Closed' end as LineSTATUS
FROM OPOR T0  INNER JOIN POR1 T1 ON T0.[DocEntry] = T1.[DocEntry]
WHERE  t0.canceled = 'N' 
AND isnull(T0.numatcard,'') like '%' + @Reference + '%'
AND T0.CardCode like '%' + @CardCode + '%'
AND isnull(t1.itemcode,'') like '%'+@ItemCode + '%' 
AND T0.DocDate >= @StartDate
AND T0.DocDate <= @EndDate
AND T1.LineStatus like '%'+@OPENorCLOSE + '%' 