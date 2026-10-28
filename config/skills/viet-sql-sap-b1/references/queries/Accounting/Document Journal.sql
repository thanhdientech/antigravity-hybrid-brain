-- Header
SELECT
    'H'              AS LineType,
    T0.[TransId],
    NULL             AS Line_ID,
    T0.[RefDate]     AS PostingDate,
    T0.[TaxDate]     AS DocumentDate,
    T0.[DueDate]     AS DueDate,
    T0.[CreateDate]  AS CreateDate,
    T0.[BaseRef]     AS BaseRef,
    T0.[Memo]        AS HeaderMemo,
    T0.[Ref1]        AS HeaderRef1,
    T0.[Ref2]        AS HeaderRef2,
    T0.[TransType]   AS TransType,
    T0.[DocSeries]   AS Series,
    T0.[Number]      AS DocNum,
    T0.[Project]     AS Project,
    T0.[LocTotal]    AS LocTotal,
    T0.[FcTotal]     AS FcTotal,
    T0.[SysTotal]    AS SysTotal,
    T0.[CreatedBy]   AS CreatedBy,
    NULL             AS AccountCode,
    NULL             AS AccountName,
    NULL             AS BPCode,
    NULL             AS BPName,
    NULL             AS Debit,
    NULL             AS Credit,
    NULL             AS FCDebit,
    NULL             AS FCCredit,
    NULL             AS SysDebit,
    NULL             AS SysCredit,
    NULL             AS LineMemo
FROM
    [dbo].[OJDT] T0
WHERE
    (
        @UsePostingDate = 'N'
        OR (@UsePostingDate = 'Y' AND T0.[RefDate] >= @SPostDate AND T0.[RefDate] <= @EPostDate)
    )
    AND (
        @UseCreateDate = 'N'
        OR (@UseCreateDate = 'Y' AND T0.[CreateDate] >= @SCreateDate AND T0.[CreateDate] <= @ECreateDate)
    )
    AND (
        @UseDocDate = 'N'
        OR (@UseDocDate = 'Y' AND T0.[TaxDate] >= @SDocDate AND T0.[TaxDate] <= @EDocDate)
    )

UNION ALL

-- Detail
SELECT
    'D'              AS LineType,
    T0.[TransId],
    T1.[Line_ID] + 1 AS Line_ID,
    T0.[RefDate],
    T0.[TaxDate],
    T0.[DueDate],
    T0.[CreateDate],
    T0.[BaseRef],
    T0.[Memo],
    T0.[Ref1],
    T0.[Ref2],
    T0.[TransType],
    T0.[DocSeries],
    T0.[Number],
    T0.[Project],
    T0.[LocTotal],
    T0.[FcTotal],
    T0.[SysTotal],
    T0.[CreatedBy],
    T1.[Account],
    T3.[AcctName],
    T1.[ShortName],
    T2.[CardName],
    T1.[Debit],
    T1.[Credit],
    T1.[FCDebit],
    T1.[FCCredit],
    T1.[SYSDeb],
    T1.[SYSCred],
    T1.[LineMemo]
FROM
    [dbo].[OJDT] T0
    INNER JOIN [dbo].[JDT1] T1 ON T1.[TransId] = T0.[TransId]
    LEFT OUTER JOIN [dbo].[OCRD] T2 ON T2.[CardCode] = T1.[ShortName]
    LEFT OUTER JOIN [dbo].[OACT] T3 ON T3.[AcctCode] = T1.[Account]
WHERE
    (
        @UsePostingDate = 'N'
        OR (@UsePostingDate = 'Y' AND T0.[RefDate] >= @SPostDate AND T0.[RefDate] <= @EPostDate)
    )
    AND (
        @UseCreateDate = 'N'
        OR (@UseCreateDate = 'Y' AND T0.[CreateDate] >= @SCreateDate AND T0.[CreateDate] <= @ECreateDate)
    )
    AND (
        @UseDocDate = 'N'
        OR (@UseDocDate = 'Y' AND T0.[TaxDate] >= @SDocDate AND T0.[TaxDate] <= @EDocDate)
    )

ORDER BY
    TransId,
    LineType DESC,  -- Header (H) 在前
    Line_ID
