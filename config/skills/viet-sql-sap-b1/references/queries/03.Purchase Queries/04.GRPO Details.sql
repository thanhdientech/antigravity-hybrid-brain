SELECT T0.[DocNum] as 'GRPO.',T1.[LineNum]+1 AS 'GRPO Line' , case when T0.DocStatus ='O' then  'Open'
	       when T0.DocStatus ='C' and T0.CANCELED ='Y' then 'Canceled'
		   ELSE 'Closed' end as DocSTATUS, T0.[DocDate], T0.[CardCode], T0.[CardName],T0.numatcard,
T0.[Comments],
T1.[BaseEntry] as 'PO', T1.[BaseLine]+1 as 'PO Line', T1.[ItemCode], T1.[Dscription], T1.[Currency], T1.[Price], T1.[Quantity], T1.[OpenQty], T1.[TotalFrgn], T1.[LineTotal], T1.[AcctCode] 

, case when T1.LineStatus ='O' then  'Open'
	       		   ELSE 'Closed' end as LineSTATUS
FROM OPDN T0  INNER JOIN PDN1 T1 ON T0.[DocEntry] = T1.[DocEntry]
WHERE  t0.canceled = 'N' 
AND isnull(T0.numatcard,'') like '%' + @Reference + '%'
AND T0.CardCode like '%' + @CardCode + '%'
AND T1.Itemcode like '%' + @ItemCode + '%'
AND T0.DocDate >= @StartDate
AND T0.DocDate <= @EndDate
AND T1.LineStatus like '%'+@OPENorCLOSE + '%' 