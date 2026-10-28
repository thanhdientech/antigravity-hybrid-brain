SELECT 
    -- 基本字段
	Q.docentry,
    Q."CHARGE_ID", 
    Q."BELNR_ID", 
    --Q."KND_ID", 
    Q."ItemCode", 
    Q."PRODUZIERT_AM", 
    Q."BEZ", 
    Q."MENGE", 
    Q."INFO", 
    --Q."ERFTSTAMP", 
    --Q."ERFUSER", 
    --Q."ANDTSTAMP", 
    --Q."ANDUSER", 
    --Q."KORREKTURFAKTOR", 
    Q."FERT_BELNR_ID", 
    Q."FERT_BELPOS_ID", 
    Q."FERT_POS_ID", 
    Q."ABGKZ", 
    Q."BatchNum", 
    --Q."UDF1", Q."UDF2", Q."UDF3", Q."UDF4", 
    Q."PRUEFAUFTRAG", 
    Q."ME_ID", 
    Q."TYP", 
    --Q."U_beas_ver", 
    Q."ZNR", 
    Q."CardCode", 
    Q."WhsCode_ORG", 
    --Q."DRUCKKZ", 

    -- OITM 物料附加字段
    I."U_match", 
    I."U_wst_id", 
    I."U_gruppe", 
    I."U_znr", 

    -- BEAS_FTHAUPT 衍生字段
    F."AUFTRAG", 
   -- F."UDF1", F."UDF2", F."UDF3", F."UDF4", 

    -- 基础来源字段
    Q."BaseType", 
    Q."BASEDOCENTRY", 
    Q."BASELINENUM", 
    Q."BASELINENUM2", 
    Q."BASEORDER", 
    --Q."STATION", 
    --Q."Version", 
    Q."PERS_ID", 

    -- 动态字段与占位符
    Coalesce(Q."BASEBASETYPE", Q."TYP") AS beas_qsfthaupt_basebasetype,
    --SPACE(50) AS templatefield1,
    --SPACE(50) AS templatefield2,
   -- SPACE(50) AS templatefield3,
    --SPACE(50) AS templatefield4,
    --SPACE(50) AS templatefield5,
    --SPACE(50) AS templatefield6,

    -- 质量规则相关
    Q."RuleId", 
    Q."QcInfo", 
    --V."UDF1", V."UDF2", V."UDF3", V."UDF4", 

    -- 品质计划附加资料
    --A."COLORID", 
   -- A."BITMAP", 
    A."GROUPID", 
    A."QcPlanVersion", 
    Q."ParentChargeId", 
    --Q."DocEntry", 
    A."RecordingType", 
    --Q."BEASVERSION", 
    Q."MaterialTransfer", 

    -- 附件数量统计
    (SELECT COUNT(*) 
     FROM "BEAS_QSFTATTACHMENT" QA 
     WHERE QA."CHARGE_ID" = Q."CHARGE_ID" 
       AND QA."BELNR_ID" = Q."BELNR_ID") AS AttachmentCount,

    -- 项目及质量评估相关
   -- Q."Project", 
   -- Q."BEWERTUNG", 
   -- Q."BEWERTUNGINFO", 
    Q."Release", 
    Q."ReleasePersName", 
    Q."ReleaseDate", 
    Q."CloseOrderDate", 
    Q."CloseOrderPersName", 
    Q."SPERRGRUNDID", 
    Q."SPERRGRUND", 

    -- 测量数据分类统计
    (SELECT COUNT(*) 
     FROM "BEAS_QSFTMESSUNG" QM 
     WHERE QM."CHARGE_ID" = Q."CHARGE_ID" 
       AND QM."BELNR_ID" = Q."BELNR_ID" 
       AND COALESCE(QM."Release", 0) = 1) AS entry_ok,

    (SELECT COUNT(*) 
     FROM "BEAS_QSFTMESSUNG" QM 
     WHERE QM."CHARGE_ID" = Q."CHARGE_ID" 
       AND QM."BELNR_ID" = Q."BELNR_ID" 
       AND COALESCE(QM."Release", 0) <> 1 
       AND QM."PRUEFKZ" NOT IN ('E', 'I')) AS entry_open,

    (SELECT COUNT(*) 
     FROM "BEAS_QSFTMESSUNG" QM 
     WHERE QM."CHARGE_ID" = Q."CHARGE_ID" 
       AND QM."BELNR_ID" = Q."BELNR_ID" 
       AND COALESCE(QM."Release", 0) <> 1 
       AND QM."PRUEFKZ" IN ('E', 'I')) AS entry_wrong

    -- 组织结构
    --Q."BPLId", 
    --Q."BPLName"

-- 表连接结构
FROM {oj "BEAS_QSFTHAUPT" Q
    LEFT OUTER JOIN "BEAS_FTHAUPT" F ON Q."FERT_BELNR_ID" = F."BELNR_ID"
    LEFT OUTER JOIN "BEAS_QSVERWEIS" V ON Q."QcItemNr" = V."NR"
    LEFT OUTER JOIN "BEAS_QSARTIKELHAUPT" A ON Q."PRUEFAUFTRAG" = A."ItemCode"},
    "OITM" I

-- 查询条件
WHERE 
--Q."ABGKZ" = 'N' AND 
	Q."ItemCode" = I."ItemCode"
  AND (
        LOWER(Q."CHARGE_ID") LIKE LOWER('%')
     OR LOWER(RTRIM(Q."KND_ID")) LIKE LOWER('%')
     OR LOWER(RTRIM(Q."ItemCode")) LIKE LOWER('%')
     OR LOWER(I."ItemName") LIKE LOWER('%%')
     OR CAST(Q."DocEntry" AS VARCHAR(20)) LIKE '%'
  )
  and Q."PRODUZIERT_AM" between @SDate and @EDate
  and
  (
    Q.ABGKZ = '' 
 -- 如果用户输入空白，则不过滤，返回全部
    OR Q.ABGKZ = @Status  
-- 否则按输入的 Y 或 N 来筛选
  )

-- 排序方式
ORDER BY Q."DocEntry" DESC
