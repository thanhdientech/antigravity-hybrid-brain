SELECT 
    t1.AUFTRAG,
    t0.BELNR_ID,
    t0.BELPOS_ID,
    t0.ItemCode,
    t0.ItemName,
    t0.U_znr,
    t0.MENGE,
    t0.GEL_MENGE,
    CAST(t0.ANFZEIT AS DATE) AS [Start Date],
    CAST(t0.ENDZEIT AS DATE) AS [End Date],
    t0.STATUS_ID
FROM 
    BEAS_FTPOS t0
LEFT JOIN 
    BEAS_FTHAUPT t1 
    ON t0.BELNR_ID = t1.BELNR_ID
WHERE 
    (@Reference = '' OR t1.AUFTRAG LIKE '%' + @Reference + '%')
    AND t0.ItemCode >= @SItemcode
    AND t0.ItemCode <= @EItemcode
    AND (
        @Close = '' 
        OR (@Close = 'C' AND t0.ABGKZ = 'J') 
        OR (@Close = 'N' AND t0.ABGKZ = 'N')
    )
