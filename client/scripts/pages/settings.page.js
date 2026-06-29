import { profileApi } from '../api/profile.api.js';
import { dashboardNav, bindDashboardLayout } from '../utils/layout.js';
import { showToast } from '../utils/toast.js';

export const SettingsPage = {
  render: async () => `
    <div class="dashboard-layout">
      ${dashboardNav('settings')}
      <main class="dashboard-content">
        <div class="dashboard-header"><h2>Settings</h2></div>
        <div class="card" style="max-width: 500px;">
          <div class="card-body">
            <form id="settings-form">
              <div class="input-group">
                <label class="input-label" for="username">Username</label>
                <input class="input-field" id="username" required>
              </div>
              <div class="input-group">
                <label class="input-label" for="fullName">Full Name</label>
                <input class="input-field" id="fullName">
              </div>
              <div class="input-group">
                <label class="input-label" for="bio">Bio</label>
                <textarea class="input-field" id="bio" rows="3"></textarea>
              </div>
              <div class="input-group">
                <label class="input-label" for="slug">Page URL Slug</label>
                <input class="input-field" id="slug" pattern="[a-z0-9-]+" required>
                <small style="color:var(--color-text-secondary);">Your page: /p/your-slug</small>
              </div>
              <button type="submit" class="btn btn-primary" style="margin-top:1rem;">Save Settings</button>
            </form>
          </div>
        </div>
      </main>
    </div>
  `,

  afterRender: async () => {
    bindDashboardLayout();

    try {
      const res = await profileApi.getMyProfile();
      const { profile, page } = res.data;
      document.getElementById('username').value = profile.username || '';
      document.getElementById('fullName').value = profile.fullName || '';
      document.getElementById('bio').value = profile.bio || '';
      document.getElementById('slug').value = page?.slug || '';
    } catch {
      showToast('Could not load settings', 'error');
    }

    document.getElementById('settings-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        await profileApi.updateProfile({
          username: document.getElementById('username').value,
          fullName: document.getElementById('fullName').value,
          bio: document.getElementById('bio').value,
          slug: document.getElementById('slug').value,
        });
        showToast('Settings saved!', 'success');
      } catch (err) {
        showToast(err.message || 'Save failed', 'error');
      }
    });
  },
};
