SELECT 
    T0.[CountryCod], T0.[BankNum], T0.[AcctNum], T0.[CheckKey], T0.[CheckNum], 
    T0.[VendorCode], T0.[CheckDate], T0.[PmntNum], T0.[CheckSum], T0.[Currency], 
    T0.[TransNum], T0.[Printed], T0.[PrintedBy], T0.[Details], T0.[PrnConfrm], 
    T0.[Canceled], T0.[CardOrAcct], T0.[BnkActKey], T0.[VendorName], T0.[TransRef]
FROM 
    [dbo].[OCHO] T0
WHERE 
    (@StartDate IS NULL OR T0.[CheckDate] >= @StartDate)
GROUP BY 
    T0.[CountryCod], T0.[BankNum], T0.[AcctNum], T0.[CheckKey], T0.[CheckNum], 
    T0.[VendorCode], T0.[CheckDate], T0.[PmntNum], T0.[CheckSum], T0.[Currency], 
    T0.[TransNum], T0.[Printed], T0.[PrintedBy], T0.[Details], T0.[PrnConfrm], 
    T0.[Canceled], T0.[CardOrAcct], T0.[BnkActKey], T0.[VendorName], T0.[TransRef]
ORDER BY 
    T0.[BnkActKey], T0.[CheckNum], T0.[CheckKey], T0.[VendorCode]