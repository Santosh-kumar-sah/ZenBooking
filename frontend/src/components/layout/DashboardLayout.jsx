import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar.jsx';
import { Topbar } from './Topbar.jsx';
import { MiniFooter } from './Footer.jsx';
import { routes } from '../../constants/routes.js';
import { useAuthStore } from '../../store/authStore.js';
import { cn } from '../../utils/cn.js';

const DashboardLayout = () => {
  const token = useAuthStore((state) => state.token);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  if (!token) {
    return <Navigate to={routes.login} replace />;
  }

  return (
    <div className="min-h-screen bg-atelier-50 text-atelier-900 dark:bg-atelier-950 dark:text-atelier-100 lg:flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar isCollapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-atelier-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div className={cn('fixed inset-y-0 left-0 z-50 lg:hidden', mobileOpen ? 'block' : 'hidden')}>
        <Sidebar isCollapsed={false} onToggle={() => setMobileOpen(false)} />
      </div>

      <main className={collapsed ? 'lg:ml-20 flex flex-1 flex-col min-w-0' : 'lg:ml-68 flex flex-1 flex-col min-w-0'}>
        <Topbar onMenuToggle={() => setMobileOpen(true)} />
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 p-4 sm:p-6 lg:p-8"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
        <MiniFooter />
      </main>
    </div>
  );
};

export { DashboardLayout };
