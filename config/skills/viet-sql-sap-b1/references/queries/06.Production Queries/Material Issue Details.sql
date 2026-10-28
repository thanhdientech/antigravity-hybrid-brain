SELECT
  CASE WHEN ISNULL(U_posid, 0) = 0 THEN 'FG' ELSE 'Material' END AS 'Type',
  t0.docnum AS 'Goods Issue No.',
  t0.docdate,
  t2.AUFTRAG AS 'Reference',
  t1.U_belnrid AS 'WO Number',
  t1.U_belposid AS 'WO Sequence Number',
  t1.itemcode,
  t1.Dscription,
  t1.Quantity,
  T5.TOTALQUANTITY_WHUNIT AS 'Plan QTY'
FROM oige t0 
INNER JOIN ige1 t1 ON t0.docentry = t1.docentry
INNER JOIN BEAS_FTHAUPT t2 ON t1.U_belnrid = t2.BELNR_ID
INNER JOIN OIVL T3 ON T1.ObjType = T3.TransType AND T1.DocEntry = T3.BASE_REF AND T1.LineNum = T3.DocLineNum
INNER JOIN IVL1 T4 ON T3.TransSeq = T4.TransSeq
LEFT OUTER JOIN BEAS_FTSTL T5 ON T1.U_belnrid = T5.BELNR_ID AND T1.U_belposid = T5.BELPOS_ID AND T1.U_posid = T5.POS_ID
WHERE t1.U_belnrid IS NOT NULL

  AND T0.Docdate >= @StartDate
  AND T0.Docdate <= @EndDate
ORDER BY t0.docnum, t1.U_belnrid, t1.U_belposid ASC;
