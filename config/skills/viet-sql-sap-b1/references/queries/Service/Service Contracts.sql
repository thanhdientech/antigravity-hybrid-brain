SELECT 
    T0.[ContractID], T0.[CstmrCode], T0.[CstmrName], T0.[CntctCode], T0.[Owner], T0.[Status], T0.[CntrcTmplt], 
    T0.[CntrcType], T0.[Renewal], T0.[RemindVal], T0.[RemindUnit], T0.[Duration], T0.[StartDate], T0.[EndDate], 
    T0.[ResponsVal], T0.[ResponsUnt], T0.[Descriptio], T0.[SrcDocType], T0.[DocNum], T0.[MonEnabled], 
    T0.[TueEnabled], T0.[WedEnabled], T0.[ThuEnabled], T0.[FriEnabled], T0.[SatEnabled], T0.[SunEnabled], 
    T0.[MonStart], T0.[MonEnd], T0.[TueStart], T0.[TueEnd], T0.[WedStart], T0.[WedEnd], T0.[ThuStart], 
    T0.[ThuEnd], T0.[FriStart], T0.[FriEnd], T0.[SatStart], T0.[SatEnd], T0.[SunStrart], T0.[SunEnd], 
    T0.[InclParts], T0.[InclWork], T0.[InclTravel], T0.[Attachment], T0.[CreateDate], T0.[Remarks1], 
    T0.[Remarks2], T0.[RemindFlg], T0.[CTR1Count], T0.[DocEntry], T0.[RemTmDays], T0.[ResTmHours], 
    T0.[InclHldays], T0.[SrvcType], T0.[TermDate], T0.[ResponseV], T0.[ResponseU], T0.[AtcEntry], 
    T0.[Transfered], T0.[Instance], T0.[BPType], T0.[OwnerCode], T0.[UserSign], T0.[ObjType], 
    T0.[LogInstanc], T0.[UserSign2], T0.[UpdateDate], T0.[DPPStatus], T0.[EncryptIV], T0.[Printed], 
    T0.[U_beas_prjcode]
FROM 
    [dbo].[OCTR] T0
    LEFT OUTER JOIN [dbo].[OCRD] T1 ON T1.[CardCode] = T0.[CstmrCode]
WHERE 
    (@StartDate IS NULL OR T0.[StartDate] >= @StartDate)
    AND (@EndDate IS NULL OR T0.[StartDate] <= @EndDate)
ORDER BY 
    T0.[ContractID]