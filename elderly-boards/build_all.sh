#!/usr/bin/env bash
# Rebuild the three A1 boards from the two floor-plan PDFs in ./input
set -e
cd "$(dirname "$0")"
pip install pymupdf shapely playwright pillow >/dev/null
[ -d node_modules ] || npm install
mkdir -p out tmp
python3 src/mkfonts.py                 # -> src/fonts.css
python3 src/cad.py                     # CAD linework -> tmp/cad*_{stroke,fill}.txt
python3 src/build.py board1 board2 board3   # -> out/board{1,2,3}.{html,pdf,png}
