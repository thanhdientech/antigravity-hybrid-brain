SELECT
  CASE WHEN ISNULL(U_posid, 0) = 0 THEN 'FG' ELSE 'Material' END AS 'Type',
  t0.docnum AS 'Good Receipt No.',
  t0.docdate,
  t2.AUFTRAG AS 'Reference',
  t1.U_belnrid AS 'WO Number',
  t1.U_belposid AS 'WO Sequence Number',
  t1.itemcode,
  t1.Dscription,
  t3.ItmsGrpCod,
  t1.Quantity,
  t0.comments
FROM oign t0
INNER JOIN ign1 t1 ON t0.docentry = t1.docentry
INNER JOIN BEAS_FTHAUPT t2 ON t1.U_belnrid = t2.BELNR_ID
INNER JOIN OITM t3 ON t3.itemcode = t1.itemcode
WHERE t1.U_belnrid IS NOT NULL
  AND t0.Docdate >= @StartDate
 AND T0.Docdate <= @EndDate
ORDER BY t0.docnum, t1.U_belnrid, U_belposid ASC;