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
    <div className="min-h-screen bg-atelier-50 text-atelier-900 dark:bg-atelier-950 dark:text-atelier-100 flex flex-col lg:flex-row">
      {/* Desktop Sidebar: flows naturally side-by-side with main */}
      <div className="hidden lg:block shrink-0">
        <Sidebar
          isCollapsed={collapsed}
          onToggle={() => setCollapsed((v) => !v)}
          className="sticky top-0 h-screen"
        />
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-atelier-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <Sidebar
          isCollapsed={false}
          onToggle={() => setMobileOpen(false)}
          className="h-full shadow-2xl"
        />
      </div>

      {/* Main Content Area: flex-1 with min-w-0 guarantees zero overlap */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuToggle={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        <MiniFooter />
      </div>
    </div>
  );
};

export { DashboardLayout };
