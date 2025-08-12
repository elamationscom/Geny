import { TextareaHTMLAttributes } from 'react';
import { cn } from '../lib/utils';

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
};

export default function TextArea({ label, className, ...props }: Props) {
  return (
    <label className="block">
      {label ? <div className="mb-1 text-sm text-white/80">{label}</div> : null}
      <textarea
        className={cn(
          'w-full min-h-[120px] rounded-md bg-white/5 border border-white/10 px-3 py-2 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-white/20',
          className
        )}
        {...props}
      />
    </label>
  );
}

