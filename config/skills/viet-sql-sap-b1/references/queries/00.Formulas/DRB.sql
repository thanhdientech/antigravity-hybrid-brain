select t2.Debltotal 
from OBGS t0 left join OBGT t1 on t0.AbsId = t1.Instance left join BGT3 t2 on T1.AbsId = T2.BudgId AND t1.instance= t2.Instance 

where t0.Name like '%'+@BudName+'%'
and t2.Line_ID = @Month -1 
and t1.AcctCode = @AcctCode 
and T2.OcrCode = @Ocrcode