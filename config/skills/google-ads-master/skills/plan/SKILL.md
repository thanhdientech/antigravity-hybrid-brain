---
name: google-ads-plan
description: >
  Plans a Google Ads launch or expansion: how to split budget, which campaign types to run (Search,
  Branded Search, Performance Max, Demand Gen) and in what order, expected conversions/CPA/ROAS given
  budget and AOV, and a phased ramp roadmap. Reads context + audit + measurement; forecasts from real
  account data when available, benchmarks when not. Use when the user says "plan", "budget", "what
  campaigns should I run", "how should I launch Google Ads", "media plan", "campaign mix", "forecast".
---

# Google Ads — Plan

Turn a budget + business context into a concrete plan and an honest forecast. Read everything from the
context and the audit/measurement outputs — no hardcoding, no guessing where data exists.

## STEP 0 — Load context + GATE
1. Read `account-context.yaml` (budget, AOV, margin_tiers, brand_terms, vertical, guardrails) and the
   latest `audit` + `measurement` outputs from the working directory.
   **If the context is missing, run `setup` first — never plan spend without it.**
2. **Measurement gate**: if `measurement` = FAIL, STOP — do not plan spend on broken tracking. Tell the
   user to fix tracking first. WARN is allowed but carried into the plan as a risk note.
3. Confirm `campaign_defaults.daily_budget` (or ask). Output is written to the working directory.

## Model dispatch (run cheap, decide expensive) — see `~/.gemini/config/skills/google-ads-master/skills/google-ads-shared/references/model-tier-dispatch.md`
- **Scout (`haiku`)** — the `forecaster.py` run; reading existing campaign budgets.
- **Routine (`sonnet`)** — STEP 1 mode-detection pull (existing campaigns + spend), STEP 4 deriving CPC/CVR from account data. Dispatch as `general-purpose` sub-agents; **return raw, don't decide the mode**.
- **Judge (main session)** — STEP 0 measurement gate, the campaign mix + sequencing, budget split, forecast interpretation (band not promise), ramp roadmap, risks. The data is cheap; the plan is judgment.

## STEP 1 — Detect mode: LAUNCH vs EXPANSION (mỗi nhóm có nguồn từ khóa BẮT BUỘC riêng)
Read existing ENABLED campaigns + their spend/performance. The plan differs sharply — và quan trọng hơn,
**nguồn từ khóa dùng để tính ngân sách/campaign mix khác nhau hoàn toàn giữa 2 nhóm, không được trộn lẫn
hay tự đoán khi thiếu**.

### Nhóm 1 — LAUNCH (tài khoản mới / chưa đủ dữ liệu chi tiêu đáng tin)
Điều kiện: không có campaign ENABLED nào, hoặc có nhưng chưa đủ ~30 ngày dữ liệu / chưa đủ conversion để
tin cậy.

**BẮT BUỘC — GATE cứng, không được bỏ qua:**
1. Kiểm tra xem đã có output của skill `keyword-analysis` (file `.xlsx` 6 sheet) chưa.
2. **Nếu chưa có** — DỪNG lại ngay tại đây. Yêu cầu Sếp upload file từ khóa (Google Keyword Planner/
   Ahrefs/SEMrush) và chạy skill `keyword-analysis` trước. **Không tự đoán từ khóa, không tự lập ngân
   sách bằng benchmark chung chung khi có đường để lấy dữ liệu thật.**
3. **Nếu đã có** — đọc trực tiếp:
   - **Sheet "Tổng Hợp Ngân Sách"** → lấy nguyên cột Ngân Sách/Chuyển Đổi đã tính sẵn theo từng nhóm
     L1/L2, KHÔNG tự tính lại bằng CPC/CVR benchmark khác.
   - **Sheet "Thống Kê Giai Đoạn"** → lấy tỷ lệ phân bổ ngân sách theo 3 giai đoạn (Mua Hàng/Cân Nhắc/
     Quan Tâm) làm căn cứ chia ngân sách campaign, ưu tiên nhóm **Đa Ý Định (Multi-Intent)** vì CR thực
     tế cao (50-60% theo phương pháp luận của keyword-analysis).
4. Mọi con số ngân sách trong plan phải trích dẫn được nguồn: *"Ngân sách nhóm [tên L1] = [số tiền] (theo
   sheet Tổng Hợp Ngân Sách, file keyword-analysis)"*.
5. **Handoff cho `builder-search`**: gửi nguyên cấu trúc L1 → L2 (kèm danh sách từ khóa trong từng nhóm)
   — không rút gọn, không đổi tên nhóm, không gộp lại.

### Nhóm 2 — EXPANSION (đã có tài khoản + đủ dữ liệu chi tiêu)
Điều kiện: có campaign ENABLED, đủ ~30-90 ngày dữ liệu, có volume conversion đáng kể. **Read the real
budget scale, don't assume small** (e.g. a mature account may run $1k+/day across many campaigns).
Recommend additions/reallocations against what already exists, not a from-scratch structure.

**Nguồn từ khóa BẮT BUỘC — search-term thật của tài khoản, cả 2 nguồn:**
1. `search_term_view` (cụm tìm kiếm Search/Branded Search)
2. `campaign_search_term_insight` gọi riêng từng campaign PMax đang chạy (bao gồm catch-all)
3. Sau khi có danh sách search-term thô, **áp dụng đúng phương pháp phân nhóm L1→L2 theo insight của
   `keyword-analysis`** lên chính tập search-term này (không dừng ở danh sách phẳng, không nhóm theo thứ
   tự chữ). Nếu skill `keyword-analysis` đang được bật cùng, chuyển tập search-term này cho nó xử lý y
   hệt cách nó xử lý file Keyword Planner — input khác nhau, thuật toán nhóm insight giữ nguyên.
4. Ngân sách: derive CPC/CVR thật từ tài khoản (như STEP 4 bên dưới), NHƯNG phân bổ theo đúng cấu trúc
   L1/L2 vừa nhóm được — không tách rời khỏi nhóm từ khóa thật đã xuất hiện trong tài khoản.
5. **Handoff cho `builder-search`**: gửi cấu trúc L1/L2 (rút ra từ chính search-term thật) — đây chính là
   "harvest list" nói ở STEP 2 bên dưới, giờ đã có cấu trúc rõ ràng thay vì danh sách rời rạc.

### Nguyên tắc chung — ĐÓNG VÒNG LẶP, không tách rời giữa các skill
- `plan` không được tạo ngân sách/campaign mix tách rời khỏi nhóm từ khóa thực tế — **mọi con số ngân
  sách phải map được về đúng 1 nhóm L1/L2 có nguồn gốc rõ ràng** (từ Keyword Planner qua keyword-analysis,
  hoặc từ search-term thật qua keyword-analysis).
- `builder-search` khi nhận handoff từ `plan` PHẢI dùng đúng cấu trúc L1/L2 đó để dựng ad group — không
  tự nhóm lại từ đầu, không bỏ qua nhóm nào mà không giải thích lý do.

State which mode you detected and why.

## STEP 2 — Campaign mix (which types, in what order)
Use the vertical priority in `~/.gemini/config/skills/google-ads-master/skills/google-ads-shared/references/vertical-defaults.md` + what's missing in the account:
- ecommerce: PMax/Shopping → Branded Search → Search → Demand Gen.
- leadgen / saas / b2b: (Branded) Search → Search → Demand Gen.
Justify each: goal it serves (acquisition / defense / scale), and why now. Coordinate **Branded Search +
PMax brand exclusion** so they don't cannibalize (honor `pmax-brand-exclusion` guardrail).
- **Non-brand Search is a HARVEST/CONTROL layer on PMax discovery, not a from-scratch keyword bet.** Recommend
  it once PMax has *discovered* converting non-brand queries worth controlling (high volume/value/margin, or
  needing distinct messaging — check the dual-source search-term data: `search_term_view` +
  `campaign_search_term_insight` per PMax). If there's nothing proven to harvest yet, hold Search and let PMax
  keep discovering. When you do recommend it, hand `builder-search` the harvest list, not a category list.

## STEP 3 — Budget split + learning minimums
- Split the daily budget across chosen types by goal and expected efficiency.
- **Learning minimum**: each campaign / asset group / ad group needs ~15-30 conversions/month to exit
  learning. With a limited budget, run FEWER campaigns well rather than starving many. Compute the max
  number of campaigns/AGs the budget can actually feed and say so.
- Apply `margin_tiers`: high-margin lines can run at lower ROAS; reflect that in the split.

## STEP 4 — Forecast (derive, don't guess) — see `~/.gemini/config/skills/google-ads-master/skills/google-ads-shared/references/forecasting-and-benchmarks.md`
- **EXPANSION**: derive CPC and CVR from the account's own recent data; project
  clicks = budget / CPC, conversions = clicks × CVR, revenue = conversions × AOV, ROAS = revenue / spend,
  CPA = spend / conversions. Present as a band, not a point estimate.
- **LAUNCH**: use vertical benchmark bands; present WIDE ranges and label them estimates with stated
  assumptions. Never present a benchmark forecast as a promise.
- Always show the inputs (CPC, CVR, AOV, budget) **with their source**. If AOV is not verified from store
  data (context `connections.store = missing`), say so and label the revenue/ROAS line **UNVERIFIED —
  connect store for a real AOV**; use a clearly-flagged provisional only with the user's OK. Never present a
  guessed AOV as fact — it silently distorts every revenue/ROAS number downstream.
- Runnable helper: `python ~/.gemini/config/skills/google-ads-master/skills/plan/scripts/forecaster.py --budget B --cpc C --cvr R --aov A
  [--target-roas T]` → prints conv/revenue/ROAS/CPA bands + learning capacity (how many campaigns the
  budget can feed).

## STEP 5 — Ramp roadmap
Phase the bidding per `campaign_defaults.bidding_ramp` (e.g. Maximize Conversion Value with no target
during learning → Target ROAS once volume matures). Respect ramp discipline: don't set a target before
enough conversions; raise tROAS ≤0.3x per step with a wait between steps; honor `change-event-cooldown`.

## STEP 6 — Success criteria + risks
- Define what "working" means per campaign (target CPA/ROAS by phase, learning-exit timeline).
- List risks (measurement WARNs, thin budget vs learning minimum, seasonality).

## Output — `GOOGLE-ADS-PLAN.md` (to the working dir)
- Mode (launch/expansion) + rationale.
- Campaign mix + sequencing.
- Budget split table + max-campaigns-the-budget-can-feed.
- Forecast band with inputs shown.
- Ramp roadmap + success criteria + risks.
- **Hand off**: for each chosen campaign type, point to the matching `builder-*` skill.

## To build / refine later
- [x] Runnable forecaster (`scripts/forecaster.py`). Done.
