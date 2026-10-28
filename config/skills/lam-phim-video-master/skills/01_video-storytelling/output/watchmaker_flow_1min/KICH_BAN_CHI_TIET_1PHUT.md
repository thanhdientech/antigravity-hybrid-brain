# 🎬 KỊCH BẢN STORYTELLING 1 PHÚT & BỘ PROMPT TEST TÍNH ĐỒNG BỘ
## Đề Tài: "The Watchmaker's Miracle" (Phép Màu Tiệm Đồng Hồ Cổ)
**Dự Án Google Flow:** [`https://flow.google.com/project/954fafe2-d851-45c9-bbea-f01217b0749a`](https://flow.google.com/project/954fafe2-d851-45c9-bbea-f01217b0749a)  
**Thời Lượng Text Đọc:** 135 từ (~58 giây) | **Số Phân Cảnh:** 6 Scenes (mỗi scene 8s chuẩn Veo 3 / OmniFlash)

---

## 👤 BẢNG NHẬN DIỆN MỎ NEO NHÂN VẬT & ĐẠO CỤ (CONSISTENCY ANCHORS)

Để đảm bảo AI không bị "biến dạng" (morphing) nhân vật và đổi màu bối cảnh qua 6 phân cảnh, bộ nhận diện mỏ neo được khóa chặt như sau:

* **Tên nhân vật:** Thomas (Master Watchmaker)
* **Đặc điểm diện mạo:** 65 tuổi, mái tóc bạc hoa râm hơi rối tự nhiên, nếp nhăn đuôi mắt sâu biểu cảm hiền từ, ánh mắt xanh tinh anh.
* **Trang phục mỏ neo (Wardrobe Anchor):** Kính lúp gọng đồng đeo cố định một bên mắt phải (brass jeweler's loupe), áo len gile màu xám tro (charcoal knit vest) bên ngoài áo sơ mi trắng sờn, tạp dề da bò màu nâu sẫm (brown leather apron).
* **Đạo cụ mỏ neo (Prop Anchor):** Chiếc đồng hồ quả quýt bằng đồng cổ điển (ornate vintage brass pocket watch) chạm khắc hoa văn hoa hồng nổi, mặt số La Mã cổ.
* **Bối cảnh mỏ neo (Environment Anchor):** Tiệm sửa đồng hồ cổ kiểu mộc mạc, tường ốp gỗ sồi tối màu treo hàng chục đồng hồ quả lắc, bàn làm việc ngập tràn bánh răng li ti, đón nguồn sáng vàng ấm áp ban mai (warm golden hour morning sunlight) chiếu xiên qua khung cửa sổ vòm.

---

### 🎨 Character Sheet Prompt (Sinh Ảnh Gốc 4 Góc Để Lấy `character_media_ids`):

```text
Character model sheet of a 65-year-old master watchmaker named Thomas, silver-gray messy hair, warm gentle face with deep crow's feet wrinkles, wearing a single brass jeweler's loupe over right eye, charcoal gray knit vest, rolled-up sleeve white shirt, worn brown leather apron. Shown in 4 angles: front view, three-quarter view, profile side view, and back view. Clean neutral studio background, ultra-high detail cinematic lighting, 8k, photorealistic turnaround.
```

---

## 📜 KỊCH BẢN CHI TIẾT 6 PHÂN CẢNH (STORYBOARD & DUAL PROMPT)

---

### 🎬 Scene 1: LỜI MỞ ĐẦU & NỖI NHỌC NHẰN (00:00 - 00:08)
* **Voiceover (Lời dẫn):**
  > *"Trong góc phố cổ tĩnh lặng, tiệm sửa đồng hồ của bác Thomas dường như đã đứng ngoài dòng chảy của thời gian."*
* **Cảm xúc:** Tĩnh lặng, tập trung cao độ, hoài niệm.
* **🔵 Prompt Google Flow / Veo 3 (Image & Video):**
  * **Start Frame Image:**
    ```text
    Macro close-up shot of 65-year-old watchmaker Thomas's weathered trembling hands using fine brass tweezers to delicately place a microscopic golden gear into an ornate vintage brass pocket watch on a cluttered wooden workbench. Morning warm amber sunlight streams through dust-mote filled air, shallow depth of field, vintage clockmaker workshop in soft background bokeh, 8k cinematic photorealism.
    ```
  * **Motion Video Prompt (8s):**
    ```text
    0-4s: Camera slowly pushes in closer on the trembling weathered fingers delicately nudging the tiny gear into place. 4-8s: Subtle rack focus from the brass watch mechanism to the ticking antique pendulum clocks on the wooden wall behind. Ultra-smooth cinematic motion, warm golden dust motes drifting.
    ```
* **🔴 Prompt Seedance 2.0:**
  ```text
  [00:00-00:08] Extreme Close-Up, Slow Push-In. Master watchmaker @Image 1 placing tiny gear into vintage pocket watch @Image 2 on wooden table, warm morning sunbeams, floating dust motes, cinematic 8k.
  ```
* **Audio SFX:** Tiếng tích tắc chậm rãi của các đồng hồ treo tường, tiếng kim loại va chạm siêu khẽ.

---

### 🎬 Scene 2: KHỦNG HOẢNG & KỶ VẬT QUÁ KHỨ (00:08 - 00:16)
* **Voiceover (Lời dẫn):**
  > *"Ba tuần ròng rã, bác đã thức trắng chỉ để cứu sống chiếc đồng hồ hoen gỉ này - kỷ vật thiêng liêng duy nhất mà người vợ quá cố để lại."*
* **Cảm xúc:** Buồn bã, áp lực, tình yêu son sắt.
* **🔵 Prompt Google Flow / Veo 3 (Image & Video):**
  * **Start Frame Image:**
    ```text
    Medium portrait shot of elderly watchmaker Thomas, silver-gray hair, brass jeweler's loupe over right eye, charcoal knit vest and brown leather apron. He sighs softly, gazing with tender melancholy at a small framed vintage black-and-white wedding photograph resting beside the open pocket watch on his workbench. Soft golden hour light illuminating his gentle wrinkled face, emotional cinematic drama, 8k.
    ```
  * **Motion Video Prompt (8s):**
    ```text
    0-4s: Thomas takes a slow deep breath, his shoulders dropping slightly with fatigue. 4-8s: He gently turns his gaze from the pocket watch to the framed wedding photo, a wistful and loving smile faintly touching his lips. Very subtle camera dolly in.
    ```
* **🔴 Prompt Seedance 2.0:**
  ```text
  [00:08-00:16] Medium Close-Up, Static Camera with Slow Zoom. Elderly watchmaker @Image 1 looking sadly at framed photo next to @Image 2, sighing softly, warm interior lighting, emotional storytelling.
  ```
* **Audio SFX:** Tiếng thở dài nhẹ, tiếng đàn piano réo rắt u hoài ở nốt trầm.

---

### 🎬 Scene 3: BƯỚC NGOẶT KHAI SÁNG (00:16 - 00:24)
* **Voiceover (Lời dẫn):**
  > *"Mọi nỗ lực tưởng chừng bế tắc khi bánh răng vẫn đứng yên... cho đến khi ánh mắt già nua nhận ra một lẫy lò xo bị lệch chỉ một phần mười milimet."*
* **Cảm xúc:** Bừng tỉnh, hy vọng hé lộ, tập trung tột độ.
* **🔵 Prompt Google Flow / Veo 3 (Image & Video):**
  * **Start Frame Image:**
    ```text
    Extreme close-up macro shot of Thomas's keen blue eye magnified through the convex glass lens of his brass jeweler's loupe. A spark of sudden realization and sharp focus reflects in his pupil. Sunlight gleams off the polished brass rim of the loupe. Fine skin wrinkles and silver eyebrow hairs in razor-sharp focus, 8k cinematic masterpiece.
    ```
  * **Motion Video Prompt (8s):**
    ```text
    0-4s: The magnified eye narrows in intense scrutiny under the lens. 4-8s: The eyebrow suddenly raises as epiphany strikes, fine smile lines crinkling around the eye in sudden hopeful discovery. Slight micro-camera push.
    ```
* **🔴 Prompt Seedance 2.0:**
  ```text
  [00:16-00:24] Extreme Macro, Snap Zoom. Close-up on magnified eye of @Image 1 through brass loupe, sudden spark of epiphany and hope, intense lighting highlight, cinematic realism.
  ```
* **Audio SFX:** Âm thanh "ping" nhẹ của dây cót, nhịp tim hồi hộp dồn dập.

---

### 🎬 Scene 4: THAO TÁC QUYẾT ĐỊNH (00:24 - 00:32)
* **Voiceover (Lời dẫn):**
  > *"Nín thở và cẩn trọng từng nhịp run của ngón tay, bác khẽ gạt chiếc lẫy vàng về đúng vị trí cân bằng của nó."*
* **Cảm xúc:** Hồi hộp nghẹt thở, kỹ thuật điêu luyện.
* **🔵 Prompt Google Flow / Veo 3 (Image & Video):**
  * **Start Frame Image:**
    ```text
    Extreme macro shot inside the mechanical heart of the ornate brass pocket watch. Glistening rubies, polished brass gear teeth, and coiled hairspring. The slender tip of a precision golden tweezer delicately touches the microscopic balance lever, poised to click it into place. Warm golden reflections bouncing off mirror-polished steel, 8k resolution.
    ```
  * **Motion Video Prompt (8s):**
    ```text
    0-3s: The tweezer tip slowly nudges the tiny golden lever with microscopic precision. 3-8s: A micro-click occurs, the escapement wheel twitches, and the tension spring aligns perfectly. Hand held ultra-stable slow motion.
    ```
* **🔴 Prompt Seedance 2.0:**
  ```text
  [00:24-00:32] Macro Shot, Slow Pan. Tweezers of @Image 1 adjusting the tiny spring inside pocket watch @Image 2, mechanical precision, golden lighting, cinematic 8k.
  ```
* **Audio SFX:** Tiếng "tách" kim loại giòn tan sắc nét, sự im lặng căng thẳng ngưng đọng.

---

### 🎬 Scene 5: PHÉP MÀU BỪNG TỈNH (00:32 - 00:44)
* **Voiceover (Lời dẫn):**
  > *"Tích... tắc... tích... tắc! Trái tim cơ khí bỗng bừng tỉnh. Kim giây bắt đầu nhịp nhàng khiêu vũ, và tiếng chuông ngân trong trẻo vang lên như lời chào của người xưa."*
* **Cảm xúc:** Vỡ òa hạnh phúc, xúc động trào dâng.
* **🔵 Prompt Google Flow / Veo 3 (Image & Video):**
  * **Start Frame Image:**
    ```text
    Over-the-shoulder medium shot of watchmaker Thomas holding the ornate brass pocket watch upright in both trembling palms. The delicate filigree golden hands are moving smoothly across the antique Roman numeral dial. A single tear of overwhelming joy glistens on Thomas's wrinkled cheek as he smiles brightly. Warm morning sunlight bathes the scene in heavenly golden haze, 8k.
    ```
  * **Motion Video Prompt (8s):**
    ```text
    0-4s: The golden balance wheel spins rapidly, the second hand smoothly sweeps in continuous motion. 4-8s: Camera tilts up to Thomas's radiant face as he whispers emotionally, tears gleaming in his eyes, smiling with immense relief and gratitude.
    ```
  * **Dialogue:**
    Thomas whispers softly, *"It works, my love."*
* **🔴 Prompt Seedance 2.0:**
  ```text
  [00:32-00:44] Medium Close-Up, Tilt Up. Watchmaker @Image 1 holding working pocket watch @Image 2, golden hands ticking, joyful tears on smiling wrinkled face, warm emotional cinematic lighting.
  ```
* **Audio SFX:** Tiếng kim đồng hồ chạy đều đặn "tích-tắc, tích-tắc", tiếng chuông đồng hồ ngân vang giai điệu thánh thót dịu êm.

---

### 🎬 Scene 6: THÔNG ĐIỆP & ĐOẠN KẾT ẤM ÁP (00:44 - 00:58)
* **Voiceover (Lời dẫn):**
  > *"Bác Thomas mở tung cánh cửa sổ đón nắng sớm. Thời gian không chỉ là những con số vô hình trôi qua, mà là tình yêu vĩnh cửu đọng lại trong từng khoảnh khắc."*
* **Cảm xúc:** Bình yên sâu lắng, truyền cảm hứng, trọn vẹn.
* **🔵 Prompt Google Flow / Veo 3 (Image & Video):**
  * **Start Frame Image:**
    ```text
    Cinematic wide shot of Thomas standing beside the open arched wooden window of his antique clock shop, gently pressing the ticking pocket watch against his heart. Warm morning sunlight floods the rustic wooden room, illuminating floating dust motes and dozens of antique grandfather clocks on the walls, with the peaceful cobblestone street visible outside. 8k, photorealistic masterpiece.
    ```
  * **Motion Video Prompt (8s):**
    ```text
    0-4s: Thomas stands by the window, breathing in the fresh morning breeze with eyes closed in profound serenity. 4-8s: Slow cinematic camera dolly backward through the shop, revealing the full warm, magical workshop bathed in golden morning light.
    ```
* **🔴 Prompt Seedance 2.0:**
  ```text
  [00:44-00:58] Wide Establishing Shot, Slow Dolly Back. Watchmaker @Image 1 at sunlit shop window holding @Image 2 to chest, cozy antique workshop full of clocks, peaceful cinematic conclusion.
  ```
* **Audio SFX:** Dàn nhạc giao hưởng vĩ cầm du dương trỗi dậy ấm áp, hòa cùng nhịp tích tắc đồng thanh của cả gian phòng.
