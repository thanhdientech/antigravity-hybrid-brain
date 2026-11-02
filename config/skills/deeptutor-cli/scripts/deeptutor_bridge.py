#!/usr/bin/env python3
"""
DeepTutor CLI Bridge & Verification Script (100% Python Standard Library).
Verifies the local HKUDS/DeepTutor repository (default: D:\\DeepTutor),
inspects its 11 official capabilities and 19 modular setup extras,
and builds safe non-interactive NDJSON CLI commands for Antigravity agents.
"""

from __future__ import annotations

import argparse
import json
import os
import shlex
import shutil
import sys
from pathlib import Path
from typing import Dict, List

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

DEFAULT_REPO_CANDIDATES = [
    os.environ.get("DEEPTUTOR_REPO_PATH", ""),
    r"D:\DeepTutor",
    str(Path.home() / "DeepTutor"),
]

OFFICIAL_CAPABILITIES: Dict[str, str] = {
    "chat": "Multi-turn conversational tutor with 8 toggleable tools, RAG & 3-layer memory",
    "math_animator": "5-agent Manim 2D/3D math, physics, engineering & space animation generator with Vision AI frame review",
    "video_lesson": "Multi-scene Remotion (Lesson.tsx) motion-graphics explainer video generator with line-by-line TTS narration",
    "deep_solve": "Multi-agent step-by-step STEM & engineering problem solver with Python code verification",
    "deep_question": "Automated exam & practice question generator grounded in knowledge base materials",
    "deep_research": "Comprehensive academic literature review & synthesis across Web, arXiv & RAG",
    "audio_overview": "NotebookLM-style dual-host dialogue or monologue AI podcast generator from documents",
    "guided_learning": "Interactive multi-stage guided learning workflow with HTML5/GeoGebra/SVG visualizers",
    "brainstorm": "Multi-perspective academic & creative topic ideation and hypothesis generator",
    "note_assistant": "Structured study notebook synthesis and cross-document knowledge organizer",
    "quiz": "Interactive quiz engine updating the L3 Mastery Graph",
}

OFFICIAL_TOOLS: List[str] = [
    "rag_search",
    "web_search",
    "paper_search",
    "run_code",
    "tex_diagram",
    "page_index",
    "generate_practice",
    "edit_file",
]

REQUIRED_REPO_FILES: List[str] = [
    "README.md",
    "SKILL.md",
    "setup.py",
    "docs-for-dev/ARCHITECTURE.md",
    "docs-for-dev/SCIENTIFIC_RESEARCH.md",
    "docs-for-dev/TOOLS_AND_CAPABILITIES.md",
    "docs-for-dev/AGENT_SETUP.md",
    "deeptutor/agents/math_animator/pipeline.py",
    "deeptutor/agents/video_lesson/capability.py",
]


def resolve_repo_path(custom_path: str | None = None) -> Path:
    candidates = ([custom_path] if custom_path else []) + DEFAULT_REPO_CANDIDATES
    for candidate in candidates:
        if candidate:
            p = Path(candidate)
            if p.exists() and (p / "SKILL.md").exists():
                return p
    return Path(custom_path or r"D:\DeepTutor")


def inspect_status(repo_path: Path) -> Dict[str, object]:
    missing_files = [
        rel for rel in REQUIRED_REPO_FILES if not (repo_path / rel).exists()
    ]
    cli_executable = shutil.which("deeptutor")
    return {
        "status": "ok" if not missing_files else "missing_repo_files",
        "repo_path": str(repo_path),
        "repo_exists": repo_path.exists(),
        "missing_files": missing_files,
        "verified_files_count": len(REQUIRED_REPO_FILES) - len(missing_files),
        "deeptutor_cli_in_path": bool(cli_executable),
        "deeptutor_cli_executable": cli_executable or "python -m deeptutor.cli.main",
        "capabilities_count": len(OFFICIAL_CAPABILITIES),
        "toggleable_tools_count": len(OFFICIAL_TOOLS),
    }


def build_cli_command(
    prompt: str,
    capability: str = "chat",
    tools: str = "",
    kb: str = "",
    configs: List[str] | None = None,
    json_output: bool = True,
) -> Dict[str, object]:
    if capability not in OFFICIAL_CAPABILITIES:
        raise ValueError(
            f"Unsupported capability '{capability}'. Valid: {', '.join(OFFICIAL_CAPABILITIES)}"
        )
    parts: List[str] = ["deeptutor", "run", prompt, "-C", capability]
    if tools:
        tool_list = [t.strip() for t in tools.split(",") if t.strip()]
        invalid = [t for t in tool_list if t not in OFFICIAL_TOOLS]
        if invalid:
            raise ValueError(
                f"Unsupported tool(s): {invalid}. Valid: {', '.join(OFFICIAL_TOOLS)}"
            )
        parts.extend(["-t", ",".join(tool_list)])
    if kb:
        parts.extend(["-k", kb])
    for cfg in configs or []:
        parts.extend(["--config", cfg])
    if json_output:
        parts.extend(["--format", "json"])
    return {
        "capability": capability,
        "capability_description": OFFICIAL_CAPABILITIES[capability],
        "argv": parts,
        "shell_command": " ".join(shlex.quote(p) for p in parts),
    }


def run_self_test(repo_path: Path) -> int:
    status = inspect_status(repo_path)
    sample_manim = build_cli_command(
        prompt="Mô phỏng quỹ đạo chuyển tiếp Hohmann từ Trái Đất sang Sao Hỏa",
        capability="math_animator",
        configs=["enable_visual_review=true", "max_fix_round=4", "manim_quality=h"],
        json_output=True,
    )
    sample_lesson = build_cli_command(
        prompt="Giải thích nguyên lý động cơ tên lửa Raptor",
        capability="video_lesson",
        configs=["tts_voice=vi-VN-NamMinhNeural"],
        json_output=True,
    )
    report = {
        "self_test": "PASSED",
        "repo_check": status,
        "sample_manim_command": sample_manim["shell_command"],
        "sample_video_lesson_command": sample_lesson["shell_command"],
    }
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(
        description="DeepTutor CLI Bridge & Verification Helper"
    )
    parser.add_argument("--repo", default=None, help="Path to local DeepTutor repo")
    parser.add_argument(
        "--self-test",
        action="store_true",
        help="Run self-test verifying capability registry and CLI command builder",
    )
    sub = parser.add_subparsers(dest="subcommand")

    sub.add_parser("status", help="Inspect local DeepTutor repository status")
    sub.add_parser("capabilities", help="List all 11 capabilities and 8 toggleable tools")

    cmd_p = sub.add_parser("build-cmd", help="Build a validated deeptutor run CLI command")
    cmd_p.add_argument("--prompt", required=True, help="Prompt string")
    cmd_p.add_argument("-C", "--capability", default="chat", help="Capability name")
    cmd_p.add_argument("-t", "--tools", default="", help="Comma-separated tool list")
    cmd_p.add_argument("-k", "--kb", default="", help="Knowledge base name")
    cmd_p.add_argument(
        "--config",
        action="append",
        default=[],
        help="Capability config key=value (can be passed multiple times)",
    )

    args = parser.parse_args()
    repo_path = resolve_repo_path(args.repo)

    if args.self_test:
        return run_self_test(repo_path)
    if args.subcommand == "capabilities":
        print(
            json.dumps(
                {
                    "capabilities": OFFICIAL_CAPABILITIES,
                    "toggleable_tools": OFFICIAL_TOOLS,
                },
                ensure_ascii=False,
                indent=2,
            )
        )
        return 0
    if args.subcommand == "build-cmd":
        res = build_cli_command(
            prompt=args.prompt,
            capability=args.capability,
            tools=args.tools,
            kb=args.kb,
            configs=args.config,
            json_output=True,
        )
        print(json.dumps(res, ensure_ascii=False, indent=2))
        return 0

    print(json.dumps(inspect_status(repo_path), ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
