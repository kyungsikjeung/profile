/**
 * 크리에이터 유즈케이스 (전부 이해를 돕기 위한 예시/더미 데이터).
 * 실존 인물·실제 성과가 아님 — UI에 '예시 프로필' 배지 + 하단 고지로 표기.
 */

export interface CareerEntry {
  period: string;
  company: string;
  role: string;
}

export interface Creator {
  id: string;
  name: string;
  initials: string;
  role: string;
  tagline: string;
  templateId: string;
  themeAccent: string;
  career: CareerEntry[];
}

export const HONEST_NOTE = '소개된 프로필과 작품, 경력은 이해를 돕기 위한 예시입니다.';

export const CREATORS: Creator[] = [
  {
    id: 'creator-ui',
    name: '김서연',
    initials: '서연',
    role: 'UI 디자이너',
    tagline: '모바일 앱 케이스를 3D 쇼룸으로 전시',
    templateId: 'korean-minimal',
    themeAccent: '#2563eb',
    career: [
      { period: '2023 — 현재', company: '핀테크 스타트업 T', role: '프로덕트 디자이너' },
      { period: '2021 — 2023', company: '에이전시 S', role: 'UX 디자이너' },
      { period: '2020 — 2021', company: '프리랜서', role: '앱 UI · 브랜딩' },
    ],
  },
  {
    id: 'creator-photo',
    name: '이준호',
    initials: '준호',
    role: '포토그래퍼',
    tagline: '웨딩·스냅 사진을 갤러리형 3D 월로 전시',
    templateId: 'gallery',
    themeAccent: '#ea580c',
    career: [
      { period: '2022 — 현재', company: '스튜디오 L', role: '대표 · 웨딩 스냅' },
      { period: '2019 — 2022', company: '매거진 M', role: '에디토리얼 포토그래퍼' },
      { period: '2018 — 2019', company: '프리랜서', role: '행사 · 인물 스냅' },
    ],
  },
  {
    id: 'creator-3d',
    name: '박지민',
    initials: '지민',
    role: '3D 일러스트레이터',
    tagline: '캐릭터 렌더를 회전형 오브제로 전시',
    templateId: 'studio',
    themeAccent: '#8b5cf6',
    career: [
      { period: '2023 — 현재', company: '게임 스튜디오 G', role: '3D 캐릭터 아티스트' },
      { period: '2021 — 2023', company: '애니메이션 스튜디오 A', role: '룩뎁 · 라이팅' },
      { period: '2020 — 2021', company: '프리랜서', role: '캐릭터 굿즈 · NFT 아트' },
    ],
  },
  {
    id: 'creator-arch',
    name: '최도윤',
    initials: '도윤',
    role: '건축 시각화 디자이너',
    tagline: '인테리어 목업을 워크스루형 씬으로 전시',
    templateId: 'minimal',
    themeAccent: '#6366f1',
    career: [
      { period: '2022 — 현재', company: '건축사사무소 D', role: '3D 시각화 디자이너' },
      { period: '2020 — 2022', company: '인테리어 스튜디오 I', role: '공간 스타일링 · CG' },
      { period: '2019 — 2020', company: '프리랜서', role: '부동산 조감도 · 투시도' },
    ],
  },
  {
    id: 'creator-fashion',
    name: '한아름',
    initials: '아름',
    role: '패션 스타일리스트',
    tagline: '룩북을 런웨이형 스크롤 씬으로 전시',
    templateId: 'dark-premium',
    themeAccent: '#f59e0b',
    career: [
      { period: '2023 — 현재', company: '브랜드 F', role: '스타일링 디렉터' },
      { period: '2021 — 2023', company: '매거진 V', role: '패션 에디터' },
      { period: '2019 — 2021', company: '프리랜서', role: '화보 · 광고 스타일링' },
    ],
  },
  {
    id: 'creator-motion',
    name: '정태오',
    initials: '태오',
    role: '모션그래픽 디자이너',
    tagline: '영상 썸네일을 시네마틱 히어로 씬으로 전시',
    templateId: 'dark-premium',
    themeAccent: '#f59e0b',
    career: [
      { period: '2022 — 현재', company: '모션 스튜디오 N', role: '모션 디자이너' },
      { period: '2020 — 2022', company: '방송국 B', role: '타이틀 · 인포그래픽' },
      { period: '2019 — 2020', company: '프리랜서', role: '유튜브 인트로 · 광고 모션' },
    ],
  },
];
