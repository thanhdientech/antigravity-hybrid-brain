import os
import json
import re

SKILLS_DIR = r"C:\Users\INFOASIA\.gemini\config\skills"

UPSTREAMS = {
    "agency-agents": {
        "title": "msitarzewski/agency-agents",
        "url": "https://github.com/msitarzewski/agency-agents",
        "type": "Open-Source Git Repo",
        "local_clone": r"E:\DIEN APP\Skill AI\agency-agents",
        "update_cmd": 'git -C "E:\\DIEN APP\\Skill AI\\agency-agents" pull'
    },
    "antigravity-browser-controller": {
        "title": "ChromeDevTools/devtools-protocol & Puppeteer",
        "url": "https://github.com/ChromeDevTools/devtools-protocol",
        "type": "CDP & Browser Automation",
        "local_clone": r"E:\DIEN APP\Skill AI\antigravity-browser-bridge",
        "update_cmd": "Cập nhật extension và CDP bridge script"
    },
    "brand-editorial-graphic-studio": {
        "title": "typst/typst (Chế bản PDF & In ấn hiện đại)",
        "url": "https://github.com/typst/typst",
        "type": "Open-Source Engine",
        "local_clone": r"C:\Users\INFOASIA\.gemini\config\skills\brand-editorial-graphic-studio",
        "update_cmd": "typst --version / cargo install --locked typst-cli"
    },
    "chan-dung-khach-hang-9-phan": {
        "title": "Strategyzer / Value Proposition Design",
        "url": "https://github.com/AlexOsterwalder/ValuePropositionDesign",
        "type": "Framework Nghiệp Vụ",
        "local_clone": r"C:\Users\INFOASIA\.gemini\config\skills\chan-dung-khach-hang-9-phan",
        "update_cmd": "Đồng bộ mẫu Canvas thấu cảm"
    },
    "cinematic-video-prompt": {
        "title": "ByteDance Seedance & Google DeepMind Veo",
        "url": "https://github.com/google-deepmind/veo",
        "type": "Cinematic AI Prompts",
        "local_clone": r"E:\DIEN APP\Skill AI\opus-video-skills",
        "update_cmd": "Cập nhật từ điển thuật ngữ DoP"
    },
    "claude-seo": {
        "title": "coreyhaines31/marketingskills (SEO Engine)",
        "url": "https://github.com/coreyhaines31/marketingskills",
        "type": "Open-Source Git Repo",
        "local_clone": r"C:\Users\INFOASIA\.gemini\config\skills\claude-seo",
        "update_cmd": "Kiểm tra 62 scripts audit SEO"
    },
    "craft-anything": {
        "title": "storytold/craft-anything",
        "url": "https://github.com/storytold/craft-anything",
        "type": "Open-Source Git Repo (100% Rust)",
        "local_clone": r"E:\DIEN APP\Skill AI\craft-anything",
        "update_cmd": 'git -C "E:\\DIEN APP\\Skill AI\\craft-anything" pull'
    },
    "create-and-edit-video": {
        "title": "remotion-dev/remotion & motion-canvas",
        "url": "https://github.com/remotion-dev/remotion",
        "type": "Video-as-Code Engines",
        "local_clone": r"E:\DIEN APP\Skill AI\create and edit video",
        "update_cmd": "npm update remotion @remotion/cli"
    },
    "deeptutor-cli": {
        "title": "HKUDS/DeepTutor (AI Science & Manim Video)",
        "url": "https://github.com/HKUDS/DeepTutor",
        "type": "Open-Source Git Repo",
        "local_clone": r"C:\Users\INFOASIA\.gemini\config\skills\deeptutor-cli",
        "update_cmd": "deeptutor update / pip install -U deeptutor"
    },
    "design-landingpage-vip-v2": {
        "title": "noti-vn/design-landingpage-vip (Liquid Glass & CAPI)",
        "url": "https://github.com/noti-vn/design-landingpage-vip",
        "type": "Design System Nội Bộ VIP",
        "local_clone": r"E:\DIEN APP\Skill AI\Skill Landingpage",
        "update_cmd": "Đồng bộ mẫu Liquid Glass & Webhook CAPI"
    },
    "google-ads-master": {
        "title": "googleads/google-ads-python (Google Ads Hub)",
        "url": "https://github.com/googleads/google-ads-python",
        "type": "Marketing & Ads Hub",
        "local_clone": r"E:\DIEN APP\Skill AI\google ads",
        "update_cmd": "Cập nhật mẫu Google Ads Editor CSV"
    },
    "gsap-skills": {
        "title": "greensock/GSAP (Web & Video 60fps)",
        "url": "https://github.com/greensock/GSAP",
        "type": "Open-Source Git Repo",
        "local_clone": r"C:\Users\INFOASIA\.gemini\config\skills\gsap-skills",
        "update_cmd": "npm update gsap"
    },
    "html-to-webcake": {
        "title": "Webcake Landing Page Converter Engine",
        "url": "https://webcake.io",
        "type": "Công cụ chuyển đổi",
        "local_clone": r"C:\Users\INFOASIA\.gemini\config\skills\html-to-webcake",
        "update_cmd": "Kiểm tra parser .pke JSON"
    },
    "ifixai-agent-auditor": {
        "title": "agent-audit/ifixai (Kiểm toán 5 Trụ Cột AI)",
        "url": "https://github.com/agent-audit/ifixai",
        "type": "AI Safety & Auditor Suite",
        "local_clone": r"E:\DIEN APP\Skill AI\ifixai",
        "update_cmd": 'git -C "E:\\DIEN APP\\Skill AI\\agent-audit" pull'
    },
    "kinetic-reel": {
        "title": "mrdoob/three.js & FFmpeg WebGL Motion",
        "url": "https://github.com/mrdoob/three.js",
        "type": "Motion Graphics Engine",
        "local_clone": r"C:\Users\INFOASIA\.gemini\config\skills\kinetic-reel",
        "update_cmd": "Kiểm tra render pipeline"
    },
    "lam-phim-video-master": {
        "title": "JohnHeibel/PDoomVideo & Lam Phim AI Suite",
        "url": "https://github.com/JohnHeibel/PDoomVideo",
        "type": "Siêu Hub Làm Phim AI",
        "local_clone": r"E:\DIEN APP\Skill AI\lam-phim-video-master",
        "update_cmd": "Đồng bộ kho tài nguyên DoP"
    },
    "lean-teamwork": {
        "title": "toyota-production-system/lean-agent (Lean TPS)",
        "url": "https://github.com/toyota-production-system/lean-agent",
        "type": "Điều Phối Đa Tác Tử",
        "local_clone": r"C:\Users\INFOASIA\.gemini\config\skills\lean-teamwork",
        "update_cmd": "Kiểm tra Popover HUD và quota optimizer"
    },
    "nap-tai-lieu-antigravity": {
        "title": "blogminhquy/javis-os (Bộ Não Lai Javis OS)",
        "url": "https://github.com/blogminhquy/javis-os",
        "type": "Hệ Điều Hành & Chỉ Mục Lai",
        "local_clone": r"E:\DIEN APP\JavisOS",
        "update_cmd": 'git -C "E:\\DIEN APP\\JavisOS" pull'
    },
    "painted-animation": {
        "title": "acamposuribe/p5.brush & ClaudeAnimationBase",
        "url": "https://github.com/acamposuribe/p5.brush",
        "type": "Open-Source Git Repo (Watercolor Animation)",
        "local_clone": r"C:\Users\INFOASIA\.gemini\config\skills\painted-animation",
        "update_cmd": "Kiểm tra phiên bản p5.brush"
    },
    "project-blueprint-architect": {
        "title": "github/spec-kit & obra/superpowers",
        "url": "https://github.com/github/spec-kit",
        "type": "Open-Source Spec Kit Architecture",
        "local_clone": r"E:\DIEN APP\Skill AI\blueprint-repos",
        "update_cmd": "converge_blueprint.py self-test"
    },
    "prompts-chat": {
        "title": "f/awesome-chatgpt-prompts & prompts.chat",
        "url": "https://github.com/f/awesome-chatgpt-prompts",
        "type": "Open-Source Git Repo",
        "local_clone": r"E:\DIEN APP\Skill AI\prompts-chat",
        "update_cmd": "MCP endpoint tự động cập nhật qua cloud"
    },
    "recordly-tutorial-ai": {
        "title": "recordly-ai/recordly-engine (Video Tutorial AI)",
        "url": "https://github.com/recordly-ai/recordly-engine",
        "type": "Video Tutorial Automation",
        "local_clone": r"C:\Users\INFOASIA\.gemini\config\skills\recordly-tutorial-ai",
        "update_cmd": "Kiểm tra recordly_engine.py"
    },
    "reverse-engineer-anything": {
        "title": "morluto/rea",
        "url": "https://github.com/morluto/rea",
        "type": "Open-Source Git Repo (CLI Node.js v6.8.0)",
        "local_clone": r"E:\DIEN APP\Skill AI\rea",
        "update_cmd": 'git -C "E:\\DIEN APP\\Skill AI\\rea" pull'
    },
    "sap-b1-beas": {
        "title": "SAP Business One SDK & Boyum IT Beas Docs",
        "url": "https://help.sap.com/viewer/p/SAP_BUSINESS_ONE",
        "type": "ERP Chuẩn Hãng & Kế Toán Việt Nam",
        "local_clone": r"C:\Users\INFOASIA\.gemini\config\skills\sap-b1-beas",
        "update_cmd": "Cập nhật theo Thông tư 99/2025/TT-BTC"
    },
    "security-audit": {
        "title": "OWASP/CheatSheetSeries & Code Security Audit",
        "url": "https://github.com/OWASP/CheatSheetSeries",
        "type": "Security & Vulnerability Audit",
        "local_clone": r"C:\Users\INFOASIA\.gemini\config\skills\security-audit",
        "update_cmd": "Cập nhật OWASP Top 10 checklist"
    },
    "shopee-affiliate-video-studio": {
        "title": "Shopee Open API & Affiliate Studio Suite",
        "url": "https://open.shopee.com",
        "type": "E-Commerce Video Automation",
        "local_clone": r"C:\Users\INFOASIA\.gemini\config\skills\shopee-affiliate-video-studio",
        "update_cmd": "Cập nhật mẫu phân tích thông số"
    },
    "sql-sap-b1": {
        "title": "InfoAsia SAP B1 Enterprise SQL Architecture",
        "url": "https://github.com/thanhdientech/antigravity-hybrid-brain",
        "type": "Hệ Thống SQL Độc Quyền (19 DBs)",
        "local_clone": r"C:\Users\INFOASIA\.gemini\config\skills\sql-sap-b1",
        "update_cmd": "Kiểm tra kết nối 4 Server (24, 160, 52, 27)"
    },
    "tao-san-pham-so-bang-ai": {
        "title": "Strategyzer & Digital Product Launch Hub",
        "url": "https://www.strategyzer.com",
        "type": "Sản Phẩm Số & Phễu Bán",
        "local_clone": r"C:\Users\INFOASIA\.gemini\config\skills\tao-san-pham-so-bang-ai",
        "update_cmd": "Cập nhật biểu mẫu 7 ngày"
    },
    "tu-vi-bat-tu-than-so-hoc": {
        "title": "Sylar-Long/iztro-py (Thiên Văn Bát Tự & Tử Vi)",
        "url": "https://github.com/Sylar-Long/iztro-py",
        "type": "Open-Source Git Repo (Python)",
        "local_clone": r"C:\Users\INFOASIA\.gemini\config\skills\tu-vi-bat-tu-than-so-hoc",
        "update_cmd": "pip install -U iztro"
    },
    "ui-ux-cro-auditor": {
        "title": "garrytan/gstack & addyosmani/web-quality-skills",
        "url": "https://github.com/garrytan/gstack",
        "type": "Open-Source UI/UX & CRO Audit",
        "local_clone": r"E:\DIEN APP\Skill AI\ui-audit-repos",
        "update_cmd": "Cập nhật WCAG 2.2 checklist"
    },
    "ui-ux-design-pro-max": {
        "title": "carmahhawwari/ui-design-brain & ibelick/ui-skills",
        "url": "https://github.com/carmahhawwari/ui-design-brain",
        "type": "Open-Source Design System Hub",
        "local_clone": r"E:\DIEN APP\Skill AI\ui-workflow-repos",
        "update_cmd": "Đồng bộ 84 hệ DESIGN.md"
    },
    "verified-source-researcher": {
        "title": "NCBI PubMed E-utilities & DOI Foundation",
        "url": "https://github.com/ncbi/e-utilities",
        "type": "Kiểm Toán Nguồn Cấp 1",
        "local_clone": r"E:\DIEN APP\Skill AI\verified-source-researcher",
        "update_cmd": "python cli.py --check-health"
    },
    "video-storytelling": {
        "title": "ByteDance Seedance & Pixar Story Engine",
        "url": "https://github.com/video-storytelling/story-engine",
        "type": "Biên Kịch Video AI Đa Thể Loại",
        "local_clone": r"E:\DIEN APP\Skill AI\video-storytelling",
        "update_cmd": "Cập nhật 20+ công thức kịch bản"
    },
    "viet-sql-sap-b1": {
        "title": "SAP B1 T-SQL & HANA SQLScript Production Repo",
        "url": "https://github.com/thanhdientech/antigravity-hybrid-brain",
        "type": "Kho 323 Mẫu T-SQL Thực Chiến",
        "local_clone": r"C:\Users\INFOASIA\.gemini\config\skills\viet-sql-sap-b1",
        "update_cmd": "python scripts/search_sap_queries.py"
    },
    "webapp-app-ux-workflow": {
        "title": "vercel-labs/agent-skills & callstackincubator",
        "url": "https://github.com/vercel-labs/agent-skills",
        "type": "Open-Source Web/Mobile App UX Hub",
        "local_clone": r"E:\DIEN APP\Skill AI\ui-workflow-repos",
        "update_cmd": "audit_webapp_ux.py self-test"
    },
    "wordpress-flatsome-designer": {
        "title": "UX-Themes Flatsome 3.x & UX Builder Core",
        "url": "https://uxthemes.com/flatsome",
        "type": "Theme & Page Builder Chuẩn",
        "local_clone": r"C:\Users\INFOASIA\.gemini\config\skills\wordpress-flatsome-designer",
        "update_cmd": "Cập nhật 80 mục QA checklist"
    },
    "yt-shortcode-commander": {
        "title": "YouTube Data API v3 & Video Pipeline",
        "url": "https://developers.google.com/youtube/v3",
        "type": "YouTube & FB Pipeline",
        "local_clone": r"C:\Users\INFOASIA\.gemini\config\skills\yt-shortcode-commander",
        "update_cmd": "Kiểm tra chuỗi lệnh pipeline"
    }
}

# 1. Update each SKILL.md with Upstream Note
updated_count = 0
for slug, info in UPSTREAMS.items():
    p = os.path.join(SKILLS_DIR, slug)
    skill_md = os.path.join(p, "SKILL.md")
    if os.path.exists(skill_md):
        with open(skill_md, "r", encoding="utf-8") as f:
            content = f.read()
        
        upstream_badge = f"- **Nguồn gốc / Kho Git Upstream:** [{info['title']}]({info['url']}) (`{info['type']}`)"
        
        if "Nguồn gốc / Kho Git Upstream:" not in content and "Kho mã nguồn gốc trên máy" not in content:
            # Insert after frontmatter or trigger block
            if "<!-- JAVIS_TRIGGER_ARCHIVE_END -->" in content:
                content = content.replace("<!-- JAVIS_TRIGGER_ARCHIVE_END -->", f"<!-- JAVIS_TRIGGER_ARCHIVE_END -->\n\n{upstream_badge}")
            elif "---" in content[3:]:
                second_dash = content.find("---", 3)
                heading_end = content.find("\n", second_dash + 4)
                content = content[:heading_end] + f"\n\n{upstream_badge}\n" + content[heading_end:]
            with open(skill_md, "w", encoding="utf-8") as f:
                f.write(content)
            updated_count += 1

print(f"Updated {updated_count} SKILL.md files with upstream links.")

# 2. Save master manifest json
manifest_path = os.path.join(r"C:\Users\INFOASIA\.gemini\config", "SKILL_UPSTREAM_MANIFEST.json")
with open(manifest_path, "w", encoding="utf-8") as f:
    json.dump(UPSTREAMS, f, indent=2, ensure_ascii=False)
print(f"Saved master upstream manifest to {manifest_path}")
