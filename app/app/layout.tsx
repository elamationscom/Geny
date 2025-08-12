import Link from 'next/link';
import dynamic from 'next/dynamic';

const QuickNav = dynamic(() => import('@/components/QuickNav'), { ssr: false });

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-6 w-6 rounded-md bg-gradient-to-tr from-brand-500 via-rose-500 to-emerald-500" />
            <span className="text-white/90 font-semibold">Geny</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-white/70">
            <Link href="/app" className="hover:text-white">Dashboard</Link>
            <Link href="/app/compose" className="hover:text-white">Compose</Link>
            <Link href="/app/calendar" className="hover:text-white">Calendar</Link>
            <Link href="/app/settings" className="hover:text-white">Settings</Link>
          </nav>
          <div className="hidden md:block">
            <QuickNav />
          </div>
        </div>
      </header>
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-6">
        {children}
      </section>
    </>
  );
}

