export const dashboardNav = (active = 'dashboard') => `
  <aside class="dashboard-sidebar">
    <div style="padding: 0 1.5rem 2rem;">
      <a href="/dashboard" class="brand-logo brand-logo--sm" data-link>
        <img src="/logo.svg" alt="" class="brand-logo__img" width="28" height="28">
        <span class="brand-logo__text">OnePage</span>
      </a>
    </div>
    <nav class="dashboard-sidebar-nav">
      <a href="/dashboard" class="dashboard-nav-item ${active === 'dashboard' ? 'active' : ''}" data-link><i data-lucide="layout-dashboard"></i> Dashboard</a>
      <a href="/builder" class="dashboard-nav-item ${active === 'builder' ? 'active' : ''}" data-link><i data-lucide="edit-3"></i> Builder</a>
      <a href="/appearance" class="dashboard-nav-item ${active === 'appearance' ? 'active' : ''}" data-link><i data-lucide="palette"></i> Appearance</a>
      <a href="/analytics" class="dashboard-nav-item ${active === 'analytics' ? 'active' : ''}" data-link><i data-lucide="bar-chart-2"></i> Analytics</a>
      <a href="/settings" class="dashboard-nav-item ${active === 'settings' ? 'active' : ''}" data-link><i data-lucide="settings"></i> Settings</a>
      <a href="/admin" class="dashboard-nav-item ${active === 'admin' ? 'active' : ''}" data-link id="admin-nav" style="display:none;"><i data-lucide="shield"></i> Admin</a>
    </nav>
    <div style="margin-top: auto; padding: 1.5rem;">
      <button id="logout-btn" class="btn btn-ghost" style="width: 100%; justify-content: flex-start;"><i data-lucide="log-out"></i> Logout</button>
    </div>
  </aside>
`;

export const bindDashboardLayout = () => {
  lucide.createIcons();

  document.querySelectorAll('[data-link]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.appRouter.navigate(link.getAttribute('href'));
    });
  });

  const user = window.appState?.get('user');
  if (user?.role === 'admin') {
    const adminNav = document.getElementById('admin-nav');
    if (adminNav) adminNav.style.display = '';
  }

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      const { authApi } = await import('../api/auth.api.js');
      try {
        await authApi.logout();
        window.appRouter.navigate('/login');
      } catch {
        window.appRouter.navigate('/login');
      }
    });
  }
};
