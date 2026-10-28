SELECT 
  t1.empID,
  t1.PERS_ID,
  t1.DisplayName,
  t1.kstst_ID,
  T1.PERSGRP_ID,
  t1.AKTIV,
  t2.BUCHNR_ID,
  CONVERT(date, t2.bewertungdat) AS [Date],
  t2.VONDAT  AS [Arriving Time],
  t2.BISDAT  AS [Leaving Time],
  CONVERT(char(5), CAST(t2.DAUER AS time), 108)       AS [Actual Duration],
  T2.VONRECHDAT  AS [Official Arriving Time],
  T2.BISRECHDAT  AS [OfFicial Leaving Time],
  CONVERT(char(5), CAST(t2.RECHDAUER AS time), 108)   AS [Official Duration],
  T2.DAUER_MIN       AS [Actual Duration (Min)],
  T2.RECHDAUER_MIN   AS [Official Duration (Min)],
  T2.MANUELL         AS [Manual Entry],
  T2.SCHICHT_ID      AS [On Duty Shift],
  T2.RECH_SCHICHT_ID AS [Default Sfift],
  T2.STDRGL_ID       AS [On Duty Period Rule],
  T2.RECH_STDRGL_ID  AS [Default Period Rule],
  T2.INFO            AS [Remark],
  T2.WAGETYPE        AS [On Duty Wage Type],
  T2.RECHWAGETYPE    AS [Default Wage Type],
  T1.KSTST_ID        AS [Default Dept.],
  T2.KSTST_ID        AS [On Duty Dept.]
FROM BEAS_PERS t1
LEFT JOIN BEAS_ANWZEIT t2 ON t1.PERS_ID = t2.PERS_ID
WHERE
  -- 1) PERS_ID：空/NULL = 全部
  (COALESCE(@PERS_ID, '') = '' OR t1.PERS_ID = @PERS_ID)
  -- 2) empID：空/NULL = 全部
  AND (COALESCE(@empID, '') = '' OR t1.empID = @empID)
  -- 3) DisplayName：模糊；传 '%' = 全部
  AND (COALESCE(@DisplayName, '') = '' OR t1.DisplayName LIKE @DisplayName)
  -- 4) KSTST_ID：空/NULL = 全部
  AND (COALESCE(@KSTST_ID, '') = '' OR t1.KSTST_ID = @KSTST_ID)
  -- 5) PERSGRP_ID：空/NULL = 全部
  AND (COALESCE(@PERSGRP_ID, '') = '' OR t1.PERSGRP_ID = @PERSGRP_ID)
  -- 日期区间：建议用 SARGable 写法以利用索引
  AND CONVERT(date, t2.bewertungdat) Between @FromDate and @ToDate