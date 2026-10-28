    SELECT 
        T0.[empID], 
        T0.[lastName], 
        T0.[firstName], 
        T0.[middleName], 
		    CASE
        WHEN 
            (UNICODE(LEFT(ISNULL(T0.[lastName],''),1)) >= 19968) 
            OR (UNICODE(LEFT(ISNULL(T0.[firstName],''),1)) >= 19968) 
            OR (UNICODE(LEFT(ISNULL(T0.[middleName],''),1)) >= 19968)
        THEN -- 中文
            T0.[firstName] + ISNULL(T0.[middleName], '') + T0.[lastName]
        ELSE -- 英文
            T0.[firstName]
            + CASE WHEN ISNULL(T0.[middleName],'') <> '' THEN ' ' + T0.[middleName] ELSE '' END
            + ' ' + T0.[lastName]
    END AS [FullName],
        T0.[sex], 
        T0.[jobTitle], 
        T0.[type], 
        T0.[dept], 
        T0.[branch], 
        T0.[workStreet], 
        T0.[workBlock], 
        T0.[workZip], 
        T0.[workCity], 
        T0.[workCounty], 
        T0.[workCountr], 
        T0.[workState], 
        T0.[manager], 
        T0.[userId], 
        T0.[salesPrson], 
        T0.[officeTel], 
        T0.[officeExt], 
        T0.[mobile], 
        T0.[pager], 
        T0.[homeTel], 
        T0.[fax], 
        T0.[email], 
        T0.[startDate], 
        T0.[status], 
        T0.[salary], 
        T0.[salaryUnit], 
        T0.[emplCost], 
        T0.[empCostUnt], 
        T0.[termDate], 
        T0.[termReason], 
        T0.[bankCode], 
        T0.[bankBranch], 
        T0.[bankBranNo], 
        T0.[bankAcount], 
        T0.[homeStreet], 
        T0.[homeBlock], 
        T0.[homeZip], 
        T0.[homeCity], 
        T0.[homeCounty], 
        T0.[homeCountr], 
        T0.[homeState], 
        T0.[birthDate], 
        T0.[brthCountr], 
        T0.[martStatus], 
        T0.[nChildren], 
        T0.[govID], 
        T0.[citizenshp], 
        T0.[passportNo], 
        T0.[passportEx], 
        T0.[picture], 
        T0.[remark], 
        T0.[attachment], 
        T0.[salaryCurr], 
        T0.[empCostCur], 
        T0.[WorkBuild], 
        T0.[HomeBuild], 
        T0.[position], 
        T0.[AtcEntry], 
        T0.[AddrTypeW], 
        T0.[AddrTypeH], 
        T0.[StreetNoW], 
        T0.[StreetNoH], 
        T0.[DispMidNam], 
        T0.[NamePos], 
        T0.[DispComma], 
        T0.[CostCenter], 
        T0.[CompanyNum], 
        T0.[VacPreYear], 
        T0.[VacCurYear], 
        T0.[MunKey], 
        T0.[TaxClass], 
        T0.[InTaxLiabi], 
        T0.[EmTaxCCode], 
        T0.[RelPartner], 
        T0.[ExemptAmnt], 
        T0.[ExemptUnit], 
        T0.[AddiAmnt], 
        T0.[AddiUnit], 
        T0.[TaxOName], 
        T0.[TaxONum], 
        T0.[HeaInsName], 
        T0.[HeaInsCode], 
        T0.[HeaInsType], 
        T0.[SInsurNum], 
        T0.[StatusOfP], 
        T0.[StatusOfE], 
        T0.[BCodeDateV], 
        T0.[DevBAOwner], 
        T0.[FNameSP], 
        T0.[SurnameSP], 
        T0.[LogInstanc], 
        T0.[UserSign], 
        T0.[UserSign2], 
        T0.[UpdateDate], 
        T0.[PersGroup], 
        T0.[JTCode], 
        T0.[ExtEmpNo], 
        T0.[BirthPlace], 
        T0.[PymMeth], 
        T0.[ExemptCurr], 
        T0.[AddiCurr], 
        T0.[STDCode], 
        T0.[FatherName], 
        T0.[CPF], 
        T0.[CRC], 
        T0.[ContResp], 
        T0.[RepLegal], 
        T0.[DirfDeclar], 
        T0.[UF_CRC], 
        T0.[IDType], 
        T0.[Active], 
        T0.[BPLId], 
        T0.[ManualNUM], 
        T0.[PassIssue], 
        T0.[PassIssuer], 
        T0.[QualCode], 
        T0.[PRWebAccss], 
        T0.[PrePRWeb], 
        T0.[BPLink], 
        T0.[NaturalPer], 
        T0.[DPPStatus], 
        T0.[EnRligion], 
        T0.[EnRligionP], 
        T0.[EncryptIV], 
        T0.[EnGovID], 
        T0.[EnPassport], 
        T0.[CreateDate], 
        T0.[CreateTS], 
        T0.[UpdateTS], 
        T0.[EnInsurNum], 
        T0.[EnBnkAcct], 
        T0.[Code]
    FROM 
        [dbo].[OHEM] T0
 WHERE
    (@empID = 0 OR T0.[empID] = @empID)
    AND (
        @FullName IS NULL
        OR @FullName = ''
        OR (
            -- 生成 FullName 并与 @FullName 比对
            CASE
                WHEN 
                    (UNICODE(LEFT(ISNULL(T0.[lastName],''),1)) >= 19968) 
                    OR (UNICODE(LEFT(ISNULL(T0.[firstName],''),1)) >= 19968) 
                    OR (UNICODE(LEFT(ISNULL(T0.[middleName],''),1)) >= 19968)
                THEN -- 中文
                    T0.[firstName] + ISNULL(T0.[middleName], '') + T0.[lastName]
                ELSE -- 英文
                    T0.[firstName]
                    + CASE WHEN ISNULL(T0.[middleName],'') <> '' THEN ' ' + T0.[middleName] ELSE '' END
                    + ' ' + T0.[lastName]
            END LIKE '%' + @FullName + '%'
        )
    )

