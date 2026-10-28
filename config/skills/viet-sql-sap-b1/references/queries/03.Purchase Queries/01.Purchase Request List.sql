Select  T1.DocEntry, T1.DocDate, T1.ReqName,T1.DocCur,T0.LineVendor
,case when T1.DocStatus ='O' then  'Open'
	       when T1.DocStatus ='C' and T1.CANCELED ='Y' then 'Canceled'
		   ELSE 'Closed' end as DocSTATUS 
		 , T0.ItemCode, t0.Dscription,T0.Quantity, t0.Price, T0.LineTotal, T0.VatPrcnt,T0.VatSum,T0.LineTotal+T0.VatSum AS LineAfVAt
		 , T0.OcrCode, T3.PrcName
		 ,T2.USER_CODE, T2.U_NAME
		 , case when T1.DocStatus ='O' then  'Open'
	       when T1.DocStatus ='C' and T1.CANCELED ='Y' then 'Canceled'
		   ELSE 'Closed' end as STATUS
 From PRQ1 T0  with(nolock) 
 join OPRQ T1 WITH (NOLOCK) ON T1.DocEntry = T0.DocEntry
 left JOIN OUSR T2 with(nolock) on T2.USERID =T1.UserSign
 left join OPRC T3 with(nolock) on T3.PrcCode = T0.OcrCode
 where 
t1.canceled = 'N' 
And T1.ObjType ='1470000113'
and T0.DocDate between  @StartDate and @EndDate and T2.USER_CODE = @UserCode 
  Order by T0.DocEntry