'use client';

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Rocket, Save } from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Navbar } from '@/components/site/Navbar';
import { UploadDropzone } from '@/components/UploadDropzone';
import { api, resolveModelUrl } from '@/lib/api';
import { useConversion } from '@/lib/useConversion';
import { TEMPLATES, getTemplate, type SceneConfig } from '@/lib/templates';
import type { Project } from '@/types';

const ModelViewer = dynamic(() => import('@/components/3d/ModelViewer').then((m) => m.ModelViewer), {
  ssr: false,
  loading: () => <p className="py-16 text-center text-sm text-fog">3D 뷰어 로딩 중…</p>,
});

/** 포트폴리오 에디터 (FR-020 기본 커스터마이징: 색상/텍스트/레이아웃=템플릿). */
export default function EditorPage() {
  const params = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [template, setTemplate] = useState('minimal');
  const [scene, setScene] = useState<SceneConfig>({});
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const conv = useConversion();

  // 변환 완료 시 씬에 자동 연결 (백엔드도 DB에 동일 기록)
  useEffect(() => {
    if (conv.step === 'done' && conv.resultUrl) {
      setScene((s) => ({ ...s, modelUrl: conv.resultUrl }));
    }
  }, [conv.step, conv.resultUrl]);

  const handleModelFiles = async (files: File[]) => {
    if (files.length === 0 || !project) return;
    setError(null);
    setUploading(true);
    try {
      const up = (await api.uploadImage(files[0])) as { files: { url: string }[] };
      await conv.start(up.files.map((f) => f.url), project.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : '업로드 실패');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    api.getProject(params.id)
      .then((p) => {
        const proj = p as Project;
        setProject(proj);
        setTitle(proj.title);
        setDescription(proj.description);
        setTemplate(proj.template);
        setScene((proj.scene_config ?? {}) as SceneConfig);
      })
      .catch((e) => setError(e instanceof Error ? e.message : '불러오기 실패'));
  }, [params.id]);

  const theme = getTemplate(template).theme;

  const save = async (publish = false) => {
    setError(null);
    setSaved(false);
    try {
      const updated = (await api.updateProject(params.id, {
        title,
        description,
        template,
        scene_config: scene,
        ...(publish ? { status: 'published' } : {}),
      })) as Project;
      setProject(updated);
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : '저장 실패');
    }
  };

  if (error && !project) {
    return (
      <main className="min-h-screen bg-ink text-mist">
        <Navbar />
        <div className="mx-auto max-w-3xl px-4 pt-32">
          <p role="alert" className="font-medium text-red-400">{error}</p>
          <p className="mt-3"><Link href="/dashboard" className="font-semibold text-primary hover:underline">← 대시보드로</Link></p>
        </div>
      </main>
    );
  }
  if (!project) {
    return (
      <main className="min-h-screen bg-ink text-mist">
        <Navbar />
        <p className="mx-auto max-w-3xl px-4 pt-32 text-fog">불러오는 중…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ink text-mist">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 pt-28 pb-16 md:px-8">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-fog transition-colors hover:text-mist">
          <ArrowLeft className="size-4" /> 대시보드로
        </Link>
        <h1 className="mt-4 mb-8 text-3xl font-extrabold tracking-tight">포트폴리오 편집</h1>

        <div className="grid gap-6 lg:grid-cols-[380px_1fr] lg:items-start">
          <div className="grid content-start gap-4">
            <Card>
              <div className="grid gap-4">
                <Input label="제목" value={title} onChange={(e) => setTitle(e.target.value)} />
                <label className="grid gap-1.5 text-sm">
                  <span className="font-semibold text-mist">소개</span>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="rounded-xl border border-line bg-panel px-4 py-3 text-mist placeholder:text-fog focus:border-primary focus:ring-2 focus:ring-primary/40 focus:outline-none"
                  />
                </label>
              </div>
            </Card>

            <Card>
              <p className="mb-3 font-bold">템플릿</p>
              <div className="grid gap-2">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTemplate(t.id)}
                    className={clsx(
                      'cursor-pointer rounded-xl p-3 text-left transition-transform duration-200 active:scale-[0.99]',
                      template === t.id && 'ring-2 ring-primary ring-offset-2 ring-offset-raised',
                    )}
                    style={{ background: t.theme.background, color: t.theme.text }}
                  >
                    <span className="block text-sm font-bold">{t.name}</span>
                    <span className="block text-xs" style={{ color: t.theme.muted }}>{t.description}</span>
                  </button>
                ))}
              </div>
            </Card>

            <Card>
              <p className="mb-3 font-bold">3D 씬</p>
              <div className="grid gap-4 text-sm">
                <Input
                  label="모델 GLB URL (비우면 플레이스홀더)"
                  value={scene.modelUrl ?? ''}
                  onChange={(e) => setScene({ ...scene, modelUrl: e.target.value })}
                  placeholder="/storage/models/xxx.glb"
                />
                <label className="flex items-center gap-3">
                  배경색
                  <input
                    type="color"
                    value={scene.bgColor ?? getTemplate(template).lighting.background}
                    onChange={(e) => setScene({ ...scene, bgColor: e.target.value })}
                    className="h-9 w-14 cursor-pointer rounded-lg border border-line bg-panel"
                  />
                </label>
                <label className="grid gap-1.5">
                  조명 강도 ({scene.lightIntensity ?? getTemplate(template).lighting.intensity})
                  <input
                    type="range" min={0.2} max={3} step={0.1}
                    value={scene.lightIntensity ?? getTemplate(template).lighting.intensity}
                    onChange={(e) => setScene({ ...scene, lightIntensity: Number(e.target.value) })}
                    className="accent-primary"
                  />
                </label>
                <label className="flex cursor-pointer items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={scene.autoRotate ?? getTemplate(template).lighting.autoRotate}
                    onChange={(e) => setScene({ ...scene, autoRotate: e.target.checked })}
                    className="size-4 accent-primary"
                  />
                  자동 회전
                </label>
              </div>
            </Card>

            <Card>
              <p className="font-bold">프로필 · 케이스스터디</p>
              <p className="mt-1 mb-4 text-[13px] text-fog">공유페이지 6초 스캔 헤더와 문제—과정—결과 블록에 표시됩니다 (선택 입력)</p>
              <div className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="이름" value={scene.author ?? ''} onChange={(e) => setScene({ ...scene, author: e.target.value })} placeholder="김서연" />
                  <Input label="지원 직무" value={scene.authorRole ?? ''} onChange={(e) => setScene({ ...scene, authorRole: e.target.value })} placeholder="UI 디자이너" />
                </div>
                <Input label="연락처" value={scene.contact ?? ''} onChange={(e) => setScene({ ...scene, contact: e.target.value })} placeholder="hello@example.com" />
                <label className="grid gap-1.5 text-sm">
                  <span className="font-semibold text-mist">문제</span>
                  <textarea
                    value={scene.caseProblem ?? ''}
                    onChange={(e) => setScene({ ...scene, caseProblem: e.target.value })}
                    rows={2}
                    placeholder="어떤 문제를 풀었나요?"
                    className="rounded-xl border border-line bg-panel px-4 py-3 text-mist placeholder:text-fog focus:border-primary focus:ring-2 focus:ring-primary/40 focus:outline-none"
                  />
                </label>
                <label className="grid gap-1.5 text-sm">
                  <span className="font-semibold text-mist">과정</span>
                  <textarea
                    value={scene.caseProcess ?? ''}
                    onChange={(e) => setScene({ ...scene, caseProcess: e.target.value })}
                    rows={2}
                    placeholder="어떻게 접근했나요? (협업 역할 포함)"
                    className="rounded-xl border border-line bg-panel px-4 py-3 text-mist placeholder:text-fog focus:border-primary focus:ring-2 focus:ring-primary/40 focus:outline-none"
                  />
                </label>
                <label className="grid gap-1.5 text-sm">
                  <span className="font-semibold text-mist">결과</span>
                  <textarea
                    value={scene.caseResult ?? ''}
                    onChange={(e) => setScene({ ...scene, caseResult: e.target.value })}
                    rows={2}
                    placeholder="숫자로 말하는 임팩트는?"
                    className="rounded-xl border border-line bg-panel px-4 py-3 text-mist placeholder:text-fog focus:border-primary focus:ring-2 focus:ring-primary/40 focus:outline-none"
                  />
                </label>
              </div>
            </Card>

            <Card>
              <p className="font-bold">3D 모델 생성</p>
              <p className="mt-1 mb-4 text-[13px] text-fog">사진 1장을 올리면 변환 후 씬에 자동 연결됩니다 (크레딧 1 차감)</p>
              {conv.step === 'idle' && !uploading && (
                <UploadDropzone onFiles={handleModelFiles} maxFiles={1} />
              )}
              {(uploading || conv.step === 'converting') && (
                <div>
                  <p className="mb-2 text-sm">
                    {uploading ? '업로드 중…' : `변환 중… ${conv.progress}% (${conv.stage})`}
                  </p>
                  <div className="h-2 overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full rounded-full bg-primary transition-[width] duration-500"
                      style={{ width: `${uploading ? 5 : Math.max(conv.progress, 5)}%` }}
                    />
                  </div>
                </div>
              )}
              {conv.step === 'done' && (
                <div className="flex items-center gap-2">
                  <p role="status" className="flex-1 text-sm text-emerald-400">모델이 연결되었습니다. 저장 버튼을 눌러 확정하세요.</p>
                  <Button size="sm" variant="outline" onClick={conv.regenerate}>재생성</Button>
                </div>
              )}
              {conv.step === 'failed' && (
                <div className="flex items-center gap-2">
                  <p role="alert" className="flex-1 text-sm text-red-400">{conv.error}</p>
                  <Button size="sm" variant="outline" onClick={conv.reset}>다시 시도</Button>
                </div>
              )}
            </Card>

            {error && <p role="alert" className="text-sm font-medium text-red-400">{error}</p>}
            {saved && <p role="status" className="text-sm font-medium text-emerald-400">저장되었습니다</p>}
            <div className="flex gap-2">
              <Button onClick={() => save(false)}><Save className="size-4" /> 저장</Button>
              <Button variant="outline" onClick={() => save(true)}><Rocket className="size-4" /> 게시하기</Button>
            </div>
            {project.share_slug && (
              <p className="text-sm text-fog">
                공유 링크: <Link href={`/p/${project.share_slug}`} className="font-semibold text-primary hover:underline">/p/{project.share_slug}</Link>
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-line p-6 self-start md:p-8 lg:sticky lg:top-24" style={{ background: theme.background, color: theme.text }}>
            <p className="mb-2 text-[13px] font-medium" style={{ color: theme.muted }}>실시간 미리보기 · {getTemplate(template).name}</p>
            <h2 className="mb-2 text-3xl font-extrabold tracking-tight text-balance">{title || '제목 없음'}</h2>
            <p className="mb-6" style={{ color: theme.muted }}>{description || '소개를 입력하세요'}</p>
            <div className="overflow-hidden rounded-xl" style={{ background: scene.bgColor ?? getTemplate(template).lighting.background }}>
              <ModelViewer url={resolveModelUrl(scene.modelUrl)} />
            </div>
            <span className="mt-6 inline-block rounded-xl px-6 py-3 font-bold text-white" style={{ background: theme.accent }}>
              연락하기
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
