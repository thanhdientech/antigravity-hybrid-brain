SELECT
    T0.[DocEntry],
    T0.[DocNum],
    T0.[DocType],
    T0.[CANCELED],
    T0.[Handwrtten],
    T0.[Printed],
    T0.[DocStatus],
    T0.[InvntSttus],
    T0.[Transfered],
    T0.[ObjType],
    CASE T0.[ObjType]
        WHEN '13' THEN 'A/R Invoice'
        WHEN '14' THEN 'A/R Credit Memo'
        WHEN '15' THEN 'Delivery'
        WHEN '16' THEN 'Return'
        WHEN '17' THEN 'Sales Order'
        WHEN '18' THEN 'A/P Invoice'
        WHEN '19' THEN 'A/P Credit Memo'
        WHEN '20' THEN 'Goods Receipt PO'
        WHEN '21' THEN 'Goods Return'
        WHEN '22' THEN 'Purchase Order'
        WHEN '23' THEN 'Sales Quotation'
        WHEN '24' THEN 'Incoming Payment'
        WHEN '46' THEN 'Outgoing Payment'
        WHEN '59' THEN 'Goods Receipt'
        WHEN '60' THEN 'Goods Issue'
        WHEN '67' THEN 'Inventory Transfer'
        WHEN '69' THEN 'Landed Costs'
        WHEN '112' THEN 'Drafts'
        WHEN '162' THEN 'Inventory Revaluation'
        WHEN '163' THEN 'A/P Correction Invoice'
        WHEN '164' THEN 'A/P Correction Invoice Reversal'
        WHEN '165' THEN 'A/R Correction Invoice'
        WHEN '166' THEN 'A/R Correction Invoice Reversal'
        WHEN '202' THEN 'Production Order'
        WHEN '203' THEN 'A/R Down Payment'
        WHEN '204' THEN 'A/P Down Payment'
        WHEN '280' THEN 'Sales Tax Invoice'
        WHEN '281' THEN 'Purchase Tax Invoice'
        WHEN '140' THEN 'Payment Draft'
        WHEN '1470000060' THEN 'Credit Memo (FA)'
        WHEN '1470000049' THEN 'Capitalization'
        WHEN '1470000065' THEN 'Inventory Counting'
        WHEN '1470000113' THEN 'Purchase Request'
        WHEN '310000001' THEN 'Inventory Opening Balance'
        WHEN '1250000001' THEN 'Inventory Transfer Request'
        WHEN '540000006' THEN 'Purchase Quotation'
        ELSE 'Other'
    END AS ObjTypeName,
    T0.[DocDate],
    T0.[DocDueDate],
    T0.[CardCode],
    T0.[CardName],
    T0.[Address],
    T0.[NumAtCard],
    T0.[VatPercent],
    T0.[VatSum],
    T0.[VatSumFC],
    T0.[DiscPrcnt],
    T0.[DiscSum],
    T0.[DiscSumFC],
    T0.[DocCur],
    T0.[DocRate],
    T0.[DocTotal],
    T0.[DocTotalFC],
    T0.[PaidToDate],
    T0.[PaidFC],
    T0.[GrosProfit],
    T0.[GrosProfFC],
    T0.[Ref1],
    T0.[Ref2],
    T0.[Comments],
    T0.[JrnlMemo],
    T0.[TransId],
    T0.[ReceiptNum],
    T0.[GroupNum],
    T0.[DocTime],
    T0.[SlpCode],
    T0.[TrnspCode],
    T0.[PartSupply],
    T0.[Confirmed],
    T0.[UpdateDate],
    T0.[CreateDate],
    T0.[TaxDate],
    T0.[Series],
    T0.[DataSource],
    T0.[Address2],
    T0.[Project],
    T0.[DocSubType],
    T0.[OwnerCode],
    T0.[BPChCode],
    T0.[BPChCntc],
    T0.[PayToCode],
    T0.[UserSign],
    U1.[USER_CODE] AS CreateUserCode,
    U1.[U_NAME] AS CreateUserName
FROM [dbo].[ODRF] T0
LEFT JOIN [dbo].[OUSR] U1 ON T0.[UserSign] = U1.[USERID]
WHERE T0.[DocEntry] NOT IN (
        SELECT DISTINCT U0.[DocEntry]
        FROM [dbo].[ODRF] U0
        INNER JOIN [dbo].[ORCP] U1 ON U1.[DraftEntry] = U0.[DocEntry]
        WHERE U1.[IsRemoved] = '0'
    )
	  AND (
        @username IS NULL
        OR @username = ''
        OR U1.[USER_CODE] LIKE '%' + @username + '%'
    )
ORDER BY
    T0.[ObjType],
    T0.[DocNum],
    T0.[CreateDate],
    T0.[CreateTS],
    T0.[UpdateDate],
    T0.[UpdateTS]