select cast(ISNULL(Result,0) as decimal(16,9))
from EO_TemplateFomula_Salary_Person 
where pers_id = @PersID
and TemplateID = @TemplateID
and ColumnName = 'Salary Unit'
and MonthID = @MonthID
and YearID = @YearID