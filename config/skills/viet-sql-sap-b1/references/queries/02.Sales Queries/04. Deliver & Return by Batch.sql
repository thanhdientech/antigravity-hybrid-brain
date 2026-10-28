SELECT T0.DocEntry
,case when T0.DocStatus ='O' then  'Open'
	       when T0.DocStatus ='C' and T0.CANCELED ='Y' then 'Canceled'
		   ELSE 'Closed' end as DocSTATUS 
, T1.CardCode, T1.CardName, T1.DocDate , T1.ItemCode, T1.ItemName, T1.BatchNum, T1.Quantity, 'Delivery' as DocType
, case when T2.LineStatus ='O' then  'Open'
	       		   ELSE 'Closed' end as LineSTATUS
 FROM ODLN T0 
inner join DLN1 T2 on T0.Docentry = T2.Docentry
 join IBT1 T1  with(nolock) on T0.DocEntry = T1.BaseEntry 
 
 where T1.BaseType = 15 
AND isnull(T0.numatcard,'') like '%' + @Reference + '%'
AND T0.CardCode like '%' + @CardCode + '%'
AND isnull(t1.itemcode,'') like '%'+@ItemCode + '%' 
 and T1.DocDate between @StartDate  and  @EndDate  and T0.CANCELED = 'N'
 AND T2.LineStatus like '%'+@OPENorCLOSE + '%' 

union all 
SELECT T0.DocEntry
,case when T0.DocStatus ='O' then  'Open'
	       when T0.DocStatus ='C' and T0.CANCELED ='Y' then 'Canceled'
		   ELSE 'Closed' end as DocSTATUS 
, T1.CardCode, T1.CardName, T1.DocDate, T1.ItemCode, T1.ItemName, T1.BatchNum, -T1.Quantity,  'Return' as DocType
, case when T2.LineStatus ='O' then  'Open'
	       		   ELSE 'Closed' end as LineSTATUS
FROM ORDN T0 
inner join DLN1 T2 on T0.Docentry = T2.Docentry
join  IBT1 T1  with(nolock) on T0.DocEntry = T1.BaseEntry 
where T1.BaseType = 16 
AND T0.CANCELED = 'N' 
AND isnull(T0.numatcard,'') like '%' + @Reference + '%'
AND T0.CardCode like '%' + @CardCode + '%'
AND isnull(t1.itemcode,'') like '%'+@ItemCode + '%' 
and T1.DocDate between @StartDate  and @EndDate
AND T2.LineStatus like '%'+@OPENorCLOSE + '%' 
order by DocDate, DocEntry