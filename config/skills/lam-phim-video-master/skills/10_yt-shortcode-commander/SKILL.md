---
name: yt-shortcode-commander
description: >-
  Hệ thống điều khiển dây chuyền sản xuất YouTube 6 Lệnh (1. Viết Nội Dung, 2. Viết Prompt, 3. Render, 4. Lên lịch đăng video, 5. Nuôi thiết bị, 6. Lên kế hoạch cho kênh mới) & 3 Kênh (1. Every Myth Explained, 2. KosmosGeist, 3. Some Guy Who Knows Stuff). Hỗ trợ chọn từng bước trên Bot, tự động lấy đề tài từ Kế hoạch CSV nếu chưa có thư mục, kiểm tra đầu vào (Pre-Flight Check) và phân phối đến đúng Agent Quản lý kênh hoặc Team chuyên môn.
  TRIGGERS: "youtube", "/youtube", "eme", "sgw", "kg", "k1", "k2", "k3", "viết nội dung", "viết prompt", "qa check", "render", "test5", "lên lịch đăng video", "nuôi thiết bị", "lên kế hoạch kênh mới".
---

# Hệ Thống Điều Khiển Dây Chuyền Sản Xuất YouTube 6 Lệnh & 3 Kênh (`youtube`)

Khi người dùng gõ từ khóa **`youtube`** (hoặc **`/youtube`**, **`yt`**) trên Bot hoặc Web Dashboard, hệ thống lập tức hiển thị **6 Lệnh Cốt Lõi (`1..6`)**:
1. **`1. Viết Nội Dung`**
2. **`2. Viết Prompt`**
3. **`3. Render`**
4. **`4. Lên lịch đăng video`**
5. **`5. Nuôi thiết bị`**
6. **`6. Lên kế hoạch cho kênh mới`**

Khi người dùng chọn 1 trong 6 lệnh (ví dụ gõ `1`..`6`), hệ thống sẽ **hỏi tiếp Kênh nào (`1 / 2 / 3`) và làm Video số mấy**:
- Nếu chọn **Lệnh `1. Viết Nội Dung`** từ đầu mà **chưa có thư mục** trong `src\Video\`, hệ thống **tự động đọc file Kế hoạch CSV (`1 Viet Content\Plan\*.csv`)** của kênh đó theo đúng `STT` để lấy Tiêu đề gốc (`EN`/`DE`), Bản dịch Việt, Danh mục & Từ khóa SEO và khởi tạo thư mục mới.
- Tùy vào Kênh nào & Lệnh nào, hệ thống tự động phân phối đến **Agent Quản Lý Kênh (`@p3-01`, `@p3-03`, `@p3-02`)** hoặc **Team Chuyên Môn (`@p3-1a`..`@p3-5b`)**, đồng thời thực hiện **Chốt Kiểm Tra Đầu Vào (`Pre-Flight Check`)** trước khi chạy.

---

## 📌 PHẦN 1: BẢNG ÁNH XẠ 3 KÊNH YOUTUBE, FILE KẾ HOẠCH CSV & AGENT QUẢN LÝ KÊNH

| Mã Chọn | Mã Tắt | Tên Kênh & Đường Dẫn Gốc (`E:\`) | File Kế Hoạch CSV Gốc (`1 Viet Content\Plan\`) | Agent Quản Lý Kênh (Chủ nhiệm Kênh) | Workflow Kênh |
| :---: | :---: | :--- | :--- | :--- | :--- |
| **`1`** / **`K1`** | **`EME`** | **Every Myth Explained** (`EN - US`)<br>`E:\DIEN APP\Xây Kênh Youtube\Every Myth Explained` | `content-plan-100-us-v2-ancient-evidence.csv` *(100 video)*<br>& `kehoach.csv` *(10 video)* | **`[P3.1] Chủ nhiệm Kênh Every Myth Explained (US)`**<br>(`@p3-01-chu-nhiem-kenh-every-myth`) | `wf-san-xuat-kenh-every-myth-explained` |
| **`2`** / **`K2`** | **`KG`** | **KosmosGeist** (`DE - DACH`)<br>`E:\DIEN APP\Xây Kênh Youtube\KosmosGeist` | `0.content-plan-90-de-v2.csv` *(90 video Tiếng Đức)* | **`[P3.3] Chủ nhiệm Kênh KosmosGeist (Đức - DE)`**<br>(`@p3-03-chu-nhiem-kenh-kosmosgeist`) | `wf-san-xuat-kenh-kosmosgeist-de` |
| **`3`** / **`K3`** | **`SGW`** | **Some Guy Who Knows Stuff** (`EN - US`)<br>`E:\DIEN APP\Xây Kênh Youtube\Some Guy Who Knows Stuff` | `content-plan-100-us-v1.csv` *(100 video)* | **`[P3.2] Chủ nhiệm Kênh Some Guy Who Knows Stuff (US)`**<br>(`@p3-02-chu-nhiem-kenh-some-guy`) | `wf-san-xuat-kenh-some-guy-who-knows-stuff` |

---

## 📌 PHẦN 2: QUY TRÌNH CHI TIẾT 6 LỆNH, CHỐT KIỂM TRA ĐẦU VÀO & PHÂN PHỐI TEAM CHUYÊN MÔN

### Lệnh `1` — Viết Nội Dung (`0 Noi dung video/` + `5 srt/`)
- **Team Chuyên Môn thực thi:** `@p3-4a1-chuyen-gia-tim-nguon-va-phan-tich-trend` (Tìm nguồn khoa học/khảo cổ) $\rightarrow$ `@p3-4a2-bien-kich-da-ngon-ngu-chia-canh-8s` (Viết Script & Chia cảnh 8.0s) $\rightarrow$ `@p3-4b-qa-audit-noi-dung-va-chia-canh` (QA Nội dung).
- **Cơ chế tự động lấy Kế hoạch CSV khi chưa có thư mục:**
  - Nếu người dùng chọn Video số `N` (ví dụ `K1 V11`, `K2 V07`, `K3 V13`) mà trong `src\Video\` chưa có thư mục: Hệ thống tự động mở file CSV trong `1 Viet Content\Plan\`, lấy dòng `STT = N` (`Tên video gốc`, `Tên dịch Tiếng Việt`, `Danh mục`, `Từ khóa`), tạo thư mục `src\Video\<STT_Ten_Video>` cùng 7 thư mục con chuẩn (`0 Noi dung video` .. `6 thumbnail va title`).
- **📋 Chốt Kiểm Tra Đầu Vào (`Pre-Flight Check`):**
  1. Đã xác định **Kênh nào (`1 / 2 / 3`)** và **Video số mấy** chưa?
  2. Đã có **Đề tài / Tiêu đề** (từ thư mục có sẵn hoặc trích xuất từ dòng `STT` trong file Kế hoạch CSV) chưa?
  3. Đã nạp đúng **Master Prompt của Kênh** (`Every Myth V9` / `KosmosGeist DE V6 (9-11 từ Đức/8s)` / `Some Guy 7-Beat Debate V9`) chưa?

### Lệnh `2` — Viết Prompt (`1 prompt nhan vat/` + `2 prompt anh canh/` + `3 prompt video/` + `4 am nhac sfx/` + `6 thumbnail va title/`)
- **Team Chuyên Môn thực thi:** `@p3-4c-dao-dien-viet-prompt-va-cap-cuu-chinh-sach` (Đạo diễn viết Prompt 6-Layer Character DNA & 5-Tier Pose Engine) $\rightarrow$ `@p3-4d-qa-audit-bo-prompt-chinh-sach` (QA Bộ Prompt & Chính sách YPP).
- **📋 Chốt Kiểm Tra Đầu Vào (`Pre-Flight Check`):**
  1. Đã rõ **Kênh nào (`1 / 2 / 3`)** và **Video số mấy** chưa?
  2. Trong `0 Noi dung video/` **đã có sẵn file `B1_Phan_Canh.csv` và `Buoc_3.1_Script_English.txt` từ Lệnh 1 chưa?** *(Nếu chưa có $\rightarrow$ Báo thiếu ngay và đề nghị chạy Lệnh 1 trước!)*
  3. Đã rõ **Phạm vi làm** (`TEST5` = làm thử 5 cảnh đầu tiên hay `ALL` = làm toàn bộ ~82 cảnh; làm riêng `B1 Nhân vật` / `B2 Ảnh` / `B3 Video` hay trọn bộ `PROMPT` + `QA`) chưa?

### Lệnh `3` — Render (`4 anh nhan vat/` + `5 anh canh/` + `6 video canh/` + Ghép `.mp4`)
- **Team Chuyên Môn thực thi:** `@p3-4e-ky-su-render-nguyen-lieu-google-flow` (Render ảnh/video) + `@p3-4x-ky-su-cap-cuu-sua-code-tool` (Tự sửa lỗi tool nếu có) $\rightarrow$ `@p3-4f-qa-audit-nguyen-lieu-truoc-ghep` (QA Nguyên liệu) $\rightarrow$ `@p3-4g-ky-su-ghep-video-hau-ky-ffmpeg` (Ghép FFmpeg) $\rightarrow$ `@p3-4h-qa-audit-thanh-pham-cuoi-xuong` (QA Thành phẩm).
- **📋 Chốt Kiểm Tra Đầu Vào (`Pre-Flight Check`):**
  1. Đã rõ **Kênh nào**, **Video số mấy** và **Chế độ Render** (`RENDER TEST5` 5 cảnh đầu / `RENDER CHAR` / `RENDER IMG` / `RENDER VID` / `RENDER ALL`) chưa?
  2. Đã có đủ **3 file CSV Prompt (`B2`, `B3`, `B5`)** đạt chuẩn QA trên ổ đĩa chưa?
  3. Nếu ghép thành phẩm `.mp4`: đã có file Voiceover TTS và nhạc nền SFX chưa?

### Lệnh `4` — Lên Lịch Đăng Video (`Auto-Upload YouTube Studio & Schedule`)
- **Team Chuyên Môn thực thi:** `@p3-5a-ky-su-auto-upload-youtube-facebook` (Upload cách ly qua Antidetect Browser) $\rightarrow$ `@p3-5b-qa-audit-dang-kenh-va-bao-cao-zalo` (QA nghiệm thu & chụp Screenshot báo Zalo).
- **📋 Chốt Kiểm Tra Đầu Vào (`Pre-Flight Check`):**
  1. Đã rõ **Kênh nào (`1 / 2 / 3`)** và **Video số mấy** chưa?
  2. Đã có **File Video `.mp4` thành phẩm**, **Phụ đề `.srt`**, **Ảnh bìa `Thumbnail`** và **`Buoc_4_Metadata.txt` (`Title / Description / Tags`)** chưa?
  3. Đã chốt **Ngày giờ hẹn lịch công chiếu (`Schedule`)** hoặc chế độ hiển thị (`Public / Unlisted / Private`) chưa?

### Lệnh `5` — Nuôi Thiết Bị (`Antidetect Browser, Proxy & Warm-up Trust`)
- **Team Chuyên Môn thực thi:** `@p3-2a-ky-su-nuoi-thiet-bi-va-kenh` $\rightarrow$ `@p3-2b-qa-audit-ha-tang-trust-kenh`.
- **📋 Chốt Kiểm Tra Đầu Vào (`Pre-Flight Check`):**
  1. Đã rõ **Kênh nào (`1 / 2 / 3`)** và **Profile trình duyệt cách ly** cần nuôi chưa?
  2. Đã rõ **Thời lượng nuôi** (mặc định 15–20 phút) và kết nối trình duyệt (`antigravity-browser-controller` / MMO Browser `:8000`) đã sẵn sàng chưa?

### Lệnh `6` — Lên Kế Hoạch Cho Kênh Mới (`Outlier Research & 100-Video CSV Plan`)
- **Team Chuyên Môn thực thi:** `@p3-1a-chuyen-gia-san-ngach-outlier` (Săn ngách Outlier) $\rightarrow$ `@p3-1b-qa-audit-chon-ngach` (QA Chọn ngách) $\rightarrow$ `@p3-3a-chien-luoc-ke-hoach-10-video-analytics` (Lập bảng Kế hoạch CSV 90–100 video) $\rightarrow$ `@p3-3b-qa-audit-ke-hoach-10-video` (QA Kế hoạch).
- **📋 Chốt Kiểm Tra Đầu Vào (`Pre-Flight Check`):**
  1. Đã rõ **Thị trường & Ngôn ngữ mục tiêu** (`US - EN`, `DE - DACH`, `JP`, `KR`...) chưa?
  2. Đã rõ **Ngách / Chủ đề định hướng** (hoặc yêu cầu AI tự quét kênh Outlier RPM cao) và **Số lượng video cần lập CSV** (mặc định 90–100 video) chưa?

---

## 📌 PHẦN 3: MA TRẬN KHÓA CỨNG `CHANNEL_BRANDING` (`16:9`, `VOICE ID`, `HOST RULE`) & 10 TIÊU CHÍ KÊNH MỚI

### 1. Thông Số Khóa Cứng Của 3 Kênh Hiện Tại (`16:9 Landscape — 1920x1080`):
| Kênh | Khung Hình & Số Cảnh | Ngôn Ngữ Chính & `Voice ID` | Ngôn Ngữ Xem Lại (VI) & `Voice ID` | Quy Tắc Nhân Vật Host (`Character Rule`) | Mã Phong Cách (`style_lock_name`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Every Myth Explained** (`EME`) | `16:9` (`1920x1080`, `30fps`, `82 cảnh × 8.0s`) | `en-US` — **Brian** (`nPczCjzI2devNBz1zQrb`) | `vi-VN` — **Nhật Phong** (`6adFm46eyy74snVn6YrT`) | **Có Host `uid01` Pre-Render cố định**: Dùng chung 1 file `Channel_Branding/characters/UID01.png` chép sẵn vào `1 prompt nhan vat/` của mọi video (cấm render Host mới theo từng video). | `2D_CARTOON_19TH_CENTURY_LITHOGRAPH` |
| **2. KosmosGeist** (`KG`) | `16:9` (`1920x1080`, `30fps`, `90 cảnh × 8.0s`) | `de-DE` — **Antoni** (`ErXwobaYiN019PkySvjV`) / **Daniel Dark** (`5hobNnfFWAwxjwZSecAE`) | `vi-VN` — **Giang** (`CQAD6iKxS73fEAGjSwt5`) | **`0` Nhân vật (`100% Hostless`)**: Không có nhân vật; khi render video luôn chọn Cột 5 `Prompt JSON tiếng Anh (Không Voice)`. | `BEDTIME_PHYSICS_HYBRID_3D_HOSTLESS` |
| **3. Some Guy Who Knows Stuff** (`SGW`) | `16:9` (`1920x1080`, `24–30fps`, `80 cảnh × 8.0s`) | `en-US` — **Brian** (`nPczCjzI2devNBz1zQrb`) / **Adam** (`pNInz6obpgDQGcFmaJgB`) | `vi-VN` — **Giang** (`CQAD6iKxS73fEAGjSwt5`) / **Minh Thư** (`oB9QqBbxmU7RU9GCcDiS`) | **Bỏ qua Nhân vật Host (`No Host / Specialist Only`)**: Hook & Outro dùng cảnh bàn gỗ & cuốn sổ da *The Midnight Ledger*; chỉ có `NV_01..NV_03` là nhà khoa học riêng từng tập (`15–20%` cảnh). | `STYLIZED_2D_POP_SCIENCE_COMIC_MOTION` |

### 2. Bắt Buộc Khi Thực Thi `Lệnh 6 — Lên Kế Hoạch Cho Kênh Mới`:
Trước khi làm Video #01 cho bất kỳ kênh mới nào, bắt buộc khởi tạo thư mục `Channel_Branding/`, file `channel_config.json`, `CHANNEL_BRANDING_VA_THONG_SO_RENDER.md` và khai báo đủ **10 Hạng Mục** theo mẫu [`wiki/template-khai-bao-channel-branding-kenh-moi.md`](file:///E:/DIEN%20APP/JavisOS/brains/Brain%20Default/wiki/template-khai-bao-channel-branding-kenh-moi.md):
1. Định danh Kênh & Thị trường Mục tiêu (`market_code`, `antidetect_profile_id`)
2. Kích thước Khung hình & Thông số Video Chuẩn (`16:9` `1920x1080`, `8.0s/cảnh`, `flow_config.json`)
3. Ngôn ngữ Chính + `voice_id_primary` & Ngôn ngữ Nghe Xem Lại (`vi-VN`) + `voice_id_vi_review`
4. Quy tắc Nhân vật Host (`Chế độ A: Pre-Render UID01.png cố định` / `Chế độ B: Bỏ qua Host` / `Chế độ C: 0 UID Hostless`)
5. Phong cách Hình ảnh Cốt lõi (`style_lock_name` + Bộ ảnh mẫu chuẩn)
6. Bảng Màu Thương Hiệu (`5–8 mã HEX`) & Luật Biến Thiên Màu `100%` theo cảnh
7. Khóa Phủ Định Bắt Buộc (`--ar 16:9 --no text, words, speech bubble...`)
8. Cấu hình Âm thanh, BGM & Khóa Âm Gốc Veo `0%` (`Không Voice`)
9. Cấu trúc 7 Thư mục & Schema Cột CSV Chuẩn (`utf-8-sig`, `VN = 0` trong cột Prompt EN)
10. Tài sản Nhận diện Kênh (`Logo 800x800`, `Banner 2560x1440`, `Thumbnail Z-Pattern 16:9`, `About`)
