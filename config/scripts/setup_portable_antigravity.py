#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
setup_portable_antigravity.py — Trình kích hoạt tự động Bộ Não Lai Javis (`agy-skill-hub`),
PreInvocation Re-Anchor Hook và Chỉ mục SQLite WAL FTS5 + RRF khi đem sang máy mới.

Tự động nhận diện đường dẫn Python thực tế trên máy đích (Windows / macOS / Linux),
ghép nối an toàn vào `mcp_config.json` & `hooks.json` (không ghi đè cấu hình cũ),
khởi tạo `sql-sap-b1/config.json` từ `config.example.json` (nếu tải từ Git),
và dựng mới chỉ mục `agy_skill_index.db`.
"""
from __future__ import annotations

import json
import os
import shutil
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")


def detect_python_paths() -> tuple[str, str]:
    """Trả về (python_exe, pythonw_or_python_exe) thực tế trên máy đích."""
    py_exe = Path(sys.executable).resolve()
    pyw_cand = py_exe.with_name("pythonw.exe")
    pyw_exe = pyw_cand if pyw_cand.is_file() else py_exe
    return str(py_exe), str(pyw_exe)


def load_json_safe(path: Path) -> dict:
    if path.is_file():
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
            if isinstance(data, dict):
                return data
        except Exception:
            backup = path.with_suffix(path.suffix + ".bak")
            shutil.copy2(path, backup)
    return {}


def main() -> int:
    script_dir = Path(__file__).resolve().parent
    config_dir = script_dir.parent
    py_exe, pyw_exe = detect_python_paths()

    print(f"[setup] Config Dir : {config_dir}")
    print(f"[setup] Python Exe : {py_exe}")

    # 1. Đăng ký MCP Server `agy-skill-hub` & `prompts-chat` vào mcp_config.json (giữ nguyên các MCP khác)
    mcp_path = config_dir / "mcp_config.json"
    mcp_data = load_json_safe(mcp_path)
    servers = mcp_data.setdefault("mcpServers", {})
    servers["agy-skill-hub"] = {
        "command": py_exe,
        "args": ["-u", str(script_dir / "agy_skill_mcp_server.py")],
        "env": {"PYTHONIOENCODING": "utf-8"},
        "disabled": False,
    }
    if "prompts-chat" not in servers:
        servers["prompts-chat"] = {
            "url": "https://prompts.chat/api/mcp",
            "disabled": False,
        }
    mcp_path.write_text(json.dumps(mcp_data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"[setup] OK -> Da cap nhat MCP 'agy-skill-hub' & 'prompts-chat' trong {mcp_path.name}")

    # 2. Đăng ký PreInvocation Hook `lean-teamwork-global-reanchor` vào hooks.json
    hooks_path = config_dir / "hooks.json"
    hooks_data = load_json_safe(hooks_path)
    hook_script = (script_dir / "auto_reanchor_hook.py").as_posix()
    pyw_posix = Path(pyw_exe).as_posix()
    hooks_data["lean-teamwork-global-reanchor"] = {
        "PreInvocation": [
            {
                "type": "command",
                "command": f'"{pyw_posix}" "{hook_script}"',
                "timeout": 10,
            }
        ]
    }
    hooks_path.write_text(json.dumps(hooks_data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"[setup] OK -> Da cap nhat PreInvocation Hook trong {hooks_path.name}")

    # 3. Khởi tạo config.json mẫu cho sql-sap-b1 nếu clone từ Git (nơi .gitignore đã chặn config thật)
    sap_cfg = config_dir / "skills" / "sql-sap-b1" / "config.json"
    sap_example = config_dir / "skills" / "sql-sap-b1" / "config.example.json"
    if not sap_cfg.exists() and sap_example.exists():
        shutil.copy2(sap_example, sap_cfg)
        print("[setup] OK -> Da khoi tao sql-sap-b1/config.json tu config.example.json")

    # 4. Dựng chỉ mục SQLite WAL FTS5 + RRF (agy_skill_index.db) theo đường dẫn máy đích
    try:
        if str(script_dir) not in sys.path:
            sys.path.insert(0, str(script_dir))
        import agy_skill_engine

        rep = agy_skill_engine.get_engine().audit_report(force_rebuild=True)
        sync_info = rep.get("sync", {})
        print(
            f"[setup] OK -> Chi muc FTS5+RRF san sang: "
            f"{sync_info.get('total_skills', 0)} skills | "
            f"{sync_info.get('total_indexed_files', 0)} files | "
            f"{sync_info.get('total_chunks', 0)} chunks | "
            f"DB={sync_info.get('db_size_mb', '?')} MB ({sync_info.get('elapsed_ms', '?')} ms)"
        )
    except ImportError as exc:
        print(
            f"[setup] LUU Y: Chua cai thu vien '{exc.name}'. "
            f"Hay chay CAI_THU_VIEN_PYTHON_CHO_SKILLS.bat de cai 'mcp' & 'pyyaml' roi dung chi muc!"
        )
    except Exception as exc:
        print(f"[setup] CANH BAO khi dung chi muc: {exc}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
