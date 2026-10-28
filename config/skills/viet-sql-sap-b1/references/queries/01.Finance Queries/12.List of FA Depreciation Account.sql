select Code, Descr as Name, BalanceAct as FAAcct, ClrAcqAct as FATeporaryAcct
	, OrdDprAct as ExpenAcct,OrdDprAcc as AccumAcct,ReNBVeAct as RetireExpen, ReNBVrAct as RetireRevenue
from OADT with (nolock)