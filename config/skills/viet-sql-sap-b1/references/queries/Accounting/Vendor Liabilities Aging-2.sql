SELECT 
    T.DocEntry,
    T.DocDate,
    T.DoccumentDate,
    T.DocDueDate,
    T.CardCode,
    T.CardName,
    T.InvoiceNo,
    T.Comments,
    T.CtlAccount,
    T.AcctName,
    T.DocCur,
    T.DocTotal,
    T.Paid,
    T.RemainAmt,
    T.DocTotalFC,
    T.PaidFC,
    T.RemainAmtFC,
    T.CreateName,
    T.DocStatus,
    T.Overduedate
FROM 
(
    SELECT DISTINCT 
        T0.DocEntry,
        T0.DocDate,
        T0.TaxDate       AS DoccumentDate,
        T0.DocDueDate,
        T0.CardCode,
        T0.CardName,
        T0.NumAtCard     AS InvoiceNo,
        T0.Comments,
        T0.CtlAccount,
        T2.AcctName,
        T0.DocCur,
        T0.DocTotal,
        T0.PaidSum       AS Paid,
        (T0.DocTotal - T0.PaidSum) AS RemainAmt,
        T0.DocTotalFC,
        T0.PaidSumFC     AS PaidFC,
        (T0.DocTotalFC - T0.PaidSumFC) AS RemainAmtFC,
        T3.U_NAME        AS CreateName,
        T0.DocStatus,
        DATEDIFF(DAY, T0.DocDueDate, @DueDate) AS Overduedate
    FROM OPCH T0 WITH (NOLOCK)
        LEFT JOIN PCH1 T1 WITH (NOLOCK) ON T1.DocEntry = T0.DocEntry
        LEFT JOIN OACT T2 WITH (NOLOCK) ON T2.AcctCode = T0.CtlAccount
        LEFT JOIN OUSR T3 WITH (NOLOCK) ON T3.USERID = T0.UserSign
        LEFT JOIN OCTG T30 WITH (NOLOCK) ON T30.GroupNum = T0.GroupNum
        LEFT JOIN OCRD T4 WITH (NOLOCK) ON T4.CardCode = T0.CardCode
    WHERE 
        T0.DocDate BETWEEN @StartDate AND @EndDate
        AND T0.CANCELED = 'N'
        AND T0.DocStatus = 'O'
    GROUP BY 
        T0.DocEntry, 
        T0.DocDate,
        T0.TaxDate, 
        T0.DocDueDate,
        T0.CardCode,
        T0.CardName,
        T0.NumAtCard,
        T0.Comments,
        T0.CtlAccount,
        T2.AcctName,
        T0.DocCur,
        T0.DocTotal,
        T0.PaidSum,
        T0.DocTotalFC,
        T0.PaidSumFC,
        T3.U_NAME,
        T0.DocStatus,
        T30.ExtraDays,
        T30.ExtraMonth
) T
ORDER BY T.DocDate, T.DocEntry
