SELECT t1.AUFTRAG, t0.BELNR_ID, t0.BELPOS_ID, t0.itemcode, t0.itemname, t0.U_znr, t0.MENGE, t0.GEL_MENGE, 
CAST(T0.ANFZEIT AS DATE),
CAST(T0.ENDZEIT AS DATE), 
t0.STATUS_ID
FROM BEAS_FTPOS t0
LEFT JOIN BEAS_FTHAUPT t1 ON t0.BELNR_ID = t1.BELNR_ID 
where T1.auftrag like '%'+@Reference+'%'

and T0.Itemcode >= @SItemcode
and T0.Itemcode <= @EItemcode

And T0.ABGKZ like '%' +@Close+'%'