SELECT T0.ItemCode AS 'Itemcode',
T1.ItemName AS 'ItemName',
T0.APLATZ_ID AS 'Resources ID',
T2.BEZ AS 'Resource Name',
T0.pos_id as 'SEQ',
t0.ag_id as 'Routing code',
T0.bez as 'Routing Concept',
ISNULL(T0.TEAPLATZ,0) AS Time,
ISNULL(T0.menge_zeitje,0) AS Mins,
ISNULL(T0.menge_je,0) AS 'Roll-Out',
ISNULL(VOLLKSTBED,0) AS 'Machine Rate by Hrs',
 ISNULL(PCOSTVK,0) AS 'Labor Rate by Hrs',
ISNULL(VOLLKSTBED,0) * ISNULL(T0.TEAPLATZ,0)/ISNULL(T0.menge_je,0) AS 'Unit priceof Machine',
 ISNULL(PCOSTVK,0) * ISNULL(T0.TEAPLATZ,0)/ISNULL(T0.menge_je,0) AS 'Unit Price of Labor',
(ISNULL(VOLLKSTBED,0) + ISNULL(PCOSTVK,0)) * ISNULL(T0.TEAPLATZ,0)/ISNULL(T0.menge_je,0) AS 'Unit price of L/M'
FROM BEAS_APL T0 INNER JOIN OITM T1 ON T0.ItemCode = T1.ItemCode
INNER JOIN BEAS_APLATZ T2 ON T0.APLATZ_ID = T2.APLATZ_ID
where T0.Itemcode like '%' +@Itemcode + '%'
ORDER BY T0.ItemCode