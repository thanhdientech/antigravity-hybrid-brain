import os
import sys
import json
import time
import subprocess

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

REMOTION_ROOT = r"E:\DIEN APP\Xây Kênh Youtube\Tool render edit Video\omniflash\video-ai-workflow\pro-text-to-video"
RENDER_SCRIPT = os.path.join(REMOTION_ROOT, "scripts", "render-universal.mjs")

def render_remotion(props_json_path, output_mp4_path, audio_path=None, srt_path=None):
    if not os.path.exists(props_json_path):
        print(f"❌ Lỗi: File props JSON không tồn tại: {props_json_path}")
        return False

    raw_mp4 = output_mp4_path.replace(".mp4", "_raw.mp4")
    
    print("=" * 60)
    print(f"🚀 BẮT ĐẦU RENDER REMOTION GPU (UNIVERSAL 16:9)...")
    print(f"  Props:  {props_json_path}")
    print(f"  Output: {raw_mp4}")
    print("=" * 60)
    
    t0 = time.time()
    cmd = ["node", RENDER_SCRIPT, props_json_path, raw_mp4]
    proc = subprocess.run(cmd, cwd=REMOTION_ROOT, capture_output=True, text=True, encoding="utf-8", errors="replace")
    
    if proc.returncode != 0:
        print(f"❌ Lỗi Render Remotion (Exit code: {proc.returncode}):")
        print(proc.stderr[-1000:])
        return False
        
    print(f"✅ Render Remotion GPU hoàn tất trong {round(time.time() - t0, 2)}s!")
    
    # Nếu có audio hoặc phụ đề SRT -> Ghép qua FFmpeg
    if audio_path and os.path.exists(audio_path):
        print("=" * 60)
        print("🎵 MUX ÂM THANH VOICE OVER & ĐỐT PHỤ ĐỀ KARAOKE QUA FFMPEG...")
        print("=" * 60)
        
        cmd_ffmpeg = ["ffmpeg", "-y", "-i", raw_mp4, "-i", audio_path]
        
        if srt_path and os.path.exists(srt_path):
            srt_esc = srt_path.replace("\\", "/").replace(":", "\\:")
            vf = (
                f"subtitles='{srt_esc}':force_style="
                "'FontSize=19,FontName=Segoe UI,PrimaryColour=&H0000FFCC,OutlineColour=&H00000000,"
                "BorderStyle=1,Outline=1.6,Shadow=0,Alignment=2,MarginV=22'"
            )
            cmd_ffmpeg.extend(["-vf", vf])
            
        cmd_ffmpeg.extend([
            "-map", "0:v:0",
            "-map", "1:a:0",
            "-c:v", "libx264",
            "-preset", "fast",
            "-crf", "18",
            "-pix_fmt", "yuv420p",
            "-c:a", "aac",
            "-b:a", "192k",
            "-shortest",
            "-movflags", "+faststart",
            output_mp4_path
        ])
        
        t1 = time.time()
        proc_ff = subprocess.run(cmd_ffmpeg, capture_output=True, text=True, encoding="utf-8", errors="replace")
        if proc_ff.returncode == 0:
            sz = os.path.getsize(output_mp4_path) if os.path.exists(output_mp4_path) else 0
            print(f"🎉 Xuất xưởng video hoàn thiện trong {round(time.time() - t1, 2)}s: {output_mp4_path} ({sz:,} bytes)")
            # Dọn dẹp raw file nếu hoàn tất
            if os.path.exists(raw_mp4) and os.path.exists(output_mp4_path):
                try:
                    os.remove(raw_mp4)
                except:
                    pass
            return True
        else:
            print("❌ Lỗi FFmpeg:")
            print(proc_ff.stderr[-1000:])
            return False
    else:
        # Không có audio riêng -> đổi tên raw thành output
        if os.path.exists(raw_mp4):
            if os.path.exists(output_mp4_path):
                os.remove(output_mp4_path)
            os.rename(raw_mp4, output_mp4_path)
            print(f"🎉 Hoàn thành video không tiếng: {output_mp4_path}")
            return True

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Sử dụng: python run_remotion_render.py <props_json> <output_mp4> [audio_mp3] [sub_srt]")
        sys.exit(1)
        
    props_f = sys.argv[1]
    out_f = sys.argv[2]
    aud_f = sys.argv[3] if len(sys.argv) > 3 else None
    srt_f = sys.argv[4] if len(sys.argv) > 4 else None
    
    render_remotion(props_f, out_f, aud_f, srt_f)
