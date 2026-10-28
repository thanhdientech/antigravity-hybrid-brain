SELECT 
    T0.[Project]       AS 'Project',
    T0.[TransId]       AS 'TransId',
    T0.[Line_ID]       AS 'LineID',
    T0.[Account]       AS 'Account',
    T0.[ShortName]     AS 'BPCode',
    T0.[Credit]        AS 'Credit',
    T0.[Debit]         AS 'Debit',
    T0.[SYSCred]       AS 'SysCredit',
    T0.[SYSDeb]        AS 'SysDebit',
    T0.[FCCredit]      AS 'FCCredit',
    T0.[FCDebit]       AS 'FCDebit',
    T0.[FCCurrency]    AS 'FCCurrency',
    T0.[DueDate]       AS 'DueDate',
    T0.[RefDate]       AS 'RefDate',
    T0.[TaxDate]       AS 'TaxDate',
    T0.[LineMemo]      AS 'LineMemo',
    T0.[BaseRef]       AS 'BaseRef',
    T0.[Ref1]          AS 'LineRef1',
    T0.[Ref2]          AS 'LineRef2',
    T0.[CreatedBy]     AS 'CreatedBy',
    T0.[SourceID]      AS 'SourceID',
    T0.[SourceLine]    AS 'SourceLine',
    T0.[ContraAct]     AS 'ContraAccount',
    T0.[ProfitCode]    AS 'ProfitCode',
    T0.[TransType]     AS 'TransType',
    T0.[TransCode]     AS 'TransCode',
    T0.[VatGroup]      AS 'VatGroup',
    T0.[BaseSum]       AS 'BaseSum',
    T0.[VatRate]       AS 'VatRate',
    T0.[VatAmount]     AS 'VatAmount',
    T0.[SYSBaseSum]    AS 'SysBaseSum',
    T0.[SYSVatSum]     AS 'SysVatSum',
    T0.[LineType]      AS 'LineType',
    T0.[Indicator]     AS 'Indicator',
    T0.[BalDueDeb]     AS 'BalDueDebit',
    T0.[BalDueCred]    AS 'BalDueCredit',
    T0.[BalFcDeb]      AS 'BalFcDebit',
    T0.[BalFcCred]     AS 'BalFcCredit',
    T0.[BalScDeb]      AS 'BalScDebit',
    T0.[BalScCred]     AS 'BalScCredit',
    T0.[StornoAcc]     AS 'StornoAccount',
    T0.[SequenceNr]    AS 'SequenceNr',
    T0.[DunnLevel]     AS 'DunningLevel',
    T0.[DunDate]       AS 'DunningDate',
    T0.[TaxPostAcc]    AS 'TaxPostAccount',
    T0.[TaxCode]       AS 'TaxCode',
    T0.[Location]      AS 'Location',
    T0.[OcrCode2]      AS 'OcrCode2',
    T0.[OcrCode3]      AS 'OcrCode3',
    T0.[OcrCode4]      AS 'OcrCode4',
    T0.[OcrCode5]      AS 'OcrCode5',
    T1.[PrjName]       AS 'ProjectName'
FROM 
    [dbo].[JDT1] T0
    LEFT OUTER JOIN [dbo].[OPRJ] T1 
        ON T1.[PrjCode] = T0.[Project]
WHERE 
    (
        (@includeNull = 'Y' AND (T0.[Project] IS NULL OR (T0.[Project] >= @SPrj AND T0.[Project] <= @EPrj)))
        OR (@includeNull = 'N' AND T0.[Project] >= @SPrj AND T0.[Project] <= @EPrj)
    )
    AND T0.[RefDate] >= @SPDate
    AND T0.[RefDate] <= @EPDate
  --  AND T0.[TaxDate] >= @SDDate
  --  AND T0.[TaxDate] <= @EDDate
