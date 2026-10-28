SELECT
    T1.[DocNum],
    T0.[VisOrder],
    T0.[ItemCode],
    T0.[ItemDesc],
    T0.[LineStatus],
    T1.[CountDate],
    T0.[WhsCode],
    T0.[CountQty],
    T0.[Difference],
    T0.[DiffPercen],
    -- -1                       AS FixedValue,      -- 固定值 -1
    -- N'C'                     AS FixedType,       -- 固定值 'C'
    -- T0.[DocEntry],
    -- 0                        AS ZeroValue,       -- 固定值 0
    T0.[Freeze],
    -- T0.[BinEntry],
    -- T2.[BinCode],
    T0.[InWhsQty],
    T0.[Counted],
    T0.[Remark],
    T0.[BarCode],
    T3.[InvntryUom]          AS InventoryUoMName, -- ✅ 改为显示 OITM 库存单位
    T6.[Location],
    T4.[ItmsGrpNam],
    T0.[CountTime],
    T0.[ProjCode],
    T0.[PrefVendor],
    -- T2.[AltSortCod],
    -- N''                      AS ExtraField1,     -- 空白栏位
    -- N''                      AS ExtraField2,     -- 空白栏位
    T8.[SeriesName],
    T1.[CountType],
    T1.[Ref2],
    T0.[OcrCode],
    T0.[OcrCode2],
    T0.[OcrCode3],
    T0.[OcrCode4],
    T0.[OcrCode5],
    T10.[BPLName],
    T0.[UgpEntry],
    T1.[IndvCount],
    T1.[TeamCount]
    -- T0.[ItemCode]           AS ItemCodeRepeat,  -- 之前被注释掉
    -- T12.[TotalQty],
    -- T14.[TotalQty],
    -- T16.[TotalQty],
    -- T18.[TotalQty],
    -- T20.[TotalQty],
    -- T1.[U_beas_pers_id],
    -- T1.[U_beas_version],
    -- T1.[U_beas_station],
    -- T1.[U_beas_type]
FROM [dbo].[INC1] T0
    INNER JOIN [dbo].[OINC] T1 ON T0.[DocEntry] = T1.[DocEntry]
    LEFT JOIN [dbo].[OBIN] T2 ON T0.[BinEntry] = T2.[AbsEntry]
    LEFT JOIN [dbo].[OITM] T3 ON T0.[ItemCode] = T3.[ItemCode]
    LEFT JOIN [dbo].[OITB] T4 ON T3.[ItmsGrpCod] = T4.[ItmsGrpCod]
    LEFT JOIN [dbo].[OWHS] T5 ON T5.[WhsCode] = T0.[WhsCode]
    LEFT JOIN [dbo].[OLCT] T6 ON T6.[Code] = T5.[Location]
    LEFT JOIN [dbo].[OMRC] T7 ON T7.[FirmCode] = T0.[FirmCode]
    LEFT JOIN [dbo].[NNM1] T8 ON T8.[Series] = T1.[Series]
    LEFT JOIN [dbo].[OUGP] T9 ON T9.[UgpEntry] = T0.[UgpEntry]
    LEFT JOIN [dbo].[OBPL] T10 ON T10.[BPLId] = T1.[BPLId]
    LEFT JOIN [dbo].[INC8] T11 ON T11.[DocEntry] = T0.[DocEntry] AND T11.[VisOrder] = 1
    LEFT JOIN [dbo].[INC9] T12 ON T12.[DocEntry] = T0.[DocEntry] AND T12.[LineNum] = T0.[LineNum] AND T11.[CounterNum] = T12.[CounterNum]
    LEFT JOIN [dbo].[INC8] T13 ON T13.[DocEntry] = T0.[DocEntry] AND T13.[VisOrder] = 2
    LEFT JOIN [dbo].[INC9] T14 ON T14.[DocEntry] = T0.[DocEntry] AND T14.[LineNum] = T0.[LineNum] AND T13.[CounterNum] = T14.[CounterNum]
    LEFT JOIN [dbo].[INC8] T15 ON T15.[DocEntry] = T0.[DocEntry] AND T15.[VisOrder] = 3
    LEFT JOIN [dbo].[INC9] T16 ON T16.[DocEntry] = T0.[DocEntry] AND T16.[LineNum] = T0.[LineNum] AND T15.[CounterNum] = T16.[CounterNum]
    LEFT JOIN [dbo].[INC8] T17 ON T17.[DocEntry] = T0.[DocEntry] AND T17.[VisOrder] = 4
    LEFT JOIN [dbo].[INC9] T18 ON T18.[DocEntry] = T0.[DocEntry] AND T18.[LineNum] = T0.[LineNum] AND T17.[CounterNum] = T18.[CounterNum]
    LEFT JOIN [dbo].[INC8] T19 ON T19.[DocEntry] = T0.[DocEntry] AND T19.[VisOrder] = 5
    LEFT JOIN [dbo].[INC9] T20 ON T20.[DocEntry] = T0.[DocEntry] AND T20.[LineNum] = T0.[LineNum] AND T19.[CounterNum] = T20.[CounterNum]
WHERE 
    T3.[InvntItem] = 'Y'
    AND T0.[CountDate] >= @CountingDate
    AND (T0.[LineStatus] = @Status OR ISNULL(@Status, '') = '')
