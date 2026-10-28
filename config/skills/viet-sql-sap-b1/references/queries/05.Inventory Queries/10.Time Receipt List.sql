SELECT TOP 999999 "beas_arbzeit"."belnr_id" as 'WO NO.'
, "beas_arbzeit"."belpos_id" as 'WO Pos'
, "beas_arbzeit"."pos_id" as 'Routing Pos'
, "beas_arbzeit"."pers_id" as 'Worker ID'
, "beas_pers"."displayname" as 'Worker Name'
--, "beas_arbzeit"."anfzeit"
--, "beas_arbzeit"."endzeit"
--, "beas_arbzeit"."zeit"
--, "beas_arbzeit"."abgkz"
, "beas_arbzeit"."aplatz_id" as 'Resource ID'
, "beas_aplatz"."bez" as 'Resource Name'
, "beas_fthaupt"."auftrag" as 'Order Reference'
, "beas_fthaupt"."knd_id" as 'Customer ID'
, "beas_fthaupt"."kndname" as 'Customer Name'
--, "beas_fthaupt"."abgkz"
--, "beas_fthaupt"."prior_id"
--, "beas_fthaupt"."druckkz"
, "beas_ftapl"."ag_id" as 'operation ID'
--, "beas_ftapl"."kstst_id"
, "beas_ftapl"."bez" as 'Operation Concept'
--, "beas_ftapl"."pos_text"
, "beas_ftapl"."anfzeit" as 'Start Time'
, "beas_ftapl"."endzeit" as 'End Time'
, "oitm"."itemcode" as 'Item Code'
, "oitm"."itemname" as 'Item Name'
, "beas_ftpos"."menge_verbrauch" as 'WO QTY'
, "beas_ftpos"."me_verbrauch" as 'UOM'
, "beas_arbzeit"."menge_gut" as 'Good QTY'
, "beas_arbzeit"."menge_schlecht" as 'Bad QTY'
--, "beas_arbzeit"."grund"
, "beas_arbzeit"."udf1" 
, "beas_arbzeit"."udf2"
--, "beas_arbzeit"."udf3"
--, "beas_arbzeit"."udf4"
--, cast('' as nvarchar(50)) as templatefield1, cast('' as nvarchar(50)) as templatefield2, cast('' as nvarchar(50)) as templatefield3, cast('' as nvarchar(50)) as templatefield4, cast('' as nvarchar(50)) as templatefield5, cast('' as nvarchar(50)) as templatefield6, "beas_aplatz"."bitmap_id", "beas_aplatz"."color_id"
, (( ( (Coalesce("BEAS_FTAPL"."THAPLATZ",0) + Coalesce("BEAS_FTAPL"."TNAPLATZ",0) + Coalesce("BEAS_FTAPL"."TEAPLATZ",0)) * case when Coalesce("BEAS_FTAPL"."MENGE_JE",-1)=0 then 1 else (("BEAS_FTPOS"."MENGE_VERBRAUCH" + Coalesce("BEAS_FTPOS"."MENGE_VERSCHNITT",0)) / case when Coalesce("BEAS_FTAPL"."MENGE_JE",0) = 0 then 1 else "BEAS_FTAPL"."MENGE_JE" end) end	/ case Coalesce("BEAS_FTAPL"."NUTZEN",0) when 0 then 1 else "BEAS_FTAPL"."NUTZEN" end	* case Coalesce("BEAS_FTAPL"."ANZAHL",0) when 0 then 1 else "BEAS_FTAPL"."ANZAHL" end	* (1+(Coalesce("BEAS_FTAPL"."AUSSCHUSSFAKTOR",0)/100))	) * case when Coalesce("BEAS_APLATZ"."ZEITGRAD",0)=0 then 1 else 100 / "BEAS_APLATZ"."ZEITGRAD" end )+ Coalesce("BEAS_FTAPL"."TR2APLATZ",0) )	* case when Coalesce("BEAS_FTAPL"."MENGE_ZEITJE",0)=0 then 1 else "BEAS_FTAPL"."MENGE_ZEITJE" end	/ "BEAS_FTPOS"."MENGE_VERBRAUCH" * "BEAS_ARBZEIT"."MENGE_GUT" as plantime
--, 1.000002 as percents
--, isnull("BEAS_FTHAUPT"."BITMAPCLOSE",'bmp\project_yellow.png') as beas_fthaupt_bitmapclose
--, isnull("BEAS_FTAPL"."BITMAPNAME","BEAS_AGTYP"."BITMAP_ID") as routingbitmap
--,isnull("BEAS_FTAPL"."COLORID","BEAS_AGTYP"."COLOR_ID") as routingcolor
--, 1.000003 as duration_h
--, 1.000004 as plantime_h
--, 1.000006 as fdcavailable
--, 1.000006 as fdcpercent
, coalesce("BEAS_FTPOS"."PROJECT","BEAS_FTHAUPT"."PROJECT",'') as 'Project Code'
FROM "beas_ftapl" 
LEFT OUTER JOIN "beas_agtyp" ON "beas_ftapl"."agtyp" = "beas_agtyp"."agtyp" 
inner join "beas_arbzeit" on "beas_arbzeit"."belnr_id"="beas_ftapl"."belnr_id" and "beas_arbzeit"."belpos_id" = "beas_ftapl"."belpos_id" and "beas_arbzeit"."pos_id" = "beas_ftapl"."pos_id" 
inner join "beas_fthaupt" on "beas_arbzeit"."belnr_id" = "beas_fthaupt"."belnr_id" 
inner join "beas_ftpos" on "beas_arbzeit"."belnr_id" = "beas_ftpos"."belnr_id" and "beas_arbzeit"."belpos_id" = "beas_ftpos"."belpos_id" 
inner join "oitm" on "beas_ftpos"."itemcode" = "oitm"."itemcode" 
inner join "beas_pers" on "beas_arbzeit"."pers_id" = "beas_pers"."pers_id" 
inner join "beas_aplatz" on "beas_aplatz"."aplatz_id"="beas_arbzeit"."aplatz_id" 
WHERE (1=1 and "BEAS_FTHAUPT"."BELDAT" between '19900101 00:00:00' and '20991223 00:00:00' and "BEAS_FTPOS"."LIEFERDATUM" between '19900101 00:00:00' and '20991223 00:00:00' and isnull("BEAS_FTPOS"."ABGKZ",'')<>'J' and isnull("BEAS_FTHAUPT"."ABGKZ",'')<>'J' 
--and "BEAS_ARBZEIT"."ENDZEIT" <= @StartDate and "BEAS_ARBZEIT"."ANFZEIT" >= @EndDate) 
and "BEAS_ARBZEIT"."ENDZEIT" <= '2021-12-31' and "BEAS_ARBZEIT"."ANFZEIT" >= '2021-01-01' ) 
AND ( coalesce("beas_arbzeit"."cancel",0)=0 )

order by "beas_ftapl"."anfzeit"