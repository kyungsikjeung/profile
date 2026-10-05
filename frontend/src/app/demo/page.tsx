'use client';

import dynamic from 'next/dynamic';
import { useCallback, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';
import { UploadDropzone } from '@/components/UploadDropzone';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Navbar } from '@/components/site/Navbar';
import { api, resolveModelUrl } from '@/lib/api';
import { useConversion } from '@/lib/useConversion';

const ModelViewer = dynamic(() => import('@/components/3d/ModelViewer').then((m) => m.ModelViewer), {
  ssr: false,
  loading: () => <p className="py-16 text-center text-sm text-fog">3D 뷰어 로딩 중…</p>,
});

const STAGE_LABEL: Record<string, string> = {
  queued: '대기 중',
  depth_estimation: '깊이 추정 중',
  mesh_generation: '메시 생성 중',
  texturing: '텍스처링 중',
  done: '완료',
};

const STEPS = ['업로드', 'AI 변환', '미리보기'];

/** 가입 불필요 데모 체험 (UX-001). 업로드 → 변환 → 미리보기. */
export default function DemoPage() {
  const conv = useConversion();
  const [preview, setPreview] = useState<string | undefined>();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFiles = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;
      setUploadError(null);
      setUploading(true);
      setPreview(URL.createObjectURL(files[0]));
      try {
        const up = (await api.uploadImage(files[0])) as { files: { url: string }[] };
        await conv.start(up.files.map((f) => f.url));
      } catch (e) {
        setUploadError(e instanceof Error ? e.message : '업로드 실패. 백엔드(http://localhost:8000)가 실행 중인지 확인하세요.');
      } finally {
        setUploading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const busy = uploading || conv.step === 'converting';
  const failed = conv.step === 'failed' || uploadError !== null;
  const error = uploadError ?? conv.error;
  const activeStep = conv.step === 'done' ? 2 : conv.step === 'converting' || uploading ? 1 : 0;

  return (
    <main className="min-h-screen bg-ink text-mist">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 pt-28 pb-16 md:px-8">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-fog transition-colors hover:text-mist">
          <ArrowLeft className="size-4" /> 홈으로
        </Link>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-4xl">가입 없이 3D 변환 체험</h1>
        <p className="mt-2 text-fog">사진을 올리면 AI가 3D 모델로 변환합니다. 약 10초 내외 소요.</p>

        <ol className="mt-8 mb-8 flex items-center gap-2" aria-label="진행 단계">
          {STEPS.map((s, i) => (
            <li key={s} className="flex flex-1 items-center gap-2 last:flex-none">
              <span className={clsx(
                'grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold transition-colors',
                i < activeStep ? 'bg-primary text-white' : i === activeStep ? 'bg-primary text-white' : 'bg-raised text-fog',
              )}>
                {i + 1}
              </span>
              <span className={clsx('text-sm font-semibold whitespace-nowrap', i <= activeStep ? 'text-mist' : 'text-fog')}>{s}</span>
              {i < STEPS.length - 1 && <span className="mx-1 h-px flex-1 bg-line" />}
            </li>
          ))}
        </ol>

        {conv.step === 'idle' && !uploading && <UploadDropzone onFiles={handleFiles} maxFiles={1} />}

        {busy && (
          <Card>
            <p className="mb-3 font-semibold">
              {uploading ? '업로드 중…' : `${STAGE_LABEL[conv.stage] ?? conv.stage}… ${conv.progress}%`}
            </p>
            <div className="h-2 overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-500"
                style={{ width: `${uploading ? 5 : Math.max(conv.progress, 5)}%` }}
              />
            </div>
            <p className="mt-3 text-[13px] text-fog">AI가 깊이 추정 → 메시 생성 → 텍스처링을 순서대로 처리합니다</p>
          </Card>
        )}

        {conv.step === 'done' && (
          <div className="grid gap-4">
            <div className="overflow-hidden rounded-2xl border border-line bg-panel">
              <ModelViewer url={resolveModelUrl(conv.resultUrl)} previewImage={preview} />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={conv.regenerate}>다시 생성</Button>
              <Button variant="outline" onClick={() => { conv.reset(); setPreview(undefined); }}>다른 사진으로 체험</Button>
              <Link href="/auth/signup">
                <Button>저장하려면 가입하기 <ArrowRight className="size-4" /></Button>
              </Link>
            </div>
          </div>
        )}

        {failed && !busy && (
          <Card>
            <p role="alert" className="mb-4 font-medium text-red-400">{error}</p>
            <div className="flex gap-3">
              {conv.jobId && !uploadError && <Button onClick={conv.regenerate}>다시 시도</Button>}
              <Button variant="outline" onClick={() => { conv.reset(); setUploadError(null); setPreview(undefined); }}>처음으로</Button>
            </div>
          </Card>
        )}
      </div>
    </main>
  );
}
