# -*- coding: utf-8 -*-
"""
Antigravity Unified MCP Server
Exposes:
1. Video Downloader & Deep Scan Engine via Remote Server (http://192.168.42.29:8088)
   Focused exclusively on YouTube, Facebook, and TikTok.
2. Local Video Download & Metadata Extraction Tools (YouTube, Facebook, TikTok)
3. Omni-Browser Automation Suite (Cốc Cốc, Chrome multi-profile, Facebook auto-posting)
All via the Model Context Protocol (MCP stdio transport).
"""

import os
import sys
import json
import base64
import time
import re
import io
import zipfile
import urllib.request
import urllib.parse
import urllib.error
from typing import Optional, List, Dict, Any

try:
    from mcp.server.mcpserver import MCPServer
except ImportError:
    from mcp.server.fastmcp import FastMCP as MCPServer

# Initialize MCP Server
mcp = MCPServer("antigravity-tools")

# Configuration constants
BRIDGE_HTTP_URL = os.environ.get("BROWSER_BRIDGE_URL", "http://127.0.0.1:8766")
SERVER_BASE_URL = os.environ.get("DOWNLOADER_SERVER_URL", "http://202.43.110.175:8088")
SERVER_ADMIN_USER = os.environ.get("DOWNLOADER_ADMIN_USER", "admin")
SERVER_ADMIN_PASS = os.environ.get("DOWNLOADER_ADMIN_PASS", "Infoasia@2025%")
DEFAULT_DOWNLOAD_DIR = os.environ.get("DOWNLOAD_DIR", r"E:\DIEN APP\Skill AI\downloads")

# Internal token cache
_SERVER_TOKEN: Optional[str] = None
_TOKEN_EXPIRY: float = 0.0


def log_debug(msg: str):
    """Log to stderr to keep stdout 100% pristine for MCP JSON-RPC protocol."""
    sys.stderr.write(f"[Antigravity MCP] {msg}\n")
    sys.stderr.flush()


# ==============================================================================
# SERVER 192.168.42.29:8088 CLIENT & AUTH HELPERS
# ==============================================================================

def get_server_token(force_refresh: bool = False) -> Optional[str]:
    """Retrieve or refresh JWT Bearer token for Server 192.168.42.29:8088."""
    global _SERVER_TOKEN, _TOKEN_EXPIRY
    now = time.time()
    if not force_refresh and _SERVER_TOKEN and now < _TOKEN_EXPIRY:
        return _SERVER_TOKEN

    log_debug(f"Authenticating with Downloader Server ({SERVER_BASE_URL})...")
    url = f"{SERVER_BASE_URL}/api/auth/login"
    payload = json.dumps({
        "username": SERVER_ADMIN_USER,
        "password": SERVER_ADMIN_PASS
    }).encode("utf-8")

    req = urllib.request.Request(
        url,
        data=payload,
        headers={"Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            if data.get("success") and data.get("token"):
                _SERVER_TOKEN = data["token"]
                _TOKEN_EXPIRY = now + 86400 * 6  # Cache token for 6 days
                log_debug(f"Auth success! Credits: {data.get('user', {}).get('credits')}")
                return _SERVER_TOKEN
    except Exception as e:
        log_debug(f"Auth error with {SERVER_BASE_URL}: {e}")
    return None


def call_server_api(endpoint: str, method: str = "GET", payload: Optional[dict] = None, timeout: int = 30) -> dict:
    """Make authenticated HTTP request to Server 192.168.42.29:8088."""
    token = get_server_token()
    url = f"{SERVER_BASE_URL}{endpoint}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"

    data_bytes = json.dumps(payload).encode("utf-8") if payload is not None else None
    req = urllib.request.Request(url, data=data_bytes, headers=headers, method=method)

    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            raw = resp.read().decode("utf-8")
            return json.loads(raw)
    except urllib.error.HTTPError as he:
        if he.code == 401:
            log_debug("Token expired or unauthorized, retrying with fresh token...")
            fresh_token = get_server_token(force_refresh=True)
            if fresh_token:
                headers["Authorization"] = f"Bearer {fresh_token}"
                req_retry = urllib.request.Request(url, data=data_bytes, headers=headers, method=method)
                with urllib.request.urlopen(req_retry, timeout=timeout) as retry_resp:
                    return json.loads(retry_resp.read().decode("utf-8"))
        try:
            err_body = he.read().decode("utf-8")
            return {"status": "error", "code": he.code, "error": err_body}
        except Exception:
            return {"status": "error", "code": he.code, "error": str(he)}
    except Exception as e:
        return {"status": "error", "error": str(e)}


# ==============================================================================
# BROWSER BRIDGE HELPER
# ==============================================================================

def call_bridge(action_dict: dict, timeout: int = 60) -> dict:
    """Send action command to Omni-Browser Bridge on 127.0.0.1:8766."""
    url = f"{BRIDGE_HTTP_URL}/action"
    data = json.dumps(action_dict).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        return {"status": "error", "error": str(e)}


# ==============================================================================
# 1. REMOTE DOWNLOADER SERVER TOOLS (http://192.168.42.29:8088)
# Target Platforms: YouTube, Facebook, TikTok (Strictly No Douyin/Ixigua)
# ==============================================================================

@mcp.tool()
def server_status() -> str:
    """
    Kiểm tra trạng thái kết nối tới máy chủ tải video (http://192.168.42.29:8088).
    Trả về thông tin tài khoản Admin, số dư Credits, gói cước và độ trễ phản hồi.
    """
    start_t = time.time()
    token = get_server_token()
    if not token:
        return json.dumps({
            "status": "error",
            "server_url": SERVER_BASE_URL,
            "error": f"Không thể đăng nhập máy chủ {SERVER_BASE_URL} bằng tài khoản {SERVER_ADMIN_USER}"
        }, ensure_ascii=False, indent=2)

    res = call_server_api("/api/auth/me", method="GET")
    latency_ms = round((time.time() - start_t) * 1000, 1)

    if res.get("authenticated") and res.get("user"):
        u = res["user"]
        return json.dumps({
            "status": "online",
            "server_url": SERVER_BASE_URL,
            "latency_ms": latency_ms,
            "username": u.get("username"),
            "role": u.get("role"),
            "tier": u.get("tier"),
            "credits": u.get("credits"),
            "target_platforms": ["YouTube", "Facebook", "TikTok"]
        }, ensure_ascii=False, indent=2)

    return json.dumps({"status": "unreachable", "raw": res}, ensure_ascii=False, indent=2)


@mcp.tool()
def server_search_videos(
    query: str,
    platform: str = "youtube",
    max_results: int = 10,
    mode: str = "keyword"
) -> str:
    """
    Tìm kiếm video trên YouTube, TikTok hoặc Facebook qua máy chủ http://192.168.42.29:8088.
    
    Args:
        query: Từ khóa tìm kiếm hoặc URL kênh cần quét
        platform: Nền tảng cần quét ('youtube', 'tiktok', 'facebook', hoặc 'all')
        max_results: Số lượng video tối đa cần tìm (mặc định: 10)
        mode: Chế độ tìm kiếm ('keyword' cho từ khóa, 'channel' cho quét cả kênh)
    """
    # Chuẩn hóa platform, loại bỏ douyin/ixigua
    plat = platform.lower().strip()
    if plat not in ["youtube", "tiktok", "facebook", "all"]:
        plat = "youtube"

    log_debug(f"Server search: query='{query}', platform='{plat}', mode='{mode}'")
    payload = {
        "mode": mode,
        "query": query,
        "platform": plat,
        "max_results": max_results
    }
    res = call_server_api("/api/search", method="POST", payload=payload, timeout=40)
    return json.dumps(res, ensure_ascii=False, indent=2)


@mcp.tool()
def server_deep_scan(url: str, max_comments: int = 20) -> str:
    """
    Quét sâu video (YouTube, Facebook, TikTok) qua máy chủ http://192.168.42.29:8088.
    Bóc tách toàn diện: Tiêu đề chuẩn, kênh, mô tả, từ khóa SEO, toàn văn phụ đề/transcript (.txt/.srt) 
    và danh sách các bình luận hot/tương tác cao nhất.
    
    Args:
        url: Link video từ YouTube, Facebook, hoặc TikTok
        max_comments: Số lượng bình luận hot nhất cần bóc tách (mặc định: 20)
    """
    log_debug(f"Server deep scan for: {url}")
    payload = {
        "url": url,
        "max_comments": max_comments
    }
    res = call_server_api("/api/deep-scan", method="POST", payload=payload, timeout=45)
    return json.dumps(res, ensure_ascii=False, indent=2)


@mcp.tool()
def server_batch_download(
    video_urls: List[str],
    folder_name: str = "agent_batch",
    format_type: str = "best_mp4",
    download_video: bool = True,
    download_transcript: bool = True,
    download_keywords: bool = True,
    download_comments: bool = True
) -> str:
    """
    Khởi chạy tiến trình tải hàng loạt (Batch Download) trên máy chủ http://192.168.42.29:8088.
    Hỗ trợ tải video chất lượng cao (YouTube, Facebook, TikTok) kèm tự động đóng gói ZIP và bóc tách dữ liệu.
    
    Args:
        video_urls: Danh sách các link video cần tải
        folder_name: Tên thư mục gom nhóm trên server (ví dụ: 'tin_tuc_ai', 'reels_viral')
        format_type: 'best_mp4' (video gốc nét nhất) hoặc 'best_audio' (chỉ tách mp3)
        download_video: True nếu tải file video mp4
        download_transcript: True nếu muốn trích xuất phụ đề/transcript
        download_keywords: True nếu muốn trích xuất danh sách tags/từ khóa SEO
        download_comments: True nếu muốn trích xuất danh sách bình luận
    """
    if not video_urls:
        return json.dumps({"status": "error", "error": "Danh sách video_urls trống!"}, ensure_ascii=False)

    videos_payload = [{"url": u.strip(), "platform": "auto"} for u in video_urls if u.strip()]
    payload = {
        "videos": videos_payload,
        "folder_name": folder_name,
        "format_type": format_type,
        "download_video": download_video,
        "download_transcript": download_transcript,
        "download_keywords": download_keywords,
        "download_comments": download_comments
    }
    log_debug(f"Starting server batch download: {len(videos_payload)} videos, folder='{folder_name}'")
    res = call_server_api("/api/download", method="POST", payload=payload, timeout=20)
    return json.dumps(res, ensure_ascii=False, indent=2)


@mcp.tool()
def server_task_status(batch_id: str) -> str:
    """
    Kiểm tra tiến trình và trạng thái tải của một batch trên máy chủ http://192.168.42.29:8088.
    
    Args:
        batch_id: Mã ID của phiên tải (lấy từ kết quả của server_batch_download)
    """
    res = call_server_api(f"/api/tasks/{batch_id}", method="GET", timeout=10)
    return json.dumps(res, ensure_ascii=False, indent=2)


@mcp.tool()
def server_download_zip(batch_id: str, save_path: str = "") -> str:
    """
    Tải file ZIP đóng gói thành phẩm từ máy chủ http://192.168.42.29:8088 về máy tính client.
    
    Args:
        batch_id: Mã ID của phiên tải đã hoàn tất (status: 'finished')
        save_path: Đường dẫn lưu file .zip trên máy tính (nếu để trống, tự động lưu vào E:\\DIEN APP\\Skill AI\\downloads)
    """
    url = f"{SERVER_BASE_URL}/api/download-zip/{batch_id}"
    target_path = save_path.strip() if save_path.strip() else os.path.join(DEFAULT_DOWNLOAD_DIR, f"batch_{batch_id}.zip")
    os.makedirs(os.path.dirname(os.path.abspath(target_path)), exist_ok=True)

    log_debug(f"Downloading ZIP for batch {batch_id} to: {target_path}")
    try:
        token = get_server_token()
        headers = {}
        if token:
            headers["Authorization"] = f"Bearer {token}"
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=120) as resp:
            data = resp.read()
            with open(target_path, "wb") as f:
                f.write(data)
            return json.dumps({
                "status": "success",
                "batch_id": batch_id,
                "saved_to": target_path,
                "file_size_bytes": len(data)
            }, ensure_ascii=False, indent=2)
    except Exception as e:
        return json.dumps({"status": "error", "error": str(e)}, ensure_ascii=False)


@mcp.tool()
def server_quick_download(
    url: str,
    output_dir: str = "",
    format_type: str = "best_mp4",
    download_transcript: bool = True,
    download_keywords: bool = True
) -> str:
    """
    Tải nhanh 1-chạm một video từ YouTube, Facebook, hoặc TikTok qua máy chủ http://192.168.42.29:8088.
    Tự động khởi tạo phiên tải trên server, chờ xử lý xong, tải file ZIP về và giải nén ngay vào thư mục máy tính của Sếp.
    
    Args:
        url: Link video YouTube, Facebook, hoặc TikTok cần tải
        output_dir: Thư mục lưu kết quả trên máy tính (mặc định: E:\\DIEN APP\\Skill AI\\downloads\\quick_downloads)
        format_type: 'best_mp4' hoặc 'best_audio'
        download_transcript: True nếu muốn lấy phụ đề
        download_keywords: True nếu muốn lấy từ khóa SEO
    """
    target_dir = output_dir.strip() if output_dir.strip() else os.path.join(DEFAULT_DOWNLOAD_DIR, "quick_downloads")
    os.makedirs(target_dir, exist_ok=True)

    log_debug(f"Quick download via server 42.29 for: {url}")
    # 1. Khởi tạo download trên server
    dl_res = call_server_api("/api/download", method="POST", payload={
        "videos": [{"url": url, "title": "quick_video", "platform": "auto"}],
        "folder_name": "quick_dl",
        "format_type": format_type,
        "download_video": True,
        "download_transcript": download_transcript,
        "download_keywords": download_keywords,
        "download_comments": False
    }, timeout=15)

    if not dl_res.get("success") or not dl_res.get("batch_id"):
        return json.dumps({"status": "error", "error": "Khởi tạo download trên server thất bại", "detail": dl_res}, ensure_ascii=False)

    batch_id = dl_res["batch_id"]
    log_debug(f"Batch created: {batch_id}. Polling status...")

    # 2. Polling chờ hoàn tất (tối đa 60s)
    finished = False
    for _ in range(30):
        time.sleep(2)
        status_res = call_server_api(f"/api/tasks/{batch_id}", method="GET", timeout=10)
        batch_info = status_res.get("batch", {})
        if batch_info.get("status") == "finished":
            finished = True
            break
        elif batch_info.get("status") == "failed":
            return json.dumps({"status": "error", "error": "Server xử lý video thất bại", "batch": batch_info}, ensure_ascii=False)

    if not finished:
        return json.dumps({
            "status": "pending",
            "message": f"Video đang được xử lý trên server. Sử dụng server_task_status('{batch_id}') để kiểm tra tiếp.",
            "batch_id": batch_id
        }, ensure_ascii=False)

    # 3. Kéo ZIP về và giải nén trực tiếp vào target_dir
    zip_url = f"{SERVER_BASE_URL}/api/download-zip/{batch_id}"
    try:
        token = get_server_token()
        headers = {"Authorization": f"Bearer {token}"} if token else {}
        req = urllib.request.Request(zip_url, headers=headers)
        with urllib.request.urlopen(req, timeout=60) as resp:
            zip_bytes = resp.read()
            with zipfile.ZipFile(io.BytesIO(zip_bytes)) as zf:
                zf.extractall(target_dir)
                extracted_files = [os.path.join(target_dir, name) for name in zf.namelist()]

        return json.dumps({
            "status": "success",
            "batch_id": batch_id,
            "target_dir": target_dir,
            "files": extracted_files
        }, ensure_ascii=False, indent=2)
    except Exception as e:
        return json.dumps({"status": "error", "error": f"Lỗi giải nén ZIP: {e}"}, ensure_ascii=False)


# ==============================================================================
# 2. LOCAL / DIRECT VIDEO TOOLS (YouTube, Facebook, TikTok)
# ==============================================================================

@mcp.tool()
def get_video_info(url: str) -> str:
    """
    Trích xuất siêu dữ liệu (metadata) của video từ YouTube, Facebook, TikTok mà không cần tải file về.
    Trả về tiêu đề, kênh/tác giả, thời lượng, số lượt xem, mô tả, từ khóa/tags.
    
    Args:
        url: Đường dẫn video (YouTube, Facebook, TikTok)
    """
    log_debug(f"Getting video info for: {url}")
    try:
        import yt_dlp
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'skip_download': True,
            'extract_flat': False
        }
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            res = {
                "title": info.get("title"),
                "channel": info.get("uploader") or info.get("channel"),
                "channel_id": info.get("channel_id"),
                "duration_seconds": info.get("duration"),
                "view_count": info.get("view_count"),
                "like_count": info.get("like_count"),
                "upload_date": info.get("upload_date"),
                "description": (info.get("description") or "")[:500],
                "tags": info.get("tags", []),
                "thumbnail": info.get("thumbnail"),
                "webpage_url": info.get("webpage_url") or url
            }
            return json.dumps({"status": "success", "data": res}, ensure_ascii=False, indent=2)
    except Exception as e:
        log_debug(f"Error in get_video_info: {e}")
        return json.dumps({"status": "error", "error": str(e)}, ensure_ascii=False)


@mcp.tool()
def download_video(
    url: str,
    output_dir: str = "",
    extract_transcript: bool = True,
    extract_keywords: bool = True,
    format_type: str = "best_mp4"
) -> str:
    """
    Tải video chất lượng cao nhất (Full HD / 4K gộp audio) trực tiếp từ YouTube, Facebook, TikTok.
    Tự động bóc tách phụ đề/transcript (.srt, .txt) và từ khóa SEO (.txt).
    
    Args:
        url: Link video cần tải (YouTube, Facebook, TikTok)
        output_dir: Thư mục lưu file trên máy tính (nếu để trống, lưu vào E:\\DIEN APP\\Skill AI\\downloads)
        extract_transcript: True nếu muốn trích xuất phụ đề/transcript
        extract_keywords: True nếu muốn lưu danh sách từ khóa/tags
        format_type: 'best_mp4' (video gốc nét nhất) hoặc 'best_audio' (chỉ lấy mp3)
    """
    log_debug(f"Downloading video: {url} (format: {format_type})")
    target_dir = output_dir.strip() if output_dir.strip() else DEFAULT_DOWNLOAD_DIR
    os.makedirs(target_dir, exist_ok=True)

    try:
        import yt_dlp
        out_template = os.path.join(target_dir, "%(title)s.%(ext)s")
        ydl_opts = {
            'outtmpl': out_template,
            'quiet': True,
            'no_warnings': True,
        }
        if format_type == "best_audio":
            ydl_opts.update({
                'format': 'bestaudio/best',
                'postprocessors': [{
                    'key': 'FFmpegExtractAudio',
                    'preferredcodec': 'mp3',
                    'preferredquality': '192',
                }]
            })
        else:
            ydl_opts.update({
                'format': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
                'merge_output_format': 'mp4'
            })

        if extract_transcript:
            ydl_opts.update({
                'writesubtitles': True,
                'writeautomaticsub': True,
                'subtitleslangs': ['vi', 'en'],
                'subtitlesformat': 'srt'
            })

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            title = info.get("title") or "video"
            safe_title = re.sub(r'[\\/*?:"<>|]', '_', title)[:100]

            if extract_keywords:
                kw_file = os.path.join(target_dir, f"{safe_title}_keywords.txt")
                with open(kw_file, "w", encoding="utf-8-sig") as f:
                    f.write(f"TIÊU ĐỀ: {title}\n")
                    f.write(f"TÁC GIẢ: {info.get('uploader') or info.get('channel')}\n")
                    f.write(f"LINK: {url}\n\n")
                    f.write(f"TAGS: {', '.join(info.get('tags') or [])}\n")
                    f.write(f"MÔ TẢ:\n{info.get('description') or ''}\n")

            downloaded_file = ydl.prepare_filename(info)
            if format_type == "best_audio":
                downloaded_file = os.path.splitext(downloaded_file)[0] + ".mp3"
            elif not os.path.exists(downloaded_file):
                mp4_cand = os.path.splitext(downloaded_file)[0] + ".mp4"
                if os.path.exists(mp4_cand):
                    downloaded_file = mp4_cand

            return json.dumps({
                "status": "success",
                "title": title,
                "saved_to": downloaded_file,
                "folder": target_dir,
                "uploader": info.get("uploader"),
                "duration": info.get("duration")
            }, ensure_ascii=False, indent=2)

    except Exception as e:
        log_debug(f"Download error: {e}")
        return json.dumps({"status": "error", "error": str(e)}, ensure_ascii=False)


@mcp.tool()
def search_videos(query: str, limit: int = 5) -> str:
    """
    Tìm kiếm video trên YouTube theo từ khóa trực tiếp.
    
    Args:
        query: Từ khóa tìm kiếm (ví dụ: 'tin tức công nghệ AI')
        limit: Số lượng kết quả tối đa (mặc định: 5)
    """
    log_debug(f"Direct searching videos: {query}")
    try:
        import yt_dlp
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'extract_flat': True,
            'skip_download': True
        }
        search_url = f"ytsearch{limit}:{query}"
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            res = ydl.extract_info(search_url, download=False)
            entries = res.get("entries") or []
            results = []
            for e in entries:
                if not e: continue
                results.append({
                    "id": e.get("id"),
                    "title": e.get("title"),
                    "url": f"https://www.youtube.com/watch?v={e.get('id')}",
                    "uploader": e.get("uploader"),
                    "duration": e.get("duration"),
                    "view_count": e.get("view_count")
                })
            return json.dumps({"status": "success", "count": len(results), "videos": results}, ensure_ascii=False, indent=2)
    except Exception as e:
        log_debug(f"Search error: {e}")
        return json.dumps({"status": "error", "error": str(e)}, ensure_ascii=False)


# ==============================================================================
# 3. OMNI-BROWSER & FACEBOOK AUTO-POST TOOLS
# ==============================================================================

@mcp.tool()
def browser_status() -> str:
    """
    Kiểm tra trạng thái máy chủ Omni-Browser Bridge và danh sách tất cả các profile trình duyệt đang kết nối (Chrome, Cốc Cốc, v.v.).
    """
    log_debug("Checking browser bridge status")
    try:
        req = urllib.request.Request(f"{BRIDGE_HTTP_URL}/status")
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return json.dumps(data, ensure_ascii=False, indent=2)
    except Exception as e:
        return json.dumps({
            "status": "offline",
            "error": f"Bridge Server chưa bật tại {BRIDGE_HTTP_URL}. Chạy start_bridge.bat để khởi động.",
            "detail": str(e)
        }, ensure_ascii=False, indent=2)


@mcp.tool()
def browser_get_tabs(profile: str = "default") -> str:
    """
    Lấy danh sách tất cả các tab đang mở trong một profile trình duyệt cụ thể.
    
    Args:
        profile: Tên profile trình duyệt ('coc_coc_dien', '7', '54', '67', 'tomi', 'infoasia'...)
    """
    log_debug(f"Getting tabs for profile: {profile}")
    res = call_bridge({"profile": profile, "action": "get_tabs"})
    return json.dumps(res, ensure_ascii=False, indent=2)


@mcp.tool()
def browser_navigate(url: str, profile: str = "default") -> str:
    """
    Điều hướng tab đang hoạt động của một profile trình duyệt đến một địa chỉ web (URL) cụ thể.
    
    Args:
        url: Địa chỉ trang web cần mở (ví dụ: 'https://www.facebook.com', 'https://google.com')
        profile: Tên profile trình duyệt nhận lệnh ('coc_coc_dien', '7', '54', '67'...)
    """
    log_debug(f"Navigating profile '{profile}' to: {url}")
    res = call_bridge({"profile": profile, "action": "goto", "url": url})
    return json.dumps(res, ensure_ascii=False, indent=2)


@mcp.tool()
def browser_screenshot(output_path: str = "", profile: str = "default") -> str:
    """
    Chụp ảnh màn hình (screenshot) tab đang hoạt động của một profile trình duyệt và lưu ra file.
    
    Args:
        output_path: Đường dẫn lưu file ảnh .png (nếu để trống, tự động lưu vào artifact/downloads)
        profile: Tên profile trình duyệt ('coc_coc_dien', '7', '54', '67'...)
    """
    log_debug(f"Capturing screenshot on profile: {profile}")
    res = call_bridge({"profile": profile, "action": "screenshot"})
    shot_data = res.get("screenshot")
    if shot_data and shot_data.startswith("data:image/png;base64,"):
        b64 = shot_data.split(",")[1]
        save_path = output_path.strip()
        if not save_path:
            save_path = os.path.join(DEFAULT_DOWNLOAD_DIR, f"screenshot_{int(time.time())}.png")
        os.makedirs(os.path.dirname(os.path.abspath(save_path)), exist_ok=True)
        with open(save_path, "wb") as f:
            f.write(base64.b64decode(b64))
        return json.dumps({"status": "success", "saved_to": save_path, "profile": profile}, ensure_ascii=False)
    return json.dumps({"status": "error", "error": "Could not capture screenshot", "raw": res}, ensure_ascii=False)


@mcp.tool()
def browser_click(selector: str = "", text: str = "", profile: str = "default") -> str:
    """
    Click chuột vào một nút, đường link hoặc phần tử trên trang web trong profile chỉ định.
    
    Args:
        selector: CSS Selector hoặc XPath của phần tử cần click
        text: Văn bản hiển thị của phần tử cần click (nếu không rõ selector)
        profile: Tên profile trình duyệt ('coc_coc_dien', '7', '54', '67'...)
    """
    log_debug(f"Clicking on profile '{profile}': selector={selector}, text={text}")
    res = call_bridge({"profile": profile, "action": "click", "selector": selector, "text": text})
    return json.dumps(res, ensure_ascii=False, indent=2)


@mcp.tool()
def browser_type(
    text: str,
    selector: str = "",
    profile: str = "default",
    clear: bool = False,
    press_enter: bool = False
) -> str:
    """
    Nhập văn bản vào ô input hoặc contenteditable trên trang web của profile chỉ định.
    
    Args:
        text: Nội dung văn bản cần gõ
        selector: CSS Selector của ô nhập liệu (nếu để trống, tìm ô input đang active)
        profile: Tên profile trình duyệt ('coc_coc_dien', '7', '54', '67'...)
        clear: True nếu muốn xóa sạch nội dung cũ trước khi gõ
        press_enter: True nếu muốn bấm Enter sau khi gõ xong
    """
    log_debug(f"Typing on profile '{profile}': '{text[:30]}...'")
    res = call_bridge({
        "profile": profile,
        "action": "type",
        "selector": selector,
        "text": text,
        "clear": clear,
        "press_enter": press_enter
    })
    return json.dumps(res, ensure_ascii=False, indent=2)


@mcp.tool()
def facebook_post(
    caption: str = "",
    media_path: str = "",
    is_video: bool = False,
    profile: str = "coc_coc_dien",
    screenshot_out: str = ""
) -> str:
    """
    Tự động hóa 100% đăng bài viết kèm ẢNH hoặc VIDEO lên Facebook qua trình duyệt (Cốc Cốc / Chrome).
    Tự động vượt rào sandbox, nạp file nhị phân ngầm bằng CDP Native không mở Windows Dialog, 
    chờ xác nhận preview trước khi click 'Đăng', và chụp ảnh màn hình bằng chứng nghiệm thu.
    
    Args:
        caption: Nội dung status bài viết (hỗ trợ đầy đủ tiếng Việt có dấu, emoji, hashtag)
        media_path: Đường dẫn tệp ảnh (.jpg, .png) hoặc video (.mp4) trên máy tính cần đăng kèm
        is_video: True nếu media_path là file Video (.mp4), False nếu là file Ảnh (.jpg, .png)
        profile: Tên profile trình duyệt có tài khoản Facebook ('coc_coc_dien', '7', '54'...)
        screenshot_out: Đường dẫn lưu ảnh chụp màn hình nghiệm thu sau khi đăng bài
    """
    log_debug(f"Facebook auto-post on profile '{profile}': media={media_path}, video={is_video}")
    try:
        script_path = r"E:\DIEN APP\Skill AI\antigravity-browser-bridge\fb_auto_post.py"
        if not os.path.exists(script_path):
            return json.dumps({"status": "error", "error": f"fb_auto_post.py not found at {script_path}"})
            
        from importlib.machinery import SourceFileLoader
        fb_mod = SourceFileLoader("fb_auto_post", script_path).load_module()
        
        success = fb_mod.post_to_facebook(
            profile=profile,
            media_path=media_path if media_path else None,
            is_video=is_video,
            caption=caption if caption else None,
            screenshot_out=screenshot_out if screenshot_out else None
        )
        
        return json.dumps({
            "status": "success" if success else "failed",
            "published": success,
            "profile": profile,
            "caption": caption[:80],
            "media": media_path,
            "screenshot": screenshot_out
        }, ensure_ascii=False, indent=2)
    except Exception as e:
        log_debug(f"Facebook post error: {e}")
        return json.dumps({"status": "error", "error": str(e)}, ensure_ascii=False)


# ==============================================================================
# MAIN ENTRYPOINT (MCP STDIO TRANSPORT)
# ==============================================================================

if __name__ == "__main__":
    log_debug("Starting Antigravity Unified MCP Server (transport=stdio)...")
    mcp.run(transport="stdio")
