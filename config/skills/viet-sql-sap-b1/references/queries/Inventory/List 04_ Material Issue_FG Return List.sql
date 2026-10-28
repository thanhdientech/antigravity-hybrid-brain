SELECT
    CASE 
        WHEN ISNULL(t1.U_posid, 0) = 0 THEN 'FG Rework' 
        ELSE 'Material Issue' 
    END AS [Type],

    t0.DocNum                    AS [Goods Issue No.],
    t0.DocDate,
    t2.AUFTRAG                   AS [Reference],
    t1.U_belnrid                 AS [WO Number],
    t1.U_belposid                AS [WO Sequence Number],
    t1.ItemCode,
    t1.Dscription,
    t1.Quantity,
    T5.TOTALQUANTITY_WHUNIT     AS [Plan QTY]

FROM OIGE t0
    INNER JOIN IGE1 t1 
        ON t0.DocEntry = t1.DocEntry

    INNER JOIN BEAS_FTHAUPT t2 
        ON t1.U_belnrid = t2.BELNR_ID

    INNER JOIN OIVL t3 
        ON t1.ObjType = t3.TransType 
        AND t1.DocEntry = t3.BASE_REF 
        AND t1.LineNum = t3.DocLineNum

    INNER JOIN IVL1 t4 
        ON t3.TransSeq = t4.TransSeq

    LEFT JOIN BEAS_FTSTL t5 
        ON t1.U_belnrid = t5.BELNR_ID 
        AND t1.U_belposid = t5.BELPOS_ID 
        AND t1.U_posid = t5.POS_ID

WHERE 
    t1.U_belnrid IS NOT NULL
    AND t0.DocDate >= @SDate
    AND t0.DocDate <= @EndDate

ORDER BY 
    t0.DocNum, 
    t1.U_belnrid, 
    t1.U_belposid ASC;
