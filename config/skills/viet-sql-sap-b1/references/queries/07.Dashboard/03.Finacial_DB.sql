SELECT   
    Year(T0.RefDate) AS Nam,  
    Month(T0.RefDate) AS Thang,  
    IIF(SUM(IIF(T0.Account LIKE '511%' , T0.Debit - T0.Credit, 0)) IS NULL, 0,   
        SUM(IIF(T0.Account LIKE '511%', T0.Debit - T0.Credit, 0))) AS Tong_Thu_Nhap,  
  
    IIF(SUM(IIF(T0.Account LIKE '632%', T0.Debit - T0.Credit, 0)) IS NULL, 0,   
        SUM(IIF(T0.Account LIKE '632%', T0.Debit - T0.Credit, 0))) AS Gia_Von_Hang_Nam,  
  
    IIF(SUM(IIF(T0.Account LIKE '642%', T0.Debit - T0.Credit, 0)) IS NULL, 0,   
        SUM(IIF(T0.Account LIKE '642%', T0.Debit - T0.Credit, 0))) AS Tong_Chi_Phi_Hoat_Dong,  
  
    IIF(SUM(IIF(T0.Account LIKE '133%', T0.Debit - T0.Credit, 0)) IS NULL, 0,   
        SUM(IIF(T0.Account LIKE '133%', T0.Debit - T0.Credit, 0))) AS Thue   
  
INTO #TEMP01  
FROM JDT1 T0  
WHERE T0.RefDate >= @FromDate and T0.RefDate <= @ToDate
GROUP BY Year(T0.RefDate), Month(T0.RefDate)   
ORDER BY Year(T0.RefDate), Month(T0.RefDate);  
  
-- Tính toán trong bảng tạm  
SELECT   
    *,  
    -- Tổng chi phí = Giá vốn hàng năm + Tổng chi phí hoạt động  
    (Gia_Von_Hang_Nam + Tong_Chi_Phi_Hoat_Dong) AS Tong_Chi_Phi,  
  
    -- Lợi nhuận gộp = Tổng thu nhập - Giá vốn hàng năm  
    (Tong_Thu_Nhap - Gia_Von_Hang_Nam) AS Loi_Nhuan_Gop,  
  
    -- Lợi nhuận trước thuế và lãi vay = Lợi nhuận gộp - Tổng chi phí hoạt động  
    ((Tong_Thu_Nhap - Gia_Von_Hang_Nam) - Tong_Chi_Phi_Hoat_Dong) AS Loi_Nhuan_Truoc_Thue_Va_Lai_Vay,  
  
    -- Lợi nhuận thuần = Lợi nhuận trước thuế và lãi vay - Thuế  
    (((Tong_Thu_Nhap - Gia_Von_Hang_Nam) - Tong_Chi_Phi_Hoat_Dong) - Thue) AS Loi_Nhuan_Thuan,  
  
    -- Tỷ suất lợi nhuận thuần = Lợi nhuận thuần / Tổng thu nhập (tránh chia 0)  
    CASE   
        WHEN Tong_Thu_Nhap = 0 THEN 0  
        ELSE (((Tong_Thu_Nhap - Gia_Von_Hang_Nam) - Tong_Chi_Phi_Hoat_Dong) - Thue) * 1.0 / Tong_Thu_Nhap  
    END AS Ty_Suat_Loi_Nhuan_Thuan,  
  
    -- Phân bổ chi phí theo phòng ban  
    (Tong_Chi_Phi_Hoat_Dong * 0.3) AS Phong_Ban_Hang,  
    (Tong_Chi_Phi_Hoat_Dong * 0.1) AS Phong_Mua_Hang,  
    (Tong_Chi_Phi_Hoat_Dong * 0.2) AS Phong_Hanh_Chinh,  
    (Tong_Chi_Phi_Hoat_Dong * 0.25) AS Phong_San_Xuat,  
    (Tong_Chi_Phi_Hoat_Dong * 0.15) AS Cong_Xuong_San_Xuat,  
  
    -- Thu nhập kế hoạch = Tổng thu nhập * 0.9  
    (Tong_Thu_Nhap * 0.9) AS Thu_Nhap_Ke_Hoach,  
  
    -- Tỷ lệ thu nhập kế hoạch = Tổng thu nhập / Thu nhập kế hoạch (tránh chia 0)  
    CASE   
        WHEN (Tong_Thu_Nhap * 0.9) = 0 THEN 0  
        ELSE Tong_Thu_Nhap * 1.0 / (Tong_Thu_Nhap * 0.9)  
    END AS Ty_Le_Thu_Nhap_Ke_Hoach,  
  
    -- Tỷ lệ thu nhập còn lại = 1 - Tỷ lệ thu nhập kế hoạch  
    CASE   
        WHEN (Tong_Thu_Nhap * 0.9) = 0 THEN 0  
        ELSE 1 - (Tong_Thu_Nhap * 1.0 / (Tong_Thu_Nhap * 0.9))  
    END AS Ty_Le_Thu_Nhap_Con_Lai,  
  
    -- Chi phí kế hoạch = Tổng chi phí hoạt động * 1.1  
    (Tong_Chi_Phi_Hoat_Dong * 1.1) AS Chi_Phi_Ke_Hoach,  
  
    -- Tỷ lệ chi phí kế hoạch = Tổng chi phí / Chi phí kế hoạch (tránh chia 0)  
    CASE   
        WHEN (Tong_Chi_Phi_Hoat_Dong * 1.1) = 0 THEN 0  
        ELSE (Gia_Von_Hang_Nam + Tong_Chi_Phi_Hoat_Dong) * 1.0 / (Tong_Chi_Phi_Hoat_Dong * 1.1)  
    END AS Ty_Le_Chi_Phi_Ke_Hoach,  
  
    -- Tỷ lệ chi phí còn lại = 1 - Tỷ lệ chi phí kế hoạch  
    CASE   
        WHEN (Tong_Chi_Phi_Hoat_Dong * 1.1) = 0 THEN 0  
        ELSE 1 - ((Gia_Von_Hang_Nam + Tong_Chi_Phi_Hoat_Dong) * 1.0 / (Tong_Chi_Phi_Hoat_Dong * 1.1))  
    END AS Ty_Le_Chi_Phi_Con_Lai  
  
FROM #TEMP01   
WHERE Nam = 2024;  

DROP TABLE #TEMP01;  