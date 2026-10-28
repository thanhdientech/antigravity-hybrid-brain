SELECT SUM(result)
FROM
(
    SELECT ISNULL(SUM(T0.Credit), 0) AS result
    FROM JDT1 T0
    WHERE T0.Account >= @StartAccountCode AND T0.Account <= @EndAccountCode
        AND T0.refdate >= @StartDate and T0.refdate <= @EndDate 
        AND  T0.Profitcode = @ONE
    GROUP BY T0.Account
    
    UNION ALL
    
    SELECT 0 AS result
) t0;