    SELECT ISNULL(SUM(Debit - Credit), 0) AS result
    FROM JDT1
    WHERE account >= @StartAccountCode and account <= @EndAccountCode 
    and  refdate<=DATEADD(DAY, -1, @EndDate)
    and TransType <> -3
    

  