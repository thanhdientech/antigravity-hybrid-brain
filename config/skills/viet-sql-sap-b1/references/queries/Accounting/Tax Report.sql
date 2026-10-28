SELECT 
    T0.[DocEntry],
    T0.[DocNum],
    T0.[CardCode],
    T0.[CardName],
    T0.[DocDate]      AS 'PostingDate',
    T0.[TaxDate]      AS 'TaxDate',
    T0.[DocDueDate]   AS 'DocumentDate',
    T0.[NumAtCard]    AS 'CustomerRef',
    T0.[U_InvoiceNote],
    T0.[U_InvoiceType],
    T0.[DocTotal],
    T0.[VatSum],
    T0.[DocCur],
    T0.[ObjType]
FROM OINV T0
WHERE 
    (
        (@DateType = 'P' AND T0.[DocDate] >= @FromDate AND T0.[DocDate] <= @ToDate)
        OR (@DateType = 'T' AND T0.[TaxDate] >= @FromDate AND T0.[TaxDate] <= @ToDate)
        OR (@DateType = 'D' AND T0.[DocDueDate] >= @FromDate AND T0.[DocDueDate] <= @ToDate)
    )
    AND CHARINDEX('ARI', @DocTypes) > 0

UNION ALL

SELECT 
    T0.[DocEntry],
    T0.[DocNum],
    T0.[CardCode],
    T0.[CardName],
    T0.[DocDate],
    T0.[TaxDate],
    T0.[DocDueDate],
    T0.[NumAtCard],
    T0.[U_InvoiceNote],
    T0.[U_InvoiceType],
    T0.[DocTotal],
    T0.[VatSum],
    T0.[DocCur],
    T0.[ObjType]
FROM ORIN T0
WHERE 
    (
        (@DateType = 'P' AND T0.[DocDate] >= @FromDate AND T0.[DocDate] <= @ToDate)
        OR (@DateType = 'T' AND T0.[TaxDate] >= @FromDate AND T0.[TaxDate] <= @ToDate)
        OR (@DateType = 'D' AND T0.[DocDueDate] >= @FromDate AND T0.[DocDueDate] <= @ToDate)
    )
    AND CHARINDEX('ARC', @DocTypes) > 0

UNION ALL

SELECT 
    T0.[DocEntry],
    T0.[DocNum],
    T0.[CardCode],
    T0.[CardName],
    T0.[DocDate],
    T0.[TaxDate],
    T0.[DocDueDate],
    T0.[NumAtCard],
    T0.[U_InvoiceNote],
    T0.[U_InvoiceType],
    T0.[DocTotal],
    T0.[VatSum],
    T0.[DocCur],
    T0.[ObjType]
FROM ODPI T0
WHERE 
    (
        (@DateType = 'P' AND T0.[DocDate] >= @FromDate AND T0.[DocDate] <= @ToDate)
        OR (@DateType = 'T' AND T0.[TaxDate] >= @FromDate AND T0.[TaxDate] <= @ToDate)
        OR (@DateType = 'D' AND T0.[DocDueDate] >= @FromDate AND T0.[DocDueDate] <= @ToDate)
    )
    AND CHARINDEX('ARD', @DocTypes) > 0

UNION ALL

SELECT 
    T0.[DocEntry],
    T0.[DocNum],
    T0.[CardCode],
    T0.[CardName],
    T0.[DocDate],
    T0.[TaxDate],
    T0.[DocDueDate],
    T0.[NumAtCard],
    T0.[U_InvoiceNote],
    T0.[U_InvoiceType],
    T0.[DocTotal],
    T0.[VatSum],
    T0.[DocCur],
    T0.[ObjType]
FROM OPCH T0
WHERE 
    (
        (@DateType = 'P' AND T0.[DocDate] >= @FromDate AND T0.[DocDate] <= @ToDate)
        OR (@DateType = 'T' AND T0.[TaxDate] >= @FromDate AND T0.[TaxDate] <= @ToDate)
        OR (@DateType = 'D' AND T0.[DocDueDate] >= @FromDate AND T0.[DocDueDate] <= @ToDate)
    )
    AND CHARINDEX('API', @DocTypes) > 0

UNION ALL

SELECT 
    T0.[DocEntry],
    T0.[DocNum],
    T0.[CardCode],
    T0.[CardName],
    T0.[DocDate],
    T0.[TaxDate],
    T0.[DocDueDate],
    T0.[NumAtCard],
    T0.[U_InvoiceNote],
    T0.[U_InvoiceType],
    T0.[DocTotal],
    T0.[VatSum],
    T0.[DocCur],
    T0.[ObjType]
FROM ORPC T0
WHERE 
    (
        (@DateType = 'P' AND T0.[DocDate] >= @FromDate AND T0.[DocDate] <= @ToDate)
        OR (@DateType = 'T' AND T0.[TaxDate] >= @FromDate AND T0.[TaxDate] <= @ToDate)
        OR (@DateType = 'D' AND T0.[DocDueDate] >= @FromDate AND T0.[DocDueDate] <= @ToDate)
    )
    AND CHARINDEX('APC', @DocTypes) > 0

UNION ALL

SELECT 
    T0.[DocEntry],
    T0.[DocNum],
    T0.[CardCode],
    T0.[CardName],
    T0.[DocDate],
    T0.[TaxDate],
    T0.[DocDueDate],
    T0.[NumAtCard],
    T0.[U_InvoiceNote],
    T0.[U_InvoiceType],
    T0.[DocTotal],
    T0.[VatSum],
    T0.[DocCur],
    T0.[ObjType]
FROM ODPO T0
WHERE 
    (
        (@DateType = 'P' AND T0.[DocDate] >= @FromDate AND T0.[DocDate] <= @ToDate)
        OR (@DateType = 'T' AND T0.[TaxDate] >= @FromDate AND T0.[TaxDate] <= @ToDate)
        OR (@DateType = 'D' AND T0.[DocDueDate] >= @FromDate AND T0.[DocDueDate] <= @ToDate)
    )
    AND CHARINDEX('APD', @DocTypes) > 0
