---
name: reverse-engineer-anything
description: "Dịch ngược & bóc tách phần mềm/nhị phân (.exe, Electron .asar, .NET, APK, PyInstaller, HAR/API) qua REA CLI & MCP."
group: "Kiểm Toán & Điều Phối AI"
---

# 🛠️ REA — Reverse Engineer Anything (`reverse-engineer-anything` v6.8.0)

<!-- JAVIS_TRIGGER_ARCHIVE_START -->
## Khi nào dùng (Triggers & Ngữ cảnh kích hoạt đầy đủ)

> Kỹ thuật dịch ngược (Reverse Engineering), bóc tách gói cài đặt và phân tích hành vi thực thi của phần mềm đóng gói / tệp nhị phân bằng bộ công cụ **REA (`morluto/rea` v6.8.0)** qua CLI hoặc MCP Server: bung bộ cài NSIS/InnoSetup/MSI/ZIP, bóc tách ứng dụng Electron (`app.asar` & JavaScript/Webpack bundle), dịch ngược `.NET / C#` Managed Assembly, giải nén `PyInstaller (.exe -> .pyc -> .py)`, phân tích Android `.apk` (JADX), mã máy Native `.exe / .dll / ELF / Mach-O` (Ghidra/Hopper/Rizin), firmware, bắt gói tin mạng `.har / mitmproxy` tìm API ngầm và tái tạo mã nguồn sạch (`Clean-Room Rewrite`). Không dùng REA khi đã có sẵn toàn bộ mã nguồn gốc của repo thông thường.
> TRIGGERS: "rea", "reverse engineer", "reverse engineering", "reverse-engineer-anything", "dịch ngược", "dich nguoc", "bóc tách phần mềm", "boc tach phan mem", "bung file exe", "giải nén asar", "app.asar", "electron decompile", "pyinstaller unpack", "decompile c#", "decompile dotnet", "bóc tách apk", "ghidra", "bắt gói tin api", "reverse api", "clean-room rewrite", "phân tích file nhị phân".
<!-- JAVIS_TRIGGER_ARCHIVE_END -->

- **Kho mã nguồn gốc trên máy (có `.git` để check update):** [`.\engine\`](file:///E:/DIEN%20APP/Skill%20AI/rea/) (`origin`: [morluto/rea](https://github.com/morluto/rea), version `6.8.0`).
- **Tệp thực thi CLI cục bộ:** `node ".\engine\scripts\rea.mjs"` (hoặc `npx -y rea-agents@latest`).

---

## 📌 1. BẢNG ĐIỀU PHỐI TÀI LIỆU CHUYÊN SÂU (`references/`)

| Tình Huống / Mục Tiêu Phân Tích | Tệp Tham Chiếu Trong `references/` | Nội Dung Cốt Lõi |
| :--- | :--- | :--- |
| **Cẩm nang Tiếng Việt & Quy trình 4 bước Clean-Room** | [`references/01-cam-nang-thuc-chien-rea-tieng-viet.md`](./references/01-cam-nang-thuc-chien-rea-tieng-viet.md) | Kiến trúc 3 tầng REA, cấu hình MCP, Case Study Entervi & quy trình tái tạo mã nguồn sạch. |
| **Quy trình định tuyến chuẩn REA Upstream (v44)** | [`references/00-rea-upstream-workflow.md`](./references/00-rea-upstream-workflow.md) | Quy tắc chọn đúng tool đầu tiên theo loại tệp, kiểm chứng Evidence & giới hạn an toàn. |
| **Ứng dụng Electron (`app.asar`) & JavaScript Bundle** | [`references/javascript-applications.md`](./references/javascript-applications.md) | Phân tích cây JS/TS đóng gói Webpack/Vite bằng `analyze-javascript-application`. |
| **File nhị phân Native (`.exe/.dll`), `.NET`, PyInstaller, Archive** | [`references/native-and-artifacts.md`](./references/native-and-artifacts.md) | Quy trình `open_binary`, `inspect_artifact`, `inspect_managed_artifact`, NativeAOT & Ghidra. |
| **Ứng dụng Android (`.apk`) & JADX** | [`references/android-applications.md`](./references/android-applications.md) | Điều tra class, method và luồng tham chiếu APK qua `inspect_android_package`. |
| **Quan sát hành vi Runtime, Trình duyệt & Gói tin HAR/API** | [`references/runtime-observation.md`](./references/runtime-observation.md) | Bắt kịch bản trình duyệt, lưu lượng mạng thực tế và đối chiếu hành vi động. |
| **Phương pháp kiểm chứng bằng chứng (Evidence Workflows)** | [`references/evidence-workflows.md`](./references/evidence-workflows.md) | Cách đọc đồ thị phụ thuộc, tách thư viện bên thứ 3 khỏi logic nghiệp vụ cốt lõi. |
| **Chẩn đoán kết nối MCP & Khắc phục lỗi (`doctor` / `setup`)** | [`references/connection-and-recovery.md`](./references/connection-and-recovery.md) | Cách chạy `rea doctor --json` và `setup --dry-run` an toàn cho Antigravity/Cursor/Codex. |

---

## 📌 2. LỆNH CLI THỰC CHIẾN NHANH (KHÔNG CẦN CÀI LẠI KHI ĐÃ CÓ REPO CỤC BỘ)

```powershell
# 1. Kiểm tra sức khỏe kết nối REA với Antigravity (Read-Only):
node ".\engine\scripts\rea.mjs" doctor --client antigravity --json

# 2. Phân tích trực tiếp ứng dụng Electron (.asar) hoặc cây thư mục JavaScript đóng gói:
node ".\engine\scripts\rea.mjs" analyze-javascript-application "E:\duong_dan\app.asar" --json

# 3. Khởi chạy máy chủ REA MCP từ bản cài đặt cục bộ (khi cấu hình vào mcp_config.json):
node ".\engine\scripts\rea.mjs" mcp
```

---

## 📌 3. 3 NGUYÊN TẮC BẮT BUỘC KHI SỬ DỤNG REA

1. **Không dùng REA cho Repo mã nguồn mở thông thường:** Nếu mục tiêu đã có sẵn đầy đủ source code gốc (`.py`, `.ts`, `.cs`), đọc trực tiếp bằng công cụ file chuẩn của Agent để tiết kiệm tài nguyên.
2. **Định tuyến đúng loại tệp ngay bước đầu:** Electron/JS dùng `analyze_javascript_application`; `.NET` dùng `inspect_managed_artifact`; Android `.apk` dùng `inspect_android_package`; PyInstaller / ZIP / MSI / Native `.exe` dùng `open_binary` + `inspect_artifact`.
3. **Tái tạo Clean-Room Sạch 100%:** Chỉ trích xuất kiến trúc, giao thức API và thuật toán cốt lõi (bỏ qua `node_modules` / runtime rác), sau đó viết lại bằng mã nguồn sạch theo chuẩn kiến trúc riêng của dự án.
