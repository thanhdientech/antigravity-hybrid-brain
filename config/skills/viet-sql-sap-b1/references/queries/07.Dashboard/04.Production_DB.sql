SELECT  
  "BEASV_WORKORDER_POS"."DocEntry" AS "Work Order",  
  "BEASV_WORKORDER_POS"."LineNumber" AS "Position Number",  
  "BEASV_WORKORDER_POS"."Level" AS "Level",  
  "BEASV_WORKORDER_POS"."Priority" AS "Priority",  
  "BEASV_WORKORDER_POS"."CardCode" AS "Customer Code",  
  "BEASV_WORKORDER_POS"."CardName" AS "Customer Name",  
  "BEASV_WORKORDER_POS"."InWork" AS "In Work",  
  "BEASV_WORKORDER_POS"."QuantityWhsUnit" AS "Total Quantity",  
  "BEASV_WORKORDER_POS"."QuantityProduced" AS "QuantityProduced",  
  "BEASV_WORKORDER_POS"."WhsUnit" AS "WhsUnit",  
  "BEASV_WORKORDER_POS"."ItemCode" AS "Item Code",  
  "BEASV_WORKORDER_POS"."ItemVersion",  
  "BEASV_WORKORDER_POS"."ItemName" AS "Item Name",  
  "BEASV_WORKORDER_POS"."DRAWINGNUMBER" AS "Project Code",  
  "BEASV_WORKORDER_POS"."StartDate" AS "Start Date",  
  Year("BEASV_WORKORDER_POS"."StartDate") AS "Year",  
  Month("BEASV_WORKORDER_POS"."StartDate") AS "Month",  
  "BEASV_WORKORDER_POS"."EndDate" AS "End Date",  
  "BEASV_WORKORDER_POS"."DELIVERYDATE" AS "DELIVERYDATE",  
  "BEASV_WORKORDER_POS"."AssignedToLineNumber",  
  "BEASV_WORKORDER_POS"."AssignedToLineNumber2",  
  "BEASV_WORKORDER_POS"."Approved",  
  "BEASV_WORKORDER_POS"."ChangeAllow",  
  "BEASV_WORKORDER_POS"."Lock",  
  "BEASV_WORKORDER_POS"."WorkOrderClosed" AS "WorkorderClosed",  
  "BEASV_WORKORDER_POS"."PositionClosed",  
  "BEASV_WORKORDER_POS"."PrintStatus",  
  "BEASV_WORKORDER_POS"."PlannedTime" AS "Planned Time",  
  "BEASV_WORKORDER_POS"."WorkTime" AS "WorkTime",  
  "BEASV_WORKORDER_POS"."AutomaticallyScheduled" AS "Automatically Scheduled"  
FROM "BEASV_WORKORDER_POS" 
WHERE "BEASV_WORKORDER_POS"."StartDate" >= @FromDate and "BEASV_WORKORDER_POS"."StartDate" <= @ToDate