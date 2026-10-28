Select T0.TransID,  T1.Account ,  T1.Debit,  T1.Credit , T1.FCDebit, T1.FCCredit,  T1.FCCurrency, T0.RefDate, T0.Memo
 from JDT1 T1 with(nolock) 
 join OJDT T0 with(nolock) on T1.TransID = T0.TransID
 where T1.Account like '11%' 
and T0.refdate between @StartDate and @EndDate
 Order By T1.TRansID