SELECT TOP 999999
    "OBTN"."DistNumber",           -- 批次号
    "OBTQ"."WhsCode",             -- 仓库代码
    "OBTN"."MnfSerial",          -- 厂商序列号
    "OBTN"."LotNumber",          -- 批号
    "OBTN"."ExpDate",            -- 有效期
    "OBTN"."MnfDate",           -- 生产日期
    "OBTN"."InDate",            -- 入库日期
    "OBTN"."Notes",            -- 备注
    "OBTQ"."Quantity",         -- 数量
    "OBTN"."Location",        -- 存储位置
    "OBTN"."ItemCode",       -- 物料编码
    "OBTN"."Status",        -- 状态
   -- "OBTN"."U_beas_ver",  -- BEAS 版本自定义字段
    "OITM"."InvntryUom",  -- 库存单位
    "OLCT"."Location",    -- 位置（OLCT表）
   -- "OWHS"."U_beas_bitmap", -- BEAS 二进制图标
   -- "OWHS"."U_beas_color",  -- BEAS 颜色

    -- 计算保留数量（从 BEAS_RESERVATION_LINE）
    COALESCE(
        (
            SELECT SUM(r."Quantity")
            FROM "BEAS_RESERVATION_LINE" r
            WHERE 
                r."ItemCode" = "OBTN"."ItemCode"
                AND r."RESERVATIONTYPE" = 'S'
                AND r."WhsCode" = "OBTQ"."WhsCode"
                AND r."BatchNum" = "OBTN"."DistNumber"
        ), 0
    ) AS "RESERVATION"

   -- SPACE(50) AS templatefield1,
 --   SPACE(50) AS templatefield2,
 --   SPACE(50) AS templatefield3,
 ----   SPACE(50) AS templatefield4,
 ---   SPACE(50) AS templatefield5,
  --  SPACE(50) AS templatefield6

FROM "OBTN"
    INNER JOIN "OBTQ"
        ON "OBTQ"."ItemCode" = "OBTN"."ItemCode"
        AND "OBTQ"."SysNumber" = "OBTN"."SysNumber"
    INNER JOIN "OWHS"
        ON "OWHS"."WhsCode" = "OBTQ"."WhsCode"
    INNER JOIN "OITM"
        ON "OITM"."ItemCode" = "OBTN"."ItemCode"
    LEFT OUTER JOIN "OLCT"
        ON "OLCT"."Code" = "OWHS"."Location"
WHERE 
    "OBTN"."ItemCode" = @Itemcode
    AND "OBTQ"."Quantity" <> 0
