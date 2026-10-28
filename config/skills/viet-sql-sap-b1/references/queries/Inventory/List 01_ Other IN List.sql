SELECT 
    'IN' AS DocType,
    T0.DocDate,
    T0.DocNum,
    T1.ItemCode,
    T1.Dscription,
    T1.Quantity,
    T1.WhsCode,
    ROUND(T3.TransValue / T1.Quantity, 2) AS Price,
    T3.TransValue,
    T0.Comments,
    T1.AcctCode,
    T1.OcrCode,
    T1.U_beas_basetype AS 'Origin',
    T1.U_beas_basedocentry AS 'Origin Document'
FROM OIGN T0
    INNER JOIN IGN1 T1 
        ON T0.DocEntry = T1.DocEntry
    INNER JOIN OIVL T2 
        ON T1.ObjType = T2.TransType 
       AND T1.DocEntry = T2.BASE_REF 
       AND T1.LineNum = T2.DocLineNum
    INNER JOIN IVL1 T3 
        ON T2.TransSeq = T3.TransSeq
WHERE ISNULL(T1.U_belnrid, 0) = 0
    AND ISNULL(T1.U_beas_basetype, '') <> 'T'
    AND T0.DocDate >= @StartDate
    AND T0.DocDate <= @EndDate
    AND ISNULL(T1.OcrCode, '') LIKE '%' + @DEPT + '%'
