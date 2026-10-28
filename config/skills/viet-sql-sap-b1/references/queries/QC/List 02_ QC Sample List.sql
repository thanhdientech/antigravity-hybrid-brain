SELECT 
    T."beas_qsfthaupt_itemcode",
    T."beas_qsfthaupt_charge_id",
    T."beas_qsfthaupt_znr",
    T."beas_qsfthaupt_typ",
    T."beas_qsfthaupt_pruefauftrag",
    T."beas_qsfthaupt_batchnum",
    T."beas_qsfthaupt_info",
    T."beas_qsfthaupt_belnr_id",
    T."beas_qsftmessung_knd_id",
    T."beas_qsfthaupt_fert_belnr_id",
    T."beas_qsfthaupt_fert_belpos_id",
    T."beas_qsfthaupt_fert_pos_id",
    T."beas_qsftmessung_fert_messung",
    T."beas_qsfthaupt_abgkz",
    T."beas_qsftmessung_pruefkz",
    T."beas_qsftmessung_erftstamp",
    T."beas_qsftmessung_erfuser",
    T."beas_qsftmessung_andtstamp",
    T."beas_qsftmessung_anduser",
   -- T."beas_qsfthaupt_udf1",
   -- T."beas_qsfthaupt_udf2",
  --  T."beas_qsfthaupt_udf3",
  --  T."beas_qsfthaupt_udf4",
  --  T.templatefield1,
  --  T.templatefield2,
  --  T.templatefield3,
  --  T.templatefield4,
  --  T.templatefield5,
  --  T.templatefield6,
  --  T.templatefield7,
  --  T.templatefield8,
  --  T.templatefield9,
    T.OpenMeasurePoints,
    T.ErrorMeasurePoints,
    T.OpenReleasePoints,
   -- T.BEAS_QSSPERRGRUND_BITMAP,
   -- T.BEAS_QSSPERRGRUND_COLORID,
    T.BEAS_QSSPERRGRUND_BlockOk,
    T.BEAS_QSFTMESSUNG_SPERRGRUND,
    T.BEAS_QSFTMESSUNG_SPERRGRUNDID,
    T.BEAS_QSFTMESSUNG_ValuationId,
    T.BEAS_QSFTMESSUNG_ValuationText,
   -- T.BEAS_QSFTMESSUNG_ReleaseAutomatic,
    T.BEAS_QSFTMESSUNG_Release,
   -- T.BEAS_QSFTMESSUNG_ReleasePersId,
  --  T.BEAS_QSFTMESSUNG_ReleasePersName,
  --  T.BEAS_QSFTMESSUNG_ReleaseStationId,
  --  T.BEAS_QSFTMESSUNG_ReleaseDate,
    --T.BEAS_QSVALUATION_BITMAP,
   -- T.BEAS_QSVALUATION_COLORID,
    T."beas_qsftmessung_docentry",
    T.BEAS_QSFTMESSUNG_DistNumber,
    T.LASTCHANGE,
    '' AS dummy_field
FROM (
    SELECT
        -- 基本字段
        H."ItemCode"       AS "beas_qsfthaupt_itemcode",
        H."CHARGE_ID"      AS "beas_qsfthaupt_charge_id",
        H."ZNR"            AS "beas_qsfthaupt_znr",
        H."TYP"            AS "beas_qsfthaupt_typ",
        H."PRUEFAUFTRAG"   AS "beas_qsfthaupt_pruefauftrag",
        H."BatchNum"       AS "beas_qsfthaupt_batchnum",
        H."INFO"           AS "beas_qsfthaupt_info",
        H."BELNR_ID"       AS "beas_qsfthaupt_belnr_id",

        M."KND_ID"         AS "beas_qsftmessung_knd_id",
        H."FERT_BELNR_ID"  AS "beas_qsfthaupt_fert_belnr_id",
        H."FERT_BELPOS_ID" AS "beas_qsfthaupt_fert_belpos_id",
        H."FERT_POS_ID"    AS "beas_qsfthaupt_fert_pos_id",
        M."FERT_MESSUNG"   AS "beas_qsftmessung_fert_messung",
        H."ABGKZ"          AS "beas_qsfthaupt_abgkz",
        M."PRUEFKZ"        AS "beas_qsftmessung_pruefkz",

        -- 时间和用户信息
        M."ERFTSTAMP"      AS "beas_qsftmessung_erftstamp",
        M."ERFUSER"        AS "beas_qsftmessung_erfuser",
        M."ANDTSTAMP"      AS "beas_qsftmessung_andtstamp",
        M."ANDUSER"        AS "beas_qsftmessung_anduser",

        -- 自定义字段
        H."UDF1", H."UDF2", H."UDF3", H."UDF4",

        -- 占位字段
        SPACE(50) AS templatefield1,
        SPACE(50) AS templatefield2,
        SPACE(50) AS templatefield3,
        SPACE(50) AS templatefield4,
        SPACE(50) AS templatefield5,
        SPACE(50) AS templatefield6,
        SPACE(50) AS templatefield7,
        SPACE(50) AS templatefield8,
        SPACE(50) AS templatefield9,

        -- 汇总子查询
        (
            SELECT COUNT(*) FROM "BEAS_QSFTPOS" P
            WHERE P."CHARGE_ID" = M."CHARGE_ID"
              AND P."BELNR_ID" = M."BELNR_ID"
              AND P."KND_ID" = M."KND_ID"
              AND COALESCE(P."Release", 0) <> 1
              AND COALESCE(P."RELEVANT", 'N') = 'J'
              AND COALESCE(P."SPERRGRUNDID", '') = ''
        ) AS OpenMeasurePoints,

        (
            SELECT COUNT(*) FROM "BEAS_QSFTPOS" P
            WHERE P."CHARGE_ID" = M."CHARGE_ID"
              AND P."BELNR_ID" = M."BELNR_ID"
              AND P."KND_ID" = M."KND_ID"
              AND COALESCE(P."Release", 0) <> 1
              AND COALESCE(P."OK", '') <> 'J'
              AND COALESCE(P."SPERRGRUNDID", '') <> ''
        ) AS ErrorMeasurePoints,

        (
            SELECT COUNT(*) FROM "BEAS_QSFTPOS" P
            WHERE P."CHARGE_ID" = M."CHARGE_ID"
              AND P."BELNR_ID" = M."BELNR_ID"
              AND P."KND_ID" = M."KND_ID"
              AND COALESCE(P."OK", 'N') = 'J'
              AND COALESCE(P."Release", 0) <> 1
              AND COALESCE(P."RELEVANT", 'N') = 'J'
        ) AS OpenReleasePoints,

        -- 审核、放行、评估信息
        S."BITMAP"        AS BEAS_QSSPERRGRUND_BITMAP,
        S."COLORID"       AS BEAS_QSSPERRGRUND_COLORID,
        S."BlockOk"       AS BEAS_QSSPERRGRUND_BlockOk,
        M."SPERRGRUND"    AS BEAS_QSFTMESSUNG_SPERRGRUND,
        M."SPERRGRUNDID"  AS BEAS_QSFTMESSUNG_SPERRGRUNDID,
        M."ValuationId"   AS BEAS_QSFTMESSUNG_ValuationId,
        M."ValuationText" AS BEAS_QSFTMESSUNG_ValuationText,
		M."ReleaseAutomatic"       AS "BEAS_QSFTMESSUNG_ReleaseAutomatic",
		M."Release" AS "BEAS_QSFTMESSUNG_Release",
		M."ReleasePersId"          AS "BEAS_QSFTMESSUNG_ReleasePersId",
		M."ReleasePersName"        AS "BEAS_QSFTMESSUNG_ReleasePersName",
		M."ReleaseStationId"       AS "BEAS_QSFTMESSUNG_ReleaseStationId",
		M."ReleaseDate"            AS "BEAS_QSFTMESSUNG_ReleaseDate",

        V."BITMAP"        AS BEAS_QSVALUATION_BITMAP,
        V."COLORID"       AS BEAS_QSVALUATION_COLORID,

        -- 文档信息
        M."DocEntry"      AS "beas_qsftmessung_docentry",
        M."DistNumber"    AS BEAS_QSFTMESSUNG_DistNumber,

        -- 最后修改时间
        (
            SELECT MAX(P."ANDTSTAMP")
            FROM "BEAS_QSFTPOS" P
            WHERE P."CHARGE_ID" = M."CHARGE_ID"
              AND P."BELNR_ID" = M."BELNR_ID"
              AND P."KND_ID" = M."KND_ID"
        ) AS LASTCHANGE

    FROM "BEAS_QSFTMESSUNG" M
    INNER JOIN "BEAS_QSFTHAUPT" H
        ON H."CHARGE_ID" = M."CHARGE_ID"
        AND H."BELNR_ID" = M."BELNR_ID"
    INNER JOIN "BEAS_QSARTIKELHAUPT" A
        ON A."ItemCode" = H."PRUEFAUFTRAG"
        AND A."KND_ID" = ''
    LEFT JOIN "BEAS_QSSPERRGRUND" S
        ON S."SPERRGRUNDID" = M."SPERRGRUNDID"
    LEFT JOIN "BEAS_QSVALUATION" V
        ON V."ValuationId" = M."ValuationId"
) T
WHERE
    (
        1 = 1
        AND (
            (@ChargeID IS NULL OR @ChargeID = '' OR T."beas_qsfthaupt_charge_id" LIKE '%' + @ChargeID + '%')
        OR (@DocEntry IS NULL OR @DocEntry = '' OR CAST(T."beas_qsftmessung_docentry" AS VARCHAR(20)) LIKE '%' + @DocEntry + '%')
        OR (@ItemCode IS NULL OR @ItemCode = '' OR T."beas_qsfthaupt_itemcode" LIKE '%' + @ItemCode + '%')
        OR (@Pruefauftrag IS NULL OR @Pruefauftrag = '' OR T."beas_qsfthaupt_pruefauftrag" LIKE '%' + @Pruefauftrag + '%')
        OR (@BatchNum IS NULL OR @BatchNum = '' OR T."beas_qsfthaupt_batchnum" LIKE '%' + @BatchNum + '%')
        OR (@KndID IS NULL OR @KndID = '' OR T."beas_qsftmessung_knd_id" LIKE '%' + @KndID + '%')
        )
				And (
    				@AbgkzInput IS NULL
    		OR @AbgkzInput = ''
    		OR (
       		 @AbgkzInput = 'Y' AND T."beas_qsfthaupt_abgkz" = 'J'
    				)
   		 OR (
      		  @AbgkzInput = 'N' AND T."beas_qsfthaupt_abgkz" = 'N'
    				)
						)
    )
ORDER BY
    T."beas_qsfthaupt_charge_id",
    T."beas_qsfthaupt_belnr_id",
    CASE
        WHEN ISNUMERIC(T."beas_qsftmessung_knd_id") = 1 THEN
            CAST(T."beas_qsftmessung_knd_id" AS INT)
        ELSE 0
    END;
