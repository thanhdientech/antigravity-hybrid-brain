SELECT 
    T0.[insID], T0.[customer], T0.[custmrName], T0.[contactCod], T0.[directCsmr], 
    T0.[drctCsmNam], T0.[manufSN], T0.[internalSN], T0.[warranty], T0.[wrrntyStrt], 
    T0.[wrrntyEnd], T0.[responsVal], T0.[responsUnt], T0.[itemCode], T0.[itemName], 
    T0.[itemGroup], T0.[manufDate], T0.[delivery], T0.[deliveryNo], T0.[invoice], 
    T0.[invoiceNum], T0.[dlvryDate], T0.[cntctPhone], T0.[street], T0.[block], 
    T0.[zip], T0.[city], T0.[county], T0.[country], T0.[state], T0.[instLction], 
    T0.[contract], T0.[cntrctStrt], T0.[cntrctEnd], T0.[attachment], T0.[objType], 
    T0.[logInstanc], T0.[userSign], T0.[createDate], T0.[userSign2], T0.[updateDate], 
    T0.[Building], T0.[status], T0.[replcIns], T0.[repByIns], T0.[technician], 
    T0.[territory], T0.[AtcEntry], T0.[Transfered], T0.[AddrType], T0.[Instance], 
    T0.[StreetNo], T0.[BPType], T0.[OwnerCode], T0.[DPPStatus], T0.[EncryptIV]  
FROM  
    [dbo].[OINS] T0   
    LEFT OUTER JOIN [dbo].[OITM] T1 ON T1.[ItemCode] = T0.[itemCode]   
    INNER JOIN [dbo].[OCRD] T2 ON T2.[CardCode] = T0.[customer]   
WHERE 
    (
        (@StatusActive IS NULL AND @StatusReturned IS NULL AND @StatusTransferred IS NULL)
        OR T0.[status] = @StatusActive
        OR T0.[status] = @StatusReturned
        OR T0.[status] = @StatusTransferred
    )
ORDER BY 
    T0.[customer], T0.[itemCode], T0.[internalSN]