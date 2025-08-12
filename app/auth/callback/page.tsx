"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/ai';
import { useAppStore } from '@/lib/store';

export default function AuthCallback() {
  const router = useRouter();
  const signIn = useAppStore((s) => s.signIn);

  useEffect(() => {
    async function finalize() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const profileName = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Creator';
        signIn({ id: session.user.id, email: session.user.email || '', name: profileName });
        router.replace('/app');
      } else {
        router.replace('/auth');
      }
    }
    finalize();
  }, [router, signIn]);

  return (
    <main className="max-w-md mx-auto px-6 md:px-10 py-16">
      <div className="glass-card p-6 text-white/80">Completing sign-in…</div>
    </main>
  );
}

