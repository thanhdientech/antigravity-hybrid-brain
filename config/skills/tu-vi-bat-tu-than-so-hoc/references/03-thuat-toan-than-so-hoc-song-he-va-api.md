# Thuật Toán Thần Số Học Song Hệ (`Pythagoras Quốc Tế` & `Nhân Số Học Phillips`) & Hệ Quy Chiếu API

## 1. Bảng Quy Đổi Chữ Cái Pythagoras Chuẩn (`1–9 Letter Matrix`)

| Số `1` | Số `2` | Số `3` | Số `4` | Số `5` | Số `6` | Số `7` | Số `8` | Số `9` |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **A, J, S** | **B, K, T** | **C, L, U** | **D, M, V** | **E, N, W** | **F, O, X** | **G, P, Y** | **H, Q, Z** | **I, R** |

- **Chuẩn hóa tiếng Việt trước khi tính:** Loại bỏ dấu thanh và dấu phụ tiếng Việt, chuyển `Đ/đ` $\rightarrow$ `D/d`, viết hoa toàn bộ chữ cái Latin `A–Z`.
- **Quy tắc tách chữ `Y` (Nguyên âm vs. Phụ âm):**
  1. *Hệ Pythagoras Quốc Tế (`Matthew Oliver Goodwin` / `Hans Decoz` — mặc định trong `destiny_pipeline.py` mục `linh_hon`):* `Y` là **Nguyên âm** khi đứng một mình, khi không có nguyên âm nào (`A, E, I, O, U`) đứng liền kề hai bên (ví dụ: *MY, LY, VY, THY, HUYNH* tùy vị trí), hoặc khi đứng ngay sau một nguyên âm tạo thành nguyên âm đôi cuối âm tiết (ví dụ: *THUY, DUY, QUY, NGOC ANH...*); `Y` là **Phụ âm** khi đứng đầu âm tiết ngay trước một nguyên âm (ví dụ: *YEN, YEU*).
  2. *Hệ Nhân Số Học Việt Nam (`David A. Phillips` — mục `linh_hon_y_nguyen_am` trong `destiny_pipeline.py`):* Trong tên tiếng Việt, chữ `Y` luôn được tính là **Nguyên âm**. Động cơ `destiny_pipeline.py` xuất đồng thời cả hai giá trị để AI đối chiếu minh bạch 100%, không bao giờ cãi nhau giữa hai trường phái.

---

## 2. Công Thức 18 Chỉ Số Thần Số Học Pythagoras Quốc Tế (`Goodwin / Decoz`)

1. **Số Đường Đời (`Life Path` — Thuật toán rút gọn 3 chu kỳ):**
   - Bước 1: Rút gọn riêng `Ngày sinh` $\rightarrow$ $D$ (giữ `11, 22`); rút gọn riêng `Tháng sinh` $\rightarrow$ $M$ (giữ `11`); rút gọn tổng các chữ số `Năm sinh` $\rightarrow$ $Y$ (giữ `11, 22, 33`).
   - Bước 2: Cộng $S = D + M + Y$ và rút gọn về `1..9` hoặc Số Bậc Thầy `11/2, 22/4, 33/6`.
2. **Số Sứ Mệnh (`Destiny / Expression`):** Rút gọn tổng giá trị từng từ (Họ, Đệm, Tên) giữ Master, sau đó cộng tổng các từ và rút gọn giữ `11, 22, 33`.
3. **Số Linh Hồn (`Soul Urge / Heart's Desire`):** Tính như Số Sứ Mệnh nhưng chỉ cộng các **Nguyên âm** trong từng từ của họ tên khai sinh.
4. **Số Nhân Cách (`Personality`):** Tính như Số Sứ Mệnh nhưng chỉ cộng các **Phụ âm** trong từng từ của họ tên khai sinh.
5. **Số Trưởng Thành (`Maturity Number`):** Rút gọn của `(Đường Đời đơn + Sứ Mệnh đơn)`, giữ `11, 22, 33` — kích hoạt mạnh mẽ từ ngưỡng `35–40` tuổi trở đi.
6. **Số Ngày Sinh (`Birthday Number`):** Giá trị rút gọn của riêng ngày sinh Dương lịch (ghi nhận cả gốc Nợ Nghiệp nếu sinh ngày `13, 14, 16, 19` hoặc Master `11, 22`).
7. **Số Tư Duy Lý Trí (`Rational Thinking` — kế thừa từ `getRationalThinking.ts`):** Rút gọn của `(Tổng chữ cái Tên gọi chính + Ngày sinh)`.
8. **Số Cân Bằng (`Balance Number` — kế thừa từ `getBalance.ts`):** Tổng giá trị các **chữ cái đầu tiên** của từng từ trong họ tên đầy đủ, phản ánh phản xạ ứng phó khi gặp khủng hoảng.
9. ** hai Chỉ Số Cầu Nối (`Bridge Numbers`):**
   - *Cầu nối Đường Đời – Sứ Mệnh:* $| \text{Đường Đời đơn} - \text{Sứ Mệnh đơn} |$.
   - *Cầu nối Linh Hồn – Nhân Cách:* $| \text{Linh Hồn đơn} - \text{Nhân Cách đơn} |$.
10. **Đam Mê Ẩn (`Hidden Passion` — kế thừa từ `getPassion.ts`):** Con số (từ `1..9`) xuất hiện với tần suất cao nhất ($\ge 2$ lần) trong toàn bộ họ tên.
11. **Số Thiếu / Bài Học Nghiệp (`Missing Numbers / Karmic Lessons` — kế thừa từ `getMissingNumbers.ts`):** Các con số từ `1..9` hoàn toàn vắng mặt trong họ tên khai sinh.
12. **Bốn Chỉ Số Nợ Nghiệp (`Karmic Debt Numbers`):** Ghi nhận khi tổng trung gian trước khi rút gọn cuối cùng chạm đúng **`13/4`** (kỷ luật lao động), **`14/5`** (quản trị tự do & cám dỗ), **`16/7`** (chuyển hóa bản ngã), hoặc **`19/1`** (tự lực & không lạm quyền).
13. **Năm Cá Nhân & 12 Tháng Cá Nhân (`Personal Year & Personal Months`):**
    - $\text{Năm Cá Nhân} = \text{reduce\_single}(\text{reduce\_single}(Ngày) + \text{reduce\_single}(Tháng) + \text{reduce\_single}(Năm\ mục\ tiêu))$ (từ `1..9`).
    - $\text{Tháng Cá Nhân } m = \text{reduce\_single}(\text{Năm Cá Nhân} + \text{reduce\_single}(m))$.
14. **Bốn Đỉnh Cao Kim Tự Tháp & Bốn Thách Thức (`4 Pinnacles & 4 Challenges`):**
    - Đặt $d = \text{reduce\_single}(Ngày)$, $m = \text{reduce\_single}(Tháng)$, $y = \text{reduce\_single}(Năm)$, $LP_s = \text{reduce\_single}(\text{Đường Đời})$.
    - **4 Đỉnh Cao:** $P_1 = \text{reduce\_master}(m + d)$; $P_2 = \text{reduce\_master}(d + y)$; $P_3 = \text{reduce\_master}(P_1 + P_2)$; $P_4 = \text{reduce\_master}(m + y)$.
    - **4 Thách Thức:** $C_1 = |m - d|$; $C_2 = |d - y|$; $C_3 = |C_1 - C_2|$; $C_4 = |m - y|$.
    - **Mốc tuổi chuyển đỉnh:** Đỉnh 1 kết thúc ở tuổi $A_1 = 36 - LP_s$; Đỉnh 2 kết thúc ở $A_1 + 9$; Đỉnh 3 kết thúc ở $A_1 + 18$; Đỉnh 4 kéo dài từ $A_1 + 19$ đến cuối đời.

---

## 3. Hệ Đối Chiếu Nhân Số Học (`David A. Phillips`) & Biểu Đồ Ngày Sinh `3x3`

- **Con Số Chủ Đạo (`Ruling Number`):** Cộng tất cả chữ số đơn lẻ của Ngày-Tháng-Năm sinh Dương lịch; rút gọn dừng lại trong dải **`2` đến `11`**, riêng tổng `22` ghi là **`22/4`** (hệ Phillips không rút `10` thành `1` và không dùng `33`).
- **Ma Trận Biểu Đồ Ngày Sinh `3x3` & 8 Mũi Tên Cá Tính:**

```text
Trục Trí Não (Mental Plane):     [ 3 ]   [ 6 ]   [ 9 ]
Trục Tâm Hồn (Soul/Emotional):   [ 2 ]   [ 5 ]   [ 8 ]
Trục Thể Chất (Physical Plane):  [ 1 ]   [ 4 ]   [ 7 ]
```

- **8 Cặp Mũi Tên Sức Mạnh (Đủ 3 số) vs. Mũi Tên Trống (Khuyết cả 3 số):**
  1. `1 - 5 - 9`: Mũi tên Quyết tâm $\leftrightarrow$ Trống `1-5-9`: Mũi tên Trì hoãn.
  2. `3 - 5 - 7`: Mũi tên Tâm linh / Trực giác $\leftrightarrow$ Trống `3-5-7`: Mũi tên Hoài nghi thực chứng.
  3. `1 - 2 - 3`: Mũi tên Kế hoạch $\leftrightarrow$ Trống `1-2-3`: Thiếu trật tự kế hoạch.
  4. `4 - 5 - 6`: Mũi tên Ý chí sắt đá $\leftrightarrow$ Trống `4-5-6`: Mũi tên Uất giận / Dễ nản.
  5. `7 - 8 - 9`: Mũi tên Hoạt động thực tiễn $\leftrightarrow$ Trống `7-8-9`: Mũi tên Thụ động.
  6. `1 - 4 - 7`: Mũi tên Thực tế $\leftrightarrow$ Trống `1-4-7`: Thiếu thực tế.
  7. `2 - 5 - 8`: Mũi tên Cân bằng cảm xúc $\leftrightarrow$ Trống `2-5-8`: Nhạy cảm nội tâm.
  8. `3 - 6 - 9`: Mũi tên Trí tuệ sáng suốt $\leftrightarrow$ Trống `3-6-9`: Trí nhớ ngắn hạn / Cần rèn tập trung.

---

## 4. Kiến Trúc Mở Rộng Đa Hệ Thần Số Học (`Pythagorean / Chaldean / Vedic`)

Khi người dùng cần tích hợp Thần Số Học thương mại cấp ứng dụng SaaS/App hoặc đối chiếu đa hệ ngoài Pythagoras (*Chaldean 1–8 cho tên thương hiệu/domain/sản phẩm*, *Vedic Numerology*), có thể tham chiếu cấu trúc phân nhóm nghiệp vụ chuẩn từ **The Numerology API (`v1.0.3`)**:
- **Thương hiệu & Kinh doanh:** `business-name`, `domain-name-numerology`, `product-name-numerology`, `launch-timing-numerology`, `wealth-code-reading`, `team-dynamics-numerology`.
- **Gia đình & Đời sống:** `baby-name-forecast`, `family-legacy-matrix`, `relationship-milestone-numerology`, `home-address-numerology`, `phone-number-personal-fit`.
