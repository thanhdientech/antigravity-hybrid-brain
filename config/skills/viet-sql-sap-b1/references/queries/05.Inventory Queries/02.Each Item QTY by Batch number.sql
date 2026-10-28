SELECT TOP 999999 
 "OBTN"."ItemCode"
,"OBTN"."DistNumber" as 'Batch Number'
, "OBTQ"."Quantity"
,Coalesce(
(SELECT sum(r."Quantity") 
 FROM "BEAS_RESERVATION_LINE" r 
WHERE r."ItemCode"="OBTN"."ItemCode" and r."RESERVATIONTYPE"='S' and r."WhsCode"="OBTQ"."WhsCode" and r."BatchNum"="OBTN"."DistNumber"),0) as "RESERVATION"
, "OBTQ"."WhsCode" as 'Warehouse'
, "OITM"."InvntryUom" as 'UOM'
, "OBTN"."Location"
, "OBTN"."MnfSerial" as 'Manufacture Serial'
, "OBTN"."LotNumber"
, "OBTN"."ExpDate" as 'Expired Date'
, "OBTN"."MnfDate" as 'Manufacture Date'
, "OBTN"."InDate" 
, case when "OBTN"."Status" = 0 then 'Free' end as 'Batch Status'
, "OBTN"."Notes"
, "OBTN"."U_beas_ver" as 'Version'


 FROM "OBTN" 
INNER JOIN "OBTQ" on "OBTQ"."ItemCode"="OBTN"."ItemCode" and "OBTQ"."SysNumber"="OBTN"."SysNumber" 
INNER JOIN "OWHS" on "OWHS"."WhsCode"="OBTQ"."WhsCode" 
INNER JOIN "OITM" on "OITM"."ItemCode"="OBTN"."ItemCode" 
LEFT OUTER JOIN "OLCT" on "OLCT"."Code" = "OWHS"."Location" 
WHERE "OBTN"."ItemCode"=@Itemcode and "OBTQ"."Quantity" <> 0