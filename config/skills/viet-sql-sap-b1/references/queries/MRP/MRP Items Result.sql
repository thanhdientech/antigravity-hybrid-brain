select 
itemcode,
onhand as Stock,
FERTIGUNG_ZUGANG as 'Stock In',
AUFTRAEGE as 'Stock Out',
Saldo as 'Balance',KW1,KW2,KW3,KW4,KW5,KW6,KW7,KW8
from BEAS_MRP
where NR = @MRP