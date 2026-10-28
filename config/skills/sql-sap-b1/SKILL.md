---
name: sql-sap-b1
description: "K?t n?i, ??nh tuy?n ?a m?y ch? SAP B1, ch?y SQL Read-Only kh?p s? th?c t?, g?i Service Layer & xu?t b?o c?o."
group: "ERP SAP B1 & SQL"
---

# SQL SAP B1 — Hệ Thống Kết Nối 4 Server (19 Database), Định Tuyến, Test Query Khớp Số & Truy Vấn Read-Only An Toàn

<!-- JAVIS_TRIGGER_ARCHIVE_START -->
## Khi nào dùng (Triggers & Ngữ cảnh kích hoạt đầy đủ)

> Hệ thống Kết nối, Định tuyến 4 Server / 19 Database SAP Business One (Server A SBO_MAIN_PROD + 9 DB, Server B SBO_MFG_TRAIN / SBO_MFG_PLANT1 / SBO_MFG_PROD + 3 DB, Server C SBO_PLANT_C, Server D ECC / SBO_PLANT_D_DEMO), Thực thi Truy vấn SQL Read-Only an toàn (sap_readonly_user / CHANGE_ME_STRONG_RO_PASSWORD!), Test Query & So Sánh Khớp Số Thực Tế, Gọi SAP Service Layer REST API (Port 50000 trên Server 24) và Xuất Báo Cáo 3 Định Dạng (.xlsx, .pdf, .csv). TRIGGERS: "sql sap b1", "kết nối sql sap", "Server A", "/24", "/160", "/160 hcm", "/160 lt", "/52", "/27", "ecc", "SBO_PLANT_D_DEMO", "SBO_MAIN_PROD", "SBO_MFG_PROD", "SBO_MFG_PLANT1", "SBO_MFG_TRAIN", "SBO_PLANT_C", "sap_readonly_user", "truy vấn sap b1", "test query sap", "xuất báo cáo sap".
<!-- JAVIS_TRIGGER_ARCHIVE_END -->

Skill này cung cấp bộ công cụ thực thi và tài liệu cấu hình kết nối **MS SQL Server Read-Only (`sap_readonly_user` / `CHANGE_ME_STRONG_RO_PASSWORD!`)** cùng **SAP B1 10.0 Service Layer (`:50000`)** trên toàn bộ 4 hệ thống máy chủ SAP Business One (`Server A`, `Server C`, `Server B`, `Server D`) của **Enterprise** (đồng bộ từ `<WORKSPACE_DIR>\JavisOS\create user`).

---

## 1. Quy Tắc Số 1 (Bất Biến): Bảng Định Tuyến 7 Route Chính & Toàn Bộ 19 Database Đã Mở (`HasAccess = 1`)

- **Tài khoản dùng chung trên cả 4 Server (`24`, `52`, `160`, `27`):**
  - **SQL Login & Windows User:** `sap_readonly_user`
  - **Password dùng chung:** `CHANGE_ME_STRONG_RO_PASSWORD!`
  - **Quyền SQL Server:** `Read-Only 100%` (`SELECT` + `VIEW DEFINITION` + `db_datareader` + `db_denydatawriter`; cấm tuyệt đối `INSERT, UPDATE, DELETE, ALTER, DROP, TRUNCATE, EXECUTE`).

### 1.1. Bảng Định Tuyến Cú Pháp Chuẩn
| STT | Cú pháp câu hỏi của người dùng | Mã Hồ Sơ (`customer_id`) | Máy Chủ & Database Đích (+ Các DB mở rộng đã cấp quyền) | Phiên bản & Quyền hạn | Dòng Thông Báo Mở Đầu Bắt Buộc |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **Hỏi tự do (không có `/`)** hoặc **`/24 ...`** | `SBO_MAIN_PROD` (Alias: `24`, `/24`, `default`) | **Server A (`10.0.0.10` - `SAP-SQL-SRV01`)**<br>- DB chính: **`SBO_MAIN_PROD`**<br>- 9 DB khác đã mở: `SBO_MAIN_TRAIN`, `SBO_BRANCH_SUB`, `SBO_MFG_BACKUP2`, `SBO_MFG_BACKUP1`, `SBO_PERIODIC_INV`, `SBO_BRANCH_US`, `e_office`, `GLaccount`, `SBO-COMMON` | **SAP B1 10.0 + Beas**<br>- SQL: Read-Only (`sap_readonly_user`)<br>- Ghi vào SAP: **Service Layer `:50000` (`<SL_USER>` / `<SL_PASSWORD>`)** | **`Em đang trả kết quả từ Server A (SBO_MAIN_PROD).`** |
| **2** | **`/160 <câu hỏi>`** *(mặc định của `/160`)* | `SBO_MFG_TRAIN` (Alias: `160`, `/160`) | **Server B (`10.0.0.20` - `SAP-SQL-SRV02`)**<br>- DB: **`SBO_MFG_TRAIN`**<br>- 3 DB phụ trên Server B: `SBO-COMMON`, `SBO_MFG_ARCHIVE`, `SBO_MFG_TEST` | **SAP B1 9.3 + Beas**<br>- SQL: Read-Only (`sap_readonly_user`)<br>- Không có quyền ghi | **`Em đang trả kết quả từ Server B (SBO_MFG_TRAIN).`** |
| **3** | **`/160 HCM <câu hỏi>`** | `SBO_MFG_PLANT1` (Alias: `160 HCM`, `/160 HCM`) | **Server B (`10.0.0.20` - `SAP-SQL-SRV02`)**<br>- DB: **`SBO_MFG_PLANT1`** | **SAP B1 9.3 + Beas**<br>- SQL: Read-Only (`sap_readonly_user`)<br>- Không có quyền ghi | **`Em đang trả kết quả từ Server B HCM.`** |
| **4** | **`/160 LT <câu hỏi>`** | `SBO_MFG_PROD` (Alias: `160 LT`, `/160 LT`) | **Server B (`10.0.0.20` - `SAP-SQL-SRV02`)**<br>- DB: **`SBO_MFG_PROD`** *(Default DB Server B)* | **SAP B1 9.3 + Beas**<br>- SQL: Read-Only (`sap_readonly_user`)<br>- Không có quyền ghi | **`Em đang trả kết quả từ Server B LT.`** |
| **5** | **`/52 <câu hỏi>`** | `SBO_PLANT_C` (Alias: `52`, `/52`) | **Server C (`10.0.0.30` - `SAP-SQL-SRV03`)**<br>- DB: **`SBO_PLANT_C`** | **SAP B1 9.3 + Beas**<br>- SQL: Read-Only (`sap_readonly_user`)<br>- Không có quyền ghi | **`Em đang trả kết quả từ Server C (SBO_PLANT_C).`** |
| **6** | **`/27 <câu hỏi>`** hoặc **`/27 ECC <câu hỏi>`** | `SBO_PLANT_D_MAIN` (Alias: `27`, `/27`, `ecc`) | **Server D (`10.0.0.40` - `SAP-SQL-SRV04` / `SAP-SQL-SRV04`)**<br>- DB: **`ECC`** *(Default DB Server D)* | **SQL Server 2016**<br>- SQL: Read-Only (`sap_readonly_user`)<br>- OpenVPN Watchdog: `CORP_VPN` | **`Em đang trả kết quả từ Server D (ECC).`** |
| **7** | **`/27 HTL <câu hỏi>`** | `SBO_PLANT_D_DEMO` (Alias: `/27 HTL`, `SBO_PLANT_D_DEMO`) | **Server D (`10.0.0.40` - `SAP-SQL-SRV04` / `SAP-SQL-SRV04`)**<br>- DB: **`SBO_PLANT_D_DEMO`** *(FURNITURE PLANT D (DEMO))* | **SAP B1 9.3**<br>- SQL: Read-Only (`sap_readonly_user`)<br>- OpenVPN Watchdog: `CORP_VPN` | **`Em đang trả kết quả từ Server D (SBO_PLANT_D_DEMO).`** |
| **8** | **`/SBO_ERP_E`** hoặc **`/41`** | `SBO_ERP_E` | **Server E (`10.0.0.50`)**<br>- DB: **`SBO_ERP_E`** | **SAP B1 10.0**<br>- SQL: Read-Only (`sap_readonly_user`) | **`Em đang trả kết quả từ Server E (SBO_ERP_E).`** |
| **9** | **`/SBO_ERP_E mes`** hoặc **`/41 mes`** | `SBO_MES_DB` | **Server E (`10.0.0.50`)**<br>- DB: **`SBO_MES_DB`** | **SAP B1 10.0**<br>- SQL: Read-Only (`sap_readonly_user`) | **`Em đang trả kết quả từ Server E (SBO_MES_DB).`** |
| **10** | **`/exit`** / **`/out`** / **`/reset`** | `SBO_MAIN_PROD` | **Thoát khỏi session hiện tại, quay về Server 24** | **SAP B1 10.0 + Beas** | **`🔔 Đã thoát khỏi session của <Tên Server cũ>, quay về mặc định Server A (SBO_MAIN_PROD).`** |

---

### 1.2. Chốt Chặn Quản Lý Session & Thông Báo Thoát Session Bắt Buộc (Session Exit Notification Gate)
1. **Nguyên Tắc Mặc Định Bất Biến (Default Ground Truth):**
   - Khi người dùng hỏi bình thường, hỏi tự do, KHÔNG có tiền tố cú pháp `/160`, `/52`, `/27`, `/SBO_ERP_E` $\rightarrow$ **BẮT BUỘC 100% PHẢI VÀO SERVER 24 (`10.0.0.10` - Database `SBO_MAIN_PROD`)**.
   - Tuyệt đối KHÔNG được tự ý "nhớ ngữ cảnh" của lượt chat trước đó để tiếp tục truy vấn vào Server B LT (`SBO_MFG_PROD`) hay Server C nếu câu hỏi hiện tại người dùng không gõ cú pháp `/160` hay `/52`!
2. **Cơ Chế Báo Thoát Session Khi Rời Khỏi Database Cũ:**
   - Nếu ở lượt chat trước người dùng đang truy vấn vào một Server riêng biệt (ví dụ Server B LT, Server B HCM, Server C, Server D):
   - Ngay khi người dùng:
     - Gõ lệnh thoát: `/exit`, `/out`, `/reset`, `/quit`, hoặc `/24`.
     - Hoặc gửi một câu hỏi mới mà **KHÔNG CÒN GẮN LỆNH CÚ PHÁP SERVER ĐÓ NỮA**:
   - $\rightarrow$ AI **BẮT BUỘC PHẢI THOÁT KHỎI SESSION CỦA DATA ĐÓ**, VÀ **BẮT BUỘC IN DÒNG THÔNG BÁO THOÁT SESSION NGAY ĐẦU CÂU TRẢ LỜI**:
     `🔔 Đã thoát khỏi session của Server B LT (SBO_MFG_PROD), quay về mặc định Server A (SBO_MAIN_PROD).`
     *(Sau đó hiển thị dòng banner chuẩn của Server A: `Em đang trả kết quả từ Server A (SBO_MAIN_PROD).`)*
3. **Verify Độ An Toàn Dữ Liệu (Read-Only 100% Data Safety):**
   - **Tài khoản SQL:** 100% các Server sử dụng chung tài khoản `sap_readonly_user` / `CHANGE_ME_STRONG_RO_PASSWORD!` thuộc role `db_datareader` và bị khóa cứng `db_denydatawriter`.
   - **Bộ lọc bảo mật mềm (Application Level):** Chặn đứng 100% các câu lệnh chứa từ khóa `INSERT`, `UPDATE`, `DELETE`, `DROP`, `ALTER`, `TRUNCATE`, `CREATE`, `EXEC`, `EXECUTE`, `MERGE` trên bảng thật.
   - **Ghi dữ liệu an toàn:** Chỉ duy nhất Server 24 được phép ghi thông qua **SAP Service Layer REST API (`:50000`)** bằng tài khoản `manager`, đi qua toàn bộ cơ chế validation và logic nghiệp vụ chuẩn của hãng SAP B1.

---

## 2. Quy Trình Bắt Buộc Khi Test Query & Đọc Kết Quả So Sánh Khớp Số Liệu

Khi người dùng gửi câu lệnh SQL yêu cầu viết mới, sửa lỗi, thêm cột hoặc đối chiếu số liệu:

1. **Quy tắc Hỏi Database cần test khi người dùng muốn khớp số:**
   - **Nếu người dùng muốn khớp số liệu thực tế với màn hình SAP B1 / chứng từ của họ** (mà chưa nói rõ đang xem trên Database nào):
     👉 **BẮT BUỘC HỎI NGƯỜI DÙNG muốn test và khớp số trên Server / Database nào** trong các Server đã kết nối (`Server A: SBO_MAIN_PROD / SBO_BRANCH_SUB...`, `Server B: SBO_MFG_PLANT1 / SBO_MFG_PROD / SBO_MFG_TRAIN`, `Server C: SBO_PLANT_C`, `Server D: ECC / SBO_PLANT_D_DEMO`).
   - **Nếu chỉ kiểm tra cú pháp & logic cột chuẩn SAP B1** (không yêu cầu khớp một chứng từ riêng biệt): Có thể test nhanh trên Database mặc định của phân hệ liên quan và báo rõ đã chạy thử trên Database nào.
2. **Chạy thử Query Read-Only (`sap_readonly_user`) & Đọc kết quả so sánh (Test & Compare Loop):**
   - Kết nối vào Server / Database đích bằng `sap_readonly_user` / `CHANGE_ME_STRONG_RO_PASSWORD!`.
   - Kiểm tra tên cột (đặc biệt các cột UDF `U_*`) trong `INFORMATION_SCHEMA.COLUMNS`.
   - Chạy thử câu lệnh SQL (`SELECT TOP ...` hoặc lọc theo `DocNum`/`DocEntry` người dùng cung cấp) đạt **`Exit code 0`**.
   - **Đọc kỹ kết quả trả về và so sánh chéo giữa các cột** để phát hiện sớm các bẫy dữ liệu SAP B1 trước khi trả lời:
     - Kiểm tra các cột bị `NULL` do nối sai khóa (`LineNum` vs `BaseLine`, hoặc thiếu `ISNULL`).
     - Kiểm tra cột Số lượng còn lại (`OpenQty`) & Giá trị còn lại (`Open Value`): Trên bảng dòng chứng từ hàng hóa (`PDN1`, `POR1`, `DLN1`, `RDR1`), khi dòng đã đóng (`LineStatus = 'C'`) hoặc kéo từ Reserve Invoice, cần xử lý `CASE WHEN LineStatus = 'C' THEN 0 ELSE OpenQty END` và tính `Open Value` theo tỷ lệ `(OpenQty / Quantity) * LineTotal` (vì `OpenSum` không tự giảm khi kéo một phần số lượng mặt hàng).
     - Kiểm tra có bị nhân bản dòng (Duplicate Rows) khi `LEFT JOIN` sang bảng Lô (`OITL`/`ITL1`/`OBTN`) hoặc chứng từ đích không.

---

## 3. Bảng Điều Hướng Nạp Thông Minh (Smart-Loading Reference Index)

Chỉ đọc (`read_file`) file tham chiếu cần thiết trong `references/`:

| STT | File trong `references/` | Khi nào cần nạp (Trigger / Chủ đề) |
| :--- | :--- | :--- |
| **01** | `references/01-routing-5-servers-and-readonly-security.md` | Chi tiết quy tắc định tuyến các route, cách gọi Service Layer `:50000` trên Server A, bảng ánh xạ 7 nhóm báo cáo chuẩn SSMS và quy tắc xuất 3 file (`.xlsx`, `.pdf`, `.csv`). |
| **02** | `references/02-sap-b1-database-guide.md` | Hướng dẫn tra cứu nhanh các bảng cốt lõi trong Database SAP B1 (`OITM`, `OCRD`, `ORDR`, `ODLN`, `OINV`, `OPOR`, `OPDN`, `OPCH`, `OJDT`, `OINM`). |
| **03** | `references/03-sap-b1-skill-master.md` | Kiến trúc hệ thống SAP B1 (SQL Server vs HANA), Service Layer OData v3/v4, DI API & phương pháp xử lý lỗi kết nối (Error 1001, 1003, -1, 1012). |
| **04** | `references/04-so-tay-sap-b1-sql-va-server-vps.md` | Sổ tay tra cứu nhanh `ObjType`, công thức nối chuỗi chứng từ và quản trị vận hành Server/VPS chạy SAP B1. |
| **05** | `references/05-sql-sap-b1-project-journey.md` | Kiến trúc dự án `<WORKSPACE_DIR>\SQL SAP B1`, cấu hình `config.json`, cơ chế đồng bộ query và xuất báo cáo đa định dạng. |
| **06** | `references/06-create-readonly-sql-and-windows-user.md` | Thông tin kết nối chi tiết 4 Server / 19 Database (`24`, `52`, `160`, `27`), quy trình Test Query khớp số và mã lệnh tạo tài khoản `sap_readonly_user` + OpenVPN Watchdog Server D. |

---

## 4. Cách Sử Dụng Bộ Công Cụ Thực Thi (`scripts/`)

1. **Quản lý Profile & Truy vấn trực tiếp qua CLI (`scripts/customer_profile_manager.py`)**:
   - Liệt kê danh sách các hồ sơ kết nối:
     ```powershell
     python "%USERPROFILE%\.gemini\config\skills\sql-sap-b1\scripts\customer_profile_manager.py" list
     ```
   - Kiểm tra kết nối tới một hồ sơ (`24`, `/160`, `/160 HCM`, `/160 LT`, `/52`, `/27`, `/27 HTL`):
     ```powershell
     python "%USERPROFILE%\.gemini\config\skills\sql-sap-b1\scripts\customer_profile_manager.py" test --id "24"
     ```
   - Chạy câu lệnh `SELECT` Read-Only và kiểm tra kết quả:
     ```powershell
     python "%USERPROFILE%\.gemini\config\skills\sql-sap-b1\scripts\customer_profile_manager.py" query --id "/160 HCM" --sql "SELECT TOP 10 ItemCode, ItemName, OnHand FROM OITM ORDER BY OnHand DESC"
     ```
2. **Thông tin kết nối & Script thiết lập `sap_readonly_user` (Đồng bộ từ `<WORKSPACE_DIR>\JavisOS\create user`)**:
   - Thông tin kết nối 4 Server / 19 DB: `scripts/THONG_TIN_KET_NOI_USER_CAC_SERVER.txt`
   - Script SQL tạo user Read-Only: `scripts/01_Create_SQL_ReadOnly_Agent_User.sql`
   - Script Windows Limited User: `scripts/02_Create_Windows_Limited_Agent_User.ps1`
   - One-click Setup: `scripts/03_Run_All_OneClick_Setup.bat`
   - Chống Timeout OpenVPN Server D (`CORP_VPN`): `scripts/04_Setup_Con27_ECC_HTL_And_OpenVPN.ps1` & `scripts/04_Run_Con27_AntiTimeout_OpenVPN.bat`
