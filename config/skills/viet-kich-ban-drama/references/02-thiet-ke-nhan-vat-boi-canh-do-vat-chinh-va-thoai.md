# Thiết Kế 3 Trụ Cột Cố Định Trong Kịch Bản (Nhân Vật – Bối Cảnh – Đồ Vật Chính) & Luật Viết Lời Thoại

Để tập phim sau khi chuyển sang AI Render không bị lệch mặt nhân vật, không bị nhảy bối cảnh lung tung và không bị biến dạng đạo cụ, **ngay từ giai đoạn viết kịch bản (`viet-kich-ban-drama`)**, biên kịch bắt buộc phải thiết lập **Hồ Sơ 3 Trụ Cột Cố Định (`Character – Location – Key Prop Bible`)** ở đầu file kịch bản.

---

## 1. Trụ Cột 1: Thiết Kế Hồ Sơ Nhân Vật Đối Xứng (`Character Bible: uid01..uid06`)

Mỗi tập phim ngắn `3–5 phút` chỉ nên tập trung vào **3 đến 6 nhân vật có mã định danh cố định (`uid01..uid06`)**:

| Mã UID | Vai Trò Cốt Truyện | Hai Tầng Thân Phận (Tương Phản Kịch Tính) | Khóa Ngoại Hình & Trang Phục Cố Định (Từ Đầu Đến Giày) | Khóa Khẩu Khí & Chất Giọng (`Voice Timbre`) |
| :--- | :--- | :--- | :--- | :--- |
| **`uid01`** | **Nhân vật chính** *(Nữ chính báo thù / Chủ tịch ẩn danh)* | *Vỏ bọc:* Phế hậu lãnh cung / Người vợ-chồng bình dị bị coi thường.<br>*Thật:* Chủ nhân Hổ Phù Bắc Cảnh / Người sáng lập Tập đoàn nghìn tỷ. | Ghi rõ khuôn mặt, nốt ruồi son/ánh mắt, kiểu tóc, bộ trang phục đặc trưng và **bắt buộc ghi rõ đôi giày/hài**. | Điềm tĩnh, sắc lạnh, câu chữ ngắn gọn như dao cắt; không bao giờ gào thét mất kiểm soát. |
| **`uid02`** | **Nhân vật đối trọng** *(Nhiếp Chính Vương / Người chồng-vợ kiêu ngạo)* | Quyền cao chức trọng nhưng bị che mắt suốt 3 năm bởi kẻ giả mạo; từ lạnh lùng chuyển sang chấn động, hối hận. | Trang phục vương giả / vest lịch lãm tối màu, khí chất uy nghiêm, ánh mắt sắc bén. | Giọng trầm uy lực ở đầu tập; chuyển sang nghẹn ngào, bàng hoàng khi phát hiện sự thật. |
| **`uid03`** | **Phản diện trực tiếp** *(Quý phi giả mạo / Tiểu tam / Kẻ cướp công)* | Giả vờ yếu đuối, đạo đức giả để vu khống `uid01`; khi bị vạch mặt thì lộ bản chất tàn độc, hoảng loạn. | Trang phục lộng lẫy đối lập với `uid01` (VD: áo tím vàng kim / đầm dạ hội trắng ngọc trai). | Giọng sắc sảo, chua ngoa khi đắc ý; lắp bắp, run rẩy khi bị lộ vật chứng. |
| **`uid04..06`** | **Nhân vật chứng nhân / Đòn bẩy quyền lực** *(Thống lĩnh / Chủ tịch HĐQT / Quản gia)* | Xuất hiện đúng thời khắc cao trào để xác nhận thân phận thật của `uid01` và thi hành lệnh trừng phạt. | Giáp trụ / đồng phục lễ tân / vest quản gia cấp cao đồng bộ. | Giọng dõng dạc, kính cẩn tuyệt đối khi cúi đầu trước `uid01`. |

---

## 2. Trụ Cột 2: Thiết Kế Bối Cảnh Cố Định Xuyên Suốt Tập Phim (`Location Bible: loc01..loc05`)

- **Luật Giới Hạn Không Gian ("1 Tập = Tối Đa 1–3 Bối Cảnh Chính"):**
  - Phim drama ngắn kịch tính nhất khi các nhân vật bị khóa trong một **"Đấu trường không gian khép kín" (`Pressure-Cooker Arena`)** suốt cả tập phim (ví dụ: *Sân chầu & Đại điện Kim Loan đêm tuyết*, hoặc *Sảnh tiệc tầng 68 Landmark & Phòng VIP*).
  - Việc giữ cố định 1–3 bối cảnh giúp khán giả theo dõi liền mạch không gian đối đầu và giúp bước viết Prompt khóa cứng kiến trúc 100%.
- **Bảng Khai Báo Bối Cảnh Bắt Buộc Ở Đầu Kịch Bản:**
  - Với mỗi `LOC_01..LOC_03`, kịch bản phải ghi rõ:
    1. **Kiến trúc & Vật liệu sàn/tường:** (VD: Sàn đá hoa cương đen bóng, cột gỗ sơn son thếp vàng chạm rồng).
    2. **3 Vật mốc cố định hậu cảnh:** (VD: Bậc thềm đá trắng, chậu lửa đồng đang cháy, rèm lụa vàng phía sau ngai rồng).
    3. **Thời gian, Thời tiết & Tông màu ánh sáng:** (VD: Đêm tuyết rơi lạnh `6500K` tương phản với ánh lửa đồng ấm `2700K`).
    4. **Trục đứng 180 độ của nhân vật:** Quy định rõ ai đứng bên trái nhìn sang phải, ai đứng trên thềm cao bên phải nhìn xuống trái.

---

## 3. Trụ Cột 3: Thiết Kế Đồ Vật / Đạo Cụ Chính Xuyên Suốt Tập Phim (`Key Prop Bible: prop01..prop05`)

Trong kịch bản Drama thượng thừa, **mọi màn lật kèo đều phải có Vật Chứng Cụ Thể (`Tangible Hero Prop / MacGuffin`)** để khán giả nhìn thấy tận mắt trên khung hình, thay vì chỉ nói suông bằng miệng.

### Quy Tắc Thiết Kế Đồ Vật Chính Trong Kịch Bản
1. **Mỗi tập phim phải có 2–4 Đồ vật chính (`prop01..prop04`)** được định nghĩa chi tiết ngay đầu kịch bản:
   - **Kích thước thực tế bằng `cm` & Tỷ lệ bàn tay:** (VD: *Cuộn mật chỉ lụa vàng rộng `25cm`, dài `40cm`*; *Miếng ngọc bội Phượng Hoàng đỏ dài `7cm`, rộng `4cm`, nằm gọn trong lòng bàn tay*; *Hổ phù đồng đen dài `10cm`*; *Bìa hồ sơ da đen khổ A4 `21cm x 30cm`*).
   - **Dấu hiệu nhận diện độc nhất (`Unique Forensic Detail`):** Chi tiết mà chỉ chủ nhân thật sự mới biết (VD: *Vết nứt chéo qua cánh phượng hoàng mặt sau ngọc bội*; *Chữ "Cửu" khắc chìm dưới đáy hộp gấm*; *Con dấu sáp đỏ đóng lệch góc phải*).
2. **Quy tắc "Gieo Đồ Vật Ở Đầu Tập – Gặt Bão Táp Ở Cuối Tập" (`Chekhov's Gun`):**
   - Đồ vật xuất hiện lần đầu ở `Cảnh 02–04`, được đặc tả cận cảnh ở `Cảnh 13–16` và trở thành đòn kết liễu ở `Cảnh 21–38`.
   - Trong bảng phân cảnh kịch bản, ở cột `Đồ vật xuất hiện`, bắt buộc ghi rõ mã `[prop01]` để bước viết Prompt tự động nhúng chuỗi khóa đồ vật giống hệt nhau ở mọi cảnh!

---

## 4. Luật Viết Lời Thoại Điện Ảnh (`14 – 20 Từ / Cảnh 8 Giây`) & Bảng Từ Vựng An Toàn

### 4.1. Công Thức Câu Thoại "Ngắn – Sắc – Đắt Giá"
- Mỗi cảnh video AI dài `8.0 giây`. Để nhân vật nói tròn vành rõ chữ, đúng nhịp thở điện ảnh (`3.2 – 3.8 từ/giây`), mỗi câu thoại trong 1 cảnh bắt buộc nằm trong khoảng **`14 đến 20 từ Tiếng Việt`**.
- **Nếu một ý thoại dài 35–40 từ:** Bắt buộc **tách làm 2 cảnh liên tiếp**:
  - *Cảnh A (Trung cảnh `50mm`):* Nhân vật nói vế đầu (`16 từ`) vừa mở đạo cụ.
  - *Cảnh B (Cận cảnh `85mm`):* Máy quay nhảy sát vào ánh mắt sắc lạnh, nhân vật chốt câu kết liễu (`16 từ`).
- **Ghi rõ 1 trong 3 Chế Độ Thoại ở mỗi cảnh:**
  1. `[Lip-Sync]`: Nhân vật mở miệng nói trực tiếp trên hình.
  2. `[Nội Tâm]`: Nhân vật ngậm chặt miệng, ánh mắt chấn động, giọng đọc vang lên trong đầu.
  3. `[SFX / Hành Động]`: Cảnh cận cảnh đồ vật hoặc đỡ kiếm, không có thoại nhân vật.

### 4.2. Bảng Chuyển Đổi Ngôn Từ Kịch Tính An Toàn (Tránh Chạm Bộ Lọc AI Khi Render)

| Tình Huống Kịch Bản | ❌ Cách Viết Thô (Dễ Bị Bộ Lọc Google Flow Chặn) | ✅ Cách Viết Điện Ảnh Cao Cấp (Vượt Lọc 100% & Sang Trọng Hơn) |
| :--- | :--- | :--- |
| **Vật chứng tối mật** | *"Bức huyết thư thấm máu"*, *"Tờ giấy dính máu"* | *"Bức mật chỉ đóng ấn chu sa"*, *"Di chiếu mật của Tiên Đế"* |
| **Đe dọa / Trừng phạt** | *"Ta sẽ giết ngươi!"*, *"Chém đầu ả cho ta!"* | *"Hôm nay bản cung đích thân xử tội ngươi!"*, *"Tước hết phong hiệu, áp giải vào đại lao!"* |
| **Âm mưu hãm hại** | *"Bỏ thuốc độc vào chén trà"*, *"Đâm chết hắn"* | *"Tráo chén trà Hàn Băng"*, *"Ra tay tuyệt tình trong đêm tuyết"* |
| **Thoát nạn trở về** | *"Ngươi tưởng ta đã chết dưới vực ư?"* | *"Ngươi tưởng bản cung không thể sống sót bước ra khỏi vực Hàn Băng ư?"* |
