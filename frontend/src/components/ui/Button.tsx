import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Button({ variant = 'primary', size = 'md', className, children, ...rest }: Props) {
  return (
    <button
      className={clsx(
        'inline-flex cursor-pointer items-center justify-center gap-2 font-semibold transition-all duration-200',
        'rounded-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        size === 'sm' && 'min-h-[36px] px-3.5 text-sm',
        size === 'md' && 'min-h-[44px] px-5 py-2.5 text-[15px]',
        size === 'lg' && 'min-h-[52px] px-8 py-3.5 text-base',
        variant === 'primary' && 'bg-primary-deep text-white hover:bg-indigo-700',
        variant === 'outline' && 'border border-line bg-transparent text-mist hover:border-primary hover:bg-raised',
        variant === 'ghost' && 'text-fog hover:bg-raised hover:text-mist',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
