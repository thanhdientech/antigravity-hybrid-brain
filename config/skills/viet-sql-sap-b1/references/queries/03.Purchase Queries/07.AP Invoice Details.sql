Select T0.DocEntry, T0.DocDate, 
case when T0.DocStatus ='O' then  'Open'
	       when T0.DocStatus ='C' and T0.CANCELED ='Y' then 'Canceled'
		   ELSE 'Closed' end as DocSTATUS,

T0.CardCode, T0.CardName,T2.PrcName as Dept,T1.Itemcode, T1.Dscription, T1.Quantity,  T1.PriceBefDi as OriginPrice
	,  T1.Quantity*T1.PriceBefDi   as AmtBeforeTax , T1.DiscPrcnt, T0.DocCur, T1.Rate, T1.LineTotal, 
 case when T0.DocCur <>'VND' then  T1.TotalFrgn else case when T1.Rate =0 then 0 else T1.LineTotal / T1.Rate end end as AmountFC
 , T1.VatGroup , T1.VatPrcnt, T1.VatSum, T1.VatSumFrgn, T3.U_NAME


 from PCH1 T1 with(nolock) 
 join OPCH T0 with(nolock) on t0.DocEntry = T1.DocEntry
 left join OPRC T2 with (nolock) on T2.PrcCode = T1.OcrCode
 left join OUSR T3 with(nolock) on T3.USERID =T0.UserSign

WHERE  t0.canceled = 'N' 
AND T0.UpdInvnt = 'I'
AND isnull(T0.numatcard,'') like '%' + @Reference + '%'
AND T0.CardCode like '%' + @CardCode + '%'
AND isnull(t1.itemcode,'') like '%'+@ItemCode + '%' 
AND T0.DocDate >= @StartDate
AND T0.DocDate <= @EndDate
AND T0.DocStatus like '%'+@OPENorCLOSE + '%' 
Order By T0.DocEntry