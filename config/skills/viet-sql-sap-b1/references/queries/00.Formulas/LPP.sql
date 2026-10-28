
    SELECT ISNULL(SUM(T0.Debit - T0.Credit), 0) AS result
    FROM JDT1 T0
    LEFT JOIN OFPR T1 ON T0.FinncPriod = T1.AbsEntry
    WHERE  t0.account >= @StartAccountCode and T0.account <= @EndAccountCode 
    and (t0.FinncPriod<= (select AbsEntry from OFPR where code = @Period )-1) 
    GROUP BY T1.Code, T0.Account
