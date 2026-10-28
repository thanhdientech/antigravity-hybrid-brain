SELECT 
    T0.[CardCode],
    T0.[CardName],
    T0.[CardType],
    T1.[GroupName],
    T0.[Phone1],
    T0.[Balance],
    T0.[BalanceSys],
    T0.[BalanceFC],
    T0.[Currency]
FROM 
    [dbo].[OCRD] T0
    LEFT OUTER JOIN [dbo].[OCRG] T1 
        ON T1.[GroupCode] = T0.[GroupCode]
WHERE 
    T0.[CardCode] >= (@Cardcode_S)
    AND T0.[CardCode] <= (@Cardcode_E)
    AND T0.[CardType] <> (@type)
ORDER BY 
    T0.[CardType],
    T0.[CardCode]

