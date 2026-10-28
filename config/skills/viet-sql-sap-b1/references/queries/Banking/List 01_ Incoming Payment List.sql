-- ================================
-- 第一段：收款单，预收款 (ORCT - On Account)
-- ================================
SELECT 
    T0.DocDate,
    T0.DocEntry,
    T0.CardCode,
    T0.CardName,
    T0.BpAct AS AcctCode,
    0 AS Debit,
    0 AS FCDebit,
    CASE 
        WHEN ISNULL(T0.TrsfrAcct, '') = '' THEN T0.CashAcct
        ELSE T0.TrsfrAcct
    END AS BankAcct,
    T0.NoDocSum AS Credit,
    T0.NoDocSumFC AS FCCredit,
    T0.JrnlMemo,
    NULL AS Ref1,
    NULL AS Ref2,
    NULL AS JEID,
    NULL AS OriginalDoc,
    N'Adv' AS DocType
FROM ORCT T0 WITH (NOLOCK)
WHERE 
    T0.DocDate BETWEEN @StartDate AND @EndDate
    AND ISNULL(T0.NoDocSum, 0) <> 0
    AND T0.Canceled = 'N'

UNION ALL

-- ================================
-- 第二段：收款单，结清发票 (Payment on Account)
-- ================================
SELECT 
    T0.DocDate,
    T0.DocEntry,
    T0.CardCode,
    T0.CardName,
    T3.Account AS BpAcct,
    0 AS Debit,
    0 AS FCDebit,
    CASE 
        WHEN ISNULL(T0.TrsfrAcct, '') = '' THEN T0.CashAcct
        ELSE T0.TrsfrAcct
    END AS BankAcct,
    T2.BfDcntSum AS Credit,
    T2.AppliedFC AS FCCredit,
    T0.JrnlMemo,
    T1.Ref1,
    T1.Ref2,
    T1.TransId AS JEID,
    T2.BaseAbs AS OriginalDoc,
    CASE 
        WHEN T2.InvType = '30' THEN 'JE'  -- Journal Entry
        WHEN T2.InvType = '13' THEN 'AR'  -- A/R Invoice
        ELSE ''
    END AS DocType
FROM RCT2 T2 WITH (NOLOCK)
    JOIN ORCT T0 WITH (NOLOCK) ON T0.DocEntry = T2.DocNum AND T0.Canceled = 'N'
    JOIN OJDT T1 WITH (NOLOCK) ON T1.TransId = T2.DocTransId
    LEFT JOIN JDT1 T3 WITH (NOLOCK) 
        ON T3.BaseRef = T2.DocNum 
        AND T3.ShortName = T0.CardCode 
        AND T3.TransType = '24'
WHERE 
    T0.DocDate BETWEEN @StartDate AND @EndDate

ORDER BY 
    DocEntry,
    DocDate
