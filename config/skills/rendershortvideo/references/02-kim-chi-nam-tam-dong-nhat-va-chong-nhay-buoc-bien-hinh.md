# 02. Kim Chỉ Nam Toàn Hệ Thống: Tam Đồng Nhất, Chống Nhảy Bước (`Zero Step-Jumping`) & Cắt Khung Vàng (`Golden-Window Cut`) (`rendershortvideo`)

Chưng cất từ quy chuẩn gốc tại `E:\DIEN APP\Tiep thi lien ke shoppe\Nghien_Cuu_Kenh_Moi_Huong_Dan\QUY_CHUAN_TAM_DONG_NHAT_VA_LOGIC_VIDEO.md`. Áp dụng bắt buộc cho mọi video ngắn KOC lắp đặt, mẹo lái xe, thí nghiệm mẹo vặt, cải tạo không gian và DIY thủ công.

---

## 1. Ba Định Luật Kim Chỉ Nam Bất Biến (`The 3 Golden Compass Laws`)

### Định Luật 1 — Kế Thừa Trạng Thái Từng Bước (`Cumulative Step-to-Step State Machine — Zero Step-Jumping`)
- Khi video có chuỗi bước tiến triển ($S_1 \rightarrow S_2 \rightarrow \dots \rightarrow S_N$):
  - Ảnh gốc của **Bước $k$ BẮT BUỘC truyền trực tiếp file ảnh của Bước $k-1$ làm tham chiếu (`ReferenceImagePaths = [Step_{k-1}]`)** để giữ nguyên 100% mặt bàn, ánh sáng, đạo cụ và phần việc đã làm xong ở các bước trước.
  - **Mỗi bước chỉ cộng thêm ĐÚNG 1 thao tác vật lý đơn lẻ (`Single Atomic Delta`):** Tuyệt đối cấm nhảy cóc bước hoặc để chi tiết của Bước $k+1$ tự hiện sẵn ở Bước $k$ (ví dụ đang dán áo mưa ở Bước 3 thì vùng dưới áo mưa phải trống 100%, chưa được hiện sẵn mặt hay đôi ủng của Bước 4–5).

### Định Luật 2 — Khóa Điểm Chạm Đầu Dụng Cụ (`Tool-Tip Contact Point Lock`)
- Ở Bước $k$, đầu dụng cụ trên tay nhân vật (ngòi bút vẽ, bút tô màu, con lăn keo, máy bấm hoa văn, tua-vít, khăn lau) **BẮT BUỘC chạm trực tiếp vào đúng chi tiết vừa được thêm ở Bước $k$**.
- Cấm để tay cầm bút đè lên vùng khác trong khi chi tiết mới lại tự mọc ở góc khác.
- **Chốt kiểm tra bằng mắt AI:** Trước khi đẩy bộ ảnh sang `Veo 3.1`, Agent bắt buộc gọi `read_file` soi từng tấm ảnh `Step_01..Step_N` để xác nhận vị trí đầu dụng cụ và tính kế thừa $k-1 \rightarrow k$.

### Định Luật 3 — Cắt Khung Vàng `3.2s – 3.6s` Chống Biến Hình Cuối Clip (`Golden-Window Anti-Morphing Cut`)
- Trong một clip `Veo 3.1` dài `8.0s`, đoạn đầu **`0.0s -> 3.6s`** giữ nguyên 100% hình học vật thể gốc, còn từ `4.0s -> 8.0s` mô hình dễ tự sinh thêm vệt keo lạ hoặc làm biến dạng đạo cụ.
- **Quy chuẩn xử lý bắt buộc:**
  1. Trong Prompt gửi `Veo 3.1`: Chỉ mô tả chuyển động vi mô `1–3 mm` (`"making a tiny 2-millimeter stroke/press, do NOT add or remove any objects, zero morphing"`).
  2. Trong Script FFmpeg: Trích xuất Khung Vàng `0.0s -> 3.4s` và giãn nhịp mượt theo độ dài câu thoại `dur`:
     ```text
     trim=start=0:end=3.4,setpts=(dur/3.4)*PTS,fps=30
     ```
  3. Xuất tự động ảnh frame cuối mỗi cảnh (`qa_end_step_01..08.jpg`) và dùng `read_file` kiểm tra đạt **0% biến hình** trước khi ghép bản cuối.

---

## 2. Hệ Thống Tam Đồng Nhất & Quy Tắc Không Gian Giải Phẫu

1. **Đồng Nhất Con Người & Khóa Tiền Cảnh (`Spatial Foreground Lock`):**
   - Giữ nguyên mặt, kiểu tóc, trang phục qua ảnh tham chiếu gốc.
   - Khi nhân vật đứng/ngồi cạnh ô tô, đảo bếp hoặc bàn lớn: toàn bộ cơ thể **phải nằm ở TIỀN CẢNH phía gần ống kính (`in the FOREGROUND on the NEAR side facing the camera`)** — cấm để nhân vật bị nắp capo/cột A che khuất mà thò tay xuyên qua.
   - Giữ cổ tay/bàn tay sạch (`Clean Wrist & Hand Rule`), tránh đeo băng cổ tay dày đen khi đan tay trước ngực.
2. **Đồng Nhất Môi Trường & Quy Tắc Trục 180 Độ (`Environment & 180-Degree Axis Lock`):**
   - Khóa điểm neo bối cảnh xuyên suốt tập phim; không lật ngang gương (`horizontal flip`) làm đảo vị trí vật thể Trái – Phải.
   - Với kênh **Mẹo Lái Xe `Dual-View PiP`**: Đặt camera góc cao từ **sau đuôi xe nhìn về phía trước (`High-Angle Rear-to-Front Overhead View`)** để bên PHẢI tài xế trùng khớp 100% bên PHẢI màn hình, khớp hướng xoay vô-lăng trong khung PiP tròn.
   - Với kênh **DIY Thủ Công**: Giữ mặt bàn sạch 100%, loại bỏ toàn bộ đạo cụ có chữ Hán của video mẫu nước ngoài.
3. **Quy Chuẩn Kỹ Thuật Xuất Xưởng (`Pre-Flight Audit Gate`):**
   - Cấm dùng ảnh tĩnh chạy `zoompan` thay cho video chuyển động thật.
   - Khi dùng FFmpeg `overlay` với ảnh `.png` tĩnh, bắt buộc truyền cờ `-loop 1` trước `-i file.png`.
   - Đầu ra chuẩn `H.264`, `1080x1920` (`9:16`), `30fps`, kiểm tra bằng `ffprobe` đạt `Exit code 0`.
