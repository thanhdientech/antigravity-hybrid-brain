Select T.DocEntry,T.DocDate,T. DoccumentDate,T.DocDueDate,T.CardCode, T.CardName,T.InvoiceNo
	,T.Comments, T.CtlAccount,T.AcctName, T.DocCur, T.DocTotal,T. Paid,T.RemainAmt
	, T.DocTotalFC ,T.PaidFC, T.RemainAmtFC, T. CreateName, T.DocStatus,  T.Overduedate
FROM 
(
select Distinct T0.DocEntry,T0.DocDate,T0.TaxDate as DoccumentDate,T0.DocDueDate,T0.CardCode, T0.CardName,T0.NumAtCard as InvoiceNo
	,T0.Comments, T0.CtlAccount,T2.AcctName, T0.DocCur, T0.DocTotal,T0.Paidsum as Paid,  (T0.Doctotal - T0.Paidsum) as RemainAmt
	, T0.DocTotalFC ,T0.PaidSumFc as PaidFC, (T0.DocTotalFC-T0.PaidSumFc) as RemainAmtFC, T3.U_NAME as CreateName, T0.DocStatus
             , DATEDIFF(d,T0.DocDueDate,@DueDate) as Overduedate
 FROM OINV T0 with(nolock)
 left JOIN INV1 t1 with(nolock) on T1.Docentry= T0.dOCENTRY
 left JOIN OACT T2 with(nolock) on T2.AcctCode = T0.CtlAccount
 left join OUSR T3 with (nolock) on T3.USERID = T0.UserSign
 left join OCTG T30 with (nolock) on T30.GroupNum =T0.GroupNum
 left join OCRD T4 with (nolock) on T4.CardCode = T0.CardCode
 where T0.DocDate between @StartDate and @EndDate and T0.CANCELED = 'N' and T0.DocStatus ='O'
group by T0.DocEntry, T0.DocDate,T0.TaxDate, T0.CardCode, T0.CardName, T0.NumAtCard,T0.Comments,T0.CtlAccount,T2.AcctName
			, T0.DocCur, T0.DocTotal,T0.Paidsum, T0.DocTotalFC ,T0.PaidSumFc, T3.U_NAME, T0.DocStatus,T0.DocDueDate,T30.ExtraDays
			,T30.ExtraMonth)T
order by T.DocDate, T.Docentry