#!/usr/bin/env bash
cd "$(dirname "$0")"
sleep 20
while pgrep -f "run.py FINAL" >/dev/null || pgrep -f "after.sh" >/dev/null || pgrep -f "after2.sh" >/dev/null; do sleep 60; done
python3 run.py FINAL aerial2,aerial1 64 > ../tmp/final4.log 2>&1
