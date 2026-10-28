# -*- coding: utf-8 -*-
"""
Cinematic Director Engine (DoP Master Lexicon & Formula)
Tích hợp trực tiếp 700+ thuật ngữ điện ảnh chuyên sâu (Góc máy, Chuyển động, Ánh sáng, Bố cục, Ống kính, Màu sắc, Mood)
từ cinematic-video-prompt vào hệ sinh thái video-storytelling.
"""

from typing import Dict, Any, List, Optional
from dataclasses import dataclass, asdict


@dataclass
class CinematicAttributes:
    shot_size: str             # Ví dụ: "Medium close-up (MCU)", "Extreme close-up / Macro"
    camera_angle: str          # Ví dụ: "Low angle / Hero shot", "Eye-level", "Dutch tilt"
    camera_movement: str       # Ví dụ: "Slow dolly in", "Smooth Steadicam tracking", "Arc shot 360"
    lighting: str              # Ví dụ: "Rembrandt lighting", "Volumetric god rays", "Chiaroscuro"
    lens_and_depth: str        # Ví dụ: "35mm lens, shallow depth of field, f/1.4, anamorphic bokeh"
    composition: str           # Ví dụ: "Rule of thirds, foreground depth layers, leading lines"
    color_grading: str         # Ví dụ: "Teal and orange grading, lifted blacks"
    film_grain: str            # Ví dụ: "35mm Kodak Portra 400 film grain"
    mood_keywords: str         # Ví dụ: "melancholic, intimate, hopeful"

    def to_dict(self) -> Dict[str, str]:
        return asdict(self)

    def to_compact_dop_string(self) -> str:
        """Chuỗi mô tả DoP cô đọng chuẩn 1 cú máy."""
        parts = [
            f"{self.shot_size}",
            f"{self.camera_angle}",
            f"{self.camera_movement}",
            f"{self.lighting}",
            f"{self.lens_and_depth}",
            f"{self.color_grading}",
            f"{self.mood_keywords} mood"
        ]
        return ", ".join([p for p in parts if p])


class CinematicDirector:
    """
    Đạo diễn hình ảnh (Director of Photography - DoP) tự động gán bộ thông số quay phim
    chuẩn Hollywood cho từng nhịp phân cảnh (Story Beat) của kịch bản storytelling.
    """

    # Bộ phong cách đạo diễn dựng sẵn
    DIRECTOR_STYLES = {
        "hollywood_dramatic": {
            "name": "Hollywood Cinematic Dramatic",
            "color": "Teal and orange cinematic grading, high dynamic range",
            "film": "35mm anamorphic film grain, subtle halation",
            "lens": "35mm storytelling prime lens, shallow depth of field, oval bokeh"
        },
        "cyberpunk_neon": {
            "name": "Cyberpunk Neon Noir",
            "color": "Neon cyan and magenta palette, wet asphalt reflections, deep blacks",
            "film": "CineStill 800T look with neon light bloom",
            "lens": "24mm wide angle, anamorphic blue horizontal lens flare"
        },
        "film_noir": {
            "name": "Classic Film Noir",
            "color": "High-contrast chiaroscuro black and white, dramatic deep shadows",
            "film": "Grainy Kodak Tri-X 400 black and white film aesthetic",
            "lens": "50mm vintage lens, hard directional light through window blinds"
        },
        "documentary": {
            "name": "Authentic Intimate Documentary",
            "color": "Natural neutral grading, lifelike skin tones, authentic atmosphere",
            "film": "Super 16mm organic documentary texture",
            "lens": "50mm natural focal length, subtle handheld motion, authentic depth"
        },
        "commercial_clean": {
            "name": "Premium Commercial Clean",
            "color": "Clean vibrant commercial color science, pristine high-key tones",
            "film": "Zero grain, ultra-sharp 8k ARRI Alexa LF digital clarity",
            "lens": "85mm portrait macro lens, pristine softbox diffusion, studio lighting"
        },
        "vintage_retro": {
            "name": "Warm Nostalgic Vintage",
            "color": "Warm golden palette, sepia undertones, soft faded lifted blacks",
            "film": "Kodak Portra 400 vintage color negative, soft warm glow",
            "lens": "Vintage 35mm lens, gentle edge falloff, golden hour flare"
        }
    }

    # Bảng phân bổ DoP tối ưu theo từng giai đoạn Storytelling Arc
    BEAT_CINEMATIC_MAPPING = {
        "HOOK": {
            "shot_size": "Medium close-up (MCU)",
            "camera_angle": "Eye-level intimate angle",
            "camera_movement": "Slow dolly in focusing on micro-expression",
            "lighting": "Soft window light with subtle rim lighting",
            "composition": "Rule of thirds, strong foreground interest",
            "mood": "vulnerable, relatable, intimate"
        },
        "STRUGGLE": {
            "shot_size": "Medium shot transitioning to Dutch tilt",
            "camera_angle": "High angle or canted Dutch tilt to evoke pressure",
            "camera_movement": "Handheld with subtle tension shake, fast whip pan",
            "lighting": "Low-key chiaroscuro lighting, harsh shadows, overcast tones",
            "composition": "Framing within a frame, cramped negative space",
            "mood": "tense, overwhelmed, melancholic"
        },
        "EPIPHANY": {
            "shot_size": "Extreme close-up / Macro on eyes and product",
            "camera_angle": "Low angle hero perspective",
            "camera_movement": "Smooth 45-degree arc shot revealing solution",
            "lighting": "Rembrandt lighting transitioning into warm golden glow, volumetric light rays",
            "composition": "Centered symmetry, luminous vanishing point",
            "mood": "epiphanic, hopeful, awakening"
        },
        "TRANSFORMATION": {
            "shot_size": "Wide establishing shot transitioning to Full body shot",
            "camera_angle": "Low-angle empowering hero shot",
            "camera_movement": "Smooth Steadicam tracking shot moving gracefully backward",
            "lighting": "Sun-drenched golden hour, soft volumetric God rays, warm rim light",
            "composition": "Expansive negative space, triumphant leading lines",
            "mood": "liberating, confident, joyful"
        },
        "RESOLUTION_CTA": {
            "shot_size": "Medium portrait shot",
            "camera_angle": "Direct eye-level engaging angle",
            "camera_movement": "Slow subtle push-in commanding authority and trust",
            "lighting": "Three-point commercial beauty lighting, soft bokeh highlights in background",
            "composition": "Centered balanced composition, direct magnetic gaze",
            "mood": "trustworthy, inspiring, resolute"
        },
        "TITLE": {
            "shot_size": "Extreme wide shot with microscopic subject",
            "camera_angle": "Eye-level solemn locked-off angle",
            "camera_movement": "Locked-off static camera or ultra slow creep in",
            "lighting": "Dark ambient aesthetic, phosphor CRT glow, deep void blacks",
            "composition": "Minimalist centered composition with negative space",
            "mood": "mysterious, ominous, solemn"
        },
        "INCIDENT": {
            "shot_size": "First-person POV or Over-the-shoulder shot",
            "camera_angle": "Eye-level reactive angle",
            "camera_movement": "Slight handheld drift or slow pan revealing anomaly",
            "lighting": "Moody directional beam, emergency instrument panel glare",
            "composition": "Framing through cockpit window, claustrophobic depth layers",
            "mood": "suspenseful, tense, eerie"
        },
        "EVIDENCE": {
            "shot_size": "Close-up or Macro detail shot",
            "camera_angle": "Slight high-angle observational desk view",
            "camera_movement": "Slow smooth linear tracking pan across evidence",
            "lighting": "Cool laboratory fluorescent lighting, stark practical desk lamp",
            "composition": "Leading lines through documents, geometric technical balance",
            "mood": "objective, analytical, curious"
        },
        "DEBATE": {
            "shot_size": "Medium close-up (MCU)",
            "camera_angle": "Dutch tilt / canted angle indicating doubt",
            "camera_movement": "Handheld subtle tension shake, searching camera motion",
            "lighting": "Harsh chiaroscuro side lighting, half-face shadow",
            "composition": "Broken symmetry, heavy negative space behind subject",
            "mood": "skeptical, defiant, unsettling"
        },
        "TWIST": {
            "shot_size": "Extreme wide shot / Worm's eye view",
            "camera_angle": "Dramatic low-angle gazing into endless abyss",
            "camera_movement": "Slow crane up or continuous slow dolly out to reveal cosmic scale",
            "lighting": "Volumetric god rays, ethereal starlight, deep cosmic shadows",
            "composition": "Vast empty negative space, vanishing point into infinity",
            "mood": "existential dread, awe-inspiring, haunting wonder"
        }
    }

    @classmethod
    def get_cinematic_attributes(
        cls,
        phase_category: str,
        style_preset: str = "hollywood_dramatic"
    ) -> CinematicAttributes:
        """
        Tra cứu và sinh bộ thuộc tính DoP hoàn chỉnh cho một phân đoạn kể chuyện.
        """
        # Chuẩn hóa phase
        norm_phase = "HOOK"
        for key in cls.BEAT_CINEMATIC_MAPPING.keys():
            if key in phase_category.upper():
                norm_phase = key
                break

        beat_rule = cls.BEAT_CINEMATIC_MAPPING.get(norm_phase, cls.BEAT_CINEMATIC_MAPPING["HOOK"])
        style_rule = cls.DIRECTOR_STYLES.get(style_preset, cls.DIRECTOR_STYLES["hollywood_dramatic"])

        return CinematicAttributes(
            shot_size=beat_rule["shot_size"],
            camera_angle=beat_rule["camera_angle"],
            camera_movement=beat_rule["camera_movement"],
            lighting=beat_rule["lighting"],
            lens_and_depth=style_rule["lens"],
            composition=beat_rule["composition"],
            color_grading=style_rule["color"],
            film_grain=style_rule["film"],
            mood_keywords=beat_rule["mood"]
        )

    @classmethod
    def build_veo3_cinematography_block(cls, ca: CinematicAttributes) -> str:
        """
        Định dạng khối [Cinematography] cho Google Veo 3 / 3.1.
        """
        return f"{ca.shot_size}, {ca.camera_angle}, {ca.camera_movement}, {ca.lens_and_depth}, {ca.composition}."

    @classmethod
    def build_veo3_style_block(cls, ca: CinematicAttributes) -> str:
        """
        Định dạng khối [Style & Ambiance] cho Google Veo 3 / 3.1.
        """
        return f"Cinematic lighting ({ca.lighting}), {ca.color_grading}, {ca.film_grain}, {ca.mood_keywords} mood, photorealistic 8k."

    @classmethod
    def build_seedance_camera_block(cls, ca: CinematicAttributes) -> str:
        """
        Định dạng dòng Camera: cho Seedance 2.0 / 2.5.
        """
        return f"{ca.shot_size}, {ca.camera_angle}, {ca.camera_movement}, {ca.lens_and_depth}."

    @classmethod
    def build_seedance_style_block(cls, ca: CinematicAttributes) -> str:
        """
        Định dạng dòng Style: cho Seedance 2.0 / 2.5.
        """
        return f"Cinematic realism, {ca.lighting}, {ca.color_grading}, {ca.film_grain}, 24fps film cadence, 8k."
