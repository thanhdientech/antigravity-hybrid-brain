    SELECT ISNULL(SUM(T0.Debit), 0) AS result
    FROM JDT1 T0
    LEFT JOIN OFPR T1 ON T0.FinncPriod = T1.AbsEntry
    WHERE T0.Account >= @StartAccountCode AND T0.Account <= @EndAccountCode
        AND T1.Code = @Period 
    GROUP BY T0.FinncPriod, T0.Account
    
