SELECT DISTINCT
    T1.OcrCode AS DistCode,
    T2.OcrName AS DistName,
    T1.PrcCode AS CenterCost,
    CASE 
        WHEN T2.OcrCode = T3.PrcCode THEN T2.OcrName 
        ELSE T3.PrcName 
    END AS CenterName,
    T1.PrcAmount
FROM OCR1 T1 WITH (NOLOCK)
    LEFT JOIN OOCR T2 WITH (NOLOCK) 
        ON T2.OcrCode = T1.OcrCode 
        AND T2.Active = 'Y'
    LEFT JOIN OPRC T3 WITH (NOLOCK) 
        ON T3.PrcCode = T1.PrcCode