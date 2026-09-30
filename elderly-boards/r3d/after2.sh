#!/usr/bin/env bash
cd "$(dirname "$0")"
while pgrep -f "run.py FINAL" >/dev/null || pgrep -f after.sh >/dev/null; do sleep 60; done
python3 run.py FINAL rehab1 64 > ../tmp/final3.log 2>&1
