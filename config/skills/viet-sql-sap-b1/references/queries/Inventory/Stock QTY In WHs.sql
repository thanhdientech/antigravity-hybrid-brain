SELECT TOP 999999
    "OITW"."ItemCode",                         -- 物料编码
    "OITW"."WhsCode",                         -- 仓库代码
    "OITW"."OnHand",                          -- 在库数量
    "OITW"."IsCommited",                      -- 已承诺数量
    "OITW"."OnOrder",                         -- 在途采购数量
    "OITW"."Locked",                          -- 锁定状态
    SUBSTRING(COALESCE("OWHS"."U_beas_lck", ''), 1, 1) AS lagertyp,  -- BEAS 自定义字段（库区类型）
    "OITM"."InvntryUom",                      -- 库存单位

    -- 工单（生产订单）需求总数（BEAS_FTPOS）
    COALESCE(
        (
            SELECT SUM("BEAS_FTPOS"."MENGE" 
                       - COALESCE("BEAS_FTPOS"."MENGE_FERTIG_MAUELL", 0) 
                       - COALESCE("BEAS_FTPOS"."GEL_MENGE", 0))
            FROM "BEAS_FTPOS"
            WHERE "BEAS_FTPOS"."ItemCode" = "OITM"."ItemCode"
              AND COALESCE("BEAS_FTPOS"."ABGKZ", '') <> 'J'
              AND "BEAS_FTPOS"."WhsCode" = "OITW"."WhsCode"
        ), 0
    )
    + COALESCE(
        (-1) * (
            SELECT SUM("BEAS_FTSTL"."TOTALQUANTITY_WHUNIT" 
                       - COALESCE("BEAS_FTSTL"."BookedQty", 0))
            FROM "BEAS_FTSTL"
            WHERE "ART1_ID" = "OITM"."ItemCode"
              AND COALESCE("BEAS_FTSTL"."ABGKZ", '') <> 'J'
              AND "BEAS_FTSTL"."WhsCode" = "OITW"."WhsCode"
              AND "BEAS_FTSTL"."MENGE_LAGER" < 0
        ), 0
    ) AS woftpos,

    -- BOM 工序需求总数（BEAS_FTSTL）
    COALESCE(
        (
            SELECT SUM("BEAS_FTSTL"."TOTALQUANTITY_WHUNIT" 
                       - COALESCE("BEAS_FTSTL"."BookedQty", 0))
            FROM "BEAS_FTSTL"
            WHERE "ART1_ID" = "OITM"."ItemCode"
              AND COALESCE("BEAS_FTSTL"."ABGKZ", '') <> 'J'
              AND "BEAS_FTSTL"."WhsCode" = "OITW"."WhsCode"
              AND "BEAS_FTSTL"."MENGE_LAGER" >= 0
        ), 0
    ) AS bomftstlpos,

    -- BEAS 生产保留（Reservation）
    (
        SELECT SUM(r."Quantity")
        FROM "BEAS_RESERVATION_LINE" r
        WHERE r."RESERVATIONTYPE" = 'S'
          AND r."ItemCode" = "OITM"."ItemCode"
          AND r."WhsCode" = "OITW"."WhsCode"
    ) AS "RESERVATION",

    --"OWHS"."U_beas_bitmap",                  -- BEAS Bitmap 字段
    --"OWHS"."U_beas_color",                   -- BEAS 颜色字段
    --"OWHS"."U_beas_lck",                     -- BEAS 库区锁定标志
    COALESCE("OWHS"."U_beas_reservation", 'Y') AS OWHS_U_beas_reservation, -- BEAS 保留设置
    "OITW"."AvgPrice",                      -- 平均成本价
    "OITW"."MaxStock",                     -- 最大库存
    "OITW"."MinStock",                     -- 最小库存
    "OITW"."MinOrder",                     -- 最小订购量
    "OWHS"."WhsName"                      -- 仓库名称
    --"OWHS"."Locked" AS WhsLocked,         -- 仓库是否锁定
    --"OWHS"."Street",                       -- 仓库地址
    --"OWHS"."Block",                        -- 仓库区域
    --"OWHS"."ZipCode",                     -- 仓库邮编
    --"OWHS"."City",                         -- 仓库城市
    --"OWHS"."County",                       -- 仓库县/区
    --"BEAS_WHS"."BINTYP"                   -- BEAS Bin 类型
FROM "OITW"
LEFT OUTER JOIN "BEAS_WHS"
    ON "OITW"."WhsCode" = "BEAS_WHS"."WhsCode"
LEFT OUTER JOIN "OWHS"
    ON "OITW"."WhsCode" = "OWHS"."WhsCode"
    AND "OWHS"."Inactive" <> 'Y'         -- 仅激活仓库
LEFT OUTER JOIN "OITM"
    ON "OITM"."ItemCode" = "OITW"."ItemCode"
WHERE "OITW"."ItemCode" = @Itemcode
ORDER BY
    "OITW"."ItemCode" ASC,
    "OITW"."WhsCode" ASC;
