'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X, Box } from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from '@/components/ui/Button';

const LINKS = [
  { href: '/demo', label: '데모 체험' },
  { href: '/#how', label: '작동 방식' },
  { href: '/#templates', label: '템플릿' },
  { href: '/pricing', label: '요금제' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={clsx(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled ? 'border-b border-line bg-ink/85 backdrop-blur-xl' : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-white">
            <Box className="size-4.5" strokeWidth={2.5} />
          </span>
          Portfolio<span className="text-primary">3D</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-fog transition-colors hover:text-mist">
              {l.label}
            </Link>
          ))}
          <Link href="/auth/login">
            <Button variant="outline" size="sm">로그인</Button>
          </Link>
          <Link href="/auth/signup">
            <Button size="sm">무료로 시작</Button>
          </Link>
        </nav>

        <button
          className="grid size-10 place-items-center rounded-lg text-mist md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-line bg-panel/95 px-4 py-4 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-[15px] font-medium text-fog hover:bg-raised hover:text-mist"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              <Link href="/auth/login" className="flex-1" onClick={() => setOpen(false)}>
                <Button variant="outline" className="w-full">로그인</Button>
              </Link>
              <Link href="/auth/signup" className="flex-1" onClick={() => setOpen(false)}>
                <Button className="w-full">무료로 시작</Button>
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
