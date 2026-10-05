import type { ReactNode } from 'react';
import { clsx } from 'clsx';

interface Props {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: Props) {
  return (
    <div className={clsx('rounded-2xl border border-line bg-raised p-6 shadow-card', className)}>
      {children}
    </div>
  );
}
