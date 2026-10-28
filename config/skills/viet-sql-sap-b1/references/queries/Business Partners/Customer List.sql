SELECT 
    T0.[CardCode],
    T0.[CardName],
    T0.[Phone1],
    T0.[Phone2],
	CASE
        WHEN T0.[Currency] = '##' THEN 'All Currency'
        ELSE T0.[Currency]
    END AS [Currency],
	T0.LicTradNum
	
FROM 
    [dbo].[OCRD] T0
WHERE 
    T0.[CardType] = 'C'
ORDER BY 
    T0.[CardCode]