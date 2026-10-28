#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
recalc_xlsx_check.py — Kiểm định cấu trúc OOXML, công thức (<f>) và phát hiện mã lỗi công thức Excel
(#REF!, #DIV/0!, #VALUE!, #NAME?, #N/A, #NUM!, #NULL!) cho báo cáo từ khóa keyword-analysis.
Usage:
    python recalc_xlsx_check.py <workbook.xlsx>
"""
from __future__ import annotations

import argparse
import json
import pathlib
import xml.etree.ElementTree as ET
import zipfile

ERROR_TOKENS = {"#REF!", "#DIV/0!", "#VALUE!", "#NAME?", "#N/A", "#NUM!", "#NULL!"}


def check_workbook(xlsx_path: pathlib.Path) -> dict:
    ns = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
    shared: list[str] = []
    formula_count = 0
    errors_found: list[dict] = []
    sheet_count = 0

    with zipfile.ZipFile(xlsx_path, "r") as zf:
        if "xl/sharedStrings.xml" in zf.namelist():
            sroot = ET.fromstring(zf.read("xl/sharedStrings.xml"))
            for si in sroot.findall("m:si", ns):
                shared.append("".join(t.text or "" for t in si.findall(".//m:t", ns)))

        for name in sorted(n for n in zf.namelist() if n.startswith("xl/worksheets/sheet") and n.endswith(".xml")):
            sheet_count += 1
            wroot = ET.fromstring(zf.read(name))
            for c in wroot.findall(".//m:c", ns):
                ref = c.attrib.get("r", "")
                t = c.attrib.get("t", "")
                f_el = c.find("m:f", ns)
                v_el = c.find("m:v", ns)
                if f_el is not None:
                    formula_count += 1
                    ftxt = (f_el.text or "").strip()
                    if any(tok in ftxt for tok in ERROR_TOKENS):
                        errors_found.append({"sheet": name, "cell": ref, "issue": f"Formula contains error: {ftxt}"})
                if t == "e" and v_el is not None:
                    errors_found.append({"sheet": name, "cell": ref, "issue": f"Cached error value: {v_el.text}"})
                elif t == "s" and v_el is not None and v_el.text and v_el.text.isdigit():
                    idx = int(v_el.text)
                    if 0 <= idx < len(shared) and shared[idx].strip() in ERROR_TOKENS:
                        errors_found.append({"sheet": name, "cell": ref, "issue": f"Shared string error: {shared[idx]}"})

    return {
        "status": "PASS" if not errors_found else "FAIL",
        "file": str(xlsx_path),
        "sheets_checked": sheet_count,
        "total_formulas": formula_count,
        "error_count": len(errors_found),
        "errors": errors_found,
    }


def main() -> int:
    ap = argparse.ArgumentParser(description="Validate .xlsx structure and check for Excel formula errors.")
    ap.add_argument("xlsx_file", help="Path to .xlsx file")
    args = ap.parse_args()
    p = pathlib.Path(args.xlsx_file)
    report = check_workbook(p)
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0 if report["status"] == "PASS" else 1


if __name__ == "__main__":
    raise SystemExit(main())
