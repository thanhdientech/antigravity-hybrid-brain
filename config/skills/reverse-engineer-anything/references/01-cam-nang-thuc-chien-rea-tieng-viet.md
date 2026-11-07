# 🛠️ CẨM NANG THỰC CHIẾN: REA (REVERSE ENGINEER ANYTHING)
## Siêu Công Cụ Bóc Tách & Dịch Ngược Mã Nguồn Toàn Năng Dành Cho AI Agent

> **Khẩu hiệu chính thức:** *"One MCP for reverse engineering across binaries, applications, and runtime behavior."*  
> *(Một giao thức MCP duy nhất để kỹ thuật dịch ngược xuyên suốt mã nhị phân, ứng dụng desktop/web và hành vi khi đang chạy).*  
> **Tác giả & Bản quyền:** `morluto/rea` (License: MIT)  
> **Kho mã nguồn nội bộ trên máy:** [`E:\DIEN APP\Skill AI\rea\`](file:///E:/DIEN%20APP/Skill%20AI/rea/)  
> **Tài liệu gốc tiếng Việt của tác giả:** [`E:\DIEN APP\Skill AI\rea\docs\readme\README_vi.md`](file:///E:/DIEN%20APP/Skill%20AI/rea/docs/readme/README_vi.md)

---

## 📌 MỤC LỤC
1. [Giới thiệu REA: Vì sao công cụ này gây bão cộng đồng AI?](#1-giới-thiệu-rea-vì-sao-công-cụ-này-gây-bão-cộng-đồng-ai)
2. [Kiến trúc kỹ thuật 3 tầng bóc tách của REA](#2-kiến-trúc-kỹ-thuật-3-tầng-bóc-tách-của-rea)
3. [Hướng dẫn cài đặt & Cấu hình MCP Server vào AI Agent](#3-hướng-dẫn-cài-đặt--cấu-hình-mcp-server-vào-ai-agent)
4. [Danh mục bộ công cụ MCP chuyên sâu (Tool Catalog)](#4-danh-mục-bộ-công-cụ-mcp-chuyên-sâu-tool-catalog)
5. [Quy trình 4 bước bóc tách phần mềm thực chiến (Clean-Room Workflow)](#5-quy-trình-4-bước-bóc-tách-phần-mềm-thực-chiến-clean-room-workflow)
6. [Nghiên cứu điển hình (Case Study): Bóc tách phần mềm Entervi Auto-Edit](#6-nghiên-cứu-điển-hình-case-study-bóc-tách-phần-mềm-entervi-auto-edit)
7. [Bảng tra cứu lệnh CLI nhanh & Mẹo vận hành trên Windows](#7-bảng-tra-cứu-lệnh-cli-nhanh--mẹo-vận-hành-trên-windows)

---

## 1. GIỚI THIỆU REA: VÌ SAO CÔNG CỤ NÀY GÂY BÃO CỘNG ĐỒNG AI?

Trong quy trình phát triển phần mềm truyền thống, khi muốn học hỏi hoặc tái hiện một tính năng đột phá của một phần mềm đóng gói (closed-source), lập trình viên phải sở hữu kỹ năng dịch ngược (Reverse Engineering) cực kỳ phức tạp: mở disassembler (Ghidra, IDA Pro, Hopper), soi từng dòng mã Assembly/Hex, bắt gói tin proxy, giải mã cấu trúc file,... Điều này mất hàng tuần, thậm chí hàng tháng.

**REA (Reverse Engineer Anything)** giải quyết triệt để vấn đề này bằng cách:
* **Chuẩn hóa thành Giao thức MCP (Model Context Protocol):** Đóng gói toàn bộ các bộ công cụ phân tích nhị phân, decompiler, sniffer, unpacker thành một máy chủ MCP duy nhất.
* **Tự động hóa qua AI Agent:** AI Agent (Antigravity, Cursor, Claude Code, Windsurf) không còn phải "đoán mò" code của đối thủ, mà có thể trực tiếp gửi lệnh qua MCP để:
  1. Bung các lớp vỏ đóng gói (Unpack installer/archive).
  2. Dịch ngược mã nguồn sang ngôn ngữ bậc cao (Decompile sang C, C#, JavaScript, Python).
  3. Bắt gói tin mạng thời gian thực để lộ sạch API ngầm (Reverse API endpoint).
  4. Lập bản đồ cấu trúc và **viết lại 100% tính năng sạch (Clean-room rewrite)** chạy mượt mà trên hệ sinh thái của riêng mình.

---

## 2. KIẾN TRÚC KỸ THUẬT 3 TẦNG BÓC TÁCH CỦA REA

```
                                  ┌────────────────────────┐
                                  │   AI Coding Agent      │
                                  │ (Antigravity / Cursor) │
                                  └───────────┬────────────┘
                                              │ (Giao thức MCP / JSON-RPC)
                                              ▼
                             ┌───────────────────────────────────┐
                             │       REA Unified MCP Server      │
                             │        (npm: rea-agents)          │
                             └────────────────┬──────────────────┘
                                              │
         ┌────────────────────────────────────┼────────────────────────────────────┐
         ▼                                    ▼                                    ▼
┌──────────────────┐               ┌───────────────────────┐             ┌─────────────────────┐
│ TẦNG 1: BINARIES │               │ TẦNG 2: APPLICATIONS  │             │  TẦNG 3: RUNTIME    │
│  (Mã Nhị Phân)   │               │   (Ứng Dụng & Bundle) │             │ (Hành Vi Đang Chạy) │
├──────────────────┤               ├───────────────────────┤             ├─────────────────────┤
│ • File .exe, .dll│               │ • Electron (.asar)    │             │ • Bắt gói mạng HAR  │
│ • ELF, Mach-O    │               │ • .NET / C# (IL decompile)│         │ • mitmproxy / HTTP3 │
│ • Ghidra, Hopper │               │ • PyInstaller (.exe)  │             │ • Frida Hook memory │
│ • IDA Pro, Rizin │               │ • Android APK, WASM   │             │ • Process Inspector │
└──────────────────┘               └───────────────────────┘             └─────────────────────┘
```

### 🔹 Tầng 1: Native Binaries (Mã nhị phân máy tính)
- **Đối tượng:** Các file biên dịch nhị phân gốc `.exe`, `.dll` (C, C++, Rust, Go, Swift, Objective-C).
- **Công cụ kết nối:** Tự động điều phối Ghidra (headless), Hopper Disassembler, IDA Pro, hoặc GNU `objdump` / `Rizin`.
- **Nhiệm vụ:** Trích xuất bảng symbol, bảng hàm export/import, chuỗi ký tự ẩn (strings), luồng gọi hàm (call graph) và sinh mã giả C (pseudocode).

### 🔹 Tầng 2: Applications & Frameworks (Ứng dụng đóng gói)
- **Electron Desktop Apps:** Tự động bóc tách các file `.asar`, phục hồi lại cấu trúc cây thư mục JavaScript/TypeScript gốc, gỡ rối mã bị đóng gói bằng Webpack/Vite.
- **Managed Code (.NET / Mono / Unity):** Decompile file `.exe`/`.dll` viết bằng C# sang mã nguồn C# nguyên bản rõ nét.
- **Python Packaged:** Giải nén file `.exe` đóng gói bằng PyInstaller, cx_Freeze $\rightarrow$ trích xuất bytecode `.pyc` $\rightarrow$ decompile thành code Python `.py`.
- **Web & WebAssembly (WASM):** Chuyển đổi mã nhị phân `.wasm` thành định dạng văn bản `.wat`, bóc tách source-map frontend.

### 🔹 Tầng 3: Runtime Behavior & Network Tracing (Hành vi động & Mạng)
- **Bắt gói tin mạng ngầm (Network Sniffing):** Ghi lại file `.har`, kết nối `mitmproxy` để soi toàn bộ header, payload JSON, API authentication token bí mật của phần mềm khi đang chạy.
- **Hook bộ nhớ với Frida:** Đặt breakpoint ngầm vào các hàm mã máy để xem dữ liệu truyền vào và giá trị trả về trước khi bị mã hóa.

---

## 3. HƯỚNG DẪN CÀI ĐẶT & CẤU HÌNH MCP SERVER VÀO AI AGENT

### Cách 1: Thiết lập tự động 1 chạm qua NPX (Khuyến nghị)
Mở PowerShell hoặc Command Prompt và chạy lệnh:
```bash
npx rea-agents setup
```
Trình hướng dẫn (Wizard) của REA sẽ tự động phát hiện các IDE và AI Agent đang cài trên máy (Claude Desktop, Cursor, Antigravity, VS Code, Windsurf) và ghi cấu hình MCP tự động.

---

### Cách 2: Cấu hình thủ công vào Antigravity / Cursor / Claude Desktop

#### 1. Cấu hình cho Antigravity / Gemini CLI:
Mở hoặc tạo file cấu hình MCP tại `C:\Users\INFOASIA\.gemini\antigravity\mcp_config.json`:
```json
{
  "mcpServers": {
    "rea": {
      "command": "npx",
      "args": ["-y", "rea-agents", "mcp"],
      "env": {
        "REA_MCP_INPUT_SCHEMA_PROFILE": "full"
      }
    }
  }
}
```

#### 2. Cấu hình cho Cursor IDE:
Tạo hoặc sửa file `.cursor/mcp.json` trong thư mục dự án:
```json
{
  "mcpServers": {
    "rea": {
      "command": "npx",
      "args": ["-y", "rea-agents", "mcp"]
    }
  }
}
```

#### 3. Chạy trực tiếp từ mã nguồn nội bộ đã clone:
Nếu không muốn phụ thuộc vào mạng Internet tải gói npm, Sếp có thể chạy trực tiếp từ thư mục [`E:\DIEN APP\Skill AI\rea`](file:///E:/DIEN%20APP/Skill%20AI/rea/):
```bash
cd "E:\DIEN APP\Skill AI\rea"
npm install
npm run build
node dist/cli.js mcp
```

---

## 4. DANH MỤC BỘ CÔNG CỤ MCP CHUYÊN SÂU (TOOL CATALOG)

Khi REA MCP Server khởi chạy, nó cung cấp cho AI Agent một danh mục công cụ đặc nhiệm:

| Nhóm Công Cụ | Tên Tool MCP | Chức năng thực chiến của Tool |
| :--- | :--- | :--- |
| **Triage & Identity** | `identify_target` | Tự động quét file mục tiêu, xác định kiến trúc (x86_64/ARM64), compiler, framework (Electron, .NET, PyInstaller, Native C++). |
| **Archive Unpacking** | `extract_asar` | Bung sạch file `app.asar` của ứng dụng Electron thành mã nguồn JS/HTML/CSS đầy đủ. |
| | `unpack_installer` | Tự động giải nén gói cài đặt NSIS, InnoSetup, MSI, ZIP, 7z mà không cần chạy file `.exe`. |
| **Static Decompilation** | `decompile_binary` | Gửi file nhị phân vào Ghidra/Hopper để sinh mã giả C (Decompiled C Pseudocode). |
| | `decompile_managed` | Dịch ngược assembly `.NET` / `C#` sang toàn bộ file `.cs` nguyên bản. |
| | `extract_strings` | Quét sạch các chuỗi URL, API Endpoint, Secret Key, chuỗi thông báo ẩn trong mã nhị phân. |
| **Network & Traffic** | `analyze_har` | Phân tích tệp nhật ký mạng HTTP/HTTPS HAR, trích xuất cấu trúc Request/Response Payload JSON. |
| | `trace_network` | Kết nối proxy thời gian thực để bắt mọi request mà phần mềm phát ra khi tương tác. |
| **Reconstruction** | `map_architecture` | Lập sơ đồ cây module (Dependency Graph), xác định các file cốt lõi chứa logic nghiệp vụ. |
| | `scaffold_cleanroom` | Khởi tạo dự án mới với khung kiến trúc sạch để AI Agent tiến hành code lại tính năng. |

---

## 5. QUY TRÌNH 4 BƯỚC BÓC TÁCH PHẦN MỀM THỰC CHIẾN (CLEAN-ROOM WORKFLOW)

Để bóc tách một phần mềm mà không bị vi phạm pháp lý hoặc gặp lỗi mã nguồn rác, AI Agent tuân thủ quy trình chuẩn **4 bước Clean-Room**:

```
[File Cài Đặt .exe / Ứng Dụng Đóng Gói]
                │
                ▼
🔒 BƯỚC 1: QUÉT NHẬN DIỆN (Triage & Framework Detection)
   • Xác định: Electron? Python? .NET? Hay C++ Native?
                │
                ▼
🔒 BƯỚC 2: BUNG LỚP VỎ ĐÓNG GÓI (Unpack & De-obfuscate)
   • Bung NSIS/InnoSetup -> Trích xuất ASAR / Assembly / PyInstaller archive
                │
                ▼
🔒 BƯỚC 3: MỔ XẺ NGHIỆP VỤ CỐT LÕI (Isolate Core Business Logic)
   • Lọc bỏ thư viện bên thứ 3 (node_modules, runtime libraries).
   • Định vị các hàm xử lý then chốt (Core Algorithm, API caller, DB connector).
                │
                ▼
🔒 BƯỚC 4: TÁI TẠO MÃ NGUỒN SẠCH (Clean-Room Recreation)
   • AI Agent viết lại logic bằng ngôn ngữ hiện đại (Python, TypeScript) độc lập 100%.
```

---

## 6. NGHIÊN CỨU ĐIỂN HÌNH (CASE STUDY): BÓC TÁCH PHẦN MỀM ENTERVI AUTO-EDIT

Minh chứng sống động nhất cho quy trình này chính là dự án mà hệ thống vừa hoàn thành tại:  
📂 [`E:\DIEN APP\Skill AI\audo edit\`](file:///E:/DIEN%20APP/Skill%20AI/audo%20edit/)  
📄 Chi tiết: [BAO_CAO_GIAI_MA_VA_BOC_TACH_ENTERVI_AUTO_EDIT.md](file:///E:/DIEN%20APP/Skill%20AI/audo%20edit/BAO_CAO_GIAI_MA_VA_BOC_TACH_ENTERVI_AUTO_EDIT.md)

### 🧩 Diễn biến thực tế:
1. **Đầu vào ban đầu:** Chỉ có file cài đặt `Entervi-Setup-win-x64.exe` nặng **715 KB** (vỏ NSIS Web Installer).
2. **Bóc tách tầng 1 (Network & Archive):** Giải mã header NSIS $\rightarrow$ bắt được link tải trọn gói ứng dụng độc lập 189 MB từ GitHub (`entervi-0.6.30-x64.nsis.7z`).
3. **Bóc tách tầng 2 (Runtime Unpack):** Bung gói 189 MB $\rightarrow$ thu được thư mục ứng dụng [entervi_app_full/](file:///E:/DIEN%20APP/Skill%20AI/audo%20edit/entervi_app_full/) nặng **631 MB** chứa 2 binary độc lập: `ffmpeg.exe` (222 MB) và `yt-dlp.exe` (17.8 MB).
4. **Bóc tách tầng 3 (ASAR Extraction):** Dùng trình bóc tách ASAR bung sạch file `resources/app.asar` $\rightarrow$ đưa về [source_code/](file:///E:/DIEN%20APP/Skill%20AI/audo%20edit/source_code/).
5. **Thu hoạch toàn bộ thuật toán biên tập tự động:**
   - Khám phá file lõi [`source_code/dist/main.js`](file:///E:/DIEN%20APP/Skill%20AI/audo%20edit/source_code/dist/main.js) (4.2 MB - hơn 4,238,000 ký tự code).
   - Bóc tách chính xác thuật toán cắt khoảng lặng:
     ```javascript
     "-i", file, "-af", `silencedetect=n=${noise}dB:d=${min}`, "-f", "null", "-"
     ```
   - Bóc tách thuật toán cân bằng âm lượng tự động `volumedetect`.
   - Bóc tách hàm dựng phân cảnh tự động `renderFromScenes` kết hợp lồng tiếng và hiệu ứng.

---

## 7. BẢNG TRA CỨU LỆNH CLI NHANH & MẸO VẬN HÀNH TRÊN WINDOWS

| Lệnh Thực Thi | Mục đích sử dụng |
| :--- | :--- |
| `npx rea-agents setup` | Tự động quét và cấu hình MCP Server cho mọi IDE/Agent trên máy. |
| `npx rea-agents doctor` | Kiểm tra tình trạng sức khỏe kết nối giữa Agent và các công cụ dịch ngược (Ghidra, Node, etc.). |
| `npx rea-agents mcp` | Chạy REA dưới dạng tiến trình máy chủ MCP lắng nghe qua `stdio`. |
| `npx rea-agents analyze <path>` | Phân tích nhanh 1 tệp tin hoặc thư mục ứng dụng trực tiếp từ dòng lệnh. |
| `npx skills add morluto/rea --skill reverse-engineer-anything` | Cài đặt toàn bộ tri thức kỹ thuật đảo ngược vào bộ nhớ Agent dưới dạng Skill. |

### 💡 Mẹo nhỏ cho Sếp khi tác chiến trên Windows:
1. **Tránh lỗi đường dẫn dài (MAX_PATH):** Luôn để thư mục phần mềm cần bóc tách ở đường dẫn ngắn (ví dụ: `E:\DIEN APP\Skill AI\...`).
2. **Bộ binary FFmpeg & yt-dlp di động:** Khi cần xử lý video/audio trong các script của mình, Sếp có thể mượn ngay file `ffmpeg.exe` và `yt-dlp.exe` trong thư mục [`audo edit/entervi_app_full/resources/bin/win32-x64/`](file:///E:/DIEN%20APP/Skill%20AI/audo%20edit/entervi_app_full/resources/bin/win32-x64/) để chạy mà không cần cài đặt phần mềm lên Windows.
3. **Mã hóa Clean-Room:** Sau khi AI Agent đọc hiểu mã nguồn đối thủ bằng REA, luôn yêu cầu AI: *"Hãy viết lại tính năng này bằng Python/Node.js theo phong cách module của công ty chúng ta"* để sản phẩm vừa sạch sẽ, vừa tối ưu tốc độ vượt trội hơn bản gốc!

---
*Tài liệu được biên soạn đồng bộ với phiên bản REA v6.7.0. Bản quyền hướng dẫn thuộc hệ sinh thái Skill AI.*
