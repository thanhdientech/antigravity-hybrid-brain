Select t0.DocEntry, T0.CardCode, T0.SuppName, T0.DocDate, T1.ItemCode, T1.Quantity, T1.PriceFOB,
 T1.Currency, T1.Rate  ExRate , round (case when T1.Quantity=0 then 0 else T1.FobValue/ T1.Quantity end,0) as PriceVND, 
T1.Cost,   T1.PriceAtWH, T1.TtlExpndLC, T1.FobValue, T1.LineTotal  
 from IPF1 T1 with(nolock)  
 join OIPF T0 with(nolock) on T1.DocEntry = T0.DocEntry
 left join OINM T2 with(nolock) on T2.ItemCode = T1.Itemcode and T2.TransType = 69 
	and T2.BASE_REF = T1.DocEntry and T1.LineNum = T2.DocLineNum and T1.BaseEntry = 69
 where T0.DocDate between @StartDate and @EndDate and T1.BaseType = 20
and t0.canceled = 'N' 