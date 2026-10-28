"""
Plugin: sap-b1-dtw-importer
Cong cu chuan hoa, chuyen doi va kiem dinh file Excel DTW (Data Transfer Workbench)
cho SAP Business One 9.3 / 10.0 tai <WORKSPACE_DIR>\\SAP B1 IMPORT MASTER DATA.
"""
from __future__ import annotations

import importlib.util
import json
import os
import shutil
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

DEFAULT_DTW_DIR = Path(os.getenv("SAP_B1_DTW_DIR", r"<WORKSPACE_DIR>\SAP B1 IMPORT MASTER DATA"))


def _load_dtw_module():
    """Uu tien nap dtw_master_importer.py tai <WORKSPACE_DIR>\\SAP B1 IMPORT MASTER DATA neu co."""
    candidates = [
        DEFAULT_DTW_DIR / "dtw_master_importer.py",
        Path("/data/sap_b1_dtw/dtw_master_importer.py"),
    ]
    for p in candidates:
        if p.is_file():
            try:
                spec = importlib.util.spec_from_file_location("sap_dtw_master_importer", str(p))
                if spec and spec.loader:
                    mod = importlib.util.module_from_spec(spec)
                    spec.loader.exec_module(mod)
                    return mod
            except Exception:
                pass
    return None


def _resolve_base_dir() -> Path:
    if DEFAULT_DTW_DIR.exists():
        return DEFAULT_DTW_DIR
    vps_dir = Path("/data/sap_b1_dtw")
    if vps_dir.exists():
        return vps_dir
    return DEFAULT_DTW_DIR


def _resolve_file(file_path_or_name: str) -> Path:
    p = Path(file_path_or_name)
    if p.is_absolute() and p.exists():
        return p
    bdir = _resolve_base_dir()
    cand = bdir / file_path_or_name
    if cand.exists():
        return cand
    return cand if not p.is_absolute() else p


def _handle_dtw_list_files(args: dict, ctx) -> str:
    args = args or {}
    base_dir = str(args.get("base_dir") or "").strip() or None
    mod = _load_dtw_module()
    if mod and hasattr(mod, "list_dtw_files"):
        res = mod.list_dtw_files(base_dir=base_dir)
        return json.dumps(res, ensure_ascii=False, indent=2)

    bdir = Path(base_dir) if base_dir else _resolve_base_dir()
    if not bdir.exists():
        return json.dumps({"ok": False, "error": f"Thu muc DTW khong ton tai: {bdir}"}, ensure_ascii=False)
    files_info = []
    for f in sorted(bdir.iterdir()):
        if f.is_file() and not f.name.startswith("~$"):
            st = f.stat()
            files_info.append(
                {
                    "name": f.name,
                    "path": str(f.resolve()),
                    "size_kb": round(st.st_size / 1024.0, 2),
                    "modified": datetime.fromtimestamp(st.st_mtime).strftime("%Y-%m-%d %H:%M:%S"),
                }
            )
    return json.dumps(
        {"ok": True, "base_dir": str(bdir), "count": len(files_info), "files": files_info},
        ensure_ascii=False,
        indent=2,
    )


def _handle_dtw_inspect_template(args: dict, ctx) -> str:
    args = args or {}
    excel_file = str(args.get("excel_file") or args.get("file") or "1-Template Finance.xlsx").strip()
    sheet_name = str(args.get("sheet_name") or args.get("sheet") or "").strip()

    mod = _load_dtw_module()
    if mod and hasattr(mod, "inspect_template"):
        res = mod.inspect_template(excel_file=excel_file, sheet_name=sheet_name)
        return json.dumps(res, ensure_ascii=False, indent=2)

    import openpyxl

    fpath = _resolve_file(excel_file)
    if not fpath.is_file():
        return json.dumps({"ok": False, "error": f"Khong tim thay file: {fpath}"}, ensure_ascii=False)
    wb = openpyxl.load_workbook(fpath, read_only=True, data_only=True)
    sheets = list(wb.sheetnames)
    target = sheet_name if sheet_name in sheets else sheets[0]
    ws = wb[target]
    top_rows = list(ws.iter_rows(min_row=1, max_row=3, values_only=True))
    wb.close()
    row1 = list(top_rows[0]) if len(top_rows) >= 1 else []
    row2 = list(top_rows[1]) if len(top_rows) >= 2 else []
    cols = []
    for i in range(max(len(row1), len(row2))):
        c1 = str(row1[i]).strip() if i < len(row1) and row1[i] is not None else ""
        c2 = str(row2[i]).strip() if i < len(row2) and row2[i] is not None else ""
        if c1 or c2:
            cols.append({"col_index": i + 1, "row1_template_col": c1, "row2_sap_db_field": c2})
    return json.dumps(
        {"ok": True, "file": str(fpath), "sheet": target, "available_sheets": sheets, "dtw_columns": cols},
        ensure_ascii=False,
        indent=2,
    )


def _handle_dtw_generate_coa_import(args: dict, ctx) -> str:
    args = args or {}
    source_excel = str(args.get("source_excel") or "COA FVIV LONG THANH.xlsx").strip()
    source_sheet = str(args.get("source_sheet") or "Sheet1").strip()
    filter_prefix = str(args.get("filter_prefix") or "642").strip()
    target_prefix = str(args.get("target_prefix") or "643").strip()
    template_excel = str(args.get("template_excel") or "1-Template Finance.xlsx").strip()
    output_excel = str(args.get("output_excel") or f"Template_Import_{target_prefix}.xlsx").strip()

    mod = _load_dtw_module()
    if mod and hasattr(mod, "generate_coa_import"):
        res = mod.generate_coa_import(
            source_excel=source_excel,
            source_sheet=source_sheet,
            filter_prefix=filter_prefix,
            target_prefix=target_prefix,
            template_excel=template_excel,
            output_excel=output_excel,
        )
        return json.dumps(res, ensure_ascii=False, indent=2)

    return json.dumps(
        {"ok": False, "error": "Khong nap duoc dtw_master_importer.py"},
        ensure_ascii=False,
    )


def _handle_dtw_validate_master_data(args: dict, ctx) -> str:
    args = args or {}
    excel_file = str(args.get("excel_file") or args.get("file") or "Template_Import_643.xlsx").strip()
    sheet_name = str(args.get("sheet_name") or args.get("sheet") or "COA").strip()
    sap_version = str(args.get("sap_version") or "10.0").strip()
    object_type = str(args.get("object_type") or "OACT").strip()

    mod = _load_dtw_module()
    if mod and hasattr(mod, "validate_master_data"):
        res = mod.validate_master_data(
            excel_file=excel_file,
            sheet_name=sheet_name,
            sap_version=sap_version,
            object_type=object_type,
        )
        return json.dumps(res, ensure_ascii=False, indent=2)

    return json.dumps(
        {"ok": False, "error": "Khong nap duoc dtw_master_importer.py"},
        ensure_ascii=False,
    )


def register(ctx):
    ctx.register_tool(
        name="dtw_list_files",
        description=(
            "Liet ke tat ca cac file Template DTW (.xlsx) va file du lieu nguon Master Data "
            "trong thu muc <WORKSPACE_DIR>\\SAP B1 IMPORT MASTER DATA kem danh sach cac Sheet."
        ),
        handler=_handle_dtw_list_files,
        min_mode="readonly",
        schema={
            "type": "object",
            "properties": {
                "base_dir": {
                    "type": "string",
                    "description": "Thu muc DTW tuy chon (mac dinh: <WORKSPACE_DIR>\\SAP B1 IMPORT MASTER DATA)",
                }
            },
        },
    )

    ctx.register_tool(
        name="dtw_inspect_template",
        description=(
            "Doc cau truc 2 dong Header chuan DTW (Row 1: Template Column, Row 2: SAP DB Field) "
            "cua bat ky file Excel / Sheet nao trong thu muc SAP B1 IMPORT MASTER DATA."
        ),
        handler=_handle_dtw_inspect_template,
        min_mode="readonly",
        schema={
            "type": "object",
            "properties": {
                "excel_file": {
                    "type": "string",
                    "description": "Ten file Excel hoac duong dan day du (vd: '1-Template Finance.xlsx')",
                },
                "sheet_name": {
                    "type": "string",
                    "description": "Ten Sheet can kiem tra (vd: 'COA', 'Sheet3', bo trong = sheet dau tien)",
                },
            },
            "required": ["excel_file"],
        },
    )

    ctx.register_tool(
        name="dtw_generate_coa_import",
        description=(
            "Cong cu chuan hoa DTW Chart of Accounts (OACT): Loc tai khoan theo filter_prefix (vd '642') "
            "tu file nguon, tu dong chuyen doi AcctCode, FatherNum, FormatCode, AcctName sang target_prefix "
            "(vd '643') va xuat ra file Excel DTW hoan chinh giu nguyen 2 dong header chuan."
        ),
        handler=_handle_dtw_generate_coa_import,
        min_mode="safe",
        schema={
            "type": "object",
            "properties": {
                "source_excel": {
                    "type": "string",
                    "description": "File Excel chua COA nguon (mac dinh: 'COA FVIV LONG THANH.xlsx')",
                },
                "source_sheet": {
                    "type": "string",
                    "description": "Ten sheet trong file nguon (mac dinh: 'Sheet1')",
                },
                "filter_prefix": {
                    "type": "string",
                    "description": "Dau ma tai khoan can loc (vd: '642')",
                },
                "target_prefix": {
                    "type": "string",
                    "description": "Dau ma tai khoan moi can sinh ra (vd: '643')",
                },
                "template_excel": {
                    "type": "string",
                    "description": "File Template DTW chuan (mac dinh: '1-Template Finance.xlsx')",
                },
                "output_excel": {
                    "type": "string",
                    "description": "Ten file Excel DTW dau ra (mac dinh: 'Template_Import_643.xlsx')",
                },
            },
            "required": ["filter_prefix", "target_prefix"],
        },
    )

    ctx.register_tool(
        name="dtw_validate_master_data",
        description=(
            "Kiem tra tinh hop le cua file Excel DTW truoc khi import vao SAP B1 9.3 / 10.0 "
            "(kiem tra 2 dong header, trung khoa chinh, thieu truong bat buoc, do dai ma, loi dinh dang .0)."
        ),
        handler=_handle_dtw_validate_master_data,
        min_mode="readonly",
        schema={
            "type": "object",
            "properties": {
                "excel_file": {
                    "type": "string",
                    "description": "Ten file Excel DTW can kiem tra (vd: 'Template_Import_643.xlsx')",
                },
                "sheet_name": {
                    "type": "string",
                    "description": "Ten sheet can kiem tra (mac dinh: 'COA')",
                },
                "sap_version": {
                    "type": "string",
                    "enum": ["9.3", "10.0"],
                    "description": "Phien ban SAP B1 muc tieu ('9.3' hoac '10.0')",
                },
                "object_type": {
                    "type": "string",
                    "enum": ["OACT", "OITM", "OCRD"],
                    "description": "Loai Master Data: OACT (Chart of Accounts), OITM (Items), OCRD (Business Partners)",
                },
            },
            "required": ["excel_file"],
        },
    )
