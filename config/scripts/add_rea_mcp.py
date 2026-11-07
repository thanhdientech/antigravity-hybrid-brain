import json

p = r"C:\Users\INFOASIA\.gemini\config\mcp_config.json"
with open(p, "r", encoding="utf-8") as f:
    cfg = json.load(f)

cfg["mcpServers"]["rea"] = {
    "command": "node",
    "args": [
        r"E:\DIEN APP\Skill AI\rea\scripts\rea.mjs",
        "mcp"
    ],
    "disabled": False
}

with open(p, "w", encoding="utf-8") as f:
    json.dump(cfg, f, indent=2, ensure_ascii=False)

print("Updated mcp_config.json with rea server successfully.")
