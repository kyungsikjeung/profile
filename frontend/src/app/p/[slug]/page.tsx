'use client';

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';
import { api, resolveModelUrl } from '@/lib/api';
import { getTemplate, type SceneConfig } from '@/lib/templates';
import type { Project } from '@/types';

const ModelViewer = dynamic(() => import('@/components/3d/ModelViewer').then((m) => m.ModelViewer), {
  ssr: false,
  loading: () => <p className="py-16 text-center text-sm">3D 뷰어 로딩 중…</p>,
});

const CASE_ROWS = [
  { n: '01', title: '문제', key: 'caseProblem' },
  { n: '02', title: '과정', key: 'caseProcess' },
  { n: '03', title: '결과', key: 'caseResult' },
] as const;

/**
 * 공개 공유 페이지 (FR-028). 인증 불필요.
 * 6초 스캔 헤더(이름·직무·한줄강점·대표작·연락처) + 문제—과정—결과 구조.
 */
export default function SharedPage() {
  const params = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    api.sharedProject(params.slug)
      .then((p) => setProject(p as Project))
      .catch(() => setFailed(true));
  }, [params.slug]);

  if (failed) {
    return (
      <main className="grid min-h-screen place-items-center bg-ink px-4 text-mist">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold tracking-tight">공유된 포트폴리오를 찾을 수 없습니다</h1>
          <p className="mt-4"><Link href="/" className="font-semibold text-primary hover:underline">← 홈으로</Link></p>
        </div>
      </main>
    );
  }
  if (!project) return <main className="grid min-h-screen place-items-center bg-ink text-fog">불러오는 중…</main>;

  const theme = getTemplate(project.template).theme;
  const scene = (project.scene_config ?? {}) as SceneConfig;
  const caseRows = CASE_ROWS.map((r) => ({ ...r, body: scene[r.key] ?? '' })).filter((r) => r.body.trim() !== '');

  return (
    <main className="min-h-screen" style={{ background: theme.background, color: theme.text }}>
      <div className="mx-auto max-w-4xl px-4 py-14 md:px-8 md:py-20">
        {/* 6초 스캔 헤더 */}
        <p className="mb-3 text-[13px] font-semibold" style={{ color: theme.muted }}>
          Portfolio3D로 제작됨 · {getTemplate(project.template).name} 템플릿
        </p>
        {scene.author && (
          <p className="text-lg font-bold">
            {scene.author}
            {scene.authorRole && <span className="font-medium" style={{ color: theme.muted }}> · {scene.authorRole}</span>}
          </p>
        )}
        <h1 className="mt-1 mb-3 text-4xl font-extrabold tracking-tight text-balance md:text-5xl">{project.title}</h1>
        {project.description && <p className="max-w-2xl text-lg leading-relaxed" style={{ color: theme.muted }}>{project.description}</p>}

        <div className="mt-6 flex flex-wrap gap-3">
          {scene.contact && (
            <a
              href={`mailto:${scene.contact}`}
              className="inline-flex items-center gap-1.5 rounded-xl px-5 py-3 text-sm font-bold text-white"
              style={{ background: theme.accent }}
            >
              <Mail className="size-4" /> 연락하기
            </a>
          )}
        </div>

        {/* 대표작 3D */}
        <div className="mt-10 overflow-hidden rounded-2xl" style={{ background: scene.bgColor ?? getTemplate(project.template).lighting.background }}>
          <ModelViewer url={resolveModelUrl(scene.modelUrl)} />
        </div>

        {/* 케이스스터디: 문제 — 과정 — 결과 */}
        {caseRows.length > 0 && (
          <div className="mt-12 border-t" style={{ borderColor: theme.muted + '44' }}>
            {caseRows.map((r) => (
              <div key={r.key} className="grid gap-1 border-b py-6 md:grid-cols-[80px_1fr] md:gap-6" style={{ borderColor: theme.muted + '44' }}>
                <p className="font-mono text-sm font-bold" style={{ color: theme.accent }}>{r.n}</p>
                <div>
                  <h2 className="text-xl font-bold">{r.title}</h2>
                  <p className="mt-1 max-w-2xl leading-relaxed" style={{ color: theme.muted }}>{r.body}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-xl px-6 py-3.5 font-semibold text-white transition-transform duration-200 active:scale-[0.98]"
            style={{ background: theme.accent }}
          >
            나도 만들어보기 <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
