    SELECT ISNULL(SUM(T0.Debit), 0) 
    FROM JDT1 T0
    WHERE T0.Account >= @StartAccountCode AND T0.Account <= @EndAccountCode
        AND CONVERT(DATE, T0.refdate) >= @StartDate and CONVERT(DATE, T0.refdate) <= @EndDate
        AND TransType <> -3
