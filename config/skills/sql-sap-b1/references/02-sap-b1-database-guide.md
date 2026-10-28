# 📘 TÀI LIỆU ĐÀO TẠO CƠ SỞ DỮ LIỆU SAP B1 (BẢN ĐẦY ĐỦ)

Hệ thống cơ sở dữ liệu của SAP Business One được thiết kế cực kỳ logic và đồng nhất. Khi bạn nắm được quy tắc, bạn có thể tự suy luận ra tên bảng và tên cột của bất kỳ phân hệ nào.

## PHẦN 1: QUY TẮC ĐẶT TÊN BẢNG (TABLES)

Trong SAP B1, mọi chứng từ đều được chia thành ít nhất 2 bảng:
1. **Bảng Thông tin chung (Header Table):** Chứa các thông tin tổng quát của chứng từ như Tên khách hàng, Ngày lập, Tổng tiền.
2. **Bảng Chi tiết hàng hóa (Line/Row Table):** Chứa danh sách các mặt hàng bên trong chứng từ đó.

**Quy tắc:**
* **Bảng Thông tin chung:** Luôn bắt đầu bằng chữ cái **`O`** (Đại diện cho từ *Object* - Đối tượng).
* **Bảng Chi tiết hàng hóa:** Lấy tên của Bảng thông tin chung, **BỎ** chữ `O` ở đầu và **THÊM** số `1` ở cuối.

**Ví dụ đầy đủ các phân hệ cốt lõi:**

| Phân hệ (Nghiệp vụ) | Tên Tiếng Anh chuẩn | Bảng Thông tin chung (Header) | Bảng Chi tiết hàng hóa (Line) |
| :--- | :--- | :--- | :--- |
| Báo giá cho Khách hàng | Sales Quotation | **OQUT** | **QUT1** |
| Đơn hàng bán | Sales Order | **ORDR** | **RDR1** |
| Phiếu giao hàng | Delivery | **ODLN** | **DLN1** |
| Hóa đơn bán hàng | A/R Invoice | **OINV** | **INV1** |
| Đơn mua hàng | Purchase Order | **OPOR** | **POR1** |
| Phiếu nhập kho mua hàng | Goods Receipt PO | **OPDN** | **PDN1** |
| Hóa đơn mua hàng | A/P Invoice | **OPCH** | **PCH1** |
| Phiếu nhập kho nội bộ | Goods Receipt | **OIGN** | **IGN1** |
| Phiếu xuất kho nội bộ | Goods Issue | **OIGE** | **IGE1** |
| Phiếu chuyển kho | Inventory Transfer | **OWTR** | **WTR1** |
| Lệnh sản xuất | Production Order | **OWOR** | **WOR1** |
| Đối tác kinh doanh (Khách hàng / Nhà cung cấp) | Business Partner | **OCRD** | *(Chỉ có bảng Header)* |
| Dữ liệu chủ Hàng hóa | Item Master Data | **OITM** | *(Chỉ có bảng Header)* |

---

## PHẦN 2: QUY TẮC ĐẶT TÊN CỘT (COLUMNS) DÙNG ĐỂ LIÊN KẾT

Để viết lệnh SQL kết nối các bảng với nhau, bạn cần sử dụng các cột "Khóa chính" (Primary Key) tiêu chuẩn của SAP B1:

1. **`DocEntry` (Document Entry):** Mã số hệ thống nội bộ của chứng từ. Đây là chìa khóa bắt buộc để kết nối bảng Thông tin chung và bảng Chi tiết hàng hóa. (Ví dụ: `ORDR.DocEntry = RDR1.DocEntry`).
2. **`LineNum` (Line Number):** Số thứ tự của dòng hàng hóa trong chứng từ (Chỉ tồn tại ở các bảng có số 1, ví dụ RDR1). Dòng đầu tiên luôn bắt đầu bằng số 0.
3. **`ItemCode`:** Mã mặt hàng. Dùng để kết nối với bảng Hàng hóa `OITM`.
4. **`CardCode`:** Mã khách hàng hoặc Mã nhà cung cấp. Dùng để kết nối với bảng Đối tác kinh doanh `OCRD`.
5. **`DocNum` (Document Number):** Số chứng từ hiển thị trên giao diện cho người dùng xem. *(Lưu ý: Không dùng `DocNum` để liên kết bảng, chỉ dùng để hiển thị).*

---

## PHẦN 3: QUY TẮC TRUY VẾT LUỒNG CHỨNG TỪ & DANH SÁCH `BASETYPE`

Khi một chứng từ được sao chép sang chứng từ khác (Ví dụ: Chuyển từ *Đơn hàng bán* thành *Phiếu giao hàng*), SAP B1 sẽ ghi nhận lại nguồn gốc của dòng hàng hóa đó ngay tại **Bảng Chi tiết hàng hóa (Line Table)** của chứng từ mới, thông qua 3 cột sau:

* **`BaseType` (Loại chứng từ gốc):** Mã số đại diện cho loại chứng từ đã sinh ra nó.
* **`BaseEntry` (Mã nội bộ chứng từ gốc):** Chính là cột `DocEntry` của chứng từ gốc.
* **`BaseLine` (Số dòng chứng từ gốc):** Chính là cột `LineNum` của chứng từ gốc.

### Bảng Liệt Kê Đầy Đủ Mã `BaseType` (Object Types) Của SAP B1:

Dưới đây là danh sách đầy đủ các mã số `BaseType` bạn bắt buộc phải nhớ hoặc tra cứu khi truy vết luồng chứng từ:

| Mã `BaseType` | Tên Chứng từ Tiếng Anh | Tên Chứng từ Tiếng Việt | Tên Bảng (Header / Line) |
| :---: | :--- | :--- | :--- |
| **13** | A/R Invoice | Hóa đơn bán hàng | OINV / INV1 |
| **14** | A/R Credit Memo | Ghi có bán hàng (Hàng bán bị trả lại và hoàn tiền) | ORIN / RIN1 |
| **15** | Delivery | Phiếu giao hàng | ODLN / DLN1 |
| **16** | Sales Returns | Nhập lại hàng bán (Khách trả hàng nhưng chưa xuất hóa đơn) | ORDN / RDN1 |
| **17** | Sales Order | Đơn hàng bán | ORDR / RDR1 |
| **18** | A/P Invoice | Hóa đơn mua hàng | OPCH / PCH1 |
| **19** | A/P Credit Memo | Ghi có mua hàng (Trả hàng cho nhà cung cấp và hoàn tiền) | ORPC / RPC1 |
| **20** | Goods Receipt PO | Phiếu nhập kho mua hàng | OPDN / PDN1 |
| **21** | Goods Return | Xuất trả hàng mua (Trả hàng nhưng chưa nhận hóa đơn) | ORPD / RPD1 |
| **22** | Purchase Order | Đơn mua hàng | OPOR / POR1 |
| **23** | Sales Quotation | Báo giá cho Khách hàng | OQUT / QUT1 |
| **59** | Goods Receipt | Phiếu nhập kho (Sản xuất / Điều chỉnh tăng) | OIGN / IGN1 |
| **60** | Goods Issue | Phiếu xuất kho (Sản xuất / Điều chỉnh giảm) | OIGE / IGE1 |
| **67** | Inventory Transfer | Phiếu chuyển kho | OWTR / WTR1 |
| **147** | Purchase Quotation | Yêu cầu báo giá mua hàng | OPRQ / PRQ1 |
| **149** | A/R Reserve Invoice | Hóa đơn bán hàng bảo lưu (Xuất hóa đơn trước khi giao hàng) | OINV / INV1 |
| **202** | Production Order | Lệnh sản xuất | OWOR / WOR1 |

---

## PHẦN 4: VÍ DỤ SQL THỰC CHIẾN (ÁP DỤNG ĐẦY ĐỦ CÁC QUY TẮC TRÊN)

**Yêu cầu nghiệp vụ:**
Viết câu lệnh SQL truy xuất **Phiếu giao hàng (Delivery)**. Yêu cầu hiển thị rõ dòng hàng hóa này được giao từ **Đơn hàng bán (Sales Order)** nào. Lấy đầy đủ thông tin Tên khách hàng và Tên mặt hàng.

**Câu lệnh SQL:**

```sql
SELECT 
    -- 1. THÔNG TIN PHIẾU GIAO HÀNG (Chứng từ hiện tại)
    T0.DocNum AS 'So_Phieu_Giao_Hang',
    T0.DocDate AS 'Ngay_Giao_Hang',
    T0.CardCode AS 'Ma_Khach_Hang',
    T2.CardName AS 'Ten_Khach_Hang',      -- Lấy từ bảng Đối tác kinh doanh
    T1.ItemCode AS 'Ma_Mat_Hang',
    T3.ItemName AS 'Ten_Mat_Hang',        -- Lấy từ bảng Hàng hóa
    T1.Quantity AS 'So_Luong_Giao',

    -- 2. THÔNG TIN TRUY VẾT VỀ ĐƠN HÀNG BÁN GỐC (Base Document)
    T1.BaseType AS 'Loai_Chung_Tu_Goc',   -- Sẽ hiển thị số 17 (Sales Order)
    T4.DocNum AS 'So_Don_Hang_Goc',       -- Số Đơn hàng bán (Sales Order)
    T1.BaseLine AS 'Dong_Tren_Don_Hang'

FROM 
    ODLN T0                               -- Bảng thông tin chung của Phiếu giao hàng
INNER JOIN 
    DLN1 T1 ON T0.DocEntry = T1.DocEntry  -- Liên kết với Bảng chi tiết của Phiếu giao hàng

-- Liên kết lấy Tên Khách Hàng và Tên Mặt Hàng
LEFT JOIN 
    OCRD T2 ON T0.CardCode = T2.CardCode  
LEFT JOIN 
    OITM T3 ON T1.ItemCode = T3.ItemCode  

-- 3. LIÊN KẾT TRUY VẾT NGƯỢC VỀ ĐƠN HÀNG BÁN (Dùng BaseType, BaseEntry, BaseLine)
LEFT JOIN 
    ORDR T4 ON T1.BaseEntry = T4.DocEntry AND T1.BaseType = 17 
    -- Điều kiện T1.BaseType = 17 là bắt buộc để chắc chắn dòng này bắt nguồn từ Đơn hàng bán (Sales Order)
```

---

## PHẦN 5: LƯU Ý QUAN TRỌNG VỀ TRA CỨU MỞ RỘNG
Tài liệu đào tạo này được hệ thống hóa nhằm mục đích cung cấp bộ quy tắc cốt lõi cùng các bảng (Tables) và cột (Columns) cơ bản, thường xuyên được sử dụng nhất trong các nghiệp vụ hàng ngày của SAP B1.

Hệ thống cơ sở dữ liệu thực tế của SAP B1 sở hữu hàng ngàn bảng và hàng chục ngàn cột. Nếu cần tra cứu thêm:
- Hãy sử dụng `grep` quét nhanh trên file `sap_b1_dictionary.txt` để lấy mô tả Schema thực tế.
