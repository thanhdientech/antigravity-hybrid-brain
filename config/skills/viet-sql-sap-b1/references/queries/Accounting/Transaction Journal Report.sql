SELECT TOP 1000
    T0.[TransId]       AS 'TransId',
    T0.[Line_ID]       AS 'LineID',
    T0.[TransType]     AS 'TransType',
    T1.[RefDate]       AS 'RefDate',
    T0.[Account]       AS 'Account',
    T0.[ShortName]     AS 'BPCode',
    T0.[Credit]        AS 'Credit',
    T0.[Debit]         AS 'Debit',
    T0.[SYSCred]       AS 'SysCredit',
    T0.[SYSDeb]        AS 'SysDebit',
    T0.[FCCredit]      AS 'FCCredit',
    T0.[FCDebit]       AS 'FCDebit',
    T0.[FCCurrency]    AS 'FCCurrency',
    T0.[CreatedBy]     AS 'CreatedBy',
    T1.[UserSign]      AS 'UserSign',
    T1.[Ref1]          AS 'HeaderRef1',
    T1.[Memo]          AS 'HeaderMemo',
    T0.[LineMemo]      AS 'LineMemo',
    T2.[CardName]     AS 'BPName',
    T3.[AcctName]     AS 'AccountName',
    T0.[Ref1]          AS 'LineRef1',
    T1.[Ref2]          AS 'HeaderRef2',
    T0.[Ref2]          AS 'LineRef2',
    T1.[DocSeries]    AS 'DocSeries',
    T0.[TaxDate]      AS 'TaxDate',
    T1.[Creator]      AS 'Creator',
    T1.[Approver]     AS 'Approver',
    T1.[Number]       AS 'Number'
FROM 
    [dbo].[JDT1] T0
    INNER JOIN [dbo].[OJDT] T1 
        ON T1.[TransId] = T0.[TransId]
    LEFT OUTER JOIN [dbo].[OCRD] T2 
        ON T2.[CardCode] = T0.[ShortName]
    LEFT OUTER JOIN [dbo].[OACT] T3 
        ON T3.[AcctCode] = T0.[Account]
    LEFT OUTER JOIN [dbo].[NNM1] T4 
        ON T4.[Series] = T1.[DocSeries]
WHERE 
    T0.[TransId] = T1.[TransId]
    -- AND T0.[TransType] = TransType@
    AND T1.[RefDate] >= @SDate
    AND T1.[RefDate] <= @EDate
ORDER BY 
    T0.[TransId],
    T0.[Line_ID]
