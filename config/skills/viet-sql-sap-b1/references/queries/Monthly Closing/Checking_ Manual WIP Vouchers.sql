SELECT * 
FROM (
    -- 情况 1: 直接从 OJDT 和 JDT1 获取非 59、60 类型的传票
    SELECT 
        T0.U_belnrid,
        T0.U_belposid,
        T0.TransId,
        T0.Memo,
        T0.RefDate,
        T1.Debit,
        T1.Credit
    FROM OJDT T0
    INNER JOIN JDT1 T1 ON T0.TransId = T1.TransId
    WHERE 
        T1.Account = @WIPAC
        AND T0.TransType NOT IN ('59', '60')
        AND T0.RefDate >= @SDate
        AND T0.RefDate <= @EDate

    UNION ALL

    -- 情况 2: 从 OIGN → JDT 获取库存收货单相关传票
    SELECT 
        T0.U_belnrid,
        T0.U_belposid,
        T1.TransId,
        T1.Memo,
        T1.RefDate,
        T2.Debit,
        T2.Credit
    FROM (
        SELECT 
            T0.ObjType,
            T0.DocEntry,
            T0.DocDate,
            T1.U_belnrid,
            T1.U_belposid 
        FROM OIGN T0
        INNER JOIN IGN1 T1 ON T0.DocEntry = T1.DocEntry
        WHERE ISNULL(T1.U_belnrid, 0) <> 0
        GROUP BY 
            T0.ObjType, T0.DocEntry, T0.DocDate, 
            T1.U_belnrid, T1.U_belposid
    ) T0
    INNER JOIN OJDT T1 ON T0.ObjType = T1.TransType AND T0.DocEntry = T1.CreatedBy
    INNER JOIN JDT1 T2 ON T1.TransId = T2.TransId
    WHERE 
        T2.Account = @WIPAC
        AND T0.DocDate >= @SDate
        AND T0.DocDate <= @EDate

    UNION ALL

    -- 情况 3: 从 OIGE → JDT 获取库存发货单相关传票
    SELECT 
        T0.U_belnrid,
        T0.U_belposid,
        T1.TransId,
        T1.Memo,
        T1.RefDate,
        T2.Debit,
        T2.Credit
    FROM (
        SELECT 
            T0.ObjType,
            T0.DocEntry,
            T0.DocDate,
            T1.U_belnrid,
            T1.U_belposid 
        FROM OIGE T0
        INNER JOIN IGE1 T1 ON T0.DocEntry = T1.DocEntry
        WHERE ISNULL(T1.U_belnrid, 0) <> 0
        GROUP BY 
            T0.ObjType, T0.DocEntry, T0.DocDate, 
            T1.U_belnrid, T1.U_belposid
    ) T0
    INNER JOIN OJDT T1 ON T0.ObjType = T1.TransType AND T0.DocEntry = T1.CreatedBy
    INNER JOIN JDT1 T2 ON T1.TransId = T2.TransId
    WHERE 
        T2.Account = @WIPAC
        AND T0.DocDate >= @SDate
        AND T0.DocDate <= @EDate
) T
-- 过滤掉有 WO 编号的，只取空白工单
WHERE ISNULL(U_belnrid, 0) = 0;
