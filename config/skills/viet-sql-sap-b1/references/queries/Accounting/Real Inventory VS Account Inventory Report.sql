SELECT 
    *, 
    T0.SumStock - T1.isum AS [sumstock-isum]
FROM (
    -- 从库存日记账（OIVL）汇总每笔交易的库存价值
    SELECT 
        TransType,
        BASE_REF,
        T0.InvntAct,
        SUM(SumStock) AS SumStock
    FROM OIVL T0 
    WHERE 
        T0.DocDate >= @StartDate 
        AND T0.DocDate <= @EndDate
    GROUP BY 
        TransType, 
        BASE_REF, 
        InvntAct
) T0 
FULL OUTER JOIN (
    -- 从总账凭证（OJDT, JDT1）汇总相关会计科目的金额
    SELECT 
        T0.TransId, 
        T0.RefDate,
        T0.TransType,
        T0.BaseRef,
        T1.Account,  
        SUM(T1.Debit - T1.Credit) AS isum 
    FROM OJDT T0 
    INNER JOIN JDT1 T1 ON T0.TransId = T1.TransId 
    WHERE 
        T1.Account IN (
        SELECT DISTINCT BalInvntAc 
        FROM OITB 
        WHERE ISNULL(BalInvntAc, '') <> ''
    )
        AND T0.RefDate >= @StartDate 
        AND T0.RefDate <= @EndDate
    GROUP BY 
        T0.TransId, 
        T0.RefDate, 
        T0.TransType, 
        T0.BaseRef, 
        T1.Account
) T1 
    ON T0.TransType = T1.TransType 
    AND T0.BASE_REF = T1.BaseRef

-- 对比库存模块和会计模块的差异
WHERE 
    ROUND(ISNULL(T0.SumStock, 0), 2) <> ROUND(ISNULL(T1.isum, 0), 2)
	
order by BASE_REF