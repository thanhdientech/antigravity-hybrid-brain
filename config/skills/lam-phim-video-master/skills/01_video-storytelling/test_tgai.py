import requests
import json
import time
import sys
from pathlib import Path

try:
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
except Exception:
    pass

KEY = "sk_0cad91a0efae9b45054c54da0f173c8a35376a3e936b"
HEADERS = {"xi-api-key": KEY, "Content-Type": "application/json"}

def generate_tts(text: str, voice_id: str, out_path: Path):
    print(f"[+] Requesting TTS: \"{text[:40]}...\" (Voice: {voice_id})")
    url = f"https://api.taogiongai.com/v1/text-to-speech/{voice_id}"
    payload = {
        "text": text,
        "model_id": "eleven_v4",
        "language_code": "vi"
    }
    r = requests.post(url, headers=HEADERS, json=payload, timeout=30)
    if r.status_code != 202:
        raise RuntimeError(f"Error submitting TTS: {r.status_code} - {r.text}")
    task_id = r.json()["id"]
    print(f"  -> Task ID: {task_id}, waiting for completion...")

    poll_url = f"https://api.taogiongai.com/v1/history/{task_id}"
    for _ in range(30):
        time.sleep(2)
        pr = requests.get(poll_url, headers={"xi-api-key": KEY}, timeout=15)
        if pr.status_code == 200:
            data = pr.json()
            print("  [DEBUG POLL DATA]:", json.dumps(data, ensure_ascii=False))
            status = data.get("status")
            if status == "completed":
                audio_url = (data.get("result") or {}).get("audio_url") or data.get("audio_url")
                print(f"  -> Completed! Audio URL: {audio_url}")
                # Download audio with User-Agent
                ar = requests.get(audio_url, headers={"User-Agent": "Mozilla/5.0", "xi-api-key": KEY}, timeout=30)
                if ar.status_code == 200:
                    out_path.parent.mkdir(parents=True, exist_ok=True)
                    out_path.write_bytes(ar.content)
                    print(f"  [✓] Saved to {out_path} ({len(ar.content)} bytes)")
                    return out_path
                else:
                    raise RuntimeError(f"Failed to download audio: {ar.status_code}")
            elif status == "failed":
                raise RuntimeError(f"Task failed: {data}")
    raise TimeoutError("TTS generation timed out.")

if __name__ == "__main__":
    out_file = Path("test_voice_output.mp3")
    generate_tts("Chào Sếp, em là Thu Thảo. Giọng đọc tiếng Việt trên Tạo Giọng AI cực kỳ mượt mà và tự nhiên!", "Jmio6r8OUeqiK3cZ3N0K", out_file)
