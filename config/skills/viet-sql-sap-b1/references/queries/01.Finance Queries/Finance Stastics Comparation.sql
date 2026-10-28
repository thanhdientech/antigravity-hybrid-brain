SELECT
(
(SELECT ISNULL(SUM(CASE T0.CANCELED WHEN 'C' THEN -(T0.DocTotal-T0.VatSum+T0.DpmAmnt-T0.TotalExpns-T0.RoundDif) ELSE (T0.DocTotal-T0.VatSum+T0.DpmAmnt-T0.TotalExpns-T0.RoundDif) END),0) FROM OINV T0 WITH (NOLOCK) WHERE T0.DocDate BETWEEN @CurrentStart AND @CurrentEnd)
-
(SELECT ISNULL(SUM(CASE T0.CANCELED WHEN 'C' THEN -(T0.DocTotal-T0.VatSum+T0.DpmAmnt-T0.TotalExpns-T0.RoundDif) ELSE (T0.DocTotal-T0.VatSum+T0.DpmAmnt-T0.TotalExpns-T0.RoundDif) END),0) FROM ORIN T0 WITH (NOLOCK) WHERE T0.DocDate BETWEEN @CurrentStart AND @CurrentEnd
AND NOT EXISTS (SELECT 1 FROM RIN1 TS1 WHERE TS1.DocEntry = T0.DocEntry AND TS1.BaseType = 203))
) AS 'SalesThisYear',
(
(SELECT ISNULL(SUM(CASE T0.CANCELED WHEN 'C' THEN -T0.GrosProfit ELSE T0.GrosProfit END),0) FROM OINV T0 WITH (NOLOCK) WHERE T0.DocDate BETWEEN @CurrentStart AND @CurrentEnd)
-
(SELECT ISNULL(SUM(CASE T0.CANCELED WHEN 'C' THEN -T0.GrosProfit ELSE T0.GrosProfit END),0) FROM ORIN T0 WITH (NOLOCK) WHERE T0.DocDate BETWEEN @CurrentStart AND @CurrentEnd
AND NOT EXISTS (SELECT 1 FROM RIN1 TS1 WHERE TS1.DocEntry = T0.DocEntry AND TS1.BaseType = 203))
) AS 'GrossThisYear',
(
(SELECT ISNULL(SUM(CASE T0.CANCELED WHEN 'C' THEN -(T0.DocTotal-T0.VatSum+T0.DpmAmnt-T0.TotalExpns-T0.RoundDif) ELSE (T0.DocTotal-T0.VatSum+T0.DpmAmnt-T0.TotalExpns-T0.RoundDif) END),0) FROM OINV T0 WITH (NOLOCK) WHERE T0.DocDate BETWEEN @PreviousStart AND @PreviousEnd)
-
(SELECT ISNULL(SUM(CASE T0.CANCELED WHEN 'C' THEN -(T0.DocTotal-T0.VatSum+T0.DpmAmnt-T0.TotalExpns-T0.RoundDif) ELSE (T0.DocTotal-T0.VatSum+T0.DpmAmnt-T0.TotalExpns-T0.RoundDif) END),0) FROM ORIN T0 WITH (NOLOCK) WHERE T0.DocDate BETWEEN @PreviousStart AND @PreviousEnd
AND NOT EXISTS (SELECT 1 FROM RIN1 TS1 WHERE TS1.DocEntry = T0.DocEntry AND TS1.BaseType = 203))
) AS 'SalesLastYear',
(
(SELECT ISNULL(SUM(CASE T0.CANCELED WHEN 'C' THEN -T0.GrosProfit ELSE T0.GrosProfit END),0) FROM OINV T0 WITH (NOLOCK) WHERE T0.DocDate BETWEEN @PreviousStart AND @PreviousEnd)
-
(SELECT ISNULL(SUM(CASE T0.CANCELED WHEN 'C' THEN -T0.GrosProfit ELSE T0.GrosProfit END),0) FROM ORIN T0 WITH (NOLOCK) WHERE T0.DocDate BETWEEN @PreviousStart AND @PreviousEnd
AND NOT EXISTS (SELECT 1 FROM RIN1 TS1 WHERE TS1.DocEntry = T0.DocEntry AND TS1.BaseType = 203))
) AS 'GrossLastYear',
(
(SELECT ISNULL(SUM(CASE T0.CANCELED WHEN 'C' THEN -(T0.DocTotal-T0.VatSum+T0.DpmAmnt-T0.TotalExpns-T0.RoundDif) ELSE (T0.DocTotal-T0.VatSum+T0.DpmAmnt-T0.TotalExpns-T0.RoundDif) END),0) FROM OINV T0 WITH (NOLOCK) WHERE T0.DocDate BETWEEN @StartOfCurrentMonth AND @CurrentEnd)
-
(SELECT ISNULL(SUM(CASE T0.CANCELED WHEN 'C' THEN -(T0.DocTotal-T0.VatSum+T0.DpmAmnt-T0.TotalExpns-T0.RoundDif) ELSE (T0.DocTotal-T0.VatSum+T0.DpmAmnt-T0.TotalExpns-T0.RoundDif) END),0) FROM ORIN T0 WITH (NOLOCK) WHERE T0.DocDate BETWEEN @StartOfCurrentMonth AND @CurrentEnd
AND NOT EXISTS (SELECT 1 FROM RIN1 TS1 WHERE TS1.DocEntry = T0.DocEntry AND TS1.BaseType = 203))
) AS 'SalesThisMonth',
(
(SELECT ISNULL(SUM(CASE T0.CANCELED WHEN 'C' THEN -T0.GrosProfit ELSE T0.GrosProfit END),0) FROM OINV T0 WITH (NOLOCK) WHERE T0.DocDate BETWEEN @StartOfCurrentMonth AND @CurrentEnd)
-
(SELECT ISNULL(SUM(CASE T0.CANCELED WHEN 'C' THEN -T0.GrosProfit ELSE T0.GrosProfit END),0) FROM ORIN T0 WITH (NOLOCK) WHERE T0.DocDate BETWEEN @StartOfCurrentMonth AND @CurrentEnd
AND NOT EXISTS (SELECT 1 FROM RIN1 TS1 WHERE TS1.DocEntry = T0.DocEntry AND TS1.BaseType = 203))
) AS 'GrossThisMonth',
(
(SELECT ISNULL(SUM(CASE T0.CANCELED WHEN 'C' THEN -(T0.DocTotal-T0.VatSum+T0.DpmAmnt-T0.TotalExpns-T0.RoundDif) ELSE (T0.DocTotal-T0.VatSum+T0.DpmAmnt-T0.TotalExpns-T0.RoundDif) END),0) FROM OINV T0 WITH (NOLOCK) WHERE T0.DocDate BETWEEN @StartOfPreviousMonth AND @SameDayLastMonth)
-
(SELECT ISNULL(SUM(CASE T0.CANCELED WHEN 'C' THEN -(T0.DocTotal-T0.VatSum+T0.DpmAmnt-T0.TotalExpns-T0.RoundDif) ELSE (T0.DocTotal-T0.VatSum+T0.DpmAmnt-T0.TotalExpns-T0.RoundDif) END),0) FROM ORIN T0 WITH (NOLOCK) WHERE T0.DocDate BETWEEN @StartOfPreviousMonth AND @SameDayLastMonth
AND NOT EXISTS (SELECT 1 FROM RIN1 TS1 WHERE TS1.DocEntry = T0.DocEntry AND TS1.BaseType = 203))
) AS 'SalesLastMonth',
(
(SELECT ISNULL(SUM(CASE T0.CANCELED WHEN 'C' THEN -T0.GrosProfit ELSE T0.GrosProfit END),0) FROM OINV T0 WITH (NOLOCK) WHERE T0.DocDate BETWEEN @StartOfPreviousMonth AND @SameDayLastMonth)
-
(SELECT ISNULL(SUM(CASE T0.CANCELED WHEN 'C' THEN -T0.GrosProfit ELSE T0.GrosProfit END),0) FROM ORIN T0 WITH (NOLOCK) WHERE T0.DocDate BETWEEN @StartOfPreviousMonth AND @SameDayLastMonth
AND NOT EXISTS (SELECT 1 FROM RIN1 TS1 WHERE TS1.DocEntry = T0.DocEntry AND TS1.BaseType = 203))
) AS 'GrossLastMonth',
(SELECT COUNT(*) FROM OINV T0 WITH (NOLOCK) WHERE T0.DocDate BETWEEN @StartOfCurrentMonth AND @CurrentEnd) AS 'InvoicesThisMonth',
(SELECT COUNT(*) FROM OINV T0 WITH (NOLOCK) WHERE T0.DocDate BETWEEN @StartOfPreviousMonth AND @SameDayLastMonth) AS 'InvoicesLastMonth',
(SELECT COUNT(*) FROM ORIN T0 WITH (NOLOCK) WHERE T0.DocDate BETWEEN @StartOfCurrentMonth AND @CurrentEnd) AS 'CreditNotesThisMonth',
(SELECT COUNT(*) FROM ORIN T0 WITH (NOLOCK) WHERE T0.DocDate BETWEEN @StartOfPreviousMonth AND @SameDayLastMonth) AS 'CreditNotesLastMonth',
(SELECT COUNT(*) FROM OINV T0 WITH (NOLOCK) WHERE T0.DocDate BETWEEN @CurrentStart AND @CurrentEnd) AS 'InvoicesThisYear',
(SELECT COUNT(*) FROM OINV T0 WITH (NOLOCK) WHERE T0.DocDate BETWEEN @PreviousStart AND @PreviousEnd) AS 'InvoicesLastYear',
(SELECT COUNT(*) FROM ORIN T0 WITH (NOLOCK) WHERE T0.DocDate BETWEEN @CurrentStart AND @CurrentEnd) AS 'CreditNotesThisYear',
(SELECT COUNT(*) FROM ORIN T0 WITH (NOLOCK) WHERE T0.DocDate BETWEEN @PreviousStart AND @PreviousEnd) AS 'CreditNotesLastYear'
