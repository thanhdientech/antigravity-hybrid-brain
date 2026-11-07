# DANH MỤC 207 CÂU LỆNH SQL CHUẨN TỪ THƯ MỤC HELP (SAP B1 & BEAS)

Tổng số câu lệnh SQL thực chiến đã trích xuất từ E:\DIEN APP\SQL SAP B1\Help: **207 queries**.


## Nhóm: 01.Finance Queries (16 queries)

- **03. Customer Aging** (Customer Aging): Bảng `ITR1, JDT1, OCRD, OITR, OJDT` | Tham số: `@Today (DateTime)`
- **04. AR Balance ** (AR Balance (aging)): Bảng `INV1, OACT, OCRD, OCTG, OINV, OUSR` | Tham số: `@DueDate (DateTime), @StartDate (DateTime), @EndDate (DateTime)`
- **05. AP Balance** (AP Balance): Bảng `OACT, OCRD, OCTG, OPCH, OUSR, PCH1` | Tham số: `@DueDate (DateTime), @StartDate (DateTime), @EndDate (DateTime)`
- **06. List of IncomingPayment** (List of IncomingPayment): Bảng `JDT1, OJDT, ORCT, RCT2, REF1, REF2` | Tham số: `@StartDate (DateTime), @EndDate (DateTime)`
- **07. List of OutgoingPayment** (List of OutgoingPayment): Bảng `JDT1, OJDT, OVPM, REF1, REF2, VPM2` | Tham số: `@StartDate (DateTime), @EndDate (DateTime)`
- **08. PO  Payment Balance** (PO  Payment Balance): Bảng `OACT, OPOR, OPRC, OUSR, POR1` | Tham số: `@SupplierCode (String), @SupplierName (String), @StartDate (DateTime), @EndDate (DateTime)`
- **09. Cash Use Details** (Cash Use Details): Bảng `JDT1, OJDT` | Tham số: `@StartDate (DateTime), @EndDate (DateTime)`
- **10.AR/AR Credit Memo Detail ** (AR/AR Credit Memo Detail ): Bảng `INV1, OACT, OCRD, OINV, OITM, ORIN, RIN1` | Tham số: `@StartDate (DateTime), @EndDate (DateTime)`
- **12.List of FA Depreciation Account** (List of FA Depreciation Account): Bảng `OADT` | Tham số: `Không có`
- **13.List of FA Status** (List of FA Status): Bảng `FIX1, ITM7, ODPV, OITM` | Tham số: `@YEAR (Int), @FAStartCode (String), @FAEndCode (String)`
- **14.Account Ledgers by doc date** (Account Ledgers by document date): Bảng `JDT1, OACT, OJDT, REF1, REF2` | Tham số: `@AcctCode (String), @StartDate (DateTime), @EndDate (DateTime)`
- **15.Account Ledgers by Posting Date** (Account ledgers by Posting Date): Bảng `JDT1, OACT, OJDT, REF1, REF2` | Tham số: `@AcctCode (String), @StartDate (DateTime), @EndDate (DateTime)`
- **Finance Stastics Comparation** (Finance Stastics Comparation): Bảng `OINV, ORIN, RIN1` | Tham số: `@CurrentStart (String), @CurrentEnd (String), @PreviousStart (String), @PreviousEnd (String), @StartOfCurrentMonth (String), @StartOfPreviousMonth (String)`
- **00.Voucher List** (Voucher List): Bảng `JDT1, OACT, OJDT, REF1, REF2` | Tham số: `@StartDate (DateTime), @EndDate (DateTime), @Number (String), @Account (String), @BP (String)`
- **01.Account Code List** (Account code list): Bảng `OACT` | Tham số: `@StartAcc (String), @EndAcc (String)`
- **02. Cost Center List** (Cost Center List): Bảng `OCR1, OOCR, OPRC` | Tham số: `Không có`

## Nhóm: 02.Sales Queries (13 queries)

- **00. List of Customer** (List of Customer): Bảng `OACT, OCRD, OCRG, OPLN` | Tham số: `Không có`
- **00. List of Customer (Biill to & Shipto)** (List of Customer (Biill to & Shipto)): Bảng `CRD1, OACT, OCRD, OCRG, OPLN` | Tham số: `Không có`
- **00. Price list by Customer** (Price list by Customer): Bảng `ITM1, OCRD, OITM` | Tham số: `Không có`
- **01.Sales Order Details** (Sales Order Details): Bảng `OITM, OPEN, ORDR, RDR1` | Tham số: `@Reference (String), @CustomerCode (String), @StartDate (DateTime), @EndDate (DateTime), @OPENorCLOSE (String)`
- **02.Delivery Note Details** (Delivery Notes List): Bảng `DLN1, ODLN, OPEN, ORDR` | Tham số: `@Reference (String), @CustomerCode (String), @StartDate (DateTime), @EndDate (DateTime), @OPENorCLOSE (String)`
- **03.Delivery Returns Details** (Delivery Return List ): Bảng `OPEN, ORDN, RDN1` | Tham số: `@Reference (String), @CardCode (String), @ItemCode (String), @StartDate (DateTime), @EndDate (DateTime), @OPENorCLOSE (String)`
- **04. Deliver & Return by Batch** (Deliver & Return by Batch): Bảng `DLN1, IBT1, ODLN, OPEN, ORDN` | Tham số: `@Reference (String), @CardCode (String), @ItemCode (String), @StartDate (DateTime), @EndDate (DateTime), @OPENorCLOSE (String)`
- **05.AR Down Payment Details** (AR Down Payment List): Bảng `DPI1, ODPI, OPEN` | Tham số: `@CardCode (String), @StartDate (DateTime), @EndDate (DateTime), @OPENorCLOSE (String)`
- **06.AR Invoices Details** (AP Invoices List): Bảng `INV1, OINV, OPEN` | Tham số: `@CardCode (String), @StartDate (DateTime), @EndDate (DateTime), @OPENorCLOSE (String)`
- **07.AR Credit Memo Details** (AR Credit MEMO List): Bảng `OPEN, ORIN, RIN1` | Tham số: `@CardCode (String), @StartDate (DateTime), @EndDate (DateTime), @OPENorCLOSE (String)`
- **08.AR Reserved Invoice Details** (Query Description): Bảng `INV1, OINV, OPEN` | Tham số: `@CardCode (String), @StartDate (DateTime), @EndDate (DateTime), @OPENorCLOSE (String)`
- **Sales QTY List (This Year)** (Sales QTY List (This Year) by Ship date, (No Price)): Bảng `N/A` | Tham số: `Không có`
- **Top  10  Customer Year to date** (Query Description): Bảng `OCRD, OINV, ORIN, RIN1` | Tham số: `@CurrentStart (DateTime), @CurrentEnd (DateTime), @PreviousStart (DateTime), @PreviousEnd (DateTime)`

## Nhóm: 03.Purchase Queries (11 queries)

- **00.Vendor List** (Vendor List): Bảng `OCRD, OCTG` | Tham số: `Không có`
- **01.Purchase Request List** (Purchase Request List): Bảng `OPEN, OPRC, OPRQ, OUSR, PRQ1` | Tham số: `@StartDate (DateTime), @EndDate (DateTime), @UserCode (String)`
- **02.Purchase Quotation Details** (Purchase Quotation Details
): Bảng `OPEN, OPQT, PQT1` | Tham số: `@Reference (String), @CardCode (String), @ItemCode (String), @StartDate (DateTime), @EndDate (DateTime), @OPENorCLOSE (String)`
- **03.PO Details** (Purchase Orders Details): Bảng `OPEN, OPOR, POR1` | Tham số: `@Reference (String), @CardCode (String), @ItemCode (String), @StartDate (DateTime), @EndDate (DateTime), @OPEN (String)`
- **04.GRPO Details** (GRPO List): Bảng `OPDN, OPEN, PDN1` | Tham số: `@Reference (String), @CardCode (String), @ItemCode (String), @StartDate (DateTime), @EndDate (DateTime), @OPENorCLOSE (String)`
- **05.GRPO Returns Details** (GRPO  Returns List): Bảng `OPEN, ORPD, RPD1` | Tham số: `@Reference (String), @CardCode (String), @ItemCode (String), @StartDate (DateTime), @EndDate (String), @OPENorCLOSE (String)`
- **06.AP DownPayments Details** (AP DownPayments Details): Bảng `DPO1, ODPO, OPEN` | Tham số: `@Reference (String), @CardCode (String), @ItemCode (String), @StartDate (DateTime), @EndDate (DateTime), @OPENorCLOSE (String)`
- **07.AP Invoice Details** (AP Invoice Details): Bảng `OPCH, OPEN, OPRC, OUSR, PCH1` | Tham số: `@Reference (String), @CardCode (String), @ItemCode (String), @StartDate (String), @EndDate (String), @OPENorCLOSE (String)`
- **08.AP Credit Memo Details** (AP Credit Memo Details): Bảng `OPEN, OPRC, ORPC, OUSR, RPC1` | Tham số: `@Reference (String), @CardCode (String), @ItemCode (String), @StartDate (DateTime), @EndDate (String), @OPENorCLOSE (String)`
- **09.AP Reserved Invoices Details** (AP Reserved Invoices Details): Bảng `OPCH, OPEN, PCH1` | Tham số: `@Reference (String), @CardCode (String), @ItemCode (String), @StartDate (DateTime), @EndDate (DateTime), @OPENorCLOSE (String)`
- **10.Land Cost List** (Land Cost List): Bảng `IPF1, OINM, OIPF` | Tham số: `@StartDate (DateTime), @EndDate (DateTime)`

## Nhóm: 04.MRP Queries (2 queries)

- **MRP Details** (MRP Details): Bảng `BEAS_KALENDER, BEAS_MRP_DETAIL, BEAS_PRJ_LINE, OITM, POR1, RDR1` | Tham số: `@MRP (String), @itemcode (String)`
- **MRP Header** (MRP Header): Bảng `BEAS_MRP` | Tham số: `@MRP (String)`

## Nhóm: 05.Inventory Queries (7 queries)

- **01.Inventory History** (Inventory History Like BEAS Inventory History ): Bảng `N/A` | Tham số: `@Itemcode (String), @Itemname (String)`
- **02.Each Item QTY by Batch number** (Each Item QTY by Batch number): Bảng `BEAS_RESERVATION_LINE, OBTN, OBTQ, OITM, OLCT, OWHS` | Tham số: `@Itemcode (String)`
- **03.Others IN Details** (Others IN Details): Bảng `IGN1, IVL1, OIGN, OIVL` | Tham số: `@StartDate (String), @EndDate (String), @DEPT (String)`
- **04.Others OUT Details** (Query Description): Bảng `IGE1, IVL1, OIGE, OIVL` | Tham số: `@StartDate (String), @EndDate (String), @DEPT (String)`
- **05.Batch Transfer Details** (Batch Transfer Details): Bảng `IGE1, IGN1, IVL1, OIGE, OIGN, OIVL` | Tham số: `@StartDate (DateTime), @EndDate (String)`
- **09.Inventory Audit Report** (Inventory Audti Report by landscape): Bảng `N/A` | Tham số: `@StartDate (DateTime), @EndDate (DateTime)`
- **10.Time Receipt List** (Time Receipt List): Bảng `BEAS_AGTYP, BEAS_APLATZ, BEAS_ARBZEIT, BEAS_FTAPL, BEAS_FTHAUPT, BEAS_FTHAUPT_BITMAPCLOSE, BEAS_FTPOS, BEAS_PERS` | Tham số: `@StartDate (DateTime), @EndDate (DateTime)`

## Nhóm: 06.Production Queries (4 queries)

- **Material Issue Details** (Material Issue Details
Set the parameter value here ('FG' for 'FG', 'Material' for 'Material', or NULL for all)
FG means rework into WIP
Material means material issue
): Bảng `BEAS_FTHAUPT, BEAS_FTSTL, IGE1, IVL1, OIGE, OIVL` | Tham số: `@StartDate (DateTime), @EndDate (DateTime)`
- **Production Item IN/OUT and Cost List (this year)** (Production Item IN/OUT and Cost List (this year)
): Bảng `N/A` | Tham số: `Không có`
- **Production POST-IN** (Production POST-In Details
Set the parameter value here ('FG' for 'FG', 'Material' for 'Material', or NULL for all)
FG means Production IN
Material means "Material Return"): Bảng `BEAS_FTHAUPT, IGN1, OIGN, OITM` | Tham số: `@StartDate (DateTime), @EndDate (DateTime)`
- **Workorder  List** (Workorder  list): Bảng `BEAS_FTHAUPT, BEAS_FTPOS` | Tham số: `@Reference (String), @SItemcode (String), @EItemcode (String), @Close (String)`

## Nhóm: 07.Dashboard (5 queries)

- **01.Sales_DB** (Query for sales dashboard): Bảng `CRD1, DLN1, OCRD, ODLN, OITB, OITM, ORDN, RDN1` | Tham số: `@FromDate (DateTime), @ToDate (DateTime)`
- **02.Purchase_DB** (Query for show purchase dashboard): Bảng `CRD1, OCRD, OITB, OITM, OPDN, ORPD, PDN1, RPD1` | Tham số: `@FromDate (DateTime), @ToDate (DateTime)`
- **03.Finacial_DB** (Query for show Financial Dashboard): Bảng `JDT1` | Tham số: `@FromDate (DateTime), @ToDate (DateTime)`
- **04.Production_DB** (Query for show Production Dashboard): Bảng `N/A` | Tham số: `@FromDate (DateTime), @ToDate (DateTime)`
- **05.Salary_DB** (Query for show salary dashboard): Bảng `BEAS_ARBZEIT, BEAS_FTAPL, BEAS_FTPOS, BEAS_PERS, UDF1` | Tham số: `@FromDate (DateTime), @ToDate (DateTime)`

## Nhóm: 97.Production Cost Analysis (2 queries)

- **FG Post-In Cost Analysis (Plan Cost VS Actual Cost)** (FG Post-In Cost Analysis (Plan Cost VS Actual Cost)): Bảng `N/A` | Tham số: `@StartDate (DateTime), @EndDate (DateTime)`
- **Product Plan Cost for L/M** (This is a query to show the routing Plan cost (labor/Machine)of each product): Bảng `BEAS_APL, BEAS_APLATZ, OITM` | Tham số: `@Itemcode (String)`

## Nhóm: 98.Monthly closing (3 queries)

- **Manual WIP Voucher (Should be empty)** (This is a query to show manual wip account voucher. 
Normally, show be empty. WIP Voucher should not exist.): Bảng `IGE1, IGN1, JDT1, OIGE, OIGN, OJDT` | Tham số: `@EndDate (String)`
- **The account summary by each WO at a Specific Date** (This is a query to show the account summary for each WO on a specific date.): Bảng `BEAS_FTHAUPT, BEAS_FTPOS, IGE1, IGN1, JDT1, OIGE, OIGN, OJDT` | Tham số: `@EndDate (DateTime)`
- **WIP Value by End of Date** (This query is to show the WIP Value of Work order by end of date.The Total value will be the same as Trial balance.
For example, in trial balance, end of year, the WIP value is 100M. Then, run this q): Bảng `BEAS_FTHAUPT, BEAS_FTPOS, IGE1, IGN1, JDT1, OIGE, OIGN, OJDT` | Tham số: `@date (String)`

## Nhóm: 99.Master Data Queries (4 queries)

- **BOM** (BOM Details): Bảng `BEAS_STL, OITM` | Tham số: `@Itemcode (String)`
- **Items** (Itemcode List): Bảng `OITM` | Tham số: `@Itemcode (String)`
- **Resources** (Resources List): Bảng `BEAS_APLATZ` | Tham số: `@Resource (String), @Bez (String)`
- **Routing** (Routing ): Bảng `BEAS_APL, BEAS_STL, OITM` | Tham số: `@Itemcode (String)`

## Nhóm: 00.Formulas (34 queries)

- **BALD** (Balance of Accounts by Documents Date Range): Bảng `JDT1` | Tham số: `@StartAccountCode (String), @EndAccountCode (String), @EndDate (DateTime)`
- **CPA** (Current Period Actual by Doc Dates Range): Bảng `JDT1` | Tham số: `@StartAccountCode (String), @EndAccountCode (String), @StartDate (DateTime), @EndDate (DateTime)`
- **CPAD1** (CPA by Doc Dates): Bảng `JDT1` | Tham số: `@StartAccountCode (String), @EndAccountCode (String), @StartDate (String), @EndDate (String), @ONE (String)`
- **CPB** (Current Period Budget): Bảng `BGT3, OBGS, OBGT` | Tham số: `@BudName (String), @Month (String), @AcctCode (String)`
- **CPBD1** (Current period Budget by Doc. Dates): Bảng `BGT3, OBGS, OBGT` | Tham số: `@BudName (String), @Month (String), @AcctCode (String), @Ocrcode (String)`
- **CPP** (Current Period Actual by A/C Periods): Bảng `JDT1, OFPR` | Tham số: `@StartAccountCode (String), @EndAccountCode (String), @Period (String)`
- **CR** (Credit Amount of Accounts by A/C Period): Bảng `JDT1, OFPR` | Tham số: `@StartAccountCode (String), @EndAccountCode (String), @Period (String)`
- **CRB** (Credit Amount of Budgets): Bảng `BGT3, OBGS, OBGT` | Tham số: `@BudName (String), @Month (String), @AcctCode (String), @Ocrcode (String)`
- **CRD** (Credit Amount of Accounts by Document Dates): Bảng `JDT1` | Tham số: `@StartAccountCode (String), @EndAccountCode (String), @StartDate (DateTime), @EndDate (DateTime)`
- **CRDD1** (CRD with Department Codes): Bảng `JDT1` | Tham số: `@StartAccountCode (String), @EndAccountCode (String), @StartDate (DateTime), @EndDate (DateTime), @ONE (String)`
- **DR** (Credit Amount of Accounts by A/C Period): Bảng `JDT1, OFPR` | Tham số: `@StartAccountCode (String), @EndAccountCode (String), @Period (String)`
- **DRB** (DR amount of Budget): Bảng `BGT3, OBGS, OBGT` | Tham số: `@BudName (String), @Month (String), @AcctCode (String), @Ocrcode (String)`
- **DRD** (Debit Amount of Accounts by Document Dates): Bảng `JDT1` | Tham số: `@StartAccountCode (String), @EndAccountCode (String), @StartDate (DateTime), @EndDate (DateTime)`
- **DRDD1** (DRD with Department Codes): Bảng `JDT1` | Tham số: `@StartAccountCode (String), @EndAccountCode (String), @StartDate (DateTime), @EndDate (DateTime), @ONE (String)`
- **FGIN** (Production FG in by Dates ): Bảng `BEAS_FTHAUPT, IGN1, OIGN` | Tham số: `@Itemcode (String), @DocDate (String)`
- **FGIND** (Production FG (In + Out) by Dates ): Bảng `BEAS_FTHAUPT, IGE1, IGN1, OIGE, OIGN` | Tham số: `@Order (String), @Itemcode (String), @DocDate (String), @OrderA (String), @ItemcodeA (String), @DocDateA (String)`
- **FGINDWO** (WO FG (In+Out) by Dates): Bảng `BEAS_FTHAUPT, IGE1, IGN1, OIGE, OIGN` | Tham số: `@belnr_id (String), @belpos_id (String), @DocDate (String), @DocDate (String), @belnr_idA (String), @belpos_idA (String)`
- **LPP** (Last Period Account Amount by A/C Period): Bảng `JDT1, OFPR` | Tham số: `@StartAccountCode (String), @EndAccountCode (String), @Period (String)`
- **MNAME** (Query Description): Bảng `BEAS_STL, OITM` | Tham số: `@itemcode (String)`
- **MZNR** (Query Description): Bảng `BEAS_STL, OITM` | Tham số: `@itemcode (String)`
- **OBALD** (Opening Balance of Accounts by Doc. Date range): Bảng `JDT1` | Tham số: `@StartAccountCode (String), @EndAccountCode (String), @EndDate (DateTime)`
- **SAMT** (Sales Amount by Itemcodes): Bảng `INV1, OINV, OITB, OITM, ORIN, RIN1` | Tham số: `@Itemcode (String), @ITG (String)`
- **SPFT** (Sales Profit By Itemcodes ): Bảng `INV1, OINV, OITB, OITM, ORIN, RIN1` | Tham số: `@Itemcode (String), @ITG (String)`
- **SQTY** (Sales QTY by Itemcodes): Bảng `INV1, OINV, OITB, OITM, ORIN, RIN1` | Tham số: `@Itemcode (String), @ITG (String)`
- **TRQ** (Time Receipt QTY by WO and Date): Bảng `BEAS_ARBZEIT` | Tham số: `@APLATZ_ID (String), @belnrid (String), @belposid (String), @StartDate (String), @EndDate (String)`
- **TRQS** (Query Description): Bảng `BEAS_ARBZEIT` | Tham số: `@APLATZ_ID (String), @StartDate (String), @EndDate (String)`
- **VASCASHCPA** (VAS Cashflow Statement CPA): Bảng `FRC1, JDT1, OFRC` | Tham số: `Không có`
- **VASCPA** (CPA for VAS): Bảng `FRC1, JDT1, OFRC` | Tham số: `@ACCCAT (String), @StartDate (String), @EndDate (String)`
- **WAQ** (WO Actual QTY ): Bảng `BEAS_FTHAUPT, BEAS_FTPOS` | Tham số: `Không có`
- **WAQWO** (WO Actual Quantity by Work order): Bảng `BEAS_FTHAUPT, BEAS_FTPOS` | Tham số: `@belnr_id (String), @belpos_id (String)`
- **WFGID** (WO FG (In+Out) by Dates): Bảng `BEAS_FTHAUPT, IGE1, IGN1, OIGE, OIGN` | Tham số: `@belnr_id (String), @belpos_id (String), @StartDocDate (String), @EndDocDate (String), @belnr_idA (String), @belpos_idA (String)`
- **WPNWO** (WO Plan QTY by Work Order): Bảng `BEAS_FTHAUPT, BEAS_FTPOS` | Tham số: `@belnr_id (String), @belpos_id (String)`
- **WPQ** (WO Plan QTY Group by Customer orders ): Bảng `BEAS_FTHAUPT, BEAS_FTPOS` | Tham số: `@Itemcode (String), @Order (String)`
- **ZNR** (Query Description): Bảng `OITM` | Tham số: `@Itemcode (String)`

## Nhóm: Production (2 queries)

- **List 02: Time Receipt List** (Time Receipt List): Bảng `BEAS_AGTYP, BEAS_APLATZ, BEAS_ARBZEIT, BEAS_FTAPL, BEAS_FTHAUPT, BEAS_FTPOS, BEAS_PERS, OITM` | Tham số: `@EDate (DateTime), @SDate (DateTime)`
- **List 01: Work Order List** (Work Order List): Bảng `BEAS_FTHAUPT, BEAS_FTPOS` | Tham số: `@Reference (String), @SItemcode (String), @EItemcode (String), @Close (String)`

## Nhóm: QC (2 queries)

- **List 01: QC Orders** (QC Orders): Bảng `BEAS_FTHAUPT, BEAS_QSARTIKELHAUPT, BEAS_QSFTATTACHMENT, BEAS_QSFTHAUPT, BEAS_QSFTHAUPT_BASEBASETYPE, BEAS_QSFTMESSUNG, BEAS_QSVERWEIS, OITM` | Tham số: `@SDate (DateTime), @EDate (DateTime), @Status (String)`
- **List 02: QC Sample List** (QC Sample List): Bảng `BEAS_QSARTIKELHAUPT, BEAS_QSFTHAUPT, BEAS_QSFTHAUPT_ABGKZ, BEAS_QSFTHAUPT_BATCHNUM, BEAS_QSFTHAUPT_BELNR_ID, BEAS_QSFTHAUPT_CHARGE_ID, BEAS_QSFTHAUPT_FERT_BELNR_ID, BEAS_QSFTHAUPT_FERT_BELPOS_ID` | Tham số: `@ChargeID (String), @DocEntry (String), @ItemCode (String), @Pruefauftrag (String), @BatchNum (String), @KndID (String)`

## Nhóm: Human Resources (21 queries)

- **Attendance Records** (Attendance Records): Bảng `BEAS_ANWZEIT, BEAS_PERS` | Tham số: `@PERS_ID (String), @empID (String), @DisplayName (String), @KSTST_ID (String), @PERSGRP_ID (String), @FromDate (DateTime)`
- **Working Hrs** (Working Hrs in a range of time): Bảng `BEAS_ANWZEIT` | Tham số: `@Pers (String), @Date (DateTime)`
- **getEmpEmail** (get Email of Employee): Bảng `BEAS_PERS, OHEM` | Tham số: `@PersID (String)`
- **getBaseSalary** (getBaseSalary): Bảng `EO_TEMPLATEFOMULA_SALARY_PERSON` | Tham số: `@PersID (String), @TemplateID (String), @MonthID (String), @YearID (String)`
- **getEmpName** (getEmpName): Bảng `BEAS_PERS, OHEM` | Tham số: `@PersID (String)`
- **getOnTimeD** (GetOnTimeDays): Bảng `EO_TEMPLATEFOMULA_SALARY_PERSON` | Tham số: `@PersID (String), @TemplateID (String), @MonthID (String), @YearID (String)`
- **getNumberOfChildren** (getNumberOfChildren): Bảng `EO_TEMPLATEFOMULA_SALARY_PERSON` | Tham số: `@PersID (String), @TemplateID (String), @MonthID (String), @YearID (String)`
- **getAbsenceD** (getAbsenceD): Bảng `EO_TEMPLATEFOMULA_SALARY_PERSON` | Tham số: `@PersID (String), @TemplateID (String), @MonthID (String), @YearID (String)`
- **getLateD** (getLateD): Bảng `EO_TEMPLATEFOMULA_SALARY_PERSON` | Tham số: `@PersID (String), @TemplateID (String), @MonthID (String), @YearID (String)`
- **getSalaryUnit** (getSalaryUnit): Bảng `EO_TEMPLATEFOMULA_SALARY_PERSON` | Tham số: `@PersID (String), @TemplateID (String), @MonthID (String), @YearID (String)`
- **getLeaveEarlyD** (getLeaveEarlyD): Bảng `EO_TEMPLATEFOMULA_SALARY_PERSON` | Tham số: `@PersID (String), @TemplateID (String), @MonthID (String), @YearID (String)`
- **getKPI** (getKPI): Bảng `EO_TEMPLATEFOMULA_SALARY_PERSON` | Tham số: `@PersID (String), @TemplateID (String), @MonthID (String), @YearID (String)`
- **getTotalSalary** (getTotalSalary): Bảng `EO_TEMPLATEFOMULA_SALARY_PERSON` | Tham số: `@PersID (String), @TemplateID (String), @MonthID (String), @YearID (String)`
- **getKPIOutstanding** (getKPIOutstanding): Bảng `N/A` | Tham số: `@PersID (String), @MOnthID (String), @YearID (String)`
- **getKPILimitations** (getKPILimitations): Bảng `N/A` | Tham số: `@PersID (String), @MOnthID (String), @YearID (String)`
- **getKPIKeyPlan** (getKPIKeyPlan): Bảng `N/A` | Tham số: `@PersID (String), @MOnthID (String), @YearID (String)`
- **getKPILeaderComment** (getKPILeaderComment): Bảng `N/A` | Tham số: `@PersID (String), @MOnthID (String), @YearID (String)`
- **getKPIGrade** (getKPIGrade): Bảng `N/A` | Tham số: `@PersID (String), @MOnthID (String), @YearID (String)`
- **getDailyStatus** (Get Employee Daily Status): Bảng `BEAS_ABWZEIT, BEAS_ANWZEIT, BEAS_PERS, BEAS_PERS_TIMES, BEAS_RGLARBZEIT, BEAS_RGLARBZEIT_HEADER, EO_OVERTIME_HEADER, OHEM` | Tham số: `@YearID (Int), @MonthID (Int), @PersID (String), @DateID (Int)`
- **Employee List** (Filtered employee list-123): Bảng `OHEM` | Tham số: `@empID (Int), @FullName (String)`
- **Absence Report** ((no function) Employee absence report): Bảng `HEM1, OHEM` | Tham số: `@IsActive (String), @LastNameFrom (String), @LastNameTo (String), @FromDate (String), @ToDate (String)`

## Nhóm: Inventory (18 queries)

- **Items List** (Lists of items defined together with their prices): Bảng `OITM` | Tham số: `@Sitemcode (String), @EItemcode (String)`
- **Last Prices Report** (Last purchasing & sales prices of items): Bảng `OPCH, OPDN, OPOR, OPQT, ORPC, ORPD, PCH1, PDN1` | Tham số: `@ItemCode (String)`
- **Inactive Items** (Identify unused items in a given time): Bảng `N/A` | Tham số: `@StartItem (String), @EndItem (String), @BeginingDate (DateTime)`
- **Inventory Posting List** (Summary of all system postings filtered and sorted): Bảng `ILM1, OBIN, OBTN, OITM, OPEN, OSRN, OUSR, REF1` | Tham số: `@Itemcode (String), @EndDate (DateTime), @StartDate (DateTime)`
- **Inventory Status** (Planned inventory transactions for a specific item): Bảng `OITM, OITW` | Tham số: `@StartItem (String), @EndItem (String)`
- **Inventory Audit Report** (Audit trail for the posted inventory transactions): Bảng `N/A` | Tham số: `@StartDate (DateTime), @EndDate (DateTime)`
- **Serial Number Transactions Report** (Displays all tnx for each serial num-managed item): Bảng `ITL1, OCRD, OITL, OITM, OSRN` | Tham số: `@itemcode (String), @SerialFrom (String), @SerialTo (String)`
- **Stock QTY In WHs** (Stock QTY In WHs): Bảng `BEAS_FTPOS, BEAS_FTSTL, BEAS_RESERVATION_LINE, BEAS_WHS, OITM, OITW, OWHS` | Tham số: `@Itemcode (String)`
- **BATCH QTY List by Itemcode** (BATCH QTY List by Itemcode): Bảng `BEAS_RESERVATION_LINE, OBTN, OBTQ, OITM, OLCT, OWHS` | Tham số: `@Itemcode (String)`
- **Inventory Counting Posting Report** (Inventory Counting Posting Report): Bảng `IQR1, OINM, OJDT` | Tham số: `@DocNum (String)`
- **List 01: Other IN List** (Other IN List): Bảng `IGN1, IVL1, OIGN, OIVL` | Tham số: `@StartDate (DateTime), @EndDate (DateTime), @DEPT (String)`
- **List 02: Other Out List** (Other Out List): Bảng `IGN1, IVL1, OIGN, OIVL` | Tham số: `@StartDate (DateTime), @EndDate (DateTime), @DEPT (String)`
- **List 03: Batch Transfer List** (Batch Transfer List): Bảng `IGE1, IGN1, IVL1, OIGE, OIGN, OIVL` | Tham số: `@StartDate (DateTime), @EndDate (DateTime)`
- **Batch Number Transactions Report** (Displays batch num tnx for the selected items): Bảng `ITL1, OBTN, OCRD, OITL, OITM, ORDR` | Tham số: `@Itemcode (String), @BatchFrom (String), @BatchTo (String)`
- **Price Report** (View different prices defined for a specific item): Bảng `ITM1, ITM9, OITM, OPLN` | Tham số: `@PRICELIST (String), @FromItem (String), @ToItem (String)`
- **Inventory Counting Transactions Report** (the existing inventory counting Report): Bảng `INC1, INC8, INC9, NNM1, OBIN, OBPL, OINC, OITB` | Tham số: `@CountingDate (DateTime), @Status (String)`
- **List 04: Material Issue/FG Return List** (Material Issue/FG Return List): Bảng `BEAS_FTHAUPT, BEAS_FTSTL, IGE1, IVL1, OIGE, OIVL` | Tham số: `@SDate (DateTime), @EndDate (DateTime)`
- **List 05: FG Post-IN and Material Return List** (FG Post-IN and Material Return List): Bảng `BEAS_FTHAUPT, IGN1, OIGN, OITM` | Tham số: `@SDate (DateTime), @EDate (DateTime)`

## Nhóm: Sales and Purchasing (20 queries)

- **List: 03 Delivery Notes List** (Delivery Notes List): Bảng `DLN1, ODLN, OITM, OPEN` | Tham số: `@Reference (String), @CustomerCode (String), @StartDate (DateTime), @EndDate (DateTime), @OPENorCLOSE (String)`
- **List: 04 Delivery Return List** (Delivery Return List): Bảng `OITM, OPEN, ORDN, RDN1` | Tham số: `@Reference (String), @CustomerCode (String), @StartDate (DateTime), @EndDate (DateTime), @OPENorCLOSE (String)`
- **List: 05 AR INVOICE LIST** (AR INVOICE LIST): Bảng `INV1, OINV, OITM, OPEN` | Tham số: `@Reference (String), @CustomerCode (String), @StartDate (DateTime), @EndDate (DateTime), @OPENorCLOSE (String)`
- **List: 06 AR Credit Note List** (AR Credit Note List): Bảng `OITM, OPEN, ORIN, RIN1` | Tham số: `@Reference (String), @CustomerCode (String), @StartDate (DateTime), @EndDate (DateTime), @OPENorCLOSE (String)`
- **List: 09 Purchase Request List** (Purchase Request List): Bảng `OPRQ, PRQ1` | Tham số: `@ReqName (String)`
- **List: 10 Purchase Order List** (Purchase Order List): Bảng `OITM, OPEN, OPOR, POR1` | Tham số: `@Reference (String), @CustomerCode (String), @StartDate (DateTime), @EndDate (DateTime), @OPENorCLOSE (String)`
- **List: 11 GRPO List** (GRPO List): Bảng `OITM, OPDN, OPEN, PDN1` | Tham số: `@Reference (String), @CustomerCode (String), @StartDate (DateTime), @EndDate (DateTime), @OPENorCLOSE (String)`
- **List: 12 GRPO Return List** (GRPO Return List): Bảng `OITM, OPEN, ORPD, RPD1` | Tham số: `@Reference (String), @CustomerCode (String), @StartDate (DateTime), @EndDate (DateTime), @OPENorCLOSE (String)`
- **List: 13 AP Invoice List** (AP Invoice List): Bảng `OITM, OPCH, OPEN, PCH1` | Tham số: `@Reference (String), @CustomerCode (String), @StartDate (DateTime), @EndDate (DateTime), @OPENorCLOSE (String)`
- **List: 14 AP Credit Memo List** (AP Credit Memo List): Bảng `OITM, OPEN, ORPC, RPC1` | Tham số: `@Reference (String), @CustomerCode (String), @StartDate (DateTime), @EndDate (DateTime), @OPENorCLOSE (String)`
- **List: 07 AR Reserve Invoice List** (AR Reserve Invoice List): Bảng `DPI1, ODPI, OITM, OPEN` | Tham số: `@Reference (String), @CustomerCode (String), @StartDate (DateTime), @EndDate (DateTime), @OPENorCLOSE (String)`
- **List: 08 AR Downpayment Invoice List** (AR Downpayment Invoice List): Bảng `DPI1, ODPI, OPEN, ORDR` | Tham số: `@Reference (String), @CustomerCode (String), @StartDate (DateTime), @EndDate (DateTime), @OPENorCLOSE (String)`
- **List: 15 AP Reserve Invoice List** (AP Reserve Invoice List): Bảng `OITM, OPCH, OPEN, PCH1` | Tham số: `@Reference (String), @CustomerCode (String), @StartDate (DateTime), @EndDate (DateTime), @OPENorCLOSE (String)`
- **Backorder** (Undelivery Sales orders): Bảng `OPEN, ORDR, RDR1` | Tham số: `@FromDate (DateTime), @ToDate (DateTime), @FromCustomer (String), @ToCustomer (String)`
- **List: 16 AP Downpayment List** (AP Downpayment List): Bảng `DPO1, ODPO, OPEN, OPOR, ORPC, RPC1` | Tham số: `@Reference (String), @CustomerCode (String), @StartDate (DateTime), @EndDate (DateTime), @OPENorCLOSE (String)`
- **List: 00 Draft documents List** (Draft documents List): Bảng `ODRF, ORCP, OUSR, REF1, REF2` | Tham số: `@username (String)`
- **PO Payment Checking List** (PO Payment Checking List): Bảng `OACT, OPOR, OPRC, OUSR, POR1` | Tham số: `@SupplierCode (String), @SupplierName (String), @StartDate (DateTime), @EndDate (DateTime)`
- **List 17: Land Cost List** (Land Cost List): Bảng `IPF1, OINM, OIPF` | Tham số: `@StartDate (DateTime), @EndDate (DateTime)`
- **List: 01 Quotation** (Quotation List): Bảng `OITM, OPEN, OQUT, QUT1` | Tham số: `@Reference (String), @CustomerCode (String), @StartDate (DateTime), @EndDate (DateTime), @OPENorCLOSE (String)`
- **List: 02 Sales Order** (Sales Order List): Bảng `OITM, OPEN, ORDR, RDR1` | Tham số: `@Reference (String), @CustomerCode (String), @StartDate (DateTime), @EndDate (DateTime), @OPENorCLOSE (String)`

## Nhóm: Service (10 queries)

- **Service Calls** (Analyze all data on your company’s service call): Bảng `OSCL` | Tham số: `@FromDate (String), @ToDate (String)`
- **Service Calls by Queue** (Detailed info on waiting calls in a queue): Bảng `OSCL` | Tham số: `@StartDate (String), @EndDate (String), @IsQueue (String)`
- **Respone Time by Assigned To** (Response times of assigned employees): Bảng `OSCL` | Tham số: `@StartDate (String), @EndDate (String)`
- **Average Closure Time** (Average time required to close service calls): Bảng `OSCL` | Tham số: `@StartDate (String), @EndDate (String), @Status (String)`
- **Service Contracts** (Summary of customers’ service contracts





): Bảng `OCRD, OCTR` | Tham số: `@StartDate (String), @EndDate (String)`
- **Equipment Card Report** (Details of items purchased or assigned to each BP): Bảng `OCRD, OINS, OITM` | Tham số: `@StatusActive (String), @StatusReturned (String), @StatusTransferred (String)`
- **Service Monitor_Open** (Detailed open service calls): Bảng `OSCL` | Tham số: `@PriorityHigh (String), @PriorityMedium (String), @PriorityLow (String), @StatusCode (String)`
- **My Service Calls** (View and analyze your assigned service calls): Bảng `OSCL, OUSR` | Tham số: `@UserCode (String)`
- **My Open Service Calls** (View and analyze your open service calls): Bảng `OSCL` | Tham số: `@AssigneeUserId (String), @ExcludedStatusCode (String)`
- **My Overdue Service Calls** (View and analyze your overdue service calls): Bảng `OSCL, OUSR` | Tham số: `@UserCode (String), @BeforeDate (String), @SameDate (String), @BeforeTime (String), @ExcludedStatusCode (String)`

## Nhóm: SYSTEM (1 queries)

- **Transaction Type List** (Transaction Type List): Bảng `OACD, OACQ, OCIN, OCPI, OCPV, OCSI, OCSV, ODLN` | Tham số: `Không có`

## Nhóm: Accounting (17 queries)

- **General Ledger** (General Ledger): Bảng `JDT1, OACT, OCRD, OJDT, OPRJ, REF1, REF2, REF3` | Tham số: `@SAcc (String), @EAcc (String), @SDate (DateTime), @Edate (DateTime)`
- **Customer Receivable Aging-1** (Customer Receivable Aging-1): Bảng `ITR1, JDT1, OCRD, OITR, OJDT` | Tham số: `@SDate (DateTime), @EDate (DateTime), @Cardtype (String), @balance (String), @Scardcode (String), @Ecardcode (String)`
- **Vendor Liabilities Aging-1** (Vendor Liabilities Aging-1): Bảng `ITR1, JDT1, OCRD, OITR, OJDT` | Tham số: `@SDate (DateTime), @EDate (DateTime), @Cardtype (String), @balance (String), @SCardcode (String), @ECardcode (String)`
- **Transaction Journal Report** (Transaction Journal Report): Bảng `JDT1, NNM1, OACT, OCRD, OJDT, REF1, REF2` | Tham số: `@SDate (DateTime), @EDate (DateTime)`
- **Transaction Report by Projects** (Transaction Report by Projects): Bảng `JDT1, OPRJ, REF1, REF2` | Tham số: `@includeNull (String), @SPrj (String), @EPrj (String), @SPDate (DateTime), @EPDate (DateTime), @SDDate (DateTime)`
- **Document Journal** (Document Journal): Bảng `JDT1, OACT, OCRD, OJDT, REF1, REF2` | Tham số: `@UsePostingDate (String), @SPostDate (DateTime), @EPostDate (DateTime), @UseCreateDate (String), @SCreateDate (DateTime), @ECreateDate (DateTime)`
- **Tax Report** (Tax Report (InTax/OutTax)): Bảng `ODPI, ODPO, OINV, OPCH, ORIN, ORPC` | Tham số: `@DateType (String), @FromDate (DateTime), @ToDate (DateTime), @DocTypes (String)`
- **Tax Reconcilation Report** (Tax Reconcilation Report by account code): Bảng `OACT` | Tham số: `@SDate (DateTime), @EDate (DateTime), @ACCode (String), @TaxCode (String)`
- **List 01: Voucher List** (Voucher List): Bảng `JDT1, OACD, OACQ, OACT, OCIN, OCPI, OCPV, OCSI` | Tham số: `@StartDate (DateTime), @EndDate (DateTime), @Number (String), @Account (String), @BP (String)`
- **List 02: Account Code List** (Account Code List): Bảng `OACT` | Tham số: `@StartAcc (String), @EndAcc (String)`
- **List 03: Cost Center List** (Cost Center List): Bảng `OCR1, OOCR, OPRC` | Tham số: `Không có`
- **Vendor Liabilities Aging-2** (Vendor Liabilities Aging-2): Bảng `OACT, OCRD, OCTG, OPCH, OUSR, PCH1` | Tham số: `@DueDate (DateTime), @StartDate (DateTime), @EndDate (DateTime)`
- **Customer Receivable Aging-2** (Customer Receivable Aging-2): Bảng `ITR1, JDT1, OCRD, OITR, OJDT` | Tham số: `@Today (DateTime)`
- **G/L Accounts and Business Partners** (show Business Partners account balance): Bảng `OCRD, OCRG` | Tham số: `@Cardcode_S (String), @Cardcode_E (String), @type (String)`
- **Cash Use Details** (Cash Use Details): Bảng `JDT1, OJDT` | Tham số: `@StartDate (DateTime), @EndDate (DateTime)`
- **Real Inventory VS Account Inventory Report** (Real Inventory VS Account Inventory Report): Bảng `JDT1, OITB, OIVL, OJDT` | Tham số: `@StartDate (DateTime), @EndDate (DateTime)`
- **Plan Cost VS Actual Cost ** (Plan Cost VS Actual Cost (not apply for STD Cost)): Bảng `N/A` | Tham số: `@SDate (DateTime), @EDate (DateTime)`

## Nhóm: Banking (5 queries)

- **Check Register Report** (Overview of the checks for payment in SAP B1): Bảng `OCHO` | Tham số: `@StartDate (String)`
- **Payment Order List** (Payment Order List): Bảng `OCRB, OCRD, ODSC, OPWZ, OVER, PWZ3` | Tham số: `@PaymentID (String)`
- **Payment Drafts Report** (Handle incoming/outgoing payment drafts): Bảng `OPDF, REF1, REF2` | Tham số: `@PrimaryObjType (String), @SecondaryObjType (String)`
- **List 01: Incoming Payment List** (Incoming Payment List): Bảng `JDT1, OJDT, ORCT, RCT2, REF1, REF2` | Tham số: `@StartDate (DateTime), @EndDate (DateTime)`
- **List 02: Outgoing Payment List** (Outgoing Payment List): Bảng `JDT1, OJDT, OVPM, REF1, REF2, VPM2` | Tham số: `@StartDate (DateTime), @EndDate (DateTime)`

## Nhóm: Business Partners (3 queries)

- **Vendors List** (Vendors List): Bảng `OCRB, OCRD, ODSC` | Tham số: `Không có`
- **Activities Overview** (Info about all activities recorded in SAP B1): Bảng `OCLG, OCRD, OUSR` | Tham số: `@UserName (String)`
- **Customer List** (Customer List): Bảng `OCRD` | Tham số: `@IncludeCardType (String), @ExcludeCardType (String), @OptionCardTypeA (String), @OptionCardTypeB (String), @OptionCardTypeC (String)`

## Nhóm: CRM (1 queries)

- **List 01: Oppoturnity List** (Oppoturnity List): Bảng `OCRD, OOPR` | Tham số: `@Status (String)`

## Nhóm: Fixed Asset (2 queries)

- **List 01: Fixed Asset A/C Code Setting List** (Fixed Asset A/C Code Setting List): Bảng `OADT` | Tham số: `Không có`
- **List 02: Fixed Asset Status List** (Fixed Asset Status List): Bảng `FIX1, ITM7, ODPV, OITM` | Tham số: `@YEAR (String), @FAStartCode (String), @FAEndCode (String), @AsstStatus (String)`

## Nhóm: Monthly Closing (2 queries)

- **Checking: Manual WIP Vouchers** (Manual WIP Vouchers): Bảng `IGE1, IGN1, JDT1, OIGE, OIGN, OJDT` | Tham số: `@WIPAC (String), @SDate (DateTime), @EDate (DateTime)`
- **Account Summary on Work Orders** (Account Summary on Work Orders): Bảng `BEAS_FTHAUPT, BEAS_FTPOS, IGE1, IGN1, JDT1, OIGE, OIGN, OJDT` | Tham số: `@WO (String), @WO_POS (String)`

## Nhóm: MRP (2 queries)

- **MRP Items Result** (MRP Items Result): Bảng `BEAS_MRP` | Tham số: `@MRP (String)`
- **MRP Details Search** (MRP Details Search By Item): Bảng `BEAS_KALENDER, BEAS_MRP_DETAIL, BEAS_PRJ_LINE, OITM, POR1, RDR1` | Tham số: `@MRP (String), @itemcode (String)`