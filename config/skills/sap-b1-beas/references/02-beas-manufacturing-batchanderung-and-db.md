---
type: source
source_kind: article
status: processed
created: '2026-10-18'
processed_at: '2026-10-18'
url: 'https://help.beascloud.com/beas202206/index.html?batchanderung.htm'
wiki_links:
  - '[[cam-nang-sap-b1-93-10-sql-va-beas-manufacturing]]'
---
# BOYUM IT BEAS MANUFACTURING: CHỨC NĂNG THAY ĐỔI ĐỊNH MỨC HÀNG LOẠT (BATCH CHANGES - BATCHANDERUNG.HTM) & KIẾN TRÚC DATABASE SẢN XUẤT

Tài liệu kỹ thuật chuyên sâu chuẩn hóa từ tài liệu chính thức của Boyum IT Beas Manufacturing (`https://help.beascloud.com/beas202206/index.html?batchanderung.htm`, Window `artikel_stlpos_batch.psr`) và cấu trúc cơ sở dữ liệu sản xuất Beas trên MS SQL Server dành cho đội ngũ Tư vấn & Kỹ sư **InfoAsia**.

---

## 1. CHỨC NĂNG THAY ĐỔI ĐỊNH MỨC BOM HÀNG LOẠT (BILL OF MATERIALS - BATCH CHANGES / `batchanderung.htm`)

Khi doanh nghiệp sản xuất cần thay thế một nguyên vật liệu cũ bằng nguyên vật liệu mới, cập nhật định mức tiêu hao, thêm phụ gia mới hoặc xóa một bán thành phẩm ngừng sử dụng trên **hàng trăm công thức BOM (`BEAS_STL_HEADER` / `BEAS_STL`) cùng lúc**, kỹ sư InfoAsia hướng dẫn khách hàng sử dụng công cụ **BoM Batch changes** thay vì sửa thủ công từng mã.

### 1.1. Đường Dẫn Truy Cập & Thông Tin Cửa Sổ Kỹ Thuật
- **Đường dẫn Menu trên Beas / SAP B1:**
  - `Inventory` -> `Bill of materials` -> Chọn mặt hàng hoặc mở danh sách BOM -> Nhấn chuột phải (`Right-click`) -> Chọn **`Bill of Materials: Batch changes`**.
  - Hoặc truy cập từ phân hệ `Production` / `Master Data` -> `Bill of Materials` -> `BoM Batch change`.
- **Tên cửa sổ kỹ thuật (Beas Window Name):** **`artikel_stlpos_batch.psr`**.
- **Hỗ trợ Quản lý Phiên bản (`Version-controlled items` - từ Beas 9.3 PL2 trở lên):**
  - Cửa sổ `artikel_stlpos_batch.psr` hỗ trợ cập nhật hàng loạt cho cả các mặt hàng có quản lý nhiều phiên bản định mức (`Revision / Version` riêng biệt trong `BEAS_STL`).
  - Hệ thống hiển thị cột **`Version`** riêng trên lưới kết quả.
  - **Lưu ý quan trọng (`IMPORTANT`):** Nếu một mặt hàng có nhiều Version nhưng một số Version được liên kết trực tiếp về định nghĩa gốc (`linked to the main definition`), các dòng này chỉ hiển thị **1 lần duy nhất** tại dòng định nghĩa chính (không hiển thị số Version) để tránh cập nhật trùng.

### 1.2. Bốn Chế Độ Thao Tác Cốt Lõi (4 Core Functions / Tabs)

Các tab phía trên và thanh chuyển đổi (`Switch`) ở dưới đáy cửa sổ `artikel_stlpos_batch.psr` cung cấp 4 chức năng tương đương:

| Tab / Chức năng | Ý nghĩa & Cơ chế hoạt động trên Database (`BEAS_STL`) |
| :--- | :--- |
| **1. `Selection` (Bộ lọc tìm kiếm)** | Thiết lập điều kiện lọc các BOM bị ảnh hưởng theo: **Mã mặt hàng thành phẩm/bán thành phẩm (`Item number`)**, **Nhóm hàng (`Item group`)**, **Mã tìm kiếm (`Match code`)**. Hỗ trợ các toán tử lọc linh hoạt trên trường nguyên vật liệu: `"Only material no."` (Chỉ đúng mã NVL), `"contains"` (Chứa chuỗi), hoặc `"contains not"` (Không chứa chuỗi). |
| **2. `Substitute` (Thay thế / Cập nhật hàng loạt)** | Ở khung bên phải: Hiển thị danh sách các vị trí dòng BOM (`BoM positions`) chứa mã nguyên vật liệu gốc cần thay thế. Ở khung bên trái: Nhập thông tin mới cho các trường muốn thay đổi (Mã nguyên vật liệu mới, Số lượng định mức mới, Diễn giải bổ sung, Trạng thái Active, các trường UDF...). Nhấn **`Start`** để thực thi thay thế hàng loạt trên các dòng đã tích chọn **`OK`**. |
| **3. `Add` (Thêm / Chèn nguyên vật liệu hàng loạt)** | Chọn nguyên vật liệu mới cần thêm vào các BOM. Khi chọn xong, danh sách các BOM chứa nguyên vật liệu mốc (đã lọc trước đó) sẽ hiển thị. Khung bên trái cho phép cấu hình thông tin dòng mới: nối thêm vào cuối BOM (**`Append`**) hoặc chèn vào đúng vị trí chỉ định (**`Position`** - lưu ý nếu chèn trùng vị trí mà không bật Append thì dòng tại vị trí đó sẽ bị thay thế). |
| **4. `Delete` (Xóa nguyên vật liệu hàng loạt)** | Hiển thị toàn bộ các dòng BOM đang chứa mã nguyên vật liệu cần loại bỏ. Người dùng kiểm tra, tích chọn các dòng cần xóa khỏi danh sách và nhấn **`Start`** để xóa hàng loạt khỏi `BEAS_STL`. |

### 1.3. Chi Tiết Các Trường Điều Khiển Trên Tab `Substitute` (Thay Thế)

| Tên trường (Field) | Mô tả chi tiết & Lưu ý Kỹ thuật Bắt buộc |
| :--- | :--- |
| **`Material number`** | Chọn mã nguyên vật liệu mới (`ART1_ID`) sẽ thay thế cho mã nguyên vật liệu cũ trong các BOM được chọn. |
| **`Quantity`** | Nhập số lượng định mức mới (`MENGE_VERBRAUCH` / `MENGE`).<br>**CẢNH BÁO KỸ THUẬT QUAN TRỌNG:** Khi thay đổi `Quantity` bằng chức năng Batch Changes, **hệ số quy đổi đơn vị (`Conversion factors`) sẽ KHÔNG được tính đến**. Số lượng nhập vào đây luôn tính theo **Đơn vị sản xuất (`Production unit`)**, và các hệ số quy đổi đã lưu trước đó sang Đơn vị nhập (`Input Unit`) và Đơn vị kho (`Warehouse Unit`) sẽ bị xóa trắng: cụ thể 3 cột **`beas_stl.input_qty`**, **`beas_stl.input_factor`**, **`beas_stl.input_unit`** sẽ bị xóa (`deleted/cleared`). Kỹ sư triển khai phải nhắc khách hàng kiểm tra kỹ đơn vị tính trước khi chạy! |
| **`Quantity per`** | Số lượng thành phẩm cơ sở (`Requirement per assembly` - `MENGE_JE`, ví dụ: định mức tính cho `1` cái hay `1.000` cái thành phẩm). |
| **`Additional text`** | Văn bản ghi chú bổ sung (`Free text`) trên dòng BOM. |
| **`Active` (Ô tích Trái & Phải)** | Có 2 ô checkbox cạnh nhau:<br>- **Ô bên trái (`Left box`):** Tích chọn để báo cho hệ thống biết bạn **muốn thay đổi** tham số trạng thái Active trong đợt chạy Batch này.<br>- **Ô bên phải (`Right check box`):** Tích chọn để bật dòng BOM thành **Đang hoạt động (`Active`)**; bỏ tích để chuyển dòng BOM thành **Ngưng hoạt động (`Inactive`)**. |
| **`UDF` (`UDF1`..`UDF4`)** | Các trường tự định nghĩa của Beas trên dòng BOM (được đặt tên hiển thị trong `Configuration wizard` -> `BoM position setup`). |
| **`Ok` (Cột chọn dòng)** | Sau khi lọc danh sách BOM ở khung bên phải, tích chọn cột **`OK`** tại các dòng BOM muốn áp dụng thay đổi rồi nhấn nút **`Start`**. |

### 1.4. Chi Tiết Các Trường Điều Khiển Trên Tab `Add` (Thêm Mới Hàng Loạt)

| Tên trường (Function) | Mô tả chi tiết |
| :--- | :--- |
| **`Append`** | Tích chọn (`Activate check box`) để nối nguyên vật liệu mới vào **cuối danh sách BOM** (hệ thống tự động gán `POS_ID` kế tiếp lớn nhất). |
| **`Position`** | Chỉ định số thứ tự vị trí (`POS_ID` / `SortId`) muốn chèn dòng nguyên vật liệu mới vào trong BOM. |
| **`Material number`** | Mã nguyên vật liệu mới cần thêm vào các BOM. |
| **`Quantity` & `Quantity per`** | Số lượng định mức tiêu hao và số lượng cơ sở (`Quantity per assembly`). |
| **`Additional text`** | Ghi chú kỹ thuật cho dòng nguyên vật liệu mới. |
| **`Active`** | Xác định dòng nguyên vật liệu mới thêm vào sẽ ở trạng thái `Active` hay `Inactive`. |
| **`empty fields UDF`** | Điền giá trị cho các trường tự định nghĩa (`UDF`) trên dòng BOM mới. |

### 1.5. Các Nút Lệnh (Buttons), Kiểm Soát `Locked Work Orders` & Lịch Sử `Change Log`
- **`All select`:** Chọn tất cả các dòng BOM trong danh sách kết quả (bật toàn bộ cột `OK`).
- **`none select`:** Bỏ chọn toàn bộ các dòng trong danh sách (xóa toàn bộ cột `OK`).
- **`Start`:** Bước 1: Lọc và hiển thị toàn bộ các dòng BOM bị ảnh hưởng. Bước 2: Sau khi đã tích chọn `OK` các dòng cần tác động, nhấn **`Start`** lần nữa để thực thi thay thế / thêm / xóa hàng loạt.
- **Xem Lịch sử Thay đổi (`Right-click -> Change Log`):**
  - Nhấp chuột phải vào bất kỳ dòng BOM nào trên lưới và chọn **`Change Log`** để mở cửa sổ nhật ký thay đổi (`activitylog.htm`), truy vết rõ User nào (`ANDUSER`) đã sửa mã NVL, số lượng cũ/mới vào ngày giờ nào (`ANDTSTAMP`).
- **Kiểm tra Lệnh sản xuất đang khóa (`Locked / Active Work Orders`):**
  - Lưu ý quan trọng: Chức năng `Batch changes` (`batchanderung.htm`) tác động trực tiếp lên **BOM Master Data (`BEAS_STL_HEADER` / `BEAS_STL`)**. Đối với các Lệnh sản xuất (`BEAS_FTHAUPT` / `BEAS_FTSTL`) đã được phát hành (`Released`) hoặc đang khóa (`Locked`) dưới xưởng, cấu trúc BOM của lệnh đã được sao chép độc lập sang bảng `BEAS_FTSTL`. Do đó, nếu muốn cập nhật cả các Lệnh sản xuất đang mở, kỹ sư cần kiểm tra danh sách lệnh đang mở chứa mã NVL đó bằng SQL trước khi thực hiện.

---

## 2. KIẾN TRÚC BẢNG DỮ LIỆU BOYUM IT BEAS MANUFACTURING TRÊN MS SQL SERVER

Tên bảng trong Beas tuân theo quy tắc ghép từ tiếng Đức: **`BEAS_` + `[Mã Phân Hệ]` + `[Cấp Bậc Bảng]`**.

### 2.1. Sơ Đồ 12 Bảng Dữ Liệu Lõi Của Beas Manufacturing

| Phân hệ | Tên bảng SQL | Ý nghĩa Nghiệp vụ | Khóa chính (Primary Key) | Liên kết (JOIN) chính |
| :--- | :--- | :--- | :--- | :--- |
| **Engineering (Dữ liệu chủ Kỹ thuật)** | **`BEAS_STL_HEADER`** | Thông tin chung Định mức nguyên vật liệu chuẩn (BOM Header) | `ItemCode` | Nối `OITM.ItemCode` |
| **Engineering** | **`BEAS_STL`** | Chi tiết dòng nguyên vật liệu trong BOM chuẩn (BOM Positions), bao gồm cả `Version`, `Alternative Item`, `Phantom`, `input_qty`, `input_factor`, `input_unit` | `ItemCode`, `POS_ID` | Nối `BEAS_STL_HEADER.ItemCode` và `OITM.ItemCode` (qua `ART1_ID`) |
| **Engineering** | **`BEAS_APL_HEADER`** | Thông tin chung Quy trình công nghệ chuẩn (Routing Header) | `ItemCode` | Nối `OITM.ItemCode` |
| **Engineering** | **`BEAS_APL`** | Chi tiết các công đoạn sản xuất chuẩn (Routing Positions): thời gian chuẩn bị máy (`RUESTZEIT`), thời gian gia công (`BEARBEITUNGSZEIT`) | `ItemCode`, `POS_ID` | Nối `BEAS_APLATZ.APLATZ_ID` và `BEAS_AG.AG_ID` |
| **Engineering** | **`BEAS_APLATZ`** | Danh mục Máy móc / Trạm làm việc / Nguồn lực (Work Center / Resource) & Đơn giá chi phí giờ máy/nhân công | `APLATZ_ID` | Nối `BEAS_APL.APLATZ_ID`, `BEAS_FTAPL.APLATZ_ID` |
| **Work Order (Sản xuất)** | **`BEAS_FTHAUPT`** | Thông tin chung Lệnh sản xuất Beas (Work Order Header) | `BELNR_ID` | Nối `ORDR.DocEntry` (nếu sinh từ SO), `OCRD.CardCode` (`KND_ID`) |
| **Work Order** | **`BEAS_FTPOS`** | Chi tiết các Vị trí mặt hàng (Thành phẩm & Bán thành phẩm đa cấp) cần sản xuất trong Lệnh | `BELNR_ID`, `BELPOS_ID` | Nối `BEAS_FTHAUPT.BELNR_ID` và `OITM.ItemCode` |
| **Work Order** | **`BEAS_FTSTL`** | Chi tiết Nguyên vật liệu (Work Order BOM) cần xuất và đã xuất thực tế cho từng vị trí lệnh | `BELNR_ID`, `BELPOS_ID`, `POS_ID` | Nối `BEAS_FTPOS` (`BELNR_ID`, `BELPOS_ID`) và `OIGE/IGE1` |
| **Work Order** | **`BEAS_FTAPL`** | Chi tiết Công đoạn gia công (Work Order Routing) của từng vị trí lệnh | `BELNR_ID`, `BELPOS_ID`, `POS_ID` | Nối `BEAS_FTPOS` (`BELNR_ID`, `BELPOS_ID`) và `BEAS_APLATZ` |
| **Shopfloor / BDE** | **`BEAS_ARBZEIT`** | Bảng ghi nhận thời gian làm việc thực tế / Chấm công sản xuất (Time Receipt từ BDE Terminal / WebApps) | `BELNR_ID`, `BELPOS_ID`, `POS_ID`, `BUCHNR_ID` | Nối `BEAS_FTAPL` và `BEAS_PERS` (`PERS_ID` - Nhân sự) |
| **Quality Control (QC)** | **`BEAS_QSFTHAUPT`** | Thông tin chung Phiếu kiểm tra chất lượng (QC Order Header - IQC, IPQC, OQC) | `BELNR_ID` (hoặc `DOKNR`) | Nối `BEAS_FTHAUPT`, `OPDN` (GRPO), `OITM` |
| **Quality Control (QC)** | **`BEAS_QSFTPOS`** | Chi tiết các chỉ tiêu đo kiểm, dung sai Min/Max và kết quả đo thực tế (QC Inspection Positions) | `BELNR_ID`, `BELPOS_ID`, `POS_ID` | Nối `BEAS_QSFTHAUPT` |

### 2.2. Từ Điển Cột Tiếng Đức Sang Tiếng Việt & Tiếng Anh (Column Dictionary)

| Tên Cột Beas | Từ gốc Tiếng Đức | Nghĩa Tiếng Anh | Nghĩa Tiếng Việt & Quy tắc sử dụng trong SQL |
| :--- | :--- | :--- | :--- |
| **`BELNR_ID`** | *Belegnummer* | Document / Work Order ID | Số chứng từ / Số Lệnh sản xuất Beas (Khóa chính của `BEAS_FTHAUPT`). |
| **`BELPOS_ID`** | *Belegposition* | Work Order Position | Số thứ tự vị trí mặt hàng (TP/BTP) trong Lệnh sản xuất (`BEAS_FTPOS`). |
| **`POS_ID`** | *Position ID* | Sub-line / Operation ID | ID dòng nguyên vật liệu (`BEAS_STL`, `BEAS_FTSTL`) hoặc công đoạn (`BEAS_APL`, `BEAS_FTAPL`). |
| **`POS_TEXT`** | *Positionstext* | Position Number Text | Số thứ tự dòng hiển thị cho người dùng (VD: `10`, `20`, `30`). |
| **`ART1_ID`** | *Artikelnummer* | Component ItemCode | Mã nguyên vật liệu thành phần trong `BEAS_STL` và `BEAS_FTSTL` (Nối với `OITM.ItemCode`). |
| **`ItemCode`** | *(SAP Standard)* | Parent / FG ItemCode | Mã thành phẩm/bán thành phẩm cần sản xuất trong `BEAS_STL_HEADER`, `BEAS_STL`, `BEAS_FTPOS`. |
| **`KND_ID`** | *Kundennummer* | Customer CardCode | Mã khách hàng trên Lệnh sản xuất (Nối với `OCRD.CardCode`). |
| **`APLATZ_ID`** | *Arbeitsplatz* | Work Center / Resource ID | Mã máy móc / Trạm làm việc (Nối với `BEAS_APLATZ.APLATZ_ID`). |
| **`WKZ_ID`** | *Werkzeug* | Tool / Mold ID | Mã khuôn mẫu / Công cụ dụng cụ. |
| **`PERS_ID`** | *Personalnummer* | Employee ID | Mã công nhân vận hành trên `BEAS_ARBZEIT` (Nối với `BEAS_PERS.PERS_ID`). |
| **`MENGE`** | *Menge* | Planned Quantity | Số lượng kế hoạch (trên `BEAS_FTPOS`). |
| **`MENGE_VERBRAUCH`** | *Verbrauchsmenge* | Consumption Quantity | Số lượng định mức tiêu hao (trên `BEAS_STL`) hoặc tổng số lượng NVL cần xuất (trên `BEAS_FTSTL`). |
| **`MENGE_JE`** | *Menge je* | Quantity Per Assembly | Số lượng cơ sở tính định mức (VD: định mức cho `1` hay `100` đơn vị TP). |
| **`GEL_MENGE`** | *Gelieferte Menge* | Delivered / Issued Qty | Số lượng TP đã nhập kho (trên `BEAS_FTPOS`), số lượng NVL đã xuất kho (trên `BEAS_FTSTL`), hoặc sản lượng công đoạn đã報 (trên `BEAS_FTAPL`). |
| **`AUSSCHUSS`** | *Ausschuss* | Scrap / Reject Quantity | Số lượng phế phẩm / hàng hỏng. |
| **`ABGKZ`** | *Abgeschlossen-Kennzeichen* | Closed Flag (`'J'` / `'N'`) | Cờ đóng lệnh/vị trí/dòng: **`'J'` (*Ja* = Yes, Đã đóng)**, **`'N'` (*Nein* = No, Đang mở)**. |
| **`RUESTZEIT`** | *Rüstzeit* | Setup Time | Thời gian chuẩn bị máy / thay khuôn (phút). |
| **`BEARBEITUNGSZEIT`**| *Bearbeitungszeit* | Processing / Run Time | Thời gian gia công / chạy máy chuẩn. |
| **`ZEIT`** | *Zeit* | Actual Time Logged | Thời gian làm việc thực tế ghi nhận trên `BEAS_ARBZEIT`. |
| **`ANFZEIT` / `ENDZEIT`** | *Anfangszeit / Endzeit* | Start Date/Time / End Date/Time | Thời điểm bắt đầu và kết thúc kế hoạch hoặc thực tế. |
| **`LIEFERDATUM`** | *Lieferdatum* | Delivery / Due Date | Ngày giao hàng dự kiến. |
| **`ERFTSTAMP` / `ERFUSER`** | *Erfassungs-Timestamp* | Created At / Created By | Thời gian tạo và User tạo bản ghi. |
| **`ANDTSTAMP` / `ANDUSER`** | *Änderungs-Timestamp* | Updated At / Updated By | Thời gian sửa cuối và User sửa cuối (phục vụ truy vết `Change Log`). |

---

## 3. CHECKLIST 5 NGUYÊN NHÂN KHÔNG ĐÓNG ĐƯỢC LỆNH SẢN XUẤT BEAS (`ABGKZ <> 'J'`) & SQL CHẨN ĐOÁN

Khi kế toán giá thành hoặc điều độ sản xuất báo lỗi không thể đóng (`Close`) Lệnh sản xuất (`BELNR_ID`), kỹ sư InfoAsia kiểm tra tuần tự theo 5 nguyên nhân sau:

1. **Nguyên nhân 1 - Còn công nhân đang bấm `Start` (`Logon`) mà chưa bấm `Stop` trên BDE Terminal / WebApps:**
   - Kiểm tra bảng `BEAS_FTSTAMP` (các phiên đang bấm giờ dở dang) hoặc `BEAS_ARBZEIT` chưa hoàn tất kết chuyển.
   - **Cách xử lý:** Vào `Production -> Time Receipt -> Active Work Orders / Terminal Logon` để `Stop` hoặc xóa phiên treo.
2. **Nguyên nhân 2 - Còn Phiếu kiểm tra chất lượng (`QC Order` trong `BEAS_QSFTHAUPT`) đang mở:**
   - Vị trí sản xuất có gắn quy trình QC (`IPQC` hoặc `OQC`) nhưng nhân viên QC chưa nhập kết quả đo (`BEAS_QSFTPOS`) hoặc chưa bấm **`Release / Valuation / Transfer`**.
   - **Cách xử lý:** Mở `Quality Control -> QC Orders`, lọc theo `BELNR_ID`, hoàn tất đánh giá và đóng phiếu QC.
3. **Nguyên nhân 3 - Còn vị trí Bán thành phẩm cấp dưới (`Sub-assembly BELPOS_ID`) chưa đóng (`ABGKZ = 'N'`):**
   - Trong Lệnh sản xuất đa cấp của Beas, nếu vị trí con (VD `BELPOS_ID = 20`) chưa nhập kho đủ hoặc chưa đóng (`ABGKZ = 'N'`), vị trí thành phẩm cha (`BELPOS_ID = 10`) hoặc toàn lệnh (`BEAS_FTHAUPT`) sẽ bị chặn đóng.
4. **Nguyên nhân 4 - Còn Đơn hàng Gia công ngoài (`External Operation / Subcontracting PO`) chưa nhập kho `GRPO`:**
   - Công đoạn gia công ngoài trên `BEAS_FTAPL` đã sinh `Purchase Order (OPOR)` nhưng chưa làm `Goods Receipt PO (OPDN)` để ghi nhận phí gia công vào WIP.
5. **Nguyên nhân 5 - Kỳ kế toán (`Posting Period`) bị khóa, lệch Tồn kho âm hoặc `Beas Common Service` bị dừng:**
   - Khi đóng lệnh, Beas cần sinh bút toán kết chuyển chênh lệch WIP (`Journal Entry` / `Inventory Revaluation`). Nếu kỳ kế toán của tháng đó đã khóa (`Locked`) hoặc tài khoản `WIP Variance Account` chưa cấu hình trong `G/L Account Determination`, lệnh sẽ báo lỗi.

### Câu Lệnh SQL Thực Chiến Kiểm Tra Tổng Thể Tình Trạng Lệnh Sản Xuất Beas & Các Điểm Nghẽn

```sql
-- =========================================================================
-- TRUY VẤN CHẨN ĐOÁN NHANH LỆNH SẢN XUẤT BEAS (WORK ORDER HEALTH CHECK)
-- =========================================================================
SELECT
    T0.BELNR_ID                                 AS [So_Lenh_SX],
    T1.BELPOS_ID                                AS [Vi_Tri_Pos],
    T1.ItemCode                                 AS [Ma_Thanh_Pham],
    T1.ItemName                                 AS [Ten_Thanh_Pham],
    T1.WhsCode                                  AS [Kho_Nhap],
    T1.MENGE                                    AS [SL_Ke_Hoach],
    T1.GEL_MENGE                                AS [SL_Da_Nhap_Kho],
    (T1.MENGE - ISNULL(T1.GEL_MENGE, 0))        AS [SL_Con_Thieu],
    T0.ABGKZ                                    AS [Header_Closed],
    T1.ABGKZ                                    AS [Position_Closed],
    (SELECT COUNT(1) FROM BEAS_FTSTL S WITH (NOLOCK)
     WHERE S.BELNR_ID = T1.BELNR_ID AND S.BELPOS_ID = T1.BELPOS_ID AND ISNULL(S.ABGKZ, 'N') <> 'J') AS [So_Dong_NVL_Chua_Dong],
    (SELECT COUNT(1) FROM BEAS_FTAPL A WITH (NOLOCK)
     WHERE A.BELNR_ID = T1.BELNR_ID AND A.BELPOS_ID = T1.BELPOS_ID AND ISNULL(A.ABGKZ, 'N') <> 'J') AS [So_Cong_Doan_Chua_Dong],
    (SELECT COUNT(1) FROM BEAS_QSFTHAUPT Q WITH (NOLOCK)
     WHERE Q.BELNR_ID = T1.BELNR_ID AND Q.BELPOS_ID = T1.BELPOS_ID AND ISNULL(Q.ABGKZ, 'N') <> 'J') AS [So_Phieu_QC_Dang_Mo]
FROM BEAS_FTHAUPT T0 WITH (NOLOCK)
INNER JOIN BEAS_FTPOS T1 WITH (NOLOCK) ON T0.BELNR_ID = T1.BELNR_ID
WHERE ISNULL(T0.ABGKZ, 'N') <> 'J'
ORDER BY T0.BELNR_ID DESC, T1.BELPOS_ID ASC;
```
