SELECT 
  COALESCE(CAST(SUM(RECHDAUER_MIN) / 60.0 AS decimal(10,2)), 0.00) AS TotalHours
FROM BEAS_ANWZEIT
WHERE PERS_ID = @Pers
  AND bewertungdat = @Date
--And bewertungdat >= 'From date' and < 'to date' 
--if apply a range of date , can use this. 