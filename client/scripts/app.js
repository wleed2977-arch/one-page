import { Router } from './core/router.js';
import { state } from './core/state.js';
import { refreshAuthUser, redirectAfterAuth } from './utils/authRedirect.js';

import { LandingPage } from './pages/landing.page.js';
import { LoginPage } from './pages/login.page.js';
import { RegisterPage } from './pages/register.page.js';
import { OnboardingPage } from './pages/onboarding.page.js';
import { DashboardPage } from './pages/dashboard.page.js';
import { BuilderPage } from './pages/builder.page.js';
import { AppearancePage } from './pages/appearance.page.js';
import { AnalyticsPage } from './pages/analytics.page.js';
import { SettingsPage } from './pages/settings.page.js';
import { AdminPage } from './pages/admin.page.js';
import { PublicPage } from './pages/public.page.js';

window.appState = state;

const requireAuth = async () => {
  try {
    await refreshAuthUser();
    return true;
  } catch {
    window.appRouter.navigate('/login');
    return false;
  }
};

const requireOnboarded = async () => {
  const ok = await requireAuth();
  if (!ok) return false;
  if (!state.get('user')?.profile?.onboardingCompleted) {
    window.appRouter.navigate('/onboarding');
    return false;
  }
  return true;
};

const requireNotOnboarded = async () => {
  const ok = await requireAuth();
  if (!ok) return false;
  if (state.get('user')?.profile?.onboardingCompleted) {
    window.appRouter.navigate('/dashboard');
    return false;
  }
  return true;
};

const requireGuest = async () => {
  try {
    const user = await refreshAuthUser();
    if (user?.profile?.onboardingCompleted) {
      window.appRouter.navigate('/dashboard');
    } else {
      window.appRouter.navigate('/onboarding');
    }
    return false;
  } catch {
    return true;
  }
};

const requireAdmin = async () => {
  const ok = await requireOnboarded();
  if (!ok) return false;
  if (state.get('user')?.role !== 'admin') {
    window.appRouter.navigate('/dashboard');
    return false;
  }
  return true;
};

const routes = [
  { path: '/', component: LandingPage, middleware: requireGuest },
  { path: '/login', component: LoginPage, middleware: requireGuest },
  { path: '/register', component: RegisterPage, middleware: requireGuest },
  { path: '/onboarding', component: OnboardingPage, middleware: requireNotOnboarded },
  { path: '/dashboard', component: DashboardPage, middleware: requireOnboarded },
  { path: '/builder', component: BuilderPage, middleware: requireOnboarded },
  { path: '/appearance', component: AppearancePage, middleware: requireOnboarded },
  { path: '/analytics', component: AnalyticsPage, middleware: requireOnboarded },
  { path: '/settings', component: SettingsPage, middleware: requireOnboarded },
  { path: '/admin', component: AdminPage, middleware: requireAdmin },
  { path: '/p/:slug', component: PublicPage },
];

const initApp = () => {
  window.appRouter = new Router(routes);
  window.appRouter.handleRoute();
};

document.addEventListener('DOMContentLoaded', initApp);
