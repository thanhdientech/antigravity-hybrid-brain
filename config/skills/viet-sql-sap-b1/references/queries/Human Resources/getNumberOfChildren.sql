select ISNULL(Result,0)
from EO_TemplateFomula_Salary_Person 
where pers_id = @PersID
and TemplateID = @TemplateID
and ColumnName = 'NumberOfChildren'
and MonthID = @MonthID
and YearID = @YearID