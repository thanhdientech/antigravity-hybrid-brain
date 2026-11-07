/* ============================================================================
   SCRIPT TAO USER SQL DUNG CHUNG CHO INFOASIA AI AGENT (CON 24, 52, 160, 27...)
   - Ten dang nhap (Login/User) : infoasia_ro
   - Mat khau dung chung        : InfoAsia@RO2026!
   - Quyen han                  : CHI LAY DATA (SELECT + VIEW DEFINITION + #Temp)
   - Cam tuyet doi              : INSERT, UPDATE, DELETE, ALTER, DROP, TRUNCATE, EXEC
   - Ho tro tat ca Server       :
     + Con 24 (192.168.42.24)   : infoasia56, infoasia56_train, FUDA, SBO-COMMON...
     + Con 52 (192.168.42.52)   : PenflexPRD_NEW...
     + Con 160 (192.168.42.160) : FVIVN_PROD_TRAIN, FVIVN_GoLive_2024, FVIVN_PROD...
     + Con 27 (192.168.42.27)   : ECC, HTL_DEMO...
   ============================================================================ */

USE [master];
GO

-- 1. Tao hoac dong bo mat khau Login [infoasia_ro] o cap SQL Server
IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = N'infoasia_ro')
BEGIN
    CREATE LOGIN [infoasia_ro]
        WITH PASSWORD = N'InfoAsia@RO2026!',
             DEFAULT_DATABASE = [master],
             CHECK_EXPIRATION = OFF,
             CHECK_POLICY = OFF;
    PRINT N'[OK] Da tao moi Login [infoasia_ro] tren SQL Server: ' + @@SERVERNAME;
END
ELSE
BEGIN
    ALTER LOGIN [infoasia_ro]
        WITH PASSWORD = N'InfoAsia@RO2026!',
             CHECK_EXPIRATION = OFF,
             CHECK_POLICY = OFF;
    ALTER LOGIN [infoasia_ro] ENABLE;
    PRINT N'[OK] Da cap nhat mat khau va kich hoat Login [infoasia_ro] tren: ' + @@SERVERNAME;
END
GO

-- 2. Dam bao Login KHONG co bat ky quyen quan tri he thong nao (sysadmin, serveradmin, securityadmin, dbcreator...)
DECLARE @roleName sysname;
DECLARE role_cur CURSOR FAST_FORWARD FOR
    SELECT r.name
    FROM sys.server_role_members rm
    INNER JOIN sys.server_principals r ON rm.role_principal_id = r.principal_id
    INNER JOIN sys.server_principals m ON rm.member_principal_id = m.principal_id
    WHERE m.name = N'infoasia_ro' AND r.name <> N'public';

OPEN role_cur;
FETCH NEXT FROM role_cur INTO @roleName;
WHILE @@FETCH_STATUS = 0
BEGIN
    DECLARE @dropRoleSql NVARCHAR(400) = N'ALTER SERVER ROLE ' + QUOTENAME(@roleName) + N' DROP MEMBER [infoasia_ro];';
    EXEC sp_executesql @dropRoleSql;
    PRINT N'[SECURITY] Da go bo Server Role: ' + @roleName;
    FETCH NEXT FROM role_cur INTO @roleName;
END
CLOSE role_cur;
DEALLOCATE role_cur;
GO

-- 3. Tu dong quet va cap quyen Read-Only (db_datareader + DENY WRITE) tren TAT CA User Database:
--    - Con 24 : infoasia56, infoasia56_train, FUDA, FVIVN_GO_BK, FVIVN_PROD_BK, Infoasia_Periodic_Inventory, Infoasia_USA, SBO-COMMON
--    - Con 52 : PenflexPRD_NEW
--    - Con 160: FVIVN_PROD_TRAIN, FVIVN_GoLive_2024, FVIVN_PROD
--    - Con 27 : ECC, HTL_DEMO
DECLARE @dbName sysname;
DECLARE @sql NVARCHAR(MAX);

DECLARE db_cur CURSOR FAST_FORWARD FOR
    SELECT d.name
    FROM sys.databases d
    WHERE d.state_desc = N'ONLINE'
      AND d.database_id > 4
      AND d.name NOT IN (
          N'ReportServer', N'ReportServerTempDB',
          N'ReportServer$SAP', N'ReportServer$SAPTempDB',
          N'SLDModel.SLDData', N'DWConfiguration', N'DWDiagnostics', N'DWQueue',
          N'B1AS', N'B1LOGGING', N'Infoasia_License_DB'
      )
      AND d.is_read_only = 0;

OPEN db_cur;
FETCH NEXT FROM db_cur INTO @dbName;

WHILE @@FETCH_STATUS = 0
BEGIN
    SET @sql = N'
    USE ' + QUOTENAME(@dbName) + N';
    IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = N''infoasia_ro'')
    BEGIN
        CREATE USER [infoasia_ro] FOR LOGIN [infoasia_ro];
    END
    ELSE
    BEGIN
        ALTER USER [infoasia_ro] WITH LOGIN = [infoasia_ro];
    END

    -- Go bo DENY CONTROL (neu ban cu tung chay) vi DENY CONTROL se chan luon quyen CONNECT (Error 916)
    REVOKE CONTROL TO [infoasia_ro];

    -- Cap quyen ket noi, doc du lieu va xem cau truc bang/view
    GRANT CONNECT TO [infoasia_ro];
    ALTER ROLE [db_datareader] ADD MEMBER [infoasia_ro];
    GRANT VIEW DEFINITION TO [infoasia_ro];

    -- Chan cung 100% quyen ghi, sua, xoa, thay doi cau truc, chay thu tuc ghi
    ALTER ROLE [db_denydatawriter] ADD MEMBER [infoasia_ro];
    IF IS_ROLEMEMBER(N''db_owner'', N''infoasia_ro'') = 1
        ALTER ROLE [db_owner] DROP MEMBER [infoasia_ro];
    IF IS_ROLEMEMBER(N''db_ddladmin'', N''infoasia_ro'') = 1
        ALTER ROLE [db_ddladmin] DROP MEMBER [infoasia_ro];
    IF IS_ROLEMEMBER(N''db_datawriter'', N''infoasia_ro'') = 1
        ALTER ROLE [db_datawriter] DROP MEMBER [infoasia_ro];

    DENY INSERT, UPDATE, DELETE, ALTER, EXECUTE TO [infoasia_ro];

    PRINT N''[OK] Da cap quyen Read-Only (va khoa INSERT/UPDATE/DELETE) cho [infoasia_ro] tren DB: '' + DB_NAME();
    ';
    BEGIN TRY
        EXEC sp_executesql @sql;
    END TRY
    BEGIN CATCH
        PRINT N'[WARN] Bo qua DB ' + @dbName + N': ' + ERROR_MESSAGE();
    END CATCH

    FETCH NEXT FROM db_cur INTO @dbName;
END

CLOSE db_cur;
DEALLOCATE db_cur;
GO

-- 4. Tu dong dat DEFAULT_DATABASE phu hop theo tung Server (24 -> infoasia56, 52 -> PenflexPRD_NEW, 160 -> FVIVN_PROD, 27 -> ECC)
IF DB_ID(N'infoasia56') IS NOT NULL
BEGIN
    ALTER LOGIN [infoasia_ro] WITH DEFAULT_DATABASE = [infoasia56];
    PRINT N'[OK] Da dat DEFAULT_DATABASE cua [infoasia_ro] = [infoasia56] (Con 24).';
END
ELSE IF DB_ID(N'PenflexPRD_NEW') IS NOT NULL
BEGIN
    ALTER LOGIN [infoasia_ro] WITH DEFAULT_DATABASE = [PenflexPRD_NEW];
    PRINT N'[OK] Da dat DEFAULT_DATABASE cua [infoasia_ro] = [PenflexPRD_NEW] (Con 52).';
END
ELSE IF DB_ID(N'FVIVN_PROD') IS NOT NULL
BEGIN
    ALTER LOGIN [infoasia_ro] WITH DEFAULT_DATABASE = [FVIVN_PROD];
    PRINT N'[OK] Da dat DEFAULT_DATABASE cua [infoasia_ro] = [FVIVN_PROD] (Con 160).';
END
ELSE IF DB_ID(N'ECC') IS NOT NULL
BEGIN
    ALTER LOGIN [infoasia_ro] WITH DEFAULT_DATABASE = [ECC];
    PRINT N'[OK] Da dat DEFAULT_DATABASE cua [infoasia_ro] = [ECC] (Con 27).';
END
GO

-- 5. Kiem tra ket qua phan quyen
SELECT
    @@SERVERNAME AS [SQL_Server_Name],
    sp.name AS [SQL_Login],
    sp.default_database_name AS [Default_DB],
    sp.is_disabled AS [Is_Disabled],
    IS_SRVROLEMEMBER('sysadmin', sp.name) AS [Is_SysAdmin_Must_Be_0]
FROM sys.server_principals sp
WHERE sp.name = N'infoasia_ro';
GO
