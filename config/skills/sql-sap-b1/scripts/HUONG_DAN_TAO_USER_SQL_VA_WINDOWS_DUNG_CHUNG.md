# Hướng Dẫn Tạo User SQL & User Windows Dùng Chung Cho `ENTERPRISE AI AGENT`

Tất cả các máy chủ (`Server A`, `Server C`, `Server B` và các máy chủ mở rộng sau này) sử dụng **cùng 1 tài khoản & mật khẩu duy nhất** để cấp cho `ENTERPRISE AI AGENT`:

- **Username dùng chung (cả SQL & Windows):** `sap_readonly_user`
- **Password dùng chung (cả SQL & Windows):** `CHANGE_ME_STRONG_RO_PASSWORD!`
- **Riêng Server A (`SBO_MAIN_PROD` - SAP 10.0):**
  - Kết nối SQL vẫn dùng `sap_readonly_user` (`Read-Only 100%`, không dùng `sa`).
  - Kết nối ghi dữ liệu vào SAP B1 đi qua **SAP Service Layer (`https://10.0.0.10:50000/b1s/v1`)** bằng tài khoản SAP **`manager`**.
- **Các máy còn lại (`Server C`, `Server B` - SAP 9.3):**
  - Chạy **100% Read-Only SQL (`sap_readonly_user`)**, khóa cứng `INSERT`, `UPDATE`, `DELETE`, `ALTER`, `EXEC`.

---

## 1. Danh Sách File Trong `<WORKSPACE_DIR>\JavisOS\create user\` & Trạng Thái Kiểm Thử

- **Server A (`10.0.0.10` - Máy `SAP-SQL-SRV01`, DB `SBO_MAIN_PROD` - `Enterprise Demo Company`, SAP 10.0 + Beas):**
  - **SQL Read-Only (`sap_readonly_user`):** Đã test kết nối & truy vấn `SELECT` thành công 100% (`HasAccess = 1` trên `SBO_MAIN_PROD`) + **SAP Service Layer (`:50000`)** `connected (HTTP 200)`.
  - **Windows User (`sap_readonly_user`) & mở rộng các DB phụ trên Server A:** Chạy file `03_Run_All_OneClick_Setup.bat` (`Run as administrator`) hoặc chạy lệnh PowerShell/SQL ở Mục 2.A bên dưới.
- **Server C (`10.0.0.30` - Máy `SAP-SQL-SRV03` / `SAP-VM-SRV03`, DB `SBO_PLANT_C` - `MANUFACTURING PLANT C (DEMO)`, SAP 9.3 + Beas):**
  - **Đã hoàn tất 100% cả Windows User & SQL Read-Only User `sap_readonly_user` / `CHANGE_ME_STRONG_RO_PASSWORD!`** (`HasAccess = 1`, chặn cứng `UPDATE` với `Error 229`).
- **Server B (`10.0.0.20` - Máy `SAP-SQL-SRV02`, SAP 9.3 + Beas):**
  - **Đã test thành công 100%** trên `SBO_MFG_PLANT1` (`/160 hcm`) và `SBO_MFG_PROD` (`/160 lt`) (`HasAccess = 1`). Riêng `SBO_MFG_TRAIN` chạy thêm Mục 2.C bên dưới.

Danh sách 5 file trong thư mục **`<WORKSPACE_DIR>\JavisOS\create user\`**:
1. [`THONG_TIN_KET_NOI_USER_CAC_SERVER.txt`](file:///WORKSPACE_DIR/JavisOS/create%20user/THONG_TIN_KET_NOI_USER_CAC_SERVER.txt): File `.txt` tổng hợp toàn bộ thông tin kết nối, tài khoản, trạng thái test và lệnh copy-paste nhanh.
2. [`01_Create_SQL_ReadOnly_Agent_User.sql`](file:///WORKSPACE_DIR/JavisOS/create%20user/01_Create_SQL_ReadOnly_Agent_User.sql): Script T-SQL tự động tạo Login/User `sap_readonly_user` chỉ đọc dữ liệu (`REVOKE CONTROL`, `GRANT CONNECT`, `db_datareader`, `db_denydatawriter`, `DENY INSERT, UPDATE, DELETE, ALTER, EXECUTE`) trên tất cả Database SAP B1 của Server A, Server C, Server B.
3. [`02_Create_Windows_Limited_Agent_User.ps1`](file:///WORKSPACE_DIR/JavisOS/create%20user/02_Create_Windows_Limited_Agent_User.ps1): Script PowerShell tạo User Windows `sap_readonly_user` thuộc nhóm `Users`, `Performance Monitor Users`, `Event Log Readers` (không có quyền `Administrators`).
4. [`03_Run_All_OneClick_Setup.bat`](file:///WORKSPACE_DIR/JavisOS/create%20user/03_Run_All_OneClick_Setup.bat): Chạy 1-click (`Run as administrator`) để thiết lập đồng thời cả Windows User và SQL User trên Server A (hoặc bất kỳ server nào).
5. [`HUONG_DAN_TAO_USER_SQL_VA_WINDOWS_DUNG_CHUNG.md`](file:///WORKSPACE_DIR/JavisOS/create%20user/HUONG_DAN_TAO_USER_SQL_VA_WINDOWS_DUNG_CHUNG.md): Tài liệu hướng dẫn chi tiết.

---

## 2. Câu Lệnh Rút Gọn Tạo Trên Server A, Server C, Server B

### A. Chạy trên Server A (`10.0.0.10` - `SAP-SQL-SRV01` - Database `SBO_MAIN_PROD`)

**Bước 1 — Tạo Windows User `sap_readonly_user` (Mở PowerShell `Run as Administrator` trên Server A):**
```powershell
$u = "sap_readonly_user"
$p = ConvertTo-SecureString "CHANGE_ME_STRONG_RO_PASSWORD!" -AsPlainText -Force
if (!(Get-LocalUser -Name $u -ErrorAction SilentlyContinue)) {
    New-LocalUser -Name $u -Password $p -FullName "Enterprise AI Agent RO" -Description "Enterprise AI Agent Read-Only User" -PasswordNeverExpires -UserMayNotChangePassword
} else {
    Set-LocalUser -Name $u -Password $p -PasswordNeverExpires $true -UserMayNotChangePassword $true
    Enable-LocalUser -Name $u
}
@("Users", "Performance Monitor Users", "Event Log Readers") | ForEach-Object {
    Add-LocalGroupMember -Group $_ -Member $u -ErrorAction SilentlyContinue
}
Remove-LocalGroupMember -Group "Administrators" -Member $u -ErrorAction SilentlyContinue
```

**Bước 2 — Tạo/Chuẩn hóa SQL Read-Only User `sap_readonly_user` trên Server A (Chạy trong SSMS Server A):**
```sql
USE [master];
GO
IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = N'sap_readonly_user')
    CREATE LOGIN [sap_readonly_user] WITH PASSWORD = N'CHANGE_ME_STRONG_RO_PASSWORD!', DEFAULT_DATABASE = [SBO_MAIN_PROD], CHECK_EXPIRATION = OFF, CHECK_POLICY = OFF;
ELSE
    ALTER LOGIN [sap_readonly_user] WITH PASSWORD = N'CHANGE_ME_STRONG_RO_PASSWORD!', DEFAULT_DATABASE = [SBO_MAIN_PROD], CHECK_EXPIRATION = OFF, CHECK_POLICY = OFF;
ALTER LOGIN [sap_readonly_user] ENABLE;
GO

USE [SBO_MAIN_PROD];
GO
IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = N'sap_readonly_user')
    CREATE USER [sap_readonly_user] FOR LOGIN [sap_readonly_user];
ELSE
    ALTER USER [sap_readonly_user] WITH LOGIN = [sap_readonly_user];

REVOKE CONTROL TO [sap_readonly_user];
GRANT CONNECT TO [sap_readonly_user];
ALTER ROLE [db_datareader] ADD MEMBER [sap_readonly_user];
ALTER ROLE [db_denydatawriter] ADD MEMBER [sap_readonly_user];
GRANT VIEW DEFINITION TO [sap_readonly_user];
DENY INSERT, UPDATE, DELETE, ALTER, EXECUTE TO [sap_readonly_user];
GO
```

---

### B. Chạy trên Server C (`10.0.0.30` - Database `SBO_PLANT_C`) *(Đã chạy & test thành công 100%)*
```sql
USE [master];
GO
IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = N'sap_readonly_user')
    CREATE LOGIN [sap_readonly_user] WITH PASSWORD = N'CHANGE_ME_STRONG_RO_PASSWORD!', DEFAULT_DATABASE = [SBO_PLANT_C], CHECK_EXPIRATION = OFF, CHECK_POLICY = OFF;
ELSE
    ALTER LOGIN [sap_readonly_user] WITH PASSWORD = N'CHANGE_ME_STRONG_RO_PASSWORD!', DEFAULT_DATABASE = [SBO_PLANT_C], CHECK_EXPIRATION = OFF, CHECK_POLICY = OFF;
ALTER LOGIN [sap_readonly_user] ENABLE;
GO

USE [SBO_PLANT_C];
GO
IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = N'sap_readonly_user')
    CREATE USER [sap_readonly_user] FOR LOGIN [sap_readonly_user];
ELSE
    ALTER USER [sap_readonly_user] WITH LOGIN = [sap_readonly_user];

REVOKE CONTROL TO [sap_readonly_user];
GRANT CONNECT TO [sap_readonly_user];
ALTER ROLE [db_datareader] ADD MEMBER [sap_readonly_user];
ALTER ROLE [db_denydatawriter] ADD MEMBER [sap_readonly_user];
GRANT VIEW DEFINITION TO [sap_readonly_user];
DENY INSERT, UPDATE, DELETE, ALTER, EXECUTE TO [sap_readonly_user];
GO
```

---

### C. Chạy bổ sung trên Server B (`10.0.0.20` - Cấp thêm quyền cho Database `SBO_MFG_TRAIN`)
```sql
USE [SBO_MFG_TRAIN];
GO
IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = N'sap_readonly_user')
    CREATE USER [sap_readonly_user] FOR LOGIN [sap_readonly_user];
ELSE
    ALTER USER [sap_readonly_user] WITH LOGIN = [sap_readonly_user];

REVOKE CONTROL TO [sap_readonly_user];
GRANT CONNECT TO [sap_readonly_user];
ALTER ROLE [db_datareader] ADD MEMBER [sap_readonly_user];
ALTER ROLE [db_denydatawriter] ADD MEMBER [sap_readonly_user];
GRANT VIEW DEFINITION TO [sap_readonly_user];
DENY INSERT, UPDATE, DELETE, ALTER, EXECUTE TO [sap_readonly_user];
GO
```
