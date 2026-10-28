---
name: google-ads-shared
description: >
  Internal shared library for the Google Ads toolkit skills (audit, plan, optimizer, builder-*, pusher...).
  Contains cross-skill reference playbooks and JSON/YAML templates. This skill is not meant to be invoked
  directly by the user — the other Google Ads skills read files from this folder automatically. Keep this
  skill enabled whenever any other google-ads-* skill is enabled, otherwise those skills will be missing
  their reference files.
---

# Google Ads Toolkit — Shared References & Templates

This folder exists so the other Google Ads skills (audit, plan, optimizer, builder-search, builder-pmax,
builder-branded-search, builder-demand-gen, pusher, assets, measurement, tracker, experiments, routine,
setup, google-ads) have a common place to read shared playbooks and templates from.

- `references/` — cross-skill playbooks (diagnostic-playbook.md, optimization-playbook.md,
  model-tier-dispatch.md, change-set.md, campaign-spec.md, forecasting-and-benchmarks.md, etc.)
- `templates/` — JSON/YAML templates (account-context.yaml, change-set.json, campaign-spec.json,
  audit-result.json)

There is nothing to "do" with this skill directly — it has no workflow of its own.
