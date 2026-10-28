SELECT
    t2.IdEntry,
    t1.WizardName,
    'ILEV' as 'Authorization Type',
    ROW_NUMBER() OVER (PARTITION BY t1.WizardName ORDER BY t2.Line_ID) AS [Transaction ID],
    COUNT(*) OVER (PARTITION BY t2.IdEntry, t1.WizardName) AS [Total Transaction],
    t2.PayAmount AS [Total Amount],
    'ABC19004001' as 'HSBC Connect ID',
	'FREUDENBERG VILENE INTERLININGS (NANTONG) CO., LTD.' as 'Payer Name',
	'174000505011' as 'Payer Account',
	CONCAT(t1.WizardName, '-', t2.Line_ID + 1) AS [Instruction ID],
	t1.WizardName as 'End instruction ID',
	t4.BankName as 'Beneficiary Bank Name',
	t5.AcctName as 'Beneficiary Name',
	t3.DflAccount as 'Beneficiary Account Number',
	t2.NumAtCard as 'Remark'

FROM opwz t1
INNER JOIN PWZ3 t2 ON t1.IdNumber = t2.IdEntry
LEFT JOIN OCRD t3 ON t2.CardCode = t3.CardCode
LEFT JOIN ODSC t4 ON t3.BankCode = t4.BankCode
LEFT JOIN OCRB t5 on t3.DflAccount = t5.Account
WHERE t1.IdNumber = @PaymentID --Entry by user'
  AND t2.Checked = 'Y'
  AND t1.OutgoType = 'Y'
ORDER BY t2.IdEntry, t2.Line_ID
