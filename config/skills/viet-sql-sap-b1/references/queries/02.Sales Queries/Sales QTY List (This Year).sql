SELECT * FROM "BEASV_ITEM_SALES_ORDER"
WHERE 
"PrcrmntMtdVerbal"='Make' AND "CANCELED"!='Y' AND
"ShipDate" > DATEADD(year,-1,GETDATE()); 