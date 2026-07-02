import { pagesApi } from '../api/pages.api.js';
import { dashboardNav, bindDashboardLayout } from '../utils/layout.js';
import { showToast } from '../utils/toast.js';
import { applyScopedTheme } from '../utils/theme.js';
import { renderThemeCards } from '../utils/themes.config.js';
import { createWidget } from '../widgets/index.js';

export const AppearancePage = {
  selectedTheme: 'light',
  savedWidgets: [],

  render: async () => `
    <div class="dashboard-layout">
      ${dashboardNav('appearance')}
      <main class="dashboard-content">
        <div class="dashboard-header"><h2>Appearance</h2></div>
        <div class="appearance-layout">
          <div class="card appearance-themes-card">
            <div class="card-body">
              <h3 class="appearance-section-title">Theme</h3>
              <p class="appearance-section-desc">Pick a look for your public page.</p>
              <div class="onboarding-theme-grid" id="appearance-theme-grid">
                ${renderThemeCards('light')}
              </div>
              <button id="save-theme-btn" class="btn btn-primary" style="margin-top:1.25rem;">Save Theme</button>
            </div>
          </div>
          <div class="card appearance-preview-card">
            <div class="card-body">
              <h3 class="appearance-section-title">Preview</h3>
              <p class="appearance-section-desc">How your page will look to visitors.</p>
              <div class="appearance-preview" id="appearance-preview">
                <p class="appearance-preview-empty">Loading preview...</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,

  renderPreview() {
    const container = document.getElementById('appearance-preview');
    if (!container) return;
    container.innerHTML = '';
    applyScopedTheme(container, AppearancePage.selectedTheme);

    if (!AppearancePage.savedWidgets.length) {
      container.innerHTML = `
        <div class="empty-state appearance-preview-empty">
          <div class="empty-state__illustration" aria-hidden="true"></div>
          <h3>No widgets yet</h3>
          <p>Add your first widget in the Builder to see a live preview here.</p>
          <button type="button" class="btn btn-primary" id="appearance-go-builder">Open Builder</button>
        </div>`;
      document.getElementById('appearance-go-builder')?.addEventListener('click', () => {
        window.appRouter.navigate('/builder');
      });
      return;
    }

    AppearancePage.savedWidgets.forEach((w) => {
      const instance = createWidget(w.type, w.data);
      if (instance) {
        const el = instance.render();
        el.style.pointerEvents = 'none';
        container.appendChild(el);
      }
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
  },

  afterRender: async () => {
    bindDashboardLayout();

    try {
      const res = await pagesApi.getMyPage();
      AppearancePage.selectedTheme = res.data.page?.themeName || 'light';
      AppearancePage.savedWidgets = res.data.page?.widgets || [];
      document.getElementById('appearance-theme-grid').innerHTML = renderThemeCards(AppearancePage.selectedTheme);
    } catch {
      /* defaults */
    }

    AppearancePage.renderPreview();

    document.getElementById('appearance-theme-grid').addEventListener('click', (e) => {
      const card = e.target.closest('[data-theme]');
      if (!card) return;
      AppearancePage.selectedTheme = card.dataset.theme;
      applyScopedTheme(container, AppearancePage.selectedTheme);
      document.querySelectorAll('#appearance-theme-grid [data-theme]').forEach((c) => c.classList.remove('selected'));
      card.classList.add('selected');
      AppearancePage.renderPreview();
    });

    document.getElementById('save-theme-btn').addEventListener('click', async () => {
      try {
        await pagesApi.updatePage({ theme: AppearancePage.selectedTheme });
        showToast('Theme saved!', 'success');
      } catch (err) {
        showToast(err.message || 'Failed to save', 'error');
      }
    });
  },
};
