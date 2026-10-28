"""
Plugin: sap-b1-customer-sql
Quan ly ket noi dong thoi nhieu Server SQL SAP B1 (Mac dinh 100% truy van tren Server 24 -
Database SBO_MAIN_PROD SAP 10.0 + Service Layer :50000; khi nguoi dung go cu phap /160 hoac /<server>
thi dinh tuyen sang Server 10.0.0.20 hoac server tuong ung), chay truy van SELECT an toan,
goi SAP Service Layer tren Server 24, tu dong xuat file CSV/XLSX/PDF tai ve 1-click va chay 7 nhom
bao cao chuan SSMS.
"""
from __future__ import annotations

import csv
import importlib.util
import json
import os
import re
import unicodedata
import uuid
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

DEFAULT_SQL_APP_DIR = Path(os.getenv("SAP_B1_SQL_DIR", r"<WORKSPACE_DIR>\SQL SAP B1"))
DEFAULT_CONFIG_PATH = Path(os.getenv("SAP_B1_SQL_CONFIG", str(DEFAULT_SQL_APP_DIR / "config.json")))

FORBIDDEN_SQL_KEYWORDS = (
    "INSERT",
    "UPDATE",
    "DELETE",
    "DROP",
    "ALTER",
    "TRUNCATE",
    "CREATE",
    "EXEC",
    "EXECUTE",
    "MERGE",
    "GRANT",
    "REVOKE",
    "BACKUP",
    "RESTORE",
    "SHUTDOWN",
    "DBCC",
    "DENY",
    "BULK",
    "OPENROWSET",
    "OPENDATASOURCE",
    "XP_CMDSHELL",
)


def _load_external_manager():
    """Uu tien nap customer_profile_manager.py tai <WORKSPACE_DIR>\\SQL SAP B1 hoac Linux data/sql_sap_b1."""
    candidates = [
        DEFAULT_SQL_APP_DIR / "customer_profile_manager.py",
        Path("/opt/antigravity-erp/data/sql_sap_b1/customer_profile_manager.py"),
        Path("/data/sql_sap_b1/customer_profile_manager.py"),
    ]
    for p in candidates:
        if p.is_file():
            try:
                spec = importlib.util.spec_from_file_location("sap_customer_profile_manager", str(p))
                if spec and spec.loader:
                    mod = importlib.util.module_from_spec(spec)
                    spec.loader.exec_module(mod)
                    return mod
            except Exception:
                pass
    return None


def _resolve_config_paths(ctx) -> List[Path]:
    paths: List[Path] = []
    if DEFAULT_CONFIG_PATH.parent.exists():
        paths.append(DEFAULT_CONFIG_PATH)
    for linux_cfg in (
        Path("/opt/antigravity-erp/data/sql_sap_b1/config.json"),
        Path("/data/sql_sap_b1/config.json"),
    ):
        if linux_cfg not in paths and linux_cfg.parent.exists():
            paths.append(linux_cfg)
    state_dir = getattr(ctx, "state_dir", None) or os.getenv("JAVIS_STATE_DIR", "")
    if state_dir:
        sp = Path(state_dir) / "customer_sql_profiles.json"
        if sp not in paths:
            paths.append(sp)
    if not paths:
        paths.append(DEFAULT_CONFIG_PATH)
    return paths


def _strip_accents(text: str) -> str:
    s = unicodedata.normalize("NFD", str(text or ""))
    s = "".join(ch for ch in s if unicodedata.category(ch) != "Mn")
    return s.replace("đ", "d").replace("Đ", "D").lower().strip()


def _normalize_profile(raw: Dict[str, Any], idx: int = 0) -> Dict[str, Any]:
    cid = str(raw.get("id") or f"db_{idx}").strip()
    name = str(raw.get("name") or cid).strip()
    db_name = str(raw.get("database") or "").strip()
    code = str(raw.get("customer_code") or "").strip()
    if not code:
        base = name.split("_")[0] if "_" in name else name
        code = re.sub(r"[^A-Za-z0-9_-]", "", base).upper() or cid.upper()
    sap_ver = str(raw.get("sap_version") or "10.0").strip()
    if sap_ver not in ("9.3", "10.0"):
        sap_ver = "9.3" if ("9.3" in sap_ver or "93" in sap_ver) else "10.0"
    has_beas = True if raw.get("has_beas") is None else bool(raw.get("has_beas"))
    mapped = raw.get("mapped_folders")
    if not isinstance(mapped, list):
        mapped = []
    aliases = raw.get("aliases")
    if not isinstance(aliases, list):
        aliases = []
    return {
        "id": cid,
        "name": name,
        "customer_code": code,
        "aliases": [str(a).strip() for a in aliases if str(a).strip()],
        "sap_version": sap_ver,
        "has_beas": has_beas,
        "server": str(raw.get("server") or "localhost").strip(),
        "database": db_name,
        "username": str(raw.get("username") or "sap_readonly_user").strip(),
        "password": str(raw.get("password") or ""),
        "allow_unsafe": bool(raw.get("allow_unsafe", False)),
        "allow_service_layer": bool(raw.get("allow_service_layer", False)),
        "service_layer_url": str(raw.get("service_layer_url") or "").strip(),
        "service_layer_user": str(raw.get("service_layer_user") or "").strip(),
        "service_layer_password": str(raw.get("service_layer_password") or ""),
        "grant_all_folders": bool(raw.get("grant_all_folders", len(mapped) == 0)),
        "mapped_folders": mapped,
        "notes": str(raw.get("notes") or "").strip(),
    }


def _read_config(ctx) -> Tuple[Dict[str, Any], Path]:
    paths = _resolve_config_paths(ctx)
    for p in paths:
        if p.is_file():
            try:
                data = json.loads(p.read_text(encoding="utf-8"))
                if isinstance(data, dict):
                    conns = data.get("connections")
                    if not isinstance(conns, list):
                        conns = []
                    data["connections"] = [_normalize_profile(c, i) for i, c in enumerate(conns)]
                    return data, p
            except Exception:
                continue
    return {"connections": []}, paths[0]


def _write_config(ctx, data: Dict[str, Any]) -> List[str]:
    paths = _resolve_config_paths(ctx)
    payload = json.dumps(data, indent=4, ensure_ascii=False)
    saved: List[str] = []
    for p in paths:
        try:
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_text(payload, encoding="utf-8")
            saved.append(str(p))
        except Exception:
            pass
    return saved


def validate_readonly_sql(sql: str) -> Tuple[bool, str]:
    """Bo loc bao mat cung: Cho phep SELECT, CTE va bang tam #Temp, chan 100% lenh thay doi bang that."""
    ext = _load_external_manager()
    if ext and hasattr(ext, "validate_readonly_sql"):
        return ext.validate_readonly_sql(sql)

    if not sql or not str(sql).strip():
        return False, "Cau lenh SQL trong."
    s = re.sub(r"/\*.*?\*/", " ", str(sql), flags=re.DOTALL)
    s = re.sub(r"--[^\r\n]*", " ", s)
    s = re.sub(r"N?'(?:''|[^'])*'", " 'STR' ", s).strip()
    if not s:
        return False, "Cau lenh SQL chi chua comment hoac rong."

    temp_safe = s
    temp_safe = re.sub(r"\bDROP\s+TABLE\s+(?:IF\s+EXISTS\s+)?#[A-Za-z0-9_]+", " ", temp_safe, flags=re.IGNORECASE)
    temp_safe = re.sub(r"\bCREATE\s+TABLE\s+#[A-Za-z0-9_]+\s*\([^;]*?\)", " ", temp_safe, flags=re.IGNORECASE | re.DOTALL)
    temp_safe = re.sub(r"\bINSERT\s+INTO\s+#[A-Za-z0-9_]+", " ", temp_safe, flags=re.IGNORECASE)
    temp_safe = re.sub(r"\bINTO\s+#[A-Za-z0-9_]+", " ", temp_safe, flags=re.IGNORECASE)

    upper_s = temp_safe.upper()
    for kw in FORBIDDEN_SQL_KEYWORDS:
        if re.search(rf"\b{re.escape(kw)}\b", upper_s):
            return (
                False,
                f"TU CHOI BAO MAT: Cau lenh SQL chua tu khoa cam '{kw}' tren bang that. "
                "Tool sap_customer_query chi cho phep Read-Only 100%.",
            )
    if re.search(r"\bINTO\s+[A-Za-z0-9_\[\]\"]+", upper_s):
        return (
            False,
            "TU CHOI BAO MAT: Khong cho phep 'SELECT ... INTO' tren bang that trong che do Read-Only.",
        )
    if "SELECT" not in upper_s:
        return False, "Cau lenh SQL phai chua menh de SELECT."
    return True, "OK"


def _handle_customer_list(args: dict, ctx) -> str:
    args = args or {}
    ext = _load_external_manager()
    if ext and hasattr(ext, "list_profiles"):
        res = ext.list_profiles(mask_password=True)
        try:
            raw_data, _ = ext.load_raw_config()
            _write_config(ctx, raw_data)
        except Exception:
            pass
    else:
        data, active_path = _read_config(ctx)
        profiles = []
        for c in data.get("connections", []):
            item = dict(c)
            raw_pw = item.get("password") or ""
            item["password"] = "***" if raw_pw else "(empty)"
            item["has_password"] = bool(raw_pw)
            raw_sl_pw = item.get("service_layer_password") or ""
            item["service_layer_password"] = "***" if raw_sl_pw else "(empty)"
            profiles.append(item)
        res = {
            "ok": True,
            "config_path": str(active_path),
            "count": len(profiles),
            "profiles": profiles,
        }

    filter_kw = str(args.get("filter") or "").strip().lower()
    if filter_kw and res.get("profiles"):
        res["profiles"] = [
            p
            for p in res["profiles"]
            if filter_kw in str(p.get("id", "")).lower()
            or filter_kw in str(p.get("name", "")).lower()
            or filter_kw in str(p.get("customer_code", "")).lower()
            or filter_kw in str(p.get("database", "")).lower()
            or filter_kw in str(p.get("server", "")).lower()
        ]
        res["count"] = len(res["profiles"])
    return json.dumps(res, ensure_ascii=False, indent=2)


def _handle_customer_upsert(args: dict, ctx) -> str:
    args = args or {}
    name = str(args.get("name") or "").strip()
    server = str(args.get("server") or "").strip()
    database = str(args.get("database") or "").strip()
    username = str(args.get("username") or "sap_readonly_user").strip()
    password = str(args.get("password") or "")
    customer_id = str(args.get("id") or args.get("customer_id") or "").strip()
    customer_code = str(args.get("customer_code") or "").strip()
    sap_version = str(args.get("sap_version") or "10.0").strip()
    has_beas = bool(args.get("has_beas", True))
    mapped_folders = args.get("mapped_folders")
    if mapped_folders is not None and not isinstance(mapped_folders, list):
        mapped_folders = [str(x).strip() for x in str(mapped_folders).split(",") if str(x).strip()]
    notes = str(args.get("notes") or "").strip()

    ext = _load_external_manager()
    if ext and hasattr(ext, "upsert_profile"):
        res = ext.upsert_profile(
            name=name,
            server=server,
            database=database,
            username=username,
            password=password,
            customer_id=customer_id,
            customer_code=customer_code,
            sap_version=sap_version,
            has_beas=has_beas,
            mapped_folders=mapped_folders,
            notes=notes,
        )
        try:
            raw_data, _ = ext.load_raw_config()
            _write_config(ctx, raw_data)
        except Exception:
            pass
        return json.dumps(res, ensure_ascii=False, indent=2)

    return json.dumps(
        {"ok": False, "error": "Khong tai duoc module customer_profile_manager.py."},
        ensure_ascii=False,
    )


def _handle_customer_test(args: dict, ctx) -> str:
    args = args or {}
    customer_id = str(args.get("customer_id") or args.get("id") or args.get("name") or "SBO_MAIN_PROD").strip() or "SBO_MAIN_PROD"
    timeout = int(args.get("timeout") or 8)
    ext = _load_external_manager()
    if ext and hasattr(ext, "test_connection"):
        res = ext.test_connection(customer_id, timeout=timeout)
        return json.dumps(res, ensure_ascii=False, indent=2)
    return json.dumps(
        {"ok": False, "error": "Khong tai duoc module customer_profile_manager.py."},
        ensure_ascii=False,
    )


def _handle_customer_query(args: dict, ctx) -> str:
    args = args or {}
    allowed_customer = str(args.get("allowed_customer") or "").strip()
    customer_id = str(args.get("customer_id") or args.get("id") or allowed_customer or "SBO_MAIN_PROD").strip() or "SBO_MAIN_PROD"
    sql = str(args.get("sql") or "").strip()
    max_rows = int(args.get("max_rows") or 30)
    export_csv_path = str(args.get("export_csv_path") or "").strip()

    ok_sql, reason = validate_readonly_sql(sql)
    if not ok_sql:
        return json.dumps(
            {"ok": False, "security_blocked": True, "error": reason},
            ensure_ascii=False,
            indent=2,
        )

    ext = _load_external_manager()
    if ext and hasattr(ext, "execute_readonly_query"):
        res = ext.execute_readonly_query(
            customer_key=customer_id,
            sql=sql,
            max_rows=max_rows,
            export_csv_path=export_csv_path,
            allowed_customer=allowed_customer,
            auto_export_csv=True,
        )
        return json.dumps(res, ensure_ascii=False, indent=2)

    return json.dumps(
        {"ok": False, "error": "Khong tai duoc module customer_profile_manager.py."},
        ensure_ascii=False,
    )


def _handle_run_mfg_report(args: dict, ctx) -> str:
    args = args or {}
    allowed_customer = str(args.get("allowed_customer") or "").strip()
    customer_id = str(args.get("customer_id") or args.get("id") or allowed_customer or "SBO_MAIN_PROD").strip() or "SBO_MAIN_PROD"
    report_type = str(args.get("report_type") or "").strip()
    from_date = str(args.get("from_date") or "").strip()
    to_date = str(args.get("to_date") or "").strip()
    whs_code = str(args.get("whs_code") or "").strip()
    item_code = str(args.get("item_code") or "").strip()
    batch_num = str(args.get("batch_num") or "").strip()
    wo_num = str(args.get("wo_num") or "").strip()
    max_rows = int(args.get("max_rows") or 20)

    if not report_type:
        return json.dumps(
            {
                "ok": False,
                "error": (
                    "Thieu report_type. Cac loai bao cao ho tro: po_status, sale_status, gross_profit, "
                    "wo_cost_allocation, wo_cost_detail, daily_hour_report, inventory_movement, "
                    "inventory_account, inventory_batch, inventory_posting, batch_tracking, delivery_note, item_master."
                ),
            },
            ensure_ascii=False,
        )

    ext = _load_external_manager()
    if ext and hasattr(ext, "run_mfg_standard_report"):
        res = ext.run_mfg_standard_report(
            customer_key=customer_id,
            report_type=report_type,
            from_date=from_date,
            to_date=to_date,
            whs_code=whs_code,
            item_code=item_code,
            batch_num=batch_num,
            wo_num=wo_num,
            max_rows=max_rows,
            allowed_customer=allowed_customer,
        )
        return json.dumps(res, ensure_ascii=False, indent=2)

    return json.dumps(
        {"ok": False, "error": "Khong tai duoc module customer_profile_manager.py."},
        ensure_ascii=False,
    )


def _handle_service_layer_call(args: dict, ctx) -> str:
    args = args or {}
    customer_id = str(args.get("customer_id") or args.get("id") or "SBO_MAIN_PROD").strip() or "SBO_MAIN_PROD"
    endpoint = str(args.get("endpoint") or "").strip()
    method = str(args.get("method") or "GET").strip().upper()
    payload = args.get("payload")
    query_params = args.get("query_params")
    timeout = int(args.get("timeout") or 20)

    ext = _load_external_manager()
    if ext and hasattr(ext, "call_service_layer"):
        res = ext.call_service_layer(
            customer_key=customer_id,
            endpoint=endpoint,
            method=method,
            payload=payload,
            query_params=query_params,
            timeout=timeout,
        )
        return json.dumps(res, ensure_ascii=False, indent=2)

    return json.dumps(
        {"ok": False, "error": "Khong tai duoc module customer_profile_manager.py."},
        ensure_ascii=False,
    )


def _handle_help_query_search(args: dict, ctx) -> str:
    args = args or {}
    keyword = str(args.get("keyword") or "").strip()
    table_name = str(args.get("table_name") or "").strip()
    category = str(args.get("category") or "").strip()
    max_results = int(args.get("max_results") or 15)

    ext = _load_external_manager()
    if ext and hasattr(ext, "search_help_queries"):
        res = ext.search_help_queries(
            keyword=keyword,
            table_name=table_name,
            category=category,
            max_results=max_results,
        )
        return json.dumps(res, ensure_ascii=False, indent=2)

    return json.dumps(
        {
            "ok": False,
            "error": "Khong tim thay thu muc <WORKSPACE_DIR>\\SQL SAP B1 hoac /data/sql_sap_b1.",
        },
        ensure_ascii=False,
    )


def register(ctx):
    ctx.register_tool(
        name="sap_customer_list",
        description=(
            "Liet ke cac profile ket noi SQL Server & Service Layer SAP B1 (9.3 / 10.0) & Beas "
            "(Mac dinh la Server 24 DB SBO_MAIN_PROD; ho tro chuyen server qua cu phap /160 hoac /<server>)."
        ),
        handler=_handle_customer_list,
        min_mode="readonly",
        schema={
            "type": "object",
            "properties": {
                "filter": {
                    "type": "string",
                    "description": "Tu khoa loc theo ten, alias, ma khach hang, database hoac IP (bo trong = lay tat ca)",
                }
            },
        },
    )

    ctx.register_tool(
        name="sap_customer_upsert",
        description=(
            "Them moi hoac cap nhat thong tin ket noi SQL Server (User/Password rieng, Server IP, Database, "
            "phien ban SAP B1 9.3/10.0, Beas Manufacturing, thu muc bao cao) cho mot profile cu the."
        ),
        handler=_handle_customer_upsert,
        min_mode="safe",
        schema={
            "type": "object",
            "properties": {
                "id": {"type": "string", "description": "ID dinh danh profile (vd: SBO_MAIN_PROD, SBO_MFG_PLANT1, SBO_MFG_PROD)"},
                "name": {"type": "string", "description": "Ten hien thi cua khach hang / database (vd: SBO_MAIN_PROD, SBO_MFG_PROD)"},
                "customer_code": {"type": "string", "description": "Ma viet tat (vd: SBO_MAIN_PROD, SBO_MFG_PROD, SBO_MFG_PLANT1)"},
                "sap_version": {
                    "type": "string",
                    "enum": ["9.3", "10.0"],
                    "description": "Phien ban SAP Business One ('9.3' hoac '10.0')",
                },
                "has_beas": {
                    "type": "boolean",
                    "description": "Co cai dat Beas Manufacturing khong (true/false)",
                },
                "server": {"type": "string", "description": "Dia chi IP hoac hostname SQL Server"},
                "database": {"type": "string", "description": "Ten Database SAP B1 (vd: SBO_MAIN_PROD)"},
                "username": {"type": "string", "description": "Username SQL rieng"},
                "password": {"type": "string", "description": "Password SQL rieng"},
                "mapped_folders": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Danh sach thu muc bao cao duoc phan quyen",
                },
                "notes": {"type": "string", "description": "Ghi chu ve moi truong"},
            },
            "required": ["name", "server", "database"],
        },
    )

    ctx.register_tool(
        name="sap_customer_test",
        description=(
            "Kiem tra ket noi pyodbc toi SQL Server va SAP Service Layer theo customer_id, "
            "tu dong truy van bang CINF lay CompnyName, Version (SAP B1 9.3/10.0) va kiem tra bang BEAS_FTHAUPT. "
            "MAC DINH: Luon dung customer_id='SBO_MAIN_PROD' (Server 24) khi nguoi dung hoi binh thuong. "
            "Chi dung 'SBO_MFG_PROD' hoac 'SBO_MFG_PLANT1' khi cau hoi co cu phap /160."
        ),
        handler=_handle_customer_test,
        min_mode="readonly",
        schema={
            "type": "object",
            "properties": {
                "customer_id": {
                    "type": "string",
                    "description": (
                        "Mac dinh la 'SBO_MAIN_PROD' (Server 24). "
                        "Chi truyen 'SBO_MFG_PROD' (khi co /160 hoac /160 lt), 'SBO_MFG_PLANT1' (khi co /160 hcm), "
                        "hoac ma server khac khi co cu phap /<server>."
                    ),
                },
                "timeout": {
                    "type": "integer",
                    "description": "Thoi gian cho ket noi (giay, mac dinh 8)",
                },
            },
        },
    )

    ctx.register_tool(
        name="sap_customer_query",
        description=(
            "Chay cau lenh SELECT (hoac script SSMS su dung bang tam #Temp) tren database SAP B1 / Beas. "
            "QUY TAC DINH TUYEN: "
            "(1) Hoi tu do (khong co /) hoac /24 -> truyen customer_id='SBO_MAIN_PROD' (Server A - SBO_MAIN_PROD, SAP 10.0). "
            "(2) /160 (mac dinh) -> truyen customer_id='SBO_MFG_TRAIN' (Server B - SBO_MFG_TRAIN, SAP 9.3). "
            "(3) /160 HCM -> truyen customer_id='SBO_MFG_PLANT1' (Server B HCM - SBO_MFG_PLANT1, SAP 9.3). "
            "(4) /160 LT -> truyen customer_id='SBO_MFG_PROD' (Server B LT - SBO_MFG_PROD, SAP 9.3). "
            "(5) /52 -> truyen customer_id='SBO_PLANT_C' (Server C - SBO_PLANT_C, SAP 9.3)."
        ),
        handler=_handle_customer_query,
        min_mode="readonly",
        schema={
            "type": "object",
            "properties": {
                "customer_id": {
                    "type": "string",
                    "description": (
                        "Mac dinh la 'SBO_MAIN_PROD' (Server A). "
                        "Khi co /160 -> 'SBO_MFG_TRAIN' (SBO_MFG_TRAIN). "
                        "Khi co /160 HCM -> 'SBO_MFG_PLANT1' (SBO_MFG_PLANT1). "
                        "Khi co /160 LT -> 'SBO_MFG_PROD' (SBO_MFG_PROD). "
                        "Khi co /52 -> 'SBO_PLANT_C' (SBO_PLANT_C)."
                    ),
                },
                "sql": {
                    "type": "string",
                    "description": "Cau lenh SQL SELECT (hoac CTE WITH ... SELECT) can chay",
                },
                "max_rows": {
                    "type": "integer",
                    "description": "So dong preview toi da tra ve trong JSON (mac dinh 30; file CSV van chua day du)",
                },
                "export_csv_path": {
                    "type": "string",
                    "description": "Duong dan file CSV tuy chon",
                },
                "allowed_customer": {
                    "type": "string",
                    "description": "Ma khach hang khoa cung cho nhom chat (tuy chon)",
                },
            },
            "required": ["sql"],
        },
    )

    ctx.register_tool(
        name="sap_run_mfg_report",
        description=(
            "Chay truc tiep 1 trong 7 nhom bao cao chuan SSMS (tinh trang PO, Sale SO-Delivery-AR, "
            "Lai lo Gross Profit, Tinh hinh san xuat WO Cost Allocation, Chi tiet WO Costing Detail, "
            "San xuat theo ngay Daily Hour Report, va 7 bao cao Inventory). "
            "QUY TAC MAC DINH: Moi cau hoi binh thuong (khong co /160 hay /<server>) BAT BUOC truyen "
            "customer_id='SBO_MAIN_PROD' (Server 24 - Database SBO_MAIN_PROD) va chay ngay, KHONG hoi lai alias va "
            "KHONG nhac den Server 160. Chi khi co '/160' thi truyen 'SBO_MFG_PROD' (hoac 'SBO_MFG_PLANT1' neu '/160 hcm')."
        ),
        handler=_handle_run_mfg_report,
        min_mode="readonly",
        schema={
            "type": "object",
            "properties": {
                "customer_id": {
                    "type": "string",
                    "description": (
                        "Mac dinh la 'SBO_MAIN_PROD' (Server 24 - Database SBO_MAIN_PROD). "
                        "Truyen 'SBO_MFG_PROD' khi co /160 (hoac /160 lt), 'SBO_MFG_PLANT1' khi co /160 hcm, "
                        "hoac ma server khac khi co /<server>."
                    ),
                },
                "report_type": {
                    "type": "string",
                    "enum": [
                        "po_status",
                        "sale_status",
                        "gross_profit",
                        "wo_cost_allocation",
                        "wo_cost_detail",
                        "daily_hour_report",
                        "inventory_movement",
                        "inventory_account",
                        "inventory_batch",
                        "inventory_posting",
                        "batch_tracking",
                        "delivery_note",
                        "item_master",
                    ],
                    "description": (
                        "Loai bao cao chuan: "
                        "po_status (Tinh trang PO: PO, Goods Receipt & AP Invoice Reconciliation), "
                        "sale_status (Bao cao Sale: SO, Delivery & AR Invoice Reconciliation), "
                        "gross_profit (Bao cao Lai lo: Sales & Gross Profit Analysis Summary & Detail), "
                        "wo_cost_allocation (Tinh hinh san xuat WO: WORK ORDER PRODUCTION COST ALLOCATION Branch), "
                        "wo_cost_detail (Chi tiet WO: Costing_Production_Detail), "
                        "daily_hour_report (San xuat theo ngay: Daily_hour_report), "
                        "inventory_movement (Xuat nhap ton so luong), "
                        "inventory_account (Xuat nhap ton theo tai khoan & gia tri), "
                        "inventory_batch (Xuat nhap ton theo Lo/Batch), "
                        "inventory_posting (So chi tiet giao dich kho OINM), "
                        "batch_tracking (Truy vet Lo/Batch), "
                        "delivery_note (Phieu giao hang), "
                        "item_master (Danh muc vat tu & Ton kho)."
                    ),
                },
                "from_date": {
                    "type": "string",
                    "description": "Tu ngay dinh dang YYYY-MM-DD (vd: '2026-03-01'). Bo trong mac dinh dau nam hien tai.",
                },
                "to_date": {
                    "type": "string",
                    "description": "Den ngay dinh dang YYYY-MM-DD (vd: '2026-03-31'). Bo trong mac dinh hom nay.",
                },
                "whs_code": {
                    "type": "string",
                    "description": "Ma kho can loc (tuy chon, vd: 'WHS01', 'WHS03')",
                },
                "item_code": {
                    "type": "string",
                    "description": "Ma vat tu/thanh pham can loc (tuy chon)",
                },
                "batch_num": {
                    "type": "string",
                    "description": "So Lo/Batch can loc (tuy chon, dung cho batch_tracking)",
                },
                "wo_num": {
                    "type": "string",
                    "description": "So lenh san xuat Work Order can loc (tuy chon, vd: '2510')",
                },
                "max_rows": {
                    "type": "integer",
                    "description": "So dong preview tra ve (mac dinh 20; file CSV van chua TOAN BO du lieu)",
                },
            },
            "required": ["report_type"],
        },
    )

    ctx.register_tool(
        name="sap_service_layer_call",
        description=(
            "Goi REST API SAP B1 10.0 Service Layer tren Server 24 database 'SBO_MAIN_PROD' "
            "(tu dong Login session manager, thuc thi GET/POST/PATCH/DELETE va Logout). "
            "Mac dinh customer_id='SBO_MAIN_PROD'."
        ),
        handler=_handle_service_layer_call,
        min_mode="readonly",
        schema={
            "type": "object",
            "properties": {
                "customer_id": {
                    "type": "string",
                    "description": "Mac dinh la 'SBO_MAIN_PROD' (Server 24).",
                },
                "endpoint": {
                    "type": "string",
                    "description": "Ten endpoint Service Layer (vd: 'Items', \"Items('A00001')\", 'BusinessPartners', 'Orders', 'PurchaseOrders', 'Invoices', 'JournalEntries', 'CompanyService_GetCompanyInfo')",
                },
                "method": {
                    "type": "string",
                    "enum": ["GET", "POST", "PATCH", "PUT", "DELETE"],
                    "description": "HTTP method (mac dinh 'GET' de tra cuu; dung 'POST'/'PATCH' khi test tao/cap nhat chung tu hoac master data tren SBO_MAIN_PROD)",
                },
                "query_params": {
                    "type": "object",
                    "description": "Tham so OData tuy chon cho GET (vd: {'$select': 'ItemCode,ItemName', '$top': 10, '$filter': \"startswith(ItemCode,'A')\"})",
                },
                "payload": {
                    "type": "object",
                    "description": "JSON body khi goi POST / PATCH / PUT tren Service Layer",
                },
                "timeout": {
                    "type": "integer",
                    "description": "Thoi gian cho (giay, mac dinh 20)",
                },
            },
            "required": ["endpoint"],
        },
    )

    ctx.register_tool(
        name="sap_help_query_search",
        description=(
            "Tim kiem cau lenh SQL mau chuan SAP B1 & Beas Manufacturing trong thu muc queries/SYNC_SBO_MFG_PROD_SSMS "
            "va Help/SAPStandard_query.txt, Default_query.txt theo tu khoa hoac ten bang."
        ),
        handler=_handle_help_query_search,
        min_mode="readonly",
        schema={
            "type": "object",
            "properties": {
                "keyword": {
                    "type": "string",
                    "description": "Tu khoa tim kiem trong ten bao cao hoac noi dung SQL (vd: aging, work order, QC, ledger)",
                },
                "table_name": {
                    "type": "string",
                    "description": "Ten bang SAP B1 hoac Beas (vd: BEAS_FTHAUPT, OINV, OJDT, OITM)",
                },
                "category": {
                    "type": "string",
                    "description": "Nhom bao cao (vd: Financials, Production, Purchasing AP, Sales AR, Inventory)",
                },
                "max_results": {
                    "type": "integer",
                    "description": "So luong ket qua toi da (mac dinh 15)",
                },
            },
        },
    )

    def _handle_search_article_images(args: dict, _ctx) -> str:
        args = args or {}
        query = str(args.get("query") or "").strip()
        max_images = int(args.get("max_images") or 2)
        summary_text = str(args.get("summary_text") or "").strip()
        ext = _load_external_manager()
        if ext and hasattr(ext, "search_sap_article_images"):
            res = ext.search_sap_article_images(query=query, max_images=max_images, summary_text=summary_text)
            return json.dumps(res, ensure_ascii=False, indent=2)
        return json.dumps({"ok": False, "error": "Khong nap duoc search_sap_article_images"}, ensure_ascii=False)

    ctx.register_tool(
        name="sap_search_article_images",
        description=(
            "Tim kiem anh chup man hinh minh hoa tu cac bai viet huong dan SAP Business One / Beas Manufacturing "
            "tren web theo cau hoi nghiep vu, dong thoi ket xuat file PDF tai lieu huong dan kem hinh anh (guide_pdf_url). "
            "Tra ve danh sach markdown_image (![title](https://...)) de chen vao cau tra loi giup Zalo Bot tu dong gui anh (sendPhoto)."
        ),
        handler=_handle_search_article_images,
        min_mode="readonly",
        schema={
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "Chu de hoac cau hoi nghiep vu SAP B1 / Beas can tim anh minh hoa (vd: 'SAP Business One A/P Credit Memo Goods Return', 'Beas Manufacturing MRP Wizard')",
                },
                "max_images": {
                    "type": "integer",
                    "description": "So luong anh minh hoa can lay (mac dinh 2, toi da 4)",
                },
                "summary_text": {
                    "type": "string",
                    "description": "Tom tat cac buoc huong dan de chen luon vao dau file PDF minh hoa",
                },
            },
            "required": ["query"],
        },
    )
