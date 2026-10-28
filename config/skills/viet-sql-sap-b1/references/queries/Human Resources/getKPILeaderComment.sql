select remark_31 + '/' +   remark_32 + '/' + remark_33 + '/' + remark_34
from [dbo].[AppCreator_22c9a9bb]
where employeeID = @PersID 
and cbo_month = @MOnthID 
and cbo_year = @YearID