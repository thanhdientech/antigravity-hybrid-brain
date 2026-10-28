SELECT 
    --MIN(T0.[TransNum])      AS TransNum,
    MIN(T0.[TransType])     AS [Object Type],
    CASE MIN(T0.[TransType])
        WHEN 20 THEN N'GRPO'
        WHEN 21 THEN N'GRPO Return'
        WHEN 15 THEN N'Delivery'
        WHEN 16 THEN N'Return'
        WHEN 59 THEN N'Goods Receipt'
        WHEN 60 THEN N'Goods Issue'
        WHEN 67 THEN N'Inventory Transfer'
        WHEN 10000071 THEN N'Inventory Posting'
        WHEN 310000001 THEN N'Inventory Opening Balance'
        ELSE N'Unknown'
    END                      AS [Object Type Name],
    MIN(T0.[CreatedBy])     AS [Trans No.],
    MIN(T0.[BASE_REF])      AS [Base Ref],
    MIN(T0.[DocLineNum]) + 1 AS [Doc Line Num],
    MIN(T0.[DocDate])       AS [Doc Date],
    MIN(T0.[DocDueDate])    AS [Due Date],
    MIN(T0.[CardCode])      AS [Card Code],
    MIN(T0.[CardName])      AS [Card Name],
    MIN(T0.[Ref1])          AS [Ref1],
    MIN(T0.[Ref2])          AS [Ref2],
    MIN(T0.[Comments])      AS [Comments],
    MIN(T0.[JrnlMemo])      AS [Journal Memo],
    --MIN(T0.[DocTime])       AS DocTime,
    MIN(T0.[ItemCode])      AS [Item Code],
    MIN(T0.[Dscription])    AS [Description],
    MIN(T0.[InvPLInQty])    AS [In Qty],
    MIN(T0.[InvPLOutQty])   AS [Out Qty],
	SUM(T2.[Quantity] + T2.[TmpQty]) AS [Total Qty],
    MIN(T0.[InvPLPrice])    AS [Price],
    MIN(T0.[Currency])      AS [Currency],
    MIN(T0.[Rate])          AS [Rate],
    MIN(T0.[VendorNum])     AS [Vendor Num],
    MIN(T0.[SerialNum])     AS [Serial Num],
    MIN(T0.[Warehouse])     AS [Warehouse],
    --MIN(T0.[TreeType])      AS TreeType,
    MIN(T0.[SlpCode])       AS [Sales Employee],
    MIN(T0.[TaxDate])       AS [Tax Date],
    --MIN(T0.[DataSource])    AS DataSource,
    MIN(T0.[PrjCode])      AS [Project Code],
    MIN(T0.[UserSign])     AS [User Code],
    OU.[U_NAME]            AS [User Name],
    MIN(T0.[BlockNum])     AS [Block Num],
    --MIN(T0.[ImportLog])    AS ImportLog,
    MIN(T0.[UseDocPric])    AS [Use Doc Price],
    MIN(T0.[Location])     AS [Location],
    MIN(T0.[CalcPrice])    AS [Calc Price],
    MIN(T0.[OpenQty])     AS [Open Qty],
    --MIN(T0.[Instance])     AS Instance,
    --MIN(T0.[LastInst])     AS LastInst,
    MIN(T0.[RevalTotal])    AS [Reval Total],
    --MIN(T0.[BaseCurr])     AS BaseCurr,
    --MIN(T0.[ApplObj])     AS ApplObj,
    --MIN(T0.[AppObjAbs])    AS AppObjAbs,
    --MIN(T0.[AppObjType])   AS AppObjType,
    --MIN(T0.[StockAct])     AS StockAccount,
    --MIN(T0.[TrnsfrAct])    AS TransferAccount,
    --MIN(T0.[PriceDifAc])   AS PriceDiffAccount,
    --MIN(T0.[VarianceAc])   AS VarianceAccount,
    --MIN(T0.[ReturnAct])    AS ReturnAccount,
    --MIN(T0.[ExcRateAct])   AS ExchangeRateAccount,
    --MIN(T0.[ClearAct])     AS ClearingAccount,
    --MIN(T0.[CostAct])     AS CostAccount,
    --MIN(T0.[WipAct])      AS WipAccount,
    MIN(T0.[TransValue])  AS [Trans Value],
    MIN(T0.[Balance])     AS [Balance],
    --MIN(T0.[CreateDate])  AS CreateDate,
    --MIN(T0.[BaseLine])    AS BaseLine,
    MIN(T0.[PriceDiff])   AS [Price Diff],
    MIN(T0.[TransSeq])    AS [Trans Seq],
    MIN(T0.[InvntAct])    AS [Inventory Account],
    --MIN(T0.[RemMethod])   AS RemMethod,
    --MIN(T0.[OpenValue])   AS OpenValue,
    --MIN(T0.[SubLineNum])  AS SubLineNum,
    --MIN(T0.[AppObjLine])  AS AppObjLine,
    --MIN(T0.[Expenses])    AS Expenses,
    --MIN(T0.[OpenExp])     AS OpenExpenses,
    --MIN(T0.[Allocation])  AS Allocation,
    --MIN(T0.[OpenAlloc])   AS OpenAllocation,
    --MIN(T0.[ExpAlloc])    AS ExpAllocation,
    --MIN(T0.[OExpAlloc])   AS OtherExpAllocation,
    --MIN(T0.[OpenPDiff])   AS OpenPriceDiff,
    --MIN(T0.[ExchDiff])    AS ExchangeDiff,
    --MIN(T0.[OpenEDiff])   AS OpenExchangeDiff,
    --MIN(T0.[NegInvAdjs])  AS NegInvAdjustments,
    --MIN(T0.[OpenNegInv])  AS OpenNegInv,
    --MIN(T0.[NegStckAct])  AS NegStockAccount,
    --MIN(T0.[BTransVal])   AS BTransValue,
    --MIN(T0.[VarVal])      AS VarianceValue,
    --MIN(T0.[BExpVal])     AS BExpenseValue,
    --MIN(T0.[CogsVal])     AS CogsValue,
    --MIN(T0.[BNegAVal])    AS BNegAdjustValue,
    --MIN(T0.[IOffIncAcc])  AS IOtherIncomeAccount,
    --MIN(T0.[IOffIncVal])  AS IOtherIncomeValue,
    --MIN(T0.[DOffDecAcc])  AS DOffDecAccount,
    --MIN(T0.[DOffDecVal])  AS DOffDecValue,
    --MIN(T0.[DecAcc])      AS DecAccount,
    --MIN(T0.[DecVal])      AS DecValue,
    --MIN(T0.[WipVal])      AS WipValue,
    --MIN(T0.[WipVarAcc])   AS WipVarianceAccount,
    --MIN(T0.[WipVarVal])   AS WipVarianceValue,
    --MIN(T0.[IncAct])      AS IncreaseAccount,
    --MIN(T0.[IncVal])      AS IncreaseValue,
    --MIN(T0.[ExpCAcc])     AS ExpenseClearingAccount,
    --MIN(T0.[CostMethod])  AS CostMethod,
    MIN(T0.[OcrCode])     AS [Cost Center],
    --MIN(T0.[BaseQty])     AS BaseQty,
    --MIN(T0.[PrevTrans])   AS PrevTrans,
    --MIN(T0.[HTransSeq])   AS HTransSeq,
    --MIN(T0.[OcrCode2])    AS OcrCode2,
    --MIN(T0.[OcrCode3])    AS OcrCode3,
    --MIN(T0.[OcrCode4])    AS OcrCode4,
    --MIN(T0.[OcrCode5])    AS OcrCode5,
    --MIN(T0.[StgSeqNum])   AS StageSeqNum,
    --MIN(T0.[StgEntry])    AS StageEntry,
    --MIN(T0.[StgDesc])     AS StageDesc,
    MIN(T1.[InvntryUom])  AS [Inventory UoM],
    --MIN(4)               AS FixedValue4,
    MIN(T3.[DistNumber])  AS [Batch Number],
    MIN(T3.[MnfSerial])   AS [Mnf Serial],
    MIN(T3.[LotNumber])   AS [Lot Number],
    MIN(T4.[DistNumber])  AS [Serial Dist Number],
    MIN(T4.[MnfSerial])   AS [Serial Mnf Serial],
    MIN(T4.[LotNumber])   AS [Serial Lot Number]
    --MIN(T3.[AbsEntry])    AS AbsEntryBatch,
    --MIN(T4.[AbsEntry])    AS AbsEntrySerial,
    --MIN(T2.[ManagedBy])   AS ManagedBy,
    
    --MIN(T5.[BinCode])     AS BinCode,
    --MIN(T2.[AbsEntry])    AS AbsEntry,
    --MIN(T2.[MdAbsEntry])  AS MdAbsEntry,
    --MIN(T0.[InvPLMessageID]) AS InvPLMessageID,
    --COUNT(DISTINCT T5.[BinCode]) AS BinCount
FROM [dbo].[B1_OinmWithBinTransfer] T0
INNER JOIN [dbo].[OITM] T1
    ON T0.[ItemCode] = T1.[ItemCode]
    AND T0.[SnBType] IN (10000044, 10000045)
LEFT JOIN [dbo].[B1_InvPostListILWithBinView] T2
    ON T2.[ApplyType] = T0.[TransType]
    AND T2.[ApplyEntry] = T0.[CreatedBy]
    AND T2.[ApplyLine] = T0.[DocLineNum]
    AND T2.[AppSubLine] = T0.[InvPLSubLineNum]
    AND (T2.[StockQty] = 0 OR (T2.[StockQty] <> 0 AND T2.[MessageID] = T0.[InvPLMessageID]) OR T2.[MessageID] IS NULL)
    AND T2.[LocCode] = T0.[Warehouse]
    AND T2.[ItemCode] = T0.[ItemCode]
LEFT JOIN [dbo].[OBTN] T3
    ON T3.[AbsEntry] = T2.[MdAbsEntry]
    AND T2.[ManagedBy] = 10000044
LEFT JOIN [dbo].[OSRN] T4
    ON T4.[AbsEntry] = T2.[MdAbsEntry]
    AND T2.[ManagedBy] = 10000045
LEFT JOIN [dbo].[OUSR] OU
    ON T0.[UserSign] = OU.[USERID]
LEFT JOIN [dbo].[OBIN] T5
    ON T5.[AbsEntry] = T2.[BinAbs]
WHERE T0.[ItemCode] = @Itemcode
    AND T0.[DocDate] <= @EndDate
    AND T0.[DocDate] >= @StartDate
    AND (T0.[InQty] <> 0 OR T0.[OutQty] <> 0)
    AND T0.[InvPLLayerID] = 0
    AND ((T2.[Quantity] + T2.[TmpQty]) <> 0 OR T2.[Quantity] IS NULL)
    AND (
        T2.[MessageID] IS NOT NULL
        OR T0.[CostMethod] <> 'B'
        OR T0.[CostMethod] IS NULL
        OR T0.[TransType] NOT IN (10000071, 310000001)
        OR (
            T0.[CostMethod] = 'B'
            AND T2.[MessageID] IS NULL
            AND T0.[TransType] IN (10000071, 310000001)
            AND EXISTS (
                SELECT U0.[MessageID]
                FROM [dbo].[ILM1] U0
                WHERE T0.[InvPLMessageID] = U0.[MessageID]
                    AND T2.[MdAbsEntry] = U0.[MdAbsEntry]
                    AND T2.[ItemCode] = U0.[ItemCode]
            )
        )
    )
GROUP BY 
    T0.[InvPLMessageID], 
    T0.[TransNum], 
    T0.[TransSeq],
    OU.[U_NAME]
ORDER BY MIN(T0.[DocDate]) DESC
