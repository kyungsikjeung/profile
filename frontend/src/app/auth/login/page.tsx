'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Navbar } from '@/components/site/Navbar';
import { useAuthStore } from '@/store/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { login, loading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인 실패');
    }
  };

  return (
    <main className="min-h-screen bg-ink text-mist">
      <Navbar />
      <div className="relative mx-auto max-w-md px-4 pt-32 pb-16 md:px-8">
        <div aria-hidden className="pointer-events-none absolute top-16 left-1/2 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/15 blur-[100px]" />
        <Card>
          <h1 className="text-2xl font-extrabold tracking-tight">로그인</h1>
          <p className="mt-1 mb-6 text-sm text-fog">다시 오신 것을 환영합니다</p>
          <form onSubmit={submit} className="grid gap-4">
            <Input label="이메일" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input label="비밀번호" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && <p role="alert" className="text-sm font-medium text-red-400">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full">{loading ? '로그인 중…' : '로그인'}</Button>
          </form>
          <p className="mt-5 text-center text-sm text-fog">
            계정이 없으신가요? <Link href="/auth/signup" className="font-semibold text-primary hover:underline">회원가입</Link>
          </p>
        </Card>
      </div>
    </main>
  );
}
