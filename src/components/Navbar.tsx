import { Link, NavLink } from 'react-router-dom';
import Logo from '../assets/logo.svg?react';
import { useAppStore } from '../lib/store';

export default function Navbar() {
  const user = useAppStore((s) => s.user);
  const signOut = useAppStore((s) => s.signOut);

  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <Logo className="h-7 w-7" />
          <span className="text-white/90 font-semibold text-lg tracking-tight">Geny</span>
        </Link>
        {user ? (
          <nav className="hidden md:flex items-center gap-6 text-sm text-white/70">
            <NavLink to="/dashboard" className={({isActive}) => isActive ? 'text-white' : 'hover:text-white'}>Dashboard</NavLink>
            <NavLink to="/compose" className={({isActive}) => isActive ? 'text-white' : 'hover:text-white'}>Compose</NavLink>
            <NavLink to="/calendar" className={({isActive}) => isActive ? 'text-white' : 'hover:text-white'}>Calendar</NavLink>
            <NavLink to="/settings" className={({isActive}) => isActive ? 'text-white' : 'hover:text-white'}>Settings</NavLink>
          </nav>
        ) : null}

        <div className="flex items-center gap-3">
          {user ? (
            <button onClick={signOut} className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white text-sm">Sign out</button>
          ) : (
            <Link to="/auth" className="px-3 py-1.5 rounded-md bg-white text-slate-900 text-sm font-medium">Sign in</Link>
          )}
        </div>
      </div>
    </header>
  );
}

