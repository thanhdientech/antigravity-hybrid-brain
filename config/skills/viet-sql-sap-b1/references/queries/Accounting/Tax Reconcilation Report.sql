SELECT 
    T1.[AcctCode]                   AS 'AccountCode',
    T0.[Code]                       AS 'TaxCode',
    T0.[Name]                       AS 'TaxName',
    CASE 
        WHEN T0.[SrcObjType] = '13' THEN 'A/R Invoice'
        WHEN T0.[SrcObjType] = '14' THEN 'A/R Credit Memo'
        WHEN T0.[SrcObjType] = '18' THEN 'A/P Invoice'
        WHEN T0.[SrcObjType] = '19' THEN 'A/P Credit Memo'
        ELSE 'Other'
    END                             AS 'DocumentType',
    T0.[DocNum]                     AS 'DocNumber',
    T0.[Category]                   AS 'Category',
    T0.[IsAcq]                      AS 'IsAcquisition',
    T0.[Isdeferred]                AS 'IsDeferred',
    T0.[VatPercent]                 AS 'VatPercent',
    T0.[EqPercent]                  AS 'EqPercent',
    T0.[DocDate]                    AS 'DocumentDate',
    T0.[TaxDate]                    AS 'TaxDate',
    SUM(T0.[BaseSum])               AS 'BaseSum',
    SUM(T0.[VatSum])                AS 'VatSum',
    SUM(T0.[DeductSum] - T0.[EqSum]) AS 'DeductSum',
    SUM(T0.[EqSum])                 AS 'EqSum',
    SUM(T0.[BaseSumSc])            AS 'BaseSumSC',
    SUM(T0.[VatSumSc])             AS 'VatSumSC',
    SUM(T0.[DedctSumSC] - T0.[EqSumSC]) AS 'DeductSumSC',
    SUM(T0.[EqSumSC])             AS 'EqSumSC',
    T0.[CrditDebit]                AS 'DebitCredit',
    T0.[CardCode]                  AS 'BPCode',
    T0.[CardName]                  AS 'BPName',
    T0.[BPLicTradNum]             AS 'TaxID',
    T0.[CANCELED]                 AS 'Canceled',
    T2.[AcctName]                 AS 'AccountName',
    MIN(T0.[VatDate])            AS 'VatDate',
    SUM(T0.[CABasSum])          AS 'CABaseSum',
    SUM(T0.[CABasSumSc])       AS 'CABaseSumSC',
    SUM(T0.[CAVatSum])          AS 'CAVatSum',
    SUM(T0.[CAVatSumSc])       AS 'CAVatSumSC'
FROM 
    [dbo].[B1_VatView] T0
    INNER JOIN [dbo].[B1_VatAcctView] T1 
        ON T0.[SrcObjType] = T1.[SrcObjType]
        AND T0.[SrcObjAbs] = T1.[SrcObjAbs]
        AND T0.[SrcArrType] = T1.[SrcArrType]
        AND T0.[SrcLineNum] = T1.[SrcLineNum]
        AND T0.[SrcGrpNum] = T1.[SrcGrpNum]
        AND (T1.[SrcObjType] = N'30' OR T0.[Isdeferred] = T1.[IsDeferred])
        AND (T1.[TAX1LinSeq] IS NULL OR T1.[TAX1LinSeq] < 1 OR T0.[LineSeq] = T1.[TAX1LinSeq])
    INNER JOIN [dbo].[OACT] T2 
        ON T2.[AcctCode] = T1.[AcctCode]
WHERE
    T0.[DocDate] >= @SDate
    AND T0.[DocDate] <= @EDate
    AND (
        @ACCode = 'A' 
        OR T1.[AcctCode] = @ACCode
    )
    AND (
        @TaxCode = 'A' 
        OR T0.[Code] = @TaxCode
    )
GROUP BY 
    T1.[AcctCode],
    T0.[Code],
    T0.[Name],
    T0.[SrcObjType],
    T0.[DocNum],
    T0.[Category],
    T0.[IsAcq],
    T0.[Isdeferred],
    T0.[VatPercent],
    T0.[EqPercent],
    T0.[DocDate],
    T0.[TaxDate],
    T0.[CrditDebit],
    T0.[CardCode],
    T0.[CardName],
    T0.[BPLicTradNum],
    T0.[CANCELED],
    T2.[AcctName]
ORDER BY 
    T0.[Category] DESC,
    T1.[AcctCode],
    T0.[Code],
    T0.[DocDate],
    T0.[DocNum],
    T0.[SrcObjType],
    T0.[CrditDebit]
