#!/bin/bash
# 로컬 전체 종료: 백엔드 + 프론트 (DB/Redis/Kafka는 유지)
pkill -f "uvicorn app.main" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true
echo "stopped. (DB/Redis/Kafka는 brew services로 유지됨)"
