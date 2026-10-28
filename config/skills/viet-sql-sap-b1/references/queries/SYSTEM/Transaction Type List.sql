SELECT 
    'OINV' AS TableName, 'A/R Invoice' AS Description, 'DocEntry' AS PrimaryKey, '13' AS ObjectType
UNION ALL SELECT 'ORIN', 'A/R Credit Memo', 'DocEntry', '14'
UNION ALL SELECT 'ODLN', 'Delivery', 'DocEntry', '15'
UNION ALL SELECT 'ORDN', 'Returns', 'DocEntry', '16'
UNION ALL SELECT 'ORDR', 'Sales Order', 'DocEntry', '17'
UNION ALL SELECT 'OPCH', 'A/P Invoice', 'DocEntry', '18'
UNION ALL SELECT 'ORPC', 'A/P Credit Memo', 'DocEntry', '19'
UNION ALL SELECT 'OPDN', 'Goods Receipt PO', 'DocEntry', '20'
UNION ALL SELECT 'ORPD', 'Goods Return', 'DocEntry', '21'
UNION ALL SELECT 'OPOR', 'Purchase Order', 'DocEntry', '22'
UNION ALL SELECT 'OQUT', 'Sales Quotation', 'DocEntry', '23'
UNION ALL SELECT 'ORCT', 'Incoming Payment', 'DocEntry', '24'
UNION ALL SELECT 'OVPM', 'Outgoing Payments', 'DocEntry', '46'
UNION ALL SELECT 'OIGN', 'Goods Receipt', 'DocEntry', '59'
UNION ALL SELECT 'OIGE', 'Goods Issue', 'DocEntry', '60'
UNION ALL SELECT 'OWTR', 'Inventory Transfer', 'DocEntry', '67'
UNION ALL SELECT 'OIPF', 'Landed Costs', 'DocEntry', '69'
UNION ALL SELECT 'OENT', 'Shipping Types', 'DocEntry', '88'
UNION ALL SELECT 'OSAL', 'Outgoing', 'DocEntry', '89'
UNION ALL SELECT 'OTRA', 'Transition', 'DocEntry', '90'
UNION ALL SELECT 'ODRF', 'Drafts', 'DocEntry', '112'
UNION ALL SELECT 'OCIN', 'A/R Correction Invoice', 'DocEntry', '132'
UNION ALL SELECT 'OPDF', 'Payment Draft', 'DocEntry', '140'
UNION ALL SELECT 'OMRV', 'Inventory Revaluation', 'DocEntry', '162'
UNION ALL SELECT 'OCPI', 'A/P Correction Invoice', 'DocEntry', '163'
UNION ALL SELECT 'OCPV', 'A/P Correction Invoice Reversal', 'DocEntry', '164'
UNION ALL SELECT 'OCSI', 'A/R Correction Invoice', 'DocEntry', '165'
UNION ALL SELECT 'OCSV', 'A/R Correction Invoice Reversal', 'DocEntry', '166'
UNION ALL SELECT 'OWOR', 'Production Order', 'DocEntry', '202'
UNION ALL SELECT 'ODPI', 'A/R Down Payment', 'DocEntry', '203'
UNION ALL SELECT 'ODPO', 'A/P Down Payment', 'DocEntry', '204'
UNION ALL SELECT 'ORCM', 'Recommendation Data', 'DocEntry', '213'
UNION ALL SELECT 'OTSI', 'Sales Tax Invoice', 'DocEntry', '280'
UNION ALL SELECT 'OTPI', 'Purchase Tax Invoice', 'DocEntry', '281'
UNION ALL SELECT 'ODRF', 'Stock Transfer Draft', 'DocEntry', '1179'
UNION ALL SELECT 'OIQR', 'Inventory Posting', 'DocEntry', '10000071'
UNION ALL SELECT 'OIQI', 'Inventory Opening Balance', 'DocEntry', '310000001'
UNION ALL SELECT 'OTCX', 'Tax Code Determination', 'DocEntry', '540000005'
UNION ALL SELECT 'OPQT', 'Purchase Quotation', 'DocEntry', '540000006'
UNION ALL SELECT 'OWTQ', 'Inventory Transfer Request', 'DocEntry', '1250000001'
UNION ALL SELECT 'OACQ', 'Capitalization', 'DocEntry', '1470000049'
UNION ALL SELECT 'OACD', 'Credit Memo', 'DocEntry', '1470000060'
UNION ALL SELECT 'OINC', 'Inventory Counting', 'DocEntry', '1470000065'
UNION ALL SELECT 'OPRQ', 'Purchase Request', 'DocEntry', '1470000113'
UNION ALL SELECT 'OJDT', 'Journal Entry', 'DocEntry', '30'
UNION ALL SELECT 'OPEN', 'OPENING BALANCE', 'DocEntry', '-2'
order by objecttype

