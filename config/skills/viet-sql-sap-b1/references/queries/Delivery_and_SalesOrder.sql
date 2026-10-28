-- @Param: Từ Ngày
DECLARE @FromDate DATE = '20200101'
-- @Param: Đến Ngày
DECLARE @ToDate DATE = '20261231'
-- @Param: Chọn Sales Order Gốc (Tùy chọn)
DECLARE @DocEntry INT = 0

SELECT 
    -- 1. Thông tin Khách hàng (Business Partner)
    T0.CardCode AS [Customer/Vendor Code], 
    T0.CardName AS [Customer/Vendor Name], 
    
    -- 2. Thông tin chứng từ Giao hàng (Delivery)
    T0.DocNum   AS [Delivery DocNum], 
    T0.DocDate  AS [Posting Date], 
    T0.DocDueDate AS [Due Date],
    T0.DocCur   AS [Document Currency], 
    T0.DocTime  AS [Generation Time],
    
    -- 3. Thông tin Nguồn (Sales Order gốc nếu có)
    T2.DocNum   AS [Sales Order Num],
    T2.DocDate  AS [SO Date],
    
    -- 4. Thông tin Vật tư (Items)
    T1.ItemCode AS [Item No.], 
    T1.Dscription AS [Item Description],
    T1.Quantity AS [Quantity], 
    T1.unitMsr  AS [Unit], 
    T1.UomCode  AS [Pur/Sal UoM if BaseUnit], 
    T1.Price    AS [Unit Price],
    T1.LineTotal AS [Line Total],
    T1.VatSum AS [Total Tax]

FROM 
    ODLN T0                -- Header: Delivery (Phiếu Giao Hàng)
INNER JOIN 
    DLN1 T1 ON T0.DocEntry = T1.DocEntry  -- Line: Chi tiết Giao hàng
LEFT JOIN 
    ORDR T2 ON T1.BaseEntry = T2.DocEntry AND T1.BaseType = 17 -- Liên kết ngược về Sales Order gốc (Type = 17)

WHERE 
    T0.DocDate >= @FromDate AND T0.DocDate <= @ToDate
    AND (@DocEntry = 0 OR T2.DocEntry = @DocEntry)

ORDER BY 
    T0.DocDate DESC, 
    T0.DocNum DESC;
