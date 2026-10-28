SELECT * from "BEASV_INVENTORY_HISTORY" WHERE "ProcurementMethod" = 'Make'
AND Itemcode like '%'+@Itemcode+'%'
AND ItemName like '%'+@Itemname+'%'