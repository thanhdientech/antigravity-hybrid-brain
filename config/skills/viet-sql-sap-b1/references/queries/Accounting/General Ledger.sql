SELECT 
    T0.[TransId],
    T0.[Line_ID],
    T0.[Account],
    T0.[Debit],
    T0.[Credit],
    T0.[SYSCred],
    T0.[SYSDeb],
    T0.[FCDebit],
    T0.[FCCredit],
    T0.[FCCurrency],
    T0.[DueDate],
    T0.[SourceID],
    T0.[SourceLine],
    T0.[ShortName],
    T0.[IntrnMatch],
    T0.[ExtrMatch],
    T0.[ContraAct],
    T0.[LineMemo],
    T0.[Ref3Line],
    T0.[TransType],
    T0.[RefDate],
    T0.[Ref2Date],
    T0.[Ref1],
    T0.[Ref2],
    T0.[CreatedBy],
    T0.[BaseRef],
    T0.[Project],
    T0.[TransCode],
    T0.[ProfitCode],
    T0.[TaxDate],
    T0.[SystemRate],
    T0.[MthDate],
    T0.[ToMthSum],
    T0.[UserSign],
    T0.[BatchNum],
    T0.[FinncPriod],
    T0.[RelTransId],
    T0.[RelLineID],
    T0.[RelType],
    T0.[LogInstanc],
    T0.[VatGroup],
    T0.[BaseSum],
    T0.[VatRate],
    T0.[Indicator],
    T0.[AdjTran],
    T0.[RevSource],
    T0.[ObjType],
    T0.[VatDate],
    T0.[PaymentRef],
    T0.[SYSBaseSum],
    T0.[MultMatch],
    T0.[VatLine],
    T0.[VatAmount],
    T0.[SYSVatSum],
    T0.[Closed],
    T0.[GrossValue],
    T0.[CheckAbs],
    T0.[LineType],
    T0.[DebCred],
    T0.[SequenceNr],
    T0.[StornoAcc],
    T0.[BalDueDeb],
    T0.[BalDueCred],
    T0.[BalFcDeb],
    T0.[BalFcCred],
    T0.[BalScDeb],
    T0.[BalScCred],
    T0.[IsNet],
    T0.[DunWizBlck],
    T0.[DunnLevel],
    T0.[DunDate],
    T0.[TaxType],
    T0.[TaxPostAcc],
    T0.[StaCode],
    T0.[StaType],
    T0.[TaxCode],
    T0.[ValidFrom],
    T0.[GrossValFc],
    T0.[LvlUpdDate],
    T0.[OcrCode2],
    T0.[OcrCode3],
    T0.[OcrCode4],
    T0.[OcrCode5],
    T0.[MIEntry],
    T0.[MIVEntry],
    T0.[ClsInTP],
    T0.[CenVatCom],
    T0.[MatType],
    T0.[PstngType],
    T0.[ValidFrom2],
    T0.[ValidFrom3],
    T0.[ValidFrom4],
    T0.[ValidFrom5],
    T0.[Location],
    T0.[WTaxCode],
    T0.[EquVatRate],
    T0.[EquVatSum],
    T0.[SYSEquSum],
    T0.[TotalVat],
    T0.[SYSTVat],
    T0.[WTLiable],
    T0.[WTLine],
    T0.[WTApplied],
    T0.[WTAppliedS],
    T0.[WTAppliedF],
    T0.[WTSum],
    T0.[WTSumFC],
    T0.[WTSumSC],
    T0.[PayBlock],
    T0.[PayBlckRef],
    T0.[LicTradNum],
    T0.[InterimTyp],
    T0.[DprId],
    T0.[MatchRef],
    T0.[Ordered],
    T0.[CUP],
    T0.[CIG],
    T0.[BPLId],
    T0.[BPLName],
    T0.[VatRegNum],
    T0.[SLEDGERF],
    T0.[InitRef2],
    T0.[InitRef3Ln],
    T0.[ExpUUID],
    T0.[ExpOPType],
    T0.[ExTransId],
    T0.[DocArr],
    T0.[DocLine],
    T0.[MYFtype],
    T0.[DocEntry],
    T0.[DocNum],
    T0.[DocType],
    T0.[DocSubType],
    T0.[RmrkTmpt],
    T0.[CemCode],
    T1.[FolioPref],
    T1.[FolioNum],
    T1.[DocSeries],
    T3.[AcctName],
    T4.[CardName],
    T2.[PrjName],
    T1.[AgrNo],
    T1.[PTICode],
    T1.[Letter],
    T1.[FolNumFrom],
    T1.[FolNumTo],
    T1.[Ref1],
    T1.[Ref2],
    T1.[Ref3],
    T1.[U_beas_pers_id],
    T1.[U_monat],
    T1.[U_BPCODE],
    T1.[U_RemarksVN],
    T1.[U_VNo],
    T1.[U_belnrid],
    T1.[U_belposid],
    T0.[U_beas_receipttyp],
    T0.[U_beas_reference],
    T0.[U_beas_timereceipt],
    T0.[U_BPCODE]
FROM 
    [dbo].[JDT1] T0
    INNER JOIN [dbo].[OJDT] T1 ON T1.[TransId] = T0.[TransId]
    LEFT OUTER JOIN [dbo].[OPRJ] T2 ON T2.[PrjCode] = T0.[Project]
    LEFT OUTER JOIN [dbo].[OACT] T3 ON T3.[AcctCode] = T0.[ContraAct]
    LEFT OUTER JOIN [dbo].[OCRD] T4 ON T4.[CardCode] = T0.[ContraAct]
WHERE 
     T0.[Account]>= (@SAcc)
		AND T0.[Account]<= (@EAcc)
    AND T0.[RefDate] >= (@SDate)
    AND T0.[RefDate] <= (@Edate)
ORDER BY 
    T0.[RefDate],
    T0.[TransId],
    T0.[Line_ID]
