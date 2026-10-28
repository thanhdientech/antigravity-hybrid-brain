SELECT
    CASE 
        WHEN ISNULL(t1.U_posid, 0) = 0 THEN 'FG IN' 
        ELSE 'Material Return' 
    END AS [Type],

    t0.DocNum           AS [Good Receipt No.],
    t0.DocDate,
    t2.AUFTRAG          AS [Reference],
    t1.U_belnrid        AS [WO Number],
    t1.U_belposid       AS [WO Sequence Number],
    t1.ItemCode,
    t1.Dscription,
    t3.ItmsGrpCod       AS [Item Group],
    t1.Quantity,
    t0.Comments

FROM OIGN t0
    INNER JOIN IGN1 t1 
        ON t0.DocEntry = t1.DocEntry

    INNER JOIN BEAS_FTHAUPT t2 
        ON t1.U_belnrid = t2.BELNR_ID

    INNER JOIN OITM t3 
        ON t1.ItemCode = t3.ItemCode

WHERE 
    t1.U_belnrid IS NOT NULL
    AND t0.DocDate >= @SDate
    AND t0.DocDate <= @EDate

ORDER BY 
    t0.DocNum, 
    t1.U_belnrid, 
    t1.U_belposid ASC;
