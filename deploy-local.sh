#!/bin/bash
# deploy-local.sh — start the full stack locally (frontend + backend)
# Usage: ./deploy-local.sh

set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "==> Killing any processes on ports 3001 and 5173..."
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true
sleep 0.5

echo "==> Starting backend on port 3001..."
cd "$ROOT/server"
node index.js &
BACKEND_PID=$!

# Wait for backend to be ready
for i in $(seq 1 10); do
  if curl -sf http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "   Backend ready."
    break
  fi
  sleep 0.5
done

echo "==> Starting frontend on port 5173..."
cd "$ROOT"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "  Frontend : http://localhost:5173"
echo "  Backend  : http://localhost:3001"
echo "  Health   : http://localhost:3001/api/health"
echo ""
echo "Press Ctrl+C to stop both servers."

cleanup() {
  echo ""
  echo "==> Stopping servers (PIDs $BACKEND_PID $FRONTEND_PID)..."
  kill "$BACKEND_PID" 2>/dev/null || true
  kill "$FRONTEND_PID" 2>/dev/null || true
  # Kill any child processes of vite
  pkill -P "$FRONTEND_PID" 2>/dev/null || true
  exit 0
}
trap cleanup INT TERM

wait
