select sum(MENGE_SCHLECHT) from BEAS_ARBZEIT 

where APLATZ_ID =
 @APLATZ_ID
and DocDate >=@StartDate
and DocDate <= @EndDate
group by BELNR_ID,BELPOS_ID