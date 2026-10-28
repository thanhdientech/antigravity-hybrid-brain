select t0.menge_verbrauch from BEAS_FTPOS t0 inner join BEAS_FTHAUPT t1 on t0.BELNR_ID = t1.BELNR_ID
where t0.belnr_id = @belnr_id and t0.belpos_id = @belpos_id
