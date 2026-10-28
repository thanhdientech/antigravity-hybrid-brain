declare @#StartDate datetime, @#EndDate datetime;
set @#StartDate = DATEFROMPARTS(@YearID,@MonthID,1);
set @#EndDate = DATEADD(day,-1,dateadd(month,1,DATEFROMPARTS(@YearID,@MonthID,1)));
select
	--t2.PERS_ID,
	--concat(isnull(t2.NAME1, ''), ' ', isnull(t2.NAME2, '')) as [DisplayName],
	--t3.DATEID,
	case 
		when t4.IsDayOff = 1 then 'H'--0 --[IsDayOff]
		when convert(time, t6.VONRECHDAT) <= convert(time, t4.ANF_BIS)
			and convert(time, t6.BISRECHDAT) >= convert(time, t4.ENDE_VON) then 'D'-- 1 --[IsArriveOnTime]
		when (t5.PERS_ID is not null or t6.PERS_ID is null) and t4.IsDayOff <> 1 then 'A'--2 --[IsAbsence]
		when t5.PERS_ID is not null and t4.IsDayOff <> 1 then 'Ab'-- 3 -- [IsApproveAbsence]
		when convert(time, t6.VONRECHDAT) > convert(time, t4.ANF_BIS) and t4.IsDayOff <> 1 then 'L'--4 -- [IsLate]
		when convert(time, t6.BISRECHDAT) < convert(time, t4.ENDE_VON) and t4.IsDayOff <> 1 then 'E'--5 -- [IsLeaveEarly]
		when t7.DATEID is not null and datediff(minute, t7.FromTime, t7.ToTime) > 0 then 'OT'--6 --[IsOvertime]
		else ''--0
	end as [Status]
from Users t0
inner join OHEM t1 on t0.SapEmpId = t1.empID
inner join BEAS_PERS t2 on t1.empID = t2.empID
left join BEAS_PERS_TIMES t3 on t2.PERS_ID = t3.PERS_ID and convert(date, t3.DATEID) between @#StartDate and @#EndDate
inner join (
	select ts0.SCHICHT_ID, ts1.ANF_VON, ts1.ANF_BIS, ts1.ENDE_VON, ts1.ENDE_BIS,
		ts0.BDE_START, ts0.BDE_ENDE, ts0.MITTAG_VON, ts0.MITTAG_BIS, ts0.BDE_TYP,
		case when ts0.BDE_TYP = 1 then 1 else 0 end as [IsDayOff],
		case when cast(ts0.MITTAG_BIS as time) >= cast(ts0.MITTAG_VON as time)
		then datediff(minute, cast(ts0.MITTAG_VON as time), cast(ts0.MITTAG_BIS as time)) / 60.0
		else (datediff(minute, cast(ts0.MITTAG_VON as time), cast(ts0.MITTAG_BIS as time)) + 24 * 60) / 60.0
		end as [MITTAG_DAUER]
	from BEAS_RGLARBZEIT_HEADER ts0
	join BEAS_RGLARBZEIT ts1 on ts0.SCHICHT_ID = ts1.SCHICHT_ID and ts1.TAGMUSTER_ID = 'Modo'
) t4 on t4.SCHICHT_ID = t3.SCHICHT_ID
left join BEAS_ABWZEIT t5 on t5.PERS_ID = t2.PERS_ID 
	and convert(date, t3.DATEID) between convert(date, t5.VON) and convert(date, t5.BIS)
left join BEAS_ANWZEIT t6 on t6.PERS_ID = t2.PERS_ID
	and convert(date, t3.DATEID) = convert(date, t6.BEWERTUNGDAT)
left join EO_Overtime_Header t7 on t7.PERS_ID = t2.PERS_ID
	and convert(date, t3.DATEID) = convert(date, t7.DATEID)
where t2.PERS_ID = @PersID and day(t3.DATEID) = @DateID