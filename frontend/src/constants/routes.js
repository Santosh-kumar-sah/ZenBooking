const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  DASHBOARD_HOME: '/dashboard/home',
  DASHBOARD_BOOKINGS: '/dashboard/bookings',
  DASHBOARD_SLOTS: '/dashboard/slots',
  DASHBOARD_INSIGHTS: '/dashboard/insights',
  DASHBOARD_SETTINGS: '/dashboard/settings',
  DEMO: '/demo'
};

const routes = {
  landing: ROUTES.HOME,
  login: ROUTES.LOGIN,
  register: ROUTES.REGISTER,
  dashboard: ROUTES.DASHBOARD,
  dashboardHome: ROUTES.DASHBOARD_HOME,
  bookings: ROUTES.DASHBOARD_BOOKINGS,
  slots: ROUTES.DASHBOARD_SLOTS,
  insights: ROUTES.DASHBOARD_INSIGHTS,
  settings: ROUTES.DASHBOARD_SETTINGS,
  demo: ROUTES.DEMO
};

export { ROUTES, routes };