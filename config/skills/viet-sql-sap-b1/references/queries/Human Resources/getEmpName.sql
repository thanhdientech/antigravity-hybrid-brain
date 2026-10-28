select t0.Fullname
from Users t0
inner join OHEM t1 on t0.SapEmpId = t1.empID
inner join BEAS_PERS t2 on t1.empID = t2.empID
where t2.PERS_ID = @PersID