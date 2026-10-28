# 📖 HƯỚNG DẪN SỬ DỤNG: BỘ CÔNG CỤ VIDEO STORYTELLING (SEEDANCE 2.0 & GOOGLE VEO 3)

Tài liệu hướng dẫn chi tiết cách sáng tạo kịch bản video kể chuyện và cách nạp prompt chuẩn xác vào 2 nền tảng video AI mạnh nhất hiện nay: **Seedance 2.0 (ByteDance)** và **Veo 3 (Google DeepMind)**.

---

## 🎯 1. Triết Lý Biên Kịch: Storytelling Thay Vì Liệt Kê Tính Năng

- **Video bán hàng thông thường:** Nói về sản phẩm từ đầu đến cuối $\rightarrow$ Người xem lướt qua sau 3 giây.
- **Video Storytelling:** Đặt người xem vào trung tâm của một **Biến Cố (Crisis)** $\rightarrow$ Đẩy cảm xúc lên đỉnh điểm bế tắc $\rightarrow$ Thức tỉnh nhận thức $\rightarrow$ Lột xác cùng giải pháp.

Cấu trúc kịch bản trong bộ công cụ này áp dụng vòng cung cảm xúc 5 giai đoạn:
1. **00:00 - 00:05 (In Media Res Hook):** Thả người xem vào giữa lúc nhân vật đang kiệt sức/bế tắc nhất.
2. **00:05 - 00:15 (The Struggle):** Thất bại nhiều lần vì chọn sai phương pháp.
3. **00:15 - 00:35 (The Epiphany):** Khoảnh khắc ngộ ra nguyên nhân gốc rễ và chạm tay vào giải pháp.
4. **00:35 - 00:50 (The Transformation):** Sự thay đổi ngoạn mục, cảm giác tự do, rạng ngời.
5. **00:50 - 01:00 (Resolution & CTA):** Lời kêu gọi hành động dứt khoát và truyền cảm hứng.

---

## ⚖️ 2. Phân Biệt & Cách Dùng 2 Trường Phái Prompt

### 🔴 Phân Hệ 1: Seedance 2.0 / 2.5 (ByteDance)
- **Giao diện sử dụng:** Volcengine Console, CapCut Pro (nếu tích hợp Seed), hoặc các API wrapper của Seedance.
- **Cơ chế nạp:**
  1. Tải ảnh nhân vật lên ô Reference Image $\rightarrow$ Đặt tên là `@Image 1`.
  2. Tải ảnh sản phẩm lên $\rightarrow$ Đặt tên là `@Image 2`.
  3. Copy đoạn prompt trong mục `seedance_prompt` dán vào ô văn bản.
- **Ưu điểm lớn nhất:** Chuyển động vật lý phức tạp (chạy nhảy, gió thổi tà áo, giọt nước rơi) cực kỳ chân thực và giữ mặt nhân vật theo `@Image 1` rất chuẩn.

### 🔵 Phân Hệ 2: Google Veo 3 / 3.1 (DeepMind)
- **Giao diện sử dụng:** Google Cloud Vertex AI, YouTube Create hoặc Google Flow Studio.
- **Cơ chế nạp:**
  1. Nếu chạy Image-to-Video: Nạp ảnh nhân vật vào ô `First Frame`.
  2. Copy đoạn prompt văn xuôi trong mục `veo3_prompt` dán vào.
  3. Bật tùy chọn `Generate Audio / Sound FX`.
- **Ưu điểm lớn nhất:** Màu sắc và ánh sáng chuẩn điện ảnh Hollywood 35mm, lời thoại khớp khẩu hình tự nhiên (`She says, "..."`), âm thanh môi trường đa tầng.

---

## 👤 3. Quy Trình Giữ Khuôn Mặt Nhân Vật (Character Consistency)

Để video từ đầu đến cuối không bị "mỗi cảnh một người khác nhau":
1. Mở file kết quả, copy đoạn prompt tại **PHẦN 1: BẢNG NHÂN VẬT ĐỒNG NHẤT**.
2. Dán vào **Midjourney v6** (`/imagine prompt: ... --v 6.1 --style raw`) hoặc **Flux.1**.
3. Bạn sẽ nhận được 1 bức ảnh chứa nhân vật ở 4 góc nhìn (Chính diện, 3/4, Nghiêng, Phía sau).
4. Cắt riêng góc nhìn 3/4 đẹp nhất làm ảnh mỏ neo (Anchor Frame).
5. Đưa ảnh mỏ neo này vào Seedance (`@Image 1`) hoặc Veo 3 (`First Frame`).

---

## ⚡ 4. Lệnh Thực Thi Dòng Lệnh Nhanh (CLI Quickstart)

Mở terminal tại thư mục `video-storytelling/` và chạy:

```bash
# Tạo trọn gói:
python cli.py --topic "Trà thảo mộc thanh lọc" --character "người phụ nữ bận rộn 30 tuổi" --problem "áp lực công việc mất ngủ" --epiphany "thanh lọc tự nhiên cân bằng giấc ngủ" --cta "Uống ngay 1 tách tối nay" --out "./output/tra_thao_moc"
```

Toàn bộ kết quả sẽ được xuất ra thư mục `./output/tra_thao_moc/`:
- `KICH_BAN_VA_PROMPT_CHI_TIET.md`: Bản đọc trực quan để Sếp copy prompt đi nạp.
- `storytelling_prompts.json`: Dữ liệu lập trình JSON nếu muốn tích hợp vào hệ thống tự động.
