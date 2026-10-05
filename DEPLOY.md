# Portfolio3D 스테이징 배포 가이드 ($0)

목표: 외부에서 테스트 가능한 URL 2개 (프론트 + API).

## 0. 전제 (사용자 직접 수행 — 계정 필요)

- [ ] GitHub에 이 폴더 푸시 (`profile` 저장소)
- [ ] Vercel / Render / Neon 무료 가입

## 1. DB — Neon (5분)

1. Neon → New Project → Postgres 생성
2. Connection string 복사 (pooled, `postgresql://...`)
3. SQLAlchemy용으로 스킴만 교체: `postgresql+asyncpg://...`

## 2. 백엔드 — Render (Blueprint)

1. Render → New → Blueprint → 저장소 선택 (`render.yaml` 자동 인식)
2. 환경변수 설정:
   - `DATABASE_URL` = Neon pooled string (`postgresql+asyncpg://...`)
   - `CORS_ORIGINS` = 프론트 URL 확정 후 입력 (3단계에서 회신)
   - `SECRET_KEY` = 자동 생성됨
3. 배포 후 `https://p3d-api.onrender.com/health` → `{"status":"healthy"}` 확인
4. `https://p3d-api.onrender.com/docs` 열리면 성공

주의:
- Free 슬립(15분) → 첫 요청 10~30초. UptimeRobot 무료 플랜으로 5분마다 `/health` ping 권장
- `storage/`는 ephemeral: 재배포·슬립 시 업로드 파일 소멸 (스테이징 허용, 운영은 S3 전환 — `S3_BUCKET` 준비됨)
- `CONVERSION_PROVIDER=mock` 유지 (Meshy 키 발급 후 `meshy`로 변경)

## 3. 프론트 — Vercel

1. Vercel → Add New Project → 저장소 선택
2. Root Directory = `frontend`, Framework = Next.js (자동)
3. Environment Variables:
   - `NEXT_PUBLIC_API_URL` = `https://p3d-api.onrender.com` (빌드 시점에 번들에 박히므로 나중에 바꾸면 재배포 필요)
4. 배포 후 URL 확보 → **2단계로 돌아가 `CORS_ORIGINS`에 추가 후 백엔드 Redeploy**

## 4. 테스트 시나리오 (스테이징 검수용)

- [ ] `/demo` 사진 업로드 → 변환 완료 → 3D 표시 (콜드스타트 감안 1분 이내)
- [ ] 회원가입 → 로그인 → 대시보드 프로젝트 생성
- [ ] 에디터: 템플릿 변경 + 프로필/케이스 입력 + 저장 → 게시 → `/p/[slug]` 공개 확인
- [ ] 요금제 목업 결제 → Pro 전환 → 변환 한도 20회 확인
- [ ] 모바일(640px) + `?no3d=1` + 키보드만 조작 통과

## 5. 임시 공유 (계정 없이 오늘 바로)

```bash
# 터미널 2개 또는 백그라운드
brew install cloudflared
cloudflared tunnel --url http://localhost:3000  # 프론트 공개 URL 발급
cloudflared tunnel --url http://localhost:8000  # API 공개 URL 발급
```

이 경우 프론트 공개 URL에서 API를 부르려면 백엔드 `.env`에
`CORS_ORIGINS=<cloudflare-front-url>` 추가 후 백엔드 재시작.
