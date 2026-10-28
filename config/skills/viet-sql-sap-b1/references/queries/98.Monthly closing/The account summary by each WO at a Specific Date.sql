SELECT T0.U_belnrid as 'Work Order No.', T0.U_belposid as 'WO Postion',T0.Account,T0.TotalSum,T1.AUFTRAG,T2.ItemCode,T2.ItemName,T2.Menge_VERBRAUCH AS 'PlanQty',ISNULL(T3.Quantity,0) AS Quantity
FROM
(
	SELECT T0.U_belnrid,T0.U_belposid,T0.Account,SUM(T0.Debit - T0.Credit) AS TotalSum  
	FROM 
	(
		SELECT T0.U_belnrid,T0.U_belposid,T0.TransId,T1.Account,T1.Debit,T1.Credit
		FROM OJDT T0 INNER JOIN JDT1 T1 ON T0.TransId = T1.TransId
		WHERE T0.TransType <> '59' AND T0.TransType <> '60'
		AND T0.RefDate >= '2020-01-01' 
		AND T0.RefDate <= @EndDate
		UNION ALL
		SELECT T0.U_belnrid,T0.U_belposid,T1.TransId,T2.Account,T2.Debit,T2.Credit FROM
		(
			SELECT T0.ObjType,T0.DocEntry,T0.DocDate,T1.U_belnrid,T1.U_belposid 
			FROM OIGN T0 INNER JOIN IGN1 T1 ON T0.DocEntry = T1.DocEntry 
			WHERE ISNULL(T1.U_belnrid,0) <> 0
			GROUP BY T0.ObjType,T0.DocEntry,T0.DocDate,T1.U_belnrid,T1.U_belposid 
		)T0 INNER JOIN OJDT T1 ON T0.ObjType = T1.TransType AND T0.DocEntry = T1.CreatedBy 
        INNER JOIN JDT1 T2 ON T1.TransId = T2.TransId
		WHERE 
		T0.DocDate >= '2020-01-01' 
		AND T0.DocDate <= @EndDate
		UNION ALL
		SELECT T0.U_belnrid,T0.U_belposid,T1.TransId,T2.Account,T2.Debit,T2.Credit FROM
		(
			SELECT T0.ObjType,T0.DocEntry,T0.DocDate,T1.U_belnrid,T1.U_belposid 
			FROM OIGE T0 INNER JOIN IGE1 T1 ON T0.DocEntry = T1.DocEntry 
			WHERE ISNULL(T1.U_belnrid,0) <> 0
			GROUP BY T0.ObjType,T0.DocEntry,T0.DocDate,T1.U_belnrid,T1.U_belposid 
		)T0 INNER JOIN OJDT T1 ON T0.ObjType = T1.TransType AND T0.DocEntry = T1.CreatedBy 
        INNER JOIN JDT1 T2 ON T1.TransId = T2.TransId
		WHERE T0.DocDate >= '2020-01-01' 
		AND T0.DocDate <= @EndDate
	)T0	
	GROUP BY T0.U_belnrid,T0.U_belposid,T0.Account
)T0 
LEFT OUTER JOIN BEAS_FTHAUPT T1 ON T0.U_belnrid = T1.BELNR_ID
LEFT OUTER JOIN BEAS_FTPOS T2 ON T0.U_belnrid = T2.BELNR_ID AND T0.U_belposid = T2.BELPOS_ID
LEFT OUTER JOIN V_WOOIGN T3 ON T0.U_belnrid = T3.BELNR_ID AND T0.U_belposid = T3.BELPOS_ID
WHERE ISNULL(T0.U_belnrid,0) <> 0
ORDER BY T0.U_belnrid,T0.U_belposid