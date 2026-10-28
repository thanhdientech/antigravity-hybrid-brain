select T0.DocEntry as 'PO No.', T0.DocDate, T0.CardCode, T0.CardName,T0.NumAtCard as InvoiceNo,T0.JrnlMemo,T0.CtlAccount,T2.AcctName, T0.DocCur
    , T5.PrcName as DeptName,T0.DocTotal,T0.Paidtodate as Paid, sum (T0.Doctotal - T0.Paidtodate) as RemainAmt, T0.DocRate
	, T0.DocTotalFC ,T0.PaidFC as PaidFC, sum(T0.DocTotalFC-T0.PaidFC) as RemainAmtFC
	, T3.U_NAME as CreateName
FROM OPOR t0 with(nolock)
 left JOIN POR1 t4 with(nolock) on T4.Docentry=T0.dOCENTRY
 left JOIN OACT T2 with(nolock) on T2.AcctCode = T0.CtlAccount
 left join OUSR T3 with (nolock) on T3.USERID = T0.UserSign
 left JOIN OPRC T5 with(nolock) on T5.PrcCode = T4.OcrCode 
 where
T0.CardCode like '%' +@SupplierCode+ '%' 
AND T0.CardName like '%' +@SupplierName+ '%' 
AND T0.DocDate between @StartDate and @EndDate and T0.CANCELED ='N'

 group by T0.DocEntry, T0.DocDate, T0.CardCode, T0.CardName, T0.DocCur, T0.DocTotal , T0.DocTotalFC,T5.PrcName, T3.U_NAME, T0.NumAtCard,T0.CtlAccount,T2.AcctName,T0.JrnlMemo,T0.Paidtodate,T0.PaidFc,T0.DocRate
 Order by T0.DocEntry