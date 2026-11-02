---
name: antigravity-browser-controller
description: "Điều khiển trình duyệt (Cốc Cốc, Chrome) qua CDP/WebSocket: đa profile, nạp file ngầm, auto-post FB & chụp ảnh."
group: "Tự động hóa & Trình duyệt"
---

# Antigravity Omni-Browser Controller Skill

<!-- JAVIS_TRIGGER_ARCHIVE_START -->
## Khi nào dùng (Triggers & Ngữ cảnh kích hoạt đầy đủ)

> Điều khiển toàn năng mọi trình duyệt (Cốc Cốc, Chrome, Edge...) qua Omni-Browser Bridge (WebSocket & CDP). Hỗ trợ tự động hóa đa profile (default, profile_1, profile_2, work, marketing...), click, type, scroll, nạp file nhị phân ngầm qua CDP DOM.setFileInputFiles, tự động đăng bài viết kèm Ảnh/Video lên Facebook không cần Windows File Dialog, chụp ảnh màn hình bằng chứng, và duy trì kết nối 24/7 qua nhịp tim Keepalive. Kích hoạt khi người dùng muốn điều khiển trình duyệt, tự động hóa web, đăng bài Facebook, up video Facebook, hoặc thao tác đa profile.
<!-- JAVIS_TRIGGER_ARCHIVE_END -->

Kỹ năng chuyên sâu điều khiển toàn diện mọi trình duyệt web (Cốc Cốc, Google Chrome, Microsoft Edge, Brave...) qua kiến trúc **Omni-Browser Bridge** (WebSocket Server `:8765` + REST API `:8766` + Chrome DevTools Protocol Native 1.3).

---

## 1. Năng Lực Cốt Lõi (Core Capabilities)

1. **Điều Phối Đa Profile (Multi-Profile Support v2.1):**
   - Điều khiển song song nhiều profile Chrome/Cốc Cốc/Edge trên cùng một máy tính mà không làm mất cookie, session hay xung đột kết nối.
   - Nhận diện profile linh hoạt:
     - Theo tên đặt thủ công trong Popup Extension (`default`, `profile_1`, `profile_2`, `work`, `marketing`...).
     - Tự động nhận diện (Auto-Inference) qua cấu hình ánh xạ động trong `profile_map.json` (tùy chọn theo Email đăng nhập hoặc URL đặc thù).

2. **Nạp File Nhị Phân Ngầm Qua CDP Native (Bypass Sandbox):**
   - Nạp file Ảnh (`.jpg`, `.png`, `.webp`) hoặc Video (`.mp4`, `.mov`) trực tiếp từ ổ cứng vào `<input type="file">` của trang web qua lệnh CDP `DOM.setFileInputFiles`.
   - **Hoàn toàn không cần mở hộp thoại Windows File Chooser**, hoạt động trơn tru 100% kể cả khi cửa sổ thu nhỏ (minimize).

3. **Tự Động Đăng Bài Facebook 1 Chạm (Strict QA & Evidence Gate):**
   - Đăng bài viết kèm **ẢNH** hoặc **VIDEO** lên Facebook chỉ với 1 dòng lệnh.
   - Tự động định vị đúng Tab Facebook, lọc sạch các popup Messenger gây xung đột.
   - Cơ chế Strict QA: Quét DOM xác nhận sự xuất hiện của ảnh `blob:` hoặc thẻ `<video>` preview trước khi bấm nút "Đăng".
   - Tự động chụp ảnh màn hình nghiệm thu sau khi đăng bài xuất bản thành công.

4. **Duy Trì Kết Nối 24/7 (Keepalive):**
   - Vòng lặp Heartbeat 10 giây qua WebSocket kết hợp Chrome Alarms API đánh thức Service Worker của Extension, đảm bảo kết nối không bao giờ bị ngắt.

---

## 2. Cấu Trúc Thư Mục & Tài Nguyên Của Skill

```
%USERPROFILE%\.gemini\config\skills\antigravity-browser-controller\
├── SKILL.md                                 # Tài liệu định nghĩa kỹ năng (File này)
├── HUONG_DAN_KET_NOI_DA_PROFILE_CHROME.md   # Hướng dẫn chi tiết kết nối từng profile
│
├── extension\                               # Extension cài vào trình duyệt
│   ├── manifest.json                        # Manifest V3 (debugger, scripting, alarms...)
│   ├── background.js                        # Service Worker, CDP Bridge, Multi-Profile
│   ├── content.js                           # Content Script, DOM Inspector, Event Dispatch
│   ├── popup.html                           # Giao diện đặt tên Profile
│   ├── popup.js                             # Logic lưu Profile Name & Trạng thái Live
│   └── icons\                               # Bộ icon hiển thị trên trình duyệt
│
└── scripts\                                 # Bộ công cụ điều khiển & Server
    ├── server.py                            # Bridge Server đa luồng (WS :8765 + HTTP :8766)
    ├── start_bridge.bat                     # File kích hoạt server nhanh
    ├── fb_auto_post.py                      # Tool tự động đăng Facebook (Ảnh/Video/Text)
    └── cli.py                               # Bộ lệnh điều khiển terminal đa năng
```

---

## 3. Hướng Dẫn Sử Dụng Nhanh

### Bước 1: Khởi động Bridge Server (Chạy nền)
```powershell
python "%USERPROFILE%\.gemini\config\skills\antigravity-browser-controller\scripts\server.py"
```
*(Hoặc click đúp file `start_bridge.bat`).*

### Bước 2: Nạp Extension vào Chrome / Cốc Cốc / Edge
1. Mở `chrome://extensions/` (hoặc `coccoc://extensions/`).
2. Bật **Developer mode** $\rightarrow$ Bấm **Load unpacked**.
3. Chọn thư mục `extension` của skill:  
   `%USERPROFILE%\.gemini\config\skills\antigravity-browser-controller\extension`
4. Bấm vào icon tiện ích trên thanh công cụ, đặt tên Profile (ví dụ: `default`, `profile_1`, `profile_2`, `work`) và bấm **Lưu Profile**.

---

## 4. Các Lệnh Đăng Bài Facebook Phổ Biến

### 1. Đăng bài kèm ẢNH trên Profile mặc định (`default`):
```powershell
python "%USERPROFILE%\.gemini\config\skills\antigravity-browser-controller\scripts\fb_auto_post.py" `
  -p "default" `
  -i "C:\duong_dan_anh\banner_2026.jpg" `
  -c "Kiệt tác công nghệ Trí tuệ Nhân tạo 2026! 🚀🎨✨ #AI2026" `
  -o "ket_qua_anh.png"
```

### 2. Đăng bài kèm VIDEO trên Profile chỉ định (`profile_1`):
```powershell
python "%USERPROFILE%\.gemini\config\skills\antigravity-browser-controller\scripts\fb_auto_post.py" `
  -p "profile_1" `
  -v "C:\duong_dan_video\video_demo.mp4" `
  -c "Trải nghiệm video hoạt cảnh AI Thế hệ mới! 🎬✨" `
  -o "ket_qua_video.png"
```

### 3. Đăng bài thuần VĂN BẢN (Text only):
```powershell
python "%USERPROFILE%\.gemini\config\skills\antigravity-browser-controller\scripts\fb_auto_post.py" `
  -p "default" `
  -c "Chúc mọi người một ngày làm việc tràn đầy năng lượng và hiệu quả!"
```

---

## 5. Các Lệnh Điều Khiển Trình Duyệt Qua CLI (`cli.py`)

```powershell
# 1. Kiểm tra danh sách các profile đang kết nối
curl http://127.0.0.1:8766/status

# 2. Xem danh sách tab đang mở trên Profile 1
python "%USERPROFILE%\.gemini\config\skills\antigravity-browser-controller\scripts\cli.py" -p "profile_1" tabs

# 3. Điều khiển Profile 2 điều hướng tới URL
python "%USERPROFILE%\.gemini\config\skills\antigravity-browser-controller\scripts\cli.py" -p "profile_2" goto "https://google.com"

# 4. Chụp ảnh màn hình từ Profile work
python "%USERPROFILE%\.gemini\config\skills\antigravity-browser-controller\scripts\cli.py" -p "work" screenshot -o "shot_work.png"

# 5. Click vào nút trên web theo văn bản hiển thị
python "%USERPROFILE%\.gemini\config\skills\antigravity-browser-controller\scripts\cli.py" -p "default" click -t "Đăng"
```

---

## 6. Tài Liệu Tham Khảo Chi Tiết Đi Kèm

- [Hướng dẫn kết nối chi tiết từng Profile Chrome](./HUONG_DAN_KET_NOI_DA_PROFILE_CHROME.md)

---
*Kỹ năng Antigravity Omni-Browser Controller được đăng ký chính thức vào hệ thống Global Skills - 2026.*
