SELECT a.docdate as 'Date', c2.DocNum as SO_Number,  a.CardName, a.DocEntry as 'DE_No', c.ShipDate as 'Promised Date', 
a.DocDate as 'Actual Dispatch Date', case when a.DocDate > c.ShipDate then 'Late pickup'
	else '1 - On time/early dispatch' end as 'DIFOT.', c.VisOrder + 1 as SO_Line, 
b.ItemCode, b.Dscription, b.quantity
FROM ODLN a with(nolock) join DLN1 b with(nolock) on a.DocEntry = b.DocEntry
left join rdr1 c with(nolock) on c.DocEntry = b.BaseEntry and c.LineNum = b.BaseLine and b.BaseType = 17 and c.ItemCode = b.ItemCode 
left join ordr c2 with(nolock) on c2.DocEntry = c.DocEntry
left join OITM d with(nolock) on d.ItemCode = c.ItemCode
where a.CANCELED = 'N' and a.DocDate between [%0] and [%1]
order by a.DocEntry