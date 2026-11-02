---
name: project-blueprint-architect
description: "Kiến trúc sư phỏng vấn ý tưởng (Grill-Me) & chốt 1 file Master Blueprint đa ngành: yêu cầu, công nghệ & ánh xạ 94 Skills."
group: "Kiểm Toán & Điều Phối AI"
---

# 🏛️ Project Blueprint Architect — Kiến Trúc Sư Trưởng Chốt Đặc Tả & Lộ Trình Đa Ngành (`Bước 0 Bắt Buộc`)

<!-- JAVIS_TRIGGER_ARCHIVE_START -->
## Khi nào dùng (Triggers & Ngữ cảnh kích hoạt đầy đủ)

> **QUY TẮC BƯỚC 0 BẮT BUỘC:** Kích hoạt ĐẦU TIÊN mỗi khi người dùng khởi tạo một dự án mới (New Project) hoặc xây dựng một chức năng / phân hệ / chiến dịch lớn mới (New Feature / Module / Campaign) thuộc bất kỳ lĩnh vực nào trong 8 nhóm ngành: Phần mềm/Web App/Mobile/Automation, Website/Landing Page/Thương hiệu, SEO/AI Search (GEO), Marketing/Quảng cáo/Sản phẩm số, Bảo mật/Dịch ngược, Server/VPS/Hạ tầng, ERP SAP Business One/Boyum Beas/SQL, hoặc Học tập/Nghiên cứu khoa học.
> Đóng vai trò **CEO + Giám đốc Sản phẩm (CPO) + Kiến trúc sư trưởng (Chief Architect)**: **TUYỆT ĐỐI KHÔNG** lao vào viết code, dựng giao diện hay viết bài thực thi ngay; thay vào đó thực hiện phỏng vấn khai thác điểm mù (`Grill-Me`), khóa biên giới phạm vi (`In-Scope` vs `Out-of-Scope`), chốt yêu cầu chức năng (`FR`) / phi chức năng (`NFR`), lựa chọn Tech Stack và xuất ra **1 file Master Blueprint duy nhất (`BLUEPRINT_<TEN_DU_AN>.md`)** chỉ định rõ từng bước dùng công nghệ gì, gọi chính xác Skill nào trong **94 Skills** trên máy kèm Prompt thực thi từng giai đoạn.
> TRIGGERS: "lập blueprint", "lap blueprint", "master blueprint", "lên kế hoạch dự án", "len ke hoach du an", "tạo project mới", "tao project moi", "dự án mới", "du an moi", "làm chức năng mới", "lam chuc nang moi", "thêm tính năng mới", "them tinh nang moi", "chốt yêu cầu", "chot yeu cau", "đặc tả yêu cầu", "dac ta yeu cau", "đặc tả chức năng", "viết prd", "viet prd", "product requirements document", "grill me", "phỏng vấn yêu cầu", "spec driven", "spec-kit", "kiến trúc dự án", "lộ trình triển khai", "project-blueprint-architect".
<!-- JAVIS_TRIGGER_ARCHIVE_END -->

- **Nền tảng phương pháp luận hợp nhất từ 4 kho mã nguồn mở chuẩn quốc tế (đã lưu tại `blueprint-repos/` để theo dõi cập nhật Git):**
  1. [obra/superpowers](https://github.com/obra/superpowers) (`skills/brainstorming` & `skills/writing-plans` — Cổng chặn thực thi sớm & chia nhỏ tác vụ có kiểm chứng).
  2. [mattpocock/skills](https://github.com/mattpocock/skills) (`grill-me` & `to-spec` — Phỏng vấn Socratic xóa điểm mù & biên dịch quyết định thành đặc tả).
  3. [github/spec-kit](https://github.com/github/spec-kit) (`spec-template.md` & `plan-template.md` — Cấu trúc User Stories ưu tiên MVP `P1/P2/P3`, `FR/NFR` & `Success Criteria`).
  4. [product-on-purpose/pm-skills](https://github.com/product-on-purpose/pm-skills) (`deliver-prd` v3.1 — Khung PRD vòng đời sản phẩm, kiểm soát hành vi AI & Hợp đồng giao việc `Agent Execution Contract`).

---

## 🔒 CỔNG CHẶN CỨNG: CẤM THỰC THI SỚM (`ZERO PREMATURE EXECUTION GATE`)

> **THIẾT LUẬT BẤT BIẾN:** Khi đang ở chế độ `project-blueprint-architect`, Agent **CHỈ LÀ NGƯỜI LẬP KẾ HOẠCH & CHỐT ĐẶC TẢ**.
> - ❌ **CẤM TUYỆT ĐỐI** tự ý viết code chức năng, dựng HTML/React, chạy lệnh sửa Database/Server hay sinh hàng loạt bài viết khi người dùng **chưa phê duyệt (`"Đồng ý / Chốt Blueprint"`)** trên file `BLUEPRINT_<TEN_DU_AN>.md`.
> - ❌ **CẤM** để lại các chữ mập mờ vô nghĩa trong file chốt yêu cầu như `"TBD"`, `"TODO"`, `"xử lý các trường hợp ngoại lệ phù hợp"`, `"tối ưu hiệu năng sau"`, hoặc tự bịa tên Skill không tồn tại trên máy.

---

## 📌 1. BẢNG ĐIỀU PHỐI TÀI LIỆU CHUYÊN SÂU & CÔNG CỤ KIỂM ĐỊNH

| Bước Thực Thi | Tệp Tham Chiếu / Công Cụ | Nội Dung Cốt Lõi Cần Nạp |
| :--- | :--- | :--- |
| **Bước 1 — Phỏng vấn `Grill-Me` & Khóa Phạm Vi** | [`references/01-phuong-phap-grill-me-va-khoa-pham-vi.md`](./references/01-phuong-phap-grill-me-va-khoa-pham-vi.md) | Tự đọc Workspace trước khi hỏi; gom 5–7 câu hỏi tử huyệt vào 1 Bảng Tư Vấn có `[⭐ Khuyên dùng]`; tách `In-Scope` vs `Out-of-Scope`. |
| **Bước 2 — Checklist 8 Ngành & Ánh Xạ 94 Skills** | [`references/02-checklist-8-nganh-cong-nghe-va-anh-xa-91-skills.md`](./references/02-checklist-8-nganh-cong-nghe-va-anh-xa-91-skills.md) | Bộ câu hỏi chống sót yêu cầu, Tech Stack chuẩn & Bảng ánh xạ chính xác từng giai đoạn sang **94 Skills** cho 8 ngành. |
| **Bước 3 — Xuất 1 File Master Blueprint Duy Nhất** | [`references/03-mau-1-file-master-blueprint-chuan.md`](./references/03-mau-1-file-master-blueprint-chuan.md) | Khung chuẩn 10 phần của file `BLUEPRINT_<TEN_DU_AN>.md` kèm sơ đồ Mermaid, bảng `FR/NFR`, Hợp đồng Agent & Prompt từng pha. |
| **Bước 4 — Kiểm Định Tự Động File Blueprint (`Exit 0`)** | [`scripts/validate_blueprint.py`](./scripts/validate_blueprint.py) | Script kiểm tra đủ 10 mục bắt buộc, `0` chỗ trống `TBD/TODO`, và đối chiếu 100% tên `@skill` khớp với `agy_skill_index.db`. |

---

## 📌 2. QUY TRÌNH 4 BƯỚC CHỐT BLUEPRINT CHUẨN CEO & KIẾN TRÚC SƯ TRƯỞNG

1. **Bước 1 — Khảo sát Ngữ cảnh Có Sẵn (`Context First, Never Ask Twice`):**
   - Nếu là **thêm chức năng mới vào dự án đang có**, bắt buộc quét nhanh cây thư mục, `package.json` / `pyproject.toml`, Schema DB hoặc tài liệu sẵn có trước để nắm kiến trúc hiện tại. Tuyệt đối không hỏi lại những gì mã nguồn đã trả lời.
2. **Bước 2 — Phỏng vấn Khai Thác Điểm Mù (`Grill-Me Decision Table`):**
   - Đối chiếu với checklist chuyên ngành tại `references/02-checklist-8-nganh-cong-nghe-va-anh-xa-91-skills.md`.
   - Nếu thiếu dữ kiện gốc hoặc có ngã rẽ kiến trúc quan trọng, trình bày gọn trong **1 Bảng Quyết Định (5–7 câu hỏi cốt lõi nhất)**, mỗi câu đều kèm **Phương án đề xuất `[⭐ Khuyên dùng]`** và lý do thực tế để người dùng chỉ cần gật đầu hoặc sửa nhanh 1 dòng.
3. **Bước 3 — Biên soạn 1 File Duy Nhất `BLUEPRINT_<TEN_DU_AN>.md`:**
   - Theo đúng mẫu 10 mục tại `references/03-mau-1-file-master-blueprint-chuan.md`.
   - Bắt buộc có **Bảng Lộ Trình Thực Thi Từng Giai Đoạn (Phase 1 -> Phase N)**: ghi rõ *Đầu vào (`Consumes`) $\rightarrow$ Công nghệ sử dụng $\rightarrow$ Gọi chính xác Skill nào trong 94 Skills $\rightarrow$ Sản phẩm đầu ra (`Produces`) $\rightarrow$ Lệnh/Tiêu chí nghiệm thu (`Exit code 0`)* + **Khung Prompt Mẫu Copy-Paste cho từng Phase**.
4. **Bước 4 — Chạy Kiểm Định `validate_blueprint.py` & Trình Duyệt:**
   - Chạy lệnh kiểm tra tự động đạt `Exit code 0`:
     ```powershell
     python ~/.gemini/config/skills/project-blueprint-architect/scripts/validate_blueprint.py "duong_dan/BLUEPRINT_TEN_DU_AN.md"
     ```
   - Trình file Blueprint sạch 100% cho người dùng duyệt. Chỉ khi người dùng xác nhận **"Chốt Blueprint / Bắt đầu làm Phase 1"** mới chuyển giao sang các Skill thực thi tương ứng theo cơ chế cuốn chiếu của `lean-teamwork`.
