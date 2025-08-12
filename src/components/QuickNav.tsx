"use client";
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function QuickNav() {
  const router = useRouter();
  const [value, setValue] = useState('');

  function go() {
    const input = value.trim();
    if (!input) return;
    if (/^https?:\/\//i.test(input)) {
      window.location.href = input;
      return;
    }
    const path = input.startsWith('/') ? input : `/${input}`;
    router.push(path);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      go();
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input
        className="w-64 rounded-md bg-white/5 border border-white/10 px-3 py-1.5 text-sm"
        placeholder="Type URL or /route and press Enter"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
      />
      <button onClick={go} className="px-3 py-1.5 rounded-md bg-white/10 border border-white/10 text-sm">Go</button>
    </div>
  );
}

