SELECT 
    T0.[CardCode],
    T0.[CardName],
    T0.[Phone1],
    T0.[Phone2],
		CASE
        WHEN T0.[Currency] = '##' THEN 'All Currency'
        ELSE T0.[Currency]
    END AS [Currency],
	T0.LicTradNum,
	T1.BankCode,
	T1.BankName,
	T2.AcctName,
	T0.DflAccount	
	
FROM 
    [dbo].[OCRD] T0 
	LEFT JOIN ODSC t1 ON t0.BankCode = t1.BankCode
	LEFT JOIN OCRB t2 on T0.DflAccount = t2.Account
WHERE 
    T0.[CardType] = 'S'
ORDER BY 
    T0.[CardCode]
