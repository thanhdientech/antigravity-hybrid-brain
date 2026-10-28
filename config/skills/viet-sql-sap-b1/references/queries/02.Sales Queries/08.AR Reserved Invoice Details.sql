SELECT T0.[DocNum] as 'RINV NO.',T1.[LineNum]+1 AS 'RINV NO. Line'
,case when T0.DocStatus ='O' then  'Open'
	       when T0.DocStatus ='C' and T0.CANCELED ='Y' then 'Canceled'
		   ELSE 'Closed' end as DocSTATUS 


, T0.[DocDate], T0.[CardCode], T0.[CardName],T0.numatcard,T0.DocTotal as "Invoice Total",T0.PaidSum as "Paid amount",T0.PaidDpm as "Down payment", T1.[ItemCode], T1.[Dscription], T1.[Currency], T1.[Price], T1.[Quantity], T1.[OpenQty], T1.[TotalFrgn], T1.[LineTotal], T1.[AcctCode] 
FROM OINV T0  INNER JOIN INV1 T1 ON T0.[DocEntry] = T1.[DocEntry]
WHERE  t0.canceled = 'N' 
AND T0.UpdInvnt = 'C'
AND T0.CardCode like '%' + @CardCode + '%'
AND T0.DocDate >= @StartDate
AND T0.DocDate <= @EndDate
AND T0.DocStatus like '%'+@OPENorCLOSE + '%' 