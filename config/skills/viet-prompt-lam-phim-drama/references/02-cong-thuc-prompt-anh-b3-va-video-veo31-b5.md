# Công Thức Viết Prompt Ảnh Cảnh First Frame (`B3`) & Video `Veo 3.1` Có Thoại Tiếng Việt (`B5`)

Tài liệu này quy định cấu trúc chuẩn cho 2 file CSV quan trọng nhất khi render trên Google Flow: `B3_Prompt_Anh_Canh.csv` (tạo ảnh `First Frame` bằng `Nano Banana Pro`) và `B5_Prompt_Video_English.csv` (tạo video `8.0s` có khẩu hình Tiếng Việt bằng `Veo 3.1 Lite`).

---

## 1. Công Thức 6 Thành Phần Cho Prompt Ảnh Cảnh First Frame (`B3_Prompt_Anh_Canh.csv`)

Mỗi dòng trong `B3_Prompt_Anh_Canh.csv` bắt buộc lắp ghép từ 6 biến hằng số theo đúng thứ tự:

$$\text{Prompt B3} = [\text{SCENE\_XX \& UID}] + [\text{STYLE\_LOCK}] + [\text{Cỡ Cảnh \& Tiêu Cự}] + [\text{CHAR\_LOCK + Tư Thế}] + [\text{PROP\_LOCK (cm)}] + [\text{LOC\_LOCK}]$$

### Bảng Chọn Tiêu Cự Ống Kính Theo Mục Đích Kịch Tính

| Tiêu Cự & Cỡ Cảnh | Khi Nào Sử Dụng | Từ Khóa Tiếng Anh Chuẩn Nhúng Vào `B3` |
| :--- | :--- | :--- |
| **`35mm lens` + Đại cảnh (`Wide establishing shot`)** | Cảnh mở màn cung điện/sảnh tiệc, cảnh phục binh trên mái ngói, cảnh hàng trăm tướng sĩ quỳ lạy. | `Cinematic wide establishing low-angle shot (35mm lens, deep depth of field)` |
| **`50mm lens` + Trung cảnh (`Medium / MCU shot`)** | Cảnh đối thoại đối đầu, bước lên bậc thềm, mở hộp gấm, rút kiếm, ký hoặc xé hợp đồng. | `Dramatic medium close-up shot (50mm lens, shallow depth of field, sharp focus on subject)` |
| **`85mm lens` + Cận cảnh (`Close-up / Extreme close-up`)** | Cảnh đặc tả ánh mắt rơi lệ, nụ cười lạnh, giật mình sững sờ, hoặc **đặc tả cận cảnh Đồ vật chính (`PROP_LOCK`)**. | `Intense emotional close-up shot (85mm portrait lens, f/1.4, creamy bokeh background, razor-sharp eyes and prop detail)` |

---

## 2. Công Thức Viết Prompt Video `Veo 3.1` Tự Nói Tiếng Việt Chuẩn Khẩu Hình (`B5_Prompt_Video_English.csv`)

### 2.1. Quy Tắc Vàng: "1 Cảnh 8s = 1 Chuyển Động Máy + 1 Hành Động Đơn + 1 Câu Thoại `14–20 Từ`"
- Không bao giờ nhồi 2–3 hành động phức tạp hoặc câu thoại dài quá 22 từ vào 1 cảnh 8 giây.
- Câu thoại `14–20 từ` Tiếng Việt giúp `Veo 3.1` phát âm rõ từng dấu thanh trong `4.0s – 5.2s` với khẩu hình khớp tự nhiên 100%.

### 2.2. Khóa Mô Tả Chất Giọng (`Voice Timbre Lock`) Cho Từng Nhân Vật
Để giọng của cùng 1 nhân vật không bị đổi tông giữa các cảnh, luôn dán cố định cụm mô tả chất giọng:
- **Nữ chính (`uid01` — Uy quyền, sắc lạnh):** `a clear, regal, emotionally resonant Vietnamese female voice (adult royal empress tone, crisp Northern Vietnamese pronunciation)`
- **Nam chính (`uid02` — Trầm ấm, uy nghiêm):** `a deep, commanding, resonant Vietnamese male voice (adult imperial regent baritone, crisp Vietnamese pronunciation)`
- **Nữ phụ phản diện (`uid03` — Sắc sảo, hoảng loạn):** `a sharp, expressive, dramatic Vietnamese female voice (adult scheming consort tone, crisp Vietnamese pronunciation)`

### 2.3. Ba Mẫu Prompt Âm Thanh Bắt Buộc Phân Biệt Rõ Trong `B5_Prompt_Video_English.csv`

#### Mẫu A — Nhân Vật Mở Miệng Nói Trực Tiếp Trên Hình (`Direct Lip-Sync Dialogue`)
```text
[0.0s-8.0s Action]: Slow camera push-in (50mm lens). The empress pulls off the red cord and snaps open the ancient imperial golden silk scroll (25cm wide, 40cm unrolled length) with both hands. She speaks aloud in a clear, regal Vietnamese female voice: "Nhìn cho rõ ấn tín của Tiên Đế! Kẻ tráo mật chỉ năm xưa chưa bao giờ là thần thiếp!" SFX: sharp snap of silk scroll unfurling, cold wind. No background music, no subtitles, no on-screen text.
```

#### Mẫu B — Độc Thoại Nội Tâm / Sững Sờ Biến Sắc (`Internal Monologue — Miệng Ngậm Chặt`)
```text
[0.0s-8.0s Action]: Fast push-in to close-up (85mm lens). The regent stares downward at the translucent blood-red mutton-fat jade phoenix pendant (7cm long, fits in one palm) with wide stunned eyes, his lips firmly closed, not speaking, silent micro-expression of shock. Internal monologue voiceover in a deep Vietnamese male voice while his mouth remains completely closed: "Là ngọc bội Phượng Hoàng thật... Chẳng lẽ suốt ba năm qua, bản vương đã trách nhầm nàng?" SFX: heavy low heartbeat thud, cold wind. No background music, no subtitles, no on-screen text.
```

#### Mẫu C — Cận Cảnh Đồ Vật Chính Hoặc Hành Động Võ Thuật Thuần Túy (`Pure Action / Hero Prop Focus`)
```text
[0.0s-8.0s Action]: Dynamic low-angle tracking shot (35mm lens). The regent swings his black-iron sword upward, deflecting a flying black feathered dart mid-air in a bright burst of golden sparks before the vermilion dragon pillars. SFX: loud metallic clang of sword striking metal dart, shower of sparks, howling wind. No background music, no subtitles, no on-screen text.
```
