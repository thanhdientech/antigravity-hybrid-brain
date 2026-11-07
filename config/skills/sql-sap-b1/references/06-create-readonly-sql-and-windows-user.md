# Thông Tin Kết Nối 4 Server (`24`, `52`, `160`, `27`), Tạo User Dùng Chung `infoasia_ro` & Hướng Dẫn Test Query Khớp Số

Tất cả các máy chủ (`Con 24`, `Con 52`, `Con 160`, `Con 27` và các máy chủ mở rộng sau này) sử dụng **cùng 1 tài khoản & mật khẩu duy nhất** để cấp cho `INFOASIA AI AGENT`:

- **Username dùng chung (cả SQL & Windows):** `infoasia_ro`
- **Password dùng chung (cả SQL & Windows):** `InfoAsia@RO2026!`
- **Quyền SQL Server:** `Read-Only 100%` (`SELECT` + `VIEW DEFINITION` + `db_datareader` + `db_denydatawriter`). Cấm tuyệt đối: `INSERT`, `UPDATE`, `DELETE`, `ALTER`, `DROP`, `TRUNCATE`, `EXECUTE`.
- **Quyền Windows Server:** `Standard Limited User` (Nhóm: `Users`, `Performance Monitor Users`, `Event Log Readers`).
- **Riêng Con 24 (`infoasia56` - SAP 10.0):**
  - Kết nối SQL vẫn dùng `infoasia_ro` (`Read-Only 100%`, không dùng `sa`).
  - Kết nối ghi dữ liệu vào SAP B1 đi qua **SAP Service Layer (`https://192.168.42.24:50000/b1s/v1`)** bằng tài khoản SAP **`manager` / `12341234`** (`HTTP 200`).

---

## 1. Trạng Thái Kiểm Thử Thực Tế Trên 4 Server & Toàn Bộ Database Đã Mở (`HasAccess = 1`)

| Server | IP / Máy Chủ / SQL Instance | Công Ty & Phiên Bản SAP | Danh Sách Database Đã Mở (`HasAccess = 1`) |
| :--- | :--- | :--- | :--- |
| **[A] Con 24** | IP: **`192.168.42.24`**<br>Machine/SQL: `INFOASIASAP24` | Infoasia Demo Company<br>(SAP B1 10.0 Ver 1000330 + Beas + Service Layer `:50000`) | **10 DB:** `infoasia56` *(Default DB)*, `infoasia56_train`, `FUDA`, `FVIVN_GO_BK`, `FVIVN_PROD_BK`, `Infoasia_Periodic_Inventory`, `Infoasia_USA`, `e_office`, `GLaccount`, `SBO-COMMON` |
| **[B] Con 52** | IP: **`192.168.42.52`**<br>Machine: `PENFLEX-VN-VM`<br>SQL: `WIN-TTRG9UMG3IU` | PENFLEX VIETNAM CO.,LTD<br>(SAP B1 9.3 Ver 930100 + Beas) | **1 DB chính:** `PenflexPRD_NEW` *(Default DB)* |
| **[C] Con 160** | IP: **`192.168.42.160`**<br>Machine/SQL: `INFOASIASAP03` | FREUDENBERG & VILENE INTERNATIONAL VIETNAM<br>(SAP B1 9.3 + Beas) | **6 DB:**<br>1. `FVIVN_GoLive_2024` (`/160 hcm`)<br>2. `FVIVN_PROD` (`/160 lt`, *Default DB*)<br>3. `FVIVN_PROD_TRAIN` (`/160`)<br>4. `SBO-COMMON`<br>5. `Z_FVIV_PROD_0H0308`<br>6. `ZTEST_HCM_772026` |
| **[D] Con 27** | IP: **`192.168.42.27`** *(RDP `:4227`)*<br>Machine: `DATAHTL`<br>SQL: `WIN-4QNMP6LH9HI` | DATAHTL / HTL FURNITURE VIETNAM<br>(SQL Server 2016 SP2 Enterprise + OpenVPN `HTL_VPN`) | **2 DB:**<br>1. `ECC` (`/27 ecc`, *Default DB*)<br>2. `HTL_DEMO` (`/27 htl`) |

---

## 2. Quy Trình Bắt Buộc Khi Test Query & Đối Chiếu Khớp Số Liệu Với Người Dùng

Khi người dùng gửi câu lệnh SQL yêu cầu viết mới, thêm cột, tối ưu hoặc kiểm tra lỗi số liệu (`NULL`, lệch số lượng, lệch giá trị):

1. **Bước 1 — Xác định Database mục tiêu (Hỏi người dùng nếu muốn khớp số cụ thể):**
   - **Nếu người dùng muốn khớp số liệu cụ thể với màn hình SAP B1 / chứng từ của họ** mà chưa nói rõ đang kiểm tra trên Database nào:
     👉 **BẮT BUỘC HỎI NGƯỜI DÙNG muốn test/khớp số trên Server & Database nào** trong danh sách 4 Server / 19 Database ở Bảng Mục 1 (ví dụ: `infoasia56`, `FUDA`, `FVIVN_GoLive_2024`, `FVIVN_PROD`, `FVIVN_PROD_TRAIN`, `PenflexPRD_NEW`, `ECC`, `HTL_DEMO`...).
   - **Nếu chỉ kiểm tra cú pháp SQL & logic cột tiêu chuẩn SAP B1** (chưa cần khớp với một số chứng từ riêng biệt): Có thể chạy test nhanh trên Database mặc định của phân hệ liên quan (ví dụ `infoasia56` trên Con 24 hoặc `FVIVN_GoLive_2024` trên Con 160) và ghi rõ đã test trên DB nào.
2. **Bước 2 — Chạy thử Query thực tế bằng `infoasia_ro` (`Exit code 0`):**
   - Dùng tài khoản Read-Only `infoasia_ro` / `InfoAsia@RO2026!` kết nối tới Server & Database mục tiêu qua `pyodbc` hoặc `scripts/customer_profile_manager.py`.
   - Kiểm tra sự tồn tại của bảng/cột trong `INFORMATION_SCHEMA.COLUMNS` (đặc biệt các cột UDF `U_*`).
   - Thực thi câu query (`SELECT TOP ...` hoặc lọc theo `DocNum`/`DocEntry` cụ thể của người dùng) đạt **`Exit code 0`**.
3. **Bước 3 — Đọc kết quả trả về & Đối chiếu chéo nghiệp vụ SAP B1 (Read & Compare):**
   - Đọc trực tiếp các dòng dữ liệu trả về từ SQL và kiểm tra:
     - Có cột nào bị `NULL` bất thường do sai điều kiện `ON` (ví dụ nhầm `LineNum` với `BaseLine`, hoặc thiếu `ISNULL`) không?
     - Cột Số lượng còn lại (`OpenQty`) và Giá trị còn lại (`Open Value`) đã xử lý trường hợp dòng đóng (`LineStatus = 'C'`) hoặc kéo một phần số lượng trên chứng từ hàng hóa (`POR1`, `PDN1`, `RDR1`, `DLN1`) chưa?
     - Có bị nhân bản dòng (Duplicate Rows) khi `JOIN` với bảng Lô (`OITL`/`ITL1`/`OBTN`) hoặc bảng chứng từ đích/gốc nhiều dòng không?
   - Chỉ sau khi đọc kết quả thực tế và xác nhận khớp đúng 100% mới gửi câu lệnh SQL hoàn chỉnh cho người dùng.

---

## 3. Danh Sách 7 File Trong `e:\DIEN APP\JavisOS\create user\` (Đã Đồng Bộ Vào `scripts/`)

1. [`THONG_TIN_KET_NOI_USER_CAC_SERVER.txt`](file:///e:/DIEN%20APP/JavisOS/create%20user/THONG_TIN_KET_NOI_USER_CAC_SERVER.txt): Tổng hợp toàn bộ thông tin kết nối 4 Server (`24`, `52`, `160`, `27`), danh sách 19 DB đã mở (`HasAccess = 1`) và cấu hình OpenVPN Watchdog trên Con 27.
2. [`01_Create_SQL_ReadOnly_Agent_User.sql`](file:///e:/DIEN%20APP/JavisOS/create%20user/01_Create_SQL_ReadOnly_Agent_User.sql): Script T-SQL tự động tạo Login/User `infoasia_ro` chỉ đọc dữ liệu (`REVOKE CONTROL`, `GRANT CONNECT`, `db_datareader`, `db_denydatawriter`, `DENY INSERT, UPDATE, DELETE, ALTER, EXECUTE`) trên tất cả User Database của Con 24, Con 52, Con 160, Con 27.
3. [`02_Create_Windows_Limited_Agent_User.ps1`](file:///e:/DIEN%20APP/JavisOS/create%20user/02_Create_Windows_Limited_Agent_User.ps1): Script PowerShell tạo User Windows `infoasia_ro` thuộc nhóm `Users`, `Performance Monitor Users`, `Event Log Readers`.
4. [`03_Run_All_OneClick_Setup.bat`](file:///e:/DIEN%20APP/JavisOS/create%20user/03_Run_All_OneClick_Setup.bat): Chạy 1-click (`Run as administrator`) để thiết lập đồng thời cả Windows User và SQL User.
5. [`04_Setup_Con27_ECC_HTL_And_OpenVPN.ps1`](file:///e:/DIEN%20APP/JavisOS/create%20user/04_Setup_Con27_ECC_HTL_And_OpenVPN.ps1): Script PowerShell chống Timeout & tự động kết nối lại OpenVPN (`HTL_VPN`) mỗi 1 phút qua Task Scheduler `InfoAsia_OpenVPN_AutoWatchdog_1Min` trên Con 27 (`192.168.42.27`).
6. [`04_Run_Con27_AntiTimeout_OpenVPN.bat`](file:///e:/DIEN%20APP/JavisOS/create%20user/04_Run_Con27_AntiTimeout_OpenVPN.bat): File `.bat` chạy nhanh thiết lập chống Timeout OpenVPN trên Con 27.
7. [`HUONG_DAN_TAO_USER_SQL_VA_WINDOWS_DUNG_CHUNG.md`](file:///e:/DIEN%20APP/JavisOS/create%20user/HUONG_DAN_TAO_USER_SQL_VA_WINDOWS_DUNG_CHUNG.md): Tài liệu hướng dẫn chi tiết từng bước.
