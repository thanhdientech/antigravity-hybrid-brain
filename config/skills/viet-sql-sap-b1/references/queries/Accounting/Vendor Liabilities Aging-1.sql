SELECT 
    T0.[TransId]                 AS 'TransId',
    T0.[Line_ID]                 AS 'LineID',
    MAX(T0.[Account])            AS 'Account',
    MAX(T0.[ShortName])          AS 'BPCode',
    MAX(T0.[TransType])          AS 'TransType',
    MAX(T0.[CreatedBy])          AS 'CreatedBy',
    MAX(T0.[BaseRef])            AS 'BaseRef',
    MAX(T0.[SourceLine])         AS 'SourceLine',
    MAX(T0.[RefDate])            AS 'RefDate',
    MAX(T0.[DueDate])            AS 'DueDate',
    MAX(T0.[TaxDate])            AS 'TaxDate',
    MAX(T0.[BalDueCred]) - MAX(T0.[BalDueDeb])  AS 'BalanceLC',
    MAX(T0.[BalFcCred]) - MAX(T0.[BalFcDeb])    AS 'BalanceFC',
    MAX(T0.[BalScCred]) - MAX(T0.[BalScDeb])    AS 'BalanceSC',
    MAX(T0.[LineMemo])           AS 'LineMemo',
    MAX(T1.[FolioPref])          AS 'FolioPref',
    MAX(T1.[FolioNum])           AS 'FolioNum',
    MAX(T1.[PTICode])            AS 'PTICode',
    MAX(T1.[Letter])             AS 'Letter',
    MAX(T1.[FolNumFrom])         AS 'FolioNumFrom',
    MAX(T1.[FolNumTo])           AS 'FolioNumTo',
    MAX(T0.[Indicator])          AS 'Indicator',
    MAX(T2.[CardName])           AS 'BPName',
    MAX(T3.[CardCode])           AS 'DocBPCode',
    MAX(T3.[CardName])           AS 'DocBPName',
    MAX(T2.[Balance])            AS 'BPBalance',
    MAX(T3.[NumAtCard])          AS 'CustomerRefNo',
    MAX(T3.[SlpCode])            AS 'SalesEmployee',
    MAX(T0.[Project])            AS 'Project',
    MAX(T0.[Debit]) - MAX(T0.[Credit])        AS 'NetLC',
    MAX(T0.[FCDebit]) - MAX(T0.[FCCredit])    AS 'NetFC',
    MAX(T0.[SYSDeb]) - MAX(T0.[SYSCred])      AS 'NetSC',
    MAX(T2.[PymCode])           AS 'PaymentTerms',
    MAX(T3.[BlockDunn])         AS 'BlockDunning',
    MAX(T3.[DunnLevel])         AS 'DunningLevel',
    MAX(T3.[TransType])         AS 'DocType',
    MAX(T3.[IsSales])           AS 'IsSales',
    MAX(T2.[Currency])          AS 'BPCurrency',
    MAX(T0.[FCCurrency])        AS 'FCCurrency',
    T0.[TransId]                AS 'TransId_Repeat',
    MAX(T2.[DunTerm])          AS 'DunningTerms',
    MAX(T0.[DunnLevel])        AS 'CurrentDunnLevel',
    T0.[BPLName]               AS 'BranchName',
    MAX(T2.[ConnBP])          AS 'ConnectedBP',
    MAX(T2.[CardCode])        AS 'BPCodeRepeat',
    T0.[TransId]              AS 'TransId_Repeat2',
    MAX(T1.[AgrNo])          AS 'AgreementNo'
FROM 
    [dbo].[JDT1] T0
    INNER JOIN [dbo].[OJDT] T1 
        ON T1.[TransId] = T0.[TransId]
    INNER JOIN [dbo].[OCRD] T2 
        ON T2.[CardCode] = T0.[ShortName]
    LEFT OUTER JOIN [dbo].[B1_JournalTransSourceView] T3 
        ON T3.[ObjType] = T0.[TransType]
        AND T3.[DocEntry] = T0.[CreatedBy]
        AND (
            T3.[TransType] <> N'I' 
            OR (T3.[TransType] = N'I' AND T3.[InstlmntID] = T0.[SourceLine])
        )
WHERE 
    T0.[RefDate] >= @SDate
    AND T0.[RefDate] <= @EDate
    AND (
        @Cardtype = 'A'
        OR T2.[CardType] = @Cardtype
    )
    AND T2.[Balance] <> @balance
    AND T2.[CardCode] >= @SCardcode
    AND T2.[CardCode] <= @ECardcode
    AND (
        T0.[BalDueCred] <> T0.[BalDueDeb]
        OR T0.[BalFcCred] <> T0.[BalFcDeb]
    )
    AND NOT EXISTS (
        SELECT 
            U0.[TransId],
            U0.[TransRowId]
        FROM 
            [dbo].[ITR1] U0
            INNER JOIN [dbo].[OITR] U1 
                ON U1.[ReconNum] = U0.[ReconNum]
        WHERE 
            T0.[TransId] = U0.[TransId]
            AND T0.[Line_ID] = U0.[TransRowId]
            AND U1.[ReconDate] > @AgingDate
        GROUP BY 
            U0.[TransId],
            U0.[TransRowId]
    )
GROUP BY 
    T0.[TransId],
    T0.[Line_ID],
    T0.[BPLName]
