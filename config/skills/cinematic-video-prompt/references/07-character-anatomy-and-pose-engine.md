# 07. Character Anatomy, DNA Lock & 3D Pose Engineering
*(Hệ Thống Khóa Nhận Dạng Nhân Vật 6 Lớp & Điều Khiển Giải Phẫu Tư Thế 3D Cho Qwen/Wan 2.1, Flux, Veo 3, Seedance 2.0, Kling)*

Tài liệu này nâng cấp khả năng kiểm soát nhân vật từ mức "từ khóa đơn lẻ" (`action pose`, `sitting`) lên mức **Đạo diễn Giải phẫu Động học 3D (3D Kinematic & Anatomical Pose Direction)**, giúp mô hình AI tạo ảnh/video hiểu chính xác góc xoay cơ thể, trọng tâm, khớp tay chân, hướng nhìn và giữ nguyên diện mạo nhân vật xuyên suốt nhiều phân cảnh.

---

## 1. Hệ Thống Khóa Gen Nhân Vật 6 Lớp (`6-Layer Character DNA Lock`)

Để nhân vật không bị biến đổi khuôn mặt hoặc trang phục giữa các cảnh (từ Cảnh 1 đến Cảnh N), mọi mô tả chủ thể (`[Subject]`) bắt buộc ghép cố định theo chuỗi **6 Lớp Nhận Dạng** dưới đây:

$$\text{Character DNA} = [\text{L1: Archetype \& Age}] + [\text{L2: Facial Bone \& Skin}] + [\text{L3: Hair \& Grooming}] + [\text{L4: Core Attire \& Material}] + [\text{L5: Weathering \& Surface}] + [\text{L6: Signature Prop}]$$

| Lớp (Layer) | Thành phần bắt buộc mô tả | Từ vựng chuẩn (EN) | Ví dụ thực chiến (Nhân vật tiền sử) |
| :--- | :--- | :--- | :--- |
| **L1. Archetype, Age & Build** | Giới tính, độ tuổi chính xác, tạng người, chiều cao/vai | `lean muscular build`, `stocky broad-shouldered frame`, `slender athletic physique`, `weathered 35-year-old male` | `A lean, sinewy 30-year-old prehistoric Homo erectus hunter` |
| **L2. Facial Bone & Skin** | Khung xương mặt, gò má, hàm, màu da, vết sẹo/nếp nhăn cố định | `prominent brow ridge`, `chiseled jawline`, `high cheekbones`, `sun-baked olive skin`, `deep-set amber eyes`, `faint scar across left cheek` | `prominent brow ridge, angular jawline, deep-set dark brown eyes, warm ochre-toned weathered skin` |
| **L3. Hair & Facial Hair** | Kiểu tóc, độ dài, màu tóc, kết cấu tóc, râu | `tangled shoulder-length matte black hair`, `coarse braided beard streaked with grey`, `windswept bangs` | `tangled collarbone-length coarse dark brown hair tied back with a leather cord, short scruffy beard` |
| **L4. Core Attire & Fabric** | Trang phục chính, kiểu cắt, màu sắc cố định, chất liệu vật lý | `draped raw deer-hide tunic`, `charcoal-grey linen shirt with rolled sleeves`, `heavy distressed brown leather coat` | `wearing a rough-stitched dark brown bison-hide tunic secured over the left shoulder` |
| **L5. Weathering & Details** | Dấu vết môi trường bám trên người/áo (bụi, bùn, tro, mồ hôi) | `smudged with charcoal soot and ash`, `rain-soaked fabric clinging to shoulders`, `glistening with sweat and mud` | `forearms and cheekbones smudged with grey wood-ash and dried mud` |
| **L6. Signature Prop** | Đạo cụ gắn liền với nhân vật | `carrying a charred oak branch`, `leather ember-pouch strapped across chest` | `with a stitched red-ochre leather pouch slung across his chest` |

> **Quy tắc bất biến khi làm chuỗi Video:** Copy nguyên văn cụm `Character DNA` (khoảng 35–50 từ) vào đầu mọi câu Prompt từ Cảnh 1 đến Cảnh cuối; chỉ thay đổi phần **Pose 5 Tầng** ở phía sau.

---

## 2. Công Thức Điều Khiển Tư Thế 5 Tầng (`5-Tier Kinematic Pose Formula`)

Thay vì viết chung chung `"he is crouching"`, hãy拆 (bóc tách) tư thế thành **5 tầng giải phẫu học** để khóa chặt khung xương (skeleton) trên Qwen/Wan 2.1, Flux và Veo 3:

$$\text{Pose Engine} = [\text{T1: 3D Camera-to-Body Angle}] + [\text{T2: Spine \& Center of Gravity}] + [\text{T3: Upper Limb \& Hand Micro-Pose}] + [\text{T4: Lower Limb \& Footing}] + [\text{T5: Head Tilt, Gaze \& Micro-Expression}]$$

### Tầng 1: Tọa Độ Góc Máy So Với Trục Cơ Thể (`3D Camera-to-Body Spatial Relation`)
Giúp AI định vị chính xác mặt nào của cơ thể đang hướng về ống kính:

| Góc xoay ngang (Azimuth) | Prompt (EN) | Mô tả không gian |
| :--- | :--- | :--- |
| **$0^\circ$ (Chính diện)** | `front-facing view, torso squared directly to the camera` | Ngực và mặt hướng thẳng vào ống kính |
| **$45^\circ$ (Góc 3/4 trước)** | `three-quarter front view, body angled 45 degrees to the right` | Góc điện ảnh có chiều sâu nhất, thấy rõ khối vai và gò má |
| **$90^\circ$ (Nghiêng hoàn toàn)** | `strict 90-degree side profile view, facing left across the frame` | Nhìn ngang hoàn toàn, nổi bật đường nét sống mũi và dáng lưng |
| **$135^\circ$ (Góc 3/4 từ sau lưng)** | `rear three-quarter over-the-shoulder angle, looking past the subject` | Thấy lưng, vai và một phần gò má nhìn về phía bối cảnh trước mặt |
| **$180^\circ$ (Sau lưng)** | `direct back view from behind the subject, following their stride` | Nhìn từ phía sau lưng, nhấn mạnh hành trình tiến vào bối cảnh |

### Tầng 2: Trục Cột Sống, Độ Xoắn & Trọng Tâm (`Spine, Torso & Center of Gravity`)
Tạo lực vật lý thật (tránh lỗi nhân vật đứng cứng đơ như ma-nơ-canh):

| Trạng thái Trục Thân | Prompt (EN) | Giải thích cơ học |
| :--- | :--- | :--- |
| **Dồn trọng tâm 1 chân (Contrapposto)** | `standing in natural contrapposto, weight shifted heavily onto the right leg, hips tilted slightly` | Dáng đứng tự nhiên, vai và hông nghiêng ngược chiều nhau |
| **Đổ người về trước (Lao đi / Chống gió)** | `torso pitched sharply forward at a 30-degree angle, center of gravity low and driving ahead` | Tạo động năng chạy, vượt bão hoặc leo dốc |
| **Gù/Khòm lưng bảo vệ (Che chắn)** | `spine deeply curved and hunched forward, shoulders rolled inward protectively over the chest` | Tư thế che lửa dưới mưa, rét buốt hoặc sợ hãi |
| **Xoắn trục ngực - hông (Dynamic Twist)** | `dynamic torso coil, hips planted facing forward while upper shoulders twist sharply to the left` | Tư thế vung gậy, ném giáo hoặc giật mình quay lại nhìn |
| **Ngửa người / Giật lùi (Recoiling)** | `torso leaning backward in sudden recoil, weight thrown onto the back heel` | Giật mình lùi lại khi sét đánh hoặc lửa bùng lên |

### Tầng 3: Khớp Tay, Khuỷu Tay & Vi Cử Chỉ Bàn Tay (`Upper Limb & Hand Articulation`)
Khắc phục triệt để lỗi AI vẽ dư ngón tay hoặc cầm nắm đạo cụ bị xuyên thấu:

| Tư thế Tay & Bàn Tay | Prompt (EN) | Tác dụng chống lỗi AI |
| :--- | :--- | :--- |
| **Giơ cao cầm đuốc/vật thể** | `right arm raised high above the head with elbow slightly bent, all five fingers tightly gripping a burning wooden torch shaft` | Khóa rõ "5 ngón tay nắm chặt thân gỗ", không bị biến dạng bàn tay |
| **Khum hai tay che chở (Cupping)** | `both elbows tucked close to the ribs, forearms extended forward with palms cupped together forming a protective hollow around a glowing ember` | Tuyệt chiêu tả cảnh giữ lửa, thổi than hoặc vốc nước |
| **Chống tay xuống đất/đá** | `left arm extended straight down, palm and spread fingers pressed flat against the wet rock surface supporting body weight` | Khóa điểm tiếp xúc vật lý giữa bàn tay và mặt đất |
| **Đưa tay che mặt / Chắn sáng** | `left forearm raised defensively across the brow, open palm shielding the eyes from blinding light` | Phản xạ tự nhiên trước tia sét hoặc sức nóng đám cháy |
| **Vung tay chạy nước rút** | `arms pumping in opposition to the legs, elbows bent at 90 degrees, hands clenched into tight fists` | Tư thế chạy bộ/tháo chạy chuẩn động học |

### Tầng 4: Khớp Háng, Đầu Gối & Điểm Tựa Bàn Chân (`Lower Limb & Footing`)
Giúp nhân vật bám mặt đất vững chắc (Grounding), không bị hiệu ứng "trượt băng" trên mặt đất:

| Tư thế Chân & Bàn Chân | Prompt (EN) | Ngữ cảnh sử dụng |
| :--- | :--- | :--- |
| **Quỳ 1 gối (Half-Kneeling)** | `dropping into a low half-kneel, right knee planted firmly in the dirt while left leg bends at 90 degrees with foot flat on the ground` | Cúi xuống nhặt cành cây, nhóm lửa, kiểm tra dấu vết |
| **Ngồi xổm thấp (Deep Squat)** | `crouched in a deep primal squat, knees bent tightly near the chest, heels hovering slightly above the uneven stone floor` | Tư thế người nguyên thủy ngồi sưởi ấm hoặc chế tác |
| **Lội nước sâu (Wading Stride)** | `submerged waist-deep in turbulent water, lifting the left knee high against the current to take a heavy forward step` | Cảnh vượt sông băng, đầm lầy |
| **Chân trụ vững / Chân bước rộng** | `wide stable stance with feet planted shoulder-width apart, knees slightly flexed to absorb impact` | Đứng vững trước gió bão hoặc đối diện thú dữ |

### Tầng 5: Độ Nghiêng Đầu, Vector Ánh Mắt & Cơ Mặt (`Head, Gaze & Micro-Expression`)
Tạo linh hồn cho nhân vật bằng cách khóa chính xác hướng nhìn (Eye-line match):

| Hướng Đầu & Biểu Cảm | Prompt (EN) | Cảm xúc truyền tải |
| :--- | :--- | :--- |
| **Ngước nhìn lên trời (Awe / Fear)** | `chin tilted upward at 35 degrees, wide unblinking eyes locked on the upper-left sky, eyebrows raised in primal awe, lips slightly parted` | Nhìn tia sét đánh xuống hoặc cây đại thụ bốc cháy |
| **Cúi sát tập trung (Intense Focus)** | `head bowed low toward the hands, gaze fixed intently on the glowing coal, cheeks puffed out blowing a steady stream of air` | Cảnh thổi than hồng bùng cháy |
| **Ngoái nhìn qua vai (Suspense)** | `head turned sharply over the right shoulder looking backward, eyes narrowed in vigilance, jaw clenched tightly` | Cảnh vừa chạy vừa ngoái nhìn đám cháy rừng/thú dữ đuổi theo |
| **Nhăn mặt chịu đựng (Endurance)** | `chin tucked down against the freezing wind, eyes squinted against falling rain, brow deeply furrowed in grim determination` | Cảnh đi dưới mưa bão hoặc băng giá |

---

## 3. Ma Trận 10 Tổ Hợp Tư Thế Điện Ảnh Mẫu (`Ready-to-Use Pose Presets`)

Bảng dưới đây cung cấp các cụm mô tả tư thế hoàn chỉnh (ghép sẵn 5 tầng) để đưa thẳng vào prompt:

| Mã Pose | Tên Tư Thế | Chuỗi Prompt Chuẩn Giải Phẫu 5 Tầng (Copy vào khối `[Action & Pose]`) |
| :--- | :--- | :--- |
| **P01** | **Primal Awe (Ngước nhìn sấm sét)** | `three-quarter front view, standing in a wide grounded stance with knees slightly flexed, torso leaning slightly back in sudden recoil, left forearm raised defensively near the brow while right arm hangs tense at the side, chin tilted upward 35 degrees with wide eyes locked on the upper-right sky in primal shock` |
| **P02** | **Desperate Sprint (Chạy thoát thân)** | `dynamic side-tracking profile view facing left, torso pitched forward at a 30-degree sprint angle, legs in full mid-stride extension kicking up ash, elbows bent at 90 degrees pumping vigorously, head turning briefly over the right shoulder with wide anxious eyes` |
| **P03** | **Cautious Reach (Cúi nhặt lửa)** | `three-quarter angle, dropping into a low half-kneel with left knee planted on the stone, spine curved forward cautiously, right arm extended fully with fingers gripping the unburnt base of a glowing branch, left hand held near the chest for balance, gaze fixed intently on the flame tip` |
| **P04** | **Triumphant Torch Raise (Giơ cao ngọn đuốc)** | `low-angle hero view, standing upright with weight shifted onto the front left leg, chest expanded, right arm extended straight overhead with all five fingers tightly gripping a blazing wooden torch, chin lifted proudly with warm firelight reflecting in his focused eyes` |
| **P05** | **Ember Blowing (Quỳ thổi than hồng)** | `close medium profile view, crouched low on both knees with spine deeply bowed toward the ground, both hands cupped closely around a nest of dry grass and glowing red coals, head lowered within inches of the hands, cheeks puffed out blowing a gentle stream of air into the embers` |
| **P06** | **Craft & Wrap (Ngồi bó lửa vào túi da)** | `three-quarter high-angle view, seated cross-legged on the cave floor with shoulders hunched forward in intense concentration, both hands working dexterously with fingers folding a thick bison-hide flap over glowing charcoal, head tilted down with steady focused gaze` |
| **P07** | **Glacier Wading (Lội sông băng giữ lửa)** | `wide tracking view, wading waist-deep through turbulent icy water, torso leaning against the strong current, both arms raised high above the shoulders keeping a tied leather ember-pouch completely dry, jaw clenched and eyes squinting against freezing mist` |
| **P08** | **Storm Shielding (Lấy thân che lửa dưới mưa)** | `medium shot, kneeling on wet mud with spine curled into a tight protective arch, shoulders hunched forward and both arms wrapped tightly around a smoking leather pouch held against his chest, head bowed low with rainwater dripping from his tangled hair` |
| **P09** | **Exhausted Collapse (Kiệt sức trong bóng tối)** | `low-key side view, slumped exhaustedly against a rough cave wall with legs stretched out Loosely in front, shoulders dropped, both hands resting limply over a cold ash-covered pouch on his lap, head resting back against the stone with heavy-lidded eyes staring into darkness` |
| **P10** | **Rebirth of Flame (Nâng niu đốm lửa hy vọng)** | `intimate close-up view, kneeling in pitch darkness with upper body leaning close to the floor, palms cupped gently together like a cradle around a single newly ignited golden flame, face illuminated from below with a subtle expression of profound relief and wonder` |

---

## 4. Quy Tắc Tương Thích Theo Từng Mô Hình AI (Model-Specific Pose Tuning)

1. **Qwen-Image / Wan 2.1 / Flux.1 Dev:**
   - Rất nhạy với **ngôn ngữ tự nhiên mô tả quan hệ không gian** (`three-quarter view`, `left hand gripping X while right hand rests on Y`).
   - Luôn chỉ định rõ `left` và `right` cho từng tay/chân để mô hình không bị chập 2 tay làm 1.
2. **Google Veo 3 / 3.1:**
   - Chỉ đặt **1 chuyển động chuyển tiếp tư thế (Pose Transition)** trong mỗi clip 8 giây (ví dụ: *từ tư thế quỳ thổi than $\rightarrow$ ngẩng đầu mỉm cười khi lửa bùng lên*). Không nhồi quá 2 hành động lớn.
3. **ByteDance Seedance 2.0 / Kling AI:**
   - Kết hợp ảnh tham chiếu `@Image 1` (chứa Character Turnaround 4 góc) + câu lệnh Pose 5 tầng ở mục `Action:` để khóa cả mặt lẫn dáng.
4. **Negative Prompt chống lỗi giải phẫu (nếu công cụ hỗ trợ):**
   ```text
   extra limbs, fused fingers, six fingers, mutated hands, floating feet, disconnected joints, unnatural spine twist, cross-eyed, mannequin stiffness, morphing clothes
   ```
