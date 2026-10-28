SELECT  ISNULL(SUM(Quantity),0) AS LineTotal FROM
 (
 select 
t0.docdate
,t1.itemcode,t1.Quantity
from oign t0 
inner join ign1 t1 on t0.docentry=t1.docentry
inner join BEAS_FTHAUPT t2 on t1.U_belnrid = t2.BELNR_ID
where t1.U_belnrid is not null AND ISNULL(T1.U_posid,0) = 0
AND  T1.U_belnrid in (select belnr_id from BEAS_FTHAUPT where auftrag like '%'+@Order+'%')
and  t1.itemcode = @Itemcode
and  t0.DocDate = @DocDate
UNION ALL
 select 
t0.docdate
,t1.itemcode,-t1.Quantity
from oigE t0 
inner join igE1 t1 on t0.docentry=t1.docentry
inner join BEAS_FTHAUPT t2 on t1.U_belnrid = t2.BELNR_ID
where t1.U_belnrid is not null AND ISNULL(T1.U_posid,0) = 0
AND  T1.U_belnrid in (select belnr_id from BEAS_FTHAUPT where auftrag like '%'+@OrderA+'%')
and  t1.itemcode = @ItemcodeA
and  t0.DocDate = @DocDateA
)T
GROUP BY docdate,itemcode