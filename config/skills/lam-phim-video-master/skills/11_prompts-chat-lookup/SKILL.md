---
name: prompts-chat
description: >-
  Hệ thống Tra cứu, Tối ưu hóa System Prompt & Săn Agent Skills lớn nhất thế giới từ f/prompts.chat (Awesome ChatGPT Prompts — 174k+ Stars). Tích hợp kép: (1) Kho dữ liệu Offline 2,627 System Prompts (TEXT, STRUCTURED JSON/YAML, IMAGE) + 31 chương sách "The Interactive Book of Prompting" (Context Engineering, Loop Engineering, Multimodal, Agents & Skills), và (2) Kết nối trực tiếp MCP Server https://prompts.chat/api/mcp (search_prompts, get_prompt, improve_prompt, search_skills, get_skill).
  TRIGGERS: "prompts.chat", "tìm prompt", "tra cứu prompt", "nâng cấp prompt", "tối ưu prompt", "tìm skill mới", "săn skill", "awesome prompts", "prompt mẫu".
---

# Prompts.chat Master Engine (`SKILL.md`)

Kỹ năng kết nối trực tiếp kho **2,627 System Prompts**, **31 chương sách kỹ thuật Prompt Engineering** và **Chợ Agent Skills (`prompts.chat`)** vào Antigravity.

---

## 1. Tọa Độ Tài Nguyên Cục Bộ & MCP Server

- **Thư mục dữ liệu trên máy:** [`%USERPROFILE%\.gemini\config\skills\prompts-chat\`](file:///WORKSPACE_DIR/Skill%20AI/prompts-chat/)
  - `prompts.csv`: **2,627 System Prompts** (`2,262 TEXT`, `344 STRUCTURED`, `21 IMAGE`; `189 Developer` & `2,438 Business/Creative`).
  - `book/`: **31 chương sách** *The Interactive Book of Prompting* (`00a-preface.mdx` $\rightarrow$ `27-tools-mcp-connectors.mdx`).
  - `search_prompts_chat.py`: Công cụ CLI tìm kiếm siêu tốc Offline (0.05s) + gọi Live MCP Online.
- **Cấu hình MCP Server toàn cục:** Đã gắn trong [`%USERPROFILE%\.gemini\config\mcp_config.json`](./mcp_config.json) dưới tên `"prompts-chat"` (`https://prompts.chat/api/mcp`).

---

## 2. Hướng Dẫn Sử Dụng Nhanh Qua CLI (`search_prompts_chat.py`)

Sử dụng Python để tra cứu tức thì mà không tốn token đọc toàn bộ file CSV:

```powershell
# 1. Tìm kiếm trong 2,627 prompts offline theo từ khóa (VD: sql, youtube, canvas, three.js, seo, story):
python "%USERPROFILE%\.gemini\config\skills\prompts-chat\search_prompts_chat.py" -q "three.js" -l 5

# 2. Lọc riêng các mẫu STRUCTURED prompt (ép đầu ra JSON/YAML/Table):
python "%USERPROFILE%\.gemini\config\skills\prompts-chat\search_prompts_chat.py" -q "video" -t STRUCTURED -l 5

# 3. Xem toàn văn 1 Prompt theo số thứ tự #ID:
python "%USERPROFILE%\.gemini\config\skills\prompts-chat\search_prompts_chat.py" --id 15

# 4. Đọc các chương sách kỹ thuật Prompt & Agent (VD: context-engineering, loop-engineering, multimodal, agents-and-skills):
python "%USERPROFILE%\.gemini\config\skills\prompts-chat\search_prompts_chat.py" --book "context-engineering"

# 5. Tìm Prompt hoặc Agent Skill mới nhất trực tiếp trên Live MCP Server prompts.chat:
python "%USERPROFILE%\.gemini\config\skills\prompts-chat\search_prompts_chat.py" --mcp-search "cinematic video"
python "%USERPROFILE%\.gemini\config\skills\prompts-chat\search_prompts_chat.py" --mcp-skills "automation"
```

---

## 3. Quy Trình 3 Bước Khi Người Dùng Yêu Cầu Tìm / Nâng Cấp Prompt Hoặc Cài Skill

1. **Khi người dùng cần tìm mẫu Prompt (cho Video, Code, Canvas 2D/3D, SQL, Marketing, SEO):**
   - Chạy `search_prompts_chat.py -q "<từ_khóa>"` để lấy Top mẫu phù hợp nhất từ 2,627 prompts.
   - Xem toàn văn bằng `--id <số_thứ_tự>` và tự động thay thế các biến `${variable}` theo ngữ cảnh dự án của người dùng.
2. **Khi người dùng cần nâng cấp/tối ưu một câu Prompt sơ sài:**
   - Tham chiếu cấu trúc giải phẫu Prompt tại chương `02-anatomy-of-effective-prompt.mdx`, `13-multimodal-prompting.mdx` hoặc `14-context-engineering.mdx` trong thư mục `book/`.
3. **Khi người dùng muốn tìm & cài Skill mới từ chợ `prompts.chat`:**
   - Chạy `search_prompts_chat.py --mcp-skills "<từ_khóa>"` (hoặc gọi MCP tool `search_skills` / `get_skill`), hiển thị bảng so sánh cho người dùng duyệt rồi lưu vào `%USERPROFILE%\.gemini\config\skills\<tên-skill>\`.
