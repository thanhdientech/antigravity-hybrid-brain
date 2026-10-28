SELECT 
    T0.[callID], T0.[subject], T0.[customer], T0.[custmrName], T0.[contctCode], T0.[manufSN], T0.[internalSN], 
    T0.[contractID], T0.[cntrctDate], T0.[resolDate], T0.[resolTime], T0.[free_1], T0.[free_2], T0.[origin], 
    T0.[itemCode], T0.[itemName], T0.[itemGroup], T0.[status], T0.[priority], T0.[callType], T0.[problemTyp], 
    T0.[assignee], T0.[descrption], T0.[objType], T0.[logInstanc], T0.[userSign], T0.[createDate], T0.[createTime], 
    T0.[closeDate], T0.[closeTime], T0.[userSign2], T0.[updateDate], T0.[SCL1Count], T0.[SCL2Count], T0.[isEntitled], 
    T0.[insID], T0.[technician], T0.[resolution], T0.[Scl1NxtLn], T0.[Scl2NxtLn], T0.[Scl3NxtLn], T0.[Scl4NxtLn], 
    T0.[Scl5NxtLn], T0.[isQueue], T0.[Queue], T0.[resolOnDat], T0.[resolOnTim], T0.[respByDate], T0.[respByTime], 
    T0.[respOnDate], T0.[respOnTime], T0.[respAssign], T0.[AssignDate], T0.[AssignTime], T0.[UpdateTime], 
    T0.[responder], T0.[Transfered], T0.[Instance], T0.[DocNum], T0.[Series], T0.[Handwrtten], T0.[PIndicator], 
    T0.[StartDate], T0.[StartTime], T0.[EndDate], T0.[EndTime], T0.[Duration], T0.[DurType], T0.[Reminder], 
    T0.[RemQty], T0.[RemType], T0.[RemDate], T0.[RemSent], T0.[RemTime], T0.[Location], T0.[AddrName], 
    T0.[AddrType], T0.[Street], T0.[City], T0.[Room], T0.[State], T0.[Country], T0.[DisplInCal], T0.[SupplCode], 
    T0.[Attachment], T0.[AtcEntry], T0.[NumAtCard], T0.[ProSubType], T0.[BPType], T0.[Telephone], T0.[BPPhone1], 
    T0.[BPPhone2], T0.[BPCellular], T0.[BPFax], T0.[BPShipCode], T0.[BPShipAddr], T0.[BPBillCode], 
    T0.[BPBillAddr], T0.[BPTerrit], T0.[BPE_Mail], T0.[BPProjCode], T0.[BPContact], T0.[OwnerCode], 
    T0.[DPPStatus], T0.[EncryptIV], T0.[Printed]
FROM 
    [dbo].[OSCL] T0
WHERE 
    (@StartDate IS NULL OR T0.[createDate] >= @StartDate)
    AND (@EndDate IS NULL OR T0.[createDate] <= @EndDate)
    AND T0.[respOnDate] IS NOT NULL
ORDER BY 
    T0.[callID] DESC;
