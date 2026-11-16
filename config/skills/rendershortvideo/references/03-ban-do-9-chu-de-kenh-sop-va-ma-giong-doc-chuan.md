# 03. Ma Trận Chọn Sản Phẩm Theo Tệp Khán Giả, Bản Đồ 9 Chủ Đề Kênh (`01..09`) & Mã Giọng Đọc Chuẩn (`rendershortvideo`)

Tài liệu định hướng chiến lược chọn sản phẩm chốt đơn và bảng điều hướng trực tiếp tới 9 thư mục kênh độc lập tại `E:\DIEN APP\Tiep thi lien ke shoppe\Nghien_Cuu_Kenh_Moi_Huong_Dan\`.

---

## 1. Ma Trận Tâm Lý Khán Giả & Chiến Lược Chọn Sản Phẩm Shopee Chốt Đơn

| Chế Độ Kênh | Đặc Điểm Nội Dung | Nhân Khẩu Học Người Xem Thật | Nhóm Sản Phẩm Chốt Đơn Đúng Tệp (Bắt Buộc Áp Dụng) |
| :--- | :--- | :--- | :--- |
| **`sport_music`** *(Thể thao tôn dáng ngoài trời)* | Nữ/Nam 18–25t đạp xe, chạy bộ, Pickleball, xà đơn Calisthenics trên nhạc Suno trọn bài. | **65% – 85% là NAM GIỚI** *(tuyệt đối không bán váy đầm nữ vì nam không mua!)* | Kính mát phân cực UV400, tai nghe Bluetooth Open-Ear chống nước, vợt Pickleball Carbon T700, bình giữ nhiệt thể thao 1L, đèn LED xe đạp, súng massage cơ mini, tất chống trượt, xịt khử mùi giày. |
| **`viral_tips_2shot`** *(Mẹo vặt 2 cảnh / Khoa học bếp)* | Cảnh POV cận tay xử lý mẹo + Cảnh KOL đeo mic cài áo đúc kết công thức. | **60% – 75% Nội trợ, Dân văn phòng, Chủ gia đình** | Chai xịt tẩy cặn canxi vách kính, băng keo chống thấm góc bếp, máy cắt lông xù sạc USB, bút vệ sinh tai nghe/bàn phím, móc dán tường chịu lực. |
| **`dance_music`** *(Thời trang & Dance OOTD)* | Nữ 18–25t nhảy bắt beat drop hoặc review bảng màu vải + khung `[● REC 4K]`. | **70% – 80% Nữ Gen-Z (16–26t)** thích phối đồ tôn dáng, check-in | Set OOTD (baby tee, quần cargo cạp cao, chân váy xếp ly, đồ ngủ lụa, blazer/tweed), túi kẹp nách, kính gọng vuông, kẹp tóc kim loại, sneaker độn đế. |
| **`story_kol`** *(KOC Chuyên gia / Ô tô / Decor / DIY)* | Chuyên gia test thực nghiệm 7–8 góc quay hoặc hướng dẫn từng bước rõ ràng. | **24 – 45 tuổi**, có thu nhập, mua khi thấy bằng chứng thật | Phụ kiện ô tô (chắn bùn dẻo, gương cầu lồi xóa điểm mù 360°), đồ gia dụng thông minh (nồi chiên thủy tinh, ghế công thái học), đèn/kệ decor tối giản, combo bút màu Acrylic Marker / máy bấm hoa văn DIY. |

---

## 2. Bản Đồ 9 Thư Mục Chủ Đề Kênh Độc Lập Tại `E:\DIEN APP\Tiep thi lien ke shoppe\Nghien_Cuu_Kenh_Moi_Huong_Dan\`

Mỗi loại kênh tách riêng 1 thư mục độc lập (`One Archetype Per Folder`). Khi làm thêm video cho kênh nào, đọc đúng file SOP trong thư mục của kênh đó trước:

| Mã Kênh | Thư Mục Con Tại `Nghien_Cuu_Kenh_Moi_Huong_Dan\` | Cấu Trúc Đặc Trưng & Script Python Tiêu Biểu | Giọng Đọc Chuẩn Khóa Cứng |
| :---: | :--- | :--- | :--- |
| **01** | `01_KENH_O_TO_KOC_MEO_XE_VA_XE_DIEN_XE_XANG` | Nữ KOC ngồi cabin tư vấn Xe Điện vs Xe Xăng & nội thất xe (`HUONG_DAN_SOP_CHI_TIET_KENH_O_TO.md`, `generate_ev_vs_gas_voices_and_subs.py`) | Nữ: `elevenlabs_Jmio6r8OUeqiK3cZ3N0K` (*Thu Thảo Story*) |
| **02** | `02_KENH_THOI_TRANG_AI_HOTGIRL_DANCE_TRENDING` | Nữ nhún nhảy Dance Pop 124–128 BPM góc Knee-up `9:16` (`HUONG_DAN_SOP_CHI_TIET_KENH_THOI_TRANG_DANCE.md`, `build_complete_shopee_fashion_video.py`) | Thuần nhạc Dance Remix (Không Voiceover) |
| **03** | `03_KENH_THOI_TRANG_KOL_REVIEW_COLOR_PALETTE` | Host Nữ Hà My khoe chất vải + Bảng màu 3 mã HEX + `[● REC 4K]` (`HUONG_DAN_SOP_CHI_TIET_KENH_THOI_TRANG_KOL_PALETTE.md`, `render_flowkit_elevenlabs_video.py`) | `elevenlabs_CQAD6iKxS73fEAGjSwt5` (*Giang Podcast*) hoặc `elevenlabs_aN7cv9yXNrfIR87bDmyD` (*Ngọc Huyền*) |
| **04** | `04_KENH_MEO_VAT_KHOA_HOC_HOST_ANH_TUAN` | Host Anh Tuấn 5 pha thí nghiệm Toàn – Trung – Cận trên đảo bếp đá trắng (`HUONG_DAN_SOP_CHI_TIET_KENH_MEO_VAT_KHOA_HOC.md`, `run_master_timeline_export_sync.py`) | `elevenlabs_6adFm46eyy74snVn6YrT` (*Kiến Thức Nam*) |
| **05** | `05_KENH_DECOR_KHONG_GIAN_CHUA_LANH` | Cải tạo góc làm việc/ban công/bếp nhỏ `Before -> Process -> After` (`HUONG_DAN_SOP_CHI_TIET_KENH_DECOR_CHUA_LANH.md`, `render_decor_healing_video.py`) | Nữ: `elevenlabs_CQAD6iKxS73fEAGjSwt5` / Nam: `elevenlabs_KVzG2JMdZJKi6y7cwERP` |
| **06** | `06_KENH_THE_THAO_DANG_DEP_CALISTHENICS` | Nữ Gymer tập xà đơn chữ U công viên ban đêm (`HUONG_DAN_SOP_CHI_TIET_KENH_THE_THAO_CALISTHENICS.md`, `render_night_calisthenics_sport_video.py`) | Nhạc Gym Remix 125 BPM (hoặc `elevenlabs_aN7cv9yXNrfIR87bDmyD`) |
| **07** | `07_KENH_O_TO_KOC_REVIEW_LAP_DAT_PHU_KIEN_NGOAI_THAT` | Nam KOC 7 góc quay đa tiêu cự test độ dẻo, bắt vít lắp chắn bùn & test cản nước mưa + SFX thật (`HUONG_DAN_SOP_CHI_TIET_KENH_KOC_PHU_KIEN_O_TO.md`, `render_mudguard_koc_video.py`) | `elevenlabs_6adFm46eyy74snVn6YrT` (*Kiến Thức Nam*) + SFX nước bắn |
| **08** | `08_KENH_MEO_LAI_XE_DUAL_PIP_GOC_CAO_VO_LANG` | 7 bước `Dual-View PiP` (Góc cao đuôi xe + Khung tròn vô-lăng đồng bộ) nối sang Gương cầu lồi 360° (`HUONG_DAN_SOP_CHI_TIET_KENH_MEO_LAI_XE_DUAL_PIP.md`, `render_meolui_dual_pip_video.py`) | `elevenlabs_6adFm46eyy74snVn6YrT` (*Kiến Thức Nam*) |
| **09** | `09_KENH_DIY_NGHE_THUAT_VA_HOA_CU_SANG_TAO` | Làm tranh thủ công 8 bước kế thừa không nhảy cóc + Cắt Khung Vàng `3.4s`, xuất kép Bản A (Giọng) & Bản B (ASMR) (`HUONG_DAN_SOP_CHI_TIET_KENH_DIY_NGHE_THUAT.md`, `render_diy_type1_bark_tree.py`...) | Bản A: `elevenlabs_CQAD6iKxS73fEAGjSwt5` (*Giang Podcast*) / Bản B: Nhạc DIY + ASMR |

---

## 3. Bảng Tra Nhanh Mã Giọng Đọc Miễn Phí & Cao Cấp (`Gender Lock 100%`)

- **Miễn phí 100% không cần API Key (`Edge-TTS`):**
  - Nữ Tiếng Việt: `edge_vi-VN-HoaiMyNeural` | Nam Tiếng Việt: `edge_vi-VN-NamMinhNeural`
  - Nữ Tiếng Anh: `edge_en-US-AvaNeural`, `edge_en-US-EmmaNeural` | Nam Tiếng Anh: `edge_en-US-AndrewNeural`, `edge_en-US-BrianNeural`
- **Cao cấp qua `ai33.pro` (`OpenSpeaker v3`):**
  - Nữ Tiếng Việt: `elevenlabs_CQAD6iKxS73fEAGjSwt5` (*Giang Podcast*), `elevenlabs_Jmio6r8OUeqiK3cZ3N0K` (*Thu Thảo Story*), `elevenlabs_aN7cv9yXNrfIR87bDmyD` (*Ngọc Huyền*), `vbee_category_advertise` (*Vbee Nữ Bán Hàng*).
  - Nam Tiếng Việt: `elevenlabs_6adFm46eyy74snVn6YrT` (*Kiến Thức Nam*), `elevenlabs_KVzG2JMdZJKi6y7cwERP` (*Quang Nguyễn*), `elevenlabs_CxJbDdwqY48MY3gPVYwe` (*Đỗ Trịnh*), `elevenlabs_3VnrjnYrskPMDsapTr8X` (*Tùng Đặng Deep*).
*(Bảng tra cứu đầy đủ tại: `E:\DIEN APP\Tiep thi lien ke shoppe\Nghien_Cuu_Kenh_Moi_Huong_Dan\BANG_TRA_CUU_GIONG_DOC_AI33_VI_EN.md`).*
