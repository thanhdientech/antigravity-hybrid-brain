#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
spec_to_xlsx.py — Xuất campaign-spec.json (Search ad_groups hoặc PMax asset_groups) ra file Excel .xlsx nhiều sheet.
Hỗ trợ openpyxl (nếu có) hoặc bộ ghi OOXML thuần thư viện chuẩn Python (zipfile + xml) không cần cài đặt ngoài.
Usage:
    python spec_to_xlsx.py <campaign-spec.json> --output blueprint.xlsx
"""
from __future__ import annotations

import argparse
import json
import pathlib
import zipfile
from xml.sax.saxutils import escape


def _col_letter(idx_1based: int) -> str:
    res = ""
    n = idx_1based
    while n > 0:
        n, rem = divmod(n - 1, 26)
        res = chr(65 + rem) + res
    return res


def _write_minimal_xlsx(out_path: pathlib.Path, sheets: list[tuple[str, list[list[str]]]]) -> None:
    safe_sheets: list[tuple[str, list[list[str]]]] = []
    used_names: set[str] = set()
    for title, rows in sheets:
        clean = "".join(c for c in title if c not in "[]:*?/\\").strip()[:31] or "Sheet"
        base = clean
        k = 2
        while clean.lower() in used_names:
            suffix = f"_{k}"
            clean = base[: 31 - len(suffix)] + suffix
            k += 1
        used_names.add(clean.lower())
        safe_sheets.append((clean, rows))

    with zipfile.ZipFile(out_path, "w", zipfile.ZIP_DEFLATED) as zf:
        override_xml = "".join(
            f'<Override PartName="/xl/worksheets/sheet{i}.xml" '
            f'ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
            for i in range(1, len(safe_sheets) + 1)
        )
        zf.writestr(
            "[Content_Types].xml",
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
            '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
            '<Default Extension="xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
            f"{override_xml}</Types>",
        )
        zf.writestr(
            "_rels/.rels",
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
            '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'
            "</Relationships>",
        )
        sheets_tag = "".join(
            f'<sheet name="{escape(name)}" sheetId="{i}" r:id="rId{i}"/>'
            for i, (name, _) in enumerate(safe_sheets, start=1)
        )
        zf.writestr(
            "xl/workbook.xml",
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
            'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
            f"<sheets>{sheets_tag}</sheets></workbook>",
        )
        wb_rels = "".join(
            f'<Relationship Id="rId{i}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet{i}.xml"/>'
            for i in range(1, len(safe_sheets) + 1)
        )
        zf.writestr(
            "xl/_rels/workbook.xml.rels",
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            f'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">{wb_rels}</Relationships>',
        )
        for i, (_, rows) in enumerate(safe_sheets, start=1):
            row_xml_parts: list[str] = []
            for r_idx, row in enumerate(rows, start=1):
                cells_xml: list[str] = []
                for c_idx, val in enumerate(row, start=1):
                    ref = f"{_col_letter(c_idx)}{r_idx}"
                    s_val = "" if val is None else str(val)
                    cells_xml.append(
                        f'<c r="{ref}" t="inlineStr"><is><t xml:space="preserve">{escape(s_val)}</t></is></c>'
                    )
                row_xml_parts.append(f'<row r="{r_idx}">{"".join(cells_xml)}</row>')
            zf.writestr(
                f"xl/worksheets/sheet{i}.xml",
                '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
                '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
                f'<sheetData>{"".join(row_xml_parts)}</sheetData></worksheet>',
            )


def build_sheets_from_spec(spec: dict) -> list[tuple[str, list[list[str]]]]:
    camp = spec.get("campaign", {})
    acct = spec.get("account", {})
    bidding = camp.get("bidding", {})
    overview_rows = [
        ["Field", "Value"],
        ["Spec Version", str(spec.get("spec_version", 1))],
        ["Campaign Type", str(spec.get("campaign_type", ""))],
        ["Customer ID", str(acct.get("customer_id", ""))],
        ["Currency", str(acct.get("currency", ""))],
        ["Campaign Name", str(camp.get("name", ""))],
        ["Status", str(camp.get("status", "paused"))],
        ["Daily Budget", str(camp.get("daily_budget", ""))],
        ["Bidding Strategy", str(bidding.get("strategy", ""))],
        ["Target ROAS / CPA", str(bidding.get("target_roas") or bidding.get("target_cpa") or "")],
        ["Geo Targeting", ", ".join(camp.get("geo_targeting", []))],
        ["Language Targeting", ", ".join(camp.get("language_targeting", []))],
    ]
    sheets: list[tuple[str, list[list[str]]]] = [("Overview", overview_rows)]

    for idx, ag in enumerate(spec.get("ad_groups", []) or [], start=1):
        ag_name = ag.get("name") or f"AG_{idx}"
        rows: list[list[str]] = [
            ["Section", "Type / Match", "Text / Value", "Extra / Pin / URL"],
            ["Ad Group", "Theme", str(ag.get("theme", "")), str(ag.get("rsa", {}).get("final_url", ""))],
        ]
        for kw in ag.get("keywords", []) or []:
            rows.append(["Keyword", str(kw.get("match_type", "")), str(kw.get("text", "")), ""])
        for neg in ag.get("negatives", []) or []:
            if isinstance(neg, dict):
                rows.append(["Negative", str(neg.get("match_type", "")), str(neg.get("text", "")), ""])
            else:
                rows.append(["Negative", "", str(neg), ""])
        rsa = ag.get("rsa", {}) or {}
        for h in rsa.get("headlines", []) or []:
            if isinstance(h, dict):
                rows.append(["RSA Headline", f"len={len(str(h.get('text','')))}", str(h.get("text", "")), f"pin={h.get('pinned','')}"])
            else:
                rows.append(["RSA Headline", f"len={len(str(h))}", str(h), ""])
        for d in rsa.get("descriptions", []) or []:
            if isinstance(d, dict):
                rows.append(["RSA Description", f"len={len(str(d.get('text','')))}", str(d.get("text", "")), f"pin={d.get('pinned','')}"])
            else:
                rows.append(["RSA Description", f"len={len(str(d))}", str(d), ""])
        sheets.append((f"AG{idx}_{ag_name}"[:31], rows))

    for idx, pmax_ag in enumerate(spec.get("asset_groups", []) or [], start=1):
        ag_name = pmax_ag.get("name") or f"AssetGroup_{idx}"
        rows = [
            ["Section", "Role / Detail", "Content"],
            ["Final URL", "URL", str(pmax_ag.get("final_url", ""))],
            ["Business Name", "Brand", str(pmax_ag.get("business_name", ""))],
            ["Call To Action", "CTA", str(pmax_ag.get("call_to_action", ""))],
        ]
        for h in pmax_ag.get("headlines", []) or []:
            rows.append(["Headline", f"len={len(str(h))}", str(h)])
        for lh in pmax_ag.get("long_headlines", []) or []:
            rows.append(["Long Headline", f"len={len(str(lh))}", str(lh)])
        for d in pmax_ag.get("descriptions", []) or []:
            rows.append(["Description", f"len={len(str(d))}", str(d)])
        for st in pmax_ag.get("search_themes", []) or []:
            rows.append(["Search Theme", "Theme", str(st)])
        sheets.append((f"PMax{idx}_{ag_name}"[:31], rows))

    ext = spec.get("extensions", {}) or {}
    ext_rows = [["Extension Type", "Primary Text", "Detail 1", "Detail 2 / URL"]]
    for sl in ext.get("sitelinks", []) or []:
        ext_rows.append(["Sitelink", str(sl.get("text", "")), str(sl.get("description1", "")), str(sl.get("final_url", ""))])
    for co in ext.get("callouts", []) or []:
        ext_rows.append(["Callout", str(co), "", ""])
    for sn in ext.get("structured_snippets", []) or []:
        ext_rows.append(["Snippet", str(sn.get("header", "")), ", ".join(sn.get("values", [])), ""])
    for neg in spec.get("campaign_negatives", []) or []:
        if isinstance(neg, dict):
            ext_rows.append(["Campaign Negative", str(neg.get("text", "")), str(neg.get("match_type", "")), ""])
        else:
            ext_rows.append(["Campaign Negative", str(neg), "", ""])
    sheets.append(("Extensions_Negatives", ext_rows))
    return sheets


def main() -> int:
    ap = argparse.ArgumentParser(description="Render campaign-spec.json into a multi-sheet .xlsx blueprint.")
    ap.add_argument("spec_json", help="Path to campaign-spec.json")
    ap.add_argument("--output", "-o", default="blueprint.xlsx", help="Output .xlsx path")
    args = ap.parse_args()

    spec_path = pathlib.Path(args.spec_json)
    out_path = pathlib.Path(args.output)
    spec = json.loads(spec_path.read_text(encoding="utf-8"))
    sheets = build_sheets_from_spec(spec)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    _write_minimal_xlsx(out_path, sheets)
    print(f"OK: Wrote {len(sheets)} sheets to {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
