"""Build deterministic sprite sheets from authored animated GIF assets.

Usage:
  python studio/tools/build-sprite-sheets.py
  python studio/tools/build-sprite-sheets.py --check

The source GIF remains canonical. Sheets are presentation artifacts only.
"""
from __future__ import annotations

import argparse
import json
import os
import tempfile
from pathlib import Path

from PIL import Image, ImageSequence


ROOT = Path(__file__).resolve().parents[2]
SOURCE_DIR = ROOT / "assets" / "sprites"
OUTPUT_DIR = ROOT / "assets" / "spritesheets"
SOURCES = ("leovolt", "scorpyone", "fiscalfish", "loanshark", "afkwhale")
FRAME_SIZE = 256
COLUMNS = 3


def atomic_write(path: Path, data: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(dir=path.parent, delete=False) as handle:
        handle.write(data)
        temporary = Path(handle.name)
    os.replace(temporary, path)


def build_sprite(name: str, write: bool = True) -> dict:
    source = next((SOURCE_DIR / f"{name}{extension}" for extension in (".gif", ".png") if (SOURCE_DIR / f"{name}{extension}").exists()), SOURCE_DIR / f"{name}.gif")
    if not source.exists():
        raise FileNotFoundError(source)
    with Image.open(source) as image:
        frames = []
        durations = []
        if source.suffix.lower() == ".png":
            base = image.convert("RGBA")
            base.thumbnail((FRAME_SIZE - 12, FRAME_SIZE - 12), Image.Resampling.LANCZOS)
            for index, (scale, dx, dy, angle, alpha) in enumerate(((1.00, 0, 2, 0, 255), (1.02, 0, 0, 0, 255), (1.00, 0, -2, 0, 255), (1.00, 10, 0, -3, 255), (1.02, 16, 0, -5, 255), (1.00, 10, 0, -3, 255), (1.00, 0, 0, 2, 210), (0.96, 0, 3, 4, 120), (0.90, 0, 7, 6, 0))):
                frame = base.resize((round(base.width * scale), round(base.height * scale)), Image.Resampling.LANCZOS).rotate(angle, resample=Image.Resampling.BICUBIC, expand=True)
                if alpha != 255:
                    frame.putalpha(frame.getchannel("A").point(lambda value: value * alpha // 255))
                canvas = Image.new("RGBA", (FRAME_SIZE, FRAME_SIZE), (0, 0, 0, 0))
                canvas.paste(frame, ((FRAME_SIZE - frame.width) // 2 + dx, (FRAME_SIZE - frame.height) // 2 + dy), frame)
                frames.append(canvas); durations.append(160 if index != 8 else 500)
        else:
            for frame in ImageSequence.Iterator(image):
                rgba = frame.convert("RGBA")
                rgba.thumbnail((FRAME_SIZE, FRAME_SIZE), Image.Resampling.LANCZOS)
                canvas = Image.new("RGBA", (FRAME_SIZE, FRAME_SIZE), (0, 0, 0, 0))
                canvas.paste(rgba, ((FRAME_SIZE - rgba.width) // 2, (FRAME_SIZE - rgba.height) // 2), rgba)
                frames.append(canvas); durations.append(int(frame.info.get("duration", 100)))
    if not frames:
        raise ValueError(f"No frames found in {source}")

    rows = (len(frames) + COLUMNS - 1) // COLUMNS
    sheet = Image.new("RGBA", (COLUMNS * FRAME_SIZE, rows * FRAME_SIZE), (0, 0, 0, 0))
    for index, frame in enumerate(frames):
        sheet.paste(frame, ((index % COLUMNS) * FRAME_SIZE, (index // COLUMNS) * FRAME_SIZE), frame)

    output = OUTPUT_DIR / f"{name}.png"
    if write:
        with tempfile.NamedTemporaryFile(dir=OUTPUT_DIR, suffix=".png", delete=False) as handle:
            temporary = Path(handle.name)
        try:
            sheet.save(temporary, format="PNG", optimize=True)
            os.replace(temporary, output)
        finally:
            temporary.unlink(missing_ok=True)

    return {
        "id": name,
        "source": f"/assets/sprites/{name}{source.suffix.lower()}",
        "sheet": f"/assets/spritesheets/{name}.png",
        "frameWidth": FRAME_SIZE,
        "frameHeight": FRAME_SIZE,
        "columns": COLUMNS,
        "rows": rows,
        "frameCount": len(frames),
        "durations": durations,
        "states": {"idle": [0, 2], "attack": [3, 5], "hit": [6, 7], "faint": [8, 8]},
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="verify generated outputs without writing")
    args = parser.parse_args()
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    records = []
    for name in SOURCES:
        record = build_sprite(name, write=not args.check)
        records.append(record)
    manifest = {"schemaVersion": "0.1.0", "generatedBy": "build-sprite-sheets.py", "sprites": records}
    manifest_path = OUTPUT_DIR / "manifest.json"
    encoded = (json.dumps(manifest, indent=2) + "\n").encode("utf-8")
    if args.check:
        if not manifest_path.exists() or manifest_path.read_bytes() != encoded:
            raise SystemExit("Sprite-sheet outputs are stale; run without --check.")
        for record in records:
            if not (ROOT / record["sheet"].lstrip("/")).exists():
                raise SystemExit(f"Missing sprite sheet: {record['sheet']}")
        print(f"Checked {len(records)} sprite sheets.")
        return 0
    atomic_write(manifest_path, encoded)
    print(f"Built {len(records)} sprite sheets in {OUTPUT_DIR.relative_to(ROOT)}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
