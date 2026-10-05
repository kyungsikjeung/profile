import Link from 'next/link';
import { Box } from 'lucide-react';

const PRODUCT = [
  { href: '/demo', label: '데모 체험' },
  { href: '/pricing', label: '요금제' },
  { href: '/dashboard', label: '내 포트폴리오' },
];

const ACCOUNT = [
  { href: '/auth/login', label: '로그인' },
  { href: '/auth/signup', label: '회원가입' },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-panel">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:px-8">
        <div>
          <p className="flex items-center gap-2 text-lg font-extrabold">
            <span className="grid size-8 place-items-center rounded-lg bg-primary text-white">
              <Box className="size-4.5" strokeWidth={2.5} />
            </span>
            Portfolio<span className="text-primary">3D</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-fog">
            사진 한 장으로 만드는 몰입형 3D 포트폴리오. 크리에이터를 위한 가장 빠른 첫인상.
          </p>
        </div>
        <div>
          <p className="mb-3 text-sm font-bold tracking-wide text-mist">제품</p>
          <ul className="space-y-2 text-sm text-fog">
            {PRODUCT.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-mist">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-bold tracking-wide text-mist">계정</p>
          <ul className="space-y-2 text-sm text-fog">
            {ACCOUNT.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-mist">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-fog md:px-8">
          © 2026 Portfolio3D. All rights reserved. · 사이트에 소개된 크리에이터 프로필과 경력은 이해를 돕기 위한 예시입니다.
        </p>
      </div>
    </footer>
  );
}
