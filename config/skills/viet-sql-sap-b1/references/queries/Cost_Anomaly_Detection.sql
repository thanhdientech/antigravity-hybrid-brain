-- =========== BÁO CÁO CẢNH BÁO NHẬP SAI GIÁ VỐN BẤT THƯỜNG =========== --
-- Tự động tìm Giá Vốn ở Cấp Kho (OITW) hoặc Cấp Công Ty (OITM)
DECLARE @FromDate DATE = '20240101'
DECLARE @ToDate DATE = '20261231'
DECLARE @VarianceThreshold FLOAT = 0.3 -- Ngưỡng lệch 30%

SELECT 
    N'GRPO (Nhập Hàng)' AS [Loại Khai Báo],
    T0.DocNum AS [Số Chứng Từ],
    T0.DocDate AS [Ngày Mua],
    T1.ItemCode AS [Mã Vật Tư],
    T1.Dscription AS [Tên Vật Tư],
    T1.Quantity AS [S.Lượng Mua],
    T1.Price AS [Giá Mua Ghi Nhận],
    ISNULL(NULLIF(T2.AvgPrice, 0), T3.AvgPrice) AS [Giá Vốn Lưu Trữ],
    -- Tính tỷ lệ phần trăm chênh lệch
    ROUND((T1.Price - ISNULL(NULLIF(T2.AvgPrice, 0), T3.AvgPrice)) / NULLIF(ISNULL(NULLIF(T2.AvgPrice, 0), T3.AvgPrice), 0) * 100, 2) AS [% Lệch Giá],
    CASE 
        WHEN T1.Price > ISNULL(NULLIF(T2.AvgPrice, 0), T3.AvgPrice) * (1 + @VarianceThreshold) THEN N'🚨 Nhập Sai Giá Cực CAO'
        WHEN T1.Price < ISNULL(NULLIF(T2.AvgPrice, 0), T3.AvgPrice) * (1 - @VarianceThreshold) THEN N'⚠️ Nhập Sai Giá Cực THẤP'
        ELSE N'Bình Thường' 
    END AS [Mức Độ Cảnh Báo]

FROM OPDN T0
INNER JOIN PDN1 T1 ON T0.DocEntry = T1.DocEntry
INNER JOIN OITW T2 ON T1.ItemCode = T2.ItemCode AND T1.WhsCode = T2.WhsCode
INNER JOIN OITM T3 ON T1.ItemCode = T3.ItemCode
WHERE T0.DocDate BETWEEN @FromDate AND @ToDate
  AND ISNULL(NULLIF(T2.AvgPrice, 0), T3.AvgPrice) > 0

UNION ALL

SELECT 
    N'A/P Invoice (Hóa Đơn)' AS [Loại Khai Báo],
    T0.DocNum AS [Số Chứng Từ],
    T0.DocDate AS [Ngày Mua],
    T1.ItemCode AS [Mã Vật Tư],
    T1.Dscription AS [Tên Vật Tư],
    T1.Quantity AS [S.Lượng Mua],
    T1.Price AS [Giá Mua Ghi Nhận],
    ISNULL(NULLIF(T2.AvgPrice, 0), T3.AvgPrice) AS [Giá Vốn Lưu Trữ],
    ROUND((T1.Price - ISNULL(NULLIF(T2.AvgPrice, 0), T3.AvgPrice)) / NULLIF(ISNULL(NULLIF(T2.AvgPrice, 0), T3.AvgPrice), 0) * 100, 2) AS [% Lệch Giá],
    CASE 
        WHEN T1.Price > ISNULL(NULLIF(T2.AvgPrice, 0), T3.AvgPrice) * (1 + @VarianceThreshold) THEN N'🚨 Nhập Sai Giá Cực CAO'
        WHEN T1.Price < ISNULL(NULLIF(T2.AvgPrice, 0), T3.AvgPrice) * (1 - @VarianceThreshold) THEN N'⚠️ Nhập Sai Giá Cực THẤP'
        ELSE N'Bình Thường' 
    END AS [Mức Độ Cảnh Báo]

FROM OPCH T0
INNER JOIN PCH1 T1 ON T0.DocEntry = T1.DocEntry
INNER JOIN OITW T2 ON T1.ItemCode = T2.ItemCode AND T1.WhsCode = T2.WhsCode
INNER JOIN OITM T3 ON T1.ItemCode = T3.ItemCode
WHERE T0.DocDate BETWEEN @FromDate AND @ToDate
  AND ISNULL(NULLIF(T2.AvgPrice, 0), T3.AvgPrice) > 0

ORDER BY 
    [Ngày Mua] DESC,
    [% Lệch Giá] DESC;
