# 🌐 HƯỚNG DẪN CHI TIẾT: KẾT NỐI VÀ ĐIỀU KHIỂN TỪNG PROFILE CHROME / CỐC CỐC / EDGE
> **Antigravity Omni-Browser Controller (Multi-Profile Engine v2.1)**  
> Điều phối độc lập nhiều tài khoản, nhiều trình duyệt (Chrome, Cốc Cốc, Edge, Brave...) song song trên cùng một máy tính mà không bị xung đột cookie hay đè kết nối.

---

## 📑 MỤC LỤC
1. [Nguyên Lý Hoạt Động Đa Profile (Multi-Profile Architecture)](#1-nguyên-lý-hoạt-động-đa-profile)
2. [Cách Xác Định Tên & Thư Mục Từng Profile Chrome](#2-cách-xác-định-tên--thư-mục-từng-profile-chrome)
3. [Quy Trình Cài Đặt & Định Danh Cho Từng Profile (Từng Bước)](#3-quy-trình-cài-đặt--định-danh-cho-từng-profile)
4. [Kiểm Tra Kết Nối Toàn Bộ Profile Đang Hoạt Động (Live Check)](#4-kiểm-tra-kết-nối-toàn-bộ-profile-đang-hoạt-động)
5. [Cú Pháp Điều Khiển Từng Profile Riêng Biệt](#5-cú-pháp-điều-khiển-từng-profile-riêng-biệt)
   - [Đăng bài Facebook theo Profile chỉ định](#51-đăng-bài-facebook-theo-profile-chỉ-định)
   - [Mở web & Thao tác trên từng Profile bằng CLI](#52-mở-web--thao-tác-bằng-cli)
6. [Cơ Chế Tự Động Nhận Diện Thông Minh Qua `profile_map.json`](#6-cơ-chế-tự-động-nhận-diện-thông-minh)
7. [Bảng Xử Lý Sự Cố Thường Gặp (Troubleshooting FAQ)](#7-bảng-xử-lý-sự-cố-thường-gặp)

---

## 1. NGUYÊN LÝ HOẠT ĐỘNG ĐA PROFILE

Mỗi khi bạn mở một cửa sổ Chrome, Edge hoặc Cốc Cốc với một tài khoản khác nhau:
- Trình duyệt sẽ chạy trên một **User Data Directory** riêng biệt (ví dụ `Profile 1`, `Profile 2`, `Profile 3`, hoặc `Default`).
- Mỗi profile sở hữu phiên đăng nhập (Cookie), lịch sử, mật khẩu và danh sách tiện ích mở rộng độc lập 100%.

**Antigravity Omni-Browser Bridge** giải quyết bài toán đa profile bằng cơ chế:
1. **Một cổng WebSocket duy nhất (`ws://127.0.0.1:8765`)**: Mọi cửa sổ profile đều kết nối về đây.
2. **Bảng ghi nhớ Registry đa socket (`ws_registry`)**: Server giữ kết nối riêng cho từng socket của từng profile, tuyệt đối không ghi đè socket của nhau.
3. **Bộ định tuyến thông minh (Smart Router)**: Khi bạn ra lệnh `-p "profile_1"`, server tự tìm đúng socket của `profile_1` để gửi lệnh; các profile khác (`default`, `profile_2`, `work`) hoàn toàn không bị ảnh hưởng.

```
                              ┌───────────────────────────────────────────────┐
                              │            ANTIGRAVITY BRIDGE SERVER          │
                              │    (WebSocket :8765  |  REST API :8766)       │
                              └───────┬──────────────┬──────────────┬─────────┘
                                      │              │              │
                   ┌──────────────────┘              │              └──────────────────┐
                   ▼                                 ▼                                 ▼
      ┌─────────────────────────┐       ┌─────────────────────────┐       ┌─────────────────────────┐
      │     CHROME PROFILE 1    │       │     CHROME PROFILE 2    │       │     CỐC CỐC / EDGE      │
      │   (Tag: "profile_1")    │       │   (Tag: "profile_2")    │       │     (Tag: "default")    │
      │  - Facebook / YouTube   │       │  - Zalo / Google Drive  │       │  - Quản trị Fanpage     │
      │  - Cookie riêng biệt    │       │  - Cookie riêng biệt    │       │  - Cookie riêng biệt    │
      └─────────────────────────┘       └─────────────────────────┘       └─────────────────────────┘
```

---

## 2. CÁCH XÁC ĐỊNH TÊN & THƯ MỤC TỪNG PROFILE CHROME

Trên Windows, dữ liệu Chrome được lưu tại:
`%LOCALAPPDATA%\Google\Chrome\User Data\`

### Cách 1: Xem trực tiếp trong Chrome
1. Mở cửa sổ Chrome của Profile bạn muốn kiểm tra.
2. Trên thanh địa chỉ, nhập: `chrome://version/` và nhấn Enter.
3. Tìm dòng **Đường dẫn hồ sơ (Profile Path)**:
   - Ví dụ: `C:\Users\<Tên_User>\AppData\Local\Google\Chrome\User Data\Profile 1` $\rightarrow$ Tên thư mục là **`Profile 1`**.
   - Ví dụ: `C:\Users\<Tên_User>\AppData\Local\Google\Chrome\User Data\Profile 2` $\rightarrow$ Tên thư mục là **`Profile 2`**.
   - Đối với Cốc Cốc: `...\CocCoc\Browser\User Data\Default` $\rightarrow$ Thư mục là **`Default`**.

### Cách 2: Mở nhanh từng Profile từ dòng lệnh hoặc phím tắt
Bạn có thể tạo shortcut hoặc chạy PowerShell để mở đúng Profile:
```powershell
# Mở Chrome Profile 1
& "C:\Program Files\Google\Chrome\Application\chrome.exe" --profile-directory="Profile 1"

# Mở Chrome Profile 2
& "C:\Program Files\Google\Chrome\Application\chrome.exe" --profile-directory="Profile 2"

# Mở Cốc Cốc Profile Default
& "$env:LOCALAPPDATA\CocCoc\Browser\Application\browser.exe" --profile-directory="Default"
```

---

## 3. QUY TRÌNH CÀI ĐẶT & ĐỊNH DANH CHO TỪNG PROFILE

Để Antigravity phân biệt được từng cửa sổ, bạn chỉ cần nạp Extension vào từng profile một lần duy nhất:

### Bước 1: Mở cửa sổ Profile cần cài đặt
Mở đúng cửa sổ Profile Chrome hoặc Cốc Cốc mà bạn muốn kết nối.

### Bước 2: Nạp Extension vào Profile
1. Trên thanh địa chỉ, gõ: `chrome://extensions/` *(hoặc `coccoc://extensions/` nếu dùng Cốc Cốc)*.
2. Bật công tắc **Chế độ cho nhà phát triển (Developer mode)** ở góc trên bên phải.
3. Bấm nút **Tải tiện ích đã giải nén (Load unpacked)**.
4. Trỏ tới thư mục:  
   `%USERPROFILE%\.gemini\config\skills\antigravity-browser-controller\extension`
5. Bấm **Select Folder**.

### Bước 3: Đặt tên Profile trong Popup Extension (Quan trọng nhất)
1. Bấm vào biểu tượng **Antigravity Extension** trên thanh tiện ích của Profile đó.
2. Tại ô **Tên Profile**, nhập định danh gợi nhớ cho profile này (ví dụ: `default`, `profile_1`, `profile_2`, `work`, `marketing`).
3. Bấm **💾 Lưu Profile**.
4. Bấm nút **🔄 Kết nối lại** (nếu đèn trạng thái chưa xanh).
5. Khi đèn báo **ĐÃ KẾT NỐI (Live)** màu xanh lá cây $\rightarrow$ **Đã thông mạch thành công!**

*(Lặp lại Bước 1 $\rightarrow$ Bước 3 cho các Profile khác. Mỗi profile chỉ cần đặt tên 1 lần duy nhất, trình duyệt sẽ tự ghi nhớ vĩnh viễn).*

---

## 4. KIỂM TRA KẾT NỐI TOÀN BỘ PROFILE ĐANG HOẠT ĐỘNG

Khi các profile đã mở, bạn có thể kiểm tra danh sách tất cả các profile đang online bằng bất kỳ cách nào dưới đây:

### Cách 1: Chạy lệnh Python kiểm tra
```powershell
python -c "import urllib.request, json; print(json.dumps(json.loads(urllib.request.urlopen('http://127.0.0.1:8766/status').read().decode()), indent=2))"
```

**Kết quả mẫu:**
```json
{
  "status": "ok",
  "extension_connected": true,
  "active_profiles": [
    "default",
    "profile_1",
    "profile_2",
    "work"
  ],
  "ws_port": 8765,
  "http_port": 8766
}
```
> [!NOTE]
> Mọi profile xuất hiện trong mảng `active_profiles` đều sẵn sàng nhận lệnh tức thì!

### Cách 2: Mở trình duyệt xem trực tiếp
Truy cập đường link: `http://127.0.0.1:8766/profiles`  
Trình duyệt sẽ hiển thị danh sách profile đang kết nối theo thời gian thực.

---

## 5. CÚ PHÁP ĐIỀU KHIỂN TỪNG PROFILE RIÊNG BIỆT

### 5.1. Đăng bài Facebook theo Profile chỉ định

Sử dụng cờ `-p` hoặc `--profile` để chỉ định chính xác profile thực hiện:

#### 📌 Đăng trên Profile mặc định (`default`):
```powershell
python "%USERPROFILE%\.gemini\config\skills\antigravity-browser-controller\scripts\fb_auto_post.py" `
  -p "default" `
  -i "C:\duong_dan_anh\banner.jpg" `
  -c "Bài viết từ Default Profile! 🚀" `
  -o "ket_qua_default.png"
```

#### 📌 Đăng trên Chrome Profile 1 (`profile_1`):
```powershell
python "%USERPROFILE%\.gemini\config\skills\antigravity-browser-controller\scripts\fb_auto_post.py" `
  -p "profile_1" `
  -v "C:\duong_dan_video\video_demo.mp4" `
  -c "Video siêu phẩm xuất bản từ Chrome Profile 1! 🎬✨" `
  -o "ket_qua_profile1.png"
```

---

### 5.2. Mở web & Thao tác bằng CLI trên từng Profile

Công cụ `cli.py` cho phép điều khiển chi tiết từng Profile:

```powershell
# 1. Xem danh sách tab đang mở của Profile 1
python "%USERPROFILE%\.gemini\config\skills\antigravity-browser-controller\scripts\cli.py" -p "profile_1" tabs

# 2. Điều khiển Profile 2 mở trang web mới
python "%USERPROFILE%\.gemini\config\skills\antigravity-browser-controller\scripts\cli.py" -p "profile_2" goto "https://google.com"

# 3. Chụp ảnh màn hình hiện tại của Profile work
python "%USERPROFILE%\.gemini\config\skills\antigravity-browser-controller\scripts\cli.py" -p "work" screenshot -o "man_hinh_work.png"

# 4. Click chuột vào một nút trên Profile default
python "%USERPROFILE%\.gemini\config\skills\antigravity-browser-controller\scripts\cli.py" -p "default" click -t "Đăng"
```

---

## 6. CƠ CHẾ TỰ ĐỘNG NHẬN DIỆN THÔNG MINH QUA `profile_map.json`

Nếu bạn muốn hệ thống tự động gán tên profile theo Email hoặc URL mà không cần đặt tên thủ công, tạo file tùy chọn `scripts/profile_map.json`:
```json
{
  "email_map": {
    "marketing_team": "marketing",
    "sales_account": "sales"
  },
  "url_map": {
    "suno.com": "music_studio"
  }
}
```

---

## 7. BẢNG XỬ LÝ SỰ CỐ THƯỜNG GẶP (TROUBLESHOOTING FAQ)

| Hiện tượng | Nguyên nhân | Cách khắc phục |
|:---|:---|:---|
| **Lệnh báo lỗi: "Không tìm thấy profile 'X'"** | Profile 'X' chưa mở hoặc chưa kết nối về Server | 1. Kiểm tra cửa sổ Profile đó đã mở chưa.<br>2. Kiểm tra `http://127.0.0.1:8766/status` xem profile nào đang online.<br>3. Mở popup extension của profile đó, kiểm tra tên profile và bấm *Kết nối lại*. |
| **Hai cửa sổ Chrome nhận nhầm lệnh của nhau** | Cả hai cửa sổ cùng để tên profile là "default" | Mở popup extension trên từng cửa sổ, đặt tên phân biệt rõ ràng: một bên là `profile_1`, một bên là `profile_2`, rồi bấm *Lưu Profile*. |
| **Extension báo "Mất kết nối tới máy chủ"** | `server.py` chưa được bật | Mở terminal chạy `python server.py` (hoặc chạy file `start_bridge.bat`). Extension sẽ tự động kết nối lại sau 3 giây. |
| **Mở Chrome mới nhưng Extension chưa nhận** | Chrome mở ở chế độ ẩn danh (Incognito) hoặc chưa cấp quyền | Vào `chrome://extensions/`, bấm *Chi tiết* của Antigravity Extension $\rightarrow$ Bật công tắc *Cho phép ở chế độ ẩn danh* (nếu cần). |

---
*Tài liệu được cập nhật và bảo chứng bởi Antigravity Omni-Browser Multi-Profile Controller - 2026.*
