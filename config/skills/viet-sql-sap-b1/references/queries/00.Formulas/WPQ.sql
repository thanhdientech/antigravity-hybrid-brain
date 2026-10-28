select sum(t0.menge_verbrauch) from BEAS_FTPOS t0 inner join BEAS_FTHAUPT t1 on t0.BELNR_ID = t1.BELNR_ID
where t0.ABGKZ = 'N' 
and t0.itemcode =@Itemcode and t1.AUFTRAG like '%'+@Order+'%'
group by t0.itemcode