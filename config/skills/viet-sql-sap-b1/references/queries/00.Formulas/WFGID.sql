SELECT  ISNULL(SUM(Quantity),0) AS LineTotal FROM
 (
 select 
t0.docdate
,t1.itemcode,t1.Quantity
from oign t0 
inner join ign1 t1 on t0.docentry=t1.docentry
inner join BEAS_FTHAUPT t2 on t1.U_belnrid = t2.BELNR_ID
where t1.U_belnrid is not null AND ISNULL(T1.U_posid,0) = 0
and t1.u_belnrid=@belnr_id and t1.U_belposid = @belpos_id
and  t0.DocDate >= @StartDocDate
and  t0.DocDate <= @EndDocDate

UNION ALL
 select 
t0.docdate
,t1.itemcode,-t1.Quantity
from oigE t0 
inner join igE1 t1 on t0.docentry=t1.docentry
inner join BEAS_FTHAUPT t2 on t1.U_belnrid = t2.BELNR_ID
where t1.U_belnrid is not null AND ISNULL(T1.U_posid,0) = 0
and t1.u_belnrid=@belnr_idA and t1.U_belposid = @belpos_idA
and  t0.DocDate >= @StartDocDateA
and  t0.DocDate <= @EndDocDateA
)T