SELECT 
    T0.[empID],
    T0.[line],
    T0.[fromDate],
    T0.[toDate],
    T0.[reason],
    T0.[approvedBy],
    T0.[cnfrmrNum],
    T0.[LogInstanc],
    T0.[type],
    T0.[EncryptIV],
    T1.[firstName],
    T1.[lastName],
    T1.[middleName],
    T1.[Active],
    T1.[branch],
    T1.[BPLId]
FROM 
    [dbo].[HEM1] T0
INNER JOIN 
    [dbo].[OHEM] T1 
    ON T1.[empID] = T0.[empID]
WHERE 
    (@IsActive IS NULL OR T1.[Active] = @IsActive)
    AND (@LastNameFrom IS NULL OR T1.[lastName] >= @LastNameFrom)
    AND (@LastNameTo IS NULL OR T1.[lastName] <= @LastNameTo)
    AND (@FromDate IS NULL OR T0.[fromDate] <= @FromDate)
    AND (@ToDate IS NULL OR T0.[toDate] >= @ToDate)
ORDER BY 
    T0.[empID], 
    T0.[fromDate]
