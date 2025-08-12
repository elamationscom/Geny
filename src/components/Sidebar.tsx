import { NavLink } from 'react-router-dom';
import { CalendarDays, LayoutDashboard, PenSquare, Settings } from 'lucide-react';

export default function Sidebar() {
  const linkBase = 'flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/80 hover:bg-white/5 hover:text-white';
  const active = 'bg-white/10 text-white';

  return (
    <aside className="glass-card p-3">
      <nav className="space-y-1">
        <NavLink to="/dashboard" className={({isActive}) => `${linkBase} ${isActive ? active : ''}`}>
          <LayoutDashboard size={18} /> Dashboard
        </NavLink>
        <NavLink to="/compose" className={({isActive}) => `${linkBase} ${isActive ? active : ''}`}>
          <PenSquare size={18} /> Compose
        </NavLink>
        <NavLink to="/calendar" className={({isActive}) => `${linkBase} ${isActive ? active : ''}`}>
          <CalendarDays size={18} /> Calendar
        </NavLink>
        <NavLink to="/settings" className={({isActive}) => `${linkBase} ${isActive ? active : ''}`}>
          <Settings size={18} /> Settings
        </NavLink>
      </nav>
    </aside>
  );
}

