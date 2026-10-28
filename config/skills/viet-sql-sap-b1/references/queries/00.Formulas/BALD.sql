    SELECT ISNULL(SUM(Debit - Credit), 0) AS result
    FROM JDT1
    WHERE account >= @StartAccountCode and account <= @EndAccountCode 
    and  taxdate<=@EndDate
    and TransType <> -3

