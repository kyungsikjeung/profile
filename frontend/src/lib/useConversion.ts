'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import type { ConversionState } from '@/types';

export type Step = 'idle' | 'converting' | 'done' | 'failed';

interface Snapshot {
  step: Step;
  progress: number;
  stage: string;
  resultUrl?: string;
  provider: string;
  error: string | null;
  jobId: string | null;
}

/** 변환 요청 → 폴링 → 완료 공유 훅 (데모·에디터 공용). */
export function useConversion() {
  const [snap, setSnap] = useState<Snapshot>({
    step: 'idle',
    progress: 0,
    stage: 'queued',
    provider: 'mock',
    error: null,
    jobId: null,
  });
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = null;
  }, []);

  useEffect(() => stop, [stop]);

  const poll = useCallback(
    (id: string) => {
      stop();
      pollRef.current = setInterval(async () => {
        try {
          const s = (await api.conversionStatus(id)) as {
            status: ConversionState;
            progress: number;
            stage: string;
            result_url: string;
            error: string;
            provider: string;
          };
          if (s.status === 'done') {
            stop();
            setSnap({ step: 'done', progress: 100, stage: s.stage, resultUrl: s.result_url || undefined, provider: s.provider, error: null, jobId: id });
          } else if (s.status === 'failed') {
            stop();
            setSnap((prev) => ({ ...prev, step: 'failed', error: s.error || '변환에 실패했습니다' }));
          } else {
            setSnap((prev) => ({ ...prev, step: 'converting', progress: s.progress, stage: s.stage, provider: s.provider }));
          }
        } catch (e) {
          stop();
          setSnap((prev) => ({ ...prev, step: 'failed', error: e instanceof Error ? e.message : '상태 조회 실패' }));
        }
      }, 2000);
    },
    [stop],
  );

  const start = useCallback(
    async (imageUrls: string[], projectId?: string) => {
      setSnap({ step: 'converting', progress: 0, stage: 'queued', provider: 'mock', error: null, jobId: null });
      try {
        const job = (await api.createConversion(imageUrls, projectId)) as { job_id: string };
        setSnap((prev) => ({ ...prev, jobId: job.job_id }));
        poll(job.job_id);
      } catch (e) {
        setSnap({ step: 'failed', progress: 0, stage: 'queued', provider: 'mock', error: e instanceof Error ? e.message : '변환 요청 실패', jobId: null });
      }
    },
    [poll],
  );

  const regenerate = useCallback(async () => {
    const id = snap.jobId;
    if (!id) return;
    setSnap((prev) => ({ ...prev, step: 'converting', progress: 0, stage: 'queued', error: null }));
    try {
      const job = (await api.regenerate(id)) as { job_id: string };
      setSnap((prev) => ({ ...prev, jobId: job.job_id }));
      poll(job.job_id);
    } catch (e) {
      setSnap((prev) => ({ ...prev, step: 'failed', error: e instanceof Error ? e.message : '재생성 실패' }));
    }
  }, [snap.jobId, poll]);

  const reset = useCallback(() => {
    stop();
    setSnap({ step: 'idle', progress: 0, stage: 'queued', provider: 'mock', error: null, jobId: null });
  }, [stop]);

  return { ...snap, start, regenerate, reset };
}
