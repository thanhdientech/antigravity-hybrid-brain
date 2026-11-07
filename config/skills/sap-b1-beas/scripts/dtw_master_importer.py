#!/usr/bin/env python3
"""
dtw_master_importer.py - Bo cong cu chuan hoa & kiem dinh du lieu Import Master Data (DTW)
cho SAP Business One (9.3 / 10.0) & Beas Manufacturing.

Cac chuc nang chinh:
1. list_dtw_files: Liet ke cac file Template DTW va file du lieu nguon trong thu muc
2. inspect_template: Doc cau truc 2 dong Header chuan DTW (Row 1: Template Column, Row 2: SAP DB Field)
3. generate_coa_import: Chuan hoa tu process.py / process_fixed.py - loc tai khoan theo filter_prefix (vd 642),
   chuyen sang target_prefix (vd 643) tren AcctCode, FatherNum, FormatCode, AcctName va xuat file Excel DTW
   giu nguyen 2 dong header chuan cung dinh dang TEXT chong loi so khoa hoc (scientific notation).
4. validate_master_data: Kiem tra tinh hop le cua file Excel DTW truoc khi import vao SAP B1 9.3 / 10.0
   (kiem tra trung khoa chinh, thieu truong bat buoc, do dai ma, loi dinh dang .0).
"""
from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import xml.etree.ElementTree as ET
import zipfile
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

DEFAULT_DTW_DIR = Path(os.getenv("SAP_B1_DTW_DIR", r"E:\DIEN APP\SAP B1 IMPORT MASTER DATA"))


def _resolve_base_dir(base_dir: Optional[str] = None) -> Path:
    if base_dir:
        return Path(base_dir)
    if DEFAULT_DTW_DIR.exists():
        return DEFAULT_DTW_DIR
    vps_dir = Path("/data/sap_b1_dtw")
    if vps_dir.exists():
        return vps_dir
    return DEFAULT_DTW_DIR


def _resolve_file(file_path_or_name: str, base_dir: Optional[str] = None) -> Path:
    p = Path(file_path_or_name)
    if p.is_absolute() and p.exists():
        return p
    bdir = _resolve_base_dir(base_dir)
    cand = bdir / file_path_or_name
    if cand.exists():
        return cand
    return cand if not p.is_absolute() else p


def _stdlib_xlsx_sheets(fpath: Path) -> List[str]:
    """Doc danh sach sheet cua file .xlsx bang thu vien chuan (zipfile + ElementTree)."""
    with zipfile.ZipFile(fpath, "r") as z:
        wb_xml = z.read("xl/workbook.xml")
        root = ET.fromstring(wb_xml)
        sheets = []
        for elem in root.iter():
            if elem.tag.endswith("}sheet") or elem.tag == "sheet":
                name = elem.attrib.get("name")
                if name:
                    sheets.append(name)
        return sheets


def _col_letters_to_idx(col_letters: str) -> int:
    idx = 0
    for ch in col_letters:
        if "A" <= ch <= "Z":
            idx = idx * 26 + (ord(ch) - ord("A") + 1)
    return max(0, idx - 1)


def _stdlib_xlsx_read_rows(fpath: Path, sheet_name: str = "", max_rows: int = 0) -> Tuple[str, List[str], List[List[Any]]]:
    """Doc du lieu sheet .xlsx bang stdlib khi khong co openpyxl."""
    with zipfile.ZipFile(fpath, "r") as z:
        wb_root = ET.fromstring(z.read("xl/workbook.xml"))
        rels_root = ET.fromstring(z.read("xl/_rels/workbook.xml.rels"))
        rid_to_target: Dict[str, str] = {}
        for rel in rels_root.iter():
            if rel.tag.endswith("}Relationship") or rel.tag == "Relationship":
                rid = rel.attrib.get("Id", "")
                target = rel.attrib.get("Target", "")
                if rid and target:
                    rid_to_target[rid] = target

        sheet_map: Dict[str, str] = {}
        sheets_order: List[str] = []
        for elem in wb_root.iter():
            if elem.tag.endswith("}sheet") or elem.tag == "sheet":
                sname = elem.attrib.get("name", "")
                rid = ""
                for k, v in elem.attrib.items():
                    if k.endswith("}id") or k == "r:id":
                        rid = v
                        break
                if sname:
                    sheets_order.append(sname)
                    t = rid_to_target.get(rid, "").lstrip("/")
                    if t:
                        if not t.startswith("xl/"):
                            t = "xl/" + t
                        sheet_map[sname] = t

        if not sheets_order:
            raise ValueError("Khong tim thay sheet nao trong workbook.")
        target_sheet = sheet_name if sheet_name in sheet_map else (sheet_name or sheets_order[0])
        if target_sheet not in sheet_map:
            raise KeyError(f"Sheet {target_sheet!r} khong ton tai. Cac sheet: {sheets_order}")

        shared_strings: List[str] = []
        if "xl/sharedStrings.xml" in z.namelist():
            ss_root = ET.fromstring(z.read("xl/sharedStrings.xml"))
            for si in ss_root:
                if si.tag.endswith("}si") or si.tag == "si":
                    parts = []
                    for t_node in si.iter():
                        if t_node.tag.endswith("}t") or t_node.tag == "t":
                            if t_node.text:
                                parts.append(t_node.text)
                    shared_strings.append("".join(parts))

        ws_xml = z.read(sheet_map[target_sheet])
        ws_root = ET.fromstring(ws_xml)
        rows_out: List[List[Any]] = []
        max_col_seen = 0
        for r_elem in ws_root.iter():
            if r_elem.tag.endswith("}row") or r_elem.tag == "row":
                row_cells: Dict[int, Any] = {}
                for c_elem in r_elem:
                    if not (c_elem.tag.endswith("}c") or c_elem.tag == "c"):
                        continue
                    ref = c_elem.attrib.get("r", "A1")
                    m = re.match(r"([A-Z]+)", ref)
                    col_idx = _col_letters_to_idx(m.group(1)) if m else len(row_cells)
                    ctype = c_elem.attrib.get("t", "")
                    val = None
                    if ctype == "inlineStr":
                        t_parts = []
                        for sub in c_elem.iter():
                            if (sub.tag.endswith("}t") or sub.tag == "t") and sub.text:
                                t_parts.append(sub.text)
                        val = "".join(t_parts)
                    else:
                        v_text = None
                        for sub in c_elem:
                            if sub.tag.endswith("}v") or sub.tag == "v":
                                v_text = sub.text
                                break
                        if v_text is not None:
                            if ctype == "s":
                                try:
                                    val = shared_strings[int(v_text)]
                                except Exception:
                                    val = v_text
                            else:
                                val = v_text
                    row_cells[col_idx] = val
                    if col_idx + 1 > max_col_seen:
                        max_col_seen = col_idx + 1
                row_list = [row_cells.get(i) for i in range(max_col_seen)]
                rows_out.append(row_list)
                if max_rows > 0 and len(rows_out) >= max_rows:
                    break
        return target_sheet, sheets_order, rows_out


def list_dtw_files(base_dir: Optional[str] = None) -> Dict[str, Any]:
    """Liet ke cac file Template DTW va file du lieu nguon trong thu muc."""
    bdir = _resolve_base_dir(base_dir)
    if not bdir.exists():
        return {
            "ok": False,
            "base_dir": str(bdir),
            "error": f"Thu muc DTW khong ton tai: {bdir}",
        }

    files_info: List[Dict[str, Any]] = []
    exts = {".xlsx", ".xls", ".csv", ".txt", ".json"}
    for f in sorted(bdir.iterdir()):
        if not f.is_file() or f.name.startswith("~$"):
            continue
        if f.suffix.lower() not in exts:
            continue
        st = f.stat()
        item: Dict[str, Any] = {
            "name": f.name,
            "path": str(f.resolve()),
            "extension": f.suffix.lower(),
            "size_kb": round(st.st_size / 1024.0, 2),
            "modified": datetime.fromtimestamp(st.st_mtime).strftime("%Y-%m-%d %H:%M:%S"),
        }
        if f.suffix.lower() == ".xlsx":
            try:
                item["sheets"] = _stdlib_xlsx_sheets(f)
            except Exception as e:
                item["sheets_error"] = str(e)
        files_info.append(item)

    return {
        "ok": True,
        "base_dir": str(bdir),
        "count": len(files_info),
        "files": files_info,
    }


def inspect_template(
    excel_file: str,
    sheet_name: str = "",
    base_dir: Optional[str] = None,
) -> Dict[str, Any]:
    """Doc cau truc 2 dong Header chuan DTW (Row 1: Template Column, Row 2: SAP DB Field)."""
    fpath = _resolve_file(excel_file, base_dir)
    if not fpath.is_file():
        return {
            "ok": False,
            "error": f"Khong tim thay file Excel: {fpath}",
        }

    try:
        target_sheet, sheets, all_rows = _stdlib_xlsx_read_rows(fpath, sheet_name=sheet_name, max_rows=0)
        row1 = list(all_rows[0]) if len(all_rows) >= 1 else []
        row2 = list(all_rows[1]) if len(all_rows) >= 2 else []
        sample_row3 = list(all_rows[2]) if len(all_rows) >= 3 else []

        columns_mapping: List[Dict[str, Any]] = []
        for idx in range(max(len(row1), len(row2))):
            c1 = str(row1[idx]).strip() if idx < len(row1) and row1[idx] is not None else ""
            c2 = str(row2[idx]).strip() if idx < len(row2) and row2[idx] is not None else ""
            s3 = str(sample_row3[idx]).strip() if idx < len(sample_row3) and sample_row3[idx] is not None else ""
            if c1 or c2:
                columns_mapping.append(
                    {
                        "col_index": idx + 1,
                        "row1_template_col": c1,
                        "row2_sap_db_field": c2,
                        "row3_sample": s3[:80],
                    }
                )

        return {
            "ok": True,
            "file": str(fpath),
            "sheet": target_sheet,
            "available_sheets": sheets,
            "total_rows": len(all_rows),
            "total_columns": max(len(row1), len(row2)),
            "dtw_columns": columns_mapping,
        }
    except Exception as e:
        return {"ok": False, "file": str(fpath), "error": str(e)}


def _replace_prefix_clean(val: Any, prefix: str, new_prefix: str) -> Any:
    if val is None:
        return None
    s = str(val).strip()
    if s.lower() == "nan" or s == "":
        return None
    if s.endswith(".0"):
        s = s[:-2]
    if s.startswith(prefix):
        return new_prefix + s[len(prefix) :]
    return s


def generate_coa_import(
    source_excel: str = "COA FVIV LONG THANH.xlsx",
    source_sheet: str = "Sheet1",
    filter_prefix: str = "642",
    target_prefix: str = "643",
    template_excel: str = "1-Template Finance.xlsx",
    output_excel: str = "Template_Import_643.xlsx",
    base_dir: Optional[str] = None,
) -> Dict[str, Any]:
    """Chuan hoa tu process.py: Loc tai khoan theo filter_prefix, chuyen sang target_prefix va xuat file DTW."""
    import numpy as np
    import openpyxl
    from openpyxl.styles import numbers
    import pandas as pd

    src_path = _resolve_file(source_excel, base_dir)
    tpl_path = _resolve_file(template_excel, base_dir)
    out_path = _resolve_file(output_excel, base_dir)

    if not src_path.is_file():
        return {"ok": False, "error": f"Khong tim thay file nguon: {src_path}"}
    if not tpl_path.is_file():
        return {"ok": False, "error": f"Khong tim thay file template: {tpl_path}"}

    filter_prefix = str(filter_prefix or "").strip()
    target_prefix = str(target_prefix or "").strip()
    if not filter_prefix or not target_prefix:
        return {"ok": False, "error": "filter_prefix va target_prefix khong duoc de trong."}

    try:
        source_df = pd.read_excel(src_path, sheet_name=source_sheet, dtype=str)
        source_df = source_df.replace("nan", np.nan)

        if "AcctCode" not in source_df.columns:
            return {
                "ok": False,
                "error": f"File nguon {src_path.name} (sheet {source_sheet}) khong co cot 'AcctCode'.",
            }

        clean_codes = source_df["AcctCode"].astype(str).str.strip().str.replace(r"\.0$", "", regex=True)
        filtered = source_df[clean_codes.str.startswith(filter_prefix, na=False)].copy()
        if filtered.empty:
            return {
                "ok": False,
                "error": f"Khong tim thay tai khoan nao bat dau bang {filter_prefix!r} trong {src_path.name}.",
            }

        transformed = filtered.copy()
        transformed["AcctCode"] = transformed["AcctCode"].apply(
            lambda x: _replace_prefix_clean(x, filter_prefix, target_prefix)
        )
        if "FatherNum" in transformed.columns:
            transformed["FatherNum"] = transformed["FatherNum"].apply(
                lambda x: _replace_prefix_clean(x, filter_prefix, target_prefix)
            )
        if "FormatCode" in transformed.columns:
            transformed["FormatCode"] = transformed["FormatCode"].apply(
                lambda x: _replace_prefix_clean(x, filter_prefix, target_prefix)
            )
        if "AcctName" in transformed.columns:
            transformed["AcctName"] = transformed["AcctName"].apply(
                lambda x: str(x).replace(filter_prefix, target_prefix) if pd.notna(x) else x
            )

        out_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy(tpl_path, out_path)

        wb = openpyxl.load_workbook(out_path)
        if "COA" not in wb.sheetnames:
            wb.close()
            return {"ok": False, "error": f"Sheet 'COA' khong ton tai trong template {tpl_path.name}."}

        ws = wb["COA"]
        db_col_to_idx: Dict[str, int] = {}
        for cell in ws[2]:
            if cell.value:
                db_col_to_idx[str(cell.value).strip()] = cell.column

        if ws.max_row >= 3:
            ws.delete_rows(3, ws.max_row - 2)

        for _, row in transformed.iterrows():
            new_row = ws.max_row + 1
            for db_col, val in row.items():
                if db_col in db_col_to_idx and pd.notna(val) and str(val).strip().lower() != "nan":
                    col_idx = db_col_to_idx[db_col]
                    val_str = str(val).strip()
                    if val_str.endswith(".0"):
                        val_str = val_str[:-2]
                    cell = ws.cell(row=new_row, column=col_idx, value=val_str)
                    cell.number_format = numbers.FORMAT_TEXT

        if "Sheet3" in wb.sheetnames:
            ws3 = wb["Sheet3"]
            db_col_to_idx_3: Dict[str, int] = {}
            for cell in ws3[1]:
                if cell.value:
                    db_col_to_idx_3[str(cell.value).strip()] = cell.column
            if ws3.max_row >= 2:
                ws3.delete_rows(2, ws3.max_row - 1)
            for _, row in transformed.iterrows():
                new_row = ws3.max_row + 1
                for db_col, val in row.items():
                    if db_col in db_col_to_idx_3 and pd.notna(val) and str(val).strip().lower() != "nan":
                        col_idx = db_col_to_idx_3[db_col]
                        val_str = str(val).strip()
                        if val_str.endswith(".0"):
                            val_str = val_str[:-2]
                        cell = ws3.cell(row=new_row, column=col_idx, value=val_str)
                        cell.number_format = numbers.FORMAT_TEXT

        wb.save(out_path)
        wb.close()

        sample_accounts = transformed[["AcctCode", "AcctName", "FatherNum"]].head(10).to_dict(orient="records")
        return {
            "ok": True,
            "source_excel": str(src_path),
            "template_excel": str(tpl_path),
            "output_excel": str(out_path),
            "filter_prefix": filter_prefix,
            "target_prefix": target_prefix,
            "records_generated": len(transformed),
            "mapped_db_columns": sorted(list(set(transformed.columns).intersection(set(db_col_to_idx.keys())))),
            "sample_records": sample_accounts,
        }
    except Exception as e:
        return {"ok": False, "error": str(e)}


def validate_master_data(
    excel_file: str,
    sheet_name: str = "COA",
    sap_version: str = "10.0",
    object_type: str = "OACT",
    base_dir: Optional[str] = None,
) -> Dict[str, Any]:
    """Kiem tra tinh hop le cua file Excel DTW truoc khi import vao SAP B1 9.3 / 10.0."""
    fpath = _resolve_file(excel_file, base_dir)
    if not fpath.is_file():
        return {"ok": False, "error": f"Khong tim thay file Excel: {fpath}"}

    sap_version = "9.3" if "9.3" in str(sap_version) or "93" in str(sap_version) else "10.0"
    obj = str(object_type or "OACT").strip().upper()

    rules_map = {
        "OACT": {
            "pk_fields": ("AcctCode", "Code"),
            "name_fields": ("AcctName", "Name"),
            "parent_fields": ("FatherNum", "FatherAccountKey"),
            "max_pk_len": 15,
            "max_name_len": 100 if sap_version == "9.3" else 254,
        },
        "OITM": {
            "pk_fields": ("ItemCode",),
            "name_fields": ("ItemName",),
            "parent_fields": (),
            "max_pk_len": 50,
            "max_name_len": 100 if sap_version == "9.3" else 200,
        },
        "OCRD": {
            "pk_fields": ("CardCode",),
            "name_fields": ("CardName",),
            "parent_fields": ("FatherCard",),
            "max_pk_len": 15,
            "max_name_len": 100 if sap_version == "9.3" else 200,
        },
    }
    rule = rules_map.get(obj, rules_map["OACT"])

    try:
        target_sheet, _, all_rows = _stdlib_xlsx_read_rows(fpath, sheet_name=sheet_name, max_rows=0)
        if len(all_rows) < 2:
            return {
                "ok": False,
                "error": "Sheet co it hon 2 dong, khong du cau truc Header DTW.",
            }

        row1 = [str(c).strip() if c is not None else "" for c in all_rows[0]]
        row2 = [str(c).strip() if c is not None else "" for c in all_rows[1]]

        is_two_row_dtw = any(f in row2 for f in ("AcctCode", "ItemCode", "CardCode")) or (
            any(f in row1 for f in ("Code", "SOPL")) and any(f in row2 for f in ("AcctCode", "AcctName"))
        )
        header_row = row2 if is_two_row_dtw else row1
        data_start_idx = 2 if is_two_row_dtw else 1

        col_idx_map = {name: i for i, name in enumerate(header_row) if name}

        pk_col = next((f for f in rule["pk_fields"] if f in col_idx_map), None)
        name_col = next((f for f in rule["name_fields"] if f in col_idx_map), None)
        parent_col = next((f for f in rule["parent_fields"] if f in col_idx_map), None)

        if not pk_col:
            return {
                "ok": False,
                "file": str(fpath),
                "sheet": target_sheet,
                "error": f"Khong tim thay cot khoa chinh ({rule['pk_fields']}) tren dong header.",
                "detected_headers": header_row[:30],
            }

        errors: List[Dict[str, Any]] = []
        warnings: List[Dict[str, Any]] = []
        seen_pks: Dict[str, int] = {}
        valid_rows = 0

        for r_offset, row in enumerate(all_rows[data_start_idx:]):
            excel_row_num = data_start_idx + r_offset + 1
            if not row or all(c is None or str(c).strip() == "" for c in row):
                continue

            valid_rows += 1
            pk_idx = col_idx_map[pk_col]
            raw_pk = row[pk_idx] if pk_idx < len(row) else None
            pk_val = str(raw_pk).strip() if raw_pk is not None else ""

            if not pk_val:
                errors.append(
                    {
                        "row": excel_row_num,
                        "field": pk_col,
                        "issue": "Thieu gia tri khoa chinh bat buoc (Empty Primary Key).",
                    }
                )
            else:
                if pk_val.endswith(".0"):
                    errors.append(
                        {
                            "row": excel_row_num,
                            "field": pk_col,
                            "value": pk_val,
                            "issue": "Ma bi dinh duoi '.0' do kieu so Float cua Excel.",
                        }
                    )
                if "E+" in pk_val.upper():
                    errors.append(
                        {
                            "row": excel_row_num,
                            "field": pk_col,
                            "value": pk_val,
                            "issue": "Ma bi bien dang sang ky hieu khoa hoc (Scientific Notation).",
                        }
                    )
                if len(pk_val) > rule["max_pk_len"]:
                    errors.append(
                        {
                            "row": excel_row_num,
                            "field": pk_col,
                            "value": pk_val,
                            "issue": f"Do dai ma ({len(pk_val)}) vuot qua gioi han SAP B1 ({rule['max_pk_len']} ky tu).",
                        }
                    )
                if pk_val in seen_pks:
                    errors.append(
                        {
                            "row": excel_row_num,
                            "field": pk_col,
                            "value": pk_val,
                            "issue": f"Trung khoa chinh voi dong {seen_pks[pk_val]}.",
                        }
                    )
                else:
                    seen_pks[pk_val] = excel_row_num

            if name_col:
                n_idx = col_idx_map[name_col]
                raw_name = row[n_idx] if n_idx < len(row) else None
                name_val = str(raw_name).strip() if raw_name is not None else ""
                if not name_val:
                    warnings.append(
                        {
                            "row": excel_row_num,
                            "field": name_col,
                            "issue": "Ten (Name) dang de trong.",
                        }
                    )
                elif len(name_val) > rule["max_name_len"]:
                    errors.append(
                        {
                            "row": excel_row_num,
                            "field": name_col,
                            "value": name_val[:40] + "...",
                            "issue": (
                                f"Do dai ten ({len(name_val)}) vuot qua gioi han SAP B1 {sap_version} "
                                f"({rule['max_name_len']} ky tu)."
                            ),
                        }
                    )

            if parent_col:
                p_idx = col_idx_map[parent_col]
                raw_parent = row[p_idx] if p_idx < len(row) else None
                parent_val = str(raw_parent).strip() if raw_parent is not None else ""
                if parent_val.endswith(".0"):
                    errors.append(
                        {
                            "row": excel_row_num,
                            "field": parent_col,
                            "value": parent_val,
                            "issue": "Ma cha (FatherNum) bi dinh duoi '.0'.",
                        }
                    )

        passed = len(errors) == 0 and valid_rows > 0
        return {
            "ok": True,
            "validation_passed": passed,
            "file": str(fpath),
            "sheet": target_sheet,
            "sap_version": sap_version,
            "object_type": obj,
            "is_two_row_dtw_header": is_two_row_dtw,
            "primary_key_column": pk_col,
            "total_data_rows": valid_rows,
            "unique_keys_count": len(seen_pks),
            "error_count": len(errors),
            "warning_count": len(warnings),
            "errors": errors[:50],
            "warnings": warnings[:50],
        }
    except Exception as e:
        return {"ok": False, "file": str(fpath), "error": str(e)}


def main():
    parser = argparse.ArgumentParser(description="SAP B1 DTW Master Data Importer & Validator")
    sub = parser.add_subparsers(dest="cmd")

    sub.add_parser("list", help="Liet ke file trong thu muc DTW")

    p_ins = sub.add_parser("inspect", help="Doc cau truc 2 dong header DTW")
    p_ins.add_argument("file", help="Ten file Excel")
    p_ins.add_argument("--sheet", default="", help="Ten sheet")

    p_gen = sub.add_parser("generate-coa", help="Tao file DTW Import COA theo prefix")
    p_gen.add_argument("--source", default="COA FVIV LONG THANH.xlsx")
    p_gen.add_argument("--source-sheet", default="Sheet1")
    p_gen.add_argument("--filter-prefix", default="642")
    p_gen.add_argument("--target-prefix", default="643")
    p_gen.add_argument("--template", default="1-Template Finance.xlsx")
    p_gen.add_argument("--output", default="Template_Import_643.xlsx")

    p_val = sub.add_parser("validate", help="Kiem tra tinh hop le cua file DTW")
    p_val.add_argument("file", help="Ten file Excel can validate")
    p_val.add_argument("--sheet", default="COA")
    p_val.add_argument("--sap-version", default="10.0", choices=["9.3", "10.0"])
    p_val.add_argument("--object-type", default="OACT", choices=["OACT", "OITM", "OCRD"])

    args = parser.parse_args()
    if args.cmd == "list":
        res = list_dtw_files()
    elif args.cmd == "inspect":
        res = inspect_template(args.file, sheet_name=args.sheet)
    elif args.cmd == "generate-coa":
        res = generate_coa_import(
            source_excel=args.source,
            source_sheet=args.source_sheet,
            filter_prefix=args.filter_prefix,
            target_prefix=args.target_prefix,
            template_excel=args.template,
            output_excel=args.output,
        )
    elif args.cmd == "validate":
        res = validate_master_data(
            args.file,
            sheet_name=args.sheet,
            sap_version=args.sap_version,
            object_type=args.object_type,
        )
    else:
        parser.print_help()
        return

    print(json.dumps(res, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
