# Học Phần 06: Kho Mẫu SQL Tài Chính, Kế Toán Tổng Hợp, Công Nợ & Khóa Sổ Cuối Tháng

Tài liệu này là chỉ mục băm nhỏ (Smart-Loading Chunk) cho nhóm câu lệnh SQL thuộc **Phân hệ Tài chính (`01.Finance Queries`, `Financials`), Kế toán (`Accounting`, `Ke Toan`), Ngân hàng (`Banking`), Tài sản cố định (`Fixed Asset`) và Khóa sổ cuối tháng (`98.Monthly closing`)** nằm trong `references/queries/`.

---

## 1. Danh Mục File `.sql` Nguyên Bản Trong `references/queries/`

| Phân nhóm | Đường dẫn File `.sql` trong `references/` | Mục đích & Bảng sử dụng chính |
| :--- | :--- | :--- |
| **Báo cáo Tuổi nợ Khách hàng (`Aging`)** | `references/queries/Customer_Aging_Report.sql` | Phân tích công nợ phải thu theo tuổi nợ (`0-30`, `31-60`, `61-90`, `>90` ngày) từ `OJDT`, `JDT1`, `OCRD`, `OINV`, `ORCT`. |
| **Truy vấn Tài chính Chuẩn (`01.Finance Queries` & `Financials`)** | `references/queries/01.Finance Queries/`<br>`references/queries/Financials/` | Sổ nhật ký chung, Sổ cái tài khoản (`OJDT`/`JDT1`), Bảng cân đối phát sinh (`OACT`), Đối chiếu tài khoản. |
| **Kế toán Việt Nam & Thuế (`Accounting` & `Ke Toan`)** | `references/queries/Accounting/`<br>`references/queries/Ke Toan/` | 20 file `.sql` phục vụ hạch toán kế toán, đối chiếu thuế GTGT đầu vào/đầu ra, kết chuyển chi phí và báo cáo quản trị. |
| **Ngân hàng & Dòng tiền (`Banking`)** | `references/queries/Banking/` | 5 file `.sql` truy vấn Phiếu thu (`ORCT`), Phiếu chi (`OVPM`), Sổ phụ ngân hàng và tiền mặt. |
| **Tài sản cố định (`Fixed Asset`)** | `references/queries/Fixed Asset/` | 2 file `.sql` theo dõi danh mục TSCĐ và khấu hao. |
| **Khóa sổ cuối tháng (`98.Monthly closing` & `Monthly Closing`)** | `references/queries/98.Monthly closing/`<br>`references/queries/Monthly Closing/` | 5 file `.sql` kiểm tra chênh lệch Sổ kho (`OINM`) vs Sổ cái (`OJDT`/`JDT1`), kiểm tra chứng từ treo trước khi khóa kỳ kế toán (`OFPR`). |
| **Tài chính Thực chiến FVIVN (`SYNC_FVIVN_PROD_SSMS\Financials`)** | `references/queries/SYNC_FVIVN_PROD_SSMS/Financials/` | 5 file `.sql` thực chiến đang chạy tại FVIVN (`FVIVN_PROD` / `FVIVN_GoLive_2024`). |

---

## 2. Mẫu Khung SQL Chuẩn: Đối Chiếu Sổ Kho (`OINM`) Với Sổ Cái (`OJDT` / `JDT1`) Trước Khi Khóa Sổ

```sql
SELECT
    A.TransType,
    A.CreatedBy                          AS [DocEntry_ChungTu],
    A.BASE_REF                           AS [So_Chung_Tu],
    A.DocDate                            AS [Ngay_Hach_Toan],
    A.InvAccount                         AS [TK_Kho],
    A.Stock_Value                        AS [Gia_Tri_So_Kho_OINM],
    ISNULL(B.GL_Value, 0)                AS [Gia_Tri_So_Cai_JDT1],
    (A.Stock_Value - ISNULL(B.GL_Value, 0)) AS [Chenh_Lech]
FROM (
    SELECT
        T0.TransType,
        T0.CreatedBy,
        T0.BASE_REF,
        T0.DocDate,
        T0.InvntAct AS InvAccount,
        SUM(ISNULL(T0.TransValue, 0)) AS Stock_Value
    FROM OINM T0 WITH (NOLOCK)
    WHERE T0.DocDate BETWEEN @FromDate AND @ToDate
    GROUP BY T0.TransType, T0.CreatedBy, T0.BASE_REF, T0.DocDate, T0.InvntAct
) A
LEFT JOIN (
    SELECT
        J0.TransType,
        J0.CreatedBy,
        J1.Account,
        SUM(ISNULL(J1.Debit, 0) - ISNULL(J1.Credit, 0)) AS GL_Value
    FROM OJDT J0 WITH (NOLOCK)
    INNER JOIN JDT1 J1 WITH (NOLOCK) ON J0.TransId = J1.TransId
    WHERE J0.RefDate BETWEEN @FromDate AND @ToDate
    GROUP BY J0.TransType, J0.CreatedBy, J1.Account
) B
    ON A.TransType = B.TransType
   AND A.CreatedBy = B.CreatedBy
   AND A.InvAccount = B.Account
WHERE ABS(A.Stock_Value - ISNULL(B.GL_Value, 0)) > 1
ORDER BY A.DocDate DESC;
```
