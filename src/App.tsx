import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Landing from './spa/Landing';
import Auth from './spa/Auth';
import Dashboard from './spa/Dashboard';
import Compose from './spa/Compose';
import Calendar from './spa/Calendar';
import Settings from './spa/Settings';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { useAppStore } from './lib/store';

function AppShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const isAuth = location.pathname.startsWith('/auth');

  if (isLanding || isAuth) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-12 gap-6 py-6">
        <div className="hidden md:block col-span-3 lg:col-span-2">
          <Sidebar />
        </div>
        <main className="col-span-12 md:col-span-9 lg:col-span-10">
          {children}
        </main>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuthed = useAppStore((s) => !!s.user);
  return isAuthed ? children : <Navigate to="/auth" replace />;
}

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/compose"
          element={
            <ProtectedRoute>
              <Compose />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <Calendar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}

