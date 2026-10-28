Select  T0.DocEntry, T0.DocDate
, case when isnull(T0.FatherCard,'')='' then T7.CardCode
		   when isnull(T0.FatherType,'')='D' then T4.CardCode
				      else T0.CardCode end as  ShipTo
	, case when isnull(T0.FatherCard,'')='' then T7.CardName
		   when isnull(T0.FatherType,'')='D' then T4.CardName
				      else T0.CardName end as ShipName
	, case when isnull(T0.FatherCard,'')='' then T7.CardCode
		   when isnull(T0.FatherType,'')='P' then T4.CardCode
				      else T0.CardCode end as  BillToCode
	, case when isnull(T0.FatherCard,'')='' then T7.CardName
		   when isnull(T0.FatherType,'')='P' then T4.CardName
				      else T0.CardName end as BillToName
, T0.NumAtCard, T1.AcctCode as RevenueAct, T2.AcctName as RevenueActName, T0.CtlAccount as DebpAct, T3.AcctName as DebpActName
, T1.Itemcode, case when isnull(T1.Dscription,'')='' THEN T5.ItemName ELSE T1.Dscription END  AS Dscription, T1.Quantity
, case when left(T1.AcctCode,3) = '521' then -T1.PriceBefDi else T1.PriceBefDi end as OriginPrice 
, case when left(T1.AcctCode,3) = '521' then -T1.Quantity*T1.PriceBefDi else T1.Quantity*T1.PriceBefDi  end as AmtBeforeTax 
, T1.DiscPrcnt, T0.DocCur, T1.Rate
, case when left(T1.AcctCode,3) = '521' then -T1.LineTotal else T1.LineTotal end as LineTotal
, case when left(T1.AcctCode,3) = '521' then -(case when T0.DocCur <>'VND' then  T1.TotalFrgn else case when T1.Rate =0 then 0 else T1.LineTotal / T1.Rate end end ) 
	else (case when T0.DocCur <>'VND' then  T1.TotalFrgn else case when T1.Rate =0 then 0 else T1.LineTotal / T1.Rate end end) end as AmountFC
, T1.VatGroup , T1.VatPrcnt
, case when left(T1.AcctCode,3) = '521' then -T1.VatSum else T1.VatSum end as VatSum
, case when left(T1.AcctCode,3) = '521' then -T1.VatSumFrgn else T1.VatSumFrgn end as  VatSumFrgn
 , T1.OcrCode as Dept
 from INV1 T1 with(nolock) 
 join OINV T0 with(nolock) on t0.DocEntry = T1.DocEntry 
 left join OITM T5 with(nolock) on T1.ItemCode= T5.ItemCode
 left JOIN OACT T2 with(nolock) on T2.AcctCode= T1.AcctCode
 left JOIN OACT T3 with(nolock) on T3.AcctCode= T0.CtlAccount
 left join OCRD T4 with(nolock) on T4.CardCode = T0.FatherCard
 left join OCRD T7 with(nolock) on T7.CardCode = T0.CardCode
 where T0.DocDate between @StartDate and @EndDate and T0.CANCELED = 'N'
 
 
UNION ALL 
Select  T0.DocEntry, T0.DocDate
, case when isnull(T0.FatherCard,'')='' then T7.CardCode
		   when isnull(T0.FatherType,'')='D' then T4.CardCode
				      else T0.CardCode end as  ShipTo
	, case when isnull(T0.FatherCard,'')='' then T7.CardName
		   when isnull(T0.FatherType,'')='D' then T4.CardName
				      else T0.CardName end as ShipName
	, case when isnull(T0.FatherCard,'')='' then T7.CardCode
		   when isnull(T0.FatherType,'')='P' then T4.CardCode
				      else T0.CardCode end as  BillToCode
	, case when isnull(T0.FatherCard,'')='' then T7.CardName
		   when isnull(T0.FatherType,'')='P' then T4.CardName
				      else T0.CardName end as BillToName
, T0.NumAtCard, T1.AcctCode as RevenueAct, T2.AcctName as RevenueActName,  T0.CtlAccount as DebpAct, T3.AcctName as DebpActName
, T1.Itemcode, case when isnull(T1.Dscription,'')='' THEN T5.ItemName ELSE T1.Dscription END  AS Dscription, T1.Quantity
, case when left(T1.AcctCode,3) = '521' then - T1.PriceBefDi else T1.PriceBefDi end as OriginPrice 
, case when left(T1.AcctCode,3) = '521' then - T1.Quantity*T1.PriceBefDi else T1.Quantity*T1.PriceBefDi  end as AmtBeforeTax 
, T1.DiscPrcnt, T0.DocCur, T1.Rate
, case when left(T1.AcctCode,3) = '521' then -T1.LineTotal else T1.LineTotal end as LineTotal
, case when left(T1.AcctCode,3) = '521' then -(case when T0.DocCur <>'VND' then  T1.TotalFrgn else case when T1.Rate =0 then 0 else T1.LineTotal / T1.Rate end end ) 
	else (case when T0.DocCur <>'VND' then  T1.TotalFrgn else case when T1.Rate =0 then 0 else T1.LineTotal / T1.Rate end end) end as AmountFC
, T1.VatGroup , T1.VatPrcnt
, case when left(T1.AcctCode,3) = '521' then -T1.VatSum else T1.VatSum end as VatSum
, case when left(T1.AcctCode,3) = '521' then -T1.VatSumFrgn else T1.VatSumFrgn end as  VatSumFrgn
, T1.OcrCode as Dept
  from RIN1 T1 with(nolock) 
 join ORIN T0 with(nolock) on t0.DocEntry = T1.DocEntry
 left join OITM T5 with(nolock) on T1.ItemCode= T5.ItemCode
 left JOIN OACT T2 with(nolock) on T2.AcctCode= T1.AcctCode
 left JOIN OACT T3 with(nolock) on T3.AcctCode= T0.CtlAccount
 left join OCRD T4 with(nolock) on T4.CardCode = T0.FatherCard
  left join OCRD T7 with(nolock) on T7.CardCode = T0.CardCode
 where T0.DocDate between @StartDate and @EndDate and T0.CANCELED = 'N'
  order by t0.DocEntry