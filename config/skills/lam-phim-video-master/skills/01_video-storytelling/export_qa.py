import shutil
import subprocess
from pathlib import Path

video = Path(r"E:\DIEN APP\Xây Kênh Youtube\Tool render edit Video\omniflash\output\ep01_anh_ay_luon_di_ben_ngoai_9x16\ep01_anh_ay_luon_di_ben_ngoai_9x16_sub.mp4")
art_dir = Path(r"C:\Users\INFOASIA\.gemini\antigravity\brain\e1bb566c-6a70-4a40-9357-b06201b6c46a")

# 1. Copy final video to artifact dir
target_video = art_dir / "ep01_anh_ay_luon_di_ben_ngoai_9x16_sub.mp4"
shutil.copy2(video, target_video)
print(f"Copied video: {target_video.stat().st_size} bytes")

# 2. Extract 3 screenshots
shots = [
    ("00:00:03", "qa_shot_01.jpg"),
    ("00:00:16", "qa_shot_02.jpg"),
    ("00:00:30", "qa_shot_03.jpg")
]

for ss, name in shots:
    out_p = art_dir / name
    cmd = ["ffmpeg", "-y", "-ss", ss, "-i", str(video), "-vframes", "1", str(out_p)]
    subprocess.run(cmd, check=True)
    print(f"Extracted {name}: {out_p.stat().st_size} bytes")
