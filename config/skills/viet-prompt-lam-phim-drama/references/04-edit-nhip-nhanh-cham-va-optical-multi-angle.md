# Nhịp Nhanh – Chậm Thì Edit Thế Nào? (`4 Pacing Modes & Optical Multi-Angle Split`)

Tài liệu này quy định thuật toán dựng hậu kỳ Đạo Diễn (`build_fast_paced_director_cut.py`) để biến chuỗi các clip AI `8.00 giây` đều nhau thành một bộ phim có **nhịp nhanh dồn dập khi đấu trí/hành động** và **nhịp chậm lắng đọng khi bi thương/đại kết cục**.

---

## 1. Ma Trận 4 Chế Độ Nhịp Độ (`4 Pacing Profiles: Nhanh – Giật Gân – Đối Chất – Chậm Lắng`)

Mọi mô hình AI (`Veo 3.1`, `Seedance`, `Kling`) đều sinh ra các clip dài cố định `8.00 giây`, trong đó có `1.5s – 3.0s` khoảng chết ở đầu/cuối cảnh. Tuy nhiên, **không được cắt cào bằng mọi cảnh như nhau**, mà phải phân loại từng cảnh vào 1 trong **4 Chế Độ Nhịp Độ** dưới đây:

| Chế Độ Nhịp Độ (`Pacing Mode`) | Áp Dụng Cho Loại Cảnh Nào? | Độ Dài Giữ Lại (Từ `8.0s` gốc) | Tốc Độ Đẩy Nhịp (`atempo` giữ nguyên tông giọng) | Kỹ Thuật Cắt & Nhảy Góc Cận Cảnh (`Punch-In Split`) |
| :--- | :--- | :---: | :---: | :--- |
| **1. `ACTION_BLITZ`**<br>*(Nhịp Cực Nhanh — Hành động / Võ thuật / Vả mặt trực diện)* | Cảnh bắn tên, rút kiếm đỡ tên, tát, hất đổ bàn tiệc, cấm vệ quân vây bắt (`SCENE_25..29, 37`) | **`2.8s – 4.5s`** | **`1.14x – 1.20x`** | Cắt sát ngay khoảnh khắc va chạm; tự động **chia đôi cảnh thành 2 góc máy** (Trung cảnh $\rightarrow$ Cận cảnh `1.16x` ngay điểm nổ tia lửa) + chèn SFX kim khí. |
| **2. `REACTION_SNAP`**<br>*(Nhịp Giật Gân — Sững sờ / Độc thoại nội tâm / Lộ Đồ vật chính)* | Cảnh nhìn thấy mật chỉ, thấy ngọc bội gãy, giật mình tái mặt (`SCENE_04, 10, 14, 16, 24, 34`) | **`3.1s – 4.2s`** | **`1.10x – 1.14x`** | Cắt bỏ hoàn toàn thời gian chờ; giữ đúng biểu cảm biến sắc + chèn tiếng *Heartbeat* đập mạnh + nhảy cận cảnh vào đôi mắt hoặc đồ vật chính. |
| **3. `CONFRONTATION_FAST`**<br>*(Nhịp Đối Chất Dồn Dập — Đấu khẩu / Vạch mặt)* | Cảnh tung bằng chứng, chất vấn qua lại, ép mở hộp gấm (`SCENE_02, 03, 05, 08, 09, 11..13, 15, 21..23, 30..33, 36`) | **`3.8s – 5.5s`** | **`1.07x – 1.10x`** | Dùng bộ dò tiếng nói cắt sạch khoảng lặng trước chữ đầu tiên (`lead-in = 0.08s`) và sau chữ cuối cùng (`tail = 0.14s`); ở giữa câu thoại nhảy góc cận cảnh `1.16x`. |
| **4. `EMOTIONAL_CLIMAX`**<br>*(Nhịp Chậm Lắng Đọng — Bi tráng / Rơi lệ / Mở màn / Đại kết cục)* | Cảnh mở màn đêm tuyết, cảnh kể nỗi oan 3 năm rơi lệ, cảnh giơ Hổ Phù cuối tập (`SCENE_01, 06, 07, 17..20, 35, 38`) | **`4.5s – 5.6s`** | **`1.00x – 1.05x`** | **Giữ nhịp chậm có chủ đích:** Để lại `0.25s` đầu và `0.35s` cuối cảnh cho tiếng Sáo Tiêu / Đại giao hưởng ngân vang và giọt nước mắt kịp rơi, tạo độ lắng sâu sắc. |

---

## 2. Kỹ Thuật "1 Cảnh Render = 2 Góc Máy Trên Phim" (`Optical Multi-Angle Split`)

Để khán giả xem phim trên điện thoại không bao giờ thấy một khung hình đứng yên quá `2.8 giây`:
- Với mọi cảnh có thời lượng sau khi cắt `>= 3.5 giây`, script tự động chia cảnh đó thành **2 cú máy liên tiếp** bằng `FFmpeg filter_complex`:
  1. **Nửa đầu (`54%` thời lượng — Cam A):** Giữ góc máy gốc (`1280x720` ngang hoặc `720x1280` dọc).
  2. **Nửa sau (`46%` thời lượng — Cam B Cận Cảnh):** Ngay tại chữ nhấn mạnh giữa câu thoại, cắt chuyển thẳng sang góc **Cận Cảnh Quang Học `1.16x – 1.32x`** (`scale=1484:834,crop=1280:720:102:57,eq=contrast=1.04:saturation=1.05` cho `16:9`, hoặc tương ứng cho `9:16`) kèm một tiếng *Tension Hit* nhẹ (`-13 dB`).
- **Kết quả:** Một tập phim `25–38 cảnh` gốc biến thành **`50–75 cú cắt góc máy liên hoàn`** (trung bình `2.5 giây / 1 lần đổi khung hình`), cuốn hút hệt như phim ngắn Douyin triệu view!

---

## 3. Quy Tắc Bất Biến Khi Trải Nhạc Nền Trên Bản Edit Nhịp Nhanh – Chậm

1. **CẤM TUYỆT ĐỐI** ghép nhạc nền vào từng cảnh 8 giây rồi mới cắt ngắn cảnh xuống 3–4 giây (vì làm vậy nhạc nền sẽ bị đứt khúc và vấp nhịp ở tất cả các điểm chuyển cảnh).
2. **Quy trình 3 bước chuẩn phòng thu:**
   - **Bước 1:** Cắt gọn hình ảnh + giọng thoại của từng cảnh theo 4 chế độ `ACTION_BLITZ` / `REACTION_SNAP` / `CONFRONTATION_FAST` / `EMOTIONAL_CLIMAX` và nối lại thành trục hình + thoại mới.
   - **Bước 2:** Tính toán lại mốc thời gian bắt đầu/kết thúc của 6 Hồi Cao Trào trên trục thời gian mới, sau đó **trải 6 bản nhạc nền chạy liền mạch từ đầu Hồi đến cuối Hồi** (chuyển mượt giữa các Hồi bằng `acrossfade 1.2s`).
   - **Bước 3:** Áp dụng `Frequency Slotting` + `RMS Sidechain Ducking` + `9 SFX` cao trào + chuẩn hóa âm lượng `-14 LUFS` và đốt phụ đề `.srt` khớp chính xác với tốc độ mới của từng cảnh!
