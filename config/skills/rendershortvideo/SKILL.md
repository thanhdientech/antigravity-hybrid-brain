---
name: rendershortvideo
description: "Điều khiển Shopee KOL Studio (:8600) & 9 SOP kênh ngắn 9:16: học kênh mẫu, săn SP, khóa nhân vật 6 góc, chống nhảy bước & xuất MP4."
group: "Làm Phim & Video AI"
---

# 📱 RENDER SHORT VIDEO & SHOPEE KOL STUDIO (`rendershortvideo` — Cổng `:8600` & 9 SOP Kênh `9:16`)

<!-- JAVIS_TRIGGER_ARCHIVE_START -->
## Khi nào dùng (Triggers & Ngữ cảnh kích hoạt đầy đủ)

> Điều khiển trực tiếp hệ thống **Shopee & Multi-Source KOL Video Studio (`v4.3.3` — Cổng `:8600` / Timeline `:8650`)** cùng **Trạm 9 Chủ Đề Kênh Triệu View** nằm cố định tại `E:\DIEN APP\Tiep thi lien ke shoppe` để sản xuất **Video Ngắn Dọc (`9:16`, `1080x1920`, `30fps`)** cho Shopee Affiliate, TikTok Shop, Facebook Reels và YouTube Shorts. Bao phủ trọn gói: Quét & học kênh mẫu thành công (`reference-learner`), Khóa cố định Nhân vật 6 góc `[uid01]` + Phòng bối cảnh trống `[LOC]` + Giọng đọc (`ai33.pro` / `Edge-TTS`), Lập lộ trình 50 video xây kênh 3 giai đoạn, Quét sản phẩm Shopee chống sale ảo / TikTok Shop / Website khách hàng, 3 Định luật Kim Chỉ Nam (`Zero Step-Jumping` kế thừa ảnh Bước $k-1$, `Tool-Tip Contact Lock`, Cắt Khung Vàng `Golden-Window 0.0s->3.4s` chống biến hình), Render đa luồng Veo 3.1 (`:8100`) / Muse (`:8010`), phụ đề Safe-Zone và xuất kép `.MP4` (Bản Có Giọng + Bản Nhạc/ASMR).
> TRIGGERS: "rendershortvideo", "render short video", "làm video ngắn", "lam video ngan", "render video ngắn", "video shopee", "làm video shopee", "shopee kol studio", "cổng 8600", "cong 8600", "cổng 8650", "học kênh mẫu", "hoc kenh mau", "50 video xây kênh", "tiktok shop video", "reels 9:16", "youtube shorts", "chống nhảy bước", "zero step jumping", "golden window 3.4s", "dual pip lái xe", "kênh diy 8 bước", "kênh mẹo vặt", "kênh thời trang dance", "koc ô tô".
<!-- JAVIS_TRIGGER_ARCHIVE_END -->

- **Thư mục công cụ thực thi gốc (Giữ nguyên tại ổ E — Gọi trực tiếp, KHÔNG sao chép bộ tool sang nơi khác):**
  - 🛠️ **Bộ máy Shopee KOL Studio (`:8600`):** `E:\DIEN APP\Tiep thi lien ke shoppe\Tim repo tim san pham shope lam video\Shopee_KOL_Studio_Tool`
    - Khởi động 1 chạm 5 dịch vụ: `"E:\DIEN APP\Tiep thi lien ke shoppe\Tim repo tim san pham shope lam video\Shopee_KOL_Studio_Tool\START_SHOPEE_STUDIO.bat"` $\rightarrow$ Mở `http://127.0.0.1:8600`
    - Dừng / Khởi động lại sạch: `STOP_ALL_SERVICES.bat` / `RESTART_ALL_SERVICES.bat`
    - Python `.venv` chuẩn của Tool: `"E:\DIEN APP\Tiep thi lien ke shoppe\Tim repo tim san pham shope lam video\Shopee_KOL_Studio_Tool\.venv\Scripts\python.exe"`
  - 🏛️ **Trạm SOP & Script Python của 9 Chủ Đề Kênh Độc Lập (`01..09`):** `E:\DIEN APP\Tiep thi lien ke shoppe\Nghien_Cuu_Kenh_Moi_Huong_Dan`
  - 🌐 **Kho Git Upstream của Tool:** [thanhdientech/Shopee_KOL_Studio_Tool](https://github.com/thanhdientech/Shopee_KOL_Studio_Tool)

---

## 📌 1. BẢNG ĐIỀU PHỐI TÀI LIỆU CHUYÊN SÂU (`references/`)

| Tình Huống / Bước Thực Thi | Tệp Tham Chiếu Cần Đọc | Nội Dung Cốt Lõi |
| :--- | :--- | :--- |
| **Kiến trúc 5 Cổng (`:8600/:8650/:8100/:8010/:8766`), 7 Bước Xây Kênh & REST API** | [`references/01-kien-truc-5-dich-vu-7-buoc-xay-kenh-va-api-8600.md`](./references/01-kien-truc-5-dich-vu-7-buoc-xay-kenh-va-api-8600.md) | Sơ đồ 5 Microservices cách ly cổng (không đụng `:8500` của YouTube dài), lưu trữ 8 ngăn & trọn bộ API `:8600`. |
| **3 Định Luật Kim Chỉ Nam: Chống Nhảy Bước, Điểm Chạm Dụng Cụ & Khung Vàng `3.4s`** | [`references/02-kim-chi-nam-tam-dong-nhat-va-chong-nhay-buoc-bien-hinh.md`](./references/02-kim-chi-nam-tam-dong-nhat-va-chong-nhay-buoc-bien-hinh.md) | Kế thừa `Image-to-Image Step_{k-1}`, `Tool-Tip Contact Lock`, `trim=0:3.4` chống biến hình, Tam Đồng Nhất & Safe-Zone. |
| **Ma Trận Chiến Lược Chọn SP, 9 Thư Mục Kênh (`01..09`) & Bảng Giọng Đọc Chuẩn** | [`references/03-ban-do-9-chu-de-kenh-sop-va-ma-giong-doc-chuan.md`](./references/03-ban-do-9-chu-de-kenh-sop-va-ma-giong-doc-chuan.md) | Định hướng ngách theo tệp người xem thật, đường dẫn 9 kênh SOP tại ổ E & mã `Voice ID` (`ElevenLabs / Edge-TTS`). |

---

## 📌 2. LỆNH GỌI NHANH TỪ AI AGENT TỚI TOOL GỐC TẠI Ổ E

1. **Kiểm tra trạng thái 5 cổng dịch vụ (`:8600, :8650, :8100, :8010, :8766`) hoặc khởi động:**
   ```powershell
   Invoke-RestMethod -Uri "http://127.0.0.1:8600/api/health" -ErrorAction SilentlyContinue
   # Nếu cổng :8600 chưa mở, khởi chạy trực tiếp từ thư mục gốc ở ổ E:
   $ToolDir = "E:\DIEN APP\Tiep thi lien ke shoppe\Tim repo tim san pham shope lam video\Shopee_KOL_Studio_Tool"
   Start-Process -WorkingDirectory $ToolDir -FilePath "cmd.exe" -ArgumentList "/c START_SHOPEE_STUDIO.bat"
   ```
2. **Kiểm tra thông mạch toàn hệ thống bằng script chẩn đoán có sẵn tại ổ E:**
   ```powershell
   $Py = "E:\DIEN APP\Tiep thi lien ke shoppe\Tim repo tim san pham shope lam video\Shopee_KOL_Studio_Tool\.venv\Scripts\python.exe"
   & $Py "E:\DIEN APP\Tiep thi lien ke shoppe\Tim repo tim san pham shope lam video\test_system_connectivity.py"
   ```
3. **Kết nối MCP Server của Shopee Studio (khi cần gọi qua giao thức MCP):**
   - Tệp thực thi: `"E:\DIEN APP\Tiep thi lien ke shoppe\Tim repo tim san pham shope lam video\Shopee_KOL_Studio_Tool\shopee_video_studio\mcp_shopee_studio.py"`.

---

## 📌 3. 5 QUY TẮC VÀNG BẮT BUỘC KHI LÀM VIDEO NGẮN (`NON-NEGOTIABLE GATES`)

1. **Chỉ Gọi Tool Tại Chỗ (`In-Place Execution`):** Giữ nguyên toàn bộ source, `.venv`, `vendor/omniflow`, cơ sở dữ liệu kênh `channels_studio.sqlite` và 9 thư mục kênh tại `E:\DIEN APP\Tiep thi lien ke shoppe`; tuyệt đối không kéo bộ tool nặng sang thư mục cấu hình Skill.
2. **Cấm Dùng Ảnh Tĩnh Chạy Hiệu Ứng Zoom (`No Static Zoompan`):** 100% phân cảnh video xuất bản phải là cảnh quay chuyển động thật (`1080x1920`, `30fps`) sinh từ `OmniEngine` (`Veo 3.1 :8100` / `Muse.ai :8010`), trừ khi người dùng chủ động chọn chế độ nháp `fast_30s`.
3. **3 Định Luật Kim Chỉ Nam Chống Lỗi Vật Lý:**
   - **Chống nhảy bước (`Zero Step-Jumping`):** Ảnh của Bước $k$ bắt buộc nhận ảnh Bước $k-1$ làm `ReferenceImagePaths`, chỉ cộng thêm đúng 1 thao tác vật lý duy nhất.
   - **Khóa điểm chạm dụng cụ (`Tool-Tip Contact Lock`):** Đầu bút/tua-vít/con lăn keo phải chạm trực tiếp vào đúng chi tiết vừa thêm ở bước đó; dùng `read_file` soi từng ảnh trước khi render video.
   - **Cắt Khung Vàng `0.0s -> 3.4s` (`Golden-Window Cut`):** Trích xuất `trim=start=0:end=3.4,setpts=(dur/3.4)*PTS,fps=30` cho các cảnh thao tác chi tiết để cắt bỏ phần đuôi biến hình cuối clip 8s.
4. **Khóa Tệp Khán Giả Thật & Thông Số NSX Thật (`Zero Hallucination`):** Chọn sản phẩm theo đúng nhân khẩu học người xem thật (ví dụ kênh thể thao nữ `sport_music` 70% nam xem $\rightarrow$ bán phụ kiện thể thao unisex/nam, không bán váy nữ); không bịa thông số kỹ thuật sản phẩm; khi nạp link TikTok Shop/Web riêng phải tự động loại chữ `"Shopee"` khỏi lời bình.
5. **Vùng An Toàn Phụ Đề (`Safe-Zone 9:16`) & Xuất Kép:** Đặt phụ đề nằm gọn trong vùng an toàn Reels/TikTok/Shorts (`y_top >= 148px`, `y_bottom <= 1244px`, `x = 64..896px`); với các kênh hướng dẫn/DIY xuất đủ 2 bản (Bản Có Giọng Hướng Dẫn và Bản Nhạc + ASMR sạch).
