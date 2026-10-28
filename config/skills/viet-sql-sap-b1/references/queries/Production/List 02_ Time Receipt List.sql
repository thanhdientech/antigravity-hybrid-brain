SELECT TOP 999999
    az.belnr_id       AS [WO NO.],
    az.belpos_id      AS [WO Pos],
    az.pos_id         AS [Routing Pos],
    az.pers_id        AS [Worker ID],
    p.displayname     AS [Worker Name],
    az.aplatz_id      AS [Resource ID],
    ap.bez            AS [Resource Name],
    ft.auftrag        AS [Order Reference],
    ft.knd_id         AS [Customer ID],
    ft.kndname        AS [Customer Name],
    fa.ag_id          AS [Operation ID],
    fa.bez            AS [Operation Concept],
    fa.anfzeit        AS [Start Time],
    fa.endzeit        AS [End Time],
    itm.itemcode      AS [Item Code],
    itm.itemname      AS [Item Name],
    fp.menge_verbrauch AS [WO QTY],
    fp.me_verbrauch    AS [UOM],
    az.menge_gut       AS [Good QTY],
    az.menge_schlecht  AS [Bad QTY],
    az.udf1,
    az.udf2,
    COALESCE(fp.project, ft.project, '') AS [Project Code],

    -- Calculated Plan Time
    (
        (
            (
                COALESCE(fa.thaplatz, 0) +
                COALESCE(fa.tnaplatz, 0) +
                COALESCE(fa.teaplatz, 0)
            )
            *
            CASE 
                WHEN COALESCE(fa.menge_je, -1) = 0 THEN 1
                ELSE 
                    (fp.menge_verbrauch + COALESCE(fp.menge_verschnitt, 0)) /
                    CASE WHEN COALESCE(fa.menge_je, 0) = 0 THEN 1 ELSE fa.menge_je END
            END
            /
            CASE WHEN COALESCE(fa.nutzen, 0) = 0 THEN 1 ELSE fa.nutzen END
            *
            CASE WHEN COALESCE(fa.anzahl, 0) = 0 THEN 1 ELSE fa.anzahl END
            *
            (1 + COALESCE(fa.ausschussfaktor, 0) / 100.0)
        )
        *
        CASE WHEN COALESCE(ap.zeitgrad, 0) = 0 THEN 1 ELSE 100.0 / ap.zeitgrad END
        +
        COALESCE(fa.tr2aplatz, 0)
    )
    *
    CASE WHEN COALESCE(fa.menge_zeitje, 0) = 0 THEN 1 ELSE fa.menge_zeitje END
    /
    fp.menge_verbrauch
    *
    az.menge_gut
    AS [Plan Time]

FROM beas_ftapl fa
    INNER JOIN beas_arbzeit az 
        ON az.belnr_id = fa.belnr_id 
        AND az.belpos_id = fa.belpos_id 
        AND az.pos_id = fa.pos_id

    INNER JOIN beas_fthaupt ft 
        ON az.belnr_id = ft.belnr_id

    INNER JOIN beas_ftpos fp 
        ON az.belnr_id = fp.belnr_id 
        AND az.belpos_id = fp.belpos_id

    INNER JOIN oitm itm 
        ON fp.itemcode = itm.itemcode

    INNER JOIN beas_pers p 
        ON az.pers_id = p.pers_id

    INNER JOIN beas_aplatz ap 
        ON ap.aplatz_id = az.aplatz_id

    LEFT JOIN beas_agtyp ag 
        ON fa.agtyp = ag.agtyp

WHERE 
    ft.beldat BETWEEN '19900101' AND '20991223'
    AND fp.lieferdatum BETWEEN '19900101' AND '20991223'
    AND ISNULL(fp.abgkz, '') <> 'J'
    AND ISNULL(ft.abgkz, '') <> 'J'
    AND az.endzeit <= @EDate
    AND az.anfzeit >= @SDate
    AND COALESCE(az.cancel, 0) = 0

ORDER BY 
    fa.anfzeit;
