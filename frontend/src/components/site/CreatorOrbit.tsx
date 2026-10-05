'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { CREATORS, HONEST_NOTE, type Creator } from '@/data/creators';
import { Reveal } from './Reveal';

gsap.registerPlugin(ScrollTrigger);

function CreatorCard({ creator, index }: { creator: Creator; index: number }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-line bg-raised p-6 shadow-lift md:p-7">
      <div className="flex items-center justify-between">
        <span className="rounded-full border border-line bg-white/5 px-2.5 py-1 text-[11px] font-bold text-fog">
          예시 프로필
        </span>
        <span className="font-mono text-xs font-bold text-primary">0{index + 1}</span>
      </div>

      <div className="mt-5 flex items-center gap-4">
        <span
          className="grid size-16 shrink-0 place-items-center rounded-full text-xl font-extrabold text-white"
          style={{ background: creator.themeAccent }}
          aria-hidden
        >
          {creator.initials[0]}
        </span>
        <div>
          <h3 className="text-2xl font-extrabold tracking-tight">{creator.name}</h3>
          <p className="text-sm font-semibold text-fog">{creator.role}</p>
        </div>
      </div>

      <p className="mt-4 text-[15px] leading-relaxed">{creator.tagline}</p>

      <div className="mt-5 border-t border-line pt-4">
        <p className="mb-2 text-[11px] font-bold tracking-widest text-fog uppercase">이력</p>
        <ul className="space-y-2">
          {creator.career.map((c) => (
            <li key={`${c.period}-${c.company}`} className="flex items-baseline gap-3 text-[13px]">
              <span className="shrink-0 font-mono text-[11px] text-fog">{c.period}</span>
              <span className="truncate">
                <span className="font-semibold text-mist">{c.company}</span>
                <span className="text-fog"> · {c.role}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 flex gap-2 pt-1">
        <Link href="/auth/signup" className="flex-1">
          <span className="block rounded-xl bg-primary-deep px-4 py-2.5 text-center text-sm font-bold text-white transition-colors hover:bg-indigo-700">
            무료로 시작
          </span>
        </Link>
        <Link
          href="/demo"
          className="inline-flex items-center gap-1 rounded-xl border border-line px-4 py-2.5 text-sm font-bold text-mist transition-colors hover:border-primary"
        >
          데모 체험 <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </article>
  );
}

/**
 * 스크롤-궤도 크리에이터 쇼케이스.
 * 데스크탑(Orbit on): 섹션 핀 + scrub으로 6장이 한 장씩 정면(rotateY 0)에
 * 멈추는 턴테이블. 그 외: 정적 그리드. transform/opacity만 사용.
 */
export function CreatorOrbit() {
  const sectionRef = useRef<HTMLElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLElement[]>([]);
  const [orbitOn, setOrbitOn] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    const weakCpu = (navigator.hardwareConcurrency ?? 8) <= 4;
    if (mq.matches && !reduce && !saveData && !weakCpu) setOrbitOn(true);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!orbitOn || !section) return;
    const cards = cardRefs.current.filter(Boolean);
    if (cards.length === 0) return;

    let removeKey: (() => void) | undefined;
    const ctx = gsap.context(() => {
      gsap.set(cards, { xPercent: -50, yPercent: -50 });
      cards.forEach((card, i) => {
        gsap.set(
          card,
          i === 0
            ? { rotateY: 0, z: 0, opacity: 1, scale: 1 }
            : { rotateY: 38, z: -140, opacity: 0, scale: 0.92 },
        );
      });

      const STEP = 2.2;
      const total = (cards.length - 1) * STEP + 2;
      // 각 카드가 정면을 향하는 순간 (스냅 포인트)
      const frontPoints = [0.85, ...cards.slice(1).map((_, k) => (k + 1) * STEP + 1)].map(
        (t) => t / total,
      );
      const nearest = (v: number) =>
        frontPoints.reduce((a, b) => (Math.abs(b - v) < Math.abs(a - v) ? b : a));
      const tl = gsap.timeline({
        defaults: { ease: 'power1.out' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=400%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          snap: {
            snapTo: (v: number) => nearest(v),
            duration: 0.35,
            ease: 'power1.out',
          },
        },
      });

      const goStep = (dir: 1 | -1) => {
        const st = tl.scrollTrigger;
        if (!st) return;
        const cur = nearest(st.progress);
        let idx = frontPoints.indexOf(cur) + dir;
        idx = Math.max(0, Math.min(frontPoints.length - 1, idx));
        window.scrollTo({ top: st.start + frontPoints[idx] * (st.end - st.start), behavior: 'smooth' });
      };
      const onKey = (e: KeyboardEvent) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
        const st = tl.scrollTrigger;
        if (!st) return;
        const y = window.scrollY;
        if (y < st.start - 1 || y > st.end + 1) return; // 핀 구간 밖에서는 기본 스크롤 유지
        e.preventDefault();
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goStep(1);
        else goStep(-1);
      };
      window.addEventListener('keydown', onKey);
      removeKey = () => window.removeEventListener('keydown', onKey);

      const setNum = (n: number) => {
        const el = numRef.current;
        if (!el) return;
        el.textContent = `0${n + 1}`;
        gsap.fromTo(el, { opacity: 0.15 }, { opacity: 1, duration: 0.3, overwrite: 'auto' });
      };

      cards.forEach((card, i) => {
        const at = i * STEP;
        if (i === 0) {
          tl.to(card, { opacity: 1, scale: 1, duration: 1.7 }, 0);
          tl.to(card, { rotateY: -38, z: -140, opacity: 0, scale: 0.92, duration: 1 }, 1.7);
        } else {
          tl.call(() => setNum(i), [], at);
          tl.to(card, { rotateY: 0, z: 0, opacity: 1, scale: 1, duration: 1 }, at);
          tl.to(card, { rotateY: 0, z: 0, opacity: 1, scale: 1, duration: 0.7 }, at + 1);
          if (i < cards.length - 1) {
            tl.to(card, { rotateY: -38, z: -140, opacity: 0, scale: 0.92, duration: 1 }, at + 1.7);
          }
        }
      });

      if (barRef.current) {
        tl.fromTo(barRef.current, { scaleX: 0 }, { scaleX: 1, duration: total, ease: 'none' }, 0);
      }
    }, section);

    return () => {
      removeKey?.();
      ctx.revert();
    };
  }, [orbitOn]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden border-y border-line bg-panel/40">
      {orbitOn ? (
        <div className="mx-auto flex h-screen max-w-7xl flex-col justify-center px-4 pt-16 md:px-8">
          <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight text-balance md:text-4xl">
            스크롤할 때마다, 한 사람의 무대가 열린다
          </h2>
          <p className="mt-2 text-sm text-fog">
            여섯 직군, 여섯 개의 3D 포트폴리오 · <span className="text-fog/70">{HONEST_NOTE}</span>
          </p>
          <div className="relative min-h-0 flex-1 [perspective:1400px]">
            <span
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[11rem] leading-none font-extrabold tracking-tighter text-white/[0.045] select-none"
            >
              <span ref={numRef}>01</span>
            </span>
            <div className="absolute inset-0 [transform:rotateX(4deg)] [transform-style:preserve-3d]">
              {CREATORS.map((c, i) => (
                <div
                  key={c.id}
                  ref={(el) => {
                    if (el) cardRefs.current[i] = el;
                  }}
                  className="absolute top-1/2 left-1/2 w-[320px] opacity-0 md:w-[380px]"
                >
                  <CreatorCard creator={c} index={i} />
                </div>
              ))}
            </div>
            <div className="absolute bottom-1 left-1/2 h-px w-40 -translate-x-1/2 bg-line">
              <div ref={barRef} className="h-full w-full origin-left bg-primary" />
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <Reveal>
            <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight text-balance md:text-4xl">
              스크롤할 때마다, 한 사람의 무대가 열린다
            </h2>
            <p className="mt-3 max-w-xl text-fog">여섯 직군, 여섯 개의 3D 포트폴리오. 당신도 다음 무대의 주인공입니다.</p>
            <p className="mt-2 text-xs text-fog/70">{HONEST_NOTE}</p>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {CREATORS.map((c, i) => (
              <Reveal key={c.id} delay={(i % 2) * 80}>
                <CreatorCard creator={c} index={i} />
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
