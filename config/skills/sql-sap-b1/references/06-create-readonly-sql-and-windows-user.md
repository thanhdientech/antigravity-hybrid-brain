# Thông Tin Kết Nối 4 Server (`24`, `52`, `160`, `27`), Tạo User Dùng Chung `sap_readonly_user` & Hướng Dẫn Test Query Khớp Số

Tất cả các máy chủ (`Server A`, `Server C`, `Server B`, `Server D` và các máy chủ mở rộng sau này) sử dụng **cùng 1 tài khoản & mật khẩu duy nhất** để cấp cho `ENTERPRISE AI AGENT`:

- **Username dùng chung (cả SQL & Windows):** `sap_readonly_user`
- **Password dùng chung (cả SQL & Windows):** `CHANGE_ME_STRONG_RO_PASSWORD!`
- **Quyền SQL Server:** `Read-Only 100%` (`SELECT` + `VIEW DEFINITION` + `db_datareader` + `db_denydatawriter`). Cấm tuyệt đối: `INSERT`, `UPDATE`, `DELETE`, `ALTER`, `DROP`, `TRUNCATE`, `EXECUTE`.
- **Quyền Windows Server:** `Standard Limited User` (Nhóm: `Users`, `Performance Monitor Users`, `Event Log Readers`).
- **Riêng Server A (`SBO_MAIN_PROD` - SAP 10.0):**
  - Kết nối SQL vẫn dùng `sap_readonly_user` (`Read-Only 100%`, không dùng `sa`).
  - Kết nối ghi dữ liệu vào SAP B1 đi qua **SAP Service Layer (`https://10.0.0.10:50000/b1s/v1`)** bằng tài khoản SAP **`<SL_USER>` / `<SL_PASSWORD>`** (`HTTP 200`).

---

## 1. Trạng Thái Kiểm Thử Thực Tế Trên 4 Server & Toàn Bộ Database Đã Mở (`HasAccess = 1`)

| Server | IP / Máy Chủ / SQL Instance | Công Ty & Phiên Bản SAP | Danh Sách Database Đã Mở (`HasAccess = 1`) |
| :--- | :--- | :--- | :--- |
| **[A] Server A** | IP: **`10.0.0.10`**<br>Machine/SQL: `SAP-SQL-SRV01` | Enterprise Demo Company<br>(SAP B1 10.0 Ver 1000330 + Beas + Service Layer `:50000`) | **10 DB:** `SBO_MAIN_PROD` *(Default DB)*, `SBO_MAIN_TRAIN`, `SBO_BRANCH_SUB`, `SBO_MFG_BACKUP2`, `SBO_MFG_BACKUP1`, `SBO_PERIODIC_INV`, `SBO_BRANCH_US`, `e_office`, `GLaccount`, `SBO-COMMON` |
| **[B] Server C** | IP: **`10.0.0.30`**<br>Machine: `SAP-VM-SRV03`<br>SQL: `SAP-SQL-SRV03` | MANUFACTURING PLANT C (DEMO)<br>(SAP B1 9.3 Ver 930100 + Beas) | **1 DB chính:** `SBO_PLANT_C` *(Default DB)* |
| **[C] Server B** | IP: **`10.0.0.20`**<br>Machine/SQL: `SAP-SQL-SRV02` | MANUFACTURING PLANT B (DEMO)<br>(SAP B1 9.3 + Beas) | **6 DB:**<br>1. `SBO_MFG_PLANT1` (`/160 hcm`)<br>2. `SBO_MFG_PROD` (`/160 lt`, *Default DB*)<br>3. `SBO_MFG_TRAIN` (`/160`)<br>4. `SBO-COMMON`<br>5. `SBO_MFG_ARCHIVE`<br>6. `SBO_MFG_TEST` |
| **[D] Server D** | IP: **`10.0.0.40`** *(RDP `:1433`)*<br>Machine: `SAP-SQL-SRV04`<br>SQL: `SAP-SQL-SRV04` | SAP-SQL-SRV04 / FURNITURE PLANT D (DEMO)<br>(SQL Server 2016 SP2 Enterprise + OpenVPN `CORP_VPN`) | **2 DB:**<br>1. `ECC` (`/27 ecc`, *Default DB*)<br>2. `SBO_PLANT_D_DEMO` (`/27 htl`) |

---

## 2. Quy Trình Bắt Buộc Khi Test Query & Đối Chiếu Khớp Số Liệu Với Người Dùng

Khi người dùng gửi câu lệnh SQL yêu cầu viết mới, thêm cột, tối ưu hoặc kiểm tra lỗi số liệu (`NULL`, lệch số lượng, lệch giá trị):

1. **Bước 1 — Xác định Database mục tiêu (Hỏi người dùng nếu muốn khớp số cụ thể):**
   - **Nếu người dùng muốn khớp số liệu cụ thể với màn hình SAP B1 / chứng từ của họ** mà chưa nói rõ đang kiểm tra trên Database nào:
     👉 **BẮT BUỘC HỎI NGƯỜI DÙNG muốn test/khớp số trên Server & Database nào** trong danh sách 4 Server / 19 Database ở Bảng Mục 1 (ví dụ: `SBO_MAIN_PROD`, `SBO_BRANCH_SUB`, `SBO_MFG_PLANT1`, `SBO_MFG_PROD`, `SBO_MFG_TRAIN`, `SBO_PLANT_C`, `ECC`, `SBO_PLANT_D_DEMO`...).
   - **Nếu chỉ kiểm tra cú pháp SQL & logic cột tiêu chuẩn SAP B1** (chưa cần khớp với một số chứng từ riêng biệt): Có thể chạy test nhanh trên Database mặc định của phân hệ liên quan (ví dụ `SBO_MAIN_PROD` trên Server A hoặc `SBO_MFG_PLANT1` trên Server B) và ghi rõ đã test trên DB nào.
2. **Bước 2 — Chạy thử Query thực tế bằng `sap_readonly_user` (`Exit code 0`):**
   - Dùng tài khoản Read-Only `sap_readonly_user` / `CHANGE_ME_STRONG_RO_PASSWORD!` kết nối tới Server & Database mục tiêu qua `pyodbc` hoặc `scripts/customer_profile_manager.py`.
   - Kiểm tra sự tồn tại của bảng/cột trong `INFORMATION_SCHEMA.COLUMNS` (đặc biệt các cột UDF `U_*`).
   - Thực thi câu query (`SELECT TOP ...` hoặc lọc theo `DocNum`/`DocEntry` cụ thể của người dùng) đạt **`Exit code 0`**.
3. **Bước 3 — Đọc kết quả trả về & Đối chiếu chéo nghiệp vụ SAP B1 (Read & Compare):**
   - Đọc trực tiếp các dòng dữ liệu trả về từ SQL và kiểm tra:
     - Có cột nào bị `NULL` bất thường do sai điều kiện `ON` (ví dụ nhầm `LineNum` với `BaseLine`, hoặc thiếu `ISNULL`) không?
     - Cột Số lượng còn lại (`OpenQty`) và Giá trị còn lại (`Open Value`) đã xử lý trường hợp dòng đóng (`LineStatus = 'C'`) hoặc kéo một phần số lượng trên chứng từ hàng hóa (`POR1`, `PDN1`, `RDR1`, `DLN1`) chưa?
     - Có bị nhân bản dòng (Duplicate Rows) khi `JOIN` với bảng Lô (`OITL`/`ITL1`/`OBTN`) hoặc bảng chứng từ đích/gốc nhiều dòng không?
   - Chỉ sau khi đọc kết quả thực tế và xác nhận khớp đúng 100% mới gửi câu lệnh SQL hoàn chỉnh cho người dùng.

---

## 3. Danh Sách 7 File Trong `<WORKSPACE_DIR>\JavisOS\create user\` (Đã Đồng Bộ Vào `scripts/`)

1. [`THONG_TIN_KET_NOI_USER_CAC_SERVER.txt`](file:///WORKSPACE_DIR/JavisOS/create%20user/THONG_TIN_KET_NOI_USER_CAC_SERVER.txt): Tổng hợp toàn bộ thông tin kết nối 4 Server (`24`, `52`, `160`, `27`), danh sách 19 DB đã mở (`HasAccess = 1`) và cấu hình OpenVPN Watchdog trên Server D.
2. [`01_Create_SQL_ReadOnly_Agent_User.sql`](file:///WORKSPACE_DIR/JavisOS/create%20user/01_Create_SQL_ReadOnly_Agent_User.sql): Script T-SQL tự động tạo Login/User `sap_readonly_user` chỉ đọc dữ liệu (`REVOKE CONTROL`, `GRANT CONNECT`, `db_datareader`, `db_denydatawriter`, `DENY INSERT, UPDATE, DELETE, ALTER, EXECUTE`) trên tất cả User Database của Server A, Server C, Server B, Server D.
3. [`02_Create_Windows_Limited_Agent_User.ps1`](file:///WORKSPACE_DIR/JavisOS/create%20user/02_Create_Windows_Limited_Agent_User.ps1): Script PowerShell tạo User Windows `sap_readonly_user` thuộc nhóm `Users`, `Performance Monitor Users`, `Event Log Readers`.
4. [`03_Run_All_OneClick_Setup.bat`](file:///WORKSPACE_DIR/JavisOS/create%20user/03_Run_All_OneClick_Setup.bat): Chạy 1-click (`Run as administrator`) để thiết lập đồng thời cả Windows User và SQL User.
5. [`04_Setup_Con27_ECC_HTL_And_OpenVPN.ps1`](file:///WORKSPACE_DIR/JavisOS/create%20user/04_Setup_Con27_ECC_HTL_And_OpenVPN.ps1): Script PowerShell chống Timeout & tự động kết nối lại OpenVPN (`CORP_VPN`) mỗi 1 phút qua Task Scheduler `Corp_VPN_AutoWatchdog` trên Server D (`10.0.0.40`).
6. [`04_Run_Con27_AntiTimeout_OpenVPN.bat`](file:///WORKSPACE_DIR/JavisOS/create%20user/04_Run_Con27_AntiTimeout_OpenVPN.bat): File `.bat` chạy nhanh thiết lập chống Timeout OpenVPN trên Server D.
7. [`HUONG_DAN_TAO_USER_SQL_VA_WINDOWS_DUNG_CHUNG.md`](file:///WORKSPACE_DIR/JavisOS/create%20user/HUONG_DAN_TAO_USER_SQL_VA_WINDOWS_DUNG_CHUNG.md): Tài liệu hướng dẫn chi tiết từng bước.
