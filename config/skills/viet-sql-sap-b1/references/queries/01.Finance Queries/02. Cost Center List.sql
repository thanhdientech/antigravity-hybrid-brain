select distinct T1.OcrCode as DistCode,T2.OcrName as DistName ,T1.PrcCode as CenterCost
, CASE WHEN T2.OcrCode= T3.PrcCode THEN T2.OcrName ELSE T3.PrcName END AS CenterName
, T1.PrcAmount
From OCR1 T1 with(nolock) 
left join OOCR T2 WITH(NOLOCK) ON T2.OcrCode =T1.OcrCode and T2.Active ='Y'
left join OPRC T3 WITH(NOLOCK) ON T3. PrcCode = T1.PrcCode
where T1.OcrCode NOT LIKE ('Centr%')