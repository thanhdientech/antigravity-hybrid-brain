SELECT
    T0.Number,
    T0.RefDate,
    T0.TransType,
    ISNULL(T4.Description, 'Other') AS TransTypeName,
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
    T1.Ref1,
    T1.Ref2,
    T0.U_belnrid AS 'WO',
    T0.U_belposid AS 'WO POS'
FROM OJDT T0
    INNER JOIN JDT1 T1 ON T0.TransId = T1.TransId
    LEFT JOIN OACT T2 ON T1.Account = T2.AcctCode
    LEFT JOIN (
        SELECT 
            'OINV' AS TableName, 'A/R Invoice' AS Description, '13' AS ObjectType
            UNION ALL SELECT 'ORIN', 'A/R Credit Memo', '14'
            UNION ALL SELECT 'ODLN', 'Delivery', '15'
            UNION ALL SELECT 'ORDN', 'Returns', '16'
            UNION ALL SELECT 'ORDR', 'Sales Order', '17'
            UNION ALL SELECT 'OPCH', 'A/P Invoice', '18'
            UNION ALL SELECT 'ORPC', 'A/P Credit Memo', '19'
            UNION ALL SELECT 'OPDN', 'Goods Receipt PO', '20'
            UNION ALL SELECT 'ORPD', 'Goods Return', '21'
            UNION ALL SELECT 'OPOR', 'Purchase Order', '22'
            UNION ALL SELECT 'OQUT', 'Sales Quotation', '23'
            UNION ALL SELECT 'ORCT', 'Incoming Payment', '24'
            UNION ALL SELECT 'OVPM', 'Outgoing Payments', '46'
            UNION ALL SELECT 'OIGN', 'Goods Receipt', '59'
            UNION ALL SELECT 'OIGE', 'Goods Issue', '60'
            UNION ALL SELECT 'OWTR', 'Inventory Transfer', '67'
            UNION ALL SELECT 'OIPF', 'Landed Costs', '69'
            UNION ALL SELECT 'OENT', 'Shipping Types', '88'
            UNION ALL SELECT 'OSAL', 'Outgoing', '89'
            UNION ALL SELECT 'OTRA', 'Transition', '90'
            UNION ALL SELECT 'ODRF', 'Drafts', '112'
            UNION ALL SELECT 'OCIN', 'A/R Correction Invoice', '132'
            UNION ALL SELECT 'OPDF', 'Payment Draft', '140'
            UNION ALL SELECT 'OMRV', 'Inventory Revaluation', '162'
            UNION ALL SELECT 'OCPI', 'A/P Correction Invoice', '163'
            UNION ALL SELECT 'OCPV', 'A/P Correction Invoice Reversal', '164'
            UNION ALL SELECT 'OCSI', 'A/R Correction Invoice', '165'
            UNION ALL SELECT 'OCSV', 'A/R Correction Invoice Reversal', '166'
            UNION ALL SELECT 'OWOR', 'Production Order', '202'
            UNION ALL SELECT 'ODPI', 'A/R Down Payment', '203'
            UNION ALL SELECT 'ODPO', 'A/P Down Payment', '204'
            UNION ALL SELECT 'ORCM', 'Recommendation Data', '213'
            UNION ALL SELECT 'OTSI', 'Sales Tax Invoice', '280'
            UNION ALL SELECT 'OTPI', 'Purchase Tax Invoice', '281'
            UNION ALL SELECT 'ODRF', 'Stock Transfer Draft', '1179'
            UNION ALL SELECT 'OIQR', 'Inventory Posting', '10000071'
            UNION ALL SELECT 'OIQI', 'Inventory Opening Balance', '310000001'
            UNION ALL SELECT 'OTCX', 'Tax Code Determination', '540000005'
            UNION ALL SELECT 'OPQT', 'Purchase Quotation', '540000006'
            UNION ALL SELECT 'OWTQ', 'Inventory Transfer Request', '1250000001'
            UNION ALL SELECT 'OACQ', 'Capitalization', '1470000049'
            UNION ALL SELECT 'OACD', 'Credit Memo', '1470000060'
            UNION ALL SELECT 'OINC', 'Inventory Counting', '1470000065'
            UNION ALL SELECT 'OPRQ', 'Purchase Request', '1470000113'
            UNION ALL SELECT 'OJDT', 'Journal Entry', '30'
            UNION ALL SELECT 'OPEN', 'OPENING BALANCE', '-2'
    ) T4 ON T1.TransType = T4.ObjectType
WHERE
    T0.RefDate >= @StartDate
    AND T0.RefDate <= @EndDate
    AND (@Number = '' OR T0.Number LIKE '%' + @Number + '%')
    AND (@Account = '' OR T1.Account LIKE '%' + @Account + '%')
    AND (@BP = '' OR T1.ShortName LIKE '%' + @BP + '%')

order by T0.Number
