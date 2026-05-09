import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { DashboardLayout, ProtectedRoute } from './components/layout/index.js';
import { LoginPage, RegisterPage } from './pages/auth/index.js';
import { DashboardHome, BookingsPage, SlotsPage, InsightsPage, SettingsPage } from './pages/dashboard/index.js';
import { PublicBookingPage, BookingConfirmPage } from './pages/public/index.js';
import { LandingPage } from './pages/LandingPage.jsx';
import { ContactPage } from './pages/ContactPage.jsx';
import { TermsPage } from './pages/TermsPage.jsx';
import { PrivacyPage } from './pages/PrivacyPage.jsx';
import { HelpPage } from './pages/HelpPage.jsx';
import { routes } from './constants/routes.js';
import { useThemeStore } from './store/themeStore.js';

const App = () => {
  const location = useLocation();
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path={routes.landing} element={<LandingPage />} />
        <Route path={routes.login} element={<LoginPage />} />
        <Route path={routes.register} element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={(
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          )}
        >
          <Route index element={<Navigate to={routes.dashboardHome} replace />} />
          <Route path="home" element={<DashboardHome />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="slots" element={<SlotsPage />} />
          <Route path="insights" element={<InsightsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/:ownerId/confirm" element={<BookingConfirmPage />} />
        <Route path="/:ownerId" element={<PublicBookingPage />} />
        <Route path="*" element={<Navigate to={routes.landing} replace />} />
      </Routes>
    </AnimatePresence>
  );
};

export { App };// Note: The above code is the main application component that sets up routing for the frontend. It includes protected routes for the dashboard and public routes for booking. The backend/server.js file has been updated to include a root route that returns the API status, and CORS configuration has been enhanced to allow multiple specified frontend URLs.
