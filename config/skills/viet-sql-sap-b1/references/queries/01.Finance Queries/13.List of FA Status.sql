SELECT T0.ItemCode,T0.ItemName,T0.FrgnName,CASE WHEN T0.AsstStatus = 'A' THEN 'Active' ELSE 'Inactive' END AsstStatus
,T0.AssetClass,T0.AssetGroup,T0.DeprGroup,T0.InventryNo,T0.AssetSerNo,T0.Location,
T0.Technician,T0.Employee,T0.CapDate,
T1.DprArea,T1.DprStart,T1.DprEnd,T1.UsefulLife,T1.RemainLife,T1.DprType
,T2.TransAmnt,T2.TransAmnt - T3.OrdDprPlan AS NetBookValue,T2.TransAmnt - T3.OrdDprPln1 AS HistoricalNBV,T3.OrdDprPlan
FROM OITM T0 LEFT OUTER JOIN ITM7 T1 ON T0.ItemCode = T1.ItemCode AND T1.PeriodCat = @YEAR
LEFT OUTER JOIN
(
SELECT ItemCode,SUM(TransAmnt) AS TransAmnt FROM FIX1 WHERE RefDate <= @YEAR GROUP BY ItemCode 
)T2 ON T0.ItemCode = T2.ItemCode
LEFT OUTER JOIN
(
SELECT ItemCode,SUM(OrdDprPlan) AS OrdDprPlan,SUM(OrdDprPln1) AS OrdDprPln1 FROM ODPV WHERE PeriodCat <= @YEAR GROUP BY ItemCode 
)T3 ON T0.ItemCode = T3.ItemCode
WHERE T0.ItemCode between @FAStartCode and @FAEndCode AND T0.ItemType = 'F'