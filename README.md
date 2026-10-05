# Portfolio3D — 사진을 3D 포트폴리오로 바꾸는 플랫폼

## 로컬 개발 (전체 로컬 구동)

| 구성 | 주소 |
|---|---|
| 프론트 (Next.js) | http://localhost:3000 |
| 백엔드 (FastAPI) | http://localhost:8000 · 문서 `/docs` |
| PostgreSQL 16 | `localhost:5432` / db `portfolio3d` / role `portfolio` |
| Redis | `localhost:6379` (레이트리밋) |
| Kafka | `localhost:9092` (변환 이벤트, 토픽 `conversion-events`) |

```bash
./start-local.sh   # 전부 기동
./stop-local.sh    # 앱 종료 (DB/Redis/Kafka 유지)
```

최초 1회 (이미 구성됨, 재설치 시 참고):
```bash
brew install postgresql@16 redis kafka && brew services start postgresql@16 redis kafka
psql postgres -c "CREATE ROLE portfolio WITH LOGIN PASSWORD 'portfolio' CREATEDB;"
psql postgres -c "CREATE DATABASE portfolio3d OWNER portfolio;"
python3 -m venv backend/.venv && backend/.venv/bin/pip install -r backend/requirements.txt
cp backend/.env.example backend/.env  # 기본값이 로컬용 (Postgres 주석 참고)
```

Kafka 이벤트 보기 (실습용):
```bash
backend/.venv/bin/python backend/scripts/consume_events.py
```

Redis/Kafka 연습:
```bash
redis-cli              # PING, KEYS rl:*, TTL 확인
kafka-topics --bootstrap-server localhost:9092 --list
```

## 스테이징 배포

`DEPLOY.md` 참고 (Vercel + Render + Neon, $0).
