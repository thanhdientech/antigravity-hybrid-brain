# -*- coding: utf-8 -*-
"""
Character Consistency Engine
Sinh prompt tạo bảng nhân vật (Character Turnaround / Model Sheet) cố định diện mạo
trên Midjourney v6 hoặc Flux trước khi đưa vào các mô hình video AI.
"""

from typing import Dict, Any


class CharacterConsistencyEngine:
    """
    Tạo prompt hình ảnh chuyên dụng để giữ gương mặt, vóc dáng và trang phục đồng nhất 100%.
    """

    @classmethod
    def generate_turnaround_prompt(
        cls,
        character_identity: str,
        outfit_details: str = "casual modern streetwear, minimalist beige neutral tone",
        style: str = "cinematic photorealism"
    ) -> Dict[str, Any]:
        """
        Sinh prompt bảng quay nhân vật 4 góc nhìn chuẩn Hollywood.
        """
        prompt = (
            f"character sheet, model turnaround sheet of {character_identity}, "
            f"wearing {outfit_details}. "
            f"Four views: full body front view, full body 3/4 view, side profile view, back view. "
            f"Same person, identical facial features, consistent hair and body proportions across all panels. "
            f"Neutral clean studio grey background, soft documentary lighting, high detail skin texture, "
            f"{style}, 8k, shot on 35mm lens --ar 16:9"
        )

        midjourney_v6_prompt = f"/imagine prompt: {prompt} --v 6.1 --style raw"
        flux_prompt = prompt

        return {
            "character_identity": character_identity,
            "turnaround_prompt_raw": prompt,
            "midjourney_command": midjourney_v6_prompt,
            "flux_prompt": flux_prompt,
            "instructions": [
                "1. Render bảng nhân vật trên Midjourney hoặc Flux để có 1 tấm ảnh 4 góc nhìn chuẩn.",
                "2. Cắt lấy tấm ảnh góc đẹp nhất (thường là góc 3/4) làm Anchor Frame (@Image 1 cho Seedance hoặc First Frame cho Veo 3).",
                "3. Dùng ảnh này làm input cố định xuyên suốt toàn bộ các cảnh trong video."
            ]
        }
