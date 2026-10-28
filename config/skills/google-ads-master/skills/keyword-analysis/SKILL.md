---
name: keyword-analysis
description: >
  Dùng skill này để phân tích, phân nhóm từ khóa theo hành trình khách hàng và tính ngân sách Google Ads.
  Trigger khi user nhắc đến: "phân tích từ khóa", "phân nhóm từ khóa", "keyword analysis",
  "keyword grouping", "nhóm từ khóa", "phân loại keyword", "gom nhóm keyword",
  "ngân sách từ khóa", "budget keyword", "tính ngân sách ads", "chi phí từ khóa",
  "hành trình khách hàng", "customer journey keyword", "intent từ khóa",
  "quan tâm cân nhắc mua hàng", "awareness consideration purchase",
  "multi-intent keyword", "từ khóa đa ý định", "seed keyword",
  hoặc khi user upload file từ khóa (.csv, .xlsx) từ Google Keyword Planner / Ahrefs / SEMrush
  và muốn phân nhóm hoặc tính ngân sách.
  Luôn dùng skill này — đừng tự phân tích từ khóa theo cách khác khi user hỏi về phân nhóm keyword.
  Output ra file .xlsx có nhiều sheet trực quan. Không trả lời chung chung trong chat.
---

# Keyword Analysis & Budget Planning Skill

Phân tích từ khóa theo hành trình khách hàng (Quan Tâm → Cân Nhắc → Mua Hàng),
phân nhóm theo **cấu trúc đa tầng insight** (L1 → L2 → L3), tính ngân sách Google Ads.

**Nguyên tắc cốt lõi: Insight thực của khách hàng là nguyên lý gốc của mọi phân nhóm.
Dữ liệu chuyển đổi thực chiến > phân tích ngôn ngữ lý thuyết.**

---

## Bước 0 — Thu thập thông tin đầu vào

Nếu user chưa upload file từ khóa, hỏi:

1. **File từ khóa gốc?** — upload .csv hoặc .xlsx (Google Keyword Planner, Ahrefs, SEMrush...)
2. **Ngành hàng / dịch vụ + website + website đối thủ?** — để hiểu ngữ cảnh phân nhóm insight
3. **CTR / CR / hệ số CPC?** — mặc định CTR = 8%, CR = 1.5%, hệ số CPC = 80% nếu không có

Nếu user đã upload file → đọc file và bắt đầu phân tích ngay.

---

## Bước 1 — Đọc & làm sạch dữ liệu

- Đọc file, xác định cột: Keyword, Volume, CPC Min, CPC Max, Competition
- Loại trùng lặp, loại từ khóa không liên quan đến ngành hàng
- Chuẩn hóa format số (VNĐ)

---

## Bước 2 — Phân loại theo hành trình khách hàng

### Logic phân loại theo modifier

```
Nhận từ khóa mới
       ↓
Có modifier rõ ràng?
  ├─ CÓ "là gì / cách / hướng dẫn / tại sao / nguyên lý / tự học / kỹ thuật"
  │     → QUAN TÂM
  ├─ CÓ "review / đánh giá / so sánh / vs / hay / có tốt không / nên mua / loại nào / ưu nhược điểm"
  │     → CÂN NHẮC
  ├─ CÓ "giá / mua / bán / ở đâu / cũ / thanh lý / đăng ký / khuyến mãi / chi phí / học phí / chính hãng / trả góp / đại lý"
  │     → MUA HÀNG
  └─ KHÔNG có modifier
       ↓
     Từ khóa ngắn (1-3 từ), tên danh mục chung ± thuộc tính?
       ├─ CÓ → TỪ KHÓA ĐA Ý ĐỊNH (Multi-Intent ⭐) → xếp vào MUA HÀNG
       └─ KHÔNG → phân tích ngữ cảnh thêm
```

### 3 giai đoạn

- **QUAN TÂM (Awareness):** tìm hiểu thông tin, chưa có ý định mua.
  VD: "máy lọc nước là gì", "nguyên lý lọc RO".
- **CÂN NHẮC (Consideration):** đã biết nhu cầu, đang so sánh lựa chọn.
  VD: "Karofi hay Kangaroo", "máy lọc nước loại nào tốt".
- **MUA HÀNG (Purchase):** đã quyết định, tìm nơi mua / giá tốt.
  VD: "mua máy lọc nước Karofi giá rẻ", "máy lọc nước ở đâu".

### Từ khóa đa ý định (Multi-Intent) ⭐

**Điểm khác biệt lớn nhất của framework này.**

Từ khóa ngắn, chung chung, KHÔNG có modifier (VD: "máy lọc nước", "khóa học golf", "xe đạp gấp")
**KHÔNG** xếp vào Quan Tâm. Xếp vào **MUA HÀNG** vì:

- Người Việt gõ ngắn dù đã sẵn sàng mua (CR thực tế 50-60%)
- Cần được phân bổ ngân sách đúng mức + ad copy CTA mạnh

**Bao gồm cả các biến thể cùng intent:** gõ không dấu ("may loc nuoc"), gõ liền ("maylocnuoc"),
viết tắt, và bản bỏ từ "mua" ("máy lọc nước" thay vì "mua máy lọc nước"). Tất cả → cùng insight.

**Xử lý:** gom thành nhóm riêng "Danh Mục – Đa Ý Định", KHÔNG trộn với từ khóa Mua Hàng có modifier.
Ad copy hybrid (vừa thông tin vừa CTA mạnh).

---

## Bước 3 — Phân nhóm theo cấu trúc đa tầng insight (BẮT BUỘC)

> Đây là phần lõi của skill. Tiếng Việt có rất nhiều sắc thái insight và insight có thể
> nằm ở **đầu, giữa hoặc cuối** từ khóa. Phân nhóm phải bám insight thực, không bám vị trí từ.

### Nguyên tắc gốc — insight quyết định nhóm, KHÔNG phải thứ tự chữ

Các từ khóa cùng một insight thực sự → **BẮT BUỘC chung 1 nhóm**, bất kể trật tự từ.

Ví dụ — cả 3 từ dưới đây cùng insight "mua xe cũ rẻ, ở đâu" → cùng 1 nhóm:

```
xe cũ rẻ mua ở đâu
ở đâu mua xe cũ rẻ
xe cũ mua rẻ ở đâu
```

→ Bộ phân nhóm phải **chuẩn hóa về tập từ + ý định**, không so khớp chuỗi theo thứ tự.

### Cấu trúc tầng: L1 → L2 → L3

- **L1 = cụm insight gốc** — cái khách hàng "neo" vào: một **thương hiệu**, một **danh mục/dòng sản phẩm**,
  hoặc một **chủ đề thuộc tính lớn**.
- **L2 = lớp ý định cộng thêm** trong L1 — rẻ / mua / ở đâu / giá / cũ-secondhand / một model cụ thể / đối tượng cụ thể...
- **L3 = tách sâu hơn** — CHỈ dùng khi 1 nhóm L2 vẫn còn lẫn nhiều insight con khác nhau (không bắt buộc).

**Tên nhóm = tên insight, KHÔNG phải action label.** (Đặt "Giá Brand A", "Xe Cũ Brand A" —
không đặt "Nhóm tìm giá", "Nhóm hỏi mua".)

#### Ví dụ A — danh mục "xe cũ"

```
L1: Xe Cũ                          (insight gốc: tìm xe đã qua sử dụng)
  L2: Xe Cũ – Chung                ← "xe cũ", "ô tô cũ" (chưa thêm ý định)
  L2: Rẻ / Giá Tốt                 ← "xe cũ rẻ", "xe cũ giá rẻ"
  L2: Mua                          ← "mua xe cũ rẻ", "cần mua xe cũ"
  L2: Địa Điểm / Ở Đâu             ← "xe cũ ở đâu", "mua xe cũ rẻ ở đâu" (mọi trật tự từ)
```

#### Ví dụ B — thương hiệu

```
L1: Thương Hiệu – Brand A
  L2: Tên Brand – Chưa Chọn Model  ← tất cả KW chỉ có brand, chưa rõ model
  L2: Model X – [model phổ biến]   ← tất cả KW về model đó
  L2: Giá Brand A                  ← tất cả KW hỏi giá brand đó
  L2: Xe Cũ / Secondhand Brand A   ← tất cả KW tìm hàng cũ của brand đó
```

- **SAI:** tách Brand A một nhóm, Brand B nhóm khác, rồi "giá Brand A" lại nằm ở chỗ khác.
- **ĐÚNG:** mọi insight về Brand A → gom về L1 "Thương Hiệu – Brand A", rồi mới tách L2 bên trong.

#### Gộp nhóm

Nhiều brand nhỏ cùng phân khúc (nhật bãi, startup VN, hàng luxury...) → gộp thành **1 L1**,
mỗi brand/nhóm brand là một **L2** bên trong.

### Tầng phụ — chênh lệch giá thầu (yếu tố phụ, áp dụng SAU insight)

Insight luôn được ưu tiên tuyệt đối. Sau khi đã gom xong theo insight (L1→L2→L3),
mới xét đến giá thầu như một **tầng phụ ở đáy**:

- Trong một nhóm insight cuối, nếu **chênh lệch CPC Min↔Max ≥ 1.000 VNĐ** (ngưỡng mặc định, có thể chỉnh)
  → tách thêm 1 tầng phụ: *CPC Thấp* / *CPC Cao*.
- Mỗi nhóm con CPC tối thiểu **3 từ khóa** mới đáng tách.
- Tầng phụ này **không bao giờ** dùng để trộn 2 insight khác nhau, cũng không phá vỡ một insight thực.
  Nó chỉ chia nhỏ trong cùng một insight để gom KW có mức thầu tương đồng vào cùng ad group.

### Trần kích thước nhóm

- Mỗi nhóm (sau khi đã tách đủ tầng) nên giữ trong khoảng **15–20 từ khóa**.
- Nếu vượt 20 → ưu tiên tách thêm theo **insight con (L3)** trước; chỉ khi insight đã thuần
  mà vẫn quá lớn mới dùng tầng phụ CPC để chia.

---

## Bước 4 — Tính ngân sách

### Giả định mặc định (user có thể đổi)

| Chỉ số | Mặc định |
|---|---|
| CTR | 8% |
| CR | 1.5% |
| Hệ số CPC | 80% |

### Công thức

```
CPC TB        = (CPC Min + CPC Max) / 2
CPC thực tế   = CPC TB × hệ số CPC (mặc định 80%)
Click / tháng = Volume × CTR
Ngân sách     = Click × CPC thực tế
Chuyển đổi    = Click × CR
```

### Kế thừa CPC (cho từ khóa thiếu dữ liệu CPC) — theo đúng cấu trúc tầng

Thứ tự ưu tiên:

1. **Dữ liệu gốc** (KW có sẵn CPC)
2. **CPC TB của nhóm L2** chứa KW đó
3. **CPC TB của nhóm L1** chứa KW đó
4. **CPC TB của cả giai đoạn**

Đánh dấu rõ nguồn trong cột "Nguồn CPC": `"Dữ liệu gốc"` hoặc `"Kế thừa: [tên nhóm L2/L1]"`.
Từ khóa kế thừa hiển thị font **italic, màu xám**.

---

## Bước 5 — Xuất file Excel (.xlsx) — 6 sheet

### Sheet 1: Giả Định & Công Thức
- Bảng giả định CTR / CR / hệ số CPC (nền xanh, bold, dễ thay đổi)
- Bảng công thức tính
- Quy tắc kế thừa CPC (L2→L1→giai đoạn) + logic phân loại hành trình + nguyên lý phân tầng insight

### Sheet 2: Tổng Hợp Ngân Sách
Toàn bộ từ khóa, sort theo **ngân sách giảm dần**. Cột (đúng thứ tự):

```
# | Giai Đoạn | L1 Nhóm Insight | L2 Insight Sâu | Từ Khóa | Insight Chi Tiết |
Volume | Cạnh Tranh | CPC Min | CPC Max | CPC TB | CPC ×80% | Click | Ngân Sách | Chuyển Đổi | Nguồn CPC
```

- **Insight Chi Tiết** = ghi chú ngắn (free-text) mô tả sắc thái riêng của từng KW
  (VD: "intent mua gấp", "so sánh giá", "gõ không dấu", "bỏ từ mua"). Nếu có dùng L3 thì
  gộp nhãn L3 vào đầu ô này.
- Dòng **TỔNG CỘNG** dùng SUM formula.
- **Freeze pane tại cột F** (giữ cố định từ # đến Insight Chi Tiết), bật auto filter.
- Từ khóa kế thừa CPC: font italic, màu xám.

### Sheet 3: Thống Kê Giai Đoạn
- Tổng hợp 3 giai đoạn theo **cấu trúc L1 → L2**: số KW, volume, ngân sách, chuyển đổi.
- Biểu đồ tròn phân bổ ngân sách theo giai đoạn.

### Sheet 4: Mua Hàng (tab xanh lá)
### Sheet 5: Cân Nhắc (tab cam)
### Sheet 6: Quan Tâm (tab xanh dương)
Mỗi sheet trình bày theo cấu trúc tầng:

```
[Banner L1]  ───────────────────────────────
   [Header L2]
      row từ khóa ...
      row từ khóa ...
   [Subtotal L2]   ← SUM formula
   [Header L2 kế]
      ...
   [Subtotal L2]
[Tổng sheet]       ← SUM formula
```

### Format Excel
- Font Arial 10-11; header chính nền **#1B5E20** chữ trắng bold
- Nền giai đoạn: MUA HÀNG **#E8F5E9** | CÂN NHẮC **#FFF3E0** | QUAN TÂM **#E3F2FD**
- **L1 banner**: nền đậm theo stage | **L2 header**: nền nhạt hơn cùng tông
- **Subtotal L2**: nền **#F5F5F5** | **Grand total**: nền **#263238** chữ trắng
- Viền **#D0D0D0**, số format `#,##0`
- **Dùng Excel formula cho MỌI tổng/subtotal — KHÔNG hardcode**
- Chạy `python ~/.gemini/config/skills/google-ads-master/scripts/recalc_xlsx_check.py <file>` sau khi tạo để đảm bảo 0 formula error

---

## Bước 6 — Trình bày kết quả

Sau khi xuất file:
1. Present file cho user.
2. Tóm tắt: tổng từ khóa, tổng ngân sách, số chuyển đổi dự kiến.
3. Phân bổ ngân sách theo 3 giai đoạn (% + số tiền).
4. Gợi ý chiến lược ads cho nhóm Multi-Intent + các nhóm L1 ngân sách lớn nhất.

---

## Lưu ý quan trọng

- **Insight là gốc** — mọi phân nhóm bắt đầu từ insight thực, không từ trật tự từ hay CPC.
- Cùng insight + khác trật tự từ → vẫn chung 1 nhóm (chuẩn hóa tập từ + ý định).
- Tên nhóm = tên insight, không phải action label.
- Mọi insight về cùng 1 brand/danh mục → gom về 1 L1 trước, rồi mới tách L2.
- Tầng phụ CPC chỉ áp dụng sau insight, ngưỡng ≥ 1.000 VNĐ, mỗi nhóm con ≥ 3 KW, không phá vỡ insight.
- Mỗi nhóm 15–20 KW; vượt thì tách L3 (insight con) trước, CPC sau.
- Từ khóa ranh giới 2 giai đoạn → ưu tiên giai đoạn gần hành động mua hơn.
- "Giá" + tên sản phẩm → luôn Mua Hàng.
- Multi-Intent → luôn Mua Hàng, nhóm "Danh Mục – Đa Ý Định" riêng, ad copy hybrid.
- Dự án mới chưa có data CR → tạm xếp Multi-Intent vào Mua Hàng, theo dõi CR 2-4 tuần đầu.
