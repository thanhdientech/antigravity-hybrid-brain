#!/usr/bin/env python3
"""
customer_profile_manager.py - Bo quan ly cau hinh ket noi SQL Server theo tung khach hang
cho SAP B1 (9.3 / 10.0) & Beas Manufacturing.

Ho tro:
- Dong bo 2 chieu giua <WORKSPACE_DIR>\\SQL SAP B1\\config.json va JAVIS_STATE_DIR/customer_sql_profiles.json
- Cau hinh User / Password SQL rieng biet cho tung khach hang (multi-tenant profile)
- Kiem tra ket noi pyodbc, tu dong nhan dien phien ban SAP B1 (CINF.Version) va Beas (BEAS_FTHAUPT)
- Chay truy van SELECT & multi-statement #Temp table an toan (Read-Only Guard chan 100% lenh ghi bang thật)
- Tu dong xuat ket qua ra file CSV (UTF-8 with BOM de mo Excel tieng Viet) va tra link tai 1-click
- Chay truc tiep 7 nhom bao cao chuan SBO_MFG SSMS (sap_run_mfg_report)
"""
from __future__ import annotations

import argparse
import csv
import datetime
import json
import os
import re
import sys
import unicodedata
import uuid
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

_ENV_SQL_DIR = os.getenv("SAP_B1_SQL_DIR", "").strip()
if _ENV_SQL_DIR and Path(_ENV_SQL_DIR).exists():
    DEFAULT_SQL_APP_DIR = Path(_ENV_SQL_DIR)
elif Path(r"<WORKSPACE_DIR>\SQL SAP B1").exists():
    DEFAULT_SQL_APP_DIR = Path(r"<WORKSPACE_DIR>\SQL SAP B1")
elif Path("/opt/antigravity-erp/data/sql_sap_b1").exists():
    DEFAULT_SQL_APP_DIR = Path("/opt/antigravity-erp/data/sql_sap_b1")
else:
    DEFAULT_SQL_APP_DIR = Path(__file__).resolve().parent

DEFAULT_CONFIG_PATH = Path(os.getenv("SAP_B1_SQL_CONFIG", str(DEFAULT_SQL_APP_DIR / "config.json")))

# Cac tu khoa cam tuyet doi tren bang that trong che do Read-Only
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

# Ban do 7 nhom bao cao chuan SBO_MFG SSMS (+ cac bao cao con trong Inventory)
MFG_STANDARD_REPORTS: Dict[str, Dict[str, str]] = {
    "po_status": {
        "rel_path": "Purchasing AP/PO, Goods Receipt & AP Invoice Reconciliation Report.sql",
        "title": "PO, Goods Receipt & AP Invoice Reconciliation Report (Tinh trang PO)",
        "slug": "PO_Reconciliation",
    },
    "sale_status": {
        "rel_path": "Sales AR/SO, Delivery & AR Invoice Reconciliation Report.sql",
        "title": "SO, Delivery & AR Invoice Reconciliation Report (Bao cao Sale SO-Delivery-AR)",
        "slug": "SO_Delivery_AR_Reconciliation",
    },
    "gross_profit": {
        "rel_path": "Sales AR/Sales & Gross Profit Analysis Report (Summary & Detail).txt",
        "title": "Sales & Gross Profit Analysis Report (Bao cao Doanh thu & Lai lo Gop)",
        "slug": "Sales_Gross_Profit_Analysis",
    },
    "wo_cost_allocation": {
        "rel_path": "Financials/WORK ORDER PRODUCTION COST ALLOCATION Branch.sql",
        "title": "WORK ORDER PRODUCTION COST ALLOCATION Branch (Tinh hinh san xuat & Gia thanh WO)",
        "slug": "WO_Production_Cost_Allocation",
    },
    "wo_cost_detail": {
        "rel_path": "Financials/Costing_Production_Detail.sql",
        "title": "Costing_Production_Detail (Chi tiet chi phi san xuat WO)",
        "slug": "Costing_Production_Detail",
    },
    "daily_hour_report": {
        "rel_path": "Production/Daily_hour_report.sql",
        "title": "Daily_hour_report (Bao cao san xuat theo ngay & gio may)",
        "slug": "Daily_Hour_Report",
    },
    "inventory_movement": {
        "rel_path": "Inventory/Inventory movement.sql",
        "title": "Inventory movement (Bao cao Xuat Nhap Ton kho theo So luong)",
        "slug": "Inventory_Movement",
    },
    "inventory_account": {
        "rel_path": "Inventory/Inventory movement account.sql",
        "title": "Inventory movement account (Bao cao Xuat Nhap Ton theo Tai khoan & Gia tri)",
        "slug": "Inventory_Movement_Account",
    },
    "inventory_batch": {
        "rel_path": "Inventory/Inventory movement account Batch.sql",
        "title": "Inventory movement account Batch (Bao cao Xuat Nhap Ton theo Lo/Batch)",
        "slug": "Inventory_Movement_Batch",
    },
    "inventory_posting": {
        "rel_path": "Inventory/Inventory Posting List.sql",
        "title": "Inventory Posting List (So chi tiet giao dich kho OINM)",
        "slug": "Inventory_Posting_List",
    },
    "batch_tracking": {
        "rel_path": "Inventory/Batch Tracking Report.sql",
        "title": "Batch Tracking Report (Bao cao truy vet Lo/Batch)",
        "slug": "Batch_Tracking_Report",
    },
    "delivery_note": {
        "rel_path": "Inventory/Delivery Note.sql",
        "title": "Delivery Note (Bang ke Phieu giao hang ODLN/DLN1)",
        "slug": "Delivery_Note",
    },
    "item_master": {
        "rel_path": "Inventory/Item.sql",
        "title": "Item Master & Stock (Danh muc Vat tu & Ton kho hien tai)",
        "slug": "Item_Master_Stock",
    },
}

REPORT_ALIASES: Dict[str, str] = {
    "po": "po_status",
    "tinh_trang_po": "po_status",
    "tinhtrangpo": "po_status",
    "po_reconciliation": "po_status",
    "sale": "sale_status",
    "sales": "sale_status",
    "so": "sale_status",
    "tinh_trang_so": "sale_status",
    "so_reconciliation": "sale_status",
    "lai_lo": "gross_profit",
    "lailo": "gross_profit",
    "gp": "gross_profit",
    "profit": "gross_profit",
    "sales_gross_profit": "gross_profit",
    "wo": "wo_cost_allocation",
    "tinh_hinh_san_xuat_wo": "wo_cost_allocation",
    "tinh_hinh_wo": "wo_cost_allocation",
    "wo_cost": "wo_cost_allocation",
    "work_order_production_cost_allocation": "wo_cost_allocation",
    "chi_tiet_wo": "wo_cost_detail",
    "chitietwo": "wo_cost_detail",
    "costing_production_detail": "wo_cost_detail",
    "san_xuat_theo_ngay": "daily_hour_report",
    "sanxuattheongay": "daily_hour_report",
    "daily_hour": "daily_hour_report",
    "inventory": "inventory_movement",
    "ton_kho": "inventory_movement",
    "xuat_nhap_ton": "inventory_movement",
    "inventory_movement_account": "inventory_account",
    "xuat_nhap_ton_tai_khoan": "inventory_account",
    "inventory_movement_batch": "inventory_batch",
    "xuat_nhap_ton_batch": "inventory_batch",
    "inventory_posting_list": "inventory_posting",
    "batch": "batch_tracking",
    "delivery": "delivery_note",
    "item": "item_master",
}


def _resolve_config_paths(custom_path: Optional[str] = None) -> List[Path]:
    """Tra ve danh sach cac duong dan file config (uu tien file chinh + fallback state dir)."""
    paths: List[Path] = []
    if custom_path:
        paths.append(Path(custom_path))
    if DEFAULT_CONFIG_PATH not in paths:
        paths.append(DEFAULT_CONFIG_PATH)
    for linux_cfg in (
        Path("/opt/antigravity-erp/data/sql_sap_b1/config.json"),
        Path("/data/sql_sap_b1/config.json"),
    ):
        if linux_cfg not in paths and linux_cfg.parent.exists():
            paths.append(linux_cfg)
    state_dir = os.getenv("JAVIS_STATE_DIR", "").strip()
    if state_dir:
        sp = Path(state_dir) / "customer_sql_profiles.json"
        if sp not in paths:
            paths.append(sp)
    return paths


def _resolve_exports_dir() -> Path:
    """Tra ve thu muc luu file CSV/Excel de tai ve qua HTTP /exports/<filename>."""
    state_dir = os.getenv("JAVIS_STATE_DIR", "").strip()
    if state_dir:
        d = Path(state_dir) / "exports"
    elif Path("/opt/antigravity-erp/state_enterprise").exists():
        d = Path("/opt/antigravity-erp/state_enterprise/exports")
    else:
        d = DEFAULT_SQL_APP_DIR / "exports"
    d.mkdir(parents=True, exist_ok=True)
    return d


def _export_rows_to_csv(
    columns: List[str],
    rows: List[Dict[str, Any]],
    report_slug: str,
    customer_code: str,
    custom_csv_path: str = "",
    ts_override: str = "",
) -> Tuple[str, str]:
    """Ghi toan bo dong ket qua ra file CSV (utf-8-sig de mo Excel khong loi font) va tra (path, url)."""
    ts = ts_override or datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
    safe_slug = re.sub(r"[^A-Za-z0-9-]+", "-", str(report_slug or "SAP-Report").replace("_", "-")).strip("-")[:45]
    safe_cust = re.sub(r"[^A-Za-z0-9-]+", "-", str(customer_code or "DB").replace("_", "-")).strip("-")[:20]
    filename = f"{safe_slug}-{safe_cust}-{ts}.csv"

    exp_dir = _resolve_exports_dir()
    out_p = exp_dir / filename
    with open(out_p, "w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=columns)
        writer.writeheader()
        writer.writerows(rows)

    if custom_csv_path:
        try:
            cp = Path(custom_csv_path)
            cp.parent.mkdir(parents=True, exist_ok=True)
            if cp.resolve() != out_p.resolve():
                with open(cp, "w", encoding="utf-8-sig", newline="") as f2:
                    writer2 = csv.DictWriter(f2, fieldnames=columns)
                    writer2.writeheader()
                    writer2.writerows(rows)
        except Exception:
            pass

    base_url = os.getenv("JAVIS_PUBLIC_EXPORT_BASE", "https://erp-portal.example.com").rstrip("/")
    download_url = f"{base_url}/exports/{filename}"
    return str(out_p.resolve()), download_url


def _export_rows_to_xlsx(
    columns: List[str],
    rows: List[Dict[str, Any]],
    report_slug: str,
    customer_code: str,
    ts_override: str = "",
) -> Tuple[str, str]:
    """Xuat bao cao ra file Excel (.xlsx) co dinh dang bang, mau tieu de va Freeze Panes."""
    try:
        import openpyxl
        from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
        from openpyxl.utils import get_column_letter
    except Exception:
        return "", ""

    ts = ts_override or datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
    safe_slug = re.sub(r"[^A-Za-z0-9-]+", "-", str(report_slug or "SAP-Report").replace("_", "-")).strip("-")[:45]
    safe_cust = re.sub(r"[^A-Za-z0-9-]+", "-", str(customer_code or "DB").replace("_", "-")).strip("-")[:20]
    filename = f"{safe_slug}-{safe_cust}-{ts}.xlsx"
    exp_dir = _resolve_exports_dir()
    out_p = exp_dir / filename

    try:
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = safe_slug[:31] or "Report"

        header_fill = PatternFill(start_color="1F4E78", end_color="1F4E78", fill_type="solid")
        zebra_fill = PatternFill(start_color="F2F6FA", end_color="F2F6FA", fill_type="solid")
        header_font = Font(name="Arial", size=10, bold=True, color="FFFFFF")
        cell_font = Font(name="Arial", size=10)
        thin_side = Side(style="thin", color="D9D9D9")
        border = Border(left=thin_side, right=thin_side, top=thin_side, bottom=thin_side)

        # Row 1: Header
        for col_idx, col_name in enumerate(columns, start=1):
            c = ws.cell(row=1, column=col_idx, value=str(col_name))
            c.fill = header_fill
            c.font = header_font
            c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
            c.border = border

        # Rows
        for row_idx, r_data in enumerate(rows, start=2):
            is_even = (row_idx % 2 == 0)
            for col_idx, col_name in enumerate(columns, start=1):
                val = r_data.get(col_name)
                c = ws.cell(row=row_idx, column=col_idx, value=val)
                c.font = cell_font
                c.border = border
                if is_even:
                    c.fill = zebra_fill
                if isinstance(val, (int, float)) and not isinstance(val, bool):
                    c.number_format = "#,##0.00" if isinstance(val, float) and not val.is_integer() else "#,##0"
                    c.alignment = Alignment(horizontal="right", vertical="center")
                else:
                    c.alignment = Alignment(horizontal="left", vertical="center")

        ws.freeze_panes = "A2"
        ws.row_dimensions[1].height = 24

        # Auto column width (sampled from first 200 rows for speed)
        sample_rows = rows[:200]
        for col_idx, col_name in enumerate(columns, start=1):
            max_len = len(str(col_name or ""))
            for r_data in sample_rows:
                v_str = str(r_data.get(col_name) or "")
                if len(v_str) > max_len:
                    max_len = len(v_str)
            col_letter = get_column_letter(col_idx)
            ws.column_dimensions[col_letter].width = max(10, min(max_len + 4, 42))

        wb.save(str(out_p))
        base_url = os.getenv("JAVIS_PUBLIC_EXPORT_BASE", "https://erp-portal.example.com").rstrip("/")
        return str(out_p.resolve()), f"{base_url}/exports/{filename}"
    except Exception:
        return "", ""


def _find_unicode_ttf() -> Tuple[str, str]:
    """Tim font TrueType ho tro Tieng Viet / Unicode tren Linux hoac Windows."""
    candidates = [
        ("/usr/share/fonts/truetype/ubuntu/Ubuntu-R.ttf", "/usr/share/fonts/truetype/ubuntu/Ubuntu-B.ttf"),
        ("/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf", "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"),
        ("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"),
        ("C:/Windows/Fonts/arial.ttf", "C:/Windows/Fonts/arialbd.ttf"),
        ("C:/Windows/Fonts/tahoma.ttf", "C:/Windows/Fonts/tahomabd.ttf"),
    ]
    for reg, bold in candidates:
        if Path(reg).is_file():
            return reg, (bold if Path(bold).is_file() else reg)
    return "", ""


def _export_rows_to_pdf(
    columns: List[str],
    rows: List[Dict[str, Any]],
    report_slug: str,
    customer_code: str,
    ts_override: str = "",
) -> Tuple[str, str]:
    """Xuat bao cao ra file PDF (Landscape) ho tro Tieng Viet de xem ngay tren dien thoai Zalo."""
    try:
        from reportlab.lib import colors
        from reportlab.lib.pagesizes import A4, A3, landscape
        from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.pdfbase import pdfmetrics
        from reportlab.pdfbase.ttfonts import TTFont
    except Exception:
        return "", ""

    ts = ts_override or datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
    safe_slug = re.sub(r"[^A-Za-z0-9-]+", "-", str(report_slug or "SAP-Report").replace("_", "-")).strip("-")[:45]
    safe_cust = re.sub(r"[^A-Za-z0-9-]+", "-", str(customer_code or "DB").replace("_", "-")).strip("-")[:20]
    filename = f"{safe_slug}-{safe_cust}-{ts}.pdf"
    exp_dir = _resolve_exports_dir()
    out_p = exp_dir / filename

    try:
        reg_ttf, bold_ttf = _find_unicode_ttf()
        font_reg = "Helvetica"
        font_bold = "Helvetica-Bold"
        if reg_ttf:
            pdfmetrics.registerFont(TTFont("UniReg", reg_ttf))
            pdfmetrics.registerFont(TTFont("UniBold", bold_ttf or reg_ttf))
            font_reg = "UniReg"
            font_bold = "UniBold"

        # Chon kho giay A3 ngang neu nhieu cot (>8 cot), nguoc lai A4 ngang
        use_cols = columns[:14]
        page_sz = landscape(A3) if len(use_cols) > 8 else landscape(A4)
        doc = SimpleDocTemplate(
            str(out_p),
            pagesize=page_sz,
            leftMargin=18,
            rightMargin=18,
            topMargin=20,
            bottomMargin=20,
        )

        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            "RepTitle",
            parent=styles["Heading1"],
            fontName=font_bold,
            fontSize=13,
            leading=16,
            textColor=colors.HexColor("#1F4E78"),
            spaceAfter=4,
        )
        sub_style = ParagraphStyle(
            "RepSub",
            parent=styles["Normal"],
            fontName=font_reg,
            fontSize=9,
            leading=12,
            textColor=colors.HexColor("#555555"),
            spaceAfter=10,
        )
        th_style = ParagraphStyle(
            "RepTH",
            parent=styles["Normal"],
            fontName=font_bold,
            fontSize=7.5,
            leading=9.5,
            textColor=colors.white,
        )
        td_style = ParagraphStyle(
            "RepTD",
            parent=styles["Normal"],
            fontName=font_reg,
            fontSize=7.5,
            leading=9.5,
            textColor=colors.HexColor("#222222"),
        )

        story = []
        story.append(Paragraph(f"ENTERPRISE SAP B1 / BEAS REPORT: {safe_slug} ({safe_cust})", title_style))
        story.append(
            Paragraph(
                f"Exported: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')} | Total Rows: {len(rows)} "
                f"(Showing top {min(len(rows), 250)} rows in PDF - see .xlsx/.csv for all rows)",
                sub_style,
            )
        )

        table_data = [[Paragraph(str(c), th_style) for c in use_cols]]
        for r_data in rows[:250]:
            row_cells = []
            for c in use_cols:
                v = r_data.get(c)
                if isinstance(v, float):
                    s_val = f"{v:,.2f}" if not v.is_integer() else f"{int(v):,}"
                elif isinstance(v, int) and not isinstance(v, bool):
                    s_val = f"{v:,}"
                else:
                    s_val = "" if v is None else str(v)
                s_val = s_val.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")[:90]
                row_cells.append(Paragraph(s_val, td_style))
            table_data.append(row_cells)

        avail_w = page_sz[0] - 36
        col_w = avail_w / max(1, len(use_cols))
        tbl = Table(table_data, colWidths=[col_w] * len(use_cols), repeatRows=1)
        tbl.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1F4E78")),
                    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F2F6FA")]),
                    ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#CCCCCC")),
                    ("TOPPADDING", (0, 0), (-1, -1), 3),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
                    ("LEFTPADDING", (0, 0), (-1, -1), 4),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 4),
                ]
            )
        )
        story.append(tbl)
        doc.build(story)

        base_url = os.getenv("JAVIS_PUBLIC_EXPORT_BASE", "https://erp-portal.example.com").rstrip("/")
        return str(out_p.resolve()), f"{base_url}/exports/{filename}"
    except Exception:
        return "", ""


def _export_rows_to_bundle(
    columns: List[str],
    rows: List[Dict[str, Any]],
    report_slug: str,
    customer_code: str,
    custom_csv_path: str = "",
) -> Dict[str, str]:
    """Xuat dong thoi ca 3 file (.xlsx, .pdf, .csv) cung ten va timestamp."""
    ts = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
    csv_path, csv_url = _export_rows_to_csv(columns, rows, report_slug, customer_code, custom_csv_path, ts_override=ts)
    xlsx_path, xlsx_url = _export_rows_to_xlsx(columns, rows, report_slug, customer_code, ts_override=ts)
    pdf_path, pdf_url = _export_rows_to_pdf(columns, rows, report_slug, customer_code, ts_override=ts)
    return {
        "csv_path": csv_path,
        "csv_download_url": csv_url,
        "xlsx_path": xlsx_path,
        "xlsx_download_url": xlsx_url,
        "pdf_path": pdf_path,
        "pdf_download_url": pdf_url,
    }


def _strip_accents(text: str) -> str:
    s = unicodedata.normalize("NFD", str(text or ""))
    s = "".join(ch for ch in s if unicodedata.category(ch) != "Mn")
    return s.replace("đ", "d").replace("Đ", "D").lower().strip()


def _normalize_profile(raw: Dict[str, Any], index: int = 0) -> Dict[str, Any]:
    """Chuan hoa 1 profile khach hang, giu tuong thich nguoc voi app.py & admin_dashboard.py."""
    cid = str(raw.get("id") or f"db_{index}").strip()
    name = str(raw.get("name") or cid).strip()
    db_name = str(raw.get("database") or "").strip()
    customer_code = str(raw.get("customer_code") or "").strip()
    if not customer_code:
        base = name.split("_")[0] if "_" in name else name
        customer_code = re.sub(r"[^A-Za-z0-9_-]", "", base).upper() or cid.upper()

    sap_ver = str(raw.get("sap_version") or "10.0").strip()
    if sap_ver not in ("9.3", "10.0"):
        sap_ver = "9.3" if "9.3" in sap_ver or "93" in sap_ver else "10.0"

    has_beas = raw.get("has_beas")
    if has_beas is None:
        has_beas = True
    else:
        has_beas = bool(has_beas)

    mapped = raw.get("mapped_folders")
    if not isinstance(mapped, list):
        mapped = []

    aliases = raw.get("aliases")
    if not isinstance(aliases, list):
        aliases = []

    srv_str = str(raw.get("server") or "localhost").strip()
    ip_last = srv_str.split(".")[-1] if "." in srv_str else srv_str
    default_banner = f"Em đang trả kết quả từ con {ip_last} ({db_name})."
    if db_name.upper() == "SBO_MFG_PLANT1" or cid.lower() == "SBO_MFG_PLANT1":
        default_banner = "Em đang trả kết quả từ Server B HCM."
    elif db_name.upper() == "SBO_MFG_PROD" or cid.lower() == "SBO_MFG_PROD":
        default_banner = "Em đang trả kết quả từ Server B LT."
    elif db_name.upper() == "SBO_MFG_TRAIN" or cid.lower() == "SBO_MFG_TRAIN":
        default_banner = "Em đang trả kết quả từ Server B (SBO_MFG_TRAIN)."
    elif db_name.upper() == "SBO_PLANT_C" or cid.lower() == "SBO_PLANT_C":
        default_banner = "Em đang trả kết quả từ Server C (SBO_PLANT_C)."
    elif db_name.upper() == "ECC" or cid.lower() == "SBO_PLANT_D_MAIN":
        default_banner = "Em đang trả kết quả từ Server D (ECC)."
    elif db_name.upper() == "SBO_PLANT_D_DEMO" or cid.lower() == "SBO_PLANT_D_DEMO":
        default_banner = "Em đang trả kết quả từ Server D (SBO_PLANT_D_DEMO)."
    elif db_name.lower() == "SBO_MAIN_PROD" or cid.lower() == "SBO_MAIN_PROD":
        default_banner = "Em đang trả kết quả từ Server A (SBO_MAIN_PROD)."
    source_banner = str(raw.get("source_banner") or default_banner).strip()

    return {
        "id": cid,
        "name": name,
        "customer_code": customer_code,
        "aliases": [str(a).strip() for a in aliases if str(a).strip()],
        "sap_version": sap_ver,
        "has_beas": has_beas,
        "server": srv_str,
        "database": db_name,
        "username": str(raw.get("username") or "sap_readonly_user").strip(),
        "password": str(raw.get("password") or ""),
        "service_layer_url": str(raw.get("service_layer_url") or "").strip(),
        "sl_username": str(raw.get("sl_username") or "").strip(),
        "sl_password": str(raw.get("sl_password") or ""),
        "allow_service_layer": bool(raw.get("allow_service_layer", False)),
        "allow_unsafe": bool(raw.get("allow_unsafe", False)),
        "grant_all_folders": bool(raw.get("grant_all_folders", len(mapped) == 0)),
        "mapped_folders": mapped,
        "source_banner": source_banner,
        "notes": str(raw.get("notes") or "").strip(),
    }


def load_raw_config(custom_path: Optional[str] = None) -> Tuple[Dict[str, Any], Path]:
    """Doc config.json tu duong dan uu tien, tra ve (config_dict, active_path)."""
    paths = _resolve_config_paths(custom_path)
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
    target = paths[0]
    return {"connections": []}, target


def save_raw_config(data: Dict[str, Any], custom_path: Optional[str] = None) -> List[str]:
    """Ghi config.json vao file chinh va dong bo sang file state_dir neu co."""
    paths = _resolve_config_paths(custom_path)
    saved_to: List[str] = []
    payload = json.dumps(data, indent=4, ensure_ascii=False)
    for idx, p in enumerate(paths):
        if idx == 0 or p.parent.exists() or "state" in str(p).lower():
            try:
                p.parent.mkdir(parents=True, exist_ok=True)
                p.write_text(payload, encoding="utf-8")
                saved_to.append(str(p))
            except Exception:
                pass
    return saved_to


def list_profiles(mask_password: bool = True, custom_path: Optional[str] = None) -> Dict[str, Any]:
    """Liet ke danh sach profile SQL khach hang."""
    data, active_path = load_raw_config(custom_path)
    profiles: List[Dict[str, Any]] = []
    for c in data.get("connections", []):
        item = dict(c)
        if mask_password:
            raw_pw = item.get("password") or ""
            item["password"] = "***" if raw_pw else "(empty)"
            item["has_password"] = bool(raw_pw)
            raw_sl_pw = item.get("sl_password") or ""
            item["sl_password"] = "***" if raw_sl_pw else "(empty)"
            item["has_sl_password"] = bool(raw_sl_pw)
        profiles.append(item)
    return {
        "ok": True,
        "config_path": str(active_path),
        "count": len(profiles),
        "profiles": profiles,
    }


_DEFAULT_SERVER24_KEYS = {
    "exit",
    "/exit",
    "out",
    "/out",
    "reset",
    "/reset",
    "quit",
    "/quit",
    "",
    "default",
    "auto",
    "24",
    "/24",
    "server24",
    "server_24",
    "SBO_MAIN_PROD",
    "demo",
    "all",
    "any",
    "unknown",
    "none",
    "null",
    "ask",
    "?",
    "db",
    "database",
    "server",
    "sap",
    "sap_b1",
    "sapb1",
    "beas",
    "enterprise",
}


def _find_default_server24_profile(conns: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    """Tim profile mac dinh Server 24 - Database SBO_MAIN_PROD."""
    for c in conns:
        cid = str(c.get("id") or "").lower()
        db = str(c.get("database") or "").lower()
        srv = str(c.get("server") or "").lower()
        if cid == "SBO_MAIN_PROD" or db == "SBO_MAIN_PROD" or srv.endswith(".24"):
            return c
    return conns[0] if conns else None


def build_clarify_customer_message(customer_key: str = "", custom_path: Optional[str] = None) -> str:
    """Thong bao khi ma server khong ton tai."""
    return (
        f"Khong tim thay cau hinh server/database phu hop voi '{customer_key}'. "
        "Mac dinh he thong su dung database 'SBO_MAIN_PROD' (Server 24). "
        "Neu muon truy van server khac, vui long dung cu phap '/160' (SBO_MFG Long Thanh), '/160 hcm' (SBO_MFG HCM) hoac '/<ma_server>'."
    )


def resolve_profile_strict(
    customer_key: str, custom_path: Optional[str] = None
) -> Tuple[Optional[Dict[str, Any]], str]:
    """
    Tim profile theo quy tac:
    1. Mac dinh (khi hoi tu do / khong truyen hoac truyen 24 / SBO_MAIN_PROD) -> Server 24 Database 'SBO_MAIN_PROD'.
    2. Khi truyen '/160', '160', '160_train', 'SBO_MFG_TRAIN', 'SBO_MFG_TRAIN' -> Server 160 Database 'SBO_MFG_TRAIN'.
    3. Khi truyen '/160 hcm', '160_hcm', 'SBO_MFG_PLANT1', 'SBO_MFG_PLANT1' -> Server 160 Database 'SBO_MFG_PLANT1'.
    4. Khi truyen '/160 lt', '160_lt', 'SBO_MFG_PROD', 'SBO_MFG_PROD' -> Server 160 Database 'SBO_MFG_PROD'.
    5. Khi truyen '/52', '52', 'plant_c', 'SBO_PLANT_C', 'SBO_PLANT_C' -> Server 52 Database 'SBO_PLANT_C'.
    6. Khi truyen '/<duoi_IP>' hoac '<ma_server>' cho cac server mo rong sau nay -> Tu dong khop theo duoi IP hoac id/alias.
    """
    data, _ = load_raw_config(custom_path)
    conns = data.get("connections", [])
    if not conns:
        return None, "Chua co cau hinh ket noi SQL nao trong config.json."

    raw_k = _strip_accents(customer_key).lstrip("/").strip()
    k_compact = re.sub(r"[^a-z0-9]+", "_", raw_k).strip("_")

    # 1. Mac dinh -> Server 24 (database SBO_MAIN_PROD)
    if not raw_k or raw_k in _DEFAULT_SERVER24_KEYS or k_compact in _DEFAULT_SERVER24_KEYS:
        prof24 = _find_default_server24_profile(conns)
        if prof24:
            return prof24, ""

    # 2. Cu phap /160 HCM -> SBO_MFG_PLANT1
    if k_compact in ("160_hcm", "160hcm", "SBO_MFG_PLANT1", "SBO_MFG_PLANT1", "hcm", "con_160_hcm"):
        for c in conns:
            if str(c.get("id") or "").upper() == "SBO_MFG_PLANT1" or str(c.get("database") or "").upper() == "SBO_MFG_PLANT1":
                return c, ""

    # 3. Cu phap /160 LT -> SBO_MFG_PROD
    if k_compact in ("160_lt", "160lt", "160_long_thanh", "SBO_MFG_PROD", "SBO_MFG_PROD", "long_thanh", "con_160_lt"):
        for c in conns:
            if str(c.get("id") or "").upper() == "SBO_MFG_PROD" or str(c.get("database") or "").upper() == "SBO_MFG_PROD":
                return c, ""

    # 4. Cu phap /160 (mac dinh cua 160) -> SBO_MFG_TRAIN
    if k_compact in ("160", "160_train", "160train", "SBO_MFG_TRAIN", "SBO_MFG_TRAIN", "sbo_mfg", "fvi", "con_160"):
        for c in conns:
            if str(c.get("id") or "").upper() == "SBO_MFG_TRAIN" or str(c.get("database") or "").upper() == "SBO_MFG_TRAIN":
                return c, ""

    # 5. Cu phap /52 -> SBO_PLANT_C
    if k_compact in ("52", "server_52", "con_52", "plant_c", "SBO_PLANT_C", "SBO_PLANT_C"):
        for c in conns:
            if str(c.get("id") or "").upper() == "SBO_PLANT_C" or str(c.get("database") or "").upper() == "SBO_PLANT_C":
                return c, ""

    # 6. Cu phap /27 HTL -> SBO_PLANT_D_DEMO
    if k_compact in ("27_htl", "27htl", "27_plant_d_demo", "htl", "SBO_PLANT_D_DEMO", "SBO_PLANT_D_DEMO", "con_27_htl"):
        for c in conns:
            if str(c.get("id") or "").upper() == "SBO_PLANT_D_DEMO" or str(c.get("database") or "").upper() == "SBO_PLANT_D_DEMO":
                return c, ""

    # 7. Cu phap /27 hoac /27 ECC -> ECC
    if k_compact in ("27", "27_ecc", "27ecc", "ecc", "SBO_PLANT_D_MAIN", "server_27", "con_27"):
        for c in conns:
            if str(c.get("id") or "").upper() == "SBO_PLANT_D_MAIN" or str(c.get("database") or "").upper() == "ECC":
                return c, ""

    # 3. Kiem tra khop chinh xac 100% tren id, customer_code, name, database, aliases, hoac duoi IP server (vd: /165 -> .165)
    exact_matches: List[Dict[str, Any]] = []
    for c in conns:
        srv_ip = str(c.get("server") or "").strip()
        ip_suffix = srv_ip.split(".")[-1] if "." in srv_ip else ""
        candidates = [
            c.get("id", ""),
            c.get("customer_code", ""),
            c.get("name", ""),
            c.get("database", ""),
            ip_suffix,
        ] + list(c.get("aliases") or [])
        for cand in candidates:
            cand_norm = _strip_accents(cand).lstrip("/").strip()
            cand_compact = re.sub(r"[^a-z0-9]+", "_", cand_norm).strip("_")
            if raw_k == cand_norm or (k_compact and k_compact == cand_compact):
                exact_matches.append(c)
                break
    if len(exact_matches) >= 1:
        return exact_matches[0], ""

    # 4. Kiem tra substring
    sub_matches: List[Dict[str, Any]] = []
    for c in conns:
        candidates = [
            c.get("id", ""),
            c.get("customer_code", ""),
            c.get("name", ""),
            c.get("database", ""),
        ] + list(c.get("aliases") or [])
        for cand in candidates:
            cand_norm = _strip_accents(cand).lstrip("/").strip()
            cand_compact = re.sub(r"[^a-z0-9]+", "_", cand_norm).strip("_")
            if (
                (len(cand_norm) >= 3 and len(raw_k) >= 3 and (raw_k in cand_norm or cand_norm in raw_k))
                or (
                    len(cand_compact) >= 3
                    and len(k_compact) >= 3
                    and (k_compact in cand_compact or cand_compact in k_compact)
                )
            ):
                sub_matches.append(c)
                break
    if len(sub_matches) >= 1:
        return sub_matches[0], ""

    # Fallback an toan ve Server 24 SBO_MAIN_PROD
    prof24 = _find_default_server24_profile(conns)
    if prof24:
        return prof24, ""
    return None, build_clarify_customer_message(customer_key, custom_path)


def get_profile(customer_key: str, custom_path: Optional[str] = None) -> Optional[Dict[str, Any]]:
    """Tim profile theo id, customer_code, name, database hoac aliases (chi tra ve khi khong mo ho)."""
    prof, _ = resolve_profile_strict(customer_key, custom_path)
    return prof


def upsert_profile(
    name: str,
    server: str,
    database: str,
    username: str = "sap_readonly_user",
    password: str = "",
    customer_id: str = "",
    customer_code: str = "",
    sap_version: str = "10.0",
    has_beas: bool = True,
    mapped_folders: Optional[List[str]] = None,
    allow_unsafe: bool = False,
    grant_all_folders: Optional[bool] = None,
    notes: str = "",
    custom_path: Optional[str] = None,
) -> Dict[str, Any]:
    """Them moi hoac cap nhat thong tin ket noi SQL rieng cho 1 khach hang."""
    name = str(name or "").strip()
    server = str(server or "").strip()
    database = str(database or "").strip()
    username = str(username or "sap_readonly_user").strip()

    if not name or not server or not database:
        return {
            "ok": False,
            "error": "Thieu thong tin bat buoc: name, server, database khong duoc de trong.",
        }

    data, _ = load_raw_config(custom_path)
    conns: List[Dict[str, Any]] = data.get("connections", [])

    existing_idx = -1
    cid = str(customer_id or "").strip()
    for i, c in enumerate(conns):
        if cid and str(c.get("id", "")).lower() == cid.lower():
            existing_idx = i
            break
        if str(c.get("name", "")).lower() == name.lower():
            existing_idx = i
            break

    if existing_idx >= 0:
        old = conns[existing_idx]
        final_id = cid or old.get("id") or f"db_{uuid.uuid4().hex[:8]}"
        final_pw = password if password != "" else old.get("password", "")
        final_folders = mapped_folders if mapped_folders is not None else old.get("mapped_folders", [])
        final_grant_all = (
            grant_all_folders
            if grant_all_folders is not None
            else old.get("grant_all_folders", len(final_folders) == 0)
        )
        final_notes = notes if notes != "" else old.get("notes", "")
        final_code = customer_code or old.get("customer_code", "")
        aliases = old.get("aliases", [])
        action = "updated"
    else:
        final_id = cid or f"db_{uuid.uuid4().hex[:8]}"
        final_pw = password
        final_folders = mapped_folders if mapped_folders is not None else []
        final_grant_all = grant_all_folders if grant_all_folders is not None else (len(final_folders) == 0)
        final_notes = notes
        final_code = customer_code
        aliases = []
        action = "created"

    profile = _normalize_profile(
        {
            "id": final_id,
            "name": name,
            "customer_code": final_code,
            "aliases": aliases,
            "sap_version": sap_version,
            "has_beas": has_beas,
            "server": server,
            "database": database,
            "username": username,
            "password": final_pw,
            "allow_unsafe": allow_unsafe,
            "grant_all_folders": final_grant_all,
            "mapped_folders": final_folders,
            "notes": final_notes,
        }
    )

    if existing_idx >= 0:
        conns[existing_idx] = profile
    else:
        conns.append(profile)

    data["connections"] = conns
    saved_paths = save_raw_config(data, custom_path)

    safe_profile = dict(profile)
    safe_profile["password"] = "***" if safe_profile.get("password") else "(empty)"

    return {
        "ok": True,
        "action": action,
        "saved_to": saved_paths,
        "profile": safe_profile,
    }


def _open_pyodbc_connection(profile: Dict[str, Any], timeout: int = 10):
    """Thu ket noi pyodbc qua danh sach cac driver SQL Server pho bien tren Windows/Linux."""
    import pyodbc

    installed = [d for d in pyodbc.drivers() if "SQL Server" in d]
    preferred = [
        "ODBC Driver 18 for SQL Server",
        "ODBC Driver 17 for SQL Server",
        "ODBC Driver 13 for SQL Server",
        "SQL Server Native Client 11.0",
        "SQL Server",
    ]
    drivers_to_try: List[str] = []
    for d in preferred:
        if d in installed and d not in drivers_to_try:
            drivers_to_try.append(d)
    for d in installed:
        if d not in drivers_to_try:
            drivers_to_try.append(d)
    if not drivers_to_try:
        drivers_to_try = ["ODBC Driver 17 for SQL Server", "SQL Server"]

    server = profile.get("server", "localhost")
    database = profile.get("database", "")
    username = profile.get("username", "sap_readonly_user")
    password = profile.get("password", "")

    last_err = None
    for drv in drivers_to_try:
        extra = "TrustServerCertificate=yes;" if "ODBC Driver" in drv else ""
        conn_str = (
            f"DRIVER={{{drv}}};SERVER={server};DATABASE={database};"
            f"UID={username};PWD={password};{extra}"
        )
        try:
            conn = pyodbc.connect(conn_str, timeout=timeout)
            return conn, drv
        except Exception as e:
            last_err = e
    raise RuntimeError(f"Khong the ket noi SQL Server ({server}/{database}): {last_err}")


def test_connection(customer_key: str, timeout: int = 8, custom_path: Optional[str] = None) -> Dict[str, Any]:
    """Kiem tra ket noi SQL (va Service Layer neu co) cua khach hang, doc CINF va kiem tra bang BEAS_FTHAUPT."""
    profile, clarify_err = resolve_profile_strict(customer_key, custom_path)
    if not profile:
        return {
            "ok": False,
            "require_clarification": True,
            "error": clarify_err,
        }

    try:
        conn, driver_used = _open_pyodbc_connection(profile, timeout=timeout)
    except Exception as e:
        return {
            "ok": False,
            "customer_id": profile["id"],
            "name": profile["name"],
            "server": profile["server"],
            "database": profile["database"],
            "username": profile["username"],
            "error": str(e),
        }

    company_name = ""
    raw_version = ""
    detected_sap_version = profile.get("sap_version", "10.0")
    beas_installed = False
    beas_version = ""

    try:
        cur = conn.cursor()
        try:
            cur.execute('SELECT TOP 1 "CompnyName", "Version" FROM "CINF"')
            row = cur.fetchone()
            if row:
                company_name = str(row[0] or "").strip()
                raw_version = str(row[1] or "").strip()
                if raw_version.startswith("93") or raw_version.startswith("9.3"):
                    detected_sap_version = "9.3"
                elif raw_version.startswith("10") or raw_version.startswith("100"):
                    detected_sap_version = "10.0"
        except Exception:
            pass

        try:
            cur.execute(
                "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'BEAS_FTHAUPT'"
            )
            r_beas = cur.fetchone()
            beas_installed = bool(r_beas and int(r_beas[0]) > 0)
            if beas_installed:
                try:
                    cur.execute('SELECT TOP 1 "U_beas_ver" FROM "BEAS_FTHAUPT" WHERE "U_beas_ver" IS NOT NULL')
                    rv = cur.fetchone()
                    if rv and rv[0]:
                        beas_version = str(rv[0]).strip()
                except Exception:
                    pass
        except Exception:
            pass
    finally:
        try:
            conn.close()
        except Exception:
            pass

    sl_status = "disabled"
    sl_version = ""
    if profile.get("allow_service_layer") and profile.get("service_layer_url"):
        try:
            import ssl
            import urllib.request

            sl_base = str(profile["service_layer_url"]).rstrip("/")
            if not sl_base.endswith("/b1s/v1"):
                sl_base = sl_base + "/b1s/v1"
            ctx_ssl = ssl._create_unverified_context()
            req = urllib.request.Request(
                f"{sl_base}/Login",
                data=json.dumps(
                    {
                        "CompanyDB": profile["database"],
                        "UserName": profile.get("sl_username") or "manager",
                        "Password": profile.get("sl_password") or "",
                    }
                ).encode("utf-8"),
                headers={"Content-Type": "application/json"},
                method="POST",
            )
            with urllib.request.urlopen(req, context=ctx_ssl, timeout=timeout) as resp:
                sl_data = json.loads(resp.read().decode("utf-8"))
                sid = sl_data.get("SessionId", "")
                sl_version = str(sl_data.get("Version") or "")
                sl_status = f"connected (HTTP {resp.status})"
                if sid:
                    try:
                        req_out = urllib.request.Request(
                            f"{sl_base}/Logout",
                            headers={"Cookie": f"B1SESSION={sid}; ROUTEID=.node0"},
                            method="POST",
                        )
                        urllib.request.urlopen(req_out, context=ctx_ssl, timeout=4).close()
                    except Exception:
                        pass
        except Exception as sl_e:
            sl_status = f"error: {sl_e}"

    return {
        "ok": True,
        "customer_id": profile["id"],
        "name": profile["name"],
        "customer_code": profile.get("customer_code", ""),
        "server": profile["server"],
        "database": profile["database"],
        "username": profile["username"],
        "driver": driver_used,
        "company_name": company_name,
        "cinf_version_raw": raw_version,
        "sap_version_detected": detected_sap_version,
        "has_beas_detected": beas_installed,
        "beas_version": beas_version,
        "allow_service_layer": bool(profile.get("allow_service_layer", False)),
        "service_layer_url": profile.get("service_layer_url", ""),
        "service_layer_status": sl_status,
        "service_layer_version": sl_version,
    }


def call_service_layer(
    customer_key: str,
    method: str = "GET",
    endpoint: str = "",
    payload: Optional[Any] = None,
    query_params: Optional[str] = None,
    max_page_size: int = 20,
    timeout: int = 25,
    custom_path: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Goi SAP B1 10.0 Service Layer REST API (/b1s/v1/<endpoint>) voi tu dong Login -> Request -> Logout.
    CHOT CHAN AN TOAN: Chi cho phep goi tren cac profile co allow_service_layer == True (Server Demo SBO_MAIN_PROD 10.0.0.10).
    Neu nguoi dung KHONG noi ro alias (demo / SBO_MAIN_PROD / SBO_MFG...), tra ve require_clarification=True de Agent hoi ro!
    """
    profile, clarify_err = resolve_profile_strict(customer_key, custom_path)
    if not profile:
        return {
            "ok": False,
            "require_clarification": True,
            "error": clarify_err,
        }

    if not profile.get("allow_service_layer") or not profile.get("service_layer_url"):
        return {
            "ok": False,
            "security_blocked": True,
            "customer_id": profile["id"],
            "database": profile["database"],
            "server": profile["server"],
            "error": (
                f"CHOT CHAN AN TOAN: He thong '{profile['name']}' (Server {profile['server']} / DB {profile['database']}) "
                "la Database Khach Hang (Read-Only 100%), KHONG cho phep goi Service Layer. "
                "Chi duoc phep goi Service Layer tren Server Demo 'SBO_MAIN_PROD' (10.0.0.10:50000)."
            ),
        }

    ep = str(endpoint or "").strip()
    if not ep:
        return {"ok": False, "error": "Thieu tham so endpoint (vd: 'Items', 'Orders', 'BusinessPartners', 'ProductionOrders')."}

    sl_base = str(profile["service_layer_url"]).rstrip("/")
    if not sl_base.endswith("/b1s/v1"):
        sl_base = sl_base + "/b1s/v1"

    if ep.startswith("http://") or ep.startswith("https://"):
        return {"ok": False, "error": "Chi truyen relative endpoint cua Service Layer (vd: '/b1s/v1/Items' hoac 'Orders')."}
    if ep.startswith("/b1s/v1/"):
        ep = ep[len("/b1s/v1/") :]
    elif ep.startswith("b1s/v1/"):
        ep = ep[len("b1s/v1/") :]
    ep = ep.lstrip("/")

    if query_params and str(query_params).strip():
        qp = str(query_params).strip().lstrip("?")
        ep = f"{ep}{'&' if '?' in ep else '?'}{qp}"

    # Format OData URL safely (replace spaces with %20)
    ep_safe = ep.replace(" ", "%20")
    full_url = f"{sl_base}/{ep_safe}"
    http_method = str(method or "GET").strip().upper()
    if http_method not in ("GET", "POST", "PATCH", "PUT", "DELETE"):
        return {"ok": False, "error": f"Method khong hop le: {http_method} (chi ho tro GET, POST, PATCH, PUT, DELETE)."}

    body_bytes: Optional[bytes] = None
    if payload is not None and payload != "" and payload != {}:
        if isinstance(payload, str):
            try:
                parsed = json.loads(payload)
                body_bytes = json.dumps(parsed, ensure_ascii=False).encode("utf-8")
            except Exception as je:
                return {"ok": False, "error": f"Payload JSON khong hop le: {je}"}
        else:
            body_bytes = json.dumps(payload, ensure_ascii=False).encode("utf-8")

    import ssl
    import urllib.error
    import urllib.request

    ctx_ssl = ssl._create_unverified_context()
    session_id = ""
    try:
        login_req = urllib.request.Request(
            f"{sl_base}/Login",
            data=json.dumps(
                {
                    "CompanyDB": profile["database"],
                    "UserName": profile.get("sl_username") or "manager",
                    "Password": profile.get("sl_password") or "",
                }
            ).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(login_req, context=ctx_ssl, timeout=12) as l_resp:
            l_data = json.loads(l_resp.read().decode("utf-8"))
            session_id = str(l_data.get("SessionId") or "")
    except Exception as le:
        return {
            "ok": False,
            "customer_id": profile["id"],
            "database": profile["database"],
            "server": profile["server"],
            "error": f"Loi dang nhap Service Layer ({sl_base}/Login): {le}",
        }

    try:
        headers = {
            "Content-Type": "application/json",
            "Cookie": f"B1SESSION={session_id}; ROUTEID=.node0",
        }
        if http_method == "GET" and max_page_size > 0:
            headers["Prefer"] = f"odata.maxpagesize={max(1, min(int(max_page_size), 200))}"

        api_req = urllib.request.Request(
            full_url,
            data=body_bytes if http_method in ("POST", "PATCH", "PUT") else None,
            headers=headers,
            method=http_method,
        )
        try:
            with urllib.request.urlopen(api_req, context=ctx_ssl, timeout=timeout) as a_resp:
                raw_body = a_resp.read().decode("utf-8", errors="replace")
                status_code = a_resp.status
                parsed_body: Any = None
                if raw_body.strip():
                    try:
                        parsed_body = json.loads(raw_body)
                    except Exception:
                        parsed_body = raw_body
                return {
                    "ok": True,
                    "status_code": status_code,
                    "customer_id": profile["id"],
                    "database": profile["database"],
                    "server": profile["server"],
                    "method": http_method,
                    "endpoint": f"/b1s/v1/{ep}",
                    "data": parsed_body,
                }
        except urllib.error.HTTPError as he:
            err_body = ""
            try:
                err_body = he.read().decode("utf-8", errors="replace")
            except Exception:
                err_body = str(he)
            parsed_err: Any = err_body
            try:
                parsed_err = json.loads(err_body)
            except Exception:
                pass
            return {
                "ok": False,
                "status_code": he.code,
                "customer_id": profile["id"],
                "database": profile["database"],
                "server": profile["server"],
                "method": http_method,
                "endpoint": f"/b1s/v1/{ep}",
                "error": parsed_err,
            }
    except Exception as e:
        return {
            "ok": False,
            "customer_id": profile["id"],
            "database": profile["database"],
            "server": profile["server"],
            "method": http_method,
            "endpoint": f"/b1s/v1/{ep}",
            "error": f"Loi goi Service Layer: {e}",
        }
    finally:
        if session_id:
            try:
                logout_req = urllib.request.Request(
                    f"{sl_base}/Logout",
                    headers={"Cookie": f"B1SESSION={session_id}; ROUTEID=.node0"},
                    method="POST",
                )
                urllib.request.urlopen(logout_req, context=ctx_ssl, timeout=5).close()
            except Exception:
                pass


_WOTIME_SET_BASED_SQL = """
IF OBJECT_ID('tempdb..#WOTime') IS NOT NULL DROP TABLE #WOTime;
CREATE TABLE #WOTime (BELNR_ID INT PRIMARY KEY, ActualTime_Minutes INT);
IF OBJECT_ID('tempdb..#TmpResult') IS NOT NULL DROP TABLE #TmpResult;
IF OBJECT_ID('tempdb..#TmpResult2') IS NOT NULL DROP TABLE #TmpResult2;

SELECT
    CAST(DATEADD(MINUTE, CAST(RIGHT(RIGHT('0000' + CAST(t1.CreateTime AS VARCHAR(4)), 4), 2) AS INT),
         DATEADD(HOUR, CAST(LEFT(RIGHT('0000' + CAST(t1.CreateTime AS VARCHAR(4)), 4), 2) AS INT),
         t1.CreateDate)) AS VARCHAR) AS [CreateDate],
    t0.DocEntry AS [GR_DocEntry],
    t0.U_belnrid AS [WO]
INTO #TmpResult
FROM IGN1 t0
INNER JOIN OITL t1 ON t0.DocEntry = t1.DocEntry AND t0.ObjType = t1.DocType
INNER JOIN ITL1 t2 ON t1.LogEntry = t2.LogEntry
INNER JOIN OBTN t3 ON t3.AbsEntry = t2.MdAbsEntry
LEFT JOIN BEAS_QSFTHAUPT t4 ON t0.ObjType = t4.BaseType AND t4.BASEDOCENTRY = t0.DocEntry AND t4.BASEBASETYPE = 'E' AND t0.LineNum = t4.BASELINENUM
INNER JOIN OIGN t5 ON t5.DocEntry = t0.DocEntry
WHERE t0.U_belnrid IS NOT NULL AND t0.U_belposid IS NOT NULL AND t0.U_posid = 0
  AND t1.DocDate >= @FromDate AND t1.DocDate <= @ToDate
  AND t0.Quantity <= 100
  AND t3.DistNumber NOT IN (
      SELECT in_t3.DistNumber
      FROM IGE1 in_t0
      INNER JOIN OITL in_t1 ON in_t0.DocEntry = in_t1.DocEntry AND in_t0.ObjType = in_t1.DocType
      INNER JOIN ITL1 in_t2 ON in_t1.LogEntry = in_t2.LogEntry
      INNER JOIN OBTN in_t3 ON in_t3.AbsEntry = in_t2.MdAbsEntry
      WHERE in_t0.U_belnrid = t0.U_belnrid AND in_t0.U_belposid = t0.U_belposid AND in_t0.ItemCode = t0.ItemCode
  );

SELECT
    tbl_0.WO,
    IIF(ISNULL(DATEDIFF(MINUTE, LAG(tbl_0.CreateDate) OVER (PARTITION BY CAST(tbl_0.CreateDate AS DATE) ORDER BY tbl_0.GR_DocEntry), tbl_0.CreateDate), 0) < 0,
        0,
        ISNULL(DATEDIFF(MINUTE, LAG(tbl_0.CreateDate) OVER (PARTITION BY CAST(tbl_0.CreateDate AS DATE) ORDER BY tbl_0.GR_DocEntry), tbl_0.CreateDate), 0)
    ) AS [Time(minutes)]
INTO #TmpResult2
FROM #TmpResult tbl_0;

INSERT INTO #WOTime (BELNR_ID, ActualTime_Minutes)
SELECT
    P.BELNR_ID,
    ISNULL(T.TotalTime, 0)
FROM (
    SELECT DISTINCT BELNR_ID
    FROM BEAS_FTPOS
    WHERE (ABGKZ_DATE >= @FromDate AND ABGKZ_DATE < DATEADD(DAY, 1, @ToDate))
       OR ABGKZ_DATE IS NULL
) P
LEFT JOIN (
    SELECT WO, SUM([Time(minutes)]) AS TotalTime
    FROM #TmpResult2
    GROUP BY WO
) T ON P.BELNR_ID = T.WO;

DROP TABLE #TmpResult;
DROP TABLE #TmpResult2;
"""


def adapt_mfg_sql(sql: str, database: str = "") -> str:
    """Chuyen doi CURSOR sp_daily_hour_report sang set-based #WOTime va tuong thich giua SBO_MFG_PROD, SBO_MFG_PLANT1 & SBO_MAIN_PROD."""
    out = str(sql or "")
    if "sp_daily_hour_report" in out:
        out = re.sub(
            r"IF\s+OBJECT_ID\s*\(\s*'tempdb\.\.#WOTime'\s*\).*?DEALLOCATE\s+WO_CURSOR\s*;",
            _WOTIME_SET_BASED_SQL,
            out,
            flags=re.DOTALL | re.IGNORECASE,
        )
    db_norm = database.strip().lower()
    if db_norm and db_norm != "SBO_MFG_PROD":
        out = re.sub(
            r"\[@IOT_PARAMETERS\]",
            "(SELECT CAST(NULL AS NVARCHAR(100)) AS Code, CAST(NULL AS NVARCHAR(100)) AS U_I_LineType, CAST(NULL AS NVARCHAR(50)) AS U_I_Ac1Balls, CAST(NULL AS NVARCHAR(50)) AS U_I_Ac2Balls WHERE 1=0)",
            out,
            flags=re.IGNORECASE,
        )
        out = re.sub(r"t5\.U_SAC_Output", "CAST(NULL AS NVARCHAR(50))", out, flags=re.IGNORECASE)
        out = re.sub(r"t5\.U_energyElectricity", "CAST('0' AS NVARCHAR(50))", out, flags=re.IGNORECASE)
        out = re.sub(r"OPDN\.U_LCDone", "CAST(NULL AS NVARCHAR(20))", out, flags=re.IGNORECASE)
        out = re.sub(r"\bU_LCDone\b", "CAST(NULL AS NVARCHAR(20))", out, flags=re.IGNORECASE)
    return "SET NOCOUNT ON;\n" + out


def _strip_sql_comments_and_strings(sql: str) -> str:
    """Loai bo comment (--..., /*...*/) va chuoi ('...') de kiem tra tu khoa SQL an toan."""
    s = re.sub(r"/\*.*?\*/", " ", sql, flags=re.DOTALL)
    s = re.sub(r"--[^\r\n]*", " ", s)
    s = re.sub(r"N?'(?:''|[^'])*'", " 'STR' ", s)
    return s.strip()


def validate_readonly_sql(sql: str) -> Tuple[bool, str]:
    """Bo loc bao mat cung: Cho phep SELECT, CTE va bang tam #Temp, chan 100% lenh ghi/xoa tren bang that."""
    if not sql or not str(sql).strip():
        return False, "Cau lenh SQL trong."

    adapted = adapt_mfg_sql(str(sql))
    cleaned = _strip_sql_comments_and_strings(adapted)
    if not cleaned:
        return False, "Cau lenh SQL chi chua comment hoac rong."

    # Loai bo cac thao tac hop le tren bang tam #Temp (trong tempdb) truoc khi quet tu khoa cam
    temp_safe = cleaned
    temp_safe = re.sub(r"\bDROP\s+TABLE\s+(?:IF\s+EXISTS\s+)?#[A-Za-z0-9_]+", " ", temp_safe, flags=re.IGNORECASE)
    temp_safe = re.sub(r"\bCREATE\s+TABLE\s+#[A-Za-z0-9_]+\s*\([^;]*?\)", " ", temp_safe, flags=re.IGNORECASE | re.DOTALL)
    temp_safe = re.sub(r"\bINSERT\s+INTO\s+#[A-Za-z0-9_]+", " ", temp_safe, flags=re.IGNORECASE)
    temp_safe = re.sub(r"\bINTO\s+#[A-Za-z0-9_]+", " ", temp_safe, flags=re.IGNORECASE)

    upper_cleaned = temp_safe.upper()
    for kw in FORBIDDEN_SQL_KEYWORDS:
        pattern = rf"\b{re.escape(kw)}\b"
        if re.search(pattern, upper_cleaned):
            return (
                False,
                f"TU CHOI BAO MAT: Cau lenh SQL chua tu khoa cam '{kw}' tren bang that. "
                "Cong cu nay chi cho phep truy van Read-Only 100%.",
            )

    if re.search(r"\bINTO\s+[A-Za-z0-9_\[\]\"]+", upper_cleaned):
        return (
            False,
            "TU CHOI BAO MAT: Khong cho phep su dung 'SELECT ... INTO' tren bang that trong che do Read-Only.",
        )

    if "SELECT" not in upper_cleaned:
        return False, "Cau lenh SQL phai chua menh de SELECT."

    return True, "OK"


def execute_readonly_query(
    customer_key: str,
    sql: str,
    max_rows: int = 30,
    export_csv_path: str = "",
    timeout: int = 60,
    allowed_customer: str = "",
    report_slug: str = "SAP_Query",
    auto_export_csv: bool = True,
    custom_path: Optional[str] = None,
) -> Dict[str, Any]:
    """Chay cau lenh SELECT (hoac script SSMS #Temp) tren DB khach hang va tu dong xuat file CSV de tai ve."""
    is_valid, reason = validate_readonly_sql(sql)
    if not is_valid:
        return {"ok": False, "security_blocked": True, "error": reason}

    effective_key = str(customer_key or allowed_customer or "").strip()
    profile, clarify_err = resolve_profile_strict(effective_key, custom_path)
    if not profile:
        return {
            "ok": False,
            "require_clarification": True,
            "error": clarify_err,
        }

    if allowed_customer and str(allowed_customer).strip():
        locked_prof = get_profile(str(allowed_customer).strip(), custom_path)
        if locked_prof and str(locked_prof.get("database", "")).lower() != str(profile.get("database", "")).lower():
            return {
                "ok": False,
                "security_blocked": True,
                "error": (
                    f"TU CHOI BAO MAT NHOM KHACH HANG: Nhom nay chi duoc phep truy van database "
                    f"'{locked_prof.get('database')}' ({locked_prof.get('customer_code')}), "
                    f"khong duoc truy van sang '{profile.get('database')}'."
                ),
            }

    max_rows = max(1, min(int(max_rows or 30), 500))
    csv_limit = 50000

    try:
        conn, driver_used = _open_pyodbc_connection(profile, timeout=15)
    except Exception as e:
        return {
            "ok": False,
            "customer_id": profile["id"],
            "name": profile["name"],
            "database": profile["database"],
            "error": str(e),
        }

    try:
        cur = conn.cursor()
        final_sql = adapt_mfg_sql(sql, database=profile.get("database", ""))
        cur.execute(final_sql)

        while cur.description is None:
            if not cur.nextset():
                break

        if not cur.description:
            return {
                "ok": False,
                "error": "Truy van khong tra ve tap ket qua (no result set).",
            }

        columns = [str(col[0]) for col in cur.description]
        raw_rows = cur.fetchmany(csv_limit)
        total_rows_fetched = len(raw_rows)

        all_rows_out: List[Dict[str, Any]] = []
        for r in raw_rows:
            row_dict: Dict[str, Any] = {}
            for col_name, val in zip(columns, r):
                if val is None or isinstance(val, (int, float, bool, str)):
                    row_dict[col_name] = val
                else:
                    row_dict[col_name] = str(val)
            all_rows_out.append(row_dict)

        bundle = {
            "csv_path": "",
            "csv_download_url": "",
            "xlsx_path": "",
            "xlsx_download_url": "",
            "pdf_path": "",
            "pdf_download_url": "",
        }
        if auto_export_csv or export_csv_path:
            bundle = _export_rows_to_bundle(
                columns=columns,
                rows=all_rows_out,
                report_slug=report_slug,
                customer_code=profile.get("customer_code") or profile["id"],
                custom_csv_path=export_csv_path,
            )

        preview_rows = all_rows_out[:max_rows]
        truncated = total_rows_fetched > max_rows

        return {
            "ok": True,
            "source_banner": profile.get("source_banner", ""),
            "customer_id": profile["id"],
            "customer_name": profile["name"],
            "customer_code": profile.get("customer_code", ""),
            "database": profile["database"],
            "sap_version": profile.get("sap_version", "10.0"),
            "driver": driver_used,
            "columns": columns,
            "total_rows_in_csv": total_rows_fetched,
            "row_count": len(preview_rows),
            "truncated": truncated,
            "max_rows": max_rows,
            "csv_path": bundle["csv_path"],
            "csv_download_url": bundle["csv_download_url"],
            "xlsx_path": bundle["xlsx_path"],
            "xlsx_download_url": bundle["xlsx_download_url"],
            "pdf_path": bundle["pdf_path"],
            "pdf_download_url": bundle["pdf_download_url"],
            "rows": preview_rows,
        }
    except Exception as e:
        return {
            "ok": False,
            "customer_id": profile["id"],
            "customer_name": profile["name"],
            "database": profile["database"],
            "error": f"Loi thuc thi SQL: {e}",
        }
    finally:
        try:
            conn.close()
        except Exception:
            pass


def _read_text_safe(p: Path) -> str:
    for enc in ("utf-8", "utf-8-sig", "cp1258", "cp1252", "latin1"):
        try:
            return p.read_text(encoding=enc)
        except Exception:
            continue
    return p.read_text(encoding="utf-8", errors="replace")


def run_mfg_standard_report(
    customer_key: str,
    report_type: str,
    from_date: str = "",
    to_date: str = "",
    whs_code: str = "",
    item_code: str = "",
    batch_num: str = "",
    wo_num: str = "",
    max_rows: int = 20,
    allowed_customer: str = "",
    sql_app_dir: Optional[str] = None,
    custom_path: Optional[str] = None,
) -> Dict[str, Any]:
    """Chay 1 trong 7 nhom bao cao chuan SBO_MFG SSMS, tu dong thay tham so ngay/kho/ma hang/WO va xuat file CSV/XLSX/PDF."""
    rk = _strip_accents(report_type)
    rk_compact = re.sub(r"[^a-z0-9]+", "_", rk).strip("_")
    canonical_key = REPORT_ALIASES.get(rk_compact, rk_compact)
    if canonical_key not in MFG_STANDARD_REPORTS:
        return {
            "ok": False,
            "error": (
                f"Khong nhan dien duoc report_type={report_type!r}. "
                f"Cac gia tri hop le: {', '.join(MFG_STANDARD_REPORTS.keys())}"
            ),
        }

    rep_meta = MFG_STANDARD_REPORTS[canonical_key]
    base_dir = Path(sql_app_dir) if sql_app_dir else DEFAULT_SQL_APP_DIR
    if not base_dir.exists() and Path("/opt/antigravity-erp/data/sql_sap_b1").exists():
        base_dir = Path("/opt/antigravity-erp/data/sql_sap_b1")
    elif not base_dir.exists() and Path("/data/sql_sap_b1").exists():
        base_dir = Path("/data/sql_sap_b1")

    sql_file = base_dir / "queries" / "SYNC_SBO_MFG_PROD_SSMS" / rep_meta["rel_path"]
    if not sql_file.is_file():
        return {
            "ok": False,
            "error": f"Khong tim thay file SQL bao cao chuan tai: {sql_file}",
        }

    today = datetime.date.today()
    if not from_date or not str(from_date).strip():
        from_date = f"{today.year}-01-01"
    if not to_date or not str(to_date).strip():
        to_date = today.strftime("%Y-%m-%d")

    f_date = re.sub(r"[^0-9-]", "", str(from_date).strip())
    t_date = re.sub(r"[^0-9-]", "", str(to_date).strip())

    raw_sql = _read_text_safe(sql_file)

    # Thay the @FromDate / @ToDate / @StartDate / @EndDate
    raw_sql = re.sub(
        r"DECLARE\s+@FromDate\s+DATE\s*=\s*'[^']*'\s*;",
        f"DECLARE @FromDate DATE = '{f_date}';",
        raw_sql,
        flags=re.IGNORECASE,
    )
    raw_sql = re.sub(
        r"DECLARE\s+@ToDate\s+DATE\s*=\s*(?:'[^']*'|GETDATE\(\))\s*;",
        f"DECLARE @ToDate DATE = '{t_date}';",
        raw_sql,
        flags=re.IGNORECASE,
    )
    raw_sql = re.sub(
        r"DECLARE\s+@ToDate\s+NVARCHAR\(\d+\)\s*=\s*'[^']*'\s*;",
        f"DECLARE @ToDate NVARCHAR(20) = '{t_date}';",
        raw_sql,
        flags=re.IGNORECASE,
    )
    raw_sql = re.sub(
        r"DECLARE\s+@StartDate\s+DATETIME\s*=\s*'[^']*'\s*;",
        f"DECLARE @StartDate DATETIME = '{f_date}';",
        raw_sql,
        flags=re.IGNORECASE,
    )
    raw_sql = re.sub(
        r"DECLARE\s+@EndDate\s+DATETIME\s*=\s*'[^']*'\s*;",
        f"DECLARE @EndDate DATETIME = '{t_date}';",
        raw_sql,
        flags=re.IGNORECASE,
    )

    if whs_code and str(whs_code).strip():
        safe_whs = str(whs_code).strip().replace("'", "''")
        raw_sql = re.sub(
            r"DECLARE\s+@Whs[Cc]ode\s+NVARCHAR\(\d+\)\s*=\s*(?:N?'[^']*'|NULL)\s*;",
            f"DECLARE @WhsCode NVARCHAR(50) = N'{safe_whs}';",
            raw_sql,
            flags=re.IGNORECASE,
        )

    if item_code and str(item_code).strip():
        safe_item = str(item_code).strip().replace("'", "''")
        raw_sql = re.sub(
            r"DECLARE\s+@ItemCode\s+NVARCHAR\(\d+\)\s*=\s*(?:N?'[^']*'|NULL)\s*;",
            f"DECLARE @ItemCode NVARCHAR(50) = N'{safe_item}';",
            raw_sql,
            flags=re.IGNORECASE,
        )
        raw_sql = re.sub(
            r"DECLARE\s+@StartItemCode\s+NVARCHAR\(\d+\)\s*=\s*N?'[^']*'\s*;",
            f"DECLARE @StartItemCode NVARCHAR(50) = N'{safe_item}';",
            raw_sql,
            flags=re.IGNORECASE,
        )
        raw_sql = re.sub(
            r"DECLARE\s+@EndItemCode\s+NVARCHAR\(\d+\)\s*=\s*N?'[^']*'\s*;",
            f"DECLARE @EndItemCode NVARCHAR(50) = N'{safe_item}';",
            raw_sql,
            flags=re.IGNORECASE,
        )

    if batch_num and str(batch_num).strip():
        safe_batch = str(batch_num).strip().replace("'", "''")
        raw_sql = re.sub(
            r"DECLARE\s+@BatchNum\s+NVARCHAR\(\d+\)\s*=\s*(?:N?'[^']*'|NULL)\s*;",
            f"DECLARE @BatchNum NVARCHAR(50) = N'{safe_batch}';",
            raw_sql,
            flags=re.IGNORECASE,
        )

    res = execute_readonly_query(
        customer_key=customer_key,
        sql=raw_sql,
        max_rows=50000 if (wo_num or item_code or whs_code) else max_rows,
        allowed_customer=allowed_customer,
        report_slug=rep_meta["slug"],
        auto_export_csv=True,
        custom_path=custom_path,
    )
    if not res.get("ok"):
        return res

    # Neu nguoi dung loc theo WO cu the hoac ItemCode/WhsCode tren bao cao khong co tham so @
    rows_all = res.get("rows") or []
    filtered = False
    if wo_num and str(wo_num).strip():
        w_target = str(wo_num).strip().lower()
        new_rows = []
        for r in rows_all:
            for col_k in ("WO", "WO Number", "BELNR_ID", "WO_Document", "WO Num - Đơn Hàng"):
                if col_k in r and str(r.get(col_k) or "").strip().lower() == w_target:
                    new_rows.append(r)
                    break
        rows_all = new_rows
        filtered = True

    if item_code and str(item_code).strip() and canonical_key not in ("inventory_movement", "inventory_account", "inventory_batch", "batch_tracking"):
        i_target = str(item_code).strip().lower()
        rows_all = [
            r for r in rows_all
            if any(
                i_target in str(r.get(ck) or "").strip().lower()
                for ck in ("ItemCode", "Item Code", "Item No.", "MÃ HÀNG", "Mã_Vật_Tư", "FG_ItemCode", "RM_ItemCode")
                if ck in r
            )
        ]
        filtered = True

    if filtered:
        profile = get_profile(str(customer_key or allowed_customer or "").strip(), custom_path) or {"id": "DB"}
        bundle = _export_rows_to_bundle(
            columns=res.get("columns") or [],
            rows=rows_all,
            report_slug=f"{rep_meta['slug']}_Filtered",
            customer_code=profile.get("customer_code") or profile.get("id", "DB"),
        )
        res["total_rows_in_csv"] = len(rows_all)
        res.update(bundle)
        res["rows"] = rows_all[: max(1, min(int(max_rows or 20), 100))]
        res["row_count"] = len(res["rows"])
        res["truncated"] = len(rows_all) > len(res["rows"])

    res["report_type"] = canonical_key
    res["report_title"] = rep_meta["title"]
    res["source_file"] = f"queries/SYNC_SBO_MFG_PROD_SSMS/{rep_meta['rel_path']}"
    res["from_date"] = f_date
    res["to_date"] = t_date
    return res


def search_help_queries(
    keyword: str = "",
    table_name: str = "",
    category: str = "",
    max_results: int = 15,
    sql_app_dir: Optional[str] = None,
) -> Dict[str, Any]:
    """Tim kiem cau lenh SQL mau trong thu muc queries/ va Help/SAPStandard_query.txt, Default_query.txt."""
    base_dir = Path(sql_app_dir) if sql_app_dir else DEFAULT_SQL_APP_DIR
    if not base_dir.exists() and Path("/opt/antigravity-erp/data/sql_sap_b1").exists():
        base_dir = Path("/opt/antigravity-erp/data/sql_sap_b1")
    elif not base_dir.exists() and Path("/data/sql_sap_b1").exists():
        base_dir = Path("/data/sql_sap_b1")

    kw_lower = str(keyword or "").strip().lower()
    tbl_lower = str(table_name or "").strip().lower()
    cat_lower = str(category or "").strip().lower()
    max_results = max(1, min(int(max_results or 15), 50))

    results: List[Dict[str, Any]] = []

    def _matches(title: str, cat_str: str, sql_text: str, desc: str = "") -> bool:
        haystack = f"{title}\n{cat_str}\n{desc}\n{sql_text}".lower()
        if kw_lower and kw_lower not in haystack:
            return False
        if tbl_lower and tbl_lower not in sql_text.lower():
            return False
        if cat_lower and cat_lower not in cat_str.lower():
            return False
        return True

    queries_dir = base_dir / "queries"
    if queries_dir.is_dir():
        ssms_dir = queries_dir / "SYNC_SBO_MFG_PROD_SSMS"
        priority_files: List[Path] = []
        if ssms_dir.is_dir():
            priority_files.extend(sorted(ssms_dir.rglob("*.sql")))
            priority_files.extend(sorted(ssms_dir.rglob("*.txt")))
        other_files = [
            p for p in sorted(queries_dir.rglob("*.sql"))
            if not (ssms_dir.is_dir() and ssms_dir in p.parents)
        ]
        for sql_file in priority_files + other_files:
            rel_cat = str(sql_file.parent.relative_to(queries_dir)).replace("\\", "/")
            q_name = sql_file.stem
            sql_text = _read_text_safe(sql_file)
            if _matches(q_name, rel_cat, sql_text):
                is_ssms_gold = "SYNC_SBO_MFG_PROD_SSMS" in rel_cat
                results.append(
                    {
                        "source": f"queries/{rel_cat}/{sql_file.name}",
                        "category": rel_cat,
                        "query_name": q_name,
                        "priority": "HIGH_MFG_GOLD" if is_ssms_gold else "STANDARD",
                        "description": (
                            f"[KHO CHUAN SBO_MFG SSMS] {rel_cat} - {q_name}"
                            if is_ssms_gold
                            else f"File SQL mau trong {rel_cat}"
                        ),
                        "parameters": [],
                        "sql": sql_text[:20000],
                    }
                )
                if len(results) >= max_results:
                    break

    help_dir = base_dir / "Help"
    if len(results) < max_results and help_dir.is_dir():
        for fname in ("SAPStandard_query.txt", "Default_query.txt"):
            fpath = help_dir / fname
            if not fpath.is_file():
                continue
            try:
                raw_json = _read_text_safe(fpath)
                groups = json.loads(raw_json)
                if not isinstance(groups, list):
                    continue
                for grp in groups:
                    cat_name = str(grp.get("QueryCategory") or "General")
                    for q in grp.get("Queries") or []:
                        q_name = str(q.get("QueryName") or "")
                        q_sql = str(q.get("QueryString") or "")
                        q_desc = str(q.get("Description") or "")
                        if _matches(q_name, cat_name, q_sql, q_desc):
                            params = [
                                {
                                    "name": p.get("ParameterName"),
                                    "type": p.get("Type"),
                                    "default": p.get("DefaultValue"),
                                }
                                for p in (q.get("Parameters") or [])
                            ]
                            results.append(
                                {
                                    "source": f"Help/{fname}",
                                    "category": cat_name,
                                    "query_name": q_name,
                                    "description": q_desc,
                                    "parameters": params,
                                    "sql": q_sql[:4000],
                                }
                            )
                            if len(results) >= max_results:
                                break
                    if len(results) >= max_results:
                        break
            except Exception:
                continue

    return {
        "ok": True,
        "base_dir": str(base_dir),
        "filter": {"keyword": keyword, "table_name": table_name, "category": category},
        "count": len(results),
        "results": results,
    }


_VN_TO_SAP_SEARCH_TERMS = [
    ("tra hang mua", "SAP Business One A/P Credit Memo Goods Return window"),
    ("ap credit memo", "SAP Business One A/P Credit Memo window"),
    ("goods return", "SAP Business One Goods Return window"),
    ("landed cost", "SAP Business One Landed Costs window"),
    ("chi phi mua hang", "SAP Business One Landed Costs window"),
    ("grpo", "SAP Business One Goods Receipt PO window"),
    ("nhap kho mua hang", "SAP Business One Goods Receipt PO window"),
    ("mrp beas", "Beas Manufacturing MRP Wizard window"),
    ("mrp", "SAP Business One MRP Wizard window"),
    ("batch change", "Beas Manufacturing Batch Changes BOM window"),
    ("work order", "Beas Manufacturing Work Order structure window"),
    ("lenh san xuat", "SAP Business One Production Order Beas Work Order window"),
    ("dtw", "SAP Business One Data Transfer Workbench DTW step"),
]


def search_sap_article_images(
    query: str,
    max_images: int = 2,
    summary_text: str = "",
) -> Dict[str, Any]:
    """Tim anh chup man hinh tu bai viet huong dan SAP B1 / Beas Manufacturing tren web va tao file PDF minh hoa."""
    import html as html_mod
    import io
    import urllib.parse
    import urllib.request

    q_raw = str(query or "").strip()
    if not q_raw:
        return {"ok": False, "error": "Thieu tu khoa tim kiem (query)."}

    q_norm = _strip_accents(q_raw)
    en_boost = ""
    for vn_kw, en_kw in _VN_TO_SAP_SEARCH_TERMS:
        if vn_kw in q_norm:
            en_boost = en_kw
            break

    search_q = en_boost if en_boost else (q_raw if "sap" in q_norm or "beas" in q_norm else f"SAP Business One {q_raw}")
    max_images = max(1, min(int(max_images or 2), 4))

    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
        ),
        "Accept-Language": "en-US,en;q=0.9,vi;q=0.8",
    }

    candidates: List[Dict[str, str]] = []
    try:
        bing_url = "https://www.bing.com/images/search?q=" + urllib.parse.quote(search_q) + "&form=HDRSC2&first=1"
        req = urllib.request.Request(bing_url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            page_html = resp.read().decode("utf-8", errors="replace")

        for m in re.finditer(r'm="(\{[^"]+\})"', page_html):
            try:
                meta_json = json.loads(html_mod.unescape(m.group(1)))
                murl = str(meta_json.get("murl") or "").strip()
                purl = str(meta_json.get("purl") or "").strip()
                title = str(meta_json.get("t") or meta_json.get("desc") or search_q).strip()
                title = re.sub(r"[\x00-\x1f]+", " ", title).strip()
                if murl.startswith("https://") and not any(x in murl.lower() for x in (".svg", "logo", "avatar", "icon")):
                    candidates.append({"title": title[:140], "image_url": murl, "article_url": purl})
            except Exception:
                continue
    except Exception:
        pass

    verified: List[Dict[str, Any]] = []
    downloaded_images: List[Tuple[Dict[str, Any], bytes]] = []
    seen_urls = set()

    for cand in candidates:
        if len(verified) >= max_images:
            break
        u = cand["image_url"]
        if u in seen_urls:
            continue
        seen_urls.add(u)
        try:
            r_img = urllib.request.Request(u, headers=headers)
            with urllib.request.urlopen(r_img, timeout=6) as resp_img:
                ctype = str(resp_img.headers.get("Content-Type") or "").lower()
                if not any(t in ctype for t in ("jpeg", "jpg", "png", "webp")):
                    continue
                img_bytes = resp_img.read(4 * 1024 * 1024)
                if len(img_bytes) < 5000:
                    continue
                item = {
                    "title": cand["title"],
                    "image_url": u,
                    "article_url": cand["article_url"],
                    "markdown_image": f"![{cand['title']}]({u})",
                }
                verified.append(item)
                downloaded_images.append((item, img_bytes))
        except Exception:
            continue

    # Tao file PDF tai lieu huong dan kem hinh anh minh hoa
    guide_pdf_path = ""
    guide_pdf_url = ""
    try:
        from reportlab.lib import colors
        from reportlab.lib.pagesizes import A4
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image as RLImage
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.pdfbase import pdfmetrics
        from reportlab.pdfbase.ttfonts import TTFont
        from PIL import Image as PILImage

        ts = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
        safe_slug = re.sub(r"[^A-Za-z0-9-]+", "-", _strip_accents(q_raw).replace("_", "-")).strip("-")[:35] or "SAP-Guide"
        pdf_name = f"Guide-{safe_slug}-{ts}.pdf"
        exp_dir = _resolve_exports_dir()
        out_pdf = exp_dir / pdf_name

        reg_ttf, bold_ttf = _find_unicode_ttf()
        font_reg, font_bold = "Helvetica", "Helvetica-Bold"
        if reg_ttf:
            pdfmetrics.registerFont(TTFont("GuideReg", reg_ttf))
            pdfmetrics.registerFont(TTFont("GuideBold", bold_ttf or reg_ttf))
            font_reg, font_bold = "GuideReg", "GuideBold"

        doc = SimpleDocTemplate(str(out_pdf), pagesize=A4, leftMargin=28, rightMargin=28, topMargin=28, bottomMargin=28)
        styles = getSampleStyleSheet()
        h1_style = ParagraphStyle("GH1", parent=styles["Heading1"], fontName=font_bold, fontSize=14, leading=18, textColor=colors.HexColor("#1F4E78"), spaceAfter=8)
        h2_style = ParagraphStyle("GH2", parent=styles["Heading2"], fontName=font_bold, fontSize=11, leading=15, textColor=colors.HexColor("#1F4E78"), spaceBefore=10, spaceAfter=4)
        body_style = ParagraphStyle("GBody", parent=styles["Normal"], fontName=font_reg, fontSize=9.5, leading=14, textColor=colors.HexColor("#222222"), spaceAfter=6)
        link_style = ParagraphStyle("GLink", parent=styles["Normal"], fontName=font_reg, fontSize=8.5, leading=12, textColor=colors.HexColor("#0066CC"), spaceAfter=8)

        story = [
            Paragraph(f"TAI LIEU HUONG DAN MINH HOA SAP B1 / BEAS: {q_raw.upper()}", h1_style),
            Paragraph(f"Tu khoa tra cuu: {search_q} | Ngay xuat: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')}", link_style),
        ]
        if summary_text and str(summary_text).strip():
            for ln in str(summary_text).splitlines():
                ln_clean = ln.strip().replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
                if ln_clean:
                    story.append(Paragraph(ln_clean, body_style))
            story.append(Spacer(1, 8))

        for idx, (meta_item, raw_bytes) in enumerate(downloaded_images, start=1):
            story.append(Paragraph(f"Hinh {idx}: {meta_item['title']}", h2_style))
            if meta_item.get("article_url"):
                story.append(Paragraph(f"Nguon bai viet: {meta_item['article_url']}", link_style))
            try:
                pil_im = PILImage.open(io.BytesIO(raw_bytes))
                if pil_im.mode not in ("RGB", "RGBA"):
                    pil_im = pil_im.convert("RGB")
                w_px, h_px = pil_im.size
                max_w = 520.0
                max_h = 340.0
                scale = min(max_w / max(1, w_px), max_h / max(1, h_px), 1.0)
                buf = io.BytesIO()
                pil_im.convert("RGB").save(buf, format="JPEG", quality=88)
                buf.seek(0)
                story.append(RLImage(buf, width=w_px * scale, height=h_px * scale))
                story.append(Spacer(1, 12))
            except Exception:
                continue

        doc.build(story)
        guide_pdf_path = str(out_pdf.resolve())
        base_url = os.getenv("JAVIS_PUBLIC_EXPORT_BASE", "https://erp-portal.example.com").rstrip("/")
        guide_pdf_url = f"{base_url}/exports/{pdf_name}"
    except Exception:
        pass

    return {
        "ok": True,
        "query": q_raw,
        "search_query_used": search_q,
        "count": len(verified),
        "images": verified,
        "guide_pdf_path": guide_pdf_path,
        "guide_pdf_url": guide_pdf_url,
    }


def main():
    parser = argparse.ArgumentParser(
        description="Quan ly Profile SQL Khach hang SAP B1 (9.3 / 10.0) & Beas Manufacturing"
    )
    sub = parser.add_subparsers(dest="cmd")

    sub.add_parser("list", help="Liet ke tat ca profile SQL khach hang")

    p_up = sub.add_parser("upsert", help="Them moi hoac cap nhat profile SQL khach hang")
    p_up.add_argument("--id", default="", help="ID profile (vd: db_mfg)")
    p_up.add_argument("--name", required=True, help="Ten khach hang / ket noi")
    p_up.add_argument("--code", default="", help="Ma khach hang (vd: SBO_MFG_PROD, SBO_MFG_PLANT1)")
    p_up.add_argument("--server", required=True, help="IP hoac hostname SQL Server")
    p_up.add_argument("--database", required=True, help="Ten database SAP B1")
    p_up.add_argument("--username", default="sap_readonly_user", help="User SQL rieng cua khach hang")
    p_up.add_argument("--password", default="", help="Password SQL rieng cua khach hang")
    p_up.add_argument("--sap-version", default="10.0", choices=["9.3", "10.0"])
    p_up.add_argument("--has-beas", default="true", choices=["true", "false"])
    p_up.add_argument("--notes", default="", help="Ghi chu khach hang")

    p_test = sub.add_parser("test", help="Test ket noi SQL cua khach hang")
    p_test.add_argument("customer", help="ID, ma hoac ten khach hang")

    p_query = sub.add_parser("query", help="Chay lenh SELECT Read-Only tren DB khach hang")
    p_query.add_argument("customer", help="ID, ma hoac ten khach hang")
    p_query.add_argument("sql", help="Cau lenh SELECT")
    p_query.add_argument("--max-rows", type=int, default=30)
    p_query.add_argument("--csv", default="", help="Duong dan xuat file CSV")

    p_rep = sub.add_parser("report", help="Chay bao cao chuan SBO_MFG SSMS")
    p_rep.add_argument("customer", help="ID hoac ma khach hang (SBO_MFG_PROD / SBO_MFG_PLANT1)")
    p_rep.add_argument("report_type", help="Loai bao cao (po_status, sale_status, gross_profit, wo_cost_allocation, wo_cost_detail, daily_hour_report, inventory_movement...)")
    p_rep.add_argument("--from-date", default="", help="Tu ngay YYYY-MM-DD")
    p_rep.add_argument("--to-date", default="", help="Den ngay YYYY-MM-DD")
    p_rep.add_argument("--whs", default="", help="Ma kho")
    p_rep.add_argument("--item", default="", help="Ma vat tu")
    p_rep.add_argument("--wo", default="", help="So lenh san xuat WO")

    p_search = sub.add_parser("search-help", help="Tim kiem cau lenh SQL mau")
    p_search.add_argument("--keyword", default="", help="Tu khoa tim kiem")
    p_search.add_argument("--table", default="", help="Ten bang (vd: BEAS_FTHAUPT, OITM)")
    p_search.add_argument("--category", default="", help="Nhom bao cao")

    p_img = sub.add_parser("search-images", help="Tim anh bai viet huong dan SAP B1 / Beas va xuat PDF")
    p_img.add_argument("query", help="Chu de hoac cau hoi can tim anh minh hoa")
    p_img.add_argument("--max-images", type=int, default=2)

    args = parser.parse_args()
    if args.cmd == "list":
        res = list_profiles(mask_password=True)
    elif args.cmd == "upsert":
        res = upsert_profile(
            name=args.name,
            server=args.server,
            database=args.database,
            username=args.username,
            password=args.password,
            customer_id=args.id,
            customer_code=args.code,
            sap_version=args.sap_version,
            has_beas=(args.has_beas.lower() == "true"),
            notes=args.notes,
        )
    elif args.cmd == "test":
        res = test_connection(args.customer)
    elif args.cmd == "query":
        res = execute_readonly_query(
            args.customer, args.sql, max_rows=args.max_rows, export_csv_path=args.csv
        )
    elif args.cmd == "report":
        res = run_mfg_standard_report(
            customer_key=args.customer,
            report_type=args.report_type,
            from_date=args.from_date,
            to_date=args.to_date,
            whs_code=args.whs,
            item_code=args.item,
            wo_num=args.wo,
        )
    elif args.cmd == "search-help":
        res = search_help_queries(
            keyword=args.keyword, table_name=args.table, category=args.category
        )
    elif args.cmd == "search-images":
        res = search_sap_article_images(args.query, max_images=args.max_images)
    else:
        parser.print_help()
        return

    print(json.dumps(res, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
