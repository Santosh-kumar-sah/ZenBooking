import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, Clock, Sparkles, Settings, ChevronLeft, LogOut } from 'lucide-react';
import { cn } from '../../utils/cn.js';
import { routes } from '../../constants/routes.js';
import { Button } from '../ui/Button.jsx';
import { useAuthStore } from '../../store/authStore.js';

const items = [
  { to: routes.dashboardHome, label: 'Dashboard', icon: LayoutDashboard },
  { to: routes.bookings, label: 'Bookings', icon: Calendar },
  { to: routes.slots, label: 'Slots', icon: Clock },
  { to: routes.insights, label: 'AI Insights', icon: Sparkles },
  { to: routes.settings, label: 'Settings', icon: Settings }
];

const Sidebar = ({ isCollapsed, onToggle }) => {
  const owner = useAuthStore((state) => state.owner);
  const logout = useAuthStore((state) => state.logout);
  const confirmLogout = () => {
    if (window.confirm('Log out of your account?')) {
      logout();
      window.location.href = '/login';
    }
  };

  return (
    <aside className={cn('fixed inset-y-0 left-0 z-40 flex h-full flex-col border-r border-white/10 bg-surface-950/95 px-3 py-4 backdrop-blur-xl transition-all duration-300', isCollapsed ? 'w-20' : 'w-72')}>
      <div className="mb-8 flex items-center justify-between gap-3 px-2">
        <div className={cn('flex items-center gap-3', isCollapsed && 'justify-center')}>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 font-black text-white">BA</div>
          {!isCollapsed ? <div><p className="font-semibold text-white">BookAI</p><p className="text-xs text-slate-400">{owner?.businessName || 'AI booking dashboard'}</p></div> : null}
        </div>
        <Button variant="ghost" size="sm" className={cn('hidden lg:inline-flex', isCollapsed && 'rotate-180')} onClick={onToggle} aria-label="Collapse sidebar">
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      <nav className="flex-1 space-y-2">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => cn('flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300', isActive ? 'border border-primary-500/30 bg-gradient-to-r from-primary-500/20 to-accent-500/20 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white', isCollapsed && 'justify-center px-3')}
            title={label}
          >
            <Icon className="h-5 w-5" />
            {!isCollapsed ? <span>{label}</span> : null}
          </NavLink>
        ))}
      </nav>
      <Button variant="ghost" className="mt-4 justify-start text-red-400 hover:bg-red-500/10 hover:text-red-300" onClick={confirmLogout} aria-label="Logout">
        <LogOut className="h-4 w-4" />
        {!isCollapsed ? <span>Logout</span> : null}
      </Button>
    </aside>
  );
};

export { Sidebar };