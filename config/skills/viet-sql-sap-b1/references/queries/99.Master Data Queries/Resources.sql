select APLATZ_ID as 'Resource Code',bez as 'Resource Name', GRUPPE as 'Workshop',TETIMETYPE_ID as 'Machine Cost element' ,vollkstbed as 'Machine Cost Rate',PTIMETYPE_ID as 'Labor Cost Element',PCOSTGK as 'Labor Cost rate',SOLLKAPSTDTAG as 'Daily Hours' from BEAS_APLATz
where aplatz_id like '%' +@Resource+'%'
and bez like '%' +@Bez+'%'