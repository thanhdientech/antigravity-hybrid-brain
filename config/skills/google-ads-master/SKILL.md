---
name: google-ads-master
description: "Siêu Hub 12 skill Google Ads & CRO: từ khóa, tracking, audit A1-A14, ngân sách, Search/PMax, tối ưu ROAS & Editor CSV."
group: "Quảng Cáo & Marketing"
---

# 🚀 GOOGLE ADS & CRO MASTER HUB (`google-ads-master`)

<!-- JAVIS_TRIGGER_ARCHIVE_START -->
## Khi nào dùng (Triggers & Ngữ cảnh kích hoạt đầy đủ)

> Siêu Skill Tổng Quan (Master Hub) hợp nhất trọn bộ **12 Bộ Skill Google Ads, Phân Tích Từ Khóa Hành Trình Khách Hàng & Tối Ưu Chuyển Đổi Trang Đích (CRO)** kèm **18 Playbook tham chiếu A1–A14**, **4 Hợp đồng JSON/YAML** và **14 Script Python thực thi**. Điều phối xuyên suốt vòng đời tài khoản Google Ads thực chiến (18 Module v3): Thiết lập `account-context.yaml` (`setup`) -> Kiểm định Conversion Tracking / GA4 / CAPI chống đếm trùng (`measurement`) -> Chấm điểm sức khỏe & phát hiện rò rỉ tiền A1–A14 bằng GAQL (`audit`, `money_leak_report.py`, `a14_product_report.py`) -> Audit trang đích CRO xuất HTML Dashboard (`toi-uu-chuyen-doi-web`) -> Gom nhóm từ khóa CSV Keyword Planner theo 3 giai đoạn Quan Tâm / Cân Nhắc / Mua Hàng ra Excel 6 sheet (`keyword-analysis`) -> Lập kế hoạch ngân sách & dự báo CPA/ROAS (`plan`, `forecaster.py`) -> Dựng chiến dịch Search & RSA/PMax Assets (`builder-search`, `assets`) -> Khai thác Search Terms / Negative Keywords & phân hạng tối ưu tài khoản đang chạy (`optimizer`, `search_term_miner.py`, `tiering.py`) -> Kiểm định an toàn & xuất file Google Ads Editor CSV luôn ở trạng thái `PAUSED` (`pusher`).
> TRIGGERS: "google ads", "chạy quảng cáo google", "chay quang cao google", "audit google ads", "kiem toan google ads", "gaql", "money leak", "rò rỉ ngân sách", "wasted spend", "conversion tracking", "kiem tra tracking", "double count", "enhanced conversions", "phân tích từ khóa", "phan tich tu khoa", "phân nhóm từ khóa", "keyword analysis", "keyword planner", "ngân sách từ khóa", "lập kế hoạch google ads", "google ads plan", "search campaign", "chiến dịch tìm kiếm", "pmax", "performance max", "demand gen", "rsa headline", "sitelink", "callout", "negative keyword", "từ khóa phủ định", "search term miner", "tối ưu roas", "troas", "tcpa", "google ads editor", "tối ưu chuyển đổi web", "toi uu chuyen doi web", "cro audit", "audit landing page", "message match".
<!-- JAVIS_TRIGGER_ARCHIVE_END -->

- **Nguồn gốc / Kho Git Upstream:** [googleads/google-ads-python (Google Ads Hub)](https://github.com/googleads/google-ads-python) (`Marketing & Ads Hub`)

---

## 📌 1. BẢN ĐỒ ĐIỀU PHỐI 12 BỘ SKILL THÀNH PHẦN & TÀI LIỆU GỐC (`skills/` & `references/`)

| STT | Mã Bộ Skill | Nhóm Nghiệp Vụ | Tệp Điều Phối Chính | Công Cụ Python & Tài Liệu Đi Kèm | Đầu Ra Chuẩn |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **0** | **Bản Đồ 18 Module v3** | Tổng quan & Hợp đồng | [`references/00-ban-do-18-module-va-12-skills.md`](./references/00-ban-do-18-module-va-12-skills.md) | Chưng cất 100% từ [`resources/Skill.xlsx`](./resources/Skill.xlsx) + 4 mẫu JSON/YAML | Lộ trình 18 Module & Data Contracts |
| **1** | **`google-ads`** | Điều phối vòng đời (Router) | [`skills/google-ads/SKILL.md`](./skills/google-ads/SKILL.md) | Định tuyến tự động `setup -> measurement -> audit -> plan -> build -> push -> optimize` | Quyết định bước kế tiếp |
| **2** | **`google-ads-shared`** | Thư viện lõi A1–A14 | [`skills/google-ads-shared/SKILL.md`](./skills/google-ads-shared/SKILL.md) | [`diagnostic-playbook.md`](./skills/google-ads-shared/references/diagnostic-playbook.md) + 14 `references/*.md` + 4 `templates/` | Quy chuẩn & Schema dùng chung |
| **3** | **`google-ads-setup`** | Khởi tạo hồ sơ tài khoản | [`skills/setup/SKILL.md`](./skills/setup/SKILL.md) | [`skills/setup/scripts/validate_context.py`](./skills/setup/scripts/validate_context.py) | `account-context.yaml` |
| **4** | **`google-ads-measurement`** | Cổng kiểm định Tracking | [`skills/measurement/SKILL.md`](./skills/measurement/SKILL.md) | [`conversion-tracking-logic.md`](./skills/google-ads-shared/references/conversion-tracking-logic.md) | Báo cáo `PASS / WARN / FAIL` |
| **5** | **`google-ads-audit`** | Kiểm toán A1–A14 (Read-Only) | [`skills/audit/SKILL.md`](./skills/audit/SKILL.md) | [`money_leak_report.py`](./skills/audit/scripts/money_leak_report.py), [`a14_product_report.py`](./skills/audit/scripts/a14_product_report.py), [`gaql-notes.md`](./skills/audit/references/gaql-notes.md) | `AUDIT.html` + `audit-result.json` |
| **6** | **`toi-uu-chuyen-doi-web`** | Kiểm toán trang đích CRO | [`skills/toi-uu-chuyen-doi-web/SKILL.md`](./skills/toi-uu-chuyen-doi-web/SKILL.md) | Message Match, 3-Second Test, Trust Signal, PageSpeed & So sánh đối thủ | HTML CRO Dashboard + Quick Wins |
| **7** | **`keyword-analysis`** | Phân nhóm từ khóa L1–L3 | [`skills/keyword-analysis/SKILL.md`](./skills/keyword-analysis/SKILL.md) | [`scripts/recalc_xlsx_check.py`](./scripts/recalc_xlsx_check.py) kiểm tra 0 lỗi công thức Excel | File `.xlsx` 6 Sheets hành trình |
| **8** | **`google-ads-plan`** | Kế hoạch ngân sách & Dự báo | [`skills/plan/SKILL.md`](./skills/plan/SKILL.md) | [`skills/plan/scripts/forecaster.py`](./skills/plan/scripts/forecaster.py), [`forecasting-and-benchmarks.md`](./skills/google-ads-shared/references/forecasting-and-benchmarks.md) | `GOOGLE-ADS-PLAN.md` |
| **9** | **`google-ads-builder-search`** | Thiết kế chiến dịch Search | [`skills/builder-search/SKILL.md`](./skills/builder-search/SKILL.md) | [`scripts/spec_to_xlsx.py`](./scripts/spec_to_xlsx.py), [`campaign-spec.md`](./skills/google-ads-shared/references/campaign-spec.md) | `blueprint.xlsx` + `campaign-spec.json` |
| **10** | **`google-ads-assets`** | Viết mẫu quảng cáo đa kênh | [`skills/assets/SKILL.md`](./skills/assets/SKILL.md) | [`google-ads-formatting.md`](./skills/google-ads-shared/references/google-ads-formatting.md), [`pmax-best-practices.md`](./skills/google-ads-shared/references/pmax-best-practices.md) | RSA Headlines/Desc, PMax, Sitelinks |
| **11** | **`google-ads-optimizer`** | Tối ưu tài khoản đang chạy | [`skills/optimizer/SKILL.md`](./skills/optimizer/SKILL.md) | [`search_term_miner.py`](./skills/optimizer/scripts/search_term_miner.py), [`tiering.py`](./skills/optimizer/scripts/tiering.py), [`optimization-playbook.md`](./skills/google-ads-shared/references/optimization-playbook.md) | `change-set.json` + Kế hoạch tối ưu |
| **12** | **`google-ads-pusher`** | Kiểm định & Xuất Editor CSV | [`skills/pusher/SKILL.md`](./skills/pusher/SKILL.md) | [`validate_spec.py`](./skills/pusher/scripts/validate_spec.py), [`validate_changeset.py`](./skills/pusher/scripts/validate_changeset.py), [`spec_to_editor_csv.py`](./skills/pusher/scripts/spec_to_editor_csv.py), [`changeset_to_actions.py`](./skills/pusher/scripts/changeset_to_actions.py) | Google Ads Editor CSV (`PAUSED`) |

---

## 📌 2. 5 NGUYÊN TẮC KỶ LUẬT BẮT BUỘC KHI VẬN HÀNH (`NON-NEGOTIABLE GATES`)

1. **Chống Ảo Giác Số Liệu Tuyệt Đối (`Zero Hallucination`):** Tuyệt đối không tự bịa CPC, Search Volume, CTR, CVR hay ROAS lịch sử. Nguồn từ khóa phải lấy từ file CSV/XLSX xuất thực tế từ Google Keyword Planner hoặc GAQL tài khoản; mọi kết nối thiếu dữ liệu (Store / GMC / GA4) phải gắn cờ `UNVERIFIED`, nghiêm cấm tự điền số giả.
2. **Cổng Chặn Đo Lường (`Measurement Gate`):** Không lập kế hoạch mở rộng ngân sách hay dựng chiến dịch mới khi `measurement` đang báo `FAIL` (đếm trùng chuyển đổi, thiếu Primary Action chuẩn).
3. **Một Thư Mục Làm Việc Riêng Cho Mỗi Doanh Nghiệp (`<workdir>`):** Toàn bộ `account-context.yaml`, báo cáo `audits/`, `plans/`, `builds/`, `changes/` lưu gọn trong thư mục dự án của khách hàng/doanh nghiệp theo [`workspace-layout.md`](./skills/google-ads-shared/references/workspace-layout.md); tuyệt đối không ghi dữ liệu khách hàng hay lưu raw API Token/Secret vào thư mục `google-ads-master`.
4. **Khóa An Toàn Khi Triển Khai (`Pusher Safety Guard`):** Mọi chiến dịch mới xuất qua `pusher` bắt buộc để trạng thái `PAUSED`, kiểm tra qua `validate_spec.py` / `validate_changeset.py` (`Exit code 0`) và phải có xác nhận phê duyệt của người dùng trước khi áp dụng.
5. **Nạp Lười Tiết Kiệm Token (`Lazy Section Loading`):** Chỉ đọc đúng bộ skill thành phần hoặc đoạn dòng `L_start..L_end` qua `agy_read_skill_section` (MCP `agy-skill-hub`) tương ứng với bước người dùng đang yêu cầu.
