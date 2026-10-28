Select T0.CardCode,  T0.CardName, T1.ItemCode, T2.ItemName,  T1.Price , isnull(T1.Currency,'VND') as Currency
 from OCRD T0  
 join ITM1 T1 with(nolock) on T1.PriceList = T0.ListNum
 left join OITM T2 with(nolock) on T1.ItemCode= T2.ItemCode
 where T1.Price <> 0 and T0.CardName like N'%[%0]%'  and T2.InvntItem = 'Y'
 and T0.CardType = 'C' and T0.GroupCode <>'104'
 Order By T0.CardCode,  T1.ItemCode