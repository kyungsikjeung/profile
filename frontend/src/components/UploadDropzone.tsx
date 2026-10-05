'use client';

import { useCallback, useRef, useState } from 'react';
import { Check, ImagePlus } from 'lucide-react';
import { clsx } from 'clsx';

const ACCEPT = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 10 * 1024 * 1024;

interface Props {
  onFiles: (files: File[]) => void;
  maxFiles?: number;
}

const TIPS = [
  '정면 · 밝은 조명 · 단순한 배경의 사진이 가장 잘 변환됩니다',
  '권장 해상도 1024px 이상, 피사체가 화면의 60% 이상',
  '유리 · 거울 · 가는 선이 많은 피사체는 품질이 낮을 수 있습니다',
];

/** 사진 업로드 드롭존 (FR-006~008, FR-011 가이드). */
export function UploadDropzone({ onFiles, maxFiles = 8 }: Props) {
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = useCallback(
    (list: FileList | File[]) => {
      const files = Array.from(list).slice(0, maxFiles);
      for (const f of files) {
        if (!ACCEPT.includes(f.type)) {
          setError(`${f.name}: jpg / png / webp만 업로드할 수 있습니다`);
          return;
        }
        if (f.size > MAX_SIZE) {
          setError(`${f.name}: 10MB를 초과할 수 없습니다`);
          return;
        }
      }
      setError(null);
      onFiles(files);
    },
    [maxFiles, onFiles],
  );

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label="사진 업로드 영역"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); validate(e.dataTransfer.files); }}
        className={clsx(
          'cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-200',
          'focus-visible:outline-2 focus-visible:outline-primary',
          drag ? 'border-primary bg-primary/10 scale-[1.01]' : 'border-line bg-panel hover:border-fog/60 hover:bg-raised',
        )}
      >
        <span className={clsx(
          'mx-auto mb-4 grid size-14 place-items-center rounded-2xl transition-colors',
          drag ? 'bg-primary text-white' : 'bg-raised text-primary',
        )}>
          <ImagePlus className="size-6" />
        </span>
        <p className="font-bold">사진을 드래그하거나 클릭하여 업로드</p>
        <p className="mt-1 text-sm text-fog">jpg / png / webp · 장당 10MB 이하 · 최대 {maxFiles}장</p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT.join(',')}
          multiple={maxFiles > 1}
          hidden
          onChange={(e) => e.target.files && validate(e.target.files)}
        />
      </div>
      {error && <p role="alert" className="mt-2 text-sm font-medium text-red-400">{error}</p>}
      <ul className="mt-4 space-y-1.5 text-[13px] leading-relaxed text-fog">
        {TIPS.map((t) => (
          <li key={t} className="flex items-start gap-2">
            <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" />
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
