# Quy Tắc Đồng Bộ 3 Trụ Cột Xuyên Suốt Tập Phim: Nhân Vật (`uid`) – Bối Cảnh (`loc`) – Đồ Vật Chính (`prop`)

Tài liệu này giải quyết triệt để bài toán giữ tính nhất quán 100% của **Nhân vật**, **Bối cảnh không gian** và **Đồ vật/Đạo cụ chính** từ Cảnh 01 đến Cảnh cuối cùng của tập phim trên Google Flow (`Nano Banana Pro` + `Veo 3.1`).

---

## 1. Trụ Cột 1: Đồng Bộ Nhân Vật Xuyên Suốt Tập Phim (`Character Continuity Lock: uid01..uid06`)

### 1.1. Công Thức Viết Prompt Bảng Nhân Vật 3 Góc (`B2_Nhan_Vat.csv`)
Mỗi nhân vật bắt buộc tạo **1 tấm Character Identity Turnaround Sheet** trên nền xám trung tính và **bắt buộc ghi rõ giày/hài** (nếu không ghi giày, AI sẽ cắt thành ảnh bán thân):

```text
[uid01] Exquisite 3D Stylized Ancient Historical Drama CG Animation (Unreal Engine 5 Donghua Cinema aesthetic, non-photorealistic fictional stylized 3D animated character). 16:9 horizontal Character Identity Turnaround Sheet showing three views of the same adult royal empress on a clean neutral warm-grey studio background: (Left) full-body front view standing with hands naturally at sides wearing ornate crimson-gold silk phoenix robes AND golden embroidered palace shoes; (Center) full-body side profile view; (Right) high-detail close-up portrait of her regal oval face, sharp phoenix eyes with a tiny red beauty mark at the outer corner of the right eye, high-crowned black hair with a golden phoenix hairpin. Purely visual character sheet, no text, no labels, no watermarks.
```

### 1.2. Cơ Chế Khóa Kép (`mediaId Ingredients` + `CHAR_DNA_LOCK` 6 Lớp)
- **Khóa bằng ảnh tham chiếu (`mediaId`):** Mọi dòng trong `B3_Prompt_Anh_Canh.csv` mở đầu bằng `[SCENE_XX] [{uid01}, {uid02}]` để công cụ tự động đính kèm ảnh gốc của nhân vật vào ô **Ingredients** trên Google Flow.
- **Khóa bằng hằng số chữ (`CHAR_DNA_LOCK`):** Khai báo biến hằng số trong Python (`CHAR_UID01`, `CHAR_UID02`...) chứa đủ 6 lớp nhận diện (Tuổi trưởng thành + Khuôn mặt/Nốt ruồi + Kiểu tóc/Trâm cài + Trang phục/Chất liệu + Màu sắc cố định) và **nhúng nguyên văn** vào mọi cảnh nhân vật đó xuất hiện.

### 1.3. Bảng Vượt 100% 4 Bộ Lọc Chính Sách Google Flow (`PROMINENT_PEOPLE`, `MINOR`, `SAFETY`)

| Loại Bộ Lọc Của Google Flow | ❌ Từ Khóa Bị Cấm Tuyệt Đối (Gây Lỗi Đỏ) | ✅ Cụm Từ Chuẩn Thay Thế (Vượt Lọc 100%) |
| :--- | :--- | :--- |
| **1. Bộ lọc Người thật (`PROMINENT_PEOPLE`)** | `photorealistic human`, `real actress`, `real human face`, `celebrity`, `live-action` | `Exquisite 3D Stylized ... CG Animation (Unreal Engine 5 Donghua Cinema aesthetic, fictional stylized 3D animated character, non-photorealistic)` |
| **2. Bộ lọc Độ tuổi (`MINOR_FILTER`)** | Ghi số tuổi cụ thể: `18-year-old`, `21-year-old`, `22yo`, `young girl`, `teenager` | Chỉ dùng danh xưng trưởng thành: `adult royal empress`, `adult imperial regent`, `adult billionaire CEO`, `mature noblewoman` |
| **3. Bộ lọc An toàn Tiếng Anh (`SAFETY` - EN)** | `blood`, `blood-stained`, `poison`, `assassinate`, `kill`, `murder`, `corpse`, `stab` | `crimson vermilion seal`, `secret imperial decree`, `palace ambush`, `black iron feathered dart`, `deflecting with a burst of golden sparks` |
| **4. Bộ lọc An toàn Thoại Việt (`SAFETY` - VI)** | `"huyết thư"`, `"không chết"`, `"giết ngươi"`, `"tính mạng"`, `"thuốc độc"` | `"bức mật chỉ"`, `"vẫn sống sót"`, `"xử tội"`, `"sự an nguy"`, `"chén trà bị tráo"` |

---

## 2. Trụ Cột 2: Đồng Bộ Bối Cảnh & Không Gian Xuyên Suốt Tập Phim (`Location Continuity Lock: loc01..loc05`)

### 2.1. Công Thức Khóa Bối Cảnh 4 Lớp (`4-Layer Location DNA Lock`)
Để các cảnh trong cùng một căn phòng/cung điện không bị đổi màu cột, đổi gạch lát sàn hay đổi ánh sáng, mỗi bối cảnh (`LOC_01..LOC_03`) phải được định nghĩa bằng một hằng số cố định gồm 4 lớp và **lặp lại nguyên văn 100% ở mọi cảnh thuộc bối cảnh đó**:

$$\text{LOC\_LOCK} = [\text{L1: Kiến trúc \& Vật liệu sàn/cột}] + [\text{L2: 3 Vật mốc cố định hậu cảnh}] + [\text{L3: Thời tiết \& Thời gian}] + [\text{L4: Nhiệt độ màu ánh sáng (Kelvin)}]$$

| Mã Bối Cảnh | Tên Bối Cảnh | Chuỗi Hằng Số Khóa Bối Cảnh (`LOC_LOCK` — Ghép nguyên văn vào mọi cảnh cùng không gian) |
| :--- | :--- | :--- |
| **`LOC_01`** *(Cổ trang)* | **Sân Chầu Trước Điện Kim Loan Đêm Tuyết** | `in the grand courtyard before Jinluan Imperial Throne Hall at night: towering vermilion-red lacquered wooden pillars carved with golden dragons, white carved marble staircase leading up to the bronze palace doors, blazing bronze fire braziers casting warm 2700K amber rim light against cold 6500K moonlit falling snow` |
| **`LOC_02`** *(Cổ trang)* | **Đại Điện Kim Loan** | `inside the monumental Jinluan Imperial Throne Hall: polished dark-grey basalt stone floor reflecting flickering bronze oil lamps, two rows of massive vermilion-red dragon pillars, elevated golden dragon throne dais behind translucent silk curtains, high-contrast chiaroscuro warm gold and deep shadow lighting` |
| **`LOC_03`** *(Hiện đại)* | **Sảnh Tiệc Tầng 68 Landmark** | `inside the ultra-luxury 68th-floor sky penthouse banquet hall at night: floor-to-ceiling panoramic glass walls overlooking the glowing Saigon skyline, Italian Nero Marquina black marble floor, giant crystal chandelier overhead casting 3200K champagne-gold light, red velvet VIP stage carpet` |

### 2.2. Quy Tắc Trục Máy Quay 180 Độ (`180-Degree Camera Axis Lock`)
- Khóa cứng vị trí không gian của hai phe đối lập trong suốt tập phim:
  - **Phe Chính Diện (`uid01`):** Luôn đặt ở **bên trái khung hình nhìn hướng sang phải** (`positioned on the left foreground, facing right toward the marble steps`).
  - **Phe Đối Đầu (`uid02`, `uid03`):** Luôn đặt ở **bên phải khung hình hoặc trên bậc thềm cao nhìn xuống trái** (`standing on the upper steps on the right, looking down toward the left`).

---

## 3. Trụ Cột 3: Đồng Bộ Đồ Vật / Đạo Cụ Chính Xuyên Suốt Tập Phim (`Key Prop / Hero Object Lock: prop01..prop06`)

### 3.1. Công Thức Khóa Đồ Vật Chính 4 Lớp (`4-Layer Hero Prop DNA Lock`)
Mọi đồ vật đóng vai trò mở nút thắt trong tập phim (mật chỉ, hộp gấm, ngọc bội, hổ phù, hợp đồng ly hôn, nhẫn kim cương, thẻ đen...) bắt buộc phải khai báo thành biến hằng số `PROP_LOCK` theo công thức 4 lớp:

$$\text{PROP\_LOCK} = [\text{P1: Kích thước bằng cm \& Tỷ lệ bàn tay}] + [\text{P2: Chất liệu \& Màu sắc cố định}] + [\text{P3: Chi tiết nhận diện độc nhất (Vết nứt/Ấn đỏ/Chữ khắc)}] + [\text{P4: Tư thế cầm nắm}]$$

### 3.2. Bảng Mẫu Hằng Số Khóa Đồ Vật Chính (`PROP_LOCK`)

| Mã Đồ Vật | Tên Đồ Vật Chính | Chuỗi Hằng Số Khóa Đồ Vật (`PROP_LOCK` — Nhúng nguyên văn vào mọi cảnh `B3` & `B5` có đồ vật xuất hiện) |
| :--- | :--- | :--- |
| **`PROP_01`** | **Bức Mật Chỉ Lụa Vàng** | `an ancient imperial golden silk scroll (25cm wide, 40cm unrolled length) with dark bronze roller rods, black calligraphy ink text, and a glowing square crimson vermilion imperial seal stamped in the center` |
| **`PROP_02`** | **Chiếc Hộp Gấm Đen Khóa Đồng** | `a rectangular black-and-gold brocade silk presentation box (22cm long, 14cm wide, 8cm high) with an antique engraved bronze clasp and crimson velvet interior lining` |
| **`PROP_03`** | **Ngọc Bội Phượng Hoàng Đỏ Nứt Đôi** | `a translucent blood-red mutton-fat jade phoenix pendant (7cm long, 4cm wide, fits in one palm) with a jagged diagonal fracture line across the phoenix wing and a braided crimson silk tassel` |
| **`PROP_04`** | **Hổ Phù Bắc Cảnh Đồng Đen** | `a heavy carved dark-bronze Northern Border Tiger Tally (10cm long, 5cm high, held firmly in one raised hand) shaped like a crouching roaring tiger inlaid with glowing gold military seal script` |
| **`PROP_05`** | **Hợp Đồng Ly Hôn / Cổ Phần** | `a matte-black leather-bound legal folder (21cm x 30cm A4 size) opened to reveal crisp white contract pages with a gold foil embossed corporate crest and a red thumbprint ink seal at the bottom right` |
| **`PROP_06`** | **Thẻ Đen Quyền Lực Chủ Tịch** | `a solid brushed black-titanium Centurion card (8.5cm x 5.4cm, held between index and middle fingers) with laser-etched gold dragon emblem catching the chandelier light` |

### 3.3. Hai Cấp Độ Đồng Bộ Đồ Vật Chính Trên Google Flow
1. **Cấp độ 1 (`Text Token Lock` — Bắt buộc cho mọi đồ vật):** Nhúng nguyên văn biến `PROP_0X` (có ghi rõ kích thước `cm` và tỷ lệ bàn tay) vào mọi cảnh `B3` và `B5` mà đồ vật đó xuất hiện.
2. **Cấp độ 2 (`Ingredient Prop Sheet` — Dành cho Bảo vật xuất hiện cận cảnh `>= 5` lần):** Tạo thêm dòng `[prop01]` trong `B2_Nhan_Vat.csv` vẽ bảng 3 góc của đồ vật trên nền xám, thu hồi `mediaId` và đính kèm vào `[SCENE_XX] [{uid01}, {prop01}]`.
