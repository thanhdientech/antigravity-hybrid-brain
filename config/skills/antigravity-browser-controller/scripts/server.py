"""
Antigravity Omni-Browser Bridge Server (Multi-Profile Support v2.1)
Dual Architecture:
- WebSocket Server on port 8765: Connects to multiple Chrome Extensions across different profiles without overwriting sockets
- HTTP REST API Server on port 8766: Receives commands from Antigravity Agent & CLI with strict per-profile & tabId routing
"""

import asyncio
import json
import uuid
import sys
import base64
import os
import time
from aiohttp import web
import websockets

sys.stdout.reconfigure(encoding="utf-8")

WS_PORT = 8765
HTTP_PORT = 8766

ws_registry = {}
tab_to_ws = {}
pending_responses = {}
_last_global_probe_ts = 0.0


def _load_custom_profile_map() -> dict:
    map_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), "profile_map.json")
    if os.path.exists(map_file):
        try:
            with open(map_file, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {}


def _infer_profile_from_meta(declared: str, email: str, tabs: list) -> str:
    em = (email or "").lower().strip()
    custom_map = _load_custom_profile_map()
    for key_sub, prof_name in (custom_map.get("email_map") or {}).items():
        if key_sub.lower() in em:
            return str(prof_name)

    for t in (tabs or []):
        u = str((t or {}).get("url") or "").lower()
        title = str((t or {}).get("title") or "").lower()
        for url_sub, prof_name in (custom_map.get("url_map") or {}).items():
            if url_sub.lower() in u or url_sub.lower() in title:
                return str(prof_name)

    dec = (declared or "default").strip() or "default"
    return dec


async def _send_ws_request(ws, cmd_dict: dict, timeout: float = 8.0) -> dict:
    req_id = str(uuid.uuid4())
    payload = dict(cmd_dict)
    payload["id"] = req_id
    loop = asyncio.get_running_loop()
    fut = loop.create_future()
    pending_responses[req_id] = fut
    try:
        await ws.send(json.dumps(payload))
        res = await asyncio.wait_for(fut, timeout=timeout)
        return res if isinstance(res, dict) else {"status": "error", "error": "Invalid response"}
    except asyncio.TimeoutError:
        return {"status": "error", "error": f"Timeout after {timeout}s"}
    except Exception as e:
        return {"status": "error", "error": str(e)}
    finally:
        pending_responses.pop(req_id, None)


async def _probe_single_ws(ws, timeout: float = 3.0):
    if ws not in ws_registry:
        return
    res = await _send_ws_request(ws, {"action": "get_tabs"}, timeout=timeout)
    if res.get("status") == "ok" and ws in ws_registry:
        tabs = res.get("tabs") or []
        meta = ws_registry[ws]
        meta["tabs"] = tabs
        meta["last_probe_ts"] = time.time()
        if res.get("email"):
            meta["email"] = res.get("email")
        if res.get("profile") and res.get("profile") != "default":
            meta["declared_profile"] = res.get("profile")
        for t in tabs:
            tid = t.get("id")
            if tid is not None:
                tab_to_ws[tid] = ws
        inferred = _infer_profile_from_meta(meta.get("declared_profile"), meta.get("email"), tabs)
        if inferred == "67" and len(tabs) == 0 and not meta.get("email"):
            inferred = "default_headless"
        meta["inferred_profile"] = inferred


async def _probe_all_ws(timeout: float = 2.5, force: bool = False):
    global _last_global_probe_ts
    now = time.time()
    if not force and (now - _last_global_probe_ts < 3.0):
        return
    _last_global_probe_ts = now
    sockets = list(ws_registry.keys())
    if not sockets:
        return
    await asyncio.gather(*(_probe_single_ws(ws, timeout=timeout) for ws in sockets), return_exceptions=True)


def _get_active_profile_names() -> list:
    names = []
    for ws, meta in list(ws_registry.items()):
        inf = meta.get("inferred_profile") or meta.get("declared_profile") or "default"
        dec = meta.get("declared_profile") or "default"
        if inf == "default_headless":
            continue
        if inf not in names:
            names.append(inf)
        if dec != "default" and dec not in names and not (dec == "67" and len(meta.get("tabs") or []) == 0):
            names.append(dec)
    return names


def _select_best_ws(target_profile=None, tab_id=None):
    if not ws_registry:
        return None, None

    if tab_id is not None and tab_id in tab_to_ws:
        ws = tab_to_ws.get(tab_id)
        if ws in ws_registry:
            meta = ws_registry[ws]
            return ws, (meta.get("inferred_profile") or meta.get("declared_profile") or "default")

    tp = str(target_profile or "").strip().lower().replace("profile ", "")
    if tp in ("agent_profile", ""):
        tp = "default"

    # 1. Exact match on inferred_profile or conn_id
    for ws, meta in list(ws_registry.items()):
        inf = str(meta.get("inferred_profile") or "").lower().replace("profile ", "")
        cid = str(meta.get("conn_id") or "").lower()
        tabs = meta.get("tabs") or []
        if (inf == tp or cid == tp) and (len(tabs) > 0 or tp != "67"):
            return ws, (meta.get("inferred_profile") or tp)

    # 2. Exact match on declared_profile
    for ws, meta in list(ws_registry.items()):
        dec = str(meta.get("declared_profile") or "").lower().replace("profile ", "")
        tabs = meta.get("tabs") or []
        if dec == tp and (len(tabs) > 0 or tp != "67"):
            return ws, (meta.get("inferred_profile") or dec)

    # 3. Substring match on email ONLY when tp has at least 4 characters
    if len(tp) >= 4:
        for ws, meta in list(ws_registry.items()):
            em = str(meta.get("email") or "").lower()
            tabs = meta.get("tabs") or []
            if tp in em and len(tabs) > 0:
                return ws, (meta.get("inferred_profile") or tp)

    if tp == "default":
        for ws, meta in list(ws_registry.items()):
            inf = str(meta.get("inferred_profile") or "default").lower()
            if len(meta.get("tabs") or []) > 0:
                return ws, inf

    return None, None


async def ws_handler(websocket):
    conn_id = str(uuid.uuid4())[:8]
    ws_registry[websocket] = {
        "conn_id": conn_id,
        "declared_profile": "default",
        "inferred_profile": "default",
        "email": "",
        "tabs": [],
        "last_probe_ts": 0.0
    }
    print(f"\n[+] 🟢 Chrome Extension [{conn_id}] connected from {websocket.remote_address}!")

    try:
        async for message in websocket:
            try:
                data = json.loads(message)
                mtype = data.get("type")

                if mtype in ["HELLO", "SET_PROFILE", "HEARTBEAT"]:
                    meta = ws_registry.get(websocket)
                    if meta is not None:
                        prof = (data.get("profile") or meta.get("declared_profile") or "default").strip() or "default"
                        meta["declared_profile"] = prof
                        if data.get("email"):
                            meta["email"] = data.get("email")
                        if mtype in ["HELLO", "SET_PROFILE"]:
                            sample_urls = [{"url": u} for u in (data.get("sampleUrls") or [])]
                            meta["inferred_profile"] = _infer_profile_from_meta(prof, meta.get("email"), sample_urls or meta.get("tabs"))
                            asyncio.create_task(_probe_single_ws(websocket))
                            print(f"  [Profile Registered] [{conn_id}] declared='{prof}' inferred='{meta['inferred_profile']}' (Active: {_get_active_profile_names()})")

                req_id = data.get("id")
                if req_id and req_id in pending_responses:
                    fut = pending_responses.get(req_id)
                    if fut and not fut.done():
                        fut.set_result(data)
                elif mtype == "HEARTBEAT":
                    await websocket.send(json.dumps({"type": "HEARTBEAT_ACK"}))
                elif mtype == "CONSOLE_LOG":
                    print(f"  [Console ({conn_id}) ({data.get('level')})] {data.get('text')}")
            except Exception as e:
                print(f"[-] Error processing message from extension [{conn_id}]: {e}")
    except websockets.exceptions.ConnectionClosed:
        pass
    finally:
        ws_registry.pop(websocket, None)
        for tid, owner in list(tab_to_ws.items()):
            if owner == websocket:
                tab_to_ws.pop(tid, None)
        print(f"\n[-] 🔴 Chrome Extension [{conn_id}] disconnected. (Remaining: {_get_active_profile_names()})")


async def send_command_to_extension(command_dict, target_profile=None, timeout=60):
    if not ws_registry:
        return {
            "status": "error",
            "error": "Chưa có Profile Chrome nào kết nối! Vui lòng mở Chrome có cài Extension."
        }

    action = command_dict.get("action")
    tab_id = command_dict.get("tabId")

    if tab_id is not None and tab_id not in tab_to_ws:
        await _probe_all_ws(timeout=2.5, force=True)

    target_ws, target_name = _select_best_ws(target_profile=target_profile, tab_id=tab_id)
    if not target_ws:
        await _probe_all_ws(timeout=2.5, force=True)
        target_ws, target_name = _select_best_ws(target_profile=target_profile, tab_id=tab_id)

    if not target_ws:
        return {
            "status": "error",
            "error": f"Không tìm thấy profile '{target_profile}'. Các profile đang kết nối: {_get_active_profile_names()}"
        }

    if action == "get_tabs":
        await _probe_single_ws(target_ws, timeout=3.0)
        meta = ws_registry.get(target_ws) or {}
        return {
            "status": "ok",
            "tabs": meta.get("tabs") or [],
            "profile": meta.get("inferred_profile") or target_name
        }

    res = await _send_ws_request(target_ws, command_dict, timeout=timeout)
    res["profile"] = target_name
    return res


async def http_status(request):
    await _probe_all_ws(timeout=2.0, force=False)
    conns = []
    for ws, meta in list(ws_registry.items()):
        tabs = meta.get("tabs") or []
        conns.append({
            "conn_id": meta.get("conn_id"),
            "declared_profile": meta.get("declared_profile"),
            "inferred_profile": meta.get("inferred_profile"),
            "email": meta.get("email", ""),
            "tab_count": len(tabs),
            "urls": [t.get("url", "") for t in tabs[:5]]
        })
    active_profs = _get_active_profile_names()
    return web.json_response({
        "status": "ok",
        "extension_connected": len(active_profs) > 0,
        "active_profiles": active_profs,
        "connections": conns,
        "ws_port": WS_PORT,
        "http_port": HTTP_PORT
    })


async def http_profiles(request):
    await _probe_all_ws(timeout=2.0, force=False)
    return web.json_response({
        "status": "ok",
        "profiles": _get_active_profile_names()
    })


async def http_action(request):
    try:
        body = await request.json()
    except Exception:
        return web.json_response({"status": "error", "error": "Invalid JSON body"}, status=400)

    action = body.get("action")
    timeout = body.get("timeout", 60)
    target_profile = body.get("profile")

    if action == "upload_file" and "filePath" in body:
        file_path = body["filePath"]
        if not os.path.exists(file_path):
            return web.json_response({"status": "error", "error": f"Local file not found: {file_path}"})

        with open(file_path, "rb") as f:
            file_bytes = f.read()
        body["fileData"] = base64.b64encode(file_bytes).decode("utf-8")
        body["fileName"] = os.path.basename(file_path)

    res = await send_command_to_extension(body, target_profile=target_profile, timeout=timeout)
    return web.json_response(res)


async def start_http_server():
    app = web.Application(client_max_size=50 * 1024 * 1024)
    app.router.add_get("/status", http_status)
    app.router.add_get("/profiles", http_profiles)
    app.router.add_post("/action", http_action)
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, "127.0.0.1", HTTP_PORT)
    await site.start()
    print(f"[+] 🌐 HTTP REST API listening on http://127.0.0.1:{HTTP_PORT}")


async def main():
    print("=" * 70)
    print("⚡ ANTIGRAVITY OMNI-BROWSER BRIDGE SERVER v2.1 (MULTI-PROFILE)")
    print(f"• WebSocket Server: ws://127.0.0.1:{WS_PORT} (Dành cho các Chrome Extensions)")
    print(f"• HTTP REST API:    http://127.0.0.1:{HTTP_PORT} (Dành cho Antigravity Agent & CLI)")
    print("=" * 70)

    await start_http_server()
    async with websockets.serve(ws_handler, "127.0.0.1", WS_PORT, max_size=50 * 1024 * 1024):
        print(f"[+] 🚀 WebSocket Server listening on ws://127.0.0.1:{WS_PORT}")
        print("[*] Sẵn sàng! Chờ kết nối từ các Chrome Profiles...")
        await asyncio.Future()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n[*] Server stopped.")
