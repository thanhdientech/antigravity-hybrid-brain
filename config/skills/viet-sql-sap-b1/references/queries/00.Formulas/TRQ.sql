select sum(MENGE_GUT) from BEAS_ARBZEIT 

where APLATZ_ID =
 @APLATZ_ID
and belnr_id = @belnrid
and belpos_id = @belposid
and DocDate >=@StartDate
and DocDate <= @EndDate
group by BELNR_ID,BELPOS_ID