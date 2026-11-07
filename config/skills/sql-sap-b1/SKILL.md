---
name: sql-sap-b1
description: "Kết nối 4 Server / 19 DB SAP B1 (24, 160, 52, 27), chạy SQL Read-Only khớp số thực, Service Layer & xuất file."
group: "ERP SAP B1 & SQL"
---

# SQL SAP B1 — Hệ Thống Kết Nối 4 Server (19 Database), Định Tuyến, Test Query Khớp Số & Truy Vấn Read-Only An Toàn

<!-- JAVIS_TRIGGER_ARCHIVE_START -->
## Khi nào dùng (Triggers & Ngữ cảnh kích hoạt đầy đủ)

> Hệ thống Kết nối, Định tuyến 4 Server / 19 Database SAP Business One (Con 24 infoasia56 + 9 DB, Con 160 FVIVN_PROD_TRAIN / FVIVN_GoLive_2024 / FVIVN_PROD + 3 DB, Con 52 PenflexPRD_NEW, Con 27 ECC / HTL_DEMO), Thực thi Truy vấn SQL Read-Only an toàn (infoasia_ro / InfoAsia@RO2026!), Test Query & So Sánh Khớp Số Thực Tế, Gọi SAP Service Layer REST API (Port 50000 trên Server 24) và Xuất Báo Cáo 3 Định Dạng (.xlsx, .pdf, .csv). TRIGGERS: "sql sap b1", "kết nối sql sap", "con 24", "/24", "/160", "/160 hcm", "/160 lt", "/52", "/27", "ecc", "htl_demo", "infoasia56", "fvivn_prod", "fvivn_golive_2024", "fvivn_prod_train", "penflexprd_new", "infoasia_ro", "truy vấn sap b1", "test query sap", "xuất báo cáo sap".
<!-- JAVIS_TRIGGER_ARCHIVE_END -->

Skill này cung cấp bộ công cụ thực thi và tài liệu cấu hình kết nối **MS SQL Server Read-Only (`infoasia_ro` / `InfoAsia@RO2026!`)** cùng **SAP B1 10.0 Service Layer (`:50000`)** trên toàn bộ 4 hệ thống máy chủ SAP Business One (`Con 24`, `Con 52`, `Con 160`, `Con 27`) của **InfoAsia** (đồng bộ từ `E:\DIEN APP\JavisOS\create user`).

---

## 1. Quy Tắc Số 1 (Bất Biến): Bảng Định Tuyến 7 Route Chính & Toàn Bộ 19 Database Đã Mở (`HasAccess = 1`)

- **Tài khoản dùng chung trên cả 4 Server (`24`, `52`, `160`, `27`):**
  - **SQL Login & Windows User:** `infoasia_ro`
  - **Password dùng chung:** `InfoAsia@RO2026!`
  - **Quyền SQL Server:** `Read-Only 100%` (`SELECT` + `VIEW DEFINITION` + `db_datareader` + `db_denydatawriter`; cấm tuyệt đối `INSERT, UPDATE, DELETE, ALTER, DROP, TRUNCATE, EXECUTE`).

### 1.1. Bảng Định Tuyến Cú Pháp Chuẩn
| STT | Cú pháp câu hỏi của người dùng | Mã Hồ Sơ (`customer_id`) | Máy Chủ & Database Đích (+ Các DB mở rộng đã cấp quyền) | Phiên bản & Quyền hạn | Dòng Thông Báo Mở Đầu Bắt Buộc |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **Hỏi tự do (không có `/`)** hoặc **`/24 ...`** | `infoasia56` (Alias: `24`, `/24`, `default`) | **Con 24 (`192.168.42.24` - `INFOASIASAP24`)**<br>- DB chính: **`infoasia56`**<br>- 9 DB khác đã mở: `infoasia56_train`, `FUDA`, `FVIVN_GO_BK`, `FVIVN_PROD_BK`, `Infoasia_Periodic_Inventory`, `Infoasia_USA`, `e_office`, `GLaccount`, `SBO-COMMON` | **SAP B1 10.0 + Beas**<br>- SQL: Read-Only (`infoasia_ro`)<br>- Ghi vào SAP: **Service Layer `:50000` (`manager` / `12341234`)** | **`Em đang trả kết quả từ con 24 (infoasia56).`** |
| **2** | **`/160 <câu hỏi>`** *(mặc định của `/160`)* | `fvivn_train` (Alias: `160`, `/160`) | **Con 160 (`192.168.42.160` - `INFOASIASAP03`)**<br>- DB: **`FVIVN_PROD_TRAIN`**<br>- 3 DB phụ trên Con 160: `SBO-COMMON`, `Z_FVIV_PROD_0H0308`, `ZTEST_HCM_772026` | **SAP B1 9.3 + Beas**<br>- SQL: Read-Only (`infoasia_ro`)<br>- Không có quyền ghi | **`Em đang trả kết quả từ con 160 (FVIVN_PROD_TRAIN).`** |
| **3** | **`/160 HCM <câu hỏi>`** | `fvivn_hcm` (Alias: `160 HCM`, `/160 HCM`) | **Con 160 (`192.168.42.160` - `INFOASIASAP03`)**<br>- DB: **`FVIVN_GoLive_2024`** | **SAP B1 9.3 + Beas**<br>- SQL: Read-Only (`infoasia_ro`)<br>- Không có quyền ghi | **`Em đang trả kết quả từ con 160 HCM.`** |
| **4** | **`/160 LT <câu hỏi>`** | `fvivn_lt` (Alias: `160 LT`, `/160 LT`) | **Con 160 (`192.168.42.160` - `INFOASIASAP03`)**<br>- DB: **`FVIVN_PROD`** *(Default DB Con 160)* | **SAP B1 9.3 + Beas**<br>- SQL: Read-Only (`infoasia_ro`)<br>- Không có quyền ghi | **`Em đang trả kết quả từ con 160 LT.`** |
| **5** | **`/52 <câu hỏi>`** | `penflex_52` (Alias: `52`, `/52`) | **Con 52 (`192.168.42.52` - `WIN-TTRG9UMG3IU`)**<br>- DB: **`PenflexPRD_NEW`** | **SAP B1 9.3 + Beas**<br>- SQL: Read-Only (`infoasia_ro`)<br>- Không có quyền ghi | **`Em đang trả kết quả từ con 52 (PenflexPRD_NEW).`** |
| **6** | **`/27 <câu hỏi>`** hoặc **`/27 ECC <câu hỏi>`** | `ecc_27` (Alias: `27`, `/27`, `ecc`) | **Con 27 (`192.168.42.27` - `DATAHTL` / `WIN-4QNMP6LH9HI`)**<br>- DB: **`ECC`** *(Default DB Con 27)* | **SQL Server 2016**<br>- SQL: Read-Only (`infoasia_ro`)<br>- OpenVPN Watchdog: `HTL_VPN` | **`Em đang trả kết quả từ con 27 (ECC).`** |
| **7** | **`/27 HTL <câu hỏi>`** | `htl_demo_27` (Alias: `/27 HTL`, `htl_demo`) | **Con 27 (`192.168.42.27` - `DATAHTL` / `WIN-4QNMP6LH9HI`)**<br>- DB: **`HTL_DEMO`** *(HTL FURNITURE VIETNAM)* | **SAP B1 9.3**<br>- SQL: Read-Only (`infoasia_ro`)<br>- OpenVPN Watchdog: `HTL_VPN` | **`Em đang trả kết quả từ con 27 (HTL_DEMO).`** |
| **8** | **`/buwon`** hoặc **`/41`** | `buwon_41` | **Con 41 (`192.168.42.41`)**<br>- DB: **`BUWON`** | **SAP B1 10.0**<br>- SQL: Read-Only (`infoasia_ro`) | **`Em đang trả kết quả từ con 41 (BUWON).`** |
| **9** | **`/buwon mes`** hoặc **`/41 mes`** | `buwon_mes_41` | **Con 41 (`192.168.42.41`)**<br>- DB: **`Buwon_mes`** | **SAP B1 10.0**<br>- SQL: Read-Only (`infoasia_ro`) | **`Em đang trả kết quả từ con 41 (Buwon_mes).`** |
| **10** | **`/exit`** / **`/out`** / **`/reset`** | `infoasia56` | **Thoát khỏi session hiện tại, quay về Server 24** | **SAP B1 10.0 + Beas** | **`🔔 Đã thoát khỏi session của <Tên Server cũ>, quay về mặc định Con 24 (infoasia56).`** |

---

### 1.2. Chốt Chặn Quản Lý Session & Thông Báo Thoát Session Bắt Buộc (Session Exit Notification Gate)
1. **Nguyên Tắc Mặc Định Bất Biến (Default Ground Truth):**
   - Khi người dùng hỏi bình thường, hỏi tự do, KHÔNG có tiền tố cú pháp `/160`, `/52`, `/27`, `/buwon` $\rightarrow$ **BẮT BUỘC 100% PHẢI VÀO SERVER 24 (`192.168.42.24` - Database `infoasia56`)**.
   - Tuyệt đối KHÔNG được tự ý "nhớ ngữ cảnh" của lượt chat trước đó để tiếp tục truy vấn vào Con 160 LT (`FVIVN_PROD`) hay Con 52 nếu câu hỏi hiện tại người dùng không gõ cú pháp `/160` hay `/52`!
2. **Cơ Chế Báo Thoát Session Khi Rời Khỏi Database Cũ:**
   - Nếu ở lượt chat trước người dùng đang truy vấn vào một Server riêng biệt (ví dụ Con 160 LT, Con 160 HCM, Con 52, Con 27):
   - Ngay khi người dùng:
     - Gõ lệnh thoát: `/exit`, `/out`, `/reset`, `/quit`, hoặc `/24`.
     - Hoặc gửi một câu hỏi mới mà **KHÔNG CÒN GẮN LỆNH CÚ PHÁP SERVER ĐÓ NỮA**:
   - $\rightarrow$ AI **BẮT BUỘC PHẢI THOÁT KHỎI SESSION CỦA DATA ĐÓ**, VÀ **BẮT BUỘC IN DÒNG THÔNG BÁO THOÁT SESSION NGAY ĐẦU CÂU TRẢ LỜI**:
     `🔔 Đã thoát khỏi session của Con 160 LT (FVIVN_PROD), quay về mặc định Con 24 (infoasia56).`
     *(Sau đó hiển thị dòng banner chuẩn của Con 24: `Em đang trả kết quả từ con 24 (infoasia56).`)*
3. **Verify Độ An Toàn Dữ Liệu (Read-Only 100% Data Safety):**
   - **Tài khoản SQL:** 100% các Server sử dụng chung tài khoản `infoasia_ro` / `InfoAsia@RO2026!` thuộc role `db_datareader` và bị khóa cứng `db_denydatawriter`.
   - **Bộ lọc bảo mật mềm (Application Level):** Chặn đứng 100% các câu lệnh chứa từ khóa `INSERT`, `UPDATE`, `DELETE`, `DROP`, `ALTER`, `TRUNCATE`, `CREATE`, `EXEC`, `EXECUTE`, `MERGE` trên bảng thật.
   - **Ghi dữ liệu an toàn:** Chỉ duy nhất Server 24 được phép ghi thông qua **SAP Service Layer REST API (`:50000`)** bằng tài khoản `manager`, đi qua toàn bộ cơ chế validation và logic nghiệp vụ chuẩn của hãng SAP B1.

---

## 2. Quy Trình Bắt Buộc Khi Test Query & Đọc Kết Quả So Sánh Khớp Số Liệu

Khi người dùng gửi câu lệnh SQL yêu cầu viết mới, sửa lỗi, thêm cột hoặc đối chiếu số liệu:

1. **Quy tắc Hỏi Database cần test khi người dùng muốn khớp số:**
   - **Nếu người dùng muốn khớp số liệu thực tế với màn hình SAP B1 / chứng từ của họ** (mà chưa nói rõ đang xem trên Database nào):
     👉 **BẮT BUỘC HỎI NGƯỜI DÙNG muốn test và khớp số trên Server / Database nào** trong các Server đã kết nối (`Con 24: infoasia56 / FUDA...`, `Con 160: FVIVN_GoLive_2024 / FVIVN_PROD / FVIVN_PROD_TRAIN`, `Con 52: PenflexPRD_NEW`, `Con 27: ECC / HTL_DEMO`).
   - **Nếu chỉ kiểm tra cú pháp & logic cột chuẩn SAP B1** (không yêu cầu khớp một chứng từ riêng biệt): Có thể test nhanh trên Database mặc định của phân hệ liên quan và báo rõ đã chạy thử trên Database nào.
2. **Chạy thử Query Read-Only (`infoasia_ro`) & Đọc kết quả so sánh (Test & Compare Loop):**
   - Kết nối vào Server / Database đích bằng `infoasia_ro` / `InfoAsia@RO2026!`.
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
| **01** | `references/01-routing-5-servers-and-readonly-security.md` | Chi tiết quy tắc định tuyến các route, cách gọi Service Layer `:50000` trên Con 24, bảng ánh xạ 7 nhóm báo cáo chuẩn SSMS và quy tắc xuất 3 file (`.xlsx`, `.pdf`, `.csv`). |
| **02** | `references/02-sap-b1-database-guide.md` | Hướng dẫn tra cứu nhanh các bảng cốt lõi trong Database SAP B1 (`OITM`, `OCRD`, `ORDR`, `ODLN`, `OINV`, `OPOR`, `OPDN`, `OPCH`, `OJDT`, `OINM`). |
| **03** | `references/03-sap-b1-skill-master.md` | Kiến trúc hệ thống SAP B1 (SQL Server vs HANA), Service Layer OData v3/v4, DI API & phương pháp xử lý lỗi kết nối (Error 1001, 1003, -1, 1012). |
| **04** | `references/04-so-tay-sap-b1-sql-va-server-vps.md` | Sổ tay tra cứu nhanh `ObjType`, công thức nối chuỗi chứng từ và quản trị vận hành Server/VPS chạy SAP B1. |
| **05** | `references/05-sql-sap-b1-project-journey.md` | Kiến trúc dự án `E:\DIEN APP\SQL SAP B1`, cấu hình `config.json`, cơ chế đồng bộ query và xuất báo cáo đa định dạng. |
| **06** | `references/06-create-readonly-sql-and-windows-user.md` | Thông tin kết nối chi tiết 4 Server / 19 Database (`24`, `52`, `160`, `27`), quy trình Test Query khớp số và mã lệnh tạo tài khoản `infoasia_ro` + OpenVPN Watchdog Con 27. |

---

## 4. Cách Sử Dụng Bộ Công Cụ Thực Thi (`scripts/`)

1. **Quản lý Profile & Truy vấn trực tiếp qua CLI (`scripts/customer_profile_manager.py`)**:
   - Liệt kê danh sách các hồ sơ kết nối:
     ```powershell
     python "C:\Users\INFOASIA\.gemini\config\skills\sql-sap-b1\scripts\customer_profile_manager.py" list
     ```
   - Kiểm tra kết nối tới một hồ sơ (`24`, `/160`, `/160 HCM`, `/160 LT`, `/52`, `/27`, `/27 HTL`):
     ```powershell
     python "C:\Users\INFOASIA\.gemini\config\skills\sql-sap-b1\scripts\customer_profile_manager.py" test --id "24"
     ```
   - Chạy câu lệnh `SELECT` Read-Only và kiểm tra kết quả:
     ```powershell
     python "C:\Users\INFOASIA\.gemini\config\skills\sql-sap-b1\scripts\customer_profile_manager.py" query --id "/160 HCM" --sql "SELECT TOP 10 ItemCode, ItemName, OnHand FROM OITM ORDER BY OnHand DESC"
     ```
2. **Thông tin kết nối & Script thiết lập `infoasia_ro` (Đồng bộ từ `E:\DIEN APP\JavisOS\create user`)**:
   - Thông tin kết nối 4 Server / 19 DB: `scripts/THONG_TIN_KET_NOI_USER_CAC_SERVER.txt`
   - Script SQL tạo user Read-Only: `scripts/01_Create_SQL_ReadOnly_Agent_User.sql`
   - Script Windows Limited User: `scripts/02_Create_Windows_Limited_Agent_User.ps1`
   - One-click Setup: `scripts/03_Run_All_OneClick_Setup.bat`
   - Chống Timeout OpenVPN Con 27 (`HTL_VPN`): `scripts/04_Setup_Con27_ECC_HTL_And_OpenVPN.ps1` & `scripts/04_Run_Con27_AntiTimeout_OpenVPN.bat`


---

## 5. Quy Tắc Bắt Buộc: Tự Động Lưu File `.md` Câu Hỏi & Câu Trả Lời Theo Database

Mỗi lần người dùng hỏi về SAP B1 / Beas / SQL và AI trả lời kết quả, **BẮT BUỘC** tự động lưu lại 1 file `.md` để tra cứu lâu dài:
1. **Đường dẫn thư mục phân loại theo Database:**
   `e:\DIEN APP\SQL SAP B1\Lich_Su_Hoi_Dap_SQL\<Ten_Database>_Con<Server>\<Ten_Query_Hoac_Cau_Hoi>.md`
2. **Cấu trúc bắt buộc trong file `.md`:**
   - Tiêu đề trên cùng: **Tên Query / Chủ đề Câu hỏi**.
   - Ghi rõ **Database áp dụng / kiểm chứng (kèm IP Server)**, **Phân hệ SAP B1**, **Ngày lưu**.
   - Phần 1 (`❓ 1. Câu Hỏi Của Anh`): Nội dung câu hỏi / yêu cầu gốc.
   - Phần 2 (`✅ 2. Câu Trả Lời & Code SQL Hoàn Chỉnh`): Giải thích + Toàn bộ Code SQL đã kiểm thử + Kết quả mẫu.
3. **Cập nhật Mục lục & Gửi Link:**
   - Thêm dòng tra cứu vào `e:\DIEN APP\SQL SAP B1\Lich_Su_Hoi_Dap_SQL\00_DANH_MUC_TRA_CUU.md` và gửi link bấm mở file `.md` ở cuối câu trả lời.
