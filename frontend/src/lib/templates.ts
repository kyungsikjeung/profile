/** 스타터 템플릿 5종 (FR-019). scene_config 기본값과 1:1 대응. */

export interface TemplateTheme {
  background: string;
  surface: string;
  text: string;
  muted: string;
  accent: string;
}

export interface TemplateLighting {
  background: string;
  intensity: number;
  autoRotate: boolean;
}

export interface TemplateDef {
  id: string;
  name: string;
  description: string;
  theme: TemplateTheme;
  lighting: TemplateLighting;
}

export const TEMPLATES: TemplateDef[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: '깔끔한 화이트 베이스, 첫 포트폴리오용',
    theme: { background: '#ffffff', surface: '#f1f5f9', text: '#0f172a', muted: '#64748b', accent: '#6366f1' },
    lighting: { background: '#f8fafc', intensity: 1.1, autoRotate: false },
  },
  {
    id: 'gallery',
    name: 'Gallery',
    description: '작품 중심 그리드, 포토그래퍼·일러스트레이터용',
    theme: { background: '#fafaf9', surface: '#ffffff', text: '#1c1917', muted: '#78716c', accent: '#ea580c' },
    lighting: { background: '#fafaf9', intensity: 1.0, autoRotate: false },
  },
  {
    id: 'studio',
    name: 'Studio',
    description: '다크 스튜디오 무드, 3D 아티스트용',
    theme: { background: '#0a0a0f', surface: '#1c1c26', text: '#f8fafc', muted: '#94a3b8', accent: '#8b5cf6' },
    lighting: { background: '#0a0a0f', intensity: 1.4, autoRotate: true },
  },
  {
    id: 'dark-premium',
    name: 'Dark Premium',
    description: '글로벌 프리미엄 무드, 클라이언트 제안용',
    theme: { background: '#050507', surface: '#131318', text: '#fafafa', muted: '#a1a1aa', accent: '#f59e0b' },
    lighting: { background: '#050507', intensity: 1.6, autoRotate: true },
  },
  {
    id: 'korean-minimal',
    name: 'Korean Minimal',
    description: '정보 밀집·모바일 우선, 한국 채용 시장용',
    theme: { background: '#ffffff', surface: '#f8fafc', text: '#020617', muted: '#475569', accent: '#2563eb' },
    lighting: { background: '#ffffff', intensity: 1.0, autoRotate: false },
  },
];

export function getTemplate(id: string): TemplateDef {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}

/** scene_config에 저장되는 에디터 값. */
export interface SceneConfig {
  modelUrl?: string;
  bgColor?: string;
  lightIntensity?: number;
  autoRotate?: boolean;
  // 6초 스캔 헤더 (공유페이지용, 전부 선택 입력)
  author?: string;
  authorRole?: string;
  contact?: string;
  // 케이스스터디: 문제 — 과정 — 결과
  caseProblem?: string;
  caseProcess?: string;
  caseResult?: string;
}
