import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Portfolio3D - 3D 포트폴리오 플랫폼',
  description: '사진을 업로드하면 3D 포트폴리오로 변환하는 크리에이티브 플랫폼',
  keywords: ['3D 포트폴리오', '포트폴리오 메이커', '크리에이터', '3D 변환'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-ink text-mist">
        <div aria-hidden className="grain" />
        {children}
      </body>
    </html>
  );
}
