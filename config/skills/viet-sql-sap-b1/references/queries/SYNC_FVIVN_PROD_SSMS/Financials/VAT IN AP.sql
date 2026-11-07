/* ================== PARAMETERS (SSMS) ================== */
DECLARE @StartDate NVARCHAR(50) = '2026-01-01';
DECLARE @EndDate   NVARCHAR(50) = '2026-12-31';
select 
	T0.TaxDate as 'Ngày phát hành',
	ISNULL(T3.[BPLName], 'Trụ sở chính') as 'Tên_Chi_Nhánh', -- [THÊM CỘT]
	T0.DocNum as 'Số AP hóa đơn',
	T0.NumAtCard as 'Số hóa đơn',
	T0.CardName as 'Tên người mua',
	convert(nvarchar(30),T2.LicTradNum ) as 'Mã số thuế',
	T0.Comments as 'Tên Mặt hàng',
	convert(nvarchar(30), sum(T1.LineTotal)) as 'Doanh số chưa có thuế',
	T1.VatGroup as 'Thuế suất (%)',
	convert(nvarchar(30),sum(T1.LineVat)) as 'Thuế GTGT'
	,'AP' AS LOAI
from  
	OPCH T0  INNER JOIN PCH1 T1 ON T0.[DocEntry] = T1.[DocEntry] 
	INNER JOIN OCRD T2 ON T0.CardCode = T2.CardCode
	LEFT JOIN OBPL T3 ON T0.[BPLId] = T3.[BPLId] -- [THÊM JOIN]
where 
	T0.DocDate >=  @StartDate and T0.DocDate <= @EndDate AND T0.CANCELED = 'N'
	group by T0.TaxDate, T3.[BPLName], T0.DocNum, T2.LicTradNum,T0.NumAtCard,T0.CardName,T0.Comments,T1.VatGroup,T0.DocTotal  -- [THÊM VÀO GROUP BY]
--- end thuế từ ar invoce
UNION
select 
	T0.TaxDate as 'Ngày phát hành',
	ISNULL(T3.[BPLName], 'Trụ sở chính') as 'Tên_Chi_Nhánh', -- [THÊM CỘT] 
	T0.DocNum  as 'Số AP hóa đơn',
	T0.NumAtCard as 'Số hóa đơn',
	T0.CardName as 'Tên người mua',
	convert(nvarchar(30),T2.LicTradNum ) as 'Mã số thuế',
	T0.Comments as 'Tên Mặt hàng',
    convert(nvarchar(30),- sum(T1.LineTotal)) as 'Doanh số chưa có thuế',
	T1.VatGroup as 'Thuế suất (%)',
	convert(nvarchar(30),sum(T1.LineVat)) as 'Thuế GTGT'
	,'AP-CREDIT MEMO' AS LOAI
from  
	ORPC T0  INNER JOIN RPC1 T1 ON T0.[DocEntry] = T1.[DocEntry] 
	INNER JOIN OCRD T2 ON T0.CardCode = T2.CardCode
	LEFT JOIN OBPL T3 ON T0.[BPLId] = T3.[BPLId] -- [THÊM JOIN]
where 
	T0.DocDate >=  @StartDate and T0.DocDate <= @EndDate AND T0.CANCELED = 'N'
group by T0.TaxDate, T3.[BPLName], T0.DocNum, T0.NumAtCard,T2.LicTradNum,T0.CardName,T0.Comments,T1.VatGroup,T0.DocTotal -- [THÊM VÀO GROUP BY]
--- end thuế từ aR credit meno
---------------------------------
UNION
SELECT
T0.RefDate as 'Ngày phát hành',
    ISNULL(T3.[BPLName], 'Trụ sở chính') as 'Tên_Chi_Nhánh', -- [THÊM CỘT]
	T0.TransId as 'Số AP hóa đơn',
	'' as 'Số hóa đơn',
	T0.ContraAct as 'Tên người mua',
	'' as 'Mã số thuế',
	T0.LineMemo as 'Tên Mặt hàng',
	T0.BaseSum as 'Doanh số chưa có thuế',
	T0.VatGroup as 'Thuế suất (%)',
	
	T0.Debit as 'Thuế GTGT'
	,'JE Debit' AS LOAI
FROM JDT1 t0
LEFT JOIN OBPL T3 ON T0.[BPLId] = T3.[BPLId] -- [THÊM JOIN]
WHERE
account IN ( 
'133101'
)
 and vatgroup in (
'IVAT0'
,'IVAT10'
,'IVAT5'

 )
 and TransType = 30
 and T0.Debit <> 0
 and T0.RefDate >= @StartDate and T0.RefDate <= @EndDate
 --end thuế lấy từ je cột Debit
 union
SELECT
T0.RefDate as 'Ngày phát hành',
    ISNULL(T3.[BPLName], 'Trụ sở chính') as 'Tên_Chi_Nhánh', -- [THÊM CỘT]
	T0.TransId as 'Số AP hóa đơn',
	'' as 'Số hóa đơn',
	T0.ContraAct as 'Tên người mua',
	'' as 'Mã số thuế',
	T0.LineMemo as 'Tên Mặt hàng',
	-T0.BaseSum as 'Doanh số chưa có thuế',
	T0.VatGroup as 'Thuế suất (%)',
	
	-T0.Credit as 'Thuế GTGT'
	,'JE Credit' AS LOAI
FROM JDT1 t0
LEFT JOIN OBPL T3 ON T0.[BPLId] = T3.[BPLId] -- [THÊM JOIN]
WHERE
account IN ( 
'133101'
)
 and vatgroup in (
'IVAT0'
,'IVAT10'
,'IVAT5'

 )
 and TransType = 30
 and T0.Credit <> 0
 and T0.RefDate >= @StartDate and T0.RefDate <= @EndDate
union
SELECT 
T0.RefDate as 'Ngày phát hành',
    ISNULL(T3.[BPLName], 'Trụ sở chính') as 'Tên_Chi_Nhánh', -- [THÊM CỘT]
	T0.TransId as 'Số AR hóa đơn',
	'' as 'Số hóa đơn',
	T0.ContraAct as 'Tên người mua',
	'' as 'Mã số thuế',
	T0.LineMemo as 'Tên Mặt hàng',
	T0.BaseSum as 'Doanh số chưa có thuế',
	T0.VatGroup as 'Thuế suất (%)',
	
	T0.Debit as 'Thuế GTGT'
	,'JE Credit' AS LOAI
FROM JDT1 t0
LEFT JOIN OBPL T3 ON T0.[BPLId] = T3.[BPLId] -- [THÊM JOIN]
WHERE
t0.Account = '133102'
and T0.RefDate >= @StartDate and T0.RefDate <= @EndDate
 order by T0.DocNum
 --end thuế lấy từ je cột crebit