# Hướng Dẫn Tạo User SQL & User Windows Dùng Chung Cho `INFOASIA AI AGENT`

Tất cả các máy chủ (`Con 24`, `Con 52`, `Con 160` và các máy chủ mở rộng sau này) sử dụng **cùng 1 tài khoản & mật khẩu duy nhất** để cấp cho `INFOASIA AI AGENT`:

- **Username dùng chung (cả SQL & Windows):** `infoasia_ro`
- **Password dùng chung (cả SQL & Windows):** `InfoAsia@RO2026!`
- **Riêng Con 24 (`infoasia56` - SAP 10.0):**
  - Kết nối SQL vẫn dùng `infoasia_ro` (`Read-Only 100%`, không dùng `sa`).
  - Kết nối ghi dữ liệu vào SAP B1 đi qua **SAP Service Layer (`https://192.168.42.24:50000/b1s/v1`)** bằng tài khoản SAP **`manager`**.
- **Các máy còn lại (`Con 52`, `Con 160` - SAP 9.3):**
  - Chạy **100% Read-Only SQL (`infoasia_ro`)**, khóa cứng `INSERT`, `UPDATE`, `DELETE`, `ALTER`, `EXEC`.

---

## 1. Danh Sách File Trong `e:\DIEN APP\JavisOS\create user\` & Trạng Thái Kiểm Thử

- **Con 24 (`192.168.42.24` - Máy `INFOASIASAP24`, DB `infoasia56` - `Infoasia Demo Company`, SAP 10.0 + Beas):**
  - **SQL Read-Only (`infoasia_ro`):** Đã test kết nối & truy vấn `SELECT` thành công 100% (`HasAccess = 1` trên `infoasia56`) + **SAP Service Layer (`:50000`)** `connected (HTTP 200)`.
  - **Windows User (`infoasia_ro`) & mở rộng các DB phụ trên Con 24:** Chạy file `03_Run_All_OneClick_Setup.bat` (`Run as administrator`) hoặc chạy lệnh PowerShell/SQL ở Mục 2.A bên dưới.
- **Con 52 (`192.168.42.52` - Máy `WIN-TTRG9UMG3IU` / `PENFLEX-VN-VM`, DB `PenflexPRD_NEW` - `PENFLEX VIETNAM CO.,LTD`, SAP 9.3 + Beas):**
  - **Đã hoàn tất 100% cả Windows User & SQL Read-Only User `infoasia_ro` / `InfoAsia@RO2026!`** (`HasAccess = 1`, chặn cứng `UPDATE` với `Error 229`).
- **Con 160 (`192.168.42.160` - Máy `INFOASIASAP03`, SAP 9.3 + Beas):**
  - **Đã test thành công 100%** trên `FVIVN_GoLive_2024` (`/160 hcm`) và `FVIVN_PROD` (`/160 lt`) (`HasAccess = 1`). Riêng `FVIVN_PROD_TRAIN` chạy thêm Mục 2.C bên dưới.

Danh sách 5 file trong thư mục **`e:\DIEN APP\JavisOS\create user\`**:
1. [`THONG_TIN_KET_NOI_USER_CAC_SERVER.txt`](file:///e:/DIEN%20APP/JavisOS/create%20user/THONG_TIN_KET_NOI_USER_CAC_SERVER.txt): File `.txt` tổng hợp toàn bộ thông tin kết nối, tài khoản, trạng thái test và lệnh copy-paste nhanh.
2. [`01_Create_SQL_ReadOnly_Agent_User.sql`](file:///e:/DIEN%20APP/JavisOS/create%20user/01_Create_SQL_ReadOnly_Agent_User.sql): Script T-SQL tự động tạo Login/User `infoasia_ro` chỉ đọc dữ liệu (`REVOKE CONTROL`, `GRANT CONNECT`, `db_datareader`, `db_denydatawriter`, `DENY INSERT, UPDATE, DELETE, ALTER, EXECUTE`) trên tất cả Database SAP B1 của Con 24, Con 52, Con 160.
3. [`02_Create_Windows_Limited_Agent_User.ps1`](file:///e:/DIEN%20APP/JavisOS/create%20user/02_Create_Windows_Limited_Agent_User.ps1): Script PowerShell tạo User Windows `infoasia_ro` thuộc nhóm `Users`, `Performance Monitor Users`, `Event Log Readers` (không có quyền `Administrators`).
4. [`03_Run_All_OneClick_Setup.bat`](file:///e:/DIEN%20APP/JavisOS/create%20user/03_Run_All_OneClick_Setup.bat): Chạy 1-click (`Run as administrator`) để thiết lập đồng thời cả Windows User và SQL User trên Con 24 (hoặc bất kỳ server nào).
5. [`HUONG_DAN_TAO_USER_SQL_VA_WINDOWS_DUNG_CHUNG.md`](file:///e:/DIEN%20APP/JavisOS/create%20user/HUONG_DAN_TAO_USER_SQL_VA_WINDOWS_DUNG_CHUNG.md): Tài liệu hướng dẫn chi tiết.

---

## 2. Câu Lệnh Rút Gọn Tạo Trên Con 24, Con 52, Con 160

### A. Chạy trên Con 24 (`192.168.42.24` - `INFOASIASAP24` - Database `infoasia56`)

**Bước 1 — Tạo Windows User `infoasia_ro` (Mở PowerShell `Run as Administrator` trên Con 24):**
```powershell
$u = "infoasia_ro"
$p = ConvertTo-SecureString "InfoAsia@RO2026!" -AsPlainText -Force
if (!(Get-LocalUser -Name $u -ErrorAction SilentlyContinue)) {
    New-LocalUser -Name $u -Password $p -FullName "InfoAsia AI Agent RO" -Description "InfoAsia AI Agent Read-Only User" -PasswordNeverExpires -UserMayNotChangePassword
} else {
    Set-LocalUser -Name $u -Password $p -PasswordNeverExpires $true -UserMayNotChangePassword $true
    Enable-LocalUser -Name $u
}
@("Users", "Performance Monitor Users", "Event Log Readers") | ForEach-Object {
    Add-LocalGroupMember -Group $_ -Member $u -ErrorAction SilentlyContinue
}
Remove-LocalGroupMember -Group "Administrators" -Member $u -ErrorAction SilentlyContinue
```

**Bước 2 — Tạo/Chuẩn hóa SQL Read-Only User `infoasia_ro` trên Con 24 (Chạy trong SSMS Con 24):**
```sql
USE [master];
GO
IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = N'infoasia_ro')
    CREATE LOGIN [infoasia_ro] WITH PASSWORD = N'InfoAsia@RO2026!', DEFAULT_DATABASE = [infoasia56], CHECK_EXPIRATION = OFF, CHECK_POLICY = OFF;
ELSE
    ALTER LOGIN [infoasia_ro] WITH PASSWORD = N'InfoAsia@RO2026!', DEFAULT_DATABASE = [infoasia56], CHECK_EXPIRATION = OFF, CHECK_POLICY = OFF;
ALTER LOGIN [infoasia_ro] ENABLE;
GO

USE [infoasia56];
GO
IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = N'infoasia_ro')
    CREATE USER [infoasia_ro] FOR LOGIN [infoasia_ro];
ELSE
    ALTER USER [infoasia_ro] WITH LOGIN = [infoasia_ro];

REVOKE CONTROL TO [infoasia_ro];
GRANT CONNECT TO [infoasia_ro];
ALTER ROLE [db_datareader] ADD MEMBER [infoasia_ro];
ALTER ROLE [db_denydatawriter] ADD MEMBER [infoasia_ro];
GRANT VIEW DEFINITION TO [infoasia_ro];
DENY INSERT, UPDATE, DELETE, ALTER, EXECUTE TO [infoasia_ro];
GO
```

---

### B. Chạy trên Con 52 (`192.168.42.52` - Database `PenflexPRD_NEW`) *(Đã chạy & test thành công 100%)*
```sql
USE [master];
GO
IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = N'infoasia_ro')
    CREATE LOGIN [infoasia_ro] WITH PASSWORD = N'InfoAsia@RO2026!', DEFAULT_DATABASE = [PenflexPRD_NEW], CHECK_EXPIRATION = OFF, CHECK_POLICY = OFF;
ELSE
    ALTER LOGIN [infoasia_ro] WITH PASSWORD = N'InfoAsia@RO2026!', DEFAULT_DATABASE = [PenflexPRD_NEW], CHECK_EXPIRATION = OFF, CHECK_POLICY = OFF;
ALTER LOGIN [infoasia_ro] ENABLE;
GO

USE [PenflexPRD_NEW];
GO
IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = N'infoasia_ro')
    CREATE USER [infoasia_ro] FOR LOGIN [infoasia_ro];
ELSE
    ALTER USER [infoasia_ro] WITH LOGIN = [infoasia_ro];

REVOKE CONTROL TO [infoasia_ro];
GRANT CONNECT TO [infoasia_ro];
ALTER ROLE [db_datareader] ADD MEMBER [infoasia_ro];
ALTER ROLE [db_denydatawriter] ADD MEMBER [infoasia_ro];
GRANT VIEW DEFINITION TO [infoasia_ro];
DENY INSERT, UPDATE, DELETE, ALTER, EXECUTE TO [infoasia_ro];
GO
```

---

### C. Chạy bổ sung trên Con 160 (`192.168.42.160` - Cấp thêm quyền cho Database `FVIVN_PROD_TRAIN`)
```sql
USE [FVIVN_PROD_TRAIN];
GO
IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = N'infoasia_ro')
    CREATE USER [infoasia_ro] FOR LOGIN [infoasia_ro];
ELSE
    ALTER USER [infoasia_ro] WITH LOGIN = [infoasia_ro];

REVOKE CONTROL TO [infoasia_ro];
GRANT CONNECT TO [infoasia_ro];
ALTER ROLE [db_datareader] ADD MEMBER [infoasia_ro];
ALTER ROLE [db_denydatawriter] ADD MEMBER [infoasia_ro];
GRANT VIEW DEFINITION TO [infoasia_ro];
DENY INSERT, UPDATE, DELETE, ALTER, EXECUTE TO [infoasia_ro];
GO
```
