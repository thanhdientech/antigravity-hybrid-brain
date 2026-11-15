# Nhạc Nền Sử Dụng Thế Nào & Cao Trào Phim Ghép Thế Nào (`6-Phase BGM, Sidechain Ducking & 9 SFX`)

Tài liệu này hướng dẫn chi tiết cách thiết kế âm nhạc đa cao trào và kỹ thuật hòa âm phòng thu tự động trong `build_bgm_and_remaster.py` và `build_fast_paced_director_cut.py`.

---

## 1. Nhạc Nền Sử Dụng Thế Nào? (Kiến Trúc 6 Hồi Cao Trào `6-Phase Dramatic BGM`)

### 1.1. Hai Nguyên Tắc Bất Biến Về Nhạc Nền Phim AI
1. **Tắt 100% nhạc nền khi sinh từng clip `Veo 3.1` (`"No background music"`):** Vì mỗi clip 8 giây do AI sinh ra sẽ có một đoạn nhạc ngẫu nhiên khác nhau; khi nối 25–38 cảnh sẽ bị đứt nhạc 38 lần và dính tạp âm vào giọng thoại.
2. **Chia tập phim thành 6 Hồi Nhạc Nền Theo Biểu Đồ Nhịp Tim (`86 BPM` $\rightarrow$ `138 BPM`):** Thay vì dùng 1 bài nhạc đều đều suốt 5 phút, tập phim được chia làm **6 Chương Nhạc Nền (`B9_Music_Prompts.csv`)** bám sát 6 cung bậc cảm xúc của kịch bản:

| Hồi / Cao Trào Trong Tập Phim | Phân Cảnh Áp Dụng | Nhịp Độ (`BPM`) | Nhạc Cụ Chủ Đạo (Cổ Trang / Hiện Đại) | Tác Dụng Dẫn Dắt Cảm Xúc Khán Giả |
| :--- | :---: | :---: | :--- | :--- |
| **Hồi 1: Mở Màn Áp Lực & Móc Câu (`Hook & Tension`)** | `SCENE_01 – 07` | **`92 BPM`** | *Cổ trang:* Đàn Nhị (Erhu) độc tấu u ám + Đàn Tranh (Guzheng) + Chuông đồng + Sub-bass.<br>*Hiện đại:* Cello trầm + Piano tối giản + Sub-bass nhịp tim. | Tạo không khí áp lực, bí ẩn, uy quyền ngay khi nhân vật chính xuất hiện. |
| **Hồi 2: Đấu Trí & Ép Cung (`Confrontation & Trap`)** | `SCENE_08 – 14` | **`112 BPM`** | *Cổ trang:* Đàn Tỳ Bà (Pipa) gảy staccato dồn dập + Cello pizzicato + Phách gỗ.<br>*Hiện đại:* Strings staccato + Synth pulse căng thẳng + Hi-hat sắc. | Đẩy nhịp đối chất tăng dần khi phản diện giăng bẫy và ép mở hộp vật chứng. |
| **Hồi 3: Lộ Đồ Vật Chính & Nỗi Oan 3 Năm (`Emotional Truth`)** | `SCENE_15 – 20` | **`86 BPM`** | *Cổ trang:* Sáo Tiêu (Xiao) & Đàn Nhị ai oán + Dàn dây giao hưởng dâng trào.<br>*Hiện đại:* Solo Violin nức nở + Piano hợp âm rải + Dàn dây ấm. | Hạ BPM xuống chậm nhất để chạm vào cảm xúc nghẹn ngào khi sự thật được phơi bày. |
| **Hồi 4: Lật Mặt & Ám Hiệu Sát Cơ (`Betrayal & Escalation`)** | `SCENE_21 – 25` | **`122 BPM`** | *Cổ trang:* Trống trận Tanggu + Dây tremolo căng như dây đàn + Kèn đồng trầm.<br>*Hiện đại:* Hybrid Brass + Trống điện tử dồn nhịp + Riser căng thẳng. | Báo hiệu nguy hiểm cận kề khi kẻ ác bị dồn vào chân tường và phát tín hiệu đánh úp. |
| **Hồi 5: Đỉnh Điểm Hành Động / Vả Mặt (`Climax Action`)** | `SCENE_26 – 31` | **`138 BPM`** | *Cổ trang:* Đại trống trận Taiko tốc độ cao + Tỳ Bà chiến đấu Võ Hiệp + Kèn đồng.<br>*Hiện đại:* Epic Hybrid Orchestral Percussion + Distortion Bass + Brass Hits. | Đẩy tốc độ hành động lên đỉnh điểm (`138 BPM`) khi tên bắn từ mái điện / tung đòn kết liễu. |
| **Hồi 6: Bá Khí Đổi Chủ & Cliffhanger (`Sovereign Finale`)** | `SCENE_32 – Cuối` | **`126 BPM`** | *Cổ trang:* Đại giao hưởng sử thi đế vương + Trống đại + Chuông đồng + Kèn Suona & Tù và.<br>*Hiện đại:* Hùng ca giao hưởng chiến thắng + Sub-drop kết màn. | Bùng nổ khí thế vương giả áp đảo khi nhân vật chính giơ Hổ Phù / nắm trọn quyền lực tối cao. |

---

## 2. Cao Trào Phim Ghép Thế Nào? (Kỹ Thuật Hòa Âm 3 Lớp Studio)

Để nhạc nền dâng cao trào mãnh liệt mà **không bao giờ lấn át giọng thoại Tiếng Việt**, hệ thống thực thi 3 lớp xử lý âm thanh tự động:

### 2.1. Lớp 1 — Khắc Rãnh Tần Số Nhường Giọng Thoại (`Frequency Slotting EQ`)
- Cắt nhẹ **`-4.0 dB` ở tần số `2,400 Hz`** trên kênh Nhạc nền (BGM) và nâng **`+2.2 dB` ở tần số `2,800 Hz`** trên kênh Giọng thoại Tiếng Việt.
- Kết quả: Giọng nói nhân vật luôn nằm gọn trong "rãnh tần số ưu tiên", rõ từng chữ ngay cả giữa lúc trống trận Taiko và dàn kèn đồng đang đánh mạnh nhất.

### 2.2. Lớp 2 — Tự Động Hạ Nhạc Khi Thoại & Dâng Vọt Sau Thoại (`RMS-Adaptive Sidechain Ducking`)
- Hệ thống quét năng lượng âm thanh (`RMS`) của giọng nói theo từng khung `50ms`:
  - **Lúc nhân vật đang mở miệng nói (`RMS > 0.028`):** Nhạc nền tự động hạ mượt xuống **`24%` (`-12.4 dB`)**.
  - **Ngay khoảnh khắc nhân vật vừa dứt câu thoại (hoặc trong cảnh biểu cảm sững sờ / cảnh vung kiếm đỡ tên):** Nhạc nền lập tức **dâng vọt lên `52% – 66%` (`-5.6 dB` $\rightarrow$ `-3.7 dB`)** trong `0.18s`, tạo hiệu ứng sóng nhạc trào dâng cuốn lấy cảm xúc người xem!

### 2.3. Lớp 3 — Chèn 9 Hiệu Ứng Âm Thanh Đòn Bẩy Cao Trào (`9 Dramatic Punctuation SFX`)
Chèn chính xác vào đầu hoặc giữa cảnh cao trào để nhân đôi sức nặng thị giác:
1. `palace_gong` *(Tiếng chuông đồng đại điện)*: Mở màn Cảnh 01 và kết màn Cảnh cuối.
2. `sub_drop` *(Cú nổ trầm `40Hz–80Hz`)*: Đánh đúng giây nhân vật chính tung vật chứng hoặc lật bài ngửa (`SCENE_02, 05, 13, 21, 32`).
3. `heartbeat` *(Tiếng tim đập thình thịch)*: Đánh nền dưới các cảnh cận mặt sững sờ / độc thoại nội tâm (`SCENE_04, 10, 14, 17, 24, 34`).
4. `jade_chime` *(Tiếng ngọc ngân thanh thoát)*: Đánh khi mở hộp gấm lộ Ngọc bội Phượng Hoàng / Nhẫn kim cương (`SCENE_03, 15, 16`).
5. `sword_ring` & `sword_clash` *(Tiếng rút kiếm & đánh bật ám khí)*: Đánh khớp khung hình vung kiếm đỡ tên (`SCENE_27, 28`).
6. `war_horn` *(Tiếng tù và đại quân)*: Đánh vang dội khi giơ Hổ Phù Bắc Cảnh (`SCENE_33, 38`).
