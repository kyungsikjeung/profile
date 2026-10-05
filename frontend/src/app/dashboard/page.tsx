'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Pencil, Rocket } from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Navbar } from '@/components/site/Navbar';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/useAuth';
import type { Project } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const { user, fetchMe, logout } = useAuthStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMe().then(async () => {
      try {
        setProjects((await api.listProjects()) as Project[]);
      } catch (e) {
        setError(e instanceof Error ? e.message : '목록 조회 실패');
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const create = async () => {
    if (!title.trim()) return;
    try {
      const p = (await api.createProject({ title: title.trim() })) as Project;
      setProjects((prev) => [p, ...prev]);
      setTitle('');
    } catch (e) {
      setError(e instanceof Error ? e.message : '생성 실패');
    }
  };

  const publish = async (id: string) => {
    try {
      const p = (await api.updateProject(id, { status: 'published' })) as Project;
      setProjects((prev) => prev.map((x) => (x.id === id ? p : x)));
    } catch (e) {
      setError(e instanceof Error ? e.message : '게시 실패');
    }
  };

  return (
    <main className="min-h-screen bg-ink text-mist">
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 pt-28 pb-16 md:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">내 포트폴리오</h1>
            {user && <p className="mt-1 text-sm text-fog">{user.email}</p>}
          </div>
          <div className="flex gap-2">
            <Link href="/demo"><Button variant="outline">3D 변환 체험</Button></Link>
            <Button variant="ghost" onClick={() => { logout(); router.push('/'); }}>로그아웃</Button>
          </div>
        </div>

        {error && <p role="alert" className="mb-4 font-medium text-red-400">{error}</p>}

        <Card>
          <div className="flex gap-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && create()}
              placeholder="새 프로젝트 제목"
              aria-label="새 프로젝트 제목"
              className="min-h-[44px] flex-1 rounded-xl border border-line bg-panel px-4 text-mist placeholder:text-fog focus:border-primary focus:ring-2 focus:ring-primary/40 focus:outline-none"
            />
            <Button onClick={create}><Plus className="size-4" /> 만들기</Button>
          </div>
        </Card>

        <div className="mt-4 grid gap-3">
          {projects.map((p) => (
            <Card key={p.id} className="transition-colors hover:border-fog/40">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 font-bold">
                    <span className="truncate">{p.title}</span>
                    <span className={clsx(
                      'shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold',
                      p.status === 'published' ? 'bg-emerald-400/15 text-emerald-400' : 'bg-white/5 text-fog',
                    )}>
                      {p.status === 'published' ? '게시됨' : '초안'}
                    </span>
                  </p>
                  <p className="mt-1 text-[13px] text-fog">
                    {p.template}
                    {p.share_slug ? ` · /p/${p.share_slug}` : ''}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  {p.status !== 'published' && (
                    <Button size="sm" variant="outline" onClick={() => publish(p.id)}>
                      <Rocket className="size-3.5" /> 게시하기
                    </Button>
                  )}
                  <Link href={`/editor/${p.id}`}>
                    <Button size="sm" variant="ghost"><Pencil className="size-3.5" /> 편집</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
          {projects.length === 0 && (
            <div className="rounded-2xl border border-dashed border-line px-6 py-12 text-center">
              <p className="font-semibold">아직 프로젝트가 없습니다</p>
              <p className="mt-1 text-sm text-fog">위에서 첫 프로젝트를 만들어보세요.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
