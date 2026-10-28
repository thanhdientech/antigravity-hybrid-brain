select itemcode, itemname,u_znr as 'Drawing No.',itmsgrpcod,EvalSystem,BuyUnitMsr,SalUnitMsr,InvntryUom,PlaningSys,PrcrmntMtd,U_me_verbr,U_dispo as 'Break Down' from OITM
where itemcode like '%' + @Itemcode + '%'

