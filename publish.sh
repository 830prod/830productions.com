#!/bin/zsh

set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: ./publish.sh \"commit message\""
  exit 1
fi

git add -A

if git diff --cached --quiet; then
  echo "No changes to publish."
  exit 0
fi

git commit -m "$1"
git push
