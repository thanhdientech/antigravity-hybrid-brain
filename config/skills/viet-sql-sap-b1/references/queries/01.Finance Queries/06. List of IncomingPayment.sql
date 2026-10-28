Select T0.DocDate ,T0.DocEntry ,T0.CardCode,T0.CardName,T0.BpAct as AcctCode, 0 as Debit,0 as FCDebit
		  , CASE WHEN ISNULL(T0.TrsfrAcct,'')='' THEN T0.CashAcct else T0.TrsfrAcct end as BankAcct
		 ,T0.NoDocSum as Credit, T0.NoDocSumFC as FCCredit, T0.JrnlMemo
                          ,  null Ref1, null Ref2, null as JEID , null as OriginalDoc,  N'Adv'  as DOcType
		 from ORCT T0 with(nolock) 
		 where T0.DocDate between  @StartDate and @EndDate  and isnull(T0.NoDocSum,0) <> 0 and T0.Canceled ='N'

		 union all  ---  payment on account
Select T0.DocDate,T0.DocEntry ,T0.CardCode,T0.CardName ,T3.Account as BpAcct, 0 as Debit, 0 as FCDebit
		 , CASE WHEN ISNULL(T0.TrsfrAcct,'')='' THEN T0.CashAcct else T0.TrsfrAcct end as BankAcct
		 ,T2.BfDcntSum as Credit , T2.AppliedFC as FCCredit, T0.JrnlMemo
                          , T1.Ref1, T1.Ref2, T1.TransId as JEID, T2.baseAbs as OriginalDoc
		 , case when T2.InvType = '30' then 'JE'
				when T2.InvType = '13' then 'AR'
				ELSE '' end as DOcType
		 from RCT2 T2 with(nolock)
		 join ORCT T0 with(nolock) on T0.DocEntry = T2.DocNum and T0.Canceled ='N'
		 join OJDT T1 with(nolock) on T1.TransID = T2.DocTransId
		 left join JDT1 T3 with(nolock) on T3.BaseRef =T2.DocNum and T3.ShortName = T0.CardCode and T3.TransType='24'
		 where T0.DocDate between  @StartDate and @EndDate
Order by DocEntry, DocDate