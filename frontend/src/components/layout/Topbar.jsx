import { Bell, Menu, LogOut } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Button } from '../ui/Button.jsx';
import { Avatar } from '../ui/Avatar.jsx';
import { cn } from '../../utils/cn.js';
import { useAuthStore } from '../../store/authStore.js';

const routeTitles = {
  '/dashboard/home': 'Dashboard',
  '/dashboard/bookings': 'Bookings',
  '/dashboard/slots': 'Slots',
  '/dashboard/insights': 'AI Insights',
  '/dashboard/settings': 'Settings'
};

const Topbar = ({ onMenuToggle }) => {
  const location = useLocation();
  const owner = useAuthStore((state) => state.owner);
  const logout = useAuthStore((state) => state.logout);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const title = routeTitles[location.pathname] || 'Dashboard';
  const confirmLogout = () => {
    if (window.confirm('Log out of your account?')) {
      logout();
      window.location.href = '/login';
    }
  };

  return (
    <header className={cn('sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-white/10 bg-surface-950/85 px-4 py-4 backdrop-blur-xl sm:px-6')}>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="lg:hidden" onClick={onMenuToggle} aria-label="Open sidebar">
          <Menu className="h-5 w-5" />
        </Button>
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <h1 className="text-lg font-semibold text-white">{greeting}, {owner?.name || 'Owner'}</h1>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>
        <Avatar name={owner?.name || 'Owner'} />
        <Button variant="ghost" size="sm" className="text-red-400 hover:bg-red-500/10 hover:text-red-300" onClick={confirmLogout} aria-label="Logout">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};

export { Topbar };