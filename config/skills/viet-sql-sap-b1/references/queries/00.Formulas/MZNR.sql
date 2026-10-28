Select U_znr from OITM where itemcode = (select top 1 ART1_ID from beas_stl 
where itemcode = @itemcode and ART1_ID like '25%')