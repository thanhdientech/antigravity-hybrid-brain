SELECT  distinct                                 
 T0.PERS_ID as 'MÃ CN'                              
 , T0.DisplayName as 'TÊN CN'                              
 , DATEADD(dd, 0, DATEDIFF(dd, 0, T0.ANFZEIT)) AS 'NGÀY KHAI BÁO'                  
 , T2.menge_verbrauch as 'SL THEO ĐH'                         
 ,T1.teaplatz as 'KHOÁN TG (PHÚT)'                              
 ,T1.menge_je as 'KHOÁN SL'      
 , T0.ZEIT - isnull(try_cast(t0.batchnum as float),0) AS 'TG LÀM (PHÚT) HC'            
 ,(T0.ZEIT - isnull(try_cast(t0.batchnum as float),0))/480 as 'Quy ngày công/480 phút'            
 , isnull(try_cast(t0.batchnum as float),0) AS 'TG LÀM (PHÚT) TC'            
 , T0.menge_gut_rm - isnull(try_cast(t0.grund as float),0) AS 'SẢN LƯỢNG ĐẠT( HC)'            
 , isnull(try_cast(t0.grund as float),0) AS 'SẢN LƯỢNG ĐẠT( TC)'           
 , CASE T1.teaplatz WHEN 0 THEN 0           
 ELSE           
  COALESCE(NULLIF (ABS(T0.menge_gut_rm - (T0.ZEIT * T1.menge_je/T1.teaplatz ))          
   , -(T0.menge_gut_rm - (T0.ZEIT * T1.menge_je/T1.teaplatz ))), 0)          
 END as 'SẢN LƯỢNG VƯỢT'          
 , CASE T0.ZEIT WHEN 0 THEN 0 ELSE                               
  CASE T1.teaplatz WHEN 0 THEN 0 ELSE                                
  case T1.menge_je when 0 then 0 else                
   (T0.menge_gut_rm/ T0.ZEIT)/(T1.menge_je/T1.teaplatz) * 100                   
  end                
  END                              
 END as 'NĂNG SUẤT (%)'                        
 ,T1.ANZLS AS 'ĐƠN GIÁ KHOÁN'                        
 ,CAST(T1.ANZLS AS float)  * T0.menge_gut_rm AS 'THÀNH TIỀN'                        
 , case t4.angestelltenstatus                    
 when 2 then N'CÔNG NHẬT'                     
 when 5 then t0.UDF1                    
 else N'CHƯA PHÂN LOẠI'                    
 end AS 'LOẠI'                    
 , T1.BEZ as 'CÔNG ĐOẠN'                                  
 , T2.ItemCode as 'MÃ HÀNG', T2.ItemName as 'TÊN HÀNG', T2.U_znr as 'ĐƠN HÀNG'                                                                  
 , T0.BELNR_ID as 'WO', T0.BELPOS_ID AS 'WO_POS', T0.POS_ID AS 'ROUTING_POS'                                
 , T0.DocDate as 'sys_date'  
 , T0.BUCHNR_ID  
 FROM BEAS_ARBZEIT T0                                  
 INNER JOIN BEAS_FTAPL T1 ON T0.BELNR_ID = T1.BELNR_ID AND T0.BELPOS_ID = T1.BELPOS_ID AND T0.POS_ID = T1.POS_ID                                
 INNER JOIN BEAS_FTPOS T2 ON T1.BELNR_ID = T2.BELNR_ID AND T1.BELPOS_ID = T2.BELPOS_ID                                  
 INNER JOIN BEAS_PERS T4 ON T0.PERS_ID = T4.PERS_ID                        
                                             
 WHERE T0.ANFZEIT >=@FromDate and  T0.ANFZEIT <= @ToDate AND CANCEL = 0                                
 ORDER BY DATEADD(dd, 0, DATEDIFF(dd, 0, T0.ANFZEIT)) desc, T0.DocDate DESC