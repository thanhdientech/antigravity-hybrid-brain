SET ROWCOUNT 0;

SELECT 
    T0.DocNum AS [Downpayment DocNum],
    T0.DocDate AS [Doc Date],
    CASE 
        WHEN T0.DocStatus = 'O' THEN 'Open'
        WHEN T0.DocStatus = 'C' AND T0.CANCELED = 'Y' THEN 'Canceled'
        ELSE 'Closed'
    END AS [Doc Status],
    T0.NumAtCard,
    T0.Comments,
    T0.DocTotal AS [Downpayment Amount],
    T2.DocNum AS [PO DocNum],
    T2.DocTotal AS [PO Amount],
    ISNULL(T4.AppliedAmount, 0) AS [AP Credit Memo Amount],
    ISNULL(T4.CreditMemoDocNums, '') AS [AP Credit Memo DocNums],
    (T2.DocTotal - T0.DocTotal + ISNULL(T4.AppliedAmount, 0)) AS [Left Amount]
FROM ODPO T0
INNER JOIN DPO1 T1 ON T0.DocEntry = T1.DocEntry
INNER JOIN OPOR T2 ON T1.BaseRef = T2.DocNum
LEFT JOIN (
    SELECT 
        R1.BaseRef AS DownpaymentDocNum,
        SUM(R0.DocTotal) AS AppliedAmount,
        STUFF((
            SELECT ', ' + CAST(R2.DocNum AS NVARCHAR(20))
            FROM ORPC R2
            INNER JOIN RPC1 R3 ON R2.DocEntry = R3.DocEntry
            WHERE R3.BaseRef = R1.BaseRef AND R2.CANCELED = 'N'
            FOR XML PATH(''), TYPE
        ).value('.', 'NVARCHAR(MAX)'), 1, 2, '') AS CreditMemoDocNums
    FROM RPC1 R1
    INNER JOIN ORPC R0 ON R1.DocEntry = R0.DocEntry
    WHERE R0.CANCELED = 'N'
    GROUP BY R1.BaseRef
) T4 ON T4.DownpaymentDocNum = T0.DocNum
WHERE 
    T0.CANCELED = 'N'
ORDER BY 
    T0.DocNum;
