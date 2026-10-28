
SELECT 
    t1.DocEntry,
    t1.DocLineNum,
    t3.TransId AS 'Voucher number',
    t1.ItemCode,
    t1.ItemName,
    t1.OnHandBef,
    t1.CountQty,
    t1.Quantity AS 'Variance',
    t1.Currency,
    t1.Rate,
    t1.IOffIncAcc,
    t1.DOffDecAcc,
    t1.OcrCode,
    t1.WhsCode,
    t2.InQty,
    t2.OutQty,
    t2.Price,
    t1.DocTotal AS 'Variance Value',
    t2.CardCode,
    t2.CardName,
    t2.Comments,
    t2.JrnlMemo,
    t2.TransValue
FROM IQR1 t1
LEFT JOIN OINM t2 
    ON t1.ObjType = t2.TransType 
   AND t1.DocEntry = t2.Base_Ref 
   AND t1.DocLineNum = t2.DocLineNum
LEFT JOIN OJDT t3 
    ON t2.TransType = t3.TransType 
   AND t2.Base_Ref = t3.BaseRef
WHERE 
    (@DocNum = '' OR t1.DocEntry = @DocNum)
