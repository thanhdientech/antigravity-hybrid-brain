# Học Phần 05: Kho Mẫu SQL Sản Xuất (SAP B1 OWOR & Boyum Beas Manufacturing) & Phân Tích Giá Thành

Tài liệu này là chỉ mục băm nhỏ (Smart-Loading Chunk) cho nhóm câu lệnh SQL thuộc **Phân hệ Sản xuất (`Production` / `Beas`) & Phân tích Giá thành (`97.Production Cost Analysis`)** nằm trong `references/queries/`.

---

## 1. Danh Mục File `.sql` Nguyên Bản Trong `references/queries/`

| Phân nhóm | Đường dẫn File `.sql` trong `references/` | Mục đích & Bảng sử dụng chính |
| :--- | :--- | :--- |
| **Phát hiện Bất thường Giá vốn & Giá thành** | `references/queries/Cost_Anomaly_Detection.sql` | Quét biến động đơn giá vốn hàng xuất kho / nhập kho bất thường trên `OINM`, `OITM`, `OIGN`, `OIGE`. |
| **Phân tích Giá thành Sản xuất (`97.Production Cost Analysis`)** | `references/queries/97.Production Cost Analysis/` | Phân tích chi phí Nguyên vật liệu (`621`), Nhân công (`622`), Sản xuất chung (`627`) và Dở dang (`WIP 154`) theo Lệnh sản xuất. |
| **Truy vấn Sản xuất Chuẩn (`06.Production Queries` & `Production`)** | `references/queries/06.Production Queries/`<br>`references/queries/Production/` | Theo dõi tiến độ Lệnh sản xuất (`OWOR`/`WOR1` & `BEAS_FTHAUPT`/`BEAS_FTPOS`), định mức tiêu hao NVL thực tế vs định mức BOM (`BEAS_FTSTL`). |
| **Truy vấn Sản xuất Thực chiến FVIVN (`SYNC_FVIVN_PROD_SSMS\Production`)** | `references/queries/SYNC_FVIVN_PROD_SSMS/Production/` | Bộ 5 câu lệnh SQL thực chiến trên hệ thống FVIVN (Lệnh sản xuất Beas, Giờ công `BEAS_ARBZEIT`, Nhập kho thành phẩm `OIGN`, Xuất kho NVL `OIGE`). |
| **Truy vấn Sản xuất Thực chiến Penflex (`SYNC_PenflexPRD_NEW\05. Production`)** | `references/queries/SYNC_PenflexPRD_NEW/05. Production/` | Bộ 3 câu lệnh SQL theo dõi lệnh sản xuất và tiêu hao vật tư tại nhà máy Penflex (`PenflexPRD_NEW`). |

---

## 2. Mẫu Khung SQL Chuẩn: Đối Chiếu Lệnh Sản Xuất Beas (`BEAS_FTHAUPT` / `BEAS_FTPOS` / `BEAS_FTSTL`)

```sql
SELECT
    T0.BELNR_ID                          AS [So_Lenh_Beas],
    T1.BELPOS_ID                         AS [Vi_Tri_Pos],
    T1.ItemCode                          AS [Ma_Thanh_Pham],
    T1.ItemName                          AS [Ten_Thanh_Pham],
    T1.MENGE_VERBRAUCH                   AS [SL_Ke_Hoach],
    T1.GEL_MENGE                         AS [SL_Da_Nhap_Kho],
    ISNULL(T1.ABGKZ, 'N')                AS [Trang_Thai_Dong_Lenh],
    T2.POS_ID                            AS [Dong_BOM],
    T2.ART1_ID                           AS [Ma_NVL],
    T2.ItemName                          AS [Ten_NVL],
    T2.TOTALQUANTITY_WHUNIT              AS [SL_NVL_Dinh_Muc],
    T2.BookedQty                         AS [SL_NVL_Da_Xuat]
FROM BEAS_FTHAUPT T0 WITH (NOLOCK)
INNER JOIN BEAS_FTPOS T1 WITH (NOLOCK)
    ON T0.BELNR_ID = T1.BELNR_ID
LEFT JOIN BEAS_FTSTL T2 WITH (NOLOCK)
    ON T1.BELNR_ID = T2.BELNR_ID
   AND T1.BELPOS_ID = T2.BELPOS_ID
WHERE T0.BELDAT >= @FromDate
  AND T0.BELDAT <= @ToDate
ORDER BY T0.BELNR_ID DESC, T1.BELPOS_ID, T2.POS_ID;
```

> **Gợi ý**: Để xem toàn văn 24 câu lệnh SQL thực chiến kèm giải thích nghiệp vụ chi tiết của FVIVN, đọc thêm `references/03-kho-24-query-thuc-chien-fvivn-sap-b1-beas.md`.
