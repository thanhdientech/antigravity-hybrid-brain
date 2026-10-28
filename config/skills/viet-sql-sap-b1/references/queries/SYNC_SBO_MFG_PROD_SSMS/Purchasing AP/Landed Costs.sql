/* ================== PARAMETERS (SSMS) ================== */
DECLARE @FromDate DATE = '2026-01-01';
DECLARE @ToDate   DATE = '2026-12-31';

selectT0.DocDate, T0.AgentCode, T0.AgentName, T0.DocNum, t0.DocEntry, T1.ItemCode, T1.Dscription, T1.Currency, T1.Rate, T1.Quantity, T1.InvQty, T1.TtlExpndLC, T1.TtlExpndFC, T1.TtlExpndSCfrom IPF1 T1 inner join OIPF T0 on T1.DocEntry = T0.DocEntrywhere T0.DocDate BETWEEN @FromDate and @ToDate