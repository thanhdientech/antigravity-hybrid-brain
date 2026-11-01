# Khung Checklist 8 Ngành Trọng Điểm, Công Nghệ Khuyến Nghị & Bảng Ánh Xạ 93 Skills

Tài liệu này giúp `project-blueprint-architect` thẩm định không sót bất kỳ góc khuất nghiệp vụ nào của **8 lĩnh vực cốt lõi** và ánh xạ chính xác từng giai đoạn thực thi vào đúng các bộ **Skills trong tổng số 93 Skills** đang cài sẵn trên hệ thống.

---

## Ngành 1: Dự Án Phần Mềm, Web App, Mobile App, Automation & AI Agent

### A. Checklist Điểm Mù Bắt Buộc Hỏi & Chốt
- **Vai trò người dùng & Phân quyền (`RBAC`):** Có mấy nhóm tài khoản (Admin, Nhân viên, Khách hàng)? Ai được xem, tạo, sửa, xóa dữ liệu nào? Nút nào ẩn hẳn, nút nào `Disabled + Tooltip`?
- **Kiến trúc & Môi trường chạy:** Chạy Web App thao tác chức năng (`Operate Mode` SSR/SPA), Desktop (`.exe`/Electron/WinUI), Mobile (`Android / iOS`), CLI script hay Workflow ngầm (`n8n` / Scheduled Task)?
- **Mô hình Dữ liệu & Lưu trữ:** Các thực thể chính (Bảng/Collection), vòng đời trạng thái (`Draft -> Pending -> Approved`), khối lượng bản ghi dự kiến, nhu cầu tìm kiếm toàn văn tiếng Việt?
- **Tích hợp bên thứ 3:** Webhook, Zalo/Telegram/Email, Cổng thanh toán VietQR, OAuth2, hay dịch ngược API từ phần mềm cũ?
- **Luồng UX `URL-as-State` & 8 Trạng thái UI bắt buộc:** Đồng bộ Filter/Search/Tab/Page/Drawer lên URL Query Params; đủ 8 trạng thái (`Default`, `Hover`, `Focus-Visible`, `Active`, `Disabled`, `Loading Skeleton`, `Actionable Empty State`, `Error Recovery`).

### B. Công Nghệ Chuẩn & Ánh Xạ Skill Thực Thi
| Giai Đoạn (Phase) | Công Nghệ / Tiêu Chuẩn Đề Xuất | Skill Chính Xác Cần Gọi (Trong 93 Skills) |
| :--- | :--- | :--- |
| **P0. Khảo sát / Bóc tách phần mềm mẫu (nếu có)** | REA Static/Dynamic Decompilation, HAR/API trace | `reverse-engineer-anything` |
| **P1. Kiến trúc Luồng UX Web App/Admin & Design System** | `Operate Mode`, `URL-as-State`, CRUD Table/Form/Drawer, Next.js/React + Tailwind + `shadcn/ui`, `audit_webapp_ux.py` | `webapp-app-ux-workflow`, `ui-ux-design-pro-max`, `generative_ui`, `gsap-skills` |
| **P2. Xây dựng Mobile App & Điều hướng Bản địa (nếu có)** | Stateful Bottom Tabs/Stack/Sheet, Kotlin Jetpack Compose / React Native / Flutter, Android SDK CLI | `webapp-app-ux-workflow`, `android-cli`, `android-device-hub`, `compose-preview` |
| **P3. Lập trình Backend, DB & Tác vụ tự động** | FastAPI / Node.js / Python, SQLite WAL / PostgreSQL / MS SQL | `lean-teamwork`, `automation`, `antigravity-guide` |
| **P4. Kiểm toán Logic UI, Responsive Mobile, Bảo mật & Nghiệm thu** | CDP 3-Viewport UI Audit (`375/768/1440px`), OWASP ASVS, iFixAi (`Grade A`) | `ui-ux-cro-auditor`, `security-audit`, `ifixai-agent-auditor` |

---

## Ngành 2: Dự Án Website Doanh Nghiệp, Landing Page Chuyển Đổi & Thương Hiệu

### A. Checklist Điểm Mù Bắt Buộc Hỏi & Chốt
- **Mục tiêu chuyển đổi số 1 (`Primary Conversion Goal`):** Thu Lead điền form, Thanh toán ngay qua QR VietQR, Đặt lịch hẹn, hay Giới thiệu hồ sơ năng lực B2B?
- **Nền tảng vận hành mong muốn:** 1 File HTML siêu tốc tĩnh, Nền tảng kéo-thả Webcake (`.pke`), hay Hệ quản trị WordPress Theme Flatsome 3.x?
- **Hệ nhận diện thương hiệu (`Brand Assets`):** Đã có Logo vector `.svg`, bảng mã màu HEX, font chữ thương hiệu và bộ ảnh sản phẩm thật chưa?
- **Đo lường quảng cáo (`Tracking & Privacy`):** Có gắn Meta Pixel + CAPI / TikTok Events API / Google Tag qua Backend Webhook không? Các trang Chính sách bảo mật / Điều khoản đã đủ chuẩn duyệt Ads chưa?

### B. Công Nghệ Chuẩn & Ánh Xạ Skill Thực Thi
| Giai Đoạn (Phase) | Công Nghệ / Tiêu Chuẩn Đề Xuất | Skill Chính Xác Cần Gọi (Trong 93 Skills) |
| :--- | :--- | :--- |
| **P1. Chân dung khách hàng & Thông điệp bán hàng** | Value Proposition 9 phần + 14 công thức Copywriting | `chan-dung-khach-hang-9-phan`, `cong-thuc-viet-content-by-noti-v4` |
| **P2. Thiết kế Logo SVG, CIP, Banner & Hồ sơ PDF** | Geometric SVG, Paged CSS `@page` / Typst xuất PDF A4 | `brand-editorial-graphic-studio` |
| **P3A. Dựng Landing Page HTML + VietQR + CAPI** | HTML5/CSS3 Liquid Glass, 138 SVG inline, Backend Webhook CAPI | `design-landingpage-vip-v2`, `gsap-skills` |
| **P3B. Hoặc chuyển sang Webcake / WordPress Flatsome** | File `.pke` Webcake (`420px/960px`) hoặc Flatsome UX Shortcodes | `html-to-webcake` hoặc `wordpress-flatsome-designer` |
| **P4. Kiểm toán CRO Trang đích, Mobile UI, SEO & Bảo mật Frontend** | CRO 7-Dimension, CDP 3-Viewport, CWV/WCAG 2.2 AA, Schema JSON-LD, Không lộ Token JS | `ui-ux-cro-auditor`, `claude-seo`, `security-audit` |

---

## Ngành 3: Dự Án SEO Tổng Thể & Tối Ưu Hóa Công Cụ Tìm Kiếm AI (GEO / AI Overviews)

### A. Checklist Điểm Mù Bắt Buộc Hỏi & Chốt
- **Hiện trạng tên miền:** Website mới tinh hay đã chạy lâu năm? Đã có dữ liệu Google Search Console / Sitemap / `robots.txt` chưa?
- **Loại hình SEO mục tiêu:** Local SEO (Google Maps / Địa phương), E-commerce SEO (Danh mục & Sản phẩm), B2B SaaS/ERP SEO, hay tối ưu để được trích dẫn trên AI Search (ChatGPT, Gemini AI Overviews, Perplexity — GEO)?
- **Tín hiệu Chuyên gia (`E-E-A-T`) & Nguồn xác thực:** Ai là tác giả chuyên môn đứng tên? Có số liệu thực tế và tài liệu tham chiếu chuẩn xuất bản chưa?

### B. Công Nghệ Chuẩn & Ánh Xạ Skill Thực Thi
| Giai Đoạn (Phase) | Công Nghệ / Tiêu Chuẩn Đề Xuất | Skill Chính Xác Cần Gọi (Trong 93 Skills) |
| :--- | :--- | :--- |
| **P1. Kiểm toán Technical SEO, CWV & Kiến trúc URL** | LCP `< 2.5s`, INP `< 200ms`, CLS `< 0.1`, Crawlability, `llms.txt` | `claude-seo` |
| **P2. Quy hoạch Cụm Chủ đề & Nguồn Thực Chứng** | Topic Clusters, Kiểm tra link `HTTP 200` / DOI / Văn bản gốc | `claude-seo`, `verified-source-researcher` |
| **P3. Cài đặt Dữ liệu có cấu trúc Schema JSON-LD** | Organization, Product, FAQPage, Article, LocalBusiness JSON-LD | `claude-seo`, `wordpress-flatsome-designer` |
| **P4. Nghiệm thu Điểm SEO / GEO & Chống Ảo Giác** | Chuẩn trình bày nguồn 3 tầng sạch, iFixAi Audit | `ifixai-agent-auditor` |

---

## Ngành 4: Dự Án Marketing, Quảng Cáo Đa Kênh (Google/FB/TikTok/Shopee) & Video AI

### A. Checklist Điểm Mù Bắt Buộc Hỏi & Chốt
- **Đơn vị kinh tế (`Unit Economics`):** Giá bán sản phẩm, Giá vốn (`COGS`), Biên lợi nhuận gộp, CPA hòa vốn / ROAS mục tiêu tối thiểu là bao nhiêu? *(Cấm chạy Ads khi chưa tính điểm hòa vốn)*.
- **Hạ tầng Đo lường (`Measurement Gate`):** Conversion Tracking / Enhanced Conversions / Server-side CAPI đã chống đếm trùng (`event_id` deduplication) chưa?
- **Kênh phân phối & Định dạng nội dung:** Google Search / PMax, Facebook Reels/Ads, TikTok, YouTube Dài/Shorts, hay Video Tiếp thị liên kết Shopee 9:16?

### B. Công Nghệ Chuẩn & Ánh Xạ Skill Thực Thi
| Giai Đoạn (Phase) | Công Nghệ / Tiêu Chuẩn Đề Xuất | Skill Chính Xác Cần Gọi (Trong 93 Skills) |
| :--- | :--- | :--- |
| **P1. Nghiên cứu Khách hàng & Đóng gói Sản phẩm/Offer** | Chân dung 9 phần, Chiến lược 3 vòng tròn sản phẩm số | `chan-dung-khach-hang-9-phan`, `tao-san-pham-so-bang-ai` |
| **P2. Sản xuất Copywriting, Ảnh Banner & Báo giá** | 14 công thức Noti v4, Banner `<20%` text safe-zone | `cong-thuc-viet-content-by-noti-v4`, `brand-editorial-graphic-studio` |
| **P3. Setup / Tối ưu Google Ads & CRO Trang đích** | GAQL Audit A1–A14, Keyword Planner 6 sheets, Editor CSV `PAUSED` | `google-ads-master`, `design-landingpage-vip-v2` |
| **P4. Sản xuất Phim AI, Hoạt hình, Video Shopee & Đăng kênh** | Veo 3 / Seedance, `p5.brush`, Three.js, Recordly `.SRT`, CDP Auto-post | `lam-phim-video-master`, `video-storytelling`, `cinematic-video-prompt`, `painted-animation`, `kinetic-reel`, `create-and-edit-video`, `recordly-tutorial-ai`, `shopee-affiliate-video-studio`, `yt-shortcode-commander`, `antigravity-browser-controller` |

---

## Ngành 5: Dự Án Bảo Mật Ứng Dụng (AppSec), Dịch Ngược & Kiểm Toán Hệ Thống

### A. Checklist Điểm Mù Bắt Buộc Hỏi & Chốt
- **Phạm vi & Quyền hạn hợp pháp (`Rules of Engagement`):** Kiểm tra White-box trên kho mã nguồn nội bộ, Black-box/Gray-box trên tệp đóng gói (`.exe`, `.asar`, `.apk`), hay rà soát rò rỉ thông tin trước khi Public lên GitHub?
- **Bề mặt tấn công (`Attack Surface`) & Tài sản nhạy cảm:** Cổng xác thực JWT/Session, Upload file, Truy vấn SQL động, SSRF/Webhook, Hardcoded Secrets/API Keys, phân quyền đa người thuê (`Multi-tenant IDOR`).

### B. Công Nghệ Chuẩn & Ánh Xạ Skill Thực Thi
| Giai Đoạn (Phase) | Công Nghệ / Tiêu Chuẩn Đề Xuất | Skill Chính Xác Cần Gọi (Trong 93 Skills) |
| :--- | :--- | :--- |
| **P1. Lập Sổ cái Bao phủ (`Coverage Ledger`) & Threat Model** | Liệt kê 100% file/endpoint trong phạm vi để chống bỏ sót | `security-audit` |
| **P2. Dịch ngược tệp nhị phân / Gói đóng gói (nếu không có source)** | REA CLI/MCP (`app.asar`, `.NET`, `PyInstaller`, `.apk`, `Ghidra`) | `reverse-engineer-anything` |
| **P3. Quét chuyên sâu các lớp lỗ hổng & Đối chứng PoC** | `ATTACK-CLASSES.md`, `validate-findings.cjs`, `validate-coverage-ledger.cjs` | `security-audit` |
| **P4. Kiểm toán hành vi AI Agent / Prompt Injection** | 60 bài test iFixAi 5 trụ cột, xuất Scorecard `A–F` | `ifixai-agent-auditor`, `credentials` |

---

## Ngành 6: Dự Án Server, VPS, Hạ Tầng Mạng, Triển Khai & Sao Lưu

### A. Checklist Điểm Mù Bắt Buộc Hỏi & Chốt
- **Hệ điều hành & Cấu hình tài nguyên:** Ubuntu LTS / Debian / Windows Server? Số vCPU, RAM, dung lượng NVMe, băng thông và vị trí Datacenter (Việt Nam / Singapore...)?
- **Kiến trúc Mạng & Bảo mật Lớp Vỏ (`Hardening`):** Reverse Proxy (Nginx / Caddy / Cloudflare Tunnel), chứng chỉ SSL/TLS tự động, đóng cổng SSH mặc định / chỉ dùng SSH Key, Firewall (`UFW` / Windows Firewall), mạng riêng VPN (`WireGuard` / `OpenVPN`) cho cổng Database (`1433`, `5432`, `30015`)?
- **Chiến lược Sao lưu `3-2-1` & Phục hồi Thảm họa (`RPO / RTO`):** Tần suất backup DB/File tự động, mã hóa bản sao lưu đẩy ra lưu trữ ngoài máy chủ, đã diễn tập `Restore` thật chưa?
- **Giám sát & Tự khởi động lại:** Docker Compose (`restart: unless-stopped`) hay `systemd` / Windows Service? Giới hạn dung lượng Log (`logrotate`) chống đầy ổ đĩa 100%?

### B. Công Nghệ Chuẩn & Ánh Xạ Skill Thực Thi
| Giai Đoạn (Phase) | Công Nghệ / Tiêu Chuẩn Đề Xuất | Skill Chính Xác Cần Gọi (Trong 93 Skills) |
| :--- | :--- | :--- |
| **P1. Quy hoạch Topology mạng, Cổng dịch vụ & Sizing** | Sơ đồ Mermaid kiến trúc mạng, phân tách Public vs Private Subnet | `project-blueprint-architect`, `verified-source-researcher` |
| **P2. Đóng gói Dịch vụ, Reverse Proxy, Firewall & Backup** | Docker Compose / Systemd / PowerShell, TLS, Cron Backup 3-2-1 | `lean-teamwork`, `automation` |
| **P3. Rà soát Lỗ hổng Cấu hình, Lộ Port & Bí mật `.env`** | Kiểm tra phân quyền file, Secret Shield, Exposure Audit | `security-audit`, `credentials`, `ifixai-agent-auditor` |

---

## Ngành 7: Dự Án ERP SAP Business One, Boyum Beas Manufacturing, SQL & Kế Toán

### A. Checklist Điểm Mù Bắt Buộc Hỏi & Chốt
- **Định danh Môi trường & Hệ quản trị CSDL:** Server nào, tên Database chính xác là gì (Production hay Test/Sandbox)? Chạy trên **MS SQL Server (`T-SQL`)** hay **SAP HANA (`SQLScript`)**? Phiên bản SAP B1 `9.3` hay `10.0`? Có cài phân hệ sản xuất **Boyum Beas** không?
- **Chế độ Kế toán Áp dụng:** Kỳ hạch toán thuộc giai đoạn áp dụng **Thông tư 99/2025/TT-BTC** (từ `01/01/2026`) hay **Thông tư 200/2014/TT-BTC** (trước `2026`)?
- **Thiết luật Bảo hành Hãng SAP:** Tuyệt đối **KHÔNG `UPDATE / INSERT / DELETE` trực tiếp vào bảng chuẩn SAP B1** (`OINV`, `ORDR`, `OWOR`, `OJDT`, `OINM`...). Mọi thao tác ghi dữ liệu phải đi qua **Service Layer REST API / DI API / DTW**, còn chặn kiểm soát nghiệp vụ đặt tại `SBO_SP_TransactionNotification`.

### B. Công Nghệ Chuẩn & Ánh Xạ Skill Thực Thi
| Giai Đoạn (Phase) | Công Nghệ / Tiêu Chuẩn Đề Xuất | Skill Chính Xác Cần Gọi (Trong 93 Skills) |
| :--- | :--- | :--- |
| **P1. Thiết kế Quy trình Nghiệp vụ Sản xuất, Kho & Giá thành** | Chuẩn SAP B1 + Boyum Beas, đối chiếu `OINM - OJDT`, `WIP 154`, TT 99/2025 | `sap-b1-beas`, `verified-source-researcher` |
| **P2. Viết Truy vấn Báo cáo, FMS & TransactionNotification** | Chuẩn nối `DocEntry/BaseEntry/BaseType`, 323 mẫu SQL thực chiến | `viet-sql-sap-b1` |
| **P3. Chạy Khớp Số Thực Tế Read-Only & Xuất Báo Cáo** | Kết nối `Strict Read-Only`, kiểm tra $\sum \text{Nợ} = \sum \text{Có}$, xuất `.xlsx/.pdf` | `sql-sap-b1` |
| **P4. Quay Video Hướng Dẫn Người Dùng Cuối (End-User SOP)** | Quay màn hình thao tác + Giọng đọc AI + Phụ đề `.SRT` tự động | `recordly-tutorial-ai`, `brand-editorial-graphic-studio` |

---

## Ngành 8: Dự Án Học Tập, Nghiên Cứu Khoa Học / Y Sinh, Viết Sách & Tạo Khóa Học

### A. Checklist Điểm Mù Bắt Buộc Hỏi & Chốt
- **Mục tiêu đầu ra của việc học / nghiên cứu:** Tổng quan tài liệu học thuật (*Literature Review*), phân tích dữ liệu Y Sinh / Gen / Protein, chưng cất sách chuyên khảo dài thành Skill cho AI nhớ vĩnh viễn, hay đóng gói thành Ebook / Slide bài giảng / Khóa học thương mại?
- **Chuẩn độ tin cậy nguồn trích dẫn:** Bắt buộc nguồn học thuật Tier 1–2 có mã **DOI, PMID, PMCID, arXiv ID, UniProt ID, rsID, ISBN** thật 100% (cấm bịa trích dẫn).

### B. Công Nghệ Chuẩn & Ánh Xạ Skill Thực Thi
| Giai Đoạn (Phase) | Công Nghệ / Tiêu Chuẩn Đề Xuất | Skill Chính Xác Cần Gọi (Trong 93 Skills) |
| :--- | :--- | :--- |
| **P1. Truy xuất Văn헌 Khoa học Mở Quốc tế** | PubMed, EuropePMC, OpenAlex, arXiv, bioRxiv/medRxiv | `pubmed-database`, `literature-search-openalex`, `literature-search-europepmc`, `literature-search-arxiv`, `literature-search-biorxiv`, `verified-source-researcher` |
| **P2. Phân tích Y Sinh học, Hệ Gen, Protein 3D & Dược phẩm** | AlphaFold, PDB, Mol* 3D Sidecar, UniProt, ClinVar, gnomAD, ChEMBL, OpenFDA, ClinicalTrials | `alphafold-database-fetch-and-analyze`, `pdb-database`, `biomolecular-structure-viewer`, `uniprot-database`, `clinvar-database`, `gnomad-database`, `chembl-database`, `pubchem-database`, `openfda-database`, `clinical-trials-database` *(và cụm 27 DB `science`)* |
| **P3. Nạp Sách / Giáo trình vào Bộ Não Lai Antigravity** | Chưng cất 3-Pass, Heading song ngữ, đánh chỉ mục FTS5 + RRF | `nap-tai-lieu-antigravity` |
| **P4. Biên soạn Ebook, Workbook, Google Docs/Slides & PDF In ấn** | Lộ trình 7 ngày sản phẩm số, Google Workspace, Typst/Paged CSS A4 | `tao-san-pham-so-bang-ai`, `brand-editorial-graphic-studio`, `gdocs`, `gsheets`, `gslides`, `gdrive` |
