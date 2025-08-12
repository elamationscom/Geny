import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Page() {
  return (
    <main className="max-w-6xl mx-auto px-6 md:px-10 py-16">
      <header className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-brand-500 via-rose-500 to-emerald-500" />
          <span className="text-white/90 font-semibold text-lg tracking-tight">Geny</span>
        </Link>
        <nav className="flex items-center gap-3">
          <Link href="/app" className="px-3 py-1.5 rounded-md bg-white/10 border border-white/10 text-sm">Live demo</Link>
          <Link href="/auth" className="px-3 py-1.5 rounded-md bg-white text-slate-900 text-sm font-medium">Sign in</Link>
        </nav>
      </header>

      <section className="text-center mt-16">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
          The simplest way to schedule social posts with AI
        </h1>
        <p className="mt-4 text-white/70 max-w-2xl mx-auto">
          Connect Instagram, LinkedIn, and Facebook. Let AI draft posts. Approve and schedule in seconds. No clutter, no complexity.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link href="/auth" className="px-5 py-3 rounded-md bg-white text-slate-900 font-semibold inline-flex items-center gap-2">
            Get started free <ArrowRight size={18} />
          </Link>
          <Link href="/app" className="px-5 py-3 rounded-md bg-white/10 border border-white/10 text-white font-medium">
            Live demo
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4 mt-16">
        {['One-click social connections', 'AI-crafted captions in your voice', 'Clean calendar scheduling'].map((t) => (
          <div key={t} className="glass-card p-4 flex items-start gap-3">
            <CheckCircle2 className="text-brand-400 mt-0.5" />
            <div>
              <div className="font-semibold">{t}</div>
              <div className="text-sm text-white/70">So you can post more, with less effort.</div>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

