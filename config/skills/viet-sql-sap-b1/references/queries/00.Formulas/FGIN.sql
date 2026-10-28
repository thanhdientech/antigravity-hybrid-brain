select 
sum(t1.Quantity)
from oign t0 
inner join ign1 t1 on t0.docentry=t1.docentry
inner join BEAS_FTHAUPT t2 on t1.U_belnrid = t2.BELNR_ID
where t1.U_belnrid is not null and t1.itemcode = @Itemcode and  t0.DocDate= @DocDate
group by t1.itemcode,t0.docdate