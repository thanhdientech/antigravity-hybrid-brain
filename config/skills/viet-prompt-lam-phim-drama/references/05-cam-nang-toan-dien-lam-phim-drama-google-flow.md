# 🎬 CẨM NANG TOÀN DIỆN: QUY TRÌNH VIẾT PROMPT, ĐỒNG BỘ 3 TRỤ CỘT (NHÂN VẬT – BỐI CẢNH – ĐỒ VẬT CHÍNH), GHÉP NHẠC 6 CAO TRÀO & EDIT NHỊP NHANH – CHẬM TRÊN GOOGLE FLOW

> **Tài liệu chuẩn hóa thực chiến từ 2 dự án mẫu:**
> 1. **Cổ Trang Cung Đấu (`16:9`):** **《PHẾ HẬU TRỞ VỀ: BỨC HUYẾT THƯ TRƯỚC ĐIỆN KIM LOAN》** (`38 phân cảnh` — Project Google Flow: `ca77f63e-f1eb-4dee-bb62-d4f13eacd558`)
> 2. **Hiện Đại Hào Môn Báo Thù (`9:16`):** **《CHỦ TỊCH ẨN DANH: TIỆC LY HÔN TẦNG 68》** (`5 Tập x 25 Cảnh = 125 phân cảnh`)
> - **Hệ thống công cụ thực thi:** `Google Flow (Nano Banana Pro + Veo 3.1 Lite)` + `Suno AI v4.5` + `Timeline Studio / FlowKit (:8100)` + `FFmpeg Fast/Slow Pacing Director Engine`
> - **Bộ đôi Skill chuyên trách trên Antigravity:**
>   - Skill riêng viết kịch bản: [`viet-kich-ban-drama`](file:///C:/Users/INFOASIA/.gemini/config/skills/viet-kich-ban-drama/SKILL.md)
>   - Skill riêng viết prompt & hậu kỳ: [`viet-prompt-lam-phim-drama`](file:///C:/Users/INFOASIA/.gemini/config/skills/viet-prompt-lam-phim-drama/SKILL.md)

---

## PHẦN 1: SƠ ĐỒ TỔNG THỂ QUY TRÌNH 5 BƯỚC (TỪ KỊCH BẢN ĐẾN BẢN DỰNG ĐẠO DIỄN)

```
[BƯỚC 1: TIỀN KỲ & KHÓA ĐỒNG BỘ 3 TRỤ CỘT XUYÊN SUỐT TẬP PHIM]
  ├─ Trụ cột 1 (Nhân vật - uid01..uid06): Tạo Turnaround Sheet 3 góc bằng Nano Banana Pro -> Khóa `mediaId`
  ├─ Trụ cột 2 (Bối cảnh - loc01..loc05): Khóa hằng số Kiến trúc + Vật mốc nền + Trục máy 180 độ + Độ K màu
  └─ Trụ cột 3 (Đồ vật chính - prop01..prop05): Khóa kích thước (cm) + Chất liệu + Dấu hiệu nhận diện độc nhất
         │
         ▼
[BƯỚC 2: TẠO ẢNH CẢNH FIRST FRAME ĐÍNH KÈM INGREDIENTS (B3_Prompt_Anh_Canh.csv)]
  ├─ Ghép `[SCENE_XX] [{uid01}]` + `STYLE_LOCK` + `LOC_LOCK` + `CHAR_LOCK` + `PROP_LOCK (cm)` + Tiêu cự ống kính
  └─ Render tự động qua `flow_ui_batch.py` (3 luồng/đợt) -> Lưu `SCENE_01.png .. SCENE_38.png`
         │
         ▼
[BƯỚC 3: TẠO VIDEO VEO 3.1 CÓ GIỌNG ĐỌC TIẾNG VIỆT GỐC (B5_Prompt_Video_English.csv)]
  ├─ Đính kèm `firstFrameId` của từng cảnh + 1 chuyển động máy + 1 hành động + 1 câu thoại Tiếng Việt (14-20 từ)
  └─ Bắt buộc tắt nhạc nền trong lúc sinh video ("No background music") để không bị đứt nhạc khi ghép cảnh
         │
         ▼
[BƯỚC 4: SÁNG TÁC NHẠC NỀN 6 CAO TRÀO & HÒA ÂM Đẩy Đỉnh Cảm Xúc (B9_Music_Prompts.csv)]
  ├─ Chia tập phim thành 6 Hồi Cao Trào (BPM từ 86 -> 138 BPM) sáng tác bằng Suno AI v4.5
  ├─ Hòa âm 3 lớp: Lọc tần số 2400Hz/2800Hz + Tự động hạ nhạc khi thoại (24%) & dâng trào sau thoại (66%)
  └─ Điểm xuyết 9 loại SFX đòn bẩy cao trào (Chuông đồng, Trống trận, Nhịp tim, Ngọc ngân, Kiếm đỡ tên, Sub-drop)
         │
         ▼
[BƯỚC 5: DỰNG HẬU KỲ NHỊP NHANH – CHẬM & NHẢY GÓC MÁY QUANG HỌC (build_fast_paced_director_cut.py)]
  ├─ Cắt bỏ khoảng lặng thừa đầu/cuối cảnh (từ 8.0s rút gọn còn 2.8s – 5.6s/cảnh tùy chế độ Nhanh/Chậm)
  ├─ Điều phối 4 Chế Độ Nhịp Độ: ACTION_BLITZ (Cực nhanh) / REACTION_SNAP / CONFRONTATION_FAST / EMOTIONAL_CLIMAX (Chậm lắng)
  └─ Nhảy góc cận cảnh 1.16x–1.32x giữa câu thoại + Trải liền mạch 6 chương nhạc nền + Xuất MP4 (-14 LUFS)
```

---

## PHẦN 2: QUY TẮC ĐỒNG BỘ 3 TRỤ CỘT XUYÊN SUỐT TẬP PHIM (NHÂN VẬT – BỐI CẢNH – ĐỒ VẬT CHÍNH)

Lỗi lớn nhất khiến phim AI trông nghiệp dư là: **Cảnh 1 nhân vật mặc áo đỏ, sang Cảnh 5 biến thành áo cam; Cảnh 2 đứng ở đại điện cột gỗ đỏ, sang Cảnh 4 cột biến thành đá trắng; Cảnh 3 cầm bức mật chỉ lụa vàng 25cm, sang Cảnh 6 biến thành tờ giấy trắng to bằng cái chiếu.**

Để triệt tiêu 100% lỗi này, mọi tập phim bắt buộc phải khóa cứng **Bộ Hằng Số Đồng Bộ 3 Trụ Cột (`3-Pillar Continuity Lock`)** ngay trong script sinh CSV (`build_project_csvs.py`):

### 2.1. Trụ Cột 1 — Đồng Bộ Nhân Vật Xuyên Suốt Tập Phim (`Character Continuity Lock: uid01..uid06`)

1. **Tạo Bảng Nhân Vật 3 Góc (`B2_Nhan_Vat.csv`) & Khóa `mediaId` trên Google Flow:**
   - Mỗi nhân vật tạo **1 tấm Character Identity Turnaround Sheet** (`16:9` hoặc `9:16`) gồm 3 góc trên nền xám trung tính: **(Trái) Toàn thân nhìn thẳng có thấy rõ giày/hài**; **(Giữa) Toàn thân nhìn nghiêng 90 độ**; **(Phải) Cận cảnh gương mặt sắc nét**.
   - **Bắt buộc ghi rõ giày/hài** (`wearing golden embroidered palace shoes` hoặc `wearing polished black leather Oxford shoes`) để AI luôn vẽ đủ toàn thân từ đầu đến chân.
   - Sau khi tạo trên Google Flow, công cụ tự động lưu `mediaId` của từng nhân vật vào `flow_config.json` để đính kèm làm **Ingredient** cho mọi cảnh có mặt nhân vật đó.
2. **Khóa Chuỗi Mô Tả Ngoại Hình Cố Định (`CHAR_DNA_LOCK` — 6 Lớp):**
   - Trong `B3_Prompt_Anh_Canh.csv` và `B5_Prompt_Video_English.csv`, không bao giờ chỉ viết mỗi `[uid01]` rồi bỏ trống mô tả, mà phải **dán kèm chuỗi hằng số `CHAR_DNA_LOCK`** giống nhau từng chữ ở mọi cảnh:
     $$\text{CHAR\_DNA\_LOCK} = [\text{Danh xưng trưởng thành}] + [\text{Khuôn mặt \& Dấu hiệu đặc trưng}] + [\text{Kiểu tóc \& Trâm/Phụ kiện}] + [\text{Trang phục \& Chất liệu}] + [\text{Màu sắc cố định}]$$
   - *Ví dụ Nữ chính Cổ trang (`uid01`):*
     ```text
     adult royal empress with regal oval face, sharp phoenix eyes with a tiny red beauty mark at the outer corner of the right eye, high-crowned black hair with a golden phoenix hairpin, wearing ornate crimson-and-gold embroidered silk phoenix robes
     ```
   - *Ví dụ Nam chính Hiện đại (`uid01`):*
     ```text
     adult Vietnamese male billionaire CEO, angular jawline, calm piercing dark eyes, neatly styled jet-black undercut hair, wearing a bespoke charcoal-black three-piece suit with a silver silk tie and a brushed titanium tourbillon watch on his left wrist
     ```

### 2.2. Trụ Cột 2 — Đồng Bộ Bối Cảnh & Không Gian Xuyên Suốt Tập Phim (`Location Continuity Lock: loc01..loc05`)

1. **Nguyên nhân làm lệch bối cảnh:** Nếu Cảnh 1 viết *"in front of a grand palace"*, Cảnh 2 viết *"standing on marble steps"*, Cảnh 3 viết *"inside an imperial courtyard at night"*, AI sẽ vẽ ra **3 cung điện hoàn toàn khác nhau**.
2. **Giải pháp Khóa Bối Cảnh 4 Lớp (`4-Layer Location DNA Lock`):**
   - Chia mỗi tập phim thành **1 đến 3 Bối cảnh cố định (`LOC_01`, `LOC_02`, `LOC_03`)**. Mỗi bối cảnh được định nghĩa bằng một chuỗi hằng số tiếng Anh gồm đủ 4 lớp và **bắt buộc ghép nguyên văn chuỗi này vào tất cả các cảnh diễn ra tại bối cảnh đó**:
     $$\text{LOC\_LOCK} = [\text{L1: Kiến trúc \& Vật liệu nền}] + [\text{L2: 3 Vật mốc cố định hậu cảnh}] + [\text{L3: Thời tiết \& Thời gian}] + [\text{L4: Nhiệt độ màu ánh sáng}]$$
   - **Bảng Mẫu Hằng Số Khóa Bối Cảnh (`LOC_LOCK`) Đã Kiểm Chứng:**

| Mã Bối Cảnh | Tên Bối Cảnh Trong Tập Phim | Chuỗi Hằng Số Khóa Bối Cảnh (`LOC_LOCK` — Copy nguyên văn vào mọi cảnh cùng không gian) |
| :--- | :--- | :--- |
| **`LOC_01`** *(Cổ trang)* | **Sân Chầu Trước Điện Kim Loan Đêm Tuyết** | `in the grand courtyard before Jinluan Imperial Throne Hall at night: towering vermilion-red lacquered wooden pillars carved with golden dragons, white carved marble staircase leading up to the bronze palace doors, blazing bronze fire braziers casting warm 2700K amber rim light against cold 6500K moonlit falling snow` |
| **`LOC_02`** *(Cổ trang)* | **Bên Trong Đại Điện Kim Loan** | `inside the monumental Jinluan Imperial Throne Hall: polished dark-grey basalt stone floor reflecting flickering bronze oil lamps, two rows of massive vermilion-red dragon pillars, elevated golden dragon throne dais behind translucent silk curtains, high-contrast chiaroscuro warm gold and deep shadow lighting` |
| **`LOC_03`** *(Hiện đại)* | **Sảnh Tiệc Ly Hôn Tầng 68 Landmark** | `inside the ultra-luxury 68th-floor sky penthouse banquet hall at night: floor-to-ceiling panoramic glass walls overlooking the glowing Saigon skyline, Italian Nero Marquina black marble floor, giant crystal chandelier overhead casting 3200K champagne-gold light, red velvet VIP stage carpet` |

3. **Quy Tắc Trục Máy Quay 180 Độ (`180-Degree Spatial Axis Rule`):**
   - Trong cùng một cuộc đối đầu, **khóa cứng vị trí đứng của phe chính diện và phe phản diện**:
     - *Phe Chính Diện (`uid01` — Nữ chính / Chủ tịch ẩn danh):* Luôn đứng ở **bên trái khung hình hoặc dưới chân bậc thềm nhìn hướng lên phải** (`positioned on the left foreground, facing right toward the throne steps`).
     - *Phe Đối Đầu (`uid02`, `uid03` — Nhiếp Chính Vương / Quý phi / Kẻ phản bội):* Luôn đứng ở **bên phải khung hình hoặc trên bậc thềm cao nhìn xuống trái** (`standing on the upper marble steps on the right, looking down toward the left`).
   - Nhờ khóa trục 180 độ này, khi cắt dựng nối tiếp 38 cảnh, ánh mắt các nhân vật nhìn thẳng vào nhau như quay tại phim trường thật!

### 2.3. Trụ Cột 3 — Đồng Bộ Đồ Vật / Đạo Cụ Chính Xuyên Suốt Tập Phim (`Key Prop / Hero Object Lock: prop01..prop05`)

Trong phim Drama (cả Cổ trang lẫn Hiện đại), các nút thắt lật kèo luôn xoay quanh **2 đến 4 Đồ vật chính (Tín vật định mệnh, Vật chứng vạch mặt, Vũ khí, Bảo vật quyền lực)**. Nếu không khóa đồ vật, AI sẽ vẽ sai kích thước, sai màu sắc, hoặc biến mất hoa văn giữa các cảnh.

#### A. Công Thức Khóa Đồ Vật Chính 4 Lớp (`4-Layer Hero Prop DNA Lock`)
Mỗi đồ vật chính bắt buộc được khai báo thành một hằng số `PROP_LOCK` có đủ 4 thông số:

$$\text{PROP\_LOCK} = [\text{P1: Kích thước thực tế bằng cm \& Tỷ lệ so với bàn tay}] + [\text{P2: Chất liệu \& Màu sắc cố định}] + [\text{P3: Chi tiết nhận diện độc nhất (Vết nứt/Ấn đỏ/Chữ khắc)}] + [\text{P4: Cách cầm nắm trên tay}]$$

> **Quy tắc bắt buộc về kích thước (`cm`):** Luôn ghi rõ kích thước bằng `cm` kèm câu neo tỷ lệ bàn tay (`fits in one palm`, `held between thumb and index finger`, `held with both hands at chest level`). Nếu không ghi `7cm long, fits in one palm`, AI rất dễ vẽ miếng ngọc bội to bằng cái khiên!

#### B. Bảng Mẫu Khóa Đồ Vật Chính (`PROP_LOCK`) Xuyên Suốt Tập Phim

| Mã Đồ Vật | Tên Đồ Vật Chính Trong Phim | Chuỗi Hằng Số Khóa Đồ Vật (`PROP_LOCK` — Nhúng nguyên văn vào mọi cảnh `B3` & `B5` có đồ vật xuất hiện) | Xuất Hiện Ở Các Cảnh |
| :--- | :--- | :--- | :--- |
| **`PROP_01`** *(Cổ trang)* | **Bức Mật Chỉ Lụa Vàng Của Tiên Đế** | `an ancient imperial golden silk scroll (25cm wide, 40cm unrolled length) with dark bronze roller rods, black calligraphy ink text, and a glowing square crimson vermilion imperial seal stamped in the center` | `SCENE_02, 03, 04, 05, 09, 22` |
| **`PROP_02`** *(Cổ trang)* | **Chiếc Hộp Gấm Đen Khóa Đồng** | `a rectangular black-and-gold brocade silk presentation box (22cm long, 14cm wide, 8cm high) with an antique engraved bronze clasp and crimson velvet interior lining` | `SCENE_10, 11, 12, 13, 14` |
| **`PROP_03`** *(Cổ trang)* | **Ngọc Bội Phượng Hoàng Đỏ Bị Vỡ Đôi** | `a translucent blood-red mutton-fat jade phoenix pendant (7cm long, 4cm wide, fits in one palm) with a jagged diagonal fracture line across the phoenix wing and a braided crimson silk tassel` | `SCENE_13, 14, 15, 16, 17, 19, 21` |
| **`PROP_04`** *(Cổ trang)* | **Hổ Phù Bắc Cảnh Bằng Đồng Đen** | `a heavy carved dark-bronze Northern Border Tiger Tally (10cm long, 5cm high, held firmly in one raised hand) shaped like a crouching roaring tiger inlaid with glowing gold military seal script` | `SCENE_32, 33, 34, 35, 36, 38` |
| **`PROP_05`** *(Hiện đại)* | **Hợp Đồng Ly Hôn & Chuyển Nhượng Cổ Phần** | `a matte-black leather-bound legal folder (21cm x 30cm A4 size) opened to reveal crisp white contract pages with a gold foil embossed corporate crest and a red thumbprint ink seal at the bottom right` | `SCENE_02, 04, 08, 15, 21` |
| **`PROP_06`** *(Hiện đại)* | **Thẻ Đen Quyền Lực / Ấn Tín Chủ Tịch** | `a solid brushed black-titanium Centurion card (8.5cm x 5.4cm, held between index and middle fingers) with laser-etched gold dragon emblem catching the chandelier light` | `SCENE_12, 16, 18, 23, 25` |

#### C. Hai Cấp Độ Đồng Bộ Đồ Vật Chính Trên Google Flow
- **Cấp độ 1 — Đồng bộ bằng Hằng số Văn bản (`Text Token Lock` — Mặc định cho mọi đồ vật):** Đặt biến `PROP_01..PROP_06` trong Python script và chèn tự động vào cả prompt ảnh `B3` lẫn prompt video `B5` ở mọi cảnh đồ vật đó xuất hiện.
- **Cấp độ 2 — Đồng bộ bằng Ảnh Tham Chiếu (`Ingredient Prop Sheet` — Dành cho Bảo vật siêu quan trọng xuất hiện `>= 5` cảnh cận):** Tạo thêm 1 dòng `[prop01]` trong `B2_Nhan_Vat.csv` vẽ tấm ảnh 3 góc của chính đồ vật đó trên nền xám, thu lấy `mediaId` và đính kèm thẳng vào `[SCENE_15] [{uid01}, {prop01}]` để Google Flow vẽ lại đúng 100% từng đường vân chạm khắc!

### 2.4. Bảng Quy Tắc Vượt 100% Bộ Lọc Chính Sách Google Flow (`38/38 Cảnh Không Lỗi Đỏ`)

| Loại Bộ Lọc Của Google Flow | ❌ Từ Khóa Bị Cấm Tuyệt Đối (Dễ Bị Lỗi Đỏ) | ✅ Cụm Từ Chuẩn Thay Thế (Vượt Lọc 100%) |
| :--- | :--- | :--- |
| **1. Bộ lọc Khuôn mặt người thật (`PROMINENT_PEOPLE`)** | `photorealistic human`, `real actress`, `real human face`, `celebrity`, `live-action portrait` | `Exquisite 3D Stylized Ancient Historical Drama CG Animation (Unreal Engine 5 Donghua Cinema aesthetic, fictional stylized 3D animated character, non-photorealistic)` |
| **2. Bộ lọc Độ tuổi (`MINOR_FILTER`)** | Ghi số tuổi cụ thể: `18-year-old`, `21-year-old`, `22yo`, `young girl`, `teenager`, `child` | Chỉ dùng danh xưng trưởng thành: `adult royal empress`, `adult imperial regent`, `adult CEO billionaire`, `mature noblewoman` |
| **3. Bộ lọc An toàn Tiếng Anh (`SAFETY_FILTER` - EN)** | `blood`, `blood-stained`, `poison`, `assassinate`, `kill`, `murder`, `corpse`, `dead body`, `stab` | `crimson vermilion seal`, `secret imperial decree`, `palace ambush`, `black iron feathered dart`, `deflecting with a burst of golden sparks` |
| **4. Bộ lọc An toàn Lời Thoại Tiếng Việt (`SAFETY_FILTER` - VI)** | `"huyết thư"`, `"không chết"`, `"giết ngươi"`, `"tính mạng"`, `"thuốc độc"`, `"ra tay tàn độc"` | `"bức mật chỉ"`, `"vẫn sống sót"`, `"xử tội"`, `"sự an nguy"`, `"chén trà bị tráo"`, `"ra tay tuyệt tình"` |

---

## PHẦN 3: CÔNG THỨC VIẾT PROMPT ẢNH CẢNH (`B3`) & VIDEO `VEO 3.1` CÓ THOẠI TIẾNG VIỆT (`B5`)

### 3.1. Công Thức 6 Thành Phần Cho Prompt Ảnh Cảnh First Frame (`B3_Prompt_Anh_Canh.csv`)
Mỗi dòng trong `B3_Prompt_Anh_Canh.csv` bắt buộc ghép đủ 6 khối theo thứ tự chuẩn:

$$\text{Prompt B3} = [\text{SCENE\_XX \& UID}] + [\text{STYLE\_LOCK}] + [\text{Cỡ Cảnh \& Ống Kính}] + [\text{CHAR\_LOCK + Tư Thế}] + [\text{PROP\_LOCK (cm)}] + [\text{LOC\_LOCK}]$$

- **Chọn Tiêu cự ống kính theo mục đích kịch tính:**
  - `35mm lens` + `Wide establishing shot / Low angle`: Đại cảnh cung điện, sảnh tiệc, cảnh phục binh, cảnh quỳ hàng loạt.
  - `50mm lens` + `Medium shot / Medium close-up`: Cảnh đối thoại đối đầu, mở hộp gấm, rút kiếm, ném hợp đồng.
  - `85mm lens` + `Close-up / Extreme close-up`: Cảnh đặc tả ánh mắt rơi lệ, nụ cười lạnh, hoặc **cận cảnh đồ vật chính (`PROP_LOCK`)** với `shallow depth of field, creamy bokeh background`.

### 3.2. Công Thức Viết Prompt Video `Veo 3.1` Tự Nói Tiếng Việt Chuẩn Khẩu Hình (`B5_Prompt_Video_English.csv`)
1. **Quy tắc "1 Cảnh 8s = 1 Chuyển động máy + 1 Hành động đơn + 1 Câu thoại `14–20 từ`":**
   - Tốc độ nói tự nhiên của `Veo 3.1` là `3.2 – 3.8 từ/giây`. Câu thoại `14–20 từ` sẽ được nói trọn vẹn trong `4.0s – 5.2s`, không bao giờ bị cắt cụt chữ ở giây thứ 8.
2. **Khóa Mô Tả Chất Giọng (`Voice Timbre Lock`) Xuyên Suốt Tập Phim:**
   - **Nữ chính (Uy quyền, sắc lạnh):** `a clear, regal, emotionally resonant Vietnamese female voice (adult royal empress tone, crisp Northern Vietnamese pronunciation)`
   - **Nam chính (Trầm ấm, uy nghiêm):** `a deep, commanding, resonant Vietnamese male voice (adult imperial regent baritone, crisp Vietnamese pronunciation)`
   - **Nữ phụ phản diện (Sắc sảo, hoảng loạn):** `a sharp, expressive, dramatic Vietnamese female voice (adult scheming consort tone, crisp Vietnamese pronunciation)`
3. **3 Mẫu Prompt Âm Thanh Bắt Buộc Phân Biệt Rõ:**
   - **Mẫu A — Nhân vật nói trực tiếp trên hình (Có mấp máy môi `Lip-sync`):**
     ```text
     [0.0s-8.0s Action]: Slow camera push-in (50mm lens). The empress pulls off the red cord and snaps open the ancient imperial golden silk scroll (25cm wide, 40cm unrolled length) with both hands. She speaks aloud in a clear, regal Vietnamese female voice: "Nhìn cho rõ ấn tín của Tiên Đế! Kẻ tráo mật chỉ năm xưa chưa bao giờ là thần thiếp!" SFX: sharp snap of silk scroll unfurling, cold wind. No background music, no subtitles, no on-screen text.
     ```
   - **Mẫu B — Độc thoại nội tâm / Phản ứng sững sờ (Miệng ngậm chặt, KHÔNG mấp máy môi):**
     ```text
     [0.0s-8.0s Action]: Fast push-in to close-up (85mm lens). The regent stares downward at the translucent blood-red jade phoenix pendant (7cm long) with wide stunned eyes, his lips firmly closed, not speaking, silent micro-expression of shock. Internal monologue voiceover in a deep Vietnamese male voice while his mouth remains completely closed: "Là ngọc bội Phượng Hoàng thật... Chẳng lẽ suốt ba năm qua, bản vương đã trách nhầm nàng?" SFX: heavy low heartbeat thud, cold wind. No background music, no subtitles.
     ```
   - **Mẫu C — Cảnh Cận cảnh Đồ vật chính / Hành động thuần túy (Chỉ có SFX hoặc Thuyết minh ngoài khung hình):**
     ```text
     [0.0s-8.0s Action]: Dynamic low-angle tracking shot. The regent swings his black-iron sword upward, deflecting a flying black feathered dart mid-air in a bright burst of golden sparks before the vermilion dragon pillars. SFX: loud metallic clang of sword striking metal dart, shower of sparks, howling wind. No background music, no subtitles.
     ```

---

## PHẦN 4: NHẠC NỀN SỬ DỤNG THẾ NÀO & CAO TRÀO PHIM GHÉP THẾ NÀO (`6-PHASE BGM & CLIMAX MIXING`)

### 4.1. Nhạc Nền Sử Dụng Thế Nào? (Nguyên Tắc 6 Hồi Cao Trào Theo Biểu Đồ Nhịp Tim)
1. **Cấm sinh nhạc nền bên trong từng clip `Veo 3.1`:** Mỗi clip 8s của AI sẽ tự bịa một bài nhạc khác nhau; khi nối 25–38 cảnh sẽ bị đứt nhạc liên tục. Do đó ở Bước 3 luôn khóa `"No background music"`.
2. **Cấm dùng 1 bài nhạc nền chạy đều đều suốt 3–5 phút phim:** Phim drama cuốn hút vì cảm xúc thay đổi liên tục từ *U ám / Bị sỉ nhục* $\rightarrow$ *Đấu trí căng thẳng* $\rightarrow$ *Bi thương oan khuất* $\rightarrow$ *Sát cơ bùng nổ* $\rightarrow$ *Hành động dồn dập* $\rightarrow$ *Bá khí lật bàn*.
3. **Chia tập phim thành 6 Chương Nhạc Nền (`6 Dramatic BGM Phases` — tạo bằng `Suno AI v4.5` hoặc bộ synthesizer giao hưởng đa lớp trong `B9_Music_Prompts.csv`):**

| Hồi / Cao Trào Trong Tập Phim | Tỷ Lệ Thời Lượng | Nhịp Độ (`BPM`) | Màu Sắc Nhạc Cụ (Cổ Trang / Hiện Đại) | Tác Dụng Dẫn Dắt Cảm Xúc Khán Giả |
| :--- | :---: | :---: | :--- | :--- |
| **Hồi 1: Mở Màn Áp Lực & Móc Câu (`Hook & Tension`)** | Cảnh `01–07` (~18%) | **`92 BPM`** | *Cổ trang:* Đàn Nhị (Erhu) trầm + Đàn Tranh (Guzheng) + Chuông đồng + Sub-bass.<br>*Hiện đại:* Cello trầm + Piano tối giản + Sub-bass nhịp tim. | Gây tò mò tột độ và tạo bầu không khí ngột ngạt ngay từ 3 giây đầu tiên. |
| **Hồi 2: Đấu Trí & Ép Cung (`Confrontation & Trap`)** | Cảnh `08–14` (~18%) | **`112 BPM`** | *Cổ trang:* Đàn Tỳ Bà (Pipa) gảy staccato dồn dập + Cello pizzicato + Phách gỗ.<br>*Hiện đại:* Strings staccato + Synth pulse căng thẳng + Hi-hat sắc. | Đẩy nhịp đối chất tăng dần khi phản diện giăng bẫy và nhân vật chính bắt đầu phản kích. |
| **Hồi 3: Lộ Vật Chứng & Nỗi Oan Sáng Tỏ (`Emotional Truth`)** | Cảnh `15–20` (~16%) | **`86 BPM`** | *Cổ trang:* Sáo Tiêu (Xiao) & Đàn Nhị ai oán + Dàn dây giao hưởng dâng trào.<br>*Hiện đại:* Solo Violin nức nở + Piano hợp âm rải + Dàn dây ấm. | Hạ nhịp BPM xuống chậm nhất nhưng đẩy chiều sâu cảm xúc lên cao nhất khi sự thật phơi bày. |
| **Hồi 4: Lật Mặt & Ám Hiệu Nguy Hiểm (`Betrayal & Escalation`)** | Cảnh `21–25` (~14%) | **`122 BPM`** | *Cổ trang:* Trống trận Tanggu + Dây tremolo căng như dây đàn + Kèn đồng trầm.<br>*Hiện đại:* Hybrid Brass + Trống điện tử dồn nhịp + Riser căng thẳng. | Báo hiệu bão táp sắp ập đến khi kẻ ác bị dồn vào chân tường và tung đòn hiểm cuối cùng. |
| **Hồi 5: Đỉnh Điểm Hành Động / Vả Mặt Liên Hoàn (`Climax Action`)** | Cảnh `26–31` (~16%) | **`138 BPM`** | *Cổ trang:* Đại trống trận Taiko tốc độ cao + Tỳ Bà chiến đấu Võ Hiệp + Kèn đồng.<br>*Hiện đại:* Epic Hybrid Orchestral Percussion + Distortion Bass + Brass Hits. | Đẩy nhịp tim khán giả lên cực đại (`138 BPM`) trong chuỗi cảnh đỡ tên, phá vây hoặc tung bằng chứng hủy diệt. |
| **Hồi 6: Bá Khí Đổi Chủ & Móc Câu Tập Sau (`Sovereign Finale`)** | Cảnh `32–Cuối` (~18%) | **`126 BPM`** | *Cổ trang:* Đại giao hưởng đế vương + Trống đại + Chuông đồng + Kèn Suona & Tù và.<br>*Hiện đại:* Hùng ca giao hưởng chiến thắng + Sub-drop kết màn đột ngột. | Bùng nổ cảm giác sảng khoái cực độ khi nhân vật chính nắm trọn quyền lực và cắt phụp ở đỉnh Cliffhanger. |

### 4.2. Cao Trào Phim Ghép Thế Nào? (Kỹ Thuật Hòa Âm 3 Lớp Studio Trong `build_bgm_and_remaster.py`)
Để nhạc nền đẩy cao trào mạnh mẽ mà **không bao giờ át mất lời thoại Tiếng Việt**, hệ thống ghép cao trào bằng 3 kỹ thuật âm thanh tự động:

1. **Kỹ thuật 1 — Khắc Rãnh Tần Số Nhường Giọng Nói (`Frequency Slotting EQ`):**
   - Dải tần quyết định độ rõ chữ của giọng nói Tiếng Việt nằm ở **`2,200 Hz – 3,200 Hz`**.
   - Script tự động đặt bộ lọc cắt nhẹ **`-4.0 dB` tại tần số `2,400 Hz`** trên kênh Nhạc nền (BGM), đồng thời nâng **`+2.2 dB` tại tần số `2,800 Hz`** trên kênh Giọng thoại. Nhờ đó dù nhạc giao hưởng đánh trống lớn đến đâu, từng chữ Tiếng Việt vẫn tách bạch, sắc nét.
2. **Kỹ thuật 2 — Tự Động Hạ Nhạc Khi Thoại & Dâng Trào Ngay Khi Dứt Câu (`RMS-Adaptive Sidechain Ducking`):**
   - Hệ thống đo năng lượng âm thanh (`RMS`) của kênh giọng thoại theo từng cửa sổ `50ms`:
     - **Khi nhân vật đang mở miệng nói (`RMS > 0.028`):** Nhạc nền tự động hạ mượt xuống mức **`24%` (`-12.4 dB`)** làm nền vừa vặn dưới giọng nói.
     - **Ngay khoảnh khắc nhân vật vừa dứt câu thoại (hoặc trong cảnh sững sờ im lặng / cảnh vung kiếm):** Trong vòng `0.18 giây`, nhạc nền lập tức **dâng vọt lên `52% – 66%` (`-5.6 dB` $\rightarrow$ `-3.7 dB`)** để lấp đầy khoảng trống và tạo cú "đập cảm xúc" vào ngực người xem!
3. **Kỹ thuật 3 — Chèn 9 Hiệu Ứng Âm Thanh Đòn Bẩy Đúng Điểm Rơi Cao Trào (`9 Dramatic Punctuation SFX`):**
   - Cao trào không chỉ đến từ nhạc nền mà đến từ **cú nhấn SFX chính xác đến từng phần mười giây**:
     - `palace_gong` *(Chuông đồng đại điện)*: Đánh đúng giây `0.0s` mở màn tập phim và giây kết màn.
     - `sub_drop` *(Cú nổ siêu trầm `40Hz–80Hz`)*: Đánh ngay khoảnh khắc nhân vật tung vật chứng hoặc lật bài ngửa (`SCENE_02, 05, 13, 21, 32`).
     - `heartbeat` *(Tiếng tim đập thình thịch)*: Đánh nền dưới các cảnh cận mặt sững sờ / độc thoại nội tâm (`SCENE_04, 10, 14, 17, 24, 34`).
     - `jade_chime` *(Tiếng ngọc ngân thanh thoát)*: Đánh đúng lúc mở hộp gấm lộ Ngọc bội Phượng Hoàng (`SCENE_03, 15, 16`).
     - `sword_ring` & `sword_clash` *(Tiếng rút kiếm & đánh bật tên lửa)*: Đánh khớp khung hình vung kiếm đỡ tên (`SCENE_27, 28`).
     - `war_horn` *(Tiếng tù và Bắc Cảnh)*: Đánh vang dội khi giơ Hổ Phù hiệu triệu đại quân (`SCENE_33, 38`).

---

## PHẦN 5: NHỊP NHANH – CHẬM THÌ EDIT THẾ NÀO? (`4 PACING MODES & OPTICAL MULTI-ANGLE SPLIT`)

### 5.1. Nguyên Tắc Cốt Lõi: Không Phải Cảnh Nào Cũng Cắt Nhanh Như Nhau!
- Nếu để nguyên 38 cảnh x `8.0s` = `5 phút 01 giây`, phim sẽ bị **chậm rề rà** vì mỗi clip AI đều dư `1.5s – 3.0s` khoảng chết ở đầu và cuối.
- Nhưng nếu cắt nhanh tất cả các cảnh như máy khâu, các cảnh rơi nước mắt hoặc cảnh đại kết cục sẽ bị **trôi tuột, mất sạch cảm xúc**.
- Do đó, thuật toán Đạo Diễn trong [build_fast_paced_director_cut.py](file:///e:/DIEN%20APP/Lam%20phim%20AI%20Trung/01_Phe_Hau_Tro_Ve/build_fast_paced_director_cut.py) phân loại từng cảnh vào **4 Chế Độ Nhịp Độ (`Nhanh – Vừa – Giật Gân – Chậm Lắng`)**:

| Chế Độ Nhịp Độ (`Pacing Mode`) | Khi Nào Dùng (Loại Cảnh) | Thời Lượng Giữ Lại (Từ `8.0s` gốc) | Tốc Độ Phát (`Speed` + Bảo toàn tông giọng) | Cách Cắt Đầu/Cuối & Nhảy Góc Máy (`Punch-In`) |
| :--- | :--- | :---: | :---: | :--- |
| **1. `ACTION_BLITZ`**<br>*(Nhịp Cực Nhanh — Hành động / Võ thuật / Vả mặt trực diện)* | Cảnh bắn tên, rút kiếm đỡ tên, tát, hất đổ bàn tiệc, vây bắt (`SCENE_25..29, 37`) | **`2.8s – 4.5s`** | **`1.14x – 1.20x`** | Cắt sát sạt ngay khoảnh khắc va chạm; tự động **chia đôi cảnh thành 2 góc máy** (Toàn/Trung cảnh $\rightarrow$ Cận cảnh `1.16x` ngay điểm nổ tia lửa) + chèn SFX kim khí. |
| **2. `REACTION_SNAP`**<br>*(Nhịp Giật Gân — Sững sờ / Độc thoại nội tâm / Lộ Đồ vật chính)* | Cảnh nhìn thấy mật chỉ, thấy ngọc bội gãy, giật mình tái mặt (`SCENE_04, 10, 14, 16, 24, 34`) | **`3.1s – 4.2s`** | **`1.10x – 1.14x`** | Cắt bỏ hoàn toàn thời gian chờ; giữ đúng biểu cảm biến sắc + chèn tiếng *Heartbeat* đập mạnh + nhảy cận cảnh vào đôi mắt hoặc đồ vật chính. |
| **3. `CONFRONTATION_FAST`**<br>*(Nhịp Đối Chất Dồn Dập — Đấu khẩu / Vạch mặt)* | Cảnh tung bằng chứng, chất vấn qua lại, ép mở hộp gấm (`SCENE_02, 03, 05, 08, 09, 11..13, 15, 21..23, 30..33, 36`) | **`3.8s – 5.5s`** | **`1.07x – 1.10x`** | Dùng bộ phát hiện tiếng nói cắt sạch khoảng lặng trước chữ đầu tiên (`lead-in = 0.08s`) và sau chữ cuối cùng (`tail = 0.14s`); ở giữa câu thoại tự động nhảy góc cận cảnh `1.16x`. |
| **4. `EMOTIONAL_CLIMAX`**<br>*(Nhịp Chậm Lắng Đọng — Bi tráng / Rơi lệ / Mở màn / Đại kết cục)* | Cảnh mở màn đêm tuyết, cảnh kể nỗi oan 3 năm rơi lệ, cảnh giơ Hổ Phù cuối tập (`SCENE_01, 06, 07, 17..20, 35, 38`) | **`4.5s – 5.6s`** | **`1.00x – 1.05x`** | **Giữ nhịp chậm có chủ đích:** Để lại `0.25s` đầu và `0.35s` cuối cảnh cho tiếng nhạc Sáo Tiêu / Đại giao hưởng ngân vang và giọt nước mắt kịp rơi, tạo độ lắng sâu sắc. |

> **Lưu ý kỹ thuật khi tăng tốc độ (`1.05x – 1.20x`):** Luôn dùng bộ lọc `atempo` của FFmpeg thay vì đổi sample rate thô, giúp câu thoại Tiếng Việt nói nhanh, đanh thép hơn nhưng **hoàn toàn không bị méo giọng hay biến thành giọng hoạt hình (chipmunk)**.

### 5.2. Kỹ Thuật "1 Cảnh Render = 2 Góc Máy Trên Phim" (`Optical Multi-Angle Split`)
Trong phim truyền hình và đoản kịch Trung Quốc, máy quay không bao giờ đứng yên một góc quá `2.8 giây`. Khi chỉ có 1 file video AI cho mỗi cảnh, ta tạo hiệu ứng **2 máy quay (Cam A Trung cảnh + Cam B Cận cảnh)** như sau:
- Với mọi cảnh có độ dài sau khi cắt `>= 3.5 giây`:
  - **Phần 1 (`54%` thời lượng đầu — Cam A):** Giữ khung hình gốc (`1280x720` hoặc `720x1280`), nhân vật nói nửa đầu câu thoại.
  - **Phần 2 (`46%` thời lượng sau — Cam B Cận Cảnh):** Đúng vào từ nhấn mạnh nửa sau câu thoại, cắt thẳng (Hard Cut) sang khung hình **Zoom Quang Học `1.16x – 1.32x`** tập trung vào gương mặt/ánh mắt nhân vật (`scale=1484:834,crop=1280:720:102:57,eq=contrast=1.04:saturation=1.05`) kèm một tiếng *Tension Hit* nhẹ (`-13 dB`).
- **Hiệu quả thực tế:** Từ `38 cảnh` gốc của *Phế Hậu Trở Về*, bản dựng `FAST_CUT` tạo ra **hơn 70 cú chuyển góc máy liên hoàn** trong `3 phút 13 giây` (trung bình **`2.5 giây / 1 lần đổi khung hình`**), giữ mắt khán giả dính chặt vào màn hình từ giây đầu đến giây cuối!

### 5.3. Quy Tắc Bất Biến Khi Ghép Nhạc Nền Vào Bản Edit Nhịp Nhanh – Chậm
- **CẤM TUYỆT ĐỐI** ghép nhạc nền vào từng cảnh 8 giây rồi mới cắt ngắn cảnh (vì nhạc nền sẽ bị đứt khúc và vấp nhịp ở mọi vết cắt!).
- **Trình tự chuẩn 3 bước trong `build_fast_paced_director_cut.py`:**
  1. **Bước A:** Cắt gọn hình ảnh + giọng thoại của từng cảnh theo 4 chế độ `ACTION_BLITZ` / `REACTION_SNAP` / `CONFRONTATION_FAST` / `EMOTIONAL_CLIMAX` và nối thành 1 đường hình + thoại hoàn chỉnh (`193.4s`).
  2. **Bước B:** Tính toán lại mốc thời gian mới của 6 Hồi Cao Trào trên trục `193.4s` và **trải 6 bản nhạc nền chạy xuyên suốt, liền mạch** qua hàng chục vết cắt hình (chuyển giao giữa các Hồi bằng `acrossfade` mượt `1.2s`).
  3. **Bước C:** Chạy `RMS Sidechain Ducking` trên trục thời gian mới + điểm xuyết 9 SFX cao trào + chuẩn hóa âm lượng phát sóng `-14 LUFS` + đốt phụ đề `.srt` khớp từng mili-giây!

---

## PHẦN 6: BỘ LỆNH TỰ ĐỘNG HÓA TOÀN QUY TRÌNH CHO CÁC TẬP PHIM TIẾP THEO

```powershell
$env:PYTHONIOENCODING="utf-8"
Set-Location "E:\DIEN APP\Xây Kênh Youtube\Tool render edit Video"

# 1. Sinh toàn bộ file CSV (B1, B2, B3, B5) đã khóa cứng Nhân vật + Bối cảnh + Đồ vật chính và Phụ đề gốc (.srt)
& ".\.venv\Scripts\python.exe" "e:\DIEN APP\Lam phim AI Trung\01_Phe_Hau_Tro_Ve\build_project_csvs.py"

# 2. Khởi chạy FlowKit Server (:8100) & Render tự động Nhân vật + Ảnh cảnh + Video Veo 3.1 trên Google Flow
& ".\.venv\Scripts\python.exe" -u "e:\DIEN APP\Lam phim AI Trung\01_Phe_Hau_Tro_Ve\run_flow_render.py" all

# 3. Sáng tác 6 Chương Nhạc Nền Cao Trào + Hòa âm Sidechain Ducking & 9 SFX cho Bản Đầy Đủ (MASTER)
& ".\.venv\Scripts\python.exe" -u "e:\DIEN APP\Lam phim AI Trung\01_Phe_Hau_Tro_Ve\build_bgm_and_remaster.py"

# 4. Xuất Bản Dựng Đạo Diễn Nhịp Nhanh – Chậm (FAST_CUT: 4 Chế độ nhịp + 70+ cú cắt góc máy + Nhạc 6 Hồi liền mạch)
& ".\.venv\Scripts\python.exe" -u "e:\DIEN APP\Lam phim AI Trung\01_Phe_Hau_Tro_Ve\build_fast_paced_director_cut.py"
```
