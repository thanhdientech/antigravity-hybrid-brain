SELECT 
    t1.DocNum,
    t1.DocType,
    t1.DocStatus,
    t1.DocDate,
    t1.Comments,
    t2.LineNum + 1 AS 'Line Num',
    t2.LineStatus,
    t2.ItemCode,
    t2.Dscription,
    t2.Currency,
    t2.Rate,
    t2.Price,
    t2.Quantity,
    t2.LineTotal,
    t2.AcctCode,
    t2.LineType,
    t1.Requester,
    t1.ReqName
FROM OPRQ t1
INNER JOIN PRQ1 t2 ON t1.DocEntry = t2.DocEntry
WHERE t1.CANCELED = 'N'
AND (
    @ReqName IS NULL 
    OR @ReqName = ''
    OR t1.ReqName LIKE '%' + @ReqName + '%'
)
