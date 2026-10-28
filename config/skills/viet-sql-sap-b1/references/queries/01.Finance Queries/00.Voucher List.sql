SELECT
    T0.Number,
    T0.RefDate,
    T0.TransType,
    T3.name,
    T0.BaseRef,
    ISNULL(T0.Memo, '') AS 'Voucher Remark',
    T1.Line_ID + 1 AS 'Line',
    T1.Account,
    T2.AcctName,
    CASE
        WHEN T1.Account = T1.ShortName THEN ''
        ELSE T1.ShortName
    END AS ShortName,
    T1.DebCred,
    T1.Debit,
    T1.Credit,
    T1.FCDebit,
    T1.FCCredit,
    ISNULL(T1.LineMemo, '') AS 'Line Remark',
    T1.ObjType,
    T1.ProfitCode,
    T1.ref1,
    T1.Ref2,
    T0.U_belnrid AS 'WO',
    T0.U_belposid AS 'WO POS'
    
FROM
    (OJDT T0
    INNER JOIN JDT1 T1 ON T0.TransId = T1.TransId)
    LEFT JOIN OACT T2 ON T1.Account = T2.AcctCode
    LEFT JOIN V_DataType T3 ON T1.TransType = T3.type
where T0.RefDate >= @StartDate
And T0.RefDate <= @EndDate
And T0.Number like '%'+@Number +'%'
And T1.Account like '%'+@Account +'%'
And T1.Shortname like '%'+@BP +'%'