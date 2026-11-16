import { Menu, LogOut, ExternalLink } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { routes } from '../../constants/routes.js';
import { Button } from '../ui/Button.jsx';
import { Avatar } from '../ui/Avatar.jsx';
import { cn } from '../../utils/cn.js';
import { useAuthStore } from '../../store/authStore.js';
import ThemeToggle from './ThemeToggle.jsx';

const routeTitles = {
  '/dashboard/home': 'Studio Overview',
  '/dashboard/bookings': 'Appointments',
  '/dashboard/slots': 'Schedule & Slots',
  '/dashboard/insights': 'Studio Intelligence',
  '/dashboard/settings': 'Settings & Profile'
};

const Topbar = ({ onMenuToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const owner = useAuthStore((state) => state.owner);
  const logout = useAuthStore((state) => state.logout);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const title = routeTitles[location.pathname] || 'Studio Overview';

  const confirmLogout = () => {
    if (window.confirm('Sign out of your account?')) {
      logout();
      navigate(routes.login);
    }
  };

  return (
    <header className={cn('sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-atelier-200 bg-white/90 px-4 py-3.5 shadow-sm backdrop-blur-md dark:border-atelier-800 dark:bg-atelier-900/90 sm:px-6')}>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="lg:hidden p-1.5 h-9 w-9 text-atelier-700 dark:text-atelier-200" onClick={onMenuToggle} aria-label="Open sidebar">
          <Menu className="h-5 w-5" />
        </Button>
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-atelier-500 dark:text-atelier-400">{title}</span>
          <h1 className="font-editorial text-base sm:text-lg font-bold text-atelier-900 dark:text-white leading-tight">
            {greeting}, {owner?.name?.split(' ')[0] || 'Owner'}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {owner?._id && (
          <a
            href={`/${owner._id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-atelier-200 bg-atelier-50 px-3 py-1.5 text-xs font-medium text-atelier-700 hover:bg-atelier-100 dark:border-atelier-700 dark:bg-atelier-800 dark:text-atelier-200 transition-colors"
          >
            <span>Live Booking Page</span>
            <ExternalLink className="h-3.5 w-3.5 opacity-60" />
          </a>
        )}
        <ThemeToggle />
        <div className="flex items-center gap-2 pl-1 border-l border-atelier-200 dark:border-atelier-800">
          <Avatar name={owner?.name || 'Owner'} />
        </div>
      </div>
    </header>
  );
};

export { Topbar };
