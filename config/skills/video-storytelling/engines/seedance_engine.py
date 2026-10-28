# -*- coding: utf-8 -*-
"""
Seedance 2.0 & 2.5 Prompt Engine (ByteDance / Volcengine Standard)
Tạo prompt chuẩn hóa theo định dạng Đạo Diễn (Director-Style), hỗ trợ Multimodal Reference (@Image, @Video, @Audio).
"""

from typing import List, Dict, Any, Optional
from .storytelling import StoryBeat, StoryScript


class SeedancePromptEngine:
    """
    Trình định dạng câu lệnh chuyên dụng cho mô hình Seedance 2.0 / 2.5 của ByteDance.
    """

    @classmethod
    def format_single_beat(
        cls,
        beat: StoryBeat,
        character_name: Optional[str] = None,
        character_ref_id: str = "@Image 1",
        product_ref_id: Optional[str] = "@Image 2",
        include_multimodal_tags: bool = True
    ) -> str:
        """
        Sinh prompt Seedance 2.0 cho 1 phân đoạn (Shot).
        """
        char_tag = f"character from {character_ref_id}" if include_multimodal_tags else "the main character"
        prod_tag = f"featured product in {product_ref_id}" if (include_multimodal_tags and product_ref_id) else "the product"

        action_text = beat.visual_action.replace("nhân vật", char_tag).replace("sản phẩm", prod_tag)
        if character_name and character_name in action_text:
            action_text = action_text.replace(character_name, char_tag)
        
        dialogue_text = f' Character speaks: "{beat.dialogue}"' if beat.dialogue else ""

        ref_line = ""
        if include_multimodal_tags:
            ref_line = f"References: Character anchor from {character_ref_id}"
            if product_ref_id:
                ref_line += f", Product anchor from {product_ref_id}."
            else:
                ref_line += "."
        
        camera_line = beat.camera_movement
        style_line = "Cinematic photorealism, 8k resolution, 24fps motion cadence, natural documentary grade."

        if beat.cinematic:
            camera_line = f"{beat.cinematic.shot_size}, {beat.cinematic.camera_angle}, {beat.camera_movement}, {beat.cinematic.lens_and_depth}"
            style_line = f"Cinematic photorealism, {beat.cinematic.lighting}, {beat.cinematic.color_grading}, {beat.cinematic.film_grain}, 8k, 24fps"

        lines = []
        if ref_line:
            lines.append(ref_line)
        lines.extend([
            f"Setting: Realistic cinematic environment, authentic atmospheric lighting, high dynamic range.",
            f"Action: {action_text}. Realistic physical interaction, subtle micro-expressions, true-to-life physics.{dialogue_text}",
            f"Camera: {camera_line}.",
            f"Style: {style_line}.",
            f"Audio: Ambient: {beat.ambient_noise}. SFX: {beat.sound_fx}."
        ])
        return "\n".join(lines)

    @classmethod
    def format_full_multishot_script(
        cls,
        script: StoryScript,
        character_ref_id: str = "@Image 1",
        product_ref_id: str = "@Image 2"
    ) -> Dict[str, Any]:
        """
        Sinh trọn bộ các prompt Seedance 2.0 tương ứng với từng Beat của kịch bản,
        kèm cấu trúc tham chiếu tài sản đa phương thức (Multimodal Reference Map).
        """
        prompts = []
        for i, beat in enumerate(script.beats, 1):
            prompt_str = cls.format_single_beat(
                beat=beat,
                character_name=script.character_name,
                character_ref_id=character_ref_id,
                product_ref_id=product_ref_id,
                include_multimodal_tags=True
            )
            prompts.append({
                "shot_number": i,
                "beat_id": beat.beat_id,
                "timestamp": beat.timestamp,
                "seedance_prompt": prompt_str,
                "recommended_settings": {
                    "model": "Seedance 2.0 / 2.5",
                    "duration_seconds": 10 if i in [2, 3] else 5,
                    "aspect_ratio": "9:16" if "SHORT" in script.format_type else "16:9",
                    "reference_inputs": {
                        character_ref_id: f"Bảng nhân vật Character Sheet ({script.character_name})",
                        product_ref_id: f"Hình ảnh sản phẩm / bối cảnh ({script.product_or_topic})"
                    }
                }
            })

        return {
            "engine": "Seedance 2.0 / 2.5 (ByteDance)",
            "title": script.title,
            "multimodal_mapping": {
                character_ref_id: f"Character consistency anchor ({script.character_name})",
                product_ref_id: f"Product anchor ({script.product_or_topic})"
            },
            "shots": prompts
        }
