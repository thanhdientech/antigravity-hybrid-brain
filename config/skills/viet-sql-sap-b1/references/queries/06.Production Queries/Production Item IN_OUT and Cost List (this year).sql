SELECT * FROM "BEASV_ITEM_PRODUCTION" WHERE
PrcrmntMtd='M' AND CANCELED!='Y' 
AND DocDate > DATEADD(year,-1,GETDATE())
ORDER BY DocEntry    --last12months