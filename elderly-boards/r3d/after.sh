#!/usr/bin/env bash
# wait for the main batch to finish, then re-shoot lobby (new camera) and bedroom (matte furniture)
cd "$(dirname "$0")"
while pgrep -f "run.py FINAL hall2" >/dev/null; do sleep 60; done
python3 run.py FINAL lobby1,bedroom 64 > ../tmp/final2.log 2>&1
