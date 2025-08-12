"use client";
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import SocialAccountCard from '@/components/SocialAccountCard';

export default function AppHome() {
  const scheduled = useAppStore((s) => s.scheduledPosts);
  const user = useAppStore((s) => s.user);
  const accounts = useAppStore((s) => s.accounts);
  const connect = useAppStore((s) => s.connectAccount);
  const disconnect = useAppStore((s) => s.disconnectAccount);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-white/70 text-sm">Welcome back</div>
          <div className="text-2xl font-semibold">{user?.name ?? 'Creator'}</div>
        </div>
        <Link href="/app/compose" className="px-4 py-2 rounded-md bg-brand-500 hover:bg-brand-400 text-white">New post</Link>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass-card p-4">
          <div className="text-white/70 text-sm">Upcoming posts</div>
          <div className="text-2xl font-semibold">{scheduled.length}</div>
        </div>
        <div className="glass-card p-4">
          <div className="text-white/80 text-sm">Status</div>
          <div className="mt-2 text-white/60 text-sm">All systems operational.</div>
        </div>
      </div>
      <div className="glass-card p-4">
        <div className="font-medium mb-2">Quick links</div>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/app/compose" className="px-3 py-1.5 rounded-md bg-white/10 border border-white/10">Compose</Link>
          <Link href="/app/calendar" className="px-3 py-1.5 rounded-md bg-white/10 border border-white/10">Calendar</Link>
          <Link href="/app/settings" className="px-3 py-1.5 rounded-md bg-white/10 border border-white/10">Settings</Link>
        </div>
      </div>
      <div className="glass-card p-4">
        <div className="font-medium mb-3">Connect your social accounts</div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {accounts.map((acc) => (
            <SocialAccountCard key={acc.platform} account={acc} onConnect={connect} onDisconnect={disconnect} />
          ))}
        </div>
      </div>
    </div>
  );
}

