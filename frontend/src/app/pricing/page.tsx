'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check } from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Navbar } from '@/components/site/Navbar';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/useAuth';

const PLANS = [
  { id: 'free', name: 'Free', price: '$0', credits: '월 3회 변환', features: ['3개 프로젝트', '워터마크 포함', '기본 템플릿'], cta: '무료로 시작' },
  { id: 'pro', name: 'Pro', price: '$19', credits: '월 20회 변환', features: ['무제한 프로젝트', '워터마크 제거', '커스텀 도메인'], cta: 'Pro 시작하기' },
  { id: 'studio', name: 'Studio', price: '$39', credits: '월 100회 변환', features: ['Pro 전부 포함', '우선 렌더링', '팀 협업 + 분석'], cta: 'Studio 시작하기' },
];

/** 요금제 (FR-033~035). 결제는 목업 세션 → 실연동 시 Stripe/Toss로 교체. */
export default function PricingPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [pending, setPending] = useState<{ session_id: string; plan: string; amount_usd: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const start = async (plan: string) => {
    if (plan === 'free' || !user) {
      router.push('/auth/signup');
      return;
    }
    setError(null);
    try {
      const s = (await api.createCheckout(plan)) as { session_id: string; plan: string; amount_usd: number };
      setPending(s);
    } catch (e) {
      setError(e instanceof Error ? e.message : '결제 세션 생성 실패');
    }
  };

  const confirm = async () => {
    if (!pending) return;
    try {
      await api.confirmCheckout(pending.session_id);
      router.push('/dashboard');
    } catch (e) {
      setError(e instanceof Error ? e.message : '결제 승인 실패');
    }
  };

  return (
    <main className="min-h-screen bg-ink text-mist">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 pt-28 pb-16 md:px-8">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-fog transition-colors hover:text-mist">
          <ArrowLeft className="size-4" /> 홈으로
        </Link>
        <h1 className="mt-4 text-center text-3xl font-extrabold tracking-tight md:text-4xl">요금제</h1>
        <p className="mt-2 text-center text-fog">연간 결제 20% 할인 · 결제는 현재 목업으로 동작합니다</p>

        {error && <p role="alert" className="mt-4 text-center font-medium text-red-400">{error}</p>}

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {PLANS.map((p) => (
            <Card
              key={p.id}
              className={clsx(
                'relative flex flex-col transition-transform duration-300 ease-emph hover:-translate-y-1',
                p.id === 'pro' && 'border-primary/60',
              )}
            >
              {p.id === 'pro' && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-deep px-3 py-1 text-xs font-bold whitespace-nowrap text-white">
                  가장 인기
                </span>
              )}
              <h2 className="text-lg font-extrabold">{p.name}</h2>
              <p className="mt-1 text-3xl font-extrabold tracking-tight">{p.price}<span className="text-sm font-medium text-fog">/월</span></p>
              <p className="mt-1 text-sm font-semibold text-primary">{p.credits}</p>
              <ul className="mt-4 mb-6 flex-1 space-y-2 text-sm text-fog">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" />{f}
                  </li>
                ))}
              </ul>
              <Button variant={p.id === 'free' ? 'outline' : 'primary'} className="w-full" onClick={() => start(p.id)}>
                {p.cta}
              </Button>
            </Card>
          ))}
        </div>

        {pending && (
          <Card className="mt-6 border-primary/40">
            <p className="font-bold">목업 결제 확인</p>
            <p className="mt-1 mb-4 text-sm text-fog">
              {pending.plan} 플랜 · ${pending.amount_usd} · 세션 {pending.session_id.slice(0, 8)}… (실연동 시 PG 결제창이 열립니다)
            </p>
            <div className="flex gap-2">
              <Button onClick={confirm}>결제 승인 (목업)</Button>
              <Button variant="outline" onClick={() => setPending(null)}>취소</Button>
            </div>
          </Card>
        )}
      </div>
    </main>
  );
}
