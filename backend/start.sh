#!/bin/bash
# ─────────────────────────────────────────────────────────────
#  Outfit Color Studio — Backend startup
#  Compatible: Python 3.9 – 3.14
# ─────────────────────────────────────────────────────────────
set -e
cd "$(dirname "$0")"

# ── 1. Find Python ──────────────────────────────────────────
for cmd in python3.14 python3.13 python3.12 python3.11 python3.10 python3.9 python3 python; do
  if command -v "$cmd" &>/dev/null; then
    PYTHON="$cmd"
    break
  fi
done
if [ -z "$PYTHON" ]; then
  echo "❌  Python not found. Install Python 3.9+."
  exit 1
fi
echo "🐍  Using $($PYTHON --version)"

# ── 2. Create venv ──────────────────────────────────────────
if [ ! -d "venv" ]; then
  echo "📦  Creating virtual environment..."
  "$PYTHON" -m venv venv
fi

# Activate
if [ -f "venv/bin/activate" ]; then
  source venv/bin/activate
elif [ -f "venv/Scripts/activate" ]; then          # Windows Git Bash
  source venv/Scripts/activate
fi

# ── 3. Install / upgrade deps ───────────────────────────────
echo "📦  Installing dependencies..."
# --upgrade ensures we get versions that support this Python
pip install --upgrade pip --quiet
pip install --upgrade -r requirements.txt --quiet
echo "✅  Dependencies ready"

# ── 4. Start server ─────────────────────────────────────────
echo ""
echo "🚀  Backend running at http://localhost:8000"
echo "📖  Swagger UI      at http://localhost:8000/docs"
echo ""
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
