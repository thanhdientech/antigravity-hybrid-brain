SELECT 
    t1.ClgCode,
    t1.CardCode,
    t2.CardName,
    t1.CntctDate,
    t1.Recontact,
    t1.endDate,
    t1.AttendUser,
    t3.U_NAME,
    t1.BeginTime,
    t1.ENDTime,
    t1.Duration,
    t1.DurType,
    t1.Details,
		t1.IsRemoved,
		t1.inactive
FROM OCLG t1 
LEFT JOIN OCRD t2 ON t1.CardCode = t2.CardCode
LEFT JOIN OUSR t3 ON t1.AttendUser = t3.USERID
WHERE (@UserName IS NULL OR @UserName = '' OR t3.U_NAME LIKE '%' + @UserName + '%')