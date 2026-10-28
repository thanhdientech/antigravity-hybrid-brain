# Bản Đồ Tổng Quan Chuỗi 18 Module Google Ads v3, 12 Bộ Skill & 4 Hợp Đồng Dữ Liệu JSON/YAML

Tài liệu này chưng cất nguyên văn 100% từ tệp điều phối `resources/Skill.xlsx` và cấu trúc 4 hợp đồng dữ liệu chuẩn (`account-context.yaml`, `audit-result.json`, `campaign-spec.json`, `change-set.json`) trong `skills/google-ads-shared/templates/`.

## 1. Nguyên Tắc Sử Dụng Chuỗi Lắp Ráp Liên Tục 18 Module Google Ads (v3 — Sheet 1 `Skill.xlsx`)

Quy tắc phối hợp đầu vào/đầu ra xuyên suốt 18 module triển khai Google Ads thực chiến (từ nghiên cứu từ khóa Keyword Planner đến tối ưu Search, Broad Match AI Signal, Performance Max và Demand Gen Lookalike):

- 📐 Nguyên tắc sử dụng tài liệu
- Chuỗi lắp ráp liên tục theo đúng 18 module gốc. Mỗi bước dùng output bước trước làm input.
- NhãnSKILL= dùng skill nội bộ có sẵn (keyword-analysis / google-ads-plan), không dùng prompt thô
- NhãnMỞ KHÓA= bước này chính thức "giải mã" 1 bài học bị khóa (🔒) ở Level trước
- Mỗi bước ghi rõ mã Module gốc (VD: Module 5.1-5.2) để đối chiếu video khóa học
- Mục "🔓 Audit Upsell" cuối trang liệt kê đủ 11 bài khóa và bước nào resolve nó — dùng để tự kiểm tra tính liên tục
- ⚠️ Đã sửa trong v3
- (1) Bổ sung đầy đủ Module 05 — Tối ưu Chiến Dịch Search & Đấu Thầu (Bước 11-12) bị thiếu hoàn toàn ở v2.
- (2) Audit lại toàn bộ 11 bài học khóa xuyên Level — phát hiện 2 bài chưa được resolve rõ ràng ở v2: Bài 3.5 (Broad Match + AI Signal, nay resolve ở Bước 19 — Module 11.4) và Bài 10.4 (Demand Gen Lookalike + YouTube Integration, nay resolve ở Bước 23 — Module 14.3). Cả 2 đã được bổ sung rõ ràng.
- (3) Bổ sung bài "⭐ đặc biệt" nội bộ Level 3 (Module 14.5 và 16.5) — không phải upsell qua level khác nhưng là nội dung cao cấp dễ bị bỏ sót.
- ⚙️ Về 2 skill nội bộ: keyword-analysis — input CSV export trực tiếp từ Google Keyword Planner, phân loại theo 3 giai đoạn hành trình dựa trên search volume/CPC thật. google-ads-plan — lập ngân sách theo 3 giai đoạn hành trình, dùng trực tiếp output của keyword-analysis (sheet Tổng Hợp Ngân Sách) làm nguồn duy nhất, không tự tính lại bằng benchmark chung chung.

## 2. Bảng Phân Vai 5 Nhóm Chức Năng Của 12 Bộ Skill Google Ads & CRO (Sheet 2 `Skill.xlsx`)

Bảng định tuyến chi tiết nhiệm vụ và đầu ra chuẩn của từng bộ skill thành phần trong Siêu Hub `google-ads-master`:

| Nhóm Chức Năng | Tên Skill Thành Phần | Đường Dẫn Nội Bộ | Nhiệm Vụ Cốt Lõi | Đầu Ra Chuẩn (Output) |
| :--- | :--- | :--- | :--- | :--- |
| 📦 Thư Viện 20 Skill — Tải Về & Sử Dụng | **`google-ads-shared BẮT BUỘC`** | [`skills/google-ads-shared/SKILL.md`](../skills/google-ads-shared/SKILL.md) | Không phải skill để "gọi" — chứa tài liệu tham chiếu dùng chung (playbook chẩn đoán A1–A14, quy tắc tối ưu, mẫu file) mà 19 skill kia đọc vào. | Không có output riêng |
| 📦 Thư Viện 20 Skill — Tải Về & Sử Dụng | **`google-ads-setup`** | [`skills/setup/SKILL.md`](../skills/setup/SKILL.md) | Dò tài khoản qua MCP, hỏi/lấy margin, brand terms, ngân sách, kết nối store/GA4 nếu có. | File account-context.yaml |
| 📦 Thư Viện 20 Skill — Tải Về & Sử Dụng | **`google-ads (router)`** | [`skills/google-ads/SKILL.md`](../skills/google-ads/SKILL.md) | Đọc tình trạng tài khoản, tự quyết định bước tiếp theo trong vòng đời: setup → measurement → audit → plan → build. | Không có output riêng, chỉ điều hướng |
| 🔍 Nhóm chẩn đoán — chỉ đọc, an toàn tuyệt đối | **`google-ads-audit`** | [`skills/audit/SKILL.md`](../skills/audit/SKILL.md) | Chấm điểm sức khỏe toàn tài khoản: tracking, lãng phí ngân sách, cấu trúc campaign, Quality Score. | AUDIT.html + file .md |
| 🔍 Nhóm chẩn đoán — chỉ đọc, an toàn tuyệt đối | **`toi-uu-chuyen-doi-web`** | [`skills/toi-uu-chuyen-doi-web/SKILL.md`](../skills/toi-uu-chuyen-doi-web/SKILL.md) | Audit landing page theo CRO: message match, 3-second test, trust signal, page speed, so sánh đối thủ. | Dashboard HTML + Quick Wins |
| 🔍 Nhóm chẩn đoán — chỉ đọc, an toàn tuyệt đối | **`google-ads-measurement`** | [`skills/measurement/SKILL.md`](../skills/measurement/SKILL.md) | Kiểm tra conversion tracking: phân loại action, phát hiện double-count, đối chiếu Ads/GA4/Store. | Verdict PASS/WARN/FAIL |
| 📋 Nhóm lập kế hoạch — ra file đề xuất | **`keyword-analysis`** | [`skills/keyword-analysis/SKILL.md`](../skills/keyword-analysis/SKILL.md) | Phân nhóm từ khóa theo hành trình khách hàng (L1→L2→L3), tính ngân sách Google Ads. | File .xlsx 6 sheet |
| 📋 Nhóm lập kế hoạch — ra file đề xuất | **`google-ads-plan`** | [`skills/plan/SKILL.md`](../skills/plan/SKILL.md) | Lập ngân sách, chọn loại campaign, dự báo conversion/CPA/ROAS — bắt buộc lấy từ khóa thật. | GOOGLE-ADS-PLAN.md |
| 📋 Nhóm lập kế hoạch — ra file đề xuất | **`google-ads-builder-search`** | [`skills/builder-search/SKILL.md`](../skills/builder-search/SKILL.md) | Thiết kế campaign Search: ad group, từ khóa, match type, RSA, negative list. | File .xlsx + campaign-spec.json |
| 📋 Nhóm lập kế hoạch — ra file đề xuất | **`google-ads-assets`** | [`skills/assets/SKILL.md`](../skills/assets/SKILL.md) | Viết headline/description RSA, copy PMax, sitelink, callout — đúng brand voice. | Văn bản copy sẵn dùng |
| ⚙️ Nhóm hành động — phân tích sâu, đề xuất thay đổi thật | **`google-ads-optimizer`** | [`skills/optimizer/SKILL.md`](../skills/optimizer/SKILL.md) | Phân hạng campaign, tìm từ khóa lãng phí, đề xuất đổi ngân sách/target ROAS. | change-set.json (đề xuất) |
| 🚀 Skill duy nhất thực sự ghi vào tài khoản | **`google-ads-pusher`** | [`skills/pusher/SKILL.md`](../skills/pusher/SKILL.md) | Nhận spec/change-set từ các skill khác, kiểm tra an toàn, áp dụng thật. Campaign luôn tạo PAUSED. | File Editor import hoặc thay đổi thật |

## 3. Đặc Tả 4 Hợp Đồng Dữ Liệu Máy Đọc (JSON/YAML Contracts — `account-context`, `audit-result`, `campaign-spec`, `change-set`)

Toàn bộ 12 skill trong hệ sinh thái Google Ads giao tiếp với nhau qua 4 tệp mẫu chuẩn đặt tại `skills/google-ads-shared/templates/` (lưu trong thư mục làm việc riêng `<workdir>` của từng doanh nghiệp/tài khoản, tuyệt đối không ghi đè vào thư mục skill):

1. **`account-context.yaml`** (`skills/google-ads-shared/templates/account-context.yaml`):
   - Hồ sơ gốc của tài khoản Google Ads do `setup` sinh ra và `validate_context.py` kiểm định.
   - Chứa Customer ID, MCC Login ID, Conversion Actions, GA4/GMC/Store pointers (chỉ lưu con trỏ `via: env:...` hoặc `via: mcp:...`, cấm lưu raw token/secret), Brand Terms, Competitor Terms, Biên lợi nhuận (`margin_tiers`) và Guardrails ngân sách.
2. **`audit-result.json`** (`skills/google-ads-shared/templates/audit-result.json`):
   - Kết quả chấm điểm sức khỏe tài khoản từ `audit` theo 14 nhóm chẩn đoán rò rỉ tiền (`A1–A14 Money-Leak Engine`), truyền sang `plan`, `optimizer` và `money_leak_report.py` để xuất `AUDIT.html`.
3. **`campaign-spec.json`** (`skills/google-ads-shared/templates/campaign-spec.json`):
   - Hợp đồng dựng chiến dịch mới từ `builder-search` (nhánh `ad_groups[]`) hoặc PMax (`asset_groups[]`) chuyển sang `pusher` (`validate_spec.py`, `spec_to_editor_csv.py`, `spec_to_paste.py`, `spec_to_pmax_checklist.py`) và `scripts/spec_to_xlsx.py`.
   - Bắt buộc `campaign.status = "paused"` — không bao giờ tự động bật chiến dịch tiêu tiền khi chưa có phê duyệt của người dùng.
4. **`change-set.json`** (`skills/google-ads-shared/templates/change-set.json`):
   - Hợp đồng đề xuất tối ưu tài khoản đang chạy từ `optimizer` chuyển sang `pusher` (`validate_changeset.py`, `changeset_to_actions.py`).
   - Áp dụng khóa kỷ luật an toàn: Cooldown sau thay đổi gần nhất, biên độ điều chỉnh ngân sách `±10%`, bước nhảy `tROAS <= 0.3x`, cấm chặn nhầm Brand Terms, và PMax ưu tiên tạm dừng thay vì cắt sốc ngân sách.
