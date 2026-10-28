Select T0.CardCode, T0.CardName, T0.CardFName, T2.GroupName, T0.LicTradNum, T0.DebPayAcct, T10.AcctName as AccountName, 
  T0.ListNum, T20.ListName, T0.FatherCard, T1.CardName as FatherCardName,  T1.CardFName as FatherCardFName,  T1.DebPayAcct as FatherAccount, 
  T1.LicTradNum as FatherCardTaxcode
  from OCRD T0 with(nolock)
  join OACT T10 with(nolock) on T10.AcctCode = T0.DebPayAcct
  left join OPLN T20 with(nolock) on T20.ListNum = T0.ListNum
  left join OCRD T1 with(nolock) on T1.CardCode = T0.FatherCard
  left join OCRG T2 with(nolock) on T2.GroupCode = T0.GroupCode 
  where T0.CardType = 'C'  and T0.GroupCode <> '104'