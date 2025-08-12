import { ButtonHTMLAttributes } from 'react';
import { cn } from '../lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export default function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-60 disabled:pointer-events-none';
  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-brand-500 hover:bg-brand-400 text-white',
    secondary: 'bg-white text-slate-900 hover:bg-white/90',
    ghost: 'bg-transparent hover:bg-white/10 text-white',
  };

  return <button className={cn(base, variants[variant], className)} {...props} />;
}

