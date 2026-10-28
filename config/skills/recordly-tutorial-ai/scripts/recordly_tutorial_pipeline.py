#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Recordly Screen Tutorial + AI Voiceover + .SRT + Auto-Zoom Pipeline
===================================================================
Portable, Zero-PII CLI toolkit for Antigravity Agents:
1. Auto-discovers installed Recordly.exe & unpacked native Windows helpers
   (wgc-capture.exe, cursor-monitor.exe, whisper-cli.exe, recordly-gpu-export.exe,
   bundled ffmpeg.exe/ffprobe.exe) plus system FFmpeg and edge-tts.
2. Captures screen or specific application windows at 60fps via wgc-capture.exe
   with optional 30Hz Win32 cursor telemetry (.cursor.json).
3. Transcribes existing rough mic audio via Recordly's bundled whisper-cli.exe.
4. Synthesizes step-by-step AI voiceover explanations (edge-tts Neural Vietnamese
   or multilingual voices), extracts exact WordBoundary timestamps into .SRT & .VTT,
   generates a valid Recordly v2 project (.recordly with audioRegions, autoCaptions,
   zoomRegions, annotationRegions), and renders a ready-to-share tutorial .MP4.
"""

from __future__ import annotations

import argparse
import asyncio
import ctypes
from ctypes import wintypes
import inspect
import json
import math
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile
import threading
import time
import uuid
import wave
from typing import Any, Dict, List, Optional, Tuple

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")


PROJECT_VERSION = 2
DEFAULT_VOICE = "vi-VN-HoaiMyNeural"


def discover_environment() -> Dict[str, Any]:
    """Auto-discover Recordly binaries, FFmpeg/FFprobe, Whisper models, and Edge-TTS."""
    local_app_data = os.environ.get("LOCALAPPDATA", "")
    app_data = os.environ.get("APPDATA", "")
    program_files = os.environ.get("ProgramFiles", "")
    env_override = os.environ.get("RECORDLY_EXE", "").strip()

    candidate_exes: List[Path] = []
    if env_override:
        candidate_exes.append(Path(env_override))
    if local_app_data:
        candidate_exes.append(Path(local_app_data) / "Programs" / "Recordly" / "Recordly.exe")
    if program_files:
        candidate_exes.append(Path(program_files) / "Recordly" / "Recordly.exe")
    which_recordly = shutil.which("Recordly.exe") or shutil.which("recordly")
    if which_recordly:
        candidate_exes.append(Path(which_recordly))

    recordly_exe: Optional[Path] = None
    for cand in candidate_exes:
        if cand.is_file():
            recordly_exe = cand.resolve()
            break

    install_dir = recordly_exe.parent if recordly_exe else None
    native_bin_dir = (
        install_dir
        / "resources"
        / "app.asar.unpacked"
        / "electron"
        / "native"
        / "bin"
        / "win32-x64"
        if install_dir
        else None
    )

    def _check_bin(p: Optional[Path]) -> Optional[str]:
        return str(p) if p and p.is_file() else None

    bundled_ffmpeg = (
        install_dir
        / "resources"
        / "app.asar.unpacked"
        / "node_modules"
        / "ffmpeg-static"
        / "ffmpeg.exe"
        if install_dir
        else None
    )
    bundled_ffprobe = (
        install_dir
        / "resources"
        / "app.asar.unpacked"
        / "node_modules"
        / "ffprobe-static"
        / "bin"
        / "win32"
        / "x64"
        / "ffprobe.exe"
        if install_dir
        else None
    )

    sys_ffmpeg = shutil.which("ffmpeg")
    sys_ffprobe = shutil.which("ffprobe")

    ffmpeg_path = sys_ffmpeg or _check_bin(bundled_ffmpeg)
    ffprobe_path = sys_ffprobe or _check_bin(bundled_ffprobe)

    whisper_model = (
        Path(app_data) / "Recordly" / "whisper" / "ggml-small.bin" if app_data else None
    )

    edge_tts_available = False
    edge_tts_version = None
    try:
        import edge_tts  # type: ignore

        edge_tts_available = True
        edge_tts_version = getattr(edge_tts, "__version__", "installed")
    except Exception:
        edge_tts_available = False

    return {
        "recordly_installed": recordly_exe is not None,
        "recordly_exe": str(recordly_exe) if recordly_exe else None,
        "native_helpers": {
            "wgc_capture": _check_bin(native_bin_dir / "wgc-capture.exe") if native_bin_dir else None,
            "cursor_monitor": _check_bin(native_bin_dir / "cursor-monitor.exe")
            if native_bin_dir
            else None,
            "whisper_cli": _check_bin(native_bin_dir / "whisper-cli.exe") if native_bin_dir else None,
            "gpu_export": _check_bin(native_bin_dir / "recordly-gpu-export.exe")
            if native_bin_dir
            else None,
            "cuda_compositor": _check_bin(native_bin_dir / "recordly-nvidia-cuda-compositor.exe")
            if native_bin_dir
            else None,
        },
        "media_tools": {
            "ffmpeg": ffmpeg_path,
            "ffprobe": ffprobe_path,
            "system_ffmpeg": sys_ffmpeg is not None,
        },
        "whisper_small_model": _check_bin(whisper_model),
        "edge_tts": {
            "available": edge_tts_available,
            "version": edge_tts_version,
            "default_voices": {
                "vi_female": "vi-VN-HoaiMyNeural",
                "vi_male": "vi-VN-NamMinhNeural",
                "en_female": "en-US-AriaNeural",
                "multilingual_male": "en-US-AndrewMultilingualNeural",
            },
        },
    }


def redact_path_for_display(raw_path: Optional[str]) -> Optional[str]:
    """Replace local user profile prefix with %USERPROFILE% / %LOCALAPPDATA% for clean logs."""
    if not raw_path:
        return raw_path
    norm = raw_path
    local_app = os.environ.get("LOCALAPPDATA", "")
    user_prof = os.environ.get("USERPROFILE", "")
    if local_app and norm.lower().startswith(local_app.lower()):
        return "%LOCALAPPDATA%" + norm[len(local_app) :]
    if user_prof and norm.lower().startswith(user_prof.lower()):
        return "%USERPROFILE%" + norm[len(user_prof) :]
    return norm


def probe_media_info(media_path: Path, ffprobe_bin: str) -> Dict[str, Any]:
    """Return duration_ms, width, height, and has_audio for a media file via ffprobe."""
    cmd = [
        ffprobe_bin,
        "-v",
        "error",
        "-show_entries",
        "format=duration:stream=index,codec_type,width,height",
        "-of",
        "json",
        str(media_path),
    ]
    proc = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace")
    if proc.returncode != 0:
        raise RuntimeError(f"ffprobe failed on {media_path.name}: {proc.stderr.strip()}")
    data = json.loads(proc.stdout or "{}")
    duration_sec = float(data.get("format", {}).get("duration", 0.0) or 0.0)
    streams = data.get("streams", []) or []
    has_audio = any(s.get("codec_type") == "audio" for s in streams)
    width = 1920
    height = 1080
    for s in streams:
        if s.get("codec_type") == "video":
            width = int(s.get("width") or 1920)
            height = int(s.get("height") or 1080)
            break
    return {
        "duration_sec": duration_sec,
        "duration_ms": max(1, int(round(duration_sec * 1000))),
        "has_audio": has_audio,
        "width": width,
        "height": height,
    }


def ms_to_srt_ts(total_ms: int) -> str:
    ms = max(0, int(round(total_ms)))
    hours = ms // 3_600_000
    minutes = (ms % 3_600_000) // 60_000
    seconds = (ms % 60_000) // 1000
    millis = ms % 1000
    return f"{hours:02d}:{minutes:02d}:{seconds:02d},{millis:03d}"


def ms_to_vtt_ts(total_ms: int) -> str:
    ms = max(0, int(round(total_ms)))
    hours = ms // 3_600_000
    minutes = (ms % 3_600_000) // 60_000
    seconds = (ms % 60_000) // 1000
    millis = ms % 1000
    return f"{hours:02d}:{minutes:02d}:{seconds:02d}.{millis:03d}"


def serialize_srt(cues: List[Dict[str, Any]]) -> str:
    blocks: List[str] = []
    for idx, cue in enumerate(cues, start=1):
        blocks.append(
            f"{idx}\n{ms_to_srt_ts(cue['startMs'])} --> {ms_to_srt_ts(cue['endMs'])}\n{cue['text']}"
        )
    return "\n\n".join(blocks) + "\n"


def serialize_vtt(cues: List[Dict[str, Any]]) -> str:
    blocks: List[str] = ["WEBVTT", ""]
    for cue in cues:
        blocks.append(
            f"{ms_to_vtt_ts(cue['startMs'])} --> {ms_to_vtt_ts(cue['endMs'])}\n{cue['text']}"
        )
        blocks.append("")
    return "\n".join(blocks)


async def synthesize_step_tts(
    text: str,
    voice: str,
    rate: str,
    out_mp3: Path,
) -> List[Dict[str, Any]]:
    """
    Synthesize a single tutorial explanation step via edge_tts (>=7.3.1 Sec-MS-GEC v2)
    with automatic transient-retry and gTTS resilience fallback.
    Returns relative word boundaries:
    [{"text": word, "relStartMs": ..., "relEndMs": ...}, ...]
    """
    import edge_tts  # type: ignore

    sig = inspect.signature(edge_tts.Communicate.__init__)
    supports_boundary = "boundary" in sig.parameters

    last_err: Optional[Exception] = None
    for attempt in range(3):
        kwargs: Dict[str, Any] = {}
        if rate and rate != "+0%":
            kwargs["rate"] = rate
        if supports_boundary:
            kwargs["boundary"] = "WordBoundary"

        communicate = edge_tts.Communicate(text, voice, **kwargs)
        word_events: List[Dict[str, Any]] = []
        audio_bytes = 0

        try:
            with open(out_mp3, "wb") as audio_file:
                async for chunk in communicate.stream():
                    ctype = chunk.get("type")
                    if ctype == "audio":
                        data = chunk.get("data", b"")
                        audio_file.write(data)
                        audio_bytes += len(data)
                    elif ctype in ("WordBoundary", "SentenceBoundary"):
                        w_text = str(chunk.get("text", "")).strip()
                        offset_ticks = int(chunk.get("offset", 0) or 0)
                        dur_ticks = int(chunk.get("duration", 0) or 0)
                        if w_text:
                            s_ms = max(0, int(round(offset_ticks / 10_000)))
                            e_ms = max(s_ms + 20, int(round((offset_ticks + dur_ticks) / 10_000)))
                            word_events.append(
                                {"text": w_text, "relStartMs": s_ms, "relEndMs": e_ms}
                            )
            if audio_bytes > 100 and out_mp3.is_file():
                return word_events
        except Exception as err:
            last_err = err
            await asyncio.sleep(0.45 * (attempt + 1))

    # Resilience Tier 2: fallback to gTTS if Microsoft Edge WebSocket is temporarily throttled/offline
    try:
        from gtts import gTTS  # type: ignore

        lang_code = (voice.split("-")[0] if "-" in voice else "vi").lower()
        tts = gTTS(text=text, lang=lang_code)
        tts.save(str(out_mp3))
        if out_mp3.is_file() and out_mp3.stat().st_size > 100:
            return []
    except Exception:
        pass

    raise RuntimeError(f"TTS synthesis failed after retries for step '{text[:40]}...': {last_err}")


def build_fallback_words(text: str, clip_dur_ms: int) -> List[Dict[str, Any]]:
    """Proportional word timing fallback if TTS endpoint emits sentence-only boundaries."""
    tokens = [tok.strip() for tok in text.split() if tok.strip()]
    if not tokens:
        return []
    total_chars = sum(max(1, len(t)) for t in tokens)
    usable_ms = max(len(tokens) * 30, clip_dur_ms - 60)
    cursor = 0
    result: List[Dict[str, Any]] = []
    for idx, tok in enumerate(tokens):
        share = int(round((max(1, len(tok)) / total_chars) * usable_ms))
        s_ms = min(cursor, max(0, clip_dur_ms - 2))
        e_ms = clip_dur_ms if idx == len(tokens) - 1 else min(clip_dur_ms, max(s_ms + 20, s_ms + share))
        if e_ms <= s_ms:
            e_ms = s_ms + 1
        result.append({"text": tok, "relStartMs": s_ms, "relEndMs": e_ms})
        cursor = e_ms
    return result


def split_step_into_subtitle_cues(
    step_index: int,
    step_text: str,
    step_start_ms: int,
    step_end_ms: int,
    rel_words: List[Dict[str, Any]],
    max_chars_per_cue: int = 84,
) -> List[Dict[str, Any]]:
    """
    Convert a step's word timings into clean 1-2 line subtitle cues (both for .SRT and
    Recordly's autoCaptions schema with clamped CaptionCueWord[] boundaries).
    """
    if not rel_words:
        rel_words = build_fallback_words(step_text, max(200, step_end_ms - step_start_ms))

    abs_words: List[Dict[str, Any]] = []
    for w_idx, w in enumerate(rel_words):
        ws = max(step_start_ms, min(step_end_ms - 2, step_start_ms + int(w["relStartMs"])))
        we = max(ws + 1, min(step_end_ms, step_start_ms + int(w["relEndMs"])))
        abs_words.append(
            {
                "text": w["text"],
                "startMs": ws,
                "endMs": we,
                "leadingSpace": w_idx > 0,
            }
        )

    cues: List[Dict[str, Any]] = []
    bucket: List[Dict[str, Any]] = []
    bucket_len = 0

    def _flush_bucket() -> None:
        nonlocal bucket, bucket_len
        if not bucket:
            return
        c_start = bucket[0]["startMs"]
        c_end = max(c_start + 120, bucket[-1]["endMs"])
        c_text = " ".join(item["text"] for item in bucket)
        clamped_words: List[Dict[str, Any]] = []
        for idx_w, item in enumerate(bucket):
            ws = max(c_start, min(c_end - 1, item["startMs"]))
            we = max(ws + 1, min(c_end, item["endMs"]))
            word_obj: Dict[str, Any] = {"text": item["text"], "startMs": ws, "endMs": we}
            if idx_w > 0:
                word_obj["leadingSpace"] = True
            clamped_words.append(word_obj)
        cues.append(
            {
                "id": f"caption-{step_index}-{len(cues) + 1}",
                "startMs": c_start,
                "endMs": c_end,
                "text": c_text,
                "words": clamped_words,
            }
        )
        bucket = []
        bucket_len = 0

    for w in abs_words:
        added = len(w["text"]) + (1 if bucket else 0)
        is_clause_break = bucket and bucket[-1]["text"].endswith((".", ";", ":", "!", "?"))
        if bucket and (bucket_len + added > max_chars_per_cue or (is_clause_break and bucket_len >= 38)):
            _flush_bucket()
        bucket.append(w)
        bucket_len += len(w["text"]) + (1 if len(bucket) > 1 else 0)

    _flush_bucket()
    return cues


def assemble_master_voiceover_wav(
    placed_clips: List[Dict[str, Any]],
    total_duration_ms: int,
    ffmpeg_bin: str,
    master_wav: Path,
    master_mp3: Path,
) -> None:
    """
    Sample-accurate PCM timeline assembler (24kHz, 16-bit mono):
    Zero volume loss (avoids FFmpeg amix 1/N attenuation) and zero timestamp drift.
    """
    sample_rate = 24000
    sample_width = 2  # 16-bit signed PCM
    total_frames = max(1, int(round((total_duration_ms / 1000.0) * sample_rate)))

    with tempfile.TemporaryDirectory(prefix="recordly_vo_pcm_") as tmp_dir:
        tmp_dir_path = Path(tmp_dir)
        with wave.open(str(master_wav), "wb") as out_wf:
            out_wf.setnchannels(1)
            out_wf.setsampwidth(sample_width)
            out_wf.setframerate(sample_rate)

            current_frame = 0
            chunk_silence_frames = sample_rate  # 1s buffer unit
            zero_second = b"\x00\x00" * chunk_silence_frames

            def _write_silence(num_frames: int) -> None:
                rem = max(0, num_frames)
                while rem > 0:
                    take = min(rem, chunk_silence_frames)
                    out_wf.writeframesraw(zero_second[: take * sample_width])
                    rem -= take

            for idx, item in enumerate(placed_clips):
                target_frame = int(round((item["startMs"] / 1000.0) * sample_rate))
                if target_frame > current_frame:
                    _write_silence(target_frame - current_frame)
                    current_frame = target_frame

                pcm_wav = tmp_dir_path / f"step_{idx:03d}.wav"
                conv_cmd = [
                    ffmpeg_bin,
                    "-y",
                    "-v",
                    "error",
                    "-i",
                    str(item["clipPath"]),
                    "-ar",
                    str(sample_rate),
                    "-ac",
                    "1",
                    "-c:a",
                    "pcm_s16le",
                    str(pcm_wav),
                ]
                proc = subprocess.run(conv_cmd, capture_output=True, text=True)
                if proc.returncode != 0:
                    raise RuntimeError(f"Failed converting {item['clipPath']} to PCM: {proc.stderr}")

                with wave.open(str(pcm_wav), "rb") as in_wf:
                    n_frames = in_wf.getnframes()
                    raw_pcm = in_wf.readframes(n_frames)
                    out_wf.writeframesraw(raw_pcm)
                    current_frame += n_frames

            if total_frames > current_frame:
                _write_silence(total_frames - current_frame)

    enc_cmd = [
        ffmpeg_bin,
        "-y",
        "-v",
        "error",
        "-i",
        str(master_wav),
        "-c:a",
        "libmp3lame",
        "-b:a",
        "192k",
        str(master_mp3),
    ]
    proc = subprocess.run(enc_cmd, capture_output=True, text=True)
    if proc.returncode != 0:
        shutil.copyfile(master_wav, master_mp3)


def build_recordly_project_v2(
    video_path: Path,
    total_duration_ms: int,
    script_cfg: Dict[str, Any],
    placed_clips: List[Dict[str, Any]],
    all_caption_cues: List[Dict[str, Any]],
) -> Dict[str, Any]:
    """Generate a 100% schema-compliant Recordly v2 (.recordly) EditorProjectData object."""
    zoom_regions: List[Dict[str, Any]] = []
    annotation_regions: List[Dict[str, Any]] = []
    audio_regions: List[Dict[str, Any]] = []

    for idx, clip_info in enumerate(placed_clips, start=1):
        audio_regions.append(
            {
                "id": f"audio-{idx}",
                "startMs": clip_info["startMs"],
                "endMs": clip_info["endMs"],
                "audioPath": str(Path(clip_info["clipPath"]).resolve()).replace("\\", "/"),
                "volume": 1.0,
                "normalize": True,
                "trackIndex": 0,
            }
        )

        step = clip_info["step"]
        s_ms = clip_info["startMs"]
        e_ms = clip_info["endMs"]

        zoom_cfg = step.get("zoom")
        if isinstance(zoom_cfg, dict):
            z_dur_ms = int(round(float(zoom_cfg.get("duration_sec", 0) or 0) * 1000))
            z_end = s_ms + z_dur_ms if z_dur_ms > 200 else max(s_ms + 1200, e_ms)
            z_end = min(total_duration_ms, z_end)
            if z_end > s_ms + 100:
                depth = max(1, min(6, int(zoom_cfg.get("depth", 2))))
                cx = max(0.0, min(1.0, float(zoom_cfg.get("cx", 0.5))))
                cy = max(0.0, min(1.0, float(zoom_cfg.get("cy", 0.5))))
                zoom_regions.append(
                    {
                        "id": f"zoom-{len(zoom_regions) + 1}",
                        "startMs": s_ms,
                        "endMs": z_end,
                        "depth": depth,
                        "focus": {"cx": cx, "cy": cy},
                        "mode": "manual",
                    }
                )

        callout_cfg = step.get("callout")
        if isinstance(callout_cfg, dict) and callout_cfg.get("text"):
            label = str(callout_cfg["text"]).strip()
            annotation_regions.append(
                {
                    "id": f"annotation-{len(annotation_regions) + 1}",
                    "startMs": s_ms,
                    "endMs": min(total_duration_ms, max(s_ms + 1000, e_ms)),
                    "type": "text",
                    "content": label,
                    "textContent": label,
                    "position": {
                        "x": float(callout_cfg.get("x", 50)),
                        "y": float(callout_cfg.get("y", 18)),
                    },
                    "size": {
                        "width": float(callout_cfg.get("width", 32)),
                        "height": float(callout_cfg.get("height", 10)),
                    },
                    "style": {
                        "color": "#FFFFFF",
                        "backgroundColor": "rgba(15, 23, 42, 0.88)",
                        "fontSize": 26,
                        "fontFamily": '"SF Pro Display", "Segoe UI", sans-serif',
                        "fontWeight": "bold",
                        "fontStyle": "normal",
                        "textDecoration": "none",
                        "textAlign": "center",
                        "borderRadius": 10,
                    },
                    "zIndex": len(annotation_regions) + 1,
                    "trackIndex": 0,
                }
            )

        blur_cfg = step.get("blur")
        if isinstance(blur_cfg, dict):
            annotation_regions.append(
                {
                    "id": f"annotation-{len(annotation_regions) + 1}",
                    "startMs": s_ms,
                    "endMs": min(total_duration_ms, max(s_ms + 1000, e_ms)),
                    "type": "blur",
                    "content": "",
                    "position": {
                        "x": float(blur_cfg.get("x", 50)),
                        "y": float(blur_cfg.get("y", 50)),
                    },
                    "size": {
                        "width": float(blur_cfg.get("width", 20)),
                        "height": float(blur_cfg.get("height", 8)),
                    },
                    "style": {
                        "color": "#FFFFFF",
                        "backgroundColor": "transparent",
                        "fontSize": 24,
                        "fontFamily": '"Segoe UI", sans-serif',
                        "fontWeight": "normal",
                        "fontStyle": "normal",
                        "textDecoration": "none",
                        "textAlign": "center",
                        "borderRadius": 8,
                    },
                    "blurIntensity": int(blur_cfg.get("intensity", 28)),
                    "zIndex": len(annotation_regions) + 1,
                    "trackIndex": 1,
                }
            )

    anim_style = str(script_cfg.get("caption_animation", "fade"))
    if anim_style not in ("none", "fade", "rise", "pop"):
        anim_style = "fade"

    aspect_ratio = str(script_cfg.get("aspect_ratio", "16:9"))

    return {
        "version": PROJECT_VERSION,
        "projectId": f"recordly-tutorial-{uuid.uuid4().hex[:8]}",
        "videoPath": str(video_path.resolve()).replace("\\", "/"),
        "editor": {
            "aspectRatio": aspect_ratio,
            "shadowIntensity": 0.67,
            "backgroundBlur": 0,
            "connectZooms": True,
            "zoomInEasing": "recordly",
            "zoomOutEasing": "recordly",
            "connectedZoomEasing": "glide",
            "showCursor": True,
            "loopCursor": False,
            "cursorStyle": "tahoe",
            "cursorClickEffect": "ripple",
            "cursorClickEffectColor": "#2563EB",
            "borderRadius": 8,
            "padding": {"top": 20, "bottom": 20, "left": 20, "right": 20, "linked": True},
            "cropRegion": {"x": 0, "y": 0, "width": 1, "height": 1},
            "clipRegions": [
                {
                    "id": "clip-1",
                    "startMs": 0,
                    "endMs": total_duration_ms,
                    "speed": 1,
                }
            ],
            "zoomRegions": zoom_regions,
            "trimRegions": [],
            "speedRegions": [],
            "annotationRegions": annotation_regions,
            "audioRegions": audio_regions,
            "autoCaptions": all_caption_cues,
            "autoCaptionSettings": {
                "enabled": True,
                "timelineQuickAdd": True,
                "language": "vi",
                "fontFamily": '"SF Pro Text", "Segoe UI", sans-serif',
                "fontSize": 30,
                "bottomOffset": 4,
                "maxWidth": 74,
                "maxRows": 2,
                "animationStyle": anim_style,
                "boxRadius": 16,
                "textColor": "#FFFFFF",
                "inactiveTextColor": "#CBD5E1",
                "backgroundOpacity": 0.88,
            },
        },
    }


def render_final_mp4_ffmpeg(
    video_path: Path,
    master_wav: Path,
    srt_path: Path,
    output_mp4: Path,
    media_info: Dict[str, Any],
    total_duration_ms: int,
    system_audio_volume: float,
    burn_srt: bool,
    ffmpeg_bin: str,
) -> None:
    """
    Mux timeline-aligned AI voiceover with optional ducked system audio, extend last video
    frame if narration finishes slightly after raw video, and optionally burn crisp UTF-8 .SRT.
    """
    outdir = output_mp4.parent
    outdir.mkdir(parents=True, exist_ok=True)

    pad_sec = max(0.0, (total_duration_ms - media_info["duration_ms"]) / 1000.0)
    vf_chain: List[str] = []
    if pad_sec > 0.05:
        vf_chain.append(f"tpad=stop_mode=clone:stop_duration={pad_sec:.3f}")

    tmp_srt = outdir / "_burn_sub_utf8.srt"
    if burn_srt:
        shutil.copyfile(srt_path, tmp_srt)
        style = (
            "FontName=Arial,FontSize=17,PrimaryColour=&H00FFFFFF,"
            "OutlineColour=&H00111827,BackColour=&H990F172A,"
            "BorderStyle=3,Outline=1.2,Shadow=0,MarginV=20,Alignment=2"
        )
        vf_chain.append(
            f"subtitles=filename='_burn_sub_utf8.srt':charenc=UTF-8:force_style='{style}'"
        )

    cmd: List[str] = [
        ffmpeg_bin,
        "-y",
        "-v",
        "error",
        "-i",
        str(video_path.resolve()),
        "-i",
        str(master_wav.resolve()),
    ]

    filter_complex_parts: List[str] = []
    if vf_chain:
        filter_complex_parts.append(f"[0:v]{','.join(vf_chain)}[vout]")
        v_map = "[vout]"
    else:
        v_map = "0:v:0"

    if media_info["has_audio"] and system_audio_volume > 0.001:
        sys_vol = max(0.0, min(1.0, system_audio_volume))
        filter_complex_parts.append(
            f"[0:a]volume={sys_vol:.3f}[bg];"
            f"[1:a]volume=1.0[vo];"
            f"[bg][vo]amix=inputs=2:duration=longest:dropout_transition=0,volume=2.0[aout]"
        )
        a_map = "[aout]"
    else:
        a_map = "1:a:0"

    if filter_complex_parts:
        cmd.extend(["-filter_complex", ";".join(filter_complex_parts)])

    cmd.extend(["-map", v_map, "-map", a_map])

    if vf_chain:
        cmd.extend(["-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p"])
    else:
        cmd.extend(["-c:v", "copy"])

    cmd.extend(["-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", str(output_mp4.resolve())])

    try:
        proc = subprocess.run(
            cmd,
            cwd=str(outdir.resolve()),
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
        )
        if proc.returncode != 0:
            raise RuntimeError(f"FFmpeg mux/burn failed: {proc.stderr.strip()}")
    finally:
        if tmp_srt.exists():
            try:
                tmp_srt.unlink()
            except Exception:
                pass


def run_recordly_smoke_export(
    recordly_exe: str,
    project_path: Path,
    export_mp4_path: Path,
    timeout_sec: int = 180,
) -> Dict[str, Any]:
    """Trigger Recordly.exe built-in automated GPU export (RECORDLY_SMOKE_EXPORT=1)."""
    env = os.environ.copy()
    env["RECORDLY_SMOKE_EXPORT"] = "1"
    env["RECORDLY_SMOKE_EXPORT_PROJECT"] = str(project_path.resolve())
    env["RECORDLY_SMOKE_EXPORT_OUTPUT"] = str(export_mp4_path.resolve())
    env["RECORDLY_SMOKE_EXPORT_QUALITY"] = "good"
    env["RECORDLY_SMOKE_EXPORT_ENCODING_MODE"] = "balanced"

    proc = subprocess.run(
        [recordly_exe],
        env=env,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        timeout=timeout_sec,
    )
    return {
        "returncode": proc.returncode,
        "output_exists": export_mp4_path.is_file(),
        "output_path": str(export_mp4_path.resolve()),
    }


def load_script_config(script_path: Path, video_duration_sec: float) -> Dict[str, Any]:
    """Load JSON tutorial script or plain-text line-by-line steps."""
    raw = script_path.read_text(encoding="utf-8-sig").strip()
    if script_path.suffix.lower() == ".json" or raw.startswith("{") or raw.startswith("["):
        parsed = json.loads(raw)
        if isinstance(parsed, list):
            return {"steps": parsed}
        return parsed

    lines = [ln.strip() for ln in raw.splitlines() if ln.strip() and not ln.strip().startswith("#")]
    if not lines:
        raise ValueError(f"Script file {script_path} contains no tutorial steps.")
    interval = max(2.5, video_duration_sec / max(1, len(lines)))
    steps = [
        {"start_sec": round(i * interval, 2), "text": line}
        for i, line in enumerate(lines)
    ]
    return {"steps": steps}


async def run_build_pipeline(
    video_path: Path,
    script_cfg: Dict[str, Any],
    outdir: Path,
    voice_override: Optional[str],
    burn_srt: bool,
    smoke_export: bool,
) -> Dict[str, Any]:
    env_info = discover_environment()
    ffmpeg_bin = env_info["media_tools"]["ffmpeg"]
    ffprobe_bin = env_info["media_tools"]["ffprobe"]
    if not ffmpeg_bin or not ffprobe_bin:
        raise RuntimeError("FFmpeg / FFprobe not found on system or inside Recordly bundle.")
    if not env_info["edge_tts"]["available"]:
        raise RuntimeError("Python module 'edge_tts' is required. Install with: pip install edge-tts")

    outdir.mkdir(parents=True, exist_ok=True)
    steps_audio_dir = outdir / "steps_audio"
    steps_audio_dir.mkdir(parents=True, exist_ok=True)

    media_info = probe_media_info(video_path, ffprobe_bin)
    voice = voice_override or str(script_cfg.get("voice") or DEFAULT_VOICE)
    base_rate = str(script_cfg.get("rate") or "+0%")
    sys_vol = float(script_cfg.get("system_audio_volume", 0.15))

    steps = script_cfg.get("steps") or []
    if not steps:
        raise ValueError("Script config must contain at least 1 step in 'steps'.")

    sorted_steps = sorted(
        steps,
        key=lambda s: float(s.get("start_sec", float(s.get("startMs", 0)) / 1000.0)),
    )

    placed_clips: List[Dict[str, Any]] = []
    all_caption_cues: List[Dict[str, Any]] = []
    timeline_cursor_ms = 0

    for idx, step in enumerate(sorted_steps, start=1):
        text = str(step.get("text", "")).strip()
        if not text:
            continue
        req_start_ms = int(
            round(
                float(step["startMs"])
                if "startMs" in step
                else float(step.get("start_sec", 0.0)) * 1000.0
            )
        )
        step_voice = str(step.get("voice") or voice)
        step_rate = str(step.get("rate") or base_rate)
        step_mp3 = steps_audio_dir / f"step_{idx:02d}.mp3"

        rel_words = await synthesize_step_tts(text, step_voice, step_rate, step_mp3)
        clip_probe = probe_media_info(step_mp3, ffprobe_bin)
        clip_dur_ms = clip_probe["duration_ms"]

        # Check if narration would collide with next step's requested start; speed up gently if needed
        if idx < len(sorted_steps) and "rate" not in step:
            next_step = sorted_steps[idx]
            next_req_ms = int(
                round(
                    float(next_step["startMs"])
                    if "startMs" in next_step
                    else float(next_step.get("start_sec", 0.0)) * 1000.0
                )
            )
            budget_ms = next_req_ms - max(req_start_ms, timeline_cursor_ms) - 120
            if budget_ms > 800 and clip_dur_ms > budget_ms and clip_dur_ms <= int(budget_ms * 1.25):
                rel_words = await synthesize_step_tts(text, step_voice, "+16%", step_mp3)
                clip_dur_ms = probe_media_info(step_mp3, ffprobe_bin)["duration_ms"]

        actual_start_ms = max(0, req_start_ms, timeline_cursor_ms)
        actual_end_ms = actual_start_ms + clip_dur_ms
        timeline_cursor_ms = actual_end_ms + 140

        cues = split_step_into_subtitle_cues(
            step_index=idx,
            step_text=text,
            step_start_ms=actual_start_ms,
            step_end_ms=actual_end_ms,
            rel_words=rel_words,
        )
        all_caption_cues.extend(cues)
        placed_clips.append(
            {
                "stepIndex": idx,
                "requestedStartMs": req_start_ms,
                "startMs": actual_start_ms,
                "endMs": actual_end_ms,
                "durationMs": clip_dur_ms,
                "clipPath": str(step_mp3.resolve()),
                "text": text,
                "step": step,
            }
        )

    total_duration_ms = max(media_info["duration_ms"], timeline_cursor_ms + 300)
    stem = video_path.stem

    srt_path = outdir / f"{stem}.srt"
    vtt_path = outdir / f"{stem}.vtt"
    master_wav = outdir / f"{stem}_voiceover.wav"
    master_mp3 = outdir / f"{stem}_voiceover.mp3"
    project_path = outdir / f"{stem}.recordly"
    final_mp4 = outdir / f"{stem}_tutorial_final.mp4"

    srt_path.write_text(serialize_srt(all_caption_cues), encoding="utf-8")
    vtt_path.write_text(serialize_vtt(all_caption_cues), encoding="utf-8")

    assemble_master_voiceover_wav(
        placed_clips=placed_clips,
        total_duration_ms=total_duration_ms,
        ffmpeg_bin=ffmpeg_bin,
        master_wav=master_wav,
        master_mp3=master_mp3,
    )

    project_data = build_recordly_project_v2(
        video_path=video_path,
        total_duration_ms=total_duration_ms,
        script_cfg=script_cfg,
        placed_clips=placed_clips,
        all_caption_cues=all_caption_cues,
    )
    project_path.write_text(
        json.dumps(project_data, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    render_final_mp4_ffmpeg(
        video_path=video_path,
        master_wav=master_wav,
        srt_path=srt_path,
        output_mp4=final_mp4,
        media_info=media_info,
        total_duration_ms=total_duration_ms,
        system_audio_volume=sys_vol,
        burn_srt=burn_srt,
        ffmpeg_bin=ffmpeg_bin,
    )

    # Clean up intermediate uncompressed WAV once final MP4 + MP3 are verified
    if master_mp3.is_file() and final_mp4.is_file() and master_wav.exists():
        try:
            master_wav.unlink()
        except Exception:
            pass

    smoke_result = None
    if smoke_export and env_info["recordly_exe"]:
        smoke_mp4 = outdir / f"{stem}_recordly_gpu.mp4"
        smoke_result = run_recordly_smoke_export(
            recordly_exe=env_info["recordly_exe"],
            project_path=project_path,
            export_mp4_path=smoke_mp4,
        )

    final_probe = probe_media_info(final_mp4, ffprobe_bin)
    return {
        "status": "SUCCESS",
        "voice": voice,
        "steps_synthesized": len(placed_clips),
        "subtitle_cues": len(all_caption_cues),
        "outputs": {
            "final_mp4": str(final_mp4.resolve()),
            "srt": str(srt_path.resolve()),
            "vtt": str(vtt_path.resolve()),
            "voiceover_mp3": str(master_mp3.resolve()),
            "recordly_project": str(project_path.resolve()),
        },
        "final_media_probe": final_probe,
        "smoke_export": smoke_result,
    }


def capture_screen_wgc(
    output_mp4: Path,
    duration_sec: float,
    fps: int = 60,
    display_id: int = 0,
    hwnd: int = 0,
    capture_system_audio: bool = False,
    record_cursor: bool = True,
) -> Dict[str, Any]:
    """Capture screen or specific HWND via Recordly's native wgc-capture.exe + 30Hz cursor telemetry."""
    env_info = discover_environment()
    wgc_exe = env_info["native_helpers"]["wgc_capture"]
    if not wgc_exe:
        raise RuntimeError("Recordly native wgc-capture.exe was not found on this machine.")

    output_mp4.parent.mkdir(parents=True, exist_ok=True)
    cfg: Dict[str, Any] = {
        "outputPath": str(output_mp4.resolve()),
        "displayId": display_id,
        "fps": fps,
        "captureSystemAudio": capture_system_audio,
        "captureMic": False,
    }
    if hwnd > 0:
        cfg["windowHandle"] = hwnd

    cursor_samples: List[Dict[str, Any]] = []
    stop_cursor = threading.Event()

    def _poll_win32_cursor(start_perf: float) -> None:
        if os.name != "nt":
            return
        user32 = ctypes.windll.user32
        screen_w = max(1, int(user32.GetSystemMetrics(0)))
        screen_h = max(1, int(user32.GetSystemMetrics(1)))
        pt = wintypes.POINT()
        prev_down = False
        while not stop_cursor.is_set():
            if user32.GetCursorPos(ctypes.byref(pt)):
                t_ms = int(round((time.perf_counter() - start_perf) * 1000))
                left_down = bool(user32.GetAsyncKeyState(0x01) & 0x8000)
                itype = "click" if (left_down and not prev_down) else "move"
                prev_down = left_down
                cursor_samples.append(
                    {
                        "timeMs": t_ms,
                        "cx": round(max(0.0, min(1.0, pt.x / screen_w)), 5),
                        "cy": round(max(0.0, min(1.0, pt.y / screen_h)), 5),
                        "interactionType": itype,
                    }
                )
            time.sleep(0.033)

    proc = subprocess.Popen(
        [wgc_exe, json.dumps(cfg)],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        encoding="utf-8",
        errors="replace",
    )

    started = False
    deadline = time.time() + 12.0
    while time.time() < deadline:
        line = proc.stdout.readline() if proc.stdout else ""
        if "Recording started" in line:
            started = True
            break
        if proc.poll() is not None:
            err = proc.stderr.read() if proc.stderr else ""
            raise RuntimeError(f"wgc-capture exited early: {line} {err}".strip())

    if not started:
        proc.kill()
        raise RuntimeError("Timed out waiting for wgc-capture.exe to report 'Recording started'.")

    t0 = time.perf_counter()
    cursor_thread: Optional[threading.Thread] = None
    if record_cursor:
        cursor_thread = threading.Thread(target=_poll_win32_cursor, args=(t0,), daemon=True)
        cursor_thread.start()

    time.sleep(max(0.5, duration_sec))
    stop_cursor.set()
    if cursor_thread:
        cursor_thread.join(timeout=1.0)

    if proc.stdin:
        proc.stdin.write("stop\n")
        proc.stdin.flush()
    out_stdout, out_stderr = proc.communicate(timeout=30)
    if proc.returncode != 0 or not output_mp4.is_file():
        raise RuntimeError(f"wgc-capture stop error (code {proc.returncode}): {out_stderr.strip()}")

    cursor_json_path: Optional[Path] = None
    if record_cursor and cursor_samples:
        cursor_json_path = output_mp4.with_suffix(output_mp4.suffix + ".cursor.json")
        cursor_json_path.write_text(
            json.dumps({"version": 2, "samples": cursor_samples}, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )

    return {
        "status": "CAPTURED",
        "output_mp4": str(output_mp4.resolve()),
        "cursor_telemetry": str(cursor_json_path.resolve()) if cursor_json_path else None,
        "cursor_sample_count": len(cursor_samples),
        "stdout": out_stdout.strip(),
    }


def transcribe_with_whisper(
    video_path: Path,
    outdir: Path,
    language: str = "vi",
    model_path: Optional[Path] = None,
) -> Dict[str, Any]:
    """Transcribe spoken audio from a recording using Recordly's bundled whisper-cli.exe."""
    env_info = discover_environment()
    whisper_exe = env_info["native_helpers"]["whisper_cli"]
    ffmpeg_bin = env_info["media_tools"]["ffmpeg"]
    if not whisper_exe:
        raise RuntimeError("Bundled whisper-cli.exe not found inside Recordly installation.")
    if not ffmpeg_bin:
        raise RuntimeError("FFmpeg not found.")

    resolved_model = model_path or (
        Path(env_info["whisper_small_model"]) if env_info["whisper_small_model"] else None
    )
    if not resolved_model or not resolved_model.is_file():
        raise RuntimeError(
            "Whisper GGML model file not found. Open Recordly -> Captions once to download ggml-small.bin "
            "or pass --model <path-to-ggml-model.bin>."
        )

    outdir.mkdir(parents=True, exist_ok=True)
    wav_16k = outdir / f"{video_path.stem}_16k.wav"
    out_prefix = outdir / video_path.stem

    ext_cmd = [
        ffmpeg_bin,
        "-y",
        "-v",
        "error",
        "-i",
        str(video_path.resolve()),
        "-ar",
        "16000",
        "-ac",
        "1",
        "-c:a",
        "pcm_s16le",
        str(wav_16k.resolve()),
    ]
    proc = subprocess.run(ext_cmd, capture_output=True, text=True)
    if proc.returncode != 0:
        raise RuntimeError(f"Audio extraction failed: {proc.stderr.strip()}")

    w_cmd = [
        whisper_exe,
        "-m",
        str(resolved_model.resolve()),
        "-f",
        str(wav_16k.resolve()),
        "-l",
        language,
        "-osrt",
        "-of",
        str(out_prefix.resolve()),
    ]
    w_proc = subprocess.run(w_cmd, capture_output=True, text=True, encoding="utf-8", errors="replace")
    if wav_16k.exists():
        try:
            wav_16k.unlink()
        except Exception:
            pass
    srt_file = Path(f"{out_prefix}.srt")
    if w_proc.returncode != 0 or not srt_file.is_file():
        raise RuntimeError(f"whisper-cli failed: {w_proc.stderr.strip()}")

    return {
        "status": "TRANSCRIBED",
        "srt": str(srt_file.resolve()),
    }


def generate_synthetic_ui_demo_video(target_mp4: Path, ffmpeg_bin: str) -> None:
    """Create a realistic 12-second 1280x720 simulated software dashboard recording for --self-test."""
    target_mp4.parent.mkdir(parents=True, exist_ok=True)
    vf = (
        "drawbox=x=0:y=0:w=230:h=720:color=#1E293B@1:t=fill,"
        "drawbox=x=230:y=0:w=1050:h=64:color=#0F172A@1:t=fill,"
        "drawbox=x=265:y=96:w=980:h=110:color=#1E293B@0.95:t=fill,"
        "drawbox=x=265:y=232:w=980:h=440:color=#1E293B@0.75:t=fill,"
        "drawbox=enable='between(t,0.3,3.8)':x=18:y=190:w=194:h=48:color=#3B82F6@0.85:t=fill,"
        "drawbox=enable='between(t,4.0,7.8)':x=540:y=124:w=250:h=52:color=#10B981@0.85:t=fill,"
        "drawbox=enable='between(t,8.0,11.8)':x=1010:y=124:w=205:h=52:color=#F59E0B@0.90:t=fill"
    )
    cmd = [
        ffmpeg_bin,
        "-y",
        "-v",
        "error",
        "-f",
        "lavfi",
        "-i",
        "color=c=#0B1120:s=1280x720:d=12:r=30",
        "-f",
        "lavfi",
        "-i",
        "sine=frequency=520:duration=12",
        "-filter_complex",
        f"[0:v]{vf}[v];[1:a]volume=0.02[a]",
        "-map",
        "[v]",
        "-map",
        "[a]",
        "-c:v",
        "libx264",
        "-preset",
        "ultrafast",
        "-pix_fmt",
        "yuv420p",
        "-c:a",
        "aac",
        "-shortest",
        str(target_mp4.resolve()),
    ]
    proc = subprocess.run(cmd, capture_output=True, text=True)
    if proc.returncode != 0:
        raise RuntimeError(f"Synthetic UI demo video generation failed: {proc.stderr.strip()}")


def run_self_test() -> int:
    print("=== [SELF-TEST] Recordly Tutorial + AI Voiceover + .SRT Pipeline ===")
    env_info = discover_environment()
    redacted_env = json.loads(json.dumps(env_info))
    redacted_env["recordly_exe"] = redact_path_for_display(redacted_env["recordly_exe"])
    for k, v in redacted_env["native_helpers"].items():
        redacted_env["native_helpers"][k] = redact_path_for_display(v)
    for k, v in redacted_env["media_tools"].items():
        if isinstance(v, str):
            redacted_env["media_tools"][k] = redact_path_for_display(v)
    print("[1/4] Environment Discovery:")
    print(json.dumps(redacted_env, ensure_ascii=False, indent=2))

    ffmpeg_bin = env_info["media_tools"]["ffmpeg"]
    ffprobe_bin = env_info["media_tools"]["ffprobe"]
    assert ffmpeg_bin and ffprobe_bin, "FFmpeg & FFprobe must be available"
    assert env_info["edge_tts"]["available"], "edge_tts Python module must be installed"

    sample_script_path = Path(__file__).resolve().parent.parent / "examples" / "sample_tutorial_steps.json"
    assert sample_script_path.is_file(), f"Missing sample script: {sample_script_path}"

    with tempfile.TemporaryDirectory(prefix="recordly_tutorial_selftest_") as tmp_dir:
        tmp_path = Path(tmp_dir)
        raw_video = tmp_path / "demo_erp_report.mp4"
        out_dir = tmp_path / "output"

        print("[2/4] Generating 12s simulated software UI recording...")
        generate_synthetic_ui_demo_video(raw_video, ffmpeg_bin)
        assert raw_video.is_file() and raw_video.stat().st_size > 10_000

        print("[3/4] Synthesizing Vietnamese AI voiceover (vi-VN-HoaiMyNeural) + .SRT + .recordly v2 + burned MP4...")
        script_cfg = load_script_config(sample_script_path, 12.0)
        result = asyncio.run(
            run_build_pipeline(
                video_path=raw_video,
                script_cfg=script_cfg,
                outdir=out_dir,
                voice_override="vi-VN-HoaiMyNeural",
                burn_srt=True,
                smoke_export=False,
            )
        )

        print("[4/4] Verifying all 5 output artifacts & Recordly v2 JSON schema...")
        outputs = result["outputs"]
        for key, fpath in outputs.items():
            p = Path(fpath)
            assert p.is_file() and p.stat().st_size > 100, f"Artifact {key} invalid or empty: {p}"

        srt_text = Path(outputs["srt"]).read_text(encoding="utf-8")
        assert "-->" in srt_text and "Bước một" in srt_text, "SRT content validation failed"

        proj_json = json.loads(Path(outputs["recordly_project"]).read_text(encoding="utf-8"))
        assert proj_json["version"] == 2
        assert len(proj_json["editor"]["audioRegions"]) == 3
        assert len(proj_json["editor"]["zoomRegions"]) == 3
        assert len(proj_json["editor"]["autoCaptions"]) >= 3
        assert proj_json["editor"]["autoCaptionSettings"]["enabled"] is True

        probe = result["final_media_probe"]
        assert probe["has_audio"] is True and probe["duration_sec"] >= 11.5

        print(
            f"[PASS] Self-Test 100% OK! Steps={result['steps_synthesized']} | "
            f"Cues={result['subtitle_cues']} | Final MP4={probe['width']}x{probe['height']} "
            f"({probe['duration_sec']:.2f}s, audio={probe['has_audio']})"
        )
    return 0


def build_arg_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Recordly Screen Tutorial + AI Voiceover + .SRT + Auto-Zoom Pipeline"
    )
    parser.add_argument(
        "--self-test",
        action="store_true",
        help="Run end-to-end automated verification test (UI video + Vietnamese TTS + .SRT + .recordly + .MP4)",
    )
    sub = parser.add_subparsers(dest="command")

    sub.add_parser("discover", help="Auto-discover Recordly.exe, native helpers, FFmpeg, and Edge-TTS")

    p_build = sub.add_parser(
        "build",
        help="Generate AI voiceover, synchronized .SRT/.VTT, .recordly v2 project, and final tutorial .MP4",
    )
    p_build.add_argument("--video", required=True, help="Path to raw screen recording (.mp4/.webm/.mkv)")
    p_build.add_argument("--script", required=True, help="Path to tutorial steps (.json or .txt)")
    p_build.add_argument("--outdir", required=True, help="Output directory for generated tutorial assets")
    p_build.add_argument("--voice", default=None, help=f"Edge-TTS voice (default: {DEFAULT_VOICE})")
    p_build.add_argument(
        "--burn-srt",
        action="store_true",
        help="Burn crisp UTF-8 subtitles directly onto the output .MP4 video",
    )
    p_build.add_argument(
        "--smoke-export",
        action="store_true",
        help="Also trigger Recordly.exe GPU smoke export (RECORDLY_SMOKE_EXPORT=1)",
    )

    p_cap = sub.add_parser("capture", help="Record screen or window at 60fps via Recordly wgc-capture.exe")
    p_cap.add_argument("--output", required=True, help="Target .mp4 path")
    p_cap.add_argument("--duration", type=float, default=10.0, help="Recording duration in seconds")
    p_cap.add_argument("--fps", type=int, default=60, help="Capture frame rate (default: 60)")
    p_cap.add_argument("--display-id", type=int, default=0, help="Monitor display index (default: 0)")
    p_cap.add_argument("--hwnd", type=int, default=0, help="Optional Win32 HWND to capture a single window")
    p_cap.add_argument("--system-audio", action="store_true", help="Capture WASAPI loopback system audio")
    p_cap.add_argument(
        "--record-cursor",
        action="store_true",
        default=True,
        help="Record 30Hz Win32 cursor telemetry (.cursor.json)",
    )

    p_trans = sub.add_parser(
        "transcribe",
        help="Transcribe existing spoken audio from a recording using Recordly whisper-cli.exe",
    )
    p_trans.add_argument("--video", required=True, help="Input video file with mic audio")
    p_trans.add_argument("--outdir", required=True, help="Output directory for .srt transcript")
    p_trans.add_argument("--language", default="vi", help="Spoken language code (default: vi)")
    p_trans.add_argument("--model", default=None, help="Optional path to Whisper GGML .bin model")

    return parser


def main() -> int:
    parser = build_arg_parser()
    args = parser.parse_args()

    if args.self_test:
        return run_self_test()

    if args.command == "discover":
        info = discover_environment()
        print(json.dumps(info, ensure_ascii=False, indent=2))
        return 0

    if args.command == "build":
        video_p = Path(args.video)
        script_p = Path(args.script)
        out_p = Path(args.outdir)
        if not video_p.is_file():
            print(f"ERROR: Video file not found: {video_p}", file=sys.stderr)
            return 1
        if not script_p.is_file():
            print(f"ERROR: Script file not found: {script_p}", file=sys.stderr)
            return 1
        env_info = discover_environment()
        ffprobe_bin = env_info["media_tools"]["ffprobe"]
        dur_sec = probe_media_info(video_p, ffprobe_bin)["duration_sec"] if ffprobe_bin else 30.0
        cfg = load_script_config(script_p, dur_sec)
        res = asyncio.run(
            run_build_pipeline(
                video_path=video_p,
                script_cfg=cfg,
                outdir=out_p,
                voice_override=args.voice,
                burn_srt=args.burn_srt,
                smoke_export=args.smoke_export,
            )
        )
        print(json.dumps(res, ensure_ascii=False, indent=2))
        return 0

    if args.command == "capture":
        res = capture_screen_wgc(
            output_mp4=Path(args.output),
            duration_sec=args.duration,
            fps=args.fps,
            display_id=args.display_id,
            hwnd=args.hwnd,
            capture_system_audio=args.system_audio,
            record_cursor=args.record_cursor,
        )
        print(json.dumps(res, ensure_ascii=False, indent=2))
        return 0

    if args.command == "transcribe":
        res = transcribe_with_whisper(
            video_path=Path(args.video),
            outdir=Path(args.outdir),
            language=args.language,
            model_path=Path(args.model) if args.model else None,
        )
        print(json.dumps(res, ensure_ascii=False, indent=2))
        return 0

    parser.print_help()
    return 0


if __name__ == "__main__":
    sys.exit(main())
