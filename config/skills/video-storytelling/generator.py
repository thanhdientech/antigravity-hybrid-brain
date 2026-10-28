# -*- coding: utf-8 -*-
"""
Video Storytelling Master Generator
Điều phối tạo trọn bộ kịch bản kể chuyện, bảng nhân vật và phân tách rõ ràng 2 luồng prompt:
Seedance 2.0 (ByteDance) và Veo 3 / 3.1 (Google DeepMind).
"""

import os
import json
from typing import Dict, Any, Optional
from engines.storytelling import StorytellingEngine, StoryScript
from engines.seedance_engine import SeedancePromptEngine
from engines.veo3_engine import Veo3PromptEngine
from engines.character_consistency import CharacterConsistencyEngine


class VideoStorytellingGenerator:
    """
    Trình tạo kịch bản video Storytelling chuyên nghiệp phân tách 2 engine Seedance & Veo 3.
    """

    def __init__(self):
        self.story_engine = StorytellingEngine()
        self.char_engine = CharacterConsistencyEngine()

    def generate_full_package(
        self,
        topic: str,
        character: str,
        problem: str,
        epiphany: str,
        call_to_action: str,
        cinematic_style: str = "hollywood_dramatic",
        formula: str = "pas_t",
        output_dir: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Tạo trọn gói tài sản video: Kịch bản Storytelling, Character Sheet, Prompt Seedance 2.0 và Prompt Veo 3.
        Tích hợp DoP Cinematic Director.
        """
        # 1. Sinh kịch bản Storytelling kèm DoP attributes
        script: StoryScript = self.story_engine.generate_narrative_script(
            topic_or_product=topic,
            character_identity=character,
            core_problem=problem,
            core_epiphany=epiphany,
            call_to_action=call_to_action,
            format_type="SHORT_FORM_60S",
            cinematic_style=cinematic_style,
            formula=formula
        )

        # 2. Sinh bảng nhân vật đồng nhất
        char_sheet = self.char_engine.generate_turnaround_prompt(
            character_identity=character
        )

        # 3. Phân tách Engine 1: Seedance 2.0 / 2.5 (ByteDance)
        seedance_data = SeedancePromptEngine.format_full_multishot_script(
            script=script,
            character_ref_id="@Image 1",
            product_ref_id="@Image 2"
        )

        # 4. Phân tách Engine 2: Google Veo 3 / 3.1 (DeepMind)
        veo3_data = Veo3PromptEngine.format_full_script(
            script=script
        )

        package = {
            "title": script.title,
            "topic": topic,
            "formula": script.formula,
            "cinematic_style": cinematic_style,
            "character_sheet": char_sheet,
            "story_script": script.to_dict(),
            "seedance_engine": seedance_data,
            "veo3_engine": veo3_data
        }

        # 5. Xuất file nếu có output_dir
        if output_dir:
            os.makedirs(output_dir, exist_ok=True)
            
            # Xuất JSON
            json_file = os.path.join(output_dir, "storytelling_prompts.json")
            with open(json_file, "w", encoding="utf-8") as f:
                json.dump(package, f, ensure_ascii=False, indent=2)

            # Xuất Markdown báo cáo so sánh trực quan 2 Model & DoP
            md_file = os.path.join(output_dir, "KICH_BAN_VA_PROMPT_CHI_TIET.md")
            with open(md_file, "w", encoding="utf-8") as f:
                f.write(self._build_markdown_report(script, char_sheet, seedance_data, veo3_data))

            package["output_json_path"] = json_file
            package["output_markdown_path"] = md_file

        return package

    def _build_markdown_report(
        self,
        script: StoryScript,
        char_sheet: Dict[str, Any],
        seedance: Dict[str, Any],
        veo3: Dict[str, Any]
    ) -> str:
        lines = [
            f"# 🎬 KỊCH BẢN STORYTELLING & BỘ PROMPT ĐIỆN ẢNH (SEEDANCE 2.0 & VEO 3)",
            f"- **Chủ đề / Sản phẩm:** {script.product_or_topic}",
            f"- **Nhân vật chính:** {script.character_name} ({script.character_appearance})",
            f"- **Phong cách Đạo Diễn (DoP):** `{script.cinematic_style}` (Tích hợp Cinematic Video Prompt)",
            f"- **Định dạng:** {script.format_type}",
            "",
            "---",
            "",
            "## 👤 PHẦN 1: BẢNG NHÂN VẬT ĐỒNG NHẤT (CHARACTER CONSISTENCY)",
            "> **Mục đích:** Dùng prompt này trên Midjourney v6 hoặc Flux để tạo ảnh 4 góc nhân vật. Sau đó cắt lấy ảnh đẹp nhất làm `@Image 1` (Seedance) hoặc `First Frame` (Veo 3).",
            "",
            "```text",
            char_sheet["turnaround_prompt_raw"],
            "```",
            "",
            "---",
            "",
            "## 🎥 PHẦN 2: THÔNG SỐ ĐẠO DIỄN ĐIỆN ẢNH (DoP CINEMATOGRAPHY BREAKDOWN)",
            "> **Nguồn gốc:** Tích hợp trực tiếp từ từ điển 700+ thuật ngữ của `cinematic-video-prompt`.",
            "",
            "| Cảnh | Góc Máy & Khung Hình | Chuyển Động Camera | Ánh Sáng & Khí Quyển | Ống Kính & Màu Sắc |",
            "| :--- | :--- | :--- | :--- | :--- |"
        ]

        for b in script.beats:
            ca = b.cinematic
            if ca:
                shot_angle = f"**{ca.shot_size}**<br>*{ca.camera_angle}*"
                cam_move = f"*{ca.camera_movement}*"
                light_amb = f"{ca.lighting}<br>Mood: `{ca.mood_keywords}`"
                lens_col = f"{ca.lens_and_depth}<br>{ca.color_grading}"
                lines.append(f"| `{b.beat_id}` | {shot_angle} | {cam_move} | {light_amb} | {lens_col} |")

        lines.extend([
            "",
            "---",
            "",
            "## 🎭 PHẦN 3: BẢNG KỊCH BẢN NỘI DUNG (STORYTELLING BEATS)",
            "| Thời Gian | Giai Đoạn | Lời Thoại (Voiceover) | Hành Động & Cảm Xúc | Âm Thanh & Nhạc Nền |",
            "| :--- | :--- | :--- | :--- | :--- |"
        ])

        for b in script.beats:
            diag = f"<br>🗣️ *{b.dialogue}*" if b.dialogue else ""
            lines.append(f"| `{b.timestamp}` | **{b.phase}** | {b.voiceover}{diag} | {b.visual_action} (*{b.emotion_tone}*) | SFX: {b.sound_fx}<br>Amb: {b.ambient_noise} |")

        lines.extend([
            "",
            "---",
            "",
            "## 🔴 PHÂN HỆ 1: BỘ PROMPT CHUẨN HÓA SEEDANCE 2.0 / 2.5 (BYTEDANCE)",
            "> **Đặc điểm:** Tối ưu hóa cho Multimodal Reference (`@Image 1`, `@Image 2`), chia nhãn đạo diễn (`Setting:`, `Action:`, `Camera:`, `Style:`, `Audio:`).",
            ""
        ])

        for s in seedance["shots"]:
            lines.extend([
                f"### 📍 Cảnh {s['shot_number']} [{s['beat_id']}] ({s['timestamp']})",
                "```text",
                s["seedance_prompt"],
                "```",
                f"- **Tham chiếu đầu vào:** `@Image 1` (Nhân vật), `@Image 2` (Sản phẩm).",
                f"- **Khuyên dùng:** Độ dài `{s['recommended_settings']['duration_seconds']}s`, Tỷ lệ `{s['recommended_settings']['aspect_ratio']}`.",
                ""
            ])

        lines.extend([
            "---",
            "",
            "## 🔵 PHÂN HỆ 2: BỘ PROMPT CHUẨN HÓA GOOGLE VEO 3 / 3.1 (DEEPMIND)",
            "> **Đặc điểm:** Tuân thủ công thức 5 phần (`[Cinematography] + [Subject] + [Action] + [Context] + [Style & Ambiance]`), tích hợp DoP Hollywood, thoại trong ngoặc kép `She says, \"...\"`, âm thanh `SFX:` và `Ambient noise:` riêng biệt, không chứa thẻ `@`.",
            ""
        ])

        for s in veo3["shots"]:
            lines.extend([
                f"### 📍 Cảnh {s['shot_number']} [{s['beat_id']}] ({s['timestamp']})",
                "```text",
                s["veo3_prompt"],
                "```",
                f"- **Khuyên dùng:** Mode `{s['recommended_settings']['mode']}`, Tỷ lệ `{s['recommended_settings']['aspect_ratio']}`.",
                ""
            ])

        # Bổ sung Phần 4: Thư Mục Trích Dẫn & Nguồn Gốc Số Liệu (Zero Fabrication)
        if script.sources:
            lines.extend([
                "---",
                "",
                "## 📚 PHẦN 4: THƯ MỤC TRÍCH DẪN & NGUỒN GỐC SỐ LIỆU (ZERO FABRICATION CITATIONS)",
                "> **Quy chuẩn bắt buộc:** Tuân thủ thiết luật Zero Fabrication & Zero Hallucination. Mọi số liệu, thành phần và tuyên bố đều được đối chiếu từ tài liệu gốc, tạp chí bình duyệt hoặc website chính thức của nhà sản xuất.",
                "",
                "| STT | Tên Tài Liệu / Sản Phẩm | Tác Giả / Nhà Sản Xuất | Trang Web / Mã Lưu Trữ | Dữ Liệu & Luận Điểm Kiểm Chứng |",
                "| :--- | :--- | :--- | :--- | :--- |"
            ])
            for i, src in enumerate(script.sources, 1):
                name = src.get("name", "N/A")
                author = src.get("author_or_manufacturer", "N/A")
                url_id = src.get("source_url_or_id", "N/A")
                claims = src.get("verified_claims", "N/A")
                lines.append(f"| {i} | **{name}** | {author} | `{url_id}` | {claims} |")
            lines.append("")

        return "\n".join(lines)
