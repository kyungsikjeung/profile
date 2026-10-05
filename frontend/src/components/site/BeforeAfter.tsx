'use client';

import { useCallback, useRef, useState, type ReactNode } from 'react';
import { ChevronsLeftRight } from 'lucide-react';

interface Props {
  before: ReactNode;
  after: ReactNode;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

/**
 * Before → After 드래그 리빌 (증명·바이럴 겸용 대형 전환).
 * transform/opacity 원칙: 핸들 이동만 transform, 레이어 전환은 clip-path.
 * 키보드 좌우키로 조작 가능. 자동재생 없음.
 */
export function BeforeAfter({ before, after, beforeLabel = 'BEFORE', afterLabel = 'AFTER', className = '' }: Props) {
  const [pos, setPos] = useState(50);
  const track = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const r = track.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(96, Math.max(4, ((clientX - r.left) / r.width) * 100)));
  }, []);

  return (
    <div
      ref={track}
      role="slider"
      tabIndex={0}
      aria-label="원본과 3D 결과 비교 슬라이더"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pos)}
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        setFromClientX(e.clientX);
      }}
      onPointerMove={(e) => {
        if (dragging.current) setFromClientX(e.clientX);
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
      onPointerCancel={() => {
        dragging.current = false;
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') setPos((p) => Math.max(4, p - 4));
        if (e.key === 'ArrowRight') setPos((p) => Math.min(96, p + 4));
      }}
      className={`relative cursor-ew-resize touch-none overflow-hidden rounded-2xl border border-line select-none focus-visible:outline-2 focus-visible:outline-primary ${className}`}
    >
      <div className="absolute inset-0">{after}</div>
      <div
        className="absolute inset-0"
        style={{
          clipPath: `inset(0 ${100 - pos}% 0 0)`,
          maskImage: `linear-gradient(to right, black calc(${pos}% - 28px), transparent ${pos}%)`,
          WebkitMaskImage: `linear-gradient(to right, black calc(${pos}% - 28px), transparent ${pos}%)`,
        }}
      >
        {before}
      </div>

      <span className="absolute top-4 left-4 rounded-full bg-black/60 px-3 py-1 text-[11px] font-bold tracking-widest text-white backdrop-blur">
        {beforeLabel}
      </span>
      <span className="absolute top-4 right-4 rounded-full bg-primary-deep px-3 py-1 text-[11px] font-bold tracking-widest text-white">
        {afterLabel}
      </span>

      <div className="absolute inset-y-0 w-0.5 bg-white/90" style={{ left: `${pos}%` }} aria-hidden>
        <span className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-2 text-ink shadow-lift">
          <ChevronsLeftRight className="size-4" />
        </span>
      </div>
    </div>
  );
}
