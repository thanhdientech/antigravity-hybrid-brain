---
name: video-storytelling
description: Bách khoa toàn thư biên kịch và kiến tạo kịch bản video đa thể loại (Short-form 15-60s, Ads chuyển đổi, YouTube dài 8-20m, Phim tài liệu khoa học, Kể chuyện điện ảnh) tích hợp 20+ công thức quốc tế (AIDA, BAB, PAS-T, HVC, ABT, 7-Beat Scientific Debate, Dan Harmon 8-Beat, Pixar Story Spine, 3-Act Structure, Kishōtenketsu). Tự động phân tách 2 luồng prompt chuẩn kỹ thuật: ByteDance Seedance 2.0/2.5 (@Image/@Video reference mapping) và Google Veo 3/3.1 (Cinematic 5-Part Formula + Lip-sync Dialogue + SFX + Zero Ambient Tape Noise). Hỗ trợ khóa diện mạo nhân vật Character Consistency 4-view và tích hợp 700+ thuật ngữ quay phim DoP Cinematic Director. TRIGGERS: "kịch bản video", "kể chuyện bằng video", "video storytelling", "viết kịch bản", "công thức kịch bản", "công thức video", "kịch bản tiktok", "kịch bản quảng cáo", "kịch bản tài liệu", "kịch bản youtube", "prompt seedance", "prompt veo 3", "đồng bộ nhân vật video", "dan harmon", "pixar story spine", "7 beat debate", "abt formula".
---

# Video Storytelling & Scriptwriting Master Engine (SKILL.md)

Hệ thống kỹ năng AI chuyên sâu kết hợp nghệ thuật biên kịch điện ảnh, tâm lý học giữ chân khán giả (Audience Retention) và công nghệ Video Generative AI thế hệ mới nhất.

---

## 1. Bản Đồ Tra Cứu: Loại Video $\rightarrow$ Công Thức Khuyên Dùng

Bảng quy chuẩn ánh xạ chính xác thể loại video sang công thức kịch bản tối ưu nhất:

| Thể Loại Video | Nền Tảng | Thời Lượng | Công Thức Khuyên Dùng | Mục Tiêu Giữ Chân | Tệp Tham Chiếu Chi Tiết |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Mẹo vặt / Tin tức nhanh** | TikTok, Shorts, Reels | 15s – 30s | **HVC** (Hook - Value - CTA) | Chặn lướt trong 2 giây đầu | [`references/01-short-form-formulas.md`](./references/01-short-form-formulas.md) |
| **Tư vấn / Giải quyết nỗi đau** | Shorts, Reels, TikTok | 45s – 60s | **PAS-T** (Problem - Agitate - Solve - Transform) | Đánh trúng nỗi đau & giải tỏa | [`references/01-short-form-formulas.md`](./references/01-short-form-formulas.md) |
| **Khoa học / Bóc mẽ lầm tưởng** | TikTok, Shorts | 45s – 60s | **Myth-Buster** (Tuyên bố sai $\rightarrow$ Bóc mẽ) | Kích thích phản xạ tranh luận | [`references/01-short-form-formulas.md`](./references/01-short-form-formulas.md) |
| **Quảng cáo sản phẩm mới** | Facebook Ads, TikTok Ads | 30s – 60s | **AIDA** (Attention - Interest - Desire - Action) | Kích thích khao khát mua | [`references/02-conversion-ad-formulas.md`](./references/02-conversion-ad-formulas.md) |
| **Mỹ phẩm / Giảm cân / Dịch vụ** | Facebook, TikTok Shop | 30s – 45s | **BAB** (Before - After - Bridge) | Tương phản trước & sau khi dùng | [`references/02-conversion-ad-formulas.md`](./references/02-conversion-ad-formulas.md) |
| **Review chân thực KOC / KOL** | TikTok Creator Ads | 45s – 60s | **UGC 5-Beat** (Organic Hook $\rightarrow$ Demo $\rightarrow$ Voucher) | Tạo niềm tin chân thực 100% | [`references/02-conversion-ad-formulas.md`](./references/02-conversion-ad-formulas.md) |
| **Câu chuyện thương hiệu B2B** | Landing Page, YouTube | 90s – 3 phút | **StoryBrand 7-Part** (Khách hàng là người hùng) | Định vị doanh nghiệp dẫn đường | [`references/02-conversion-ad-formulas.md`](./references/02-conversion-ad-formulas.md) |
| **YouTube phân tích / Khám phá** | YouTube Long-Form | 10 – 18 phút | **Curiosity Gap & Nested Open Loops** | Bóc vỏ hành giữ chân đến phút chót | [`references/03-long-form-retention-formulas.md`](./references/03-long-form-retention-formulas.md) |
| **Video thử thách sinh tồn** | YouTube Viral | 12 – 20 phút | **The Escalating Challenge Arc** (MrBeast Style) | Khủng hoảng leo thang từng phút | [`references/03-long-form-retention-formulas.md`](./references/03-long-form-retention-formulas.md) |
| **Video hướng dẫn / Tutorial** | YouTube Education | 8 – 12 phút | **What – Why – How – Now** (Terry Borton) | Dễ hiểu và áp dụng ngay trong 24h | [`references/03-long-form-retention-formulas.md`](./references/03-long-form-retention-formulas.md) |
| **Tài liệu khoa học kinh điển** | Phim tài liệu mini | 5 – 20 phút | **ABT** (And - But - Therefore - Randy Olson) | Trị dứt điểm căn bệnh liệt kê chán | [`references/04-documentary-science-formulas.md`](./references/04-documentary-science-formulas.md) |
| **Video Essay chiều sâu** | YouTube Video Essay | 10 – 18 phút | **Vox / Johnny Harris 4-Phase Dialectic** | Vạch trần cỗ máy ngầm xã hội | [`references/04-documentary-science-formulas.md`](./references/04-documentary-science-formulas.md) |
| **Bí ẩn vũ trụ / Giải mật đêm muộn** | YouTube Bedtime Podcast | 10 – 12 phút | **The 7-Beat Scientific Debate** (Some Guy V9.0) | Tranh biện khoa học & Nỗi sợ hiện sinh | [`references/04-documentary-science-formulas.md`](./references/04-documentary-science-formulas.md) |
| **Hồ sơ điều tra kỳ án / Mất tích** | YouTube Investigation | 15 – 30 phút | **Unsolved Forensic Mystery** (Lemmino Style) | Phân tích mốc thời gian & Manh mối mâu thuẫn | [`references/04-documentary-science-formulas.md`](./references/04-documentary-science-formulas.md) |
| **Phim ngắn AI kịch tính** | Phim điện ảnh ngắn | 3 – 15 phút | **Hollywood Classic 3-Act Structure** | Cao trào đối đầu kinh điển | [`references/05-cinematic-drama-formulas.md`](./references/05-cinematic-drama-formulas.md) |
| **Kể chuyện hoạt hình / Nhân văn** | Hoạt hình ngắn AI | 60s – 3 phút | **Pixar Story Spine** (Once upon a time...) | Mối quan hệ nhân quả chặt chẽ | [`references/05-cinematic-drama-formulas.md`](./references/05-cinematic-drama-formulas.md) |
| **Hành trình nhân vật lột xác** | Drama ngắn / Series | 1 – 5 phút | **Dan Harmon 8-Beat Story Circle** | Chu kỳ 8 bước khép kín hoàn chỉnh | [`references/05-cinematic-drama-formulas.md`](./references/05-cinematic-drama-formulas.md) |
| **Kể chuyện chiêm nghiệm nhẹ nhàng** | Phim nghệ thuật / Ghibli | 1 – 5 phút | **Kishōtenketsu** (Khởi - Thừa - Chuyển - Kết) | Không cần xung đột, bẻ cua góc nhìn | [`references/05-cinematic-drama-formulas.md`](./references/05-cinematic-drama-formulas.md) |

---

## 2. Quy Chuẩn Đa Giác Quan Cho Từng Nhịp Kịch Bản (`StoryBeat`)

Mỗi phân cảnh trong kịch bản bắt buộc phải được quy chuẩn thành một hàm toán học đa giác quan:

$$\text{StoryBeat} = \text{Phase} + \text{Voiceover} + \text{Dialogue (Lip-sync)} + \text{Visual Action} + \text{Camera Movement} + \text{SFX} + \text{Ambient} + \text{Target Emotion}$$

1. **Voiceover:** Lời dẫn chuyện hoặc độc thoại nội tâm (kiểm soát số từ theo độ dài cảnh, ví dụ: 8.0s = 11–13 từ tiếng Anh).
2. **Lip-sync Dialogue:** Lời thoại trực tiếp đặt trong ngoặc kép `"..."` dành cho AI tạo chuyển động môi.
3. **Visual Action:** Tương tác vật lý thực tế, biểu cảm vi mô (micro-expressions), cử chỉ cụ thể.
4. **Camera Movement:** Chuyển động máy quay phục vụ cảm xúc (Low-angle push in, Steadicam, 360 orbit...).
5. **Acoustic Design:** Tách bạch 3 tầng âm: *SFX âm thanh cụ thể* + *Ambient tiếng môi trường* + *Nhạc nền BGM*.

---

## 3. Hai Phân Hệ Công Nghệ Độc Lập

### 🔴 1. Phân Hệ ByteDance Seedance 2.0 / 2.5 (Volcengine Standard)
- Cơ chế tham chiếu đa phương thức (**Multimodal Reference Mapping**):
  - `@Image 1`: Mỏ neo cố định diện mạo nhân vật (Character consistency anchor).
  - `@Image 2`: Sản phẩm hoặc bối cảnh không gian đặc trưng.
  - `@Video 1`: Nhịp điệu và chuyển động máy quay mẫu.
- Định dạng đạo diễn: `Setting:`, `Action:`, `Camera:`, `Style:`, `Audio:`.

### 🔵 2. Phân Hệ Google Veo 3 / 3.1 (Google DeepMind Standard)
- Tuân thủ công thức 5 thành phần chuẩn Hollywood:
  $$\text{Prompt} = [\text{Cinematography}] + [\text{Subject}] + [\text{Action}] + [\text{Context}] + [\text{Style \& Ambiance}]$$
- Lời thoại khớp khẩu hình: `She speaks with natural emotion, "..."`.
- Hiệu ứng âm thanh: `SFX: [Chi tiết âm thanh]`.
- **Nguyên tắc vàng chống tạp âm:** Khi render video Master, thiết lập âm lượng Veo Ambient ở mức 0% (`[a_voice][a_bgm]amix=inputs=2:normalize=0`) để triệt tiêu tiếng xì rè analog tape hiss mà vẫn giữ trọn giọng đọc 100% và nhạc nền 8%.
- **Tuyệt đối không dùng thẻ `@`** để tránh lỗi biến dạng hình ảnh (morphing artifacts).

---

## 4. Phân Hệ Character Consistency (Mỏ Neo Diện Mạo 4 Góc)

Tự động sinh prompt Midjourney v6 / Flux tạo bảng xoay nhân vật 4 góc (**Character Turnaround Sheet**):
```text
Character model sheet, [Mô tả chi tiết ngoại hình], 4-angle turnaround view: front view, side profile view, three-quarter view, back view, standing in neutral relaxed pose, clean neutral grey studio background, consistent lighting, 8k resolution, photorealistic character concept art --ar 16:9
```

---

## 5. Phân Hệ DoP Cinematic Director (6 Phong Cách Có Sẵn)

Tích hợp 700+ thuật ngữ quay phim, ánh sáng, góc máy và ống kính từ [`cinematic-video-prompt`](../cinematic-video-prompt/SKILL.md):
- `hollywood_dramatic` *(Mặc định)*: Teal & Orange grading, Rembrandt lighting, 35mm anamorphic grain, shallow depth of field.
- `cyberpunk_neon`: Neon cyan/magenta palette, wet street reflections, CineStill 800T, wide 24mm lens.
- `film_noir`: Chiaroscuro tương phản cực cao, bóng rèm venetian blind, Kodak Tri-X 400 đen trắng.
- `documentary`: Ánh sáng tự nhiên, góc máy ngang tầm mắt (Eye-level), handheld slight camera shake.
- `commercial_clean`: Ánh sáng softbox studio rực rỡ, độ nét 8k ARRI Alexa LF, màu tươi sáng sống động.
- `vintage_retro`: Tông màu ấm áp hoài niệm, Kodak Portra 400, ánh sáng hoàng hôn golden hour dịu dàng.

---

## 6. Hướng Dẫn Sử Dụng Bằng Dòng Lệnh (CLI 1-Chạm)

Hỗ trợ tham số `--formula` để lựa chọn chính xác công thức kịch bản:

```bash
# 1. Kịch bản Video ngắn 60s theo công thức HVC:
python cli.py --topic "3 Mẹo Sạc Pin iPhone Đúng Cách" --formula short_form_hvc --out "./output/iphone_tips"

# 2. Kịch bản Quảng cáo theo công thức AIDA:
python cli.py --topic "Chảo Titan Chống Dính Laser" --character "người phụ nữ nội trợ hiện đại 30 tuổi" --formula conversion_aida --out "./output/pan_ad"

# 3. Kịch bản Quảng cáo theo công thức BAB (Before - After - Bridge):
python cli.py --topic "Phần Mềm Quản Lý Tài Chính AI" --character "chủ doanh nghiệp nam 35 tuổi" --formula conversion_bab --out "./output/saas_bab"

# 4. Kịch bản Phim Tài Liệu Tranh Biện 7 Nhịp (Chuẩn kênh Some Guy Who Knows Stuff):
python cli.py --topic "Bản Nhạc Bí Ẩn Vùng Tối Mặt Trăng Apollo 10" --character "phi hành gia Eugene Cernan" --formula scientific_debate_7beat --cinematic-style film_noir --out "./output/apollo10_debate"

# 5. Kịch bản Phim Tài Liệu Khoa Học theo công thức ABT:
python cli.py --topic "Đại Dương Nước Ngầm Sao Hỏa" --formula abt_documentary --out "./output/mars_ocean"

# 6. Kịch bản Kể Chuyện theo Vòng Tròn 8 Nhịp Dan Harmon:
python cli.py --topic "Hành Trình Vượt Qua Nỗi Sợ Độ Cao" --character "chàng trai trẻ 22 tuổi" --formula dan_harmon_8beat --cinematic-style hollywood_dramatic --out "./output/fear_climbing"

# 7. Kịch bản Kể Chuyện Hoạt Hình theo Xương Sống Pixar:
python cli.py --topic "Chú Robot Nhỏ Nhặt Rác Giữa Sa Mạc" --character "robot Wall-E mini gỉ sét" --formula pixar_spine --cinematic-style vintage_retro --out "./output/robot_pixar"

# 8. Kịch bản Hồ Sơ Điều Tra Kỳ Án Chưa Lời Giải (Lemmino Style):
python cli.py --topic "Sự Biến Mất Của Ngọn Hải Đăng Flannan Isles" --formula unsolved_mystery --cinematic-style film_noir --out "./output/flannan_mystery"
```

---

## 7. Nguyên Tắc Bắt Buộc: Thẩm Định Nguồn Chính Thống & Trích Dẫn Học Thuật / Nhà Sản Xuất

> [!IMPORTANT]
> **THIẾT LUẬT ZERO FABRICATION & ZERO HALLUCINATION (CHỐNG BỊA ĐẶT DỮ LIỆU)**:
> 1. **Tuyệt đối không tự bịa đặt số liệu:** Cấm tự tạo ra số liệu thống kê, % hiệu quả ảo, nhân chứng không có thật, hoặc suy đoán tùy tiện.
> 2. **Đối với Quảng Cáo Sản Phẩm:** BẮT BUỘC trích xuất thông số, thành phần, kiểm định từ **Trang web chính thức của Nhà sản xuất** hoặc **Trang web chính thức của Sản phẩm**. Ghi rõ URL, tên nhà sản xuất, mã bằng sáng chế / chứng nhận.
> 3. **Đối với Khoa Học, Y Tế, Lịch Sử, Luật Pháp, Tâm Linh & Truyền Thuyết:** BẮT BUỘC tra cứu từ các nguồn chính thống hoặc tác phẩm kinh điển:
>    - *Khoa học / Không gian:* NASA NTRS, ALSJ, Nature, Science, arXiv.
>    - *Y tế / Sức khỏe (YMYL):* PubMed / NLM / NCBI, WHO, US CDC, The Lancet, NEJM, FDA.
>    - *Lịch sử / Giải mật:* Cục Lưu trữ Quốc gia Mỹ (NARA), CIA FOIA, Thư viện Quốc hội (LOC), Sử Ký Tư Mã Thiên, ĐVSKTT.
>    - *Luật pháp:* Tòa án Tối cao Mỹ (SCOTUS), Cornell LII, US Code, FBI The Vault.
>    - *Tâm linh / Đạo giáo / Thần thoại:* Đạo Đức Kinh, Nam Hoa Kinh, Đại Tạng Kinh, Sơn Hải Kinh, Liêu Trai Chí Dị, Sử thi Homer...
> 4. **Mọi kịch bản hoàn thành BẮT BUỘC có mục `## THƯ MỤC TRÍCH DẪN & NGUỒN GỐC SỐ LIỆU` ở cuối**: Liệt kê rõ ràng: Tên tác phẩm/sản phẩm, Tác giả/Nhà sản xuất, Năm/Triều đại, URL trang web/Mã lưu trữ, và Dữ liệu kiểm chứng thực tế.
> 
> *Xem hướng dẫn tra cứu chi tiết và mẫu định dạng tại:* [`references/06-fact-checking-and-citations.md`](./references/06-fact-checking-and-citations.md).

