-- =========== BÁO CÁO CÔNG NỢ KHÁCH HÀNG (AR AGING REPORT) NGÀY CHỐT =========== --
DECLARE @CutOffDate DATE = '20260131'

SELECT 
    T0.CardCode AS [Mã Khách Hàng],
    T0.CardName AS [Tên Khách Hàng],
    T1.DocNum AS [Số Hóa Đơn],
    T1.DocDate AS [Ngày Chứng Từ],
    T1.DocDueDate AS [Ngày Hạn Thanh Toán],
    T1.DocCur AS [Tiền Tệ],
    (T1.DocTotal - T1.PaidToDate) AS [Dư Nợ Còn Lại],
    DATEDIFF(day, T1.DocDueDate, @CutOffDate) AS [Số Ngày],
    CASE 
        WHEN DATEDIFF(day, T1.DocDueDate, @CutOffDate) <= 0 THEN N'0. Chưa Quá Hạn'
        WHEN DATEDIFF(day, T1.DocDueDate, @CutOffDate) BETWEEN 1 AND 30 THEN N'1. Nợ/Quá Hạn 1-30 Ngày'
        WHEN DATEDIFF(day, T1.DocDueDate, @CutOffDate) BETWEEN 31 AND 60 THEN N'2. Quá Hạn 31-60 Ngày'
        WHEN DATEDIFF(day, T1.DocDueDate, @CutOffDate) BETWEEN 61 AND 90 THEN N'3. Quá Hạn 61-90 Ngày'
        WHEN DATEDIFF(day, T1.DocDueDate, @CutOffDate) BETWEEN 91 AND 120 THEN N'4. Quá Hạn 91-120 Ngày'
        ELSE N'5. Quá Hạn >120 Ngày'
    END AS [Nhóm Nợ]

FROM OCRD T0
INNER JOIN OINV T1 ON T0.CardCode = T1.CardCode
WHERE T0.CardType = 'C' -- Chỉ lấy Khách Hàng (Customer)
  AND T1.DocStatus = 'O' -- Hóa đơn trạng thái Open
  AND T1.DocDate <= @CutOffDate -- Chỉ tính đến ngày chốt
  AND (T1.DocTotal - T1.PaidToDate) > 0 -- Số dư lớn hơn 0

ORDER BY 
    [Nhóm Nợ] DESC,
    [Số Ngày] DESC,
    [Dư Nợ Còn Lại] DESC;
