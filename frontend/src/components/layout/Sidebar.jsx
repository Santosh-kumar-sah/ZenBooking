import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, Clock, Sparkles, Settings, ChevronLeft, LogOut, ExternalLink } from 'lucide-react';
import { cn } from '../../utils/cn.js';
import { routes } from '../../constants/routes.js';
import { Button } from '../ui/Button.jsx';
import { useAuthStore } from '../../store/authStore.js';

const items = [
  { to: routes.dashboardHome, label: 'Overview', icon: LayoutDashboard },
  { to: routes.bookings, label: 'Appointments', icon: Calendar },
  { to: routes.slots, label: 'Schedule & Slots', icon: Clock },
  { to: routes.insights, label: 'Studio Intelligence', icon: Sparkles },
  { to: routes.settings, label: 'Settings', icon: Settings }
];

const Sidebar = ({ isCollapsed, onToggle }) => {
  const navigate = useNavigate();
  const owner = useAuthStore((state) => state.owner);
  const logout = useAuthStore((state) => state.logout);

  const confirmLogout = () => {
    if (window.confirm('Sign out of your studio dashboard?')) {
      logout();
      navigate(routes.login);
    }
  };

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 flex h-full flex-col border-r border-atelier-200 bg-white px-3 py-5 shadow-sm transition-all duration-300 dark:border-atelier-800 dark:bg-atelier-900',
        isCollapsed ? 'w-20' : 'w-68'
      )}
    >
      {/* Brand header */}
      <div className="mb-6 flex items-center justify-between px-2">
        <div className={cn('flex items-center gap-2.5', isCollapsed && 'justify-center w-full')}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-atelier-900 font-editorial text-base font-bold text-white dark:bg-white dark:text-atelier-950">
            B
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="font-editorial text-base font-bold tracking-tight text-atelier-900 dark:text-white truncate">
                BookAI
              </p>
              <p className="text-[11px] text-atelier-500 dark:text-atelier-400 truncate">
                {owner?.businessName || 'Studio Management'}
              </p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className={cn('hidden lg:inline-flex h-8 w-8 p-0 text-atelier-400 hover:text-atelier-800', isCollapsed && 'rotate-180')}
          onClick={onToggle}
          aria-label="Collapse sidebar"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 space-y-1">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all duration-200 select-none',
                isActive
                  ? 'bg-primary-50 text-primary-800 font-semibold dark:bg-primary-950/50 dark:text-primary-300'
                  : 'text-atelier-600 hover:bg-atelier-100/70 hover:text-atelier-900 dark:text-atelier-400 dark:hover:bg-atelier-800 dark:hover:text-white',
                isCollapsed && 'justify-center px-2'
              )
            }
            title={label}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {!isCollapsed ? <span>{label}</span> : null}
          </NavLink>
        ))}
      </nav>

      {/* View Public Page Link */}
      {owner?._id && !isCollapsed && (
        <div className="mb-3 px-1">
          <a
            href={`/${owner._id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-xl border border-atelier-200 bg-atelier-50/80 px-3 py-2 text-xs font-medium text-atelier-700 hover:bg-atelier-100 dark:border-atelier-800 dark:bg-atelier-850 dark:text-atelier-300 transition-colors"
          >
            <span className="truncate">View Public Page</span>
            <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-60" />
          </a>
        </div>
      )}

      {/* Footer Profile & Logout */}
      <div className="border-t border-atelier-100 pt-3 dark:border-atelier-800">
        <div className={cn('flex items-center justify-between px-2', isCollapsed && 'justify-center')}>
          {!isCollapsed && (
            <div className="min-w-0 pr-2">
              <p className="text-xs font-semibold text-atelier-900 dark:text-white truncate">{owner?.name || 'Studio Owner'}</p>
              <p className="text-[10px] text-atelier-500 truncate">{owner?.email}</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-atelier-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
            onClick={confirmLogout}
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
};

export { Sidebar };
