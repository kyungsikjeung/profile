'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BeforeAfter } from './BeforeAfter';
import { Reveal } from './Reveal';
import { Button } from '@/components/ui/Button';

/*
 * ASSET SLOTS (CG 디렉터 규격 — 실사 스틸 확보 시 교체):
 * - before: WebP 1600px, 크리에이터 작업 사진 (현재 picsum 플레이스홀더)
 * - after: WebP 1600px, 동일 작품의 3D 변환 결과 렌더
 */

// TODO: 실사 Before 스틸 (WebP 1600px)로 교체
const BEFORE_SRC = 'https://picsum.photos/seed/portfolio-proof/1200/800';

/** 증명 섹션: Before(원본 사진) → After(3D 포트폴리오) 드래그 리빌. */
export function Proof() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
      <Reveal>
        <h2 className="max-w-xl text-3xl font-extrabold tracking-tight text-balance md:text-4xl">
          사진과 3D, 직접 겹쳐보세요
        </h2>
        <p className="mt-3 max-w-lg text-fog">
          핸들을 좌우로 밀어보세요. 같은 작품이 3D 공간에서 어떻게 살아나는지 확인하세요.
        </p>
      </Reveal>

      <Reveal delay={120}>
        <BeforeAfter
          className="mt-10 aspect-[3/2] w-full"
          beforeLabel="BEFORE · 원본"
          afterLabel="AFTER · 3D"
          before={
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={BEFORE_SRC}
              alt="변환 전 원본 사진 예시"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          }
          after={
            <div className="grid h-full w-full place-items-center overflow-hidden bg-[#0b0b12] p-6 md:p-10">
              <div
                className="w-full max-w-md rounded-2xl border border-line bg-raised p-6 shadow-lift"
                style={{ transform: 'perspective(900px) rotateY(-14deg) rotateX(4deg)' }}
              >
                <div className="h-3 w-2/5 rounded-full bg-primary" />
                <div className="mt-2 h-3 w-3/5 rounded-full bg-white/20" />
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-lg"
                      style={{
                        background: `linear-gradient(135deg, #6366f1 ${i * 18}%, #1c1c26 ${i * 18}%)`,
                        transform: `translateZ(${i * 28}px)`,
                      }}
                    />
                  ))}
                </div>
                <p className="mt-4 font-mono text-xs text-fog">drag to rotate · scroll to zoom</p>
              </div>
            </div>
          }
        />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-fog/70">예시 이미지입니다 · 실제 결과물은 아래 데모에서 확인하세요</p>
          <Link href="/demo">
            <Button variant="outline" size="sm">내 사진으로 체험 <ArrowRight className="size-3.5" /></Button>
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
