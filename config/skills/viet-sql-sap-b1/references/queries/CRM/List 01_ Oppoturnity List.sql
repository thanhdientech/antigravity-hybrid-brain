-- 查询销售机会，若 @Status 为空则代表“全部状态”，否则筛选指定状态

SELECT DISTINCT
    T0.[OpprId],        -- 机会编号
    T0.[CardCode],      -- 客户代码
    T0.[SlpCode],       -- 销售员代码
    T0.[CprCode],       -- 联系人代码
    T0.[Source],        -- 来源
    T0.[IntCat1], T0.[IntCat2], T0.[IntCat3],  -- 潜在兴趣分类
    T0.[IntRate],       -- 成功率%
    T0.[OpenDate],      -- 开始日期
    T0.[DifType],       -- 差异类型
    T0.[PredDate],      -- 预计成交日期
    T0.[MaxSumLoc], T0.[MaxSumSys],            -- 最大金额
    T0.[WtSumLoc], T0.[WtSumSys],              -- 加权金额
    T0.[PrcnProf], T0.[SumProfL], T0.[SumProfS], -- 预计利润
    T0.[Status],        -- 当前状态
    T0.[StatusRem],     -- 状态备注
    T0.[Reason],        -- 失败原因
    T0.[RealSumLoc], T0.[RealSumSys],          -- 实际成交金额
    T0.[RealProfL], T0.[RealProfS],            -- 实际利润
    T0.[CloPrcnt],      -- 完成率
    T0.[StepLast],      -- 最近阶段
    T0.[UserSign],      -- 建立人
    T0.[Transfered],    -- 是否同步
    T0.[Instance],      -- 实例
    T0.[CardName],      -- 客户名称
    T0.[CloseDate],     -- 完成日期
    T0.[LastSlp],       -- 最近销售员
    T0.[Name],          -- 机会名称
    T0.[Territory],     -- 区域
    T0.[Industry],      -- 行业
    T0.[ChnCrdCode], T0.[ChnCrdName],          -- 渠道信息
    T0.[PrjCode],       -- 项目代码
    T0.[CardGroup],     -- 客户群组
    T1.[Phone1], T1.[Cellular], T1.[E_Mail]    -- 客户联系信息

FROM [dbo].[OOPR] T0
INNER JOIN [dbo].[OCRD] T1 ON T1.[CardCode] = T0.[CardCode]

WHERE (T0.Status = '' OR T0.[Status] = @Status)

ORDER BY T0.[OpprId];
