SELECT T0.[DocNum]
,case when T0.DocStatus ='O' then  'Open'
	       when T0.DocStatus ='C' and T0.CANCELED ='Y' then 'Canceled'
		   ELSE 'Closed' end as DocSTATUS 
, T0.[CardCode]
, T0.[CardName]
, T0.[NumAtCard]
, t1.itemcode
, T1.[Dscription]
, T1.[Quantity]
, T1.[DelivrdQty] as 'Delivery Qty'
, T1.[Shipdate] as 'Del.Date'
, T1.[Price]
, T1.[Currency]
, T1.[Rate]
, T1.[TotalFrgn] as 'Frgn LineTotal'
, T1.[LineTotal] as 'Local Line Total'
, T1.[VATGROUP] 
, T1.Length1
, T1.Height1
, T1.Width1
, T1.Weight1 as 'Net weight'
, T1.Volume/T1.Quantity*T1.PackQty as 'Total Volume'
, T2.U_brgew as 'Gross Weight'
, case when T1.LineStatus ='O' then  'Open'
	       		   ELSE 'Closed' end as LineSTATUS

FROM ORDR T0  INNER JOIN RDR1 T1 ON T0.[DocEntry] = T1.[DocEntry]
INNER JOIN OITM T2 on T1.ITEMCODE = T2.ITEMCODE
WHERE  t0.canceled = 'N' 
AND  T0.[NumatCard] Like '%'+@Reference+'%'
AND  T0.[cardcode]  Like '%'+@CustomerCode+'%'
AND T0.DocDate >= @StartDate
AND T0.DocDate <= @EndDate
AND T1.LineStatus like '%'+@OPENorCLOSE + '%' 
