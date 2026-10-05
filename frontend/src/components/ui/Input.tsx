import type { InputHTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ label, className, id, ...rest }: Props) {
  const inputId = id ?? label;
  return (
    <label htmlFor={inputId} className="flex flex-col gap-1.5 text-sm">
      <span className="font-semibold text-mist">{label}</span>
      <input
        id={inputId}
        className={clsx(
          'min-h-[44px] rounded-xl border border-line bg-panel px-4 py-3 text-mist',
          'placeholder:text-fog focus:border-primary focus:ring-2 focus:ring-primary/40 focus:outline-none',
          className,
        )}
        {...rest}
      />
    </label>
  );
}
