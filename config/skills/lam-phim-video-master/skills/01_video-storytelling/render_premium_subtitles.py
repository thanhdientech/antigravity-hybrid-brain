import subprocess
from pathlib import Path
import shutil

OUT_DIR = Path(r"<WORKSPACE_DIR>\Xây Kênh Youtube\Tool render edit Video\omniflash\output\ep01_anh_ay_luon_di_ben_ngoai_9x16")
ART_DIR = Path(r"%USERPROFILE%\.gemini\antigravity\brain\<session-id>")

raw_video = OUT_DIR / "ep01_anh_ay_luon_di_ben_ngoai_raw.mp4"
ass_file = OUT_DIR / "subtitles_premium_9x16.ass"
final_video = OUT_DIR / "ep01_anh_ay_luon_di_ben_ngoai_9x16_sub.mp4"

# 1. Tạo file ASS phụ đề chuẩn TikTok dọc 9:16
ass_content = """[Script Info]
Title: TikTok Subtitles 9:16
ScriptType: v4.00+
WrapStyle: 0
ScaledBorderAndShadow: yes
PlayResX: 720
PlayResY: 1280

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,32,&H00FFFFFF,&H000000FF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,3.2,1.5,2,30,30,165,1
Style: QuanThoai,Arial,32,&H0038F3FD,&H000000FF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,3.5,1.5,2,30,30,165,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0,0:00:01.20,0:00:05.48,Default,,0,0,0,,Nhiều người nói với mình:\\nyêu ai mà chẳng được, miễn người ta giàu là đủ.
Dialogue: 0,0:00:06.28,0:00:10.56,Default,,0,0,0,,Nhưng hôm đó, mình mải nhìn điện thoại\\nsuýt bước ra giữa làn xe...
Dialogue: 0,0:00:11.36,0:00:16.12,QuanThoai,,0,0,0,,"Đi đường mà cứ cắm mặt vào điện thoại\\ncoi chừng ngã đấy đồ ngốc. Đưa tay đây anh dắt."
Dialogue: 0,0:00:16.92,0:00:21.40,Default,,0,0,0,,Tìm một người nói yêu bạn thì rất dễ...
Dialogue: 0,0:00:21.40,0:00:26.24,Default,,0,0,0,,Nhưng tìm được một người luôn vô thức đi bên ngoài để bảo vệ bạn,\\nđó mới là may mắn lớn nhất cuộc đời.
Dialogue: 0,0:00:27.04,0:00:31.50,QuanThoai,,0,0,0,,Hôm nay, người đi cạnh bạn\\nđã kéo bạn vào lề trong chưa?
"""

ass_file.write_text(ass_content, encoding="utf-8")
print(f"Created ASS subtitle file: {ass_file.name}")

# 2. Burn phụ đề cao cấp với FFmpeg
ass_escaped = str(ass_file.resolve().as_posix()).replace(":", "\\:")
cmd_burn = [
    "ffmpeg", "-y",
    "-i", str(raw_video),
    "-vf", f"ass='{ass_escaped}'",
    "-c:v", "libx264",
    "-preset", "medium",
    "-crf", "18",
    "-c:a", "copy",
    str(final_video)
]
subprocess.run(cmd_burn, check=True)
print(f"Burned premium subtitles successfully: {final_video.stat().st_size} bytes")

# 3. Copy sang artifact directory
target_video = ART_DIR / "ep01_anh_ay_luon_di_ben_ngoai_9x16_sub.mp4"
shutil.copy2(final_video, target_video)
print(f"Copied to artifact dir: {target_video.stat().st_size} bytes")

# 4. Trích xuất lại các screenshots QA
for ss, name in [("00:00:03", "qa_shot_01.jpg"), ("00:00:14", "qa_shot_02.jpg"), ("00:00:29", "qa_shot_03.jpg")]:
    out_p = ART_DIR / name
    cmd = ["ffmpeg", "-y", "-ss", ss, "-i", str(final_video), "-vframes", "1", str(out_p)]
    subprocess.run(cmd, check=True)
    print(f"Updated QA screenshot {name}")
