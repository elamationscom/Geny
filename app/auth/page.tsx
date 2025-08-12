"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const signIn = useAppStore((s) => s.signIn);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !name) return;
    signIn({ id: crypto.randomUUID(), email, name });
    router.push('/app');
  }

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
      },
    });
  }

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const profileName = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Creator';
        signIn({ id: session.user.id, email: session.user.email || '', name: profileName });
        router.push('/app');
      }
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router, signIn]);

  return (
    <main className="max-w-md mx-auto px-6 md:px-10 py-16">
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-4">Welcome to Geny</h2>
        <p className="text-sm text-white/70 mb-6">Sign in to start composing and scheduling posts. No password needed for this demo.</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block">
            <div className="mb-1 text-sm text-white/80">Name</div>
            <input className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="block">
            <div className="mb-1 text-sm text-white/80">Email</div>
            <input type="email" className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <button className="w-full px-4 py-2 rounded-md bg-white text-slate-900 font-medium" type="submit">Continue</button>
          <button type="button" onClick={signInWithGoogle} className="w-full px-4 py-2 rounded-md bg-white/10 border border-white/10 text-white font-medium">Continue with Google</button>
        </form>
      </div>
    </main>
  );
}

