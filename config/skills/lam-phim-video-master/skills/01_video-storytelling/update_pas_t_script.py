import json
from pathlib import Path

FILE_PATH = Path(r"%USERPROFILE%\.gemini\config\skills\video-storytelling\output\batch_test_all_9_formulas\01_pas_t\storytelling_prompts.json")

with open(FILE_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

# 1. Update character identity & turnaround prompts
data["character_sheet"]["character_identity"] = "Lan, a 25-year-old Vietnamese office woman with natural facial features, shoulder-length black hair, fair sensitive skin"
turnaround_text = (
    "character sheet, model turnaround sheet of Lan, an attractive 25-year-old Vietnamese office woman with natural facial features, "
    "shoulder-length black hair, wearing casual modern streetwear, minimalist beige neutral tone. Four views: full body front view, "
    "full body 3/4 view, side profile view, back view. Same female person, identical facial features, consistent hair and body proportions across all panels. "
    "Neutral clean studio grey background, soft documentary lighting, high detail skin texture, cinematic photorealism, 8k, shot on 35mm lens --ar 16:9"
)
data["character_sheet"]["turnaround_prompt_raw"] = turnaround_text
data["character_sheet"]["flux_prompt"] = turnaround_text
data["character_sheet"]["midjourney_command"] = f"/imagine prompt: {turnaround_text} --v 6.1 --style raw"

# 2. Update story script
story = data["story_script"]
story["character_name"] = "Lan"
story["character_appearance"] = "Lan, an attractive 25-year-old Vietnamese office woman with natural facial features, shoulder-length black hair, wearing fitting modern minimalist beige attire"

# Beat 1
b1 = story["beats"][0]
b1["voiceover"] = "Từng có lúc cô ấy suýt bỏ cuộc, chấp nhận sống chung với làn da kích ứng và bong tróc sau những lần treatment sai cách..."
b1["dialogue"] = 'Lan thì thầm với chính mình, "Mình không thể tiếp tục như thế này nữa..."'
b1["visual_action"] = "Lan, an attractive 25-year-old Vietnamese woman, đứng thẫn thờ nhìn vào gương trong phòng ngủ mờ tối, ánh mắt kiệt sức, bàn tay khẽ chạm lên gò má ửng đỏ đầy mệt mỏi."
b1["camera_movement"] = "Slow push-in, low-angle intimate medium close-up, shallow depth of field focusing on Lan's expression"

# Beat 2
b2 = story["beats"][1]
b2["voiceover"] = "Thử qua đủ liệu trình đắt đỏ, tốn kém hàng triệu đồng nhưng kết quả nhận lại chỉ là sự thất vọng kéo dài."
b2["dialogue"] = None
b2["visual_action"] = "Lan, an attractive 25-year-old Vietnamese woman, thở dài đặt các chai lọ mỹ phẩm không hiệu quả sang một bên bàn làm việc, ánh sáng ban mai bắt đầu le lói qua khe rèm."
b2["camera_movement"] = "Fast tracking shot ngang bàn làm việc, dynamic whip pan sang gương mặt ưu tư của Lan"

# Beat 3
b3 = story["beats"][2]
b3["voiceover"] = "Cho đến khi Lan khám phá ra giải pháp khoa học thực chứng: phục hồi màng lipid tự nhiên với phức hợp Ceramide B5 khóa ẩm đa tầng."
b3["dialogue"] = 'Lan mỉm cười rạng rỡ, "Hóa ra bí quyết phục hồi lại đơn giản và kỳ diệu đến vậy!"'
b3["visual_action"] = "Lan, an attractive 25-year-old Vietnamese woman, mở chiếc hộp thiết kế tối giản sang trọng, cầm sản phẩm Kem Phục Hồi Ceramide B5 trên tay, ánh sáng vàng ấm áp bao trùm không gian."
b3["camera_movement"] = "Macro cinematic tracking shot xoay 45 độ quanh sản phẩm, chuyển nét mượt mà từ sản phẩm sang ánh mắt rạng rỡ của Lan"

# Beat 4
b4 = story["beats"][3]
b4["voiceover"] = "Chỉ sau 2 tuần kiên trì, làn da đã căng bóng, khỏe mạnh trở lại, mang theo sự tự tin rạng rỡ của tuổi trẻ."
b4["dialogue"] = None
b4["visual_action"] = "Lan, an attractive 25-year-old Vietnamese woman with glowing healthy smooth skin, bước đi tự tin trên con phố ngập nắng ban mai, tà áo bay nhẹ trong gió, nụ cười tươi tắn rạng ngời."
b4["camera_movement"] = "Smooth Steadicam tracking shot đi lùi trước mặt Lan, góc rộng điện ảnh cinematic wide angle"

# Beat 5
b5 = story["beats"][4]
b5["voiceover"] = "Đừng để những tổn thương làn da lấy đi nụ cười và sự tự tin của bạn thêm một ngày nào nữa."
b5["dialogue"] = 'Lan nhìn thẳng vào ống kính máy quay mỉm cười, "Hãy bắt đầu hành trình yêu thương làn da cùng Lan ngay hôm nay nhé!"'
b5["visual_action"] = "Lan, an attractive 25-year-old Vietnamese woman, nở nụ cười rạng rỡ nhìn thẳng vào ống kính máy quay, bàn tay khẽ hướng xuống phần banner ưu đãi nổi bật phía dưới."
b5["camera_movement"] = "Eye-level medium portrait shot, bokeh nền phố xá lung linh phía sau, slow push-in"

# 3. Update Veo 3 engine prompts
for idx, shot in enumerate(data["veo3_engine"]["shots"]):
    beat = story["beats"][idx]
    visual = beat["visual_action"]
    cam = beat["camera_movement"]
    dial = beat["dialogue"] or ""
    shot["veo3_prompt"] = (
        f"A cinematic high-end commercial shot. Subject: Lan, an attractive 25-year-old Vietnamese woman with natural hair and facial features. "
        f"Action: {visual}. Camera: {cam}, 85mm portrait lens, shallow depth of field, 8k resolution, photorealistic. "
        f"Lighting: Soft cinematic commercial lighting, clean vibrant commercial color science, authentic skin texture, zero grain. "
        f"{'She speaks with natural emotion: ' + dial if dial else ''}"
    )

with open(FILE_PATH, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("[✓] Đã cập nhật 100% kịch bản PAS-T: Nhân vật Lan (Nữ 25t) đồng nhất 5 cảnh, đầy đủ thoại + dẫn chuyện!")
