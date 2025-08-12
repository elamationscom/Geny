"use client";
import { useAppStore } from '@/lib/store';
import Link from 'next/link';

export default function SettingsPage() {
  const user = useAppStore((s) => s.user);
  const updateUser = useAppStore((s) => s.updateUser);
  if (!user) {
    return (
      <div className="glass-card p-4 space-y-3">
        <div className="font-medium">You're signed out</div>
        <div className="text-sm text-white/70">Sign in to edit your profile and settings.</div>
        <Link href="/auth" className="inline-block px-3 py-1.5 rounded-md bg-white text-slate-900 text-sm font-medium">Sign in</Link>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <div className="glass-card p-4 space-y-3">
        <div className="font-medium">Profile</div>
        <div className="grid md:grid-cols-2 gap-3">
          <label className="block">
            <div className="mb-1 text-sm text-white/80">Name</div>
            <input className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2" value={user.name} onChange={(e) => updateUser({ name: e.target.value })} />
          </label>
          <label className="block">
            <div className="mb-1 text-sm text-white/80">Email</div>
            <input className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2" value={user.email} onChange={(e) => updateUser({ email: e.target.value })} />
          </label>
        </div>
      </div>
      <div className="glass-card p-4 space-y-2">
        <div className="font-medium">Theme</div>
        <div className="text-sm text-white/60">Dark theme is enabled by default in this demo.</div>
      </div>
    </div>
  );
}

