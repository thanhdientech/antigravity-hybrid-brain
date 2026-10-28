SELECT T0.[DocNum] as 'DN NO.',T1.[LineNum]+1 AS 'DN Line' 
,case when T0.DocStatus ='O' then  'Open'
	       when T0.DocStatus ='C' and T0.CANCELED ='Y' then 'Canceled'
		   ELSE 'Closed' end as DocSTATUS 
, T0.[DocDate], T0.[CardCode], T0.[CardName],T2.numatcard,T1.[BaseEntry] as 'SO', T1.[BaseLine]+1 as 'SO Line', T1.[ItemCode], T1.[Dscription], T1.[Currency], T1.[Price], T1.[Quantity], T1.[OpenQty], T1.[TotalFrgn], T1.[LineTotal], T1.[AcctCode] 
, case when T1.LineStatus ='O' then  'Open'
	       		   ELSE 'Closed' end as LineSTATUS
FROM ODLN T0  INNER JOIN DLN1 T1 ON T0.[DocEntry] = T1.[DocEntry]
INNER JOIN ORDR T2 ON T1.BASEENTRY = T2.DOCENTRY
WHERE  t0.canceled = 'N' 
AND  T2.[NumatCard] Like '%' +@Reference+'%'
AND  T0.[cardcode]  Like '%' +@CustomerCode+'%'
AND  T0.[docdate] >= @StartDate
AND  T0.[docdate] <= @EndDate
AND T1.LineStatus like '%'+@OPENorCLOSE + '%' 