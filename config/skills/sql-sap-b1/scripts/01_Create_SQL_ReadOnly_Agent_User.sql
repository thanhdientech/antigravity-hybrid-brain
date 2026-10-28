/* ============================================================================
   SCRIPT TAO USER SQL DUNG CHUNG CHO ENTERPRISE AI AGENT (Server A, 52, 160, 27...)
   - Ten dang nhap (Login/User) : sap_readonly_user
   - Mat khau dung chung        : CHANGE_ME_STRONG_RO_PASSWORD!
   - Quyen han                  : CHI LAY DATA (SELECT + VIEW DEFINITION + #Temp)
   - Cam tuyet doi              : INSERT, UPDATE, DELETE, ALTER, DROP, TRUNCATE, EXEC
   - Ho tro tat ca Server       :
     + Server A (10.0.0.10)   : SBO_MAIN_PROD, SBO_MAIN_TRAIN, SBO_BRANCH_SUB, SBO-COMMON...
     + Server C (10.0.0.30)   : SBO_PLANT_C...
     + Server B (10.0.0.20) : SBO_MFG_TRAIN, SBO_MFG_PLANT1, SBO_MFG_PROD...
     + Server D (10.0.0.40)   : ECC, SBO_PLANT_D_DEMO...
   ============================================================================ */

USE [master];
GO

-- 1. Tao hoac dong bo mat khau Login [sap_readonly_user] o cap SQL Server
IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = N'sap_readonly_user')
BEGIN
    CREATE LOGIN [sap_readonly_user]
        WITH PASSWORD = N'CHANGE_ME_STRONG_RO_PASSWORD!',
             DEFAULT_DATABASE = [master],
             CHECK_EXPIRATION = OFF,
             CHECK_POLICY = OFF;
    PRINT N'[OK] Da tao moi Login [sap_readonly_user] tren SQL Server: ' + @@SERVERNAME;
END
ELSE
BEGIN
    ALTER LOGIN [sap_readonly_user]
        WITH PASSWORD = N'CHANGE_ME_STRONG_RO_PASSWORD!',
             CHECK_EXPIRATION = OFF,
             CHECK_POLICY = OFF;
    ALTER LOGIN [sap_readonly_user] ENABLE;
    PRINT N'[OK] Da cap nhat mat khau va kich hoat Login [sap_readonly_user] tren: ' + @@SERVERNAME;
END
GO

-- 2. Dam bao Login KHONG co bat ky quyen quan tri he thong nao (sysadmin, serveradmin, securityadmin, dbcreator...)
DECLARE @roleName sysname;
DECLARE role_cur CURSOR FAST_FORWARD FOR
    SELECT r.name
    FROM sys.server_role_members rm
    INNER JOIN sys.server_principals r ON rm.role_principal_id = r.principal_id
    INNER JOIN sys.server_principals m ON rm.member_principal_id = m.principal_id
    WHERE m.name = N'sap_readonly_user' AND r.name <> N'public';

OPEN role_cur;
FETCH NEXT FROM role_cur INTO @roleName;
WHILE @@FETCH_STATUS = 0
BEGIN
    DECLARE @dropRoleSql NVARCHAR(400) = N'ALTER SERVER ROLE ' + QUOTENAME(@roleName) + N' DROP MEMBER [sap_readonly_user];';
    EXEC sp_executesql @dropRoleSql;
    PRINT N'[SECURITY] Da go bo Server Role: ' + @roleName;
    FETCH NEXT FROM role_cur INTO @roleName;
END
CLOSE role_cur;
DEALLOCATE role_cur;
GO

-- 3. Tu dong quet va cap quyen Read-Only (db_datareader + DENY WRITE) tren TAT CA User Database:
--    - Server A : SBO_MAIN_PROD, SBO_MAIN_TRAIN, SBO_BRANCH_SUB, SBO_MFG_BACKUP2, SBO_MFG_BACKUP1, SBO_PERIODIC_INV, SBO_BRANCH_US, SBO-COMMON
--    - Server C : SBO_PLANT_C
--    - Server B: SBO_MFG_TRAIN, SBO_MFG_PLANT1, SBO_MFG_PROD
--    - Server D : ECC, SBO_PLANT_D_DEMO
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
          N'B1AS', N'B1LOGGING', N'SBO_LICENSE_DB'
      )
      AND d.is_read_only = 0;

OPEN db_cur;
FETCH NEXT FROM db_cur INTO @dbName;

WHILE @@FETCH_STATUS = 0
BEGIN
    SET @sql = N'
    USE ' + QUOTENAME(@dbName) + N';
    IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = N''sap_readonly_user'')
    BEGIN
        CREATE USER [sap_readonly_user] FOR LOGIN [sap_readonly_user];
    END
    ELSE
    BEGIN
        ALTER USER [sap_readonly_user] WITH LOGIN = [sap_readonly_user];
    END

    -- Go bo DENY CONTROL (neu ban cu tung chay) vi DENY CONTROL se chan luon quyen CONNECT (Error 916)
    REVOKE CONTROL TO [sap_readonly_user];

    -- Cap quyen ket noi, doc du lieu va xem cau truc bang/view
    GRANT CONNECT TO [sap_readonly_user];
    ALTER ROLE [db_datareader] ADD MEMBER [sap_readonly_user];
    GRANT VIEW DEFINITION TO [sap_readonly_user];

    -- Chan cung 100% quyen ghi, sua, xoa, thay doi cau truc, chay thu tuc ghi
    ALTER ROLE [db_denydatawriter] ADD MEMBER [sap_readonly_user];
    IF IS_ROLEMEMBER(N''db_owner'', N''sap_readonly_user'') = 1
        ALTER ROLE [db_owner] DROP MEMBER [sap_readonly_user];
    IF IS_ROLEMEMBER(N''db_ddladmin'', N''sap_readonly_user'') = 1
        ALTER ROLE [db_ddladmin] DROP MEMBER [sap_readonly_user];
    IF IS_ROLEMEMBER(N''db_datawriter'', N''sap_readonly_user'') = 1
        ALTER ROLE [db_datawriter] DROP MEMBER [sap_readonly_user];

    DENY INSERT, UPDATE, DELETE, ALTER, EXECUTE TO [sap_readonly_user];

    PRINT N''[OK] Da cap quyen Read-Only (va khoa INSERT/UPDATE/DELETE) cho [sap_readonly_user] tren DB: '' + DB_NAME();
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

-- 4. Tu dong dat DEFAULT_DATABASE phu hop theo tung Server (24 -> SBO_MAIN_PROD, 52 -> SBO_PLANT_C, 160 -> SBO_MFG_PROD, 27 -> ECC)
IF DB_ID(N'SBO_MAIN_PROD') IS NOT NULL
BEGIN
    ALTER LOGIN [sap_readonly_user] WITH DEFAULT_DATABASE = [SBO_MAIN_PROD];
    PRINT N'[OK] Da dat DEFAULT_DATABASE cua [sap_readonly_user] = [SBO_MAIN_PROD] (Server A).';
END
ELSE IF DB_ID(N'SBO_PLANT_C') IS NOT NULL
BEGIN
    ALTER LOGIN [sap_readonly_user] WITH DEFAULT_DATABASE = [SBO_PLANT_C];
    PRINT N'[OK] Da dat DEFAULT_DATABASE cua [sap_readonly_user] = [SBO_PLANT_C] (Server C).';
END
ELSE IF DB_ID(N'SBO_MFG_PROD') IS NOT NULL
BEGIN
    ALTER LOGIN [sap_readonly_user] WITH DEFAULT_DATABASE = [SBO_MFG_PROD];
    PRINT N'[OK] Da dat DEFAULT_DATABASE cua [sap_readonly_user] = [SBO_MFG_PROD] (Server B).';
END
ELSE IF DB_ID(N'ECC') IS NOT NULL
BEGIN
    ALTER LOGIN [sap_readonly_user] WITH DEFAULT_DATABASE = [ECC];
    PRINT N'[OK] Da dat DEFAULT_DATABASE cua [sap_readonly_user] = [ECC] (Server D).';
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
WHERE sp.name = N'sap_readonly_user';
GO
