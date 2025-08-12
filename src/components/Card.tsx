import { HTMLAttributes } from 'react';
import { cn } from '../lib/utils';

export default function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('glass-card p-4', className)} {...props} />;
}

