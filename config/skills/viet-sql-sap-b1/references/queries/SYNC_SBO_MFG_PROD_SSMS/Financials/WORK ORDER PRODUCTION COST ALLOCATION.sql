/* ================== PARAMETERS (SSMS) ================== */
DECLARE @FromDate DATE = '2026-01-01';
DECLARE @ToDate   DATE = '2026-12-31';

/* ================== ACTUAL TIME BY WO ================== */
IF OBJECT_ID('tempdb..#WOTime') IS NOT NULL DROP TABLE #WOTime;

CREATE TABLE #WOTime
(
    BELNR_ID INT PRIMARY KEY,
    ActualTime_Minutes INT
);

DECLARE @WO INT;
DECLARE @ActualTime INT;

DECLARE WO_CURSOR CURSOR FOR
SELECT DISTINCT P.BELNR_ID
FROM BEAS_FTPOS P
WHERE(    P.ABGKZ_DATE >= @FromDate    AND P.ABGKZ_DATE < DATEADD(DAY,1,@ToDate))OR P.ABGKZ_DATE IS NULL

OPEN WO_CURSOR;
FETCH NEXT FROM WO_CURSOR INTO @WO;

WHILE @@FETCH_STATUS = 0
BEGIN
    SET @ActualTime = 0;
    
    EXEC sp_daily_hour_report 
        @FromDate, 
        @ToDate, 
        @WO, 
        @ActualTime OUTPUT;

    INSERT INTO #WOTime VALUES (@WO, ISNULL(@ActualTime,0));

    FETCH NEXT FROM WO_CURSOR INTO @WO;
END

CLOSE WO_CURSOR;
DEALLOCATE WO_CURSOR;


/* ================== TOTAL ACTUAL TIME ================== */
DECLARE @TotalActualTime INT;
SELECT @TotalActualTime = SUM(ActualTime_Minutes) FROM #WOTime;


/* ================== COST SUMMARY ================== */
IF OBJECT_ID('tempdb..#COST_SUM') IS NOT NULL DROP TABLE #COST_SUM;

SELECT
    SUM(CASE WHEN J1.Account IN (
        '622101','622102','622103','622104','622105','622106',
        '622107','622108','622109','622111','622112','622113'
    ) THEN J1.Debit - J1.Credit ELSE 0 END) AS Cost_622,

    SUM(CASE WHEN J1.Account = '627718'
        THEN J1.Debit - J1.Credit ELSE 0 END) AS Cost_627_01,

    SUM(CASE WHEN J1.Account = '627702'
        THEN J1.Debit - J1.Credit ELSE 0 END) AS Cost_627_02,

    SUM(CASE WHEN J1.Account IN (
        '627101','627102','627103','627104','627105','627106',
        '627107','627108','627109','627111','627112','627113',
        '627114','627118','627110'
    ) THEN J1.Debit - J1.Credit ELSE 0 END) AS Cost_627_03,

    SUM(CASE WHEN J1.Account IN (
        '627401','627402','627403','627404','627420','627430'
    ) THEN J1.Debit - J1.Credit ELSE 0 END) AS Cost_627_04,

    SUM(CASE WHEN J1.Account IN ('627710','627711')
        THEN J1.Debit - J1.Credit ELSE 0 END) AS Cost_627_05,

    SUM(CASE WHEN J1.Account IN ('627716','627808')
        THEN J1.Debit - J1.Credit ELSE 0 END) AS Cost_627_06,

    SUM(CASE WHEN J1.Account IN (
        '627701','627703','627704','627705','627706','627707',
        '627708','627709','627801','627802','627712','627713',
        '627714','627715','627803','627804','627805','627806',
        '627807','627809','627300','627301','627860','627870',
        '627200','627717'
    ) THEN J1.Debit - J1.Credit ELSE 0 END) AS Cost_627_07
INTO #COST_SUM
FROM JDT1 J1
INNER JOIN OJDT J0 ON J1.TransId = J0.TransId
WHERE J0.RefDate >= @FromDate  AND J0.RefDate < DATEADD(DAY,1,@ToDate)
  AND J1.TransType <> -3;


/* ================== DATA ================== */
WITH WO AS
(
    SELECT
        P.BELNR_ID,
        P.BELPOS_ID,
        P.ItemCode,
        P.U_ZNR AS DrawingNo,    IT.NumInSale,              
        P.startzeit_struktur AS StartDate,
        P.lieferdatum        AS DeliveryDate,
        P.ABGKZ_DATE         AS CloseWODate,

        IT.ItmsGrpCod,
        IG.ItmsGrpNam,
        IG.BalInvntAc AS InventoryAccount,

        P.MENGE_VERBRAUCH AS Plan_Qty,
        WT.ActualTime_Minutes,
        ISNULL(WT.ActualTime_Minutes * 1.0 / NULLIF(@TotalActualTime,0),0) AS TimeRatio

    FROM BEAS_FTPOS P
    LEFT JOIN #WOTime WT 
        ON P.BELNR_ID = WT.BELNR_ID
    LEFT JOIN OITM IT 
        ON P.ItemCode = IT.ItemCode
    LEFT JOIN OITB IG 
        ON IT.ItmsGrpCod = IG.ItmsGrpCod

    WHERE
    (
        P.ABGKZ_DATE >= @FromDate
        AND P.ABGKZ_DATE < DATEADD(DAY,1,@ToDate)
    )
    OR P.ABGKZ_DATE IS NULL
),

BOM AS
(
    SELECT
        B.BELNR_ID,
        B.BELPOS_ID,
        B.ART1_ID AS ItemCode,

        IT.ItmsGrpCod,
        IG.ItmsGrpNam,
        IG.BalInvntAc AS InventoryAccount,

        B.INPUT_QTY       AS UNIT_BOM,
        B.MENGE_JE        AS PER,
        B.ME_VERBRAUCH    AS UNIT_BOM_UOM,
        B.TOTALQUANTITY_WHUNIT AS Plan_Qty
    FROM BEAS_FTSTL B
    INNER JOIN WO W
        ON B.BELNR_ID = W.BELNR_ID
       AND B.BELPOS_ID = W.BELPOS_ID
    LEFT JOIN OITM IT ON B.ART1_ID = IT.ItemCode
    LEFT JOIN OITB IG ON IT.ItmsGrpCod = IG.ItmsGrpCod
)

, GI AS
(
    SELECT
        X.U_belnrid  AS BELNR_ID,
        X.U_belposid AS BELPOS_ID,
        X.ItemCode,
        SUM(X.QtyOut - X.QtyIn) AS ActualQty,
        SUM(X.ValueOut - X.ValueIn) AS ActualValue
    FROM
    (
        /* ===== Issue NVL ===== */
        SELECT
            I1.U_belnrid,
            I1.U_belposid,
            I1.ItemCode,
            SUM(I1.Quantity) AS QtyOut,
            0 AS QtyIn,
            SUM(I1.Quantity * I1.StockPrice) AS ValueOut,
            0 AS ValueIn
        FROM OIGE T0
        INNER JOIN IGE1 I1 ON T0.DocEntry = I1.DocEntry
        WHERE I1.U_belnrid IS NOT NULL
        GROUP BY I1.U_belnrid, I1.U_belposid, I1.ItemCode

        UNION ALL

        /* ===== Return NVL về kho ===== */
        SELECT
            R1.U_belnrid,
            R1.U_belposid,
            R1.ItemCode,
            0,
            SUM(R1.Quantity),
            0,
            SUM(R1.Quantity * R1.StockPrice)
        FROM OIGN T0
        INNER JOIN IGN1 R1 ON T0.DocEntry = R1.DocEntry
        WHERE R1.U_belnrid IS NOT NULL
        GROUP BY R1.U_belnrid, R1.U_belposid, R1.ItemCode
    ) X
    GROUP BY
        X.U_belnrid,
        X.U_belposid,
        X.ItemCode
)

,FG_ACTUAL AS
(
    SELECT
        X.U_belnrid  AS BELNR_ID,
        X.U_belposid AS BELPOS_ID,
        X.ItemCode,
        SUM(X.QtyIn - X.QtyOut) AS ActualQty,
        SUM(X.ValueIn - X.ValueOut) AS ActualValue
    FROM
    (
        /* ===== Receipt FG ===== */
        SELECT
            R1.U_belnrid,
            R1.U_belposid,
            R1.ItemCode,
            SUM(R1.Quantity) AS QtyIn,
            0 AS QtyOut,
            SUM(R1.Quantity * R1.StockPrice) AS ValueIn,
            0 AS ValueOut
        FROM OIGN T0
        INNER JOIN IGN1 R1 ON T0.DocEntry = R1.DocEntry
        WHERE R1.U_belnrid IS NOT NULL
        GROUP BY R1.U_belnrid, R1.U_belposid, R1.ItemCode

        UNION ALL

        /* ===== Issue FG (nếu có xuất trả / sai) ===== */
        SELECT
            I1.U_belnrid,
            I1.U_belposid,
            I1.ItemCode,
            0,
            SUM(I1.Quantity),
            0,
            SUM(I1.Quantity * I1.StockPrice)
        FROM OIGE T0
        INNER JOIN IGE1 I1 ON T0.DocEntry = I1.DocEntry
        WHERE I1.U_belnrid IS NOT NULL
        GROUP BY I1.U_belnrid, I1.U_belposid, I1.ItemCode
    ) X
    GROUP BY
        X.U_belnrid,
        X.U_belposid,
        X.ItemCode
)
, BEAS_COST_DETAIL AS
(
    SELECT
        J.U_belnrid  AS BELNR_ID,
        J.U_belposid AS BELPOS_ID,
        J.Account,
        J.Debit,
        J.Credit
    FROM BEAS_JOURNAL_HISTORIE J
    WHERE J.U_belnrid IS NOT NULL
      AND J.U_belposid IS NOT NULL

    UNION ALL

    SELECT
        OJ.U_belnrid,
        OJ.U_belposid,
        J1.Account,
        J1.Debit,
        J1.Credit
    FROM JDT1 J1
    INNER JOIN OJDT OJ ON OJ.TransId = J1.TransId
    WHERE OJ.U_belnrid IS NOT NULL
      AND OJ.U_belposid IS NOT NULL
)

, COST_BEAS AS
(
    SELECT
        B.BELNR_ID,
        B.BELPOS_ID,

        SUM(CASE WHEN B.Account = '154100'
            THEN B.Debit - B.Credit ELSE 0 END) AS Cost_DoDang,

        SUM(CASE WHEN B.Account = '155100'
            THEN B.Debit - B.Credit ELSE 0 END) AS Cost_ThanhPham,

        SUM(CASE WHEN B.Account = '154200'
            THEN B.Debit - B.Credit ELSE 0 END) AS Cost_ChenhLech,

        SUM(CASE WHEN B.Account = '152000'
            THEN B.Debit - B.Credit ELSE 0 END) AS Cost_NVL_Chinh,

        SUM(CASE WHEN B.Account = '152100'
            THEN B.Debit - B.Credit ELSE 0 END) AS Cost_NVL_Phu

    FROM BEAS_COST_DETAIL B
    INNER JOIN BEAS_FTPOS P
        ON B.BELNR_ID  = P.BELNR_ID
       AND B.BELPOS_ID = P.BELPOS_ID
    WHERE
    (
        (
            P.ABGKZ_DATE >= @FromDate
            AND P.ABGKZ_DATE < DATEADD(DAY,1,@ToDate)
        )
        OR P.ABGKZ_DATE IS NULL
    )
    GROUP BY
        B.BELNR_ID,
        B.BELPOS_ID
)

/* ===== IOT_DATA: Lấy Logic từ yêu cầu và nhóm theo WO, POS ===== */
, IOT_DATA AS
(
    SELECT
        X.BELNR_ID,
        X.BELPOS_ID,
        MAX(X.LineTypeMasias) AS LineTypeMasias,
        MAX(X.[LINE]) AS [LINE],
        SUM(X.Energy) AS Total_energyElectricity
    FROM
    (
        SELECT DISTINCT
            t1.U_belnrid AS BELNR_ID,
            t1.U_belposid AS BELPOS_ID,
            t5.DocEntry,
            t6.U_I_LineType AS LineTypeMasias,
            t5.U_SAC_Output AS [LINE],
            IIF(cast(ISNULL(IIF(t5.U_energyElectricity = '',0,t5.U_energyElectricity),0) as numeric) /10 > 100,
                1,
                cast(ISNULL(IIF(t5.U_energyElectricity = '',0,t5.U_energyElectricity),0) as numeric) /10
            ) AS Energy
        FROM OIGN t5
        INNER JOIN IGN1 t1 ON t5.DocEntry = t1.DocEntry
        LEFT JOIN [@IOT_PARAMETERS] t6 ON t6.Code = cast(t1.U_belnrid as nvarchar(10)) + CAST(t1.U_belposid as nvarchar(10))
        WHERE t1.U_belnrid IS NOT NULL
    ) X
    GROUP BY X.BELNR_ID, X.BELPOS_ID
)

/* ================== FINAL ================== */
SELECT *
FROM
(
    /* ===== FG ===== */
SELECT
    W.BELNR_ID as [WO],
    W.BELPOS_ID AS [WO POS],
    W.DrawingNo AS [Drawing no.],   
    W.StartDate      AS [Start Date],    W.DeliveryDate   AS [Delivery Date],    W.CloseWODate    AS [Close WO Date],
    W.ItemCode,
    W.ItmsGrpCod AS [Item groups code],
    W.ItmsGrpNam AS [Item groups Name],
    W.InventoryAccount AS [Inventory Account code],

    NULL AS UNIT_BOM,
    NULL AS PER,
    NULL AS UNIT_BOM_UOM,

    W.Plan_Qty,
    CAST(        W.Plan_Qty / NULLIF(W.NumInSale,0)    AS DECIMAL(18,2)) AS Plan_Qty_Bag,      
    ISNULL(FG.ActualQty,0) AS Actual_QTY,
    CAST(        ISNULL(FG.ActualQty,0) / NULLIF(W.NumInSale,0)    AS DECIMAL(18,2)) AS Actual_QTY_Bag,   
    CAST(
        ISNULL(FG.ActualValue,0) /
        NULLIF(FG.ActualQty,0)
    AS DECIMAL(18,2)) AS [UNIT (Actual VALUE /Actual QTY)],

    ISNULL(FG.ActualValue,0) AS Actual_VALUE
    , ISNULL(CB.Cost_DoDang,0)      AS [Chi phí SXKD dở dang ngắn hạn]
    , ISNULL(CB.Cost_ThanhPham,0)   AS [Thành phẩm nhập kho Nhà Máy]
    , ISNULL(CB.Cost_ChenhLech,0)   AS [Chênh lệch chi phí SXKD giữa định mức và thực tế]
    , ISNULL(CB.Cost_NVL_Chinh,0)   AS [Nguyên liệu, vật liệu chính]
    , ISNULL(CB.Cost_NVL_Phu,0)     AS [Nguyên liệu, vật liệu phụ],
    
    W.ActualTime_Minutes,
    -- ===== THÊM 3 CỘT MỚI VÀO ĐÂY =====
    IOT.LineTypeMasias,
    IOT.[LINE], 
    ISNULL(IOT.Total_energyElectricity, 0) AS [energyElectricity(KWh)],
    -- ==================================
    CAST(W.TimeRatio * 100 AS DECIMAL(10,2)) AS [Machine Time Share %],

    CS.Cost_622    * W.TimeRatio AS [622],
    CS.Cost_627_01 * W.TimeRatio AS [627_01],
    CS.Cost_627_02 * W.TimeRatio AS [627_02],
    CS.Cost_627_03 * W.TimeRatio AS [627_03],
    CS.Cost_627_04 * W.TimeRatio AS [627_04],
    CS.Cost_627_05 * W.TimeRatio AS [627_05],
    CS.Cost_627_06 * W.TimeRatio AS [627_06],
    CS.Cost_627_07 * W.TimeRatio AS [627_07]

FROM WO W
LEFT JOIN FG_ACTUAL FG
    ON W.BELNR_ID  = FG.BELNR_ID
   AND W.BELPOS_ID = FG.BELPOS_ID
   AND W.ItemCode  = FG.ItemCode
CROSS JOIN #COST_SUM CS
LEFT JOIN COST_BEAS CB
    ON W.BELNR_ID  = CB.BELNR_ID
   AND W.BELPOS_ID = CB.BELPOS_ID
LEFT JOIN IOT_DATA IOT 
    ON W.BELNR_ID = IOT.BELNR_ID 
   AND W.BELPOS_ID = IOT.BELPOS_ID

    UNION ALL

    /* ===== NVL ===== */
    SELECT
        B.BELNR_ID as [WO],
        B.BELPOS_ID AS [WO POS],
        NULL AS [Drawing no.],
        null    AS [Start Date],
        null   AS [Delivery Date],
        null    AS [Close WO Date],
        B.ItemCode,
        B.ItmsGrpCod AS [Item groups code],
        B.ItmsGrpNam AS [Item groups Name],
        B.InventoryAccount AS [Inventory Account code],

        B.UNIT_BOM,
        B.PER,
        B.UNIT_BOM_UOM,

        - B.Plan_Qty,
        NULL AS Plan_Qty_Bag,

        - ISNULL(GI.ActualQty,0),
        NULL AS Actual_QTY_Bag,
        CAST(ISNULL(GI.ActualValue,0) / NULLIF(GI.ActualQty,0) AS DECIMAL(18,2)),

        - ISNULL(GI.ActualValue,0)
        , NULL
        , NULL
        , NULL
        , NULL
        , NULL
        , NULL -- ActualTime_Minutes
        -- ===== BÙ ĐÚNG 3 CỘT NULL CHO NVL =====
        , NULL AS LineTypeMasias
        , NULL AS [LINE] 
        , NULL AS [energyElectricity(KWh)]
        -- ======================================
        , NULL -- Machine Time Share %

       , NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL

    FROM BOM B
    LEFT JOIN GI
        ON B.BELNR_ID  = GI.BELNR_ID
       AND B.BELPOS_ID = GI.BELPOS_ID
       AND B.ItemCode  = GI.ItemCode

) X
ORDER BY
    [WO],
    [WO POS],
    CASE WHEN UNIT_BOM IS NULL THEN 0 ELSE 1 END,
    ItemCode, [Inventory Account code]