'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight, Sparkles, Upload, Palette, Share2, BarChart3, Globe, MousePointer2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { Reveal } from '@/components/site/Reveal';
import { CreatorOrbit } from '@/components/site/CreatorOrbit';
import { Proof } from '@/components/site/Proof';
import { TEMPLATES } from '@/lib/templates';

const HeroScene = dynamic(() => import('@/components/3d/HeroScene').then((m) => m.HeroScene), {
  ssr: false,
  loading: () => <div className="grid h-[420px] place-items-center text-sm text-fog md:h-[520px]">3D 씬 준비 중…</div>,
});

const STEPS = [
  { n: '01', title: '사진 올리기', desc: '좋은 사진 가이드를 따라 한 장 올리세요. 형식과 해상도는 자동 검사합니다.' },
  { n: '02', title: 'AI 변환', desc: '깊이 추정부터 텍스처링까지 몇 분 안에 3D 모델 완성. 마음에 안 들면 재생성.' },
  { n: '03', title: '꾸미고 공유', desc: '템플릿을 입히고 링크 하나로 공개. 누가 봤는지 분석까지 따라옵니다.' },
];

const TIERS = [
  { name: 'Free', price: '$0', desc: '가볍게 체험하기 · 월 3회 변환', cta: '무료로 시작', hot: false },
  { name: 'Pro', price: '$19', desc: '본격 포트폴리오용 · 월 20회 변환', cta: 'Pro 시작하기', hot: true },
  { name: 'Studio', price: '$39', desc: '팀과 클라이언트용 · 월 100회 변환', cta: 'Studio 시작하기', hot: false },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-clip bg-ink text-mist">
      <Navbar />

      {/* ---------- HERO: split, fits viewport ---------- */}
      <section className="relative px-4 pt-24 md:px-8">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-[-200px] top-24 h-[480px] w-[480px] rounded-full bg-primary/15 blur-[140px]" />
        </div>

        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:min-h-[calc(100dvh-6rem)] lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-5">
            <div className="animate-rise">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-raised px-4 py-1.5 text-[13px] font-semibold text-fog">
                <Sparkles className="size-3.5 text-primary" />
                AI 3D 포트폴리오 · 베타 오픈
              </span>
            </div>
            <div className="animate-rise [animation-delay:90ms]">
              <h1 className="mt-6 text-4xl leading-[1.12] font-extrabold tracking-tight text-balance md:text-5xl lg:text-6xl">
                사진을<br />
                <span className="text-primary">3D 포트폴리오</span>로
              </h1>
            </div>
            <div className="animate-rise [animation-delay:180ms]">
              <p className="mt-5 max-w-md text-base leading-relaxed text-fog md:text-lg">
                사진을 올리면 AI가 3D로 바꾸고, 템플릿이 포트폴리오로 완성합니다.
              </p>
            </div>
            <div className="animate-rise [animation-delay:270ms]">
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/auth/signup">
                  <Button size="lg" className="w-full sm:w-auto">무료로 시작 <ArrowRight className="size-4" /></Button>
                </Link>
                <Link href="/demo">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">데모 체험</Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="animate-rise [animation-delay:220ms] lg:col-span-7">
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl border border-line bg-panel shadow-lift">
                <div className="flex items-center justify-between border-b border-line px-5 py-3">
                  <div className="flex gap-1.5">
                    <span className="size-2.5 rounded-full bg-red-400/70" />
                    <span className="size-2.5 rounded-full bg-amber-400/70" />
                    <span className="size-2.5 rounded-full bg-emerald-400/70" />
                  </div>
                  <p className="text-xs font-medium text-fog">실시간 렌더 · WebGL</p>
                </div>
                <HeroScene />
              </div>
              <div className="absolute -bottom-4 left-6 z-10 flex animate-float items-center gap-2 rounded-full border border-line bg-raised/95 py-2 pr-4 pl-3 shadow-card backdrop-blur">
                <MousePointer2 className="size-3.5 text-primary" />
                <p className="text-xs font-semibold">마우스를 올려보세요 — 시점이 따라옵니다</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- PROOF: before/after reveal ---------- */}
      <Proof />

      {/* ---------- HOW: editorial rows ---------- */}
      <section id="how" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 md:px-8 md:py-28">
        <Reveal>
          <h2 className="max-w-xl text-3xl font-extrabold tracking-tight md:text-4xl">세 단계면 충분합니다</h2>
        </Reveal>
        <div className="mt-10 border-t border-line">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 80}>
              <div className="grid gap-2 border-b border-line py-8 md:grid-cols-[100px_1fr_1.4fr] md:items-baseline md:gap-6">
                <p className="font-mono text-sm font-bold text-primary">{s.n}</p>
                <h3 className="text-xl font-bold md:text-2xl">{s.title}</h3>
                <p className="max-w-xl leading-relaxed text-fog">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- FEATURES: asymmetric bento ---------- */}
      <section id="features" className="mx-auto max-w-7xl scroll-mt-20 px-4 pb-20 md:px-8 md:pb-28">
        <Reveal>
          <p className="text-[11px] font-bold tracking-[0.18em] text-primary uppercase">Features</p>
          <h2 className="mt-3 max-w-xl text-3xl font-extrabold tracking-tight md:text-4xl">포트폴리오에 필요한 모든 것</h2>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-6">
          <Reveal className="md:col-span-4">
            <Card className="flex h-full flex-col justify-between gap-8 overflow-hidden border-primary/30 bg-gradient-to-br from-primary/[0.12] via-raised to-raised transition-transform duration-300 ease-emph hover:-translate-y-1">
              <div>
                <span className="grid size-11 place-items-center rounded-xl bg-white/5 text-mist"><Upload className="size-5" /></span>
                <h3 className="mt-4 text-xl font-bold md:text-2xl">사진 한 장, 회전하는 포트폴리오</h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-fog">깊이 추정 · 메시 생성 · 텍스처링이 자동으로 이어집니다. 마음에 안 들면 한 번 더 생성하세요.</p>
              </div>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <p className="font-mono text-2xl font-bold tracking-tight text-mist md:text-3xl">JPG <span className="text-primary">→</span> GLB</p>
                <Link href="/demo" className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:gap-2">
                  데모 체험 <ArrowRight className="size-4" />
                </Link>
              </div>
            </Card>
          </Reveal>
          <Reveal delay={100} className="md:col-span-2">
            <Card className="h-full transition-transform duration-300 ease-emph hover:-translate-y-1">
              <span className="grid size-11 place-items-center rounded-xl bg-white/5 text-mist"><Palette className="size-5" /></span>
              <h3 className="mt-4 text-xl font-bold">5종 템플릿</h3>
              <p className="mt-2 text-sm leading-relaxed text-fog">클릭 한 번으로 포트폴리오 전체 무드가 바뀝니다.</p>
              <div className="mt-4 flex gap-2">
                {TEMPLATES.map((t) => (
                  <span key={t.id} title={t.name} className="size-6 rounded-full border border-line" style={{ background: t.theme.accent }} />
                ))}
              </div>
            </Card>
          </Reveal>
          <Reveal className="md:col-span-2">
            <Card className="h-full transition-transform duration-300 ease-emph hover:-translate-y-1">
              <span className="grid size-11 place-items-center rounded-xl bg-white/5 text-mist"><Share2 className="size-5" /></span>
              <h3 className="mt-4 text-xl font-bold">링크 하나로 공유</h3>
              <p className="mt-2 text-sm leading-relaxed text-fog">게시하면 고유 URL 발급. 커스텀 도메인 연결 지원.</p>
            </Card>
          </Reveal>
          <Reveal delay={100} className="md:col-span-2">
            <Card className="h-full transition-transform duration-300 ease-emph hover:-translate-y-1">
              <span className="grid size-11 place-items-center rounded-xl bg-white/5 text-mist"><BarChart3 className="size-5" /></span>
              <h3 className="mt-4 text-xl font-bold">조회 분석</h3>
              <p className="mt-2 text-sm leading-relaxed text-fog">누가 얼마나 봤는지 한눈에. Studio에서 상세 분석.</p>
            </Card>
          </Reveal>
          <Reveal delay={200} className="md:col-span-2">
            <Card className="h-full transition-transform duration-300 ease-emph hover:-translate-y-1">
              <span className="grid size-11 place-items-center rounded-xl bg-white/5 text-mist"><Globe className="size-5" /></span>
              <h3 className="mt-4 text-xl font-bold">한국어 네이티브</h3>
              <p className="mt-2 text-sm leading-relaxed text-fog">카카오 · 네이버 로그인, 토스페이먼츠 결제 지원.</p>
            </Card>
          </Reveal>
        </div>
      </section>

      {/* ---------- CREATORS: scroll orbit ---------- */}
      <CreatorOrbit />

      {/* ---------- TEMPLATES: catalog ---------- */}
      <section id="templates" className="border-y border-line bg-panel/40">
        <div className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 md:px-8 md:py-28">
          <Reveal>
            <h2 className="max-w-xl text-3xl font-extrabold tracking-tight md:text-4xl">취향대로 고르세요</h2>
            <p className="mt-3 max-w-lg text-fog">에디터에서 원클릭 전환. 아래는 실제 테마 색상입니다.</p>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TEMPLATES.map((t, i) => (
              <Reveal key={t.id} delay={(i % 3) * 100}>
                <div className="group overflow-hidden rounded-2xl border border-line bg-raised transition-transform duration-300 ease-emph hover:-translate-y-1 hover:border-primary/50">
                  <div className="h-28 p-5" style={{ background: t.theme.background }}>
                    <div className="h-3 w-2/5 rounded-full" style={{ background: t.theme.accent }} />
                    <div className="mt-2 h-3 w-3/5 rounded-full opacity-50" style={{ background: t.theme.muted }} />
                    <div className="mt-2 h-8 w-24 rounded-lg" style={{ background: t.theme.accent }} />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold">{t.name}</h3>
                    <p className="mt-1 text-sm text-fog">{t.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
            <Reveal delay={200}>
              <Link href="/auth/signup" className="grid h-full min-h-[220px] place-items-center rounded-2xl border border-dashed border-line p-5 text-center transition-colors hover:border-primary hover:bg-primary/5">
                <span>
                  <span className="mx-auto grid size-11 place-items-center rounded-xl bg-primary/15 text-primary"><Sparkles className="size-5" /></span>
                  <span className="mt-3 block font-bold">에디터에서 직접 체험</span>
                  <span className="mt-1 block text-sm text-fog">가입 후 1분 안에 첫 포트폴리오</span>
                </span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- PRICING: rows, not cards ---------- */}
      <section id="pricing" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 md:px-8 md:py-28">
        <Reveal>
          <h2 className="max-w-xl text-3xl font-extrabold tracking-tight md:text-4xl">작게 시작하고, 커지면 올리세요</h2>
        </Reveal>
        <Reveal delay={100}>
          <div className="mt-10 overflow-hidden rounded-2xl border border-line">
            {TIERS.map((p) => (
              <div
                key={p.name}
                className={`grid items-center gap-3 px-6 py-6 md:grid-cols-[1fr_1fr_1.4fr_auto] md:gap-6 ${p.hot ? 'border-y border-primary/40 bg-primary/[0.07]' : 'border-b border-line last:border-b-0'}`}
              >
                <p className="flex items-center gap-2 font-bold">
                  {p.name}
                  {p.hot && <span className="rounded-full bg-primary-deep px-2.5 py-0.5 text-[11px] font-bold text-white">인기</span>}
                </p>
                <p className="text-3xl font-extrabold tracking-tight">{p.price}<span className="text-sm font-medium text-fog">/월</span></p>
                <p className="text-sm text-fog">{p.desc}</p>
                <Link href="/pricing">
                  <Button variant={p.hot ? 'primary' : 'outline'} className="w-full md:w-auto">{p.cta}</Button>
                </Link>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ---------- FINAL: manifesto ---------- */}
      <section className="px-4 pb-20 md:px-8 md:pb-28">
        <Reveal className="mx-auto max-w-5xl">
          <div className="rounded-3xl border border-line bg-panel px-6 py-16 text-center md:py-24">
            <h2 className="mx-auto max-w-xl text-3xl font-extrabold tracking-tight text-balance md:text-5xl">
              다음 면접,<br />링크 하나로 끝내세요
            </h2>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/auth/signup">
                <Button size="lg" className="w-full sm:w-auto">무료로 시작 <ArrowRight className="size-4" /></Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">데모 체험</Button>
              </Link>
            </div>
            <p className="mt-5 text-sm text-fog">카드 등록 없음 · 월 3회 무료</p>
          </div>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}
