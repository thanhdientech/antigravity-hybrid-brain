# -*- coding: utf-8 -*-
"""
Unit and Integration Tests for Video Storytelling Suite
"""

import os
import unittest
import tempfile
import sys

# Đảm bảo import được từ thư mục cha
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from engines.storytelling import StorytellingEngine
from engines.seedance_engine import SeedancePromptEngine
from engines.veo3_engine import Veo3PromptEngine
from engines.character_consistency import CharacterConsistencyEngine
from generator import VideoStorytellingGenerator


class TestVideoStorytelling(unittest.TestCase):

    def setUp(self):
        self.story_engine = StorytellingEngine()
        self.char_engine = CharacterConsistencyEngine()

    def test_storytelling_beats_generation(self):
        script = self.story_engine.generate_narrative_script(
            topic_or_product="Serum Trị Mụn",
            character_identity="Cô gái trẻ 24 tuổi",
            core_problem="mụn viêm tự ti",
            core_epiphany="công nghệ vi nang làm dịu da",
            call_to_action="Nhấn link bên dưới",
            format_type="SHORT_FORM_60S"
        )
        self.assertEqual(len(script.beats), 5)
        self.assertIn("HOOK", script.beats[0].phase)
        self.assertIn("RESOLUTION_CTA", script.beats[-1].phase)
        self.assertGreater(len(script.beats[0].voiceover), 10)

    def test_seedance_engine_formatting(self):
        script = self.story_engine.generate_narrative_script(
            topic_or_product="Son môi",
            character_identity="Người mẫu",
            core_problem="môi khô",
            core_epiphany="dưỡng chất thiên nhiên",
            call_to_action="Mua ngay"
        )
        seedance_pkg = SeedancePromptEngine.format_full_multishot_script(script)
        self.assertEqual(len(seedance_pkg["shots"]), 5)
        first_prompt = seedance_pkg["shots"][0]["seedance_prompt"]
        self.assertIn("Setting:", first_prompt)
        self.assertIn("Action:", first_prompt)
        self.assertIn("Camera:", first_prompt)
        self.assertIn("Audio:", first_prompt)
        self.assertIn("@Image 1", first_prompt)

    def test_veo3_engine_formatting(self):
        script = self.story_engine.generate_narrative_script(
            topic_or_product="Son môi",
            character_identity="Người mẫu nữ",
            core_problem="môi khô",
            core_epiphany="dưỡng chất thiên nhiên",
            call_to_action="Mua ngay"
        )
        veo3_pkg = Veo3PromptEngine.format_full_script(script)
        self.assertEqual(len(veo3_pkg["shots"]), 5)
        first_prompt = veo3_pkg["shots"][0]["veo3_prompt"]
        
        # Veo 3 tuyệt đối không được chứa thẻ @Image của Seedance
        self.assertNotIn("@Image", first_prompt)
        # Veo 3 phải có cinematography và style/ambiance
        self.assertIn("cinematic", first_prompt.lower())
        self.assertTrue("SFX:" in first_prompt or "Ambient noise:" in first_prompt or "speaks" in first_prompt)

    def test_character_consistency_engine(self):
        sheet = self.char_engine.generate_turnaround_prompt("chàng trai năng động 28 tuổi")
        prompt = sheet["turnaround_prompt_raw"]
        self.assertIn("character sheet", prompt.lower())
        self.assertIn("front view", prompt.lower())
        self.assertIn("side profile", prompt.lower())
        self.assertIn("back view", prompt.lower())

    def test_cinematic_director_enrichment(self):
        from engines.cinematic_director import CinematicDirector
        ca = CinematicDirector.get_cinematic_attributes("HOOK", "hollywood_dramatic")
        self.assertIn("Medium close-up", ca.shot_size)
        self.assertIn("Teal and orange", ca.color_grading)
        self.assertIn("vulnerable", ca.mood_keywords)

    def test_cinematic_style_presets(self):
        from engines.cinematic_director import CinematicDirector
        presets = ["hollywood_dramatic", "cyberpunk_neon", "film_noir", "documentary", "commercial_clean", "vintage_retro"]
        for p in presets:
            ca = CinematicDirector.get_cinematic_attributes("TRANSFORMATION", p)
            self.assertIsNotNone(ca)
            self.assertGreater(len(ca.color_grading), 5)
            self.assertGreater(len(ca.lens_and_depth), 5)

    def test_full_package_generation(self):
        gen = VideoStorytellingGenerator()
        with tempfile.TemporaryDirectory() as tmpdir:
            pkg = gen.generate_full_package(
                topic="Khóa học tiếng Anh",
                character="Nhân viên công sở 30 tuổi",
                problem="mất gốc tiếng Anh",
                epiphany="phương pháp phản xạ 15 phút mỗi ngày",
                call_to_action="Đăng ký học thử miễn phí",
                cinematic_style="cyberpunk_neon",
                output_dir=tmpdir
            )
            self.assertTrue(os.path.exists(pkg["output_json_path"]))
            self.assertTrue(os.path.exists(pkg["output_markdown_path"]))
            self.assertGreater(os.path.getsize(pkg["output_markdown_path"]), 500)
            
            with open(pkg["output_markdown_path"], "r", encoding="utf-8") as f:
                md_content = f.read()
            self.assertIn("DoP CINEMATOGRAPHY BREAKDOWN", md_content)
            self.assertIn("cyberpunk_neon", md_content)

    def test_all_formulas_generation(self):
        formulas_expected_counts = {
            "pas_t": 5,
            "short_form_hvc": 3,
            "conversion_aida": 4,
            "conversion_bab": 3,
            "scientific_debate_7beat": 7,
            "abt_documentary": 3,
            "dan_harmon_8beat": 8,
            "pixar_spine": 6,
            "unsolved_mystery": 5
        }
        for formula_name, expected_beats in formulas_expected_counts.items():
            script = self.story_engine.generate_narrative_script(
                topic_or_product=f"Chủ đề thử nghiệm {formula_name}",
                character_identity="Nhà nghiên cứu khoa học",
                core_problem="nghi vấn chưa sáng tỏ",
                core_epiphany="phát hiện đột phá",
                call_to_action="Khám phá ngay",
                formula=formula_name
            )
            self.assertEqual(script.formula, formula_name)
            self.assertEqual(len(script.beats), expected_beats, f"Công thức {formula_name} phải có đúng {expected_beats} beats")
            for beat in script.beats:
                self.assertIsNotNone(beat.beat_id)
                self.assertIsNotNone(beat.visual_action)
                self.assertIsNotNone(beat.cinematic)
                self.assertGreater(len(beat.voiceover), 5)
            
            # Kiểm tra Thư mục trích dẫn nguồn chính thống (Zero Fabrication)
            self.assertIsNotNone(script.sources)
            self.assertGreater(len(script.sources), 0)
            for src in script.sources:
                self.assertIn("name", src)
                self.assertIn("author_or_manufacturer", src)
                self.assertIn("source_url_or_id", src)
                self.assertIn("verified_claims", src)
                self.assertGreater(len(src["name"]), 3)
                self.assertGreater(len(src["source_url_or_id"]), 3)

            # Kiểm tra tương thích phân hệ Veo 3 và Seedance
            veo_pkg = Veo3PromptEngine.format_full_script(script)
            self.assertEqual(len(veo_pkg["shots"]), expected_beats)
            seedance_pkg = SeedancePromptEngine.format_full_multishot_script(script)
            self.assertEqual(len(seedance_pkg["shots"]), expected_beats)

    def test_product_ad_manufacturer_source_citation(self):
        script_ad = self.story_engine.generate_narrative_script(
            topic_or_product="Serum Tái Tạo Da Pro",
            character_identity="Nữ 25 tuổi",
            core_problem="thâm mụn lâu năm",
            core_epiphany="hoạt chất Niacinamide 10%",
            call_to_action="Nhận voucher giảm 40%",
            formula="conversion_aida"
        )
        self.assertIsNotNone(script_ad.sources)
        self.assertGreater(len(script_ad.sources), 0)
        # Bắt buộc có nguồn website chính thức của nhà sản xuất hoặc sản phẩm
        has_official_web = any("official-" in s["source_url_or_id"] or "Nhà sản xuất" in s["author_or_manufacturer"] for s in script_ad.sources)
        self.assertTrue(has_official_web, "Video quảng cáo bắt buộc phải trích xuất từ website chính thức của Nhà sản xuất / Sản phẩm")


if __name__ == "__main__":
    unittest.main()
