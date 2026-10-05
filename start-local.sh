#!/bin/bash
# 로컬 전체 기동: PostgreSQL/Redis/Kafka (brew services) + 백엔드:8000 + 프론트:3000
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"

brew services start postgresql@16 >/dev/null 2>&1 || true
brew services start redis >/dev/null 2>&1 || true
brew services start kafka >/dev/null 2>&1 || true

cd "$ROOT/backend"
nohup "$ROOT/backend/.venv/bin/uvicorn" app.main:app --port 8000 > /tmp/p3d-backend.log 2>&1 &
echo "backend: $! (log: /tmp/p3d-backend.log)"

cd "$ROOT/frontend"
nohup npm run dev > /tmp/p3d-frontend.log 2>&1 &
echo "frontend: $! (log: /tmp/p3d-frontend.log)"

echo "→ http://localhost:3000 (API docs: http://localhost:8000/docs)"
