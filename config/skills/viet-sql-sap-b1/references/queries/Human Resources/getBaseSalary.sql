select cast(ISNULL(Result,0) as decimal(19,6))
from EO_TemplateFomula_Salary_Person 
where pers_id = @PersID
and TemplateID = @TemplateID
and ColumnName = 'BaseSalary'
and MonthID = @MonthID
and YearID = @YearID