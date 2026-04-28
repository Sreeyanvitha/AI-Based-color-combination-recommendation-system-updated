#!/bin/bash
# ─────────────────────────────────────────────────────────────
#  Outfit Color Studio — Launch both backend + frontend
#  Compatible: Python 3.9–3.14 · Node 18+
# ─────────────────────────────────────────────────────────────
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║      🎨  Outfit Color Studio  v2         ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# ── Backend ──────────────────────────────────────────────────
echo "▶  Starting backend…"
cd "$ROOT/backend"

for cmd in python3.14 python3.13 python3.12 python3.11 python3.10 python3.9 python3 python; do
  if command -v "$cmd" &>/dev/null; then PYTHON="$cmd"; break; fi
done
[ -z "$PYTHON" ] && { echo "❌  Python 3.9+ required."; exit 1; }

[ ! -d "venv" ] && "$PYTHON" -m venv venv
source venv/bin/activate 2>/dev/null || source venv/Scripts/activate
pip install --upgrade pip -q
pip install --upgrade -r requirements.txt -q

uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
echo "   ✓ Backend  http://localhost:8000  (PID $BACKEND_PID)"

# ── Frontend ─────────────────────────────────────────────────
echo "▶  Starting frontend…"
cd "$ROOT/frontend"
[ ! -d "node_modules" ] && npm install
npm run dev &
FRONTEND_PID=$!
echo "   ✓ Frontend http://localhost:3000  (PID $FRONTEND_PID)"

echo ""
echo "══════════════════════════════════════════"
echo "  Open →  http://localhost:3000"
echo "  API  →  http://localhost:8000/docs"
echo "══════════════════════════════════════════"
echo "  Ctrl+C to stop both servers."
echo ""

trap "echo ''; echo 'Stopping…'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" SIGINT SIGTERM
wait
