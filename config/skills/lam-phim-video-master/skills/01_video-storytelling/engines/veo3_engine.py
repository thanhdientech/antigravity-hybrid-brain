# -*- coding: utf-8 -*-
"""
Google Veo 3 / 3.1 Prompt Engine (Google DeepMind Standard)
Tạo prompt chuẩn hóa theo công thức 5 Thành Phần (5-Part Formula) và cú pháp âm thanh chuyên biệt của Veo.
"""

from typing import List, Dict, Any
from .storytelling import StoryBeat, StoryScript


class Veo3PromptEngine:
    """
    Trình định dạng câu lệnh chuyên dụng cho mô hình Google Veo 3 / 3.1.
    Tuân thủ công thức: [Cinematography] + [Subject] + [Action] + [Context] + [Style & Ambiance].
    """

    @classmethod
    def format_single_beat(
        cls,
        beat: StoryBeat,
        character_desc: str,
        product_name: str
    ) -> str:
        """
        Sinh prompt Veo 3.1 văn xuôi liền mạch, tuyệt đối không chứa thẻ @ hay nhãn chia cắt thô.
        """
        cinematography = f"A cinematic {beat.camera_movement}."
        context = "Atmospheric environment with nuanced, natural cinematic lighting and rich depth."
        style = "Cinematic photorealism, authentic human texture, 35mm film aesthetic, photorealistic 4k, hyper-detailed."

        if beat.cinematic:
            cinematography = f"A cinematic {beat.cinematic.shot_size}, {beat.cinematic.camera_angle}, {beat.camera_movement}, {beat.cinematic.lens_and_depth}, {beat.cinematic.composition}."
            style = f"Cinematic lighting ({beat.cinematic.lighting}), {beat.cinematic.color_grading}, {beat.cinematic.film_grain}, {beat.cinematic.mood_keywords} mood, photorealistic 8k, authentic human texture."

        subject = f"A {character_desc}."
        action = f"{beat.visual_action}."
        
        # Cấu trúc âm thanh chuẩn của Google Veo 3.1
        audio_parts = []
        if beat.dialogue:
            # Veo yêu cầu: A woman/man says, "..."
            speaker = "She" if "nữ" in character_desc.lower() or "woman" in character_desc.lower() else "He"
            clean_diag = beat.dialogue.replace('"', '').strip()
            audio_parts.append(f'{speaker} speaks with natural emotion, "{clean_diag}."')
        
        if beat.sound_fx:
            audio_parts.append(f"SFX: {beat.sound_fx}.")
            
        if beat.ambient_noise:
            audio_parts.append(f"Ambient noise: {beat.ambient_noise}.")

        audio_str = " ".join(audio_parts)

        # Hợp nhất 5 thành phần thành một đoạn văn xuôi duy nhất chuẩn Veo 3
        prompt = f"{cinematography} {subject} {action} {context} {style} {audio_str}"
        return prompt.strip()

    @classmethod
    def format_full_script(
        cls,
        script: StoryScript
    ) -> Dict[str, Any]:
        """
        Sinh danh sách prompt Veo 3 cho từng phân đoạn của kịch bản.
        """
        shots = []
        for i, beat in enumerate(script.beats, 1):
            prompt_str = cls.format_single_beat(
                beat=beat,
                character_desc=script.character_appearance,
                product_name=script.product_or_topic
            )
            shots.append({
                "shot_number": i,
                "beat_id": beat.beat_id,
                "timestamp": beat.timestamp,
                "veo3_prompt": prompt_str,
                "recommended_settings": {
                    "model": "Google Veo 3 / 3.1",
                    "mode": "Image-to-Video (First Frame) hoặc Text-to-Video",
                    "aspect_ratio": "9:16" if "SHORT" in script.format_type else "16:9",
                    "audio_enabled": True
                }
            })

        return {
            "engine": "Google Veo 3 / 3.1 (DeepMind)",
            "title": script.title,
            "formula_applied": "[Cinematography] + [Subject] + [Action] + [Context] + [Style & Ambiance]",
            "shots": shots
        }
