import { analyticsApi } from '../api/analytics.api.js';
import { pagesApi } from '../api/pages.api.js';
import { dashboardNav, bindDashboardLayout } from '../utils/layout.js';
import { showToast } from '../utils/toast.js';
import { THEMES } from '../utils/themes.config.js';

const getThemeLabel = (id) => THEMES.find((t) => t.id === id)?.label || id;

export const DashboardPage = {
  render: async () => `
    <div class="dashboard-layout">
      ${dashboardNav('dashboard')}
      <main class="dashboard-content">
        <div class="dashboard-header">
          <h2>Welcome back</h2>
          <button class="btn btn-primary" id="go-to-builder"><i data-lucide="edit-3"></i> Edit Page</button>
        </div>
        <div class="dashboard-stats-grid" id="dashboard-stats">
          <div class="card"><div class="card-body"><p class="dashboard-stat-label">Loading...</p></div></div>
        </div>
        <div class="card dashboard-link-card">
          <div class="card-body">
            <h3 class="dashboard-card-title">Your Public Page</h3>
            <div id="public-link-wrap" class="dashboard-link-row">
              <p id="public-link" class="dashboard-link-text">Loading...</p>
              <div id="public-link-actions" class="dashboard-link-actions" hidden>
                <button type="button" class="btn btn-secondary btn-sm" id="copy-link-btn">
                  <i data-lucide="copy"></i> Copy
                </button>
                <button type="button" class="btn btn-secondary btn-sm" id="view-page-btn">
                  <i data-lucide="external-link"></i> View
                </button>
              </div>
            </div>
            <p id="dashboard-theme-info" class="dashboard-theme-info"></p>
          </div>
        </div>
      </main>
    </div>
  `,

  afterRender: async () => {
    bindDashboardLayout();

    if (sessionStorage.getItem('onboardingJustFinished')) {
      sessionStorage.removeItem('onboardingJustFinished');
      showToast('Your page is live!', 'success');
    }

    document.getElementById('go-to-builder').addEventListener('click', () => {
      window.appRouter.navigate('/builder');
    });

    let stats = { totalViews: 0, widgetCount: 0 };
    let slug = '';
    let themeName = 'light';

    try {
      const [analyticsRes, pageRes] = await Promise.all([
        analyticsApi.getMyAnalytics(),
        pagesApi.getMyPage(),
      ]);
      stats = analyticsRes.data || stats;
      slug = pageRes.data?.page?.slug || '';
      themeName = pageRes.data?.page?.themeName || 'light';
    } catch (err) {
      showToast(err.message || 'Could not load dashboard data', 'error');
    }

    const statsEl = document.getElementById('dashboard-stats');
    if (!statsEl) return;

    statsEl.innerHTML = `
      <div class="card"><div class="card-body">
        <p class="dashboard-stat-label">Total Views (7 days)</p>
        <h3>${stats.totalViews}</h3>
      </div></div>
      <div class="card"><div class="card-body">
        <p class="dashboard-stat-label">Widgets Active</p>
        <h3>${stats.widgetCount}</h3>
      </div></div>
      <div class="card"><div class="card-body">
        <p class="dashboard-stat-label">Current Theme</p>
        <h3>${getThemeLabel(themeName)}</h3>
      </div></div>
    `;

    const linkEl = document.getElementById('public-link');
    const actionsEl = document.getElementById('public-link-actions');
    const themeInfoEl = document.getElementById('dashboard-theme-info');

    if (slug) {
      const publicPath = `/p/${slug}`;
      const fullUrl = `${window.location.origin}${publicPath}`;
      linkEl.innerHTML = `<a href="${publicPath}" data-link class="dashboard-link-url">${publicPath}</a>`;
      linkEl.querySelector('[data-link]').addEventListener('click', (e) => {
        e.preventDefault();
        window.appRouter.navigate(publicPath);
      });
      actionsEl.hidden = false;

      document.getElementById('copy-link-btn').addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(fullUrl);
          showToast('Link copied!', 'success');
        } catch {
          showToast('Could not copy link', 'error');
        }
      });

      document.getElementById('view-page-btn').addEventListener('click', () => {
        window.open(publicPath, '_blank', 'noopener');
      });

      themeInfoEl.innerHTML = `Theme: <strong>${getThemeLabel(themeName)}</strong> — <a href="/appearance" data-link>Change appearance</a>`;
      themeInfoEl.querySelector('[data-link]').addEventListener('click', (e) => {
        e.preventDefault();
        window.appRouter.navigate('/appearance');
      });
    } else {
      linkEl.textContent = 'Create your page in the Builder.';
      themeInfoEl.textContent = '';
    }

    if (typeof lucide !== 'undefined') lucide.createIcons();
  },
};
