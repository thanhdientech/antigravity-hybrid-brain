-- =========== BÁO CÁO CÁC MẶT HÀNG GIAO GẦN ĐÂY =========== --
-- Tự động lấy 200 mặt hàng mới nhất được xuất giao khỏi kho (Dữ liệu tức thời)
SELECT TOP 200
    T0.DocDate AS [Ngày Giao Kho],
    LEFT(RIGHT('0000' + CAST(T0.DocTime AS VARCHAR), 4), 2) + ':' + RIGHT('0000' + CAST(T0.DocTime AS VARCHAR), 2) AS [Giờ Hệ Thống],
    T0.DocNum AS [Số Phiếu Giao],
    T0.CardName AS [Tên Khách Hàng (Đại Lý)],
    T1.ItemCode AS [Mã Vật Tư / Thành Phẩm],
    T1.Dscription AS [Tên Mặt Hàng],
    T1.Quantity AS [S.Lượng Xuất Giao],
    T1.unitMsr AS [Đơn Vị],
    T2.AvgPrice AS [Giá Vốn Hiện Tại (OITM)],
    T1.WhsCode AS [Kho Xuất Đi],
    T0.Comments AS [Ghi Chú Giao Hàng]
FROM ODLN T0
INNER JOIN DLN1 T1 ON T0.DocEntry = T1.DocEntry
LEFT JOIN OITM T2 ON T1.ItemCode = T2.ItemCode
-- WHERE T0.CANCELED = 'N'  -- Optional: Loại bỏ phiếu đã hủy
ORDER BY 
    T0.DocDate DESC, 
    T0.DocTime DESC,
    T0.DocNum DESC;
