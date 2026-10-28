select T0.CardCode, T0.CardName,T0.LicTradNum,T1.PymntGroup,T0.Address,T0.ZipCode,T0.MailAddres,T0.phone1,T0.Phone2,t0.HouseBank,T0.HousBnkAct,T0.HousBnkBrn,T0.HousBnkCry,T0.HousCtlKey 
,T0.DebPayAcct,T0.DpmClear,T0.DpmIntAct
from OCRD T0 inner join OCTG T1 on T0.groupnum = T1.GroupNum

where T0.CardType = 'S'