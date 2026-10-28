import os
import sys
import subprocess
import time

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

AUTO_EDITOR_EXE = r"<WORKSPACE_DIR>\Xây Kênh Youtube\Tool render edit Video\.venv\Scripts\auto-editor.exe"

def cut_silence(input_path, output_path=None, margin="0.2s", threshold="-24dB"):
    if not os.path.exists(input_path):
        print(f"❌ Lỗi: File đầu vào không tồn tại: {input_path}")
        return False
    
    if not output_path:
        base, ext = os.path.splitext(input_path)
        output_path = f"{base}_clean{ext}"
        
    cmd = [
        AUTO_EDITOR_EXE,
        input_path,
        "--edit", f"audio:threshold={threshold}",
        "--margin", margin,
        "-o", output_path
    ]
    
    print("=" * 60)
    print(f"🎙️ BẮT ĐẦU CẮT KHOẢNG LẶNG VỚI AUTO-EDITOR...")
    print(f"  Input:  {input_path}")
    print(f"  Output: {output_path}")
    print(f"  Margin: {margin} | Threshold: {threshold}")
    print("=" * 60)
    
    t0 = time.time()
    proc = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace")
    elapsed = round(time.time() - t0, 2)
    
    if proc.returncode == 0:
        out_sz = os.path.getsize(output_path) if os.path.exists(output_path) else 0
        print(f"✅ Hoàn thành cắt khoảng lặng trong {elapsed}s! (File: {output_path} - {out_sz:,} bytes)")
        return True
    else:
        print(f"❌ Lỗi khi chạy Auto-Editor (Exit code: {proc.returncode}):")
        print(proc.stderr)
        return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Sử dụng: python run_auto_editor.py <input_file> [margin] [threshold]")
        print("Ví dụ:   python run_auto_editor.py video.mp4 0.15s -25dB")
        sys.exit(1)
        
    inp = sys.argv[1]
    mrg = sys.argv[2] if len(sys.argv) > 2 else "0.2s"
    thr = sys.argv[3] if len(sys.argv) > 3 else "-24dB"
    cut_silence(inp, margin=mrg, threshold=thr)
