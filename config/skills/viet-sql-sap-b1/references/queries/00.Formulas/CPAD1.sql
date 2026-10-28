    SELECT ISNULL(SUM(T0.Debit-T0.Credit), 0) 
    FROM JDT1 T0
    WHERE T0.Account >= @StartAccountCode AND T0.Account <= @EndAccountCode
        AND T0.refdate >= @StartDate and T0.refdate <= @EndDate 
        AND  T0.Profitcode = @ONE
    