#!/usr/bin/env python3
import datetime as _dt
import hashlib
import html
import json
import re
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "ttc-competitive-analysis" / "data" / "ttc-data.json"
SOURCE_URL = "https://ttc.kz/ru/b2c/"


def page_text(raw: str) -> str:
    raw = re.sub(r"<script\b[^>]*>.*?</script>", " ", raw, flags=re.I | re.S)
    raw = re.sub(r"<style\b[^>]*>.*?</style>", " ", raw, flags=re.I | re.S)
    raw = re.sub(r"<[^>]+>", " ", raw)
    raw = html.unescape(raw)
    return re.sub(r"\s+", " ", raw).strip()


def fetch_source() -> tuple[str, str]:
    request = urllib.request.Request(
        SOURCE_URL,
        headers={
            "User-Agent": "Mozilla/5.0 TTC competitive analysis monitor",
            "Accept-Language": "ru,en;q=0.8",
        },
    )
    with urllib.request.urlopen(request, timeout=40) as response:
        raw = response.read().decode("utf-8", errors="replace")
    text = page_text(raw)
    digest = hashlib.sha256(text.encode("utf-8")).hexdigest()
    return text, digest


def main() -> int:
    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    today = _dt.datetime.now(_dt.UTC).date().isoformat()

    try:
        text, digest = fetch_source()
        data["last_checked"] = today
        data["source_hash"] = digest
        data["source_url"] = SOURCE_URL
        data["status"] = "Auto-update: TTC source page checked"
        data["source_markers"] = {
            "has_ttc_box": "TTC BOX" in text,
            "has_discount_promo": any(marker in text for marker in ["50%", "-50", "скидк"]),
            "has_tv_180": "180+" in text or "180 канал" in text,
        }
    except Exception as exc:
        data["last_checked"] = today
        data["status"] = f"Auto-update: TTC source unavailable, keeping latest manual snapshot ({exc.__class__.__name__})"

    DATA_PATH.write_text(
        json.dumps(data, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
