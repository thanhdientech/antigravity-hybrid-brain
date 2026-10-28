/* 
   Tieu De: Doanh So Theo Khach Hang (Top Sales)
   Mo ta: Top khach hang mua nhieu nhat trong nam
*/

-- @Param: Nam Bao Cao | Type: INT | Default: 2024
DECLARE @Year INT = 2024
-- @Param: Top N khach | Type: INT | Default: 10
DECLARE @TopN INT = 10

SELECT TOP (@TopN)
    T0.CardCode,
    T0.CardName,
    SUM(T0.DocTotal) AS 'Tong_Doanh_So',
    COUNT(T0.DocEntry) AS 'So_Don_Hang'
FROM OINV T0
WHERE YEAR(T0.DocDate) = @Year
GROUP BY T0.CardCode, T0.CardName
ORDER BY SUM(T0.DocTotal) DESC;
