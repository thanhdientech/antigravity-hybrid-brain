SELECT TOP 100
    D.ItemCode,
    D.POS,
    D.ART,
    D.DATUM AS [DOC Date],
    D.Name,
    D.INFO,
    D.BELNR_ID as 'WO No.',
    D.BELPOS_ID as 'WO Pos',
    D.POS_ID,
    D.DocType,
    D.DocEntry 'Document No.',
    D.LineNum,
    D.OnHand as 'Expected Onhand',
    COALESCE(D.FERTIGUNG_ZUGANG, 0) + COALESCE(D.BESTELLUNG_ZUGANG, 0) AS [IN],
    COALESCE(D.FERTIGUNG_ABGANG, 0) + COALESCE(D.AUFTRAG_ABGANG, 0) AS [OUT],
    D.ONHAND2 AS [Balance],
    COALESCE(D.FERTIGUNG_ABGANG, 0) + COALESCE(D.AUFTRAG_ABGANG, 0) - COALESCE(D.RESERVATION, 0) AS [Reservation],
    D.INFO2,
    D.TABLEREF,
    D.Project,
    D.BEWERTET,
    D.INFOTEXT,
    D.Version,
    D.ZNR,
    D.BEDARFSDATUM,
    D.VRI,
    D.SHORTVARIANT,
    D.INFO3,
    D.COLORNR,
    D.RESERVATION,
    D.UID,
    D.RELEASED,
    D.Linked,
    D.DEMANDCOVERING,
    D.WhsCode,
    D.PRJUID,
    I.InvntryUom,
    P.DESCRIPTION,
    SUBSTRING(CONVERT(VARCHAR(20), K.KW_ID), 5, 2) AS [KW],
    CASE 
        WHEN D.ART = 'B' THEN PO.U_beas_requestdel 
        ELSE SO.U_beas_requestdel 
    END AS rdr1_u_beas_requestdel,
    CASE 
        WHEN D.ART = 'B' THEN PO.U_beas_delconfirm 
        ELSE SO.U_beas_delconfirm 
    END AS rdr1_u_beas_delconfirm

FROM BEAS_MRP_DETAIL D
LEFT JOIN OITM I ON I.ItemCode = D.ItemCode
LEFT JOIN BEAS_PRJ_LINE P 
    ON D.Project = P.PrjCode AND D.PRJUID = P.PRJUID
LEFT JOIN RDR1 SO 
    ON SO.DocEntry = D.DocEntry 
    AND D.LineNum = SO.LineNum 
    AND D.ART IN ('A', 'S')
LEFT JOIN POR1 PO 
    ON PO.DocEntry = D.DocEntry 
    AND D.LineNum = PO.LineNum 
    AND D.ART = 'B'
LEFT JOIN BEAS_KALENDER K 
    ON CONVERT(VARCHAR(10), K.DATUM_ID, 112) = CONVERT(VARCHAR(10), D.BEDARFSDATUM, 112)

WHERE 
    D.NR = @MRP 
    AND D.ItemCode = @itemcode 
    AND (
        CASE 
            WHEN I.ManBtchNum = 'Y' OR I.ManSerNum = 'Y' 
                THEN CASE WHEN D.Version = '' THEN 1 ELSE 0 END 
            ELSE 1 
        END
    ) = 1

ORDER BY 
    D.NR, 
    D.POS
