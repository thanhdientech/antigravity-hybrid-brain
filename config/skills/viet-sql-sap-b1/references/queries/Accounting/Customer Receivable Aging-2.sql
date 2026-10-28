SELECT 
BpCode AS BusinessPartnerCode, 
BpName AS BusinessPartnerName,
SUM(DueTotal) AS DueTotal,
SUM(DueFuture) AS DueFuture,
SUM(Due0To8) AS Due0To8,
SUM(Due9To30) AS Due9To30,
SUM(Due30Plus) AS Due30Plus
FROM
(
	SELECT 
	MAX(T0.ShortName) AS BpCode, 
	MAX(T4.CardName) AS BpName,
	MAX(T0.DueDate) AS DueDate,  
	CASE WHEN DATEDIFF(dd,T0.DueDate,@Today) < 0 THEN 0 - MAX(T0.BalDueCred) + SUM(T1.ReconSum) ELSE 0 END AS DueFuture,
	CASE WHEN DATEDIFF(dd,T0.DueDate,@Today) BETWEEN 0 AND 8 THEN 0 - MAX(T0.BalDueCred) + SUM(T1.ReconSum) ELSE 0 END AS Due0To8,
	CASE WHEN DATEDIFF(dd,T0.DueDate,@Today) BETWEEN 9 AND 30 THEN 0 - MAX(T0.BalDueCred) + SUM(T1.ReconSum) ELSE 0 END AS Due9To30,
	CASE WHEN DATEDIFF(dd,T0.DueDate,@Today) > 30 THEN 0 - MAX(T0.BalDueCred) + SUM(T1.ReconSum) ELSE 0 END AS Due30Plus,
	0 - MAX(T0.BalDueCred) + SUM(T1.ReconSum) AS DueTotal
	FROM JDT1 T0  
	JOIN ITR1 T1 ON T1.TransId = T0.TransId AND T1.TransRowId = T0.Line_ID  
	JOIN OITR T2 ON T2.ReconNum = T1.ReconNum   
	JOIN OCRD T4 ON T4.CardCode = T0.ShortName AND T4.CardType = 'C'    
	WHERE 1=1
	AND T0.RefDate <= @Today
	AND T2.ReconDate > @Today 
	AND T1.IsCredit = 'C'
	GROUP BY T0.TransId, T0.Line_ID, T0.BPLName, T0.DueDate
	HAVING MAX(T0.BalFcCred) <>- SUM(T1.ReconSumFC) OR MAX(T0.BalDueCred) <>- SUM(T1.ReconSum)   

	UNION ALL 

	SELECT 
	MAX(T0.ShortName) AS BpCode, 
	MAX(T4.CardName) AS BpName,
	MAX(T0.DueDate), 
	CASE WHEN DATEDIFF(dd,T0.DueDate,@Today) < 0 THEN MAX(T0.BalDueDeb) + SUM(T1.ReconSum) ELSE 0 END AS DueFuture,
	CASE WHEN DATEDIFF(dd,T0.DueDate,@Today) BETWEEN 0 AND 8 THEN MAX(T0.BalDueDeb) + SUM(T1.ReconSum) ELSE 0 END AS Due0To8,
	CASE WHEN DATEDIFF(dd,T0.DueDate,@Today) BETWEEN 9 AND 30 THEN MAX(T0.BalDueDeb) + SUM(T1.ReconSum) ELSE 0 END AS Due9To30,
	CASE WHEN DATEDIFF(dd,T0.DueDate,@Today) > 30 THEN MAX(T0.BalDueDeb) + SUM(T1.ReconSum) ELSE 0 END AS Due30Plus,
	MAX(T0.BalDueDeb) + SUM(T1.ReconSum) AS DueTotal
	FROM dbo.JDT1 T0  
	JOIN dbo.ITR1 T1 ON T1.TransId = T0.TransId  AND  T1.TransRowId = T0.Line_ID   
	JOIN dbo.OITR T2 ON T2.ReconNum = T1.ReconNum   
	JOIN dbo.OCRD T4 ON T4.CardCode = T0.ShortName AND T4.CardType = 'C'   
	WHERE 1=1
	AND T0.RefDate <= @Today
	AND T2.ReconDate > @Today
	AND T1.IsCredit = 'D'  
	GROUP BY T0.TransId, T0.Line_ID, T0.BPLName, T0.DueDate
	HAVING MAX(T0.BalFcDeb) <>- SUM(T1.ReconSumFC) OR  MAX(T0.BalDueDeb) <>- SUM(T1.ReconSum)

	UNION ALL 

	SELECT 
	MAX(T0.ShortName) AS BpCode, 
	MAX(T2.CardName) AS BpName,
	MAX(T0.DueDate), 
	CASE WHEN DATEDIFF(dd,T0.DueDate,@Today) < 0 THEN MAX(T0.BalDueDeb)- MAX(T0.BalDueCred) ELSE 0 END AS DueFuture,
	CASE WHEN DATEDIFF(dd,T0.DueDate,@Today) BETWEEN 0 AND 8 THEN MAX(T0.BalDueDeb)- MAX(T0.BalDueCred) ELSE 0 END AS Due0To8,
	CASE WHEN DATEDIFF(dd,T0.DueDate,@Today) BETWEEN 9 AND 30 THEN MAX(T0.BalDueDeb)- MAX(T0.BalDueCred) ELSE 0 END AS Due9To30,
	CASE WHEN DATEDIFF(dd,T0.DueDate,@Today) > 30 THEN MAX(T0.BalDueDeb)- MAX(T0.BalDueCred) ELSE 0 END AS Due30Plus,
	MAX(T0.BalDueDeb)- MAX(T0.BalDueCred) AS DueTotal
	FROM  dbo.JDT1 T0  
	JOIN dbo.OJDT T1  ON  T1.TransId = T0.TransId   
	JOIN dbo.OCRD T2  ON  T2.CardCode = T0.ShortName AND T2.CardType = 'C'
	WHERE 1=1
	AND T0.RefDate <= @Today
	AND  (T0.BalDueCred <> T0.BalDueDeb  OR  T0.BalFcCred <> T0.BalFcDeb ) AND   
	NOT EXISTS
	(
		SELECT 
		U0.TransId, 
		U0.TransRowId 
		FROM  dbo.ITR1 U0  
		JOIN dbo.OITR U1  ON  U1.ReconNum = U0.ReconNum  
		WHERE T0.TransId = U0.TransId  AND  T0.Line_ID = U0.TransRowId  AND  U1.ReconDate > @Today
		GROUP BY U0.TransId, U0.TransRowId
	)   
	GROUP BY T0.TransId, T0.Line_ID, T0.BPLName, T0.DueDate
) DATA
GROUP BY BpCode, BpName