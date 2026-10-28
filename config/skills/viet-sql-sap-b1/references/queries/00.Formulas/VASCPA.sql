    SELECT ISNULL(SUM(T0.Debit)-SUM(T0.Credit), 0) 
    FROM JDT1 T0
    WHERE T0.Account in (select T1.AcctCode from OFRC t0 inner join FRC1 t1 on t0.CatId = t1.catid and t0.TemplateId = t1.TemplateId
where t0.FrgnName like '%'+@ACCCAT+'%' AND T0.TemplateId = '1')
        AND T0.refdate >= @StartDate and T0.refdate <= @EndDate
        AND TransType <> -3

