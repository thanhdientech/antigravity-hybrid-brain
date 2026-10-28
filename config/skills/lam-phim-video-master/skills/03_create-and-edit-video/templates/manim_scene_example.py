"""
Mẫu Kịch Bản Toán Học Manim: Thuật Toán Tìm Đường A-Star & Hàm Heuristic
Dự án: Create and Edit Video
Chạy render:
  python -m manim -pqh manim_scene_example.py AIAlgorithmExplanation
"""

from manim import *

class AIAlgorithmExplanation(Scene):
    def construct(self):
        # Thiết lập màu nền
        self.camera.background_color = "#0B0F19"

        # 1. Hiển thị Tiêu đề chính
        title = Text("Thuật Toán Tìm Đường A-Star ($A^*$)", font_size=42, color=BLUE_B)
        self.play(Write(title), run_time=1.5)
        self.wait(1)
        self.play(title.animate.to_edge(UP, buff=0.8))

        # 2. Công thức toán học Heuristic f(n) = g(n) + h(n)
        formula = MathTex(
            r"f(n) = g(n) + h(n)",
            font_size=56
        )
        formula.set_color_by_tex(r"f(n)", TEAL_B)
        formula.set_color_by_tex(r"g(n)", GREEN_B)
        formula.set_color_by_tex(r"h(n)", GOLD_B)

        box = SurroundingRectangle(formula, color=BLUE_D, buff=MED_LARGE_BUFF, corner_radius=0.15)

        self.play(Create(box), Write(formula), run_time=1.8)
        self.wait(1.5)

        # 3. Chú thích các thành phần của công thức
        desc_f = Text("f(n): Tổng chi phí ước lượng tối ưu nhỏ nhất", font_size=24, color=TEAL_B).next_to(box, DOWN, buff=0.8)
        desc_g = Text("g(n): Chi phí thực tế đã đi từ điểm xuất phát đến n", font_size=24, color=GREEN_B).next_to(desc_f, DOWN, buff=0.3)
        desc_h = Text("h(n): Hàm Heuristic ước lượng khoảng cách chim bay đến đích", font_size=24, color=GOLD_B).next_to(desc_g, DOWN, buff=0.3)

        self.play(FadeIn(desc_f, shift=UP*0.3), run_time=0.8)
        self.play(FadeIn(desc_g, shift=UP*0.3), run_time=0.8)
        self.play(FadeIn(desc_h, shift=UP*0.3), run_time=0.8)
        self.wait(2.5)

        # 4. Hiệu ứng hạt sáng kết thúc
        conclusion = Text("Toán học chính là phép thuật vận hành thế giới AI!", font_size=28, color=YELLOW_B)
        conclusion.to_edge(DOWN, buff=0.6)
        
        self.play(Write(conclusion), run_time=1.2)
        self.wait(2)
